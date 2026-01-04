// ==UserScript==
// @name         Для технических специалистов KIMG RUSSIA
// @namespace    https://forum.kingrussia.com/index.php*
// @version      1.24
// @description  Автоматическое приветствие: Доброе утро/день/вечер/ночи
// @author       Самир Рамазанов | Evgeniy_Lorenzo + правка
// @match        https://forum.kingrussia.com/index.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549177/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2%20KIMG%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/549177/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2%20KIMG%20RUSSIA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RO_PREFIX = 7;
  const UNACCEPT_PREFIX    = 6;
  const ACCEPT_PREFIX      = 5;
  const COMMAND_PREFIX     = 9;
  const WATCHED_PREFIX     = 4;
  const KK_PREFIX = 15;

  // --- Основные шаблоны ---
  const buttons = [
    { title: '-----------------------------------Жалоба на игроков--------------------------------' },
    {
      title: 'Взять жалобу на рассмотрение',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. Ваша жалоба получает Статус: [COLOR=rgb(255,155,0)]На рассмотрении.[/COLOR][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническиая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Заявления не по форме мы не рассматриваем.[/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Игроку вынесено наказание, жалоба получает статус:[color=lime] Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказано',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Рассмотрев вашу жалобу, выношу вердикт:[color=red]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет докв/мало докв',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Без доказательств или недостаточного количества, мы ничем не сможем вам помочь.[/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету time',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]На доказательствах отсутствует /time, выношу вердикт:[color=red]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-лица',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Жалоба написана от 3-го лица, что нарушает правила подачи жалобы.[/size][/font][/CENTER][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не относится',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Ваша тема не относится к данному разделу.[/size][/font][/CENTER][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету условия сделки',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]На доказательствах отсутствуют условия сделки, соответственно, помочь мы не сможем.[/size][/font][/CENTER][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква в соц сети',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Доказательства загружены в соцсети, что запрещается правилами подачи жалоб. Загрузите на видеохостинг, например, YouTube, Imgur, Yapx и т. д.[/size][/font][/CENTER][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    { title: '-----------------------------------Ответы в тех разделе--------------------------------' },
    {
      title: 'В баги',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Для передачи данной проблемы команде разработчиков нужно заполнить данную форму -> https://forms.gle/Kwpf4Te9etpbAreKA.[/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: RO_PREFIX,
      status: false,
    },
    {
      title: 'Не является багом',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Данная система не является багом/проблемой.[/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Направить ВК/ТГ',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Для решения данной проблемы вам нужно связаться с оператором в любом, удобном для вас виде VK - https://vk.com/kingcrmphelp или Telegram - https://t.me/tehkingrussia_bot.[/size][/font][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: RO_PREFIX,
      status: false,
    },
    {
      title: 'Передано КК',
      content:
        '[CENTER][size=15px][font=Trebuchet MS][CENTER][B]{{greeting}}, уважаемый игрок [COLOR=rgb(51,255,0)] {{ user.mention }}[/COLOR].[/CENTER][/size][/font]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]Ваша тема передана на проверку отделу [COLOR=rgb(136, 236, 223)]Контроля Качества[/color].[/size][/font][/CENTER][/CENTER]<br><br>' +
        '[CENTER][size=15px][font=Trebuchet MS]С уважением, Техническая Администрация [COLOR=rgb(255,200,0)]King Russia.[/B][/COLOR][/size][/font]',
      prefix: KK_PREFIX,
      status: false,
    },
    // … остальные шаблоны по аналогии: везде {{greeting}} вместо «Приветствую» …
  ];

  $(document).ready(() => {
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Ответы', 'selectAnswer');

    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(RASSMOTRENNO_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

    $('button#selectAnswer').click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        $(`button#answers-${id}`).click(() => pasteContent(id, threadData, id > 0));
      });
    });
  });

  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px">
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

    if (send) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      // обновлённый селектор кнопки «Ответить»
      $('button.button--icon--reply').trigger('click');
    }
  }

  function getThreadData() {
    const authorID   = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    const hours      = new Date().getHours();
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      // Функция приветствия по времени
      greeting: (() => {
        if (hours >= 5 && hours < 12)  return 'Доброе утро';
        if (hours >= 12 && hours < 17) return 'Добрый день';
        if (hours >= 17 && hours < 23) return 'Добрый вечер';
        return 'Доброй ночи';
      })()
    };
  }

  function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    const bodyData = {
      prefix_id: prefix,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: 'json',
    };
    if (pin) bodyData.pin = 1;

    fetch(`${document.URL}edit`, { method: 'POST', body: getFormData(bodyData) }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    return formData;
  }
})();