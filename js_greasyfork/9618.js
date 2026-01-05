// bear joke ever
//
// ==UserScript==
// @name          bear joke ever chat effect
// @description   sometimes adds the word bear to your bear chat
// @include       *127.0.0.1:*mchat.php*
// @include       *kingdomofloathing.com*mchat.php*
// @version 	  1.0
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/9618/bear%20joke%20ever%20chat%20effect.user.js
// @updateURL https://update.greasyfork.org/scripts/9618/bear%20joke%20ever%20chat%20effect.meta.js
// ==/UserScript==
function bearStr(str) {
	var splitStr = str.split(' ');
	var bearStr = '';
	var bearLimit;
	var randNum = Math.floor(Math.random() * 8);
	var bearRand = Math.floor(Math.random() * parseInt(splitStr.length));
	if(randNum==1) {
		for (i = 0; i < splitStr.length; i++) {
			if(splitStr[i].indexOf('http://') == -1 && bearLimit != 1 && bearRand == i) {
				bearStr += " bear " + splitStr[i];
				beari = i;
				bearLimit = 1;
			} else {
				bearStr += " " + splitStr[i];
			}
		}
	} else {
		bearStr = str;
	}
	return bearStr
}

$(document).ready(function() {
	$('#graf').keypress(function(e) {
		if(e.which == 13 && $(this).val().charAt(0)!='/') {
			$(this).val( bearStr($(this).val()) );
			//alert( bearStr( $(this).val() ) );
		}
	});
});