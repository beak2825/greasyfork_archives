// ==UserScript==
// @name         Mebuki zorome
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  めぶきちゃんのスレッド内のマイクロ秒に対してゾロ目の時に装飾します
// @author       You
// @match        https://mebuki.moe/app/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mebuki.moe
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554718/Mebuki%20zorome.user.js
// @updateURL https://update.greasyfork.org/scripts/554718/Mebuki%20zorome.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let css = '';
	css += '.xxxzorome2 { text-decoration: underline; }';
	css += '.xxxzorome3 { text-decoration: underline; text-decoration-style: double;}';
	css += '.xxxzorome4 { text-decoration: underline; text-decoration-style: wavy;}';
	GM_addStyle(css);

	setTimeout(() => {
		new Promise((resolve, reject) => {
			const target = document.querySelector('.thread-messages');
			const checkZorome = (target) => {
				target.querySelectorAll('span[class*="text-xs"][class*="text-foreground/60"]').forEach((e) => {
					const s = e.textContent.replace('.','');
					const result = s.match(/((\d)\2+)$/);
					if (result) {
						const zorolen = result[0].length;
						e.classList.add(`xxxzorome${zorolen}`);
						//console.log(e);
					}
				});
			}
			if (target) {
				checkZorome(target);
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						//console.log(mutation);
						mutation.addedNodes.forEach((addedNode) => {
							if (!(addedNode instanceof HTMLElement)) return;
							//console.log(addedNode);
							checkZorome(addedNode);
						});
					});
				});
				observer.observe(target, { childList: true, subtree: true});
			}
		});
	}, 3*1000);
})();