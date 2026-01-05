// ==UserScript==
// @name        DP_Cleaner
// @namespace   http://forum.downparadise.ws
// @description Aide pour cleaners Downparadise: Liens des Cash Hosters, Dernière édition par wobette le Jeu 20 Nov 2014 23:16
// @include     http://forum.downparadise.ws/*
// @exclude   	
// @grant       none  
// @version		2.1
// @downloadURL https://update.greasyfork.org/scripts/6635/DP_Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/6635/DP_Cleaner.meta.js
// ==/UserScript==



// repérages des numéros de lignes de code
// zone des NCH  		de +/- 150  à 723
// zone des Exceptions  de +/- 750  à 784
// zone des CH			de +/- 800  à 2562
// zone des bannis		de +/- 2570 à 2660
// zone des txt non url de +/- 2670 à la fin 

// pour activer la fonction d'affichage des dates de creation des sujets du forum, il faut effacer la ligne 21 et la ligne 73
/*
///////////////////////////////////////////////////////////////////////////////////////////
// start: code lines from : name        downparadise.ws
// namespace   http://www.132.org
// description downparadise.ws
// v     1.03

var node = document.evaluate("//*", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var elem = node.snapshotItem(0);
var cpt = 0;
for (var i = 0; i < node.snapshotLength; i++) {
    elem = node.snapshotItem(i);
    if (elem.className == 'row3')
        cpt = 0;
    if (elem.className == 'topictitle') {
        cpt++;
        var text = document.createTextNode(cpt + ' . ' + elem.title);
        if (elem.parentNode.parentNode.innerHTML.search(/sticky/gi) >= 0) text.data = 'X ' + text.data;
        var target = document.createElement('div');
        target.appendChild(text);
        elem.parentNode.insertBefore(target, elem);
    }
}
// remplace le réglement de la corbeille par le journal du sujet
if (window.location.href.match(/viewtopic.php/gi)!=null && window.location.href.match(/f=164/gi)!=null) {
    var node = document.evaluate("//*[@class='forumrules']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (node) {
        if (location.href.search("t=") != -1) {
            var ifr = document.createElement('iframe');
            ifr.height="190";
            ifr.width="950";
            ifr.setAttribute("src", window.location.href.split('/viewtopic')[0] + "/mcp.php?i=logs&mode=topic_logs&t="
                + location.href.substring(location.href.search("t=") + 2, location.href.length));
            node.snapshotItem(0).parentNode.insertBefore(ifr, node.snapshotItem(0));
            node.snapshotItem(0).parentNode.removeChild(node.snapshotItem(0));
        };
    };
};
// et nettoie la page
if (window.location.href.match(/mcp.php/gi)!=null) {
    if (top.location.href.match(/viewtopic.php/gi)!=null && top.location.href.match(/f=164/gi)!=null) {
        var node1 = document.evaluate("//*[@class='ltr']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var elem1 = node1.snapshotItem(0);
        var node2 = document.evaluate("//*[@class='tablebg']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var elem2 = node2.snapshotItem(3);
        elem1.parentNode.insertBefore(elem2, elem1);
        elem1.parentNode.removeChild(elem1);
    };
};

// end of : code lines from : name        downparadise.ws
/////////////////////////////////////////////////////////////////////////////////
*/


	var newElement = document.createElement("div" );
	newElement.innerHTML = '<div class="quotetitle"><div class="quotecontent"><center><span style="color: #8900c3"> - - - - -</span> <span style="color: #8900c3;font-size: 150%; line-height: normal"> DP_Cleaner </span><span style="color: #8900c3"> - - - - - - - - > </span><span style="color: #8900c3;font-size: 100%; line-height: normal">Légende du surlignage des liens </span><span style="color: #8900c3">- - - - - - - - - - - - - - - - - - - - </span></center><br>Liens OK de site NON Cash Hoster  <span style="color: #8900c3">-----></span>   http://exemple-non-ch.com<br>Liens de site avec EXCEPTION ? <span style="color: #8900c3">-------></span>   http://exemple-exception.com<br>Liens de site CASH HOSTER ! <span style="color: #8900c3">-----------></span>   http://exemple-cash-hoster.com<br>Liens de site ! BANNIS ! <span style="color: #8900c3">----------------></span>   http://exemple-banni.com<br><span style="color: #650084">-----------------------------------------------------------------------------------------------------------------</span><br><center><span style="color: #8900c3">Liens vers les SIGNALEMENTS de la zone cleaners</span></center><center><a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1242899" target="_blank class="postlink-local">Infractions</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1132418" target="_blank class="postlink-local">Divers & Général</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1132417" target="_blank class="postlink-local">Jeux</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1132416" target="_blank class="postlink-local">Vidéo & Streaming</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1132415" target="_blank class="postlink-local">Audio</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1254566" target="_blank class="postlink-local">eBibliothèque</a>|<a href="http://forum.downparadise.ws/viewtopic.php?f=180&t=1132419" target="_blank class="postlink-local">Requêtes & Propositions</a></center><span style="color: #8900c3">-----------------------------------------------------------------------------------------------------------------</span><br><center><span style="color: #8900c3;font-size: 150%; line-height: normal">Version 2.1 </span>=	Dernière édition wobette 20/11/14 23:16 --> <a href="http://forum.downparadise.ws/viewtopic.php?f=168&amp;t=1033143" target="_blank class="postlink-local">Voir modification liste CH </a> </center><span style="color: #8900c3">-----------------------------------------------------------------------------------------------------------------</span></div></div>';
	document.getElementById("p0").insertBefore(newElement, document.getElementById('inhalt'));


