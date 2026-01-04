// ==UserScript==
// @name         ! Технические НОВ
// @namespace    https://forum.blackrussia.online/
// @version      0.0.3
// @description  Botiv_Soliev   vk.com/id250006978
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/551968/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%9D%D0%9E%D0%92.user.js
// @updateURL https://update.greasyfork.org/scripts/551968/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%9D%D0%9E%D0%92.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const RASS = 9; // рассмотрено+
	const NO_PREFIX = 0;
	const PIN_PREFIX = 2; //  префикс закрепить+
	const UNACCEPT_PREFIX = 4; // префикс отказано+
	const DECIDED_PREFIX = 6; // префикс решено+
	const CLOSE_PREFIX = 7; // префикс закрыто+
    const ODOBRENO_PREFIX = 8; // префикс одобрено
	const WAT_PREFIX = 9; // рассмотрено+
	const WATCHED_PREFIX = 9; // рассмотрено+
	const COMMAND_PREFIX = 10; // команде проекта+
	const TECHADM_PREFIX = 13 // теху администратору+
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)+
	const buttons = [


{
    title: 'БЕЗ ССЫЛКИ',
    dpstyle: 'oswald: 3px; color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    content:
        "[FONT=Verdana]{{ greeting }}, уважаемый " +
        (document.querySelector('.memberHeader-nameWrapper .username') ? document.querySelector('.memberHeader-nameWrapper .username').textContent : 'пользователь') +
        "<br><br>" +
        "[FONT=Verdana] ТЕКСТ"
},


    {
		title: 'ЗАБЫЛ.НИК',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваш текущий игровой ник: СЮДАНИК <br>Спасибо за ваше обращение.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
        prefix: DECIDED_PREFIX,
        status: true,
	},
	{
		title: 'ЗАБЫЛ ПАРОЛЬ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Мы не имеем возможности знать ваши игровые пароли.<br>Попробуйте восстановить пароль через установленные привязки.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
        status: false,
	},
	{
		title: 'РОСПИСЬ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            '[img]https://minecraft-inside.ru/uploads/ac/17/f4/521239.png[/img]'
	},
	{
		title: 'РОСПИСЬ АНИМ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            '[CENTER][IMG]https://share.creavite.co/6754814101dbfe495dee43c5.gif[/IMG][/CENTER]'
	},
	{
		title: 'МЕЛСТРОЙ АНИМ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[CENTER][URL='https://vk.com/id250006978'][IMG]https://i.postimg.cc/j2R5PJ5b/mellstroy.gif[/IMG][/URL][/CENTER]"
	},
	{
		title: 'Запрос привязок', //
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br>2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>3. Укажите почту, которая привязана к аккаунту<br><br>" +
            "[CENTER][COLOR=rgb(247, 218, 100)][FONT=Verdana]Ожидаю ваш ответ.[/COLOR]",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ПОКУПКА/ПРОДАЖА.ИВ.БОТ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]При проверке системы логирования, было выявлено нарушение с вашей стороны в виде покупки игровой валюты. На ваш счёт поступила игровая валюта от бота, любые переводы от ботов приравниваются к покупке игровой валюты. Бот - программа для заработка игровой валюты различными способами и дальнейших переводов на аккаунты. Крайне рекомендуем ознакомиться с пунктом 2.28 регламента серверов:<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)][FONT=Verdana]| PermBan с обнулением аккаунта + ЧС проекта<br><br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.</code>[/COLOR]<br>",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ПОКУПКА/ПРОДАЖА.ИВ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana][COLOR=RED]Покупка/Продажи игровой валюты[/COLOR] - это процесс, в момент которого происходит обмен внутриигровой валюты на реальные деньги через сторонние сайты.<br><br>Обмен подобного рода запрещены общими правилами проекта и наказываются согласно пункту 2.28.<br>",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ЧУЖИЕ.ПРИВЯЗКИ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
        prefix: PIN_PREFIX,
        status: true,
	},

	{
		title: 'ДУБЛИКАТ',
		dpstyle: 'oswald: 3px;     color: #000; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Данная тема является дубликатом вашей предыдущей темы, ссылка на тему - <br><br>Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

	{
		title: 'ЗАПРОС.ФРАПСА',
		dpstyle: 'oswald: 3px;     color: #000; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Просьба записать фрапс о том, что у Вас отсутствует данный предмет.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: TECHADM_PREFIX,
		status: true,
	},

/////////////////////////////////////////////
{title: 'Tech Admin', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////


{
	title: 'Перенос',
	content:
  "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
  '[FONT=verdana]Данная тема никак не относится к этому разделу.<br>'+
  '[FONT=verdana]Переношу ваше обращение в соответствующий для этого раздел.',
},


	{
		title: 'ЛОГИСТУ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0d47a1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br>Создавать новые темы с данной проблемой — не нужно.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(0, 0, 255)]Передано Техническому Специалисту по Логированию.',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ВЗЯЛ.ТЕМУ',
		dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Тема взята в работу и закреплена, пожалуйста, ожидайте ответа в ней.<br> Рассмотрение темы может занять определенное время.<br><br>",
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ПЕРЕДАНО.КТС/ЗКТС+++',
		dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br>" +
            '[FONT=Verdana]Создавать подобные темы не нужно.<br><br>' +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'НЕ.ПО.ФОРМЕ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, заполните форму, создав новую тему. Заголовок темы должен содержать никнейм технического специалиста и отражать основную суть обращения.<br>Пример:<br> Lev_Kalashnikov | Махинации<br>Форма заполнения темы:<code><br>01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):</code><br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'НЕ.ПО.ТЕМЕ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПРОШЛО.14.ДНЕЙ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь - [URL='https://forum.blackrussia.online/threads/Правила-обжалования-нарушения-при-выдаче-наказания-от-технического-специалиста.7552345/'][I][U]Кликабельно[/U][/I][/URL]<br><br>" +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'ВАМ.В.ТЕХ.РАЗДЕЛ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема не связана с жалобами на работу технических специалистов. Пожалуйста, обратитесь с этим вопросом в технический раздел Вашего сервера.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'БУДЕТ.БАН',
		dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]После проверки доказательств и системы логирования выношу вердикт: [COLOR=rgb(255, 255, 255)][FONT=Arial]игрок будет заблокирован.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'НЕТ.ОКНА.БЛОКИРОВКИ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, прикрепите скриншот окна блокировки.<br>" +
            "[FONT=Verdana]Пожалуйста, создайте новую тему и прикрепите снимок экрана с заблокированного окна, используя фото-хостинги [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL] или [URL='https://imgbb.com']ImgBB.com[/URL] (все кликабетильно).<br><br>" +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'РАЗБАН',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]После дополнительной перепроверки была выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов. Приносим свои извининения за предоставленные неудобства.<br><br>" +
            "[FONT=Verdana]Ваша тема закреплена и ожидает вердикта Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов.<br><br>" +
            "[FONT=Verdana]Создавать подобные темы не нужно.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Имущество не может быть восстановлено',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/'][I][U]Кликабельно[/U][/I][/URL]<br>Вы создали тему, которая не относится к технической проблеме.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПО.ПРОБЛЕМАМ.С.ДОНАТОМ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Если Вы не получили зачисление BLACK COINS, скорее всего, произошла ошибка при вводе данных. Чтобы проверить, были ли зачислены BLACK COINS, введите в игре команду: [COLOR=rgb(255, 255, 255)]/donat.[/COLOR]<br><br>" +
            "[FONT=Verdana]Пожалуйста, будьте внимательны при совершении покупок.<br>" +
            "[FONT=Verdana]Если Вы уверены, что ошибка невозможна и с момента оплаты прошло не более 14 дней, обязательно обратитесь в службу поддержки для решения проблемы. Вы можете связаться с нами через виджет обратной связи на сайте или через мессенджеры:VK: [URL=' vk.com/br_tech']нажмите[/URL], Telegram: [URL='t.me/br_techBot']нажмите[/URL]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'НЕ.БУДЕТ.БАНА',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]После проверки доказательств и системы логирования выношу вердикт:[COLOR=rgb(255, 255, 255)] недостаточно доказательств для блокировки игрока.[/COLOR]<br><br>" +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'ПЕРЕУСТАНОВИТЕ.ИГРУ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Возможно, в файлы вашей игры были внесены изменения или дополнения.<br>" +
            "[FONT=Verdana]Рекомендуется полностью удалить лаунчер и связанные файлы, а затем установить игру заново с официального сайта - [URL='https://blackrussia.online'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Нет ответа игрока',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
		  	'[FONT=Verdana]К сожалению, обратной связи от вас в данной теме так и не поступило.<br><br>' +
		  	'[FONT=Verdana]Если Ваша проблема по-прежнему не решена, пожалуйста, создайте новое обращение.<br><br>' +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Трансфер на твинк',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            '[FONT=Verdana]Внимательно изучив вашу систему логирования, было выявлено, что с вашего аккаунта с никнеймом (Никнейм) через (какую систему была передача) передавали (что передали) на второй аккаунт с никнеймом (Никнейм).<br><br>' +
            '[FONT=Verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]4.05[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>' +
            '[COLOR=rgb(255, 0, 0)][FONT=Verdana]4.05[/COLOR][FONT=Verdana]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][FONT=verdana]<br>Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.<br><br>' +
            'Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>' +
            '[FONT=Verdana]Создавать подобные темы не нужно.<br>' +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},

	{
		title: 'от третьих лиц',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            '[FONT=Verdana]Обращаем ваше внимание, что жалобы, обращения или любые другие темы не рассматриваются от третьих лиц.<br><br>' +
            '[FONT=Verdana]Если ваш друг/знакомый столкнулся с проблемой, он должен зарегистрироваться на форуме по ссылке [URL="https://forum.blackrussia.online/register"][I][U]Кликабельно[/U][/I][/URL] и обратиться самостоятельно от своего имени.<br><br>' +
            '[FONT=Verdana]Просим вас впредь не подавать обращения за других лиц.<br><br>' +
            '[FONT=Verdana]Создавать подобные темы не нужно.<br><br>' +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},







