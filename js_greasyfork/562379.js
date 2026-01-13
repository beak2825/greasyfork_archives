// ==UserScript==
// @name         Torn Faction War Feed
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Live ar attack feed floating window on faction page 
// @author       ANITABURN
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/562379/Torn%20Faction%20War%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/562379/Torn%20Faction%20War%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const STORAGE_PREFIX = 'torn_warfeed_v4_';
    const KEYS = {
        API: STORAGE_PREFIX + 'apikey',
        POS: STORAGE_PREFIX + 'pos',
        FAC_ID: STORAGE_PREFIX + 'fac_id',
        SETTINGS: STORAGE_PREFIX + 'settings'
    };

    // --- Default Settings ---
    const DEFAULTS = {
        bgColor: '#121212',
        winColor: '#00e676',    // Green (Outgoing Win)
        lossColor: '#ff1744',   // Red (Incoming Loss OR Outgoing Fail)
        defendColor: '#2979ff', // Blue (Incoming Fail/Defend)
        textColor: '#e0e0e0',   // Base text
        fontSize: '12px',
        boxWidth: '350px',
        refreshRate: 15
    };

    // --- State ---
    let settings = { ...DEFAULTS, ...JSON.parse(GM_getValue(KEYS.SETTINGS, '{}')) };
    let apiKey = GM_getValue(KEYS.API, '');
    let myFactionId = GM_getValue(KEYS.FAC_ID);
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let intervalId = null;

    // --- CSS Generation ---
    function updateStyles() {
        const css = `
            :root {
                --wf-bg: ${settings.bgColor};
                --wf-win: ${settings.winColor};
                --wf-loss: ${settings.lossColor};
                --wf-def: ${settings.defendColor};
                --wf-text: ${settings.textColor};
                --wf-font: ${settings.fontSize};
                --wf-width: ${settings.boxWidth};
            }
            #wf-box {
                position: fixed;
                width: var(--wf-width);
                background: var(--wf-bg);
                color: var(--wf-text);
                border: 1px solid #333;
                border-radius: 6px;
                z-index: 999999;
                font-family: 'Segoe UI', Arial, sans-serif;
                box-shadow: 0 6px 12px rgba(0,0,0,0.7);
                font-size: var(--wf-font);
                display: flex;
                flex-direction: column;
            }
            #wf-header {
                padding: 8px 12px;
                background: rgba(255,255,255,0.05);
                cursor: move;
                border-bottom: 1px solid #333;
                font-weight: 700;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }
            #wf-controls {
                display: flex;
                gap: 10px;
            }
            .wf-icon {
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .wf-icon:hover { opacity: 1; }

            #wf-content {
                max-height: 350px;
                overflow-y: auto;
                background: rgba(0,0,0,0.2);
                min-height: 50px;
            }
            #wf-content::-webkit-scrollbar { width: 6px; }
            #wf-content::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

            /* Feed Items */
            .wf-item {
                padding: 6px 12px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.2s;
            }
            .wf-item:hover { background: rgba(255,255,255,0.03); }

            /* Status Logic Colors */
            .wf-win { color: var(--wf-win); border-left: 3px solid var(--wf-win); } /* Outgoing Win */
            .wf-loss { color: var(--wf-loss); border-left: 3px solid var(--wf-loss); } /* Incoming Loss OR Outgoing Fail */
            .wf-def { color: var(--wf-def); border-left: 3px solid var(--wf-def); } /* Incoming Defend */

            .wf-names { display: flex; flex-direction: column; }
            .wf-vs { font-size: 0.85em; opacity: 0.6; margin: 0 4px; color: var(--wf-text); }

            .wf-meta {
                text-align: right;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
            .wf-time { font-size: 0.8em; opacity: 0.5; color: var(--wf-text); }
            .wf-res { font-weight: bold; }

            /* Settings Panel */
            #wf-settings {
                display: none;
                padding: 12px;
                background: #1e1e1e;
                border-top: 1px solid #333;
                font-size: 11px;
            }
            .wf-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .wf-input {
                background: #333;
                border: 1px solid #444;
                color: #fff;
                padding: 4px 6px;
                border-radius: 3px;
                width: 90px;
            }
            .wf-input-wide {
                width: 100%;
                margin-top: 4px;
            }
            .wf-btn {
                width: 100%;
                padding: 6px;
                background: #444;
                color: #fff;
                border: none;
                cursor: pointer;
                margin-top: 10px;
                border-radius: 3px;
                font-weight: bold;
            }
            .wf-btn:hover { background: #555; }
            label { color: #bbb; }
        `;

        let styleEl = document.getElementById('wf-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'wf-styles';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
    }

    // --- UI Creation ---
    function createUI() {
        if (document.getElementById('wf-box')) return;

        updateStyles();

        const box = document.createElement('div');
        box.id = 'wf-box';

        const savedPos = JSON.parse(GM_getValue(KEYS.POS, '{"top":"100px","left":"100px"}'));
        box.style.top = savedPos.top;
        box.style.left = savedPos.left;

        box.innerHTML = `
            <div id="wf-header">
                <span>WAR FEED</span>
                <div id="wf-controls">
                    <span id="wf-status" style="font-size:9px; margin-right:10px; padding-top:2px;">INIT</span>
                    <span class="wf-icon" id="wf-btn-settings">⚙️</span>
                </div>
            </div>

            <div id="wf-content">
                <div style="padding:20px; text-align:center; opacity:0.5;">
                    ${apiKey ? 'Initializing...' : 'Please enter API Key in Settings (⚙️)'}
                </div>
            </div>

            <div id="wf-settings">
                <div style="margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                    <label style="display:block;">API Key (Limited Access)</label>
                    <input class="wf-input wf-input-wide" id="set-api" type="password" value="${apiKey}" placeholder="Enter Key Here">
                </div>

                <div class="wf-setting-row">
                    <label>Box Width</label>
                    <input class="wf-input" id="set-width" type="text" value="${settings.boxWidth}">
                </div>
                <div class="wf-setting-row">
                    <label>Refresh (sec)</label>
                    <input class="wf-input" id="set-rate" type="number" min="5" value="${settings.refreshRate}">
                </div>

                <div style="margin-top:10px; font-weight:bold; color:#fff; border-top:1px solid #333; padding-top:5px;">Colors</div>
                <div class="wf-setting-row">
                    <label>Outgoing Win (Green)</label>
                    <input class="wf-input" id="set-win" type="color" value="${settings.winColor}">
                </div>
                <div class="wf-setting-row">
                    <label>Any Loss (Red)</label>
                    <input class="wf-input" id="set-loss" type="color" value="${settings.lossColor}">
                </div>
                <div class="wf-setting-row">
                    <label>Defend (Blue)</label>
                    <input class="wf-input" id="set-def" type="color" value="${settings.defendColor}">
                </div>
                <div class="wf-setting-row">
                    <label>Background</label>
                    <input class="wf-input" id="set-bg" type="color" value="${settings.bgColor}">
                </div>

                 <button class="wf-btn" id="wf-save-settings">Save & Close</button>
            </div>
        `;

        document.body.appendChild(box);

        setupDrag(box);

        document.getElementById('wf-btn-settings').addEventListener('click', () => {
            const p = document.getElementById('wf-settings');
            p.style.display = p.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('wf-save-settings').addEventListener('click', saveSettings);
    }

    function setupDrag(box) {
        const header = box.querySelector('#wf-header');
        header.addEventListener('mousedown', (e) => {
            if(e.target.classList.contains('wf-icon')) return;
            isDragging = true;
            dragOffset.x = e.clientX - box.offsetLeft;
            dragOffset.y = e.clientY - box.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                box.style.left = (e.clientX - dragOffset.x) + 'px';
                box.style.top = (e.clientY - dragOffset.y) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                GM_setValue(KEYS.POS, JSON.stringify({ top: box.style.top, left: box.style.left }));
            }
        });
    }

    function saveSettings() {
        // Save API Key
        const newKey = document.getElementById('set-api').value.trim();
        if (newKey !== apiKey) {
            apiKey = newKey;
            GM_setValue(KEYS.API, apiKey);
            myFactionId = null; // Reset ID to force re-fetch
            GM_setValue(KEYS.FAC_ID, null);
        }

        // Save Visuals
        settings.boxWidth = document.getElementById('set-width').value;
        settings.winColor = document.getElementById('set-win').value;
        settings.lossColor = document.getElementById('set-loss').value;
        settings.defendColor = document.getElementById('set-def').value;
        settings.bgColor = document.getElementById('set-bg').value;
        settings.refreshRate = parseInt(document.getElementById('set-rate').value) || 15;

        GM_setValue(KEYS.SETTINGS, JSON.stringify(settings));
        updateStyles();

        document.getElementById('wf-settings').style.display = 'none';

        // Restart
        if (apiKey) {
            fetchFactionId();
            clearInterval(intervalId);
            intervalId = setInterval(fetchWarFeed, settings.refreshRate * 1000);
        }
    }

    // --- Data Logic ---
    function fetchFactionId() {
        if (myFactionId) {
            fetchWarFeed();
            return;
        }
        if (!apiKey) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=profile&key=${apiKey}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.faction && data.faction.faction_id) {
                    myFactionId = data.faction.faction_id;
                    GM_setValue(KEYS.FAC_ID, myFactionId);
                    fetchWarFeed();
                } else {
                    renderError("Could not find Faction ID. Key correct?");
                }
            }
        });
    }

    function fetchWarFeed() {
        if (!apiKey) {
            const status = document.getElementById('wf-status');
            if(status) status.innerText = "NO KEY";
            return;
        }

        const status = document.getElementById('wf-status');
        if(status) status.innerText = "...";

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/?selections=attacks&limit=25&key=${apiKey}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    if(data.error.code === 2) {
                         renderError("Invalid API Key");
                    } else {
                        renderError(data.error.error);
                    }
                } else {
                    renderFeed(data.attacks);
                }
                if(status) status.innerText = "LIVE";
            }
        });
    }

    function renderFeed(attacksData) {
        const content = document.getElementById('wf-content');
        const attacks = Object.values(attacksData).sort((a, b) => b.timestamp_ended - a.timestamp_ended);

        let html = '';

        attacks.forEach(att => {
            const isMyFacAttacker = (att.attacker_faction === myFactionId);
            const successTypes = ['Hospitalized', 'Mugged', 'Attacked', 'Arrested'];
            const isSuccess = successTypes.includes(att.result);

            // --- Color Logic ---
            let typeClass = '';

            if (isMyFacAttacker) {
                // Outgoing
                if (isSuccess) {
                    typeClass = 'wf-win'; // Green
                } else {
                    typeClass = 'wf-loss'; // Red (Stalemate, Escape, Timeout = Lost attack)
                }
            } else {
                // Incoming
                if (isSuccess) {
                    typeClass = 'wf-loss'; // Red (They hit us)
                } else {
                    typeClass = 'wf-def'; // Blue (We defended)
                }
            }

            // Respect Text
            let respectHtml = '';
            if (att.respect_gain) {
                const prefix = isMyFacAttacker ? '+' : '-';
                respectHtml = `${prefix}${att.respect_gain.toFixed(2)} R`;
            }

            // Names
            const attName = att.attacker_name || `Unknown [${att.attacker_id}]`;
            const defName = att.defender_name || `Unknown [${att.defender_id}]`;
            const timeStr = new Date(att.timestamp_ended * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

            html += `
                <div class="wf-item ${typeClass}">
                    <div class="wf-names">
                        <div>${attName} <span class="wf-vs">vs</span> ${defName}</div>
                        <div style="font-size:0.8em; opacity:0.7;">${att.result}</div>
                    </div>
                    <div class="wf-meta">
                        <div class="wf-res">${respectHtml}</div>
                        <div class="wf-time">${timeStr}</div>
                    </div>
                </div>
            `;
        });

        content.innerHTML = html;
    }

    function renderError(msg) {
        const el = document.getElementById('wf-content');
        if(el) el.innerHTML = `<div style="padding:15px; text-align:center; color:#ff5555;">${msg}</div>`;
    }

    // --- Init ---
    createUI();
    if (apiKey) {
        fetchFactionId();
        intervalId = setInterval(fetchWarFeed, settings.refreshRate * 1000);
    }

})();