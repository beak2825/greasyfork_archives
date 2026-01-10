// ==UserScript==
// @name         Быстрые жалобы
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет кнопку быстрой жалобы
// @author       Forest
// @match        https://lolz.live/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562143/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562143/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        const $firstPost = $('.message').first();
        if (!$firstPost.length) return;
        const username = $firstPost.attr('data-author');
        const threadUrl = window.location.href;
        const messageBody = `[club] 1. Профиль нарушителя: @${username}
2. Краткое описание жалобы:
3. Доказательства: ${threadUrl} [/club]`;
        const reportUrl = `/forums/801/create-thread?title=${encodeURIComponent('Жалоба на пользователя "' + username + '"')}&message=${encodeURIComponent(messageBody)}`;
        $firstPost.find('.publicControls').append(`
            <a href="${reportUrl}" class="item control" style="color: red;" target="_blank">
                <span class="fa fa-exclamation-triangle"></span>
            </a>
        `);
    });
})();