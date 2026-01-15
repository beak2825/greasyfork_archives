// ==UserScript==
// @name         Скрипт CHIEF Black Russia
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Стиль - скрипт для тех. раздела
// @author       I.Drag
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://postimg.cc/1fqy8FGB
// @grant        none
// @license dragsotka
// @downloadURL https://update.greasyfork.org/scripts/562561/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20CHIEF%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/562561/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20CHIEF%20Black%20Russia.meta.js
// ==/UserScript==

(function() {
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
      title: 'Приветствие',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]  [/CENTER][/FONT]'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>',
    },
    {
      title: 'На рассмотрении...',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба закреплена и находится на рассмотрении у руководства сервера[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Одобрено - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Одобрено',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]С администратором будет проведена необходимая работа.[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение.[CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Одобрено + снято наказание',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]С администратором будет проведена необходимая работа.[/CENTER]<br><br>'+
        '[CENTER]Ваше наказание будет снято в течении дня, если оно еще не снято.[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение.[CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - -- - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Перенаправлен в другой раздел',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба будет перенаправлена в соответствующий раздел/сервер.[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(209, 213, 216)]Ожидайте ответа[/COLOR][/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Главному Администратору сервера[/U].[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Передано Главному Администратору.[/COLOR][/CENTER][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ОЗГА',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Основному Заместителю Главного Администратора сервера[/U].[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Передано ОЗГА.[/COLOR][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ЗГА ГОСС/ОПГ',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Заместителю Главного Администратора сервера по направлению ГОСС/ОПГ[/U].[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Передано ЗГА ГОСС/ОПГ.[/COLOR][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано СА',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Специальной Администрации[/U].[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Передано Специальной Администрации.[/COLOR][/CENTER][/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано РМ',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Руководству Модерации[/U].[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 0, 255)]Передано Руководству Модерации.[/COLOR][/CENTER][/FONT]',
      prefix: COMMAND_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказано - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Нарушений со стороны данного администратора не было найдено.[/CENTER]<br><br>'+
        '[CENTER]Если у вас есть более информативные док-ва нарушения, прикрепите их в [U]новой жалобе[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Доказательства предоставлены',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Доказательства были предоставлены.[/CENTER]<br><br>'+
        '[CENTER]Наказание выдано верно.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'В обжалования',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Если вы согласны с выданным наказанием - напишите обжалование.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нет скрина бана',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Зайдите в игру и сделайте скрин окна с баном через любой фотохостинг, после чего заново напишите жалобу.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Дублирование ЖБ',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ответ на эту жалобу был дан в предыдущей теме.[/CENTER]<br><br>'+
        '[CENTER]За дублирование жалоб ваш форумный аккаунт может быть [U]заблокирован[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Плохое качество',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваши доказательства предоставлены в плохом качестве.[/CENTER]<br>'+
        '[CENTER]Попробуйте прикрепить док-ва через другой фото/видеохостинг в [U]новой жалобе[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Жалоба составлена не по форме.[/CENTER]<br><br>'+
        '[CENTER]Ознакомьтесь с [U]правилами подачи жалоб[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 48 часов',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]С момента нарушения от администратора прошло более 48 часов.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Доказательства не рабочие.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваши доказательства были отредактированы.[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Вы ошиблись сервером/разделом.[/CENTER]<br><br>'+
        '[CENTER]Переподайте жалобу в [U]нужный раздел[/U].[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Доп. вердикты - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },


  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
            sticky: 1,
			pin: true,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
            sticky: 1,
			pin: 1,
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