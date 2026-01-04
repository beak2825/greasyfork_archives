// ==UserScript==
// @name        Кнопки | Сайды
// @namespace   Violentmonkey Scripts
// @match       https://a24.biz/order/getoneorder/*
// @match       https://avtor24.ru/order/getoneorder/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @connect     script.google.com
// @version     4
// @description Кнопки с фразами из Google Таблицы
// @author      Семён
// @downloadURL https://update.greasyfork.org/scripts/550742/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550742/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔗 Замени на URL твоего Google Apps Script веб-приложения
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhdfoWp4WMD_8bbEQM_W9dOyx0QMD7yKGanGUsG9oEeR6-1RF-lGvrvqKt-Bfg6jsp6g/exec';

    const CACHE_KEY = 'buttonsData';
    const LAST_UPDATE_KEY = 'buttonsLastUpdate';
    const CACHE_TTL = 60 * 60 * 1000; // 1 час

    let accountType = 1;

    // === КНОПКА ОБНОВЛЕНИЯ В МЕНЮ ===
    GM_registerMenuCommand('🔄 Обновить фразы из Google', () => {
        fetchAndSaveButtons(true);
    });

    // === ЗАГРУЗКА КНОПОК ===
    function loadButtons() {
        const cached = GM_getValue(CACHE_KEY, null);
        const lastUpdate = GM_getValue(LAST_UPDATE_KEY, 0);
        const now = Date.now();

        if (cached && (now - lastUpdate) < CACHE_TTL) {
            try {
                const data = JSON.parse(cached);
                initUI(data.buttons || []);
            } catch (e) {
                console.warn('Кэш повреждён, загружаем заново');
                fetchAndSaveButtons(false);
            }
        } else {
            fetchAndSaveButtons(false);
        }
    }

    function fetchAndSaveButtons(showAlert = false) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GOOGLE_SCRIPT_URL,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    GM_setValue(CACHE_KEY, JSON.stringify(data));
                    GM_setValue(LAST_UPDATE_KEY, Date.now());
                    initUI(data.buttons || []);
                    if (showAlert) alert('✅ Фразы обновлены!');
                } catch (e) {
                    console.error('Ошибка обновления:', e);
                    if (showAlert) alert('❌ Не удалось обновить фразы.');
                }
            },
            onerror: function () {
                console.error('Не удалось подключиться к Google Apps Script');
                if (showAlert) alert('🌐 Нет связи с сервером фраз.');
            }
        });
    }

    // === ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ===
    function initUI(buttonsData) {
        if (!buttonsData.length) return;

        let checkExistence = setInterval(addButtonsPanel, 1000);

        function addButtonsPanel() {
            const auctionDiv = document.querySelector('div[class*="AuctionPlaceBidStyled"]');
            const sidebarDiv = document.querySelector('div[class*="styled__OrderSummaryStyled-sc"]');

            let added = false;

            if (sidebarDiv && !document.getElementById('buttonPanelSidebar')) {
                const panel = createPanel('buttonPanelSidebar');
                buttonsData
                    .filter(btn => btn.id.startsWith('s_'))
                    .forEach(btn => createButton(panel, btn));
                if (panel.children.length) {
                    sidebarDiv.parentNode.insertBefore(panel, sidebarDiv.nextSibling);
                    added = true;
                }
            }

            if (auctionDiv && !document.getElementById('buttonPanelAuction')) {
                const panel = createPanel('buttonPanelAuction');
                buttonsData
                    .filter(btn => btn.id.startsWith('a_'))
                    .forEach(btn => createButton(panel, btn));
                if (panel.children.length) {
                    auctionDiv.parentNode.insertBefore(panel, auctionDiv.nextSibling);
                    added = true;
                }
            }

            if (added) clearInterval(checkExistence);
        }
    }

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (createButton, insertText и т.д.) ===
    function createPanel(id) {
        const panel = document.createElement('div');
        panel.id = id;
        panel.className = 'custom-panel';
        return panel;
    }

    function createButton(parent, buttonData) {
        const button = document.createElement('button');
        button.textContent = buttonData.text;
        button.id = buttonData.id;
        button.title = buttonData.texts[accountType] || '';
        button.className = 'custom-button';

        button.addEventListener('click', function (e) {
            insertText(buttonData.texts[accountType]);
            if (buttonData.id === 's_otkaz') {
                sendMessage();
                // handleOtkaz(); // если нужно
            } else if (e.shiftKey) {
                setTimeout(sendMessage, 150);
            }
        });

        button.addEventListener('mousedown', (e) => {
            if (e.button === 1) {
                e.preventDefault();
                insertText(buttonData.texts[accountType]);
                setTimeout(sendMessage, 100);
            }
        });

        parent.appendChild(button);
    }

    function insertText(text) {
        const textarea = document.querySelector('textarea[data-testid="dialogMessageInput-action_input"]');
        if (textarea) {
            textarea.focus();
            document.execCommand('insertText', true, text);
        }
    }

    function sendMessage() {
        const btn = document.querySelector('button[data-testid="dialogMessageInput-action_sendMsg"]');
        if (btn) setTimeout(() => btn.click(), 150);
    }

    // === СТИЛИ ===
    GM_addStyle(`
        button.custom-button {
            transition: background-color 0.3s ease;
            background-color: rgb(125, 42, 235);
            color: #fff;
            font-family: 'Segoe UI';
            border: none;
            padding: 8px 12px;
            margin: 0;
            cursor: pointer;
            font-size: 15px;
            border-radius: 4px;
            height: 30px;
            line-height: 14px;
            white-space: nowrap;
        }
        button.custom-button[id="s_otkaz"] { background-color: rgb(255, 0, 0) !important; }
        button.custom-button[id="s_otkaz"]:hover { background-color: rgb(200, 0, 0) !important; }
        button.custom-button:not([id="s_otkaz"]):hover { background-color: rgb(100, 53, 165) !important; }
        button.custom-button:active { opacity: 0.8; }
        div.custom-panel {
            display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;
            max-width: 400px; max-height: 150px; overflow-y: auto;
        }
    `);

    // === ЗАПУСК ===
    loadButtons();
})();