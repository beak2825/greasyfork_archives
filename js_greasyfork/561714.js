// ==UserScript==
// @name         Smart Paste Simulator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Вставка с симуляцией ручного ввода
// @author       Вы
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561714/Smart%20Paste%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/561714/Smart%20Paste%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переменная для отслеживания последнего поля
    let lastFocusedElement = null;

    // Минимальные стили
    GM_addStyle(`
        #smart-paste-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999999;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        #smart-paste-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(76, 175, 80, 0.6);
            background: linear-gradient(135deg, #45a049, #3d8b40);
        }

        #smart-paste-btn:active {
            transform: scale(0.95);
        }

        #smart-paste-btn.loading {
            background: linear-gradient(135deg, #FF9800, #F57C00);
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `);

    // Создаем кнопку
    function createButton() {
        const button = document.createElement('button');
        button.id = 'smart-paste-btn';
        button.innerHTML = '📋';
        button.title = 'Вставить с симуляцией ввода (Ctrl+Shift+V)';

        button.addEventListener('click', handlePaste);
        document.body.appendChild(button);

        // Добавляем хоткей
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                handlePaste();
            }
        });

        // Отслеживаем последний сфокусированный элемент
        document.addEventListener('focusin', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                lastFocusedElement = target;
            }
        }, true);

        // Также отслеживаем клики на contenteditable
        document.addEventListener('click', function(e) {
            if (e.target.isContentEditable) {
                lastFocusedElement = e.target;
            }
        }, true);
    }

    // Основная функция вставки
    async function handlePaste() {
        const button = document.getElementById('smart-paste-btn');

        // Пытаемся определить целевой элемент
        let targetElement = lastFocusedElement || document.activeElement;

        // Проверяем, подходит ли элемент для ввода
        if (!targetElement || !isInputElement(targetElement)) {
            showNotification('⚠️ Сначала кликните в поле ввода');

            // Подсвечиваем все поля на странице
            const inputFields = document.querySelectorAll('input, textarea, [contenteditable]');
            inputFields.forEach(field => {
                const originalBorder = field.style.border;
                field.style.border = '2px solid #4CAF50';
                field.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.5)';

                setTimeout(() => {
                    field.style.border = originalBorder;
                    field.style.boxShadow = '';
                }, 2000);
            });

            return;
        }

        // Восстанавливаем фокус
        targetElement.focus();

        try {
            // Пытаемся прочитать буфер обмена
            const text = await navigator.clipboard.readText();

            if (!text) {
                showNotification('⚠️ Буфер обмена пуст');
                return;
            }

            // Начинаем симуляцию
            button.classList.add('loading');
            button.innerHTML = '⌨️';

            // Симулируем ввод
            await simulateTyping(targetElement, text);

            button.classList.remove('loading');
            button.innerHTML = '✅';

            setTimeout(() => {
                button.innerHTML = '📋';
            }, 1000);

        } catch (err) {
            button.classList.remove('loading');
            button.innerHTML = '📋';
            showNotification('⚠️ Не могу прочитать буфер обмена');
            console.error('Clipboard error:', err);
        }
    }

    // Проверка элемента ввода
    function isInputElement(element) {
        return element.tagName === 'INPUT' ||
               element.tagName === 'TEXTAREA' ||
               element.isContentEditable;
    }

    // Улучшенная симуляция ввода
    async function simulateTyping(element, text) {
        const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTARTEAA';
        const originalValue = isInput ? element.value : element.textContent;

        // Очищаем поле
        if (isInput) {
            element.value = '';
        } else {
            element.textContent = '';
        }

        // Триггерим события очистки
        triggerEvent(element, 'input');
        triggerEvent(element, 'change');

        // Разбиваем текст на части для более плавного ввода
        const chunks = splitTextIntoChunks(text);
        let typedLength = 0;

        for (const chunk of chunks) {
            await typeChunk(element, chunk, isInput);
            typedLength += chunk.length;

            // Показываем прогресс каждые 50 символов
            if (typedLength % 50 === 0) {
                showNotification(`⌨️ Введено ${typedLength}/${text.length} символов`);
            }
        }

        // Финальные события
        triggerEvent(element, 'change');

        // Возвращаем фокус
        setTimeout(() => element.focus(), 50);

        showNotification(`✅ Вставлено ${text.length} символов`);
    }

    // Разбивка текста на чанки
    function splitTextIntoChunks(text) {
        const chunks = [];
        let currentChunk = '';
        let inWord = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            currentChunk += char;

            // Разбиваем по словам или после 3-10 символов
            const shouldBreak =
                char === ' ' ||
                char === '\n' ||
                char === ',' ||
                char === '.' ||
                currentChunk.length >= 3 + Math.random() * 7;

            if (shouldBreak && currentChunk.length > 0) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    // Ввод одного чанка
    async function typeChunk(element, chunk, isInput) {
        return new Promise(resolve => {
            let index = 0;

            function typeNextChar() {
                if (index < chunk.length) {
                    const char = chunk[index];

                    // Случайная задержка (имитация человеческой скорости)
                    const delay = 20 + Math.random() * 30;

                    // Создаем события
                    const keydownEvent = new KeyboardEvent('keydown', {
                        key: char,
                        code: getKeyCode(char),
                        keyCode: char.charCodeAt(0),
                        bubbles: true,
                        cancelable: true
                    });

                    const keypressEvent = new KeyboardEvent('keypress', {
                        key: char,
                        code: getKeyCode(char),
                        keyCode: char.charCodeAt(0),
                        bubbles: true,
                        cancelable: true
                    });

                    // Диспатчим события
                    element.dispatchEvent(keydownEvent);
                    element.dispatchEvent(keypressEvent);

                    // Добавляем символ
                    if (isInput) {
                        element.value += char;
                    } else {
                        element.textContent += char;
                    }

                    // Событие input
                    const inputEvent = new InputEvent('input', {
                        data: char,
                        inputType: 'insertText',
                        bubbles: true
                    });
                    element.dispatchEvent(inputEvent);

                    // Обновляем курсор
                    if (isInput) {
                        element.selectionStart = element.selectionEnd = element.value.length;
                    }

                    // Поддерживаем фокус
                    element.focus();

                    index++;
                    setTimeout(typeNextChar, delay);
                } else {
                    resolve();
                }
            }

            typeNextChar();
        });
    }

    // Получение кода клавиши
    function getKeyCode(char) {
        if (char === ' ') return 'Space';
        if (char === '\n') return 'Enter';
        if (char === '\t') return 'Tab';
        if (char.length === 1 && char.match(/[a-z]/i)) return `Key${char.toUpperCase()}`;
        if (char.length === 1 && char.match(/[0-9]/)) return `Digit${char}`;
        return char;
    }

    // Триггеринг события
    function triggerEvent(element, eventName) {
        const event = new Event(eventName, { bubbles: true });
        element.dispatchEvent(event);
    }

    // Простое уведомление
    function showNotification(message) {
        // Удаляем старое уведомление
        const oldNote = document.getElementById('smart-paste-notification');
        if (oldNote) oldNote.remove();

        const notification = document.createElement('div');
        notification.id = 'smart-paste-notification';
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 999998;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);

        // Добавляем стили анимации
        if (!document.querySelector('#smart-paste-styles')) {
            const style = document.createElement('style');
            style.id = 'smart-paste-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Инициализация
    setTimeout(() => {
        createButton();
        showNotification('📋 Smart Paste загружен. Нажмите кнопку или Ctrl+Shift+V');
    }, 1000);
})();