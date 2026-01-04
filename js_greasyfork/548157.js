// ==UserScript==
// @name         BR Purple Личный Скрипт (Биографии)
// @namespace    https://forum.blackrussia.online
// @version      2.5
// @description  Для РП Биографий
// @author       Danya_Zhukov
// @match        https://forum.blackrussia.online/threads*
// @icon         https://s1.hostingkartinok.com/uploads/images/2023/02/823db08928a6164d43c1c61aed4caf3e.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548157/BR%20Purple%20%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548157/BR%20Purple%20%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'Биография одобрена',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FF00FF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/1db921/24/0/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B] При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

"[/CENTER]",
     },
     {
          title: 'На дополнение',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#00FFFF]Ваша RolePlay биография была проверена.[B][COLOR=#FF0088]Вам даётся ровно 24 часа на дополнение RP Биографии. [/COLOR][/B]<br><br>' +
'[COLOR=rgb(222, 237, 9)][B][SIZE=6]На рассмотрении...[/SIZE][/B][/COLOR]<br><br>' +

"[/CENTER]",
     },
     {
	  title: 'Большое количество ошибок',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Большое количество ошибок в тексте [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
   },
     {
           title: 'Дубликат',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Дубликат [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
   },
     {
         title: 'Орфографические и пунктуационные ошибки',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Орфографические и пунктуационные ошибки [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
   },
     {
      title: 'Ошибки в тексте',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +
"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Ошибки в тексте [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
    },
     {
         title: 'Рассказ от 1-ого лица',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Рассказ ведётся от 1-ого лица [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 },
     {
	  title: 'Возраст не совпал',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4887982/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Возраст не совпал с датой рождения [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 },
     {
	  title: 'Слишком молод',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Некорректен возраст (слишком молод) [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Биография скопирована',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалоб на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография скопирована [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Недостаточно РП информации',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Недостаточно РП информации [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография не по форме [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
           },
     {
          title: 'Не по форме (МГ)',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Биография не по форме (Вся информация в биографии является IC. Запрещено проявление в ней OOC.) [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
           },
     {
	  title: 'Некоррект национальность',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Некорректная национальность [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
         title: 'Несостыковки в тексте',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Несостыковки в тексте [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
           title: 'Шрифт',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
 title: 'Фотографии',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] В биографии отсутствуют фотографии и иные материалы, относящиеся к истории вашего персонажа. [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
      title: 'Заголовок не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[CENTER][B][FONT=georgia][B][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B]<br><br>' +
'[CENTER][url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicfancy/0274/eb0f14/24/0/4nxpbesoumejbwrz4nepb8qoua.png[/img][/url]<br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.12262634/'][B]*Тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на Администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина:[COLOR=rgb(255, 255, 255)][B] Заголовок биографии не по форме [/B][/COLOR]<br><br>' +

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZKCbYgr/W123u.png[/img][/url]<br>' +
'[COLOR=#d1d5d8][B][COLOR=#00FFFF]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Выбрать💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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