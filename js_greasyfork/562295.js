// ==UserScript==
// @name         Громкость в чате
// @description  Вставляет [громкость] для каждого сообщения в чате Игровой
// @version      1.0.0
// @author       rek655
// @license      MIT
// @match        https://catwar.su/cw3/
// @match        https://catwar.net/cw3/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/1534109
// @downloadURL https://update.greasyfork.org/scripts/562295/%D0%93%D1%80%D0%BE%D0%BC%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/562295/%D0%93%D1%80%D0%BE%D0%BC%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    function applyVolume(element) {
    const $el = $(element);
    const $chatText = $el.hasClass('chat_text') ? $el : $el.find('.chat_text');

    const classAttr = $chatText.attr('class') || '';
    const match = classAttr.match(/vlm(\d+)/);

    if (match) {
        const volume = match[1];
        if (!$chatText.find('.volume-value').length) {
            $chatText.append(` <span class="volume-value">[${volume}]</span>`);
        }
    }
}

    const init = () => {
        const containerSelector = ['#cws_chat_msg', '#uwu_chat_msg', '#chat_msg'].find(s => document.querySelector(s));
        if (!containerSelector) return;

        const container = document.querySelector(containerSelector);

        // Обработка существующих сообщений
        $(container).find('.chat_text, .cws_chat_wrapper, div[id="msg"]').each((_, el) => applyVolume(el));

        // Следим за новыми
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        applyVolume(node);
                        $(node).find('.chat_text, .cws_chat_wrapper, div[id="msg"]').each((_, el) => applyVolume(el));
                    }
                });
            });
        });

        observer.observe(container, { childList: true, subtree: true });
    };

    const checkExist = setInterval(() => {
        if (['#cws_chat_msg', '#uwu_chat_msg', '#chat_msg'].some(s => document.querySelector(s))) {
            clearInterval(checkExist);
            init();
        }
    }, 500);

})(jQuery);