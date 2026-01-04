// ==UserScript==
// @name         Скрипт для ЗГС/ГС
// @namespace    https://forum.blackrussia.online/
// @version      0.1
// @description  Created for GOSS and OPG
// @author       Artem_Gogol
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums*
// @include      https://forum.blackrussia.online/forums
// @grant        none
// @license 	 KF
// @icon https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @downloadURL https://update.greasyfork.org/scripts/559537/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/559537/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const NARASSSMOTRENII_PREFIX = 2;
    const OTKAZANO_PREFIX = 4;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMOTRENO_PREFIX = 9;
    const buttons = [
        {
        title: 'Приветствие(шаблон без отправки)',
        content:
        '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
    },
        {
        title: '_____________________________________________ЖАЛОБЫ НА ЛИДЕРОВ____________________________________________'
    },
     {
      title: 'Одобрено, закрыто',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Лидер получит наказание, больше такого не повторится.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]✿❯────「Ожидайте ответа...」────❮✿[/ICODE][/COLOR][/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
	  status: true,
    },
         {
      title: 'Рассмотрено(изменить текст)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE](текст)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Рассмотрено, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: RASSMOTRENO_PREFIX,
	  status: false,
    },
         {
      title: 'Снятие наказания, беседа с лд',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Наказание будет снято, а с лидером будет проведена профилактическая беседа.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Рассмотрено, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
      title: 'Беседа с лд',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]С лидером будет проведена профилактическая беседа.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Рассмотрено, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
        {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Причины отказа - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
        },
         {
      title: 'Док-ва не работают',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Доказательства отсутствуют или не работают.<br>Загрузите доказательства на фотохостинг.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
       {
        title: 'Не по форме',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Жалоба составлена не по форме.<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться с [/COLOR] [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']правилами подачи жалоб на лидеров.[/URL][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: ZAKRITO_PREFIX,
      status: false,
        },
         {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Жалоба подана 3-м лицом, рассмотрению не подлежит.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ZAKRITO_PREFIX,
	  status: false,
    },
          {
      title: 'Доквы предоставлены',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Доказательства предоставлены, наказание выдано верно.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
         {
      title: 'Свой отказ(изменить текст)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Здравствуйте, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE](текст)[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
];

var titles = document.getElementsByClassName('structItem-title');
    var count_ojidanie = 0;
    var count_ga = 0;
    var count_na_rassmotrenii = 0;
    var count_sa = 0;

    for (var i = 0; i < titles.length; i++) {
        var prefix_ojidanie = titles[i].querySelector('.labelLink .label--silver');
        if (prefix_ojidanie && prefix_ojidanie.textContent.trim() === 'Ожидание') {
            count_ojidanie++;
        }
        var prefix_ga = titles[i].querySelector('.label.label--red');
        if (prefix_ga && prefix_ga.textContent.trim() === 'Главному администратору') {
            count_ga++;
        }
        var prefix_na_rassmotrenii = titles[i].querySelector('.label.label--orange');
        if (prefix_na_rassmotrenii && prefix_na_rassmotrenii.textContent.trim() === 'На рассмотрении') {
            count_na_rassmotrenii++;
        }
        var prefix_sa = titles[i].querySelector('.label.label--accent');
        if (prefix_sa && prefix_sa.textContent.trim() === 'Специальному администратору') {
            count_sa++;
        }
    }

    function getColor(count) {
        if (count < 7) {
            return 'lime';
        } else if (count >= 7 && count < 15) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    var headers = document.getElementsByClassName('block-minorHeader uix_threadListSeparator');
    if (headers.length > 0) {
        var firstHeader = headers[0];
        var secondHeader = headers[1];

        var countElementGA = document.createElement('span');
        countElementGA.style.marginLeft = '10px';
        countElementGA.style.fontSize = '1.4rem';
        countElementGA.style.color = getColor(count_ga);

        var countElementNaRassmotrenii = document.createElement('span');
        countElementNaRassmotrenii.style.marginLeft = '10px';
        countElementNaRassmotrenii.style.fontSize = '1.4rem';
        countElementNaRassmotrenii.style.color = getColor(count_na_rassmotrenii);
        countElementNaRassmotrenii.textContent = 'На рассмотрении: ' + count_na_rassmotrenii;


        var arrowIcon = firstHeader.querySelector('.uix_threadCollapseTrigger');
        firstHeader.insertBefore(countElementGA, arrowIcon);
        firstHeader.insertBefore(countElementNaRassmotrenii, arrowIcon);

        var countElementOjidanie = document.createElement('span');
        countElementOjidanie.style.marginLeft = '10px';
        countElementOjidanie.style.fontSize = '1.4rem';
        countElementOjidanie.style.color = getColor(count_ojidanie);
        countElementOjidanie.textContent = 'Ожидание: ' + count_ojidanie;

        arrowIcon = secondHeader.querySelector('.uix_threadCollapseTrigger');
        secondHeader.insertBefore(countElementOjidanie, arrowIcon);
    }

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы

    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(NARASSSMOTRENII_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ODOBRENO_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(ZAKRITO_PREFIX, false));
    $('button#rassmotreno').click(() => editThreadData(RASSMORTENO_PREFIX, false));
    $('button#otkaz').click(() => editThreadData(OTKAZANO_PREFIX, false));


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
      `<button type="button" class="button rippleButton" id="${id}" style="background-image: linear-gradient(to right, #000000 0%, #808080  51%, #000000  100%);margin: 10px;border-radius: 10px;">${name}</button>`,
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