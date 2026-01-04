// ==UserScript==
// @name         Neopets Coconut Shy — Custom Images + Layout Mode + Save Positions (Non-Flash Coconut Shy)
// @namespace    neopets
// @version      1.4.3
// @description  Replace Flash box with background, clickable coconuts with animations, HUD, layout mode (D), persistent positions. Hides UI when the daily limit message appears.
// @match        https://www.neopets.com/halloween/coconutshy.phtml*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548656/Neopets%20Coconut%20Shy%20%E2%80%94%20Custom%20Images%20%2B%20Layout%20Mode%20%2B%20Save%20Positions%20%28Non-Flash%20Coconut%20Shy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548656/Neopets%20Coconut%20Shy%20%E2%80%94%20Custom%20Images%20%2B%20Layout%20Mode%20%2B%20Save%20Positions%20%28Non-Flash%20Coconut%20Shy%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (!/\/halloween\/coconutshy\.phtml/i.test(location.pathname)) return;

  const CONFIG = {
    stage: { w: 500, h: 500, bg: 'https://i.imgur.com/fGgQAqS.png' },
    coconuts: [
      { id: 1, url: 'https://i.imgur.com/r139vGo.png', width: 72, height: 83, left: 24, top: 94 },
      { id: 2, url: 'https://i.imgur.com/N3ofVPr.png', width: 72, height: 83, left: 121, top: 94 },
      { id: 3, url: 'https://i.imgur.com/PLOQOpv.png', width: 57, height: 83, left: 220, top: 94 },
      { id: 4, url: 'https://i.imgur.com/r139vGo.png', width: 72, height: 83, left: 300, top: 94 },
      { id: 5, url: 'https://i.imgur.com/r139vGo.png', width: 72, height: 83, left: 387, top: 94 }
    ]
  };

  const POS_KEY = 'coco_positions_v1';

  const store = {
    get(k, d) {
      try {
        if (typeof GM_getValue === 'function') return GM_getValue(k, d);
        const raw = localStorage.getItem(k);
        return raw == null ? d : JSON.parse(raw);
      } catch (e) { return d; }
    },
    set(k, v) {
      try {
        if (typeof GM_setValue === 'function') return GM_setValue(k, v);
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    }
  };

  function loadPositionsIntoConfig() {
    const saved = store.get(POS_KEY, {});
    CONFIG.coconuts.forEach(c => {
      if (saved[c.id]) { c.left = saved[c.id].left; c.top = saved[c.id].top; }
    });
  }

  function savePosition(id, left, top) {
    const saved = store.get(POS_KEY, {});
    saved[id] = { left, top };
    store.set(POS_KEY, saved);
  }

  function resetSavedPositions() {
    store.set(POS_KEY, {});
  }

  function reachedLimit() {
    const txt = (document.body.innerText || '').toLowerCase();
    return txt.includes("had your lot of throws today") || txt.includes("come back tomorrow");
  }

  const FALLBACK_DATA_URI = (() => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
        <defs><radialGradient id="g" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#8a5a2b"/><stop offset="60%" stop-color="#6d3f17"/><stop offset="100%" stop-color="#4e2c10"/></radialGradient></defs>
        <circle cx="36" cy="36" r="34" fill="url(#g)"/><circle cx="28" cy="26" r="3" fill="#2e1608"/><circle cx="37" cy="24" r="3" fill="#2e1608"/><circle cx="32" cy="31" r="3" fill="#2e1608"/><ellipse cx="50" cy="50" rx="14" ry="10" fill="rgba(255,255,255,0.08)"/>
      </svg>
    `.trim());
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  })();

  const cursorDataURI = (() => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <circle cx="16" cy="16" r="12" fill="none" stroke="#111" stroke-width="2"/>
        <circle cx="16" cy="16" r="3" fill="#111"/>
        <path d="M16 1v6M16 25v6M1 16h6M25 16h6" stroke="#111" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  })();

  const css = `
    .flashRIP__2020,.flashRIP-content__2020,.flashRIP-imgwrapper__2020,.flashRIP-img__2020{display:none!important}
    #coco-wrap{display:block;width:${CONFIG.stage.w}px;margin:0 auto;position:relative;clear:both}
    #coco-stage{position:relative;width:${CONFIG.stage.w}px;height:${CONFIG.stage.h}px;background-image:url("${CONFIG.stage.bg}");background-size:cover;background-position:center center;background-repeat:no-repeat;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.25);cursor:url("${cursorDataURI}") 16 16,crosshair;user-select:none}
    #coco-hud{position:absolute;left:8px;top:8px;right:8px;padding:8px 10px;background:rgba(0,0,0,0.55);color:#fff;font:12px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;border-radius:6px;white-space:pre-wrap}
    #coco-hud .title{font-weight:700;margin-right:6px}
    #coco-hud .msg{display:block;margin-top:4px}
    #coco-hud.flash{animation:cocoFlash 700ms ease}
    @keyframes cocoFlash{0%{box-shadow:0 0 0 rgba(255,255,255,0)}30%{box-shadow:0 0 0 6px rgba(255,255,255,0.25)}100%{box-shadow:0 0 0 rgba(255,255,255,0)}}
    .coconut{position:absolute;transform-origin:50% 50%;animation:idleBob 3.2s ease-in-out infinite;will-change:transform,left,top}
    .coconut img{display:block;width:100%;height:100%;pointer-events:none}
    .coconut:hover{animation:hoverWobble 500ms ease 1}
    .coconut:active{transform:scale(0.96)}
    .coconut[data-coconut="1"]{animation-delay:.0s}
    .coconut[data-coconut="2"]{animation-delay:.4s}
    .coconut[data-coconut="3"]{animation-delay:.8s}
    .coconut[data-coconut="4"]{animation-delay:1.2s}
    .coconut[data-coconut="5"]{animation-delay:1.6s}
    @keyframes idleBob{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(-2deg)}100%{transform:translateY(0) rotate(0)}}
    @keyframes hoverWobble{0%{transform:rotate(0) scale(1)}25%{transform:rotate(-6deg) scale(1.02)}50%{transform:rotate(6deg) scale(1.02)}75%{transform:rotate(-3deg) scale(1.01)}100%{transform:rotate(0) scale(1)}}
    .coconut.throwing{animation:toss 600ms cubic-bezier(.2,.6,.2,1) 1}
    @keyframes toss{0%{transform:translate(0,0) scale(1) rotate(0)}20%{transform:translate(0,-10px) scale(1.03) rotate(-6deg)}50%{transform:translate(0,-42px) scale(1.07) rotate(-12deg)}80%{transform:translate(0,-8px) scale(1.02) rotate(0deg)}100%{transform:translate(0,0) scale(1) rotate(0)}}
    .coconut.success{animation:successPop 520ms ease-out 1}
    @keyframes successPop{0%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,255,0,0))}30%{transform:scale(1.15);filter:drop-shadow(0 0 10px rgba(255,255,0,0.6))}100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,255,0,0))}}
    .coconut.fail{animation:failShake 450ms cubic-bezier(.36,.07,.19,.97) 1}
    @keyframes failShake{0%,100%{transform:translateX(0) rotate(0)}15%{transform:translateX(-6px) rotate(-4deg)}30%{transform:translateX(6px) rotate(4deg)}45%{transform:translateX(-4px) rotate(-3deg)}60%{transform:translateX(4px) rotate(3deg)}75%{transform:translateX(-2px) rotate(-2deg)}90%{transform:translateX(2px) rotate(2deg)}}
    #coco-stage.layout-mode,#coco-stage.layout-mode .coconut{cursor:move!important}
    #coco-stage.layout-mode{outline:3px dashed rgba(255,255,0,0.7)}
    .coconut.layout-handle{outline:2px solid rgba(0,200,255,0.8);border-radius:8px}
  `;
  try { GM_addStyle(css); } catch (e) { const s = document.createElement('style'); s.textContent = css; document.documentElement.appendChild(s); }

  function makeStage() {
    const wrap = document.createElement('div');
    wrap.id = 'coco-wrap';
    const stage = document.createElement('div');
    stage.id = 'coco-stage';
    const hud = document.createElement('div');
    hud.id = 'coco-hud';
    hud.innerHTML = `<span class="title">Coconut Shy</span> Click a coconut to throw.<span class="msg">Results will appear here.</span>`;
    stage.appendChild(hud);
    CONFIG.coconuts.forEach(cfg => {
      const a = document.createElement('a');
      a.href = `https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=${cfg.id}`;
      a.className = 'coconut';
      a.dataset.coconut = String(cfg.id);
      a.style.left = `${clamp(cfg.left, 0, CONFIG.stage.w - cfg.width)}px`;
      a.style.top = `${clamp(cfg.top, 0, CONFIG.stage.h - cfg.height)}px`;
      a.style.width = `${cfg.width}px`;
      a.style.height = `${cfg.height}px`;
      const img = document.createElement('img');
      img.alt = `Coconut ${cfg.id}`;
      img.src = cfg.url && cfg.url.startsWith('http') ? cfg.url : FALLBACK_DATA_URI;
      img.width = cfg.width;
      img.height = cfg.height;
      a.appendChild(img);
      a.addEventListener('click', onCoconutClick, false);
      a.addEventListener('animationend', onCoconutAnimEnd, false);
      stage.appendChild(a);
    });
    wrap.appendChild(stage);
    return wrap;
  }

  function replaceFlashBoxWith(stageWrap) {
    const ripLink = document.querySelector('link[href*="flash_rip.css"]');
    let blackHost = ripLink ? ripLink.closest('div[style]') : null;
    if (blackHost) {
      const st = (blackHost.getAttribute('style') || '').toLowerCase();
      if (!(st.includes('background-color:black') && st.includes('width:500px'))) blackHost = null;
    }
    if (!blackHost) {
      blackHost = Array.from(document.querySelectorAll('div[style]')).find(el => {
        const s = (el.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
        return s.includes('background-color:black') && s.includes('width:500px');
      }) || null;
    }
    if (blackHost && blackHost.parentElement) {
      blackHost.replaceWith(stageWrap);
      return true;
    }
    const content = document.querySelector('#content') || document.body;
    const center = document.createElement('div');
    center.style.textAlign = 'center';
    center.appendChild(stageWrap);
    content.prepend(center);
    return false;
  }

  function ensureStage() {
    if (reachedLimit()) return;
    if (document.getElementById('coco-stage')) return;
    const wrap = makeStage();
    replaceFlashBoxWith(wrap);
  }

  async function onCoconutClick(e) {
    const a = e.currentTarget;
    if (state.layoutMode) { e.preventDefault(); e.stopPropagation(); return; }
    if (a.__dragConsumedClick) { a.__dragConsumedClick = false; e.preventDefault(); e.stopPropagation(); return; }
    e.preventDefault();
    e.stopPropagation();
    const n = a.dataset.coconut;
    addAnimClass(a, 'throwing');
    const hud = document.getElementById('coco-hud');
    setHUD(hud, `Throwing at coconut ${n}…`);
    try {
      const res = await fetch(a.href, { credentials: 'include' });
      const text = await res.text();
      let kvLine = text.trim();
      const m = kvLine.match(/(^|\b|\s)points=\d+[^<\n\r]*/i);
      if (m) kvLine = m[0].trim();
      const params = new URLSearchParams(kvLine.replace(/^[^p]*points=/i, 'points='));
      const award = toInt(params.get('points'));
      const totalNP = toInt(params.get('totalnp'));
      const success = params.get('success');
      const msg = params.get('error') || '';
      const awardTxt = Number.isFinite(award) ? formatNP(award) : '0';
      const totalTxt = Number.isFinite(totalNP) ? formatNP(totalNP) : '—';
      setHUD(hud, `Award: ${awardTxt} NP • Total NP: ${totalTxt}`, msg || 'No message.');
      if (success) console.log('Coconut success code:', success);
      if (Number.isFinite(totalNP)) updateNpHeader(totalTxt);
      if (Number.isFinite(award) && award > 0) addAnimClass(a, 'success'); else addAnimClass(a, 'fail');
      hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash');
    } catch (err) {
      setHUD(hud, 'Error fetching result.', String(err));
      addAnimClass(a, 'fail');
    }
  }

  const state = { layoutMode: false };

  document.addEventListener('click', ev => {
    if (!state.layoutMode) return;
    if (ev.target.closest('.coconut')) { ev.preventDefault(); ev.stopPropagation(); }
  }, true);

  function updateNpHeader(totalTxt) {
    try {
      if (window.Neo && typeof window.Neo.setNp === 'function') {
        window.Neo.setNp(totalTxt);
      } else {
        const np = document.getElementById('npanchor');
        if (np) np.textContent = totalTxt;
      }
    } catch {}
  }

  function addAnimClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function onCoconutAnimEnd(e) {
    if (e.animationName === 'toss') e.currentTarget.classList.remove('throwing');
    if (e.animationName === 'successPop') e.currentTarget.classList.remove('success');
    if (e.animationName === 'failShake') e.currentTarget.classList.remove('fail');
  }

  function setHUD(hudEl, line1, line2) {
    if (!hudEl) return;
    hudEl.innerHTML = `<span class="title">Coconut Shy</span> ${escapeHTML(line1 || '')}` + (line2 ? `<span class="msg">${escapeHTML(line2)}</span>` : '');
  }

  document.addEventListener('keydown', ev => {
    const k = ev.key.toLowerCase();
    if (k === 'd') {
      state.layoutMode = !state.layoutMode;
      const stage = document.getElementById('coco-stage');
      if (stage) stage.classList.toggle('layout-mode', state.layoutMode);
      document.querySelectorAll('.coconut').forEach(el => el.classList.toggle('layout-handle', state.layoutMode));
      const hud = document.getElementById('coco-hud');
      if (hud) {
        setHUD(hud, state.layoutMode ? 'Layout Mode ON — drag coconuts; positions saved. Press D to exit. Press R to clear saved positions.' : 'Layout Mode OFF — click a coconut to throw.');
        hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash');
      }
    }
    if (state.layoutMode && k === 'r') {
      resetSavedPositions();
      const hud = document.getElementById('coco-hud');
      if (hud) {
        setHUD(hud, 'Saved positions cleared. Reload the page to revert to defaults.');
        hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash');
      }
    }
  });

  document.addEventListener('mousedown', startDrag, true);
  function startDrag(ev) {
    if (!state.layoutMode) return;
    const target = ev.target.closest('.coconut');
    if (!target) return;
    ev.preventDefault();
    ev.stopPropagation();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const origL = parseFloat(target.style.left) || 0;
    const origT = parseFloat(target.style.top) || 0;
    const w = parseFloat(target.style.width) || 72;
    const h = parseFloat(target.style.height) || 72;
    let moved = false;
    function onMove(e2) {
      const dx = e2.clientX - startX;
      const dy = e2.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      const nx = clamp(origL + dx, 0, CONFIG.stage.w - w);
      const ny = clamp(origT + dy, 0, CONFIG.stage.h - h);
      target.style.left = `${nx}px`;
      target.style.top = `${ny}px`;
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onUp, true);
      if (moved) target.__dragConsumedClick = true;
      const id = Number(target.dataset.coconut);
      const left = parseInt(target.style.left, 10);
      const top = parseInt(target.style.top, 10);
      savePosition(id, left, top);
      const hud = document.getElementById('coco-hud');
      if (hud) {
        setHUD(hud, `Saved Coconut ${id} → left: ${left}, top: ${top}`, 'Positions persist across reloads.');
        hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash');
      }
      console.log(`{ id: ${id}, left: ${left}, top: ${top} },`);
    }
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onUp, true);
  }

  function toInt(v) { const n = parseInt(String(v || '').replace(/[^\d-]/g, ''), 10); return Number.isFinite(n) ? n : NaN; }
  function formatNP(n) { return Number(n).toLocaleString('en-US'); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function escapeHTML(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }

  loadPositionsIntoConfig();
  ensureStage();

  const mo = new MutationObserver(() => {
    if (reachedLimit()) {
      const wrap = document.getElementById('coco-wrap') || document.getElementById('coco-stage');
      if (wrap) wrap.remove();
      return;
    }
    if (!document.getElementById('coco-stage')) ensureStage();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  if (reachedLimit()) {
    const wrap = document.getElementById('coco-wrap') || document.getElementById('coco-stage');
    if (wrap) wrap.remove();
  }
})();
