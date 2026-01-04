// ==UserScript==
// @name         minecraft keystrokes draggable
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  simple keystrokes
// @author       ragsist
// @match        *://arras.io/*
// @match        *://*.arras.io/*
// @grant        none
// @license      r
// @downloadURL https://update.greasyfork.org/scripts/559980/minecraft%20keystrokes%20draggable.user.js
// @updateURL https://update.greasyfork.org/scripts/559980/minecraft%20keystrokes%20draggable.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Configuration
  const KEY_SIZE = 45;
  const GAP = 6;
  const MOUSE_WIDTH = Math.round((KEY_SIZE * 3 + GAP * 2 - GAP) / 2);

  // Load font
  const fontLink = document.createElement('style');
  fontLink.textContent = `@import url('https://fonts.cdnfonts.com/css/minecraft-4');`;
  document.head.appendChild(fontLink);

  // Create styles
  const styles = document.createElement('style');
  styles.textContent = `
    #keystroke-hud {
      position: fixed;
      bottom: 80px;
      left: 40px;
      display: grid;
      grid-template-columns: repeat(3, ${KEY_SIZE}px);
      grid-template-rows: repeat(3, ${KEY_SIZE}px);
      gap: ${GAP}px;
      user-select: none;
      z-index: 99999;
      cursor: move;
    }

    .keystroke-key {
      width: ${KEY_SIZE}px;
      height: ${KEY_SIZE}px;
      background: #141414;
      color: #fff;
      font-family: "Minecraft Regular", "Minecraft", monospace;
      font-size: 20px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.12s, color 0.12s;
      pointer-events: none;
    }

    .keystroke-key.active {
      background: #fff;
      color: #000;
    }

    #keystroke-mouse-row {
      grid-column: 1 / -1;
      display: flex;
      gap: ${GAP}px;
      justify-content: center;
    }

    #keystroke-mouse-row .keystroke-key {
      width: ${MOUSE_WIDTH}px;
      font-size: 16px;
    }
  `;
  document.head.appendChild(styles);

  // Create HUD
  const hud = document.createElement('div');
  hud.id = 'keystroke-hud';
  hud.innerHTML = `
    <div></div>
    <div class="keystroke-key" data-key="Z">Z</div>
    <div></div>
    <div class="keystroke-key" data-key="Q">Q</div>
    <div class="keystroke-key" data-key="S">S</div>
    <div class="keystroke-key" data-key="D">D</div>
    <div id="keystroke-mouse-row">
      <div class="keystroke-key" data-key="LMB">LMB</div>
      <div class="keystroke-key" data-key="RMB">RMB</div>
    </div>
  `;
  document.body.appendChild(hud);

  // Get all key elements
  const keyElements = {};
  hud.querySelectorAll('.keystroke-key').forEach(el => {
    keyElements[el.dataset.key] = el;
  });

  // Key press handlers
  function setKeyActive(key, active) {
    if (keyElements[key]) {
      if (active) {
        keyElements[key].classList.add('active');
      } else {
        keyElements[key].classList.remove('active');
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    setKeyActive(key, true);
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toUpperCase();
    setKeyActive(key, false);
  });

  document.addEventListener('mousedown', (e) => {
    const button = e.button === 0 ? 'LMB' : 'RMB';
    setKeyActive(button, true);
  });

  document.addEventListener('mouseup', (e) => {
    const button = e.button === 0 ? 'LMB' : 'RMB';
    setKeyActive(button, false);
  });

  // Dragging functionality
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  hud.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - hud.getBoundingClientRect().left;
    dragOffsetY = e.clientY - hud.getBoundingClientRect().top;
    hud.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffsetX;
      const newY = e.clientY - dragOffsetY;
      hud.style.left = newX + 'px';
      hud.style.top = newY + 'px';
      hud.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      hud.style.cursor = 'move';
    }
  });

})();