// ==UserScript==
// @name        Search
// @namespace   http://*/*
// @include     https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.01
// @grant       none
// @description 'deneme'
// @downloadURL https://update.greasyfork.org/scripts/8435/Search.user.js
// @updateURL https://update.greasyfork.org/scripts/8435/Search.meta.js
// ==/UserScript==


$(function(){

function yaziyial() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

		$(document).keydown(function (e){
			var secilimetin= yaziyial();

                if(e.shiftKey  && e.which==71){    
					window.open("https://www.google.com.tr/search?q="+secilimetin, '_blank');
                            }else if(e.shiftKey  && e.which==87){
					window.open("http://en.wikipedia.org/w/index.php?title="+secilimetin, '_blank');
			    }else if(e.shiftKey  && e.which==89){
					window.open("https://www.youtube.com/results?search_query="+secilimetin, '_blank');
			    }else if(e.shiftKey  && e.which==69){
					window.open("https://eksisozluk.com/"+secilimetin,'_blank');
			    }else if(e.shiftKey  && e.which==70){
					window.open("https://www.facebook.com/search/more/?q="+secilimetin,'_blank');
			    }else if(e.shiftKey  && e.which==84){
					window.open("https://twitter.com/search?q="+secilimetin,'_blank');
			    }
            });

});


