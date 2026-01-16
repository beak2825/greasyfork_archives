// ==UserScript==
// @name         Transfermarkt Speedrun
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Speedrun per Transfermarkt
// @author       Derus
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

(function() {
    'use strict';

    const STORAGE_PREFIX = 'derus_speedrun_v14_';
    const BASE_URL = window.location.origin;
    const DEFAULT_IMG = 'https://tmssl.akamaized.net/images/portrait/header/default.jpg';

    const CONTAINER_ID = 'derus-speedrun-overlay';
    const HEADER_ID = 'derus-speedrun-header';

    // --- FONTI ---
    const SOURCES = {
        transfers: {
            label: 'Trasferimenti Recenti',
            type: 'paged_url',
            url: '/transfers/neuestetransfers/statistik',
            max_pages: 100
        },
        rumors: {
            label: 'Rumors / Forum Mercato',
            type: 'paged_url',
            url: '/calciomercato/detail/forum/154',
            max_pages: 5
        },
        legends: {
            label: 'Leggende / Pallone d\'Oro',
            type: 'paged_url',
            url: '/erfolge/spielertitel/statistik/676',
            max_pages: 3
        },
        random_id: {
            label: 'Giocatore a caso (Random)',
            type: 'id_generator'
        },
        // NUOVA OPZIONE AGGIUNTA
        search: {
            label: '🔎 Cerca Giocatore (Sfida)',
            type: 'search'
        }
    };

    // --- STATO ---
    function getState() {
        return {
            targetUrl: localStorage.getItem(STORAGE_PREFIX + 'targetUrl') || '',
            targetName: localStorage.getItem(STORAGE_PREFIX + 'targetName') || '',
            targetImg: localStorage.getItem(STORAGE_PREFIX + 'targetImg') || DEFAULT_IMG,
            startUrl: localStorage.getItem(STORAGE_PREFIX + 'startUrl') || '',
            startName: localStorage.getItem(STORAGE_PREFIX + 'startName') || '',
            startImg: localStorage.getItem(STORAGE_PREFIX + 'startImg') || DEFAULT_IMG,
            clicks: parseInt(localStorage.getItem(STORAGE_PREFIX + 'clicks') || '0'),
            isPlaying: localStorage.getItem(STORAGE_PREFIX + 'isPlaying') === 'true',
            finished: localStorage.getItem(STORAGE_PREFIX + 'finished') === 'true',
            posX: localStorage.getItem(STORAGE_PREFIX + 'posX') || '20px',
            posY: localStorage.getItem(STORAGE_PREFIX + 'posY') || '20px'
        };
    }

    function setState(key, value) {
        localStorage.setItem(STORAGE_PREFIX + key, value);
    }

    function initCheck() {
        const state = getState();
        if (state.isPlaying && (!state.targetUrl || !state.startUrl)) {
            resetAll(false);
        }
    }

    // --- UTILITIES ---
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    resolve({ text: response.responseText, finalUrl: response.finalUrl });
                },
                onerror: err => reject("Errore di rete")
            });
        });
    }

    function enhanceImageQuality(url) {
        if (!url) return DEFAULT_IMG;
        return url
            .replace('/small/', '/header/')
            .replace('/medium/', '/header/')
            .replace('/tiny/', '/header/');
    }

    function cleanPlayerName(rawName) {
        if (!rawName) return "Sconosciuto";
        return rawName
            .replace(/#\d+\s*/, '')
            .replace(/\n/g, '')
            .replace(/\t/g, '')
            .trim();
    }

    // --- GENERATORE ID ---
    async function findValidRandomPlayer(statusCallback) {
        const MIN_ID = 10000;
        const MAX_ID = 1350000;

        for (let i = 1; i <= 30; i++) {
            const randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
            const testUrl = `${BASE_URL}/check/profil/spieler/${randomId}`;
            statusCallback(`Provo ID: ${randomId}...`);

            try {
                const response = await gmFetch(testUrl);
                const cleanFinal = response.finalUrl.replace(/\/$/, "");
                const cleanBase = BASE_URL.replace(/\/$/, "");

                if (cleanFinal !== cleanBase && response.finalUrl.includes('/profil/spieler/')) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.text, 'text/html');

                    let pageTitle = doc.querySelector('h1') ? doc.querySelector('h1').innerText : doc.title;
                    let finalName = cleanPlayerName(pageTitle);

                    let imgUrl = DEFAULT_IMG;
                    const imgEl = doc.querySelector('.data-header__profile-image') || doc.querySelector('#suche-spieler-foto');
                    if (imgEl) imgUrl = imgEl.src;

                    return { name: finalName, url: response.finalUrl, img: enhanceImageQuality(imgUrl) };
                }
            } catch (e) {}
        }
        throw new Error("Nessun ID valido trovato.");
    }

    // --- NUOVA FUNZIONE DI RICERCA ---
    async function searchPlayerByName(query) {
        // Usa la ricerca veloce di Transfermarkt
        const searchUrl = `${BASE_URL}/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(query)}`;

        const response = await gmFetch(searchUrl);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.text, 'text/html');

        // Cerca il primo link giocatore nella tabella dei risultati
        // Solitamente è nella tabella con classe 'items' o nella lista risultati
        const playerLink = doc.querySelector('a[href*="/profil/spieler/"]');

        if (playerLink) {
            const rawName = playerLink.getAttribute('title') || playerLink.innerText;
            const finalName = cleanPlayerName(rawName);
            const href = playerLink.getAttribute('href');

            // Cerca immagine
            let imgSrc = DEFAULT_IMG;
            // Spesso nei risultati l'immagine è nella cella precedente
            const row = playerLink.closest('tr');
            if (row) {
                const imgTag = row.querySelector('img');
                if (imgTag) imgSrc = imgTag.getAttribute('src') || imgTag.getAttribute('data-src');
            }

            return {
                name: finalName,
                url: BASE_URL + href,
                img: enhanceImageQuality(imgSrc)
            };
        }
        return null;
    }

    // --- SCRAPER LISTE ---
    async function scrapePlayerFromList(url) {
        const response = await gmFetch(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.text, 'text/html');

        const allLinks = Array.from(doc.querySelectorAll('a[href*="/profil/spieler/"]'));
        const candidates = [];
        const seenUrls = new Set();

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            let rawName = link.getAttribute('title') || link.innerText;

            if (href && rawName && rawName.trim().length > 2 && !seenUrls.has(href)) {
                const finalName = cleanPlayerName(rawName);

                let imgSrc = DEFAULT_IMG;
                let imgTag = link.querySelector('img');

                if (!imgTag) {
                    const parent = link.parentElement;
                    if (parent) imgTag = parent.querySelector('img');
                }

                if (!imgTag) {
                    const container = link.closest('tr') || link.closest('article');
                    if (container) imgTag = container.querySelector('img');
                }

                if (imgTag) {
                    imgSrc = imgTag.getAttribute('data-src') || imgTag.getAttribute('src');
                }

                candidates.push({
                    name: finalName,
                    url: BASE_URL + href,
                    img: enhanceImageQuality(imgSrc)
                });
                seenUrls.add(href);
            }
        });

        if (!candidates.length) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // --- CORE LOGIC ---
    async function rollPlayer(type, inputId, imgId) {
        const input = document.getElementById(inputId);
        const imgEl = document.getElementById(imgId);
        const sourceKey = document.getElementById(type === 'start' ? 'sel-start' : 'sel-target').value;
        const sourceConfig = SOURCES[sourceKey];

        // Se è ricerca manuale
        if (sourceConfig.type === 'search') {
            const userQuery = prompt("Scrivi il nome del giocatore:");
            if (!userQuery || userQuery.trim() === "") return; // Annullato

            input.style.backgroundColor = "#fff3cd";
            input.value = "Cerco " + userQuery + "...";
            imgEl.style.opacity = "0.5";

            try {
                const player = await searchPlayerByName(userQuery);
                if (player) {
                    setState(type + 'Name', player.name);
                    setState(type + 'Url', player.url);
                    setState(type + 'Img', player.img);

                    input.value = player.name;
                    input.style.backgroundColor = "#d4edda";
                    imgEl.src = player.img;
                    imgEl.style.opacity = "1";
                    renderUI();
                } else {
                    alert("Giocatore non trovato!");
                    input.value = "Non trovato";
                    input.style.backgroundColor = "#f8d7da";
                    imgEl.style.opacity = "1";
                }
            } catch (e) {
                alert("Errore ricerca: " + e.message);
                input.value = "Errore";
                imgEl.style.opacity = "1";
            }
            return;
        }

        // Se è modalità automatica
        input.style.backgroundColor = "#fff3cd";
        input.value = "Ricerca in corso...";
        imgEl.style.opacity = "0.5";

        try {
            let player = null;

            if (sourceConfig.type === 'id_generator') {
                player = await findValidRandomPlayer((msg) => { input.value = msg; });
            } else if (sourceConfig.type === 'paged_url') {
                const maxPage = sourceConfig.max_pages || 1;
                const randomPage = Math.floor(Math.random() * maxPage) + 1;
                const pageUrl = `${BASE_URL}${sourceConfig.url}/page/${randomPage}`;
                player = await scrapePlayerFromList(pageUrl);
            } else {
                player = await scrapePlayerFromList(BASE_URL + sourceConfig.url);
            }

            if (player) {
                setState(type + 'Name', player.name);
                setState(type + 'Url', player.url);
                setState(type + 'Img', player.img);

                input.value = player.name;
                input.style.backgroundColor = "#d4edda";
                imgEl.src = player.img;
                imgEl.style.opacity = "1";

                renderUI();
            } else {
                throw new Error("Nessun giocatore trovato.");
            }

        } catch (e) {
            console.error(e);
            input.value = "Errore!";
            input.style.backgroundColor = "#f8d7da";
            imgEl.style.opacity = "1";
        }
    }

    // --- UI ---
    const container = document.createElement('div');
    container.id = CONTAINER_ID;

    const savedState = getState();
    const initialStyle = savedState.posX === '20px'
        ? `bottom: 20px; right: 20px;`
        : `top: ${savedState.posY}; left: ${savedState.posX};`;

    container.style.cssText = `
        position: fixed; ${initialStyle} width: 320px;
        background: #ffffff; border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3); z-index: 9999999;
        font-family: 'Source Sans Pro', Arial, sans-serif;
        overflow: hidden; border: 1px solid #ddd;
    `;

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(HEADER_ID);
        if (header) header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
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
            options += `<option value="${key}" ${isSelected}>${data.label}</option>`;
        }
        return options;
    }

    function renderUI() {
        const state = getState();
        const isTargetReached = checkWinCondition();

        const headerStyle = `background: #1a3151; padding: 12px 15px; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;`;

        let contentHtml = '';

        if (state.isPlaying) {
            let status = state.finished || isTargetReached ?
                '<span style="color:#28a745; font-weight:800">VITTORIA!</span>' : 'Trova il collegamento...';

            if ((!state.finished) && isTargetReached) setState('finished', 'true');

            contentHtml = `
                <div style="padding: 20px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 8px;">OBIETTIVO</div>
                        <img src="${state.targetImg}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #1a3151; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <div style="font-size: 18px; font-weight: bold; color: #1a3151; margin-top: 10px; line-height: 1.2;">${state.targetName}</div>
                    </div>

                    <div style="display: flex; justify-content: center; align-items: baseline; gap: 5px; margin-bottom: 15px; background: #f8f9fa; padding: 10px; border-radius: 8px;">
                        <span style="font-size: 32px; font-weight: bold; color: #d9534f;">${state.clicks}</span>
                        <span style="font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold;">Click</span>
                    </div>

                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px;">${status}</div>

                    ${state.finished || isTargetReached ? `<button id="btn-restart" style="width: 100%; padding: 12px; background: #1a3151; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Nuova Partita</button>` : ''}
                </div>
            `;
        } else {
            const lastStart = localStorage.getItem(STORAGE_PREFIX + 'prefStart') || 'transfers';
            const lastTarget = localStorage.getItem(STORAGE_PREFIX + 'prefTarget') || 'random_id';

            contentHtml = `
                <div style="padding: 15px;">
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; font-weight: bold; color: #1a3151; margin-bottom: 5px;">PARTENZA</div>
                        <select id="sel-start" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 8px;">${getDropdownOptions(lastStart)}</select>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img id="img-start" src="${state.startImg}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover;">
                            <div style="flex: 1; display: flex; gap: 5px;">
                                <input id="inp-start" value="${state.startName}" readonly style="width: 100%; border: 1px solid #ccc; padding: 6px; border-radius: 4px; font-size: 13px;">
                                <button id="btn-roll-start" style="cursor: pointer; padding: 0 10px; background: #e9ecef; border: 1px solid #ced4da; border-radius: 4px;">🎲</button>
                            </div>
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 11px; font-weight: bold; color: #d9534f; margin-bottom: 5px;">ARRIVO</div>
                        <select id="sel-target" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 8px;">${getDropdownOptions(lastTarget)}</select>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img id="img-target" src="${state.targetImg}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover;">
                            <div style="flex: 1; display: flex; gap: 5px;">
                                <input id="inp-target" value="${state.targetName}" readonly style="width: 100%; border: 1px solid #ccc; padding: 6px; border-radius: 4px; font-size: 13px;">
                                <button id="btn-roll-target" style="cursor: pointer; padding: 0 10px; background: #e9ecef; border: 1px solid #ced4da; border-radius: 4px;">🎲</button>
                            </div>
                        </div>
                    </div>

                    <button id="btn-play" style="width: 100%; padding: 12px; background: #1a3151; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: 0.5; pointer-events: none; transition: opacity 0.2s;">INIZIA SPEEDRUN ▶</button>
                </div>
            `;
        }

        container.innerHTML = `<div id="${HEADER_ID}" style="${headerStyle}"><span style="font-weight: bold;">⚡ TM Speedrun</span>${state.isPlaying ? '<button id="btn-mini-exit" style="background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; font-size: 10px; padding: 4px 8px; border-radius: 4px;">ESCI</button>' : ''}</div>${contentHtml}`;

        makeDraggable(container);

        if (!state.isPlaying) {
            const btnPlay = document.getElementById('btn-play');
            if (state.startName && state.targetName) {
                btnPlay.style.opacity = '1';
                btnPlay.style.pointerEvents = 'auto';
            }

            document.getElementById('btn-roll-start').addEventListener('click', () => {
                localStorage.setItem(STORAGE_PREFIX + 'prefStart', document.getElementById('sel-start').value);
                rollPlayer('start', 'inp-start', 'img-start');
            });
            document.getElementById('btn-roll-target').addEventListener('click', () => {
                localStorage.setItem(STORAGE_PREFIX + 'prefTarget', document.getElementById('sel-target').value);
                rollPlayer('target', 'inp-target', 'img-target');
            });
            btnPlay.addEventListener('click', () => {
                setState('isPlaying', 'true');
                setState('clicks', '0');
                setState('finished', 'false');
                window.location.href = getState().startUrl;
            });
        } else {
            const btnExit = document.getElementById('btn-mini-exit');
            const btnRestart = document.getElementById('btn-restart');
            if (btnExit) btnExit.addEventListener('click', () => resetAll(true));
            if (btnRestart) btnRestart.addEventListener('click', () => resetAll(false));
        }
    }

    function resetAll(confirmNeeded) {
        if (confirmNeeded && !confirm("Tornare al menu?")) return;
        setState('isPlaying', 'false');
        setState('finished', 'false');
        setState('clicks', '0');
        renderUI();
    }

    function checkWinCondition() {
        const state = getState();
        if (!state.targetUrl || !state.isPlaying) return false;
        try {
            const currentPath = new URL(window.location.href).pathname;
            const targetPath = new URL(state.targetUrl, BASE_URL).pathname;
            const currentId = currentPath.match(/spieler\/(\d+)/);
            const targetId = targetPath.match(/spieler\/(\d+)/);
            if (currentId && targetId && currentId[1] === targetId[1]) return true;
            return false;
        } catch(e) { return false; }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startUI);
    } else {
        startUI();
    }
})();