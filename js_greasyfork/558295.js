// ==UserScript==
// @name         YouTube Subscriptions Watch Later Button
// @namespace    https://github.com/CharlesMagnuson/YouTube-Subscriptions-Watch-Later-Button
// @version      0.5
// @description  Adds a Watch Later button to videos on the YouTube subscriptions feed
// @author       CharlesMagnuson
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558295/YouTube%20Subscriptions%20Watch%20Later%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558295/YouTube%20Subscriptions%20Watch%20Later%20Button.meta.js
// ==/UserScript==

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    YOUTUBE SUBSCRIPTIONS WATCH LATER                         ║
║                              Version 0.5                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PURPOSE:                                                                    ║
║  Adds a "Watch Later" button overlay to video thumbnails on the YouTube      ║
║  subscriptions feed (/feed/subscriptions). This replicates the functionality ║
║  that exists on channel pages but is mysteriously absent from the sub feed.  ║
║                                                                              ║
║  HOW IT WORKS:                                                               ║
║  1. Monitors for video elements appearing on the subscriptions feed          ║
║  2. Injects a Watch Later button on each thumbnail (top-left corner)         ║
║  3. Uses YouTube's internal API to add/remove videos from Watch Later        ║
║  4. Authenticates using your existing YouTube session (SAPISIDHASH)          ║
║                                                                              ║
║  BUTTON STATES:                                                              ║
║  - Clock icon (hollow): Video is NOT in Watch Later                          ║
║  - Checkmark icon (green bg): Video IS in Watch Later                        ║
║                                                                              ║
║  SECURITY NOTES:                                                             ║
║  - Only runs on youtube.com (verified by @match directive)                   ║
║  - Uses your existing authenticated session - no credentials stored          ║
║  - All API calls go to official YouTube endpoints                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

