// ==UserScript==

// @name         Кураторы форума by V. Moller

// @namespace    https://forum.blackrussia.online/

// @version      1.3.5.3

// @description  Скрипт для Кураторов форума на ответы на жалобы игроков

// @author       Vika_Moller

// @match        https://forum.blackrussia.online/threads/*

// @include      https://forum.blackrussia.online/threads/

// @grant        none

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/553881/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20V%20Moller.user.js
// @updateURL https://update.greasyfork.org/scripts/553881/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20V%20Moller.meta.js
// ==/UserScript==


(function () {

 'use strict';

 const UNACCEPT_PREFIX = 4; // префикс отказано

 const ACCEPT_PREFIX = 8; // префикс одобрено

 const PIN_PREFIX = 2; //  префикс закрепить

 const COMMAND_PREFIX = 10; // команде проекта

 const CLOSE_PREFIX = 7; // префикс закрыто

 const DECIDED_PREFIX = 6; // префикс решено

 const WATCHED_PREFIX = 9; // рассмотрено

 const TEX_PREFIX = 13; //  техническому специалисту

 const NO_PREFIX = 0;

 const buttons = [

{

        title: ' ᅠᅠ....................... Обычные темы регламента ...................... ',

        dpstyle: 'oswald: 12px;     color: #00ff00; background: #009999; border: 10px solid; border-color: rgb(0, 153, 153); box-shadow: 0 0 8px 0 rgba(0,0,0,0.14),0 8px 8px 0 rgba(0,0,0,0.12),0 8px 8px 0 rgba(0,0,0,0.2); border: none; border-color: #FF2300',

 },

         {

                                    title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 10px solid; border-color: rgb(153, 153, 255); [size=7]',
            content:

                   ' [Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Ваша жалоба взята на рассмотрение.[/COLOR][/FONT]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#99ccFF][SIZE=5] Ожидайте ответа. [/COLOR][/FONT][/CENTER]'+
            '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',


  prefix: PIN_PREFIX,


            status: true,

          },
                  {

            title: 'Не логируеться',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',
            content:

              '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] В системе логирования нарушений не обнаружено.[/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+
'[CENTER][I][FONT=arial][COLOR=#00BFFF][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },
    {
            title: '▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎  Nrp Обман  ▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.05. [/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#99ccff] | PermBan [/COLOR][/FONT]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+
        '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'неув к адм',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.54. [/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#99ccff]| Mute 180 минут [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'DM',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

                  '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff] Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.19. [/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#99ccff] | Jail 60 минут [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+
               '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

                  {

            title: 'Читы',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153,255)',

            content:

  '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.22. [/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [color=#99ccff]| Ban 15 - 30 дней / PermBan [/COLOR][/FONT] <br><br>'+
                      '[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+
                      '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Аморально',

dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.08. [/color] Запрещена любая форма аморальных действий в сторону игроков [Color=#99ccff]| Jail 30 минут / Warn [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

      {

            title: 'nRP коп',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 6.03. [/color] Запрещено nRP поведение [Color=#99ccff]| Warn [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

                  {

            title: 'Mass DM',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:
                      '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#99ccff] | Warn / Ban 3 - 7 дней [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

           {

            title: 'CAPS',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

           '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff] Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 3.02. [/color] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [color=#99ccff] | Mute 30 минут. [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+
               '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

         },

     {

            title: 'ДБ',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

              '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.13. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#99ccff] | Warn / Ban 3 - 7 дней [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

             {

            title: 'TK',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:
                 '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.15. [/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#99ccff] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

  {

            title: 'CK',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.16. [/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#99ccff] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'MG',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.18. [/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#99ccff]| Mute 30 минут [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

        },

               {

            title: 'Flood',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 3.05. [/color]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#99ccff] | Mute 30 минут [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

      {

            title: 'Политика 10/ Призыв к флуду',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 3.18. [/color]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#99ccff]| Mute 120 минут / Ban 10 дней [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,



          },
     {

            title: 'Политика 7',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:
         '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.35. [/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#99ccff] | Mute 120 минут / Ban 7 дней [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',
         prefix: ACCEPT_PREFIX,

            status: false,

          },

            {

             title: 'Торгаш в  ГОСС',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',
                content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 3.22. [/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#99ccff] | Mute 30 минут [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00ff7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

        },

            {

            title: 'Тенхическому Специалисту',

        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=4][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Ваша жалоба передана тех. специалисту. [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][[Color=#99ccff][SIZE=5] Ожидайте ответа. [/COLOR][/FONT][/CENTER]'+

'[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

            prefix: TEX_PREFIX,

            status: true,

          },

            {

            title: '♡♡♡     Упом род/оск род    ♡♡♡',

            dpstyle: 'border-height: 30px; border-radius: 30px; oswald: 3px; border: 5px solid; color: rgb(0, 0, 0); border-color: rgb(153, 153, 255)',

            content:

           '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 3.04. [/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=#99ccff] | Mute 120 минут / Ban 7 - 15 дней [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER] '+
                '[color=#7FFFD4] Приятной игры на ORЕNBURG!',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

        {

            title: 'Долг',

            dpstyle: 'border-radius: 10px; margin-right: 5px; border: 5px solid; border-color: rgb(153, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff] Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br><br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#99ccff] 2.57. [/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#99ccff] | Ban 30 дней / permban [/COLOR][/FONT] <br><br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]'+
            '[Color=#7FFFD4] Приятной игры на сервере ORENBURG!',

         prefix: ACCEPT_PREFIX,

            status: false,

        },

          {

        title: ' ᅠᅠ......................  Доказательства в жалобах ......................      ',

        dpstyle: 'oswald: 3px;     color: #00ff00; background: #009999; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF2300',

 },

    {

            title: 'Недостаточно док-в',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(204, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Недостаточно доказательств для корректного рассмотрения жалобы. <br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#FF1493][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Отсутствуют док-ва',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(204, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Отсутствуют доказательства. <br> Загрузите доказательства на фото/видео хостинги (YouTube, Imgur, Yapx и так далее). [/COLOR][/FONT] <br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#FF1493][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Не работает док-ва',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(204, 153, 255)',

            content:

           '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Ваши доказательства не рабочие или же битая ссылка [/COLOR][/FONT] <br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#FF1493][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },
     {

            title: 'Док-ва обрываются',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Док-ва отредакт',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Док-ва обрываются',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Нужен фрапс',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(204, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] В данной ситуации обязательно должен быть фрапс(видео фиксация) всех моментов. [/COLOR][/FONT] <br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#FF1493][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Док-ва в соц. сетях',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(204, 153, 255)',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#99ffff]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] Доказательства в соц. сетях не принимаются. Загрузите доказательства на фото/видео хостинги (YouTube, Imgur, Yapx и так далее.) [/COLOR][/FONT] <br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/BndcyvSS/20240816-015600.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#FF1493][SIZE=5] Отказано. [/COLOR][/FONT][/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Неполный фрапс',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Видео фиксация не полная либо же нет условий сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Нету time',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Отсутствуют таймкоды',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Нет условий сделки',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В предоставленных доказательствах отсутствуют условия сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Нарушений нет',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +



   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

                    {

            title: 'Не по форме',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },         {

            title: 'Отсуствие логики',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В данной теме нарушена логика, переосмыслите вашу РП биографию и пойдайте еще раз.  /SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

                     {

        title: ' ᅠᅠ................................... Прочие правила....................................       ',

        dpstyle: 'oswald: 3px;     color: #00ff00; background: #009999; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF2300',

 },

  {

            title: 'Помеха Rp процессу',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

              "[LIST]<br>" +

              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +

              "[/LIST]<br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

    {

            title: 'Уход от Рп',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
    '[LIST]<br><br>' +

              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее..[/SIZE][/COLOR][/FONT][/LEFT]<br>" +

              "[/LIST]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Багоюз',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Багоюз анимки',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.55.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

              '[LIST]<br><br>' +

              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками[/SIZE][/COLOR][/FONT][/LEFT]<br>" +

              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +

              "[/LIST]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Фейк',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]4.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: '2 и более игрока',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и более игроков ( на каждого игрока отдельная жалоба)[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Уже был дан ответ',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вам уже был дан ответ в прошлых жалобах[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Прошло 3 дня',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]С моменты нарушения прошло более 72-х часов[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'От 3 лица',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба написана от 3-его лица. Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: UNACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Слив Глобального чата',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +

              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

          {

            title: 'Слив склада',

            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(245, 255, 0, 1.5)',

            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +

              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +

   '[I][CENTER][SIZE=10][COLOR=rgb(275, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',

            prefix: ACCEPT_PREFIX,

            status: false,

          },

         ];

    const Siniy = [

        {

            title: 'Оск род',

            content:

            '[Center][I][SIZE=3][FONT=arial][COLOR=#2196F3]Здравствуйте, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/XYhpFPV3/20250215-090208.png[/img][/url]<br>'+

'[B][FONT=arial][COLOR=#ffffff][SIZE=4] [u]Игрок будет наказан по пункту:[/u]<br>'+

'[Color=#9999ff] 3.05. [/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=#9999ff] | Mute 120 минут / Ban 7 - 15 дней [/COLOR][/FONT]<br>'+

'[url=https://postimages.org/][img]https://i.postimg.cc/XYhpFPV3/20250215-090208.png[/img][/url]<br>'+

'[CENTER][I][FONT=arial][COLOR=#00FF7f][SIZE=5] Одобрено. [/COLOR][/FONT][/CENTER]',

prefix: ACCEPT_PREFIX,

            status: false,

            },

        ];

 $(document).ready(() => {

 // Загрузка скрипта для обработки шаблонов

 $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

 // Добавление кнопок при загрузке страницы

 addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0);');

    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')

    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 127);')

 addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255);')

 addAnswers();

         // Поиск информации о теме

 const threadData = getThreadData();

 $(`button#ff`).click(() => pasteContent(8, threadData, true));

 $(`button#prr`).click(() => pasteContent(2, threadData, true));

 $(`button#zhb`).click(() => pasteContent(21, threadData, true));

 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

 $('button#accepted').click(() => editThreadData(ACСEPT_PREFIX, false));

 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));

 $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

 $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));

 $('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));

 $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));

 $('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));

 $('button#techspec').click(() => editThreadData(TEX_PREFIX, true));

 $(`button#selectAnswer`).click(() => {

 XF.alert(buttonsMarkup(buttons), null, 'Скрипт by V. Moller');

 buttons.forEach((btn, id) => {

 if (id > 1) {

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

 `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,

 );
 }

 function addAnswers() {

  $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; color: #4682B4; background: #e0ffff; border-radius: 6px;">Голубой срипт</button>`,

 );

 }

 function buttonsMarkup(buttons) {

 return `<div class="select_answer">${buttons

 .map(

 (btn, i) =>

 `<button id="answers-${i}" class="button--primary button`  +

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