// ==UserScript==
// @name         Black Russia | Скрипт для Руководство Сервера SURGUT
// @namespace    https://forum.blackrussia.online/
// @version      3.1.1
// @description  Скрипт для Руководства Сервера
// @author       Lukas_Platonov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/553200/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SURGUT.user.js
// @updateURL https://update.greasyfork.org/scripts/553200/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SURGUT.meta.js
// ==/UserScript==

(function () {
'use strict';
const FAIL_PREFIX = 4;
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const WATCH_PREFIX = 9;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
{
	  title: '--------------------------------------------------  Жалобы на администрацию --------------------------------------------------',
},
{
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Бан по IP',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
"[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Работа с адм | Снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена необходимая работа. Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Наказать адм',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Необходимые меры будут приняты. Cпасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ответ дан в прошлой теме. Если вы дальше будете дублировать темы в данном разделе, то ваш форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Беседа с админом',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена строгая беседа. Cпасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Качество докв',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот окна блокировки аккаунта',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Выдано верно',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Админ прав, опру от игрока на ответный дм',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Если Dm и вправду был ответным вы должны предоставить доказательства[/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>" +
"[CENTER]Переподайте жалобу с прикреплёнными доказательствами[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена не по форме.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
{
title: 'Отсутствуют док-ва',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства. Пересоздайте жалобу, прикрепив необходимые доказательства.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Тех. спец',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов. Жалоба не подлежит рассмотрению.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Отсутствует окно бана',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передано ЗГА',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Заместителю Главного Администратора.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано ГА',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Главному Администратору.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: GA_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Специальной Администрации.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: SPECIAL_PREFIX,
status: true,
},
{
title: 'Передано Руководсту Модерации',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Руководству Модерации Discord.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: COMMAND_PREFIX,
status: true,
},
{
title: 'Жалоба от 3 лица',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица. Рассмотрению не подлежит.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Доказательства отредактированы',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства отредактированы. Рассмотрению не подлежит.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Оскорбительная жалоба',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема не подлежит рассмотрению.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'Нерабочие доказательства',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, не работают.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
{
title: 'Нарушений от адм нету',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет снято.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствует /time',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Подделка докв',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
	  title: '--------------------------------------------------  Обжалования --------------------------------------------------',
	},

{
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование взято на рассмотрение.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'В обж отказано',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В обжаловании отказано.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'NonRP Обман | Условие',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Если вы хотите хотите обжаловать наказание за NonRP обман вы должны сами связаться с человеком, которого обманули. После чего он должен написать на вас обжалование, прикрепив ссылку на жалобу которую писал на вас и скриншот окна блокировки обманувшего. По другому вы никак не сможете обжаловать наказание за NonRP обман.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
	},
{
title: 'Обжалование | ник',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часов вы не смените свой никнейм, то вы будете заново заблокированы без возможности на обжалование, доказательства нужно прикрепить сюда.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Обжалованию не подлежит',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Данное наказание не подлежит обжалованию. В обжаловании отказано.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'В обж одобрено',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование одобрено. Ваше наказание будет полностью снято.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
     {
	  title: 'Снизить наказание до минимальных мер',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до минимальных мер. Не повторяйте подобных ошибок.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
title: 'Отсутствуют док-ва',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашем обжаловании отсутствуют доказательства.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
{
title: 'Отсутствует окно бана',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'Тех. спец',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'Дублирование тем',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ответ вам был дан в прошлой теме. За дублирование тем ваш форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
    {
	  title: 'Доква подделаны',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
    "[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже есть мин. наказание',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
		"[CENTER]Вам итак выдано минимальное наказание за нарушение. В обжаловании отказано.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Снизить до 7 дней',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до 7 дней.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
title: 'Обж не по форме',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*.[/URL][/COLOR][/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
        title: 'Направить в раздел жб на тех',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
title: 'Доказательства не работают',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, не работают.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
    {
title: 'Доказательства из соц.сетей',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, сделаны из социальных сетей.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
    },
    {
	  title: 'NRP обман 24 часа',
	  content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
		"[CENTER]Аккаунт будет разблокирован. Если в течении 24-ех часов ущерб игрок не вернет вам имущество, акканут будет заблокирован без права на обжалование.[/CENTER]<br><br>" +
		'[CENTER]Вы должны прислать видео доказательство возврата имущества в данную тему.[/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
title: 'Передано ГА',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование передано Главному Администратору.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: GA_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование передано Специальной Администрации.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: SPECIAL_PREFIX,
status: true,
},
{
title: 'Передано Руководсту Модерации',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование передано Руководству Модерации Discord.[/CENTER]<br><br>" +
'[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]',
prefix: COMMAND_PREFIX,
status: true,
},
{
	  title: '--------------------------------------------------  Жалобы на игроков --------------------------------------------------',
},
{
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: 'Тех. Специалисту',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Техническому Специалисту.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: TECH_PREFIX,
status: true,
},
    {
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана Техническому Специалисту.[/CENTER]<br><br>" +
'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
prefix: TECH_PREFIX,
status: true,
},
    {
title: 'Оск родных',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.19. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Продажа ИВ/Слота',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.28. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | PermBan с обнулением аккаунта + ЧС проекта.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Обман/Попытка обмана',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'DM',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 мин.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Упом/оск нации',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: 'DB',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Реклама',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'CapsLock',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Стороннее ПО',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Политика/Розжиг',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Оскорбление',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
    },
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена не по форме.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
title: 'Нарушений нет',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Нужен фрапс',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В данном случае нужен фрапс для рассмотрении данной ситуации.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Недостаточно доказательств',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Недостаточно доказательств для выдачи наказания игроку.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Неправильный ник',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Никнейм игрока указан неверно.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствует /time',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Обрезанный скриншот/видео',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Пожалуйста загрузите видео/скриншот в полном формате и не обрезанное/обрезанный.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства не работают',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, не работают.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
title: 'Более 72 часов',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]С момента выдачи написания жалобы прошло 72 часа. Жалоба не подлежит рассмотрению.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Отстутствуют доказательства',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутсвутют какие-либо доказательства.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Доказательства отредактированы',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, отредактированы.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
title: 'Доказательства из соц.сетей',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Доказательства, которые вы предоставили, сделаны из социальных сетей.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
{
title: 'Отсутствует /time',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]На вашем видео отсутствует /time.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
{
title: 'Игрок уже был наказан',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок уже был наказан. Спасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: RESHENO_PREFIX,
status: false,
    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
} else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
`<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
.map(
(btn, i) =>
`<button id="answers-${i}" class="button--primary button ` +
`rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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
4 < hours && hours <= 11
? 'Доброе утро'
: 11 < hours && hours <= 15
? 'Добрый день'
: 15 < hours && hours <= 21
? 'Добрый вечер'
: 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;

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