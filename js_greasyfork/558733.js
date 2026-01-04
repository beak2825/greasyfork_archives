// ==UserScript==
// @name         Sсript for Chief Administration
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  Скрипт для Руководителей серверов!
// @author       ilya
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator ya
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/558733/S%D1%81ript%20for%20Chief%20Administration.user.js
// @updateURL https://update.greasyfork.org/scripts/558733/S%D1%81ript%20for%20Chief%20Administration.meta.js
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
 
 
const glassButtonCSS = `
<style>
.glass-button {
    position: relative;
    display: inline-block;
    padding: 8px 16px;
    margin: 4px;
    text-decoration: none;
    text-transform: uppercase;
    color: white;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    cursor: pointer;
    z-index: 1;
}
 
.glass-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0));
    z-index: -1;
    transition: all 0.3s ease;
    opacity: 0;
}
 
.glass-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}
 
.glass-button:hover::before {
    opacity: 1;
}
 
.glass-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
 
 
.glass-button.answer {
    background: rgba(138, 43, 226, 0.3);
    border-color: rgba(138, 43, 226, 0.5);
}
 
.glass-button.reject {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
}
 
.glass-button.approve {
    background: rgba(0, 255, 0, 0.3);
    border-color: rgba(0, 255, 0, 0.5);
}
 
.glass-button.review {
    background: rgba(255, 152, 0, 0.3);
    border-color: rgba(255, 152, 0, 0.5);
}
 
.glass-button.ga {
    background: rgba(216, 0, 0, 0.3);
    border-color: rgba(216, 0, 0, 0.5);
}
 
.glass-button.special {
    background: rgba(255, 203, 0, 0.3);
    border-color: rgba(255, 203, 0, 0.5);
}
 
.glass-button.close {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
}
 
.glass-button.divider {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    cursor: default;
    pointer-events: none;
    width: 100%;
    text-align: center;
    margin: 10px 0;
    padding: 8px 0;
}
 
.select_answer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin: 10px 0;
}
 
.button-container {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    justify-content: center;
}
 
.section-title {
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    margin: 10px 0 5px 0;
}
</style>
`;
 
 
document.head.insertAdjacentHTML('beforeend', glassButtonCSS);
 
