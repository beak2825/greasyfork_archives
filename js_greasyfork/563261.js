// ==UserScript==
// @name         Sparckles ✨
// @namespace    http://tampermonkey.net/
// @version      2026-01-19
// @description  For Sparkles
// @author       sentienmilk
// @license      MIT
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563261/Sparckles%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563261/Sparckles%20%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
	document.body.insertAdjacentHTML("beforeend", `<style>
		.CharacterName_characterName__2FqyZ:has([data-name="6sparklecats7"]) {
			position: relative;
		}

		.CharacterName_characterName__2FqyZ:has([data-name="6sparklecats7"])::before,
		.CharacterName_characterName__2FqyZ:has([data-name="6sparklecats7"])::after {
			content: "✦";
			position: absolute;
			font-size: 10px;
			opacity: 90%;

			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}

		.CharacterName_characterName__2FqyZ:has([data-name="6sparklecats7"])::before {
			color: var(--color-orange-600);

			transform: rotate(0deg) scale(0);

			animation-name: pos-1, appear;
			animation-duration: 15s, 3s;
			animation-delay: 0s, 0s;
		}

		.CharacterName_characterName__2FqyZ:has([data-name="6sparklecats7"])::after {
			color: var(--color-orange-300);

			transform: rotate(0deg) scale(0);

			animation-name: pos-2, appear;
			animation-duration: 21s, 3s;
			animation-delay: 0.2s, 0.2s;
		}

		@keyframes appear {
			0% { transform: rotate(-90deg) scale(0); }
			15% { transform: rotate(-90deg) scale(0); }
			25% { transform: rotate(0deg) scale(1); }
			40% { transform: rotate(90deg) scale(0); }
			100% { transform: rotate(90deg) scale(0); }
		}

		@keyframes pos-1 {
			0% { top: -8px; left: 20px; } 19% { top: -8px; left: 20px; }
			20% { top: -5px; left: 30px; } 39% { top: -5px; left: 30px; }
			40% { top: 0px; left: 50px; } 59% { top: -3px; left: 50px; }
			60% { top: 0px; left: 70px; } 79% { top: -5px; left: 70px; }
			80% { top: -10px; left: 60px; } 99% { top: -7px; left: 60px; }
		}

		@keyframes pos-2 {
			0% { top: 8px; left: 70px; } 14% { top: 8px; left: 70px; }
			14.24% { top: 0px; left: 40px; } 28% { top: 0px; left: 40px; }
			28.57% { top: 5px; left: 20px; } 42% { top: 5px; left: 20px; }
			42.85% { top: 6px; left: 30px; } 57% { top: 6px; left: 30px; }
			57.14% { top: 8px; left: 50px; } 71% { top: 8px; left: 50px; }
			71.42% { top: 5px; left: 40px; } 85% { top: 5px; left: 40px; }
			85.71% { top: 0px; left: 20px; } 99% { top: 0px; left: 20px; }
		}
	</style>`);
})();
