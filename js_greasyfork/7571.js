// ==UserScript==
// @name        	DC - Chat
// @namespace   	DreadCast
// @include     	http://www.dreadcast.net/Main
// @grant       	none
// @author 		Ianouf
// @date 		07/01/2013
// @version 		1.0
// @description 	Personalisation du Chat. Adaptation du script de Gideon, ou d'Odul, je sais plus!
// @compat 		Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/7571/DC%20-%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/7571/DC%20-%20Chat.meta.js
// ==/UserScript==


$(document).ready(function() {

	//Couleurs dans le chat:
	var chatBox = $('#chatForm .text_chat').eq(0);
	chatBox.keypress(function(event) {
		 if ( event.which == 13 ) {
			var text = chatBox.val();
			text = text.replace(/\*R([^\*]+)\*R/gi, "[couleur=DF0101]$1[/couleur]");
			text = text.replace(/\*V([^\*]+)\*V/gi, "[couleur=298A08]$1[/couleur]");
			text = text.replace(/\*B([^\*]+)\*B/gi, "[couleur=0404B4]$1[/couleur]");
			text = text.replace(/\*J([^\*]+)\*J/gi, "[couleur=FFFF00]$1[/couleur]");
			if(text.substr(0,3) == '/me'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=FFFFFF]$1[/couleur]");
			}else{
				text = text.replace(/\*I([^\*]+)\*I/gi, "[i]$1[/i]");
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=7BEEFF][i]$1[/i][/couleur]");
			}
			chatBox.val(text);
		}
	});
});
