// ==UserScript==
// @name         Kostroma ГС/ЗГС
// @namespace   https://forum.blackrussia.online
// @version      4.0.0
// @description  KF SKRIPT 
// @author       Nuserik Detta
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560285/Kostroma%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/560285/Kostroma%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const buttons = [
     {
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
        title: '-------------------------------------------------------------------- Свой Ответ ------------------------------------------------------------------------',
         },
        {
    title: `------------------------------------------------------>>>>>   Жалобы на Лидеров   <<<<<------------------------------------------------------`,
 },
    {
      title: `Одобрено`,
    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][CENTER] Лидер получит наказание [/CENTER][I][B]<br>" +
    "[B][I][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE][I] [/CENTER][/color][/FONT][B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    Status: false,
},
         {
      title: `Беседа ЛД`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#D1D5D8][FONT=georgia][CENTER] С лидером будет проведена беседа. [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: ACCEPT_PREFIX,
    Status: false,
},
        {
      title: `Лидер будет снят`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#D1D5D8][FONT=georgia][CENTER] Лидер был снят [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: ACCEPT_PREFIX,
    Status: false,
},
           {
      title: `Тема будет подкорректирована`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#D1D5D8][FONT=georgia][CENTER] Тема будет подкорректирована [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Рассмотрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: WATCHED_PREFIX,
    Status: false,
},
            {
      title: `Спасибо за инфу`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#E0E0E0][FONT=georgia][CENTER] Благодарим вас за предоставленную информацию. [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Рассмотрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: WATCHED_PREFIX,
    Status: false,
},
        {
    title: `--------------------------------------------------------->>>>>    На рассмотрение   <<<<<--------------------------------------------------------`,
},
{
    title: `На рассмотрение`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба взята [color=orange] на рассмотрение [/color], не создавайте копии темы [/color][/CENTER][/FONT][I][B]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: PIN_PREFIX,
    status: false,
},
        {
    title: `Запросил доказательства`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Запросил доказательства у лидера. Просьба не создавать подобных тем. [/color][/CENTER][/FONT][I][B]<br>"+
     "[I][B][color=orange][FONT=georgia][CENTER] [ICODE]На рассмотрении.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: PIN_PREFIX,
    status: false,
},
{
    title: `--------------------------------------------------------------->>>>>   Отказано   <<<<<---------------------------------------------------------------`,
},
{
    title: `Не по форме`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба составлена не по форме. Ознакомиться с формой для подачи жалоб можно тут: [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.1814875/']Правила подачи жалоб на лидеров. [/URL][/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
        {
    title: `Через соц сети`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Загрузка доказательств в соц. сети (ВКонтакте, instagram и тд) запрещена. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
            {
    title: `Доква отредактированы`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваши доказательства отредоктированы. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: `Нарушений со стороны лидера нет`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Нарушений со стороны лидера нет. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
        {
    title: `В жалобы на игроков`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел Жалобы на игроков. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
         {
    title: `В жалобы на адм`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел Жалобы на администрацию.[/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
               "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
         {
    title: `В обжалование наказаний`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел Обжалование наказаний. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано,закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
        {
    title: `В жалобы на Ст. состав`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Обратитесь в жалобы на сотродников или в жалобы на старший состав [/color][/CENTER][/FONT][I][B]<br>" +
    "[color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
               {
    title: `Повторная жалоба`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Прекратите создавать копии жалобы, иначе ваш форумный аккаунт будет заблокирован [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
                   {
    title: `Более 48 часов`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] С момента выдачи наказания прошло более 48-и часов. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
              {
    title: `Не работают доква`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваши доказательства не рабочие или же в закрытом доступе. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
              {
    title: `Нет /time`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] На предоставленных доказательствах нет /time. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE]Отказано, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [[COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
                      {
    title: `От 3-го лица`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба написана от 3-го лица. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
     prefix: UNACCEPT_PREFIX,
     status: false,
},
                    {
    title: `Нет докв`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] В вашей жалобе нету доказательств. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
     prefix: UNACCEPT_PREFIX,
     status: false,
},
 
 {
    title: `------------------------------------------------>>>>>   Ответы на заявки на ЛД ОПГ  <<<<<--------------------------------------------------`,
        },
         {
title: '| ЛД БАТ |',
	  content:
    `[I][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#4347CB] *Батыревская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
       "[I][B][color=#EFEFEB][FONT=georgia][CENTER]После одобрение, с вами свяжится ГС/ЗГС ОПГ. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу. Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информацию о привязках и так далее. Не ведитесь на обманы! Всем одобренным кандидатам, желаю удачи на обзвоне![/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Уважаемые кандидаты, перед обзвон поставьте префикс[/COLOR][color=#F44F48][K/LD/B-OPG] NickName [/CENTER][I][B][/COLOR]<br>" ,
    },
             {
title: '| ЛД АРЗ |',
	  content:
    `[I][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#0F7E07] *Арзамасская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
       "[I][B][color=#EFEFEB][FONT=georgia][CENTER]После одобрение, с вами свяжится ГС/ЗГС. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу. Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информацию о привязках и так далее. Не ведитесь на обманы! Всем одобренным кандидатам, желаю удачи на обзвоне![/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Уважаемые кандидаты, перед обзвон поставьте префикс[/COLOR][color=#F44F48][K/LD/A-OPG] NickName [/CENTER][I][B][/COLOR]<br>" ,
    },
             {
title: '| ЛД ЛЫТ |',
	  content:
    `[I][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#E7F202] *Лыткаринская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
       "[I][B][color=#EFEFEB][FONT=georgia][CENTER]После одобрение, с вами свяжится ГС/ЗГС. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу. Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информацию о привязках и так далее. Не ведитесь на обманы! Всем одобренным кандидатам, желаю удачи на обзвоне![/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Уважаемые кандидаты, перед обзвон поставьте префикс[/COLOR][color=#F44F48][K/LD/L-OPG] NickName [/CENTER][I][B][/COLOR]<br>" ,
    },
 
        {
    title: `--------------------------------------------------------------->>>>>   ГС/ЗГС  <<<<<---------------------------------------------------------------`,
        },
 {
    title: `--------------------------------------------------------------->>>>>   Отказано   <<<<<---------------------------------------------------------------`,
},
              {
    title: `Через соц сети`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Загрузка доказательств в соц. сети (ВКонтакте, instagram и тд) запрещается. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
                 {
    title: `От 3-го лица`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба написана от 3-го лица. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                       "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
            {
    title: `Доква отредактированы`,
    content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#E0E0E0D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваши доказательства отредактированы. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
              {
    title: `Нет /time`,
    content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] На предоставленных доказательствах нет /time. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
      {
    title: `Нет нарушений`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Нарушений со стороны Лидера и заместителя нет. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
      {
    title: `Не по форме`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба написана не по форме. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE] Отказано.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
               {
    title: `Нет докв`,
    content:
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] В вашей жалобе нету доказательств. [/color][/CENTER][/FONT][I][B]<br>" +
    "[color=red][FONT=georgia][CENTER] [ICODE]Отказано.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
     status: false,
},
                          {
    title: `От 3-го лица`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба написана от 3-го лица. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
     status: false,
},
         {
    title: `--------------------------------------------------------------->>>>>   Одобрено   <<<<<---------------------------------------------------------------`,
},
            {
    title: `Заместитель получит выговор`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Заместитель получит выговор. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER][ICODE] Одобрено, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
              {
    title: `Заместитель получит предупреждение`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Заместитель получит предупреждение. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER][ICODE] Одобрено, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
               {
    title: `Будет проведена беседа`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] С Лидером и заместителем будет проведена беседа. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
               {
    title: `Будет снят`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER]{{ greeting }},  уважаемый игрок[/CENTER][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Заместитель будет снят. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=green][FONT=georgia][CENTER][ICODE] Одобрено, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=Yellow]KOST[/COLOR] [COLOR=Blue]ROMA[/COLOR] [COLOR=crimson][/COLOR]",
    status: false,
},
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('ГА', 'mainAdmin');
        addButton('Меню', 'selectAnswer');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
 
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
 
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });
 
 
    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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