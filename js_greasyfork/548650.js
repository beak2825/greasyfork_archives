// ==UserScript==
// @name         Gulper.io Replace Filter Line
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces 'var n = da(filter_profanity(t));' with 'var n = da(t);' in all.js on gulper.io by intercepting the script and removing async, with iframe support.
// @author       Crazy Ape
// @match        https://gulper.io/*
// @include      https://gulper.io/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548650/Gulperio%20Replace%20Filter%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/548650/Gulperio%20Replace%20Filter%20Line.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept fetch to modify all.js
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('all.js')) {
            console.log('[Replace] Intercepted fetch for all.js:', url);
            return originalFetch(url, options).then(response => {
                if (!response.ok) {
                    console.warn('[Replace] Fetch failed for all.js:', response.status);
                    return response;
                }
                return response.text().then(text => {
                    // Replace the target line, accounting for minification
                    const originalLine = 'var n=da(filter_profanity(t));';
                    const newLine = 'var n=da(t);';
                    const modifiedText = text.replace(
                        /var\s+n\s*=\s*da\s*\(\s*filter_profanity\s*\(\s*t\s*\)\s*\)\s*;/g,
                        newLine
                    );
                    if (modifiedText !== text) {
                        console.log('[Replace] Replaced line in all.js');
                    } else {
                        console.warn('[Replace] Target line not found in all.js');
                    }
                    return new Response(modifiedText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // Intercept <script> tags to remove async for all.js
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('all.js')) {
                    console.log('[Replace] Found all.js script tag via MutationObserver:', node.src);
                    if (node.hasAttribute('async')) {
                        node.removeAttribute('async');
                        console.log('[Replace] Removed async attribute via MutationObserver');
                    }
                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    // Fallback: Poll for script tags
    const scriptPoll = setInterval(() => {
        document.querySelectorAll('script[src*="all.js"]').forEach(script => {
            console.log('[Replace] Found all.js script tag via polling:', script.src);
            if (script.hasAttribute('async')) {
                script.removeAttribute('async');
                console.log('[Replace] Removed async attribute via polling');
            }
        });
    }, 100);
    setTimeout(() => clearInterval(scriptPoll), 5000); // Stop polling after 5 seconds

    // Apply override to iframes
    function applyToIframes() {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.fetch = window.fetch; // Apply fetch override to iframes
                    console.log('[Replace] Applied fetch override to iframe:', iframe.src || 'no-src');
                }
            } catch (e) {
                console.warn('[Replace] Error applying fetch override to iframe:', e);
            }
        });
    }

    // Initial iframe check
    applyToIframes();

    // Poll for iframes
    const iframePoll = setInterval(applyToIframes, 500);
    setTimeout(() => clearInterval(iframePoll), 10000); // Stop polling after 10 seconds

    // Debug: Log initialization
    console.log('[Replace] Script initialized at:', new Date().toISOString());
})();