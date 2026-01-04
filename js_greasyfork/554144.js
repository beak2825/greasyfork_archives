// ==UserScript==
// @name         GPlex Load Patch (Blank Screen)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Show a blank screen before fading to google to make gplex feel more smooth.
// @author       sundowndev
// @match        *://www.google.com/*
// @match        *://www.google.com/search*
// @match        *://www.google.com/webhp*
// @match        *://www.google.com/gplex
// @run-at       document-start
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554144/GPlex%20Load%20Patch%20%28Blank%20Screen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554144/GPlex%20Load%20Patch%20%28Blank%20Screen%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === CONFIG ===
  const MIN_BLANK_MS = 400; // how long to keep the screen blank
  const FADE_MS = 130; // fade-out duration (ms)
  const BG = '#ffffff';// background color for the blank screen
  // ==============

  try {
    // Ensure documentElement exists (should at document-start)
    const docEl = document.documentElement;
    if (!docEl) return;

    // Creates overlay element with inline styles (so it applies immediately)
    const overlay = document.createElement('div');
    overlay.id = 'gplex-blank-overlay';
    overlay.setAttribute('data-gplex-blank', '1');
    overlay.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;' +
      `background:${BG};z-index:2147483647;opacity:1;transition:none;pointer-events:auto;display:block;`;

    // Prevent scrolling / jumps while overlay is present by hiding overflow on <html>.
    // Save previous value to restore later.
    const prevOverflow = docEl.style.overflow || '';
    docEl.style.overflow = 'hidden';

    // Append overlay to <html> (works even if <body> doesn't exist yet)
    docEl.appendChild(overlay);

    // Remove overlay after MIN_BLANK_MS, with a short fade.
    setTimeout(() => {
      try {
        overlay.style.transition = `opacity ${FADE_MS}ms ease`;
        overlay.style.opacity = '0';
        // After fade, remove element and restore overflow
        setTimeout(() => {
          try { overlay.remove(); } catch (e) {}
          try { docEl.style.overflow = prevOverflow; } catch (e) {}
        }, FADE_MS + 10);
      } catch (err) {
        // If fade fails for any reason, force cleanup
        try { overlay.remove(); } catch (e) {}
        try { docEl.style.overflow = prevOverflow; } catch (e) {}
      }
    }, MIN_BLANK_MS);

    // Safety: if the page is unloaded/navigated before timeout, ensure overlay is removed
    const cleanup = () => {
      try { overlay.remove(); } catch (e) {}
      try { docEl.style.overflow = prevOverflow; } catch (e) {}
      ['pagehide', 'beforeunload', 'visibilitychange'].forEach(ev => window.removeEventListener(ev, cleanup));
    };
    ['pagehide', 'beforeunload', 'visibilitychange'].forEach(ev => window.addEventListener(ev, cleanup, { passive: true }));

  } catch (err) {
    console.error('Blank-screen patch error:', err);
  }
})();
