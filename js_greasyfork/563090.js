// ==UserScript==
// @name         SharePoint Caption
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fix font size and single line captions in SharePoint video player
// @author       You
// @match        https://v6v10-my.sharepoint.com/*
// @grant        none
// @license      noiseandsmke
// @downloadURL https://update.greasyfork.org/scripts/563090/SharePoint%20Caption.user.js
// @updateURL https://update.greasyfork.org/scripts/563090/SharePoint%20Caption.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Change font size here
    const FONT_SIZE = '20px'; // Change this to your preferred size

    let processedCaptions = new Set();

    function fixCaption(caption) {
        const captionId = caption.outerHTML;
        if (processedCaptions.has(captionId)) return;

        const textContent = caption.textContent?.trim();
        if (!textContent) return;

        // 1. Convert to single line
        caption.innerHTML = caption.innerHTML.replace(/<br\s*\/?>/gi, ' ');

        // 2. Fix font size using CSS custom property
        caption.style.setProperty('--oneplayer-caption-text-size', FONT_SIZE, 'important');
        caption.style.fontSize = `${FONT_SIZE} !important`;

        // 3. Force to bottom of video container
        const captionSection = caption.closest('.captions-section');
        const captionRegion = caption.closest('.captions-region');

        if (captionSection) {
            captionSection.style.bottom = '20px !important';
            captionSection.style.top = 'auto !important';
        }

        if (captionRegion) {
            // Position relative to video player container
            const videoContainer = document.querySelector('.video-player-container');
            if (videoContainer) {
                captionRegion.style.position = 'absolute !important';
                captionRegion.style.bottom = '0px !important';
                captionRegion.style.left = '0px !important';
                captionRegion.style.right = '0px !important';
                captionRegion.style.width = '100% !important';
                captionRegion.style.height = '100% !important';
            }
        }

        processedCaptions.add(captionId);
    }

    function processCaptions() {
        const captions = document.querySelectorAll('.captions');
        captions.forEach(fixCaption);
    }

    // Observer for new captions
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.target.classList?.contains('captions') ||
                mutation.target.querySelector?.('.captions')) {
                processCaptions();
                break;
            }
        }
    });

    // Start
    function init() {
        processCaptions();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Initialize with delay
    setTimeout(init, 1000);
})();
