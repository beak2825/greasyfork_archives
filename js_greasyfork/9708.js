// ==UserScript==
// @name        fb-recommendations-hider
// @namespace   fb-recommendations-hider
// @description Takes the distraction away.
// @include     *://www.facebook.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9708/fb-recommendations-hider.user.js
// @updateURL https://update.greasyfork.org/scripts/9708/fb-recommendations-hider.meta.js
// ==/UserScript==
var div = document.getElementById("pagelet_ego_pane");

if (div) {
    div.style.display = "none";
}