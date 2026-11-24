import type Database from "better-sqlite3";

type Migration = {
  version: number;
  description: string;
  up: (db: Database.Database) => void;
};

const migrations: Migration[] = [
  {
    version: 1,
    description: "initial schema",
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS rsvps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          welcome_party TEXT CHECK (welcome_party IN ('yes', 'no')),
          wedding TEXT CHECK (wedding IN ('yes', 'no')),
          dietary TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS guests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          group_id INTEGER,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS addresses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          address1 TEXT NOT NULL,
          address2 TEXT,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          zip TEXT NOT NULL,
          country TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
    },
  },
  {
    version: 2,
    description: "migrate rsvps to new schema (wedding column, first/last name)",
    up: (db) => {
      const cols = db.prepare("PRAGMA table_info(rsvps)").all() as { name: string }[];
      const has = (col: string) => cols.some((c) => c.name === col);

      // Already on new schema
      if (has("wedding")) return;

      db.exec(`
        CREATE TABLE rsvps_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          welcome_party TEXT CHECK (welcome_party IN ('yes', 'no')),
          wedding TEXT CHECK (wedding IN ('yes', 'no')),
          dietary TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      if (has("attending")) {
        const firstNameExpr = has("first_name")
          ? `COALESCE(NULLIF(first_name, ''), SUBSTR(name, 1, MAX(0, INSTR(name, ' ') - 1)))`
          : `SUBSTR(name, 1, MAX(0, INSTR(name, ' ') - 1))`;
        const lastNameExpr = has("last_name")
          ? `COALESCE(NULLIF(last_name, ''), SUBSTR(name, INSTR(name, ' ') + 1))`
          : `SUBSTR(name, INSTR(name, ' ') + 1)`;

        db.exec(`
          INSERT INTO rsvps_new (first_name, last_name, welcome_party, wedding, dietary, created_at)
          SELECT
            ${firstNameExpr},
            ${lastNameExpr},
            welcome_party,
            attending,
            dietary,
            created_at
          FROM rsvps
          WHERE name IS NOT NULL AND TRIM(name) != ''
        `);
      }

      db.exec(`DROP TABLE rsvps`);
      db.exec(`ALTER TABLE rsvps_new RENAME TO rsvps`);
    },
  },
];

export function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const migration of migrations) {
    const applied = db.prepare("SELECT 1 FROM schema_migrations WHERE version = ?").get(migration.version);
    if (!applied) {
      console.log(`[db] migration ${migration.version}: ${migration.description}`);
      db.transaction(() => {
        migration.up(db);
        db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(migration.version);
      })();
    }
  }
}
