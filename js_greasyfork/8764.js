// ==UserScript==
// @name          Yahoo direct non-tracking search
// @description   Strips tracking and redirection from Yahoo search urls
// @match         *://*.yahoo.com/*
// @match         *://*.yahoo.co.jp/*
// @match         *://*.yahoo.cn/*
// @include       /https?:\/\/(\w+\.)*yahoo.(com|\w\w(\.\w\w)?)\/.*/
// @version       1.1.4
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js?version=175122
// @downloadURL https://update.greasyfork.org/scripts/8764/Yahoo%20direct%20non-tracking%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/8764/Yahoo%20direct%20non-tracking%20search.meta.js
// ==/UserScript==

/* jshint lastsemic:true, multistr:true, laxbreak:true, -W030, -W041, -W084 */

setMutationHandler(document, 'form, a', function(nodes) {
	nodes.forEach(function(node) {
		switch (node.localName) {
			case 'form':
				if (node.action.indexOf('/search') > 0) {
						node.addEventListener('submit', function(e){
							e.preventDefault();
							stopPropagation(e);
							e.target.action = e.target.action.replace(/_yl[tu]=[\w;_=.-]+/, '');
							e.target.submit();
						});
				}
				break;
			case 'a':
				node.href = node.href.replace(/;?_yl[tu]=[\w;_=.-]+\/?/, '')
					.replace(/^.+?\/RU=(http[^\/]+)\/?.*$/, function(s, url) { return decodeURIComponent(url) });
				node.removeAttribute('onmousedown');
				node.removeAttribute('data-sb');
				break;
		}
	});
	return true;
});

document.addEventListener('click', stopPropagation, true);
document.addEventListener('mousedown', stopPropagation, true);
window.addEventListener('click', stopPropagation, true);
window.addEventListener('mousedown', stopPropagation, true);

function stopPropagation(e) {
	if (e.target.href) {
		e.stopPropagation();
		e.stopImmediatePropagation();
	}
}
