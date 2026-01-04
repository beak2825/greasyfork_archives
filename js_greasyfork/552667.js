// ==UserScript==
// @name         Reddit Share Link Cleaner
// @namespace    https://github.com/naveen-devang/redditCleanShareURL/
// @version      1.1
// @description  Auto-strip UTM trackers from Reddit share links on copy
// @author       Naveen Devang
// @license      MIT
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552667/Reddit%20Share%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/552667/Reddit%20Share%20Link%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clean URL: Remove UTM params and handle /s/ links
    function cleanUrl(url) {
        if (url.includes('/s/')) {
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical && canonical.href) {
                console.log('Resolved /s/ link using canonical tag');
                return canonical.href.replace(/\/*$/, '/');
            }
            console.log('No canonical tag, falling back to current page URL');
            return window.location.pathname.replace(/\/*$/, '/');
        }
        return url.split('?')[0].replace(/\/*$/, '/');
    }

    // Override navigator.clipboard.writeText if available (modern browsers)
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = async function(text) {
        if (window.location.hostname.includes('reddit.com') && (text.includes('utm_') || text.includes('/s/'))) {
            const clean = cleanUrl(text);
            console.log('Cleaned Reddit share URL:', clean);
            return originalWriteText.call(this, clean);
        }
        return originalWriteText.call(this, text);
    };

    // Fallback: Hook into Reddit's share button events (for older browsers)
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-testid="post-share-button"], .share-button *')) {
            setTimeout(() => {
                const selection = window.getSelection().toString();
                if (selection && (selection.includes('utm_') || selection.includes('/s/'))) {
                    const clean = cleanUrl(selection);
                    navigator.clipboard.writeText(clean).catch(console.error);
                }
            }, 100); // Small delay for copy to trigger
        }
    }, true);

    if (window.location.search.includes('utm_') || window.location.pathname.includes('/s/')) {
        const clean = cleanUrl(window.location.href);
        window.history.replaceState({}, '', clean);
    }
})();