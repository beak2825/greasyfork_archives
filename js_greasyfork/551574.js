// ==UserScript==
// @name         Скрипт by D.Lenfanova
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Скрипт для Крутых
// @author       Lenfanov
// @match        *https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/551574/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20DLenfanova.user.js
// @updateURL https://update.greasyfork.org/scripts/551574/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20DLenfanova.meta.js
// ==/UserScript==


(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content:
          '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
         '[FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br> [/CENTER][/FONT]',
    },
    {
      title: 'Одобрено, закрыто',
      content: '[SIZE=5][FONT=Georgia][Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color] [/CENTER][/FONT][/SIZE]',
    },
    {
      title: 'Отказано, закрыто',
      content: '[SIZE=5][FONT=Georgia][Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color] [/CENTER][/FONT][/SIZE]',
    },
    {
      title: 'На рассмотрении...',
      content: '[SIZE=5][FONT=Georgia][Color=Orange][CENTER]На рассмотрении...[/CENTER][/color][/CENTER][/FONT][/SIZE]',
    },
    {
      title: 'На рассмотрение',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: true,
        },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Будет проведена беседа с лидером',
      content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок./[color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]С лидером будет проведена беседа, по данной жалобе.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа по данной жалобе',
      content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B] С лидером будет проведена работа, по данной жалобе [/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title:'Будет проведена беседа с заместителем',
        content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]С заместителем будет проведена беседа, по данной жалобе.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:ACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Будет проведена работа по данной жалобе с заместителем',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]С заместителем будет проведена работа, по данной жалобе.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:ACCСEPT_PREFIX,
        status: false,
    },
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title:'Отсутствует /time',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]На доказательствах отсуствует /time.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Отстутсвует nickname лидера в заголовке жалобы',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]1.2. В названии темы необходимо указать никнейм лидера, на которого подается жалоба, и суть жалобы: "Nick_Name | Суть жалобы".[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Срок написания жалобы составляет два дня',
        content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Жалоба от 3-го лица',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
         {
        title:'Доказательства предоставлены не в первоначальном виде',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.7. Доказательства должны быть в первоначальном виде.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
         {
        title:'Отсутствуют доказательства',
        content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от лидера выговор были выданы верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение лидера, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
     {
        title:'Проверив доказательства от лидера выговоры были выданы верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение лидера, выговоры вам были выданы верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от заместителя выговор были выданы верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
      {
        title:'Проверив доказательства от заместителя выговоры были выданы верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, выговоры вам были выданы верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
         {
        title:'Проверив доказательства от лидера розыск был выдан верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение лидера, розыск вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
             {
        title:'Проверив доказательства от заместителя розыск был выдан верно',
        content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, розыск вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Техническому специалисту',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][COLOR=lavender]Ваша жалоба была передана Техническому Специалисту сервера. Ожидайте ответа.<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана Главному Администратору, ожидайте ответа.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Передано Специальному администратору',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[CENTER]Ваша жалоба была передана на рассмотрение Специальному Администратору.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/CENTER][/color]' +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: SPECY_PREFIX,
	  status: true,
  },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
   $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
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
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () =>
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}




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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }


function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
}
})();