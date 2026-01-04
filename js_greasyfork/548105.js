// ==UserScript==
// @name         YouTube Performance CPU Optimized v2.4 (hardware acceleration off)
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  H.264 optimize, VP9 kapalı, throttling optimize, DOM ve Ambient iyileştirildi, lazy-load yorumlar, ekstra CSS optimizasyonu
// @author       Sefa AVAN
// @license      MIT
// @match        http://*.youtube.com/*
// @match        http://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548105/YouTube%20Performance%20CPU%20Optimized%20v24%20%28hardware%20acceleration%20off%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548105/YouTube%20Performance%20CPU%20Optimized%20v24%20%28hardware%20acceleration%20off%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 1) Codec override (AV1 & VP9 kapalı, sadece H.264 açık) ----------
  const origCanPlayType = HTMLMediaElement.prototype.canPlayType;
  HTMLMediaElement.prototype.canPlayType = function (type) {
    if (type && (/codecs="?av01/i.test(type) || /codecs="?vp9/i.test(type))) return '';
    return origCanPlayType.call(this, type);
  };

  if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    const origDecodingInfo = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);
    navigator.mediaCapabilities.decodingInfo = async (cfg) => {
      const ct = cfg?.video?.contentType || '';
      if (/codecs="?av01/i.test(ct) || /codecs="?vp9/i.test(ct)) {
        return { supported: false, powerEfficient: false, smooth: false };
      }
      return origDecodingInfo(cfg);
    };
  }

  // ---------- 2) Zamanlayıcı optimizasyonu (CPU Tamer mantığı) ----------
  const raf = window.requestAnimationFrame || (cb => setTimeout(cb, 16));
  const caf = window.cancelAnimationFrame || clearTimeout;

  const wrapTimer = (orig) => {
    return function (cb, delay, ...args) {
      if (typeof cb !== "function") return orig(cb, delay, ...args);
      if (delay && delay > 50) return orig(cb, delay, ...args);
      let id;
      const loop = () => {
        id = raf(() => {
          cb(...args);
          loop();
        });
      };
      loop();
      return id;
    };
  };

  window.setTimeout = wrapTimer(window.setTimeout);
  window.setInterval = wrapTimer(window.setInterval);
  window.clearTimeout = caf;
  window.clearInterval = caf;

  // ---------- 3) Event throttling ----------
  function throttleEvents(root = document) {
    const throttleMs = 50;
    const last = {};
    const types = ['mousemove', 'pointermove', 'scroll', 'resize'];
    types.forEach(type => {
      root.addEventListener(type, (e) => {
        const now = performance.now();
        if (last[type] && now - last[type] < throttleMs) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          return;
        }
        last[type] = now;
      }, true);
    });
  }

  // ---------- 4) Ambient ve CSS efektlerini kapatma ----------
  function killVisuals() {
    const style = document.createElement('style');
    style.textContent = `
      .ytp-ambient-light,
      .ytp-ambient-mode-enabled,
      ytd-watch-flexy[ambient-mode-enabled] .ytp-ambient-light,
      ytd-watch-flexy[ambient-mode-enabled] .html5-video-player::before {
        display: none !important;
      }
      ytd-watch-flexy, ytd-app, #content, #page-manager {
        backdrop-filter: none !important;
        filter: none !important;
        animation: none !important;
        transition: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  // ---------- 5) Lazy-load yorumlar ----------
  function lazyLoadComments() {
    const comments = document.querySelector("ytd-comments#comments");
    if (!comments) return;
    comments.style.contentVisibility = "hidden";
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        comments.style.contentVisibility = "visible";
        obs.disconnect();
      }
    });
    obs.observe(comments);
  }

  // ---------- 6) Focus Mode (videoyu ortala ama yan paneli kapatma) ----------
  function focusMode() {
    const style = document.createElement("style");
    style.textContent = `
      ytd-watch-flexy {
        max-width: 100% !important;
      }
      #columns {
        display: flex;
        justify-content: center;
      }
    `;
    document.documentElement.appendChild(style);
  }

  // ---------- Apply ----------
  const reapply = () => {
    throttleEvents();
    killVisuals();
    lazyLoadComments();
    focusMode();
  };

  document.addEventListener('DOMContentLoaded', reapply);
  window.addEventListener('yt-navigate-finish', reapply);
})();
