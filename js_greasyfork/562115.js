// ==UserScript==
// @name         Bilibili 0.1倍速精细控制（触控增强版）
// @namespace    https://greasyfork.org/users/your_id
// @version      1.4.0
// @description  Ctrl + ↑ / ↓ 或触控悬浮面板精确调速，支持横竖屏自适应与长按连续调速，自动连播保持倍速
// @author       your_name
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562115/Bilibili%2001%E5%80%8D%E9%80%9F%E7%B2%BE%E7%BB%86%E6%8E%A7%E5%88%B6%EF%BC%88%E8%A7%A6%E6%8E%A7%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562115/Bilibili%2001%E5%80%8D%E9%80%9F%E7%B2%BE%E7%BB%86%E6%8E%A7%E5%88%B6%EF%BC%88%E8%A7%A6%E6%8E%A7%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== 配置 ===== */
  const STEP = 0.1;
  const MIN_RATE = 0.1;
  const MAX_RATE = 6.0;
  const STORE_KEY = 'bili_precise_playback_rate';

  const LONG_PRESS_DELAY = 300;
  const LONG_PRESS_INTERVAL = 120;

  /* ===== 工具 ===== */
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const round1 = (v) => Math.round(v * 10) / 10;
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const getSavedRate = () => {
    const r = parseFloat(localStorage.getItem(STORE_KEY));
    return isNaN(r) ? 1.0 : r;
  };

  const saveRate = (rate) => {
    localStorage.setItem(STORE_KEY, rate);
  };

  /* ===== 提示 UI ===== */
  const tip = document.createElement('div');
  tip.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 6px 12px;
    background: rgba(0,0,0,.65);
    color: #fff;
    font-size: 18px;
    border-radius: 6px;
    z-index: 999999;
    display: none;
    pointer-events: none;
  `;
  document.body.appendChild(tip);

  let tipTimer = null;
  const showTip = (rate) => {
    tip.textContent = `倍速：${rate.toFixed(1)}x`;
    tip.style.display = 'block';
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      tip.style.display = 'none';
    }, 800);
  };

  /* ===== 触控悬浮面板 ===== */
  let touchPanel = null;

  function createTouchPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      right: 14px;
      bottom: 120px;
      z-index: 999999;
      background: rgba(0,0,0,.65);
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 6px 10px;
      gap: 10px;
      user-select: none;
      transition: opacity .2s ease, transform .2s ease;
    `;

    const btnStyle = `
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #fff;
      color: #000;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    `;

    const minus = document.createElement('div');
    minus.textContent = '−';
    minus.style.cssText = btnStyle;

    const label = document.createElement('div');
    label.style.cssText = `
      color: #fff;
      font-size: 14px;
      min-width: 44px;
      text-align: center;
    `;

    const plus = document.createElement('div');
    plus.textContent = '+';
    plus.style.cssText = btnStyle;

    panel.append(minus, label, plus);
    document.body.appendChild(panel);

    /* --- 倍速控制 --- */
    const changeRate = (delta) => {
      const v = document.querySelector('video');
      if (!v) return;
      let r = round1(v.playbackRate + delta);
      r = clamp(r, MIN_RATE, MAX_RATE);
      v.playbackRate = r;
      saveRate(r);
      label.textContent = r.toFixed(1) + 'x';
      showTip(r);
    };

    /* --- 长按处理 --- */
    function bindLongPress(el, delta) {
      let timer = null;
      let interval = null;

      const start = () => {
        timer = setTimeout(() => {
          interval = setInterval(() => changeRate(delta), LONG_PRESS_INTERVAL);
        }, LONG_PRESS_DELAY);
      };

      const stop = () => {
        clearTimeout(timer);
        clearInterval(interval);
      };

      el.addEventListener('touchstart', start);
      el.addEventListener('touchend', stop);
      el.addEventListener('touchcancel', stop);

      el.addEventListener('click', () => changeRate(delta));
    }

    bindLongPress(minus, -STEP);
    bindLongPress(plus, STEP);

    const updateLabel = () => {
      const v = document.querySelector('video');
      if (v) label.textContent = v.playbackRate.toFixed(1) + 'x';
    };

    /* --- 横竖屏自适应 --- */
    const updateVisibility = () => {
      const landscape = window.innerWidth > window.innerHeight;
      panel.style.opacity = landscape ? '1' : '0';
      panel.style.transform = landscape
        ? 'translateY(0)'
        : 'translateY(20px)';
      panel.style.pointerEvents = landscape ? 'auto' : 'none';
    };

    window.addEventListener('resize', updateVisibility);
    updateVisibility();

    return { panel, updateLabel };
  }

  /* ===== 绑定 video ===== */
  let currentVideo = null;

  function bindVideo(video) {
    if (!video || video === currentVideo) return;
    currentVideo = video;

    const applyRate = () => {
      video.playbackRate = getSavedRate();
      if (touchPanel) touchPanel.updateLabel();
    };

    video.addEventListener('loadedmetadata', applyRate);
    video.addEventListener('ratechange', applyRate);

    applyRate();
  }

  /* ===== DOM 监听 ===== */
  const observer = new MutationObserver(() => {
    const video = document.querySelector('video');
    if (video) {
      bindVideo(video);
      if (isTouchDevice && !touchPanel) {
        touchPanel = createTouchPanel();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  /* ===== 键盘控制（桌面） ===== */
  document.addEventListener(
    'keydown',
    (e) => {
      if (!e.ctrlKey) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      const video = document.querySelector('video');
      if (!video) return;

      let rate = video.playbackRate;
      if (e.code === 'ArrowUp') rate += STEP;
      else if (e.code === 'ArrowDown') rate -= STEP;
      else return;

      e.preventDefault();
      rate = clamp(round1(rate), MIN_RATE, MAX_RATE);
      video.playbackRate = rate;
      saveRate(rate);
      showTip(rate);

      if (touchPanel) touchPanel.updateLabel();
    },
    true
  );
})();
