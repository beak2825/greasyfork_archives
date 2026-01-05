// ==UserScript==
// @name		Direct Wmode
// @description	An userscript to make flash object display in "direct" mode.
// @namespace	eight04.blogspot.com
// @include		http://www.example.com/
// @version 	0.1.1
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/8914/Direct%20Wmode.user.js
// @updateURL https://update.greasyfork.org/scripts/8914/Direct%20Wmode.meta.js
// ==/UserScript==

new MutationObserver(cleanContainer).observe(document.body, {
	childList: true,
	subtree: true
});

function cleanContainer(){
	var nodes = document.querySelectorAll("object>param[name='wmode']");
	var i;
	var swap = [];
	var len;
	for (i = 0, len = nodes.length; i < len; i++) {
		swap[i] = nodes[i];
	}
	for (i = 0; i < len; i++) {
		swap[i].setAttribute("value", "direct");
	}
}

function clean(object) {
	var clone = object.cloneNode(true);
	var param = clone.querySelector("[name=wmode]");
	if (!param) {
		return;
	}
	if (param.getAttribute("value") == "direct") {
		return;
	}
	param.setAttribute("value", "direct");
	object.parentNode.replaceChild(clone, object);
}
