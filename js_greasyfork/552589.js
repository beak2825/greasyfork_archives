// ==UserScript==
// @name         HDRezka Series Grid View
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Добавляет отдельную сетку всех сериалов с постерами и кратким описанием из правого блока "Горячие обновления сериалов" на HDRezka (Не на всех зеркалах)
// @author       ChatGPT
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://media.discordapp.net/attachments/613661716017840179/1427647608230383646/avatar.png?ex=68ef9ff2&is=68ee4e72&hm=ee9f11e29cda41f4153208dda58179b8d7e431ee4a8d1a187dbed21346b1e314&=&format=webp&quality=lossless&width=150&height=150
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552589/HDRezka%20Series%20Grid%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/552589/HDRezka%20Series%20Grid%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideTimer = null;
    const HIDE_DELAY = 300;
    let remoteCache = {}; // Local in-memory cache
    const CACHE_KEY = 'hdrezka_series_grid_cache';

    // --- State Variables ---
    let currentPopupTriggerHref = null; // Tracks which poster link opened the popup

    // --- Grid Configuration ---
    const ITEMS_PER_PAGE = 20;
    let currentPage = 1;
    let uniqueSeriesData = [];

    // --- Hover Popup Configuration ---
    const POPUP_WIDTH = 300;
    const POPUP_HEIGHT = 270;

    // 1. CSS STYLING (Unchanged)
    GM_addStyle(`
        /* --- Hover Popup Styles --- */
        #tm_rezka_popup {
            position: fixed;
            z-index: 100005;
            padding: 10px;
            background: rgba(18, 18, 18, 0.95);
            border: 2px solid #ff5917;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
            width: ${POPUP_WIDTH}px;
            height: ${POPUP_HEIGHT}px;
            pointer-events: auto;
            display: none;
            transition: opacity 0.2s;
            opacity: 0;
            color: #ccc;
            font-family: sans-serif;
            font-size: 13px;
            line-height: 1.3;
            flex-direction: column;
            box-sizing: border-box;
        }
        #tm_rezka_popup.floating-details-mode {
            display: flex !important;
        }
        #tm_rezka_popup .tm-title-popup, #tm_rezka_popup .tm-episode-popup {
            flex-shrink: 0;
            color: #fff; font-weight: bold; font-size: 14px; margin-bottom: 5px;
            display: block;
        }
        #tm_rezka_popup .tm-episode-popup {
            font-size: 11px;
            color: #ff5917;
            margin-bottom: 10px;
        }
        #tm_rezka_popup .tm-ratings {
            flex-shrink: 0;
            display: flex;
            gap: 10px;
            padding: 5px 0 10px;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
        }
        #tm_rezka_popup .tm-rating-item { font-size: 11px; text-align: center; }
        #tm_rezka_popup .tm-rating-score { font-weight: bold; font-size: 14px; color: #FFC107; }
        #tm_rezka_popup .tm-rating-label { font-size: 10px; color: #888; }
        #tm_rezka_popup .tm-description-wrapper {
             flex-grow: 1;
             overflow-y: auto;
             font-size: 12px;
             box-sizing: border-box;
        }
        #tm_grid_button {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 100001;
            background: #ff5917;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 12px;
        }
        #tm_grid_overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 100000;
            display: none;
            overflow-y: auto;
            color: #ccc;
            font-family: sans-serif;
            padding: 20px;
        }
        #tm_grid_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ff5917;
            padding-bottom: 10px;
        }
        #tm_grid_title {
            color: #fff;
            font-size: 24px;
        }
        #tm_grid_controls {
            display: flex;
            gap: 10px;
        }
        #tm_grid_close, #tm_clear_cache_button {
            background: #ff5917;
            color: white;
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            border-radius: 3px;
        }
        #tm_clear_cache_button {
            background: #d9534f;
        }
        #tm_grid_container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        .tm_grid_item {
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 15px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        .tm_grid_item .tm-image {
            width: 100px;
            flex-shrink: 0;
        }
        .tm_grid_item .tm-image img {
            width: 100%;
            border-radius: 3px;
        }
        .tm_grid_item .tm-info {
            flex-grow: 1;
        }
        .tm_grid_item .tm-title {
            color: #ff5917;
            font-weight: bold;
            font-size: 16px;
            display: block;
            margin-bottom: 5px;
        }
        .tm_grid_item .tm-details {
            font-size: 11px;
            color: #888;
            margin-bottom: 10px;
        }
        .tm_grid_item .tm-episode-info {
            font-size: 13px;
            color: #ccc;
            margin-bottom: 10px;
        }
        .tm_grid_item .tm-rating-mini {
            font-size: 11px;
            color: #FFC107;
            font-weight: bold;
        }
        #tm_pagination {
            display: flex;
            justify-content: center;
            padding: 20px 0;
        }
        .tm_page_button {
            background: #333;
            color: white;
            border: 1px solid #ff5917;
            padding: 5px 10px;
            margin: 0 5px;
            cursor: pointer;
            border-radius: 3px;
        }
        .tm_page_button:disabled {
            background: #111;
            border-color: #555;
            color: #555;
            cursor: not-allowed;
        }
        .tm_page_button.current {
            background: #ff5917;
        }
    `);

    // --- Cache Management ---

    async function loadCache() {
        const storedCache = await GM.getValue(CACHE_KEY, '{}');
        try {
            remoteCache = JSON.parse(storedCache);
        } catch (e) {
            console.error("Error loading cache, starting fresh.", e);
            remoteCache = {};
        }
    }

    function saveCache() {
        GM.setValue(CACHE_KEY, JSON.stringify(remoteCache));
    }

    async function clearCache() {
        if (confirm("Вы уверены, что хотите очистить кэш постеров и описаний? Все данные будут загружены снова при следующем просмотре.")) {
            remoteCache = {};
            await GM.deleteValue(CACHE_KEY);
            alert("Кэш очищен. Перезагрузите страницу для обновления Grid.");

            if (document.getElementById('tm_grid_overlay').style.display === 'block') {
                 document.getElementById('tm_grid_overlay').style.display = 'none';
            }
        }
    }

    // --- Data Extraction & Aggregation ---

    function extractLocalDetails(link) {
        const listItemInner = link.closest('.b-seriesupdate__block_list_item_inner');
        if (!listItemInner) return {};

        const title = link.textContent.trim();
        const seasonElement = listItemInner.querySelector('.season');
        const episodeElement = listItemInner.querySelector('.cell.cell-2');

        const seasonText = seasonElement ? seasonElement.textContent.trim() : '';
        const episodeText = episodeElement ? episodeElement.textContent.trim() : '';

        const href = link.getAttribute('href');

        return {
            id: href,
            title: title,
            details: `${seasonText} | ${episodeText}`.replace(/\| *$/, '').trim(),
            href: href,
            episodeInfo: listItemInner.querySelector('.cell.cell-2').textContent.trim()
        };
    }

    // *** MISSING FUNCTION DEFINITION ***
    function aggregateUniqueSeriesData() {
        const links = document.querySelectorAll('.b-seriesupdate__block_list_link');
        const uniqueHrefs = new Set();
        const results = [];

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !uniqueHrefs.has(href)) {
                uniqueHrefs.add(href);
                results.push(extractLocalDetails(link));
            }
        });
        uniqueSeriesData = results;
    }
    // *********************************

    function extractRemoteData(htmlString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const posterImg = doc.querySelector('img[itemprop="image"]');
            let posterUrl = null;
            if (posterImg) {
                posterUrl = posterImg.getAttribute('data-src') || posterImg.src;
                if (posterUrl && posterUrl.startsWith('/')) {
                     posterUrl = window.location.origin + posterUrl;
                }
            }
            const descElement = doc.querySelector('.b-post__description_text');
            const description = descElement ? descElement.textContent.trim() : 'Описание не найдено.';

            const ratings = {};
            const rezkaScore = doc.querySelector('.b-post__rating .num');
            ratings.rezka = rezkaScore ? rezkaScore.textContent.trim() : 'N/A';
            const imdbScore = doc.querySelector('.b-post__info_rates.imdb .bold');
            ratings.imdb = imdbScore ? imdbScore.textContent.trim() : 'N/A';
            const kpScore = doc.querySelector('.b-post__info_rates.kp .bold');
            ratings.kp = kpScore ? kpScore.textContent.trim() : 'N/A';

            return { posterUrl, description, ratings };
        } catch (e) {
            return { posterUrl: null, description: 'Ошибка при парсинге описания.', ratings: { rezka: 'N/A', imdb: 'N/A', kp: 'N/A' } };
        }
    }

    function fetchRemoteData(href) {
        if (remoteCache[href]) {
            return Promise.resolve(remoteCache[href]);
        }

        let url = href;
        if (!url.startsWith('http')) {
            url = window.location.origin + href;
        }

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = extractRemoteData(response.responseText);
                        if (data.description !== 'Ошибка при парсинге описания.') {
                             remoteCache[href] = data;
                             saveCache();
                        }
                        resolve(data);
                    } else {
                        resolve({ posterUrl: null, description: 'Ошибка сети.', ratings: {} });
                    }
                },
                onerror: function(error) {
                    resolve({ posterUrl: null, description: 'Ошибка GM_xmlHttpRequest.', ratings: {} });
                }
            });
        });
    }

    // --- Hover Persistence Logic ---

    function clearHideTimer() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function delayedHide() {
        clearHideTimer();
        const popup = document.getElementById('tm_rezka_popup');

        hideTimer = setTimeout(() => {
            const isHoveringPopup = popup.matches(':hover');

            if (isHoveringPopup || currentPopupTriggerHref) {
                return;
            }

            popup.style.opacity = 0;
            setTimeout(() => {
                if (popup.style.opacity == 0) {
                    popup.style.display = 'none';
                    currentPopupTriggerHref = null;
                }
            }, 200);
        }, HIDE_DELAY);
    }

    function createOrGetPopup() {
        let popup = document.getElementById('tm_rezka_popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'tm_rezka_popup';
            document.body.appendChild(popup);

            popup.addEventListener('mouseenter', clearHideTimer);
            popup.addEventListener('mouseleave', handlePopupMouseLeave);
        }
        return popup;
    }

    function handlePopupMouseLeave() {
        currentPopupTriggerHref = null;
        delayedHide();
    }

    function renderHoverContent(series, remoteData, isLoading = false) {
        const ratings = remoteData.ratings || {};
        let ratingHtml = '';
        let descriptionText = remoteData.description || 'Загрузка описания...';

        if (!isLoading && ratings.imdb) {
            ratingHtml = `
                <div class="tm-ratings">
                    <div class="tm-rating-item">
                        <span class="tm-rating-score">${ratings.imdb}</span><br>
                        <span class="tm-rating-label">IMDb</span>
                    </div>
                    <div class="tm-rating-item">
                        <span class="tm-rating-score">${ratings.kp}</span><br>
                        <span class="tm-rating-label">Кинопоиск</span>
                    </div>
                </div>
            `;
        }

        if (isLoading) {
            descriptionText = 'Загрузка описания...';
        }

        return `
            ${ratingHtml}
            <span class="tm-title-popup">${series.title}</span>
            <span class="tm-episode-popup">${series.details}</span>
            <div class="tm-description-wrapper">${descriptionText}</div>
        `;
    }

    async function handlePosterMouseEnter(event) {
        clearHideTimer();
        const posterContainer = event.currentTarget;
        const href = posterContainer.getAttribute('data-href');
        const series = uniqueSeriesData.find(item => item.href === href);

        if (!series) return;

        currentPopupTriggerHref = href;

        const popup = createOrGetPopup();
        popup.classList.add('floating-details-mode');

        const rect = posterContainer.getBoundingClientRect();

        let top = rect.bottom + 1;
        let left = rect.left;

        if (top + POPUP_HEIGHT > window.innerHeight) {
             top = rect.top - POPUP_HEIGHT - 1;
        }

        const maxLeft = window.innerWidth - POPUP_WIDTH - 10;

        popup.style.top = `${Math.max(10, top)}px`;
        popup.style.left = `${Math.min(maxLeft, left)}px`;
        popup.style.display = 'block';
        popup.style.opacity = 1;

        let remoteData = remoteCache[href];

        if (!remoteData || !remoteData.ratings || !remoteData.description) {
            popup.innerHTML = renderHoverContent(series, remoteData || {}, true);
            remoteData = await fetchRemoteData(href);

            if (currentPopupTriggerHref !== href && !popup.matches(':hover')) return;

            popup.innerHTML = renderHoverContent(series, remoteData, false);
        } else {
            popup.innerHTML = renderHoverContent(series, remoteData, false);
        }
    }

    function handlePosterMouseLeave() {
        currentPopupTriggerHref = null;
        delayedHide();
    }


    // --- Grid Rendering and Pagination ---

    function createGridOverlay() {
        let overlay = document.getElementById('tm_grid_overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tm_grid_overlay';
            overlay.innerHTML = `
                <div id="tm_grid_header">
                    <span id="tm_grid_title">Обновления Сериалов (Всего: 0)</span>
                    <div id="tm_grid_controls">
                        <button id="tm_clear_cache_button">Очистить кэш</button>
                        <button id="tm_grid_close">Закрыть (Esc)</button>
                    </div>
                </div>
                <div id="tm_grid_container"></div>
                <div id="tm_pagination"></div>
            `;
            document.body.appendChild(overlay);
            document.getElementById('tm_grid_close').onclick = toggleGridVisibility;
            document.getElementById('tm_clear_cache_button').onclick = clearCache;

            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape" && overlay.style.display === 'block') {
                    toggleGridVisibility();
                }
            });
        }
        return overlay;
    }

    function renderGridItem(seriesItem) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'tm_grid_item';

        const remoteData = remoteCache[seriesItem.href] || {};
        const isCached = remoteData.posterUrl && remoteData.description;

        let posterHtml = `<div class="tm-image" data-href="${seriesItem.href}" style="cursor: pointer;">
                            <div style="width:100px; height:150px; background:#333; display:flex; align-items:center; justify-content:center; border-radius:3px; font-size:11px;">${isCached ? 'Cached' : 'Loading...'}</div>
                          </div>`;
        let ratingHtml = '';

        if (remoteData.posterUrl) {
            posterHtml = `<div class="tm-image" data-href="${seriesItem.href}" style="cursor: pointer;">
                            <img src="${remoteData.posterUrl}" loading="lazy">
                          </div>`;
        }

        if (remoteData.ratings && remoteData.ratings.imdb !== 'N/A') {
            ratingHtml = `<div class="tm-rating-mini">IMDb: ${remoteData.ratings.imdb} | KP: ${remoteData.ratings.kp}</div>`;
        }

        itemDiv.innerHTML = `
            ${posterHtml}
            <div class="tm-info">
                <a class="tm-title" href="${seriesItem.href}" target="_blank">${seriesItem.title}</a>
                <div class="tm-details">${seriesItem.details}</div>
                <div class="tm-episode-info">${seriesItem.episodeInfo}</div>
                ${ratingHtml}
            </div>
        `;

        // ATTACH HOVER LISTENERS
        const posterArea = itemDiv.querySelector('.tm-image');
        posterArea.addEventListener('mouseenter', handlePosterMouseEnter);
        posterArea.addEventListener('mouseleave', handlePosterMouseLeave);


        // Async fetching (Only fetch if not fully cached)
        if (!isCached) {
            fetchRemoteData(seriesItem.href).then(data => {
                if (document.getElementById('tm_grid_overlay').style.display !== 'block') return;

                if (data.posterUrl) {
                    const currentPosterArea = itemDiv.querySelector('.tm-image');
                    if(currentPosterArea){
                        if (currentPosterArea.textContent.includes('Loading') || currentPosterArea.textContent.includes('Cached')) {
                            currentPosterArea.innerHTML = `<img src="${data.posterUrl}" loading="lazy">`;
                        }
                    }

                    const updatedRatingHtml = `<div class="tm-rating-mini">IMDb: ${data.ratings.imdb} | KP: ${data.ratings.kp}</div>`;

                    if (!ratingHtml) {
                         const infoDiv = itemDiv.querySelector('.tm-info');
                         infoDiv.insertAdjacentHTML('beforeend', updatedRatingHtml);
                    }
                }
            });
        }

        return itemDiv;
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById('tm_pagination');
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const createButton = (text, page, isCurrent = false, isDisabled = false) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = `tm_page_button${isCurrent ? ' current' : ''}`;
            btn.disabled = isDisabled;
            if (!isDisabled && !isCurrent) {
                btn.onclick = () => {
                    currentPage = page;
                    renderGrid(uniqueSeriesData);
                    document.getElementById('tm_grid_overlay').scrollTop = 0;
                };
            }
            return btn;
        };

        paginationContainer.appendChild(createButton('«', currentPage - 1, false, currentPage === 1));

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createButton(i, i, i === currentPage));
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationContainer.appendChild(document.createTextNode(' ... '));
            }
            paginationContainer.appendChild(createButton(totalPages, totalPages, totalPages === currentPage));
        }
        paginationContainer.appendChild(createButton('»', currentPage + 1, false, currentPage === totalPages));
    }

    function renderGrid(data) {
        const container = document.getElementById('tm_grid_container');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888;">Нет данных об обновлениях.</p>';
            return;
        }

        const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        const currentData = data.slice(startIndex, endIndex);

        currentData.forEach(item => {
            container.appendChild(renderGridItem(item));
        });

        document.getElementById('tm_grid_title').textContent = `Обновления Сериалов (Всего: ${data.length})`;

        renderPagination(totalPages);
    }

    function toggleGridVisibility() {
        const overlay = createGridOverlay();
        if (overlay.style.display === 'block') {
            overlay.style.display = 'none';
            delayedHide();
        } else {
            aggregateUniqueSeriesData();
            currentPage = 1;
            renderGrid(uniqueSeriesData);
            overlay.style.display = 'block';
        }
    }

    // --- Main Initialization ---
    async function initialize() {
        await loadCache();

        // 1. Create the toggle button
        const button = document.createElement('div');
        button.id = 'tm_grid_button';
        button.textContent = 'Открыть Обновления (Grid)';
        button.onclick = toggleGridVisibility;
        document.body.appendChild(button);

        // 2. Pre-create the overlay and hover popup (initially hidden)
        createGridOverlay();
        createOrGetPopup();
    }

    initialize();

})();