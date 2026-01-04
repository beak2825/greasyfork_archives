// ==UserScript==
// @name         Google AI Studio - Исправление выделения (ФИНАЛ)
// @name:en      Google AI Studio - Mouse Selection Fix (FINAL)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Исправляет выделение текста мышью в Google AI Studio с помощью CSS-метода "pointer-events".
// @description:en Fixes mouse text selection in Google AI Studio using the "pointer-events" CSS method.
// @author       torch
// @match        https://aistudio.google.com/prompts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553870/Google%20AI%20Studio%20-%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%28%D0%A4%D0%98%D0%9D%D0%90%D0%9B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553870/Google%20AI%20Studio%20-%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%28%D0%A4%D0%98%D0%9D%D0%90%D0%9B%29.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    console.log('[AI Studio Fix v5] Скрипт запущен. Метод: "Призрачный клик".');

    GM_addStyle(`
        /* 1. Делаем ВЕСЬ блок с сообщением "прозрачным" для мыши */
        ms-chat-turn .chat-turn-container {
            pointer-events: none !important;
        }

        /* 2. А теперь "включаем" обратно только нужные нам элементы ВНУТРИ блока */

        /* Включаем сам текст */
        ms-chat-turn .very-large-text-container,
        ms-chat-turn pre,
        ms-chat-turn code,
        ms-chat-turn a { /* Также включаем ссылки, чтобы по ним можно было кликать */
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
        }

        /* Включаем кнопки действий (редактировать, повторить и т.д.) */
        ms-chat-turn .actions-container,
        ms-chat-turn .actions-container button,
        ms-chat-turn .turn-footer button {
            pointer-events: auto !important;
        }

        /* Включаем скроллбар справа */
        ms-prompt-scrollbar {
            pointer-events: auto !important;
        }
    `);

    console.log('[AI Studio Fix v5] CSS-правила применены. Проверьте выделение текста.');

})();