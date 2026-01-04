// ==UserScript==
// @name         Для кураторов форума N. Novgorod (урез)
// @namespace    http://tampermonkey.net/
// @version      0.4beta
// @description  Скрипт для облегчения работы кураторов форума. Урезанная версия только для кф без логирования. Связь с разработчиком: https://vk.com/gold_chell
// @author       Ярослав Голдчелл || Jarik_Goldchell
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549749/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod%20%28%D1%83%D1%80%D0%B5%D0%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549749/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod%20%28%D1%83%D1%80%D0%B5%D0%B7%29.meta.js
// ==/UserScript==
//РП Био

(function() {
    'use strict';
const BIOUNACCEPT_PREFIX = 4;
const BIOACCEPT_PREFIX = 8;
const BIOPIN_PREFIX = 2;
const buttons2 = [
{
     title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
     title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
     title: 'Одобрено',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/B]<br><br>" +
    "[img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOACCEPT_PREFIX,
    status: false,
},
{
     title: 'На доработку',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Биография требует доработки (меньше 200 слов), вам дается 24 часа на ее дополнение.[/COLOR][/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидаем, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOPIN_PREFIX,
    status: 123,
},
{
      title: 'Отказ',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Нарушение Правил написания RP биографий[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
       title: 'Отказ (заголовок)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Заголовок написан не по форме.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
  title: 'Отказ (пг)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено приписывать персонажу сверхспособности или вещи которые разрешают нарушать какое либо правило сервера. Пример: Сбежал из психушки и начал убивать людей.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (Существующая знаменитость)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено называть персонажа именем какого-то существующего известного человека.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (плагиат)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено использовать РП биографии других людей[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (орфограф. ошибки)',
    content:
   "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Биография должна быть читабельна и не содержать грамматических или орфографических ошибок.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (Шрифт, размер)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (отсутствие фото, иных материалов)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
   title: 'Отказ (не дополнил)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Не дополнил(а) биографию за 24 часа[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (логика)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии не должно быть логических противоречий.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
      title: 'Отказ (Оффтоп)',
    content:
    "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: BIOUNACCEPT_PREFIX,
      status: false,
},
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOPIN_PREFIX,
    status: 123,
    },
    {
    title: 'Отказ (Не по форме)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Ваша биография заполнена не по форме или расписаны не все пункты.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
       title: 'Отказ (<200 слов, >600)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Минимальный объём RP биографии — 200 слов, максимальный — 600..[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
    {
        title: 'Закрыть принудительно',
        content: "", //пусто
        prefix: BIOUNACCEPT_PREFIX,
        status: false,
    },
];

    $(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП биографии', 'selectAnswer2');

	const threadData = getThreadData();


$(`button#selectAnswer2`).click(() => {
XF.alert(buttonsMarkup(buttons2), null, 'РП биографии. Выберите ответ');
buttons2.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons2[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons2[id].prefix, buttons2[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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

//-----------------------------------------------------------------------------------------------------------------
//-------------------------------------------РП Ситуации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const SITAUNACCEPT_PREFIX = 4;
const SITAACCEPT_PREFIX = 8;
const SITAPIN_PREFIX = 2;
const buttons3 = [
  {
   title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
        title: 'Одобрена',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша РП ситуация получает статус - [/COLOR][/B]" +
       "[COLOR=#00FF00][B]Одобрено.[/B][/COLOR] [FONT=georgia]Приятной игры и времяпровождения.[/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'На доработку',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia] Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FFA500][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAPIN_PREFIX,
        status: false,
    },
    {
        title: 'Отказ',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша РП ситуация получает статус - [/COLOR][/B]" +
       "[COLOR=#FF0000][B]Отказано.[/B][/COLOR][/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAUNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Отказ (оффтоп)',
      content:
      "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay ситуация взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: SITAPIN_PREFIX,
    status: 123,
    },
    {
        title: 'Принудительно закрыть',
        content: "",
        prefix: SITAPIN_PREFIX,
        status: 123,
    },
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП ситуации', 'selectAnswer3');

	const threadData = getThreadData();


$(`button#selectAnswer3`).click(() => {
XF.alert(buttonsMarkup(buttons3), null, 'РП ситуации. Выберите ответ');
buttons3.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons3[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons3[id].prefix, buttons3[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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

//-----------------------------------------------------------------------------------------------------------------
//--------------------------Неофициальные RP организации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const NEOFUNACCEPT_PREFIX = 4;
const NEOFACCEPT_PREFIX = 8;
const NEOFPIN_PREFIX = 2;
const buttons4 = [
  {
    title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
   title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Одобрена',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная РП организация получает статус - [/COLOR][/B]" +
       "[COLOR=#00FF00][B]Одобрено.[/B][/COLOR] [FONT=georgia]Приятной игры и времяпровождения.[/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFACCEPT_PREFIX,
        status: false,
},
{
    title: 'На доработку',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia] Вам даётся 24 часа на дополнение вашей Неофициальной РП организации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FFA500][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFPIN_PREFIX,
        status: false,
},
{
    title: 'Отказ',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная РП организация получает статус - [/COLOR][/B]" +
       "[COLOR=#FF0000][B]Отказано.[/B][/COLOR][/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFUNACCEPT_PREFIX,
        status: false,
},
{
   title: 'Отказ (оффтоп)',
      content:
      "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: NEOFUNACCEPT_PREFIX,
      status: false,
},
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная RolePlay организация взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: NEOFPIN_PREFIX,
    status: 123,
    },
    {
    title: 'Принудительно закрыть',
    content: "",
    prefix: NEOFUNACCEPT_PREFIX,
    status: false,
    }
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Неоф. RP организации', 'selectAnswer4');

	const threadData = getThreadData();

$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'Неофициальные RP организации. Выберите ответ');
buttons4.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
//-----------------------------------------------------------------------------------------------------------------
//--------------------------Кнопка-подпись автора скрипта-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';

    // Функция для создания кнопки-подписи
    function addSignatureButton() {
        // Создаем красивую кнопку-подпись
        const signatureButton = $(`
            <button type="button"
                    class="button button--primary rippleButton"
                    id="scriptSignature"
                    style="border-radius: 15px;
                           border: 2px solid #FFD700;
                           margin-right: 7px;
                           margin-bottom: 10px;
                           background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
                           color: white;
                           font-weight: bold;
                           cursor: pointer;">
                🐰 Script by J. Goldchell 🐰
            </button>
        `);

        // Добавляем обработчик клика
        signatureButton.click(() => {
            XF.alert(
                `<!-- Иконка и информация о скрипте -->
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🐰</div>
                    <h2 style="color: #6A11CB; margin-bottom: 10px;">Для кураторов форума N. Novgorod</h2>
                    <p style="color: #2575FC; margin-bottom: 5px;"><strong>Версия:</strong> 0.4beta</p>
                    <p style="color: #666; margin-bottom: 15px;"><strong>Автор:</strong> Ярослав Голдчелл (Jarik_Goldchell)</p>
                    <p style="color: #FFD700; margin-bottom: 20px;">
                        <strong>Связь с разработчиком:</strong><br>
                        <a href="https://vk.com/gold_chell" target="_blank" style="color: #007bff; text-decoration: none;">
                            https://vk.com/gold_chell
                        </a>
                    </p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #6A11CB;">
                        <p style="margin: 0; color: #495057; font-size: 14px;">
                            Скрипт для облегчения работы кураторов форума. Урезанная версия только для кф без логирования.
                        </p>
                    </div>
                </div>`,
                null,
                '🐰 О скрипте'
            );
        });

        // Добавляем кнопку рядом с другими
        $('.button--icon--reply').before(signatureButton);
    }

    // Добавляем кнопку после загрузки DOM
    $(document).ready(() => {
        addSignatureButton();
    });

})();