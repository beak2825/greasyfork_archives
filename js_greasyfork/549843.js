// ==UserScript==
// @name            TESTS | Скрипт для Кураторов Форума [Телефон]
// @namespace       https://forum.blackrussia.online
// @version         1.4.1
// @author          Dany Forbs
// @connection      https://vk.com/id647017804
// @updateversion   Создан 01.12.2024
// @match           https://forum.blackrussia.online/threads/*
// @match           https://forum.blackrussia.online/forums/*
// @match           https://forum.blackrussia.online/*
// @include         https://forum.blackrussia.online/threads/
// @license         MIT
// @icon            https://i.postimg.cc/NMS4npyg/Picsart-24-05-10-13-21-41-387-1.png
// @description     nane
// @downloadURL https://update.greasyfork.org/scripts/549843/TESTS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5B%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/549843/TESTS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5B%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%5D.meta.js
// ==/UserScript==
 
(function () {
'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const TECH_PREFIX = 13; // Префикс "Тех. специалисту"
const buttons = [
{
    title: '------> Раздел Жалоб на игроков <------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Приветствие + свой текст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content: 
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}!<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '(Свой текст)<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05)[/COLOR].<br><br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]'
},
{
    title: 'ГКФ | ЗГКФ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(0, 0, 255, 0.5); font-family: UtromPressKachat',
    content: 
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Главному/Заместителю Главного Куратора Форума.[/COLOR]<br>' +
          'Убедительная просьба не создавать копий данной темы.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 0, 255)][ICODE]ГКФ/ЗГКФ[/ICODE][/COLOR]<br><br>' +
          'Ожидайте ответа.[/FONT][/SIZE][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Главному Администратору',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
         '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
         '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
         'Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Главному Администратору.[/COLOR]<br>' +
         'Убедительная просьба не создавать копий данной темы.<br><br>' +
         '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
         '[COLOR=rgb(255, 0, 0)][ICODE]Главному Администратору[/ICODE][/COLOR]<br><br>' +
       		 'Ожидайте ответа.[/FONT][/SIZE][/CENTER]',
    prefix: GA_PREFIX,
    status: true,
},
{
    title: 'Тех. специалисту',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(0, 0, 255, 0.5); font-family: UtromPressKachat',
    content: 
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Техническому специалисту.[/COLOR]<br>' +
          'Убедительная просьба не создавать копий данной темы.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 0, 255)][ICODE]Техническому специалисту[/ICODE][/COLOR]<br><br>' +
         		'Ожидайте ответа.[/FONT][/SIZE][/CENTER]',
    prefix: TECH_PREFIX,
    status: true,
},
{
    title: 'На рассмотрении',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 255, 0, 0.5); font-family: UtromPressKachat',
    content: 
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение.[/COLOR]<br>' +
          'Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>' +
	         	'Ожидайте ответа.[/FONT][/SIZE][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи + ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 255, 0, 0.5); font-family: UtromPressKachat',
    content: 
          '[SIZE=4][FONT=Verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +    
          'Предоставьте ниже доказательства того, что вы являетесь лидером данной семьи, так как только лидер семьи может создавать подобные жалобы.​​<br><br>' +
          'Также предоставьте доказательства того, что в описании семьи запрещено брать такое количество патронов.​​<br><br>' +
          'Если вы не являетесь лидером семьи, то отпишите об этом ниже, чтобы закрыть тему.​<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +   
          '[COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Ожидаем обратной связи.[/COLOR][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи без ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(255, 255, 0, 0.5); font-family: UtromPressKachat',
    content: 
          '[SIZE=4][FONT=Verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +       
          'Предоставьте ниже доказательства того, что вы являетесь лидером данной семьи, так как только лидер семьи может создавать подобные жалобы.​​<br><br>' +
          'Если вы не являетесь лидером семьи, то отпишите об этом ниже, чтобы закрыть тему.​<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Ожидаем обратной связи.[/COLOR][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},    
{
    title: '----> Направить в другие разделы <----',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'В ЖБ на АДМ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:  
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]<br>' +
          'Внимательно ознакомившись с вашей жалобой, было решено, что Вам нужно обратиться в «Раздел жалоб на Администрацию».<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на Тех спец',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:  
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]<br>' +
          'Внимательно ознакомившись с вашей жалобой, было решено, что Вам нужно обратиться в «Раздел жалоб на Технических Специалистов».<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
	         '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
         '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
         'Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]<br>' +
         'Внимательно ознакомившись с вашей жалобой, было решено, что Вам нужно обраться в «Раздел жалоб на Лидеров».<br><br>' +
         '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
         'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
         'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на сотрудников',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Обратитесь в раздел жалоб на сотрудников той или иной организации.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-------------> Отказ жалоб <-------------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба составлена не по форме. <br>Заполните данную форму и подайте новую заявку:<br>' +
          '[QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нарушения не найдены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
         		'Нарушения игрока не были обнаружены.<br><br>' +
		         '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет в логах',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Проверив систему логирования, нарушение не было обнаружено.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет нарушений',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'На ваших доказательствах отсутствуют нарушения игрока.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная ЖБ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба составлена неадекватно.<br>Составьте жалобу адекватно и создайте новую тему.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Условия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Отсутствуют условия сделки или они расписаны не корректно.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не тот сервер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'При составлении жалобы, Вы ошиблись сервером.<br>Подайте жалобу в раздел Вашего сервера.<br>' +
          'Свой сервер Вы можете найти на главной странице форума:<br>' +
          '[url=https://forum.blackrussia.online/][Color=white][U]Главная страница форума[/U][/Color][/url]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет тайма',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'На ваших доказательствах отсутствует /time.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет таймкодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '3+ дня',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Вашим доказательствам более трёх дней.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
	},
{
    title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша жалоба составлена от третьего лица.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дубликат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша тема является дубликатом предыдущей.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дублирование',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ответ на вашу жалобу был дан в предыдущей теме.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
	},
{
    title: 'Обмен ИВ на BC',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Обменивать Игровую Валюту на Донат Валюту запрещено. В последующих случаях это будет приравниваться к пункту правил:<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][B]обмен донат-услуг на игровую валюту запрещен.[/B]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]покупка игровой валюты или ценностей через официальный сайт разрешена.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг отказ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Исходя из общих правил проекта, нарушений от игрока нет. Подобные долги никак не наказуемые со стороны администрации. Долги, которые были выданы через трейд, полностью ваша ответственность. По правилам, выдача долга должна быть начислена через банковский счет.<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)] Ban 30 дней / permban [/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Игрок наказан',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель уже наказан.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: '--------> Проблемы с док-вами <--------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В данном случае требуется Видеодоказательство на нарушение от игрока.<br><br>' +
          'Создайте новую тему и прикрепите доказательства в виде видео, загруженные на хостинги (Rutube, Youtube, Imgur).<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
	},
{
    title: 'Не те док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'NickName в доказательствах не соответствует указанному в жалобе.<br>Составьте жалобу корректно и создайте новую тему.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва в соц сетях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (Rutube, Япикс, imgur).<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва удалены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Доказательства удалены или недоступны для просмотра.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Недостаточно доказательств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В вашей жалобе недостаточно доказательств на нарушение игрока.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ссылка не работает',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки или загрузите на фото/видео хостинги (Rutube, Япикс, imgur) и напишите новую жалобу.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва отредактированы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Доказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутвуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва приватны',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В вашей жалобе доказательства приватны. Создайте новую жалобу, загрузив доказательства с нарушениями игрока на любой другой хостинг.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '------> Правила Текстового Чата <------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:<br>[QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR][/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Расизм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Упом/Оск Родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'FLOOD',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп Символами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Слив Глоб Чатов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Выдача себя за адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ввод в заблуждение командами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Музыка в Voice чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шумы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Политика/Религия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Софт для голоса',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.19. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Транслит',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.20. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама Промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>'+
          '[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>'+
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обьявления на тт ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Мат в VIP чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/QUOTE][/COLOR]<br>'+
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
}, 
{
    title: '-----> Правила RolePlay Процесса <-----',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Постороннее ПО',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR]<br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR]<br>' +
          '[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP повeдение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP /edit',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя из основных правил государственных организаций по пункту правил:[QUOTE] 4.01. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Эфир',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя из основных правил государственных организаций по пункту правил:[QUOTE] 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Замена текста',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя из основных правил государственных организаций по пункту правил:[QUOTE] 4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/color][/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP адвокат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя из основных правил государственных организаций по пункту правил:[QUOTE] 3.01. Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [Color=Red]| Warn[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Поимка/арест на тт ОПГ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[SIZE=4][FONT=verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          'Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[QUOTE][SIZE=4] [Color=#FF0000]1.16.[/color] Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [Color=#FF0000]| Warn[/color]<br>' +
          '[Color=#FF0000]Примечание:[/COLOR] территория ОПГ — это место, где находятся автопарк криминальной организации и её штаб со складом.[/QUOTE]<br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},            
{
    title: 'Ввод в забл. (ЦБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[SIZE=4][FONT=verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          'Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[QUOTE][SIZE=4] [Color=#FF0000]5.02.[/color] Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами [Color=#FF0000]| Ban 3-5 дней + ЧС организации[/color][/QUOTE]<br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/COLOR] [/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},    
{
    title: 'Розыск без причины (УМВД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[SIZE=4][FONT=verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          'Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[QUOTE][SIZE=4] [Color=#FF0000]6.02.[/color] Запрещено выдавать розыск без IC причины [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
}, 
{
    title: 'Розыск/штраф без причины (ГИБДД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[SIZE=4][FONT=verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          'Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[QUOTE][SIZE=4] [Color=#FF0000]7.02.[/color] Запрещено выдавать розыск, штраф без IC причины [Color=#FF0000]| Warn[/color][/QUOTE]<br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},            
{
    title: 'nRP поведение (УМВД/ГИБДД/ФСБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[SIZE=4][FONT=verdana][CENTER][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          'Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил:[QUOTE][SIZE=4] [Color=#FF0000]6.03.[/color] Запрещено nRP поведение [Color=#FF0000]| Warn[/color]<br>' +
          '[COLOR=#FF0000]Пример:[/COLOR]<br>' +
          '- открытие огня по игрокам без причины,<br>' +
          '- расстрел машин без причины,<br>' +
          '- нарушение ПДД без причины,​<br>' +
          '- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне,​<br>' +
          '- сотрудник с целью облегчить процесс конвоирования, убивает преступника в наручниках.[/QUOTE]<br><br>' +
          '[URL=https://postimages.org/][IMG]https://i.postimg.cc/hPT9NFDC/image.png[/IMG][/URL]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},              
{
    title: 'Уход от RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Помеха RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP обман(Попытка)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аморальные действия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман в /do',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фракционный тс в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>'+
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>'+
          'С уважением, администрация сервера![/COLOR] [/CENTER][/FONT][/SIZE]<br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DB',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'TK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br>    {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'SK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'MetaGaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Mass DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие багов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие от адм нарушителей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред репутиции проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред ресурсам проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама соц сетей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Уязвимость правил',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.33. Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Конфликты о национальности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'OOC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7-15 дней.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Расп. личной информации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.38. Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan +ЧС проекта.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп. нарушениями',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.39. Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.<br>' +
          '[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.<br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Критика проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (30 мин)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.03. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/QUOTE][/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (60 мин) [фура/инко]',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05)[/COLOR]. [/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аресты в интерьере',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP аксессуар',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оск адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Багаюз с аним',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 120 минут.[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'NRP В/Ч',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя  из правил нападания на военную часть по пункту:[QUOTE]2. За нарушение правил нападения на Военную Часть выдаётся предупреждение | [COLOR=rgb(255, 0, 0)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE][/COLOR]<br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Исп. маскировки в лич. целях (NRP В/Ч)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан исходя  из правил нападания на военную часть по пункту:[QUOTE]16. Участникам криминальных организаций запрещено использовать форму военного и путевой лист в личных целях [COLOR=rgb(255, 0, 0)]| Warn NonRP В/Ч[/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] участник криминальной организации купил форму военного и путевой лист, скрытно проник на территорию воинской части, но вместо угона камаза для материалов, пошел к складу и добывает материалы для себя.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] форма военного и путевой лист предназначены исключительно для угона камаза для материалов.[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг одобрен',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:<br> '+
          '[QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)] Ban 30 дней / permban [/COLOR]<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=#00FF00][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фейк никнейм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Нарушитель будет наказан по пункту правил:[QUOTE][COLOR=red]2.55.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan.[/COLOR]<br><br>' +
          '[COLOR=red]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '---------> RolePlay Биографии <---------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
	},
{
    title: 'Биография одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Role Play Биография составлена не по форме.<br>Создайте новую Биографию по форме.<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Форма подачи RP биографии:[/COLOR]<br>'+
          '[QUOTE]Имя и фамилия персонажа:<br>' +
          'Пол:<br>' +
          'Возраст:<br>' +
          'Национальность:<br>' +
          'Образование:<br>' +
          'Описание внешности:<br>' +
          'Характер:<br>' +
          'Детство:<br>' +    
          'Настоящее время:<br>' +
          'Итог:<br>[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Заголовок вашей Role Play Биографии не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR] Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Role Play Биография не соответствует требованиям подачи, а именно: <br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.6.[/COLOR] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В Вашей Role Play Биография осутствуют фото и иные материалы, относящиеся к истории вашего персонажа <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Объем инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как она имеет не соответствующий объем информации.<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR] Минимальный объём RP биографии — 200 слов, максимальный — 600.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Логика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как её содержание имеет логические противоречия.<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR] В биографии не должно быть логических противоречий.<br>' +
          '[COLOR=RED]Пример:[/COLOR] в пункте «Возраст» вы указываете, что вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Супер способности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как вы присвоили своему персонажу супер-способности. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как в ней содержится много грамматических ошибок. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как она скопирована. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Биография',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '----------> RolePlay Ситуации <----------',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Ситуация одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не внутриигр. инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как отражает не внутриигровую информацию.<br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR] В RP ситуации должна быть отражена только внутриигровая информация.[/QUOTE]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как в ней содержится много грамматических ошибок.<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация составлена не по форме.<br>Создайте новую RP ситуацию по форме.<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Форма подачи RP ситуации:[/COLOR]<br>' +
          '[QUOTE]1. Название:<br>' +
          '2. Пролог: (введение / предыстория)<br>' +
          '3. Сюжет: (основная часть RP ситуации)<br>' +
          '4. Эпилог: (заключение / итоги)<br>' +
          '5. Ссылка на исходные материалы с отыгровками:[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Заголовок вашей RolePlay ситуации не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.5.[/COLOR] Название темы с RP ситуацией оформляется по форме: [Краткое название события] Событие <br><br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [Катастрофа] Взрыв на химическом заводе[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'На фото ООС инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В Вашей RolePlay ситуации присутствуют фото на которых имеется ООС информация<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR] Скриншоты не должны содержать OOC-информацию и интерфейс, кроме того, который нельзя убрать системно.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет ссылок на RP отыгр',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В Вашей RolePlay ситуации нет ссылок на материалы, где видны RP отыгровки.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.8.[/COLOR] В конце RP ситуации игрок должен предоставить ссылку на исходные материалы, где видны RP отыгровки.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация не соответствует требованиям подачи, а именно: <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR] RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как она скопирована. <br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Ситуация',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----> Неоф. RolePlay организация <-----',
    dpstyle: "padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #fff; text-shadow: 0 0 3px #ff8c00; background: linear-gradient(to bottom, #ff6a00, #ff4500); border: none; border-radius: 5px; box-shadow: 0 0 8px rgba(255, 140, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 0 #cc5500, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;"
},
{
    title: 'Орг-ция одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: true,
},
{
    title: 'Меньше 3-х человек',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как у вас меньше 3-х участников. <br>' +
          '[QUOTE]Минимальный состав участников для создания неофициальной RP организации — 3 человека.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Род деят-ти/история',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как не описан род деятельности и(или) истории <br>' +
          '[QUOTE]Организация должна иметь чёткий род деятельности и свою историю.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как в ней содержится много грамматических ошибок.<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация составлена не по форме.<br>Создайте новую Биографию по форме.<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Форма подачи заявки:[/COLOR]<br>'+
          '[QUOTE]1. Название вашей организации:<br>' +
          '2. История создания:<br>' +
          '3. Состав участников:<br>' +
          '4. Устав:<br>' +
          '5. Описание деятельности:<br>' +
          '6. Отличительная визуальная особенность:<br>' +
          '7. Как и где можно попасть в вашу организацию:<br>' +
          '8. Ссылка на одобренную RP биографию:[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Заголовок вашей неофициальной RolePlay организации не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.8.[/COLOR] Название темы должно быть оформлено по шаблону: Неофициальная RP организация [Название][/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как она скопирована. <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.5.[/COLOR] Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Орг-я в форме ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация создана в форме государственной фракции.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.6.[/COLOR] Запрещено создавать организации в форме государственных фракций.<br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] неофициальная RP организация «Росгвардия».[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Осутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'В Вашей неофициальной RolePlay организации осутствуют фото и иные материалы.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR] Заявка на организацию должна сопровождаться фото- или видеоматериалами.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная неоф. орг-я',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][COLOR=rgb(222, 184, 135)]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на сервере [COLOR=rgb(255, 165, 0)]Orange(05).[/COLOR]<br>' +
          'С уважением, администрация сервера![/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addAnswers();
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
    function addButton(name, id, style) {
     $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
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
 
(function() {
    'use strict';
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
    function init() {
        // Контейнер для выпадающего списка
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            margin: 10px 0;
            padding: 10px;
            background: rgba(0,0,0,0.05);
            border-radius: 5px;
            display: flex;
            align-items: center;
        `;
 
        // Элемент select
        const select = document.createElement('select');
        select.style.cssText = `
            font-size: 12px;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #E6E6FA;
            background: #1c1c1c;
            color: #E6E6FA;
            cursor: pointer;
        `;
 
        // Массив ссылок и названий
        const options = [
            { text: "Выберите раздел...", href: "" },
            { text: "Раздел сервера ORANGE", href: "https://forum.blackrussia.online/forums/Сервер-№5-orange.246/" },
            { text: "ЖБ на игроков", href: "https://forum.blackrussia.online/forums/Жалобы-на-игроков.273/" },
            { text: "Неоф. RP Орган.", href: "https://forum.blackrussia.online/forums/Неофициальные-rp-организации.250/" },
            { text: "RP Ситуации", href: "https://forum.blackrussia.online/forums/РП-ситуации.252/" },
            { text: "RP Биографии", href: "https://forum.blackrussia.online/forums/РП-биографии.254/" },
            { text: "Общие правила серверов", href: "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/" },
            { text: "Общие правила ГОСС", href: "https://forum.blackrussia.online/threads/Общие-правила-для-государственных-организаций.655011/" },
            { text: "Общие правила ОПГ", href: "https://forum.blackrussia.online/threads/Общие-правила-криминальных-организаций.3353981/" },
            { text: "АРХИВ", href: "https://forum.blackrussia.online/forums/Архив.85/" }
        ];
 
        // Заполнение опций
        options.forEach(opt => {
            const option = document.createElement('option');
            option.textContent = opt.text;
            option.value = opt.href;
            select.appendChild(option);
        });
 
        // Событие выбора
        select.addEventListener('change', function() {
            if (this.value) {
                window.location.href = this.value;
            }
        });
 
        wrapper.appendChild(select);
 
        const pageContent = document.querySelector('.pageContent');
        if (pageContent) {
            pageContent.insertBefore(wrapper, pageContent.firstChild);
        } else {
            document.body.insertBefore(wrapper, document.body.firstChild);
        }
    }
})();
 
(function() {
    'use strict';
 
    // Функция для проверки, что это раздел биографий
    function isBiographySection() {
        // Проверяем несколько способов определения раздела биографий
        const breadcrumb = document.querySelector('.p-breadcrumbs');
        if (breadcrumb) {
            const breadcrumbText = breadcrumb.textContent.toLowerCase();
            if (breadcrumbText.includes('рп-биографии') ||
                breadcrumbText.includes('биографи') ||
                document.URL.includes('/forums/РП-биографии')) {
                return true;
            }
        }
 
        // Проверяем заголовок темы
        const title = document.querySelector('.p-title-value');
        if (title && title.textContent.toLowerCase().includes('биографи')) {
            return true;
        }
 
        // Проверяем URL
        if (document.URL.includes('биографи')) {
            return true;
        }
 
        return false;
    }
 
    // Функция для очистки текста от не-слов
    function cleanText(text) {
        // Удаляем BB-коды и HTML теги
        text = text.replace(/\[.*?\]/g, ' ');
        text = text.replace(/<.*?>/g, ' ');
 
        // Удаляем смайлики и эмодзи
        text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, ' '); // Эмодзи
        text = text.replace(/[\u{1F300}-\u{1F5FF}]/gu, ' '); // Символы и пиктограммы
        text = text.replace(/[\u{1F680}-\u{1F6FF}]/gu, ' '); // Транспорт и карты
        text = text.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, ' '); // Флаги
        text = text.replace(/[;:][)(]|[)(][;:]|:[()]|\([;:)]|[:;]-?[()DPp]|\(-?[:;]|<3/gi, ' '); // Текстовые смайлы
 
        // Удаляем цифры, года, даты (только отдельные числа)
        text = text.replace(/\b\d+\b/g, ' '); // Любые отдельные числа
 
        // Удаляем специальные символы, оставляем только буквы, дефисы и пробелы
        text = text.replace(/[^\w\sа-яА-ЯёЁ\-]/g, ' ');
 
        // Удаляем лишние пробелы
        text = text.trim().replace(/\s+/g, ' ');
 
        return text;
    }
 
    // Функция для подсчета слов
    function countWords(text) {
        // Очищаем текст
        text = cleanText(text);
        if (text === '') return 0;
 
        // Разделяем на слова и фильтруем
        const words = text.split(' ').filter(word => {
            // Исключаем пустые строки
            return word.length > 0 &&
                   // Исключаем слова содержащие только цифры
                   !/^\d+$/.test(word);
        });
 
        return words.length;
    }
 
    // Функция для проверки, что это первое сообщение темы
    function isFirstPost(post) {
        // Находим все сообщения в теме
        const allPosts = document.querySelectorAll('.message--post');
        if (allPosts.length === 0) return false;
 
        // Первое сообщение - это первое в списке
        return post === allPosts[0];
    }
 
    // Функция для добавления счетчика к посту
    function addWordCounterToPost(post) {
        // Проверяем, что это раздел биографий
        if (!isBiographySection()) {
            return;
        }
 
        // Проверяем, что это ПЕРВОЕ сообщение темы
        if (!isFirstPost(post)) {
            return;
        }
 
        // Ищем контент поста
        const content = post.querySelector('.bbWrapper');
        if (!content) return;
 
        // Пропускаем пустые посты или посты с малым количеством текста
        if (content.textContent.trim().length < 50) {
            return;
        }
 
        // Удаляем предыдущий счетчик если есть
        const existingCounter = post.querySelector('.word-counter');
        if (existingCounter) {
            existingCounter.remove();
        }
 
        // Получаем текст без цитат
        let text = content.innerHTML;
 
        // Удаляем цитаты
        text = text.replace(/<blockquote.*?<\/blockquote>/gs, '');
        text = text.replace(/\[quote.*?\[\/quote\]/gs, '');
 
        // Удаляем подписи
        const signature = content.querySelector('.message-signature');
        if (signature) {
            text = text.replace(signature.outerHTML, '');
        }
 
        // Получаем чистый текст
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';
 
        // Удаляем лишние пробелы и переносы
        cleanText = cleanText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
 
        // Считаем слова
        const rawWordCount = countWords(cleanText);
        // Вычитаем 15 слов
        const finalWordCount = Math.max(0, rawWordCount - 15);
 
        // Создаем элемент счетчика
        const counter = document.createElement('div');
        counter.className = 'word-counter';
        counter.style.cssText = `
            margin: 15px 0;
            padding: 12px;
            border-radius: 8px;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
 
        // Определяем цвет в зависимости от количества слов
        let color, status, icon;
        if (finalWordCount >= 200 && finalWordCount <= 600) {
            color = '#28a745';
            status = 'Соответствует требованиям';
            icon = '✅';
        } else if (finalWordCount < 200) {
            color = '#dc3545';
            status = `Меньше 200 слов (не хватает ${200 - finalWordCount})`;
            icon = '❌';
        } else {
            color = '#dc3545';
            status = `Больше 600 слов (лишних ${finalWordCount - 600})`;
            icon = '❌';
        }
 
        counter.innerHTML = `
            <div style="color: ${color}; font-size: 16px; margin-bottom: 5px;">
                ${icon} <strong>Слов в биографии: ${finalWordCount}</strong>
            </div>
            <div style="color: #6c757d; font-size: 12px; margin-bottom: 3px;">
                (Без учета вычета 15 слов (заголовки пунктов) ${rawWordCount})
            </div>
            <div style="color: ${color}; font-size: 12px; margin-bottom: 5px;">
                ${status}
            </div>
            <div style="font-size: 11px; color: #6c757d;">
                Требования: 200-600 слов (Без учета вычета 15 слов (заголовки пунктов))
            </div>
        `;
 
        // Добавляем счетчик после контента
        content.parentNode.insertBefore(counter, content.nextSibling);
 
        console.log('Счетчик слов:', {
            'Изначально слов': rawWordCount,
            'После вычета': finalWordCount,
            'Текст для проверки': cleanText.substring(0, 100) + '...'
        });
    }
 
    // Функция для обработки всех постов на странице
    function processAllPosts() {
        if (!isBiographySection()) {
            console.log('Это не раздел биографий, скрипт не активирован');
            return;
        }
 
        console.log('Раздел биографий обнаружен, активирую счетчик слов...');
 
        const posts = document.querySelectorAll('.message--post');
        console.log('Найдено постов:', posts.length);
 
        // Обрабатываем только первый пост
        if (posts.length > 0) {
            addWordCounterToPost(posts[0]);
        }
    }
 
    // Запускаем при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllPosts);
    } else {
        processAllPosts();
    }
 
    // Обработка динамически загружаемого контента
    const observer = new MutationObserver(function(mutations) {
        if (!isBiographySection()) return;
 
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('message--post')) {
                        // Проверяем, что это первое сообщение
                        const allPosts = document.querySelectorAll('.message--post');
                        if (allPosts.length > 0 && node === allPosts[0]) {
                            setTimeout(() => addWordCounterToPost(node), 500);
                        }
                    }
                }
            });
        });
    });
 
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
 
})();