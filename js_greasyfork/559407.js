// ==UserScript==
// @name         mobile crosshair overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds a centered white crosshair on mobile that animates on tap + hold
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559407/mobile%20crosshair%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/559407/mobile%20crosshair%20overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create crosshair element
    const crosshair = document.createElement("div");
    crosshair.id = "mobileCrosshair";
    document.body.appendChild(crosshair);

    // Style
    const style = document.createElement("style");
    style.textContent = `
        #mobileCrosshair {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 24px;
            height: 24px;
            transform: translate(-50%, -50%) scale(1);
            border-left: 2px solid white;
            border-right: 2px solid white;
            border-top: 2px solid white;
            border-bottom: 2px solid white;
            pointer-events: none;
            z-index: 999999999;
            transition: transform 0.08s ease-out;
        }

        #mobileCrosshair.clicked {
            transform: translate(-50%, -50%) scale(1.4);
        }
    `;
    document.head.appendChild(style);

    // Touch start = grow
    window.addEventListener("touchstart", () => {
        crosshair.classList.add("clicked");
    }, { passive: true });

    // Touch end = shrink
    window.addEventListener("touchend", () => {
        crosshair.classList.remove("clicked");
    }, { passive: true });

})();