///////////////////////////////////////////////////////////////////////////////////////////
// start: code lines from linkify http://youngpup.net/userscripts
(function () {
    const urlRegex = /\b(https?:\/\/[^\s+\"\<\>]+)/ig;

    // tags we will scan looking for un-hyperlinked urls
    var allowedParents = [
        "abbr", "acronym", "address", "applet", "b", "bdo", "big", "blockquote", "body", 
        "caption", "center", "cite", "code", "dd", "del", "div", "dfn", "dt", "em", 
        "fieldset", "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "iframe",
        "ins", "kdb", "li", "object", "pre", "p", "q", "samp", "small", "span", "strike", 
        "s", "strong", "sub", "sup", "td", "th", "tt", "u", "var"
        ];
    
    var xpath = "//text()[(parent::" + allowedParents.join(" or parent::") + ") and " +
                "contains(translate(., 'HTTP', 'http'), 'http')]";

    var candidates = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    var t0 = new Date().getTime();
    for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
        if (urlRegex.test(cand.nodeValue)) {
            var span = document.createElement("span");
            var source = cand.nodeValue;
            
            cand.parentNode.replaceChild(span, cand);

            urlRegex.lastIndex = 0;
            for (var match = null, lastLastIndex = 0; (match = urlRegex.exec(source)); ) {
                span.appendChild(document.createTextNode(source.substring(lastLastIndex, match.index)));
                
                var a = document.createElement("a");
                a.setAttribute("href", match[0]);
                a.appendChild(document.createTextNode(match[0]));
                span.appendChild(a);

                lastLastIndex = urlRegex.lastIndex;
            }

            span.appendChild(document.createTextNode(source.substring(lastLastIndex)));
            span.normalize();
        }
    }
    var t1 = new Date().getTime();
    //alert((t1 - t0) / 1000);

})();
// end of : code lines from linkify http://youngpup.net/userscripts












///////////////////////////////////////////////////////////////////////////////////////////
var links = document.getElementsByTagName( 'a' );
var element;


// NCH
/////////////////////////////////////////////////////////////////////////////////////////////////////
  
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://exemple-non-ch.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://1fichier.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://1fichier.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://alterupload.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://desfichiers.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://cjoint.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dfichiers.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://megadl.fr" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://mesfichiers.org" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://piecejointe.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://pjointe.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://tenvoi.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dl4free.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://2shared.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.2shared.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://4shared.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.4shared.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://adrive.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://anonfiles.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://bayfiles.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://bigdownloader.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.bigdownloader.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://box.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://divshare.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dropbox.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filedropper.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filehosting.org" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filepost.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filerio.in" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filesave.me" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://putlocker.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.firedrive.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://furk.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://gigasize.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.gigasize.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://gigaup.fr" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://jumbofiles.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://load.to" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://mediafire.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.mediafire.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://mega.co.nz" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.myvdrive.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://myfreefilehosting.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://partage-facile.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://przeklej.org" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.redbunker.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rusfolder.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.sendmyway.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sendspace.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.sharebeast.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sharesend.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.solidfiles.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ultimate-cloud.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uplea.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploading.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uptobox.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.uptobox.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
} 
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.wetransfer.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
} 
 
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://wikiupload.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
   
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://xdisk.cz" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
  
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://zippyshare.com" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}
  
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://zshares.net" ) == 0 ) {

        element.style.color = "#e1ff9a";
        element.style.backgroundColor = "#0e7800";
    }
}

























//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exceptions
//////////////////////////////////////////////////////////////////////////////////////////////////////////

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://exemple-exception.com" ) == 0 ) {

        element.style.color = "#a6ff2f";
        element.style.backgroundColor = "#d08700";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filecloud.io" ) == 0 ) {

        element.style.color = "#a6ff2f";
        element.style.backgroundColor = "#d08700";
    }
}
  
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dl.free.fr" ) == 0 ) {

        element.style.color = "#a6ff2f";
        element.style.backgroundColor = "#d08700";
    }
}














