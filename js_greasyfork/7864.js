// ==UserScript==
// @name        KickUseless
// @namespace   InGame
// @include     http://www.dreadcast.net/Forum/2-691-ami-du-flood-*
// @version     2.1
// @grant       none
// @author	Ladoria
// @description Kick Useless
// @downloadURL https://update.greasyfork.org/scripts/7864/KickUseless.user.js
// @updateURL https://update.greasyfork.org/scripts/7864/KickUseless.meta.js
// ==/UserScript==

var toKick = new Array();
var shown = new Array();
var binded = new Array();


$(document).ready( function() {
	toKick.push(/(.*)<br>/.exec($("#zone_personnage").find('td').first().html())[1].trim());

	function KickThoseThings() {
		$('.bandeau .nom').each( function() {
			if(-1 == $.inArray($(this).html(),toKick)) {
				var bandeau = $(this).parent();
				
				if(-1 == $.inArray(bandeau.next().attr('id'),shown))
					bandeau.next().hide();
				
				if(-1 != $.inArray($(this).attr('id'), binded))
					return;
				
				binded.push($(this).attr('id'));
				
				bandeau.on('click', function() {
					var id = $(this).next().toggle().attr('id');
					
					if(-1 == $.inArray(id, shown))
						shown.push(id);
					else {
						shown = jQuery.grep(shown, function(value) {
							return value != id;
						});
					}
				});
			}
		});
	}

	KickThoseThings();
	
	$(document).ajaxComplete( function(a,b,c) {
		if(false == /Check/.test(c.url)) {
			binded = new Array();
		}
		
		KickThoseThings();
	});
});