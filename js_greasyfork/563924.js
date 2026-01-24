// ==UserScript==
// @name         MangaBuff Card Statistics
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Показывает статистику владельцев/желающих, цены на лоты и число обменов пользователей
// @author       zamoroz
// @match        https://mangabuff.ru/cards*
// @match        https://mangabuff.ru/users/*
// @match        https://mangabuff.ru/market*
// @match        https://mangabuff.ru/decks/*
// @match        https://mangabuff.ru/clubs/*/boost
// @match        https://mangabuff.ru/manga/*
// @grant        GM_xmlhttpRequest
// @connect      mangabuff.ru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563924/MangaBuff%20Card%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/563924/MangaBuff%20Card%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Кэш для хранения данных о карточках
    const CACHE_KEY = 'mangabuff_card_stats_cache';
    const CACHE_EXPIRY_HOURS = 24*7; // Кеш действителен неделю
    const LOTS_CACHE_KEY = 'mangabuff_card_lots_cache';
    const LOTS_CACHE_EXPIRY_HOURS = 1; // Кеш действителен 1 час
    const TRADES_CACHE_KEY = 'mangabuff_user_trades_cache';
    const TRADES_CACHE_EXPIRY_HOURS = 24; // Кеш действителен 24 часа

    /**
     * Загружает кеш из localStorage
     */
    function loadCache() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return {};

            const data = JSON.parse(cached);
            const now = Date.now();

            // Удаляем устаревшие записи
            Object.keys(data).forEach(key => {
                if (data[key].timestamp && (now - data[key].timestamp) > CACHE_EXPIRY_HOURS * 60 * 60 * 1000) {
                    delete data[key];
                }
            });

            return data;
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка загрузки кеша:', error);
            return {};
        }
    }

    /**
     * Сохраняет кеш в localStorage
     */
    function saveCache() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cardStatsCache));
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка сохранения кеша:', error);
        }
    }

    /**
     * Загружает кеш лотов из localStorage
     */
    function loadLotsCache() {
        try {
            const cached = localStorage.getItem(LOTS_CACHE_KEY);
            if (!cached) return {};

            const data = JSON.parse(cached);
            const now = Date.now();

            // Удаляем устаревшие записи
            Object.keys(data).forEach(key => {
                if (data[key].timestamp && (now - data[key].timestamp) > LOTS_CACHE_EXPIRY_HOURS * 60 * 60 * 1000) {
                    delete data[key];
                }
            });

            return data;
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка загрузки кеша лотов:', error);
            return {};
        }
    }

    /**
     * Сохраняет кеш лотов в localStorage
     */
    function saveLotsCache() {
        try {
            localStorage.setItem(LOTS_CACHE_KEY, JSON.stringify(cardLotsCache));
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка сохранения кеша лотов:', error);
        }
    }

    /**
     * Загружает кеш обменов из localStorage
     */
    function loadTradesCache() {
        try {
            const cached = localStorage.getItem(TRADES_CACHE_KEY);
            if (!cached) return {};

            const data = JSON.parse(cached);
            const now = Date.now();

            // Удаляем устаревшие записи
            Object.keys(data).forEach(key => {
                if (data[key].timestamp && (now - data[key].timestamp) > TRADES_CACHE_EXPIRY_HOURS * 60 * 60 * 1000) {
                    delete data[key];
                }
            });

            return data;
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка загрузки кеша обменов:', error);
            return {};
        }
    }

    /**
     * Сохраняет кеш обменов в localStorage
     */
    function saveTradesCache() {
        try {
            localStorage.setItem(TRADES_CACHE_KEY, JSON.stringify(userTradesCache));
        } catch (error) {
            console.error('[MangaBuff Stats] Ошибка сохранения кеша обменов:', error);
        }
    }

    const cardStatsCache = loadCache();
    const cardLotsCache = loadLotsCache();
    const userTradesCache = loadTradesCache();

    // Настройки защиты от DDOS
    const REQUEST_DELAY = 500; // Задержка между запросами в мс
    const MAX_RETRIES = 3; // Максимальное количество повторных попыток
    const RETRY_DELAY = 2000; // Задержка перед повторной попыткой в мс
    let lastRequestTime = 0;

    // Очередь запросов
    const requestQueue = [];
    let isProcessingQueue = false;

    // Очередь для обработки карточек маркета
    const marketCardsQueue = [];
    let isProcessingMarketCards = false;

    // Intersection Observer для ленивой загрузки лотов
    let lotsObserver = null;

    // Паттерны для поиска карточек на разных типах страниц
    const CARD_PATTERNS = [
        {
            name: 'standard',
            cardSelector: '.manga-cards__item[data-card-id]',
            wrapperSelector: '.manga-cards__item-wrapper',
            idAttribute: 'data-card-id',
            idLocation: 'card'
        },
        {
            name: 'deck',
            cardSelector: '.deck__item[data-card-id]',
            wrapperSelector: null,
            idAttribute: 'data-card-id',
            idLocation: 'card'
        },
        {
            name: 'lootbox',
            cardSelector: '.lootbox__card[data-id]',
            wrapperSelector: null,
            idAttribute: 'data-id',
            idLocation: 'card'
        },
        {
            name: 'market',
            cardSelector: '.market-list__cards--all .manga-cards__item',
            wrapperSelector: '.manga-cards__item-wrapper',
            idAttribute: 'data-id',
            idLocation: 'wrapper'
        },
        {
            name: 'club-boost',
            cardSelector: '.club-boost__inner',
            wrapperSelector: null,
            idAttribute: null,
            idLocation: 'link',
            linkSelector: 'a[href*="/cards/"]'
        }
    ];

    // CSS стили для отображения статистики
    const styles = `
        .card-stats-overlay {
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 4px 6px;
            border-radius: 3px;
            font-size: 9px;
            z-index: 10;
            backdrop-filter: blur(5px);
            line-height: 1.3;
        }
        .card-stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1px 0;
            white-space: nowrap;
        }
        .card-stats-label {
            color: #aaa;
            margin-right: 4px;
            font-size: 8px;
        }
        .card-stats-value {
            font-weight: bold;
            font-size: 9px;
        }
        .card-stats-value.owners {
            color: #4ade80;
        }
        .card-stats-value.wanters {
            color: #fb923c;
        }
        .card-stats-loading {
            color: #888;
            font-style: italic;
        }
        .manga-cards__item-wrapper {
            position: relative;
        }
        .deck__item {
            position: relative;
        }
        .club-boost__inner {
            position: relative;
        }
        .lootbox__list {
            padding-bottom: 40px;
        }
        .lootbox__card {
            position: relative;
        }
        .card-lots-overlay {
            position: absolute;
            top: 8px;
            right: 5px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 4px 6px;
            border-radius: 3px;
            font-size: 8px;
            z-index: 10;
            backdrop-filter: blur(5px);
            max-width: 110px;
            line-height: 1.4;
        }
        .card-lots-label {
            color: #aaa;
            font-weight: 500;
            margin-bottom: 2px;
        }
        .card-lots-prices {
            color: #fbbf24;
            font-weight: bold;
        }
        .profile__trades-count {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            background: rgba(139, 0, 255, 0.5);
            border: 1px solid rgba(139, 0, 255, 0.8);
            border-radius: 12px;
            font-size: 12px;
            color: #a78bfa;
            font-weight: 500;
            vertical-align: middle;
        }
    `;

    // Добавляем стили на страницу
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    /**
     * Ждет указанное время
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Выполняет запрос с задержкой между запросами
     */
    async function makeRequestWithDelay() {
        // Если это первый запрос, не ждем
        if (lastRequestTime === 0) {
            lastRequestTime = Date.now();
            return;
        }

        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        if (timeSinceLastRequest < REQUEST_DELAY) {
            await sleep(REQUEST_DELAY - timeSinceLastRequest);
        }

        lastRequestTime = Date.now();
    }

    /**
     * Добавляет запрос в очередь
     */
    function addToQueue(requestFn) {
        return new Promise((resolve, reject) => {
            requestQueue.push({ requestFn, resolve, reject });
            processQueue();
        });
    }

    /**
     * Обрабатывает очередь запросов последовательно
     */
    async function processQueue() {
        if (isProcessingQueue || requestQueue.length === 0) {
            return;
        }
        isProcessingQueue = true;

        while (requestQueue.length > 0) {
            const { requestFn, resolve, reject } = requestQueue.shift();

            try {
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
        isProcessingQueue = false;
    }

    /**
     * Выполняет запрос с повторными попытками при ошибке 429
     */
    async function fetchWithRetry(url, retryCount = 0) {
        await makeRequestWithDelay();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: async function(response) {
                    if (response.status === 429) {
                        // Слишком много запросов - ждем и повторяем
                        if (retryCount < MAX_RETRIES) {
                            console.log(`[MangaBuff Stats] 429 ошибка для ${url}, повторная попытка ${retryCount + 1}/${MAX_RETRIES}`);
                            await sleep(RETRY_DELAY * (retryCount + 1)); // Экспоненциальная задержка
                            try {
                                const result = await fetchWithRetry(url, retryCount + 1);
                                resolve(result);
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            console.error(`[MangaBuff Stats] Превышено количество попыток для ${url}`);
                            reject(new Error('Too many retries'));
                        }
                    } else if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Извлекает номер последней страницы из пагинации
     */
    function getLastPageNumber(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const paginationButtons = doc.querySelectorAll('.pagination__button a');

        let maxPage = 1;
        paginationButtons.forEach(button => {
            const href = button.getAttribute('href');
            if (href && href.includes('page=')) {
                const match = href.match(/page=(\d+)/);
                if (match) {
                    const pageNum = parseInt(match[1]);
                    if (pageNum > maxPage) {
                        maxPage = pageNum;
                    }
                }
            }
        });

        return maxPage;
    }

    /**
     * Парсит HTML страницы лотов и извлекает первые 5 уникальных цен
     */
    function parseCardLots(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const lotElements = doc.querySelectorAll('.market-show__lots .market-show__item');

        const lots = [];
        const seenPrices = new Set();

        for (const lotElement of lotElements) {
            // Извлечение ID лота из href
            const href = lotElement.getAttribute('href');
            const lotId = href ? href.split('/market/')[1] : null;

            if (!lotId) continue;

            // Извлечение цены
            const priceElement = lotElement.querySelector('.market-show__user-cards-rank');
            const price = priceElement ? priceElement.textContent.trim() : null;

            // Проверка уникальности цены
            if (!price || seenPrices.has(price)) continue;
            seenPrices.add(price);

            lots.push({ lotId, price });

            // Ограничение: максимум 5 уникальных цен
            if (lots.length >= 5) break;
        }

        return lots;
    }

    /**
     * Загружает количество страниц владельцев карты
     */
    async function fetchOwnerPages(cardId) {
        return addToQueue(async () => {
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/cards/${cardId}/users`);
                const pages = getLastPageNumber(html);
                return pages;
            } catch (error) {
                return null;
            }
        });
    }

    /**
     * Загружает количество страниц желающих получить карту
     */
    async function fetchWanterPages(cardId) {
        return addToQueue(async () => {
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/cards/${cardId}/offers/want`);
                const pages = getLastPageNumber(html);
                return pages;
            } catch (error) {
                return null;
            }
        });
    }

    /**
     * Загружает статистику для карточки
     */
    async function fetchCardStats(cardId) {
        // Проверяем кеш
        if (cardStatsCache[cardId]) {
            const cached = cardStatsCache[cardId];
            // Проверяем, не устарел ли кеш и нет ли в нем ошибок
            const isNotExpired = cached.timestamp && (Date.now() - cached.timestamp) < CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
            const hasNoErrors = cached.owners !== null && cached.wanters !== null;

            if (isNotExpired && hasNoErrors) {
                // Обновляем UI с данными из кеша
                updateCardStats(cardId, { owners: cached.owners, wanters: cached.wanters });
                return { owners: cached.owners, wanters: cached.wanters };
            } else if (isNotExpired && !hasNoErrors) {
            }
        }

        // Оборачиваем оба запроса в одну операцию очереди, чтобы для каждой карты
        // статистика собиралась полностью, прежде чем переходить к следующей карте
        return addToQueue(async () => {
            // Запрашиваем желающих
            await makeRequestWithDelay();
            let wanterPages;
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/cards/${cardId}/offers/want`);
                wanterPages = getLastPageNumber(html);
            } catch (error) {
                wanterPages = null;
            }
            // Сразу обновляем UI с данными о желающих
            updateCardStats(cardId, { wanters: wanterPages });

            // Запрашиваем владельцев
            await makeRequestWithDelay();
            let ownerPages;
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/cards/${cardId}/users`);
                ownerPages = getLastPageNumber(html);
            } catch (error) {
                ownerPages = null;
            }
            // Обновляем UI с данными о владельцах
            updateCardStats(cardId, { owners: ownerPages });

            // Сохраняем в кеш только если нет ошибок
            if (ownerPages !== null && wanterPages !== null) {
                const stats = {
                    owners: ownerPages,
                    wanters: wanterPages,
                    timestamp: Date.now()
                };

                cardStatsCache[cardId] = stats;
                saveCache();
            }

            return { owners: ownerPages, wanters: wanterPages };
        });
    }

    /**
     * Загружает информацию о лотах для карточки
     */
    async function fetchCardLots(cardId) {
        // Проверяем кеш
        if (cardLotsCache[cardId]) {
            const cached = cardLotsCache[cardId];
            const isNotExpired = cached.timestamp && (Date.now() - cached.timestamp) < LOTS_CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

            if (isNotExpired && cached.lots && cached.lots.length > 0) {
                return cached.lots;
            }
        }

        // Запрашиваем данные
        return addToQueue(async () => {
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/market/card/${cardId}`);
                const lots = parseCardLots(html);

                // Сохраняем в кеш
                if (lots.length > 0) {
                    cardLotsCache[cardId] = {
                        lots: lots,
                        timestamp: Date.now()
                    };
                    saveLotsCache();
                }

                return lots;
            } catch (error) {
                console.error(`[MangaBuff Stats] Ошибка загрузки лотов для карты ${cardId}:`, error);
                return [];
            }
        });
    }

    /**
     * Парсит HTML страницы обмена и извлекает число обменов
     */
    function parseTradesCount(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tradeHeader = doc.querySelector('.trade__header-name span');

        if (tradeHeader) {
            const count = tradeHeader.textContent.trim();
            return count;
        }

        return null;
    }

    /**
     * Загружает информацию о числе обменов пользователя
     */
    async function fetchUserTradesCount(userId) {
        // Проверяем кеш
        if (userTradesCache[userId]) {
            const cached = userTradesCache[userId];
            const isNotExpired = cached.timestamp && (Date.now() - cached.timestamp) < TRADES_CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

            if (isNotExpired && cached.count !== null) {
                return cached.count;
            }
        }

        // Запрашиваем данные
        return addToQueue(async () => {
            try {
                const html = await fetchWithRetry(`https://mangabuff.ru/trades/offers/${userId}`);
                const count = parseTradesCount(html);

                // Сохраняем в кеш
                if (count !== null) {
                    userTradesCache[userId] = {
                        count: count,
                        timestamp: Date.now()
                    };
                    saveTradesCache();
                }

                return count;
            } catch (error) {
                return null;
            }
        });
    }

    /**
     * Отображает число обменов на странице профиля
     */
    async function displayUserTradesCount() {
        // Проверяем, что мы на странице профиля
        const profileElement = document.querySelector('.profile[data-user-id]');
        if (!profileElement) return;

        const userId = profileElement.getAttribute('data-user-id');
        if (!userId) return;

        // Ищем элемент с именем пользователя
        const nameElement = document.querySelector('.profile__name');
        if (!nameElement) return;

        // Проверяем, не добавлен ли уже счетчик
        if (nameElement.querySelector('.profile__trades-count')) return;

        // Получаем число обменов
        const count = await fetchUserTradesCount(userId);

        // Если число получено - добавляем его
        if (count !== null) {
            const tradesSpan = document.createElement('span');
            tradesSpan.className = 'profile__trades-count';
            tradesSpan.textContent = count;
            tradesSpan.title = 'Количество обменов';
            nameElement.appendChild(tradesSpan);
        }
    }

    /**
     * Извлекает ID карты из элемента согласно паттерну
     */
    function extractCardId(element, pattern) {
        if (pattern.idLocation === 'card') {
            return element.getAttribute(pattern.idAttribute);
        } else if (pattern.idLocation === 'wrapper') {
            const wrapper = element.closest(pattern.wrapperSelector);
            return wrapper ? wrapper.getAttribute(pattern.idAttribute) : null;
        } else if (pattern.idLocation === 'link') {
            const link = element.querySelector(pattern.linkSelector);
            if (link) {
                const href = link.getAttribute('href');
                const match = href.match(/\/cards\/(\d+)/);
                return match ? match[1] : null;
            }
        }
        return null;
    }

    /**
     * Находит контейнер для размещения статистики
     */
    function getStatsContainer(cardElement, pattern) {
        if (pattern.wrapperSelector) {
            const wrapper = cardElement.closest(pattern.wrapperSelector);
            if (wrapper) {
                wrapper.style.position = 'relative';
                return wrapper;
            }
        }
        // No wrapper - card is the container
        cardElement.style.position = 'relative';
        return cardElement;
    }

    /**
     * Создает HTML элемент со статистикой
     */
    function createStatsOverlay(cardId) {
        const overlay = document.createElement('div');
        overlay.className = 'card-stats-overlay';
        overlay.innerHTML = `
            <div class="card-stats-row">
                <span class="card-stats-label">Владельцев:</span>
                <span class="card-stats-value owners card-stats-loading" data-card-id="${cardId}" data-type="owners">...</span>
            </div>
            <div class="card-stats-row">
                <span class="card-stats-label">Желают:</span>
                <span class="card-stats-value wanters card-stats-loading" data-card-id="${cardId}" data-type="wanters">...</span>
            </div>
        `;
        return overlay;
    }

    /**
     * Создает HTML элемент с информацией о лотах (только цены)
     */
    function createLotsOverlay(lots) {
        if (!lots || lots.length === 0) return null;

        const overlay = document.createElement('div');
        overlay.className = 'card-lots-overlay';

        // Формируем строку с ценами через запятую
        const prices = lots.map(lot => lot.price).join(', ');

        overlay.innerHTML = `
            <div class="card-lots-label">Цены:</div>
            <div class="card-lots-prices">${prices}</div>
        `;

        return overlay;
    }

    /**
     * Обновляет статистику на карточке
     */
    function updateCardStats(cardId, stats) {
        const ownersElements = document.querySelectorAll(`[data-card-id="${cardId}"][data-type="owners"]`);
        const wantersElements = document.querySelectorAll(`[data-card-id="${cardId}"][data-type="wanters"]`);

        // Обновляем владельцев только если значение передано (не undefined)
        if (stats.owners !== undefined) {
            ownersElements.forEach(el => {
                el.textContent = stats.owners !== null ? stats.owners : 'Ошибка';
                el.classList.remove('card-stats-loading');
            });
        }

        // Обновляем желающих только если значение передано (не undefined)
        if (stats.wanters !== undefined) {
            wantersElements.forEach(el => {
                el.textContent = stats.wanters !== null ? stats.wanters : 'Ошибка';
                el.classList.remove('card-stats-loading');
            });
        }
    }

    /**
     * Отображает информацию о лотах на карточке
     */
    async function displayCardLots(cardId, wrapper) {
        // Проверяем, не добавлен ли уже overlay
        if (wrapper.querySelector('.card-lots-overlay')) return;

        // Получаем лоты
        const lots = await fetchCardLots(cardId);

        // Если лоты есть - создаем и добавляем overlay
        if (lots && lots.length > 0) {
            const overlay = createLotsOverlay(lots);
            if (overlay) {
                wrapper.appendChild(overlay);
            }
        }
    }

    /**
     * Добавляет карточку маркета в очередь для обработки
     */
    function addMarketCardToQueue(cardId, wrapper) {
        marketCardsQueue.push({ cardId, wrapper });
        processMarketCardsQueue();
    }

    /**
     * Обрабатывает очередь карточек маркета последовательно
     */
    async function processMarketCardsQueue() {
        if (isProcessingMarketCards || marketCardsQueue.length === 0) {
            return;
        }

        isProcessingMarketCards = true;

        while (marketCardsQueue.length > 0) {
            const { cardId, wrapper } = marketCardsQueue.shift();

            // Проверяем, что карточка все еще в DOM и не обработана
            if (document.contains(wrapper) && !wrapper.querySelector('.card-lots-overlay')) {
                await displayCardLots(cardId, wrapper);
            }
        }
        isProcessingMarketCards = false;
    }

    /**
     * Инициализирует Intersection Observer для ленивой загрузки лотов
     */
    function initLotsObserver() {
        if (lotsObserver) return; // Уже инициализирован

        lotsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const wrapper = entry.target;
                    const cardId = wrapper.getAttribute('data-id');

                    if (cardId) {
                        // Добавляем в очередь вместо немедленной обработки
                        addMarketCardToQueue(cardId, wrapper);
                        // Отключаем наблюдение после добавления в очередь
                        lotsObserver.unobserve(wrapper);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Предзагрузка за 50px до появления
        });
    }

    /**
     * Обрабатывает карточки на странице
     */
    function processCards() {
        // Пропускаем обработку карточек на страницах профиля
        if (document.querySelector('.profile[data-user-id]')) {
            return;
        }

        const startTime = Date.now();
        console.log('[MangaBuff Stats] Начало processCards');

        CARD_PATTERNS.forEach(pattern => {
            const cards = document.querySelectorAll(pattern.cardSelector);

            if (cards.length > 0) {
                console.log(`[MangaBuff Stats] Найдено ${cards.length} карточек типа ${pattern.name}`);
            }

            // Для маркета только инициализируем observer для лотов, без статистики
            if (pattern.name === 'market') {
                const marketContainer = document.querySelector('.market-list__cards--all');
                if (marketContainer) {
                    initLotsObserver();

                    // Подключаем observer к каждой карточке
                    cards.forEach(card => {
                        const wrapper = card.closest(pattern.wrapperSelector);
                        if (wrapper && lotsObserver) {
                            lotsObserver.observe(wrapper);
                        }
                    });
                }
                return; // Пропускаем добавление статистики владельцев/желающих
            }

            // Для остальных паттернов добавляем статистику
            cards.forEach(card => {
                const container = getStatsContainer(card, pattern);
                if (!container) return;

                // Проверяем, не добавлена ли уже статистика
                if (container.querySelector('.card-stats-overlay')) return;

                const cardId = extractCardId(card, pattern);
                if (!cardId) return;

                // Добавляем оверлей со статистикой
                const overlay = createStatsOverlay(cardId);
                container.appendChild(overlay);

                // Загружаем статистику (обновление UI происходит внутри функции)
                fetchCardStats(cardId);
            });
        });

        console.log(`[MangaBuff Stats] processCards завершен за ${Date.now() - startTime}мс`);
    }

    /**
     * Наблюдатель за изменениями DOM
     */
    const observer = new MutationObserver((mutations) => {
        let shouldProcessCards = false;
        let hasAttributeChange = false;

        for (const mutation of mutations) {
            // Обрабатываем добавление новых элементов
            if (mutation.addedNodes.length > 0) {
                // Проверяем, не была ли загружена вкладка с карточками или lootbox карточки
                const tabLoaded = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 &&
                           (node.classList?.contains('tabs__page') ||
                            node.querySelector?.('.manga-cards__item') ||
                            node.classList?.contains('lootbox__card') ||
                            node.querySelector?.('.lootbox__card') ||
                            node.classList?.contains('lootbox__list'));
                });

                // Проверка на добавление карточек маркета
                const marketCardsAdded = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 &&
                           (node.classList?.contains('market-list__cards--all') ||
                            node.querySelector?.('.market-list__cards--all'));
                });

                if (tabLoaded || marketCardsAdded) {
                    shouldProcessCards = true;
                }
            }

            // Обрабатываем удаление элементов (когда карточки заменяются)
            if (mutation.removedNodes.length > 0) {
                const lootboxRemoved = Array.from(mutation.removedNodes).some(node => {
                    return node.nodeType === 1 &&
                           (node.classList?.contains('lootbox__card') ||
                            node.querySelector?.('.lootbox__card'));
                });

                if (lootboxRemoved) {
                    shouldProcessCards = true;
                }
            }

            // Обрабатываем изменение атрибутов карточек lootbox
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-id') {
                const card = mutation.target;
                if (card.classList.contains('lootbox__card')) {
                    hasAttributeChange = true;

                    // Удаляем старую статистику
                    const oldOverlay = card.querySelector('.card-stats-overlay');
                    if (oldOverlay) {
                        oldOverlay.remove();
                    }

                    // Добавляем новую статистику
                    const cardId = card.getAttribute('data-id');
                    if (cardId) {
                        card.style.position = 'relative';
                        const overlay = createStatsOverlay(cardId);
                        card.appendChild(overlay);

                        // Загружаем статистику (обновление UI происходит внутри функции)
                        fetchCardStats(cardId);
                    }
                }
            }
        }

        // Обрабатываем карточки с задержкой, если были добавлены новые элементы
        if (shouldProcessCards) {
            setTimeout(processCards, 100);
        } else if (!hasAttributeChange) {
            // Если не было изменений атрибутов, обрабатываем сразу
            processCards();
        }
    });

    // Запускаем обработку после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processCards();
            displayUserTradesCount();
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-id']
            });
        });
    } else {
        processCards();
        displayUserTradesCount();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-id']
        });
    }
})();
