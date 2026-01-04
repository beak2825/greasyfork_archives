// ==UserScript==
// @name         YouTube Original Audio Priority
// @namespace    tom.heek
// @version      1.0
// @description  Uses a robust, event-driven model to reliably select the "Original" audio track over dubbed versions.
// @author       Tom Heek
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/552835/YouTube%20Original%20Audio%20Priority.user.js
// @updateURL https://update.greasyfork.org/scripts/552835/YouTube%20Original%20Audio%20Priority.meta.js
// ==/UserScript==

/*
    This work is licensed under the
    Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
    To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/
    or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

    You are free to use and share this script in its original, unmodified form
    for non-commercial purposes only, provided you give attribution to the original author.
    You may not distribute any modified versions of this script.
*/

"use strict";

let mainObserver = null;
let hasAttemptedSwitch = false;

/**
 * Initializes an observer to find the YouTube player and attach event listeners.
 * This runs on initial load and on each subsequent navigation.
 */
function init() {
    // On SPA navigation, disconnect the old observer to prevent duplicates.
    if (mainObserver) {
        mainObserver.disconnect();
    }
    hasAttemptedSwitch = false;

    mainObserver = new MutationObserver((mutations, obs) => {
        const player = document.getElementById("movie_player");

        if (player && typeof player.addEventListener === 'function' && !player.audioListenerAttached) {
            obs.disconnect();

            // Hook into the player's state changes to know when a video is playing.
            player.addEventListener("onStateChange", handlePlayerStateChange);
            player.audioListenerAttached = true; // Flag to prevent attaching multiple listeners.

            // Handle case where the script loads after the video has already started.
            if (player.getPlayerState && player.getPlayerState() === 1) {
                handlePlayerStateChange(1);
            }
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * Callback for the player's 'onStateChange' event.
 * @param {number} state - The new player state (1 means 'Playing').
 */
function handlePlayerStateChange(state) {
    // Run once when the video starts playing.
    if (state === 1 && !hasAttemptedSwitch) {
        hasAttemptedSwitch = true;
        const player = document.getElementById("movie_player");
        if (player) {
            // A minimal delay ensures metadata is stable before access.
            setTimeout(() => forceOriginalAudioTrack(player), 100);
        }
    }
}

/**
 * Checks available audio tracks and switches to the original.
 * @param {object} player - The YouTube player instance.
 */
function forceOriginalAudioTrack(player) {
    try {
        if (typeof player.getAvailableAudioTracks !== 'function') return;

        const availableTracks = player.getAvailableAudioTracks();
        const currentTrack = player.getAudioTrack();

        if (!availableTracks || availableTracks.length <= 1) {
            return;
        }

        let targetTrack = null;

        // Primary Method: Find the track officially marked as original.
        targetTrack = availableTracks.find(track => track.isOriginalTrack === true);

        // Fallback Method: If no official track is found, search by name.
        if (!targetTrack) {
            targetTrack = availableTracks.find(track =>
                track.displayName?.toLowerCase().includes("original")
            );
        }

        // Switch to the target track if it was found and is not already active.
        if (targetTrack && (!currentTrack || currentTrack.id !== targetTrack.id)) {
            player.setAudioTrack(targetTrack);
            console.log(`%c[YouTube Original Audio Priority] Switched to track: '${targetTrack.displayName}'`, 'color: #1E90FF; font-weight: bold;');
        }
    } catch (error) {
        console.error("[YouTube Original Audio Priority] Error during track switch:", error);
    }
}

// --- Script Execution ---

// YouTube is a Single Page Application, so we must re-initialize on navigation.
window.addEventListener("yt-navigate-finish", init);

// Initial run for the first page load.
init();