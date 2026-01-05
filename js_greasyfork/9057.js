// ==UserScript==
// @name           Virtonomica: Делаем видимым поле ввода процента в Управление-Персонал
// @version        1.4
// @include        http*://*virtonomic*.*/*/main/company/view/*/unit_list/employee
// @description Делаем видимым поле ввода процента в компания-Управление-Персонал
// @grant       none
// @namespace virtonomica
// @downloadURL https://update.greasyfork.org/scripts/9057/Virtonomica%3A%20%D0%94%D0%B5%D0%BB%D0%B0%D0%B5%D0%BC%20%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D1%8B%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%B0%20%D0%B2%20%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%9F%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/9057/Virtonomica%3A%20%D0%94%D0%B5%D0%BB%D0%B0%D0%B5%D0%BC%20%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D1%8B%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%B0%20%D0%B2%20%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%9F%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	//alert("begin");
	var input = document.getElementById("selectedPercent_input");
 	input.setAttribute('type','text');
 	input.setAttribute('size',3);
	input.oninput = function() {
  		document.getElementById('selectedPercent').innerHTML = input.value;
  		document.getElementById('selectedPercent').value = input.value;
	}
	//alert("end");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}