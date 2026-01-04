// ==UserScript==
// @name         Decode and Reload Cached Images Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @author       codr
// @description  Add a button beside each <img> to decode and reload its URL by removing a prefix and decoding URI component
// @match        https://gazellegames.net/forums.php*
// @match        https://gazellegames.net/userhistory.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555444/Decode%20and%20Reload%20Cached%20Images%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/555444/Decode%20and%20Reload%20Cached%20Images%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    if (!((urlParams.get('action') === 'viewthread' && urlParams.has('threadid')) || urlParams.get('action') === 'posts' )) {
        return; // Exit if not matching the desired page
    }

    // The prefix to remove from the image src before decoding
    const prefix = "https://gazellegames.net/image.php?i=";

    // Select all <img> elements inside <td class="body">
    const images = document.querySelectorAll('td.body img');

    images.forEach(img => {
        // Only add button if img.src starts with the prefix
        if (!img.src.startsWith(prefix)) return;

        // Create a button element
        const btn = document.createElement('button');
        btn.textContent = 'Decode & Reload';
        btn.style.marginLeft = '6px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', () => {
            let src = img.src;

            // Remove the prefix
            let encodedPart = src.substring(prefix.length);

            // Remove trailing "&c=1" if it exists
            if (encodedPart.endsWith('&c=1')) {
                encodedPart = encodedPart.slice(0, -4);
            }

            // Decode the URI component
            let decodedUrl;
            try {
                decodedUrl = decodeURIComponent(encodedPart);
            } catch(e) {
                console.log('Failed to decode URL');
                return;
            }

            // Set the image src to the decoded URL to reload it
            img.src = decodedUrl;
        });

        // Insert the button right after the image
        img.insertAdjacentElement('afterend', btn);
    });
})();