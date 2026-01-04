// ==UserScript==
// @name         YouTube UI Tweaks: Center Title + Hide CC Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Center-aligns video title and hides the closed captions button on YouTube
// @author       Ricky + Copilot
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553886/YouTube%20UI%20Tweaks%3A%20Center%20Title%20%2B%20Hide%20CC%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553886/YouTube%20UI%20Tweaks%3A%20Center%20Title%20%2B%20Hide%20CC%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    /* Center-align video title */
    ytd-watch-metadata h1.title {
      text-align: center !important;
      width: 100% !important;
      justify-content: center !important;
      display: flex !important;
    }

    /* Hide Closed Captions button */
    .ytp-subtitles-button {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})();
