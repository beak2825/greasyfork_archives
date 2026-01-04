// ==UserScript==
// @name         ChatGPT Remove UTM Source from links (clean URLs)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes ?utm_source=chatgpt.com from URLs on OpenAI and ChatGPT domains
// @author       ezzdev
// @match        https://*.openai.com/*
// @match        https://*.chatgpt.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553465/ChatGPT%20Remove%20UTM%20Source%20from%20links%20%28clean%20URLs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553465/ChatGPT%20Remove%20UTM%20Source%20from%20links%20%28clean%20URLs%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clean URL
    function cleanURL(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.searchParams.has('utm_source')) {
                urlObj.searchParams.delete('utm_source');
                return urlObj.toString();
            }
        } catch (e) {
            // Invalid URL, return original
        }
        return url;
    }

    // Clean current URL if it has the parameter
    if (window.location.search.includes('utm_source=')) {
        const cleanedURL = cleanURL(window.location.href);
        if (cleanedURL !== window.location.href) {
            window.history.replaceState({}, '', cleanedURL);
        }
    }

    // Intercept link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('utm_source=')) {
            const cleanedURL = cleanURL(link.href);
            if (cleanedURL !== link.href) {
                link.href = cleanedURL;
            }
        }
    }, true);

    // Clean links on page load and mutations
    function cleanAllLinks() {
        document.querySelectorAll('a[href*="utm_source="]').forEach(link => {
            link.href = cleanURL(link.href);
        });
    }

    // Observer for dynamically added content
    const observer = new MutationObserver(cleanAllLinks);

    if (document.body) {
        cleanAllLinks();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            cleanAllLinks();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();