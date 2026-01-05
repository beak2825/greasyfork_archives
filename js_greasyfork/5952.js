// ==UserScript==
// @name        zive.cz - odstraneni spamu kristalova lupa na konci clanku
// @namespace   monnef.tk
// @include     http://www.zive.cz/*
// @version     3
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author      moen
// @description:cs odstraneni spamu kristalova lupa na konci clanku
// @description odstraneni spamu kristalova lupa na konci clanku
// @downloadURL https://update.greasyfork.org/scripts/5952/zivecz%20-%20odstraneni%20spamu%20kristalova%20lupa%20na%20konci%20clanku.user.js
// @updateURL https://update.greasyfork.org/scripts/5952/zivecz%20-%20odstraneni%20spamu%20kristalova%20lupa%20na%20konci%20clanku.meta.js
// ==/UserScript==

var lupaSpamDebug = false;
var lupaBeingRemoved = false;

function removeLupaSpam(){
	if(!lupaBeingRemoved){
		lupaBeingRemoved = true;
		if(lupaSpamDebug) console.log("[LupaSpamRemover] Purging.");
		$("p i a").filter(function(){ return $(this).attr("href") == "http://prejdi.cz/hlasprozive" }).each(function(){ $(this).parent().hide(); });
		lupaBeingRemoved = false;
	}
}

// DOMSubtreeModified DOMNodeInserted
$("#main-article").bind("DOMSubtreeModified", function(){
	removeLupaSpam();
});

$(document).ready(function() {
	removeLupaSpam();
});
