// ==UserScript==
// @name         BLACK | Script for kf
// @namespace    https://forum.blackrussia.online/
// @version      2.0
// @description  для кураторов форума, обращаться по всем вопросам - https://vk.com/remoorka
// @author       remoore
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/551071/BLACK%20%7C%20Script%20for%20kf.user.js
// @updateURL https://update.greasyfork.org/scripts/551071/BLACK%20%7C%20Script%20for%20kf.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const NARASSSMOTRENII_PREFIX = 3;
const SPECIAL_PREFIX = 11;
const buttons = [
        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ   👨‍💻 Жалобы на администрацию 👨‍💻    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
{
title: 'на рассмотрении',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба находится на рассмотрении<br><br>"+
'Ожидайте ответа в этой теме, создавать копии не требуется.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'гкф згкф',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба находится на рассмотрении у Главного Куратора Форума / Заместителя Главного Куратора Форума.<br><br>"+
'Ожидайте ответа в этой теме, создавать копии не требуется.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'теху',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба находится на рассмотрении у Технического специалиста.<br><br>"+
'Ожидайте ответа в этой теме, создавать копии не требуется.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: TEX_PREFIX,
status: true,
},
{
title: 'га',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба находится на рассмотрении у Главного администратора.<br><br>"+
'Ожидайте ответа в этой теме, создавать копии не требуется.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: GA_PREFIX,
status: true,
},
{
title: '2+ игроков',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Жалобу можно написать только на 1 игрока, если нарушителей больше, требуется создать на каждого отдельную жалобу.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'ник не совпадает',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Ник игрока в жалобе и на записи не совпадает.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'недостаточно докв',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Недостаточно доказательств для выдачи наказания.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'нет докв',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Отсутствуют доказательства.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'док-ва не работают',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Доказательства не работают. Попробуйте опубликовать их на платформы: YouTube, Imgut, Postimage.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'нет нарушений',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Не увидел нарушений от игрока.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'нет /time',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана.<br><br>"+
'Отсутствует /time на доказательствах.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'не по форме',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана<br><br>"+
'Не по форме. Внимательней ознакомьтесь с правилами подачи жалоб на игроков.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'не тот сервер',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Ваша жалоба отказана<br><br>"+
'Вы ошиблись сервером.[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: UNACCEPT_PREFIX,
status: true,
},
{
title: 'дм',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.19.[/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины |[COLOR=rgb(235, 107, 86)] Jail 60 минут[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'дб',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта |[COLOR=rgb(235, 107, 86)] Jail 60 минут[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'масс дм',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.20. [/COLOR][COLOR=rgb(255, 255, 255)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [/COLOR][COLOR=rgb(235, 107, 86)]Warn / Ban 3 - 7 дней[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'нрп поведение',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.01. [/COLOR]Запрещено поведение, нарушающее нормы процессов Role Play режима игры |[COLOR=rgb(235, 107, 86)] Jail 30 минут[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'нрд',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.03. [/COLOR]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере |[COLOR=rgb(235, 107, 86)] Jail 30 минут[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'нрп вч',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2. [/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение |[COLOR=rgb(235, 107, 86)] Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'нрп коп',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]6.03.[/COLOR] Запрещено поведение не подражающее полицейскому | [COLOR=rgb(235, 107, 86)]Warn[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'госс на ауке и бу',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'{[COLOR=rgb(235, 107, 86)]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота |[COLOR=rgb(235, 107, 86)] Jail 30 минут[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
{
title: 'помеха рп',
content:
'[COLOR=rgb(184, 49, 47)][SIZE=4][FONT=georgia]Приветствую, уважаемый (-ая)[/FONT][/SIZE] [/COLOR][SIZE=4][FONT=georgia] {{ user.mention }}[/FONT][/SIZE][HR][/HR]'+
"[FONT=georgia][COLOR=rgb(204, 204, 204)]Игрок получит наказание по следующему пункту правил:<br><br>"+
'[COLOR=rgb(235, 107, 86)]2.04. [/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(235, 107, 86)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/FONT][HR][/HR]<br>'+
'[COLOR=rgb(204, 204, 204)][FONT=georgia][I]BLACK by [/I][/FONT][/COLOR][COLOR=rgb(97, 189, 109)][FONT=georgia][I]T.Remoore[/I][/FONT][/COLOR]',
prefix: ACCEPT_PREFIX,
status: true,
},
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('Тык', 'selectAnswer');
 
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