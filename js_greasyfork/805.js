// ==UserScript==
// @name        KG - Link to letterboxd.com film page
// @namespace   http://userscripts.org/users/luckyluciano
// @description Adds a link to the letterboxd.com film page, using the IMDb code
// @include     *://karagarga.in/*
// @include     *://www.karagarga.in/*
// @version     2.2
// @grant       none
// Based on KG perm links by helmut
// @downloadURL https://update.greasyfork.org/scripts/805/KG%20-%20Link%20to%20letterboxdcom%20film%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/805/KG%20-%20Link%20to%20letterboxdcom%20film%20page.meta.js
// ==/UserScript==

var LBlogo = "http://i.imgur.com/csnMCi8.png"
var dereferer = "https://href.li/?"

function addLink() {
    var st = xpath("//td[@class='heading']");
    var i = 0;
    while(i < st.snapshotLength && st.snapshotItem(i).innerHTML != "Internet Link") i++;
    if(i < st.snapshotLength) {
        var node = st.snapshotItem(i).nextSibling;
        var imdb = getImdb(node.firstChild.href);
        if(imdb != null) {
          
            
           
            var link = document.createElement("a");
            link.href = dereferer+makeLink(imdb).value;
            link.alt = "Film page on letterboxd.com";
            var img = document.createElement("img");
            img.style.marginLeft="5px";
            img.src= LBlogo;
            link.appendChild(img);
            node.appendChild(link)
            
         
            
     
    }
}
}

function getImdb(href) {
    var from = href.indexOf("imdb.com/title/tt") + 17;
    if(from < 17)
        return null;
    var to = href.indexOf("/", from);
    if(to < 0)
        to = href.length;
    return href.substring(from, to);
}

function makeLink(imdb) {
    var link = document.createElement("input");
    link.type = "text";
    link.id = "permlink";
    link.readOnly = "readonly";
    link.size = "100";
    link.value = "http://letterboxd.com/imdb/" + imdb;
    link.addEventListener('click', SelectPerm, true);
    return link;
}

function SelectPerm()
{
    document.getElementById("permlink").focus();
    document.getElementById("permlink").select();
}

String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
}

function xpath(query) {
    return document.evaluate(query, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

(function () {
    var href = window.location.href;
    if(href.contains("karagarga.in/details.php"))
        addLink();
})();