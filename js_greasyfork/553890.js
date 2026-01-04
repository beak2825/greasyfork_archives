// ==UserScript==
// @name         Google AI Studio - Универсальный Исправлятор (ФИНАЛ)
// @name:en      Google AI Studio - Universal Fixer (FINAL)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Исправляет выделение текста, преобразует ссылки-цитаты и добавляет яркую рамку при наведении на весь блок.
// @description:en Fixes text selection, converts citation links, and adds a highlight border on hover for the entire block.
// @author       torch
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553890/Google%20AI%20Studio%20-%20%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%28%D0%A4%D0%98%D0%9D%D0%90%D0%9B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553890/Google%20AI%20Studio%20-%20%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%28%D0%A4%D0%98%D0%9D%D0%90%D0%9B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[AI Studio Fix v9.0] Универсальный скрипт запущен.');

    // --- ЧАСТЬ 1: СТИЛИ ---
    GM_addStyle(`
        /* --- Стиль для яркой рамки при наведении на ВЕСЬ блок --- */
        /* :hover применяется к ms-chat-turn, а стили к его дочернему элементу .chat-turn-container */
        ms-chat-turn:hover .chat-turn-container,
        ms-chat-turn .chat-turn-container.cdk-keyboard-focused,
        ms-chat-turn .chat-turn-container:focus-within
        {
            border-color: #8ab4f8 !important; /* Яркий синий цвет от Google */
            box-shadow: 0 0 8px rgba(138, 180, 248, 0.4); /* Мягкое свечение */
        }

        /*
         * --- ИСПРАВЛЕНИЕ ВЫДЕЛЕНИЯ v9.0 ---
         * Блок стилей с 'pointer-events: none' был полностью удален.
         * Он был причиной невозможности выделить текст.
         * Эффект рамки при наведении работает корректно и без него.
        */

        /* --- Стили для ссылок-цитат --- */
        .userscript-citation-link {
            display: inline-block;
            background-color: #3c4043;
            color: #e8eaed !important;
            padding: 0px 7px;
            border-radius: 4px;
            text-decoration: none !important;
            font-size: 11px !important;
            font-family: inherit;
            line-height: 16px;
            margin: 0 2px;
            vertical-align: super;
            transition: background-color 0.2s;
            pointer-events: auto !important;
        }
        .userscript-citation-link:hover {
            background-color: #5f6368;
            text-decoration: none !important;
        }
    `);
    console.log('[AI Fix v9.0] CSS-правила применены.');


    // --- ЧАСТЬ 2: ЛОГИКА ИСПРАВЛЕНИЯ ССЫЛОК ---
    function fixLinksInNode(node) {
        // Ищем только в блоках ответа модели
        const turnContainers = node.querySelectorAll('ms-chat-turn.model');
        if (turnContainers.length === 0) return;

        // Регулярное выражение для поиска специфичного паттерна ссылок Gemini
        const geminiLinkRegex = /\[\[(\d+)\]\]\(&lt;a href="([^"]+)"[^>]*&gt;[^<]+&lt;\/a&gt;\)/g;

        turnContainers.forEach(container => {
            // Проверяем, не обработан ли уже этот блок
            if (container.getAttribute('data-links-fixed')) return;

            // Проверяем наличие паттерна перед тем, как делать замену
            if (geminiLinkRegex.test(container.innerHTML)) {
                console.log('[AI Fix v9.0] Найдена ссылка-цитата! Произвожу замену в:', container);
                const replacementHTML = '<a href="$2" target="_blank" rel="noopener noreferrer" class="userscript-citation-link">$1</a>';
                // Заменяем все вхождения в блоке
                container.innerHTML = container.innerHTML.replace(geminiLinkRegex, replacementHTML);
                // Помечаем блок как обработанный
                container.setAttribute('data-links-fixed', 'true');
            }
        });
    }


    // --- ЧАСТЬ 3: OBSERVER (Следит за изменениями на странице) ---
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // Проверяем, что это элемент, а не просто текст
                    if (node.nodeType === 1) {
                        fixLinksInNode(node);
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // --- ЧАСТЬ 4: ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК ---
    // Запускаем с задержкой, чтобы страница успела прогрузиться
    setTimeout(() => {
        console.log('[AI Fix v9.0] Первоначальное сканирование страницы...');
        fixLinksInNode(document.body);
    }, 2000);

})();