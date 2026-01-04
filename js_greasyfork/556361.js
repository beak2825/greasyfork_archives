// ==UserScript==
// @name         TimeHookerLite
// @namespace    https://cozian.com
// @version      1.0
// @description  Sets playback speed to 20x on selected websites
// @author       Cozian
// @include      *
// @license      MIT
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/556361/TimeHookerLite.user.js
// @updateURL https://update.greasyfork.org/scripts/556361/TimeHookerLite.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const playbackSpeed = 20; // Default 20x speed
 
    let includeList = GM_getValue("includeList", []);
 
    function addToIncludeList() {
        const currentSite = window.location.hostname;
        if (!includeList.includes(currentSite)) {
            includeList.push(currentSite);
            GM_setValue("includeList", includeList);
            alert(`Added ${currentSite} to include list.`);
        } else {
            alert(`${currentSite} is already in the include list.`);
        }
    }
 
    GM_registerMenuCommand("Add this site to TimeHookerLite Include List", addToIncludeList);
 
    if (!includeList.includes(window.location.hostname)) {
        return;
    }
 
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        return originalSetInterval(callback, delay / playbackSpeed, ...args);
    };
 
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
        return originalSetTimeout(callback, delay / playbackSpeed, ...args);
    };
 
    const originalDateNow = Date.now;
    Date.now = function() {
        return originalDateNow() * playbackSpeed;
    };
 
    const originalPerformanceNow = performance.now.bind(performance);
    performance.now = function() {
        return originalPerformanceNow() * playbackSpeed;
    };
})();