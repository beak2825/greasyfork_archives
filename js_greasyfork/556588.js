// ==UserScript==
// @name         Jerry lawson tas tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  'P' to pause/unpause and 'Q' to step one frame.
// @author       Goodnamesaregone
// @match        https://www.doodleslauncher.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556588/Jerry%20lawson%20tas%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/556588/Jerry%20lawson%20tas%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State Variables ---
    let isPaused = false;
    let rAFQueue = [];
    let stepAmount = 1; // New state for multi-stepping
    let animationHandle = null;

    // Store the original requestAnimationFrame and cancelAnimationFrame
    const original_rAF = window.requestAnimationFrame;
    const original_cAF = window.cancelAnimationFrame;

    console.log("[FrameStepper] Initializing requestAnimationFrame hook.");

    // --- 1. Hook requestAnimationFrame (rAF) ---
    window.requestAnimationFrame = function(callback) {
        // If unpaused, call the original rAF immediately.
        if (!isPaused) {
            return original_rAF(callback);
        }

        // If paused, store the callback in the queue.
        rAFQueue.push(callback);
        // Return a simulated handle, which is just the index in the queue.
        return rAFQueue.length - 1;
    };

    // --- 2. Hook cancelAnimationFrame (cAF) ---
    window.cancelAnimationFrame = function(handle) {
        // If unpaused, use the original cAF.
        if (!isPaused) {
            return original_cAF(handle);
        }

        // If paused, mark the callback in the queue as null/undefined to prevent execution.
        if (handle >= 0 && handle < rAFQueue.length) {
            rAFQueue[handle] = null;
        }
    };

    // --- 3. Execution Logic ---

    /**
     * Executes all pending requestAnimationFrame callbacks and then clears the queue.
     * This simulates a single frame step.
     */
    function executeFrame() {
        if (rAFQueue.length === 0) {
            return;
        }

        // Create a copy of the queue and clear the main one immediately.
        // This allows callbacks to call rAF again for the *next* frame without causing infinite loops.
        const callbacksToRun = [...rAFQueue];
        rAFQueue = [];

        // The timestamp provided to rAF callbacks
        const currentTime = performance.now();

        // Run all stored callbacks
        callbacksToRun.forEach(callback => {
            if (typeof callback === 'function') {
                try {
                    callback(currentTime);
                } catch (e) {
                    console.error("[FrameStepper] Error executing rAF callback:", e);
                }
            }
        });

        // After running the frame, we need to check the state again.
        if (!isPaused && rAFQueue.length > 0) {
            // This handles cases where a game loop called rAF again *during* the execution
            // but the system is now unpaused. This is redundant due to the fix below,
            // but kept for completeness of the original logic flow check.
        }
    }


    // --- 4. Key Event Listener ---

    document.addEventListener('keydown', (event) => {
        // Prevent action if in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // 'P' key: Pause/Unpause Toggle
        if (event.key === 'p' || event.key === 'P') {
            isPaused = !isPaused;
            console.log(`[FrameStepper] Paused: ${isPaused}`);
            event.preventDefault(); // Stop default browser actions

            if (!isPaused) {
                // When unpausing, we must execute any waiting frames to kickstart the native loop.
                executeFrame();
                console.log("[FrameStepper] Unpaused, manually executing pending frame(s) to restart native loop.");
            } else {
                // If pausing, we stop the continuous animation flow.
                // Any subsequent rAF calls will be stored in rAFQueue.
            }
        }

        // 'Q' key: Step Frame (only works when paused)
        if ((event.key === 'q' || event.key === 'Q') && isPaused) {
            const steps = Math.max(1, stepAmount); // Ensure at least 1 step
            console.log(`[FrameStepper] Stepping ${steps} frame(s)...`);

            // Loop and execute the frame multiple times based on stepAmount
            for (let i = 0; i < steps; i++) {
                executeFrame();
            }

            event.preventDefault(); // Stop default browser actions
        }
    });

    // --- 5. User Feedback UI (Optional but helpful) ---
    const ui = document.createElement('div');
    ui.id = 'frame-stepper-ui';
    ui.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px 15px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        z-index: 99999;
        transition: background 0.3s;
        border: 2px solid #34D399; /* Tailwind green-400 */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    ui.innerHTML = `
        <span id="fs-status-text" class="font-bold">Frame Stepper: Running</span>

        <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; padding-bottom: 5px; border-bottom: 1px solid #444;">
            <label for="fs-step-amount" style="font-size: 12px; color: #D1D5DB;">Step Size:</label>
            <input id="fs-step-amount" type="number" min="1" value="1"
                   style="width: 50px; background: #222; color: #34D399; border: 1px solid #444; padding: 3px 6px; border-radius: 4px; font-size: 14px; text-align: center;">
        </div>

        <div style="font-size: 10px; margin-top: 8px; color: #9CA3AF;">
            [P] Pause / Unpause | [Q] Step (x<span id="fs-current-steps">1</span>)
        </div>
    `;
    document.documentElement.appendChild(ui);

    const statusText = document.getElementById('fs-status-text');
    const stepInput = document.getElementById('fs-step-amount');
    const currentStepsSpan = document.getElementById('fs-current-steps');

    // Logic to update the step amount from the GUI input
    stepInput.addEventListener('input', () => {
        const newAmount = parseInt(stepInput.value, 10);
        if (newAmount >= 1 && !isNaN(newAmount)) {
            stepAmount = newAmount;
            currentStepsSpan.textContent = stepAmount;
        } else if (newAmount < 1 || isNaN(newAmount)) {
            stepAmount = 1;
            stepInput.value = 1;
            currentStepsSpan.textContent = 1;
        }
        console.log(`[FrameStepper] Step amount set to ${stepAmount}`);
    });

    // Update UI status every 100ms
    setInterval(() => {
        if (isPaused) {
            ui.style.backgroundColor = 'rgba(255, 165, 0, 0.9)'; // Orange when paused
            ui.style.borderColor = '#F59E0B'; // Tailwind amber-500
            statusText.textContent = 'Frame Stepper: PAUSED';
        } else {
            ui.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark when running
            ui.style.borderColor = '#34D399'; // Tailwind green-400
            statusText.textContent = 'Frame Stepper: Running';
        }
    }, 100);

})();