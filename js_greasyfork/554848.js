// ==UserScript==
// @name        Скрипт V. Elegant
// @namespace   Violentmonkey Scripts
// @match       https://forum.blessrussia.online/index.php*
// @grant       none
// @version     1.0
// @author      -
// @description 26.10.2025, 19:59:13
// @downloadURL https://update.greasyfork.org/scripts/554848/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20V%20Elegant.user.js
// @updateURL https://update.greasyfork.org/scripts/554848/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20V%20Elegant.meta.js
// ==/UserScript==
// ==UserScript==


(function () {
	'use strict';
	const UNACCEPT_PREFIX = 7; // префикс отказано
	const ACCEPT_PREFIX = 6; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 9; // команде проекта
	const CLOSE_PREFIX = 5; // префикс закрыто
	const OPEN_PREFIX = 13; // префикс открыто
	const DECIDED_PREFIX = 4; // префикс решено
	const WATCHED_PREFIX = 8; // рассмотрено
	const TEX_PREFIX = 12; //  техническому специалисту
    const GA_PREFIX = 11; // главному админу
    const SA_PREFIX = 10; // спец админу
	const NO_PREFIX = 13;
    const biography = [
    {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Свой ответ для жалобы✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
	  title: 'Одобрено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваш текст<br><br>" +
    "Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},
{
    title: 'На рассмотрении',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваш текст<br><br>" +
    "Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},
{
    title: 'Отказ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваш текст<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},
{
	  title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваш текст<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

   ];

const buttons2 = [

 {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Ответы для ЖБ на Адм✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
        title: 'Взять жалобу на рассмотрение',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба находится - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
       {
        title: 'Одобрено на адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ознакомившись с доказательствами, Администратор будет наказан.<br><br>" +
    "Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
      {
        title: 'Запрос докв у адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Запрошены доказательства у Администратора.<br><br>" +
    "Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
      {
        title: 'Отказано на адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ознакомившись с доказательствами со стороны Администратора, нарушений не найдено.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Нет тайм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] На ваших доказательствах отсутствует /time.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Непр ник',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Никнейм в жалобе и доказательствах отличаются.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Срок подачи жб',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
{
	  title: 'Отсутствуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Без доказательств мы помочь не можем.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},
{
    title: 'Дубликат жалобы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Данная жалоба - дубликат вашей прошлой жалобы.<br><br>" +
    "За повторные жалобы Ваш форумный аккаунт может быть[COLOR=#ff0000] заблокирован.[/COLOR]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Ответы для Обжалований✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
        title: 'Взять обжалование на рассмотрение',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше обжалование находится - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
       {
        title: 'Одобрено',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше обжалование получает статус - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Отказано',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше обжалование получает статус - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
      {
        title: 'Запрос докв у адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Запрошены доказательства у Администратора.<br><br>" +
    "Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Непр ник',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Никнейм в жалобе и доказательствах отличаются.<br><br>" +
    "Ваше обжалование получает статус - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
{
        title: 'Наказание смягчено',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше наказание смягчено.<br><br>" +
    "Ваше обжалование получает статус - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
{
	  title: 'Отсутствуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Без доказательств мы помочь не можем.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
    title: 'Дубликат обжалования',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Данное обжалование - дубликат.<br><br>" +
    "За повторные жалобы Ваш форумный аккаунт может быть[COLOR=#ff0000] заблокирован.[/COLOR]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Ответы для Амнистий✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
        title: 'Взять амнистию на рассмотрение',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию находится - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
       {
        title: 'Одобрено',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию получает статус - [COLOR=#00FF00]Одобрено.[/COLOR]<br><br>" +
    "При нарушении правил в течении 30 дней вы можете попасть обратно.[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },
    {
        title: 'Отказано',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию получает статус - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
      },

{
    title: 'Дубликат Амнистии',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Данное заявление на Амнистию - дубликат. В день можно отправлять 1 Амнистию.<br><br>" +
    "За повторные заявления Ваш форумный аккаунт может быть[COLOR=#ff0000] заблокирован.[/COLOR]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
	  title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию составлена не по форме.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
	  title: 'Специальному Администратору',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
 	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию передано[COLOR=#ff0000] Специальному Администратору[/COLOR].<br><br>" +
    "Пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

  {
	  title: 'Команде Проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию передано[COLOR=#ff0000] Команде Проекта[/COLOR].<br><br>" +
    "Пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
	  title: 'Передано Тех. адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваше заявление на Амнистию передано[COLOR=#0000FF] Техническому Администратору[/COLOR].<br><br>" +
    "Пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
},

{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Перенаправление жалоб✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
       dpstyle: 'oswald: 10px;   color: #fff; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
},
{
	  title: 'В ЖБ на Адм.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом.<br><br>" +
    "Обратитесь в раздел[URL='https://forum.Blessrussia.com/index.php?forums/39/'] [U] «Жалобы на администрацию»[/U][/URL]<br><br>" +
    "[COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом.<br><br>" +
    "Обратитесь в раздел[URL='https://forum.Blessrussia.com/index.php?forums/37/'] [U] «Жалобы на лидеров»[/U][/URL]<br><br>" +
    "[COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В обжалования',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом.<br><br>" +
    "Обратитесь в раздел[URL='https://forum.Blessrussia.com/index.php?forums/113/'] [U] «Обжалование наказаний»[/U][/URL]<br><br>" +
    "[COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на игр.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом.<br><br>" +
    "Обратитесь в раздел[URL='https://forum.Blessrussia.com/index.php?forums/37/'] [U] «Жалобы на игроков»[/U][/URL]<br><br>" +
    "[COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В тех. раздел',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом.<br><br>" +
    "Обратитесь в раздел[URL='https://forum.Blessrussia.com/index.php?forums/2/'] [U] «Технический раздел»[/U][/URL]<br><br>" +
    "[COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},

];
    const buttons = [
   {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус одобрено✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	   dpstyle: 'oswald: 10px;   color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
    {
    title: '| Обход системы/Багоюз |',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color].[/COLOR]<br><br>" +
    "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
      },
    {
    title: '| Стороннее ПО |',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
    "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>" +
    "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
    status: false,
      },
{
    title: 'NonRP Обман',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| Ban 5-30 дней / PermBan[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
	  title: 'Fake',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]4.11.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| PermBan[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оскорбление // Упом. родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Багоюз анимации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Оскорбление',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[COLOR=#ff0026]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30-180 минут[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Оск. Адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.49.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут / Ban 1-30 дней[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},


{
	  title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Flood',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Meta Gaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.18.[/color] Запрещен MG(MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Политическая // Религ. пропоганда',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000] 3.16.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Выдача себя за администратора',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]3.09.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 дней + ОЧС администрации[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'OОC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'ППИВ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Угроза о наказании от Адм.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>" +
    "[Color=#ff0000]3.08.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут / Ban 10-30 дней / Черный Список проекта[/color].[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},

{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус отказано✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    dpstyle: 'oswald: 10px;   color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
},
{
    title: 'Администрация не может выдать наказание',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Администрация не может выдать наказание по вашим доказательствам.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
     },
{
	  title: 'Нарушений не найдено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Нарушений со стороны данного игрока не было найдено.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Наказание уже выдано',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Наказание игроку уже было выдано.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
    title: 'Дубликат жалобы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Данная жалоба - дубликат вашей прошлой жалобы.<br><br>" +
    "За повторные жалобы Ваш форумный аккаунт может быть[COLOR=#ff0000] заблокирован.[/COLOR]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Разные ники',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
    content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Никнейм в жалобе и доказательствах отличаются.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
	  title: 'Недостаточно док-в',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Из-за недостатка доказательств мы помочь не можем.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Отсутствуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Без доказательств мы помочь не можем.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба составлена не по форме.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет /time',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] На ваших доказательствах отсутствует /time.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет time кодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] На ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений.<br><br>" +
    "[COLOR=#ff0000]Примечание:[/COLOR] Укажите таймкоды по следующему примеру:<br>" +
    "1) Условия сделки.<br>" +
    "2) Подтверждение сделки.<br>" +
    "3) Начало сделки.<br>" +
    "4) Конец сделки.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Более 72-х часов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва загружены не там',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Доказательства загружены в постороннем приложении. Загрузка доказательств в Соц. сетях и т.п запрещается, доказательства должны быть загружены исключительно на фото/видео хостинге (YouTube, Yapx, Imgur).<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Условия сделки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] В ваших доказательствах отсутствуют условия сделки.<br><br>" +
    "Ознакомиться с правилами подачи жалоб на игроков можно[URL='https://forum.Blessrussia.com/index.php?threads/108/'] [U] «В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Доказательств на нарушение от данного игрока недостаточно.<br><br>" +
    "В данной ситуации необходим фрапс (запись экрана).<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва не открываются',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваши доказательства не открываются.<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>" +
    "Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Ошиблись сервером',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер.<br><br>" +
    "[COLOR=#ff0000]Жалоба закрыта от ошибки в сервере и находится на рассмотрении администрации вашего сервера.[/COLOR]<br><br>" +
    "[/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
	   prefix: PIN_PREFIX,
	  status: false,
},

    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️RolePlay Биографии✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    dpstyle: 'oswald: 10px;   color: #fff; background: #1E90FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',

},
{
    title: 'Биография одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Рассмотрев вашу RolePlay биографию я готов вынести вердикт.<br><br>" +
    "Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
    title: 'На доработку',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] В вашей RolePlay - биографии недостаточно информации.<br><br>" +
    "Даю вам 24 часа на ее дополнение/исправление, иначе РП биография будет [COLOR=#ff0026]отказана.[/COLOR]<br><br>" +
    "Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: PIN_PREFIX,
	  status: true,
},
{
    title: 'На дополнение',
	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay биография нарушает правила подачи RolePlay биографий.<br><br>" +
    "У вас есть 24 часа на исправление своей биографии.<br><br>" +
    "Выношу вердикт - [COLOR=#FFA500]На дополнение...[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: PIN_PREFIX,
	  status: true,
},
{
    title: 'Отказ (Не по форме)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay биография написана не по форме.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (Не заполнена)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Форма RolePlay биографии не заполнена частично либо вовсе не заполнена.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (Мало информации)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Недостаточное количество RolePlay информации о вашем персонаже.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U] «В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (Скопирована)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay биография скопирована.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (заголовок)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] У вашей RolePlay биографии неверный заголовок.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (От 3-го лица)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Ваша RolePlay биография написана от 3-го лица.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (Недостаточно РП информации)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] У вашей RolePlay биографии недостаточно РП информации.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
  	title: 'Отказ (Возраст не совпал)',
 	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] Возраст не совпадает с датой рождения.<br><br>" +
    "Ознакомиться с правилами подачи RolePlay биографией [URL='https://forum.blessrussia.online/index.php?threads/1087/'] [U]«В данном разделе»[/U][/URL]<br><br>" +
    "Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Отказ (Ошибки)',
	  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
    "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=white][FONT=courier new] В вашей RolePlay биографии присутствуют грамматические либо пунктуационные ошибки.<br><br>" +
    "Выношу вердикт - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7ZvzpWkf/RLwzo.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=lavender]Приятной игры на сервере [COLOR=RED]RED[/COLOR].<br><br>" +
    "[CENTER][COLOR=lavender]С уважением, Старшая администрация.[/COLOR][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	  status: false,
}

];

    const tasks = [

    {
 title: 'RED | Игроки(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
move: 48,
    },
  {
 title: 'RED | Админы(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
 move: 49,
    },
   {
 title: 'RED | ОБЖ(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
move: 50,
    },
  {
 title: 'RED | Лидеры(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 51,
    },
{
 title: 'RED | Игроки(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
move: 48,
    },
{
 title: 'RED | Админы(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
 move: 49,
    },
 {
 title: 'RED | ОБЖ(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: ACCEPT_PREFIX,
move: 50,
    },
 {
 title: 'RED | Лидеры(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 51,
    },


 {
 title: 'GREEN | Игроки(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
move: 145,
    },
  {
 title: 'GREEN | Админы(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
 move: 146,
    },
   {
 title: 'GREEN | ОБЖ(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
move: 147,
    },
  {
 title: 'GREEN | Лидеры(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 148,
    },
{
 title: 'GREEN | Игроки(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
move: 145,
    },
{
 title: 'GREEN | Админы(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
 move: 146,
    },
 {
 title: 'GREEN | ОБЖ(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: ACCEPT_PREFIX,
move: 147,
    },
 {
 title: 'GREEN | Лидеры(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 149,
    },

 {
 title: 'BLUE | Игроки(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
move: 149,
    },
  {
 title: 'BLUE | Админы(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: UNACCEPT_PREFIX,
 move: 150,
    },
   {
 title: 'BLUE | ОБЖ(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
move: 151,
    },
  {
 title: 'BLUE | Лидеры(отказ)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 152,
    },
{
 title: 'BLUE | Игроки(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
move: 149,
    },
{
 title: 'BLUE | Админы(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: ACCEPT_PREFIX,
 move: 150,
    },
 {
 title: 'BLUE | ОБЖ(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: ACCEPT_PREFIX,
move: 151,
    },
 {
 title: 'BLUE | Лидеры(одобрено)',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
 prefix: UNACCEPT_PREFIX,
 move: 152,
    },


  ];


    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      addAnswers();
      addButton('Свой ответ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: 2px solid; background: #483D8B');
      addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
      addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Открыто', 'open', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Главный Администратор', 'GlavAdm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(139, 0, 0);');
      addButton('Команда Проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
      addButton('Специальный Администратор', 'SpecAdm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
      addButton('Технический Отдел', 'techspec', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
      addButton('ПЕРЕМЕЩЕНИЕ', 'selectMoveTask', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; background: #4682B4');

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData2(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData2(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData2(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData2(CLOSE_PREFIX, false));
	$('button#GlavAdm').click(() => editThreadData2(GA_PREFIX, true));
	$('button#SpecAdm').click(() => editThreadData2(SA_PREFIX, true));
	$('button#closed_complaint').click(() => editThreadData2(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));

      $(`button#selectComplaintAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
$(`button#selectComplaintAnswer2`).click(() => {
          XF.alert(buttonsMarkup(buttons2), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, false));
              }
          });
      });
      $(`button#selectBiographyAnswer`).click(() => {
        XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
        biography.forEach((btn, id) => {
            if (id > 1) {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            }
        });
      });

          $(`button#selectMoveTask`).click(() => {
        XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
        tasks.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
        });
      });
  });


      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
  }
  function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer2" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px; background: #483D8B;">ЖБ/ОБЖ</button>`,
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

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

function buttonsMarkup(buttons2) {
	return `<div class="select_answer">${buttons2
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons2) {
  return `<div class="select_answer">${buttons2
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == false) {
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
  }

  function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(biography[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == false) {
        editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}
  function pasteContent3(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons2[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == false) {
          editThreadData(buttons2[id].move, buttons2[id].prefix, buttons2[id].status, buttons2[id].open);
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
      4 < hours && hours <= 11
        ? 'Доброе утро'
        : 11 < hours && hours <= 15
        ? 'Добрый день'
        : 15 < hours && hours <= 21
        ? 'Добрый вечер'
        : 'Доброй ночи',
  };
  }


  function editThreadData(move, prefix, pin = false, open = false) {
  // Получаем заголовок темы, так как он необходим при запросе
      const threadTitle = $('.p-title-value')[0].lastChild.textContent;

      if (pin == false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

    function editThreadData2(prefix, pin = false) {
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

  function editThreadData3(move, prefix, pin = false, open = false) {
  // Получаем заголовок темы, так как он необходим при запросе
      const threadTitle = $('.p-title-value')[0].lastChild.textContent;

      if (pin == false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

  function moveThread(prefix, type) {
  // Функция перемещения тем
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
