// ==UserScript==
// @name           Remove Sponsored Links
// @author         Cameron Bernhardt (AstroCB)
// @namespace  		 http://github.com/AstroCB
// @version       1.2
// @description		 Removes sponsored links from tag pages
// @include        http://*.stackexchange.com/questions/tagged/*
// @include        http://stackoverflow.com/questions/tagged/*
// @include        http://meta.stackoverflow.com/questions/tagged/*
// @include        http://serverfault.com/questions/tagged/*
// @include        http://meta.serverfault.com/questions/tagged/*
// @include        http://superuser.com/questions/tagged/*
// @include        http://meta.superuser.com/questions/tagged/*
// @include        http://askubuntu.com/questions/tagged/*
// @include        http://meta.askubuntu.com/questions/tagged/*
// @include        http://stackapps.com/questions/tagged/*
// @downloadURL https://update.greasyfork.org/scripts/7293/Remove%20Sponsored%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/7293/Remove%20Sponsored%20Links.meta.js
// ==/UserScript==
window.onload = function () {
	document.getElementsByTagName("iframe")[0].hidden = true;
};