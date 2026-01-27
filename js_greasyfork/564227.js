// ==UserScript==
// @name         Gemini聊天滚动到底部按钮
// @namespace    https://github.com/miemiegy/youhou-gemini-scrollDown
// @version      0.1.0
// @author       miemieyang
// @description  点击按钮将聊天滚动到底部
// @match        https://gemini.google.com/*
// @grant        none
// @compatible   chrome
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564227/Gemini%E8%81%8A%E5%A4%A9%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/564227/Gemini%E8%81%8A%E5%A4%A9%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  /* 功能说明：
   * - 左键点击右下角按钮：将聊天内容滚动到最底部（最新消息）。
   * - 右键点击按钮：切换“窗口变化后自动滚底”开关；开启时按钮边框变为绿色。
   * - 容器识别：优先选择 overflow-y 为 'auto'/'scroll' 且可滚动高度最大的元素作为主要聊天容器；
   *   若未找到合适容器，则回退为滚动整个页面窗口。
   */
  // 识别页面中最可能的聊天滚动容器（溢出且可滚动的最大高度元素）
  function findContainer() {
    const list = Array.from(document.querySelectorAll('*')).filter(el => {
      const s = getComputedStyle(el);
      const h = el.scrollHeight - el.clientHeight;
      return h > 50 && (s.overflowY === 'auto' || s.overflowY === 'scroll');
    });
    if (list.length) {
      list.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight));
      return list[0];
    }
    return document.scrollingElement || document.documentElement || document.body;
  }
  // 平滑滚动到目标容器（或页面）的底部
  function scrollToBottom(el) {
    const target = el || findContainer();
    if (target === document.body || target === document.documentElement || target === document.scrollingElement) {
      window.scrollTo({ top: target.scrollHeight, behavior: 'smooth' });
    } else {
      target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' });
    }
  }
  // 是否在窗口尺寸变化后自动滚到底部；resize 防抖计时器
  let autoOnResize = false;
  let resizeTimer;
  // 创建右下角悬浮按钮及事件绑定
  function createButton() {
    const btn = document.createElement('button');
    btn.textContent = '到底部';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: '99999',
      padding: '8px 12px',
      borderRadius: '999px',
      border: '1px solid #ccc',
      background: '#fff',
      color: '#000',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      cursor: 'pointer'
    });
    // 左键点击：立即滚动到底部
    btn.addEventListener('click', () => { scrollToBottom(); }, { passive: true });
    // 右键点击：切换自动滚底开关，并以边框颜色提示状态
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      autoOnResize = !autoOnResize;
      btn.style.borderColor = autoOnResize ? '#4caf50' : '#ccc';
    });
    document.body.appendChild(btn);
  }
  // 初始化：页面准备好后插入按钮
  function init() {
    if (!document.body) return;
    createButton();
  }
  // 窗口尺寸变化时（且开关开启）防抖后自动滚到底部
  window.addEventListener('resize', () => {
    if (!autoOnResize) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { scrollToBottom(); }, 150);
  }, { passive: true });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
