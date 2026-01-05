// ==UserScript==
// @name        Virtonomica:window2main
// @namespace   virtonomica
// @description Заменяем на странице снабжения ссылки с window на main
// @include     http://virtonomic*.*/*/*/unit/supply/create/*/step2
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6935/Virtonomica%3Awindow2main.user.js
// @updateURL https://update.greasyfork.org/scripts/6935/Virtonomica%3Awindow2main.meta.js
// ==/UserScript==
var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

var table = $("table.unit-list-2014");
var link = $("a[href*='window/unit/']");

link.each(function() {
	var a_link = $(this).attr('href').replace("window", "main");
	$(this).attr('href', a_link);
});

}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
