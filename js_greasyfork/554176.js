// ==UserScript==
// @name         soundcloud disable autoplay station (silent)
// @version      2.0.0
// @description  Silently disables Soundcloud Autoplay Station without UI changes
// @author       bhackel (improved)
// @match        https://soundcloud.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @noframes
// @namespace    https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/554176/soundcloud%20disable%20autoplay%20station%20%28silent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554176/soundcloud%20disable%20autoplay%20station%20%28silent%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// Check and disable autoplay without opening the queue UI
function silentDisable() {
    const toggle = document.querySelector('.queueFallback__toggle .sc-toggle');
    
    if (toggle && toggle.classList.contains('sc-toggle-on')) {
        // Create and dispatch a click event programmatically without UI interaction
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        toggle.dispatchEvent(event);
    }
}

// Use MutationObserver to watch for DOM changes and catch autoplay re-enabling
const observer = new MutationObserver(() => {
    silentDisable();
});

// Wait for the queue element to exist in DOM (without opening it)
function waitForQueue() {
    const queueContainer = document.querySelector('.playControls__queue');
    
    if (queueContainer) {
        // Start observing for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Initial disable attempt
        silentDisable();
        
        // Periodic check as backup (every 3 seconds)
        setInterval(silentDisable, 3000);
    } else {
        // Queue not loaded yet, check again
        setTimeout(waitForQueue, 500);
    }
}

// Alternative approach: Intercept at a lower level if the toggle isn't in DOM
function forceDisableCheck() {
    // This runs regardless of whether queue is visible
    const toggle = document.querySelector('.queueFallback__toggle .sc-toggle');
    if (toggle && toggle.classList.contains('sc-toggle-on')) {
        toggle.click();
    }
}

// Start the script
waitForQueue();

// Backup periodic check (every 5 seconds)
setInterval(forceDisableCheck, 5000);

})();