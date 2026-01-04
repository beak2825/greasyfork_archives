// ==UserScript==
// @name         One
// @namespace    http://tampermonkey.net/
// @version      8.10.25
// @description  good luck
// @author       Yan One
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551960/One.user.js
// @updateURL https://update.greasyfork.org/scripts/551960/One.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const OZHIDANIE_PREFIX = 14;
const buttons = [
{
  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Свой ответ•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Одобрено',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial] TEXT [/CENTER][/color][/FONT]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    autoSend: false,
    },
        {
      title: 'Отказано',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial] TEXT [/CENTER][/color][/FONT]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    autoSend: false,
    },
        {
      title: 'Закрыто',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial] TEXT [/CENTER][/color][/FONT]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    autoSend: false,
    },
        {
      title: 'Рассмотрении',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial] TEXT [/CENTER][/color][/FONT]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#ffd700][FONT=Arial][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    autoSend: false,
    },
            {
      title: 'Решено',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial] TEXT [/CENTER][/color][/FONT]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Решено, закрыто.[/color][/CENTER][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
    autoSend: false,
    },
     {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила Лидеров•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
      title: 'Нет нарушений',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Со стороны лидера нарушений не выявлено.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'Работа над лд',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]С лидером будет проведена необходимая работа.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'Будет снят',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Лидер будет снят со своего поста.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
    },
    {
              title: 'Снят с поста',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Лидер снят со своего поста.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'Получит наказание',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Лидер получит соответствующее наказание.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'Будут приняты меры',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Будут приняты меры.[/Color][/CENTER]<br>" +
        "[Color=#c0c0c0][CENTER][FONT=Arial]Спасибо за информацию. [/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#388e3c][FONT=Arial][CENTER]Рассмотрено.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила RolePlay процесса•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP поведение(2.01)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins><b><ins>[Color=#D32F2F]2.01.[/Color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#D32F2F]| Jail 30 минут [/CENTER]<br>" +
        '[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP(2.02)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins><b><ins>[Color=#D32F2F]2.02.[/Color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#D32F2F]| Jail 30 минут / Warn[/CENTER]<br>" +
        '[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP вождение(2.03)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.03.[/Color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#D32F2F]| Jail 30 минут / 60 минут (Для дальнобойщиков/инкассаторов)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Помеха RP процессу(2.04)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.04.[/Color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#D32F2F]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман(2.05)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.05.[/Color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#D32F2F]| PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/color][/CENTER][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия(2.08)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.08.[/Color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#D32F2F]| Jail 30 минут / Warn[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада(2.09)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.09.[/Color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле |[Color=#D32F2F] Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB(2.13)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.13.[/Color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#D32F2F]| Jail 60 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК(2.15)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.15.[/Color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#D32F2F]| Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK(2.16)',
      content:
	    '[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.16.[/Color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#D32F2F]| Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
      title: 'MG(2.18)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.18.[/Color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'DM(2.19)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.19.[/Color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#D32F2F]| Jail 60 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM(2.20)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.20.[/Color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#D32F2F]| Warn / Ban 3 - 7 дней[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Стороннее ПО(2.22)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[/FONT][FONT=Arial][Color=#D32F2F]2.22.[/Color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#D32F2F]| Ban 15 - 30 дней / PermBan [/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторон. ресурсов(2.31)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
         '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.31.[/Color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#D32F2F]| Ban 7 дней / PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. адм(2.32)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.32.[/Color] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [Color=#D32F2F]| Ban 7 - 15 дней / PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
        title: 'Угрозы IC и OOC(2.35)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.35.[/Color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#D32F2F]| Mute 120 минут / Ban 7 дней[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы ООС(2.37)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.37.[/Color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#D32F2F]| Mute 120 минут / Ban 7 дней[/CENTER]<br>" +
        '[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. нарушениями(2.39)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.39.[/Color] Злоупотребление нарушениями правил сервера [Color=#D32F2F]| Ban 7 - 30 дней[/CENTER]<br>" +
        '[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. проекта(2.40)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.40.[/Color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#D32F2F]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо(2.43)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.43.[/Color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#D32F2F]| Mute 120 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
      title: 'NonRP акс(2.52)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.52.[/Color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#D32F2F]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув. к адм.(2.54)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.54.[/Color] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#D32F2F]| Mute 180 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг. аним(2.55)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.55.[/Color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#D32F2F]| Jail 120 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Долг(2.57)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.57.[/Color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#D32F2F]| Ban 30 дней / permban[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'Сбив темпа стрельбы(2.02)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br>[CENTER][/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.02.[/Color] Запрещено сбивать темп стрельбы, путем получения преимущества в самой стрельбе  [Color=#D32F2F]| Jail 120 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Игровые чаты•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'CapsLock(3.02)',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.02.[/Color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС(3.03)',
      content:
	    '[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.03.[/Color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/оск род(3.04)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.04.[/Color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#D32F2F]| Mute 120 минут / Ban 7 - 15 дней[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Flood(3.05)',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.05.[/Color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. символами(3.06)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.06.[/Color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ(3.08)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.08.[/Color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#D32F2F]| PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм(3.10)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.10.[/Color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#D32F2F]| Ban 7 - 15 + ЧС администрации[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл.(3.11)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.11.[/Color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#D32F2F]| Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс(3.14)',
      content:
		'[FONT=Arial][CENTER][{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.14.[/Color] Запрещено включать музыку в Voice Chat [Color=#D32F2F]| Mute 60 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс(3.16)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.16.[/Color] Запрещено создавать посторонние шумы или звуки [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Призыв к флуду(3.18)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.18.[/Color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[Color=#D32F2F] | Mute 120 минут / Ban 10 дней[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Рекл. промо(3.21)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.21.[/Color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#D32F2F]| Ban 30 дней[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на ТТ госс(3.22)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.22.[/Color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Мат в VIP чат(3.23)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]3.23.[/Color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате  [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Положение об игровых аккаунтах•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Фейк аккаунт(4.10)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]4.10.[/Color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#D32F2F]| Устное замечание + смена игрового никнейма / PermBan[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Передачи жалобы•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'ГКФ/ЗГКФ',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [Color=#FFA500]Главному Куратору и его заместителю.[/Color] [/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[Color=#c0c0c0][CENTER][FONT=Arial]Просьба не создавать подобных тем. Ожидайте ответа.[/Color][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. специалисту',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [Color=#00BFFF]Техническому Специалисту.[/Color] [/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[Color=#c0c0c0][CENTER][FONT=Arial]Просьба не создавать подобных тем. Ожидайте ответа.[/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [Color=#D32F2F]Главному Администратору.[/Color][/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[CENTER][FONT=Arial]Просьба не создавать подобных тем. Ожидайте ответа.[/CENTER][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Спец. администратору',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [Color=#ffd700]Специальной Администрации.[/Color][/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[Color=#c0c0c0][CENTER][FONT=Arial]Просьба не создавать подобных тем. Ожидайте ответа.[/CENTER][/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
              title: 'Жалоба на рассмотрении',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Ваша жалоба взята на [Color=#ffd700]рассмотрение.[/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[CENTER][Color=#c0c0c0]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила Госс. Структур•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Прогул Р/Д(1.07)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]1.07.[/Color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Исп. фракц. т/с в л/ц(1.08)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]1.08.[/Color] Запрещено использование фракционного транспорта в личных целях [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О(Объявы)(4.01)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]4.01.[/Color] Запрещено редактирование объявлений, не соответствующих правилам редактирования объявлений [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э(Эфиры)(4.02)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил: [/Color]<br>[Color=#D32F2F]4.02.[/Color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#D32F2F]| Mute 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редакт. в личных целях(СМИ)(4.04)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]4.04.[/Color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком  [Color=#D32F2F]| Ban 7 дней + ЧС организации [/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила ОПГ•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#D32F2F]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins> Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [Color=#D32F2F]| /Warn NonRP В/Ч[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'Наруш. правил ограблений/похищений',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins> Запрещено нарушение правил ограблений/похищений[CENTER][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/'][Color=#c0c0c0][FONT=Arial][CENTER](Кликабельно)[/url]<br>[Color=#D32F2F]| Jail (от 10 до 60 минут) / Warn / Ban (от 1 до 30 дней) / Строгий или устный выговор лидеру нелегальной организации[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                    },
    {
      title: 'Only сторона атаки и защиты(1.06)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]1.06.[/Color] На территории проведения БизВара может находиться только сторона атаки и сторона защиты [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'Задерж. во время БВ(1.13)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]1.13.[/Color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'Авто во время БВ(2.04)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.04.[/Color] Запрещено после начала бизвара использовать транспорт на территории его ведения [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'Запрещены маски/бронежилеты(2.05)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.05.[/Color] Запрещено использовать маски/бронежилеты на БизВаре [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'ДМ перед БВ(2.06)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.06.[/Color] Запрещено преждевременное убийство членов вражеской группировки за 10 минут до начала бизвара на территории его проведения [Color=#D32F2F]| Jail 60 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'Аптечка во время БВ(2.07)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.07.[/Color] Запрещено использовать аптечки во время перестрелки на БизВаре [Color=#D32F2F]| Jail 15 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
                           },
    {
      title: 'Крыша на БВ(2.08)',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
                 '[CENTER][url=https://postimg.cc/w78FszF0][img]https://i.postimg.cc/4Nn0qNck/2776718330-preview-P84-Rw.png[/img][/url]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[Color=#D32F2F]2.08.[/Color] Запрещено находиться на крышах во время бизвара [Color=#D32F2F]| Jail 30 минут[/CENTER]<br>" +
		'[Color=#D32F2F][CENTER]Спасибо за Ваше обращение![/CENTER][/color][/FONT]' +
                 '[CENTER][url=https://postimg.cc/w78FszF0][img]https://i.postimg.cc/4Nn0qNck/2776718330-preview-P84-Rw.png[/img][/url]'+
		'<br>[Color=#388e3c][FONT=Arial][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Отсутствие пункта жалоб•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]Нарушений со стороны данного игрока не было найдено.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ уже дан в прошл. ЖБ',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]Ответ был дан в прошлой жалобе.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Недостаточно доказательств на нарушение от данного игрока.[/Color]<br><br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублир. темы',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial]Дублирование темы.[Color=#c0c0c0]<br><br>Если вы дальше продолжите дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/Color][/CENTER]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Вы ошиблись разделом.[/Color]<br><br>Обратитесь в раздел:<br><br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/'][Color=#c0c0c0]Жалобы на администрацию (Кликабельно).<br>[/URL][/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'В жалобы на лд',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Вы ошиблись разделом.[/Color]<br><br>Обратитесь в раздел:<br><br><br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1827/'][Color=#c0c0c0]Жалобы на лидеров (Кликабельно).<br>[/URL][/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
              title: 'В жалобы на игроков',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Вы ошиблись разделом.[/Color]<br><br>Обратитесь в раздел:<br><br><br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1828/'][Color=#c0c0c0]Жалобы на игроков (Кликабельно).<br>[/URL][/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Вы ошиблись разделом.[/Color]<br><br>Обратитесь в раздел:<br><br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1829/'][Color=#c0c0c0]Обжалование наказаний (Кликабельно).<br>[/URL][/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В тех. раздел',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Вы ошиблись разделом.<br><br><br>Переподайте жалобу по ссылке ниже:<br>[/Color]<br>[Color=#00BFFF][FONT=Arial] [CENTER][URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-voronezh.1800/'][Color=#00BFFF][FONT=Arial][CENTER]Технический раздел (Кликабельно).[/URL][/CENTER][/FONT][/Color]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
     '[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
      title: 'В жб на тех. спец.',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Вы ошиблись разделом.<br><br><br>Переподайте жалобу по ссылке ниже:<br>[/Color]<br>[Color=#00BFFF][FONT=Arial] [CENTER][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9640-voronezh.1799/'][Color=#00BFFF][FONT=Arial][CENTER]Жалобы на Технических Специалистов (Кликабельно).[/URL][/CENTER][/FONT][/Color]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
     '[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
         title: 'В жалобы на сотрудников',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Обратитесь в раздел жалоб на сотрудников данной фракции.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Форма темы',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#D32F2F][CENTER][FONT=Arial]Ваша жалоба составлена не по форме.[/Color]<br>[Color=#c0c0c0]<br>Убедительная просьба ознакомиться:<br>[/color]<br><br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][Color=#c0c0c0]Правила подачи жалоб на игроков (Кликабельно).<br>[/URL][/color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
        '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет /time',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]На ваших доказательствах отсутствует /time. Жалоба не может быть рассмотрена.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Более 72 часов',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]С момента нарушения прошло более 72-х часов. Жалоба в таком случае не рассматривается.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
      {
      title: 'Док-ва через запрет соц. сети',
      content:
	    '[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Загрузка доказательств в соц. сети (ВКонтакте, instagram и др.) запрещается.<br><br><br>Доказательства должны быть загружены на фото/видео хостинги (YouTube, Yapx, imgur).[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
          '[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]В данных доказательствах отсутствуют/некорректные условия сделки.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Не видно ник',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]На ваших доказательствах не видно Nick_Name игрока.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]В таких случаях нужна видеофиксация.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]В таких случаях нужен фрапс + промотка чата.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Предоставленное видео обрывается.<br><br>Загрузите полные видеодоказательства на разрешенные социальные сети.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет док-в',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Не прикреплены доказательства.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Ваши доказательства отредактированы.<br><br><br>Загрузите доказательства в первоначальном виде.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Плохое качество док-в',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Ваши доказательства имеют плохое качество/нечитабельный/плохочитаемый текст.<br><br><br>Загрузите доказательства в разрешенные социальные сети.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: 'От 3-го лица',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Жалобы от 3-их лиц не рассматриваются.<br><br><br>Жалоба должна быть предоставлена от самого участника ситуации.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'Неадекват. текст',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Жалоба в таком формате рассмотрена быть не может.<br><br><br>Составьте жалобу в адекватной форме.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
               title: 'Перемещаю ЖБ',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Перемещаю вашу жалобу в нужный сервер/раздел.[/CENTER][/FONT][/Color]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
     '[Color=#ffd700][FONT=Arial][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
               title: 'ЖБ на каждого игрока',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
         "[Color=#c0c0c0][CENTER][FONT=Arial]Составьте жалобу на каждого нарушителя по отдельности.[/CENTER][/FONT][/Color]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
     '[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Ошиблись разделом/сервером',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Вы ошиблись сервером/разделом.<br><br><br>Переподайте жалобу в нужный раздел.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не написан ник',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Игровой ник автора жалобы и ник игрока на которого подается жалоба, должны быть указаны в обязательном порядке.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Нет подтверждения усл. сделки',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]Игрок не подтвердил условия вашей сделки.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не указаны тайм-коды',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
        "[Color=#c0c0c0][CENTER][FONT=Arial]На видеодоказательствах длиной в 3 минуты и более должны быть указаны корректные тайм-коды.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]Ваши доказательства не рабочие или битая ссылка, пожалуйста загрузите доказательства на разрешенных фото/видео хостингах.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
        {
	  title: 'Не сохр. логи',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]По предоставленным доказательствам наказание на данный момент выдать невозможно.<br><br><br>Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix:  CLOSE_PREFIX,
	  status: false,
	},
        {
 	  title: 'Игрок наказан',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]Игрок уже наказан за свои нарушения.[/Color][/CENTER]" +
        "[Color=#388e3c][CENTER][FONT=Arial]Спасибо за ваше обращение.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
 	  title: 'Долг через банк',
	  content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]'+
		"[Color=#c0c0c0][CENTER][FONT=Arial]Долг дается исключительно через банковскую систему.<br><br><br>Ознакомьтесь с правилами проекта.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]'+
		'[Color=#D32F2F][FONT=Arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
            title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay Биографии•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Био одобрено',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
          "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт -[Color=#388e3c] Одобрено.[/CENTER][/color][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
          '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био на доработке',
      content:
		'[FONT=Arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[Color=#c0c0c0][CENTER][FONT=arial]Вам даётся 24 часа на дополнение вашей RolePlay биографии.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
    status: true,
    },
    {
      title: 'Био отказ',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER][CENTER][/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#c0c0c0][FONT=Arial][CENTER]<br><<Правила написания RP биографии (Кликабельно)>>[/URL][/Color][/FONT][/CENTER]"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ(заголовок темы)',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт -[Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить неправильное заполнение заголовка темы.<br>Ознакомьтесь с правилам подачи:<br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#c0c0c0][FONT=Arial][CENTER]<br><<Правила написания RP биографии (Кликабельно)>>[/URL][/Color][/FONT][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ (3-е лицо)',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт -[Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить создание биографии от 3-го лица.[/Color][/CENTER][/FONT]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био украдена',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: запрещена полная или частичная кража чужих RolePlay биографий, включая свои с других серверов.[/QUOTE][/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Возраст не совпадает',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: указанный возраст должен совпадать с датой рождения.[/QUOTE][/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
     {
      title: 'Меньше 18 лет',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
         "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Данному персонажу меньше 18 лет.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
         '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Ник с "_"/Англ',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: никнейм должен быть указан без нижнего подчеркивания и на русском языке как в заголовке, так и в самой теме.[/QUOTE][/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Супер способности',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: запрещено приписывание своему персонажу супер-способностей.[/QUOTE][/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Наруш. логики',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей биографии присутствует нарушение правил логики.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно RolePlay информации',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей биографии недостаточно информации.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей RP биографии были допущены грамматические и/или орфографические ошибки.[/Color][/CENTER][/FONT]<br>" +
        "[Color=#c0c0c0][CENTER][FONT=arial]Убедительная просьба переписать вашу RolePlay Биографию без ошибок![/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Role Play биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play биография составлена не по форме.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Мало инфы в пункте "Детство"',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Детство'.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Мало инфы в пункте "Юность/взрослая жизнь"',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Юность и возрослая жизнь'.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Мало инфы в пункте "Настоящее время"',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Настоящее время'.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay ситуации•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'RolePlay ситуация одобрена',
      content:
		'[CENTER][FONT=arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/color][/CENTER]<br>[CENTER] [/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[Color=#c0c0c0][CENTER][FONT=arial]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#388e3c] Одобрено.<br>[/CENTER][/color][/FONT]" +
        "[Color=#c0c0c0][CENTER][FONT=arial][QUOTE]Примечание: При одобренной RP ситуации Администрация не обязуется выплачивать вам вознаграждение.[/QUOTE][/Color][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'RolePlay ситуация на доработке',
      content:
		'[CENTER][FONT=arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}! [/FONT][/color][/CENTER]<br> [CENTER] [/CENTER]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[Color=#c0c0c0][CENTER][FONT=arial]Вам даётся 24 часа на дополнение вашей RolePlay ситуации.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/color][/FONT]',
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: true,
    },
    {
      title: 'RolePlay ситуация отказ',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br><br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.4597427/'][Color=#c0c0c0][FONT=Arial][CENTER]Правила RP ситуаций | VORONEZH (Кликабельно).[/URL][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В тексте неоднократно были допущены грамматические и/или орфографические ошибки.[/Color][/CENTER][/FONT]<br>" +
        "[Color=#c0c0c0][CENTER][FONT=arial]Убедительная просьба переписать вашу RolePlay ситуацию без ошибок![/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
              title: 'Отказ (3-е лицо)',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#D32F2F]Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить создание RP ситуации от 3-го лица.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Role Play ситуация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play ситуация составлена не по форме.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофиц. RP орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофиц. Орг. Одобрена',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная организация была проверена и получает вердикт - [Color=#388e3c] Одобрено.[/CENTER][/color][/FONT]<br>" +
        '[Color=#c0c0c0][FONT=arial][CENTER]Предупреждаю вас о том, что вы должны проявлять активность как в игре, так и в данной теме.[/CENTER][/color][/FONT]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]Тема открыта.[/CENTER][/color][/FONT]',
      prefix: ODOBRENOORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. на доработке',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[Color=#c0c0c0][CENTER][FONT=arial]Вам даётся 24 часа на дополнение вашей Неофициальной Организации.[/Color][/CENTER]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. отказ',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная организация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br>[/Color][URL='https://forum.blackrussia.online/threads/voronezh-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.4778286/']<br>[Color=#c0c0c0][FONT=arial][CENTER]Правила создания неофициальной RolePlay организации | VORONEZH (Кликабельно).[/URL][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
        prefix: OTKAZORG_PREFIX,
	  status: false,
            },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная Организация получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В тексте неоднократно были допущены грамматические и/или орфографические ошибки.[/Color][/CENTER][/FONT]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[CENTER][url=https://postimg.cc/w78FszF0][img]https://i.postimg.cc/4Nn0qNck/2776718330-preview-P84-Rw.png[/img][/url]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZORG_PREFIX,
	  status: false,
     },
    {
      title: 'Не по форме',
      content:
		'[FONT=arial][CENTER]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/CENTER]<br> [CENTER] [/CENTER][/FONT][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная Role Play организация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play организация составлена не по форме.[/Color][/CENTER][/FONT]" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#D32F2F][FONT=arial][CENTER]Закрыто.[/CENTER][/color][/FONT]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Закрыто', 'Zakrito');
    addButton('На рассмотрении', 'NaRassmotrenii');
    addButton('Решено', 'Resheno');
    addButton('Ожидание', 'ozhidanie');
    addButton('Вердикты', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#NaRassmotrenii').click(() => editThreadData(NARASSMOTRENIIRP_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#ozhidanie').click(() => editThreadData(OZHIDANIE_PREFIX, false));

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
  .join('')}</div>`;
  }

// бам
function pasteContent(id, data = {}, send = false) {
  const template = Handlebars.compile(buttons[id].content);

  if ($('.fr-element.fr-view p').text() === '')
    $('.fr-element.fr-view p').empty();

  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(data));
  $('a.overlay-titleCloser').trigger('click');

  if (buttons[id].autoSend !== false && send === true) {
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
        6 < hours && hours <= 12 ?
        'Доброе утро' :
        12 < hours && hours <= 18 ?
        'Добрый день' :
        18 < hours && hours <= 0 ?
        'Добрый вечер' :
       0 < hours && hours <= 6 ?
        'Добрая ночь':
        'Добрая ночь',
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}




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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }


function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	target_node_id: type,
	redirect_type: 'none',
	notify_watchers: 1,
	starter_alert: 1,
	starter_alert_reason: "",
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
  }),
}).then(() => location.reload());
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
    }
})();