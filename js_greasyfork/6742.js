// ==UserScript==
// @name         Chrome msg-time-date viwer
// @version      0.2
// @description  to viwe time and date in chrome browser  
// @author       IaM GenIuS
// @include      http://ae*.tribalwars.ae/game.php?screen=mail*
// @include      http://ae*.tribalwars.ae/game.php?*screen=mail*
// @namespace https://greasyfork.org/users/7290
// @downloadURL https://update.greasyfork.org/scripts/6742/Chrome%20msg-time-date%20viwer.user.js
// @updateURL https://update.greasyfork.org/scripts/6742/Chrome%20msg-time-date%20viwer.meta.js
// ==/UserScript==
$(".date").each(function(){
		if($(this).text().match("اليوم")){
			$(this).width(($(this).width()+1));
		}
		else if ($(this).text().match("امس")){
			$(this).width(($(this).width()+2));
		}else{
			$(this).width(($(this).width()+4));
		}
});