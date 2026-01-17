// ==UserScript==
// @name         Transfermarkt Speedrun
// @namespace    http://tampermonkey.net/
// @version      24.0
// @description  Transfermarkt Speedrun tool
// @author       Derus
// @copyright    2026, Derus
// @license      All Rights Reserved
// @match        *://*.transfermarkt.com/*
// @match        *://*.transfermarkt.it/*
// @match        *://*.transfermarkt.de/*
// @match        *://*.transfermarkt.co.uk/*
// @match        *://*.transfermarkt.es/*
// @match        *://*.transfermarkt.fr/*
// @match        *://*.transfermarkt.br/*
// @match        *://*.transfermarkt.pt/*
// @match        *://*.transfermarkt.nl/*
// @match        *://*.transfermarkt.tr/*
// @match        *://*.transfermarkt.pl/*
// @match        *://*.transfermarkt.be/*
// @match        *://*.transfermarkt.ch/*
// @match        *://*.transfermarkt.at/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562583/Transfermarkt%20Speedrun.user.js
// @updateURL https://update.greasyfork.org/scripts/562583/Transfermarkt%20Speedrun.meta.js
// ==/UserScript==

/*
    COPYRIGHT NOTICE:
    This script is the intellectual property of Derus.
    Redistribution, modification, or selling of this script without
    explicit permission from the author is strictly prohibited.
    You are free to use it for personal entertainment.
*/

