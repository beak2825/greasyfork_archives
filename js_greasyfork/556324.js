// ==UserScript==
// @name         FPS Display Overlay
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Shows a real-time FPS counter in the corner of any site
// @author       Skibidi555
// @match        *://*/*
// @grant        none
// @license      No Copying
// @downloadURL https://update.greasyfork.org/scripts/556324/FPS%20Display%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/556324/FPS%20Display%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create FPS display box
    const fpsBox = document.createElement("div");
    fpsBox.style.position = "fixed";
    fpsBox.style.top = "20px";
    fpsBox.style.right = "20px";
    fpsBox.style.background = "#28a745";
    fpsBox.style.color = "white";
    fpsBox.style.padding = "10px 15px";
    fpsBox.style.borderRadius = "8px";
    fpsBox.style.fontFamily = "Arial, sans-serif";
    fpsBox.style.fontSize = "16px";
    fpsBox.style.zIndex = "999999";
    fpsBox.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    fpsBox.textContent = "FPS: …";
    document.body.appendChild(fpsBox);

    // FPS logic
    let lastFrame = performance.now();
    let frameCount = 0;
    let lastSecond = performance.now();

    function loop() {
        const now = performance.now();
        frameCount++;

        // Every 1 second, update FPS
        if (now - lastSecond >= 1000) {
            fpsBox.textContent = "FPS: " + frameCount;
            frameCount = 0;
            lastSecond = now;
        }

        lastFrame = now;
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

})();
