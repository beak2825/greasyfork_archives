// ==UserScript==
// @name         ActivitySimulator Module
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Simulates activity by moving mouse, scrolling, and pressing keys every 60s
// @match        https://www.torn.com/*
// @grant        unsafeWindow
// @license MIT (With Credit)
// @downloadURL https://update.greasyfork.org/scripts/550554/ActivitySimulator%20Module.user.js
// @updateURL https://update.greasyfork.org/scripts/550554/ActivitySimulator%20Module.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const globalWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    let simulationInterval = null;

    function simulateActivity() {
        try {
            // Mouse move
            const mouseEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: Math.floor(Math.random() * 200) + 50,
                clientY: Math.floor(Math.random() * 200) + 50
            });
            document.body.dispatchEvent(mouseEvent);

            // Scroll
            const scrollAmount = Math.floor(Math.random() * 100) + 50;
            window.scrollBy(0, scrollAmount);
            setTimeout(() => window.scrollBy(0, -scrollAmount), 200);

            // Key press
            const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
            const key = keys[Math.floor(Math.random() * keys.length)];
            const keyDown = new KeyboardEvent('keydown', { key, bubbles: true });
            const keyUp = new KeyboardEvent('keyup', { key, bubbles: true });
            document.body.dispatchEvent(keyDown);
            setTimeout(() => document.body.dispatchEvent(keyUp), 50);

            console.log('[ActivitySimulator] Activity simulated');
        } catch (err) {
            console.error('[ActivitySimulator] Error:', err);
        }
    }

    function startSimulation() {
        if (simulationInterval) return;
        simulateActivity();
        simulationInterval = setInterval(simulateActivity, 60 * 1000);
        console.log('[ActivitySimulator] Simulation started');
    }

    function stopSimulation() {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
            console.log('[ActivitySimulator] Simulation stopped');
        }
    }

    function registerModule() {
        console.log('[ActivitySimulator] Attempting to register with framework');

        try {
            const success = globalWindow.TornFramework.registerModule({
                name: 'ActivitySimulator',
                version: '1.5',
                description: 'Keeps you active by simulating user input',
                initialize: startSimulation,
                cleanup: stopSimulation,
                isActive: () => !!simulationInterval
            });

            if (success) {
                console.log('[ActivitySimulator] Successfully registered with framework!');
            } else {
                console.log('[ActivitySimulator] Failed to register with framework');
                startSimulation(); // fallback
            }
        } catch (error) {
            console.log('[ActivitySimulator] Error during registration:', error);
            startSimulation(); // fallback
        }
    }

    // === Wait for framework, same as Test Module ===
    if (globalWindow.TornFramework) {
        if (globalWindow.TornFramework.initialized) {
            registerModule();
        } else {
            const wait = setInterval(() => {
                if (globalWindow.TornFramework && globalWindow.TornFramework.initialized) {
                    clearInterval(wait);
                    registerModule();
                }
            }, 500);
        }
    } else {
        console.log('[ActivitySimulator] TornFramework not found, running standalone');
        startSimulation();
    }
})();
