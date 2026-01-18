// ==UserScript==
// @name         Должности в чате
// @version      1.2.0
// @author       rek655
// @license      MIT
// @description  Подписывает в чате Игровой должности игроков
// @match        https://catwar.su/cw3/
// @match        https://catwar.net/cw3/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/1534109
// @downloadURL https://update.greasyfork.org/scripts/554774/%D0%94%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/554774/%D0%94%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    const cache = new Map();
    const MAX_CACHE_SIZE = 30;

    /** Запрос должности */
    async function getPosition(playerId) {
        if (!playerId) return null;
        if (cache.has(playerId)) return cache.get(playerId);

        try {
            const data = await $.ajax({
                url: '/cat' + playerId,
                type: 'GET',
                dataType: "html",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-Requested-With', { toString: () => '' });
                }
            });
            const position = $(data).find(".profile-text i").first().text();

            if (cache.size >= MAX_CACHE_SIZE) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }

            if (position) {
                cache.set(playerId, position);
            }
            return position;
        } catch (e) {
            return null;
        }
    }

    /** Логика обработки элементов чата */
    async function applyPosition(element) {
        const $el = $(element);
        const $nick = $el.find('.nick').first();
        if (!$nick.length) return;

        const $nextI = $nick.next('i');
        const $target = $nextI.length ? $nextI : $nick;

        if ($target.next('.position-value').length) return;

        let href = null;
        if ($el.closest('#cws_chat_msg').length || $el.hasClass('cws_chat_wrapper')) {
            href = $el.find('.cws_chat_report a').attr('href');
        } else if ($el.closest('#uwu_chat_msg').length || $el.attr('id') === 'msg') {
            href = $el.find('a[href*="/cat"]').attr('href');
        } else {
            href = $el.closest('tr').find('td:eq(1) a').attr('href');
        }

        if (!href) return;

        const match = href.match(/cat(\d+)/);
        if (match) {
            const pos = await getPosition(match[1]);
            if (pos && !$target.next('.position-value').length) {
                $target.after(`<i class="position-value"> (${pos})</i>`);
            }
        }
    }

    const init = () => {
        const containerSelector = ['#cws_chat_msg', '#uwu_chat_msg', '#chat_msg'].find(s => document.querySelector(s));
        if (!containerSelector) return;

        const container = document.querySelector(containerSelector);
        const messageClass = '.chat_text, .cws_chat_wrapper, div[id="msg"]';

        // Обработка существующих сообщений
        $(container).find(messageClass).each((_, el) => applyPosition(el));

        // Следим за новыми
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if ($(node).is(messageClass)) {
                            applyPosition(node);
                        }
                        $(node).find(messageClass).each((_, el) => applyPosition(el));
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