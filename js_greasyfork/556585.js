// ==UserScript==
// @name   Скрипт для КФ 76
// @name:ru Script by Alyona❤️
// @description: Script for the curators of the CHITA server
// @description:ru Скрипт для кураторов сервера CHITA
// @autor Alyona_Bogdanova
// @version 1.13.2
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   none
// @supportURL https://vk.com/alyona_b0gdanova | Alyona_Bogdanova | CHITA
// @description Скрипт для кураторов сервера CHITA
// @downloadURL https://update.greasyfork.org/scripts/556585/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2076.user.js
// @updateURL https://update.greasyfork.org/scripts/556585/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2076.meta.js
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🔎ЖАЛОБЫ НА РАССМОТРЕНИИ🔍    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'РАССМОТРЕНИЕ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: PINN_PREFIX,
      status: true,
},
{
      title: 'ПЕРЕДАНО ГКФ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба была передана на рассмотрение [COLOR=rgb(242, 94, 102)]Главному куратору форума.[/color][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: PINN_PREFIX,
      status: true,
},
{
      title: 'ПЕРЕДАНО ТЕХУ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба была передана на рассмотрение [COLOR=rgb(255, 69, 0)]Техническому специалисту.[/color][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: TEXY_PREFIX,
      status: true,
},
{
      title: 'ПЕРЕДАНО ГА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба была передана на рассмотрение [COLOR=rgb(204, 27, 0)]Главному администратору.[/color][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: GA_PREFIX,
      status: true,
},
{
      title: 'ПЕРЕДАНО СА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба была передана на рассмотрение [COLOR=rgb(219, 0, 0)]Специальному администратору.[/color][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: SPECY_PREFIX,
      status: true,
},
{
      title: 'ТАЙМ КОДЫ',
     content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша видеозапись длится более 3-х минут.<br> У Вас есть 24 часа, чтобы прикрепить таймкоды нарушений, в ином случае жалоба будет закрыта.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][FONT=Verdana][SIZE=4][ICODE] На рассмотрении. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: PINN_PREFIX,
      status: true,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ❌ОТКАЗАННЫЕ ЖАЛОБЫ❌ ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'НАКАЗАНИЕ ВЫДАНО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Данный игрок уже получил наказание за подобное нарушение.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/SIZE][/FONT][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: true,
},
{
      title: 'НЕТУ В ЛОГАХ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Данное нарушение не возможно проверить через специальные ресурсы.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'СКЛАД ФАМЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Нарушения со стороны игрока отсутствуют.<br> Игрок заплатил определённую сумму за разрешение опредлённого колличества патронов, которую Вы выдали ему.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'УСЛОВИЯ СДЕЛКИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваши условия сделки составлены некорректно / вовсе отсутствуют.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'БИТАЯ ССЫЛКА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ссылка предоставленная вами, сломана или вовсе, не рабочая. Предоставьте рабочую ссылку.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ЖБ БОЛЕЕ 1 ИГРОКА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша жалоба составлена более чем на одного игрока, подайте жалобу на каждого игрока по отдельности.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'МАТЫ В ЖБ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]В вашей жалобе присутствует ненормативная лексика. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕТ ТАЙМ КОДА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Спустя 24 часа вы не предоставили тайм коды видео. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕ ПО ФОРМЕ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][FONT=Verdana]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>"+
         "[CENTER][B][FONT=Verdana][SPOILER=Форма подачи жалобы]"+
         "[CENTER][B][FONT=Verdana][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>"+
         "[CENTER][B][FONT=Verdana][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name игрока:[/CENTER]<br><br>"+
         "[CENTER][B][FONT=Verdana][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>"+
         "[CENTER][B][FONT=Verdana][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ДУБЛИКАТ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы уже получили ответ в прошлой теме. За подобные дубликаты ваш ФА может быть заблокирован.<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ДУБЛИКАТ НА РАССМОТРЕНИИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша подобная тема взята на рассмотрение. Ожидайте ответа в прошлой теме.<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ПРОШЛО 3 ДНЯ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]С момента возможного нарушения игрока прошло 72 часа. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕУВАЖЕНИЕ В ЖБ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]В вашей жалобе присутствует неуважение к игроку / проверяющей администрации. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'СОЦ СЕТИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Доказательства должны быть загружены на [COLOR=rgb(223, 115, 255)]Yapix[/color] / [COLOR=rgb(0, 255, 0)]Imgur[/color] / [COLOR=rgb(248, 0, 0)]You[/color]Tube.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ВИДЕО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]В данном случае, для выдачи наказания игроку, требуется видеозапись.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ОБРЫВ ВИДЕО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваше видеодоказательство обрывается. Видеохостинг YouTube загружает видео без ограничений, рекомендуем использовать его.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕТ ДОКОВ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]В вашей жалобе отсутствуют какие-либо доказательства. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ОТРЕДАЧЕНО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваши доказательства отредактированы. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕДОСТ ДОКОВ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Недостаточно доказательств для выдачи наказания игроку.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'НЕТ /TIME',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]На Ваших доказательствах отсутствует /time. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ОТКАЗАНО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Нарушений со стороны игрока нет.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ДОЛГ ЧЕРЕЗ ТРЕЙД',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, на ваших доказательствах займ был осуществлен через обмен с игроком. Жалоба отказана.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'СЛИВ ФАМЫ ЗАМОМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Нет ни одного правила, которое регулирует подобные ситуации. Вы сами выдали игроку должность заместителя, советуем внимательнее назначать на данную должность игроков.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ↪ПЕРЕНАПРАВЛЕНИЕ ЖАЛОБ↩    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'ОШИБЛИСЬ РАЗДЕЛОМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы ошиблись разделом. Данный раздел предназначен для написания жалоб на игроков.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ЖБ НА СОТРУДНИКА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Обратитесь в раздел жалоб на сотрудников.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
     title: 'ЖБ НА ЛД',
	  content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров, здесь:<br>[URL= https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3413/]*Нажмите сюда*[/URL][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: 'ЖБ НА АДМ',
	  content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию, здесь:<br>[URL= https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3412/]*Нажмите сюда*[/URL][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: 'В ОБЖ',
	  content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы ошиблись разделом, обратитесь в раздел обжалований наказаний, здесь:<br>[URL= https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3415/]*Нажмите сюда*[/URL][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'ОШИБЛИСЬ СЕРВЕРОМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Вы ошиблись сервером. Данный раздел принадлежит серверу [COLOR=rgb(0, 255, 0)]CHITA[/COLOR].[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ🎮ЖБ НА ИГРОКОВ🎮  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'DM',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'DB',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'SK',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'TK',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'MASS DM',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'БАГОЮЗ АНИМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | 120 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОБХОД СИСТЕМЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP АКС',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP ПОВЕДЕНИЕ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP DRIVE',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ЕПП',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'УХОД ОТ RP',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами. [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn (при повторном нарушении)[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОМЕХА RP',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP ОБМАН',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: Администрация сервера [U]не несет[/U] ответственность за аккаунты игроков, а также содержащиеся на них или утерянные материальные игровые ценности в случае взлома, обмана, невнимательности и так далее.[/QUOTE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'АМОРАЛ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'СЛИВ СКЛАДА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'ОБМАН В /DO',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.10.[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=rgb(255, 0, 0)]|  Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'ТС В ЛИЧНЫХ ЦЕЛЯХ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОМЕХА БЛОГЕРУ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [COLOR=rgb(255, 0, 0)]| Ban 7 дней [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ЧИТЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'СОКРЫТИЕ БАГОВ ОТ АДМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОКРЫВАТЕЛЬСТВО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ВРЕД ПРОЕКТУ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОКУПКА/ПРОДАЖА ИВ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОРЧА ЭКО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.30.[/color] Запрещено пытаться нанести ущерб экономике сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'УЯЗВИМ ПРАВИЛАМИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.33.[/color] Запрещено пользоваться уязвимостью правил [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ЗЛОУПОТРЕБЛЕНИЕ НАРУШЕНИЯМИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.39.[/color] Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПРОДАЖА ИМУЩ ЗА РЕАЛ ДЕНЬГИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.42.[/color] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПЕРЕДАЧА АККАУНТА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.03.[/color] Передача своего личного игрового аккаунта третьим лицам [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ВЫДАЧА ЗА АДМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 + ЧС администрации[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОБМАН АДМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ВВОД В ЗАБЛ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🗣ИГРОВЫЕ ЧАТЫ🗣 ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'ОСК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'MG',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'CAPSLOCK',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'FLOOD',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ЗЛОУПОМ СИМВОЛАМИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ТРАНСЛИТ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/color] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОСК АДМ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОСК/ПРИЗЫВ ПОКИНУТЬ BR',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ООС УГРОЗЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПОЛИТ/РЕЛИГ ПРОПАГАНДА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РАЗНОГЛАСИЯ О НАЦ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности / религии совершенно в любом формате [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'СЛИВ ЛИЧ ИНФЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РАСПРОСТРАНЕНИЕ АДМ ИНФЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.27.[/color] Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'УПОМ РОД',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОСК РОД',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено оскорбление родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РЕКЛАМА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'СЛИВ ЧАТА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ШУМ VOICE',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.16.[/color] Запрещено создавать посторонние шумы или звуки в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'МУЗЫКА VOICE ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПРОМО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РЕКЛАМА В ГОСС',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'МАТ VIP',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ 🤯АККАУНТЫ🤯  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'ФЕЙК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'МУЛЬТИАК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ОСК НИК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'nRP Nick',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.07.[/color] В игровом никнейме запрещено использовать более двух заглавных букв [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ 👮🏻ЖБ НА ГОСС👮🏻‍♂ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',

},
{
      title: 'ДМ БЕЗ ПРИЧИНЫ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]1.11.[/color] Всем силовым структурам запрещено наносить урон без IC причины на территории своей организации [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ГОСС БУ/КАЗИНО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'АРЕСТ НА ТТ ОПГ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]1.16.[/color] Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP АДВОКАТ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]3.01.[/color]  Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP ФСИН',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]9.01.[/color] Запрещено освобождать заключённых, нарушая игровую логику организации [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]9.02.[/color] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ЗАМЕНА ОБЬЯВ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ШТРАФ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]7.02.[/color] Запрещено выдавать штраф без IC причины [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РОЗЫСК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]6.02.[/color] Запрещено выдавать розыск без IC причины [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПРАВА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ☠️ЖБ НА ОПГ☠️   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'ПРОВОКАЦИЯ ГОСС',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]2.[/color] Запрещено провоцировать сотрудников государственных организаций [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ДУЭЛИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'ПЕРЕСТРЕЛКИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'УХОД ОТ ПОГОНИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того, чтобы скрыться или получить численное преимущество [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'РЕКЛАМА ЧАТ ОПГ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][COLOR=rgb(255, 0, 0)]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'NRP ВЧ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Игрок [COLOR=rgb(255, 0, 0)]будет наказан[/color] по пункту правил:[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/FONT][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][FONT=Verdana][SIZE=4][ICODE] Одобрено // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🧛‍♂ROLEPLAY БИОГРАФИИ 🧛‍♀   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'ОДОБРЕНО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Lime][ICODE] Одобрено. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br>"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
},
{
      title: 'НЕ ПО ФОРМЕ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: RolePlay Биография составлена не по форме.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ЗАГОЛОВОК',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Заголовок вашей RolePlay Биографии составлен не по форме.[/QUOTE][/CENTER][/FONT]"+
        "[CENTER][QUOTE][Color=Red]Примечание[/color]: Пример заголовка[/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Биография | Alyona_Bogdanova [/QUOTE][/CENTER]<br><br>"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ДОРАБОТКА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Yellow][ICODE] На рассмотрении. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Примечание[/color]: У вас есть 24 часа, чтобы доработать вашу RolePlay биографию.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: false,
},
{
      title: '24 ЧАСА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Спустя 24 часа, вы не доработали свою RolePlay биографию.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'GPT',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Yellow][ICODE] На рассмотрении. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Примечание[/color]: У вас есть 24 часа, чтобы убрать следы искусственного интеллекта из вашей RolePlay биографии.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: true,
},
{
      title: 'ОТКАЗ GPT',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Спустя 24 часа, вы не убрали следы искусственного интеллекта из вашей RolePlay биографии.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'МАЛО ИНФОРМАЦИИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Информация о вашем персонаже расписана меньше чем на 200 слов.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'МНОГО ИНФОРМАЦИИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Информация о вашем персонаже расписана больше чем на 600 слов.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ФАЛЬШ ИНФА',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Ваша RolePlay биография содержит в себе информацию, которой не может быть в реальной жизни.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ЧУЖАЯ БИО',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Ваша RolePlay биография частично / полностью была скопирована у другого игрока.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'НЕТ ЛОГИКИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: В вашей RolePlay биографии присутствуют логические противоречия.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ОШИБКИ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: В вашей RolePlay биографии присутствуют орфографические ошибки.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'ЮНОСТЬ 14',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: В RolePlay биографии юность у персонажа должна начинаться с 14-ти лет.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
      title: 'НИКИ НЕ СОВПАДАЮТ',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay биография получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: В вашей RolePlay биографии не совпадает Nick_Name указанный в заголовке и в самой биографии.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🧾 РП ситуации 🧾   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'РП ситуация одобрена',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay ситуация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Lime][ICODE] Одобрено. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br>"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
},
{
      title: 'РП ситуация на доработке',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay ситуация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Yellow][ICODE] На рассмотрении. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Примечание[/color]: У вас есть 24 часа, чтобы дополнить вашу RolePlay ситуацию.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: NARASSMOTRENIIRP_PREFIX,
      status: false,
},
{
      title: 'РП ситуация отказана',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша RolePlay ситуация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Нарушение каких-либо правил подачи RolePlay ситуаций.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
},
{
      title: 'Ошиблись разделом',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания RolePlay ситуаций.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: CLOSE_PREFIX,
      status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ💶 Неофициальные организации 💶   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
      title: 'Одобрено',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Lime][ICODE] Одобрено. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br>"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
},
{
      title: 'На доработке',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Yellow][ICODE] На рассмотрении. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Примечание[/color]: У вас есть 24 часа, чтобы доработать вашу Неофициальную RolePlay организациую.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
},
{
      title: 'Отказано',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Отказано. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Нарушение каких-либо правил подачи Неофициальных RolePlay организаций.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
},
{
      title: 'Запросы активности',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация [COLOR=rgb(255, 0, 0)]может быть закрыта[/color]. [/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana][QUOTE][Color=Red]Примечание:[/color] Неактив в топике организации более недели, он закрывается.[/QUOTE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana]Прекрепите отчёт о активности организации в виде скриншотов.[/FONT][/B][/CENTER]<br>"+
        "[CENTER][B][FONT=Verdana]Если через 24 часа не будет отчёта или он будет некорректный, ваша организация будет закрыта.[/FONT][/B][/CENTER]<br>"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: PINN_PREFIX,
      status: false,
},
{
      title: 'Закрытие активности',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Закрыто. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Активность вашей Неофициальной RolePlay организации не была предоставлена.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
              prefix: CLOSE_PREFIX,
      status: false,
},
{
      title: 'Закрытие организации',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]Ваша Неофициальная RolePlay организация получает статус:[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=Verdana][SIZE=5][Color=Red][ICODE] Закрыто. [/ICODE][/color][/SIZE][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][QUOTE][Color=Red]Причина[/color]: Неофициальная RolePlay организация была закрыта по вашему собственному желанию.[/QUOTE][/CENTER][/FONT]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
              prefix: CLOSE_PREFIX,
      status: false,
},
{
      title: 'Ошиблись разделом',
      content:
        '[Color=rgb(37, 255, 255)][FONT=Verdana][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>'+
        "[CENTER][B][FONT=Verdana]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания Неофициальных RolePlay организаций.[/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][COLOR=rgb(248, 0, 0)][FONT=Verdana][SIZE=4][ICODE] Отказано // Закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]"+
        "[RIGHT][COLOR=rgb(255, 43, 43)][SIZE=2][FONT=Tahoma][ICODE]Киса💕[/ICODE][/FONT][/SIZE][/COLOR][/RIGHT]",
      prefix: CLOSE_PREFIX,
      status: false,
},
{
},];
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('❤️‍🔥 Script for Alyona ❤️‍🔥', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #BF40BF;">${name}</button>`,
    );
  }

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
                              sticky: 1,
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
