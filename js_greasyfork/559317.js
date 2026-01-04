// ==UserScript==
// @name         Universal Image Paste to Upload
// @namespace    github.com/AnnaRoblox
// @version      1.0
// @description  Paste an image from your clipboard directly into the first available file upload input on the page.
// @author       AnnaRoblox
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559317/Universal%20Image%20Paste%20to%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/559317/Universal%20Image%20Paste%20to%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Personal Opinion: This should be a built-in browser feature by now!
    // It saves so much disk clutter.

    window.addEventListener('paste', function(event) {
        // Get items from clipboard
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        let imageBlob = null;

        // Look for an image in the pasted data
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                imageBlob = items[i].getAsFile();
                break;
            }
        }

        // If no image was found, we don't need to do anything
        if (!imageBlob) return;

        // Find a file input.
        // We prioritize visible inputs, as some sites have hidden ones for tracking or legacy reasons.
        const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
        const targetInput = fileInputs.find(input => {
            // Check if the input is actually visible to the user
            const rect = input.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }) || fileInputs[0]; // Fallback to the first one found if none are "visible"

        if (targetInput) {
            // To programmatically set a file input's value, we must use DataTransfer
            const dataTransfer = new DataTransfer();

            // Create a file object from the blob so it has a name (some sites require a filename)
            const file = new File([imageBlob], "pasted_image.png", { type: imageBlob.type });
            dataTransfer.items.add(file);

            // Assign the files to the input
            targetInput.files = dataTransfer.files;

            // Most websites listen for a 'change' event to trigger their upload logic
            const changeEvent = new Event('change', { bubbles: true });
            targetInput.dispatchEvent(changeEvent);

            // Provide a little feedback in the console
            console.log('Successfully pasted image into:', targetInput);
        } else {
            console.warn('Pasted an image, but no file upload input was found on this page.');
        }
    });
})();