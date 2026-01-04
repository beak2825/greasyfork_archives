// ==UserScript==
// @name         Fast report
// @namespace    https://lolz.live/
// @version      0.7
// @description  Упрощенная отправка жалоб на Lolz.live / Zelenka.guru без лишних подтверждений.
// @description:en Simplifies reporting on Lolz.live / Zelenka.guru by removing confirmation popups.
// @match        https://lolz.live/threads/*
// @match        https://zelenka.guru/threads/*
// @author       Forest
// @license      MIT 
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557399/Fast%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/557399/Fast%20report.meta.js
// ==/UserScript==

/* global jQuery:false, XenForo:false */

(function($) {
    'use strict';

    const REPORT_BUTTONS = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": { name: '1.1' },
        "Создание темы не в соответствующем разделе": { name: '2.12' },
        "Неправильное оформление отзыва": { name: '3.15' },
    };

    const _xfToken = $('input[name="_xfToken"]').val();
    if (!_xfToken) return;

    function postReport(url, data, reason) {
        if (typeof XenForo === 'undefined' || typeof XenForo.ajax === 'undefined') return;

        XenForo.ajax(
            url,
            data,
            function(ajaxData) {
                if (ajaxData.error) {
                    XenForo.alert('❌ Ошибка форума: ' + ajaxData.error.join(' '), '', 5000);
                } else {
                    XenForo.alert('✅ Жалоба отправлена: ' + reason, '', 3000);
                }
            },
            {
                type: 'POST',
                error: function(jqXHR, textStatus) {
                    const message = jqXHR.status === 403 ? 'Обнаружено нарушение безопасности (токен). Обновите страницу.' : textStatus;
                    XenForo.alert('❌ Ошибка: ' + message, '', 7000);
                }
            }
        );
    }

    function addButtonToPosts() {
        const $messageList = $('#messageList');
        if ($messageList.length === 0) return;

        $messageList.find('li[id^="post-"]').each(function() {
            const $block = $(this);
            const postIdMatch = $block.attr('id').match(/post-(\d+)/);
            if (!postIdMatch) return;

            const postId = postIdMatch[1];

            const $publicControls = $block.find('.publicControls');
            if ($publicControls.length === 0 || $publicControls.find(".custom-report-button").length > 0) return;

            for (const [key, config] of Object.entries(REPORT_BUTTONS)) {
                const $button = $('<span>')
                    .text(config.name)
                    .addClass("custom-report-button")
                    .attr('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer;');

                $button.on('click', function() {
                    const postData = {
                        "message": key,
                        "is_common_reason": 1,
                        "_xfToken": _xfToken,
                        "redirect": window.location.href,
                        "_xfNoRedirect": 1,
                        "_xfResponseType": "json"
                    };

                    postReport(`posts/${postId}/report`, postData, key);
                });

                $publicControls.prepend($button);
            }
        });
    }

    addButtonToPosts();

    const observer = new MutationObserver(addButtonToPosts);
    const messageList = document.getElementById('messageList');
    if (messageList) {
        observer.observe(messageList, { childList: true, subtree: true });
    }

})(jQuery);