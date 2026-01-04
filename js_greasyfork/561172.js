// ==UserScript==
// @name              [TVER] | Скрипт для Кураторов Форума [RP биграфии , ситуации , неофициальные организации]
// @namespace         https://forum.blackrussia.online
// @version           1.1.1
// @author            Egor_Montano
// @connection        none
// @updateversion     Создан 03.01.2026
// @match             https://forum.blackrussia.online/threads/*
// @include           https://forum.blackrussia.online/threads/
// @license           none
// @icon              https://i.postimg.cc/tRx0hF8P/01fdde7ae0d9dd957948e83fc946ff29.jpg
// @description       Скрипт, который подходит для сервера Tver  , предназначен для быстрой реакции кураторов форума в различных разделах. Он разработан с учётом размеров экрана телефона.
// @downloadURL https://update.greasyfork.org/scripts/561172/%5BTVER%5D%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5BRP%20%D0%B1%D0%B8%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%20%2C%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8%20%2C%20%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561172/%5BTVER%5D%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5BRP%20%D0%B1%D0%B8%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8%20%2C%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8%20%2C%20%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%5D.meta.js
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
    const WAIT_PREFIX = 14; // Префикс "Ожидание"
    const PINBIO_PREFIX = 15; // Префикс "На рассмотрении" для биографий and Открыто/закреп
    const buttons = [
{
    title: '------> RP Биографии дополнение <------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 0 3px #000000; background: linear-gradient(to bottom, #00FFFF, #7FFFD4); border: none; border-radius: 10px; box-shadow: 0 0 8px rgba(102, 205, 170), inset 0 1px 1px rgba(0, 139, 139), 0 2px 0 #008B8B, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Нет фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей Role Play биографии отсутствуют фото и иные материалы, относящиеся к истории Вашего персонажа.<br>' +
          'Предоставьте недостающие материалы в течение <b>24 часов</b>.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории Вашего персонажа.[/QUOTE]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 165, 0)][ICODE]Ожидание дополнения (24ч)[/ICODE][/COLOR]<br><br>',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей RolePlay биографии присутствуют грамматические ошибки.<br>' +
          'Исправьте ошибки в течение <b>24 часов</b>.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 165, 0)][ICODE]Ожидание дополнения (24ч)[/ICODE][/COLOR]<br><br>',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Объем текста',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография имеет не соответствующий объем информации.<br>' +
          'Доведите объем до требуемого (200-600 слов) в течение <b>24 часов</b>.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR] Минимальный объём RP биографии — 200 слов, максимальный — 600.[/QUOTE]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 165, 0)][ICODE]Ожидание дополнения (24ч)[/ICODE][/COLOR]<br><br>',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Заголовок Вашей Role Play биографии не соответствует правилам подачи.<br>' +
          'Исправьте заголовок в течение <b>24 часов</b>.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR] Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/QUOTE]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 165, 0)][ICODE]Ожидание дополнения (24ч)[/ICODE][/COLOR]<br><br>',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Мало информации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей RolePlay биографии недостаточно информации в основных разделах.<br>' +
          'Дополните разделы (Детство, Настоящее время, Итог) в течение <b>24 часов</b>.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 165, 0)][ICODE]Ожидание дополнения (24ч)[/ICODE][/COLOR]<br><br>',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: '---------> RolePlay Биографии <---------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 0 3px #000000; background: linear-gradient(to bottom, #00FFFF, #7FFFD4); border: none; border-radius: 10px; box-shadow: 0 0 8px rgba(102, 205, 170), inset 0 1px 1px rgba(0, 139, 139), 0 2px 0 #008B8B, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
	},
{
    title: 'Биография одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация TVER![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
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
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver[/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Заголовок Вашей Role Play Биографии не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR] Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Role Play Биография не соответствует требованиям подачи, а именно: <br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.6.[/COLOR] Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей Role Play Биография осутствуют фото и иные материалы, относящиеся к истории Вашего персонажа <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории Вашего персонажа.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Объем инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как она имеет не соответствующий объем информации.<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR] Минимальный объём RP биографии — 200 слов, максимальный — 600.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Логика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как её содержание имеет логические противоречия.<br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR] В биографии не должно быть логических противоречий.<br>' +
          '[COLOR=RED]Пример:[/COLOR] в пункте «Возраст» Вы указываете, что Вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Супер способности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как Вы присвоили своему персонажу супер-способности. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как в ней содержится много грамматических ошибок. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как она скопирована. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Биография',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей RP биографий можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=red]<br>«Правила составления RP биографии»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay биография получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '----------> RolePlay Ситуации <----------',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 0 3px #000000; background: linear-gradient(to bottom, #00FFFF, #7FFFD4); border: none; border-radius: 10px; box-shadow: 0 0 8px rgba(102, 205, 170), inset 0 1px 1px rgba(0, 139, 139), 0 2px 0 #008B8B, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Ситуация одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не внутриигр. инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как отражает не внутриигровую информацию.<br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.1.[/COLOR] В RP ситуации должна быть отражена только внутриигровая информация.[/QUOTE]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как в ней содержится много грамматических ошибок.<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация составлена не по форме.<br>Создайте новую RP ситуацию по форме.<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Форма подачи RP ситуации:[/COLOR]<br>' +
          '[QUOTE]1. Название:<br>' +
          '2. Пролог: (введение / предыстория)<br>' +
          '3. Сюжет: (основная часть RP ситуации)<br>' +
          '4. Эпилог: (заключение / итоги)<br>' +
          '5. Ссылка на исходные материалы с отыгровками:[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Заголовок Вашей RolePlay ситуации не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.5.[/COLOR] Название темы с RP ситуацией оформляется по форме: [Краткое название события] Событие <br><br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [Катастрофа] Взрыв на химическом заводе[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'На фото ООС инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей RolePlay ситуации присутствуют фото на которых имеется ООС информация<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.7.[/COLOR] Скриншоты не должны содержать OOC-информацию и интерфейс, кроме того, который нельзя убрать системно.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет ссылок на RP отыгр',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей RolePlay ситуации нет ссылок на материалы, где видны RP отыгровки.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.8.[/COLOR] В конце RP ситуации игрок должен предоставить ссылку на исходные материалы, где видны RP отыгровки.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация не соответствует требованиям подачи, а именно: <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.9.[/COLOR] RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как она скопирована. <br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Ситуация',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=red]<br>«Правила составления RP ситуации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша RolePlay ситуация получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----> Неоф. RolePlay организация <-----',
    dpstyle: 'padding: 6px 16px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #000000; text-shadow: 0 0 3px #000000; background: linear-gradient(to bottom, #00FFFF, #7FFFD4); border: none; border-radius: 10px; box-shadow: 0 0 8px rgba(102, 205, 170), inset 0 1px 1px rgba(0, 139, 139), 0 2px 0 #008B8B, 0 3px 5px rgba(0, 0, 0, 0.2); cursor: pointer; transition: all 0.1s ease; line-height: 1;'
},
{
    title: 'Орг-ция одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: true,
},
{
    title: 'Меньше 3-х человек',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как у Вас меньше 3-х участников. <br>' +
          '[QUOTE]Минимальный состав участников для создания неофициальной RP организации — 3 человека.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Род деят-ти/история',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как не описан род деятельности и(или) истории <br>' +
          '[QUOTE]Организация должна иметь чёткий род деятельности и свою историю.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация получает статус Отказано, так как в ней содержится много грамматических ошибок.<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша Неофициальная RolePlay организация составлена не по форме.<br>Создайте новую Биографию по форме.<br><br>' +
          '[COLOR=rgb(255, 0, 0)]Форма подачи заявки:[/COLOR]<br>'+
          '[QUOTE]1. Название Вашей организации:<br>' +
          '2. История создания:<br>' +
          '3. Состав участников:<br>' +
          '4. Устав:<br>' +
          '5. Описание деятельности:<br>' +
          '6. Отличительная визуальная особенность:<br>' +
          '7. Как и где можно попасть в Вашу организацию:<br>' +
          '8. Ссылка на одобренную RP биографию:[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Заголовок Вашей неофициальной RolePlay организации не соответсвует правилам подачи.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.8.[/COLOR] Название темы должно быть оформлено по шаблону: Неофициальная RP организация [Название][/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как она скопирована. <br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.5.[/COLOR] Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены.[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Орг-я в форме ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация создана в форме государственной фракции.<br>'+
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.6.[/COLOR] Запрещено создавать организации в форме государственных фракций.<br>' +
          '[COLOR=rgb(255, 0, 0)]Пример:[/COLOR] неофициальная RP организация «Росгвардия».[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Осутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'В Вашей неофициальной RolePlay организации осутствуют фото и иные материалы.<br><br>' +
          '[QUOTE][COLOR=rgb(255, 0, 0)]1.10.[/COLOR] Заявка на организацию должна сопровождаться фото- или видеоматериалами.<br>' +
          '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).[/QUOTE]<br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная неоф. орг-я',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как в ней присутвует нецензурная брань или же оскорбления. <br><br>' +
          'Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=red]<br>«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша тема не относится к данному разделу. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
	   prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat',
    content:
          '[CENTER][SIZE=4][FONT=Verdana][color=#7FFFD4]Доброго времени суток, уважаемый(-ая)[/COLOR]<br> {{ user.mention }}.<br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          'Ваша неофициальная RolePlay организация получает статус Отказано, так как ответ был дан в предыдущей теме. <br><br>' +
          '[url=https://postimg.cc/14M7JHxP][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png  [/img][/url]<br><br>' +
          '[COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто[/ICODE][/COLOR]<br><br>' +
          'Приятной игры на [COLOR=red]BLACK RUSSIA.[/COLOR]<br>' +
          'С уважением, [COLOR=blue]администрация Tver![/COLOR][/FONT][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
];
 
