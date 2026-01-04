// ==UserScript==
// @name         Roblox Fake Purchase Gamepass
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  A script that fake purchase gamepass in roblox with nice gui.
// @author       HungVN
// @license      GNU GPLv3 
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560623/Roblox%20Fake%20Purchase%20Gamepass.user.js
// @updateURL https://update.greasyfork.org/scripts/560623/Roblox%20Fake%20Purchase%20Gamepass.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const STATE = {
    applied: false,
    collapsed: false,
    toggleKey: 'Insert',
    hotkeyBound: false,
    done: {
      byline: false,
      price: false,
      button: false,
    },
    obs: null,
    scheduled: false,
  };

  const css = `
  #tm-rpg-root{position:fixed;right:16px;bottom:16px;z-index:2147483647;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
  #tm-rpg-panel{width:320px;border-radius:14px;background:rgba(18,18,22,.92);backdrop-filter:blur(10px);color:#fff;box-shadow:0 16px 50px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.12);overflow:hidden}
  #tm-rpg-header{display:flex;align-items:center;justify-content:space-between;padding:12px 12px 10px 12px;border-bottom:1px solid rgba(255,255,255,.10)}
  #tm-rpg-title{display:flex;gap:10px;align-items:center}
  #tm-rpg-badge{width:10px;height:10px;border-radius:99px;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
  #tm-rpg-h1{font-size:13px;font-weight:700;letter-spacing:.2px;opacity:.95}
  #tm-rpg-sub{font-size:11px;opacity:.75;margin-top:2px}
  #tm-rpg-actions{display:flex;gap:8px}
  .tm-rpg-btn{appearance:none;border:0;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:650;cursor:pointer;transition:transform .04s ease,background .15s ease,color .15s ease}
  .tm-rpg-btn:active{transform:translateY(1px)}
  .tm-rpg-btn-primary{background:#3b82f6;color:#fff}
  .tm-rpg-btn-primary:hover{background:#2f6fe0}
  .tm-rpg-btn-ghost{background:rgba(255,255,255,.10);color:#fff}
  .tm-rpg-btn-ghost:hover{background:rgba(255,255,255,.14)}
  #tm-rpg-body{padding:12px}
  #tm-rpg-status{font-size:11px;opacity:.8;line-height:1.35}
  `;

  function injectStyle() {
    if (document.getElementById('tm-rpg-style')) return;
    const s = document.createElement('style');
    s.id = 'tm-rpg-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    for (const c of children) n.appendChild(c);
    return n;
  }

  function addHonestNoticeNearByline() {
    if (STATE.done.byline) return false;
    if (document.querySelector('[data-tm-rpg="owned-inline"]')) {
      STATE.done.byline = true;
      return true;
    }

    const a =
      document.querySelector('span.text-label a.text-name[href*="/users/"][href$="/profile/"]') ||
      document.querySelector('span.text-label a.text-name[href*="/communities/"]') ||
      document.querySelector('a.text-name[href*="/users/"][href$="/profile/"]') ||
      document.querySelector('a.text-name[href*="/communities/"]');
    if (!a) return false;

    const bylineSpan = a.closest('span.text-label') || a.closest('span');
    if (!bylineSpan) return false;
    if (!bylineSpan.parentElement) return false;

    const divider = el('div', { class: 'divider', 'data-tm-rpg': 'owned-inline', html: '&nbsp;' });
    const check = el('div', { class: 'label-checkmark', 'data-tm-rpg': 'owned-check' }, [
      el('span', { class: 'icon-checkmark-white-bold' }),
    ]);
    const text = el('span', { 'data-tm-rpg': 'owned-text', text: 'Item Owned' });

    const bylineRow = bylineSpan.closest('div');
    const verified = bylineRow && bylineRow.querySelector('[data-rblx-verified-badge-icon], [data-rblx-badge-icon], .verified-badge-icon-item-details-author-container');
    const anchor = verified ? verified.closest('span') || verified : bylineSpan;

    anchor.insertAdjacentElement('afterend', divider);
    divider.insertAdjacentElement('afterend', check);
    check.insertAdjacentElement('afterend', text);

    STATE.done.byline = true;
    return true;
  }

  function updatePriceArea() {
    if (STATE.done.price) return false;

    const container = document.querySelector('.price-container-text');
    if (!container) return false;

    if (!container.querySelector('[data-tm-rpg="price-line"]')) {
      const line = el('div', {
        class: 'item-first-line',
        'data-tm-rpg': 'price-line',
        text: 'This item is available in your inventory.',
      });
      container.insertAdjacentElement('afterbegin', line);
    }

    STATE.done.price = true;
    return true;
  }

  function replaceBuyButtonWithInventory() {
    if (STATE.done.button) return false;

    const action = document.querySelector('.action-button');
    if (!action) return false;

    if (action.querySelector('#inventory-button[data-tm-rpg="inventory"]')) {
      STATE.done.button = true;
      return true;
    }

    const btn = action.querySelector('button.PurchaseButton, button[data-button-action="buy"], button');
    if (!btn) return false;

    const a = el('a', {
      id: 'inventory-button',
      type: 'button',
      class: 'btn-fixed-width-lg btn-control-md',
      'data-button-action': 'inventory',
      'data-tm-rpg': 'inventory',
      text: 'Inventory',
    });

    btn.replaceWith(a);
    STATE.done.button = true;
    return true;
  }

  function allDone() {
    return STATE.done.byline && STATE.done.price && STATE.done.button;
  }

  function applyChangesOnce() {
    addHonestNoticeNearByline();
    updatePriceArea();
    replaceBuyButtonWithInventory();

    const status = document.getElementById('tm-rpg-status');
    if (status) {
      status.textContent = allDone() ? 'Activated' : 'Activating...';
    }

    if (allDone()) stopObserver();
  }

  function scheduleApply() {
    if (!STATE.applied) return;
    if (STATE.scheduled) return;
    STATE.scheduled = true;

    setTimeout(() => {
      STATE.scheduled = false;
      if (!STATE.applied) return;

      if (STATE.obs) STATE.obs.disconnect();
      try {
        applyChangesOnce();
      } finally {
        if (STATE.obs && STATE.applied && !allDone()) {
          STATE.obs.observe(document.documentElement, { childList: true, subtree: true });
        }
      }
    }, 150);
  }

  function startObserver() {
    if (STATE.obs) return;
    STATE.obs = new MutationObserver(() => scheduleApply());
    STATE.obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (STATE.obs) {
      STATE.obs.disconnect();
      STATE.obs = null;
    }
  }

  function setCollapsed(collapsed) {
    STATE.collapsed = collapsed;
    const root = document.getElementById('tm-rpg-root');
    if (!root) return;
    root.style.display = collapsed ? 'none' : 'block';
  }

  function mountUI() {
    if (document.getElementById('tm-rpg-root')) return;

    injectStyle();

    const root = el('div', { id: 'tm-rpg-root' });

    const headerLeft = el('div', { id: 'tm-rpg-title' }, [
      el('div', { id: 'tm-rpg-badge' }),
      el('div', {}, [
        el('div', { id: 'tm-rpg-h1', text: 'Roblox Fake Purchase Gamepass' }),
        el('div', { id: 'tm-rpg-sub', text: 'press insert to show' }),
      ]),
    ]);

    const btnApply = el('button', { class: 'tm-rpg-btn tm-rpg-btn-primary', type: 'button', text: 'Start' });
    const btnHide = el('button', { class: 'tm-rpg-btn tm-rpg-btn-ghost', type: 'button', text: 'Hide' });

    const headerRight = el('div', { id: 'tm-rpg-actions' }, [btnApply, btnHide]);
    const header = el('div', { id: 'tm-rpg-header' }, [headerLeft, headerRight]);

    const status = el('div', { id: 'tm-rpg-status', text: 'Not activated yet.' });
    const body = el('div', { id: 'tm-rpg-body' }, [status]);
    const panel = el('div', { id: 'tm-rpg-panel' }, [header, body]);

    root.appendChild(panel);
    document.body.appendChild(root);

    btnApply.addEventListener('click', () => {
      STATE.applied = true;
      STATE.done.byline = false;
      STATE.done.price = false;
      STATE.done.button = false;

      const s = document.getElementById('tm-rpg-status');
      if (s) s.textContent = 'Currently in effect...';

      startObserver();
      scheduleApply();
    });

    btnHide.addEventListener('click', () => setCollapsed(true));
  }

  function init() {
    mountUI();
    if (!STATE.hotkeyBound) {
      STATE.hotkeyBound = true;
      document.addEventListener(
        'keydown',
        (e) => {
          const t = e.target;
          if (t && (t.isContentEditable || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
          if (e.key !== STATE.toggleKey) return;
          setCollapsed(!STATE.collapsed);
        },
        true
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
