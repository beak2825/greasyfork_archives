// ==UserScript==
// @name         Clean Perverzija
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes ads, trackers, social media buttons, and other clutter from tube.perverzija.com for a faster, cleaner experience.
// @author       111
// @match        *://tube.perverzija.com/*
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/552942/Clean%20Perverzija.user.js
// @updateURL https://update.greasyfork.org/scripts/552942/Clean%20Perverzija.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanPage() {
        // Список селекторов элементов, которые нужно полностью удалить
        const selectorsToRemove = [
            // Реклама, трекеры и аналитика
            'script[src*="wpadmngr.com"]',
            'script[src*="udzpel.com"]',
            'script[src*="googletagmanager.com"]',
            'script[id*="monsterinsights"]',
            '.bg-ad',
            '.bg-ad-left',
            '.bg-ad-right',

            // Скрипт против инструментов разработчика
            'script[src*="disable-devtool"]',

            // Обфусцированные (скрытые) скрипты
            'script[src^="data:text/javascript;base64,"]',

            // Ненужные элементы интерфейса
            '#top-nav',          // Верхняя панель навигации
            '#headline',         // Строка с "хлебными крошками" и соц. кнопками
            '#sidebar',          // Боковая панель
            'footer',            // Подвал
            '#bottom',           // Нижняя часть подвала
            '#off-canvas',       // Боковое меню для мобильных
            '#gototop',          // Кнопка "Наверх"
            '.wrap-overlay',
            '#reportModal',      // Модальное окно для жалоб

            // Лишние элементы на странице с видео
            '.related-single',
            '#comments',
            '.simple-navigation', // Кнопки "Предыдущее/Следующее видео"
            '.item-tax-list',     // Список тегов, актеров и т.д.
            '.box-title',         // Заголовок видео
            '.xs-related-section',// Все секции с похожими видео
            '#video-toolbar .tm-share-this',
            '#video-toolbar .tm-report',
            '#video-toolbar .wpfp-span', // "В избранное"
            '#video-toolbar #link',      // Ссылка на избранное
            '#video-toolbar .download-button',
            '#top-carousel',     // Карусель "More vids" под плеером
            '.tm-multilink',     // Кнопки выбора плеера
            '.widget'            // Все виджеты
        ];

        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // Применяем стили для корректировки макета и скрытия элементов, которые могут появиться снова
    function applyStyles() {
        const css = `
            body, #body-wrap, #wrap, .container {
                padding: 0 !important;
                margin: 0 auto !important;
                max-width: 100% !important;
                background-image: none !important;
                background-color: #000 !important;
            }
            #content {
                width: 100% !important;
                padding: 0 !important;
            }
            .single-inbox, .player-layout-inbox, .player-content {
                padding: 0 !important;
                margin: 0 !important;
            }
            #player {
                margin-bottom: 0 !important;
            }
            .video-player {
                border: none;
            }
            .video-toolbar-inner {
                justify-content: center;
            }
            /* Гарантированно скрываем всё лишнее */
            #sidebar, footer, #bottom-nav, #headline, #top-nav, .social-links, .widget {
                display: none !important;
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // Запускаем очистку сразу
    applyStyles();
    cleanPage();

    // Используем MutationObserver для отслеживания и удаления элементов,
    // которые загружаются динамически после αρχικής загрузки страницы.
    const observer = new MutationObserver((mutations) => {
        let needsCleaning = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                needsCleaning = true;
                break;
            }
        }
        if (needsCleaning) {
            cleanPage();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();