// ==UserScript==
// @name         Hamburgeryapan!
// @description  Kalbi hamburgere dönüştürür...
// @version      1.2.1
// @author       Anthony McDonald
// @include      htt*://*.popmundo.com/*/Popmundo.aspx
// @include      htt*://*.popmundo.com/*/Popmundo.aspx/*
// @include      htt*://*.popmundo.com/World/Popmundo.aspx/Character/AddShortcut
// @include      htt*://*.popmundo.com/World/Popmundo.aspx/Character/EditShortcuts
// @grant        none
// @namespace    https://greasyfork.org/users/6949
// @downloadURL https://update.greasyfork.org/scripts/6802/Hamburgeryapan%21.user.js
// @updateURL https://update.greasyfork.org/scripts/6802/Hamburgeryapan%21.meta.js
// ==/UserScript==

var current_page=window.location.href;

var searchHeader=document.getElementById("character-tools-shortcuts").innerHTML;
var changeHeader=searchHeader.replace("/Static/Icons/heart.png", "https://i.hizliresim.com/ZZ0zPz.png");
document.getElementById("character-tools-shortcuts").innerHTML=changeHeader;

if (current_page.indexOf("AddShortcut") > 1) {
    var search=document.getElementsByClassName("iconbox")[0].innerHTML;
    var change=search.replace("/Static/Icons/heart.png", "https://i.hizliresim.com/ZZ0zPz.png");
    document.getElementsByClassName("iconbox")[0].innerHTML=change;
}
if (current_page.indexOf("EditShortcuts") > 1) {
    var search=document.getElementById("shortcuts").innerHTML;
    var change=search.replace("/Static/Icons/heart.png", "https://i.hizliresim.com/ZZ0zPz.png");
    document.getElementById("shortcuts").innerHTML=change;
}