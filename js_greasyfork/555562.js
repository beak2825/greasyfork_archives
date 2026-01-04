// ==UserScript==
// @name         Add Text to Search Field in GHES and jump to lines with specific keywords
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds text to the search field on GHES pages
// @author       chaoscreater
// @match        https://github.asbbank.co.nz/*/*/actions/runs/*/job/*
// @match        https://github.com/*/*/actions/runs/*/job/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555562/Add%20Text%20to%20Search%20Field%20in%20GHES%20and%20jump%20to%20lines%20with%20specific%20keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/555562/Add%20Text%20to%20Search%20Field%20in%20GHES%20and%20jump%20to%20lines%20with%20specific%20keywords.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Function to get the search field (works for both ADO and GHES)
	function getSearchField() {
		// Try GHES GitHub Actions selector first
		let searchField = document.querySelector('.CheckRun-search-input');
		// Fall back to ADO selector
		if (!searchField) {
			searchField = document.querySelector('.find-box input.bolt-textfield-input');
		}
		return searchField;
	}

	// Function to add text to the search field
	function addTextToSearchField() {
		// Try ADO search button
		const searchButton = document.querySelector('button#__bolt-log-search');
		if (searchButton) {
			searchButton.click(); // Click on the search button
			// Wait for a short delay to ensure the search field is fully populated
			setTimeout(() => {
				const searchField = getSearchField();

				if (searchField) {
					// set the input value using the native setter
					const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
					nativeInputValueSetter.call(searchField, 'to add');

					// Dispatch an input event to simulate user input
					searchField.dispatchEvent(new Event('input', {
						bubbles: true
					}));
				}
			}, 1000); // Adjust delay time as needed
		}
	}

	// Function to append the buttons with CSS styling
	function appendButtons() {
		const button = createButton('Jump to Terraform action start', 'green', Terraform_action_start_handleButtonClick, 'jumpToTerraformActionStart', '990px');
		const button2 = createButton('Jump to Plan line', 'orange', Terraform_plan_line_handleButtonClick, 'jumpToPlanLine', '1213px');
		const button3 = createButton('Jump to No Changes', 'orange', Terraform_plan_no_changes_line_handleButtonClick, 'jumpToNoChanges', '1350px');
		document.body.appendChild(button);
		document.body.appendChild(button2);
		document.body.appendChild(button3);
	}

	// Function to create a button with specified properties
	function createButton(text, color, clickHandler, id, left) {
		const button = document.createElement('button');
		button.textContent = text;
		button.style.position = 'fixed';
		button.style.top = '100px'; // Adjusted top position
		button.style.left = left;
		button.style.zIndex = '9999';
		button.style.backgroundColor = color;
		button.setAttribute('data-button-id', id);
		button.addEventListener('click', clickHandler);
		return button;
	}

	// Function to remove the appended buttons
	function removeButtons() {
		const buttons = document.querySelectorAll('button[data-button-id="jumpToTerraformActionStart"], button[data-button-id="jumpToPlanLine"], button[data-button-id="jumpToNoChanges"]');
		buttons.forEach(button => button.remove());
	}

	// Function to expand the search button
	function expandSearchButton() {
		const searchButton = document.querySelector('button[data-is-focusable="true"][aria-label="Search phrases"]');
		if (searchButton) {
			setTimeout(() => {
				searchButton.click(); // Click on the search button to expand it
			}, 1200);
		}
	}

	// Function to handle button click event
	function Terraform_action_start_handleButtonClick() {
		const searchField = getSearchField();
		if (searchField) {
			searchField.focus(); // Focus on the search field
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			nativeInputValueSetter.call(searchField, 'Terraform will perform the following actions:');

			// Dispatch an input event to simulate user input
			searchField.dispatchEvent(new Event('input', {
				bubbles: true
			}));
		}
	}

	// Function to handle button click event
	function Terraform_plan_line_handleButtonClick() {
		const searchField = getSearchField();
		if (searchField) {
			searchField.focus(); // Focus on the search field
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			nativeInputValueSetter.call(searchField, 'to add');

			// Dispatch an input event to simulate user input
			searchField.dispatchEvent(new Event('input', {
				bubbles: true
			}));
		}
	}

	// Function to handle button click event
	function Terraform_plan_no_changes_line_handleButtonClick() {
		const searchField = getSearchField();
		if (searchField) {
			searchField.focus(); // Focus on the search field
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			nativeInputValueSetter.call(searchField, 'No changes.');

			// Dispatch an input event to simulate user input
			searchField.dispatchEvent(new Event('input', {
				bubbles: true
			}));
		}
	}

	// Function to check if current URL matches the @match patterns
	function isMatchingUrl() {
		const pathname = window.location.pathname;
		// Match pattern: /*/*/actions/runs/*/job/*
		const pattern = /^\/[^/]+\/[^/]+\/actions\/runs\/[^/]+\/job\/[^/]+/;
		return pattern.test(pathname);
	}

	// Initialize: Wait for page to load, then append buttons
	function init() {
		// Check if we're on a matching GitHub Actions job page
		if (isMatchingUrl()) {
			// Wait a bit for the page to fully load
			setTimeout(() => {
				appendButtons();
			}, 1500);
		} else {
			// Remove buttons if they exist but we're not on a matching page
			removeButtons();
		}
	}

	// Monitor URL changes for single-page navigation
	let lastUrl = window.location.href;
	const urlObserver = new MutationObserver(() => {
		const currentUrl = window.location.href;
		if (currentUrl !== lastUrl) {
			lastUrl = currentUrl;
			// Re-run init when URL changes
			init();
		}
	});

	// Start observing URL changes
	urlObserver.observe(document.body, {
		childList: true,
		subtree: true
	});

	// Run initialization when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();