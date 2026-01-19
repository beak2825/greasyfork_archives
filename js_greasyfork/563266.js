// ==UserScript==
// @name         CS.RIN.RU - Steam Meta-Preview (V11.1 - Fix)
// @namespace    http://tampermonkey.net/
// @version      11.1
// @description  Interactive hover box. Clicking the play button thumbnail opens YouTube gameplay.
// @match        https://cs.rin.ru/forum/viewforum.php*
// @match        https://cs.rin.ru/forum/search.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      steamgriddb.com
// @connect      steampowered.com
// @licence MIT
// @downloadURL https://update.greasyfork.org/scripts/563266/CSRINRU%20-%20Steam%20Meta-Preview%20%28V111%20-%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563266/CSRINRU%20-%20Steam%20Meta-Preview%20%28V111%20-%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'ENTER-API-KEY-HERE'; // MUST BE VALID
    const HOVER_DELAY = 450;
    const TOOLTIP_WIDTH = 780;

    GM_addStyle(`
        #game-preview-tooltip {
            position: fixed; z-index: 100000;
            pointer-events: auto;
            display: flex; width: ${TOOLTIP_WIDTH}px; height: 440px;
            background: #171d25; color: #c6d4df; border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.9); overflow: hidden;
            opacity: 0; transform: translateY(10px); transition: opacity 0.3s; visibility: hidden;
            font-family: Arial, sans-serif; border: 1px solid #4d5666;
        }
        #game-preview-tooltip.visible { opacity: 1; transform: translateY(0); visibility: visible; }
        .preview-left { width: 280px; flex-shrink: 0; background: #000; }
        .preview-left img { width: 100%; height: 100%; object-fit: cover; }
        .preview-center { flex: 1; padding: 20px; display: flex; flex-direction: column; background: #1b2838; overflow-y: auto; }
        .preview-title { font-size: 20px; color: #fff; margin-bottom: 5px; font-weight: bold; }
        .preview-genres { font-size: 11px; color: #66c0f4; margin-bottom: 12px; text-transform: uppercase; }
        .preview-desc { font-size: 13px; line-height: 1.5; color: #acb2b8; margin-bottom: 20px; }
        .preview-stats { margin-top: auto; font-size: 12px; border-top: 1px solid #3d4450; padding-top: 12px; }
        .stat-row { margin-bottom: 5px; display: flex; }
        .stat-label { color: #556772; width: 110px; font-weight: bold; }
        .preview-right { width: 180px; flex-shrink: 0; padding: 10px; display: flex; flex-direction: column; gap: 8px; background: #10161b; }
        .thumb-container { width: 100%; height: 85px; position: relative; border-radius: 3px; border: 1px solid #2a3f5a; overflow: hidden; }
        .thumb-container img { width: 100%; height: 100%; object-fit: cover; }
        .yt-link-container { cursor: pointer; }
        .video-trigger-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; }
        .video-trigger-overlay::after {
            content: '▶'; color: white; font-size: 20px; background: #cc0000;
            width: 45px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px;
        }
    `);

    const tooltip = document.createElement('div');
    tooltip.id = 'game-preview-tooltip';
    document.body.appendChild(tooltip);

    let hoverTimeout = null;
    let isInside = false;
    const cache = {};

    function cleanTitle(t) {
        return t.replace(/\[.*?\]|\(.*?\)|v\d+(\.\d+)*|Steam|Epic|GOG|Full Game|Repack|Crack/gi, '')
                .split(/[|\-]/)[0].trim();
    }

    function fetchMeta(gameName) {
        if (cache[gameName]) return renderUI(cache[gameName]);
        tooltip.innerHTML = `<div style="padding:20px; color:#66c0f4;">Searching for: ${gameName}...</div>`;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameName)}`,
            headers: { "Authorization": `Bearer ${API_KEY}` },
            timeout: 5000,
            onload: (res) => {
                try {
                    const sgData = JSON.parse(res.responseText);
                    const game = sgData.data?.[0];
                    if (game) {
                        fetchCoverAndSteam(game.id, game.external_ids?.steam?.id, game.name, gameName);
                    } else {
                        tooltip.innerHTML = '<div style="padding:20px">No match found on SGDB.</div>';
                    }
                } catch (e) {
                    tooltip.innerHTML = '<div style="padding:20px">Error parsing SGDB data. Check API Key.</div>';
                }
            },
            onerror: () => { tooltip.innerHTML = '<div style="padding:20px">Connection Error (SGDB).</div>'; }
        });
    }

    function fetchCoverAndSteam(sgdbId, appId, officialName, searchKey) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.steamgriddb.com/api/v2/grids/game/${sgdbId}?dimensions=600x900`,
            headers: { "Authorization": `Bearer ${API_KEY}` },
            onload: (gridRes) => {
                const coverUrl = JSON.parse(gridRes.responseText).data?.[0]?.url;
                if (appId) {
                    getDetails(appId, coverUrl, searchKey);
                } else {
                    deepSearchSteam(officialName, coverUrl, searchKey);
                }
            }
        });
    }

    function deepSearchSteam(name, coverUrl, searchKey) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&l=english&cc=US`,
            onload: (res) => {
                const data = JSON.parse(res.responseText);
                if (data.total > 0) {
                    getDetails(data.items[0].id, coverUrl || data.items[0].tiny_image, searchKey);
                } else {
                    tooltip.innerHTML = '<div style="padding:20px">Game not found on Steam.</div>';
                }
            }
        });
    }

    function getDetails(appId, coverUrl, searchKey) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://store.steampowered.com/api/appdetails?appids=${appId}`,
            onload: (sRes) => {
                const sData = JSON.parse(sRes.responseText)[appId];
                if (sData && sData.success) {
                    const finalData = { ...sData.data, coverUrl: coverUrl };
                    cache[searchKey] = finalData;
                    renderUI(finalData);
                } else {
                    tooltip.innerHTML = '<div style="padding:20px">Steam data request failed.</div>';
                }
            }
        });
    }

    function renderUI(data) {
        const screenshots = data.screenshots?.slice(0, 3) || [];
        const videoThumb = data.movies?.[0]?.thumbnail || (screenshots[0] ? screenshots[0].path_thumbnail : '');
        const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.name + ' gameplay trailer')}`;

        tooltip.innerHTML = `
            <div class="preview-left"><img src="${data.coverUrl}"></div>
            <div class="preview-center">
                <div class="preview-title">${data.name}</div>
                <div class="preview-genres">${data.genres?.map(g => g.description).join(' • ') || 'Game'}</div>
                <div class="preview-desc">${data.short_description || 'No description provided.'}</div>
                <div class="preview-stats">
                    <div class="stat-row"><span class="stat-label">REVIEWS:</span> <span style="color:#66c0f4">${data.recommendations?.total?.toLocaleString() || 'N/A'}</span></div>
                    <div class="stat-row"><span class="stat-label">DEVELOPER:</span> <span>${data.developers?.join(', ')}</span></div>
                </div>
            </div>
            <div class="preview-right">
                ${screenshots.map(s => `<div class="thumb-container"><img src="${s.path_thumbnail}"></div>`).join('')}
                <a href="${ytSearchUrl}" target="_blank" class="thumb-container yt-link-container">
                    <img src="${videoThumb}">
                    <div class="video-trigger-overlay"></div>
                </a>
            </div>
        `;
    }

    // Logic for hover tracking
    document.querySelectorAll('a.topictitle').forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            isInside = true;
            const gameName = cleanTitle(link.innerText);
            hoverTimeout = setTimeout(() => {
                if (isInside) {
                    updatePos(e);
                    tooltip.classList.add('visible');
                    fetchMeta(gameName);
                }
            }, HOVER_DELAY);
        });
        link.addEventListener('mouseleave', () => {
            isInside = false;
            setTimeout(() => { if (!isInside) tooltip.classList.remove('visible'); }, 400);
        });
    });

    tooltip.addEventListener('mouseenter', () => { isInside = true; });
    tooltip.addEventListener('mouseleave', () => { isInside = false; setTimeout(() => { if (!isInside) tooltip.classList.remove('visible'); }, 400); });

    function updatePos(e) {
        let x = e.clientX + 15;
        let y = e.clientY + 15;
        if (x + TOOLTIP_WIDTH > window.innerWidth) x = e.clientX - TOOLTIP_WIDTH - 20;
        if (y + 440 > window.innerHeight) y = window.innerHeight - 460;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
})();