// ==UserScript==
// @name         TikTok Clean-up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  tiktok optimizer
// @author       torch
// @match        https://www.tiktok.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555960/TikTok%20Clean-up.user.js
// @updateURL https://update.greasyfork.org/scripts/555960/TikTok%20Clean-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        /* === TikTok Clean-up === */

        /* 1. Убрать скелетную анимацию (загрузочные заглушки) */
        .skeleton,
        .skeleton-loader,
        .placeholder-animation,
        .loading-skeleton,
        [class*="skeleton"],
        .animated-background,
        canvas[class*="CanvasMediaCardPlaceholder"] {
            display: none !important;
        }

        .skeleton-loader {
            display: none !important;
        }

        * {
            animation-timing-function: step-start !important;
            transition-timing-function: step-start !important;
        }

        .skeleton, .skeleton-loader, .placeholder, [class*="skeleton"], [class*="placeholder"] {
            animation: none !important;
        }

        /* 2. Убрать размытый фон за видео (может повысить производительность) */
        .css-1fyv5a5-0be0dc34--Box {
            display: none !important;
        }

        /* 3. Заблокировать всплывающее окно с предложением войти */
        .css-a41xxz-0be0dc34--DivModalContainer {
            display: none !important;
        }

        /* 4. Скрыть баннер с предложением скачать приложение */
        .css-133cvxd-0be0dc34--DivTopRightContainer {
            display: none !important;
        }

        /* 5. Скрыть баннер о файлах cookie (если он все еще появляется) */
        .tiktok-cookie-banner {
            display: none !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
})();