// ==UserScript==
// @name         Скрипт для МФ by E.Sailauov // CHEREPOVETS 
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Скрипты для Модератор Форума CHEREPOVETS 
// @author       Erasyl_Sailauov
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548829/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%A4%20by%20ESailauov%20%20CHEREPOVETS.user.js
// @updateURL https://update.greasyfork.org/scripts/548829/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%A4%20by%20ESailauov%20%20CHEREPOVETS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------
    // Префиксы тем
    // -------------------------------
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PIN_PREFIX = 2;
    const CLOSE_PREFIX = 7;
    const WAIT_PREFIX = 14;
    const NO_PREFIX = 0;

    // -------------------------------
    // Баннеры для RP ответов
    // -------------------------------
    const BANNER = 'https://i.postimg.cc/QC0bfZff/5091-DADF-C098-41-B5-B63-A-48-D035-EEC282.png';
    const DIVIMG = 'https://i.postimg.cc/fTh4W2B3/RLwzo.png';

    // -------------------------------
    // RP шаблоны для Ответов
    // -------------------------------
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
                "[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS[/COLOR].[/RIGHT][/SIZE][/FONT][/CENTER]"
        },

        // На рассмотрение
        {
            title: 'На рассмотрение',
            content:
                "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
                "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
                "<br>[B][COLOR=#FFFF00][SIZE=4]Ваша RP биография принята на рассмотрение.[/SIZE][/COLOR][/B]" +
                "<br><br>[FONT=arial][SIZE=4]Ожидайте ответа от администрации в течение 72 часов. Просьба не создавать дубликатов.[/SIZE][/FONT][/CENTER]"
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
                "На исправление даётся 24 часа. Если правки не внесёте — тема будет отказана.[/FONT][/CENTER]"
        },

        // =======================
        // 14 Отказов
        // =======================
        // 1
        {
            title:'Отказано | Не по форме (заголовок)',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Заголовок темы составлен не по форме.<br>" +
            "Примечание: Заголовок RP биографии должен быть: [B]Биография | Nick_Name[/B].<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Следуйте правилам.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Дисциплина — путь к успеху.\"[/FONT][/CENTER]"
        },
        // 2
        {
            title:'Отказано | Нереалистично',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Биография нереалистична (сверхспособности и т.д.).<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Составляйте реалистичные биографии.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Реальность делает историю живой.\"[/FONT][/CENTER]"
        },
        // 3
        {
            title:'Отказано | Существующий человек',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Запрещено составлять биографии реальных людей.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Создавайте уникальных персонажей.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Творчество рождает уникальность.\"[/FONT][/CENTER]"
        },
        // 4
        {
            title:'Отказано | Плагиат',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Обнаружено копирование чужой RP биографии.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Пишите свои тексты сами.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Честность — ключ к уважению.\"[/FONT][/CENTER]"
        },
        // 5
        {
            title:'Отказано | Грамматика / Орфография',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Биография содержит орфографические или грамматические ошибки.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Проверяйте текст перед отправкой.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Грамотность украшает текст.\"[/FONT][/CENTER]"
        },
        // 6
        {
            title:'Отказано | Шрифт / Размер',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Использован неправильный шрифт или размер текста.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Соблюдайте единый стиль оформления.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Чистота формы — часть красоты содержания.\"[/FONT][/CENTER]"
        },
        // 7
        {
            title:'Отказано | Нет фото / материалов',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: В биографии отсутствуют фотографии или иные материалы.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Добавляйте необходимые материалы.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Визуальная информация усиливает текст.\"[/FONT][/CENTER]"
        },
        // 8
        {
            title:'Отказано | Пропаганда нарушений',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Биография содержит элементы, оправдывающие или поощряющие нарушения правил сервера.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Соблюдайте правила сервера.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Правила созданы для честной игры.\"[/FONT][/CENTER]"
        },
        // 9
        {
            title:'Отказано | Неверный объём',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Текст не соответствует требованиям по объёму (200–600 слов).<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Старайтесь уложиться в лимит.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Правильный объём делает текст читаемым.\"[/FONT][/CENTER]"
        },
        // 10
        {
            title:'Отказано | Логические противоречия',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: В тексте обнаружены логические противоречия.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Проверяйте связность текста.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Логика делает историю убедительной.\"[/FONT][/CENTER]"
        },
        // 11
        {
            title:'Отказано | Возраст не совпадает с датой',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Указанный возраст не соответствует дате рождения.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Проверьте дату и возраст.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Точность — основа достоверности.\"[/FONT][/CENTER]"
        },
        // 12
        {
            title:'Отказано | Не дополнил',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Не все пункты заполнены.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Дополните все обязательные поля.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Полнота информации делает биографию убедительной.\"[/FONT][/CENTER]"
        },
        // 13
        {
            title:'Отказано | Не от первого лица',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Биография написана не от первого лица.<br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Перепишите биографию от первого лица.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Первое лицо делает историю живой.\"[/FONT][/CENTER]"
        },
        // 14
        {
            title:'Отказано | Оффтоп',
            content:"[B][CENTER][IMG]"+BANNER+"[/IMG][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
            "[IMG]"+DIVIMG+"[/IMG]<br><br>[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>" +
            "Причина: Тема является оффтопом и не соответствует формату RP биографии.<br>" +
            "Примечание: Пожалуйста, создавайте темы только для RP биографий.<br><br>" +
            "[COLOR=#00FFFF]Пожелание:[/COLOR] Будьте внимательны и следуйте правилам форума.<br>" +
            "[COLOR=#FFFF00]Мотивация:[/COLOR] \"Настоящая сила в дисциплине и внимании к деталям.\"<br>" +
            "[/FONT][/CENTER]"
        }
    ];

    // -------------------------------
    // Инициализация кнопок на странице
    // -------------------------------
    $(document).ready(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js";
        document.body.appendChild(script);

        script.onload = () => {
            const buttonList = [
                {name: 'На рассмотрение', id: 'btn_pin', prefix: PIN_PREFIX},
                {name: 'Отказано⛔', id: 'btn_unaccept', prefix: UNACCEPT_PREFIX},
                {name: 'Одобрено✅', id: 'btn_accept', prefix: ACCEPT_PREFIX},
                {name: 'Закрыто⛔', id: 'btn_close', prefix: CLOSE_PREFIX},
                {name: 'Ожидание', id: 'btn_wait', prefix: WAIT_PREFIX},
                {name: 'Без префикса⛔', id: 'btn_no', prefix: NO_PREFIX},
                {name: 'Ответы💥', id: 'btn_answers'}
            ];

            buttonList.forEach(btn => addButton(btn.name, btn.id));

            buttonList.forEach(btn => {
                $(`#${btn.id}`).click(() => {
                    if(btn.id === 'btn_answers'){
                        showAnswerButtons();
                    } else {
                        editThreadData(btn.prefix, false);
                    }
                });
            });
        };
    });

    function addButton(name, id) {
        $('.button--icon--reply').first().before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
        );
    }

    function showAnswerButtons() {
        const markup = buttons.map((btn, i) =>
            `<button id="answer-${i}" class="button--primary rippleButton" style="margin:5px">${btn.title}</button>`
        ).join('');
        XF.alert(`<div class="select_answer">${markup}</div>`, null, 'Выберите ответ:');
        buttons.forEach((btn, i) => {
            $(`#answer-${i}`).click(() => pasteContent(i));
        });
    }

    function pasteContent(id) {
        const threadData = getThreadData();
        const template = Handlebars.compile(buttons[id].content);
        $('.fr-element.fr-view p').empty().append(template(threadData));
        $('a.overlay-titleCloser').trigger('click');
    }

    function getThreadData() {
        const authorID = $('a.username').first().attr('data-user-id');
        const authorName = $('a.username').first().text();
        const hours = new Date().getHours();
        return {
            user: {id: authorID, name: authorName, mention: `[USER=${authorID}]${authorName}[/USER]`},
            greeting:
                (hours > 4 && hours <= 11) ? 'Доброе утро' :
                (hours > 11 && hours <= 15) ? 'Добрый день' :
                (hours > 15 && hours <= 21) ? 'Добрый вечер' :
                'Доброй ночи'
        };
    }

    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value').first().text().trim();
        const formData = new FormData();
        formData.append('prefix_id', prefix);
        formData.append('title', threadTitle);
        if(pin) formData.append('sticky', 1);
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', document.URL.split(XF.config.url.fullBase)[1]);
        formData.append('_xfWithData', 1);
        formData.append('_xfResponseType', 'json');

        fetch(`${document.URL}edit`, {method: 'POST', body: formData}).then(() => location.reload());
    }

})();