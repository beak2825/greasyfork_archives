// ==UserScript==
// @name         Group Attack Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens player profile in a right-side iframe popup
// @match        https://www.torn.com/loader.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562678/Group%20Attack%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/562678/Group%20Attack%20Link.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function openProfilePopup(id) {
		// Prevent duplicate overlay
		if (document.getElementById("tm-profile-overlay")) return;

		const overlay = document.createElement("div");
		overlay.id = "tm-profile-overlay";
		overlay.style.cssText = `
			position: fixed;
			top: 0;
			right: 0;
			width: 450px;
			height: 800px;
			background: rgba(0,0,0,0.5);
			z-index: 99999;
		`;

		const iframe = document.createElement("iframe");
		iframe.src = `https://www.torn.com/profiles.php?NID=${id}`;
		iframe.style.cssText = `
			width: 100%;
			height: 100%;
			border: none;
			border-radius: 0;
			background: #000;
		`;

		overlay.appendChild(iframe);
		document.body.appendChild(overlay);

		// Close popup if you click outside iframe (on overlay)
		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) overlay.remove();
		});
	}

	setInterval(() => {
		const el = document.querySelector(".playername___oeaye");
		if (!el || el.dataset.popupApplied) return;

		const id = el.textContent.trim();
		if (!id) return;

		el.style.cursor = "pointer";
		el.style.textDecoration = "underline";

		el.addEventListener("click", (e) => {
			e.stopPropagation();
			openProfilePopup(id);
		});

		el.dataset.popupApplied = "true";
	}, 1000);
})();