/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, contextBridge } from "electron";

/* ---------------- IPC wrapper ---------------- */

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel: string, listener: (...args: any[]) => void) {
    return ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  off(channel: string, listener: (...args: any[]) => void) {
    return ipcRenderer.off(channel, listener);
  },
  send(channel: string, ...args: any[]) {
    return ipcRenderer.send(channel, ...args);
  },
  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args);
  },
});

/* ---------------- Coupons API ---------------- */

contextBridge.exposeInMainWorld("couponsAPI", {
  getAll: () => ipcRenderer.invoke("coupons:getAll"),

  create: (title: string, cell_count: number, code: string, image?: string) =>
    ipcRenderer.invoke("coupons:create", title, cell_count, code, image),

  update: (id: number, title: string, cell_count: number) =>
    ipcRenderer.invoke("coupons:update", id, title, cell_count),

  updateStatus: (id: number, status: "active" | "ready") =>
    ipcRenderer.invoke("coupons:updateStatus", id, status),

  delete: (id: number) => ipcRenderer.invoke("coupons:delete", id),

  verifyAccess: (id: number, code: string) =>
    ipcRenderer.invoke("coupons:verifyAccess", id, code),

  use: (id: number) => ipcRenderer.invoke("coupons:use", id),
});

/* ---------------- Coupon Cells API ---------------- */

contextBridge.exposeInMainWorld("couponCellsAPI", {
  getByCouponId: (coupon_id: number) =>
    ipcRenderer.invoke("couponCells:getByCouponId", coupon_id),

  create: (coupon_id: number, index: number) =>
    ipcRenderer.invoke("couponCells:create", coupon_id, index),

  delete: (id: number) => ipcRenderer.invoke("couponCells:delete", id),

  setStamp: (cell_id: number, stamp_id: number) =>
    ipcRenderer.invoke("couponCells:setStamp", cell_id, stamp_id),

  clearStamp: (cell_id: number) =>
    ipcRenderer.invoke("couponCells:clearStamp", cell_id),
});

/* ---------------- Tags API ---------------- */

contextBridge.exposeInMainWorld("tagsAPI", {
  getAll: () => ipcRenderer.invoke("tags:getAll"),

  create: (title: string) => ipcRenderer.invoke("tags:create", title),

  delete: (id: number) => ipcRenderer.invoke("tags:delete", id),
});
