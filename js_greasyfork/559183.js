// ==UserScript==
// @name         DFProfiler – AutoDisable Last Cycle (iframe only)
// @namespace    DFProfiler – AutoDisable Last Cycle (iframe only)
// @version      1.0
// @description  Forces "Last Cycle" to OFF when profile is opened inside an iframe
// @author    Cezinha
// @match        https://www.dfprofiler.com/profile/view/*
// @icon         https://www.dfprofiler.com/images/favicon-32x32.png
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559183/DFProfiler%20%E2%80%93%20AutoDisable%20Last%20Cycle%20%28iframe%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559183/DFProfiler%20%E2%80%93%20AutoDisable%20Last%20Cycle%20%28iframe%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.self === window.top) return;

  console.log('[DFProfiler] Iframe detected – controlling Last Cycle');

  function tryDisableLastCycle() {
    const btn = document.getElementById('showLast');
    if (!btn) return false;

    if (btn.textContent.includes('[No]')) {
      console.log('[DFProfiler] Last Cycle already OFF');
      return true;
    }

    if (btn.textContent.includes('[Yes]')) {
      console.log('[DFProfiler] Turning Last Cycle OFF');
      btn.click();
      return true;
    }

    return false;
  }

  if (tryDisableLastCycle()) return;

  const observer = new MutationObserver(() => {
    if (tryDisableLastCycle()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
