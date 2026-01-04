// ==UserScript==
// @name Скрипт для кураторов форума cherepovets
// @namespace https://forum.blackrussia.online
// @version 1.2
// @description Предназначен для упрощения работы.
// @author -
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/551966/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20cherepovets.user.js
// @updateURL https://update.greasyfork.org/scripts/551966/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20cherepovets.meta.js
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
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ПРАВИЛА ИГРОВОГО ПРОЦЕССА ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
		{
			title: 'На рассмотрение',
			color: ' #FF8C00',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Ваша жалоба взята на рассмотрение, мы внимательно изучим и вынесем вердикт, ожидайте.<br><br>",
			prefix: PIN_PREFIX,
			status: true,
		},
		{
			title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ИГРОВЫЕ ЧАТЫ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
		},
	    {
			title: "CapsLock",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.02. [/COLOR]Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут.[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "OOC оскорбления",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)]| Mute 30 минут.[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Оскорбление/упоминание родных",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]" +
                "[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термины «MQ», «rnq» расценивается, как упоминание родных.[/INDENT]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "FLOOD",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
				"Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)]| Mute 30 минут.[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Злоупотребление символами",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.06. [/COLOR]Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]" +
                "[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Слив глобального чата",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Выдача себя за администратора",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.10. [/COLOR]Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Музыка в VOICE чат",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.14. [/COLOR]Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)]| Mute 60 минут[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Шум в VOICE чат",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.16. [/COLOR]Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]" +
                "[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать) [/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Пропаганда политики и религии/провокация к конфликту и призыв к масс флуду",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.18. [/COLOR]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Программа для голоса",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.19. [/COLOR]Запрещено использование любого софта для изменения голоса [COLOR=rgb(255, 0, 0)]| Mute 60 минут[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Транслит",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.20. [/COLOR]Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]" +
				"[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Реклама промокода",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR]" +
                "[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/INDENT]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/INDENT]" +
				"[INDENT=3][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Объявления в помещениях ГОСС",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]" +
				"[/LIST]" +
                "[INDENT=3][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/INDENT]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
		{
			title: "Мат в VIP чат",
			color: '',
			content:
				"{{ greeting }}, уважаемый [COLOR=rgb(84, 172, 210)]{{ user.name }}[/COLOR].<br><br>" +
                "Игрок понесет наказание по следующему пункту правил:<br>" +
                "[LIST]" +
                "[*][COLOR=rgb(255, 0, 0)]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]" +
                "[/LIST]<br><br>" +
                "Одобрено, закрыто.",
			prefix: ACCEPT_PREFIX,
			status: false,
		},
	]
 
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
