// ==UserScript==
// @name Для Руководства || by F Angel || Special for Xayn || Patch 8.3
// @namespace https://forum.blackrussia.online
// @version 0.8.3
// @description kye
// @author Favorite_Angel
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/560228/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20by%20F%20Angel%20%7C%7C%20Special%20for%20Xayn%20%7C%7C%20Patch%2083.user.js
// @updateURL https://update.greasyfork.org/scripts/560228/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20by%20F%20Angel%20%7C%7C%20Special%20for%20Xayn%20%7C%7C%20Patch%2083.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SA_PREFIX = 11;
    const buttons = [
    {
    title: 'СВОЙ ОТВЕТ',
    content:
    '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "Твой текст <br><br>"+
     "[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/FONT][/CENTER][/B][/SIZE]"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    },
    {
        title: 'Жалобы на рассмотрении',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Запрошу доказательства',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'На рассмотрении',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br><br>"+
    '[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
        title: 'Одобробренные / [Закрыто] жалобы',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Доки предоставлены (наказание снято)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.<br>Наказание будет снято.[/CENTER]<br><br>"+
    "[CENTER][COLOR=rgb(76,175,80)]Одобрено.[/COLOR][/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ПРОСТО НАКАЗАНИЕ СНЯТО.',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Наказание будет снято.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание снято и GW',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба была одобрена. Наказание будет снято, GunWarn тоже.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'проинструктирован',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Спасибо за обращение. Администратор будет проинструктирован.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором, ответ будет исправлен (КФ)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба была одобрена.<br>Ответ в жалобе будет исправлен.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Администратор снят',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Администратор снят.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Игрок не является администратором',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Данный игрок не является администратором.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Информация будет проверена.',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Информация будет проверена, в случае подтверждения информации администратор получит соответствующее наказание.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: WATCHED_PREFIX,
    status: false,
    },
    {
    title: 'Наказание адм',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Администратор получит соответсвующее наказание.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не помог с репортом',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]У администратора произошли проблемы, из-за которых он вам не смог помочь. Приносим извинения за предоставленные неудобства. [/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не успел зафиксировать, наруш не выдал',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]К сожалению администратор не успел зафиксировать наказание, поэтому наказание игроку не было выдано. Блата нет.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'СНЯТО, перевыдано',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше наказание было снято / перевыдано чуть позже, когда администратор увидел ошибку.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Если не отпишут',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Создайте повторную заявку, если не отпишут в течении 24 часов, то напишите повторную жалобу.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    },
    {
    title: 'будет исправлены (Заявки)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Скоро будет все исправлено.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'будет рассмотрены (Заявки)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Скоро будет все рассмотрено..[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'скоро будут рассмотрены (жалобы/обж/био/сит)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
        title: 'Отказанные жалобы',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Доки предоставлены, наказание выдано верно',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки предоставлены, наказание выдано по жб на ф',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
'[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех.спец',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9690-norilsk.3984/']«Жалобы на технических Специалистов [COLOR=rgb=(174, 212, 246)]NORILSK[/color]».[/URL][/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В тех раздел',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Обратитесь со своей проблемов в  [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-norilsk.3985/']«Технический раздел [174, 212, 246)]NORILSK[/COLOR]».[/URL][/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Вы ошиблись разделом/сервером',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'жб 3-е лицо',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отсутствуют доки',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Прикрепление ссылки (КФ))',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Недостаточно доказательств «ЖБ»',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'доки обрезанные',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.[/CENTER]<br><br>"+
     '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    status: false,
    },
    {
    title: 'не раб доки',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Не работают доказательства.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Смайлик клоуна, оск в жб',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нарушений со стороны администратора нет.',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Дублирование темы',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'прошло время+в обж',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>Обратитесь в раздел Обжалование наказаний.<br>Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В ОБЖ',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Если хотите как-то снизить свое наказание, то можете написать в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.4006/'][Color=rgb(255,0,0)]«Обжалование наказаний»[/COLOR][/URL], но не факт, что обжалование одобрят.<br> Перед написанием обжалования внимательно ознакомьтесь с правилами подачи заявок на обжалование наказания[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана.',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'бан IP',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Перезагрузите роутер или переключите на другой провайдер, если блокировка IP останется, то напишите повторную жалобу. [/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '48 часов',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]С момента получения наказание прошло 48 часов.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки из соц сети',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /time',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]В доказательствах нету /time.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /myreports',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]В доказательствах нету  /myreports.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по теме',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Гугл)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Ютуб)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'уже есть на рассмотрении',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Подобная жалоба уже закреплена на рассмотрение. Ожидайте ответа там и не создавайте подобных, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Системные наказания',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Наказания полученные системой, администрацией не снимаются.[/CENTER]<br><br>"+
    '[COLOR=rgb(255, 20, 147)]Приятной игры и времяпровождение на сервере [/Color][COLOR=rgb(174, 212, 246)]NORILSK[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'Переданные',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Рук Модер ДС',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Главному Администратору[/color] - @Skay Eagle [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'ЗГА',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Заместителю Главного Администратора[/color] - @Mommy_Legenda [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone, @Liana_Mironova,@Gleb Xovirs, @Candy_Rotmans.[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: COMMAND_PREFIX,
    status: true,
    },
    {
        title: 'ОБЖАЛОВАНИЕ НАКАЗАНИЙ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'На рассмотрении',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование взятo [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
    '[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'В жалобы на адм',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратится в раздел жалоб на администрацию.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено + полностью снято',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br><br>"+
    '[CENTER][COLOR=GREEN]Одобрено[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Вы получили наказание от технического специалиста. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ППВ',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Воспользуйтесь одним из способов восстановления вашего игрового аккаунта, затем создайте повторное обжалование и прикрепите все необходимые доказательства, предварительно закройте конфиденциальную информацию.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено до мин.срока',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет снижено до минимального срока.[/CENTER]<br><br>"+
    '[CENTER][COLOR=GREEN]Одобрено[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Уже снизили',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Вам итак уже снизили наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'У вас мин.нак',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Вам итак выдано минимальное наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отказано',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Данному обжалованию отказано.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не готовы',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Администрация не готова снизить вам наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '3-е лицо',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Обжалование от 3-го лица.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Прикрепите окно бана при входе в игру.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив, ПИВ, Махинации (отказ)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование не будет рассматриваться и будет закрыто так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Скриншот переписки',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Прикрепите скриншот с перепиской.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана+скрин переписки',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Прикрепите окно бана при входе в игру. И скриншот переписки.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Свяжитесь с игроком для возврата средств, затем он должен написать обжалование со скриншотами переписки и окном блокировки аккаунта.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman(вк отписать)',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваша задача отписать мне в вконтакте: <br>[QUOTE]https://vk.com/id556218304 - Лукьян Еремеев.[/QUOTE][/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование составлено не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-на%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=rgb(255,0,0)]«Правила подачи заявки на обжалование наказания».[/color][/URL][/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Рук Модер ДС',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование будет передано [Color=Red]Главному Администратору[/color] - @Skay Eagle [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование будет передано[COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone, @Liana_Mironova, @Candy_Rotmans.[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
     '[COLOR=rgb(255, 20, 147)][SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}<br>[/Color]'+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]'+
         "<br><br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9Q7VFddH/a154899bb5bdafff43df448ecb837b14-(1).gif[/img][/url][/CENTER]",
    prefix: COMMAND_PREFIX,
    status: true,
    },
    ]
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #420; border: 2px solid #a50; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Команде Проекта', 'teamProject', 'background: #004; border: 2px solid #00a; border-radius: 10px');
        addButton('ГА', 'Ga', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Спецу', 'Spec', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Одобрено', 'accepted', 'background: #040; border: 2px solid #0a0; border-radius: 10px');
        addButton('Отказано', 'unaccept', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Теху', 'Texy', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #444; border: 2px solid #aaa; border-radius: 10px');
        addAnswers();
 
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
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
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
 
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 20px; background: #850002; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #fc0509;">ОТВЕТЫ</button>`,
                                       );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 11 ?
            'Доброе утро' :
            12 < hours && hours <= 17 ?
            'Добрый день' :
            18 < hours && hours <= 23 ?
            'Добрый вечер' :
            0 < hours && hours <= 5 ?
            'Доброй ночи' :
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
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
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
})();