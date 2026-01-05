// ==UserScript==
// @name           Stavki_ENVD
// @namespace      http://virtonomic*.*/*/main/geo/regionENVD/*
// @description    Создаёт список ставок ЕНВД
// @include        http://virtonomic*.*/*/main/geo/regionENVD/*
// @version 0.0.1.20150306114002
// @downloadURL https://update.greasyfork.org/scripts/8429/Stavki_ENVD.user.js
// @updateURL https://update.greasyfork.org/scripts/8429/Stavki_ENVD.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$=win.$;
var texxt='';
$('table.list>tbody>tr[class]').each(function(){
$('td:contains("%")',this).each(function(){
aaa=$(this).prev();
texxt+='"'+aaa.prop('textContent')+'":'+$(this).prop('textContent').slice(0,-2)+',';})})
alert(texxt.slice(0,-1));