(function() {
    'use strict';

    // =========================================================================
    // SECTION 1: CONFIGURATION
    // =========================================================================

    // SVG paths for button icons
    const SVG_PATH_CLOCK = "M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z";
    const SVG_PATH_CHECKMARK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z";

    // =========================================================================
    // SECTION 2: CSS STYLES
    // =========================================================================

    function injectStyles() {
        const styleId = 'yt-wl-custom-styles';
        if (document.getElementById(styleId)) return;

        const css = `
            .yt-wl-custom-button {
                opacity: 0.75 !important;
                transition: opacity 0.15s ease, background-color 0.15s ease !important;
            }
            
            .yt-wl-custom-button:hover {
                opacity: 1 !important;
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // =========================================================================
    // SECTION 3: AUTHENTICATION
    // =========================================================================

    /**
     * Generates SAPISIDHASH for YouTube API authentication.
     * This is the same authentication method YouTube uses internally.
     */
    async function getSApiSidHash(sapisid, origin) {
        async function sha1(str) {
            const buffer = new TextEncoder().encode(str);
            const hashBuffer = await window.crypto.subtle.digest('SHA-1', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        }

        const timestamp = Date.now();
        const digest = await sha1(`${timestamp} ${sapisid} ${origin}`);
        return `${timestamp}_${digest}`;
    }

    function getSapisidCookie() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            if (cookie.startsWith('SAPISID=')) {
                return cookie.substring(8);
            }
        }
        return null;
    }

    // =========================================================================
    // SECTION 4: YOUTUBE API
    // =========================================================================

    /**
     * Checks if a video is currently in the Watch Later playlist.
     */
    async function isVideoInWatchLater(videoId) {
        const sapisid = getSapisidCookie();
        if (!sapisid) return false;

        try {
            const sapisidhash = await getSApiSidHash(sapisid, window.origin);
            const response = await fetch(
                'https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `SAPISIDHASH ${sapisidhash}`
                    },
                    body: JSON.stringify({
                        context: {
                            client: {
                                clientName: 'WEB',
                                clientVersion: window.ytcfg?.data_?.INNERTUBE_CLIENT_VERSION || '2.20231219.04.00'
                            }
                        },
                        excludeWatchLater: false,
                        videoIds: [videoId]
                    })
                }
            );

            if (!response.ok) return false;

            const json = await response.json();
            const playlists = json?.contents?.[0]?.addToPlaylistRenderer?.playlists;
            if (playlists) {
                const watchLater = playlists.find(p => p.playlistAddToOptionRenderer?.playlistId === 'WL');
                if (watchLater) {
                    return watchLater.playlistAddToOptionRenderer.containsSelectedVideos === 'ALL';
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Adds or removes a video from Watch Later.
     */
    async function toggleWatchLater(videoId, isCurrentlyInWatchLater) {
        const sapisid = getSapisidCookie();
        if (!sapisid) return false;

        try {
            const sapisidhash = await getSApiSidHash(sapisid, window.origin);
            const actionObj = isCurrentlyInWatchLater
                ? { removedVideoId: videoId, action: 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID' }
                : { addedVideoId: videoId, action: 'ACTION_ADD_VIDEO' };

            const response = await fetch(
                'https://www.youtube.com/youtubei/v1/browse/edit_playlist',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `SAPISIDHASH ${sapisidhash}`
                    },
                    body: JSON.stringify({
                        context: {
                            client: {
                                clientName: 'WEB',
                                clientVersion: window.ytcfg?.data_?.INNERTUBE_CLIENT_VERSION || '2.20231219.04.00'
                            }
                        },
                        actions: [actionObj],
                        playlistId: 'WL'
                    })
                }
            );

            return response.ok;
        } catch {
            return false;
        }
    }

    // =========================================================================
    // SECTION 5: VIDEO ID EXTRACTION
    // =========================================================================

    function extractVideoId(videoElement) {
        const videoLink = videoElement.querySelector('a[href*="/watch?v="]');
        if (videoLink) {
            const href = videoLink.getAttribute('href');
            const match = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
            if (match) return match[1];
        }
        return null;
    }

    // =========================================================================
    // SECTION 6: BUTTON CREATION
    // =========================================================================

    function createWatchLaterButton(videoId) {
        const container = document.createElement('div');
        container.className = 'yt-wl-custom-button';
        container.setAttribute('data-video-id', videoId);
        container.setAttribute('data-in-watch-later', 'unknown');

        container.style.cssText = `
            position: absolute;
            top: 8px;
            left: 8px;
            width: 36px;
            height: 36px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            pointer-events: auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        `;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '22');
        svg.setAttribute('height', '22');
        svg.style.fill = 'white';
        svg.style.pointerEvents = 'none';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', SVG_PATH_CLOCK);
        svg.appendChild(path);
        container.appendChild(svg);

        container.title = 'Add to Watch Later';

        // Prevent mousedown from triggering thumbnail highlight
        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, true);

        // Click handler with optimistic UI update
        container.addEventListener('click', async (e) => {
            // Stop ALL event propagation to prevent thumbnail highlight
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const wasInWL = container.getAttribute('data-in-watch-later') === 'true';
            const newState = !wasInWL;

            // OPTIMISTIC UPDATE: Change button immediately before API call
            container.setAttribute('data-in-watch-later', newState.toString());
            path.setAttribute('d', newState ? SVG_PATH_CHECKMARK : SVG_PATH_CLOCK);
            container.title = newState ? 'In Watch Later (click to remove)' : 'Add to Watch Later';
            container.style.backgroundColor = newState ? 'rgba(0, 100, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)';

            // Make API call in background
            const success = await toggleWatchLater(videoId, wasInWL);

            // Only revert if the API call failed
            if (!success) {
                container.setAttribute('data-in-watch-later', wasInWL.toString());
                path.setAttribute('d', wasInWL ? SVG_PATH_CHECKMARK : SVG_PATH_CLOCK);
                container.title = wasInWL ? 'In Watch Later (click to remove)' : 'Add to Watch Later';
                container.style.backgroundColor = wasInWL ? 'rgba(0, 100, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)';
                
                // Flash red to indicate error
                container.style.backgroundColor = 'rgba(180, 0, 0, 0.8)';
                setTimeout(() => {
                    container.style.backgroundColor = wasInWL ? 'rgba(0, 100, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)';
                }, 1500);
            }
        }, true);  // Use capture phase to intercept event early

        // Check initial Watch Later status
        setTimeout(async () => {
            const isInWL = await isVideoInWatchLater(videoId);
            container.setAttribute('data-in-watch-later', isInWL.toString());
            path.setAttribute('d', isInWL ? SVG_PATH_CHECKMARK : SVG_PATH_CLOCK);
            container.title = isInWL ? 'In Watch Later (click to remove)' : 'Add to Watch Later';
            if (isInWL) {
                container.style.backgroundColor = 'rgba(0, 100, 0, 0.8)';
            }
        }, 100);

        return container;
    }

    // =========================================================================
    // SECTION 7: VIDEO PROCESSING
    // =========================================================================

    const processedElements = new Set();

    function processVideoElement(videoElement) {
        if (videoElement.hasAttribute('data-yt-wl-processed')) return;

        const videoId = extractVideoId(videoElement);
        if (!videoId) return;

        // Find thumbnail container
        let container = videoElement.querySelector('.yt-lockup-view-model__content-image');
        if (!container) container = videoElement.querySelector('#thumbnail');
        if (!container) container = videoElement.querySelector('ytd-thumbnail');
        if (!container) container = videoElement.querySelector('a[href*="/watch"]');
        if (!container) return;

        videoElement.setAttribute('data-yt-wl-processed', 'true');
        processedElements.add(videoElement);

        // Ensure container has relative positioning
        const style = window.getComputedStyle(container);
        if (style.position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(createWatchLaterButton(videoId));
    }

    function scanForVideos() {
        if (window.location.pathname !== '/feed/subscriptions') return;

        document.querySelectorAll('ytd-rich-item-renderer').forEach(element => {
            processVideoElement(element);
        });
    }

    // =========================================================================
    // SECTION 8: PAGE OBSERVATION
    // =========================================================================

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            if (window.location.pathname !== '/feed/subscriptions') return;

            let shouldScan = false;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'YTD-RICH-ITEM-RENDERER' ||
                            node.querySelector?.('ytd-rich-item-renderer')) {
                            shouldScan = true;
                            break;
                        }
                    }
                }
                if (shouldScan) break;
            }

            if (shouldScan) {
                clearTimeout(window._ytWLScanTimeout);
                window._ytWLScanTimeout = setTimeout(scanForVideos, 200);
            }
        });

        observer.observe(document.querySelector('ytd-app') || document.body, {
            childList: true,
            subtree: true
        });
    }

    function setupNavigationListener() {
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleNavigation();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleNavigation();
        };

        window.addEventListener('popstate', handleNavigation);

        function handleNavigation() {
            processedElements.clear();
            setTimeout(scanForVideos, 500);
        }
    }

    // =========================================================================
    // SECTION 9: INITIALIZATION
    // =========================================================================

    function init() {
        injectStyles();
        setupObserver();
        setupNavigationListener();
        scanForVideos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
