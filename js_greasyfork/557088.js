// ==UserScript==
// @name         Chain watcher
// @namespace    https://torn.com/
// @version      0.9
// @description  Floating panel for faction chain with global 15s polling, cooldown display, and sound alert
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
//
// @downloadURL https://update.greasyfork.org/scripts/557088/Chain%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/557088/Chain%20watcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_PREFIX    = 'tm_torn_chain_';
    const DATA_KEY          = STORAGE_PREFIX + 'data';
    const LAST_FETCH_KEY    = STORAGE_PREFIX + 'lastFetch';
    const FETCH_LOCK_KEY    = STORAGE_PREFIX + 'fetchLock';
    const API_KEY_KEY       = STORAGE_PREFIX + 'apiKey';
    const ENABLED_KEY       = STORAGE_PREFIX + 'enabled';
    const PANEL_POS_KEY     = STORAGE_PREFIX + 'panelPos';
    const PANEL_VISIBLE_KEY = STORAGE_PREFIX + 'panelVisible';
    const SOUND_ENABLED_KEY = STORAGE_PREFIX + 'soundEnabled';
    const SOUND_VOLUME_KEY  = STORAGE_PREFIX + 'soundVolume';

    const FETCH_INTERVAL_MS = 15 * 1000;
    const LOCK_TTL_MS       = 5 * 1000;

    const tabId = 'tab-' + Date.now() + '-' + Math.random().toString(16).slice(2);

    let chainData   = null;
    let lastDataRaw = null;

    const ui = {};

    let audioCtx = null;
    let beepIntervalId = null;
    let isBeeping = false;

    createPanel();
    initFromStorage();
    startTimers();

    GM_registerMenuCommand('Show/Hide Torn Chain Panel', () => {
        if (!ui.panel) return;
        if (ui.panel.style.display === 'none') {
            ui.panel.style.display = 'block';
            localStorage.setItem(PANEL_VISIBLE_KEY, '1');
        } else {
            ui.panel.style.display = 'none';
            localStorage.setItem(PANEL_VISIBLE_KEY, '0');
        }
    });

    function createPanel() {
        GM_addStyle(`
            #torn-chain-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 260px;
                background: #111;
                color: #eee;
                border: 1px solid #444;
                border-radius: 6px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,.6);
            }
            #torn-chain-panel .tcp-header {
                cursor: move;
                padding: 4px 8px;
                background: #222;
                display: flex;
                align-items: center;
                user-select: none;
            }
            #torn-chain-panel .tcp-title {
                flex: 1;
                font-weight: bold;
                font-size: 13px;
            }
            #torn-chain-panel .tcp-btn,
            #torn-chain-panel .tcp-close {
                background: #333;
                border: 1px solid #555;
                border-radius: 4px;
                color: #eee;
                padding: 1px 5px;
                font-size: 10px;
                cursor: pointer;
                margin-left: 4px;
            }
            #torn-chain-panel .tcp-close {
                background: transparent;
                border: none;
                font-size: 13px;
            }
            #torn-chain-panel .tcp-body {
                padding: 6px 8px 8px 8px;
            }
            #torn-chain-panel .tcp-row {
                margin-bottom: 6px;
            }
            #torn-chain-panel label {
                font-size: 11px;
            }
            #torn-chain-panel input[type="text"],
            #torn-chain-panel input[type="password"] {
                width: 100%;
                box-sizing: border-box;
                margin-top: 2px;
                font-size: 11px;
                padding: 2px 4px;
                border-radius: 3px;
                border: 1px solid #555;
                background: #000;
                color: #eee;
            }
            #torn-chain-panel #tcp-chain-display {
                font-size: 34px;
                font-weight: bold;
                margin-top: 4px;
            }
            #torn-chain-panel .tcp-toggle-label {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
            }
            #torn-chain-panel #tcp-sound-volume {
                width: 100%;
                margin-top: 4px;
            }
            #torn-chain-panel.tcp-alert {
                border-color: #0f0;
                animation: tcp-alert-blink 1s infinite;
            }
            @keyframes tcp-alert-blink {
                0%, 100% {
                    box-shadow: 0 0 4px rgba(0,255,0,0.3);
                }
                50% {
                    box-shadow: 0 0 16px rgba(0,255,0,1);
                }
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'torn-chain-panel';
        panel.innerHTML = `
            <div class="tcp-header">
                <span class="tcp-title">Faction Chain Monitor</span>
                <button class="tcp-close" title="Close panel">✕</button>
            </div>
            <div class="tcp-body">
                <div class="tcp-row">
                    <label>
                        API Key:
                        <input type="password" id="tcp-api-key" placeholder="Torn API key">
                    </label>
                    <button class="tcp-btn" id="tcp-save-key">Save</button>
                </div>
                <div class="tcp-row">
                    <label class="tcp-toggle-label">
                        <input type="checkbox" id="tcp-toggle" />
                        <span>Auto update (15s global)</span>
                    </label>
                </div>
                <div class="tcp-row">
                    <label class="tcp-toggle-label">
                        <input type="checkbox" id="tcp-sound-toggle" />
                        <span>Sound alert</span>
                    </label>
                    <input type="range" id="tcp-sound-volume" min="0" max="300" value="100">
                </div>
                <div class="tcp-row">
                    <div id="tcp-chain-display">Chain: --</div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        ui.panel        = panel;
        ui.header       = panel.querySelector('.tcp-header');
        ui.chainDisplay = panel.querySelector('#tcp-chain-display');
        ui.apiInput     = panel.querySelector('#tcp-api-key');
        ui.saveBtn      = panel.querySelector('#tcp-save-key');
        ui.toggle       = panel.querySelector('#tcp-toggle');
        ui.closeBtn     = panel.querySelector('.tcp-close');
        ui.soundToggle  = panel.querySelector('#tcp-sound-toggle');
        ui.soundVolume  = panel.querySelector('#tcp-sound-volume');

        ui.closeBtn.addEventListener('click', () => {
            ui.panel.style.display = 'none';
            localStorage.setItem(PANEL_VISIBLE_KEY, '0');
            if (ui.toggle) {
                ui.toggle.checked = false;
                localStorage.setItem(ENABLED_KEY, '0');
            }
            if (ui.soundToggle) {
                ui.soundToggle.checked = false;
                localStorage.setItem(SOUND_ENABLED_KEY, '0');
            }
            if (ui.panel) {
                ui.panel.classList.remove('tcp-alert');
            }
            stopBeepLoop();
        });

        ui.saveBtn.addEventListener('click', () => {
            const key = ui.apiInput.value.trim();
            localStorage.setItem(API_KEY_KEY, key);
        });

        ui.toggle.addEventListener('change', () => {
            localStorage.setItem(ENABLED_KEY, ui.toggle.checked ? '1' : '0');
        });

        ui.soundToggle.addEventListener('change', () => {
            localStorage.setItem(SOUND_ENABLED_KEY, ui.soundToggle.checked ? '1' : '0');
            if (!ui.soundToggle.checked) {
                stopBeepLoop();
            } else {
                ensureAudioContext();
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
            }
        });

        ui.soundVolume.addEventListener('input', () => {
            const v = ui.soundVolume.value;
            localStorage.setItem(SOUND_VOLUME_KEY, v);
        });

        makePanelDraggable(panel, ui.header);
        restorePanelPosition(panel);
    }

    function makePanelDraggable(panel, handle) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.tagName === 'INPUT') return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop  = rect.top;
            startX    = e.clientX;
            startY    = e.clientY;
            panel.style.right = 'auto';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = (startLeft + dx) + 'px';
            panel.style.top  = (startTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            const rect = panel.getBoundingClientRect();
            const pos = { left: rect.left, top: rect.top };
            localStorage.setItem(PANEL_POS_KEY, JSON.stringify(pos));
        });
    }

    function restorePanelPosition(panel) {
        const raw = localStorage.getItem(PANEL_POS_KEY);
        if (!raw) return;
        try {
            const pos = JSON.parse(raw);
            if (typeof pos.left === 'number' && typeof pos.top === 'number') {
                panel.style.left = pos.left + 'px';
                panel.style.top  = pos.top  + 'px';
                panel.style.right = 'auto';
            }
        } catch (e) {
            console.error('Invalid panel position data', e);
        }
    }

    function initFromStorage() {
        const visibleStored = localStorage.getItem(PANEL_VISIBLE_KEY);
        if (visibleStored === '0') {
            ui.panel.style.display = 'none';
        } else {
            ui.panel.style.display = 'block';
        }

        const apiKey = localStorage.getItem(API_KEY_KEY) || '';
        ui.apiInput.value = apiKey;

        const enabledStored = localStorage.getItem(ENABLED_KEY);
        const enabled = (enabledStored === null) ? true : (enabledStored === '1');
        ui.toggle.checked = enabled;

        const soundEnabledStored = localStorage.getItem(SOUND_ENABLED_KEY);
        const soundEnabled = soundEnabledStored === '1';
        ui.soundToggle.checked = soundEnabled;

        const volumeStored = localStorage.getItem(SOUND_VOLUME_KEY);
        const volume = volumeStored ? Number(volumeStored) : 100;
        ui.soundVolume.value = isNaN(volume) ? 100 : Math.min(300, Math.max(0, volume));

        const raw = localStorage.getItem(DATA_KEY);
        if (raw) {
            lastDataRaw = raw;
            try {
                chainData = JSON.parse(raw);
                if (chainData &&
                    typeof chainData.cooldown === 'number' &&
                    chainData.cooldown > 0 &&
                    !chainData.cooldownExpiresAt &&
                    chainData.receivedAt) {
                    chainData.cooldownExpiresAt =
                        chainData.receivedAt + chainData.cooldown * 1000;
                }
            } catch (e) {
                console.error('Invalid chain data in localStorage', e);
                chainData = null;
            }
        }

        updateDisplay();
    }

    function startTimers() {
        setInterval(updateCountdownAndSync, 1000);
        setInterval(maybeFetch, 1000);
        updateCountdownAndSync();
        maybeFetch();
    }

    function updateCountdownAndSync() {
        const raw = localStorage.getItem(DATA_KEY);
        if (raw && raw !== lastDataRaw) {
            lastDataRaw = raw;
            try {
                const parsed = JSON.parse(raw);
                if (!chainData || !chainData.receivedAt || !parsed.receivedAt || parsed.receivedAt >= chainData.receivedAt) {
                    chainData = parsed;
                    if (chainData &&
                        typeof chainData.cooldown === 'number' &&
                        chainData.cooldown > 0 &&
                        !chainData.cooldownExpiresAt &&
                        chainData.receivedAt) {
                        chainData.cooldownExpiresAt =
                            chainData.receivedAt + chainData.cooldown * 1000;
                    }
                }
            } catch (e) {
                console.error('Invalid chain data in localStorage', e);
            }
        }

        updateDisplay();
    }

    function updateDisplay() {
        if (!ui.chainDisplay) return;

        if (!chainData || typeof chainData.current !== 'number') {
            ui.chainDisplay.textContent = 'Chain: --';
            stopBeepLoop();
            if (ui.panel) {
                ui.panel.classList.remove('tcp-alert');
            }
            return;
        }

        const now = Date.now();

        if (typeof chainData.cooldown === 'number' &&
            chainData.cooldown > 0 &&
            typeof chainData.cooldownExpiresAt === 'number') {

            let remainingCooldown = Math.max(
                0,
                Math.floor((chainData.cooldownExpiresAt - now) / 1000)
            );

            if (remainingCooldown <= 0) {
                chainData.cooldown = 0;
            } else {
                const timeStrCooldown = formatTime(remainingCooldown);
                ui.chainDisplay.textContent = `chain in cooldown - ${timeStrCooldown}`;
                stopBeepLoop();
                if (ui.panel) {
                    ui.panel.classList.remove('tcp-alert');
                }
                return;
            }
        }

        let remainingSeconds = 0;

        if (typeof chainData.expiresAt === 'number') {
            remainingSeconds = Math.max(
                0,
                Math.floor((chainData.expiresAt - now) / 1000)
            );
        } else if (typeof chainData.timeout === 'number' &&
                   typeof chainData.receivedAt === 'number') {
            remainingSeconds = Math.max(
                0,
                Math.floor(chainData.timeout - (now - chainData.receivedAt) / 1000)
            );
        }

        const timeStr = formatTime(remainingSeconds);

        let alertActive = false;
        if (remainingSeconds > 0 &&
            remainingSeconds < 60 &&
            chainData.current > 10 &&
            (!chainData.cooldown || chainData.cooldown <= 0)) {
            alertActive = true;
        }

        const autoEnabled = ui.toggle && ui.toggle.checked;

        if (alertActive && autoEnabled && ui.panel) {
            ui.panel.classList.add('tcp-alert');
        } else if (ui.panel) {
            ui.panel.classList.remove('tcp-alert');
        }

        if (alertActive && autoEnabled && ui.soundToggle && ui.soundToggle.checked) {
            startBeepLoop();
        } else {
            stopBeepLoop();
        }

        ui.chainDisplay.textContent = `#${chainData.current} - ${timeStr}`;
    }

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        const mm = (m < 10 ? '0' : '') + m;
        const ss = (s < 10 ? '0' : '') + s;
        return mm + ':' + ss;
    }

    function maybeFetch() {
        const enabledStored = localStorage.getItem(ENABLED_KEY);
        const enabled = (enabledStored === null) ? true : (enabledStored === '1');
        if (!enabled) return;

        const apiKey = localStorage.getItem(API_KEY_KEY) || '';
        if (!apiKey) return;

        const now = Date.now();
        const lastFetch = Number(localStorage.getItem(LAST_FETCH_KEY) || '0');

        if (now - lastFetch < FETCH_INTERVAL_MS) {
            return;
        }

        const lockRaw = localStorage.getItem(FETCH_LOCK_KEY);
        if (lockRaw) {
            try {
                const lock = JSON.parse(lockRaw);
                if (lock && lock.timestamp && (now - lock.timestamp) < LOCK_TTL_MS && lock.tabId !== tabId) {
                    return;
                }
            } catch (e) {}
        }

        localStorage.setItem(FETCH_LOCK_KEY, JSON.stringify({ tabId, timestamp: now }));

        const lastFetch2 = Number(localStorage.getItem(LAST_FETCH_KEY) || '0');
        const now2 = Date.now();
        if (now2 - lastFetch2 < FETCH_INTERVAL_MS) {
            return;
        }

        fetchChain(apiKey);
    }

    function fetchChain(apiKey) {
        const url = `https://api.torn.com/faction/?selections=chain&key=${encodeURIComponent(apiKey)}`;

        fetch(url, { credentials: 'omit' })
            .then(resp => resp.json())
            .then(json => {
                if (!json) return;
                if (json.error) {
                    console.error('Torn API error:', json.error);
                    return;
                }
                if (!json.chain) return;

                const now = Date.now();
                const chain = json.chain;

                const timeoutSeconds = typeof chain.timeout === 'number' ? chain.timeout : 0;
                let expiresAt = 0;
                if (typeof chain.end === 'number' && chain.end > 0) {
                    expiresAt = chain.end * 1000;
                } else {
                    expiresAt = now + timeoutSeconds * 1000;
                }

                const data = {
                    current:  chain.current,
                    max:      chain.max,
                    timeout:  timeoutSeconds,
                    modifier: chain.modifier,
                    cooldown: chain.cooldown,
                    start:    chain.start,
                    end:      chain.end,
                    receivedAt: now,
                    expiresAt: expiresAt,
                    cooldownExpiresAt: (chain.cooldown && chain.cooldown > 0)
                        ? now + chain.cooldown * 1000
                        : 0
                };

                const raw = JSON.stringify(data);
                lastDataRaw = raw;
                chainData   = data;

                localStorage.setItem(DATA_KEY, raw);
                localStorage.setItem(LAST_FETCH_KEY, String(now));

                updateDisplay();
            })
            .catch(err => {
                console.error('Error fetching Torn chain:', err);
            });
    }

    function ensureAudioContext() {
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) {
                audioCtx = new AC();
            }
        }
    }

    function startBeepLoop() {
        if (isBeeping) return;
        ensureAudioContext();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        isBeeping = true;
        playBeep();
        beepIntervalId = setInterval(playBeep, 1000);
    }

    function stopBeepLoop() {
        if (!isBeeping) return;
        isBeeping = false;
        if (beepIntervalId) {
            clearInterval(beepIntervalId);
            beepIntervalId = null;
        }
    }

    function playBeep() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const volumePercent = ui.soundVolume ? Number(ui.soundVolume.value || 0) : 100;
        const gainValue = Math.max(0, Math.min(3, volumePercent / 100));
        gain.gain.value = gainValue;
        osc.frequency.value = 880;
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;
        osc.start(now);
        osc.stop(now + 0.2);
    }

})();
