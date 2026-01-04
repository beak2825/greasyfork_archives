// @license      MIT
// ==UserScript==
// @name         YouTube Mobile Force Original Audio Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Aggressively forces YouTube on mobile (m.youtube.com) to select the original audio track, bypassing auto-dubbing.
// @author       Gemini/Based on user solutions
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551794/YouTube%20Mobile%20Force%20Original%20Audio%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/551794/YouTube%20Mobile%20Force%20Original%20Audio%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set to the two-letter code of your preferred original language (e.g., 'en', 'es', 'ja')
    // The script will prioritize a track named "Original" first, then this code.
    const PREFERRED_LANGUAGE_CODE = 'en';

    /**
     * Attempts to find and set the original or preferred audio track.
     * @param {Object} player - The YouTube player object.
     */
    function setOriginalAudio(player) {
        if (!player || typeof player.getAvailableAudioTracks !== 'function') {
            return;
        }

        const tracks = player.getAvailableAudioTracks();
        if (tracks.length <= 1) {
            // No other tracks available to switch to
            return;
        }

        let originalTrack = null;
        let preferredTrack = null;
        let currentTrackId = player.getAudioTrack().getLanguageInfo().id;

        for (const track of tracks) {
            const info = track.getLanguageInfo();
            const trackName = info.name || '';
            const trackId = info.id || '';

            // 1. Look for the most explicit "Original" label (case-insensitive)
            if (/\b(original)\b/i.test(trackName)) {
                originalTrack = track;
                break; // Found the best one, stop searching
            }

            // 2. Look for the track matching the preferred language code
            if (trackId.startsWith(PREFERRED_LANGUAGE_CODE)) {
                preferredTrack = track;
            }
        }

        const trackToSet = originalTrack || preferredTrack;

        if (trackToSet) {
            // Only set the track if it's different from the current one to prevent loop/flicker
            if (currentTrackId !== trackToSet.getLanguageInfo().id) {
                player.setAudioTrack(trackToSet);
                // console.log(`Audio track set to: ${trackToSet.getLanguageInfo().name}`);
            }
        }
    }

    /**
     * Periodically checks for the player and applies the audio fix.
     */
    function monitorPlayer() {
        // Selector for the main video player container on m.youtube.com
        // This is a common ID for the video container across many YouTube versions.
        const playerElement = document.getElementById('movie_player');

        if (playerElement && typeof playerElement.getPlayer === 'function') {
            const player = playerElement.getPlayer();
            setOriginalAudio(player);
        }
    }

    // Since the player can load and change states, monitor it frequently.
    // We run this check every second to catch when a new video or short is loaded.
    setInterval(monitorPlayer, 1000);

    // Also run immediately on page load in case the player is already there.
    monitorPlayer();

    // Additionally, use a MutationObserver to catch major page changes (like navigating to a new video)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Only act if nodes were added to the DOM (a new video loaded)
            if (mutation.addedNodes.length) {
                monitorPlayer();
            }
        });
    });

    // Start observing the main content container for new video loads
    const appElement = document.getElementById('app');
    if (appElement) {
        observer.observe(appElement, { childList: true, subtree: true });
    }

})();