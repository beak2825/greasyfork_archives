// ==UserScript==
// @name         百度网盘手动倍速播放
// @name:en      Baidu Netdisk Safe Speed (Manual)
// @namespace    https://greasyfork.org/zh-CN/users/1559581-blackrock33
// @version      1.0.0
// @description  百度网盘视频手动倍速播放。快捷键：0=2倍速，[ / ] 调整速度，\ 重置速度。
// @description:en Manually adjust the playback speed of videos on Baidu Netdisk. Shortcut keys: 0 = 2x speed, [ / ] adjust speed, \ reset speed.
// @author       blockrock33
// @match        https://pan.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562432/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%8B%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/562432/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%8B%E5%8A%A8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

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


(function () {
  console.log('[SafeSpeed] userscript loaded');

  document.addEventListener('keydown', e => {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;

    const v = document.querySelector('video');
    if (!v) return;
    if (e.key === '0') {
       v.playbackRate = 2;
        console.log('[SafeSpeed] apply 2' );
        showSpeedToast('播放速度：2.00x');
      }
    if (e.key === ']') {
      v.playbackRate = Math.min(v.playbackRate + 0.25, 16);
      console.log('[SafeSpeed]', v.playbackRate);
      showSpeedToast(`播放速度：${v.playbackRate.toFixed(2)}x`);
    }

    if (e.key === '[') {
      v.playbackRate = Math.max(v.playbackRate - 0.25, 0.25);
      console.log('[SafeSpeed]', v.playbackRate);
      showSpeedToast(`播放速度：${v.playbackRate.toFixed(2)}x`);
    }

    if (e.key === '\\') {
      v.playbackRate = 1;
      console.log('[SafeSpeed] reset');
      showSpeedToast('播放速度：1.00x');
    }
  });
})();
