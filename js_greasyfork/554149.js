// ==UserScript==
// @name         Audible Image Copier
// @namespace    http://tampermonkey.net/
// @version      2025-10-29
// @description  Copy book cover image URLs from Audible pages across all regions
// @author       Tanya
// @match        https://www.audible.com/pd/*
// @match        https://www.audible.com/ac/*
// @match        https://www.audible.co.uk/pd/*
// @match        https://www.audible.co.uk/ac/*
// @match        https://www.audible.ca/pd/*
// @match        https://www.audible.ca/ac/*
// @match        https://www.audible.com.au/pd/*
// @match        https://www.audible.com.au/ac/*
// @match        https://www.audible.de/pd/*
// @match        https://www.audible.de/ac/*
// @match        https://www.audible.fr/pd/*
// @match        https://www.audible.fr/ac/*
// @match        https://www.audible.it/pd/*
// @match        https://www.audible.it/ac/*
// @match        https://www.audible.es/pd/*
// @match        https://www.audible.es/ac/*
// @match        https://www.audible.co.jp/pd/*
// @match        https://www.audible.co.jp/ac/*
// @match        https://www.audible.in/pd/*
// @match        https://www.audible.in/ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audible.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554149/Audible%20Image%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/554149/Audible%20Image%20Copier.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Utility: reliable clipboard write with focus workaround
    async function reliableCopyToClipboard(text) {
        try {
            // Try normal writeText first
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback: focus hack
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    // Copy image URL function
    async function copyImageUrl() {
        try {
            let imageUrl = '';

            // For Audible - prioritize the larger image (usually contains 500 in URL)
            const productImage = document.querySelector('adbl-product-image img');
            const splashImage = document.querySelector('adbl-color-splash');

            if (productImage && productImage.src) {
                imageUrl = productImage.src;
            } else if (splashImage) {
                imageUrl = splashImage.getAttribute('src') || '';
            }

            if (!imageUrl) {
                alert('Image not found on this page');
                return;
            }

            await reliableCopyToClipboard(imageUrl);

            // Visual feedback
            const button = document.getElementById('copy-image-overlay');
            if (button) {
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                        <path fill="#4CAF50" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                `;

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                }, 2000);
            }
        } catch (e) {
            alert(`Error copying image URL: ${e.message}`);
            console.error(e);
        }
    }

    // Add copy icon overlay on image
    function addImageCopyOverlay() {
        let imageContainer;
        let imageElement;

        // For Audible - prioritize the larger image (usually contains 500 in URL)
        imageContainer = document.querySelector('adbl-product-image');
        imageElement = imageContainer?.querySelector('img');

        if (!imageContainer || !imageElement) {
            console.log('Image container or element not found, retrying...');
            return false;
        }

        // Check if overlay already exists
        if (document.getElementById('copy-image-overlay')) {
            return true;
        }

        // Make sure the container has relative positioning
        const containerStyle = window.getComputedStyle(imageContainer);
        if (containerStyle.position === 'static') {
            imageContainer.style.position = 'relative';
        }

        // Create the copy icon overlay
        const copyOverlay = document.createElement('div');
        copyOverlay.id = 'copy-image-overlay';
        copyOverlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                <path fill="white" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
            </svg>
        `;

        // Style the overlay
        copyOverlay.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            padding: 6px;
        `;

        // Add hover effects
        copyOverlay.onmouseover = () => {
            copyOverlay.style.background = 'rgba(255, 107, 53, 0.9)';
            copyOverlay.style.transform = 'scale(1.1)';
            copyOverlay.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        };

        copyOverlay.onmouseout = () => {
            copyOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
            copyOverlay.style.transform = 'scale(1)';
            copyOverlay.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        };

        // Add click handler
        copyOverlay.addEventListener('click', copyImageUrl);

        // Add tooltip
        copyOverlay.title = 'Copy image URL';

        // Append to image container
        imageContainer.appendChild(copyOverlay);

        console.log('Copy image overlay added successfully');
        return true;
    }

    // Initialize the image copy overlay
    function initImageCopier() {
        // Try to add image copy overlay, with retries for dynamic content
        let attempts = 0;
        const maxAttempts = 10;

        function tryAddOverlay() {
            attempts++;
            if (addImageCopyOverlay()) {
                console.log('Image copy overlay added successfully');
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(tryAddOverlay, 500);
            } else {
                console.log('Failed to add image copy overlay after', maxAttempts, 'attempts');
            }
        }

        // Start trying to add the overlay
        setTimeout(tryAddOverlay, 500);
    }

    // Wait for page load before initializing
    setTimeout(initImageCopier, 3000);
})();