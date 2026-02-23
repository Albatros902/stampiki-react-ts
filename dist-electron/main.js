var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, ipcMain, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
let db;
function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "stampiki.db");
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
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
function getDB() {
  return db;
}
class StampsRepository {
  constructor() {
    __publicField(this, "db", getDB());
  }
  getAll() {
    const stmt = this.db.prepare(
      "SELECT * FROM stamps ORDER BY created_at DESC"
    );
    return stmt.all();
  }
  getById(id) {
    const stmt = this.db.prepare("SELECT * FROM stamps WHERE id = ?");
    return stmt.get(id) || null;
  }
  // Создать новый штампик
  create(title, svg) {
    const stmt = this.db.prepare(
      "INSERT INTO stamps (title, svg) VALUES (?, ?)"
    );
    const info = stmt.run(title, svg);
    return {
      id: info.lastInsertRowid,
      title,
      svg,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  // Обновить существующий штампик
  update(id, title, svg) {
    const stmt = this.db.prepare(
      "UPDATE stamps SET title = ?, svg = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    const info = stmt.run(title, svg, id);
    return info.changes > 0;
  }
  // Удалить штампик
  delete(id) {
    const stmt = this.db.prepare("DELETE FROM stamps WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  }
}
class CouponsRepository {
  constructor() {
    __publicField(this, "db", getDB());
  }
  getAll() {
    return this.db.prepare(
      `
      SELECT * FROM coupons
      ORDER BY created_at DESC
    `
    ).all();
  }
  getById(id) {
    const coupon = this.db.prepare(`SELECT * FROM coupons WHERE id = ?`).get(id);
    return coupon ?? null;
  }
  create(title, cell_count, access_code, image_path) {
    const stmt = this.db.prepare(`
    INSERT INTO coupons
    (title, cell_count, access_code, image_path, status)
    VALUES (?, ?, ?, ?, 'active')
  `);
    const result = stmt.run(title, cell_count, access_code, image_path ?? null);
    return this.getById(result.lastInsertRowid);
  }
  update(id, title, cell_count) {
    this.db.prepare(
      `
      UPDATE coupons
      SET title = ?, cell_count = ?
      WHERE id = ?
    `
    ).run(title, cell_count, id);
    return this.getById(id);
  }
  delete(id) {
    this.db.prepare(
      `
      DELETE FROM coupons WHERE id = ?
    `
    ).run(id);
    return { success: true };
  }
  updateStatus(id, status) {
    return this.db.prepare(
      `
      UPDATE coupons
      SET status = ?
      WHERE id = ?
    `
    ).run(status, id);
  }
  verifyAccess(id, code) {
    const coupon = this.getById(id);
    if (!coupon) return false;
    return coupon.access_code === code;
  }
}
class CouponCellsRepository {
  constructor() {
    __publicField(this, "db", getDB());
  }
  getByCouponId(coupon_id) {
    return this.db.prepare(
      `
        SELECT * FROM coupon_cells
        WHERE coupon_id = ?
        ORDER BY position ASC
      `
    ).all(coupon_id);
  }
  create(coupon_id, position) {
    return this.db.prepare(
      `
        INSERT INTO coupon_cells (coupon_id, position, stamp_id)
        VALUES (?, ?, NULL)
      `
    ).run(coupon_id, position);
  }
  setStamp(cell_id, stamp_id) {
    return this.db.prepare(
      `
        UPDATE coupon_cells
        SET stamp_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    ).run(stamp_id, cell_id);
  }
  clearStamp(cell_id) {
    return this.db.prepare(
      `
        UPDATE coupon_cells
        SET stamp_id = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    ).run(cell_id);
  }
  delete(id) {
    return this.db.prepare(`DELETE FROM coupon_cells WHERE id = ?`).run(id);
  }
}
class TagsRepository {
  constructor() {
    __publicField(this, "db", getDB());
  }
  getAll() {
    const stmt = this.db.prepare("SELECT * FROM tags ORDER BY title ASC");
    return stmt.all();
  }
  getById(id) {
    const stmt = this.db.prepare("SELECT * FROM tags WHERE id = ?");
    return stmt.get(id) || null;
  }
  create(title) {
    const stmt = this.db.prepare("INSERT INTO tags (title) VALUES (?)");
    const info = stmt.run(title);
    return { id: info.lastInsertRowid, title };
  }
  delete(id) {
    const stmt = this.db.prepare("DELETE FROM tags WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  }
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let win = null;
let stampsRepo;
let couponsRepo;
let couponCellsRepo;
let tagsRepo;
function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.loadURL(process.env.VITE_DEV_SERVER_URL);
}
app.whenReady().then(() => {
  initDatabase();
  stampsRepo = new StampsRepository();
  couponsRepo = new CouponsRepository();
  couponCellsRepo = new CouponCellsRepository();
  tagsRepo = new TagsRepository();
  ipcMain.handle("coupons:getAll", () => couponsRepo.getAll());
  ipcMain.handle(
    "coupons:create",
    (_e, title, cell_count, access_code, image_path) => {
      const coupon = couponsRepo.create(
        title,
        cell_count,
        access_code,
        image_path
      );
      for (let i = 0; i < cell_count; i++) {
        couponCellsRepo.create(coupon.id, i);
      }
      return coupon;
    }
  );
  ipcMain.handle("stamps:getAll", () => stampsRepo.getAll());
  ipcMain.handle("tags:getAll", () => tagsRepo.getAll());
  ipcMain.handle(
    "couponCells:getByCouponId",
    (_e, id) => couponCellsRepo.getByCouponId(id)
  );
  ipcMain.handle(
    "coupons:update",
    (_e, id, title, cell_count) => couponsRepo.update(id, title, cell_count)
  );
  ipcMain.handle("coupons:delete", (_e, id) => couponsRepo.delete(id));
  ipcMain.handle(
    "couponCells:create",
    (_e, coupon_id, index) => couponCellsRepo.create(coupon_id, index)
  );
  ipcMain.handle(
    "couponCells:setStamp",
    (_e, cell_id, stamp_id) => couponCellsRepo.setStamp(cell_id, stamp_id)
  );
  ipcMain.handle(
    "couponCells:clearStamp",
    (_e, cell_id) => couponCellsRepo.clearStamp(cell_id)
  );
  ipcMain.handle("couponCells:delete", (_e, id) => couponCellsRepo.delete(id));
  ipcMain.handle(
    "coupons:updateStatus",
    (_e, id, status) => couponsRepo.updateStatus(id, status)
  );
  ipcMain.handle("coupons:use", (_e, id) => {
    couponsRepo.delete(id);
    return { success: true };
  });
  ipcMain.handle(
    "coupons:verifyAccess",
    (_e, id, code) => couponsRepo.verifyAccess(id, code)
  );
  createWindow();
});
