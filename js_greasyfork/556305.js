// ==UserScript==
// @name         React Grab Anywhere Injector
// @namespace    https://react-grab.com
// @version      1.0.0
// @description  Inject React Grab on any site (including localhost). Hold ⌘C / Ctrl+C + click to grab elements for AI coding tools.
// @author       Microck
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556305/React%20Grab%20Anywhere%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/556305/React%20Grab%20Anywhere%20Injector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_SRC = 'https://unpkg.com/react-grab/dist/index.global.js';

  // Avoid duplicate injection
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    console.log('[React Grab Anywhere] Already loaded.');
    return;
  }

  const s = document.createElement('script');
  s.src = SCRIPT_SRC;
  s.crossOrigin = 'anonymous';
  s.dataset.enabled = 'true';
  document.head.appendChild(s);

  console.log('[React Grab Anywhere] Injected successfully!');
})();
