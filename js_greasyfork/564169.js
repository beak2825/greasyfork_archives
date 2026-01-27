// ==UserScript==
// @name         Odoo POS - 隐藏键盘
// @namespace    playbox.pos.toggles
// @version      1.2.1
// @description  Hide/show ONLY the numpad (keep refund/pay buttons visible) in Odoo POS + Tampermonkey menu option to show/hide the button
// @match        *://*.odoo.com/pos/*
// @grant        GM_registerMenuCommand
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/564169/Odoo%20POS%20-%20%E9%9A%90%E8%97%8F%E9%94%AE%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/564169/Odoo%20POS%20-%20%E9%9A%90%E8%97%8F%E9%94%AE%E7%9B%98.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LS_KEY = "pb_pos_hide_numpad_only";
  const LS_SHOW_BTN = "pb_pos_show_toggle_button"; // ✅ 新增：是否显示按钮
  const BTN_ID = "pb-toggle-numpad-btn";
  const HIDE_CLASS = "pb-numpad-hidden";

  // ---------- 配置 ----------
  function getShowButtonEnabled() {
    const v = localStorage.getItem(LS_SHOW_BTN);
    return v === null ? false : v === "1"; // 默认显示
  }
  function setShowButtonEnabled(enabled) {
    localStorage.setItem(LS_SHOW_BTN, enabled ? "1" : "0");
  }

  // ---------- CSS: 只隐藏 .numpad，保留 .actionpad(退款) ----------
  function injectCSS() {
    if (document.getElementById("pb-pos-toggle-style")) return;
    const css = `
      /* ✅ 只隐藏数字键盘 */
      .${HIDE_CLASS} .numpad{ display:none !important; }

      /* 按钮样式（你之前的设置） */
      #${BTN_ID}{ font-weight:700 !important; white-space:nowrap; min-width:10px; }
    `;
    const style = document.createElement("style");
    style.id = "pb-pos-toggle-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getPosRoot() {
    return document.querySelector(".pos") || document.querySelector(".point_of_sale");
  }

  function isHidden() {
    const root = getPosRoot();
    return !!root && root.classList.contains(HIDE_CLASS);
  }

  function setHidden(hidden) {
    const root = getPosRoot();
    if (!root) return;

    root.classList.toggle(HIDE_CLASS, hidden);
    localStorage.setItem(LS_KEY, hidden ? "1" : "0");

    const btn = document.getElementById(BTN_ID);
    if (btn) {
      btn.textContent = "键盘";
      btn.classList.toggle("btn-warning", hidden);
      btn.classList.toggle("btn-secondary", !hidden);
    }
  }

  function toggleHidden() {
    setHidden(!isHidden());
  }

  // 只在按钮插入时恢复一次状态
  let restoredOnce = false;

  function removeButtonIfExists() {
    const btn = document.getElementById(BTN_ID);
    if (btn) btn.remove();
  }

  function ensureButtonOnce() {
    // ✅ 如果用户在油猴选项里关闭了按钮显示，则不插入，且移除现有按钮
    if (!getShowButtonEnabled()) {
      removeButtonIfExists();
      return false;
    }

    const controlButtons = document.querySelector(".pads .control-buttons");
    if (!controlButtons) return false;

    if (!document.getElementById(BTN_ID)) {
      const btn = document.createElement("button");
      btn.id = BTN_ID;
      btn.type = "button";
      btn.className = "btn btn-secondary btn-lg lh-lg flex-shrink-0";
      btn.textContent = "键盘";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleHidden();
      });
      controlButtons.appendChild(btn);
      restoredOnce = false;
    }

    if (!restoredOnce) {
      restoredOnce = true;
      const saved = localStorage.getItem(LS_KEY) === "1";
      setHidden(saved);
    }

    return true;
  }

  // ---------- Throttled observer ----------
  function observeSafely() {
    const root = getPosRoot();
    if (!root) return false;

    let scheduled = false;
    const tick = () => {
      scheduled = false;
      ensureButtonOnce();
    };

    const obs = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(tick);
    });

    obs.observe(root, { childList: true, subtree: true });
    ensureButtonOnce();

    // 快捷键：Ctrl + `
    document.addEventListener("keydown", (ev) => {
      if (ev.ctrlKey && ev.key === "`") {
        ev.preventDefault();
        toggleHidden();
      }
    });

    return true;
  }

  // ---------- ✅ 油猴菜单开关 ----------
  function registerMenu() {
    if (typeof GM_registerMenuCommand !== "function") return;

    const enabled = getShowButtonEnabled();
    GM_registerMenuCommand(`${enabled ? "✅" : "❌"} 显示「键盘」按钮：${enabled ? "开" : "关"}`, () => {
      const next = !getShowButtonEnabled();
      setShowButtonEnabled(next);

      // 立刻生效：开启就尝试插入；关闭就移除
      if (next) {
        ensureButtonOnce();
      } else {
        removeButtonIfExists();
      }

      alert(`已${next ? "开启" : "关闭"}：显示「键盘」按钮\n（如果菜单文字没更新，刷新页面即可）`);
    });
  }

  function boot() {
    injectCSS();
    registerMenu();

    const t = setInterval(() => {
      const root = getPosRoot();
      if (root) {
        clearInterval(t);
        observeSafely();
      }
    }, 300);
  }

  boot();
})();
