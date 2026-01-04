// ==UserScript==
// @name         ChatReplay.stream YouTube Progress Saver (v11.0 - The Listener)
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  The definitive version. Passively listens for the YouTube iframe's postMessage events to save and restore progress, bypassing the site's custom controller.
// @author       Your Name
// @match        https://chatreplay.stream/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553611/ChatReplaystream%20YouTube%20Progress%20Saver%20%28v110%20-%20The%20Listener%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553611/ChatReplaystream%20YouTube%20Progress%20Saver%20%28v110%20-%20The%20Listener%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Progress Saver] v11.0 Loaded. The Passive Listener.');

    const storageKey = 'youtube-progress-' + window.location.pathname;
    let ytIframeWindow = null;
    let hasSeeked = false; // A flag to ensure we only seek once on load

    // This function will be our message handler
    function messageHandler(event) {
        // We must verify the message is coming from the YouTube iframe
        if (event.source !== ytIframeWindow) {
            return;
        }

        try {
            const data = JSON.parse(event.data);

            // The 'onReady' event is the perfect time to seek to our saved position
            if (data.event === 'onReady' && !hasSeeked) {
                console.log('[Progress Saver] Received "onReady" event from iframe.');
                const savedTime = localStorage.getItem(storageKey);
                if (savedTime) {
                    hasSeeked = true; // Set the flag so we don't seek again
                    const time = parseFloat(savedTime);
                    console.log(`[Progress Saver] Found saved time: ${time}s. Sending "seekTo" command.`);
                    // We send a command back to the iframe in the format it expects
                    ytIframeWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'seekTo',
                        args: [time, true]
                    }), '*');
                }
            }

            // The 'infoDelivery' event fires repeatedly and contains all player state
            if (data.event === 'infoDelivery' && data.info) {
                const playerState = data.info.playerState;
                const currentTime = data.info.currentTime;

                // 1 means the video is playing
                if (playerState === 1) {
                    localStorage.setItem(storageKey, currentTime);
                }
            }
        } catch (e) {
            // Not a JSON message, ignore.
        }
    }

    // We need to find the iframe and get a reference to its contentWindow
    const findIframeInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="youtube.com/embed"]');
        if (iframe && iframe.contentWindow) {
            clearInterval(findIframeInterval);
            console.log('[Progress Saver] Found the YouTube iframe. Attaching message listener.');
            ytIframeWindow = iframe.contentWindow;

            // Start listening for messages from any source (we will filter them in the handler)
            window.addEventListener('message', messageHandler);
        }
    }, 250); // Check for the iframe every 250ms

})();