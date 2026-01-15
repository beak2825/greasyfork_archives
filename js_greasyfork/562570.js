// ==UserScript==
// @name         Kornet Robux Hider
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Spoofs currency with console logging for troubleshooting
// @author       bac
// @match        https://kornet.lat/*
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/562570/Kornet%20Robux%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/562570/Kornet%20Robux%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Kornet Debug] Script initialized on https://kornet.lat/"); //

    const settings = {
        robux: "?",
        tix: "?",
    };

    function spoof() {
        console.log("[Kornet Debug] Runing spoof cycle...");

        // 1. Search for Currency Containers
        const currencyContainers = document.querySelectorAll('p[class*="robuxText"]');
        console.log(`[Kornet Debug] Found ${currencyContainers.length} currency containers.`);

        if (currencyContainers.length >= 2) {
            // Target Robux
            const rSpan = currencyContainers[0].querySelector('span');
            if (rSpan) {
                console.log("[Kornet Debug] Robux span found. Current text:", rSpan.innerText);
                if (rSpan.innerText !== settings.robux) {
                    rSpan.innerText = settings.robux;
                    currencyContainers[0].setAttribute('title', settings.robux);
                    console.log("[Kornet Debug] Robux updated to:", settings.robux);
                }
            } else {
                console.log("[Kornet Debug] FAILED: Robux span not found inside container 0.");
            }

            // Target Tix
            const tSpan = currencyContainers[1].querySelector('span');
            if (tSpan) {
                console.log("[Kornet Debug] Tix span found. Current text:", tSpan.innerText);
                if (tSpan.innerText !== settings.tix) {
                    tSpan.innerText = settings.tix;
                    tSpan.setAttribute('title', settings.tix);
                    console.log("[Kornet Debug] Tix updated to:", settings.tix);
                }
            } else {
                console.log("[Kornet Debug] FAILED: Tix span not found inside container 1.");
            }
        } else {
            console.log("[Kornet Debug] WARNING: Not enough robuxText containers found. Site might still be loading.");
        }
    }

    // Set up MutationObserver to watch for React updates
    const observer = new MutationObserver((mutations) => {
        spoof();
    });

    const targetNode = document.body;
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
        console.log("[Kornet Debug] MutationObserver is now watching the page.");
    } else {
        console.log("[Kornet Debug] CRITICAL: Could not find document body to observe.");
    }

    // Initial run
    spoof();
})();