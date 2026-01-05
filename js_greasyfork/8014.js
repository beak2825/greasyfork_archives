// ==UserScript==
// @name        youtube-subhome
// @description Home buttons directs to subscription page
// @namespace   nah
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/8014/youtube-subhome.user.js
// @updateURL https://update.greasyfork.org/scripts/8014/youtube-subhome.meta.js
// ==/UserScript==
document.getElementById("logo-container").href = "/feed/subscriptions"