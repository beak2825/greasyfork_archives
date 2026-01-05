// ==UserScript==
// @name        	DC - FullWall By Ianouf
// @namespace   	DreadCast
// @include     	http://www.dreadcast.net/Main
// @grant       	none
// @author 		Ianouf
// @date 		14/01/2015
// @version 		1.5
// @description 	Full Wall a ma sauce. Idée et code de base d'Odul, voir ici: https://greasyfork.org/en/scripts/1555-fullwall/code
// @compat 		Firefox, Chrome
// @require      	http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/6982/DC%20-%20FullWall%20By%20Ianouf.user.js
// @updateURL https://update.greasyfork.org/scripts/6982/DC%20-%20FullWall%20By%20Ianouf.meta.js
// ==/UserScript==

jQuery.noConflict();

docBaseUrl = 'http://docs.google.com/uc?export=download&id=';
docStart = '0B4Igp0h82K3yY19GeUszUGwwZjg';
backgroundBaseUrl = 'http://bit.ly/';
FullWalTab = new Array;

function loadBackgroundArray(){
	urlBat = jQuery('#carte_fond').css("background-image");
	id = getIdFromUrl(urlBat);
	loadBackgroundAjax(docStart, id, 0);
}

function loadBackgroundAjax(idDoc, idBat, idCallBack){
	jQuery.ajax({
		type: 'GET',
		url: docBaseUrl+idDoc,
		async: false,
		jsonpCallback: 'jsonCallback'+idCallBack,
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json){
			jQuery.each(json.batiment, function(key, val){
				if(val[0] && val[1]){
					id = val[0];
					url = val[1];
					FullWalTab[id] = url;
					if(id == idBat){
						changeBackground(backgroundBaseUrl+url);
					}
				}
			});
			var i = 1;
			jQuery.each(json.liens, function(key, val){
				loadBackgroundAjax(val, idBat, idCallBack+'_'+i);
				i++;
			});
		}
	});
}

function getIdFromUrl(urlBat){
	id = urlBat.split('_');
	id = id[id.length-1].split('.');
	id = id[0];
	return id;
}
function getBackground(urlBat){
	id = getIdFromUrl(urlBat);
	if(FullWalTab[id]){
		return backgroundBaseUrl+FullWalTab[id];
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
	loadBackgroundArray();
});

Engine.prototype.displayMapInfoSave  = Engine.prototype.displayMapInfo;
Engine.prototype.displayMapInfo = function (html,is_default,force_show,custom_type,callback) {
	this.displayMapInfoSave(html,is_default,force_show,custom_type,callback);
	changeBackgroundForBat();
}