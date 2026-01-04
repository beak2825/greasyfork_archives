// ==UserScript==
// @name         Лайки shift+R
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Автоматическое нажатие на кнопки лайков с задержкой
// @author       You
// @match        https://remanga.org/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/549779/%D0%9B%D0%B0%D0%B9%D0%BA%D0%B8%20shift%2BR.user.js
// @updateURL https://update.greasyfork.org/scripts/549779/%D0%9B%D0%B0%D0%B9%D0%BA%D0%B8%20shift%2BR.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ Скрипт "Лайки" загружен');

    // Функция задержки
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Функция: искать кнопки лайков и нажимать их с задержкой
    async function clickLikeButtons() {
        const buttons = document.querySelectorAll('button[data-testid^="like_btn_"]');

        if (buttons.length > 0) {
            console.log(`🔘 Найдено кнопок: ${buttons.length}`);
            for (const button of buttons) {
                button.click();
                await delay(500); // Задержка 10 мс
            }
        } else {
            console.log('⌛ Кнопки не найдены. Жду...');
            setTimeout(clickLikeButtons, 1000); // Повторить через 1 сек
        }
    }

    // Обработка нажатия Shift + R
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'r' && e.shiftKey) {
            console.log('🚀 Нажаты Shift + R — запускаю скрипт');
            clickLikeButtons();
        }
    });
})();
