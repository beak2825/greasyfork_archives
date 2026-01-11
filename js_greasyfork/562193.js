// ==UserScript==
// @name         Ekşi - google_vignette fix + unlock clicks
// @namespace    yaren-eksi-fix
// @version      1.2
// @description  Removes #google_vignette and attempts to remove blocking ad overlays that freeze clicks.
// @match        *://eksisozluk.com/*
// @match        *://*.eksisozluk.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562193/Ek%C5%9Fi%20-%20google_vignette%20fix%20%2B%20unlock%20clicks.user.js
// @updateURL https://update.greasyfork.org/scripts/562193/Ek%C5%9Fi%20-%20google_vignette%20fix%20%2B%20unlock%20clicks.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) If URL has #google_vignette, remove it immediately (no reload)
  function stripVignette() {
    if (location.hash && location.hash.includes('google_vignette')) {
      history.replaceState(null, document.title, location.pathname + location.search);
    }
  }

  // 2) Some interstitials/overlays lock scrolling/clicks.
  // Try to remove obvious full-screen fixed overlays.
  function nukeOverlays() {
    // Re-enable scrolling if something set overflow hidden
    if (document.documentElement) document.documentElement.style.overflow = '';
    if (document.body) document.body.style.overflow = '';

    // Remove common "click-blocker" full-screen fixed elements
    const candidates = Array.from(document.querySelectorAll('div, iframe'));
    for (const el of candidates) {
      try {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && (cs.inset === '0px' || (cs.top === '0px' && cs.left === '0px')) ) {
          const w = el.getBoundingClientRect().width;
          const h = el.getBoundingClientRect().height;
          const vw = window.innerWidth || document.documentElement.clientWidth;
          const vh = window.innerHeight || document.documentElement.clientHeight;

          // If it covers almost the full screen, it's likely a blocker
          if (w >= vw * 0.9 && h >= vh * 0.9) {
            // Don't remove Ekşi's own nav if any; only remove suspicious nodes
            // Heuristic: if it contains an iframe or has extremely high z-index
            const zi = parseInt(cs.zIndex || '0', 10);
            if (el.querySelector('iframe') || zi >= 999 || el.id.toLowerCase().includes('google') || el.className.toLowerCase().includes('overlay')) {
              el.remove();
            }
          }
        }
      } catch (e) {}
    }

    // Also remove body-level iframes that may be interstitials
    const iframes = Array.from(document.querySelectorAll('iframe'));
    for (const f of iframes) {
      try {
        const src = (f.getAttribute('src') || '').toLowerCase();
        if (src.includes('doubleclick') || src.includes('googlesyndication') || src.includes('googleads')) {
          f.remove();
        }
      } catch (e) {}
    }
  }

  // Run early + keep watching changes
  stripVignette();

  // Watch hash changes (sometimes added after click)
  window.addEventListener('hashchange', () => {
    stripVignette();
    // Give the page a moment, then cleanup
    setTimeout(nukeOverlays, 50);
    setTimeout(nukeOverlays, 300);
  });

  // Observe DOM mutations in case overlay is injected
  const startObserver = () => {
    const obs = new MutationObserver(() => {
      stripVignette();
      nukeOverlays();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.documentElement) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver);

  // Also run a few times after load
  window.addEventListener('load', () => {
    stripVignette();
    setTimeout(nukeOverlays, 100);
    setTimeout(nukeOverlays, 500);
    setTimeout(nukeOverlays, 1500);
  });
})();
