// ==UserScript==
// @name         Скрипт для КФ/ЗГСФ/ГСФ || Blue
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Скрипт для КФ/ЗГСФ/ГСФ
// @author       David Rabadanov
// @match https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/551054/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/551054/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.meta.js
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
title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для ЗГСФ и ГСФ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{    
 
title: '| Одобрено |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=rgb(50, 205, 50)][B]Одобрена.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Обмен bc на ив и наоборот|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#СССССС][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#32CD32][B]Одобрена.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Вы и нарушитель будете заблокированы.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Не можем выдать наказание |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] На данный момент мы не можем выдать наказание по жалобе оставленной на форуме.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
                 	  title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача на рассмотрение╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба находится[/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#FFD700][B] на рассмотрении.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Ожидайте ответа и не создавайте дубликаты тем.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба находится на рассмотрении у[/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#0000FF][B] Технического специалиста.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Ожидайте ответа и не создавайте дубликаты тем.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
},
{
 
title: '| Нарушений не найдено |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Нарушений не было обнаружено.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B] Возврат средств возможен только при инициативе самого обманщика, если у него будет желание получить разблокировку аккаунта, он свяжется с Вами и в конечном итоге вы должны будете сойтись в компенсации, потом составляется обжалование от лица обманщика, предварительно Вы пишите ему на ФА условия компенсации.[/B][/SIZE][/COLOR][/CENTER][/HEADING]",
                  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательств на нарушение недостаточно.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва не работают |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства не работают.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства отсутствуют.[/B][/SIZE][/COLOR][/I][/SIZE][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства отредактированы.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва в вертикальном формате |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства в вертикальном формате не подлежат рассмотрению.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва плохого качества |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Предоставленные доказательства имеют плохое качество.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства не открываются.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц. сеть |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Доказательства загруженные в соц. сетях, не подлежат рассмотрению. Для загрузки фото можно воспользоваться: Imgur, Япикс, Postimages. Для видео: YouTube, RuTube, ВК Видео.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Ник нарушаемого не совпадает с док-вами |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Ник нарушаемого не совпадает с доказательствами.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лица (Никнейм подавшего не совпадает)|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Ваш никнейм не совпадает с доказательствами.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Не относится к Жалобам на игроков (Добавить в какой раздел игроку обратиться) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Жалоба не относится к нашему разделу.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Вы ошиблись сервером.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Дублирование темы |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Тема продублирована, если Вы продолжите ее дублировать, то вам может быть выдана блокировка ФА.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
 
title: '| Данный вид сделки, не является нонрп обманом |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Данный вид сделки не является NRP Обманом.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки отсутствуют |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Условия сделки отсутствуют.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг (нет срока займа) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В условиях долга отсутствует срок займа.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| 10 дней после срока долга|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Прошло более 10-ти дней с момента окончания срока возврата долга.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Слив склада семьи (Что требуется показать игроку) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Создайте новое обращение учтя следующие критерии:[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]"+
                  "[HEADING=2][LIST]"+
                  "[*][B][SIZE=4][CENTER]На фрапсе должен быть прописан /time.[/CENTER][/SIZE][/B]"+
                  "[*][B][SIZE=4][CENTER]Должны быть показаны семейные логи где четко видно нарушение (Выделить строки с нарушением(-и) игрока(-ов).[/CENTER][/SIZE][/B]"+
                  "[*][B][SIZE=4][CENTER]В сути жалобы уточнить являетесь ли Вы лидером семьи.[/CENTER][/SIZE][/B]"+
                  "[*][B][SIZE=4][CENTER]Показать описание семьи.[/CENTER][/SIZE][/B]"+
                  "[/LIST][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи (Заместителем) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Администрация не несет ответственности за действия заместителя семьи.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Заголовок жалобы составлен не по форме.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба не по форме |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Жалоба составлена не по форме.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Отсутствует /time.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет Time-кодов|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] На видео-доказательства более 3-ёх минут нужны тайм-коды.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '|Time коды не по форме|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Тайм-коды составлены не по форме, они должны иметь следующий вид:[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]"+
                  "[CENTER][URL=https://yapx.ru/image/cqUPj][img]https://i.yapx.ru/cqUPjs.png[/img][/url][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Прошло более 72-ух часов с момента нарушения игрока.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Для фиксации данного нарушения необходим фрапс(видеодоказательство).[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Фрапс обрывается.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оскорбление в IC |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Оскорбление в IC чат - ненаказуемо.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Неадекватное поведение в жалобе |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В жалобе присутствует неадекватное поведение, обращение не подлежит рассмотрению.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оск в названии док-в |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша жалоба - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В названии доказательств присутсвуют оскорбления.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=rgb(50, 205, 50)][B]Одобрена.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Составлено не по форме.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Недостаточно информации в пунктах Жизнь в детстве и юности, Взрослая жизнь.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Биография скопирована.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Заголовок не по форме,пример: Биография | Nick_Name[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (отсутствие фото) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (существующие никнеймы) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Запрещено составлять биографию существующих людей.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (противоречит логике) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В биографии не должно быть логических противоречий.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Ошибки) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Биография должна быть читабельна и не содержать грамматических или орфографических ошибок.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(инфо о прошлом в настоящем времени) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В пункте Настоящее время вы рассказываете про свое прошлое, что противоречит его назначению. Составьте новую биографию учтя это.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(инфо о взрослой жизни в детстве) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] В пункте Детство вы рассказываете о своём будущем, что противоречит его назначению. Составьте новую биографию учтя это.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ(никнейм не совпадает) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография[/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Никнейм в заголовке отличается от указанного в биографии.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Нонрп ник) |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Ваш никнейм не соответствует критериям RP никнейма.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био на дополнение |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша биография находится [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#FFD700][B]на дополнении.[/B][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=5][B] Вам дается 24 часа на дополнение информации.[/B][/SIZE][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| РП ситуация одобрено |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша РП ситуация - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=rgb(50, 205, 50)][B]Одобрена.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
 title: '| РП ситуация отказ. |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша РП ситуация - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| Неофициальная Орг. Одобрено|',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша Неофициальная РП организация - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=rgb(50, 205, 50)][B]Одобрена.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '| Неофициальная Орг. Отказ |',
	  content:
                  "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Ваша Неофициальная РП организация - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Отказана.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
  title: '| Неофициальная Орг. Отказ (Ошибка раздела) |',
	  content:
       "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Вы ошиблись разделом - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Закрыто.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
    title: '| Неофициальная Орг. Отказ (Не по теме) |',
	  content:
       "[CENTER][URL='https://vk.com/away.php?to=https%3A%2F%2Fpostimg.cc%2FBjXrkC1t%5D%5Bimg%5Dhttps%3A%2F%2Fi.postimg.cc%2FqvLptbJc%2F1751738511210.jpg%5B%2Fimg%5D%5B%2Furl%5D%5Burl%3Dhttps%3A%2F%2Fpostimages.org%2Fru%2F%5D%D1%84%D0%BE%D1%82%D0%BE%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3&utf=1'][IMG]https://i.postimg.cc/qvLptbJc/1751738511210.jpg[/IMG][/URL][/CENTER]"+
                  "[HEADING=3][CENTER][COLOR=#cccccc][SIZE=5][B]Здравствуйте, {{ user.name }} [/B][/SIZE][/COLOR][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(204, 204, 204)][SIZE=5][B]Не по теме - [/B][/SIZE][/COLOR][SIZE=5][I][COLOR=#8B0000][B]Закрыто.[/B][/COLOR][/I][/SIZE][/CENTER][/HEADING]",
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