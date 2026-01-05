// ==UserScript==
// @name        no vostfr cpas bien
// @namespace   no vost fr
// @description zz
// @include     http://www.cpasbien.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8734/no%20vostfr%20cpas%20bien.user.js
// @updateURL https://update.greasyfork.org/scripts/8734/no%20vostfr%20cpas%20bien.meta.js
// ==/UserScript==

$(function() { 
   $('.ligne0 , .ligne1').each(function() {
	      if ($(this).html().match(/vostfr/) ) {
         $(this).remove();
		 }
   }); 
});
