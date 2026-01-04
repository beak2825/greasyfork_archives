// ==UserScript==
// @name          Right Click Zoom with Crosshairs 
// @namespace     http://tampermonkey.net/
// @version       2.0
// @description   Instantly zooms in to the center of the page when the right mouse button is pressed and resets on release, with a small, hollow red circle crosshair appearing when zoomed.
// @author        You
// @match         *://warbrokers.io/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/548949/Right%20Click%20Zoom%20with%20Crosshairs.user.js
// @updateURL https://update.greasyfork.org/scripts/548949/Right%20Click%20Zoom%20with%20Crosshairs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the desired instant zoom level.
    const INSTANT_ZOOM_LEVEL = 5.0;

    // Find the main game canvas.
    const gameCanvas = document.querySelector('canvas');

    // Create a div for the crosshair.
    const crosshair = document.createElement('div');
    crosshair.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        margin-top: -8px; /* half the height to center it vertically */
        margin-left: -8px; /* half the width to center it horizontally */
        border: 2px solid red;
        border-radius: 50%;
        box-sizing: border-box; /* ensure border is included in width/height */
        pointer-events: none; /* allows clicks to pass through to the canvas */
        display: none; /* hide it initially */
        z-index: 9999;
    `;
    document.body.appendChild(crosshair);

    // Make sure we found the canvas before adding listeners.
    if (gameCanvas) {
        document.addEventListener('mousedown', function(event) {
            if (event.button === 2) {
                event.preventDefault();

                // Apply an instant zoom to the canvas element.
                gameCanvas.style.transform = `scale(${INSTANT_ZOOM_LEVEL})`;
                gameCanvas.style.transformOrigin = 'center center';

                // Show the crosshair.
                crosshair.style.display = 'block';
            }
        });

        document.addEventListener('mouseup', function(event) {
            if (event.button === 2) {
                // Reset the zoom when the mouse button is released.
                gameCanvas.style.transform = '';
                gameCanvas.style.transformOrigin = '';

                // Hide the crosshair.
                crosshair.style.display = 'none';
            }
        });

        // Reset zoom and remove event listeners when the script is disabled or page unloads.
        window.addEventListener('beforeunload', function() {
            gameCanvas.style.transform = '';
            gameCanvas.style.transformOrigin = '';
            // Make sure the crosshair is also removed or hidden on unload.
            document.body.removeChild(crosshair);
        });
    }
})();