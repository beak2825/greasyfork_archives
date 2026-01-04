// ==UserScript==
// @name         Torn Chain Timer Overlay
// @namespace    torn.chain.overlay
// @version      0.5
// @author       yoyo
// @description  Floating chain timer overlay for Torn — drag, resize, lock, keep it visible anywhere. Compact controls below.
// @license      MIT
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554280/Torn%20Chain%20Timer%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/554280/Torn%20Chain%20Timer%20Overlay.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Selectors from your capture, plus fallbacks ---
  const SEL_TIMER_EXACT   = '#sidebar > div > div > div:nth-of-type(2) > div:nth-of-type(1) > a:nth-of-type(5) > div:nth-of-type(1) > span > p';
  const SEL_COUNTER_EXACT = '#sidebar > div > div > div:nth-of-type(2) > div:nth-of-type(1) > a:nth-of-type(5) > div:nth-of-type(1) > p:nth-of-type(2)';
  const q = (sel, root = document) => root.querySelector(sel);
  const findSidebar = () => document.getElementById('sidebar') || q('#sidebar, div[id*="sidebar"]');
  const classStartsWith = (el, prefix) => el && Array.from(el.classList || []).some(c => c.startsWith(prefix));

  const findTimer = () => {
    let el = q(SEL_TIMER_EXACT) || q('p.bar-timeleft___B9RGV');
    if (el) return el;
    const root = findSidebar() || document;
    return Array.from(root.querySelectorAll('p')).find(p =>
      classStartsWith(p, 'bar-timeleft') || /^\d{1,2}:\d{2}$/.test(p.textContent.trim())
    ) || null;
  };

  const findCounter = () => {
    let el = q(SEL_COUNTER_EXACT) || q('p.bar-value___uxnah');
    if (el) return el;
    const root = findSidebar() || document;
    return Array.from(root.querySelectorAll('p')).find(p =>
      classStartsWith(p, 'bar-value') && /\/\s*\d+k/i.test(p.textContent)
    ) || null;
  };

  // --- Styles (compact, controls underneath) ---
  GM_addStyle(`
    .cto-wrap {
      position: fixed; z-index: 2147483646;
      display: inline-flex; flex-direction: column; align-items: center; gap: 4px;
      background: rgba(18,18,18,.72);
      color: #fff; padding: 6px 8px 8px; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.35);
      -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
      user-select: none; cursor: grab;
    }
    .cto-wrap.cto-locked { background: rgba(18,18,18,.38); cursor: default; }
    .cto-wrap.cto-dragging { cursor: grabbing !important; }
    .cto-top { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .cto-text {
      font-weight: 900; letter-spacing: .5px; text-shadow: 0 1px 2px rgba(0,0,0,.35);
      line-height: 1; white-space: nowrap;
    }
    .cto-sub { font-weight: 600; opacity: .92; white-space: nowrap; }
    .cto-controls {
      display: flex; gap: 6px; margin-top: 2px;
      opacity: .85;
    }
    .cto-btn {
      font: 10px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #e6e6e6; background: rgba(255,255,255,.12);
      border: 0; border-radius: 6px; padding: 3px 6px; cursor: pointer;
    }
    .cto-btn:hover { background: rgba(255,255,255,.18); }
    .cto-resize {
      position: absolute; right: 2px; bottom: 2px;
      width: 12px; height: 12px; border-radius: 3px;
      background:
        linear-gradient(135deg, rgba(255,255,255,.6) 0 50%, rgba(255,255,255,.25) 50% 100%);
      opacity: .7;
      cursor: nwse-resize;
    }
    .cto-wrap.cto-resizing { cursor: nwse-resize !important; }
    .cto-toast {
      position: fixed; left: 50%; top: 16px; transform: translateX(-50%);
      z-index: 2147483647; background: rgba(20,20,20,.95); color: #fff;
      padding: 8px 12px; border-radius: 8px; font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      box-shadow: 0 6px 18px rgba(0,0,0,.35); pointer-events: none;
    }
  `);

  const showToast = (msg, ms = 1400) => {
    const el = document.createElement('div');
    el.className = 'cto-toast'; el.textContent = msg;
    document.body.appendChild(el); setTimeout(() => el.remove(), ms);
  };

  // --- State ---
  const stateKey = 'cto:v1';
  const loadState = () => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch { return {}; } };
  const saveState = (s) => localStorage.setItem(stateKey, JSON.stringify(s));

  const defaults = { x: 16, y: 80, fontPx: 34, locked: false, showChain: true };
  const st = Object.assign({}, defaults, loadState());

  // --- DOM ---
  const wrap = document.createElement('div');
  wrap.className = 'cto-wrap' + (st.locked ? ' cto-locked' : '');
  wrap.style.top = st.y + 'px';
  wrap.style.left = st.x + 'px';

  const top = document.createElement('div');
  top.className = 'cto-top';

  const txt = document.createElement('div');
  txt.className = 'cto-text';
  txt.style.fontSize = st.fontPx + 'px';
  txt.textContent = '--:--';

  const chain = document.createElement('div');
  chain.className = 'cto-sub';
  chain.textContent = '';
  chain.style.display = st.showChain ? '' : 'none';

  const controls = document.createElement('div');
  controls.className = 'cto-controls';

  const btnLock = document.createElement('button');
  btnLock.className = 'cto-btn';
  btnLock.title = 'Lock/Unlock overlay';
  btnLock.textContent = st.locked ? 'Unlock' : 'Lock';

  const btnToggleChain = document.createElement('button');
  btnToggleChain.className = 'cto-btn';
  btnToggleChain.title = 'Show/Hide chain counter';
  btnToggleChain.textContent = st.showChain ? 'Hide chain' : 'Show chain';

  const handle = document.createElement('div');
  handle.className = 'cto-resize';

  top.append(txt, chain);
  controls.append(btnLock, btnToggleChain);
  wrap.append(top, controls, handle);
  document.body.appendChild(wrap);

  // --- Dragging (Pointer Events, robust) ---
  let dragging = false;
  let dragOffset = { x: 0, y: 0 };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  wrap.addEventListener('pointerdown', (e) => {
    if (st.locked) return;
    if (e.target === handle || e.target.classList.contains('cto-btn')) return; // allow handle/buttons to work
    // ALT+drag anywhere = resize (handled below); plain drag = move
    if (e.altKey) return;
    dragging = true;
    dragOffset.x = e.clientX - wrap.offsetLeft;
    dragOffset.y = e.clientY - wrap.offsetTop;
    wrap.classList.add('cto-dragging');
    wrap.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = clamp(e.clientX - dragOffset.x, 0, window.innerWidth  - wrap.offsetWidth);
    const y = clamp(e.clientY - dragOffset.y, 0, window.innerHeight - wrap.offsetHeight);
    wrap.style.left = x + 'px';
    wrap.style.top  = y + 'px';
  };

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    wrap.classList.remove('cto-dragging');
    wrap.releasePointerCapture?.(e.pointerId);
    st.x = parseInt(wrap.style.left, 10) || st.x;
    st.y = parseInt(wrap.style.top, 10) || st.y;
    saveState(st);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  document.addEventListener('visibilitychange', () => { if (document.hidden) endDrag({}); });

  // --- Resizing (Pointer Events) ---
  let resizing = null;
  const clampNum = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  handle.addEventListener('pointerdown', (e) => {
    if (st.locked) return;
    resizing = { id: e.pointerId, x0: e.clientX, y0: e.clientY, base: st.fontPx };
    wrap.classList.add('cto-resizing');
    handle.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  });

  const onResizeMove = (e) => {
    if (!resizing) return;
    const dx = e.clientX - resizing.x0;
    const dy = e.clientY - resizing.y0;
    const delta = Math.abs(Math.abs(dx) > Math.abs(dy) ? dx : dy);
    st.fontPx = clampNum(Math.round(resizing.base + delta * 0.25), 14, 160);
    txt.style.fontSize = st.fontPx + 'px';
  };

  const endResize = (e) => {
    if (!resizing) return;
    handle.releasePointerCapture?.(e.pointerId);
    resizing = null;
    wrap.classList.remove('cto-resizing');
    saveState(st);
  };

  window.addEventListener('pointermove', onResizeMove, { passive: true });
  window.addEventListener('pointerup', endResize);
  window.addEventListener('pointercancel', endResize);

  // Alt+drag anywhere on overlay = resize (nice fallback)
  let altResizing = null;
  wrap.addEventListener('pointerdown', (e) => {
    if (st.locked || !e.altKey) return;
    altResizing = { id: e.pointerId, x0: e.clientX, base: st.fontPx };
    wrap.classList.add('cto-resizing');
    wrap.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!altResizing) return;
    const dx = e.clientX - altResizing.x0;
    st.fontPx = clampNum(Math.round(altResizing.base + dx * 0.25), 14, 160);
    txt.style.fontSize = st.fontPx + 'px';
  });
  const endAltResize = (e) => {
    if (!altResizing) return;
    wrap.releasePointerCapture?.(e.pointerId);
    altResizing = null;
    wrap.classList.remove('cto-resizing');
    saveState(st);
  };
  window.addEventListener('pointerup', endAltResize);
  window.addEventListener('pointercancel', endAltResize);

  // Ctrl+wheel resize
  wrap.addEventListener('wheel', (e) => {
    if (st.locked) return;
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = -Math.sign(e.deltaY);
    st.fontPx = clampNum(st.fontPx + delta * 2, 14, 160);
    txt.style.fontSize = st.fontPx + 'px';
    saveState(st);
  }, { passive: false });

  // --- Buttons ---
  btnLock.addEventListener('click', () => {
    st.locked = !st.locked;
    wrap.classList.toggle('cto-locked', st.locked);
    btnLock.textContent = st.locked ? 'Unlock' : 'Lock';
    saveState(st);
    showToast(st.locked ? 'Overlay locked' : 'Overlay unlocked');
  });
  btnToggleChain.addEventListener('click', () => {
    st.showChain = !st.showChain;
    chain.style.display = st.showChain ? '' : 'none';
    btnToggleChain.textContent = st.showChain ? 'Hide chain' : 'Show chain';
    saveState(st);
  });

  // --- Live Updates from DOM ---
  const updateTexts = () => {
    const t = findTimer();
    if (t) txt.textContent = t.textContent.trim();
    const c = findCounter();
    if (c) chain.textContent = c.textContent.trim();
  };
  updateTexts();

  const mo = new MutationObserver(updateTexts);
  (findSidebar() ? [findSidebar()] : [document.body]).forEach(r =>
    r && mo.observe(r, { childList: true, subtree: true, characterData: true })
  );
  setInterval(updateTexts, 1000); // safety poll

  // Help
  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      showToast('Drag to move • Alt+Drag to resize • Ctrl+Wheel to resize • Buttons below • Lock to freeze');
    }
  });
})();
