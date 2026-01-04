// ==UserScript==
// @name         KALUGA | Скрипт для ГС/ЗГС ОПГ
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      1.1
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Federico_Tevezz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/554214/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/554214/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Префикс отказана
    const ACCEPT_PREFIX = 8; // Префикс одобрено
    const PIN_PREFIX = 2; // Префикс закрепляет
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
        {
          title: '-----------------------------------------------------------  ЖАЛОБЫ НА ЛД  -----------------------------------------------------------------------',
	},
        {
            title: `НА РАССМОТРЕНИИ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `Ваша жалоба взята на рассмотрение.<br>` +
            `Пожалуйста, ожидайте ответа.<br><br>`+
            `[COLOR=orange][ICODE]На рассмотрении[/ICODE][/color][/CENTER][/FONT]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `ПРОВЕДЕНА БЕСЕДА`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `С лидером будет проведена профилактическая беседа.<br><br>` +
            `[COLOR=#00ff00][ICODE]Одобрено.[/ICODE][/color][/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `ПОЛУЧИТ НАКАЗАНИЕ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Лидер получит соответствующее наказание<br><br>` +

            `[COLOR=#00ff00][ICODE]Одобрено.[/ICODE][/color][/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `ЖАЛОБА НЕ ПО ФОРМЕ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            "Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +

            `[COLOR=red][ICODE]Отказано.[/ICODE][/color][/CENTER][/FONT]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В ЖБ НА СОТРУДНИКОВ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Вы ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br><br>` +

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/CENTER][/FONT]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не ЯВЛЯЕТСЯ ЛД`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Данный игрок не является лидером фракции.<br><br>` +

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/CENTER][/FONT]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ЛИДЕР БУДЕТ СНЯТ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `Лидер будет снят со своего поста.<br><br>` +
            `[COLOR=#00ff00][ICODE]Одобрено[/ICODE][/color][/CENTER][/FONT]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `НЕДОСТАТОЧНО ДОКОВ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Недостаточно доказательств, которые потверждают нарушение.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив их.<br><br>`+

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/CENTER][/FONT]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `НЕТ НАРУШЕНИЯ ЛД`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `Исходя из выше приложенных доказательств, нарушений со стороны лидера нет.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.<br><br>`+

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/CENTER][/FONT]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: `НА ДОКВАХ НЕТ НАРУШЕНИЯ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Проверив доказательства, было принято решение, что наказание выдано верно.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.<br><br>`+

            `[COLOR=red][ICODE]Закрыто[/ICODE][/color][/CENTER][/FONT]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `ОПРА ВНЕ ФОТОХОСТИНГА`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            "Внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на лидеров[/URL]»<br>"+
            "Также следует обратить внимание на данный пункт правил:[QUOTE]3.6 Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br><br> [/QUOTE]" +

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/FONT][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,

        },
        {
            title: `ОШИБКА РАЗДЕЛОМ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Ваше обращение не имеет отношения к данному форумному разделу.<br>`+
            `Возможно, вы ошиблись форумным разделом.<br><br>`+

            `[COLOR=red][ICODE]Отказано[/ICODE][/color][/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
          title: '-----------------------------------------------------  ОБЖ КРИМ НАКАЗАНИЙ  -----------------------------------------------------------------',
	},
        {
      title: 'ОДОБРЕНО',
	  content:
	    "[B][font=georgia][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваше обжалование получает статус одобрено.<br>" +
        "[B][CENTER]Наказание будет снято.<br><br>" +
		'[COLOR=#00ff00][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
            title: `ПРИКРЕПИТЬ ВК`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `Прикрепите ссылку на ваш VK.<br>` +
            `Обжалование взято на рассмотрение.<br><br>`+
            `[COLOR=orange][ICODE]На рассмотрении[/ICODE][/color][/CENTER][/FONT]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `ОТКАЗАНО`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
            `В данный момент мы не готовы пойти к вам на встречу и снять ваше наказание.<br>`+
            `В обжаловании отказано.<br><br>`+
            `[COLOR=#ff0000][ICODE]Отказано.[/ICODE][/color][/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `ОШИБКА РАЗДЕЛОМ`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Ваше обращение не имеет отношения к данному форумному разделу.<br>`+
            `Возможно, вы ошиблись форумным разделом.<br><br>`+

            `[COLOR=#FF0000][ICODE]Отказано.[/ICODE][/color][/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `СОКРАЩЕНИЕ СРОКА`,
            content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +

            `Ваше наказание будет смягчено, впредь не совершайте подобных ошибок.<br><br>` +

            `[COLOR=#00ff00][ICODE]Рассмотрено.[/ICODE][/color][/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
{
	  title: `ОБЖ НЕ ПО ФОРМЕ`,
	  content: `[FONT=georgia][CENTER][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR] <br><br>` +
		"[CENTER]Ваше обжалование было создано не по форме подачи. Ознакомиться с правилами можно в закрепленной теме.[/CENTER]<br><br>" +
		`[COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/color][/CENTER][/FONT]<br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: '-----------------------------------------------------------  РП БИОГРАФИИ  -----------------------------------------------------------------------',
	},
     {
      title: 'ОДОБРЕНО',
      content:
		"[B][font=georgia][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'ОТКАЗАНО',
      content:
		"[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER]РП биография не соответсвует правилам её написания.<br>" +
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'НА ДОРАБОТКЕ',
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
      title: 'ВОЗРАСТ НЕ СОВПАДАЕТ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Год рождения и возраст не совподают.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'НЕ ПО ФОРМЕ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]РП Биография составлена не по форме.<br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ОТ 3-ГО ЛИЦА',
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
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило приписание суперспособности своему персонажу / темы.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ДУБЛИРОВАНИЕ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование РП Биографии.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ОШИБКИ В СЛОВАХ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'ЗАГОЛОВОК',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание заговолка РП Биографии не по форме.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: '2 БИО НА 1 АКК',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографий.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'МАЛО ТЕКСТА',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило то, что Вы написали мало текста в своей РП Биографии.<br>",
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