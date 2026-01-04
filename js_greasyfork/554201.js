// ==UserScript==
// @name         скрипт для РП биографий
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Для РП биографий KALUGA (от 23.09.25)
// @author       bushido flarense
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/W3pqXfvX/fe653e14fa46ee4ebeca1cac5c277b9e.jpg
// @downloadURL https://update.greasyfork.org/scripts/554201/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/554201/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13; 
const buttons = [
    {
      title: 'свой ответ (отказ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] Текст [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
    },
    {
      title: 'свой ответ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] Текст [/FONT][/CENTER]<br>",
    },

    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Биография одобрена / на дополнение  ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'био одобрена',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша RolePlay биография получает статус - [COLOR=LIME]Одобрено.[/COLOR][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Желаем вам приятной игры на просторах сервера [COLOR=#4169E1]KALUGA[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: true,
    },
    {
        title: 'дополнить информацию (24ч)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей RolePlay биографии недостаточно информации о персонаже. В течении 24-ех часов увеличьте количество информации в каждом из пунктов: Детство, Юность и взрослая жизнь, Настоящее время. [/FONT][/CENTER]<br>",
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
        title: 'дополнить детство',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей RolePlay биографии недостаточно информации о детстве персонажа. В течении 24-ех часов увеличьте количество информации в пункте «Детство» [/FONT][/CENTER]<br>",
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
        title: 'дополнить настоящее время',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей RolePlay биографии недостаточно информации о настоящем времени персонажа. В течении 24-ех часов увеличьте количество информации в пункте «Настоящее время» [/FONT][/CENTER]<br>",
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
        title: 'дополнить итог',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей RolePlay биографии недостаточно информации о итогах биографии вашего персонажа. В течении 24-ех часов увеличьте количество информации в пункте «Итог» [/FONT][/CENTER]<br>",
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Отказ биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте. <br>' +
        "<br> [CENTER][FONT=trebuchet ms]Ваша RolePlay биография составлена не по форме. Биография должна быть написана по данной форме:[/FONT] <br>" +
        "[QUOTE][Center][FONT=trebuchet ms][SIZE=4]Имя и фамилия персонажа:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Пол:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Возраст:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Национальность:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Образование:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Описание внешности:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Характер:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Детство:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Настоящее время:<br>"+
        "[FONT=trebuchet ms][SIZE=4]Итог:[/QUOTE]<br>"+
        "[FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Мало информации',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей RolePlay биографии недостаточно информации. Увеличьте количество информации и создайте биографию повторно, минимальный объём RP биографии — 200 слов.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Скопирована/украдена',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша RolePlay биография скопирована или украдена у другого игрока.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-о лица',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша RolePlay биография написана от 3-е лица.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Заголовок не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Заголовок RolePlay биографии составлен не по форме. Напомним, что Заголовок создаваемой темы должен быть написан строго по данной форме: « Биография | Nick_Name »[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'имя на английском',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Имя и Фамилия написаны на английском языке. Пример создаваемого Имени и Фамилии в биографии: « Имя Фамилия: Василий Иванов »[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'возраст не совпал с датой рождения',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Возраст персонажа не совпадает с его датой рождения.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'много ошибок',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В Биографии было допущено большое количество ошибок.<br> Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'много пунктуац. ошибок',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В Биографии было допущено большое количество пунктуационных ошибок.<br> Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп ник',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]У вашего персонажа не реалистичное имя (nRP). Смените игровой никнейм и напишите биографию повторно.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже есть биография',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]У вас уже имеется одобренная RolePlay биография. Для одного игрового аккаунта может быть создано не более одной биографии.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms]Советуем ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']с правилами составления RP биографий (Нажмите сюда)[/URL]<br>"+
        '<br>[FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },

];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Ответы (РП биографии)', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(16, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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


function moveThread(prefix, type) {
// Перемещение темы
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
})();