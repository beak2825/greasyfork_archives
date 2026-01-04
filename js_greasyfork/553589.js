// ==UserScript==
// @name         Indian Shortener Bypass - Complete Fixed
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description   automatically bypasses the multi-steps
// @author       shiva
// @match        https://indianshortner.in/*
// @match        https://paidinsurance.in/*
// @match        https://advupdates.com/*
// @match        https://indianshortner.com/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/553589/Indian%20Shortener%20Bypass%20-%20Complete%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/553589/Indian%20Shortener%20Bypass%20-%20Complete%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        debug: true,
        paidInsuranceDelay: 500,
        advUpdatesDelay: 500,
        indianShortnerWait: 10000 // Wait 10 seconds for timer to complete
    };

    function log(message, type = 'info') {
        const prefix = '[BYPASS]';
        const timestamp = new Date().toLocaleTimeString();

        if (CONFIG.debug) {
            const emoji = {
                'info': 'ℹ️',
                'success': '✅',
                'error': '❌',
                'warn': '⚠️'
            }[type] || 'ℹ️';

            console.log(`${prefix} [${timestamp}] ${emoji}`, message);
        }
    }

    // Click with multiple methods
    function forceClick(element) {
        if (!element) return false;

        try {
            element.click();
            log('Clicked using element.click()', 'success');
            return true;
        } catch (e) {
            try {
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                element.dispatchEvent(clickEvent);
                log('Clicked using dispatchEvent', 'success');
                return true;
            } catch (e2) {
                log('Click failed: ' + e2.message, 'error');
                return false;
            }
        }
    }

    // Find and click any clickable image or link
    function findAndClickAnyImage() {
        const clickableImages = document.querySelectorAll('a img, img[onclick], div[onclick] img');
        log(`Found ${clickableImages.length} clickable images on page`, 'info');

        for (let i = 0; i < clickableImages.length; i++) {
            const img = clickableImages[i];
            log(`Image ${i}: src=${img.src.substring(0, 50)}... alt="${img.alt}"`, 'info');
        }

        const patterns = [
            'img[alt*="human" i]',
            'img[alt*="verification" i]',
            'img[alt*="verify" i]',
            'img[alt*="click" i]',
            'img[alt*="download" i]',
            'a > img',
            'div[onclick] img'
        ];

        for (let pattern of patterns) {
            const elements = document.querySelectorAll(pattern);
            if (elements.length > 0) {
                const element = elements[0];
                const parent = element.closest('a') || element.parentElement;
                log(`Trying pattern "${pattern}" - found ${elements.length} elements`, 'info');

                if (parent && forceClick(parent)) {
                    return true;
                }
                if (forceClick(element)) {
                    return true;
                }
            }
        }

        const contentAreas = ['main', 'article', '.entry-content', '.content', 'body'];
        for (let selector of contentAreas) {
            const area = document.querySelector(selector);
            if (area) {
                const firstLink = area.querySelector('a img');
                if (firstLink) {
                    const parent = firstLink.closest('a');
                    log(`Clicking first image in ${selector}`, 'info');
                    if (forceClick(parent || firstLink)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Clear all timers (only for advupdates.com)
    function killAllTimers() {
        log('Clearing all timers on page...', 'info');
        const highestId = setInterval(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
            clearInterval(i);
        }
        log(`Cleared ${highestId} intervals`, 'success');
    }

    // Wait for button text to change from "PLEASE WAIT" to "Get Link"
    function waitForButtonReady(timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkButton = () => {
                const button = document.querySelector('a.get-link, .btn.get-link');

                if (button) {
                    const buttonText = button.textContent.trim();
                    log(`Button found: "${buttonText}"`, 'info');

                    // Check if button says "Get Link" (not "PLEASE WAIT")
                    if (buttonText.toLowerCase().includes('get link')) {
                        log('Button is ready (text changed to "Get Link")', 'success');
                        resolve(button);
                        return;
                    } else if (buttonText.toLowerCase().includes('please wait')) {
                        log(`Button still says "${buttonText}", waiting...`, 'info');
                    }
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error('Button did not become ready within timeout'));
                } else {
                    setTimeout(checkButton, 1000); // Check every second
                }
            };

            checkButton();
        });
    }

    const currentURL = window.location.href;
    log(`Script loaded on: ${currentURL}`);

    // ========== STEP 1: paidinsurance.in (REPLACED WITH YOUR PROVIDED SCRIPT) ==========
    if (currentURL.includes('paidinsurance.in')) {
        // === Begin user's PaidInsurance Auto Click Download script ===

        // Function to find and click the download button
        function clickDownloadButton() {
            // Find the button with class "btn btn-primary" and text "DOWNLOAD LINK"
            const buttons = document.querySelectorAll('button.btn.btn-primary');

            for (let button of buttons) {
                if (button.textContent.trim() === 'DOWNLOAD LINK') {
                    console.log('[PaidInsurance Auto Click] Download button found, clicking...');
                    button.click();
                    return true;
                }
            }

            console.log('[PaidInsurance Auto Click] Download button not found yet');
            return false;
        }

        // Try to click immediately when script runs
        if (clickDownloadButton()) {
            // Successfully clicked - exit this block
        } else {
            // If not found, use MutationObserver to watch for dynamic content
            const observer = new MutationObserver((mutations) => {
                if (clickDownloadButton()) {
                    observer.disconnect(); // Stop observing once clicked
                }
            });

            // Start observing the document body for changes
            try {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } catch (e) {
                console.log('[PaidInsurance Auto Click] Observer failed to start:', e);
            }

            // Fallback: Try clicking after a short delay
            setTimeout(() => {
                if (clickDownloadButton()) {
                    try { observer.disconnect(); } catch (e) {}
                }
            }, 1000);

            // Safety timeout: Stop observing after 10 seconds
            setTimeout(() => {
                try { observer.disconnect(); } catch (e) {}
                console.log('[PaidInsurance Auto Click] Stopped observing after timeout');
            }, 10000);
        }

        // === End user's PaidInsurance Auto Click Download script ===
    }

    // ========== STEP 2: advupdates.com ==========
    else if (currentURL.includes('advupdates.com')) {
        log('STEP 2: advupdates.com detected');

        killAllTimers();

        setTimeout(() => {
            log('Step 2.1: Looking for ANY clickable image/button...', 'info');

            let clickCount = 0;
            let maxClicks = 3;

            const tryClick = () => {
                clickCount++;
                log(`Click attempt ${clickCount}/${maxClicks}`, 'info');

                if (findAndClickAnyImage()) {
                    log(`Click ${clickCount} successful!`, 'success');

                    if (clickCount < maxClicks) {
                        setTimeout(() => {
                            killAllTimers();
                            tryClick();
                        }, clickCount === 1 ? 3000 : 1000);
                    } else {
                        log('All clicks complete! Looking for final link...', 'success');

                        setTimeout(() => {
                            const finalLink = document.getElementById('image3')
                                || document.querySelector('img[alt*="DOWNLOAD" i]')
                                || document.querySelector('a img[id="image3"]');

                            if (finalLink) {
                                const target = finalLink.closest('a') || finalLink;
                                forceClick(target);
                                log('advupdates.com complete!', 'success');
                            } else {
                                log('Final link not found - may need manual click', 'warn');
                            }
                        }, 2000);
                    }
                } else {
                    log(`Click attempt ${clickCount} failed`, 'error');

                    if (clickCount < maxClicks) {
                        setTimeout(tryClick, 2000);
                    } else {
                        log('All attempts exhausted. Check console for available images.', 'error');
                    }
                }
            };

            tryClick();
        }, CONFIG.advUpdatesDelay);
    }

    // ========== STEP 3: indianshortner.com ==========
    else if (currentURL.includes('indianshortner.com')) {
        log('STEP 3: indianshortner.com detected');
        log('Waiting for timer to complete (10 seconds)...', 'info');

        // Wait 10 seconds for the timer to complete
        setTimeout(() => {
            log('Timer wait complete. Looking for "Get Link" button...', 'info');

            // Wait for button text to change from "PLEASE WAIT" to "Get Link"
            waitForButtonReady(15000)
                .then(button => {
                    log(`Button ready! Text: "${button.textContent.trim()}"`, 'success');
                    log('Clicking Get Link button...', 'info');

                    if (forceClick(button)) {
                        log('🎉 BYPASS COMPLETE! Redirecting to final destination...', 'success');
                    } else {
                        log('Click failed, trying alternative method...', 'warn');
                        window.location.href = button.href;
                    }
                })
                .catch(err => {
                    log('Error: ' + err.message, 'error');
                    log('Trying to click button anyway...', 'warn');

                    const button = document.querySelector('a.get-link, .btn.get-link');
                    if (button) {
                        forceClick(button);
                    } else {
                        log('Button not found at all', 'error');
                    }
                });
        }, CONFIG.indianShortnerWait);
    }

})();
