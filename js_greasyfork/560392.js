// ==UserScript==
// @name         Для ГС/ЗГС АП | Основной
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  by D. Lordecckiy
// @author       Petux
// @match        https://forum.blackrussia.online/*
// @icon         https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560392/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20%7C%20%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/560392/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20%7C%20%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== КОНСТАНТЫ И НАСТРОЙКИ ==========
    const TotleEnd = "[B][CENTER] [FONT=times new roman] С уважением [COLOR=blue] Главный следящий за Агентами Поддержки [COLOR=white] - [COLOR=blue] Dima_Lordecckiy <br><br>";
    const TotlePhotoTxt1 = "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HsNNJFPW/RLwzo.png[/img][/url][/CENTER]<br>";

    // Структура данных с категориями
    const buttonCategories = [
        {
            id: 'special',
            name: 'Особые случаи',
            buttons: [
                {
                    title: '| Для особых случаев |',
                    content: "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][COLOR=white][FONT=courier new] Текст <br><br>" +
                             TotlePhotoTxt1 +
                             TotleEnd
                }
            ]
        },
        {
            id: 'complaints',
            name: 'Жалобы',
            defaultOpen: true,
            buttons: [
                {
                    title: '| Жалоба одобрена (АП) |',
                    content: "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][COLOR=white][FONT=courier new]Ваша жалоба получает статус - [COLOR=green] одобрено.[/COLOR]" +
                             "[CENTER][COLOR=white]Агент Поддержки получит соответствующее наказание." +
                             "[CENTER]Спасибо за обращение. <br><br>" +
                             TotlePhotoTxt1 +
                             TotleEnd
                },
                {
                    title: '| Нарушений нет (АП) |',
                    content: "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][COLOR=white][FONT=courier new]Ваша жалоба получает статус - [COLOR=red]отказано.[/COLOR]<br><br>" +
                             "[COLOR=white][CENTER]Нарушений со стороны Агента Поддержки не обнаружено. <br><br>" +
                             TotlePhotoTxt1 +
                             TotleEnd
                },
                {
                    title: '| Не является АП |',
                    content: "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][COLOR=white][FONT=courier new] Данный игрок не является Агентом Поддержки. Спасибо за обращение. <br><br>" +
                             TotlePhotoTxt1 +
                             TotleEnd
                }
            ]
        },
        {
            id: 'inactive',
            name: 'Неактивы',
            defaultOpen: true,
            buttons: [
                {
                    title: '| Отказ неактива (Не хватает) |',
                    content: "[B][CENTER][COLOR=white][ICODE]{{ greeting }}, уважаемый Агент Поддержки. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][FONT=courier new]Ваша заявка на взятие неактива -[COLOR=red] отказана.[/COLOR][/CENTER][/B]<br><br>" +
                             "[B][CENTER][FONT=courier new]Превышено максимальное количество взятия неактивов." +
                             TotlePhotoTxt1 +
                             TotleEnd
                },
                {
                    title: '| Отказ неактива (Подано после 12:00) |',
                    content: "[B][CENTER][COLOR=white][ICODE]{{ greeting }}, уважаемый Агент Поддержки.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][FONT=courier new] Ваша заявка на взятие неактива - [COLOR=red] отказана.[/COLOR][/CENTER][/B]<br><br>" +
                             "[B][CENTER][FONT=courier new] Заявка на неактив, на сегодняшний день, подаётся до 12:00." +
                             TotlePhotoTxt1 +
                             TotleEnd
                }
            ]
        }
    ];

    // ========== УПРАВЛЕНИЕ ДАННЫМИ ==========
    const Storage = {
        // Настройки по умолчанию
        defaultSettings: {
            theme: 'dark',
            fontSize: 'medium',
            historySize: 5,
            openCategories: ['complaints', 'inactive']
        },

        // Получить настройки
        getSettings() {
            const saved = GM_getValue('gs_settings');
            return saved ? { ...this.defaultSettings, ...saved } : this.defaultSettings;
        },

        // Сохранить настройки
        saveSettings(settings) {
            GM_setValue('gs_settings', settings);
        },

        // Получить историю
        getHistory() {
            return GM_getValue('gs_history', []);
        },

        // Добавить в историю
        addToHistory(button) {
            let history = this.getHistory();
            history = history.filter(item => item.title !== button.title);
            history.unshift({
                title: button.title,
                content: button.content,
                timestamp: Date.now()
            });
            
            const settings = this.getSettings();
            if (history.length > settings.historySize) {
                history = history.slice(0, settings.historySize);
            }
            
            GM_setValue('gs_history', history);
        },

        // Очистить историю
        clearHistory() {
            GM_deleteValue('gs_history');
        },

        // Получить открытые категории
        getOpenCategories() {
            const settings = this.getSettings();
            return settings.openCategories || [];
        },

        // Сохранить состояние категорий
        saveOpenCategories(categories) {
            const settings = this.getSettings();
            settings.openCategories = categories;
            this.saveSettings(settings);
        }
    };

    // ========== УТИЛИТЫ ДЛЯ ОПТИМИЗАЦИИ ==========
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ========== СТИЛИ (ОПТИМИЗИРОВАНЫ) ==========
    const addStyles = () => {
        const styles = `
            /* Главная кнопка */
            #gs-answers-btn {
                background-color: rgba(54, 53, 62, 0.95) !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                border-radius: 6px !important;
                padding: 8px 16px !important;
                margin: 3px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                display: inline-block !important;
                transition: all 0.2s ease !important;
            }
            
            #gs-answers-btn:hover {
                background-color: rgba(70, 69, 78, 0.95) !important;
                border-color: rgba(255, 255, 255, 0.25) !important;
            }

            /* Модальное окно */
            .gs-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 12, 0.92);
                z-index: 9998;
                display: none;
            }
            
            .gs-modal-overlay.active {
                display: block;
            }
            
            .gs-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(32, 32, 38, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 0;
                z-index: 9999;
                width: 85%;
                max-width: 800px;
                max-height: 80vh;
                overflow: hidden;
                display: none;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            }

            .gs-modal.light-theme {
                background: rgba(245, 245, 245, 0.98);
                border: 1px solid rgba(0, 0, 0, 0.1);
                color: #333;
            }

            .gs-modal.active {
                display: flex;
                flex-direction: column;
            }

            /* Заголовок модального окна */
            .gs-modal-header {
                padding: 18px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(40, 40, 45, 0.8);
            }

            .gs-modal.light-theme .gs-modal-header {
                background: rgba(230, 230, 230, 0.9);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-modal-title {
                color: #e0e0e0;
                font-weight: 600;
                font-size: 18px;
                margin: 0;
            }

            .gs-modal.light-theme .gs-modal-title {
                color: #333;
            }

            /* Панель поиска */
            .gs-search-container {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(35, 35, 40, 0.8);
            }

            .gs-modal.light-theme .gs-search-container {
                background: rgba(240, 240, 240, 0.9);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-search-input {
                width: 100%;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                outline: none;
            }

            .gs-modal.light-theme .gs-search-input {
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.15);
                color: #333;
            }

            .gs-search-input:focus {
                border-color: rgba(255, 255, 255, 0.3);
            }

            .gs-modal.light-theme .gs-search-input:focus {
                border-color: rgba(0, 0, 0, 0.3);
            }

            .gs-search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .gs-modal.light-theme .gs-search-input::placeholder {
                color: rgba(0, 0, 0, 0.5);
            }

            /* Контейнер контента с аккордеоном */
            .gs-modal-content {
                flex: 1;
                overflow-y: auto;
                padding: 0 20px 20px;
            }

            /* Аккордеон категорий */
            .gs-category {
                margin-bottom: 10px;
                border-radius: 8px;
                overflow: hidden;
                background: rgba(40, 40, 45, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            .gs-modal.light-theme .gs-category {
                background: rgba(240, 240, 240, 0.9);
                border: 1px solid rgba(0, 0, 0, 0.08);
            }

            .gs-category-header {
                padding: 14px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .gs-category-header:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .gs-modal.light-theme .gs-category-header:hover {
                background: rgba(0, 0, 0, 0.05);
            }

            .gs-category-title {
                color: #e0e0e0;
                font-weight: 600;
                font-size: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .gs-modal.light-theme .gs-category-title {
                color: #333;
            }

            .gs-category-count {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.9);
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 500;
            }

            .gs-modal.light-theme .gs-category-count {
                background: rgba(0, 0, 0, 0.1);
                color: rgba(0, 0, 0, 0.7);
            }

            .gs-category-toggle {
                color: rgba(255, 255, 255, 0.5);
                font-size: 14px;
                transition: transform 0.2s ease;
            }

            .gs-category.open .gs-category-toggle {
                transform: rotate(180deg);
            }

            .gs-modal.light-theme .gs-category-toggle {
                color: rgba(0, 0, 0, 0.5);
            }

            .gs-category-content {
                padding: 0 15px 15px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 10px;
                display: none;
            }

            .gs-category.open .gs-category-content {
                display: grid;
            }

            /* Кнопки ответов (ОПТИМИЗИРОВАНЫ) */
            .gs-answer-btn {
                background: rgba(55, 55, 60, 0.9);
                color: #e0e0e0;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 12px 16px;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: background 0.15s ease;
                position: relative;
                width: 100%;
                margin: 0;
                font-weight: 500;
            }

            .gs-modal.light-theme .gs-answer-btn {
                background: white;
                color: #333;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-answer-btn:hover {
                background: rgba(70, 70, 75, 0.95);
            }

            .gs-modal.light-theme .gs-answer-btn:hover {
                background: #f5f5f5;
            }

            .gs-answer-btn.highlight {
                background: rgba(76, 175, 80, 0.2) !important;
                border-color: rgba(76, 175, 80, 0.3) !important;
            }

            /* Кнопки управления */
            .gs-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .gs-control-btn {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.8);
                border-radius: 6px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.15s ease;
            }

            .gs-modal.light-theme .gs-control-btn {
                border: 1px solid rgba(0, 0, 0, 0.15);
                color: rgba(0, 0, 0, 0.7);
            }

            .gs-control-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .gs-modal.light-theme .gs-control-btn:hover {
                background: rgba(0, 0, 0, 0.05);
            }

            /* Панель настроек */
            .gs-settings-panel {
                position: absolute;
                top: 60px;
                left: 20px;
                background: rgba(35, 35, 40, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                padding: 15px;
                width: 250px;
                z-index: 10000;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                display: none;
            }

            .gs-modal.light-theme .gs-settings-panel {
                background: rgba(245, 245, 245, 0.98);
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-settings-panel.active {
                display: block;
            }

            .gs-settings-title {
                color: #e0e0e0;
                font-weight: 600;
                font-size: 14px;
                margin: 0 0 15px 0;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .gs-modal.light-theme .gs-settings-title {
                color: #333;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-setting-item {
                margin-bottom: 15px;
            }

            .gs-setting-label {
                display: block;
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                margin-bottom: 5px;
            }

            .gs-modal.light-theme .gs-setting-label {
                color: rgba(0, 0, 0, 0.8);
            }

            .gs-select, .gs-input {
                width: 100%;
                padding: 8px 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: white;
                font-size: 12px;
                outline: none;
            }

            .gs-modal.light-theme .gs-select,
            .gs-modal.light-theme .gs-input {
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.15);
                color: #333;
            }

            .gs-buttons-row {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            .gs-settings-btn {
                flex: 1;
                padding: 8px;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                font-size: 12px;
                transition: all 0.15s ease;
            }

            .gs-modal.light-theme .gs-settings-btn {
                border: 1px solid rgba(0, 0, 0, 0.1);
                background: rgba(0, 0, 0, 0.05);
                color: rgba(0, 0, 0, 0.8);
            }

            .gs-settings-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .gs-modal.light-theme .gs-settings-btn:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .gs-settings-btn.danger {
                background: rgba(244, 67, 54, 0.1);
                border-color: rgba(244, 67, 54, 0.2);
                color: #f44336;
            }

            .gs-modal.light-theme .gs-settings-btn.danger {
                background: rgba(244, 67, 54, 0.08);
            }

            /* История */
            .gs-history-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .gs-modal.light-theme .gs-history-section {
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            .gs-history-empty {
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
                padding: 20px;
                font-size: 13px;
            }

            .gs-modal.light-theme .gs-history-empty {
                color: rgba(0, 0, 0, 0.5);
            }

            /* Адаптивные стили */
            @media (max-width: 768px) {
                .gs-modal {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .gs-category-content {
                    grid-template-columns: 1fr;
                }
                
                .gs-settings-panel {
                    width: 200px;
                }
            }

            /* Размеры шрифта */
            .gs-font-small .gs-answer-btn,
            .gs-font-small .gs-category-title,
            .gs-font-small .gs-search-input {
                font-size: 12px;
            }

            .gs-font-medium .gs-answer-btn,
            .gs-font-medium .gs-category-title,
            .gs-font-medium .gs-search-input {
                font-size: 13px;
            }

            .gs-font-large .gs-answer-btn,
            .gs-font-large .gs-category-title,
            .gs-font-large .gs-search-input {
                font-size: 14px;
            }

            /* Стили для скроллбара */
            .gs-modal-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .gs-modal-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            
            .gs-modal-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 4px;
            }
            
            .gs-modal-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .gs-modal.light-theme .gs-modal-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
            }
            
            .gs-modal.light-theme .gs-modal-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
            }
            
            .gs-modal.light-theme .gs-modal-content::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.15);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    };

    // ========== ОСНОВНЫЕ ФУНКЦИИ ==========
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Доброе утро';
        if (hour >= 12 && hour < 18) return 'Добрый день';
        if (hour >= 18 && hour < 23) return 'Добрый вечер';
        return 'Доброй ночи';
    }

    const findReplyField = () => {
        const selectors = [
            '.fr-element.fr-view',
            '.js-editor',
            '.message-body',
            'textarea[name="message"]',
            '.fr-box.fr-basic.fr-top',
            '.js-quickReply',
            '.quickReply'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        
        return null;
    };

    const insertTextToReply = (text) => {
        const greeting = getGreeting();
        const processedText = text.replace(/\{\{\s*greeting\s*\}\}/g, greeting);
        
        let replyField = findReplyField();
        
        if (!replyField) {
            const replyButtons = document.querySelectorAll('.button--icon--reply, a[href*="reply"], button[onclick*="reply"]');
            if (replyButtons.length > 0) {
                replyButtons[0].click();
                setTimeout(() => {
                    insertTextToReply(text);
                }, 500);
            }
            return false;
        }
        
        if (replyField.tagName === 'TEXTAREA') {
            replyField.value = processedText;
            const event = new Event('input', { bubbles: true });
            replyField.dispatchEvent(event);
        } else if (replyField.classList.contains('fr-element')) {
            replyField.innerHTML = processedText;
            const event = new Event('input', { bubbles: true });
            replyField.dispatchEvent(event);
        } else {
            replyField.innerHTML = processedText;
        }
        
        replyField.focus();
        return true;
    };

    // ========== СИСТЕМА ПОИСКА ==========
    class SearchSystem {
        constructor() {
            this.searchTerm = '';
            this.allButtons = [];
        }

        initialize(buttonCategories) {
            this.allButtons = [];
            buttonCategories.forEach(category => {
                category.buttons.forEach(button => {
                    this.allButtons.push({
                        ...button,
                        categoryId: category.id,
                        categoryName: category.name
                    });
                });
            });
        }

        search(term) {
            this.searchTerm = term.toLowerCase().trim();
            
            if (!this.searchTerm) {
                return null; // Нет поиска - показываем все категории
            }

            const results = this.allButtons.filter(button => 
                button.title.toLowerCase().includes(this.searchTerm) ||
                button.content.toLowerCase().includes(this.searchTerm)
            );

            // Группируем результаты по категориям
            const groupedResults = {};
            results.forEach(button => {
                if (!groupedResults[button.categoryId]) {
                    groupedResults[button.categoryId] = {
                        name: button.categoryName,
                        buttons: []
                    };
                }
                groupedResults[button.categoryId].buttons.push(button);
            });

            return groupedResults;
        }

        highlightText(text, element) {
            if (!this.searchTerm) return text;
            
            const regex = new RegExp(`(${this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
    }

    // ========== ГЛАВНОЕ МОДАЛЬНОЕ ОКНО (ОПТИМИЗИРОВАНО) ==========
    class ModalWindow {
        constructor() {
            this.modal = null;
            this.overlay = null;
            this.searchSystem = new SearchSystem();
            this.settingsPanel = null;
            this.currentSettings = Storage.getSettings();
            this.openCategories = new Set(Storage.getOpenCategories());
        }

        show() {
            this.createModal();
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);
            
            // Закрытие по Escape
            this.escapeHandler = (e) => {
                if (e.key === 'Escape') this.close();
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        createModal() {
            // Оверлей
            this.overlay = document.createElement('div');
            this.overlay.className = 'gs-modal-overlay active';
            this.overlay.onclick = () => this.close();

            // Основное модальное окно
            this.modal = document.createElement('div');
            this.modal.className = `gs-modal active ${this.currentSettings.theme}-theme gs-font-${this.currentSettings.fontSize}`;
            this.modal.onclick = (e) => e.stopPropagation();

            // Инициализация поиска
            this.searchSystem.initialize(buttonCategories);

            // Сборка интерфейса
            this.buildHeader();
            this.buildSearch();
            this.buildContent();

            // Панель настроек (скрытая)
            this.buildSettingsPanel();
        }

        buildHeader() {
            const header = document.createElement('div');
            header.className = 'gs-modal-header';

            // Заголовок
            const title = document.createElement('h2');
            title.className = 'gs-modal-title';
            title.textContent = '📋 Быстрые ответы для ГС/ЗГС';

            // Управляющие кнопки
            const controls = document.createElement('div');
            controls.className = 'gs-controls';

            // Кнопка истории
            const historyBtn = document.createElement('button');
            historyBtn.className = 'gs-control-btn';
            historyBtn.textContent = 'История';
            historyBtn.title = 'Показать историю использованных ответов';
            historyBtn.onclick = () => this.toggleHistory();

            // Кнопка настроек
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'gs-control-btn';
            settingsBtn.textContent = 'Настройки';
            settingsBtn.title = 'Настройки интерфейса';
            settingsBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleSettingsPanel();
            };

            controls.appendChild(historyBtn);
            controls.appendChild(settingsBtn);
            header.appendChild(title);
            header.appendChild(controls);

            this.modal.appendChild(header);
        }

        buildSearch() {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'gs-search-container';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'gs-search-input';
            searchInput.placeholder = 'Поиск по ответам...';
            searchInput.autocomplete = 'off';

            // ДЕБАУНС для поиска - не лагает при вводе
            searchInput.oninput = debounce((e) => {
                this.handleSearch(e.target.value);
            }, 150);

            searchInput.onkeydown = (e) => {
                if (e.key === 'Escape') {
                    e.target.value = '';
                    this.handleSearch('');
                }
            };

            searchContainer.appendChild(searchInput);
            this.modal.appendChild(searchContainer);
        }

        buildContent() {
            const content = document.createElement('div');
            content.className = 'gs-modal-content';
            this.contentElement = content;
            this.modal.appendChild(content);
            this.renderContent();
        }

        renderContent(searchResults = null) {
            this.contentElement.innerHTML = '';

            if (searchResults) {
                // Режим поиска
                this.renderSearchResults(searchResults);
            } else {
                // Нормальный режим с аккордеоном
                this.renderAccordion();
                this.renderHistorySection();
            }
        }

        renderAccordion() {
            buttonCategories.forEach(category => {
                const categoryElement = this.createCategoryElement(category);
                this.contentElement.appendChild(categoryElement);
            });
        }

        createCategoryElement(category) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = `gs-category ${this.openCategories.has(category.id) ? 'open' : ''}`;
            categoryDiv.dataset.categoryId = category.id;

            // Заголовок категории
            const header = document.createElement('div');
            header.className = 'gs-category-header';
            header.onclick = () => this.toggleCategory(category.id);

            const title = document.createElement('div');
            title.className = 'gs-category-title';
            
            const count = document.createElement('span');
            count.className = 'gs-category-count';
            count.textContent = category.buttons.length;

            title.appendChild(count);
            title.appendChild(document.createTextNode(category.name));

            const toggle = document.createElement('span');
            toggle.className = 'gs-category-toggle';
            toggle.textContent = '▼';

            header.appendChild(title);
            header.appendChild(toggle);

            // Контент категории (ОПТИМИЗИРОВАНО с DocumentFragment)
            const content = document.createElement('div');
            content.className = 'gs-category-content';

            // Используем DocumentFragment для быстрого добавления
            const fragment = document.createDocumentFragment();
            
            category.buttons.forEach(button => {
                const buttonElement = this.createButtonElement(button, category.id);
                fragment.appendChild(buttonElement);
            });
            
            content.appendChild(fragment);
            categoryDiv.appendChild(header);
            categoryDiv.appendChild(content);

            return categoryDiv;
        }

        createButtonElement(button, categoryId) {
            const btn = document.createElement('button');
            btn.className = 'gs-answer-btn';
            btn.textContent = button.title;
            btn.dataset.categoryId = categoryId;

            btn.onclick = () => {
                if (insertTextToReply(button.content)) {
                    // Добавляем в историю
                    Storage.addToHistory(button);
                    this.close();
                    const replyField = findReplyField();
                    if (replyField) {
                        replyField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            };

            return btn;
        }

        renderSearchResults(results) {
            const fragment = document.createDocumentFragment();

            Object.entries(results).forEach(([categoryId, categoryData]) => {
                const section = document.createElement('div');
                section.className = 'gs-category open';
                
                const header = document.createElement('div');
                header.className = 'gs-category-header';
                header.style.cursor = 'default';

                const title = document.createElement('div');
                title.className = 'gs-category-title';
                
                const count = document.createElement('span');
                count.className = 'gs-category-count';
                count.textContent = categoryData.buttons.length;

                title.appendChild(count);
                title.appendChild(document.createTextNode(categoryData.name));

                header.appendChild(title);
                section.appendChild(header);

                const content = document.createElement('div');
                content.className = 'gs-category-content';

                categoryData.buttons.forEach(button => {
                    const buttonElement = this.createButtonElement(button, categoryId);
                    
                    // Подсветка найденного текста
                    const highlightedTitle = button.title.replace(
                        new RegExp(this.searchSystem.searchTerm, 'gi'),
                        match => `<mark>${match}</mark>`
                    );
                    
                    buttonElement.innerHTML = highlightedTitle;
                    buttonElement.classList.add('highlight');
                    content.appendChild(buttonElement);
                });

                section.appendChild(content);
                fragment.appendChild(section);
            });

            this.contentElement.appendChild(fragment);
        }

        renderHistorySection() {
            const history = Storage.getHistory();
            if (history.length === 0) return;

            const historySection = document.createElement('div');
            historySection.className = 'gs-history-section';

            const historyTitle = document.createElement('div');
            historyTitle.className = 'gs-category-header';
            historyTitle.style.cursor = 'default';

            const title = document.createElement('div');
            title.className = 'gs-category-title';
            
            const count = document.createElement('span');
            count.className = 'gs-category-count';
            count.textContent = history.length;

            title.appendChild(count);
            title.appendChild(document.createTextNode('Недавно использованные'));

            historyTitle.appendChild(title);
            historySection.appendChild(historyTitle);

            const historyContent = document.createElement('div');
            historyContent.className = 'gs-category-content';

            history.forEach(item => {
                const button = {
                    title: item.title,
                    content: item.content
                };
                
                const buttonElement = this.createButtonElement(button, 'history');
                historyContent.appendChild(buttonElement);
            });

            historySection.appendChild(historyContent);
            this.contentElement.appendChild(historySection);
        }

        buildSettingsPanel() {
            this.settingsPanel = document.createElement('div');
            this.settingsPanel.className = 'gs-settings-panel';

            const title = document.createElement('h3');
            title.className = 'gs-settings-title';
            title.textContent = 'Настройки';

            // Тема
            const themeSetting = document.createElement('div');
            themeSetting.className = 'gs-setting-item';
            themeSetting.innerHTML = `
                <label class="gs-setting-label">Тема интерфейса</label>
                <select class="gs-select" id="gs-theme-select">
                    <option value="dark">Тёмная</option>
                    <option value="light">Светлая</option>
                </select>
            `;

            // Размер шрифта
            const fontSizeSetting = document.createElement('div');
            fontSizeSetting.className = 'gs-setting-item';
            fontSizeSetting.innerHTML = `
                <label class="gs-setting-label">Размер шрифта</label>
                <select class="gs-select" id="gs-font-size-select">
                    <option value="small">Маленький</option>
                    <option value="medium">Средний</option>
                    <option value="large">Большой</option>
                </select>
            `;

            // Размер истории
            const historySizeSetting = document.createElement('div');
            historySizeSetting.className = 'gs-setting-item';
            historySizeSetting.innerHTML = `
                <label class="gs-setting-label">Количество записей в истории</label>
                <input type="number" class="gs-input" id="gs-history-size" min="1" max="20" value="${this.currentSettings.historySize}">
            `;

            // Кнопки
            const buttonsRow = document.createElement('div');
            buttonsRow.className = 'gs-buttons-row';

            const saveBtn = document.createElement('button');
            saveBtn.className = 'gs-settings-btn';
            saveBtn.textContent = 'Сохранить';
            saveBtn.onclick = () => this.saveSettings();

            const clearHistoryBtn = document.createElement('button');
            clearHistoryBtn.className = 'gs-settings-btn danger';
            clearHistoryBtn.textContent = 'Очистить историю';
            clearHistoryBtn.onclick = () => {
                if (confirm('Очистить всю историю использованных ответов?')) {
                    Storage.clearHistory();
                    this.closeSettingsPanel();
                    this.renderContent();
                }
            };

            buttonsRow.appendChild(saveBtn);
            buttonsRow.appendChild(clearHistoryBtn);

            this.settingsPanel.appendChild(title);
            this.settingsPanel.appendChild(themeSetting);
            this.settingsPanel.appendChild(fontSizeSetting);
            this.settingsPanel.appendChild(historySizeSetting);
            this.settingsPanel.appendChild(buttonsRow);

            // Устанавливаем текущие значения
            setTimeout(() => {
                const themeSelect = document.getElementById('gs-theme-select');
                const fontSizeSelect = document.getElementById('gs-font-size-select');
                if (themeSelect) themeSelect.value = this.currentSettings.theme;
                if (fontSizeSelect) fontSizeSelect.value = this.currentSettings.fontSize;
            }, 0);

            this.modal.appendChild(this.settingsPanel);
        }

        toggleSettingsPanel() {
            if (this.settingsPanel.classList.contains('active')) {
                this.closeSettingsPanel();
            } else {
                this.openSettingsPanel();
            }
        }

        openSettingsPanel() {
            this.settingsPanel.classList.add('active');
            // Закрытие по клику вне панели
            this.settingsClickHandler = (e) => {
                if (!this.settingsPanel.contains(e.target) && 
                    !e.target.closest('.gs-control-btn')) {
                    this.closeSettingsPanel();
                }
            };
            setTimeout(() => {
                document.addEventListener('click', this.settingsClickHandler);
            }, 0);
        }

        closeSettingsPanel() {
            this.settingsPanel.classList.remove('active');
            if (this.settingsClickHandler) {
                document.removeEventListener('click', this.settingsClickHandler);
                this.settingsClickHandler = null;
            }
        }

        saveSettings() {
            const themeSelect = document.getElementById('gs-theme-select');
            const fontSizeSelect = document.getElementById('gs-font-size-select');
            const historySizeInput = document.getElementById('gs-history-size');
            
            if (!themeSelect || !fontSizeSelect || !historySizeInput) return;
            
            const theme = themeSelect.value;
            const fontSize = fontSizeSelect.value;
            const historySize = parseInt(historySizeInput.value) || 5;

            this.currentSettings = {
                ...this.currentSettings,
                theme,
                fontSize,
                historySize,
                openCategories: Array.from(this.openCategories)
            };

            Storage.saveSettings(this.currentSettings);
            
            // Обновляем интерфейс
            this.modal.className = `gs-modal active ${theme}-theme gs-font-${fontSize}`;
            
            // Закрываем панель настроек
            this.closeSettingsPanel();
            
            // Показываем уведомление
            this.showNotification('Настройки сохранены');
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                z-index: 10001;
                font-size: 14px;
                animation: fadeInOut 2s ease;
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        }

        toggleCategory(categoryId) {
            if (this.openCategories.has(categoryId)) {
                this.openCategories.delete(categoryId);
            } else {
                this.openCategories.add(categoryId);
            }

            // Сохраняем состояние
            Storage.saveOpenCategories(Array.from(this.openCategories));

            // Обновляем отображение
            const categoryElement = this.contentElement.querySelector(`[data-category-id="${categoryId}"]`);
            if (categoryElement) {
                categoryElement.classList.toggle('open');
            }
        }

        handleSearch(term) {
            if (term.trim() === '') {
                this.renderContent();
                return;
            }

            const results = this.searchSystem.search(term);
            if (results && Object.keys(results).length > 0) {
                this.renderContent(results);
            } else {
                this.contentElement.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                        Ничего не найдено по запросу "${term}"
                    </div>
                `;
            }
        }

        toggleHistory() {
            const historySection = this.contentElement.querySelector('.gs-history-section');
            if (historySection) {
                historySection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            if (this.settingsPanel) {
                this.settingsPanel.remove();
                this.settingsPanel = null;
            }
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }
        }
    }

    // ========== ИНИЦИАЛИЗАЦИЯ СКРИПТА ==========
    const addAnswerButton = () => {
        if (document.getElementById('gs-answers-btn')) {
            return true;
        }
        
        let replyButton = null;
        const replySelectors = [
            '.button--icon--reply',
            'a[href*="#quickReply"]',
            'button[onclick*="reply"]',
            '.replyButton',
            '.quickReply',
            'a:contains("Ответить")',
            'button:contains("Ответить")'
        ];
        
        for (const selector of replySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element.textContent.includes('Ответить') ||
                    element.textContent.includes('Reply') ||
                    element.getAttribute('href')?.includes('reply')) {
                    replyButton = element;
                    break;
                }
            }
            if (replyButton) break;
        }
        
        if (!replyButton) {
            const actionBar = document.querySelector('.actionBar, .pageAction, .buttonGroup');
            if (actionBar) {
                replyButton = actionBar;
            }
        }
        
        if (replyButton) {
            const answerButton = document.createElement('button');
            answerButton.id = 'gs-answers-btn';
            answerButton.textContent = 'Ответы ГС/ЗГС';
            answerButton.title = 'Быстрые ответы для ГС/ЗГС';
            
            answerButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const modal = new ModalWindow();
                modal.show();
            };
            
            if (replyButton.parentNode) {
                replyButton.parentNode.insertBefore(answerButton, replyButton.nextSibling);
                return true;
            }
        }
        
        return false;
    };

    const init = () => {
        console.log('Скрипт ГС/ЗГС PRO Optimized инициализируется...');
        
        addStyles();
        
        const tryAddButton = () => {
            if (addAnswerButton()) {
                console.log('Кнопка "Ответы ГС/ЗГС" добавлена');
                return;
            }
            
            setTimeout(tryAddButton, 1000);
        };
        
        tryAddButton();
        
        const observer = new MutationObserver(() => {
            if (!document.getElementById('gs-answers-btn')) {
                addAnswerButton();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();