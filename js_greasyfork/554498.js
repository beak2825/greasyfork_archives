// ==UserScript==
// @name         Kinozal TV Ratings on Top hands and New movies Pages
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Adds ratings (IMDb, Kinopoisk, Kinozal, Rotten Tomatoes), content type, and country flags to cards on kinozal.tv and its mirrors with dynamic edge detection for hover cards.
// @author       Pavel Semenov
//
// @match        *://kinozal.tv/top.php*
// @match        *://kinozal-tv.appspot.com/top.php*
// @match        *://kinozal.me/top.php*
// @match        *://kinozal.guru/top.php*
// @match        *://kinozal.tv/novinki.php*
// @match        *://kinozal-tv.appspot.com/novinki.php*
// @match        *://kinozal.me/novinki.php*
// @match        *://kinozal.guru/novinki.php*
//
// @connect      self
// @connect      mdblist.com
//
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554498/Kinozal%20TV%20Ratings%20on%20Top%20hands%20and%20New%20movies%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/554498/Kinozal%20TV%20Ratings%20on%20Top%20hands%20and%20New%20movies%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Настройки ---
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 часа
    const CACHE_VERSION = 14; // Версия кеша

    // ====================================================================================
    // === СПИСОК СТРАН ===
    // ====================================================================================
    const COUNTRY_LIST = [
        'США', 'Россия', 'СССР', 'Великобритания', 'Франция', 'Германия', 'Канада', 'Австралия',
        'Испания', 'Италия', 'Япония', 'Китай', 'Южная Корея', 'Индия', 'Швеция', 'Дания',
        'Норвегия', 'Бельгия', 'Нидерланды', 'Мексика', 'Бразилия', 'Аргентина', 'Ирландия',
        'Новая Зеландия', 'Польша', 'Чехия', 'Венгрия', 'Турция', 'Гонконг', 'Украина',
        'Австрия', 'Швейцария', 'Финляндия', 'Израиль', 'Таиланд', 'Индонезия', 'ЮАР'
    ];

    const COUNTRY_FLAG_MAP = {
        'США': 'us', 'Россия': 'ru', 'СССР': 'su', 'Великобритания': 'gb', 'Франция': 'fr',
        'Германия': 'de', 'Канада': 'ca', 'Австралия': 'au', 'Испания': 'es', 'Италия': 'it',
        'Япония': 'jp', 'Китай': 'cn', 'Южная Корея': 'kr', 'Индия': 'in', 'Швеция': 'se',
        'Дания': 'dk', 'Норвегия': 'no', 'Бельгия': 'be', 'Нидерланды': 'nl', 'Мексика': 'mx',
        'Бразилия': 'br', 'Аргентина': 'ar', 'Ирландия': 'ie', 'Новая Зеландия': 'nz',
        'Польша': 'pl', 'Чехия': 'cz', 'Венгрия': 'hu', 'Турция': 'tr', 'Гонконг': 'hk', 'Украина': 'ua',
        'Австрия': 'at', 'Швейцария': 'ch', 'Финляндия': 'fi', 'Израиль': 'il', 'Таиланд': 'th',
        'Индонезия': 'id', 'ЮАР': 'za'
    };

    // ====================================================================================
    // === КОНФИГУРАЦИЯ КАТЕГОРИЙ ===
    // ====================================================================================
    const CATEGORY_CONFIG = {
        MOVIE:      { label: 'ФИЛЬМ', className: 'type-movie', showRatings: true, isSeries: false, ids: [6, 8, 9, 11, 12, 13, 14, 15, 17, 18, 24, 35, 39, 47] },
        MOVIE_ERO:  { label: 'ФИЛЬМ ЭРО', className: 'type-movie-ero', showRatings: true, isSeries: false, ids: [16] },
        TV_SHOW:    { label: 'ТВ ШОУ', className: 'type-tv-show', showRatings: true, isSeries: true, ids: [49] },
        TV_CONCERT: { label: 'ТВ КОНЦЕРТ', className: 'type-tv-concert', showRatings: true, isSeries: false, ids: [48] },
        SERIES:     { label: 'СЕРИАЛ', className: 'type-series', showRatings: true, isSeries: true, ids: [3, 45, 46] },
        CARTOON:    { label: 'МУЛЬТ', className: 'type-cartoon', showRatings: true, isSeries: false, ids: [21] },
        ANIME:      { label: 'АНИМЕ', className: 'type-anime', showRatings: true, isSeries: true, ids: [20] },
        MUSIC:      { label: 'МУЗЫКА', className: 'type-music', showRatings: false, isSeries: false, ids: [4, 5] },
        AUDIOBOOK:  { label: 'АУДИОКНИГА', className: 'type-audiobook', showRatings: false, isSeries: false, ids: [2] },
        BOOK:       { label: 'КНИГА', className: 'type-book', showRatings: false, isSeries: false, ids: [41] },
        GAME:       { label: 'ИГРА', className: 'type-game', showRatings: false, isSeries: false, ids: [23] },
        SPORT:      { label: 'СПОРТ', className: 'type-sport', showRatings: false, isSeries: false, ids: [37] }
    };

    // --- Стили ---
    const styles = `
        .ratings-container { position: absolute; bottom: 2px; left: 2px; display: flex; flex-direction: column; align-items: start; gap: 1px; z-index: 10; }
        .rating-item { margin: 0; font-weight: bold; background-color: rgba(0, 0, 0, 0.75); padding: 2px 5px; border-radius: 3px; font-size: 11px; color: white; }
        .content-type-badge { position: absolute; top: 2px; left: 2px; padding: 2px 5px; font-size: 10px; font-weight: bold; color: white; background-color: rgba(0, 0, 0, 0.75); border-radius: 3px; line-height: 1; z-index: 10; }
        .country-flags-container { position: absolute; bottom: 2px; right: 2px; display: flex; flex-direction: column; gap: 2px; z-index: 10; }

        /* Стили для картинок флагов */
        .country-flag-img {
            width: 13px !important;
            height: 10px !important;
            border-radius: 3px;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            display: block;
            border: none !important;
            padding: 4px;
            background-color: rgba(0, 0, 0, 0.75);
            box-sizing: content-box;
        }

        /* Цвета рейтингов */
        .rating-imdb { color: #f5c518; }
        .rating-kp { color: #ff6600; }
        .rating-kz { color: #87cefa; }
        .rating-rt { color: #FA320A; } /* Tomato Red Text */

        .type-movie { background-color: #2d72d9; } .type-movie-ero { background-color: #c2185b; } .type-series { background-color: #d32f2f; } .type-cartoon { background-color: #4caf50; } .type-music { background-color: #9c27b0; } .type-audiobook { background-color: #795548; } .type-book { background-color: #5D4037; } .type-game { background-color: #F57C00; } .type-sport { background-color: #0277BD; } .type-tv-show { background-color: #00695C; } .type-tv-concert { background-color: #5E5CE6; } .type-anime { background-color: #40C8E0; }

        /* Hover Card */
        .hover-content { position: fixed; width: 150px; background-color: #000; color: #fff; display: flex; flex-direction: column; align-items: center; padding: 5px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 101; font-family: Arial, sans-serif; opacity: 0; visibility: hidden; transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out; pointer-events: none; }
        .hover-content.visible { opacity: 1; visibility: visible; }
        .hover-content .poster-img { width: 100%; height: auto; display: block; }
        .hover-content .hover-category { width: 100%; display: flex; box-sizing: border-box; justify-content: center; font-size: 12px; font-weight: bold; padding: 3px 8px; margin-bottom: 5px; }
        .hover-content .hover-ratings { display: flex; flex-direction: column; align-items: start; width: 100%; padding: 5px 0; gap: 2px; font-size: 12px; }
        .hover-content .hover-rating-item { font-weight: bold; display: flex; width: 100%; }
        .hover-content .hover-rating-item .rating-name { display: flex; flex: 1; }
        .hover-content .hover-rating-item span { padding: 0 4px; border-radius: 3px; }
        .hover-content .hover-flags { display: flex; flex-direction: column; align-items: start; width: 100%; padding-top: 5px; border-top: 1px solid #444; margin-top: 5px; gap: 2px; font-size: 12px; }
        .hover-content .hover-flag-item { display: flex; align-items: center; gap: 5px; }
        .hover-content .hover-flag-item span { font-size: 14px; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Вспомогательные функции ---

    function getCacheKeyFromUrl(url) {
        const match = url.match(/details\.php\?id=(\d+)/);
        return match && match[1] ? `kinozal_id_${match[1]}` : null;
    }

    function getCountryFlagHTML(isoCode, countryName) {
        let src = '';
        if (isoCode === 'su') {
            src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/23px-Flag_of_the_Soviet_Union.svg.png';
        } else {
            src = `https://flagcdn.com/24x18/${isoCode}.png`;
        }
        return `<img src="${src}" class="country-flag-img" alt="${countryName}" title="${countryName}">`;
    }

    // --- Promise-based Fetch Wrapper ---
    function fetchUrl(url) {
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null)
            });
        });
    }

    // --- Парсеры ---

    async function getRottenTomatoesRating(imdbId, categoryId) {
        if (!imdbId) return null;

        let type = 'movie';
        for (const key in CATEGORY_CONFIG) {
            if (CATEGORY_CONFIG[key].ids.includes(categoryId)) {
                if (CATEGORY_CONFIG[key].isSeries) type = 'show';
                break;
            }
        }

        const mdbListUrl = `https://mdblist.com/${type}/${imdbId}`;
        const html = await fetchUrl(mdbListUrl);
        if (!html) return null;

        if (html.includes("Just a moment") || html.includes("Challenge")) {
            console.warn(`[Kinozal Ratings] MDBList Cloudflare block for ${imdbId}`);
            return null;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let rtScore = null;

        // DOM Parsing
        const rtLink = doc.querySelector('a[href*="rottentomatoes.com"]');
        if (rtLink) {
            const parentCol = rtLink.closest('.nine.wide.column');
            if (parentCol) {
                const scoreCol = parentCol.nextElementSibling;
                if (scoreCol && scoreCol.classList.contains('three') && scoreCol.classList.contains('column')) {
                    const scoreText = scoreCol.textContent.trim();
                    if (scoreText.match(/^\d+$/)) {
                        rtScore = scoreText;
                    }
                }
            }
        }

        // Fallback Regex
        if (!rtScore) {
             const matchRT = html.match(/Tomatoes.*?(\d{1,3})/s);
             if (matchRT && matchRT[0].length < 200) {
                 rtScore = matchRT[1];
             }
        }

        return rtScore;
    }

    function displayData(cardElement, data) {
        if (!data) return;
        const { ratings, categoryId, countries } = data;

        cardElement.querySelectorAll('.ratings-container, .content-type-badge, .country-flags-container, .hover-content').forEach(el => el.remove());

        let categoryInfo = null;
        if (categoryId) {
            for (const key in CATEGORY_CONFIG) {
                const config = CATEGORY_CONFIG[key];
                if (config.ids.includes(categoryId)) {
                    categoryInfo = config;
                    break;
                }
            }
        }

        // --- 1. Стандартные элементы (Компактный вид) ---
        if (categoryInfo) {
            const typeBadge = document.createElement('div');
            typeBadge.className = `content-type-badge ${categoryInfo.className}`;
            typeBadge.textContent = categoryInfo.label;
            cardElement.appendChild(typeBadge);

            if (categoryInfo.showRatings && Object.values(ratings).some(r => r !== null)) {
                const ratingsDiv = document.createElement('div');
                ratingsDiv.className = 'ratings-container';
                if (ratings.kp) ratingsDiv.innerHTML += `<span class="rating-item rating-kp">${ratings.kp}</span>`;
                if (ratings.imdb) ratingsDiv.innerHTML += `<span class="rating-item rating-imdb">${ratings.imdb}</span>`;

                // RT: Просто красный текст (число)
                if (ratings.rt) {
                    ratingsDiv.innerHTML += `<span class="rating-item rating-rt">${ratings.rt}</span>`;
                }

                if (ratings.kz) ratingsDiv.innerHTML += `<span class="rating-item rating-kz">${ratings.kz}</span>`;
                cardElement.appendChild(ratingsDiv);
            }
        }

        if (countries && countries.length > 0) {
            const flagsContainer = document.createElement('div');
            flagsContainer.className = 'country-flags-container';
            countries.forEach(countryName => {
                const isoCode = COUNTRY_FLAG_MAP[countryName];
                if (isoCode) {
                    flagsContainer.innerHTML += getCountryFlagHTML(isoCode, countryName);
                }
            });
            cardElement.appendChild(flagsContainer);
        }

        // --- 2. Hover элементы (Увеличенная карточка) ---
        const hoverContent = document.createElement('div');
        hoverContent.className = 'hover-content';
        hoverContent.dataset.cardId = getCacheKeyFromUrl(cardElement.href);

        let hoverHTML = '';
        if (categoryInfo) {
            hoverHTML += `<div class="hover-category ${categoryInfo.className}">${categoryInfo.label}</div>`;
        }
        const posterSrc = cardElement.querySelector('img')?.src;
        if (posterSrc) {
            hoverHTML += `<img src="${posterSrc}" class="poster-img" alt="poster">`;
        }
        if (categoryInfo && categoryInfo.showRatings && Object.values(ratings).some(r => r !== null)) {
            hoverHTML += '<div class="hover-ratings">';
            if (ratings.kp) hoverHTML += `<div class="hover-rating-item rating-kp"><div class="rating-name">Кинопоиск</div> ${ratings.kp}</div>`;
            if (ratings.imdb) hoverHTML += `<div class="hover-rating-item rating-imdb"><div class="rating-name">IMDb</div> ${ratings.imdb}</div>`;

            if (ratings.rt) {
                hoverHTML += `<div class="hover-rating-item rating-rt"><div class="rating-name">Rotten Tomatoes</div> ${ratings.rt}</div>`;
            }

            if (ratings.kz) hoverHTML += `<div class="hover-rating-item rating-kz"><div class="rating-name">Kinozal</div> ${ratings.kz}</div>`;
            hoverHTML += '</div>';
        }
        if (countries && countries.length > 0) {
            hoverHTML += '<div class="hover-flags">';
            countries.forEach(countryName => {
                const isoCode = COUNTRY_FLAG_MAP[countryName];
                if (isoCode) {
                    hoverHTML += `<div class="hover-flag-item">${getCountryFlagHTML(isoCode, countryName)} ${countryName}</div>`;
                }
            });
            hoverHTML += '</div>';
        }
        hoverContent.innerHTML = hoverHTML;
        document.body.appendChild(hoverContent);
    }

    // --- Обработка одной карточки (Полный цикл) ---
    async function processCard(card) {
        const movieUrl = card.href;
        const cacheKey = getCacheKeyFromUrl(movieUrl);
        if (!cacheKey) return;

        // 1. Проверка кеша
        try {
            const cachedStorage = await GM.getValue(cacheKey);
            const now = Date.now();
            if (cachedStorage && (now - cachedStorage.timestamp < CACHE_DURATION_MS) && (cachedStorage.cacheVersion === CACHE_VERSION)) {
                displayData(card, cachedStorage.data);
                return; // Если есть в кеше, выходим, переходим к следующей
            }
        } catch (e) { console.error(e); }

        // 2. Если нет в кеше - загружаем страницу Кинозала
        const parseRating = (text) => {
            if (!text || text.trim() === '-' || isNaN(parseFloat(text))) return null;
            return text.trim();
        };

        const html = await fetchUrl(movieUrl);
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 3. Парсим базовые данные
        const imdbRating = parseRating(doc.querySelector('a[href*="imdb.com"] span.floatright')?.textContent);
        const kinopoiskRating = parseRating(doc.querySelector('a[href*="kinopoisk.ru"] span.floatright')?.textContent);
        const kinozalRatingRaw = parseRating(doc.querySelector('span[itemprop="ratingValue"]')?.textContent);
        const kinozalVotes = doc.querySelector('span[itemprop="votes"]')?.textContent.trim();
        const kinozalString = kinozalRatingRaw && kinozalVotes ? `${kinozalRatingRaw} (${kinozalVotes})` : kinozalRatingRaw;

        const imdbLinkElement = doc.querySelector('a[href*="imdb.com/title/tt"]');
        const imdbUrl = imdbLinkElement ? imdbLinkElement.href : null;
        let imdbId = null;
        if (imdbUrl) {
            const idMatch = imdbUrl.match(/tt\d+/);
            if (idMatch) imdbId = idMatch[0];
        }

        let categoryId = null;
        const categoryImgSrc = doc.querySelector('.cat_img_r')?.getAttribute('src');
        if (categoryImgSrc) {
            const match = categoryImgSrc.match(/\/(\d+)\.gif$/);
            if (match && match[1]) categoryId = parseInt(match[1], 10);
        }

        const foundCountries = [];
        const bTags = doc.querySelectorAll('.justify h2 b');
        const releasedLabel = Array.from(bTags).find(b => b.textContent.includes('Выпущено'));
        if (releasedLabel) {
            const countriesSpan = releasedLabel.nextElementSibling;
            if (countriesSpan && countriesSpan.tagName === 'SPAN' && countriesSpan.classList.contains('lnks_tobrs')) {
                const countriesText = countriesSpan.textContent;
                const potentialCountries = countriesText.split(',');
                potentialCountries.forEach(countryStr => {
                    const trimmedCountry = countryStr.trim();
                    if (COUNTRY_LIST.includes(trimmedCountry)) {
                        foundCountries.push(trimmedCountry);
                    }
                });
            }
        }

        // 4. Загружаем RT (если есть ID)
        let rtRating = null;
        if (imdbId) {
            rtRating = await getRottenTomatoesRating(imdbId, categoryId);
        }

        // 5. Формируем данные, отображаем и кешируем
        const newData = {
            ratings: { imdb: imdbRating, kp: kinopoiskRating, kz: kinozalString, rt: rtRating },
            categoryId: categoryId,
            countries: foundCountries.slice(0, 3),
            imdbUrl: imdbUrl,
            imdbId: imdbId
        };

        displayData(card, newData);

        GM.setValue(cacheKey, {
            timestamp: Date.now(),
            cacheVersion: CACHE_VERSION,
            data: newData
        });
    }

    // --- Основная логика (ПОСЛЕДОВАТЕЛЬНАЯ ОБРАБОТКА) ---
    const movieCards = document.querySelectorAll('.stable a, .bx1 a');

    if (movieCards.length > 0) {
        (async () => {
            for (const card of movieCards) {
                // Проверяем валидность карточки
                if (!card.href.includes('details.php?id=') || !card.querySelector('img')) continue;

                card.style.position = 'relative';

                // Ждем завершения обработки текущей карточки перед переходом к следующей
                await processCard(card);
            }
        })();
    }

    // --- Динамическое управление увеличенной карточкой ---
    document.body.addEventListener('mouseover', (event) => {
        const card = event.target.closest('a[href*="details.php?id="]');
        if (!card) return;

        if (!card.querySelector('img')) return;
        if (!card.closest('.stable') && !card.closest('.bx1')) return;

        const cardId = getCacheKeyFromUrl(card.href);
        if (!cardId) return;

        const hoverCard = document.querySelector(`.hover-content[data-card-id="${cardId}"]`);
        if (!hoverCard) return;

        const cardRect = card.getBoundingClientRect();
        const hoverRect = hoverCard.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 16;

        let top = cardRect.top + (cardRect.height - hoverRect.height) / 2;
        let left = cardRect.left + (cardRect.width - hoverRect.width) / 2;

        if (left < margin) left = margin;
        if (left + hoverRect.width > viewportWidth - margin) left = viewportWidth - hoverRect.width - margin;
        if (top < margin) top = margin;
        if (top + hoverRect.height > viewportHeight - margin) top = viewportHeight - hoverRect.height - margin;

        hoverCard.style.top = `${top}px`;
        hoverCard.style.left = `${left}px`;
        hoverCard.classList.add('visible');
    });

    document.body.addEventListener('mouseout', (event) => {
        const card = event.target.closest('a[href*="details.php?id="]');
        if (!card) return;

        const cardId = getCacheKeyFromUrl(card.href);
        if (!cardId) return;

        const hoverCard = document.querySelector(`.hover-content[data-card-id="${cardId}"]`);
        if (hoverCard) {
            hoverCard.classList.remove('visible');
        }
    });

})();