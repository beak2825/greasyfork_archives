// ==UserScript==
// @name         Google AI Studio: Citation Eraser v14.0
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Полностью стирает скобки [] и ][ вокруг источников.
// @author       torch
// @match        https://aistudio.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556411/Google%20AI%20Studio%3A%20Citation%20Eraser%20v140.user.js
// @updateURL https://update.greasyfork.org/scripts/556411/Google%20AI%20Studio%3A%20Citation%20Eraser%20v140.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLEANER_CLASS = 'gs-eraser-active';
    const BTN_ID = 'gs-eraser-btn';

    // --- 1. CSS (Только для ссылок и панелей) ---
    // Текстовые скобки мы будем удалять JS-ом, поэтому CSS для них не нужен.
    const cssContent = `
        /* Скрываем ссылки-источники (цифры) */
        body.${CLEANER_CLASS} a[href*="grounding-api-redirect"],
        body.${CLEANER_CLASS} a[href*="vertexaisearch"] {
            display: none !important;
        }

        /* Скрываем нижние панели */
        body.${CLEANER_CLASS} ms-grounding-sources,
        body.${CLEANER_CLASS} ms-search-entry-point {
            display: none !important;
        }

        /* Кнопка */
        #${BTN_ID} {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 2147483647;
            background: #202124;
            color: #e8eaed;
            border: 1px solid #5f6368;
            border-radius: 8px;
            padding: 8px 12px;
            font-family: Roboto, sans-serif;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
        }
        #${BTN_ID}:hover { background: #3c4043; }
        #${BTN_ID}.active {
            background: #0b57d0;
            color: #fff;
            border-color: #0b57d0;
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);


    // --- 2. ФУНКЦИЯ УДАЛЕНИЯ СКОБОК ИЗ ТЕКСТА ---
    function eraseBrackets() {
        // Ищем ссылки (даже если они скрыты CSS, они есть в DOM)
        const links = document.querySelectorAll('a[href*="grounding-api-redirect"], a[href*="vertexaisearch"]');

        links.forEach(link => {
            // --- ШАГ 1: Чистим СЛЕВА ---
            let prev = link.previousSibling;
            // Пропускаем пустые узлы или комментарии, ищем ближайший текст
            while (prev && (prev.nodeType === Node.COMMENT_NODE || (prev.nodeType === Node.TEXT_NODE && !prev.textContent.trim()))) {
                prev = prev.previousSibling;
            }

            // Если нашли текст или элемент содержащий текст
            if (prev) {
                let textNode = (prev.nodeType === Node.TEXT_NODE) ? prev : (prev.lastChild && prev.lastChild.nodeType === Node.TEXT_NODE ? prev.lastChild : null);

                if (textNode) {
                    let text = textNode.textContent;
                    // Если в конце текста есть "[" или "][" - удаляем
                    if (/(\[|\]\[)\s*$/.test(text)) {
                        textNode.textContent = text.replace(/(\[|\]\[)\s*$/, '');
                    }
                }
            }

            // --- ШАГ 2: Чистим СПРАВА ---
            let next = link.nextSibling;
            while (next && (next.nodeType === Node.COMMENT_NODE || (next.nodeType === Node.TEXT_NODE && !next.textContent.trim()))) {
                next = next.nextSibling;
            }

            if (next) {
                let textNode = (next.nodeType === Node.TEXT_NODE) ? next : (next.firstChild && next.firstChild.nodeType === Node.TEXT_NODE ? next.firstChild : null);

                if (textNode) {
                    let text = textNode.textContent;
                    // Если в начале текста есть "]" или "][" - удаляем
                    if (/^\s*(\]|\]\[)/.test(text)) {
                         textNode.textContent = text.replace(/^\s*(\]|\]\[)/, '');
                    }
                }
            }
        });
    }


    // --- 3. КНОПКА ---
    function initButton() {
        if (document.getElementById(BTN_ID)) return;

        const btn = document.createElement('div'); // div безопаснее button в формах
        btn.id = BTN_ID;

        const isEnabled = localStorage.getItem('gs_eraser_v14') !== 'false'; // Default ON
        btn.textContent = isEnabled ? 'Clean: ON' : 'Clean: OFF';

        if (isEnabled) {
            btn.classList.add('active');
            document.body.classList.add(CLEANER_CLASS);
        }

        btn.onclick = (e) => {
            e.stopPropagation();
            const newState = document.body.classList.toggle(CLEANER_CLASS);
            btn.classList.toggle('active', newState);
            btn.textContent = newState ? 'Clean: ON' : 'Clean: OFF';
            localStorage.setItem('gs_eraser_v14', newState);

            if (newState) eraseBrackets();
        };

        document.body.appendChild(btn);
    }

    // --- 4. ЗАПУСК ---
    // Запускаем очень часто (каждые 300мс), чтобы ловить стриминг текста
    setInterval(() => {
        initButton();

        // Если режим включен - чистим текст
        if (document.body.classList.contains(CLEANER_CLASS)) {
            eraseBrackets();
        }
    }, 300);

})();