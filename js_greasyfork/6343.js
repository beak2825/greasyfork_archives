// ==UserScript==
// @name         Google search history deleter helper
// @namespace    nopantsu
// @version      0.2
// @description  Will select all items on page and click remove button until everything is deleted.
// @match        https://history.google.com/history/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6343/Google%20search%20history%20deleter%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6343/Google%20search%20history%20deleter%20helper.meta.js
// ==/UserScript==

if (document.getElementById("div0")) {
	setAllChecks();
	document.getElementsByClassName("kd-button")[1].click();
}