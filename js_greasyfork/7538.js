// ==UserScript==
// @name            zive.cz - link u videi na YouTube
// @namespace       monnef.tk
// @include         http://www.zive.cz/*
// @version         1
// @grant           none
// @require         https://code.jquery.com/jquery-2.1.3.min.js
// @description:cs  Přidává odkaz na YouTube zdroj ke každé instanci přehrávače Flowplayer.
// @description Přidává odkaz na YouTube zdroj ke každé instanci přehrávače Flowplayer.
// @downloadURL https://update.greasyfork.org/scripts/7538/zivecz%20-%20link%20u%20videi%20na%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/7538/zivecz%20-%20link%20u%20videi%20na%20YouTube.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(".flowplayer").each(function() {
	var e = $(this);
	var videoId = e.attr("data-yt");
	if(videoId) {
		var url = "http://www.youtube.com/watch?v=" + videoId;
		e.parent().after("<a href='" + url + "'>YouTube</a> <span style='opacity:0.2; margin-left: 10px;'>skript vám napsal <a href='http://monnef.tk'>moen</a></span>");
	}
});
