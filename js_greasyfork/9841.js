// ==UserScript==
// @name        Display Original Image
// @version     0.1.2
// @namespace   eight04.blogspot.com
// @description This script will replace thumbnail with full size image if available.
// @include     http*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9841/Display%20Original%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/9841/Display%20Original%20Image.meta.js
// ==/UserScript==

"use strict";

function observeDocument(callback) {

	callback(document.body);

	new MutationObserver(function(mutations){
		var i;
		for (i = 0; i < mutations.length; i++) {
			if (!mutations[i].addedNodes.length) {
				continue;
			}
			callback(mutations[i].target);
		}
	}).observe(document.body, {
		childList: true,
		subtree: true
	});
}

function displayOriginalImage(node) {
	var imgs = node.querySelectorAll("a[href]>img[src]");
	var i;

	for (i = 0; i < imgs.length; i++) {
		replace(imgs[i], imgs[i].parentNode);
	}
}

function handleError() {
	this.src = this.oldSrc;
	this.removeEventListener(handleError);
	this.classList.add("display-original-image-failed");
}

function replace(img, anchor) {
	if (anchor.classList.contains("display-original-image")) {
		return;
	}
	if (!/\.(jpg|png|gif)($|\?)/i.test(anchor.href)) {
		return;
	}
	img.addEventListener("error", handleError);
	img.oldSrc = img.src;
	img.src = anchor.href;
	anchor.classList.add("display-original-image");
}

observeDocument(displayOriginalImage);
