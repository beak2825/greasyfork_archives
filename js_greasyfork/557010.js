// ==UserScript==
// @name         MangaPark s0x Load Balancer & Fixer
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Proactively replaces broken s0x servers with s00/s01/s03/s04 (load balanced) and fixes failures.
// @author       srz
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557010/MangaPark%20s0x%20Load%20Balancer%20%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/557010/MangaPark%20s0x%20Load%20Balancer%20%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The 4 verified working servers
    const healthyServers = ['s00', 's01', 's03', 's04'];
    let splitCounter = 0; // Used to distribute load evenly

    // Regex to match ANY s0x server
    const serverRegex = /(https?:\/\/)(s\d+)(\.[a-z]+\.org)/;

    // --- 1. PROACTIVE: Replace bad servers immediately ---
    function proactiveFix() {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            // Skip if we've already processed this image (optional optimization)
            if (img.dataset.mpFixed) continue;

            const match = img.src.match(serverRegex);
            if (match) {
                const currentServer = match[2];

                // If the current server is NOT in our healthy list (e.g. s02, s05, s09)
                if (!healthyServers.includes(currentServer)) {
                    // Pick the next healthy server in line (Round-Robin / Load Split)
                    const targetServer = healthyServers[splitCounter % healthyServers.length];
                    splitCounter++;

                    const newSrc = img.src.replace(currentServer + '.', targetServer + '.');
                    
                    // Apply fix
                    img.src = newSrc;
                    img.dataset.mpFixed = "true"; // Mark as touched
                    // img.style.border = "2px solid #28a745"; // Green border = Proactive Fix
                }
            }
        }
    }

    // Run proactive fix on load and periodically (for infinite scroll/dynamic content)
    proactiveFix();
    setInterval(proactiveFix, 1000);


    // --- 2. REACTIVE: Handle actual load failures ---
    // If a "healthy" server fails, this catches it and rotates to the next one.
    window.addEventListener('error', function(e) {
        const img = e.target;
        if (img.tagName !== 'IMG') return;

        const match = img.src.match(serverRegex);
        if (match) {
            const currentServer = match[2];
            
            // Find where we are in the healthy list
            let currentIndex = healthyServers.indexOf(currentServer);
            
            // Move to the next one
            let nextIndex = (currentIndex + 1) % healthyServers.length;
            let nextServer = healthyServers[nextIndex];

            const newSrc = img.src.replace(currentServer + '.', nextServer + '.');

            if (img.src !== newSrc) {
                console.log(`[Fixer] ${currentServer} failed. Rotating to ${nextServer}`);
                img.src = newSrc;
                img.style.border = "2px solid #0088ff"; // Blue border = Reactive/Error Fix
            }
        }
    }, true);
})();