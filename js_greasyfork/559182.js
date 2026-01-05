// ==UserScript==
// @name         DFProfiler – Auto GPS Tab (iframe only)
// @namespace    DFProfiler – Auto GPS Tab (iframe only)
// @version      1.1
// @description  Automatically opens GPS tab ONLY when running inside an iframe
// @author       Cezinha
// @match        https://www.dfprofiler.com/profile/view/*
// @icon         https://www.dfprofiler.com/images/favicon-32x32.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559182/DFProfiler%20%E2%80%93%20Auto%20GPS%20Tab%20%28iframe%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559182/DFProfiler%20%E2%80%93%20Auto%20GPS%20Tab%20%28iframe%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.self === window.top) {
    return;
  }

  console.log('DFProfiler iframe detected – forcing GPS tab');

  const tryOpenGPS = () => {
    const gpsBtn =
      document.querySelector('[href="#view-gps"]') ||
      document.getElementById('view-gps');

    if (gpsBtn) {
      gpsBtn.click();
      return true;
    }
    return false;
  };

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;

    if (tryOpenGPS() || attempts >= 15) {
      clearInterval(interval);
    }
  }, 500);
})();
