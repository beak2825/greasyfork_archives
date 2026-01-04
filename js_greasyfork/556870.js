// ==UserScript==
// @name   script_by_Sunshine
// @name:ru Answers ЖБ
// @description  Suggestions for improving the script write here ---> https://vk.com/mr_khvan
// @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://vk.com/mr_khvan
// @version 1.12
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   MIT
// @supportURL https://vk.com/mr_khvan | R. Sunshine | VOLOGDA
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/556870/script_by_Sunshine.user.js
// @updateURL https://update.greasyfork.org/scripts/556870/script_by_Sunshine.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ   👨‍💻 Жалобы на администрацию 👨‍💻    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'На рассмотрении',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]「На рассмотрении」 [/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: PINN_PREFIX,
      status: true,
    },
    {
      title: 'Будет проведена работа',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приносим свои глубочайшие извинения за предоставленные неудобства, с администратором будет проведена работа.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Наказание будет снято.[/FONT][/I][/B][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]「Решено ❖ Закрыто」[/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>"+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Приняты меры к админу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]К администратору предприняты меры, приносим свои извинения. <br><br> Ваша тема будет пересмотрена.[/FONT][/I][/B][/CENTER] <br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>"+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Наказание будет снято',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Наказание будет снято.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>"+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Выдано верно',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Со стороны администратора отсутствуют нарушения, наказание выдано [COLOR=rgb(255, 0, 0)] верно [/color].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Нет нарушений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Наказание выдано верно, нарушений со стороны администратора нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Спец. администратору',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Специальному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]<br><br>' +
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: SPECY_PREFIX,
      status: true,
    },
     {
      title: 'Передано ГА',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Главному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
        "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name администратора:[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Дата выдачи/получения наказания:[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Суть жалобы:[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]5.[/color] Доказательства:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование темы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ был дан в прошлой теме. Напомню, что если Вы продолжите создавать идентичные темы - к Вашему форумному аккаунту могут быть применены санкции в виде блокировки.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на тех. спеца',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в [U][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9682-vologda.3604/']раздел жалоб на технических специалистов[/URL][/U].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '48 часов',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента выдачи наказания прошло более 48 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]<br><br>'+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]",
      prefix: CLOSE_PREFIX,
      status: false,
    },

    {
      title: 'Переношу в нужный раздел',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Wzk0xcFH/IMG-7319.gif[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JzzrkT4p/IMG-7328.png[/img][/url][/CENTER]<br><br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Переношу Вашу тему в необходимый раздел.[/CENTER]<br><br>"+
        "[CENTER][B][Color=rgb(178, 34, 34)]❖ ────── ✦ ──────『✙』────── ✦ ────── ❖[/B][/CENTER][/color]"
    },

  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Answers', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });

  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #BF40BF;">${name}</button>`,
    );
  }

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
                              sticky: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }

function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
    prefix_id: prefix,
    title: threadTitle,
    target_node_id: type,
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
    }
})();