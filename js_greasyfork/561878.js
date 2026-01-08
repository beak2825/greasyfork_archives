// ==UserScript==
// @name         Chess.com Square Labels
// @namespace    https://scripts.ashish.top
// @version      1.0.0
// @description  Displays algebraic square labels (a1–h8) directly on the chessboard, with adjustable opacity and a draggable control panel.
// @author       Ashish Agarwal
// @homepage     https://scripts.ashish.top
// @supportURL   https://ashish.top
// @match        https://www.chess.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561878/Chesscom%20Square%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/561878/Chesscom%20Square%20Labels.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ========= USER CONFIG ========= */

  const customize = true;

  const DEFAULT_DARK = 0.75;
  const DEFAULT_LIGHT = 0.28;

  /* ========= GM STORAGE ========= */

  const load = (key, fallback) => {
    const value = GM_getValue(key);
    return value === undefined ? fallback : value;
  };

  const save = (key, value) => GM_setValue(key, value);

  /* ========= CSS ========= */

  function injectCSS() {
    if (document.getElementById('square-label-css')) return;

    const style = document.createElement('style');
    style.id = 'square-label-css';
    style.textContent = `
      .square-labels {
        position: absolute;
        inset: 0;
        pointer-events: none;
        --dark-opacity: ${load('darkOpacity', DEFAULT_DARK)};
        --light-opacity: ${load('lightOpacity', DEFAULT_LIGHT)};
      }

      .__square {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        text-anchor: middle;
        dominant-baseline: central;
        paint-order: stroke;
      }

      .__dark_square {
        font-size: 6.4px;
        font-weight: 600;
        fill: #f3f1ee;
        stroke: rgba(0,0,0,0.6);
        stroke-width: 0.35px;
        opacity: var(--dark-opacity);
      }

      .__light_square {
        font-size: 6.1px;
        font-weight: 500;
        fill: #2a2a2a;
        opacity: var(--light-opacity);
      }

      .label-panel {
        position: fixed;
        width: 260px;
        background: #111;
        color: #eee;
        font-family: system-ui, -apple-system, Segoe UI, sans-serif;
        border-radius: 10px;
        padding: 12px 14px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        z-index: 999999;
        user-select: none;
      }

      .label-panel .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        cursor: move;
        gap: 8px;
      }

      .label-panel .close-btn {
        font-size: 14px;
        cursor: pointer;
        opacity: 0.7;
      }

      .label-panel .close-btn:hover {
        opacity: 1;
      }

      .label-panel h1 {
        font-size: 14px;
        margin: 0 0 4px;
      }

      .label-panel .sub {
        font-size: 12px;
        opacity: 0.75;
        margin-bottom: 8px;
      }

      .label-panel a {
        color: #6ab0ff;
        text-decoration: none;
      }

      .label-panel a:hover {
        text-decoration: underline;
      }

      .label-panel .row {
        margin-top: 10px;
      }

      .label-panel label {
        font-size: 12px;
        display: block;
        margin-bottom: 4px;
      }

      .label-panel input[type="range"] {
        width: 100%;
      }

      .label-panel .buttons {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .label-panel button {
        flex: 1;
        background: #222;
        color: #eee;
        border: none;
        padding: 6px 8px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
      }

      .label-panel button:hover {
        background: #333;
      }

      .label-panel .feedback {
        font-size: 12px;
        text-align: center;
        margin-top: 8px;
        height: 18px;
      }

      .label-panel .feedback.success { color: #4ade80; }
      .label-panel .feedback.error { color: #f87171; }
    `;

    document.head.appendChild(style);
  }

  /* ========= LABEL RENDERING ========= */

  function renderLabels(board, flipped) {
    board.querySelector('.square-labels')?.remove();

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.classList.add('square-labels');

    const files = ['a','b','c','d','e','f','g','h'];
    const size = 12.5;

    for (let rank = 8; rank >= 1; rank--) {
      for (let file = 0; file < 8; file++) {
        const isDark = (file + rank - 1) % 2 === 0;
        const text = document.createElementNS(NS, 'text');

        const f = flipped ? files[7 - file] : files[file];
        const r = flipped ? 9 - rank : rank;

        text.setAttribute('x', file * size + size / 2);
        text.setAttribute('y', (8 - rank) * size + size / 2);
        text.textContent = `${f}${r}`;

        text.classList.add('__square', isDark ? '__dark_square' : '__light_square');
        svg.appendChild(text);
      }
    }

    board.insertBefore(svg, board.firstChild);
  }

  /* ========= BOARD OBSERVER ========= */

  function observeBoard(board) {
    const update = () => renderLabels(board, board.classList.contains('flipped'));

    new MutationObserver(update).observe(board, {
      attributes: true,
      attributeFilter: ['class']
    });

    update();
  }

  /* ========= PANEL ========= */

  function makeDraggable(panel) {
    const header = panel.querySelector('.header');
    let sx, sy, sl, st;

    header.addEventListener('mousedown', e => {
      if (e.target.classList.contains('close-btn')) return;

      sx = e.clientX;
      sy = e.clientY;
      sl = panel.offsetLeft;
      st = panel.offsetTop;

      const move = ev => {
        panel.style.left = sl + (ev.clientX - sx) + 'px';
        panel.style.top = st + (ev.clientY - sy) + 'px';
      };

      const up = () => {
        save('panelLeft', panel.style.left);
        save('panelTop', panel.style.top);
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  function createPanel() {
    if (!customize || document.querySelector('.label-panel')) return;

    const panel = document.createElement('div');
    panel.className = 'label-panel';
    panel.style.left = load('panelLeft', '14px');
    panel.style.top = load('panelTop', '14px');

    panel.innerHTML = `
      <div class="header">
        <div>
          <h1>Chess.com Square Labels</h1>
          <div class="sub">
            By <a href="https://ashish.top" target="_blank">Ashish Agarwal</a><br>
            <a href="https://scripts.ashish.top" target="_blank">scripts.ashish.top</a>
          </div>
        </div>
        <div class="close-btn">✕</div>
      </div>

      <div class="row">
        <label>Dark square opacity</label>
        <input type="range" min="0" max="1" step="0.01" id="dark">
      </div>

      <div class="row">
        <label>Light square opacity</label>
        <input type="range" min="0" max="1" step="0.01" id="light">
      </div>

      <div class="buttons">
        <button id="save">Save</button>
        <button id="disable">Disable</button>
        <button id="reset">Reset</button>
      </div>

      <div class="feedback"></div>
    `;

    document.body.appendChild(panel);
    makeDraggable(panel);

    panel.querySelector('.close-btn').onclick = () => panel.remove();

    const labels = document.querySelector('.square-labels');
    const dark = panel.querySelector('#dark');
    const light = panel.querySelector('#light');
    const feedback = panel.querySelector('.feedback');

    dark.value = load('darkOpacity', DEFAULT_DARK);
    light.value = load('lightOpacity', DEFAULT_LIGHT);

    dark.oninput = () => labels.style.setProperty('--dark-opacity', dark.value);
    light.oninput = () => labels.style.setProperty('--light-opacity', light.value);

    panel.querySelector('#save').onclick = () => {
      save('darkOpacity', dark.value);
      save('lightOpacity', light.value);
      feedback.textContent = 'Saved';
      feedback.className = 'feedback success';
      setTimeout(() => feedback.textContent = '', 1500);
    };

    panel.querySelector('#disable').onclick = () => {
      dark.value = light.value = 0;
      labels.style.setProperty('--dark-opacity', 0);
      labels.style.setProperty('--light-opacity', 0);
    };

    panel.querySelector('#reset').onclick = () => {
      dark.value = DEFAULT_DARK;
      light.value = DEFAULT_LIGHT;
      save('darkOpacity', dark.value);
      save('lightOpacity', light.value);
      labels.style.setProperty('--dark-opacity', DEFAULT_DARK);
      labels.style.setProperty('--light-opacity', DEFAULT_LIGHT);
    };
  }

  /* ========= BOOT ========= */

  injectCSS();

  let attempts = 0;
  const timer = setInterval(() => {
    const board =
      document.querySelector('#board-analysis-board') ||
      document.querySelector('wc-chess-board');

    if (board) {
      observeBoard(board);
      createPanel();
      clearInterval(timer);
    }

    if (++attempts > 40) clearInterval(timer);
  }, 500);
})();
