// ==UserScript==
// @name         HitmanZ's Dark Mode Toggle
// @namespace    http://tampermonkey.net/
// @version      11.4
// @description  Toggle dark mode with F key. Some UI elements may still have bugs.
// @author       HitmanZ
// @license      MIT
// @match        *://gats.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549985/HitmanZ%27s%20Dark%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/549985/HitmanZ%27s%20Dark%20Mode%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let darkMode = localStorage.getItem('gatsDarkMode') === 'true';

  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isTyping = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );

    if (!isTyping && e.key.toLowerCase() === 'f') {
      darkMode = !darkMode;
      localStorage.setItem('gatsDarkMode', darkMode);
      updateStyles();
      showStatus(darkMode ? 'Dark Mode ON' : 'Dark Mode OFF');
    }
  });

  function showStatus(message) {
    const statusDiv = document.createElement('div');
    Object.assign(statusDiv.style, {
      position: 'absolute',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      fontSize: '20px'
    });
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 1500);
  }

  function applyMenuStyle() {
    const menu = document.querySelector('#menu');
    if (menu) {
      menu.style.color = darkMode ? 'white' : '';
    }
  }

  function applyFloatingTextStyle() {
    const floatingElements = document.querySelectorAll('[style*="font-size"]');
    floatingElements.forEach(el => {
      const text = el.textContent.toLowerCase();
      const isFloating = text.includes('+') || text.includes('killed') || text.includes('xp');
      if (isFloating) {
        el.style.color = darkMode ? 'white' : '';
        el.style.textShadow = darkMode ? '0 0 2px black' : '';
      }
    });
  }

  function overrideCanvas() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const originalFillRect = ctx.fillRect.bind(ctx);
    ctx.fillRect = function (x, y, w, h) {
      if (darkMode && x === 0 && y === 0) {
        ctx.fillStyle = '#3b373d';
      }
      originalFillRect(x, y, w, h);
    };

    const strokeStyleDescriptor = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle');
    Object.defineProperty(ctx, 'strokeStyle', {
      set(value) {
        if (darkMode && typeof value === 'string' && value.includes('#')) {
          value = '#5e5661';
        }
        strokeStyleDescriptor.set.call(this, value);
      },
      get() {
        return strokeStyleDescriptor.get.call(this);
      }
    });

    const originalStroke = ctx.stroke.bind(ctx);
    ctx.stroke = function () {
      if (darkMode && ctx.lineWidth === 2) {
        ctx.strokeStyle = 'white';
      }
      originalStroke();
    };
  }

  function updateStyles() {
    applyMenuStyle();
    applyFloatingTextStyle();
  }

  function animationLoop() {
    overrideCanvas();
    updateStyles();
    requestAnimationFrame(animationLoop);
  }

  animationLoop();
})();
