// ==UserScript==
// @name         Reddit Promote Disabled
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes promoted posts from Reddit feed
// @author       dil83
// @license      MIT
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552500/Reddit%20Promote%20Disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/552500/Reddit%20Promote%20Disabled.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removePromotedPosts() {
        const promotedPosts = document.querySelectorAll('shreddit-ad-post');

        promotedPosts.forEach(post => {
            post.remove();
        });
    }
    removePromotedPosts();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('shreddit-ad-post')) {
                            node.remove();
                        }
                        const promotedInNode = node.querySelectorAll ? node.querySelectorAll('shreddit-ad-post') : [];
                        promotedInNode.forEach(post => post.remove());
                    }
                });
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
