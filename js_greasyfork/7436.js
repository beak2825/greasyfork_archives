// ==UserScript==
// @name         zlavadna/slavadne/boomer tweak 
// @namespace    http://sturcel.sk/martin/
// @version      0.32
// @description  zlavadna/slavadne/boomer oprava čiarového kódu, odstránenie zbytočných častí stránky, po loadovaní FOCUS na číslo kupónu.. 
// @author       Martin Sturcel
// @match 		*://www.zlavadna.sk/*
// @match 		*://www.slevadne.cz/*
// @match 		*://www.boomer.sk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7436/zlavadnaslavadneboomer%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/7436/zlavadnaslavadneboomer%20tweak.meta.js
// ==/UserScript==

window.onload = function() {
  document.getElementById("coupon-dialog-input-code").focus();
return (true);
};

var elmLink = document.getElementById('coupon-dialog-input-code');
elmLink.maxLength = '12';

var elmLink2 = document.getElementById('coupon-dialog-input-secret');
elmLink2.value = '';
elmLink2.onfocus = 'this.value=\'\'';

var elmDeleted = document.getElementById("menu-outside");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("partners");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("footer");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("menu-toggle");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("search-toggle");
	elmDeleted.parentNode.removeChild(elmDeleted);
	
var elmDeleted = document.getElementById("head-search");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("head-list");
	elmDeleted.parentNode.removeChild(elmDeleted);

if(document.URL.indexOf("zlavadna") != -1) {

    var elmDeleted = document.getElementById("mbl");
	elmDeleted.parentNode.removeChild(elmDeleted);
} 

if (document.getElementById("coupon-dialog-input-secret").value.length == 8) {
        document.getElementById("coupon-dialog-consume").focus();
}