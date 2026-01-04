// ==UserScript==
// @name        PoE Wiki redirect
// @namespace   TripeTrouble
// @match       https://www.poewiki.net/*
// @grant       none
// @version     1.2
// @author      .
// @description Adds a floating button to go from the PoE 1 wiki to its PoE 2 sister site for the current search/page
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548899/PoE%20Wiki%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/548899/PoE%20Wiki%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    const button = document.createElement('button');
    button.innerText = 'Go To PoE2 Wiki';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '35px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    document.body.appendChild(button);

    function rewriteUrl(currentUrl) {
        try {
            const url = new URL(currentUrl);
            const searchParams = url.searchParams;
            const keyword = searchParams.get('search');
            if (keyword) {
                const newBaseUrl = 'https://www.poe2wiki.net/index.php';
                const newUrl = new URL(newBaseUrl);
                newUrl.searchParams.set('search', keyword);
                return newUrl.toString();
            } else {

                const path = url.pathname;
                const wikiIndex = path.indexOf('wiki/');
                if (wikiIndex !== -1) {
                    const wikiPath = path.substring(wikiIndex + 5); // Extract after 'wiki/'
                    if (wikiPath) {
                        const newBaseUrl = 'https://www.poe2wiki.net';
                        const newUrl = new URL(newBaseUrl);
                        newUrl.pathname = 'wiki/' + wikiPath;
                        return newUrl.toString();
                    }
                }
                return 'No ?search= parameter or wiki/ path found in the URL';
            }
        } catch (e) {
            console.error('Error rewriting URL:', e);
            return currentUrl;
        }
    }


    button.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const newUrl = rewriteUrl(currentUrl);
        window.location.href = newUrl;
    });
})();