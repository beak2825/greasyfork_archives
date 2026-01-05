// ==UserScript==
// @name        Cpasbien direct torrent
// @name:fr     Cpasbien direct torrent
// @author      Tegomass
// @namespace   hideonScript
// @description Add a direct link to the torrent file in the summary. With this script, you no longer need to open each link to get the torrent file.
// @description:fr Ajoutez un lien direct vers le fichier torrent voulu directement depuis la liste (cela vous évitera d'ouvrir chaque fiche une à une pour récupérer le fichier torrent.
// @include     http://www.cpasbien.*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6842/Cpasbien%20direct%20torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/6842/Cpasbien%20direct%20torrent.meta.js
// ==/UserScript==


$('#conteneur').append('<div id="tegoAdd" style="position:fixed; top:0px; right:0px; background-color:#2980b9 ; padding: 10px; color:#fff">Fast Torrent</div>')
$('#tegoAdd').one('click', function() {
	$('#gauche [class^=ligne]').each(function() {
	    var self = $(this);
		$.ajax({
			url: $('.titre',this).attr('href'),
			type: 'GET',
	 		success: function(data){
	   			$('.down', self).html('<a href="'+ $('#telecharger', data).attr('href') +'">'+$('.down', self).text()+'</a>');
			}
		});
	});
	$(this).remove();
});
