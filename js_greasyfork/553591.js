// ==UserScript==
// @name         CuttLinks.com Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically Clicks
// @author       Shiva
// @match        https://cuttlinks.com/*
// @match        http://cuttlinks.com/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/553591/CuttLinkscom%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/553591/CuttLinkscom%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 CuttLinks Bypass v3.3 FAST Started');

    let timerCompleted = false;
    let processedStates = new Set();

    // Faster element detection
    function findElement(selector) {
        return document.querySelector(selector);
    }

    // Wait for element with shorter timeout
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve) => {
            const element = findElement(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver(() => {
                const el = findElement(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // Detect page state
    function detectPageState() {
        // Priority: Go button after timer
        if (timerCompleted) {
            const goBtn = findElement('#submit-button');
            if (goBtn) {
                const text = goBtn.textContent.toLowerCase().trim();
                if (text.includes('go') || text.includes('->') || text.includes('→')) {
                    return 'STATE_4_GO_BUTTON';
                }
            }
        }

        // State 1: First Continue
        const firstContinue = findElement('#submit-button:not(.g-recaptcha)');
        if (firstContinue && firstContinue.textContent.toLowerCase().includes('continue')) {
            return 'STATE_1_FIRST_CONTINUE';
        }

        // State 2: reCAPTCHA
        const recaptchaBtn = findElement('#submit-button.g-recaptcha');
        if (recaptchaBtn) {
            return 'STATE_2_RECAPTCHA';
        }

        // State 3: Timer (only if not completed)
        if (!timerCompleted) {
            const timerElements = document.querySelectorAll('[id*="timer"], [class*="timer"], [id*="countdown"]');
            for (let elem of timerElements) {
                if (elem.textContent && elem.textContent.match(/\d+/)) {
                    return 'STATE_3_TIMER';
                }
            }
        }

        // Check Go button again
        const goBtn = findElement('#submit-button');
        if (goBtn) {
            const text = goBtn.textContent.toLowerCase().trim();
            if (text.includes('go') || text.includes('->') || text.includes('→')) {
                return 'STATE_4_GO_BUTTON';
            }
        }

        return 'UNKNOWN';
    }

    // State 1: Click Continue (FAST)
    async function handleState1() {
        if (processedStates.has('STATE_1')) return true;

        console.log('📍 STATE 1: Clicking Continue...');

        const button = findElement('#submit-button[type="submit"]:not(.g-recaptcha)') ||
                       await waitForElement('#submit-button[type="submit"]:not(.g-recaptcha)', 2000);

        if (button && button.offsetParent !== null) {
            console.log('✅ Clicking Continue instantly');
            button.click();
            processedStates.add('STATE_1');
            await new Promise(resolve => setTimeout(resolve, 800));
            return true;
        }

        return false;
    }

    // State 2: Handle reCAPTCHA (FAST)
    async function handleState2() {
        if (processedStates.has('STATE_2')) return true;

        console.log('📍 STATE 2: Triggering reCAPTCHA...');

        const button = findElement('#submit-button.g-recaptcha') ||
                       await waitForElement('#submit-button.g-recaptcha', 2000);

        if (button) {
            console.log('✅ reCAPTCHA found - clicking');
            console.log('⚠️  SOLVE RECAPTCHA NOW');

            button.click();
            processedStates.add('STATE_2');

            // Fast monitoring for completion
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    const state = detectPageState();
                    if (state === 'STATE_3_TIMER' || state === 'STATE_4_GO_BUTTON') {
                        console.log('✅ reCAPTCHA solved!');
                        clearInterval(checkInterval);
                        resolve(true);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve(false);
                }, 90000);
            });
        }

        return false;
    }

    // State 3: WAIT for timer naturally (NO MANIPULATION)
    async function handleState3() {
        if (processedStates.has('STATE_3')) return true;

        console.log('📍 STATE 3: Timer detected - monitoring...');

        const timerSelectors = '[id*="timer"], [class*="timer"], [id*="countdown"], [class*="countdown"]';
        const timerElement = findElement(timerSelectors);

        if (timerElement) {
            console.log('⏱️  Waiting for timer to complete naturally...');

            // DO NOT MANIPULATE THE TIMER - just monitor it
            processedStates.add('STATE_3');

            return new Promise((resolve) => {
                let hasReachedZero = false;

                const checkTimer = setInterval(() => {
                    const elem = findElement(timerSelectors);

                    if (!elem) {
                        console.log('✅ Timer disappeared!');
                        timerCompleted = true;
                        clearInterval(checkTimer);
                        resolve(true);
                        return;
                    }

                    const text = elem.textContent;
                    const match = text.match(/\d+/);
                    const value = match ? parseInt(match[0]) : null;

                    if (value !== null) {
                        // Log every second
                        console.log(`⏱️  ${value}s remaining`);

                        if (value <= 0 && !hasReachedZero) {
                            hasReachedZero = true;
                            console.log('✅ Timer complete!');
                            timerCompleted = true;

                            // Wait a bit for Go button to appear
                            setTimeout(() => {
                                clearInterval(checkTimer);
                                resolve(true);
                            }, 500);
                        }
                    }
                }, 1000); // Check every 1 second (natural timing)

                // Safety timeout - 12 seconds max
                setTimeout(() => {
                    console.log('✅ Timer timeout');
                    timerCompleted = true;
                    clearInterval(checkTimer);
                    resolve(true);
                }, 12000);
            });
        }

        return true;
    }

    // State 4: Click Go button (INSTANT)
    async function handleState4() {
        if (processedStates.has('STATE_4')) return true;

        console.log('📍 STATE 4: Finding Go button...');

        // Try immediately first
        let button = findElement('#submit-button');

        // Fast retry loop - 3 attempts with 300ms delays
        for (let i = 0; i < 3 && !button; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            button = findElement('#submit-button');
        }

        if (button && button.offsetParent !== null) {
            const text = button.textContent.toLowerCase().trim();

            if (text.includes('go') || text.includes('->') || text.includes('→')) {
                console.log('✅ Go button found - CLICKING NOW');
                button.click();
                processedStates.add('STATE_4');

                // Fast redirect check
                await new Promise(resolve => setTimeout(resolve, 800));
                findAndRedirect();
                return true;
            }
        }

        // If not found, try broader search
        const allButtons = document.querySelectorAll('button, a');
        for (let btn of allButtons) {
            if (btn.offsetParent !== null) {
                const text = btn.textContent.toLowerCase().trim();
                if (text === 'go' || text.includes('go ->')) {
                    console.log('✅ Go button found (alt) - CLICKING');
                    btn.click();
                    processedStates.add('STATE_4');
                    await new Promise(resolve => setTimeout(resolve, 800));
                    findAndRedirect();
                    return true;
                }
            }
        }

        console.log('❌ Go button not found');
        return false;
    }

    // Find destination (FAST)
    function findAndRedirect() {
        console.log('🔍 Finding destination...');

        const links = document.querySelectorAll('a[href^="http"]');
        for (let link of links) {
            const href = link.href;
            if (!href.includes('cuttlinks.com') &&
                !href.includes('cuty.io') &&
                !href.includes('facebook.com') &&
                !href.includes('google.com') &&
                !href.includes('recaptcha') &&
                link.offsetParent !== null) {
                console.log('✅ Destination found!');
                console.log('🎯 REDIRECTING:', href);
                window.location.href = href;
                return;
            }
        }

        console.log('ℹ️  No auto-redirect found');
    }

    // FAST main loop
    async function main() {
        while (!document.body) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Start faster - only 500ms delay
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('🔄 FAST MODE ACTIVATED (Timer runs naturally)');

        let attempts = 0;
        const maxAttempts = 40;
        let lastState = '';

        while (attempts < maxAttempts) {
            attempts++;

            const state = detectPageState();

            if (state !== lastState) {
                console.log(`\n🔍 ${state}`);
                lastState = state;
            }

            try {
                switch(state) {
                    case 'STATE_1_FIRST_CONTINUE':
                        await handleState1();
                        break;

                    case 'STATE_2_RECAPTCHA':
                        await handleState2();
                        break;

                    case 'STATE_3_TIMER':
                        await handleState3();
                        break;

                    case 'STATE_4_GO_BUTTON':
                        await handleState4();
                        console.log('✅ COMPLETE!');
                        return;

                    case 'UNKNOWN':
                        await new Promise(resolve => setTimeout(resolve, 500));
                        break;
                }
            } catch (error) {
                console.error('❌ Error:', error);
            }

            // Faster loop - 300ms delay
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log('⚠️  Max attempts');
    }

    // Start immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
