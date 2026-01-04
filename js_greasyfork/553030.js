// ==UserScript==
// @name         YouTube - Отключение лишних событий
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Блокирует некоторые внутренние события YouTube для предотвращения загрузки лишних модулей.
// @author       You
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/553030/YouTube%20-%20%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B8%D1%88%D0%BD%D0%B8%D1%85%20%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/553030/YouTube%20-%20%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B8%D1%88%D0%BD%D0%B8%D1%85%20%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Список событий, которые мы хотим заблокировать
    const blockedEvents = [
        'yt-navigate-start', // Событие начала навигации (можно фильтровать по URL)
        'yt-player-updated'  // Событие обновления плеера
    ];

    // Переопределяем addEventListener, чтобы фильтровать события
    const originalAddEventListener = unsafeWindow.EventTarget.prototype.addEventListener;
    unsafeWindow.EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            // Пример: блокируем навигацию на Shorts
            if (type === 'yt-navigate-start' && listener.toString().includes('shorts')) {
                console.log(`[Userscript] Заблокирован обработчик для события: ${type}`);
                return; // Просто не добавляем этот обработчик
            }
        }
        // Для всех остальных событий вызываем оригинальный метод
        return originalAddEventListener.call(this, type, listener, options);
    };
})();