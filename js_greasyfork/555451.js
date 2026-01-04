// ==UserScript==
// @name         KALUGA | Скрипт by tevezz
// @namespace    https://greasyfork.org/ru/users/1118525-pistenkov
// @version      2.1
// @description  Скрипт для ГС/ЗГС ГОСС/ОПГ
// @author       Federico_Tevezz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/custom-icon-design/flatastic-7/256/Highlightmarker-blue-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/555451/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.user.js
// @updateURL https://update.greasyfork.org/scripts/555451/KALUGA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20tevezz.meta.js
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
          title: '---------------------------------------------------------------------  ЖАЛОБЫ НА ЛД  ---------------------------------------------------------------------------------',
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
          title: '---------------------------------------------------------------  ОБЖ КРИМ НАКАЗАНИЙ  ---------------------------------------------------------------------------',
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
	  title: '---------------------------------------------------------------------  ПЕРЕДАТЬ ЖБ  ---------------------------------------------------------------------------------',
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
      title: 'ОШИБКА РАЗДЕЛОМ',
	  content:
		"[B][CENTER][font=georgia][COLOR=#00ffff][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: '---------------------------------------------------------------------  ЖБ ОДОБРЕНО  ---------------------------------------------------------------------------------',
	},
    {
      title: 'ОДОБРЕНО',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан.<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ОСК РОД',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=red]Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ДМ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=red]Jail 60 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НРП ПОВЕД',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=red]Jail 30 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'УХОД ОТ РП',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=red]Jail 30 минут / Warn[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НРП ДРАЙВ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.03.[/COLOR] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=red]Jail 30 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ПОМЕХА РП ПРОЦ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=red]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НРП ОБМАН',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=red]PermBan[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'СЛИВ ФАМЫ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.09.[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | [COLOR=red]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ДБ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=red]Jail 60 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'МАСС ДМ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=red]Warn / Ban 3 - 7 дней[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'РЕКЛАМА',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | [COLOR=red]Ban 7 дней / PermBan[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ОСК НАЦИИ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=red]Mute 120 минут / Ban 7 дней[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'УГРОЗЫ ИГРОКАМ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [COLOR=red]Mute 120 минут / Ban 7 - 15 дней.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ОСК ПРОЕКТА',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=red]Mute 300 минут / Ban 30 дней[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ЕПП ИНКО/ДАЛЬНО',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=red]Jail 60 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'АРЕСТ В АУКЕ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=red]Ban 7 - 15 дней + увольнение из организации[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НРП АКС',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=red]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ДОЛГ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=red]Ban 30 дней / Permban[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'КАПС',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.02.[/COLOR] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | [COLOR=red]Mute 30 минут.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ДИСКРИМИНАЦИЯ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=red]Mute 30 минут.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ФЛУД',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=red]Mute 30 минут.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ЗЛОУП СИМВОЛАМИ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=red]Mute 30 минут.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ЗЛОУП СИМВОЛАМИ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба получает статус одобрено.<br>" +
		"[B][CENTER]Игрок будет наказан по следующему пункту правил.<br>" +
        "[B][CENTER][COLOR=red]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=red]Mute 30 минут.[/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00ff00][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: '---------------------------------------------------------------------  ЖБ ОТКАЗАНО  ---------------------------------------------------------------------------------',
	},
     {
      title: 'НЕТУ /time',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсутствует /time.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'НЕТУ ТАЙМ-КОДОВ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Если фрапс длится более 3-х минут, необходимо указать тайм-коды нарушений.<br>" +
		"[B][CENTER]Тема открыта. У вас есть 24 часа на указание тайм-кодов.<br><br>" +
		'[B][CENTER][COLOR=orange][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
      title: 'ОТ 3-ГО ЛИЦА',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'БОЛЕЕ 3 ДНЕЙ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ЖБ НЕ ПО ФОРМЕ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба состоит не по форме.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НЕТ ДОКОВ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]К Вашим доказательствам нет доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
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
		"[B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
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
		"[B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'НУЖЕН ФРАПС',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе недостаточно доказательств.<br>" +
		"[B][CENTER]В таких случаях нужна видеофиксация нарушения.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'ДОКВА ОТРЕДАКТИРОВАНЫ',
	  content:
	    "[B][CENTER][font=georgia][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br>" +
		"[B][CENTER]Убедительная просьба ознакомиться с правилами подачи жалобы.<br><br>" +
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