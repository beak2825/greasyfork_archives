// ==UserScript==
// @name Ангельский скрипт | by Favorite Angel and Angell Tesak ☠
// @namespace https://forum.blackrussia.online
// @version 1.2.3
// @description kye
// @author Favorite_Angel
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/556123/%D0%90%D0%BD%D0%B3%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20by%20Favorite%20Angel%20and%20Angell%20Tesak%20%E2%98%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/556123/%D0%90%D0%BD%D0%B3%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20by%20Favorite%20Angel%20and%20Angell%20Tesak%20%E2%98%A0.meta.js
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
const TEXU_PREFIX = 13;
const buttons = [

    {
title: '☠ СВОЙ ОТВЕТ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] твой текст [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
{
title: '☠ На рассмотрение ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба взята на Рассмотрение. Просьба не создавать подобных тем, иначе ваш Форумный аккаунт может быть [U]заблокирован.[/U][/CENTER]<br><br>"+
'[CENTER][Color=rgb(0, 0, 0)]Ожидайте ответа от Администрации...[/CENTER][/B][/SIZE]'+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: PIN_PREFIX,
status: true,
},
{
title: '☠ Теху ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба передана Техническому специалисту. Просьба не создавать подобных тем, иначе ваш форумный аккаунт будет заблокирован. [/CENTER]<br><br>"+
    '[CENTER][Color=rgb(0, 0, 0)]Ожидайте ответа от тех. специалиста @Korn_Excess [/CENTER][/B][/SIZE]'+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: TEXU_PREFIX,
status: true,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 ЖАЛОБЫ НА ИГРОКОВ 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '|-(--(--(->------- Причины ОТКАЗОВ -------<-)--)--)-|'
},
{
title: '♡ доква из соц сетей ♡',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ жб заголовок с доква разные ♡',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Рассмотрев ваши доказательства было замечено что ваш заголовок с жалобой отличаются с нарушениеми на доказательствах.[/CENTER]<br><br>"+
"[Color=rgb(0, 0, 0)]Просьба написать новую жалобу с соответсвием нарушениями.<br><br>"+
    "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT]<br><br>"+
   "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ Отредакт доква ♡',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Рассмотрев ваши доказательства было замечено что доказетельства были отредактированы.[/CENTER]<br><br>"+
"[Color=rgb(0, 0, 0)]Примечание: Доказательства должны быть в первоначальном виде.<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Нет условий ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] На предоставленных вами доказательствах, нет условий сделки с игроком. При взаимодействиях с другими игроками, вы должны обязательно указать условия сделки. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
    "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ нет тайма ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] На предоставленных вами доказательствах отсутсвтует /time. При подачи жалобы на игрока, в доказательствах обязательно должен быть /time. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Заголовок ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Заголовок вашей Жалобы составлен НЕ по Форме. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(0,0,0)]«Правилами подачи Жалоб на Игроков».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ЖБ не по форме ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба составлена не по форме. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(0,0,0)]«Правилами подачи Жалоб на Игроков».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ 3-е лицо ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как она составлена от третьего лица. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ 3 дня ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как с момента нарушения от игрока прошло 72 часа [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ тайм-коды ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как на видео-доказательствах отсутсвуют тайм-коды.  [/CENTER]<br><br>"+
    "[CENTER][U][SPOILER=][/U][COLOR=rgb(0, 0, 0)]Тайм-Код — это время начала определённого эпизода видеоролика. С помощью Тайм-Кода зритель сможет быстро найти нужный момент видео или перемотать к искомой части ролика.[/COLOR][/SPOILER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ разные ники ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как ники в предоставленных доказательсвах не сходятся с заголовком/формой подачи жалобы. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ 2 игрока ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как запрещено писать жалобу на 2-ух и более игроков. [/CENTER]<br><br>"+
    "[center] Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(0,0,0)]«Правилами подачи Жалоб на Игроков».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Отредактированные док-ва ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства на нарушение игрока отредактированны. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ сотрудники орг ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный раздел не модерирует подобного рода жалобы, обратитесь в раздел жалоб на сотрудников нужной вам организации. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ЖБ на Адм ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный раздел не модерирует подобного рода жалобы, обратитесь в раздел  [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.433/'][COLOR=rgb(0,0,0)]«Жалобы на Администрацию».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ЖБ на ЛД ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный раздел не модерирует подобного рода жалобы, обратитесь в раздел  [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.434/'][COLOR=rgb(0,0,0)]«Жалобы на Лидеров».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ В Обжалование ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный раздел не занимается обжалованиями наказаний, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/'][COLOR=rgb(0,0,0)]«Обжалования наказаний».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Другой сервак ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Вы ошиблись сервером, переношу вашу жалобу на ваш сервер. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I][/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
{
title: '☠ игрок не нарушил ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] просмотрев ваши доказательства, я не увидел нарушений со стороны игрока. Если у вас есть дополнительные доказательства, создайте новую жалобу и прикрепите их. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ нет доков ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Вашей жалобе отказано, так как в ней отсутсвуют доказательства. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ нужен фрапс ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] При подобных нарушениях со стороны игроков нужно иметь видео-доказательства, так как скриншотов не достаточно чтобы мы могли объективно оценить ситуацию. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ дублирование тем ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] ДАнная жалоба является копией вашей преведущей жалобы. Если вы продолжите дублировать темы, ваш форумный аккаунт будет заблокирован. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ другой хост ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства не из надежных источников. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ слив фам склада  ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотернию , так как при подобных нарушениях нужен фрапс, на котором будет четко видно, что именно вы лидер семьи, максимально разрешенное кол-во патронов, которое можно брать со склада, логи семьи и /time. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ нет истории операций ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Не достаточно доказательств на нарушение со стороны игрока. Создайте еще одну жалобу, где в добавок к этим доказательствам, вы покажите историю операций в банке. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ долг не в банке ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как давать игровую валюту в долг можно исключительно через бансковские счета. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ не полный/обравается ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не полны либо обрываются. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ док-ва не работают ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не работают. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ недостаточно докв ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательств на нарушение со стороны игрока не достаточно. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ПО на док-вах ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Во время проверки ваших доказательств, я обнаружил что вы используете сторонние программмы/не оригинальные файлы игры(Сборка/Постороннее ПО). [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Не по теме ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша тема некоим образом не относится к назначению данного раздела. при повторном нарушении ваш форумный аккаунт может быть заблокирован. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I][/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск в жалобе ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как в ней присутствуют оскорбительные фразы/смайлики. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '☠ плохое качество ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства имеют плохое качество. Воспользуйтесь другим хостингом. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 Правила RolePlay процесса 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '☠ nrp поведение ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.01.Запрещено [Color=rgb(0, 0, 0)] поведение, нарушающее нормы процессов Role Play режима игры [/Color] [COLOR=rgb(0, 0, 0)]  [COLOR=rgb(0, 0, 0)][/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
   {
title: '☠ долг ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.57.Запрещается [Color=rgb(0, 0, 0)] брать в долг игровые ценности и не возвращать их. [/Color] [COLOR=rgb(0, 0, 0)]  [COLOR=rgb(0, 0, 0)][/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)]  | Ban 30 дней / permban [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ помеха рп процесу ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.04.Запрещены [Color=rgb(0, 0, 0)]  любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [/Color] [COLOR=rgb(0, 0, 0)]  [COLOR=rgb(0, 0, 0)][/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ уход от рп ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.02.Запрещено [Color=rgb(0, 0, 0)] целенаправленно уходить от Role Play процесса всеразличными способами [/Color] [COLOR=rgb(0, 0, 0)]  [COLOR=rgb(0, 0, 0)][/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут / Warn [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ nrp drive ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.03.Запрещен [Color=rgb(0, 0, 0)] NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере  [/Color] [COLOR=rgb(0, 0, 0)]  [COLOR=rgb(0, 0, 0)][/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |Jail 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ nrp обман ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ afk no esc ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.07.Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | kick с сервера [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ уморал действ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.08.Запрещена любая форма аморальных действий сексуального характера в сторону игроков [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут / Warn [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ слив склада ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.09.Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |  Ban 15 - 30 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ обман в /do ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.10.Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут / Warn [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ в лич целях фракц тс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях  [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ помеха блохерам ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.12.Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 дней [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ дб ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.13.Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 60 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ тк ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.15.Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 60 минут / Warn (за два и более убийства) [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ск ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |  Jail 60 минут / Warn (за два и более убийства) [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ мг ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ дм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.19.Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 60 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ сбив аним/темпа ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.55.Запрещается багоюз связанный с анимацией в любых проявлениях. [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 60 / 120 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ мдм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.20.Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Warn / Ban 3 - 7 дней [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ обход систим☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов) [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ читы ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.22.Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 15 - 30 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ сокрытие багов от адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.23.Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам[/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |  Ban 15 - 30 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ сокрытие нарушителей от адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |Ban 15 - 30 дней / PermBan + ЧС проекта [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ вред реп проекта ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.25.Запрещены попытки или действия, которые могут навредить репутации проекта[/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan + ЧС проекта [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ вред ресурсам проекта ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.26.Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan + ЧС проекта [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ слив лич инфы адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.27.Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan + ЧС проекта [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ППВ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.228.Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan с обнулением аккаунта + ЧС проекта. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ущерб экономики ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.30.Запрещено пытаться нанести ущерб экономике сервера [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 15 - 30 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ реклама сетей ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ обман адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.32.Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 - 15 дней [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ уязвимость правил ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.33. Запрещено пользоваться уязвимостью правил [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 15 - 30 дней / PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ic ooc конфликсты нации,религии ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.35.На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 120 минут / Ban 7 дней [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ оос угрозы ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.37.Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 120 минут / Ban 7 - 15 дней. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ OOC угрозы ☠',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято Решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(255, 0, 0)]2.37.[/Color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны Администрации [COLOR=rgb(255, 0, 0)]|  Mute 120 минут / Ban 7 - 15 дней[/Color]<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено, Закрыто.[/color]<br>"+
'[CENTER]Приятной игры и Времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ слив лич инфу игроков,родств ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.38.Запрещено распространять личную информацию игроков и их родственников [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] |  Ban 15 - 30 дней / PermBan + ЧС проекта [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ злоуп правила ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.39.Злоупотребление нарушениями правил сервер [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 - 15 дней [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ попытка/продажа акка ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.42.Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нрп сон ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.44.На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | Kick [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | kick с сервера [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ епп  ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.46.Запрещено ездить по полям на любом транспорте [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ епп фура ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.47.Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 60 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ продажа,трансфер реп семьи,сокрытие софтов семьи ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.48. Запрещена продажа, передача, трансфер или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ арест в интерьере ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 - 15 дней + увольнение из организации [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нрп акс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ маты,оски игровые цености ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER]2.53.Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪  ИГРОВЫЕ ЧАТЫ  𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '☠ КАПС ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск в оос ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск упом род ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 120 минут / Ban 7 - 15 дней. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ флуд ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ злоуп символами ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.06. Запрещено злоупотребление знаков препинания и прочих символов [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ слив ГЧ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | PermBan. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 180 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск проекта ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором). [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ мат в VIP ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ выдача за адм ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.10. Запрещена выдача себя за администратора, если таковым не являетесь [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 - 15 дней. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ввод в забл(команды). ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 15 - 30 дней / PermBan. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нарушения в реп ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Report Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ музыка в войс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.14. Запрещено включать музыку в Voice Chat [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 60 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ шум в войс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.16. Запрещено создавать посторонние шумы или звуки [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ полит/призыв к флуду ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 120 минут / Ban 10 дней. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ войс мод ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.19. Запрещено использование любого софта для изменения голоса [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 60 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ транслит ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.20. Запрещено использование транслита в любом из чатов [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ реклама промо ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 30 дней. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ торг в инт госс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ник (мат). ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Устное замечание + смена игрового никнейма / PermBan. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ ник (фейк). ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Устное замечание + смена игрового никнейма / PermBan. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 ГОССНИКИ 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '☠ работа в форме госс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ каз/бу в форме госс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Jail 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нРП эдит ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 4.01. Запрещено редактирование объявлений, не соответствующих ПРО [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нРП эфир ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Mute 30 минут. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ Редакт в ЛЦ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроко [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Ban 7 дней + ЧС организации. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ розыск без рп ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 6.02. Запрещено выдавать розыск без Role Play причины [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '☠ нрп поведение госс ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 6.03. Запрещено nRP поведение [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ нрп штраф ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 7.02. Запрещено выдавать розыск, штраф без Role Play причины [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ права в погоне ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 7.04. Запрещено отбирать водительские права во время погони за нарушителем [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | Warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 ОПГШНИКИ 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '♡ нрп вч ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан за нарушение правил нападения на воинскую часть [COLOR=rgb(255, 255, 255)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ). [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ похищение в зз ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 1.01. Запрещено проводить похищения / ограбления в зеленых зонах или многолюдных местах. [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ мало похитителей ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Рассмотрев вашу Жалобу, было принято решение, что Нарушитель будет наказан по Данному пункту Правил: [COLOR=rgb(0, 0, 0)] [CENTER] 1.03. Количество грабителей / похитителей должно быть в два раза больше, чем жертв [/CENTER] Игрок получит наказание в виде [/color] [COLOR=rgb(255, 255, 255)] | warn. [/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 ROLEPLAY Биографии 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '♡ одобрено ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay Биографию, было принято решение, что она одобрена.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ шаблон ошибок ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay Биографию, Я нашел несколько ошибок, а именно[/color]<br><br>"+
    "[CENTER][color=rgb(0, 0, 0)]1.[/color]<br><br>"+
     "[CENTER][color=rgb(0, 0, 0)]2.[/color]<br><br>"+
     "[CENTER][color=rgb(0, 0, 0)]3.[/color]<br><br>"+
     "[CENTER][color=rgb(0, 0, 0)]Вам дается 24 часа на исправление этих ошибок.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]На рассмотении.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
    prefix: PIN_PREFIX,
status: true,
},
{
title: '♡ 3 лицо ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay Биографию, было принято решение, что она составлена от 3-его лица, что запрещено правилами.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ вторая био ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]На вашем форумном аккаунте уже есть одобренная RolePlay биография, соответсвенно эту Я вам одобрить не могу.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '♡ мало инфы ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay Биографию, было принято решение, что в ней мало информации.[/color]<br><br>"+
        "[CENTER][COLOR=rgb(0, 0, 0)]Что-же такое RolePlay Биография?[/COLOR] Прежде чем дать ответ на данный вопрос, давайте обратимся к определению:<br>"+
"[CENTER]Биография - это описание жизни человека, сделанное другими людьми или им самим (АвтоБиография). <br><br>"+
"[CENTER]А теперь давайте ответим на вопрос, что-же такое RolePlay Биография.<br>"+
"[CENTER][COLOR=rgb(255, 255, 255)]RolePlay Биография[/COLOR] - это автобиография персонажа, которую составляет игрок, который им управляет. Важно запомнить, что недопустимо в RP-Биографии выбирать себе роль мульт-героев, наделять своего персонажа сверхъестественными способностями. Основная задача при создании RP - Сама RolePlay биография и её содержание и замысел зависит только от Вас, и от того, какую роль Вы играете на сервере, но увы, вы этим не воспользовались.<br>"+
"[CENTER][U][COLOR=rgb(0, 0, 0)]Рекомендую[/COLOR][/U] задуматься над созданием новой историей вашего игрового персонажа.<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ копипаст ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Ваша RolePlay биография скопирована/украдена.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ на рассмотрении ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]На вашем форумном аккаунте уже есть RolePlay биография, которая находится на рассмотрении.[/color]<br><br>"+
    "[CENTER][color=rgb(0, 0, 0)]Ожидайте ответа в той теме, которая находится на рассмотернии.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ не по форме ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Ваша RolePlay биография не подлежит рассмотрению, так как она составлена не по форме. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/threads/Правила-создания-roleplay-биографии.8598625/'][COLOR=rgb(0,0,0)]«Правилами подачи RolePlay биографий».[/color][/URL][/CENTER]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ возраст ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Ваша RolePlay биография не подлежит рассмотреню, так как персонаж в ней не достиг возраста 18 лет.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♡ ошибки(не исправил). ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Вашей RolePlay биографии отказано, так как Вы не исправили ошибки.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 ROLEPLAY Ситуации 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '♡ одобрено ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay ситуацию, ставлю ей префикс одобрено.[/color]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♡ не по форме ♡',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER][color=rgb(0, 0, 0)]Рассмотрев вашу RolePlay ситуацию, ставлю ей префикс отказано. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/threads/Общие-правила-roleplay-ситуаций.8598612/'][COLOR=rgb(0,0,0)]«Правилами подачи RolePlay ситуаций».[/color][/URL][/CENTER]<br><br>"+
"[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
"[CENTER] [Color=rgb(0, 0, 0)][I]Одобрено.[/I][/CENTER]"+
"[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
]


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы


addButton('♤ На Рассмотрение ♤', 'pin');
addButton('♤ Одобрено ♤', 'accepted');
addButton('♤ Отказано ♤', 'unaccept');
addButton('♤ Закрыто ♤', 'Zakrito');
addButton('♤ Ответы ♤', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
} else {
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
12 < hours && hours <= 18
? 'Доброго времени Суток'
: 18 < hours && hours <= 21
? 'Доброго времени Суток'
: 21 < hours && hours <= 4
? 'Доброго времени Суток'
: 'Доброго времени Суток',
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