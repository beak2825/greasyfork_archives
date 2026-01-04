// ==UserScript==
// @name         MAM Clean Split Search (Static Menus, Anti-Sticky, Transparent Header)
// @version      3.6
// @description  Split search row from current #tss; kills sticky/fixed menu; no header image or blur; theme-aware; stays in sync.
// @author       LaylaReads
// @namespace    https://myanonamouse.net/
// @license      MIT
// @match        *://*.myanonamouse.net/*
// @grant        none
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551905/MAM%20Clean%20Split%20Search%20%28Static%20Menus%2C%20Anti-Sticky%2C%20Transparent%20Header%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551905/MAM%20Clean%20Split%20Search%20%28Static%20Menus%2C%20Anti-Sticky%2C%20Transparent%20Header%29.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ----- knobs -----
  const HEADER_MARGIN_Y_PX = 8;
  const BELOW_HEADER_SPACER_PX = 20;
  const INPUT_WIDTH_PX = 180;

  let header, tss, container, tssObserver, docObserver;

  // ---------- STYLES (theme + anti-sticky CSS layer) ----------
  function injectStyles() {
    if (document.getElementById('mam-theme-styles')) return;
    const css = `
      /* Search row styles */
      .mam-search-row {
        display:flex; flex-wrap:wrap; justify-content:center;
        gap:8px 12px;
        padding:${HEADER_MARGIN_Y_PX}px 0; margin:${HEADER_MARGIN_Y_PX}px 0;
        text-align:center; position:relative; z-index:auto;
      }
      .mam-search-input {
        text-align:center; border-radius:6px; padding:6px 10px;
        width:${INPUT_WIDTH_PX}px; font-size:14px; box-sizing:border-box;
        transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
        outline: none; border:1px solid rgba(128,128,128,.6);
      }
      @media (prefers-color-scheme: dark) {
        .mam-search-input { color:#e6e6e6; background:rgba(20,20,20,.9); border:1px solid rgba(200,200,200,.6); }
        .mam-search-input::placeholder { color: rgba(220,220,220,.45); }
        .mam-search-input:focus { border-color:#fff; box-shadow:0 0 0 2px rgba(255,255,255,.25); background:rgba(26,26,26,.95); }
      }
      @media (prefers-color-scheme: light) {
        .mam-search-input { color:#1f1f1f; background:rgba(255,255,255,.95); border:1px solid rgba(0,0,0,.5); }
        .mam-search-input::placeholder { color: rgba(0,0,0,.45); }
        .mam-search-input:focus { border-color:#000; box-shadow:0 0 0 2px rgba(0,0,0,.2); background:rgba(255,255,255,1); }
      }

      /* Anti-sticky CSS overrides for likely nav containers */
      #preNav, #msb, #nav, #top, #header, .nav, .topbar, .navbar, .header, .menu, .mainmenu, .masthead {
        position: static !important;
        top: auto !important;
        bottom: auto !important;
        background: transparent !important;
        box-shadow: none !important;
        z-index: auto !important;
        margin: 0 !important;
        width: 100% !important;
      }
    `;
    const style = document.createElement('style');
    style.id = 'mam-theme-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- RUNTIME ANTI-STICKY (scan + enforce) ----------
  function killSticky(el) {
    if (!el) return;
    el.style.setProperty('position', 'static', 'important');
    el.style.setProperty('top', 'auto', 'important');
    el.style.setProperty('bottom', 'auto', 'important');
    el.style.setProperty('z-index', 'auto', 'important');
    el.style.setProperty('background', 'transparent', 'important');
    el.style.setProperty('box-shadow', 'none', 'important');
  }

  function brutalAntiStickyScan(root = document.body) {
    if (!root) return;
    const MAX = 600; // limit scan for performance
    let count = 0;

    const it = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = it.nextNode()) && count < MAX) {
      count++;
      const cs = getComputedStyle(node);
      if (cs.position === 'sticky' || cs.position === 'fixed') {
        const rect = node.getBoundingClientRect();
        const plausibleNav = rect.top <= 80 && rect.height <= 140 && rect.width >= 300;
        if (plausibleNav || node.id === 'preNav' || node.id === 'msb') {
          killSticky(node);
        }
      }
    }
    killSticky(document.getElementById('preNav'));
    killSticky(document.getElementById('msb'));
  }

  function startAntiStickyObserver() {
    if (docObserver) return;
    docObserver = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const m of mutations) {
        if (m.type === 'attributes') {
          if (m.attributeName === 'style' || m.attributeName === 'class') {
            shouldRescan = true;
          }
        } else if (m.type === 'childList') {
          shouldRescan = true;
        }
        if (shouldRescan) break;
      }
      if (shouldRescan) brutalAntiStickyScan();
    });
    docObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });

    window.addEventListener('scroll', () => brutalAntiStickyScan(), { passive: true });
  }

  // ---------- SPACING ----------
  function ensureSpacer() {
    if (!document.getElementById('mam-after-header-spacer')) {
      const spacer = document.createElement('div');
      spacer.id = 'mam-after-header-spacer';
      spacer.style.height = BELOW_HEADER_SPACER_PX + 'px';
      header.insertAdjacentElement('afterend', spacer);
    }
  }

  // ---------- URL PARAMS ----------
  function getParams() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const currentIn = (params.get('tor[srchIn]') || '').toLowerCase();
    let currentText = params.get('tor[text]') || '';
    if (!currentText && url.href.includes('tor%5Btext%5D=')) {
      currentText = url.href.split('tor%5Btext%5D=')[1].split('&')[0];
      try { currentText = decodeURIComponent(currentText.replace(/\+/g, ' ')); } catch (e) { /* noop */ }
    }
    return { currentIn, currentText };
  }

  // ---------- RENDER (no cache) ----------
  function renderSearchRow() {
    if (!header) return;

    const options = tss ? tss.getElementsByTagName('option') : null;
    if (!options || !options.length) {
      header.innerHTML = '';
      ensureSpacer();
      return;
    }

    const row = document.createElement('div');
    row.className = 'mam-search-row';

    const { currentIn, currentText } = getParams();

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const spec = (opt.getAttribute('data-Searchform') || '').split(';');
      if (spec.length < 2) continue;

      const form = document.createElement('form');
      form.action = spec[0];
      form.style.cssText = 'display:inline-block; margin:0;';
      form.innerHTML =
        "<input type='hidden' name='action' value='search'>" +
        "<input type='hidden' name='tor[srchIn]' value='" + opt.value + "'>";

      const input = document.createElement('input');
      input.name = spec[1];
      input.placeholder = opt.textContent;
      input.className = 'mam-search-input';

      if (currentIn === String(opt.value).toLowerCase()) {
        input.value = currentText;
      }

      form.appendChild(input);
      row.appendChild(form);
    }

    header.innerHTML = '';
    header.appendChild(row);
    container = row;

    ensureSpacer();

    // QoL: auto-select text when focusing
    container.addEventListener('focusin', (e) => {
      if (e.target && e.target.tagName === 'INPUT') {
        e.target.select();
      }
    });
  }

  // ---------- BOOT + OBSERVERS ----------
  function waitFor(sel, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(sel);
      if (el) {
        resolve(el);
        return;
      }
      const obs = new MutationObserver(() => {
        const e = document.querySelector(sel);
        if (e) {
          obs.disconnect();
          resolve(e);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('Timeout: ' + sel));
      }, timeoutMs);
    });
  }

  function watchTss() {
    if (!tss || tssObserver) return;
    tssObserver = new MutationObserver(() => renderSearchRow());
    tssObserver.observe(tss, { childList: true, subtree: true, characterData: true });
  }

  function hookHistory() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    function onNav() {
      tss = document.getElementById('tss');
      header = document.getElementsByClassName('blockHead')[0];
      brutalAntiStickyScan();
      renderSearchRow();
      if (tssObserver) {
        tssObserver.disconnect();
        tssObserver = null;
      }
      watchTss();
    }

    history.pushState = function () {
  const r = _push.apply(this, arguments);
  setTimeout(onNav, 0);
  return r;
};

history.replaceState = function () {
  const r = _replace.apply(this, arguments);
  setTimeout(onNav, 0);
  return r;
};


    window.addEventListener('popstate', () => setTimeout(onNav, 0));
  }

  async function boot() {
    try {
      await waitFor('.blockHead');
      header = document.getElementsByClassName('blockHead')[0];

      injectStyles();
      brutalAntiStickyScan();          // initial sweep
      startAntiStickyObserver();       // keep it off

      tss = document.getElementById('tss');
      renderSearchRow();

      watchTss();
      hookHistory();
    } catch (e) {
      // noop
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
