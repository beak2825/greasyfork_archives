// ==UserScript==
// @name         Скрипт для рукодства кф
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Скрипт для ЗГКФ / ГКФ
// @author       Ackerman >> Егор Прокодов
// @match       https://forum.blackrussia.online/*
// @include     https://forum.blackrussia.online
// @icon         https://i.postimg.cc/509h4RVH/photo-2025-06-16-21-46-58.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/559147/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%BA%D1%84.user.js
// @updateURL https://update.greasyfork.org/scripts/559147/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%BA%D1%84.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Отказано
    const ACCEPT_PREFIX = 8; // Одобрено
    const PIN_PREFIX = 2; // Закрепить
    const GA_PREFIX = 12; // Главному администратору
    const COMMAND_PREFIX = 10; // Команде проекта
    const WATCHED_PREFIX = 9; // Рассмотрено
    const CLOSE_PREFIX = 7; // Закрыто
    const SPECY_PREFIX = 11; // Спец. администратору
    const TEXY_PREFIX = 13; // Тех. специалисту
    const buttons = [
        {
            title: 'Отказано',
            content:
            '',
            prefix: UNACCEPT_PREFIX,
            status: false,
            dpstyle: 'oswald: 3px; color: #ff0088; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid  #ff0088; width: 40%',
        },
        {
            title: 'Закрыто',
            content:
            '',
            prefix: CLOSE_PREFIX,
            status: false,
            dpstyle: 'oswald: 3px; color: #ff0088; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid  #ff0088; width: 40%',
        },
        {
            title: 'На рассмотрении',
            content:
            '',
            prefix: PIN_PREFIX,
            status: true,
            dpstyle: 'oswald: 3px; color: #ff0088; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid  #ff0088; width: 40%',
        },
        {
            title: '------------------------------------------------ Жалобы на игроков ------------------------------------------------',
        },
        {
            title: 'Будет наказан',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Игроку будет выдано наказание.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нарушений нет',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Нарушений со стороны игрока не обнаружено.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Недостаточно док-в',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Недостаточно доказательств для выдачи наказания.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Условия сделки',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Отсутствуют условия сделки.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Более 3-ех минут',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Видео длится более 3-ех минут. Создайте новую тему и укажите тайм-коды основных моментов.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба составлена не по форме.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В первоначальном виде',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>" +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>" +
            "[B]3.7.[/B] Доказательства должны быть в первоначальном виде.<br>" +
            "Примечание: видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, " +
            "неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. " +
            "Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br><br>" +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>" +
            "[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прикрепление доказательств',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>" +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>" +
            "[B]3.6.[/B] Прикрепление доказательств обязательно.<br>" +
            "Примечание: загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается, " +
            "доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>" +
            "[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Требуется видеозапись',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В подобных ситуациях необходима видеозапись.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Неполная видеозапись',
            content:
            "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте.[/B][/SIZE]<br><br>" +
            "[SIZE=4][FONT=verdana]Предоставленная видеозапись является неполной.[/FONT][/SIZE]<br>"+
            '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/SIZE][/FONT]<br><br>' +
            "[/CENTER]<br>",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Проблема с доказательствами',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ссылки на доказательства недоступны или не воспроизводятся.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Игрок ранее был наказан',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Игрок ранее был заблокирован. Спасибо за обращение.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет условий (семья)',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В жалобах подобного рода необходимо предоставлять доказательства, содержащие условия взаимодействия со складом семьи, где четко указано, кто и сколько имеет право брать.<br>"+
            "При отсутствии таких условий администрация вправе отказать жалобу.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В жб на сотрудников',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обратитесь в раздел жалоб на сотрудников фракции.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: 'Передача теху',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Передано тех. специалисту.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: TEXY_PREFIX,
            status: true,
        },
        {
            title: 'Передача ГА',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Передано главному администратору.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
      ];

	 $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');
        addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(buttons[id].prefix, buttons[id].status);
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
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
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
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();