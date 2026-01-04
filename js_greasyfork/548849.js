// ==UserScript==
// @name         ! Технические НОВОЕ
// @namespace    https://forum.blackrussia.online/
// @version      0.0.1
// @description  Botiv_Soliev   vk.com/id250006978
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/548849/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%9D%D0%9E%D0%92%D0%9E%D0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/548849/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%9D%D0%9E%D0%92%D0%9E%D0%95.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано+
	const PIN_PREFIX = 2; //  префикс закрепить+
	const COMMAND_PREFIX = 10; // команде проекта+
	const CLOSE_PREFIX = 7; // префикс закрыто+
	const DECIDED_PREFIX = 6; // префикс решено+
	const TECHADM_PREFIX = 13 // теху администратору+
	const WATCHED_PREFIX = 9; // рассмотрено+
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)+
	const NO_PREFIX = 0;
	const buttons = [
    {
		title: 'Приветствие',
        dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[[FONT=Verdana] ТЕКСТ <br><br>"
	},
    {
		title: 'ЗАБЫЛ.НИК',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваш текущий игровой ник: СЮДАНИК <br>Спасибо за ваше обращение.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
        prefix: DECIDED_PREFIX,
        status: true,
	},
	{
		title: 'ЗАБЫЛ ПАРОЛЬ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
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
            '[img]https://share.creavite.co/6754814101dbfe495dee43c5.gif[/img]'
	},
	{
		title: 'ЗАПРОС.ПРИВЯЗОК', //
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: https://t.me/getmyid_bot<br>2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>3. Укажите почту, которая привязана к аккаунту<br><br>",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ПОКУПКА/ПРОДАЖА.ИВ.БОТ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]При проверке системы логирования, было выявлено нарушение с вашей стороны в виде покупки игровой валюты. На ваш счёт поступила игровая валюта от бота, любые переводы от ботов приравниваются к покупке игровой валюты. Бот - программа для заработка игровой валюты различными способами и дальнейших переводов на аккаунты. Крайне рекомендуем ознакомиться с пунктом 2.28 регламента серверов:<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)][FONT=Verdana]| PermBan с обнулением аккаунта + ЧС проекта<br><br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.</code>[/COLOR]<br>",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ПОКУПКА/ПРОДАЖА.ИВ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana][COLOR=RED]Покупка/Продажи игровой валюты[/COLOR] - это процесс, в момент которого происходит обмен внутриигровой валюты на реальные деньги через сторонние сайты.<br><br>Обмен подобного рода запрещены общими правилами проекта и наказываются согласно пункту 2.28.<br>",
        prefix: TECHADM_PREFIX,
        status: true,
	},
	{
		title: 'ЧУЖИЕ.ПРИВЯЗКИ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]На рассмотрении...[/COLOR]',
        prefix: PIN_PREFIX,
        status: true,
	},





/////////////////////////////////////////////
{title: 'Tech Admin', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////





	{
		title: 'ЛОГИСТУ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #0d47a1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br>Создавать новые темы с данной проблемой — не нужно.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(0, 0, 255)]Передано Техническому Специалисту по Логированию.',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ВЗЯЛ.ТЕМУ',
		dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема взята на рассмотрение.<br>Пожалуйста не создавайте дубликатов.<br>Ответ поступит в ближайшее время.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]На рассмотрении...',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ПЕРЕДАНО.КТС/ЗКТС',
		dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и ожидает выноса вердикта со стороны руководства технических специалистов. Пожалуйста, ожидайте.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]На рассмотрении...[/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'ДУБЛИКАТ',
		dpstyle: 'oswald: 3px;     color: #000; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Данная тема является дубликатом вашей предыдущей. Пожалуйста, не создавайте одинаковые или схожие темы — это нарушает правила форума. [COLOR=rgb(255, 0, 0)] В случае повторных нарушений ваш аккаунт может быть заблокирован.[/COLOR]<br><br>Мы уже ответили на ваше обращение здесь - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I][U]Кликабельно[/U][/I][/URL]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'НЕ.ПО.ФОРМЕ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, заполните форму, создав новую тему. Заголовок темы должен содержать никнейм технического специалиста и отражать основную суть обращения.<br>Пример:<br> Lev_Kalashnikov | Махинации<br>Форма заполнения темы:<code><br>01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):</code><br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'НЕ.ПО.ТЕМЕ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПРОШЛО.14.ДНЕЙ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь - [URL='https://forum.blackrussia.online/threads/Правила-обжалования-нарушения-при-выдаче-наказания-от-технического-специалиста.7552345/'][I][U]Кликабельно[/U][/I][/URL]<br><br>" +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'ВАМ.В.ТЕХ.РАЗДЕЛ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема не связана с жалобами на работу технических специалистов. Пожалуйста, обратитесь с этим вопросом в технический раздел Вашего сервера.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'БУДЕТ.БАН',
		dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
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
            "[FONT=Verdana]Пожалуйста, создайте новую тему и прикрепите снимок экрана с заблокированного окна, используя фото-хостинги [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL] или [URL='https://imgbb.com']ImgBB.com[/URL] (все кликабетильно).[/COLOR]<br>" +
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Имущество не может быть восстановлено',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/'][I][U]Кликабельно[/U][/I][/URL]<br>Вы создали тему, которая не относится к технической проблеме.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПО.ПРОБЛЕМАМ.С.ДОНАТОМ',
		dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
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

            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Возможно, в файлы вашей игры были внесены изменения или дополнения.<br>" +
            "[FONT=Verdana]Рекомендуется полностью удалить лаунчер и связанные файлы, а затем установить игру заново с официального сайта - [URL='https://blackrussia.online'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ.НА.АДМ 24 |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1122/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ НА ИГР 24 |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		  	"[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ЖБ НА ЛД 24 |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>" +
            "[FONT=Verdana]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1123/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
		  	'[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ОБЖ 24 |',
		dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.name }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от администратора сервера. Для снижения или обжалования перейдите в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1125/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
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
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Мы не дождались от Вас обратной связи! Так понимаем, что Ваша проблема была решена.<br><br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
		prefix: DECIDED_PREFIX,
		status: true,
	},
	{
		title: 'ФОРМА.ПОДАЧИ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, заполните форму, создав новую тему: <code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно)</code><br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не относится к тех. разделу',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Оффтоп',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/Общие-правила-нахождения-на-форуме.304564/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Проблема решилась',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Решено.[/COLOR]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Отвязка привязок',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]][FONT=Arial]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Запрос доп. информации',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Verdana]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE] [/SIZE][/FONT]<br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Вам в жб на специалистов',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>" +
            "[FONT=Verdana]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][I][U]Кликабельно[/U][/I][/URL]<br><br>"+
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передано КП',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков. Создавать новые темы с данной проблемой — не нужно.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]На рассмотрении...',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Проблема известна КП',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не является багом',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Передача тестерам',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша тема передана на тестирование.<br>",
		prefix: WAIT_PREFIX,
		status: true,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении.[/FONT][/COLOR]<br><br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]На рассмотрении...',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Сервер не отвечает',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) менить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/FONT]<br>" +
            "[FONT=Verdana]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/FONT]<br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Кикнули за ПО',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'НЕТ ДОКОВ',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга: [URL='https://yapx.ru/']yapx.ru[/URL],[URL='https://imgur.com/']imgur.com[/URL],[URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабельно).[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Баг будет исправлен',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад в развите проекта.<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Исчезла стата аккаунта',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
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
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/'][I][U]Кликабельно[/U][/I][/URL].<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'По крашам/вылетам',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.<br><br>" +
            "[FONT=Verdana]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены.<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не выпустило из ФСИН',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Скоро будете выпущены,ожидайте.[/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице![/FONT]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Отказано.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: "Баг со штрафами",
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            '[FONT=Verdana]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
	},








