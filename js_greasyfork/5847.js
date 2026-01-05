// ==UserScript==

// @name          Songs.Nghmat Download Links Extractor

// @namespace     DevelopmentSimplyPut(developmentsimplyput.blogspot.com)

// @description   Extracts Download Links From Songs.Nghmat

// @include       *songs.nghmat.com*

// @require        http://code.jquery.com/jquery-latest.min.js

// @version 0.0.1.20141023133834
// @downloadURL https://update.greasyfork.org/scripts/5847/SongsNghmat%20Download%20Links%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/5847/SongsNghmat%20Download%20Links%20Extractor.meta.js
// ==/UserScript==


setTimeout(function(){ Run(); }, 0);

function Run() {
	var urls = new Array();
	
	$("div[class=song_div] table tbody tr").find("td:eq(2) a").each(function(index, value) {
		urls.push(('http://songs.nghmat.com/' + $(value).attr("href")).replace('com//', '.com/'));
	});
	
	$('body').prepend("<span style='direction:ltr;display:block;width:100%;height:60px;color:blue;background:red;'><textarea cols='100'>" + urls.join('&#13;&#10;') + "</textarea></span><br />");
}