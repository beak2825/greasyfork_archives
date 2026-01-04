// ==UserScript==
// @name         Kaluga | Скрипт для ГС/ЗГС
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      1.1
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Federico_Tevezz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/553640/Kaluga%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/553640/Kaluga%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
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
          title: '----------  ДЛЯ ГС/ЗГС  ------------------------------------------------------------------------------------------------------------------------',
	},
        {
            title: `На рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            `Ваша жалоба взята на рассмотрение.<br>` +
            `Пожалуйста, ожидайте ответа.<br>`+
            `[COLOR=orange]На рассмотрении...[/color][/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            `С лидером будет проведена профилактическая беседа.<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Получит наказание`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br>` +
            `Лидер получит соответствующее наказание<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            "Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Вы ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не является ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Данный игрок не является лидером фракции.<br>` +
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Лидер будет снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Лидер будет снят со своего поста.<br>` +
            `[COLOR=green]Одобрено[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Недостаточно доков`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Недостаточно доказательств, которые потверждают нарушение.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив их.<br>`+
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушения ЛД`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Исходя из выше приложенных доказательств, нарушений со стороны лидера нет.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.<br>`+
            `[COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: `Доква проверены нарушений нет`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Проверив доказательства, было принято решение, что наказание выдано верно.<br>`+
            `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.<br>`+
            `[COLOR=red] Закрыто[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Опра вне фотохостинга`,
            content:`[CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый(ая) ${user.mention}.<br><br>`+
            "Внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на лидеров[/URL]»<br><br>"+
            "Также следует обратить внимание на данный пункт правил:[QUOTE]3.6 Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE]"+
            `[COLOR=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
 
        },
        {
            title: `Ошибка разделом`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая) ${user.mention}.<br><br>` +
            `Ваше обращение не имеет отношения к данному форумному разделу.<br>`+
            `Возможно, вы ошиблись форумным разделом.<br>`+
            `[COLOR=red]Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
           {
          title: '----------  ДЛЯ ПЕРЕДАЧИ ЖБ  ------------------------------------------------------------------------------------------------------------------------',
	},
	{
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]Здравствуйте, уважаемый игрок[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «KALUGA» [/COLOR][/FONT][/SIZE][/CENTER]`,
	     prefix: PIN_PREFIX,
	     status: true,
	       },
     {
      title: 'ГА',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'Теху',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TEX_PREFIX,
	  status: false,
    },
	 {
      title: 'КП',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Команде Проекта.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
	{
      title: 'Спец Адм',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Специальному Администратору или же его Заместителю.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
	  {
          title: '----------  ЖБ НА ИГРОКОВ  ------------------------------------------------------------------------------------------------------------------------',
	},
	  {
      title: 'Игрок будет наказан',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Игрок будет наказан.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Отсутствует /time',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсутствует /time.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'От третьего лица',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 3 дней',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Не по форме жалоба',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба состоит не по форме.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нет доказательств',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]К Вашим доказательствам нет доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нарушений не найдено',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Нарушений со стороны игрока не найдено.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Док-ва через соц. сети',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно докв',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Недостаточно доказательств на нарушение от данного игрока.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Дублирование темы',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нужен фрапс',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Док-ва отредактированы ',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
 {
          title: '----------  РП БИО  ------------------------------------------------------------------------------------------------------------------------',
	},
	     {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной могло послужить любое нарушение Правил Подачи РП Биографии.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'На дороботке',
      content:
	            "[CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП биографии мало информации.<br>" +
		        '[B][CENTER]У вас есть 24 часа и исправление.<br>' +
		        "[B][CENTER]В противном случае рп биография будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
{
      title: 'возраст не совподает',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Год рождения и возраст не совподают.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии не по форме.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии от 3-го лица.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило копирование текста / темы.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Супергерой',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило приписание суперспособности своему персонажу / темы.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование РП Биографии.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание заговолка РП Биографии не по форме.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: '2 Био на 1 Акк',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографий.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Мало текста',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
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
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
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