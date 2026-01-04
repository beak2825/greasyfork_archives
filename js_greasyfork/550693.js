// ==UserScript==
// @name         Universal Video Speed Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adjusts video playback speed with keyboard shortcuts and shows a temporary UI.
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550693/Universal%20Video%20Speed%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/550693/Universal%20Video%20Speed%20Adjuster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set to true to enable debug logs in the console.
    const DEBUG_MODE = true;
    let originalPlaybackRate = null;
    let isSpeedBoostActive = false;

    // Function to create and display the playback rate UI
    function displayPlaybackRate(rate) {
        // Find if a display element already exists
        let displayElement = document.getElementById("playback-rate-display");
        if (!displayElement) {
            // If not, create a new one
            displayElement = document.createElement("div");
            displayElement.id = "playback-rate-display";

            // Apply styles to the display element
            Object.assign(displayElement.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 'bold',
                zIndex: '99999',
                opacity: '0',
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none'
            });
            document.body.appendChild(displayElement);
        }

        // Set the new text content and make it visible
        displayElement.textContent = `Speed: ${rate.toFixed(2)}x`;
        displayElement.style.opacity = '1';

        // Clear any existing fade-out timer
        clearTimeout(window.playbackRateTimeout);

        // Set a new timer to fade the UI out after 2 seconds
        window.playbackRateTimeout = setTimeout(() => {
            displayElement.style.opacity = '0';
            setTimeout(() => {
                if (displayElement.parentElement) {
                    displayElement.parentElement.removeChild(displayElement);
                }
            }, 500); // Wait for the transition to finish
        }, 2000);
    }

    // Function to find the video element and adjust its speed
    function adjustVideoSpeed(adjustment, newRate = null) {
        let videoFound = false;

        // 1. Check the main document for a video element
        const mainVideo = document.getElementsByTagName("video")[0];
        if (mainVideo) {
            if (newRate !== null) {
                mainVideo.playbackRate = newRate;
            } else {
                mainVideo.playbackRate = Math.max(0.25, mainVideo.playbackRate + adjustment);
            }
            displayPlaybackRate(mainVideo.playbackRate);
            videoFound = true;
            if (DEBUG_MODE) {
                console.log("Video found in the main document. Speed adjusted.");
            }
        }

        // 2. Check all iframes on the page
        const iframes = document.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
            try {
                // Try to access the iframe's contentWindow and document
                const iframeDocument = iframes[i].contentWindow.document;
                const iframeVideo = iframeDocument.getElementsByTagName("video")[0];
                if (iframeVideo) {
                    if (newRate !== null) {
                        iframeVideo.playbackRate = newRate;
                    } else {
                        iframeVideo.playbackRate = Math.max(0.25, iframeVideo.playbackRate + adjustment);
                    }
                    displayPlaybackRate(iframeVideo.playbackRate);
                    videoFound = true;
                    if (DEBUG_MODE) {
                        console.log("Video found inside an iframe. Speed adjusted.");
                    }
                }
            } catch (e) {
                // This catch block handles the Same-Origin Policy error
                // when we can't access the iframe's content.
                if (DEBUG_MODE) {
                    console.log(`Blocked from accessing iframe due to Same-Origin Policy: ${e.message}`);
                }
            }
        }

        if (!videoFound) {
            if (DEBUG_MODE) {
                console.warn("No video element found to adjust.");
            }
        }
    }

    // Attach a keyboard event listener to the entire document
    document.addEventListener('keydown', function(event) {
        if (DEBUG_MODE) {
            console.log(`Keydown event detected: key=${event.key}, code=${event.code}, altKey=${event.altKey}, ctrlKey=${event.ctrlKey}, shiftKey=${event.shiftKey}`);
        }

        // Check for Option + . (increase speed)
        if (event.altKey && event.code === 'Period') {
            event.preventDefault(); // Prevents default browser actions
            adjustVideoSpeed(0.5);
        }
        // Check for Option + , (decrease speed)
        else if (event.altKey && event.code === 'Comma') {
            event.preventDefault(); // Prevents default browser actions
            adjustVideoSpeed(-0.5);
        }
        // Check for Option + / (speed boost)
        else if (event.altKey && event.code === 'Slash' && !isSpeedBoostActive) {
            event.preventDefault(); // Prevents default browser actions
            const video = document.getElementsByTagName("video")[0];
            if (video) {
                originalPlaybackRate = video.playbackRate;
                isSpeedBoostActive = true;
                adjustVideoSpeed(null, 10);
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (DEBUG_MODE) {
            console.log(`Keyup event detected: key=${event.key}, code=${event.code}`);
        }

        // Revert speed when Option or / is released
        if (isSpeedBoostActive && (event.code === 'AltLeft' || event.code === 'AltRight' || event.code === 'Slash')) {
            if (originalPlaybackRate !== null) {
                adjustVideoSpeed(null, originalPlaybackRate);
                originalPlaybackRate = null;
                isSpeedBoostActive = false;
            }
        }
    });
})();
