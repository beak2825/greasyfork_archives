// ==UserScript==
// @name         YouTube Classic Layout Fix
// @namespace    https://yournamehere.example
// @version      1.0
// @description  Restores normal YouTube layout and disables experimental UI changes.
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558208/YouTube%20Classic%20Layout%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/558208/YouTube%20Classic%20Layout%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    /* ================================
       YOUTUBE CLASSIC WATCH PAGE FIX
       Restores normal 2023–2024 layout
       ================================ */

    /* Fix overly large video player padding */
    ytd-watch-flexy[theater] #player-theater-container,
    ytd-watch-flexy #player-wide-container {
        max-width: 1280px !important;
        margin: 0 auto !important;
    }

    #player-container-inner,
    #player {
        padding: 0 !important;
        margin: 0 !important;
    }

    /* Restore right sidebar normal width */
    #secondary.ytd-watch-flexy {
        max-width: 420px !important;
        min-width: 350px !important;
    }

    /* Fix compact spacing YouTube added */
    ytd-video-primary-info-renderer,
    ytd-video-secondary-info-renderer {
        margin-left: 0 !important;
    }

    /* Remove Shorts shelf */
    ytd-reel-shelf-renderer,
    ytd-reel-shelf-renderer.ytd-item-section-renderer {
        display: none !important;
    }

    /* Remove "All / From this series / From SpongeDivers Music" filter chips */
    yt-chip-cloud-renderer {
        display: none !important;
    }

    /* Remove overly rounded corners from player */
    ytd-watch-flexy #player {
        border-radius: 0 !important;
    }

    /* Fix right-column compact video spacing */
    ytd-compact-video-renderer {
        padding: 6px 0 !important;
    }

    /* Keep the page centered instead of stretched */
    ytd-watch-flexy {
        max-width: 1750px !important;
        margin: 0 auto !important;
    }
    `;

    function addStyle() {
        const style = document.createElement("style");
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    addStyle();
})();
