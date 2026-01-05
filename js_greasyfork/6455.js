// ==UserScript==
// @name AmeliorationTchatOdul2.1
// @namespace InGame
// @author Odul
// @date 05/12/2013
// @version 1.01
// @description Ameliore l'utilisation des balises /me combinée aux couleurs. Adaptation du script de Gideon pour la version de l'interface précédente.
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include http://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/6455/AmeliorationTchatOdul21.user.js
// @updateURL https://update.greasyfork.org/scripts/6455/AmeliorationTchatOdul21.meta.js
// ==/UserScript==

	var ameliorInput = function(e) { 
		if (e.keyCode==13) {
		     value = $("#chatForm .text_chat").val();
		     value = value.replace(/\*([^\*]+)\*/gi, "[couleur=7BEEFF][i]$1[/i][/couleur]");
		
             value = value.replace(/\*([^\*]+)\*/gi, "[couleur=7BEEFF][i]$1[/i][/couleur]");

             value = value.replace(/(^\/mep1.+?)([^\"]+)/gi, "/me [couleur=C03000] - Le rouge gorge mécanique $2[/couleur]");

	         value = value.replace(/(^\/mep2.+?)([^\"]+)/gi, "/me [couleur=C03000] - Le piaf mécanique $2[/couleur]");
	         value = value.replace(/(^\/mep3.+?)([^\"]+)/gi, "/me [couleur=C03000] - Pioga $2[/couleur]");

	         value = value.replace(/(^\/mep4.+?)([^\"]+)/gi, "/me [couleur=C03000] - Il $2[/couleur]");
	      
		    $("#chatForm .text_chat").val(value);

		do {
			$("#chatForm .text_chat").val($("#chatForm .text_chat").val().replace(/(^\/me.+?)"([^\"]+)"/gi, "$1[couleur=FFFFFF]$2[/couleur]"));
		}while (/(^\/me.+?)"([^\"]+)"/i.test($("#chatForm .text_chat").val()));

		}
	}

	document.addEventListener('keypress', ameliorInput, false);
	
	
	

    