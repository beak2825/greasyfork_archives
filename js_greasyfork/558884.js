// ==UserScript==
// @name         Личный скрипт (FULL)
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Для Жалоб,Био,РП Ситуаций, Неофиц. Орг
// @author       Danya_Zhukov
// @match        https://forum.blackrussia.online/*
// @icon         https://s1.hostingkartinok.com/uploads/images/2023/02/823db08928a6164d43c1c61aed4caf3e.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/558884/%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28FULL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558884/%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28FULL%29.meta.js
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
const buttons = [
     {
          title: 'На рассмотрении...',
      content:
               '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
               '[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br>' +
               '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваша жалоба направляется на рассмотрение...[/COLOR][/B]<br>' +
               '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#00FFFF]В скором времени Администрация сервера вынесет вердикт. Просьба не создавать дубликаты тем.[/COLOR][/B]<br>' +
               '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].[/FONT][/CENTER]',
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: true,
    },
    {
         title: '========================================================================================',
    },
    {
     title: '===================== Правила Role Play процесса =====================',
    },
    {
        title: '[2.01] NonRP Поведение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.01.[B][COLOR=#EFEFEF] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [B][COLOR=#E25041] Jail 30 минут[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.02] Уход от РП',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
       '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.02.[B][COLOR=#EFEFEF] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [B][COLOR=#E25041]Jail 30 минут / Warn[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.03] NonRP вождение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.03.[B][COLOR=#EFEFEF] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [B][COLOR=#E25041]Jail 30 минут[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
            title: '[2.04] Помеха (таран)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.04.[B][COLOR=#EFEFEF] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [B][COLOR=#E25041]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: '[2.05] NonRP Обман',
      content:
            '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.05.[B][COLOR=#EFEFEF] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [B][COLOR=#E25041]PermBan.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: '[2.07] AFK без ESC',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.07.[B][COLOR=#EFEFEF] Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам  | [B][COLOR=#E25041]Kick.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
 },
    {
       title: '[2.08] Аморальные действия',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.08.[B][COLOR=#EFEFEF] Запрещена любая форма аморальных действий сексуального характера в сторону игроков  | [B][COLOR=#E25041]Jail 30 минут / Warn.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
 },
    {
      title: '[2.09] Слив склада',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.09.[B][COLOR=#EFEFEF] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [B][COLOR=#E25041]Ban 15 - 30 дней / PermBan[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.13] DB',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.13.[B][COLOR=#EFEFEF] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [B][COLOR=#E25041]Jail 60 минут[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.14] RK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.14.[B][COLOR=#EFEFEF] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [B][COLOR=#E25041]Jail 30 минут [/CENTER][/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.15] TK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
	    '[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.15.[B][COLOR=#EFEFEF] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [B][COLOR=#E25041]Jail 60 минут / Warn (за два и более убийства) [/CENTER][/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.16] SK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.16.[B][COLOR=#EFEFEF] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [B][COLOR=#E25041]Jail 60 минут / Warn (за два и более убийства).[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.17] PG',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.17.[B][COLOR=#EFEFEF] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [B][COLOR=#E25041]Jail 30 минут [/CENTER][/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.18] MG',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.18.[B][COLOR=#EFEFEF]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [B][COLOR=#E25041]Mute 30 минут. [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: '[2.19] DM',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.19.[B][COLOR=#EFEFEF] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [B][COLOR=#E25041]Jail 60 минут.[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.20] Масс DM',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.20.[B][COLOR=#EFEFEF] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [B][COLOR=#E25041]Warn / Ban 3 - 7 дней.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
            title: '[2.21] Багоюз',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.21.[B][COLOR=#EFEFEF] Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [B][COLOR=#E25041]Ban 15 - 30 дней /PermBan(по согласованию с ГА,ЗГА,руководством тех.специалистов).[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: '[2.22] Сторонне ПО',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][FONT=georgia][SIZE=5][B][I]Игрок будет наказан по пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.22.[B][COLOR=#EFEFEF] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [B][COLOR=#E25041]Ban 15 - 30 дней / PermBan.[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '[2.31] Реклама',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.31.[B][COLOR=#EFEFEF] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [B][COLOR=#E25041]Ban 7 дней / PermBan. [/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.32] Оск Администрации',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.32.[B][COLOR=#EFEFEF] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [B][COLOR=#E25041]Ban 7 - 15 дней[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.33] Уязвимость правил',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.33.[B][COLOR=#EFEFEF] Запрещено пользоваться уязвимостью правил | [B][COLOR=#E25041]Ban 15 дней [/CENTER][/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.34] Уход от наказания',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.34.[B][COLOR=#EFEFEF] Запрещен уход от наказания | [B][COLOR=#E25041]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.35] IC и OCC угрозы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.35.[B][COLOR=#EFEFEF] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [B][COLOR=#E25041]Mute 120 минут / Ban 7 дней[/COLOR][/B]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.36] Перенос конфликтов из IC в OOC',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.36.[B][COLOR=#EFEFEF] Запрещено переносить конфликты из IC в OOC и наоборот | [B][COLOR=#E25041]Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: '[2.37] OOC Угрозы',
      content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.37.[B][COLOR=#EFEFEF] Запрещены OOC угрозы, в том числе и завуалированные | [B][COLOR=#E25041]Mute 120 минут / Ban 7 дней [/CENTER] <br>' +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.39] Злоуп. наказаниями',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.39.[B][COLOR=#EFEFEF] Злоупотребление нарушениями правил сервера | [B][COLOR=#E25041]Ban 7 - 30 дней [/CENTER] <br>' +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.40] Оск проекта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.40.[B][COLOR=#EFEFEF] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [B][COLOR=#E25041]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.43] Продажа промо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.43.[B][COLOR=#EFEFEF] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [B][COLOR=#E25041]Mute 120 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.47] ЕПП Фура',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.47.[B][COLOR=#EFEFEF] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [B][COLOR=#E25041]Jail 60 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.51] Помеха РП процессу',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.51.[B][COLOR=#EFEFEF] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [B][COLOR=#E25041]Jail 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.52] NonRP Акс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.52.[B][COLOR=#EFEFEF] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [B][COLOR=#E25041]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.53] (Названия маты)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.53.[B][COLOR=#EFEFEF] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [B][COLOR=#E25041]Ban 1 день / При повторном нарушении обнуление бизнеса [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.54] Неув. отношение к Адм',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.54.[B][COLOR=#EFEFEF] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [B][COLOR=#E25041]Mute 180 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.55] Баг аним',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.55.[B][COLOR=#EFEFEF] Запрещается багоюз связанный с анимацией в любых проявлениях. | [B][COLOR=#E25041]Jail 120 минут.[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: '[2.57] Невозврат долга',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 2.57.[B][COLOR=#EFEFEF] Запрещается брать в долг игровые ценности и не возвращать их. | [B][COLOR=#E25041]Ban 30 дней / permban.[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/CENTER] <br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=rgb(245, 37, 10)] • Примечание:[B][COLOR=#EFEFEF] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '===================== Игровые чаты​ =====================',
    },
    {
      title: '[3.01] Транслит',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.01.[B][COLOR=#EFEFEF] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [B][COLOR=#E25041]Устное замечание / Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: '[3.02] CapsLock',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.02.[B][COLOR=#EFEFEF] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [B][COLOR=#E25041]Mute 30 минут. [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: '[3.03] Оск в ООС',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.03.[B][COLOR=#EFEFEF] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.04] Оск/Упом Родни',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.04.[B][COLOR=#EFEFEF] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [B][COLOR=#E25041]Mute 120 минут / Ban 7 - 15 дней. [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: '[3.05] Флуд',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.05.[B][COLOR=#EFEFEF] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [B][COLOR=#E25041]Mute 30 минут. [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: '[3.06] Злоуп. знаками',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)] 3.06.[B][COLOR=#EFEFEF] Запрещено злоупотребление знаков препинания и прочих символов | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.07] Оскорбление',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.07.[B][COLOR=#EFEFEF] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.08] Слив СМИ',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.08.[B][COLOR=#EFEFEF] Запрещены любые формы «слива» посредством использования глобальных чатов | [B][COLOR=#E25041]PermBan [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.09] Угрозы о наказании со стороны Адм',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][I][FONT=georgia]Игрок будет наказан по пункту правил:[/FONT][/B][FONT=georgia][I][B]3.09.[B][COLOR=#EFEFEF] Запрещены любые угрозы о наказании игрока со стороны администрации | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.10] Выдача себя за Адм ',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.10.[B][COLOR=#EFEFEF] Запрещена выдача себя за администратора, если таковым не являетесь | [B][COLOR=#E25041]Ban 7 - 15 [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.11] Ввод в заблуждение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.11.[B][COLOR=#EFEFEF] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [B][COLOR=#E25041]Ban 15 - 30 дней / PermBan [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '[3.12] CapsLock + Транслит + Offtop (Report)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.12.[B][COLOR=#EFEFEF] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [B][COLOR=#E25041]Report Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: '[3.14] Музыка в войс',
      content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.14.[B][COLOR=#EFEFEF] Запрещено включать музыку в Voice Chat | [B][COLOR=#E25041]Mute 60 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.15] Оск/Упом род в войс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.15.[B][COLOR=#EFEFEF] Запрещено оскорблять игроков или родных в Voice Chat | [B][COLOR=#E25041]Mute 120 минут / Ban 7 - 15 дней [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.16] Шум в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.16.[B][COLOR=#EFEFEF] Запрещено создавать посторонние шумы или звуки | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.17] Реклама в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.17.[B][COLOR=#EFEFEF] Запрещена реклама в Voice Chat не связанная с игровым процессом | [B][COLOR=#E25041]Ban 7 - 15 дней [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.21] Реклама промо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.21.[B][COLOR=#EFEFEF] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [B][COLOR=#E25041]Ban 30 дней. [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.22] Торговля на ТТ Госс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.22.[B][COLOR=#EFEFEF] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[3.18] Полит. пропаганда',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]3.18.[B][COLOR=#EFEFEF] Запрещено политическое и религиозное пропагандирование | [B][COLOR=#E25041]Mute 120 минут / Ban 10 дней [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '===================== Положение об игровых аккаунтах =====================',
    },
    {
      title: '[4.04] Мультиаккаунт (3+)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]4.04.[B][COLOR=#EFEFEF] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | [B][COLOR=#E25041]PermBan. [/CENTER] <br>' +
        "Примечание: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[4.10] Фейк (Акк)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]4.10.[B][COLOR=#EFEFEF] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [B][COLOR=#E25041]Устное замечание + смена игрового никнейма / PermBan [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[4.14] Активность ТК',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[B][COLOR=rgb(245, 37, 10)]4.14.[B][COLOR=#EFEFEF] Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. | [B][COLOR=#E25041]Обнуление компании без компенсации [/CENTER] <br>' +
            'Примечание: минимальный онлайн для владельцев строительных и транспортных компаний — 7 часов в неделю активной игры (нахождение в nRP сне не считается за активную игру).[/CENTER] <br>' +
            'Примечание: если не заходить в игру в течении 5-ти дней, не чинить транспорт в ТК, не проявлять активность в СК - компания обнуляется автоматически.[/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '===================== Передачи жалобы =====================',
    },
    {
      title: 'Техническому Специалисту',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#EE0000]Ваша жалоба была передана на рассмотрение [B][COLOR=rgb(252, 94, 3)] Техническому специалисту.[/CENTER] <br>' +
		'[Color=rgb(3, 252, 244)]][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#EE0000]Ваша жалоба была передана на рассмотрение Главному Администратору @Fred_Kalashnikov [/CENTER] <br>' +
		'[Color=rgb(3, 252, 244)][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
         title: 'Передано ЗГА',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#EE0000]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора @Jes_Malfoy. [/CENTER] <br>' +
		'[Color=rgb(3, 252, 244)][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Специальному Администратору',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#EE0000]Ваша жалоба была передана на рассмотрение Специальному администратору @Sander_Kligan. [/CENTER] <br>' +
		'[Color=rgb(3, 252, 244)][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '===================== Правила Гос.Структур =====================',
    },
    {
      title: '[1.07] Прогул Р/Д',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 1.07.[B][COLOR=#EFEFEF] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [B][COLOR=#E25041]Jail 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
    },
    {
      title: '[1.08] Исп. фрак Т/С в личных целях',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 1.08.[B][COLOR=#EFEFEF] Запрещено использование фракционного транспорта в личных целях | [B][COLOR=#E25041]Jail 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[2.02] DM/Масс DM от МО',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 2.02.[B][COLOR=#EFEFEF] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [B][COLOR=#E25041]Jail 30 минут / Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[4.01] Н/П/Р/О (Объявы)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 4.01.[B][COLOR=#EFEFEF] Запрещено редактирование объявлений, не соответствующих ПРО | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[4.02] Н/П/П/Э (Эфиры)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 4.02.[B][COLOR=#EFEFEF] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [B][COLOR=#E25041]Mute 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: '[4.04] Замена текста (СМИ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 4.04.[B][COLOR=#EFEFEF] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [B][COLOR=#E25041]Ban 7 дней + ЧС организации [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
          },
    {
      title: '[6.01] DM/Масс от УМВД',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 6.01.[B][COLOR=#EFEFEF] Запрещено наносить урон игрокам без Role Play причины на территории УМВД | [B][COLOR=#E25041]Jail 30 минут / Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[6.02] Розыск без причины',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 6.02. [B][COLOR=#EFEFEF]Запрещено выдавать розыск без Role Play причины | [B][COLOR=#E25041]Jail 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[6.03] NonRP Cop',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 6.03.[B][COLOR=#EFEFEF] Запрещён NonRP Cop | [B][COLOR=#E25041]Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[6.04] NonRP поведение (УМВД)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 6.04.[B][COLOR=#EFEFEF] Запрещено nRP поведение | [B][COLOR=#E25041]Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[7.01] DM/Масс от ГИБДД',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 7.01.[B][COLOR=#EFEFEF] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | [B][COLOR=#E25041]Jail 30 минут / Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[7.02] Штраф без RP (ГИБДД)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 7.02.[B][COLOR=#EFEFEF] Запрещено выдавать штраф без Role Play причины | [B][COLOR=#E25041]Jail 30 минут [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[7.05] Конфискация В/У во время погони',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 7.05.[B][COLOR=#EFEFEF] Запрещено отбирать водительские права во время погони за нарушителем | [B][COLOR=#E25041]Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[8.01] DM/Масс на ТТ ФСБ',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 8.01.[B][COLOR=#EFEFEF] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | [B][COLOR=#E25041]Jail 30 минут / Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '[9.01] Задержание без РП  (ФСИН)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[B][COLOR=rgb(245, 37, 10)] 9.01.[B][COLOR=#EFEFEF] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | [B][COLOR=#E25041]Jail 30 минут / Warn [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '===================== Правила ОПГ =====================',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: Нарушение правил нападения на В/Ч | [B][COLOR=#E25041]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: Нападение на В/Ч разрешено только через блокпост КПП с последовательностью взлома | [B][COLOR=#E25041]/Warn NonRP В/Ч [/CENTER] <br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Игрок будет наказан за NonRP ограбление/похищение, в соответствии с этими правилами [URL="https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/"]Тык[/URL]. [/CENTER] <br>' +
		'[Color=#00ff00][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '===================== Отсутствие пунка жалоб =====================',
    },
    {
	  title: 'Нарушений от игрока не найдено',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Со стороны игрока нарушений не было найдено. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
         title: 'Логи (Нарушений не найдено)',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]После проврки логирования, нарушений от игрока не было найдено. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
         title: 'Чат не логируется',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Данный чат не логируется. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Ники не совпадают',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Никнейм в доказательствах и в форме не совпадают. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Недостаточно доказательств на нарушение от данного игрока.[/COLOR][/B]<br>' +

        '[CENTER][B][COLOR=#EFEFEF]Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/COLOR][/B]<br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Дублироване темы.[/COLOR][/B]<br>' +

        '[CENTER][B][COLOR=rgb(245, 37, 10)]Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на Адм',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Вы ошиблись разделом.[/COLOR][/B]<br>' +
        '[CENTER][B][COLOR=rgb(245, 37, 10)]Обратитесь в раздел [URL="https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.992/"]Жалобы на администрацию[/URL]. [/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В раздел обжалования',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Вы ошиблись разделом.[/COLOR][/B]<br>' +
        '[CENTER][B][COLOR=rgb(245, 37, 10)]Обратитесь в раздел [URL="https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.995/"]Обжалование наказаний[/URL].[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваша жалоба составлена не по форме.[/COLOR][/B]<br>' +
        '[CENTER][B][COLOR=rgb(245, 37, 10)]Убедительная просьба ознакомиться [URL="https://forum.blackrussia.online/index.php?threads/3429394/"]с правилами подачи жалоб на игроков[/URL].[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		"[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В ваших доказательствах отсутствует /time.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Требуются TimeCodes',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		'[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваша жалоба отказана, т.к в ней нету Таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений (Условия, сделка, обман и т.п).[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваша жалоба взята на рассмотрение.[B][COLOR=rgb(245, 37, 10)]Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER] <br>' +
		'[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
      {
      title: 'Название темы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Название (Заголовок) вашей жалобы составлено не по форме.[/COLOR][/B]<br>' +

        '[CENTER][B][COLOR=rgb(245, 37, 10)] Убедительная просьба ознакомиться [URL="https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.1305101/"]с правилами подачи жалоб на игроков[/URL].[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
          title: 'Прошло более 24 часа',
      content:
          '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Прошло более 24 часов.[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Прошло Более 72 часов',
      content:
          '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]С момента получения наказания прошло более 72 часов[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Опры (Вк,Инст)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]3.6[B][COLOR=#00FFFF] Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужны условия сделки',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В данных доказательствах отсутствуют условия сделки[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В данной ситуации нужнен фрапс[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В таких случаях нужна промотка чата.[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не полный фрапс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Требуется полный фрапс в данной ситуации.[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Доказательства не рабочие.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Нет доказательств',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В жалобе отсутствуют доказательства.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваши доказательства отредактированы.[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
    {
         title: 'Док-ва обрезаны',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваши доказательства обрезаны.[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Написание жалобы от 3-го лица',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Жалоба написана от 3-его лица[/CENTER] <br>' +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Вы ошиблись разделом, переподайте жалобу в нужный раздел.[/CENTER] <br>' +
        '[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Ошиблись сервером',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Вы ошиблись сервером, переподайте жалобу на нужном сервере.[/CENTER] <br>' +
        '[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		"[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Фотохостинги',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
		"[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Доказательства должны быть загружены на Yapix/Imgur/YouTube.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
		'[Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER]<br>' +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: '===================== Неофициальные RP Организации =====================',
   },
    {
      title: 'Неофициальная RP Орг. Одобрена',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5]Ваша Неофициальная RP Организация была проверена, и получает статус: [Color=#00FF00]Одобрено.[/color]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Мало информации в Биографии',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#808080]Мало информации в истории вашей организации.[/CENTER][B][COLOR=#EFEFEF]' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +
		'[CENTER][B][FONT=georgia][SIZE=5][B][Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER][/FONT]',
	  prefix: UNACCСEPT_PREFIX,
         },
    {
          title: 'Организация скопирована',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#808080]Неофициальная организация скопирована.[/CENTER][B][COLOR=#EFEFEF]' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +
		'[CENTER][B][FONT=georgia][SIZE=5][B][Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER][/FONT]',
	  prefix: UNACCСEPT_PREFIX,
          },
    {
         title: 'Ошибки в тексте',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#808080]Ошибки в тексте.[/CENTER][B][COLOR=#EFEFEF]' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +
		'[CENTER][B][FONT=georgia][SIZE=5][B][Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER][/FONT]',
	 prefix: UNACCСEPT_PREFIX,
            },
    {
        title: 'Не совпадают названия',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#808080]Заголовок не совпадает с названием организации.[/CENTER][B][COLOR=#EFEFEF]' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +
		'[CENTER][B][FONT=georgia][SIZE=5][B][Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER][/FONT]',
       prefix: UNACCСEPT_PREFIX,
            },
    {
        title: 'Шрифт',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]<br>" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#808080]Минимальный размер шрифта — 15. Разрешённые шрифты: Verdana, Times New Roman.[/CENTER][B][COLOR=#EFEFEF]<br><br>' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]<br>" +
		'[CENTER][B][FONT=georgia][SIZE=5][B][Color=#EE0000][CENTER]Отказано, закрыто.[/CENTER][FONT]<br><br>',
       prefix: UNACCСEPT_PREFIX,
         },
     {
         title: 'На доработке',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на то, чтобы дополнить вашу Неофициальную RP Организацию.[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
         title: 'Неофициальная RP ОРганизация; Активность',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
          "[CENTER][B][I][FONT=georgia]Ваша Неофициальная RP Организация может быть закрыта по пункту правил: 1.4 Организация должна проявлять активность, если таковой не будет, организация будет закрыта. Прекрипите отчёт об активности организации в виде скриншотов. Если же через 24 часа вашего отчёта не будет или он будет некорректный, организация будет закрыта.[/CENTER]",
              prefix: PINN_PREFIX,
	  status: false,
         },
    {
         title: 'Неофициальная RP ОРганизация; Нет Активности',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
         "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL]" +

        '[CENTER][B][FONT=Times New Roman][SIZE=7][B][COLOR=#E52B50]Организация закрыта, так как нет активности.[/CENTER][B][COLOR=#EFEFEF]' +

        "[CENTER][URL=https://www.gifki.org/cat-razdelitelnie-linii-134.htm][IMG]https://www.gifki.org/data/media/134/razdelitelnaya-liniya-animatsionnaya-kartinka-0243.gif[/IMG][/URL][/FONT]",
              prefix: UNACCСEPT_PREFIX,
	  status: false,
   },
   {
        title: '===================== RP Ситуации =====================',
        },
    {
      title: 'Добро',
      content:
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        "[CENTER]Ваша RP Ситуация была проверена, и получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
	  status: false,
    },
    {
           title: 'Ситуация скопирована',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay ситуация была проверена и получает статус: [/COLOR][/B]<br><br>' +
        '[COLOR=rgb(242, 12, 27)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]RolePlay ситуация скопирована.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
        },
    {
          title: 'Банк.счет',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay ситуация была проверена и получает статус: [/COLOR][/B]<br><br>' +
        '[COLOR=rgb(242, 12, 27)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Банковский счёт лишний.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
    {
         title: 'Ошибки',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay ситуация была проверена и получает статус: [/COLOR][/B]<br><br>' +
        '[COLOR=rgb(242, 12, 27)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]В RolePlay ситуации присутствуют ошибки.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
   },
    {
        title: 'Ошиблись разделом',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
        '[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay ситуация была проверена и получает статус: [/COLOR][/B]<br><br>' +
        '[COLOR=rgb(242, 12, 27)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia][SIZE=5][B][COLOR=#FFFF00]Вы ошиблись разделом.[/CENTER][B][COLOR=rgb(245, 37, 10)]" +
        '[CENTER][B][IMG]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/IMG][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
    {
    title: '===================== RP Биографии =====================',
   },
   {
          title: 'Биография одобрена',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/1db921/24/0/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B] При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

"[/CENTER]",
       prefix: ACCСEPT_PREFIX,
     },
     {
          title: 'На дополнение',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#00FFFF]Ваша RolePlay биография была проверена.[B][COLOR=#FF0088]Вам даётся ровно 24 часа на дополнение RP Биографии. [/COLOR][/B]<br><br>' +
'[COLOR=rgb(222, 237, 9)][B][SIZE=6]На рассмотрении...[/SIZE][/B][/COLOR]<br><br>' +

"[/CENTER]",
         prefix: UNACCСEPT_PREFIX,
     },
     {
	  title: 'Большое количество ошибок',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Большое количество ошибок в тексте [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
   },
     {
           title: 'Дубликат',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Дубликат [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
   },
     {
         title: 'Орфографические и пунктуационные ошибки',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Орфографические и пунктуационные ошибки [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
   },
     {
      title: 'Ошибки в тексте',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +
"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Ошибки в тексте [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
    },
     {
         title: 'Рассказ от 1-ого лица',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Рассказ ведётся от 1-ого лица [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
 },
     {
	  title: 'Возраст не совпал',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4887982/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Возраст не совпал с датой рождения [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
 },
     {
	  title: 'Слишком молод',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Некорректен возраст (слишком молод) [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
          },
     {
	  title: 'Биография скопирована',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалоб на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография скопирована [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
          },
     {
	  title: 'Недостаточно РП информации',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Недостаточно РП информации [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
          },
     {
	  title: 'Не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография не по форме [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
           },
     {
          title: 'Не по форме (МГ)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография не по форме (Вся информация в биографии является IC. Запрещено проявление в ней OOC.) [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
           },
     {
	  title: 'Некоррект национальность',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Некорректная национальность [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
          title: 'Некоррект образование',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Некорректное образование [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
         title: 'Несостыковки',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Несостыковки в биографии [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
           title: 'Шрифт',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
 title: 'Фотографии',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] В биографии отсутствуют фотографии и иные материалы, относящиеся к истории вашего персонажа. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
         title: 'Недостаточно Фотографии',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] В биографии недостаточно фотографий и иных материалов, относящихся к истории вашего персонажа. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
         title: 'Фотографии не открываются',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] В биографии не открываются фотографии и иные материалы, относящиеся к истории вашего персонажа. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
         title: 'Имя',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Запрещено составлять биографию существующих людей. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
         },
     {
      title: 'Заголовок не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Заголовок биографии не по форме [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Times New Roman][COLOR=#DC143C]С уважением ГКФ Danya_Zhukov.[/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         prefix: UNACCСEPT_PREFIX,
	},
];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('👽На рассмотрение', 'pin');
    addButton('👺КП', 'teamProject');
    addButton('👾ГА', 'Ga');
    addButton('💣Спецу', 'Spec');
    addButton('✅Одобрено', 'accepted');
    addButton('❌Отказано', 'unaccept');
    addButton('✨Тех. Специалисту', 'Texy');
    addButton('🤗Решено', 'Resheno');
    addButton('😎Закрыто', 'Zakrito');
    addButton('🗯Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
	}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
  // Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }

}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
	})();

    (function() {
    'use strict';

    // Массив стоковых цветов для дней недели
    const dayColors = {
        "Пн": "#cccccc",   // Пн (стоковый цвет)
        "Вт": "#cccccc",   // Вт
        "Ср": "#cccccc",   // Ср
        "Чт": "#cccccc",   // Чт
        "Пт": "#cccccc",   // Пт
        "Сб": "#cccccc",   // Сб
        "Вс": "#cccccc",   // Вс
    };

    // Массив цветов для изменения при наведении
    const hoverColors = {
        "Пн": "#FF5733",   // Пн
        "Вт": "#33FF57",   // Вт
        "Ср": "#3357FF",   // Ср
        "Чт": "#9C27B0",   // Чт
        "Пт": "#00BCD4",   // Пт
        "Сб": "#FFEB3B",   // Сб
        "Вс": "#8D6E63",   // Вс
    };

    // Функция для создания элемента с подсчетом
    function createCountElement(count, text, day) {
        var countElement = document.createElement('div');
        countElement.className = 'count-element';
        countElement.textContent = text + ': ' + count;

        // Получаем стоковый цвет для дня
        const color = dayColors[day] || "#cccccc";
        const hoverColor = hoverColors[day] || "#cccccc";

        // Стиль элемента с учетом стокового цвета
        countElement.style.fontFamily = 'Arial, sans-serif';
        countElement.style.fontSize = '14px';  // Уменьшаем размер шрифта
        countElement.style.color = '#ffffff';
        countElement.style.backgroundColor = color;  // Устанавливаем стоковый цвет
        countElement.style.padding = '5px';  // Уменьшаем отступы
        countElement.style.margin = '2px 0';  // Уменьшаем отступы между элементами
        countElement.style.borderRadius = '5px';
        countElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        countElement.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        // Анимация при наведении
        countElement.addEventListener('mouseover', function() {
            countElement.style.backgroundColor = hoverColor;  // Меняем цвет при наведении
            countElement.style.transform = 'scale(1.05)';
        });

        countElement.addEventListener('mouseout', function() {
            countElement.style.backgroundColor = color;  // Возвращаем стоковый цвет
            countElement.style.transform = 'scale(1)';
        });

        return countElement;
    }

    // Функция для получения дня недели и даты в формате ДД.ММ.ГГГГ
    function getDayOfWeekAndFullDate(dateString) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex];

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${dayOfWeek} ${day}.${month}.${year}`;
    }

    // Функция для получения даты создания темы
    function getThreadCreationDate(element) {
        const dateElement = element.querySelector('time[datetime]');
        if (dateElement) {
            const dateTimeString = dateElement.getAttribute('datetime');
            return dateTimeString.split('T')[0]; // Возвращаем только дату (без времени)
        }
        return null;
    }

    // Функция для проверки, находится ли тема в пределах текущей недели
    function isWithinCurrentWeek(threadDate) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const threadDateObj = new Date(threadDate);
        return threadDateObj >= oneWeekAgo && threadDateObj <= currentDate;
    }

    // Основная функция для подсчета элементов
    async function countElements() {
        // 1. Получаем все темы с нужными классами для "в ожидании" и "на рассмотрении"
        var elementsWaiting = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elementsUnderReview = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        // 2. Подсчитываем количество тем
        var waitingCount = elementsWaiting.length;
        var underReviewCount = elementsUnderReview.length;

        // 3. Получаем все темы на странице
        const currentPageThreads = document.querySelectorAll('.structItem.structItem--thread');

        // 4. Создаем объект для хранения количества тем по дням недели
        const weekCounts = {
            "Пн": {date: '', count: 0},
            "Вт": {date: '', count: 0},
            "Ср": {date: '', count: 0},
            "Чт": {date: '', count: 0},
            "Пт": {date: '', count: 0},
            "Сб": {date: '', count: 0},
            "Вс": {date: '', count: 0}
        };

        // 5. Перебираем все темы и считаем темы по дням недели
        currentPageThreads.forEach(element => {
            const threadDate = getThreadCreationDate(element);
            if (threadDate && isWithinCurrentWeek(threadDate)) {
                const dayOfWeekAndFullDate = getDayOfWeekAndFullDate(threadDate);
                const dayOfWeek = dayOfWeekAndFullDate.split(' ')[0];

                weekCounts[dayOfWeek].count++;
                weekCounts[dayOfWeek].date = dayOfWeekAndFullDate;
            }
        });

        // 6. Создаем контейнер для счетчика тем за неделю
        const counterContainerWeek = document.createElement('div');
        counterContainerWeek.style.position = 'absolute';
        counterContainerWeek.style.top = '10px';
        counterContainerWeek.style.left = '10px';
        counterContainerWeek.style.zIndex = '9999';
        counterContainerWeek.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerWeek.style.padding = '10px';
        counterContainerWeek.style.borderRadius = '8px';
        counterContainerWeek.style.color = '#fff';
        counterContainerWeek.style.fontFamily = 'Arial, sans-serif';
        counterContainerWeek.style.fontSize = '14px';
        counterContainerWeek.style.maxWidth = '300px';
        counterContainerWeek.style.maxHeight = '300px';
        counterContainerWeek.style.overflowY = 'auto';
        counterContainerWeek.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementWeek = document.createElement('div');
        headerElementWeek.textContent = 'Темы за неделю по дням:';
        headerElementWeek.style.fontWeight = 'bold';
        headerElementWeek.style.marginBottom = '10px';
        counterContainerWeek.appendChild(headerElementWeek);

        // Добавляем количество тем по дням недели в контейнер
        for (const day in weekCounts) {
            if (weekCounts[day].date !== '') {
                counterContainerWeek.appendChild(createCountElement(weekCounts[day].count, `${weekCounts[day].date}`, day));
            }
        }

        // 7. Создаем контейнер для счетчика тем в ожидании и на рассмотрении (в правом верхнем углу)
        const counterContainerStatus = document.createElement('div');
        counterContainerStatus.style.position = 'absolute';
        counterContainerStatus.style.top = '10px';  // Размещаем в верхней части
        counterContainerStatus.style.right = '10px';  // Размещаем справа
        counterContainerStatus.style.zIndex = '9999';
        counterContainerStatus.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerStatus.style.padding = '10px';
        counterContainerStatus.style.borderRadius = '8px';
        counterContainerStatus.style.color = '#fff';
        counterContainerStatus.style.fontFamily = 'Arial, sans-serif';
        counterContainerStatus.style.fontSize = '14px';
        counterContainerStatus.style.maxWidth = '200px';
        counterContainerStatus.style.maxHeight = '200px';
        counterContainerStatus.style.overflowY = 'auto';
        counterContainerStatus.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementStatus = document.createElement('div');
        headerElementStatus.textContent = 'Статус тем:';
        headerElementStatus.style.fontWeight = 'bold';
        headerElementStatus.style.marginBottom = '10px';
        counterContainerStatus.appendChild(headerElementStatus);

        // Добавляем количество тем в ожидании и на рассмотрении
        const waitingElement = createCountElement(waitingCount, `В ожидании`, 'Пн');
        const underReviewElement = createCountElement(underReviewCount, `На рассмотрении`, 'Вт');
        counterContainerStatus.appendChild(waitingElement);
        counterContainerStatus.appendChild(underReviewElement);

        // Вставляем контейнеры в body
        document.body.appendChild(counterContainerWeek);
        document.body.appendChild(counterContainerStatus);
    }

    // Вызываем функцию при загрузке страницы
    window.onload = function() {
        countElements();
    };

})();