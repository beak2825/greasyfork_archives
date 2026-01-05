// ==UserScript==
// @name           UbiCollections
// @namespace      ubiCollections
// @description    Highlight collections on the map
// @author         Sin aka SirriS
// @grant          none
// @version        1.7
// @homepageURL    https://greasyfork.org/ru/scripts/6607-ubicollections/code
// @include        http://www.tsotesting.com/en/play
// @include        http://www.thesettlersonline.com.br/pt/jogar
// @include        http://www.thesettlersonline.com/en/play
// @include        http://www.thesettlersonline.net/en/play
// @include        http://www.thesettlersonline.fr/fr/jouer
// @include        http://thesettlersonline.cz/cs/play
// @include        http://www.diesiedleronline.de/de/spielen
// @include        http://www.thesettlersonline.gr/el/play
// @include        http://www.thesettlersonline.it/it/gioca
// @include        http://www.juego-thesettlersonline.com/es/jugar
// @include        http://www.thesettlersonline.nl/nl/play
// @include        http://www.thesettlersonline.pl/pl/graj
// @include        http://www.thesettlersonline.ro/ro/play
// @include        http://www.thesettlersonline.ru/ru/play
// @include        http://www.thesettlersonline.es/es/jugar
// @include        http://ru.anno-online.com/ru/play
// @downloadURL https://update.greasyfork.org/scripts/6607/UbiCollections.user.js
// @updateURL https://update.greasyfork.org/scripts/6607/UbiCollections.meta.js
// ==/UserScript==



(function(){

    var unsafeWindow= this.unsafeWindow;
    (function(){
        var test_scr= document.createElement("script");
        var tid= ("t" + Math.random() + +(new Date())).replace(/\./g, "");
        test_scr.text= "window."+tid+"=true";
        document.querySelector("body").appendChild(test_scr);
        if (typeof(unsafeWindow) == "undefined" || !unsafeWindow[tid]) {
            if (window[tid]) {
                loader();
            } else {
                loader();
            };
        } else loader();
    })();
    
    function loader()
    {
        if (confirm("\t\t\t\t\tВнимание!\t\n\r\n\rЭтот скрипт создан для работы через локальный веб сервер.\n\rСогласие на загрузку без активного сервера приведет к\n\rневозможности загрузки клиента игры\n\r\n\r\t\t\tВключить подсветку коллекций?")) {
			var game = (window.location.href.indexOf('anno-online') != -1) ? "AO1404" : "SWMMO";
			var o=document.getElementsByName(game)[0];
			var vars=o.getAttribute("flashVars");
			if (window.location.href.indexOf('tsotesting') != -1)
			{
				vars=vars.replace("&s=","&s=http://127.0.0.1:9000/prestaging|http://127.0.0.1:9000/prestaging|");
			} 
			else if (window.location.href.indexOf('anno-online') != -1)
			{
				vars=vars.replace("&s=","&s=http://127.0.0.1:9001/live|http://127.0.0.1:9001/live|");
			} 
			else 
			{
				vars=vars.replace("&s=","&s=http://127.0.0.1:9000/live|http://127.0.0.1:9000/live|");
			}			
			o.setAttribute("flashVars",vars);
			o.outerHTML=o.outerHTML;
		}
	}
})();
