// ==UserScript==
// @name			WWW.PENNERGAME-HIGHSCORE.DE
// @namespace		http://javan.de
// @description		Erzeugt eine neue Spalte auf der Angriffsseite, um sich Spieler im eigenen Punktebereich auf der aktuelleren Highscore anzeigen zu lassen
// @author			Javan_xD
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @include     	*.pennergame.de/fight*
// @exclude     	http://*pennergame.de/fight/viewfight/*
// @icon			http://javan.de/tools/live/favicon.png
// @version			1.1
// @downloadURL https://update.greasyfork.org/scripts/9824/WWWPENNERGAME-HIGHSCOREDE.user.js
// @updateURL https://update.greasyfork.org/scripts/9824/WWWPENNERGAME-HIGHSCOREDE.meta.js
// ==/UserScript==
/* START POINTWATCHER AD */
            function GetAttackDiv() {
                var forms = document.getElementsByTagName("form");
                for (var i = 0; i < forms.length; i++) {
                    if (!forms[i].outerHTML)
                        continue;
                    if (forms[i].outerHTML.indexOf("/fight/attack") != -1) {
                        var divs = forms[i].getElementsByTagName("div");
                        return divs[0];
                    }
                    else if (forms[i].outerHTML.indexOf("/fight/cancel") != -1)
                        return forms[i].parentNode;
                    }
            }

            var attacktable = document.getElementById("content").getElementsByTagName("table")[0];
            var attackdiv = GetAttackDiv();
            if (attackdiv) {
                var attacklink = attackdiv.getElementsByTagName("a")[0];
                var attackspan = attackdiv.getElementsByTagName("span")[0];
            }
			
	var language = document.getElementsByName("language")[0].content;
    var metas = document.getElementsByTagName("meta");
    for (i = 0; i< metas.length; i++)
        if (metas[i].getAttribute('property') == "og:url") {
            var TOWNBASE_URL = metas[i].content + "/";
            break;
    }
	
var ownpoints = Number(document.getElementsByClassName("icon award")[0].getElementsByTagName("a")[0].innerHTML);
if(attackspan)
	attackspan.innerHTML = '<a href="//pennergame-highscore.de/index.php?stadt=' + language + '&points_own=' + ownpoints + '#highscore" title="Gegner suchen"><img alt="Highscore Top 100" src="//pennergame-highscore.de/img/banner.png" /><br /> ' + attackspan.innerHTML; 

/* END POINTWATCHER AD */

	
	

// Copyright (c) by Javan_xD
// Dieses Werk ist durch eine Creative Commons by-nc-sa Lizenz geschuetzt.
// Bearbeiten oder Vervielfaeltigen ist nur nach Absrache mit dem Autor gestattet.
// Bei Nichtbeachtung werden rechtliche Schritte eingeleitet.