// ==UserScript==
// @name           Virtonomica: hide_assets
// @namespace      virtonomica
// @description    Прячет бонусные комплекты
// @include        http://virtonomic*.*/*/main/company/view/*/unit_list
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/8683/Virtonomica%3A%20hide_assets.user.js
// @updateURL https://update.greasyfork.org/scripts/8683/Virtonomica%3A%20hide_assets.meta.js
// ==/UserScript==

var run = function() {
	$('div.assetbox').hide();
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);