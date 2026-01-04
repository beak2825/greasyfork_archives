// ==UserScript==
// @name            DART - YouTube NOT INTERESTED in 1-Click
// @namespace       dart/youtube/ni-drc
// @version         2025-10-28
// @description     Displays two icons on the middle-right side of each YouTube card (Home page): “Not interested” and “Don’t recommend channel.” Executes the action in a single click (opens the card menu, waits, and clicks the target item). Keeps YouTube’s default flow (does not auto-remove or auto-confirm).
// @author          DartVeiga
// @match           *://www.youtube.com/*
// @match           *://m.youtube.com/*
// @grant           none
// @run-at          document-idle
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/554006/DART%20-%20YouTube%20NOT%20INTERESTED%20in%201-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/554006/DART%20-%20YouTube%20NOT%20INTERESTED%20in%201-Click.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== Visual / structural constants (same as in your first script) =====
  const HOST_CLASS    = 'dart-ni-host';
  const OVERLAY_CLASS = 'dart-ni-overlay';
  const BTN_CLASS     = 'dart-ni-btn';
  const MARK_ATTR     = 'data-dart-wired';
  const CARD_SEL = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer'
  ].join(',');

  const LABEL_NI  = 'Not interested';
  const LABEL_DRC = "Don't recommend channel";

  // ===== CSS (layout and style identical to the first script) =====
  const css = `
    .${HOST_CLASS}{ position:relative; z-index:3; overflow:visible; }
    .${HOST_CLASS} .yt-lockup-view-model-wiz__content-image,
    .${HOST_CLASS} .yt-thumbnail-view-model__image { position:relative; z-index:0; }

    .${OVERLAY_CLASS}{
      position:absolute; right:10px; top:50%; transform:translateY(-50%);
      display:flex; flex-direction:column; gap:10px;
      z-index:2147483647; opacity:0; pointer-events:none;
      transition:opacity .12s ease, transform .12s ease;
    }
    .${HOST_CLASS}:hover .${OVERLAY_CLASS}, .${OVERLAY_CLASS}:hover{
      opacity:1; pointer-events:auto;
    }
    .${BTN_CLASS}{
      width:34px; height:34px; border:none; border-radius:999px;
      background:rgba(0,0,0,.82); color:#fff; cursor:pointer;
      display:grid; place-items:center; box-shadow:0 4px 14px rgba(0,0,0,.25);
      transition:transform .08s ease, filter .12s ease, opacity .12s ease;
    }
    .${BTN_CLASS}:hover{ transform:scale(1.07); filter:brightness(1.15); }
    .${BTN_CLASS}[data-busy="1"]{ opacity:.6; cursor:progress; }
    .${BTN_CLASS} svg{ width:18px; height:18px; fill:currentColor; }
  `.replace(/;/g,'!important;');
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.documentElement.appendChild(styleTag);

  // ===== Utility functions =====
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const norm  = s => (s||'').trim().replace(/\s+/g,' ');

  function createSVG(d){
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', d);
    svg.appendChild(p);
    return svg;
  }

  // ===== Menu logic (based on the older script, adapted to YouTube’s new DOM) =====

  // Captures the LAST contextual menu that appears after opening a card’s 3-dot menu.
  // Strategy:
  // 1) Start a short-lived MutationObserver;
  // 2) Trigger the card menu;
  // 3) Retrieve the most recent visible <yt-list-view-model>.
  async function openAndGetFreshMenu(menuBtn, openTimeout = 2500) {
    // Close any previously open menu
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));

    let lastMenu = null;
    const menus = [];
    let observer;

    observer = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches?.('yt-list-view-model[role="listbox"], yt-list-view-model, [role="listbox"], [role="menu"]')) {
            menus.push(n);
            lastMenu = n;
          } else if (n.querySelector) {
            const found = n.querySelector('yt-list-view-model[role="listbox"], yt-list-view-model, [role="listbox"], [role="menu"]');
            if (found) {
              menus.push(found);
              lastMenu = found;
            }
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Trigger the card menu
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach((type) => {
      menuBtn.dispatchEvent(new MouseEvent(type, { bubbles: true, composed: true, cancelable: true, button: 0 }));
    });

    const t0 = performance.now();
    let menu = null;

    // Wait for the menu (either new or reused)
    while (performance.now() - t0 < openTimeout) {
      // Detect menus added recently
      const visibleMenus = menus.filter((m) => m.offsetParent !== null);

      // Fallback: detect reused menu (already present and visible)
      const fallback = document.querySelector('yt-list-view-model[role="listbox"]:not([hidden]), .ytContextualSheetLayoutContentContainer yt-list-view-model');

      if (visibleMenus.length) {
        menu = visibleMenus[visibleMenus.length - 1];
        break;
      } else if (fallback && fallback.offsetParent !== null) {
        menu = fallback;
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    observer.disconnect();
    return menu;
  }

  // Waits for the desired menu item and clicks it when found
  async function waitItemAndClick(menu, label, itemTimeout=3000){
    const t0 = performance.now();
    while (performance.now()-t0 < itemTimeout){
      const items = menu.querySelectorAll('yt-list-item-view-model[role="menuitem"], yt-list-item-view-model, [role="menuitem"], button');
      for (const el of items){
        const text = norm(el.textContent);
        if (text === label){
          (el.closest('button') || el).click();
          return true;
        }
      }
      await sleep(80);
    }
    return false;
  }

  // Locates the 3-dot “more actions” button on a card
  function findMenuBtn(card){
    return (
      card.querySelector('.yt-lockup-metadata-view-model-wiz__menu-button button') ||
      card.querySelector('button[aria-label="More actions"]') ||
      card.querySelector('button[aria-haspopup="menu"]') ||
      card.querySelector('button.yt-spec-button-shape-next')
    );
  }

  // ===== 1-click action triggered by the floating button =====
  async function runOneClick(card, kind, btnEl){
    if (!card) return;
    const menuBtn = findMenuBtn(card);
    if (!menuBtn) return console.warn('[DART] menu button not found');

    try{
      btnEl?.setAttribute('data-busy','1');

      const menu = await openAndGetFreshMenu(menuBtn);
      if (!menu) {
        console.warn('[DART] menu not found/visible');
        return;
      }

      const label = (kind === 'NI') ? LABEL_NI : LABEL_DRC;
      const ok = await waitItemAndClick(menu, label);
      if (!ok) console.warn('[DART] menu item not found:', label);

      // Close any leftover open menu
      await sleep(400);
      document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', code:'Escape', bubbles:true}));
    } finally {
      btnEl?.removeAttribute('data-busy');
    }
  }

  // ===== UI: floating buttons overlayed on each card (same position/style as v1) =====
  function wireCard(card){
    if (!card || card.hasAttribute(MARK_ATTR)) return;

    card.classList.add(HOST_CLASS);
    card.setAttribute(MARK_ATTR,'1');

    const overlay = document.createElement('div');
    overlay.className = OVERLAY_CLASS;

    // "Not interested" button — native YouTube menu icon
    const niBtn = document.createElement('button');
    niBtn.className = BTN_CLASS;
    niBtn.title = LABEL_NI;
    niBtn.appendChild(createSVG('M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z'));
    niBtn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      runOneClick(card,'NI',niBtn);
    }, {capture:true});

    // "Don't recommend channel" button — native YouTube menu icon
    const drcBtn = document.createElement('button');
    drcBtn.className = BTN_CLASS;
    drcBtn.title = LABEL_DRC;
    drcBtn.appendChild(createSVG('M12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm7 11H5v-2h14v2z'));
    drcBtn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      runOneClick(card,'DRC',drcBtn);
    }, {capture:true});

    overlay.appendChild(niBtn);
    overlay.appendChild(drcBtn);
    card.appendChild(overlay);
  }

  function inject(root=document){
    root.querySelectorAll(CARD_SEL).forEach(wireCard);
  }

  // ===== Initialization and dynamic injection =====
  inject();

  const mo = new MutationObserver(muts=>{
    for (const m of muts){
      m.addedNodes.forEach(n=>{
        if (!(n instanceof Element)) return;
        if (n.matches?.(CARD_SEL)) wireCard(n);
        else if (n.querySelector) inject(n);
      });
    }
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
  window.addEventListener('yt-navigate-finish', ()=>inject(), true);
})();
