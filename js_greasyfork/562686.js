// ==UserScript==
// @name         Stake Reload - Pro HUD with Test Button
// @match        https://stake.com/*
// @grant        none
// @description  reloader
// @run-at       document-idle
// @version 0.0.1.20260114222400
// @namespace https://greasyfork.org/users/1429572
// @downloadURL https://update.greasyfork.org/scripts/562686/Stake%20Reload%20-%20Pro%20HUD%20with%20Test%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/562686/Stake%20Reload%20-%20Pro%20HUD%20with%20Test%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_SEC = 611; 
    const LOCK_KEY = 'stake_bot_master_id';
    const SESSION_ID = Math.random().toString(36).substring(7);
    
    // 1. CREATE ENHANCED HUD
    const hud = document.createElement('div');
    hud.style = "position:fixed; top:20px; right:20px; z-index:10000; background:#1a1c20; border:2px solid #3498db; color:#fff; padding:12px; border-radius:10px; font-family:sans-serif; width:220px; box-shadow: 0px 10px 30px rgba(0,0,0,0.5);";
    hud.innerHTML = `
        <div style="color:#3498db; font-weight:bold; font-size:14px; margin-bottom:8px; display:flex; justify-content:space-between;">
            <span>RELOAD BOT</span>
            <span id="bot-lock-status">🔒</span>
        </div>
        <div id="bot-timer" style="font-size:24px; font-weight:bold; margin-bottom:5px; text-align:center;">--:--</div>
        <div id="bot-status" style="font-size:12px; color:#aaa; text-align:center;">Initializing...</div>
        
        <div style="display:flex; gap:5px; margin-top:10px;">
            <button id="bot-test-btn" style="flex:1; background:#3498db; border:none; color:white; padding:5px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">TEST RUN</button>
            <button id="bot-reset-timer" style="flex:1; background:#444; border:none; color:white; padding:5px; border-radius:4px; cursor:pointer; font-size:11px;">RESET CLOCK</button>
        </div>
        
        <div id="bot-last" style="font-size:10px; color:#666; margin-top:8px; text-align:center;">Last: Never</div>
    `;
    document.body.appendChild(hud);

    // Audio Alert
    const playSuccessSound = () => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(context.destination);
        osc.frequency.setValueAtTime(880, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
        osc.start(); osc.stop(context.currentTime + 0.5);
    };

    const performAction = (text) => {
        const btn = Array.from(document.querySelectorAll('button, [role="button"]'))
                         .find(b => b.innerText.includes(text) && !b.disabled);
        if (btn) {
            btn.click();
            return true;
        }
        return false;
    };

    const runSequence = () => {
        const statusEl = document.getElementById('bot-status');
        statusEl.innerText = "Status: RUNNING...";
        statusEl.style.color = "#f1c40f";

        if (!performAction("Open Dropdown")) {
            statusEl.innerText = "Status: MENU NOT FOUND";
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            performAction("VIP");
            performAction("Claim");
            performAction("Claim Reload");
            
            if (performAction("Done")) {
                obs.disconnect();
                const newTarget = Math.floor(Date.now() / 1000) + INTERVAL_SEC;
                localStorage.setItem('next_reload_time', newTarget);
                document.getElementById('bot-last').innerText = `Last: ${new Date().toLocaleTimeString()}`;
                statusEl.innerText = "Status: SUCCESS!";
                statusEl.style.color = "#2ecc71";
                playSuccessSound();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 45000);
    };

    // 2. BUTTON EVENT LISTENERS
    document.getElementById('bot-test-btn').addEventListener('click', () => {
        console.log("Manual Test Triggered");
        runSequence();
    });

    document.getElementById('bot-reset-timer').addEventListener('click', () => {
        const reset = Math.floor(Date.now() / 1000) + INTERVAL_SEC;
        localStorage.setItem('next_reload_time', reset);
        document.getElementById('bot-status').innerText = "Status: TIMER RESET";
    });

    // 3. MASTER LOOP
    setInterval(() => {
        const masterID = localStorage.getItem(LOCK_KEY);
        if (!masterID || masterID === SESSION_ID) {
            localStorage.setItem(LOCK_KEY, SESSION_ID);
            document.getElementById('bot-lock-status').innerText = "🔒 Master";
        } else {
            document.getElementById('bot-lock-status').innerText = "💤 Standby";
            document.getElementById('bot-timer').innerText = "Inactive";
            return;
        }

        let nextRun = localStorage.getItem('next_reload_time');
        const now = Math.floor(Date.now() / 1000);
        const diff = nextRun - now;

        if (diff <= 0) {
            runSequence();
            localStorage.setItem('next_reload_time', now + INTERVAL_SEC);
        } else {
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            document.getElementById('bot-timer').innerText = `${m}:${s < 10 ? '0' + s : s}`;
            if (diff > 5 && !document.getElementById('bot-status').innerText.includes("SUCCESS")) {
                document.getElementById('bot-status').innerText = "Status: Waiting...";
                document.getElementById('bot-status').style.color = "#aaa";
            }
        }
    }, 1000);

    window.addEventListener('unload', () => {
        if (localStorage.getItem(LOCK_KEY) === SESSION_ID) localStorage.removeItem(LOCK_KEY);
    });

})();