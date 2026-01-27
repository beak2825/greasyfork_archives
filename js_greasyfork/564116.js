// ==UserScript==
// @name         WideView: Gemini
// @author       Kamiya Minoru
// @namespace    N/A
// @version      1.0
// @icon         https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg
// @description  Expands Gemini web interface to full width for better readability and input space
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564116/WideView%3A%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/564116/WideView%3A%20Gemini.meta.js
// ==/UserScript==

(function() {
  GM_addStyle(`
    .content-container,
    .conversation-container,
    .input-area-container {
      max-width: 100% !important;
      width: 90% !important;
      margin-left: 2% !important;
      margin-right: 2% !important;
    }

    .user-query-bubble-with-background,
    .query-content,
    .response-container,
    .markdown {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
  `);
})();
