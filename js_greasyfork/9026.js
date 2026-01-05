// ==UserScript==
// @name        WoS screenshots fix
// @description WoS screens fix
// @license     Apache-2.0
// @author      Rudokhvist
// @include     http://www.worldofspectrum.org/*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/2205
// @downloadURL https://update.greasyfork.org/scripts/9026/WoS%20screenshots%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/9026/WoS%20screenshots%20fix.meta.js
// ==/UserScript==
+function(){
var xywka = document.getElementsByTagName('img');
for (var i=xywka.length-1; i>=0; i--) {
    if (xywka[i].src.indexOf('showscreen.cgi') + 1) {
	    xywka[i].src="http://www.worldofspectrum.org/pub/sinclair/"+xywka[i].src.substring(53);
	}
  }
}();