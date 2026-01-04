// ==UserScript==
// @name         No steampowered.com for zoey - this is enough internet for me today.
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Redirects steampowered.com to google.com, because I'd rather not, right now- despite having made it a habit.
// @author       Novimatrem
// @match        https://steampowered.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @match *://*steampowered.com/*
// @match        https://store.steampowered.com/
// @downloadURL https://update.greasyfork.org/scripts/550884/No%20steampoweredcom%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/550884/No%20steampoweredcom%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location = "https://www.google.com"
})();

