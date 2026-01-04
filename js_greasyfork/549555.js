// ==UserScript==
// @name         Ultimate Performance Optimizer (Super Optimized)
// @namespace    http://zeta/
// @version      4.2
// @description  A smart, safe, and user-configurable hybrid solution with a synced visual progress bar.
// @author       Gugu8
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549555/Ultimate%20Performance%20Optimizer%20%28Super%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549555/Ultimate%20Performance%20Optimizer%20%28Super%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration and Constants ---
    const UPO_CONFIG_KEY = 'upo_settings';
    const UPO_BLACKLIST_KEY = 'upo_blacklist';
    const BOOST_DURATION = 2250; // The total duration of the boost animation in milliseconds (2.25 seconds)

    const defaultConfig = {
        logLevel: 3, // 1: Error, 2: Warning, 3: Info
        keepAliveInterval: 300000,
        enablePreconnect: true,
        enableWillChange: true,
        lazyLoadMargin: '300px',
        prefetchMargin: '200px',
        enableNetworkThrottling: true,
        enablePrefetching: true
    };

    // --- Logger for Better Debugging ---
    const Logger = {
        log(level, message) {
            if (this.config.logLevel >= level) {
                const prefix = level === 1 ? 'Error' : level === 2 ? 'Warning' : 'Info';
                const color = level === 1 ? 'color: #dc3545' : level === 2 ? 'color: #ffc107' : 'color: #7952B3';
                console.log(`%c[UPO - ${prefix}] ${message}`, color);
            }
        },
        init(config) {
            this.config = config;
        }
    };

    // --- Main UPO Class for Encapsulation ---
    class UltimatePerformanceOptimizer {
        constructor() {
            this.config = this.loadConfig();
            Logger.init(this.config);

            this.isBoosted = false;
            this.lazyObserver = null;
            this.prefetchObserver = null;
            this.willChangeObserver = null;
            this.domObserver = null;
            this.upoContainer = null;
            this.boostButton = null;
            this.boostProgressSpan = null;
            this.boostTextSpan = null;
            this.hideButton = null;
            this.currentDomain = window.location.hostname;
        }

        // --- Core Functions ---
        loadConfig() {
            try {
                const storedConfig = GM_getValue(UPO_CONFIG_KEY, JSON.stringify(defaultConfig));
                return { ...defaultConfig, ...JSON.parse(storedConfig) };
            } catch (e) {
                Logger.log(1, `Failed to load config, using default. Error: ${e.message}`);
                return defaultConfig;
            }
        }

        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) {
                Logger.log(2, 'IntersectionObserver not supported. Skipping lazy loading.');
                return;
            }
            if (this.lazyObserver) this.lazyObserver.disconnect();
            this.lazyObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.getAttribute('data-lazy-src');
                        if (src) {
                            element.src = src;
                            element.removeAttribute('data-lazy-src');
                            Logger.log(3, `Lazy-loaded: ${src}`);
                        }
                        observer.unobserve(element);
                    }
                });
            }, { rootMargin: this.config.lazyLoadMargin });
            this.observeElements('[data-lazy-src]', this.lazyObserver);
            Logger.log(3, 'Lazy loading initialized.');
        }

        setupPrefetching() {
            if (!this.config.enablePrefetching || !('IntersectionObserver' in window)) {
                Logger.log(2, 'Prefetching is disabled or not supported.');
                return;
            }
            if (this.config.enableNetworkThrottling && this.isSlowConnection()) {
                Logger.log(3, 'Slow connection detected. Prefetching is disabled.');
                return;
            }
            if (this.prefetchObserver) this.prefetchObserver.disconnect();
            this.prefetchObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const link = entry.target;
                        this.tryPrefetch(link);
                        observer.unobserve(link);
                    }
                });
            }, { rootMargin: this.config.prefetchMargin });
            this.observeElements('a[href]', this.prefetchObserver);
            Logger.log(3, 'Prefetching initialized.');
        }

        // --- Helper Methods ---
        isSlowConnection() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        }

        tryPrefetch(link) {
            try {
                const url = new URL(link.href, window.location.origin);
                if (url.hostname === window.location.hostname && !['/logout', '/login', '/account'].some(path => url.pathname.includes(path))) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = url.href;
                    document.head.appendChild(prefetchLink);
                    Logger.log(3, `Prefetched: ${url.href}`);
                }
            } catch (e) {
                Logger.log(1, `Error prefetching: ${link.href}, ${e.message}`);
            }
        }

        setupPreconnect() {
            if (!this.config.enablePreconnect) return;
            const preconnectDomains = new Set();
            setTimeout(() => {
                document.querySelectorAll('a[href]').forEach(link => {
                    try {
                        const url = new URL(link.href);
                        if (url.origin !== window.location.origin && !preconnectDomains.has(url.origin)) {
                            const preconnectLink = document.createElement('link');
                            preconnectLink.rel = 'preconnect';
                            preconnectLink.href = url.origin;
                            preconnectLink.crossOrigin = 'anonymous';
                            document.head.appendChild(preconnectLink);
                            preconnectDomains.add(url.origin);
                            Logger.log(3, `Preconnected to domain: ${url.origin}`);
                        }
                    } catch (e) { /* ignore malformed links */ }
                });
            }, 2000);
        }

        setupKeepAlive() {
            if (!this.config.keepAliveInterval) return;
            setInterval(() => {
                if (navigator.sendBeacon) {
                    const currentURL = window.location.href;
                    if (currentURL.includes('?')) {
                        Logger.log(2, 'A keep-alive beacon is being sent to a URL with a query string. This could interfere with analytics.');
                    }
                    navigator.sendBeacon(currentURL, '');
                    Logger.log(3, 'Sent keep-alive beacon.');
                }
            }, this.config.keepAliveInterval);
        }

        setupWillChange() {
            if (!this.config.enableWillChange || !('willChange' in document.documentElement.style)) return;
            if (this.willChangeObserver) this.willChangeObserver.disconnect();
            this.willChangeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.willChange = entry.isIntersecting ? 'transform, opacity' : 'auto';
                });
            }, { rootMargin: '100px' });
            this.observeElements('a, button, input[type="submit"]', this.willChangeObserver);
            Logger.log(3, 'Will-change optimization initialized.');
        }

        setupDOMObserver() {
            if (this.domObserver) this.domObserver.disconnect();
            this.domObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                if (this.lazyObserver) this.observeElements('[data-lazy-src]', this.lazyObserver, node);
                                if (this.prefetchObserver) this.observeElements('a[href]', this.prefetchObserver, node);
                                if (this.willChangeObserver) this.observeElements('a, button, input[type="submit"]', this.willChangeObserver, node);
                            }
                        });
                    }
                });
            });
            this.domObserver.observe(document.documentElement, { childList: true, subtree: true });
            Logger.log(3, 'DOM MutationObserver started.');
        }

        observeElements(selector, observer, root = document) {
            root.querySelectorAll(selector).forEach(el => {
                if (observer.takeRecords().every(record => record.target !== el)) {
                    observer.observe(el);
                }
            });
        }

        // --- UI & Event Handling ---
        createUI() {
            this.upoContainer = document.createElement('div');
            this.upoContainer.id = 'upo-container';
            this.upoContainer.innerHTML = `
                <button id="upo-hide-btn" title="Hide/Show UI (\`)">×</button>
                <button id="upo-boost-btn">
                    <span id="upo-boost-progress"></span>
                    <span id="upo-boost-text">BOOST PERFORMANCE</span>
                </button>
                <button id="upo-disable-btn">Disable for this Site</button>
            `;
            document.body.appendChild(this.upoContainer);

            this.boostButton = document.getElementById('upo-boost-btn');
            this.boostProgressSpan = document.getElementById('upo-boost-progress');
            this.boostTextSpan = document.getElementById('upo-boost-text');
            const disableButton = document.getElementById('upo-disable-btn');
            this.hideButton = document.getElementById('upo-hide-btn');

            this.boostButton.addEventListener('click', () => this.activateBoost());
            disableButton.addEventListener('click', () => this.disableForSite(disableButton));
            this.hideButton.addEventListener('click', () => this.toggleUIVisibility());
            document.addEventListener('keydown', (e) => {
                if (e.key === '`' || e.key === '~') {
                    e.preventDefault();
                    const tagName = e.target.tagName;
                    if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;
                    this.toggleUIVisibility();
                }
            });
        }

        activateBoost() {
            if (this.isBoosted) return;
            this.isBoosted = true;

            const startTime = performance.now();
            const updateInterval = 50;
            let progressInterval;

            // Re-enable the transition for the boost animation
            this.boostProgressSpan.style.transition = `width ${BOOST_DURATION / 1000}s linear`;

            this.boostButton.classList.add('disabled', 'boosting');
            this.boostTextSpan.textContent = `BOOSTING... 0% 🚀`;
            this.boostProgressSpan.style.width = '100%';

            Logger.log(3, 'Activating performance boost...');

            progressInterval = setInterval(() => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(1, elapsed / BOOST_DURATION);
                const currentPercentage = Math.floor(progress * 100);

                this.boostTextSpan.textContent = `BOOSTING... ${currentPercentage}% 🚀`;

                if (currentPercentage >= 100) {
                    clearInterval(progressInterval);
                    this.finishBoost();
                }
            }, updateInterval);

            this.setupLazyLoading();
            this.setupPrefetching();
        }

        finishBoost() {
            this.boostTextSpan.textContent = 'PERFORMANCE OPTIMIZED! ✅';
            this.boostButton.classList.remove('boosting');

            // Wait 1 second to show the final message, then snap back
            setTimeout(() => {
                // Disable transition to make the snap instantaneous
                this.boostProgressSpan.style.transition = 'none';
                this.boostProgressSpan.style.width = '0%';

                // Wait a tiny bit before restoring the transition
                // This ensures the style change is applied before the transition is restored
                setTimeout(() => {
                    this.boostButton.classList.remove('disabled');
                    this.boostTextSpan.textContent = 'BOOST PERFORMANCE';
                    this.isBoosted = false;
                    // The transition will be re-enabled on the next `activateBoost` call
                }, 50);

            }, 1000);
        }

        toggleUIVisibility() {
            this.upoContainer.classList.toggle('hidden');
        }

        disableForSite(button) {
            const list = GM_getValue(UPO_BLACKLIST_KEY, []);
            if (!list.includes(this.currentDomain)) {
                list.push(this.currentDomain);
                GM_setValue(UPO_BLACKLIST_KEY, list);
                Logger.log(3, `Site '${this.currentDomain}' has been added to the blacklist. Please reload to see the effect.`);
                button.innerText = 'Disabled ✅';
                button.disabled = true;
            }
        }

        // --- Main Initialization ---
        init() {
            const blacklistedSites = GM_getValue(UPO_BLACKLIST_KEY, []);
            if (blacklistedSites.includes(this.currentDomain)) {
                Logger.log(3, `Site '${this.currentDomain}' is blacklisted. All optimizations are disabled. 🚫`);
                return;
            }
            Logger.log(3, 'UPO v19.0 - Ready to go! 🎉');

            this.setupPreconnect();
            this.setupKeepAlive();
            this.setupWillChange();
            this.setupDOMObserver();

            this.addStyles();
            this.createUI();
        }

        addStyles() {
            const style = `
                #upo-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: rgba(255, 255, 255, 0.95);
                    border: 2px solid #7952B3;
                    padding: 15px;
                    padding-top: 40px;
                    border-radius: 8px;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
                    z-index: 99999;
                    font-family: sans-serif;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                #upo-container.hidden {
                    transform: translateY(200%);
                    opacity: 0;
                    pointer-events: none;
                }
                #upo-hide-btn {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: none;
                    border: none;
                    color: #7952B3;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 1;
                    padding: 0;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                #upo-hide-btn:hover {
                    transform: scale(1.2);
                }

                #upo-boost-btn {
                    position: relative;
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
                    overflow: hidden;
                    transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
                    margin-bottom: 10px;
                }

                #upo-boost-progress {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 0%;
                    background-color: #28a745;
                    /* The transition is now controlled by JS */
                    z-index: 1;
                }

                #upo-boost-text {
                    position: relative;
                    z-index: 2;
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
        }
    }

    const upo = new UltimatePerformanceOptimizer();
    upo.init();
})();