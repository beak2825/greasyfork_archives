// ==UserScript==
// @name         Crunchyroll Subtitle Resizer to 0% scale - remove subtitle
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adjusts the subtitle size on Crunchyroll's 
// @author       Bitodette
// @homepageURL  https://github.com/Bitodette/crunchyroll-subtitle-resizer
// @supportURL   https://github.com/Bitodette/crunchyroll-subtitle-resizer/issues
// @match        *://*.crunchyroll.com/*
// @match        *://static.crunchyroll.com/vilos-v2/web/vilos/player.html*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547899/Crunchyroll%20Subtitle%20Resizer%20to%200%25%20scale%20-%20remove%20subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/547899/Crunchyroll%20Subtitle%20Resizer%20to%200%25%20scale%20-%20remove%20subtitle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // --- USER SETTINGS: Adjust the values below to customize your subtitles ---
    // =================================================================================

    // 1. SUBTITLE SIZE
    // Controls the overall size of the subtitles.
    // Use values less than 1.0 to make them smaller, and greater than 1.0 to make them larger.
    // Examples:
    // 0.8 = 80% size (Smaller)
    // 0.7 = 70% size (Even smaller)
    // 1.0 = 100% size (Default)
    // 1.2 = 120% size (Larger)
    const SUBTITLE_SCALE = 0;


    // 2. VERTICAL POSITION
    // Adjust this if the subtitles are too high or too low after resizing.
    // It moves the subtitle block up or down from the bottom of the screen.
    // Examples:
    // "1%"  (Default - slightly raised from the very bottom)
    // "0%"  (At the very bottom edge)
    // "-2%" (Slightly lower, potentially cutting into the controls area)
    // "5%"  (Higher up on the screen)
    const VERTICAL_POSITION = "1%";


    // =================================================================================
    // --- SCRIPT LOGIC: No need to edit below this line ---
    // =================================================================================

    const cssCanvasResize = `
        #velocity-canvas {
            transform: scale(${SUBTITLE_SCALE}) !important;

            transform-origin: bottom center !important;

            bottom: ${VERTICAL_POSITION} !important;

            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
        }
    `;

    GM_addStyle(cssCanvasResize);

})();