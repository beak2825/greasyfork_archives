// ==UserScript==
// @name         Name Lighter&Typer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Подсвечивает имя, когда нужно обратиться к игроку
// @author       k.lvovich
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554048/Name%20LighterTyper.user.js
// @updateURL https://update.greasyfork.org/scripts/554048/Name%20LighterTyper.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Конфигурация
    const CONFIG = {
        highlightThreshold: 3,
        checkInterval: 500
    };

    // Состояние
    const state = {
        currentChatId: null,
        messageCounters: {},
        nameInput: null,
        lockButton: null,
        isLocked: {}  // Хранит состояние блокировки для каждого чата
    };

    // Функция транслитерации
    const transliterate = (function() {
        const charMap = {
            // Русский -> Английский
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'cz',
            'ч': 'ch', 'ш': 'sh', 'щ': 'shh', 'ъ': '``', 'ы': 'y`',
            'ь': '`', 'э': 'e`', 'ю': 'yu', 'я': 'ya',

            // Заглавные русские -> Заглавные английские
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E',
            'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K',
            'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
            'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Cz',
            'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shh', 'Ъ': '``', 'Ы': 'Y`',
            'Ь': '`', 'Э': 'E`', 'Ю': 'Yu', 'Я': 'Ya'
        };

        // Обратное соответствие (английский -> русский)
        const reverseCharMap = {};
        for (const [rus, eng] of Object.entries(charMap)) {
            reverseCharMap[eng] = rus;
        }

        return function(text, engToRus) {
            const map = engToRus ? reverseCharMap : charMap;

            // Сначала заменяем многосимвольные последовательности
            const multiCharReplacements = Object.entries(map)
                .filter(([key]) => key.length > 1)
                .sort((a, b) => b[0].length - a[0].length);

            for (const [from, to] of multiCharReplacements) {
                const regex = new RegExp(from, 'g');
                text = text.replace(regex, to);
            }

            // Затем заменяем одиночные символы
            for (const [from, to] of Object.entries(map)) {
                if (from.length === 1) {
                    const regex = new RegExp(from, 'g');
                    text = text.replace(regex, to);
                }
            }

            return text;
        };
    })();

    // Основные функции
    function getCurrentChatId() {
        const activeChat = document.querySelector('.vac-room-selected');
        return activeChat?.id || null;
    }

    function getFirstName() {
        const nameElement = document.querySelector('.vac-room-selected .emoji-room-name span');
        return nameElement?.textContent.trim().split(/\s+/)[0] || '';
    }

    // Функция для получения имени в зависимости от состояния блокировки
    function getCurrentUserName() {
        const chatId = getCurrentChatId();
        if (!chatId) return '';

        // Если поле заблокировано, берем имя из сохраненного значения
        if (state.isLocked[chatId]) {
            return GM_getValue(`userName_${chatId}`, '');
        }

        // Иначе берем из селектора
        return getFirstName();
    }

    // Функция для поиска поля ввода чата
    function getChatInput() {
        const chatInputSelectors = [
            'textarea.vac-textarea-message',
            'textarea[placeholder*="message"]',
            'textarea[placeholder*="сообщение"]',
            '.vac-textarea-message',
            '.message-input textarea',
            'textarea.el-textarea__inner',
            'textarea'
        ];

        for (const selector of chatInputSelectors) {
            const chatInput = document.querySelector(selector);
            if (chatInput) return chatInput;
        }

        return null;
    }

    // Функция для вставки имени в чат
    function insertNameToChat(name) {
        const chatInput = getChatInput();

        if (chatInput) {
            // Сохраняем текущее значение
            let currentValue = chatInput.value;

            // Если есть текст, делаем первую букву маленькой
            if (currentValue) {
                // Находим первую букву после пробелов и делаем её маленькой
                currentValue = currentValue.replace(/^(\s*)(\S)/, (match, spaces, firstChar) => {
                    return spaces + firstChar.toLowerCase();
                });
                chatInput.value = `${name}, ${currentValue}`;
            } else {
                chatInput.value = `${name}, `;
            }

            // Вызываем события для обновления состояния поля
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            chatInput.dispatchEvent(new Event('change', { bubbles: true }));

            // Устанавливаем фокус на поле
            chatInput.focus();

            // Перемещаем курсор в конец
            chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
        } else {
        }
    }

    // Функция для вставки сообщения благодарности
    function insertThankYouMessage() {
        const chatInput = getChatInput();

        if (chatInput) {
            const thankYouMessage = "благодарю за ожидание.🤗";

            // Добавляем сообщение к существующему тексту
            if (chatInput.value) {
                chatInput.value += ' ' + thankYouMessage;
            } else {
                chatInput.value = thankYouMessage;
            }

            // Вызываем события для обновления состояния поля
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            chatInput.dispatchEvent(new Event('change', { bubbles: true }));

            // Устанавливаем фокус на поле
            chatInput.focus();

            // Перемещаем курсор в конец
            chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
        }
    }

    function updateLockButton() {
        if (!state.lockButton || !state.nameInput) return;

        const chatId = getCurrentChatId();
        if (!chatId) return;

        const isLocked = state.isLocked[chatId] || false;

        if (isLocked) {
            state.lockButton.innerHTML = '🔒';
            state.lockButton.title = 'Разблокировать поле';
            state.lockButton.style.backgroundColor = '#f56c6c';
            state.lockButton.style.color = '#fff';
            state.lockButton.style.borderColor = '#f56c6c';
            state.nameInput.disabled = true;
            state.nameInput.style.backgroundColor = '#f5f5f5';
            state.nameInput.style.cursor = 'not-allowed';
        } else {
            state.lockButton.innerHTML = '🔓';
            state.lockButton.title = 'Заблокировать поле';
            state.lockButton.style.backgroundColor = '#67c23a';
            state.lockButton.style.color = '#fff';
            state.lockButton.style.borderColor = '#67c23a';
            state.nameInput.disabled = false;
            state.nameInput.style.backgroundColor = '#fff';
            state.nameInput.style.cursor = 'text';
        }
    }

    function lockField(chatId) {
        if (!chatId) return;
        state.isLocked[chatId] = true;
        GM_setValue(`isLocked_${chatId}`, true);
        updateLockButton();
    }

    function unlockField(chatId) {
        if (!chatId) return;
        state.isLocked[chatId] = false;
        GM_setValue(`isLocked_${chatId}`, false);
        updateLockButton();
    }

    function createNameInputElements() {
        const container = document.createElement('div');
        container.id = 'nameInputContainer';
        container.style.cssText = 'margin-top: 10px; display: flex; align-items: center; gap: 5px;';

        const label = document.createElement('span');
        label.style.fontWeight = 'bold';
        label.textContent = 'Имя:';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'userNameInput';
        input.placeholder = 'Введите имя клиента';
        input.style.cssText = 'padding: 4px 8px; border-radius: 4px; border: 1px solid #dcdfe6; flex-grow: 1;';

        const button = document.createElement('button');
        button.id = 'lockToggle';
        button.type = 'button';
        button.style.cssText = 'padding: 2px 8px; border-radius: 4px; border: 1px solid #dcdfe6; cursor: pointer; white-space: nowrap; font-size: 16px; transition: all 0.3s;';
        button.innerHTML = '🔓';

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(button);

        return container;
    }

    function setupNameInput() {
        const cardBody = document.querySelector('.el-card__body');
        if (!cardBody) return;

        // Удаляем старый контейнер если есть
        const oldContainer = document.getElementById('nameInputContainer');
        if (oldContainer) {
            oldContainer.remove();
        }

        // Создаем новые элементы
        const container = createNameInputElements();
        const lastChild = cardBody.lastElementChild;
        if (lastChild) {
            lastChild.parentNode.insertBefore(container, lastChild);
        } else {
            cardBody.appendChild(container);
        }

        // Сохраняем ссылки на элементы
        state.nameInput = document.getElementById('userNameInput');
        state.lockButton = document.getElementById('lockToggle');

        // Обработчик изменения имени
        state.nameInput.addEventListener('change', function() {
            const chatId = getCurrentChatId();
            if (chatId && !state.isLocked[chatId]) {
                GM_setValue(`userName_${chatId}`, this.value.trim());
                updateNameHighlight();
            }
        });

        // Блокируем ввод, если поле заблокировано
        state.nameInput.addEventListener('keydown', function(e) {
            const chatId = getCurrentChatId();
            if (chatId && state.isLocked[chatId]) {
                e.preventDefault();
            }
        });

        // Блокируем вставку через контекстное меню
        state.nameInput.addEventListener('paste', function(e) {
            const chatId = getCurrentChatId();
            if (chatId && state.isLocked[chatId]) {
                e.preventDefault();
            }
        });

        // Обработчик для кнопки блокировки
        state.lockButton.addEventListener('click', function() {
            const chatId = getCurrentChatId();
            if (!chatId) return;

            if (state.isLocked[chatId]) {
                unlockField(chatId);
            } else {
                lockField(chatId);
            }
        });

        // Восстанавливаем состояние для текущего чата
        const chatId = getCurrentChatId();
        if (chatId) {
            state.nameInput.value = GM_getValue(`userName_${chatId}`, '');
            state.isLocked[chatId] = GM_getValue(`isLocked_${chatId}`, false);
            updateLockButton();
        }
    }

    function updateNameHighlight() {
        const nameElement = document.querySelector('.vac-room-selected .emoji-room-name span');
        if (!nameElement) return;

        const chatId = getCurrentChatId();
        if (!chatId) return;

        nameElement.classList.remove('vac-name-highlight');

        if ((state.messageCounters[chatId] || 0) >= CONFIG.highlightThreshold) {
            nameElement.classList.add('vac-name-highlight');
        }
    }

    // Улучшенная проверка упоминания имени
    function checkNameMention(messageText, userName) {
        if (!messageText || !userName) return false;

        // Проверяем разные варианты написания
        const patterns = [
            `${userName},`,
            `${userName},`,
            `${userName}`,
            `${userName}\s`,
            `, ${userName}`
        ];

        return patterns.some(pattern =>
            messageText.includes(pattern) ||
            messageText.toLowerCase().includes(pattern.toLowerCase())
        );
    }

    // Обработка сообщений оператора
    function processOperatorMessage(messageElement) {
        const chatId = getCurrentChatId();
        if (!chatId) return;

        // Инициализация счетчика
        if (typeof state.messageCounters[chatId] === 'undefined') {
            state.messageCounters[chatId] = 0;
        }

        // Используем функцию getCurrentUserName для получения правильного имени
        const userName = getCurrentUserName();
        if (!userName) return;

        const messageText = messageElement.querySelector('.vac-format-message')?.textContent || '';
        const mentionsName = checkNameMention(messageText, userName);

        if (mentionsName) {
            state.messageCounters[chatId] = 0;
        } else {
            state.messageCounters[chatId]++;
        }

        updateNameHighlight();
    }

    // Наблюдатель за сообщениями
    function setupMessageObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const operatorMessages = node.classList?.contains('vac-message-current') ?
                                              [node] :
                                              node.querySelectorAll('.vac-message-current');

                        operatorMessages.forEach(msg => {
                            if (msg.classList.contains('vac-message-current')) {
                                processOperatorMessage(msg);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    function insertFirstName() {
        const chatId = getCurrentChatId();

        // Проверяем, заблокировано ли поле
        if (chatId && state.isLocked[chatId]) {
            // Если заблокировано, берем сохраненное имя и вставляем в чат
            const savedName = GM_getValue(`userName_${chatId}`, '');
            if (savedName) {
                insertNameToChat(savedName);
            }
            return;
        }

        const firstName = getFirstName();
        if (!firstName || !state.nameInput) return;

        // Транслитерируем имя (английское -> русское)
        const translatedName = transliterate(firstName, true);

        // Вставляем имя в поле скрипта
        state.nameInput.value = translatedName;

        // Вставляем имя в чат
        insertNameToChat(translatedName);

        if (chatId) {
            GM_setValue(`userName_${chatId}`, translatedName);
            state.messageCounters[chatId] = 0;
            updateNameHighlight();

            // Автоматически блокируем поле после первого использования Alt+Q
            setTimeout(() => {
                lockField(chatId);
            }, 100);
        }
    }

    // Инициализация
    function init() {
        // Стили
        const style = document.createElement('style');
        style.textContent = `
            .vac-name-highlight {
                color: #fff !important;
                background-color: #ff0000 !important;
                padding: 2px 8px !important;
                border-radius: 4px !important;
                animation: vac-name-blink 1.5s infinite !important;
            }
            @keyframes vac-name-blink {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
            #lockToggle:hover {
                opacity: 0.8;
            }
            #lockToggle:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);

        // Обработчики клавиш
        document.addEventListener('keydown', (e) => {
            // Alt + Q для вставки имени
            if (e.altKey && (e.key === 'q' || e.key === 'й')) {
                insertFirstName();
                e.preventDefault();
            }

            // Alt + W для вставки сообщения благодарности
            if (e.altKey && (e.key === 'w' || e.key === 'ц')) {
                insertThankYouMessage();
                e.preventDefault();
            }
        });

        // Проверка смены чата
        setInterval(() => {
            const newChatId = getCurrentChatId();
            if (newChatId !== state.currentChatId) {
                state.currentChatId = newChatId;
                setTimeout(() => {
                    setupNameInput();
                    updateNameHighlight();
                }, 100);
            }
        }, CONFIG.checkInterval);

        setTimeout(() => {
            setupNameInput();
            setupMessageObserver();
        }, 1000);
    }

    // Запуск
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();