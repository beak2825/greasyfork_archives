// ==UserScript==
// @name         YouTube - CSS Оптимизатор
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @version 1
// @license MIT
// @namespace YouTubeCSS
// @description CSS Оптимизатор
// @downloadURL https://update.greasyfork.org/scripts/553031/YouTube%20-%20CSS%20%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/553031/YouTube%20-%20CSS%20%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Скрываем элементы с помощью CSS еще до того, как они загрузятся
    // Это эффективнее, чем удаление через JS
    GM_addStyle(`
        /* Скрываем полку с Shorts */
        ytd-rich-shelf-renderer[is-shorts] {
            display: none !important;
        }

        /* Скрываем рекламу */
        ytd-promoted-sparkles-web-renderer,
        ytd-ad-slot-renderer,
        #player-ads {
            display: none !important;
        }

        /* Предотвращаем загрузку шрифтов Google Fonts */
        @font-face {
            font-family: 'Roboto';
            src: local('Arial'); /* Подменяем на локальный шрифт */
        }
        @font-face {
            font-family: 'YouTube Sans';
            src: local('Arial'); /* Подменяем на локальный шрифт */
        }
    `);
})();