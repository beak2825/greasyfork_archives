// ==UserScript==
// @name         Reddit Replace Iframe
// @namespace    kmcdeals.com
// @version      1
// @description  replaces reddits youtube/vimeo iframe with the iframe from the corresponding website
// @author       kmc
// @match        https://*.reddit.com/*
// @require 	 http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/7485/Reddit%20Replace%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/7485/Reddit%20Replace%20Iframe.meta.js
// ==/UserScript==

$(document).on('click', ".expando-button.video.expanded", function(event) {
	var href = $(event.target).parent().find("a.title").attr("href");
	if(href.indexOf("vimeo") > -1) //if vimeo
		href = href.replace(/https?:\/\/vimeo\.com/, "//player.vimeo.com/video");
	if(href.indexOf("youtube") > -1 || href.indexOf("youtu.be") > -1)
		href = href.replace(/https?:\/\/youtu\.be/g, "//www.youtube.com/embed").replace(/https:|m\./g, "").replace(/watch\?v=/g, "embed/");
	var iframe = $(event.target).parent().find(".expando").children()[0];
	$(iframe).replaceWith('<iframe width="610" height="460" src="' + href + '" frameborder="0" allowfullscreen></iframe>');
});