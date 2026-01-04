// ==UserScript==
// @name         Скрипт для модерирования форума BlackRussia для Ivan_Dapev by A.Kobzev
// @namespace    https://forum.blackrussia.online/
// @version      0.2.1
// @author       Angel_Kobzev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @description Скрипт модерирования форума
// @license MIT
// @icon https://forum.blackrussia.online/data/avatars/o/1649/1649128.jpg?1763138935
// @downloadURL https://update.greasyfork.org/scripts/557017/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20BlackRussia%20%D0%B4%D0%BB%D1%8F%20Ivan_Dapev%20by%20AKobzev.user.js
// @updateURL https://update.greasyfork.org/scripts/557017/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%BE%D0%B4%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20BlackRussia%20%D0%B4%D0%BB%D1%8F%20Ivan_Dapev%20by%20AKobzev.meta.js
// ==/UserScript==

(function () {
	'use strict';
    const NO_PREFIX = 0; // префикса нет
    const PIN_PREFIX = 2; //  префикс закрепить
	const UNACCEPT_PREFIX = 4; // префикс отказано
    const DECIDED_PREFIX = 6; // префикс решено
    const CLOSE_PREFIX = 7; // префикс закрыто
	const ACCEPT_PREFIX = 8; // префикс одобрено
    const WATCHED_PREFIX = 9; // рассмотрено
	const COMMAND_PREFIX = 10; // команде проекта
    const SPEC_PREFIX = 11; // префикс спец адм
    const GA_PREFIX = 12; // префикс главному адм
	const TEX_PREFIX = 13; //  техническому специалисту
	const buttons = [
        {
		title: 'Приветствие',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
		content:
        '[I][SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(209, 213, 216)]{{ greeting }}, уважаемый(-ая)[B] {{ user.mention }}[/B]!<br><br>' +
		'[COLOR=rgb(209, 213, 216)]Ваш текст[/COLOR][/CENTER][/SIZE][/FONT][/I]'
	    },
        {
        title: 'Ответы по админ части',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 20px; oswald: 10px; color: rgb(255, 0, 0); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	    },
        {
        title: 'Одобрено, отказано (АДМИН РАЗДЕЛ)',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	    },

        {
		title: 'Отказ + текст (ответ в теме)',
	    dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);',
		content:
        '[I][SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(209, 213, 216)]{{ greeting }}, уважаемый[B] администратор![/B]<br><br>' +
		'[COLOR=rgb(255,0,0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)], причина: .[/COLOR][/CENTER][/SIZE][/FONT][/I]<br>'
	    },

        {
		title: 'Одобрено (ответ в теме)',
	    dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);',
		content:
        '[I][SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(209, 213, 216)]{{ greeting }}, уважаемый[B] администратор[/B]!<br><br>' +
		'[COLOR=rgb(0,255,0)]Одобрено[/COLOR][/CENTER][/SIZE][/FONT][/I]<br>'
        },

        {
        title: 'Жалобы на администрацию',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	    },
        {
            title: 'На рассмотрении',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0);',
            content:
            '[CENTER][FONT=Georgia][SIZE=4]' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Беру вашу жалобу[/COLOR][COLOR=rgb(250,197,28)] на рассмотрение.[/COLOR][COLOR=rgb(209, 213, 216)] Ответ будет дан в данной теме в течении 24-х часов, постараемся ответить вам как можно быстрее.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы. Иначе при создании дубликатов ваш форумный аккаунт может быть заблокирован по пункту 2.18.[/COLOR]<br><br>" +
             '[SPOILER="Пункт 2.18"]'+
             "2.18. Запрещена публикация дублирующихся тем."+
             "[/SPOILER]<br>"+
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Отказано (Наказание выдано верно)',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);',
            content:
          '[SIZE=4][FONT=Georgia][CENTER]' +
		  '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		  '[COLOR=rgb(209, 213, 216)]В ходе беседы с администратором, и после проверки доказательств предоставленных администратором - было принято решение, что наказание выдано[/COLOR][COLOR=rgb(0,255,0)] верно.[/COLOR]<br><br>' +
          '[COLOR=rgb(255,0,0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br>' +
          '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
	      },
          {
            title: 'Отказано (Не требуются док-ва адм)',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);',
            content:
          '[SIZE=4][FONT=Georgia][CENTER]' +
		  '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		  '[COLOR=rgb(209, 213, 216)]После проверки ваших доказательств, никаких нарушений со стороны администратора не было выявлено.[/COLOR]<br><br>' +
          '[COLOR=rgb(255,0,0)]Отказано[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br>' +
          '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
        prefix: UNACCEPT_PREFIX,
        status: false,
	    },
        {
            title: 'Одобрено (Наказание ошибочное)',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);',
            content:
          '[SIZE=4][FONT=Georgia][CENTER]' +
		  '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		  '[COLOR=rgb(209, 213, 216)]В ходе беседы с администратором, и после проверки доказательств предоставленных администратором - было принято решение, что наказание выдано ошибочно. С администратором будет проведена необходимая работа.[/COLOR]<br>' +
          '[COLOR=rgb(209, 213, 216)]Ваше наказание будет снято в течении 24-х часов. Извиняемся за предоставленые вам неудобства.[/COLOR]<br><br>' +
          '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br>' +

          '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
	    },
        {
            title: 'Одобрено (Не требуются док-ва от адм)',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);',
            content:
          '[SIZE=4][FONT=Georgia][CENTER]' +
		  '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		  '[COLOR=rgb(209, 213, 216)]После проверки ваших доказательств - было принято решение, что администратор совершил ошибку. С администратором будет проведена необходимая работа.[/COLOR]<br>' +
          '[COLOR=rgb(209, 213, 216)]Извиняемся за предоставленые вам неудобства.[/COLOR]<br><br>' +
          '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br>' +

          '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
	    },

        {
        title: 'Перенаправления',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
	 {
            title: 'В жалобы на технических специалистов',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br>' +
            "[COLOR=#C0C0C0]Для жалобы на [COLOR=#FFA500]технических специалистов[/COLOR][COLOR=#C0C0C0], обратитесь в жалобы на [/COLOR][COLOR=#FFA500]технических специалистов[/COLOR][COLOR=#C0C0C0] - [URL='https://forum.blackrussia.online/forums/Сервер-№51-tula.2261/']*Нажмите сюда*[/URL][/COLOR]<br>" +
            "[COLOR=#C0C0C0]Форма подачи жалоб на[COLOR=#FFA500] технических специалистов[/COLOR][COLOR=#C0C0C0] - [URL='https://forum.blackrussia.online/threads/Шаблон-и-правила-подачи-жалобы-на-технического-специалиста.11657900/']*Нажмите сюда*[/URL][/COLOR]<br>" +
            "[COLOR=#C0C0C0]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br><br>" +
            "[COLOR=#FF0000]Отказано.[/COLOR]<br><br>" +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: true,
          },
          {
            title: 'Главному администратору',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][I][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Главному администратору - [USER=872772]Clifford Arankay 𓆩♡𓆪[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[COLOR=rgb(209, 213, 216)]Иногда ответ Главного Администратора может занять некоторое время.[/COLOR]' +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'Зам. Главного администратора',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Заместителю Главного администратора по ГОСС и ОПГ - [USER=1652146]Yuma Sifer ღ[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Осн. Зам. Главного администратора',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 117, 0)',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый[B] {{ user.mention }}[/B]![/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша жалоба переадресована[/COLOR][COLOR=rgb(255, 0, 0)] Основному Заместителю Главного администратора - [USER=640694]ᴅᴀɴʏ_ꜰᴏʀᴇꜱᴛʀʏ 𓆩♡𓆪[/USER][/COLOR][COLOR=rgb(209, 213, 216)] для рассмотрение данной жалобы.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br>" +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Специальному администратору',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Передаю вашу жалобу[/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia] Специальному администратору[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Иногда ответ специальной администрации может занимать неопределенно [/COLOR]<br><br>" +
            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'В Обжалования наказания',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[SIZE=4][FONT=Georgia][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Для обжалования наказания обратитесь в раздел Обжалование наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2291/']*Нажмите сюда*[/URL][/COLOR]<br><br>" +
              "[COLOR=rgb(209, 213, 216)]Форма подачи обжалований - [URL='https://forum.blackrussia.online/forums/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL][/COLOR]<br>" +
              "[COLOR=#FF0000]Отказано.[/COLOR]<br><br>" +

           '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: true,
          },
        {
            title: 'В жб на игроков',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел [/COLOR][COLOR=rgb(255,0,0)]жалобы на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2290/']*Нажмите сюда*[/URL][/COLOR]<br><br>" +
              "[COLOR=#FF0000]Отказано.[/COLOR]<br><br>" +

            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: true,
          },
          {
            title: 'В жб на лидеров',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2289//']*Нажмите сюда*[/URL][/COLOR]<br><br>" +
              "[COLOR=#FF0000]Отказано.[/COLOR]<br><br>" +

            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: true,
          },


        {
        title: 'Ответы в жалобах на игроков',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 20px; oswald: 10px; color: rgb(255, 0, 0); background: rgb(0, 0, 255); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	    },
        {
            title: 'На рассмотрении',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0);',
            content:
            '[CENTER][FONT=Georgia][SIZE=4]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Беру вашу жалобу[/COLOR][COLOR=rgb(250,197,28)] на рассмотрение.[/COLOR][COLOR=rgb(209, 213, 216)] Ответ будет дан в данной теме в течении 24-х часов, постараемся ответить вам как можно быстрее.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы. Иначе при создании дубликатов ваш форумный аккаунт может быть заблокирован по пункту 2.18.[/COLOR]<br><br>" +
             '[SPOILER="Пункт 2.18"]'+
             "2.18. Запрещена публикация дублирующихся тем."+
             "[/SPOILER]<br>"+

            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: PIN_PREFIX,
            status: true,
          },
         {
            title: 'Не логируеться',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)]По предаставленным вами доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.[/COLOR]<br>" +
             "[COLOR=rgb(209, 213, 216)]Через определенные ресурсы не было подтверждено нарушение с стороны игрока.[/COLOR]<br><br>" +
             "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован по пункту 2.18.<br><br>" +
              '[SPOILER="Пункт 2.18"]<br>'+
              "2.18. Запрещена публикация дублирующихся тем."+
              "[/SPOILER]"+

            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'DM',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br><br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR]<br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR]<br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Читы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR]<br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR]<br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] Блокировка за включенный счетчик FPS не выдается.[/COLOR]<br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Mass DM',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][FONT=Georgia][SIZE=4]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR]<br><br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ДБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'TK',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'CK',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'PG',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.17.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
            },

            {
        title: 'Наказание в чате игры' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
       	},
        {
            title: 'MG',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
{
            title: 'CAPS',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Flood',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Политика',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещено политическое и религиозное пропагандирование.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Рынок в  ГОСС',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC).[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
          {
            title: 'Упом род',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Упом род voice',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]апрещено оскорблять игроков или родных в Voice Chat [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'OOC оск',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] ЗЛюбые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'IC оск (секс. хар-ра)',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.07. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/COLOR]<br>" +

            '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аморал',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
            "[COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR]<br><br>" +
              "[COLOR=rgb(209, 213, 216)]•[/COLOR][COLOR=rgb(255, 0, 0)] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] обоюдное согласие обеих сторон.[/COLOR]<br>" +

              '[CENTER][/CENTER][/SIZE][/FONT]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
            title: 'Мат в назв. фам/биз',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.53.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 1 день / При повторном нарушении обнуление бизнеса[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неув к адм/оск адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] |   Mute 180 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Выдача за адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] |   Ban 7 - 15 + ЧС администрации [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
            '[/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Обман адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[CENTER][COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=Georgia]2.32. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=Georgia]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=Georgia] | Ban 7 - 15 дней[/FONT][/SIZE][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=Georgia]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=Georgia]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/FONT][/SIZE][/COLOR]<br><br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ooc угрозы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.37.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещены OOC угрозы, в том числе и завуалированные.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'польз уязв правил',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено пользоваться уязвимостью правил.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'конфликты ooc и ic',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'переносить конфликты',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.36.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено переносить конфликты из IC в OOC и наоборот.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп нарушениями',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.39.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Злоупотребление нарушениями правил сервера.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 7 - 30 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
             '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'злоуп символами',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: ' ᅠᅠ....  Наказания за Рекламу  ....      ',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
      	},
        {
            title: 'Реклама Voice',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещена реклама в Voice Chat не связанная с игровым процессом[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама промо',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Системный промо',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Данный промокод является системным, или был выпущен  разработчиками[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.31.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
        title: '         ᅠᅠ                                    ..... Наказание  за  NonRp ....                  ' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
    {
            title: 'Nrp Обман',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп нарушениями',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил ограблений/похищений :[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp В/Ч',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту правил нападения на Военскую часть:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]За нарушение правил нападения на Военную Часть .[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Поведение, правокация ГОСС',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp AKC',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.52.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/COLOR][COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },

        {
        title: '         ᅠᅠ                                    ..... Наказания  за нарушение правил ГОСС ....                  ' ,
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
        {
            title: 'Армия',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] За нарушение Mass DM игроку выдается предупреждение[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрывать метку сбора автомобилями, с целью сохранения материалов на складе[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрыть будку для открытия КПП машинами, с целью препятствовать нападению ОПГ[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Наказание выдается по аналоги с пунктом правил 2.03[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено закрывать брешь в стене машинами с целью заблокировать въезд/выезд ОПГ.[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Наказание выдается по аналоги с пунктом правил 2.03[/COLOR]<br><br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Правительство',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий[/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'СМИ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]4.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактирование объявлений, не соответствующих ПРО[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] игрок отправил одно слово, а редактор вставил полноценное объявление.[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих игровым правилам и логике[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]4.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена реклама промокодов в объявлениях[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 дней.[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации[/COLOR]<br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ЦБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]5.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование оружия в рабочей форме[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации.[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]5.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами[/COLOR][COLOR=rgb(255, 0, 0)] Ban 3-5 дней + ЧС организации[/COLOR]<br>" +
              "• [COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/COLOR]<br><br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'УМВД',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 6.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без IC причины [/COLOR][COLOR=rgb(255, 0, 0)] | Warn[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] поведение, не соответствующее сотруднику УМВД.[/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Пример:[/COLOR]<br>' +
              '[COLOR=rgb(209, 213, 216)][QUOTE]- открытие огня по игрокам без причины,<br>' +
              '- расстрел машин без причины,<br>' +
              '- нарушение ПДД без причины,<br>' +
              '- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне. [/QUOTE][/COLOR]<br><br>' +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ГИБДД',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 7.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск, штраф без IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 7.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено останавливать и осматривать транспортное средство без IC причины [/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 7.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено отбирать водительские права во время погони за нарушителем |[/COLOR][COLOR=rgb(255, 0, 0)] Warn[/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] запрещено несоответствующее поведение по аналогии с пунктом [/COLOR][COLOR=rgb(255, 0, 0)]6.02. [/COLOR][COLOR=rgb(209, 213, 216)]([/COLOR][COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение |[/COLOR][COLOR=rgb(255, 0, 0)] Warn[/COLOR][COLOR=rgb(209, 213, 216)])<br><br>' +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ФСБ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 8.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать маскировку в личных целях [/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 8.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] увольнение не соответствующие федеральному постановлению.[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 8.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проводить обыск игрока без IC причины.[/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание: [/COLOR][COLOR=rgb(209, 213, 216)] Нарушения данного пункта правил регулируются лидером, в случае обращения к нему напрямую или через специальные темы на форуме.[/COLOR]<br><br>' +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ФСИН',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              '[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по одному из следующих пунктов правил государственных структур:[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 9.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено освобождать заключённых, нарушая игровую логику организации[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Пример:[/COLOR][COLOR=rgb(209, 213, 216)] Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.[/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] Побег заключённого возможен только на системном уровне через канализацию.[/COLOR]<br><br>' +
              '[COLOR=rgb(255, 0, 0)] 9.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Warn [/COLOR]<br>' +
              '• [COLOR=rgb(255, 0, 0)] Пример:[/COLOR][COLOR=rgb(209, 213, 216)] сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер[/COLOR]<br><br>' +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },

           {
        title: ' ᅠᅠ.... Перенаправление в другой раздел ....      ',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
	 {
            title: 'Тенхическому Специалисту',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br>' +
            "[COLOR=rgb(209, 213, 216)]Передаю вашу жалобу [/COLOR]<br>[COLOR=rgb(255, 102, 0)]Техническому Разделу[/COLOR][COLOR=rgb(209, 213, 216)]<br> для рассмотрение данной жалобы.<br><br>"+
            "Иногда ответ технического специалиста может занять некоторое время.[/COLOR]<br>" +
            "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR]<br><br>" +

            '[COLOR=rgb(255, 140, 0)]На рассмотрение...[/COLOR]<br><br>' +
            '[CENTER][IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER][/CENTER]<br>',
            prefix: TEX_PREFIX,
            status: true,
          },
          {
            title: 'В жб на адм',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Вы ошиблись разделом, обратитесь в раздел [/COLOR][COLOR=rgb(255,0,0)]жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2288//']*Нажмите сюда*[/URL][/COLOR]<br><br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на лидеров',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2289//']*Нажмите сюда*[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на Хелперов',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/threads/tula-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.5728486//']*Нажмите сюда*[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на сотрудников орг',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вы ошиблись разделом, обратитесь в жалобы на сотрудников фракции[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В Обжалования наказания',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2291/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

           {
        title: 'Доказательства в жалобах',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
    {
            title: 'Недостаточно док-в',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Недостаточно доказательств/Доказательства плохого качества для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет док-в',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не работает док-ва',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваши доказательства не рабочие или же битая ссылка.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва обрываются',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва отредактированы',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нужен фрапс',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]В данной ситуации обязательно должен быть фрапс(видео фиксация)всех моментов.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[FONT=Georgia][SIZE=4][CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4] Доказательства в соц. сетях не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/COLOR]<br><br>" +
              '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>' +
              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неполный фрапс',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Видео фиксация не полная.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету time',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют таймкоды',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет условий сделки',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]В предоставленных доказательствах отсутствуют условия сделки.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нарушений нет',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
           {
        title: ' ᅠᅠ.... Прочие пункты правиал....      ',
        dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; oswald: 10px; color: rgb(255, 255, 255); background: rgb(160, 0, 160); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); cursor: default;',
	},
	{
            title: 'Помеха Rp процессу',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
    {
            title: 'Уход от Рп',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее..[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse Anim',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]2.55.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок неправильный',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Фейк',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]4.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: '2 и более игрока',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже наказан',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Данный нарушитель уже был наказан ранее.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже был дан ответ',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Вам уже был дан ответ в прошлых жалобах[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Прошло 3 дня',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]С моменты нарушения прошло более 72-х часов[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3 лица',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваша жалоба написана от 3-его лица. Отказано[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив Глобального чата',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4]3.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Georgia][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив склада',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][FONT=Georgia][SIZE=4]<br>' +
            '' +
            '[COLOR=rgb(0, 255, 127)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)]Нарушитель буден наказан по следующему пункту общих правил серверов:[/COLOR]<br><br>" +
              "[COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/COLOR][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/LEFT]<br>" +
              "[/LIST]<br>" +

              '[IMG width="400px" height="100px"]https://i.postimg.cc/sQtvZd4y/image.png[/IMG][/FONT][/SIZE][/CENTER]<br>',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок неправильный',
            dpstyle: 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 15px; border-radius: 15px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0);',
            content:
            '[CENTER][/CENTER]<br>' +
            '[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=Georgia][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Georgia][FONT=Georgia][SIZE=4]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
              '[CENTER][/CENTER]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0);');
    addButton('Отказано', 'unaccept', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')
    addButton('Закрыто', 'closed_complaint', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
    addButton('Одобрено', 'accepted', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
    addButton('Решено', 'decided', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
    addButton('Главному Адм.', 'GA', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
    addButton('Спец. адм.', 'SPEC', 'font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none; font-size: 12px; border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')

	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, true));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#SPEC').click(() => editThreadData(SPEC_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 4) {
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 20px; font-family: Georgia; font-weight: bold; font-style: italic; text-transform: none;">Выбрать ответ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
     `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button><br>`,
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
	6 <= hours && hours < 12 ?
	'Доброе утро' :
	12 <= hours && hours < 18 ?
	'Добрый день' :
	18 <= hours && hours < 23 ?
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