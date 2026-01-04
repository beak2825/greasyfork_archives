// ==UserScript==
// @name         YouTube Redirect Resolver
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Resolves YouTube redirect links to their actual URLs
// @author       GooglyBlox
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550119/YouTube%20Redirect%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/550119/YouTube%20Redirect%20Resolver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractActualUrl(redirectUrl) {
        try {
            const url = new URL(redirectUrl, 'https://www.youtube.com');
            const actualUrl = url.searchParams.get('q');
            return actualUrl ? decodeURIComponent(actualUrl) : null;
        } catch (e) {
            return null;
        }
    }

    function processRedirectLinks(container = document) {
        const redirectLinks = container.querySelectorAll('a[href*="/redirect?"]');

        redirectLinks.forEach(link => {
            if (link.dataset.redirectResolved) return;

            const actualUrl = extractActualUrl(link.href);
            if (actualUrl) {
                link.href = actualUrl;
                link.dataset.redirectResolved = 'true';

                if (link.textContent.includes('youtube.com/redirect')) {
                    link.textContent = actualUrl;
                }

                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    function init() {
        processRedirectLinks();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processRedirectLinks(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();