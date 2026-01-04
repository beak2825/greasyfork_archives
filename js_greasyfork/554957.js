// ==UserScript==
// @name         Kaiten Time Tracker
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  Таймер для карточек kaiten
// @author       NeTan
// @match        https://*.kaiten.ru/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kaiten.ru
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554957/Kaiten%20Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/554957/Kaiten%20Time%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ СЕЛЕКТОРОВ ---
    const BOARD_CARD_SELECTOR = '.boardCard';
    const CARD_ID_ATTRIBUTE = 'data-card-id';
    const OPEN_CARD_SELECTOR = '.cardModalContent';

    // --- ОБЩИЕ НАСТРОЙКИ ---
    const STORAGE_PREFIX = 'kaiten_tracker_';
    const CONFIG_KEY = 'kaiten_tracker_config';
    const UPDATE_INTERVAL = 1000;

    let timers = {};
    let timerState = {};
    let config = {};

    // --- ВНЕДРЕНИЕ СТИЛЕЙ (CSS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Базовый контейнер */
        .k-tracker-container {
            background: rgba(171, 71, 188, 0.25);
            color: white;
            border-radius: 4px;
            padding: 0px;
            font-size: 13px; /* Чуть увеличили шрифт времени */
            line-height: 1;
            display: inline-flex;
            align-items: center;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            height: 26px; /* Чуть выше, чтобы кнопки влезли свободно */
            box-sizing: border-box;

            /* ВАЖНО: Прижимаем вправо */
            margin-left: auto !important;

            position: relative;
            z-index: 100;
            cursor: default;
        }

        /* АКТИВНЫЙ РЕЖИМ (Таймер идет) */
        .k-tracker-container.k-tracker-running {
            background: rgba(211, 47, 47, 0.95) !important;
            box-shadow: 0 0 5px rgba(211, 47, 47, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes k-blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }

        /* Кнопки */
        .k-tracker-btn {
            padding: 0;
            width: 24px;  /* УВЕЛИЧЕНО: Было 20px */
            height: 24px; /* УВЕЛИЧЕНО: Было 20px */
            cursor: pointer;
            color: white;
            border: none;
            border-radius: 3px;

            /* УВЕЛИЧЕНО: Размер иконок */
            font-size: 18px;
            font-weight: bold;

            /* ЦЕНТРИРОВАНИЕ */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0; /* Важно для вертикального центра */


            margin-left: 5px;
            transition: transform 0.1s;
        }
        .k-tracker-btn:hover { opacity: 0.8; }
        .k-tracker-btn:active { transform: scale(0.95); }

        .k-tracker-play { background: #4CAF50; }
        .k-tracker-edit { background: #3f51b5; }

        /* КНОПКА СТОП (Контрастная) */
        .k-tracker-stop {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255,255,255,0.5);
        }

        /* Когда таймер идет, кнопка паузы белая с красным знаком */
        .k-tracker-running .k-tracker-stop {
            background: #ffffff !important;
            color: #d32f2f !important;
            border: 1px solid #fff;
            animation: k-blink 1s infinite;
        }

        /* Текст времени */
        .k-tracker-display {
            font-weight: bold;
            font-variant-numeric: tabular-nums;
            display: inline-flex;
            align-items: center;
            margin-right: 2px;
            padding-left: 3px;
        }
    `;
    document.head.appendChild(style);


    // --- ФУНКЦИИ КОНФИГУРАЦИИ И ДАННЫХ ---
    function loadConfig() {
        const stored = localStorage.getItem(CONFIG_KEY);
        config = stored ? JSON.parse(stored) : {};
        if (typeof config.singleTimerMode !== 'boolean') config.singleTimerMode = true;
    }
    function saveConfig() { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); }
    loadConfig();

    function loadState(cardId) {
        const stored = localStorage.getItem(STORAGE_PREFIX + cardId);
        timerState[cardId] = stored ? JSON.parse(stored) : { totalTime: 0, startTime: null };
        return timerState[cardId];
    }

    function saveState(cardId) {
        localStorage.setItem(STORAGE_PREFIX + cardId, JSON.stringify(timerState[cardId]));
        updateDisplay(cardId);
    }

    function getAllTrackerData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(STORAGE_PREFIX)) {
                data[key.substring(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(key));
            }
        }
        return data;
    }

    // --- ЛОГИКА ВРЕМЕНИ ---
    function calculateCurrentTotalTime(cardId) {
        const state = timerState[cardId];
        let currentTime = state.totalTime;
        if (state.startTime !== null) {
            currentTime += (Date.now() - state.startTime) / 1000;
        }
        return currentTime;
    }

    function formatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateDisplay(cardId) {
        const state = timerState[cardId];
        const currentTime = calculateCurrentTotalTime(cardId);
        const isRunning = state.startTime !== null;

        const elements = document.querySelectorAll(`[${CARD_ID_ATTRIBUTE}="${cardId}"]`);

        elements.forEach(element => {
            const container = element.querySelector('.k-tracker-container');
            const timeText = element.querySelector('.k-tracker-time-text');
            const playBtn = element.querySelector('.k-tracker-play');
            const stopBtn = element.querySelector('.k-tracker-stop');
            const editBtn = element.querySelector('.k-tracker-edit');

            if (timeText) {
                timeText.textContent = formatTime(currentTime);

                if (container) {
                    if (isRunning) container.classList.add('k-tracker-running');
                    else container.classList.remove('k-tracker-running');
                }

                if (playBtn) playBtn.style.display = isRunning ? 'none' : 'inline-flex';
                if (stopBtn) stopBtn.style.display = isRunning ? 'inline-flex' : 'none';
                if (editBtn) editBtn.style.display = isRunning ? 'none' : 'inline-flex';
            }
        });
    }

    function getRunningCardId() {
        for (const cardId in timerState) {
            if (timerState[cardId].startTime !== null) return cardId;
        }
        return null;
    }

    function startTimer(cardId) {
        const state = timerState[cardId];
        if (state.startTime === null && config.singleTimerMode) {
            const runningCardId = getRunningCardId();
            if (runningCardId !== null && runningCardId !== cardId) {
                if (confirm(`Таймер уже запущен в задаче ${runningCardId}. Переключиться?`)) {
                    stopTimer(runningCardId);
                } else {
                    return;
                }
            }
        }
        if (state.startTime !== null) {
            if (!timers[cardId]) timers[cardId] = setInterval(() => updateDisplay(cardId), UPDATE_INTERVAL);
            return;
        }
        state.startTime = Date.now();
        saveState(cardId);
        if (!timers[cardId]) timers[cardId] = setInterval(() => updateDisplay(cardId), UPDATE_INTERVAL);
    }

    function stopTimer(cardId) {
        const state = timerState[cardId];
        if (state.startTime === null) return;
        state.totalTime += (Date.now() - state.startTime) / 1000;
        state.startTime = null;
        saveState(cardId);
        clearInterval(timers[cardId]);
        delete timers[cardId];
    }

    function editTime(cardId) {
        const totalTime = calculateCurrentTotalTime(cardId);
        const newTimeStr = prompt(`Новое время (ЧЧ:ММ:СС):`, formatTime(totalTime));
        if (newTimeStr) {
            const parts = newTimeStr.split(':').map(p => parseInt(p.trim(), 10));
            if (parts.length === 3 && !parts.some(isNaN)) {
                if (timerState[cardId].startTime !== null) stopTimer(cardId);
                timerState[cardId].totalTime = parts[0] * 3600 + parts[1] * 60 + parts[2];
                saveState(cardId);
            } else {
                alert('Неверный формат.');
            }
        }
    }

    function getCardId(element) {
        let cardId = element.getAttribute(CARD_ID_ATTRIBUTE);
        if (cardId) return cardId;
        const idElement = element.querySelector('[data-testid="card-id-in-card-header"]');
        if (idElement) return idElement.textContent.match(/#(\d+)/)?.[1];
        if (element.matches(OPEN_CARD_SELECTOR)) return window.location.pathname.match(/\/card\/(\d+)/)?.[1];
        return null;
    }

    // --- СОЗДАНИЕ ЭЛЕМЕНТОВ ---
    function createTrackerElements(element, cardId) {
        if (element.querySelector('.k-tracker-container')) return;

        const isModal = element.matches(OPEN_CARD_SELECTOR);
        const uniqueClass = isModal ? 'tracker-initialized-modal' : 'tracker-initialized-board';
        if (element.classList.contains(uniqueClass)) return;

        element.setAttribute(CARD_ID_ATTRIBUTE, cardId);
        loadState(cardId);

        // Создаем DOM элементы
        const container = document.createElement('div');
        container.className = 'k-tracker-container';
        if(isModal) container.style.marginLeft = '12px';

        const display = document.createElement('div');
        display.className = 'k-tracker-display';

        const timeText = document.createElement('span');
        timeText.className = 'k-tracker-time-text';
        timeText.innerText = '00:00:00';

        display.appendChild(timeText);

        const createBtn = (cls, html, title, action) => {
            const btn = document.createElement('button');
            btn.className = `k-tracker-btn ${cls}`;
            btn.innerHTML = html;
            btn.title = title;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                action(cardId);
            });
            return btn;
        };

        const playBtn = createBtn('k-tracker-play', '▶', 'Старт', startTimer);
        const stopBtn = createBtn('k-tracker-stop', '⏸', 'Пауза', stopTimer);
        const editBtn = createBtn('k-tracker-edit', '✎', 'Ред.', editTime);

        container.appendChild(display);
        container.appendChild(playBtn);
        container.appendChild(stopBtn);
        container.appendChild(editBtn);

        // --- ЛОГИКА ВСТАВКИ ---
       let inserted = false;

        if (isModal) {
            // Вставка в модальное окно
            const timeIcons = element.querySelectorAll('[data-testid="AccessTimeIcon"]');
            for (const icon of timeIcons) {
                const metaContainer = icon.parentElement?.parentElement;
                if (metaContainer && metaContainer.tagName === 'DIV') {
                    // Проверяем, не вставили ли мы уже сюда (на всякий случай)
                    if (metaContainer.contains(container)) {
                        inserted = true;
                        break;
                    }
                    metaContainer.style.display = 'flex';
                    metaContainer.style.alignItems = 'center';
                    metaContainer.appendChild(container);
                    inserted = true;
                    break;
                }
            }

            // [ИСПРАВЛЕНИЕ]
            // Если мы в модальном окне, но не нашли место для вставки (иконку),
            // значит контент карточки еще не прогрузился.
            // Мы ПРЕРЫВАЕМ выполнение, не ставим класс initialized и ждем,
            // пока MutationObserver дернет эту функцию снова (когда появятся иконки).
            if (!inserted) {
                return;
            }

            // Убрали Fallback блок, который вставлял таймер в заголовок,
            // так как он срабатывал раньше времени.
        } else {
            // Вставка в мини-карточку на доске (оставляем как было)
            // 1. Ищем ID (#12345)
            const idDiv = Array.from(element.querySelectorAll('div')).find(div =>
                div.textContent.trim().startsWith('#') && div.textContent.includes(',')
            );

            // ... остальной код для доски ...
            if (idDiv) {
                const footer = idDiv.previousElementSibling;
                if (footer && getComputedStyle(footer).display === 'flex') {
                    footer.style.width = '100%';
                    footer.style.justifyContent = 'space-between';
                    footer.appendChild(container);
                    inserted = true;
                } else {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'flex';
                    wrapper.style.width = '100%';
                    wrapper.style.justifyContent = 'flex-end';
                    wrapper.style.marginTop = '4px';
                    wrapper.style.marginBottom = '4px';
                    wrapper.appendChild(container);
                    idDiv.parentNode.insertBefore(wrapper, idDiv);
                    inserted = true;
                }
            }

            // Fallback для доски можно оставить
            if (!inserted) {
                const target = element.querySelector('.k-card__footer') || element;
                target.appendChild(container);
            }
        }

        // Если мы дошли сюда, значит вставка прошла успешно
        element.classList.add(uniqueClass);
        updateDisplay(cardId);
        if (timerState[cardId].startTime !== null) startTimer(cardId);
    }

    // --- Меню Tampermonkey ---
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand === 'undefined') return;
        GM_registerMenuCommand(`⏱️ Режим одного таймера: ${config.singleTimerMode ? 'ВКЛ' : 'ВЫКЛ'}`, () => {
            config.singleTimerMode = !config.singleTimerMode;
            saveConfig();
            alert(`Режим одного таймера: ${config.singleTimerMode ? 'ВКЛ' : 'ВЫКЛ'}.`);
        });
        GM_registerMenuCommand("💾 Управление данными (Импорт/Экспорт)", () => {
            const action = prompt("1 - Экспорт\n2 - Импорт");
            if (action === '1') {
                const w = window.open("", "", "width=600,height=400");
                w.document.write(`<textarea style="width:100%;height:90%">${JSON.stringify(getAllTrackerData(), null, 2)}</textarea>`);
            }
            if (action === '2') {
                try {
                    const d = JSON.parse(prompt("JSON:") || "{}");
                    Object.keys(d).forEach(k => localStorage.setItem(STORAGE_PREFIX + k, JSON.stringify(d[k])));
                    alert("Готово");
                } catch(e) { alert("Ошибка"); }
            }
        });
    }
    registerMenuCommands();

    function processElement(element) {
        const cardId = getCardId(element);
        if (cardId) createTrackerElements(element, cardId);
    }

    function scanForElements() {
        document.querySelectorAll(BOARD_CARD_SELECTOR).forEach(processElement);
        document.querySelectorAll(OPEN_CARD_SELECTOR).forEach(processElement);
    }

    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const m of mutations) {
            if (m.addedNodes.length) shouldScan = true;
        }
        if (shouldScan) scanForElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(scanForElements, 1500);
})();