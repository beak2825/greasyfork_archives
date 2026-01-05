// ==UserScript==
// @name        Open external link in new tab
// @version     0.1.3
// @namespace   eight04.blogspot.com
// @description This script will open any external link in new tab. Support dynamic content
// @include     http*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/9499/Open%20external%20link%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/9499/Open%20external%20link%20in%20new%20tab.meta.js
// ==/UserScript==

"use strict";

function getAnchor(element) {
	while (element && element.nodeName != "A") {
		element = element.parentNode;
	}
	return element;
}

document.addEventListener("click", function(e){
	var anchor = getAnchor(e.target);
	if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
		return;
	}
	if (anchor.hostname != location.hostname) {
		anchor.target = "_blank";
	}
});
