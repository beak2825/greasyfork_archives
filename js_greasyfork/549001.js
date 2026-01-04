// ==UserScript==
// @name         F**k sticky header
// @name:zh-CN   去你的固定顶栏
// @name:zh-TW   去你的固定頂欄
// @namespace    fuck.sticky.header
// @version      1.3
// @description  Automatically handle sticky/fixed top headers, show/hide based on scroll
// @description:zh-CN  自动处理固定或粘性定位的顶部导航栏，根据滚动状态智能显示/隐藏，提升浏览体验
// @description:zh-TW  自動處理固定或粘性定位的頂部導航欄，根據滾動狀態智能顯示/隱藏，提升瀏覽體驗
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549001/F%2A%2Ak%20sticky%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/549001/F%2A%2Ak%20sticky%20header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration parameters
    const CONFIG = {
        scrollThreshold: 5,        // Minimum scroll distance to trigger action
        topThreshold: 100,         // Top area where header should always show
        transitionDuration: '0.3s', // Animation duration
        maxTopValue: 40,           // Accept elements with top value up to this (pixels)
        observerDebounce: 500      // Debounce time for MutationObserver in ms
    };

    // Global variables
    let headerElements = [];
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let mutationObserver;
    let observerTimeout;

    // Get whitelist from storage
    let whitelist = GM_getValue('whitelist', []);

    // Check if current domain is whitelisted
    function isWhitelisted() {
        const currentDomain = window.location.hostname;
        return whitelist.some(domain => currentDomain.includes(domain));
    }

    // Add current site to whitelist
    function addToWhitelist() {
        const currentDomain = window.location.hostname;
        if (!whitelist.includes(currentDomain)) {
            whitelist.push(currentDomain);
            GM_setValue('whitelist', whitelist);
            alert(`Added ${currentDomain} to whitelist`);
            window.location.reload();
        } else {
            alert(`${currentDomain} is already in whitelist`);
        }
    }

    // Remove current site from whitelist
    function removeFromWhitelist() {
        const currentDomain = window.location.hostname;
        const index = whitelist.indexOf(currentDomain);
        if (index !== -1) {
            whitelist.splice(index, 1);
            GM_setValue('whitelist', whitelist);
            alert(`Removed ${currentDomain} from whitelist`);
            window.location.reload();
        } else {
            alert(`${currentDomain} is not in whitelist`);
        }
    }

    // Register Tampermonkey menu commands
    GM_registerMenuCommand('Add current site to whitelist', addToWhitelist);
    GM_registerMenuCommand('Remove current site from whitelist', removeFromWhitelist);

    // Exit if site is whitelisted
    if (isWhitelisted()) {
        return;
    }

    // Helper function to parse pixel values
    function parsePixelValue(value) {
        if (value && value.endsWith('px')) {
            return parseFloat(value);
        }
        return 0;
    }

    // Check if element is already managed by our script
    function isElementManaged(element) {
        return element.hasAttribute('data-fsh-managed');
    }

    // Mark element as managed by our script
    function markElementAsManaged(element) {
        element.setAttribute('data-fsh-managed', 'true');
    }

    // Detect eligible header elements
    function detectHeaderElements() {
        // Collect all potential header elements
        const candidates = new Set();

        // 1. Add <header> tags
        const headerTags = document.querySelectorAll('header, nav');
        if (headerTags.length > 0) {
            Array.from(headerTags).forEach(el => {
                if (!isElementManaged(el)) candidates.add(el);
            });
        }

        // 2. Add elements with relevant keywords
        const keywords = ['nav', 'banner', 'header'];
        const allElements = document.querySelectorAll('*:not(html, body, style, link, head, meta, form, title)');

        for (const el of allElements) {
            if (isElementManaged(el)) continue;

            const className = typeof el.className === 'string' ? el.className : '';
            const hasKeyword = keywords.some(keyword =>
                (el.id && el.id.toLowerCase().includes(keyword)) ||
                (className && className.toLowerCase().includes(keyword)) ||
                (el.role && el.role.toLowerCase().includes(keyword))
            );

            if (hasKeyword) {
                candidates.add(el);
            }
        }

        // 3. Find full-width elements (100vw) regardless of keywords
        for (const el of allElements) {
            if (isElementManaged(el)) continue;

            const computed = window.getComputedStyle(el);
            const bodyWidth = window.getComputedStyle(document.body).width;
            if (['100vw', bodyWidth].includes(computed.width)) {
                candidates.add(el);
            }
        }

        // Filter to find valid top headers
        const validHeaders = [];
        for (const el of candidates) {
            // Check positioning
            const computed = window.getComputedStyle(el);
            const isStickyOrFixed = computed.position === 'sticky' || computed.position === 'fixed';
            if (!isStickyOrFixed) continue;

            // Check top value (allow small values up to maxTopValue)
            const topValue = parsePixelValue(computed.top);
            if (topValue > CONFIG.maxTopValue) continue;

            // Check visual position and dimensions
            const rect = el.getBoundingClientRect();
            const isWideEnough = rect.width >= window.innerWidth * 0.8 || ['100vw', '100%'].includes(computed.width);
            const isNearTop = rect.top <= CONFIG.topThreshold;
            const isNotBg = Math.max(rect.height, parsePixelValue(computed.height)) < window.innerHeight * 0.5;

            if (isWideEnough && isNearTop && isNotBg) {
                validHeaders.push(el);
                markElementAsManaged(el);
            }
        }

        return validHeaders;
    }

    // Add necessary styles
    function addStyles() {
        // Remove existing style sheet if present
        const existingStyle = document.getElementById('fuck-sticky-header-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const styleSheet = document.createElement('style');
        styleSheet.id = 'fuck-sticky-header-style';

        // Generate unique selectors for all managed elements
        const selectors = headerElements.map(el => {
            if (el.id) return `#${CSS.escape(el.id)}`;
            return Array.from(el.classList).map(cls => `.${CSS.escape(cls)}`).join(', ');
        }).filter(selector => selector).join(', ');

        if (selectors) {
            styleSheet.textContent = `
                ${selectors} {
                    will-change: transform, opacity !important;
                    transition: transform ${CONFIG.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
                                opacity ${CONFIG.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1) !important;
                }

                html {
                    overscroll-behavior-y: contain;
                }

                [data-fsh-managed="true"] {
                    /* Additional styles for managed elements if needed */
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    // Update header visibility
    function updateHeaders(shouldShow) {
        headerElements.forEach(el => {
            if (el.isConnected) { // Check if element is still in DOM
                el.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-100%)';
                el.style.opacity = shouldShow ? '1' : '0';
            }
        });
    }

    // Scroll handler function
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Handle Safari overscroll bounce
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
        const maxValidScrollTop = documentHeight - viewportHeight;
        if (scrollTop < 0 || scrollTop > maxValidScrollTop) return;

        // Calculate scroll difference
        const scrollDiff = scrollTop - lastScrollTop;

        // Only act on significant scroll movements
        if (Math.abs(scrollDiff) >= CONFIG.scrollThreshold) {
            // Special handling for top area
            if (scrollTop <= CONFIG.topThreshold) {
                updateHeaders(true);
            }
            // Show on upward scroll
            else if (scrollDiff < 0) {
                updateHeaders(true);
            }
            // Hide on downward scroll
            else if (scrollDiff > 0) {
                updateHeaders(false);
            }

            // Update last scroll position
            lastScrollTop = scrollTop;
        }
    }

    // Reinitialize headers when DOM changes
    function reinitializeHeaders() {
        // Clear existing timeout if any
        if (observerTimeout) {
            clearTimeout(observerTimeout);
        }

        // Debounce the reinitialization
        observerTimeout = setTimeout(() => {
            // Remove any elements that are no longer in the DOM
            headerElements = headerElements.filter(el => el.isConnected);

            // Detect new header elements
            const newHeaders = detectHeaderElements();

            // Add new headers to our list
            newHeaders.forEach(newHeader => {
                if (!headerElements.includes(newHeader)) {
                    headerElements.push(newHeader);
                }
            });

            // Update styles if we found new headers
            if (newHeaders.length > 0) {
                addStyles();

                // Update initial state for new headers
                const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                updateHeaders(initialScrollTop <= CONFIG.topThreshold);
            }
        }, CONFIG.observerDebounce);
    }

    // Initialize Mutation Observer
    function initMutationObserver() {
        // Disconnect existing observer if any
        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        mutationObserver = new MutationObserver((mutations) => {
            let shouldReinitialize = false;

            for (const mutation of mutations) {
                // Skip mutations caused by our own script
                if (mutation.target.hasAttribute && mutation.target.hasAttribute('data-fsh-managed')) {
                    continue;
                }

                // Check for added nodes
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    shouldReinitialize = true;
                    break;
                }

                // Check for attribute changes that might affect header detection
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    shouldReinitialize = true;
                    break;
                }
            }

            if (shouldReinitialize) {
                reinitializeHeaders();
            }
        });

        // Start observing
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Cleanup function
    function cleanup() {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
        if (observerTimeout) {
            clearTimeout(observerTimeout);
        }

        // Remove our styles and attributes
        const styleSheet = document.getElementById('fuck-sticky-header-style');
        if (styleSheet) {
            styleSheet.remove();
        }

        // Reset managed elements
        headerElements.forEach(el => {
            if (el.isConnected) {
                el.removeAttribute('data-fsh-managed');
                el.style.transform = '';
                el.style.opacity = '';
            }
        });
    }

    // Initialization
    function init() {
        // Get all eligible headers
        headerElements = detectHeaderElements();

        if (headerElements.length === 0) {
            return; // No eligible headers found
        }

        addStyles();
        initMutationObserver();

        // Set initial state
        const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        updateHeaders(initialScrollTop <= CONFIG.topThreshold);

        // Add scroll listener
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScroll);
        }, { passive: true });

        // Cleanup on page unload
        window.addEventListener('unload', cleanup);
    }

    // Initialize when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();