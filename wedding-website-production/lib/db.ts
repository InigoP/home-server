import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "wedding.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
    welcome_party TEXT CHECK (welcome_party IN ('yes', 'no')),
    dietary TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
