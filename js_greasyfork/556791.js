// ==UserScript==
// @name         Medium Freedium Reader
// @namespace    https://github.com/DiyRex/UserScripts/Medium-Freedium-Reader
// @version      1.1.0
// @description  Adds "Read Free" button to Medium articles to open them in Freedium
// @author       DiyRex
// @match        https://medium.com/*
// @match        https://*.medium.com/*
// @match        https://towardsdatascience.com/*
// @match        https://levelup.gitconnected.com/*
// @match        https://betterprogramming.pub/*
// @match        https://javascript.plainenglish.io/*
// @match        https://aws.plainenglish.io/*
// @match        https://python.plainenglish.io/*
// @match        https://blog.devops.dev/*
// @match        https://itnext.io/*
// @match        https://awstip.com/*
// @match        https://betterhumans.pub/*
// @match        https://uxdesign.cc/*
// @match        https://entrepreneurshandbook.co/*
// @icon         https://freedium.cfd/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556791/Medium%20Freedium%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/556791/Medium%20Freedium%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for document ready
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Inject styles using GM_addStyle or fallback
    function injectStyles() {
        const css = `
            .freedium-btn {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: #fff !important;
                border: none !important;
                border-radius: 16px !important;
                padding: 4px 10px !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                text-decoration: none !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 4px !important;
                margin-left: 12px !important;
                vertical-align: middle !important;
                transition: all 0.2s ease !important;
                line-height: 1.4 !important;
            }
            .freedium-btn:hover {
                opacity: 0.9 !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4) !important;
            }
            .freedium-float {
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                z-index: 999999 !important;
                padding: 10px 18px !important;
                font-size: 14px !important;
                border-radius: 24px !important;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5) !important;
            }
            .freedium-float:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
            }
        `;

        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // Get base domain for building URLs
    function getBaseDomain() {
        const host = window.location.hostname;
        if (host.includes('medium.com')) {
            return 'https://medium.com';
        }
        return window.location.origin;
    }

    // Check if current page is an article
    function isArticlePage() {
        const path = window.location.pathname;
        return path.match(/-[a-f0-9]{8,}$/i) || path.match(/\/p\/[a-f0-9]+/i);
    }

    // Add floating button on article pages
    function addFloatingButton() {
        if (!isArticlePage()) return;
        if (document.querySelector('.freedium-float')) return;

        const currentUrl = window.location.href.split('?')[0];
        const btn = document.createElement('a');
        btn.className = 'freedium-btn freedium-float';
        btn.href = 'https://freedium.cfd/' + currentUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.innerHTML = '🔓 Read Free';
        btn.title = 'Open in Freedium';
        document.body.appendChild(btn);
    }

    // Add buttons to article cards in feed
    function addFeedButtons() {
        // Find article title links (h2 inside anchor)
        const titleLinks = document.querySelectorAll('a[href*="-"] h2, a[href*="-"] h3');

        titleLinks.forEach(heading => {
            const link = heading.closest('a');
            if (!link) return;

            let href = link.getAttribute('href');
            if (!href || !href.match(/-[a-f0-9]{8,}/i)) return;

            // Build full URL
            if (href.startsWith('/')) {
                href = getBaseDomain() + href;
            }
            href = href.split('?')[0];

            // Find the article container
            const article = link.closest('article') ||
                           link.closest('div[class]')?.parentElement?.parentElement;
            if (!article || article.dataset.freediumDone === '1') return;
            article.dataset.freediumDone = '1';

            // Find the action bar with buttons/icons
            const actionBar = article.querySelector('button[aria-label]')?.closest('div')?.parentElement ||
                             article.querySelector('svg')?.closest('div')?.parentElement?.parentElement;

            if (!actionBar || actionBar.querySelector('.freedium-btn')) return;

            // Create button
            const btn = document.createElement('a');
            btn.className = 'freedium-btn';
            btn.href = 'https://freedium.cfd/' + href;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.innerHTML = '🔓 Free';
            btn.title = 'Read on Freedium';
            btn.onclick = e => e.stopPropagation();

            actionBar.appendChild(btn);
        });
    }

    // Main function
    function init() {
        addFloatingButton();
        addFeedButtons();
    }

    // Start the script
    function start() {
        injectStyles();

        // Initial run with delays to catch dynamic content
        setTimeout(init, 1000);
        setTimeout(init, 2000);
        setTimeout(init, 3500);

        // Watch for dynamic content (Medium is SPA)
        const observer = new MutationObserver(() => {
            clearTimeout(window._freediumTimer);
            window._freediumTimer = setTimeout(init, 600);
        });

        // Start observing when body is available
        function startObserver() {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                setTimeout(startObserver, 100);
            }
        }
        startObserver();

        // Handle SPA navigation
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                document.querySelector('.freedium-float')?.remove();
                // Reset processed flags for new page
                document.querySelectorAll('[data-freedium-done]').forEach(el => {
                    el.removeAttribute('data-freedium-done');
                });
                setTimeout(init, 500);
                setTimeout(init, 1500);
            }
        }, 500);

        console.log('🔓 Medium Freedium Reader v1.1 loaded!');
    }

    // Run when ready
    onReady(start);

})();