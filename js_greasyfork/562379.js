// ==UserScript==
// @name         Live Faction Attack Feed (Ranked Wars)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  A floating box that displays your faction's recent attacks for ranked wars with FULL customization
// @author       ANITABURN
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @license      All Rights Reserved
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562379/Live%20Faction%20Attack%20Feed%20%28Ranked%20Wars%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562379/Live%20Faction%20Attack%20Feed%20%28Ranked%20Wars%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_KEY = 'torn_faction_feed_apikey';
    const BOX_POS_KEY = 'torn_faction_feed_pos';
    const MY_ID_KEY = 'torn_faction_feed_myid';
    const SETTINGS_KEY = 'torn_faction_feed_settings';

    const defaultSettings = {
        refreshRate: 30, 
        boxWidth: 360,
        boxHeight: 320,
        maxAttacks: 15,
        opacity: 100,
        winColor: '#66bb6a',
        lossColor: '#ef5350',
        stalemateColor: '#ffa726',
        assistColor: '#42a5f5',
        bgColor: '#282828',
        showRespect: true,
        showModifiers: true,
        showAttacker: true,
        soundEnabled: false,
        highlightNewAttacks: true,
        compactMode: false,
        filterResults: 'all',
        filterAttacker: 'all',
        filterAttackType: 'all'
    };

    let settings = Object.assign({}, defaultSettings, JSON.parse(GM_getValue(SETTINGS_KEY, '{}')));

    // Migration Check
    if (settings.refreshRate > 100) {
        settings.refreshRate = Math.floor(settings.refreshRate / 1000);
        if (settings.refreshRate < 5) settings.refreshRate = 5;
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    let apiKey = GM_getValue(API_KEY_KEY) || '';
    let myId = GM_getValue(MY_ID_KEY);
    let isDragging = false;
    let isResizing = false;
    let dragOffset = { x: 0, y: 0 };
    let resizeStart = { x: 0, y: 0, w: 0, h: 0 };
    let refreshInterval = null;
    let lastAttacks = {};
    let factionMembers = {};
    
    // Audio Context Global
    let audioCtx = null;

    function saveSettings() {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    function createStyles() {
        const style = document.getElementById('attack-feed-styles');
        if (style) style.remove();

        const fontSize = settings.compactMode ? 11 : 13;
        const padding = settings.compactMode ? '6px 10px' : '8px 12px';

        GM_addStyle(`
            #attack-feed-box {
                position: fixed; width: ${settings.boxWidth}px; height: ${settings.boxHeight}px;
                background: ${settings.bgColor}; color: #ddd; border: 1px solid #444; border-radius: 8px;
                z-index: 99999; font-family: 'Segoe UI', Arial, sans-serif;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: ${fontSize}px;
                opacity: ${settings.opacity / 100}; display: flex; flex-direction: column; overflow: hidden;
            }
            #attack-feed-header {
                flex: 0 0 auto; padding: ${padding};
                background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
                cursor: move; border-bottom: 1px solid #333; font-weight: 700;
                display: flex; justify-content: space-between; align-items: center; color: #fff; user-select: none;
            }
            #attack-feed-status {
                cursor: pointer; font-size: ${fontSize - 3}px; text-transform: uppercase;
                letter-spacing: 0.5px; color: #888; margin-right: 10px; transition: color 0.2s;
            }
            #attack-feed-status:hover { color: #fff; text-decoration: underline; }
            #attack-feed-settings-btn {
                cursor: pointer; padding: 2px 8px; background: #333; border-radius: 4px;
                font-size: ${fontSize - 2}px; transition: background 0.2s;
            }
            #attack-feed-settings-btn:hover { background: #444; }
            #attack-feed-content { flex: 1; overflow-y: auto; min-height: 0; }
            #attack-feed-content::-webkit-scrollbar { width: 6px; }
            #attack-feed-content::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }

            .feed-item {
                padding: ${padding}; border-bottom: 1px solid #333; display: flex;
                justify-content: space-between; align-items: center; background: ${settings.bgColor};
                transition: background 0.3s;
            }
            .feed-item:last-child { border-bottom: none; }
            .feed-item.new-attack { animation: highlight 2s ease-out; }
            @keyframes highlight { 0% { background: rgba(255, 255, 255, 0.2); } 100% { background: ${settings.bgColor}; } }

            .feed-win { border-left: 5px solid ${settings.winColor}; background: ${settings.winColor}14; }
            .feed-loss { border-left: 5px solid ${settings.lossColor}; background: ${settings.lossColor}14; }
            .feed-stalemate { border-left: 5px solid ${settings.stalemateColor}; background: ${settings.stalemateColor}0d; }
            .feed-assist { border-left: 5px solid ${settings.assistColor}; background: ${settings.assistColor}0d; }

            .feed-info { display: flex; flex-direction: column; flex: 1; }
            .feed-name { font-weight: bold; color: #fff; margin-bottom: ${settings.compactMode ? '1px' : '2px'};}
            .feed-attacker { font-size: ${fontSize - 2}px; color: #64b5f6; margin-bottom: ${settings.compactMode ? '1px' : '2px'}; }
            .feed-meta { font-size: ${fontSize - 2}px; color: #aaa; }
            .feed-stats { display: flex; flex-direction: column; align-items: flex-end; font-size: ${fontSize - 2}px; }
            .feed-respect { font-weight: bold; font-size: ${fontSize - 1}px; margin-bottom: 2px; }
            .gain-pos { color: ${settings.winColor}; }
            .gain-neg { color: ${settings.lossColor}; }
            .feed-mods { color: #999; font-size: ${fontSize - 3}px; }
            .status-live { color: ${settings.winColor} !important; }
            .status-error { color: ${settings.lossColor} !important; }

            #attack-feed-resize-handle {
                position: absolute; bottom: 0; right: 0; width: 15px; height: 15px;
                cursor: nwse-resize; z-index: 100000;
                background: linear-gradient(135deg, transparent 0%, transparent 50%, #555 50%, #555 100%);
            }

            #settings-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: ${settings.bgColor}; border: 1px solid #444; border-radius: 8px;
                padding: 20px; z-index: 999999; box-shadow: 0 8px 32px rgba(0,0,0,0.8);
                color: #ddd; width: 440px; max-height: 85vh; overflow-y: auto;
            }
            #settings-modal h3 { margin: 0 0 15px 0; color: #fff; font-size: 16px; }
            .settings-section { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #333; }
            .settings-section:last-of-type { border-bottom: none; }
            .settings-section h4 { margin: 0 0 10px 0; color: #aaa; font-size: 12px; text-transform: uppercase; }
            .settings-group { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
            .settings-group label { font-size: 13px; color: #ccc; flex: 1; }
            .settings-group input, .settings-group select {
                padding: 6px; background: #1a1a1a; border: 1px solid #444; border-radius: 4px;
                color: #ddd; font-size: 13px; width: 100px;
            }
            .settings-group input[type="password"] { width: 100%; max-width: 360px; }
            .settings-group input[type="range"] { width: 100px; }
            .settings-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
            .settings-group .range-value { width: 40px; text-align: right; color: #aaa; font-size: 12px; }

            .settings-buttons { display: flex; gap: 10px; margin-top: 20px; }
            .settings-buttons button { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; }
            .btn-save { background: ${settings.winColor}; color: #fff; }
            .btn-reset { background: #555; color: #fff; }
            .btn-cancel { background: #333; color: #fff; }
            .btn-test { background: #42a5f5; color: #fff; width: 50px; margin-left:10px; font-size:10px; padding: 4px; }

            #settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 999998; }
        `);
    }

    function createUI() {
        if (document.getElementById('attack-feed-box')) return;

        const box = document.createElement('div');
        box.id = 'attack-feed-box';
        const savedPos = JSON.parse(GM_getValue(BOX_POS_KEY, '{"top":"150px","left":"50px"}'));
        box.style.top = savedPos.top;
        box.style.left = savedPos.left;

        box.innerHTML = `
            <div id="attack-feed-header">
                <span>🎯 Faction Attacks</span>
                <div>
                    <span id="attack-feed-status" title="Click to refresh">Wait...</span>
                    <span id="attack-feed-settings-btn">⚙️</span>
                </div>
            </div>
            <div id="attack-feed-content">
                <div style="padding:15px; text-align:center; color:#888;">Initializing...</div>
            </div>
            <div id="attack-feed-resize-handle"></div>
        `;

        document.body.appendChild(box);

        const header = box.querySelector('#attack-feed-header');
        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'attack-feed-settings-btn' || e.target.id === 'attack-feed-status') return;
            isDragging = true;
            dragOffset.x = e.clientX - box.offsetLeft;
            dragOffset.y = e.clientY - box.offsetTop;
        });

        document.getElementById('attack-feed-status').addEventListener('click', () => { fetchAttacks(); });
        document.getElementById('attack-feed-settings-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showSettingsModal();
        });

        const resizeHandle = box.querySelector('#attack-feed-resize-handle');
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            resizeStart.w = box.offsetWidth;
            resizeStart.h = box.offsetHeight;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                box.style.left = (e.clientX - dragOffset.x) + 'px';
                box.style.top = (e.clientY - dragOffset.y) + 'px';
            } else if (isResizing) {
                e.preventDefault();
                const newWidth = resizeStart.w + (e.clientX - resizeStart.x);
                const newHeight = resizeStart.h + (e.clientY - resizeStart.y);
                if (newWidth >= 280) { settings.boxWidth = newWidth; box.style.width = newWidth + 'px'; }
                if (newHeight >= 150) { settings.boxHeight = newHeight; box.style.height = newHeight + 'px'; }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) { isDragging = false; GM_setValue(BOX_POS_KEY, JSON.stringify({ top: box.style.top, left: box.style.left })); }
            if (isResizing) { isResizing = false; saveSettings(); }
        });
    }

    function showSettingsModal() {
        const memberOptions = Object.entries(factionMembers).sort((a, b) => a[1].localeCompare(b[1]))
            .map(([id, name]) => `<option value="${id}">${name} [${id}]</option>`).join('');

        const currentApiKey = GM_getValue(API_KEY_KEY) || '';
        const overlay = document.createElement('div');
        overlay.id = 'settings-overlay';
        const modal = document.createElement('div');
        modal.id = 'settings-modal';

        const apiKeyHtml = `<input type="password" id="setting-api-key" value="${currentApiKey}" placeholder="Enter your API Key">`;

        modal.innerHTML = `
            <h3>⚙️ Attack Feed Settings</h3>
            <div class="settings-section">
                <h4>API Configuration</h4>
                <div class="settings-group" style="display:block;">
                    <label style="display:block; margin-bottom: 5px;">API Key</label>
                    ${apiKeyHtml}
                </div>
            </div>

            <div class="settings-section">
                <h4>Filters</h4>
                <div class="settings-group">
                    <label>Result Type</label>
                    <select id="setting-filter-result">
                        <option value="all" ${settings.filterResults === 'all' ? 'selected' : ''}>All</option>
                        <option value="wins" ${settings.filterResults === 'wins' ? 'selected' : ''}>Wins Only</option>
                        <option value="losses" ${settings.filterResults === 'losses' ? 'selected' : ''}>Losses Only</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label>Attacker</label>
                    <select id="setting-filter-attacker">
                        <option value="all" ${settings.filterAttacker === 'all' ? 'selected' : ''}>All Members</option>
                        ${memberOptions}
                    </select>
                </div>
                <div class="settings-group">
                    <label>Attack Type</label>
                    <select id="setting-filter-type">
                        <option value="all" ${settings.filterAttackType === 'all' ? 'selected' : ''}>All</option>
                        <option value="war" ${settings.filterAttackType === 'war' ? 'selected' : ''}>War Only</option>
                        <option value="regular" ${settings.filterAttackType === 'regular' ? 'selected' : ''}>Regular Only</option>
                    </select>
                </div>
            </div>

            <div class="settings-section">
                <h4>Display Options</h4>
                <div class="settings-group">
                    <label>Refresh Rate (sec)</label>
                    <input type="number" id="setting-refresh" value="${settings.refreshRate}" min="5" step="1">
                </div>
                <div class="settings-group">
                    <label>Max Attacks Shown</label>
                    <input type="number" id="setting-max-attacks" value="${settings.maxAttacks}" min="5" max="50" step="5">
                </div>
                <div class="settings-group">
                    <label>Opacity</label>
                    <input type="range" id="setting-opacity" value="${settings.opacity}" min="20" max="100" step="5">
                    <span class="range-value" id="opacity-value">${settings.opacity}%</span>
                </div>
                <div class="settings-group">
                    <label>Compact Mode</label>
                    <input type="checkbox" id="setting-compact" ${settings.compactMode ? 'checked' : ''}>
                </div>
                <div class="settings-group">
                    <label>Show Attacker Name</label>
                    <input type="checkbox" id="setting-show-attacker" ${settings.showAttacker ? 'checked' : ''}>
                </div>
                <div class="settings-group">
                    <label>Show Respect Gain</label>
                    <input type="checkbox" id="setting-show-respect" ${settings.showRespect ? 'checked' : ''}>
                </div>
                <div class="settings-group">
                    <label>Show Modifiers (War/Chain)</label>
                    <input type="checkbox" id="setting-show-mods" ${settings.showModifiers ? 'checked' : ''}>
                </div>
            </div>

            <div class="settings-section">
                <h4>Colors</h4>
                <div class="settings-group"><label>Background Color</label><input type="color" id="setting-bg-color" value="${settings.bgColor}"></div>
                <div class="settings-group"><label>Win Color</label><input type="color" id="setting-win-color" value="${settings.winColor}"></div>
                <div class="settings-group"><label>Loss Color</label><input type="color" id="setting-loss-color" value="${settings.lossColor}"></div>
                <div class="settings-group"><label>Stalemate Color</label><input type="color" id="setting-stalemate-color" value="${settings.stalemateColor}"></div>
                <div class="settings-group"><label>Assist Color</label><input type="color" id="setting-assist-color" value="${settings.assistColor}"></div>
            </div>

            <div class="settings-section">
                <h4>Notifications</h4>
                <div class="settings-group">
                    <label>Highlight New Attacks</label>
                    <input type="checkbox" id="setting-highlight" ${settings.highlightNewAttacks ? 'checked' : ''}>
                </div>
                <div class="settings-group">
                    <label>Sound Notifications</label>
                    <div style="display:flex; align-items:center;">
                        <input type="checkbox" id="setting-sound" ${settings.soundEnabled ? 'checked' : ''}>
                        <button class="btn-test" id="btn-test-sound">Test</button>
                    </div>
                </div>
            </div>

            <div class="settings-buttons">
                <button class="btn-save" id="btn-save-settings">Save</button>
                <button class="btn-reset" id="btn-reset-settings">Reset</button>
                <button class="btn-cancel" id="btn-cancel-settings">Cancel</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const opacitySlider = document.getElementById('setting-opacity');
        const opacityValue = document.getElementById('opacity-value');
        opacitySlider.addEventListener('input', (e) => { opacityValue.textContent = e.target.value + '%'; });

        overlay.addEventListener('click', closeSettingsModal);

        // TEST SOUND BUTTON
        document.getElementById('btn-test-sound').addEventListener('click', (e) => {
            e.stopPropagation();
            triggerBeep(true); // Force play
        });

        document.getElementById('btn-save-settings').addEventListener('click', () => {
            const newApiKey = document.getElementById('setting-api-key').value.trim();
            if (newApiKey && newApiKey !== apiKey) {
                apiKey = newApiKey;
                GM_setValue(API_KEY_KEY, apiKey);
                myId = null;
                GM_setValue(MY_ID_KEY, null);
            }

            settings.refreshRate = parseInt(document.getElementById('setting-refresh').value);
            settings.maxAttacks = parseInt(document.getElementById('setting-max-attacks').value);
            settings.opacity = parseInt(document.getElementById('setting-opacity').value);
            settings.compactMode = document.getElementById('setting-compact').checked;
            settings.showAttacker = document.getElementById('setting-show-attacker').checked;
            settings.showRespect = document.getElementById('setting-show-respect').checked;
            settings.showModifiers = document.getElementById('setting-show-mods').checked;
            settings.bgColor = document.getElementById('setting-bg-color').value;
            settings.winColor = document.getElementById('setting-win-color').value;
            settings.lossColor = document.getElementById('setting-loss-color').value;
            settings.stalemateColor = document.getElementById('setting-stalemate-color').value;
            settings.assistColor = document.getElementById('setting-assist-color').value;
            settings.highlightNewAttacks = document.getElementById('setting-highlight').checked;
            settings.soundEnabled = document.getElementById('setting-sound').checked;
            settings.filterResults = document.getElementById('setting-filter-result').value;
            settings.filterAttacker = document.getElementById('setting-filter-attacker').value;
            settings.filterAttackType = document.getElementById('setting-filter-type').value;

            saveSettings();
            closeSettingsModal();
            applySettings();
            if (apiKey) identifySelf(apiKey);
        });

        document.getElementById('btn-reset-settings').addEventListener('click', () => {
             if (confirm('Reset all settings to default?')) {
                settings = Object.assign({}, defaultSettings);
                saveSettings();
                closeSettingsModal();
                applySettings();
            }
        });

        document.getElementById('btn-cancel-settings').addEventListener('click', closeSettingsModal);
    }

    function closeSettingsModal() {
        const overlay = document.getElementById('settings-overlay');
        const modal = document.getElementById('settings-modal');
        if (overlay) overlay.remove();
        if (modal) modal.remove();
    }

    function applySettings() {
        createStyles();
        const box = document.getElementById('attack-feed-box');
        if (box) {
            box.style.width = settings.boxWidth + 'px';
            box.style.height = settings.boxHeight + 'px';
            box.style.opacity = settings.opacity / 100;
        }
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(fetchAttacks, settings.refreshRate * 1000);
        const currentData = document.getElementById('attack-feed-content').getAttribute('data-attacks');
        if (currentData) renderFeed(JSON.parse(currentData));
    }

    // --- AUDIO SYSTEM ---
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    // Unlock Audio on interaction
    document.addEventListener('click', () => { initAudio(); }, {once:true});

    function triggerBeep(force = false) {
        if (!settings.soundEnabled && !force) return;
        
        initAudio(); // Ensure context exists
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800; // Hz
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    // --- DATA LOGIC ---
    function identifySelf(key) {
        if (myId) { fetchFactionMembers(); return; }
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=basic&key=${key}&_=${Date.now()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.player_id) {
                        myId = data.player_id;
                        GM_setValue(MY_ID_KEY, myId);
                        fetchFactionMembers();
                    } else showError('Invalid API Key');
                } catch(e) { showError('API Error'); }
            }
        });
    }

    function fetchFactionMembers() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/?selections=basic&key=${apiKey}&_=${Date.now()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.members) {
                        factionMembers = {};
                        Object.entries(data.members).forEach(([id, member]) => factionMembers[id] = member.name);
                    }
                    fetchAttacks();
                } catch(e) { fetchAttacks(); }
            }
        });
    }

    function fetchAttacks() {
        if (!apiKey) return;
        if (!myId) { identifySelf(apiKey); return; }

        const statusLabel = document.getElementById('attack-feed-status');
        if(statusLabel) {
            statusLabel.innerText = "Updating...";
            statusLabel.className = '';
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/?selections=attacks&limit=50&key=${apiKey}&_=${Date.now()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        if (data.error.code === 2) showError('Invalid Key');
                        else showError(`Error ${data.error.code}`);
                        return;
                    }

                    const newAttackIds = Object.keys(data.attacks);
                    const oldAttackIds = Object.keys(lastAttacks);
                    const hasNewAttacks = newAttackIds.some(id => !oldAttackIds.includes(id));

                    if (hasNewAttacks && oldAttackIds.length > 0) {
                        triggerBeep(false); // Play sound if enabled
                    }

                    lastAttacks = data.attacks;
                    renderFeed(data.attacks, hasNewAttacks);

                    if(statusLabel) {
                        const now = new Date();
                        const timeStr = now.toLocaleTimeString([], { hour12: false });
                        statusLabel.innerText = `Live ${timeStr}`;
                        statusLabel.className = 'status-live';
                    }
                } catch(e) { showError('Parse Error'); }
            },
            onerror: function() { showError('Net Error'); }
        });
    }

    function showError(msg) {
        const content = document.getElementById('attack-feed-content');
        const statusLabel = document.getElementById('attack-feed-status');
        if (content && content.innerText === 'Initializing...') {
            content.innerHTML = `<div style="padding:10px; color:${settings.lossColor}; text-align:center;">${msg}</div>`;
        }
        if (statusLabel) {
            statusLabel.innerText = msg;
            statusLabel.className = 'status-error';
        }
    }

    function renderFeed(attacksData, hasNewAttacks = false) {
        const content = document.getElementById('attack-feed-content');
        if (!attacksData || Object.keys(attacksData).length === 0) {
            content.innerHTML = '<div style="padding:15px; text-align:center; color:#888;">No recent attacks</div>';
            return;
        }
        
        content.setAttribute('data-attacks', JSON.stringify(attacksData));

        let attacks = Object.entries(attacksData).sort((a, b) => b[1].timestamp_ended - a[1].timestamp_ended);

        if (settings.filterAttacker !== 'all') {
            attacks = attacks.filter(([id, att]) => att.attacker_id == settings.filterAttacker);
        }
        if (settings.filterResults !== 'all') {
             const successTypes = ['Hospitalized', 'Mugged', 'Attacked', 'Arrested'];
             const lossTypes = ['Lost', 'Escape'];
             const assistTypes = ['Assist'];
             attacks = attacks.filter(([id, att]) => {
                if (settings.filterResults === 'wins') return successTypes.includes(att.result);
                if (settings.filterResults === 'losses') return lossTypes.includes(att.result);
                if (settings.filterResults === 'stalemates') return att.result === 'Stalemate';
                if (settings.filterResults === 'assists') return assistTypes.includes(att.result);
                return true;
             });
        }
        if (settings.filterAttackType !== 'all') {
            attacks = attacks.filter(([id, att]) => {
                const hasWarMod = att.modifiers && att.modifiers.war;
                if (settings.filterAttackType === 'war') return hasWarMod;
                if (settings.filterAttackType === 'regular') return !hasWarMod;
                return true;
            });
        }

        attacks = attacks.slice(0, settings.maxAttacks);

        let html = '';
        attacks.forEach(([attackId, att], index) => {
            const attackerName = att.attacker_name || 'Unknown';
            const defenderName = att.defender_name || 'Someone';
            
            let resultClass = 'feed-stalemate';
            const successTypes = ['Hospitalized', 'Mugged', 'Attacked', 'Arrested'];
            const lossTypes = ['Lost', 'Escape'];
            const assistTypes = ['Assist'];

            if (successTypes.includes(att.result)) resultClass = 'feed-win';
            else if (lossTypes.includes(att.result)) resultClass = 'feed-loss';
            else if (assistTypes.includes(att.result)) resultClass = 'feed-assist';
            else if (att.result === 'Stalemate') resultClass = 'feed-stalemate';

            const date = new Date(att.timestamp_ended * 1000);
            const now = new Date();
            const diffMins = Math.floor((now - date) / 60000);
            let timeStr = (diffMins < 60) ? `${diffMins}m ago` : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let respectHtml = '';
            if (settings.showRespect && att.respect && att.respect > 0) {
                respectHtml = `<div class="feed-respect"><span class="gain-pos">+${att.respect.toFixed(2)} R</span></div>`;
            }

            let modsHtml = '';
            if (settings.showModifiers && att.modifiers) {
                const mods = [];
                if (att.modifiers.war) mods.push(`War: ${att.modifiers.war}x`);
                if (att.modifiers.group_attack) mods.push('Group');
                if (att.modifiers.chain_bonus) mods.push(`Chain: ${att.modifiers.chain_bonus}`);
                if (mods.length > 0) modsHtml = `<div class="feed-mods">${mods.join(' • ')}</div>`;
            }

            const attackerHtml = settings.showAttacker ? `<div class="feed-attacker">${attackerName} [${att.attacker_id}]</div>` : '';
            const newAttackClass = (hasNewAttacks && settings.highlightNewAttacks && index === 0) ? 'new-attack' : '';

            html += `
                <div class="feed-item ${resultClass} ${newAttackClass}">
                    <div class="feed-info">
                        ${attackerHtml}
                        <div class="feed-name">${defenderName} [${att.defender_id}]</div>
                        <div class="feed-meta">${timeStr} • ${att.result}</div>
                    </div>
                    <div class="feed-stats">
                        ${respectHtml}
                        ${modsHtml}
                    </div>
                </div>
            `;
        });
        content.innerHTML = html;
    }

    createStyles();
    createUI();

    setTimeout(() => {
        apiKey = GM_getValue(API_KEY_KEY);
        myId = GM_getValue(MY_ID_KEY);
        if (apiKey) identifySelf(apiKey);
        else fetchAttacks();
    }, 500);

    refreshInterval = setInterval(fetchAttacks, settings.refreshRate * 1000);

})();