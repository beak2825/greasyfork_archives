// ==UserScript==
// @name           Virtonomica: Продажа технологий
// @namespace      virtonomica
// @description    Продажа технологий
// @include        http://virtonomic*.*/*/window/management_action/*/investigations/technology_offer_create/*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/9564/Virtonomica%3A%20%D0%9F%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/9564/Virtonomica%3A%20%D0%9F%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.meta.js
// ==/UserScript==

var run = function() {
	var cn = 0;
	$('table.list tr').each(function(){
		var cels = $('td', this),
			ct = parseFloat($(cels[12]).text().replace('$', '').replace(/ /g, ''));
		if(!isNaN(ct)){
			cn = ct;
			console.log(cn)
			var c = parseFloat($(cels[6]).text().replace('$', '').replace(/ /g, '')),
				prc = c * 100 / cn;
			$(cels[6]).append(' ('+prc.toFixed(2)+'%)');
		}
	})
	var tr = $('<tr></tr>'),
		td = $('<td colspan="3"></td>').prependTo(tr),
		strinp = $('<input type="text" size="3" value="80">').prependTo(td).keyup(function(){
			var cen = strinp.val() * cn / 100;
			$('input[name=price]').val(cen.toFixed(2));
			console.log(cn);
		});
	var cen = strinp.val() * cn / 100;
	$('input[name=price]').val(cen.toFixed(2)).closest('tr').before(tr);
}
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);   