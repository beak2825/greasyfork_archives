// ==UserScript==
// @name         GAIA prevent waypoint click flyTo behavior
// @namespace    https://github.com/bharker75
// @version      2025-10-16
// @description  Stop fly to behavior when a waypoint is clicked
// @author       bharker75
// @match        https://www.gaiagps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaiagps.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552806/GAIA%20prevent%20waypoint%20click%20flyTo%20behavior.user.js
// @updateURL https://update.greasyfork.org/scripts/552806/GAIA%20prevent%20waypoint%20click%20flyTo%20behavior.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Wait until a global object with a `flyTo` function appears.
    const poll = setInterval(() => {
        // Look through all globals for something that has a `flyTo` method.
        for (const key of Object.keys(window)) {
            const obj = window[key];
            if (obj && typeof obj === 'object' && typeof obj.flyTo === 'function') {
                clearInterval(poll);
                console.info(`[flyTo‑Blocker] Found map object: window.${key}`);

                // Replace the original flyTo with a simple stub.
                obj.flyTo = function (i, r) {
                    console.info('flyTo prevented');
                    return this; // keep method‑chainability
                };

                console.log('[flyTo‑Blocker] map.flyTo has been overridden.');
                return;
            }
        }
    }, 200); // check every 200 ms
})();