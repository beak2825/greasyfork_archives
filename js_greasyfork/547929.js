// ==UserScript==
// @name         Hide @grok Mentions on Twitter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide any tweets or comments mentioning @grok
// @author       Xenon
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547929/Hide%20%40grok%20Mentions%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/547929/Hide%20%40grok%20Mentions%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideGrokTweets(node) {
        if (!node) return;
        const tweets = node.querySelectorAll('article');
        tweets.forEach(tweet => {
            const text = tweet.innerText.toLowerCase();
            if (text.includes('@grok')) {
                tweet.style.display = 'none';
            }
        });
    }

    // Initial scan
    hideGrokTweets(document.body);

    // Watch for dynamically loaded tweets
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    hideGrokTweets(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
