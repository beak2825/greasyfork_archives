// ==UserScript==
// @name           Alt To Hover
// @author         AstroCB
// @description  Changes the alt text to hover text on SE sites
// @version        1.2
// @namespace  https://github.com/AstroCB
// @include        http://*.stackexchange.com/questions/*
// @include        http://stackoverflow.com/questions/*
// @include        http://meta.stackoverflow.com/questions/*
// @include        http://serverfault.com/questions/*
// @include        http://meta.serverfault.com/questions/*
// @include        http://superuser.com/questions/*
// @include        http://meta.superuser.com/questions/*
// @include        http://askubuntu.com/questions/*
// @include        http://meta.askubuntu.com/questions/*
// @include        http://stackapps.com/questions/*
// @include        http://*.stackexchange.com/posts/*
// @include        http://stackoverflow.com/posts/*
// @include        http://meta.stackoverflow.com/posts/*
// @include        http://serverfault.com/posts/*
// @include        http://meta.serverfault.com/posts/*
// @include        http://superuser.com/posts/*
// @include        http://meta.superuser.com/posts/*
// @include        http://askubuntu.com/posts/*
// @include        http://meta.askubuntu.com/posts/*
// @include        http://stackapps.com/posts/*
// @exclude        http://*.stackexchange.com/questions/tagged/*
// @exclude        http://stackoverflow.com/questions/tagged/*
// @exclude        http://meta.stackoverflow.com/questions/tagged/*
// @exclude        http://serverfault.com/questions/tagged/*
// @exclude        http://meta.serverfault.com/questions/*
// @exclude        http://superuser.com/questions/tagged/*
// @exclude        http://meta.superuser.com/questions/tagged/*
// @exclude        http://askubuntu.com/questions/tagged/*
// @exclude        http://meta.askubuntu.com/questions/tagged/*
// @exclude        http://stackapps.com/questions/tagged/*
// @downloadURL https://update.greasyfork.org/scripts/7821/Alt%20To%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/7821/Alt%20To%20Hover.meta.js
// ==/UserScript==
window.onload = function () {
	var images = document.getElementsByTagName("img");
	for (var i = 0; i < images.length; i++) {
		if (images[i].alt && !images[i].title && images[i].alt !== "enter image description here") {
			images[i].title = images[i].alt;
		}
	}
};