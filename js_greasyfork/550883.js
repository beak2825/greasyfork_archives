// ==UserScript==
// @name         No steamcommunity.com for zoey - this is enough internet for me today.
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Redirects steamcommunity.com to google.com, because I'd rather not, right now- despite having made it a habit.
// @author       Novimatrem
// @match        https://steamcommunity.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @match *://*steamcommunity.com/*
// @downloadURL https://update.greasyfork.org/scripts/550883/No%20steamcommunitycom%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/550883/No%20steamcommunitycom%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location = "https://www.google.com"
})();

