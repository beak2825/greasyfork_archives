// ==UserScript==
// @name         RPG 虚拟按键
// @namespace    https://douglas.example
// @version      1.1.0
// @description  移动端RPG虚拟键。
// @author       1105347115
// @match        *://*.oraclecloud.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551081/RPG%20%E8%99%9A%E6%8B%9F%E6%8C%89%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/551081/RPG%20%E8%99%9A%E6%8B%9F%E6%8C%89%E9%94%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************** 键位映射与事件派发 *************************/
  function mapCharToKey(char) {
      return { key: char, code: '', keyCode: char.charCodeAt(0) };
  }

  const SPECIAL = {
    'ArrowUp':    { key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
    'ArrowDown':  { key: 'ArrowDown',  code: 'ArrowDown',  keyCode: 40 },
    'ArrowLeft':  { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
    'ArrowRight': { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
    'Enter':      { key: 'Enter',      code: 'Enter',      keyCode: 13 },
    'Escape':     { key: 'Escape',     code: 'Escape',     keyCode: 27 },
    'Space':      { key: ' ',          code: 'Space',      keyCode: 32 },
    'Shift':      { key: 'Shift',      code: 'ShiftLeft',  keyCode: 16 },
    'Control':    { key: 'Control',    code: 'ControlLeft',keyCode: 17 },
    'Z':          mapCharToKey('z'),
    'X':          mapCharToKey('x'),
    'C':          mapCharToKey('c')
  };

  function makeKeyEvent(type, def) {
    const init = {
      key: def.key, code: def.code, bubbles: true, cancelable: true,
      keyCode: def.keyCode, which: def.keyCode, charCode: 0,
      repeat: type === 'keydown' ? false : undefined
    };
    const ev = new KeyboardEvent(type, init);
    try {
      Object.defineProperty(ev, 'keyCode', { get: () => def.keyCode });
      Object.defineProperty(ev, 'which',   { get: () => def.keyCode });
    } catch (_) {}
    return ev;
  }

  function dispatchKey(type, def) {
    const canvas = document.querySelector('canvas');
    const targets = canvas ? [canvas, document, window] : [document, window];
    const ev = makeKeyEvent(type, def);
    for (const t of targets) { try { t.dispatchEvent(ev); } catch (_) {} }
  }

  /********************** 样式 *************************/
  const style = document.createElement('style');
  style.textContent = `
  .vg-toggle {
    position: fixed; left: 10px; top: 10px; z-index: 2147483646;
    padding: 6px 10px; background: rgba(0,0,0,.6); color: #fff; border-radius: 8px;
    font-size: 12px; user-select: none; -webkit-user-select: none; backdrop-filter: saturate(150%) blur(4px);
  }
  .vg-toggle:active { transform: scale(0.98); }

  .vg-panel {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483645;
    width: 100vw; background: rgba(20,20,24,.55); color: #fff;
    border-radius: 16px 16px 0 0; box-shadow: 0 -8px 24px rgba(0,0,0,.25);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, "PingFang SC","Microsoft Yahei", sans-serif;
    -webkit-user-select: none; user-select: none; touch-action: none; backdrop-filter: blur(6px);
  }
  .vg-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .vg-handle {
    width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%; background: rgba(255,255,255,.12); cursor: grab; font-size: 16px;
  }
  .vg-locked .vg-handle { display: none; }
  .vg-actions { display: flex; gap: 8px; }
  .vg-lock {
    width: 28px; height: 28px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.12); font-size: 14px;
  }

  .vg-body {
    display: flex; align-items: stretch; justify-content: space-between; gap: 8px;
    padding: 8px 10px 10px;
  }
  .vg-left, .vg-right { flex: 1 1 0; display: flex; align-items: center; justify-content: center; }
  .vg-left { justify-content: flex-start; }
  .vg-right{ justify-content: flex-end; }

  /* 方向键（左侧） */
  .vg-arrows { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 48px); gap: 6px; }
  .vg-arrows .spacer { visibility: hidden; }
  .vg-btn {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 60px; height: 48px; padding: 0 12px; border-radius: 12px;
    background: rgba(255,255,255,.12); color: #fff; font-weight: 600; font-size: 14px;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
    -webkit-tap-highlight-color: transparent; border: 0; outline: none; pointer-events: auto;
  }
  .vg-btn:active { transform: scale(.98); }
  .vg-pill { border-radius: 999px; }
  .vg-wide { min-width: 96px; }

  /* 功能键（右侧） */
  .vg-grid {
    display: grid; gap: 6px;
    grid-template-columns: repeat(3, minmax(60px, 1fr));
    grid-auto-rows: 48px;
  }

  /* 小屏优化：纵向堆叠仍保持左右优先 */
  @media (max-width: 520px) {
    .vg-btn { min-width: 48px; height: 44px; font-size: 13px; }
    .vg-arrows { grid-template-rows: repeat(2, 44px); }
    .vg-grid { grid-template-columns: repeat(3, minmax(48px, 1fr)); grid-auto-rows: 44px; }
  }

  .vg-hidden { display: none !important; }
  `;
  document.documentElement.appendChild(style);

  /********************** 顶部“隐藏/显示”按钮 *************************/
  const toggle = document.createElement('button');
  toggle.className = 'vg-toggle';
  toggle.type = 'button';
  toggle.textContent = '隐藏';
  toggle.setAttribute('tabindex', '-1');
  toggle.addEventListener('mousedown', e => e.preventDefault(), { passive: false });
  toggle.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
  document.body.appendChild(toggle);

  /********************** 面板结构 *************************/
  const panel = document.createElement('div');
  panel.className = 'vg-panel';

  // 头部：拖动手柄 + 无文字锁定按钮
  const header = document.createElement('div');
  header.className = 'vg-header';

  const handle = document.createElement('div');
  handle.className = 'vg-handle';
  handle.setAttribute('title', '拖动面板');
  handle.setAttribute('aria-label', '拖动面板');
  handle.textContent = '⤒⤓'; // 暗示可上下拖动

  const actions = document.createElement('div');
  actions.className = 'vg-actions';
  const lockBtn = document.createElement('button');
  lockBtn.className = 'vg-lock';
  lockBtn.type = 'button';
  lockBtn.setAttribute('tabindex', '-1');
  lockBtn.setAttribute('title', '锁定/解锁');
  lockBtn.textContent = '🔓'; 

  actions.appendChild(lockBtn);
  header.appendChild(handle);
  header.appendChild(actions);
  panel.appendChild(header);

  // 内容：左右分区
  const body = document.createElement('div');
  body.className = 'vg-body';

  // 左：方向键
  const left = document.createElement('div');
  left.className = 'vg-left';
  const arrows = document.createElement('div');
  arrows.className = 'vg-arrows';
  arrows.innerHTML = `
    <div class="spacer"></div>
    <button class="vg-btn vg-pill" data-key="ArrowUp" tabindex="-1">↑</button>
    <div class="spacer"></div>
    <button class="vg-btn vg-pill" data-key="ArrowLeft" tabindex="-1">←</button>
    <button class="vg-btn vg-pill" data-key="ArrowDown" tabindex="-1">↓</button>
    <button class="vg-btn vg-pill" data-key="ArrowRight" tabindex="-1">→</button>
  `;
  left.appendChild(arrows);

  // 右：功能键
  const right = document.createElement('div');
  right.className = 'vg-right';
  const grid = document.createElement('div');
  grid.className = 'vg-grid';
  const keys = [
    { label: 'Z', key: 'Z' },
    { label: 'X', key: 'X' },
    { label: 'C', key: 'C' },
    { label: 'Space', key: 'Space', wide: true },
    { label: 'Enter', key: 'Enter', wide: true },
    { label: 'Esc', key: 'Escape' },
    { label: 'Ctrl', key: 'Control' },
    { label: 'Shift', key: 'Shift' }
  ];
  for (const k of keys) {
    const btn = document.createElement('button');
    btn.className = 'vg-btn' + (k.wide ? ' vg-wide' : '');
    btn.textContent = k.label;
    btn.dataset.key = k.key;
    btn.setAttribute('tabindex', '-1');
    btn.addEventListener('mousedown', e => e.preventDefault(), { passive: false });
    btn.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
    grid.appendChild(btn);
  }
  right.appendChild(grid);

  body.appendChild(left);
  body.appendChild(right);
  panel.appendChild(body);
  document.body.appendChild(panel);

  /********************** 状态保存（Y轴位置/锁定/显示） *************************/
  const LS_KEY = `vg-fullwidth-pos-lock-${location.host}`;
  function saveState() {
    const rect = panel.getBoundingClientRect();
    const locked = panel.classList.contains('vg-locked');
    const hidden = panel.classList.contains('vg-hidden');
    localStorage.setItem(LS_KEY, JSON.stringify({ top: rect.top, locked, hidden }));
  }
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (typeof s.top === 'number') {
        panel.style.top = `${Math.max(0, Math.min(window.innerHeight - 120, s.top))}px`;
        panel.style.bottom = 'auto';
      }
      if (s.locked) setLocked(true);
      if (s.hidden) setHidden(true);
    } catch (_) {}
  }

  function setHidden(v) {
    if (v) {
      panel.classList.add('vg-hidden');
      toggle.textContent = '显示';
    } else {
      panel.classList.remove('vg-hidden');
      toggle.textContent = '隐藏';
    }
  }

  toggle.addEventListener('click', () => { setHidden(!panel.classList.contains('vg-hidden')); saveState(); });

  function setLocked(locked) {
    if (locked) {
      panel.classList.add('vg-locked');
      lockBtn.textContent = '🔒';
      // 锁定时隐藏标题（拖动手柄）
      handle.style.display = 'none';
    } else {
      panel.classList.remove('vg-locked');
      lockBtn.textContent = '🔓';
      handle.style.display = '';
    }
  }
  lockBtn.addEventListener('click', () => { setLocked(!panel.classList.contains('vg-locked')); saveState(); });

  loadState();

  /********************** 拖动（上下拖动） *************************/
  (function dragVerticalOnly() {
    let dragging = false;
    let startY = 0;
    let originTop = 0;

    function onDown(e) {
      if (panel.classList.contains('vg-locked')) return;
      dragging = true;
      const pt = getPoint(e);
      startY = pt.clientY;
      originTop = panel.getBoundingClientRect().top;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      const pt = getPoint(e);
      const dy = pt.clientY - startY;
      const top = Math.max(0, Math.min(window.innerHeight - 120, originTop + dy));
      panel.style.top = `${top}px`;
      panel.style.bottom = 'auto';
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      handle.style.cursor = 'grab';
      saveState();
    }
    function getPoint(e) { return (e.touches && e.touches[0]) || e; }

    handle.addEventListener('mousedown', onDown, { passive: false });
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('mouseup',   onUp,   { passive: true });

    handle.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove',  onMove, { passive: false });
    window.addEventListener('touchend',   onUp,   { passive: true });
    window.addEventListener('touchcancel',onUp,   { passive: true });
  })();

  /********************** 按键绑定 *************************/
  const activePresses = new Map(); // id -> {def, timer}

  function startPress(def, id) {
    if (activePresses.has(id)) return;
    dispatchKey('keydown', def);
    const timer = setInterval(() => dispatchKey('keydown', def), 65);
    activePresses.set(id, { def, timer });
  }
  function endPress(id) {
    const rec = activePresses.get(id);
    if (!rec) return;
    clearInterval(rec.timer);
    activePresses.delete(id);
    dispatchKey('keyup', rec.def);
  }
  function defFromDatasetKey(dsKey) {
    if (SPECIAL[dsKey]) return SPECIAL[dsKey];
    if (dsKey === 'Space') return SPECIAL['Space'];
    return mapCharToKey(dsKey);
  }
  function bindButton(el) {
    const dsKey = el.dataset.key;
    const def = defFromDatasetKey(dsKey);
    const id = Symbol(dsKey);
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    el.addEventListener('mousedown', (e) => { prevent(e); startPress(def, id); }, { passive: false });
    el.addEventListener('mouseup',   (e) => { prevent(e); endPress(id); },       { passive: false });
    el.addEventListener('mouseleave',(e) => { prevent(e); endPress(id); },       { passive: false });
    el.addEventListener('touchstart', (e) => { prevent(e); startPress(def, id); }, { passive: false });
    el.addEventListener('touchend',   (e) => { prevent(e); endPress(id); },        { passive: false });
    el.addEventListener('touchcancel',(e) => { prevent(e); endPress(id); },        { passive: false });
    el.setAttribute('tabindex', '-1');
  }

  panel.querySelectorAll('.vg-btn').forEach(bindButton);

  // 页面不可见时防止“卡键”
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      for (const [id, rec] of activePresses.entries()) {
        clearInterval(rec.timer);
        dispatchKey('keyup', rec.def);
      }
      activePresses.clear();
    }
  });

})();
