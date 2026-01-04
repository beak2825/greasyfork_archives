// ==UserScript==
// @name         	RottenTomatoes > Add link to full size images for shows/movies.
// @description  	Add link to movie/tv-show pictures on the /picturepage.
// @namespace    	http://jbout.in/
// @author       	Jeremy Boutin
// @version      	1.0.0
// @license      	MIT
// @match       	https://www.rottentomatoes.com/m/*
// @match       	https://www.rottentomatoes.com/tv/*
// @require      	https://code.jquery.com/jquery-1.9.1.min.js
// @grant        	GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552985/RottenTomatoes%20%3E%20Add%20link%20to%20full%20size%20images%20for%20showsmovies.user.js
// @updateURL https://update.greasyfork.org/scripts/552985/RottenTomatoes%20%3E%20Add%20link%20to%20full%20size%20images%20for%20showsmovies.meta.js
// ==/UserScript==

// Avoid jQuery Collision.
// var $ = unsafeWindow.jQuery;


GM_addStyle (`
	.fullScreenButton {
		cursor: pointer !important;
		font-size: 20px;
		margin: 0;
		position: relative;
		top: -15px;
		right: 45px;
	}

	.layout__column--sidebar-right {display: none !important}
	.fullScreenButton:focus,.fullScreenButton:active,.fullScreenButton:hover {box-shadow: 0 0 10px #d5d5d5}
`)

function fullSizePhoto() {
	$("tile-dynamic").each(function (e, obj) {
		const $mediaPhotoWrapper = $(this);
		const $mediaPhoto = $(this).find("rt-img");
		const href = $mediaPhoto.attr("src");
		const updatedURL = href.match(/https:\/\/.*?(https:\/\/.*)$/)?.[1];  // strips out the resize portion of the URL

		// Only add the button if it doesn't already exist
		if ($mediaPhotoWrapper.next(".fullScreenButton").length === 0) {
			const $fullScreenButton = $(`<a href="${updatedURL}" target="_blank" class="fullScreenButton">↗️</a>`);
			$mediaPhotoWrapper.after($fullScreenButton);
		}
	});
};


$(window).load(function () {
  setTimeout(function(){
		setTimeout(function(){
			fullSizePhoto();
		}, 85);
  }, 25);
});