// ==UserScript==
// @name         BLACK RUSSIA: скрипт для кураторов форума
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Связь: vk.com/islam.banan
// @author       Ислам Банан
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/554433/BLACK%20RUSSIA%3A%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/554433/BLACK%20RUSSIA%3A%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // Отказано
	const CLOSE_PREFIX = 7; // Закрыто
	const RASSMOTRENIE_PREFIX = 2; // На рассмотрении
	const RESHENO_PREFIX = 6; // Решено
	const ACCEPT_PREFIX = 8; // Одобрено
	const PIN_PREFIX = 2; // Закрепление темы
	const WATCHED_PREFIX = 9; // Рассмотрено
	const WAIT_PREFIX = 14; // Ожидание
	const GA_PREFIX = 12; // Главному администратору
	const TECH_PREFIX = 13; // Техническому специалисту
	const SPEC_PREFIX = 11; // Специальному администратору
	const COMMANDS_PREFIX = 10; // Команде проекта
	
	const buttons = [
	{
		title: 'Раздел жалобы на игроков',
		dpstyle: 'oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; width: 95%;',
	},
	{
		title: 'На рассмотрении',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша жалоба на рассмотрении.[/CENTER]",
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Причины отказа',
		dpstyle: 'color: #fff; background: #db2309;',
	},
	{
		title: 'Не по форме',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша жалоба составлена не по форме.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Нет нарушений',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Со стороны игрока нет нарушений.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Недостаточно доказательств',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Недостаточно доказательств для принятия решения.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Ответ дан ранее',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ответ был дан ранее в прошлой жалобе.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Дублирование',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Просим не дублировать темы.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Сервер',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Переношу тему на нужный сервер.[/CENTER]",
		prefix: WAIT_PREFIX,
		status: true,
	},
	{
		title: 'Раздел без переноса',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Вы ошиблись разделом.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Раздел с переносом',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Переношу тему в нужный раздел.[/CENTER]",
		prefix: WAIT_PREFIX,
		status: true,
	},
	{
		title: 'Нет time',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Тайм-коды',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Если видео длится 3 и более минут, вы должны указать тайм-коды.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Более 72 часов',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]С момента нарушения игрока прошло более 72 часов.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Соц. сети',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Доказательства должны быть загружены на фото или видеохостинг, загрузка в социальные сети запрещается.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Нет условий сделки',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]На ваших доказательствах отсутствует условия сделки.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Нужен фрапс',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В данных случаях необходим видеозапись экрана.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Неполный фрапс',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Видеозапись не полная.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не работают док-ва',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваши доказательства не рабочие.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Док-ва отредактирована',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваши доказательства отредактированы.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'От 3-го лица',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша жалоба от 3-го лица.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Ответный DM',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В случае ответного DM необходим видеозапись.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Хостинг',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Доказательства должны быть загружены на фото или видеохостинги.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Слив склада',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В случае слива склада семьи необходимы доказательства по данным пунктам:[/CENTER]<br>" + "[CENTER]1. Где видно, что вы являетесь лидером.[/CENTER]<br>" + "[CENTER]2. Объявление в семье, которая запрещает брать определенное количество денег, патронов и так далее.[/CENTER]<br>" + "[CENTER]3. Доказательства в виде видеозаписи, где подробно виден слив склада от игрока.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Наказания',
		dpstyle: 'color: #fff; background: #db2309;',
	},
	{
		title: 'Будет заблокирован',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Игрок будет заблокирован.[/CENTER]<br><br>" + "[CENTER]Одобрено. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Будет выдан мут',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Игрок получит блокировку чата.[/CENTER]<br><br>" + "[CENTER]Одобрено. Закрыто.[/CENTER]",
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Получит JAIL',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Игрок будет помещен в деморган.[/CENTER]<br><br>" + "[CENTER]Одобрено. Закрыто.[/CENTER]",
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Получит WARN',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Игрок получит предупреждение.[/CENTER]<br><br>" + "[CENTER]Одобрено. Закрыто.[/CENTER]",
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передача жалобы',
		dpstyle: 'oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; width: 95%;',
	},
	{
		title: 'Руководство КФ',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша жалоба передана руководству КФ.[/CENTER]<br><br>" + "[CENTER]На рассмотрении.[/CENTER]",
		prefix: PIN_PREFIX,
		status: false,
	},
	{
		title: 'Техническому специалисту',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша жалоба передана техническому специалисту.[/CENTER]<br><br>" + "[CENTER]На рассмотрении.[/CENTER]",
		prefix: TECH_PREFIX,
		status: false,
	},
	{
		title: 'RolePlay биографии',
		dpstyle: 'oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; width: 95%;',
	},
	{
		title: 'На рассмотрении',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша биография на рассмотрении.[/CENTER]",
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Одобрено',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша биография одобрена.[/CENTER]<br><br>" + "[CENTER]Одобрено. Закрыто.[/CENTER]",
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не по форме',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Ваша биография не по форме.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Заголовок не по форме',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Заголовок вашей биографии не по форме.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Многочисленные ошибки',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В биографии имеются грамматические, орфографические и пунктуационные ошибки.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: "Супер-способности",
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В биографии персонаж не должен обладать сверхспособностями.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Биография скопирована',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Биография скопирована.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Менее 200 слов',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В биографии менее 200 слов.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Более 600 слов',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В биографии более 600 слов.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Шрифт текста',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Шрифт биографии должен быть Times New Roman либо Verdana.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Размер текста',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]Минимальный размер текста — 15.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Логические противоречия',
		content: "[CENTER]{{ greeting }}.[/CENTER]<br><br>" + "[CENTER]В биографии имеются логические противоречия.[/CENTER]<br><br>" + "[CENTER]Отказано. Закрыто.[/CENTER]",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	];

	$(document).ready(() => {
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

		addAnswers();

		const threadData = getThreadData();

		$('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
		$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
		$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
		$('button#commands').click(() => editThreadData(COMMANDS_PREFIX, true));
		$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
		$('button#resheno').click(() => editThreadData(RESHENO_PREFIX, false));
		$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
		$('button#tech').click(() => editThreadData(TECH_PREFIX, true));

		$(`button#selectAnswer`).click(() => {
			XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
			buttons.forEach((btn, id) => {
				if (btn.content) {
					$(`button#answers-${id}`).click(() => pasteContent(id, threadData, btn.status));
				}
			});
		});
	});

	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`);
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
			.map(
				(btn, i) =>
					`<button id="answers-${i}" class="button--primary button ` +
					`rippleButton" style="margin:4px; ${btn.dpstyle || ''}"><span class="button-text">${btn.title}</span></button>`
			)
			.join('')}</div>`;
	}

	function pasteContent(id, data = {}, send = false) {
		const template = Handlebars.compile(buttons[id].content);
		if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

		$('span.fr-placeholder').empty();
		$('div.fr-element.fr-view p').append(template(data));
		
		// Закрываем окно выбора ответов
		$('.overlay-container').remove();
		$('.overlay').remove();

		if (send === true) {
			editThreadData(buttons[id].prefix, buttons[id].status);
			// Даем время на обновление префикса перед отправкой сообщения
			setTimeout(() => {
				$('.button--icon.button--icon--reply.rippleButton').trigger('click');
			}, 500);
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
			greeting: 
				4 < hours && hours <= 11 ? 'Доброе утро' :
				11 < hours && hours <= 15 ? 'Добрый день' :
				15 < hours && hours <= 21 ? 'Добрый вечер' : 'Доброй ночи'
		};
	}

	function editThreadData(prefix, pin = false) {
		const threadTitle = $('.p-title-value')[0].lastChild.textContent;

		const formData = {
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		};

		if (pin === true) {
			formData.discussion_open = 1;
			formData.sticky = 1;
		}

		fetch(`${document.URL}edit`, {
			method: 'POST',
			body: getFormData(formData),
		}).then(() => {
			// Не обновляем страницу сразу, чтобы можно было отправить сообщение
			if (!pin) {
				location.reload();
			}
		});
	}

	function getFormData(data) {
		const formData = new FormData();
		Object.entries(data).forEach(i => formData.append(i[0], i[1]));
		return formData;
	}
})();