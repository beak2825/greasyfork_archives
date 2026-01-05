// ==UserScript==
// @name        	DC - FullWall TESTER
// @namespace   	DreadCast
// @include     	http://www.dreadcast.net/Main
// @grant       	none
// @author 			Ianouf
// @date 			14/03/2015
// @version 		1.1
// @description 	Full Wall Tester. Idée et code de base d'Odul, voir ici: https://greasyfork.org/en/scripts/1555-fullwall/code
// @compat 			Firefox, Chrome
// @require      	http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/8538/DC%20-%20FullWall%20TESTER.user.js
// @updateURL https://update.greasyfork.org/scripts/8538/DC%20-%20FullWall%20TESTER.meta.js
// ==/UserScript==

jQuery.noConflict();

FullWalTab = new Array;
// Exemple théorique: FullWalTab['IDBAT'] = 'http://lienversmonimage';
// Exemple concret: (complétement inutile, certes, mais bon, osef.)
FullWalTab['5988'] = 'http://www.dreadcast.net/images/batiments/batiment_5988.png';

function getIdFromUrl(urlBat){
	id = urlBat.split('_');
	id = id[id.length-1].split('.');
	id = id[0];
	return id;
}
function getBackground(urlBat){
	id = getIdFromUrl(urlBat);
	if(FullWalTab[id]){
		return FullWalTab[id];
	}
	return null;
}

function changeBackground(newBackground){
	jQuery('#carte_fond').css('background-image', 'url('+newBackground+')');
}

function changeBackgroundForBat(){
	carte = jQuery('#carte_fond');
	if(carte){
		background = getBackground(jQuery('#carte_fond').css("background-image"));
		if(background){
			changeBackground(background);
		}
	}
}

jQuery(document).ready(function() {
	changeBackgroundForBat();
});

Engine.prototype.displayMapInfoSave  = Engine.prototype.displayMapInfo;
Engine.prototype.displayMapInfo = function (html,is_default,force_show,custom_type,callback) {
	this.displayMapInfoSave(html,is_default,force_show,custom_type,callback);
	changeBackgroundForBat();
}