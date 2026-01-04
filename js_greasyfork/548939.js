// ==UserScript==
// @name         RP биографии
// @namespace    https://forum.blackrussia.online/
// @version      1.1
// @description  Для КФ по биографиям
// @author       A.Gogol
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Kuk
// @icon https://ibb.co/mrdJkRWH
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/548939/RP%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/548939/RP%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
            title: 'Приветствие',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
        },
        {
            title: 'На рассмотрении',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=courier new]Ваша тема взята на рассмотрение.[/FONT][/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)][FONT=courier new]Просьба не создавать[/COLOR] дубликатов этой темы и ожидать ответа администрации.[/FONT][/CENTER]<br>" +
            "[CENTER][FONT=tahoma][I][COLOR=rgb(243, 121, 52)]На рассмотрении...[/COLOR][/I][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
     title: '__________________________________________RP биографии__________________________________________',
        },
        {
	        title: 'Одобрено',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Одобрено.[/I][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'На доработку',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вам даётся 24 часа на доработку вашей RolePlay биографии.[/I][/CENTER]<br>" +
            "[CENTER][I][COLOR=rgb(243, 121, 52)][FONT=times new roman]На рассмотрении...[/FONT][/COLOR][/I][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
	        title: 'Не доработал',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вы не доработали RP биографию за данные вам 24 часа.[/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказано(общий)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус: Отказано.<br>Причина: .[/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(не по форме)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Биография составлена не по форме.<br>Убедительно прошу ознакомиться с правилами написания RP биографий.[/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(заголовок)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Заголовок темы составлен не по форме.<br>Заполните его в формате: Биография | Nick_Name [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(копипаст)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Ваша биография скопирована. <br> Постарайтесь изложить свою идею. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(орфография)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Слишком много орфографических ошибок. <br> Проверьте свой текст на наличие ошибок в правописании. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(пунктуация)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Слишком много пунктуационных ошибок. <br> В вашей биографии неправильно раставлены знаки препинания, либо они вовсе отсутсвуют. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(нарушение правил игры)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Запрещено указывать факторы, позволяющие игроку нарушать правила игры. <br> Пример: в итогах игрок описывает, что его персонаж стал психически больным и теперь убивает всех, кого видит. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'Отказ(малый объем, менее 200 слов)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Слишком мало RP информации. <br> Минимальный объем информации из жизни вашего персонажа 200 слов. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
                {
	        title: 'Отказ(большой объем, более 600 слов)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Избыток RP информации. <br> Максимальный объем информации из жизни вашего персонажа 600 слов. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
                {
	        title: 'Отказ(нарушение шрифта и размера)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Нарушен шрифт текста и/или его размер. <br> Ваша биография должно быть написана шрифтом Times New Roman с минимальным размером 15. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
                {
	        title: 'Отказ(Сверхспособности)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Запрещено придавать вашему персонажу нереалистичные свойства. <br> Пример: В одиночку без оружия победили толпу вооруженных бандитов, либо упав с 10 этажа поднялись и пошли в больницу. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
                {
	        title: 'Отказ(малый объем, менее 200 слов)',
	        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша RP биография получает статус: Отказано.<br>Причина: Слишком мало RP информации. <br> Минимальный объем информации из жизни вашего персонажа 200 слов. [/I][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы RP', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#spec').click(() => editThreadData(SPEC_PREFIX, true));

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