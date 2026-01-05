// ==UserScript==
// @name        kapida.ALMA
// @namespace   al.kapida.engelleyici
// @description Kapıda AL sitesinin ARTIK YETEĞRR dedirtecek reklamlarını engelleme scriptçiği
// @include     http://forum.minecraftturk.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9872/kapidaALMA.user.js
// @updateURL https://update.greasyfork.org/scripts/9872/kapidaALMA.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;


$('a[href="http://kapida.al/"]').hide(); //Kapıda.al reklamı engelleme
$('a>div.likesSummary.secondaryContent').hide(); //Kapıda.al beğeni reklamı engelleme
$('a.kapida').hide(); //Kapıda.al zaman yanındaki reklamı engelleme