$(document).ready(() => {
	$('body').append('<script src=https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js></script>');

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
    
function buttonsMarkup(buttons) {
	return `
		<div class="select_answer" style="
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			width: 100%;
		">
			${buttons.map((btn, i) => {
				const isHeader = btn.title.includes('---->') || btn.title.includes('———>') || btn.title.includes('------>');
				
				if (isHeader) {
					// Для заголовков
					return `
					<div style="width: 100%; display: flex; align-items: center; gap: 10px; margin: 5px 0;">
						<div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent 0%, #7FFFD4 50%, transparent 100%);"></div>
						<button id="answers-${i}" class="button--primary button rippleButton" 
							style="flex-shrink: 0; margin: 0; ${btn.dpstyle}">
							<span class="button-text">${btn.title}</span>
						</button>
						<div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent 0%, #7FFFD4 50%, transparent 100%);"></div>
					</div>`;
				} else {
					// Для обычных кнопок
					return `<button id="answers-${i}" class="button--primary button rippleButton" 
						style="width: auto; margin: 0; ${btn.dpstyle}">
						<span class="button-text">${btn.title}</span>
					</button>`;
				}
			}).join('')}
		</div>
	`;
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
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    // Для PINBIO_PREFIX - тема закреплена, открыта и с префиксом "На рассмотрении"
    if (prefix === PINBIO_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: PIN_PREFIX, // Используем PIN_PREFIX для префикса "На рассмотрении"
                title: threadTitle,
                sticky: 1,           // Закрепление
                discussion_open: 1,  // Тема ОТКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для PIN_PREFIX - тема закреплена, закрыта и с префиксом "На рассмотрении"
    else if (prefix === PIN_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,           // Закрепление
                // discussion_open не передаем - тема ЗАКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для остальных случаев с pin = true
    else if (pin == true) {
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
    // Для случаев с pin = false
    else {
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
}
    // Функция для открытой темы (без закрытия)
function editThreadDataOpen(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            discussion_open: 1, // 1 = тема открыта
            sticky: pin ? 1 : 0,
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

// Добавляем кнопку "Префиксы" и выпадающий блок
addButton('Префиксы', 'prefixesToggle', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgba(127, 199, 255, 0.8); font-family: UtromPressKachat; padding: 8px 16px; background: linear-gradient(to bottom, #00FFFF, #7FFFD4); color: black; font-weight: bold;');

// Создаем блок с кнопками статусов
$('button#prefixesToggle').after(`
    <div id="prefixesBox" style="
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        z-index: 1000;
        margin-top: 5px;
        min-width: 220px;
        display: none;
    ">
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="на рассмотрении" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff7700, #e56a00); color: white;">
                📌 На рассмотрении
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="главному администратору" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff0000, #cc0000); color: white;">
                🔻 Главному Администратору
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="тех специалисту" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #0066ff, #0055dd); color: white;">
                👨‍💻 Тех. специалисту
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="ожидание" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #6c757d, #5a6268); color: white;">
             ⏳ Ожидание
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="одобрено" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #28a745, #218838); color: white;">
                Одобрено ✓
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="отказано" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #dc3545, #c82333); color: white;">
                Отказано ✗
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="закрыто" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff4444, #cc3333); color: white;">
                Закрыто 🔒
            </button>
        </div>
    </div>
`);

// Обработчики для префиксов
$('button#prefixesToggle').click(function(e) {
    e.stopPropagation();
    $('#prefixesBox').toggle();
});

// Обработка кликов по кнопкам статусов
$('.status-btn').click(function() {
    const status = $(this).data('status');
    const PREFIXES = {
        'на рассмотрении': PIN_PREFIX,
        'одобрено': ACCEPT_PREFIX,  
        'отказано': UNACCEPT_PREFIX,
        'ожидание': WAIT_PREFIX,
        'главному администратору': GA_PREFIX,
        'тех специалисту': TECH_PREFIX,
        'закрыто': CLOSE_PREFIX
    };
    
    const prefixId = PREFIXES[status];
    
    // Определяем какие кнопки закрепляют тему (pin = true)
    const PIN_BUTTONS = [
        'на рассмотрении',
        'главному администратору', 
        'тех специалисту',
        'ожидание'
    ];
    
    // Особый случай для кнопки "Ожидание" - открывает тему
    if (status === 'ожидание') {
        editThreadDataOpen(prefixId, true); // pin = true, тема ОТКРЫТА
    } 
    // Остальные кнопки
    else if (PIN_BUTTONS.includes(status)) {
        editThreadData(prefixId, true); // pin = true, тема ЗАКРЫТА
    } else {
        editThreadData(prefixId, false); // pin = false, тема ЗАКРЫТА
    }
    
    $('#prefixesBox').hide();
});

// Закрытие блока при клике вне области
$(document).click(function(e) {
    if (!$(e.target).closest('#prefixesToggle, #prefixesBox').length) {
        $('#prefixesBox').hide();
    }
});

// Предотвращаем закрытие при клике внутри блока
$('#prefixesBox').click(function(e) {
    e.stopPropagation();
});
    
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
                (с учетом вычета 15 слов, изначально: ${rawWordCount})
            </div>
            <div style="color: ${color}; font-size: 12px; margin-bottom: 5px;">
                ${status}
            </div>
            <div style="font-size: 11px; color: #6c757d;">
                Требования: 200-600 слов (учитывается вычет 15 слов)
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
    
          })();