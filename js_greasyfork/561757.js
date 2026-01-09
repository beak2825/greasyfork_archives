// ==UserScript==
// @name         Cherry🥀
// @namespace    http://tampermonkey.net/
// @version      2026-01-07
// @description  For Cherry
// @author       sentienmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561757/Cherry%F0%9F%A5%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561757/Cherry%F0%9F%A5%80.meta.js
// ==/UserScript==

(function() {
    document.body.insertAdjacentHTML("beforeend", `<style>
		.CharacterName_name__1amXp[data-name="Cherry"]::after {
			content: "🥀";
		}
	</style>`);
})();