//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cash Hosters !
//////////////////////////////////////////////////////////////////////////////////////////////////////////


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://exemple-cash-hoster.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filecore.co.nz" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.themediastorage.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://2drive.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadrocket.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rainupload.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.chayfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.exashare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://gocpalinks.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://24uploading.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://city-upload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.cloudzilla.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filedust.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filehost.pw" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://files2share.ch" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filetut.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://foldder.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://rockfile.eu" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://roottail.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.ultrafile.me" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://up07.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://yonzy.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://easybytez.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileinz.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileshd.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.gboxes.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.inclouddrive.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.nitroflare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://180upload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://1st-files.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.2downloadz.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.2downloadz.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://4downfiles.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://4upfiles.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.anafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.anafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://anysend.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://asfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://backin.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://billionuploads.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://bitshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.bl.st" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://cloudyvideos.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://crocko.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://crocko.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.datafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.datafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://datei.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://datei.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ddlstorage.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://depositfiles.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dfiles.eu" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://dfiles.ru" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://divxpress.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.dizzcloud.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://extabit.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fastupload.org" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileband.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filedais.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filedwon.info" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filefactory.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filefactory.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileflyer.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filehoot.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filemoney.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileneo.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileover.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileparadox.in" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filer.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filesbomb.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://fileserving.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filesflash.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filesfrog.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filespace.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.fileswap.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filevice.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://filewe.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}
for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://folder.la" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://freakshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://gigapeta.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://grifthost.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://hellshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.hellupload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://hipfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://hitfile.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://hugefiles.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://hulkload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.isafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://jumbofiles.org" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://junocloud.me/ppd.html" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://keep2share.cc" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.kingfiles.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://letitbit.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://lumfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://up.media1fire.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://megashares.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.mightyupload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://mixturecloud.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.multiupfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://mydisc.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://netload.in" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://nodaup.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://nosupload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://novafile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.nowdownload.ch" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.oboom.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.oboom.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.privatefiles.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://qkup.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://queenshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rapidgator.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rg.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://rapidshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rapidshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://www.rapidshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://redload.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://rockdizfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ryushare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://salefiles.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sanshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://secureupload.eu" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://share-online.biz" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://shared.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://shareflare.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sharesix.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sharingmaster.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://slingfile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://takebin.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://terafile.co" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://thefile.me" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://thefilebay.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.thefileupload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.toofile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.speedyshare.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://turbobit.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://tusfiles.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uloz.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ulozto.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ultramegabit.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://unlimitzone.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "https://updown.bz" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.uploadable.ch" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadables.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadboy.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploaded.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.uploaded.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.uploaded.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploaded.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ul.to" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadlux.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploads.ws" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadsat.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://upstore.net" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://usefile.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://vip-file.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://vozupload.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://xerver.co" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://youwatch.org" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://ziddu.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.ziddu.com" ) == 0 ) {

        element.style.color = "#bdfce9";
        element.style.backgroundColor = "#71040b";
    }
}





///////////////////////////////////////////////////////////////////////////////////////////
// sites bannis !
///////////////////////////////////////////////////////////////////////////////////////////

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://exemple-banni.com" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://uploadhero.com" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}


for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.fileserve.com" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.filesonic.fr" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://muchshare.net" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://toutbox.fr" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://sharpfile.com" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

for ( var i = 0; i < links.length; i++ ) {

    element = links[ i ];

    if ( element.href.indexOf( "http://www.uploadjet.net" ) == 0 ) {

        element.style.color = "#ffffff";
        element.style.backgroundColor = "#d60000";
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////







// surlignage des Mots non URL
var AD=new Array();var MA=new Array();var ST=new Array();

// NCH

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(.1fichier.com)/i);
ST.push('color: #000000;background: #55ff66;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(1fichier)/i);
ST.push('color: #000000;background: #55ff66;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(1F)/i);
ST.push('color: #000000;background: #55ff66;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(zippyshare.com)/i);
ST.push('color: #000000;background: #55ff66;');

// CH

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(letitbit)/i);
ST.push('color: #ff0000;background: #ffffcc;');

// bannis

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Abafile)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(File serve)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(File sonic)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Filesonic)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Google Drive)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Much share)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Pack Uploaded)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(purebox .co)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Sharp file)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Sky Drive)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Toutbox)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Upload Hero)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(Upload Jet)/i);
ST.push('color: #ffffff;background: #d60000;');

AD.push(/^https?:\/\/forum\.downparadise\.ws.*$/i);
MA.push(/(UploadJet)/i);
ST.push('color: #ffffff;background: #d60000;');


for(ind in AD){
	if(AD[ind].test(window.location.href)==true){
		for(var tx=document.evaluate('//text()[normalize-space(.)!=""]',document,null,6,null),t,i=0;t=tx.snapshotItem(i);i++){
			var before=t.textContent,st,matched=false;
			if(t.parentNode.tagName=='STYLE'||t.parentNode.tagName=='SCRIPT') continue;
			while((st=before.search(MA[ind]))!=-1){
				t.parentNode.insertBefore(document.createTextNode(before.substr(0,st)),t);
				with(t.parentNode.insertBefore(document.createElement('span'),t))
					textContent=RegExp.$1,
					style.cssText=ST[ind];
				matched=true;
				before=before.substr(st+RegExp.$1.length);
				}
			if(matched) t.textContent=before;
			}
		}
	}
	

