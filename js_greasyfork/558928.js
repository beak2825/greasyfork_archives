// ==UserScript==
// @name         Steam: Автоматическое скрытие игр (Единая База)
// @namespace    steam_lib_manager_unified
// @version      0.35
// @description  Скрипт для скрытия игр в магазине Steam, которые уже есть на ваших других аккаунтах. Использует единую локальную базу данных, работает между доменами (Community <-> Store).
// @match        https://steamcommunity.com/*/games*
// @match        https://store.steampowered.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558928/Steam%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B8%D0%B3%D1%80%20%28%D0%95%D0%B4%D0%B8%D0%BD%D0%B0%D1%8F%20%D0%91%D0%B0%D0%B7%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558928/Steam%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B8%D0%B3%D1%80%20%28%D0%95%D0%B4%D0%B8%D0%BD%D0%B0%D1%8F%20%D0%91%D0%B0%D0%B7%D0%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ==================================================================================
     * РАЗДЕЛ 1: КОНФИГУРАЦИЯ И КОНСТАНТЫ
     * ==================================================================================
     */

    // Код причины игнорирования для API Steam.
    // 2 обычно означает "Played on another platform" (Играл на другой платформе).
    const IGNORE_REASON_CODE = 2;

    // URL API Steam, куда отправляются запросы для скрытия игры из рекомендаций магазина.
    const API_URL = 'https://store.steampowered.com/recommended/ignorerecommendation/';

    // Задержка в мс между запросами к API при массовой обработке.
    // Значение 600мс выбрано для предотвращения ошибки 429 (Too Many Requests) и временной блокировки IP.
    const REQUEST_DELAY = 600;

    // Массив маркеров (строк или классов), наличие которых на странице игры говорит о том,
    // что она уже куплена на ТЕКУЩЕМ аккаунте.
    const OWNED_MARKERS = [
        'ds_owned_flag',                 // CSS класс флага владения
        'ds_owned',                      // CSS класс блока владения
        'game_area_already_owned',       // CSS класс области покупки
        'Already in your Steam library', // Текст на английском
        'Уже в библиотеке Steam',        // Текст на русском
        'уже находится в вашей библиотеке', // Альтернативный текст
        'В библиотеке',                  // Короткий статус
        'owner_block_content'            // Блок владельца
    ];

    // Функция экранирования HTML (Защита от XSS)
    const escapeHtml = (unsafe) => {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    /**
     * ==================================================================================
     * РАЗДЕЛ 2: МЕНЕДЖЕР ИДЕНТИФИКАЦИИ (ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ)
     * ==================================================================================
     */
    const User = {
        // Функция для получения SteamID64 текущего авторизованного пользователя
        getID: function() {
            // 1. Проверяем глобальную переменную g_steamID, которую часто оставляет Steam в коде страниц
            if (typeof g_steamID !== 'undefined' && g_steamID !== 'false') return g_steamID;

            // 2. Ищем ссылку на профиль в шапке сайта, которая обычно содержит ID
            // Используем более универсальный regex, т.к. 765 - это только для старых аккаунтов.
            // Стандартный SteamID64 состоит из 17 цифр, начинающихся на 7.
            const profileLink = document.querySelector('a[href*="/profiles/"]');
            if (profileLink) {
                // Извлекаем цепочку из 17 цифр (стандарт SteamID64)
                const m = profileLink.href.match(/profiles\/(\d{17})/);
                if (m) return m[1];
                // Фолбэк на любую длину цифр, если формат изменился, но это ссылка на профиль
                const m2 = profileLink.href.match(/profiles\/(\d+)/);
                if (m2) return m2[1];
            }

            // 3. Проверяем объект rgProfileData, если он определен на странице
            if (typeof rgProfileData !== 'undefined' && rgProfileData.steamid) return rgProfileData.steamid;

            // Если ничего не найдено
            return null;
        },

        // Функция для получения отображаемого имени (Никнейма)
        getName: function() {
            // 1. Ищем элемент с классом account_name в интерфейсе
            const accName = document.querySelector('.account_name');
            if (accName) return accName.textContent.trim();

            // 2. Проверяем глобальную переменную g_personaName
            if (typeof g_personaName !== 'undefined') return g_personaName;

            // 3. Проверяем данные профиля
            if (typeof rgProfileData !== 'undefined' && rgProfileData.personaname) return rgProfileData.personaname;

            // 4. Пытаемся выпарсить имя из заголовка страницы (Title)
            const title = document.title;
            const m = title.match(/:: (.+) ::/); // Формат заголовка Steam обычно "Steam Community :: Ник :: ..."
            if (m) return m[1];

            return null;
        }
    };

    /**
     * ==================================================================================
     * РАЗДЕЛ 3: ХРАНИЛИЩЕ ДАННЫХ (STORAGE)
     * Использует GM_ API для кросс-доменного доступа (Store <-> Community)
     * ==================================================================================
     */
    const Storage = {
        _MEM_DB: null,
        _MEM_ALIASES: null,
        _MEM_SETTINGS: null,
        _CACHE_ARRAY: null, // Кэшированный массив для toArray()
        _saveTimer: null,
        _isDirty: false,

        // --- МЕМОИЗАЦИЯ ---
        invalidateCache: () => {
            Storage._CACHE_ARRAY = null;
        },

        // Инициализация (Загрузка с диска в память)
        init: () => {
            if (Storage._MEM_DB) return; // Уже загружено
            Storage._MEM_DB = GM_getValue('SLM_UNIFIED_DB_v1', {});
            Storage._MEM_ALIASES = GM_getValue('SLM_ALIASES', {});
            Storage._MEM_SETTINGS = GM_getValue('SLM_SETTINGS', {
                reqDelay: REQUEST_DELAY,
                allowHeavyScan: true, // По умолчанию включено
                showOwnersOnStore: true // Показывать владельцев в магазине (Default: true)
            });
        },

        // Принудительная синхронизация с диском (немедленно)
        forceSync: () => {
            if (Storage._isDirty) {
                if (Storage._saveTimer) clearTimeout(Storage._saveTimer);
                GM_setValue('SLM_UNIFIED_DB_v1', Storage._MEM_DB);
                GM_setValue('SLM_ALIASES', Storage._MEM_ALIASES);
                GM_setValue('SLM_SETTINGS', Storage._MEM_SETTINGS);
                Storage._isDirty = false;
                Storage._saveTimer = null;
                return true;
            }
            return false;
        },

        // Отложенное сохранение (Debounce)
        scheduleSave: () => {
            Storage._isDirty = true;
            if (Storage._saveTimer) return; // Таймер уже тикает

            // Ждем 2 секунды тишины, потом сохраняем
            Storage._saveTimer = setTimeout(() => {
                Storage.forceSync();
            }, 2000);
        },

        // Получение всей базы данных игр (из памяти)
        getDB: () => {
            if (!Storage._MEM_DB) Storage.init();
            return Storage._MEM_DB;
        },

        // Сохранение базы данных (в память + отложенно на диск)
        saveDB: (newDb) => {
            Storage._MEM_DB = newDb;
            Storage.invalidateCache(); // База изменилась полностью
            Storage.scheduleSave();
            return true;
        },

        // Слияние внешней базы с текущей (Merge) - безопасно объединяет данные
        mergeDB: (externalDb) => {
            const currentDb = Storage.getDB();
            let added = 0;
            let updated = 0;

            Object.keys(externalDb).forEach(appid => {
                const extGame = externalDb[appid];
                const locGame = currentDb[appid];

                if (!locGame) {
                    // Игры нет в текущей базе - добавляем целиком
                    currentDb[appid] = extGame;
                    added++;
                } else {
                    let changed = false;

                    // 1. Слияние списков владельцев
                    if (extGame.o && Array.isArray(extGame.o)) {
                        extGame.o.forEach(owner => {
                            if (!locGame.o.includes(owner)) {
                                locGame.o.push(owner);
                                changed = true;
                            }
                        });
                    }

                    // 2. Слияние истории скрытия (важно для синхронизации прогресса)
                    if (extGame.h && Array.isArray(extGame.h)) {
                        if (!locGame.h) locGame.h = [];
                        extGame.h.forEach(hider => {
                            if (!locGame.h.includes(hider)) {
                                locGame.h.push(hider);
                                changed = true;
                            }
                        });
                    }

                    // 3. Обновление имени, если у нас заглушка (AppID...), а во внешней базе нормальное имя
                    if (Storage.isPlaceholder(locGame) && !Storage.isPlaceholder(extGame)) {
                        locGame.n = extGame.n;
                        if (locGame.p) delete locGame.p;
                        changed = true;
                    }

                    if (changed) updated++;
                }
            });

            if (added > 0 || updated > 0) {
                Storage.invalidateCache();
                Storage.scheduleSave();
            }
            return { added, updated };
        },

        // Получение списка псевдонимов
        getAliases: () => {
             if (!Storage._MEM_ALIASES) Storage.init();
             return Storage._MEM_ALIASES;
        },

        // Сохранение списка псевдонимов
        saveAliases: (aliases) => {
            Storage._MEM_ALIASES = aliases;
            Storage.scheduleSave();
        },

        // Установка псевдонима для конкретного ID
        setAlias: (id, name) => {
            const aliases = Storage.getAliases();
            aliases[id] = name;
            Storage.saveAliases(aliases);
        },

        // --- PLACEHOLDER HELPERS ---
        isPlaceholder: (entry) => {
            // Флаг p=1 или имя начинается с "AppID " (Legacy support)
            return !!entry.p || (entry.n && entry.n.startsWith('AppID '));
        },

        // Удаление псевдонима
        deleteAlias: (id) => {
            const aliases = Storage.getAliases();
            delete aliases[id];
            Storage.saveAliases(aliases);
        },

        // Получение отображаемого имени по ID
        getDisplayName: (steamID) => {
            const aliases = Storage.getAliases();
            return aliases[steamID] || steamID;
        },

        // Обновление владельцев для списка игр
        updateOwner: (gamesList, ownerID) => {
            const db = Storage.getDB();
            let newGames = 0;
            let updatedGames = 0;

            gamesList.forEach(g => {
                const aid = g.appid.toString();
                if (!db[aid]) {
                    db[aid] = { n: g.name, o: [] };
                    newGames++;
                }
                if (!db[aid].o.includes(ownerID)) {
                    db[aid].o.push(ownerID);
                    updatedGames++;
                }

                // Обновление имени:
                // 1. Если игры нет имени (n) или это placeholder (p) или legacy-placeholder (AppID...)
                // 2. И новое имя валидное и не placeholder
                const isEntryPlaceholder = Storage.isPlaceholder(db[aid]);
                const isNewNamePlaceholder = !g.name || g.name.startsWith('AppID ');

                if (isEntryPlaceholder && !isNewNamePlaceholder) {
                    db[aid].n = g.name;
                    if (db[aid].p) delete db[aid].p; // Удаляем флаг заглушки
                }
            });

            Storage.scheduleSave(); // Просто помечаем, что нужно сохранить
            if (newGames > 0 || updatedGames > 0) Storage.invalidateCache();
            return { newGames, updatedGames };
        },

        // Удаление владельца у списка игр (для исправления аномалий)
        removeOwner: (gamesList, ownerID) => {
            const db = Storage.getDB();
            let count = 0;
            gamesList.forEach(g => {
                const aid = g.appid.toString();
                if (db[aid] && db[aid].o.includes(ownerID)) {
                    db[aid].o = db[aid].o.filter(id => id !== ownerID);

                    // Также сбрасываем статус "Скрыто" (h), чтобы при следующем запуске
                    // скрипт заново проверил эту игру и попытался скрыть её в магазине.
                    // Это решает проблему, когда игра была "Аномалией", мы её убрали, но в логе она пропускалась.
                    if (db[aid].h) {
                        db[aid].h = db[aid].h.filter(id => id !== ownerID);
                    }

                    count++;
                }
            });
            if (count > 0) { Storage.invalidateCache(); Storage.scheduleSave(); }
            return count;
        },

        // Установка точного списка владельцев
        setOwners: (appid, owners) => {
            const db = Storage.getDB();
            if (db[appid]) {
                db[appid].o = owners;
                Storage.invalidateCache();
                Storage.scheduleSave();
            }
        },

        // Пометить игру как скрытую для пользователя
        markAsHidden: (appid, steamID) => {
            const db = Storage.getDB();
            const aid = appid.toString();
            if (db[aid]) {
                if (!db[aid].h) db[aid].h = [];
                if (!db[aid].h.includes(steamID)) {
                    db[aid].h.push(steamID);
                    // Примечание: toArray() не возвращает поле 'h', но renderDB фильтрует по нему.
                    // Если мы хотим, чтобы интерфейс реагировал мгновенно (например, если мы добавим отображение статуса), лучше сбросить кэш.
                    // При массовом скрытии это не страшно, т.к. renderDB не вызывается в цикле.
                    Storage.invalidateCache();
                    Storage.scheduleSave();
                }
            }
        },

        // Удаление игр из базы по списку ID
        deleteGames: (appIds) => {
            const db = Storage.getDB();
            let count = 0;
            appIds.forEach(id => {
                if (db[id]) { delete db[id]; count++; }
            });
            if (count > 0) Storage.invalidateCache();
            Storage.scheduleSave();
            return count;
        },

        // Полная очистка базы данных
        clearDB: () => {
             Storage._MEM_DB = {};
             Storage.invalidateCache();
             Storage.forceSync(); // Тут лучше сохранить сразу
        },

        // Преобразование объекта базы в массив
        toArray: () => {
            if (Storage._CACHE_ARRAY) return Storage._CACHE_ARRAY;

            const db = Storage.getDB();
            Storage._CACHE_ARRAY = Object.keys(db).map(appid => ({
                appid: appid,
                name: db[appid].n,
                owners: db[appid].o
            }));
            return Storage._CACHE_ARRAY;
        },

        // --- НАСТРОЙКИ ---
        getSettings: () => {
            if (!Storage._MEM_SETTINGS) Storage.init();
            return Storage._MEM_SETTINGS;
        },
        saveSettings: (settings) => {
            Storage._MEM_SETTINGS = settings;
            Storage.scheduleSave();
        }
    };

    // Автоматическая регистрация текущего аккаунта в список алиасов при запуске
    function autoRegisterAccount() {
        const id = User.getID();
        const name = User.getName();
        if (id && name) {
            const aliases = Storage.getAliases();

            // Проверяем, занято ли это имя другим ID, чтобы избежать путаницы
            const isTaken = Object.keys(aliases).some(k => aliases[k] === name && k !== id);

            let finalName = name;
            if (isTaken) {
                // Если имя уже есть у другого аккаунта, добавляем ID для уникальности
                finalName = `${name} (${id})`;
            }

            if (!aliases[id] || aliases[id] !== finalName) {
                Storage.setAlias(id, finalName);
            }
        }
    }

    /**
     * ==================================================================================
     * РАЗДЕЛ 4: ДВИЖОК ПОЛЬЗОВАТЕЛЬСКОГО ИНТЕРФЕЙСА (UI ENGINE)
     * ==================================================================================
     */
    const UI = {
        overlay: null,          // Ссылка на DOM-элемент оверлея
        isProcessing: false,    // Флаг: идет ли процесс скрытия
        stopProcessing: false,  // Флаг: запрос на остановку процесса
        currentSteamID: null,   // Кэшированный ID текущего пользователя
        dbPage: 1,              // Текущая страница
        dbLimit: 50,            // Элементов на странице
        selection: new Set(),   // Хранилище выделенных ID

        // Новые состояния для режима "Просмотр только выделенного"
        showSelectedOnly: false,
        lockedViewList: [],     // Снимок списка для режима просмотра выделенного

        // Состояния процесса (Hide / Unhide)
        processMode: 'hide',    // 'hide' (сканирование и скрытие) или 'unhide' (восстановление)
        processQueue: [],       // Очередь для восстановления
        unhideType: 'full',     // 'full' (API+DB) или 'db_only' (Default теперь FULL)

        // Параметры сортировки
        sortField: 'appid',     // 'appid', 'name'
        sortDir: 1,             // 1 (Asc/Приоритет), -1 (Desc/Обратно)
        prioritizeMyGames: false, // Флаг приоритета: показывать мои игры сверху

        // Кэш отрисовки (отсортированный список)
        renderCache: {
            sourceRef: null,    // Ссылка на исходный массив (Storage.toArray или lockedViewList)
            filterHash: '',     // Хэш параметров фильтрации (HiddenOnly)
            sortHash: '',       // Хэш параметров сортировки (Field + Dir + Priority)
            result: null        // Готовый отсортированный массив
        },

        // Функция для отображения кастомных диалоговых окон (вместо alert/prompt)
        showDialog: function(type, text, defaultValue = '') {
            return new Promise((resolve) => {
                // Создаем контейнер диалога
                const dlg = document.createElement('div');
                dlg.className = 'slm-overlay';

                // Находим максимальный z-index среди открытых оверлеев, чтобы диалог был выше
                let maxZ = 100000;
                document.querySelectorAll('.slm-overlay').forEach(el => {
                     const z = parseInt(window.getComputedStyle(el).zIndex);
                     if (!isNaN(z) && z >= maxZ) maxZ = z;
                });
                dlg.style.zIndex = maxZ + 10;

                // Убеждаемся, что стили загружены (если диалог вызван изолированно)
                this.createStyles();

                // Формируем поле ввода, если это prompt
                let inputHTML = '';
                if (type === 'prompt') {
                    inputHTML = `<input type="text" id="slm-dialog-input" value="${defaultValue}" class="slm-input-dark" style="margin:10px 0; padding:5px;">`;
                }

                // Формируем кнопки
                let buttonsHTML = '';
                if (type === 'alert') {
                    buttonsHTML = `<button class="slm-btn" id="slm-dlg-ok">OK</button>`;
                } else {
                    buttonsHTML = `
                        <button class="slm-btn green" id="slm-dlg-ok">OK</button>
                        <button class="slm-btn red" id="slm-dlg-cancel">Отмена</button>
                    `;
                }

                // Вставляем HTML структуру окна
                dlg.innerHTML = `
                    <div class="slm-modal" style="width:400px; height:auto; padding:20px; text-align:center; border:1px solid #66c0f4; background:#1b2838; box-shadow:0 0 20px #000;">
                        <h3 style="margin-top:0; color:#66c0f4;">${type === 'alert' ? 'Сообщение' : type === 'confirm' ? 'Подтверждение' : 'Ввод данных'}</h3>
                        <div style="margin-bottom:15px; font-size:14px; color:#c6d4df;">${escapeHtml(text)}</div>
                        ${inputHTML}
                        <div style="display:flex; justify-content:center; gap:10px;">
                            ${buttonsHTML}
                        </div>
                    </div>
                `;

                document.body.appendChild(dlg);

                // Фокус на поле ввода и обработка Enter
                const input = document.getElementById('slm-dialog-input');
                if(input) {
                    input.focus();
                    input.onkeydown = (e) => { if(e.key === 'Enter') document.getElementById('slm-dlg-ok').click(); };
                }

                // Функция закрытия и возврата значения промиса
                const close = (val) => { dlg.remove(); resolve(val); };

                // Обработчик кнопки OK
                document.getElementById('slm-dlg-ok').onclick = () => {
                    if (type === 'prompt') close(input.value);
                    else if (type === 'confirm') close(true);
                    else close(true);
                };

                // Обработчик кнопки Cancel
                if (document.getElementById('slm-dlg-cancel')) {
                    document.getElementById('slm-dlg-cancel').onclick = () => close(type === 'prompt' ? null : false);
                }
            });
        },

        // Редактор владельцев (UI с чекбоксами)
        openOwnerEditor: function(appid) {
            this.createStyles(); // Ensure styles
            const db = Storage.getDB();
            const game = db[appid];
            if (!game) return;

            const aliases = Storage.getAliases();
            const knownIDs = Object.keys(aliases);

            // Если текущий пользователь не в алиасах, добавляем временно для выбора
            if (this.currentSteamID && !aliases[this.currentSteamID]) {
                aliases[this.currentSteamID] = 'Вы (Текущий)';
                if (!knownIDs.includes(this.currentSteamID)) knownIDs.push(this.currentSteamID);
            }

            // Формируем список
            let listHTML = '<div style="max-height:300px; overflow-y:auto; text-align:left; background:#101010; padding:10px; border:1px solid #333; margin-bottom:10px;">';

            // 1. Известные профили
            knownIDs.forEach(id => {
                const isChecked = game.o.includes(id);
                listHTML += `
                    <label style="display:flex; align-items:center; padding:5px; cursor:pointer; color:#ccc; border-bottom:1px solid #222;">
                        <input type="checkbox" class="slm-owner-chk" value="${id}" ${isChecked ? 'checked' : ''} style="margin-right:10px; transform:scale(1.2);">
                        <span>${escapeHtml(aliases[id])} <span style="color:#666; font-size:11px;">(${id})</span></span>
                    </label>
                `;
            });

            // 2. Неизвестные ID (которые уже есть у игры, но нет в алиасах)
            game.o.forEach(id => {
                if (!aliases[id]) {
                     listHTML += `
                        <label style="display:flex; align-items:center; padding:5px; cursor:pointer; color:#ccc; border-bottom:1px solid #222;">
                            <input type="checkbox" class="slm-owner-chk" value="${id}" checked style="margin-right:10px; transform:scale(1.2);">
                            <span>${id} <span style="color:#666; font-size:11px;">(Неизвестный ID)</span></span>
                        </label>
                    `;
                }
            });
            listHTML += '</div>';

            const overlay = document.createElement('div');
            overlay.className = 'slm-overlay';
            overlay.style.zIndex = '100010';

            overlay.innerHTML = `
                <div class="slm-modal" style="width:400px; height:auto; padding:20px; border:1px solid #66c0f4; background:#1b2838; box-shadow:0 0 20px #000;">
                    <h3 style="margin-top:0; color:#66c0f4; font-size:16px;">Редактор владельцев</h3>
                    <div style="margin-bottom:10px; color:#fff; font-weight:bold; font-size:14px; word-break:break-word;">${escapeHtml(game.n)}</div>
                    <div style="font-size:11px; color:#888; margin-bottom:5px;">Отметьте, у кого есть эта игра:</div>
                    ${listHTML}

                    <div style="display:flex; gap:5px; margin-bottom:15px; background:#222; padding:5px;">
                        <input type="text" id="slm-new-owner-id" placeholder="Добавить ID вручную..." class="slm-input-dark" style="flex-grow:1; font-size:12px;">
                        <button class="slm-btn small" id="slm-add-custom-owner">+</button>
                    </div>

                    <div style="display:flex; justify-content:center; gap:10px;">
                        <button class="slm-btn green" id="slm-save-owners">Сохранить</button>
                        <button class="slm-btn red" id="slm-cancel-owners">Отмена</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Обработчики
            const close = () => overlay.remove();
            overlay.querySelector('#slm-cancel-owners').onclick = close;

            // Добавление кастомного ID в список "на лету"
            overlay.querySelector('#slm-add-custom-owner').onclick = () => {
                const input = overlay.querySelector('#slm-new-owner-id');
                const val = input.value.trim();
                if (val && /^\d+$/.test(val)) {
                    const exists = Array.from(overlay.querySelectorAll('.slm-owner-chk')).some(cb => cb.value === val);
                    if (!exists) {
                         const container = overlay.querySelector('div[style*="overflow-y:auto"]');
                         const div = document.createElement('div');
                         div.innerHTML = `
                            <label style="display:flex; align-items:center; padding:5px; cursor:pointer; color:#ccc; border-bottom:1px solid #222;">
                                <input type="checkbox" class="slm-owner-chk" value="${val}" checked style="margin-right:10px; transform:scale(1.2);">
                                <span>${val} <span style="color:#666; font-size:11px;">(Вручную)</span></span>
                            </label>
                         `;
                         container.appendChild(div);
                         container.scrollTop = container.scrollHeight;
                    }
                    input.value = '';
                } else {
                    this.showDialog('alert', 'Введите корректный Steam ID (цифры)');
                }
            };

            overlay.querySelector('#slm-save-owners').onclick = () => {
                const checkboxes = overlay.querySelectorAll('.slm-owner-chk:checked');
                const newOwners = Array.from(checkboxes).map(cb => cb.value);
                Storage.setOwners(appid, newOwners);
                this.renderDB();
                close();
            };
        },

        // Открытие главного окна менеджера
        open: function() {
            // Если окно уже открыто, закрываем старое
            if (this.overlay) { this.overlay.remove(); this.overlay = null; }

            autoRegisterAccount();

            // Инициализация памяти при открытии UI (на всякий случай, если не запустилось ранее)
            // Но обычно autoRegisterAccount уже дергает API, так что init там пройдет.
            Storage.init();

            this.currentSteamID = User.getID();

            this.createStyles(); // Подгружаем CSS стили

            // Сброс состояний просмотра при открытии
            this.showSelectedOnly = false;
            this.showHiddenOnly = false; // Новый фильтр
            this.lockedViewList = [];

            const dbArray = Storage.toArray(); // Получаем данные для отображения

            // Формируем статус-бар (кто залогинен)
            let statusHTML = '';
            if (this.currentSteamID) {
                const displayName = Storage.getDisplayName(this.currentSteamID);
                const myCount = dbArray.filter(g => g.owners.includes(this.currentSteamID)).length;
                statusHTML = `
                    <div style="color:#4caf50; font-size:12px;">✅ Вы: <b>${escapeHtml(displayName)}</b> (${this.currentSteamID})</div>
                    <div style="color:#66c0f4; font-size:11px;">В базе отмечено ваших игр: ${myCount}</div>
                `;
            } else {
                statusHTML = `<div style="color:#d9534f; font-weight:bold;">❌ Вы не залогинены</div>`;
            }

            // Создаем основную структуру модального окна
            this.overlay = document.createElement('div');
            this.overlay.className = 'slm-overlay';
            this.overlay.innerHTML = `
                <div class="slm-modal">
                    <div class="slm-header">
                        <div style="display:flex; flex-direction:column;">
                            <span>Steam Library Manager</span>
                            ${statusHTML}
                        </div>
                        <button class="slm-btn red" id="slm-close">X</button>
                    </div>

                    <div class="slm-tabs">
                        <button class="slm-tab active" data-tab="db">Единая База (${dbArray.length})</button>
                        <button class="slm-tab" data-tab="process">Скрытие</button>
                    </div>

                    <!-- ВКЛАДКА: БАЗА ДАННЫХ -->
                    <div class="slm-body" id="tab-db">
                        <div class="slm-toolbar">
                            <button class="slm-btn red" id="slm-delete-sel">Удалить выбранное</button>
                            <div style="width:10px;"></div>
                            <button class="slm-btn" id="slm-aliases" title="Управление аккаунтами">👤 Аккаунты</button>
                            <button class="slm-btn" id="slm-open-my-games" style="margin-left:10px;">Мои игры</button>
                            <div style="flex-grow:1;"></div>
                             <div style="display:flex; align-items:center; margin-right:10px; font-size:12px; color:#8f98a0;">
                                На странице: <input type="number" id="slm-per-page" value="${this.dbLimit}" class="slm-input-dark" style="width:50px; margin-left:5px; text-align:center;">
                            </div>
                            <button class="slm-btn" id="slm-filter-hidden" title="Показать игры, скрытые скриптом">👁️ Скрытые</button>
                            <button class="slm-btn" id="slm-btn-unhide" style="display:none; background:#e6a23c; color:#000;" title="Вернуть выбранные игры в магазин">♻️ Вернуть</button>
                            <div style="width:10px;"></div>
                            <button class="slm-btn" id="slm-export" title="Сохранить полную резервную копию базы в файл">Экспорт JSON</button>
                            <button class="slm-btn" id="slm-merge" title="Добавить данные из файла к текущим (объединение)">Слияние JSON</button>
                            <button class="slm-btn" id="slm-import" title="Полностью заменить текущую базу (Осторожно!)">Импорт JSON</button>
                        </div>
                        <div id="slm-selection-bar" style="background:#3a2e16; color:#e0c996; padding:8px 15px; font-size:13px; display:none; align-items:center; justify-content:center; border-bottom:1px solid #5c4a24;"></div>
                        <div class="slm-table-container">
                            <table class="slm-table">
                                <thead>
                                    <tr>
                                        <th width="30"><input type="checkbox" id="slm-chk-master"></th>
                                        <th width="80" class="slm-sort-header" data-sort="appid" style="cursor:pointer; user-select:none;">AppID <span id="sort-icon-appid"></span></th>
                                        <th class="slm-sort-header" data-sort="name" style="cursor:pointer; user-select:none;">Название <span id="sort-icon-name"></span></th>
                                        <th width="150" class="slm-sort-header" data-sort="owners" style="cursor:pointer; user-select:none;">Владельцы <span id="sort-icon-owners"></span></th>
                                    </tr>
                                </thead>
                                <tbody id="slm-tbody-db"></tbody>
                            </table>
                        </div>
                        <div class="slm-footer" style="display: grid; grid-template-columns: 1fr auto; align-items: center;">
                            <div id="slm-pagination" style="justify-self: center;"></div>
                            <button class="slm-btn red small" id="slm-wipe">Полный Сброс Базы</button>
                        </div>
                    </div>

                    <!-- ВКЛАДКА: ПРОЦЕСС СКРЫТИЯ -->
                    <div class="slm-body" id="tab-process" style="display:none;">
                        <div style="padding:20px;">
                            ${this.currentSteamID ? '' : '<div style="background:#a00; color:#fff; padding:10px; margin-bottom:10px;">ОШИБКА: Вы не залогинены! Скрипт не знает, кто вы, и не может проверить ваши игры.</div>'}

                            <!-- ПАНЕЛЬ НАСТРОЕК -->
                            <div style="border: 1px solid #444; background:#222; padding:15px; border-radius:4px; margin-bottom:15px;">
                                <h4 id="slm-params-title" style="margin-top:0; color:#66c0f4; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:10px;">Параметры скрытия</h4>
                                <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                                    <label style="color:#ccc;">Задержка (мс):</label>
                                    <input type="number" id="slm-setting-delay" class="slm-input-dark" style="width:80px; text-align:center;" min="100">
                                    <span id="slm-tooltip-delay" style="cursor:help; color:#66c0f4; border-bottom:1px dotted #66c0f4;" title="Интервал между запросами к серверу Steam.\n\nСтандарт: ${REQUEST_DELAY} мс.\n\nЗачем нужно:\nSteam блокирует доступ (Ошибка 429), если отправлять запросы слишком часто.">
                                        [?]
                                    </span>
                                    <span style="color:#666; font-size:11px;">(Default: ${REQUEST_DELAY})</span>
                                </div>

                                <!-- Новая настройка: Heavy Scan -->
                                <div style="display:flex; align-items:center; gap:10px; font-size:13px; margin-top:5px;">
                                    <label style="display:flex; align-items:center; cursor:pointer; color:#ccc;">
                                        <input type="checkbox" id="slm-setting-heavy" style="margin-right:10px; transform:scale(1.2);">
                                        <span>Разрешить <b>Heavy Scan</b> (Медленно)</span>
                                    </label>
                                    <span style="cursor:help; color:#66c0f4; border-bottom:1px dotted #66c0f4;" title="Если быстрый список игр недоступен, скрипт будет проверять страницу каждой игры отдельно.\n\nВКЛ: Процесс продолжится (медленно, много запросов).\nВЫКЛ: Процесс остановится с ошибкой (безопасно).">
                                        [?]
                                    </span>
                                </div>

                                <!-- Контейнер настроек скрытия (Force Check) -->
                                <div id="slm-settings-hide" style="margin-top:10px;">
                                    <label style="display:flex; align-items:center; cursor:pointer; color:#ccc; font-size:13px;">
                                        <input type="checkbox" id="slm-force-check" style="margin-right:10px; transform:scale(1.2);">
                                        <span>⚡ <b>Принудительная проверка</b> (Игнорировать историю)</span>
                                    </label>
                                    <div style="font-size:11px; color:#888; margin-left:24px; margin-top:2px;">
                                        Полезно, если вы случайно вернули игру в Steam, и скрипт её пропускает.
                                    </div>
                                </div>

                                <!-- Контейнер настроек восстановления (Info) -->
                                <div id="slm-settings-unhide" style="margin-top:10px; display:none; padding-top:5px; border-top:1px dashed #444;">
                                    <div style="font-size:13px; color:#ccc; display:flex; align-items:center; gap:10px;">
                                        <label style="color:#aaa;">Режим:</label>
                                        <select id="slm-unhide-type-select" class="slm-input-dark" style="flex-grow:1; cursor:pointer;">
                                            <option value="full">♻️ Полное (Steam API + БД)</option>
                                            <option value="db_only">🧹 Только БД (Забыть)</option>
                                        </select>
                                    </div>
                                    <div style="font-size:11px; color:#888; margin-top:5px;">
                                        Влияет на то, будет ли отправлен запрос на возврат в магазин.
                                    </div>
                                </div>
                            </div>

                            <div style="border: 1px solid #444; background:#222; padding:15px; border-radius:4px;" id="slm-algo-desc">
                                <h4 style="margin-top:0; color:#66c0f4;" id="slm-proc-title">Алгоритм работы</h4>
                                <div style="font-size:13px; color:#ccc; line-height:1.6;" id="slm-proc-text">
                                    <p>Скрипт проверяет игры из <b>Единой Базы</b> по четырем критериям:</p>
                                    <ol style="padding-left:20px; margin:5px 0;">
                                        <li style="margin-bottom:5px;">
                                            <b>Локальная База:</b> Если вы отмечены как владелец вручную.<br>
                                            <span style="color:#4caf50;">👉 SKIP (База)</span>
                                        </li>
                                        <li style="margin-bottom:5px;">
                                            <b>API Steam:</b> Проверка по списку всех ваших лицензий (быстро).<br>
                                            <span style="color:#4caf50;">👉 SKIP (В библиотеке/Кэш)</span>
                                        </li>
                                        <li style="margin-bottom:5px;">
                                            <b>История:</b> Если игра уже была скрыта скриптом ранее.<br>
                                            <span style="color:#888;">👉 SKIP (Уже скрыто)</span>
                                        </li>
                                        <li>
                                            <b>Иначе:</b> Игра отправляется в "Скрытое".<br>
                                            <span style="color:#66c0f4;">👉 ACTION: HIDDEN</span>
                                        </li>
                                    </ol>
                                    <div style="font-size:11px; color:#aaa; margin-top:10px; border-top:1px solid #333; padding-top:5px;">
                                        <i>Примечание: Ошибки API (400) теперь автоматически пропускаются и помечаются как скрытые.</i>
                                    </div>
                                </div>

                                <div class="slm-status-box" style="margin-top:15px;">
                                    <div id="proc-status">Ожидание команды...</div>
                                    <div class="slm-progress-bg"><div class="slm-progress-bar" id="proc-bar"></div></div>
                                </div>
                                <div class="slm-log-box" id="proc-log"></div>
                                <div style="margin-top:15px; display:flex; gap:10px;">
                                    <button class="slm-btn green large" id="slm-start" ${!this.currentSteamID ? 'disabled' : ''}>ЗАПУСТИТЬ ПРОВЕРКУ</button>
                                    <button class="slm-btn red large" id="slm-stop" disabled>СТОП</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.overlay);
            this.bindEvents(); // Привязываем обработчики событий
            this.renderDB();   // Отрисовываем таблицу игр
        },

        // Открытие окна предпросмотра сканирования
        openScanPreview: function(games, suggestedSteamID) {
            if (this.overlay) { this.overlay.remove(); this.overlay = null; }
            this.createStyles();

            const knownAliases = Storage.getAliases();
            // Формируем выпадающий список выбора владельца
            let optionsHTML = `<option value="${suggestedSteamID}" selected>${Storage.getDisplayName(suggestedSteamID)} (Текущий)</option>`;
            Object.keys(knownAliases).forEach(aid => {
                if (aid !== suggestedSteamID) {
                    optionsHTML += `<option value="${aid}">${knownAliases[aid]} (${aid})</option>`;
                }
            });

            // --- ЛОГИКА ПОИСКА АНОМАЛИЙ (Призраков) ---
            // Ищем игры, которые числятся в базе за этим юзером, но не найдены на странице.
            const scannedSet = new Set(games.map(g => parseInt(g.appid)));
            const db = Storage.getDB();
            const ghosts = [];

            Object.keys(db).forEach(aid => {
                // Если игра в базе привязана к suggestedSteamID...
                if (db[aid].o && db[aid].o.includes(suggestedSteamID)) {
                    // ...но её нет в списке, который мы только что сосканировали со страницы
                    if (!scannedSet.has(parseInt(aid))) {
                        ghosts.push({appid: aid, name: db[aid].n});
                    }
                }
            });
            // -------------------------------------------

            this.overlay = document.createElement('div');
            this.overlay.className = 'slm-overlay';
            this.overlay.innerHTML = `
                <div class="slm-modal" style="height: 70vh;">
                    <div class="slm-header">
                        <span>Предпросмотр Сканирования</span>
                        <button class="slm-btn red" id="slm-close-scan">Отмена</button>
                    </div>
                    <div class="slm-body" style="padding:15px;">
                        <div style="background:#222; padding:10px; margin-bottom:10px; border:1px solid #444;">
                            <div style="margin-bottom:5px;">
                                Найдено на странице: <b>${games.length}</b>.<br>
                                ${ghosts.length > 0 ? `<span style="color:#e6a23c;">Обнаружено аномалий (есть в базе, нет здесь): <b>${ghosts.length}</b></span>
                                <div style="font-size:11px; color:#aaa; margin-top:3px; line-height:1.2;">
                                    Вероятно, эти игры действительно зарегистрированы на аккаунте (по данным API), но в текущем списке сканирования не отображаются, поскольку скрыты.
                                </div>` : ''}
                            </div>
                            <label style="font-size:12px; color:#aaa;">В чью библиотеку записать эти игры?</label>
                            <select id="slm-scan-owner" style="background:#000; color:#fff; border:1px solid #666; padding:5px; width:100%;">
                                ${optionsHTML}
                                <option value="custom">-- Ввести другой SteamID --</option>
                            </select>
                        </div>

                        <div class="slm-table-container" style="border:1px solid #333;">
                            <table class="slm-table">
                                <thead>
                                    <tr>
                                        <th width="30"><input type="checkbox" id="slm-chk-scan-all" checked></th>
                                        <th width="80">AppID</th>
                                        <th>Название / Статус</th>
                                    </tr>
                                </thead>
                                <tbody id="slm-tbody-scan"></tbody>
                            </table>
                        </div>

                        <div class="slm-footer" style="justify-content: space-between; align-items: center;">
                             <div style="display:flex; flex-direction:column; gap:5px;">
                                 ${ghosts.length > 0 ? '<button class="slm-btn small" id="slm-toggle-ghosts" style="background:#444;">Аномалии: Выбрать/Снять</button>' : ''}
                                 <div style="font-size:11px; color:#888;">Снимите галочки с того, что не хотите менять</div>
                             </div>
                             <button class="slm-btn green large" id="slm-confirm-add">ПРИМЕНИТЬ ИЗМЕНЕНИЯ</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.overlay);

            // Заполнение таблицы найденными играми + Аномалиями
            const tbody = document.getElementById('slm-tbody-scan');
            let html = '';

            // 1. Сначала выводим Аномалии (если есть)
            ghosts.forEach(g => {
                html += `<tr style="background:rgba(100,0,0,0.3);">
                    <td><input type="checkbox" class="slm-chk-scan slm-chk-ghost" value="${g.appid}"></td>
                    <td style="color:#ff6666;">${g.appid}</td>
                    <td>
                        <span style="color:#ff6666;">[ЛИШНЯЯ]</span> ${escapeHtml(g.name)}
                        <div style="font-size:10px; color:#aaa;">Будет убрана из списка ваших игр</div>
                    </td>
                </tr>`;
            });

            // 2. Затем обычные найденные игры
            games.forEach(g => {
                html += `<tr>
                    <td><input type="checkbox" class="slm-chk-scan slm-chk-new" value="${g.appid}" checked></td>
                    <td>${g.appid}</td>
                    <td>${escapeHtml(g.name)}</td>
                </tr>`;
            });
            tbody.innerHTML = html;

            // Обработчики кнопок окна сканирования
            document.getElementById('slm-close-scan').onclick = () => { this.overlay.remove(); this.overlay = null; };

            document.getElementById('slm-chk-scan-all').onclick = (e) => {
                document.querySelectorAll('.slm-chk-scan').forEach(c => c.checked = e.target.checked);
            };

            // Кнопка для быстрого выделения/снятия аномалий
            const btnToggleGhosts = document.getElementById('slm-toggle-ghosts');
            if (btnToggleGhosts) {
                btnToggleGhosts.onclick = () => {
                    const ghostsChks = document.querySelectorAll('.slm-chk-ghost');
                    if (ghostsChks.length === 0) return;
                    // Если хотя бы одна выбрана - снимаем все. Иначе - выбираем все.
                    const anyChecked = Array.from(ghostsChks).some(c => c.checked);
                    ghostsChks.forEach(c => c.checked = !anyChecked);
                };
            }

            // Логика выбора кастомного ID
            document.getElementById('slm-scan-owner').onchange = async (e) => {
                if (e.target.value === 'custom') {
                    const nid = await this.showDialog('prompt', 'Введите Steam ID (цифры):');
                    if (nid) {
                        const opt = document.createElement('option');
                        opt.value = nid; opt.text = nid; opt.selected = true;
                        e.target.add(opt, e.target[0]);
                        e.target.value = nid;
                    } else {
                        e.target.value = suggestedSteamID;
                    }
                }
            };

            // Кнопка подтверждения добавления
            document.getElementById('slm-confirm-add').onclick = async () => {
                const selectedOwner = document.getElementById('slm-scan-owner').value;

                // 1. Обработка добавлений (Новые игры)
                const checkedNew = document.querySelectorAll('.slm-chk-new:checked');
                const toAdd = [];
                checkedNew.forEach(c => {
                    const row = games.find(g => g.appid == c.value);
                    if (row) toAdd.push(row);
                });

                // 2. Обработка удалений (Аномалии)
                // Удаляем ТОЛЬКО если выбранный владелец совпадает с тем, для кого мы считали аномалии (suggestedSteamID).
                // Иначе мы можем удалить игры у другого человека, основываясь на списке первого.
                let removedCount = 0;
                if (selectedOwner === suggestedSteamID) {
                    const checkedGhosts = document.querySelectorAll('.slm-chk-ghost:checked');
                    const toRemove = [];
                    checkedGhosts.forEach(c => {
                        const row = ghosts.find(g => g.appid == c.value);
                        if (row) toRemove.push(row);
                    });

                    if (toRemove.length > 0) {
                        removedCount = Storage.removeOwner(toRemove, selectedOwner);
                    }
                } else if (ghosts.length > 0) {
                     // Если сменили юзера в дропдауне, аномалии игнорируем (безопасность)
                     console.warn('Аномалии пропущены, так как изменен целевой аккаунт.');
                }

                if (toAdd.length === 0 && removedCount === 0) return this.showDialog('alert', 'Ничего не выбрано.');

                const res = Storage.updateOwner(toAdd, selectedOwner);
                this.overlay.remove();
                this.overlay = null;

                let msg = `Успешно!\nНовых игр: ${res.newGames}\nОбновлено: ${res.updatedGames}`;
                if (removedCount > 0) msg += `\n\n Удалено лишних записей: ${removedCount}`;

                await this.showDialog('alert', msg);
                this.open(); // Возвращаемся в главное меню
            };
        },

        // Открытие менеджера аккаунтов (алиасов)
        openAliasManager: function() {
            if (this.overlay) { this.overlay.remove(); this.overlay = null; }
            this.createStyles(); // Ensure styles

            const settings = Storage.getSettings();

            this.overlay = document.createElement('div');
            this.overlay.className = 'slm-overlay';
            this.overlay.innerHTML = `
                <div class="slm-modal" style="height: 70vh;">
                    <div class="slm-header">
                        <span>Управление Аккаунтами (Никнеймы)</span>
                        <button class="slm-btn red" id="slm-close-alias">Закрыть</button>
                    </div>
                    <div class="slm-body">
                         <div style="padding:15px; background:#222; border-bottom:1px solid #333;">
                            <label style="display:flex; align-items:center; cursor:pointer; color:#ccc;">
                                <input type="checkbox" id="slm-setting-show-store" ${settings.showOwnersOnStore !== false ? 'checked' : ''} style="margin-right:10px; transform:scale(1.2);">
                                <span>Показывать информацию о владельцах на странице магазина Steam</span>
                            </label>
                         </div>
                         <div class="slm-table-container">
                            <table class="slm-table">
                                <thead>
                                    <tr>
                                        <th>Steam ID</th>
                                        <th>Отображаемое Имя</th>
                                        <th width="120">Действия</th>
                                    </tr>
                                </thead>
                                <tbody id="slm-tbody-alias"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            // Функция отрисовки списка аккаунтов
            const renderAliases = () => {
                const aliases = Storage.getAliases();
                const tbody = document.getElementById('slm-tbody-alias');
                let html = '';
                Object.keys(aliases).forEach(id => {
                    html += `<tr>
                        <td style="color:#888; font-size:11px;">${id}</td>
                        <td>
                            <input type="text" value="${aliases[id]}" class="slm-input-dark" data-id="${id}">
                        </td>
                        <td>
                            <button class="slm-btn small red del-alias-btn" data-id="${id}">Удалить</button>
                        </td>
                    </tr>`;
                });

                if (Object.keys(aliases).length === 0) {
                    html = `<tr><td colspan="3" style="text-align:center; padding:20px; color:#666;">Список пуст.</td></tr>`;
                }

                tbody.innerHTML = html;

                // Привязка обработчиков удаления
                tbody.querySelectorAll('.del-alias-btn').forEach(btn => {
                    btn.onclick = async (e) => {
                        if (await UI.showDialog('confirm', 'Забыть этот аккаунт?')) {
                            Storage.deleteAlias(e.target.dataset.id);
                            renderAliases();
                        }
                    };
                });

                // Привязка обработчиков изменения имени
                tbody.querySelectorAll('input').forEach(inp => {
                    inp.onchange = (e) => {
                         Storage.setAlias(e.target.dataset.id, e.target.value);
                    };
                });

                // Обработчик настройки отображения в магазине
                const chkStore = document.getElementById('slm-setting-show-store');
                if (chkStore) {
                    chkStore.onchange = (e) => {
                        const s = Storage.getSettings();
                        s.showOwnersOnStore = e.target.checked;
                        Storage.saveSettings(s);
                    };
                }
            };

            renderAliases();

            document.getElementById('slm-close-alias').onclick = () => {
                this.overlay.remove();
                this.overlay = null;
                this.open();
            };
        },

        // Инъекция CSS стилей на страницу
        createStyles: function() {
            if (document.getElementById('slm-styles')) return;
            const css = `
                .slm-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; display:flex; justify-content:center; align-items:center; }
                .slm-modal { background:#1b2838; width:900px; height:80vh; display:flex; flex-direction:column; border:1px solid #66c0f4; box-shadow:0 0 20px #000; color:#c6d4df; font-family:Arial, sans-serif; }
                .slm-header { padding:10px 15px; background:#171a21; border-bottom:1px solid #000; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:18px; }
                .slm-tabs { display:flex; background:#2a475e; border-bottom:1px solid #000; }
                .slm-tab { flex:1; padding:10px; background:none; border:none; color:#8f98a0; cursor:pointer; font-weight:bold; }
                .slm-tab.active { background:#1b2838; color:#fff; border-top:2px solid #66c0f4; }
                .slm-body { flex-grow:1; display:flex; flex-direction:column; overflow:hidden; }
                .slm-toolbar { padding:10px; background:#212e3f; display:flex; gap:10px; border-bottom:1px solid #000; align-items:center; }
                .slm-footer { padding:10px; background:#171a21; border-top:1px solid #000; display:flex; justify-content:flex-end; }
                .slm-table-container { flex-grow:1; overflow-y:auto; }
                .slm-table { width:100%; border-collapse:collapse; }
                .slm-table th { position:sticky; top:0; background:#171a21; padding:10px; text-align:left; color:#fff; z-index:10; }
                .slm-table td { padding:8px; border-bottom:1px solid #333; }
                .slm-btn { background:#66c0f4; color:#fff; border:none; padding:5px 15px; cursor:pointer; border-radius:2px; font-size:12px; }
                .slm-btn:hover { background:#1999ff; }
                .slm-btn:disabled { background:#333; color:#555; cursor:not-allowed; }
                .slm-btn.red { background:#a00; }
                .slm-btn.green { background:#4caf50; }
                .slm-btn.orange { background:#e6a23c; color:#000; }
                .slm-btn.small { padding:3px 10px; font-size:11px; }
                .slm-btn.large { padding:10px 30px; font-size:14px; font-weight:bold; }
                .slm-log-box { background:#000; border:1px solid #333; height:200px; overflow-y:auto; padding:10px; font-family:monospace; font-size:12px; margin-top:10px; }
                .slm-progress-bg { height:20px; background:#111; margin-top:5px; border:1px solid #444; }
                .slm-progress-bar { height:100%; width:0%; background:#66c0f4; transition:width 0.2s; }
                .slm-status-box { background:#222; padding:10px; border:1px solid #444; border-radius:3px; }
                .slm-chk, .slm-chk-scan { transform: scale(1.2); cursor: pointer; }
                .slm-tag { background:#101010; border:1px solid #333; padding:2px 5px; border-radius:3px; font-size:10px; margin-right:3px; display:inline-block; }
                .slm-input-dark { background:#000; color:#fff; border:1px solid #444; padding:3px; width:100%; }
            `;
            const style = document.createElement('style');
            style.id = 'slm-styles';
            style.textContent = css;
            document.head.appendChild(style);
        },

        // Привязка основных событий UI
        bindEvents: function() {
            // Закрытие окна
            document.getElementById('slm-close').onclick = () => {
                if (this.isProcessing) return this.showDialog('alert', 'Процесс запущен. Нажмите СТОП перед закрытием.');
                this.overlay.remove();
                this.overlay = null;
            };

            // Переключение вкладок
            document.querySelectorAll('.slm-tab').forEach(t => t.onclick = (e) => {
                if (this.isProcessing) return this.showDialog('alert', 'Процесс выполняется. Переключение вкладок заблокировано.');

                document.querySelectorAll('.slm-tab').forEach(x => x.classList.remove('active'));
                document.querySelectorAll('.slm-body').forEach(x => x.style.display = 'none');
                e.target.classList.add('active');
                document.getElementById('tab-' + e.target.dataset.tab).style.display = 'flex';

                // При любом переключении вкладок (вход в Процесс или выход в БД)
                // сбрасываем режим в "Скрытие". Это гарантирует, что вкладка переименуется обратно,
                // если мы ушли с "Восстановления".
                const logBox = document.getElementById('proc-log');
                if (logBox) logBox.innerHTML = '';
                this.setProcessMode('hide');
            });

            // Сортировка по клику на заголовки
            document.querySelectorAll('.slm-sort-header').forEach(th => {
                th.onclick = (e) => {
                    const field = e.currentTarget.dataset.sort;

                    if (field === 'owners') {
                        // ЛОГИКА ДЛЯ КОЛОНКИ "ВЛАДЕЛЬЦЫ": ТУМБЛЕР ПРИОРИТЕТА
                        this.prioritizeMyGames = !this.prioritizeMyGames;
                    } else {
                        // ЛОГИКА ОБЫЧНОЙ СОРТИРОВКИ (AppID, Name)
                        if (this.sortField === field) {
                            this.sortDir *= -1; // Инверсия
                        } else {
                            this.sortField = field;
                            this.sortDir = 1;   // Сброс на "по умолчанию"
                        }
                    }
                    this.renderDB();
                };
            });

            // "Выбрать все" чекбокс (Master) - ЛОГИКА ИЗМЕНЕНА
            document.getElementById('slm-chk-master').onclick = (e) => {
                // Определяем текущий (видимый) список
                let currentList;

                // 1. Выбираем источник (Все или Locked)
                if (this.showSelectedOnly) {
                   currentList = [...this.lockedViewList];
                } else {
                   currentList = Storage.toArray();
                }

                // 2. Применяем фильтр "Скрытые", если он активен
                if (this.showHiddenOnly) {
                    currentList = currentList.filter(g => {
                        const realEntry = Storage.getDB()[g.appid];
                        return realEntry && realEntry.h && realEntry.h.includes(this.currentSteamID);
                    });
                }

                // ВАЖНО: Сортировка не меняет набор элементов, только порядок.
                // Поэтому для "выделить все на странице" нам нужно знать порядок.
                // Вызовем сортировку локально.
                // Используем поверхностную копию [...currentList], чтобы не мутировать исходный lockedViewList или кэш Storage
                const sortedList = [...currentList];
                this.sortList(sortedList);

                // Определяем текущие видимые элементы на странице
                const startIdx = (this.dbPage - 1) * this.dbLimit;
                const visibleItems = sortedList.slice(startIdx, startIdx + this.dbLimit);

                if (e.target.checked) {
                    // Добавляем видимые в выделение
                    visibleItems.forEach(g => this.selection.add(String(g.appid)));
                } else {
                    // Убираем видимые из выделения
                    visibleItems.forEach(g => this.selection.delete(String(g.appid)));
                }
                this.renderDB();
            };

            // Удаление выбранных
            document.getElementById('slm-delete-sel').onclick = async () => {
                const count = this.selection.size;
                if (count === 0) return this.showDialog('alert', 'Ничего не выбрано!');
                if (await this.showDialog('confirm', `Удалить ${count} игр из базы?`)) {
                    const ids = Array.from(this.selection);
                    Storage.deleteGames(ids);

                    // Sync Locked View: Если мы в режиме "Selected Only", удаленные игры должны исчезнуть и оттуда.
                    if (this.showSelectedOnly && this.lockedViewList.length > 0) {
                        this.lockedViewList = this.lockedViewList.filter(g => !ids.includes(String(g.appid)));
                    }

                    this.selection.clear(); // Сброс выделения после удаления

                    // Если список стал пустым, можно выйти из режима, но лучше просто обновить
                    if (this.showSelectedOnly && this.lockedViewList.length === 0) {
                        // Опционально: this.showSelectedOnly = false;
                    }

                    this.renderDB();
                }
            };

            // Кнопки панели управления
            document.getElementById('slm-aliases').onclick = () => this.openAliasManager();

            // Кнопка "Мои игры"
            document.getElementById('slm-open-my-games').onclick = () => {
                const id = this.currentSteamID || User.getID();
                if (id) {
                    window.open(`https://steamcommunity.com/profiles/${id}/games/?tab=all`, '_self');
                } else {
                    this.showDialog('alert', 'Не удалось определить ваш SteamID. Залогиньтесь.');
                }
            };

            document.getElementById('slm-wipe').onclick = async () => { if(await this.showDialog('confirm', 'Это полностью очистит базу. Продолжить?')) { Storage.clearDB(); this.renderDB(); } };

            // Фильтр "Скрытые" (Комбинируемый)
            document.getElementById('slm-filter-hidden').onclick = () => {
                this.showHiddenOnly = !this.showHiddenOnly;
                this.dbPage = 1;
                this.renderDB();
            };

            // Кнопка "Вернуть" (Unhide)
            document.getElementById('slm-btn-unhide').onclick = async () => {
                const count = this.selection.size;
                if (count === 0) return this.showDialog('alert', 'Ничего не выбрано!');

                // Фильтруем только те игры, которые реально скрыты (имеют флаг 'h' для текущего юзера),
                // чтобы не спамить API запросами для игр, которые уже открыты или просто есть в базе.
                const db = Storage.getDB();
                const rawQueue = Array.from(this.selection);
                const filteredQueue = rawQueue.filter(aid => {
                   const entry = db[aid];
                   return entry && entry.h && entry.h.includes(this.currentSteamID);
                });

                if (filteredQueue.length === 0) {
                     return this.showDialog('alert', 'Выбранные игры не числятся скрытыми в базе скрипта для вашего аккаунта.');
                }

                // Убрали диалог. Сразу переключаем режим.
                // По умолчанию используется текущее значение this.unhideType (Full или DB Only)
                this.processQueue = filteredQueue;

                // Переключаем UI вручную (без клика по табу, чтобы не сработал сброс в 'hide')
                const tabDb = document.querySelector('.slm-tab[data-tab="db"]');
                const tabProc = document.querySelector('.slm-tab[data-tab="process"]');
                const bodyDb = document.getElementById('tab-db');
                const bodyProc = document.getElementById('tab-process');

                if(tabDb) tabDb.classList.remove('active');
                if(bodyDb) bodyDb.style.display = 'none';

                if(tabProc) tabProc.classList.add('active');
                if(bodyProc) bodyProc.style.display = 'flex';

                // Устанавливаем режим восстановления
                this.setProcessMode('unhide');

                // Очищаем и пишем лог
                const logBox = document.getElementById('proc-log');
                if (logBox) logBox.innerHTML = '';
                this.log(`Подготовлено к восстановлению: ${filteredQueue.length} игр (из ${count} выбранных).`, '#66c0f4');
                if (filteredQueue.length < count) {
                     this.log(`ℹ️ Пропущено ${count - filteredQueue.length} игр, так как они не были скрыты.`, '#888');
                }
                this.log(`Режим по умолчанию: Полное восстановление (Steam + БД)`, '#aaa');
                this.log(`Нажмите "ЗАПУСТИТЬ", чтобы начать.`, '#4caf50');
            };

            document.getElementById('slm-export').onclick = () => this.exportJSON(Storage.getDB());

            // Обработчик Слияния (Merge)
            document.getElementById('slm-merge').onclick = () => this.importJSON(async (data) => {
                const res = Storage.mergeDB(data);
                Storage.forceSync(); // Сохраняем сразу
                await this.showDialog('alert', `Слияние завершено.\n\nДобавлено новых игр: ${res.added}\nОбновлено записей: ${res.updated}`);
                this.renderDB(); // Обновляем таблицу
                // Если мы добавили новые игры или владельцев, нужно обновить статус в шапке
                if (res.updated > 0 || res.added > 0) {
                    this.open();
                }
            });

            document.getElementById('slm-import').onclick = () => this.importJSON(async (data) => {
                if (Storage.saveDB(data)) {
                    Storage.forceSync(); // Принудительно сохраняем данные на диск
                    await this.showDialog('alert', 'Импорт успешен. Интерфейс будет перезагружен.');
                    this.open(); // Полный перезапуск UI для обновления статистики в шапке
                }
            });

            // Изменение лимита на странице
            document.getElementById('slm-per-page').onchange = (e) => {
                let val = parseInt(e.target.value);
                if (val < 1) val = 1;
                this.dbLimit = val;
                this.dbPage = 1; // Сброс на первую страницу
                this.renderDB();
            };

            // Загрузка и сохранение настроек
            const settings = Storage.getSettings();

            // Настройка Задержки
            const delayInput = document.getElementById('slm-setting-delay');
            if (delayInput) {
                delayInput.value = settings.reqDelay;
                delayInput.onchange = (e) => {
                    let val = parseInt(e.target.value);
                    if (val < 100) val = 100;
                    settings.reqDelay = val;
                    Storage.saveSettings(settings);
                };
            }

            // Настройка Heavy Scan
            const heavyInput = document.getElementById('slm-setting-heavy');
            if (heavyInput) {
                // Если настройка не задана (старая версия), считаем её true
                heavyInput.checked = (settings.allowHeavyScan !== undefined) ? settings.allowHeavyScan : true;
                heavyInput.onchange = (e) => {
                    settings.allowHeavyScan = e.target.checked;
                    Storage.saveSettings(settings);
                };
            }

            // Обработчик смены режима восстановления "на лету"
            const unhideSelect = document.getElementById('slm-unhide-type-select');
            if (unhideSelect) {
                unhideSelect.onchange = (e) => {
                    this.unhideType = e.target.value;
                    // Обновляем описание алгоритма, так как оно зависит от типа
                    this.setProcessMode('unhide');
                };
            }

            // Кнопки управления процессом
            document.getElementById('slm-start').onclick = () => this.startProcessing();
            document.getElementById('slm-stop').onclick = () => { this.stopProcessing = true; };

            // --- ГЛОБАЛЬНОЕ ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ТАБЛИЦЫ ---
            const tbody = document.getElementById('slm-tbody-db');
            if(tbody) {
                tbody.onclick = (e) => {
                    const target = e.target;

                // 1. Чекбокс выбора строки
                    if (target.classList.contains('slm-chk')) {
                        const val = String(target.value);
                        if (target.checked) this.selection.add(val);
                        else this.selection.delete(val);
                        // НЕ перерисовываем всю таблицу HTML (renderDB).
                        // Обновляем только UI элементы, зависящие от выделения (Счетчик, Бар, Мастер-чекбокс).
                        this.updateSelectionUI();
                        return;
                    }

                    // 2. Кнопка добавления владельца (+)
                    if (target.classList.contains('add-owner-btn')) {
                         const appid = target.dataset.appid;
                         this.openOwnerEditor(appid);
                         return;
                    }
                };
            }
        },

        // Вспомогательный метод получения SessionID (Store)
        // Работает и на Store, и на Community (через XHR)
        getSessionID: async function() {
            // 1. Если мы уже на домене магазина, берем глобальную переменную
            if (location.hostname === 'store.steampowered.com') {
                if (typeof g_sessionID !== 'undefined') return g_sessionID;
            }

            // 2. Универсальный поиск в Cookie (обычно работает везде, если logged in)
            const match = document.cookie.match(/sessionid=([a-zA-Z0-9]+)/);
            if (match) return match[1];

            // 3. Если куки нет (странно), или мы на Community и хотим убедиться
            // Пробуем запрос к магазину, чтобы вытащить ID из HTML
            try {
                this.log('🌍 Получение SessionID магазина через XHR...', '#aaa');
                return await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://store.steampowered.com/",
                        timeout: 10000,
                        onload: (res) => {
                             if (res.status === 200) {
                                const m = res.responseText.match(/g_sessionID\s*=\s*"(.+?)"/);
                                if (m) resolve(m[1]);
                                else reject("g_sessionID не найден в ответе магазина");
                            } else reject(`Ошибка Store: ${res.status}`);
                        },
                        onerror: (err) => reject(err),
                        ontimeout: () => reject("Таймаут")
                    });
                });
            } catch (e) {
                console.error(e);
                return null;
            }
        },

        // Установка режима интерфейса процесса
        setProcessMode: function(mode) {
            this.processMode = mode;
            const title = document.getElementById('slm-proc-title');
            const desc = document.getElementById('slm-proc-text');
            const btn = document.getElementById('slm-start');
            const log = document.getElementById('proc-log');

            // Элементы для обновления заголовков и настроек
            const tabBtn = document.querySelector('.slm-tab[data-tab="process"]');
            const paramsTitle = document.getElementById('slm-params-title');

            const boxHide = document.getElementById('slm-settings-hide');
            const boxUnhide = document.getElementById('slm-settings-unhide');
            const tooltipDelay = document.getElementById('slm-tooltip-delay');

            // Синхронизация галочки Heavy Scan при переключении табов
            const heavyInput = document.getElementById('slm-setting-heavy');
            if (heavyInput) {
                 const currentSettings = Storage.getSettings();
                 heavyInput.checked = currentSettings.allowHeavyScan || false;
            }

            if (mode === 'unhide') {
                if (tabBtn) tabBtn.textContent = "Восстановление";
                if (paramsTitle) paramsTitle.textContent = "Параметры восстановления";

                // Переключение видимости специфичных настроек
                if (boxHide) boxHide.style.display = 'none';
                if (boxUnhide) {
                    boxUnhide.style.display = 'block';
                    // Синхронизируем селект с текущим состоянием
                    const sel = document.getElementById('slm-unhide-type-select');
                    if (sel) sel.value = this.unhideType;
                }

                // Обновление подсказки для задержки (контекст восстановления)
                if (tooltipDelay) tooltipDelay.title = "Интервал между запросами к Steam API при восстановлении.\n\nНужен, чтобы Steam не заблокировал вас за 'флуд' при массовом возврате игр.";

                title.textContent = "Режим: Восстановление игр (Unhide)";
                title.style.color = '#e6a23c';

                // Подробное описание алгоритма восстановления
                desc.innerHTML = `
                    <p>Скрипт последовательно обрабатывает очередь (${this.processQueue.length} шт.):</p>
                    <ol style="padding-left:20px; margin:5px 0;">
                        <li style="margin-bottom:5px;">
                            <b>API Steam:</b> Отправка запроса "Remove from Ignore".<br>
                            <span style="color:${this.unhideType === 'full' ? '#4caf50' : '#888'};">👉 ${this.unhideType === 'full' ? 'ACTION: RESTORE' : 'SKIP (Режим БД)'}</span>
                        </li>
                        <li style="margin-bottom:5px;">
                            <b>Локальная База:</b> Удаление метки "Скрыто" у игры.<br>
                            <span style="color:#66c0f4;">👉 ACTION: CLEAR FLAG</span>
                        </li>
                        <li>
                            <b>Результат:</b> ${this.unhideType === 'full' ? 'Игра снова появится в рекомендациях магазина.' : 'Скрипт "забудет" игру. В Steam она останется скрытой.'}
                        </li>
                    </ol>
                `;

                btn.textContent = "ЗАПУСТИТЬ ВОССТАНОВЛЕНИЕ";
                btn.classList.remove('green');
                btn.classList.add('orange');
            } else {
                // Default Hide Mode
                if (tabBtn) tabBtn.textContent = "Скрытие";
                if (paramsTitle) paramsTitle.textContent = "Параметры скрытия";

                // Переключение видимости специфичных настроек
                if (boxHide) boxHide.style.display = 'block';
                if (boxUnhide) boxUnhide.style.display = 'none';

                // Обновление подсказки для задержки (контекст скрытия)
                if (tooltipDelay) tooltipDelay.title = "Интервал между запросами к серверу Steam.\n\nЗачем нужно:\nSteam блокирует доступ (Ошибка 429), если отправлять запросы слишком часто.\n\nКогда используется:\nПри автоматической проверке списка игр в цикле скрытия.";

                title.textContent = "Алгоритм работы (Скрытие)";
                title.style.color = '#66c0f4';

                desc.innerHTML = `
                    <p>Скрипт проверяет игры из <b>Единой Базы</b> по четырем критериям:</p>
                    <ol style="padding-left:20px; margin:5px 0;">
                        <li style="margin-bottom:5px;">
                            <b>Локальная База:</b> Если вы отмечены как владелец вручную.<br>
                            <span style="color:#4caf50;">👉 SKIP (База)</span>
                        </li>
                        <li style="margin-bottom:5px;">
                            <b>API Steam:</b> Проверка по списку всех ваших лицензий (быстро).<br>
                            <span style="color:#4caf50;">👉 SKIP (В библиотеке/Кэш)</span>
                        </li>
                        <li style="margin-bottom:5px;">
                            <b>История:</b> Если игра уже была скрыта скриптом ранее.<br>
                            <span style="color:#888;">👉 SKIP (Уже скрыто)</span>
                        </li>
                        <li>
                            <b>Иначе:</b> Игра отправляется в "Скрытое".<br>
                            <span style="color:#66c0f4;">👉 ACTION: HIDDEN</span>
                        </li>
                    </ol>
                    <div style="font-size:11px; color:#aaa; margin-top:10px; border-top:1px solid #333; padding-top:5px;">
                        <i>Примечание: Ошибки API (400) теперь автоматически пропускаются и помечаются как скрытые.</i>
                    </div>
                `;

                btn.textContent = "ЗАПУСТИТЬ ПРОВЕРКУ";
                btn.classList.add('green');
                btn.classList.remove('orange');
                this.processQueue = [];
            }

            // Сброс прогрессбара
            document.getElementById('proc-bar').style.width = '0%';
            document.getElementById('proc-status').textContent = 'Ожидание...';
        },

        // Вспомогательная функция сортировки
        sortList: function(list) {
            list.sort((a, b) => {
                // 1. ПРИОРИТЕЗАЦИЯ (Если включена)
                // Сначала проверяем, включен ли режим "Мои сверху"
                if (this.prioritizeMyGames) {
                    const hasA = a.owners.includes(this.currentSteamID) ? 1 : 0;
                    const hasB = b.owners.includes(this.currentSteamID) ? 1 : 0;

                    if (hasA !== hasB) {
                        return hasB - hasA; // Сначала те, что есть (1), потом те, что нет (0)
                    }
                }

                // 2. ОСНОВНАЯ СОРТИРОВКА (AppID или Name)
                let val = 0;
                if (this.sortField === 'name') {
                    // Строковая (алфавитная)
                    val = a.name.localeCompare(b.name);
                } else {
                    // По умолчанию AppID (Числовая)
                    val = parseInt(a.appid) - parseInt(b.appid);
                }

                return val * this.sortDir;
            });
        },

        // Оптимизированное обновление UI выделения (без рендера таблицы)
        updateSelectionUI: function() {
            // Чтобы понять состояние Master Checkbox, нам нужно знать, что СЕЙЧАС отображается.
            // Берем результат из последнего рендера (из кэша renderCache)
            // Это безопасно, так как клик по чекбоксу не меняет порядок или фильтр списка, только selection set.
            if (!this.renderCache || !this.renderCache.result) return;

            const fullList = this.renderCache.result;
            const startIdx = (this.dbPage - 1) * this.dbLimit;
            const displayList = fullList.slice(startIdx, startIdx + this.dbLimit);

            // 1. Проверяем, все ли видимые элементы выделены
            const allVisibleSelected = displayList.length > 0 && displayList.every(g => this.selection.has(String(g.appid)));
            const someVisibleSelected = !allVisibleSelected && displayList.some(g => this.selection.has(String(g.appid)));

            const masterChk = document.getElementById('slm-chk-master');
            if(masterChk) {
                masterChk.checked = allVisibleSelected;
                masterChk.indeterminate = someVisibleSelected;
            }

            // 2. Обновляем бар выделения
            const selCount = this.selection.size;
            const selBar = document.getElementById('slm-selection-bar');

            if (selBar) {
                if (selCount > 0) {
                     selBar.style.display = 'flex';
                     if (this.showSelectedOnly) selBar.style.background = '#2a475e';
                     else selBar.style.background = (allVisibleSelected) ? '#3a2e16' : '#222';

                     // Всегда пересоздаем HTML, чтобы отображать/скрывать кнопку "Выбрать вообще всё"
                     let html = `<span>Выделено: <b>${selCount}</b></span>`;

                     // 1. Кнопка переключения вида (Посмотреть выделенное)
                     if (this.showSelectedOnly) {
                         html += `<a href="#" id="slm-toggle-view" style="color:#fff; margin-left:15px; text-decoration:underline;">[ Показать всё ]</a>`;
                     } else {
                         html += `<a href="#" id="slm-toggle-view" style="color:#66c0f4; margin-left:15px; font-weight:bold; text-decoration:underline;">[ Посмотреть выделенное ]</a>`;
                     }

                     // 2. Кнопка сброса (Снять все)
                     html += `<a href="#" id="slm-sel-clear" style="color:#aaa; margin-left:10px; text-decoration:underline; font-size:11px;">(Снять все)</a>`;

                     // 3. Глобальное действие "Выбрать вообще все" (через разделитель)
                     if (selCount < fullList.length) {
                         html += `<span style="margin:0 10px; color:#555;">|</span>`;

                         // Если выбраны все видимые на странице (мастер-чекбокс), добавляем пояснение
                         if (allVisibleSelected) {
                             html += `<span style="color:#888; font-size:11px; margin-right:5px;">Выбраны все на стр.</span>`;
                         }

                         html += `<a href="#" id="slm-sel-all-global" style="color:#fff; text-decoration:underline; margin-left:5px;">Выбрать вообще все (${fullList.length})</a>`;
                     }

                     selBar.innerHTML = html;

                     // Re-bind (так как пересоздали HTML)
                     const btnAllGlobal = selBar.querySelector('#slm-sel-all-global');
                     if(btnAllGlobal) btnAllGlobal.onclick = (e) => {
                         e.preventDefault();
                         // Добавляем все ID из текущего отфильтрованного списка (fullList)
                         fullList.forEach(g => this.selection.add(String(g.appid)));
                         this.renderDB(); // Полный ререндер для обновления галочек
                     };

                     const btnToggle = selBar.querySelector('#slm-toggle-view');
                     if(btnToggle) btnToggle.onclick = (e) => {
                         e.preventDefault();
                             if (!this.showSelectedOnly) {
                                  const dbAll = Storage.toArray();
                                  this.lockedViewList = dbAll.filter(g => this.selection.has(String(g.appid)));
                                  if (this.lockedViewList.length === 0) return;
                             } else {
                                  this.lockedViewList = [];
                             }
                             this.showSelectedOnly = !this.showSelectedOnly;
                             this.dbPage = 1;
                             this.renderDB();
                         };

                         const btnClear = selBar.querySelector('#slm-sel-clear');
                         if(btnClear) btnClear.onclick = (e) => {
                             e.preventDefault();
                             this.selection.clear();
                             if(this.showSelectedOnly) { this.showSelectedOnly = false; }
                             this.renderDB();
                         };
                } else {
                     selBar.style.display = 'none';
                     // Если сбросили всё в ноль, и были в режиме SelectedOnly - надо выйти
                     if (this.showSelectedOnly) {
                         this.showSelectedOnly = false;
                         this.renderDB();
                     }
                }
            }
        },

        // Отрисовка главной таблицы базы данных
        renderDB: function() {
            // 1. Выбираем источник данных
            // В режиме "Selected Only" используем зафиксированный список lockedViewList
            // Это позволяет взаимодействовать с ним (сортировать/листать) как с отдельным датасетом
            let list = this.showSelectedOnly ? this.lockedViewList : Storage.toArray();

            // 2. Формируем "хэши" состояний для проверки кэша UI
            // Добавляем showSelectedOnly в хэш, так как теперь это просто еще один фильтр
            const currentFilterHash = `hidden:${this.showHiddenOnly}|selected:${this.showSelectedOnly}`;
            const currentSortHash = `field:${this.sortField}|dir:${this.sortDir}|prio:${this.prioritizeMyGames}`;

            // 3. Проверяем валидность кэша UI
            if (this.renderCache.sourceRef === list && // SourceRef теперь всегда Storage.toArray()
                this.renderCache.filterHash === currentFilterHash &&
                this.renderCache.sortHash === currentSortHash &&
                this.renderCache.result) {
                // Cache Hit
            } else {
                // Cache Miss - Pipeline обработки
                let processedList = list;

                // A. Фильтр "Показать выделенное"
                // Если мы берем lockedViewList, то фильтр по selection уже не нужен (он пре-фильтрован).
                // Но если вдруг selection изменился (сняли галочку), lockedViewList все равно содержит элементы.
                // Поэтому тут ничего не делаем, если showSelectedOnly=true, так как sourceRef уже filtered.
                if (this.showSelectedOnly) {
                     // processedList уже равен lockedViewList
                } else {
                     // Обычный режим - тут фильтра "Selected Only" нет, он теперь делается на уровне выбора источника (см пункт 1)
                     // Старый код фильтровал dynamic, теперь source статический.
                }

                // B. Фильтр "Показать скрытые"
                if (this.showHiddenOnly) {
                    processedList = processedList.filter(g => {
                        const realEntry = Storage.getDB()[g.appid];
                        return realEntry && realEntry.h && realEntry.h.includes(this.currentSteamID);
                    });
                }

                // COPY перед сортировкой (на всякий случай, хотя filter уже создал новый массив)
                // Но если фильтров не было (оба false), processedList === list, который нельзя мутировать.
                if (processedList === list) {
                     processedList = [...list];
                }

                // C. Сортировка
                this.sortList(processedList);

                // Сохраняем в кэш
                this.renderCache = {
                    sourceRef: list,
                    filterHash: currentFilterHash,
                    sortHash: currentSortHash,
                    result: processedList
                };
            }

            // Берем результат из кэша
            const displayListFull = this.renderCache.result; // Весь отфильтрованный и отсортированный список (для пагинации)

            const totalItems = displayListFull.length;

            // Сбрасываем страницу, если она вышла за пределы (например, при включении фильтра)
            const totalPages = Math.ceil(totalItems / this.dbLimit) || 1;
            if (this.dbPage > totalPages) this.dbPage = 1;

            const startIdx = (this.dbPage - 1) * this.dbLimit;
            const displayList = displayListFull.slice(startIdx, startIdx + this.dbLimit);

            const tbody = document.getElementById('slm-tbody-db');
            const pagContainer = document.getElementById('slm-pagination');
            const masterChk = document.getElementById('slm-chk-master');
            const selBar = document.getElementById('slm-selection-bar');

            if(!tbody || !pagContainer) return;

            // Обновление кнопок фильтров (Визуал)
            const btnHidden = document.getElementById('slm-filter-hidden');
            const btnUnhide = document.getElementById('slm-btn-unhide');
            if (btnHidden) {
                 if (this.showHiddenOnly) {
                     btnHidden.style.background = '#e6a23c';
                     btnHidden.style.color = '#000';
                     btnUnhide.style.display = 'inline-block';
                 } else {
                     btnHidden.style.background = '';
                     btnHidden.style.color = '';
                     btnUnhide.style.display = 'none';
                 }
            }

            // Обновление иконок сортировки в заголовке
            ['appid', 'name'].forEach(f => {
                const icon = document.getElementById(`sort-icon-${f}`);
                if (icon) {
                    if (this.sortField === f) {
                        icon.textContent = this.sortDir === 1 ? '▲' : '▼'; // ▼ = убывание приоритета (для AppID это Asc 1->9? Обычно стрелка вниз = Asc, вверх = Desc, или наоборот. Сделаем интуитивно: 1 = ▼ (по порядку))
                        // Обычно ▲ (up) = Asc (A->Z, 0->9), ▼ (down) = Desc (Z->A, 9->0).
                        // У меня sortDir 1. AppID: a-b. Ascending. Значит ▲.
                        icon.style.color = '#66c0f4';
                    } else {
                        icon.textContent = '';
                    }
                }
            });

            // Индикатор для колонки "Владельцы"
            const ownerIcon = document.getElementById('sort-icon-owners');
            if (ownerIcon) {
                if (this.prioritizeMyGames) {
                    ownerIcon.textContent = '★'; // Закрашенная звезда (Активно)
                    ownerIcon.style.color = '#4caf50'; // Зеленый цвет
                    ownerIcon.title = "Приоритет: Ваши игры сверху";
                } else {
                    ownerIcon.textContent = '☆'; // Пустая звезда (Неактивно)
                    ownerIcon.style.color = '#666';
                    ownerIcon.title = "Без приоритета";
                }
            }

            // --- ЛОГИКА ВЫДЕЛЕНИЯ (Moved to updateSelectionUI) ---
            this.updateSelectionUI();

            let html = '';
            displayList.forEach(g => {
                const isMine = g.owners.includes(this.currentSteamID);
                const color = isMine ? '#4caf50' : '#888';
                // Приведение к String для корректной проверки
                const isChecked = this.selection.has(String(g.appid));

                // ВАЖНО: В режиме "Show Selected Only", если мы снимаем галочку, строка визуально остается (потому что мы рендерим lockedViewList),
                // но галочка снимается. Это желаемое поведение.

                let ownersHtml = '';

                // Сортировка: Сначала текущий пользователь, потом остальные
                const sortedOwners = [...g.owners].sort((a, b) => {
                    if (a === this.currentSteamID) return -1;
                    if (b === this.currentSteamID) return 1;
                    return 0;
                });

                sortedOwners.forEach(oid => {
                     const name = Storage.getDisplayName(oid);
                     const style = oid === this.currentSteamID ? 'border-color:#4caf50; color:#4caf50;' : '';
                     ownersHtml += `<span class="slm-tag" style="${style}" title="${oid}">${escapeHtml(name)}</span>`;
                });
                ownersHtml += `<button class="slm-btn small add-owner-btn" data-appid="${g.appid}" title="Добавить владельца">+</button>`;

                html += `
                    <tr>
                        <td><input type="checkbox" class="slm-chk" value="${g.appid}" ${isChecked ? 'checked' : ''}></td>
                        <td style="color:${color}">${g.appid}</td>
                        <td style="color:${color}">${escapeHtml(g.name)}</td>
                        <td>${ownersHtml}</td>
                    </tr>`;
            });

            if (displayList.length === 0) html = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#888;">Нет отображаемых элементов</td></tr>`;
            tbody.innerHTML = html;

            // --- ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ---
            // (Обработчики кликов теперь в bindEvents, здесь мы только генерируем HTML)


            // --- ГЕНЕРАЦИЯ ПАГИНАТОРА ---
            const renderPagHelper = () => {
                 let wrapper = document.getElementById('slm-pag-wrapper');
                 if (!wrapper) {
                     wrapper = document.createElement('div');
                     wrapper.id = 'slm-pag-wrapper';
                     wrapper.style.cssText = 'display:flex; align-items:center;';
                     wrapper.innerHTML = `
                        <div id="slm-pg-left" style="display:flex; gap:5px; width:70px; justify-content:flex-end; margin-right:25px;"></div>
                        <div id="slm-pg-center" style="display:flex; gap:5px; align-items:center; justify-content:center; width:380px;"></div>
                        <div id="slm-pg-right" style="display:flex; gap:5px; width:70px; justify-content:flex-start; margin-left:25px;"></div>
                        <span id="slm-pg-info" style="font-size:10px; color:#666; margin-left:15px;"></span>
                     `;
                     pagContainer.innerHTML = '';
                     pagContainer.appendChild(wrapper);
                 }

                 // Update Info
                 document.getElementById('slm-pg-info').textContent = `(Всего: ${totalItems})`;

                 // Helper for button creation
                 const createBtn = (text, page, disabled=false) => {
                     const btn = document.createElement('button');
                     btn.className = 'slm-btn small pg-btn';
                     btn.textContent = text;
                     btn.disabled = disabled;
                     btn.onclick = () => { this.dbPage = page; this.renderDB(); };
                     return btn;
                 };

                 // LEFT
                 const left = document.getElementById('slm-pg-left');
                 left.innerHTML = '';
                 left.appendChild(createBtn('<<', 1, this.dbPage <= 1));
                 left.appendChild(createBtn('<', this.dbPage - 1, this.dbPage <= 1));

                 // RIGHT
                 const right = document.getElementById('slm-pg-right');
                 right.innerHTML = '';
                 right.appendChild(createBtn('>', this.dbPage + 1, this.dbPage >= totalPages));
                 right.appendChild(createBtn('>>', totalPages, this.dbPage >= totalPages));

                 // CENTER
                 const center = document.getElementById('slm-pg-center');
                 // Preserve Input if it exists
                 let input = document.getElementById('slm-cur-page-input');
                 if (!input) {
                     input = document.createElement('input');
                     input.type = 'number';
                     input.id = 'slm-cur-page-input';
                     input.className = 'slm-input-dark';
                     input.style.cssText = 'width:40px; text-align:center; border:1px solid #66c0f4;';
                     input.onchange = (e) => {
                         let val = parseInt(e.target.value);
                         if (isNaN(val) || val < 1) val = 1;
                         if (val > totalPages) val = totalPages;
                         this.dbPage = val;
                         this.renderDB();
                     };
                     input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };
                     center.appendChild(input);
                 }

                 // Only update value if not focused to avoid interfering with typing
                 if (document.activeElement !== input) {
                    input.value = this.dbPage;
                 }

                 // Remove siblings to rebuild buttons around input
                 while (input.previousSibling) center.removeChild(input.previousSibling);
                 while (input.nextSibling) center.removeChild(input.nextSibling);

                 const insertBeforeInput = (node) => center.insertBefore(node, input);

                 if (this.dbPage > 3) {
                     insertBeforeInput(createBtn('1', 1));
                     if (this.dbPage > 4) {
                        const span = document.createElement('span'); span.style.color='#666'; span.textContent='...';
                        insertBeforeInput(span);
                     }
                 }
                 for (let p = Math.max(1, this.dbPage - 2); p < this.dbPage; p++) {
                     if (p === 1 && this.dbPage > 3) continue;
                     insertBeforeInput(createBtn(String(p), p));
                 }

                 // Insert After
                 for (let p = this.dbPage + 1; p <= Math.min(totalPages, this.dbPage + 2); p++) {
                     if (p === totalPages && this.dbPage < totalPages - 3) continue;
                     center.appendChild(createBtn(String(p), p));
                 }
                 if (this.dbPage < totalPages - 2) {
                     if (this.dbPage < totalPages - 3) {
                        const span = document.createElement('span'); span.style.color='#666'; span.textContent='...';
                        center.appendChild(span);
                     }
                     center.appendChild(createBtn(String(totalPages), totalPages));
                 }
            };

            renderPagHelper();
        },

        // Логгирование действий в окне процесса
        log: function(msg, color='#aaa') {
            // Пакетная отрисовка логов (Anti-Layout Thrashing).
            // Вместо 500 вставок в DOM за раз (что вешает браузер на Forced Reflow),
            // мы копим сообщения и вставляем их пачкой 1 раз за кадр.

            if (!this._logBuffer) this._logBuffer = [];

            this._logBuffer.push({
                time: new Date().toLocaleTimeString(),
                msg: msg,
                color: color
            });

            // Если рендер уже запланирован на этот кадр — просто ждем
            if (this._logRaf) return;

            this._logRaf = requestAnimationFrame(() => {
                const box = document.getElementById('proc-log');
                if (!box) {
                    this._logBuffer = [];
                    this._logRaf = null;
                    return;
                }

                // Используем DocumentFragment для единственной вставки в DOM
                const fragment = document.createDocumentFragment();
                this._logBuffer.forEach(item => {
                    const line = document.createElement('div');
                    line.innerHTML = `<span style="color:#555">[${item.time}]</span> <span style="color:${item.color}">${item.msg}</span>`;
                    fragment.appendChild(line);
                });

                box.appendChild(fragment);

                // Самая дорогая операция (чтение scrollHeight вызывает немедленный Reflow).
                // Теперь она выполняется 1 раз за пачку, а не 500 раз.
                box.scrollTop = box.scrollHeight;

                this._logBuffer = [];
                this._logRaf = null;
            });
        },

        // Экспорт базы в JSON файл (Download)
        exportJSON: function(data) {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], {type: "application/json"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `steam_lib_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        },

        // Импорт базы из JSON файла (Upload)
        importJSON: function(callback) {
            // Создаем скрытый input для выбора файла
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            document.body.appendChild(input);

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    document.body.removeChild(input);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const j = JSON.parse(event.target.result);
                        const keys = Object.keys(j);
                        // Простая проверка валидности структуры (проверяем наличие поля 'o' - owners у первого элемента)
                        if (keys.length > 0 && j[keys[0]].o) {
                            callback(j);
                        } else {
                            this.showDialog('alert', 'Неверный формат файла базы (v5)!');
                        }
                    } catch (err) {
                        this.showDialog('alert', 'Ошибка чтения JSON файла!');
                        console.error(err);
                    }
                    document.body.removeChild(input);
                };
                reader.readAsText(file);
            };

            input.click();
        },

        // ОСНОВНАЯ ФУНКЦИЯ: Запуск процесса (Диспетчер)
        startProcessing: async function() {
            if (this.isProcessing) return;
            this.currentSteamID = User.getID();
            if (!this.currentSteamID) return this.showDialog('alert', 'Ошибка: Нет SteamID.');

            // Если режим восстановления - запускаем его ветку
            if (this.processMode === 'unhide') {
                return this.runUnhideLoop();
            }

            const dbArray = Storage.toArray();
            if (dbArray.length === 0) return this.showDialog('alert', 'База пуста.');

            // Получаем настройки
            const settings = Storage.getSettings();
            // Используем константу REQUEST_DELAY вместо хардкода 600 как фолбэк
            const currentDelay = settings.reqDelay || REQUEST_DELAY;
            const allowHeavyScan = settings.allowHeavyScan || false;

            // Получение SessionID через унифицированный метод
            const sessionID = await this.getSessionID();
            if (!sessionID) return this.showDialog('alert', 'Не удалось получить SessionID магазина. Попробуйте обновить страницу.');

            // Настройка UI перед стартом
            this.isProcessing = true;
            this.stopProcessing = false;
            document.getElementById('slm-start').disabled = true;
            document.getElementById('slm-stop').disabled = false;

            this.log(`🚀 ЗАПУСК для ${Storage.getDisplayName(this.currentSteamID)}`, '#fff');

            // --- ПОЛУЧЕНИЕ СПИСКА КУПЛЕННЫХ ИГР ОДНИМ ЗАПРОСОМ ---
            // Вместо того чтобы парсить страницу каждой игры (Self-DDoS), мы запрашиваем список всех владений аккаунта.
            // API: https://store.steampowered.com/dynamicstore/userdata/
            let ownedAppsSet = new Set();
            try {
                // ЯВНОЕ ОБНОВЛЕНИЕ СТАТУСА ПЕРЕД ЗАПРОСОМ
                document.getElementById('proc-status').textContent = 'Загрузка данных аккаунта...';
                this.log('⏳ Получение списка игр аккаунта...', '#aaa');

                const userData = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://store.steampowered.com/dynamicstore/userdata/",
                        timeout: 10000,
                        onload: (res) => {
                            if (res.status === 200) {
                                try { resolve(JSON.parse(res.responseText)); }
                                catch (e) { reject("JSON Parse Error"); }
                            } else reject(`Status ${res.status}`);
                        },
                        onerror: (err) => reject(err),
                        ontimeout: () => reject("Timeout")
                    });
                });

                if (userData && userData.rgOwnedApps && Array.isArray(userData.rgOwnedApps)) {
                     userData.rgOwnedApps.forEach(id => ownedAppsSet.add(parseInt(id)));
                     this.log(`✅ Загружен список владений: ${ownedAppsSet.size} игр.`, '#4caf50');

                     // Синхронизация уже скрытых игр из Steam (rgIgnoredApps)
                     // Это позволяет пропустить игры, которые вы скрыли вручную или в прошлых сессиях,
                     // даже если локальная база была очищена или рассинхронизирована.
                     if (userData.rgIgnoredApps && typeof userData.rgIgnoredApps === 'object') {
                         let syncedCount = 0;
                         // rgIgnoredApps приходит как объект { "appid": 1, ... }
                         Object.keys(userData.rgIgnoredApps).forEach(ignoreAppId => {
                             // markAsHidden добавит метку только если игра существует в нашей базе (Storage.getDB)
                             // Функция сама проверяет дубликаты, так что это безопасно вызывать много раз.
                             // Поскольку markAsHidden делает scheduleSave, сохранение произойдет само.
                             // Мы используем "грязный хак" проверки существования внутри markAsHidden,
                             // но чтобы посчитать реальные изменения, можно проверить базу до вызова.
                             const db = Storage.getDB();
                             if (db[ignoreAppId]) {
                                 // Если флага еще нет, считаем это обновлением
                                 if (!db[ignoreAppId].h || !db[ignoreAppId].h.includes(this.currentSteamID)) {
                                     syncedCount++;
                                 }
                                 Storage.markAsHidden(ignoreAppId, this.currentSteamID);
                             }
                         });

                         if (syncedCount > 0) {
                             this.log(`☁️ Синхронизировано из Steam: ${syncedCount} уже скрытых игр.`, '#66c0f4');
                             Storage.forceSync(); // Сохраняем сразу, чтобы не потерять при сбое
                         }
                     }

                } else {
                    this.log('⚠️ Не удалось получить список владений (структура ответа неизвестна).', '#e6a23c');
                }
            } catch (e) {
                this.log(`⚠️ Ошибка получения UserData: ${e}.`, '#e6a23c');
            }

            // Проверка на необходимость Heavy Scan и разрешение пользователя
            if (ownedAppsSet.size === 0) {
                // Считаем true по умолчанию, если не задано явно false
                const isHeavyAllowed = (settings.allowHeavyScan !== undefined) ? settings.allowHeavyScan : true;

                if (!isHeavyAllowed) {
                    // Спрашиваем пользователя, хочет ли он включить медленный режим
                    if (await this.showDialog('confirm', 'Не удалось получить быстрый список игр (API UserData).\n\nХотите продолжить в медленном режиме (Heavy Scan)?\nЭто займет много времени.')) {
                        // Если ДА - включаем настройку и сохраняем
                        settings.allowHeavyScan = true;
                        Storage.saveSettings(settings);

                        // Обновляем галочку в интерфейсе, чтобы пользователь видел изменение
                        const heavyInput = document.getElementById('slm-setting-heavy');
                        if (heavyInput) heavyInput.checked = true;

                        this.log('⚠️ Внимание: Heavy Scan автоматически включен. Будем проверять каждую игру поштучно.', '#e6a23c');
                    } else {
                        // Если НЕТ - останавливаемся
                        this.log('⛔ Быстрое сканирование не удалось, Heavy Scan отклонен.', '#f00');
                        this.isProcessing = false;
                        document.getElementById('slm-start').disabled = false;
                        document.getElementById('slm-stop').disabled = true;
                        return;
                    }
                } else {
                    this.log('⚠️ Внимание: Включен режим Heavy Scan. Будем проверять каждую игру поштучно.', '#e6a23c');
                }
            }
            // ------------------------------------------------------------------

            // Переменные для адаптивного обновления интерфейса
            let lastUiUpdate = 0;
            let lastPct = 0;

            // Цикл по всем играм в базе
            for (let i = 0; i < dbArray.length; i++) {
                // Обновляем интерфейс (Прогресс-бар), если прошло > 100 мс
                // ИЛИ если изменился процент, ИЛИ если это начало/конец списка.
                const now = performance.now();
                const pct = Math.floor(((i + 1) / dbArray.length) * 100);

                if (now - lastUiUpdate > 100 || pct > lastPct || i === 0 || i === dbArray.length - 1) {
                    document.getElementById('proc-bar').style.width = pct + '%';
                    document.getElementById('proc-status').textContent = `${i+1}/${dbArray.length}`;

                    // Отдаем управление браузеру для отрисовки
                    await new Promise(r => setTimeout(r, 0));
                    lastUiUpdate = performance.now();
                    lastPct = pct;
                }

                // Проверка на остановку
                if (this.stopProcessing) { this.log('⛔ СТОП', '#f00'); break; }

                const game = dbArray[i];

                /**
                 * ЛОГИКА ПРИНЯТИЯ РЕШЕНИЯ
                 * 1. Если игра есть у нас в базе (отмечен владелец) -> Пропускаем.
                 */
                if (game.owners.includes(this.currentSteamID)) {
                    this.log(`SKIP (База): ${escapeHtml(game.name)} (${game.appid}) - В вашей библиотеке`, '#4caf50');
                    continue;
                }

                // 2. Если игра уже помечена как СКРЫТАЯ нами ранее -> Пропускаем.
                // (Поле 'h' в базе может отсутствовать у старых записей, проверяем это)
                // Убрана тяжелая операция поиска .find(), которая создавала нагрузку O(N^2).
                // Мы используем прямой доступ по ключу (O(1)) к реальной базе данных.
                const realDB = Storage.getDB();
                const realEntry = realDB[game.appid];

                // Читаем флаг принудительной проверки
                const forceCheck = document.getElementById('slm-force-check').checked;

                if (!forceCheck && realEntry && realEntry.h && realEntry.h.includes(this.currentSteamID)) {
                     this.log(`SKIP (Hidden): ${escapeHtml(game.name)} (${game.appid}) - Уже скрыто ранее`, '#888');
                     continue;
                }

                // 2. Если в базе нас нет, проверяем владение
                let isOwned = false;

                // 2.1 БЫСТРАЯ ПРОВЕРКА ЧЕРЕЗ КЭШ UserData (Оптимизация)
                if (ownedAppsSet.has(parseInt(game.appid))) {
                    isOwned = true;
                    this.log(`SKIP (API Cache): ${escapeHtml(game.name)} (${game.appid}) - Куплено`, '#4caf50');
                }

                // 2.2 МЕДЛЕННАЯ ПРОВЕРКА (Фолбэк, если кэш пуст или игра не найдена, но мы хотим перестраховаться)
                // Если мы успешно загрузили список ownedAppsSet, то нет смысла проверять страницу.
                // Проверяем страницу ТОЛЬКО если ownedAppsSet пуст (ошибка загрузки)
                if (!isOwned && ownedAppsSet.size === 0) {
                    try {
                        // Используем GM_xmlhttpRequest для обхода CORS
                        const text = await new Promise((resolve, reject) => {
                             GM_xmlhttpRequest({
                                method: "GET",
                                url: `https://store.steampowered.com/app/${game.appid}/`,
                                timeout: 15000, // Таймаут 15 сек
                                onload: (response) => resolve(response.responseText),
                                onerror: (err) => reject(err),
                                ontimeout: () => reject("Timeout")
                             });
                        });

                        // Ищем маркеры покупки в HTML коде страницы
                        for (const m of OWNED_MARKERS) {
                            if (text.includes(m)) { isOwned = true; break; }
                        }
                    } catch (e) { this.log(`ERR NET: ${escapeHtml(game.name)} (${game.appid})`, '#f00'); }
                }

                if (isOwned) {
                    // Если нашли (в кэше или на странице), обновляем локальную базу
                    Storage.updateOwner([{appid: game.appid, name: game.name}], this.currentSteamID);
                } else {
                    // 3. Игры нет ни в базе, ни на странице -> Скрываем.
                    try {
                         // Используем GM_xmlhttpRequest для обхода CORS при отправке на store.steampowered.com с домена community
                         const res = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: API_URL,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                data: `sessionid=${sessionID}&appid=${game.appid}&ignore_reason=${IGNORE_REASON_CODE}&snr=1_direct-navigation__`,
                                timeout: 10000,
                                onload: (response) => {
                                    if (response.status >= 200 && response.status < 300) resolve(response);
                                    else if (response.status === 400) {
                                        // 400 Bad Request часто означает, что игру нельзя скрыть (или она уже скрыта/недоступна).
                                        // Чтобы не зацикливаться, считаем это "успехом" для логики скрипта (мы попытались, Steam отказал, больше не пробуем).
                                        resolve({status: 400, ignorable: true});
                                    }
                                    else reject(`Status ${response.status}`);
                                },
                                onerror: (err) => reject(err),
                                ontimeout: () => reject("Timeout")
                            });
                        });

                        if (res.status === 400) {
                             this.log(`SKIP (API 400): ${escapeHtml(game.name)} (${game.appid}) - Невозможно скрыть (возможно, регион или DLC)`, '#e6a23c');
                             Storage.markAsHidden(game.appid, this.currentSteamID);
                        } else {
                             this.log(`HIDDEN: ${escapeHtml(game.name)} (${game.appid})`, '#66c0f4');
                             // Запоминаем, что мы скрыли эту игру, чтобы не долбить API повторно
                             Storage.markAsHidden(game.appid, this.currentSteamID);
                        }
                    } catch (e) { this.log(`ERR API: ${escapeHtml(game.name)} (${game.appid}) - ${e}`, '#f00'); }

                    // Задержка перед следующим запросом (из настроек)
                    await new Promise(r => setTimeout(r, currentDelay));
                }
            }

            // Завершение
            if(!this.stopProcessing) Storage.forceSync(); // Сохраняем результат на диск
            this.isProcessing = false;
            document.getElementById('slm-start').disabled = false;
            document.getElementById('slm-stop').disabled = true;
            document.getElementById('proc-status').textContent = 'Готово';
        },

        // Ветка процесса: ВОССТАНОВЛЕНИЕ (Unhide Loop)
        runUnhideLoop: async function() {
            const queue = this.processQueue;
            if (!queue || queue.length === 0) return this.showDialog('alert', 'Очередь восстановления пуста.');

            // Настройки
            const settings = Storage.getSettings();
            const currentDelay = settings.reqDelay || REQUEST_DELAY;

             // SessionID нужен только для full режима
            let sessionID = null;
            if (this.unhideType === 'full') {
                 sessionID = await this.getSessionID();
                 if (!sessionID) {
                     // Safety Fallback: Если сессия не найдена, не пытаемся долбить API.
                     // Останавливаем процесс, чтобы поведение было предсказуемым.
                     this.log('⛔ Ошибка: SessionID не найден. Процесс остановлен.', '#f00');
                     return this.showDialog('alert', 'Ошибка: SessionID не найден. Попробуйте обновить страницу магазина.');
                 }
            }

            this.isProcessing = true;
            this.stopProcessing = false;
            document.getElementById('slm-start').disabled = true;
            document.getElementById('slm-stop').disabled = false;

            const db = Storage.getDB();
            let restoredCount = 0;

            for (let i = 0; i < queue.length; i++) {
                if (this.stopProcessing) { this.log('⛔ СТОП пользователем', '#f00'); break; }

                const appid = queue[i];
                // Обновляем UI
                const pct = Math.floor(((i + 1) / queue.length) * 100);
                document.getElementById('proc-bar').style.width = pct + '%';

                // Формируем безопасное имя для логов один раз
                const rawName = (db[appid] && db[appid].n) ? db[appid].n : `AppID ${appid}`;
                const safeName = escapeHtml(rawName);

                document.getElementById('proc-status').textContent = `Восстановление: ${i+1}/${queue.length} (${rawName})`;

                try {
                    // 1. API Запрос (Если нужно)
                    if (this.unhideType === 'full') {
                         const res = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: API_URL,
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    data: `sessionid=${sessionID}&appid=${appid}&snr=1_account_notinterested_&remove=1`,
                                    timeout: 5000,
                                    onload: (r) => resolve(r),
                                    onerror: (e) => reject(e)
                                });
                         });

                         if (res.status >= 200 && res.status < 300) {
                             this.log(`API OK: ${safeName} (${appid}) - возвращено в магазин`, '#4caf50');
                         } else {
                             this.log(`API FAIL: ${safeName} (${appid}) (Status ${res.status})`, '#f00');
                         }

                         // Задержка
                         await new Promise(r => setTimeout(r, currentDelay));
                    }

                    // 2. Локальная база (Всегда)
                    if (db[appid] && db[appid].h) {
                        const originalLen = db[appid].h.length;
                        db[appid].h = db[appid].h.filter(id => id !== this.currentSteamID);
                        if (db[appid].h.length !== originalLen) {
                            Storage.invalidateCache(); // Обновляем кэш при восстановлении
                            Storage.scheduleSave(); // Просто помечаем, сохраним в конце или по таймеру
                            if (this.unhideType !== 'full') this.log(`DB ONLY: ${safeName} (${appid}) - метка снята`, '#66c0f4');
                        }
                    }
                    restoredCount++;

                } catch (e) {
                    this.log(`ERR: ${safeName} (${appid}) - ${e}`, '#f00');
                }
            }

            this.isProcessing = false;
            Storage.forceSync(); // Финальное сохранение
            document.getElementById('slm-start').disabled = false;
            document.getElementById('slm-stop').disabled = true;
            document.getElementById('proc-status').textContent = 'Готово';

            this.log(`🏁 Процесс завершен. Восстановлено: ${restoredCount}.`, '#fff');

            // Очищаем выделение, так как работа выполнена
            this.selection.clear();
            // Обновляем таблицу (если пользователь вернется на вкладку DB)
            this.renderDB();
        }
    };

    /**
     * ==================================================================================
     * РАЗДЕЛ 5: ФУНКЦИЯ СКАНИРОВАНИЯ (SCRAPER)
     * Собирает информацию об играх с текущей страницы профиля
     * ==================================================================================
     */
    async function scanProfile() {
        const currentID = User.getID();
        if (!currentID) return UI.showDialog('alert', "Не удалось определить ваш SteamID. Залогиньтесь.");

        const gamesMap = new Map();

        // 1. Попытка получить данные из переменной rgGames (часто используется на страницах библиотеки)
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.rgGames) {
             unsafeWindow.rgGames.forEach(g => {
                 gamesMap.set(g.appid, {appid: g.appid, name: g.name});
             });
        }

        // 2. Парсинг HTML элементов списка игр (новый дизайн профилей)
        const rows = document.querySelectorAll('.gameListRow');
        if (rows.length > 0) {
            rows.forEach(row => {
                const idStr = row.id.replace('game_', '');
                const appid = parseInt(idStr);
                const name = row.querySelector('.gameListRowItemName')?.textContent.trim() || `AppID ${appid}`;
                if (appid && !gamesMap.has(appid)) {
                    gamesMap.set(appid, {appid, name});
                }
            });
        }

        // 3. Универсальный поиск ссылок (для нового React-дизайна с плитками)
        // Запускаем, если специфичные парсеры ничего не нашли
        if (gamesMap.size === 0) {
            document.querySelectorAll('a[href*="/app/"]').forEach(a => {
                 const m = a.href.match(/app\/(\d+)/);
                 if (m) {
                     const appid = parseInt(m[1]);

                     // Пытаемся извлечь имя из текста ссылки
                     let name = a.textContent.trim();

                     // Если текста нет, проверяем атрибут alt у картинки внутри (актуально для плиток)
                     if (!name) {
                         const img = a.querySelector('img');
                         if (img && img.alt) name = img.alt.trim();
                     }

                     const isPlaceholder = !name;
                     if (isPlaceholder) name = `AppID ${appid}`;

                     if (!gamesMap.has(appid)) {
                         // Создаем объект игры, добавляем флаг заглушки (p:1) если это AppID
                         const newEntry = {appid, name};
                         if (isPlaceholder) newEntry.p = 1;
                         gamesMap.set(appid, newEntry);
                     } else {
                         // Если игра уже есть, но с именем "AppID ...", а мы нашли нормальное название - обновляем
                         const existing = gamesMap.get(appid);
                         // Используем helper из Storage? Нет, тут gamesMap не связан с Storage еще. Проверяем вручную.
                         const existingIsPlaceholder = !!existing.p || existing.name.startsWith('AppID ');

                         if (existingIsPlaceholder && !isPlaceholder) {
                             existing.name = name;
                             if (existing.p) delete existing.p;
                             gamesMap.set(appid, existing);
                         }
                     }
                 }
             });
        }

        if (gamesMap.size === 0) return UI.showDialog('alert', 'Игры не найдены на странице. Проскролльте вниз!');

        // Открытие предпросмотра результатов
        const uniqueGames = Array.from(gamesMap.values());
        UI.openScanPreview(uniqueGames, currentID);
    }

    /**
     * ==================================================================================
     * РАЗДЕЛ 6: ВНЕДРЕНИЕ НА СТРАНИЦУ (INJECTION)
     * Создание кнопок запуска в интерфейсе Steam
     * ==================================================================================
     */
    function injectUI() {
        // SPA Safety: Всегда проверяем аккаунт, даже если кнопки уже есть.
        // Это дешевая операция (чтение DOM/JS переменной), но критична при смене юзера без перезагрузки.
        autoRegisterAccount();

        // Проверяем, созданы ли уже кнопки. Если да - выходим.
        const btnExists = document.getElementById('slm-scan-btn') || document.getElementById('slm-mgr-fallback');
        // Пункт меню может быть удален стимом при перерисовке хедера, его чекаем отдельно.

        if (btnExists) {
             // Кнопки есть, аккаунт проверили - выходим.
             return;
        }

        // 1. Кнопка "СКАНИРОВАТЬ" (Появляется только на страницах со списком игр)
        if (location.href.includes('/games') || location.href.includes('/games/?tab=all')) {
            const btnId = 'slm-scan-btn';
            if (!document.getElementById(btnId)) {
                const scan = document.createElement('button');
                scan.id = btnId;
                scan.innerText = "💾 СКАНИРОВАТЬ";
                scan.style.cssText = "position:fixed; z-index:99990; padding:10px; bottom:70px; left:20px; background:#2a475e; color:#fff; border:1px solid #66c0f4; cursor:pointer; font-weight:bold;";
                scan.onclick = scanProfile;
                document.body.appendChild(scan);
            }
        }

        // 2. Пункт меню "Steam Library Manager" в выпадающем списке аккаунта (справа вверху)
        // Работает на всех страницах Steam (Магазин и Сообщество)
        const accountDropdown = document.getElementById('account_dropdown');
        if (accountDropdown) {
            const menuContainer = accountDropdown.querySelector('.popup_body') || accountDropdown.querySelector('.popup_menu');
            if (menuContainer && !document.getElementById('slm-menu-item')) {
                const link = document.createElement('a');
                link.id = 'slm-menu-item';
                link.className = 'popup_menu_item';
                link.href = 'javascript:void(0)';
                link.textContent = 'Steam Library Manager';
                link.onclick = () => UI.open();

                // Вставляем перед кнопкой "Выйти"
                const logout = Array.from(menuContainer.children).find(el => el.href && el.href.includes('Logout'));
                if (logout) menuContainer.insertBefore(link, logout);
                else menuContainer.appendChild(link);
            }
        }
        // 3. Фолбэк кнопка "МЕНЕДЖЕР" (если меню недоступно, например, на некоторых страницах профиля)
        else if (location.href.includes('/games')) {
             const fallbackId = 'slm-mgr-fallback';
             if (!document.getElementById(fallbackId)) {
                const mgr = document.createElement('button');
                mgr.id = fallbackId;
                mgr.innerText = "⚙️ МЕНЕДЖЕР";
                mgr.style.cssText = "position:fixed; z-index:99990; padding:10px; bottom:20px; left:20px; background:#171a21; color:#66c0f4; border:1px solid #66c0f4; cursor:pointer; font-weight:bold;";
                mgr.onclick = () => UI.open();
                document.body.appendChild(mgr);
             }
        }

        // 4. Интеграция в страницу магазина (Store Page)
        // Отображает владельцев игры рядом с кнопкой "Скрыть"
        if (location.hostname === 'store.steampowered.com' && location.pathname.includes('/app/')) {

            // Проверяем настройку отображения
            const settings = Storage.getSettings();
            if (settings.showOwnersOnStore === false) return;

            const m = location.pathname.match(/\/app\/(\d+)/);
            if (m) {
                const appid = m[1];
                const db = Storage.getDB();
                const game = db[appid];

                // Если игра есть в базе (владельцы отмечены)
                if (game && game.o && game.o.length > 0) {
                    // Если мы авторизованы и этот аккаунт уже числится владельцем — не показываем блок.
                    // (Избегаем дублирования информации, если Steam и так говорит "В библиотеке")
                    const currentID = User.getID();
                    if (currentID && game.o.includes(currentID)) return;

                    // Защита от дублей
                    if (document.getElementById('slm-store-info')) return;

                    // --- СТРАТЕГИЯ ВСТАВКИ ---
                    // 1. Попытка найти кнопку RPA - приоритет
                    const rpaBtn = document.getElementById('rpaPriorButton');
                    // 2. Стандартный контейнер кнопок Steam (Follow/Wishlist)
                    const queueContainer = document.getElementById('queueActionsCtn');
                    // 3. Фолбэк: область покупки (если панель кнопок скрыта/отсутствует)
                    const purchaseArea = document.getElementById('game_area_purchase');

                    let targetContainer = null;
                    let refElement = null; // Элемент, ПЕРЕД которым вставляем (null = в конец)

                    if (rpaBtn && rpaBtn.parentNode) {
                        // Если есть RPA, встаем ПОСЛЕ него (т.е. перед его следующим соседом)
                        targetContainer = rpaBtn.parentNode;
                        refElement = rpaBtn.nextSibling;
                    } else if (queueContainer) {
                        // Стандартная панель
                        targetContainer = queueContainer;
                        // Пытаемся найти Wishlist, чтобы встать после него
                        const wishlistBtn = document.getElementById('addToWishlistBtn');
                        if (wishlistBtn) refElement = wishlistBtn.nextSibling;
                    } else if (purchaseArea) {
                        // Фолбэк: Вставляем ПЕРЕД блоком покупки
                        targetContainer = purchaseArea.parentNode;
                        refElement = purchaseArea;
                    }

                    // Если нашли целевой контейнер
                    if (targetContainer) {
                        const infoDiv = document.createElement('div');
                        infoDiv.id = 'slm-store-info';

                        // Базовые стили
                        let css = `
                            display: inline-flex;
                            align-items: center;
                            vertical-align: top;
                            height: 30px;
                            padding: 0 10px;
                            background: rgba(0, 0, 0, 0.4);
                            border-left: 3px solid #4caf50;
                            border-radius: 2px;
                            color: #b0aeac;
                            font-size: 12px;
                            line-height: 30px;
                        `;

                        // Адаптация отступов в зависимости от места вставки
                        if (targetContainer.id === 'queueActionsCtn' || (rpaBtn && targetContainer === rpaBtn.parentNode)) {
                             css += 'margin-left: 5px;';
                        } else {
                             // Для фолбэка (перед покупкой) делаем отступ снизу
                             css += 'margin-bottom: 10px; margin-right: auto;';
                        }
                        infoDiv.style.cssText = css;

                        // Генерация списка владельцев с подсказками (title)
                        const ownerLinks = game.o.map(id => {
                            const name = Storage.getDisplayName(id);
                            // Тултип с ID при наведении
                            return `<span style="color:#66c0f4; cursor:help; border-bottom:1px dotted rgba(102,192,244,0.5);" title="SteamID: ${id}">${escapeHtml(name)}</span>`;
                        }).join(', ');

                        // Оформляем всё в одну строку для компактности
                        infoDiv.innerHTML = `
                            <span style="color:#4caf50; font-weight:bold; text-transform:uppercase; margin-right:5px;">Есть в библиотеке (SLM):</span>
                            <span>${ownerLinks}</span>
                        `;

                        // Вставка в DOM
                        if (refElement) {
                            targetContainer.insertBefore(infoDiv, refElement);
                        } else {
                            targetContainer.appendChild(infoDiv);
                        }
                    }
                }
            }
        }

        // 5. Интеграция в Hover-карточки (Всплывающие окна при наведении на игру)
        const hoverContent = document.getElementById('global_hover_content');
        // Проверяем, не повесили ли мы уже наблюдатель (используем класс-флаг)
        if (hoverContent && !hoverContent.classList.contains('slm-observed')) {
            hoverContent.classList.add('slm-observed');

            const hoverObserver = new MutationObserver(() => {
                const settings = Storage.getSettings();
                if (settings.showOwnersOnStore === false) return;

                // Ищем ВСЕ карточки внутри контейнера, а не только первую попавшуюся.
                // Steam может держать в DOM сразу несколько скрытых карточек.
                const appDivs = hoverContent.querySelectorAll('div[id^="hover_app_"]');

                appDivs.forEach(appDiv => {
                    // Защита от дублирования: если мы уже добавили инфо в эту конкретную карточку, пропускаем
                    if (appDiv.querySelector('.slm-hover-info')) return;

                    const appidStr = appDiv.id.replace('hover_app_', '');
                    const appid = parseInt(appidStr);
                    if (isNaN(appid)) return;

                    const db = Storage.getDB();
                    const game = db[appid];

                    // Если игра есть в базе и есть владельцы
                    if (game && game.o && game.o.length > 0) {
                        const currentID = User.getID();
                        // Исключаем текущего пользователя из списка (если он там есть)
                        const otherOwners = game.o.filter(id => id !== currentID);

                        if (otherOwners.length > 0) {
                            // Берем первого владельца из списка (1 аккаунт только)
                            const ownerID = otherOwners[0];
                            const ownerName = Storage.getDisplayName(ownerID);

                            const infoDiv = document.createElement('div');
                            infoDiv.className = 'hover_body_block slm-hover-info';

                            // Стилизация: Темный фон, тень текста и блока для максимальной читаемости
                            infoDiv.style.cssText = `
                                margin-top: 5px;
                                margin-bottom: 5px;
                                padding: 6px 10px;
                                background: rgba(0, 0, 0, 0.85);
                                border-left: 3px solid #4caf50;
                                border-radius: 2px;
                                color: #ffffff;
                                font-size: 12px;
                                line-height: 1.4;
                                text-shadow: 1px 1px 2px #000000;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.7);
                                backdrop-filter: blur(2px);
                            `;

                            // Формируем текст внутри прямоугольника (имя жирным)
                            infoDiv.innerHTML = `На аккаунте <span style="color:#66c0f4; font-weight:bold; cursor:help; border-bottom:1px dotted rgba(102,192,244,0.5);" title="SteamID: ${ownerID}">${escapeHtml(ownerName)}</span> куплена уже (SLM)`;

                            // Вставляем блок в конец содержимого карточки
                            appDiv.appendChild(infoDiv);
                        }
                    }
                });
            });

            // Следим за изменениями внутри глобального попапа
            hoverObserver.observe(hoverContent, { childList: true, subtree: true });
        }

        // 6. Интеграция в карусели/слайдеры (Новый дизайн Steam)
        // Ищем элементы списка (слайды)
        const slides = document.querySelectorAll('div[role="listitem"]');
        if (slides.length > 0) {
            const settings = Storage.getSettings();
            if (settings.showOwnersOnStore !== false) {
                slides.forEach(slide => {
                    // Защита от дублирования
                    if (slide.querySelector('.slm-carousel-info')) return;

                    // Ищем ссылку на игру внутри слайда, чтобы достать AppID
                    const link = slide.querySelector('a[href*="/app/"]');
                    if (!link) return;

                    const m = link.href.match(/\/app\/(\d+)/);
                    if (!m) return;

                    const appid = parseInt(m[1]);
                    const db = Storage.getDB();
                    const game = db[appid];

                    // Если игра есть в базе и есть владельцы
                    if (game && game.o && game.o.length > 0) {
                        const currentID = User.getID();
                        // Исключаем текущего пользователя
                        const otherOwners = game.o.filter(id => id !== currentID);

                        if (otherOwners.length > 0) {
                            const ownerID = otherOwners[0];
                            const ownerName = Storage.getDisplayName(ownerID);

                            // Создаем контейнер для метки
                            const badge = document.createElement('div');
                            badge.className = 'slm-carousel-info';

                            // Стили: аккуратный блок снизу, не перекрывающий контент
                            badge.style.cssText = `
                                margin-top: 4px;
                                padding: 2px 6px;
                                background: rgba(0, 0, 0, 0.6);
                                border-left: 2px solid #4caf50;
                                border-radius: 0 0 3px 3px;
                                color: #ccc;
                                font-size: 11px;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                                width: fit-content;
                                max-width: 100%;
                                overflow: hidden;
                                white-space: nowrap;
                                pointer-events: auto; /* Чтобы работал тултип */
                            `;

                            // SVG иконка пользователя (User Icon)
                            const svgIcon = `
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="10" height="10" style="color:#4caf50; min-width:10px;">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            `;

                            badge.innerHTML = `${svgIcon} <span style="text-overflow:ellipsis; overflow:hidden;" title="SteamID: ${ownerID}">${escapeHtml(ownerName)}</span>`;

                            // Вставляем метку.
                            // Пытаемся найти блок с ценой/нижней панелью (CapsuleBottomBar), чтобы вставить ПОСЛЕ него (визуально под карточкой).
                            // Структура обычно: <a> ... <div class="CapsuleBottomBar">...</div> </a>
                            // Добавляем внутрь ссылки (a) в самый конец.
                            link.appendChild(badge);

                            // Если ссылка имеет display: block (обычно да), наш div встанет снизу.
                            // На всякий случай добавим display: block родительской ссылке, если там flex (редко, но бывает).
                            // Но обычно в каруселях это работает из коробки.
                        }
                    }
                });
            }
        }
    }

    // Запуск наблюдателя изменений DOM
    // Debounce (отложенный вызов), чтобы не реагировать на каждый чих React-а
    let debounceTimer;
    const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(injectUI, 500); // 500мс тишины перед запуском
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Гарантированное сохранение данных при закрытии страницы (предотвращает потерю данных таймера)
    window.addEventListener('beforeunload', () => Storage.forceSync());

    // Первичный запуск
    setTimeout(injectUI, 1000);

})();