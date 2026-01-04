// ==UserScript==
// @name         Жалобы для Айдара
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description  by Edik Livingston
// @author       Edik Livingston
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557941/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B9%D0%B4%D0%B0%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557941/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B9%D0%B4%D0%B0%D1%80%D0%B0.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
     const TECH_PREFIX = 13;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `Приветствие`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN» [/COLOR][/FONT][/SIZE][/CENTER]`,
        },
        {
        title: '----------  Жалоба на адм  ------------------------------------------------------------------------------------------------------------------------',
        },
         {

            title: `Нету нарушение`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Нарушений со стороны администратора - не имеется!<br>`+
            `[CENTER] Отказано,закрыто. [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN» [/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
{
        title: ` 48 часов `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br><br>"+
        `Отказано, закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
	  title: `ЖБ от 3 лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `Отказано,закрыто! [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN» [/COLOR][/FONT][/SIZE][/CENTER]`,
	     prefix: PIN_PREFIX,
	     status: true,
	       },
           {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER] Отказано,закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] Закрыто<br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
           },
           {
            title: `Правила раздела`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER]Отказано, закрыто.[/CENTER][/FONT]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере ««MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
           },
            {
            title: `Окно бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
            `[CENTER] Отказано,закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN» [/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `наказание будет снято`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `адм будет наказан`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>CENTER]<br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Админ прав`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `адм будет снят`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, администратор будет снят.<br>CENTER]<br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Жалоба не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы. <br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `В раздел обж`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая)${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3933/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER] Отказано,закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },






        {
        title: '----------  обж и жб ------------------------------------------------------------------------------------------------------------------------',
        },
{
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193316/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
{
	  title: `Передано спец.адм`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
		"[CENTER]Ваше обжалование передано специальной администрации.[/CENTER]<br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
{
	  title: `Передано ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба/обжалование передана/передано Главному Администратору  <br><br>"+
        `На рассмотрении. <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «MAGADAN»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
 {
            title: `Дубль`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
            `[CENTER]Вам уже был дан ответ, просьба прекратить дублировать темы, иначе вам будет выдана блокировка ФА.[/CENTER]<br>` +
		    `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
            title: `Доква отредактированы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
            `[CENTER]Для рассмотрения жалобы вам необходимо предоставить полные доказательства без каких-либо признаков редактирования.[/CENTER]<br>` +
		    `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
            title: `Нерабочая ссылка`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
            `[CENTER]Вы предоставили нерабочую ссылку.[/CENTER]<br>` +
		    `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
   {
            title: `Не тот сервер`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
            `[CENTER]Вам необходимо оставить обращение в соответствующем разделе для вашего сервера.[/CENTER]<br>` +
		    `[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
	  title: `бан айпи`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Попробуйте перезагрузить роутер или телефон  <br><br>"+
        `Проблема должна пропасть. <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE»[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: true,
	},
{
	  title: `Технический специалист`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
		"[CENTER]Данный администратор является или являлся техническим специалистом, поэтому вам необходимо обратиться в раздел жалоб на технических специалистов.[/CENTER]<br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Технический раздел`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}.[/CENTER]<br>` +
		"[CENTER]В вашем случае необходимо обратиться в технический раздел.[/CENTER]<br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},


{},

    ];

$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
         addButton(`Выбор автоматических ответов`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
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
            ? `Здравствуйте`
            : 11 < hours && hours <= 15
                ? `Здравствуйте`
                : 15 < hours && hours <= 21
                    ? `Здравствуйте`
                    : `Здравствуйте`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
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