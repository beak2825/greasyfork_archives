// ==UserScript==
// @name         Полный форумный скрипт | by O. World
// @namespace    https://forum.blackrussia.online/
// @version      2.5.3
// @description  Полный форумный скрипт  | by O. World
// @author       Oxygen World
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jp
// @downloadURL https://update.greasyfork.org/scripts/551616/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20by%20O%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/551616/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20by%20O%20World.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // Отказано
	const ACCEPT_PREFIX = 8; // Одобрено
	const PIN_PREFIX = 2; //  На рассмотрении
	const COMMAND_PREFIX = 10; // Команде проекта
	const CLOSE_PREFIX = 7; // Закрыто
	const DECIDED_PREFIX = 6; // Решено
	const WATCHED_PREFIX = 9; // Рассмотрено
	const TEX_PREFIX = 13; //  Техническому специалисту
	const GA_PREFIX = 12; // Главному администратору
	const SA_PREFIX = 11; // Специальному администратору
	const WAIT_PREFIX = 14; // Ожидание
	const NO_PREFIX = 0;
	const buttons = [
	{
		title: 'Свой ответ',
		content:
		'[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
		"[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
		"*Вставьте текст*<br>" +
		"[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
		"[CENTER][FONT=Georgia][SIZE=4]*Вставьте текст*<br><br>" +
		'[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
	},
	{
        title: ' ᅠᅠ..................... Жалобы на игроков .....................      ',
	},
         {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Рассмотрев вашу жалобу, выношу вердикт - Одобрено. Наказание будет выдано в течении 24 часов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено (обман на слот)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Рассмотрев вашу жалобу, выношу вердикт - Одобрено. Так же хочу подметить, что покупка/продажа слотов в семью запрещена. За саму попытку наказание не следует, но если бы игрок вас не обманул - ваш аккаунт мог бы быть заблокирован. Наказание будет выдано в течении 24 часов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба находится [COLOR=rgb(250, 197, 28)]на рассмотрении.[/COLOR] Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе недостаточно доказательств, подтверждающие нарушения со стороны игрока.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не рабочая ссылка',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ссылка на ваши доказательства не рабочая.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе отсутствуют доказательства.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба составлена не по необходимой форме. Ознакомиться с правилами подачи жалоб на игроков - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=RGB(250, 197, 28)]*кликабельно*[/COLOR][/URL][COLOR=RGB(250, 0 , 0)][/COLOR]<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют нарушения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Исходя из выше приложенных доказательств, нарушений со стороны игрока я не увидел!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Нету в логах',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Нарушения не были найдены в системе логирования.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Жалоба составлена от третьего лица.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствует /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "На ваших доказательствах отсутствует /time.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют тайм-коды',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Предоставленный вами фрапс длится более 3-х минут, вам следует создать копию жалобы и написать тайм коды.<br>" +
            "Пример:<br><br>" +
            "1:02 - Начало сделки.<br>" +
            "1:23 - Условия сделки.<br>" +
            "1:30 - Тайм.<br>" +
            "2:42 - Обмен.<br>" +
            "3:02 - Машина не выгрузилась.<br>" +
            "3:19 - Игрок вышел из игры.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неогр. дс к фам. складу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В описании семьи лидер может ограничить доступ к складу. Пример: запрещается брать более 60 патронов за один раз. Если же лидер предоставляет неограниченный доступ к складу - наказание за взятие большого количества патронов за один раз игрок не получает.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют условия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "На ваших доказательствах отсутствуют условия сделки.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вернул средства',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши средства ранее уже были возвращены игроком.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства загружены в социальную сеть. Вам стоит воспользоваться фото/видео хостингами, такими как Imgur, IBB, Япикс, YouTube и так далее.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва смонтированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства были отредактированы. Для дальнейшего рассмотрения жалобы вам необходимо отпраить ее повторно и прикрепить оригинал.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Должен подать ЛД семьи',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Жалоба должна быть подана лидером семьи!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Требуется фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "На данный тип нарушения требуется иметь фрапс (запись экрана).<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не указан ник игрока',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вы не указали нийнейм игрока, на которого написана данная жалоба.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вердикт был выдан в предыдущей жалобе. Перестаньте создавать копии тем, иначе ваш форумный аккаунт может быть заблокирован!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Займ только банком и без %',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Брать / давать займы разрешается только через перевод в банке. Так же запрещается давать займ под процен. Нарушения отсутствуют.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Игрок заблокирован',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Игрок, на которого написана жалоба уже находится в списке заблокированных игроков.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Тех. специалисту',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Жалоба передана техническому специалисту. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 165, 0)]Тех. специалисту.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: TEX_PREFIX,
            status: true,
          },
            {
        title: '    ................. Жалобы на администрацию ...............                  ' ,
    },
        {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба находится [COLOR=rgb(250, 197, 28)]на рассмотрении.[/COLOR] Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
        },
{
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе недостаточно доказательств, подтверждающие нарушения со стороны администратора.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не рабочая ссылка',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ссылка на ваши доказательства не рабочая.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе отсутствуют доказательства.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства загружены в социальную сеть. Вам стоит воспользоваться фото/видео хостингами, такими как Imgur, IBB, Япикс, YouTube и так далее.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба составлена не по необходимой форме. Ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/'][COLOR=RGB(250, 197, 28)]*кликабельно*[/COLOR][/URL][COLOR=RGB(250, 0 , 0)][/COLOR]<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва смонтированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства были отредактированы. Для дальнейшего рассмотрения жалобы вам необходимо отпраить ее повторно и прикрепить оригинал.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют нарушения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Исходя из выше приложенных доказательств, нарушений со стороны администратора я не увидел!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вердикт был выдан в предыдущей жалобе. Перестаньте создавать копии тем, иначе ваш форумный аккаунт может быть заблокирован!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
         {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Жалоба составлена от третьего лица.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Требуется фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "На данный тип нарушения требуется иметь фрапс (запись экрана).<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Будет проведена беседа',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "С администратором будет проведена беседа. Ваше наказание будет снято.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Будет проведена работа',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "С администратором будет проведена необходимая работа. Благодарим за обращение!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Предоставил док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Администратор предоставил доказательства. Наказание выдано верно!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Будут приняты меры',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "К администратору будут приняты необходимые меры. Благодарим за обращение!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заместителю ГА',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 51, 51)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба передана Заместителю Главного администратора. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Заместителю ГА.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Главному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 51, 51)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба передана Главному администратору. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Главному администратору.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'Руководству модерации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 240)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба передана Руководству модерации. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: COMMAND_PREFIX,
            status: true,
          },
          {
            title: 'Специальному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 51, 51)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба передана Специальному администратору. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Специальому администратору.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: SA_PREFIX,
            status: true,
          },
           {
        title: ' ᅠᅠ.................... Жалобы на лидеров ....................      ',
	},
    {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба находится [COLOR=rgb(250, 197, 28)]на рассмотрении.[/COLOR] Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе недостаточно доказательств, подтверждающие нарушения со стороны лидера.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва смонтированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства были отредактированы. Для дальнейшего рассмотрения жалобы вам необходимо отпраить ее повторно и прикрепить оригинал.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не рабочая ссылка',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ссылка на ваши доказательства не рабочая.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вердикт был выдан в предыдущей жалобе. Перестаньте создавать копии тем, иначе ваш форумный аккаунт может быть заблокирован!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей жалобе отсутствуют доказательства.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваши доказательства загружены в социальную сеть. Вам стоит воспользоваться фото/видео хостингами, такими как Imgur, IBB, Япикс, YouTube и так далее.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют нарушения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Исходя из выше приложенных доказательств, нарушений со стороны лидера я не увидел!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Жалоба составлена от третьего лица.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Требуется фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "На данный тип нарушения требуется иметь фрапс (запись экрана).<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша жалоба составлена не по необходимой форме. Ознакомиться с правилами подачи жалоб на лидеров - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/'][COLOR=RGB(250, 197, 28)]*кликабельно*[/COLOR][/URL][COLOR=RGB(250, 0 , 0)][/COLOR]<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В обжалование наказаний',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вам нужно обратиться в раздел Обжалование наказаний, так как с момента выдачи наказания прошло более 48 часов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Будет проведена беседа',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "С лидером будет проведена беседа.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Будет проведена работа',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "С лидером будет проведена необходимая работа. Благодарим за обращение!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'Будут приняты меры',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "К лидеру будут приняты необходимые меры. Благодарим за обращение!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Предоставил док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Лидер предоставил доказательства. Наказание выдано верно!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
           {
        title: ' ᅠᅠ............... Обжалование наказаний ...............      ',
	},
	 {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваше обжалование находится на рассмотрении. Ожидайте ответа в данной теме. Не нужно создавать копии данной темы, ответ может занять некоторое время.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Рук-во не готово снизить наказание',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Руководство сервера не готово снизить вам наказание!<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено (снять полностью)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Руководством сервера было принято решение о полном снятии вашего наказания. Впредь не нарушайте, не повторяйте подобных ошибок и ознакамливайтесь с правилами серверов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено (сократить)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Руководством сервера было принято решение о сокращении вашего наказания. Впредь не нарушайте, не повторяйте подобных ошибок и ознакамливайтесь с правилами серверов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отказано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В обжаловании отказано.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваше обжалование составлено не по форме. Ознакомиться с правилами подачи обжалования наказаний - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=RGB(250, 197, 28)]*кликабельно*[/COLOR][/URL][COLOR=RGB(250, 0 , 0)][/COLOR]<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обжалование составлено от третьего лица.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },{
            title: 'Должна написать обм. сторона',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вам следует любыми способами связаться с игроком, обманутым вами. В случае его согласия на снятие вашей блокировки с учетом возврата имущества он должен оформить обжалование в этом разделе.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Наказание не подл. обж.',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Выданное вам наказание не подлежит обжалованию.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на администрацию',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вам нужно обратиться в раздел жалоб на администрацию, так как с момента выдачи наказания прошло менее 48 часов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Главному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 51, 51)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обжалование передано Главному администратору. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Главному администратору.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'Специальному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 51, 51)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обжалование передано Специальному администратору. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Специальому администратору.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: SA_PREFIX,
            status: true,
          },
          {
            title: 'Руководству модерации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 240)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обжалование передано Руководству модерации. Ожидайте ответа в данной теме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: COMMAND_PREFIX,
            status: true,
          },
 
 {
        title: ' ᅠᅠ...... Перенаправления в другой раздел ......      ',
	},
    {
            title: 'В ЖБ на сотрудников',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на сотрудников фракции.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на СС',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на Старший состав фракции.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на игроков',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на игроков.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на администрацию',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на администрацию.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на лидеров',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на лидеров фракции.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В ЖБ на Тех. специалистов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Обратитесь в раздел жалоб на Технических специалистов.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'В обжалование наказаний',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вам нужно обратиться в раздел Обжалование наказаний.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не тот сервер',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Вы ошиблись сервером, переношу вашу жалобу в нужный вам раздел.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: WAIT_PREFIX,
            status: false,
          },
           {
        title: ' ᅠᅠ..................... RolePlay биографии .....................      ',
	},
    {
            title: 'Ники в заголовке и в РПБ отличаются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Никнеймы в заголовке и в 1 пункте вашей RolePlay биографии отличаются.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Возраст и дата отличаются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Возраст вашего персонажа или возраст его родных отличается от даты рождения.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Заголовок составлен не по необходимой форме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay биография составлена не по необхоимой форме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствует логика',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей RolePlay биографии отсутствует логика.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Скопирована',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay биография частисно или полностью скопирована.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Перс. обладает сверхспособностями',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваш персоонаж не должен обладать теми или иными сверхспособостями.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Присутствуют грам. ошибки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей RolePlay биографии содержатся грамматические ошибки.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Имя известн. личности',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Имя вашего игрового персоонажа является именем известной личности.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay биография была рассмотрена, и получает статус - Одобрено.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Недост. инф. // тему необх. открыть самому',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "В вашей RolePlay биографии недостаточно информации в каждом из всех пунктов. Вам выдается 24 часа на доработку.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
        title: ' ᅠᅠ Неофициальные RolePlay организации       ',
	},
       {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша неофициальная RolePlay оранизация составлена не по необхоимой форме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Оффтоп',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша неофициальная RolePlay оранизация получает статус - Отказано.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша неофициальная RolePlay организация была рассмотрена, и получает статус - Одобрено.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
        title: ' ᅠᅠ..................... RolePlay ситуации .....................      ',
	},
       {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay ситуация составлена не по необхоимой форме.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Оффтоп',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay ситуация получает статус - Отказано.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/COLOR][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(209, 213, 216)] [COLOR=rgb(250, 0, 0)]Отказано, закрыто.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154)',
            content:
            '[I][COLOR=rgb(255, 0, 0)][CENTER][FONT=Georgia][SIZE=4]Доброго времени суток,[/SIZE][/FONT][/CENTER][/COLOR][CENTER][FONT=Georgia][SIZE=4] [COLOR=RGB(245, 245, 245)]уважаемый (-ая) {{user.mention}}<br>' +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url]<br>" +
            "Ваша RolePlay ситуация была рассмотрена, и получает статус - Одобрено.<br>" +
            "[url=https://ibb.co/jkMq9hkp][img]https://i.ibb.co/5h8CXTh7/1619558447629-2.png[/img][/url][/SIZE][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=Georgia][SIZE=4][COLOR=RGB(50, 205, 50)] [COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR]<br><br>" +
             '[I][COLOR=rgb(255, 0, 0)]Приятной игры и времяпровождения на сервере YAKUTSK (72)[/COLOR][/I][/COLOR][I][/i][/size][I][COLOR=RGB(209, 213, 216)][/color][/i][/font][I][COLOR=RGB(209, 213, 216)][/color][/i][/center][I][COLOR=RGB(209, 213, 216)][FONT=Georgia][SIZE=4][/size][/font][SIZE=4][/size][/color][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
 
            
 
	];
	
	
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(250, 197, 28);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154);')
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
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