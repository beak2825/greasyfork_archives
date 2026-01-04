// ==UserScript==
// @name         Ultimate Performance Optimizer (v13.0 - DM in Discord if you want me to make a script)
// @namespace    http://zeta/
// @version      13.0
// @description  A smart, safe, and user-configurable hybrid solution. My Discord username is gugu8_
// @author       Gugu8
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549446/Ultimate%20Performance%20Optimizer%20%28v130%20-%20DM%20in%20Discord%20if%20you%20want%20me%20to%20make%20a%20script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549446/Ultimate%20Performance%20Optimizer%20%28v130%20-%20DM%20in%20Discord%20if%20you%20want%20me%20to%20make%20a%20script%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------------------------------------------------
    // --- USER CONFIGURATION ---
    // -------------------------------------------------------------------------
    const config = {
        logLevel: 3,
        keepAliveInterval: 300000,
        enablePreconnect: true,
        enableWillChange: true,
        lazyLoadMargin: '300px',
        prefetchMargin: '200px',
        enableNetworkThrottling: true,
        enablePrefetching: true
    };

    // -------------------------------------------------------------------------
    // --- GUI AND STYLING ---
    // -------------------------------------------------------------------------
    const style = `
        #upo-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.95);
            border: 2px solid #7952B3;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
            z-index: 99999;
            font-family: sans-serif;
            text-align: center;
            transition: all 0.3s ease;
        }
        #upo-container.hidden {
            display: none;
        }
        #upo-boost-btn {
            background-color: #7952B3;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
            margin-bottom: 10px;
        }
        #upo-boost-btn:not(.disabled):hover {
            background-color: #6a4a9f;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        #upo-boost-btn.disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }
        #upo-boost-btn.boosting {
            background-color: #28a745;
            animation: pulse-boost 1s infinite alternate;
            box-shadow: 0 0 15px rgba(40, 167, 69, 0.8);
        }
        @keyframes pulse-boost {
            from { transform: scale(1); box-shadow: 0 0 15px rgba(40, 167, 69, 0.8); }
            to { transform: scale(1.02); box-shadow: 0 0 20px rgba(40, 167, 69, 1); }
        }
        #upo-disable-btn {
            background: none;
            color: #7952B3;
            border: 1px solid #7952B3;
            padding: 5px 10px;
            font-size: 12px;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
        }
    `;
    GM_addStyle(style);

    // -------------------------------------------------------------------------
    // --- CORE SCRIPT LOGIC (Hybrid Functions) ---
    // -------------------------------------------------------------------------
    let isBoosted = false;
    let upoContainer = null;
    let boostButton = null;
    let lazyObserver = null;
    let prefetchObserver = null;
    let willChangeObserver = null;
    let domObserver = null;

    function log(level, message) {
        if (config.logLevel >= level) {
            const prefix = level === 1 ? 'Error' : level === 2 ? 'Warning' : 'Info';
            const color = level === 1 ? 'color: red' : level === 2 ? 'color: orange' : 'color: #7952B3';
            console.log(`%c[UPO - ${prefix}] ${message}`, color);
        }
    }

    // --- On-Demand Functions (run on button click) ---
    function setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            log(2, 'IntersectionObserver not supported. Skipping lazy loading.');
            return;
        }
        if (lazyObserver) lazyObserver.disconnect();
        lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.getAttribute('data-lazy-src');
                    if (src) {
                        element.src = src;
                        element.removeAttribute('data-lazy-src');
                        log(3, `Lazy-loaded: ${src}`);
                    }
                    observer.unobserve(element);
                }
            });
        }, { rootMargin: config.lazyLoadMargin });
        document.querySelectorAll('[data-lazy-src]').forEach(el => lazyObserver.observe(el));
        log(3, 'Lazy loading initialized.');
    }

    function setupPrefetching() {
        if (!config.enablePrefetching || !('IntersectionObserver' in window)) {
            log(2, 'Prefetching is disabled or not supported.');
            return;
        }
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (config.enableNetworkThrottling && connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            log(3, 'Slow connection detected. Prefetching is disabled.');
            return;
        }
        if (prefetchObserver) prefetchObserver.disconnect();
        prefetchObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    try {
                        const url = new URL(link.href);
                        if (url.hostname === window.location.hostname && !['/logout', '/login', '/account'].some(path => url.pathname.includes(path))) {
                            const prefetchLink = document.createElement('link');
                            prefetchLink.rel = 'prefetch';
                            prefetchLink.href = link.href;
                            document.head.appendChild(prefetchLink);
                            log(3, `Prefetched: ${link.href}`);
                        }
                    } catch (e) {
                        log(1, 'Error prefetching: ' + link.href + ', ' + e);
                    }
                    observer.unobserve(link);
                }
            });
        }, { rootMargin: config.prefetchMargin });
        document.querySelectorAll('a[href]').forEach(link => prefetchObserver.observe(link));
        log(3, 'Prefetching initialized.');
    }

    // --- Continuous Background Functions (run on page load) ---
    function setupPreconnect() {
        if (!config.enablePreconnect) return;
        const preconnectDomains = new Set();
        setTimeout(() => {
            document.querySelectorAll('a[href]').forEach(link => {
                try {
                    const url = new URL(link.href);
                    if (url.origin !== location.origin && !preconnectDomains.has(url.origin)) {
                        const preconnectLink = document.createElement('link');
                        preconnectLink.rel = 'preconnect';
                        preconnectLink.href = url.origin;
                        preconnectLink.crossOrigin = 'anonymous';
                        document.head.appendChild(preconnectLink);
                        preconnectDomains.add(url.origin);
                        log(3, 'Preconnected to domain: ' + url.origin);
                    }
                } catch (e) {}
            });
        }, 2000);
    }

    function setupKeepAlive() {
        if (!config.keepAliveInterval) return;
        setInterval(() => {
            if (navigator.sendBeacon) {
                // Safely send beacon, with a warning if the URL has a query string
                const currentURL = window.location.href;
                if (currentURL.includes('?')) {
                    log(2, `A keep-alive beacon is being sent to a URL with a query string. This could interfere with analytics.`);
                }
                navigator.sendBeacon(currentURL, '');
                log(3, 'Sent keep-alive beacon.');
            }
        }, config.keepAliveInterval);
    }

    function setupWillChange() {
        if (!config.enableWillChange || !('willChange' in document.documentElement.style)) return;
        if (willChangeObserver) willChangeObserver.disconnect();
        willChangeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.style.willChange = entry.isIntersecting ? 'transform, opacity' : 'auto';
            });
        }, { rootMargin: '100px' });
        document.querySelectorAll('a, button, input[type="submit"]').forEach(el => willChangeObserver.observe(el));
        log(3, 'Will-change optimization initialized.');
    }

    function setupDOMObserver() {
        if (domObserver) domObserver.disconnect();
        domObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (lazyObserver) {
                                node.querySelectorAll('[data-lazy-src]').forEach(el => lazyObserver.observe(el));
                            }
                            if (prefetchObserver) {
                                node.querySelectorAll('a[href]').forEach(el => prefetchObserver.observe(el));
                            }
                        }
                    });
                }
            });
        });
        domObserver.observe(document.documentElement, { childList: true, subtree: true });
        log(3, 'DOM MutationObserver started.');
    }

    // -------------------------------------------------------------------------
    // --- MAIN INITIALIZATION & UI SETUP ---
    // -------------------------------------------------------------------------
    function activateBoost() {
        if (isBoosted) return;
        isBoosted = true;

        boostButton.innerText = 'BOOSTING... 🚀';
        boostButton.classList.add('disabled', 'boosting');

        log(3, 'Activating performance boost...');

        setTimeout(() => {
            setupLazyLoading();
            setupPrefetching();
        }, 100);

        setTimeout(() => {
            boostButton.innerText = 'PERFORMANCE OPTIMIZED!';
            boostButton.classList.remove('boosting');
            setTimeout(() => {
                boostButton.innerText = 'BOOST PERFORMANCE';
                boostButton.classList.remove('disabled');
                isBoosted = false;
            }, 1000);
        }, 3000);
    }

    function toggleUIVisibility() {
        upoContainer.classList.toggle('hidden');
    }

    function init() {
        log(3, 'UPO v13.0 - The Smart and Safe Solution is ready! ✅');

        // Check if the current site is blacklisted
        const blacklistedSites = GM_getValue('upo_blacklist', []);
        const currentDomain = window.location.hostname;
        if (blacklistedSites.includes(currentDomain)) {
            log(3, `Site '${currentDomain}' is blacklisted. All continuous optimizations are disabled.`);
            return;
        }

        // Setup continuous background optimizations
        setupPreconnect();
        setupKeepAlive();
        setupWillChange();
        setupDOMObserver();

        // Setup UI
        upoContainer = document.createElement('div');
        upoContainer.id = 'upo-container';
        document.body.appendChild(upoContainer);

        boostButton = document.createElement('button');
        boostButton.id = 'upo-boost-btn';
        boostButton.innerText = 'BOOST PERFORMANCE';
        upoContainer.appendChild(boostButton);

        const disableButton = document.createElement('button');
        disableButton.id = 'upo-disable-btn';
        disableButton.innerText = 'Disable for this Site';
        upoContainer.appendChild(disableButton);

        // Add event listeners
        boostButton.addEventListener('click', activateBoost);
        disableButton.addEventListener('click', () => {
            const list = GM_getValue('upo_blacklist', []);
            if (!list.includes(currentDomain)) {
                list.push(currentDomain);
                GM_setValue('upo_blacklist', list);
                log(3, `Site '${currentDomain}' has been added to the blacklist. Please reload to see the effect.`);
                disableButton.innerText = 'Disabled';
                disableButton.disabled = true;
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                const tagName = e.target.tagName;
                if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;
                toggleUIVisibility();
            }
        });
    }

    // Run the script
    init();

})();