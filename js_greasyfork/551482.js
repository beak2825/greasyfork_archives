// ==UserScript==
// @name         YouTube - Скрыть "Мини-проигрыватель" в меню
// @name:en      YouTube - Hide "Mini-player" Context Menu Item
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Находит и скрывает пункт "Мини-проигрыватель" в контекстном меню (правый клик) видеоплеера YouTube.
// @description:en Hides the "Mini-player" item from the context menu (right-click) on the YouTube video player.
// @author       torch
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551482/YouTube%20-%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%22%D0%9C%D0%B8%D0%BD%D0%B8-%D0%BF%D1%80%D0%BE%D0%B8%D0%B3%D1%80%D1%8B%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%22%20%D0%B2%20%D0%BC%D0%B5%D0%BD%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/551482/YouTube%20-%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%22%D0%9C%D0%B8%D0%BD%D0%B8-%D0%BF%D1%80%D0%BE%D0%B8%D0%B3%D1%80%D1%8B%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%22%20%D0%B2%20%D0%BC%D0%B5%D0%BD%D1%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Текст пункта меню, который нужно скрыть.
    // Если у вас другой язык интерфейса, просто замените этот текст.
    const menuItemText = 'Мини-проигрыватель';

    // Функция, которая находит и скрывает элемент
    const hideElement = () => {
        // Ищем все пункты меню в плеере
        const menuItems = document.querySelectorAll('.ytp-popup.ytp-contextmenu .ytp-menuitem');

        for (const item of menuItems) {
            // Ищем текстовую метку внутри пункта меню
            const label = item.querySelector('.ytp-menuitem-label');
            if (label && label.textContent.trim() === menuItemText) {
                // Если текст совпадает, скрываем весь пункт меню
                if (item.style.display !== 'none') {
                    item.style.display = 'none';
                    // Можно добавить console.log для отладки, чтобы убедиться, что скрипт сработал
                    // console.log('Пункт "Мини-проигрыватель" скрыт.');
                }
                break; // Выходим из цикла, так как нужный элемент найден
            }
        }
    };

    // YouTube - это одностраничное приложение (SPA),
    // поэтому меню создается динамически.
    // MutationObserver - лучший способ отследить его появление.
    const observer = new MutationObserver((mutations) => {
        // Каждый раз, когда в DOM что-то меняется, мы ищем наше меню.
        // Это эффективно и надежно.
        hideElement();
    });

    // Начинаем наблюдение за всем <body>,
    // так как меню добавляется в конец документа.
    observer.observe(document.body, {
        childList: true, // Следить за добавлением/удалением дочерних элементов
        subtree: true    // Следить во всех вложенных элементах
    });

    // Также запускаем функцию один раз при старте на всякий случай
    hideElement();
})();