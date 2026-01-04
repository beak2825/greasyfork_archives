// ==UserScript==
// @name         YouTube Mobile - Hide Comments
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Completely hide and disable the comment section on mobile YouTube
// @author       You
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551974/YouTube%20Mobile%20-%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/551974/YouTube%20Mobile%20-%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aggressive CSS to hide everything comment-related
    const style = document.createElement('style');
    style.textContent = `
        /* Hide the clickable comment preview box */
        ytm-comment-simplebox-renderer,
        
        /* Hide the structured description items that contain comments */
        ytm-structured-description-content-renderer ytm-comment-simplebox-renderer,
        
        /* Target the parent container */
        ytm-item-section-renderer:has(ytm-comment-simplebox-renderer),
        
        /* Hide the entire comment section when opened */
        ytm-comments-entry-point-header-renderer,
        ytm-comments-entry-point-header-renderer.item,
        ytm-comment-section-renderer,
        ytm-comments-header-renderer,
        ytm-comment-thread-renderer,
        ytm-item-section-renderer[section-identifier="comment-item-section"],
        ytm-commentbox,
        
        /* Hide engagement panels related to comments */
        ytm-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"],
        ytm-engagement-panel-section-list-renderer[target-id*="comment"],
        
        /* Nuclear options */
        [is-comment-entry-point],
        [comment-section],
        
        /* Alternative selectors */
        .comment-simplebox-renderer,
        
        /* Hide any element with comment-related aria labels */
        [aria-label*="comment" i][aria-label*="Comment" i] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }
    `;
    
    (document.head || document.documentElement).appendChild(style);

    // Aggressive function to nuke all opened comment elements
    function nukeOpenedComments() {
        const selectors = [
            // Full comment section
            'ytm-comments-entry-point-header-renderer',
            'ytm-comment-section-renderer',
            'ytm-comments-header-renderer',
            'ytm-comment-thread-renderer',
            'ytm-commentbox',
            'ytm-item-section-renderer[section-identifier="comment-item-section"]',
            'ytm-engagement-panel-section-list-renderer[target-id*="comment"]',
            '[is-comment-entry-point]',
        ];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.remove();
                    }
                });
            } catch(e) {
                // Continue if selector fails
            }
        });
    }

    // Run immediately
    nukeOpenedComments();

    // MutationObserver
    const observer = new MutationObserver(function(mutations) {
        nukeOpenedComments();
    });

    function startObserving() {
        if (document.documentElement) {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(startObserving, 10);
        }
    }

    startObserving();

    // Event listeners
    window.addEventListener('load', nukeOpenedComments);
    window.addEventListener('yt-navigate-finish', nukeOpenedComments);
    window.addEventListener('yt-page-data-updated', nukeOpenedComments);
    
    // Regular check
    setInterval(nukeOpenedComments, 200);

})();