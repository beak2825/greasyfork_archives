// ==UserScript==
// @name         JanitorAI - Авто-свайп вправо
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически нажимает кнопку 'вправо' для генерации нового ответа, как только она появляется.
// @author       Вы (создано AI)
// @match        *://janitorai.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550794/JanitorAI%20-%20%D0%90%D0%B2%D1%82%D0%BE-%D1%81%D0%B2%D0%B0%D0%B9%D0%BF%20%D0%B2%D0%BF%D1%80%D0%B0%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/550794/JanitorAI%20-%20%D0%90%D0%B2%D1%82%D0%BE-%D1%81%D0%B2%D0%B0%D0%B9%D0%BF%20%D0%B2%D0%BF%D1%80%D0%B0%D0%B2%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    // Селектор для кнопки "вправо". aria-label гораздо надежнее, чем классы, которые могут меняться.
    const RIGHT_BUTTON_SELECTOR = 'button[aria-label="Next"]';
    // Интервал проверки в миллисекундах (1000 мс = 1 секунда).
    const CHECK_INTERVAL_MS = 3000;
    // --- КОНЕЦ НАСТРОЕК ---

    /**
     * Функция, которая ищет кнопку и нажимает на нее, если находит.
     */
    function findAndClickButton() {
        // Ищем кнопку на странице по нашему селектору
        const rightButton = document.querySelector(RIGHT_BUTTON_SELECTOR);

        // Если кнопка найдена...
        if (rightButton) {
            console.log('[Авто-свайп] Кнопка "вправо" найдена. Нажимаю...');
            // ...нажимаем на нее
            rightButton.click();
        }
    }

    // Запускаем периодическую проверку с заданным интервалом.
    // Функция findAndClickButton будет вызываться снова и снова, пока скрипт активен.
    setInterval(findAndClickButton, CHECK_INTERVAL_MS);

    // Выводим сообщение в консоль, чтобы вы знали, что скрипт успешно запущен.
    // Чтобы открыть консоль, нажмите F12 и перейдите на вкладку "Console".
    console.log(`[Авто-свайп] Скрипт запущен. Проверка наличия кнопки каждые ${CHECK_INTERVAL_MS / 1000} сек.`);

})();