const buttons = [
  {
        title: ' Самостоятельно ',
        content:
            '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>' +
            "Твой текст <br><br>",
        class: 'answer'
    },
    {
        title: ' Запросил доказательства ',
        content:
            '[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>' +
            "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобные темы, в ином случае Ваш форумный аккаунт будет заблокирован согласно 2.18 ОПНФ.[/CENTER]<br><br>" +
            '[CENTER]Ожидайте ответа.[/CENTER][/SIZE]',
        prefix: PIN_PREFIX,
        status: true,
        class: 'review'
    },
   {
title: 'На рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалоба находится на рассмотрении у Руководства сервера. Просьба не создавать подобные темы, в ином случае Ваш форумный аккаунт будет заблокирован согласно 2.18 ОПНФ.<br><br>"+
'[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER]',
prefix: PIN_PREFIX,
status: true,
class: 'review'
},
{
title: 'Отказ.',
class: 'divider'
},
{
title: ' Не по Форме ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба составлена не по форме.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' /time ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]На доказательствах в Вашей жалобе отсутствует /time.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Фейк доказательства ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В Вашей жалобе поддельные доказательства. Ваш форумный аккаунт будет заблокирован согласно 2.13 ОПНФ.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Отсутствуют доказательства ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В Вашей жалобе отсутствуют доказательства на нарушения со стороны администратора. Пожалуйста, создайте повторную жалобу и прикрепите необходимые доказательства.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
  title: ' Наказание выдано верно ',
  content:
    '[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Действия администратора были корректными, нарушений с его стороны не увидел.[/COLOR].<br><br>"+
    '[CENTER]Отказано, закрыто.',
  prefix: UNACCEPT_PREFIX,
  status: false,
  class: 'reject'
},
{
title: ' Сроки ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] С момента получения наказания прошло [Color=rgb(255, 0, 0)] более 72 часов[/color],жалоба не подлежит рассмотрению. <br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Недостаточно доказательств ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Предоставленных доказательств недостаточно для корректного рассмотрения жалобы.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Ошиблись Разделом/Сервером ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вы ошиблись разделом/сервером, подайте жалобу в нужный раздел сервера.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Не работают доказательства ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Предоставленные доказательства не работают. Просьба подать жалобу заново с рабочей ссылкой.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Повторка ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Прекратите создавать дубликаты жалоб. В дальнейшем, ваш форумный аккаунт может быть заблокирован согласно 2.18 ОПНФ.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Нету нарушений от админа ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Нарушений со стороны администратора не наблюдаю.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Жалоба от 3 лица ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалоба составлена от третьего лица, рассмотрению не подлежит.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Ответ был ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ответ вынесен в Вашей прошлой теме.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Окно Блокировки ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите в новой жалобе скриншот окна блокировки игрового аккаунта при входе в игру.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' ЖБ На Теха ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Данный администратор является техническим специалистом, в связи с этим Вам необходимо обратиться в раздел жалоба на Технический специалистов.[/color][/URL][/CENTER].<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Неадекватное Содержание ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' На Скрине Читы/Сборка ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]На доказательствах присутствует Постороннее ПО, в жалобе отказано. Также Ваш игровой аккаунт будет заблокирован согласно 2.22 ОПС<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: 'Одобрено',
class: 'divider'
},
{
title: ' Меры приняты ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]По отношению к администратору были приняты необходимые меры.<br><br>"+
'[CENTER]Одобрено, закрыто.',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: ' Наказание будет снято ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вердикт администратора не корректен, наказание будет снято. По отношению к администратору были приняты необходимые меры. <br><br>"+
'[CENTER]Одобрено, закрыто.',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: 'Передано',
class: 'divider'
},
{
title: ' ГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана Главному администратору.<br>"+
"[CENTER]Просьба не создавать подобные темы, в ином случае Ваш форумный аккаунт будет заблокирован согласно 2.18 ОПНФ.<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/SIZE]',
prefix: GA_PREFIX,
status: true,
class: 'ga'
},
{
title: ' зГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана Заместителям Главного Администратора.<br>"+
"[CENTER]Просьба не создавать подобные темы, в ином случае Ваш форумный аккаунт будет заблокирован согласно 2.18 ОПНФ.<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/SIZE]',
prefix: PIN_PREFIX,
status: true,
class: 'ga'
},
{
title: ' СПЕЦ.АДМ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана Специальной Администрации.<br>"+
"[CENTER]Просьба не создавать подобные темы, в ином случае Ваш форумный аккаунт будет заблокирован согласно 2.18 ОПНФ.<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/SIZE]',
prefix: SA_PREFIX,
status: true,
class: 'special'
},
{
title: 'Обжалования',
class: 'divider'
},
{
title: ' Одобрено ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование одобрено, наказание будет снято в ближайшее время.<br><br>"+
'[CENTER]Одобрено, закрыто.[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'accept'
},
{
title: ' отказано ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В обжалование отказано.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' не по форме ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование составлено не по форме.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' неподнадлежит  ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше наказание неподнадлежит обжалованию.<br><br>"+
'[CENTER]Отказано, закрыто.',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
}
  ];
 
$(document).ready(() => {
 
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    const buttonContainer = $('<div class="button-container"></div>');
    $('.button--icon--reply').before(buttonContainer);
 
 
    addButton(' Рассмотрение ', 'pin', 'review');
    addButton(' Одобрено ', 'accepted', 'approve');
    addButton(' Отказано ', 'unaccept', 'reject');
    addButton(' ГА ', 'Ga', 'ga');
    addButton(' Закрыто ', 'Zakrito', 'close');
    addButton(' Ответы ', 'selectAnswer', 'answer');
 
 
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
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
 
function addButton(name, id, styleClass = '') {
    $(`.button-container`).append(
        `<button type="button" class="glass-button ${styleClass}" id="${id}" style="margin: 3px;">${name}</button>`,
    );
}
 
function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="glass-button ${btn.class || ''}" ` +
                `style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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
                ? 'Доброго времени суток'
                : 18 < hours && hours <= 21
                ? 'Доброго времени суток'
                : 21 < hours && hours <= 4
                ? 'Доброго времени суток'
                : 'Доброго времени суток',
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