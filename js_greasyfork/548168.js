// ==UserScript==
// @name         Машинный русификатор сайта G4F.
// @namespace    http://tampermonkey.net/
// @version      0.9
// @license      MIT
// @description  Переводит на русский интерфейс сайта G4F.
// @author       MrVovchick
// @match        http://localhost:8080/chat/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548168/%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%80%D1%83%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20G4F.user.js
// @updateURL https://update.greasyfork.org/scripts/548168/%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%80%D1%83%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20G4F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        'Settings': 'Настройки',
        'Enable Dark Mode': 'Включить тёмную тему',
        'Web Access with DuckDuckGo': 'Поиск через DuckDuckGo',
        'Disable Conversation History': 'Отключить историю бесед',
        'Hide System Prompt': 'Скрыть системный промпт',
        'Download Generated Media': 'Скачивать сгенерированные медиафайлы',
        'Refine Files with spaCy': 'Обрабатывать файлы с помощью spaCy',
        'Report Errors': 'Сообщать об ошибках',
        'Count Words and Tokens': 'Подсчитывать слова и токены',
        'Automatic Orientation (16:9 or 9:16)': 'Автоматическая ориентация (16:9 или 9:16)',
        'System Prompt': 'Системный промпт',
        'You are a helpful assistant.': 'Вы — полезный помощник.',
        'Input Max Height (px)': 'Максимальная высота ввода',
        'Speech Recognition Language': 'Язык распознавания речи',
        'Providers API key': 'API-ключ провайдера',
        'Clear Conversations': 'Очистить беседы',
        'Export Conversations': 'Экспортировать беседы',
        'Export Settings': 'Экспортировать настройки',
        'Translate UI': 'Перевести интерфейс',
        'Delete Translations': 'Удалить переводы',
        'Show log': 'Показать журнал',
        'G4F Chat': 'Чат G4F',
        'New Conversation': 'Новая беседа',
        'Private Conversation': 'Приватная беседа',
        'Open Settings': 'Открыть настройки',
        'Regenerate': 'Сгенерировать заново',
        'Type a message...': 'Введите сообщение...',
        'Add': 'Добавить',
        'Send': 'Отправить',
        'Hello! How can I assist you today?': 'Здравствуйте! Чем я могу вам помочь сегодня?',
        'Provider: Auto': 'Провайдер: Авто',
        'Custom': 'Настроить',
        'support ~': 'поддержка ~ ',
        'Customize the AI\'s system prompt to personalize responses or enable features like image generation.': 'Настройте системный промт для ИИ, чтобы персонализировать ответы или включить такие функции, как генерация изображений.',
        'Get API key': 'Получить API ключ',
        'Providers (Enable/Disable)': 'Провайдеры (Включить/Выключить)',
        'Stop Generating': 'Остановить генерацию',
        'Microsoft Designer Bing Cookie (_U)': 'Куки Microsoft Designer в Bing (_U)',
        'System prompt': 'Системный промпт',







        'Shader': 'Шейдер'  // Добавлено по примеру
    };

    // Сортируем ключи по убыванию длины, чтобы длинные фразы обрабатывались раньше коротких
    const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

    function translateText(node) {
        // Обработка текстовых узлов
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.textContent;
            const trimmed = original.trim();
            if (trimmed === '') return; // Пропустить пустые

            for (const [en, ru] of sortedTranslations) {
                if (trimmed === en) {
                    node.textContent = original.replace(trimmed, ru);
                    break;
                }
            }
        }
        // Обработка элементов
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Обработка атрибутов title и placeholder
            ['title', 'placeholder'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    const original = node.getAttribute(attr);
                    const trimmed = original.trim();
                    if (trimmed === '') return;

                    for (const [en, ru] of sortedTranslations) {
                        if (trimmed === en) {
                            node.setAttribute(attr, original.replace(trimmed, ru));
                            break;
                        }
                    }
                }
            });

            // Рекурсивная обработка дочерних элементов
            node.childNodes.forEach(translateText);
        }
    }

    function translateDocument() {
        if (document.body) {
            translateText(document.body);
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        translateText(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                translateText(mutation.target);
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true
    });

    if (document.readyState !== 'loading') {
        translateDocument();
    } else {
        document.addEventListener('DOMContentLoaded', translateDocument);
    }

})();