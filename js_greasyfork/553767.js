// ==UserScript==
// @name         JanitorAI Auto-Cycler
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Автоматизирует отправку сообщений, перелистывание ответов и создание новых чатов на JanitorAI с удобным UI. Переживает перезагрузку страницы.
// @author       Your Professional Developer
// @match        https://janitorai.com/chats/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553767/JanitorAI%20Auto-Cycler.user.js
// @updateURL https://update.greasyfork.org/scripts/553767/JanitorAI%20Auto-Cycler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- СТИЛИ ДЛЯ ИНТЕРФЕЙСА (без изменений) ---
    GM_addStyle(`
        #auto-cycler-panel {
            position: fixed; top: 20px; right: 20px; width: 320px; background-color: #2c2f33; border: 1px solid #4f545c;
            border-radius: 8px; z-index: 9999; color: #ffffff; font-family: Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            overflow: hidden;
        }
        #auto-cycler-panel .header {
            background-color: #7289da; padding: 12px; font-weight: bold; font-size: 16px; cursor: move; user-select: none;
        }
        #auto-cycler-panel .content { padding: 15px; }
        #auto-cycler-panel .control-group { margin-bottom: 15px; }
        #auto-cycler-panel label { display: block; margin-bottom: 5px; font-size: 14px; color: #b9bbbe; }
        #auto-cycler-panel input {
            width: 100%; padding: 8px; box-sizing: border-box; background-color: #40444b; border: 1px solid #202225;
            border-radius: 4px; color: #dcddde;
        }
        #auto-cycler-panel .button-group { display: flex; justify-content: space-between; gap: 10px; }
        #auto-cycler-panel button {
            flex-grow: 1; padding: 10px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background-color 0.2s;
        }
        #auto-cycler-panel #startBtn { background-color: #43b581; color: white; }
        #auto-cycler-panel #startBtn:disabled { background-color: #3a4b41; cursor: not-allowed; }
        #auto-cycler-panel #stopBtn { background-color: #f04747; color: white; }
        #auto-cycler-panel #stopBtn:disabled { background-color: #4f3636; cursor: not-allowed; }
        #auto-cycler-panel #log-container {
            margin-top: 15px; background-color: #202225; border-radius: 4px; padding: 10px;
        }
        #auto-cycler-panel #log-container h4 {
            margin-top: 0; margin-bottom: 8px; font-size: 14px; color: #b9bbbe; border-bottom: 1px solid #4f545c; padding-bottom: 5px;
        }
        #auto-cycler-panel #log {
            height: 120px; overflow-y: auto; font-size: 12px; color: #dcddde; white-space: pre-wrap; word-break: break-all;
        }
        #auto-cycler-panel #log::-webkit-scrollbar { width: 8px; }
        #auto-cycler-panel #log::-webkit-scrollbar-track { background: #2f3136; }
        #auto-cycler-panel #log::-webkit-scrollbar-thumb { background: #7289da; border-radius: 4px; }
    `);

    // --- HTML-КОД ИНТЕРФЕЙСА (без изменений) ---
    const panelHTML = `
        <div id="auto-cycler-panel">
            <div class="header">JanitorAI Авто-цикл</div>
            <div class="content">
                <div class="control-group">
                    <label for="messageText">Текст сообщения:</label>
                    <input type="text" id="messageText" value="Test">
                </div>
                <div class="control-group">
                    <label for="swipeCount">Количество перелистываний:</label>
                    <input type="number" id="swipeCount" value="10" min="1">
                </div>
                <div class="button-group">
                    <button id="startBtn">Запустить</button>
                    <button id="stopBtn" disabled>Остановить</button>
                </div>
                <div id="log-container">
                    <h4>Статус:</h4>
                    <div id="log">Ожидание запуска...</div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // --- ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ УПРАВЛЕНИЯ ---
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const logEl = document.getElementById('log');
    const messageTextInput = document.getElementById('messageText');
    const swipeCountInput = document.getElementById('swipeCount');

    // =========================================================================
    // === НОВАЯ ЛОГИКА: Ключи для хранения состояния в sessionStorage ===
    // =========================================================================
    const STATE_KEY = 'autoCyclerState';
    const MESSAGE_KEY = 'autoCyclerMessage';
    const SWIPES_KEY = 'autoCyclerSwipes';

    let isRunning = false;

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (без изменений) ---
    function log(message) {
        console.log(`[Auto-Cycler] ${message}`);
        const timestamp = new Date().toLocaleTimeString();
        logEl.innerHTML += `[${timestamp}] ${message}\n`;
        logEl.scrollTop = logEl.scrollHeight;
    }
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) { clearInterval(interval); resolve(element); }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Элемент не найден: ${selector} (таймаут ${timeout / 1000}с)`));
            }, timeout);
        });
    }
    function findElementByText(selector, text) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) { if (el.textContent.trim() === text) return el; }
        return null;
    }
    function waitForElementByText(selector, text, timeout = 10000) {
         return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = findElementByText(selector, text);
                if (element) { clearInterval(interval); resolve(element); }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Элемент с текстом "${text}" не найден: ${selector}`));
            }, timeout);
        });
    }
    function simulateTyping(element, text) {
        element.click();
        element.focus();
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextareaValueSetter.call(element, text);
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    }


    // --- ОСНОВНАЯ ЛОГИКА СКРИПТА ---
    async function startScript() {
        if (isRunning) return;
        isRunning = true;

        startBtn.disabled = true;
        stopBtn.disabled = false;
        messageTextInput.disabled = true;
        swipeCountInput.disabled = true;
        logEl.innerHTML = '';
        log('Скрипт запущен!');

        // =========================================================================
        // === НОВАЯ ЛОГИКА: Сохраняем состояние при запуске ===
        // =========================================================================
        const messageText = messageTextInput.value;
        const swipeCount = parseInt(swipeCountInput.value, 10);
        sessionStorage.setItem(STATE_KEY, 'running');
        sessionStorage.setItem(MESSAGE_KEY, messageText);
        sessionStorage.setItem(SWIPES_KEY, swipeCount);
        // =========================================================================

        let outerLoopCount = 0;

        while (isRunning) {
            outerLoopCount++;
            log(`--- Начало основного цикла #${outerLoopCount} ---`);
            try {
                // ШАГ 1: Отправка сообщения
                log('1. Ожидание поля для ввода сообщения...');
                const textarea = await waitForElement('textarea[placeholder*="Enter to send chat"]');
                log('   Поле найдено. Вводим текст: "' + messageText + '"');
                simulateTyping(textarea, messageText);
                await delay(500);

                log('2. Ожидание кнопки отправки...');
                const sendButton = await waitForElement('button[aria-label="Send"]:not([disabled])');
                log('   Кнопка найдена и активна. Отправляем сообщение.');
                sendButton.click();
                await delay(1000);

                // ШАГ 2: Цикл перелистываний
                log(`3. Начало цикла перелистываний (${swipeCount} раз).`);
                for (let i = 0; i < swipeCount; i++) {
                    if (!isRunning) break;
                    log(`   Перелистывание ${i + 1}/${swipeCount}...`);
                    const nextButton = await waitForElement('button[aria-label="Next"]', 20000);
                    log('   Кнопка "Next" найдена, нажимаем.');
                    nextButton.click();
                    log('   Ожидаем 3 секунды...');
                    await delay(3000);
                    const stopGeneratingButton = document.querySelector('button[aria-label="Cancel"]');
                    if (stopGeneratingButton) {
                        log('   Найдена кнопка остановки генерации. Нажимаем.');
                        stopGeneratingButton.click();
                        await delay(500);
                    } else {
                        log('   Кнопка остановки генерации не найдена, продолжаем.');
                    }
                }
                if (!isRunning) break;

                // ШАГ 3-5: Создание нового чата
                log('4. Открываем меню...');
                const menuTrigger = await waitForElement('div[class*="_menuTrigger"] button');
                menuTrigger.click();
                await delay(500);

                log('5. Нажимаем "New Chat"...');
                const newChatButton = await waitForElementByText('button[class*="_menuItem"]', 'New Chat');
                newChatButton.click();
                await delay(500);

                log('6. Подтверждаем создание нового чата... (Далее страница перезагрузится)');
                const confirmButton = await waitForElementByText('button', 'Select');
                // Перед кликом, который вызовет перезагрузку, мы уже сохранили состояние.
                // Теперь скрипт готов к перезапуску на новой странице.
                confirmButton.click();
                // После этого клика скрипт прервется и перезапустится на новой странице.
                // Мы не дойдем до конца этого цикла.

            } catch (error) {
                log(`ОШИБКА: ${error.message}`);
                log('Работа скрипта прервана из-за ошибки. Нажмите "Стоп", а затем "Запустить" для перезапуска.');
                stopScript(false); // Останавливаем и чистим sessionStorage
                break;
            }
        }
    }

    // =========================================================================
    // === ИЗМЕНЕННАЯ ФУНКЦИЯ: Теперь она также чистит sessionStorage ===
    // =========================================================================
    function stopScript(logMessage = true) {
        if (!isRunning && !logMessage) return;
        isRunning = false;

        // Чистим хранилище, чтобы скрипт не запустился сам после перезагрузки
        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(MESSAGE_KEY);
        sessionStorage.removeItem(SWIPES_KEY);

        startBtn.disabled = false;
        stopBtn.disabled = true;
        messageTextInput.disabled = false;
        swipeCountInput.disabled = false;
        if (logMessage) {
           log('Скрипт остановлен пользователем.');
        }
    }
    // =========================================================================

    // --- ПРИВЯЗКА СОБЫТИЙ К КНОПКАМ ---
    startBtn.addEventListener('click', startScript);
    stopBtn.addEventListener('click', () => stopScript(true));


    // --- Перетаскивание панели (без изменений) ---
    const panel = document.getElementById('auto-cycler-panel');
    const header = panel.querySelector('.header');
    let isDragging = false, offset = { x: 0, y: 0 };
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset.x = e.clientX - panel.getBoundingClientRect().left;
        offset.y = e.clientY - panel.getBoundingClientRect().top;
        header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = `${e.clientX - offset.x}px`;
        panel.style.top = `${e.clientY - offset.y}px`;
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    });

    // =========================================================================
    // === НОВАЯ ЛОГИКА: Автоматический запуск скрипта после перезагрузки ===
    // =========================================================================
    function checkAndRestart() {
        if (sessionStorage.getItem(STATE_KEY) === 'running') {
            // Если мы нашли запись о том, что скрипт должен работать:
            const savedMessage = sessionStorage.getItem(MESSAGE_KEY) || 'Test';
            const savedSwipes = sessionStorage.getItem(SWIPES_KEY) || '10';

            // Обновляем поля ввода в нашем UI, чтобы они соответствовали сохраненным настройкам
            messageTextInput.value = savedMessage;
            swipeCountInput.value = savedSwipes;

            log('Обнаружено состояние "запущено" после перезагрузки. Автоматический перезапуск...');

            // Запускаем скрипт!
            startScript();
        }
    }

    // Проверяем, нужно ли перезапускаться, как только страница загрузится
    checkAndRestart();

})();