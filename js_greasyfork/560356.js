// ==UserScript==
// @name Государственные организации | by Danya Chips
// @namespace https://forum.blackrussia.online
// @version 2.3
// @description Скрипт для руководства государственных организаций сервера CHERRY.
// @author Danya_Chips
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://i.postimg.cc/vTmPZd9J/traill-county-highway-department-management-company-business-service-png-favpng-Ajve65fk-Y3-UGWs-F1f6-AJ.png
// @downloadURL https://update.greasyfork.org/scripts/560356/%D0%93%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%20%7C%20by%20Danya%20Chips.user.js
// @updateURL https://update.greasyfork.org/scripts/560356/%D0%93%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%20%7C%20by%20Danya%20Chips.meta.js
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
title: '⚙️СВОЙ ОТВЕТ',
content:
""+
"[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }} Доброго времени суток, уважаемый {{ user.mention }}![/B][/CENTER][/FONT][/SIZE]\n\n" +
"[CENTER] твой текст [/CENTER]<br><br>"+
     ""+
     "",
},
{
  title: '👀Жалоба на рассмотрение',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба взята [COLOR=rgb(255, 191, 0)][B] на рассмотрение[/COLOR], ожидайте ответа от руководства государственных организаций.[/CENTER]\n" +
"[CENTER]Просим вас воздержаться от создания подобных тем, иначе ваш форумный аккаунт может быть [COLOR=rgb(221, 0, 0)][B]заблокирован[/COLOR].[/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f5a819/20/1/4nq7brby4nopbrgow8ekdwrh4nxpbesowdejmwr74ncpbgy.png[/img][/url]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: '🔸Нарушений нет',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Проверив ваши доказательства, выношу вердикт:[/CENTER]\n" +
"[CENTER][B]Со стороны лидера нарушений нет.[/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ✅ Причины одобрения ✅ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
title: '✅Проведем беседу',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Рассмотрев ваши доказательства, одобряю вашу жалобу.[/CENTER]"+
"[B]С лидером будет проведена беседа.[/B]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
  prefix: PIN_PREFIX,
  status: true,
},
{
title: '✅Проведем необходимую работу',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Рассмотрев ваши доказательства, одобряю вашу жалобу.[/CENTER]"+
"[B]С лидером будет проведена необходимая работа.[/B]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
  prefix: PIN_PREFIX,
  status: true,
},
{
title: '✅Выдадим наказание',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Рассмотрев ваши доказательства, одобряю вашу жалобу.[/CENTER]"+
"[B]Лидер будет привлечен к ответственности и получит наказание.[/B]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
  prefix: PIN_PREFIX,
  status: true,
},
{
title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ❌ Причины отказа ❌ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
title: '❌Доказательства отредактированы',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
        "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Рассмотрев ваши доказательства было замечено что доказетельства были отредактированы.[/CENTER]"+
"[B]Примечание:[/B] Доказательства должны быть в первоначальном виде."+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Отсутствует /time',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
        "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] На предоставленных вами доказательствах отсутсвтует /time. При подачи жалобы, в доказательствах обязательно должен быть /time. [/CENTER]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Жалоба не по форме',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
        "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Ваша жалоба составлена не по форме. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(0,0,0)]«Правилами подачи Жалоб на Игроков».[/color][/URL][/CENTER]<br><br>"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Прошло 3 дня с нарушения',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как с момента нарушения от лидера прошло 72 часа [/CENTER]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '❌От 3-го лица',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как она составлена от третьего лица. [/CENTER]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Фотошоп доказательств',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства на нарушение лидера отредактированны. [/CENTER]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Не является лидером',
content:
 ""+
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n"+
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n"+
"[CENTER]Данный игрок не является лидером государственных организаций.[/CENTER]"+
    "[CENTER] [/CENTER]\n"+
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Перенести в обжалование',
content:
 ""+
'[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!'+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER] Данный раздел не занимается обжалованиями наказаний, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/'][COLOR=rgb(0,0,0)]«Обжалования наказаний».[/color][/URL][/CENTER]<br><br>"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
  title: '❌Ошиблись сервером',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Вы ошиблись сервером.[/CENTER]\n" +
"[CENTER][B]Переношу вашу жалобу на ваш сервер.[/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
  title: '❌Нет доказательств',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Проверив вашу жалобу выношу вердикт[/CENTER]\n" +
"[CENTER][B]В вашей жалобе отсутствуют доказательства.[/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
  title: '❌Копия темы',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Данная тема является копией другой вашей темы.[/CENTER]\n" +
