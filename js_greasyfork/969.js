// ==UserScript==
// @name          Geocaching.com - Maps: My Finds and My Hides off by default
// @namespace     JonathanH
// @description	  The script sets My Finds and My Hides off by default on the Geocaching.com Map.
// @include       http://geocaching.com/map/*
// @include       http://www.geocaching.com/map/*
// @include       https://geocaching.com/map/*
// @include       https://www.geocaching.com/map/*
// @grant         none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version       2014.5.16
// @downloadURL https://update.greasyfork.org/scripts/969/Geocachingcom%20-%20Maps%3A%20My%20Finds%20and%20My%20Hides%20off%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/969/Geocachingcom%20-%20Maps%3A%20My%20Finds%20and%20My%20Hides%20off%20by%20default.meta.js
// ==/UserScript==

(function() {
	
	window.addEventListener('load', function() {
		$('#m_myCaches .ct_mf').click();
		$('#m_myCaches .ct_mo').click();
	}, false);

})();
