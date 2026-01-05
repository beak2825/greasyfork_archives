// ==UserScript==
// @name		Evernote Web in-app note link
// @namespace	http://andrealazzarotto.com/
// @version		1.2.1
// @description	This scripts shows the internal "evernote:///" URI of a note
// @match		http://www.evernote.com/Home.action*
// @match		https://www.evernote.com/Home.action*
// @match		http://www.evernote.com/view/notebook/*
// @match		https://www.evernote.com/view/notebook/*
// @copyright	2015, Andrea Lazzarotto
// @license		GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9517/Evernote%20Web%20in-app%20note%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/9517/Evernote%20Web%20in-app%20note%20link.meta.js
// ==/UserScript==

var placeURI = function(url) {
	$("#noteURI").remove();
	
	var selector = $("div[style*='top'] > div[style*='relative'] > div[tabindex]").first();
	if(!selector.length)
		return false;
	
	selector.before("<p id='noteURI'><span>Note link:</span> <a href='" + url + "'>" + url + "</a></p>");
	$("#noteURI").css({
		'font-size': '1.25em',
		'margin-bottom': '.8em'
	});
	$("#noteURI a").css({
		'font-family': 'monospace'
	});
	$("#noteURI span").css({
		'font-weight': 'bold',
		'font-variant': 'small-caps'
	});
	return true;
}

var bootstrap = function() {
	// See: https://dev.evernote.com/doc/articles/note_links.php
	var userId = ENConfig.userId;
	var shardId = $("script:contains('userStoreUrl')").text().replace(/.*shard\/(s[0-9]+).*/, "$1");
	var noteGuid = (location.href+"&n=").split('n=')[1].split('&')[0];
	if (noteGuid.length == 0)
		return;
	
	var url = "evernote:///view/" + userId + "/" +shardId + "/" + noteGuid + "/" + noteGuid;

	// insert at the beginning of the note
	setTimeout(function() {
		if(!placeURI(url))
			setTimeout(arguments.callee, 200);
	}, 0);
}

$(document).ready(function() {
	bootstrap();
	
	$(window).bind('hashchange', bootstrap);
});