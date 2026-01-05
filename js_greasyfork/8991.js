// ==UserScript==
// @name           Virtonomica: Подсветка в отчете по производству
// @namespace      virtonomica
// @include        http://virtonomic*.*/*/main/company/view/*/sales_report/by_produce
// @description    Подсветка по качу производства относительно среднереалмового в отчете по производству
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/8991/Virtonomica%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/8991/Virtonomica%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D1%83.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;



//$('div#mainContent span.c_qty:gt(1)').each(function(){
$('a.c_row span.c_qty').each(function(){
var b=parseFloat($(this).next().prop('textContent'));
var a=parseFloat($(this).next().next().prop('textContent'));
$(this).next().css('color','green');
if(a>b) $(this).next().css('color','red'); 
})
 