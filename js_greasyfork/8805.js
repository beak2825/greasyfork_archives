// ==UserScript==
// @name           Virtonomica:Управление, персонал
// @namespace      virtonomica
// @version        1.0
// @include        http://*virtonomic*.*/*/main/company/view/*/unit_list/employee
// @description    Выделяет квалификацию предприятия не равную по требуемой
// @downloadURL https://update.greasyfork.org/scripts/8805/Virtonomica%3A%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/8805/Virtonomica%3A%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB.meta.js
// ==/UserScript==

var run = function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window); 
	$ = win.$;
	$(".list tr").each( function() {
		var cels = $('td.nowrap', this);
		var c1 = $(cels[5]).text().replace(/[^\d\.]/g, '');
		var c2 = $(cels[6]).text().replace(/[^\d\.]/g, '');
		if(c1 == c2)
			$(cels[7]).css({'background':'rgb(220, 255, 216)'});
		if(c1 < c2)
			$(cels[7]).css({'background':'rgb(255, 215, 215)'});
	})
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
