// ==UserScript==
// @name        TikTok Live Auto Like (L-Key Mode + GUI Toggle)
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Simulates pressing the 'L' key to send likes. Includes Toggle Button.
// @author      augesrob aka nitroscar
// @license MIT
// @match       https://www.tiktok.com/*/live*
// @match       https://www.tiktok.com/live/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/558321/TikTok%20Live%20Auto%20Like%20%28L-Key%20Mode%20%2B%20GUI%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558321/TikTok%20Live%20Auto%20Like%20%28L-Key%20Mode%20%2B%20GUI%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const PRESS_INTERVAL = 150;   // How often to press 'L' (in ms)
    const BATCH_SIZE = 60;        // How many likes before resting
    const REST_TIME = 2000;       // Rest time (2 seconds)
    // ---------------------

    let likeCount = 0;
    let totalLikes = 0;
    let isResting = false;
    let isRunning = false;        // Master toggle state
    let timer = null;             // Reference to the active timer

    // --- GUI SETUP ---
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '99999';
    container.style.background = 'rgba(0, 0, 0, 0.8)';
    container.style.color = 'white';
    container.style.padding = '12px';
    container.style.borderRadius = '8px';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '14px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    container.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    document.body.appendChild(container);

    // Status Text
    const statusText = document.createElement('div');
    statusText.innerText = 'Ready to Like';
    container.appendChild(statusText);

    // Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = 'START';
    toggleBtn.style.background = '#28a745'; // Green
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.padding = '8px 12px';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontWeight = 'bold';
    toggleBtn.style.fontSize = '14px';

    toggleBtn.onclick = () => {
        if (isRunning) {
            stopScript();
        } else {
            startScript();
        }
    };
    container.appendChild(toggleBtn);

    // --- LOGIC ---

    function startScript() {
        isRunning = true;
        toggleBtn.innerText = 'STOP';
        toggleBtn.style.background = '#dc3545'; // Red
        statusText.innerText = 'Starting...';
        statusText.style.color = '#00ff00';
        loop();
    }

    function stopScript() {
        isRunning = false;
        clearTimeout(timer); // Kill any pending loop or rest
        toggleBtn.innerText = 'START';
        toggleBtn.style.background = '#28a745'; // Green
        statusText.innerText = `Paused | Total: ${totalLikes}`;
        statusText.style.color = 'white';
        isResting = false; // Reset rest state so it starts fresh next time
    }

    function triggerLike() {
        if (!isRunning || isResting) return;

        // Target the player or body
        const target = document.querySelector('[data-e2e="live-room-player"]') || document.body;

        // Key Event Options
        const keyOptions = {
            key: 'l',
            code: 'KeyL',
            keyCode: 76,
            which: 76,
            bubbles: true,
            cancelable: true,
            view: window
        };

        const keyDown = new KeyboardEvent('keydown', keyOptions);
        const keyUp = new KeyboardEvent('keyup', keyOptions);

        target.dispatchEvent(keyDown);

        // Update Stats
        likeCount++;
        totalLikes++;
        statusText.innerText = `Sending Likes... (${totalLikes})`;

        // Key Up (slightly delayed)
        setTimeout(() => {
            if(isRunning) target.dispatchEvent(keyUp);
        }, 50);

        // Batch Rest Logic
        if (likeCount >= BATCH_SIZE) {
            isResting = true;
            likeCount = 0;
            statusText.innerText = `Resting (2s)... | Total: ${totalLikes}`;
            statusText.style.color = 'orange';

            timer = setTimeout(() => {
                isResting = false;
                if (isRunning) loop(); // Resume loop after rest
            }, REST_TIME);
            return; // Exit here, let the timeout call loop()
        }
    }

    function loop() {
        if (!isRunning) return;

        triggerLike();

        // If we are not resting, schedule next click
        if (!isResting) {
            const randomSpeed = PRESS_INTERVAL + (Math.random() * 100);
            timer = setTimeout(loop, randomSpeed);
        }
    }

    console.log("TikTok L-Key GUI Loaded");

})();