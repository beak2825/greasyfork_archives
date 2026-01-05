// Solve Your Problems
//
// ==UserScript==
// @name          Solve Your Problems
// @description   You know what I mean.
// @include       http://forums.kingdomofloathing.com/vb/show*
// @version 	  0.1
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/7069/Solve%20Your%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/7069/Solve%20Your%20Problems.meta.js
// ==/UserScript==

$(document).ready(function() {
	$('div[id^="post_message_"]').each( function(){
		if($(this).text().indexOf("Do what thou wilt shall be the whole of the Law.") > -1) {
			var text = $(this).html();
			text = text.replace("Do what thou wilt shall be the whole of the Law.", "");
			text = text.replace("Love is the law, love under will.", "" );	
			$(this).html(text);
			$(this).children("br:nth-last-child(1)").remove();
			$(this).children("br:nth-child(1)").remove();
			$(this).children("br:nth-child(1)").remove();
		}
	});
});