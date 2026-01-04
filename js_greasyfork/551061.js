// ==UserScript==
// @name         YouTube Enhancer
// @namespace    Violentmonkey Scripts
// @version      1.01
// @description  Toggle audio track (Original/Japanese/English) + Button to hide/show YouTube comments
// @author       Thnh01
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551061/YouTube%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/551061/YouTube%20Enhancer.meta.js
// ==/UserScript==

"use strict";

/* ----------------------- AUDIO TRACK SECTION ----------------------- */

// Load saved option or default to "Original"
let DESIRED_AUDIO_TRACK = localStorage.getItem("yt_desired_audio_track") || "Original";

// Register menu commands
function registerMenu() {
    const options = ["Original", "Japanese", "English"];
    options.forEach(opt => {
        const label = "Set Audio → " + opt + (opt === DESIRED_AUDIO_TRACK ? " ✔" : "");
        GM_registerMenuCommand(label, () => setAudioChoice(opt));
    });
}

function setAudioChoice(choice) {
    DESIRED_AUDIO_TRACK = choice;
    localStorage.setItem("yt_desired_audio_track", choice);
    registerMenu(); // update menu with new check
    mainAudio();
}

// Init menu
registerMenu();

// Listen for navigation
window.addEventListener("yt-navigate-finish", mainAudio, true);

const observer = new MutationObserver(
    (mutations, shortsReady = false, videoPlayerReady = false) => {
        outer: for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!shortsReady) shortsReady = node.tagName === "YTD-SHORTS";
                if (!videoPlayerReady) videoPlayerReady = typeof node.className === "string" && node.className.includes("html5-main-video");

                if (shortsReady || videoPlayerReady) {
                    observer.disconnect();
                    mainAudio();
                    break outer;
                }
            }
        }
    }
);
observer.observe(document.documentElement, { childList: true, subtree: true });

async function mainAudio() {
    let player = getPlayer();
    while (!player) {
        player = getPlayer();
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    forceAudioTrack(player);
}

function getPlayer() {
    if (window.location.href.includes("youtube.com/shorts")) {
        return document.querySelector("#shorts-player");
    } else {
        return document.querySelector("#movie_player");
    }
}

function forceAudioTrack(player) {
    try {
        const availableAudioTracks = player.getAvailableAudioTracks?.();
        const currentAudioTrack = player.getAudioTrack?.();
        if (!availableAudioTracks || availableAudioTracks.length === 0 || !currentAudioTrack) return;

        let key;
        for (let object in currentAudioTrack) {
            if (currentAudioTrack[object]?.name) {
                key = object;
                break;
            }
        }
        if (!key) return;

        if (!currentAudioTrack[key].name.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase())) {
            for (const track of availableAudioTracks) {
                if (track[key]?.name?.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase())) {
                    player.setAudioTrack(track);
                    break;
                }
            }
        }
    } catch (error) {
        console.error("Error setting Audio Track:", error.message);
    }
}

/* ----------------------- COMMENT TOGGLE SECTION ----------------------- */

(function() {

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body.yt-comments-hidden #comments {
                display: none;
            }

            .yt-toggle-comments-button {
                background-color: #d9d9d9;
                color: var(--yt-spec-brand-button-text);
                border: none;
                border-radius: 18px;
                padding: 9px 16px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 12px;
                margin-bottom: 16px;
            }

            html[dark="true"] .yt-toggle-comments-button {
                 background-color: var(--yt-spec-button-chip-background-hover);
                 color: var(--yt-spec-text-primary);
            }
        `;
        document.head.appendChild(style);
    }

    function setupCommentToggleButton() {
        const commentsSection = document.querySelector("#comments");
        if (!commentsSection || document.querySelector('.yt-toggle-comments-button')) {
            return;
        }

        const toggleButton = document.createElement('button');
        toggleButton.className = 'yt-toggle-comments-button';

        document.body.classList.add('yt-comments-hidden');
        toggleButton.textContent = 'Show Comments';

        toggleButton.addEventListener('click', () => {
            const isHidden = document.body.classList.toggle('yt-comments-hidden');
            toggleButton.textContent = isHidden ? 'Show Comments' : 'Hide Comments';
        });

        commentsSection.parentNode.insertBefore(toggleButton, commentsSection);
    }

    function observeForComments() {
        const observer = new MutationObserver((mutationsList, obs) => {
            if (document.querySelector("#comments")) {
                setupCommentToggleButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    injectStyles();

    window.addEventListener('yt-navigate-finish', observeForComments);

    observeForComments();

})();
