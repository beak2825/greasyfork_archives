// ==UserScript==
// @name         Torn Elimination Countdown Popup (Stable Cross-Tab)
// @namespace    PinkPowerScript
// @version      3.3.0
// @description  Stable draggable Elimination countdown popup with cross-tab sync, tactical alerts + auto-resync
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      PinkPower
// @downloadURL https://update.greasyfork.org/scripts/558717/Torn%20Elimination%20Countdown%20Popup%20%28Stable%20Cross-Tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558717/Torn%20Elimination%20Countdown%20Popup%20%28Stable%20Cross-Tab%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***********************
     * CONFIG
     ***********************/
    const STORAGE_KEY = 'pinkpower_elim_timer';
    const COUNTDOWN_TICK_MS = 1000;
    const SCAN_INTERVAL_MS = 2500;
    const FINAL_PHASE_LOCK = 90; // seconds
    const NOTIFY_ICON = 'https://www.torn.com/favicon.ico';

    /***********************
     * TACTICAL ALERTS
     ***********************/
    const ALERTS = {
        120: { text: '🟡 2 MINUTES UNTIL RESET\nFind targets and prepare attacks' },
        60:  { text: '🟠 1 MINUTE UNTIL RESET\nBegin medding out and staging attacks' },
        30:  { text: '🚨🚨 GO! GO! GO! ATTACK 🚨🚨\nHold targets on LEAVE / MUG / HOSP', notify: true },
        10:  { text: '🚨🚨 10 SECONDS UNTIL RESET 🚨🚨\nHOLD THEM ON LEAVE / MUG / HOSP', notify: true },
        4:   { text: '💥💥 FINISH YOUR ATTACK NOW 💥💥\nHIT LEAVE / MUG / HOSP' },
        0:   { text: '💥💥 ATTACKS OVER 💥💥' }
    };

    let firedAlerts = new Set();
    let lastRemaining = null;

    /***********************
     * STYLES
     ***********************/
    GM_addStyle(`
        #pp-elim-popup {
            position: fixed;
            top: 120px;
            left: calc(100% - 280px);
            background: #111;
            color: #fff;
            padding: 12px 14px;
            border-radius: 14px;
            min-width: 260px;
            z-index: 999999;
            cursor: move;
            user-select: none;
            font-family: Arial, sans-serif;
            border: 2px solid #ff4fd8;
            animation: ppPinkGlow 2s ease-in-out infinite;
        }

        @keyframes ppPinkGlow {
            0%   { box-shadow: 0 0 10px #ff4fd8; }
            50%  { box-shadow: 0 0 22px #ff7ae6; }
            100% { box-shadow: 0 0 10px #ff4fd8; }
        }

        #pp-elim-title { text-align:center; font-size:13px; opacity:0.85; }
        #pp-elim-time  { text-align:center; font-size:34px; font-weight:bold; margin:6px 0; }
        #pp-elim-status {
            text-align:center;
            font-size:12px;
            white-space:pre-line;
        }

        .pp-ok   { color:#4cff4c; }
        .pp-warn { color:#ffcc00; }
        .pp-red  { color:#ff4d4d; }
    `);

    /***********************
     * POPUP
     ***********************/
    const popup = document.createElement('div');
    popup.id = 'pp-elim-popup';
    popup.innerHTML = `
        <div id="pp-elim-title">Elimination Countdown</div>
        <div id="pp-elim-time">--:--</div>
        <div id="pp-elim-status" class="pp-warn">● waiting for Elimination</div>
    `;
    document.body.appendChild(popup);

    const timeEl = popup.querySelector('#pp-elim-time');
    const statusEl = popup.querySelector('#pp-elim-status');

    /***********************
     * DRAGGING
     ***********************/
    let dragging = false, offsetX = 0, offsetY = 0;

    popup.addEventListener('mousedown', e => {
        dragging = true;
        popup.style.right = 'auto';
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
    });

    document.addEventListener('mouseup', () => dragging = false);
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        popup.style.left = (e.clientX - offsetX) + 'px';
        popup.style.top  = (e.clientY - offsetY) + 'px';
    });

    /***********************
     * STORAGE
     ***********************/
    function loadTimer() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    function clearTimer() {
        localStorage.removeItem(STORAGE_KEY);
        lastRemaining = null;
        firedAlerts.clear();
        statusEl.textContent = '● waiting for next cycle';
        statusEl.className = 'pp-warn';
    }

    function saveTimer(seconds) {
        if (lastRemaining !== null && lastRemaining <= FINAL_PHASE_LOCK) return;

        const newEnd = Date.now() + seconds * 1000;
        const existing = loadTimer();

        if (existing && existing.end <= newEnd) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ end: newEnd }));
        firedAlerts.clear();
        statusEl.textContent = '● synced';
        statusEl.className = 'pp-ok';
    }

    /***********************
     * SAFE ELIMINATION SCAN
     ***********************/
    function scanEliminationText() {
        const nodes = document.querySelectorAll('div');

        for (const el of nodes) {
            const txt = el.textContent;
            if (!txt) continue;

            const match = txt.match(
                /lose a life in\s+(\d+)\s+minutes?,?\s*(?:and\s*)?(\d+)\s+seconds/i
            );

            if (!match) continue;

            const seconds = (+match[1] * 60) + +match[2];
            if (seconds > 0 && seconds < 3600) {
                saveTimer(seconds);
                return;
            }
        }
    }

    /***********************
     * COUNTDOWN LOOP
     ***********************/
    setInterval(() => {
        const timer = loadTimer();
        if (!timer) return;

        const remaining = Math.max(0, Math.floor((timer.end - Date.now()) / 1000));
        lastRemaining = remaining;

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (ALERTS[remaining] && !firedAlerts.has(remaining)) {
            firedAlerts.add(remaining);
            const alert = ALERTS[remaining];

            statusEl.textContent = alert.text;
            statusEl.className = remaining <= 30 ? 'pp-red' : 'pp-warn';

            if (alert.notify && Notification.permission === 'granted') {
                new Notification('Torn Elimination', {
                    body: alert.text,
                    icon: NOTIFY_ICON
                });
            }
        }

        // 🔑 CRITICAL FIX: unlock and prepare for next cycle
        if (remaining === 0) {
            clearTimer();
        }

    }, COUNTDOWN_TICK_MS);

    /***********************
     * SAFE PERIODIC RESYNC
     ***********************/
    setInterval(() => {
        scanEliminationText();
    }, SCAN_INTERVAL_MS);

    /***********************
     * INIT
     ***********************/
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    scanEliminationText();
})();
