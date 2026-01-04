// ==UserScript==
// @name         KALUGA | Скрипт by tevezz
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      1.1
// @description  Скрипт для КФ РП БИО
// @author       Federico_Tevezz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/554299/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.user.js
// @updateURL https://update.greasyfork.org/scripts/554299/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.meta.js
// ==/UserScript==

(async function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEX_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
        {
	  title: '-----------------------------------------------------------  РП Одобрено -----------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[B][font=georgia][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
  {
	  title: '-----------------------------------------------------------  РП Отказ  -----------------------------------------------------------------------',
	},
      {
      title: 'Отказано',
      content:
		"[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER]РП биография не соответсвует правилам её написания.<br>" +
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'На дороботке',
      content:
	            "[CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП биографии мало информации.<br>" +
		        '[B][CENTER]У вас есть 24 часа и исправление.<br>' +
		        "[B][CENTER]В противном случае рп биография будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
{
      title: 'Возраст не совпадает',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Год рождения и возраст не совподают.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]РП Биография составлена не по форме.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]РП Биография составлена от 3-го лица.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'КОПИПАСТ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]РП Биография скопирована.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'СУПЕРГЕРОЙ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы приписали суперсособности вашему герою.<br>"+
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ДУБЛИРОВАНИЕ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша биография была продублирована.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ОШИБКИ В СЛОВАХ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша биография написана с грамматическими / офографическими ошибками.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ЗАГОЛОВОК',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Заголовок вашей биографии заполнен не по форме.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: '2 БИО НА 1 АКК',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша биография является второй на один игровой аккаунт.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'МАЛО ТЕКСТА',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Вы написали мало текста в своей РП Биографии.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'ДОКВА ОТРЕДАКТИРОВАНЫ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
    ];

    $(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
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
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
        ? `Доброе утро`
        : 11 < hours && hours <= 15
        ? `Добрый день`
        : 15 < hours && hours <= 21
        ? `Добрый вечер`
        : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[COLOR=#00ffff][USER=${authorID}]${authorName}[/USER][/COLOR]`,
            },
            greeting: greeting
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