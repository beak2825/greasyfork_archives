// ==UserScript==
// @name         BLACK | Script для руководства сервера by j.Murphy and Z.Litvinenko (GREY SILVER)
// @namespace    https://forum.blackrussia.online/
// @version      3.2.2
// @description  Скрипт для Руководства сервера by j.Murphy | изменен и доработан Z.Litvinenko
// @author       Куратор администрации Joseph Murphy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/557946/BLACK%20%7C%20Script%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20jMurphy%20and%20ZLitvinenko%20%28GREY%20SILVER%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557946/BLACK%20%7C%20Script%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20jMurphy%20and%20ZLitvinenko%20%28GREY%20SILVER%29.meta.js
// ==/UserScript==

    (function () {
    'use strict';

  const ACCEPT_PREFIX = 8; // префикс одобрено
  const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
  const GA_PREFIX = 12 // главному администратору
  const SPEC_PREFIX = 11 // спец админу
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
	const NO_PREFIX = 0;

    const ZB_TECH = 1191;
    const TECH = 488;
    const ZB_PLAYER = 470;
    const ZB_LEADER = 469;
    const OBJ = 471;

    const buttons = [
    {
        title: '----------------------------------------------------------| Жалобы на администратора |---------------------------------------------------------',
        content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
        {
        title: '| Запрос доказательств |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Запрошу у администратора все необходимые доказательства и предоставлю вам ответ, как только получу информацию[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
       status: true,
        },
        {
        title: '| Взято на рассмотрение|',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа в ближайшее время. Мы просим воздержаться от создания дубликатов данной темы. Благодарим за понимание[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
       status: true,
        },
        {
        title: '| Примем во внимание ситуацию |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Примем во внимание данную ситуацию, спасибо за предоставленную информацию[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(255,0,0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Наказание будет снято |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваше наказание будет снято[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| ВЕРДИКТ И МЕРЫ  |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] К администратору будут приняты меры, вердикт в жалобе будет изменён [/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
     "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| АДМИНИСТРАТОР ОШИБСЯ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] По результатам проверки было установлено, что администратор выдал вам наказание ошибочно. Наказание будет снято, приносим извинения за недоразумение [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Администратор прав |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Администратор предоставил все необходимые доказательства, подтверждающие правомерность решения. На основании представленных материалов наказание было назначено верно и в соответствии с правилами[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  CLOSE_PREFIX,
        status: false,
        },
        {
        title:'| Нарушений от администратора нет |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]  По итогам рассмотрения вашей жалобы нарушений со стороны администратора не выявлено. Действия администратора соответствуют установленным правилам и регламенту сервера[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Меры к администратору  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]После тщательной проверки поданной жалобы в отношении администратора будут приняты меры. Благодарим вас за информацию[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Меры к администратору и снятие наказания |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]  После тщательного рассмотрения вашей жалобы было принято решение о применении строгих мер в отношении администратора. Ваше наказание будет снято. Благодарим вас за предоставленную информацию[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Меры к куратору форума |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]К куратору форума будут приняты меры. Благодарим вас за информацию[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Меры к куратору форума и снятие наказаний  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]  В отношении куратора форума будут приняты строгие меры, и ваше наказание будет снято. Благодарим за ваше обращение[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Ответ в прошлой жалобе |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]  Ответ на вашу жалобу уже был дан в предыдущей теме. Пожалуйста, ознакомьтесь с ним там[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Недостаточно доказательств  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]   В вашей жалобе недостаточно доказательств для ее рассмотрения. Пожалуйста, предоставьте дополнительные сведения, такие как скриншоты, видеодоказательства и тд[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  UNACCEPT_PREFIX,
       status: false,
        },
        {
        title:'| Передать ЗГА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 0, 0)]Заместителю Главного Администратора.[/COLOR]  Он детально изучит ситуацию и примет соответствующее решение. Пожалуйста, ожидайте его ответа[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  PIN_PREFIX,
       status: true,
        },
        {
        title:'| Передать ГА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваша жалоба передана на рассмотрении [COLOR=rgb(255, 0, 0)]Главному Администратору @Alina_Svidskaya [/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  GA_PREFIX,
       status: false,
        },
        {
        title:'| Передать ЗГА | ГА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 0, 0)]Главному Администратору и Заместителю Главного Администратора.[/COLOR]  Один из них тщательно изучит все обстоятельства и примет решение в соответствии с правилами.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  PIN_PREFIX,
       status: true,
        },
        {
        title:'| Передать СА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваша жалоба передана на рассмотрении [COLOR=rgb(255, 255, 0)]Специальной Администрации.[/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: SPEC_PREFIX ,
       status:  true,
        },
        {
        title:'| Руководству модерации |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваша жалоба передана на рассмотрение [COLOR=rgb(30, 144, 255)] Руководству модерации.[/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: COMMAND_PREFIX ,
       status:  true,
        },
        {
        title:'| ОБРАТИТЕСЬ В РАЗДЕЛ ОБЖАЛОВАНИЕ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Вы ошиблись разделом, подайте обжалование в раздел Обжалование наказаний[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ОБРАТИТЕСЬ В ТЕХНИЧЕСКИЙ РАЗДЕЛ  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Для рассмотрения вашей жалобы, пожалуйста, обратитесь в технический раздел[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ОБРАТИТЕСЬ В ЖАЛОБЫ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Для рассмотрения вашей жалобы, пожалуйста, обратитесь в раздел Жалобы на технических специалистов[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Куратор форума прав |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] После проверки жалобы, поданной на вас другим игроком, было принято решение, что куратор форума вынес наказание справедливо и в соответствии с правилами[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ОТСУТСТВУЕТ ОКНО БЛОКИРОВКИ АККАУНТА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] В вашей жалобе отсутствует скриншот окна блокировки аккаунта[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Отсутствуют доказательства |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]В вашей жалобе отсутствуют необходимые доказательства. Пожалуйста, загрузите их на хостинги, например YouTube, Imgur, Япикс и другие, и прикрепите ссылку для дальнейшего рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Жалоба не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба составлена не по форме. Ознакомьтесь, пожалуйста, с правилами составления жалобы закрепленные в этом разделе[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  UNACCEPT_PREFIX,
       status: false,
        },
        {
        title:'| Загрузите доказательства на фото - видеохостинги  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Для рассмотрения вашей жалобы все доказательства должны быть загружены на доступные хостинги, такие как YouTube, Imgur, Япикс и другие. Просьба предоставлять ссылки, открытые для просмотра[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ДУБЛИРОВАНИЕ ТЕМ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Прекратите дублировать темы. Если вы продолжите, ваш форумный аккаунт будет заблокирован на 3 дня и более[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Отсутствует TIME |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]В вашей жалобе отсутствует необходимая информация — команда /time[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  UNACCEPT_PREFIX,
       status: false,
        },
        {
        title:'| ОШИБКА СЕРВЕРОМ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Вы ошиблись сервером. Пожалуйста, подайте жалобу в нужном разделе вашего сервера[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| НЕКАЧЕСТВЕННЫЕ ДОКАЗАТЕЛЬСТВА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваши доказательства предоставлены в плохом качестве. Пожалуйста, пересоздайте жалобу и загрузите материалы в более высоком качестве для корректного рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ОФФТОП |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша тема не относится к разделу Жалобы на администрацию. Пожалуйста, разместите свой вопрос или жалобу в соответствующем разделе для правильного рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| ФРАПС ОТВЕТНЫЙ ДМ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Доказательства были предоставлены администратором, и наказание было вынесено верно. Если вы утверждаете, что DM был ответными, пожалуйста, предоставьте соответствующие доказательства, чтобы мы могли пересмотреть решение[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| ПРОШЛО БОЛЕЕ 72 ЧАСА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как с момента выдачи наказания прошло 72 часа[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Отсутствует скриншот выдачи наказаний |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]В вашей жалобе отсутствует скриншот выдачи наказания. Пожалуйста, прикрепите необходимые доказательства для дальнейшего рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Жалоба от 3-его лица |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как она составлена от третьего лица. Жалобы принимаются только от непосредственного участника ситуации[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
        status: false,
        },
        {
        title: '| В жалобе нецензурные и оскорбительные слова |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как в ней содержатся оскорбительные и нецензурные выражения. Пожалуйста, оформите жалобу корректно, соблюдая правила общения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Смена наказания |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваше наказание будет заменено на другое[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Отсутствует ссылка |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Предоставьте ссылку на вашу жалобу для дальнейшего рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Доказательства отредактированы |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Предоставленные доказательства были изменены, поэтому ваша жалоба отклонена. Прикрепите исходное видео для повторного рассмотрения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Доказательства не открываются |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как предоставленные доказательства не открываются. Пожалуйста, загрузите их повторно в доступном формате[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Подделка доказательств  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба отклонена, так как доказательства были подделаны. Ваш форумный аккаунт будет заблокирован навсегда[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:  '| Бан по IP |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN. После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:   '|  АВтоматическое перемещение темы в ОБЖАЛОВАНИЕ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша тема перемещено в раздел Обжалование наказаний. Ожидайте ответа.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: WAIT_PREFIX,
       status: false,
       thread: OBJ,
        },
        {
        title:   '|  АВтоматическое перемещение темы в ЖАЛОБЫ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба была перемещена в Жалобы на технических специалистов нашего сервера для дальнейшего рассмотрения и решения[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: WAIT_PREFIX,
       status: false,
       thread: ZB_TECH,
        },
        {
        title: '----------------------------------------------------------------| Обжалование |---------------------------------------------------------------',
        content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
        {
        title:  '| Одобрить |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] По итогам рассмотрения вашего обжалования принято решение в вашу пользу. Обжалование одобрено, и ранее наложенное наказание будет полностью снято[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| Отказать |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] В обжаловании отказано[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Обжалованию не подлежит |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Принятое решение относительно вашего наказания является окончательным и не подлежит обжалованию.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Обжалование не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Ошиблись сервером |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Вы выбрали неправильный сервер для подачи обжалования. Пожалуйста, подайте свою жалобу в раздел, соответствующий вашему серверу[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Ошиблись сервером перенаправляю |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Вы выбрали неправильный сервер. Перенаправляю вас на нужный сервер для дальнейшего рассмотрения вашего обжалования.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Игрок вернул ущерб |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Спасибо за содействие. Впредь просим избежать подобных ошибок, так как возможность для повторного обжалования отсутствует[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| Снизить наказание до минимальных мер |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше наказание будет снижено до минимальных мер[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| Снизить до 30 дней |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше наказание было пересмотрено, и в итоге оно будет снижено до 30 дней[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| Снизить до 15 дней |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше наказание было пересмотрено, и в итоге оно будет снижено до 15 дней[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| Снизить до 7 дней |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше наказание было пересмотрено, и в итоге оно будет снижено до 7 дней[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(0, 255, 0)][I][B][FONT=georgia][SIZE=4]Одобрено[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  ACCEPT_PREFIX,
       status: false,
        },
        {
        title: '| грубое нарушение |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Обжалование отказано, поскольку наказание было вынесено в соответствии с тяжестью нарушений, таких как многочисленные нарушения правил сервера и грубое нарушение с вашей стороны.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Обжалование NRP обман |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Чтобы обжаловать наказание за НонРП обман, вам нужно самостоятельно связаться с пострадавшей стороной. После этого он обязан подать на вас обжалование, прикрепив доказательства, такие как договор о возврате имущества, ссылку на свою жалобу, скриншот окна блокировки и ссылки на ВКонтакте обеих сторон. По другому вы никак не сможете обжаловать наказание.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Обжалование NickName |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваш аккаунт разблокирован на 24 часа. Если вы не успеете сменить никнейм в течение этого времени, блокировка будет восстановлена. Для смены ника используйте команду /mm - Изменить имя и прикрепите подтверждение сюда.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вашего ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  PIN_PREFIX,
       status: true,
        },
        {
        title: '| Запрос ссылки вк |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Прикрепите ссылку на ваш Вконтакте[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вашего ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  PIN_PREFIX,
       status: true,
        },
        {
        title:  '| Обжалование ппв  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Восстановите пароль через официальную группу ВКонтакте, после чего пересоздайте жалобу. Обязательно приложите скриншот, подтверждающий смену пароля, при этом скройте отображаемый пароль.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
	      {
        title:  '| Бан IP |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваш IP-адрес не был заблокирован напрямую — вы случайно попали на уже заблокированный IP. Для решения проблемы перезагрузите роутер или смените способ подключения к интернету[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Не осознали вину |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] В обжаловании отказано. В настоящее время мы не уверены, что вы полностью осознали последствия своего поступка[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Не готовы пойти на встречу |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Отстутствуют доказательства |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше обжалование не может быть принято к рассмотрению, так как в нём отсутствуют необходимые доказательства, которые подтверждают изложенные вами слова[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Отписал не тот игрок |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Вам в профиле написал не тот игрок которого вы обманули[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Отстутствует скрин окна бана  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта. Для рассмотрения необходимо приложить данный скриншот, чтобы подтвердить факт блокировки и указанные в ней причины [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| Дублирование тем |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Если вы дальше будете дублировать темы в данном разделе, то ваш форумный аккаунт будет заблокирован [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '|  Подделка доказательств  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Предоставленные вами доказательства признаны поддельными. В связи с нарушением правил форума, ваш форумный аккаунт будет заблокирован [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Уже есть мин. наказание  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]На данный момент вам уже назначено минимальное наказание, предусмотренное за данное нарушение[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Направить в раздел жб на адм |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]После рассмотрения вашего обжалования установлено, что изложенная вами ситуация касается действий администратора, а не непосредственно вынесенного наказания. В связи с этим дальнейшее рассмотрение данного вопроса должно осуществляться через раздел 'Жалобы на администрацию', подайте жалобу в необходимый раздел[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'| Доказательство в соц сети|',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Загрузка доказательств в социальные сети, такие как ВКонтакте и Instagram и тд, не разрешается. Все предоставляемые материалы должны быть размещены на специализированных фото- и видео-хостингах, таких как YouTube, Япикс, Imgur и другие подобные сервисы. Это необходимо для обеспечения надежности и доступности доказательств, а также для предотвращения возможных искажений или недоразумений при проверке информации.[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  NRP обман 24 часа |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Вы должны прислать видео доказательство возврата имущества в данную тему[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '|  Мут/джаил  |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваше наказание не столь строгое для обжалования[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title: '| оффтоп |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша тема никак не отностится к разделу обжалования наказаний[/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  CLOSE_PREFIX,
       status: false,
        },
        {
        title:'|  Передать ГА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше обжалование передано на рассмотрении [COLOR=rgb(255, 0, 0)]Главному Администратору @Alina_Svidskaya [/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix:  GA_PREFIX,
       status: false,
        },
        {
        title:'|  Передать СА |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше обжалование передано на рассмотрении [COLOR=rgb(255, 255, 0)]Специальной Администрации.[/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: SPEC_PREFIX ,
       status:  true,
        },
        {
        title:'| Руководству модерации |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Ваше обжалование передано на рассмотрение [COLOR=rgb(30, 144, 255)] Руководству модерации.[/COLOR][/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4] Приятной игры на нашем сервере  [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидайте ответа[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: COMMAND_PREFIX ,
       status:  true,
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
        editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].thread);
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

function editThreadData(prefix, pin = false, thread = 0) {
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

    if(thread != 0) {
        moveThread(prefix, thread)
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