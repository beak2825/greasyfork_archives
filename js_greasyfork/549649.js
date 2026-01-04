// ==UserScript==
// @name  Технические Специалисты
// @namespace https://forum.blessrussia.online/index.php*
// @version    1.0.1
// @description  Версия для Техов
// @author Manjiro_Sano | VK - https://vk.com/1manjiro
// @match https://forum.blessrussia.online/index.php*
// @include https://forum.blessrussia.online/index.php*
// @grant none
// @license    MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/549649/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549649/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B.meta.js
// ==/UserScript==hhhhhhhhhhhhhttps://update.greasyfork.org/scripts/478810/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SARATOV.user.js


(function () {
	'use strict';
	const UNACCEPT_PREFIX = 7; // префикс отказано
	const ACCEPT_PREFIX = 6; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 9; // команде проекта
	const CLOSE_PREFIX = 5; // префикс закрыто
	const OPEN_PREFIX = 13; // префикс открыто
	const DECIDED_PREFIX = 4; // префикс решено
	const WATCHED_PREFIX = 8; // рассмотрено
	const TEX_PREFIX = 12; //  техническому специалисту
  const GA_PREFIX = 11; // главному админу
  const SA_PREFIX = 10; // спец админу
	const NO_PREFIX = 13;



    const buttons = [
{
      title: 'Свой ответ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
    '[B][CENTER][FONT=Arial][size=14px]Ваш текст[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
    '[B][CENTER][FONT=Arial][size=14px]Заявления не по форме мы не рассматриваем[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Отсутствуют жок-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
	  '[B][CENTER][FONT=Arial][size=14px]Без доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Не относится',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
	  '[B][CENTER][FONT=Arial][size=14px]Ваше обращение не относится к данному разделу.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Известно',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
	  '[B][CENTER][FONT=Arial][size=14px]Нам известно о данной проблеме, мы занимаемся ее исправлением.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Не баг',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
	  '[B][CENTER][FONT=Arial][size=14px]Данная система не является багом/проблемой.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
	  '[B][CENTER][FONT=Arial][size=14px]Ваша тема является дубликатом предыдущей.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Донат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
    '[B][CENTER][FONT=Arial][size=14px]/donate - Проверить зачисления. Если не поможет, свяжитесь в VK - https://vk.com/blessrussia_help или Telegram - https://t.me/tehblessrussia_bot.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'ВК или ТГ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
    '[B][CENTER][FONT=Arial][size=14px]Для решения данной проблемы вам нужно связаться с оператором в любом, удобном для вас виде VK - https://vk.com/blessrussia_help или Telegram - https://t.me/tehblessrussia_bot.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Компенсация',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content :
	 	"[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
    '[B][CENTER][FONT=Arial][size=14px]От команды технической части проекта приношу извинения, что вы столкнулись с данной проблемой. В ближайшее время вам поступит компенсация в полном размере на ваш игровой аккаунт.[/size][/font][/CENTER]<br><br>' +
    '[B][CENTER][FONT=Arial][size=14px]Убедительная просьба. До выдачи компенсации не изменять свой игровой Nick Name. В случае, если компенсация не была выдана, создайте повторное обращение.[/size][/font][/CENTER]<br><br>' +
    "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>"+
    "[B][CENTER][FONT=Arial][size=14px]С уважением, [COLOR=#0000ff]Техническая Администрация[/COLOR] [COLOR=rgb(255,200,0)]Bless Russia[/color].[/FONT][/size][/CENTER][/B]",
      prefix: WATCHED_PREFIX,
      status: false,
    },

];

    const tasks = [
{
 title: 'Тех | Закрыто',
   dpstyle: 'oswald: 3px;     color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: CLOSE_PREFIX,
move: 13,
    },
{
 title: 'Тех | Рассмотрено',
   dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
prefix: WATCHED_PREFIX,
move: 13,
    },


  ];


    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      addAnswers();
      addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
      addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Открыто', 'open', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Главный Администратор', 'GlavAdm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(139, 0, 0);');
      addButton('Команда Проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
      addButton('Специальный Администратор', 'SpecAdm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
      addButton('Технический Отдел', 'techspec', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
      addButton('ПЕРЕМЕЩЕНИЕ', 'selectMoveTask', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; background: #4682B4');

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData2(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData2(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData2(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData2(CLOSE_PREFIX, false));
	$('button#GlavAdm').click(() => editThreadData2(GA_PREFIX, true));
	$('button#SpecAdm').click(() => editThreadData2(SA_PREFIX, true));
	$('button#closed_complaint').click(() => editThreadData2(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));

      $(`button#selectComplaintAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
$(`button#selectComplaintAnswer2`).click(() => {
          XF.alert(buttonsMarkup(buttons2), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, false));
              }
          });
      });

          $(`button#selectMoveTask`).click(() => {
        XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
        tasks.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
        });
      });
  });


      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
  }
  function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

function buttonsMarkup(buttons2) {
	return `<div class="select_answer">${buttons2
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons2) {
  return `<div class="select_answer">${buttons2
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == false) {
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
  }

  function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(biography[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == false) {
        editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}
  function pasteContent3(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons2[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == false) {
          editThreadData(buttons2[id].move, buttons2[id].prefix, buttons2[id].status, buttons2[id].open);
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


  function editThreadData(move, prefix, pin = false, open = false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

    function editThreadData2(prefix, pin = false) {
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

  function editThreadData3(move, prefix, pin = false, open = false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

  function moveThread(prefix, type) {
  // Функция перемещения тем
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
