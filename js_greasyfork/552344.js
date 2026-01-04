// ==UserScript==
// @name         Bloxd.io Cube Warfare Crosshair
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces the default crosshair of guns with a better one
// @author       SweatNuts
// @match        https://bloxd.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552344/Bloxdio%20Cube%20Warfare%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/552344/Bloxdio%20Cube%20Warfare%20Crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCrosshairImageUrl = 'https://i.imgur.com/SjdK6xv.png';

    // This function applies the custom crosshair style
    function applyCustomCrosshair(crosshairElement) {
        // A check to see if we've already modified this element
        if (crosshairElement.dataset.customized) {
            return;
        }

        // Clear the existing crosshair bars
        crosshairElement.innerHTML = '';

        // Apply the new crosshair image
        crosshairElement.style.backgroundImage = `url(${customCrosshairImageUrl})`;
        crosshairElement.style.backgroundRepeat = 'no-repeat';
        crosshairElement.style.backgroundSize = 'contain';
        crosshairElement.style.backgroundPosition = 'center';
        crosshairElement.style.width = '30px';
        crosshairElement.style.height = '30px';

        // Fix positioning to be in the center of the screen
        crosshairElement.style.position = 'fixed';
        crosshairElement.style.top = '50%';
        crosshairElement.style.left = '50%';
        crosshairElement.style.transform = 'translate(-50%, -50%)';

        // Mark this element as customized
        crosshairElement.dataset.customized = 'true';

        console.log('Custom crosshair applied.');
    }

    // Use a MutationObserver to watch for when the crosshair is added to the page
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const crosshair = document.querySelector('.GunCrosshairWrapper');
                if (crosshair) {
                    applyCustomCrosshair(crosshair);
                }
            }
        }
    });

    // Use a MutationObserver to watch for when the crosshair is added to the page
    const observer2 = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const crosshair = document.querySelector('.GunCrosshairOverlayWrapper');
                if (crosshair) {
                    applyCustomCrosshair(crosshair);
                }
            }
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    observer2.observe(document.body, { childList: true, subtree: true });

})();