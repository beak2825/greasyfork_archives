// ==UserScript==
// @name           twitter toLocaltime for new UI
// @version        2.9b
// @namespace      http://twitter.com/inmoutan
// @auther         inmoutan
// @description    Rewrite twitter timestamp to localtime for new UI.
// @include        https://twitter.com/*
// @include        http://twitter.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5841/twitter%20toLocaltime%20for%20new%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/5841/twitter%20toLocaltime%20for%20new%20UI.meta.js
// ==/UserScript==


(function() {
	var filter = function(elem){
		$(elem).find('[class*=timestamp]').each(function(){
			if(!$(this).find('span.localtime').length){
				var data = $(this).attr('title');
				if(data!=null){
				$(this).append('<span class="localtime"> - '+data+'</span>');
				}
			}
		});
	}
	
	$.event.add(window, "load", function(){
		filter('.js-stream-tweet');
	});
	
	$(document).on("DOMNodeInserted", '.js-stream-tweet', function() {
		filter($(this));
	});

})();
