// ==UserScript==

// @name          Farfesh.Com Download Links Extractor

// @namespace     DevelopmentSimplyPut(developmentsimplyput.blogspot.com)

// @description   Extracts Download Links From Farfesh.Com

// @include       *farfesh.com/ViewSongs.asp*

// @require        http://code.jquery.com/jquery-latest.min.js

// @version 0.0.1.20141023133757
// @downloadURL https://update.greasyfork.org/scripts/5746/FarfeshCom%20Download%20Links%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/5746/FarfeshCom%20Download%20Links%20Extractor.meta.js
// ==/UserScript==


jQuery.noConflict();
(function($) {
	setTimeout(function(){ Run(); }, 0);
	
	function Run() {
		var urls = new Array();
		
		$("a[href*='http://www.farfesh.com/MusicPlayer.asp'][href*='SingerID'][href*='albumID'][href*='songID'][href*='MP3File']").each(function(index, value) {
			var oldHref = $(value).attr("href");
			var parts = oldHref.split("MP3File=");
			
			if(typeof(parts) != 'undefined' && null != parts && parts.length > 1) {
				var newHref = ("http://entertainment.farfesh.com/music/arabic/" + parts[1]).replace('/arabic/arabic/', '/arabic/');
				$(value).attr("href", newHref);
				
				urls.push(newHref);
			}
		});
		
		$("<span style='direction:ltr;display:block;width:100%;height:60px;color:blue;background:red;'><textarea cols='100'>" + urls.join('&#13;&#10;') + "</textarea></span><br />").insertBefore("table#main_table");
	}
})(jQuery);