// ==UserScript==
// @name         Telegram Background Changer
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Replaces the default Telegram background with a custom solid color or wallpaper when not logged in
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://t.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552310/Telegram%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/552310/Telegram%20Background%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Set to true for solid color, false for wallpaper background image
    const useCustomColor = true; // true = use solid color, false = use wallpaper background image

    // Define the custom background color (used if useCustomColor = true or as fallback)
    const customBackgroundColor = '#000000'; // Change to any HEX color, e.g., '#000000' for deep black
    //const customBackgroundColor = '#1a1a1a'; // dark gray
    //const customBackgroundColor = '#8AB985'; // sage green

    // Define the custom wallpaper background image URL (used if useCustomColor = false)
    const customBackgroundImage = 'https://images.pexels.com/photos/1042423/pexels-photo-1042423.jpeg'; // Replace with your image URL, e.g. Yellow Flowering Green Plants
    //const customBackgroundImage = 'https://images.pexels.com/photos/36487/above-adventure-aerial-air.jpg'; // Air Balloon hovering over Water during Night Time
    //const customBackgroundImage = 'https://images.pexels.com/photos/7919/pexels-photo.jpg'; // Cloudy Mountain

    // Optional: Improve text readability by setting text color and shadow
    const improveTextReadability = true; // Set to true to apply white text with shadow
    const textColor = '#ffffff'; // Text color for better readability
    const textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)'; // Shadow for text

    // Function to replace the background
    function replaceBackground() {
        // Check if the page is a Telegram page
        if (window.location.href.includes('t.me')) {
            // Get the body and background wrapper elements
            const body = document.body;
            const backgroundWrap = document.querySelector('.tgme_background_wrap');
            const canvas = document.getElementById('tgme_background');
            const pattern = document.querySelector('.tgme_background_pattern');

            // Remove the canvas element to prevent the animated background
            if (canvas) {
                canvas.remove();
            }

            // Remove the pattern overlay if present
            if (pattern) {
                pattern.remove();
            }

            // Apply background (color or image)
            if (useCustomColor) {
                // Apply solid color
                body.style.background = customBackgroundColor;
                body.style.backgroundColor = customBackgroundColor;
                if (backgroundWrap) {
                    backgroundWrap.style.background = customBackgroundColor;
                    backgroundWrap.style.backgroundColor = customBackgroundColor;
                }
            } else {
                // Apply wallpaper background image
                body.style.background = `url('${customBackgroundImage}') no-repeat center center fixed`;
                body.style.backgroundSize = 'cover';
                if (backgroundWrap) {
                    backgroundWrap.style.background = `url('${customBackgroundImage}') no-repeat center center fixed`;
                    backgroundWrap.style.backgroundSize = 'cover';
                }
            }

            // Ensure the background covers the entire page
            body.style.minHeight = '100vh';
            if (backgroundWrap) {
                backgroundWrap.style.minHeight = '100vh';
            }

            // Improve text readability if enabled
            if (improveTextReadability) {
                const textElements = document.querySelectorAll(
                    '.tgme_page_title, .tgme_page_description, .tgme_page_extra, .tgme_page_additional, ' +
                    '.tgme_page_context_link, .tgme_page_widget_actions, .tgme_action_button_new, .tgme_action_button_label'
                );
                textElements.forEach(element => {
                    element.style.color = textColor;
                    element.style.textShadow = textShadow;
                });
            }

            // Attempt to disable TWallpaper animations
            if (window.TWallpaper) {
                window.TWallpaper.animate = function() {};
                window.TWallpaper.update = function() {};
            }
        }
    }

    // Execute the function when the page loads
    window.addEventListener('load', replaceBackground);

    // Observe DOM changes to handle dynamically loaded elements (e.g., widget)
    const observer = new MutationObserver(replaceBackground);
    observer.observe(document.body, { childList: true, subtree: true });

    // Override TWallpaper initialization to prevent default background
    Object.defineProperty(window, 'TWallpaper', {
        value: {
            init: function() {}, // Empty init function
            animate: function() {}, // Empty animate function
            update: function() {} // Empty update function
        },
        writable: false
    });

    // Handle widget loading by reapplying the background after a delay
    setTimeout(replaceBackground, 1000); // Reapply after 1 second to catch widget load
})();