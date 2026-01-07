// ==UserScript==
// @name         SnapScore Plus - Fast
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  prolly one of the best
// @match        https://www.snapchat.com/web*
// @match        https://web.snapchat.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561708/SnapScore%20Plus%20-%20Fast.user.js
// @updateURL https://update.greasyfork.org/scripts/561708/SnapScore%20Plus%20-%20Fast.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const CFG = { delay: 0.01, ignoreLeft: 0.15 };
  const BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  const UI = (() => {
    const root = document.createElement('div');
    root.style.cssText = `position:fixed;top:10px;right:10px;z-index:2147483647;background:#000;border:1px solid #0f0;border-radius:6px;padding:8px;font:11px monospace;color:#fff;width:280px;box-shadow:0 0 10px #0f088`;
    root.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>hey twin, give me money</span><span id="stat" style="color:#0f0">IDLE</span></div>
      <div style="display:flex;gap:4px;align-items:center;margin-bottom:6px"><label style="font-size:10px">DLY</label><input id="dly" type="number" value="${CFG.delay}" step="0.01" min="0.01" max="2" style="width:55px;background:#111;border:1px solid #333;color:#0f0;text-align:center;font-size:10px;border-radius:3px"><button id="go" style="background:#0f0;color:#000;border:0;padding:4px 10px;border-radius:4px;font-size:10px;font-weight:600;cursor:pointer">▶ START</button><button id="stop" style="background:#f00;color:#fff;border:0;padding:4px 10px;border-radius:4px;font-size:10px;font-weight:600;cursor:pointer">■ STOP</button></div>
      <div style="display:flex;gap:4px;margin-bottom:6px"><input id="urlIn" type="text" placeholder="paste avatar URL here" style="flex:1;background:#111;border:1px solid #333;color:#fff;font-size:10px;padding:4px;border-radius:3px"><button id="lock" style="background:#09f;color:#fff;border:0;padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">LOCK</button></div>
      <div id="preview" style="font-size:9px;color:#888;text-align:center">paste URL and lock</div>`;
    document.documentElement.appendChild(root);
    return { stat: s => document.getElementById('stat').textContent = s, preview: t => document.getElementById('preview').textContent = t };
  })();

  const S = { running: false, emerg: false, img: BLANK, targetSrc: null, getDelay: () => Math.max(document.getElementById('dly').value * 1000, 10) };
  const U = {
    nuke() {
      /* 1. hide (not remove) the left friends rail so React keeps the DOM */
      const rail = document.querySelector('aside[aria-label*="Conversations"], nav.deg2K, .deg2K');
      if (rail) rail.style.display = 'none';

      /* 2. delete the other decorative blocks (safe to remove) */
      const kills = [
        'div.BL7do',                      // top-bar dropdown
        'div.tCfts',                      // stories/spotlight icons
        'header[role="banner"]',
        'section[aria-label*="Stories"]',
        '[data-testid*="story"]',
        '[data-testid*="discover"]',
        '[data-testid*="sponsored"]',
        'div.wHvEy',                      // mailbox banner
        'div.yC1EG',                      // bottom search + My-AI
        'button[title="Close snap preview and return to camera."]',
        'button[title="Download"]',
        'button[title="Add a caption"]'
      ];
      kills.forEach(sel => document.querySelectorAll(sel).forEach(n => n.remove()));
    },
    click(el) {
      if (!el) return false;
      const k = Object.keys(el).find(k => k.startsWith('__reactProps'));
      if (k && el[k].onClick) { el[k].onClick({ preventDefault() {}, stopPropagation() {} }); return true; }
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
      return true;
    },
    inArea(r) { return r.left >= innerWidth * CFG.ignoreLeft; }
  };

  /* ---------- LOCK BUTTON ---------- */
  document.getElementById('lock').onclick = () => {
    const raw = document.getElementById('urlIn').value.trim();
    if (!raw) { UI.preview('empty URL'); return; }
    S.targetSrc = raw;
    UI.preview('URL locked');
    document.getElementById('urlIn').value = '';
  };

  /* ---------- SPEED-UP CSS ---------- */
  GM_addStyle(`* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`);

  /* ---------- NUKE + OBSERVE ---------- */
  U.nuke();                                    // initial strip
  new MutationObserver(U.nuke).observe(document, { childList: true, subtree: true });

  /* ---------- 5-CLICK LOOP ---------- */
  async function loop() {
    const d = S.getDelay();

    /* 1. shutter */
    const shutter = document.querySelector('div > div.CYQZP > div > div.P9cx7 > div > button.fE2D5 > div');
    if (shutter) U.click(shutter);
    await new Promise(r => setTimeout(r, d));

    /* 2. send-to (opens tray) */
    const sendBtn = document.querySelector('#snap-preview-container > div._C4ta.FHYMJ > button.YatIx.fGS78.eKaL7.Bnaur');
    if (sendBtn) U.click(sendBtn);
    await new Promise(r => setTimeout(r, d));

    /* 3. click ONLY the locked avatar */
    if (!S.targetSrc) return;
    const wanted = [...document.querySelectorAll('img')].find(img => img.src === S.targetSrc);
    if (wanted) U.click(wanted);
    await new Promise(r => setTimeout(r, d));

    /* 4. real Send button */
    const finalSendSel = 'button.TYX6O.eKaL7.Bnaur[type="submit"]';
    const finalBtn = document.querySelector(finalSendSel);
    if (finalBtn) U.click(finalBtn);
    await new Promise(r => setTimeout(r, d));
  }

  async function runner() {
    if (S.running) return;
    if (!S.targetSrc) { UI.stat('LOCK URL FIRST'); return; }
    S.emerg = false; S.running = true; UI.stat('RUN');
    while (S.running && !S.emerg) { await loop(); await new Promise(r => setTimeout(r, 2)); }
    S.running = false; UI.stat('IDLE');
  }

  UI.stat('IDLE');
  document.getElementById('go').onclick = runner;
  document.getElementById('stop').onclick = () => S.emerg = true;
  document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'x') S.emerg = true; });
})();