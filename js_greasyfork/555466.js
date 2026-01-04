// ==UserScript==
// @name         Autosbc keybinds
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds CSS on load, focuses button, and overrides space/enter keys
// @author ronkzinho
// @match https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555466/Autosbc%20keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/555466/Autosbc%20keybinds.meta.js
// ==/UserScript==

(function () {
	"use strict";

	let PRIORITY = [
		"84+ TOTW 1-30 Player Pack",
		"10x 85+ Rare Gold Players Pack",
		"10x 84+ Rare Gold Players Pack",
		"20x 83+ Rare Gold Players Pack",
		"50 Players Pack",
	];
	let latestPackTitle = null; // Store the latest pack title
	let shouldAutoClickSBC = false; // Flag to auto-click SBC button when ready
	let shouldGoToStore = false;
	let shouldRecycle = false;
	let lastFocusedButtonIndex = 0; // Store the index of the last focused button

	// Function to simulate real mouse click
	function simulateMouseClick(element) {
		const rect = element.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;

		const mouseDownEvent = new MouseEvent("mousedown", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: x,
			clientY: y,
			button: 0,
		});

		const mouseUpEvent = new MouseEvent("mouseup", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: x,
			clientY: y,
			button: 0,
		});

		const clickEvent = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: x,
			clientY: y,
			button: 0,
		});

		// Dispatch events in proper sequence
		element.dispatchEvent(mouseDownEvent);
		element.dispatchEvent(mouseUpEvent);
		element.dispatchEvent(clickEvent);
	}

	// Function to auto-focus the remembered button in standard dialog
	function autoFocusStandardDialogButton(standardDialog) {
		const buttons = standardDialog.querySelectorAll(".btn-standard");
		if (buttons.length > 0) {
			// Use the remembered index, but fallback to 0 if out of bounds
			const targetIndex = Math.min(lastFocusedButtonIndex, buttons.length - 1);
			const buttonToFocus = buttons[targetIndex];

			if (buttonToFocus) {
				setTimeout(() => {
					buttonToFocus.focus();
				}, 50); // Small delay to ensure dialog is fully rendered
			}
		}
	}

	// Function to track focus changes in standard dialog
	function trackButtonFocus(standardDialog) {
		const buttons = standardDialog.querySelectorAll(".btn-standard");
		buttons.forEach((button, index) => {
			button.addEventListener("focus", function () {
				lastFocusedButtonIndex = index;
			});
		});
	}

	// Function to handle the auto-sbc-recycle-submit button
	function handleAutoSBCButton(btn) {
		// Always check if we should auto-click this button when it appears
		if (shouldAutoClickSBC) {
			// Directly click the button immediately
			simulateMouseClick(btn);
			shouldAutoClickSBC = false; // Reset flag
		}
	}

	function handleMenu() {
		let targetPack = document.querySelector(
			`.ut-store-pack-details-view[data-title="${latestPackTitle}"]`
		);

		// If not found, try priority packs
		if (!targetPack) {
			for (const title of PRIORITY) {
				targetPack = document.querySelector(
					`.ut-store-pack-details-view[data-title="${title}"]`
				);
				if (targetPack) break;
			}
		}

		// If still not found, use the first available pack details view
		if (!targetPack) {
			targetPack = document.querySelector(".ut-store-pack-details-view");
		}

		if (targetPack) {
			const button = targetPack.querySelector(".currency.call-to-action");
			if (button) {
				simulateMouseClick(button);
			}
		}
		return;
	}

	function goToStore() {
		const storeButton = document.querySelector(
			".ut-tab-bar .ut-tab-bar-item.icon-store"
		);

		if (!storeButton) return;

		simulateMouseClick(storeButton);
	}

	function handleAutoRecycle() {
		const recyleButton = document.querySelector(
			".ut-content .btn-standard.autosbc-header-button"
		);

		if (
			shouldRecycle &&
			document.querySelector(".ut-unassigned-view").children.length === 1 &&
			document.querySelector(".sectioned-item-list.storage-duplicates")
		) {
			simulateMouseClick(recyleButton);
			shouldRecycle = false;
		}
	}

	function handleEmptyUnassigned() {
		// Always check if we should auto-click this button when it appears
		if (shouldGoToStore) {
			goToStore();
			shouldGoToStore = false; // Reset flag
		}
	}

	// Define allowed keys
	const allowedKeys = new Set([
		"KeyR",
		"KeyK",
		"Digit1",
		"Digit2",
		"Digit3",
		"Digit4",
		"Digit5",
		"Digit6",
		"Digit7",
		"Digit8",
		"Digit9",
	]);

	// Main keyboard handler - centralized logic
	document.addEventListener(
		"keydown",
		function (e) {
			const code = e.code;

			// Early return if key is not in our allowed set
			if (!allowedKeys.has(code)) return;

			// Get current screen state
			const standardDialog = document.querySelector(
				".ea-dialog-view.ea-dialog-view-type--standard"
			);
			const messageDialog = document.querySelector(
				".ea-dialog-view.ea-dialog-view-type--message"
			);
			const packDetailsView = document.querySelector(
				".ut-store-pack-details-view.is-untradeable"
			);
			const autoSBCButton = document.querySelector("#auto-sbc-recycle-submit");
			const itemsListDialog = document.querySelector(".itemList");

			// Check visibility
			const isStandardDialogVisible =
				standardDialog && standardDialog.offsetParent !== null;
			const isMessageDialogVisible =
				messageDialog && messageDialog.offsetParent !== null;
			const isPackDetailsVisible =
				packDetailsView && packDetailsView.offsetParent !== null;
			const isAutoSBCVisible =
				autoSBCButton && autoSBCButton.offsetParent !== null;
			const isItemsListDialogVisible =
				itemsListDialog && itemsListDialog.offsetParent !== null;

			// Priority order: Message Dialog > Standard Dialog > Auto SBC > Pack Details

			// 1. Message Dialog handling
			if (isMessageDialogVisible && (code === "KeyR" || code === "KeyK")) {
				const okButton = messageDialog.querySelector(
					".ut-st-button-group button:not(.negative)"
				);
				if (okButton) {
					e.preventDefault();
					e.stopImmediatePropagation();
					simulateMouseClick(okButton);
				}
				return;
			}

			// 2. Standard Dialog handling
			if (isStandardDialogVisible && !isAutoSBCVisible) {
				const buttons = standardDialog.querySelectorAll(".btn-standard");

				// Number keys (Digit1-9)
				if (code.startsWith("Digit")) {
					const keyNum = parseInt(code.replace("Digit", ""));
					if (keyNum >= 1 && keyNum <= 9) {
						const buttonIndex = keyNum - 1;
						if (buttons[buttonIndex]) {
							e.preventDefault();
							e.stopImmediatePropagation();

							if (e.shiftKey) {
								lastFocusedButtonIndex = buttonIndex;
								console.log(buttonIndex);
							}

							// Remember which button was focused before the click
							const previouslyFocusedButton = buttons[lastFocusedButtonIndex];

							simulateMouseClick(buttons[buttonIndex]);

							// Restore focus to the previously focused button after a short delay
							setTimeout(() => {
								if (
									previouslyFocusedButton &&
									document.contains(previouslyFocusedButton)
								) {
									previouslyFocusedButton.focus();
								}
							}, 10);
						}
					}
					return;
				}

				if (code === "KeyR" || code === "KeyK") {
					const focusedButton = standardDialog.querySelector(
						".btn-standard:focus"
					);
					const targetButton = focusedButton || buttons[0];

					if (targetButton) {
						e.preventDefault();
						e.stopImmediatePropagation();
						simulateMouseClick(targetButton);

						// If K was pressed, set flag for auto SBC button click
						if (code === "KeyK" || code === "KeyR") {
							shouldAutoClickSBC = true;
						}
					}
					return;
				}
			}

			// 3. Auto SBC handling (when #auto-sbc-recycle-submit is visible)
			if (isAutoSBCVisible && (code === "KeyR" || code === "KeyK")) {
				e.preventDefault();
				e.stopImmediatePropagation();
				simulateMouseClick(autoSBCButton);
				shouldGoToStore = true;
				return;
			}

			// 4. Pack Details handling
			if (isPackDetailsVisible && (code === "KeyR" || code === "KeyK")) {
				e.preventDefault();
				e.stopImmediatePropagation();
				handleMenu();
				shouldGoToStore = true;
				return;
			}

			if (isItemsListDialogVisible && (code === "KeyR" || code === "KeyK")) {
				e.preventDefault();
				const hasDuplicates = !!document.querySelector(
					".sectioned-item-list.storage-duplicates"
				);
				const hasUnassignedAndDuplicates =
					document.querySelector(".ut-unassigned-view").children.length === 2;

				const sendOrRecycle = document.querySelector(
					".ut-content .btn-standard.autosbc-header-button"
				);

				if (
					(hasDuplicates && code === "KeyR" && !hasUnassignedAndDuplicates) ||
					!sendOrRecycle
				)
					return;

				simulateMouseClick(sendOrRecycle);

				if (hasDuplicates && !hasUnassignedAndDuplicates) return;

				if (hasUnassignedAndDuplicates) {
					e.stopImmediatePropagation();
					shouldRecycle = true;
				}

				shouldGoToStore = true;
				return;
			}
		},
		true
	);

	// Add global click listener to store pack title when currency button is clicked
	document.addEventListener(
		"click",
		function (e) {
			if (
				e.target.matches(".currency.call-to-action") ||
				e.target.closest(".currency.call-to-action")
			) {
				const button = e.target.matches(".currency.call-to-action")
					? e.target
					: e.target.closest(".currency.call-to-action");
				const packDetailsView = button.closest(
					".ut-store-pack-details-view.is-untradeable"
				);

				if (packDetailsView) {
					latestPackTitle = packDetailsView.getAttribute("data-title");
				}
			}
		},
		true
	);

	// Watch for the auto-sbc-recycle-submit button to be added to the DOM
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			mutation.addedNodes.forEach(function (node) {
				if (node.nodeType === 1) {
					// Element node
					// Check if the added node is our target
					if (node.id === "auto-sbc-recycle-submit") {
						handleAutoSBCButton(node);
					}
					// Check if our target is a descendant of the added node
					else if (node.querySelector) {
						const btn = node.querySelector("#auto-sbc-recycle-submit");
						if (btn) {
							handleAutoSBCButton(btn);
						}
					}

					if (node.matches && node.matches(".ut-no-results-view")) {
						handleEmptyUnassigned();
					}
					// Check if our target is a descendant of the added node
					else if (
						node.querySelector &&
						node.querySelector(".ut-no-results-view")
					) {
						handleEmptyUnassigned();
					}

					if (node.matches && node.matches(".sectioned-item-list")) {
						handleAutoRecycle();
					}
					// Check if our target is a descendant of the added node
					else if (
						node.querySelector &&
						node.querySelector(".sectioned-item-list")
					) {
						handleAutoRecycle(node);
					}

					// Check for standard dialog appearance
					if (
						node.matches &&
						node.matches(".ea-dialog-view.ea-dialog-view-type--standard")
					) {
						autoFocusStandardDialogButton(node);
						trackButtonFocus(node);
					}
					// Check if standard dialog is a descendant of the added node
					else if (node.querySelector) {
						const standardDialog = node.querySelector(
							".ea-dialog-view.ea-dialog-view-type--standard"
						);
						if (standardDialog) {
							autoFocusStandardDialogButton(standardDialog);
							trackButtonFocus(standardDialog);
						}
					}
				}
			});
		});
	});

	// Start observing immediately
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
})();
