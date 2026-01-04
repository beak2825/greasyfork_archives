// ==UserScript==
// @name         Torn Market — BUY & YES Alignment (Desktop + Mobile)
// @namespace    https://torn.tools/
// @version      1.1
// @description  BUY & YES Alignment (Desktop + Mobile)
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549268/Torn%20Market%20%E2%80%94%20BUY%20%20YES%20Alignment%20%28Desktop%20%2B%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549268/Torn%20Market%20%E2%80%94%20BUY%20%20YES%20Alignment%20%28Desktop%20%2B%20Mobile%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MOBILE_MEDIA = '(max-width: 784px)';

  const buyRestoreMap = new WeakMap();
  const hostCloseRestore = new WeakMap();

  const isMobile = () => window.matchMedia(MOBILE_MEDIA).matches;
  const getRow = (el) => el.closest('li.rowWrapper___me3Ox, li.rowWrapper___OrFGK, li');

  function getCartBtn(row) {
    return row?.querySelector('.showBuyControlsButton___K8f72, .showBuyControlsButton, [aria-label="Show buy controls"]');
  }
  function getCartRect(row) {
    const b = getCartBtn(row);
    return b ? b.getBoundingClientRect() : null;
  }
  function findBuyButton(node) {
    if (!node) return null;
    let btn = node.closest('button.torn-btn');
    if (btn && /buy/i.test(btn.getAttribute('aria-label') || '') && /\?$/.test(btn.getAttribute('aria-label'))) return btn;
    btn = node.closest('button');
    if (btn && /(^|\s)buy(\s|$)/i.test(btn.textContent)) return btn;
    const row = getRow(node);
    const cand = row?.querySelector('button[aria-label*="Buy"][aria-label$="?"]:not([disabled]), button.torn-btn');
    return cand?.closest('button') || null;
  }
  function queryYes(scope) {
    const buttons = scope.querySelectorAll('button');
    for (const b of buttons) if (b.textContent.trim().toLowerCase() === 'yes') return b;
    return null;
  }
  function waitFor(selectorFn, scope, timeoutMs) {
    return new Promise((resolve, reject) => {
      const now = selectorFn(scope);
      if (now) return resolve(now);
      const obs = new MutationObserver(() => {
        const el = selectorFn(scope);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(scope, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); const el = selectorFn(scope); el ? resolve(el) : reject(); }, timeoutMs);
    });
  }

  function pushCloseLeft(row, targetRect) {
    const closeWrap =
      row.querySelector('.closeButtonWrapper___y5R6c, .closeButtonWrapper___UHxtx, .closeButtonWrapper') ||
      row.querySelector('[aria-label="Close panel"]')?.parentElement;
    const closeBtn =
      row.querySelector('.closeButton___kyy2h, .closeButton___VPNDv, .closeButton___YhjuO, [aria-label="Close panel"]');
    if (!closeWrap || !closeBtn) return () => {};

    const rowRect = row.getBoundingClientRect();
    const top = targetRect.top - rowRect.top;
    const w = targetRect.width;
    const h = targetRect.height;

    const count = +(closeWrap.dataset._pushCount || 0);
    if (count === 0) {
      closeWrap.dataset._orig = JSON.stringify({
        position: closeWrap.style.position,
        top: closeWrap.style.top,
        right: closeWrap.style.right,
        left: closeWrap.style.left,
        width: closeWrap.style.width,
        height: closeWrap.style.height,
        display: closeWrap.style.display,
        ai: closeWrap.style.alignItems,
        jc: closeWrap.style.justifyContent
      });
      Object.assign(closeWrap.style, {
        position: 'absolute',
        top: `${Math.max(0, top)}px`,
        right: `${w}px`,
        left: 'auto',
        width: `${w}px`,
        height: `${h}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
    }
    closeWrap.dataset._pushCount = String(count + 1);

    return function restoreClose() {
      const c = +(closeWrap.dataset._pushCount || 1) - 1;
      closeWrap.dataset._pushCount = String(Math.max(0, c));
      if (c <= 0) {
        const orig = JSON.parse(closeWrap.dataset._orig || '{}');
        Object.assign(closeWrap.style, {
          position: orig.position || '',
          top: orig.top || '',
          right: orig.right || '',
          left: orig.left || '',
          width: orig.width || '',
          height: orig.height || '',
          display: orig.display || '',
          alignItems: orig.ai || '',
          justifyContent: orig.jc || ''
        });
        delete closeWrap.dataset._orig;
      }
    };
  }

  async function mobileMoveBuyUnderCart(row) {
    const cartRect = getCartRect(row);
    if (!cartRect) return;

    const buyBtn = await waitFor(
      (sc) => sc.querySelector('.buyDialog___iBsgu .buyButton___Flkhg, .buyDialog .buyButton___Flkhg, .buyDialog button[aria-label*="Buy"]'),
      row, 1500).catch(() => null);
    if (!buyBtn) return;

    let host = row.querySelector('[data-mobile-buy-host="1"]');
    if (!host) {
      host = document.createElement('div');
      host.setAttribute('data-mobile-buy-host', '1');
      row.appendChild(host);
    }

    positionHost(host, row, cartRect);

    if (!buyRestoreMap.has(buyBtn)) {
      buyRestoreMap.set(buyBtn, { parent: buyBtn.parentElement, next: buyBtn.nextSibling });
    }
    styleAsFill(buyBtn);
    host.appendChild(buyBtn);

    const restoreClose = pushCloseLeft(row, cartRect);
    hostCloseRestore.set(host, restoreClose);

    const cleaner = new MutationObserver(() => {
      const dialog = row.querySelector('.buyDialog___iBsgu, .buyDialog');
      if (!dialog) {
        mobileRestoreBuy(row);
      }
    });
    cleaner.observe(row, { childList: true, subtree: true });
  }

  function mobileRestoreBuy(row) {
    const host = row.querySelector('[data-mobile-buy-host="1"]');
    if (host) {
      const btn = host.querySelector('button');
      if (btn && buyRestoreMap.has(btn)) {
        const { parent, next } = buyRestoreMap.get(btn);
        try { parent.insertBefore(btn, next); } catch(_) {}
      }
      const restore = hostCloseRestore.get(host);
      if (restore) try { restore(); } catch(_) {}
      host.remove();
    }
  }

  async function mobilePlaceYesUnderCart(row) {
    const yesBtn = await waitFor(queryYes, row, 1200).catch(() => null);
    if (!yesBtn) return;

    const cartRect = getCartRect(row);
    if (!cartRect) return;

    let host = row.querySelector('[data-mobile-yes-host="1"]');
    if (!host) {
      host = document.createElement('div');
      host.setAttribute('data-mobile-yes-host', '1');
      row.appendChild(host);
    }
    positionHost(host, row, cartRect);

    let bg = host.querySelector('[data-bg]');
    if (!bg) {
      bg = document.createElement('div');
      bg.setAttribute('data-bg', '1');
      Object.assign(bg.style, {
        position: 'absolute',
        inset: '0',
        background: '#242424',
        borderRadius: '4px',
        zIndex: '0'
      });
      host.appendChild(bg);
    }

    let proxy = host.querySelector('button');
    if (!proxy) {
      proxy = document.createElement('button');
      proxy.type = 'button';
      proxy.textContent = (yesBtn.textContent || 'Yes').trim();
      proxy.className = yesBtn.className || 'torn-btn';
      styleAsFill(proxy);
      proxy.style.position = 'relative';
      proxy.style.zIndex = '1';
      proxy.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        try { yesBtn.click(); } catch(_) {}
      });
      host.appendChild(proxy);
    }

    const restoreClose = pushCloseLeft(row, cartRect);
    hostCloseRestore.set(host, restoreClose);

    const cleaner = new MutationObserver(() => {
      if (!row.contains(yesBtn)) {
        const r = hostCloseRestore.get(host);
        if (r) try { r(); } catch(_) {}
        host.remove();
        cleaner.disconnect();
      }
    });
    cleaner.observe(row, { childList: true, subtree: true });
  }

  async function desktopYesNearX(row, anchorRect) {
    const yesBtn = await waitFor(queryYes, row, 1200).catch(() => null);
    if (!yesBtn) return;

    let rect = anchorRect;
    if (!rect) {
      const buy = row.querySelector('button.torn-btn');
      rect = buy ? buy.getBoundingClientRect() : null;
    }
    if (!rect) return;

    let host = row.querySelector('[data-desktop-yes-host="1"]');
    if (!host) {
      host = document.createElement('div');
      host.setAttribute('data-desktop-yes-host', '1');
      row.appendChild(host);
    }
    positionHost(host, row, rect);

    let proxy = host.querySelector('button');
    if (!proxy) {
      proxy = document.createElement('button');
      proxy.type = 'button';
      proxy.textContent = (yesBtn.textContent || 'Yes').trim();
      proxy.className = yesBtn.className || 'torn-btn';
      styleAsFill(proxy);
      proxy.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); try { yesBtn.click(); } catch(_) {} });
      host.appendChild(proxy);
    }

    const restoreClose = pushCloseLeft(row, rect);
    hostCloseRestore.set(host, restoreClose);

    const cleaner = new MutationObserver(() => {
      if (!row.contains(yesBtn)) {
        const r = hostCloseRestore.get(host);
        if (r) try { r(); } catch(_) {}
        host.remove();
        cleaner.disconnect();
      }
    });
    cleaner.observe(row, { childList: true, subtree: true });
  }

  function positionHost(host, row, rect) {
    const rr = row.getBoundingClientRect();
    Object.assign(host.style, {
      position: 'absolute',
      left: `${rect.left - rr.left}px`,
      top: `${rect.top - rr.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    });
  }
  function styleAsFill(btn) {
    Object.assign(btn.style, {
      pointerEvents: 'auto',
      width: '100%',
      height: '100%',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap'
    });
  }

  document.addEventListener('click', async (ev) => {
    const row = getRow(ev.target);
    if (!row) return;

    const isCart = !!ev.target.closest('.showBuyControlsButton___K8f72, .showBuyControlsButton, [aria-label="Show buy controls"]');
    const buyBtn = findBuyButton(ev.target);

    if (isMobile()) {
      if (isCart) {
        setTimeout(() => mobileMoveBuyUnderCart(row), 0);
      } else if (buyBtn) {
        waitFor(queryYes, row, 1500)
          .then(() => mobilePlaceYesUnderCart(row))
          .catch(() => {});
      }
    } else {
      if (buyBtn) {
        const rect = buyBtn.getBoundingClientRect();
        waitFor(queryYes, row, 1200).then(() => desktopYesNearX(row, rect));
      }
    }
  }, true);

  window.addEventListener('resize', () => {
    document.querySelectorAll('[data-mobile-buy-host="1"],[data-mobile-yes-host="1"],[data-desktop-yes-host="1"]').forEach(host => {
      const row = host.closest('li');
      if (!row) return;
      const rect = isMobile()
        ? getCartRect(row)
        : (row.querySelector('button.torn-btn')?.getBoundingClientRect() || null);
      if (!rect) return;
      positionHost(host, row, rect);
    });
  });
})();
