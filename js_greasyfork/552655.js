// ==UserScript==
// @name         Shopee Video Detector (with On-Screen URL Box)
// @namespace    https://markg.dev/
// @version      1.2
// @description  Detect Shopee PDP .mp4 or .m3u8 video URLs and show them in a floating textbox
// @match        https://shopee.ph/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552655/Shopee%20Video%20Detector%20%28with%20On-Screen%20URL%20Box%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552655/Shopee%20Video%20Detector%20%28with%20On-Screen%20URL%20Box%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGETS = ['/api/v4/pdp/get_pc', '/api/v4/pdp/get', '/api/v4/item/get'];
  const isMp4 = (s) => /\.mp4(\?|#|$)/i.test(String(s || ''));
  const isHls = (s) => /\.m3u8(\?|#|$)/i.test(String(s || ''));
  const looksPdp = (u) => TARGETS.some(t => String(u).includes(t));

  // 🧩 Floating UI
  const box = document.createElement('textarea');
  box.id = 'svd-box';
  Object.assign(box.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '320px',
    height: '60px',
    zIndex: 99999,
    resize: 'none',
    background: 'rgba(0,0,0,0.75)',
    color: '#0f0',
    fontSize: '12px',
    border: '1px solid #0f0',
    borderRadius: '6px',
    padding: '6px',
    outline: 'none'
  });
  box.placeholder = 'Waiting for Shopee video...';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(box));

  function updateBox(text) {
    box.value = text;
  }

  function findMediaUrls(obj) {
    let mp4 = '', hls = '';
    const stack = [obj];
    while (stack.length) {
      const v = stack.pop();
      if (typeof v === 'string') {
        if (!mp4 && isMp4(v)) mp4 = v;
        else if (!hls && isHls(v)) hls = v;
        if (mp4 && hls) break;
      } else if (v && typeof v === 'object') {
        if (Array.isArray(v)) for (let i = v.length - 1; i >= 0; i--) stack.push(v[i]);
        else for (const k in v) stack.push(v[k]);
      }
    }
    return { mp4, hls };
  }

  function logFind(type, url, origin) {
    console.log(`[SVD] ${type} detected (${origin}):`, url);
    updateBox(`${type.toUpperCase()}:\n${url}`);
  }

  // Intercept fetch
  const _fetch = window.fetch;
  window.fetch = function (...args) {
    const url = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url) || '';
    const watch = looksPdp(url);
    const p = _fetch.apply(this, args);
    if (!watch) return p;
    return p.then(resp => {
      try {
        const clone = resp.clone();
        clone.json().then(j => {
          const { mp4, hls } = findMediaUrls(j);
          if (mp4) logFind('🎬 MP4', mp4, 'fetch');
          else if (hls) logFind('📺 HLS', hls, 'fetch');
          else updateBox('⚠️ No video found in fetch.');
        }).catch(() => {});
      } catch (_) {}
      return resp;
    });
  };

  // Intercept XHR
  const XO = XMLHttpRequest.prototype.open;
  const XS = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u, ...r) {
    this.__svd_watch = looksPdp(u);
    this.__svd_url = u;
    return XO.call(this, m, u, ...r);
  };
  XMLHttpRequest.prototype.send = function (...a) {
    if (this.__svd_watch) {
      this.addEventListener('load', () => {
        try {
          if (this.responseType && this.responseType !== '' && this.responseType !== 'text') return;
          const txt = this.responseText;
          if (!txt) return;
          const j = JSON.parse(txt);
          const { mp4, hls } = findMediaUrls(j);
          if (mp4) logFind('🎬 MP4', mp4, 'xhr');
          else if (hls) logFind('📺 HLS', hls, 'xhr');
          else updateBox('⚠️ No video found in XHR.');
        } catch (_) {}
      });
    }
    return XS.apply(this, a);
  };

  console.log('✅ Shopee Video Detector (UI) active. Look for green box bottom-right.');
})();
