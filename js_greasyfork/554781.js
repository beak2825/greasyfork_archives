// ==UserScript==
// @name         YouTube Music Now Playing Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights the currently playing song in the YouTube Music queue.
// @author       Hegy
// @match        https://music.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554781/YouTube%20Music%20Now%20Playing%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/554781/YouTube%20Music%20Now%20Playing%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const highlightPlayingSong = () => {
        // Find all queue items
        const allQueueItems = document.querySelectorAll('ytmusic-player-queue-item');

        // Loop through all queue items
        allQueueItems.forEach(item => {
            // Check if the item is the one currently playing
            if (item.getAttribute('play-button-state') === 'playing') {
                // Apply the highlight style
                item.style.backgroundColor = '#581d22';
            } else {
                // Remove the highlight from other items
                item.style.backgroundColor = '';
            }
        });
    };

    // Use a MutationObserver to watch for changes in the player queue.
    // This is more efficient than using a setInterval.
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'play-button-state') {
                highlightPlayingSong();
            }
        }
    });

    // Start observing the document body for attribute changes in the subtree
    observer.observe(document.body, { attributes: true, subtree: true });

    // Initial run to highlight the song on page load
    highlightPlayingSong();
})();