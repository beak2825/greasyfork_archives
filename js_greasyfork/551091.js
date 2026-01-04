// ==UserScript==
// @name         ChatGPT Sidebar Auto-Collapse (CN precise)
// @namespace    https://kundayang.dev
// @version      1.3.0
// @description  打开 ChatGPT 页面时默认折叠左侧侧边栏；适配 data-testid="close-sidebar-button" 的新版按钮；SPA 路由变化也维持折叠。
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551091/ChatGPT%20Sidebar%20Auto-Collapse%20%28CN%20precise%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551091/ChatGPT%20Sidebar%20Auto-Collapse%20%28CN%20precise%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  async function waitFor(sel, { timeout = 10000, interval = 150 } = {}) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const el = document.querySelector(sel);
      if (el) return el;
      await sleep(interval);
    }
    return null;
  }

  // —— 你的环境的“折叠按钮”特征（来自你提供的 DOM）——
  function getCloseBtn() {
    // 首选：你截图里的按钮
    let btn = document.querySelector('button[data-testid="close-sidebar-button"]');
    if (btn) return btn;

    // 备选：同一个控件的语义属性
    btn = document.querySelector(
      'button[aria-controls="stage-slideover-sidebar"][aria-label*="边栏" i]'
    );
    if (btn) return btn;

    // 兜底：左上角工具条里，带“边栏/栏/侧栏”文案或图标的按钮
    const header = document.querySelector('header') || document.body;
    return header.querySelector('button[aria-label*="栏" i]');
  }

  // 判断侧栏是否处于展开（可见）状态
  function isSidebarOpen() {
    // 1) 根据按钮语义：aria-expanded=true 通常表示“当前展开，可关闭”
    const btn = getCloseBtn();
    if (btn && btn.hasAttribute('aria-expanded')) {
      return btn.getAttribute('aria-expanded') === 'true';
    }

    // 2) DOM 几何兜底：找实际侧栏容器（有 aria-controls 指向）
    const ctrlId = btn && btn.getAttribute('aria-controls');
    const sidebar =
      (ctrlId && document.getElementById(ctrlId)) ||
      document.querySelector('#stage-slideover-sidebar, aside[data-state], aside[role="navigation"]');

    if (!sidebar) return false;
    const cs = getComputedStyle(sidebar);
    const rect = sidebar.getBoundingClientRect();
    return cs.display !== 'none' && rect.width > 40 && rect.height > 100;
  }

  let lastPath = location.pathname + location.search + location.hash;
  let clicking = false;

  async function collapse(reason = 'init') {
    if (clicking) return;
    const btn = getCloseBtn();
    if (!btn) return;

    if (!isSidebarOpen()) return; // 已是折叠状态就不动

    clicking = true;
    btn.click();                   // 触发一次“关闭侧边栏”
    await sleep(80);
    clicking = false;
  }

  // 初次加载尝试多次（异步装配 DOM 时更稳）
  (async function init() {
    await waitFor('main, #__next, body');
    for (let i = 0; i < 12; i++) {
      await sleep(250);
      await collapse('boot-' + i);
      if (!isSidebarOpen()) break;
    }
  })();

  // 监听单页应用路由变化，变化后再折叠一次
  (function hookHistory() {
    const wrap = (k) => {
      const orig = history[k];
      return function () {
        const r = orig.apply(this, arguments);
        const now = location.pathname + location.search + location.hash;
        if (now !== lastPath) {
          lastPath = now;
          setTimeout(() => collapse('route-' + k), 400);
        }
        return r;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    addEventListener('hashchange', () => setTimeout(() => collapse('route-hash'), 300));
  })();

  // 兜底：DOM 变化时若检测到又展开了，就再合上
  const mo = new MutationObserver(() => {
    if (isSidebarOpen()) collapse('mutation');
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
