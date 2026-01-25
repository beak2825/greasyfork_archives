// ==UserScript==
// @name         百度网盘手动倍速播放
// @name:en      Baidu Netdisk Safe Speed (Manual)
// @namespace    https://greasyfork.org/zh-CN/users/1559581-blackrock33
// @version      1.2.0
// @description  百度网盘视频手动倍速播放（记住上一次倍速）。快捷键：0=2倍速，[ / ] 调整速度，\ 重置，F11 全屏。
// @description:en Manually adjust the playback speed of videos on Baidu Netdisk(remember the last speed). Shortcut keys: 0 = 2x speed, [ / ] adjust speed, \ reset speed, F11 full screen.
// @author       blockrock33
// @match        https://pan.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562432/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%8B%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/562432/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%8B%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

const SPEED_KEY = '__SAFE_SPEED_RATE__';
const DEFAULT_SPEED = 1;

/* ---------- toast ---------- */
function showSpeedToast(text, duration = 1000) {
  let toast = document.getElementById('__safe_speed_toast__');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = '__safe_speed_toast__';
    toast.style.cssText = `
      position: fixed;
      right: 24px;
      bottom: 24px;
      padding: 8px 14px;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      font-size: 14px;
      border-radius: 6px;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.style.opacity = '1';

  clearTimeout(toast.__hideTimer);
  toast.__hideTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}

function getSavedSpeed() {
  const v = parseFloat(localStorage.getItem(SPEED_KEY));
  return Number.isFinite(v) ? v : DEFAULT_SPEED;
}

function saveSpeed(rate) {
  localStorage.setItem(SPEED_KEY, rate);
}

function bindVideo(video) {
  if (!video || video.__safeSpeedBound) return;
  video.__safeSpeedBound = true;

  const applySavedSpeed = (reason) => {
    const saved = getSavedSpeed();
    if (Math.abs(video.playbackRate - saved) < 0.01) return;

    video.playbackRate = saved;
    console.log(`[SafeSpeed] apply (${reason}):`, saved);
    showSpeedToast(`播放速度：${saved.toFixed(2)}x`);
  };

  video.addEventListener('playing', () => {
    applySavedSpeed('init');
  });

  video.addEventListener('ratechange', () => {
    const saved = getSavedSpeed();
    if (Math.abs(video.playbackRate - saved) < 0.01) return;
    if (video.playbackRate === 1 && saved !== 1) {
      applySavedSpeed('ratechange');
    }
  });

  console.log('[SafeSpeed] video bound');
}

const observer = new MutationObserver(() => {
  const v = document.querySelector('video');
  if (v) bindVideo(v);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

document.addEventListener('keydown', e => {
  if (e.target && /input|textarea/i.test(e.target.tagName)) return;

  const v = document.querySelector('video');
  if (!v) return;

  let newRate = v.playbackRate;

  if (e.key === '0') {
    newRate = 2;
  }

  if (e.key === ']') {
    newRate = Math.min(v.playbackRate + 0.25, 16);
  }

  if (e.key === '[') {
    newRate = Math.max(v.playbackRate - 0.25, 0.25);
  }

  if (e.key === '\\') {
    newRate = 1;
  }

  if (newRate !== v.playbackRate) {
    v.playbackRate = newRate;
    saveSpeed(newRate);
    console.log('[SafeSpeed] set speed:', newRate);
    showSpeedToast(`播放速度：${newRate.toFixed(2)}x`);
  }

  if (e.key === 'F11' || e.keyCode === 122) {
    e.preventDefault();

    const fullscreenBtn = document.querySelector(
      'div.vp-video__control-bar--button.is-icon[title="全屏"]'
    );

    fullscreenBtn?.click();
  }
});
