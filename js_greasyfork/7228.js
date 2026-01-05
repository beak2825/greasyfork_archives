// ==UserScript==
// @name         Tylkonocny na niezalogowanym
// @namespace    http://www.wykop.pl/
// @version      1.5
// @description  tryb nocny na niezalogowanym/dziennym
// @author       pozdrodlaniekumatych
// @include      http://www.wykop.pl*
// @match        http://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7228/Tylkonocny%20na%20niezalogowanym.user.js
// @updateURL https://update.greasyfork.org/scripts/7228/Tylkonocny%20na%20niezalogowanym.meta.js
// ==/UserScript==

(function() {
	var styl = $('body').attr('class') || "dzienny";

	if (styl == "dzienny") {
		$('head > link[rel="stylesheet"]').attr('href','http://s3.cdn03.imgwykop.pl/static/wykoppl/s/36a27c94ed5e3d2a3116f88b5e487109.css');
		$('body').attr("class", " night");
	}
})();