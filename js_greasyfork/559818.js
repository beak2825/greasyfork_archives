// ==UserScript==
// @name         Снежинки
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Снежиночки
// @author       You
// @match        https://lolz.live/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559818/%D0%A1%D0%BD%D0%B5%D0%B6%D0%B8%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/559818/%D0%A1%D0%BD%D0%B5%D0%B6%D0%B8%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    // Удаляем предыдущие стили и снежинки, чтобы не накапливались
    document.querySelectorAll('.snowflake').forEach(el => el.remove());

    const style = document.createElement('style');
    style.innerHTML = `
        .snowflake {
            position: fixed;
            top: -10px;
            color: rgba(255, 255, 255, 0.7); /* Белый цвет с прозрачностью */
            user-select: none;
            /* z-index -1 ставит их за основные блоки сайта */
            z-index: -1;
            pointer-events: none;
            animation: fall linear forwards;
        }
        @keyframes fall {
            to {
                transform: translateY(105vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';

        // Вернул стандартный маленький размер
        snowflake.style.fontSize = (Math.random() * 7 + 10) + 'px';

        // Медленное падение
        snowflake.style.animationDuration = (Math.random() * 4 + 6) + 's';
        snowflake.style.opacity = Math.random() * 0.7;

        document.body.appendChild(snowflake);

        // Удаление после завершения анимации
        setTimeout(() => snowflake.remove(), 10000);
    }, 400);
})();