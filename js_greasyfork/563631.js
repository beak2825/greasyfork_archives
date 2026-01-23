// ==UserScript==
// @name         Ylilauta - Laajenna AP:n kuva
// @namespace    https://greasyfork.org/en/users/11903-eonmc2
// @version      1.5.1
// @description  Automatically expands the first post's image reliably. Skips expansion if a specific reply is targeted via URL.
// @author       Gemini
// @license      MIT
// @match        https://ylilauta.org/*/*
// @exclude      https://ylilauta.org/
// @exclude      https://ylilauta.org/satunnainen
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563631/Ylilauta%20-%20Laajenna%20AP%3An%20kuva.user.js
// @updateURL https://update.greasyfork.org/scripts/563631/Ylilauta%20-%20Laajenna%20AP%3An%20kuva.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tryToExpandImage = () => {
        let attempts = 0;
        const maxAttempts = 40; // 40 * 200ms = 8s

        const intervalId = setInterval(() => {
            const firstPost = document.querySelector('.open-thread .post.op');
            if (!firstPost) {
                clearInterval(intervalId);
                return;
            }

            // Check if the full image is already visible
            const fullImg = firstPost.querySelector('img.full-img');
            if (fullImg) {
                console.log('Ylilauta-UserScript: Image is now expanded.');
                // Scroll into view
                fullImg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Remove potential overlay
                const overlay = document.querySelector('.image-overlay');
                if (overlay) overlay.remove();
                clearInterval(intervalId);
                return;
            }

            // Find the thumbnail
            const thumbnail = firstPost.querySelector('figure.file.preview > picture > img');
            if (thumbnail && thumbnail.complete && thumbnail.naturalWidth > 0) {
                console.log(`Ylilauta-UserScript: Clicking OP image (attempt ${attempts + 1}/${maxAttempts})`);
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                thumbnail.dispatchEvent(clickEvent);
            } else {
                console.log(`Ylilauta-UserScript: Waiting for image to load... (${attempts + 1}/${maxAttempts})`);
            }

            if (++attempts >= maxAttempts) {
                console.log('Ylilauta-UserScript: Image expansion failed (8s timeout).');
                clearInterval(intervalId);
            }
        }, 200);
    };

    const observer = new MutationObserver((_, obs) => {
        const firstPost = document.querySelector('.open-thread .post.op');
        if (firstPost) {
            // FIX: Check if the URL points to a specific reply (hash exists and is not the OP)
            const hash = window.location.hash;

            // If hash looks like #post-123 and it is NOT the OP's ID, stop the script.
            // This prevents the script from hijacking the scroll when navigating to a reply.
            if (hash && hash.includes('post-') && firstPost.id && hash !== ('#' + firstPost.id)) {
                console.log('Ylilauta-UserScript: Skipping auto-expand because a specific reply is targeted.');
                obs.disconnect();
                return;
            }

            tryToExpandImage();
            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
