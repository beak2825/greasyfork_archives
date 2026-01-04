// ==UserScript==
// @name         Twitter De-Translate
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Scramble tweets post-Babel style while keeping the art visible
// @author       Nova DasSarma <nova@noblejury.com>
// @license MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551598/Twitter%20De-Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/551598/Twitter%20De-Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage key for detranslated users
    const STORAGE_KEY = 'detranslated_users';

    // Get list of detranslated users from storage
    function getDetranslatedUsers() {
        const stored = GM_getValue(STORAGE_KEY, '[]');
        return new Set(JSON.parse(stored));
    }

    // Save list of detranslated users to storage
    function saveDetranslatedUsers(users) {
        GM_setValue(STORAGE_KEY, JSON.stringify([...users]));
    }

    // Babel-style scrambling function
    function babelScramble(text) {
        const babel = ['ꝁ', 'ꝃ', 'ꝅ', 'ꝇ', 'ꝉ', 'ꝋ', 'ꝍ', 'ꝏ', 'ꝑ', 'ꝓ', 'ꝕ', 'ꝗ', 'ꝙ', 'ꝛ', 'ꝝ', 'ꝟ', 'ꝡ', 'ꝣ', 'ꝥ', 'ꝧ', 'ა', 'ბ', 'გ', 'დ', 'ე', 'ვ', 'ზ', 'თ', 'ი', 'კ', '㍿', '㌀', '㌁', '㌂', '㌃', '㌄', '㌅', '㌆', '㌇', '㌈'];
        return text.split('').map(char => {
            // Match any Unicode letter or CJK character
            if (char.match(/[\p{L}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u)) {
                return babel[Math.floor(Math.random() * babel.length)];
            }
            return char;
        }).join('');
    }

    // Add CSS for the button
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .detranslate-btn {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 0px;
                border-radius: 0px;
                font-size: 13px;
                font-weight: 400;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
                margin-left: 4px;
                vertical-align: middle;
                background-color: transparent;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .detranslate-btn:not(.active) {
                color: rgb(29, 155, 240);
            }
            .detranslate-btn:not(.active):hover {
                text-decoration: underline;
            }
            .detranslate-btn.active {
                color: rgb(147, 51, 234);
            }
            .detranslate-btn.active:hover {
                text-decoration: underline;
            }
            .detranslated-text {
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Extract username from tweet article element
    function getUsernameFromTweet(tweetElement) {
        // Try multiple selectors for username
        const usernameSelectors = [
            'a[href*="/"]:not([href*="/status/"])[role="link"]',
            '[data-testid="User-Name"] a[role="link"]',
            'a[dir="ltr"][role="link"]'
        ];

        for (const selector of usernameSelectors) {
            const links = tweetElement.querySelectorAll(selector);
            for (const link of links) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && !href.includes('/status/') && !href.includes('/photo/')) {
                    const username = href.split('/')[1];
                    if (username && username.length > 0 && username !== 'home' && username !== 'explore') {
                        return '@' + username;
                    }
                }
            }
        }
        return null;
    }

    // Create detranslate button
    function createButton(username, isActive) {
        const btn = document.createElement('button');
        btn.className = 'detranslate-btn' + (isActive ? ' active' : '');
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M15 16l-4 4M11 13h10M20 20l-1-1"/>
            </svg>
            ${isActive ? 'Re-translate' : 'De-translate'}
        `;
        return btn;
    }

    // Process a single tweet
    function processTweet(tweetElement) {
        // Skip if already processed
        if (tweetElement.hasAttribute('data-detranslate-processed')) {
            return;
        }
        tweetElement.setAttribute('data-detranslate-processed', 'true');

        const username = getUsernameFromTweet(tweetElement);
        if (!username) return;

        const detranslatedUsers = getDetranslatedUsers();
        const isDetranslated = detranslatedUsers.has(username);

        // Find the tweet text element
        const textElement = tweetElement.querySelector('[data-testid="tweetText"]');
        if (!textElement) return;

        // Store original text if not already stored
        if (!textElement.hasAttribute('data-original-text')) {
            textElement.setAttribute('data-original-text', textElement.textContent);
        }

        // Apply detranslation if needed
        if (isDetranslated) {
            const originalText = textElement.getAttribute('data-original-text');
            textElement.textContent = babelScramble(originalText);
            textElement.classList.add('detranslated-text');
        }

        // Find where to insert button - look for Grok translation bar or tweet text parent
        let insertLocation = null;

        // First try to find the Grok auto-translate section
        const grokTranslation = tweetElement.querySelector('[aria-label*="Show original"]');
        if (grokTranslation) {
            // Insert next to "Show original" button
            insertLocation = grokTranslation.parentElement;
        } else {
            // Fallback: insert in the header near the username
            insertLocation = tweetElement.querySelector('[data-testid="User-Name"]');
        }

        if (!insertLocation || insertLocation.querySelector('.detranslate-btn')) return;

        // Create and insert button
        const btn = createButton(username, isDetranslated);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const detranslatedUsers = getDetranslatedUsers();
            const wasDetranslated = detranslatedUsers.has(username);

            if (wasDetranslated) {
                detranslatedUsers.delete(username);
            } else {
                detranslatedUsers.add(username);
            }
            saveDetranslatedUsers(detranslatedUsers);

            // Refresh all tweets from this user
            reprocessAllTweets();
        });

        insertLocation.appendChild(btn);
    }

    // Reprocess all tweets (for when toggle changes)
    function reprocessAllTweets() {
        const detranslatedUsers = getDetranslatedUsers();

        // Remove processed flag and reset all tweets
        document.querySelectorAll('[data-detranslate-processed]').forEach(el => {
            el.removeAttribute('data-detranslate-processed');

            // Reset text to original
            const textElement = el.querySelector('[data-testid="tweetText"]');
            if (textElement && textElement.hasAttribute('data-original-text')) {
                const originalText = textElement.getAttribute('data-original-text');
                textElement.textContent = originalText;
                textElement.classList.remove('detranslated-text');
            }

            // Remove existing buttons
            el.querySelectorAll('.detranslate-btn').forEach(btn => btn.remove());
        });

        // Reprocess all visible tweets
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(processTweet);
    }

    // Observe for new tweets
    function observeTimeline() {
        const observer = new MutationObserver((mutations) => {
            const tweets = document.querySelectorAll('article[data-testid="tweet"]');
            tweets.forEach(processTweet);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    addStyles();
    observeTimeline();

    // Process initial tweets after a short delay
    setTimeout(() => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(processTweet);
    }, 1000);

})();