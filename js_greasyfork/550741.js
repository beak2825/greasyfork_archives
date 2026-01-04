// ==UserScript==
// @name         AnimeStars Card Scraper Pro
// @namespace    http://tampermonkey.net/
// @version      12
// @description  Собирает информацию о картах animestars.org в фоновом режиме с использованием IndexedDB.
// @author       YourName & Assistant
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/550741/AnimeStars%20Card%20Scraper%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/550741/AnimeStars%20Card%20Scraper%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // <<< --- ВАЖНО! ВСТАВЬТЕ СВОЙ ТОКЕН СЮДА --- >>>
    const GITHUB_TOKEN = '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';
    // <<< ----------------------------------------- >>>

    // --- КОНФИГУРАЦИЯ GITHUB ---
    const GITHUB_CONFIG = {
        owner: 'JerichoDestory',
        repo: 'animestars-card-db',
        path: 'animestars_cards_database.json',
        branch: 'main'
    };
    const API_URL = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;

     // --- НАСТРОЙКИ СКРИПТА ---
    const AUTO_SCAN_INTERVAL_HOURS = 6; // Интервал авто-проверки в часах
    const AUTO_SCAN_INTERVAL_MS = AUTO_SCAN_INTERVAL_HOURS * 60 * 60 * 1000;

    // --- КЛЮЧИ GM ХРАНИЛИЩА ---
    const OLD_DB_KEY = 'cardDatabase';
    const OLD_ID_SET_KEY = 'cardIdSet';
    const MIGRATION_KEY = 'indexedDBMigrationComplete';
    const SCRAPE_LOCK_KEY = 'scrapeLock';
    const UPLOAD_LOCK_KEY = 'uploadLock';
    const dbHelper = {
        db: null,
        DB_NAME: 'AnimeStarsCardDB',
        STORE_NAME: 'cards',

        init() {
            return new Promise((resolve, reject) => {
                if (this.db) return resolve();
                const request = indexedDB.open(this.DB_NAME, 1);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                        db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                    }
                };
                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve();
                };
                request.onerror = (event) => {
                    console.error('IndexedDB error:', event.target.errorCode);
                    reject(event.target.error);
                };
            });
        },
        _getTransaction(mode) {
            const transaction = this.db.transaction(this.STORE_NAME, mode);
            return transaction.objectStore(this.STORE_NAME);
        },
        async addCards(cards) {
            return new Promise((resolve, reject) => {
                const store = this._getTransaction('readwrite');
                cards.forEach(card => store.put(card));
                store.transaction.oncomplete = () => resolve();
                store.transaction.onerror = (event) => reject(event.target.error);
            });
        },
        async getCard(id) {
            return new Promise((resolve, reject) => {
                const request = this._getTransaction('readonly').get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        },
        async getAllCards() {
            return new Promise((resolve, reject) => {
                const request = this._getTransaction('readonly').getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        },
        async getCardCount() {
            return new Promise((resolve, reject) => {
                const request = this._getTransaction('readonly').count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        },
        async clear() {
            return new Promise((resolve, reject) => {
                const request = this._getTransaction('readwrite').clear();
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        },
        async deleteCard(id) {
            return new Promise((resolve, reject) => {
                const request = this._getTransaction('readwrite').delete(id);
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        }
    };
    const isPreviewIframe = window.self !== window.top;
    if (isPreviewIframe && window.innerWidth >= 500) {
        GM_addStyle(`
            #scraper-toggle-btn, #scraper-panel {
                display: none !important;
            }
        `);
    }

    // --- Стили ---
    GM_addStyle(`
        #scraper-panel { position: fixed; bottom: 5px; left: 80px; z-index: 9999; background-color: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); font-family: Arial, sans-serif; width: 500px; border: 1px solid #34495e; display: none; }
        #scraper-panel.scraper-visible { display: block; }
        #scraper-toggle-btn { position: fixed; bottom: 140px; left: 25px; z-index: 100; width: 45px; height: 45px; background: linear-gradient(145deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.5); font-size: 20px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease-in-out, background 0.2s; }
        #scraper-toggle-btn:hover { transform: scale(1.1); background: linear-gradient(145deg, #ff6b5a, #e74c3c); }
        .custom-scan-group { display: flex; gap: 10px; grid-column: 1 / -1; }
        .custom-scan-group input[type="number"] { width: 80px; flex-shrink: 0; padding: 10px; border-radius: 5px; border: 1px solid #7f8c8d; background: #ecf0f1; color: #2c3e50; font-size: 14px; text-align: center; }
        #scraper-panel h3 { margin-top: 0; color: #e74c3c; text-align: center; border-bottom: 1px solid #34495e; padding-bottom: 10px; }
        #scraper-panel .btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        #scraper-panel button { width: 100%; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; }
        #scraper-panel button:disabled { background-color: #7f8c8d !important; cursor: not-allowed; opacity: 0.7; }
        #scraper-panel .full-width { grid-column: 1 / -1; }
        #scraper-panel .start-btn { background-color: #27ae60; color: white; }
        #scraper-panel .start-btn:hover:not(:disabled) { background-color: #2ecc71; }
        #scraper-panel .quick-btn { background-color: #f39c12; color: white; }
        #scraper-panel .quick-btn:hover:not(:disabled) { background-color: #f1c40f; }
        #scraper-panel .stop-btn { background-color: #c0392b; color: white; }
        #scraper-panel .stop-btn:hover:not(:disabled) { background-color: #e74c3c; }
        #scraper-panel .download-btn { background-color: #2980b9; color: white; }
        #scraper-panel .download-btn:hover:not(:disabled) { background-color: #3498db; }
        #scraper-panel .upload-btn { background-color: #8e44ad; color: white; }
        #scraper-panel .upload-btn:hover:not(:disabled) { background-color: #9b59b6; }
        #scraper-panel .clear-btn { background-color: #7f8c8d; color: white; }
        #scraper-panel .clear-btn:hover:not(:disabled) { background-color: #95a5a6; }
        #scraper-status, #github-status { margin-top: 15px; padding: 10px; background-color: #34495e; border-radius: 5px; text-align: center; font-size: 13px; line-height: 1.5; }
    `);

    // --- Создание UI ---
    const panel = document.createElement('div');
    panel.id = 'scraper-panel';
    const toggleButton = document.createElement('button');
    toggleButton.id = 'scraper-toggle-btn';
    toggleButton.title = 'Открыть/Закрыть панель сборщика';
    toggleButton.innerHTML = '⚙️';
    document.body.appendChild(toggleButton);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    toggleButton.addEventListener('click', () => {
        const isVisible = panel.classList.contains('scraper-visible');
        if (isVisible) {
            panel.innerHTML = '';
            panel.classList.remove('scraper-visible');
            if (document.body.contains(panel)) {
                document.body.removeChild(panel);
            }
        } else {
            if (!document.body.contains(panel)) {
                document.body.appendChild(panel);
            }
            if (!document.body.contains(fileInput)) {
                document.body.appendChild(fileInput);
            }
            updatePanelUI();
        }
    });

    async function updatePanelUI() {
        const cardCount = await dbHelper.getCardCount();
        const state = GM_getValue('scrapeState', { isRunning: false });
        const isCurrentlyRunning = state.isRunning;

        let statusText = `В базе: <b>${cardCount}</b> карт.`;
        if (isCurrentlyRunning) {
            const scanType = state.isAutoScan ? 'Авто-проверка' : (state.isQuickScan ? 'Быстрая проверка' : 'Полный сбор');
            statusText += `<br>${scanType} в процессе... Обработано <b>${state.currentPage || 0} из ${state.totalPages || '?'}</b> стр.`;
        } else if (state.totalPages && !state.isRunning && state.currentPage >= state.totalPages) {
             statusText += `<br><b>Сбор завершен!</b>`;
        }
        if (state.uploadPending) {
            statusText += `<br><b><span style="color: #f39c12;">Ожидание выгрузки на GitHub...</span></b>`;
        }
        const lastAutoScan = GM_getValue('lastAutoScanTimestamp', 0);
        const nextScanTime = lastAutoScan + AUTO_SCAN_INTERVAL_MS;
        let autoScanStatus = 'Авто-проверка выключена (укажите токен).';
        if (GITHUB_TOKEN && GITHUB_TOKEN !== 'ВАШ_PERSONAL_ACCESS_TOKEN_СЮДА') {
             if (nextScanTime > Date.now()) {
                const hoursLeft = ((nextScanTime - Date.now()) / (1000 * 60 * 60)).toFixed(1);
                autoScanStatus = `Следующая авто-проверка через: <b>${hoursLeft} ч.</b>`;
            } else {
                autoScanStatus = 'Авто-проверка запустится при след. заходе на сайт.';
            }
        }
        panel.innerHTML = `
            <h3>Сборщик Карт</h3>
            <div id="scraper-status">${statusText}</div>
            <div id="github-status">${autoScanStatus}</div>
            <div class="btn-group">
                <button id="start-scrape" class="start-btn full-width" ${isCurrentlyRunning ? 'disabled' : ''}>Начать полный сбор</button>
                <div class="custom-scan-group">
                    <input type="number" id="custom-pages-input" value="2" min="1" title="Количество страниц для быстрой проверки" ${isCurrentlyRunning ? 'disabled' : ''}>
                    <button id="start-custom-scrape" class="quick-btn" ${isCurrentlyRunning ? 'disabled' : ''}>Проверить N страниц</button>
                </div>
                <button id="stop-scrape" class="stop-btn full-width" ${!isCurrentlyRunning ? 'disabled' : ''}>Остановить</button>
                <button id="download-data" class="download-btn" ${isCurrentlyRunning ? 'disabled' : ''}>Скачать базу (JSON)</button>
                <button id="upload-local-data" class="upload-btn" ${isCurrentlyRunning ? 'disabled' : ''}>Загрузить базу (файл)</button>
                <button id="load-from-github-btn" class="download-btn" ${isCurrentlyRunning ? 'disabled' : ''}>Загрузить с GitHub</button>
                <button id="upload-to-github-btn" class="upload-btn" ${isCurrentlyRunning ? 'disabled' : ''}>Выгрузить на GitHub</button>
                <button id="add-test-card" class="quick-btn" title="Добавляет фейковую карту в локальную базу для теста выгрузки" ${isCurrentlyRunning ? 'disabled' : ''}>Добавить тест-карту</button>
                <button id="remove-test-card" class="stop-btn" title="Удаляет фейковую карту из локальной базы" ${isCurrentlyRunning ? 'disabled' : ''}>Удалить тест-карту</button>
            </div>
            <button id="clear-data" class="clear-btn full-width" style="margin-top: 10px;" ${isCurrentlyRunning ? 'disabled' : ''}>Очистить локальную базу</button>
        `;
        document.getElementById('start-scrape').addEventListener('click', () => startScraping(false));
        document.getElementById('start-custom-scrape').addEventListener('click', startCustomScraping);
        document.getElementById('stop-scrape').addEventListener('click', stopScraping);
        document.getElementById('download-data').addEventListener('click', downloadData);
        document.getElementById('upload-local-data').addEventListener('click', () => fileInput.click());
        document.getElementById('load-from-github-btn').addEventListener('click', loadFromGitHub);
        document.getElementById('clear-data').addEventListener('click', clearData);
        document.getElementById('upload-to-github-btn').addEventListener('click', uploadToGitHub);
        document.getElementById('add-test-card').addEventListener('click', async () => {
            const testCard = {
                id: 'test-card-999999',
                name: 'Тестовый Персонаж',
                rank: 'TEST',
                animeName: 'Аниме для Тестирования',
                animeLink: '/anime/test-link.html',
                image: '/uploads/test-image.webp'
            };
            await dbHelper.addCards([testCard]);
            alert('Тестовая карта добавлена!');
            updatePanelUI();
        });
        document.getElementById('remove-test-card').addEventListener('click', async () => {
            await dbHelper.deleteCard('test-card-999999');
            alert('Тестовая карта удалена!');
            updatePanelUI();
        });

        panel.classList.add('scraper-visible');
    }

    // --- Функции управления сбором (теперь запускают фоновый процесс) ---
    function startCustomScraping() {
        const input = document.getElementById('custom-pages-input');
        const pagesToScan = parseInt(input.value, 10);
        if (!pagesToScan || pagesToScan < 1) {
            alert('Пожалуйста, введите корректное количество страниц (больше 0).');
            return;
        }
        if (confirm(`Начать проверку первых ${pagesToScan} страниц в фоновом режиме?`)) {
            const state = { isRunning: true, isQuickScan: true, isAutoScan: false, currentPage: 0, totalPages: pagesToScan };
            GM_setValue('scrapeState', state);
            GM_setValue(SCRAPE_LOCK_KEY, Date.now());
            runBackgroundScrape();
        }
    }

    async function startScraping(isQuick, isAuto = false) {
        let totalPages, message;
        if (isQuick) {
            totalPages = 2;
            message = `Начинается автоматическая проверка обновлений (первые 2 страницы).`;
        } else {
            totalPages = await getTotalPages();
            if (totalPages === 0) {
                alert('Не удалось определить количество страниц. Попробуйте обновить страницу /cards/ и повторить.');
                return;
            }
            message = `Начать полный сбор данных с ${totalPages} страниц в фоновом режиме? Это может занять время.`;
        }
        if (isAuto || confirm(message)) {
            const state = { isRunning: true, isQuickScan: isQuick, isAutoScan: isAuto, currentPage: 0, totalPages: totalPages };
            GM_setValue('scrapeState', state);
            GM_setValue(SCRAPE_LOCK_KEY, Date.now()); // Устанавливаем блокировку
            if (isAuto) {
                console.log('Начата автоматическая проверка базы карт!');
                console.log(message);
            } else {
                alert(`Начинаем сбор! Всего страниц: ${totalPages}. Не закрывайте эту вкладку.`);
            }
            runBackgroundScrape();
        }
    }
    function stopScraping(silent = false) {
        GM_setValue('scrapeState', { isRunning: false });
        GM_deleteValue(SCRAPE_LOCK_KEY);
        if (!silent) {
            alert('Сбор остановлен.');
        }
        if (panel.classList.contains('scraper-visible')) {
            updatePanelUI();
        }
    }

    // --- Функции работы с данными ---
    async function downloadData() {
    const dataArray = await dbHelper.getAllCards();
    if (dataArray.length === 0) { alert('База данных пуста.'); return; }

    // --- ДОБАВЛЕНА СОРТИРОВКА ---
    dataArray.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    // ---------------------------

    const dataStr = JSON.stringify(dataArray, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animestars_cards_database.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`${dataArray.length} карт было сохранено в файл.`);
}

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data) || (data.length > 0 && typeof data[0].id === 'undefined')) {
                    throw new Error("Файл не является валидным массивом объектов карт.");
                }
                const currentCount = await dbHelper.getCardCount();
                if (confirm(`Заменить текущую базу (${currentCount} карт) на данные из файла (${data.length} карт)?`)) {
                    await dbHelper.clear();
                    await dbHelper.addCards(data);
                    alert('База данных успешно восстановлена из файла!');
                    updatePanelUI();
                }
            } catch (error) {
                alert(`Ошибка при загрузке файла: ${error.message}`);
            } finally {
                fileInput.value = '';
            }
        };
        reader.readAsText(file);
    });

    async function clearData() {
        if (confirm('Вы уверены, что хотите полностью удалить всю собранную информацию о картах?')) {
            await dbHelper.clear();
            GM_deleteValue('scrapeState');
            GM_deleteValue('lastAutoScanTimestamp');
            alert('База данных и настройки сбора очищены.');
            updatePanelUI();
        }
    }

    async function loadFromGitHub() {
        const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/JerichoDestory/animestars-card-db/main/animestars_cards_database.json';
        const currentCount = await dbHelper.getCardCount();
        if (!confirm(`Заменить текущую базу (${currentCount} карт) данными с GitHub? Это действие необратимо.`)) {
            return;
        }
        const statusDiv = document.getElementById('github-status');
        statusDiv.innerHTML = '<b>Загрузка базы с GitHub...</b>';
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_RAW_URL + '?t=' + new Date().getTime(),
            onload: async function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (!Array.isArray(data)) {
                            throw new Error("Данные с GitHub не являются массивом.");
                        }
                        await dbHelper.clear();
                        await dbHelper.addCards(data);
                        GM_setValue('lastAutoScanTimestamp', Date.now());

                        alert(`База данных успешно загружена с GitHub! Загружено ${data.length} карт.`);
                        statusDiv.innerHTML = '<b>База успешно загружена.</b>';

                    } catch (error) {
                        alert(`Ошибка обработки данных с GitHub: ${error.message}`);
                        statusDiv.innerHTML = '<b>Ошибка обработки данных.</b>';
                    }
                } else {
                    alert(`Ошибка загрузки с GitHub. Статус: ${response.status}`);
                    statusDiv.innerHTML = `<b>Ошибка загрузки: ${response.status}</b>`;
                }
                setTimeout(updatePanelUI, 3000);
            },
            onerror: function() {
                alert('Сетевая ошибка при загрузке данных с GitHub.');
                statusDiv.innerHTML = '<b>Сетевая ошибка.</b>';
                setTimeout(updatePanelUI, 3000);
            }
        });
    }

    async function uploadToGitHub(isAutoUpload = false) {
        if (!GITHUB_TOKEN || GITHUB_TOKEN === 'ВАШ_PERSONAL_ACCESS_TOKEN_СЮДА') {
            if (!isAutoUpload) alert('Ошибка: Токен доступа GitHub не указан.');
            return;
        }
        const dataArray = await dbHelper.getAllCards();
        if (dataArray.length === 0) {
            if (!isAutoUpload) alert('Локальная база данных пуста. Нечего выгружать.');
            return;
        }

        // --- ДОБАВЛЕНА СОРТИРОВКА ---
        dataArray.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));

        const content = JSON.stringify(dataArray, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        // --- ИЗМЕНЕНИЕ: Все взаимодействие с UI теперь внутри этой проверки ---
        const isPanelVisible = panel.classList.contains('scraper-visible');
        let statusDiv = null;
        if (isPanelVisible) {
            statusDiv = document.getElementById('github-status');
            if(statusDiv) statusDiv.innerHTML = '<b>Идет загрузка на GitHub... (шаг 1/2: получение SHA)</b>';
        }

        let initialFileSha = null;
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + `?ref=${GITHUB_CONFIG.branch}&t=` + new Date().getTime(),
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
            onload: function(response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    initialFileSha = responseData.sha;
                    if (isPanelVisible && statusDiv) {
                        statusDiv.innerHTML = '<b>Идет загрузка на GitHub... (шаг 2/2: отправка данных)</b>';
                    }

                    GM_xmlhttpRequest({
                        method: 'PUT',
                        url: API_URL,
                        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                        data: JSON.stringify({
                            message: `Автоматическое обновление базы карт от ${new Date().toISOString()}`,
                            content: encodedContent,
                            sha: initialFileSha,
                            branch: GITHUB_CONFIG.branch
                        }),
                        onload: function(putResponse) {
                            const state = GM_getValue('scrapeState', {});
                            state.uploadPending = false;
                            GM_setValue('scrapeState', state);
                            GM_deleteValue(UPLOAD_LOCK_KEY);

                            if (putResponse.status === 200) {
                                console.log('[Card Scraper] Выгрузка на GitHub прошла успешно, флаг ожидания снят.');
                                if (!isAutoUpload) alert('База данных успешно обновлена на GitHub!');
                                if (isPanelVisible && statusDiv) statusDiv.innerHTML = '<b>Успешно выгружено и обновлено!</b>';
                            } else {
                                if (!isAutoUpload) alert(`Ошибка при выгрузке: ${putResponse.status}\n${putResponse.responseText}`);
                                if (isPanelVisible && statusDiv) statusDiv.innerHTML = `<b>Ошибка выгрузки: ${putResponse.status}</b>`;
                            }
                            if (isPanelVisible) setTimeout(updatePanelUI, 4000);
                        },
                        onerror: function() {
                            GM_deleteValue(UPLOAD_LOCK_KEY);
                            if (!isAutoUpload) alert('Сетевая ошибка при выгрузке.');
                            if (isPanelVisible && statusDiv) {
                                statusDiv.innerHTML = '<b>Сетевая ошибка.</b>';
                                setTimeout(updatePanelUI, 3000);
                            }
                        }
                    });
                } else {
                     GM_deleteValue(UPLOAD_LOCK_KEY);
                     if (!isAutoUpload) alert(`Не удалось получить SHA файла: ${response.status}\n${response.responseText}`);
                    if (isPanelVisible && statusDiv) {
                        statusDiv.innerHTML = '<b>Ошибка получения SHA.</b>';
                        setTimeout(updatePanelUI, 3000);
                    }
                }
            },
            onerror: function() {
                GM_deleteValue(UPLOAD_LOCK_KEY);
                if (!isAutoUpload) alert('Сетевая ошибка при получении SHA файла.');
                if (isPanelVisible && statusDiv) {
                    statusDiv.innerHTML = '<b>Сетевая ошибка.</b>';
                    setTimeout(updatePanelUI, 3000);
                }
            }
        });
    }
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    async function fetchPageWithGM(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Статус ответа: ${response.status}`);
        }
        return await response.text();
    }


    async function getTotalPages() {
        const lastPageLink = document.querySelector('.pagination__pages a[href*="/cards/page/"]:last-of-type');
        if (lastPageLink) {
            return parseInt(lastPageLink.href.split('/page/')[1].replace('/', ''), 10);
        }
        try {
            console.log("Определяем кол-во страниц через фоновый запрос...");
            const text = await fetchPageWithGM('https://animestars.org/cards/');
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const lastPageLinkInDoc = doc.querySelector('.pagination__pages a[href*="/cards/page/"]:last-of-type');
            return lastPageLinkInDoc ? parseInt(lastPageLinkInDoc.href.split('/page/')[1].replace('/', ''), 10) : 1;
        } catch (error) {
            console.error("Ошибка при получении главной страницы карт:", error);
            return 0;
        }
    }

    async function parseHtmlPage(doc) {
        const cardWrappers = doc.querySelectorAll('.anime-cards--full-page .anime-cards__item-wrapper');
        console.log(`[Card Scraper] Найдено ${cardWrappers.length} оберток карт на странице.`);
        if (cardWrappers.length === 0) return 0;
        const newCards = [];
        for (const wrapper of cardWrappers) {
            const card = wrapper.querySelector('.anime-cards__item');
            if (!card) continue;
            const id = card.dataset.id;
            if (id) {
                const existingCard = await dbHelper.getCard(id);
                if (!existingCard) {
                    let animeLink = card.dataset.animeLink || '';
                    let image = card.dataset.image || '';
                    try {
                        if (animeLink.startsWith('http')) {
                            animeLink = new URL(animeLink).pathname;
                        }
                        if (image.startsWith('http')) {
                            image = new URL(image).pathname;
                        }
                    } catch (e) {
                        console.error(`Не удалось обработать URL для карты ${id}:`, animeLink, image, e);
                    }
                    newCards.push({
                        id: id,
                        name: card.dataset.name || 'N/A',
                        rank: card.dataset.rank || 'N/A',
                        animeName: card.dataset.animeName || 'N/A',
                        animeLink: card.dataset.animeLink || '',
                        image: card.dataset.image || ''
                    });
                }
            }
        }
        if (newCards.length > 0) {
            await dbHelper.addCards(newCards);
        }
        return newCards.length;
    }

    async function runBackgroundScrape() {
        let state = GM_getValue('scrapeState');
        if (!state || !state.isRunning) return;
        console.log(`[Card Scraper] Начат фоновый сбор. Страниц: ${state.totalPages}`);
        // --- ИЗМЕНЕНИЕ НАЧАЛО ---
        if (panel.classList.contains('scraper-visible')) {
            await updatePanelUI();
        }
        // --- ИЗМЕНЕНИЕ КОНЕЦ ---
        for (let i = 1; i <= state.totalPages; i++) {
            state = GM_getValue('scrapeState');
            if (!state.isRunning) {
                console.log('[Card Scraper] Процесс остановлен пользователем.');
                break;
            }
            state.currentPage = i;
            GM_setValue('scrapeState', state);
            GM_setValue(SCRAPE_LOCK_KEY, Date.now());
            // --- ИЗМЕНЕНИЕ НАЧАЛО ---
            if (panel.classList.contains('scraper-visible')) {
                updatePanelUI();
            }
            // --- ИЗМЕНЕНИЕ КОНЕЦ ---
            const url = `https://animestars.org/cards/page/${i}/`;
            console.log(`[Card Scraper] Запрашиваю страницу ${i}...`);
            try {
                const htmlText = await fetchPageWithGM(url);
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const foundCount = await parseHtmlPage(doc);
                console.log(`[Card Scraper] Страница ${i} обработана. Найдено НОВЫХ карт: ${foundCount}.`);
            } catch (error) {
                console.error(`[Card Scraper] Ошибка при обработке страницы ${i}:`, error);
            }
            await sleep(500 + Math.random() * 500);
        }
        state = GM_getValue('scrapeState');
        if (state.isRunning) {
            const scanType = state.isQuickScan ? "Быстрая проверка" : "Сбор данных";

            // --- ДОБАВЛЕНО ИЗМЕНЕНИЕ ---
            // Если это была ручная быстрая проверка (N страниц), сбрасываем таймер авто-сканирования.
            if (state.isQuickScan && !state.isAutoScan) {
                GM_setValue('lastAutoScanTimestamp', Date.now());
                console.log('[Card Scraper] Ручная быстрая проверка завершена. Таймер авто-проверки сброшен.');
            }
            // --- КОНЕЦ ИЗМЕНЕНИЯ ---

            if (!state.isAutoScan) {
                alert(`${scanType} успешно завершен(а)!`);
            }
            console.log(`[Card Scraper] Сбор завершен.`);
            state.isRunning = false;
            // НЕ удаляем scrapeState, а добавляем флаг ожидания выгрузки
            const canUpload = GITHUB_TOKEN && GITHUB_TOKEN !== 'ВАШ_PERSONAL_ACCESS_TOKEN_СЮДА';
            if (canUpload) {
                console.log('[Card Scraper] Сбор завершен. Установлен флаг ожидания выгрузки на GitHub.');
                state.uploadPending = true; // <-- ДОБАВЛЕНО
                GM_setValue('scrapeState', state);
                GM_deleteValue(SCRAPE_LOCK_KEY);
                uploadToGitHub(state.isAutoScan); // <-- Сразу пробуем выгрузить в первый раз
            } else {
                 console.log('Токен GitHub не настроен, выгрузка пропущена.');
                 GM_setValue('scrapeState', state); // Сохраняем isRunning: false
                 GM_deleteValue(SCRAPE_LOCK_KEY);
            }
        }
        if (panel.classList.contains('scraper-visible')) {
            await updatePanelUI();
        }
        // --- ИЗМЕНЕНИЕ КОНЕЦ ---
    }
    
    function checkForAutoScan() {
        const state = GM_getValue('scrapeState', { isRunning: false });
        if (state.isRunning) return;
        if (!GITHUB_TOKEN || GITHUB_TOKEN === 'ВАШ_PERSONAL_ACCESS_TOKEN_СЮДА') return;
        const lastAutoScan = GM_getValue('lastAutoScanTimestamp', 0);
        // --- ВОЗВРАЩАЕМ ПРОИЗВОДСТВЕННЫЕ ЗНАЧЕНИЯ ---
        const scanInterval = AUTO_SCAN_INTERVAL_MS;
        if (Date.now() - lastAutoScan > scanInterval) {
            const LOCK_KEY = 'autoScanLockTimestamp';
            const LOCK_TIMEOUT = 2 * 60 * 1000; // 2 минуты
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---
            const currentLock = GM_getValue(LOCK_KEY, 0);
            if (currentLock && (Date.now() - currentLock < LOCK_TIMEOUT)) {
                console.log('[Card Scraper] Авто-проверка уже запущена на другой вкладке. Эта вкладка пропускает ход.');
                return;
            }
            console.log('[Card Scraper] Эта вкладка стала лидером и запускает авто-проверку.');
            GM_setValue(LOCK_KEY, Date.now());
            // Немедленно сбрасываем таймер, чтобы предотвратить повторные запуски
            GM_setValue('lastAutoScanTimestamp', Date.now());
            console.log('[Card Scraper] Таймер авто-проверки сброшен на 5 часов, запускается процесс.');
            startScraping(true, true);
        }
    }

    // --- НОВАЯ ФУНКЦИЯ ---
    function checkForPendingUpload() {
        const state = GM_getValue('scrapeState', { isRunning: false, uploadPending: false });
        // Если нет флага ожидания или идет сбор - ничего не делаем
        if (!state.uploadPending || state.isRunning) return;

        const LOCK_TIMEOUT = 2 * 60 * 1000; // 2 минуты, как в autoScan
        const currentLock = GM_getValue(UPLOAD_LOCK_KEY, 0);

        if (currentLock && (Date.now() - currentLock < LOCK_TIMEOUT)) {
            console.log('[Card Scraper] Повторная выгрузка уже запущена на другой вкладке.');
            return;
        }

        console.log('[Card Scraper] Обнаружена незавершенная выгрузка. Повторяю отправку на GitHub...');
        GM_setValue(UPLOAD_LOCK_KEY, Date.now()); // Устанавливаем блокировку
        // Запускаем выгрузку в "тихом" режиме (true), чтобы не было alert'ов
        uploadToGitHub(true);
    }

    // --- Миграция и Инициализация ---
    async function runMigration() {
        const migrationDone = GM_getValue(MIGRATION_KEY, false);
        if (migrationDone) return;

        const oldDb = GM_getValue(OLD_DB_KEY, null);
        if (oldDb && Object.keys(oldDb).length > 0) {
            console.log('[Card Scraper] Обнаружена старая база данных. Начинаю миграцию в IndexedDB...');
            const cardsArray = Object.values(oldDb);
            try {
                await dbHelper.addCards(cardsArray);
                GM_deleteValue(OLD_DB_KEY);
                GM_deleteValue(OLD_ID_SET_KEY);
                GM_setValue(MIGRATION_KEY, true);
                alert(`Миграция завершена! ${cardsArray.length} карт успешно перенесено в новую, быструю базу данных.`);
                console.log('[Card Scraper] Миграция успешно завершена.');
            } catch (error) {
                console.error('[Card Scraper] Ошибка миграции:', error);
                alert('Произошла ошибка во время миграции данных. Проверьте консоль (F12).');
            }
        } else {
            GM_setValue(MIGRATION_KEY, true);
        }
    }

    async function initialize() {
        await dbHelper.init();
        await runMigration();
        const state = GM_getValue('scrapeState', { isRunning: false });
        if (state.isRunning) {
            const LOCK_TTL = 15000;
            const lockTimestamp = GM_getValue(SCRAPE_LOCK_KEY, 0);
            if (Date.now() - lockTimestamp > LOCK_TTL) {
                console.log("[Card Scraper] Обнаружен зависший процесс сбора (блокировка устарела). Производится тихая остановка.");
                stopScraping(true);
            } else {
                console.log("[Card Scraper] Процесс сбора уже активен в другой вкладке. Эта вкладка ожидает.");
            }
        }
        // Запускаем проверку один раз при загрузке страницы
        checkForAutoScan();
        checkForPendingUpload(); // <-- ДОБАВЛЕНО

        // И затем запускаем таймеры
        setInterval(checkForAutoScan, 10 * 60 * 1000); // Раз в 10 минут
        setInterval(checkForPendingUpload, 5 * 60 * 1000); // Раз в 5 минут <-- ДОБАВЛЕНО

        if (!document.getElementById('scraper-fscr-styles')) {
            const style = document.createElement('style');
            style.id = 'scraper-fscr-styles';
            style.textContent = `
                body.fscr-active #scraper-toggle-btn {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    initialize().catch(console.error);
})();