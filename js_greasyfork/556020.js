// ==UserScript==
// @name   Скрипт для КФ ROSTOV
// @name:ru Script for ROSTOV ADMINS
// @description: Script for the curators of the ROSTOV server
// @description:ru Скрипт для кураторов сервера ROSTOV
// @autor Bernard_Bogdanov
// @version 1.0
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   none
// @supportURL https://vk.com/kkuk7 | Bernard_Bogdanov | ROSTOV
// @description Скрипт для куратора форума сервера ROSTOV
// @downloadURL https://update.greasyfork.org/scripts/556020/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20ROSTOV.user.js
// @updateURL https://update.greasyfork.org/scripts/556020/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20ROSTOV.meta.js
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
      title: 'НА РАССМОТРЕНИИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱На рассмотрении⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },

    {
      title: 'ПЕРЕДАНО СА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Специальному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
      status: true,
    },

     {
      title: 'ПЕРЕДАНО ГКФ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба передана Главному куратору форума, убедительная просьба не создавать идентичных жалоб и ожидать ответа.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱На рассмотрении⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },

     {
      title: 'ПЕРЕДАНО ГА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Главному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },

        {
      title: 'ПЕРЕДАНО ТЕХУ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(255, 69, 0)]Техническому специалисту.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
      status: true,
    },

     {
      title: 'ТАЙМ КОДЫ',
     content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша видеозапись длится более 3-х минут. У Вас есть 24 часа, чтобы прикрепить таймкоды нарушений, в ином случае жалоба будет закрыта.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱На рассмотрении⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },

    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ❌ОТКАЗАННЫЕ ЖАЛОБЫ❌ ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},


     {
      title: 'ДУБЛИКАТ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ранее вы уже создавали тему на данного игрока, ожидацйте вердикта в первой жалобе.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },


    {
      title: 'СКЛАД ФАМЫ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Нарушение со стороны игрока отсутствуют. Игрок заплатил определённую сумму за разрешение опредлённого колличества патронов, которую Вы выдали ему. [/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },

     {
      title: 'НЕТ ДОСТУПА К ДОКАЗАТЕЛЬСТВАМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]К сожелению к вашим доказательствам закрыт доступ. Откройте доступ и убедитесь что доступ к доказательствам открыт затем подайте жалобу еще раз. [/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },

     {
      title: 'НЕ КОРРЕКТНЫЕ УСЛОВИЯ СДЕЛКИ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ваши условия сделаки составлены некорректно.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'НАКАЗАНИЕ ВЫДАНО ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Данный игрок уже получил наказание за подобное нарушение.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Одобрено,Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ODOBRENOBIO_PREFIX,
      status: true,
    },
    {
      title: 'БИТАЯ ССЫЛКА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ссылка предоставленная вами не робочая либо битая, пожалуйста перепроверьте ссылку на доказательства.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ЖБ БОЛЕЕ 1 ИГРОКА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба составлена более чем на одного игрока, подайте на жалобу на каждого игрока по отдельности.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'МАТЫ В ЖБ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]В вашей жалобе присутствует не нормативная лексика. Жалоба рассмотрена не будет.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },

    {
      title: 'НЕТ ТАЙМ КОДОВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы не предоставили таймкоды. В жалобе отказано.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },


    {
      title: 'НЕ ПО ФОРМЕ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name игрока:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ДУБЛИКАТ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Вам уже был дан ответ в прошлой теме, пожалуйста перестаньте делать дубликаты.<br><br>"+
        '[CENTER][B][COLOR=rgb(255, 0, 0)]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
           {
      title: 'ПРОШЛО 3 ДНЯ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента возможного нарушения со стороны игрока прошло более 72 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

     {
      title: 'НЕ УВАЖЕНИЕ В ЖБ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В вашей жалобе присутствует неуважение к игроку, жалоба рассмотрена не будет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

     {
      title: 'ФОТО/ВИДЕОХОСТИНГИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

      {
      title: 'ВИДЕОЗАПИСЬ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В данном случае, для выдачи наказания игроку, требуется видеозапись.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

       {
      title: 'ВИДЕО ОБРЫВАЕТСЯ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше видеодоказательство обрывается. Видеохостинг YouTube загружает видео без ограничений, рекомендуем использовать его..[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

     {
      title: 'НЕТ ДОКАЗАТЕЛЬСТВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на совершенное нарушение от данного игрока.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },

     {
      title: 'ОТРЕДАКТИРОВАНО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства отредактированы. В жалобе отказано.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },

    {
      title: 'НЕДОСТАТОЧНО ДОКАЗАТЕЛЬСТВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательств, предоставленных Вами, недостаточно для выдачи наказания данному игроку.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },

     {
      title: 'НЕТ /TIME',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

      {
      title: 'НЕТ УСЛОВИЙ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствуют условия сделки.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },

     {
      title: 'ОТКАЗАНО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

          {
      title: 'ДОЛГ ЧЕРЕЗ ТРЕЙД',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. На ваших доказательствах займ был осуществлен через обмен с игроком.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

        {
      title: 'СЛИВ ФАМЫ ЗАМОМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет ни единого правила, которое регулирует подобные ситуации. Вы сами выдали человеку должность заместителя, советую внимательнее назначать на данную должность людей. [/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

      {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ↪ПЕРЕНАПРАВЛЕНИЕ ЖАЛОБ↩    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

         {
      title: 'ОШИБЛИСЬ РАЗДЕЛОМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания жалоб на игроков.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

    {
      title: 'ЖБ НА СОТРУДНИКА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

        {
      title: 'ОШИБЛИСЬ СЕРВЕРОМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись сервером. Данный раздел принадлежит серверу ROSTOV.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ🎮ЖАЛОБЫ НА ИГРОКОВ🎮  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
      {
      title: 'nRP ПОВЕДЕНИЕ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'nRP Drive ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'Помеха RP',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'nRP Обман',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br>" +
        "[QUOTE][FONT=Georgia][I][CENTER][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: администрация сервера [U]не несет[/U] ответственность за аккаунты игроков, а также содержащиеся на них или утерянные материальные игровые ценности в случае взлома, обмана, невнимательности и так далее.[/QUOTE][/I][/FONT][/CENTER]"+
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

  {
  title: 'nRP Обман + Игровые ценности',
  content:
    '[color=rgb(222, 143, 255)][font=Georgia][center][i]{{ greeting }}, уважаемый {{ user.mention }}.[/i][/center][/font][/color]' +
    '[center]Игрок будет наказан по пункту правил[/center]' +
    '[quote][font=Georgia][i][center][color=rgb(255, 0, 0)]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [color=rgb(255, 0, 0)] | PermBan [/color][/center]' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Примечание[/color]: администрация сервера [u]не несет[/u] ответственность за аккаунты игроков, а также содержащиеся на них или утерянные материальные игровые ценности в случае взлома, обмана, невнимательности и так далее.[/i][/font][/quote]' +
    '[center][color=rgb(255, 165, 0)][b][size=5]⚠ Так же уважаемый игрок хочу вас предупредить о том что ваш игровой аккаунт будет заблокирован по пункту правил: ⚠[/size][/b][/color][/center]' +
    '[quote][font=Georgia][i][center][color=rgb(255, 0, 0)]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [color=rgb(255, 0, 0)] | PermBan с обнулением аккаунта + ЧС проекта. [/color][/center]' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Примечание[/color]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Примечание[/color]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Пример[/color]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Примечание[/color]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.' +
    '<br>' +
    '[color=rgb(255, 0, 0)]Исключение[/color]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/i][/font][/quote]' +
    '[center][b][color=rgb(255, 0, 0)][size=4][font=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/font][/size][/color][/b][/center]',
  prefix: RESHENO_PREFIX,
  status: false,
},
       {
      title: 'АМОРАЛ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

       {
      title: 'Слив склада',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: ' ТС в личных целях',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ПОМЕХА БЛОГЕРУ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [COLOR=rgb(255, 0, 0)]| Ban 7 дней [/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'DB',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'TK',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'SK',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'DM',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Mass DM',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

        {
      title: 'БАГОЮЗ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'СТОРОННЕЕ ПО ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ССОКРЫТИЕ БАГОВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ПОКРЫВАТЕЛЬСТВО ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ПОКУПКА/ПРОДАЖА ИВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ПОРЧА ЭКО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.30.[/color] Запрещено пытаться нанести ущерб экономике сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ППВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.03.[/color] Передача своего личного игрового аккаунта третьим лицам [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'nRP Drive ФУРА/ИНКО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'nRP АКС',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'СБИВ ТЕМПА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ВЫДАЧА ЗА АДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 + ЧС администрации[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ОБМАН АДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ВВОД В ЗАБЛ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🗣ИГРОВЫЕ ЧАТЫ🗣 ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

       {
      title: 'НЕУВАЖЕНИЕ К АДМ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ОСК/ПРИЗЫВ ПОКИНУТЬ BR',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ООС УГРОЗЫ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'РЕЛИГИЯ/НАЦИОНАЛЬНОСТЬ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

       {
      title: 'MG',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ЛИЧНАЯ ИНФА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'CapsLock',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'УПОМ РОДНЫХ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'ОСК РОДНЫХ ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено оскорбление родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'FLOOD',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },


     {
      title: 'ЗЛОУПОМ СИМВОЛАМИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'СЛИВ ЧАТА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

       {
      title: 'МУЗЫКА VOICE ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

       {
      title: 'ШУМ VOICE',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.16.[/color] Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ПОЛИТИКА/ПРОВОКАЦИИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ТРАНСЛИТ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/color] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ПРОМО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ТОРГОВЛЯ ГОСС',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

        {
      title: 'МАТ VIP',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

        {
      title: 'РЕКЛАМА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

           {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ 🤯АККАУНТЫ🤯  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

       {
      title: 'ФЕЙК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'МУЛЬТИАК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ОСК НИК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'nRP Nick',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.07.[/color] В игровом никнейме запрещено использовать более двух заглавных букв [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ 👮🏻ЖАЛОБЫ ГОСС👮🏻‍♂ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

       {
      title: 'ГОСС БУ/КАЗИНО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'АРЕСТ НА ТТ ОПГ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.16.[/color] Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'nRP ФСИН',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.01.[/color] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'ЗАМЕНА ОБЬЯВ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ШТРАФ/РОЗЫСК',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]6.02.[/color] Запрещено выдавать розыск без IC причины [COLOR=rgb(255, 0, 0)] | Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

      {
      title: 'ПРАВА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ОСВОБ ЗАКЛЮЧЕННЫХ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]9.01.[/color] Игрок будет наказан по пункту правил: 9.01. Запрещено освобождать заключённых, нарушая игровую логику организации [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ 🥷🏼ЖАЛОБЫ НА ОПГ🥷🏼   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

      {
      title: 'ГОСС ПРОВОКАЦИЯ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.[/color] Запрещено провоцировать сотрудников государственных организаций [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ДУЭЛИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'ПЕРЕСТРЕЛКИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'УХОД ОТ ПОГОНИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

        {
      title: 'РЕКЛАМА ЧАТ ОПГ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'nRP ВЧ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE] Игрок будет наказан по пункту правил:Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [COLOR=rgb(255, 0, 0)] | /Warn NonRP В/Ч [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Одобрено.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      status: false,
    },


     {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🧛‍♂ROLEPLAY БИОГРАФИИ🧛‍♀   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},

       {
      title: 'GPT',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В вашей биографии присутствуют следы искусственного интелекта [Color=Red][/color]<br><br>" +
        "У вас есть 24 часа на справление, в противном случае ваша RolePlay биография будет отказана.[/CENTER][/FONT]",
     prefix: NARASSMOTRENIIBIO_PREFIX,
      status: true,
    },

    {
  title: 'ЗАГОЛОВОК',
  content: `[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>
[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Заголовок вашей RolePlay Биографии составлен не по форме.[/CENTER][/FONT]<br>
[CENTER][SPOILER=Пример заголовка][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>
[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Биография | Bernard_Bogdanov:[/CENTER]<br><br>`,
  prefix: OTKAZBIO_PREFIX,
  status: false,
},

     {
      title: 'МАЛО ИНФОРМАЦИИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о вашем персонаже расписана менее чем на 200 слов.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

       {
      title: 'МНОГО ИНФОРМАЦИИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о вашем персонаже превышает максимально допустимое количество информации:600 слов.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

    {
      title: 'ФАЛЬШ ИНФА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Ваша RolePlay биография не является/ содержит в себе информацию которая не может быть в реальной жизни.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

    {
      title: 'ЧУЖАЯ БИО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Ваша RolePlay биография частично/ полностью была скопирована у другого игрока.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

 {
      title: 'Нет Фото',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Фотография вашего персонажа отсутствует.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },


    {
      title: 'НЕТ ЛОГИКИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: В вашей RolePlay биографии присутствует логические противоречия.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

     {
      title: 'ОШИБКИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: В вашей RolePlay биографии присутствуют орфографические ошибки[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

     {
      title: 'ОДОБРЕНО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color]<br><br>" +
        "[CENTER]Ваша RolePlay биография одобрена. [CENTER][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },

    {
      title: 'ДОРАБОТКА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Orange]На рассмотрении[/I][/CENTER][/color]<br><br>" +
        "[CENTER]У вас есть 24 часа доработать вашу RolePlay биографию. [CENTER][/FONT]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: false,
    },

     {
      title: '24 ЧАСА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Прошло 24 часа, ваша RolePlay биография не была исправлена.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

     {
      title: 'ОТКАЗ GPT',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: В вашей RolePlay биографии не было замечено изменений.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

      {
      title: 'ЮНОСТЬ 14',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Юность у персонажа должна начинаться с 14-ти лет.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },


   {
      title: 'НЕ ПО ФОРМЕ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: RolePlay Биография составлена не по форме.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },

       {
      title: 'НИКИ НЕ СОВПАДАЮТ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Nick_Name указанный в заголовке и в самой биографии не совпадают, что противоречит биографии.[/CENTER][/FONT]",
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
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация на доработке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение Вашей РП ситуации[/CENTER]",
      prefix: NARASSMOTRENIIRP_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация отказана',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/violet-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1210123/']Правила Role-Play ситуаций[/URL][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания RolePlay ситуаций.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
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
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП организация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: 'На доработке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение Вашей неофициальной организации.[/CENTER]",
      prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
    },
                                                                                                                                                                                                                                                                                                                                                                                                                      // by. B. Bogdanov
    {
      title: 'Отказано',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша организация получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной RolePlay организации.[/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
      {
      title: 'Запросы активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрепите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",
              prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: 'Закрытие активности',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Активность не была предоставлена. Организация закрыта.[/CENTER]",
              prefix: CLOSE_PREFIX,
      status: false,
    },
 {
      title: 'Закрытие организации',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Организация закрыта по вашему собственному желанию.[/CENTER]",
              prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDnLWjDT/1.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для создания неофициальных организаций.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]ღ⋱⋱⋱Закрыто.⋰⋰⋰ღ[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },






  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton(' Script by. Bernard_Bogdanov🐻‍❄️', 'selectAnswer');

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
