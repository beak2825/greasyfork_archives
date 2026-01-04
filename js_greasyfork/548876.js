// ==UserScript==
// @name         TORN Live Clock (No iframe)
// @namespace    tm.torn.clock.overlay
// @version      1.3
// @description  Live on-page clock overlay for TORN with timezone, 12/24h, font-size, draggable (mouse+touch), persistent, PDA-friendly; includes restore puck when hidden
// @author       TrippingMartian
// @license      Attribution Required
// Free to use, modify, and redistribute, but please credit "TrippingMartian" as the original author.
// @match        https://www.torn.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548876/TORN%20Live%20Clock%20%28No%20iframe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548876/TORN%20Live%20Clock%20%28No%20iframe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS = 'tm_live_clock_v1';
  const defaults = {
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    is24: true,
    font: 16,
    x: null, y: null,
    visible: true,
    minimized: false
  };

  const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const load = () => { try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS) || '{}')); } catch { return { ...defaults }; } };
  const save = (cfg) => localStorage.setItem(LS, JSON.stringify(cfg));
  const cfg = load();

  // --- Restore puck (appears when hidden) ---
  let puck = null;
  function ensurePuck() {
    if (puck) return puck;
    puck = document.createElement('button');
    puck.title = 'Show Clock';
    puck.setAttribute('aria-label','Show Clock');
    puck.textContent = '⏰';
    puck.style.cssText = `
      position: fixed; z-index: 1000000; right: 12px; bottom: 12px;
      width: 36px; height: 36px; border-radius: 18px;
      border: 1px solid rgba(255,255,255,.25);
      background: rgba(18,18,18,.9); color: #fff; font-size: 18px;
      display: none; align-items:center; justify-content:center; cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,.35); backdrop-filter: blur(2px);
    `;
    puck.addEventListener('click', () => {
      cfg.visible = true;
      save(cfg);
      if (box) box.style.display = 'block';
      puck.style.display = 'none';
    });
    document.body.appendChild(puck);
    return puck;
  }
  function showPuck(show) {
    ensurePuck();
    puck.style.display = show ? 'flex' : 'none';
  }

  // --- Clock box ---
  const box = document.createElement('div');
  box.style.cssText = `
    position: fixed; z-index: 999999; right: 16px; bottom: 16px;
    background: rgba(18,18,18,.9); color: #e8e8e8;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,.35);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
    user-select: none; display: ${cfg.visible ? 'block' : 'none'};
    backdrop-filter: blur(2px); max-width: 90vw;
  `;
  if (Number.isFinite(cfg.x) && Number.isFinite(cfg.y)) {
    box.style.left = cfg.x + 'px';
    box.style.top = cfg.y + 'px';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
  }

  const bar = document.createElement('div');
  bar.textContent = 'Clock';
  bar.style.cssText = `
    height: 28px; line-height: 28px; padding: 0 8px; font-size: 13px;
    background: rgba(255,255,255,.07); color:#cfcfcf; cursor: move;
    display:flex; gap:8px; align-items:center; touch-action: none;
  `;
  const btnSet  = document.createElement('button'); btnSet.textContent  = 'Set';
  const btnHide = document.createElement('button'); btnHide.textContent = 'Hide';
  const btnMin  = document.createElement('button'); btnMin.textContent  = cfg.minimized ? 'Expand' : 'Min';
  [btnSet, btnHide, btnMin].forEach(b=>{
    b.style.cssText = `
      border:0; background: rgba(255,255,255,.10); color:#eee; border-radius: 6px;
      padding: 4px 8px; height: 22px; cursor: pointer; font-size: 12px;
    `;
    if (!isTouch()) {
      b.onmouseenter = () => b.style.background = 'rgba(255,255,255,.18)';
      b.onmouseleave = () => b.style.background = 'rgba(255,255,255,.10)';
    }
  });
  const rightWrap = document.createElement('div');
  rightWrap.style.cssText = 'display:flex; gap:6px; margin-left:auto;';
  rightWrap.append(btnMin, btnSet, btnHide);
  bar.appendChild(rightWrap);

  const body = document.createElement('div');
  body.style.cssText = `padding: 8px 10px;`;

  const timeEl = document.createElement('div');
  const responsiveFont = () => Math.min(cfg.font, Math.max(320, window.innerWidth) / 24);
  timeEl.style.cssText = `font-weight:700; font-size:${responsiveFont()}px; letter-spacing:0.5px;`;

  const tzEl = document.createElement('div');
  tzEl.style.cssText = `font-size: 11px; color:#9aa; margin-top:2px;`;

  const sig = document.createElement('div');
  sig.textContent = 'Made by TrippingMartian';
  sig.style.cssText = `
    font-size: 10px; color:#777; margin-top:4px; text-align:right; font-style:italic;
    display:none; opacity:0; transition: opacity .15s ease;
  `;

  body.append(timeEl, tzEl, sig);
  box.append(bar, body);
  document.body.appendChild(box);

  // Signature visibility (hover desktop, long-press touch)
  if (!isTouch()) {
    box.addEventListener('mouseenter', () => { sig.style.display='block'; requestAnimationFrame(()=>sig.style.opacity='1'); });
    box.addEventListener('mouseleave', () => { sig.style.opacity='0'; setTimeout(()=>sig.style.display='none',150); });
  } else {
    let lpTimer=null;
    box.addEventListener('touchstart', ()=>{
      lpTimer = setTimeout(()=>{
        sig.style.display='block'; sig.style.opacity='1';
        setTimeout(()=>{ sig.style.opacity='0'; setTimeout(()=>sig.style.display='none',150); }, 1200);
      }, 500);
    }, {passive:true});
    box.addEventListener('touchend', ()=>{ if (lpTimer) clearTimeout(lpTimer); }, {passive:true});
  }

  // Render clock
  function render() {
    try {
      const now = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: cfg.tz, hour12: !cfg.is24 };
      timeEl.textContent = new Intl.DateTimeFormat(undefined, opts).format(now);
      tzEl.textContent = `${cfg.tz} • ${cfg.is24 ? '24-hour' : '12-hour'}`;
    } catch {
      timeEl.textContent = 'Invalid timezone';
      tzEl.textContent = '';
    }
  }
  render();
  const timer = setInterval(render, 1000);

  // Dragging (mouse + touch)
  (function enableDrag(){
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    const start = (x,y)=>{ dragging=true; sx=x; sy=y; const r=box.getBoundingClientRect(); ox=r.left; oy=r.top; };
    const move  = (x,y)=>{
      if (!dragging) return;
      const nx = ox + (x - sx);
      const ny = oy + (y - sy);
      const maxX = window.innerWidth  - box.offsetWidth;
      const maxY = window.innerHeight - box.offsetHeight;
      box.style.left = clamp(nx, 0, Math.max(0,maxX)) + 'px';
      box.style.top  = clamp(ny, 0, Math.max(0,maxY)) + 'px';
      box.style.right='auto'; box.style.bottom='auto';
    };
    const end   = ()=>{
      if (!dragging) return; dragging=false;
      const r=box.getBoundingClientRect();
      cfg.x = Math.round(r.left); cfg.y = Math.round(r.top); save(cfg);
    };

    // Mouse
    bar.addEventListener('mousedown', e=>{ start(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', e=> move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);
    // Touch
    bar.addEventListener('touchstart', e=>{ const t=e.touches[0]; if (t) start(t.clientX, t.clientY); }, {passive:true});
    window.addEventListener('touchmove', e=>{ const t=e.touches[0]; if (t) move(t.clientX, t.clientY); }, {passive:true});
    window.addEventListener('touchend', end, {passive:true});
  })();

  // Controls
  function applyFont() { timeEl.style.fontSize = responsiveFont() + 'px'; }

  function setClock() {
    const tz  = prompt('Enter IANA timezone (e.g. Asia/Singapore, Europe/London, America/New_York):', cfg.tz);
    if (tz === null) return;
    const fmt = prompt('Use 24-hour format? (yes/no)', cfg.is24 ? 'yes' : 'no');
    if (fmt === null) return;
    const font = prompt('Font size in px (e.g. 16, 18, 20):', String(cfg.font));
    if (font === null) return;

    cfg.tz   = tz.trim() || cfg.tz;
    cfg.is24 = /^y/i.test(fmt.trim());
    cfg.font = Math.max(10, parseInt(font, 10) || cfg.font);
    save(cfg);
    applyFont();
    render();
  }

  function setMinimized(min) {
    cfg.minimized = min;
    body.style.display = min ? 'none' : 'block';
    btnMin.textContent = min ? 'Expand' : 'Min';
    save(cfg);
  }

  btnSet.addEventListener('click', setClock);
  btnHide.addEventListener('click', ()=>{
    cfg.visible = false; save(cfg);
    box.style.display = 'none';
    showPuck(true);
  });
  btnMin.addEventListener('click', ()=> setMinimized(!cfg.minimized));

  // Header dblclick / tap to minimize
  bar.addEventListener('dblclick', ()=> setMinimized(!cfg.minimized));
  if (isTouch()) bar.addEventListener('click', ()=> setMinimized(!cfg.minimized));

  // Hotkeys (desktop)
  window.addEventListener('keydown', (e)=>{
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') setClock();
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyX') {
      cfg.visible = !cfg.visible; save(cfg);
      box.style.display = cfg.visible ? 'block' : 'none';
      showPuck(!cfg.visible);
    }
  });

  // Keep on-screen after resize/rotate
  window.addEventListener('resize', ()=>{
    const r = box.getBoundingClientRect();
    const nx = clamp(r.left, 0, Math.max(0, window.innerWidth - box.offsetWidth));
    const ny = clamp(r.top,  0, Math.max(0, window.innerHeight - box.offsetHeight));
    box.style.left = nx + 'px'; box.style.top = ny + 'px';
    box.style.right='auto'; box.style.bottom='auto';
    cfg.x = Math.round(nx); cfg.y = Math.round(ny);
    applyFont(); save(cfg);
  });

  // Tampermonkey menu toggle (optional)
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Show/Hide Clock', ()=>{
      cfg.visible = !cfg.visible; save(cfg);
      box.style.display = cfg.visible ? 'block' : 'none';
      showPuck(!cfg.visible);
    });
  }

  // Initial state for puck
  if (!cfg.visible) showPuck(true);

  // Init
  applyFont();
  setMinimized(cfg.minimized);
})();