/////////////////////////////////////////////
{title: 'ОТДЕЛ 21-25', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #000; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////

        {
		title: '| ЖБ.АДМ 21 CHILLI |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #e32227; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.992/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 21 CHILLI |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #e32227; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.994/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 21 CHILLI |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #e32227; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.993/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 21 CHILLI |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #e32227; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.995/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 22 CHOCO |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #bf835c; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1034/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 22 CHOCO |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #bf835c; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1036/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 22 CHOCO |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #bf835c; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1035/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 22 CHOCO |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #bf835c; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1037/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 23 MOSCOW |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #ff2b3b; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1080/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 23 MOSCOW |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #ff2b3b; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1082/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 23 MOSCOW |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #ff2b3b; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1081/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 23 MOSCOW |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #ff2b3b; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1083/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 24 SPB |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #11a6fa; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1122/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 24 SPB |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #11a6fa; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 24 SPB |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #11a6fa; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1123/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 24 SPB |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #11a6fa; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1125/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 25 UFA |',
		dpstyle: 'oswald: 3px;     color: #000000; background: #ffba08; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1165/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 25 UFA |',
		dpstyle: 'oswald: 3px;     color: #000000; background: #ffba08; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1167/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 25 UFA |',
		dpstyle: 'oswald: 3px;     color: #000000; background: #ffba08; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1166/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 25 UFA |',
		dpstyle: 'oswald: 3px;     color: #000000; background: #ffba08; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1168/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},




/////////////////////////////////////////////
{title: 'ОТДЕЛ 76-80', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #000; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////




        {
		title: '| ЖБ.АДМ 76 CHITA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #35ca68; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3412/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 76 CHITA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #35ca68; ',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3414/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 76 CHITA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #35ca68; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3413/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 76 CHITA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #35ca68; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3415/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 77 KOSTROMA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f1b10d; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3447/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 77 KOSTROMA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f1b10d; ',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3449/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 77 KOSTROMA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f1b10d; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3448/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 77 KOSTROMA |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f1b10d; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3450/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 78 VLADIMIR |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f58041; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 78 VLADIMIR |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f58041; ',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 78 VLADIMIR |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f58041; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 78 VLADIMIR |',
		dpstyle: 'oswald: 3px;     color: #000; background: #f58041; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3485/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 79 KALUGA |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #3032a4; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3517/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 79 KALUGA |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #3032a4; ',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3519/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 79 KALUGA |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #3032a4; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3518/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 79 KALUGA |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #3032a4; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3520/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
	{
		title: '| ЖБ.АДМ 80 NOVGOROD |',
		dpstyle: 'oswald: 3px;     color: #000; background: #ffc700; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3553/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ИГР 80 NOVGOROD |',
		dpstyle: 'oswald: 3px;     color: #000; background: #ffc700; ',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3555/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.ЛД 80 NOVGOROD |',
		dpstyle: 'oswald: 3px;     color: #000; background: #ffc700; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3554/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 80 NOVGOROD |',
		dpstyle: 'oswald: 3px;     color: #000; background: #ffc700; ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3556/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},








/////////////////////////////////////////////
{title: 'Tech Forum', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////

	{
		title: 'ОТВЕТ НЕ ПОСТУПИЛ/РЕШЕНО',
		dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Мы не дождались от Вас обратной связи! Так понимаем, что Ваша проблема была решена.<br><br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
		prefix: DECIDED_PREFIX,
		status: true,
	},
	{
		title: 'ФОРМА.ПОДАЧИ',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, заполните форму, создав новую тему: <code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно)</code><br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не относится к тех. разделу',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Оффтоп',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/Общие-правила-нахождения-на-форуме.304564/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Проблема решилась',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Отвязка привязок',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]][FONT=Arial]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Запрос доп. информации',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Verdana]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE] [/SIZE][/FONT]<br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Вам в жб на специалистов',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>" +
            "[FONT=Verdana]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передано КП',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков. Создавать новые темы с данной проблемой — не нужно.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Проблема известна КП',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не является багом',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Передача тестерам',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема передана на тестирование.<br>",
		prefix: WAIT_PREFIX,
		status: true,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении.[/FONT][/COLOR]<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 255, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Сервер не отвечает',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) менить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/FONT]<br>" +
            "[FONT=Verdana]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/FONT]<br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Кикнули за ПО',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'НЕТ ДОКОВ',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга: [URL='https://yapx.ru/']yapx.ru[/URL],[URL='https://imgur.com/']imgur.com[/URL],[URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабельно).[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Баг будет исправлен',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад в развите проекта.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Исчезла стата аккаунта',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.[/FONT]<br><br>" +
            "[FONT=Verdana]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны![/FONT]<br><br>" +
            "[FONT=Verdana]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU <br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'ПРАВИЛА ВОССТА',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/'][I][U]Кликабельно[/U][/I][/URL].<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'По крашам/вылетам',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.<br><br>" +
            "[FONT=Verdana]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не выпустило из ФСИН',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Скоро будете выпущены,ожидайте.[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице![/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: "Баг со штрафами",
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            '[FONT=Verdana]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
	},








/////////////////////////////////////////////
{title: 'ЖАЛОБЫ НА ИГРОКОВ', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////

	{
		title: 'Администрации.Обратно',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Не нуждается в техническом вмешательстве.<br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]передано Администрации Сервера.',
	},
    {
		title: '| НЕТ.УСЛОВИЯ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.<br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| ОТКАЗ.ДОЛГ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ВИРТ.НА.ДОНАТ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
	},
	{
		title: '| НЕТ НАРУШЕНИЙ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Исходя из выше приложенных доказательств, нарушения со стороны игрока - не имеется!<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
	status: false,
	},
    {
		title: '| НЕТ ДОК-ВО |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| НЕТ НАРУШЕНИЙ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| Недостаточно док-во |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: '| ДОКИ в СОЦ.СЕТИ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: '| Нет тайм-кодов |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НЕТУ /time |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НУЖЕН ФРАПС |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| НЕПОЛНЫЙ ФРАПС/УСЛОВИЯ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
	},
	{
		title: '| НЕ РАБОТАЮТ ДОК-ВО |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ДОКА-ВО ОТРЕДАК.КАЧЕСТВО ПЛОХОЕ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: '| ОШИБЛИСЬ РАЗДЕЛОМ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Вы ошиблись разделом/сервером, переподайте жалобу в нужный раздел.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

	{
        title: '| НЕТ ДОК-В |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В вашей жалобе отсутствуют доказательства для её рассмотрения. Пожалуйста прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| Не рабочие док-ва |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленные доказательства не рабочие, пожалуйста загрузите доказательства на фото/видео хостинге.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| СЛИВ.СЕМЬИ.ОТКАЗ |',
		content:
            "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
            "[FONT=Verdana] Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

/////////////////////////////////////////////
{title: 'Новые ответы', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////


{
  title: 'Покупка ИВ у бота',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что бот через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][FONT=Verdana][B]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>[/FONT][/B]" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},


{
	title: 'Покупка ИВ у игрока',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что продавец игровой валюты с никнеймом (ник продавца) через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][FONT=Verdana][B]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>[/FONT][/B]" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
    	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Трансфер на твинк',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что с вашего аккаунта с никнеймом (Никнейм) через (какую систему была передача) передавали (что передали) на второй аккаунт с никнеймом (Никнейм).[/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]4.05[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)][B][FONT=verdana]4.05[/FONT][/B][/COLOR][FONT=verdana][B]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [/B][COLOR=rgb(255, 0, 0)][B]Ban 15 - 30 дней / PermBan[/B][/COLOR][/FONT][B][FONT=verdana]<br>Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Продажа ИВ игроку',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что вы продали игровую валюту через (какую систему была передача) игроку с никнеймом (Никнейм) в размере (размер).[/CENTER][/COLOR][/FONT][/B]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]2.28[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br>" +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},

{
	title: 'ПЕРЕДАН',
	content:
  "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
  '[FONT=verdana]Ваш аккаунт заблокирован по причине:<br>' +
  '[FONT=verdana][COLOR=RED]4.03.[/COLOR]Передача своего личного игрового аккаунта третьим лицам[COLOR=RED]| PermBan.[/COLOR]<br>' +
  '[COLOR=RED]Примечание:[/COLOR] передачей аккаунта является предоставление третьим лицам паролей, пин-кодов и данных, которые дают доступ к игровому аккаунту.<br><br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br>" +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},


{
	title: 'Махинации со взломом',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Внимательно изучив систему логирования, было выявлено, что игрок с никнеймом (ник) был взломан. В ходе дальнейшей проверки обнаружено, что имущество игрока было передано на ваш аккаунт. Данные действия подразумевают собой совокупность, которая направлена на получение выгоды нечестным для этого путем.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/CENTER][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},

{
	title: 'Ожидайте вердикта руководства',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Форма подачи ЖБ ТС',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки с фотохостинга или видеохостинга.<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).[/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ошибка, будет разбан',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После дополнительной перепроверки была выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов. Приносим свои извининения за предоставленные неудобства.<br>[/CENTER]<br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.[/CENTER]<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел, составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно, чтобы оно содержало лишь никнейм технического специалиста и причину.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствуют оффтоп/оскорбления.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Срок подачи жб',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.[/center]<br><br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Имущество восстановлено',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды: [COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=verdana]Ожидайте вердикта от команды проекта[/FONT][/B][/COLOR][/CENTER]',
	status: true,
	prefix: COMMAND_PREFIX,
},
{
	title: 'Не относится',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста, будьте добры, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Запрос привязок',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br>[/FONT][/COLOR][/B][COLOR=rgb(255, 255, 255)][FONT=verdana][B]2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>[/B][/FONT][/COLOR][B][COLOR=rgb(255, 255, 255)][FONT=verdana]3. Укажите почту, которая привязана к аккаунту[/FONT][/COLOR][/B][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][I][COLOR=rgb(247, 218, 100)][FONT=verdana]Ожидаю ваш ответ.[/FONT][/COLOR][/I][/CENTER]",
  prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Смена пароля',
  color: '',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Сбросьте пароль через любую из привязок ВКонтакте или Telegram, после чего, убедительная просьба, сообщить об этом в данной теме.<br><br>Ожидаю вашего ответа.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/FONT][/SIZE][/COLOR]',
	prefix: TECHADM_PREFIX,
	status: true,
},
	{
  title: ' ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Технический раздел ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
{
	title: 'Форма подачи ТР',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, прикрепив доказательства с фотохостинга или видеохостинга<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нерабочая ссылка',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, ссылка на ваши прикрепленные доказательства недоступна или не работает.[/COLOR][/FONT][/B]<br>' +
  '[CENTER][B][FONT=verdana]Пожалуйста, отправьте новое обращение, убедившись, что ссылка на  доказательства работает и содержит качественные фотографии или видеозаписи.[/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Док-ва из соц.сети',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Доказательства из социальных сетей <u>не принимаются и не подлежат рассмотрению</u>.<br><br>Вы можете воспользоваться любым удобным фото/видеохостингом, но для вашего удобства мы перечислили популярные сайты:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела, в котором Вы создали тему, поскольку Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][/CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Передача логисту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта, пожалуйста, ожидайте ответ в данной теме.<br><br>" +
	'[CENTER]Создавать новые темы с данной проблемой не нужно.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/color][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Забыл пароль',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В решении данной проблемы вам могут помочь только установленные привязки на аккаунте.<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]Вы можете через специализированного бота в привязанных социальных сетях восстановить доступ к игровому аккаунту, сбросив пароль через окно "ввода пароля" при входе в игру или же поменяв пароль в самом боте. Если же на вашем игровом аккаунте отсутствуют привязки — мы ничем не сможем вам помочь, ибо каждый игрок несёт ответственность за свой игровой аккаунт и за игровые ценности на нём.<br><br>' +
  "Помощник Кирилл (Telegram) - [I][URL='https://t.me/br_helper_bot']клик[/URL][/I] (кликабельно)<br>" +
  "[CENTER][B][FONT=verdana]BLACK RUSSIA - Мобильная онлайн-игра (ВКонтакте) - [URL='https://vk.com/blackrussia.online'][I]клик [/I][/URL](кликабельно)[/FONT][/B][/CENTER]<br><br>" +
  '[COLOR=rgb(255, 255, 255)][B]После регистрации игрового аккаунта мы настоятельно рекомендуем каждому пользователю обезопасить свой игровой аккаунт всеми возможными соответствующими привязками, дабы в дальнейшем не попадать в подобные ситуации и не попадаться на несанкционированный вход со стороны злоумышленников.<br><br>' +
  '[COLOR=rgb(255, 255, 255)][B] Мы не сбрасываем пароли и не отвязываем возможно утерянные привязки от игровых аккаунтов.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропало имущество(доп.инфа)',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>4. Дата покупки;<br>5. Способ приобретения (у игрока, в магазине или через донат;<br>6. Видеофиксация покупки (если присутствует);<br>7. Никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нет PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта.<br>" +
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
	"[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>" +
  '[CENTER][COLOR=rgb(255, 255, 0)]Передано команде проекта.[/color][/CENTER][/FONT][/SIZE]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена.<br>Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема, с которой вы столкнулись, не является багом или ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера.[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на адм',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Обратитесь в раздел 'Жалобы на администрацию' вашего сервера.<br>Форма для подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']клик[/URL][/I] (кликабельно)<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на лидеров',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на Лидеров' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на игроков',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на игроков' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Обжалования',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +
	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +
	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>'+
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Перенаправление в поддержку',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В том случае, если у вас произошла одна из указанных проблем:[/COLOR][/B][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Баланс доната (BC) стал отрицательным.<br> 2. Донат не был зачислен на аккаунт.<br> 3. Донат был зачислен не в полном объеме.<br> 4. Отсутствие подарка при подключении или продлении тарифа Tele-2.<br> 5. Частые переподключения к серверу.[/FONT][/COLOR][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Вам в срочном порядке необходимо обратиться в техническую поддержку нашего проекта https://vk.com/br_tech (ВКонтакте) или https://t.me/br_techBot (Telegram).[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сим-карта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=4][FONT=Veranda][FONT=verdana][COLOR=rgb(255, 255, 255)][B]Если вы приобрели тариф Black Russia, но награды не были зачислены или у Вас не получается активировать номер с тарифом Black Russia , тогда [/B][I][B]убедитесь в следующем:[/B][/I][/COLOR][/FONT][/FONT][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]1. У вас тариф Black Russia, а не другой тариф, например, тариф Black[/FONT][/B][/CENTER]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]2. Номер активирован.[/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]3. После активации номера [U]прошло более 48-ми часов.[/U][/COLOR][/FONT]<br><br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если пункты выше не описывают вашу ситуацию в обязательном порядке обратитесь в службу поддержки[I] для дальнейшего решения:[/I][/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/COLOR][/FONT]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Хочу стать адм/хелп',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Технические специалисты не принимают решения по назначению на должности.<br>Для этого есть раздел заявок на форуме - [I][URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']клик[/URL][/I] (кликабельно), где вы можете ознакомиться с актуальными заявками и формами подачи.<br>Приятной игры и удачи в карьерном росте!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Предложение по улучш.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме.<br>Если вы хотите предложить улучшение, пожалуйста, перейдите в соответствующий раздел.<br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нужны все прошивки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Тестерам',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукц/маркет',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br><br>Если же вещи пропали с маркетплейса, значит их никто не купил, вам следует забрать их с ПВЗ (пункта выдачи заказов) в течение 7 дней, иначе предметы системно уничтожатся.<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Отвязка привязок',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Удалить установленные привязки на вашем аккаунте не представляется возможным ни нам, ни команде проекта. [/FONT][/COLOR][/B]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Бывают случаи, когда злоумышленник, получив несанкционированный доступ к аккаунту, устанавливает на него свою привязку. В такой ситуации аккаунт блокируется перманентно с причиной "Чужая привязка". Дальнейшая разблокировка игрового аккаунта невозможна во избежания повторных случаев взлома.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Заблокированный IP',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 255)][FONT=Verdana][size=15px]Вы оказались на заблокированном IP-адресе. Ваш аккаунт не заблокирован, так что поводов для беспокойства нет. Такая ситуация может возникнуть по разным причинам, например, из-за смены мобильного интернета или переезда. Чтобы избежать этой проблемы, перезагрузите телефон или используйте VPN.[/CENTER] <br>' +
	'[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ваш акк взломан',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваш игровой аккаунт был подвержен несанкционированному доступу со стороны злоумышленников. В том случае, если с аккаунта было украдено имущество - все причастные к этому будут наказаны. Ваш аккаунт будет временно заблокирован с причиной "Взломан" с целью же вашей дальнейшей безопасности и предотвращения повторных случаев заходов злоумышленников. [/COLOR][/FONT][/B][/CENTER]<br><br>' +
  "[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Для восстановления доступа и уточнения всех нюансов настоятельно рекомендуем вам обратиться в раздел 'Жалобы на технических специалистов' - [/FONT][/COLOR][/B][URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][B][COLOR=rgb(255, 255, 255)][FONT=verdana][I]клик [/I][/FONT][/COLOR][/B][/URL][B][COLOR=rgb(255, 255, 255)][FONT=verdana](кликабельно)[/FONT][/COLOR][/B][/CENTER]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет ответа игрока',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, обратной связи от вас в данной теме так и не поступило.[/COLOR][/FONT][/B][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Если Ваша проблема по-прежнему не решена, пожалуйста, создайте новое обращение.[/FONT][/COLOR][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'После рестарта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][FONT=verdana][COLOR=rgb(255, 255, 255)]Проверьте, пожалуйста, будет ли актуальна Ваша проблема после рестарта сервера (после 05:00 по-московскому времени)<br>[/COLOR][/FONT][/CENTER]' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ожидаем от Вас обратной связи в данной теме.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[COLOR=rgb(255, 255, 0)]На рассмотрении[/color][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},

{
  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ЖАЛОБЫ НА ИГРОКОВ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ     ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },

{
	title: 'Игрок будет заблокирован',
	color: '',
	content:
    "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
	"[FONT=Verdana]После проверки доказательств и системы логирования вердикт:[COLOR=rgb(0, 255, 0)] Игрок будет заблокирован.[/COLOR]<br><br>"+
	"[FONT=Verdana][COLOR=rgb(0, 255, 0)]Рассмотрено.[/COLOR]",
  prefix: ODOBRENO_PREFIX,
  status: false
},
{
	title: 'Игрок не будет заблокирован',
	color: '',
	content:
    "[FONT=Verdana]{{ greeting }}, уважаемый {{ user.mention }}<br><br>"+
	"[FONT=Verdana]После проверки доказательств и системы логирования вердикт: [COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока.[/COLOR]<br><br>" +
	"[FONT=Verdana][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]",
  prefix: UNACCEPT_PREFIX,
  status: false
},


{
	title: 'Рассмотрено пермбан',
	color: '',
	content:
    "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
	"[FONT=Verdana]На основании грубого нарушения правил пользования, игроку назначена перманентная блокировка аккаунта.<br>" +
	"[FONT=Verdana]Доступ к игровому аккаунту прекращен навсегда.<br><br>" +
	"[FONT=Verdana][COLOR=rgb(0, 255, 0)]Рассмотрено.[/COLOR]",
},

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Тех', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');
	addButton('КТС', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(238, 238, 0, 2.5);');
 /*	addButton('Реш', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');          */
 /*   addButton('Рас', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');        */
 /*   addButton('Отк', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');         */
	addButton('Зак', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
    addButton('Меню', 'selectAnswer' , 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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
		$('.button--icon--reply').after(`</button>`,
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

	function editThreadData(prefix, pin = false, may_lens = true) {
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
				discussion_open: 1,
				sticky: 1,
				_xfToken: XF.config.csrf,
				_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				_xfWithData: 1,
				_xfResponseType: 'json',
				}),
			}).then(() => location.reload());
		}
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
		}
	}









	function moveThread(prefix, type) {
// Перемещение темы
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

