// ==UserScript==
// @name			Bash Navigator
// @version			2019.08.23
// @description		Стрелки вперёд-назад у номера цитаты
// @include			http*://bash.im/quote/*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=bash.im
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/8677/Bash%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/8677/Bash%20Navigator.meta.js
// ==/UserScript==

var parent = document.querySelector ( '.quote__header' ),
	link = parent.querySelector ( '.quote__header_permalink' ), // ссылка на текущий номер
    num = link.href.match ( /[^\/]+$/ ), // выдрать из неё номер
    num_back = parseInt ( num ) - 1, // предыдущий
    num_next = num_back + 2, // следующий
    back = document.createElement ( 'a' ), // заготовка новых ссылок
    next = document.createElement ( 'a' ),
    t_back = document.createTextNode ( '[<<]' ), // и текстов
    t_next = document.createTextNode ( '[>>]' );

back.href = '/quote/' + num_back; // одевание на новые ссылки путей с номерами
back.appendChild ( t_back ); // вставка текстов
back.accessKey = 'p';
parent.insertBefore ( back, link ); // вставка новых ссылок

next.href = '/quote/' + num_next;
next.appendChild ( t_next );
next.accessKey = 'n';
parent.appendChild ( next );

back.className = next.className = 'quote__header_permalink'; // общий стиль
parent.style = 'font-size: 20px; position: relative; bottom: 7px;';