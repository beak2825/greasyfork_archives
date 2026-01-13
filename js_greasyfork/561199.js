// ==UserScript==
// @name         P3 – Random Eyrie Auto Interaction
// @namespace    p3_random_eyrie_auto
// @version      1.2
// @description  Automatically interacts with Random Eyrie actions on page load and refreshes randomly
// @match        https://pocketpumapets.com/random_eyrie.php*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561199/P3%20%E2%80%93%20Random%20Eyrie%20Auto%20Interaction.user.js
// @updateURL https://update.greasyfork.org/scripts/561199/P3%20%E2%80%93%20Random%20Eyrie%20Auto%20Interaction.meta.js
// ==/UserScript==


(() => {
    'use strict';

    const STATE_KEY = 'p3_random_eyrie_auto_state';
    const DURATION_KEY = 'p3_random_eyrie_duration';
    let wakeLock = null;

    // ---------- STATE ----------
    let state = JSON.parse(localStorage.getItem(STATE_KEY)) || {
        running: false,
        endTime: null
    };

    // ---------- WAKE LOCK ----------
    async function requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('[Random Eyrie] Wake Lock active');
            }
        } catch (e) {
            console.warn('[Random Eyrie] Wake Lock failed', e);
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && state.running) {
            mainLogic();
        }
    });

    // ---------- UI ----------
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: #1f2937;
        color: #fff;
        padding: 8px 12px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: Arial, sans-serif;
    `;

    bar.innerHTML = `
        <strong>Random Eyrie</strong>
        <button id="p3-start">Start</button>
        <button id="p3-stop">Stop</button>
        <label>Duration:
            <input id="p3-duration" type="text" placeholder="HH:MM" style="width:60px">
        </label>
        <span id="p3-countdown">Idle</span>
    `;

    document.body.prepend(bar);
    document.body.style.paddingTop = '48px';

    const startBtn = document.getElementById('p3-start');
    const stopBtn = document.getElementById('p3-stop');
    const durationInput = document.getElementById('p3-duration');
    const countdownEl = document.getElementById('p3-countdown');

    // ---------- RESTORE SAVED DURATION ----------
    const savedDuration = localStorage.getItem(DURATION_KEY);
    if (savedDuration) {
        durationInput.value = savedDuration;
    }

    // ---------- SAVE DURATION ON CHANGE ----------
    durationInput.addEventListener('input', () => {
        localStorage.setItem(DURATION_KEY, durationInput.value.trim());
    });

    // ---------- TIME HELPERS ----------
    function parseDuration(value) {
        const m = value.match(/^(\d+):([0-5]\d)$/);
        if (!m) return null;
        return (parseInt(m[1]) * 60 + parseInt(m[2])) * 60000;
    }

    function format(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${String(Math.floor(s / 3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    }

    // ---------- ACTION ----------
    function clickRandomEyrieAction() {
        const actions = ['Spa Treatment', 'Playtime', 'Give a Treat'];
        const links = [...document.querySelectorAll('div.eyrie_interaction a')]
            .filter(a => actions.includes(a.textContent.trim()));

        if (links.length) {
            const link = links[Math.floor(Math.random() * links.length)];
            console.log('[Random Eyrie] Clicking:', link.textContent.trim());
            window.location.href = link.href;
        }
    }

    // ---------- START ----------
    startBtn.onclick = async () => {
        const dur = parseDuration(durationInput.value);
        if (!dur) {
            alert('Use HH:MM format (example: 02:30)');
            return;
        }

        localStorage.setItem(DURATION_KEY, durationInput.value.trim());

        state.running = true;
        state.endTime = Date.now() + dur;
        localStorage.setItem(STATE_KEY, JSON.stringify(state));

        await requestWakeLock();
        mainLogic();
    };

    // ---------- STOP ----------
    stopBtn.onclick = () => {
        state.running = false;
        state.endTime = null;
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
        countdownEl.textContent = 'Stopped';
        if (wakeLock) wakeLock.release();
    };

    // ---------- COUNTDOWN ----------
    setInterval(() => {
        if (!state.running || !state.endTime) {
            countdownEl.textContent = 'Idle';
            return;
        }

        const remaining = state.endTime - Date.now();
        if (remaining <= 0) {
            stopBtn.onclick();
            countdownEl.textContent = 'Finished';
        } else {
            countdownEl.textContent = `Remaining: ${format(remaining)}`;
        }
    }, 1000);

    // ---------- MAIN ----------
    function mainLogic() {
        if (!state.running || Date.now() >= state.endTime) return;

        clickRandomEyrieAction();

        const delay = (Math.random() * 2 + 4) * 60000;
        setTimeout(() => location.reload(), delay);
    }

    // ---------- AUTO RESUME ----------
    if (state.running && Date.now() < state.endTime) {
        requestWakeLock();
        mainLogic();
    }

})();