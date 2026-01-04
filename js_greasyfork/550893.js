// ==UserScript==
// @name         YouTube Seek 1 Second
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Press '[' to seek back 1 second, ']' to seek forward 1 second on YouTube (Uses bracket keys, common in other players). Fixed duplicate code issue.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550893/YouTube%20Seek%201%20Second.user.js
// @updateURL https://update.greasyfork.org/scripts/550893/YouTube%20Seek%201%20Second.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define seek amount in seconds
    const SEEK_AMOUNT = 1;

    // Listen for keydown events on the document
    document.addEventListener('keydown', function(event) {
        // Check if the active element is an input field (e.g., search box, comments)
        const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

        // Handle Seek Backward ('[' key)
        if (event.key === '[' && !isInputActive) {
            event.preventDefault(); // Prevent default browser action for '[' (if any)
            seekVideo(-SEEK_AMOUNT); // Seek backward
        }
        // Handle Seek Forward (']' key)
        else if (event.key === ']' && !isInputActive) {
            event.preventDefault(); // Prevent default browser action for ']' (if any)
            seekVideo(SEEK_AMOUNT); // Seek forward
        }
    });

    // Function to perform the seek operation
    function seekVideo(direction) {
        const videoPlayer = document.querySelector('video'); // This targets the first <video> element found
        if (videoPlayer && !isNaN(videoPlayer.duration)) { // Added check for valid duration
            let currentTime = videoPlayer.currentTime;
            let newTime = currentTime + (direction * SEEK_AMOUNT);

            // Ensure the new time doesn't go below 0 or exceed the video duration
            if (newTime < 0) {
                newTime = 0;
            } else if (newTime > videoPlayer.duration) {
                newTime = videoPlayer.duration;
            }

            videoPlayer.currentTime = newTime;
            console.log(`Seeked ${direction > 0 ? 'forward' : 'backward'} ${SEEK_AMOUNT} second(s). New time: ${newTime.toFixed(2)}s`);
        } else {
            console.log('YouTube video player element not found or duration invalid.');
        }
    }

})();