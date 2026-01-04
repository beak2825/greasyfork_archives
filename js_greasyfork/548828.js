// ==UserScript==
// @name         Скрипт для МФ by E.Sailauov // Cherepovets 
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Полный скрипт для кураторов форума Black Russia — RP Биографии
// @author       Erasyl_Sailauov
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548828/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%A4%20by%20ESailauov%20%20Cherepovets.user.js
// @updateURL https://update.greasyfork.org/scripts/548828/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%A4%20by%20ESailauov%20%20Cherepovets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =======================
    // Поменять можно здесь:
    // =======================
    const BANNER = 'https://i.postimg.cc/QC0bfZff/5091-DADF-C098-41-B5-B63-A-48-D035-EEC282.png';
    const DIVIMG = 'https://i.postimg.cc/fTh4W2B3/RLwzo.png';

    // Префиксы для кнопок
    const PIN_PREFIX = 1;
    const UNACCEPT_PREFIX = 2;
    const ACCEPT_PREFIX = 3;
    const CLOSE_PREFIX = 4;
    const WAIT_PREFIX = 5;
    const NO_PREFIX = 6;

    // =======================
    // Список основных кнопок для модерации
    // =======================
    const buttonList = [
        {name: 'На рассмотрение', id: 'btn_pin', prefix: PIN_PREFIX},
        {name: 'Отказано⛔', id: 'btn_unaccept', prefix: UNACCEPT_PREFIX},
        {name: 'Одобрено✅', id: 'btn_accept', prefix: ACCEPT_PREFIX},
        {name: 'Закрыто⛔', id: 'btn_close', prefix: CLOSE_PREFIX},
        {name: 'Ожидание', id: 'btn_wait', prefix: WAIT_PREFIX},
        {name: 'Без префикса⛔', id: 'btn_no', prefix: NO_PREFIX}
    ];

    // =======================
    // Шаблоны RP биографии
    // =======================
    const rpTemplates = [

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
            prefix: ACCEPT_PREFIX
        },

        // На рассмотрение
        {
            title: 'На рассмотрение',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "<br>[B][COLOR=#FFFF00][SIZE=4]Ваша RP биография принята на рассмотрение.[/SIZE][/COLOR][/B]" +
                "<br><br>[FONT=arial][SIZE=4]Ожидайте ответа от администрации в течение 72 часов. Просьба не создавать дубликатов.[/SIZE][/FONT][/CENTER]",
            prefix: PIN_PREFIX
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
            prefix: WAIT_PREFIX
        },

        // =======================
        // Отказы 1.1 – 1.10
        // =======================
        {
            title: 'Отказано | Не по форме (заголовок)',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Заголовок темы составлен не по форме.<br>" +
                "Примечание: Заголовок RP биографии должен быть: [B]Биография | Nick_Name[/B].[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Нереалистично (сверхспособности)',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Биография нереалистична.<br>" +
                "Примечание: Персонаж не может обладать сверхспособностями или событиями, противоречащими логике сервера.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Существующий человек',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Запрещено составлять биографии реальных людей.<br>" +
                "Примечание: Примеры: Бред Питт, Аль Капоне и т.д.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Плагиат',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Обнаружено копирование чужой RP биографии.<br>" +
                "Примечание: Полное и частичное копирование запрещено.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Грамматика / Орфография',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Биография содержит орфографические или грамматические ошибки.<br>" +
                "Примечание: Биография должна быть читабельной и без ошибок.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Шрифт / Размер',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Использован неправильный шрифт или размер текста.<br>" +
                "Примечание: Допустимы Times New Roman или Verdana; минимальный размер — 15.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Нет фото / материалов',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: В биографии отсутствуют фотографии или материалы.<br>" +
                "Примечание: В биографии должны присутствовать изображения или материалы, относящиеся к персонажу.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Пропаганда нарушений',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Биография содержит элементы, оправдывающие нарушения правил сервера.<br>" +
                "Примечание: Запрещено описывать убийства, психические отклонения и т.п.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Неверный объём',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: Текст не соответствует требованиям по объёму.<br>" +
                "Примечание: Минимум 200 слов, максимум 600 слов.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        },
        {
            title: 'Отказано | Логические противоречия',
            content: "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br>" +
                "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
                "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
                "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
                "Причина: В тексте обнаружены логические противоречия.<br>" +
                "Примечание: Указывайте возраст и достижения, соответствующие логике сервера.[/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX
        }
    ];

    console.log('Скрипт кураторов загружен ✅');
})();