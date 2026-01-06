// ==UserScript==
// @name         Скрипт КФ logs 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Стиль - скрипт для тех. раздела с правилами
// @author       Nuserik Detta 
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://postimg.cc/1fqy8FGB
// @grant        none
// @license      nurgt
// @downloadURL https://update.greasyfork.org/scripts/561633/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20logs.user.js
// @updateURL https://update.greasyfork.org/scripts/561633/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20logs.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCСEPT_PREFIX = 4;
const ACCСEPT_PREFIX = 8;
const RESHENO_PREFIX = 6;
const PINN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;

const buttons = [
    {
      title: 'Приветствие',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>',
    },
    {
      title: 'На рассмотрении...',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша тема закреплена и находится на рассмотрении у администрации сервера[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - НОВЫЕ ПРАВИЛА (ГЛАВА 2) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Уход от RP [2.02]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.02.[/B] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Drive [2.03]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.03.[/B] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB [2.13]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.13.[/B] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM [2.19]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.19.[/B] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM [2.20]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.20.[/B] Запрещен Mass DM — убийство трех и более игроков | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - ЧАТ И НИКНЕЙМЫ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Meta Gaming [2.18]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]2.18.[/B] Запрещен MG (MetaGaming) — использование ООС информации в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. родных [3.04]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br>'+
        '[CENTER][B]3.04.[/B] Запрещено оскорбление или косвенное упоминание родных | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 255, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Покупка/Продажа ИВ [2.28]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на детальную проверку техническим специалистам.[/CENTER]<br>'+
        '[CENTER][B]2.28.[/B] Продажа или покупка игровой валюты строго запрещена. | [COLOR=rgb(255, 0, 0)]PermBan + ЧСП[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 165, 0)]На рассмотрении (Тех. спецу)[/COLOR][/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    }
  ];

  // --- Техническая часть (отрисовка) ---
  $(document).ready(() => {
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Ответы', 'selectAnswer');

    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, true));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, (btn.prefix ? true : false)));
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
      .map((btn, i) => `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`)
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
    }
  }

  function getThreadData() {
    const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    return {
      user: { id: authorID, name: authorName, mention: `[USER=${authorID}]${authorName}[/USER]` }
    };
  }

  function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    fetch(`${document.URL}edit`, {
      method: 'POST',
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        sticky: pin ? 1 : 0,
        _xfToken: XF.config.csrf,
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
