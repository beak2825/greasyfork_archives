// ==UserScript==
// @name         SigmaQ Anti-cheat Bypass
// @name:zh-CN   SigmaQ 反作弊绕过
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass SigmaQ anti-cheat restrictions
// @description:zh-CN  绕过SigmaQ反作弊限制
// @author       ICT
// @match        https://sigmaq.co/*
// @match        https://*.sigmaq.co/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561913/SigmaQ%20Anti-cheat%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/561913/SigmaQ%20Anti-cheat%20Bypass.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const originalAddEventListener = EventTarget.prototype.addEventListener;
	const blockedEvents = [
		'keydown',
		'keyup',
		'keypress',
		'contextmenu',
		'copy',
		'cut',
		'paste',
		'selectstart',
		'dragstart',
		'mousedown',
		'mouseup',
	];

	EventTarget.prototype.addEventListener = function (type, listener, options) {
		if (blockedEvents.includes(type)) {
			return;
		}
		return originalAddEventListener.call(this, type, listener, options);
	};

	const originalAlert = window.alert;
	window.alert = function (message) {
		if (message && typeof message === 'string' && message.includes('为保证测评公平')) {
			return;
		}
		return originalAlert.call(window, message);
	};

	function removeAntiCheatStyles() {
		const style = document.getElementById('anti-cheat-style');
		if (style) {
			style.remove();
		}

		document.querySelectorAll('[style*="user-select"]').forEach(el => {
			el.style.userSelect = '';
			el.style.webkitUserSelect = '';
			el.style.mozUserSelect = '';
			el.style.msUserSelect = '';
		});
	}

	function enableTextSelection() {
		const style = document.createElement('style');
		style.id = 'bypass-style';
		style.innerHTML = `
            *, *::before, *::after {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
                -webkit-user-drag: auto !important;
            }
        `;
		if (document.head) {
			document.head.appendChild(style);
		}
	}

	const originalConsoleLog = console.log;
	console.log = function (...args) {
		const message = args.join(' ');
		if (message.includes('ULTIMATE Anti-cheat') || message.includes('Anti-cheat activated')) {
			setTimeout(() => {
				removeAntiCheatStyles();
				enableTextSelection();
			}, 100);
		}
		return originalConsoleLog.apply(console, args);
	};

	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.id === 'anti-cheat-style') {
					removeAntiCheatStyles();
					enableTextSelection();
				}
			});
		});
	});

	function periodicCleanup() {
		removeAntiCheatStyles();
		setTimeout(periodicCleanup, 2000);
	}

	function init() {
		enableTextSelection();

		if (document.body) {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}

		periodicCleanup();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	window.addEventListener('load', () => {
		setTimeout(() => {
			removeAntiCheatStyles();
			enableTextSelection();
		}, 500);
	});
})();
