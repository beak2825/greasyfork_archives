// ==UserScript==
// @name         URL Parameter Stripper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes all query parameters from URLs on specified domains
// @match        *://*.google.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560992/URL%20Parameter%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/560992/URL%20Parameter%20Stripper.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function stripParams() {
		const url = new URL(window.location.href);
		const paramsToRemove = ["gs_lp", "sca_esv", "fbs", "sei"];

		let modified = false;
		paramsToRemove.forEach((param) => {
			if (url.searchParams.has(param)) {
				url.searchParams.delete(param);
				modified = true;
			}
		});

		if (modified) {
			window.history.replaceState(null, "", url.href);
		}
	}

	// Run immediately on page load
	stripParams();

	// Handle SPA navigation (pushState/replaceState)
	const originalPushState = history.pushState;
	const originalReplaceState = history.replaceState;

	history.pushState = function (...args) {
		originalPushState.apply(this, args);
		stripParams();
	};

	history.replaceState = function (...args) {
		originalReplaceState.apply(this, args);
		// Prevent infinite loop - only strip if we're not the caller
		if (
			!args[2]?.includes?.("://") ||
			new URL(args[2], location.href).search
		) {
			setTimeout(stripParams, 0);
		}
	};

	// Handle back/forward navigation
	window.addEventListener("popstate", stripParams);

	// MutationObserver fallback for edge cases (some frameworks)
	let lastUrl = location.href;
	new MutationObserver(() => {
		if (location.href !== lastUrl) {
			lastUrl = location.href;
			stripParams();
		}
	}).observe(document.documentElement, { subtree: true, childList: true });
})();