// ==UserScript==
// @name         [mobile-optimized] ChatGPT Conversation Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mobile-first script which exports the full contents of a chat-gpt conversation as JSON, plaintext, or a zip file containing both.
// @author       rASTROco Labs, with input/assistance from OpenAI via ChatGPT
// @match        https://*.chatgpt.com/*
// @grant        download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548538/%5Bmobile-optimized%5D%20ChatGPT%20Conversation%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/548538/%5Bmobile-optimized%5D%20ChatGPT%20Conversation%20Exporter.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// -----------------------------
	// Wait for a selector
	// -----------------------------
	function waitForSelector(selector, timeout = 10000) {
		return new Promise((resolve, reject) => {
			const start = Date.now();
			const interval = setInterval(() => {
				const el = document.querySelector(selector);
				if (el) {
					clearInterval(interval);
					resolve(el);
				} else if (Date.now() - start > timeout) {
					clearInterval(interval);
					reject(`Selector ${selector} not found`);
				}
			},
				300);
		});
	}

	// -----------------------------
	// Create mobile export button
	// -----------------------------
	function createExportButton() {
		const exportBtn = document.createElement("button");
		exportBtn.id = "chat-export-btn";
		exportBtn.innerHTML = `
		<div style="
		width: 20px;
		height: 16px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: auto;
		">
		<span style="display:block;height:2px;width:100%;background:white;border-radius:1px;"></span>
		<span style="display:block;height:2px;width:100%;background:white;border-radius:1px;"></span>
		<span style="display:block;height:2px;width:100%;background:white;border-radius:1px;"></span>
		</div>
		`;

		exportBtn.style.cssText = `
		background-color: #2b2b2b; /* dark grey */
		border: none;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		z-index: 9999;
		position: fixed;
		bottom: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		box-shadow: 0 2px 8px rgba(0,0,0,0.4);
		transition: opacity 0.5s ease, transform 0.2s ease;
		opacity: 1;
		touch-action: none;
		`;

		document.body.appendChild(exportBtn);

		makeDraggable(exportBtn);
		addFadeEffect(exportBtn);
		exportBtn.addEventListener('click', exportChatSequence, {
			passive: true
		});
	}

	// -----------------------------
	// Mobile drag with corner snapping, viewport clamping, haptics
	// -----------------------------

	function makeDraggable(el) {
		let dragging = false;
		let touchOffsetX = 0;
		let touchOffsetY = 0;

		// Initialize at bottom-right corner
		el.style.position = "fixed";
		el.style.left = (window.innerWidth - el.offsetWidth - 20) + "px";
		el.style.top = (window.innerHeight - el.offsetHeight - 20) + "px";

		el.addEventListener('touchstart', function(e) {
			const touch = e.touches[0];
			const rect = el.getBoundingClientRect();
			touchOffsetX = touch.clientX - rect.left;
			touchOffsetY = touch.clientY - rect.top;
			dragging = false;
			el.style.transition = "none";
		}, {
			passive: false
		});

		el.addEventListener('touchmove', function(e) {
			e.preventDefault();
			const touch = e.touches[0];
			let newX = touch.clientX - touchOffsetX;
			let newY = touch.clientY - touchOffsetY;

			// Clamp to viewport
			const maxX = window.innerWidth - el.offsetWidth - 5;
			const maxY = window.innerHeight - el.offsetHeight - 5;
			newX = Math.min(Math.max(5, newX),
				maxX);
			newY = Math.min(Math.max(5, newY),
				maxY);

			el.style.left = newX + "px";
			el.style.top = newY + "px";
			dragging = true;
			el.style.opacity = "1";
		}, {
			passive: false
		});

		el.addEventListener('touchend', function(e) {
			if (!dragging) return;

			const rect = el.getBoundingClientRect();
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			// Decide nearest corner
			const snapLeft = (centerX < screenWidth / 2);
			const snapTop = (centerY < screenHeight / 2);

			const targetX = snapLeft ? 10: (screenWidth - rect.width - 10);
			const targetY = snapTop ? 10: (screenHeight - rect.height - 10);

			el.style.transition = "left 0.2s ease, top 0.2s ease";
			el.style.left = targetX + "px";
			el.style.top = targetY + "px";

			// Haptic feedback
			if (navigator.vibrate) {
				navigator.vibrate(20);
			}

			setTimeout(() => {
				el.style.transition = "opacity 0.5s ease, left 0.2s ease, top 0.2s ease";
			}, 250);
		},
			{
				passive: false
			});
	}

	// -----------------------------
	// Fade effect for idle
	// -----------------------------
	function addFadeEffect(el,
		idleTime = 3000) {
		let fadeTimer;

		const setFade = () => {
			el.style.opacity = "0.3";
		};
		const resetFade = () => {
			el.style.opacity = "1";
			clearTimeout(fadeTimer);
			fadeTimer = setTimeout(setFade,
				idleTime);
		};

		['touchstart', 'touchend', 'touchmove'].forEach(evt => {
			el.addEventListener(evt, resetFade, {
				passive: true
			});
		});

		resetFade();
	}

	// -----------------------------
	// Toolbar observer
	// -----------------------------
	async function observeToolbar() {
		const container = await waitForSelector("div[class*='flex'][class*='gap']");
		const observer = new MutationObserver(() => {
			if (!document.querySelector("#chat-export-btn")) {
				createExportButton();
			}
		});
		observer.observe(container,
			{
				childList: true,
				subtree: true
			});
	}

	// -----------------------------
	// Scroll and extract messages
	// -----------------------------
	async function scrollToTopDynamic(delay = 500) {
		const scrollable = document.querySelector("main");
		if (!scrollable) return;
		let previousHeight = -1,
		stableCount = 0;
		while (stableCount < 3) {
			const currentHeight = scrollable.scrollHeight;
			scrollable.scrollTop = 0;
			await new Promise(r => setTimeout(r, delay));
			stableCount = (currentHeight === previousHeight) ? stableCount+1: 0;
			previousHeight = currentHeight;
		}
	}

	function extractMessages() {
		const messages = [];
		const messageDivs = document.querySelectorAll("div[class*='group']");
		messageDivs.forEach((div, idx) => {
			let content = Array.from(div.childNodes).map(n => {
				if (n.nodeType === Node.TEXT_NODE) return n.nodeValue;
				if (n.nodeType === Node.ELEMENT_NODE) {
					if (n.tagName === 'PRE') {
						const codeLang = n.getAttribute('data-lang') || '';
						return `\`\`\`${codeLang}\n${n.innerText}\n\`\`\``;
					}
					return n.innerText;
				}
				return '';
			}).join('\n').trim();
			if (!content) return;
			let role = /^(you|user):/i.test(content)?'user': (/^(chatgpt|assistant):/i.test(content)?'assistant': idx%2 === 0?'user': 'assistant');
			const timeEl = div.querySelector("time");
			const timestamp = timeEl ? (timeEl.getAttribute("datetime") || timeEl.innerText): null;
			content = content.replace(/([^\n])\n{3,}/g, '$1\n\n');
			messages.push({
				role, content, ...(timestamp && {
					timestamp
				})
			});
		});
		return messages;
	}

	// -----------------------------
	// Download helpers
	// -----------------------------
	function downloadJSON(data,
		filename = "chat_export.json") {
		const blob = new Blob([JSON.stringify(data, null, 2)],
			{
				type: "application/json"
			});
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = filename;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function downloadPlaintext(data,
		filename = "chat_export.txt") {
		let text = '';
		data.forEach(msg => {
			const ts = msg.timestamp ? ` [${msg.timestamp}]`: '';
			text += `${msg.role.toUpperCase()}${ts}:\n${msg.content}\n\n`;
		});
		const blob = new Blob([text],
			{
				type: "text/plain"
			});
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = filename;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	async function downloadZip(data,
		filename = "chat_export.zip") {
		if (typeof JSZip === 'undefined') {
			await new Promise(resolve => {
				const s = document.createElement("script");
				s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
				s.onload = resolve;
				document.head.appendChild(s);
			});
		}
		const zip = new JSZip();
		zip.file("chat_export.json", JSON.stringify(data, null, 2));
		let text = '';
		data.forEach(msg => {
			const ts = msg.timestamp?` [${msg.timestamp}]`: '';
			text += `${msg.role.toUpperCase()}${ts}:\n${msg.content}\n\n`;
		});
		zip.file("chat_export.txt", text);
		const blob = await zip.generateAsync({
			type: "blob"
		});
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = filename;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	// -----------------------------
	// Export sequence
	// -----------------------------
	async function exportChatSequence() {
		try {
			if (!confirm("This will load the entire conversation for export. Continue?")) return;
			await scrollToTopDynamic();
			const messages = extractMessages();
			const choice = prompt("Export options:\n1=JSON (default)\n2=Plaintext\n3=ZIP (JSON+Plaintext)\n\nEnter choice number:", "1");
			switch (choice) {
				case "2": downloadPlaintext(messages); alert(`Plaintext export complete: ${messages.length} messages saved.`); break;
				case "3": await downloadZip(messages); alert(`ZIP export complete: ${messages.length} messages saved.`); break;
				default: downloadJSON(messages); alert(`JSON export complete: ${messages.length} messages saved.`);
				}
			} catch(err) {
				console.error("Error during export:", err);
				alert("Failed to export chat. See console for details.");
			}
		}

		// -----------------------------
		// Initialize
		// -----------------------------
		createExportButton();
		observeToolbar();
	})();