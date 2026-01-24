// ==UserScript==
// @name         Live Faction Attack Feed 
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Works best on torn when left aligned setting is enabled on torn tools desktop. Adds a floating box that displays your faction's recent attacks and retaliations for ranked wars with FULL customization and notification sounds.
// @author       ANITABURN
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @license      All Rights Reserved
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562379/Live%20Faction%20Attack%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/562379/Live%20Faction%20Attack%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_KEY = 'torn_faction_feed_apikey';
    const MY_ID_KEY = 'torn_faction_feed_myid';
    const MY_FAC_KEY = 'torn_faction_feed_facid';
    const SETTINGS_KEY = 'torn_faction_feed_settings';
    const BOX_POS_KEY = 'torn_faction_feed_pos';

    const defaultSettings = {
        refreshRate: 30,
        maxAttacks: 15,
        boxWidth: 380,
        boxHeight: 340,
        opacity: 100,
        compactMode: false,
        floatMode: false,
        showAttacker: true,
        showRespect: true,
        showModifiers: true,
        highlightNewAttacks: true,
        soundTypeNormal: 'none',
        soundTypeRetal: 'alarm',
        winColor: '#66bb6a',
        lossColor: '#ef5350',
        stalemateColor: '#ffa726',
        assistColor: '#42a5f5',
        bgColor: '#1e1e1e',
        filterResults: 'all',
        filterAttacker: 'all',
        filterAttackType: 'all'
    };

    let settings = Object.assign({}, defaultSettings, JSON.parse(GM_getValue(SETTINGS_KEY, '{}')));

    if (typeof settings.soundEnabled === 'boolean') {
        settings.soundTypeNormal = settings.soundEnabled ? 'ping' : 'none';
        delete settings.soundEnabled;
    }
    if (typeof settings.retalSoundEnabled === 'boolean') {
        settings.soundTypeRetal = settings.retalSoundEnabled ? 'alarm' : 'none';
        delete settings.retalSoundEnabled;
    }

    let apiKey = GM_getValue(API_KEY_KEY) || '';
    let myId = GM_getValue(MY_ID_KEY);
    let myFactionId = GM_getValue(MY_FAC_KEY);

    let refreshInterval = null;
    let retalTimerInterval = null;
    let lastAttacks = {};
    let factionMembers = {};
    let activeRetals = [];
    let isRetalOpen = false;
    let isFilterOpen = false;
    let isFeedVisible = false;
    let audioCtx = null;

    let cachedTriggerEl = null;
    let lastFeedHTML = '';
    let lastTriggerHTML = '';
    let warListObserver = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isResizing = false;
    let resizeStart = {x: 0, y: 0, w: 0, h: 0};

    const ICONS = {
        gear: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47,0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`,
        copy: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
        sword: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20.71,7.04c.39-.39.39-1.02,0-1.41l-2.34-2.34c-.47-.47-1.12-.29-1.41,0l-1.83,1.83 3.75,3.75 1.83-1.83zM3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z"/></svg>`,
        filter: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`
    };

    function saveSettings() { GM_setValue(SETTINGS_KEY, JSON.stringify(settings)); }

    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }
    document.addEventListener('click', () => initAudio(), {once:true});

    function playSound(typeName) {
        const ctx = initAudio();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (typeName) {
            case 'beep':
                osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15); break;
            case 'ping':
                osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'alarm':
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, now);
                gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
                gain.gain.setValueAtTime(0.1, now + 0.15); gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now); osc.stop(now + 0.35); break;
            case 'chime':
                osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.linearRampToValueAtTime(900, now + 0.1);
                gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'pulse':
                osc.type = 'square'; osc.frequency.setValueAtTime(150, now);
                gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
        }
    }

  function createStyles() {
        const styleId = 'attack-feed-styles';
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        const fontSize = settings.compactMode ? 11 : 13;
        const padding = settings.compactMode ? '6px 10px' : '8px 12px';
        const cursor = settings.floatMode ? 'move' : 'default';

        const css = `
            #attack-feed-box {
                position: ${settings.floatMode ? 'fixed' : 'absolute'};
                width: ${settings.boxWidth}px;
                background: ${settings.bgColor}; color: #e0e0e0; border: 1px solid #444; border-radius: 6px;
                z-index: 999999; font-family: 'Segoe UI', Arial, sans-serif;
                box-shadow: 0 6px 16px rgba(0,0,0,0.6); font-size: ${fontSize}px;
                opacity: ${settings.opacity / 100};
                display: none;
                flex-direction: column; overflow: visible;
                max-height: 80vh;
            }
            #attack-feed-header {
                flex: 0 0 auto; padding: ${padding};
                background: linear-gradient(180deg, #333 0%, #222 100%);
                cursor: ${cursor};
                border-bottom: 1px solid #444; font-weight: 700;
                display: flex; justify-content: space-between; align-items: center; color: #fff; user-select: none;
                position: relative; z-index: 20; border-top-left-radius: 6px; border-top-right-radius: 6px;
            }
            .header-controls { display: flex; align-items: center; gap: 8px; }
            #attack-feed-status { font-size: 10px; color: #888; margin-right: 5px; font-family: monospace; white-space: nowrap; cursor: pointer; }
            #attack-feed-status:hover { color: #fff; }
            #retal-btn {
                background: #333; color: #aaa; padding: 2px 8px; border-radius: 4px;
                font-size: ${fontSize - 1}px; cursor: pointer; border: 1px solid #555; transition: all 0.2s;
            }
            #retal-btn.active { background: #d32f2f; color: #fff; border-color: #f44336; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(211, 47, 47, 0); } 100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); } }

            .header-icon-btn { cursor: pointer; font-size: 14px; opacity: 0.7; transition: opacity 0.2s; display: flex; align-items: center; }
            .header-icon-btn:hover { opacity: 1; color: #fff; }
            .header-icon-btn.active { color: #42a5f5; opacity: 1; }

            #attack-feed-scroll { flex: 1; overflow-y: auto; min-height: 0; position: relative; z-index: 10; overflow-x: hidden; display: flex; flex-direction: column; }
            #attack-feed-scroll::-webkit-scrollbar { width: 6px; }
            #attack-feed-scroll::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }

            #attack-feed-retals {
                display: none;
                border-bottom: 2px solid #ef5350;
                background: ${settings.bgColor};
                max-height: 150px; overflow-y: auto;
                flex-shrink: 0;
            }
            #attack-feed-retals::-webkit-scrollbar { width: 4px; }
            #attack-feed-retals::-webkit-scrollbar-thumb { background: #ef5350; border-radius: 2px; }

            #attack-feed-content { flex: 1; }

            .feed-item {
                padding: ${padding}; border-bottom: 1px solid #333; display: flex;
                justify-content: space-between; align-items: center; background: ${settings.bgColor};
            }
            .feed-item.new-attack { animation: highlight 1.5s ease-out; }
            @keyframes highlight { 0% { background: rgba(255, 255, 255, 0.2); } 100% { background: transparent; } }
            .feed-win { border-left: 4px solid ${settings.winColor}; }
            .feed-loss { border-left: 4px solid ${settings.lossColor}; }
            .feed-stalemate { border-left: 4px solid ${settings.stalemateColor}; }
            .feed-assist { border-left: 4px solid ${settings.assistColor}; }
            .feed-info { display: flex; flex-direction: column; }
            .feed-stats { display: flex; flex-direction: column; align-items: flex-end; }
            .feed-mods { font-size: 0.85em; opacity: 0.7; }

            .retal-item {
                padding: 8px 10px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;
                border-left: 3px solid #ef5350; background: rgba(30,30,30,0.5);
            }
            .retal-info { display: flex; flex-direction: column; }
            .retal-target { font-weight: bold; color: #ef5350; text-decoration: none; font-size: 1.1em; cursor: pointer; display:flex; align-items:center; gap:5px; }
            .retal-target:hover { text-decoration: underline; }
            .retal-victim { font-size: 0.85em; color: #aaa; margin-top: 2px; }
            .retal-actions { display: flex; align-items: center; gap: 8px; }
            .retal-timer { font-weight: bold; font-family: monospace; font-size: 1.1em; color: #fff; }
            .btn-alert {
                background: #444; border: 1px solid #666; color: #ccc; padding: 4px 8px;
                font-size: 10px; cursor: pointer; border-radius: 3px; transition: all 0.2s; display:flex; align-items:center; gap:4px;
            }
            .btn-alert:hover { background: #666; color: #fff; }
            #attack-feed-resize-handle {
                position: absolute; bottom: 0; right: 0; width: 15px; height: 15px;
                cursor: nwse-resize; z-index: 100000;
                background: linear-gradient(135deg, transparent 0%, transparent 50%, #555 50%, #555 100%);
            }

            #feed-filter-menu {
                position: absolute; top: 35px; right: 5px; width: 220px;
                background: #222; border: 1px solid #444; border-radius: 4px;
                padding: 10px; z-index: 999999; box-shadow: 0 4px 12px rgba(0,0,0,0.8);
                display: none;
            }
            #feed-filter-menu.show { display: block; }
            .filter-group { margin-bottom: 8px; }
            .filter-group label { display: block; font-size: 11px; color: #aaa; margin-bottom: 3px; }
            .filter-group select {
                width: 100%; padding: 4px; background: #111; color: #eee;
                border: 1px solid #444; border-radius: 3px; font-size: 11px;
            }

            #settings-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #222; border: 1px solid #444; border-radius: 4px;
                padding: 20px; z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.9);
                color: #ddd; width: 440px; max-height: 85vh; overflow-y: auto;
                box-sizing: border-box; font-family: Arial, sans-serif;
            }
            #settings-modal h3 { font-weight: bold; text-align: left; font-size: 22px; margin-top: 5px; margin-bottom: 20px; color: #fff; border-bottom: none; padding-bottom: 10px; }
            .settings-section { margin-bottom: 15px; padding: 5px 0 10px 0; border: none !important; background: transparent !important; position: relative; margin-top: 15px; }
            .settings-section h4 { margin: 0 0 12px 0; margin-top: 0px; margin-bottom: 12px; color: #e066ff; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; border-bottom: none; padding-bottom: 6px; }
            .settings-group { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .settings-group label { font-size: 12px; color: #ccc; flex: 1; text-align: left; }
            .settings-group input:not([type="checkbox"]), .settings-group select { padding: 5px; background: #111; border: 1px solid #555; color: #eee; font-size: 12px; width: 140px; box-sizing: border-box; border-radius: 2px; }
            .settings-group input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; margin: 0; }
            .settings-group.block { display: block; }
            .settings-group.block label { display: block; margin-bottom: 4px; }
            .settings-group.block input { width: 100%; }
            .settings-buttons { display: flex; gap: 10px; margin-top: 20px; border-top: none; position: relative; z-index: 10; }
            .settings-buttons button { flex: 1; padding: 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; text-transform: uppercase; transition: background-color 0.2s; }
            .btn-save { background: #4caf50; color: white; border: none; }
            .btn-save:hover { background: #56c25b; }
            .btn-reset { background: #ef5350; color: white; border: none; }
            .btn-reset:hover { background: #ff605d; }
            .btn-cancel { background: #757575; color: white; border: none; }
            .btn-cancel:hover { background: #888888; }
            #btn-test-sound { width: 100%; margin-top: 10px; padding: 8px; background: transparent; color: #ccc; border: 1px solid #555; cursor: pointer; font-size:12px; text-transform: uppercase; border-radius: 2px; }
            #btn-test-sound:hover { background: rgba(255,255,255,0.05); color: #fff; }
            #settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999998; }

            .mini-feed-container {
                width: 254px;
                height: 109px !important;
                display: flex; flex-direction: column; justify-content: space-between;
                padding: 4px 8px; box-sizing: border-box;
                background: linear-gradient(180deg, #383838 0%, #242424 100%);
                border: 1px solid #444; border-radius: 5px;
                color: #ddd; font-family: 'Segoe UI', Arial; font-size: 11px;
                line-height: 1.3;
            }
            .mini-row-top { display: flex; justify-content: space-between; width: 100%; margin-bottom: 2px; }
            .mini-attacker { color: #42a5f5; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45%; }
            .mini-defender { color: #fff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 45%; text-align: right; }
            .mini-row-mid { display: flex; justify-content: space-between; width: 100%; font-size: 10px; color: #999; margin-bottom: 4px; }
            .mini-res { font-weight: bold; }
            .mini-row-bot { display: flex; justify-content: space-between; width: 100%; align-items: center; border-top: 1px solid #444; padding-top: 3px; }
            .mini-retals { color: #ef5350; font-weight: bold; font-size: 11px; }
            .mini-link { color: #42a5f5; cursor: pointer; font-weight: 600; }
            .mini-link:hover { text-decoration: underline; }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createUI() {
        if (document.getElementById('attack-feed-box')) return;
        const box = document.createElement('div');
        box.id = 'attack-feed-box';

        box.innerHTML = `
            <div id="attack-feed-header">
                <span>Faction Feed</span>
                <div class="header-controls">
                    <span id="attack-feed-status" title="Last Updated">Wait...</span>
                    <button id="retal-btn">Retal: 0</button>
                    <span id="attack-feed-filter-btn" class="header-icon-btn" title="Filters">${ICONS.filter}</span>
                    <span id="attack-feed-settings-btn" class="header-icon-btn" title="Settings">${ICONS.gear}</span>
                </div>
            </div>
            <div id="feed-filter-menu"></div>
            <div id="attack-feed-scroll">
                <div id="attack-feed-retals"></div>
                <div id="attack-feed-content"><div style="padding:20px; text-align:center; color:#888;">Initializing...</div></div>
            </div>
            <div id="attack-feed-resize-handle"></div>
        `;
        document.body.appendChild(box);
        setupDrag(box);
        setupResize(box);

        document.getElementById('attack-feed-status').addEventListener('click', (e) => { e.stopPropagation(); fetchAttacks(); });
        document.getElementById('attack-feed-settings-btn').addEventListener('click', (e) => { e.stopPropagation(); showSettingsModal(); });
        document.getElementById('attack-feed-filter-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleFilterMenu(); });
        document.getElementById('retal-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleRetalView(); });
    }

    function setupDrag(box) {
        const header = box.querySelector('#attack-feed-header');
        header.addEventListener('mousedown', (e)=>{
            if (!settings.floatMode) return;
            if(e.target.tagName==='BUTTON'||e.target.classList.contains('header-icon-btn')||e.target.id==='attack-feed-status')return;
            isDragging=true;
            dragOffset.x=e.clientX-box.offsetLeft;
            dragOffset.y=e.clientY-box.offsetTop;
        });
        document.addEventListener('mousemove', (e)=>{
            if(isDragging && settings.floatMode){
                box.style.left=(e.clientX-dragOffset.x)+'px';
                box.style.top=(e.clientY-dragOffset.y)+'px';
            }
        });
        document.addEventListener('mouseup', ()=>{
            if(isDragging && settings.floatMode){
                isDragging=false;
                GM_setValue(BOX_POS_KEY,JSON.stringify({top:box.style.top,left:box.style.left}));
            }
        });
    }

   function initTrigger() {
        if(warListObserver) return;

        const attach = () => {
            const container = document.querySelector('.f-war-list.war-new');
            if(!container) return;

            let trigger = container.querySelector('li.inactive');

            if (!trigger) {
                trigger = document.createElement('li');
                trigger.className = 'inactive';
                container.appendChild(trigger);
            }

            if (!trigger.dataset.feedAttached || trigger.innerHTML.trim() === "") {
                trigger.style.cssText = `
                    display: inline-block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 254px !important;
                    height: 109px !important;
                    min-width: 254px !important;
                    max-width: 254px !important;
                    flex: 0 0 254px !important;
                    box-sizing: border-box !important;
                    margin-left: 5px;
                    cursor: pointer;
                    vertical-align: top;
                    z-index: 100;
                    overflow: hidden !important;
                `;
                cachedTriggerEl = trigger;
                trigger.dataset.feedAttached = "true";
                lastTriggerHTML = '';
                updateTriggerContent();

                trigger.onclick = (e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   toggleFeedVisibility(trigger);
                };
            }
        };

        attach();

        const targetNode = document.querySelector('.content-wrapper') || document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if(document.querySelector('.f-war-list.war-new')) {
                        attach();
                    }
                }
            }
        };

        warListObserver = new MutationObserver(callback);
        warListObserver.observe(targetNode, config);

        setInterval(attach, 2000);
    }

    function updateTriggerContent() {
        const trigger = cachedTriggerEl || document.querySelector('.f-war-list.war-new > li.inactive');
        if (!trigger) return;

        trigger.style.display = 'inline-block';
        trigger.style.visibility = 'visible';

        const attacks = Object.values(lastAttacks).sort((a,b)=>b.timestamp_ended-a.timestamp_ended);
        const last = attacks.length > 0 ? attacks[0] : null;
        const retalCount = activeRetals.length;

        let html = '';

        if (!last) {
            html = `<div class="mini-feed-container" style="justify-content:center; align-items:center; color:#888;">Waiting for data...</div>`;
        } else {
            const isMyFac = last.attacker_faction === myFactionId;
            const resColor = isMyFac ? settings.winColor : settings.lossColor;
            const resText = (settings.showRespect && last.respect) ? `${isMyFac?'+':'-'}${last.respect.toFixed(2)} R` : last.result;
            const time = new Date(last.timestamp_ended * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

            let attName = "Someone";
            if (!last.stealth && last.attacker_id) {
                attName = `${last.attacker_name} [${last.attacker_id}]`;
            }

            let details = `${time} • ${last.result}`;
            if (last.modifiers) {
                const mods = [];
                if (last.modifiers.war) mods.push(`War: ${last.modifiers.war}x`);
                if (last.modifiers.chain_bonus) mods.push(`Chain: ${last.modifiers.chain_bonus}`);
                if (mods.length > 0) details = `${mods.join(' • ')}`;
                else details = `${time} • ${last.result}`;
            }

            html = `
                <div class="mini-feed-container">
                    <div class="mini-row-top">
                        <span class="mini-attacker" style="color:#42a5f5">${attName}</span>
                        <span class="mini-res" style="color:${resColor}">${resText}</span>
                    </div>
                    <div class="mini-row-mid">
                        <span style="color:#fff; font-weight:bold;">${last.defender_name} [${last.defender_id}]</span>
                        <span>${details}</span>
                    </div>
                    <div class="mini-row-bot">
                        <span class="mini-retals">Retals: ${retalCount}</span>
                        <span class="mini-link">View Live Log</span>
                    </div>
                </div>
            `;
        }

        if (lastTriggerHTML !== html || trigger.innerHTML.trim() === "") {
            trigger.innerHTML = html;
            lastTriggerHTML = html;
        }
    }

    function toggleFeedVisibility(trigger) {
        const box = document.getElementById('attack-feed-box');
        if(!box) return;

        if (settings.floatMode) {
             if (box.style.display === 'flex') {
                 box.style.display = 'none';
             } else {
                 box.style.display = 'flex';
                 const saved = JSON.parse(GM_getValue(BOX_POS_KEY, '{"top":"150px","left":"50px"}'));
                 box.style.top = saved.top;
                 box.style.left = saved.left;
             }
             return;
        }

        if (box.style.display === 'flex') {
            box.style.display = 'none';
            isFeedVisible = false;
        } else {
            box.style.display = 'flex';
            isFeedVisible = true;
            const rect = trigger.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            box.style.top = (rect.top + scrollTop) + 'px';
            box.style.left = (rect.right + scrollLeft + 10) + 'px';
        }
    }

    function toggleFilterMenu() {
        const menu = document.getElementById('feed-filter-menu');
        const btn = document.getElementById('attack-feed-filter-btn');
        if(!menu || !btn) return;

        isFilterOpen = !isFilterOpen;

        if (isFilterOpen) {
            menu.classList.add('show');
            btn.classList.add('active');
            renderFilterMenu();
        } else {
            menu.classList.remove('show');
            btn.classList.remove('active');
        }
    }

    function renderFilterMenu() {
        const menu = document.getElementById('feed-filter-menu');
        if(!menu) return;

        const memberOptions = Object.entries(factionMembers).sort((a,b)=>a[1].localeCompare(b[1])).map(([id,name])=>`<option value="${id}" ${settings.filterAttacker==id?'selected':''}>${name}</option>`).join('');

        menu.innerHTML = `
            <div class="filter-group">
                <label>Result Type</label>
                <select id="filter-result">
                    <option value="all" ${settings.filterResults==='all'?'selected':''}>All</option>
                    <option value="wins" ${settings.filterResults==='wins'?'selected':''}>Wins Only</option>
                    <option value="losses" ${settings.filterResults==='losses'?'selected':''}>Losses Only</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Attacker</label>
                <select id="filter-attacker">
                    <option value="all">All Members</option>
                    ${memberOptions}
                </select>
            </div>
            <div class="filter-group">
                <label>Attack Type</label>
                <select id="filter-type">
                    <option value="all" ${settings.filterAttackType==='all'?'selected':''}>All</option>
                    <option value="war" ${settings.filterAttackType==='war'?'selected':''}>War Only</option>
                    <option value="regular" ${settings.filterAttackType==='regular'?'selected':''}>Regular Only</option>
                </select>
            </div>
        `;

        document.getElementById('filter-result').onchange = (e) => { settings.filterResults = e.target.value; saveSettings(); renderFeed(lastAttacks, false); };
        document.getElementById('filter-attacker').onchange = (e) => { settings.filterAttacker = e.target.value; saveSettings(); renderFeed(lastAttacks, false); };
        document.getElementById('filter-type').onchange = (e) => { settings.filterAttackType = e.target.value; saveSettings(); renderFeed(lastAttacks, false); };
    }

    function setupResize(box) {
        const handle = box.querySelector('#attack-feed-resize-handle');
        handle.addEventListener('mousedown', (e)=>{e.stopPropagation();isResizing=true;resizeStart={x:e.clientX,y:e.clientY,w:box.offsetWidth,h:box.offsetHeight};});
        document.addEventListener('mousemove', (e)=>{
            if(isResizing){
                const nw=resizeStart.w+(e.clientX-resizeStart.x); const nh=resizeStart.h+(e.clientY-resizeStart.y);
                if(nw>200){settings.boxWidth=nw;box.style.width=nw+'px';} if(nh>150){settings.boxHeight=nh;box.style.height=nh+'px';}
            }
        });
        document.addEventListener('mouseup', ()=>{if(isResizing){isResizing=false;saveSettings();}});
    }

    function identifySelf(key) {
        if (myId && myFactionId) {
            fetchFactionMembers(key);
            fetchAttacks();
            return;
        }
        GM_xmlhttpRequest({
            method: "GET", url: `https://api.torn.com/user/?selections=profile&key=${key}&_=${Date.now()}`,
            onload: function(res) {
                try {
                    const d = JSON.parse(res.responseText);
                    if (d.player_id) {
                        myId=d.player_id; myFactionId=d.faction?d.faction.faction_id:0;
                        GM_setValue(MY_ID_KEY, myId); GM_setValue(MY_FAC_KEY, myFactionId);
                        fetchFactionMembers(key);
                        fetchAttacks();
                    } else alert('Invalid API Key');
                } catch(e) { console.error(e); }
            }
        });
    }

    function fetchFactionMembers(key) {
        GM_xmlhttpRequest({
            method: "GET", url: `https://api.torn.com/faction/?selections=basic&key=${key}&_=${Date.now()}`,
            onload: function(res) {
                try {
                    const d = JSON.parse(res.responseText);
                    if(d.members) {
                        factionMembers = {};
                        Object.entries(d.members).forEach(([id, m]) => factionMembers[id] = m.name);
                    }
                } catch(e) { console.error(e); }
            }
        });
    }

    function fetchAttacks() {
        if (!apiKey) return;
        if (!myId) { identifySelf(apiKey); return; }

        const statusEl = document.getElementById('attack-feed-status');
        if(statusEl) statusEl.innerText = 'Updating...';

        GM_xmlhttpRequest({
            method: "GET", url: `https://api.torn.com/faction/?selections=attacks&limit=50&key=${apiKey}&_=${Date.now()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) { if(statusEl) statusEl.innerText = 'Error'; return; }

                    const newIds = Object.keys(data.attacks);
                    const oldIds = Object.keys(lastAttacks);
                    const hasNew = newIds.some(id => !oldIds.includes(id));
                    const newRetal = checkForNewRetals(data.attacks, lastAttacks);

                    if (hasNew && oldIds.length > 0) {
                        if(newRetal) playSound(settings.soundTypeRetal);
                        else playSound(settings.soundTypeNormal);
                    }

                    lastAttacks = data.attacks;
                    processRetaliations(data.attacks);

                    updateTriggerContent();

                    if(isRetalOpen) renderRetalList();
                    renderFeed(data.attacks, hasNew);

                    if(statusEl) {
                        const now = new Date();
                        statusEl.innerText = `Last Updated ${now.toLocaleTimeString([], {hour12:false})}`;
                        statusEl.style.color = settings.winColor;
                    }

                } catch(e) { console.error('Parse Error', e); }
            }
        });
    }

    function checkForNewRetals(current, old) {
        const now = Date.now()/1000;
        const newIds = Object.keys(current).filter(id=>!Object.keys(old).includes(id));
        for (const id of newIds) {
            const att = current[id];
            if (now-att.timestamp_ended > 300) continue;
            if (att.stealth === 1) continue;
            // Prevent empty or 0 user IDs
            if (!att.attacker_id || att.attacker_id === 0) continue;

            if (att.attacker_faction != myFactionId && ['Hospitalized','Mugged','Attacked','Arrested'].includes(att.result)) return true;
        }
        return false;
    }

    function processRetaliations(attacks) {
        const now = Date.now()/1000;
        activeRetals = [];
        Object.values(attacks).forEach(att => {
            if (now-att.timestamp_ended > 300) return;
            if (att.stealth === 1) return;
            // Prevent empty or 0 user IDs
            if (!att.attacker_id || att.attacker_id === 0) return;

            if (att.attacker_faction != myFactionId && ['Hospitalized','Mugged','Attacked','Arrested'].includes(att.result)) activeRetals.push(att);
        });
        activeRetals.sort((a,b)=>b.timestamp_ended-a.timestamp_ended);
        updateRetalButton();
    }

    function updateRetalButton() {
        const btn = document.getElementById('retal-btn');
        if(!btn) return;
        btn.innerText = `Retal: ${activeRetals.length}`;
        if(activeRetals.length>0) btn.classList.add('active'); else btn.classList.remove('active');
    }

    function toggleRetalView() {
        const retalSection = document.getElementById('attack-feed-retals');
        const btn = document.getElementById('retal-btn');
        if(!retalSection || !btn) return;

        isRetalOpen = !isRetalOpen;
        if(isRetalOpen) {
            retalSection.style.display = 'block';
            btn.style.borderBottom = "2px solid #fff";
            renderRetalList();
            startRetalTimer();
        } else {
            retalSection.style.display = 'none';
            btn.style.borderBottom = "1px solid #555";
            stopRetalTimer();
        }
    }

    function sendAlert(att, timeLeftStr) {
        const msg = `Retal: [url=https://www.torn.com/profiles.php?XID=${att.attacker_id}]${att.attacker_name} [${att.attacker_id}][/url] - Time: ${timeLeftStr} - Hospitalize`;
        navigator.clipboard.writeText(msg).catch(err => console.error(err));

        const textareas = document.querySelectorAll('textarea');
        let chatBox = null;
        for (const ta of textareas) {
            const ph = ta.placeholder || '';
            if ((ph.includes('Type your message') || ph.includes('Say something')) && ta.offsetParent !== null) {
                chatBox = ta; break;
            }
        }

        if (chatBox) {
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            const prev = chatBox.value;
            const newValue = prev ? `${prev} ${msg}` : msg;
            nativeTextAreaValueSetter.call(chatBox, newValue);
            chatBox.dispatchEvent(new Event('input', { bubbles: true }));
            chatBox.focus();
        } else {
            alert("Chat box not found. Copied to clipboard.");
        }
    }

    function renderRetalList() {
        const content = document.getElementById('attack-feed-retals');
        content.innerHTML = '';
        if (activeRetals.length === 0) { content.innerHTML='<div style="padding:10px;text-align:center;color:#888;font-size:11px;">No active retaliations.<br>(Incoming losses < 5m ago)</div>'; return; }
        const now = Date.now()/1000;
        activeRetals.forEach(att => {
             const timeLeft = 300 - (now - att.timestamp_ended);
             if (timeLeft <= 0) return;
             const timeStr = `${Math.floor(timeLeft/60).toString().padStart(2,'0')}:${Math.floor(timeLeft%60).toString().padStart(2,'0')}`;
             const div = document.createElement('div');
             div.className = 'retal-item';
             div.innerHTML = `
                 <div class="retal-info">
                     <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${att.attacker_id}" target="_blank" class="retal-target">${ICONS.sword} ${att.attacker_name} [${att.attacker_id}]</a>
                     <div class="retal-victim">Beat: ${att.defender_name}</div>
                 </div>
                 <div class="retal-actions">
                     <span class="retal-timer" data-end="${att.timestamp_ended + 300}">${timeStr}</span>
                     <button class="btn-alert">${ICONS.copy} Alert</button>
                 </div>
             `;
             div.querySelector('.btn-alert').onclick = function() { sendAlert(att, timeStr); this.style.color="#4caf50"; };
             content.appendChild(div);
        });
    }

    function startRetalTimer() {
        stopRetalTimer();
        retalTimerInterval = setInterval(() => {
            const timers = document.querySelectorAll('.retal-timer');
            if (timers.length === 0) return;
            const now = Date.now()/1000;
            timers.forEach(el => {
                const left = parseFloat(el.getAttribute('data-end')) - now;
                if (left <= 0) el.closest('.retal-item').remove();
                else el.innerText = `${Math.floor(left/60).toString().padStart(2,'0')}:${Math.floor(left%60).toString().padStart(2,'0')}`;
            });
        }, 1000);
    }
    function stopRetalTimer() { if (retalTimerInterval) clearInterval(retalTimerInterval); }

    function renderFeed(attacksData, hasNewAttacks) {
        const content = document.getElementById('attack-feed-content');
        if (!attacksData || Object.keys(attacksData).length === 0) { content.innerHTML = '<div style="padding:20px;text-align:center;">No data</div>'; return; }

        let attacks = Object.values(attacksData).sort((a,b)=>b.timestamp_ended-a.timestamp_ended);

        if (settings.filterAttacker !== 'all') {
            attacks = attacks.filter(a => String(a.attacker_id) === String(settings.filterAttacker));
        }
        if (settings.filterResults !== 'all') {
             const wins = ['Hospitalized', 'Mugged', 'Attacked', 'Arrested'];
             attacks = attacks.filter(a => {
                if (settings.filterResults === 'wins') return wins.includes(a.result);
                if (settings.filterResults === 'losses') return ['Lost', 'Escape'].includes(a.result);
                return true;
             });
        }
        if (settings.filterAttackType !== 'all') {
            attacks = attacks.filter(a => {
                const war = a.modifiers && a.modifiers.war;
                return (settings.filterAttackType === 'war') ? war : !war;
            });
        }

        attacks = attacks.slice(0, settings.maxAttacks);

        let html = '';
        attacks.forEach((att, index) => {
            const time = new Date(att.timestamp_ended * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            let type = 'stalemate';

            const isMyFac = att.attacker_faction == myFactionId;

            const success = ['Hospitalized', 'Mugged', 'Attacked', 'Arrested'].includes(att.result);
            if (isMyFac) type = success ? 'win' : (att.result !== 'Stalemate' ? 'loss' : 'stalemate');
            else type = success ? 'loss' : (att.result !== 'Stalemate' ? 'win' : 'stalemate');

            const cssClass = `feed-${type}`;
            const highlight = (hasNewAttacks && index === 0 && settings.highlightNewAttacks) ? 'new-attack' : '';

            let resHtml = '';
            if (settings.showRespect && att.respect) resHtml = `<span style="color:${isMyFac?settings.winColor:settings.lossColor}; font-weight:bold;">${isMyFac?'+':'-'}${att.respect.toFixed(2)} R</span>`;

            let modsHtml = '';
            if (settings.showModifiers && att.modifiers) {
                const mods = [];
                if (att.modifiers.war) mods.push(`War: ${att.modifiers.war}x`);
                if (att.modifiers.chain_bonus) mods.push(`Chain: ${att.modifiers.chain_bonus}`);
                if (mods.length > 0) modsHtml = `<div class="feed-mods">${mods.join(' • ')}</div>`;
            }

            let attName = "Someone";
            let attIdStr = "";
            if (!att.stealth && att.attacker_id) {
                attName = att.attacker_name;
                attIdStr = ` [${att.attacker_id}]`;
            }

            const attackerHtml = settings.showAttacker ? `<div style="font-size:11px; color:#42a5f5;">${attName}${attIdStr}</div>` : '';

            html += `
                <div class="feed-item ${cssClass} ${highlight}">
                    <div class="feed-info">
                        ${attackerHtml}
                        <div style="font-weight:bold;">${att.defender_name} [${att.defender_id}]</div>
                        <div style="font-size:10px; color:#aaa;">${time} • ${att.result}</div>
                    </div>
                    <div class="feed-stats">${resHtml}${modsHtml}</div>
                </div>`;
        });

        if (lastFeedHTML !== html) {
            content.innerHTML = html;
            lastFeedHTML = html;
        }
    }

    function showSettingsModal() {
        const overlay = document.createElement('div'); overlay.id='settings-overlay';
        const modal = document.createElement('div'); modal.id='settings-modal';

        const apiKeyHtml = `<input type="password" id="setting-api-key" value="${apiKey}" placeholder="Public or Limited Key">`;

        const soundOpts = `
            <option value="none">None</option>
            <option value="beep">Beep</option>
            <option value="ping">Ping</option>
            <option value="alarm">Alarm</option>
            <option value="chime">Chime</option>
            <option value="pulse">Pulse</option>
        `;

        modal.innerHTML = `
            <h3>⚙️ Settings</h3>
            <div class="settings-section">
                <h4>API Configuration</h4>
                <div class="settings-group block"><label>API Key</label>${apiKeyHtml}</div>
            </div>

            <div class="settings-section">
                <h4>Display</h4>
                <div class="settings-group"><label>Float Mode</label><input type="checkbox" id="setting-float-mode" ${settings.floatMode?'checked':''}></div>
                <div class="settings-group"><label>Refresh (sec)</label><input type="number" id="setting-refresh" value="${settings.refreshRate}" min="5"></div>
                <div class="settings-group"><label>Max Attacks</label><input type="number" id="setting-max" value="${settings.maxAttacks}"></div>
                <div class="settings-group"><label>Opacity %</label><input type="range" id="setting-opacity" value="${settings.opacity}" min="20" max="100"></div>
                <div class="settings-group"><label>Show Attacker</label><input type="checkbox" id="setting-show-attacker" ${settings.showAttacker?'checked':''}></div>
                <div class="settings-group"><label>Show Respect</label><input type="checkbox" id="setting-show-respect" ${settings.showRespect?'checked':''}></div>
                <div class="settings-group"><label>Show Mods (War)</label><input type="checkbox" id="setting-show-mods" ${settings.showModifiers?'checked':''}></div>
                <div class="settings-group"><label>Compact Mode</label><input type="checkbox" id="setting-compact" ${settings.compactMode?'checked':''}></div>
            </div>

            <div class="settings-section">
                <h4>Notifications</h4>
                <div class="settings-group"><label>Attack Sound</label>
                    <select id="setting-sound-normal">${soundOpts}</select>
                </div>
                <div class="settings-group"><label>Retal Sound</label>
                    <select id="setting-sound-retal">${soundOpts}</select>
                </div>
                <button class="btn-test" id="btn-test-sound">Test Sounds</button>
            </div>

            <div class="settings-section">
                <h4>Colors</h4>
                <div class="settings-group"><label>Win (Green)</label><input type="color" id="setting-win-color" value="${settings.winColor}"></div>
                <div class="settings-group"><label>Loss (Red)</label><input type="color" id="setting-loss-color" value="${settings.lossColor}"></div>
                <div class="settings-group"><label>Stalemate</label><input type="color" id="setting-stale-color" value="${settings.stalemateColor}"></div>
                <div class="settings-group"><label>Assist</label><input type="color" id="setting-assist-color" value="${settings.assistColor}"></div>
                <div class="settings-group"><label>Background</label><input type="color" id="setting-bg-color" value="${settings.bgColor}"></div>
            </div>

            <div class="settings-buttons">
                <button class="btn-reset" id="btn-reset">RESET</button>
                <button class="btn-cancel" id="btn-cancel">CANCEL</button>
                <button class="btn-save" id="btn-save">SAVE</button>
            </div>
        `;

        document.body.appendChild(overlay); document.body.appendChild(modal);
        overlay.addEventListener('click', closeSettingsModal);

        document.getElementById('setting-sound-normal').value = settings.soundTypeNormal;
        document.getElementById('setting-sound-retal').value = settings.soundTypeRetal;

        document.getElementById('setting-sound-normal').onchange = (e) => playSound(e.target.value);
        document.getElementById('setting-sound-retal').onchange = (e) => playSound(e.target.value);
        document.getElementById('btn-test-sound').onclick = (e) => { e.stopPropagation(); playSound(document.getElementById('setting-sound-retal').value); };

        document.getElementById('btn-cancel').onclick = closeSettingsModal;
        document.getElementById('btn-reset').onclick = () => { if(confirm("Reset defaults?")) { settings=Object.assign({},defaultSettings); saveSettings(); closeSettingsModal(); applySettings(); }};

        document.getElementById('btn-save').onclick = () => {
            try {
                const nk = document.getElementById('setting-api-key').value.trim();
                if(nk && nk !== apiKey) { apiKey = nk; GM_setValue(API_KEY_KEY, nk); myId=null; }

                settings.refreshRate = parseInt(document.getElementById('setting-refresh').value) || 30;
                settings.maxAttacks = parseInt(document.getElementById('setting-max').value) || 15;
                settings.opacity = parseInt(document.getElementById('setting-opacity').value) || 100;

                settings.floatMode = document.getElementById('setting-float-mode').checked;
                settings.compactMode = document.getElementById('setting-compact').checked;
                settings.showAttacker = document.getElementById('setting-show-attacker').checked;
                settings.showRespect = document.getElementById('setting-show-respect').checked;
                settings.showModifiers = document.getElementById('setting-show-mods').checked;

                settings.soundTypeNormal = document.getElementById('setting-sound-normal').value;
                settings.soundTypeRetal = document.getElementById('setting-sound-retal').value;

                settings.bgColor = document.getElementById('setting-bg-color').value;
                settings.winColor = document.getElementById('setting-win-color').value;
                settings.lossColor = document.getElementById('setting-loss-color').value;
                settings.stalemateColor = document.getElementById('setting-stale-color').value;
                settings.assistColor = document.getElementById('setting-assist-color').value;

                saveSettings();
                closeSettingsModal();
                applySettings();
                if(apiKey) identifySelf(apiKey);
            } catch(e) {
                console.error("Save error", e);
                closeSettingsModal();
            }
        };
    }

    function closeSettingsModal() {
        const o = document.getElementById('settings-overlay'); if(o) o.remove();
        const m = document.getElementById('settings-modal'); if(m) m.remove();
    }

    function applySettings() {
        createStyles();
        const box = document.getElementById('attack-feed-box');
        if(box) {
             box.style.width=settings.boxWidth+'px';

             if (settings.floatMode) {
                 const saved = JSON.parse(GM_getValue(BOX_POS_KEY, '{"top":"150px","left":"50px"}'));
                 box.style.top = saved.top;
                 box.style.left = saved.left;
                 box.style.position = 'fixed';
             } else {
                 box.style.position = 'absolute';
                 if(box.style.display === 'flex') {
                    const trigger = document.querySelector('.f-war-list.war-new > li.inactive');
                    if(trigger) {
                        const rect = trigger.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                        box.style.top = (rect.top + scrollTop) + 'px';
                        box.style.left = (rect.right + scrollLeft + 10) + 'px';
                    }
                 }
             }
        }
        if(refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(fetchAttacks, settings.refreshRate*1000);
        const currentData = document.getElementById('attack-feed-content').getAttribute('data-last');
        if (currentData) renderFeed(JSON.parse(currentData), false);
    }

    createStyles();
    createUI();
    initTrigger();
    setTimeout(() => { if(apiKey) identifySelf(apiKey); else fetchAttacks(); }, 500);
    refreshInterval = setInterval(fetchAttacks, settings.refreshRate*1000);

})();