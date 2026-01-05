// ==UserScript==
// @name       Wish show seller
// @namespace  http://r4v.pl/
// @version    0.3
// @description  enter something useful
// @match      http://www.wish.com/*
// @match      https://www.wish.com/*
// @copyright  2014 R4v
// @downloadURL https://update.greasyfork.org/scripts/5644/Wish%20show%20seller.user.js
// @updateURL https://update.greasyfork.org/scripts/5644/Wish%20show%20seller.meta.js
// ==/UserScript==
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
function redirectToMerchant(){
bsid = getCookie("bsid");
cid = window.location.href.match("(?:cid=|c\/)([a-z0-9]{24})")[1];

window.location = "http://r4v.pl/wish.php?bsid=" + bsid + "&cid= " + cid;
}
var main = function(){
$(".display-pic").click(function(){
window.open($(this).attr("href"));


})
 $(".shipping-details").after('<div class="title seller-details details-section" id="seller"><b>Pokaż sprzedawcę</b></div>');
 $("#seller").click(function(){
 redirectToMerchant();
 
 })}

if (addEventListener in document) { // use W3C standard method
    document.addEventListener('load', main(), false);
} else { // fall back to traditional method
    document.onload = main();
}
