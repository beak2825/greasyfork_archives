// ==UserScript==
// @name         BookWalker Cover Extractor
// @namespace    https://greasyfork.org/en/users/1512421-shikiri
// @version      1.0
// @description  Display BookWalker high resolution cover page in a popup for easy access
// @author       Shikiri
// @license      MIT
// @match        https://bookwalker.jp/*
// @icon         https://bookwalker.jp/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549735/BookWalker%20Cover%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/549735/BookWalker%20Cover%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const metaTag = document.querySelector('meta[name="twitter:image"]');

    if (metaTag) {
        const id = metaTag.content.split('/')[3];

        if (id) {
            const url = `https://c.bookwalker.jp/coverImage_${id}.jpg`;
            console.log(url);

            // Create a popup container
            const popup = document.createElement('div');
            popup.style.display = 'block'; // Show the popup
            popup.style.position = 'fixed';
            popup.style.bottom = '20px';
            popup.style.right = '20px';
            popup.style.width = '150px';
            popup.style.backgroundColor = 'white';
            popup.style.border = '1px solid #c0c0c0';
            popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            popup.style.padding = '10px';
            popup.style.zIndex = '1000';
            popup.style.borderRadius = '5px';

            // Create an image element
            const img = document.createElement('img');
            img.style.width = '100%'; // Responsive image
            img.style.cursor = 'pointer'; // Change cursor to pointer
            img.src = url; // Set the image source
            img.onclick = function() {
                window.open(url, '_blank'); // Open in a new tab
            };
            popup.appendChild(img); // Append the image to the popup

            // Create a close button (X)
            const closeButton = document.createElement('span');
            closeButton.textContent = '✖'; // X character
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '20px';
            closeButton.style.color = '#2f2f2f'; // Default color
            closeButton.style.transition = 'color 0.3s'; // Smooth color transition

            // Change color on hover
            closeButton.onmouseover = function() {
                closeButton.style.color = '#dd3636'; // Change to red on hover
            };
            closeButton.onmouseout = function() {
                closeButton.style.color = '#2f2f2f'; // Revert to default color
            };

            closeButton.onclick = function() {
                popup.style.display = 'none'; // Hide the popup
            };
            popup.appendChild(closeButton);

            // Append the popup to the body
            document.body.appendChild(popup);
        }
    }
})();
