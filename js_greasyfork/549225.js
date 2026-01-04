// ==UserScript==
// @name         YouTube True Autoplay Blocker (Brute Force)
// @name:de      YouTube Real Autoplay Blocker
// @namespace    youtube-bruteforce-autoplay-blocker
// @version      1.0
// @description  Directly intercepts and pauses the HTML5 video element to prevent any form of autoplay.
// @description:de Fängt das HTML5-Videoelement direkt ab und pausiert es, um jede Form von Autoplay zu verhindern.
// @author       imakealol
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549225/YouTube%20True%20Autoplay%20Blocker%20%28Brute%20Force%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549225/YouTube%20True%20Autoplay%20Blocker%20%28Brute%20Force%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '%c[Brute Force Blocker v4]:';
    const LOG_STYLE_ACTION = 'color: red; font-weight: bold;';
    const LOG_STYLE_SUCCESS = 'color: lime; font-weight: bold;';
    const LOG_STYLE_INFO = 'color: cyan; font-weight: bold;';

    let hasUserInteracted = false;
    let currentVideoId = null;
    let videoElement = null;

    /**
     * Resets the interaction state when navigating to a new video.
     */
    const resetStateForNewVideo = () => {
        const newVideoId = new URLSearchParams(window.location.search).get('v');
        if (newVideoId !== currentVideoId) {
            console.log(LOG_PREFIX, LOG_STYLE_INFO, `New video detected (${newVideoId}). Interaction state reset.`);
            hasUserInteracted = false;
            currentVideoId = newVideoId;
            videoElement = null; // Forget the old video element
        }
    };

    /**
     * The core logic: attaches a 'play' event listener to the video element.
     */
    const attachToVideoElement = (video) => {
        if (video.isPatchedByBruteForce) return;
        video.isPatchedByBruteForce = true;

        console.log(LOG_PREFIX, LOG_STYLE_SUCCESS, 'Found video element. Attaching play listener.');

        video.addEventListener('play', () => {
            // Check if the user has clicked play OR if it's the very first play event of the page load.
            // YouTube often autoplays the initial video, which we might want to allow.
            // We only block subsequent autoplays (e.g., in playlists).
            if (hasUserInteracted) {
                 console.log(LOG_PREFIX, LOG_STYLE_INFO, 'User interaction detected, allowing play.');
                return; // Allow playback
            }

            // If it's not a user interaction, it's an autoplay. Block it.
            console.log(LOG_PREFIX, LOG_STYLE_ACTION, 'Automatic playback detected. Forcing pause.');
            video.pause();
        });
    };

    // --- Event Listener for User Interaction ---

    // We need to know when the user *wants* to play the video.
    // We listen for a mousedown event, as it happens before the click and play event.
    document.addEventListener('mousedown', (e) => {
        // Check if the click is inside the player or on a thumbnail link
        if (e.target.closest('#movie_player, ytd-thumbnail')) {
            console.log(LOG_PREFIX, LOG_STYLE_INFO, 'User interaction detected, playback will be allowed.');
            hasUserInteracted = true;
        }
    }, true);


    // --- Observer and Initializer ---

    // This observer finds the video element as soon as it's added to the page.
    const observer = new MutationObserver(() => {
        resetStateForNewVideo();

        // Find the main video element
        const newVideoElement = document.querySelector('.html5-main-video');
        if (newVideoElement && newVideoElement !== videoElement) {
            videoElement = newVideoElement;
            attachToVideoElement(videoElement);
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Handle YouTube's internal navigation system
    window.addEventListener('yt-navigate-finish', resetStateForNewVideo);

    console.log(LOG_PREFIX, LOG_STYLE_SUCCESS, 'Initialized and watching for video elements.');
})();