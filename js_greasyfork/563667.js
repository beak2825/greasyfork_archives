// ==UserScript==
// @name        Спец заказ для Влада
// @namespace   Violentmonkey Scripts
// @match       https://forum.blackrussia.online/*
// @grant       none
// @version     1.1
// @author      Sasha_Prishvin
// @license     
// @description 09.01.2026, 20:04:00
// @downloadURL https://update.greasyfork.org/scripts/563667/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%BB%D0%B0%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563667/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%BB%D0%B0%D0%B4%D0%B0.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
const ZAKRUTO_PREFIX = 7;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const SPECY_PREFIX = 11;
const OJIDANIE_PREFIX = 14;
const REALIZOVANO_PREFIX = 5;
const PREFIKS = 0;
const KACHESTVO = 15;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const data = await getThreadData(),
      greeting = data.greeting, // greeting уже строка!
      user = data.user;
const buttons = [
        {
            "title": "--Заготовки ответов--",
            "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin-top: 0px; margin-bottom: 5px; margin-left: auto; margin-right: auto;",
            "class": "answer-button"
        },
        {
            title: ' ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)][B][ICODE]*{{ authorName }}*[/ICODE][/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B] [/B][/FONT][/CENTER]<br>' +
                '[CENTER][FONT=book antiqua][B] [/B][/FONT][/CENTER]<br>' +
                '[CENTER][FONT=book antiqua][B] [/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B]][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Приветствие',
            content:
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER] текст [/CENTER]',
        },
        {
            title: 'Дубликат',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][FONT=book antiqua][B][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/B][/FONT][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B]Ваша тема является дубликатом вашей предыдущей темы. Просьба не создавать дубликаты тем, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/B][/FONT][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=#ffa500][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            send: false,
        },
        {
            title: 'Переношу в нужный раздел',
            content:
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][B][FONT=verdana]Данная тема никак не относится к этому разделу.[/FONT][/B]' +
                '[CENTER][B][FONT=verdana]Переношу ваше обращение в соответствующий для этого раздел.[/FONT][/B][/CENTER]' +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
            send: false,
        },
        {
            "title": "--Рассмотрение жалоб на техов--",
            "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin: 5px auto;",
            "class": "answer-button"
        },
        {
            title: 'Руководству',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Ваша тема закреплена и передана Куратору технических специалистов / Заместителю куратора технических специалистов.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 165, 0)][B][ICODE]На рассмотрении.[/ICODE][/B][/FONT][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
            send: true,
        },
        {
            title: ' в жб на адм ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Вы получили наказание от администрации своего сервера, не как не от технического специалиста. Обратитесь в раздел «Жалобы на администрацию» вашего сервера.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
            send: true,
        },
        {
            title: ' рассмотрение ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Тема закреплена и взята на рассмотрение, ожидайте ответа в ней. Не дублируйте.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 165, 0)][B][ICODE]На рассмотрении.[/ICODE][/B][/FONT][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
            send: true,
        },
        {
            title: ' не относится к жалобам на техов ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Созданное вами обращение не относится к «Жалобам на технических специалистов». Просьба более детально изучить назначение данного раздела.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
            send: true,
        },
        {
            title: ' нет окна блокировки ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Тема без окна блокировки не подлежит рассмотрению. Пожалуйста, пересоздайте тему, приложив доказательства из любых хостингов.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
            send: true,
        },
        {
            title: ' жб не по форме ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Ваша жалоба составлена не по форме. Пожалуйста, пересоздайте тему, заполнив её по форме ниже:[/B][/FONT][/CENTER]<br><br>' +
                '[CENTER][FONT=book antiqua][B]1. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
            send: true,
        },
        {
            title: ' срок подачи жалобы ',
            content:
                "[CENTER][FONT=book antiqua][B]Здравствуйте, уважаемый (-ая)[/B][/FONT][/CENTER]<br>" +
                `[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 255, 255)] ${user.mention} [/B][/FONT][/CENTER]<br>` +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                '[CENTER][FONT=book antiqua][B]Срок подачи жалобы на технического специалиста - 14 дней. К сожалению, жалоба рассмотрению не подлежит.[/B][/FONT][/CENTER]<br>' +
                "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
                "[CENTER][FONT=book antiqua][B][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/B][/FONT][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
            send: true,
        },
    ];

    $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
           addButton('👑 ШАБЛОНЧИКИ 😎', 'selectAnswer');

    // Поиск информации о теме
//     const threadData = getThreadData();

//     $('button#pin').click(() => editThreadData(PIN_PREFIX, false, false));
//     $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
//     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
//     $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
//     $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

//     $(`button#selectAnswer`).click(() => {
//         XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
//         buttons.forEach((btn, id) => {
//             if(id >= 1) {
//                 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
//             } else {
//                 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
//             }
//         });
//     });
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
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
    mention: `[USER=${authorID}]${authorName}[/USER]`,  // `[USER=${authorID}]${authorName}[/USER]`,
  },
  greeting:
  4 < hours && hours <= 11
    ? 'Доброе утро'
    : 11 < hours && hours <= 15
    ? 'Добрый день'
    : 15 < hours && hours <= 21
    ? 'Добрый вечер'
    : 'Доброй ночи',
};
}

$(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Закрыто`, `zakruto`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#zakruto`).click(() => editThreadData(ZAKRUTO_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,           // !
        )
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true && buttons[id].prefix && buttons[id].status !== undefined) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

    async function getThreadData() {
      const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
      const authorName = $('a.username').html();
      const hours = new Date().getHours();

      const greeting = 4 < hours && hours <= 11
          ? 'Доброе утро'
          : 11 < hours && hours <= 15
          ? 'Добрый день'
          : 15 < hours && hours <= 21
          ? 'Добрый вечер'
          : 'Доброй ночи';

      return {
          user: {
              id: authorID,
              name: authorName,
              mention: `[USER=${authorID}]${authorName}[/USER]`,
          },
          greeting: greeting // теперь это просто строка
      };
  }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    discussion_open: 1,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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