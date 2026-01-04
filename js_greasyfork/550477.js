// ==UserScript==
// @name         Скрипт для КФ (общий)
// @namespace    https://forum.blackrussia.online/
// @version      1.2.5
// @description  Based on the script N.Xwello <3
// @author       Artem_Gogol
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums*
// @include      https://forum.blackrussia.online/forums
// @grant        none
// @license 	 KF
// @collaborator Kuk
// @icon https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/550477/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550477/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%28%D0%BE%D0%B1%D1%89%D0%B8%D0%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
        title: 'Приветствие',
        content:
        '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
    },
        {
        title: '_____________________________________________________ЖАЛОБЫ НА ИГРОКОВ____________________________________________________'
    },
     {
      title: 'Одобрено, закрыто',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/COLOR][/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
    },
    {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игрового процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    },
        {
      title: 'NonRP поведение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут<br><br>Примечание: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Уход от RP',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn<br><br>Примечание: уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP вождение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут<br><br>Примечание: нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Помеха игровому процессу',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)<br><br>Пример: таран дальнобойщиков, инкассаторов под разными предлогами.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP обман/Попытка обмана',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan<br><br>Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Аморальные действия',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Аморальные действия',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn<br><br>Исключение: обоюдное согласие обеих сторон.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Слив склада/Слив семьи',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan<br><br>Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>Примечание: исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Обман в /do',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Рабочий транспорт в л/ц',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Помеха блогерам',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней<br><br>Пример: спам в чат оскорблениями и провокационными сообщениями, мешая работе блогера в проведении трансляции и взаимодействии с аудиторией.<br>Пример: игрок умышленно убивает стримера в игре, создавая помеху в процессе стрима.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'DB',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут<br><br>Исключение: разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'TK',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'SK',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'MG',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут<br><br>Примечание: использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>Примечание: телефонное общение также является IC чатом.<br>Исключение: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'DM',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут<br><br>Примечание: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>Примечание: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Mass DM',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Стороннее ПО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan<br><br>Примечание: запрещено внесение любых изменений в оригинальные файлы игры.<br>Исключение: разрешено изменение шрифта, его размера и длины чата (кол-во строк).<br>Исключение: блокировка за включенный счетчик FPS не выдается.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Сокрытие нарушителей',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Реклама',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan<br><br>Примечание: если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Обман администрации/Ввод в заблуждение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней<br><br>Пример: подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.<br>Примечание: по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. | PermBan<br>Примечание: за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта | PermBan + ЧС проекта[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Уязвимость правил',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan<br><br>Примечание: игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.<br>Пример: игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Национальный и религиозный конфликты',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'OOC угрозы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.37. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней.<br><br>Примечание: блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Слив личной информации',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan + ЧС проекта<br><br>Примечание: распространение личной информации пользователя без его согласия запрещено.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Злоупотребление нарушениями',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 15 дней<br><br>Примечание: неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.<br>Примечание: наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.<br>Исключение: пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.<br>Пример: было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Оск проекта',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Продажа промо',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP вождение(фура)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP акс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Оск администрации',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут<br><br>Пример: оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.<br>Пример: оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Багоюз анимации',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз, связанный с анимацией в любых проявлениях. | Jail 120 минут<br><br>Примечание: наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Невозврат долга',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban<br><br>Примечание: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>Примечание: при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>Примечание: жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игрового чата - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'CapsLock',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут.<br><br>Пример: ПрОдАм, куплю МАШИНУ.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Оск в NonRP чат',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Упом/Оск родни',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней<br><br>Примечание: термины MQ, rnq расценивается, как упоминание родных.<br>Исключение: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Флуд',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Злоуп. символами',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут<br><br>Пример: «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Слив глобального чата',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Выдача себя за адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Заблуждение игроков командами',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan<br><br>Примечание: /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Нарушение в репорт',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Музыка в Voice',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Шум в Voice',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут<br><br>Примечание: Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Полит. и религ. пропаганда',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Изменение голоса',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Транслит',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут<br><br>Пример: «Privet», «Kak dela», «Narmalna».[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Реклама промо',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней<br><br>Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>Исключение: промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>Пример: если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Объявления на ТТ ГОСС',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут<br><br>Пример: в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!![/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Мат в VIP',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила игровых аккаунтов - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'Фейк',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan<br><br>Пример: подменять букву i на L и так далее, по аналогии.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Оск ник',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные), а также слова политической или религиозной направленности. | Устное замечание + смена игрового никнейма / PermBan[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила управления бизнесом - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'Продажа должностей/Продажа крупье',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на любые должности, связанные с деятельностью заведения | Ban 3 - 5 дней.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Налоги с сотрудников',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино | Ban 3 - 5 дней.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Продажа СТО/Казино',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.01. После покупки казино владелец обязан ждать срока окончания владения Казино / СТО - 15 суток. Запрещено продавать и передавать казино / СТО третьим лицам, продавать бизнес в государство и выкупать обратно, любые другие виды и способы сохранения бизнеса у себя или выставления его на аукцион | Permban.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Госс структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'Арест в казино/аукцион',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Работа в форме ГОСС',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Транспорт в личн.целях',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Казино/БУ... в форме ГОСС',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота | Jail 30 минут<br><br>Пример: Семейные активности — захват семейного контейнера, битва за территорию, битва семей<br>Примечание: за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Арест на ТТ ОПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>1.16. Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP адвокат',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.01. Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Нарушение правил редакт.объяв.(СМИ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Нарушение правил пров.эфиров(СМИ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих игровым правилам и логике | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Реклама Промо(СМИ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.03. Запрещена реклама промокодов в объявлениях | Ban 30 дней.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Редакт. в личн. целях(СМИ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Стрельба в форме(ЦБ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>5.01. Запрещено использование оружия в рабочей форме | Jail 30 минуТ<br><br>Исключение: защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Обман командами(ЦБ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>5.02. Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами | Ban 3-5 дней + ЧС организации<br><br>Пример: Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Nonrp розыск(УМВД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>6.02. Запрещено выдавать розыск без IC причины | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP поведение(ГОСС)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>6.03. Запрещено nRP поведение | Warn<br><br>Примечание: поведение, не соответствующее сотруднику УМВД.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Задержание на войнах за бизнес',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>1.13. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP розыск/штраф(ГИБДД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>7.02. Запрещено выдавать розыск, штраф без IC причины | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Лишение прав во время погони(ГИБДД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP розыск(ФСБ)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>8.02. Запрещено выдавать розыск без IC причины | Warn[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Вывод заключенных(ФСИН)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>9.01. Запрещено освобождать заключённых, нарушая игровую логику организации | Warn<br><br>Пример: Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.<br>Примечание: Побег заключённого возможен только на системном уровне через канализацию.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP карцер/поощрения(ФСИН)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>9.02. Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины | Warn<br><br>Пример: сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'NonRP нападение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP в/ч',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нападение на военную часть разрешено через блокпост КПП с последовательностью взлома или взрыва стены, заранее подготовленным динамитом | Warn NonRP В/Ч[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Путевой лист/Форма в личн.целях',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Участникам криминальных организаций запрещено использовать форму военного и путевой лист в личных целях | Warn NonRP В/Ч<br><br>Примечание: участник криминальной организации купил форму военного и путевой лист, скрытно проник на территорию воинской части, но вместо угона камаза для материалов, пошел к складу и добывает материалы для себя.<br>Примечание: форма военного и путевой лист предназначены исключительно для угона камаза для материалов.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Провокация ГОСС',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещено провоцировать сотрудников государственных организаций | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Провокация ОПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Дуэли у ОПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещено устраивать дуэли где-либо, а также на территории ОПГ | Jail 30 минут<br><br>Исключение: территория проведения войны за бизнес, когда мероприятие не проходит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Перестрелки в людных местах',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещено устраивать перестрелки с другими ОПГ в людных местах | Jail 60 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Реклама в чате ОПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации | Mute 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Сокрытие от погони на ТТ ОПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Возвращение на БВ после смерти',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.01. Запрещено возвращаться на место бизвара после смерти | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Выход/Пауза во время БВ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещено во время войны за бизнес покидать его территорию или выходить с игры, а также находиться в паузе больше 15 секунд | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Транспорт во время БВ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещено после начала бизвара использовать транспорт на территории его ведения | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Аптечка во время перестрелки в БВ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.07. Запрещено использовать аптечки во время перестрелки | Jail 15 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Нахождение на крыше БВ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещено находиться на крышах во время бизвара | Jail 30 минут[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передача и перенаправление жалоб - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'Тех.специалисту',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба передана на рассмотрение Техническому специалисту.<br><br>Примечание: Техническому специалисту может потребоваться более 48 часов на рассмотрение.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: TEXSPECY_PREFIX,
	  status: true,
    },
        {
      title: 'Глав.админу',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба передана на рассмотрение Главному Администратору.<br><br> Примечание: Может потребоваться более 48 часов на рассмотрение.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: GLAVNOMYADMINY_PREFIX,
	  status: true,
    },
         {
      title: 'ЗГА+',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба передана на рассмотрение Руководству сервера.<br><br> Примечание: На рассмотрение жалобы может потребоваться дополнительное время.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: GLAVNOMYADMINY_PREFIX,
	  status: true,
    },
        {
      title: 'Кураторам адм.',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба передана на рассмотрение Кураторам адмиинистрации.<br><br>Примечание: Может потребоваться дополнительное время для рассмотрения жалобы.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
    },
        {
      title: 'ГКФ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба передана на рассмотрение Главному куратору форума.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
    },
        {
      title: 'В жалобы на адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись разделом.<br>Оставьте жалобу в раздел Жалобы - Жалобы на администрацию.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
      title: 'В обжалования',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись разделом.<br>Если хотите смягчить своё наказание, то обратитеть в раздел Жалобы - Обжалование наказаний.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
      title: 'В жалобы на лидеров',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись разделом.<br>Оставьте жалобу в раздел Жалобы - Жалобы на лидеров.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
      title: 'В жалобы на сотрудников',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Оставьте жалобу в раздел Государственные организации - Жалобы на сотрудников[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
      title: 'Ошибка сервером',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись сервером.<br>Оставьте вашу жалобу в соответствующий раздел вашего сервера.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Причины отказа - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
        {
      title: 'Нарушений нет',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Не вижу нарушений со стороны игрока.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Недостаточно док-в',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Недостаточно доказательств для дальнейшего рассмотрения жалобы.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Игрок уже наказан',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок уже был наказан.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
        {
      title: 'Нарушений нет(оск в рп чат)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Оскорбления в RP чат не наказумы.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба составлена не по форме.<br>Внимательно ознакомьтесь с формой подачи жалоб.<br><br>1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Нет /time',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]На ваших доказательствах отсутсвует /time<br>Дальнейшему рассмотрению жалоба не подлежит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Нет таймкодов(3+ минут видео)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Отсутсвуют таймкоды.<br>Если доказательства длятся более 3-х минут, вы должны указать таймкоды нарушений.<br>Пример:<br>0:11 - Условия сделки<br>0:21 - Начало обмена[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Док-ва с соц.сетей',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Доказательства с соц.сетей не принимаются.<br>Дальнейшему рассмотрению жалоба не подлежит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Не работают док-ва',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В вашей жалобе отсутсвуют или не работают доказательства.<br>Просьба проверить правильность указания ссылок и находятся ли доказательства в открытом доступе.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Нужен фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких ситуациях нужен фрапс.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба составлена от 3-го лица.<br>Жалобы принимаются непосредственно от лица участников.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Нет условий сделки',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В вашей жалобе отсутсвуют условия сделки.<br>Дальнейшему рассмотрению жалоба не подлежит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Более 72 часов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]С момента нарушения прошло более 72 часов. Дальнейшему рассмотрению жалоба не подлежит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Фрапс обрывается',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства неполные или обрываются. Просьба предоставить доказательства в полном объеме.<br>Примечание: Если это видеоматериал, то предоставьте его в исходном виде, без деления на несколько частей.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Док-ва отредактированы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства отредактированы.<br>Предоставьте доказательства в исходном виде.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Логи не подтвердили(док-ва фейковые)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Система логирования не подтвердила нарушение со стороны игрока.<br>Возможно ваши доказательства были подделаны.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Неадекватное поведение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба включается в себя негативные/неадекватные высказывания.<br>Составьте жалобу более сдержано и адекватно.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Дубликат',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вердикт был дан в вашей прошлой жалобе.<br>За дублирование вашей темы вы можете получить блокировку форумного аккаунта.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Слив семьи(Жб не от лидера)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Жалобы по данному пункту правил принимаются только от лидера семьи.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Слив склада семьи(лидер сам несёт ответсвенность)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Не вижу нарушений со стороны игрока.<br>Лидер сам несёт ответственность за выданные доступы. Игрок вправе взять столько, сколько ему разрешили.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
        {
      title: 'Не реклама(соц.сети для связи)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Не вижу нарушений со стороны игрока.<br>Давать свои соц.сети для связи не запрещено.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
{
      title: '__________________________________________RP СИТУАЦИИ__________________________________________',
    },
   {
	  title: 'Ситуация - Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
       prefix: ODOBRENO_PREFIX,
	  status: false,
     },
    {
	  title: 'Ситуация - Доработка',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей RP ситуации. [/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
      },
        {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
        {
        title: 'Не доработал',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]RP ситуация не была доработана за данные вам 24 часа.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
    {
        title: 'Не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]RP ситуация составлена не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Название не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы не по форме.<br>Заполните заголовок по форме: [Краткое название события] Событие[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Не тот шрифт/размер',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]RP ситуация должны быть написана шрифтами Verdana или Times New Roman с минимальным размером 15.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Орфография',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много орфографических ошибок. Проверьте свой текст на наличие ошибок в правописании.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Пунктуация',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много пунктуационных ошибок.<br>В вашей RP ситуации неправильно раставлены знаки препинания, либо они вовсе отсутсвуют.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет фото- видеофрагментов',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В вашей RP ситуации отсутсвуют фото- или видеофрагменты.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нарушение правил игры',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В вашей RP ситуации были нарушены правила серверов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Копипаст',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша биография скопирована. <br> Постарайтесь изложить свою уникальную идею.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'NonRP информация на скринах',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]На ваших фото- видеофрагментах присутсвуют OOC элементы.<br>Приложите фрагменты, на которых убраны все элементы интерфейса, которые можно убрать системно.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нарушение политики/Экстремизм',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша RP ситуация включает в себя запрещённую тематику.<br>Запрещено упоминание различных группировок, психотропных и подобных веществ, экстремитских и националистических лозунгов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет отыгровок',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В вашей RP ситуации отсутсвуют RP отыгровки, либо их слишком мало.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Несответсвие текста и видео',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RP ситуация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/']с правилами написания RP ситуаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Описание RP ситуации не соответсвует содержанию фото-/видеофрагментов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
      title: '__________________________________________НЕОФИЦИАЛЬНЫЕ RP ОРГАНИЗАЦИИ__________________________________________',
    },
    {
	  title: 'Организация - Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RolePlay организация получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
     },
    {
	  title: 'Организация - Доработка',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей неофицальной организации.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
     },
         {
	  title: 'Организация - Запрос активности',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Напоминаю: Лидер организации обязан раз в неделю публиковать отчёт о деятельности своей организации.<br>Если в течение недели в теме не будет сообщений от лидера, организация считается распущенной, а тема закрывается.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
	  status: false,
     },
        {
	  title: 'Организация - Закрыто/Нет активности',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Активность не была предоставлена.<br><br>Организация закрыта.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: ZAKRITO_PREFIX,
	  status: false,
     },
        {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Отказы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
     {
        title: 'Не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Неофициальная RP организация составлена не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Заголовок не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок неофициальной организации составлен не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Орфография',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много орфографических ошибок.<br>Проверьте свой текст на наличие ошибок в правописании.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Пунктуация',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много пунктуационных ошибок.<br>В вашей теме неправильно раставлены знаки препинания, либо они вовсе отсутсвуют.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Копипаст',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша неофициальная RP организация является копией. Просьба изложить свою идею.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Не тот шрифт/размер',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Нарушен шрифт текста и/или его размер. <br> Текст в вашей теме должен быть написан шрифтами Vernada или Times New Roman с минимальным размером 15.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет одобренной биографии',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Нет ссылки на вашу одобренную биографию.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Организация - госструктура',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Запрещено создавать организации в форме государственных фракций.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Название не соответсвует теме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Название организации не соответсвует тематике вашей организации.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет фото- видеоматериалов',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В вашей теме нет фото- видеоматериалов, которые сопроваждают вашу организацию.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет 3 человек',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком мало людей для создания неофициальной организации.<br>Минимальный стартовый состав - 3 человека.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет особенности',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В вашей теме отсутсвует отличительная визуальная особность для распознавания участников организации.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'NonRP информация на скринах',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]На ваших фото- видеофрагментах присутсвуют OOC элементы.<br>Приложите фрагменты, на которых убраны все элементы интерфейса, которые можно убрать системно.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Бредовая организация',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша неофициальная организация не несёт какого-либо смысла.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нарушение политики/Экстримизм',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RP организация была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/']с правилами написания неофициальных RP организаций.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша тема включает в себя запрещённую тематику.<br>Запрещено упоминание различных группировок, психотропных и подобных веществ, экстремитских и националистических лозунгов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
      title: '__________________________________________RP БИОГРАФИИ__________________________________________',
    },
    {
	  title: 'Биография - Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
	  title: 'Биография - Доработка',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
 {
        title: 'Не дополнил',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Вы не доработали RP биографию за данные вам 24 часа.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
         {
        title: 'NonRP NickName',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]У вас NonRP NickName.<br> Выберите себе другой NickName для RP биографии, который соответсвует рамкам RP.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Разные имена в заголовке и био',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]NickName в заголовке отличается от имени и фамилии персонажа.<br>Имя и фамилия персонажа должны совпадать с вашим NickName.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Биография не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография составлена не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Заголовок не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы составлен не по форме.<br>Заполните его в формате: Биография | Nick_Name[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Копипаст',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша биография скопирована.<br>Постарайтесь изложить свою идею.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Орфография',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много орфографических ошибок.<br>Проверьте свой текст на наличие ошибок в правописании.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Пунктуация',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком много пунктуационных ошибок.<br>В вашей биографии неправильно раставлены знаки препинания, либо они вовсе отсутсвуют.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нарушение правил игры',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Запрещено указывать факторы, позволяющие игроку нарушать правила игры.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Менее 200 слов',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Слишком мало RP информации.<br>Минимальный объем информации из жизни вашего персонажа 200 слов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Более 600 слов',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Избыток RP информации.<br>Максимальный объем информации из жизни вашего персонажа 600 слов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Не тот шрифт/размер',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Нарушен шрифт текста и/или его размер.<br>Ваша биография должно быть написана шрифтами Verdana или Times New Roman с минимальным размером 15.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Cверхспособности',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Запрещено придавать персонажу нереалистичные свойства.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нет видео- фотофграментов',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В биографии должна присутствовать хотя бы одна фотография, поясняющая вашу биографию/вашего персонажа.<br>Например, это может быть фотография вашего персонажа.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Нарушение политики/Экстремизм',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Ваша биография включает в себя запрещённую тематику.<br>Запрещено упоминание различных группировок, психотропных и подобных веществ, экстремитских и националистических лозунгов.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
        {
        title: 'Общий отказ(свой вариант)',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]...[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
];

var titles = document.getElementsByClassName('structItem-title');
    var count_ojidanie = 0;
    var count_ga = 0;
    var count_na_rassmotrenii = 0;
    var count_sa = 0;

    for (var i = 0; i < titles.length; i++) {
        var prefix_ojidanie = titles[i].querySelector('.labelLink .label--silver');
        if (prefix_ojidanie && prefix_ojidanie.textContent.trim() === 'Ожидание') {
            count_ojidanie++;
        }
        var prefix_ga = titles[i].querySelector('.label.label--red');
        if (prefix_ga && prefix_ga.textContent.trim() === 'Главному администратору') {
            count_ga++;
        }
        var prefix_na_rassmotrenii = titles[i].querySelector('.label.label--orange');
        if (prefix_na_rassmotrenii && prefix_na_rassmotrenii.textContent.trim() === 'На рассмотрении') {
            count_na_rassmotrenii++;
        }
        var prefix_sa = titles[i].querySelector('.label.label--accent');
        if (prefix_sa && prefix_sa.textContent.trim() === 'Специальному администратору') {
            count_sa++;
        }
    }

    function getColor(count) {
        if (count < 7) {
            return 'lime';
        } else if (count >= 7 && count < 15) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    var headers = document.getElementsByClassName('block-minorHeader uix_threadListSeparator');
    if (headers.length > 0) {
        var firstHeader = headers[0];
        var secondHeader = headers[1];

        var countElementGA = document.createElement('span');
        countElementGA.style.marginLeft = '10px';
        countElementGA.style.fontSize = '1.4rem';
        countElementGA.style.color = getColor(count_ga);
        countElementGA.textContent = 'Глав.Админу: ' + count_ga + ' ||';

        var countElementNaRassmotrenii = document.createElement('span');
        countElementNaRassmotrenii.style.marginLeft = '10px';
        countElementNaRassmotrenii.style.fontSize = '1.4rem';
        countElementNaRassmotrenii.style.color = getColor(count_na_rassmotrenii);
        countElementNaRassmotrenii.textContent = 'На рассмотрении: ' + count_na_rassmotrenii;


        var arrowIcon = firstHeader.querySelector('.uix_threadCollapseTrigger');
        firstHeader.insertBefore(countElementGA, arrowIcon);
        firstHeader.insertBefore(countElementNaRassmotrenii, arrowIcon);

        var countElementOjidanie = document.createElement('span');
        countElementOjidanie.style.marginLeft = '10px';
        countElementOjidanie.style.fontSize = '1.4rem';
        countElementOjidanie.style.color = getColor(count_ojidanie);
        countElementOjidanie.textContent = 'Ожидание: ' + count_ojidanie;

        arrowIcon = secondHeader.querySelector('.uix_threadCollapseTrigger');
        secondHeader.insertBefore(countElementOjidanie, arrowIcon);
    }

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы

    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(NARASSSMOTRENII_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ODOBRENO_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(ZAKRITO_PREFIX, false));
    $('button#rassmotreno').click(() => editThreadData(RASSMORTENO_PREFIX, false));
    $('button#otkaz').click(() => editThreadData(OTKAZANO_PREFIX, false));


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
      `<button type="button" class="button rippleButton" id="${id}" style="background-image: linear-gradient(to right, #000000 0%, #808080  51%, #000000  100%);margin: 10px;border-radius: 10px;">${name}</button>`,
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

	if(send == true){
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
        4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
    };
  }

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
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
	if(pin == true){
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