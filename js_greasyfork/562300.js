// ==UserScript==
// @name         Facebook Mobile - Hide suggested posts
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Hide reels, follow/join suggestions, and suggested friends from Facebook mobile
// @author       fejjj
// @match        https://m.facebook.com/*
// @match        https://www.facebook.com/*
// @match        https://touch.facebook.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562300/Facebook%20Mobile%20-%20Hide%20suggested%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/562300/Facebook%20Mobile%20-%20Hide%20suggested%20posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== FILTER SETTINGS - Change these to true/false to enable/disable filters =====
    const FILTERS = {
        hideReels: true,
        hideJoin: true,
        hideFollow: true,
        hideSponsored: true,
        hidePeopleYouMayKnow: true
    };
    // ==================================================================================

    function hidePost(element, reason) {
        if (element.dataset.hidden) return;
        
        element.dataset.hidden = 'true';
        
        // Create placeholder message - tap to unhide
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            background-color: #3a3b3c;
            color: #b0b3b8;
            padding: 2px 6px;
            margin: 0;
            border-radius: 3px;
            font-size: 10px;
            text-align: center;
            cursor: pointer;
            position: relative;
            z-index: 9999;
            pointer-events: auto;
        `;
        placeholder.textContent = `Hidden: ${reason} (tap to show)`;
        
        // Add click handler to unhide
        placeholder.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Remove placeholder and show post
            placeholder.remove();
            element.style.display = '';
            element.dataset.hidden = 'false';
        });
        
        // Hide original content and insert placeholder
        element.style.display = 'none';
        element.parentNode.insertBefore(placeholder, element);
    }

    function checkPost(post) {
        // Skip if already hidden
        if (post.dataset.hidden) return;

        // Check for Reels: <span class="f1">󲀠</span> (Reels icon)
        if (FILTERS.hideReels) {
            const reelsSpans = post.querySelectorAll('span.f1');
            for (const span of reelsSpans) {
                if (span.textContent.includes('󲀠')) {
                    hidePost(post, 'Reels');
                    return;
                }
            }
        }

        // Check for Join: <span class="f2">Join</span>
        if (FILTERS.hideJoin) {
            const joinSpans = post.querySelectorAll('span.f2');
            for (const span of joinSpans) {
                if (span.textContent.trim() === 'Join') {
                    // Try to find the group name from <span class="f2 a">
                    const nameSpan = post.querySelector('span.f2.a');
                    const name = nameSpan ? nameSpan.textContent.trim() : '';
                    hidePost(post, name ? `Join - ${name}` : 'Join');
                    return;
                }
            }
        }

        // Check for Follow: <span class="f2">Follow</span>
        if (FILTERS.hideFollow) {
            const followSpans = post.querySelectorAll('span.f2');
            for (const span of followSpans) {
                if (span.textContent.trim() === 'Follow') {
                    // Try to find the page/profile name from <span class="f2 a">
                    const nameSpan = post.querySelector('span.f2.a');
                    const name = nameSpan ? nameSpan.textContent.trim() : '';
                    hidePost(post, name ? `Follow - ${name}` : 'Follow');
                    return;
                }
            }
        }

        // Check for Sponsored: <span class="f5">Sponsored...</span>
        if (FILTERS.hideSponsored) {
            const sponsoredSpans = post.querySelectorAll('span.f5');
            for (const span of sponsoredSpans) {
                if (span.textContent.includes('Sponsored')) {
                    hidePost(post, 'Sponsored');
                    return;
                }
            }
        }

        // Check for People You May Know: <span class="f1">People you may know</span>
        if (FILTERS.hidePeopleYouMayKnow) {
            const pymkSpans = post.querySelectorAll('span.f1');
            for (const span of pymkSpans) {
                if (span.textContent.trim() === 'People you may know') {
                    hidePost(post, 'People You May Know');
                    return;
                }
            }
        }
    }

    function scanFeed() {
        // Facebook mobile uses data-tracking-duration-id for posts
        const posts = document.querySelectorAll('[data-tracking-duration-id]');
        posts.forEach(post => checkPost(post));
    }

    // Initial scan
    scanFeed();

    // Watch for any DOM changes and scan
    const observer = new MutationObserver(() => {
        scanFeed();
    });

    // Observe the entire body for maximum coverage
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();