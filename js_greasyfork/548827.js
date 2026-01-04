// ==UserScript==
// @name         Скрипт для Кураторов Форума (RP Биографии)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Скрипт для кураторов форума Black Russia — RP Биографии
// @author       Valik
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548827/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548827/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =======================
    // Поменять можно здесь:
    // =======================
    const BANNER = 'https://i.postimg.cc/QC0bfZff/5091-DADF-C098-41-B5-B63-A-48-D035-EEC282.png';
    const DIVIMG = 'https://i.postimg.cc/fTh4W2B3/RLwzo.png';

    // Префиксы (по твоему примеру)
    const ACCEPT_PREFIX = 8;
    const REVIEW_PREFIX = 2;
    const REVISION_PREFIX = 4;
    const DENY_PREFIX = 4;

    // =======================
    // Шаблоны кнопок / RP биография
    // =======================
    const buttons = [

        // Одобрено
        {
            title: 'Одобрено',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#00FF00]Одобрено[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#00FF00]ОДОБРЕНО[/COLOR]<br><br>" +
                "[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS[/COLOR].[/RIGHT][/SIZE][/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false
        },

        // На рассмотрение
        {
            title: 'На рассмотрение',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "<br>[B][COLOR=#FFFF00][SIZE=4]Ваша RP биография принята на рассмотрение.[/SIZE][/COLOR][/B]" +
                "<br><br>[FONT=arial][SIZE=4]Ожидайте ответа от администрации в течение 72 часов. Просьба не создавать дубликатов.[/SIZE][/FONT][/CENTER]",
            prefix: REVIEW_PREFIX,
            status: false
        },

        // На доработку
        {
            title: 'На доработку',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FFA500]На доработку[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FFA500]НА ДОРАБОТКУ[/COLOR]<br><br>" +
                "Причина: (перечислите замечания: орфография, не хватает информации, нет фото и пр.).<br>" +
                "На исправление даётся 24 часа. Если правки не внесёте — тема будет отказана.[/FONT][/CENTER]",
            prefix: REVISION_PREFIX,
            status: false
        },

        // =======================
        // Отказы 1.1 – 1.10
        // =======================
        {
            title: 'Отказано | Не по форме (заголовок)',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Заголовок темы составлен не по форме.<br>" +
                "Примечание: Заголовок RP биографии должен быть: [B]Биография | Nick_Name[/B].[/FONT][/CENTER]",
            prefix: DENY_PREFIX,
            status: false
        },

        // Дальше идут все остальные 1.2 – 1.10 шаблоны как в твоём примере
        // (нужно просто добавить их в массив buttons аналогично выше)

    ];

    // =======================
    // Скрипт для кнопок на странице
    // =======================
    $(document).ready(() => {

        // Подключаем Handlebars
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок
        addButton('Ответы💥', 'selectAnswer');

        // Кнопка "Ответы"
        $('button#selectAnswer').click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => pasteContent(id));
            });
        });

    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map((btn, i) =>
                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px">
                    <span class="button-text">${btn.title}</span>
                 </button>`)
            .join('')}</div>`;
    }

    function pasteContent(id) {
        const template = Handlebars.compile(buttons[id].content);
        const data = getThreadData();
        $('div.fr-element.fr-view p').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: 
                hours > 4 && hours <= 11 ? 'Доброе утро' :
                hours > 11 && hours <= 15 ? 'Добрый день' :
                hours > 15 && hours <= 21 ? 'Добрый вечер' :
                'Доброй ночи'
        };
    }

})();