// ==UserScript==
// @name         Duolingo Unlimited Gems
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  Fakes API to give infinite gems with a GUI (you might get banned)
// @author       apersongithub & merhametsize
// @match        *://*.duolingo.com/*
// @match        *://*.duolingo.cn/*
// @grant        none
// @license      MPL-2.0
// @source       https://github.com/merhametsize/duo-gemsmith
// @downloadURL https://update.greasyfork.org/scripts/555070/Duolingo%20Unlimited%20Gems.user.js
// @updateURL https://update.greasyfork.org/scripts/555070/Duolingo%20Unlimited%20Gems.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const PAYLOAD = {
        consumed: true,
        fromLanguage: "en",
        learningLanguage: "fr"
    };

    let isRunning = false;
    let shouldStop = false;
    let lastKnownGems = null; // track previous gem count for animation

    const SETTINGS_COOKIE = 'duo_gemsmith_settings_v2';

    function getParentCookieDomain() {
        const host = location.hostname; // e.g. www.duolingo.com or preview.duolingo.cn
        const parts = host.split('.');
        if (parts.length < 2) return host;
        const base = parts.slice(-2).join('.');
        return '.' + base;
    }

    function readSettingsFromCookie() {
        const cookies = document.cookie.split('; ');
        for (const c of cookies) {
            const [name, value] = c.split('=');
            if (name === SETTINGS_COOKIE) {
                try {
                    const decoded = decodeURIComponent(value);
                    const parsed = JSON.parse(decoded);
                    return parsed && typeof parsed === 'object' ? parsed : null;
                } catch (e) {
                    console.warn('Failed to parse settings cookie:', e);
                    return null;
                }
            }
        }
        return null;
    }

    function writeSettingsToCookie(settings) {
        try {
            const domain = getParentCookieDomain();
            const days = 365;
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
            const value = encodeURIComponent(JSON.stringify(settings));
            document.cookie =
                `${SETTINGS_COOKIE}=${value};` +
                `expires=${expires};` +
                `path=/;domain=${domain};SameSite=Lax`;
        } catch (e) {
            console.warn('Failed to write settings cookie:', e);
        }
    }

    function defaultSettings() {
        return {
            iterations: 0,
            speedMode: 'medium',   // 'extreme', 'fast', 'medium', 'slow', 'custom'
            customInterval: 1.5,
            position: null,        // { top, left }
            totalGemsEver: 0
        };
    }

    function loadSettings() {
        const defaults = defaultSettings();
        const fromCookie = readSettingsFromCookie();
        if (!fromCookie) return defaults;

        return {
            iterations: typeof fromCookie.iterations === 'number' ? fromCookie.iterations : defaults.iterations,
            speedMode: typeof fromCookie.speedMode === 'string' ? fromCookie.speedMode : defaults.speedMode,
            customInterval: typeof fromCookie.customInterval === 'number' ? fromCookie.customInterval : defaults.customInterval,
            position: fromCookie.position &&
                      typeof fromCookie.position.top === 'number' &&
                      typeof fromCookie.position.left === 'number'
                        ? { top: fromCookie.position.top, left: fromCookie.position.left }
                        : null,
            totalGemsEver: typeof fromCookie.totalGemsEver === 'number' ? fromCookie.totalGemsEver : defaults.totalGemsEver
        };
    }

    const settings = loadSettings();

    function saveSettings() {
        writeSettingsToCookie(settings);
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { hour12: false });
    }

    function getApiEnv() {
        const host = window.location.host || '';
        const isPreview = host.includes('preview.duolingo.com') || host.includes('preview.duolingo.cn');

        if (isPreview) {
            return {
                env: 'preview',
                usersBases: [
                    'https://preview.duolingo.com/2023-05-23/users',   // primary
                    'https://www.duolingo.com/2017-06-30/users',       // fallback 1
                    'https://www.duolingo.com/2023-05-23/users'        // fallback 2
                ]
            };
        } else {
            return {
                env: 'normal',
                usersBases: [
                    'https://www.duolingo.com/2017-06-30/users',       // primary
                    'https://preview.duolingo.com/2023-05-23/users',   // fallback 1
                    'https://www.duolingo.com/2023-05-23/users'        // fallback 2
                ]
            };
        }
    }

    function addLog(logElement, message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${getCurrentTime()}] ${message}`;
        logElement.appendChild(entry);
        logElement.scrollTop = logElement.scrollHeight;
    }

    async function sendPatchRequest(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return { status: response.status, ok: response.ok };
    }

    function getJWTFromCookies() {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'jwt_token') {
                return value;
            }
        }
        return null;
    }

    function decodeToken(token) {
        try {
            if (!token || !token.includes('.')) {
                throw new Error('Invalid JWT token');
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Malformed JWT. Expected 3 parts.');
            }

            const base64Userid = parts[1];
            const padded = base64Userid + '='.repeat((4 - (base64Userid.length % 4)) % 4);
            const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(decoded);

            return { userid: payload.sub, base64Userid };
        } catch (err) {
            console.error(`Error decoding token: ${err.message}`);
            throw err;
        }
    }

    // Fetch user data with fallback chain; only log "using api" if primary fails
    async function fetchUserDataWithFallback(userid, logEl) {
        const { usersBases, env } = getApiEnv();

        let lastError = null;
        for (let i = 0; i < usersBases.length; i++) {
            const base = usersBases[i];
            const label =
                i === 0 ? 'primary' :
                i === 1 ? 'fallback 1' :
                          'fallback 2';

            try {
                const url = `${base}/${userid}?fields=trackingProperties,gems`;
                const response = await fetch(url);
                if (!response.ok) {
                    lastError = new Error(`Status ${response.status}`);

                    // Only log fallbacks (not primary success)
                    if (i === 0) {
                        addLog(logEl, `Primary user API failed (status ${response.status}), trying fallbacks...`, 'error');
                    } else {
                        addLog(logEl, `User API ${label} failed (status ${response.status})`, 'error');
                    }
                    continue;
                }

                const data = await response.json();
                const username = data.trackingProperties?.username || 'Unknown';
                const gems = data.gems || 0;

                if (i === 0) {
                    // Primary worked silently (no "using api" log per request)
                } else {
                    addLog(logEl, `Using user API ${label} endpoint: ${base}/users`, 'info');
                }

                return { username, gems, base };
            } catch (err) {
                lastError = err;
                if (i === 0) {
                    addLog(logEl, `Primary user API error (${err.message}), trying fallbacks...`, 'error');
                } else {
                    addLog(logEl, `User API ${label} error: ${err.message}`, 'error');
                }
            }
        }

        throw lastError || new Error('All user API endpoints failed');
    }

    // Build reward endpoint from a chosen base /users
    function buildRewardUrlFromUsersBase(usersBase, userid, reward) {
        // usersBase ends with /users, we want /users/{userid}/rewards/{reward}
        return `${usersBase}/${userid}/rewards/${reward}`;
    }

    // Interruptible sleep that checks shouldStop every 100ms
    async function interruptibleSleep(totalSeconds, shouldStopRef) {
        const stepMs = 100;
        const totalMs = totalSeconds * 1000;
        let elapsed = 0;

        while (elapsed < totalMs) {
            if (shouldStopRef()) return; // exit early if stop requested
            const remaining = totalMs - elapsed;
            const wait = Math.min(stepMs, remaining);
            await new Promise(r => setTimeout(r, wait));
            elapsed += wait;
        }
    }

    function makeDraggable(panel, handle, onStopDragging) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        function onMouseDown(e) {
            if (e.button !== 0) return;

            const tag = e.target.tagName.toLowerCase();
            if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea' || e.target.closest('button')) {
                return;
            }

            isDragging = true;

            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.left = `${startLeft}px`;
            panel.style.top = `${startTop}px`;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        }

        function onMouseMove(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const rect = panel.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const margin = 8;
            newLeft = Math.max(margin - width + rect.width, Math.min(vw - margin - width + rect.width, newLeft));
            newTop = Math.max(margin, Math.min(vh - margin - height, newTop));

            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (typeof onStopDragging === 'function') {
                const rect = panel.getBoundingClientRect();
                onStopDragging({
                    top: rect.top,
                    left: rect.left
                });
            }
        }

        handle.addEventListener('mousedown', onMouseDown);
    }

    // animate lingot-stat elements when gem count increases
    function animateLingotStats(oldValue, newValue) {
        if (oldValue == null) return;
        const oldNum = Number(oldValue);
        const newNum = Number(newValue);
        if (!Number.isFinite(oldNum) || !Number.isFinite(newNum)) return;
        if (newNum <= oldNum) return;

        const nodes = document.querySelectorAll('span[data-test="lingot-stat"]');
        nodes.forEach(node => {
            node.classList.remove('gs-lingot-animate');
            void node.offsetWidth;
            node.classList.add('gs-lingot-animate');
            const onEnd = () => {
                node.classList.remove('gs-lingot-animate');
                node.removeEventListener('animationend', onEnd);
            };
            node.addEventListener('animationend', onEnd);
        });
    }

    // Update both our UI and page lingot-stat elements, with animation on increase
    function updateGemDisplays(newGemCount, elements) {
        const prev = lastKnownGems;
        lastKnownGems = newGemCount;

        if (elements?.currentGemsValue) {
            elements.currentGemsValue.textContent = newGemCount;
        }

        try {
            const lingotNodes = document.querySelectorAll('span[data-test="lingot-stat"]');
            lingotNodes.forEach(node => {
                node.textContent = newGemCount;
            });
        } catch (e) {
            console.warn('Failed to update lingot-stat elements:', e);
        }

        animateLingotStats(prev, newGemCount);
    }

    function createGUI() {
        const existing = document.getElementById('duo-gemsmith-gui');
        if (existing) existing.remove();

        const gui = document.createElement('div');
        gui.id = 'duo-gemsmith-gui';
        gui.innerHTML = `
            <style>
            span#gs-gems-gained{ 
                font-weight: 600; 
            }
                #duo-gemsmith-gui {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: #050816;
                    border-radius: 18px;
                    padding: 18px 18px 16px;
                    box-shadow:
                        0 22px 45px rgba(15, 23, 42, 0.85),
                        0 0 0 1px rgba(148, 163, 184, 0.15);
                    z-index: 999999;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    color: #e5e7eb;
                    min-width: 360px;
                    max-width: 440px;
                    backdrop-filter: blur(18px);
                    box-sizing: border-box;
                    cursor: default;
                }
                #duo-gemsmith-gui * {
                    box-sizing: border-box;
                }
                #duo-gemsmith-gui h2 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #f9fafb;
                    cursor: move;
                    user-select: none;
                }
                #duo-gemsmith-gui h2 span.title-left {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                #duo-gemsmith-gui h2 span.title-pill {
                    font-size: 11px;
                    padding: 3px 8px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(56,189,248,0.24));
                    color: #e0f2fe;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                #duo-gemsmith-gui .sub {
                    font-size: 11px;
                    color: #9ca3af;
                    margin-bottom: 10px;
                }
                #duo-gemsmith-gui .grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 6px;
                    margin-bottom: 10px;
                }
                #duo-gemsmith-gui .stat-card {
                    background: radial-gradient(circle at top left, rgba(56,189,248,0.22), transparent 55%);
                    border-radius: 12px;
                    padding: 8px 9px;
                    border: 1px solid rgba(148, 163, 184, 0.22);
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }
                #duo-gemsmith-gui .stat-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.09em;
                    color: #9ca3af;
                }
                #duo-gemsmith-gui .stat-value {
                    font-size: 12px;
                    font-weight: 500;
                    color: #e5e7eb;
                    word-break: break-all;
                }
                #duo-gemsmith-gui .stat-value.gems {
                    font-size: 14px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                #duo-gemsmith-gui .stat-value.gems img {
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                }
                #duo-gemsmith-gui .stat-value.accent {
                    color: #a5b4fc;
                    font-weight: 600;
                }
                #duo-gemsmith-gui .divider {
                    height: 1px;
                    background: radial-gradient(circle, rgba(148,163,184,0.6), transparent);
                    margin: 10px 0;
                    opacity: 0.5;
                }
                #duo-gemsmith-gui label.field-label {
                    display: block;
                    font-size: 11px;
                    color: #9ca3af;
                    margin-bottom: 3px;
                }
                #duo-gemsmith-gui input[type="number"] {
                    width: 100%;
                    padding: 8px 9px;
                    border-radius: 10px;
                    border: 1px solid rgba(55, 65, 81, 0.9);
                    background: rgba(15,23,42,0.9);
                    color: #e5e7eb;
                    font-size: 13px;
                    outline: none;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                }
                #duo-gemsmith-gui input[type="number"]::placeholder {
                    color: #6b7280;
                }
                #duo-gemsmith-gui input[type="number"]:focus {
                    border-color: #38bdf8;
                    box-shadow: 0 0 0 1px rgba(56,189,248,0.7);
                    background: rgba(15,23,42,1);
                }
                #duo-gemsmith-gui .section-title {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #9ca3af;
                    margin: 8px 0 6px;
                }
                #duo-gemsmith-gui .speed-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                #duo-gemsmith-gui .speed-pill {
                    flex: 1 1 45%;
                    min-width: 0;
                    border-radius: 999px;
                    border: 1px solid rgba(55,65,81,0.9);
                    background: rgba(15,23,42,0.85);
                    padding: 6px 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.07s;
                    font-size: 10px;
                }
                #duo-gemsmith-gui .speed-pill .speed-name {
                    font-weight: 500;
                    color: #e5e7eb;
                }
                #duo-gemsmith-gui .speed-pill .speed-desc {
                    font-size: 10px;
                    color: #9ca3af;
                }
                #duo-gemsmith-gui .speed-pill[data-selected="true"] {
                    border-color: #38bdf8;
                    background: radial-gradient(circle at top left, rgba(56,189,248,0.26), rgba(15,23,42,0.95));
                    box-shadow: 0 0 0 1px rgba(56,189,248,0.4);
                }
                #duo-gemsmith-gui .speed-pill[data-selected="true"] .speed-name {
                    color: #e0f2fe;
                }
                #duo-gemsmith-gui .speed-pill[data-selected="true"] .speed-desc {
                    color: #bae6fd;
                }
                #duo-gemsmith-gui .speed-pill:active {
                    transform: scale(0.97);
                }
                #duo-gemsmith-gui .speed-row {
                    display: grid;
                    grid-template-columns: 1.15fr 0.85fr;
                    gap: 6px;
                    align-items: center;
                }
                #duo-gemsmith-gui .custom-speed-box {
                    background: radial-gradient(circle at top right, rgba(52,211,153,0.2), rgba(15,23,42,0.96));
                    border-radius: 12px;
                    padding: 6px 8px 8px;
                    border: 1px solid rgba(34,197,94,0.35);
                }
                #duo-gemsmith-gui .custom-speed-box small {
                    display: block;
                    margin-top: 2px;
                    font-size: 10px;
                    color: #6ee7b7;
                }
                #duo-gemsmith-gui .buttons-row {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr 0.7fr 0.7fr;
                    gap: 6px;
                    margin-top: 10px;
                }
                #duo-gemsmith-gui button {
                    border: none;
                    border-radius: 999px;
                    padding: 8px 10px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.07s, box-shadow 0.15s, opacity 0.15s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    white-space: nowrap;
                }
                #duo-gemsmith-gui button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                #duo-gemsmith-gui .start-btn {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: #ecfdf5;
                    box-shadow: 0 10px 25px rgba(34,197,94,0.35);
                }
                #duo-gemsmith-gui .start-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4ade80, #22c55e);
                    transform: translateY(-1px);
                    box-shadow: 0 14px 30px rgba(34,197,94,0.5);
                }
                #duo-gemsmith-gui .stop-btn {
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: #fff7ed;
                    box-shadow: 0 10px 25px rgba(249,115,22,0.35);
                }
                #duo-gemsmith-gui .stop-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #fb923c, #f97316);
                    transform: translateY(-1px);
                    box-shadow: 0 14px 30px rgba(249,115,22,0.5);
                }
                #duo-gemsmith-gui .reset-btn {
                    background: rgba(31,41,55,0.95);
                    color: #e5e7eb;
                    border: 1px solid rgba(55,65,81,0.9);
                }
                #duo-gemsmith-gui .reset-btn:hover:not(:disabled) {
                    background: rgba(17,24,39,1);
                    color: #f9fafb;
                    transform: translateY(-1px);
                }
                #duo-gemsmith-gui .close-btn {
                    background: rgba(15,23,42,0.85);
                    color: #9ca3af;
                    border: 1px solid rgba(55,65,81,0.9);
                }
                #duo-gemsmith-gui .close-btn:hover {
                    background: rgba(17,24,39,1);
                    color: #e5e7eb;
                    transform: translateY(-1px);
                }
                #duo-gemsmith-gui .log {
                    background: radial-gradient(circle at top left, rgba(79,70,229,0.25), rgba(15,23,42,0.96));
                    padding: 8px 9px;
                    border-radius: 12px;
                    max-height: 200px;
                    overflow-y: auto;
                    margin-top: 10px;
                    font-size: 11px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    border: 1px solid rgba(55,65,81,0.9);
                }
                #duo-gemsmith-gui .log-entry {
                    margin: 3px 0;
                    padding: 3px 4px;
                    border-left: 2px solid #22c55e;
                    padding-left: 6px;
                    border-radius: 2px;
                    background: rgba(15,23,42,0.75);
                }
                #duo-gemsmith-gui .log-entry.error {
                    border-left-color: #f97316;
                    color: #fed7aa;
                }
                #duo-gemsmith-gui .log-entry.success {
                    border-left-color: #22c55e;
                    color: #bbf7d0;
                }
                #duo-gemsmith-gui .log-entry.info {
                    border-left-color: #38bdf8;
                    color: #bae6fd;
                }
                #duo-gemsmith-gui .credits {
                    margin-top: 6px;
                    font-size: 10px;
                    text-align: right;
                    color: #6b7280;
                }
                #duo-gemsmith-gui .credits a {
                    color: #93c5fd;
                    text-decoration: none;
                }
                #duo-gemsmith-gui .credits a:hover {
                    text-decoration: underline;
                }
                #duo-gemsmith-gui .inline-gem {
                    width: 12px;
                    height: 12px;
                    vertical-align: -1px;
                }
                /* lingot blur animation */
                @keyframes gsLingotPulse {
                    0% {
                        filter: blur(0px);
                        transform: scale(1);
                        opacity: 1;
                    }
                    25% {
                        filter: blur(1.5px);
                        transform: scale(1.06);
                        opacity: 0.9;
                    }
                    50% {
                        filter: blur(0.5px);
                        transform: scale(1.03);
                        opacity: 1;
                    }
                    100% {
                        filter: blur(0px);
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                span[data-test="lingot-stat"].gs-lingot-animate {
                    animation: gsLingotPulse 0.45s ease-out;
                }

                /* ---------- RESPONSIVE LAYOUTS ---------- */
                @media (max-width: 1024px) {
                    #duo-gemsmith-gui {
                        top: 16px;
                        right: 16px;
                        padding: 14px 14px 12px;
                        min-width: 320px;
                        max-width: 380px;
                    }
                    #duo-gemsmith-gui h2 {
                        font-size: 16px;
                        margin-bottom: 8px;
                    }
                    #duo-gemsmith-gui .sub {
                        font-size: 10px;
                        margin-bottom: 8px;
                    }
                    #duo-gemsmith-gui .stat-card {
                        padding: 7px 8px;
                    }
                    #duo-gemsmith-gui .stat-label {
                        font-size: 9px;
                    }
                    #duo-gemsmith-gui .stat-value {
                        font-size: 11px;
                    }
                    #duo-gemsmith-gui input[type="number"] {
                        font-size: 12px;
                        padding: 7px 8px;
                    }
                    #duo-gemsmith-gui button {
                        padding: 7px 8px;
                        font-size: 11px;
                    }
                }

                @media (max-width: 600px) {
                    #duo-gemsmith-gui {
                        top: 10px;
                        right: 8px;
                        left: 8px;
                        max-width: none;
                        width: auto;
                        padding: 12px 12px 10px;
                        border-radius: 14px;
                    }
                    #duo-gemsmith-gui h2 {
                        font-size: 15px;
                        margin-bottom: 6px;
                    }
                    #duo-gemsmith-gui .title-pill {
                        display: none;
                    }
                    #duo-gemsmith-gui .sub {
                        font-size: 10px;
                        margin-bottom: 6px;
                    }
                    #duo-gemsmith-gui .grid {
                        grid-template-columns: 1fr;
                    }
                    #duo-gemsmith-gui .buttons-row {
                        grid-template-columns: 1fr 1fr 0.7fr 0.7fr;
                        gap: 4px;
                    }
                    #duo-gemsmith-gui input[type="number"] {
                        font-size: 11px;
                        padding: 6px 7px;
                    }
                    #duo-gemsmith-gui button {
                        padding: 6px 7px;
                        font-size: 10px;
                    }
                    #duo-gemsmith-gui .section-title {
                        font-size: 10px;
                    }
                    #duo-gemsmith-gui .log {
                        max-height: 160px;
                        font-size: 10px;
                    }
                    #duo-gemsmith-gui .credits {
                        font-size: 9px;
                    }
                }

                @media (max-width: 400px) {
                    #duo-gemsmith-gui {
                        top: 6px;
                        left: 4px;
                        right: 4px;
                        padding: 10px 10px 8px;
                    }
                    #duo-gemsmith-gui h2 {
                        font-size: 14px;
                    }
                    #duo-gemsmith-gui .buttons-row {
                        grid-template-columns: 1fr 1fr 1fr 1fr;
                    }
                }
            </style>
            <h2 id="gs-header">
                <span class="title-left">
                    <span>Duo-Gemsmith</span>
                </span>
                <span class="title-pill">Auto Claimer</span>
            </h2>
            <div class="sub">We are not responsible for misuse. Run reward claims at a responsible speed.</div>

            <div class="grid">
                <div class="stat-card">
                    <div class="stat-label">User ID</div>
                    <div class="stat-value" id="gs-userid">Loading...</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Username</div>
                    <div class="stat-value accent" id="gs-username">Loading...</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Current Gems</div>
                    <div class="stat-value gems" id="gs-current-gems">
                        <span class="gs-current-gems-value">0</span>
                        <img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="gems">
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Requests / Gained</div>
                    <div class="stat-value">
                        <span id="gs-requests">0</span> req ·
                        <span id="gs-gems-gained">0</span>
                        <img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" class="inline-gem" alt="gems">
                    </div>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <div class="stat-label">Total Gems Smithed Ever</div>
                    <div class="stat-value gems">
                        <span id="gs-total-gems-ever">0</span>
                        <img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="gems">
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <label class="field-label" for="gs-iterations">Iterations</label>
            <input
                type="number"
                id="gs-iterations"
                placeholder="0 or Empty = run until stopped"
                min="0"
                value="0"
            />

            <div class="section-title">Speed</div>

            <div class="speed-row">
                <div class="speed-group">
                    <button class="speed-pill" data-speed-mode="extreme">
                        <span class="speed-name">Extremely fast</span>
                        <span class="speed-desc">0.1s interval</span>
                    </button>
                    <button class="speed-pill" data-speed-mode="fast">
                        <span class="speed-name">Fast</span>
                        <span class="speed-desc">1s interval</span>
                    </button>
                    <button class="speed-pill" data-speed-mode="medium">
                        <span class="speed-name">Medium</span>
                        <span class="speed-desc">2s interval</span>
                    </button>
                    <button class="speed-pill" data-speed-mode="slow">
                        <span class="speed-name">Slow</span>
                        <span class="speed-desc">3s interval</span>
                    </button>
                </div>

                <div class="custom-speed-box">
                    <label class="field-label" for="gs-custom-interval" style="margin-bottom:1px;">Custom</label>
                    <input
                        type="number"
                        id="gs-custom-interval"
                        placeholder="Seconds"
                        min="0.05"
                        step="0.05"
                    />
                    <small>Choose the custom pill to use this.</small>
                </div>
            </div>

            <div class="speed-group" style="margin-top:6px;">
                <button class="speed-pill" data-speed-mode="custom" style="flex:1 1 100%;">
                    <span class="speed-name">Custom speed</span>
                    <span class="speed-desc">Use your custom seconds value</span>
                </button>
            </div>

            <div class="buttons-row">
                <button class="start-btn" id="gs-start">▶ Start</button>
                <button class="stop-btn" id="gs-stop" disabled>⏹ Stop</button>
                <button class="reset-btn" id="gs-reset">Reset Settings</button>
                <button class="close-btn" id="gs-close">✕</button>
            </div>

            <div class="log" id="gs-log"></div>

            <div class="credits">
                Created by
                <a href="https://github.com/merhametsize" target="_blank" rel="noopener noreferrer">merhametsize</a>
                &
                <a href="https://github.com/apersongithub" target="_blank" rel="noopener noreferrer">apersongithub</a>
            </div>
        `;
        document.body.appendChild(gui);

        // Restore last position if available
        if (settings.position && typeof settings.position.top === 'number' && typeof settings.position.left === 'number') {
            gui.style.top = `${settings.position.top}px`;
            gui.style.left = `${settings.position.left}px`;
            gui.style.right = 'auto';
        }

        const els = {
            panel: gui,
            header: document.getElementById('gs-header'),
            userid: document.getElementById('gs-userid'),
            username: document.getElementById('gs-username'),
            currentGemsValue: gui.querySelector('.gs-current-gems-value'),
            requests: document.getElementById('gs-requests'),
            gemsGained: document.getElementById('gs-gems-gained'),
            totalGemsEver: document.getElementById('gs-total-gems-ever'),
            iterations: document.getElementById('gs-iterations'),
            speedPills: Array.from(gui.querySelectorAll('.speed-pill')),
            customInterval: document.getElementById('gs-custom-interval'),
            startBtn: document.getElementById('gs-start'),
            stopBtn: document.getElementById('gs-stop'),
            resetBtn: document.getElementById('gs-reset'),
            closeBtn: document.getElementById('gs-close'),
            log: document.getElementById('gs-log')
        };

        // Initialize total gems ever from cookie-backed settings
        els.totalGemsEver.textContent = settings.totalGemsEver ?? 0;

        // Make panel draggable and persist position
        makeDraggable(els.panel, els.header, (pos) => {
            settings.position = { top: pos.top, left: pos.left };
            saveSettings();
        });

        // Apply saved settings to UI
        els.iterations.value = settings.iterations ?? 0;
        els.customInterval.value = settings.customInterval ?? 1.5;

        function updateSpeedPillsSelection() {
            els.speedPills.forEach(btn => {
                const mode = btn.getAttribute('data-speed-mode');
                btn.dataset.selected = mode === settings.speedMode ? 'true' : 'false';
            });
        }
        updateSpeedPillsSelection();

        // Reset everything back to defaults except totalGemsEver
        function resetSettingsToDefaults() {
            const defs = defaultSettings();
            const preservedTotal = settings.totalGemsEver; // keep total gems made ever

            settings.iterations = defs.iterations;
            settings.speedMode = defs.speedMode;
            settings.customInterval = defs.customInterval;
            settings.position = defs.position;
            settings.totalGemsEver = preservedTotal;

            // Persist
            saveSettings();

            // Update UI
            els.iterations.value = settings.iterations;
            els.customInterval.value = settings.customInterval;
            els.totalGemsEver.textContent = settings.totalGemsEver;
            updateSpeedPillsSelection();

            // Clear run-time counters (visual only)
            els.requests.textContent = '0';
            els.gemsGained.textContent = '0';

            addLog(els.log, 'Settings reset to defaults (total gems made ever preserved).', 'info');
        }

        // Events to persist settings
        els.iterations.addEventListener('change', () => {
            settings.iterations = parseInt(els.iterations.value) || 0;
            saveSettings();
        });

        // Auto-select custom when user edits the custom interval.
        els.customInterval.addEventListener('input', () => {
            const v = parseFloat(els.customInterval.value);
            if (!isNaN(v) && v > 0) {
                settings.customInterval = v;
                settings.speedMode = 'custom';
                saveSettings();
                updateSpeedPillsSelection();
            }
        });

        els.speedPills.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-speed-mode');
                settings.speedMode = mode;
                saveSettings();
                updateSpeedPillsSelection();
            });
        });

        els.resetBtn.addEventListener('click', () => {
            if (isRunning) {
                addLog(els.log, 'Cannot reset while running. Please stop first.', 'error');
                return;
            }
            resetSettingsToDefaults();
        });

        return els;
    }

    function getIntervalSecondsFromSettings(settings) {
        switch (settings.speedMode) {
            case 'extreme': return 0.1;
            case 'fast': return 1;
            case 'medium': return 2;
            case 'slow': return 3;
            case 'custom':
            default:
                return settings.customInterval > 0 ? settings.customInterval : 1.5;
        }
    }

    async function main() {
        const elements = createGUI();

        // Get JWT token
        const token = getJWTFromCookies();
        if (!token) {
            addLog(elements.log, '❌ JWT token not found in cookies!', 'error');
            addLog(elements.log, 'Please make sure you\'re logged in to Duolingo', 'error');
            elements.startBtn.disabled = true;
            return;
        }

        // Decode token and get user info
        let userid;
        try {
            const decoded = decodeToken(token);
            userid = decoded.userid;
            elements.userid.textContent = userid;
            addLog(elements.log, '✓ JWT token retrieved successfully', 'success');
        } catch (err) {
            addLog(elements.log, `❌ Failed to decode JWT: ${err.message}`, 'error');
            elements.startBtn.disabled = true;
            return;
        }

        // Fetch username and initial gem count with fallback logging
        let username;
        let initialGems = 0;
        let userApiBase; // which base worked for user (with /users)
        try {
            const userData = await fetchUserDataWithFallback(userid, elements.log);
            username = userData.username;
            initialGems = userData.gems;
            userApiBase = userData.base; // e.g., https://www.duolingo.com/2017-06-30/users

            elements.username.textContent = username;
            updateGemDisplays(initialGems, elements);
            addLog(elements.log, `✓ Username: ${username}`, 'success');
            addLog(elements.log, `✓ Current gems: ${initialGems}`, 'success');
        } catch (err) {
            addLog(elements.log, `❌ All user API endpoints failed: ${err.message}`, 'error');
            elements.startBtn.disabled = true;
            return;
        }

        const reward = `SKILL_COMPLETION_BALANCED-${username}DoesntLikeEnergy-2-GEMS`;
        const apiUrl = buildRewardUrlFromUsersBase(userApiBase, userid, reward);

        let requestCount = 0;
        let totalGemsGained = 0;

        // Auto-update gem count every 5 seconds using same fallback chain
        const gemUpdateInterval = setInterval(async () => {
            if (!document.getElementById('duo-gemsmith-gui')) {
                clearInterval(gemUpdateInterval);
                return;
            }
            try {
                const userData = await fetchUserDataWithFallback(userid, elements.log);
                updateGemDisplays(userData.gems, elements);
            } catch {
                // ignore periodic failures
            }
        }, 5000);

        elements.startBtn.addEventListener('click', async () => {
            if (isRunning) return;

            const maxIterations = parseInt(elements.iterations.value) || 0;
            settings.iterations = maxIterations;
            saveSettings();

            const customVal = parseFloat(elements.customInterval.value);
            if (!isNaN(customVal) && customVal > 0) {
                settings.customInterval = customVal;
                saveSettings();
            }

            // Validate custom if selected
            if (settings.speedMode === 'custom') {
                if (!settings.customInterval || settings.customInterval <= 0) {
                    addLog(elements.log, '❌ Custom speed must be greater than 0 seconds', 'error');
                    return;
                }
            }

            const intervalSeconds = getIntervalSecondsFromSettings(settings);

            isRunning = true;
            shouldStop = false;

            elements.startBtn.disabled = true;
            elements.stopBtn.disabled = false;
            elements.iterations.disabled = true;
            elements.speedPills.forEach(b => b.disabled = true);
            elements.customInterval.disabled = false;

            addLog(
                elements.log,
                `🚀 Starting... (${maxIterations === 0 ? 'infinite' : maxIterations} iterations, interval = ${intervalSeconds.toFixed(2)}s, mode = ${settings.speedMode})`,
                'success'
            );

            while (!shouldStop) {
                if (maxIterations > 0 && requestCount >= maxIterations) {
                    addLog(elements.log, `✓ Completed ${maxIterations} iterations`, 'success');
                    break;
                }

                requestCount++;
                elements.requests.textContent = requestCount;

                try {
                    const result = await sendPatchRequest(apiUrl, PAYLOAD);
                    if (result.ok) {
                        totalGemsGained += 30;
                        elements.gemsGained.textContent = totalGemsGained.toString();

                        // Update lifetime total in cookie-backed settings
                        settings.totalGemsEver = (settings.totalGemsEver || 0) + 30;
                        elements.totalGemsEver.textContent = settings.totalGemsEver;
                        saveSettings();

                        addLog(elements.log, `#${requestCount}: +30 gems (Status: ${result.status})`, 'success');

                        try {
                            const userData = await fetchUserDataWithFallback(userid, elements.log);
                            updateGemDisplays(userData.gems, elements);
                        } catch {
                            // ignore failure in refresh
                        }
                    } else {
                        addLog(elements.log, `#${requestCount}: Failed (Status: ${result.status})`, 'error');
                    }
                } catch (err) {
                    addLog(elements.log, `#${requestCount}: Error - ${err.message}`, 'error');
                }

                if (!shouldStop && (maxIterations === 0 || requestCount < maxIterations)) {
                    await interruptibleSleep(intervalSeconds, () => shouldStop);
                }
            }

            isRunning = false;
            elements.startBtn.disabled = false;
            elements.stopBtn.disabled = true;
            elements.iterations.disabled = false;
            elements.speedPills.forEach(b => b.disabled = false);
            elements.customInterval.disabled = false;

            if (shouldStop) {
                addLog(elements.log, '⏹ Stopped by user', 'info');
            }
        });

        elements.stopBtn.addEventListener('click', () => {
            shouldStop = true;
            elements.stopBtn.disabled = true;
        });

        elements.closeBtn.addEventListener('click', () => {
            shouldStop = true;
            clearInterval(gemUpdateInterval);
            const panel = document.getElementById('duo-gemsmith-gui');
            if (panel) panel.remove();
        });

        addLog(elements.log, '✓ Ready! Drag by the header, set iterations and choose a speed, then click Start', 'success');
    }

    try {
        await main();
    } catch (err) {
        console.error('Fatal error:', err);
    }
})();