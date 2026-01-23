// ==UserScript==
// @name         Chief Technical Specialists
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Для руководства технического отдела и комфортной модерации разделов
// @author       Raf_Piatigorsky
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license  MIT
// @collaborator Yuki_Flyweather
// @icon https://avatars.mds.yandex.net/i?id=20140c59f311d4812014caadc471506e7ce49ad4-11907031-images-thumbs&n=13
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/563675/Chief%20Technical%20Specialists.user.js
// @updateURL https://update.greasyfork.org/scripts/563675/Chief%20Technical%20Specialists.meta.js
// ==/UserScript==

  (function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
  const ODOBRENO_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс на рассмотрении
	const COMMAND_PREFIX = 10; // префикс команде проекта
  const COMMAND_PREFIX1 = 45; // префикс команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // префикс техническому специалисту
	const WATCHED_PREFIX = 9; // префикс рассмотрено
	const WAIT_PREFIX = 14; // префикс ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0; // префикс отсутствует
	const buttons = [

{
  "title": "--Заготовки ответов--",
  "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin-top: 0px; margin-bottom: 5px; margin-left: auto; margin-right: auto;",
  "class": "answer-button"
},
{
	title: 'Приветствие',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER] текст [/CENTER]',
},
{
	title: 'Дубликат',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема является дубликатом вашей предыдущей темы, ссылка на тему - <br>Пожалуйста, <b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b>.<br><br>" +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
},
{
  title: 'Переношу в нужный раздел',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Данная тема никак не относится к этому разделу.[/FONT][/B]' +
  '[CENTER][B][FONT=verdana]Переношу ваше обращение в соответствующий для этого раздел.[/FONT][/B][/CENTER]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
},
{
  "title": "--Рассмотрение жалоб на техов--",
  "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin: 5px auto;",
  "class": "answer-button"
},
{
  title: 'На рассмотрении',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Тема взята в работу и закреплена, пожалуйста, ожидайте ответа в ней и не создавайте аналогичные обращения.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Рассмотрение темы может занять определенное время.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
    prefix: PIN_PREFIX,
		status: true,
},
{
  title: 'Выдано верно',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Хотелось бы напомнить, что Вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  "[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana]Рекомендуем вам более детально ознакомиться с правилами проекта - [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/'][I]клик [/I][/URL](кликабельно)[/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Беседа с техом',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]С техническим специалистом будет проведена строгая профилактическая беседа.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Приносим свои извинения за предоставленные неудобства. Благодарим вас за обращение.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Рассмотрено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: WATCHED_PREFIX,
	status: false,
},
{
  title: 'Продал ИВ(банк)',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. Было зафиксировано, что вы занимались продажей внутриигровой валюты через банковскую систему, что прямо нарушает правила проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Стоит отметить, что данное наказание не подлежит обжалованию и дальнейшая разблокировка аккаунта невозможна.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Продал ИВ(трейд)',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. Было зафиксировано, что вы занимались продажей внутриигровой валюты через систему трейда, что прямо нарушает правила проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Стоит отметить, что данное наказание не подлежит обжалованию и дальнейшая разблокировка аккаунта невозможна.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Купил ИВ игрока(банк)',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. Было зафиксировано, что на ваш банковский счет поступил перевод от продавца игровой валюты. Средства вы успешно сняли со счета, что говорит о том, что вы знали заранее о предстоящем поступлении средств. Данные действия прямо нарушают правила проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Стоит отметить, что данное наказание не подлежит обжалованию и дальнейшая разблокировка аккаунта невозможна.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Купил ИВ игрока (трейд)',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. Было зафиксировано, что вы получили денежные средства от продавца игровой валюты через трейд, что строго запрещено правилами проекта. Данные действия прямо нарушают правила проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Стоит отметить, что данное наказание не подлежит обжалованию и дальнейшая разблокировка аккаунта невозможна.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Покупка ИВ у бота',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. Было зафиксировано, что вы получили денежные средства от бота-продавца игровой валюты. Стоит отметить, что боты передают средства не случайным людям, а четко установленным продавцом клиентам. Данные действия прямо нарушают правила проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Стоит отметить, что данное наказание не подлежит обжалованию и дальнейшая разблокировка аккаунта невозможна.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Трансфер 4.05',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. На вашем аккаунте был зафиксирован трансфер имущества между игровыми аккаунтами, что является нарушением правил проекта пункта 4.05, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)][B][FONT=verdana]4.05[/FONT][/B][/COLOR][FONT=verdana][B]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [/B][COLOR=rgb(255, 0, 0)][B]Ban 15 - 30 дней / PermBan[/B][/COLOR][/FONT][B][FONT=verdana]<br>Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Махинации со взломом',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]После проверки доказательств технического специалиста и анализа системы логирования, выявлено, что технический специалист выдал наказание корректно. В ходе проверки установлено, что вами было получено имущество от аккаунта, который был подвержен взлому, что расценивается как участие в махинациях. Махинации - совокупность действий, направленных на получение выгоды нечестным путем.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana]Такие действия нарушают правила проекта и влекут за собой блокировку как злоумышленника, так и лица, которое принимало имущество, полученное нечестным путём.[/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Наказание было выдано верно.[/COLOR] [/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Запрос привязок',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: https://t.me/id_users_bot<br>[/FONT][/COLOR][/B][COLOR=rgb(255, 255, 255)][FONT=verdana][B]2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>[/B][/FONT][/COLOR][B][COLOR=rgb(255, 255, 255)][FONT=verdana]3. Укажите почту, которая привязана к аккаунту[/FONT][/COLOR][/B][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][I][COLOR=rgb(247, 218, 100)][FONT=verdana]Ожидаю ваш ответ.[/FONT][/COLOR][/I][/CENTER]",
  prefix: PIN_PREFIX,
	status: true,
},
{
  title: 'Смена пароля',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Сбросьте пароль через любую из привязок ВКонтакте или Telegram, после чего, убедительная просьба, сообщить об этом в данной теме. Прикреплять скриншот смены пароля НЕ нужно.<br><br>Ожидаю вашего ответа.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/I][/COLOR][/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
  title: 'Чужая привязка',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Нет привязок',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, на вашем аккаунте отсутствуют какие-либо установленные привязки (E-mail, Telegram или ВКонтакте).[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]В такой ситуации разблокировка аккаунта невозможна, так как отсутствует подтверждение, что именно Вы являетесь владельцем аккаунта.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Также без привязок вы не сможете восстановить или поменять пароль, из-за чего злоумышленник, получивший доступ к вашему аккаунту, сможет продолжать играть на нём без ограничений.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Мы настоятельно рекомендуем при создании нового аккаунта сразу устанавливать все доступные меры защиты, чтобы подобного больше не произошло.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Приносим извинения за возможные неудобства и благодарим за понимание.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Нет ответа от игрока',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, обратной связи от вас в данной теме так и не поступило.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Если Ваша проблема по-прежнему не решена, пожалуйста, создайте новое обращение.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Не подлежит обж',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Вы получили блокировку за серьезное нарушение, за которое мы не в праве и не в силах снизить срок вашего наказания.[/CENTER][/COLOR][/FONT]<br>' +
  "[CENTER][B][FONT=verdana]Данные действия основываются на общий регламент. Рекомендуем вам ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/'][I][COLOR=rgb(251, 160, 38)]правилами обжалования нарушения при выдаче наказания от технического специалиста[/COLOR][/I][/URL] (кликабельно).[/FONT][/B][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'В обж одобрено',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Мы рассмотрели ваше обращение и пришли к выводу, что срок блокировки будет снижен.[/CENTER][/COLOR][/FONT]<br>' +
  "[CENTER][B][FONT=verdana]Рекомендуем вам ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/'][I][COLOR=rgb(251, 160, 38)]правилами обжалования нарушения при выдаче наказания от технического специалиста[/COLOR][/I][/URL] (кликабельно).[/FONT][/B][/CENTER]<br>" +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Рассмотрено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: WATCHED_PREFIX,
	status: false,
},
{
  title: 'В обж отказано',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]На данный момент мы не готовы пойти к вам на встречу и снизить срок блокировки аккаунта.[/CENTER][/COLOR][/FONT]<br>' +
  "[CENTER][B][FONT=verdana]Рекомендуем вам ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/'][I][COLOR=rgb(251, 160, 38)]правилами обжалования нарушения при выдаче наказания от технического специалиста[/COLOR][/I][/URL] (кликабельно).[/FONT][/B][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Нет окна блокировки',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки с фотохостинга или видеохостинга.<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Док-ва из соц.сети',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Доказательства из социальных сетей <u>не принимаются и не подлежат рассмотрению</u>.[/CENTER]<br><br>" +
  "[CENTER]Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Истек срок подачи',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Данные жалобы не подлежат рассмотрению и предоставлению доказательств.[/FONT][/COLOR][/B][/CENTER]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Форма подачи жб',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Правила раздела',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел, составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно, чтобы оно содержало лишь никнейм технического специалиста и причину.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствуют оффтоп/оскорбления.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Не относится ЖБ ТС',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста, будьте добры, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I]клик[/I][/URL] (кликабельно)[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Аккаунт будет разблокирован',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]После дополнительной проверки мы пришли к мнению, что блокировка вашего игрового аккаунта была выдана ошибочно.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Мы приносим свои извинения за предоставленные неудобства. Ваш аккаунт будет разблокирован в течение 24 часов с момента публикации выноса данного вердикта.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Рассмотрено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: WATCHED_PREFIX,
	status: false,
},
{
  title: 'Верные привязки(разбан)',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Вы предоставили верные привязки к вашему игровому аккаунту и успешно сменили пароль.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваш аккаунт будет разблокирован в течение 24 часов с момента публикации выноса данного вердикта.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Решено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: DECIDED_PREFIX,
	status: false,
},