/////////////////////////////////////////////
{title: 'ЖАЛОБЫ НА ИГРОКОВ', dpstyle: 'display: block; width: calc(100% - 30px); text-align: center; color: #fff; background: #db2309; border: 1px solid #db2309; border-radius: 3px;', },
/////////////////////////////////////////////





	{
		title: 'Игрок будет заблокирован (Жб игроков)',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]После проверки доказательств и системы логирования вердикт - [COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR]<br><br>" +
            '[FONT=Verdana][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR]',
	},
	{
		title: 'Игрок не будет заблокирован (Жб игроков)',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]После проверки доказательств и системы логирования вердикт - [COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR]<br><br>" +
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
	},
	{
		title: 'Администрации.Обратно',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Не нуждается в техническом вмешательстве.<br>" +
            '[FONT=Verdana][COLOR=rgb(255, 152, 0)]передано Администрации Сервера.',
	},
    {
		title: '| НЕТ.УСЛОВИЯ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.<br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| ОТКАЗ.ДОЛГ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ВИРТ.НА.ДОНАТ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НЕТ НАРУШЕНИЙ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Исходя из выше приложенных доказательств, нарушения со стороны игрока - не имеется!<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
	status: false,
	},
    {
		title: '| НЕТ ДОК-ВО |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| НЕТ НАРУШЕНИЙ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| Недостаточно док-во |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: '| ДОКИ в СОЦ.СЕТИ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: '| Нет тайм-кодов |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НЕТУ /time |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br><br>"+
            '[FONT=Verdana][COLOR=red]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НУЖЕН ФРАПС |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| НЕПОЛНЫЙ ФРАПС/УСЛОВИЯ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| НЕ РАБОТАЮТ ДОК-ВО |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| ДОКА-ВО ОТРЕДАК.КАЧЕСТВО ПЛОХОЕ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: '| ОШИБЛИСЬ РАЗДЕЛОМ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Вы ошиблись разделом/сервером, переподайте жалобу в нужный раздел.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

	{
        title: '| НЕТ ДОК-В |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana]В вашей жалобе отсутствуют доказательства для её рассмотрения. Пожалуйста прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: '| Не рабочие док-ва |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленные доказательства не рабочие, пожалуйста загрузите доказательства на фото/видео хостинге.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: '| СЛИВ.СЕМЬИ.ОТКАЗ |',
		content:
            "[FONT=Verdana]{{ greeting }} {{ user.mention }}<br><br>"+
            "[FONT=Verdana] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
            "[FONT=Verdana] Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br><br>"+
            '[FONT=Verdana][COLOR=RED]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Тех', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');
	addButton('КТС', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(238, 238, 0, 2.5);');
	addButton('Реш', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Рас', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Отк', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
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