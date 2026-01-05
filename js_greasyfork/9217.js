// ==UserScript==
// @name           Show Nyaa files
// @name:sv        Visa Nyaa-filer
// @namespace      AndreasSE93
// @description    Automatically shows files on Nyaa Torrents.
// @description:sv Visar automatiskt filer på Nyaa Torrents.
// @icon           https://files.nyaa.se/favicon.png
// @include        *://www.nyaa.se/*
// @include        *://sukebei.nyaa.se/*
// @version        1.3
// @license        https://opensource.org/licenses/MIT
// @compatible     Firefox 25-52
// @compatible     Chrome 55
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/9217/Show%20Nyaa%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/9217/Show%20Nyaa%20files.meta.js
// ==/UserScript==

var nyaaFilesInit = function() {
	var replaceLink = function(link, replacement) {
		var parent = link.parentNode;
		if (link.previousSibling .textContent === "["    ) { parent.removeChild(link.previousSibling); }
		if (link.previousSibling instanceof HTMLBRElement) { parent.removeChild(link.previousSibling); }
		if (link.nextSibling     .textContent === "]"    ) { parent.removeChild(link.nextSibling);     }
		if (link.nextSibling     instanceof HTMLBRElement) { parent.removeChild(link.nextSibling);     }
		if (replacement == null) {
			parent.removeChild(link);
		} else {
			parent.replaceChild(replacement, link);
		}
	};

	var onload = function(xhr, link) {
		var fileList = xhr.response.getElementsByClassName("viewfile")[0];
		replaceLink(link, fileList);
	};

	var xhr    = new XMLHttpRequest();
	var links  = document.getElementsByClassName("viewilink");
	for (var link of links) {
		if (link.innerHTML === "Show files") {
			xhr.addEventListener("load", onload.bind(null, xhr, link));
			xhr.open("GET", link.href);
			xhr.responseType = "document";
			xhr.send();
		} else if (link.innerHTML === "Hide files") {
			replaceLink(link, null);
		}
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", nyaaFilesInit);
} else {
	nyaaFilesInit();
}
