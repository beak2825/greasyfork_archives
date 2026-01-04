// ==UserScript==
// @name         StripChat Special Models Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track and manage special models on StripChat without AI filtering.
// @description  For a browser extension advanced version of this script with
// @description  thumbnail based AI filtering on models showing tits, armpits, butt, vagina, asshole (anus),
// @description  and more features, contact through email: sedsongs@proton.me
// @author       You
// @match        https://stripchat.com/*
// @match        https://www.stripchat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560610/StripChat%20Special%20Models%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/560610/StripChat%20Special%20Models%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('StripChat Special Models Tracker v1.0');

    // Intercept History API to detect SPA navigation
    (function (history) {
        var pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event('pushstate'));
        };
        var replaceState = history.replaceState;
        history.replaceState = function () {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('replacestate'));
        };
    })(window.history);

    // Listen for custom events and popstate to update button state
    window.addEventListener('pushstate', updateSpecialButtonState);
    window.addEventListener('replacestate', updateSpecialButtonState);
    window.addEventListener('popstate', updateSpecialButtonState);

    // Global variables
    let specialModels = new Map();
    let isFetching = false;
    let showSpecialModels = false;
    let filteredModelsByCategory = { 'SPECIAL': [], 'COUPLE': [], 'OTHER': [] };
    let collapsedCategories = new Set();

    // Logging
    function log(msg, type = 'info') {
        const colors = { info: '#4CAF50', warning: '#ff9800', error: '#f44336', debug: '#2196F3' };
        console.log(`%c[SpecialTracker] [${type.toUpperCase()}] ${msg}`, `color: ${colors[type] || '#ccc'}`);
    }

    function loadSpecialModels() {
        const defaultSpecialModels = [
            ["/mikakinamo", { "link": "/mikakinamo", "banned": false }],
            ["/ellieerose", { "link": "/ellieerose", "banned": false }],
            ["/vanessa_walters", { "link": "/vanessa_walters", "banned": false }],
            ["/amethystfoxx", { "link": "/amethystfoxx", "banned": true }],
            ["/whitefoxxie113", { "link": "/whitefoxxie113", "banned": false }]
        ];

        try {
            const saved = localStorage.getItem('specialModels');
            if (saved) {
                const parsedData = JSON.parse(saved);
                if (Array.isArray(parsedData)) {
                    specialModels = new Map(parsedData.map(([key, value]) => [key, { link: value.link || key, banned: value.banned || false }]));
                } else {
                    specialModels = new Map(defaultSpecialModels);
                }
            } else {
                specialModels = new Map(defaultSpecialModels);
                saveSpecialModels();
            }
        } catch (err) {
            log(`Error loading special models: ${err.message}`, 'error');
            specialModels = new Map(defaultSpecialModels);
        }
    }

    function saveSpecialModels() {
        try {
            const dataToSave = Array.from(specialModels.entries());
            localStorage.setItem('specialModels', JSON.stringify(dataToSave));
        } catch (err) {
            log(`Failed to save special models: ${err.message}`, 'error');
        }
    }

    function toggleSpecialModel() {
        const modelLink = window.location.pathname.replace(/\/+$/, '').toLowerCase();
        if (specialModels.has(modelLink)) {
            specialModels.delete(modelLink);
            log(`Removed ${modelLink} from special list`, 'info');
        } else {
            specialModels.set(modelLink, { link: modelLink, banned: false });
            log(`Added ${modelLink} to special list`, 'info');
        }
        saveSpecialModels();
        updateSpecialButtonState();
    }

    function updateSpecialButtonState() {
        const btn = document.getElementById('toggle-special-btn');
        if (!btn) return;
        const modelLink = window.location.pathname.replace(/\/+$/, '').toLowerCase();
        const model = specialModels.get(modelLink);

        if (model) {
            btn.textContent = `Remove Special (${model.banned ? 'Banned' : 'OK'})`;
            btn.style.background = model.banned ? '#f44336' : '#ffd700';
            btn.style.color = model.banned ? '#fff' : '#000';
        } else {
            btn.textContent = 'Add to Special';
            btn.style.background = '#9c27b0';
            btn.style.color = '#fff';
        }
    }

    function createUI() {
        const targetDiv = document.querySelector('[data-testid="viewcam-model-sections"]');
        if (!targetDiv || document.getElementById('special-models-section')) return;

        const section = document.createElement('div');
        section.id = 'special-models-section';
        section.style.cssText = `margin: 20px 0; padding: 15px; background: rgb(80, 30, 30); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);`;

        const viewCamPageMain = document.querySelector('.view-cam-page-main');
        if (viewCamPageMain) {
            viewCamPageMain.parentNode.insertBefore(section, viewCamPageMain.nextSibling);
        } else {
            targetDiv.parentNode.insertBefore(section, targetDiv);
        }

        section.innerHTML = `
            <button id="special-models-toggle" style="background: rgba(255,255,255,0.0); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 10px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;">
                <span style="font-size: 18px;">⭐</span>
                <span id="toggle-text">Show Favorites Library</span>
                <span id="special-count-badge" style="background: rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-left: auto;">0</span>
            </button>
            <div id="special-models-container" style="display: none; margin-top: 0px; padding-top: 15px;">
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                    <button id="refresh-specials-btn" style="background: #2196F3; border: none; color: white; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">Refresh Now</button>
                    <button id="edit-specials-btn" style="background: #ff9800; border: none; color: white; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">Edit Specials</button>
                    <button id="toggle-special-btn" style="background: #9c27b0; border: none; color: white; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">Add to Special</button>
                </div>
                <div id="special-models-grid" style="display: flex; flex-direction: column; gap: 20px; max-height: 600px; overflow-y: auto; padding-right: 10px;"></div>
            </div>
        `;

        document.getElementById('special-models-toggle').addEventListener('click', () => {
            showSpecialModels = !showSpecialModels;
            document.getElementById('special-models-container').style.display = showSpecialModels ? 'block' : 'none';
            if (showSpecialModels) fetchSpecials();
        });

        document.getElementById('refresh-specials-btn').addEventListener('click', fetchSpecials);
        document.getElementById('edit-specials-btn').addEventListener('click', showEditSpecialsUI);
        document.getElementById('toggle-special-btn').addEventListener('click', toggleSpecialModel);

        ensureStyles();
        updateSpecialButtonState();
    }

    function ensureStyles() {
        if (document.getElementById('special-tracker-styles')) return;
        const style = document.createElement('style');
        style.id = 'special-tracker-styles';
        style.textContent = `
            .category-section {
                display: flex; flex-direction: column; gap: 10px;
            }
            .category-header {
                color: #fff; font-size: 14px; font-weight: bold; padding: 10px 15px;
                background: rgba(255,255,255,0.06); border-radius: 8px; border-left: 4px solid #ffd700;
                cursor: pointer; display: flex; align-items: center; gap: 10px;
                position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px);
                user-select: none; transition: background 0.2s ease;
            }
            .category-header:hover { background: rgba(255,255,255,0.1); }
            .models-subgrid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;
            }
            .special-model-card {
                position: relative; overflow: hidden; text-decoration: none; color: inherit;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .special-model-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
        `;
        document.head.appendChild(style);
    }

    async function checkBroadcastsStatus(username) {
        try {
            const url = `https://stripchat.com/api/front/v1/broadcasts/${username}`;
            const resp = await fetch(url, { headers: { 'Accept': 'application/json', 'Referer': 'https://stripchat.com/' } });
            if (resp.status === 200) {
                const data = await resp.json();
                if (data.item && data.item.isLive) return data.item;
            }
        } catch (e) { }
        return null;
    }

    async function fetchSpecials() {
        if (isFetching) return;
        isFetching = true;
        log('Fetching favorites status...', 'info');
        filteredModelsByCategory = { 'SPECIAL': [], 'COUPLE': [], 'OTHER': [] };

        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const toff = new Date().getTimezoneOffset();
            const common = { 'Accept': '*/*', 'Content-Type': 'application/json', 'Referer': 'https://stripchat.com/favorites' };

            const dynUrl = `https://stripchat.com/api/front/v3/config/dynamic?uniq=${Math.random().toString(36).slice(2)}`;
            const dyn = await fetch(dynUrl, { credentials: 'include', headers: common });
            const dynData = await dyn.json();
            const token = dynData?.dynamic?.jwtToken || '';

            const favUrl = `https://stripchat.com/api/front/models/favorites?offset=0&sortBy=bestMatch&limit=100&uniq=${Math.random().toString(36).slice(2)}`;
            const headers = { ...common, Authorization: token };
            const fav = await fetch(favUrl, { credentials: 'include', headers });
            const favData = await fav.json();

            (favData.models || []).forEach(m => {
                const link = `/${m.username}`.toLowerCase();
                const special = specialModels.get(link);
                let thumb = m.previewUrlThumbSmall || m.previewUrl;
                if (m.snapshotTimestamp && m.id) thumb = `https://img.doppiocdn.com/thumbs/${m.snapshotTimestamp}/${m.id}`;

                const modelData = {
                    thumbnail: thumb,
                    modelName: m.username,
                    modelLink: link,
                    isOnline: (m.isLive || m.isOnline),
                    status: m.status || 'public',
                    isBanned: special ? special.banned : false
                };

                if (special) {
                    filteredModelsByCategory['SPECIAL'].push(modelData);
                } else if (m.gender === 'maleFemale') {
                    filteredModelsByCategory['COUPLE'].push(modelData);
                } else {
                    filteredModelsByCategory['OTHER'].push(modelData);
                }
            });

            // 2. Check banned specials not in favorites
            const bannedPromises = [];
            specialModels.forEach((model, link) => {
                if (model.banned && !filteredModelsByCategory['SPECIAL'].some(m => m.modelLink === link)) {
                    bannedPromises.push((async () => {
                        const live = await checkBroadcastsStatus(link.replace(/^\//, ''));
                        if (live) {
                            filteredModelsByCategory['SPECIAL'].push({
                                thumbnail: `https://img.doppiocdn.com/thumbs/${live.snapshotTimestamp}/${live.modelId}`,
                                modelName: live.username,
                                modelLink: link,
                                isOnline: true,
                                status: live.status || 'public',
                                isBanned: true
                            });
                        }
                    })());
                }
            });
            await Promise.all(bannedPromises);

            renderGrid();
        } catch (e) {
            log(`Error fetching favorites: ${e.message}`, 'error');
        } finally {
            isFetching = false;
        }
    }

    function renderGrid() {
        const grid = document.getElementById('special-models-grid');
        const badge = document.getElementById('special-count-badge');
        if (!grid) return;

        const total = Object.values(filteredModelsByCategory).reduce((acc, cat) => acc + cat.length, 0);
        badge.textContent = total;

        if (total === 0) {
            grid.innerHTML = '<div style="color:white;text-align:center;padding:20px;">No live favorites found.</div>';
            return;
        }

        const sections = [
            { id: 'SPECIAL', name: 'Special Models', color: '#ffd700' },
            { id: 'COUPLE', name: 'Couple Content', color: '#ff69b4' },
            { id: 'OTHER', name: 'Other Live Favorites', color: '#4CAF50' }
        ];

        grid.innerHTML = '';
        sections.forEach(sec => {
            const models = filteredModelsByCategory[sec.id];
            if (models.length === 0) return;

            const isCollapsed = collapsedCategories.has(sec.id);
            const container = document.createElement('div');
            container.className = 'category-section';

            const header = document.createElement('div');
            header.className = 'category-header';
            header.style.borderLeftColor = sec.color;
            header.innerHTML = `
                <span style="transition: transform 0.3s ease; transform: rotate(${isCollapsed ? '-90' : '0'}deg); color: ${sec.color}">▼</span>
                <span style="flex: 1;">${sec.name} (${models.length})</span>
                <span style="font-size: 11px; opacity: 0.6;">${isCollapsed ? 'click to expand' : 'click to collapse'}</span>
            `;

            header.onclick = () => {
                if (collapsedCategories.has(sec.id)) collapsedCategories.delete(sec.id);
                else collapsedCategories.add(sec.id);
                renderGrid();
            };

            container.appendChild(header);

            if (!isCollapsed) {
                const subgrid = document.createElement('div');
                subgrid.className = 'models-subgrid';
                subgrid.innerHTML = models.map(m => `
                    <a href="${m.modelLink}" class="special-model-card" style="${m.isBanned ? 'background: rgba(244, 67, 54, 0.15);' : ''}">
                        <div style="position: relative;">
                            <img src="${m.thumbnail}" style="width: 100%; height: 120px; object-fit: cover;">
                            ${m.status !== 'public' ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">${m.status.toUpperCase()}</div>` : ''}
                            <div style="position:absolute;bottom:0;width:100%;background:rgba(0,0,0,0.5);color:white;text-align:center;font-size:11px;padding:2px 0;">${m.modelName}</div>
                            ${m.isOnline ? `<div style="position:absolute;top:6px;right:6px;background:#4CAF50;color:white;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:bold;">LIVE</div>` : ''}
                            ${m.isBanned ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:bold;">BANNED</div>` : ''}
                        </div>
                    </a>
                `).join('');

                subgrid.querySelectorAll('a').forEach(a => {
                    a.onclick = (e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                        e.preventDefault();
                        const link = a.getAttribute('href');
                        if (window.location.pathname !== link) {
                            history.pushState({}, '', link);
                            window.dispatchEvent(new Event('popstate'));
                        }
                    };
                });
                container.appendChild(subgrid);
            }
            grid.appendChild(container);
        });
    }

    function showEditSpecialsUI() {
        const existing = document.getElementById('specials-modal'); if (existing) existing.remove();
        const modal = document.createElement('div'); modal.id = 'specials-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;';

        const listHTML = Array.from(specialModels.entries()).map(([link, m]) => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:10px; background:#f0f0f0; border-radius:4px; color: black;">
                <span style="flex:1;">${link}</span>
                <label style="font-size:12px; margin-right:15px;"><input type="checkbox" class="ban-toggle" data-link="${link}" ${m.banned ? 'checked' : ''}> Banned</label>
                <button class="del-special" data-link="${link}" style="background:#f44336; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background:white; padding:20px; border-radius:8px; width:80%; max-width:600px; max-height:80%; overflow:auto; color:black;">
                <h3 style="margin-top:0;">Edit Special Models</h3>
                <div id="specials-list-container">${listHTML}</div>
                <div style="margin-top:20px; display:flex; gap:10px;">
                    <input id="new-special-link" placeholder="/username" style="flex:1; padding:8px;">
                    <button id="add-special-btn" style="background:#4CAF50; color:white; border:none; padding:8px 16px; border-radius:4px;">Add</button>
                    <button id="close-specials" style="background:#2196F3; color:white; border:none; padding:8px 16px; border-radius:4px;">Close</button>
                </div>
            </div>`;

        document.body.appendChild(modal);

        modal.querySelectorAll('.ban-toggle').forEach(cb => cb.onchange = () => {
            const m = specialModels.get(cb.dataset.link);
            if (m) { m.banned = cb.checked; saveSpecialModels(); updateSpecialButtonState(); }
        });
        modal.querySelectorAll('.del-special').forEach(btn => btn.onclick = () => {
            specialModels.delete(btn.dataset.link);
            saveSpecialModels(); updateSpecialButtonState(); showEditSpecialsUI();
        });
        modal.querySelector('#add-special-btn').onclick = () => {
            let link = modal.querySelector('#new-special-link').value.trim();
            if (!link) return;
            if (!link.startsWith('/')) link = '/' + link;
            specialModels.set(link.toLowerCase(), { link: link.toLowerCase(), banned: false });
            saveSpecialModels(); updateSpecialButtonState(); showEditSpecialsUI();
        };
        modal.querySelector('#close-specials').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    function init() {
        loadSpecialModels();

        const observer = new MutationObserver(() => {
            if (!document.getElementById('special-models-section')) {
                if (document.querySelector('[data-testid="viewcam-model-sections"]') || document.querySelector('.view-cam-page-main')) {
                    createUI();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial try
        createUI();
    }

    init();

})();
