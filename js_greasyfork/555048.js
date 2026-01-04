// ==UserScript==
// @name         Disable YouTube Numbers
// @namespace    https://violentmonkey.github.io/
// @version      1.2
// @description  Disable top-row 1-9, numpad 1-9, 0, Home, and End keys on YouTube video pages
// @author       Alyssa B. Morton
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555048/Disable%20YouTube%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/555048/Disable%20YouTube%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keys to block
    const blockedKeys = [
        'Digit0','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9', // Top row
        'Numpad0','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6','Numpad7','Numpad8','Numpad9', // Numpad
        'Home','End' // Home/End keys
    ];

    // Only apply on video pages
    function isVideoPage() {
        return window.location.pathname === '/watch';
    }

    document.addEventListener('keydown', function(e) {
        if (!isVideoPage()) return; // Do nothing if not a video page

        // Only block if no modifier keys
        if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
            if (blockedKeys.includes(e.code)) {
                e.stopPropagation();
                e.preventDefault();
                // Optional: console.log('Blocked key:', e.code);
            }
        }
    }, true); // capture phase to override YouTube listeners

})();
