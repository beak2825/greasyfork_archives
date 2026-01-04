// ==UserScript==
// @name         Bluesky: prevent closing with unsent text
// @namespace    andrybak.dev
// @version      1
// @description  Prevents closing browser tabs with Bluesky, when there is an open text editor with some text.
// @author       Andrei Rybak
// @license      MIT
// @match        https://bsky.app/*
// @icon         https://web-cdn.bsky.app/static/apple-touch-icon.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@dc32d5897dcfa40a01c371c8ee0e211162dfd24c/waitForElement.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549167/Bluesky%3A%20prevent%20closing%20with%20unsent%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/549167/Bluesky%3A%20prevent%20closing%20with%20unsent%20text.meta.js
// ==/UserScript==

/*
 * Copyright © 2025 Andrei Rybak
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

/* jshint esversion: 6 */
/* globals waitForElement */

(function() {
	'use strict';

	const LOG_PREFIX = '[Bluesky: prevent closing with unsent text]:';

	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}
	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	const EDITOR_SELECTOR = '.ProseMirror[contenteditable="true"]';

	function canExit() {
		const editor = document.querySelector(EDITOR_SELECTOR);
		if (!editor) {
			info('No open editor found. Can close the website.');
			return true;
		}
		if (editor.querySelector('.is-editor-empty') !== null) {
			info('The open editor is empty. Can close the website.');
			return true;
		}
		info('Open editor with text found. Preventing closing the website...');
		return false;
	}

	function confirmExit() {
		// window.onbeforeunload is such a weird API -- this string isn't shown anywhere
		return "You have text in the editor. Are you sure you want to close the website?";
	}

	function addOrRemoveOnbeforeunload() {
		info('addOrRemoveOnbeforeunload: Checking...');
		if (canExit()) {
			if (window.onbeforeunload === confirmExit) {
				window.onbeforeunload = undefined;
			}
		} else {
			window.onbeforeunload = confirmExit;
		}
	}

	function waitForEditor() {
		try {
			waitForElement(EDITOR_SELECTOR).then(editor => {
				info('Found the editor.');
				// editor.addEventListener('keypress', addOrRemoveOnbeforeunload);
				const observer = new MutationObserver(mutations => {
					info('Mutation!');
					addOrRemoveOnbeforeunload();
					if (editor.parentNode === null) { // the `editor` disappeared from the DOM
						observer.disconnect();
						info('Editor was closed. Disconnected the MutationObserver.');
						setTimeout(waitForEditor, 100);
						return;
					}
				});
				/*
				 * The <p> tag gets "is-empty" class when there's no text in the editor.
				 */
				observer.observe(editor.querySelector('p'), {
					attributes: true
				});
				/*
				 * To detect when the dialog is removed from the DOM, observe its parent.
				 */
				observer.observe(document.querySelector('[role="dialog"]').parentElement, {
					childList: true
				});
				info('Finished setting up the MutationObserver.');
			});
		} catch (e) {
			error('Fatal error in main:', e);
		}
	}

	waitForEditor();
})();