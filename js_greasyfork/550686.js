// ==UserScript==
// @name         Bank Filter & Folder Manager for TradeMeBot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет фильтр по банкам и управление папками на страницу details, фильтр по папкам на страницу replenishment
// @author       vitalto
// @match        https://mfjp9fsk2epfok.me/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550686/Bank%20Filter%20%20Folder%20Manager%20for%20TradeMeBot.user.js
// @updateURL https://update.greasyfork.org/scripts/550686/Bank%20Filter%20%20Folder%20Manager%20for%20TradeMeBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Глобальная настройка перехвата запросов для увеличения лимита
    function setupRequestInterception() {
        // Перехват fetch
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (typeof url === 'string' &&
                (url.includes('/external-transaction/list') || url.includes('/bank_detail/list'))) {
                args[0] = url.replace(/limit=\d+/, 'limit=200');
            }
            return originalFetch.apply(window, args);
        };

        // Перехват XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (typeof url === 'string' &&
                (url.includes('/external-transaction/list') || url.includes('/bank_detail/list'))) {
                url = url.replace(/limit=\d+/, 'limit=200');
            }
            return originalOpen.call(this, method, url, ...rest);
        };
    }

    class BankFilter {
        constructor() {
            this.bankFilterContainer = null;
            this.folderContainer = null;
            this.massActionsContainer = null;
            this.bankSelect = null;
            this.folderSelect = null;
            this.modalOverlay = null;
            this.selectedItems = new Set();
            this.originalRows = [];
            this.isInitialized = false;
            this.urlParam = 'bankFilter';
            this.folderUrlParam = 'folderFilter';
            this.storageKey = 'bankFilterFolders';
            this.itemFolderKey = 'bankFilterItemFolders';
            this.staticBanks = [
                'Yandex-pay',
                'Ozon',
                'Ak-bars-bank',
                'Mts-bank',
                'T-bank',
                'Raiffeissen',
                'Otp-bank',
                'Alfabank',
                'Sber'
            ];


            this.setupURLChangeListener();
            this.init();
        }


        /**
         * Настройка отслеживания изменений URL
         */
        setupURLChangeListener() {
            // Отслеживаем изменения URL через popstate (кнопки назад/вперед)
            window.addEventListener('popstate', () => {
                setTimeout(() => {
                    this.handleURLChange();
                }, 50); // Уменьшили задержку
            });

            // Перехватываем pushState и replaceState для отслеживания программных изменений URL
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                setTimeout(() => {
                    this.handleURLChange();
                }, 50); // Уменьшили задержку
            };

            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                setTimeout(() => {
                    this.handleURLChange();
                }, 50); // Уменьшили задержку
            };
        }

        /**
         * Обработка изменения URL
         */
        handleURLChange() {
            if (!this.isInitialized) return;

            const url = new URL(window.location);
            const hasFilterParam = url.searchParams.has(this.urlParam);
            const hasFolderParam = url.searchParams.has(this.folderUrlParam);

            // Если мы на странице /details без параметров фильтра, сбрасываем фильтры
            if (window.location.pathname === '/details' && !hasFilterParam && !hasFolderParam) {
                if (this.bankSelect && this.bankSelect.value !== '') {
                    console.log('Сброс банковского фильтра: переход на /details без параметра фильтра');
                    this.bankSelect.value = '';
                }
                if (this.folderSelect && this.folderSelect.value !== '') {
                    console.log('Сброс фильтра папок: переход на /details без параметра фильтра');
                    this.folderSelect.value = '';
                }
                this.clearSelection();
                this.applyFilter();
            } else {
                // В остальных случаях восстанавливаем состояние из URL
                this.restoreFilterFromURL();
                this.restoreFolderFromURL();
                this.clearSelection();
                this.applyFilter();
            }
        }


        /**
         * Инициализация фильтра
         */
        init() {

            // Ждем загрузки страницы и появления кнопки
            this.waitForElement('button', (button) => {
                return button.textContent.includes('Добавить реквизит');
            }).then(button => {
                this.createFilterUI(button);
                this.observeTableChanges();
                this.isInitialized = true;
            });
        }

        /**
         * Ожидание появления элемента на странице
         */
        waitForElement(selector, condition = null, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const checkElement = () => {
                    const elements = document.querySelectorAll(selector);

                    for (let element of elements) {
                        if (!condition || condition(element)) {
                            resolve(element);
                            return;
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                        return;
                    }

                    setTimeout(checkElement, 100);
                };

                checkElement();
            });
        }

        /**
         * Создание UI фильтров
         */
        createFilterUI(addButton) {
            // Создаем контейнер для управления папками (справа от кнопки "Добавить реквизит")
            this.createFolderUI(addButton);

            // Создаем контейнер для массовых действий
            this.createMassActionsUI(addButton);

            // Создаем контейнер для банковского фильтра (в самом правом углу)
            this.createBankFilterUI(addButton);

            // Восстанавливаем состояние фильтров
            this.restoreFilterFromURL();
            this.restoreFolderFromURL();
        }

        /**
         * Создание UI для управления папками (справа от кнопки "Добавить реквизит")
         */
        createFolderUI(addButton) {
            this.folderContainer = document.createElement('div');
            this.folderContainer.setAttribute('data-filter-type', 'bank-filter-folder');
            this.folderContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 10px;
                margin-left: 15px;
                vertical-align: middle;
            `;

            // Label для папки
            const folderLabel = document.createElement('label');
            folderLabel.textContent = 'Папка:';
            folderLabel.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #333;
            `;

            // Select для папок
            this.folderSelect = document.createElement('select');
            this.folderSelect.style.cssText = `
                padding: 6px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                font-size: 14px;
                min-width: 150px;
                cursor: pointer;
            `;

            this.updateFolderOptions();

            // Обработчик изменения папки
            this.folderSelect.addEventListener('change', () => {
                this.updateFolderURL();
                this.clearSelection();
                this.applyFilter();
            });

            // Кнопка добавления папки
            const addFolderBtn = document.createElement('button');
            addFolderBtn.textContent = '+';
            addFolderBtn.title = 'Создать папку';
            addFolderBtn.style.cssText = `
                width: 28px;
                height: 28px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: #f8f9fa;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                line-height: 1;
                padding: 0;
                transition: all 0.2s;
                color: #28a745;
            `;
            addFolderBtn.addEventListener('mouseenter', () => {
                addFolderBtn.style.background = '#e8f5e8';
                addFolderBtn.style.borderColor = '#28a745';
            });
            addFolderBtn.addEventListener('mouseleave', () => {
                addFolderBtn.style.background = '#f8f9fa';
                addFolderBtn.style.borderColor = '#ddd';
            });
            addFolderBtn.addEventListener('click', () => this.showAddFolderModal());

            // Кнопка удаления папки
            const deleteFolderBtn = document.createElement('button');
            deleteFolderBtn.textContent = '−';
            deleteFolderBtn.title = 'Удалить папку';
            deleteFolderBtn.style.cssText = `
                width: 28px;
                height: 28px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: #f8f9fa;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                line-height: 1;
                padding: 0;
                transition: all 0.2s;
                color: #dc3545;
            `;
            deleteFolderBtn.addEventListener('mouseenter', () => {
                deleteFolderBtn.style.background = '#fdf2f2';
                deleteFolderBtn.style.borderColor = '#dc3545';
            });
            deleteFolderBtn.addEventListener('mouseleave', () => {
                deleteFolderBtn.style.background = '#f8f9fa';
                deleteFolderBtn.style.borderColor = '#ddd';
            });
            deleteFolderBtn.addEventListener('click', () => this.showDeleteFolderModal());

            this.folderContainer.appendChild(folderLabel);
            this.folderContainer.appendChild(this.folderSelect);
            this.folderContainer.appendChild(addFolderBtn);
            this.folderContainer.appendChild(deleteFolderBtn);

            // Вставляем после кнопки "Добавить реквизит"
            const parentDiv = addButton.parentElement;
            addButton.parentNode.insertBefore(this.folderContainer, addButton.nextSibling);
        }

        /**
         * Создание UI для массовых действий
         */
        createMassActionsUI(addButton) {
            this.massActionsContainer = document.createElement('div');
            this.massActionsContainer.setAttribute('data-filter-type', 'bank-filter-mass-actions');
            this.massActionsContainer.style.cssText = `
                display: none;
                align-items: center;
                gap: 10px;
                margin-left: 15px;
                padding: 8px 12px;
                background: #e3f2fd;
                border: 1px solid #1976d2;
                border-radius: 4px;
                vertical-align: middle;
            `;

            // Счетчик выделенных элементов
            const selectedCount = document.createElement('span');
            selectedCount.id = 'selectedCount';
            selectedCount.style.cssText = `
                font-size: 14px;
                color: #1976d2;
                font-weight: 500;
            `;

            // Кнопка "Добавить в папку"
            const addToFolderBtn = document.createElement('button');
            addToFolderBtn.textContent = 'Добавить в папку';
            addToFolderBtn.title = 'Добавить выделенные реквизиты в папку';
            addToFolderBtn.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: #1976d2;
                color: white;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            addToFolderBtn.addEventListener('mouseenter', () => {
                addToFolderBtn.style.background = '#1565c0';
            });
            addToFolderBtn.addEventListener('mouseleave', () => {
                addToFolderBtn.style.background = '#1976d2';
            });
            addToFolderBtn.addEventListener('click', () => this.showMassAddToFolderModal());

            // Кнопка "Выбрать все"
            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = 'Все';
            selectAllBtn.title = 'Выбрать все видимые реквизиты';
            selectAllBtn.style.cssText = `
                padding: 6px 10px;
                border: 1px solid #1976d2;
                border-radius: 3px;
                background: white;
                color: #1976d2;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            selectAllBtn.addEventListener('mouseenter', () => {
                selectAllBtn.style.background = '#f5f5f5';
            });
            selectAllBtn.addEventListener('mouseleave', () => {
                selectAllBtn.style.background = 'white';
            });
            selectAllBtn.addEventListener('click', () => this.selectAllVisible());

            // Кнопка "Отменить выделение"
            const clearSelectionBtn = document.createElement('button');
            clearSelectionBtn.textContent = '✕';
            clearSelectionBtn.title = 'Снять все выделения';
            clearSelectionBtn.style.cssText = `
                width: 24px;
                height: 24px;
                border: 1px solid #1976d2;
                border-radius: 3px;
                background: white;
                color: #1976d2;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            clearSelectionBtn.addEventListener('mouseenter', () => {
                clearSelectionBtn.style.background = '#f5f5f5';
            });
            clearSelectionBtn.addEventListener('mouseleave', () => {
                clearSelectionBtn.style.background = 'white';
            });
            clearSelectionBtn.addEventListener('click', () => this.clearSelection());

            this.massActionsContainer.appendChild(selectedCount);
            this.massActionsContainer.appendChild(selectAllBtn);
            this.massActionsContainer.appendChild(addToFolderBtn);
            this.massActionsContainer.appendChild(clearSelectionBtn);

            // Вставляем в том же родителе после контейнера папок (в одну строку)
            const parentDiv = addButton.parentElement;
            this.folderContainer.parentNode.insertBefore(this.massActionsContainer, this.folderContainer.nextSibling);
        }

        /**
         * Создание UI для банковского фильтра (справа)
         */
        createBankFilterUI(addButton) {
            this.bankFilterContainer = document.createElement('div');
            this.bankFilterContainer.setAttribute('data-filter-type', 'bank-filter-main');
            this.bankFilterContainer.style.cssText = `
                float: right;
                margin-left: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            // Создаем label
            const label = document.createElement('label');
            label.textContent = 'Фильтр по банку:';
            label.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #333;
            `;

            // Создаем select
            this.bankSelect = document.createElement('select');
            this.bankSelect.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                font-size: 14px;
                min-width: 150px;
                cursor: pointer;
            `;

            // Добавляем опцию "Все банки"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все банки';
            this.bankSelect.appendChild(defaultOption);

            // Добавляем статичные опции банков
            this.staticBanks.forEach(bank => {
                const option = document.createElement('option');
                option.value = bank;
                option.textContent = bank;
                this.bankSelect.appendChild(option);
            });

            // Обработчик изменения фильтра
            this.bankSelect.addEventListener('change', () => {
                this.updateURL();
                this.clearSelection();
                this.applyFilter();
            });

            // Собираем элементы
            this.bankFilterContainer.appendChild(label);
            this.bankFilterContainer.appendChild(this.bankSelect);

            // Вставляем в конец родительского контейнера
            const parentDiv = addButton.parentElement;
            parentDiv.appendChild(this.bankFilterContainer);
        }

        /**
         * Создание модального окна
         */
        createModal() {
            // Создаем overlay
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(2px);
            `;

            // Создаем модальное окно
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                min-width: 400px;
                max-width: 500px;
                animation: modalShow 0.2s ease-out;
            `;

            // CSS анимация
            if (!document.getElementById('modalStyles')) {
                const style = document.createElement('style');
                style.id = 'modalStyles';
                style.textContent = `
                    @keyframes modalShow {
                        from {
                            opacity: 0;
                            transform: scale(0.95) translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.modalOverlay.appendChild(modal);
            document.body.appendChild(this.modalOverlay);

            // Закрытие по клику на overlay
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });

            // Закрытие по Escape
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);

            return modal;
        }

        /**
         * Закрытие модального окна
         */
        closeModal() {
            if (this.modalOverlay) {
                document.body.removeChild(this.modalOverlay);
                this.modalOverlay = null;
            }
        }

        /**
         * Показ модального окна добавления папки
         */
        showAddFolderModal() {
            const modal = this.createModal();

            modal.innerHTML = `
                <div style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Создать новую папку</h3>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Название папки:</label>
                        <input type="text" id="folderNameInput" placeholder="Введите название папки"
                               style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s;">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Отмена
                        </button>
                        <button id="saveBtn" style="padding: 10px 20px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Создать
                        </button>
                    </div>
                </div>
            `;

            const input = modal.querySelector('#folderNameInput');
            const saveBtn = modal.querySelector('#saveBtn');
            const cancelBtn = modal.querySelector('#cancelBtn');

            // Фокус на поле ввода
            setTimeout(() => input.focus(), 100);

            // Стили hover для кнопок
            saveBtn.addEventListener('mouseenter', () => saveBtn.style.background = '#218838');
            saveBtn.addEventListener('mouseleave', () => saveBtn.style.background = '#28a745');
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = '#e2e6ea';
                cancelBtn.style.borderColor = '#adb5bd';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = '#f8f9fa';
                cancelBtn.style.borderColor = '#ddd';
            });

            // Стили фокуса для input
            input.addEventListener('focus', () => input.style.borderColor = '#28a745');
            input.addEventListener('blur', () => input.style.borderColor = '#e0e0e0');

            // Обработчики событий
            const handleSave = () => {
                const folderName = input.value.trim();
                if (!folderName) {
                    input.style.borderColor = '#dc3545';
                    input.focus();
                    return;
                }

                const folders = this.getFolders();
                if (folders.includes(folderName)) {
                    alert('Папка с таким названием уже существует!');
                    input.style.borderColor = '#dc3545';
                    input.focus();
                    return;
                }

                folders.push(folderName);
                this.saveFolders(folders);
                this.updateFolderOptions();
                console.log(`Создана папка: ${folderName}`);
                this.closeModal();
            };

            saveBtn.addEventListener('click', handleSave);
            cancelBtn.addEventListener('click', () => this.closeModal());

            // Сохранение по Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                }
            });
        }

        /**
         * Показ модального окна удаления папки
         */
        showDeleteFolderModal() {
            const folders = this.getFolders();
            if (folders.length === 0) {
                alert('Нет папок для удаления');
                return;
            }

            const modal = this.createModal();

            const options = folders.map(folder =>
                `<option value="${folder}">${folder}</option>`
            ).join('');

            modal.innerHTML = `
                <div style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Удалить папку</h3>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Выберите папку для удаления:</label>
                        <select id="folderSelect" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: white; cursor: pointer;">
                            <option value="">Выберите папку</option>
                            ${options}
                        </select>
                    </div>
                    <div style="padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 20px;">
                        <small style="color: #856404;">⚠️ Все реквизиты из этой папки будут перемещены в "Без папки"</small>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Отмена
                        </button>
                        <button id="deleteBtn" style="padding: 10px 20px; border: none; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;" disabled>
                            Удалить
                        </button>
                    </div>
                </div>
            `;

            const select = modal.querySelector('#folderSelect');
            const deleteBtn = modal.querySelector('#deleteBtn');
            const cancelBtn = modal.querySelector('#cancelBtn');

            // Включаем кнопку удаления при выборе папки
            select.addEventListener('change', () => {
                deleteBtn.disabled = !select.value;
                deleteBtn.style.opacity = select.value ? '1' : '0.6';
            });

            // Стили hover для кнопок
            deleteBtn.addEventListener('mouseenter', () => {
                if (!deleteBtn.disabled) deleteBtn.style.background = '#c82333';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                if (!deleteBtn.disabled) deleteBtn.style.background = '#dc3545';
            });
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = '#e2e6ea';
                cancelBtn.style.borderColor = '#adb5bd';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = '#f8f9fa';
                cancelBtn.style.borderColor = '#ddd';
            });

            // Обработчики событий
            deleteBtn.addEventListener('click', () => {
                const folderToDelete = select.value;
                if (!folderToDelete) return;

                const folders = this.getFolders();
                const folderIndex = folders.indexOf(folderToDelete);

                // Сохраняем текущее выбранное значение до обновления списка
                const currentSelectedFolder = this.folderSelect.value;

                if (folderIndex !== -1) {
                    folders.splice(folderIndex, 1);
                    this.saveFolders(folders);

                    // Удаляем привязки к удаленной папке
                    const itemFolders = this.getItemFolders();
                    Object.keys(itemFolders).forEach(requisite => {
                        if (itemFolders[requisite] === folderToDelete) {
                            delete itemFolders[requisite];
                        }
                    });
                    this.saveItemFolders(itemFolders);

                    this.updateFolderOptions();

                    // Если была выбрана удаленная папка, сбрасываем на "Все папки"
                    if (currentSelectedFolder === folderToDelete) {
                        this.folderSelect.value = '';
                        this.folderSelect.selectedIndex = 0; // Принудительно выбираем первую опцию ("Все папки")
                        this.updateFolderURL();
                        this.applyFilter();
                    }
                    console.log(`Удалена папка: ${folderToDelete}`);
                }

                this.closeModal();
            });

            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        /**
         * Показ модального окна массового добавления в папку
         */
        showMassAddToFolderModal() {
            const folders = this.getFolders();
            if (folders.length === 0) {
                alert('Сначала создайте папки');
                return;
            }

            if (this.selectedItems.size === 0) {
                alert('Выберите реквизиты для добавления в папку');
                return;
            }

            const modal = this.createModal();

            const options = folders.map(folder =>
                `<option value="${folder}">${folder}</option>`
            ).join('');

            modal.innerHTML = `
                <div style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Добавить реквизиты в папку</h3>
                    <div style="margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                        <small style="color: #666;">Выбрано реквизитов: <strong>${this.selectedItems.size}</strong></small>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Выберите папку:</label>
                        <select id="folderSelect" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: white; cursor: pointer;">
                            <option value="">Без папки</option>
                            ${options}
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Отмена
                        </button>
                        <button id="saveBtn" style="padding: 10px 20px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Добавить
                        </button>
                    </div>
                </div>
            `;

            const select = modal.querySelector('#folderSelect');
            const saveBtn = modal.querySelector('#saveBtn');
            const cancelBtn = modal.querySelector('#cancelBtn');

            // Стили hover для кнопок
            saveBtn.addEventListener('mouseenter', () => saveBtn.style.background = '#218838');
            saveBtn.addEventListener('mouseleave', () => saveBtn.style.background = '#28a745');
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = '#e2e6ea';
                cancelBtn.style.borderColor = '#adb5bd';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = '#f8f9fa';
                cancelBtn.style.borderColor = '#ddd';
            });

            // Обработчики событий
            saveBtn.addEventListener('click', () => {
                const selectedFolder = select.value;
                const itemFolders = this.getItemFolders();
                let processedCount = 0;

                this.selectedItems.forEach(requisite => {
                    if (selectedFolder) {
                        itemFolders[requisite] = selectedFolder;
                    } else {
                        delete itemFolders[requisite];
                    }
                    processedCount++;
                });

                this.saveItemFolders(itemFolders);
                console.log(`Обработано ${processedCount} реквизитов${selectedFolder ? ' в папку "' + selectedFolder + '"' : ', удалены из папок'}`);

                this.clearSelection();
                this.closeModal();

                // Обновляем фильтрацию если активен фильтр папок
                if (this.folderSelect && this.folderSelect.value) {
                    this.applyFilter();
                }
            });

            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        /**
         * Наблюдение за изменениями в таблице (AJAX загрузка, пагинация)
         */
        observeTableChanges() {
            const observer = new MutationObserver((mutations) => {
                let shouldUpdateOptions = false;
                let isUserInteraction = false;

                mutations.forEach(mutation => {
                    // Проверяем, не является ли это изменением чекбокса или кнопки папки
                    if (mutation.target.classList &&
                        (mutation.target.classList.contains('folder-checkbox') ||
                         mutation.target.classList.contains('folder-action-btn'))) {
                        isUserInteraction = true;
                        return;
                    }

                    // Проверяем изменения в tbody (новые данные)
                    if (mutation.target.tagName === 'TBODY' ||
                        mutation.target.closest('tbody') ||
                        (mutation.addedNodes.length > 0 && !mutation.addedNodes[0].classList?.contains('folder-checkbox'))) {
                        shouldUpdateOptions = true;
                    }
                });

                // Не применяем фильтр если это взаимодействие пользователя
                if (shouldUpdateOptions && this.isInitialized && !isUserInteraction) {
                    console.log('MutationObserver: обновление таблицы, применяем фильтры');
                    // Более быстрое применение фильтров без задержки для предотвращения мерцания
                    this.restoreFilterFromURL();
                    this.restoreFolderFromURL();
                    this.applyFilterImmediately(); // Применяем фильтр мгновенно
                    setTimeout(() => {
                        this.addFolderButtonsToRows(); // Добавляем кнопки с небольшой задержкой
                        this.addCheckboxesToRows(); // Добавляем чекбоксы
                    }, 50);
                } else if (isUserInteraction) {
                    console.log('MutationObserver: пользовательское взаимодействие, пропускаем обновление фильтра');
                }
            });

            // Наблюдаем за изменениями в контейнере таблицы
            const tableContainer = document.querySelector('.MuiTableContainer-root');
            if (tableContainer) {
                observer.observe(tableContainer, {
                    childList: true,
                    subtree: true
                });
            }

            // Добавляем кнопки при первой загрузке
            setTimeout(() => {
                this.addFolderButtonsToRows();
                this.addCheckboxesToRows();
            }, 500);
        }

        /**
         * Мгновенное применение фильтра для предотвращения мерцания
         */
        applyFilterImmediately() {
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';
            const rows = this.getTableRows();

            rows.forEach(row => {
                const bank = this.getBankFromRow(row);
                const itemId = this.getItemIdFromRow(row);

                // Проверка по банку
                const bankMatch = !selectedBank || bank === selectedBank;

                // Проверка по папке
                const folderMatch = !selectedFolder || this.isItemInFolder(itemId, selectedFolder);

                const shouldShow = bankMatch && folderMatch;

                // Скрываем/показываем строку немедленно
                row.style.display = shouldShow ? '' : 'none';

                // Также скрываем/показываем связанную detail панель, если она есть
                const nextRow = row.nextElementSibling;
                if (nextRow && nextRow.querySelector('.Mui-TableBodyCell-DetailPanel')) {
                    nextRow.style.display = shouldShow ? '' : 'none';
                }
            });
        }

        /**
         * Добавление чекбоксов для множественного выделения
         */
        addCheckboxesToRows() {
            const rows = this.getTableRows();

            rows.forEach(row => {
                // Проверяем, есть ли уже чекбокс
                if (row.querySelector('.folder-checkbox')) return;

                // Ищем первую ячейку (data-index="0")
                const firstCell = row.querySelector('td[data-index="0"]');
                if (!firstCell) return;

                // Создаем чекбокс
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'folder-checkbox';
                checkbox.style.cssText = `
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    cursor: pointer;
                `;

                const requisite = this.getRequisiteFromRow(row);
                checkbox.checked = this.selectedItems.has(requisite);

                // Обработчик изменения состояния
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        this.selectedItems.add(requisite);
                    } else {
                        this.selectedItems.delete(requisite);
                    }
                    this.updateMassActionsUI();
                });

                // Добавляем чекбокс в начало ячейки
                firstCell.insertBefore(checkbox, firstCell.firstChild);
            });
        }

        /**
         * Добавление кнопок "Добавить в папку" к каждой строке таблицы
         */
        addFolderButtonsToRows() {
            const rows = this.getTableRows();

            rows.forEach(row => {
                // Проверяем, есть ли уже кнопка
                if (row.querySelector('.folder-action-btn')) return;

                // Ищем первую ячейку (data-index="0")
                const firstCell = row.querySelector('td[data-index="0"]');
                if (!firstCell) return;

                // Создаем кнопку
                const folderBtn = document.createElement('button');
                folderBtn.textContent = '📁';
                folderBtn.title = 'Добавить в папку';
                folderBtn.className = 'folder-action-btn';
                folderBtn.style.cssText = `
                    width: 20px;
                    height: 20px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    background: #f8f9fa;
                    cursor: pointer;
                    font-size: 10px;
                    margin-left: 4px;
                    transition: all 0.2s;
                `;

                // Hover эффект
                folderBtn.addEventListener('mouseenter', () => {
                    folderBtn.style.background = '#e9ecef';
                    folderBtn.style.borderColor = '#adb5bd';
                });
                folderBtn.addEventListener('mouseleave', () => {
                    folderBtn.style.background = '#f8f9fa';
                    folderBtn.style.borderColor = '#ddd';
                });

                // Обработчик клика
                folderBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showAddToFolderModal(row);
                });

                // Добавляем кнопку в ячейку
                firstCell.appendChild(folderBtn);
            });
        }

        /**
         * Показ модального окна для добавления реквизита в папку
         */
        showAddToFolderModal(row) {
            const folders = this.getFolders();
            if (folders.length === 0) {
                alert('Сначала создайте папки');
                return;
            }

            const requisite = this.getRequisiteFromRow(row);
            const bankName = this.getBankFromRow(row);
            const currentFolder = this.getItemFolders()[requisite] || '';

            const modal = this.createModal();

            const options = folders.map(folder =>
                `<option value="${folder}" ${folder === currentFolder ? 'selected' : ''}>${folder}</option>`
            ).join('');

            modal.innerHTML = `
                <div style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">Добавить реквизит в папку</h3>
                    <div style="margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                        <small style="color: #666;">Реквизит: <strong>${bankName}</strong></small>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">Выберите папку:</label>
                        <select id="folderSelect" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: white; cursor: pointer;">
                            <option value="">Без папки</option>
                            ${options}
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Отмена
                        </button>
                        <button id="saveBtn" style="padding: 10px 20px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                            Сохранить
                        </button>
                    </div>
                </div>
            `;

            const select = modal.querySelector('#folderSelect');
            const saveBtn = modal.querySelector('#saveBtn');
            const cancelBtn = modal.querySelector('#cancelBtn');

            // Устанавливаем текущее значение
            select.value = currentFolder;

            // Стили hover для кнопок
            saveBtn.addEventListener('mouseenter', () => saveBtn.style.background = '#218838');
            saveBtn.addEventListener('mouseleave', () => saveBtn.style.background = '#28a745');
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = '#e2e6ea';
                cancelBtn.style.borderColor = '#adb5bd';
            });
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = '#f8f9fa';
                cancelBtn.style.borderColor = '#ddd';
            });

            // Обработчики событий
            saveBtn.addEventListener('click', () => {
                const selectedFolder = select.value;
                const itemFolders = this.getItemFolders();

                if (selectedFolder) {
                    itemFolders[requisite] = selectedFolder;
                } else {
                    delete itemFolders[requisite];
                }

                this.saveItemFolders(itemFolders);
                console.log(`Реквизит ${requisite} (${bankName}) ${selectedFolder ? 'добавлен в папку "' + selectedFolder + '"' : 'удален из папки'}`);
                this.closeModal();

                // Обновляем фильтрацию если активен фильтр папок
                if (this.folderSelect && this.folderSelect.value) {
                    this.applyFilter();
                }
            });

            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        /**
         * Выбор всех видимых реквизитов
         */
        selectAllVisible() {
            const rows = this.getTableRows();
            const visibleRows = rows.filter(row => row.style.display !== 'none');

            console.log(`Выбираем все видимые реквизиты: ${visibleRows.length} из ${rows.length}`);

            visibleRows.forEach(row => {
                const requisite = this.getRequisiteFromRow(row);
                if (requisite) {
                    this.selectedItems.add(requisite);

                    // Устанавливаем чекбокс
                    const checkbox = row.querySelector('.folder-checkbox');
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            });

            this.updateMassActionsUI();
        }

        /**
         * Очистка выделения
         */
        clearSelection() {
            console.log(`Снимаем выделение с ${this.selectedItems.size} реквизитов`);
            this.selectedItems.clear();

            // Снимаем все чекбоксы
            const checkboxes = document.querySelectorAll('.folder-checkbox');
            checkboxes.forEach(cb => cb.checked = false);

            this.updateMassActionsUI();
        }

        /**
         * Обновление UI массовых действий
         */
        updateMassActionsUI() {
            const count = this.selectedItems.size;
            const countElement = document.getElementById('selectedCount');

            console.log(`Обновление массовых действий: выбрано ${count} реквизитов`);
            console.log('Выбранные реквизиты:', Array.from(this.selectedItems));

            if (count > 0) {
                this.massActionsContainer.style.display = 'inline-flex';
                if (countElement) {
                    // Показываем количество выбранных из общего количества видимых
                    const visibleRows = this.getTableRows().filter(row => row.style.display !== 'none');
                    countElement.textContent = `Выбрано: ${count} из ${visibleRows.length}`;
                }
            } else {
                this.massActionsContainer.style.display = 'none';
            }
        }

        /**
         * Получение всех строк таблицы
         */
        getTableRows() {
            const tbody = document.querySelector('tbody.MuiTableBody-root');
            if (!tbody) return [];

            // Фильтруем только основные строки (не detail панели)
            return Array.from(tbody.querySelectorAll('tr')).filter(row => {
                return !row.querySelector('.Mui-TableBodyCell-DetailPanel');
            });
        }

        /**
         * Извлечение названия банка из строки
         */
        getBankFromRow(row) {
            // Ищем ячейку с банком (data-index="2" согласно HTML)
            const bankCell = row.querySelector('td[data-index="2"]');
            return bankCell ? bankCell.textContent.trim() : '';
        }

        /**
         * Извлечение реквизита (телефон или карта) из текста
         */
        extractRequisiteFromText(text) {
            if (!text) return null;

            // Регулярные выражения для различных форматов реквизитов
            const patterns = [
                // Номер телефона: +7 923 718 16 26
                /\+7\s+\d{3}\s+\d{3}\s+\d{2}\s+\d{2}/,
                // Номер телефона без пробелов: +79237181626
                /\+7\d{10}/,
                // Номер карты маскированный: 2200...6791, 2201...2345
                /\d{4}\.{3}\d{4}/,
                // Номер карты полный (если встретится): 1234 5678 9012 3456
                /\d{4}\s+\d{4}\s+\d{4}\s+\d{4}/,
                // Номер карты без пробелов: 1234567890123456
                /\d{16}/
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    return match[0]; // Возвращаем найденный реквизит как есть
                }
            }

            return null;
        }

        /**
         * Получение реквизита из строки таблицы на странице /details
         */
        getRequisiteFromRow(row) {
            // На странице /details реквизит находится в ячейке data-index="4"
            const requisiteCell = row.querySelector('td[data-index="4"]');
            if (!requisiteCell) {
                console.warn('Не найдена ячейка с data-index="4" для реквизита');
                return null;
            }

            const text = requisiteCell.textContent.trim();
            const requisite = this.extractRequisiteFromText(text);
            const result = requisite || text || `fallback_${Date.now()}_${Math.random()}`;

            console.log(`Извлечен реквизит: "${result}" из текста: "${text}"`);
            return result;
        }

        /**
         * Получение ID реквизита из строки таблицы (используется в массовых операциях)
         */
        getItemIdFromRow(row) {
            return this.getRequisiteFromRow(row);
        }

        /**
         * Проверка, находится ли реквизит в папке
         */
        isItemInFolder(requisite, folderName) {
            const itemFolders = this.getItemFolders();
            return itemFolders[requisite] === folderName;
        }

        /**
         * Применение фильтров
         */
        applyFilter() {
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';
            const rows = this.getTableRows();

            console.log(`Применяем фильтр: банк="${selectedBank}", папка="${selectedFolder}", строк=${rows.length}`);

            rows.forEach(row => {
                const bank = this.getBankFromRow(row);
                const requisite = this.getRequisiteFromRow(row);

                // Проверка по банку
                const bankMatch = !selectedBank || bank === selectedBank;

                // Проверка по папке
                const folderMatch = !selectedFolder || this.isItemInFolder(requisite, selectedFolder);

                const shouldShow = bankMatch && folderMatch;

                // Скрываем/показываем строку
                row.style.display = shouldShow ? '' : 'none';

                // Также скрываем/показываем связанную detail панель, если она есть
                const nextRow = row.nextElementSibling;
                if (nextRow && nextRow.querySelector('.Mui-TableBodyCell-DetailPanel')) {
                    nextRow.style.display = shouldShow ? '' : 'none';
                }

                // Отладочная информация
                if (!shouldShow && selectedFolder) {
                    console.log(`Скрыта строка: банк="${bank}", реквизит="${requisite}", в папке=${this.isItemInFolder(requisite, selectedFolder)}`);
                }
            });

            this.updateFilterStats();
        }

        /**
         * Обновление статистики фильтра
         */
        updateFilterStats() {
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';
            const allRows = this.getTableRows();
            const visibleRows = allRows.filter(row => row.style.display !== 'none');

            if (selectedBank || selectedFolder) {
                const filters = [];
                if (selectedBank) filters.push(`банк "${selectedBank}"`);
                if (selectedFolder) filters.push(`папка "${selectedFolder}"`);
                console.log(`Фильтр по ${filters.join(' и ')}: показано ${visibleRows.length} из ${allRows.length} записей`);
            }
        }

        /**
         * Обновление URL с параметром банковского фильтра
         */
        updateURL() {
            const url = new URL(window.location);
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';

            if (selectedBank) {
                url.searchParams.set(this.urlParam, selectedBank);
            } else {
                url.searchParams.delete(this.urlParam);
            }

            // Обновляем URL без перезагрузки страницы
            window.history.pushState({}, '', url.toString());
        }

        /**
         * Обновление URL с параметром фильтра папок
         */
        updateFolderURL() {
            const url = new URL(window.location);
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';

            if (selectedFolder) {
                url.searchParams.set(this.folderUrlParam, selectedFolder);
            } else {
                url.searchParams.delete(this.folderUrlParam);
            }

            // Обновляем URL без перезагрузки страницы
            window.history.pushState({}, '', url.toString());
        }

        /**
         * Восстановление состояния фильтра из URL
         */
        restoreFilterFromURL() {
            if (!this.bankSelect) return;

            try {
                const url = new URL(window.location);
                const bankFromURL = url.searchParams.get(this.urlParam);

                if (bankFromURL) {
                    // Проверяем, что банк из URL есть в статичном списке
                    if (this.staticBanks.includes(bankFromURL)) {
                        this.bankSelect.value = bankFromURL;
                        console.log(`Восстановлен фильтр по банку из URL: ${bankFromURL}`);
                    } else {
                        // Если банк из URL недоступен, сбрасываем фильтр
                        this.bankSelect.value = '';
                        console.warn(`Банк "${bankFromURL}" из URL не найден в списке доступных банков`);
                    }
                } else {
                    // Если параметра нет в URL, сбрасываем фильтр
                    this.bankSelect.value = '';
                }
            } catch (e) {
                console.warn('Не удалось восстановить состояние банковского фильтра из URL:', e);
                this.bankSelect.value = '';
            }
        }

        /**
         * Восстановление состояния фильтра папок из URL
         */
        restoreFolderFromURL() {
            if (!this.folderSelect) return;

            try {
                const url = new URL(window.location);
                const folderFromURL = url.searchParams.get(this.folderUrlParam);

                if (folderFromURL) {
                    const folders = this.getFolders();
                    if (folders.includes(folderFromURL)) {
                        this.folderSelect.value = folderFromURL;
                        console.log(`Восстановлен фильтр по папке из URL: ${folderFromURL}`);
                    } else {
                        this.folderSelect.value = '';
                        console.warn(`Папка "${folderFromURL}" из URL не найдена`);
                    }
                } else {
                    this.folderSelect.value = '';
                }
            } catch (e) {
                console.warn('Не удалось восстановить состояние фильтра папок из URL:', e);
                this.folderSelect.value = '';
            }
        }

        /**
         * Получение списка папок из localStorage
         */
        getFolders() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            } catch (e) {
                console.warn('Ошибка при чтении папок из localStorage:', e);
                return [];
            }
        }

        /**
         * Сохранение списка папок в localStorage
         */
        saveFolders(folders) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(folders));
            } catch (e) {
                console.error('Ошибка при сохранении папок в localStorage:', e);
            }
        }

        /**
         * Получение привязки реквизитов к папкам
         */
        getItemFolders() {
            try {
                return JSON.parse(localStorage.getItem(this.itemFolderKey) || '{}');
            } catch (e) {
                console.warn('Ошибка при чтении привязки реквизитов к папкам:', e);
                return {};
            }
        }

        /**
         * Сохранение привязки реквизитов к папкам
         */
        saveItemFolders(itemFolders) {
            try {
                localStorage.setItem(this.itemFolderKey, JSON.stringify(itemFolders));
            } catch (e) {
                console.error('Ошибка при сохранении привязки реквизитов к папкам:', e);
            }
        }

        /**
         * Обновление опций в select папок
         */
        updateFolderOptions() {
            if (!this.folderSelect) return;

            const currentValue = this.folderSelect.value;
            this.folderSelect.innerHTML = '';

            // Добавляем опцию "Все папки"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все папки';
            this.folderSelect.appendChild(defaultOption);

            // Добавляем папки
            const folders = this.getFolders();
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.textContent = folder;
                this.folderSelect.appendChild(option);
            });

            // Восстанавливаем выбранное значение
            this.folderSelect.value = currentValue;
        }
    }

    /**
     * Класс для фильтрации по папкам на странице /replenishment
     */
    class ReplenishmentFilter {
        constructor() {
            this.folderSelect = null;
            this.bankSelect = null;
            this.isInitialized = false;
            this.folderUrlParam = 'folderFilter';
            this.bankUrlParam = 'bankFilter';
            this.storageKey = 'bankFilterFolders';
            this.itemFolderKey = 'bankFilterItemFolders';

            // Используем тот же список банков, что и в BankFilter
            this.staticBanks = [
                'Yandex-pay',
                'Ozon',
                'Ak-bars-bank',
                'Mts-bank',
                'T-bank',
                'Raiffeissen',
                'Otp-bank',
                'Alfabank',
                'Sber'
            ];

            // Сохраняем ссылку на экземпляр для перехвата запросов
            window.replenishmentFilterInstance = this;

            this.setupURLChangeListener();
            this.init();
        }

        /**
         * Настройка отслеживания изменений URL
         */
        setupURLChangeListener() {
            window.addEventListener('popstate', () => {
                setTimeout(() => {
                    this.handleURLChange();
                }, 50);
            });

            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                setTimeout(() => {
                    this.handleURLChange();
                }, 50);
            };

            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                setTimeout(() => {
                    this.handleURLChange();
                }, 50);
            };
        }

        /**
         * Обработка изменения URL
         */
        handleURLChange() {
            if (!this.isInitialized) return;

            const url = new URL(window.location);
            const hasFolderParam = url.searchParams.has(this.folderUrlParam);
            const hasBankParam = url.searchParams.has(this.bankUrlParam);

            if (window.location.pathname === '/replenishment' && !hasFolderParam && !hasBankParam) {
                if (this.folderSelect && this.folderSelect.value !== '') {
                    console.log('Сброс фильтра папок: переход на /replenishment без параметра фильтра');
                    this.folderSelect.value = '';
                }
                if (this.bankSelect && this.bankSelect.value !== '') {
                    console.log('Сброс банк-фильтра: переход на /replenishment без параметра фильтра');
                    this.bankSelect.value = '';
                }
                this.applyFilter();
            } else {
                this.restoreFolderFromURL();
                this.restoreBankFromURL();
                this.applyFilter();
            }
        }

        /**
         * Инициализация фильтра
         */
        init() {
            // Ищем .MuiPaper-root для размещения фильтра перед ним
            this.waitForElement('.MuiPaper-root', null, 10000).then(paperElement => {
                this.createFilterUIBeforePaper(paperElement);
                this.observeTableChanges();
                this.isInitialized = true;
                console.log('ReplenishmentFilter инициализирован перед .MuiPaper-root');
            });
        }


        /**
         * Ожидание появления элемента на странице
         */
        waitForElement(selector, condition = null, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const checkElement = () => {
                    const elements = document.querySelectorAll(selector);

                    for (let element of elements) {
                        if (!condition || condition(element)) {
                            resolve(element);
                            return;
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                        return;
                    }

                    setTimeout(checkElement, 100);
                };

                checkElement();
            });
        }

        /**
         * Создание UI фильтра перед .MuiPaper-root
         */
        createFilterUIBeforePaper(paperElement) {
            // Создаем контейнер для фильтра
            const container = document.createElement('div');
            container.setAttribute('data-filter-type', 'replenishment-filter');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: flex-end;
                width: 100%;
                margin-bottom: -15px;
                margin-top: -15px;
                padding-right: 60px;
            `;

            const folderLabel = document.createElement('label');
            folderLabel.textContent = 'Папка:';
            folderLabel.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #666;
                white-space: nowrap;
            `;

            this.createFolderSelect();

            const bankLabel = document.createElement('label');
            bankLabel.textContent = 'Банк:';
            bankLabel.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #666;
                white-space: nowrap;
                margin-left: 16px;
            `;

            this.createBankSelect();

            container.appendChild(folderLabel);
            container.appendChild(this.folderSelect);
            container.appendChild(bankLabel);
            container.appendChild(this.bankSelect);

            // Вставляем перед .MuiPaper-root
            paperElement.parentNode.insertBefore(container, paperElement);

            this.restoreFolderFromURL();
            this.restoreBankFromURL();
        }


        /**
         * Создание select для выбора папки
         */
        createFolderSelect() {
            this.folderSelect = document.createElement('select');
            this.folderSelect.style.cssText = `
                padding: 6px 10px;
                border: 2px solid #e0e0e0;
                border-radius: 4px;
                background: white;
                font-size: 14px;
                min-width: 150px;
                cursor: pointer;
                outline: none;
                transition: border-color 0.2s;
            `;

            // Добавляем стили фокуса
            this.folderSelect.addEventListener('focus', () => {
                this.folderSelect.style.borderColor = '#1976d2';
            });

            this.folderSelect.addEventListener('blur', () => {
                this.folderSelect.style.borderColor = '#e0e0e0';
            });

            this.updateFolderOptions();

            this.folderSelect.addEventListener('change', () => {
                this.updateFolderURL();
                this.applyFilter();
            });
        }

        /**
         * Создание select для выбора банка
         */
        createBankSelect() {
            this.bankSelect = document.createElement('select');
            this.bankSelect.style.cssText = `
                padding: 6px 10px;
                border: 2px solid #e0e0e0;
                border-radius: 4px;
                background: white;
                font-size: 14px;
                min-width: 150px;
                cursor: pointer;
                outline: none;
                transition: border-color 0.2s;
            `;

            // Добавляем стили фокуса
            this.bankSelect.addEventListener('focus', () => {
                this.bankSelect.style.borderColor = '#1976d2';
            });
            this.bankSelect.addEventListener('blur', () => {
                this.bankSelect.style.borderColor = '#e0e0e0';
            });

            this.updateBankOptions();

            this.bankSelect.addEventListener('change', () => {
                this.updateBankURL();
                this.applyFilter();
            });
        }

        /**
         * Извлечение реквизита из текста (используем ту же логику что и в BankFilter)
         */
        extractRequisiteFromText(text) {
            if (!text) return null;

            // Регулярные выражения для различных форматов реквизитов
            const patterns = [
                // Номер телефона: +7 923 718 16 26
                /\+7\s+\d{3}\s+\d{3}\s+\d{2}\s+\d{2}/,
                // Номер телефона без пробелов: +79237181626
                /\+7\d{10}/,
                // Номер карты маскированный: 2200...6791, 2201...2345
                /\d{4}\.{3}\d{4}/,
                // Номер карты полный (если встретится): 1234 5678 9012 3456
                /\d{4}\s+\d{4}\s+\d{4}\s+\d{4}/,
                // Номер карты без пробелов: 1234567890123456
                /\d{16}/
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    return match[0]; // Возвращаем найденный реквизит как есть
                }
            }

            return null;
        }

        /**
         * Получение реквизита из строки таблицы на странице /replenishment
         */
        getRequisiteFromReplenishmentRow(row) {
            // На странице /replenishment реквизит находится в ячейке data-index="5"
            const requisiteCell = row.querySelector('td[data-index="5"]');
            if (!requisiteCell) return null;

            const text = requisiteCell.textContent.trim();
            const requisite = this.extractRequisiteFromText(text);

            // Если не нашли реквизит через regex, используем весь текст как fallback
            return requisite || text || `fallback_replenishment_${Date.now()}_${Math.random()}`;
        }

        /**
         * Наблюдение за изменениями в таблице
         */
        observeTableChanges() {
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;

                mutations.forEach(mutation => {
                    if (mutation.target.tagName === 'TBODY' ||
                        mutation.target.closest('tbody') ||
                        mutation.target.closest('.MuiTableContainer-root') ||
                        mutation.addedNodes.length > 0) {
                        shouldUpdate = true;
                    }
                });

                if (shouldUpdate && this.isInitialized) {
                    this.restoreFolderFromURL();
                    this.applyFilter(); // Применяем фильтр мгновенно без задержки
                }
            });

            // Наблюдаем за изменениями в контейнере таблицы
            const tableContainer = document.querySelector('.MuiTableContainer-root');
            if (tableContainer) {
                observer.observe(tableContainer, {
                    childList: true,
                    subtree: true
                });
            }

            // Наблюдаем за изменениями во всем body как резервный вариант
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * Применение фильтра по папкам
         */
        applyFilter() {
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';
            const rows = this.getTableRows();

            if (!rows.length) {
                console.log('Таблица не найдена на странице /replenishment');
                return;
            }

            let visibleCount = 0;

            rows.forEach(row => {
                const requisite = this.getRequisiteFromReplenishmentRow(row);
                const bank = this.getBankFromReplenishmentRow(row);
                let shouldShow = true;

                // Проверка по папке
                if (selectedFolder) {
                    shouldShow = shouldShow && this.isRequisiteInFolder(requisite, selectedFolder);
                }

                // Проверка по банку
                if (selectedBank) {
                    shouldShow = shouldShow && bank === selectedBank;
                }

                row.style.display = shouldShow ? '' : 'none';
                if (shouldShow) visibleCount++;

                // Скрываем связанные элементы (detail панели и т.д.)
                const nextRow = row.nextElementSibling;
                if (nextRow && (nextRow.querySelector('.Mui-TableBodyCell-DetailPanel') || nextRow.classList.contains('MuiTableRow-detail'))) {
                    nextRow.style.display = shouldShow ? '' : 'none';
                }
            });

            this.updateFilterStats(selectedFolder, selectedBank, visibleCount, rows.length);
        }

        /**
         * Получение строк таблицы для страницы replenishment
         */
        getTableRows() {
            // Ищем строки в таблице
            const tbody = document.querySelector('tbody.MuiTableBody-root');
            if (!tbody) return [];

            // Фильтруем только основные строки (не detail панели)
            return Array.from(tbody.querySelectorAll('tr')).filter(row => {
                return !row.querySelector('.Mui-TableBodyCell-DetailPanel') &&
                       !row.classList.contains('MuiTableRow-detail') &&
                       row.children.length > 0;
            });
        }

        /**
         * Проверка, находится ли реквизит в папке
         */
        isRequisiteInFolder(requisite, folderName) {
            const itemFolders = this.getItemFolders();
            return itemFolders[requisite] === folderName;
        }

        /**
         * Обновление статистики фильтра
         */
        updateFilterStats(selectedFolder, selectedBank, visibleCount, totalCount) {
            const filters = [];
            if (selectedFolder) filters.push(`папка="${selectedFolder}"`);
            if (selectedBank) filters.push(`банк="${selectedBank}"`);

            if (filters.length > 0) {
                console.log(`Фильтр по ${filters.join(', ')}: показано ${visibleCount} из ${totalCount} записей на /replenishment`);
            }
        }

        /**
         * Обновление URL с параметром фильтра папок
         */
        updateFolderURL() {
            const url = new URL(window.location);
            const selectedFolder = this.folderSelect ? this.folderSelect.value : '';

            if (selectedFolder) {
                url.searchParams.set(this.folderUrlParam, selectedFolder);
            } else {
                url.searchParams.delete(this.folderUrlParam);
            }

            window.history.pushState({}, '', url.toString());
        }

        /**
         * Обновление URL с параметром банк-фильтра
         */
        updateBankURL() {
            const url = new URL(window.location);
            const selectedBank = this.bankSelect ? this.bankSelect.value : '';
            if (selectedBank) {
                url.searchParams.set(this.bankUrlParam, selectedBank);
            } else {
                url.searchParams.delete(this.bankUrlParam);
            }
            window.history.pushState({}, '', url.toString());
        }

        /**
         * Восстановление состояния фильтра папок из URL
         */
        restoreFolderFromURL() {
            if (!this.folderSelect) return;

            try {
                const url = new URL(window.location);
                const folderFromURL = url.searchParams.get(this.folderUrlParam);

                if (folderFromURL) {
                    const folders = this.getFolders();
                    if (folders.includes(folderFromURL)) {
                        this.folderSelect.value = folderFromURL;
                        console.log(`Восстановлен фильтр по папке из URL: ${folderFromURL}`);
                    } else {
                        this.folderSelect.value = '';
                        console.warn(`Папка "${folderFromURL}" из URL не найдена`);
                    }
                } else {
                    this.folderSelect.value = '';
                }
            } catch (e) {
                console.warn('Не удалось восстановить состояние фильтра папок из URL:', e);
                this.folderSelect.value = '';
            }
        }

        /**
         * Восстановление состояния банк-фильтра из URL
         */
        restoreBankFromURL() {
            if (!this.bankSelect) return;

            try {
                const url = new URL(window.location);
                const bankFromURL = url.searchParams.get(this.bankUrlParam);

                if (bankFromURL) {
                    if (this.staticBanks.includes(bankFromURL)) {
                        this.bankSelect.value = bankFromURL;
                        console.log(`Восстановлен банк-фильтр из URL: ${bankFromURL}`);
                    } else {
                        this.bankSelect.value = '';
                        console.warn(`Банк "${bankFromURL}" из URL не найден в списке поддерживаемых`);
                    }
                } else {
                    this.bankSelect.value = '';
                }
            } catch (e) {
                console.warn('Не удалось восстановить состояние банк-фильтра из URL:', e);
                this.bankSelect.value = '';
            }
        }

        /**
         * Обновление опций в select папок
         */
        updateFolderOptions() {
            if (!this.folderSelect) return;

            const currentValue = this.folderSelect.value;
            this.folderSelect.innerHTML = '';

            // Добавляем опцию "Все папки"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все папки';
            this.folderSelect.appendChild(defaultOption);

            // Добавляем папки
            const folders = this.getFolders();
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.textContent = folder;
                this.folderSelect.appendChild(option);
            });

            // Восстанавливаем выбранное значение
            this.folderSelect.value = currentValue;
        }

        /**
         * Обновление опций в select банков
         */
        updateBankOptions() {
            if (!this.bankSelect) return;

            const currentValue = this.bankSelect.value;
            this.bankSelect.innerHTML = '';

            // Добавляем опцию "Все банки"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все банки';
            this.bankSelect.appendChild(defaultOption);

            // Добавляем банки из статического списка
            this.staticBanks.forEach(bank => {
                const option = document.createElement('option');
                option.value = bank;
                option.textContent = bank;
                this.bankSelect.appendChild(option);
            });

            // Восстанавливаем выбранное значение
            this.bankSelect.value = currentValue;
        }

        /**
         * Получение банка из строки таблицы replenishment
         */
        getBankFromReplenishmentRow(row) {
            // На странице /replenishment банк находится в ячейке data-index="4"
            const bankCell = row.querySelector('td[data-index="4"]');
            return bankCell ? bankCell.textContent.trim() : '';
        }

        /**
         * Получение списка папок из localStorage
         */
        getFolders() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            } catch (e) {
                console.warn('Ошибка при чтении папок из localStorage:', e);
                return [];
            }
        }

        /**
         * Получение привязки реквизитов к папкам
         */
        getItemFolders() {
            try {
                return JSON.parse(localStorage.getItem(this.itemFolderKey) || '{}');
            } catch (e) {
                console.warn('Ошибка при чтении привязки реквизитов к папкам:', e);
                return {};
            }
        }
    }

    // Глобальные переменные для хранения текущих экземпляров фильтров
    let currentBankFilter = null;
    let currentReplenishmentFilter = null;
    let currentPath = '';

    // Очистка предыдущих фильтров
    function cleanupFilters() {
        if (currentBankFilter) {
            console.log('Очистка BankFilter');
            currentBankFilter = null;
        }
        if (currentReplenishmentFilter) {
            console.log('Очистка ReplenishmentFilter');
            currentReplenishmentFilter = null;
        }

        // Удаляем элементы интерфейса предыдущих фильтров
        const existingFilters = document.querySelectorAll('[data-filter-type]');
        existingFilters.forEach(filter => filter.remove());
    }

    // Запускаем соответствующий фильтр в зависимости от страницы
    function initializeFilters() {
        const path = window.location.pathname;

        // Если путь не изменился, не переинициализируем
        if (path === currentPath) {
            return;
        }

        console.log(`Навигация: ${currentPath} -> ${path}`);

        // Очищаем предыдущие фильтры
        cleanupFilters();

        currentPath = path;

        if (path === '/details') {
            console.log('Инициализация BankFilter для страницы /details');
            currentBankFilter = new BankFilter();
        } else if (path === '/replenishment') {
            console.log('Инициализация ReplenishmentFilter для страницы /replenishment');
            currentReplenishmentFilter = new ReplenishmentFilter();
        } else {
            console.log(`Страница ${path} не поддерживается скриптом`);
        }
    }

    // Настройка отслеживания навигации в React SPA
    function setupSPANavigation() {
        // Отслеживаем изменения URL через popstate (кнопки назад/вперед)
        window.addEventListener('popstate', () => {
            setTimeout(initializeFilters, 100);
        });

        // Перехватываем pushState и replaceState для отслеживания программной навигации
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(initializeFilters, 100);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(initializeFilters, 100);
        };

        // Дополнительно отслеживаем изменения через MutationObserver для React Router
        const observer = new MutationObserver((mutations) => {
            let pathChanged = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    pathChanged = true;
                }
            });

            if (pathChanged && window.location.pathname !== currentPath) {
                setTimeout(initializeFilters, 200);
            }
        });

        // Наблюдаем за изменениями в основном контейнере приложения
        const appRoot = document.getElementById('root') || document.body;
        observer.observe(appRoot, {
            childList: true,
            subtree: true
        });

        console.log('SPA навигация настроена');
    }

    // Инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupRequestInterception();
            setupSPANavigation();
            initializeFilters();
        });
    } else {
        setupRequestInterception();
        setupSPANavigation();
        initializeFilters();
    }

})();