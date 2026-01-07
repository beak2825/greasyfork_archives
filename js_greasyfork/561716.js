// ==UserScript==
// @name Для Руководства IZHEVSK
// @namespace https://forum.blackrussia.online
// @version 0.7.0
// @description kye
// @author Diego_Kang
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/561716/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20IZHEVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/561716/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20IZHEVSK.meta.js
// ==/UserScript==

(function() {
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
	"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "Твой текст <br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]'
    },
    {
        title: 'ЖАЛОБЫ НА АДМИНИСТРАЦИЮ',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Запрос док-в',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    '[B][CENTER][COLOR=#FFFF00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'На рассмотрении',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    '[B][CENTER][COLOR=#FFFF00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
        title: 'Одобробренные / Закрыто',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Наказание снято +беседа',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.<br>Наказание будет снято.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    '[B][CENTER][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>'+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание будет снято',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Наказание будет снято.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание будет пол снято',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше наказание будет полностью снято.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Проинструктирован',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Спасибо за обращение. Администратор будет проинструктирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Беседа с адм',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Строгая беседа с адм',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена строгая беседа.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Беседа с адм ответ жб исправ.',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба была одобрена.<br>Ответ в жалобе будет исправлен.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Администратор ошибся',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Администратор допустил ошибку. Приносим извинения за предоставленные неудобства.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Администратор снят',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Администратор снят.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не является администратором',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Данный игрок не является администратором.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Проф. беседа',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]С администратором будет проведена профилактическая беседа.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Инфа будет проверена',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Информация будет проверена, в случае подтверждения информации администратор получит соответствующее наказание.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Адм получит наказание',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Администратор получит соответсвующее наказание.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не помог с реп',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]У администратора произошли проблемы, из-за которых он вам не смог помочь. Приносим извинения за предоставленные неудобства.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не успел зафиксировать наруш',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]К сожалению администратор не успел зафиксировать наказание, поэтому наказание игроку не было выдано. Балта нет.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказ будет перевыдано',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше наказание было снято / перевыдано чуть позже, когда администратор увидел ошибку.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказ. сокращено из за вип',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прежде чем составлять подобные жалобы, нужно грамотно изучить мод игры. Игрокам с VIP статусом наказание снижается автоматически при его выдачи. То есть, администратор выдает наказание по регламенту, а система сама, исходя из пропорций снижает наказание. <br> Блата тут нет, нарушений тоже.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Если не отпишут заявки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Создайте повторную заявку, если не отпишут в течении 24 часов, то напишите повторную жалобу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет исправлены заявки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Скоро будет все исправлено.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет рассмотрены заявки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Скоро будет все рассмотрено..[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: RESHENO_PREFIX,
    status: false,
    },
    {
    title: 'Скоро будет рассмотрены (жалобы/обж/био/сит)',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Скоро будет рассмотрены (жалобы/обж/био/сит)',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'Отказанные жалобы',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Наказание выдано верно',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][color=rgb(255,0,0)]«Общие правила серверов»[/color][/URL][/CENTER]"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание выдано верно по жб',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][сolor=rgb(255,0,0)]«Общие правила серверов»[/color].[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/3429349/'][color=rgb(255,0,0)]«правилами подачи жалоб на администрацию»[/color][/URL].[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех.спец',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/Сервер-№85-izhevsk.3746/'][color=rgb(32,178,170)]«Жалобы на технических Специалистов IZHEVSK»[/color][/URL].[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В тех раздел',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Обратитесь со своей проблемой в [URL='https://forum.blackrussia.online/forums/Технический-раздел-izhevsk.3747/'][color=rgb(32,178,170)]«Технический раздел IZHEVSK»[/color][/URL].[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Вы ошиблись разделом/сервером',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '3-е лицо',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отсутствуют доки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Прикрепление ссылки кф',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Недостаточно доказательств жб',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки обрезанные',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не рабоч доки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Не работают доказательства.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Смайлик клоуна, оск в жб',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нарушений со стороны адм нет',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не достал из воды/чин',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Администратор не обязан доставать транспорт из воды, чинить и заправлять его. Пункт гласит о том, что администратор на свое усмотрение может помочь игроку, также отклонить просьбу.<br><br>Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Дублирование темы',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Дублирование темы',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'прошло время +в обж',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>Обратитесь в раздел Обжалование наказаний.<br>Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В ОБЖ',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Если хотите как-то снизить свое наказание, то можете написать в раздел [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3768/'][color=rgb(255,0,0)]«Обжалование наказаний»[/color][/URL], но не факт, что обжалование одобрят.<br>Перед написанием обжалования внимательно ознакомьтесь с правилами подачи заявок на обжалование наказания.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Бан IP',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Перезагрузите роутер или переключите на другой провайдер, если блокировка IP останется, то напишите повторную жалобу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '48 часов',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]С момента получения наказание прошло 48 часов.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки из соц сети',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Доказательства из социальных сетей не принимаются. Вам нужно загрузить доказательств на фото/видео хостинг.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /time',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]В доказательствах нету /time.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /myreports',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]В доказательствах нету  /myreports.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по теме',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ гугл/ютуб',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Доступ к доказательствам закрыт, откройте доступ после чего напишите жалобу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Тема уже на рассмотрении',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Подобная жалоба уже закреплена на рассмотрение. Ожидайте ответа там и не создавайте подобных, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Системные наказания',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Наказания полученные системой, администрацией не снимаются.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'Передача жб',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Рук Модер ДС',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color].[/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Главному Администратору[/color] - @Anna_Provinceva [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'ЗГА',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Заместителям Главного Администратора[/color] - @Michael Tratyu,@Charden Forester [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER]Ваша жалоба передана [COLOR=rgb(255,255,0)]Специальной администрации.[/color][Color=Orange]На рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: COMMAND_PREFIX,
    status: true,
    },
    {
        title: 'ОБЖАЛОВАНИЕ НАКАЗАНИЙ',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'На рассмотрении',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    '[CENTER][Color=#FFFF00]На рассмотрении...[/Color][/CENTER][/B][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Отказано',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Мы понимаем ваши эмоции, но, к сожелению, не можем пойти на встречу.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование составлено не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-на%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][color=rgb(255,0,0)]«Правила подачи заявки на обжалование наказания»[/color][/URL].[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жб на адм',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратится в раздел жалоб на администрацию.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено + полностью снято',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех.спец',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ППВ',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Воспользуйтесь одним из способов восстановления вашего игрового аккаунта, затем создайте повторное обжалование и прикрепите все необходимые доказательства, предварительно закройте конфиденциальную информацию.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено до мин.срока',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет снижено до минимального срока.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Уже снизили',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вам итак уже снизили наказание.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'У вас мин.нак',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Вам итак выдано минимальное наказание.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не готовы',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Администрация не готова снизить вам наказание.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '3 лицо',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Обжалование составлено от 3-го лица, рассмотрению не подлежит.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прикрепите окно бана при входе в игру.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив, ПИВ, Махинации (отказ)',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование не будет рассматриваться и будет закрыто так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Скриншот переписки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прикрепите скриншот с перепиской.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана +скрин переписки',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Прикрепите окно бана при входе в игру. И скриншот переписки.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'NonRP обман для обж',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Для обжалования NonRP обмана вам нужно:<br>1. Связаться с игроком. которого Вы обманули;<br>2. Договориться о возвращении имущества;<br>3. Написать обжалование, в которого вы предоставляете: окно блокировки, VK обоих сторон, ссылку жалобы на вас (отправляет обманутая сторона вам), скриншот вашей переписки, что вы договорились;<br>4. Вернуть имущество обманутой стороне.<br>В данный момент вы не выполнили все пункты, которые расписаны выше.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'NonRP обман вк отписать',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваша задача отписать мне в вконтакте: <br>[QUOTE]https://vk.com/id567555273 - Diego Kang.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br><br>"+
    "[B][CENTER][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>"+
    '[B][CENTER][COLOR=#FFFFFF]Приятной игры и времяпровождение на сервере [COLOR=#20B2AA]IZHEVSK[/COLOR].[/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Рук Модер ДС',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование будет передано [Color=Red]Главному Администратору[/color] - @Anna_Provinceva [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(255,255,0)]Специальной администрации.[/color][Color=Orange]На рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта ',
    content:
    "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: COMMAND_PREFIX,
    status: true,
    },
    {
        title: 'ЖАЛОБЫ НА ИГРОКОВ',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
	  title: 'Не по форме',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: 'Заголовок не по форме',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Заголовок у Вашей жалобы составлен не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет док-во',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений логи',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В системе логирование нарушений не найдено.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'От 3 лица',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно док-во',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеют дополнительные доказательства прикрепите.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Соц. сети',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Нет тайм-кодов',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нету /time',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Нужен фрапс |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Неполный фрапс/нет условии сделки',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Не работают док-во',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Дока-во отредактированы',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Ошиблись разделом',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом/сервером, переподайте жалобу в нужный раздел.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Прошло 72 часа',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'На рассмотрение',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
     prefix: PIN_PREFIX,
     status: true,
	},
	{
        title: 'Передача жб',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
     title: 'ГА',
     content:
       "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       "[CENTER]Ваша жалоба будет передана [Color=Red]Главному Администратору[/color] - @Anna_Provinceva [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
       "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
     prefix: GA_PREFIX,
     status: true,
    },
    {
     title: 'Тех.спец',
     content:
       "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
       "[CENTER]Ваша жалоба была передана техническому специалисту сервера, пожалуйста ожидайте ответа...[/CENTER]<br><br>"+
       "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
	{
        title: 'Правила РП процесса',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
	  title: 'NRP',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.13 | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DB',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.13 | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'TK',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'SK',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'MG',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.18  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'DM',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Mass DM',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'NonRP Drive',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.03 | [color=lavender] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [color=red]  | Jail 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Чат',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
	  title: 'КАПС',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ОСК',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ОСК/УПОМ РОДНИ',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.</br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.</br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]</br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Флуд',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Слив чата',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов[color=red]  | Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Выдача за адм',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 15-30 <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Заблуждение (команды)',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.11 | [color=lavender] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Музыка в Войс',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.14 | [color=lavender] Запрещено включать музыку в Voice Chat[color=red]  | Mute 60 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Политика',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование[color=red]  | Mute 120 минут / Ban 10 дней. <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Транслит',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.20 | [color=lavender] Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Промокоды',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.21 | [color=lavender] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]  | Ban 30 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Объявления в госс',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.22 | [color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Сбив анимки',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.55 | [color=lavender] Запрещается багоюз связанный с анимацией в любых проявлениях. [color=red]  | Jail 120 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Арест в аукцион',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.50 | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [color=red]  | Ban 7-15 дней + увольнения из фракции<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ООС угрозы',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Mute 120 минут / Ban 15-30 дней <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.31 | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red] | Ban 7 дней / PermBan <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Игровой АКК',
        style: 'width: 97%; background: #20B2AA; box-shadow: 0px 0px 5px #fff',
    },
    {
	  title: 'Обход системы',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.21 | [color=lavender] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red]  | Ban 15-30 дней / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Слив склада',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.21 | [color=lavender] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Амаральные действия',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.08 | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP обман',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.05 | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Читы',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.22 | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Замена объявы',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  [color=lavender] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP edit',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP эфир',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Арест в казино/аукцион',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оскорбление адм',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Выдача за адм',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7 - 15 <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Nick_Name оск',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
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

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACСEPT_PREFIX, false));
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
            4 < hours && hours <= 11
            ? 'Доброе утро, уважаемый(ая)'
            : 11 < hours && hours <= 15
            ? 'Добрый день, уважаемый(ая)'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер, уважаемый(ая)'
            : 'Доброй ночи, уважаемый(ая)',
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