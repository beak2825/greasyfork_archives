// ==UserScript==
// @name         双击全屏（适配手机浏览器）
// @namespace    https://greasyfork.org/zh-CN/scripts/557840-%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F-%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8
// @version      2.0
// @description  双击切换全屏（智能识别底部工具栏，避免滚动失效）
// @author       青野
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557840/%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F%EF%BC%88%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557840/%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F%EF%BC%88%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const DOUBLE_TAP_DELAY = 300;
  const MAX_MOVE = 40;
 
  let lastTime = 0, lastX = 0, lastY = 0;
  let pseudoFullscreen = false;
 
  /* ===== 判断是否存在底部 fixed 工具栏 ===== */
  function hasBottomFixedBar() {
    const els = Array.from(document.body.querySelectorAll('*'));
    return els.some(el => {
      const s = getComputedStyle(el);
      return (
        s.position === 'fixed' &&
        s.bottom === '0px' &&
        parseInt(s.height) >= 40 &&
        el.offsetParent !== null
      );
    });
  }
 
  /* ===== 输入元素判断 ===== */
  function isInput(el) {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return ['input','textarea','select'].includes(tag) || el.isContentEditable;
  }
 
  /* ===== 伪全屏（CSS） ===== */
  function enterPseudoFullscreen() {
    document.documentElement.style.height = '100%';
    document.body.style.cssText += `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
    `;
    pseudoFullscreen = true;
  }
 
  function exitPseudoFullscreen() {
    document.body.style.cssText = '';
    document.documentElement.style.height = '';
    pseudoFullscreen = false;
  }
 
  /* ===== 真全屏 ===== */
  function enterRealFullscreen() {
    document.documentElement.requestFullscreen?.()
      || document.documentElement.webkitRequestFullscreen?.();
  }
 
  function exitRealFullscreen() {
    document.exitFullscreen?.()
      || document.webkitExitFullscreen?.();
  }
 
  function toggleFullscreen() {
    if (hasBottomFixedBar()) {
      pseudoFullscreen ? exitPseudoFullscreen() : enterPseudoFullscreen();
    } else {
      document.fullscreenElement ? exitRealFullscreen() : enterRealFullscreen();
    }
  }
 
  /* ===== 双击检测 ===== */
  document.addEventListener('touchend', e => {
    if (e.changedTouches.length !== 1) return;
    const t = e.changedTouches[0];
    const now = Date.now();
 
    const dx = Math.abs(t.clientX - lastX);
    const dy = Math.abs(t.clientY - lastY);
 
    if (isInput(e.target)) {
      lastTime = 0;
      return;
    }
 
    if (now - lastTime < DOUBLE_TAP_DELAY && dx < MAX_MOVE && dy < MAX_MOVE) {
      e.preventDefault();
      toggleFullscreen();
      lastTime = 0;
    } else {
      lastTime = now;
      lastX = t.clientX;
      lastY = t.clientY;
    }
  }, { passive: true });
 
  console.log('🐵 双击全屏 v1.9（底栏网站滚动已修复）— 青野');
})();