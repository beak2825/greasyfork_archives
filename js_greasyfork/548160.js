// ==UserScript==
// @name Cкрипт для КФ БИО by Anton_Bazalev || Purple (06)
// @namespace http://tampermonkey.net/
// @version 2.0
// @description Cкрипт для КФ БИО 06 PURPLE
// @author Anton_Bazalev
// @match https://forum.blackrussia.online/*
// @icon https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant none
// @license MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/548160/C%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%91%D0%98%D0%9E%20by%20Anton_Bazalev%20%7C%7C%20Purple%20%2806%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548160/C%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%91%D0%98%D0%9E%20by%20Anton_Bazalev%20%7C%7C%20Purple%20%2806%29.meta.js
// ==/UserScript==

(function () {
 'use strict';
 const UNACCСEPT_PREFIX = 4; // префикс отказано
 const ACCСEPT_PREFIX = 8; // префикс одобрено
 const PINN_PREFIX = 2; // префикс закрепить
 const SPECADM_PREFIX = 11; // специальному администратору
 const GA_PREFIX = 12; // главному адамнистратору
 const CLOSE_PREFIX = 7;
 const TEXY_PREFIX = 13;
 const REALIZOVANO_PREFIX = 5;
 const VAJNO_PREFIX = 1;
 const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
//const TotleEndOtkaz = "[B][CENTER][COLOR=lavender]✿❯────「Отказано, ❖ Закрыто」────❮✿[/COLOR]<br><br>";
//const TotleEndOdobreno = "[B][CENTER][COLOR=lavender]✿❯────「Одобрено, ❖ Закрыто」────❮✿[/COLOR]<br><br>";
const TotleEnd = "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>";
const TotlePhotoTxt1 =  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HsNNJFPW/RLwzo.png[/img][/url]<br>";
const buttons = [
{
 title: '| Приветствие |',
 content: 
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Текст <br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
},
{
 title: '| На рассмотрение |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба взята [COLOR=yellow]на рассмотрение[/COLOR],<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: NARASSMOTRENIIRP_PREFIX,
 status: true,
},
{
 title: '| Передать ГА |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=yellow]передана на рассмотрение Главному Администратору[/COLOR],<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: GA_PREFIX,
 status: true,
},
{
 title: '| Передать ГКФ/ЗГКФ |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба передана на рассмотрение [COLOR=blue]Главному Куратору Форума/Заместителю Главнго Куратора Форума.[/COLOR]<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: NARASSMOTRENIIRP_PREFIX,
 status: true,
},

  {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Био одобрена |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
					"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
                	  title: '| Био отказ (Реалист) |',
	  content:
	     		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила - нереалистичность Вашей биографии (OOC). <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
                	  title: '| Био отказ (Био сущ людей) |',
	  content:
	     		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила - написание биографии существующих людей.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Биография скопирована <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (не читабельна, ошибки) |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Биография нечитабельна или содержать грамматические или орфографические ошибки. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (шрифт, размер) |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Несоответствие шрифта или размера текста в вашей биографии <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
    	  title: '| Био отказ (Материалы) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Отсутствие фотографии и иные материалы, относящиеся к истории вашего персонажа. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Нар Правил серв) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - в биографию присутствуют факторы, позволяющие нарушать правила сервера. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (объём) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Нарушения объёма RP биографии <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
    	  title: '| Био отказ (лог противореч) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - присутствие логических противоречий в вашей RP биографии <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Био отказ (Уже одобрена) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило то, что Ваша предыдущая Биография уже получила статус Одобрено.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - большое количество ошибок. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
  {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ На Доработку ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
  {
                	  title: '| Био на доработку (Заголовок) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=yellow]На доработке[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br><br>"+
                                "[B][CENTER][COLOR=white][FONT=courier new]На внесение изменений дается 24 часа, в противном случаи Биография будет отказана<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
  {
    	  title: '| Био на доработку (объём) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=yellow]На доработке[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной послужило - Нарушения объёма RP биографии <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]На внесение изменений дается 24 часа, в противном случаи Биография будет отказана<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
 {
    	  title: '| Био на доработку (Материалы) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=yellow]На доработке[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной послужило - Отсутствие фотографии и иные материалы, относящиеся к истории вашего персонажа. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]На внесение изменений дается 24 часа, в противном случаи Биография будет отказана<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
  {
                	  title: '| Био на доработку (шрифт, размер) |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=yellow]На доработке[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной послужило - Несоответствие шрифта или размера текста в вашей биографии <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]На внесение изменений дается 24 часа, в противном случаи Биография будет отказана<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));


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
// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
  
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
	})();

    (function() {
    'use strict';

    // Массив стоковых цветов для дней недели
    const dayColors = {
        "Пн": "#cccccc",   // Пн (стоковый цвет)
        "Вт": "#cccccc",   // Вт
        "Ср": "#cccccc",   // Ср
        "Чт": "#cccccc",   // Чт
        "Пт": "#cccccc",   // Пт
        "Сб": "#cccccc",   // Сб
        "Вс": "#cccccc",   // Вс
    };

    // Массив цветов для изменения при наведении
    const hoverColors = {
        "Пн": "#FF5733",   // Пн
        "Вт": "#33FF57",   // Вт
        "Ср": "#3357FF",   // Ср
        "Чт": "#9C27B0",   // Чт
        "Пт": "#00BCD4",   // Пт
        "Сб": "#FFEB3B",   // Сб
        "Вс": "#8D6E63",   // Вс
    };

    // Функция для создания элемента с подсчетом
    function createCountElement(count, text, day) {
        var countElement = document.createElement('div');
        countElement.className = 'count-element';
        countElement.textContent = text + ': ' + count;

        // Получаем стоковый цвет для дня
        const color = dayColors[day] || "#cccccc";
        const hoverColor = hoverColors[day] || "#cccccc";

        // Стиль элемента с учетом стокового цвета
        countElement.style.fontFamily = 'Arial, sans-serif';
        countElement.style.fontSize = '14px';  // Уменьшаем размер шрифта
        countElement.style.color = '#ffffff';
        countElement.style.backgroundColor = color;  // Устанавливаем стоковый цвет
        countElement.style.padding = '5px';  // Уменьшаем отступы
        countElement.style.margin = '2px 0';  // Уменьшаем отступы между элементами
        countElement.style.borderRadius = '5px';
        countElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        countElement.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        // Анимация при наведении
        countElement.addEventListener('mouseover', function() {
            countElement.style.backgroundColor = hoverColor;  // Меняем цвет при наведении
            countElement.style.transform = 'scale(1.05)';
        });

        countElement.addEventListener('mouseout', function() {
            countElement.style.backgroundColor = color;  // Возвращаем стоковый цвет
            countElement.style.transform = 'scale(1)';
        });

        return countElement;
    }

    // Функция для получения дня недели и даты в формате ДД.ММ.ГГГГ
    function getDayOfWeekAndFullDate(dateString) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex];

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${dayOfWeek} ${day}.${month}.${year}`;
    }

    // Функция для получения даты создания темы
    function getThreadCreationDate(element) {
        const dateElement = element.querySelector('time[datetime]');
        if (dateElement) {
            const dateTimeString = dateElement.getAttribute('datetime');
            return dateTimeString.split('T')[0]; // Возвращаем только дату (без времени)
        }
        return null;
    }

    // Функция для проверки, находится ли тема в пределах текущей недели
    function isWithinCurrentWeek(threadDate) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const threadDateObj = new Date(threadDate);
        return threadDateObj >= oneWeekAgo && threadDateObj <= currentDate;
    }

    // Основная функция для подсчета элементов
    async function countElements() {
        // 1. Получаем все темы с нужными классами для "в ожидании" и "на рассмотрении"
        var elementsWaiting = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elementsUnderReview = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        // 2. Подсчитываем количество тем
        var waitingCount = elementsWaiting.length;
        var underReviewCount = elementsUnderReview.length;

        // 3. Получаем все темы на странице
        const currentPageThreads = document.querySelectorAll('.structItem.structItem--thread');

        // 4. Создаем объект для хранения количества тем по дням недели
        const weekCounts = {
            "Пн": {date: '', count: 0},
            "Вт": {date: '', count: 0},
            "Ср": {date: '', count: 0},
            "Чт": {date: '', count: 0},
            "Пт": {date: '', count: 0},
            "Сб": {date: '', count: 0},
            "Вс": {date: '', count: 0}
        };

        // 5. Перебираем все темы и считаем темы по дням недели
        currentPageThreads.forEach(element => {
            const threadDate = getThreadCreationDate(element);
            if (threadDate && isWithinCurrentWeek(threadDate)) {
                const dayOfWeekAndFullDate = getDayOfWeekAndFullDate(threadDate);
                const dayOfWeek = dayOfWeekAndFullDate.split(' ')[0];

                weekCounts[dayOfWeek].count++;
                weekCounts[dayOfWeek].date = dayOfWeekAndFullDate;
            }
        });

        // 6. Создаем контейнер для счетчика тем за неделю
        const counterContainerWeek = document.createElement('div');
        counterContainerWeek.style.position = 'absolute';
        counterContainerWeek.style.top = '10px';
        counterContainerWeek.style.left = '10px';
        counterContainerWeek.style.zIndex = '9999';
        counterContainerWeek.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerWeek.style.padding = '10px';
        counterContainerWeek.style.borderRadius = '8px';
        counterContainerWeek.style.color = '#fff';
        counterContainerWeek.style.fontFamily = 'Arial, sans-serif';
        counterContainerWeek.style.fontSize = '14px';
        counterContainerWeek.style.maxWidth = '300px';
        counterContainerWeek.style.maxHeight = '300px';
        counterContainerWeek.style.overflowY = 'auto';
        counterContainerWeek.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementWeek = document.createElement('div');
        headerElementWeek.textContent = 'Темы за неделю по дням:';
        headerElementWeek.style.fontWeight = 'bold';
        headerElementWeek.style.marginBottom = '10px';
        counterContainerWeek.appendChild(headerElementWeek);

        // Добавляем количество тем по дням недели в контейнер
        for (const day in weekCounts) {
            if (weekCounts[day].date !== '') {
                counterContainerWeek.appendChild(createCountElement(weekCounts[day].count, `${weekCounts[day].date}`, day));
            }
        }

        // 7. Создаем контейнер для счетчика тем в ожидании и на рассмотрении (в правом верхнем углу)
        const counterContainerStatus = document.createElement('div');
        counterContainerStatus.style.position = 'absolute';
        counterContainerStatus.style.top = '10px';  // Размещаем в верхней части
        counterContainerStatus.style.right = '10px';  // Размещаем справа
        counterContainerStatus.style.zIndex = '9999';
        counterContainerStatus.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerStatus.style.padding = '10px';
        counterContainerStatus.style.borderRadius = '8px';
        counterContainerStatus.style.color = '#fff';
        counterContainerStatus.style.fontFamily = 'Arial, sans-serif';
        counterContainerStatus.style.fontSize = '14px';
        counterContainerStatus.style.maxWidth = '200px';
        counterContainerStatus.style.maxHeight = '200px';
        counterContainerStatus.style.overflowY = 'auto';
        counterContainerStatus.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementStatus = document.createElement('div');
        headerElementStatus.textContent = 'Статус тем:';
        headerElementStatus.style.fontWeight = 'bold';
        headerElementStatus.style.marginBottom = '10px';
        counterContainerStatus.appendChild(headerElementStatus);

        // Добавляем количество тем в ожидании и на рассмотрении
        const waitingElement = createCountElement(waitingCount, `В ожидании`, 'Пн');
        const underReviewElement = createCountElement(underReviewCount, `На рассмотрении`, 'Вт');
        counterContainerStatus.appendChild(waitingElement);
        counterContainerStatus.appendChild(underReviewElement);

        // Вставляем контейнеры в body
        document.body.appendChild(counterContainerWeek);
        document.body.appendChild(counterContainerStatus);
    }

    // Вызываем функцию при загрузке страницы
    window.onload = function() {
        countElements();
    };

})();