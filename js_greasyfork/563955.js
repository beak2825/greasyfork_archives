// ==UserScript==
// @name         BLACK RUSSIA  || Скрипт для Кураторов Форума.
// @namespace    https://forum.blackrussia.online
// @version      1.7
// @description  Специально для сервера White
// @match        https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/563955/BLACK%20RUSSIA%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563955/BLACK%20RUSSIA%20%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 1; // Префикс "Важно
    const TECHADM_PREFIX = 13 // префикс техническому специалисту
    const buttons = [
{
    title: '---------------------------------------------------------------> Отказанно <----------------------------------------------------------',
},
        {
    title: 'Отстутствуют доказательства',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]В вашей жалобе отсутствуют доказательства нарушения игрока.<br><br>Пожалуйста,напишите новую жалобу и прикрепите фото/видеозапись нарушений.[/COLOR][/FONT][/B][/CENTER]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Не по форме',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша жалоба составлена не по форме.<br>Пожалуйста,заполните форму создав новую жалобу: В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: "Nick_Name | Суть жалобы".<br> Форма подачи жалобы:<br>[code]1. Ваш Nick_Name: <br> 2. Nick_Name игрока: <br> 3. Суть жалобы: <br> 4. Доказательство: [/code][/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Отсутствует time',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению в вашей жалобе отсутствует /time.<br><br>К сожалению, в соответствии с правилами подачи жалоб, мы не можем рассмотреть ваше обращение.[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Недостаточно доказательств',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению в вашей жалобе недостаточно доказательств для выдачи наказания данному игроку.<br><br>Пожалуйста,напишите новую жалобу предоставив полное доказательство нарушений данного игрока.[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Нет нарушений',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Со стороны игрока нет нарушений.<br>[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Нужен фрапс',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Для данного нарушения игрока требуется фрапс.<br>[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Доказательства отредактированы',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваши доказательства были отредактированы.<br><br> К сожалению мы не можем принять такие доказательства.[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Доказательства отредактированы',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваши доказательства были загружены в соц сеть.<br><br> К сожалению мы не можем принять и рассмотреть такие доказательства.<br><br> Пожалуйста загрузите доказательства на любой фото/видео хостинг<br>[URL=https://yapx.ru/] yapx.ru [/URL],<br>[URL=https://imgur.com/]imgur.com[/URL],<br>[URL=https://www.youtube.com/]youtube.com[/URL],<br>[URL=https://imgbb.com]ImgBB.com[/URL],<br>[FONT=verdana][URL=https://imgfoto.host/]ImgFoto.host[/URL],<br>[URL=https://postimages.org/]Postimages.org [/URL][/FONT]<br>(все кликабельно).<br>[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
        {
    title: 'Прошло более 72 часов',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]С момента нарушений игрока прошло более 72 часов<br><br> К сожалению мы не можем принять вашу жалобу.[/COLOR][/B][/CENTER][/FONT][/SIZE]'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: true,
},
 
 
{
    title: '---------------------------------------------------------------> Прочие <----------------------------------------------------------',
},
        {
    title: 'На рассмотрении',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Тема взята в работу и закреплена, пожалуйста, ожидайте ответа в ней.<br><br> Рассмотрение темы может занять определенное время.[/COLOR][/FONT][/B][/CENTER]<br><br>'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 140, 0)] На рассмотрении.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
},
        {
    title: 'Передать Ст.Адм',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша тема передана [COLOR=rgb(0, 0, 205)]Старшей Администрации.[/COLOR]<br><br>Ожидайте ответа в данной теме.[/COLOR][/FONT][/B][/CENTER]<br>'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 0, 205)]Передано Старшей Администрации.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: SPECIAL_PREFIX,
    status: true,
},
        {
    title: 'Передать ЗГА',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша тема передана [COLOR=rgb(225, 0, 0)]Руководству сервера.[/COLOR]<br><br>Ожидайте ответа в данной теме.[/COLOR][/FONT][/B][/CENTER]<br>'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0, 0)] Передано Руководству сервера.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: SPECIAL_PREFIX,
    status: true,
},
        {
    title: 'Передать ГА',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша тема передана [COLOR=rgb(225, 0, 0)]Главному Администратору.[/COLOR]<br><br>Ожидайте ответа в данной теме.[/COLOR][/FONT][/B][/CENTER]<br>'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(255, 0,0)]Передано Главному Администратору.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: GA_PREFIX,
    status: true,
},
        {
    title: 'Передать Теху',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша тема передана [COLOR=#0000FF]Техническому специалисту.[/COLOR]<br><br>Ожидайте ответа в данной теме.[/COLOR][/FONT][/B][/CENTER]<br>'+
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 0, 255)]Передано Техническому специалисту.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: TECHADM_PREFIX,
    status: true,
},
        {
    title: 'Передать на доп.проверку',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
          '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.05[/COLOR] - OOC/IC обманы.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.05[/COLOR]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ваша тема передана Техническому специалисту[/COLOR] на дополнительную проверку.[/FONT][/B][/CENTER]<br><br>'+
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 0, 255)]Передано Техническому специалисту.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: TECHADM_PREFIX,
    status: true,
},
        {
    title: 'Слив склада доп.инфа',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Пожалуйста прикрепите следующие фото/видеозаписи:<br>[code]1.Что вы являетесь лидером данной семьи.<br>2.Логи взятия ресурсов.<br>3.Описание взаимодействия со складом семьи (Установленный вами лимит на взаимодействия со складом)[/code]<br><br>'+
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Ожидаю вашего ответа.[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    noClose: true,
},
{
    title: '---------------------------------------------------------------> Нарушения правил <---------------------------------------------------------------',
},
{
    title: '2.01 - Нарушение норм RP',
    content:
     '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.01[/COLOR] - Нарушение норм Role Play.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.02 - Уход от RP процесса',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.02[/COLOR] - Уход от Role Play процесса.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.03 - NonRP Drive',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.03[/COLOR] - NonRP Drive.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.03[/COLOR]. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условий, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.04 - Помеха в работе',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.04[/COLOR] - Помеха в работе.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.04[/COLOR]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: таран дальнобойщиков, инкассаторов под разными предлогами.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.05 - OOC/IC обманы',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.05[/COLOR] - OOC/IC обманы.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.05[/COLOR]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.07 - AFK без ESC',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.07[/COLOR] - Нахождение в AFK без ESC.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.07[/COLOR]. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | [COLOR=rgb(255, 0, 0)]Kick[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.08 - Аморальные действия',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.08[/COLOR] - Аморальные действия.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.08[/COLOR]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: обоюдное согласие обеих сторон.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.09 - Слив склада семьи',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.09[/COLOR] - Слив склада семьи.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.09[/COLOR]. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.10 - Обман в /do',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.10[/COLOR] - Обман в /do.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.10[/COLOR]. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.11 - Рабочий транспорт в личных целях',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.11[/COLOR] - Использование рабочего транспорта в личных целях.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.11[/COLOR]. Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.13 - DB (DriveBy)',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.13[/COLOR] - DB (DriveBy).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.13[/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.15 - TK (Team Kill)',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.15[/COLOR] - TK (Team Kill).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.15[/COLOR]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.16 - SK (Spawn Kill)',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.16[/COLOR] - SK (Spawn Kill).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.16[/COLOR]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.18 - MG (MetaGaming)',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.18[/COLOR] - MG (MetaGaming).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.18[/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: телефонное общение также является IC чатом.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.19 - DM (DeathMatch)',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.19[/COLOR] - DM (DeathMatch).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.19[/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.20 - Mass DM',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.20[/COLOR] - Mass DM (Mass DeathMatch).[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.20[/COLOR]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.21 - Использование багов',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.21[/COLOR] - Использование багов.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.21[/COLOR]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками;<br>' +
     'Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;<br>' +
     'Банк и личные счета предназначены для передачи денежных средств между игроками;<br>' +
     'Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.22 - Читерство',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.22[/COLOR] - Читерство.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.22[/COLOR]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: запрещено внесение любых изменений в оригинальные файлы игры.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: разрешено изменение шрифта, его размера и длины чата (кол-во строк).<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: блокировка за включенный счетчик FPS не выдается.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.31 - Реклама',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.31[/COLOR] - Реклама.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.31[/COLOR]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.35 - Конфликты на национальной/религиозной почве',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.35[/COLOR] - Конфликты на национальной/религиозной почве.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.35[/COLOR]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.37 - OOC-угрозы',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.37[/COLOR] - OOC-угрозы.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.37[/COLOR]. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.39 - Злоупотребление нарушениями',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.39[/COLOR] - Злоупотребление нарушениями.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.39[/COLOR]. Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.40 - Деструктивные действия',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.40[/COLOR] - Деструктивные действия.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.40[/COLOR]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.43 - Продажа промокодов',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.43[/COLOR] - Продажа промокодов.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.43[/COLOR]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [COLOR=rgb(255, 0, 0)]Mute 120 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.44 - Role Play сон',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.44[/COLOR] - Role Play сон.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.44[/COLOR]. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | [COLOR=rgb(255, 0, 0)]Kick[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: сон разрешается с 23:00 до 6:00 в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.47 - Поля на грузовике',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.47[/COLOR] - Езда по полям на грузовом транспорте.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.47[/COLOR]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.50 - Задержания в казино/аукционе',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.50[/COLOR] - Задержания в казино/аукционе.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.50[/COLOR]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.52 - Некорректные аксессуары',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.52[/COLOR] - Некорректные аксессуары.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.52[/COLOR]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.54 - Неуважение к администрации',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.54[/COLOR] - Неуважение к администрации.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.54[/COLOR]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.55 - Багоюз анимации',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.55[/COLOR] - Багоюз анимации.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.55[/COLOR]. Запрещается багоюз, связанный с анимацией в любых проявлениях | [COLOR=rgb(255, 0, 0)]Jail 120 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '2.57 - Невыплата долга',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]2.57[/COLOR] - Невыплата долга.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]2.57[/COLOR]. Запрещается брать в долг игровые ценности и не возвращать их | [COLOR=rgb(255, 0, 0)]Ban 30 дней / permban[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '---------------------------------------------------------------> Игровые чаты <---------------------------------------------------------------',
},
{
    title: '3.02 - Caps Lock',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.02[/COLOR] - Использование Caps Lock.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.02[/COLOR]. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: "ПрОдАм", "куплю МАШИНУ".[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.03 - Оскорбления в OOC',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.03[/COLOR] - Оскорбления в OOC чате.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.03[/COLOR]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.04 - Упоминание родных',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.04[/COLOR] - Упоминание родных.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.04[/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: термины "MQ", "rnq" расценивается, как упоминание родных.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.05 - Флуд',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.05[/COLOR] - Флуд.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.05[/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.06 - Злоупотребление символами',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.06[/COLOR] - Злоупотребление символами.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.06[/COLOR]. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.10 - Выдача себя за админа',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.10[/COLOR] - Выдача себя за администратора.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.10[/COLOR]. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.11 - Введение в заблуждение командами',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.11[/COLOR] - Введение в заблуждение командами.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.11[/COLOR]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.14 - Музыка в Voice Chat',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.14[/COLOR] - Музыка в Voice Chat.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.14[/COLOR]. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.16 - Посторонние шумы',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.16[/COLOR] - Посторонние шумы.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.16[/COLOR]. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.18 - Политическая/религиозная пропаганда',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.18[/COLOR] - Политическая/религиозная пропаганда.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.18[/COLOR]. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.19 - Софт для изменения голоса',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.19[/COLOR] - Софт для изменения голоса.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.19[/COLOR]. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.20 - Транслит',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.20[/COLOR] - Транслит.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.20[/COLOR]. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: «Privet», «Kak dela», «Narmalna».[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.21 - Реклама промокодов',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.21[/COLOR] - Реклама промокодов.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.21[/COLOR]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах | [COLOR=rgb(255, 0, 0)]Ban 30 дней[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.22 - Объявления в госорганизациях',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.22[/COLOR] - Объявления в госорганизациях.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.22[/COLOR]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: в помещении центральной больницы писать в чат: "Продам эксклюзивную шапку дешево!!!"[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '3.23 - Мат в VIP чате',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]3.23[/COLOR] - Мат в VIP чате.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]3.23[/COLOR]. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '---------------------------------------------------------------> Игровые аккаунты <---------------------------------------------------------------',
},
{
    title: '4.06 - Неправильный никнейм',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.06[/COLOR] - Неправильный никнейм.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.06[/COLOR]. Никнейм игрового аккаунта должен быть в формате "Имя_Фамилия" на английском языке | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: _scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '4.07 - Заглавные буквы в нике',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.07[/COLOR] - Заглавные буквы в нике.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.07[/COLOR]. В игровом никнейме запрещено использовать более двух заглавных букв | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: одна заглавная буква в первой букве имени, вторая заглавная буква в первой букве фамилии, большего быть не может.<br>' +
     '[COLOR=rgb(255, 0, 0)]Исключение[/COLOR]: приставки к фамилиям, например: DeSanta, MacWeazy и так далее.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '4.08 - Никнейм без смысловой нагрузки',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.08[/COLOR] - Никнейм без смысловой нагрузки.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.08[/COLOR]. Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: Super_Man, Vlados_Vidos, Machine_Killer — это неправильные Role Play игровой никнеймы, в которых содержатся определенные ошибки.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '4.09 - Оскорбительный никнейм',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.09[/COLOR] - Оскорбительный никнейм.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.09[/COLOR]. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные), а также слова политической или религиозной направленности | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/FONT][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '4.10 - Копирование никнейма',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.10[/COLOR] - Копирование никнейма.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.10[/COLOR]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: подменять букву i на L и так далее, по аналогии.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '4.14 - Неактивность ТК/СК',
    content:
          '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый {{ user.name }}[/COLOR][/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Игрок будет наказан по пункту правил [COLOR=#FF0000]4.14[/COLOR] - Неактивность ТК/СК.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)]4.14[/COLOR]. Запрещено, имея транспортную или строительную компанию, не проявлять активность в игре | [COLOR=rgb(255, 0, 0)]Обнуление компании без компенсации[/COLOR].[/FONT]<br>' +
     '[COLOR=rgb(255, 0, 0)]Примечание[/COLOR]: если не заходить в игру в течение 5 дней, не чинить транспорт в ТК, не проявлять активность в СК – компания обнуляется автоматически.[/CENTER]<br>' +
     '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
     '[SIZE=4][FONT=Verdana][CENTER][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR][/B][/CENTER][/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
 ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрение', 'pin');
        addButton('Одобрено', 'accepted');
        addButton('Отказано', 'unaccept');
        addButton('Закрыто', 'close');
        addButton('Ответы', 'selectAnswer');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
            });
        });
    });
 
    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }
