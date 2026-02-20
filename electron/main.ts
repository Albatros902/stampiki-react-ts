import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initDatabase } from "./db/database";
import { StampsRepository } from "./db/stamps.repository";
import { CouponsRepository } from "./db/coupons.repository";
import { CouponCellsRepository } from "./db/couponCells.repository";
import { TagsRepository } from "./db/tags.repository";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let win: BrowserWindow | null = null;

// ⚠️ НЕ создаём репозитории здесь
let stampsRepo: StampsRepository;
let couponsRepo: CouponsRepository;
let couponCellsRepo: CouponCellsRepository;
let tagsRepo: TagsRepository;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.loadURL(process.env.VITE_DEV_SERVER_URL!);
}

app.whenReady().then(() => {
  // 1️⃣ СНАЧАЛА инициализация базы
  initDatabase();

  // 2️⃣ Потом создаём репозитории
  stampsRepo = new StampsRepository();
  couponsRepo = new CouponsRepository();
  couponCellsRepo = new CouponCellsRepository();
  tagsRepo = new TagsRepository();

  // 3️⃣ Потом регистрируем IPC
  ipcMain.handle("coupons:getAll", () => couponsRepo.getAll());
  ipcMain.handle(
    "coupons:create",
    (_e, title, cell_count, access_code, image_path) =>
      couponsRepo.create(title, cell_count, access_code, image_path),
  );

  ipcMain.handle("stamps:getAll", () => stampsRepo.getAll());
  ipcMain.handle("tags:getAll", () => tagsRepo.getAll());

  ipcMain.handle("couponCells:getByCouponId", (e, id) =>
    couponCellsRepo.getByCouponId(id),
  );

  ipcMain.handle("coupons:update", (_e, id, title, cell_count) =>
    couponsRepo.update(id, title, cell_count),
  );

  ipcMain.handle("coupons:delete", (_e, id) => couponsRepo.delete(id));

  ipcMain.handle("couponCells:create", (_e, coupon_id, index) =>
    couponCellsRepo.create(coupon_id, index),
  );

  // 4️⃣ И только потом создаём окно
  createWindow();
});
