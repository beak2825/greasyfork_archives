// ==UserScript==
// @name         DSS: Torn Custom Background
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Custom background image for Torn.com
// @author       Dsuttz
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/api.html
// @exclude      https://www.torn.com/swagger.php
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550697/DSS%3A%20Torn%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/550697/DSS%3A%20Torn%20Custom%20Background.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Get stored image URL or prompt for it
    let imageUrl = GM_getValue('background_image_url');

    // Validate and prompt for image URL if needed
    if (!imageUrl || imageUrl === 'undefined' || imageUrl === '') {
        let text = 'Torn Custom Background:\n\nPlease enter your background image URL.\n\n' +
                  'Use Catbox.moe or Imgur for best quality.\n\n' +
                  'Example: https://i.imgur.com/yourimage.jpeg\n\nTo update the image, open the script in Tampermoney Editor, go to storage and replace the url.';
        imageUrl = prompt(text, "");
        if (imageUrl) {
            GM_setValue('background_image_url', imageUrl);
        } else {
            return; // Exit if no URL provided
        }
    }

    // Inject CSS immediately
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-image: url('${imageUrl}') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
        }
        /* Make sure the backdrop container doesn't block our background */
        .d .backdrops-container {
            background: transparent !important;
        }
        .d .backdrops-container .custom-bg-desktop,
        .d .backdrops-container .custom-bg-mobile {
            background: transparent !important;
        }
        /* Add blur overlay using backdrop container */
        .d .backdrops-container::after {
            content: '' !important;
            position: fixed !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) scaleX(var(--zoom-scale, 1)) !important;
            transform-origin: center top !important;
            width: 44% !important;
            height: 100vh !important;
            background: rgba(0.5, 0, 0, 0.5) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // Use a fixed baseline - 90% zoom at 2048px width
    const baselineWidth = 2048;
    const baselineZoom = 0.9;
    const referenceWidth = baselineWidth / baselineZoom;

    let lastWidth = null;

    // Update zoom scale on zoom change
    function updateZoomScale() {
        const currentWidth = window.innerWidth;
        if (currentWidth !== lastWidth) {
            const zoomLevel = referenceWidth / currentWidth;
            document.body.style.setProperty('--zoom-scale', zoomLevel);
            lastWidth = currentWidth;
        }
    }

    // Only check on resize events, not continuously
    window.addEventListener('resize', updateZoomScale);

    // Initial call
    updateZoomScale();
})();