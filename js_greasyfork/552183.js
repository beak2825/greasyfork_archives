// ==UserScript==
// @name         XNXX.com – Download Button
// @namespace    http://tampermonkey.net/
// @version      2025.06.3
// @description  add a download button on bottom right
// @author       Guile93
// @match        https://www.xnxx.com/*
// @match        https://player.xnxx.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552183/XNXXcom%20%E2%80%93%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/552183/XNXXcom%20%E2%80%93%20Download%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const BUTTON_ID = 'xnxx-download-btn';
  function findUrl() {
    if (window.html5player && typeof html5player.getVideoUrlHigh === 'function') {
      return html5player.getVideoUrlHigh() || html5player.getVideoUrlLow();
    }
    const html = document.documentElement.innerHTML;
    const mHigh = html.match(/setVideoUrlHigh\('([^']+\.mp4)/i);
    if (mHigh && mHigh[1]) return mHigh[1];
    const mLow = html.match(/setVideoUrlLow\('([^']+\.mp4)/i);
    if (mLow && mLow[1]) return mLow[1];
    return null;
  }
  const url = findUrl();
  if (!url) return;
  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.textContent = '⬇ Download';
  btn.type = 'button';
  document.body.appendChild(btn);
  btn.onclick = () => window.open(url, '_blank');
  const style = document.createElement('style');
  style.textContent = `
    #${BUTTON_ID} {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      padding: 10px 20px;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #b400ff, #8c00cc);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,.5);
      transition: transform .15s ease, box-shadow .15s ease, background .3s ease;
      backdrop-filter: blur(4px);
      filter: none !important;
      outline: none;
    }
    #${BUTTON_ID}:hover {
      transform: translateY(-2px) scale(1.05);
      background: linear-gradient(135deg, #c740ff, #a000f2);
      box-shadow: 0 8px 20px rgba(0,0,0,.6);
    }
    #${BUTTON_ID}:active {
      transform: translateY(0) scale(.97);
      box-shadow: 0 3px 10px rgba(0,0,0,.4);
    }
    #${BUTTON_ID}::before,
    #${BUTTON_ID}::after {
      display: none !important;
      content: none !important;
    }
  `;
  document.head.appendChild(style);
})();
