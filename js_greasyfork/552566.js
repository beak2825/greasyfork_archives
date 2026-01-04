// ==UserScript==
// @name         HDRezka Series Update Poster Preview (Configurable)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Добавляет всплывающее окошко для быстрого просмотра мышкой сериала из правого блока "Горячие обновления сериалов" на HDRezka (Не на всех зеркалах)
// @author       ChatGPT
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://media.discordapp.net/attachments/613661716017840179/1427647608230383646/avatar.png?ex=68ef9ff2&is=68ee4e72&hm=ee9f11e29cda41f4153208dda58179b8d7e431ee4a8d1a187dbed21346b1e314&=&format=webp&quality=lossless&width=150&height=150
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552566/HDRezka%20Series%20Update%20Poster%20Preview%20%28Configurable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552566/HDRezka%20Series%20Update%20Poster%20Preview%20%28Configurable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideTimer = null;
    const HIDE_DELAY = 300; // Time (ms) to wait before hiding the popup
    const cache = {};
    let settings = {};

    // --- DEFAULT SETTINGS ---
    const DEFAULT_SETTINGS = {
        mode: 'floating',   // 'floating' or 'fixed'
        fixedWidth: 600,
        fixedHeight: 400,
        posterWidth: 200    // Poster column width in pixels
    };

    // 1. CSS STYLING
    GM_addStyle(`
        /* Global Popup Styles */
        #tm_rezka_popup {
            position: fixed;
            z-index: 99999;
            padding: 10px;
            background: rgba(18, 18, 18, 0.95);
            border: 2px solid #ff5917;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            pointer-events: auto; /* Required for mouse interaction/scrolling */
            display: none;
            transition: opacity 0.2s;
            opacity: 0;
            color: #ccc;
            font-family: sans-serif;
            font-size: 13px;
            line-height: 1.3;
        }
        #tm_rezka_popup.fixed-mode {
            /* Width and Height set by JS */
            overflow: hidden;
        }
        #tm_rezka_popup .tm-content-flex {
            display: flex;
            gap: 10px;
        }
        #tm_rezka_popup .tm-image-container {
            flex-shrink: 0;
            /* width is set via JS inline style */
        }
        #tm_rezka_popup img {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 3px;
        }
        #tm_rezka_popup .tm-details {
            flex-grow: 1;
            min-width: 0;
        }
        #tm_rezka_popup .tm-title {
            color: #fff;
            font-weight: bold;
            display: block;
            font-size: 15px;
            margin-bottom: 4px;
        }
        #tm_rezka_popup .tm-episode {
            font-size: 12px;
            color: #ff5917;
            margin-bottom: 8px;
            display: block;
        }
        #tm_rezka_popup .tm-description-wrapper {
             flex-grow: 1;
             overflow-y: auto;
             padding-right: 5px;
             font-size: 12px;
        }

        /* Rating styles */
        #tm_rezka_popup .tm-ratings {
            display: flex;
            gap: 10px;
            padding: 5px 0 10px;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
        }
        #tm_rezka_popup .tm-rating-item {
            font-size: 11px;
            text-align: center;
        }
        #tm_rezka_popup .tm-rating-score {
            font-weight: bold;
            font-size: 14px;
            color: #FFC107;
        }
        #tm_rezka_popup .tm-rating-label {
            font-size: 10px;
            color: #888;
        }

        /* Settings UI Styles */
        #tm_settings_button {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background: #ff5917;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 12px;
        }
        #tm_settings_panel {
            position: fixed;
            top: 50px;
            right: 10px;
            width: 300px;
            z-index: 100000;
            background: #1e1e1e;
            border: 2px solid #ff5917;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            color: #ccc;
            font-family: sans-serif;
            display: none;
        }
        #tm_settings_panel label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }
        #tm_settings_panel input[type="radio"], #tm_settings_panel input[type="number"] {
            margin-right: 5px;
            padding: 3px;
            background: #2b2b2b;
            border: 1px solid #555;
            color: #ccc;
        }
        #tm_settings_panel button {
            margin-top: 15px;
            padding: 8px 15px;
            background: #ff5917;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 3px;
        }
        #fixed-settings-group {
            padding-left: 15px;
            margin-top: 5px;
            border-left: 2px solid #555;
        }
    `);

    // --- Core Extraction & Fetching ---
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

    function fetchRemoteData(relativeHref) {
        let url = relativeHref;
        if (!url.startsWith('http')) {
            url = window.location.origin + relativeHref;
        }
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(extractRemoteData(response.responseText));
                    } else {
                        resolve({ posterUrl: null, description: 'Ошибка сети при загрузке.', ratings: {} });
                    }
                },
                onerror: function(error) {
                    resolve({ posterUrl: null, description: 'Ошибка GM_xmlHttpRequest.', ratings: {} });
                }
            });
        });
    }

    // --- Hover Management Functions ---

    function clearHideTimer() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function delayedHide() {
        clearHideTimer();
        const popup = document.getElementById('tm_rezka_popup');
        if (popup) {
            hideTimer = setTimeout(() => {
                popup.style.opacity = 0;
                setTimeout(() => {
                    if (popup.style.opacity == 0) {
                        popup.style.display = 'none';
                    }
                }, 200);
            }, HIDE_DELAY);
        }
    }

    function createOrGetPopup() {
        let popup = document.getElementById('tm_rezka_popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'tm_rezka_popup';
            document.body.appendChild(popup);

            // Attach listeners to the popup itself for persistence
            popup.addEventListener('mouseenter', clearHideTimer);
            popup.addEventListener('mouseleave', delayedHide);
        }
        return popup;
    }

    function extractLocalDetails(link) {
        const listItemInner = link.closest('.b-seriesupdate__block_list_item_inner');
        if (!listItemInner) return {};

        const title = link.textContent.trim();
        const seasonElement = listItemInner.querySelector('.season');
        const episodeElement = listItemInner.querySelector('.cell.cell-2');

        const seasonText = seasonElement ? seasonElement.textContent.trim() : '';
        const episodeText = episodeElement ? episodeElement.textContent.trim() : '';

        return {
            title: title,
            details: `${seasonText} | ${episodeText}`.replace(/\| *$/, '').trim()
        };
    }

    /**
     * Renders the popup content based on local and remote data.
     */
    function renderPopupContent(localData, remoteData, isLoading = false) {
        const ratings = remoteData.ratings || {};
        let ratingHtml = '';
        let imageHtml = '';
        let descriptionText = remoteData.description || 'Загрузка описания...';

        // Calculate dynamic height for description wrapper in Fixed mode
        // 75px is approximation for ratings, titles, and margins
        const contentFlexStyle = settings.mode === 'fixed'
            ? `height: calc(${settings.fixedHeight}px - 75px - 20px);` // 20px for total padding top/bottom
            : 'height: auto;';

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
                    <div class="tm-rating-item">
                        <span class="tm-rating-score">${ratings.rezka}</span><br>
                        <span class="tm-rating-label">Резка</span>
                    </div>
                </div>
            `;
        }

        if (isLoading) {
            imageHtml = `<div style="width:100%; height:150px; background:#333; line-height:150px; text-align:center; margin-bottom: 8px;">Loading poster...</div>`;
            descriptionText = `Загрузка описания...`;
        } else if (remoteData.posterUrl) {
            imageHtml = `<img src="${remoteData.posterUrl}" alt="Poster" loading="lazy">`;
        }

        // Final structure. Apply poster width dynamically.
        return `
            ${ratingHtml}
            <span class="tm-title">${localData.title}</span>
            <span class="tm-episode">${localData.details}</span>

            <div class="tm-content-flex" style="${contentFlexStyle}">
                <div class="tm-image-container" style="width: ${settings.posterWidth}px;">
                    ${imageHtml}
                </div>
                <div class="tm-details">
                    <div class="tm-description-wrapper">${descriptionText}</div>
                </div>
            </div>
        `;
    }

    /**
     * Handles positioning and visibility based on the current mode.
     */
    function positionAndShowPopup(link) {
        const popup = createOrGetPopup();
        popup.style.display = 'block';
        popup.style.opacity = 1;

        // Reset dynamic styles for safety (Floating mode relies on CSS max-width)
        popup.style.removeProperty('width');
        popup.style.removeProperty('height');
        popup.classList.remove('fixed-mode');

        if (settings.mode === 'fixed') {
            // FIXED MODE: Top left, fixed size
            popup.classList.add('fixed-mode');
            popup.style.top = `10px`;
            popup.style.left = `10px`;
            popup.style.width = `${settings.fixedWidth}px`;
            popup.style.height = `${settings.fixedHeight}px`;

        } else {
            // FLOATING MODE: Near link, dynamic size
            const rect = link.getBoundingClientRect();

            // Calculate necessary buffer based on configured poster size (for maxLeft calculation)
            // PosterWidth + Gap (10) + Min Details Width (150) + Padding/Border (30)
            const MIN_FLOATING_WIDTH = settings.posterWidth + 190;

            const top = rect.top - 50;
            const left = rect.right + 15;
            const maxLeft = window.innerWidth - MIN_FLOATING_WIDTH;

            // Use base CSS width for Floating mode's overall size limit (350px)
            // Positioning coordinates rely on window dimensions (fixed position)
            popup.style.top = `${Math.max(10, top)}px`;
            popup.style.left = `${Math.min(maxLeft, left)}px`;
        }
    }

    async function handleMouseEnter(event) {
        clearHideTimer();
        const link = event.currentTarget;
        const href = link.getAttribute('href');

        if (!href) return;

        positionAndShowPopup(link);

        const localData = extractLocalDetails(link);
        const cacheKey = href;
        let remoteData = cache[cacheKey];
        const popup = document.getElementById('tm_rezka_popup');


        if (!remoteData || !remoteData.ratings) {
            popup.innerHTML = renderPopupContent(localData, remoteData || {}, true);

            remoteData = await fetchRemoteData(href);

            if (hideTimer) return;

            cache[cacheKey] = remoteData;

            popup.innerHTML = renderPopupContent(localData, remoteData);
        } else {
            popup.innerHTML = renderPopupContent(localData, remoteData, false);
        }
    }

    // This is the function whose definition was questioned:
    function handleMouseLeave() {
        delayedHide();
    }

    // ===================================
    // Settings Management
    // ===================================

    async function loadSettings() {
        settings.mode = await GM.getValue('mode', DEFAULT_SETTINGS.mode);
        settings.fixedWidth = await GM.getValue('fixedWidth', DEFAULT_SETTINGS.fixedWidth);
        settings.fixedHeight = await GM.getValue('fixedHeight', DEFAULT_SETTINGS.fixedHeight);
        settings.posterWidth = await GM.getValue('posterWidth', DEFAULT_SETTINGS.posterWidth);
    }

    function saveSettings(e) {
        e.preventDefault();

        const form = document.getElementById('tm_settings_form');
        const newMode = form.mode.value;
        const newWidth = parseInt(form.fixedWidth.value, 10);
        const newHeight = parseInt(form.fixedHeight.value, 10);
        const newPosterWidth = parseInt(form.posterWidth.value, 10);

        // Basic input validation
        if (newPosterWidth < 50 || newPosterWidth > 300) {
             alert('Ширина постера должна быть от 50 до 300 пикселей.');
             return;
        }

        // Update local settings object
        settings.mode = newMode;
        settings.fixedWidth = newWidth;
        settings.fixedHeight = newHeight;
        settings.posterWidth = newPosterWidth;

        // Save asynchronously
        GM.setValue('mode', newMode);
        GM.setValue('fixedWidth', newWidth);
        GM.setValue('fixedHeight', newHeight);
        GM.setValue('posterWidth', newPosterWidth);

        document.getElementById('tm_settings_panel').style.display = 'none';
        alert('Настройки сохранены! Перезагрузите страницу для полной уверенности.');
    }

    function createSettingsUI() {
        // 1. Settings Button
        const button = document.createElement('div');
        button.id = 'tm_settings_button';
        button.textContent = 'Preview Settings';
        button.onclick = () => {
            const panel = document.getElementById('tm_settings_panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') {
                // Ensure form fields reflect current settings upon opening
                document.querySelector(`input[name="mode"][value="${settings.mode}"]`).checked = true;
                document.getElementById('fixedWidth').value = settings.fixedWidth;
                document.getElementById('fixedHeight').value = settings.fixedHeight;
                document.getElementById('posterWidth').value = settings.posterWidth;

                // Toggle fixed settings visibility
                document.getElementById('fixed-settings-group').style.display = (settings.mode === 'fixed' ? 'block' : 'none');
            }
        };
        document.body.appendChild(button);


        // 2. Settings Panel
        const panel = document.createElement('div');
        panel.id = 'tm_settings_panel';
        panel.innerHTML = `
            <h3>Настройки HDRezka Preview</h3>
            <form id="tm_settings_form">
                <label>Режим отображения:</label>
                <input type="radio" name="mode" value="floating" id="modeFloating">
                <label for="modeFloating" style="display:inline;">Floating (Рядом с ссылкой)</label><br>
                <input type="radio" name="mode" value="fixed" id="modeFixed">
                <label for="modeFixed" style="display:inline;">Fixed (Сверху слева)</label>

                <div id="fixed-settings-group" style="display:none;">
                    <label for="fixedWidth">Ширина окна Fixed (px):</label>
                    <input type="number" id="fixedWidth" name="fixedWidth" min="200" max="1000">
                    <label for="fixedHeight">Высота окна Fixed (px):</label>
                    <input type="number" id="fixedHeight" name="fixedHeight" min="150" max="800">
                </div>

                <label for="posterWidth">Ширина постера (px, в обеих режимах):</label>
                <input type="number" id="posterWidth" name="posterWidth" min="50" max="300">

                <button type="submit">Сохранить настройки</button>
            </form>
        `;
        document.body.appendChild(panel);

        // Attach event listeners for saving and mode switching
        document.getElementById('tm_settings_form').onsubmit = saveSettings;

        document.getElementById('modeFloating').onchange = () => {
            document.getElementById('fixed-settings-group').style.display = 'none';
        };
        document.getElementById('modeFixed').onchange = () => {
            document.getElementById('fixed-settings-group').style.display = 'block';
        };
    }

    // --- Main Initialization ---
    async function initialize() {
        await loadSettings();
        createSettingsUI();

        const links = document.querySelectorAll('.b-seriesupdate__block_list_link');

        links.forEach(link => {
            link.addEventListener('mouseenter', handleMouseEnter);
            link.addEventListener('mouseleave', handleMouseLeave);
        });

        createOrGetPopup();
    }

    initialize();

})();