// ==UserScript==
  // @name         Модераторы форума by Gallows
// @namespace    https://forum.blackrussia.online/
// @version      4.0
// @description  Скрипт для модераторов форума
// @author       Dmitriy_Gallows
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @supportURL   https://vk.com/id520020196 | Dmitriy_Gallows CHEREPOVETS
// @icon https://i.postimg.cc/ZKwZvbfd/Developer.png
// @downloadURL https://update.greasyfork.org/scripts/562735/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20Gallows.user.js
// @updateURL https://update.greasyfork.org/scripts/562735/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20Gallows.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const PIN_PREFIX = 2; // префикс закрепить
    const PINN_PREFIX = 2; // На рассмотрении
    const COMMAND_PREFIX = 10; // команде проекта
    const CLOSE_PREFIX = 7; // префикс закрыто
    const DECIDED_PREFIX = 6; // префикс решено
    const WATCHED_PREFIX = 9; // Рассмотрено
    const TEX_PREFIX = 13; // техническому специалисту
    const NO_PREFIX = 0;
    const buttons = [
         {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ RolePlay Биографии     ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0000;  width: 96%; border-radius: 20px;',
    },

    {
        title: 'Одобрено',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: ACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Отказано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Заголовок не по форме',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR][COLOR=rgb(255, 255, 255)] Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'NRP Nickname',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас NRP NickName. Необходимо изменить имя персонажа согласно правилам проекта.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб. фотографии',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR][COLOR=rgb(255, 255, 255)] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб. шрифты',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.6.[/COLOR][COLOR=rgb(255, 255, 255)] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб. ошибки',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.5.[/COLOR][COLOR=rgb(255, 255, 255)] Биография должна быть читабельна и не содержать грамматических или орфографических ошибок.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб. дата рождения',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]Ваш возраст не соответствует событиям персонажа[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Дополнение слов',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR][COLOR=rgb(255, 255, 255)] Минимальный объём RP биографии — 200 слов, максимальный — 600.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Противоречия',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR][COLOR=rgb(255, 255, 255)] В биографии не должно быть логических противоречий.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)]• Пример: [/COLOR][COLOR=rgb(255, 0, 0)]в пункте «Возраст» вы указываете, что вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей.[/COLOR][COLOR=rgb(255, 255, 255)]•[/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Существующий человек',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.3.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено составлять биографию существующих людей.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)]• Пример: [/COLOR][COLOR=rgb(255, 0, 0)]биография Бреда Питта, Аль Капоне и т. д.[/COLOR][COLOR=rgb(255, 255, 255)]•[/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Копипаст',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.4.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено копировать чужие RP биографии.[/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

{
        title: 'Не доработано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]По истечению [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часов не было доработано[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

     {
        title: 'Не по форме',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]" +
            "Имя и фамилия персонажа:<br>" +
            "Укажите полное имя (можно придумать необычное, но реалистичное).<br><br>" +
            "Пол:<br>" +
            "Мужской / Женский.<br><br>" +
            "Возраст:<br>" +
            "Реалистичный возраст, соответствующий опыту и занятиям персонажа.<br><br>" +
            "Национальность:<br>" +
            "Укажите страну или народ, к которому принадлежит персонаж.<br><br>" +
            "Образование:<br>" +
            "Опишите, где и чему учился персонаж: школа, колледж, университет, курсы или самообразование.<br><br>" +
            "Описание внешности:<br>" +
            "Рост, телосложение, цвет волос, глаз, особенности (шрамы, татуировки, манера одеваться).<br><br>" +
            "Характер:<br>" +
            "Опишите сильные и слабые стороны, темперамент, привычки.<br>" +
            "[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] общительный и открытый, но быстро вспыхивает; спокойный и расчётливый, склонен к упрямству.[/COLOR]<br><br>" +
            "Детство:<br>" +
            "Кратко опишите семью, условия жизни, важные события в ранние годы (бедность, переезд, утрата, дружба).<br><br>" +
            "Настоящее время:<br>" +
            "Чем персонаж занимается сейчас: работа, место жительства, социальный статус, круг общения.<br><br>" +
            "Итог:<br>" +
            "Опишите, какие качества и цели сформировались у персонажа после всех событий. Это подводит итог всей биографии.[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

 {
        title: 'Под адапт. доработки',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman].[SIZE=4][/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

          {
  title: ' RolePlay Ситуации ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #22FF22; width: 96%; border-radius: 15px;',
},
       {
        title: 'Одобрено',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: ACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Отказано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Дораб. не грамотная',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.2.[/COLOR][COLOR=rgb(255, 255, 255)] RP ситуация должна быть составлена грамотно, с соблюдением правил орфографии и пунктуации.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Копипаст',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено копировать чужие RP ситуации.[/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Не по форме',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Форма подачи[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]" +
            "• Название:<br>" +
            "• Пролог: (введение / предыстория)<br>" +
            "• Сюжет: (основная часть RP ситуации)<br>" +
            "• Эпилог: (заключение / итоги)<br>" +
            "• Ссылка на исходные материалы с отыгровками:[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Заголовок не по форме',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]1.5. Название темы с RP ситуацией оформляется по форме: [Краткое название события] Событие[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб ссылки',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.4.[/COLOR][COLOR=rgb(255, 255, 255)] RP ситуацию должны сопровождать скриншоты или видеоматериалы с места событий.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Не рабочая ссылка',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]Ваша ссылка повреждена/работает не корректно.[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'На дораб. шрифты',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR][COLOR=rgb(255, 255, 255)] RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

{
        title: 'Не доработано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]По истечению [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часов не было доработано[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

{
        title: 'Под адапт. доработки',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman].[SIZE=4][/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },
          {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠНеофициальные RolePlay Организации ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #00FFFF; width: 96%; border-radius: 15px;',
	},
        {
        title: 'Одобрено',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: ACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Отказано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Заголовок темы',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.8.[/COLOR][COLOR=rgb(255, 255, 255)] Название темы должно быть оформлено по шаблону: Неофициальная RP организация [Название][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Фото',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR][COLOR=rgb(255, 255, 255)] Заявка на организацию должна сопровождаться фото- или видеоматериалами.[/COLOR][/QUOTE]<br>" +
            "[COLOR=rgb(255, 255, 255)]• Примечание:[/COLOR][COLOR=rgb(255, 0, 0)] скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).[/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Не раб. ссылка',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]Ссылка на ваши фото/видео материалы повреждена/работает не корректно[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PINN_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Не по форме',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Форма подачи[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]" +
            "• Название вашей организации:<br>" +
            "• История создания:<br>" +
            "• Состав участников:<br>" +
            "• Устав:<br>" +
            "• Описание деятельности:<br>" +
            "• Отличительная визуальная особенность:<br>" +
            "• Как и где можно попасть в вашу организацию:<br>" +
            "• Ссылка на одобренную RP биографию:[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Критерии не соблюдены',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Критерии для создания неофициальной RP организации[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]" +
            "• Минимальный состав участников для создания неофициальной RP организации — 3 человека.<br>" +
            "• Организация должна иметь чёткий род деятельности и свою историю.<br>" +
            "• Описание неофициальной RP организации должно быть составлено грамотно и читабельно, с соблюдением норм русского языка.<br>" +
            "• Минимальный размер шрифта — 15. Разрешённые шрифты: Verdana, Times New Roman.<br>" +
            "• Лидер должен иметь одобренную RP биографию.<br>" +
            "• У организации должна быть отличительная визуальная особенность.<br><br>" +
            "[COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)] все члены организации носят аксессуар — маска зомби.[/COLOR][/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

 {
        title: 'Копипаст',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Запрещено[/COLOR][COLOR=rgb(255, 255, 255)] копировать чужие RolePlay организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Не доработано',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]По истечению [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часов не было доработано[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
    },

    {
        title: 'Под адапт. доработки',
        content:
            "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 165, 0)][I][FONT=times new roman][SIZE=4]На рассмотрении[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[CENTER][QUOTE][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]ВСТАВЬТЕ СЮДА ТЕКСТ ДОРАБОТКИ[/SIZE][/FONT][/COLOR][/QUOTE][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]У вас есть [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 165, 0)][FONT=times new roman][SIZE=4]24[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4] часа на доработку[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX, // Префикс "закрепить"
        status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
        class: 'kf-btn',
        noAutoSubmit: true, // Флаг для отключения автоматической отправки
    },


	];

	$(document).ready(() => {

	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
	addAnswers();

	
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
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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