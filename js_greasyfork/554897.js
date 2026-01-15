// ==UserScript==
// @name         Скрипт КФ BIO Black Russia
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Стиль - скрипт для тех. раздела
// @author       I.Drag
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://postimg.cc/1fqy8FGB
// @grant        none
// @license dragsotka
// @downloadURL https://update.greasyfork.org/scripts/554897/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20BIO%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/554897/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20BIO%20Black%20Russia.meta.js
// ==/UserScript==

(function() {
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
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Самостоятельный вердикт - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Напишу сам',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша RolePlay биография отказана.[/CENTER]<br>'+
        '[CENTER]Причина: [/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Одобрено - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Одобрено',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша RolePlay биография одобрена[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказано - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Заголовок не по форме',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Заголовок RolePlay биографии не по форме[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Скопировано',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша RolePlay биография скопирована у другого игрока[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отсутствие фото персонажа',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]В вашей RolePlay биографии отсутствует фото персонажа[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша RolePlay биография составлена не по форме[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Биография знаменитости или админа',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша RolePlay биография была взята у мировой знаменитости / администратора проекта[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Свойства супергероя',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]В вашей RolePlay биографии присутствует присвоение сверхреальных свойств персонажу[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Биография от 3 лица',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]RolePlay биография должна быть составлена от 1 лица[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Грамматические/пунктуационные ошибки',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]В вашей RolePlay биографии слишком много граммматических/пунктуационных ошибок[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шрифт не по правилам',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Шрифт RolePlay биографии должен быть Times New Roman либо Verdana, минимальный размер — 15[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Логические противоречия',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]В RolePlay биографии не должно быть логических противоречий[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Минимальный объём биографии',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Минимальный объём RP биографии — 200 слов, максимальный — 600.[/CENTER]<br><br>'+
        '[CENTER]Исправьте указанные выше недостатки и создайте новую биографию[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
			pin: true,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}




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