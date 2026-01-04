// ==UserScript==
// @name         YouTube - Disable Autoplay & Animations
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @version 1
// @namespace YouTube Disable Autoplay Animations
// @license MIT 
// @description Disable Autoplay & Animations
// @downloadURL https://update.greasyfork.org/scripts/553033/YouTube%20-%20Disable%20Autoplay%20%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/553033/YouTube%20-%20Disable%20Autoplay%20%20Animations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Отключаем большинство анимаций перехода и трансформации
    GM_addStyle(`
        * {
           transition: none !important;
           animation: none !important;
        }
    `);

    // Функция для отключения кнопки автовоспроизведения
    function disableAutoplay() {
        const autoplayButton = document.querySelector('.ytp-autonav-toggle-button');
        // Проверяем, включена ли она (атрибут aria-checked="true")
        if (autoplayButton && autoplayButton.getAttribute('aria-checked') === 'true') {
            autoplayButton.click();
            console.log('[Userscript] Автовоспроизведение отключено.');
        }
    }

    // Запускаем с интервалом, так как плеер может загружаться не сразу
    const interval = setInterval(() => {
        if (document.querySelector('.ytp-autonav-toggle-button')) {
            disableAutoplay();
            clearInterval(interval);
        }
    }, 500);
})();