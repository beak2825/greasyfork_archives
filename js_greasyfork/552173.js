// ==UserScript==
// @name         Nitro Type Focus Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle focus mode on Nitro Type with "=" key to hide distractions and improve focus.
// @author       King's Group
// @match        https://www.nitrotype.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552173/Nitro%20Type%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552173/Nitro%20Type%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let focusMode = false;
    const dimOverlay = document.createElement("div");
    dimOverlay.style.position = "fixed";
    dimOverlay.style.top = "0";
    dimOverlay.style.left = "0";
    dimOverlay.style.width = "100%";
    dimOverlay.style.height = "100%";
    dimOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    dimOverlay.style.zIndex = "999";
    dimOverlay.style.pointerEvents = "none";
    dimOverlay.style.transition = "opacity 0.4s ease";
    dimOverlay.style.opacity = "0";
    document.body.appendChild(dimOverlay);

    function toggleFocusMode() {
        focusMode = !focusMode;
        const elementsToHide = [
            "#header", 
            ".race-results", 
            ".race-chat", 
            ".race-track .opponents", 
            ".garage-banner", 
            ".adsbygoogle",
            "#footer",
            ".race-rankings",
            ".social-container",
            ".friends-list"
        ];

        elementsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.transition = "opacity 0.4s ease";
                el.style.opacity = focusMode ? "0" : "1";
                el.style.pointerEvents = focusMode ? "none" : "auto";
            });
        });

        dimOverlay.style.opacity = focusMode ? "1" : "0";
        console.log(`🎯 Focus Mode: ${focusMode ? "ON" : "OFF"}`);
    }

    // Listen for "=" key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "=") {
            toggleFocusMode();
        }
    });

})();
