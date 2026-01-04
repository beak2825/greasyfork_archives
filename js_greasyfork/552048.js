// ==UserScript==
// @name         Script by One
// @namespace    http://tampermonkey.net/
// @version      8.2.1
// @description  good luck
// @author       oneyanq
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @license MIT
// @icon         https://radika1.link/2025/10/09/cXb2KPSeKgUdubBvvwQ2SunyrZX1ekcPQA0UPlo6gaMzVu9fDU5dAYFBMRifkCm9NkdIc4zUySXf0f-lR71thRAQ85e0814ebd164b24.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552048/Script%20by%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/552048/Script%20by%20One.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4;
const ACCСEPT_PREFIX = 8;
const RESHENO_PREFIX = 6;
const PINN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
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
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
      autoSend: false,
    },
    {
      title: 'Отказано',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
      autoSend: false,
    },
    {
      title: 'Закрыто',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
      autoSend: false,
    },
    {
      title: 'Рассмотрении',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#ffd700]На рассмотрении.[/COLOR][/FONT][/CENTER]',
      prefix: PINN_PREFIX,
      status: true,
      autoSend: false,
    },
    {
      title: 'Решено',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Решено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
      autoSend: false,
    },
    {
      title: 'Рассмотрено',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0] TEXT [/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Рассмотрено, закрыто.[/COLOR][/FONT][/CENTER]', // Текст восстановлен: "Рассмотрено, закрыто."
      prefix: WATCHED_PREFIX,
      status: false,
      autoSend: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила RolePlay процесса•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP поведение(2.01)',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins><b><ins>[quote][Color=#D32F2F]2.01.[/Color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#D32F2F]| Jail 30 минут[/color][/font][/quote][/CENTER]<br>" +
        '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/color][/FONT][/center]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/color][/font][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
  title: 'Уход от RP(2.02)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.02.[/Color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#D32F2F]| Jail 30 минут / Warn[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/font][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'NonRP вождение(2.03)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.03.[/Color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#D32F2F]| Jail 30 минут / 60 минут (Для дальнобойщиков/инкассаторов)[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/font][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Помеха RP процессу(2.04)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.04.[/Color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#D32F2F]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/font][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'NonRP Обман(2.05)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.05.[/Color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#D32F2F]| PermBan[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/font][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Аморал. действия(2.08)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.08.[/Color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#D32F2F]| Jail 30 минут / Warn[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Слив склада(2.09)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.09.[/Color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#D32F2F]| Ban 15 - 30 дней / PermBan[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'DB(2.13)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.13.[/Color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#D32F2F]| Jail 60 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'ТК(2.15)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.15.[/Color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#D32F2F]| Jail 60 минут / Warn (за два и более убийства)[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'SK(2.16)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.16.[/Color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#D32F2F]| Jail 60 минут / Warn (за два и более убийства)[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'MG(2.18)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.18.[/Color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#D32F2F]| Mute 30 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'DM(2.19)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.19.[/Color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#D32F2F]| Jail 60 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Mass DM(2.20)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.20.[/Color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#D32F2F]| Warn / Ban 3 - 7 дней[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Стороннее ПО(2.22)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.22.[/Color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#D32F2F]| Ban 15 - 30 дней / PermBan [/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Реклама сторон. ресурсов(2.31)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.31.[/Color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#D32F2F]| Ban 7 дней / PermBan[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Оск. адм(2.32)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.32.[/Color] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [Color=#D32F2F]| Ban 7 - 15 дней / PermBan[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Угрозы IC и OOC(2.35)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.35.[/Color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#D32F2F]| Mute 120 минут / Ban 7 дней[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Угрозы ООС(2.37)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.37.[/Color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#D32F2F]| Mute 120 минут / Ban 7 дней[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Злоуп. нарушениями(2.39)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.39.[/Color] Злоупотребление нарушениями правил сервера [Color=#D32F2F]| Ban 7 - 30 дней[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Оск. проекта(2.40)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.40.[/Color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#D32F2F]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Продажа промо(2.43)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.43.[/Color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#D32F2F]| Mute 120 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'NonRP акс(2.52)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.52.[/Color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#D32F2F]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Неув. к адм.(2.54)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.54.[/Color] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#D32F2F]| Mute 180 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Баг. аним(2.55)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.55.[/Color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#D32F2F]| Jail 120 минут[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
{
  title: 'Долг(2.57)',
  content:
    '[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/center]<br>' +
    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
    '[CENTER][FONT=Arial][Color=#D32F2F]Игрок будет наказан по данному пункту правил:[/Color]<br><b><ins>[quote][Color=#D32F2F]2.57.[/Color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#D32F2F]| Ban 30 дней / permban[/Color][/quote]</ins></b>[/FONT][/CENTER]<br>' +
    '[center][font=arial][Color=#D32F2F]Спасибо за Ваше обращение![/Color][/FONT][/center]<br>' +
    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
    '<br>[CENTER][FONT=Arial][Color=#388e3c]Одобрено, закрыто.[/Color][/FONT][/center]',
  prefix: ACCСEPT_PREFIX,
  status: false,
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Игровые чаты•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
	   title: 'CapsLock(3.02)',
	   content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
	      prefix: ACCСEPT_PREFIX,
	      status: false,
	},
    {
      title: 'Оск в ООС(3.03)',
      content:
	    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/оск род(3.04)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=#D32F2F]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	    status: false,
    },
    {
	  title: 'Flood(3.05)',
	  content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
	      prefix: ACCСEPT_PREFIX,
	      status: false,
	},
    {
      title: 'Злоуп. символами(3.06)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ(3.08)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=#D32F2F]| PermBan[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм(3.10)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=#D32F2F]| Ban 7 - 15 + ЧС администрации[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл.(3.11)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=#D32F2F]| Ban 15 - 30 дней / PermBan[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс(3.14)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=#D32F2F]| Mute 60 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс(3.16)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Призыв к флуду(3.18)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[COLOR=#D32F2F] | Mute 120 минут / Ban 10 дней[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Рекл. промо(3.21)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=#D32F2F]| Ban 30 дней[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на ТТ госс(3.22)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Мат в VIP чат(3.23)',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
		'[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Положение об игровых аккаунтах•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
      title: 'Фейк аккаунт(4.10)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по данному пункту правил:[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=#D32F2F]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Передачи жалобы•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
      title: 'ГКФ/ЗГКФ',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [COLOR=#FFA500]Главному Куратору и его заместителю.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Просьба не создавать подобных тем. Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PINN_PREFIX,
      status: true,
    },
    {
      title: 'Тех. специалисту',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [COLOR=#00BFFF]Техническому Специалисту.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Просьба не создавать подобных тем. Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: TEXY_PREFIX,
      status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [COLOR=#D32F2F]Главному Администратору.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Просьба не создавать подобных тем. Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Передано Спец. администратору',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Ваша жалоба была передана на рассмотрение [COLOR=#ffd700]Специальной Администрации.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Просьба не создавать подобных тем. Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
      status: true,
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Ваша жалоба взята на [COLOR=#ffd700]рассмотрение.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Просьба ожидать ответа и не создавать дубликаты данной темы.[/COLOR][/FONT][/CENTER]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Отсутствие пункта жалоб•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
      title: 'Нарушений не найдено',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Нарушений со стороны данного игрока не было найдено.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: '1 попытка нрп обм.',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Для подтверждения попытки nRP обмана 1 совершенного обмена недостаточно. Игрок мог мисскликнуть. В подобных случаях вы должны отклонить 1 обмен и предложить игроку обменяться снова.[/COLOR][/FONT][/CENTER]<br><br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Жалоба не подлежит дальнейшему рассмотрению.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ответ уже дан в прошл. ЖБ',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Ответ был дан в прошлой жалобе.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Недостаточно доказательств на нарушение от данного игрока.[/COLOR]<br><br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки/нарушения от какого-либо игрока.[/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Дублир. темы',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial]Дублирование темы.[COLOR=#c0c0c0]<br><br>Если вы дальше продолжите дублировать темы, то ваш форумный аккаунт будет заблокирован.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Вы ошиблись разделом.[/COLOR]<br><br>Обратитесь в раздел:<br>[URL=\'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1486/\'][COLOR=#c0c0c0]Жалобы на администрацию (click).[/COLOR][/URL][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
              title: 'В жалобы на лд',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Вы ошиблись разделом.[/COLOR]<br><br>Обратитесь в раздел:<br>[URL=\'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1487/\'][COLOR=#c0c0c0]Жалобы на лидеров (click).[/COLOR][/URL][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
              title: 'В жалобы на игроков',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Вы ошиблись разделом.[/COLOR]<br><br>Обратитесь в раздел:<br>[URL=\':https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1488/\'][COLOR=#c0c0c0]Жалобы на игроков (click).[/COLOR][/URL][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Вы ошиблись разделом.[/COLOR]<br><br>Обратитесь в раздел:<br>[URL=\'https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1489/\'][COLOR=#c0c0c0]Обжалование наказаний (click).[/COLOR][/URL][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В тех. раздел',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Вы ошиблись разделом.[/COLOR]<br><br>Переподайте жалобу по ссылке ниже:<br>[COLOR=#00BFFF][FONT=Arial][CENTER][URL=\'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-krasnodar.1460/\'][COLOR=#00BFFF]Технический раздел (click).[/COLOR][/URL][/FONT][/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'В жб на тех. спец.',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Вы ошиблись разделом.[/COLOR]<br><br>Переподайте жалобу по ссылке ниже:<br>[COLOR=#00BFFF][FONT=Arial][CENTER][URL=\'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1459/\'][COLOR=#00BFFF]Жалобы на Технических Специалистов (click).[/COLOR][/URL][/CENTER][/FONT][/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
         title: 'В жалобы на сотрудников',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Обратитесь в раздел жалоб на сотрудников данной фракции.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
        title: 'Форма темы',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Ваша жалоба составлена не по форме.[/COLOR]<br><br>[COLOR=#c0c0c0]Убедительная просьба ознакомиться:[/COLOR]<br>[URL=\'https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/\'][COLOR=#c0c0c0]Правила подачи жалоб на игроков (click).[/COLOR][/URL][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет /time',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]На ваших доказательствах отсутствует /time.[/COLOR][COLOR=#D32F2F] Жалоба не может быть рассмотрена.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
    {
      title: 'Более 72 часов',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]С момента нарушения прошло более [/COLOR][COLOR=#D32F2F]72-х часов.[/COLOR] [COLOR=#D32F2F]Жалоба в таком случае не рассматривается.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
      {
      title: 'Док-ва через запрет соц. сети',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Загрузка доказательств в соц. сети (ВКонтакте, instagram и др.) запрещается.<br><br>Доказательства должны быть загружены на фото/видео хостинги (YouTube, Yapix, imgur).[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    	},
    {
      title: 'Нет условий сделки',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]В данных доказательствах отсутствуют/некорректные условия сделки.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
              title: 'Не видно ник',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]На ваших доказательствах не видно Nick_Name игрока.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]В таких случаях нужна видеофиксация.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]В таких случаях нужен фрапс + промотка чата.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Предоставленное видео обрывается.<br><br>Загрузите полные видеодоказательства в видеохостинг.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет док-в',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Не прикреплены доказательства.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Ваши доказательства отредактированы.<br><br>Загрузите доказательства в первоначальном виде.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Плохое качество док-в',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Ваши доказательства имеют плохое качество/нечитабельный/плохочитаемый текст.<br><br>Загрузите доказательства в разрешенные фото/видео хостинги.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
    {
        title: 'От 3-го лица',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Жалобы от 3-их лиц не рассматриваются.<br><br>Жалоба должна быть предоставлена от самого участника ситуации.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
            },
    {
      title: 'Неадекват. текст',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Жалоба в таком формате рассмотрена быть не может.<br><br>Составьте жалобу в адекватной форме.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
    {
               title: 'Перемещаю ЖБ',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Перемещаю вашу жалобу в нужный сервер/раздел.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][COLOR=#ffd700][FONT=Arial]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: OZHIDANIE_PREFIX,
      status: false,
  	},
     {
               title: 'ЖБ на каждого игрока',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Составьте жалобу на каждого нарушителя по отдельности.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
     {
      title: 'Ошиблись разделом/сервером',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Вы ошиблись сервером/разделом.<br><br>Переподайте жалобу в нужный раздел.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
     {
      title: 'Не написан ник',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Игровой ник автора жалобы и ник игрока на которого подается жалоба, должны быть указаны в обязательном порядке.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
     {
      title: 'Нет подтверждения усл. сделки',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Игрок не подтвердил условия вашей сделки.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
  	{
      title: 'Не указаны тайм-коды',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]На видеодоказательствах длиной в 3 минуты и более должны быть указаны тайм-коды.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
  	},
  	{
      title: 'Док-ва не рабочие',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]Ваши доказательства не рабочие или битая ссылка, пожалуйста загрузите доказательства на разрешенных фото/видео хостинги.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
  	  status: false,
  	},
  	{
      title: 'Не сохр. логи',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#c0c0c0]По предоставленным доказательствам наказание на данный момент выдать невозможно.<br><br>Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.[/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  	  prefix: CLOSE_PREFIX,
  	  status: false,
  	},
  	{
  	  title: 'Игрок наказан',
  	  content:
  	    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
  	    '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
  	    '[CENTER][FONT=Arial][COLOR=#c0c0c0]Игрок уже наказан за свои нарушения.[/COLOR][/FONT][/CENTER]<br>' +
  	    '[CENTER][COLOR=#388e3c][FONT=Arial]Спасибо за ваше обращение.[/COLOR][/FONT][/CENTER]<br>' +
  	    '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
  	    '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  	  prefix: CLOSE_PREFIX,
  	  status: false,
  	},
     {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила Лидеров•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
      title: 'Нет нарушений',
      content:
		'[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#c0c0c0]Со стороны лидера нарушений не выявлено.[/Color][/font][/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
		'[CENTER][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
  title: 'Работа над лд',
  content:
    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#c0c0c0]С лидером будет проведена необходимая работа.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Будет снят',
  content:
    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#c0c0c0]Лидер будет снят со своего поста.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: WATCHED_PREFIX,
  status: false,
},
{
  title: 'Снят с поста',
  content:
    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#c0c0c0]Лидер снят со своего поста.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Получит наказание',
  content:
    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#c0c0c0]Лидер получит соответствующее наказание.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#D32F2F]Закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Будут приняты меры',
  content:
    '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#c0c0c0]Будут приняты меры.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за информацию.[/COLOR][/FONT][/CENTER]<br>' +
    '[CENTER][IMG]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/IMG][/CENTER]<br>' +
    '[CENTER][FONT=Arial][COLOR=#388e3c]Рассмотрено.[/COLOR][/FONT][/CENTER]',
  prefix: CLOSE_PREFIX,
  status: false,
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила Госс. Структур•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
      title: 'Прогул Р/Д(1.07)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Исп. фракц. т/с в л/ц(1.08)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]1.08.[/COLOR] Запрещено использование фракционного транспорта в личных целях [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/Р/О(Объявы)(4.01)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих правилам редактирования объявлений [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Н/П/П/Э(Эфиры)(4.02)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]4.02.[/COLOR] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=#D32F2F]| Mute 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Редакт. в личных целях(СМИ)(4.04)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=#D32F2F]| Ban 7 дней + ЧС организации[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск/Штраф',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (гос. структур):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]6.01/7.01.[/COLOR] Запрещено выдавать розыск/штраф без IC причины [COLOR=#D32F2F]| Warn[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Правила ОПГ•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
	{
      title: 'Нарушение правил В/Ч',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (нападения на В/Ч):[/COLOR]<br><b><ins>[quote]2. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=#D32F2F]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (нападения на В/Ч):[/COLOR]<br><b><ins>[quote]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [COLOR=#D32F2F]| /Warn NonRP В/Ч[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
            },
    {
      title: 'Наруш. правил ограблений/похищений',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (ограблений и похищений):[/COLOR]<br><b><ins>[quote]Запрещено нарушение правил ограблений/похищений [URL="https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/"][COLOR=#c0c0c0](click)[/COLOR][/URL]<br>[COLOR=#D32F2F]| Jail (от 10 до 60 минут) / Warn / Ban (от 1 до 30 дней) / Строгий или устный выговор лидеру нелегальной организации[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                    },
	{
      title: 'Only сторона атаки и защиты(1.06)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]1.06.[/COLOR] На территории проведения БизВара может находиться только сторона атаки и сторона защиты [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
    {
      title: 'Задерж. во время БВ(1.13)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]1.13.[/COLOR] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
    {
      title: 'Авто во время БВ(2.04)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.04.[/COLOR] Запрещено после начала бизвара использовать транспорт на территории его ведения [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
	{
      title: 'Запрещены маски/бронежилеты(2.05)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.05.[/COLOR] Запрещено использовать маски/бронежилеты на БизВаре [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
    {
      title: 'ДМ перед БВ(2.06)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.06.[/COLOR] Запрещено преждевременное убийство членов вражеской группировки за 10 минут до начала бизвара на территории его проведения [COLOR=#D32F2F]| Jail 60 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
	{
      title: 'Аптечка во время БВ(2.07)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.07.[/COLOR] Запрещено использовать аптечки во время перестрелки на БизВаре [COLOR=#D32F2F]| Jail 15 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
                           },
	{
      title: 'Крыша на БВ(2.08)',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' + // Заменил URL на унифицированный разделитель
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (войны за бизнес):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.08.[/COLOR] Запрещено находиться на крышах во время бизвара [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' + // Заменил URL на унифицированное изображение
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Провокация гос.',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' + // Заменил URL на унифицированный разделитель
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (ОПГ):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]2.[/COLOR] Запрещено провоцировать сотрудников государственных организаций [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' + // Заменил URL на унифицированное изображение
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Провокация ОПГ',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' + // Заменил URL на унифицированный разделитель
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (ОПГ):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]3.[/COLOR] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' + // Заменил URL на унифицированное изображение
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Уход от погони',
      content:
        '[CENTER][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>' + // Заменил URL на унифицированный разделитель
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Игрок будет наказан по пункту правил (ОПГ):[/COLOR]<br><b><ins>[quote][COLOR=#D32F2F]8.[/COLOR] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [COLOR=#D32F2F]| Jail 30 минут[/COLOR][/quote]</ins></b>[/FONT][/CENTER]<br>' +
        '[CENTER][FONT=Arial][COLOR=#D32F2F]Спасибо за Ваше обращение![/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>' + // Заменил URL на унифицированное изображение
        '[CENTER][FONT=Arial][COLOR=#388e3c]Одобрено, закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
            title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay Биографии•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Био одобрено',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/FONT][/CENTER]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
          "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт -[Color=#388e3c] Одобрено.[/color][/FONT][/center]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
          '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био на доработке',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#c0c0c0]Вам даётся 24 часа на дополнение вашей RolePlay биографии.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/color][/FONT][/center]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
    status: true,
    autoSend: false,
    },
    {
      title: 'Био отказ',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER][CENTER][/font][/CENTER][/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#c0c0c0][FONT=Arial][CENTER]<br><<Правила написания RP биографии (click)>>[/URL][/Color][/FONT][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ(заголовок темы)',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт -[Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить неправильное заполнение заголовка темы.<br>Ознакомьтесь с правилам подачи:<br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][Color=#c0c0c0][FONT=Arial][CENTER]<br><<Правила написания RP биографии (click)>>[/URL][/Color][/FONT][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ (3-е лицо)',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт -[Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить создание биографии от 3-го лица.[/Color][/font][/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Био украдена',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]<br>Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: запрещена полная или частичная кража чужих RolePlay биографий, включая свои с других серверов.[/QUOTE][/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Возраст не совпадает',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: указанный возраст должен совпадать с датой рождения.[/QUOTE][/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
     {
      title: 'Меньше 18 лет',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
         "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Данному персонажу меньше 18 лет.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
         '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Ник с "_"/Англ',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: никнейм должен быть указан без нижнего подчеркивания и на русском языке как в заголовке, так и в самой теме.[/QUOTE][/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Супер способности',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>[QUOTE]Примечание: запрещено приписывание своему персонажу супер-способностей.[/QUOTE][/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Наруш. логики',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей биографии присутствует нарушение правил логики.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно RolePlay информации',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей биографии недостаточно информации.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В вашей RP биографии были допущены грамматические и/или орфографические ошибки.[/Color][/font][/CENTER]<br>" +
        "[CENTER][FONT=Arial][Color=#c0c0c0]Убедительная просьба переписать вашу RolePlay Биографию без ошибок![/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Role Play биография была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play биография составлена не по форме.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Мало инфы в пункте "Детство"',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Детство'.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Мало инфы в пункте "Юность/взрослая жизнь"',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Юность и возрослая жизнь'.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
      title: 'Мало инфы в пункте "Настоящее время"',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay биография получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Недостаточно информации в пункте 'Настоящее время'.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
       },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•RolePlay ситуации•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'RolePlay ситуация одобрена',
      content:
		'[CENTER][FONT=arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/Color][/font][/CENTER]<br>[CENTER] [/CENTER]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#c0c0c0]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#388e3c] Одобрено.<br>[/color][/FONT][/center]<br>"+
        "[CENTER][FONT=Arial][Color=#c0c0c0][QUOTE]Примечание: При одобренной RP ситуации Администрация не обязуется выплачивать вам вознаграждение.[/QUOTE][/Color][/FONT]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'RolePlay ситуация на доработке',
      content:
		'[CENTER][FONT=arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}! [/FONT][/Color][/font][/CENTER]<br> [CENTER] [/CENTER]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#c0c0c0]Вам даётся 24 часа на дополнение вашей RolePlay ситуации.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/color][/FONT]',
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: true,
    },
    {
      title: 'RolePlay ситуация отказ',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br><br>[/Color][URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.4597427/'][Color=#c0c0c0][FONT=Arial][CENTER]Правила RP ситуаций | VORONEZH (click).[/URL][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В тексте неоднократно были допущены грамматические и/или орфографические ошибки.[/Color][/font][/CENTER]<br>" +
        "[CENTER][FONT=Arial][Color=#c0c0c0]Убедительная просьба переписать вашу RolePlay ситуацию без ошибок![/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
              title: 'Отказ (3-е лицо)',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]<br>' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша RolePlay ситуация была проверена и получает вердикт - [Color=#D32F2F]Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить создание RP ситуации от 3-го лица.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Role Play ситуация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play ситуация составлена не по форме.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофиц. RP орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофиц. Орг. Одобрена',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная организация была проверена и получает вердикт - [Color=#388e3c] Одобрено.[/color][/FONT][/center]<br>" +
        '[Color=#c0c0c0][FONT=arial][CENTER]Предупреждаю вас о том, что вы должны проявлять активность как в игре, так и в данной теме.[/color][/FONT][/center]' +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]Тема открыта.[/color][/FONT][/center]',
      prefix: ODOBRENOORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. на доработке',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=Arial][Color=#c0c0c0]Вам даётся 24 часа на дополнение вашей Неофициальной Организации.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[Color=#ffd700][FONT=arial][CENTER]На рассмотрении...[/color][/FONT][/center]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'Неофиц. Орг. отказ',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная организация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Причиной отказа могло послужить какое-либо нарушение из<br>[/Color][URL='https://forum.blackrussia.online/threads/voronezh-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.4778286/']<br>[Color=#c0c0c0][FONT=arial][CENTER]Правила создания неофициальной RolePlay организации | VORONEZH (click).[/URL][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
        prefix: OTKAZORG_PREFIX,
	  status: false,
            },
    {
      title: 'Грамм/орфогр ошибки',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная Организация получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>В тексте неоднократно были допущены грамматические и/или орфографические ошибки.[/Color][/font][/CENTER]<br>" +
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[CENTER][url=https://postimg.cc/w78FszF0][img]https://i.postimg.cc/4Nn0qNck/2776718330-preview-P84-Rw.png[/img][/url]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
      prefix: OTKAZORG_PREFIX,
	  status: false,
     },
    {
      title: 'Не по форме',
      content:
		'[center][FONT=Arial]{{ greeting }}, уважаемый(-ая) {{{ user.mention }}}![/font][/CENTER]<br>[/color]' +
        '[CENTER][img]https://www.picgifs.com/divider/lines/cats/lines-cats-297835.gif[/img][/CENTER]<br>'+
        "[CENTER][FONT=arial]Ваша Неофициальная Role Play организация была проверена и получает вердикт - [Color=#D32F2F] Отказано.[/color]<br>[Color=#c0c0c0]<br>Ваша Role Play организация составлена не по форме.[/Color][/font][/CENTER]<br>"+
        '[CENTER][img]https://e.radikal.host/2025/10/08/BEZ-NAZVANIY116_20251008135333.png[/img][/CENTER]<br>'+
        '[center][FONT=Arial][Color=#D32F2F]Закрыто.[/color][/FONT][/center]',
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
    addButton('Рассмотрено', 'Watched')
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
    $('button#Watched').click(() => editThreadData(WATCHED_PREFIX, false));
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