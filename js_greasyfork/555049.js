// ==UserScript==
// @name         P3 - Flowers & Brook Auto Quest
// @namespace    http://tampermonkey.net/
// @version      9.5
// @description  Auto-quest for NPC 5 & 9 with live timer, random 4–8h runs, working manual buttons, smooth UI, and isolated operation
// @match        https://pocketpumapets.com/quest_play.php?npc=5
// @match        https://pocketpumapets.com/quest_play.php?npc=9
// @icon         https://pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555049/P3%20-%20Flowers%20%20Brook%20Auto%20Quest.user.js
// @updateURL https://update.greasyfork.org/scripts/555049/P3%20-%20Flowers%20%20Brook%20Auto%20Quest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL_MS = 5.5 * 60 * 1000;
    const WIGGLE_MS = 15 * 1000;

    const LS_PREFIX = 'p3_auto_quest_';
    const LS_KEY_ACTIVE = LS_PREFIX + 'active';
    const LS_KEY_START = LS_PREFIX + 'start_time';
    const LS_KEY_COUNTS = LS_PREFIX + 'counts';
    const LS_KEY_LAST = LS_PREFIX + 'last';
    const LS_KEY_MAX = LS_PREFIX + 'max_run';
    const LS_KEY_DURATION = LS_PREFIX + 'duration';

    let autoActive = false;
    let startTime = null;
    let intervalId = null;
    let liveTimerId = null;
    let maxRunMs = 0;
    let counts = { started: 0, turnedIn: 0 };
    let lastSuccess = 0;

    /* ---------- HELPERS ---------- */
    function ciIncludes(h, n) {
        return (h || '').toLowerCase().includes((n || '').toLowerCase());
    }

    function findQuestButton(label) {
        return [...document.querySelectorAll('input[type="submit"], button')]
            .filter(b => !b.disabled && ciIncludes(b.value || b.textContent, label))[0] || null;
    }

    function formatTime(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${String(Math.floor(s / 3600)).padStart(2,'0')}:` +
               `${String(Math.floor((s % 3600) / 60)).padStart(2,'0')}:` +
               `${String(s % 60).padStart(2,'0')}`;
    }

    function parseDuration(val) {
        const m = val.match(/^(\d+):([0-5]\d)$/);
        if (!m) return null;
        return (parseInt(m[1]) * 60 + parseInt(m[2])) * 60000;
    }

    async function clickQuestButton(btn) {
        const form = btn.closest('form');
        if (!form) return false;
        try {
            await fetch(form.action, { method: 'POST', body: new FormData(form), credentials: 'include' });
            return true;
        } catch {
            return false;
        }
    }

    /* ---------- LOAD SAVED ---------- */
    counts = JSON.parse(localStorage.getItem(LS_KEY_COUNTS) || '{"started":0,"turnedIn":0}');
    lastSuccess = Number(localStorage.getItem(LS_KEY_LAST) || 0);

    /* ---------- UI ---------- */
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: '#2d3e1f',
        padding: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        zIndex: 99999,
        color: 'white',
        fontWeight: 600
    });

    const startQuestBtn = document.createElement('button');
    startQuestBtn.textContent = 'Start Quest';

    const turnInBtn = document.createElement('button');
    turnInBtn.textContent = 'Turn In Quest';

    const status = document.createElement('span');
    status.textContent = 'Status: Stopped';

    const timerDisplay = document.createElement('span');
    timerDisplay.textContent = 'Time Left: --:--:--';

    const durationInput = document.createElement('input');
    durationInput.type = 'text';
    durationInput.placeholder = 'HH:MM';
    durationInput.style.width = '70px';
    durationInput.value = localStorage.getItem(LS_KEY_DURATION) || '';

    durationInput.oninput = () =>
        localStorage.setItem(LS_KEY_DURATION, durationInput.value.trim());

    const startAutoBtn = document.createElement('button');
    startAutoBtn.textContent = '▶ Start Auto';

    const stopAutoBtn = document.createElement('button');
    stopAutoBtn.textContent = '⏹ Stop Auto';
    stopAutoBtn.disabled = true;

    container.append(
        startQuestBtn,
        turnInBtn,
        status,
        timerDisplay,
        durationInput,
        startAutoBtn,
        stopAutoBtn
    );

    document.body.appendChild(container);
    document.body.style.marginTop = '60px';

    /* ---------- AUTO LOOP ---------- */
    async function autoLoop() {
        if (!autoActive) return;

        if (Date.now() - startTime >= maxRunMs) {
            stopAuto('Time expired');
            return;
        }

        const turnIn = findQuestButton('Turn In Quest');
        if (turnIn && await clickQuestButton(turnIn)) {
            counts.turnedIn++;
            lastSuccess = Date.now();
            save();
            setTimeout(() => location.reload(), 1200);
            return;
        }

        const startQ = findQuestButton('Start Quest');
        if (startQ && await clickQuestButton(startQ)) {
            counts.started++;
            lastSuccess = Date.now();
            save();
            setTimeout(() => location.reload(), 1200);
        }
    }

    function updateUI() {
        if (!autoActive) return;
        const remaining = maxRunMs - (Date.now() - startTime);
        timerDisplay.textContent = `Time Left: ${formatTime(remaining)}`;
        status.textContent = `Turned in ${counts.turnedIn} | Started ${counts.started}`;
    }

    function save() {
        localStorage.setItem(LS_KEY_COUNTS, JSON.stringify(counts));
        localStorage.setItem(LS_KEY_LAST, lastSuccess);
    }

    function startAuto() {
        if (autoActive) return;

        const dur = parseDuration(durationInput.value);
        if (!dur) return alert('Use HH:MM format (example: 06:30)');

        maxRunMs = dur;
        startTime = Date.now();

        localStorage.setItem(LS_KEY_DURATION, durationInput.value.trim());
        localStorage.setItem(LS_KEY_START, startTime);
        localStorage.setItem(LS_KEY_MAX, maxRunMs);
        localStorage.setItem(LS_KEY_ACTIVE, '1');

        autoActive = true;
        startAutoBtn.disabled = true;
        stopAutoBtn.disabled = false;

        liveTimerId = setInterval(updateUI, 1000);
        autoLoop();
        intervalId = setInterval(() =>
            setTimeout(autoLoop, Math.random() * WIGGLE_MS * 2 - WIGGLE_MS),
            CHECK_INTERVAL_MS
        );
    }

    function stopAuto(reason = '') {
        clearInterval(intervalId);
        clearInterval(liveTimerId);

        autoActive = false;
        startAutoBtn.disabled = false;
        stopAutoBtn.disabled = true;

        localStorage.removeItem(LS_KEY_ACTIVE);
        localStorage.removeItem(LS_KEY_START);
        localStorage.removeItem(LS_KEY_MAX);

        timerDisplay.textContent = 'Time Left: --:--:--';
        status.textContent = 'Status: Stopped';

        if (reason) console.log('AutoQuest stopped:', reason);
    }

    /* ---------- RESUME ---------- */
    if (localStorage.getItem(LS_KEY_ACTIVE) === '1') {
        startTime = Number(localStorage.getItem(LS_KEY_START));
        maxRunMs = Number(localStorage.getItem(LS_KEY_MAX));
        if (Date.now() - startTime < maxRunMs) {
            autoActive = true;
            startAutoBtn.disabled = true;
            stopAutoBtn.disabled = false;
            liveTimerId = setInterval(updateUI, 1000);
            autoLoop();
            intervalId = setInterval(() =>
                setTimeout(autoLoop, Math.random() * WIGGLE_MS * 2 - WIGGLE_MS),
                CHECK_INTERVAL_MS
            );
        } else {
            stopAuto('Expired while offline');
        }
    }

    startAutoBtn.onclick = startAuto;
    stopAutoBtn.onclick = () => stopAuto('Stopped by user');
})();
