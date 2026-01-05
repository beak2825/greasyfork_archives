// ==UserScript==
// @name           Virtonomica: Кнопка "вверх" для форума
// @version        1.3
// @include        http*://*virtonomic*.*/*/forum/*
// @description Добавляет кнопку "вверх" внизу страниц форума
// @grant       none
// @namespace virtonomica
// @downloadURL https://update.greasyfork.org/scripts/9056/Virtonomica%3A%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%B2%D0%B2%D0%B5%D1%80%D1%85%22%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/9056/Virtonomica%3A%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%B2%D0%B2%D0%B5%D1%80%D1%85%22%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	//alert("begin");
	var head = $("body");
	head.append("<div style=\"cursor: pointer; font-size: 50pt; position: fixed; bottom: 10px; right: 10px;\" onclick=\"$('html, body').animate({ scrollTop: 0 }, 'fast');\">&#8657;</div>");
	//alert("end");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}