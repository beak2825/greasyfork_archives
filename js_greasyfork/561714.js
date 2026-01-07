// ==UserScript==
// @name         Anti-Fraud Bypass Helper v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Обход защиты от копирования и вставки
// @author       Вы
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561714/Anti-Fraud%20Bypass%20Helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/561714/Anti-Fraud%20Bypass%20Helper%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Глобальная переменная для хранения последнего активного поля
    let lastFocusedElement = null;

    // Стили для окна
    GM_addStyle(`
        #anti-fraud-helper {
            position: fixed;
            top: 150px;
            left: 20px;
            width: 320px;
            background: white;
            border: 2px solid #FF5722;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(255, 87, 34, 0.4);
            z-index: 999999;
            font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            overflow: hidden;
        }

        #anti-fraud-header {
            background: linear-gradient(135deg, #FF5722, #E64A19);
            color: white;
            padding: 14px 18px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        #anti-fraud-content {
            padding: 18px;
            background: #fff8f6;
            max-height: 400px;
            overflow-y: auto;
        }

        .anti-fraud-section {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #ffccbc;
        }

        .anti-fraud-section h3 {
            margin-top: 0;
            color: #D84315;
            font-size: 14px;
            border-bottom: 1px solid #ffccbc;
            padding-bottom: 8px;
        }

        .anti-fraud-btn {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            background: linear-gradient(to right, #FF5722, #F4511E);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 13px;
        }

        .anti-fraud-btn:hover {
            background: linear-gradient(to right, #F4511E, #E64A19);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(255, 87, 34, 0.3);
        }

        .anti-fraud-btn.secondary {
            background: linear-gradient(to right, #5C6BC0, #3F51B5);
        }

        .anti-fraud-btn.secondary:hover {
            background: linear-gradient(to right, #3F51B5, #303F9F);
        }

        .anti-fraud-btn.success {
            background: linear-gradient(to right, #43A047, #2E7D32);
        }

        .anti-fraud-btn.success:hover {
            background: linear-gradient(to right, #2E7D32, #1B5E20);
        }

        .anti-fraud-input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ffab91;
            border-radius: 6px;
            font-size: 13px;
            font-family: 'SF Mono', Monaco, monospace;
            box-sizing: border-box;
        }

        .anti-fraud-input:focus {
            outline: none;
            border-color: #FF5722;
            box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.2);
        }

        .anti-fraud-textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ffab91;
            border-radius: 6px;
            font-size: 12px;
            font-family: 'SF Mono', Monaco, monospace;
            resize: vertical;
            box-sizing: border-box;
        }

        .anti-fraud-tip {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            font-style: italic;
        }

        .anti-fraud-hotkey {
            display: inline-block;
            background: #424242;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            margin: 0 2px;
        }

        .current-field-info {
            background: #e8f5e8;
            border: 1px solid #4CAF50;
            border-radius: 6px;
            padding: 10px;
            margin: 10px 0;
            font-size: 12px;
            color: #2E7D32;
            display: none;
        }

        .current-field-info.visible {
            display: block;
        }

        #anti-fraud-toggle {
            position: fixed;
            top: 180px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FF5722, #E64A19);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999998;
            font-size: 22px;
            box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #anti-fraud-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(255, 87, 34, 0.6);
        }
    `);

    // Отслеживаем последний сфокусированный элемент
    function trackLastFocusedElement() {
        document.addEventListener('focusin', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                lastFocusedElement = target;
                updateFieldInfo();
            }
        }, true);

        // Также отслеживаем клики на contenteditable элементах
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (target.isContentEditable) {
                lastFocusedElement = target;
                updateFieldInfo();
            }
        }, true);
    }

    // Обновляем информацию о текущем поле
    function updateFieldInfo() {
        const infoElement = document.getElementById('current-field-info');
        if (!infoElement) return;

        if (lastFocusedElement) {
            const tagName = lastFocusedElement.tagName.toLowerCase();
            const id = lastFocusedElement.id ? `#${lastFocusedElement.id}` : '';
            const className = lastFocusedElement.className ? `.${lastFocusedElement.className.split(' ')[0]}` : '';
            const type = lastFocusedElement.type || '';

            infoElement.innerHTML = `
                <strong>Текущее поле:</strong><br>
                ${tagName}${id}${className} ${type ? `[type="${type}"]` : ''}<br>
                <small>Готово для вставки</small>
            `;
            infoElement.classList.add('visible');
        } else {
            infoElement.classList.remove('visible');
        }
    }

    // Создание основного окна
    function createHelperWindow() {
        const container = document.createElement('div');
        container.id = 'anti-fraud-helper';

        container.innerHTML = `
            <div id="anti-fraud-header">
                <span>🔓 Anti-Fraud Helper v2</span>
                <span id="anti-fraud-minimize" title="Свернуть">−</span>
            </div>
            <div id="anti-fraud-content">
                <div class="current-field-info" id="current-field-info">
                    <strong>Текущее поле:</strong><br>
                    Не выбрано
                </div>

                <div class="anti-fraud-section">
                    <h3>📋 Работа с буфером обмена</h3>
                    <button class="anti-fraud-btn" id="copy-selected">
                        📥 Копировать выделенный текст
                    </button>
                    <button class="anti-fraud-btn secondary" id="paste-simulated">
                        📤 Вставить с симуляцией ввода
                    </button>
                    <button class="anti-fraud-btn" id="force-select-field">
                        🎯 Выбрать последнее поле
                    </button>
                    <div class="anti-fraud-tip">
                        Сначала кликните в поле ввода, затем используйте кнопки
                    </div>
                </div>

                <div class="anti-fraud-section">
                    <h3>⌨️ Быстрая вставка</h3>
                    <input type="text" class="anti-fraud-input" id="quick-text" placeholder="Текст для быстрой вставки">
                    <button class="anti-fraud-btn success" id="quick-paste">
                        ⚡ Быстрая вставка
                    </button>
                    <div class="anti-fraud-tip">
                        Вставляет текст в последнее выбранное поле
                    </div>
                </div>

                <div class="anti-fraud-section">
                    <h3>🔍 Просмотр DOM</h3>
                    <button class="anti-fraud-btn secondary" id="show-hidden">
                        👁 Показать скрытые поля
                    </button>
                    <button class="anti-fraud-btn secondary" id="disable-events">
                        ⛔ Временно отключить обработчики
                    </button>
                    <div class="anti-fraud-tip">
                        Показывает скрытые input'ы и отключает события на 5 секунд
                    </div>
                </div>

                <div class="anti-fraud-section">
                    <h3>📝 Вставка по шаблону</h3>
                    <textarea class="anti-fraud-textarea" id="template-text" placeholder="Введите шаблон для вставки">253177049 RN
431${Math.floor(Math.random() * 90000 + 10000)} AN</textarea>
                    <button class="anti-fraud-btn" id="paste-template">
                        🎯 Вставить шаблон
                    </button>
                    <div class="anti-fraud-tip">
                        Можно подготовить текст заранее и вставить одним кликом
                    </div>
                </div>

                <div class="anti-fraud-section">
                    <h3>🛠️ Инструменты для Mac</h3>
                    <div style="font-size: 12px; line-height: 1.5; color: #333;">
                        <p><strong>Альтернативные способы:</strong></p>
                        <p>• Нажмите в поле ввода, затем используйте кнопки выше</p>
                        <p>• Для принудительного выбора: используйте "Выбрать последнее поле"</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        makeDraggable(container);
        setupEventListeners();
    }

    // Создание кнопки переключения
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'anti-fraud-toggle';
        toggleBtn.innerHTML = '🔓';
        toggleBtn.title = 'Anti-Fraud Helper';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const container = document.getElementById('anti-fraud-helper');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggleBtn.innerHTML = '🔒';
                toggleBtn.style.background = 'linear-gradient(135deg, #43A047, #2E7D32)';
            } else {
                container.style.display = 'none';
                toggleBtn.innerHTML = '🔓';
                toggleBtn.style.background = 'linear-gradient(135deg, #FF5722, #E64A19)';
            }
        });
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Копирование выделенного текста
        document.getElementById('copy-selected').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            copySelectedText();
        });

        // Вставка с симуляцией ввода
        document.getElementById('paste-simulated').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pasteWithSimulation();
        });

        // Принудительный выбор поля
        document.getElementById('force-select-field').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            forceSelectField();
        });

        // Быстрая вставка
        document.getElementById('quick-paste').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            quickPaste();
        });

        // Показать скрытые поля
        document.getElementById('show-hidden').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showHiddenFields();
        });

        // Отключить обработчики событий
        document.getElementById('disable-events').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            disableEventListeners();
        });

        // Вставить шаблон
        document.getElementById('paste-template').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pasteTemplate();
        });

        // Сворачивание окна
        document.getElementById('anti-fraud-minimize').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const content = document.getElementById('anti-fraud-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            document.getElementById('anti-fraud-minimize').innerHTML = isHidden ? '−' : '+';
        });
    }

    // Функция копирования выделенного текста
    function copySelectedText() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                showNotification('✅ Текст скопирован в буфер');
            }).catch(err => {
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = selectedText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('✅ Текст скопирован (fallback метод)');
            });
        } else {
            showNotification('⚠️ Нет выделенного текста');
        }
    }

    // Функция вставки с симуляцией ручного ввода
    function pasteWithSimulation() {
        // Пытаемся использовать сохраненный элемент
        let targetElement = lastFocusedElement;

        // Если нет сохраненного, пытаемся найти активный
        if (!targetElement) {
            targetElement = document.activeElement;
        }

        // Проверяем, что элемент подходит для ввода
        if (!targetElement || !isInputElement(targetElement)) {
            showNotification('⚠️ Сначала кликните в поле ввода, затем нажмите эту кнопку');

            // Показываем подсказку
            const inputFields = document.querySelectorAll('input, textarea, [contenteditable]');
            if (inputFields.length > 0) {
                showNotification(`📝 На странице найдено ${inputFields.length} полей для ввода`);

                // Подсвечиваем все поля на 3 секунды
                inputFields.forEach(field => {
                    const originalBorder = field.style.border;
                    field.style.border = '2px solid #4CAF50';
                    field.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';

                    setTimeout(() => {
                        field.style.border = originalBorder;
                        field.style.boxShadow = '';
                    }, 3000);
                });
            }
            return;
        }

        // Восстанавливаем фокус на поле
        targetElement.focus();

        navigator.clipboard.readText().then(text => {
            // Даем время на фокусировку
            setTimeout(() => {
                simulateTyping(targetElement, text);
            }, 100);
        }).catch(err => {
            // Если clipboard API не доступен
            showNotification('⚠️ Не могу прочитать буфер. Вставьте текст в поле выше и используйте "Быстрая вставка"');
        });
    }

    // Проверка, является ли элемент полем ввода
    function isInputElement(element) {
        return element.tagName === 'INPUT' ||
               element.tagName === 'TEXTAREA' ||
               element.isContentEditable;
    }

    // Принудительный выбор последнего поля
    function forceSelectField() {
        if (lastFocusedElement) {
            lastFocusedElement.focus();

            // Подсвечиваем выбранное поле
            const originalBorder = lastFocusedElement.style.border;
            const originalBoxShadow = lastFocusedElement.style.boxShadow;

            lastFocusedElement.style.border = '3px solid #FF5722';
            lastFocusedElement.style.boxShadow = '0 0 15px rgba(255, 87, 34, 0.7)';

            showNotification(`✅ Выбрано поле: ${lastFocusedElement.tagName}${lastFocusedElement.id ? '#' + lastFocusedElement.id : ''}`);

            setTimeout(() => {
                lastFocusedElement.style.border = originalBorder;
                lastFocusedElement.style.boxShadow = originalBoxShadow;
            }, 2000);
        } else {
            showNotification('⚠️ Сначала кликните в любое поле ввода на странице');
        }
    }

    // Улучшенная симуляция ручного ввода
    function simulateTyping(element, text) {
        if (!text) {
            showNotification('⚠️ Буфер обмена пуст');
            return;
        }

        showNotification(`⌨️ Начинаю ввод ${text.length} символов...`);

        // Сохраняем текущее значение
        const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
        const originalValue = isInput ? element.value : element.textContent;

        // Очищаем поле, если нужно
        const shouldClear = confirm('Очистить поле перед вставкой?');
        if (shouldClear) {
            if (isInput) {
                element.value = '';
            } else {
                element.textContent = '';
            }

            // Триггерим события очистки
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
        }

        let index = 0;
        const typingSpeed = 20 + Math.random() * 20; // Случайная скорость для реалистичности

        function typeNextChar() {
            if (index < text.length) {
                const char = text.charAt(index);

                // Случайная задержка для некоторых символов (имитация человеческого ввода)
                const delay = typingSpeed + (Math.random() > 0.8 ? 50 : 0);

                // Создаем реалистичные события
                const keydownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true
                });

                const keypressEvent = new KeyboardEvent('keypress', {
                    key: char,
                    code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
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
                    bubbles: true,
                    cancelable: true
                });
                element.dispatchEvent(inputEvent);

                // Обновляем позицию курсора
                if (isInput) {
                    element.selectionStart = element.selectionEnd = element.value.length;
                }

                // Поддерживаем фокус
                element.focus();

                index++;

                // Периодически показываем прогресс
                if (index % 10 === 0) {
                    showNotification(`⌨️ Введено ${index}/${text.length} символов...`);
                }

                setTimeout(typeNextChar, delay);
            } else {
                // Завершающие события
                const changeEvent = new Event('change', { bubbles: true });
                const blurEvent = new Event('blur', { bubbles: true });

                element.dispatchEvent(changeEvent);
                element.dispatchEvent(blurEvent);

                // Сразу возвращаем фокус
                setTimeout(() => element.focus(), 100);

                showNotification(`✅ Ввод завершен! Введено ${text.length} символов`);
            }
        }

        // Начинаем ввод
        typeNextChar();
    }

    // Быстрая вставка
    function quickPaste() {
        const text = document.getElementById('quick-text').value;

        if (!text) {
            showNotification('⚠️ Введите текст для вставки');
            return;
        }

        // Пытаемся использовать сохраненный элемент
        let targetElement = lastFocusedElement || document.activeElement;

        if (!targetElement || !isInputElement(targetElement)) {
            showNotification('⚠️ Сначала выберите поле ввода');
            return;
        }

        // Восстанавливаем фокус
        targetElement.focus();

        // Используем прямой метод для быстрой вставки
        const isInput = targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA';

        if (isInput) {
            const start = targetElement.selectionStart;
            const end = targetElement.selectionEnd;
            const value = targetElement.value;

            targetElement.value = value.substring(0, start) + text + value.substring(end);
            targetElement.selectionStart = targetElement.selectionEnd = start + text.length;
        } else if (targetElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        }

        // Триггерим события
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        targetElement.dispatchEvent(inputEvent);
        targetElement.dispatchEvent(changeEvent);

        showNotification(`✅ Вставлено ${text.length} символов`);
    }

    // Показать скрытые поля
    function showHiddenFields() {
        const hiddenElements = document.querySelectorAll('input[type="hidden"], [style*="display:none"], [style*="display: none"], [hidden]');

        hiddenElements.forEach(el => {
            const originalDisplay = el.style.display;
            const originalHidden = el.hidden;

            // Временно показываем элемент
            el.style.display = 'block';
            el.style.opacity = '0.7';
            el.style.backgroundColor = '#fff9c4';
            el.style.border = '2px dashed #ff9800';
            el.style.padding = '5px';
            el.style.margin = '2px';
            el.hidden = false;

            // Возвращаем через 10 секунд
            setTimeout(() => {
                el.style.display = originalDisplay;
                el.style.opacity = '';
                el.style.backgroundColor = '';
                el.style.border = '';
                el.style.padding = '';
                el.style.margin = '';
                el.hidden = originalHidden;
            }, 10000);
        });

        showNotification(`👁 Показано ${hiddenElements.length} скрытых элементов на 10 секунд`);
    }

    // Временно отключить обработчики событий
    function disableEventListeners() {
        const elements = document.querySelectorAll('input, textarea, [contenteditable]');
        let disabledCount = 0;

        elements.forEach(el => {
            const originalOnpaste = el.onpaste;
            const originalOncopy = el.oncopy;
            const originalOncut = el.oncut;
            const originalOnkeydown = el.onkeydown;
            const originalOnkeypress = el.onkeypress;

            // Сохраняем оригинальные обработчики
            el.dataset.originalOnpaste = originalOnpaste ? 'true' : 'false';
            el.dataset.originalOncopy = originalOncopy ? 'true' : 'false';
            el.dataset.originalOncut = originalOncut ? 'true' : 'false';
            el.dataset.originalOnkeydown = originalOnkeydown ? 'true' : 'false';
            el.dataset.originalOnkeypress = originalOnkeypress ? 'true' : 'false';

            // Отключаем обработчики
            el.onpaste = null;
            el.oncopy = null;
            el.oncut = null;
            el.onkeydown = null;
            el.onkeypress = null;

            // Также удаляем event listeners через addEventListener
            el.addEventListener('paste', preventDefault, true);
            el.addEventListener('copy', preventDefault, true);
            el.addEventListener('cut', preventDefault, true);
            el.addEventListener('keydown', preventDefault, true);
            el.addEventListener('keypress', preventDefault, true);

            disabledCount++;

            // Визуальная индикация
            el.style.boxShadow = '0 0 0 2px #4CAF50';

            // Возвращаем через 5 секунд
            setTimeout(() => {
                el.style.boxShadow = '';
                el.removeEventListener('paste', preventDefault, true);
                el.removeEventListener('copy', preventDefault, true);
                el.removeEventListener('cut', preventDefault, true);
                el.removeEventListener('keydown', preventDefault, true);
                el.removeEventListener('keypress', preventDefault, true);

                if (el.dataset.originalOnpaste === 'true') el.onpaste = originalOnpaste;
                if (el.dataset.originalOncopy === 'true') el.oncopy = originalOncopy;
                if (el.dataset.originalOncut === 'true') el.oncut = originalOncut;
                if (el.dataset.originalOnkeydown === 'true') el.onkeydown = originalOnkeydown;
                if (el.dataset.originalOnkeypress === 'true') el.onkeypress = originalOnkeypress;
            }, 5000);
        });

        function preventDefault(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        }

        showNotification(`⛔ Отключены обработчики на ${disabledCount} элементах на 5 секунд`);
    }

    // Вставить шаблон
    function pasteTemplate() {
        const template = document.getElementById('template-text').value;

        if (!template) {
            showNotification('⚠️ Введите шаблон для вставки');
            return;
        }

        // Пытаемся использовать сохраненный элемент
        let targetElement = lastFocusedElement || document.activeElement;

        if (!targetElement || !isInputElement(targetElement)) {
            showNotification('⚠️ Сначала выберите поле ввода');
            return;
        }

        // Восстанавливаем фокус
        targetElement.focus();

        // Более медленная симуляция для шаблонов
        setTimeout(() => {
            simulateTyping(targetElement, template);
        }, 100);
    }

    // Функция перетаскивания
    function makeDraggable(element) {
        const header = document.getElementById('anti-fraud-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.id === 'anti-fraud-minimize') return;

            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            header.style.opacity = '0.9';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                currentX = Math.max(10, Math.min(currentX, window.innerWidth - element.offsetWidth - 10));
                currentY = Math.max(10, Math.min(currentY, window.innerHeight - element.offsetHeight - 10));

                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
                element.style.right = 'auto';
            }
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            header.style.opacity = '1';
        }
    }

    // Всплывающие уведомления
    function showNotification(message) {
        // Удаляем старое уведомление
        const oldNotification = document.getElementById('anti-fraud-notification');
        if (oldNotification) oldNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'anti-fraud-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1000000;
            font-family: 'SF Pro Text', sans-serif;
            font-size: 13px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // Добавляем стили для анимации
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Инициализация
    setTimeout(() => {
        createHelperWindow();
        createToggleButton();
        trackLastFocusedElement();

        showNotification('🔓 Anti-Fraud Helper v2 загружен');
        showNotification('📝 Кликните в поле ввода, затем используйте кнопки в окне');
    }, 1000);
})();