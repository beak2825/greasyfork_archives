// ==UserScript==
// @name         Shorts remover
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Removes Shorts button and tabs from youtube.com
// @author       Filodelphia
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555880/Shorts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555880/Shorts%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*************************************************
     *  CSS: hide any loader we mark as "stuck"
     *************************************************/
    GM_addStyle(`
        ytd-continuation-item-renderer.yt-hidden-loader {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `);

    // Your code here...
    function autoRemove(selector) {
        console.log('Auto-removal enabled for selector:', selector);

        function removeMatchesInRoot(root) {
            if (!root || !(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) {
                return;
            }

            const elements = root.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => el.remove());
                console.log(`Removed ${elements.length} element(s) matching: ${selector}`);
            }
        }

        // 1. Initial cleanup on the whole document
        removeMatchesInRoot(document);

        // 2. Observe DOM changes and remove matches as they appear
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Check newly added nodes
                mutation.addedNodes.forEach(node => {
                    if (!(node instanceof Element)) return;

                    // Case 1: the added node itself matches the selector
                    if (node.matches && node.matches(selector)) {
                        console.log('Removing newly added node matching:', selector);
                        node.remove();
                        return;
                    }

                    // Case 2: the added node contains matching elements
                    removeMatchesInRoot(node);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Optional: return observer in case you ever want to stop it
        return observer;
    }


    /*************************************************
     * Smart loader hider:
     * If a continuation loader has a NORMAL video/video-grid item after it,
     * the loader is no longer needed → hide it.
     *************************************************/
    function setupLoaderHider() {
        const CONTENT_SELECTORS = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-compact-video-renderer'
        ].join(', ');

        const isVideoItem = el => el && el.matches && el.matches(CONTENT_SELECTORS);

        const observer = new MutationObserver(() => {
            const loaders = document.querySelectorAll('ytd-continuation-item-renderer');

            loaders.forEach(loader => {
                let next = loader.nextElementSibling;
                if(next == null) exit;

                loader.classList.add('yt-hidden-loader');
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    autoRemove('[title="Shorts"]');
    autoRemove('ytd-rich-section-renderer');
    autoRemove('ytd-reel-shelf-renderer');
    // Special handling for continuation loader
    setupLoaderHider();
})();