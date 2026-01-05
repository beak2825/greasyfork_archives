// ==UserScript==
// @name        Wykop Tool
// @version     BETA 5
// @description UÅ‚atwia Å¼ycie
// @author	Helio3
// @include     http://www.wykop.pl/*
// @namespace	http://www.wykop.pl/ludzie/helio3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
// @run-at document-end
// @icon        http://i.imgur.com/LGpKjdC.png
// @copyright	Helio3
// @downloadURL https://update.greasyfork.org/scripts/6937/Wykop%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/6937/Wykop%20Tool.meta.js
// ==/UserScript==
// tool
//
//
//
$('div#nav ul.clearfix:last > li.notification.m-user').before($('<li/>', {
    html: '<a class="tool" title="Wykop Tool"><img class="tool2"  src="http://1.bp.blogspot.com/-foAejtKnyzM/VBPZMVmHsVI/AAAAAAAABh4/N0Mn0gKsPEE/s1600/hammer%2Band%2Bspanners.png"width="30" height="30"></i></a>',
    class: "tool",
    title: "Wykop Tool",
}));
//
//
// GUZIKI
    $('div#nav ul.clearfix:last > li.m-hide').after($('<li/>', {
    html: '<a href="http://www.wykop.pl/ustawienia/czarne-listy/" title="Czarnolisto"><i class="fa fa-lock"></i></a>',
    class: "czarno",
}));
	$('div#nav ul.clearfix:last > li.czarno').before($('<li/>', {
    html: '<a href="http://www.wykop.pl/moj/notatki-o-uzytkownikach/wszystkie/" title="Notatki o uÅ¼ytkownikach"><i class="fa fa-list-ul"></i></a>',
    class: "notatki",
}));
	$('div#nav ul.clearfix:last > li.notatki').before($('<li/>', {
    html: '<a href="http://www.wykop.pl/naruszenia/moje/" title="ZgÅ‚oszenia"><i class="fa fa-flag-o"></i></a>',
    class: "zgloszenia",
}));        
	$('div#nav ul.clearfix:last > li.zgloszenia').before($('<li/>', {
    html: '<a href="http://www.wykop.pl/osiagniecia/" title="OsiÄ…gniÄ™cia"><img src="http://i.imgur.com/V3uDUz4.png" width="23" height="23""></i></a>',
    class: "arv",
}));
	$('div#nav ul.clearfix:last > li.arv').after($('<li/>', {
    html: '<a href="http://www.wykop.pl/wiadomosc-prywatna/" title="WiadomoÅ›ci prywatne"><i class="fa fa-inbox"></i></a>',
    class: "pw",
}));   
    $("li.czarno").hide();
    $("li.notatki").hide();
    $("li.zgloszenia").hide();
    $("li.arv").hide();
    $("li.pw").hide();
//
$('li.tool').on ( "click", function() {
    $("li.tool").hide ("slow");
    $("li.m-hide").hide ();
    $("li.czarno").show("slow");
    $("li.notatki").show("slow");
    $("li.zgloszenia").show("slow");;
    $("li.arv").show("slow");
    $("li.pw").show("slow");
    $('div.nav.bspace.rbl-block > ul > li:last').after($('<li/>', {
    html: '<a href="http://www.wykop.pl/dodaj/"><span>Dodaj</span></a>',
}));     
});
