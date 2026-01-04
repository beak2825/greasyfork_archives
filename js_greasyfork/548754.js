// ==UserScript==
// @name         Youtube Shorts To Normal Video
// @namespace    http://tampermonkey.net/
// @version      2025-09-09_08h17m
// @description  Change Youtube Shorts to the Normal Version
// @author       hangjeff
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548754/Youtube%20Shorts%20To%20Normal%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/548754/Youtube%20Shorts%20To%20Normal%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function redirectShorts(){
        if(location.pathname.startsWith('/shorts'))
            location.replace(location.href.replace("/shorts/", "/watch?v="));
    }
    redirectShorts(); // initialize
    // Observe
    document.addEventListener('yt-navigate-start', redirectShorts);
})();