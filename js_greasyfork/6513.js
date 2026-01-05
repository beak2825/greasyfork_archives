// ==UserScript==
// @name        Flightradar24 Bottom Ad Hider
// @namespace   fr24adhider
// @description Hides the bottom ad covering the map on flightradar24.com
// @include     http://www.flightradar24.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6513/Flightradar24%20Bottom%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/6513/Flightradar24%20Bottom%20Ad%20Hider.meta.js
// ==/UserScript==
document.getElementById("bottomRightOverlays").remove();
document.getElementById("gad-container").remove();