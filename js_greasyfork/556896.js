// ==UserScript==
// @name         inddrive&Indian AdvUpdates Auto Bypass
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Automatically bypass safelink verification on indian.advupdates.com
// @author       Shiva
// @match        https://indian.advupdates.com/*
// @match        https://inddrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=advupdates.com
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556896/inddriveIndian%20AdvUpdates%20Auto%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/556896/inddriveIndian%20AdvUpdates%20Auto%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[BYPASS v9] 🚀 LOADED', 'background: #0f0; color: #000; font-weight: bold; padding: 5px;');

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        debug: true,
        clickDelay: 1000
    };

    function log(message, type = 'info') {
        const prefix = '[BYPASS]';
        const emoji = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warn': '⚠️'
        }[type] || 'ℹ️';

        if (CONFIG.debug) {
            console.log(`${prefix} ${emoji}`, message);
        }
    }

    // ========================================
    // CLICK FUNCTION
    // ========================================
    function forceClick(element) {
        if (!element) return false;

        try {
            // Execute onclick attribute if present
            const onclick = element.getAttribute('onclick');
            if (onclick) {
                log('Executing onclick: ' + onclick.substring(0, 80), 'info');
                try {
                    eval(onclick.replace(/^return\s+/, ''));
                } catch (e) {
                    log('onclick eval error: ' + e.message, 'warn');
                }
            }

            // Standard click
            element.click();
            log('✓ Clicked using element.click()', 'success');

            // Dispatch mouse event
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);

            return true;
        } catch (e) {
            log('Click failed: ' + e.message, 'error');
            return false;
        }
    }

    // ========================================
    // FIND AND CLICK IMAGE
    // ========================================
    function findAndClickImage() {
        const patterns = [
            // Specific selectors first
            '#wpsafelinkhuman',
            'a[href="#wpsafegenerate"]',
            'img[alt="CLICK 2X FOR GENERATE LINK"]',
            'img[src*="generate2.png"]',
            'img#image3',
            'img[alt="DOWNLOAD LINK"]',
            'img[src*="target1.png"]',
            // Generic selectors
            'a img',
            'div[onclick] img'
        ];

        for (let pattern of patterns) {
            const elements = document.querySelectorAll(pattern);
            if (elements.length > 0) {
                const element = elements[0];

                // Check if visible
                const style = window.getComputedStyle(element);
                if (style.display === 'none' || style.visibility === 'hidden') {
                    continue;
                }

                // Get parent link if element is an image
                const target = element.tagName === 'IMG' ? element.closest('a') : element;
                const clickTarget = target || element;

                log(`Found element with pattern "${pattern}"`, 'success');
                log(`Element: ${clickTarget.tagName}, id="${clickTarget.id}", alt="${element.alt}"`, 'info');

                if (forceClick(clickTarget)) {
                    return true;
                }
            }
        }

        log('No clickable element found with patterns', 'warn');
        return false;
    }

    // ========================================
    // KILL TIMERS
    // ========================================
    function killAllTimers() {
        log('Killing all page timers...', 'info');
        const highestId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
        log(`Cleared ${highestId} timers`, 'success');
    }

    // ========================================
    // MAIN AUTOMATION
    // ========================================
    log('Starting automation...');

    // Kill timers immediately
    killAllTimers();

    let clickCount = 0;
    const maxClicks = 3;

    function performClick() {
        clickCount++;
        log(`═══════════════════════════════════════`, 'info');
        log(`CLICK ATTEMPT ${clickCount}/${maxClicks}`, 'info');
        log(`═══════════════════════════════════════`, 'info');

        // Kill timers before each click
        killAllTimers();

        if (findAndClickImage()) {
            log(`✅ Click ${clickCount} successful!`, 'success');

            // After 2nd click, try calling wpsafegenerate
            if (clickCount === 2) {
                setTimeout(() => {
                    if (typeof window.wpsafegenerate === 'function') {
                        log('🔧 Calling window.wpsafegenerate()', 'info');
                        try {
                            window.wpsafegenerate();
                            log('✓ Function called', 'success');
                        } catch (e) {
                            log('Function error: ' + e.message, 'warn');
                        }
                    }
                }, 500);
            }

            // Schedule next click or final action
            if (clickCount < maxClicks) {
                const delay = clickCount === 1 ? 2000 : 1000;
                log(`Waiting ${delay}ms before next click...`, 'info');
                setTimeout(performClick, delay);
            } else {
                log('═══════════════════════════════════════', 'success');
                log('🎉 ALL CLICKS COMPLETE!', 'success');
                log('Looking for final redirect link...', 'info');
                log('═══════════════════════════════════════', 'success');

                // Look for final link
                setTimeout(() => {
                    const finalSelectors = [
                        'a[onclick*="safelink_redirect"]',
                        'img#image3',
                        'img[alt="DOWNLOAD LINK"]',
                        'img[src*="target1.png"]'
                    ];

                    for (let selector of finalSelectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            const link = element.tagName === 'IMG' ? element.closest('a') : element;
                            if (link) {
                                log('Found final link!', 'success');

                                if (forceClick(link)) {
                                    // Extract and navigate to URL
                                    setTimeout(() => {
                                        const onclick = link.getAttribute('onclick');
                                        if (onclick) {
                                            const match = onclick.match(/['"]([^'"]*safelink_redirect[^'"]*)['"]/);
                                            if (match && match[1]) {
                                                log('🚀 Navigating to final URL:', 'success');
                                                log(match[1], 'info');
                                                window.location.href = match[1];
                                            }
                                        }
                                    }, 500);
                                }
                                return;
                            }
                        }
                    }

                    log('⚠️ Final link not found - may need manual click', 'warn');
                }, 2000);
            }
        } else {
            log(`❌ Click attempt ${clickCount} failed`, 'error');

            if (clickCount < maxClicks) {
                log('Retrying in 2 seconds...', 'info');
                setTimeout(performClick, 2000);
            } else {
                log('═══════════════════════════════════════', 'error');
                log('❌ All attempts exhausted', 'error');
                log('Please check if buttons are present on page', 'error');
                log('═══════════════════════════════════════', 'error');
            }
        }
    }

    // Start first click after a short delay
    setTimeout(() => {
        log('═══════════════════════════════════════', 'info');
        log('🎬 STARTING BYPASS SEQUENCE', 'info');
        log('═══════════════════════════════════════', 'info');
        performClick();
    }, 1000);

})();
