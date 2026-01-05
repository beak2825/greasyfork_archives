// ==UserScript==
// @name		Github Rawgit Button
// @namespace	eight04.blogspot.com
// @description	An userscript to add "Rawgit" button on github.
// @include		https://github.com/*
// @include		https://gist.github.com/*
// @version		1.2.2
// @grant 		none
// @downloadURL https://update.greasyfork.org/scripts/5621/Github%20Rawgit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/5621/Github%20Rawgit%20Button.meta.js
// ==/UserScript==

/*
https://gist.github.com/eight04/186267c150a2dfc0580a/raw/812fd7b418e0a157f02caa144a15c55c06ced8ac/uao_decode.py
https://rawgit.com/eight04/186267c150a2dfc0580a/raw/812fd7b418e0a157f02caa144a15c55c06ced8ac/uao_decode.py

https://github.com/eight04/linky-square/raw/master/demo.html
https://rawgit.com/eight04/linky-square/master/demo.html
*/

"use strict";

function replace(){
	// Check if raw-url button exists
	var btns, i;
	btns = document.querySelectorAll(".file-actions a:not(.rawgit)");
	for (i = 0; i < btns.length; i++) {
		if (btns[i].textContent == "Raw") {
			createButton(btns[i]);
		}
	}
}

function createButton(btn) {
	var url = btn.href;
	if (url.indexOf("gist.github.com") >= 0) {
		url = url.replace("gist.github.com", "rawgit.com");
	} else {
		url = url.replace(/github\.com\/([^/]+\/[^/]+)\/raw/, "rawgit.com/$1");
	}

	var newBtn = btn.cloneNode(false);
	newBtn.href = url;
	newBtn.textContent = "Rawgit";
	newBtn.removeAttribute("id");

	btn.parentNode.insertBefore(newBtn, btn.nextSibling);
	btn.classList.add("rawgit");
	
	if (!btn.parentNode.classList.contains("btn-group")) {
		var parent = btn.parentNode,
			group = document.createElement("div");
		group.className = "btn-group";
		while (parent.childNodes.length) {
			group.appendChild(parent.childNodes[0]);
		}
		parent.appendChild(group);
	}
}

var container =
	document.querySelector("#js-repo-pjax-container") ||
	document.querySelector("#js-pjax-container");

if (container) {
	new MutationObserver(function(){
		replace();
	}).observe(container, {childList: true, subtree: true});
}

replace();
