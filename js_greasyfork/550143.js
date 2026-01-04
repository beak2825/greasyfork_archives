// ==UserScript==
// @name         Скрипт для руководства сервера.
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт для руководства сервера..
// @author       Skay_Eagle
// @match        https://forum.blackrussia.online/*
// @grant        none
// @icon https://i.postimg.cc/NfbCHpnx/img-logo-br-big.png
// @downloadURL https://update.greasyfork.org/scripts/550143/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550143/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
        title: 'Приветствие',
        content:
        '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
    },
        {
        title: '__________________________________Жалобы на администрацию_____________________________________',
        style: 'background:  color: #000; font-weight: bold; border-radius: 3px; padding: 3px 6px; text-align: center; letter-spacing: 1px; box-shadow: 0 0 5px rgba(255, 216, 77, 0.8), 0 0 10px rgba(255, 179, 0, 0.6), 0 0 15px rgba(46, 125, 50, 0.6);',
    },
        {
	  title: 'Запросить док-ва у администратора',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Запрошу доказательства у администратора.<br>" +
            "Ожидайте вынесения вердикта.<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
	  title: 'Наказание выдано верно',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][B]Доказательства предоставлены, наказание выдано верно.<br>" +
            "Ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/'][U]Правила проекта[/U][/URL].<br>" +
            "Отказано,закрыто.[/B][/FONT][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Наказание выдано неверно',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше наказание будет снято в течение дня(Если имеется).<br>" +
            "С администратором будет проведена необходимая работа.[/FONT][/B]<br>" +
            "[FONT=verdana][B]Приносим извинения за доставленные неудобства.[/B][/FONT]<br>" +
            "[B][FONT=verdana]Приятной игры и времяпрепровождения.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
      title: 'Нарушений со стороны администратора нет',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Нарушений со стороны администратора не обнаружено.<br>" +
            "Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Срок подачи жалобы истёк',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Срок подачи жалобы истёк.<br>" +
            "Жалоба рассмотрению не подлежит.<br>" +
            "Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
      title: 'Недостаточно доказательств для рассмотрения жалобы',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Недостаточно доказательств для корректного рассмотрения Вашей жалобы.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
        title: '________________________________________Обжалования________________________________________',
        style: 'background:  color: #000; font-weight: bold; border-radius: 3px; padding: 3px 6px; text-align: center; letter-spacing: 1px; box-shadow: 0 0 5px rgba(255, 216, 77, 0.8), 0 0 10px rgba(255, 179, 0, 0.6), 0 0 15px rgba(46, 125, 50, 0.6);',
    },
        {
	  title: 'Обжалование отказано',
	  content:
    '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][B][FONT=verdana]Ваше наказание обжаловано не будет.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
    prefix: OTKAZANO_PREFIX,
    status: false,
},
        {
	  title: 'Обжалование одобрено',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше обжалование одобрено.<br>" +
"В течение дня Ваше наказание будет снижено.<br>" +
"Надеюсь Вы осознали свою ошибку и больше такого от вас не повторится.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	  title: 'Наказание уже было снижено',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Наказание было снижено в прошлом обжаловании.<br>" +
"Повторного снижения не будет.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Обжалование не рассматривается',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Наказания подобного типа обжалованию не подлежат согласно правилам проекта.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
        title: 'Условия обжалования нрп обмана',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Для обжалования наказания нужно что бы Вы связались с пострадавшей стороной и оба дали согласия на возврат имущества.<br>" +
"После согласия повторно подайте обжалование.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Нрп обман - стадия 1',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER]Для обжалования наказания - необходимо чтобы обманутая сторона подтвердила Ваше условие на возврат имущества под моим профилем форумного аккаунта - у Вас есть 24 часа.<br>" +
"На рассмотрении...<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Нрп обман - стадия 2',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][B]В течении дня Ваш игровой аккаунт будет разблокирован на 24 часа для возврата имущества обманутой стороне.<br>" +
"Просьба пострадавшему отписать под моим профилем как ущерб будет возмещён, Вы в эту очередь предоставляется видео-запись возврата.<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Нрп обман - стадия 3',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше наказание будет заменено на ban 30 дней.<br>" +
"Надеюсь Вы осознали свою ошибку и больше от Вас такого не повторится.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
        title: 'Смена ника - разбан',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваш игровой аккаунт будет разблокирован на 24 часа для смены NickName.<br>" +
"С помощью /mm>8 смените свой NickName.<br>" +
"На рассмотрении...[/FONT][/B][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
        title: 'Смена ника - сменил',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]NickName был сменён.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
            title: 'ППВ',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