// Заменяем функцию buttonsMarkup
function buttonsMarkup(buttons) {
    return `<div class="select_answer" style="
        max-height: 75vh;
        overflow-y: auto;
        padding: 20px;
        background: #1a1a1a;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        border: 1px solid #333;
    ">
        <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 10px;
        ">
        ${buttons
        .map(
            (btn, i) => {
                if (btn.title.includes('---')) {
                    // Стиль для разделителей-заголовков (темная тема)
                    const cleanTitle = btn.title.replace(/[-<>]/g, '').trim();
                    return `<div style="
                        grid-column: 1 / -1;
                        margin: 15px 0 10px 0;
                        padding: 10px 15px;
                        background: #2d2d2d;
                        border-left: 3px solid #4f46e5;
                        border-radius: 6px;
                        color: #e5e7eb;
                        font-weight: 600;
                        font-size: 13px;
                        letter-spacing: 0.5px;
                        text-align: left;
                        border: 1px solid #404040;
                    ">
                        <span style="
                            display: inline-block;
                            padding: 3px 8px;
                            background: #4f46e5;
                            color: white;
                            border-radius: 4px;
                            font-size: 11px;
                            margin-right: 8px;
                        ">§</span>
                        ${cleanTitle}
                    </div>`;
                } else {
                    // Стиль для обычных кнопок (темная тема)
                    return `<button id="answers-${i}" class="menu-button" style="
                        display: flex;
                        align-items: center;
                        padding: 12px 16px;
                        border: 1px solid #404040;
                        border-radius: 8px;
                        background: #262626;
                        color: #e5e5e5;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-align: left;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                        min-height: 44px;
                    ">
                        <div style="
                            width: 4px;
                            height: 20px;
                            background: #6b7280;
                            border-radius: 2px;
                            margin-right: 12px;
                            flex-shrink: 0;
                            transition: background 0.2s ease;
                        "></div>
                        <span class="button-text" style="flex: 1;">${btn.title}</span>
                    </button>`;
                }
            }
        )
        .join('')}
        </div>
    </div>`;
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
            },
            greeting: () =>
                4 < hours && hours <= 11
                    ? 'Доброе утро'
                    : 11 < hours && hours <= 18
                    ? 'Добрый день'
                    : 18 < hours && hours <= 21
                    ? 'Добрый вечер'
                    : 'Доброй ночи',
        };
    }
 
    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if (pin == false) {
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
        if (pin == true) {
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