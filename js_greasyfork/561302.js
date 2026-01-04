// ==UserScript==
// @name         Player Ban Status Checker
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Показывает информацию о последней блокировке игрока. Запрос нескольких записей.
// @author       LOGI 61 WashingtonNuked
// @license      Mit
// @match        https://logs.blackrussia.online/gslogs/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561302/Player%20Ban%20Status%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/561302/Player%20Ban%20Status%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- СТИЛИ ---
    GM_addStyle(`
        #log-filter-section {
            width: 320px !important;
            max-width: 320px !important;
            min-width: 320px !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
        }
        #log-filter-form {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
        }
        #ban-check-container-v41 {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
        }
        #ban-check-btn-v41 {
            white-space: nowrap;
            height: fit-content;
            align-self: center;
            flex-shrink: 0;
        }
        #ban-check-result-v41 {
            flex-grow: 1;
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            font-size: 14px;
            background: #f5f5f5;
            min-height: 20px;
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: break-word;
            overflow-x: auto;
            line-height: 1.3;
        }
        #ban-check-result-v41 > div {
             margin: 0 0 2px 0;
        }
        .ban-info-banned-v41 {
            color: #d32f2f;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .ban-info-not-found-v41, .ban-info-success-v41 {
            color: green;
            font-weight: bold;
        }
        .ban-info-error-v41 {
            color: #d32f2f;
        }
        .ban-info-loading-v41 {
            color: #1976d2;
        }
    `);

    // --- КОНФИГ ---
    const pathParts = location.pathname.split('/').filter(p => p);
    const gslogsIndex = pathParts.indexOf('gslogs');
    const serverId = (gslogsIndex !== -1 && pathParts[gslogsIndex + 1] && !isNaN(pathParts[gslogsIndex + 1])) ? pathParts[gslogsIndex + 1] : null;

    if (!serverId) {
        console.error('[Ban Checker v4.7] Could not determine server ID from URL');
        return;
    }
    const API_BASE_URL = `${location.origin}/gslogs/${serverId}/api/list-game-logs/`;
    const REQUEST_DELAY_MS = 1200;
    let lastRequestTime = 0;
    // --- ИЗМЕНЕНО: Установим разумный лимит ---
    const LIMIT_PER_REQUEST = 50; // Вместо 1 или 200

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function showResult(message, type = 'info', resultBoxElement) {
        if (!resultBoxElement) return;
        resultBoxElement.textContent = '';
        resultBoxElement.className = '';
        if (type === 'loading') {
            resultBoxElement.classList.add('ban-info-loading-v41');
            resultBoxElement.textContent = message;
        } else if (type === 'error') {
            resultBoxElement.classList.add('ban-info-error-v41');
            resultBoxElement.textContent = message;
        } else if (type === 'not_found') {
            resultBoxElement.classList.add('ban-info-not-found-v41');
            resultBoxElement.innerHTML = message;
        } else if (type === 'success') {
            resultBoxElement.classList.add('ban-info-success-v41');
            resultBoxElement.innerHTML = message;
        } else {
            resultBoxElement.textContent = message;
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function parseBanInfo(transactionDesc, playerName) {
        let duration = "Неизвестно";
        let reason = "Не указана";

        const foreverMatch = /Навсегда/i.test(transactionDesc);
        const timeMatch = transactionDesc.match(/на\s+(\d+)\s+(день|дня|дней|час|часа|часов|минуту|минуты|минут|неделю|недели|недель|месяц|месяца|месяцев)/i);
        if (foreverMatch) {
            duration = "Навсегда";
        } else if (timeMatch) {
            duration = `${timeMatch[1]} ${timeMatch[2]}`;
        }

        const reasonMatch = transactionDesc.match(/Причина\s*([^|]+?)(?:\s*\||$)/i);
        if (reasonMatch) {
            reason = reasonMatch[1].trim();
        }

        return { duration, reason };
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function throttle() {
        const since = Date.now() - lastRequestTime;
        if (since < REQUEST_DELAY_MS) {
            await wait(REQUEST_DELAY_MS - since);
        }
    }

    // --- ОСНОВНАЯ ЛОГИКА API (ИСПРАВЛЕНА) ---
    async function getPlayerLastBlock(playerName, resultBoxElement) {
        await throttle();
        lastRequestTime = Date.now();

        const descFilterRaw = `%заблокировал% %${playerName}%`;

        const params = new URLSearchParams({
            category_id__exact: '',
            player_name__exact: '',
            player_id__exact: '',
            player_ip__exact: '',
            transaction_amount__exact: '',
            balance_after__exact: '',
            transaction_desc__ilike: descFilterRaw,
            // ИЗМЕНЕНО: Возвращаем order_by=time (по возрастанию)
            order_by: 'time',
            offset: '0',
            // ИЗМЕНЕНО: Используем разумный лимит
            limit: String(LIMIT_PER_REQUEST),
            auto: 'false'
        });

        const url = `${API_BASE_URL}?${params.toString()}`;

        console.log('[Ban Checker v4.7] Fetching (multi-result):', url);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { 'Accept': 'application/json' },
                onload: function (response) {
                    console.log('[Ban Checker v4.7] API Response Status:', response.status);
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            let logsArray;
                            if (Array.isArray(data)) {
                                logsArray = data;
                            } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
                                logsArray = data.results;
                            } else {
                                console.warn('[Ban Checker v4.7] Unexpected data format:', data);
                                logsArray = Array.isArray(data) ? data : (data ? [data] : []);
                            }
                            resolve(logsArray);
                        } catch (e) {
                            console.error('[Ban Checker v4.7] Parse error:', e);
                            reject(new Error('Ошибка парсинга ответа от API.'));
                        }
                    } else if (response.status === 429) {
                        console.warn('[Ban Checker v4.7] Too many requests (429).');
                        showResult('Слишком частые запросы. Повтор через 5 секунд...', 'loading', resultBoxElement);
                        setTimeout(() => getPlayerLastBlock(playerName, resultBoxElement).then(resolve).catch(reject), 5000);
                    } else {
                        console.error('[Ban Checker v4.7] API Error:', response);
                        // Попробуем извлечь сообщение об ошибке
                        let errorMsg = `Ошибка API: ${response.status} ${response.statusText}`;
                        try {
                            const errorData = JSON.parse(response.responseText);
                            if (errorData && typeof errorData === 'object' && errorData.detail) {
                                errorMsg += ` - ${errorData.detail}`;
                            }
                        } catch (pe) {
                            // Игнорируем ошибку парсинга тела ошибки
                        }
                        reject(new Error(errorMsg));
                    }
                },
                onerror: function (err) {
                    console.error('[Ban Checker v4.7] Request error:', err);
                    reject(new Error('Ошибка запроса к API. Проверьте соединение.'));
                }
            });
        });
    }

    // --- ОБРАБОТЧИК КЛИКА ПО КНОПКЕ (ИСПРАВЛЕН) ---
    async function handleInfoButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const playerNameInput = document.querySelector('#playerNameInput');
        let playerName = playerNameInput ? playerNameInput.value.trim() : '';

        if (!playerName) {
            const urlParams = new URLSearchParams(window.location.search);
            playerName = urlParams.get('pname') || '';
            playerName = playerName.trim();
        }

        const resultBox = document.getElementById('ban-check-result-v41');
        if (!playerName) {
            showResult('Имя игрока не указано.', 'error', resultBox);
            return;
        }

        showResult('Загрузка информации...', 'loading', resultBox);

        try {
            console.log(`[Ban Checker v4.7] Запрос последней блокировки для игрока: ${playerName}`);
            // ИЗМЕНЕНО: Вызываем исправленную функцию
            const logs = await getPlayerLastBlock(playerName, resultBox);

            // ИЗМЕНЕНО: Берем ПОСЛЕДНЮЮ запись из массива (она самая новая, так как API сортирует по возрастанию)
            if (logs && logs.length > 0) {
                console.log(`[Ban Checker v4.7] Получено ${logs.length} записей (отфильтровано API).`);
                // logs уже отсортированы по возрастанию времени (order_by=time)
                // Последняя запись в массиве - самая последняя по времени
                const lastBlockLog = logs[logs.length - 1];

                if (lastBlockLog && lastBlockLog.transaction_desc) {
                    const adminNick = lastBlockLog.player_name || "Неизвестен";
                    const blockInfo = parseBanInfo(lastBlockLog.transaction_desc, playerName);
                    const formattedTime = formatDate(lastBlockLog.time);

                    const html = `
                        <div class="ban-info-banned-v41">🛑 Последняя блокировка ${playerName}</div>
                        <div><b>Срок:</b> ${blockInfo.duration}</div>
                        <div><b>Причина:</b> ${blockInfo.reason}</div>
                        <div><b>Админ:</b> ${adminNick}</div>
                        <div><b>Время:</b> ${formattedTime}</div>
                    `;
                    showResult(html, 'success', resultBox);
                } else {
                    showResult(`Ошибка обработки данных последней блокировки для "${playerName}".`, 'error', resultBox);
                }
            } else {
                showResult(`Блокировки для <b>"${playerName}"</b> не найдены.`, 'not_found', resultBox);
            }
        } catch (error) {
            console.error('[Ban Checker v4.7] Ошибка при получении информации:', error);
            showResult(`Ошибка: ${error.message}`, 'error', resultBox);
        }
    }

    // --- СОЗДАНИЕ UI ---
    function createBanCheckerUI() {
        console.log('[Ban Checker v4.7] Creating UI...');
        const playerNameInput = document.querySelector('#playerNameInput');
        if (!playerNameInput) {
            console.error('[Ban Checker v4.7] Player name input not found.');
            return;
        }

        const container = document.createElement('div');
        container.id = 'ban-check-container-v41';

        const button = document.createElement('button');
        button.id = 'ban-check-btn-v41';
        button.className = 'btn btn-outline-secondary btn-sm';
        button.textContent = 'Последняя блокировка';
        button.type = 'button';

        const resultBox = document.createElement('div');
        resultBox.id = 'ban-check-result-v41';
        resultBox.textContent = 'Введите имя игрока и нажмите кнопку.';

        container.appendChild(button);
        container.appendChild(resultBox);

        playerNameInput.parentNode.insertBefore(container, playerNameInput.nextSibling);

        button.addEventListener('click', handleInfoButtonClick);

        console.log('[Ban Checker v4.7] UI created successfully.');
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    const interval = setInterval(() => {
        if (document.querySelector('#playerNameInput')) {
            clearInterval(interval);
            console.log('[Ban Checker v4.7] Input field found, initializing UI...');
            setTimeout(createBanCheckerUI, 100);
        } else {
            console.log('[Ban Checker v4.7] Waiting for input field...');
        }
    }, 1000);

    setTimeout(() => {
        if (!document.querySelector('#ban-check-container-v41')) {
            console.warn('[Ban Checker v4.7] Timeout: UI was not created within 15 seconds.');
            clearInterval(interval);
        }
    }, 15000);

})();