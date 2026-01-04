// ==UserScript==
// @name         POS 批量结算助手 V6.16.11 (性能优化版)
// @namespace    playbox-electronics
// @version      6.16.11
// @description  性能修复：1. 将递归逻辑改为 while 循环，彻底解决处理多单后浏览器卡顿/崩溃问题；2. 增加日志自动清理功能（保留最新100条）；3. 优化 DOM 监听器频率。
// @match        *://*.odoo.com/pos/*
// @match        *://*.odoo.sh/pos/*
// @match        *://*/pos/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557361/POS%20%E6%89%B9%E9%87%8F%E7%BB%93%E7%AE%97%E5%8A%A9%E6%89%8B%20V61611%20%28%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557361/POS%20%E6%89%B9%E9%87%8F%E7%BB%93%E7%AE%97%E5%8A%A9%E6%89%8B%20V61611%20%28%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =========================
  // 0. 用户配置区
  // =========================
  const STORAGE_KEY = "pb_pos_data_v2";

  let CONFIG = {
      MaxPages: 1,       // 默认翻页数
      SearchDelay: 1000, // 搜索缓冲
      ActionInterval: 100 // 动作检测频率
  };

  let UI_STATE = {
      width: 360,
      height: 600
  };

  console.log(`🚀 POS 批量结算助手 V6.16.11 (性能优化版) 已加载`);

  // =========================
  // 1. 样式 (CSS)
  // =========================
  const css = `
    #pb-container { position: fixed; top: 100px; right: 20px; left: auto; z-index: 99999; font-family: -apple-system, sans-serif; user-select: none; width: 48px; height: 48px; pointer-events: none; }
    .pb-float-ball { position: absolute; right: 0; top: 0; width: 48px; height: 48px; background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%); border-radius: 50%; box-shadow: 0 4px 15px rgba(113, 75, 103, 0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; border: 2px solid rgba(255,255,255,0.3); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center center; pointer-events: auto; z-index: 20; }
    .pb-float-ball:hover { transform: scale(1.1); }
    .pb-panel { position: absolute; top: 0; right: 60px; width: 360px; height: 600px; min-width: 320px; min-height: 450px; background: rgba(255, 255, 255, 0.98); border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; pointer-events: auto; transform-origin: top right; transform: scale(0); opacity: 0; visibility: hidden; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s; z-index: 10; }
    .pb-panel.active { transform: scale(1); opacity: 1; visibility: visible; }
    .pb-resize-handle { position: absolute; bottom: 2px; left: 2px; width: 16px; height: 16px; cursor: sw-resize; z-index: 50; opacity: 0.4; transition: all 0.2s; background-image: linear-gradient(45deg, transparent 45%, #64748b 45%, #64748b 55%, transparent 55%), linear-gradient(45deg, transparent 20%, #64748b 20%, #64748b 30%, transparent 30%); border-bottom-left-radius: 6px; }
    .pb-resize-handle:hover { opacity: 1; background-image: linear-gradient(45deg, transparent 45%, #8e44ad 45%, #8e44ad 55%, transparent 55%), linear-gradient(45deg, transparent 20%, #8e44ad 20%, #8e44ad 30%, transparent 30%); transform: scale(1.2); }
    .pb-header { background: linear-gradient(to right, #8e44ad, #9b59b6); color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; cursor: grab; flex-shrink: 0; }
    .pb-title { font-weight: 700; font-size: 14px; }
    .pb-min-btn { width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; font-weight: bold; }
    .pb-min-btn:hover { background: rgba(255,255,255,0.4); }
    .pb-body { padding: 10px; background: #f8fafc; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .pb-card { background: white; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; padding: 10px; flex-shrink: 0; }
    .pb-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #64748b; align-items: center; }
    .pb-val { font-weight: 600; color: #1e293b; font-family: monospace; }
    .pb-val.highlight { color: #8e44ad; font-weight: 800; }
    .pb-settings-row { display: flex; justify-content: flex-end; align-items: center; margin-top: 6px; border-top: 1px dashed #eee; padding-top: 6px; }
    .pb-input-group { display: flex; align-items: center; background: #f1f5f9; border-radius: 12px; padding: 2px 8px; border: 1px solid #e2e8f0; }
    .pb-input-label { font-size: 11px; color: #64748b; margin-right: 4px; }
    .pb-input { width: 24px; border: none; background: transparent; text-align: center; font-weight: bold; color: #8e44ad; font-size: 12px; outline: none; }
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .pb-sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px dashed #eee; }
    .pb-sec-title { font-size: 12px; font-weight: 700; color: #475569; }
    .pb-sec-count { background: #f1f5f9; color: #64748b; padding: 1px 6px; border-radius: 10px; font-size: 11px; font-weight: bold; }
    .pb-link-btn { font-size: 11px; cursor: pointer; color: #6366f1; text-decoration: underline; }
    .pb-tag-container { display: flex; flex-wrap: wrap; gap: 5px; max-height: 60px; overflow-y: auto; }
    .pb-tag { display: inline-flex; align-items: center; font-size: 11px; padding: 2px 6px; border-radius: 4px; cursor: default; border: 1px solid transparent; }
    .pb-tag-cart { background: #eff6ff; color: #1d4ed8; border-color: #dbeafe; }
    .pb-tag-done { background: #f0fdf4; color: #15803d; border-color: #dcfce7; }
    .pb-tag-fail { background: #fef2f2; color: #b91c1c; border-color: #fee2e2; }
    .pb-tag-del { margin-left: 4px; cursor: pointer; font-weight: bold; opacity: 0.6; }
    .pb-tag-del:hover { opacity: 1; color: #ef4444; }
    .pb-empty-tip { font-size: 11px; color: #cbd5e1; font-style: italic; width: 100%; text-align: center; }
    .pb-log-window { background: #1e293b; color: #4ade80; font-family: monospace; font-size: 11px; padding: 8px; border-radius: 4px; flex: 1; min-height: 80px; overflow-y: auto; border: 1px solid #334155; line-height: 1.4; }
    .pb-log-line { border-bottom: 1px solid #334155; padding-bottom: 1px; }
    .pb-log-time { color: #94a3b8; margin-right: 6px; font-size: 10px; }
    .pb-controls { display: flex; gap: 10px; flex-shrink: 0; }
    .pb-btn { flex: 1; padding: 8px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .pb-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .pb-btn-pause { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
    .pb-btn-stop { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
    .modal-content.o_select_create_dialog_content table thead tr th:first-child, .modal-content.o_select_create_dialog_content table tbody tr td:first-child { position: relative !important; padding-left: 40px !important; }
    .pb-check-wrapper { position: absolute; left: 0; top: 0; bottom: 0; width: 35px; display: flex; align-items: center; justify-content: center; z-index: 10; border-right: 1px solid #f1f5f9; cursor: default; }
    .pb-check-wrapper.pb-in-pool { background-color: #eff6ff !important; border-right: 3px solid #6366f1; }
    .pb-check-wrapper.pb-is-done { background-color: #ecfdf5 !important; border-right: 3px solid #10b981; }
    .pb-batch-select { width: 16px; height: 16px; accent-color: #8e44ad; cursor: pointer; margin: 0 !important; }
    .pb-btn-add { background: #64748b !important; color:white !important; margin-left: 10px !important; border:none !important; border-radius: 4px !important; padding: 6px 12px !important; }
    .pb-start-btn { background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%) !important; border: none !important; color: #fff !important; margin-left: 8px !important; border-radius: 4px !important; padding: 6px 16px !important; box-shadow: 0 4px 6px rgba(142, 68, 173, 0.25) !important; }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // =========================
  // 2. 状态管理
  // =========================
  const State = {
      isRunning: false,
      isPaused: false,
      queue: [],
      savedMap: {},
      failedMap: {},
      historyMap: {},
      currentProcessing: null,
      activeTrackingNumber: "--",
      lastTrackingNumber: null,
      activeLineCount: 0,
      globalDoneSet: new Set(),
      lastCheckedIndex: null
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function getCurrentSaved() {
      const key = State.activeTrackingNumber;
      if (!key || key.includes("--")) return [];
      return State.savedMap[key] || [];
  }

  function getCurrentFailed() {
      const key = State.activeTrackingNumber;
      if (!key || key.includes("--")) return [];
      return State.failedMap[key] || [];
  }

  function saveState() {
      const data = {
          historyMap: State.historyMap,
          savedMap: State.savedMap,
          failedMap: State.failedMap,
          config: CONFIG
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadState() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
          try {
              const data = JSON.parse(raw);
              if (data.historyMap) State.historyMap = data.historyMap;
              if (data.savedMap && !Array.isArray(data.savedMap)) State.savedMap = data.savedMap;
              if (data.failedMap && !Array.isArray(data.failedMap)) State.failedMap = data.failedMap;
              Object.values(State.historyMap).forEach(list => {
                  list.forEach(item => State.globalDoneSet.add(item));
              });
              if (data.config) CONFIG.MaxPages = data.config.MaxPages || 1;
              uiLog("💾 已恢复隔离数据");
          } catch (e) {
              console.error("Load state failed", e);
              uiLog("⚠️ 状态恢复失败", "error");
          }
      }
  }

  // [优化] 限制日志条数，防止DOM无限增长
  function uiLog(msg, type = "normal") {
      const box = document.getElementById("ui-log-box");
      if (box) {
          // 清理旧日志：超过100条时删除最早的
          if (box.children.length > 100) {
              box.removeChild(box.firstChild);
          }

          const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
          const color = type === "error" ? "#ef4444" : "#4ade80";
          const line = document.createElement("div");
          line.className = "pb-log-line";
          line.style.color = color;
          line.innerHTML = `<span class="pb-log-time">${time}</span>${msg}`;
          box.appendChild(line);
          box.scrollTop = box.scrollHeight;
      }
  }

  async function waitFor(conditionCallback, timeout = 3000) {
      const start = Date.now();
      while ((Date.now() - start) < timeout) {
          if (conditionCallback()) return true;
          if (document.querySelector(".popup-error, .o_error_dialog")) return "BLOCKED";
          if (!State.isRunning) return false;
          await sleep(CONFIG.ActionInterval);
      }
      return false;
  }

  // =========================
  // 3. 核心逻辑 (Map 操作)
  // =========================

  function recordImport(backendOrderName) {
      updateActiveOrderInfo();
      const key = State.activeTrackingNumber;
      if (!key || key.includes("--") || key === "未选单" || !backendOrderName) return;

      if (!State.historyMap[key]) State.historyMap[key] = [];
      if (!State.historyMap[key].includes(backendOrderName)) {
          State.historyMap[key].push(backendOrderName);
      }
      State.globalDoneSet.add(backendOrderName);

      if (State.savedMap[key]) {
          State.savedMap[key] = State.savedMap[key].filter(n => n !== backendOrderName);
      }
      if (State.failedMap[key]) {
          State.failedMap[key] = State.failedMap[key].filter(n => n !== backendOrderName);
      }

      saveState();
      updateUI();
  }

  function recordFail(orderName) {
      const key = State.activeTrackingNumber;
      if (!key || key.includes("--")) return;

      if (!State.failedMap[key]) State.failedMap[key] = [];
      if (!State.failedMap[key].includes(orderName)) {
          State.failedMap[key].push(orderName);
      }
      if (State.savedMap[key]) {
          State.savedMap[key] = State.savedMap[key].filter(n => n !== orderName);
      }
      saveState();
      updateUI();
  }

  function retryFailed() {
      const key = State.activeTrackingNumber;
      const list = getCurrentFailed();
      if (list.length === 0) return;

      State.failedMap[key] = [];
      State.queue = [...list, ...State.queue];
      saveState();
      updateUI();

      if (!State.isRunning) {
          State.isRunning = true;
          State.isPaused = false;
          // [优化] 调用新的循环启动入口
          processQueueLoop();
      }
      uiLog(`🔄 重试 ${list.length} 个订单`);
  }

  function deleteImport(orderName) {
      const key = State.activeTrackingNumber;
      if (State.historyMap[key]) {
          State.historyMap[key] = State.historyMap[key].filter(n => n !== orderName);
          saveState();
          updateUI();
          debouncedEnhance();
      }
  }

  function removeFromCart(orderName) {
      const key = State.activeTrackingNumber;
      if (State.savedMap[key]) {
          State.savedMap[key] = State.savedMap[key].filter(item => item !== orderName);
          saveState();
          updateUI();
          const dialog = document.querySelector(".modal-content.o_select_create_dialog_content");
          if (dialog) {
              const cb = Array.from(dialog.querySelectorAll(".pb-item-cb")).find(c => c.dataset.order === orderName);
              if (cb) {
                  cb.checked = false;
                  const wrapper = cb.closest(".pb-check-wrapper");
                  if (wrapper) wrapper.classList.remove("pb-in-pool");
              }
          }
      }
  }

  function removeFromFail(orderName) {
      const key = State.activeTrackingNumber;
      if (State.failedMap[key]) {
          State.failedMap[key] = State.failedMap[key].filter(item => item !== orderName);
          saveState();
          updateUI();
      }
  }

  function getBtnElement(keyword, isStrict = false) {
      const btns = Array.from(document.querySelectorAll("button, .btn, .button"));
      for (let i = btns.length - 1; i >= 0; i--) {
          const btn = btns[i];
          const text = btn.textContent.trim();
          if (text.includes("取消") || text.includes("Cancel") || text.includes("Trash") || text.includes("退款") || btn.querySelector(".fa-trash") || btn.querySelector(".fa-undo")) continue;
          if (btn.classList.contains("pb-start-btn") || btn.classList.contains("pb-btn-add") || btn.disabled) continue;
          if (btn.offsetParent) {
              if (text.includes(keyword)) return btn;
              if (!isStrict && (keyword === "订单" || keyword === "Order") && btn.querySelector(".fa-link")) return btn;
          }
      }
      return null;
  }

  async function ensureSearchCleared() {
      const searchInput = document.querySelector(".o_searchview_input");
      if (!searchInput) return;
      if (searchInput.value.trim() !== "" || document.querySelector(".o_searchview_icon.o_searchview_reset")) {
          const closeIcon = document.querySelector(".o_searchview_icon.o_searchview_reset");
          if (closeIcon && closeIcon.offsetParent) closeIcon.click();
          searchInput.value = "";
          searchInput.dispatchEvent(new Event("input", { bubbles: true }));
          searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, keyCode: 13 }));
          await sleep(500);
      }
  }

  async function performSearch(name) {
      const searchInput = document.querySelector(".o_searchview_input");
      if (!searchInput) return false;
      uiLog(`🔍 搜索: ${name}`);
      await ensureSearchCleared();
      searchInput.value = name;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(200);
      const dropdown = await waitFor(() => document.querySelector(".o_searchview_autocomplete"), 2000);
      if (dropdown && dropdown !== "BLOCKED") {
          const firstItem = document.querySelector(".o_searchview_autocomplete .o-dropdown-item");
          if (firstItem) firstItem.click();
          else searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, keyCode: 13 }));
      } else {
          searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, keyCode: 13 }));
      }

      await waitFor(() => {
          const rows = document.querySelectorAll(".modal-content.o_select_create_dialog_content tbody tr.o_data_row");
          for (const tr of rows) {
              if (tr.innerText.includes(name)) return true;
          }
          return false;
      }, CONFIG.SearchDelay + 1000);

      return true;
  }

  async function ensureListOpen() {
      if (document.querySelector(".modal-content.o_select_create_dialog_content")) return true;
      let target = Array.from(document.querySelectorAll(".control-button, .ticket-button"))
          .find(b => ["报价", "订单", "Quotation", "Order"].some(k => b.textContent.includes(k)));
      if (!target) target = document.querySelector(".control-button .fa-list-alt")?.closest(".control-button");
      if (target) {
          target.click();
          await sleep(1000);
      } else {
          const moreBtn = document.querySelector(".more-btn, .more-menu-button");
          if (moreBtn && moreBtn.offsetParent) {
              moreBtn.click();
              await sleep(500);
              const orderBtn = getBtnElement("报价") || getBtnElement("订单") || getBtnElement("Order");
              if (orderBtn) {
                  orderBtn.click();
                  await sleep(1000);
              }
          }
      }
      return !!document.querySelector(".modal-content.o_select_create_dialog_content");
  }

  async function tryFlipPage() {
      const nextBtn = document.querySelector(".o_pager_next");
      if (!nextBtn || nextBtn.disabled || nextBtn.classList.contains('disabled')) return false;
      const firstRow = document.querySelector(".modal-content.o_select_create_dialog_content tbody tr.o_data_row");
      const beforeText = firstRow ? firstRow.innerText : "";
      uiLog("📄 翻页中...");
      nextBtn.click();
      const flipped = await waitFor(() => {
          const newRow = document.querySelector(".modal-content.o_select_create_dialog_content tbody tr.o_data_row");
          const newText = newRow ? newRow.innerText : "";
          return newRow && newText !== beforeText;
      }, 3000);
      if (!flipped) uiLog("⚠️ 翻页超时", "error");
      return flipped;
  }

  // =========================
  // [重要优化] 核心循环重构
  // =========================
  // 将递归函数调用改为 while 循环，防止 Promise 链无限增长导致的内存泄漏
  async function processQueueLoop() {
      if (!State.isRunning) return;

      while (State.queue.length > 0 && State.isRunning) {
          // 暂停检测
          if (State.isPaused) {
              await sleep(1000);
              continue;
          }

          const currentName = State.queue.shift();
          State.currentProcessing = currentName;
          updateUI();
          uiLog(`▶️ 处理: ${currentName}`);

          try {
              updateActiveOrderInfo();

              // 1. 确保列表打开
              if (!await ensureListOpen()) {
                  uiLog("重试打开列表...");
                  await sleep(1000);
                  if (!await ensureListOpen()) {
                      uiLog("❌ 跳过: 列表打不开", "error");
                      recordFail(currentName);
                      continue; // 替换为 continue，进入下一次循环
                  }
              }

              await waitFor(() => document.querySelectorAll(".modal-content.o_select_create_dialog_content tbody tr.o_data_row").length > 0, 3000);
              await sleep(200);

              const findRow = () => {
                  const rows = document.querySelectorAll(".modal-content.o_select_create_dialog_content tbody tr.o_data_row");
                  for (const tr of rows) {
                      const nameCell = tr.querySelector('td[name="name"]');
                      if (nameCell && nameCell.textContent.trim() === currentName) return nameCell;
                  }
                  return null;
              };

              let targetRow = findRow();

              // 2. 查找逻辑
              if (!targetRow) {
                  await ensureSearchCleared();
                  targetRow = findRow();

                  if (!targetRow) {
                      for (let i = 0; i < CONFIG.MaxPages; i++) {
                          if (await tryFlipPage()) {
                              targetRow = findRow();
                              if (targetRow) break;
                          } else { break; }
                      }
                  }

                  if (!targetRow) {
                      if (await performSearch(currentName)) {
                          targetRow = findRow();
                      }
                  }
              } else {
                  uiLog("⚡ 视野内命中");
              }

              // 3. 点击与结算逻辑
              if (targetRow) {
                  if (!targetRow.isConnected) {
                      targetRow = findRow(); // DOM 失效重查
                  }

                  if (targetRow) {
                      targetRow.click();
                      uiLog("等待结算按钮...");
                      const btnFound = await waitFor(() => getBtnElement("结算") || getBtnElement("Settle"), 3000);

                      if (btnFound && btnFound !== "BLOCKED") {
                          const finalBtn = getBtnElement("结算") || getBtnElement("Settle");
                          if (finalBtn) {
                              finalBtn.click();
                              uiLog("⚡ 已点击结算");

                              const closed = await waitFor(() => !document.querySelector(".modal-content.o_select_create_dialog_content"), 8000);
                              if (closed === "BLOCKED") {
                                  uiLog("❌ 错误弹窗阻断", "error");
                                  recordFail(currentName);
                                  State.isRunning = false;
                                  break; // 遇到不可恢复错误，退出循环
                              }
                              await sleep(500);
                              recordImport(currentName);
                          }
                      } else {
                          uiLog("⚠️ 无结算按钮", "error");
                          recordFail(currentName);
                          const backBtn = document.querySelector(".o_form_button_cancel") || document.querySelector(".breadcrumb-item a");
                          if (backBtn) backBtn.click();
                          await sleep(500);
                      }
                  }
              } else {
                  uiLog(`❌ 未找到订单`, "error");
                  recordFail(currentName);
              }

              // 显式释放变量引用，辅助GC
              targetRow = null;

          } catch (e) {
              console.error(e);
              recordFail(currentName);
          }

          // 循环末尾稍微缓冲一下，让UI线程喘口气
          await sleep(100);
      }

      // 循环结束
      if (State.queue.length === 0) {
          State.isRunning = false;
          State.currentProcessing = null;
          updateUI();
          uiLog("✅✅ 全部完成");
      }
  }

  // =========================
  // 4. UI 构建
  // =========================
  function updateActiveOrderInfo() {
      try {
          let newTracking = "无单号";
          let linesCount = 0;

          if (typeof window.posmodel !== 'undefined') {
              const order = window.posmodel.selectedOrder;
              if (order) {
                  newTracking = order.tracking_number || order.name || "无单号";
                  linesCount = (order.lines || order.orderlines || []).length;
              } else {
                  newTracking = "未选单";
              }
          } else {
              newTracking = "加载中...";
          }

          State.activeLineCount = linesCount;

          if (State.lastTrackingNumber !== null && newTracking !== State.lastTrackingNumber) {
              if (newTracking !== "加载中..." && newTracking !== "未选单") {
                  setTimeout(() => debouncedEnhance(), 300);
              }
          }

          State.activeTrackingNumber = newTracking;
          State.lastTrackingNumber = newTracking;

      } catch (e) { State.activeTrackingNumber = "Error"; }
      updateUI();
  }

  function createUI() {
      const oldContainer = document.getElementById("pb-container");
      if (oldContainer) oldContainer.remove();

      const html = `
      <div id="pb-container">
        <div id="pb-panel" class="pb-panel" style="width:${UI_STATE.width}px; height:${UI_STATE.height}px;">
          <div class="pb-header">
            <span class="pb-title">POS 结算助手 Pro (V6.16.11)</span>
            <div class="pb-min-btn" title="收起">×</div>
          </div>
          <div class="pb-body">
            <div class="pb-card">
                <div class="pb-row"><span>前台单号</span><span class="pb-val highlight" id="ui-tracking">--</span></div>
                <div class="pb-row"><span>行数</span><span class="pb-val" id="ui-lines">0</span></div>
                <div class="pb-settings-row">
                    <div class="pb-input-group">
                        <span class="pb-input-label">翻页上限</span>
                        <input id="inp-max-pages" type="number" class="pb-input" value="${CONFIG.MaxPages}" min="1" max="20">
                    </div>
                </div>
            </div>

            <div class="pb-card" style="border-left: 3px solid #6366f1; flex: 0 0 auto;">
                <div class="pb-sec-head">
                    <span class="pb-sec-title">🛒 待办 (<span id="ui-cart-count">0</span>)</span>
                    <span id="btn-clear-cart" class="pb-link-btn">清空</span>
                </div>
                <div id="ui-cart-list" class="pb-tag-container"><span class="pb-empty-tip">暂无待办</span></div>
            </div>

            <div class="pb-card" style="border-left: 3px solid #ef4444; display:none;" id="ui-fail-card">
                <div class="pb-sec-head">
                    <span class="pb-sec-title" style="color:#b91c1c">❌ 失败 (<span id="ui-fail-count">0</span>)</span>
                    <span id="btn-retry-fail" class="pb-link-btn" style="color:#ef4444; font-weight:bold;">🔄 重试全部</span>
                </div>
                <div id="ui-fail-list" class="pb-tag-container"></div>
            </div>

            <div class="pb-card" style="border-left: 3px solid #22c55e; flex: 0 0 auto;">
                <div class="pb-sec-head">
                    <span class="pb-sec-title">✅ 已完成 (当前单) <span id="ui-done-count" class="pb-sec-count">0</span></span>
                    <span id="btn-clear-history" class="pb-link-btn" style="color:#047857;">清除</span>
                </div>
                <div id="ui-done-list" class="pb-tag-container"><span class="pb-empty-tip">暂无记录</span></div>
            </div>

            <div id="ui-log-box" class="pb-log-window"></div>

            <div class="pb-controls">
              <button id="btn-pause" class="pb-btn pb-btn-pause" disabled>⏸ 暂停</button>
              <button id="btn-stop" class="pb-btn pb-btn-stop" disabled>⏹ 停止</button>
            </div>
          </div>
          <div class="pb-resize-handle" id="pb-resize-handle"></div>
        </div>
        <div id="pb-ball" class="pb-float-ball" title="点击展开">🚀</div>
      </div>
    `;
      document.body.insertAdjacentHTML("beforeend", html);
      initUIEvents();

      const panel = document.getElementById("pb-panel");
      if (panel) panel.classList.remove("active");

      document.getElementById("inp-max-pages").onchange = (e) => {
          let val = parseInt(e.target.value);
          if (val > 0) {
              CONFIG.MaxPages = val;
              saveState();
          }
      };

      uiLog("V6.16.11 (性能优化版) 就绪");
  }

  function toggleView(show) {
      const ball = document.getElementById("pb-ball");
      const panel = document.getElementById("pb-panel");
      if (show) {
          panel.classList.add("active");
          ball.style.transform = "scale(0)";
          ball.style.opacity = "0";
      } else {
          panel.classList.remove("active");
          ball.style.transform = "scale(1)";
          ball.style.opacity = "1";
      }
  }

  function updateUI() {
      const elTracking = document.getElementById("ui-tracking");
      if (elTracking) elTracking.textContent = State.activeTrackingNumber;
      const elLines = document.getElementById("ui-lines");
      if (elLines) elLines.textContent = State.activeLineCount;

      const savedList = getCurrentSaved();
      const failedList = getCurrentFailed();
      const historyList = State.historyMap[State.activeTrackingNumber] || [];

      document.getElementById("ui-cart-count").textContent = savedList.length;
      const cartList = document.getElementById("ui-cart-list");
      if (cartList) {
          if (savedList.length === 0) {
              cartList.innerHTML = '<span class="pb-empty-tip">暂无待办</span>';
          } else {
              cartList.innerHTML = savedList.map(name => `
                <span class="pb-tag pb-tag-cart">${name}<span class="pb-tag-del" data-action="del-cart" data-id="${name}">×</span></span>
            `).join("");
          }
      }

      const failCard = document.getElementById("ui-fail-card");
      const failCount = document.getElementById("ui-fail-count");
      const failList = document.getElementById("ui-fail-list");
      if (failedList.length > 0) {
          failCard.style.display = "block";
          failCount.textContent = failedList.length;
          failList.innerHTML = failedList.map(name => `
            <span class="pb-tag pb-tag-fail">${name}<span class="pb-tag-del" data-action="del-fail" data-id="${name}">×</span></span>
        `).join("");
      } else {
          failCard.style.display = "none";
      }

      document.getElementById("ui-done-count").textContent = historyList.length;
      const doneList = document.getElementById("ui-done-list");
      if (doneList) {
          if (historyList.length === 0) {
              doneList.innerHTML = '<span class="pb-empty-tip">暂无记录</span>';
          } else {
              doneList.innerHTML = historyList.map(name => `
                <span class="pb-tag pb-tag-done">${name}<span class="pb-tag-del" data-action="del-hist" data-id="${name}">×</span></span>
            `).join("");
          }
      }

      // [优化] 移除旧的 listener 绑定，防止闭包堆积 (这里虽然是替换，但配合 innerHTML 重绘能强制GC)
      const bindDel = (sel, fn) => {
          document.querySelectorAll(sel).forEach(btn => btn.onclick = (e) => { e.stopPropagation(); fn(e.target.dataset.id); });
      };
      bindDel('[data-action="del-cart"]', removeFromCart);
      bindDel('[data-action="del-hist"]', deleteImport);
      bindDel('[data-action="del-fail"]', removeFromFail);

      const btnPause = document.getElementById("btn-pause");
      const btnStop = document.getElementById("btn-stop");
      if (btnPause && btnStop) {
          if (State.isRunning) {
              btnPause.disabled = false;
              btnStop.disabled = false;
              btnPause.textContent = State.isPaused ? "▶ 继续" : "⏸ 暂停";
          } else {
              btnPause.disabled = true;
              btnStop.disabled = true;
              btnPause.textContent = "⏸ 暂停";
          }
      }
  }

  function initUIEvents() {
      const container = document.getElementById("pb-container");
      const header = container.querySelector(".pb-header");
      const ball = container.querySelector(".pb-float-ball");
      const minBtn = container.querySelector(".pb-min-btn");
      const panel = document.getElementById("pb-panel");
      const resizeHandle = document.getElementById("pb-resize-handle");

      let isDragging = false, startX, startY, initRight, initTop;
      const handleDown = (e) => {
          if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('.pb-min-btn') || e.target.classList.contains('pb-link-btn') || e.target.classList.contains('pb-tag-del')) return;
          if (e.target === resizeHandle) return;
          isDragging = true;
          startX = e.clientX; startY = e.clientY;
          const rect = container.getBoundingClientRect();
          initRight = window.innerWidth - rect.right;
          initTop = rect.top;
          container.style.cursor = "grabbing";
      };

      header.addEventListener("mousedown", handleDown);
      ball.addEventListener("mousedown", handleDown);

      let isResizing = false, rStartX, rStartY, rStartW, rStartH;
      resizeHandle.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          isResizing = true;
          rStartX = e.clientX;
          rStartY = e.clientY;
          rStartW = panel.offsetWidth;
          rStartH = panel.offsetHeight;
          document.body.style.cursor = "sw-resize";
      });

      document.addEventListener("mousemove", (e) => {
          if (isDragging) {
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              let newRight = initRight - dx;
              let newTop = initTop + dy;
              if (newTop < 0) newTop = 0;
              if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
              if (newRight < 0) newRight = 0;
              if (newRight > window.innerWidth - panel.offsetWidth) newRight = window.innerWidth - panel.offsetWidth;

              container.style.right = newRight + "px";
              container.style.top = newTop + "px";
              container.style.left = "auto";
              return;
          }
          if (isResizing) {
              const dx = e.clientX - rStartX;
              const dy = e.clientY - rStartY;
              const newW = rStartW - dx;
              const newH = rStartH + dy;
              if (newW > 300) panel.style.width = newW + "px";
              if (newH > 400) panel.style.height = newH + "px";
              UI_STATE.width = newW;
              UI_STATE.height = newH;
          }
      });

      document.addEventListener("mouseup", (e) => {
          if (isDragging) {
              isDragging = false;
              container.style.cursor = "default";
              if (Math.abs(e.clientX - startX) < 5 && e.target.closest('#pb-ball')) toggleView(true);
          }
          if (isResizing) {
              isResizing = false;
              document.body.style.cursor = "default";
          }
      });

      minBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleView(false);
      });

      document.getElementById("btn-pause").onclick = () => {
          if (!State.isRunning) return;
          State.isPaused = !State.isPaused;
          updateUI();
      };
      document.getElementById("btn-stop").onclick = () => {
          if (!State.isRunning) return;
          if (confirm("确定停止？")) {
              State.isRunning = false;
              State.isPaused = false;
              State.currentProcessing = null;
              updateUI();
              uiLog("⏹ 已停止");
          }
      };
      document.getElementById("btn-clear-cart").onclick = () => {
          if (State.isRunning) return;
          if (confirm("清空当前单的待办？")) {
              const key = State.activeTrackingNumber;
              State.savedMap[key] = [];
              const dialog = document.querySelector(".modal-content.o_select_create_dialog_content");
              if (dialog) {
                  dialog.querySelectorAll(".pb-item-cb").forEach(cb => cb.checked = false);
                  dialog.querySelectorAll(".pb-check-wrapper").forEach(w => w.classList.remove("pb-in-pool"));
                  const hcb = dialog.querySelector(".pb-header-cb");
                  if (hcb) hcb.checked = false;
              }
              saveState();
              updateUI();
              uiLog("🗑️ 待办已清空");
          }
      };
      document.getElementById("btn-clear-history").onclick = () => {
          if (confirm("清除当前单号的历史记录？")) {
              const key = State.activeTrackingNumber;
              State.historyMap[key] = [];
              saveState();
              updateUI();
              debouncedEnhance();
              uiLog("🗑️ 历史已清除");
          }
      };
      document.getElementById("btn-retry-fail").onclick = () => retryFailed();
  }

  let debounceTimer = null;
  function debouncedEnhance() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => enhanceQuoteDialog(), 100);
  }

  function enhanceQuoteDialog() {
      const dialog = document.querySelector(".modal-content.o_select_create_dialog_content");
      if (!dialog) {
          State.lastCheckedIndex = null;
          return;
      }
      const table = dialog.querySelector("table.o_list_table");
      if (!table) return;

      const theadRow = table.querySelector("thead tr");
      if (theadRow) {
          const firstTh = theadRow.querySelector("th:first-child");
          if (firstTh && !firstTh.querySelector(".pb-check-wrapper")) {
              const wrapper = document.createElement("div");
              wrapper.className = "pb-check-wrapper";
              wrapper.title = "全选当前页";
              wrapper.onclick = e => e.stopPropagation();
              const allCb = document.createElement("input");
              allCb.type = "checkbox"; allCb.className = "pb-batch-select pb-header-cb";
              allCb.onclick = e => {
                  dialog.querySelectorAll(".pb-item-cb").forEach(c => c.checked = e.target.checked);
                  e.stopPropagation();
              };
              wrapper.appendChild(allCb);
              firstTh.prepend(wrapper);
          }
      }

      const rows = table.querySelectorAll("tbody tr.o_data_row");
      let allChecked = true;
      if (rows.length === 0) allChecked = false;

      const savedList = getCurrentSaved();
      const historyList = State.historyMap[State.activeTrackingNumber] || [];

      rows.forEach(tr => {
          const firstTd = tr.querySelector("td:first-child");
          if (!firstTd) return;

          const nameText = firstTd.textContent.trim();
          let cb = firstTd.querySelector(".pb-item-cb");
          let wrapper = firstTd.querySelector(".pb-check-wrapper");

          if (!cb) {
              wrapper = document.createElement("div");
              wrapper.className = "pb-check-wrapper";
              wrapper.onclick = e => e.stopPropagation();
              cb = document.createElement("input");
              cb.type = "checkbox"; cb.className = "pb-batch-select pb-item-cb";
              cb.dataset.order = nameText;

              cb.onclick = e => {
                  e.stopPropagation();
                  const allCbs = Array.from(dialog.querySelectorAll(".pb-item-cb"));
                  const currIdx = allCbs.indexOf(e.target);
                  if (e.shiftKey && State.lastCheckedIndex !== null) {
                      const [start, end] = [Math.min(State.lastCheckedIndex, currIdx), Math.max(State.lastCheckedIndex, currIdx)];
                      for (let i = start; i <= end; i++) allCbs[i].checked = e.target.checked;
                      window.getSelection().removeAllRanges();
                  }
                  State.lastCheckedIndex = currIdx;
              };
              wrapper.appendChild(cb);
              firstTd.prepend(wrapper);
          }

          if (savedList.includes(nameText)) {
              cb.checked = true;
              if (wrapper) { wrapper.classList.add("pb-in-pool"); wrapper.classList.remove("pb-is-done"); }
          } else if (historyList.includes(nameText)) {
              cb.checked = false; cb.disabled = true;
              if (wrapper) { wrapper.classList.add("pb-is-done"); wrapper.classList.remove("pb-in-pool"); }
          } else {
              cb.disabled = false;
              if (wrapper) { wrapper.classList.remove("pb-in-pool"); wrapper.classList.remove("pb-is-done"); }
          }

          if (!cb.checked) allChecked = false;
      });

      const headerCb = dialog.querySelector(".pb-header-cb");
      if (headerCb) headerCb.checked = allChecked;

      let footer = dialog.querySelector(".modal-footer");
      if (footer && !footer.querySelector(".pb-start-btn")) {
          const btnAdd = document.createElement("button");
          btnAdd.className = "btn pb-btn-add";
          btnAdd.innerHTML = "📥 加入待办";
          btnAdd.onclick = () => {
              const checked = dialog.querySelectorAll(".pb-item-cb:checked");
              const list = Array.from(checked).map(c => c.dataset.order).filter(n => n);
              if (!list.length) return alert("请先勾选订单");

              let addedCount = 0;
              const key = State.activeTrackingNumber;
              if (!State.savedMap[key]) State.savedMap[key] = [];
              const currentSaved = State.savedMap[key];
              const currentDone = State.historyMap[key] || [];

              list.forEach(id => {
                  if (!currentSaved.includes(id) && !currentDone.includes(id)) {
                      currentSaved.push(id);
                      addedCount++;
                  }
              });
              enhanceQuoteDialog();
              saveState();
              updateUI();
              uiLog(`📥 加入 ${addedCount} 单`);
          };

          const btnStart = document.createElement("button");
          btnStart.className = "btn btn-primary pb-start-btn";
          btnStart.innerHTML = "🚀 批量结算";
          btnStart.onclick = () => {
              const checked = dialog.querySelectorAll(".pb-item-cb:checked");
              const currentList = Array.from(checked).map(c => c.dataset.order).filter(n => n);
              const key = State.activeTrackingNumber;

              const currentSaved = State.savedMap[key] || [];
              const currentDone = State.historyMap[key] || [];
              const validCurrent = currentList.filter(n => !currentDone.includes(n));
              const finalQueue = [...new Set([...currentSaved, ...validCurrent])];

              if (!finalQueue.length) return alert("请先勾选订单或加入待办列表");
              if (State.isRunning) return alert("任务已在运行");

              uiLog(`----------------`);
              uiLog(`🚀 启动: 共 ${finalQueue.length} 单`);
              uiLog(`----------------`);

              State.queue = finalQueue;
              dialog.querySelectorAll(".pb-check-wrapper").forEach(w => w.classList.remove("pb-in-pool"));
              updateUI();

              State.isRunning = true;
              State.isPaused = false;
              processQueueLoop();
          };

          footer.appendChild(btnAdd);
          footer.appendChild(btnStart);
      }
  }

  loadState();
  createUI();
  setInterval(updateActiveOrderInfo, 1000);

  // [重要优化] 监听逻辑修改：防止过度触发
  // 原先监听整个 body subtree 导致 Odoo 的每次微小渲染都会触发
  // 现在我们通过防抖和特定条件过滤来减少性能开销
  const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const m of mutations) {
          // 只关心节点添加，或者表格属性变化
          if (m.addedNodes.length > 0) {
              // 如果添加的节点里包含了表格行或弹窗内容
              for (const node of m.addedNodes) {
                  if (node.nodeType === 1) { // Element
                      if (node.classList && (node.classList.contains('o_data_row') || node.classList.contains('modal-content'))) {
                          shouldUpdate = true;
                          break;
                      }
                      // 某些情况下 Odoo 替换整个 tbody
                      if (node.tagName === 'TBODY' || node.tagName === 'TABLE') {
                          shouldUpdate = true;
                          break;
                      }
                  }
              }
          }
          if (shouldUpdate) break;
      }
      if (shouldUpdate) debouncedEnhance();
  });

  // 虽然还是监听 body，但在回调里做了严格过滤
  observer.observe(document.body, { childList: true, subtree: true });

})();