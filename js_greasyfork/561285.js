// ==UserScript==
        // @name   KFBIO_script_by_Xause
        // @name:ru  Кураторы форума RP BIO by J.Xause
        // @version 1.01.56
        // @namespace https://forum.blackrussia.online
        // @match        https://forum.blackrussia.online/threads/*
        // @include      https://forum.blackrussia.online/threads/
        // @grant        none
        // @description  Suggestions for improving the script write here ---> https://docs.google.com/forms/d/e/1FAIpQLSdSkl09YgTiVyo8BmpIeQTCsaeK-gqAs_YTY_1Htrs_UAECTw/viewform?usp=publish-editor
        // @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://docs.google.com/forms/d/e/1FAIpQLSdSkl09YgTiVyo8BmpIeQTCsaeK-gqAs_YTY_1Htrs_UAECTw/viewform?usp=publish-editor
        // @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/561285/KFBIO_script_by_Xause.user.js
// @updateURL https://update.greasyfork.org/scripts/561285/KFBIO_script_by_Xause.meta.js
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
        const OTKAZBIO_PREFIX = 4;
        const ODOBRENOBIO_PREFIX = 8;
        const NARASSMOTRENIIBIO_PREFIX = 2;
        const OTKAZRP_PREFIX = 4;
        const ODOBRENORP_PREFIX = 8;
        const NARASSMOTRENIIRP_PREFIX = 2;
        const OTKAZORG_PREFIX = 4;
        const ODOBRENOORG_PREFIX = 8;
        const NARASSMOTRENIIORG_PREFIX = 2;
        const buttons = [
          {
        		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🔴 Отказ Биографии / Биографии на доработке 🔴    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
                dpstyle: 'oswald: 3px;     color: #f7f4f4ff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0000;  width: 96%; border-radius: 15px;',
        },
         
          {
          title: '✨Взято на рассмотрение✨',
          content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][FONT=georgia][I][B][COLOR=steelblue] Приветствую. [/COLOR][/FONT][/I][/B][/CENTER]<br><br> " +
            "[CENTER][FONT=georgia][I][B]Ваша RolePlay биография успешно принята к рассмотрению. Ожидайте ответа, ваша биография в скором времени будет рассмотрена.[/FONT][/I][/B][/CENTER]<br><br> " +
            "[CENTER][B][COLOR=yellow][SIZE=5][FONT=times new roman]✨На рассмотрении✨[/FONT][/SIZE][/COLOR][/B][/CENTER]" +
            // Вставка второй гифки в самый низ
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
          prefix: PINN_PREFIX,
          status: true,
        },
         
        {
          title: '✨ Заголовок не по форме✨',
          content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            "[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>" +
            "[CENTER]В вашей ROlePlay биографии заголовок  написан[COLOR=red] не по форме.[/color][/CENTER]<br><br>" +
            "[CENTER]Заголовок должен быть написан следующим образом:[/I][/CENTER][/FONT]<br> " +
            "[CENTER] Биография | Nick_Name. [/CENTER]<br><br> "  +
             '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]", // добавлена запятая между строками
          prefix: CLOSE_PREFIX,
              status: false,
        },
         {
          title: '✨Биография скопирована✨',
          content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Ваша RolePlay была скопирована/частично скопирована у другого человека, в связи с чем она не может быть одобрена.[/CENTER]<br><br>" +
            '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
          prefix: CLOSE_PREFIX,
          status: false,
        },
             {
              title: '✨Биография существующего человека✨',
              content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RolePlay биография [COLOR=red]не может быть рассмотрена,[/color]поскольку нарушает общие правила составления RolePLay биографий, а именно:[/CENTER]<br><br>" +
                    "[CENTER] [COLOR=gold]1.3. [/color] Запрещено составлять биографию существующих людей. [/CENTER]<br><br>" +
               '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
              prefix: CLOSE_PREFIX,
              status: false,
            },
             {
              title: '✨Написана неграмотно✨',
              content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RolePlay Биография оформлена неграмотно.<br>" +
                "[CENTER]В ней [COLOR=red]содержатся грамматические или орфографические ошибки.[/COLOR][/CENTER]<br><br>" +
              '[CENTER][B][COLOR=green]✨[SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
              prefix: CLOSE_PREFIX,
              status: false,
            },
            {
              title: '✨Отсутствуют фотографии✨',
              content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER]В вашей RolePLay биографии [COLOR=RED] отсутствуют фотографии, [/COLOR] описывающие вашего персонажа [/CENTER]<br>" + 
               "[CENTER]Фотографии можно загрузить на различные фотохостинги, например: Postimages, Imgur и так далее. [/CENTER]<br><br>" +
               "[CENTER] На изменение в RolePLay биографии вам дается 24 часа, если в течении 24 часов изменений не последует - биография будет отказана.[/CENTER]<br><br>" +
              "[CENTER][B][COLOR=yellow][SIZE=5][FONT=times new roman]✨На рассмотрении✨[/FONT][/SIZE][/COLOR][/B][/CENTER]" +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
              prefix: PINN_PREFIX,
          status: true,
            },
            {
              title: '✨Более 600 слов✨',
              content:
              "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER] В вашей биографии содержится более [COLOR=RED] 600 слов [/COLOR] [/CENTER]<br><br>" +
                 '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
              prefix: CLOSE_PREFIX,
              status: false,
            },
            {
        	  title: '✨Не по форме✨',
        	  content:
        		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
                '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        		"[CENTER] Ваша RolePlay биография написана [COLOR=RED] не по форме [/COLOR] [/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи биографии] [/CENTER]<br>" +
            "[CENTER]• Имя и фамилия персонажа: [/CENTER]<br>" +
             "[CENTER] • Пол: (Мужской / Женский) [/CENTER]<br>" +
              "[CENTER] • Возраст: (еалистичный возраст, соответствующий опыту и занятиям персонажа)[/CENTER]<br>" +
              "[CENTER] • Национальность: (укажите страну или народ, к которому принадлежит персонаж)[/CENTER]<br>" +
               "[CENTER] • Образование: (Опишите, где и чему учился персонаж: школа, колледж, университет, курсы или самообразование)[/CENTER]<br>" +
                "[CENTER]  • Описание внешности: (Рост, телосложение, цвет волос, глаз, особенности (шрамы, татуировки, манера одеваться)[/CENTER]<br>" +
                "[CENTER]  • Характер: (Опишите сильные и слабые стороны, темперамент, привычки)[/CENTER]<br>" +
                 "[CENTER]  • Детство: (Кратко опишите семью, условия жизни, важные события в ранние годы)[/CENTER]<br>" +
                 "[CENTER] • Настоящее время: (Чем персонаж занимается сейчас: работа, место жительства, социальный статус, круг общения)[/CENTER]<br>" +
                  "[CENTER] • Итог: (Опишите, какие качества и цели сформировались у персонажа после всех событий. Это подводит итог всей биографии)[/CENTER][/SPOILER]<br><br>" +
        		'[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
                "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
        	  prefix: CLOSE_PREFIX,
              status: false,
             },
            {
        	  title: '✨Мало информации✨',
        	  content:
        		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
                '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        		"[CENTER]В вашей RolePlay [COLOR=RED] содержится мало информации,[/COLOR] данной информации не хватает для одобрения биографии. [/CENTER]<br>" +
            "[CENTER] [COLOR=yellow] Добавьте дополнительную информацию в биографию, на изменение дается вам 24 часа,[/COLOR] если спустя 24 часа изменений в биографии не последует - [COLOR=RED] она будет отказана. [/COLOR] [/CENTER]<br><br>" +
                 "[CENTER][B][COLOR=yellow][SIZE=5][FONT=times new roman]✨На рассмотрении✨[/FONT][/SIZE][/COLOR][/B][/CENTER]" +
               "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
          prefix: PINN_PREFIX,
          status: true,
              },
              {
              title: '✨Логические противоречия✨',
              content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
                '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER] В вашей RolePlay биографии содержатся логические противоречия[/CENTER] <br>" +
                "[CENTER] [COLOR=RED] Пример:[/COLOR] в пункте «Возраст» вы указываете, что вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей. [/CENTER] <br><br>" +
               '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано, Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
                "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
              prefix: CLOSE_PREFIX,
              status: false,
             },
             {
      title: '✨Биография не была дополнена✨',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B][COLOR=steelblue] Приветствую. [/COLOR][/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B] Прошло [COLOR=yellow] 24 часа,[/COLOR] изменений в биографии не последовало, в следствие чего биография получает статус [COLOR=RED] отказано.[/COLOR] [/FONT][/I][/B][/CENTER]<br><br> " +
         '[CENTER][B][COLOR=green]✨ [SIZE=4][COLOR=red][FONT=times new roman]Отказано,Закрыто.[/FONT][/COLOR][/SIZE] ✨ [/COLOR][/B] [/CENTER]' +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
     prefix: CLOSE_PREFIX,
       status: false,
    },
          
          {
          title: '✅Одобренные биографии✅',
          dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #22FF22; width: 96%; border-radius: 15px;',
        },
          {
          title: '✅Одобрено✅',
          content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>" +
            '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER] Ваша ROlePlay биография была [COLOR=yellow]успешно рассмотрена[/COLOR] и получает статус:[/CENTER]<br>" +
             "[CENTER][QUOTE][COLOR=rgb(0, 255, 0)]ОДОБРЕНО [/QUOTE][/CENTER]<br><br>" +
            "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman] ✨ Одобрено,[COLOR=#FF0000]Закрыто[/COLOR] ✨  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
            "<br>[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FscvGMVP/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]",
          prefix:ODOBRENOBIO_PREFIX ,
          status: false,
        },
         
         
         
         
         
         
         
         
         
         ];
         
         $(document).ready(() => {
            // Загрузка скрипта для обработки шаблонов
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
         
         // Добавление кнопок при загрузке страницы
            addButton('✨ RP BIO by J. Xause✨', 'selectAnswer');
         
            // Поиск информации о теме
            const threadData = getThreadData();
         
            $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
            $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
            $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
            $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
         
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
              `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #007777;">${name}</button>`,
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
                4 < hours && hours <= 12 ?
                'Доброе утро' :
                13 < hours && hours <= 16 ?
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
                                      sticky: 1,
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
     

