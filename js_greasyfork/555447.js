// ==UserScript==
// @name         Decode and Reload Cached Images Automatically
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @author       codr
// @description  Decode and reload Cached Images by removing a URL prefix and decoding URI component Automatically
// @match        https://gazellegames.net/forums.php*
// @match        https://gazellegames.net/userhistory.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555447/Decode%20and%20Reload%20Cached%20Images%20Automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/555447/Decode%20and%20Reload%20Cached%20Images%20Automatically.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    if (!((urlParams.get('action') === 'viewthread' && urlParams.has('threadid')) || urlParams.get('action') === 'posts' )) {
        return; // Exit if not matching the desired page
    }

    async function verifyAndReloadImage(imageUrl, errorImgHash) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const buffer = await response.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const actualHash = Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            console.log(`Actual hash: ${actualHash}`);
            console.log(`Expected hash: ${errorImgHash}`);

            if (actualHash === errorImgHash) {
                console.log("Error. Hashes match. Reloading image...");
                return 1;
            } else {
                console.log("OK. Hashes do not match. This is not an error image.");
                return 0;
            }
        } catch (error) {
            console.error("Error verifying image hash:", error);
            // Handle cases where the image fails to load or hash calculation fails
        }
    }

    // The prefix to remove from the image src before decoding
    const prefix = "https://gazellegames.net/image.php?i=";

    const errorImgHash = '917b12a864bd1189754a22403f4888eb098f38b96da82dbcf03941fd2091bd4b'

    // Select all <img> elements inside <td class="body">
    const images = document.querySelectorAll('td.body img');

    images.forEach(img => {
        // Only process if img.src starts with the prefix
        if (!img.src.startsWith(prefix)) return;

        let src = img.src;

        console.log(src);
        let reload = verifyAndReloadImage(src, errorImgHash);

        if (reload) {
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
        }
    });
})();