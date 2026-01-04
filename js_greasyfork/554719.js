// ==UserScript==
// @name         Mebuki level5 death
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  めぶきちゃんのスレッド内のマイクロ秒に対して5の倍数の時に装飾します
// @author       You
// @match        https://mebuki.moe/app/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mebuki.moe
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554719/Mebuki%20level5%20death.user.js
// @updateURL https://update.greasyfork.org/scripts/554719/Mebuki%20level5%20death.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let css = '';
	css += '.xxxlevel5 { background-color: var(--foreground);color: var(--background); }';
	GM_addStyle(css);

	setTimeout(() => {
		new Promise((resolve, reject) => {
			const target = document.querySelector('.thread-messages');
			const checkLv5 = (target) => {
				target.querySelectorAll('span[class*="text-xs"][class*="text-foreground/60"]').forEach((e) => {
					if (e.textContent.match(/[05]$/)) {
						e.classList.add('xxxlevel5');
					}
				});
			}
			if (target) {
				checkLv5(target);
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						//console.log(mutation);
						mutation.addedNodes.forEach((addedNode) => {
							if (!(addedNode instanceof HTMLElement)) return;
							//console.log(addedNode);
							checkLv5(addedNode);
						});
					});
				});
				observer.observe(target, { childList: true, subtree: true });
			}
		});
	},3*1000);
})();