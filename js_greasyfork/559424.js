// ==UserScript==
// @name         DFProfiler – Preserve Scroll (iframe only)
// @namespace    DFProfiler Preserve Scroll
// @version      1.0
// @description  Preserves scroll position when DFProfiler runs inside an iframe
// @author       Zega, Cezinha
// @match        https://www.dfprofiler.com/profile/view/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559424/DFProfiler%20%E2%80%93%20Preserve%20Scroll%20%28iframe%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559424/DFProfiler%20%E2%80%93%20Preserve%20Scroll%20%28iframe%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Só roda se estiver dentro de iframe
  if (window.top === window.self) return;

  const STORAGE_KEY = 'dfprofiler_scroll_position';

  // ===== RESTORE SCROLL =====
  const savedScroll = sessionStorage.getItem(STORAGE_KEY);
  if (savedScroll !== null) {
    requestAnimationFrame(() => {
      window.scrollTo(0, parseInt(savedScroll, 10));
    });
  }

  // ===== SAVE SCROLL =====
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        sessionStorage.setItem(
          STORAGE_KEY,
          window.scrollY.toString()
        );
        ticking = false;
      });
      ticking = true;
    }
  });
})();
