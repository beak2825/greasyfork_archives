// ==UserScript==
// @name         Для кураторов форума N. Novgorod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для облегчения работы кураторов форума. Связь с разработчиком: https://vk.com/gold_chell
// @author       Ярослав Голдчелл || Jarik_Goldchell
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549629/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod.user.js
// @updateURL https://update.greasyfork.org/scripts/549629/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod.meta.js
// ==/UserScript==

(function() {
  'use strict';
const UNACCEPT_PREFIX = 4; //Префикс Отказано
const ACCEPT_PREFIX = 8; //Префикс Одобрено
const RASSMOTENO_PREFIX = 9; //Префикс Рассмотрено
const VAJNO_PREFIX = 1; //Префикс Важно
const PIN_PREFIX = 2; //Префикс На рассмотрении
const GA_PREFIX = 12; //Префикс Главному администратору
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14; //Префикс Ожидание
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; //Префикс Закрыто
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13; //Префикс Тех. Специалисту
const buttons = [
   {
     title: 'Свой ответ (Закрыто)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/NjKrYTkB/image2-3-1-1-1-10.gif[/img][/url][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#bf0202][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
{
    title: 'На рассмотрение',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: PIN_PREFIX,
 status: true,
},
  {
   title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передать жалобу ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
title: 'Теху', //На доработке
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Техническому специалисту. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: TEX_PREFIX,
status: 123,
},
{
title: 'ГКФ',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Главному Куратору Форума. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Куратору',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Куратору Администрации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'ЗГА',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'ГА',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Главному Администратору. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: GA_PREFIX,
status: true,
},
     {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RP процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
   {
     title: 'nRP поведение[2.01]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Примечание]Примечание: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Уход от RP[2.02]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Примечание]Примечание: уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'nRP drive[2.03]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Примечание]Примечание: езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Помеха игр. процессу[2.04]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Пример]Пример: таран дальнобойщиков, инкассаторов под разными предлогами.[/SPOILER][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'nRP обман [2.05]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'амораллные действия[2.08]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Исключение]Исключение: обоюдное согласие обеих сторон.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Слив склада[2.09]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.09.[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Т/С фракции в лич. целях[2.11]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'DB[2.13]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Исключение]Исключение: разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'TK[2.15]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства) [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'SK[2.16]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'MG[2.18]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: телефонное общение также является IC чатом.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Исключение]Исключение: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'DM[2.19]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Mass DM[2.20]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Обход системы / Багаюз[2.21]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.21.[/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов) [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Постороннее ПО[2.22]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Исключение]Исключение: разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Исключение]Исключение: блокировка за включенный счетчик FPS не выдается.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Реклама[2.31]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Примечание]Примечание: если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Уязвимость правил[2.33]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.33.[/COLOR] Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Розжиг межнац. конфликта(-ов)[2.35]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'OOC угрозы / Угрозы наказанием от адм[2.37]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней. [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Оск. проекта[2.40]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Продажа промо[2.43]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.43.[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'ЕПП[2.46]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Исключение]Исключение: разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'ЕПП фура[2.47]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 мину [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Арест в интерьере[2.50]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации [/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'nRP аксессуар[2.52]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
       "[CENTER][SPOILER=Пример]Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Оск. Администрации[2.54]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Баг с аним(сбив) [2.55]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Пример]Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Не возрат долга[2.57]',
     content:
       "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
       "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban [/FONT][/COLOR][/B][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/SPOILER][/CENTER] <br>" +
        "[CENTER][SPOILER=Примечание]Примечание: жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/SPOILER][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
   },
    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
   {
     title: 'CapsLock[3.02]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.02.[/COLOR] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут. [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: ПрОдАм, куплю МАШИНУ.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,

},
   {
     title: 'Оскорбление в OOC[3.03]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,

},
   {
     title: 'Оск/Упом родных[3.04]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Примечание]Примечание: термины MQ, rnq расценивается, как упоминание родных.[/SPOILER][/CENTER] <br>" +
     "[CENTER][SPOILER=Исключение]Исключение: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,

},
   {
     title: 'Flood[3.05]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,

},
   {
     title: 'Злоуп. символами[3.06]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,

},
   {
     title: 'Слив[3.08]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Выдача себя за адм[3.10]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Ввод в заблуждение[3.11]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Примечание]Примечание: /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Оффтоп/Капс/Мат в репорт[3.12]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.12.[/COLOR] Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Музыка в Voice[3.14]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.14.[/COLOR] Запрещено включать музыку в Voice Chat | Mute 60 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Шум в Voice[3.16]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Примечание]Примечание: Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Политика[3.18]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Транслит[3.20]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.20.[/COLOR] Запрещено использование транслита в любом из чатов | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: «Privet», «Kak dela», «Narmalna».[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Реклама промо[3.21]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Примечание]Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/CENTER] <br>" +
     "[CENTER][SPOILER=Исключение]Исключение: промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Объявления на ТТ ГОСС[3.22]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!![/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Мат в VIP чате[3.23]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
   },
      {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
   {
     title: 'Оск. nickname[4.09]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Fake nickname[4.10]',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan [/FONT][/COLOR][/B][/CENTER] <br>" +
     "[CENTER][SPOILER=Пример]Пример: подменять букву i на L и так далее, по аналогии.[/SPOILER][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: ACCEPT_PREFIX,
     },
     {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
      },
          {
            title: 'Работа в форме ГОС[1.07]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции  | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Т/С фракции в лич. целях[1.08]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]1.08.[/COLOR] Запрещено использование фракционного транспорта в личных целях  | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Одиночный патруль[1.11]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]1.11.[/COLOR] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Казино/БУ в форме ГОС[1.13]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Урон вне теры (МО) [2.02]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.02.[/COLOR] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено  | DM / Jail 60 минут / Warn [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Не по ПРО (СМИ) [4.01]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Не по ППЭ (СМИ) [4.02]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.02.[/COLOR] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Замена текста СМИ[4.04]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Урон без RP причины (УМВД/ГИБДД/ФСБ/ФСИН)',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br>  Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН | DM / Jail 60 минут / Warn [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'Розыск / штраф без причины [7.02]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]7.02.[/COLOR] Запрещено выдавать розыск, штраф без Role Play причины | Warn [/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
      },
          {
            title: 'nRP коп[6.03]',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]6.03.[/COLOR] Запрещено nRP поведение | Warn Примечание: поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ. [/FONT][/COLOR][/B][/CENTER] <br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: ACCEPT_PREFIX,
         status: false,
          },
  {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
          title: 'Провокация ГОС[2]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]2.[/COLOR] Запрещено провоцировать сотрудников государственных организаций | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'Провокация ОПГ на их тере[3]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]3.[/COLOR] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'Урон без причины на тере[4]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]4.[/COLOR] Запрещено без причины наносить урон игрокам на территории ОПГ | Jail 60 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'Дуэли[5]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]5.[/COLOR] Запрещено устраивать дуэли где-либо, а также на территории ОПГ | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'Перестрелки в людных местах[6]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]6.[/COLOR] Запрещено устраивать перестрелки с другими ОПГ в людных местах | Jail 60 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'реклама в /f[7]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]7.[/COLOR] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации | Mute 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'cкрыться от копа на базе[8]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br> [COLOR=#7800C9]8.[/COLOR] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'NRP В/Ч',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'Находится на тере бв лишний[1.06]',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок будет наказан по следующему пункту правил:<br>  [COLOR=#7800C9]1.06.[/COLOR] На территории проведения бизвара может находиться только сторона атаки и сторона защиты | Jail 30 минут [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'NonRP ограбление/похищение (Jail)',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia] Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'NonRP ограбление/похищение (Warn)',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia] Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
    },
        {
          title: 'NonRP ограбление/похищение (Ban)',
          content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia] Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
          prefix: ACCEPT_PREFIX,
       status: false,
        },
  {
   title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
  },
  {
    title: 'Ошибся разделом',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом. Переношу Вашу тему в нужный Вам раздел. Ожидайте вынесения вердикта. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
  {
    title: 'Ошибся сервером',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись сервером. Переношу Вашу тему в нужный Вам раздел. Ожидайте вынесения вердикта от администрации Вашего сервера. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
  {
    title: 'В ЖБ на АДМ',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2829/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В ЖБ на ЛД',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2830/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В обжалования',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2832/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В тех. раздел',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В ЖБ на теха',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В ЖБ Фракций',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В ЖБ на АП',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/forums/Раздел-для-хелперов-сервера.2840/'] кликабельно[/URL]. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: UNACCEPT_PREFIX,
    status: false,
  },{
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ ЖБ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
   {
     title: 'Не логируется',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам. Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Нарушений не найдено',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Нарушений со стороны данного игрока не было найдено. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Недостаточно доказательств',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Недостаточно доказательств на нарушение от данного игрока. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Дубликат (копия темы)',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Не по форме',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'] кликабельно[/URL]. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Отсутствует /time',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] На ваших доказательствах отсутствует /time. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Укажите тайм-коды',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов. В противном случае жалоба будет отказана.<br>[QUOTE][COLOR=#0044FF]Тайм-коды это:[/COLOR]<br>Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты.<br>[COLOR=RED]Пример:[/COLOR]<br>0:37 - Условия сделки.<br>0:50 - Сам обмен.<br>1:50 - Конец обмена.<br>2:03 - Сабвуфера нет.<br>2:06 - /time.[/QUOTE] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: PIN_PREFIX,
  status: 123,
},
   {
     title: 'Не указал тайм-коды',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус – Отказано. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Более 72 часов',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Социальные сети',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Нету условий сделки',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] В ваших доказательствах отсутствуют условия сделки. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Нужен фрапс',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Нужен фрапс + промотка чата',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, а также промотка чата. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Фрапс обрываеться',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваш фрапс обрывается, загрузите полный фрапс на YouTube. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Доказательства не работают',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Доказательства не работают. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Нету доказательств',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] В Вашей жалобе отсутствуют доказательства. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Доки отредактированы',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваши доказательства отредактированны. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'От 3-его лица',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Не написал ник',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Не подтвердил условия',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Игрок не подтвердил условия вашей сделки. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Закрыт доступ к Гугл диску',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фото/видео хостинг (YouTube, Япикс, imgur). [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Закрыт доступ к Яндекс диску',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фото/видео хостинг (YouTube, Япикс, imgur). [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Не доказал что владелец фамы',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Нет доказательств того, что Вы являетесь владельцем семьи. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Ответный DM',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] На вашем фрапсе видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). Вы будете наказаны по пункту правил:<br> [COLOR=#7800C9]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: RASSMOTENO_PREFIX,
  status: false,
},
   {
     title: 'Уже на рассмотрении',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Жалоба такого же содержания уже находится на рассмотрении. Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Долг ток через банк',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
},
   {
     title: 'Замены текста СМИ нет',
     content:
     "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=WHITE][FONT=georgia] Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/FONT][/COLOR][/B][/CENTER] <br><br>" +
     "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
     prefix: UNACCEPT_PREFIX,
  status: false,
   },


];

    $(document).ready(() => {
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

  addButton('ЖБ на игроков', 'selectAnswer');

const threadData = getThreadData();

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Жалобы на игроков. Выберите ответ');
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

function addButton(name, id) {
$('.button--icon--reply').before(
          `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
.map(
(btn, i) =>
  `<button id="answers-${i}" class="button--primary button ` +
  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
          discussion_open: 0,
    sticky: 1,
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: 'json',
    }),
  }).then(() => location.reload());
}
if(pin == 123){
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

//РП Био

(function() {
    'use strict';
const BIOUNACCEPT_PREFIX = 4;
const BIOACCEPT_PREFIX = 8;
const BIOPIN_PREFIX = 2;
const buttons2 = [
{
     title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
     title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
     title: 'Одобрено',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/CENTER] <br> <br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/B][/CENTER]<br><br>" +
    "[CENTER][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/CENTER] <br> <br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOACCEPT_PREFIX,
    status: false,
},
{
     title: 'На доработку',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Биография требует доработки (меньше 200 слов), вам дается 24 часа на ее дополнение.[/COLOR][/FONT][/COLOR][/B][/CENTER]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[CENTER][B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидаем, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOPIN_PREFIX,
    status: 123,
},
{
      title: 'Отказ',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Нарушение Правил написания RP биографий[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
       title: 'Отказ (заголовок)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Заголовок написан не по форме.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
  title: 'Отказ (пг)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено приписывать персонажу сверхспособности или вещи которые разрешают нарушать какое либо правило сервера. Пример: Сбежал из психушки и начал убивать людей.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (Существующая знаменитость)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено называть персонажа именем какого-то существующего известного человека.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (плагиат)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено использовать РП биографии других людей[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (орфограф. ошибки)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Биография должна быть читабельна и не содержать грамматических или орфографических ошибок.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (Шрифт, размер)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (отсутствие фото, иных материалов)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
   title: 'Отказ (не дополнил)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: Не дополнил(а) биографию за 24 часа[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (логика)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[CENTER][B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии не должно быть логических противоречий.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
 title: 'В ЖБ на АДМ',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3555/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на ЛД',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3554/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},
{
 title: 'В обжалования',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3556/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В тех. раздел',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-novgorod.3535/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на теха',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технического специалиста - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9680-novgorod.3533/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},
{
 title: 'В ЖБ на АП',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=YELLOW][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на агентов поддержки - [URL='https://forum.blackrussia.online/threads/n-novgorod-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.9898560/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: BIOUNACCEPT_PREFIX,
  status: false,
},

];

    $(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП биографии', 'selectAnswer2');

	const threadData = getThreadData();


$(`button#selectAnswer2`).click(() => {
XF.alert(buttonsMarkup(buttons2), null, 'РП биографии. Выберите ответ');
buttons2.forEach((btn, id) => {
if (id > 1) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons2[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons2[id].prefix, buttons2[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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

//-----------------------------------------------------------------------------------------------------------------
//-------------------------------------------РП Ситуации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const SITAUNACCEPT_PREFIX = 4;
const SITAACCEPT_PREFIX = 8;
const SITAPIN_PREFIX = 2;
const buttons3 = [
  {
    title: 'Свой ответ (Закрыто)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
    {
        title: 'Одобрена',
        content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Ваша РП ситуация получает статус - Одобрено.  Приятной игры и времяпровождения. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'На доработку',
        content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAPIN_PREFIX,
        status: false,
    },
    {
        title: 'Отказ',
        content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Ваша РП ситуация получает статус - Отказано [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAUNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Отказ (оффтоп)',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обращение никак не относится к сути данного раздела.  Закрыто.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на АДМ',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2829/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на ЛД',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2830/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2832/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В тех. раздел',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на теха',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ Фракций',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В ЖБ на АП',
      content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/forums/Раздел-для-хелперов-сервера.2840/'] кликабельно[/URL]. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП ситуации', 'selectAnswer3');

	const threadData = getThreadData();


$(`button#selectAnswer3`).click(() => {
XF.alert(buttonsMarkup(buttons3), null, 'РП ситуации. Выберите ответ');
buttons3.forEach((btn, id) => {
if (id > 1) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons3[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons3[id].prefix, buttons3[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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

//-----------------------------------------------------------------------------------------------------------------
//--------------------------Неофициальные RP организации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const NEOFUNACCEPT_PREFIX = 4;
const NEOFACCEPT_PREFIX = 8;
const NEOFPIN_PREFIX = 2;
const buttons4 = [
  {
    title: 'Свой ответ (Закрыто)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
{
    title: 'Одобрена',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
   "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=WHITE][FONT=georgia] Ваша Неофициальная RP организация получает статус - Одобрено.  Приятной игры и времяпровождения. [/FONT][/COLOR][/B] <br><br>" +
   "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
   "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: NEOFACCEPT_PREFIX,
    status: false,
},
{
    title: 'На доработку',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
   "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=WHITE][FONT=georgia] Вам даётся 24 часа на дополнение вашей неофициальной RP организации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
   "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
   "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: NEOFPIN_PREFIX,
    status: false,
},
{
    title: 'Отказ',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
   "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=WHITE][FONT=georgia] Ваша Неофициальная RP организация получает статус - Отказано [/FONT][/COLOR][/B] <br><br>" +
   "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
   "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: NEOFUNACCEPT_PREFIX,
    status: false,
},
{
  title: 'Отказ (оффтоп)',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обращение никак не относится к сути данного раздела.  Закрыто.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на АДМ',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2829/'] кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на ЛД',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2830/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В обжалования',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2832/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В тех. раздел',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на теха',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ Фракций',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на АП',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/forums/Раздел-для-хелперов-сервера.2840/'] кликабельно[/URL]. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: NEOFUNACCEPT_PREFIX,
  status: false,
},
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Неоф. RP организации', 'selectAnswer4');

	const threadData = getThreadData();

$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'Неофициальные RP организации. Выберите ответ');
buttons4.forEach((btn, id) => {
if (id > 1) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('🐰Script by J. Goldchell🐰', 'selectAnswer5');

	const threadData = getThreadData();

$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'Неофициальные RP организации. Выберите ответ');
buttons4.forEach((btn, id) => {
if (id > 1) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
