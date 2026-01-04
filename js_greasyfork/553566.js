// ==UserScript==
// @name        skribbl.io disable mobile layout
// @description Prevents switching to mobile layout based on window aspect ratio
// @version     2025.10.24
// @match       https://skribbl.io/*
// @license     MIT
// @namespace https://greasyfork.org/users/1530188
// @downloadURL https://update.greasyfork.org/scripts/553566/skribblio%20disable%20mobile%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/553566/skribblio%20disable%20mobile%20layout.meta.js
// ==/UserScript==

const ss = document.styleSheets[0];
for (let i = ss.rules.length - 1; i >= 0; --i) {
  if (ss.rules[i].conditionText?.match(/max-aspect-ratio/)) {
    ss.deleteRule(i);
    console.log('deleted max-aspect-ratio CSS rule');
  }
}