// ==UserScript==
// @name         Должности в чате
// @version      1.1.0
// @author       rek655
// @license      MIT
// @description  Подписывает в чате Игровой должности игроков
// @match        https://catwar.su/cw3/
// @match        https://catwar.net/cw3/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/1534109
// @downloadURL https://update.greasyfork.org/scripts/554774/%D0%94%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/554774/%D0%94%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5.meta.js
// ==/UserScript==

(function (window, document, $) {
    'use strict';

    if (typeof $ === 'undefined') return;

    /** Получаем должность игрока по ID */
    function getPosition(playerId) {
        return new Promise((resolve, reject) => {
            if (!playerId) return resolve(null);
            $.ajax({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-Requested-With', { toString: () => '' });
                },
                url: '/cat' + playerId,
                type: 'GET',
                dataType: "html",
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Upgrade-Insecure-Requests': 1
                },
                success: function (data) {
                    data = data.replace(/<img[^>]*>/gi, "");
                    const tempDiv = $(data);
                    const element = tempDiv.find(`p[data-cat="${playerId}"]`);
                    const position = element.find('i').first().text();
                    if (position && position !== "(вы находитесь в одном месте)") {
                        resolve(position);
                    } else {
                        resolve(null);
                    }
                },
                error: function (error) {
                    console.error('Ошибка:', error);
                    reject(error);
                }
            });
        });
    }

    /** Вставляем должность рядом с ником */
    function setPosition(href, nickElem) {
        const $nick = $(nickElem);
        const $nextI = $nick.next('i').first();
        console.log($nextI.text())
if ($nextI.length && $nextI.text().trim().startsWith('(')) {
    $nextI.remove(); 
}


        if (!href) return;
        const match = href.match(/cat(\d+)/);
        if (!match) return;
        const id = match[1];
        if (!id || !nickElem) return;



        getPosition(id).then(position => {
            if (!position || !document.contains(nickElem[0])) return;



            $("<i> (" + position + ")</i>").insertAfter($nick);
        }).catch(error => {
            console.error('Ошибка:', error);
        });
    }

    /** Обрабатываем все существующие сообщения */
    function processMessages(containerSelector, messageSelector, hrefSelector, nickSelector) {
    $(containerSelector).find(messageSelector).each(function () {
        const $msg = $(this);
        const href = (typeof hrefSelector === 'function' ? hrefSelector($msg) : $msg.find(hrefSelector)).first().attr('href');
        const nickElem = $msg.find(nickSelector).first();
        setPosition(href, nickElem);
    });
}

    /** Отслеживаем новые сообщения */
    function observeNewMessages(containerSelector, messageSelector, hrefSelector, nickSelector) {
    const observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;
                const $node = $(node);

                const isMessageNode = $node.is(messageSelector);
                if (isMessageNode) {
                    const href = (typeof hrefSelector === 'function' ? hrefSelector($node) :$node.find(hrefSelector)).first().attr('href');
                    const nickElem = $node.find(nickSelector).first();
                    setPosition(href, nickElem);
                }

                $node.find(messageSelector).each(function () {
                    const $msg = $(this);
                    const href = (typeof hrefSelector === 'function' ? hrefSelector($msg) : $msg.find(hrefSelector)).first().attr('href');
                    const nickElem = $msg.find(nickSelector).first();
                    setPosition(href, nickElem);
                });
            });
        });
    });

    const config = { childList: true, subtree: true };
    const target = document.querySelector(containerSelector);
    if (target) observer.observe(target, config);
}

       /** Отслеживаем новые сообщения */
function observeNewMessagesBase(containerSelector, messageSelector, hrefSelector, nickSelector) {
    let processing = false; 

    const observer = new MutationObserver(function (mutationsList) {
        if (processing) return;

        const foundTextNode = mutationsList.some(mutation =>
            Array.from(mutation.addedNodes).some(node => node.nodeType === 3)
        );

        if (foundTextNode) {
            processing = true; 

            setTimeout(() => {
                processMessages(containerSelector, messageSelector, hrefSelector, nickSelector);
                processing = false; 
            }, 20);
        }
    });

    const config = { childList: true, subtree: true };
    const target = document.querySelector(containerSelector);
    if (target) observer.observe(target, config);
}



    /** Инициализация для всех типов чатов */
    $(document).ready(function () {
        setTimeout(() => {
            if ($('#cws_chat_msg').length) {
                processMessages('#cws_chat_msg', '.cws_chat_wrapper', '.cws_chat_report a', '.cws_chat_msg .nick');
                observeNewMessages('#cws_chat_msg', '.cws_chat_wrapper', '.cws_chat_report a', '.cws_chat_msg .nick');
            } else if ($('#uwu_chat_msg').length) {
                processMessages('#uwu_chat_msg', 'div[id="msg"]', 'a[href*="/cat"]', '.chat_text .nick');
                observeNewMessages('#uwu_chat_msg', 'div[id="msg"]', 'a[href*="/cat"]', '.chat_text .nick');
            } else
            if ($('#chat_msg').length) {
               processMessages('#chat_msg', '.chat_text', function($msg) {
    return $msg.closest('tr').find('td:eq(1) a');
}, '.nick');

                observeNewMessagesBase('#chat_msg', '.chat_text', $msg => $msg.closest('tr').children('td:eq(1)').find('a'), '.nick');

            }
        }, 1000);
    });
})(window, document, jQuery);