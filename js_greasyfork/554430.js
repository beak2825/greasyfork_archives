// ==UserScript==
// @name         DETIOBR03 Autologin & session support
// @namespace    клиоэсош.рф
// @version      1.2 (24.11.2025)
// @description  Автоматический переход на страницу журнала + поддержание сессии (v1.2: Фикс автоклика + Умный выбор предмета < 5 кл)
// @author       ESOSH makerBot & Gemini e-mail: robototechnik03@gmail.com
// @match        *://deti.obr03.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554430/DETIOBR03%20Autologin%20%20session%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/554430/DETIOBR03%20Autologin%20%20session%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ОБЩИЕ КОНСТАНТЫ ---
    const LOG_PREFIX = 'DETIOBR03 Script:';
    const MAX_WAIT_MS = 10000; // 10 секунд таймаут
    const POLLING_INTERVAL = 100; // 0.1 секунды интервал опроса
    const SESSION_KEEP_ALIVE_MS = 840000; // 14 минут

    // --- КОНСТАНТЫ ПУТЕЙ (ДЛЯ РОУТЕРА) ---
    const ROLE_PAGE_PATH = '/app/simple/attention/choose-session-role';
    const SCHEDULE_PAGE_PATH = '/app/school/schedule/day/';
    const JOURNAL_PAGE_PATH = '/app/school/journal/';
    const ATTENDANCE_PAGE_PATH = '/app/school/journal/attendance/';
    const EDIT_PAGE_PATH = '/app/school/journal/edit/';

    // --- КОНСТАНТЫ (S1: ЖУРНАЛ ОЦЕНОК) ---
    const JOURNAL_CLASS_SELECTOR = 'select[name="PCLID_IUP"]';
    const JOURNAL_SUBJECT_SELECTOR = 'select[name="SGID"]';
    const JOURNAL_LOAD_BUTTON_ID = '#load-journal-btn';
    const JOURNAL_LOAD_BUTTON_ICON_SELECTOR = '.glyphicon-search';
    const JOURNAL_MODAL_TITLE_TEXT = 'Пожалуйста, подождите...';
    const JOURNAL_TERM_SELECTOR = 'select[name="TERMID"]';
    const JOURNAL_TARGET_SUBJECT_NAME = 'Математика'; // Предмет для автовыбора (только для начальной школы)

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ЖУРНАЛА (S1) ---
    let isSingleClassAccount = false;

    // --- КОНСТАНТЫ (S2: ПОСЕЩАЕМОСТЬ) ---
    // НАСТРОЙКА: Укажите точное название класса для авто-выбора на странице Посещаемости.
    const ATTENDANCE_TARGET_CLASS_NAME = "6в"; // <--- ИЗМЕНИТЕ ЭТО ЗНАЧЕНИЕ ПРИ НЕОБХОДИМОСТИ
    const ATTENDANCE_SAVE_BUTTON_SELECTOR = 'button[title="Сохранить"][ng-click="$ctrl.save()"]';

    // --- КОНСТАНТЫ (S3: РЕДАКТОР УРОКА) ---
    const LESSON_SAVE_BUTTON_SELECTOR = 'button[title="Сохранить"][ng-click="$ctrl.save()"]';
    const LESSON_MODAL_SELECTOR = '.bootstrap-dialog.type-info';
    const LESSON_MODAL_OK_BUTTON_SELECTOR = '.bootstrap-dialog.type-info button.btn-default[ng-click="ctrl.close()"]';
    const LESSON_SAVE_AND_BACK_BUTTON_SELECTOR = 'button.save-journal-with-return-btn[ng-click="$ctrl.saveAndBack()"]';
    const LESSON_NO_CHANGE_MESSAGE = 'Данные не были изменены!';

    // --- КОНСТАНТЫ (ГЛОБАЛЬНАЯ БЛОКИРОВКА) ---
    const GLOBAL_WAIT_MODAL_SELECTOR = '.modal-dialog .bootstrap-dialog-title .glyphicon-time';

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
    let processedPath = null;
    let mainObserver = null;
    let activeWaiters = [];
    let hud_element = null;
    let hud_countdownInterval = null;

    // Таймеры
    let journal_clickCascadeInterval = null;    // (S1)
    let attendance_mainInterval = null;         // (S2)
    let lessonEdit_mainInterval = null;         // (S3)
    let lessonEdit_modalObserver = null;
    let journal_errorObserver = null;           // (S1)
    let journal_errorRetryTimeout = null;       // (S1)

    // Флаги кликов
    let session_S1_scriptClickFlag = false;
    let session_S3_scriptClickFlag = false;

    // Глобальная блокировка
    let globalModalObserver = null;
    let session_isGlobalModalActive = false;

    // =================================================================
    // --- 1. ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    // =================================================================

    function log(message, level = 'log') {
        const fullMessage = `${LOG_PREFIX} ${message}`;
        if (level === 'warn') {
            console.warn(fullMessage);
        } else if (level === 'error') {
            console.error(fullMessage);
        } else {
            console.log(fullMessage);
        }
    }

    function removeWaiter(waiter) {
        activeWaiters = activeWaiters.filter(w => w !== waiter);
    }

    function waitForAndClick(selector, name, checkDisabled = false) {
        log(`Начинаю ожидание и клик по "${name}" (Селектор: ${selector})...`);
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = MAX_WAIT_MS / POLLING_INTERVAL;
            const intervalId = setInterval(() => {
                if (window.location.pathname !== processedPath) {
                    clearInterval(intervalId);
                    log(`[ОТМЕНА] Путь изменился, отмена ожидания "${name}".`, 'warn');
                    reject(new Error('Page navigated away'));
                    return;
                }
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    const isReady = checkDisabled ? !element.disabled : true;
                    if (isReady) {
                        clearInterval(intervalId);
                        log(`[Успех] Элемент "${name}" найден и готов. Кликаю!`);
                        element.click();
                        resolve(element);
                    } else if (attempts % 10 === 0) {
                        log(`[Попытка ${attempts}]: Элемент "${name}" найден, но НЕАКТИВЕН (disabled). Жду...`);
                    }
                } else if (attempts % 10 === 0) {
                    log(`[Ожидание] Поиск "${name}" (Попытка ${attempts}/${maxAttempts})...`);
                }
                if (++attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    const msg = `[ТАЙМАУТ] Элемент "${name}" не найден или не стал активным за ${MAX_WAIT_MS / 1000} секунд.`;
                    log(msg, 'error');
                    reject(new Error(msg));
                }
            }, POLLING_INTERVAL);
        });
    }

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            log(`Элемент "${selector}" найден сразу. Запускаю callback.`);
            callback(element);
            return;
        }
        let observer;
        let timeoutId;
        const waiter = { selector: selector, observer: null, timeoutId: null };

        observer = new MutationObserver((mutationsList, obs) => {
            if (window.location.pathname !== processedPath) {
                obs.disconnect();
                clearTimeout(waiter.timeoutId);
                removeWaiter(waiter);
                log(`[ОТМЕНА] Путь изменился, отмена MutationObserver для "${selector}".`, 'warn');
                return;
            }
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                obs.disconnect();
                clearTimeout(waiter.timeoutId);
                removeWaiter(waiter);
                log(`Элемент "${selector}" обнаружен с помощью Observer. Запускаю callback.`);
                callback(targetElement);
            }
        });

        timeoutId = setTimeout(() => {
            observer.disconnect();
            removeWaiter(waiter);
            if (window.location.pathname === processedPath) {
                 log(`[ТАЙМАУT OBSERVER] Элемент "${selector}" не появился за ${MAX_WAIT_MS / 1000}с.`, 'warn');
            } else {
                 log(`[ОТМЕНА] Таймаут Observer для "${selector}" отменен из-за смены пути.`);
            }
        }, MAX_WAIT_MS);

        waiter.observer = observer;
        waiter.timeoutId = timeoutId;
        activeWaiters.push(waiter);
        observer.observe(document.body, { childList: true, subtree: true });
        log(`Запущен MutationObserver для ожидания "${selector}"...`);
    }

    function applyAngular(element, message) {
        try {
            const angularElement = element && window.angular && window.angular.element(element);
            if (angularElement && angularElement.scope()) {
                const scope = angularElement.scope();
                if (!scope.$$phase && !scope.$root.$$phase) {
                    scope.$apply();
                    log(`Успех: Вызван $apply() после ${message}.`);
                } else {
                    log(`Пропуск $apply() после ${message}: Angular цикл уже активен.`);
                }
                return true;
            }
        } catch (e) {
            log(`Критическая ошибка при вызове $apply() после ${message}: ${e.message}`, 'error');
            return false;
        }
    }

    function injectGlobalStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .buttons-panel.buttons-panel-fixed { display: none !important; }
        `;
        document.head.appendChild(style);
        log("СТИЛИ: Глобальные стили (скрытие панели 'Наверх') внедрены.");
    }

    // =================================================================
    // --- 2. ГЛОБАЛЬНЫЙ HUD, СБРОС ТАЙМЕРА И БЛОКИРОВКА ---
    // =================================================================

    function session_restartTimer(reason) {
        log(`[Таймер] Cессия сбрасывается (14 мин) по причине: ${reason}`);
        clearInterval(journal_clickCascadeInterval); journal_clickCascadeInterval = null;
        clearInterval(attendance_mainInterval); attendance_mainInterval = null;
        clearInterval(lessonEdit_mainInterval); lessonEdit_mainInterval = null;
        clearInterval(hud_countdownInterval); hud_countdownInterval = null;
        log("[Таймер] Все интервалы сессии остановлены.");

        const newTotalSeconds = SESSION_KEEP_ALIVE_MS / 1000;
        if (processedPath.startsWith(EDIT_PAGE_PATH)) {
            log("[Таймер] Перезапуск таймера для 'Редактора Урока' (S3)...");
            const callback = () => { lessonEdit_clickSaveAndSetFlag(); startCountdown(newTotalSeconds, "Сброс сессии"); };
            lessonEdit_mainInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
            startCountdown(newTotalSeconds, "Сброс сессии");
        }
        else if (processedPath.startsWith(ATTENDANCE_PAGE_PATH)) {
            log("[Таймер] Перезапуск таймера для 'Посещаемости' (S2)...");
            const callback = () => { attendance_handleKeepAlive(); startCountdown(newTotalSeconds, "Сброс сессии"); };
            attendance_mainInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
            startCountdown(newTotalSeconds, "Сброс сессии");
        }
        else if (processedPath.startsWith(JOURNAL_PAGE_PATH)) {
            log("[Таймер] Перезапуск таймера для 'Журнала' (S1)...");
            const callback = () => { journal_handleRepeatingClickCascade(); startCountdown(newTotalSeconds, "Сброс сессии"); };
            journal_clickCascadeInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
            startCountdown(newTotalSeconds, "Сброс сессии");
        } else {
            log("[Таймер] Не удалось перезапустить таймер: неизвестный путь.", "warn");
        }
    }

    function createGlobalHUD() {
        if (hud_element) { hud_element.style.display = 'block'; return; }
        hud_element = document.createElement('div');
        hud_element.id = 'tm-global-countdown-hud';
        hud_element.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #007bff; color: white; padding: 6px 9px;
            border-radius: 6px; font-size: 12px; font-family: 'Inter', sans-serif;
            font-weight: 600; z-index: 99999; box-shadow: 0 6px 12px rgba(0,0,0,0.3);
            transition: all 0.2s ease-in-out; text-align: center;
        `;
        document.body.appendChild(hud_element);
        log("РОУТЕР: Глобальный HUD создан.");
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startCountdown(totalSeconds, prefix) {
        createGlobalHUD();
        clearInterval(hud_countdownInterval);
        let secondsRemaining = totalSeconds;
        const updateUI = () => {
             if (hud_element) hud_element.innerHTML = `${prefix}<br><strong style="font-size: 2.2em; line-height: 1;">${formatTime(secondsRemaining)}</strong>`;
        };
        updateUI();
        hud_countdownInterval = setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining < 0) secondsRemaining = 0;
            updateUI();
        }, 1000);
    }

    function stopCountdown() {
        clearInterval(hud_countdownInterval);
        hud_countdownInterval = null;
        if (hud_element) hud_element.style.display = 'none';
    }

    function globalModalObserver_Callback(mutationsList) {
        const modal = document.querySelector(GLOBAL_WAIT_MODAL_SELECTOR);
        if (modal && !session_isGlobalModalActive) {
            log("[БЛОКИРОВКА] Обнаружено окно 'Пожалуйста, подождите...'. Авто-клики ПРИОСТАНОВЛЕНЫ.", 'warn');
            session_isGlobalModalActive = true;
            if (hud_element) {
                 hud_element.style.background = '#ffc107'; // Yellow
                 hud_element.innerHTML = `Обработка...<br><strong style="font-size: 2.2em; line-height: 1;">ПАУЗА</strong>`;
            }
        } else if (!modal && session_isGlobalModalActive) {
            log("[БЛОКИРОВКА] Окно 'Пожалуйста, подождите...' закрыто. Авто-клики ВОЗОБНОВЛЕНЫ.", 'warn');
            session_isGlobalModalActive = false;
            if (hud_element) {
                hud_element.style.background = '#007bff'; // Blue
                session_restartTimer("Возобновление после 'Подождите...'");
            }
        }
    }


    // =================================================================
    // --- 3. ЛОГИКА МОДУЛЕЙ АВТОМАТИЗАЦИИ ---
    // =================================================================

    // --- (S0) Модуль: Роль + Навигация ---

    function handleRoleBypassAutomation() {
        const MAIN_BUTTON_SELECTOR = 'button[title="Продолжить"]:not([disabled])';
        const MODAL_BUTTON_SELECTOR = 'ns-modal[header="Предупреждение о безопасности"] .modal-footer .btn-primary';
        log("S0: Начинаю автоматизацию пропуска роли.");
        const modalButton = document.querySelector(MODAL_BUTTON_SELECTOR);
        if (modalButton && modalButton.offsetParent !== null && modalButton.innerText.includes("Продолжить")) {
             log("Модальное окно активно. Нажимаю 'Продолжить'...");
             modalButton.click();
        }
        waitForAndClick(MAIN_BUTTON_SELECTOR, 'Главная кнопка "Продолжить"', true)
            .then(() => log("S0: Успешно! Скрипт завершает работу по пропуску роли."))
            .catch((err) => log(`S0: Пропуск роли не удался: ${err.message}`, 'warn'));
    }

    async function handleJournalNavigationAutomation() {
        log("S0: Начинаю автоматизацию навигации в Классный журнал.");
        try {
            const menuLink = await new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = MAX_WAIT_MS / POLLING_INTERVAL;
                const intervalId = setInterval(() => {
                    if (window.location.pathname !== processedPath) {
                        clearInterval(intervalId); reject(new Error('Page navigated away')); return;
                    }
                    const link = Array.from(document.querySelectorAll('li.dropdown > a.ng-binding')).find(a => a.textContent.trim() === 'Журнал');
                    if (link) { clearInterval(intervalId); link.click(); resolve(link); }
                    if (++attempts >= maxAttempts) { clearInterval(intervalId); reject(new Error("Меню 'Журнал' не найдено.")); }
                }, POLLING_INTERVAL);
            });
            log("Меню 'Журнал' найдено. Нажимаю...");
            await new Promise(r => setTimeout(r, 300));
            if (window.location.pathname !== processedPath) throw new Error("Page navigated away");
            const journalLink = Array.from(document.querySelectorAll('ul.dropdown-menu a.ng-binding')).find(a => a.textContent.trim() === 'Классный журнал');
            if (journalLink) {
                log("Пункт 'Классный журнал' найден. Нажимаю...");
                journalLink.click();
                log("S0: Автоматический переход в классный журнал завершен.");
            } else {
                log("!!! ОШИБКА НАВИГАЦИИ (S0) !!! Пункт 'Классный журнал' не найден.", 'error');
            }
        } catch (error) {
            log(`S0: Навигация не удалась: ${error.message}`, 'error');
        }
    }

    // --- (S1) Модуль: Журнал (Оценки) ---

    function journal_instantClick(button) {
         if (button && !button.disabled) {
              button.click();
              log(`S1: КНОПКА "ЗАГРУЗИТЬ" УСПЕШНО НАЖАТА (МГНОВЕННО).`);
         } else {
               log(`S1: Кнопка "Загрузить" неактивна или не передана, клик отменен.`, 'warn');
         }
    }

    // !!! ИСПРАВЛЕННАЯ ФУНКЦИЯ (FIX 1) !!!
    function journal_waitForModalToDisappear(loadButton_UNUSED) {
        log(`S1: Начато отслеживание модального окна "Пожалуйста, подождите...".`);
        const startTime = Date.now();
        const mainContent = document.body;
        let observer;
        let timeout;
        let modalFound = false;
        const waiter = { observer: null, timeoutId: null };

        function startObserver() {
            observer = new MutationObserver(() => {
                if (window.location.pathname !== processedPath) {
                    observer.disconnect(); clearTimeout(waiter.timeoutId); removeWaiter(waiter);
                    log(`[ОТМЕНА S1] Путь изменился, отмена отслеживания модального окна.`, 'warn');
                    return;
                }
                const currentModal = document.querySelector('.modal-dialog');
                const isOurModal = currentModal && currentModal.textContent.includes(JOURNAL_MODAL_TITLE_TEXT);
                if (isOurModal) modalFound = true;

                if (modalFound && !isOurModal) {
                    // Модальное окно было, и теперь оно исчезло.
                    observer.disconnect();
                    clearTimeout(waiter.timeoutId);
                    removeWaiter(waiter);
                    const waitTime = Date.now() - startTime;
                    log(`S1: Модальное окно исчезло. Время ожидания: ${waitTime} мс.`);

                    // --- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Ищем кнопку заново! ---
                    const freshLoadButton = document.querySelector(JOURNAL_LOAD_BUTTON_ID) || document.querySelector(JOURNAL_LOAD_BUTTON_ICON_SELECTOR)?.closest('button');
                    if (freshLoadButton) {
                        log('S1: "Свежая" кнопка найдена. Выполняю клик.');
                        journal_instantClick(freshLoadButton);
                    } else {
                        log('S1: ОШИБКА! Кнопка "Загрузить" не найдена после исчезновения окна.', 'error');
                    }
                }
            });
            waiter.observer = observer;
            observer.observe(mainContent, { childList: true, subtree: true });
        }
        startObserver();

        timeout = setTimeout(() => {
            if (observer) observer.disconnect();
            removeWaiter(waiter);
            if (window.location.pathname !== processedPath) return;

            if (!modalFound) {
                 log('S1: Модальное окно не появилось. Считаем, что загрузка произошла сразу.', 'warn');
                 // И здесь тоже ищем свежую кнопку на всякий случай
                 const freshLoadButton = document.querySelector(JOURNAL_LOAD_BUTTON_ID) || document.querySelector(JOURNAL_LOAD_BUTTON_ICON_SELECTOR)?.closest('button');
                 journal_instantClick(freshLoadButton);
            } else {
                 log('S1: ТАЙМАУТ: Модальное окно не исчезло вовремя. Автонажатие отменено.', 'error');
            }
        }, MAX_WAIT_MS);
        waiter.timeoutId = timeout;
        activeWaiters.push(waiter);
    }

    function journal_handleSelectionChange(event) {
        const selectedElement = event.target;
        const selectedText = selectedElement.options[selectedElement.selectedIndex].text;

        let fieldName = 'неизвестного поля';
        let useModalWait = false;
        if (selectedElement.name === 'PCLID_IUP') {
            fieldName = 'класса';
            useModalWait = true;
        } else if (selectedElement.name === 'SGID') {
            fieldName = 'предмета';
            useModalWait = !isSingleClassAccount; // Если класс один - не ждем модалку, если много - ждем
        } else if (selectedElement.name === 'TERMID') {
            fieldName = 'четверти';
            useModalWait = false;
        }
        log('====================================================');
        log(`S1: Обнаружена смена ${fieldName}! Выбранное значение: "${selectedText}"`);
        if (selectedElement && typeof selectedElement.blur === 'function') selectedElement.blur();

        // Мы просто передаем текущую кнопку, но функция ожидания найдет новую сама
        const searchIcon = document.querySelector(JOURNAL_LOAD_BUTTON_ICON_SELECTOR);
        const loadButton = searchIcon ? searchIcon.closest('button') : null;

        if (loadButton || useModalWait) { // useModalWait может быть true даже если кнопки сейчас нет (она появится)
            if (useModalWait) {
                log('S1: Запуск ожидания модального окна...');
                journal_waitForModalToDisappear(loadButton);
            } else {
                log('S1: Модальное окно не ожидается. Запуск таймера (500мс)...');
                setTimeout(() => {
                    const freshBtn = document.querySelector(JOURNAL_LOAD_BUTTON_ID) || document.querySelector(JOURNAL_LOAD_BUTTON_ICON_SELECTOR)?.closest('button');
                    if (freshBtn) {
                        log('S1: Таймер 500мс завершен. Автоклик "Загрузить".');
                        freshBtn.click();
                    }
                }, 500); // Увеличил до 500 для надежности
            }
        } else {
            log('S1: Не удалось найти кнопку "Загрузить" для инициации действия.', 'error');
        }
    }

    function journal_handleLoadError(mutationsList) {
        if (journal_errorRetryTimeout) return;
        const errorSelector = 'div.alert.alert-danger[ng-bind="$ctrl.error"]';
        const errorElement = document.querySelector(errorSelector);

        if (errorElement && errorElement.offsetParent !== null && errorElement.textContent.includes('Ошибка загрузки')) {
            log('S1: ОБНАРУЖЕНА ОШИБКА ЗАГРУЗКИ. Попытка повтора через 10 секунд...', 'error');
            journal_errorRetryTimeout = setTimeout(() => {
                log('S1: 10 секунд прошло. Повторное нажатие "Загрузить" для исправления ошибки...');
                const loadButton = document.querySelector(JOURNAL_LOAD_BUTTON_ID) || document.querySelector(JOURNAL_LOAD_BUTTON_ICON_SELECTOR)?.closest('button');
                if (loadButton && !loadButton.disabled) {
                    session_S1_scriptClickFlag = true;
                    loadButton.click();
                    setTimeout(() => { session_S1_scriptClickFlag = false; }, 1000);
                } else {
                   log('S1: Ошибка загрузки, но кнопка "Загрузить" не найдена или неактивна.', 'error');
                }
                journal_errorRetryTimeout = null;
            }, 10000);
        }
    }

    function journal_handleRepeatingClickCascade() {
        if (session_isGlobalModalActive || window.location.pathname !== JOURNAL_PAGE_PATH) {
            log('[КАСКАД S1] Отмена клика: Активно модальное окно или путь изменился.');
            return;
        }
        const loadButton = document.getElementById(JOURNAL_LOAD_BUTTON_ID.substring(1));
        if (loadButton && !loadButton.disabled) {
            log("S1: КАСКАД: Найдена кнопка 'Загрузить'. Кликаю для поддержания сессии.");
            session_S1_scriptClickFlag = true;
            loadButton.click();
            setTimeout(() => { session_S1_scriptClickFlag = false; }, 500);
        } else {
            log("S1: КАСКАД: Кнопка 'Загрузить' не найдена или заблокирована (disabled).", 'warn');
        }
    }

    function handleJournalLoadAutomation() {
        log("S1: Начинаю автоматизацию страницы ЖУРНАЛА (ОЦЕНОК).");
        waitForAndClick(JOURNAL_LOAD_BUTTON_ID, 'Кнопка "Загрузить" (Первичный вход)', true)
             .then(() => {
                 log("S1: Автоматическая загрузка журнала при входе завершена.");
                 const loadButton = document.getElementById(JOURNAL_LOAD_BUTTON_ID.substring(1));
                 if (loadButton) {
                     loadButton.addEventListener('click', () => {
                         if (!session_isGlobalModalActive && !session_S1_scriptClickFlag) {
                             session_restartTimer("Ручное нажатие 'Загрузить'");
                         }
                     });
                     log('S1: Слушатель "click" (сброс таймера) прикреплен к кнопке "Загрузить".');
                 }

                 log(`S1: Запуск таймера сессии (Каскад) каждые ${SESSION_KEEP_ALIVE_MS / 1000 / 60} минут.`);
                 setTimeout(() => {
                     if (window.location.pathname !== processedPath) return;
                     const callback = () => { journal_handleRepeatingClickCascade(); startCountdown(SESSION_KEEP_ALIVE_MS / 1000, "Сброс сессии"); };
                     if (journal_clickCascadeInterval) clearInterval(journal_clickCascadeInterval);
                     journal_clickCascadeInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
                     startCountdown(SESSION_KEEP_ALIVE_MS / 1000, "Сброс сессии");
                 }, 3000);
             })
             .catch((err) => log(`S1: Первичный клик по 'Загрузить' не удался: ${err.message}`, 'warn'));

        log("S1: Начинаю настройку отслеживания смены класса/предмета...");
        waitForElement(JOURNAL_CLASS_SELECTOR, (classSelect) => {
            const classOptions = Array.from(classSelect.querySelectorAll('option')).filter(opt => opt.value !== "-1" && opt.text.trim() !== "");
            isSingleClassAccount = classOptions.length <= 1;

            if (isSingleClassAccount) {
                log('S1: Обнаружен аккаунт с одним рабочим классом (isSingleClassAccount = true).');
            } else {
                log(`S1: Обнаружен аккаунт с ${classOptions.length} классами (isSingleClassAccount = false).`);
                classSelect.addEventListener('change', journal_handleSelectionChange);
                log('S1: Слушатель "change" прикреплен к полю КЛАССА.');
            }
        });

        // !!! ИСПРАВЛЕННАЯ ЛОГИКА (FIX 2: ПРОВЕРКА КЛАССА ПЕРЕД ВЫБОРОМ ПРЕДМЕТА) !!!
        waitForElement(JOURNAL_SUBJECT_SELECTOR, (subjectSelect) => {
            // --- НОВЫЙ БЛОК: АВТОВЫБОР ПРЕДМЕТА (ТОЛЬКО ДЛЯ 1-4 КЛАССОВ) ---
            const classSelect = document.querySelector(JOURNAL_CLASS_SELECTOR);
            let shouldAutoSelect = false;

            if (classSelect) {
                const selectedClassText = classSelect.options[classSelect.selectedIndex].text.trim();
                // Парсим класс (берем первую цифру/число из строки, например "5в" -> 5)
                const match = selectedClassText.match(/^(\d+)/);
                if (match) {
                    const grade = parseInt(match[1], 10);
                    if (grade < 5) {
                        shouldAutoSelect = true;
                        log(`S1: Выбран класс ${grade} (< 5). Активирую автовыбор предмета.`);
                    } else {
                        log(`S1: Выбран класс ${grade} (>= 5). Автовыбор предмета пропущен (система выберет сама).`);
                    }
                } else {
                    log(`S1: Не удалось определить номер класса из "${selectedClassText}". Пропуск автовыбора.`, 'warn');
                }
            }

            if (shouldAutoSelect) {
                const currentSubjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
                if (currentSubjectName !== JOURNAL_TARGET_SUBJECT_NAME) {
                    const targetOption = Array.from(subjectSelect.options).find(opt => opt.text === JOURNAL_TARGET_SUBJECT_NAME);
                    if (targetOption) {
                        subjectSelect.value = targetOption.value;
                        // Имитируем событие change
                        subjectSelect.dispatchEvent(new Event('change'));
                        log(`S1: Предмет "${currentSubjectName}" заменен на "${JOURNAL_TARGET_SUBJECT_NAME}". Запуск автозагрузки.`);
                    } else {
                        log(`S1: Целевой предмет "${JOURNAL_TARGET_SUBJECT_NAME}" не найден. Оставляем: ${currentSubjectName}`, 'warn');
                    }
                } else {
                    log(`S1: Предмет уже "${JOURNAL_TARGET_SUBJECT_NAME}". Действий не требуется.`);
                }
            }
            // --- КОНЕЦ НОВОГО БЛОКА ---

            subjectSelect.addEventListener('change', journal_handleSelectionChange);
            log('S1: Слушатель "change" прикреплен к полю ПРЕДМЕТА.');
        });

        waitForElement(JOURNAL_TERM_SELECTOR, (termSelect) => {
            termSelect.addEventListener('change', journal_handleSelectionChange);
            log('S1: Слушатель "change" прикреплен к полю ЧЕТВЕРТИ.');
        });

        if (journal_errorObserver) journal_errorObserver.disconnect();
        journal_errorObserver = new MutationObserver(journal_handleLoadError);
        journal_errorObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
        log('S1: Слушатель "Ошибок Загрузки" (для ретрая) прикреплен к <body>.');
    }

    // --- (S2) Модуль: Посещаемость ---

    function attendance_handleKeepAlive() {
        if (session_isGlobalModalActive) return;
        if (window.location.pathname !== processedPath) { cleanupPreviousLogic(); return; }

        const saveButton = document.querySelector(ATTENDANCE_SAVE_BUTTON_SELECTOR);
        if (saveButton && !saveButton.disabled) {
            saveButton.click();
            log('[КАСКАД S2] Успешно: Кнопка "Сохранить" нажата.');
        } else {
            log('[КАСКАД S2] Кнопка "Сохранить" неактивна. Переход на страницу Журнала (S1).');
            try {
                const menuLink = Array.from(document.querySelectorAll('li.dropdown > a.ng-binding')).find(a => a.textContent.trim() === 'Журнал');
                if (menuLink) {
                    log("[КАСКАД S2] Меню 'Журнал' найдено. Ищем под-пункт...");
                    setTimeout(() => {
                        const journalLink = Array.from(document.querySelectorAll('ul.dropdown-menu a.ng-binding')).find(a => a.textContent.trim() === 'Классный журнал');
                        if (journalLink) { journalLink.click(); log("[КАСКАД S2] Переход в 'Классный журнал'."); }
                        else { window.location.href = window.location.origin + JOURNAL_PAGE_PATH; }
                    }, 300);
                } else { window.location.href = window.location.origin + JOURNAL_PAGE_PATH; }
            } catch(e) { window.location.href = window.location.origin + JOURNAL_PAGE_PATH; }
        }
    }

    function handleAttendanceAutomation() {
        log("S2: Начинаю автоматизацию страницы ПОСЕЩАЕМОСТИ.");
        const selectSelectorPCLID = 'select[name="PCLID"]';
        const targetValueSGID = "-1";
        const selectSelectorSGID = 'select[name="SGID"]';
        const selectSelectorMonth = 'select[name="MonthsFilter"]';
        const MAX_ATTEMPTS = 50;
        const STABILIZATION_DELAY = 700;
        const INITIAL_DELAY = 200;
        const newTotalSeconds = SESSION_KEEP_ALIVE_MS / 1000;

        function getCurrentMonthValue() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            return `${year}_${month}`;
        }

        function startKeepAliveTimer() {
             log(`S2: Запуск таймера сессии (Keep-Alive) каждые ${SESSION_KEEP_ALIVE_MS / 1000 / 60} минут.`);
             const callback = () => { attendance_handleKeepAlive(); startCountdown(newTotalSeconds, "Сброс сессии"); };
             if (attendance_mainInterval) clearInterval(attendance_mainInterval);
             attendance_mainInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
             startCountdown(newTotalSeconds, "Сброс сессии");
        }

        function selectMonth(selectElementPCLID) {
            const targetValueMonth = getCurrentMonthValue();
            let attempts = 0;
            const checkIntervalMonth = setInterval(() => {
                if (window.location.pathname !== processedPath) {
                    clearInterval(checkIntervalMonth); return;
                }
                const selectElementMonth = document.querySelector(selectSelectorMonth);
                if (selectElementMonth) {
                    clearInterval(checkIntervalMonth);
                    log(`S2: Элемент MonthsFilter найден. Перехожу к установке.`);
                    setTimeout(() => {
                        if (window.location.pathname !== processedPath) return;
                        const targetOption = selectElementMonth.querySelector(`option[value="${targetValueMonth}"]`);
                        if (targetOption) {
                            selectElementMonth.value = targetValueMonth;
                            log(`S2: Успех (3/3): Установлен месяц "${targetOption.textContent}".`);
                            const event = new Event('change', { bubbles: true });
                            selectElementMonth.dispatchEvent(event);
                            applyAngular(selectElementMonth, "финального выбора MonthsFilter");
                            startKeepAliveTimer();
                        } else {
                            log(`S2: Опция с value="${targetValueMonth}" не найдена.`, 'warn');
                            applyAngular(selectElementMonth, "финального $apply при отсутствии месяца");
                            startKeepAliveTimer();
                        }
                    }, INITIAL_DELAY);
                } else {
                    attempts++;
                    if (attempts >= MAX_ATTEMPTS) {
                        clearInterval(checkIntervalMonth);
                        log(`S2: Элемент MonthsFilter не найден. Скрипт завершен.`, 'error');
                        applyAngular(selectElementPCLID, "обработки ошибки MonthsFilter");
                    }
                }
            }, 100);
        }

        function selectSubject(selectElementPCLID) {
            let attempts = 0;
            const checkIntervalSGID = setInterval(() => {
                if (window.location.pathname !== processedPath) { clearInterval(checkIntervalSGID); return; }
                const selectElementSGID = document.querySelector(selectSelectorSGID);
                if (selectElementSGID) {
                    clearInterval(checkIntervalSGID);
                    log(`S2: Элемент SGID найден. Перехожу к установке.`);
                    setTimeout(() => {
                        if (window.location.pathname !== processedPath) return;
                        const targetOption = selectElementSGID.querySelector(`option[value="${targetValueSGID}"]`);
                        if (targetOption) {
                            selectElementSGID.value = targetValueSGID;
                            log(`S2: Успех (2/3): Установлен предмет "${targetOption.textContent}".`);
                            const event = new Event('change', { bubbles: true });
                            selectElementSGID.dispatchEvent(event);
                            if (applyAngular(selectElementSGID, "второго выбора SGID")) {
                                setTimeout(() => selectMonth(selectElementPCLID), STABILIZATION_DELAY);
                            } else {
                                log("S2: Критическая ошибка $apply.", 'error');
                            }
                        } else {
                            log(`S2: Опция с value="${targetValueSGID}" не найдена.`, 'warn');
                            setTimeout(() => selectMonth(selectElementPCLID), STABILIZATION_DELAY);
                        }
                    }, INITIAL_DELAY);
                } else {
                    attempts++;
                    if (attempts >= MAX_ATTEMPTS) {
                        clearInterval(checkIntervalSGID);
                        log(`S2: Элемент SGID не найден. Прерываю.`, 'error');
                        applyAngular(selectElementPCLID, "обработки ошибки SGID");
                    }
                }
            }, 100);
        }

        function selectClass(selectElementPCLID) {
            setTimeout(() => {
                if (window.location.pathname !== processedPath) return;
                log("S2: Начинаю выбор класса.");
                const options = Array.from(selectElementPCLID.querySelectorAll('option[value]:not([value=""])'));
                let classSelected = false;

                if (options.length > 1) {
                    log(`S2: Обнаружено несколько классов. Ищу класс: "${ATTENDANCE_TARGET_CLASS_NAME}"...`);
                    const targetOption = options.find(opt => opt.textContent.trim() === ATTENDANCE_TARGET_CLASS_NAME);
                    if (targetOption) {
                        selectElementPCLID.value = targetOption.value;
                        log(`S2: Успех (1/3): Установлен класс "${targetOption.textContent}".`);
                        const event = new Event('change', { bubbles: true });
                        selectElementPCLID.dispatchEvent(event);
                        classSelected = true;
                    } else {
                        log(`S2: Опция с текстом "${ATTENDANCE_TARGET_CLASS_NAME}" не найдена. Пропускаю.`, 'warn');
                    }
                } else {
                    log(`S2: Класс один или отсутствуют опции. Авто-выбор класса пропущен.`);
                }

                if (classSelected) {
                    if (applyAngular(selectElementPCLID, "выбора PCLID (S2)")) {
                         log(`S2: Жду ${STABILIZATION_DELAY} мс ПЕРЕД поиском предмета.`);
                         setTimeout(() => selectSubject(selectElementPCLID), STABILIZATION_DELAY);
                    } else {
                         setTimeout(() => selectSubject(selectElementPCLID), STABILIZATION_DELAY);
                    }
                } else {
                    selectSubject(selectElementPCLID);
                }
            }, INITIAL_DELAY);
        }

        function pollForElement() {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                if (window.location.pathname !== processedPath) { clearInterval(checkInterval); return; }
                const selectElement = document.querySelector(selectSelectorPCLID);
                if (selectElement) {
                    clearInterval(checkInterval);
                    log(`S2: Основной элемент PCLID найден. Переход к выбору.`);
                    selectClass(selectElement);
                } else {
                    attempts++;
                    if (attempts >= MAX_ATTEMPTS) log(`S2: Основной элемент PCLID не найден.`, 'error');
                }
            }, 100);
        }
        pollForElement();
    }

    // --- (S3) Модуль: Редактор Урока ---

    function lessonEdit_handleModalAppearance(mutationsList, observer) {
        const modal = document.querySelector(LESSON_MODAL_SELECTOR);
        if (!modal || !session_S3_scriptClickFlag) return;
        log(`[КАСКАД S3] Обнаружено модальное окно "Внимание!" (инициировано скриптом).`);
        session_S3_scriptClickFlag = false;

        const okButton = document.querySelector(LESSON_MODAL_OK_BUTTON_SELECTOR);
        if (okButton) {
            okButton.click();
            log(`[КАСКАД S3] Нажата кнопка "Ок".`);
            setTimeout(() => {
                const saveAndBackButton = document.querySelector(LESSON_SAVE_AND_BACK_BUTTON_SELECTOR);
                if (saveAndBackButton) {
                    saveAndBackButton.click();
                    log(`[КАСКАД S3] Нажата кнопка "Сохранить и вернуться".`);
                }
            }, 200);
        }
    }

    function lessonEdit_handleManualSaveLogic() {
        if (session_isGlobalModalActive) return;
        log("[РУЧНОЙ КЛИК S3] Обнаружено ручное нажатие 'Сохранить'.");
        let manualSaveObserver = null;
        let manualSaveTimeout = null;
        let changeDetected = false;
        const mainContent = document.body;

        manualSaveObserver = new MutationObserver((mutationsList, obs) => {
            const modal = document.querySelector(LESSON_MODAL_SELECTOR);
            const isNoChangeModal = modal && modal.textContent.includes(LESSON_NO_CHANGE_MESSAGE);
            if (isNoChangeModal) {
                changeDetected = true;
                obs.disconnect(); clearTimeout(manualSaveTimeout);
                log("[РУЧНОЙ КЛИК S3] Обнаружено модальное окно 'Данные не были изменены!'.");
                const okButton = modal.querySelector(LESSON_MODAL_OK_BUTTON_SELECTOR);
                if (okButton) okButton.click();
            }
        });
        manualSaveObserver.observe(mainContent, { childList: true, subtree: true });

        manualSaveTimeout = setTimeout(() => {
            if (manualSaveObserver) manualSaveObserver.disconnect();
            if (!changeDetected) session_restartTimer("Ручное нажатие 'Сохранить' с изменениями");
        }, 1000);
    }

    function lessonEdit_clickSaveAndSetFlag() {
        if (session_isGlobalModalActive) return;
        if (window.location.pathname !== processedPath) { cleanupPreviousLogic(); return; }
        log(`[КАСКАД S3] Запуск действия по поддержанию сессии...`);
        const saveButton = document.querySelector(LESSON_SAVE_BUTTON_SELECTOR);
        if (saveButton && !saveButton.disabled) {
            session_S3_scriptClickFlag = true;
            saveButton.click();
            log(`[КАСКАД S3] Нажата кнопка: Сохранить.`);
        } else {
            session_S3_scriptClickFlag = false;
        }
    }

    function handleLessonEditAutomation() {
        log("S3: Начинаю автоматизацию страницы РЕДАКТОРА УРОКА.");
        if (lessonEdit_modalObserver) lessonEdit_modalObserver.disconnect();
        lessonEdit_modalObserver = new MutationObserver(lessonEdit_handleModalAppearance);
        lessonEdit_modalObserver.observe(document.body, { childList: true, subtree: true });

        waitForElement(LESSON_SAVE_BUTTON_SELECTOR, (saveButton) => {
            saveButton.removeEventListener('click', lessonEdit_handleManualSaveLogic);
            saveButton.addEventListener('click', lessonEdit_handleManualSaveLogic);
        });

        const callback = () => { lessonEdit_clickSaveAndSetFlag(); startCountdown(SESSION_KEEP_ALIVE_MS / 1000, "Сброс сессии"); };
        if (lessonEdit_mainInterval) clearInterval(lessonEdit_mainInterval);
        lessonEdit_mainInterval = setInterval(callback, SESSION_KEEP_ALIVE_MS);
        startCountdown(SESSION_KEEP_ALIVE_MS / 1000, "Сброс сессии");
        log(`S3: Скрипт сброса сессии запущен.`);
    }


    // =================================================================
    // --- 4. ГЛАВНЫЙ РОУТЕР И ТОЧКА ВХОДА ---
    // =================================================================

    function cleanupPreviousLogic() {
        stopCountdown();
        if (journal_errorObserver) { journal_errorObserver.disconnect(); journal_errorObserver = null; }
        if (journal_errorRetryTimeout) { clearTimeout(journal_errorRetryTimeout); journal_errorRetryTimeout = null; }
        if (attendance_mainInterval) { clearInterval(attendance_mainInterval); attendance_mainInterval = null; }
        if (lessonEdit_mainInterval) { clearInterval(lessonEdit_mainInterval); lessonEdit_mainInterval = null; }
        if (lessonEdit_modalObserver) { lessonEdit_modalObserver.disconnect(); lessonEdit_modalObserver = null; }
        session_S1_scriptClickFlag = false;
        session_S3_scriptClickFlag = false;
        if (activeWaiters.length > 0) {
            activeWaiters.forEach(waiter => { waiter.observer?.disconnect(); clearTimeout(waiter.timeoutId); });
            activeWaiters = [];
        }
    }

    function routeLogic() {
        const newPath = window.location.pathname;
        if (newPath === processedPath) return;

        log(`====================================================`);
        log(`РОУТЕР: Обнаружен новый путь: ${newPath}`);
        log(`====================================================`);

        cleanupPreviousLogic();
        processedPath = newPath;

        if (newPath.includes(ROLE_PAGE_PATH)) handleRoleBypassAutomation();
        else if (newPath.startsWith(SCHEDULE_PAGE_PATH)) handleJournalNavigationAutomation();
        else if (newPath.startsWith(EDIT_PAGE_PATH)) handleLessonEditAutomation();
        else if (newPath.startsWith(ATTENDANCE_PAGE_PATH)) handleAttendanceAutomation();
        else if (newPath.startsWith(JOURNAL_PAGE_PATH)) handleJournalLoadAutomation();
        else log(`РОУТЕР: Путь не распознан, действий не требуется.`);
    }

    injectGlobalStyles();
    log(`Объединенный скрипт v1.2 (24.11.2025) ЗАПУЩЕН.`);
    if (globalModalObserver) globalModalObserver.disconnect();
    globalModalObserver = new MutationObserver(globalModalObserver_Callback);
    globalModalObserver.observe(document.body, { childList: true, subtree: true });
    log("РОУТЕР: Главный MutationObserver (Глобальная блокировка) прикреплен к <body>.");

    setTimeout(routeLogic, 500);
    if (mainObserver) mainObserver.disconnect();
    mainObserver = new MutationObserver(routeLogic);
    mainObserver.observe(document.body, { childList: true, subtree: true });

})();