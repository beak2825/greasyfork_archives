// ==UserScript==
// @name         Reddit Blocker
// @namespace    AAAA
// @version      1.2
// @description  Block subreddits and show "Blocked."
// @match        https://*.reddit.com/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/559540/Reddit%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/559540/Reddit%20Blocker.meta.js
// ==/UserScript==

let ALLOWED = "thinkpad|all|pcmasterrace|localllama|compilers|orderofthesinkingstar|||||||||||||||||||||||||||||||||||||||||";

ALLOWED = ALLOWED.replace(/\|{2,}/g, "|");
ALLOWED = ALLOWED.replace(/^\|+|\|+$/g, "");
let url = location.pathname;

let is_r_page = /\/r\/[^\/]+\/$/i.test(url);
if (is_r_page) {
  const sub_regex = new RegExp("/r/(?:"+ ALLOWED + ")/", "i");
  let is_allowed_sub = sub_regex.test(url);
  if (!is_allowed_sub) {
    window.stop();
    document.documentElement.innerHTML = `<body>Blocked.</body>`;
  }
}
