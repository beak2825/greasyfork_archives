// ==UserScript==
// @name         Reddit Quick Block
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a "block" link to posts in the Reddit feed for quick blocking
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564078/Reddit%20Quick%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/564078/Reddit%20Quick%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isOldReddit = window.location.hostname === 'old.reddit.com';

    function createBlockLink(username) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'block';
        link.className = 'quick-block-link';
        link.style.cssText = `
            margin-left: 6px;
            color: #ff4500;
            font-size: 12px;
            cursor: pointer;
            font-weight: normal;
            text-decoration: none;
        `;
        link.title = `Block u/${username}`;

        link.addEventListener('mouseenter', () => link.style.textDecoration = 'underline');
        link.addEventListener('mouseleave', () => link.style.textDecoration = 'none');

        link.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!confirm(`Block u/${username}?\n\nYou won't see their posts or comments anymore.`)) {
                return;
            }

            link.textContent = 'blocking...';
            link.style.color = '#888';

            try {
                const modhash = await getModhash();

                if (!modhash) {
                    throw new Error('Could not get auth token');
                }

                const response = await fetch('https://www.reddit.com/api/block_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `name=${encodeURIComponent(username)}&uh=${modhash}`,
                    credentials: 'include'
                });

                if (response.ok) {
                    link.textContent = 'blocked ✓';
                    link.style.color = '#228b22';
                    link.style.pointerEvents = 'none';

                    // Fade out the post
                    const post = link.closest('shreddit-post, article, .thing, [data-testid="post-container"]');
                    if (post) {
                        post.style.transition = 'opacity 0.3s';
                        post.style.opacity = '0.3';
                    }
                } else {
                    throw new Error('Block request failed');
                }
            } catch (err) {
                console.error('Reddit Quick Block error:', err);
                link.textContent = 'block';
                link.style.color = '#ff4500';
                window.open(`https://www.reddit.com/user/${username}`, '_blank');
                alert('Could not block directly. Opening profile page - use the "More Options" menu to block.');
            }
        });

        return link;
    }

    async function getModhash() {
        try {
            // Try to get from the page first
            const existing = document.querySelector('input[name="uh"]')?.value;
            if (existing) return existing;

            // Fetch from API
            const response = await fetch('https://www.reddit.com/api/me.json', { credentials: 'include' });
            const data = await response.json();
            return data?.data?.modhash;
        } catch {
            return null;
        }
    }

    function addBlockLinksOldReddit() {
        const posts = document.querySelectorAll('.thing.link:not([data-quick-block])');

        posts.forEach(post => {
            post.setAttribute('data-quick-block', 'true');

            const authorLink = post.querySelector('a.author');
            if (!authorLink) return;

            const username = authorLink.textContent;
            if (!username || username === '[deleted]') return;

            const tagline = post.querySelector('.tagline');
            if (tagline) {
                const blockLink = createBlockLink(username);
                tagline.appendChild(document.createTextNode(' '));
                tagline.appendChild(blockLink);
            }
        });
    }

    function addBlockLinksNewReddit() {
        // Method 1: shreddit-post elements (main feed)
        document.querySelectorAll('shreddit-post:not([data-quick-block])').forEach(post => {
            post.setAttribute('data-quick-block', 'true');

            const username = post.getAttribute('author');
            if (!username || username === '[deleted]') return;

            // Look for the author link/element in various places
            const authorSelectors = [
                `a[href="/user/${username}/"]`,
                `a[href="/user/${username}"]`,
                '[slot="authorName"]',
                'faceplate-hovercard a',
                '.author-name',
                `a[href*="/user/${username}"]`
            ];

            let authorEl = null;
            for (const selector of authorSelectors) {
                authorEl = post.querySelector(selector);
                if (authorEl) break;
            }

            // If we found an author element, add the block link
            if (authorEl && !authorEl.parentNode.querySelector('.quick-block-link')) {
                const blockLink = createBlockLink(username);
                authorEl.insertAdjacentElement('afterend', blockLink);
                return;
            }

            // Fallback: look for any element containing the username text
            const walker = document.createTreeWalker(post, NodeFilter.SHOW_ELEMENT);
            while (walker.nextNode()) {
                const el = walker.currentNode;
                if (el.tagName === 'A' && el.textContent.trim() === `u/${username}`) {
                    if (!el.parentNode.querySelector('.quick-block-link')) {
                        const blockLink = createBlockLink(username);
                        el.insertAdjacentElement('afterend', blockLink);
                    }
                    return;
                }
            }

            // Last resort: add to the post's credit bar area
            const creditBar = post.querySelector('[slot="credit-bar"]');
            if (creditBar && !creditBar.querySelector('.quick-block-link')) {
                const blockLink = createBlockLink(username);
                blockLink.style.marginLeft = '10px';
                creditBar.appendChild(blockLink);
            }
        });

        // Method 2: Regular divs with data-testid (some Reddit views)
        document.querySelectorAll('[data-testid="post-container"]:not([data-quick-block])').forEach(post => {
            post.setAttribute('data-quick-block', 'true');

            const authorLink = post.querySelector('a[href*="/user/"]');
            if (!authorLink) return;

            const usernameMatch = authorLink.href.match(/\/user\/([^/?]+)/);
            if (!usernameMatch) return;

            const username = usernameMatch[1];
            if (username === '[deleted]' || authorLink.parentNode.querySelector('.quick-block-link')) return;

            const blockLink = createBlockLink(username);
            authorLink.insertAdjacentElement('afterend', blockLink);
        });

        // Method 3: Article elements
        document.querySelectorAll('article:not([data-quick-block])').forEach(article => {
            article.setAttribute('data-quick-block', 'true');

            const authorLink = article.querySelector('a[href*="/user/"]');
            if (!authorLink) return;

            const usernameMatch = authorLink.href.match(/\/user\/([^/?]+)/);
            if (!usernameMatch) return;

            const username = usernameMatch[1];
            if (username === '[deleted]' || authorLink.parentNode.querySelector('.quick-block-link')) return;

            const blockLink = createBlockLink(username);
            authorLink.insertAdjacentElement('afterend', blockLink);
        });
    }

    function addBlockLinks() {
        if (isOldReddit) {
            addBlockLinksOldReddit();
        } else {
            addBlockLinksNewReddit();
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBlockLinks);
    } else {
        addBlockLinks();
    }

    // Periodic check for new content (handles infinite scroll and dynamic loading)
    setInterval(addBlockLinks, 1000);

    // Also watch for mutations
    const observer = new MutationObserver(() => {
        clearTimeout(window.quickBlockDebounce);
        window.quickBlockDebounce = setTimeout(addBlockLinks, 150);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Reddit Quick Block v1.1 loaded');
})();