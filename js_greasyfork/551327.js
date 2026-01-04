// ==UserScript==
// @name         OvOKeyOverlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FPS counter, input lag meter and arrow key overlay for OvO (all versions)
// @author       gh0styFPS
// @license      MIT
// @match        https://ovo.drakeerv.com/versions/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551327/OvOKeyOverlay.user.js
// @updateURL https://update.greasyfork.org/scripts/551327/OvOKeyOverlay.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    #ovoOverlay {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      font-family: 'Orbitron', sans-serif;
      font-size: 16px;
      font-weight: bold;
      padding: 8px 12px;
      border-radius: 6px;
      user-select: none;
      pointer-events: none;
      text-align: center;
    }
    #ovoFPS, #ovoLag {
      margin-bottom: 6px;
    }
    .arrowGrid {
      display: grid;
      grid-template-columns: repeat(3, 32px);
      grid-gap: 4px;
      justify-content: center;
    }
    .key {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
    }
    .key.active {
      background: #00ffcc;
      color: black;
    }
  `);

  const overlay = document.createElement('div');
  overlay.id = 'ovoOverlay';
  overlay.innerHTML = `
    <div id="ovoFPS">FPS: ...</div>
    <div id="ovoLag">Input Lag: ...</div>
    <div class="arrowGrid">
      <div></div><div class="key" data-key="ArrowUp">↑</div><div></div>
      <div class="key" data-key="ArrowLeft">←</div><div class="key" data-key="ArrowDown">↓</div><div class="key" data-key="ArrowRight">→</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const fpsBox = document.getElementById('ovoFPS');
  const lagBox = document.getElementById('ovoLag');

  // FPS counter
  let frameCount = 0;
  let lastTime = performance.now();

  function fpsLoop() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fpsBox.textContent = `FPS: ${frameCount}`;
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(fpsLoop);
  }
  requestAnimationFrame(fpsLoop);

  // Input lag measurement
  let lastKeyPressTime = null;

  function measureLag() {
    if (lastKeyPressTime !== null) {
      const lag = performance.now() - lastKeyPressTime;
      lagBox.textContent = `Input Lag: ${lag.toFixed(1)} ms`;
      lastKeyPressTime = null;
    }
    requestAnimationFrame(measureLag);
  }
  requestAnimationFrame(measureLag);

  window.addEventListener('keydown', () => {
    lastKeyPressTime = performance.now();
  });

  // Arrow key overlay
  const keyElements = {};
  document.querySelectorAll('.key').forEach(el => {
    keyElements[el.dataset.key.toLowerCase()] = el;
  });

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (keyElements[k]) keyElements[k].classList.add('active');
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (keyElements[k]) keyElements[k].classList.remove('active');
  });

})();