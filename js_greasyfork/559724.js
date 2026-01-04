// ==UserScript==
// @name         Manga Image Zoomer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zoom in/out manga images using keyboard shortcuts (+ / - / 0)
// @author       Gemini
// @match        https://comix.to/*
// @grant        none
// @license      MIIT
// @downloadURL https://update.greasyfork.org/scripts/559724/Manga%20Image%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/559724/Manga%20Image%20Zoomer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let zoomLevel = 100;

    // Function to apply zoom to all manga images
    function applyZoom() {
        // Targets common manga container/image patterns
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Check if the image is likely a manga page (usually large height)
            if (img.naturalHeight > 500 || img.closest('main')) {
                img.style.width = zoomLevel + '%';
                img.style.maxWidth = 'none'; // Overrides site restrictions
                img.style.height = 'auto';
                img.style.margin = '0 auto';
                img.style.display = 'block';
            }
        });
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        // "+" key to zoom in
        if (e.key === '=' || e.key === '+') {
            zoomLevel += 10;
            applyZoom();
        }
        // "-" key to zoom out
        if (e.key === '-') {
            zoomLevel = Math.max(10, zoomLevel - 10);
            applyZoom();
        }
        // "0" key to reset
        if (e.key === '0') {
            zoomLevel = 100;
            applyZoom();
        }
    });

    // Re-apply zoom when scrolling or new images load (for infinite scroll)
    const observer = new MutationObserver(applyZoom);
    observer.observe(document.body, { childList: true, subtree: true });
})();