"[CENTER]Просим вас воздержаться от создания подобных тем, иначе ваш форумный аккаунт может быть [COLOR=rgb(221, 0, 0)][B]заблокирован[/COLOR].[/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
  title: '❌Ненадежные доказательства',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как доказательства не из надежных источников.[/CENTER]\n" +
"[CENTER][B]Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд." +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Доказательства не полные',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не полны или обрываются.[/CENTER]\n" +
"[CENTER][B]Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд." +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Доказательства не работают',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не работают.[/CENTER]\n" +
"[CENTER][B]Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд." +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Недостаточно доказательств',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как доказательств на нарушение со стороны лидера[B] не достаточно.[/B][/CENTER]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Не по теме',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не относится к данному разделу.[/B][/CENTER]\n" +
"[CENTER][B]Обратитесь в раздел, соответствующий теме вашей жалобы.[/B]" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '❌Оскорбления в жалобе',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как в ней присутствуют [B]оскорбительные[/B] фразы/смайлики.[/CENTER]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '❌Плохое качество',
  content:
"[SIZE=4][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/B][/CENTER][/SIZE]\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER]Ваша жалоба не подлежит рассмотрению, так как доказательства имеют плохое качество.[/CENTER]\n" +
"[CENTER][B]Воспользуйтесь другим хостингом.[/B]" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ 📝 Заявки на лидера 📝 ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
 {
title: '👀На рассмотрении',
  content:
"[CENTER]Доброго времени суток![/CENTER]\n" +
"[CENTER]Все поданные заявки взяты [B]на рассмотрение.[/B]" +
"[CENTER] [/CENTER]\n",
},
{
title: '🔸Проверка заявок на лидера',
content:
"[SIZE=7][CENTER][COLOR=rgb(255,255,255)]🍂 Доброго времени суток, уважаемые кандидаты! 🍂[/COLOR][/CENTER][/SIZE]\n\n" +
"[CENTER][SIZE=3]На пост лидера мы ищем человека, готового уделять большое количество времени как своей организации, так и своим сотрудникам. Лидерство требует полной самоотдачи и чёткого понимания ответственности. Если вы сомневаетесь в своих силах — рекомендуем дополнительно оценить свои возможности и убедиться, что вы действительно готовы стать лидером.[/SIZE][/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=5]После проверки ваших заявлений были выявлены следующие итоги:[/SIZE][/CENTER]\n\n" +
"[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=4][COLOR=rgb(255,255,255)]Кандидаты [B][COLOR=rgb(34,177,76)]допущенные[/COLOR][/B][COLOR=rgb(255,255,255)] к обзвону:[/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=4][COLOR=rgb(255,255,255)]Кандидаты [B][COLOR=rgb(237,28,36)]не допущенные[/COLOR][/B][COLOR=rgb(255,255,255)] к обзвону:[/COLOR][/SIZE][/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=4][COLOR=rgb(255,255,255)]Обзвон пройдёт на официальном Discord-сервере[COLOR=rgb(145, 30, 66)][B] CHERRY 🍒[/B][/COLOR][/SIZE][/CENTER]\n\n" +
"[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=4]Все одобренные кандидаты будут добавлены в закрытую беседу, где получат всю необходимую информацию.[/SIZE][/FONT][/CENTER]\n\n" +
"[CENTER][SIZE=4]Там будет указана точная дата и время проведения обзвона, а также размещены дополнительные инструкции, которые помогут лучше подготовиться.[/SIZE][/CENTER]\n\n" +
    "[CENTER] [/CENTER]\n" +
"[CENTER][url=https://postimages.org/][img]https://lh4.googleusercontent.com/T09X7vGR7SVftknVZIboJlX4evuv0_s1VG4zaND9-lVzYlKlq4zt9nKm1aORMh_ZByGdyUo3D_AYJkxVPGThVj4nDofZhteNvJwR6lnQ0qupAUHSJw3mPeV74QrPaN2kvBBFS17O[/img][/url]"+
    "[CENTER] [/CENTER]\n" +
"[CENTER][SIZE=4]Просим внимательно следить за сообщениями в этой беседе, чтобы ничего не пропустить.[/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][B][COLOR=rgb(255,255,255)]Одобренным кандидатам необходимо установить префикс [К/Л/Фракция][/COLOR][/B][/SIZE][/CENTER]\n\n" +
"[CENTER][SIZE=4][COLOR=rgb(255,255,255)]Опоздание на обзвон или отсутствие префикса недопустимо![/COLOR][/SIZE][/CENTER]",
},
]


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы


addButton('На Рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'Zakrito');
addButton('Ответы', 'selectAnswer');

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
? 'Доброго времени суток'
: 18 < hours && hours <= 21
? 'Доброго времени суток'
: 21 < hours && hours <= 4
? 'Доброго времени суток'
: 'Доброго времени суток',
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