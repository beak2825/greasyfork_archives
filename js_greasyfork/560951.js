// ==UserScript==
// @name         Black Russia | Скрипт для Кураторов Форума | SURGUT
// @namespace    https://forum.blackrussia.online/
// @version      4.1
// @description  Скрипт для Руководства Сервера
// @author       Lukas_Platonov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/560951/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20SURGUT.user.js
// @updateURL https://update.greasyfork.org/scripts/560951/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20SURGUT.meta.js
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
title: 'Багоюз',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Помеха игр. процессу',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы | Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/CENTER]<br><br>" +
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
title: 'Помеха блогерам',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Выдача себя за администратора',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней.[/CENTER]<br><br>" +
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
title: 'Реклама промокода',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Неуважение к администрации',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Metagaming',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Уход от RP',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn.[/CENTER]<br><br>" +
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
title: 'Flood',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Провокация в VIP Chat',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'Слив СМИ',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan.[/CENTER]<br><br>" +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
	},
    {
title: 'NonRP Cop',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]6.03. Запрещено nRP поведение | Warn.[/CENTER]<br><br>" +
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
title: 'Редакт в личных целях | СМИ',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации.[/CENTER]<br><br>" +
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
title: 'Оск проекта',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Игрок будет наказан по следующему пункту:[/CENTER]<br><br>" +
"[CENTER]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/CENTER]<br><br>" +
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
title: 'Отсутствие тайм-кодов',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют тайм-коды. Видео, в котором ситуация идет больше 3-ех минут, они нужны.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
{
title: 'Отсутсвует условие договора | Обман/Попытка',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутсвует условие договора, жалоба не подлежит рассмотрению.[/CENTER]<br><br>" +
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
title: 'Неполная ситуация',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Отсутствует полная ситуация, жалоба не подлежит рассмотрению. [/CENTER]<br><br>" +
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
title: 'Жалоба от 3-его лица',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-его лица, рассмотрению не подлежит.[/CENTER]<br><br>" +
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
title: 'Плохое качество',
content:
'[SIZE=4][FONT=courier new][CENTER]Здравствуйте.[/CENTER]<br><br>' +
"[CENTER]На ваших доказательствах плохое качество, напишите новую жалобу с хорошим качеством видео-доказательств.[/CENTER]<br><br>" +
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