// ==UserScript==
// @name         LootGuru Advanced Automation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Продвинутая автоматизация для LootGuru с плавающей панелью.
// @author       Your Assistant
// @match        https://gameguru.ru/lootguru/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552828/LootGuru%20Advanced%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/552828/LootGuru%20Advanced%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Стили для панели ---
    const styles = `
        #automation-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background-color: rgba(30, 32, 33, 0.9);
            border: 1px solid #736b5e;
            border-radius: 8px;
            padding: 15px;
            color: #e8e6e3;
            width: 280px;
            font-family: 'Formular', sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            user-select: none;
        }
        #automation-header {
            cursor: move;
            padding-bottom: 10px;
            border-bottom: 1px solid #545b5e;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #automation-header h3 {
            margin: 0;
            font-size: 16px;
        }
        .automation-toggle {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .automation-toggle label {
            margin-right: 10px;
            flex-grow: 1;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #555;
            transition: .4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #4CAF50;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        #automation-log {
            background-color: #111;
            border: 1px solid #545b5e;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            height: 100px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        #automation-log p {
            margin: 0 0 5px 0;
            padding: 0;
            border-bottom: 1px solid #333;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Создание UI ---
    const panel = document.createElement('div');
    panel.id = 'automation-panel';
    panel.innerHTML = `
        <div id="automation-header">
            <h3>🤖 LootGuru Automation</h3>
        </div>
        <div class="automation-toggle">
            <label for="master-toggle">Включить автоматизацию</label>
            <label class="switch">
                <input type="checkbox" id="master-toggle">
                <span class="slider"></span>
            </label>
        </div>
        <div>
            <label>Лог действий:</label>
            <div id="automation-log"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // --- Переменные и состояние ---
    const masterToggle = document.getElementById('master-toggle');
    const logContainer = document.getElementById('automation-log');
    let automationInterval = null;
    let isAutomationRunning = false;

    // --- Функции-помощники ---
    function log(message) {
        console.log(`[Automation] ${message}`);
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(p);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function findAndClick(selector, logMessage) {
        const element = document.querySelector(selector);
        if (element) {
            log(logMessage);
            element.click();
            return true;
        }
        return false;
    }

    // --- Логика автоматизации ---
    function runAutomationCycle() {
        if (!isAutomationRunning) return;

        log('Проверка состояния...');

        // 1. Сбор наград (самый высокий приоритет)
        if (findAndClick('.trip__portal--results', 'Обнаружено завершенное приключение. Собираю награды...')) {
            setTimeout(() => {
                findAndClick('.message__footer .button--secondary', 'Нажимаю "Продолжить"...');
            }, 1500); // Задержка, чтобы модальное окно успело появиться
            return;
        }

        // 2. Проверка, готов ли текущий герой
        const activePortal = document.querySelector('.trip__portal--active');
        if (activePortal) {
            log('Текущий герой готов. Отправляю в приключение...');
            activePortal.click();
            setTimeout(() => {
                findAndClick('.message__footer .button--primary', 'Подтверждаю отправку...');
            }, 1500);
            return;
        }

        // 3. Если герой не готов, ищем другого
        const currentHeroTimer = document.querySelector('.character-short--current .character-short__timer');
        if (currentHeroTimer) {
             log('Текущий герой занят. Ищу свободного...');
             const allHeroes = document.querySelectorAll('.characters__item .character-short--unlocked');
             let switched = false;
             for (const hero of allHeroes) {
                 if (!hero.classList.contains('character-short--current')) {
                     const timer = hero.querySelector('.character-short__timer');
                     // Ищем героя с текстом "Готов" или без таймера вообще
                     if ((timer && timer.innerText.trim() === 'Готов') || !timer) {
                         log(`Найден готовый герой: ${hero.querySelector('img').alt}. Переключаюсь...`);
                         hero.click();
                         switched = true;
                         break;
                     }
                 }
             }
             if (!switched) {
                 log('Свободных героев не найдено. Ждем...');
             }
             return;
        }

        log('Нет доступных действий.');
    }


    // --- Управление состоянием и события ---
    async function toggleAutomation(isRunning) {
        isAutomationRunning = isRunning;
        await GM_setValue('automationEnabled', isRunning);
        if (isRunning) {
            log('Автоматизация включена.');
            if (automationInterval) clearInterval(automationInterval);
            // Запускаем первый раз сразу, потом по интервалу
            runAutomationCycle();
            automationInterval = setInterval(runAutomationCycle, 10000 + Math.random() * 5000); // Интервал от 10 до 15 секунд
        } else {
            log('Автоматизация выключена.');
            if (automationInterval) {
                clearInterval(automationInterval);
                automationInterval = null;
            }
        }
    }

    masterToggle.addEventListener('change', (e) => {
        toggleAutomation(e.target.checked);
    });

    // Загрузка сохраненного состояния
    (async () => {
        const enabled = await GM_getValue('automationEnabled', false);
        masterToggle.checked = enabled;
        toggleAutomation(enabled);
    })();

    // --- Логика перетаскивания панели ---
    const header = document.getElementById('automation-header');
    let isDragging = false;
    let offset = [0, 0];

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = [
            panel.offsetLeft - e.clientX,
            panel.offsetTop - e.clientY
        ];
        header.style.cursor = 'grabbing';
    }, true);

    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    }, true);

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            panel.style.left = (e.clientX + offset[0]) + 'px';
            panel.style.top = (e.clientY + offset[1]) + 'px';
        }
    }, true);

})();