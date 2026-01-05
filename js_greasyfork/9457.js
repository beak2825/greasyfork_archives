// ==UserScript==
// @name        Reload on error message
// @namespace   http://userscripts.org/users/23652
// @description Reload the page on an error message you set yourself
// @version     0.5
// @copyright   JoeSimmons, Nickel
// @grant       none
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/9457/Reload%20on%20error%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/9457/Reload%20on%20error%20message.meta.js
// ==/UserScript==

// Add your errors here to the pattern ///////////////
var errors = [];
errors[0] = /Too many connections. Please try again later./i;
errors[1] = /Mysql error, could not connectToo many connections/i;
errors[2] = /max_user_connections/i;
errors[3] = /502 Bad Gateway/i;
errors[4] = /504 Gateway Time-out/i;
errors[5] = /Something broke/i;
errors[6] = /Imgur is over capacity!/i;
errors[7] = /The database timed out running your query./i;
errors[8] = /we took too long to make this page for you/i;
//////////////////////////////////////////////////////

function check() {
	for(var i=0; i<errors.length; i++) {
		if( errors[i].test(document.body.textContent) ){
			window.location.reload();
		}
	}

}

setTimeout(check, 250);