"[CENTER][FONT=verdana][B][SIZE=4]Для обжалования наказания заполните следующую форму - [URL='https://docs.google.com/forms/d/e/1FAIpQLSdjLc-S3Y3H6ImlFtSBwQoNOGlJ7JYuKoP_QYmgltjlm_8-Cw/viewform']Кликабельно[/URL]<br>" +
"На рассмотрении...[/SIZE][/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
        title: '________________________________________Прочие ответы________________________________________',
        style: 'background:  color: #000; font-weight: bold; border-radius: 3px; padding: 3px 6px; text-align: center; letter-spacing: 1px; box-shadow: 0 0 5px rgba(255, 216, 77, 0.8), 0 0 10px rgba(255, 179, 0, 0.6), 0 0 15px rgba(46, 125, 50, 0.6);',
    },
        {
            title: 'Тема составлена не по форме',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER]Ваша тема составлена не по форме.<br>" +
            "[CENTER]Ознакомьтесь с правилами подачи жалоб - [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202/'][U]Правила подачи жалоб[/U][/URL]<br>" +
            "Отказано,закрыто.[/FONT][/B][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
        title: 'Тема на рассмотрении',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ставлю Вашу тему на рассмотрение.<br>" +
            "Ожидайте вынесения вердикта.[/FONT][/B][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Доказательства с Соц.Сетей',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства с социальных сетей не принимаются.<br>" +
"Загрузите доказательства на Imgur/YouTube/Япикс и тому подобные источники.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Ответ был дан в прошой теме',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ответ был дан в прошлой теме.[/FONT][/B]<br>" +
"[FONT=verdana][B]Просьба не создавать аналогичные темы,иначе Ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>" +
"[B][FONT=verdana]Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
                        prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Тема поданна от 3-его лица',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Тема подана от 3-го лица.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'Суть/цель темы неясна',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Суть/цель Вашей темы неясна.<br>" +
"Создайте новую тему и распишите всю информацию более детальнее.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Доказательства подвергались редактированию',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства подвергались редактированию.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
        title: 'Отсутствуют/не работают доказательства',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]В Вашей теме отсутствуют/не работают доказательства.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Игрок словил бан по IP - ошибка',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Возможно Вы словили IP адрес другого человека.<br>" +
"Воспользуйтесь VPN или перезагрузите роутер.<br>" +
"Спасибо за обращение, закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
    title: '__________________________________________Передача тем__________________________________________',
    style: 'background:  color: #000; font-weight: bold; border-radius: 3px; padding: 3px 6px; text-align: center; letter-spacing: 1px; box-shadow: 0 0 5px rgba(255, 216, 77, 0.8), 0 0 10px rgba(255, 179, 0, 0.6), 0 0 15px rgba(46, 125, 50, 0.6);',
},
        {
	  title: 'Передать тему СА',
	  content:
    '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][B][FONT=verdana]Передаю Вашу тему Специальному Администратору.<br>" +
    "[FONT=verdana][B]Ожидайте вынесения вердикта.<br>",
    prefix: SPECADMINY_PREFIX,
    status: true,
        },
        {
	  title: 'Передать тему ГА',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю Вашу тему Главному Администратору.[/FONT][/B]<br>" +
            "[FONT=verdana][B]Ожидайте вынесения вердикта.<br>",
            prefix: GLAVNOMYADMINY_PREFIX,
            status: true,
        },
        {
	  title: 'Передать тему ЗГА',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю Вашу тему Заместителю Главного Администратора.[/FONT][/B]<br>" +
            "[FONT=verdana][B]Ожидайте вынесения вердикта.<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
	  title: 'Передать тему РМ',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю Вашу тему Руководителю Модерации.[/FONT][/B]<br>" +
"[FONT=verdana][B]Ожидайте вынесения вердикта.<br>",
            prefix: GLAVNOMYADMINY_PREFIX,
            status: true,
        },
        {
	  title: 'Перенаправить в тех.раздел',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Наказание выдано техническим специалистом.<br>" +
            "Обратитесь в [URL='https://forum.blackrussia.online/forums/Технический-раздел.22/'][U]Технический раздел[/U][/URL] --> [URL='https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/'][U]Жалобы на технических специалистов[/U][/URL].<br>" +
            "Спасибо за обращение,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
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
        countElementGA.textContent = 'ГА: ' + count_ga + ' ||';

        var countElementNaRassmotrenii = document.createElement('span');
        countElementNaRassmotrenii.style.marginLeft = '10px';
        countElementNaRassmotrenii.style.fontSize = '1.4rem';
        countElementNaRassmotrenii.style.color = getColor(count_na_rassmotrenii);
        countElementNaRassmotrenii.textContent = 'На рассмотрении: ' + count_na_rassmotrenii + ' ||';

        var countElementSA = document.createElement('span');
        countElementSA.style.marginLeft = '10px';
        countElementSA.style.fontSize = '1.4rem';
        countElementSA.style.color = getColor(count_sa);
        countElementSA.textContent = 'СА: ' + count_sa;

        var arrowIcon = firstHeader.querySelector('.uix_threadCollapseTrigger');
        firstHeader.insertBefore(countElementGA, arrowIcon);
        firstHeader.insertBefore(countElementNaRassmotrenii, arrowIcon);
        firstHeader.insertBefore(countElementSA, arrowIcon);

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
    addButton('Рассмотрено', 'rassmotreno');
    addButton('На рассмотрении', 'pin');
    addButton('Закрыто', 'unaccept');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'otkaz');
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
      `<button type="button" class="button rippleButton" id="${id}" style="background-color: gray; margin: 10px;border-radius: 10px;">${name}</button>`,
    );
  }

  function buttonsMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}"
                 class="button--primary button rippleButton"
                 style="margin:5px; ${btn.style || ''}">
            <span class="button-text">${btn.title}</span>
        </button>`
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