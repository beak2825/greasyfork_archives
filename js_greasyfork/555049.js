// ==UserScript==
// @name         P3 - Flowers & Brook Auto Quest
// @namespace    http://tampermonkey.net/
// @version      9.6
// @description  Auto-quest for NPC 5 & 9 with live timer, random 4–8h runs, working manual buttons, smooth UI, and isolated operation
// @match        https://pocketpumapets.com/quest_play.php?npc=5
// @match        https://pocketpumapets.com/quest_play.php?npc=9
// @icon         https://pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555049/P3%20-%20Flowers%20%20Brook%20Auto%20Quest.user.js
// @updateURL https://update.greasyfork.org/scripts/555049/P3%20-%20Flowers%20%20Brook%20Auto%20Quest.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------------- CONFIG ---------------- */

    const REFRESH_MIN = 30 * 1000;
    const REFRESH_MAX = 45 * 1000;
    const FAILSAFE_REFRESH = 3 * 60 * 1000;

    const LS = {
        active: 'p3_auto_quest_active',
        start: 'p3_auto_quest_start',
        max: 'p3_auto_quest_max',
        counts: 'p3_auto_quest_counts',
        last: 'p3_auto_quest_last',
        duration: 'p3_auto_quest_duration'
    };

    let autoActive = false;
    let startTime = 0;
    let maxRunMs = 0;
    let liveTimerId = null;
    let counts = { started: 0, turnedIn: 0 };
    let lastSuccess = 0;
    let wakeLock = null;

    /* ---------------- WAKE LOCK ---------------- */

    async function requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('[AutoQuest] Wake Lock active');
            }
        } catch (e) {
            console.warn('[AutoQuest] Wake Lock failed', e);
        }
    }

    function releaseWakeLock() {
        try {
            if (wakeLock) wakeLock.release();
        } catch {}
        wakeLock = null;
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && autoActive) {
            autoOnce();
        }
    });

    /* ---------------- HELPERS ---------------- */

    const rand = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    function findButton(label) {
        return [...document.querySelectorAll('input[type="submit"], button')]
            .find(b =>
                !b.disabled &&
                b.offsetParent !== null &&
                (b.value || b.textContent || '')
                    .toLowerCase()
                    .includes(label.toLowerCase())
            );
    }

    function parseDuration(v) {
        const m = v.match(/^(\d+):([0-5]\d)$/);
        if (!m) return null;
        return (Number(m[1]) * 60 + Number(m[2])) * 60000;
    }

    function format(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2,'0')}m ${String(s % 60).padStart(2,'0')}s`;
    }

    async function clickButton(btn) {
        const form = btn.closest('form');
        if (!form) return false;
        try {
            await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                credentials: 'include'
            });
            return true;
        } catch {
            return false;
        }
    }

    function save() {
        localStorage.setItem(LS.counts, JSON.stringify(counts));
        localStorage.setItem(LS.last, lastSuccess);
    }

    function load() {
        counts = JSON.parse(localStorage.getItem(LS.counts) || '{"started":0,"turnedIn":0}');
        lastSuccess = Number(localStorage.getItem(LS.last) || 0);
    }

    /* ---------------- UI ---------------- */

    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        background: #2d3e1f;
        color: #fff;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    `;

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶ Start Auto-Quest';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹ Stop Auto-Quest';
    stopBtn.disabled = true;

    const durationInput = document.createElement('input');
    durationInput.placeholder = 'HH:MM';
    durationInput.style.width = '70px';
    durationInput.value = localStorage.getItem(LS.duration) || '';
    durationInput.oninput = () =>
        localStorage.setItem(LS.duration, durationInput.value);

    const status = document.createElement('span');
    const timer = document.createElement('span');

    bar.append(startBtn, stopBtn, durationInput, status, timer);
    document.body.appendChild(bar);
    document.body.style.marginTop = '55px';

    /* ---------------- CORE ---------------- */

    function scheduleRefresh() {
        const delay = rand(REFRESH_MIN, REFRESH_MAX);
        setTimeout(() => location.reload(), delay);
    }

    function scheduleFailsafe() {
        setTimeout(() => location.reload(), FAILSAFE_REFRESH);
    }

    async function autoOnce() {
        if (!autoActive) return;

        if (Date.now() - startTime >= maxRunMs) {
            stopAuto('Duration reached');
            return;
        }

        const turnIn = findButton('Turn In Quest');
        if (turnIn && await clickButton(turnIn)) {
            counts.turnedIn++;
            lastSuccess = Date.now();
            save();
            setTimeout(() => location.reload(), 1200);
            return;
        }

        const startQ = findButton('Start Quest');
        if (startQ && await clickButton(startQ)) {
            counts.started++;
            lastSuccess = Date.now();
            save();
            setTimeout(() => location.reload(), 1200);
            return;
        }

        scheduleRefresh();
    }

    function updateUI() {
        if (!autoActive) return;
        status.textContent = `Started: ${counts.started} | Turned in: ${counts.turnedIn}`;
        timer.textContent = `Time Left: ${format(maxRunMs - (Date.now() - startTime))}`;
    }

    function startAuto() {
        const dur = parseDuration(durationInput.value);
        if (!dur) return alert('Use HH:MM (example 06:00)');

        startTime = Date.now();
        maxRunMs = dur;
        autoActive = true;

        localStorage.setItem(LS.active, '1');
        localStorage.setItem(LS.start, startTime);
        localStorage.setItem(LS.max, maxRunMs);

        startBtn.disabled = true;
        stopBtn.disabled = false;

        load();
        requestWakeLock();
        liveTimerId = setInterval(updateUI, 1000);

        scheduleFailsafe();
        autoOnce();
    }

    function stopAuto(reason) {
        autoActive = false;
        clearInterval(liveTimerId);
        releaseWakeLock();

        startBtn.disabled = false;
        stopBtn.disabled = true;

        localStorage.removeItem(LS.active);
        status.textContent = `Stopped (${reason})`;
        timer.textContent = '';
    }

    /* ---------------- RESUME ---------------- */

    if (localStorage.getItem(LS.active) === '1') {
        startTime = Number(localStorage.getItem(LS.start));
        maxRunMs = Number(localStorage.getItem(LS.max));

        if (Date.now() - startTime < maxRunMs) {
            autoActive = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;

            load();
            requestWakeLock();
            liveTimerId = setInterval(updateUI, 1000);

            scheduleFailsafe();
            autoOnce();
        } else {
            localStorage.removeItem(LS.active);
        }
    }

    startBtn.onclick = startAuto;
    stopBtn.onclick = () => stopAuto('Manual stop');

})();
