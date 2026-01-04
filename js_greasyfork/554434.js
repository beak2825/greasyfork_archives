// ==UserScript==
// @name         Remove WalkMe from Concur
// @namespace    https://github.com/ajlanghorn
// @version      1.0
// @description  Removes WalkMe integration from Concur
// @author       ajlanghorn
// @match        https://*.concursolutions.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554434/Remove%20WalkMe%20from%20Concur.user.js
// @updateURL https://update.greasyfork.org/scripts/554434/Remove%20WalkMe%20from%20Concur.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to remove WalkMe
    function removeWalkMe() {
        if (window._walkMe && typeof window._walkMe.removeWalkMe === 'function') {
            window._walkMe.removeWalkMe();
            console.log('WalkMe removed from Concur');
        }
    }
    
    // Try to remove WalkMe immediately
    removeWalkMe();
    
    // Also try after page load in case WalkMe loads later
    window.addEventListener('load', removeWalkMe);
    
    // Check periodically in case WalkMe loads asynchronously
    const checkInterval = setInterval(() => {
        if (window._walkMe) {
            removeWalkMe();
            clearInterval(checkInterval);
        }
    }, 1000);
    
    // Stop checking after 30 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 30000);
})();