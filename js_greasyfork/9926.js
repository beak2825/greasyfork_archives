// ==UserScript==
// @name           FaviconizeGoogle
// @namespace      http://userscripts.org/users/89794   (joeytwiddle)
// @description    Adds favicons next to Google search results.
// @downstreamURL  http://userscripts.org/scripts/source/48636.user.js
// @version        1.2.4
// @include      http://www.google.*/search?*
// @include      https://www.google.*/search?*
// @include      http://www.google.com.*/search?*
// @include      https://www.google.com.*/search?*
// @include      http://www.google.*/webhp*
// @include      https://www.google.*/webhp*
// @include      http://www.google.com.*/webhp*
// @include      https://www.google.com.*/webhp*
// @include      http://www.google.*/
// @include      https://www.google.*/
// @include      http://www.google.com.*/
// @include      https://www.google.com.*/
// @include      https://encrypted.google.*/search?*
// @downloadURL https://update.greasyfork.org/scripts/9926/FaviconizeGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/9926/FaviconizeGoogle.meta.js
// ==/UserScript==

// DONE: Provided more options where to place favicon: by the link or by the
// url, before or after, inside or outside the link.  However in my opinion
// they all suck except the default. ;)

// Broken images would be messy, but Firefox seems to hide them after a while
// anyway.  We do still see the gap from the image's padding though!
// It might be desirable to check each image actually exists/loads, or remove it.
// Is that possible, without making an http request ourselves?

// Third-party host URL detection is implemented leniently, and accordingly
// hostname extraction implemented aggressively, which results in favicons
// being given to unexpected things like bookmarklets which contain a site url.

var placeFaviconByUrl = false;
var placeFaviconAfter = false;
var placeFaviconInsideLink = false;

function filterListBy(l,c) {
	var ret = new Array();
	for (var i=0;i<l.length;i++) {
		var it = l[i];
		if (c(it)) {
			ret[ret.length] = it;
		}
	}
	return ret;
}

function createFaviconFor(url) {
	var host = url.replace(/^[^\/]*:\/\//,'').replace(/\/.*$/,'');
	// if (host == document.location.host) {
		// return null;
	// }
	var img = document.createElement('IMG');
	img.src = 'http://'+host+'/favicon.ico';
	img.width = '16';
	img.height = '16';
	img.className = 'favicon';
	img.border = 0;
	img.style.display = 'none';
	img.addEventListener('load',function(){ img.style.display = ''; },false);
	return img;
}

function getElementsByTagNameAndClassName(tN,cN) {
	return filterListBy( document.getElementsByTagName(tN), function(x){ return x.className==cN } );
}

function getElementsByClassName(cN) {
	return getElementsByTagNameAndClassName("*",cN);
}

// var links = document.evaluate("//a[@class='l']",document,null,6,null);
// var links = filterListBy(document.links, function(x){ return x.className=='l'; } );
// var links = document.links.filter( function(x){ return x.className=='l'; } );
var links = getElementsByTagNameAndClassName("A",'l');
// Allows it to work on any sites:
if (links.length == 0)
	links = document.getElementsByTagName("A");

// GM_log("Got links = "+links.snapshotLength);

var style = document.createElement('STYLE');
var padSide = (placeFaviconAfter?'left':'right');
style.innerHTML = ".favicon { padding-"+padSide+": 4px; vertical-align: middle; width: 1em; height: 1em; padding-bottom: 0.2em; }";
document.getElementsByTagName('head')[0].appendChild(style);

// for (var i=0;i<links.snapshotLength;i++) {
	// var link = links.snapshotItem(i);
for (var i=0;i<links.length;i++) {
	var link = links[i];
	// if (link.href.match('^javascript:') || link.href.match('^#')) {
		// continue;
	// }
	//// Skip relative and same-host links:
	if (link.href.match(/^[/]/) || link.href.match("://"+document.location.host)) {
		continue;
	}
	var img = createFaviconFor(link.href);
	var targetNode = (placeFaviconByUrl ? link.parentNode.parentNode.getElementsByTagName('cite')[0] : link);
	if (placeFaviconInsideLink) {
		if (placeFaviconAfter) {
			targetNode.appendChild(img);
		} else {
			targetNode.insertBefore(img,targetNode.firstChild);
		}
	} else {
		if (placeFaviconAfter) {
			targetNode.parentNode.insertBefore(img,targetNode.nextSibling);
		} else {
			targetNode.parentNode.insertBefore(img,targetNode);
		}
	}
}

