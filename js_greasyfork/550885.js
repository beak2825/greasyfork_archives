// ==UserScript==
// @name         Block Websites
// @namespace    http://tampermonkey.net/
// @version      6.9
// @license      Unlicense
// @description  Block Harmful Websites
// @author       Jim Chen
// @match        *://*.reddit.com/*
// @match        *://*.huaren.us/*
// @match        *://*.baidu.com/*
// @match        *://*.zombsroyale.io/*
// @match        *://*.generals.io/*
// @match        *://*.bilibili.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550885/Block%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/550885/Block%20Websites.meta.js
// ==/UserScript==

(function () {
  "use strict";
  alert(
    "WEBSITE BLOCKED\n\nSite blocked by Userscript because it contains extremist contents.\n\nPlease choose healthy alternatives."
  );
  window.location.replace("https://lmarena.ai/?chat-modality=search");
})();