// ==UserScript==
// @name         Push Clock with alerts
// @namespace    damorale.torn.pushclock
// @version      1.1
// @description  Displays a big clock set to Torn server time which gives notifications for push lead alerts, with audible beep.
// @match        *://*.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558613/Push%20Clock%20with%20alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/558613/Push%20Clock%20with%20alerts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLOCK_ID  = 'damorale-torn-push-clock';
    const NOTE_ID   = 'damorale-torn-push-note';

    // Settings (with defaults)
    let notificationsOn = GM_getValue('push_notificationsOn', true);
    let soundOn         = GM_getValue('push_soundOn', true);

    // CSS
    GM_addStyle(`
        #${CLOCK_ID} {
            position: fixed;
            top: 200px;
            right: 25px;
            z-index: 9999;
            padding: 6px 12px;
            font-family: Verdana, Arial, sans-serif;
            font-size: 30px;
            font-weight: bold;
            color: #333;
            background: rgba(255,255,255,0.95);
            border: 1px solid #c9c9c9;
            border-radius: 3px;
            box-shadow: 0 0 3px rgba(0,0,0,0.2);
            pointer-events: none;
        }
        #${NOTE_ID} {
            position: fixed;
            top: 240px; /* ~ clock top + height + margin */
            right: 25px;
            z-index: 9999;
            padding: 4px 10px;
            font-family: Verdana, Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: #222;
            background: rgba(255,255,200,0.95);
            border: 1px solid #d0c060;
            border-radius: 3px;
            box-shadow: 0 0 3px rgba(0,0,0,0.2);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease-out;
        }
    `);

    // --- Menu toggles ---
    function registerMenu() {
        GM_registerMenuCommand(
            `Notifications: ${notificationsOn ? 'ON' : 'OFF'}`,
            () => {
                notificationsOn = !notificationsOn;
                GM_setValue('push_notificationsOn', notificationsOn);
                alert(`Push notifications are now: ${notificationsOn ? 'ON' : 'OFF'}`);
            }
        );
        GM_registerMenuCommand(
            `Sound: ${soundOn ? 'ON' : 'OFF'}`,
            () => {
                soundOn = !soundOn;
                GM_setValue('push_soundOn', soundOn);
                alert(`Push sound is now: ${soundOn ? 'ON' : 'OFF'}`);
            }
        );
    }
    registerMenu();

    // Elements
    function createClockBox() {
        if (!document.getElementById(CLOCK_ID)) {
            const el = document.createElement('div');
            el.id = CLOCK_ID;
            el.textContent = '--:--:--';
            document.body.appendChild(el);
        }
    }

    function createNoteBox() {
        if (!document.getElementById(NOTE_ID)) {
            const el = document.createElement('div');
            el.id = NOTE_ID;
            el.textContent = '';
            document.body.appendChild(el);
        }
    }

    createClockBox();
    createNoteBox();

    const clockEl = document.getElementById(CLOCK_ID);
    const noteEl  = document.getElementById(NOTE_ID);

    // Sound
    let audioCtx = null;
    function ensureAudioContext() {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            audioCtx = new Ctx();
        }
        return audioCtx;
    }

    // Unlock audio on first click
    document.addEventListener('click', () => {
        const ctx = ensureAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }, { once: true });

    function playBeep() {
        if (!soundOn) return;
        const ctx = ensureAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.value = 1000; // Hz
        gain.gain.value = 0.15;     // volume

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.start(now);
        osc.stop(now + 0.12); // 120ms beep
    }

    // helper
    function findServerBox() {
        const nodes = Array.from(document.querySelectorAll('div, span, li, p'));
        return nodes.find(el => el.textContent && el.textContent.includes('Server:')) || null;
    }

    function extractTime(text) {
        const m = text.match(/(\d{2}:\d{2}:\d{2})/);
        return m ? m[1] : null;
    }

    // notification logic
    // diff (seconds before quarter) -> message
    const DIFF_MESSAGES = {
        600: '-10min',
        300: '-5min',
        180: '-3min',
        120: '-2min',
        60:  '-1min',
        45:  '-45sec',
        30:  '-30sec',
        10:  '-10sec',
        2:   '-2sec Go!'
    };

    let lastQuarterIndex = null;
    let firedDiffs = {};
    let hideNoteTimer = null;

    function showNote(msg) {
        if (!notificationsOn) return;
        if (!noteEl) return;

        noteEl.textContent = msg;
        noteEl.style.opacity = '1';

        if (hideNoteTimer) clearTimeout(hideNoteTimer);
        hideNoteTimer = setTimeout(() => {
            noteEl.style.opacity = '0';
        }, 3000);
    }

    function handleNotifications(h, m, s) {
        const totalSec = h * 3600 + m * 60 + s;
        const quarterIndex = Math.floor(totalSec / 900); // 900 = 15 * 60
        const nextQuarterStart = (quarterIndex + 1) * 900;
        const diff = nextQuarterStart - totalSec; // seconds until next :00/:15/:30/:45

        // new quarter -> reset fired flags
        if (quarterIndex !== lastQuarterIndex) {
            lastQuarterIndex = quarterIndex;
            firedDiffs = {};
        }

        if (DIFF_MESSAGES.hasOwnProperty(diff) && !firedDiffs[diff]) {
            firedDiffs[diff] = true;
            showNote(DIFF_MESSAGES[diff]);
            playBeep();
        }
    }

    // Main loop
    let serverBox = null;

    function tick() {
        if (!serverBox || !document.body.contains(serverBox)) {
            serverBox = findServerBox();
            if (!serverBox) return;
        }

        const txt = serverBox.textContent.trim();
        const tStr = extractTime(txt);
        if (!tStr) return;

        // Update big clock
        clockEl.textContent = tStr;

        // Parse time for notifications
        const parts = tStr.split(':');
        if (parts.length !== 3) return;
        const h = Number(parts[0]);
        const m = Number(parts[1]);
        const s = Number(parts[2]);
        if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) return;

        handleNotifications(h, m, s);
    }

    // Run frequently
    setInterval(tick, 200);
})();
