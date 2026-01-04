// ==UserScript==
// @name         TORN Item Market Confirmation
// @namespace    https://www.torn.com/
// @version      1.6
// @description  Fast Item Market buy.
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553458/TORN%20Item%20Market%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/553458/TORN%20Item%20Market%20Confirmation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const OVERLAY_ID = 'tm-fast-yes-overlay';
  const OVERLAY_Z  = 999999;

  let lastBuyRect = null;
  let clickToken = 0; // crește la fiecare click pe BUY (anulează run-urile vechi)

  function hideOverlay() {
    const el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
  }

  function ensureOverlay(rect) {
    if (!rect) return;
    let btn = document.getElementById(OVERLAY_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = OVERLAY_ID;
      btn.textContent = 'Yes';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const y = [...document.querySelectorAll('button')]
          .find(b => (b.textContent || '').trim().toLowerCase() === 'yes');
        if (y) y.click();
        hideOverlay();
      });
      document.body.appendChild(btn);
    }
    Object.assign(btn.style, {
      position: 'fixed',
      left:  rect.left + 'px',
      top:   rect.top  + 'px',
      width: rect.width + 'px',
      height:rect.height + 'px',
      zIndex:String(OVERLAY_Z),
      cursor:'pointer',
      border:'0',
      borderRadius:'6px',
      padding:'0',
      fontWeight:'700',
      lineHeight: rect.height + 'px',
      textAlign:'center',
      background:'#4caf50',
      color:'#fff',
      boxShadow:'0 1px 3px rgba(0,0,0,.3)',
    });
  }

  function findYes() {
    return [...document.querySelectorAll('button')]
      .find(b => (b.textContent || '').trim().toLowerCase() === 'yes') || null;
  }

  // watcher foarte rapid bazat pe rAF (max ~900ms)
  function awaitYesAndPlaceOverlay(myToken) {
    const start = performance.now();
    const tick = () => {
      // dacă între timp s-a dat alt click pe BUY, ne oprim
      if (myToken !== clickToken) return;

      const yes = findYes();
      if (yes) {
        // curățări când se închide dialogul
        const close = document.querySelector('button[aria-label="Close panel"]');
        if (close) close.addEventListener('click', hideOverlay, { once: true });
        const noBtn = yes.parentElement?.querySelector('button:not(:first-child)');
        if (noBtn) noBtn.addEventListener('click', hideOverlay, { once: true });
        yes.addEventListener('click', hideOverlay, { once: true });

        ensureOverlay(lastBuyRect);
        return;
      }
      if (performance.now() - start > 900) return; // timeout scurt
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Event delegation pe tot documentul
  document.addEventListener('click', (e) => {
    // dacă apăsăm overlay-ul, lăsăm handlerul lui să se ocupe
    const isOverlay = e.target instanceof Element && e.target.id === OVERLAY_ID;
    if (isOverlay) return;

    const buy = e.target instanceof Element
      ? e.target.closest('button[aria-label^="Buy"]')
      : null;

    if (!buy) {
      // orice alt click închide overlay-ul (nu rămâne „în spate”)
      hideOverlay();
      return;
    }

    // reset total pentru rularea anterioară
    clickToken++;
    hideOverlay();

    const r = buy.getBoundingClientRect();
    lastBuyRect = { left: r.left, top: r.top, width: r.width, height: r.height };

    // pornim așteptarea pentru "Yes" pentru acest click
    awaitYesAndPlaceOverlay(clickToken);
  }, true);

  // defensive cleanup
  window.addEventListener('scroll', hideOverlay, { passive: true });
  window.addEventListener('resize', hideOverlay);
  window.addEventListener('popstate', hideOverlay);
})();
