// ==UserScript==
// @name         DPStream.net Débrideur
// @namespace    DPStream.net Débrideur
// @version      0.5.5
// @description  Ce script permet le débridage facile des séries/mangas/films à partir de l'ancien site DPStream.net
// @author       Kursion (Modifié par Seb02859)
// @grant        none
// @match 		 http://www.dpstream.net/serie-*
// @match 		 http://www.dpstream.net/manga-*
// @match 		 http://www.dpstream.net/film-*
// @match 		 http://mondebrideur.com/pureapi.php?id=*
// @require		 http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/9864/DPStreamnet%20D%C3%A9brideur.user.js
// @updateURL https://update.greasyfork.org/scripts/9864/DPStreamnet%20D%C3%A9brideur.meta.js
// ==/UserScript==

$(document).ready(function() {
    console.log("DPStream.net Débrideur démarré");
    var interval = undefined;
    var getLinks = function(){
        console.log("Execution getLinks()");
        // The div containing links
        var container = $("<div/>");
        
        //Ancien lien href: "http://enstreaming.com/purevidsansjavahd.php?id="+link,
        var countLinks = 0;
        $("a").each(function(i){
            var link = $(this).attr("href");
            if(link.indexOf("www.purevid.com/v/") > 0){
                link = link.replace("http://www.purevid.com/v/", "").slice(0,-1);
                var ahref3 = $("<a/>", {
                    href: "http://www.enstreaming.com/pages/debrideur/chargement.php?id="+link+"&debrideur=purevid",
                    text: "Charger le débrideur Purvid 1 : " + link,
                    target: "_blank",
                });
                var ahref = $("<a/>", {
                    href: "http://www.enstreaming.com/telecharger.php?id="+link+"&debrideur=purevid",
                    text: "Purevid débrideur 1 : " + link,
                    target: "_blank",
                });
                var div3 = $("<div/>").html(ahref3);
                container.append(div3);
                var div = $("<div/>").html(ahref);
                container.append(div);
                countLinks++;
                var ahref2 = $("<a/>", {
                    href: "http://mondebrideur.com/pureapi2.php?id="+link,
                    text: "Purevid débrideur 2 : " + link,
                    target: "_blank",
                });
                var div = $("<div/>").html(ahref2);
                container.append(div);
                countLinks++;
            }
        });
        if(countLinks > 0){
            container.css({
                position: "absolute",
                width: "350px",
                backgroundColor: "#333333",
                color: "#efefef",
                margin: "auto",
                left: 0,
                right: 0,
                top: "10px",
                padding: "10px",
                borderRadius: "10px"
            });
            $("body").append(container);
            $("body").scrollTop(0);
            clearInterval(interval);
        }
    };

    interval = setInterval(getLinks, 2000);

});