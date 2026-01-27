// ==UserScript==
// @name         TKAUTO
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  Combines v1.6 Timer Sync, Stop Button, and Auto-Check-In for 2cool site.
// @match        https://school.toocooltrafficschool.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564195/TKAUTO.user.js
// @updateURL https://update.greasyfork.org/scripts/564195/TKAUTO.meta.js
// ==/UserScript==

/*INSTRUCTIONS:
  To use this on a different site, change the @match line above.
  Example: @match  *://app.driversed.com/*
*/

(function() {
    'use strict';

    // PERSISTENCE: Using localStorage so the STOP state survives page changes
    let isDisabled = localStorage.getItem('autoSkipDisabled') === 'true';

    // --- 1. Create UI Dashboard (Top Level Only) ---
    if (window.self === window.top) {
        const dashboard = document.createElement('div');
        dashboard.id = 'skip-dash-v16';
        dashboard.style = `
            position: fixed; top: 0; left: 0; width: 100%;
            background: #111; color: #fff; z-index: 2147483647;
            display: flex; justify-content: space-around; align-items: center;
            padding: 10px; font-family: sans-serif;
            border-bottom: 3px solid #f1c40f; box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        `;
        dashboard.innerHTML = `
            <div style="font-weight: bold;">SKIPPER: <span id="dash-status">--</span></div>
            <div style="font-size: 20px;">TOTAL TIME: <span id="dash-timer" style="color: #f1c40f; font-weight: bold;">--:--:--</span></div>
        `;
        document.body.appendChild(dashboard);
        document.body.style.marginTop = '60px';
    }

    // --- 2. THE "STILL HERE" CHECK-IN LOGIC ---
    function handleCheckpoints(doc) {
        // Keywords from your previous script
        const keywords = ["still here", "i'm still here", "stay active", "stay logged in", "yes", "continue"];
        const buttons = doc.querySelectorAll('button, input[type="button"], a, .dismiss-timeout');

        buttons.forEach(btn => {
            const text = (btn.innerText || btn.value || '').trim().toLowerCase();
            // If text matches or has the specific timeout class
            if (keywords.some(k => text.includes(k)) || btn.classList.contains("dismiss-timeout")) {
                // Only click if the button is visible (not hidden behind the scenes)
                if (btn.offsetParent !== null) {
                    console.log(`✅ Auto-clicked checkpoint: "${text}"`);
                    btn.click();
                }
            }
        });
    }

    // --- 3. THE TIMER SYNC LOGIC (Iframe Aware) ---
    function findTimerAcrossFrames(doc) {
        let timer = doc.getElementById('time-in-course') || doc.querySelector('.total-course-time');
        if (timer) return timer.textContent;

        const iframes = doc.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                let frameDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
                let found = findTimerAcrossFrames(frameDoc);
                if (found) return found;
            } catch (e) { /* Cross-origin security block */ }
        }
        return null;
    }

    // --- 4. MAIN LOOP ---
    function mainLoop() {
        if (window.self !== window.top) return;

        const statusText = document.getElementById('dash-status');
        const timerText = document.getElementById('dash-timer');

        // Update Dashboard UI
        const currentTimerVal = findTimerAcrossFrames(document);
        if (currentTimerVal && timerText) timerText.textContent = currentTimerVal.trim();

        if (statusText) {
            statusText.textContent = isDisabled ? 'PAUSED' : 'ACTIVE';
            statusText.style.color = isDisabled ? '#ff4d4d' : '#2ecc71';
        }

        // STEP A: Always handle checkpoints (Still Here checks) regardless of "Stop" button
        handleCheckpoints(document);
        const iframes = document.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                handleCheckpoints(iframes[i].contentDocument || iframes[i].contentWindow.document);
            } catch (e) {}
        }

        // STEP B: Handle Auto-Clicking "Next" (Only if NOT paused)
        if (isDisabled) return;

        const nextBtn = document.getElementById('next-button') || document.getElementById('arrow-next');
        if (nextBtn && !nextBtn.disabled && nextBtn.offsetParent !== null) {
            console.log("Next ready. Skipping...");
            nextBtn.click();
        }
    }

    // Run every 500ms to keep the clock smooth and catch popups quickly
    setInterval(mainLoop, 500);

    // --- 5. PERSISTENT STOP/RESUME BUTTON ---
    if (window.self === window.top) {
        const stopBtn = document.createElement('button');
        stopBtn.style = `
            position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
            color: #fff; border: none; padding: 12px 22px; border-radius: 50px;
            cursor: pointer; font-weight: bold; font-size: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4); transition: 0.3s;
        `;

        const updateBtn = () => {
            stopBtn.textContent = isDisabled ? '▶ RESUME' : '█ STOP';
            stopBtn.style.background = isDisabled ? '#2ecc71' : '#e74c3c';
        };

        stopBtn.onclick = () => {
            isDisabled = !isDisabled;
            localStorage.setItem('autoSkipDisabled', isDisabled);
            updateBtn();
        };

        updateBtn();
        document.body.appendChild(stopBtn);
    }
})();