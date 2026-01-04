// ==UserScript==
// @name         CS.RIN.RU - Cover on Hover (SteamGridDB) v3
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Shows high-quality game covers and metadata (release year) when hovering over topic titles on CS.RIN.RU using the SteamGridDB API.
// @match        https://cs.rin.ru/forum/viewforum.php*
// @match        https://cs.rin.ru/forum/search.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      steamgriddb.com
// @downloadURL https://update.greasyfork.org/scripts/560361/CSRINRU%20-%20Cover%20on%20Hover%20%28SteamGridDB%29%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/560361/CSRINRU%20-%20Cover%20on%20Hover%20%28SteamGridDB%29%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const API_KEY = 'YOUR_API_KEY'; // <--- PASTE YOUR API KEY HERE
    const HOVER_DELAY = 400;
    // ---------------------

    GM_addStyle(`
        #game-cover-tooltip {
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            box-shadow: 0 8px 16px rgba(0,0,0,0.7);
            border: 1px solid #444;
            background: #151515;
            padding: 0;
            width: 240px;
            border-radius: 8px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s ease-out, transform 0.2s ease-out;
            visibility: hidden;
        }
        #game-cover-tooltip.visible {
            opacity: 1;
            transform: translateY(0);
            visibility: visible;
        }
        #game-cover-tooltip img {
            width: 100%;
            height: auto;
            display: block;
            border-bottom: 1px solid #333;
        }
        #game-cover-tooltip .meta-info {
            padding: 8px 10px;
            color: #ccc;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            background: #1b1b1b;
        }
        #game-cover-tooltip .meta-title {
            color: #fff;
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 4px;
            display: block;
        }
        #game-cover-tooltip .loading {
            color: #888;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
    `);

    const tooltip = document.createElement('div');
    tooltip.id = 'game-cover-tooltip';
    document.body.appendChild(tooltip);

    const cache = {};
    let currentRequest = null;
    let hoverTimeout = null;

    function cleanGameTitle(text) {
        let cleaned = text.replace(/^\[.*?\]\s*/, '').replace(/^\(.*?\)\s*/, '');
        cleaned = cleaned.replace(/v\d+(\.\d+)*.*/i, '');
        return cleaned.trim();
    }

    function fetchGameInfo(gameName) {
        if (cache[gameName]) {
            renderTooltip(cache[gameName]);
            return;
        }

        if (currentRequest) currentRequest.abort();

        tooltip.innerHTML = '<div class="loading">Searching...</div>';

        currentRequest = GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameName)}`,
            headers: { "Authorization": `Bearer ${API_KEY}` },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.success && data.data && data.data.length > 0) {
                        const gameData = data.data[0];
                        const gameId = gameData.id;
                        const gameInfo = {
                            id: gameId,
                            name: gameData.name,
                            release_date: gameData.release_date ? new Date(gameData.release_date * 1000).getFullYear() : 'N/A',
                            types: gameData.types
                        };

                        fetchGrid(gameInfo, gameName);
                    } else {
                        cache[gameName] = { error: 'Not found' };
                        renderTooltip(cache[gameName]);
                    }
                } catch (e) { console.error(e); }
            }
        });
    }

    function fetchGrid(gameInfo, gameName) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.steamgriddb.com/api/v2/grids/game/${gameInfo.id}?dimensions=600x900,342x482`,
            headers: { "Authorization": `Bearer ${API_KEY}` },
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.success && data.data && data.data.length > 0) {
                    gameInfo.imageUrl = data.data[0].url;
                    cache[gameName] = gameInfo;
                    renderTooltip(gameInfo);
                } else {
                    fetchHero(gameInfo, gameName);
                }
            }
        });
    }

    function fetchHero(gameInfo, gameName) {
         GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.steamgriddb.com/api/v2/heroes/game/${gameInfo.id}`,
            headers: { "Authorization": `Bearer ${API_KEY}` },
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.success && data.data && data.data.length > 0) {
                    gameInfo.imageUrl = data.data[0].url;
                } else {
                    gameInfo.error = "No image";
                }
                cache[gameName] = gameInfo;
                renderTooltip(gameInfo);
            }
        });
    }

    function renderTooltip(info) {
        if (info.error) {
             tooltip.innerHTML = `<div class="loading">${info.error}</div>`;
             return;
        }

        const yearHtml = info.release_date !== 'N/A' ? `<span style="color:#888;">(${info.release_date})</span>` : '';

        tooltip.innerHTML = `
            <img src="${info.imageUrl}" alt="${info.name}">
            <div class="meta-info">
                <span class="meta-title">${info.name} ${yearHtml}</span>
            </div>
        `;
    }

    const links = document.querySelectorAll('a.topictitle');

    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            if (link.hasAttribute('title')) {
                link.dataset.originalTitle = link.getAttribute('title');
                link.removeAttribute('title');
            }

            const rawTitle = link.innerText;
            const gameName = cleanGameTitle(rawTitle);

            hoverTimeout = setTimeout(() => {
                updateTooltipPosition(e);
                tooltip.classList.add('visible');

                if (gameName.length > 1) {
                    fetchGameInfo(gameName);
                }
            }, HOVER_DELAY);
        });

        link.addEventListener('mousemove', (e) => {
            if (tooltip.classList.contains('visible')) {
                updateTooltipPosition(e);
            }
        });

        link.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);

            tooltip.classList.remove('visible');

            setTimeout(() => {
                 if (!tooltip.classList.contains('visible')) tooltip.innerHTML = '';
            }, 200);

            if (link.dataset.originalTitle) {
                link.setAttribute('title', link.dataset.originalTitle);
                delete link.dataset.originalTitle;
            }

            if (currentRequest) {
                currentRequest.abort();
                currentRequest = null;
            }
        });
    });

    function updateTooltipPosition(e) {
        let top = e.clientY + 20;
        let left = e.clientX + 25;
        const tooltipRect = tooltip.getBoundingClientRect();

        if (left + tooltipRect.width > window.innerWidth) {
            left = e.clientX - tooltipRect.width - 15;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = e.clientY - tooltipRect.height - 15;
        }

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    }

})();