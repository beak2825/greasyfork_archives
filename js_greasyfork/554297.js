// ==UserScript==
// @name         KALUGA | Скрипт by tevezz
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      1.1
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Federico_Tevezz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/554297/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.user.js
// @updateURL https://update.greasyfork.org/scripts/554297/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.meta.js
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
	  title: '-----------------------------------------------------------  ПЕРЕДАТЬ ЖБ  -----------------------------------------------------------------------',
	},
     {
      title: 'ГА',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'ТЕХУ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TEX_PREFIX,
	  status: false,
    },
	 {
      title: 'КП',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Команде Проекта.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
	{
      title: 'СПЕЦ АДМ',
      content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Специальному Администратору или же его Заместителю.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: '-----------------------------------------------------------  ПЕРЕНАПРАВИТЬ  -----------------------------------------------------------------------',
	},
	{
      title: 'ЖБ НА АДМ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'ЖБ НА ЛД',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'ЖБ НА СОТРУДНИКОВ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел жалоб на сотрудников<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП БИО',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Биографии.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
		{
      title: 'РП СИТУАЦИИ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Ситуации.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'ОБЖ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'ОШИБКА РАЗДЕЛОМ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: '-----------------------------------------------------------  ЖБ НА ИГРОКОВ  -----------------------------------------------------------------------',
	},
    {
      title: 'ОДОБРЕНО',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Игрок будет наказан.<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'НЕТУ /time',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсутствует /time.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ОТ 3-ГО ЛИЦА',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'БОЛЕЕ 3 ДНЕЙ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ЖБ НЕ ПО ФОРМЕ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба состоит не по форме.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НЕТ ДОКОВ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]К Вашим доказательствам нет доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НАРУШЕНИЙ НЕТ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Нарушений со стороны игрока не найдено.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ОПРА ВНЕ ФОТОХОСТИНГА',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НЕДОСТАТОЧНО ДОКОВ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Недостаточно доказательств на нарушение от данного игрока.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ДУБЛИРОВАНИЕ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НУЖЕН ФРАПС',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
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