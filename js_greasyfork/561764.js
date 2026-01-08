// ==UserScript==
// @name         SnapScore - Smallest, Fastest, Easy Stop (X = Stop)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Every micro-optimisation → 0.001 s loops, zero jank, zero waste
// @match        https://www.snapchat.com/web*
// @match        https://web.snapchat.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561764/SnapScore%20-%20Smallest%2C%20Fastest%2C%20Easy%20Stop%20%28X%20%3D%20Stop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561764/SnapScore%20-%20Smallest%2C%20Fastest%2C%20Easy%20Stop%20%28X%20%3D%20Stop%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- CONSTANTS ---------- */
  const DELAY_MS = 1;                         // 0.001 s between clicks
  const IGNORE_LEFT = 0.15;                   // ignore left 15 %
  const BLANK_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  /* ---------- UI (micro) ---------- */
  const UI = (() => {
    const d = document.createElement('div');
    d.style = 'position:fixed;top:6px;right:6px;z-index:2147483647;background:#000;border:1px solid #0f0;font:10px monospace;color:#fff;padding:6px;border-radius:4px;width:220px;box-shadow:0 0 8px #0f088';
    d.innerHTML = `<div style="display:flex;justify-content:space-between"><span>⚡ FINAL</span><span id="s">IDLE</span></div><div style="display:flex;gap:3px;margin-top:4px"><input id="u" type="text" placeholder="URL" style="flex:1;height:16px;background:#111;border:1px solid #333;color:#0f0;font-size:10px;padding:2px;border-radius:2px"><button id="l" style="background:#09f;color:#000;border:0;padding:2px 5px;border-radius:2px;font-size:10px;cursor:pointer">LOCK</button></div><div style="display:flex;gap:3px;margin-top:4px"><button id="g" style="background:#0f0;color:#000;border:0;padding:2px 6px;border-radius:2px;font-size:10px;cursor:pointer">▶</button><button id="x" style="background:#f00;color:#fff;border:0;padding:2px 6px;border-radius:2px;font-size:10px;cursor:pointer">■</button></div>`;
    document.documentElement.appendChild(d);
    return { s: t => document.getElementById('s').textContent = t };
  })();

  /* ---------- STATE ---------- */
  let running = false, emerg = false, targetSrc = null;

  /* ---------- LOCK ---------- */
  document.getElementById('l').onclick = () => {
    const v = document.getElementById('u').value.trim();
    if (!v) return;
    targetSrc = v;
    document.getElementById('u').value = '';
    UI.s('LOCKED');
  };

  /* ---------- CLICKER (React-aware) ---------- */
  const click = el => {
    if (!el) return false;
    const k = Object.keys(el).find(k => k.startsWith('__reactProps'));
    if (k && el[k].onClick) { el[k].onClick({ preventDefault() {}, stopPropagation() {} }); return true; }
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y }));
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
    return true;
  };

  /* ---------- NUKE (hide, not remove) ---------- */
  const nuke = () => {
    /* hide left rail (keeps DOM) */
    const rail = document.querySelector('aside[aria-label*="Conversations"], nav.deg2K, .deg2K');
    if (rail) rail.style.display = 'none';

    /* hide decorative blocks (keeps DOM) */
    const hides = [
      'div.BL7do', 'div.tCfts', 'header[role="banner"]',
      'section[aria-label*="Stories"]', '[data-testid*="story"]',
      '[data-testid*="discover"]', '[data-testid*="sponsored"]',
      'div.wHvEy', 'div.yC1EG'
    ];
    hides.forEach(sel => document.querySelectorAll(sel).forEach(n => n.style.display = 'none'));
  };

  /* ---------- SPEED CSS ---------- */
  GM_addStyle(`* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`);

  /* ---------- LOOP (0.001 s) ---------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function loop() {
    /* 1. shutter */
    const shutter = document.querySelector('div > div.CYQZP > div > div.P9cx7 > div > button.fE2D5 > div');
    if (shutter) click(shutter);
    await sleep(DELAY_MS);

    /* 2. send-to */
    const sendBtn = document.querySelector('#snap-preview-container > div._C4ta.FHYMJ > button.YatIx.fGS78.eKaL7.Bnaur');
    if (sendBtn) click(sendBtn);
    await sleep(DELAY_MS);

    /* 3. locked avatar */
    if (!targetSrc) return;
    const wanted = [...document.querySelectorAll('img')].find(img => img.src === targetSrc);
    if (wanted) click(wanted);
    await sleep(DELAY_MS);

    /* 4. send */
    const final = document.querySelector('button.TYX6O.eKaL7.Bnaur[type="submit"]');
    if (final) click(final);
    await sleep(DELAY_MS);
  }

  /* ---------- RUNNER ---------- */
  async function runner() {
    if (running) return;
    if (!targetSrc) { UI.s('LOCK URL'); return; }
    emerg = false; running = true; UI.s('RUN');
    while (running && !emerg) { await loop(); await sleep(2); }
    running = false; UI.s('IDLE');
  }

  /* ---------- BIND ---------- */
  UI.s('IDLE');
  document.getElementById('l').onclick = () => (targetSrc = document.getElementById('u').value.trim(), targetSrc && (UI.s('LOCKED'), document.getElementById('u').value = ''));
  document.getElementById('g').onclick = runner;
  document.getElementById('x').onclick = () => (emerg = true);
  document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'x') emerg = true; });

  /* ---------- START ---------- */
  nuke(); new MutationObserver(nuke).observe(document, { childList: true, subtree: true });
})();