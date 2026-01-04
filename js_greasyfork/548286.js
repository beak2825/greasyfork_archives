// ==UserScript==
// @name        Facebook Reels Unmuter with Pause
// @namespace   UserScript
// @match       https://www.facebook.com/reel/*
// @version     2.7
// @license     MIT
// @author      Jason8
// @description Unmutes the current Facebook Reel video and pauses it when the tab is backgrounded.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/548286/Facebook%20Reels%20Unmuter%20with%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/548286/Facebook%20Reels%20Unmuter%20with%20Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasUnmuted = false;

    // Function to find the unmute button and click it
    function clickUnmuteButton() {
        if (hasUnmuted) return;

        const unmuteButton = document.querySelector('[aria-label="Unmute"]');

        if (unmuteButton) {
            unmuteButton.click();
            hasUnmuted = true;
            console.log('Unmute button clicked. Script finished.');
        }
    }

    // Initialize the script
    function init() {
        try {
            console.log('Facebook Reels Unmuter initialized');

            const intervalID = setInterval(() => {
                if (hasUnmuted) {
                    clearInterval(intervalID);
                    return;
                }
                clickUnmuteButton();
            }, 250);

            // Add a safety timeout to stop the interval after 10 seconds
            setTimeout(() => {
                if (!hasUnmuted) {
                    clearInterval(intervalID);
                    console.log('Unmute failed after 10 seconds. Timeout reached.');
                }
            }, 10000);

            // Add a visibility change listener to handle pausing
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    document.querySelectorAll('video').forEach(video => video.pause());
                } else {
                    // Removed autoplay code when focus returns to Reels tab
                }
            }, true);

            // Clean up on page unload
            window.addEventListener('beforeunload', () => {
                document.removeEventListener('visibilitychange', () => {}, true);
            });
        } catch (e) {
            console.error('Error initializing Facebook Reels Unmuter with Pause:', e);
        }
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();