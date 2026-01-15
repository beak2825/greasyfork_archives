// ==UserScript==
// @name         Kostroma ГС/ЗГС
// @namespace   https://forum.blackrussia.online
// @version      3.9.8
// @description  KF SKRIPT FULL AUTO + STICKY
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560285/Kostroma%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/560285/Kostroma%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PIN_PREFIX = 2;
    const GA_PREFIX = 12;
    const WATCHED_PREFIX = 9;

    const buttons = [
        {
            title: ">>>>>   ГС/ЗГС ГОСС/ОПГ   <<<<<",
        },
        {
            title: "Главному Администратору",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый игрок[/CENTER][/SIZE][/FONT][/COLOR][/B][/I]<br>' +
                '[I][B][COLOR=Red][FONT=georgia][CENTER] Ваша жалоба передана Главному Администратору сервера [/CENTER][/FONT][/COLOR][/B][/I]<br>' +
                '[I][B][color=red][FONT=georgia][CENTER][ICODE] на рассмотрение... [/ICODE][/CENTER][/FONT][/color][/B][/I]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: ">>>>>   Жалобы на Лидеров   <<<<<",
        },
        {
            title: "Одобрено (Лидер)",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/SIZE][/FONT][/COLOR][/CENTER][/I]<br>' +
                '[I][B][color=#D1D5D8][FONT=georgia][CENTER] Лидер получит наказание [/CENTER][/FONT][/color][/B][/I]<br>' +
                '[B][I][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][/I][/B]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Беседа ЛД",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/SIZE][/FONT][/COLOR][/CENTER][/I]<br>' +
                '[I][B][Color=#D1D5D8][FONT=georgia][CENTER] С лидером будет проведена беседа. [/CENTER][/FONT][/Color][/B][/I]<br>' +
                '[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][/B][/I]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "На рассмотрение",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/SIZE][/FONT][/COLOR][/CENTER][/I]<br>' +
                '[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба взята [color=orange] на рассмотрение [/color], не создавайте копии темы [/CENTER][/SIZE][/FONT][/color][/B][/I]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: "Заместитель получит выговор",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый игрок[/CENTER][/SIZE][/FONT][/COLOR][/B][/I]<br>' +
                '[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Заместитель получит выговор. [/CENTER][/SIZE][/FONT][/color][/B][/I]<br>' +
                '[I][B][color=#00FF00][FONT=georgia][CENTER][ICODE] Одобрено, закрыто. [/ICODE][/CENTER][/FONT][/color][/B][/I]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Не по форме",
            content: '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][/CENTER]' +
                '[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/SIZE][/FONT][/COLOR][/CENTER][/I]<br>' +
                '[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба составлена не по форме. [/CENTER][/SIZE][/FONT][/color][/B][/I]<br>' +
                '[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/FONT][/color][/B]<br><br>' +
                '[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        }
    ];

    $(document).ready(() => {
        if (typeof Handlebars === 'undefined') {
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
        }
        addButton('МЕНЮ ОТВЕТОВ', 'selectAnswer');
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => pasteAndPost(id, getThreadData()));
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px; background: #2ecc71;">${name}</button>`);
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display: flex; flex-direction: column; max-height: 400px; overflow-y: auto;">${buttons.map((btn, i) => `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`).join('')}</div>`;
    }

    async function pasteAndPost(id, data = {}) {
        if (!buttons[id].content) return;
        const template = Handlebars.compile(buttons[id].content);
        const html = template(data);
        const editor = $('.fr-element.fr-view');
        editor.html(`<p>${html}</p>`);
        $('.overlay-titleCloser').trigger('click');

        if (buttons[id].prefix) {
            await editThreadData(buttons[id].prefix, buttons[id].status);
        }

        setTimeout(() => {
            $('.button--icon--reply').click();
        }, 1000);
    }

    function getThreadData() {
        const authorName = $('a.username').last().text();
        const authorID = $('a.username').last().attr('data-user-id') || 0;
        const hours = new Date().getHours();
        return {
            user: { id: authorID, name: authorName, mention: `[USER=${authorID}]${authorName}[/USER]` },
            greeting: 4 < hours && hours <= 11 ? 'Доброе утро' : 11 < hours && hours <= 15 ? 'Добрый день' : 15 < hours && hours <= 21 ? 'Добрый вечер' : 'Доброй ночи',
        };
    }

    async function editThreadData(prefix, stickyStatus) {
        const threadTitle = $('.p-title-value').contents().last().text().trim();
        return fetch(`${document.URL}edit`, {
            method: 'POST',
            body: new URLSearchParams({
                prefix_id: prefix,
                title: threadTitle,
                sticky: stickyStatus ? 1 : 0,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        });
    }
})();
