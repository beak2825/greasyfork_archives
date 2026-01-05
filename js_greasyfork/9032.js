// ==UserScript==
// @name        Fix links for individual pictures on suicidegirls.com
// @namespace   http://www.suicidegirls.com
// @description New SG galleries have weird support to open images in a new tab (browser tries to download instead of display). This script solves the issue by linking to the highest resolution image while using the same webservice that the album functionality uses (it's transparent to the site and doesn't incur any extra load on their servers). Notice you still need to own a suicidegirls.com membership to access albums, this script doesn't try to bypass any of the security measures on the site.
// @include     https://suicidegirls.com/girls/*/album/*
// @include     https://*.suicidegirls.com/girls/*/album/*
// @include     https://suicidegirls.com/members/*/album/*
// @include     https://*.suicidegirls.com/members/*/album/*
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9032/Fix%20links%20for%20individual%20pictures%20on%20suicidegirlscom.user.js
// @updateURL https://update.greasyfork.org/scripts/9032/Fix%20links%20for%20individual%20pictures%20on%20suicidegirlscom.meta.js
// ==/UserScript==

(function () {
	var serviceBase = 'https://' + window.location.hostname + '/api/get_album_info/';
    var albumElement = document.querySelector('[class="album-container"][data-album-id]');

    // check if logged in
    if (document.body.getAttribute('sg-user_name')) {
	    $.ajax({
	    	url: serviceBase + albumElement.dataset.albumId + '/',
	    	dataType: 'json'
	    }).done(function(data) {
	    	data.photos.forEach(function(descriptor) {
	    		var anchor = albumElement.querySelector('[id^="thumb-' + descriptor.number + '"] > a');

	    		anchor.setAttribute('href', descriptor.urls['2432'] || descriptor.urls.original)
	    	});
	    });
	}

})();