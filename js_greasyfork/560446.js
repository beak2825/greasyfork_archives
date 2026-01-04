// ==UserScript==
// @name         Twitch Auto-Leave Raid (v1.8 - Surgical + rAF)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Combines surgical node checking with rAF for maximum reliability.
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/560446/Twitch%20Auto-Leave%20Raid%20%28v18%20-%20Surgical%20%2B%20rAF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560446/Twitch%20Auto-Leave%20Raid%20%28v18%20-%20Surgical%20%2B%20rAF%29.meta.js
// ==/UserScript==

/*
This version returns the animation frame delay
Summary of what 1.8 gives you:

Efficiency: It still only looks at addedNodes (no full-document scanning).
Safety: By using requestAnimationFrame, it waits for the browser to be "ready" to interact with the button.
Throttling: If Twitch adds 50 elements at once, it only runs the "search and click" loop once for that frame instead of 50 separate times.
*/

(function() {
    'use strict';

    let pendingNodes = [];
    let isFrameRequested = false;

    const processPendingNodes = () => {
        const labelSelector = '[data-a-target="tw-core-button-label-text"]';

        while (pendingNodes.length > 0) {
            const node = pendingNodes.shift();
            if (node.nodeType !== Node.ELEMENT_NODE) continue;

            const label = node.matches(labelSelector) ? node : node.querySelector(labelSelector);
            if (label && label.textContent.trim() === "Leave") {
                const btn = label.closest('button');
                if (btn && !btn.disabled) {
                    btn.click();
                    console.log("!!! RAID LEAVE BUTTON CLICKED (rAF) !!!");
                    pendingNodes = []; // Clear queue since we found it
                    break;
                }
            }
        }
        isFrameRequested = false;
    };

    const raidObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Push all newly added nodes into a queue
            mutation.addedNodes.forEach(node => pendingNodes.push(node));
        }

        // Schedule a single process run for the next animation frame
        if (!isFrameRequested && pendingNodes.length > 0) {
            isFrameRequested = true;
            window.requestAnimationFrame(processPendingNodes);
        }
    });

    // WATCHDOG: Wait for the chat container
    const startWatchdog = () => {
        const watchdog = new MutationObserver((mutations, obs) => {
            const chatTarget = document.querySelector('.chat-room__content');
            if (chatTarget) {
                raidObserver.observe(chatTarget, { childList: true, subtree: true });
                obs.disconnect();
                console.log("Raid Stopper attached to chat.");
            }
        });
        watchdog.observe(document.body, { childList: true, subtree: true });
    };

    startWatchdog();
})();