{
  "title": "--Для куратора и заместителя--",
  "dpstyle": "oswald: 3px; color: #fff; background: #7B68EE; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin: 5px auto;",
  "class": "answer-button"
},

{
  title: 'ЖБ передана КП',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша жалоба передана на рассмотрение [/COLOR][COLOR=rgb(255, 255, 0)]команде проекта[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа. [/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=verdana]Ожидайте вердикта от команды проекта[/FONT][/B][/COLOR][/CENTER]',
  prefix: COMMAND_PREFIX,
	status: true,
},
{
  title: 'ОБЖ передано КП',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваше обжалование передано на рассмотрение [/COLOR][COLOR=rgb(255, 255, 0)]команде проекта[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа. [/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=verdana]Ожидайте вердикта от команды проекта[/FONT][/B][/COLOR][/CENTER]',
  prefix: COMMAND_PREFIX,
	status: true,
},
{
  title: 'ЖБ передана КТС',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша жалоба передана на рассмотрение [/COLOR][COLOR=rgb(251, 160, 38)]Куратору Технических Специалистов[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа. [/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
  prefix: PIN_PREFIX,
	status: true,
},
{
  title: 'ОБЖ передано КТС',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваше обжалование передано на рассмотрение [/COLOR][COLOR=rgb(251, 160, 38)]Куратору Технических Специалистов[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа. [/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
  prefix: PIN_PREFIX,
	status: true,
},
{
  title: 'Жб передана заместителю',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша жалоба передана на рассмотрение [/COLOR][COLOR=rgb(251, 160, 38)]Заместителю Куратора Технических Специалистов[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа. [/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
  prefix: PIN_PREFIX,
	status: true,
},
{
  title: 'ЖБ передана теху',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша жалоба передана на рассмотрение [/COLOR][COLOR=rgb(251, 160, 38)]техническому специалисту[/COLOR][COLOR=rgb(255, 255, 255)]. Пожалуйста, ожидайте ответа.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
  prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'ОБЖ ЧСТ одобрено',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Мы рассмотрели ваше обращение и пришли к выводу, что срок черного списка технический специалистов будет снят.[/CENTER][/COLOR][/FONT]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Рассмотрено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: WATCHED_PREFIX,
	status: false,
},
{
  title: 'ОБЖ ЧСТ отказано',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]На данный момент мы не готовы пойти к вам на встречу и снять срок черного списка технических спеициалистов.[/CENTER][/COLOR][/FONT]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
  "title": "--Работа с техническим отделом--",
  "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin: 5px auto;",
  "class": "answer-button"
},
{
	title: 'Имущество восстановлено',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.[/CENTER]<br>" +
	'[CENTER]После активации восстановления от команды проекта используйте команды: [COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=verdana]Ожидайте вердикта от команды проекта[/FONT][/B][/COLOR][/CENTER]',
	prefix: COMMAND_PREFIX,
  status: true,
},
{
	title: 'Форма подачи ТР',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>" +
  "[CODE]01. Ваш игровой никнейм:<br>" +
  "02. Сервер, на котором Вы играете:<br>" +
  "03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>" +
  "04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>" +
  "05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не относится ТР',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к техническому разделу.<br> Пожалуйста, будьте добры, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I]клик[/I][/URL] (кликабельно)[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, прикрепив доказательства с фотохостинга или видеохостинга<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нерабочая ссылка',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, ссылка на ваши прикрепленные доказательства недоступна или не работает.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Пожалуйста, отправьте новое обращение, убедившись, что ссылка на  доказательства работает и содержит качественные фотографии или видеозаписи.[/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Док-ва из соц.сети',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Доказательства из социальных сетей <u>не принимаются и не подлежат рассмотрению</u>.<br><br>Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила раздела',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела, в котором Вы создали тему, поскольку Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Передача логисту',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта, пожалуйста, ожидайте ответ в данной теме.[/CENTER]<br><br>" +
	'[CENTER]Создавать новые темы с данной проблемой не нужно.[/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/FONT][/B][/CENTER]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Забыл пароль',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В решении данной проблемы вам могут помочь только установленные привязки на аккаунте.[/CENTER][/B][/COLOR]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]Вы можете через специализированного бота в привязанных социальных сетях восстановить доступ к игровому аккаунту, сбросив пароль через окно "ввода пароля" при входе в игру или же поменяв пароль в самом боте. Если же на вашем игровом аккаунте отсутствуют привязки — мы ничем не сможем вам помочь, ибо каждый игрок несёт ответственность за свой игровой аккаунт и за игровые ценности на нём.[/CENTER][/B][/COLOR]<br>' +
  "[CENTER]Помощник Кирилл (Telegram) - [I][URL='https://t.me/br_helper_bot']клик[/URL][/I] (кликабельно)[/CENTER]<br>" +
  "[CENTER][B][FONT=verdana]BLACK RUSSIA - Мобильная онлайн-игра (ВКонтакте) - [URL='https://vk.com/blackrussia.online'][I]клик [/I][/URL](кликабельно)[/FONT][/B][/CENTER]<br><br>" +
  '[CENTER][COLOR=rgb(255, 255, 255)][B]После регистрации игрового аккаунта мы настоятельно рекомендуем каждому пользователю обезопасить свой игровой аккаунт всеми возможными соответствующими привязками, дабы в дальнейшем не попадать в подобные ситуации и не попадаться на несанкционированный вход со стороны злоумышленников.[/B][/COLOR][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][B] Мы не сбрасываем пароли и не отвязываем возможно утерянные привязки от игровых аккаунтов.[/B][/COLOR][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропало имущество(доп.инфа)',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>4. Дата покупки;<br>5. Способ приобретения (у игрока, в магазине или через донат;<br>6. Видеофиксация покупки (если присутствует);<br>7. Никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share [/CENTER]<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нет PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
  content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта.[/CENTER]<br>" +
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.[/CENTER]<br>" +
	"[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>" +
  '[CENTER][COLOR=rgb(255, 255, 0)]Передано команде проекта.[/COLOR][/CENTER]',
	prefix: COMMAND_PREFIX1,
	status: true,
},
{
	title: 'Известно КП',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена.<br>Спасибо за Ваше обращение![/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема, с которой вы столкнулись, не является багом или ошибкой сервера.[/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера.[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на адм',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Обратитесь в раздел 'Жалобы на администрацию' вашего сервера.<br>Форма для подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']клик[/URL][/I] (кликабельно)[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на лидеров',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на Лидеров' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']клик[/URL][/I] (кликабельно)[/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на игроков',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на игроков' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']клик[/URL][/I] (кликабельно)[/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Обжалования',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL][/I] (кликабельно)[/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: [/CENTER]<br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +
	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: [/CENTER]<br><br>" +
	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/CENTER]<br>'+
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Перенаправление в поддержку',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В том случае, если у вас произошла одна из указанных проблем:[/COLOR][/B][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Баланс доната (BC) стал отрицательным.<br> 2. Донат не был зачислен на аккаунт.<br> 3. Донат был зачислен не в полном объеме.<br> 4. Отсутствие подарка при подключении или продлении тарифа Tele-2.<br> 5. Частые переподключения к серверу.[/FONT][/COLOR][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Вам в срочном порядке необходимо обратиться в техническую поддержку нашего проекта https://vk.com/br_tech (ВКонтакте) или https://t.me/br_techBot (Telegram).[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сим-карта',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=4][FONT=Veranda][FONT=verdana][COLOR=rgb(255, 255, 255)][B]Если вы приобрели тариф Black Russia, но награды не были зачислены или у Вас не получается активировать номер с тарифом Black Russia , тогда [/B][I][B]убедитесь в следующем:[/B][/I][/COLOR][/FONT][/FONT][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]1. У вас тариф Black Russia, а не другой тариф, например, тариф Black[/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]2. Номер активирован.[/COLOR][/FONT][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]3. После активации номера [U]прошло более 48-ми часов.[/U][/COLOR][/FONT][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если пункты выше не описывают вашу ситуацию в обязательном порядке обратитесь в службу поддержки[I] для дальнейшего решения:[/CENTER][/I][/COLOR][/FONT]' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/CENTER][/COLOR][/FONT][/B]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Хочу стать адм/хелп',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Технические специалисты не принимают решения по назначению на должности.<br>Для этого есть раздел заявок на форуме - [I][URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']клик[/URL][/I] (кликабельно), где вы можете ознакомиться с актуальными заявками и формами подачи.<br>Приятной игры и удачи в карьерном росте![/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Предложение по улучш.',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме.<br>Если вы хотите предложить улучшение, пожалуйста, перейдите в соответствующий раздел.<br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нужны все прошивки',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.[/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Тестерам',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукц/маркет',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с /time в новой теме<br><br>Если же вещи пропали с маркетплейса, значит их никто не купил, вам следует забрать их с ПВЗ (пункта выдачи заказов) в течение 7 дней, иначе предметы системно уничтожатся.[/CENTER]<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Отвязка привязок',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Удалить установленные привязки на вашем аккаунте не представляется возможным ни нам, ни команде проекта. [/CENTER][/FONT][/COLOR][/B]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Бывают случаи, когда злоумышленник, получив несанкционированный доступ к аккаунту, устанавливает на него свою привязку. В такой ситуации аккаунт блокируется перманентно с причиной "Чужая привязка". Дальнейшая разблокировка игрового аккаунта невозможна во избежания повторных случаев взлома.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Заблокированный IP',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 255)][FONT=Verdana][size=15px]Вы оказались на заблокированном IP-адресе. Ваш аккаунт не заблокирован, так что поводов для беспокойства нет. Такая ситуация может возникнуть по разным причинам, например, из-за смены мобильного интернета или переезда. Чтобы избежать этой проблемы, перезагрузите телефон или используйте VPN.[/CENTER] <br>' +
	'[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ваш акк взломан',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваш игровой аккаунт оказался под контролем посторонних лиц. Это могло произойти из-за взлома или из-за того, что вы сами передали свои данные другим людям. В том случае, если с аккаунта было украдено имущество - все причастные к этому будут наказаны. Ваш аккаунт будет временно заблокирован с причиной "Взломан" с целью же вашей дальнейшей безопасности и предотвращения повторных случаев заходов злоумышленников. [/COLOR][/FONT][/B][/CENTER]<br><br>' +
  "[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Для восстановления доступа и уточнения всех нюансов настоятельно рекомендуем вам обратиться в раздел 'Жалобы на технических специалистов' - [/FONT][/COLOR][/B][URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][B][COLOR=rgb(255, 255, 255)][FONT=verdana][I]клик [/I][/FONT][/COLOR][/B][/URL][B][COLOR=rgb(255, 255, 255)][FONT=verdana](кликабельно)[/FONT][/COLOR][/B][/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет ответа игрока',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, обратной связи от вас в данной теме так и не поступило.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Если Ваша проблема по-прежнему не решена, пожалуйста, создайте новое обращение.[/FONT][/COLOR][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'После рестарта',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][FONT=verdana][COLOR=rgb(255, 255, 255)]Проверьте, пожалуйста, будет ли актуальна Ваша проблема после рестарта сервера (после 05:00 по-московскому времени)<br>[/COLOR][/FONT][/CENTER]' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ожидаем от Вас обратной связи в данной теме.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Актуально?',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][FONT=verdana][COLOR=rgb(255, 255, 255)]Уточните, пожалуйста, ваша проблема является актуальной?<br>[/COLOR][/FONT][/CENTER]' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ожидаем от Вас обратной связи в данной теме.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Проблема решилась',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Благодарим Вас за ответ в данной теме. Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел.[/COLOR][/FONT][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  "title": "--Жалобы на игроков--",
  "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317; display: block; min-width: 200px; max-width: 100%; padding: 5px 10px; margin: 5px auto;",
  "class": "answer-button"
},
{
	title: 'Игрок будет заблокирован',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[FONT=verdana]Игрок будет заблокирован[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(0, 255, 0)][B][FONT=verdana][I]Одобрено.[/I][/FONT][/B][/COLOR][/CENTER]',
  prefix: ODOBRENO_PREFIX,
  status: false
},
{
	title: 'Игрок не будет заблокирован',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>Доказательств недостаточно для блокировки игрока[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/FONT][/I][/B][/CENTER]',
  prefix: UNACCEPT_PREFIX,
  status: false
},
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	addButton('На рассмотрение', 'pin', 'border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 165, 0);');
	addButton('КП', 'teamProject', 'border-radius: 20px; margin-right: 100x; border: 2px solid; border-color: rgb(255, 255, 0);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Тех. спецу', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
  addButton('Одобрено', 'odobreno', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(128, 255, 128);');
	addAnswers();

	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#odobreno').click(() => editThreadData(ODOBRENO_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup1(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });


    function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
		}

    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
        );
    }

    function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
        (btn, i) =>
        `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; border-radius: 13px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
    )
        .join('')}</div>`;
}

    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, otkaz = true) {
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
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(otkaz === true) {
	if(prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
}
  if (prefix == COMMAND_PREFIX) {
    moveThread(prefix, 490);
  } else if (prefix == COMMAND_PREFIX1) {
  }
}
}

	function moveThread(prefix, type) {
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

const bgButtons = document.querySelector(".pageContent");

const buttonConfig = (text, href) => {
    const button = document.createElement("button");

    button.style.color = "#FFFFFF";
    button.style.backgroundColor = "#212529";
    button.style.borderColor = "#6c757d";
    button.style.borderRadius = "13px";
    button.style.borderStyle = "solid";
    button.style.borderWidth = "1px";
    button.style.padding = "0.5rem 1rem";
    button.style.fontSize = "1rem";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#343a40";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#212529";
    });
    button.addEventListener("click", () => {
        window.location.href = href;
    });
    return button;
};


const Button16 = buttonConfig("ЖБТЕХ11", 'https://forum.blackrussia.online/forums/Сервер-№11-indigo.1192/');
const Button17 = buttonConfig("ЖБТЕХ12", 'https://forum.blackrussia.online/forums/Сервер-№12-white.1193/');
const Button18 = buttonConfig("ЖБТЕХ13", 'https://forum.blackrussia.online/forums/Сервер-№13-magenta.1194/');
const Button19 = buttonConfig("ЖБТЕХ14", 'https://forum.blackrussia.online/forums/Сервер-№14-crimson.1195/');
const Button20 = buttonConfig("ЖБТЕХ15", 'https://forum.blackrussia.online/forums/Сервер-№15-gold.1196/');
const ButtonTech16 = buttonConfig("ТР11", 'https://forum.blackrussia.online/forums/Технический-раздел-indigo.493/');
const ButtonTech17 = buttonConfig("ТР12", 'https://forum.blackrussia.online/forums/Технический-раздел-white.554/');
const ButtonTech18 = buttonConfig("ТР13", 'https://forum.blackrussia.online/forums/Технический-раздел-magenta.613/');
const ButtonTech19 = buttonConfig("ТР14", 'https://forum.blackrussia.online/forums/Технический-раздел-crimson.653/');
const ButtonTech20 = buttonConfig("ТР15", 'https://forum.blackrussia.online/forums/Технический-раздел-gold.660/');
const ButtonComp16 = buttonConfig("ЖБИГР11", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.519/');
const ButtonComp17 = buttonConfig("ЖБИГР12", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.560/');
const ButtonComp18 = buttonConfig("ЖБИГР13", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.599/');
const ButtonComp19 = buttonConfig("ЖБИГР14", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.640/');
const ButtonComp20 = buttonConfig("ЖБИГР15", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.682/');
const ButtonComp111 = buttonConfig("правила обж", "https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/")

bgButtons.append(Button16); // ЖБ ТЕХ
bgButtons.append(Button17); // ЖБ ТЕХ
bgButtons.append(Button18); // ЖБ ТЕХ
bgButtons.append(Button19); // ЖБ ТЕХ
bgButtons.append(Button20); // ЖБ ТЕХ
bgButtons.append(ButtonTech16); // ТР
bgButtons.append(ButtonTech17); // ТР
bgButtons.append(ButtonTech18); // ТР
bgButtons.append(ButtonTech19); // ТР
bgButtons.append(ButtonTech20); // ТР
bgButtons.append(ButtonComp16); // ЖБ ИГР
bgButtons.append(ButtonComp17); // ЖБ ИГР
bgButtons.append(ButtonComp18); // ЖБ ИГР
bgButtons.append(ButtonComp19); // ЖБ ИГР
bgButtons.append(ButtonComp20); // ЖБ ИГР
bgButtons.append(ButtonComp111); // ОБЩИЕ ПРАВИЛА ПРОЕКТА

const scrollCSS = `
    @media (max-width: 768px) {
        .pageContent {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
        }
        .pageContent > button {
            display: inline-block;
            white-space: normal;
        }
    }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${scrollCSS}</style>`);