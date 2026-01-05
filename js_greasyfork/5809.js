	// ==UserScript==
	// @name        Remove URL Redirections[NoMiddleMan]
	// @namespace   http://oreilly.com/pub/h/4103#code
	// @description Rewrites URLs to remove redirection scripts
	// @author      Albert Bachand
	// @encoding    utf-8
	// @homepage    http://oreilly.com/pub/h/4103#code
	// @include     *
	// @exclude	http://del.icio.us/*
	// @exclude     http://*bloglines.com/*
	// @exclude	http://web.archive.org/*
	// @exclude	http://*wists.com/*
// @version 0.0.1.20141016185224
// @downloadURL https://update.greasyfork.org/scripts/5809/Remove%20URL%20Redirections%5BNoMiddleMan%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/5809/Remove%20URL%20Redirections%5BNoMiddleMan%5D.meta.js
	// ==/UserScript==

	// based on code by Albert Bachand
	// and included here with his gracious permission
	// http://kungfoo.webhop.org/nomiddleman.user.js

	for (var i=0; i<document.links.length; i++) { 
		 var link, temp, start, url, qindex, end; 
		 link = document.links[i];

		 // Special case for Google results (assumes English language)
		 if (link.text == 'Cached' ||
			 /Similar.*?pages/.exec(link.text)) {
			 continue;
		 }

		 temp = link.href.toLowerCase();

		 // ignore javascript links and GeoURL
		 if (temp.indexOf('javascript:') == 0 ||
		 temp.indexOf('geourl.org') != -1) {
			 continue;
		 }

		 // find the start of the (last) real url
		 start = Math.max(temp.lastIndexOf('http%3a'),
				  temp.lastIndexOf('http%253a'),
				  temp.lastIndexOf('http:'));

		 if (start <= 0) { 
			 // special case: handle redirect url without a 'http:' part 
			 start = link.href.lastIndexOf('www.'); 
			 if (start < 10) {
				 start = 0;
			 } else { 
				 link.href = link.href.substring(0, start) + 
				 'http://' + link.href.substring(start);
			 }
		 }

		 // we are most likely looking at a redirection link
		 if (start > 0) {
			 url = link.href.substring(start);

			 // check whether the real url is a parameter 
			 qindex = link.href.indexOf('?'); 
			 if (qindex > -1 && qindex < start) {
			     // it's a parameter, extract only the url
				 end = url.indexOf('&');
				 if (end > -1) {
				 url = url.substring(0, end);
				 }
			 }
			 // handle Yahoo's chained redirections
			 var temp = url;
			 url = unescape(url);

			 while (temp != url) {
				 temp = url;
				 url = unescape(url);
			 }
			 // and we're done
			 link.href = url.replace(/&amp;/g, '&');
		 }
	}

