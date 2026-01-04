// ==UserScript==
// @name         mobile minecraft crosshair
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds a centered white crosshair on mobile that animates on tap + hold
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559408/mobile%20minecraft%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/559408/mobile%20minecraft%20crosshair.meta.js
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
            pointer-events: none;
            z-index: 999999999;
        }

        #mobileCrosshair::before,
        #mobileCrosshair::after {
            content: "";
            position: absolute;
            background: white;
        }

        /* Horizontal lines */
        #mobileCrosshair::before {
            width: 12px;
            height: 2px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Vertical lines */
        #mobileCrosshair::after {
            width: 2px;
            height: 12px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Click pulse */
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
