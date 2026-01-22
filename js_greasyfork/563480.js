// ==UserScript==
// @name         LinkedIn Direct Post Link
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds a direct link icon next to each LinkedIn post to copy the post URL
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563480/LinkedIn%20Direct%20Post%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/563480/LinkedIn%20Direct%20Post%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🔵 LinkedIn Direct Link v3 - Script Starting...');

    let buttonsAdded = 0;

    // Comprehensive function to get the marketing URL
    function getPostUrl(postElement) {
        console.log('🔍 Searching for URL in post:', postElement);

        // Priority 1: Look for the "Copy link to post" in the menu data
        // Sometimes LinkedIn stores the marketing URL in button attributes
        const menuButtons = postElement.querySelectorAll('button[aria-label*="menu"], button[data-dropdown-trigger-id]');
        for (let btn of menuButtons) {
            console.log('Found menu button:', btn);
        }

        // Priority 2: Check all links and log them
        const allLinks = postElement.querySelectorAll('a[href]');
        console.log(`📎 Total links found: ${allLinks.length}`);

        let bestUrl = null;

        for (let link of allLinks) {
            const href = link.href;
            console.log('🔗 Link:', href);

            // Marketing URL format: /posts/username_slug-activity-ID-hash
            if (href.includes('/posts/') && href.includes('activity-') && href.includes('-', href.indexOf('activity-') + 9)) {
                const cleanUrl = href.split('?')[0];
                console.log('✅ FOUND MARKETING URL:', cleanUrl);
                return cleanUrl;
            }

            // Store feed update URL as fallback
            if (href.includes('/feed/update/') && !bestUrl) {
                bestUrl = href.split('?')[0];
            }
        }

        // Priority 3: Try to find in span or text content that might have the URL
        const spans = postElement.querySelectorAll('span[dir="ltr"]');
        for (let span of spans) {
            if (span.textContent.includes('linkedin.com/posts/')) {
                console.log('Found URL in text:', span.textContent);
            }
        }

        if (bestUrl) {
            console.log('✅ Using feed URL as fallback:', bestUrl);
            return bestUrl;
        }

        // Priority 4: Construct from data-urn
        const urn = postElement.getAttribute('data-urn');
        if (urn && urn.includes('activity')) {
            const match = urn.match(/activity[:-](\d+)/);
            if (match) {
                const url = `https://www.linkedin.com/feed/update/urn:li:activity:${match[1]}/`;
                console.log('✅ Constructed feed URL from URN:', url);
                return url;
            }
        }

        console.log('❌ No URL found for this post');
        return null;
    }

    // Create a subtle link button
    function createLinkButton(postUrl) {
        const link = document.createElement('a');
        link.className = 'linkedin-direct-link-btn';
        link.href = postUrl;
        link.innerHTML = '🔗';
        link.title = 'Copy link (click) or open in new tab (middle-click/ctrl-click)';

        // Subtle styling - smaller and less visible
        link.style.cssText = `
            position: absolute !important;
            top: 6px !important;
            right: 90px !important;
            background: rgba(0, 0, 0, 0.05) !important;
            color: rgba(0, 0, 0, 0.6) !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            font-size: 14px !important;
            z-index: 999 !important;
            transition: all 0.2s !important;
            opacity: 0.7 !important;
            text-decoration: none !important;
        `;

        link.onmouseenter = function() {
            this.style.transform = 'scale(1.15)';
            this.style.background = 'rgba(0, 0, 0, 0.1) !important';
            this.style.opacity = '1 !important';
        };

        link.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(0, 0, 0, 0.05) !important';
            this.style.opacity = '0.7 !important';
        };

        link.onclick = function(e) {
            // Allow middle-click and ctrl/cmd-click to open in new tab
            if (e.button === 1 || e.ctrlKey || e.metaKey) {
                return true; // Let the default behavior happen
            }

            // For normal left-click, copy to clipboard
            e.preventDefault();
            e.stopPropagation();

            // Copy to clipboard
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(postUrl);
                console.log('📋 Copied with GM_setClipboard:', postUrl);
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(postUrl);
                console.log('📋 Copied with navigator.clipboard:', postUrl);
            }

            // Show subtle feedback
            const original = this.innerHTML;
            this.innerHTML = '✓';
            this.style.background = '#0a66c2 !important';
            this.style.color = 'white !important';

            setTimeout(() => {
                this.innerHTML = original;
                this.style.background = 'rgba(0, 0, 0, 0.05) !important';
                this.style.color = 'rgba(0, 0, 0, 0.6) !important';
            }, 1200);
        };

        // Handle middle-click specifically
        link.onauxclick = function(e) {
            if (e.button === 1) { // Middle mouse button
                e.stopPropagation();
                window.open(postUrl, '_blank');
                e.preventDefault();
            }
        };

        return link;
    }

    // Add button to post
    function addButtonToPost(post) {
        // Skip if already has button
        if (post.querySelector('.linkedin-direct-link-btn')) {
            return;
        }

        // Make post position relative so absolute positioning works
        if (window.getComputedStyle(post).position === 'static') {
            post.style.position = 'relative';
        }

        const url = getPostUrl(post);
        if (url) {
            const button = createLinkButton(url);
            post.appendChild(button);
            buttonsAdded++;
            console.log(`✅ Button #${buttonsAdded} added to post`);
        }
    }

    // Process all posts
    function processAllPosts() {
        console.log('🔍 Searching for posts...');

        // Try multiple selectors
        const selectors = [
            '[data-urn*="activity"]',
            '.feed-shared-update-v2',
            '[data-id*="urn:li:activity"]',
            'div[class*="feed-shared-update"]'
        ];

        let allPosts = [];
        for (let selector of selectors) {
            const posts = document.querySelectorAll(selector);
            if (posts.length > 0) {
                console.log(`📝 Found ${posts.length} posts with selector: ${selector}`);
                allPosts = posts;
                break;
            }
        }

        if (allPosts.length === 0) {
            console.log('⚠️ No posts found with any selector');
            return;
        }

        allPosts.forEach(post => addButtonToPost(post));
        console.log(`✨ Total buttons added: ${buttonsAdded}`);
    }

    // Initialize
    function init() {
        console.log('🚀 Initializing script...');

        // Wait a bit for page to load
        setTimeout(() => {
            console.log('⏰ Running initial scan...');
            processAllPosts();
        }, 3000);

        // Watch for new posts
        const observer = new MutationObserver(() => {
            processAllPosts();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👀 Observer started, watching for new posts');

        // Also check on scroll
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(processAllPosts, 1000);
        });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Script setup complete');

})();