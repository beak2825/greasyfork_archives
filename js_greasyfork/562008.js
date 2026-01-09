// ==UserScript==
// @name         Mobbin.com | Un-blur images mod
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Un-blur images for mobbin.com
// @author       Cerpow
// @match        https://mobbin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobbin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562008/Mobbincom%20%7C%20Un-blur%20images%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/562008/Mobbincom%20%7C%20Un-blur%20images%20mod.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('Mobbin Unblur: Script initiated');

	function removeClutter() {
		// 1. Remove "Get Pro" CTA sections (specific aside blocks)
		document.querySelectorAll('aside.sticky:has(h1), aside.sticky:has(button[class*="bg-background-inverse"])').forEach((el) => {
			console.log('Mobbin Unblur: Removing Get Pro CTA');
			el.remove();
		});

		// 2. Remove the top filter bar below the main nav
		const filterBar = document.querySelector('section.sticky.z-10:has(button[aria-label="Filter"])');
		if (filterBar) {
			console.log('Mobbin Unblur: Removing sticky filter bar');
			filterBar.remove();
		}
	}

	function unblur() {
		// 1. Clear backdrop-blur effects without removing the element (to avoid React crashes)
		// Exclude interactive UI like dialogs, popovers, and menus
		const blurElements = document.querySelectorAll('[class*="backdrop-blur"], [style*="backdrop-filter"]');

		blurElements.forEach((el) => {
			// Skip critical UI components to prevent interference/crashes
			if (el.closest('[role="dialog"]') || el.closest('[role="menu"]') || el.closest('[role="listbox"]') || el.closest('[role="popover"]') || el.closest('[data-radix-popper-content-wrapper]')) {
				return;
			}

			const style = window.getComputedStyle(el);
			if (style.backdropFilter.includes('blur') || style.filter.includes('blur')) {
				el.style.backdropFilter = 'none';
				el.style.filter = 'none';
				// If it has a translucent background that obscures content, clear it too
				if (el.className.includes('bg-') && (el.className.includes('/40') || el.className.includes('/30'))) {
					el.style.backgroundColor = 'transparent';
				}
			}
		});

		// 2. Update image sources
		let updatedCount = 0;
		document.querySelectorAll('img').forEach((img) => {
			try {
				let url = new URL(img.src);
				let changed = false;

				// Update width: User preferred 1200
				if (url.searchParams.has('w')) {
					const w = parseInt(url.searchParams.get('w'));
					if (w <= 100) {
						url.searchParams.set('w', '1200');
						changed = true;
					}
				}

				// Remove watermark parameters
				if (url.searchParams.has('image')) {
					url.searchParams.delete('image');
					url.searchParams.delete('gravity');
					url.searchParams.delete('extend-bottom');
					changed = true;
				}

				// Only remove explicit blur parameters if they exist
				if (url.searchParams.has('blur')) {
					url.searchParams.delete('blur');
					changed = true;
				}

				if (changed) {
					img.src = url.toString();
					updatedCount++;
				}
			} catch (e) {}
			img.style.filter = 'none';
		});

		if (updatedCount > 0) {
			console.log(`Mobbin Unblur: Optimized ${updatedCount} images`);
		}
	}

	// Run periodically to handle dynamic content and re-injections
	setInterval(() => {
		removeClutter();
		unblur();
	}, 1000);
})();
