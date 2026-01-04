// ==UserScript==
// @name         SmallShorts Advanced Multi-Step Bypass v3.1
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Complete bypass for SmallShorts
// @author       Shiva
// @match        https://smallshorts.com/*
// @match        https://*.smallshorts.com/*
// @match        https://india.hindivigyan.in/*
// @match        https://*.hindivigyan.in/*
// @match        https://paidinsurance.in/*
// @match        https://*.paidinsurance.in/*
// @match        https://loan.reelwealthreport.com/*
// @match        https://*.reelwealthreport.com/*
// @match        https://ww.smallshorts.com/*
// @match        https://devuploads.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smallshorts.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0-only
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553588/SmallShorts%20Advanced%20Multi-Step%20Bypass%20v31.user.js
// @updateURL https://update.greasyfork.org/scripts/553588/SmallShorts%20Advanced%20Multi-Step%20Bypass%20v31.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const config = {
        debug: true,
        removeOverlays: false,  // DISABLED - was causing errors
        bypassAdblock: true,
        autoNavigate: true,
        removeTimers: true,
        autoClickDelay: 1500,
        maxWaitTime: 30000
    };

    // Track clicked elements
    const clickedElements = new Set();

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function log(message, type = 'info') {
        if (!config.debug) return;
        const prefix = '[SmallShorts v3.1]';
        const timestamp = new Date().toLocaleTimeString();
        switch(type) {
            case 'error': console.error(`${prefix} [${timestamp}] ❌`, message); break;
            case 'warn': console.warn(`${prefix} [${timestamp}] ⚠️`, message); break;
            case 'success': console.log(`%c${prefix} [${timestamp}] ✓ ${message}`, 'color: #00ff00; font-weight: bold'); break;
            case 'click': console.log(`%c${prefix} [${timestamp}] 🖱️ ${message}`, 'color: #00bfff; font-weight: bold'); break;
            default: console.log(`${prefix} [${timestamp}]`, message);
        }
    }

    function getCurrentDomain() {
        return window.location.hostname;
    }

    function clickElement(element, description) {
        if (!element) return false;

        const elementId = element.outerHTML.substring(0, 100);
        if (clickedElements.has(elementId)) {
            log(`Already clicked: ${description}`, 'warn');
            return false;
        }

        try {
            element.click();
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            clickedElements.add(elementId);
            log(`Clicked: ${description}`, 'click');
            return true;
        } catch (e) {
            log(`Failed to click ${description}: ${e.message}`, 'error');
            return false;
        }
    }

    // ============================================
    // ADBLOCK DETECTION BYPASS
    // ============================================
    function bypassAdblockDetection() {
        log('Bypassing adblock detection...');

        // Override common adblock detection properties
        Object.defineProperty(window, 'adsbygoogle', {
            configurable: false,
            get: function() { return [{}]; },
            set: function() { return true; }
        });

        // Mock Google Tag Manager
        window.googletag = window.googletag || {
            cmd: [],
            pubads: function() {
                return {
                    enableSingleRequest: function(){},
                    collapseEmptyDivs: function(){},
                    setTargeting: function(){},
                    enableServices: function(){}
                };
            },
            defineSlot: function() { return { addService: function(){} }; },
            enableServices: function(){},
            display: function(){}
        };

        // Block common anti-adblock scripts
        const blockPatterns = [
            /adblock/i,
            /antiblock/i,
            /blockadblock/i,
            /antiAdBlock/i,
            /detect.*ad/i,
            /cloudflareinsights/i,
            /beacon\.min\.js/i
        ];

        // Override fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && blockPatterns.some(pattern => pattern.test(url))) {
                return Promise.resolve(new Response('{}', { status: 200 }));
            }
            return originalFetch.apply(this, args);
        };

        // Override XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (typeof url === 'string' && blockPatterns.some(pattern => pattern.test(url))) {
                url = 'about:blank';
            }
            return originalOpen.call(this, method, url, ...rest);
        };
    }

    // ============================================
    // TIMER BYPASS
    // ============================================
    function bypassTimers() {
        log('Setting up timer bypass...');

        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;

        // Override setTimeout
        window.setTimeout = function(callback, delay, ...args) {
            if (delay > 3000 && config.removeTimers) {
                log(`Reduced timer from ${delay}ms to 500ms`);
                delay = 500;
            }
            return originalSetTimeout.call(this, callback, delay, ...args);
        };

        // Override setInterval
        window.setInterval = function(callback, delay, ...args) {
            if (delay >= 1000 && delay <= 2000 && config.removeTimers) {
                log(`Reduced interval from ${delay}ms to 500ms`);
                delay = 500;
            }
            return originalSetInterval.call(this, callback, delay, ...args);
        };
    }

    // ============================================
    // SAFE OVERLAY HIDING (NOT REMOVAL)
    // ============================================
    function hideOverlaySafely() {
        try {
            // Just hide the overlay, don't remove it
            const overlay = document.getElementById('overlay');
            if (overlay && overlay.style.display !== 'none') {
                overlay.style.display = 'none';
                log('Hidden overlay (not removed)', 'success');
            }

            // Re-enable scrolling
            if (document.body && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = 'auto';
            }
        } catch (e) {
            // Silently ignore errors
        }
    }

    // ============================================
    // REMOVE ADS SAFELY
    // ============================================
    function removeAdsSafely() {
        try {
            const adSelectors = [
                '[class*="adsbygoogle"]',
                '[id*="div-gpt-ad"]'
            ];

            adSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    try {
                        if (element.parentNode) {
                            element.remove();
                        }
                    } catch (e) {
                        // Silently ignore
                    }
                });
            });
        } catch (e) {
            // Silently ignore
        }
    }

    // ============================================
    // DOMAIN-SPECIFIC HANDLERS
    // ============================================

    // Handler for ww.smallshorts.com - IMPROVED
    async function handleSmallShortsWW() {
        log('Handling ww.smallshorts.com...', 'success');

        // Hide timer elements
        setTimeout(() => {
            const timerElements = document.querySelectorAll('.countdown, .timer, #timer, #countdown');
            timerElements.forEach(el => {
                el.textContent = '0';
                el.style.display = 'none';
            });
        }, 500);

        // Poll for "Get Link" button
        const selectors = [
            'a.get-link',
            '.btn.btn-success.btn-lg.get-link',
            'a[href*="devuploads"]',
            'a.btn.get-link',
            'button.get-link',
            '#get-link',
            'a[class*="get-link"]'
        ];

        let attempts = 0;
        const maxAttempts = 60;

        const checkForButton = setInterval(() => {
            attempts++;

            for (const selector of selectors) {
                const button = document.querySelector(selector);
                if (button) {
                    const isVisible = button.offsetParent !== null;
                    const isEnabled = !button.hasAttribute('disabled') && !button.classList.contains('disabled');

                    if (isVisible) {
                        if (!isEnabled) {
                            button.removeAttribute('disabled');
                            button.classList.remove('disabled');
                        }

                        if (clickElement(button, 'Get Link button')) {
                            clearInterval(checkForButton);
                            log('Successfully navigated to final link!', 'success');
                            return;
                        }
                    }
                }
            }

            if (attempts >= maxAttempts) {
                log('Max attempts reached, button not found', 'error');
                clearInterval(checkForButton);
            }
        }, 500);
    }

    // Handler for india.hindivigyan.in
    async function handleHindivigyan() {
        log('Handling hindivigyan.in...', 'success');

        setTimeout(() => {
            const selectors = ['a.continue-btn', '#continue-btn', 'a[href*="hindivigyan.in"]'];
            for (const sel of selectors) {
                const btn = document.querySelector(sel);
                if (btn) {
                    clickElement(btn, 'Continue button');
                    break;
                }
            }
        }, 1000);

        setTimeout(() => {
            const initialButton = document.getElementById('initialButton');
            if (initialButton) {
                clickElement(initialButton, 'I\'M NOT ROBOT button');
                setTimeout(() => hideOverlaySafely(), 500);
            }
        }, 4000);

        setTimeout(() => {
            const images = document.querySelectorAll('img[alt*="CLICK"], img[alt*="GENERATE"], img[alt*="DOWNLOAD"]');
            images.forEach((img, index) => {
                setTimeout(() => clickElement(img, `Image button ${index + 1}`), index * 1000);
            });
        }, 7000);
    }

    // Handler for paidinsurance.in
    async function handlePaidInsurance() {
        log('Handling paidinsurance.in...', 'success');

        hideOverlaySafely();

        setTimeout(() => {
            const img1 = document.querySelector('img[alt*="CLICK 2X"], img[src*="wp-safelink/assets/2.png"]');
            if (img1 && clickElement(img1, 'First image (GENERATE)')) {
                setTimeout(() => {
                    const img2 = document.querySelector('img[alt*="DOWNLOAD LINK"], img#image3, img[src*="wp-safelink/assets/4.png"]');
                    if (img2 && clickElement(img2, 'Second image (DOWNLOAD)')) {
                        setTimeout(() => {
                            const form = document.getElementById('redirectForm');
                            if (form) {
                                log('Submitting redirect form...', 'success');
                                form.submit();
                            }
                        }, 500);
                    }
                }, 1500);
            }
        }, 1500);
    }

    // Handler for loan.reelwealthreport.com
    async function handleReelWealth() {
        log('Handling reelwealthreport.com...', 'success');

        hideOverlaySafely();

        setTimeout(() => {
            const robotBtn = document.querySelector('button[onclick*="proceedNext"], form#redirectForm button');
            if (robotBtn) clickElement(robotBtn, 'I\'M NOT ROBOT button');
        }, 1500);

        setTimeout(() => {
            const images = document.querySelectorAll('img[alt*="CLICK 2X"], img[alt*="GENERATE"], img[alt*="DOWNLOAD"], img#image3');
            images.forEach((img, index) => {
                setTimeout(() => clickElement(img, `Image ${index + 1}`), index * 1500);
            });
        }, 3500);
    }

    // Handler for main smallshorts.com
    async function handleSmallShorts() {
        log('Handling smallshorts.com...', 'success');

        hideOverlaySafely();

        setTimeout(() => {
            document.querySelectorAll('button[disabled], a[disabled]').forEach(btn => {
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            });

            const continueBtn = document.querySelector('a.continue-btn, button.continue-btn, .get-link, #continue-btn');
            if (continueBtn) clickElement(continueBtn, 'Continue button');
        }, 1500);
    }

    // ============================================
    // SAFE OBSERVER - NO AGGRESSIVE REMOVAL
    // ============================================
    function initSafeObserver() {
        log('Initializing safe observer...');

        let lastCheck = 0;
        const observer = new MutationObserver(() => {
            const now = Date.now();
            if (now - lastCheck > 3000) {
                lastCheck = now;
                hideOverlaySafely();
                removeAdsSafely();
            }
        });

        const observeBody = () => {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                log('Safe observer started', 'success');
            } else {
                setTimeout(observeBody, 100);
            }
        };

        observeBody();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        const domain = getCurrentDomain();
        log(`🚀 Initialized on: ${domain}`, 'success');

        bypassAdblockDetection();
        bypassTimers();

        const onReady = () => {
            hideOverlaySafely();
            removeAdsSafely();
            initSafeObserver();

            // Domain-specific handlers
            if (domain.includes('hindivigyan.in')) {
                handleHindivigyan();
            } else if (domain.includes('paidinsurance.in')) {
                handlePaidInsurance();
            } else if (domain.includes('reelwealthreport.com')) {
                handleReelWealth();
            } else if (domain === 'ww.smallshorts.com') {
                handleSmallShortsWW();
            } else if (domain.includes('smallshorts.com')) {
                handleSmallShorts();
            }

            // Enable buttons periodically
            setInterval(() => {
                document.querySelectorAll('button[disabled], a[disabled]').forEach(btn => {
                    btn.removeAttribute('disabled');
                    btn.classList.remove('disabled');
                });
            }, 3000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                hideOverlaySafely();
                removeAdsSafely();
            }, 1000);
        });
    }

    init();

})();