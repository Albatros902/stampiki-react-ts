import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

let db: Database.Database;

export function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "stampiki.db");

  db = new Database(dbPath);

  db.pragma("foreign_keys = ON");

  // !! Удалить, когда надо проверить БД
  if (process.env.NODE_ENV === "development") {
    db.exec(`DROP TABLE IF EXISTS coupons`);
    db.exec(`DROP TABLE IF EXISTS coupon_cells`);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cell_count INTEGER NOT NULL,
      image_path TEXT,
      access_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stamps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      svg TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupon_cells (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      stamp_id INTEGER NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (stamp_id) REFERENCES stamps(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS coupon_tags (
      coupon_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (coupon_id, tag_id),
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  console.log("Database initialized");
}

export function getDB() {
  return db;
}
