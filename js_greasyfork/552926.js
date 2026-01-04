// ==UserScript==
// @name         Kunic_new
// @namespace    http://tampermonkey.net/
// @author       AnimeHeHe
// @version 1.0
// @match        https://lolz.live/account/uniq
// @description пупупу
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552926/Kunic_new.user.js
// @updateURL https://update.greasyfork.org/scripts/552926/Kunic_new.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Шаблоны для кнопок
    const initialTemplates = {
        'username_css': ['', '', '', '', ''],
        'banner_css': ['', '', '', '', ''],
        'username_icon': ['', '', '', '', ''],
        'banner_icon': ['', '', '', '', '']
    };

    // Цвета кнопок
    const colors = {
        buttonDefault: '#2BAD72',
        buttonActive: '#272727',
        buttonHover: '#45a049',
        saveButton: '#363636',
        clearButton: '#884444',
        textColor: '#d6d6d6',
        counterColor: '#2BAD72'
    };

    // Стили шрифта
    const fontFamily = "-apple-system, BlinkMacSystemFont, 'Open Sans', Helvetica Neue, sans-serif";

    function getTemplates(fieldName) {
        const saved = localStorage.getItem(`iconTemplates_${fieldName}`);
        return saved ? JSON.parse(saved) : [...initialTemplates[fieldName]];
    }

    function saveTemplates(fieldName, templates) {
        localStorage.setItem(`iconTemplates_${fieldName}`, JSON.stringify(templates));
    }

    function safeSetTextareaValue(textarea, value) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const scrollTop = textarea.scrollTop;

        textarea.value = value;

        textarea.selectionStart = start;
        textarea.selectionEnd = end;
        textarea.scrollTop = scrollTop;

        setTimeout(() => {
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            setTimeout(() => {
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }, 50);
        }, 10);
    }

    function updateButtonBehavior(button, template, textarea, fieldName) {
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const container = button.closest('.template-buttons-container');
            const activeButton = container.querySelector('.active-template-button');
            if (activeButton) {
                activeButton.style.background = colors.buttonDefault;
                activeButton.classList.remove('active-template-button');
            }

            button.style.background = colors.buttonActive;
            button.classList.add('active-template-button');

            safeSetTextareaValue(textarea, template);
            textarea.focus();

            if (textarea.name === 'username_icon') {
                updateCharacterCounter(textarea);
            }
        };
    }

    function createButtonsForTextarea(textarea) {
        const textareaContainer = textarea.closest('.editor-item') || textarea.parentElement;
        if (!textareaContainer) return;

        const fieldName = textarea.name;

        if (!initialTemplates[fieldName]) return;

        if (textareaContainer.querySelector('.template-buttons-container')) return;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'template-buttons-container';
        buttonsContainer.dataset.fieldName = fieldName;
        buttonsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
            align-items: center;
            font-family: ${fontFamily};
        `;

        const templates = getTemplates(fieldName);

        templates.forEach((template, index) => {
            const button = document.createElement('button');
            button.textContent = `${index + 1}`;
            button.dataset.index = index;
            button.title = `Шаблон ${index + 1} (${fieldName})`;
            button.style.cssText = `
                padding: 6px 10px;
                background: ${colors.buttonDefault};
                color: ${colors.textColor};
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                min-width: 30px;
                font-family: ${fontFamily};
            `;

            button.onmouseover = () => {
                if (!button.classList.contains('active-template-button')) {
                    button.style.background = colors.buttonHover;
                }
            };

            button.onmouseout = () => {
                if (!button.classList.contains('active-template-button')) {
                    button.style.background = colors.buttonDefault;
                }
            };

            updateButtonBehavior(button, template, textarea, fieldName);

            buttonsContainer.appendChild(button);
        });

        const firstButton = buttonsContainer.querySelector('button');
        if (firstButton) {
            firstButton.style.background = colors.buttonActive;
            firstButton.classList.add('active-template-button');

            if (templates[0] && !textarea.value.trim()) {
                safeSetTextareaValue(textarea, templates[0]);
            }
        }

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';
        saveButton.style.cssText = `
            padding: 6px 10px;
            background: ${colors.saveButton};
            color: ${colors.textColor};
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 10px;
            font-family: ${fontFamily};
            font-weight: bold;
        `;
        saveButton.onmouseover = () => saveButton.style.background = '#454545';
        saveButton.onmouseout = () => saveButton.style.background = colors.saveButton;
        saveButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const activeButton = buttonsContainer.querySelector('.active-template-button');
            if (!activeButton) {
                showNotification('Сначала выберите номер шаблона!', 'error');
                return;
            }

            if (!textarea.value.trim()) {
                showNotification('Поле не может быть пустым!', 'error');
                return;
            }

            const index = parseInt(activeButton.dataset.index);
            const templates = getTemplates(fieldName);
            const newTemplate = textarea.value;

            templates[index] = newTemplate;
            saveTemplates(fieldName, templates);

            updateButtonBehavior(activeButton, newTemplate, textarea, fieldName);

            showNotification(`сохранено!`);
        };

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Очистить';
        clearButton.style.cssText = `
            padding: 6px 10px;
            background: ${colors.clearButton};
            color: ${colors.textColor};
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-family: ${fontFamily};
            font-weight: bold;
        `;
        clearButton.onmouseover = () => clearButton.style.background = '#773333';
        clearButton.onmouseout = () => clearButton.style.background = colors.clearButton;
        clearButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            safeSetTextareaValue(textarea, '');
            textarea.focus();

            if (textarea.name === 'username_icon') {
                updateCharacterCounter(textarea);
            }
        };

        buttonsContainer.appendChild(saveButton);
        buttonsContainer.appendChild(clearButton);

        textarea.parentNode.insertBefore(buttonsContainer, textarea.nextSibling);

        if (textarea.name === 'username_icon') {
            createCharacterCounter(textarea);
        }

        console.log(`Созданы кнопки для поля: ${fieldName}`);
    }

    // Функция для обновления счетчика символов
    function updateCharacterCounter(textarea) {
        const description = textarea.closest('.editor-item')?.querySelector('.editor-description.lztng-xcfsvl');
        if (!description) return;

        // Удаляем старый счетчик если есть
        const oldCounter = description.querySelector('.char-counter');
        if (oldCounter) {
            oldCounter.remove();
        }

        const text = textarea.value;

        // ЗАМЕНА: Считаем множественные пробелы как 1
        const normalizedText = text.replace(/ +/g, ' '); // Заменяем множественные пробелы на один
        const currentLength = normalizedText.length;

        const maxLength = 5000;
        const remaining = maxLength - currentLength;

        const counter = document.createElement('span');
        counter.className = 'char-counter';
        counter.textContent = ` ${remaining}`;
        counter.style.cssText = `
        color: ${colors.counterColor};
        font-weight: bold;
        margin-left: 5px;
        font-family: ${fontFamily};
    `;

        // Добавляем счетчик к описанию
        description.appendChild(counter);
    }

    function createCharacterCounter(textarea) {
        if (textarea.name !== 'username_icon') return;

        updateCharacterCounter(textarea);

        textarea.addEventListener('input', () => {
            updateCharacterCounter(textarea);
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            font-family: ${fontFamily};
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function processAllTextareas() {
        const allTextareas = document.querySelectorAll('textarea.textCtrl.code-editor.lztng-n2rvjg');

        console.log(`Найдено текстовых полей: ${allTextareas.length}`);

        allTextareas.forEach((textarea, index) => {
            const fieldName = textarea.name;
            console.log(`Поле ${index + 1}: ${fieldName}, значение: "${textarea.value}"`);

            if (fieldName && initialTemplates[fieldName]) {
                createButtonsForTextarea(textarea);
            } else {
                console.log(`Поле ${fieldName} не поддерживается`);
            }
        });
    }

    function init() {
        console.log('Инициализация скрипта...');

        processAllTextareas();

        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {

                            if (node.classList?.contains('editor-container') ||
                                node.classList?.contains('editor-item') ||
                                (node.querySelector && (
                                    node.querySelector('.editor-container') ||
                                    node.querySelector('.editor-item') ||
                                    node.querySelector('textarea.textCtrl.code-editor.lztng-n2rvjg')
                                ))) {
                                shouldProcess = true;
                                console.log('Обнаружено изменение DOM, перезапускаем обработку');
                            }

                            if (node.nodeName === 'TEXTAREA' &&
                                node.classList.contains('textCtrl') &&
                                node.classList.contains('code-editor') &&
                                node.classList.contains('lztng-n2rvjg') &&
                                node.name) {
                                shouldProcess = true;
                                console.log('Обнаружен новый textarea:', node.name);
                            }
                        }
                    }
                }
            }

            if (shouldProcess) {
                setTimeout(() => {
                    processAllTextareas();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let currentUrl = location.href;
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                console.log('Обнаружено изменение URL, перезапускаем обработку');
                setTimeout(() => {
                    processAllTextareas();
                }, 1000);
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();