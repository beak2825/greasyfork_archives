// ==UserScript==
// @name         Next Button Auto-Clicker for SCORM Player
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Auto-click Next button at random intervals (starts paused)
// @match        *://*/*scorm*/player.php*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553762/Next%20Button%20Auto-Clicker%20for%20SCORM%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/553762/Next%20Button%20Auto-Clicker%20for%20SCORM%20Player.meta.js
// ==/UserScript==

(function() {
	"use strict";

	// Configuration constants

	// Minimum delay between clicks in milliseconds
	const MIN_MS = 1 * 60 * 1000; // 1 minute

	// Maximum delay between clicks in milliseconds
	const MAX_MS = 5 * 60 * 1000; // 5 minutes

	// Utility: Wait for an element to appear in the DOM
	function waitForElement(selector, root = document, interval = 500, timeout = 15000) {
		return new Promise((resolve, reject) => {
			const start = Date.now();
			const timer = setInterval(() => {
				const el = root.querySelector(selector);
				if (el) {
					clearInterval(timer);
					resolve(el);
				}
				else if (Date.now() - start > timeout) {
					clearInterval(timer);
					reject(new Error("Element " + selector + " not found within timeout"));
				}
			}, interval);
		});
	}

	// Main function
	async function init() {
		try {
			// Wait for the iframe to load
			const iframe = await waitForElement("iframe");
			let iframeDoc;

			try {
				iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
			}
			catch (e) {
				console.error("Cannot access iframe content (cross-origin?)", e);
				return;
			}

			// Wait for the "Next" button inside the iframe
			const nextButton = await waitForElement(".navigation-controls__button_next", iframeDoc);
			console.log("Next button found! Ready to auto-click.");

			// Create UI container
			const container = document.createElement("div");
			container.style.position = "fixed";
			container.style.bottom = "10px";
			container.style.right = "10px";
			container.style.backgroundColor = "rgba(0,0,0,.7)";
			container.style.color = "white";
			container.style.padding = "5px 10px";
			container.style.borderRadius = "5px";
			container.style.fontFamily = "Arial, sans-serif";
			container.style.zIndex = 9999;
			container.style.fontSize = "14px";
			container.style.display = "flex";
			container.style.alignItems = "center";
			container.style.gap = "10px";
			document.body.appendChild(container);

			// Countdown element
			const timerDiv = document.createElement("div");
			timerDiv.textContent = "Click here ➔";
			container.appendChild(timerDiv);

			// Play / Pause button
			const toggleBtn = document.createElement("button");
			toggleBtn.textContent = "Play";
			toggleBtn.style.cursor = "pointer";
			toggleBtn.style.padding = "2px 6px";
			toggleBtn.style.border = "none";
			toggleBtn.style.borderRadius = "3px";
			toggleBtn.style.backgroundColor = "#7dc353";
			toggleBtn.style.color = "white";
			container.appendChild(toggleBtn);

			// Function to simulate a full button click
			function simulateButtonClick(button) {
				button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
				button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
				button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
				button.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
				button.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
			}

			// State variables
			let paused = true;
			let remaining = 0;
			let countdownInterval = null;
			let timeoutHandle = null;

			// Play / Pause button click handler
			toggleBtn.addEventListener("click", () => {
				paused = !paused;
				
				if (paused) {
					toggleBtn.textContent = "Play";
					toggleBtn.style.backgroundColor = "#7dc353"; 
				}
				else {
					toggleBtn.textContent = "Pause";
					toggleBtn.style.backgroundColor = "#d9534f";
				}
				
				if (paused) {
					// Stop countdown and scheduled click
					clearInterval(countdownInterval);
					clearTimeout(timeoutHandle);
				}
				else {
					// Resume or start the auto-clicker
					scheduleRandomClick(nextButton, remaining * 1000);
				}
			});

			// Schedule a random click with countdown
			function scheduleRandomClick(button, customDelay = null) {

				// Determine delay (random or use custom)
				const delay = customDelay !== null ? customDelay : Math.floor(Math.random() * (MAX_MS - MIN_MS + 1)) + MIN_MS;
				remaining = Math.ceil(delay / 1000);

				// Clear any existing countdown interval
				clearInterval(countdownInterval);
				countdownInterval = setInterval(() => {
					remaining--;
					timerDiv.textContent = "Next click in: " + remaining + "s";
					if (remaining <= 0) clearInterval(countdownInterval);
				}, 1000);

				// Schedule the click
				timeoutHandle = setTimeout(() => {
					if (!paused) {
						simulateButtonClick(button);
						console.log("Clicked Next button at " + new Date().toLocaleTimeString());
						scheduleRandomClick(button);
					}
				}, delay);
			}

		}
		catch (e) {
			console.error(e);
		}
	}

	init();
})();