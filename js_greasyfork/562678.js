// ==UserScript==
// @name         Group Attack Link
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opens player profile in a right-side iframe popup
// @match        https://www.torn.com/loader.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562678/Group%20Attack%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/562678/Group%20Attack%20Link.meta.js
// ==/UserScript==

(function () {
	setInterval(() => {
		const el = document.querySelector(".playername___oeaye");
		if (!el || el.dataset.bound) return;

		const id = el.textContent.trim();
		if (!id) return;

		el.style.cursor = "pointer";
		el.style.textDecoration = "underline";

		el.onclick = (e) => {
			e.stopPropagation();
			window.open(
				`https://www.torn.com/profiles.php?NID=${id}`,
				"_blank"
			);
		};

		el.dataset.bound = 1;
	}, 1000);
})();