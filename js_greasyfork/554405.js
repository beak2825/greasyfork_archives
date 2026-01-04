// ==UserScript==
// @name         Скрипт на обжалования
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для KAZAN
// @author       P.Moroznik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://avatars.mds.yandex.net/i?id=70fa275caf117351350b8ae6ac6116b2d1fc55e3-3752383-images-thumbs&n=13
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/554405/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554405/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const KOMANDE_PREFIX = 10;
const buttons = [

            {
        title: '------------------------------------------------------------ ОБЖАЛОВАНИЯ ----------------------------------------------------------------',
                                   },
                               {
        title: '| отказ |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]В обжаловании отказано.<br> Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                   {
        title: '| одобрено |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваше обжалование одобрено и наказание будет снято в ближайшее время.<br> Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                                   {
        title: '| не по форме |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваше обжалование составлено не по форме. Пожалуйста, ознакомьтесь с формой подачей здесь - [URL='https://forum.blackrussia.online/index.php?threads/3429398/']*кликабельно*[/URL].<br>Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                   {
        title: '| на рассмотрение |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваше обжалование было взято на рассмотрение. Ожидайте ответа в данной теме и не создавайте её дубликатов.<br>[color=orange]На рассмотрение.[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
                                   {
        title: '| теху |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Вы получили наказание со стороны технического специалиста. Обратитесь в раздел - Жалобы на технических специалистов.<br> С Уважением [color=pink]Nika_Acoverry[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                       {
        title: '| не подлежит разблокировке |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Данное наказание не подлежит разблокировке. <br>Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                   {
        title: '| окно бана |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Отсутствует скриншот окна блокировки.<br> Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]<br>"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                   {
        title: '| ответ дан |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Вам уже давали ответ в одних из прошлых тем.<br> Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]<br>"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                       {
        title: '| оффтоп |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваша тема никоем образом к данному разделу.<br> Закрыто. С Уважением [color=pink]Nika_Acoverry[/color]<br>"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                                       {
        title: '| ГА |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваше обжалование было передано Главному администратору.<br> Ожидайте ответа в данной теме. С Уважением [color=pink]Nika_Acoverry[/color]<br>"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
               prefix: MAINADM_PREFIX,
      status: true,
                       },
                                   {
        title: '| спецам |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE]Ваше обжалование было передано Специальной администрации. <br> Ожидайте ответа в данной теме. С Уважением[color=pink]Nika_Acoverry[/color]<br>"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>",
                   prefix: SPECADM_PREFIX,
      status: true,
                       },


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        	addButton('Ответы💥', 'selectAnswer');
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


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