// ==UserScript==
// @name ЗГА CHERRY
// @namespace https://forum.blackrussia.online
// @version 1.0.3
// @description Костелло
// @author Rasul_Costello
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator ya
// @icon 
// @downloadURL https://update.greasyfork.org/scripts/560419/%D0%97%D0%93%D0%90%20CHERRY.user.js
// @updateURL https://update.greasyfork.org/scripts/560419/%D0%97%D0%93%D0%90%20CHERRY.meta.js
// ==/UserScript==
 
(function () {
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
const TEXU_PREFIX = 13;
const buttons = [
{
  title: 'Свой Ответ',
  content:
    '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255,0,255)]{{ greeting }},[/COLOR] уважаемый {{ user.mention }}!<br><br>' +
    'Твой текст<br><br>' +
    '[/CENTER][/FONT][/SIZE]',
},

{
  title: 'На рассмотрение',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваше обжалование взято на рассмотрение. Просьба не создавать подобных тем.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩<span style="color:#00ff00;">НА РАССМОТРЕНИЕ</span>𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
  title: 'ГА',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваша жалоба передана Главному Администратору.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: GA_PREFIX,
  status: true,
},

{
  title: 'Спец адм',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваша жалоба передана Специальному Администратору.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: SA_PREFIX,
  status: true,
},

{
  title: 'РМ/ЗРМ',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваше обжалование будет передано Руководителю модераторов Forum/Discord на рассмотрение. Просьба не создавать подобных тем.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: COMMAND_PREFIX,
  status: true,
},

{
  title: 'На рассмотрение (Nick)',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваш аккаунт будет разблокирован на 1 день для смены игрового NickName. ' +
    'После того, как Вы смените NickName, Вам необходимо прикрепить скриншот статистики (c /time) в данную тему.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},

{
  title: 'Ссылку на ВК',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Прикрепите ссылку на вашу страницу ВКонтакте.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},

{
  title: 'Свяжитесь со мной в ВК',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Свяжитесь со мной ВКонтакте, прикрепив ссылку на обжалование: https://vk.com/id565583297.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩<span style="color:orange;">ОДОБРЕНИЯ</span>𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
  title: 'Снятие наказания',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Рассмотрев ваше обжалование, было принято решение о снятии наказания.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},

{
  title: 'Возврат',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Возврат произведён. Аккаунт разблокирован.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},

{
  title: 'Срок сокращен',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Срок сокращен.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},

{
  title: 'Наказание снято, проведена беседа',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваше наказание снято, с администратором проведена необходимая работа.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩<span style="color:red;">ОТКАЗЫ</span>𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
  title: 'Жб на теха',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Данный администратор является или являлся техническим специалистом, поэтому вам необходимо обратиться в раздел ' +
    '[URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%969-cherry.1190/]' +
    '[COLOR=rgb(255,0,0)]«Жалобы на технических специалистов»[/COLOR][/URL].' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Отказано',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'В данном обжаловании отказано.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Связь с игроком (Долг)',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Если вы готовы возместить ущерб игроку, свяжитесь с игроком Nick для возврата имущества. ' +
    'После этого игрок должен оформить обжалование.' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Док-ва из соц. сетей',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Доказательства из социальных сетей не принимаются. ' +
    'Загрузите их на другой хостинг (yapx, postimg, ibb, imgur).' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Окно блокировки',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.<br><br>' +
    '[SPOILER=Окно блокировки]' +
    '[URL=https://postimg.cc/sBVHvwJD]' +
    '[IMG]https://i.postimg.cc/sBVHvwJD/image.png[/IMG]' +
    '[/URL]' +
    '[/SPOILER]' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Не по форме',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Ваше обжалование составлено не по форме. Пожалуйста, создайте новую тему, соблюдая форму подачи:<br>' +
    '[SPOILER=Форма]' +
    '1. Ваш Nick_Name:<br>' +
    '2. Nick_Name администратора:<br>' +
    '3. Дата выдачи/получения наказания:<br>' +
    '4. Суть заявки:<br>' +
    '5. Доказательство:' +
    '[/SPOILER]<br><br>' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Уже есть жалоба на рассмотрении',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'У вас уже имеется подобная жалоба на рассмотрении. Просьба не создавать подобных тем, ' +
    'иначе ваш форумный аккаунт может быть ' +
    '[COLOR=rgb(255,0,0)][U]заблокирован[/U][/COLOR].' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Нет док-в',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'В жалобе отсутствуют доказательство о нарушении от администратора. ' +
    'Создайте повторную жалобу и прикрепите доказательства. ' +
    'Загрузите их на любой хостинг (yapx, postimg, ibb, imgur) и вставьте ссылку на фотографию' + 
    '[/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: 'Нет доступа к док-вам',
  content:
    '[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
    'Нет доступа к док-вам' +
    '[/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},
]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton(' Рассмотрение ', 'pin');
addButton(' Одобрено ', 'accepted');
addButton(' Отказано ', 'unaccept');
addButton(' ГА ', 'Ga');
addButton(' Закрыто ', 'Zakrito');
addButton(' Ответы ', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
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
12 < hours && hours <= 18
? 'Доброго времени Суток'
: 18 < hours && hours <= 21
? 'Доброго времени Суток'
: 21 < hours && hours <= 4
? 'Доброго времени Суток'
: 'Доброго времени Суток',
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