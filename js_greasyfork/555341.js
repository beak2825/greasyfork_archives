// ==UserScript==
// @name         GeoPixels - Auto-click Last Location Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically clicks the lastLocationButton when page loads
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geopixels.net
// @downloadURL https://update.greasyfork.org/scripts/555341/GeoPixels%20-%20Auto-click%20Last%20Location%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/555341/GeoPixels%20-%20Auto-click%20Last%20Location%20Button.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Debug toggle - set to false to disable debug logging
    const debug_enabled = false;

    // Debug logging function
    function debug(str) {
        if (debug_enabled) {
            console.log(str);
        }
    }

    debug('[AutoClick] Script started');

    // Spawn area coordinates
    const SPAWN_LNG_MIN = -75;
    const SPAWN_LNG_MAX = -73;
    const SPAWN_LAT_MIN = 39;
    const SPAWN_LAT_MAX = 41;

    // Flag to ensure we only click once
    let hasClicked = false;
    let observer = null;

    // Function to check if button exists and goToLocation is ready
    function checkAndClick() {
        if (hasClicked) {
            debug('[AutoClick] Already clicked, skipping');
            return;
        }

        debug('[AutoClick] Checking conditions...');

        const button = document.getElementById('lastLocationButton');
        debug('[AutoClick] Button found: ' + !!button);
        debug('[AutoClick] goToLocation function exists: ' + (typeof window.goToLocation === 'function'));

        // Try to find the map object - it might be a global variable not on window
        let mapObj = null;
        try {
            // Try accessing it via eval since it might be in a different scope
            mapObj = eval('map');
            debug('[AutoClick] map object found via eval: ' + !!mapObj);
            debug('[AutoClick] map.getCenter exists: ' + (mapObj && typeof mapObj.getCenter === 'function'));
        } catch (e) {
            debug('[AutoClick] Could not access map via eval: ' + e.message);
        }

        // Check if button exists, goToLocation function is defined, AND map is available
        if (button && typeof window.goToLocation === 'function' && mapObj && typeof mapObj.getCenter === 'function') {
            debug('[AutoClick] All conditions met, checking coordinates...');
            try {
                const center = mapObj.getCenter();
                const lng = center.lng;
                const lat = center.lat;

                debug(`[AutoClick] Map center: lng=${lng}, lat=${lat}`);

                // Check if we're in the spawn area
                if (lng >= SPAWN_LNG_MIN && lng <= SPAWN_LNG_MAX && lat >= SPAWN_LAT_MIN && lat <= SPAWN_LAT_MAX) {
                    hasClicked = true;
                    if (observer) observer.disconnect(); // Stop observing once found

                    debug('[AutoClick] In spawn area, clicking button...');
                    button.click();
                    debug('[AutoClick] lastLocationButton clicked! (was at spawn location)');
                } else {
                    debug(`[AutoClick] Not in spawn area (need lng: ${SPAWN_LNG_MIN} to ${SPAWN_LNG_MAX}, lat: ${SPAWN_LAT_MIN} to ${SPAWN_LAT_MAX}), skipping click`);
                }
            } catch (e) {
                debug('[AutoClick] Error checking map center: ' + e);
            }
        } else {
            debug('[AutoClick] Not all conditions met yet');
        }
    }

    // Try to click immediately in case button is already in DOM
    debug('[AutoClick] Initial check...');
    checkAndClick();

    // If button wasn't found, set up a MutationObserver to watch for it
    if (!hasClicked) {
        debug('[AutoClick] Setting up MutationObserver...');
        observer = new MutationObserver(() => {
            debug('[AutoClick] DOM mutation detected, checking again...');
            checkAndClick();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Fallback: disconnect observer after 10 seconds to avoid memory leaks
        setTimeout(() => {
            if (!hasClicked && observer) {
                observer.disconnect();
                debug('[AutoClick] Button not found within timeout period');
            }
        }, 10000);
    }
})();