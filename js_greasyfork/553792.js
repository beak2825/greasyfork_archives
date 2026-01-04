// ==UserScript==
// @name         Hide YouTube Members Only Videos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Filter out members-only videos from YouTube
// @author       den78
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553792/Hide%20YouTube%20Members%20Only%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/553792/Hide%20YouTube%20Members%20Only%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HIDE_COMPLETELY = true; // Set to false to dim instead of hide
    const CHECK_INTERVAL = 1000; // Check for new videos every 1 second

    function hideMemebersOnlyVideos() {
        // Common selectors for video containers
        const videoSelectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-playlist-video-renderer'
        ];

        videoSelectors.forEach(selector => {
            const videos = document.querySelectorAll(selector);

            videos.forEach(video => {
                // Check for members-only badges
                const hasMembersBadge =
                    video.querySelector('[aria-label*="Members only"]') ||
                    video.querySelector('ytd-badge-supported-renderer .badge-style-type-members-only') ||
                    video.querySelector('.badge-style-type-members-only') ||
                    video.querySelector('[overlay-style="SHORTS_MEMBERS_ONLY"]') ||
                    (video.textContent && video.textContent.includes('Members only'));

                if (hasMembersBadge) {
                    if (HIDE_COMPLETELY) {
                        // Completely hide the video
                        video.style.display = 'none';
                    } else {
                        // Dim the video instead of hiding
                        video.style.opacity = '0.3';
                        video.style.pointerEvents = 'none';
                    }

                    // Add a data attribute to mark as processed
                    video.setAttribute('data-members-only-hidden', 'true');
                }
            });
        });

        // Also hide in search results and recommendations
        const thumbnailOverlays = document.querySelectorAll('ytd-thumbnail-overlay-bottom-panel-renderer');
        thumbnailOverlays.forEach(overlay => {
            if (overlay.textContent && overlay.textContent.includes('Members only')) {
                const parentVideo = overlay.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                if (parentVideo) {
                    if (HIDE_COMPLETELY) {
                        parentVideo.style.display = 'none';
                    } else {
                        parentVideo.style.opacity = '0.3';
                        parentVideo.style.pointerEvents = 'none';
                    }
                }
            }
        });
    }

    // Initial run
    setTimeout(hideMemebersOnlyVideos, 1000);

    // Set up observer for dynamically loaded content
    const observer = new MutationObserver(() => {
        hideMemebersOnlyVideos();
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run periodically to catch any missed videos
    setInterval(hideMemebersOnlyVideos, CHECK_INTERVAL);

    // Add custom CSS for better handling
    const style = document.createElement('style');
    style.textContent = `
        [data-members-only-hidden="true"] {
            ${HIDE_COMPLETELY ? 'display: none !important;' : 'opacity: 0.3 !important; pointer-events: none !important;'}
        }
    `;
    document.head.appendChild(style);

})();