(function() {
    'use strict';

    const STORAGE_PREFIX = 'derus_speedrun_v24_';
    const BASE_URL = window.location.origin;
    const DEFAULT_IMG = 'https://tmssl.akamaized.net/images/portrait/header/default.jpg';
    const TEAM_DEFAULT_IMG = 'https://tmssl.akamaized.net/images/wappen/head/default.png';

    const CONTAINER_ID = 'derus-speedrun-overlay';
    const HEADER_ID = 'derus-speedrun-header';

    let isSearchingActive = false;

    // --- TRADUZIONI ---
    const TRANSLATIONS = {
        it: {
            title: "TM Speedrun",
            start_label: "PARTENZA",
            target_label: "ARRIVO",
            source_transfers: "Trasferimenti Recenti (Giocatori)",
            source_rumors: "Rumors / Forum Mercato",
            source_legends: "Leggende / Pallone d'Oro",
            source_random_id: "🎲 Giocatore a caso (Random)",
            source_random_team: "🎲 Squadra a caso (Random)",
            source_search_player: "🔎 Cerca Giocatore (Sfida)",
            source_search_team: "🔎 Cerca Squadra (Sfida)",
            btn_start: "INIZIA SPEEDRUN ▶",
            btn_restart: "Nuova Partita",
            btn_copy: "📋 Copia Risultato",
            status_win: "🏆 VITTORIA!",
            status_playing: "Trova il collegamento...",
            label_click: "CLICK",
            label_time: "TEMPO",
            label_path: "📜 Percorso",
            search_prompt: "Scrivi il nome del",
            type_player: "Giocatore",
            type_team: "Squadra",
            msg_searching: "Cerco",
            msg_not_found: "Non trovato",
            msg_error: "Errore",
            msg_timeout: "Errore/Timeout",
            msg_copied: "Risultato copiato! 📋",
            err_no_id: "Nessun ID valido trovato.",
            err_no_result: "Nessun risultato."
        },
        en: {
            title: "TM Speedrun",
            start_label: "START",
            target_label: "TARGET",
            source_transfers: "Recent Transfers (Players)",
            source_rumors: "Rumors / Market Forum",
            source_legends: "Legends / Ballon d'Or",
            source_random_id: "🎲 Random Player (Chaos)",
            source_random_team: "🎲 Random Team (Chaos)",
            source_search_player: "🔎 Search Player (Challenge)",
            source_search_team: "🔎 Search Team (Challenge)",
            btn_start: "START SPEEDRUN ▶",
            btn_restart: "New Game",
            btn_copy: "📋 Copy Result",
            status_win: "🏆 VICTORY!",
            status_playing: "Find the path...",
            label_click: "CLICKS",
            label_time: "TIME",
            label_path: "📜 Path",
            search_prompt: "Type name of",
            type_player: "Player",
            type_team: "Team",
            msg_searching: "Searching",
            msg_not_found: "Not found",
            msg_error: "Error",
            msg_timeout: "Error/Timeout",
            msg_copied: "Result copied to clipboard! 📋",
            err_no_id: "No valid ID found.",
            err_no_result: "No result found."
        }
    };

    // --- FONTI ---
    const SOURCES = {
        transfers: { labelKey: 'source_transfers', type: 'paged_url', url: '/transfers/neuestetransfers/statistik', max_pages: 100 },
        rumors: { labelKey: 'source_rumors', type: 'paged_url', url: '/calciomercato/detail/forum/154', max_pages: 5 },
        legends: { labelKey: 'source_legends', type: 'paged_url', url: '/erfolge/spielertitel/statistik/676', max_pages: 3 },
        random_id: { labelKey: 'source_random_id', type: 'id_generator', mode: 'player' },
        random_team: { labelKey: 'source_random_team', type: 'id_generator', mode: 'team' },
        search_player: { labelKey: 'source_search_player', type: 'search', mode: 'player' },
        search_team: { labelKey: 'source_search_team', type: 'search', mode: 'team' }
    };

    // --- STATO ---
    function getState() {
        let history = [];
        try { history = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'history') || '[]'); } catch(e){}

        return {
            lang: localStorage.getItem(STORAGE_PREFIX + 'lang') || 'it',
            targetUrl: localStorage.getItem(STORAGE_PREFIX + 'targetUrl') || '',
            targetName: localStorage.getItem(STORAGE_PREFIX + 'targetName') || '',
            targetImg: localStorage.getItem(STORAGE_PREFIX + 'targetImg') || DEFAULT_IMG,
            targetType: localStorage.getItem(STORAGE_PREFIX + 'targetType') || 'player',
            startUrl: localStorage.getItem(STORAGE_PREFIX + 'startUrl') || '',
            startName: localStorage.getItem(STORAGE_PREFIX + 'startName') || '',
            startImg: localStorage.getItem(STORAGE_PREFIX + 'startImg') || DEFAULT_IMG,
            startType: localStorage.getItem(STORAGE_PREFIX + 'startType') || 'player',
            clicks: parseInt(localStorage.getItem(STORAGE_PREFIX + 'clicks') || '0'),
            startTime: parseInt(localStorage.getItem(STORAGE_PREFIX + 'startTime') || '0'),
            endTime: parseInt(localStorage.getItem(STORAGE_PREFIX + 'endTime') || '0'),
            isPlaying: localStorage.getItem(STORAGE_PREFIX + 'isPlaying') === 'true',
            finished: localStorage.getItem(STORAGE_PREFIX + 'finished') === 'true',
            minimized: localStorage.getItem(STORAGE_PREFIX + 'minimized') === 'true',
            history: history,
            posX: localStorage.getItem(STORAGE_PREFIX + 'posX') || '20px',
            posY: localStorage.getItem(STORAGE_PREFIX + 'posY') || '20px'
        };
    }

    function setState(key, value) {
        if (key === 'history') {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } else {
            localStorage.setItem(STORAGE_PREFIX + key, value);
        }
    }

    function t(key) {
        const lang = getState().lang;
        return TRANSLATIONS[lang][key] || key;
    }

    // --- UTILITIES ---
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 6000,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 400) {
                        resolve({ text: response.responseText, finalUrl: response.finalUrl });
                    } else {
                        reject("Status Error: " + response.status);
                    }
                },
                ontimeout: () => reject("Timeout"),
                onerror: err => reject("Network Error")
            });
        });
    }

    function enhanceImageQuality(url) {
        if (!url) return DEFAULT_IMG;
        return url.replace('/small/', '/header/').replace('/medium/', '/header/').replace('/tiny/', '/header/').replace('verysmall', 'head').replace('small', 'head'); 
    }

    function cleanName(rawName) {
        if (!rawName) return null;
        const cleaned = rawName.replace(/#\d+\s*/, '').replace(/\n/g, '').replace(/\t/g, '').trim();
        return cleaned.length > 0 ? cleaned : null;
    }

    // --- NUOVA FUNZIONE PULIZIA TITOLI (History) ---
    function cleanPageTitle(title) {
        if (!title) return "Page";
        // Rimuove la sporcizia tipica di Transfermarkt
        return title
            .replace(/ \| Transfermarkt/g, '')
            .replace(/ - Transfermarkt/g, '')
            .replace(/ - Profilo giocatore .*/, '')
            .replace(/ - Profilo società .*/, '')
            .replace(/ - Carriera .*/, '')
            .trim();
    }

    function formatTime(ms) {
        if (!ms) return "00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // --- LOGIC ---
    function checkWinCondition() {
        const state = getState();
        if (!state.targetUrl || !state.isPlaying) return false;
        try {
            const currentPath = new URL(window.location.href).pathname;
            const targetPath = new URL(state.targetUrl, BASE_URL).pathname;
            const isPlayerTarget = state.targetType === 'player';
            const regex = isPlayerTarget ? /spieler\/(\d+)/ : /verein\/(\d+)/;
            const currentId = currentPath.match(regex);
            const targetId = targetPath.match(regex);
            if (currentId && targetId && currentId[1] === targetId[1]) return true;
            return false;
        } catch(e) { return false; }
    }

    function trackCurrentPage() {
        const state = getState();
        if (!state.isPlaying || state.finished) return;
        
        // Pulisce il titolo della pagina prima di salvarlo
        let pageTitle = cleanPageTitle(document.title);
        
        const lastEntry = state.history[state.history.length - 1];
        if (pageTitle && lastEntry !== pageTitle) {
            const newHistory = [...state.history, pageTitle];
            setState('history', newHistory);
        }
    }

    function initCheck() {
        const state = getState();
        if (state.isPlaying && (!state.targetUrl || !state.startUrl)) {
            resetAll(false);
            return;
        }
        if (state.isPlaying && !state.finished) {
            if (checkWinCondition()) {
                setState('finished', 'true');
                setState('endTime', Date.now());
                trackCurrentPage();
            } else {
                trackCurrentPage();
            }
        }
    }

    async function scrapeEntityFromList(url, isTeamMode) {
        const response = await gmFetch(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.text, 'text/html');
        const selector = isTeamMode ? 'a[href*="/startseite/verein/"]' : 'a[href*="/profil/spieler/"]';
        const allLinks = Array.from(doc.querySelectorAll(selector));
        const candidates = [];
        const seenUrls = new Set();

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            let rawName = link.getAttribute('title') || link.innerText;
            const finalName = cleanName(rawName);
            if (href && finalName && !seenUrls.has(href)) {
                let imgSrc = isTeamMode ? TEAM_DEFAULT_IMG : DEFAULT_IMG;
                let imgTag = link.querySelector('img');
                if (!imgTag) { const parent = link.parentElement; if (parent) imgTag = parent.querySelector('img'); }
                if (!imgTag) { const container = link.closest('tr') || link.closest('article'); if (container) imgTag = container.querySelector('img'); }
                if (imgTag) imgSrc = imgTag.getAttribute('data-src') || imgTag.getAttribute('src');
                candidates.push({
                    name: finalName, url: BASE_URL + href,
                    img: enhanceImageQuality(imgSrc), type: isTeamMode ? 'team' : 'player'
                });
                seenUrls.add(href);
            }
        });
        if (!candidates.length) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    async function findValidRandomEntity(statusCallback, mode) {
        const isPlayer = mode === 'player';
        const MIN_ID = isPlayer ? 10000 : 1;
        const MAX_ID = isPlayer ? 1350000 : 99999;
        const urlPart = isPlayer ? '/profil/spieler/' : '/startseite/verein/';
        
        for (let i = 1; i <= 30; i++) {
            const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
            const testUrl = `${BASE_URL}/check${urlPart}${randomId}`;
            statusCallback(`ID: ${randomId} (${mode})...`);
            try {
                const response = await gmFetch(testUrl);
                const cleanFinal = response.finalUrl.replace(/\/$/, "");
                const cleanBase = BASE_URL.replace(/\/$/, "");
                if (cleanFinal !== cleanBase && response.finalUrl.includes(urlPart)) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.text, 'text/html');
                    let pageTitle = doc.querySelector('h1') ? doc.querySelector('h1').innerText : doc.title;
                    if (pageTitle.includes("Error") || pageTitle.includes("404") || pageTitle.trim() === "Transfermarkt") continue;

                    let finalName = cleanName(pageTitle);
                    let imgUrl = isPlayer ? DEFAULT_IMG : TEAM_DEFAULT_IMG;
                    
                    if (isPlayer) {
                        let imgEl = doc.querySelector('.data-header__profile-image') || doc.querySelector('#suche-spieler-foto');
                        if (imgEl) imgUrl = imgEl.src;
                        imgUrl = enhanceImageQuality(imgUrl);
                    } else {
                        imgUrl = `https://tmssl.akamaized.net/images/wappen/head/${randomId}.png`;
                    }
                    if (finalName) return { name: finalName, url: response.finalUrl, img: imgUrl, type: mode };
                }
            } catch (e) {}
        }
        throw new Error(t('err_no_id'));
    }

    async function searchEntityByName(query, type) {
        const searchParam = type === 'team' ? '&suchberater=Vereine' : ''; 
        const searchUrl = `${BASE_URL}/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(query)}${searchParam}`;
        const response = await gmFetch(searchUrl);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.text, 'text/html');
        const selector = type === 'player' ? 'td.hauptlink a[href*="/profil/spieler/"]' : 'td.hauptlink a[href*="/startseite/verein/"]';
        const rows = Array.from(doc.querySelectorAll('.items tbody tr'));
        
        for (const row of rows) {
            const link = row.querySelector(selector);
            if (link) {
                const rawName = link.getAttribute('title') || link.innerText;
                const finalName = cleanName(rawName);
                if (finalName) {
                    const href = link.getAttribute('href');
                    let imgSrc = type === 'player' ? DEFAULT_IMG : TEAM_DEFAULT_IMG;
                    const imgTag = row.querySelector('img');
                    if (imgTag) imgSrc = imgTag.getAttribute('src') || imgTag.getAttribute('data-src');
                    return { name: finalName, url: BASE_URL + href, img: enhanceImageQuality(imgSrc), type: type };
                }
            }
        }
        return null;
    }

    async function rollEntity(role, inputId, imgId) {
        if (isSearchingActive) return;
        const input = document.getElementById(inputId);
        const imgEl = document.getElementById(imgId);
        const sourceKey = document.getElementById(role === 'start' ? 'sel-start' : 'sel-target').value;
        const sourceConfig = SOURCES[sourceKey];

        if (sourceConfig.type === 'search') {
            const typeLabel = t(sourceConfig.mode === 'player' ? 'type_player' : 'type_team');
            const userQuery = prompt(`${t('search_prompt')} ${typeLabel}:`);
            if (!userQuery || userQuery.trim() === "") return;
            
            isSearchingActive = true;
            input.style.backgroundColor = "#fff3cd";
            input.value = `${t('msg_searching')} "${userQuery}"...`;
            imgEl.style.opacity = "0.5";
            
            try {
                const entity = await searchEntityByName(userQuery, sourceConfig.mode);
                if (entity) {
                    saveSelection(role, entity);
                    updateInputUI(input, imgEl, entity, true);
                    renderUI();
                } else {
                    updateInputUI(input, imgEl, null, false, t('msg_not_found'));
                }
            } catch (e) {
                updateInputUI(input, imgEl, null, false, t('msg_error'));
            } finally { isSearchingActive = false; }
            return;
        }

        isSearchingActive = true;
        input.style.backgroundColor = "#fff3cd";
        input.value = t('msg_searching') + "...";
        imgEl.style.opacity = "0.5";

        try {
            let entity = null;
            if (sourceConfig.type === 'id_generator') {
                const mode = sourceConfig.mode || 'player';
                entity = await findValidRandomEntity((msg) => { input.value = msg; }, mode);
            } else if (sourceConfig.type === 'paged_url') {
                const maxPage = sourceConfig.max_pages || 1;
                const randomPage = Math.floor(Math.random() * maxPage) + 1;
                const pageUrl = `${BASE_URL}${sourceConfig.url}/page/${randomPage}`;
                const isTeam = sourceConfig.url.includes('mannschaften'); 
                entity = await scrapeEntityFromList(pageUrl, isTeam);
            }

            if (entity) {
                saveSelection(role, entity);
                updateInputUI(input, imgEl, entity, true);
                renderUI();
            } else {
                throw new Error(t('err_no_result'));
            }
        } catch (e) {
            console.error(e);
            updateInputUI(input, imgEl, null, false, t('msg_timeout'));
        } finally { isSearchingActive = false; }
    }

    function saveSelection(role, entity) {
        setState(role + 'Name', entity.name);
        setState(role + 'Url', entity.url);
        setState(role + 'Img', entity.img);
        if (role === 'target') setState('targetType', entity.type);
        if (role === 'start') setState('startType', entity.type);
    }

    function updateInputUI(input, imgEl, entity, success, errorMsg) {
        if (success) {
            input.value = entity.name;
            input.style.backgroundColor = "#d4edda";
            imgEl.src = entity.img;
            imgEl.style.opacity = "1";
        } else {
            input.value = errorMsg || t('msg_error');
            input.style.backgroundColor = "#f8d7da";
            imgEl.style.opacity = "1";
        }
    }

    function copyStatsToClipboard() {
        const state = getState();
        const timeStr = formatTime(state.endTime - state.startTime);
        
        // Costruzione Percorso Pulito (Orizzontale con frecce)
        const pathString = state.history.join(' → ');

        const text = `⚡ **Transfermarkt Speedrun**\n` +
                     `🏃 **${t('start_label')}:** ${state.startName}\n` +
                     `🎯 **${t('target_label')}:** ${state.targetName}\n` +
                     `🖱️ **${t('label_click')}:** ${state.clicks}\n` +
                     `⏱️ **${t('label_time')}:** ${timeStr}\n` +
                     `🔗 **${t('label_path')} (${state.history.length}):**\n${pathString}`;
        
        navigator.clipboard.writeText(text).then(() => { alert(t('msg_copied')); });
    }

    const container = document.createElement('div');
    container.id = CONTAINER_ID;

    const savedState = getState();
    const initialStyle = savedState.posX === '20px' ? `bottom: 20px; right: 20px;` : `top: ${savedState.posY}; left: ${savedState.posX};`;

    container.style.cssText = `
        position: fixed; ${initialStyle} width: 320px;
        background: #ffffff; border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3); z-index: 9999999;
        font-family: 'Source Sans Pro', Arial, sans-serif;
        overflow: hidden; border: 1px solid #ddd;
        transition: height 0.3s ease;
    `;

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(HEADER_ID);
        if (header) header.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            if(e.target.tagName === 'BUTTON') return;
            e = e || window.event; e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement; document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event; e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px"; el.style.left = (el.offsetLeft - pos1) + "px";
            el.style.bottom = 'auto'; el.style.right = 'auto';
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            setState('posX', el.style.left); setState('posY', el.style.top);
        }
    }

    function getDropdownOptions(selectedKey) {
        let options = '';
        for (const [key, data] of Object.entries(SOURCES)) {
            const isSelected = key === selectedKey ? 'selected' : '';
            options += `<option value="${key}" ${isSelected}>${t(data.labelKey)}</option>`;
        }
        return options;
    }

    function renderUI() {
        const state = getState();
        const headerStyle = `background: #1a3151; padding: 12px 15px; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;`;
        const displayContent = state.minimized ? 'none' : 'block';
        const minimizeIcon = state.minimized ? '+' : '_';
        const startFallback = state.startType === 'team' ? TEAM_DEFAULT_IMG : DEFAULT_IMG;
        const targetFallback = state.targetType === 'team' ? TEAM_DEFAULT_IMG : DEFAULT_IMG;
        
        const langFlag = state.lang === 'it' ? '🇬🇧' : '🇮🇹';

        let contentHtml = '';

        if (state.isPlaying) {
            let status = state.finished ? 
                `<span style="color:#28a745; font-weight:800; font-size:16px;">${t('status_win')}</span>` : 
                t('status_playing');

            let timerHtml = "00:00";
            if(state.startTime) {
                const end = state.finished ? state.endTime : Date.now();
                timerHtml = formatTime(end - state.startTime);
            }

            let historyHtml = '';
            if (state.finished) {
                historyHtml = `
                    <div style="margin-top:15px; text-align:left; background:#f1f1f1; padding:10px; border-radius:6px; max-height:100px; overflow-y:auto; font-size:11px; border:1px solid #ddd;">
                        <strong>${t('label_path')} (${state.history.length}):</strong><br>
                        <ol style="margin:0; padding-left:20px;">
                            ${state.history.map((step) => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    <button id="btn-copy" style="margin-top:10px; width:100%; padding:8px; background:#17a2b8; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">${t('btn_copy')}</button>
                `;
            }

            contentHtml = `
                <div style="padding: 20px; text-align: center; display: ${displayContent};">
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 1px;">${t('target_label')}</div>
                        <img src="${state.targetImg}" onerror="this.onerror=null; this.src='${targetFallback}';" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid #1a3151; margin-top:5px;">
                        <div style="font-size: 16px; font-weight: bold; color: #1a3151; line-height: 1.2;">${state.targetName}</div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <div style="flex: 1; background: #f8f9fa; padding: 8px; border-radius: 8px;">
                            <div style="font-size: 22px; font-weight: bold; color: #d9534f;">${state.clicks}</div>
                            <div style="font-size: 10px; color: #666; font-weight: bold;">${t('label_click')}</div>
                        </div>
                        <div style="flex: 1; background: #f8f9fa; padding: 8px; border-radius: 8px;">
                            <div style="font-size: 22px; font-weight: bold; color: #1a3151;" id="timer-display">${timerHtml}</div>
                            <div style="font-size: 10px; color: #666; font-weight: bold;">${t('label_time')}</div>
                        </div>
                    </div>
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">${status}</div>
                    ${historyHtml}
                    ${state.finished ? `<button id="btn-restart" style="width: 100%; padding: 10px; background: #1a3151; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top:10px;">${t('btn_restart')}</button>` : ''}
                </div>
            `;
        } else {
            const lastStart = localStorage.getItem(STORAGE_PREFIX + 'prefStart') || 'transfers';
            const lastTarget = localStorage.getItem(STORAGE_PREFIX + 'prefTarget') || 'random_id';
            const getIcon = (key) => SOURCES[key] && SOURCES[key].type === 'search' ? '🔎' : '🎲';

            contentHtml = `
                <div style="padding: 15px; display: ${displayContent};">
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; font-weight: bold; color: #1a3151; margin-bottom: 5px;">${t('start_label')}</div>
                        <select id="sel-start" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 8px;">${getDropdownOptions(lastStart)}</select>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img id="img-start" src="${state.startImg}" onerror="this.onerror=null; this.src='${startFallback}';" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover;">
                            <div style="flex: 1; display: flex; gap: 5px;">
                                <input id="inp-start" value="${state.startName}" readonly style="width: 100%; border: 1px solid #ccc; padding: 6px; border-radius: 4px; font-size: 13px;">
                                <button id="btn-roll-start" style="cursor: pointer; padding: 0 10px; background: #e9ecef; border: 1px solid #ced4da; border-radius: 4px;">${getIcon(lastStart)}</button>
                            </div>
                        </div>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 11px; font-weight: bold; color: #d9534f; margin-bottom: 5px;">${t('target_label')}</div>
                        <select id="sel-target" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 8px;">${getDropdownOptions(lastTarget)}</select>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img id="img-target" src="${state.targetImg}" onerror="this.onerror=null; this.src='${targetFallback}';" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover;">
                            <div style="flex: 1; display: flex; gap: 5px;">
                                <input id="inp-target" value="${state.targetName}" readonly style="width: 100%; border: 1px solid #ccc; padding: 6px; border-radius: 4px; font-size: 13px;">
                                <button id="btn-roll-target" style="cursor: pointer; padding: 0 10px; background: #e9ecef; border: 1px solid #ced4da; border-radius: 4px;">${getIcon(lastTarget)}</button>
                            </div>
                        </div>
                    </div>
                    <button id="btn-play" style="width: 100%; padding: 12px; background: #1a3151; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: 0.5; pointer-events: none; transition: opacity 0.2s;">${t('btn_start')}</button>
                </div>
            `;
        }

        const headerButtons = `
            <div style="display:flex; gap:5px; align-items:center;">
                <button id="btn-lang" style="background:transparent; border:none; cursor:pointer; font-size:14px; margin-right:5px;" title="Switch Language">${langFlag}</button>
                <button id="btn-minimize" style="background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; width:20px; height:20px; border-radius: 4px; font-weight:bold; line-height:0;">${minimizeIcon}</button>
                ${state.isPlaying ? '<button id="btn-mini-exit" style="background: #d9534f; border: none; color: white; cursor: pointer; font-size: 10px; padding: 4px 8px; border-radius: 4px;">ESCI</button>' : ''}
            </div>
        `;

        container.innerHTML = `<div id="${HEADER_ID}" style="${headerStyle}"><span style="font-weight: bold;">⚡ ${t('title')}</span>${headerButtons}</div>${contentHtml}`;
        makeDraggable(container);

        if (state.isPlaying && !state.finished && !state.minimized) {
            if (window.speedrunTimer) clearInterval(window.speedrunTimer);
            window.speedrunTimer = setInterval(() => {
                const now = Date.now();
                const diff = now - state.startTime;
                const timerEl = document.getElementById('timer-display');
                if (timerEl) timerEl.innerText = formatTime(diff);
            }, 1000);
        } else { if (window.speedrunTimer) clearInterval(window.speedrunTimer); }

        document.getElementById('btn-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            setState('minimized', !state.minimized);
            renderUI();
        });

        document.getElementById('btn-lang').addEventListener('click', (e) => {
            e.stopPropagation();
            const newLang = state.lang === 'it' ? 'en' : 'it';
            setState('lang', newLang);
            renderUI();
        });

        if (!state.isPlaying) {
            const btnPlay = document.getElementById('btn-play');
            if (state.startName && state.targetName) { btnPlay.style.opacity = '1'; btnPlay.style.pointerEvents = 'auto'; }
            
            const updateIcon = (selId, btnId) => {
                const val = document.getElementById(selId).value;
                const src = SOURCES[val];
                document.getElementById(btnId).innerText = (src && src.type === 'search') ? '🔎' : '🎲';
            };

            document.getElementById('btn-roll-start').addEventListener('click', () => {
                localStorage.setItem(STORAGE_PREFIX + 'prefStart', document.getElementById('sel-start').value);
                rollEntity('start', 'inp-start', 'img-start');
            });
            document.getElementById('btn-roll-target').addEventListener('click', () => {
                localStorage.setItem(STORAGE_PREFIX + 'prefTarget', document.getElementById('sel-target').value);
                rollEntity('target', 'inp-target', 'img-target');
            });
            document.getElementById('sel-start').addEventListener('change', () => updateIcon('sel-start', 'btn-roll-start'));
            document.getElementById('sel-target').addEventListener('change', () => updateIcon('sel-target', 'btn-roll-target'));

            btnPlay.addEventListener('click', () => {
                setState('isPlaying', 'true'); setState('clicks', '0');
                setState('startTime', Date.now()); setState('endTime', '0');
                setState('finished', 'false'); setState('history', []); 
                window.location.href = getState().startUrl;
            });
        } else {
            const btnExit = document.getElementById('btn-mini-exit');
            const btnRestart = document.getElementById('btn-restart');
            const btnCopy = document.getElementById('btn-copy');
            if (btnExit) btnExit.addEventListener('click', (e) => { e.stopPropagation(); resetAll(true); });
            if (btnRestart) btnRestart.addEventListener('click', () => resetAll(false));
            if (btnCopy) btnCopy.addEventListener('click', copyStatsToClipboard);
        }
    }

    function resetAll(confirmNeeded) {
        if (confirmNeeded && !confirm("?")) return;
        setState('isPlaying', 'false'); setState('finished', 'false');
        setState('clicks', '0'); setState('startTime', '0');
        setState('endTime', '0'); setState('history', []);
        renderUI();
    }

    document.addEventListener('click', function(e) {
        const state = getState();
        if (!state.isPlaying || state.finished) return;
        const link = e.target.closest('a');
        if (link && !container.contains(link)) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('javascript') && !href.startsWith('#') && !href.startsWith('mailto')) {
                 setState('clicks', state.clicks + 1);
            }
        }
    }, true);

    function startUI() {
        if (document.getElementById(CONTAINER_ID)) return;
        document.body.appendChild(container);
        initCheck();
        renderUI();
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', startUI); } else { startUI(); }
})();