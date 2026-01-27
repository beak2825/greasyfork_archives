// ==UserScript==
// @name         BLACK RUSSIA  || Скрипт для Кураторов Форума.
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Специально для сервера White с автопереносом биографий
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/564219/BLACK%20RUSSIA%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/564219/BLACK%20RUSSIA%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Константы для префиксов
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const PIN_PREFIX = 2; // префикс закрепить
    const COMMAND_PREFIX = 10; // префикс команде проекта
    const CLOSE_PREFIX = 7; // префикс закрыто
    const DECIDED_PREFIX = 6; // префикс решено
    const TECHADM_PREFIX = 13; // префикс техническому специалисту
    const WATCHED_PREFIX = 9; // префикс рассмотрено
    const WAIT_PREFIX = 14; // префикс ожидание (для переноса в баг-трекер)

    // ID разделов для биографий
    const APPROVED_BIOS_FORUM_ID = 565; // Одобренные биографии
    const REJECTED_BIOS_FORUM_ID = 567; // Неодобренные биографии

    const buttons = [
        {
            title: '---------------------------------------------------------------> Биографии <----------------------------------------------------------',
        },
        {
            title: 'Биография одобрена',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена и одобрена администрацией сервера.<br><br>' +
                'Поздравляем вас с успешной регистрацией персонажа на проекте! Желаем интересной и увлекательной игры.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: ACCEPT_PREFIX,
            status: false,
            targetForum: APPROVED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.1. Заголовок RP биографии',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.1[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Заголовок биографии не соответствует установленной форме.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Заголовок должен быть составлен по форме: "Биография | Nick_Name".<br><br>' +
                'Пожалуйста, создайте новую биографию с корректным заголовком.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.2. Нереалистичная история',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.2[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография содержит нереалистичные элементы.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Персонаж не может обладать сверхспособностями. Биография должна быть составлена реалистично.<br><br>' +
                'Пожалуйста, создайте новую биографию с правдоподобной историей персонажа.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.3. Биография существующего человека',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.3[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография составлена на основе реально существующего человека.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Запрещено составлять биографию существующих людей (знаменитостей, исторических личностей и т.д.).<br><br>' +
                'Пожалуйста, создайте новую биографию с оригинальным персонажем.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.4. Копирование биографии',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.4[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография скопирована или частично заимствована у другого игрока.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Запрещено копировать чужие RP биографии.<br><br>' +
                'Пожалуйста, создайте новую оригинальную биографию.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.5. Грамматические ошибки',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.5[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография содержит грамматические или орфографические ошибки.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Биография должна быть читабельна и не содержать ошибок.<br><br>' +
                'Пожалуйста, исправьте ошибки и отправьте биографию на повторное рассмотрение.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.6. Неправильное форматирование',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.6[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Неправильное форматирование текста.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.<br><br>' +
                'Пожалуйста, исправьте форматирование согласно требованиям.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.7. Отсутствие визуального контента',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.7[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Отсутствие фотографий или иного визуального контента.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.<br><br>' +
                'Пожалуйста, добавьте соответствующий визуальный контент.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.8. Нарушение правил сервера',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.8[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография содержит элементы, позволяющие нарушать правила сервера.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Запрещено включать в биографию факторы, оправдывающие нарушение правил (неадекватное поведение, массовые убийства и т.д.).<br><br>' +
                'Пожалуйста, удалите запрещённые элементы из биографии.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.9. Объём биографии',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.9[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Несоответствие требуемому объёму текста.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] Минимальный объём RP биографии — 200 слов, максимальный — 600.<br><br>' +
                'Пожалуйста, отредактируйте биографию, чтобы она соответствовала требованиям по объёму.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: '1.10. Логические противоречия',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине нарушения [COLOR=#FF0000][B]правила 1.10[/B][/COLOR].<br><br>' +
                '[COLOR=#FF0000][B]Нарушение:[/B][/COLOR] Биография содержит логические противоречия.<br>' +
                '[COLOR=#FF0000][B]Требование:[/B][/COLOR] В биографии не должно быть логических противоречий (например, возраст и достижения персонажа не соответствуют друг другу).<br><br>' +
                'Пожалуйста, исправьте логические несоответствия в биографии.[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        },
        {
            title: 'Биография отклонена - не по форме',
            content:
                '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша биография была рассмотрена, но отклонена по причине: Не по форме.<br>Пожалуйста, напишите новую РП Биографию по форме:<br>Форма для подачи:[/COLOR][/FONT][/B][/CENTER]<br>' +
                '[code]' +
                'Имя и фамилия персонажа:\n<br>'+
                '• Укажите полное имя (можно придумать необычное, но реалистичное).\n\n<br>' +
                'Пол:\n<br>' +
                '• Мужской / Женский.\n\n<br>' +
                'Возраст:\n<br>' +
                '• Реалистичный возраст, соответствующий опыту и занятиям персонажа.\n\n<br>' +
                'Национальность:\n<br>' +
                '• Укажите страну или народ, к которому принадлежит персонаж.\n\n<br>' +
                'Образование:\n<br>' +
                '• Опишите, где и чему учился персонаж: школа, колледж, университет, курсы или самообразование.\n\n<br>' +
                'Описание внешности:\n<br>' +
                '• Рост, телосложение, цвет волос, глаз, особенности (шрамы, татуировки, манера одеваться).\n\n<br>' +
                'Характер:\n<br>' +
                '• Опишите сильные и слабые стороны, темперамент, привычки.\n\n<br>' +
                '• Пример: общительный и открытый, но быстро вспыльчивый; спокойный и расчётливый, склонен к упрямству.\n\n<br>' +
                'Детство:\n<br>' +
                '• Кратко опишите семью, условия жизни, важные события в ранние годы (бедность, переезд, утрата, дружба).\n\n<br>' +
                'Настоящее время:\n<br>' +
                '• Чем персонаж занимается сейчас: работа, место жительства, социальный статус, круг общения.\n\n<br>' +
                'Итог:\n<br>' +
                '• Опишите, какие качества и цели сформировались у персонажа после всех событий. Это подводит итог всей биографии.\n<br>' +
                '[/code]'+
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]' +
                '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            targetForum: REJECTED_BIOS_FORUM_ID,
            isBioAction: true
        }
    ];

    // Ждем загрузки страницы
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок
        addButton('На рассмотрение', 'pin', 'border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 165, 0);');
        addButton('Одобрено', 'odobreno', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        // Назначение обработчиков для кнопок
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#odobreno').click(() => editThreadData(ACCEPT_PREFIX, false));

        // Кнопка "Ответы" для биографий
        $(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ для биографии:');
            buttons.forEach((btn, id) => {
                if (btn.title && !btn.title.includes('---')) { // Пропускаем разделитель
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
            });
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`
        );
    }

    function addAnswers() {
        $('.button--icon--reply').after(
            `<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы для биографий</button>`
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map((btn, i) => {
                if (!btn.title) return '';

                // Пропускаем разделитель
                if (btn.title.includes('---')) {
                    return `<div style="width: 100%; text-align: center; margin: 10px 0; color: #fff; font-weight: bold;">${btn.title}</div>`;
                }

                return `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; border-radius: 13px; ${btn.dpstyle || 'background-color: #1a1a1a; color: #fff;'}"><span class="button-text">${btn.title}</span></button>`;
            })
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            // Для действий с биографиями добавляем перенос
            if (buttons[id].isBioAction) {
                editThreadDataWithMove(buttons[id].prefix, buttons[id].status, buttons[id].targetForum);
            } else {
                editThreadData(buttons[id].prefix, buttons[id].status);
            }
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
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
            greeting: () =>
                4 < hours && hours <= 11 ?
                'Доброе утро' :
                11 < hours && hours <= 15 ?
                'Добрый день' :
                15 < hours && hours <= 21 ?
                'Добрый вечер' :
                'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    discussion_open: 1,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
    }

    // Новая функция для редактирования темы с переносом
    function editThreadDataWithMove(prefix, pin = false, targetForumId) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        // Сначала устанавливаем префикс
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                discussion_open: pin ? 1 : 0,
                sticky: pin ? 1 : 0,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => {
            // Затем переносим тему
            moveThreadToForum(targetForumId, prefix);
        });
    }

    // Функция переноса темы в другой раздел
    function moveThreadToForum(targetForumId, prefix) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: targetForumId,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();