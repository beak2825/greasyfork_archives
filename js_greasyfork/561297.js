// ==UserScript==
// @name         FV - Clawtooth Bazaar Item Museum Links
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      2.0
// @description  Makes items in the Clawtooth Bazaar clickable so they link to their item museum pages.
// @author       necroam
// @match        https://www.furvilla.com/bazaar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561297/FV%20-%20Clawtooth%20Bazaar%20Item%20Museum%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/561297/FV%20-%20Clawtooth%20Bazaar%20Item%20Museum%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractItemIdFromUrl(url) {
        const match = url.match(/img\/items\/\d+\/(\d+)-/);
        return match ? match[1] : null;
    }

    function makeItemsClickable() {
        const itemImages = document.querySelectorAll('.vendor-box img[src*="/img/items/"]');

        itemImages.forEach(img => {
            if (img.parentElement.tagName === 'A') return;

            const itemId = extractItemIdFromUrl(img.src);

            if (itemId) {
                const museumUrl = `https://www.furvilla.com/museum/item/${itemId}`;

                const link = document.createElement('a');
                link.href = museumUrl;
                link.target = '_blank'; 
                link.title = 'View in Item Museum';
                link.style.cursor = 'pointer';
                link.style.textDecoration = 'none';
                link.style.display = 'inline-block';

                img.parentNode.insertBefore(link, img);
                link.appendChild(img);

                img.style.transition = 'opacity 0.2s';
                img.addEventListener('mouseenter', () => {
                    img.style.opacity = '0.8';
                });
                img.addEventListener('mouseleave', () => {
                    img.style.opacity = '1';
                });
            }
        });
    }

    window.addEventListener('load', makeItemsClickable);

    const observer = new MutationObserver(makeItemsClickable);
    observer.observe(document.body, { childList: true, subtree: true });
})();