// ==UserScript==
// @name        Remove titles from all youtube embeds
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/embed/*
// @grant       none
// @version     1.1
// @author      -
// @description 9/4/2025, 10:22:23 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548385/Remove%20titles%20from%20all%20youtube%20embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/548385/Remove%20titles%20from%20all%20youtube%20embeds.meta.js
// ==/UserScript==


setInterval(function() {
  Array.from(document.querySelectorAll('.ytp-title-text')).map(e=>e.style.display = 'none');
  Array.from(document.querySelectorAll('.ytp-title-channel')).map(e=>e.style.display = 'none');
}, 1000);
