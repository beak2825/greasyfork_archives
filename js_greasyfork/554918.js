// ==UserScript==
// @name         Снести Сайдбар (yummyani.me) - V2.0 Aggressive
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Сносит  весь правый сайдбар yummyanime. Версия для React-сайта.
// @author       ImFox
// @match        *://yummyani.me/*
// @match        *://*.yummyani.me/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554918/%D0%A1%D0%BD%D0%B5%D1%81%D1%82%D0%B8%20%D0%A1%D0%B0%D0%B9%D0%B4%D0%B1%D0%B0%D1%80%20%28yummyanime%29%20-%20V20%20Aggressive.user.js
// @updateURL https://update.greasyfork.org/scripts/554918/%D0%A1%D0%BD%D0%B5%D1%81%D1%82%D0%B8%20%D0%A1%D0%B0%D0%B9%D0%B4%D0%B1%D0%B0%D1%80%20%28yummyanime%29%20-%20V20%20Aggressive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Заряжаем пушку против сайдбара...');

    function nukeSidebar() {
        // Ищем пидоров по всем возможным приметам:
        // 1. Тег <aside> (стандарт HTML для боковух)
        // 2. Любой div, у которого в классе есть слово sidebar (без учета регистра)
        // 3. Часто рекламные колонки называют col-right или типа того
        const targets = document.querySelectorAll('aside, div[class*="sidebar"], div[class*="Sidebar"], .col-right, .right-col');

        if (targets.length > 0) {
            targets.forEach(el => {
                // Проверяем, чтобы не снести что-то важное (например, если оно слишком широкое, то это не сайдбар)
                // Сайдбары обычно узкие, меньше 400px
                if (el.offsetWidth > 0 && el.offsetWidth < 500) {
                    console.log('НАШЕЛ ГАДА:', el);
                    el.remove();
                    console.log('САЙДБАР ОТПРАВЛЕН В АД.');
                }
            });
        }
    }

    // Так как сайт на React, элементы могут появляться и исчезать когда угодно.
    // Поэтому мы не останавливаем проверку, а долбим постоянно.
    // Это почти не грузит комп, не ссы.
    const cleanerInterval = setInterval(nukeSidebar, 500);

    // На всякий случай, чтобы через 10 секунд успокоиться, если страница статичная (опционально)
    // Но для SPA лучше оставить работать вечно или пока не перейдем на другую страницу.
    // Я оставлю вечный цикл, так надежнее для React-помоек.

    // Первая зачистка
    setTimeout(nukeSidebar, 1000);
})();