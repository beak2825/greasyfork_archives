// ==UserScript==
// @name         Torn Smart Calculator (Rounded, Comma Format)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Calculator with integer-only results and thousands separator formatting (commas safe in calculations).
// @author       You
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552522/Torn%20Smart%20Calculator%20%28Rounded%2C%20Comma%20Format%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552522/Torn%20Smart%20Calculator%20%28Rounded%2C%20Comma%20Format%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.getElementById('tc-fab') || document.getElementById('tc-calc')) return;

  const addStyle = (css) => {
    if (typeof GM_addStyle === 'function') GM_addStyle(css);
    else {
      const s = document.createElement('style');
      s.textContent = css;
      document.head.appendChild(s);
    }
  };

  addStyle(`
    #tc-fab {
      position: fixed; bottom: 18px; right: 18px;
      width: 60px; height: 60px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; background:#f39c12; color:#fff;
      box-shadow: 0 8px 20px rgba(0,0,0,.35);
      z-index: 2147483647; cursor: grab; user-select:none;
    }
    #tc-calc {
      position: fixed; bottom: 90px; right: 20px;
      width: 300px; background:#1e1e1e; color:#fff;
      border-radius: 18px; overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,.55);
      z-index: 2147483647; display:none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    #tc-header {
      background:#2a2a2a; padding:10px 14px; font-weight:600;
      display:flex; align-items:center; justify-content:space-between;
      cursor: move; user-select:none;
    }
    #tc-min { background:transparent; border:none; color:#bbb; font-size:20px; cursor:pointer; }
    #tc-min:hover { color:#fff; }
    #tc-display {
      display: flex; flex-direction: column; gap: 4px;
      background:#333; padding: 6px 14px;
      text-align: right; overflow-x:auto; white-space: nowrap;
    }
    #tc-expression { font-size: 18px; color:#aaa; min-height: 24px; }
    #tc-current {
      font-size: 34px; font-weight: bold;
      border: none; background: transparent;
      color: #fff; text-align: right; outline: none;
      width: 100%;
    }
    #tc-grid {
      display:grid; grid-template-columns: repeat(4, 1fr);
      gap: 10px; padding: 14px;
    }
    .tc-btn {
      height: 58px; border:none; border-radius: 14px;
      font-size: 18px; font-weight:700; cursor:pointer;
      transition: transform .05s ease;
    }
    .tc-btn:active { transform: scale(0.97); }
    .b-num { background:#444; color:#fff; }
    .b-func { background:#666; color:#fff; }
    .b-op { background:#f39c12; color:#fff; }
    .b-zero { grid-column: span 2; }
  `);

  // HTML
  const calc = document.createElement('div');
  calc.id = 'tc-calc';
  calc.innerHTML = `
    <div id="tc-header"><span>Calculator</span><button id="tc-min" title="Hide">×</button></div>
    <div id="tc-display">
      <div id="tc-expression"></div>
      <input id="tc-current" value="0" />
    </div>
    <div id="tc-grid">
      <button class="tc-btn b-func" data-action="clear">C</button>
      <button class="tc-btn b-func" data-action="back">⌫</button>
      <button class="tc-btn b-func" data-action="percent">%</button>
      <button class="tc-btn b-op"   data-op="/">÷</button>

      <button class="tc-btn b-num" data-num="7">7</button>
      <button class="tc-btn b-num" data-num="8">8</button>
      <button class="tc-btn b-num" data-num="9">9</button>
      <button class="tc-btn b-op"  data-op="*">×</button>

      <button class="tc-btn b-num" data-num="4">4</button>
      <button class="tc-btn b-num" data-num="5">5</button>
      <button class="tc-btn b-num" data-num="6">6</button>
      <button class="tc-btn b-op"  data-op="-">−</button>

      <button class="tc-btn b-num" data-num="1">1</button>
      <button class="tc-btn b-num" data-num="2">2</button>
      <button class="tc-btn b-num" data-num="3">3</button>
      <button class="tc-btn b-op"  data-op="+">+</button>

      <button class="tc-btn b-num b-zero" data-num="0">0</button>
      <button class="tc-btn b-num" data-dot=".">.</button>
      <button class="tc-btn b-op"  data-action="eq">=</button>
    </div>
  `;
  document.body.appendChild(calc);

  const fab = document.createElement('div');
  fab.id = 'tc-fab';
  fab.textContent = '🧮';
  document.body.appendChild(fab);

  // State
  const exprEl = calc.querySelector('#tc-expression');
  const currEl = calc.querySelector('#tc-current');
  const grid = calc.querySelector('#tc-grid');
  const header = calc.querySelector('#tc-header');
  const minBtn = calc.querySelector('#tc-min');

  let a = null, op = null, input = '0', justEvaluated = false;

  // format with commas
  const fmt = (n) => {
    if (!isFinite(n)) return 'Error';
    const r = Math.round(Number(n));
    return r.toLocaleString();
  };

  // safely parse numbers (strip commas)
  const parseNum = (val) => Number(String(val).replace(/,/g, '') || '0');

  const updateDisplay = () => {
    exprEl.textContent = (a !== null ? fmt(a) : '') + (op ? ' ' + op : '');
    currEl.value = input;
  };

  const pushDigit = (d) => {
    if (justEvaluated && op === null) { a = null; input = '0'; }
    justEvaluated = false;
    if (input === '0') input = d; else input += d;
    updateDisplay();
  };

  const pushDot = () => {
    if (justEvaluated && op === null) { a = null; input = '0'; }
    justEvaluated = false;
    if (!input.includes('.')) input += '.';
    updateDisplay();
  };

  const compute = (x, oper, y) => {
    const X = parseNum(x), Y = parseNum(y);
    switch (oper) {
      case '+': return X + Y;
      case '-': return X - Y;
      case '*': return X * Y;
      case '/': return Y === 0 ? Infinity : X / Y;
      default: return Y;
    }
  };

  const applyPercent = () => {
    let b = parseNum(input);
    if (a !== null && (op === '+' || op === '-')) {
      b = a * b / 100;
    } else {
      b = b / 100;
    }
    b = Math.round(b);
    input = fmt(b);
    updateDisplay();
  };

  const acceptOperator = (nextOp) => {
    if (op !== null && input !== null && input !== '') {
      const res = compute(a, op, input);
      if (!isFinite(res)) { currEl.value = 'Error'; a = null; op = null; input = '0'; return; }
      a = Math.round(res);
      input = '0';
    } else if (a === null) {
      a = parseNum(input);
      input = '0';
    }
    op = nextOp;
    justEvaluated = false;
    updateDisplay();
  };

  const equals = () => {
    if (op === null) return;
    const res = compute(a, op, input);
    if (!isFinite(res)) { currEl.value = 'Error'; a = null; op = null; input = '0'; return; }
    a = Math.round(res);
    currEl.value = fmt(a);
    exprEl.textContent = '';
    op = null;
    input = '0';
    justEvaluated = true;
  };

  const clearAll = () => { a = null; op = null; input = '0'; justEvaluated = false; updateDisplay(); };
  const backspace = () => {
    if (justEvaluated && op === null) { clearAll(); return; }
    if (input.length <= 1 || input === '0') input = '0';
    else input = input.slice(0, -1);
    updateDisplay();
  };

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.num) pushDigit(b.dataset.num);
    else if (b.dataset.dot) pushDot();
    else if (b.dataset.op) acceptOperator(b.dataset.op);
    else if (b.dataset.action === 'eq') equals();
    else if (b.dataset.action === 'clear') clearAll();
    else if (b.dataset.action === 'back') backspace();
    else if (b.dataset.action === 'percent') applyPercent();
  });

  currEl.addEventListener('input', () => { input = currEl.value; });

  fab.addEventListener('click', () => {
    calc.style.display = (calc.style.display === 'none' || !calc.style.display) ? 'block' : 'none';
  });
  minBtn.addEventListener('click', () => { calc.style.display = 'none'; });

  const makeDraggable = (el, handle, storageKey) => {
    let startX=0, startY=0, elX=0, elY=0, dragging=false;
    const save = () => {
      localStorage.setItem(storageKey, JSON.stringify({x: el.style.left, y: el.style.top, right: el.style.right, bottom: el.style.bottom}));
    };
    const load = () => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.left || p.top) { el.style.left = p.left; el.style.top = p.top; el.style.right = 'auto'; el.style.bottom = 'auto'; }
      if (p.x) { el.style.left = p.x; el.style.top = p.y; }
      if (p.right) el.style.right = p.right;
      if (p.bottom) el.style.bottom = p.bottom;
    };
    const start = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      startX = clientX; startY = clientY; elX = rect.left; elY = rect.top; dragging = true;
      document.body.style.userSelect = 'none';
    };
    const move = (clientX, clientY) => {
      if (!dragging) return;
      const dx = clientX - startX, dy = clientY - startY;
      el.style.left = `${Math.max(6, elX + dx)}px`;
      el.style.top  = `${Math.max(6, elY + dy)}px`;
      el.style.right = 'auto'; el.style.bottom = 'auto';
    };
    const end = () => { dragging = false; document.body.style.userSelect = ''; save(); };
    handle.addEventListener('mousedown', (e) => { start(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', (e) => { const t=e.touches[0]; start(t.clientX, t.clientY); }, {passive:true});
    window.addEventListener('touchmove', (e) => { if (!dragging) return; const t=e.touches[0]; move(t.clientX, t.clientY); }, {passive:true});
    window.addEventListener('touchend', end);
    load();
  };

  makeDraggable(calc, header, 'tc-calc-pos');
  makeDraggable(fab, fab, 'tc-fab-pos');

  updateDisplay();
})();