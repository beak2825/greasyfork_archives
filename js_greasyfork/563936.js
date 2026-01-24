// ==UserScript==
// @name         Скрипт для КФ/ЗГСФ/ГСФ || Blue версия 2.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для КФ/ЗГСФ/ГСФ
// @author       David Rabadanov
// @match https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/563936/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/563936/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%2020.meta.js
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
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
	{
title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для ГКФ и ЗГКФ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{    
 
title: '| Одобрено |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Игрок будет[/FONT][/SIZE][/COLOR] [COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]наказан[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]. Спасибо за обращение![/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Обмен bc на ив и наоборот|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша жалоба - [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]Одобрена.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua] Вы и нарушитель будете [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]заблокированы[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua].[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Не можем выдать наказание |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]На данный момент мы не можем выдать наказание по жалобе оставленной на форуме.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua] Отказано[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua].[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
                 	  title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача на рассмотрение╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша жалоба находится на [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]рассмотрении[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]. Ожидайте ответа и не создавайте дубликаты тем.[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша жалоба находится на [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]рассмотрении [/FONT][COLOR=rgb(255, 222, 173)][FONT=book antiqua]у[/FONT][/COLOR][FONT=book antiqua] Технического специалиста. Ожидайте ответа и не создавайте дубликаты тем.[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
},
{
 
title: '| Нарушений не найдено |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша жалоба - [/FONT][COLOR=rgb(255, 0, 255)][FONT=book antiqua]Отказана[/FONT][/COLOR][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]. Нарушений не было обнаружено.[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Возврат средств возможен только при [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]инициативе самого обманщика[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua], если у него будет желание получить разблокировку аккаунта, он свяжется с Вами и в конечном итоге вы должны будете сойтись в компенсации, потом составляется обжалование от лица обманщика, [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 255)][SIZE=5][FONT=book antiqua]предварительно вы пишите ему на ФА условия компенсации[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua].[/FONT][/SIZE][/COLOR][/CENTER][/HEADING]",
                  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательств на нарушение недостаточно.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва не работают |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства не работают.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства отсутствуют.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства отредактированы.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва в вертикальном формате |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства в вертикальном формате не подлежат  [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]рассмотрению[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва плохого качества |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Предоставленные доказательства имеют [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]плохое качество[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства не открываются.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц. сеть |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Доказательства загруженные в соц. сетях, не подлежат рассмотрению. Для загрузки фото можно воспользоваться:[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Imgur, Япикс, Postimages. Для видео: YouTube, RuTube, ВК Видео[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Ник нарушаемого не совпадает с док-вами |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Ник нарушаемого[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] не совпадает[/SIZE][/COLOR][SIZE=5] с доказательствами.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лица (Никнейм подавшего не совпадает)|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Ваш никнейм [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]не совпадает[/SIZE][/COLOR][SIZE=5] с доказательствами.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Не относится к Жалобам на игроков (Добавить в какой раздел игроку обратиться) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Жалоба не относится к [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]нашему разделу[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Вы ошиблись сервером.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Дублирование темы |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Тема продублирована, если вы продолжите ее дублировать, то вам может быть выдана [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]блокировка ФА[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
 
title: '| Данный вид сделки, не является нонрп обманом |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба - [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5]Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Данный вид сделки [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]не является NRP Обманом[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки отсутствуют |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Условия сделки отсутствуют. [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг (нет срока займа) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. В условиях долга отсутствует срок займа. [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| 10 дней после срока долга|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Прошло более 10-ти дней с момента [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]окончания[/SIZE][/COLOR][SIZE=5] срока возврата долга.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Слив склада семьи (Что требуется показать игроку) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Создайте новое обращение учтя следующие [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]критерии:[/SIZE][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=2][LIST]"+
                  "[*][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua][B][CENTER]На фрапсе должен быть прописан [COLOR=rgb(255, 0, 255)]/time.[/COLOR][/CENTER][/B][/FONT][/SIZE][/COLOR]"+
                  "[*][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua][B][CENTER]Должны быть показаны семейные логи где четко видно нарушение [COLOR=rgb(255, 0, 255)](Выделить строки с нарушением(-и) игрока(-ов).[/COLOR][/CENTER][/B][/FONT][/SIZE][/COLOR]"+
                  "[*][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua][B][CENTER]В сути жалобы уточнить являетесь ли[COLOR=rgb(255, 222, 173)] вы[/COLOR][COLOR=rgb(255, 0, 255)] лидером семьи.[/COLOR][/CENTER][/B][/FONT][/SIZE][/COLOR]"+
                  "[*][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua][B][CENTER]Показать описание [COLOR=rgb(255, 0, 255)]семьи.[/COLOR][/CENTER][/B][/FONT][/SIZE][/COLOR]"+
                  "[/LIST][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи (Заместителем) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. Администрация не несет ответственности за [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]действия заместителя[/SIZE][/COLOR][SIZE=5] семьи.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Заголовок жалобы составлен [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]не по форме[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба не по форме |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Жалоба составлена[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] не по форме[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Отсутствует [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]/time[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет Time-кодов|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  На видео-доказательства [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]более 3-ёх минут[/SIZE][/COLOR][SIZE=5] нужны тайм-коды.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '|Time коды не по форме|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Тайм-коды составлены не по форме, они должны иметь [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]следующий вид:[/SIZE][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[CENTER][URL=https://yapx.ru/image/cqUPj][img]https://i.yapx.ru/cqUPjs.png[/img][/url][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Прошло более 72-ух часов с момента нарушения игрока.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Для фиксации данного нарушения необходим [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]фрапс(видеодоказательство)[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Фрапс обрывается.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оскорбление в IC |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  Оскорбление в IC чат - [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]ненаказуемо[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Неадекватное поведение в жалобе |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5].  В жалобе присутствует неадекватное поведение, обращение [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]не подлежит рассмотрению[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оск в названии док-в |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша жалоба -[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 255)][FONT=book antiqua][SIZE=5] Отказана[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]. В названии доказательств присутствуют оскорбления.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Одобрена[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Составлено не по форме.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы отказывать если недостаточно букв минимум 200) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Недостаточно информации в пунктах,[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] детство и настоящее время[/SIZE][/COLOR][SIZE=5].[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Биография скопирована.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Заголовок не по форме, пример:[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Биография | Nick_Name[/SIZE][/COLOR][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (отсутствие фото) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. В биографии должны присутствовать[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] фотографии и иные материалы,[/SIZE][/COLOR][SIZE=5] относящиеся к истории вашего персонажа.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (существующие никнеймы) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Запрещено составлять биографию [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]существующих людей[/SIZE][/COLOR][SIZE=5].[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (противоречит логике) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. В биографии не должно быть логических [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]противоречий[/SIZE][/COLOR][SIZE=5].[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Ошибки) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Биография должна быть читабельна и не содержать[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] грамматических[/SIZE][/COLOR][SIZE=5] или [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]орфографических[/SIZE][/COLOR][SIZE=5] ошибок.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(инфо о прошлом в настоящем времени) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. В пункте Настоящее время вы рассказываете про свое прошлое, что [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]противоречит[/SIZE][/COLOR][/COLOR][COLOR=rgb(255, 222, 173)][SIZE=5] его назначению. Составьте [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]новую биографию[/SIZE][/COLOR][SIZE=5] учтя это.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(инфо о взрослой жизни в детстве) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. В пункте Детство вы рассказываете о своём будущем, что [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]противоречит[/SIZE][/COLOR][SIZE=5] его назначению. Составьте [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]новую биографию [/SIZE][/COLOR][SIZE=5]учтя это.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(никнейм не совпадает) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Никнейм в заголовке [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]отличается[/SIZE][/COLOR][SIZE=5] от указанного в биографии.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Нонрп ник) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография -[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] Отказана[/SIZE][COLOR=rgb(255, 222, 173)][SIZE=5]. Ваш никнейм [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]не соответствует[/SIZE][/COLOR][SIZE=5] критериям RP никнейма.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био на дополнение |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша биография находится [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]на дополнении[/SIZE][/COLOR][SIZE=5]. Вам дается[/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5] 24 часа[/SIZE][/COLOR][SIZE=5] на дополнение информации.[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| РП ситуация одобрено |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша РП ситуация - [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Одобрена[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
 title: '| РП ситуация отказ. |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]Ваша РП ситуация - [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Отказана[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| Неофициальная Орг. Одобрено|',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша Неофициальная РП организация[/FONT][/SIZE][/COLOR] -[COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]- [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Одобрена[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '| Неофициальная Орг. Отказ |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша Неофициальная РП организация[/FONT][/SIZE][/COLOR] -[COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]- [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Отказана[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
  title: '| Неофициальная Орг. Отказ (Ошибка раздела) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Ваша ошиблись разделом [/FONT][/SIZE][/COLOR]-[COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]- [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Закрыто[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
    title: '| Неофициальная Орг. Отказ (Не по теме) |',
	  content:
                  "[CENTER][url=https://yapx.ru/image/cuoGJ][img]https://i.yapx.ru/cuoGJ.png[/img][/url][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][FONT=courier new][SIZE=5]Здравствуйте, {{ user.name }} [/SIZE][/FONT][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 222, 173)][SIZE=5][FONT=book antiqua]Не по теме [/FONT][/SIZE][/COLOR]-[COLOR=rgb(255, 222, 173)][FONT=book antiqua][SIZE=5]- [/SIZE][COLOR=rgb(255, 0, 255)][SIZE=5]Закрыто[/SIZE][/COLOR][SIZE=5].[/SIZE][/FONT][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
},
 
];

$(document).ready(() => { 
 // Загрузка скрипта для обработки шаблонов 
 $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`); 
 
 // Добавление кнопок при загрузке страницы 
 addButton(`Выбор автоматических ответов`, `selectAnswer`); 
 // Поиск информации о теме 
 const threadData = getThreadData(); 
 
 $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true)); 
 $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false)); 
 $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true)); 
 $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false)); 
 $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false)); 
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false)); 
 $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true)); 
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true)); 
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true)); 
 
 
 $(`button#selectAnswer`).click(() => { 
 XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`); 
 buttons.forEach((btn, id) => { 
 if (id > 0) { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true)); 
 } else { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false)); 
 } 
 }); 
 }); 
 }); 
 
 function addButton(name, id) { 
 $(`.button--icon--reply`).before( 
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
 .join(``)}</div>`; 
 } 
 
 function pasteContent(id, data = {}, send = false) { 
 const template = Handlebars.compile(buttons[id].content); 
 if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty(); 
 
 $(`span.fr-placeholder`).empty(); 
 $(`div.fr-element.fr-view p`).append(template(data)); 
 $(`a.overlay-titleCloser`).trigger(`click`); 
 
 if (send == true) { 
 editThreadData(buttons[id].prefix, buttons[id].status); 
 $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`); 
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
 const threadTitle = $(`.p-title-value`)[0].lastChild.textContent; 
 
 if (pin == false) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
 }), 
 }).then(() => location.reload()); 
 } 
 if (pin == true) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 sticky: 1, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
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