// ==UserScript==
// @name         Rmine Assignee
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Подсветка пользователей
// @author       Nikitka
// @match        https://rmine.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554401/Rmine%20Assignee.user.js
// @updateURL https://update.greasyfork.org/scripts/554401/Rmine%20Assignee.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация по умолчанию
    const DEFAULT_CONFIG = {
        users: [
            // РП
            { name: "Лаврушко Елена", color: "#a0a0a0" },
            { name: "Лоза Кирилл", color: "#a0a0a0" },
            { name: "Грибанов Александр", color: "#a0a0a0" },

            // Начальника
            { name: "Снигур Алексей", color: "#00ff7b" },

            // Тим лиды аналитики (темные оттенки)
            { name: "Журавлев Максим", color: "#006400" },
            { name: "Шилина Татьяна", color: "#8b0000" },
            { name: "Нянькина Кристина", color: "#4b0082" },

            // Тим лиды разработки (светлые оттенки)
            { name: "Логвин Владислав", color: "#90ee90" },
            { name: "Каминский Александр", color: "#ffb6c1" },
            { name: "Серов Никита", color: "#87ceeb" },
            { name: "Коновалов Роман", color: "#dda0dd" },

            // Дата Инженер
            { name: "Орлов Святослав", color: "#ffa500" }
        ]
    };

    // Стили для расширения
    GM_addStyle(`
        .highlight-settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        }

        .highlight-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }

        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .settings-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
        }

        .close-button {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }

        .user-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .user-input-container {
            flex: 1;
            position: relative;
            margin-right: 10px;
        }

        .user-name-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .autocomplete-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-top: none;
            border-radius: 0 0 4px 4px;
            max-height: 150px;
            overflow-y: auto;
            z-index: 10001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .autocomplete-suggestion {
            padding: 8px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }

        .autocomplete-suggestion:hover {
            background-color: #f0f0f0;
        }

        .autocomplete-suggestion:last-child {
            border-bottom: none;
        }

        .color-input {
            width: 60px;
            height: 35px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-right: 10px;
            cursor: pointer;
        }

        .remove-user-button {
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
        }

        .add-user-button {
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            cursor: pointer;
            margin-top: 10px;
        }

        .save-button {
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            width: 100%;
        }

        .reset-button {
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            width: 100%;
        }

        .buttons-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .instructions {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-size: 12px;
            color: #666;
        }

        .user-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
        }

        .search-section {
            margin-bottom: 20px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
        }

        .search-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        .search-results {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
        }

        .search-result-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
        }

        .search-result-item:hover {
            background-color: #f0f0f0;
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .add-from-search {
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 3px 8px;
            font-size: 12px;
            cursor: pointer;
        }

        .confirmation-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 10002;
            min-width: 300px;
            text-align: center;
        }

        .confirmation-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }

        .confirm-button {
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
        }

        .cancel-button {
            background: #666;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
        }
    `);

    class UserHighlighter {
        constructor() {
            this.config = this.loadConfig();
            this.availableUsers = [];
            this.initialize();
        }

        loadConfig() {
            const saved = GM_getValue('highlightConfig');
            return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
        }

        saveConfig(config) {
            this.config = config;
            GM_setValue('highlightConfig', JSON.stringify(config));
            this.applyHighlighting();
        }

        resetToDefault() {
            this.saveConfig(DEFAULT_CONFIG);
        }

        initialize() {
            this.collectAvailableUsers();
            this.applyHighlighting();
            this.observeChanges();
            this.registerMenuCommand();
        }

        collectAvailableUsers() {
            const select = document.getElementById('issue_assigned_to_id');
            this.availableUsers = [];

            if (select) {
                const options = select.getElementsByTagName('option');
                Array.from(options).forEach(option => {
                    if (option.value && option.textContent.trim() && option.textContent.trim() !== '<< мне >>') {
                        this.availableUsers.push({
                            name: option.textContent.trim(),
                            value: option.value
                        });
                    }
                });
            }

            // Убираем дубликаты
            this.availableUsers = this.availableUsers.filter((user, index, self) =>
                index === self.findIndex(u => u.name === user.name)
            );
        }

        registerMenuCommand() {
            GM_registerMenuCommand('Настройки подсветки пользователей', () => {
                this.showSettingsModal();
            });
        }

        showSettingsModal() {
            // Создаем overlay
            const overlay = document.createElement('div');
            overlay.className = 'highlight-settings-overlay';

            // Создаем модальное окно
            const modal = document.createElement('div');
            modal.className = 'highlight-settings-modal';
            modal.innerHTML = `
                <div class="settings-header">
                    <h2 class="settings-title">Настройки подсветки пользователей</h2>
                    <button class="close-button">&times;</button>
                </div>

                <div class="search-section">
                    <h3>Поиск пользователей на странице</h3>
                    <input type="text" class="search-input" placeholder="Введите имя для поиска..." id="userSearchInput">
                    <div class="search-results" id="userSearchResults"></div>
                </div>

                <div class="instructions">
                    Укажите имена пользователей и выберите цвет подсветки для каждого.<br>
                    Имена должны точно соответствовать отображаемым в списке.
                </div>

                <div class="user-list" id="userListContainer">
                    ${this.generateUserListHTML()}
                </div>

                <button class="add-user-button" id="addUserButton">+ Добавить пользователя</button>

                <div class="buttons-container">
                    <button class="save-button" id="saveSettingsButton">Сохранить настройки</button>
                    <button class="reset-button" id="resetSettingsButton">Сбросить к настройкам по умолчанию</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Инициализируем поиск
            this.initSearch(modal);

            // Обработчики событий
            modal.querySelector('.close-button').addEventListener('click', () => {
                document.body.removeChild(overlay);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });

            modal.querySelector('#addUserButton').addEventListener('click', () => {
                this.addUserInput(modal.querySelector('#userListContainer'));
            });

            modal.querySelector('#saveSettingsButton').addEventListener('click', () => {
                this.saveSettingsFromModal(modal);
                document.body.removeChild(overlay);
            });

            modal.querySelector('#resetSettingsButton').addEventListener('click', () => {
                this.showResetConfirmation(overlay, modal);
            });
        }

        showResetConfirmation(overlay, modal) {
            const confirmationModal = document.createElement('div');
            confirmationModal.className = 'confirmation-modal';
            confirmationModal.innerHTML = `
                <h3>Сброс настроек</h3>
                <p>Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?</p>
                <p>Это действие нельзя отменить.</p>
                <div class="confirmation-buttons">
                    <button class="cancel-button">Отмена</button>
                    <button class="confirm-button">Сбросить</button>
                </div>
            `;

            overlay.appendChild(confirmationModal);

            confirmationModal.querySelector('.cancel-button').addEventListener('click', () => {
                overlay.removeChild(confirmationModal);
            });

            confirmationModal.querySelector('.confirm-button').addEventListener('click', () => {
                this.resetToDefault();
                overlay.removeChild(confirmationModal);
                document.body.removeChild(overlay);

                // Показываем сообщение об успешном сбросе
                this.showSuccessMessage('Настройки сброшены к значениям по умолчанию');
            });
        }

        showSuccessMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10003;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
            `;
            messageDiv.textContent = message;

            document.body.appendChild(messageDiv);

            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 3000);
        }

        initSearch(modal) {
            const searchInput = modal.querySelector('#userSearchInput');
            const resultsContainer = modal.querySelector('#userSearchResults');

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.showSearchResults(query, resultsContainer);
            });

            // Показываем все пользователи при фокусе
            searchInput.addEventListener('focus', () => {
                this.showSearchResults('', resultsContainer);
            });
        }

        showSearchResults(query, container) {
            container.innerHTML = '';

            let filteredUsers = this.availableUsers;

            if (query) {
                filteredUsers = this.availableUsers.filter(user =>
                    user.name.toLowerCase().includes(query)
                );
            }

            if (filteredUsers.length === 0) {
                container.innerHTML = '<div class="search-result-item">Пользователи не найдены</div>';
                return;
            }

            filteredUsers.forEach(user => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <span>${user.name}</span>
                    <button class="add-from-search" data-name="${user.name}">Добавить</button>
                `;

                item.querySelector('.add-from-search').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addUserFromSearch(user.name);
                });

                container.appendChild(item);
            });
        }

        addUserFromSearch(userName) {
            const userListContainer = document.getElementById('userListContainer');
            const existingUsers = Array.from(userListContainer.querySelectorAll('.user-name-input'))
                .map(input => input.value.trim());

            if (!existingUsers.includes(userName)) {
                this.addUserInput(userListContainer, userName);
            }
        }

        generateUserListHTML() {
            return this.config.users.map((user, index) => `
                <div class="user-item" data-index="${index}">
                    <div class="user-input-container">
                        <input type="text" class="user-name-input" value="${user.name}" placeholder="Имя пользователя">
                        <div class="autocomplete-suggestions" style="display: none;"></div>
                    </div>
                    <input type="color" class="color-input" value="${user.color}">
                    <button class="remove-user-button">Удалить</button>
                </div>
            `).join('');
        }

        addUserInput(container, userName = '') {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-input-container">
                    <input type="text" class="user-name-input" placeholder="Имя пользователя" value="${userName}">
                    <div class="autocomplete-suggestions" style="display: none;"></div>
                </div>
                <input type="color" class="color-input" value="#ffeb3b">
                <button class="remove-user-button">Удалить</button>
            `;

            // Инициализируем автодополнение для нового поля
            this.initAutocomplete(userItem.querySelector('.user-input-container'));

            userItem.querySelector('.remove-user-button').addEventListener('click', () => {
                container.removeChild(userItem);
            });

            container.appendChild(userItem);
        }

        initAutocomplete(container) {
            const input = container.querySelector('.user-name-input');
            const suggestions = container.querySelector('.autocomplete-suggestions');

            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.showAutocompleteSuggestions(query, suggestions, input);
            });

            input.addEventListener('focus', () => {
                const query = input.value.toLowerCase().trim();
                this.showAutocompleteSuggestions(query, suggestions, input);
            });

            input.addEventListener('blur', () => {
                // Скрываем подсказки с задержкой, чтобы можно было кликнуть на предложение
                setTimeout(() => {
                    suggestions.style.display = 'none';
                }, 200);
            });

            // Инициализируем автодополнение для существующих полей при открытии модального окна
            const initialQuery = input.value.toLowerCase().trim();
            if (initialQuery) {
                this.showAutocompleteSuggestions(initialQuery, suggestions, input);
            }
        }

        showAutocompleteSuggestions(query, suggestions, input) {
            suggestions.innerHTML = '';

            if (!query) {
                suggestions.style.display = 'none';
                return;
            }

            const filteredUsers = this.availableUsers.filter(user =>
                user.name.toLowerCase().includes(query)
            );

            if (filteredUsers.length === 0) {
                suggestions.style.display = 'none';
                return;
            }

            filteredUsers.forEach(user => {
                const suggestion = document.createElement('div');
                suggestion.className = 'autocomplete-suggestion';
                suggestion.textContent = user.name;

                suggestion.addEventListener('mousedown', () => {
                    input.value = user.name;
                    suggestions.style.display = 'none';
                });

                suggestions.appendChild(suggestion);
            });

            suggestions.style.display = 'block';
        }

        saveSettingsFromModal(modal) {
            const userItems = modal.querySelectorAll('.user-item');
            const users = [];

            userItems.forEach(item => {
                const nameInput = item.querySelector('.user-name-input');
                const colorInput = item.querySelector('.color-input');
                const name = nameInput.value.trim();

                if (name) {
                    users.push({
                        name: name,
                        color: colorInput.value
                    });
                }
            });

            this.saveConfig({ users: users });
        }

        applyHighlighting() {
            const select = document.getElementById('issue_assigned_to_id');
            if (!select) return;

            const options = select.getElementsByTagName('option');

            // Сначала убираем все подсветки
            Array.from(options).forEach(option => {
                option.style.backgroundColor = '';
                option.style.fontWeight = '';
                option.style.color = '';
            });

            // Применяем подсветку для каждого пользователя из конфига
            this.config.users.forEach(userConfig => {
                Array.from(options).forEach(option => {
                    if (option.textContent.trim() === userConfig.name) {
                        option.style.backgroundColor = userConfig.color;
                        option.style.fontWeight = 'bold';
                        option.style.color = this.getContrastColor(userConfig.color);
                    }
                });
            });
        }

        getContrastColor(hexcolor) {
            const r = parseInt(hexcolor.substr(1, 2), 16);
            const g = parseInt(hexcolor.substr(3, 2), 16);
            const b = parseInt(hexcolor.substr(5, 2), 16);
            const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return brightness > 128 ? '#000000' : '#FFFFFF';
        }

        observeChanges() {
            // Наблюдаем за изменениями DOM
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // Проверяем, не появился ли наш селект или не изменился ли он
                        if (mutation.target.contains(document.getElementById('issue_assigned_to_id'))) {
                            shouldUpdate = true;
                        }

                        this.applyHighlighting();
                    }
                });

                if (shouldUpdate) {
                    this.collectAvailableUsers();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // При изменении значения select
            document.addEventListener('change', (e) => {
                if (e.target.id === 'issue_assigned_to_id') {
                    this.applyHighlighting();
                }
            });
        }
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new UserHighlighter();
        });
    } else {
        new UserHighlighter();
    }
})();