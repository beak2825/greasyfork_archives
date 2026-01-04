// ==UserScript==
// @name         Chaturbate streamer menu preview pop-up
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Display model preview image in menu in full size next to the menu
// @author       Brsrk
// @icon         https://www.google.com/s2/favicons?sz=32&domain=chaturbate.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @match        https://chaturbate.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551038/Chaturbate%20streamer%20menu%20preview%20pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/551038/Chaturbate%20streamer%20menu%20preview%20pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add tooltip to image
    function addTooltip(img) {
        img.addEventListener('mouseover', (e) => {
            const rect = img.getBoundingClientRect();
            const tooltip = document.createElement('div');
            tooltip.style.position = 'fixed';

            const edgeThreshold = 400; // pixels from the edge
            if (rect.left < edgeThreshold) {
                tooltip.style.left = (rect.right + 5) + 'px'; // show on the right
            } else if (rect.right > window.innerWidth - edgeThreshold) {
                tooltip.style.left = (rect.left - 365) + 'px'; // show on the left
            } else {
                // default to left side if image is in the middle
                tooltip.style.left = (rect.left - 365) + 'px';
            }

            tooltip.style.top = (rect.top + 32) + 'px';
            tooltip.style.zIndex = '10000';
            tooltip.style.pointerEvents = 'none';

            const tooltipImg = document.createElement('img');
            tooltipImg.src = img.src;
            tooltipImg.style.maxWidth = '400px';
            tooltipImg.style.maxHeight = '300px';
            tooltipImg.style.borderRadius = '7px';
            tooltipImg.style.border = '1.5px solid #1c2833';
            tooltip.appendChild(tooltipImg);

            document.body.appendChild(tooltip);

            img.addEventListener('mouseout', () => {
                tooltip.remove();
            });
        });
    }

    // Use MutationObserver to detect dynamic content loading
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IMG' && node.src && node.src.startsWith('https://thumb.live.mmcdn.com/ri/')) {
                        addTooltip(node);
                    } else if (node.querySelectorAll) {
                        const images = node.querySelectorAll('img[src^="https://thumb.live.mmcdn.com/ri/"]');
                        images.forEach(addTooltip);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const existingImages = document.querySelectorAll('img');
    const matchingImages = Array.from(existingImages).filter(img => img.src && img.src.startsWith('https://thumb.live.mmcdn.com/ri/'));
    matchingImages.forEach(addTooltip);
})();