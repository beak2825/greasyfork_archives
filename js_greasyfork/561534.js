// ==UserScript==
// @name        theCrag - swipearea (Native Fix)
// @namespace   theCrag.com
// @author      killakalle based on original script from NickyHochmuth 
// @description adds swipe left and right using native touch events to avoid menu conflicts
// @icon        https://www.google.com/s2/favicons?domain=thecrag.com
// @include     https://www.thecrag.com/*
// @version     1.2
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561534/theCrag%20-%20swipearea%20%28Native%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561534/theCrag%20-%20swipearea%20%28Native%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    // Minimum distance required to be considered a swipe (in pixels)
    const threshold = 80; 

    function handleGesture() {
        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;

        // Ensure the horizontal movement is significantly greater than vertical (prevents accidental swipes while scrolling)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX < 0) {
                // Swipe Left -> Next
                const nextBtn = document.querySelector("a[rel='next'] span");
                if (nextBtn) nextBtn.click();
            } else {
                // Swipe Right -> Prev
                const prevBtn = document.querySelector("a[rel='prev'] span");
                if (prevBtn) prevBtn.click();
            }
        }
    }

    // Attach listeners to the main content container
    document.addEventListener('touchstart', e => {
        // Ignore if touching a map, dropdown, or link to let the site handle it
        if (e.target.closest('#EmbedAreaMap, .dropdown-menu, a, button, .fn-init-raise-warning')) return;
        
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, {passive: true});

    document.addEventListener('touchend', e => {
        // Ignore if the touch ended on a UI element
        if (e.target.closest('#EmbedAreaMap, .dropdown-menu, a, button, .fn-init-raise-warning')) return;

        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        handleGesture();
    }, {passive: true});

})();