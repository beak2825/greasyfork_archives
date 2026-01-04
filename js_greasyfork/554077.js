// ==UserScript==
// @name         YueTube old Theatermode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bring back old YueTube theater mode
// @author       GreenZero
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554077/YueTube%20old%20Theatermode.user.js
// @updateURL https://update.greasyfork.org/scripts/554077/YueTube%20old%20Theatermode.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const BOTTOM_OFFSET = 184;

	function init() {
		let newPlayerContainerEl = document.querySelector('#custom-player-container');
		const columnsEl = document.querySelector('#columns.ytd-watch-flexy');
		const playerEl = document.querySelector('#player.ytd-watch-flexy');
		const playerContainerOuterEl = playerEl?.querySelector('#player-container-outer');
		const videoEl = playerEl?.querySelector('video');
		const controlBarEl = playerEl?.querySelector('.ytp-chrome-bottom');

		const playerHeight = window.innerHeight - BOTTOM_OFFSET;
		const playerWidth = `calc(var(--ytd-watch-flexy-width-ratio) / var(--ytd-watch-flexy-height-ratio) * ${playerHeight}px)`;

		if (!newPlayerContainerEl && columnsEl && playerEl) {
			newPlayerContainerEl = document.createElement('div');
			newPlayerContainerEl.id = 'custom-player-container';

			columnsEl.parentNode.insertBefore(newPlayerContainerEl, columnsEl);
			newPlayerContainerEl.appendChild(playerEl);
		}

		if (playerContainerOuterEl && playerContainerOuterEl.style.width !== playerWidth) {
			playerContainerOuterEl.style.width = playerWidth;
			playerContainerOuterEl.style.maxWidth = 'initial';
			playerContainerOuterEl.style.minWidth = 'initial';
		}

		if (videoEl && videoEl.style.width !== playerWidth) {
			videoEl.style.width = playerWidth;
			videoEl.style.height = `${playerHeight}px`;
		}

		if (controlBarEl && controlBarEl.style.left !== '50%') {
			controlBarEl.style.left = '50%';
			controlBarEl.style.transform = 'translateX(-50%)';
		}
	}

	function debounce(fn, wait) {
		let timeout = null;

		return function(...args) {
			const later = () => {
				timeout = null;
				fn.apply(this, args);
			};

			if (timeout) {
				clearTimeout(timeout);
				timeout = setTimeout(() => later(), wait);
			}
			else {
				timeout = setTimeout(() => later(), wait);
			}
		};
	}

	const _init = debounce(init, 200);

	const observer = new MutationObserver(_init);
	observer.observe(document.body, {
		subtree: true,
		childList: true,
		// characterData: true,
	});

	_init();
})();
