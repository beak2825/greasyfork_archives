// ==UserScript==
// @name         Black Russia Winsize Script 
// @namespace    https://forum.blackrussia.online/
// @version      1.3
// @description  Скрипт для Руководства сервера Magadan // VK - https://vk.com/id891404119 по всем вопросам 
// @author      Junior Winsize • Winsize Team 
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon  https://i.postimg.cc/ncjYcCjr/8732e4b588cbaba12e1a626185643b4c-(1).jpg
// @downloadURL https://update.greasyfork.org/scripts/557445/Black%20Russia%20Winsize%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/557445/Black%20Russia%20Winsize%20Script.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
{
title: 'Запросить доква',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
'[CENTER]Запрошу доказательства у администратора.[/CENTER]<br><br>' +
'[CENTER]Ожидайте ответа.[/CENTER]<br><br>' +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Наказание за форум',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
'[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>' +
'[CENTER]Проверю верность вердикта куратора форума, ожидайте ответа.[/CENTER]<br><br>' +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Отправить на рассмотрение',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
"[CENTER]Ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Жалоба одобрена в сторону игрока',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Наказать адм',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и администратор будет наказан. Спасибо за предоставленную информацию.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Дублирование темы',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Если вы продолжите дублировать темы, ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ответ в прошлой жалобе',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ответ был дан в прошлой теме.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа с админом',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена беседа, спасибо за информацию.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Ошиблись сервером',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Качество докв',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот окна блокировки аккаунта',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Админ прав',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Отсутствуют доказательства',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательств',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передано ЗГА',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Заместителю Главного Администратора на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано ГА',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR]<br><br>" +
"[CENTER]Ответ может занять более 48 часов.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Жалоба от 3 лица',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жб с редактом',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть без обрезок/замазок.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не работают доказательства',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нарушений от адм нету',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Смена наказания',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету /time',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказать админа и снять наказание',
content:
'[SIZE=4][FONT=courier new][COLOR=#90EE90][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба одобрена, администратор будет наказан.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]<br><br>' +
"[CENTER]Приятной игры на нашем сервере.[/CENTER][/COLOR][/FONT][/SIZE]",
prefix: WATCHED_PREFIX,
status: false,
},
{
	  title: '----------  Обжалования  ------------------------------------------------------------------------------------------------------------------------',
	},
{
  title: 'Отправить на рассмотрение',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
    '[CENTER][COLOR=orange]Ожидайте ответа.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: 'грубое нарушение',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]В обжаловании отказано. Ваше наказание является грубым нарушением (например: большое количество нарушенных правил сервера, грубые действия с вашей стороны и т.д.).[/CENTER]<br><br>" +
    '[CENTER][COLOR=red]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Обжалование нонрп обман',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Если вы хотите обжаловать наказание за НонРП обман, вы должны самостоятельно связаться с человеком, которого обманули. После этого он должен создать обжалование, прикрепив следующие доказательства:[/CENTER]<br><br>" +
    "[CENTER]- доказательства договорённости о возврате имущества;<br>" +
    "- ссылку на жалобу, которую он писал на вас;<br>" +
    "- скриншот окна блокировки обманувшего;<br>" +
    "- ссылки на ВК обеих сторон.<br><br>" +
    "Без выполнения этих условий обжаловать наказание за НонРП обман невозможно.[/CENTER]<br><br>" +
    '[CENTER][COLOR=red]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Обжалование ник',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа. Если в течение 24 часов вы не смените свой никнейм, то будете снова заблокированы. Для смены ника используйте команду /mm 10, после чего прикрепите доказательство сюда.<br><br>" +
    '[CENTER][COLOR=orange]Ожидаю вашего ответа.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: 'Запрос ссылки вк',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Прикрепите ссылку на ваш ВКонтакте.<br><br>" +
    '[CENTER][COLOR=orange]Ожидаю вашего ответа.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: 'Не готовы пойти на встречу',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание.<br><br>" +
    '[CENTER][COLOR=red]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Обжалованию не подлежит',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Данное наказание не подлежит обжалованию.<br><br>" +
    '[CENTER][COLOR=red]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Одобрить обжалование',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.<br><br>" +
    '[CENTER][COLOR=green]Одобрено.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'Отказать обжалование',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]В обжаловании отказано.<br><br>" +
    '[CENTER][COLOR=red]Закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Снизить наказание до минимальных мер',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше наказание будет снижено до минимальных мер.<br><br>" +
    '[CENTER][COLOR=#AEF359]Одобрено.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: ACCEPT_PREFIX,
  status: false,
},
{  
  title: 'Отстутствуют доказательства',  
  content:  
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +  
    "[CENTER]В вашем обжаловании отсутствуют доказательства.<br><br>" +  
    '[CENTER][COLOR=Red]Закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',  
  prefix: CLOSE_PREFIX,  
  status: false,  
},
{
  title: 'Уже есть мин. наказание',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Вам итак выдано минимальное наказание за нарушение.<br><br>" +
    '[CENTER][COLOR=Red]Закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Обжалование не по форме',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
    '[CENTER][COLOR=Red]Закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Направить в раздел жб на тех',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов (наказания выданные техническим специалистом не подлежат обжалованию).<br><br>" +
    '[CENTER][COLOR=Red]Отказано.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'Доказательство в соц сети',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
    '[CENTER][COLOR=Red]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Обжалование оффтоп',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша тема никак не относится к разделу обжалования наказаний.<br><br>" +
    '[CENTER][COLOR=Red]Закрыто.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Передать ГА',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование передано Главному администратору.[/CENTER]<br><br>" +
    '[CENTER][COLOR=#ED7014]Ожидайте ответа.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
  title: 'Передать СА',
  content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
    '[CENTER][COLOR=#ED7014]Ожидайте ответа.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][IMG]https://i.postimg.cc/FzStTtry/6ef99d6fc9c8b84c6943a41bc192dfa1.gif[/IMG][/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
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
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;
 
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