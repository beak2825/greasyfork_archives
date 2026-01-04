// ==UserScript==
// @name         Кураторы адм/ЗГА/ГА  KIROV
// @version      1.1.1
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Korneplod
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1275847
// @downloadURL https://update.greasyfork.org/scripts/550569/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%20KIROV.user.js
// @updateURL https://update.greasyfork.org/scripts/550569/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%20KIROV.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
{
      title: `--------------------------------------------------------------------> АДМИН РАЗДЕЛ <--------------------------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},

     {
	  title: `этот раздел пока не работает не трогать его!!!!!!!!!!!!`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS]этот раздел пока не работает не трогать его!!!!!!!!!!!![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С By.Fantom_Stark[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Неактивы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на неактив были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Доп. Баллы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши доп. баллы были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Имущество`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления покупку/продажу/обмен имущества были успешно проверены и одобрены![/COLOR]<br><br>`+
        `Отказанные заявки перечислил выше. Все взаимодействия с имуществом после 22:00, при репорте меньше 10.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Снятие наказаний`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на снятие наказаний были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     
{
      title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-------------------------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
    {
      title: `Жалобу в адм раздел`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вам нужно обратиться в раздел жалоб на Администрацию → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2584/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел Обжалование → [/ICODE] [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2585/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на игроков  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2584/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на лидеров  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2583/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
	},
    {
      title: `Жалобу на теха`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на технических специалистов → [/ICODE] [URL='https://forum.blackrussia.online/forums/Сервер-№58-kirov.2515/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
     title: '------------------------------------------------------------------->Передача тем<--------------------------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
      title: 'передаю',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша тема была передана на рассмотрение. [/ICODE][COLOR=#00FFFF][ICODE][/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа в данной теме.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: GA_PREFIX,
	  status: true,
    },
         {
     title: '------------------------------------------------------------------->на рассмотрении <--------------------------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
        title: `На рассмотрении(обжалование)`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваше обжалование взято  [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00[ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
         prefix: PIN_PREFIX,
      status: true,
        },
             {
      title: `На рассмотрении(жб)`,
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба взята [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: true,
    },
          {
      title: `ссылку на жб`,
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на данную жалобу в течении 24 часов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
       prefix: PIN_PREFIX,
      status: 123,
    },

        {
      title: `ссылку на вк`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на вашу страницу в ВК.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: 123,
    },
        {
     title: '-------------------------------------------------------------------> ДОКИ <--------------------------------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
       title: `запрошу доки`,
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Запрошу доказательства у администратора.[/ICODE][COLOR=#FFFF00][ICODE]Ожидайте. [/ICODE][/COLOR]<br>[ICODE] пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
	  status: true,
        },
        {
      title: 'выдано верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'выдано не верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
                            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
	   title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
        {
      title: 'будет проинструктирован',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу строгую беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Адм будет наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]]Ваша жалоба была одобрена и администратор получит наказание. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

        {
      title: 'не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию -[/ICODE] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
               prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Нет /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /time.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нет /myreports',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /myreports.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Жалобы написанные от 3-его лица не подлежат рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нужен фрапс',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Фрапс обрывается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Дока-во отредактированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Прошло более 48 часов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет строки выдачи наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует строка с выдачей наказания.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет окна бана',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует окно блокировки аккаунта. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'нет докв',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей жалобе отсутствуют доказательства. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'не работают доки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Предоставленные доказательства не рабочие. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

        {
      title: 'нет нарушений',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'адм снят/псж',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Администратор был снят/ушел с поста администратора.  [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'ошиблись сервером',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'нет ссылки на жб',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нет ссылки на данную жалобу.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'не написал ник',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'перезагрузи роутер',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Перезагрузите роутер.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

{
            title: `--------------------------------------------------------------------> ОБЖАЛОВАНИЯ <--------------------------------------------------------------------`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
    {
      title: `Сократить наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено. Наказание будет снижено[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Снять наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено, наказание будет полностью снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование на рассмотрении`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
	  title: `Смена ника`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой nickname через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательтвом того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `NonRP обман (разбан на 24 часа)`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме.<br>Прикрепите фрапс обмена с /time в данную тему. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `Отказать ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В обжаловании отказано.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ не подлежит`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Данное наказание не подлежит обжалованию.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `NonRP обман (не тот написал)`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком в любым способом.<br>Для возврата имущества он должен оформить обжалование.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обж не по форме`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований →.[/ICODE][URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет док-в в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствуют доказательства для дальнейшего расмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нерабочие док-ва в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании не работают доказательства.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Дублирование ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ответ был дан в прошлой теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ уже на рассмотрении`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                     "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера.<br>Пожалуйста, прекратите создавать повторяющиеся темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Неадекват ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено в неадекватном формате. Рассмотрению не подлежит.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет ссылки на VK`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствует ссылка на вашу страницу VK. Прикрепите ее в следующем обращении для дальнейшего рассмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] KIROV[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы

        addButton('Меню', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255,  20, 147, 0.5);');
        addButton('Одобрить', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
        addButton('Отказать', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('Закрыть', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('Спецу', 'specialAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('ГА', 'mainAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('КП', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
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

    const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button2 = buttonConfig("Общие правила серверов", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

    bgButtons.append(Button2);

     function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">Меню</button>`,
	);
	}

      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
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
    (function () {
    'use strict';


    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }

    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Снег</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;

    document.head.appendChild(sliderStyle);
        })();


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