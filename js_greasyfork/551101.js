// ==UserScript==
// @name         Hide Community Posts from YouTube Mobile Feed
// @namespace    https://greasyfork.org/en/scripts/551101-hide-community-posts-from-youtube-mobile-feed
// @version      1.0
// @description  Hides all Community tab posts (text, polls, images) from the YouTube Mobile homepage feed
// @author       Adam Jensen
// @license MIT
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551101/Hide%20Community%20Posts%20from%20YouTube%20Mobile%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/551101/Hide%20Community%20Posts%20from%20YouTube%20Mobile%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_CLASS = '.rich-section-content';
    const STYLE_ID = 'yt-hide-posts-style'; 

    function addStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const css = `
            ${TARGET_CLASS} {
                display: none !important;
            }
        `;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function observeMutations() {
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (node.matches(TARGET_CLASS) || node.querySelector(TARGET_CLASS))) {
                            
                        }
                    });
                }
            });
        });

        setTimeout(() => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } 
        }, 100);
    }

    addStyle();
    observeMutations();

})();