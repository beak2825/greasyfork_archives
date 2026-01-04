// ==UserScript==
// @name         P3 - Flowers & Brook Auto Quest
// @namespace    http://tampermonkey.net/
// @version      9.4
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

    const CHECK_INTERVAL_MS = 5.5 * 60 * 1000; // 5.5 minutes
    const WIGGLE_MS = 15 * 1000; // ±15 seconds
    const LS_PREFIX = 'p3_auto_quest_';
    const LS_KEY_ACTIVE = LS_PREFIX + 'active';
    const LS_KEY_START = LS_PREFIX + 'start_time';
    const LS_KEY_COUNTS = LS_PREFIX + 'counts';
    const LS_KEY_LAST = LS_PREFIX + 'last';
    const LS_KEY_MAX = LS_PREFIX + 'max_run';

    let autoActive = false;
    let startTime = null;
    let intervalId = null;
    let liveTimerId = null;
    let maxRunMs = 0;
    let counts = { started: 0, turnedIn: 0 };
    let lastSuccess = 0;

    // --- Helpers ---
    function ciIncludes(hay, needle) {
        return (hay || '').toLowerCase().includes((needle || '').toLowerCase());
    }

    function findQuestButton(label) {
        const btns = Array.from(document.querySelectorAll('input[type="submit"], button'))
            .filter(b => {
                const style = window.getComputedStyle(b);
                return style.display !== 'none' && style.visibility !== 'hidden' && !b.disabled;
            })
            .filter(b => ciIncludes(b.value || b.textContent || '', label));
        return btns[0] || null;
    }

    function formatTime(ms) {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    }

    async function clickQuestButton(btn) {
        const form = btn.closest('form');
        if (!form) return false;
        const data = new FormData(form);
        try {
            await fetch(form.action, { method: 'POST', body: data, credentials: 'include' });
            return true;
        } catch (e) {
            console.error('Quest submission failed', e);
            return false;
        }
    }

    function saveCounts() {
        localStorage.setItem(LS_KEY_COUNTS, JSON.stringify(counts));
        localStorage.setItem(LS_KEY_LAST, lastSuccess);
    }

    function loadCounts() {
        const c = localStorage.getItem(LS_KEY_COUNTS);
        const l = localStorage.getItem(LS_KEY_LAST);
        const m = localStorage.getItem(LS_KEY_MAX);
        if (c) counts = JSON.parse(c);
        if (l) lastSuccess = Number(l);
        if (m) maxRunMs = Number(m);
    }

    // --- UI ---
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        backgroundColor: '#2d3e1f',
        padding: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        zIndex: 99999,
        color: 'white',
        fontWeight: '600',
        borderBottom: '2px solid black'
    });

    const startQuestBtn = document.createElement('button');
    startQuestBtn.textContent = 'Start Quest';
    Object.assign(startQuestBtn.style, { cursor: 'pointer', padding: '6px 12px' });

    const turnInBtn = document.createElement('button');
    turnInBtn.textContent = 'Turn In Quest';
    Object.assign(turnInBtn.style, { cursor: 'pointer', padding: '6px 12px' });

    const status = document.createElement('span');
    status.textContent = 'Status: Stopped';

    const timerDisplay = document.createElement('span');
    timerDisplay.textContent = 'Time Left: --h --m --s';

    const startAutoBtn = document.createElement('button');
    startAutoBtn.textContent = '▶ Start Auto-Quest';
    Object.assign(startAutoBtn.style, { cursor: 'pointer', padding: '6px 12px' });

    const stopAutoBtn = document.createElement('button');
    stopAutoBtn.textContent = '⏹ Stop Auto-Quest';
    Object.assign(stopAutoBtn.style, { cursor: 'pointer', padding: '6px 12px' });
    stopAutoBtn.disabled = true;

    container.append(startQuestBtn, turnInBtn, status, timerDisplay, startAutoBtn, stopAutoBtn);
    document.body.appendChild(container);
    document.body.style.marginTop = '50px';

    // --- Auto Quest Logic ---
    loadCounts();

    async function autoLoop() {
        if (!autoActive) return;
        const elapsed = Date.now() - startTime;
        if (elapsed >= maxRunMs) {
            stopAuto('Randomized run length reached');
            return;
        }

        // Try Turn In first
        const turnIn = findQuestButton('Turn In Quest');
        if (turnIn) {
            const success = await clickQuestButton(turnIn);
            if (success) {
                counts.turnedIn++;
                lastSuccess = Date.now();
                saveCounts();
                setTimeout(() => location.reload(), 1200);
                return;
            }
        }

        // Try Start Quest next
        const startQ = findQuestButton('Start Quest');
        if (startQ) {
            const success = await clickQuestButton(startQ);
            if (success) {
                counts.started++;
                lastSuccess = Date.now();
                saveCounts();
                setTimeout(() => location.reload(), 1200);
                return;
            }
        }
    }

    function updateLiveUI() {
        if (!autoActive) return;
        const elapsed = Date.now() - startTime;
        const remaining = maxRunMs - elapsed;
        timerDisplay.textContent = `Time Left: ${formatTime(remaining)}`;
        const lastElapsedSec = Math.floor((Date.now() - lastSuccess) / 1000);
        let lastText = '';
        if (lastElapsedSec < 60) lastText = `${lastElapsedSec}s ago`;
        else lastText = `${Math.floor(lastElapsedSec / 60)}m ago`;
        status.textContent = `Turned in ${counts.turnedIn} | Started ${counts.started} | Last success: ${lastText}`;
    }

    function startAuto() {
        if (autoActive) return;

        // Randomize duration between 4–8 hours
        const randomHours = 4 + Math.random() * 4;
        maxRunMs = randomHours * 60 * 60 * 1000;

        startTime = Date.now();
        localStorage.setItem(LS_KEY_START, startTime);
        localStorage.setItem(LS_KEY_MAX, maxRunMs);
        autoActive = true;
        localStorage.setItem(LS_KEY_ACTIVE, '1');

        startAutoBtn.disabled = true;
        stopAutoBtn.disabled = false;

        updateLiveUI();
        liveTimerId = setInterval(updateLiveUI, 1000);
        autoLoop();

        intervalId = setInterval(() => {
            setTimeout(autoLoop, Math.floor(Math.random() * WIGGLE_MS * 2) - WIGGLE_MS);
        }, CHECK_INTERVAL_MS);

        startAutoRefresh(); // <-- start background refresh loop
    }

    function stopAuto(reason = '') {
        clearInterval(intervalId);
        clearInterval(liveTimerId);
        intervalId = null;
        liveTimerId = null;

        autoActive = false;
        startAutoBtn.disabled = false;
        stopAutoBtn.disabled = true;

        startTime = null;
        maxRunMs = 0;

        // Reset counters after stop
        counts = { started: 0, turnedIn: 0 };
        saveCounts();

        localStorage.removeItem(LS_KEY_ACTIVE);
        localStorage.removeItem(LS_KEY_START);
        localStorage.removeItem(LS_KEY_MAX);

        timerDisplay.textContent = 'Time Left: --h --m --s';
        status.textContent = 'Status: Stopped';

        stopAutoRefresh(); // <-- stop background refresh loop

        if (reason) console.log('AutoQuest stopped:', reason);
    }

    // --- Manual Buttons (no popups, UI feedback) ---
    startQuestBtn.addEventListener('click', async () => {
        const btn = findQuestButton('Start Quest');
        if (btn) {
            status.textContent = 'Starting quest...';
            const success = await clickQuestButton(btn);
            if (success) {
                status.textContent = 'Quest started ✔';
                setTimeout(() => location.reload(), 1000);
            } else {
                status.textContent = 'Failed to start quest ❌';
            }
        } else {
            status.textContent = 'No "Start Quest" button found.';
        }
    });

    turnInBtn.addEventListener('click', async () => {
        const btn = findQuestButton('Turn In Quest');
        if (btn) {
            status.textContent = 'Turning in quest...';
            const success = await clickQuestButton(btn);
            if (success) {
                status.textContent = 'Quest turned in ✔';
                setTimeout(() => location.reload(), 1000);
            } else {
                status.textContent = 'Failed to turn in quest ❌';
            }
        } else {
            status.textContent = 'No "Turn In Quest" button found.';
        }
    });

    // --- Background-safe Auto Refresh (1-minute only when active) ---
    const REFRESH_INTERVAL_MS = 60 * 1000;
    let refreshIntervalId = null;

    function startAutoRefresh() {
        if (refreshIntervalId) return;
        refreshIntervalId = setInterval(() => {
            if (!autoActive) return;
            const lastReload = Number(localStorage.getItem(LS_PREFIX + 'last_reload') || 0);
            const now = Date.now();
            if (now - lastReload > REFRESH_INTERVAL_MS - 5000) {
                localStorage.setItem(LS_PREFIX + 'last_reload', now);
                location.reload();
            }
        }, REFRESH_INTERVAL_MS);
    }

    function stopAutoRefresh() {
        if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
            refreshIntervalId = null;
        }
    }

    // --- Resume Auto if Active ---
    const prevActive = localStorage.getItem(LS_KEY_ACTIVE) === '1';
    const prevStart = Number(localStorage.getItem(LS_KEY_START) || '0');
    if (prevActive && Date.now() - prevStart < Number(localStorage.getItem(LS_KEY_MAX) || 0)) {
        startTime = prevStart;
        autoActive = true;
        maxRunMs = Number(localStorage.getItem(LS_KEY_MAX));
        startAutoBtn.disabled = true;
        stopAutoBtn.disabled = false;
        updateLiveUI();
        liveTimerId = setInterval(updateLiveUI, 1000);
        autoLoop();
        intervalId = setInterval(() => {
            setTimeout(autoLoop, Math.floor(Math.random() * WIGGLE_MS * 2) - WIGGLE_MS);
        }, CHECK_INTERVAL_MS);
        startAutoRefresh();
    }

    startAutoBtn.addEventListener('click', startAuto);
    stopAutoBtn.addEventListener('click', () => stopAuto('Stopped by user'));
})();