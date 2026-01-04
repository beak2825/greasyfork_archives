// ==UserScript==
// @name           Twitter: always Following tab
// @namespace      https://andrybak.dev
// @version        2
// @description    Select the "Following" tab on Twitter automatically
// @author         Andrei Rybak
// @license        MIT
// @match          https://x.com/*
// @icon           https://abs.twimg.com/favicons/twitter.2.ico
// @grant          none
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/559725/Twitter%3A%20always%20Following%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559725/Twitter%3A%20always%20Following%20tab.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2025 Andrei Rybak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
	'use strict';

	const LOG_PREFIX = "[Twitter: always Following tab]";
	const DEBUG = false;
	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}
	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}
	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}
	function debug(...toLog) {
		if (DEBUG) {
			console.debug(LOG_PREFIX, ...toLog);
		}
	}

	let intervalId = null;

	function selectFollowing() {
		info('Selecting "Following"...');
		Array.from(document.querySelectorAll('nav[aria-live="polite"] [role="tab"]'))
			.filter(tab => tab.innerText === 'Following')
			.forEach(tab => {
				tab.click();
				if (intervalId !== null) {
					clearInterval(intervalId);
					intervalId = null;
				}
			});
	}

	function observeTitle(callback) {
		let title = document.title;
		const titleObserver = new MutationObserver(mutationsList => {
			const maybeNewTitle = document.title;
			if (maybeNewTitle != title) {
				info('Title changed:', maybeNewTitle);
				title = maybeNewTitle;
				callback(); // supplied from outside
			}
		});
		const titleElement = document.getElementsByTagName('title')[0];
		titleObserver.observe(titleElement, { subtree: true, characterData: true, childList: true });
	}

	function startSelectingFollowing() {
		if (document.location.pathname === '/home' && intervalId === null) {
			intervalId = setInterval(selectFollowing, 250);
		}
	}

	startSelectingFollowing();
	observeTitle(startSelectingFollowing);
})();