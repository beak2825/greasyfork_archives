// ==UserScript==
// @name         Reddit Translation Remover
// @namespace    https://github.com/lunagus
// @version      1.0
// @description  Automatically removes translation parameters (?tl=xx-xxx) from Reddit URLs and redirects to clean URL
// @author       lunagus
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559200/Reddit%20Translation%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/559200/Reddit%20Translation%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanRedditURL() {
        const currentURL = window.location.href;
        const url = new URL(currentURL);

        if (url.searchParams.has('tl')) {
            url.searchParams.delete('tl');
            const cleanURL = url.toString();

            if (cleanURL !== currentURL) {
                console.log('Removing Reddit translation parameter');
                console.log('Original URL:', currentURL);
                console.log('Clean URL:', cleanURL);

                window.location.replace(cleanURL);
            }
        }
    }

    cleanRedditURL();

    let lastURL = window.location.href;

    const observer = new MutationObserver(function(mutations) {
        const currentURL = window.location.href;
        if (currentURL !== lastURL) {
            lastURL = currentURL;
            cleanRedditURL();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    } else {
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('popstate', function() {
        setTimeout(cleanRedditURL, 100);
    });

})();