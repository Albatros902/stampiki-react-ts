"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel, listener) {
    return electron.ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  off(channel, listener) {
    return electron.ipcRenderer.off(channel, listener);
  },
  send(channel, ...args) {
    return electron.ipcRenderer.send(channel, ...args);
  },
  invoke(channel, ...args) {
    return electron.ipcRenderer.invoke(channel, ...args);
  }
});
electron.contextBridge.exposeInMainWorld("couponsAPI", {
  getAll: () => electron.ipcRenderer.invoke("coupons:getAll"),
  create: (title, cell_count, code, image) => electron.ipcRenderer.invoke("coupons:create", title, cell_count, code, image),
  update: (id, title, cell_count) => electron.ipcRenderer.invoke("coupons:update", id, title, cell_count),
  updateStatus: (id, status) => electron.ipcRenderer.invoke("coupons:updateStatus", id, status),
  delete: (id) => electron.ipcRenderer.invoke("coupons:delete", id),
  verifyAccess: (id, code) => electron.ipcRenderer.invoke("coupons:verifyAccess", id, code),
  use: (id) => electron.ipcRenderer.invoke("coupons:use", id)
});
electron.contextBridge.exposeInMainWorld("couponCellsAPI", {
  getByCouponId: (coupon_id) => electron.ipcRenderer.invoke("couponCells:getByCouponId", coupon_id),
  create: (coupon_id, index) => electron.ipcRenderer.invoke("couponCells:create", coupon_id, index),
  delete: (id) => electron.ipcRenderer.invoke("couponCells:delete", id),
  setStamp: (cell_id, stamp_id) => electron.ipcRenderer.invoke("couponCells:setStamp", cell_id, stamp_id),
  clearStamp: (cell_id) => electron.ipcRenderer.invoke("couponCells:clearStamp", cell_id)
});
electron.contextBridge.exposeInMainWorld("tagsAPI", {
  getAll: () => electron.ipcRenderer.invoke("tags:getAll"),
  create: (title) => electron.ipcRenderer.invoke("tags:create", title),
  delete: (id) => electron.ipcRenderer.invoke("tags:delete", id)
});
