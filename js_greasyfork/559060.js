// ==UserScript==
// @name         Лог действий игрока
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Невезение
// @match        *://patron.kinwoods.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @description Лог действий
// @downloadURL https://update.greasyfork.org/scripts/559060/%D0%9B%D0%BE%D0%B3%20%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B9%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559060/%D0%9B%D0%BE%D0%B3%20%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B9%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ID всех элементов для удобного обращения
    const ELEMENT_IDS = {
        LOG_CONTAINER: 'player-action-log-container',
        LOG_CONTENT: 'player-action-log-content',
        LOG_TITLE: 'player-action-log-title',
        RESET_BUTTON: 'player-action-log-reset-button',
        SPEED_BUTTON: 'player-action-log-speed-button',
        HEADER_ROW: 'player-action-log-header'
    };

    // Настройки для изменения скорости проверки
    const CHECK_SPEED = {
        DEFAULT: 100, // Значение по умолчанию в миллисекундах
        MIN: 50,      // Минимальная скорость
        MAX: 5000,    // Максимальная скорость
        STORAGE_KEY: 'actionLogCheckSpeed' // Ключ для сохранения
    };

    // Загружаем сохраненную скорость или используем значение по умолчанию
    let currentCheckSpeed = GM_getValue(CHECK_SPEED.STORAGE_KEY, CHECK_SPEED.DEFAULT);

    // Проверяет активен ли скрипт с компактным интерфейсом
    function isCompactInterfaceActive() {
        // Ищет элемент который есть только в компактном интерфейсе
        return document.querySelector('.fight-abilities-items-container') !== null;
    }

    // Добавляет CSS стили для лога
    function addLogStyles() {
        // Определяем какой интерфейс сейчас используется
        const isInterfaceActive = isCompactInterfaceActive();

        // Основные стили для лога
        let css = `
            #${ELEMENT_IDS.LOG_CONTAINER} {
                margin: 10px 0;
                padding: 10px;
                color: #1e1e1e;
                border-top: 1px solid #ccc;
                font-size: 14px;
            }

            #${ELEMENT_IDS.HEADER_ROW} {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            #${ELEMENT_IDS.LOG_TITLE} {
                font-size: 16px;
                margin-right: 10px;
            }

            #${ELEMENT_IDS.RESET_BUTTON} {
                padding: 4px 12px;
                cursor: pointer;
                transition: all 0.2s;
                margin-right: 5px;
            }

            #${ELEMENT_IDS.SPEED_BUTTON} {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #957b77;
                color: #ffffff;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .header-buttons {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            #${ELEMENT_IDS.LOG_CONTENT} {
                font-size: 14px;
                word-break: break-word;
            }
        `;

        // Добавляем темные стили для компактного интерфейса
        if (isInterfaceActive) {
            css += `
                #${ELEMENT_IDS.LOG_CONTAINER} {
                    background: linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%);
                    color: #e8e6e3;
                    border: 1px solid #333;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                    overflow: hidden;
                    width: -webkit-fill-available;
                }

                #${ELEMENT_IDS.LOG_TITLE} {
                    color: #e8e6e3;
                }

                #${ELEMENT_IDS.RESET_BUTTON} {
                    background: linear-gradient(145deg, #3a3a3a 0%, #2d2d2d 100%);
                    color: #e8e6e3;
                    border: 1px solid #4a4a4a;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                #${ELEMENT_IDS.RESET_BUTTON}:hover {
                    background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%);
                    transform: translateY(-1px);
                    border-color: #5a5a5a;
                }

                #${ELEMENT_IDS.SPEED_BUTTON} {
                    background: linear-gradient(145deg, #3a3a3a 0%, #2d2d2d 100%);
                    color: #e8e6e3;
                    border: 1px solid #4a4a4a;
                }

                #${ELEMENT_IDS.SPEED_BUTTON}:hover {
                    background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%);
                    transform: translateY(-1px);
                    border-color: #5a5a5a;
                }

                #${ELEMENT_IDS.LOG_CONTENT} {
                    color: #e8e6e3;
                    max-height: 240px;
                    overflow-y: auto;
                }

                #${ELEMENT_IDS.LOG_CONTENT}::-webkit-scrollbar {
                    width: 6px;
                }

                #${ELEMENT_IDS.LOG_CONTENT}::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }

                #${ELEMENT_IDS.LOG_CONTENT}::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }

                #${ELEMENT_IDS.LOG_CONTENT}::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .fight-abilities-items-container {
                    margin-top: 10px !important;
                }
            `;
        } else {
            // Стили для обычного интерфейса
            css += `
                #${ELEMENT_IDS.LOG_CONTAINER} {
                    margin: 10px 0 0 0;
                }

                #${ELEMENT_IDS.RESET_BUTTON} {
                    background-color: #957b77;
                    color: #ffffff;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                #${ELEMENT_IDS.RESET_BUTTON}:hover {
                    background-color: #a58b87;
                    box-shadow: 0 0 5px rgba(0,0,0,0.2);
                }

                #${ELEMENT_IDS.SPEED_BUTTON}:hover {
                    background-color: #a58b87;
                    box-shadow: 0 0 5px rgba(0,0,0,0.2);
                }
            `;
        }

        // Добавляем стили на страницу
        GM_addStyle(css);
    }

    // Функция для изменения скорости проверки через prompt
    function changeCheckSpeed() {
        // Создаем prompt с информацией о скорости
        const newSpeedInput = prompt(
            `Сменить скорость проверки действий.\n\n` +
            `Чем меньше, тем быстрее проверяются действия, однако частые проверки могут вызывать лаги.\n\n` +
            `Введите значение от ${CHECK_SPEED.MIN} до ${CHECK_SPEED.MAX} мс.\n` +
            `Текущая скорость: ${currentCheckSpeed} мс`,
            currentCheckSpeed
        );

        // Если пользователь отменил - выходим
        if (newSpeedInput === null) {
            return;
        }

        // Преобразуем ввод в число
        const newSpeed = parseInt(newSpeedInput);

        // Проверяем что введено число
        if (isNaN(newSpeed)) {
            alert('Пожалуйста, введите число!');
            return;
        }

        // Проверяем что число в допустимом диапазоне
        if (newSpeed < CHECK_SPEED.MIN || newSpeed > CHECK_SPEED.MAX) {
            alert(`Скорость должна быть в диапазоне от ${CHECK_SPEED.MIN} до ${CHECK_SPEED.MAX} мс!`);
            return;
        }

        // Сохраняем новое значение
        currentCheckSpeed = newSpeed;
        GM_setValue(CHECK_SPEED.STORAGE_KEY, newSpeed);

        // Обновляем подсказку на кнопке
        const speedButton = document.getElementById(ELEMENT_IDS.SPEED_BUTTON);
        if (speedButton) {
            speedButton.title = `Скорость проверки: ${currentCheckSpeed} мс\nНажмите для изменения`;
        }
    }

    // Создает лог действий на странице
    function createActionLog() {
        // Проверяем какой интерфейс активен
        const isInterfaceActive = isCompactInterfaceActive();

        // Добавляем стили
        addLogStyles();

        // Определяем куда вставлять лог
        let parentContainer;
        let insertBeforeElement = null;

        if (isInterfaceActive) {
            // Для компактного интерфейса - в .game-right
            const gameRight = document.querySelector('.game-right');
            const testElement = gameRight.querySelector('.test');

            if (!gameRight) return null;

            parentContainer = gameRight;
            insertBeforeElement = testElement;
        } else {
            // Для обычного интерфейса - в .game-container
            parentContainer = document.querySelector('.game-container');
            if (!parentContainer) return null;
        }

        // Создаем основные элементы лога
        const logContainer = document.createElement('div');
        logContainer.id = ELEMENT_IDS.LOG_CONTAINER;

        const headerRow = document.createElement('div');
        headerRow.id = ELEMENT_IDS.HEADER_ROW;

        const logTitle = document.createElement('div');
        logTitle.id = ELEMENT_IDS.LOG_TITLE;
        logTitle.textContent = 'Лог действий игрока:';

        // Контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'header-buttons';

        // Кнопка сброса лога
        const resetButton = document.createElement('button');
        resetButton.id = ELEMENT_IDS.RESET_BUTTON;
        resetButton.textContent = 'Сбросить лог';

        // Обработчик сброса
        resetButton.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите сбросить лог действий?')) {
                GM_setValue('actionLog', '');
                document.getElementById(ELEMENT_IDS.LOG_CONTENT).textContent = '';
            }
        });

        // Кнопка настройки скорости (новая квадратная кнопка)
        const speedButton = document.createElement('button');
        speedButton.id = ELEMENT_IDS.SPEED_BUTTON;
        speedButton.title = `Скорость проверки: ${currentCheckSpeed} мс\nНажмите для изменения`;
        speedButton.innerHTML = 'ᯤ';

        // Обработчик изменения скорости
        speedButton.addEventListener('click', function() {
            changeCheckSpeed();
        });

        // Контейнер для текста лога
        const logContent = document.createElement('div');
        logContent.id = ELEMENT_IDS.LOG_CONTENT;
        // Загружаем сохраненный лог
        logContent.textContent = GM_getValue('actionLog', '');

        // Собираем структуру элементов
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(speedButton);
        headerRow.appendChild(logTitle);
        headerRow.appendChild(buttonContainer);
        logContainer.appendChild(headerRow);
        logContainer.appendChild(logContent);

        // Добавляем лог на страницу в нужное место
        if (isInterfaceActive && insertBeforeElement) {
            parentContainer.insertBefore(logContainer, insertBeforeElement);
        } else if (isInterfaceActive) {
            parentContainer.appendChild(logContainer);
        } else {
            parentContainer.appendChild(logContainer);
        }

        return logContent;
    }

    // Добавляет новую запись в лог
    function addToActionLog(message) {
        const logElement = document.getElementById(ELEMENT_IDS.LOG_CONTENT);
        if (!logElement) return;

        // Формируем новый текст лога
        let newText;
        if (logElement.textContent === '') {
            newText = message + '.';
        } else {
            newText = logElement.textContent + ' ' + message + '.';
        }

        // Обновляем на странице и сохраняем
        logElement.textContent = newText;
        GM_setValue('actionLog', newText);
    }

    // Получает название предмета из HTML элемента
    function getItemName(element) {
        // Ищет всплывающую подсказку с названием предмета
        const tooltip = element.querySelector('.cell-tooltip p');
        return tooltip ? tooltip.textContent.trim() : null;
    }

    // Переменные для отслеживания предметов
    let lastGroundItems = new Map();    // Последние предметы на земле
    let lastInventoryItems = new Map(); // Последние предметы в инвентаре
    let lastBagItems = new Map();       // Последние предметы в сумке
    let lastUpdateTime = 0;             // Время последней проверки

    // Переменные для отслеживания действий игрока
    let lastLoggedAction = null;  // Последнее записанное действие
    let isActionActive = false;   // Флаг активного действия
    let inCombat = false;         // Флаг боя
    let combatLogged = false;     // Флаг записи о бое

    // Наблюдатели за кнопками
    let cancelButtonObserver = null;
    let interactionButtonObserver = null;
    let eatButtonObserver = null;

    // Сканирует текущие предметы на странице
    function scanItems() {
        const currentGroundItems = new Map();
        const currentInventoryItems = new Map();
        const currentBagItems = new Map();

        // Сканируем предметы на земле
        document.querySelectorAll('.cell-items .slot-item').forEach((slot, index) => {
            const name = getItemName(slot);
            if (name) currentGroundItems.set(index, name);
        });

        // Сканируем предметы в инвентаре
        document.querySelectorAll('.my-items .slot-item').forEach((slot, index) => {
            const name = getItemName(slot);
            if (name) currentInventoryItems.set(index, name);
        });

        // Сканируем предметы в сумке
        document.querySelectorAll('.bag-items .slot-item').forEach((slot, index) => {
            const name = getItemName(slot);
            if (name) currentBagItems.set(index, name);
        });

        return { currentGroundItems, currentInventoryItems, currentBagItems };
    }

    // Определяет какие предметы переместились
    function determineItemMovement(oldItems, newItems, locationType) {
        const movedItems = [];

        // Ищем исчезнувшие предметы (взятые)
        for (const [index, name] of oldItems) {
            if (!newItems.has(index)) {
                movedItems.push({
                    action: 'взял',
                    name: name,
                    location: locationType,
                    index: index
                });
            }
        }

        // Ищем появившиеся предметы (положенные)
        for (const [index, name] of newItems) {
            if (!oldItems.has(index)) {
                movedItems.push({
                    action: 'положил',
                    name: name,
                    location: locationType,
                    index: index
                });
            }
        }

        return movedItems;
    }

    // Проверяет перемещение предметов между локациями
    function checkItemMovement() {
        const now = Date.now();
        // Проверяем только если прошло достаточно времени (настраиваемая скорость)
        if (now - lastUpdateTime < currentCheckSpeed) return;
        lastUpdateTime = now;

        // Получаем текущие предметы
        const { currentGroundItems, currentInventoryItems, currentBagItems } = scanItems();

        // Определяем изменения в каждом месте
        const groundChanges = determineItemMovement(lastGroundItems, currentGroundItems, 'земля');
        const inventoryChanges = determineItemMovement(lastInventoryItems, currentInventoryItems, 'инвентарь');
        const bagChanges = determineItemMovement(lastBagItems, currentBagItems, 'сумка');

        // Анализируем перемещения между землей и инвентарем
        if (groundChanges.length > 0 && inventoryChanges.length > 0) {
            // Предмет с земли в инвентарь
            const takenFromGround = groundChanges.find(c => c.action === 'взял');
            const addedToInventory = inventoryChanges.find(c => c.action === 'положил');

            if (takenFromGround && addedToInventory && takenFromGround.name === addedToInventory.name) {
                addToActionLog(`Подобрал ${takenFromGround.name}`);
                // Удаляем из массивов чтобы не обрабатывать повторно
                groundChanges.splice(groundChanges.indexOf(takenFromGround), 1);
                inventoryChanges.splice(inventoryChanges.indexOf(addedToInventory), 1);
            }

            // Предмет из инвентаря на землю
            const takenFromInventory = inventoryChanges.find(c => c.action === 'взял');
            const addedToGround = groundChanges.find(c => c.action === 'положил');

            if (takenFromInventory && addedToGround && takenFromInventory.name === addedToGround.name) {
                addToActionLog(`Выложил ${takenFromInventory.name} на землю`);
                groundChanges.splice(groundChanges.indexOf(addedToGround), 1);
                inventoryChanges.splice(inventoryChanges.indexOf(takenFromInventory), 1);
            }
        }

        // Анализируем перемещения между инвентарем и сумкой
        if (inventoryChanges.length > 0 && bagChanges.length > 0) {
            // Предмет из инвентаря в сумку
            const takenFromInventory = inventoryChanges.find(c => c.action === 'взял');
            const addedToBag = bagChanges.find(c => c.action === 'положил');

            if (takenFromInventory && addedToBag && takenFromInventory.name === addedToBag.name) {
                addToActionLog(`Положил ${takenFromInventory.name} в сумку`);
                inventoryChanges.splice(inventoryChanges.indexOf(takenFromInventory), 1);
                bagChanges.splice(bagChanges.indexOf(addedToBag), 1);
            }

            // Предмет из сумки в инвентарь
            const takenFromBag = bagChanges.find(c => c.action === 'взял');
            const addedToInventory = inventoryChanges.find(c => c.action === 'положил');

            if (takenFromBag && addedToInventory && takenFromBag.name === addedToInventory.name) {
                addToActionLog(`Достал ${takenFromBag.name} из сумки`);
                bagChanges.splice(bagChanges.indexOf(takenFromBag), 1);
                inventoryChanges.splice(inventoryChanges.indexOf(addedToInventory), 1);
            }
        }

        // Анализируем перемещения между землей и сумкой
        if (groundChanges.length > 0 && bagChanges.length > 0) {
            // Предмет с земли в сумку
            const takenFromGround = groundChanges.find(c => c.action === 'взял');
            const addedToBag = bagChanges.find(c => c.action === 'положил');

            if (takenFromGround && addedToBag && takenFromGround.name === addedToBag.name) {
                addToActionLog(`Подобрал ${takenFromGround.name} в сумку`);
                groundChanges.splice(groundChanges.indexOf(takenFromGround), 1);
                bagChanges.splice(bagChanges.indexOf(addedToBag), 1);
            }

            // Предмет из сумки на землю
            const takenFromBag = bagChanges.find(c => c.action === 'взял');
            const addedToGround = groundChanges.find(c => c.action === 'положил');

            if (takenFromBag && addedToGround && takenFromBag.name === addedToGround.name) {
                addToActionLog(`Выложил ${takenFromBag.name} из сумки на землю`);
                bagChanges.splice(bagChanges.indexOf(takenFromBag), 1);
                groundChanges.splice(groundChanges.indexOf(addedToGround), 1);
            }
        }

        // Обновляем последние состояния для следующей проверки
        lastGroundItems = new Map(currentGroundItems);
        lastInventoryItems = new Map(currentInventoryItems);
        lastBagItems = new Map(currentBagItems);
    }

    // Определяет обычное действие игрока по тексту таймера
    function parsePlayerAction() {
        const timerElement = document.querySelector('div.panel > p');
        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            if (timerText.includes('осталось') && timerText.includes('сек')) {
                const actionText = timerText.split('осталось')[0].trim();

                // Определяем тип действия по ключевым словам
                if (actionText.includes('Идти')) {
                    const location = document.querySelector('p#loc-name')?.textContent?.trim() || 'неизвестное место';
                    return `Пошёл в ${location}`;
                } else if (actionText.includes('Собирать добычу')) {
                    return 'Собрал добычу';
                } else if (actionText.includes('Искать следы')) {
                    return 'Искал следы';
                } else if (actionText.includes('Изучать след')) {
                    return 'Изучил след';
                } else if (actionText.includes('Искать дичь')) {
                    return 'Искал дичь';
                } else if (actionText.includes('Пить')) {
                    return 'Попил';
                } else if (actionText.includes('Нырять')) {
                    const location = document.querySelector('p#loc-name')?.textContent?.trim() || 'неизвестное место';
                    return `Нырнул в ${location}`;
                } else if (actionText.includes('Всплывать')) {
                    const location = document.querySelector('p#loc-name')?.textContent?.trim() || 'неизвестное место';
                    return `Всплыл в ${location}`;
                }
            }
        }

        return null;
    }

    // Проверяет находится ли игрок в бою
    function checkCombatStatus() {
        const combatElement = document.querySelector('p.turn-text');
        const isInCombat = combatElement && combatElement.textContent.includes('[Сейчас ходит');

        if (isInCombat && !inCombat) {
            // Начало боя
            inCombat = true;
            combatLogged = false;
            addToActionLog('Вошёл в бой');
            combatLogged = true;
        } else if (!isInCombat && inCombat) {
            // Конец боя
            inCombat = false;
            combatLogged = false;
        }
    }

    // Проверяет обычные действия игрока
    function checkPlayerAction() {
        // Сначала проверяем бой
        checkCombatStatus();

        // Определяем текущее действие
        const currentAction = parsePlayerAction();

        // Записываем действие если оно началось
        if (currentAction && !isActionActive) {
            addToActionLog(currentAction);
            lastLoggedAction = currentAction;
            isActionActive = true;
        } else if (!currentAction) {
            // Сбрасываем флаг если действие завершилось
            isActionActive = false;
        }
    }

    // Наблюдатель за кнопками отмены действия
    function setupCancelButtonObserver() {
        if (cancelButtonObserver) return;

        // Наблюдаем за всем документом
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        cancelButtonObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;

                // Ищем все кнопки отмены
                const cancelButtons = document.querySelectorAll('.timer-cancel');
                cancelButtons.forEach(button => {
                    // Добавляем обработчик только один раз
                    if (!button.hasAttribute('data-log-listener')) {
                        button.setAttribute('data-log-listener', 'true');
                        button.addEventListener('click', function() {
                            addToActionLog('Отменил действие');
                        });
                    }
                });
            });
        });

        cancelButtonObserver.observe(targetNode, config);
    }

    // Наблюдатель за кнопкой взаимодействия с ботами
    function setupInteractionButtonObserver() {
        if (interactionButtonObserver) return;

        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        interactionButtonObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;

                // Ищем кнопку по изображению
                const interactionButton = document.querySelector('button.action img[src="pics/actions/12.png"]');
                if (interactionButton && !interactionButton.closest('button').hasAttribute('data-log-listener')) {
                    const button = interactionButton.closest('button');
                    button.setAttribute('data-log-listener', 'true');
                    button.addEventListener('click', function() {
                        addToActionLog('Повзаимодействовал с ботом');
                    });
                }
            });
        });

        interactionButtonObserver.observe(targetNode, config);
    }

    // Наблюдатель за кнопками "Съесть"
    function setupEatButtonObserver() {
        if (eatButtonObserver) return;

        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        let healthBefore = 0;

        // Функция получения текущего здоровья
        function getCurrentHealth() {
            const healthElement = document.querySelector('.bar-number');
            if (!healthElement) return 0;

            const healthText = healthElement.textContent.split('<!---->')[0].trim();
            return parseInt(healthText.split('/')[0].trim()) || 0;
        }

        eatButtonObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;

                // Ищем все кнопки "Съесть"
                const eatButtons = document.querySelectorAll('.eatButton');
                eatButtons.forEach(button => {
                    if (!button.hasAttribute('data-log-listener')) {
                        button.setAttribute('data-log-listener', 'true');

                        // Добавляем обработчик клика
                        button.addEventListener('click', function() {
                            // Получаем выбранный съедобный предмет
                            const allSelected = document.querySelectorAll('.my-items .slot-item.selected');
                            const edibleItems = Array.from(allSelected).filter(item => {
                                const itemName = getItemName(item);
                                // Исключаем контейнеры
                                return itemName && !itemName.match(/Сумка|Кулёк|Свёрток|Контейнер/i);
                            });
                            const lastSelected = edibleItems[edibleItems.length - 1];
                            const itemName = lastSelected ? getItemName(lastSelected) : null;

                            // Запоминаем здоровье до еды
                            healthBefore = getCurrentHealth();

                            // Ждем и проверяем здоровье после еды
                            setTimeout(() => {
                                const healthAfter = getCurrentHealth();
                                const healthGain = healthAfter - healthBefore;

                                // Записываем в лог
                                if (itemName) {
                                    addToActionLog(`Съел ${itemName}`);
                                    if (healthGain > 0) {
                                        addToActionLog(`Исцелился на ${healthGain} единиц здоровья`);
                                    }
                                } else {
                                    addToActionLog('Поел (предмет не выбран)');
                                    if (healthGain > 0) {
                                        addToActionLog(`Исцелился на ${healthGain} единиц здоровья`);
                                    }
                                }
                            }, 300);
                        });
                    }
                });
            });
        });

        eatButtonObserver.observe(targetNode, config);
    }

    // Основная функция инициализации скрипта
    function initializeLog() {
        // Определяем где размещать лог
        const isInterfaceActive = isCompactInterfaceActive();
        let targetContainer;

        if (isInterfaceActive) {
            targetContainer = document.querySelector('.game-right');
        } else {
            targetContainer = document.querySelector('.game-container');
        }

        // Если контейнер не найден - пробуем позже
        if (!targetContainer) {
            setTimeout(initializeLog, 500);
            return;
        }

        // Создаем лог на странице
        const logElement = createActionLog();
        if (!logElement) {
            setTimeout(initializeLog, 500);
            return;
        }

        // Начальное сканирование предметов
        const { currentGroundItems, currentInventoryItems, currentBagItems } = scanItems();
        lastGroundItems = new Map(currentGroundItems);
        lastInventoryItems = new Map(currentInventoryItems);
        lastBagItems = new Map(currentBagItems);

        // Настраиваем наблюдателей
        setupCancelButtonObserver();
        setupInteractionButtonObserver();
        setupEatButtonObserver();

        // Запускаем периодические проверки
        setInterval(checkItemMovement, currentCheckSpeed);
        setInterval(checkPlayerAction, 50);
    }

    // Запускаем скрипт после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeLog, 1000);
        });
    } else {
        setTimeout(initializeLog, 1000);
    }
})();