// ==UserScript==
// @name         Torn Roulette Animation Skip
// @namespace    torn.ducktogo.scripts
// @version      1.0.1
// @description  Instantly skip the roulette wheel animation in Torn City. See results immediately without waiting for the spin to complete.
// @author       ducktogo [3947778]
// @license      MIT
// @match        https://www.torn.com/page.php?sid=roulette
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563783/Torn%20Roulette%20Animation%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/563783/Torn%20Roulette%20Animation%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGetActionHooked = false;
    let animationCallback = null;
    let animationIntervalId = null;
    let isWaitingForResponse = false;
    let responseReceived = null;

    // Hook setInterval EARLY to capture the animation
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        const intervalId = originalSetInterval.call(window, callback, delay, ...args);

        // Roulette animation runs at 60fps (1000/60 ≈ 16.67ms)
        if (delay >= 15 && delay <= 18 && isWaitingForResponse) {
            animationIntervalId = intervalId;
            animationCallback = callback;
            console.log('[RouletteSkip] Captured animation interval:', intervalId);

            // If we already have the response, fast-forward immediately
            if (responseReceived) {
                setTimeout(fastForwardAnimation, 10);
            }
        }

        return intervalId;
    };

    function fastForwardAnimation() {
        if (!animationIntervalId || !animationCallback) {
            console.log('[RouletteSkip] No animation to fast-forward');
            return;
        }

        console.log('[RouletteSkip] Fast-forwarding animation...');

        // Stop the normal interval
        clearInterval(animationIntervalId);

        const startTime = performance.now();
        let iterations = 0;
        const maxIterations = 20000;

        // Simulate time passing for TWEEN.js
        // TWEEN uses timestamps, so we need to advance time
        let fakeTime = Date.now();
        const timeStep = 16.67; // ~60fps worth of time per iteration

        while (iterations < maxIterations) {
            iterations++;
            fakeTime += timeStep;

            // Update TWEEN with advancing time if it exists
            if (window.TWEEN && typeof TWEEN.update === 'function') {
                TWEEN.update(fakeTime);
            }

            // Call the animation callback
            try {
                animationCallback();
            } catch (e) {
                console.error('[RouletteSkip] Animation callback error:', e);
                break;
            }

            // Check if animation completed every 100 iterations
            if (iterations % 100 === 0) {
                // The actual button ID is #repeatTbtn
                // Button is enabled at p == cpCount - 100, but spinning is set false at p == cpCount
                // So we need to run 100+ more iterations after button is enabled
                const repeatBtn = document.getElementById('repeatTbtn');
                if (repeatBtn && !repeatBtn.classList.contains('disabled')) {
                    // Run 150 more iterations to ensure spinning = false is set
                    for (let j = 0; j < 150; j++) {
                        fakeTime += timeStep;
                        if (window.TWEEN && typeof TWEEN.update === 'function') {
                            TWEEN.update(fakeTime);
                        }
                        try {
                            animationCallback();
                        } catch (e) {
                            break;
                        }
                    }
                    console.log('[RouletteSkip] Animation completed after', iterations + 150, 'iterations in', (performance.now() - startTime).toFixed(0), 'ms');
                    break;
                }
            }
        }

        if (iterations >= maxIterations) {
            console.log('[RouletteSkip] Reached max iterations in', (performance.now() - startTime).toFixed(0), 'ms');
        }

        // Cleanup
        animationCallback = null;
        animationIntervalId = null;
        isWaitingForResponse = false;
        responseReceived = null;
    }

    function hookGetAction() {
        if (isGetActionHooked) return;
        if (typeof window.getAction !== 'function') return;

        const originalGetAction = window.getAction;

        window.getAction = function(options) {
            // Only intercept processStakes calls
            if (options?.data?.sid === 'rouletteData' && options?.data?.step === 'processStakes') {
                console.log('[RouletteSkip] Intercepted processStakes call');

                // Mark that we're waiting for response
                isWaitingForResponse = true;
                responseReceived = null;
                animationCallback = null;
                animationIntervalId = null;

                // Wrap the success handler
                const originalSuccess = options.success;

                const modifiedOptions = Object.assign({}, options);
                modifiedOptions.success = function(response) {
                    console.log('[RouletteSkip] Got response:', response);

                    // Store response
                    responseReceived = response;

                    // Call original handler first - this sets theN (winning number)
                    if (originalSuccess) {
                        originalSuccess.call(this, response);
                    }

                    // Fast-forward the animation
                    if (animationCallback && animationIntervalId) {
                        fastForwardAnimation();
                    }
                };

                return originalGetAction.call(this, modifiedOptions);
            }

            return originalGetAction.apply(this, arguments);
        };

        isGetActionHooked = true;
        console.log('[RouletteSkip] getAction hooked successfully');
    }

    function waitForRoulette() {
        const chips = document.querySelectorAll('#chips div.chipCont');
        const hasGetAction = typeof window.getAction === 'function';

        if (chips.length >= 7 && hasGetAction) {
            console.log('[RouletteSkip] Roulette detected, initializing...');
            hookGetAction();
            return;
        }

        setTimeout(waitForRoulette, 300);
    }

    // Start checking for roulette once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForRoulette);
    } else {
        waitForRoulette();
    }

})();
