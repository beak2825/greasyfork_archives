// ==UserScript==
// @name Скрипт для модерации форума cherepovets
// @namespace https://forum.blackrussia.online
// @version 1.4
// @description Предназначен для упрощения работы.
// @author -
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/550231/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20cherepovets.user.js
// @updateURL https://update.greasyfork.org/scripts/550231/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20cherepovets.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const COMMAND_PREFIX = 10; // Команда Проекта
    const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
	const PIN_PREFIX = 2; //  префикс закрепить
	const buttons = [
		{
			title: 'Приветствие',
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				' текст ',
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ РАЗДЕЛ РП БИОГРАФИИ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP биография взята на рассмотрение, мы внимательно изучим и вынесем вердикт, ожидайте.<br><br>",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Заголовок не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Заголовок вашей RP биографии должен быть составлен по следующей форме: Биография | Nick_Name<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Тема не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP биография должна быть составлена по следующей форме:<br>"+
                "[QUOTE]<br>" +
                "[COLOR=rgb(84, 172, 210)]Имя и фамилия персонажа:[/COLOR] Укажите полное имя (можно придумать необычное, но реалистичное).<br>" +
                "[COLOR=rgb(84, 172, 210)]Пол:[/COLOR] Мужской / Женский.<br>" +
                "[COLOR=rgb(84, 172, 210)]Возраст:[/COLOR] Реалистичный возраст, соответствующий опыту и занятиям персонажа.<br>" +
                "[COLOR=rgb(84, 172, 210)]Национальность:[/COLOR] Укажите страну или народ, к которому принадлежит персонаж.<br>" +
                "[COLOR=rgb(84, 172, 210)]Образование:[/COLOR] Опишите, где и чему учился персонаж: школа, колледж, университет, курсы или самообразование.<br>" +
                "[COLOR=rgb(84, 172, 210)]Описание внешности:[/COLOR] Рост, телосложение, цвет волос, глаз, особенности (шрамы, татуировки, манера одеваться).<br>" +
                "[COLOR=rgb(84, 172, 210)]Характер:[/COLOR] Опишите сильные и слабые стороны, темперамент, привычки.<br>" +
                "[COLOR=rgb(84, 172, 210)]Детство:[/COLOR] Кратко опишите семью, условия жизни, важные события в ранние годы (бедность, переезд, утрата, дружба).<br>" +
                "[COLOR=rgb(84, 172, 210)]Настоящее время:[/COLOR] Чем персонаж занимается сейчас: работа, место жительства, социальный статус, круг общения.<br>" +
                "[COLOR=rgb(84, 172, 210)]Итог:[/COLOR] Опишите, какие качества и цели сформировались у персонажа после всех событий. Это подводит итог всей биографии.<br>" +
                "[/QUOTE]<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нереалистично и сверхспособности",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP биография должна быть составлена реалистично — ваш персонаж не может обладать сверхспособностями.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Существующий человек",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено составлять биографию уже существующих людей.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Копирование других",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено копировать чужие RP биографии.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Ошибки в тексте",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP биография должна быть читабельна и не содержать грамматических или орфографических ошибок.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Шрифт и размер",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Шрифт вашей RP биографии должен быть Times New Roman либо Verdana, а минимальный размер — 15.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нет медиафайлов",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В вашей RP биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нарушение правил серверов",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено включать в RP биографию факторы, позволяющие нарушать правила сервера.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
				{
			title: "Количество символов",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Минимальный объём символов RP биографии — 200 слов, а максимальный — 600.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нелогичность",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "В вашей RP биографии не должно быть логических противоречий.<br><br>" +
				"Отказано, закрыто.",
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ РАЗДЕЛ РП СИТУАЦИИ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация взята на рассмотрение, мы внимательно изучим и вынесем вердикт, ожидайте.",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Заголовок не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Заголовок вашей RP ситуациеи должен оформляться по форме: [Краткое название события] Событие<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Тема не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация должна быть составлена по следующей форме:<br>" +
				"[QUOTE]<br>" +
				"[COLOR=rgb(84, 172, 210)]Название: [/COLOR][COLOR=rgb(255, 255, 255)]*название*[/COLOR]<br>" +
                "[COLOR=rgb(84, 172, 210)]Пролог:[/COLOR] (введение / предыстория)<br>" +
                "[COLOR=rgb(84, 172, 210)]Сюжет: [/COLOR][COLOR=rgb(255, 255, 255)](основная часть RP ситуации)[/COLOR]<br>" +
                "[COLOR=rgb(84, 172, 210)]Эпилог: [/COLOR][COLOR=rgb(255, 255, 255)](заключение / итоги)[/COLOR]<br>" +
                "[COLOR=rgb(84, 172, 210)]Ссылка на исходные материалы с отыгровками: [/COLOR][COLOR=rgb(255, 255, 255)]*ссылка*[/COLOR]<br>" +
				"[/QUOTE]<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "IC информация",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В вашей RP ситуации должна быть отражена только внутриигровая информация.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Ошибки в тексте",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация должна быть составлена грамотно, с соблюдением правил орфографии и пунктуации.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нереалистично и сверхспособности",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация должна быть правдоподобной и реалистичной; в ней не должно быть сверхъестественных явлений.<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нет медиафайлов",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Вашу RP ситуацию должны сопровождать скриншоты или видеоматериалы с места событий.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "На медиафайлах OOC информация и интерфейс",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В вашей RP ситуации скриншоты не должны содержать OOC-информацию и интерфейс, кроме того, который нельзя убрать системно.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нет RP отыгровок",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"В конце вашей RP ситуации вы должны предоставить ссылку на исходные материалы, где видны RP отыгровки.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Шрифт и размер",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Копирование других",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено копировать чужие RP ситуации.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нарушение правил форума",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"При составлении RP ситуации запрещено нарушать правила форума.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ РАЗДЕЛ НЕОФИЦИАЛЬНЫЕ РП ОРГАНИЗАЦИИ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша Неофициальная RP организация взята на рассмотрение, мы внимательно изучим и вынесем вердикт, ожидайте.",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: "Заголовок не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Заголовок вашей темы должен быть оформлен по шаблону: Неофициальная RP организация [Название]<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Тема не по форме",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша RP ситуация должна быть составлена по следующей форме:<br>" +
				"[QUOTE]<br>" +
				"Название вашей организации:<br>" +
                "История создания:<br>" +
                "Состав участников:<br>" +
                "Устав:<br>" +
                "Описание деятельности:<br>" +
				"Отличительная визуальная особенность:<br>" +
				"Как и где можно попасть в вашу организацию:<br>" +
				"Ссылка на одобренную RP биографию:<br>" +
				"[/QUOTE]<br><br>" +
                "Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нарушение правил проекта и форума",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Неофициальная RP организация не должна вести деятельность, нарушающую правила проекта и форума.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Копирование других",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Создание в форме гос фракций",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Запрещено создавать организации в форме государственных фракций.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Не совпадает тематика с заголовком",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Название организации должно отражать её тематику.<br><br>" +
				"Отказано, закрыто.",
			prefix: UNACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Нет медиафайлов",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Заявление на организацию должно сопровождаться фото- или видеоматериалами.<br>" +
				"А также, скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).<br><br>" +
				"Отказано, закрыто.",
         	prefix: UNACCEPT_PREFIX,
			status: false,
		},
	];
 
	$(document).ready(() => {
		// Загрузка скрипта для обработки шаблонов
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
		// Добавление кнопок при загрузке страницы
		
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
		addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
		addButton('Выбрать ответ', 'selectAnswer', 'border-radius: 20px; margin-right: 100x; border: 2px solid;  border-color: #3885e9;');
 
		// Поиск информации о теме
		const threadData = getThreadData();
 
		$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
		$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
		$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
		$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
		$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
		$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
		$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
		$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
 
		$(`button#selectAnswer`).click(() => {
			XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
 
	function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
			`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
		);
	}
	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
			.map(
				(btn, i) =>
					`<button id="answers-${i}" class="button--primary button ` +
					`rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
			)
			.join('')}</div>`;
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
