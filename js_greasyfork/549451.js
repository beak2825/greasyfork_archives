// ==UserScript==
// @name         Proxmox VE 7: Auto-select Backup Storage (panel-scope, configurable)
// @namespace    hollen9.com
// @version      1.0
// @description  You can set the Storage name to be applied in the userscript menu. If not set or left blank, it will not intervene. Change @match pattern for your enviroment.
// @match        https://node1.example.com:8006/*
// @match        https://node2.example.com:8006/*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549451/Proxmox%20VE%207%3A%20Auto-select%20Backup%20Storage%20%28panel-scope%2C%20configurable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549451/Proxmox%20VE%207%3A%20Auto-select%20Backup%20Storage%20%28panel-scope%2C%20configurable%29.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const SCAN_MS = 700;
  const getExt = () => unsafeWindow?.Ext || window.Ext;
 
  // 設定以「主機為範圍」：每個 host 可設定不同預設 Storage
  const SCOPE_KEY = `pve:autoStorage:host:${location.host}`;
 
  // 讀寫目標 Storage 名稱（空字串或未設定 = 不介入）
  const getTarget = () => (GM_getValue(SCOPE_KEY, '') || '').trim();
  const setTarget = (val) => GM_setValue(SCOPE_KEY, (val || '').trim());
 
  // ===== userscript addon 功能表 =====
  GM_registerMenuCommand('Set default Backup Storage (this host)', async () => {
    try {
      const current = getTarget();
      // 嘗試抓取目前畫面上 StorageSelector 的可選項目，方便提示
      const suggestions = collectStorageNames();
      const hint = suggestions.length ? `\n\nDetected storages:\n- ${suggestions.join('\n- ')}` : '';
      const v = prompt(
        `Enter the Storage name to auto-select on Backup tab for host:\n${location.host}\n` +
        `(leave blank to disable)\n\nCurrent: ${current || '(disabled)'}${hint}`,
        current
      );
      if (v === null) return; // cancel
      setTarget(v);
      alert(v.trim() ? `Set to "${v.trim()}" for ${location.host}` : `Disabled for ${location.host}`);
    } catch (e) {
      alert('Failed to set value: ' + e);
    }
  });
 
  GM_registerMenuCommand('Clear default (disable for this host)', () => {
    setTarget('');
    alert(`Disabled for ${location.host}`);
  });
 
  GM_registerMenuCommand('Show current setting (this host)', () => {
    const cur = getTarget();
    alert(`Host: ${location.host}\nCurrent default storage: ${cur || '(disabled)'}`);
  });
 
  // 嘗試收集目前頁面上能看到的 Storage 名稱（僅用於提示）
  function collectStorageNames() {
    const Ext = getExt();
    if (!Ext?.ComponentQuery) return [];
    const list = []
      .concat(Ext.ComponentQuery.query('pveStorageSelector'))
      .concat(Ext.ComponentQuery.query('PVE\\\.form\\\.StorageSelector'))
      .concat(Ext.ComponentQuery.query('combo[name=storage]'));
    const names = new Set();
    list.forEach(c => {
      try {
        const store = c.getStore?.() || c.store;
        const valueField = c.valueField || 'storage';
        store?.each?.(rec => {
          const v = rec.get?.(valueField);
          if (typeof v === 'string' && v) names.add(v);
        });
      } catch (_) {}
    });
    return [...names].sort();
  }
 
  // ===== Backup 分頁偵測 & 套用 =====
 
  function findBackupPanelOf(cmp) {
    if (!cmp?.up) return null;
    try {
      let p = cmp.up('panel[itemId=backup]');
      if (p) return p;
      p = cmp.up('panel[title=Backup]');
      if (p?.isVisible?.()) return p;
    } catch (_) {}
    return null;
  }
 
  function findVisibleStorageSelectors() {
    const Ext = getExt();
    if (!Ext?.ComponentQuery) return [];
    let list = []
      .concat(Ext.ComponentQuery.query('pveStorageSelector'))
      .concat(Ext.ComponentQuery.query('PVE\\\.form\\\.StorageSelector'))
      .concat(Ext.ComponentQuery.query('combo[name=storage]'));
    const seen = new Set();
    return list.filter(c => {
      if (!c) return false;
      const id = c.getId?.() || c.$className + Math.random();
      if (seen.has(id)) return false;
      seen.add(id);
      if (!c.isVisible?.() || c.disabled || c.readOnly) return false;
      if (c.$className === 'PVE.form.StorageSelector') return true;
      if (typeof c.fieldLabel === 'string' && c.fieldLabel.trim() === 'Storage') return true;
      return false;
    });
  }
 
  function applyOnceInBackupPanel() {
    const TARGET_STORAGE = getTarget(); // 每次 loop 都讀，允許隨時修改設定
    if (!TARGET_STORAGE) return;        // 未設定：不介入
 
    const selectors = findVisibleStorageSelectors();
    if (!selectors.length) return;
 
    selectors.forEach(combo => {
      const panel = findBackupPanelOf(combo);
      if (!panel) return;                 // 只在 Backup 分頁內動作
      if (panel.__pve_applied_once) return;
      if (panel.__pve_user_modified) return;
 
      const store = combo.getStore?.() || combo.store;
      if (!store) return;
 
      const doSet = () => {
        const valueField = combo.valueField || 'storage';
        const rec = store.findRecord
          ? store.findRecord(valueField, TARGET_STORAGE, 0, false, true, true)
          : null;
        if (!rec) return; // 清單裡沒有該名稱 -> 不介入
 
        const cur = combo.getValue?.();
        if (cur !== TARGET_STORAGE) {
          combo.setValue(TARGET_STORAGE);
        }
 
        panel.__pve_applied_once = true;
 
        if (!combo.__bind_change) {
          combo.__bind_change = true;
          combo.on?.('change', () => { panel.__pve_user_modified = true; }, { single: false });
        }
      };
 
      if (typeof store.isLoaded === 'function' && !store.isLoaded()) {
        store.on?.('load', () => setTimeout(doSet, 0), { single: true });
      } else {
        doSet();
      }
    });
  }
 
  function loop() {
    const Ext = getExt();
    if (!Ext) return;
    applyOnceInBackupPanel();
  }
 
  setInterval(loop, SCAN_MS);
  document.addEventListener('visibilitychange', loop);
  window.addEventListener('focus', loop);
  loop();
})();