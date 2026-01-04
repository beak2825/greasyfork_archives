// ==UserScript==
// @name         Samsung/Android 视频滑动按百分比快进/快退
// @namespace    https://example.com/
// @version      1.1
// @description  对可访问的 HTML5 video 添加横向滑动按时长百分比快进/快退（更快）
// @match        *://*/*
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/561213/SamsungAndroid%20%E8%A7%86%E9%A2%91%E6%BB%91%E5%8A%A8%E6%8C%89%E7%99%BE%E5%88%86%E6%AF%94%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561213/SamsungAndroid%20%E8%A7%86%E9%A2%91%E6%BB%91%E5%8A%A8%E6%8C%89%E7%99%BE%E5%88%86%E6%AF%94%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEADZONE_PX = 12;      // 小于这个不算滑动
  const SWIPE_MIN_PX = 40;     // 有效滑动阈值
  const SENSITIVITY = 2.5;     // 越大越快：1=1:1, 2.5=2.5倍
  const PREVENT_SCROLL = true;

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      padding: '10px 16px',
      fontSize: '16px',
      borderRadius: '10px',
      zIndex: 999999
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 650);
  }

  function clamp(x, a, b) {
    return Math.max(a, Math.min(b, x));
  }

  function bindGesture(video) {
    if (video.dataset.gestureBound) return;
    video.dataset.gestureBound = 'true';

    let startX = 0, startY = 0, startTime = 0;
    let touching = false, decided = false, isHorizontal = false;

    video.addEventListener('touchstart', (e) => {
      if (!video.duration || !isFinite(video.duration)) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startTime = video.currentTime;
      touching = true;
      decided = false;
      isHorizontal = false;
    }, { passive: true });

    video.addEventListener('touchmove', (e) => {
      if (!touching) return;
      if (!video.duration || !isFinite(video.duration)) return;

      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!decided) {
        if (Math.abs(dx) < DEADZONE_PX && Math.abs(dy) < DEADZONE_PX) return;
        decided = true;
        isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
      }
      if (!isHorizontal) return;

      if (PREVENT_SCROLL && e.cancelable) e.preventDefault();

      const rect = video.getBoundingClientRect();
      const width = rect.width || window.innerWidth;

      // 按百分比：滑动占宽度比例 * duration * sensitivity
      const pct = dx / width;
      const delta = pct * video.duration * SENSITIVITY;

      const next = clamp(startTime + delta, 0, Math.max(0, video.duration - 0.01));
      video.currentTime = next;

      const sign = delta >= 0 ? '+' : '-';
      showToast(`${sign}${Math.abs(delta).toFixed(1)}s`);
    }, { passive: false });

    video.addEventListener('touchend', (e) => {
      touching = false;
    }, { passive: true });

    video.addEventListener('touchcancel', () => {
      touching = false;
    }, { passive: true });
  }

  function searchVideosInDocument(doc) {
    try {
      doc.querySelectorAll('video').forEach(bindGesture);
    } catch (e) {}
  }

  function scan() {
    searchVideosInDocument(document);
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        const idoc = iframe.contentDocument || iframe.contentWindow.document;
        if (idoc) searchVideosInDocument(idoc);
      } catch (e) {
        // 跨域 iframe 不能访问
      }
    });
  }

  scan();
  setInterval(scan, 2000);
})();
