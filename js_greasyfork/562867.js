// ==UserScript==
// @name         Sсript for KF
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Script KF
// @author       emmar
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator ya
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/562867/S%D1%81ript%20for%20KF.user.js
// @updateURL https://update.greasyfork.org/scripts/562867/S%D1%81ript%20for%20KF.meta.js
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
            '[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
            "[SIZE=4][FONT=Arial]ТЕКСТ <br><br>"+
        "[SIZE=4][FONT=Arial]Закрыто. <br><br>",
            
        class: 'answer'
    },
   {
title: 'Все ответы.',
class: 'divider'
},
{
title: 'ДМ',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 60 минут demorgan'a за DM.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Сбив анимации стрельбы',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 120 минут demorgan'a за Cбив анимации стрельбы.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Аморал',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 30 минут demorgan'a за Аморальные действия.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'SK',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 60 минут demorgan'a за SK.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'TK',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 60 минут demorgan'a за TK.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'DB',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 60 минут demorgan'a за DB.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Работа в фрме гос.',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 30 минут demorgan'a за 1.07 ПГО.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'На капте в форме крайма',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит warn за 1.13 ПГО.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'КАЗИНО | БУ | АУК в форме гос.',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 30 минут demorgan'a за 1.13 ПГО.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Арест/Стрельба на спавне крайма',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит warn за 1.16 ПГО..<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'NRP',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 30 минут demorgan'a за nRP поведение.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'nRP SANG',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит warn за nRP проникновение на воинскую часть.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'NRD',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 30 минут demorgan'a за nRP drive.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Оскорбление проекта',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 300 минут за оскорбление проекта.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Фура NRD',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит 60 минут demorgan'a за nRP drive.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Упоминание родных',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 120 минут за упомнинание родных.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Оскорбление родных',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 15 дней за оскорбление родных.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Помеха ИП',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 10 дней за помеху ИП.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Реклама',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 7 дней за рекламу.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Выдача себя за Администратора',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 15 дней за выдачу себя за администратора..<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Музыка в Voice',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 60 минут за Музыку в Voice.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Транслит',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 30 минут за транслит.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Политика',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 7 дней за политику.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'CapsLock',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 30 минут за CapsLock.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Flood',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 30 минут за flood.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Mass DM',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит ban на 3 дня за Массовый DM.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'cheats',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит перманентную блокировку за использование ПО.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Оскорбление администрации',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Игрок получит mute на 180 минут за оскорбление администрации.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: ACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'ОТКАЗ',
class: 'divider'
},
{
title: 'Недостаточно доказательств',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Недостаточно доказательств для выдачи наказания.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: UNACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Неработают доказательства',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Недостаточно доказательств для выдачи наказания.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: UNACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Отсутствует /time',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]На Ваших доказательствах отсутствует /time.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: UNACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'Нету нарушений',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Нарушений от игрока не увидел.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: UNACCEPT_PREFIX,
status: true,
class: 'review'
},
{
title: 'FORUMNICK',
class: 'divider'
},
{
title: 'Бан // неадекватно',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Ваш форумный аккаунт будет заблокирован.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: CLOSE_PREFIX,
status: true,
class: 'review'
},
{
title: 'Не рассматривем, неадекватный состав',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Жалобы в таком оформлении рассматриваться не будет.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: CLOSE_PREFIX,
status: true,
class: 'review'
},
{
title: 'ПО на доказательствах',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]На Ваших доказательствах присутствует стороннее ПО, в таком формате жалоба рассмотрена не будет.<br><br>"+
'[SIZE=4][FONT=Arial]Закрыто.',
prefix: CLOSE_PREFIX,
status: true,
class: 'review'
},
{
title: 'Тех. спец. | ГА | зГА | ГКФУ',
class: 'divider'
},
{
title: 'ГА',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Жалоба передана Главному Администратору.<br><br>"+
'[SIZE=4][FONT=Arial]На рассмотрении.',
prefix: WATCHED_PREFIX,
status: true,
class: 'review'
},
{
title: 'ГКФУ',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Жалоба передана главным кураторам форума.<br><br>"+
'[SIZE=4][FONT=Arial]На рассмотрении.',
prefix: WATCHED_PREFIX,
status: true,
class: 'review'
},
{
title: 'зГА',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Жалоба передана Заместителя ГА.<br><br>"+
'[SIZE=4][FONT=Arial]На рассмотрении.',
prefix: WATCHED_PREFIX,
status: true,
class: 'review'
},
{
title: 'Техническому специалисту',
content:
'[SIZE=4][FONT=Arial]Приветствую,<br><br>'+
"[SIZE=4][FONT=Arial]Жалоба передана техническому специалисту.<br><br>"+
'[SIZE=4][FONT=Arial]На рассмотрении.',
prefix: WATCHED_PREFIX,
status: true,
class: 'review'
}
  ];
 
$(document).ready(() => {
 
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    const buttonContainer = $('<div class="button-container"></div>');
    $('.button--icon--reply').before(buttonContainer);
 
 
    addButton(' На рассмотрение ', 'pin', 'review');
    addButton(' Одобрено ', 'accepted', 'approve');
    addButton(' Отказано ', 'unaccept', 'reject');
    addButton(' Chief Admin ', 'Ga', 'ga');
    addButton(' Закрыто ', 'Zakrito', 'close');
    addButton(' Доступные ответы ', 'selectAnswer', 'answer');
 
 
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