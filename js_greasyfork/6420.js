// ==UserScript==
// @name         EXHentai random gallery selector
// @namespace    http://exhentai.org/
// @version      1.1
// @description  adds links to random page and gallery on search pages
// @author       DikUln
// @include        http://exhentai.org/*
// @include        http://g.e-hentai.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6420/EXHentai%20random%20gallery%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/6420/EXHentai%20random%20gallery%20selector.meta.js
// ==/UserScript==

function randGal() {
    if (document.getElementById("dmi").children[0].innerHTML == "List") {
        window.location.href = document.getElementsByClassName("itg")[0].tBodies[0].getElementsByTagName("tr")[Math.floor(Math.random() * document.getElementsByClassName("itg")[0].tBodies[0].getElementsByTagName("tr").length - 1) + 1].getElementsByClassName("it5")[0].children[0].href;
    } else {
        window.location.href = document.getElementsByClassName("itg")[0].children[Math.floor(Math.random() * (document.getElementsByClassName("itg")[0].children.length - 1))].children[0].children[0].href;
    }
}

function randPage() {
    sp(Math.floor(document.getElementsByClassName("ptt")[0].tBodies[0].getElementsByTagName("td")[(document.getElementsByClassName("ptt")[0].tBodies[0].getElementsByTagName("td").length - 2)].children[0].innerHTML * Math.random()));
}

(function(){
       
    document.getElementById("dmo").innerHTML = '<div>Select random: <a id="randLink" href="#">gallery</a> <a id="randPageLink" href="#">page</a></div>' + document.getElementById("dmo").innerHTML;
    
    var myLink = document.getElementById("randLink");
    myLink.addEventListener("click", randGal, true);
    
    var myPageLink = document.getElementById("randPageLink");
    myPageLink.addEventListener("click", randPage, true);
    
})();