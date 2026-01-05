// ==UserScript==
// @name        Nextdoc Doppelte Fragen Entfernen
// @namespace   fragensammlung@nextdoc
// @include     http://www.nextdoc.at/fragensammlung?*
// @version     1
// @require	    http://code.jquery.com/jquery-1.9.1.min.js
// @grant       none
// @description Entfernt doppele Fragen in Nextdoc
// @downloadURL https://update.greasyfork.org/scripts/9435/Nextdoc%20Doppelte%20Fragen%20Entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/9435/Nextdoc%20Doppelte%20Fragen%20Entfernen.meta.js
// ==/UserScript==

$(document).ready(main);

function main() {
	counter = 0;
	$('.view-quizes .views-row').each(function(){
		if(	$(this).find('div.comment-wrapper div.content').filter(function(){
				return $(this).text().trim().toLowerCase()=="doppelt";
			}).length
			> 0
		){
			$(this).remove();
			counter++;
		}
	});
	$('.view-header div:last').append('; '+ counter+ ' als "doppelt" markierte Fragen entfernt.');
}