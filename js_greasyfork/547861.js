// ==UserScript==
// @name         YouTube Performance GPU Optimized v2.4 (Hardware acceleration on)
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Donanım hızlandırma açık kullanım için: AV1 kapalı, VP9 serbest. Ambient mode, efektler ve animasyonlar kapalı. DOM ve yorumlar optimize edildi.
// @author       *
// @license      MIT
// @match        *://*.youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547861/YouTube%20Performance%20GPU%20Optimized%20v24%20%28Hardware%20acceleration%20on%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547861/YouTube%20Performance%20GPU%20Optimized%20v24%20%28Hardware%20acceleration%20on%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 1) Codec override (AV1 kapalı, VP9 serbest) ----------
  const origCanPlayType = HTMLMediaElement.prototype.canPlayType;
  HTMLMediaElement.prototype.canPlayType = function (type) {
    if (type && /codecs="?av01/i.test(type)) return '';
    return origCanPlayType.call(this, type);
  };

  if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    const origDecodingInfo = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);
    navigator.mediaCapabilities.decodingInfo = async (cfg) => {
      const ct = cfg?.video?.contentType || '';
      if (/codecs="?av01/i.test(ct)) {
        return { supported: false, powerEfficient: false, smooth: false };
      }
      return origDecodingInfo(cfg);
    };
  }

  // ---------- 2) Event throttling ----------
  function throttleEvents(root = document) {
    const throttleMs = 25; // GPU açıkken biraz daha hızlı olabilir
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

  // ---------- 3) DOM optimize ----------
  function slimDOM() {
    document.querySelectorAll('ytd-rich-item-renderer,ytd-compact-video-renderer')
      .forEach(el => {
        if (!el.dataset.gpuOptimized) {
          el.dataset.gpuOptimized = '1';
          el.style.display = "none";
          const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
              el.style.display = "";
              obs.disconnect();
            }
          }, { rootMargin: '800px' });
          observer.observe(el);
        }
      });
  }

  // ---------- 4) Ambient & efektleri kapatma ----------
  function killVisuals() {
    const style = document.createElement('style');
    style.textContent = `
      .ytp-ambient-light,
      .ytp-ambient-mode-enabled,
      ytd-watch-flexy[ambient-mode-enabled] .ytp-ambient-light,
      ytd-watch-flexy[ambient-mode-enabled] .html5-video-player::before {
        display: none !important;
      }

      /* GPU shader yükünü azalt */
      ytd-app, ytd-watch-flexy, #content, #page-manager {
        backdrop-filter: none !important;
        filter: none !important;
        animation: none !important;
        transition: none !important;
        will-change: auto !important;
        transform: none !important;
      }
    `;
    document.documentElement.appendChild(style);

    let mo;
    const startAmbientObs = () => {
      if (mo) return;
      const flexy = document.querySelector('ytd-watch-flexy');
      if (flexy) {
        mo = new MutationObserver(() => {
          flexy.removeAttribute('ambient-mode-enabled');
        });
        mo.observe(flexy, { attributes: true, attributeFilter: ['ambient-mode-enabled'] });
      }
    };
    document.addEventListener('DOMContentLoaded', startAmbientObs);
    window.addEventListener('yt-navigate-finish', startAmbientObs);
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

  // ---------- Apply ----------
  const reapply = () => {
    throttleEvents();
    slimDOM();
    killVisuals();
    lazyLoadComments();
  };

  document.addEventListener('DOMContentLoaded', reapply);
  window.addEventListener('yt-navigate-finish', reapply);
})();
