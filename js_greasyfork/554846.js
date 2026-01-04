// ==UserScript==
// @name         Grok Batch Deleter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bulk delete files, share links, and deleted chats from Grok in safe batches. Auto-scrolls to load more, skips your exceptions (e.g., .pdf, "important"), and shows live progress. Fast, smart, and beautiful.
// @author       Vishwas R
// @match        https://grok.com/files*
// @match        https://grok.com/share-links*
// @match        https://grok.com/deleted-conversations*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554846/Grok%20Batch%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/554846/Grok%20Batch%20Deleter.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// UI IDs
	const UI_CONTAINER_ID = 'grok-multi-deleter';
	const PAGE_SELECT_ID = 'grok-page-select';
	const EXT_INPUT_ID = 'grok-ext-input';
	const START_BTN_ID = 'grok-start-btn';
	const STOP_BTN_ID = 'grok-stop-btn';
	const STATUS_ID = 'grok-status';
	const PROGRESS_BAR_ID = 'grok-progress-bar';
	const STATS_ID = 'grok-stats';

	// Delays (ms)
	const HOVER_DELAY = 600;
	const CONFIRM_DELAY = 800;
	const DELETE_DELAY = 1200;
	const SCROLL_DELAY = 1500;

	let isRunning = false;
	let totalDeleted = 0;
	let totalSkipped = 0;
	let pageConfig = {};

	// Page-specific configs
	const PAGE_CONFIGS = {
		files: {
			name: 'Files',
			icon: '📁',
			itemSelector: 'li',
			titleSelector: 'span.flex-1',
			deleteBtnSelector: 'button[aria-label="Delete file"]',
			confirmBtnSelector: 'button[aria-label="Delete"]:not([aria-label="Delete file"])',
			scrollContainer: '#_r_2s_ .overflow-y-auto',
			exceptionType: 'extension',
			placeholder: 'pdf, md, jpg'
		},
		sharelinks: {
			name: 'Share Links',
			icon: '🔗',
			itemSelector: 'li',
			titleSelector: 'span.flex-1, a[href*="/share/"] span',
			deleteBtnSelector: 'button[aria-label="Delete link"]',
			confirmBtnSelector: 'button[aria-label="Delete"]',
			scrollContainer: '#_r_2s_ .overflow-y-auto',
			exceptionType: 'extension',
			placeholder: 'pdf, link'
		},
		deletedchats: {
			name: 'Deleted Chats',
			icon: '💬',
			itemSelector: 'li, div[data-chat-id]',
			titleSelector: 'span.flex-1, .chat-title',
			deleteBtnSelector: 'button[aria-label="Delete chat"], button[aria-label="Permanently delete"]',
			confirmBtnSelector: 'button[aria-label="Delete"], button:has-text("Delete forever")',
			scrollContainer: '#_r_2s_ .overflow-y-auto',
			exceptionType: 'keyword',
			placeholder: 'important, work'
		}
	};

	// Inject custom styles
	function injectStyles() {
		if (document.getElementById('grok-deleter-styles')) return;

		const style = document.createElement('style');
		style.id = 'grok-deleter-styles';
		style.textContent = `
            #${UI_CONTAINER_ID} {
                margin: 16px 0;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .grok-deleter-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                flex-wrap: wrap;
            }

            .credit-link {
                color: #a0a0b0;
                text-decoration: none;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s ease;
                padding: 6px 12px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .credit-link:hover {
                color: #667eea;
                background: rgba(102, 126, 234, 0.1);
                border-color: rgba(102, 126, 234, 0.3);
                transform: translateY(-1px);
            }

            .grok-deleter-title {
                font-size: 18px;
                font-weight: 700;
                color: #fff;
                letter-spacing: 0.3px;
            }
			
			.grok-deleter-description {
				color: #fff;
			}
			
            .grok-deleter-badge {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .grok-deleter-controls {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 16px;
                align-items: center;
                margin-bottom: 16px;
            }

            .grok-control-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .grok-control-label {
                color: #a0a0b0;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }

            .grok-control-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            #${PAGE_SELECT_ID} {
                padding: 12px 16px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                outline: none;
                min-width: 180px;
            }

            #${PAGE_SELECT_ID}:hover {
                border-color: rgba(102, 126, 234, 0.5);
                background: rgba(255, 255, 255, 0.08);
            }

            #${PAGE_SELECT_ID}:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            #${PAGE_SELECT_ID} option {
                background: #1a1a2e;
                color: #fff;
                padding: 12px;
            }

            #${EXT_INPUT_ID} {
                padding: 12px 16px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 14px;
                transition: all 0.3s ease;
                outline: none;
            }

            #${EXT_INPUT_ID}::placeholder {
                color: rgba(255, 255, 255, 0.3);
            }

            #${EXT_INPUT_ID}:hover {
                border-color: rgba(102, 126, 234, 0.5);
                background: rgba(255, 255, 255, 0.08);
            }

            #${EXT_INPUT_ID}:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .grok-button {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #${START_BTN_ID} {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            #${START_BTN_ID}:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            #${START_BTN_ID}:active {
                transform: translateY(0);
            }

            #${STOP_BTN_ID} {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                color: white;
                display: none;
            }

            #${STOP_BTN_ID}:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            }

            .grok-status-panel {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            #${STATUS_ID} {
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #667eea;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            .status-indicator.running {
                background: #51cf66;
                animation: pulse 1s ease-in-out infinite;
            }

            .status-indicator.stopped {
                background: #ff6b6b;
                animation: none;
            }

            #${STATS_ID} {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-top: 12px;
            }

            .stat-box {
                background: rgba(255, 255, 255, 0.05);
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat-value {
                font-size: 24px;
                font-weight: 700;
                color: #667eea;
                display: block;
            }

            .stat-label {
                font-size: 11px;
                color: #a0a0b0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
            }

            .stat-box.deleted .stat-value {
                color: #51cf66;
            }

            .stat-box.skipped .stat-value {
                color: #ffd43b;
            }

            .progress-container {
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 12px;
            }

            #${PROGRESS_BAR_ID} {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
		document.head.appendChild(style);
	}

	// Create UI
	function createUI() {
		if (document.getElementById(UI_CONTAINER_ID)) return;

		const currentPath = window.location.pathname;
		const autoPage = currentPath.includes('/files') ? 'files' : currentPath.includes('/share-links') ? 'sharelinks' : currentPath.includes('/deleted-conversations') ? 'deletedchats' : 'files';
		const config = PAGE_CONFIGS[autoPage];

		const div = document.createElement('div');
		div.id = UI_CONTAINER_ID;

		// Get proper label and title based on page type
		const skipLabel = config.exceptionType === 'extension' ?
			'Skip Extensions' :
			'Skip Keywords';

		const skipTitle = config.exceptionType === 'extension' ?
			`Skip files with these extensions (comma-separated). Example: ${config.placeholder}` :
			`Skip items containing these keywords (comma-separated). Example: ${config.placeholder}`;

		div.innerHTML = `
            <div class="grok-deleter-header">
                <span style="font-size: 24px;">${config.icon}</span>
                <div class="grok-header-content">
                    <div class="grok-header-top">
                        <span class="grok-deleter-title">Grok Batch Deleter</span>
                        <span class="grok-deleter-badge">v1.0</span>
                    </div>
                    <div class="grok-deleter-description">
                        Efficiently delete multiple items across Grok pages (Files, Share Links, Deleted Chats) with smart filtering and auto-scroll capabilities.
                    </div>
                </div>
                <div style="margin-left: auto;">
                    <a href="https://vishwas.me" target="_blank" class="credit-link">
                        Script by Vishwas R
                    </a>
                </div>
            </div>

            <div class="grok-deleter-controls">
                <div class="grok-control-group">
                    <label class="grok-control-label" title="Select which Grok page to perform batch deletion on">
                        Target Page
                    </label>
                    <select id="${PAGE_SELECT_ID}" title="Select which Grok page to perform batch deletion on">
                        <option value="files" ${autoPage === 'files' ? 'selected' : ''}>📁 Files</option>
                        <option value="sharelinks" ${autoPage === 'sharelinks' ? 'selected' : ''}>🔗 Share Links</option>
                        <option value="deletedchats" ${autoPage === 'deletedchats' ? 'selected' : ''}>💬 Deleted Chats</option>
                    </select>
                </div>

                <div class="grok-control-group">
                    <label class="grok-control-label" title="${skipTitle}">
                        ${skipLabel}
                    </label>
                    <input id="${EXT_INPUT_ID}"
                           placeholder="${config.placeholder}"
                           value="${autoPage === 'files' ? 'pdf, md' : autoPage === 'sharelinks' ? 'pdf' : 'important'}"
                           title="${skipTitle}">
                </div>

                <div class="grok-control-group">
                    <label class="grok-control-label" style="opacity: 0;">Action</label>
                    <div style="display: flex; gap: 8px;">
                        <button id="${START_BTN_ID}" class="grok-button" title="Start the batch deletion process">
                            <span>▶</span> Start
                        </button>
                        <button id="${STOP_BTN_ID}" class="grok-button" title="Stop the deletion process immediately">
                            <span>⏹</span> Stop
                        </button>
                    </div>
                </div>
            </div>

            <div class="grok-status-panel">
                <div id="${STATUS_ID}">
                    <span class="status-indicator"></span>
                    <span>Ready to start</span>
                </div>
                <div id="${STATS_ID}">
                    <div class="stat-box deleted">
                        <span class="stat-value" id="deleted-count">0</span>
                        <span class="stat-label">Deleted</span>
                    </div>
                    <div class="stat-box skipped">
                        <span class="stat-value" id="skipped-count">0</span>
                        <span class="stat-label">Skipped</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div id="${PROGRESS_BAR_ID}"></div>
                </div>
            </div>
        `;

		const target = document.querySelector('header, main, body');
		target?.insertBefore(div, target.firstChild);

		document.getElementById(PAGE_SELECT_ID).onchange = updateInputPlaceholder;
		document.getElementById(START_BTN_ID).onclick = () => startBatchDeletion(div);
		document.getElementById(STOP_BTN_ID).onclick = stopDeletion;
	}

	function updateInputPlaceholder() {
		const select = document.getElementById(PAGE_SELECT_ID);
		const input = document.getElementById(EXT_INPUT_ID);
		const config = PAGE_CONFIGS[select.value];

		const skipLabel = config.exceptionType === 'extension' ?
			'Skip Extensions' :
			'Skip Keywords';

		const skipTitle = config.exceptionType === 'extension' ?
			`Skip files with these extensions (comma-separated). Example: ${config.placeholder}` :
			`Skip items containing these keywords (comma-separated). Example: ${config.placeholder}`;

		// Update label
		const labelEl = input.closest('.grok-control-group').querySelector('.grok-control-label');
		if (labelEl) {
			labelEl.textContent = skipLabel;
			labelEl.title = skipTitle;
		}

		input.placeholder = config.placeholder;
		input.value = select.value === 'files' ? 'pdf, md' : select.value === 'sharelinks' ? 'pdf' : 'important';
		input.title = skipTitle;
	}

	async function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function getExceptions(inputValue, exceptionType) {
		return inputValue.split(',').map(e => e.trim().toLowerCase()).filter(e => e);
	}

	function matchesException(title, ext, exceptions, exceptionType) {
		if (exceptionType === 'extension') {
			const fileExt = ext.toLowerCase();
			return exceptions.includes(fileExt);
		} else {
			return exceptions.some(kw => title.toLowerCase().includes(kw));
		}
	}

	function getExtension(title) {
		const match = title.match(/\.([a-z0-9]+)$/i);
		return match ? match[1] : '';
	}

	async function hoverToReveal(element) {
		element.dispatchEvent(new MouseEvent('mouseover', {
			bubbles: true
		}));
		element.dispatchEvent(new MouseEvent('mouseenter', {
			bubbles: true
		}));
		await delay(HOVER_DELAY);
	}

	function getScrollable() {
		let container = document.querySelector(pageConfig.scrollContainer);
		if (!container) container = document.querySelector('#_r_2s_ .overflow-y-auto, .overflow-y-auto');
		return container;
	}

	async function scrollToLoadNext(scrollable) {
		if (!scrollable) return false;
		const oldHeight = scrollable.scrollHeight;
		const oldCount = scrollable.querySelectorAll(pageConfig.itemSelector).length;
		scrollable.scrollTop = scrollable.scrollHeight;
		await delay(SCROLL_DELAY);
		const newHeight = scrollable.scrollHeight;
		const newCount = scrollable.querySelectorAll(pageConfig.itemSelector).length;
		return newHeight > oldHeight || newCount > oldCount;
	}

	async function deleteBatch(exceptions, statusEl, scrollable) {
		const items = Array.from(scrollable.querySelectorAll(pageConfig.itemSelector));
		for (let item of items) {
			if (!isRunning || !document.contains(item)) continue;

			const clickable = item.querySelector('a.group\\/file, a, div[role="button"]') || item;
			if (!clickable) continue;

			const titleEl = clickable.querySelector(pageConfig.titleSelector);
			if (!titleEl) continue;

			const title = titleEl.textContent.trim();
			const ext = getExtension(title);

			if (matchesException(title, ext, exceptions, pageConfig.exceptionType)) {
				totalSkipped++;
				updateStatus(`Skipping: ${title}`, true);
				updateStats();
				continue;
			}

			updateStatus(`Deleting: ${title}`, true);

			await hoverToReveal(clickable);
			const deleteBtn = clickable.querySelector(pageConfig.deleteBtnSelector) || item.querySelector('button[aria-label*="Delete"]');
			if (!deleteBtn) continue;

			deleteBtn.click();
			await delay(CONFIRM_DELAY);

			const confirmBtn = document.querySelector(pageConfig.confirmBtnSelector) || document.querySelector('button[aria-label="Delete"], button:has-text("Delete")');
			if (confirmBtn && confirmBtn.offsetParent !== null) {
				confirmBtn.click();
				totalDeleted++;
				updateStats();
			}

			await delay(DELETE_DELAY);
		}
	}

	function updateStatus(text, running = false) {
		const statusEl = document.getElementById(STATUS_ID);
		const indicator = statusEl.querySelector('.status-indicator');
		statusEl.querySelector('span:last-child').textContent = text;

		if (running) {
			indicator.className = 'status-indicator running';
		} else if (text.includes('Stopped')) {
			indicator.className = 'status-indicator stopped';
		} else {
			indicator.className = 'status-indicator';
		}
	}

	function updateStats() {
		document.getElementById('deleted-count').textContent = totalDeleted;
		document.getElementById('skipped-count').textContent = totalSkipped;

		const total = totalDeleted + totalSkipped;
		if (total > 0) {
			const progress = (totalDeleted / total) * 100;
			document.getElementById(PROGRESS_BAR_ID).style.width = `${progress}%`;
		}
	}

	function stopDeletion() {
		isRunning = false;
		updateStatus('Stopped by user');
		resetUI();
	}

	function resetUI() {
		isRunning = false;
		document.getElementById(START_BTN_ID).style.display = 'flex';
		document.getElementById(STOP_BTN_ID).style.display = 'none';
	}

	async function startBatchDeletion() {
		const select = document.getElementById(PAGE_SELECT_ID);
		pageConfig = PAGE_CONFIGS[select.value];
		const input = document.getElementById(EXT_INPUT_ID);
		const exceptions = getExceptions(input.value, pageConfig.exceptionType);

		if (exceptions.length === 0) {
			alert(`Enter ${pageConfig.exceptionType}s to skip (e.g., ${pageConfig.placeholder})`);
			return;
		}

		isRunning = true;
		totalDeleted = 0;
		totalSkipped = 0;
		updateStats();

		document.getElementById(START_BTN_ID).style.display = 'none';
		document.getElementById(STOP_BTN_ID).style.display = 'flex';

		const scrollable = getScrollable();
		if (!scrollable) {
			updateStatus('Error: Scroll container not found');
			resetUI();
			return;
		}

		updateStatus('Starting batch deletion...', true);

		let noNewFilesCount = 0;
		while (isRunning && noNewFilesCount < 3) {
			await deleteBatch(exceptions, document.getElementById(STATUS_ID), scrollable);

			const loadedMore = await scrollToLoadNext(scrollable);
			if (!loadedMore) {
				noNewFilesCount++;
				updateStatus(`No new items (check ${noNewFilesCount}/3)...`, true);
			} else {
				noNewFilesCount = 0;
				updateStatus('Loaded more items...', true);
			}
		}

		updateStatus(`✓ Complete! Deleted ${totalDeleted}, Skipped ${totalSkipped}`);
		resetUI();
	}

	const init = () => {
		if (document.getElementById('_r_2s_') || document.querySelector('.overflow-y-auto')) {
			injectStyles();
			createUI();
			updateInputPlaceholder();
		} else {
			setTimeout(init, 1000);
		}
	};
	init();
})();