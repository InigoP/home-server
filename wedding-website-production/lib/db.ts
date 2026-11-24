import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { runMigrations } from "./migrations";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "wedding.db"));

runMigrations(db);

export default db;
