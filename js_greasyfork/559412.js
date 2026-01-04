// ==UserScript==
// @name         HN Blocker
// @namespace    C89sd
// @version      1.3
// @description  Block Hacker News and show "Blocked."
// @match        https://news.ycombinator.com/*
// @exclude      https://news.ycombinator.com/item*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/559412/HN%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/559412/HN%20Blocker.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = `<body>Blocked.</body>`;
