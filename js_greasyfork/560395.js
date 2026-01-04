// ==UserScript==
// @name         Для ГС/ЗГС АП | ТЕСТ 3.4
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  тест
// @author       Petux
// @match        https://forum.blackrussia.online/*
// @icon         https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560395/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20%7C%20%D0%A2%D0%95%D0%A1%D0%A2%2034.user.js
// @updateURL https://update.greasyfork.org/scripts/560395/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20%7C%20%D0%A2%D0%95%D0%A1%D0%A2%2034.meta.js
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
                    id: 'special_1',
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
                    id: 'complaint_approved',
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
                    id: 'complaint_rejected',
                    title: '| Нарушений нет (АП) |',
                    content: "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][COLOR=white][FONT=courier new]Ваша жалоба получает статус - [COLOR=red]отказано.[/COLOR]<br><br>" +
                             "[COLOR=white][CENTER]Нарушений со стороны Агента Поддержки не обнаружено. <br><br>" +
                             TotlePhotoTxt1 +
                             TotleEnd
                },
                {
                    id: 'not_ap',
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
                    id: 'inactive_limit',
                    title: '| Отказ неактива (Не хватает) |',
                    content: "[B][CENTER][COLOR=white][ICODE]{{ greeting }}, уважаемый Агент Поддержки. [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                             TotlePhotoTxt1 +
                             "[B][CENTER][FONT=courier new]Ваша заявка на взятие неактива -[COLOR=red] отказана.[/COLOR][/CENTER][/B]<br><br>" +
                             "[B][CENTER][FONT=courier new]Превышено максимальное количество взятия неактивов." +
                             TotlePhotoTxt1 +
                             TotleEnd
                },
                {
                    id: 'inactive_time',
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
        defaultSettings: {
            theme: 'dark_black',
            fontSize: 'medium',
            openCategories: ['complaints', 'inactive'],
            favorites: [],
            useCounts: {},
            customButtons: [],
            customCategories: []
        },

        getSettings() {
            const saved = GM_getValue('gs_settings');
            return saved ? { ...this.defaultSettings, ...saved } : this.defaultSettings;
        },

        saveSettings(settings) {
            GM_setValue('gs_settings', settings);
        },

        getFavorites() {
            const settings = this.getSettings();
            return settings.favorites || [];
        },

        toggleFavorite(buttonId) {
            const settings = this.getSettings();
            const favorites = settings.favorites || [];
            const index = favorites.indexOf(buttonId);
            
            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(buttonId);
            }
            
            settings.favorites = favorites;
            this.saveSettings(settings);
            return favorites;
        },

        getUseCounts() {
            const settings = this.getSettings();
            return settings.useCounts || {};
        },

        incrementUseCount(buttonId) {
            const settings = this.getSettings();
            if (!settings.useCounts) settings.useCounts = {};
            settings.useCounts[buttonId] = (settings.useCounts[buttonId] || 0) + 1;
            this.saveSettings(settings);
            return settings.useCounts[buttonId];
        },

        getCustomButtons() {
            const settings = this.getSettings();
            return settings.customButtons || [];
        },

        saveCustomButton(button) {
            const settings = this.getSettings();
            if (!settings.customButtons) settings.customButtons = [];
            settings.customButtons.push({
                id: 'custom_' + Date.now(),
                title: button.title,
                content: button.content,
                category: button.category || 'custom',
                timestamp: Date.now()
            });
            this.saveSettings(settings);
        },

        deleteCustomButton(buttonId) {
            const settings = this.getSettings();
            settings.customButtons = (settings.customButtons || []).filter(b => b.id !== buttonId);
            this.saveSettings(settings);
        },

        getCustomCategories() {
            const settings = this.getSettings();
            return settings.customCategories || [];
        },

        saveCustomCategory(category) {
            const settings = this.getSettings();
            if (!settings.customCategories) settings.customCategories = [];
            settings.customCategories.push({
                id: 'cat_custom_' + Date.now(),
                name: category.name,
                buttons: []
            });
            this.saveSettings(settings);
        },

        clearAllData() {
            GM_deleteValue('gs_settings');
        }
    };

    // ========== УТИЛИТЫ ==========
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

    // ========== ТЕМЫ ОФОРМЛЕНИЯ ==========
    const Themes = {
        // Тёмные темы
        dark_black: {
            name: 'Чёрная',
            colors: {
                primary: '#121212',
                secondary: '#1e1e1e',
                accent: '#666666',
                text: '#e0e0e0',
                border: '#333333',
                hover: '#2a2a2a'
            }
        },
        dark_gray: {
            name: 'Тёмно-серая',
            colors: {
                primary: '#2d2d2d',
                secondary: '#3c3c3c',
                accent: '#808080',
                text: '#f0f0f0',
                border: '#4a4a4a',
                hover: '#4a4a4a'
            }
        },
        dark_blue: {
            name: 'Тёмно-синяя',
            colors: {
                primary: '#1a237e',
                secondary: '#283593',
                accent: '#3949ab',
                text: '#e8eaf6',
                border: '#3f51b5',
                hover: '#303f9f'
            }
        },
        dark_green: {
            name: 'Тёмно-зелёная',
            colors: {
                primary: '#1b5e20',
                secondary: '#2e7d32',
                accent: '#43a047',
                text: '#e8f5e9',
                border: '#4caf50',
                hover: '#388e3c'
            }
        },
        dark_purple: {
            name: 'Тёмно-фиолетовая',
            colors: {
                primary: '#4a148c',
                secondary: '#6a1b9a',
                accent: '#8e24aa',
                text: '#f3e5f5',
                border: '#9c27b0',
                hover: '#7b1fa2'
            }
        },
        dark_red: {
            name: 'Тёмно-красная',
            colors: {
                primary: '#b71c1c',
                secondary: '#c62828',
                accent: '#d32f2f',
                text: '#ffebee',
                border: '#e53935',
                hover: '#d32f2f'
            }
        },
        dark_orange: {
            name: 'Тёмно-оранжевая',
            colors: {
                primary: '#e65100',
                secondary: '#ef6c00',
                accent: '#f57c00',
                text: '#fff3e0',
                border: '#fb8c00',
                hover: '#f57c00'
            }
        },
        
        // Светлые темы
        light_white: {
            name: 'Белая',
            colors: {
                primary: '#ffffff',
                secondary: '#f5f5f5',
                accent: '#e0e0e0',
                text: '#212121',
                border: '#bdbdbd',
                hover: '#eeeeee'
            }
        },
        light_gray: {
            name: 'Светло-серая',
            colors: {
                primary: '#fafafa',
                secondary: '#f5f5f5',
                accent: '#9e9e9e',
                text: '#424242',
                border: '#bdbdbd',
                hover: '#eeeeee'
            }
        },
        light_blue: {
            name: 'Светло-голубая',
            colors: {
                primary: '#e3f2fd',
                secondary: '#bbdefb',
                accent: '#2196f3',
                text: '#0d47a1',
                border: '#90caf9',
                hover: '#bbdefb'
            }
        },
        light_green: {
            name: 'Светло-зелёная',
            colors: {
                primary: '#e8f5e9',
                secondary: '#c8e6c9',
                accent: '#4caf50',
                text: '#1b5e20',
                border: '#a5d6a7',
                hover: '#c8e6c9'
            }
        },
        light_pink: {
            name: 'Светло-розовая',
            colors: {
                primary: '#fce4ec',
                secondary: '#f8bbd9',
                accent: '#e91e63',
                text: '#880e4f',
                border: '#f48fb1',
                hover: '#f8bbd9'
            }
        },
        light_yellow: {
            name: 'Светло-жёлтая',
            colors: {
                primary: '#fffde7',
                secondary: '#fff9c4',
                accent: '#ffeb3b',
                text: '#f57f17',
                border: '#fff176',
                hover: '#fff9c4'
            }
        },
        
        // Контрастные темы
        high_contrast: {
            name: 'Высокая контрастность',
            colors: {
                primary: '#000000',
                secondary: '#000000',
                accent: '#ffff00',
                text: '#ffffff',
                border: '#ffff00',
                hover: '#333333'
            }
        },
        terminal: {
            name: 'Терминал',
            colors: {
                primary: '#000000',
                secondary: '#0a0a0a',
                accent: '#00ff00',
                text: '#00ff00',
                border: '#00ff00',
                hover: '#1a1a1a'
            }
        },
        matrix: {
            name: 'Матрица',
            colors: {
                primary: '#000000',
                secondary: '#001100',
                accent: '#00ff00',
                text: '#00ff00',
                border: '#00ff00',
                hover: '#003300'
            }
        }
    };

    // ========== ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ТЕМЫ ==========
    const applyTheme = (themeName) => {
        const theme = Themes[themeName] || Themes.dark_black;
        const root = document.documentElement;
        
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--gs-${key}`, value);
        });
    };

    // ========== СТИЛИ ДЛЯ КНОПКИ (ОТДЕЛЬНО) ==========
    const addButtonStyles = () => {
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
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
        `;
        document.head.appendChild(buttonStyle);
    };

    // ========== ОСНОВНЫЕ СТИЛИ ==========
    const addStyles = () => {
        const styles = `
            /* Модальное окно - УВЕЛИЧЕНО */
            .gs-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
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
                background: var(--gs-secondary);
                border: 1px solid var(--gs-border);
                border-radius: 12px;
                padding: 0;
                z-index: 9999;
                width: 95%; /* УВЕЛИЧЕНО */
                max-width: 1200px; /* УВЕЛИЧЕНО */
                max-height: 90vh; /* УВЕЛИЧЕНО */
                overflow: hidden;
                display: none;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            }

            .gs-modal.active {
                display: flex;
                flex-direction: column;
            }

            /* Заголовок */
            .gs-modal-header {
                padding: 18px 20px;
                border-bottom: 1px solid var(--gs-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--gs-primary);
                flex-shrink: 0; /* Не сжимается */
            }

            .gs-modal-title {
                color: var(--gs-text);
                font-weight: 600;
                font-size: 18px;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            /* Вкладки */
            .gs-tabs {
                display: flex;
                border-bottom: 1px solid var(--gs-border);
                background: var(--gs-primary);
                flex-shrink: 0; /* Не сжимается */
            }

            .gs-tab {
                padding: 12px 20px;
                background: none;
                border: none;
                color: var(--gs-text);
                cursor: pointer;
                font-size: 14px;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
            }

            .gs-tab.active {
                border-bottom-color: var(--gs-accent);
                color: var(--gs-accent);
                font-weight: 600;
            }

            .gs-tab:hover:not(.active) {
                background: var(--gs-hover);
            }

            /* Панель поиска */
            .gs-search-container {
                padding: 15px 20px;
                border-bottom: 1px solid var(--gs-border);
                background: var(--gs-primary);
                flex-shrink: 0; /* Не сжимается */
            }

            .gs-search-input {
                width: 100%;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid var(--gs-border);
                border-radius: 8px;
                color: var(--gs-text);
                font-size: 14px;
                outline: none;
            }

            .gs-search-input:focus {
                border-color: var(--gs-accent);
            }

            .gs-search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            /* Контент - С ПРОКРУТКОЙ */
            .gs-modal-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--gs-secondary);
                min-height: 300px;
            }

            /* Категории */
            .gs-category {
                margin-bottom: 15px;
                border-radius: 8px;
                overflow: hidden;
                background: var(--gs-primary);
                border: 1px solid var(--gs-border);
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
                background: var(--gs-hover);
            }

            .gs-category-title {
                color: var(--gs-text);
                font-weight: 600;
                font-size: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .gs-category-count {
                background: var(--gs-accent);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 500;
            }

            .gs-category-toggle {
                color: var(--gs-accent);
                font-size: 14px;
                transition: transform 0.2s ease;
            }

            .gs-category.open .gs-category-toggle {
                transform: rotate(180deg);
            }

            .gs-category-content {
                padding: 15px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* УВЕЛИЧЕНО */
                gap: 12px;
                display: none;
            }

            .gs-category.open .gs-category-content {
                display: grid;
            }

            /* Кнопки ответов - УВЕЛИЧЕНЫ */
            .gs-answer-btn {
                background: var(--gs-primary);
                color: var(--gs-text);
                border: 1px solid var(--gs-border);
                border-radius: 8px;
                padding: 14px 18px; /* УВЕЛИЧЕНО */
                cursor: pointer;
                font-size: 14px; /* УВЕЛИЧЕНО */
                text-align: left;
                transition: all 0.15s ease;
                position: relative;
                width: 100%;
                margin: 0;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 60px; /* Минимальная высота */
                word-break: break-word; /* Перенос длинных слов */
            }

            .gs-answer-btn:hover {
                background: var(--gs-hover);
                border-color: var(--gs-accent);
            }

            .gs-answer-btn.favorite .gs-favorite-icon {
                color: #ffd700;
            }

            .gs-answer-btn .gs-stats {
                font-size: 11px;
                opacity: 0.7;
                margin-left: 8px;
            }

            .gs-favorite-icon {
                color: rgba(255, 255, 255, 0.3);
                font-size: 16px;
                transition: color 0.2s;
                cursor: pointer;
                flex-shrink: 0;
            }

            .gs-answer-btn.highlight {
                background: rgba(76, 175, 80, 0.2);
                border-color: var(--gs-accent);
            }

            /* Кнопки управления */
            .gs-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .gs-control-btn {
                background: transparent;
                border: 1px solid var(--gs-border);
                color: var(--gs-text);
                border-radius: 6px;
                padding: 8px 14px; /* УВЕЛИЧЕНО */
                cursor: pointer;
                font-size: 13px;
                transition: all 0.15s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
            }

            .gs-control-btn:hover {
                background: var(--gs-hover);
                border-color: var(--gs-accent);
            }

            /* Панель настроек - ПЕРЕДЕЛАНА */
            .gs-settings-panel {
                position: fixed; /* Изменено на fixed */
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--gs-primary);
                border: 2px solid var(--gs-accent);
                border-radius: 12px;
                padding: 25px; /* УВЕЛИЧЕНО */
                width: 450px; /* УВЕЛИЧЕНО */
                max-width: 90vw;
                z-index: 10010; /* Выше модального окна */
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                display: none;
            }

            .gs-settings-panel.active {
                display: block;
            }

            .gs-settings-title {
                color: var(--gs-text);
                font-weight: 600;
                font-size: 18px; /* УВЕЛИЧЕНО */
                margin: 0 0 20px 0;
                padding-bottom: 15px;
                border-bottom: 2px solid var(--gs-accent);
                text-align: center;
            }

            .gs-setting-item {
                margin-bottom: 20px;
            }

            .gs-setting-label {
                display: block;
                color: var(--gs-text);
                font-size: 14px; /* УВЕЛИЧЕНО */
                margin-bottom: 8px;
                font-weight: 500;
            }

            .gs-select, .gs-input, .gs-textarea {
                width: 100%;
                padding: 10px 12px; /* УВЕЛИЧЕНО */
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid var(--gs-border);
                border-radius: 8px;
                color: var(--gs-text);
                font-size: 14px; /* УВЕЛИЧЕНО */
                outline: none;
                transition: border-color 0.2s;
            }

            .gs-select:focus, .gs-input:focus, .gs-textarea:focus {
                border-color: var(--gs-accent);
            }

            .gs-textarea {
                min-height: 100px;
                resize: vertical;
            }

            .gs-buttons-row {
                display: flex;
                gap: 15px;
                margin-top: 25px;
            }

            .gs-settings-btn {
                flex: 1;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid var(--gs-border);
                background: rgba(255, 255, 255, 0.1);
                color: var(--gs-text);
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.15s ease;
            }

            .gs-settings-btn:hover {
                background: var(--gs-hover);
                transform: translateY(-2px);
            }

            .gs-settings-btn.danger {
                background: rgba(244, 67, 54, 0.2);
                border-color: rgba(244, 67, 54, 0.4);
                color: #ff6b6b;
            }

            .gs-settings-btn.primary {
                background: var(--gs-accent);
                border-color: var(--gs-accent);
                color: white;
            }

            .gs-settings-btn.primary:hover {
                background: var(--gs-hover);
                border-color: var(--gs-hover);
            }

            /* Статистика */
            .gs-stats-panel {
                background: var(--gs-primary);
                border: 1px solid var(--gs-border);
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }

            .gs-stats-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid var(--gs-border);
            }

            .gs-stats-item:last-child {
                border-bottom: none;
            }

            .gs-stats-label {
                color: var(--gs-text);
                font-size: 14px;
            }

            .gs-stats-value {
                color: var(--gs-accent);
                font-weight: 600;
                font-size: 14px;
            }

            /* Кастомизация - УЛУЧШЕНА */
            .gs-custom-section {
                margin-top: 20px;
                padding: 20px;
                background: var(--gs-primary);
                border-radius: 8px;
                border: 1px solid var(--gs-border);
            }

            .gs-custom-section h3 {
                color: var(--gs-text);
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 18px;
                border-bottom: 2px solid var(--gs-accent);
                padding-bottom: 10px;
            }

            .gs-custom-btn {
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px dashed var(--gs-border);
                border-radius: 8px;
                color: var(--gs-text);
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }

            .gs-custom-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--gs-accent);
            }

            /* Закрыть настройки */
            .gs-close-settings {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: var(--gs-text);
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .gs-close-settings:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            /* Адаптивность */
            @media (max-width: 768px) {
                .gs-modal {
                    width: 98%;
                    max-height: 95vh;
                }
                
                .gs-category-content {
                    grid-template-columns: 1fr;
                }
                
                .gs-settings-panel {
                    width: 95vw;
                    padding: 15px;
                }
                
                .gs-controls {
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }
                
                .gs-control-btn {
                    padding: 6px 10px;
                    font-size: 12px;
                }
                
                .gs-settings-panel {
                    width: 95vw;
                    padding: 15px;
                }
                
                .gs-select, .gs-input, .gs-textarea {
                    font-size: 16px; /* Увеличиваем для мобилок */
                }
            }

            /* Скроллбар - УЛУЧШЕН */
            .gs-modal-content::-webkit-scrollbar {
                width: 10px;
            }
            
            .gs-modal-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
            }
            
            .gs-modal-content::-webkit-scrollbar-thumb {
                background: var(--gs-accent);
                border-radius: 5px;
            }
            
            .gs-modal-content::-webkit-scrollbar-thumb:hover {
                background: var(--gs-hover);
            }
            
            /* Затемнение фона при открытых настройках */
            .gs-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10005;
                display: none;
            }
            
            .gs-settings-overlay.active {
                display: block;
            }
            
            /* Для светлых тем - корректируем placeholder */
            body:has(.gs-modal.light-theme) .gs-search-input::placeholder {
                color: rgba(0, 0, 0, 0.5);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        // Применяем тему по умолчанию
        applyTheme('dark_black');
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

        initialize(allButtons) {
            this.allButtons = allButtons;
        }

        search(term) {
            this.searchTerm = term.toLowerCase().trim();
            
            if (!this.searchTerm) {
                return null;
            }

            const results = this.allButtons.filter(button => 
                button.title.toLowerCase().includes(this.searchTerm) ||
                button.content.toLowerCase().includes(this.searchTerm) ||
                button.categoryName.toLowerCase().includes(this.searchTerm)
            );

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
    }

    // ========== ГЛАВНОЕ МОДАЛЬНОЕ ОКНО ==========
    class ModalWindow {
        constructor() {
            this.modal = null;
            this.overlay = null;
            this.searchSystem = new SearchSystem();
            this.settingsPanel = null;
            this.settingsOverlay = null;
            this.currentSettings = Storage.getSettings();
            this.openCategories = new Set(this.currentSettings.openCategories);
            this.currentTab = 'all';
            this.allButtons = this.getAllButtons();
        }

        getAllButtons() {
            const allButtons = [];
            const favorites = Storage.getFavorites();
            const customButtons = Storage.getCustomButtons();
            
            // Стандартные кнопки
            buttonCategories.forEach(category => {
                category.buttons.forEach(button => {
                    allButtons.push({
                        ...button,
                        categoryId: category.id,
                        categoryName: category.name,
                        isFavorite: favorites.includes(button.id),
                        isCustom: false
                    });
                });
            });
            
            // Пользовательские кнопки
            customButtons.forEach(button => {
                allButtons.push({
                    ...button,
                    categoryId: button.category,
                    categoryName: 'Мои ответы',
                    isFavorite: favorites.includes(button.id),
                    isCustom: true
                });
            });
            
            return allButtons;
        }

        show() {
            this.createModal();
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);
            
            this.escapeHandler = (e) => {
                if (e.key === 'Escape') this.close();
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        createModal() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'gs-modal-overlay active';
            this.overlay.onclick = () => this.close();

            this.modal = document.createElement('div');
            this.modal.className = `gs-modal active`;
            this.modal.onclick = (e) => e.stopPropagation();

            // Применяем текущую тему
            applyTheme(this.currentSettings.theme);
            this.searchSystem.initialize(this.allButtons);

            this.buildHeader();
            this.buildTabs();
            this.buildSearch();
            this.buildContent();
            this.buildSettingsPanel();

            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);
        }

        buildHeader() {
            const header = document.createElement('div');
            header.className = 'gs-modal-header';

            const title = document.createElement('h2');
            title.className = 'gs-modal-title';
            title.innerHTML = '📋 <span>Быстрые ответы для ГС/ЗГС</span>';

            const controls = document.createElement('div');
            controls.className = 'gs-controls';

            const favoritesBtn = document.createElement('button');
            favoritesBtn.className = 'gs-control-btn';
            favoritesBtn.innerHTML = '⭐ Избранное';
            favoritesBtn.onclick = () => this.switchTab('favorites');

            const statsBtn = document.createElement('button');
            statsBtn.className = 'gs-control-btn';
            statsBtn.innerHTML = '📊 Статистика';
            statsBtn.onclick = () => this.switchTab('stats');

            const customBtn = document.createElement('button');
            customBtn.className = 'gs-control-btn';
            customBtn.innerHTML = '✏️ Мои ответы';
            customBtn.onclick = () => this.switchTab('custom');

            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'gs-control-btn';
            settingsBtn.innerHTML = '⚙️ Настройки';
            settingsBtn.onclick = (e) => {
                e.stopPropagation();
                this.showSettingsPanel();
            };

            controls.appendChild(favoritesBtn);
            controls.appendChild(statsBtn);
            controls.appendChild(customBtn);
            controls.appendChild(settingsBtn);
            header.appendChild(title);
            header.appendChild(controls);

            this.modal.appendChild(header);
        }

        buildTabs() {
            const tabs = document.createElement('div');
            tabs.className = 'gs-tabs';

            const tabsData = [
                { id: 'all', name: 'Все ответы' },
                { id: 'favorites', name: 'Избранное' },
                { id: 'stats', name: 'Статистика' },
                { id: 'custom', name: 'Мои ответы' }
            ];

            tabsData.forEach(tabData => {
                const tab = document.createElement('button');
                tab.className = `gs-tab ${tabData.id === this.currentTab ? 'active' : ''}`;
                tab.textContent = tabData.name;
                tab.onclick = () => this.switchTab(tabData.id);
                tabs.appendChild(tab);
            });

            this.modal.appendChild(tabs);
        }

        buildSearch() {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'gs-search-container';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'gs-search-input';
            searchInput.placeholder = 'Поиск по ответам...';
            searchInput.autocomplete = 'off';

            searchInput.oninput = debounce((e) => {
                this.handleSearch(e.target.value);
            }, 150);

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

        switchTab(tabId) {
            this.currentTab = tabId;
            
            // Обновляем активную вкладку
            const tabs = this.modal.querySelectorAll('.gs-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            const tabElements = this.modal.querySelectorAll('.gs-tab');
            tabElements.forEach((tab, index) => {
                const tabIds = ['all', 'favorites', 'stats', 'custom'];
                if (tabIds[index] === tabId) {
                    tab.classList.add('active');
                }
            });
            
            this.renderContent();
        }

        renderContent() {
            this.contentElement.innerHTML = '';
            
            switch(this.currentTab) {
                case 'favorites':
                    this.renderFavorites();
                    break;
                case 'stats':
                    this.renderStatistics();
                    break;
                case 'custom':
                    this.renderCustomSection();
                    break;
                default:
                    if (this.searchTerm) {
                        this.renderSearchResults(this.searchResults);
                    } else {
                        this.renderAllCategories();
                    }
            }
        }

        renderAllCategories() {
            const allCategories = [...buttonCategories];
            const customButtons = Storage.getCustomButtons();
            
            // Добавляем категорию для пользовательских кнопок
            if (customButtons.length > 0) {
                allCategories.push({
                    id: 'custom',
                    name: 'Мои ответы',
                    defaultOpen: true,
                    buttons: customButtons
                });
            }
            
            allCategories.forEach(category => {
                const categoryElement = this.createCategoryElement(category);
                this.contentElement.appendChild(categoryElement);
            });
        }

        createCategoryElement(category) {
            const isOpen = this.openCategories.has(category.id);
            const categoryDiv = document.createElement('div');
            categoryDiv.className = `gs-category ${isOpen ? 'open' : ''}`;
            categoryDiv.dataset.categoryId = category.id;

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

            const content = document.createElement('div');
            content.className = 'gs-category-content';
            content.style.display = isOpen ? 'grid' : 'none';

            const favorites = Storage.getFavorites();
            const useCounts = Storage.getUseCounts();
            
            category.buttons.forEach(button => {
                const buttonElement = this.createButtonElement(button, category.id, favorites.includes(button.id), useCounts[button.id]);
                content.appendChild(buttonElement);
            });

            categoryDiv.appendChild(header);
            categoryDiv.appendChild(content);

            return categoryDiv;
        }

        createButtonElement(button, categoryId, isFavorite = false, useCount = 0) {
            const btn = document.createElement('button');
            btn.className = `gs-answer-btn ${isFavorite ? 'favorite' : ''}`;
            btn.dataset.buttonId = button.id;
            btn.dataset.categoryId = categoryId;

            const titleSpan = document.createElement('span');
            titleSpan.textContent = button.title;
            titleSpan.style.flex = '1';
            titleSpan.style.marginRight = '10px';
            titleSpan.style.wordBreak = 'break-word';

            const controlsSpan = document.createElement('span');
            controlsSpan.style.display = 'flex';
            controlsSpan.style.alignItems = 'center';
            controlsSpan.style.gap = '8px';
            controlsSpan.style.flexShrink = '0';

            if (useCount > 0) {
                const statsSpan = document.createElement('span');
                statsSpan.className = 'gs-stats';
                statsSpan.textContent = `×${useCount}`;
                statsSpan.style.fontSize = '12px';
                statsSpan.style.opacity = '0.7';
                controlsSpan.appendChild(statsSpan);
            }

            const starSpan = document.createElement('span');
            starSpan.className = `gs-favorite-icon ${isFavorite ? 'active' : ''}`;
            starSpan.innerHTML = '⭐';
            starSpan.title = isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';
            starSpan.onclick = (e) => {
                e.stopPropagation();
                this.toggleFavorite(button.id);
            };

            controlsSpan.appendChild(starSpan);

            btn.appendChild(titleSpan);
            btn.appendChild(controlsSpan);

            btn.onclick = (e) => {
                if (!e.target.classList.contains('gs-favorite-icon') && 
                    !e.target.classList.contains('gs-stats')) {
                    if (insertTextToReply(button.content)) {
                        Storage.incrementUseCount(button.id);
                        this.close();
                    }
                }
            };

            return btn;
        }

        toggleFavorite(buttonId) {
            const favorites = Storage.toggleFavorite(buttonId);
            
            // Обновляем отображение кнопки
            const buttonElement = this.contentElement.querySelector(`[data-button-id="${buttonId}"]`);
            if (buttonElement) {
                const starIcon = buttonElement.querySelector('.gs-favorite-icon');
                if (favorites.includes(buttonId)) {
                    buttonElement.classList.add('favorite');
                    starIcon.classList.add('active');
                    starIcon.title = 'Удалить из избранного';
                } else {
                    buttonElement.classList.remove('favorite');
                    starIcon.classList.remove('active');
                    starIcon.title = 'Добавить в избранное';
                }
            }
            
            // Если мы на вкладке избранного, обновляем контент
            if (this.currentTab === 'favorites') {
                this.renderFavorites();
            }
        }

        renderFavorites() {
            const favorites = Storage.getFavorites();
            const useCounts = Storage.getUseCounts();
            
            if (favorites.length === 0) {
                this.contentElement.innerHTML = `
                    <div style="text-align: center; padding: 60px 40px; color: var(--gs-text);">
                        <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">⭐</div>
                        <h3 style="margin-bottom: 10px; font-size: 18px;">Нет избранных ответов</h3>
                        <p style="opacity: 0.7; font-size: 14px;">Нажимайте на звёздочки у ответов, чтобы добавить их сюда</p>
                    </div>
                `;
                return;
            }

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'gs-category open';

            const header = document.createElement('div');
            header.className = 'gs-category-header';
            
            const title = document.createElement('div');
            title.className = 'gs-category-title';
            
            const count = document.createElement('span');
            count.className = 'gs-category-count';
            count.textContent = favorites.length;

            title.appendChild(count);
            title.appendChild(document.createTextNode('Избранное'));

            header.appendChild(title);
            categoryDiv.appendChild(header);

            const content = document.createElement('div');
            content.className = 'gs-category-content';
            content.style.display = 'grid';

            // Находим избранные кнопки
            favorites.forEach(buttonId => {
                const button = this.allButtons.find(b => b.id === buttonId);
                if (button) {
                    const buttonElement = this.createButtonElement(button, 'favorites', true, useCounts[buttonId]);
                    content.appendChild(buttonElement);
                }
            });

            categoryDiv.appendChild(content);
            this.contentElement.appendChild(categoryDiv);
        }

        renderStatistics() {
            const useCounts = Storage.getUseCounts();
            const totalUses = Object.values(useCounts).reduce((sum, count) => sum + count, 0);
            const favoriteCount = Storage.getFavorites().length;
            const totalButtons = this.allButtons.length;

            const statsPanel = document.createElement('div');
            statsPanel.className = 'gs-stats-panel';

            const stats = [
                { label: 'Всего ответов', value: totalButtons },
                { label: 'Избранных ответов', value: favoriteCount },
                { label: 'Всего использований', value: totalUses }
            ];

            stats.forEach(stat => {
                const item = document.createElement('div');
                item.className = 'gs-stats-item';
                
                const label = document.createElement('div');
                label.className = 'gs-stats-label';
                label.textContent = stat.label;
                
                const value = document.createElement('div');
                value.className = 'gs-stats-value';
                value.textContent = stat.value;
                
                item.appendChild(label);
                item.appendChild(value);
                statsPanel.appendChild(item);
            });

            // Топ 5 самых используемых
            const sortedButtons = Object.entries(useCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (sortedButtons.length > 0) {
                const topTitle = document.createElement('h3');
                topTitle.style.cssText = `
                    color: var(--gs-text);
                    font-size: 16px;
                    margin: 25px 0 15px 0;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--gs-border);
                `;
                topTitle.textContent = 'Самые популярные ответы';
                statsPanel.appendChild(topTitle);

                sortedButtons.forEach(([buttonId, count], index) => {
                    const button = this.allButtons.find(b => b.id === buttonId);
                    if (button) {
                        const item = document.createElement('div');
                        item.className = 'gs-stats-item';
                        item.style.alignItems = 'center';
                        
                        const rank = document.createElement('span');
                        rank.style.cssText = `
                            color: var(--gs-accent);
                            font-weight: bold;
                            margin-right: 10px;
                            min-width: 20px;
                        `;
                        rank.textContent = `${index + 1}.`;
                        
                        const label = document.createElement('div');
                        label.className = 'gs-stats-label';
                        label.style.flex = '1';
                        label.textContent = button.title.length > 40 ? button.title.substring(0, 40) + '...' : button.title;
                        
                        const value = document.createElement('div');
                        value.className = 'gs-stats-value';
                        value.textContent = `×${count}`;
                        
                        item.appendChild(rank);
                        item.appendChild(label);
                        item.appendChild(value);
                        statsPanel.appendChild(item);
                    }
                });
            }

            this.contentElement.appendChild(statsPanel);
        }

        renderCustomSection() {
            const customButtons = Storage.getCustomButtons();
            
            let html = `
                <div class="gs-custom-section">
                    <h3>➕ Добавить свой ответ</h3>
                    
                    <div class="gs-setting-item">
                        <label class="gs-setting-label">Название ответа</label>
                        <input type="text" class="gs-input" id="gs-custom-title" placeholder="Например: | Мой ответ |">
                    </div>
                    
                    <div class="gs-setting-item">
                        <label class="gs-setting-label">Текст ответа (BBCode)</label>
                        <textarea class="gs-textarea" id="gs-custom-content" placeholder="[B]Текст ответа... {{ greeting }}...[/B]" rows="5"></textarea>
                        <div style="font-size: 12px; color: var(--gs-text); opacity: 0.7; margin-top: 8px;">
                            💡 Можно использовать <strong>{{ greeting }}</strong> для автоматической подстановки приветствия
                        </div>
                    </div>
                    
                    <div class="gs-setting-item">
                        <label class="gs-setting-label">Категория</label>
                        <select class="gs-select" id="gs-custom-category">
                            <option value="custom">Мои ответы</option>
                        </select>
                    </div>
                    
                    <div class="gs-buttons-row">
                        <button class="gs-settings-btn primary" id="gs-add-custom-btn" style="flex: 2;">
                            💾 Сохранить ответ
                        </button>
                        <button class="gs-settings-btn" id="gs-preview-custom-btn" style="flex: 1;">
                            👁️ Предпросмотр
                        </button>
                    </div>
            `;

            if (customButtons.length > 0) {
                html += `
                    <div style="margin-top: 30px;">
                        <h3 style="color: var(--gs-text); border-bottom: 1px solid var(--gs-border); padding-bottom: 10px; margin-bottom: 15px;">📝 Мои сохранённые ответы (${customButtons.length})</h3>
                        <div class="gs-category-content" style="display: grid; margin-top: 15px; gap: 15px;">
                `;

                customButtons.forEach((button, index) => {
                    html += `
                        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: var(--gs-primary); border-radius: 8px; border: 1px solid var(--gs-border);">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <span style="color: var(--gs-accent); font-weight: bold; font-size: 14px;">${index + 1}.</span>
                                    <strong style="color: var(--gs-text); font-size: 14px;">${button.title}</strong>
                                </div>
                                <div style="color: var(--gs-text); opacity: 0.7; font-size: 12px; line-height: 1.4;">
                                    ${button.content.substring(0, 80)}${button.content.length > 80 ? '...' : ''}
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="gs-settings-btn" data-button-id="${button.id}" data-action="use" style="font-size: 12px; padding: 8px 12px;">
                                    Вставить
                                </button>
                                <button class="gs-settings-btn danger" data-button-id="${button.id}" data-action="delete" style="font-size: 12px; padding: 8px 12px;">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div style="text-align: center; padding: 40px 20px; color: var(--gs-text); opacity: 0.7;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📝</div>
                        <h4 style="margin-bottom: 10px;">У вас пока нет своих ответов</h4>
                        <p>Создайте свой первый ответ используя форму выше</p>
                    </div>
                `;
            }

            html += `</div>`;

            this.contentElement.innerHTML = html;

            // Обработчики для кастомизации
            const addBtn = document.getElementById('gs-add-custom-btn');
            const previewBtn = document.getElementById('gs-preview-custom-btn');
            
            if (addBtn) {
                addBtn.onclick = () => {
                    const title = document.getElementById('gs-custom-title').value.trim();
                    const content = document.getElementById('gs-custom-content').value.trim();
                    const category = document.getElementById('gs-custom-category').value;

                    if (!title || !content) {
                        alert('❗ Заполните название и текст ответа');
                        return;
                    }

                    Storage.saveCustomButton({ title, content, category });
                    
                    // Очищаем поля
                    document.getElementById('gs-custom-title').value = '';
                    document.getElementById('gs-custom-content').value = '';
                    
                    // Обновляем список
                    this.renderCustomSection();
                    
                    // Обновляем общий список кнопок
                    this.allButtons = this.getAllButtons();
                    this.searchSystem.initialize(this.allButtons);
                    
                    // Показываем уведомление
                    this.showNotification('✅ Ответ успешно сохранен!');
                };
            }
            
            if (previewBtn) {
                previewBtn.onclick = () => {
                    const content = document.getElementById('gs-custom-content').value.trim();
                    if (!content) {
                        alert('Введите текст для предпросмотра');
                        return;
                    }
                    
                    const greeting = getGreeting();
                    const processedText = content.replace(/\{\{\s*greeting\s*\}\}/g, greeting);
                    
                    alert('Предпросмотр ответа:\n\n' + processedText);
                };
            }

            // Обработчики для сохранённых кнопок
            document.querySelectorAll('[data-button-id]').forEach(btn => {
                btn.onclick = (e) => {
                    const buttonId = e.target.dataset.buttonId;
                    const action = e.target.dataset.action;
                    
                    if (action === 'use') {
                        const button = Storage.getCustomButtons().find(b => b.id === buttonId);
                        if (button && insertTextToReply(button.content)) {
                            Storage.incrementUseCount(buttonId);
                            this.close();
                        }
                    } else if (action === 'delete') {
                        if (confirm('❓ Удалить этот ответ?')) {
                            Storage.deleteCustomButton(buttonId);
                            this.renderCustomSection();
                            this.allButtons = this.getAllButtons();
                            this.searchSystem.initialize(this.allButtons);
                        }
                    }
                };
            });
        }

        buildSettingsPanel() {
            // Оверлей для настроек
            this.settingsOverlay = document.createElement('div');
            this.settingsOverlay.className = 'gs-settings-overlay';
            this.settingsOverlay.onclick = () => this.closeSettingsPanel();
            
            // Панель настроек
            this.settingsPanel = document.createElement('div');
            this.settingsPanel.className = 'gs-settings-panel';
            this.settingsPanel.onclick = (e) => e.stopPropagation();

            const title = document.createElement('h3');
            title.className = 'gs-settings-title';
            title.textContent = '⚙️ Настройки';

            // Кнопка закрытия
            const closeBtn = document.createElement('button');
            closeBtn.className = 'gs-close-settings';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = () => this.closeSettingsPanel();

            // Тема оформления - теперь сгруппированы
            const themeSetting = document.createElement('div');
            themeSetting.className = 'gs-setting-item';
            themeSetting.innerHTML = `
                <label class="gs-setting-label">🎨 Тема оформления</label>
                <select class="gs-select" id="gs-theme-select">
                    <optgroup label="🌙 Тёмные темы">
                        <option value="dark_black">Чёрная</option>
                        <option value="dark_gray">Тёмно-серая</option>
                        <option value="dark_blue">Тёмно-синяя</option>
                        <option value="dark_green">Тёмно-зелёная</option>
                        <option value="dark_purple">Тёмно-фиолетовая</option>
                        <option value="dark_red">Тёмно-красная</option>
                        <option value="dark_orange">Тёмно-оранжевая</option>
                    </optgroup>
                    <optgroup label="☀️ Светлые темы">
                        <option value="light_white">Белая</option>
                        <option value="light_gray">Светло-серая</option>
                        <option value="light_blue">Светло-голубая</option>
                        <option value="light_green">Светло-зелёная</option>
                        <option value="light_pink">Светло-розовая</option>
                        <option value="light_yellow">Светло-жёлтая</option>
                    </optgroup>
                    <optgroup label="🎮 Специальные">
                        <option value="high_contrast">Высокая контрастность</option>
                        <option value="terminal">Терминал</option>
                        <option value="matrix">Матрица</option>
                    </optgroup>
                </select>
            `;

            // Размер шрифта
            const fontSizeSetting = document.createElement('div');
            fontSizeSetting.className = 'gs-setting-item';
            fontSizeSetting.innerHTML = `
                <label class="gs-setting-label">🔤 Размер шрифта</label>
                <select class="gs-select" id="gs-font-size-select">
                    <option value="small">Маленький</option>
                    <option value="medium">Средний</option>
                    <option value="large">Большой</option>
                </select>
            `;

            // Кнопки
            const buttonsRow = document.createElement('div');
            buttonsRow.className = 'gs-buttons-row';

            const saveBtn = document.createElement('button');
            saveBtn.className = 'gs-settings-btn primary';
            saveBtn.textContent = '💾 Сохранить';
            saveBtn.onclick = () => this.saveSettings();

            const clearBtn = document.createElement('button');
            clearBtn.className = 'gs-settings-btn danger';
            clearBtn.textContent = '🗑️ Очистить всё';
            clearBtn.onclick = () => {
                if (confirm('⚠️ Очистить ВСЕ данные (настройки, избранное, статистику, пользовательские ответы)?')) {
                    Storage.clearAllData();
                    this.currentSettings = Storage.getSettings();
                    this.closeSettingsPanel();
                    this.showNotification('✅ Все данные очищены');
                    // Перезагружаем окно
                    this.close();
                    const modal = new ModalWindow();
                    modal.show();
                }
            };

            buttonsRow.appendChild(saveBtn);
            buttonsRow.appendChild(clearBtn);

            this.settingsPanel.appendChild(closeBtn);
            this.settingsPanel.appendChild(title);
            this.settingsPanel.appendChild(themeSetting);
            this.settingsPanel.appendChild(fontSizeSetting);
            this.settingsPanel.appendChild(buttonsRow);

            document.body.appendChild(this.settingsOverlay);
            document.body.appendChild(this.settingsPanel);
        }

        showSettingsPanel() {
            // Устанавливаем текущие значения
            setTimeout(() => {
                const themeSelect = document.getElementById('gs-theme-select');
                const fontSizeSelect = document.getElementById('gs-font-size-select');
                if (themeSelect) themeSelect.value = this.currentSettings.theme;
                if (fontSizeSelect) fontSizeSelect.value = this.currentSettings.fontSize;
            }, 0);
            
            // Показываем панель
            this.settingsOverlay.classList.add('active');
            this.settingsPanel.classList.add('active');
        }

        closeSettingsPanel() {
            this.settingsOverlay.classList.remove('active');
            this.settingsPanel.classList.remove('active');
        }

        saveSettings() {
            const theme = document.getElementById('gs-theme-select').value;
            const fontSize = document.getElementById('gs-font-size-select').value;

            this.currentSettings = {
                ...this.currentSettings,
                theme,
                fontSize,
                openCategories: Array.from(this.openCategories)
            };

            Storage.saveSettings(this.currentSettings);
            applyTheme(theme);
            
            this.closeSettingsPanel();
            this.showNotification('✅ Настройки сохранены');
            
            // Обновляем текущее окно
            this.close();
            const modal = new ModalWindow();
            modal.show();
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--gs-accent);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                font-weight: 600;
                animation: fadeInOut 2s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

            this.currentSettings.openCategories = Array.from(this.openCategories);
            Storage.saveSettings(this.currentSettings);

            const categoryElement = this.contentElement.querySelector(`[data-category-id="${categoryId}"]`);
            if (categoryElement) {
                const content = categoryElement.querySelector('.gs-category-content');
                const isOpen = categoryElement.classList.contains('open');
                
                categoryElement.classList.toggle('open');
                content.style.display = isOpen ? 'none' : 'grid';
            }
        }

        handleSearch(term) {
            this.searchTerm = term;
            
            if (term.trim() === '') {
                this.renderContent();
                return;
            }

            this.searchResults = this.searchSystem.search(term);
            if (this.searchResults && Object.keys(this.searchResults).length > 0) {
                this.renderSearchResults(this.searchResults);
            } else {
                this.contentElement.innerHTML = `
                    <div style="text-align: center; padding: 60px 40px; color: var(--gs-text); opacity: 0.5;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                        <h3 style="margin-bottom: 10px;">Ничего не найдено</h3>
                        <p>По запросу "${term}" ответов не найдено</p>
                    </div>
                `;
            }
        }

        renderSearchResults(results) {
            this.contentElement.innerHTML = '';
            
            Object.entries(results).forEach(([categoryId, categoryData]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'gs-category open';
                
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
                categoryDiv.appendChild(header);

                const content = document.createElement('div');
                content.className = 'gs-category-content';
                content.style.display = 'grid';

                const favorites = Storage.getFavorites();
                const useCounts = Storage.getUseCounts();
                
                categoryData.buttons.forEach(button => {
                    const buttonElement = this.createButtonElement(button, categoryId, favorites.includes(button.id), useCounts[button.id]);
                    
                    // Подсветка найденного текста
                    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
                    const titleSpan = buttonElement.querySelector('span:first-child');
                    const originalTitle = button.title;
                    titleSpan.innerHTML = originalTitle.replace(regex, '<mark style="background: #ffd700; color: #000; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                    
                    buttonElement.classList.add('highlight');
                    content.appendChild(buttonElement);
                });

                categoryDiv.appendChild(content);
                this.contentElement.appendChild(categoryDiv);
            });
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
            if (this.settingsOverlay) {
                this.settingsOverlay.remove();
                this.settingsOverlay = null;
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
        
        // Ищем любую кнопку ответа на странице
        const replySelectors = [
            'a[href*="#quickReply"]',
            '.button--icon--reply',
            'button[onclick*="reply"]',
            '.replyButton',
            '.quickReply',
            'a.button[href*="reply"]',
            'button.button[onclick*="reply"]'
        ];
        
        let replyButton = null;
        
        for (const selector of replySelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element.textContent && 
                   (element.textContent.includes('Ответить') || 
                    element.textContent.includes('Reply') ||
                    element.getAttribute('href')?.includes('reply') ||
                    element.getAttribute('onclick')?.includes('reply'))) {
                    replyButton = element;
                    break;
                }
            }
            if (replyButton) break;
        }
        
        // Если не нашли, ищем по классам actionBar
        if (!replyButton) {
            const actionBars = document.querySelectorAll('.actionBar, .pageAction, .buttonGroup, .messageMeta');
            for (const actionBar of actionBars) {
                const replyLinks = actionBar.querySelectorAll('a, button');
                for (const link of replyLinks) {
                    if (link.textContent && link.textContent.includes('Ответить')) {
                        replyButton = link;
                        break;
                    }
                }
                if (replyButton) break;
            }
        }
        
        if (replyButton && replyButton.parentNode) {
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
            
            // Вставляем после кнопки "Ответить"
            replyButton.parentNode.insertBefore(answerButton, replyButton.nextSibling);
            
            // Также добавляем стиль для позиционирования
            answerButton.style.marginLeft = '5px';
            answerButton.style.marginRight = '5px';
            
            return true;
        }
        
        return false;
    };

    const init = () => {
        console.log('Скрипт ГС/ЗГС PRO Ultimate инициализируется...');
        
        // Добавляем стили
        addStyles();
        addButtonStyles();
        
        // Пытаемся добавить кнопку сразу
        if (!addAnswerButton()) {
            // Если не получилось, ждём и пробуем снова
            const checkInterval = setInterval(() => {
                if (addAnswerButton()) {
                    clearInterval(checkInterval);
                    console.log('Кнопка "Ответы ГС/ЗГС" добавлена');
                }
            }, 1000);
            
            // Останавливаем проверку через 10 секунд
            setTimeout(() => clearInterval(checkInterval), 10000);
        } else {
            console.log('Кнопка "Ответы ГС/ЗГС" добавлена сразу');
        }
        
        // Наблюдатель за изменениями DOM
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

    // Запускаем скрипт
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();