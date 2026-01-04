// ==UserScript==
// @name         Brave DNS Auto Clear
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Очищает DNS Brave при обновлении страницы или закрытии вкладки
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555647/Brave%20DNS%20Auto%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/555647/Brave%20DNS%20Auto%20Clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Очистка DNS при обновлении страницы
    window.addEventListener('beforeunload', () => {
        fetch('brave://net-internals/#dns').catch(() => {});
    });

    // При нажатии F5 — тоже сбрасываем DNS (для гарантии)
    window.addEventListener('keydown', e => {
        if (e.key === 'F5') {
            fetch('brave://net-internals/#dns').catch(() => {});
        }
    });
})();
