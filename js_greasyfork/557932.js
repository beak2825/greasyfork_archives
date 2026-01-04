// ==UserScript==
// @name         Diamond Valley Auto Movement (rAF)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Super-stable auto movement using requestAnimationFrame (no drift, instant stop)
// @match        https://diamondvalley.withgoogle.com/intl/ALL_tw/game/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557932/Diamond%20Valley%20Auto%20Movement%20%28rAF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557932/Diamond%20Valley%20Auto%20Movement%20%28rAF%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =====================================================
  // 1. ROUTE STEPS
  // =====================================================
  const steps = [
    // minecart 1
    { keys: ['ArrowRight'], hold: 850, pressX: false },
    { keys: ['ArrowUp'], hold: 400, pressX: true },
    // minecart 2
    { keys: ['ArrowDown'], hold: 400, pressX: false },
    { keys: ['ArrowRight', 'ArrowDown'], hold: 1750, pressX: true },
    // minecart 3
    { keys: ['ArrowRight'], hold: 1700, pressX: false },
    { keys: ['ArrowUp'], hold: 2800, pressX: false },
    { keys: ['ArrowLeft'], hold: 400, pressX: false },
    { keys: ['ArrowUp'], hold: 750, pressX: false },
    { keys: ['ArrowRight'], hold: 700, pressX: true },
    // minecart 4
    { keys: ['ArrowRight', 'ArrowDown'], hold: 2800, pressX: false },
    { keys: ['ArrowRight'], hold: 1000, pressX: true },
    // minecart 5
    { keys: ['ArrowDown'], hold: 800, pressX: false },
    { keys: ['ArrowLeft'], hold: 2550, pressX: true },
    // minecart 6
    { keys: ['ArrowRight', 'ArrowDown'], hold: 2300, pressX: true },
    // mineral 1
    { keys: ['ArrowRight', 'ArrowUp'], hold: 1550, pressX: true },
    // mineral 2
    { keys: ['ArrowUp'], hold: 1000, pressX: false },
    { keys: ['ArrowLeft'], hold: 2600, pressX: false },
    { keys: ['ArrowUp'], hold: 300, pressX: true },
    // mineral 3
    { keys: ['ArrowUp'], hold: 1450, pressX: false },
    { keys: ['ArrowLeft'], hold: 1500, pressX: true },
    // mineral 4
    { keys: ['ArrowLeft'], hold: 1600, pressX: false },
    { keys: ['ArrowDown'], hold: 1000, pressX: false },
    { keys: ['ArrowLeft'], hold: 400, pressX: true },
    // mineral 5
    { keys: ['ArrowLeft'], hold: 2000, pressX: true },
    // mineral 6
    { keys: ['ArrowDown'], hold: 1600, pressX: true },
    // mineral 7
    { keys: ['ArrowRight'], hold: 3300, pressX: false },
    { keys: ['ArrowDown'], hold: 1250, pressX: true },
    // mineral 8
    { keys: ['ArrowLeft'], hold: 800, pressX: false },
    { keys: ['ArrowLeft', 'ArrowDown'], hold: 900, pressX: true },
    // mineral 9
    { keys: ['ArrowRight', 'ArrowUp'], hold: 800, pressX: false },
    { keys: ['ArrowRight'], hold: 1800, pressX: false },
    { keys: ['ArrowRight', 'ArrowUp'], hold: 1200, pressX: true },
    // Retrun
    { keys: ['ArrowUp'], hold: 600, pressX: false },
    { keys: ['ArrowLeft'], hold: 5300, pressX: false },
    { keys: ['ArrowUp'], hold: 1550, pressX: false },
    { keys: ['ArrowLeft'], hold: 2000, pressX: false },
    { keys: ['ArrowLeft', 'ArrowUp'], hold: 500, pressX: false },
  ];

  // =====================================================
  // 2. STYLE FIXES
  // =====================================================
  GM_addStyle(`
         canvas {
             width: 1000px !important;
             height: 600px !important;
         }
        #dv-auto-panel {
            position: fixed;
            top: 10px;
            left: 500px;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.85);
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 999999;
            text-align: center;
        }
        #dv-btn {
            font-size: 18px;
            padding: 8px 14px;
            border: none;
            background: #4CAF50;
            color: white;
            border-radius: 6px;
            cursor: pointer;
        }
        #dv-btn.red {
            background: #c82333 !important;
        }
    `);

  // =====================================================
  // 3. PANEL UI
  // =====================================================
  const panel = document.createElement('div');
  panel.id = 'dv-auto-panel';
  panel.innerHTML = `<button id="dv-btn">START</button>`;
  document.body.appendChild(panel);

  const btn = document.getElementById('dv-btn');

  function centerPanel() {
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      panel.style.left = (rect.left + rect.width / 2) + "px";
      panel.style.transform = "translateX(-50%)";
  }
  setInterval(centerPanel, 100);

  // =====================================================
  // 4. KEY HELPERS
  // =====================================================
  function keyDown(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  }

  function keyUp(key) {
    document.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
  }

  function releaseAllKeys() {
    ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','x'].forEach(k => keyUp(k));
  }

  async function pressXAction() {
    keyDown('x');
    await new Promise(r => setTimeout(r, 500));
    keyUp('x');
    await new Promise(r => setTimeout(r, 80));
  }

  // =====================================================
  // 5. rAF MOVEMENT ENGINE
  // =====================================================
  let stopNow = false;

  async function runStepsForever() {
    stopNow = false;

    while (!stopNow) {
      for (let step of steps) {
        if (stopNow) break;

        const { keys, hold, pressX } = step;

        // Press keys
        keys.forEach(k => keyDown(k));

        // rAF loop using actual elapsed time
        let start = performance.now();

        /* eslint-disable no-loop-func */
        await new Promise(resolve => {
          function loop(now) {
            if (stopNow || now - start >= hold) {
              resolve();
              return;
            }
            requestAnimationFrame(loop);
          }
          requestAnimationFrame(loop);
        });

        // Release keys
        keys.forEach(k => keyUp(k));

        if (stopNow) break;

        if (pressX) await pressXAction();
      }
    }

    releaseAllKeys();
    resetButton();
  }

  // =====================================================
  // 6. BUTTON LOGIC
  // =====================================================
  btn.addEventListener('click', () => {
    if (btn.textContent === 'START') {
      btn.textContent = 'END';
      btn.classList.add('red');
      stopNow = false;
      runStepsForever();
    } else {
      stopNow = true;
      releaseAllKeys();
      resetButton();
    }
  });

  function resetButton() {
    btn.textContent = 'START';
    btn.classList.remove('red');
  }

})();
