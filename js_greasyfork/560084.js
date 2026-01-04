// ==UserScript==
// @name        Sort by Score
// @description Adds a button to sort by total score on rule34
// @license     MIT
// @namespace   https://sleazyfork.org/en/scripts/560084-sort-by-score
// @match       https://rule34.xxx/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @supportURL  https://sleazyfork.org/en/scripts/560084-sort-by-score/feedback
// @grant       none
// @version     1.4.1
// @author      TsunderRae
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/560084/Sort%20by%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/560084/Sort%20by%20Score.meta.js
// ==/UserScript==

$("document").ready(function () {
	var searchField = document.getElementsByName("tags")[0];
	var searchButton = document.getElementsByName("commit")[0];
	var newButton = document.createElement("Button");
	newButton.innerHTML = "sort:score";
	newButton.style.cursor = "pointer";
	newButton.onclick = (e) => {
		searchField.value += " sort:score";
		searchButton.click();
	};
	document.getElementsByClassName("tag-search")[0].appendChild(newButton);
});