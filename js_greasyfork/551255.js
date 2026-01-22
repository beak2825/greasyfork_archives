// ==UserScript==
// @name         Decluttered YouTube Search
// @namespace    http://github.com/dv-001
// @version      0.1.2
// @description  Remove irrelevant/extraneous items from YouTube search results with a toggleable menu.
// @author       dv-001
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @supportURL   https://github.com/dv-001/userscripts/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551255/Decluttered%20YouTube%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/551255/Decluttered%20YouTube%20Search.meta.js
// ==/UserScript==

(function () {
	'use strict';

	/* --- Configuration & State --- */

	// Easy-to-update selectors for various elements (since YouTube changes them often)
	const SELECTORS = {
		// 'People also search for', 'For you', etc.
		shelves: [
			'ytd-shelf-renderer',
			'ytd-horizontal-card-list-renderer[card-list-style=HORIZONTAL_CARD_LIST_STYLE_TYPE_NARROW_SHELF]'
		],
		// Rows of shorts
		shortsGrid: 'grid-shelf-view-model',
		// Individual shorts
		shorts: 'ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])',
		// Watched videos
		watched: 'ytd-thumbnail-overlay-resume-playback-renderer #progress',
		// YouTube search bar
		searchbox: 'yt-searchbox'
	};

	const CONFIG = {
		hideShelves: GM_getValue('hideShelves', true),
		hideShortsGrid: GM_getValue('hideShortsGrid', true),
		hideShorts: GM_getValue('hideShorts', false),
		hideWatchedVideos: GM_getValue('hideWatchedVideos', false),
		watchedPercentage: GM_getValue('watchedPercentage', 90)
	};

	function updateConfig(key, value) {
		CONFIG[key] = value;
		GM_setValue(key, value);
		updateStyles(CONFIG);
	}

	/* --- Main Logic --- */

	// Our `<style>` element that will be injected into the page head
	const styleElement = document.createElement('style');
	styleElement.id = 'dyts-style';
	document.head.appendChild(styleElement);

	// Function to generate CSS rules based on current settings
	function updateStyles(config) {
		let css = '';
		if (config.hideShelves) {
			css += `${SELECTORS.shelves.join(', ')} { display: none !important; }\n`;
		}
		if (config.hideShortsGrid) {
			css += `${SELECTORS.shortsGrid} { display: none !important; }\n`;
		}
		if (config.hideShorts) {
			css += `${SELECTORS.shorts} { display: none !important; }\n`;
		}
		if (config.hideWatchedVideos) {
			let percentage = config.watchedPercentage;
			if (percentage && (percentage >= 1 && percentage <= 100)) {
				for (let i = percentage; i <= 100; i++) {
					css += `ytd-video-renderer:has(${SELECTORS.watched}[style*='width: ${i}%;']) `
						+ `{ display: none !important; }\n`;
				}
			}
		}
		styleElement.textContent = css;
	}

	function createSettingsUI() {
		if (document.getElementById('dyts-settings-container')) {
			return;
		}

		const container = document.createElement('div');
		container.id = 'dyts-settings-container';
		container.style.position = 'relative';

		// Button to open settings UI
		const gearButton = document.createElement('button');
		gearButton.id = 'dyts-settings-button';


		// Gear icon
		const gearSvgPath = 'M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z';
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
		svg.setAttribute('focusable', 'false');
		svg.style.pointerEvents = 'none';
		svg.style.display = 'block';
		svg.style.width = '100%';
		svg.style.height = '100%';
		const path = document.createElementNS(svgNS, 'path');
		path.setAttribute('clip-rule', 'evenodd');
		path.setAttribute('fill-rule', 'evenodd');
		path.setAttribute('d', gearSvgPath);

		svg.appendChild(path);
		gearButton.appendChild(svg);

		// Settings panel
		const panel = document.createElement('div');
		panel.id = 'dyts-settings-panel';
		// FIX: Explicitly set initial display state
		panel.style.display = 'none';

		const optionLabels = {
			hideShelves: 'Hide shelves (For You, People Also Watched, etc.)',
			hideShortsGrid: 'Hide Shorts grids',
			hideShorts: 'Hide individual Shorts',
			hideWatchedVideos: 'Hide videos more than'
		};

		for (const key in CONFIG) {
			if (typeof CONFIG[key] != 'boolean') {
				continue;
			}

			const row = document.createElement('div');
			row.className = 'dyts-setting-row';
			if (CONFIG[key]) {
				row.classList.add('dyts-setting-enabled');
			} else {
				row.classList.add('dyts-setting-disabled');
			}

			const label = document.createElement('label');

			const checkbox = document.createElement('input');
			checkbox.name = `dyts-checkbox-${key}`
			checkbox.type = 'checkbox';
			checkbox.checked = CONFIG[key];
			checkbox.dataset.key = key;
			checkbox.style.marginRight = '8px';

			checkbox.addEventListener('change', (e) => {
				updateConfig(e.target.dataset.key, e.target.checked);
				updateStyles(CONFIG);
			});

			label.appendChild(checkbox);
			label.append(optionLabels[key] || key);

			// Special logic for watched video percentage input
			if (key === 'hideWatchedVideos') {
				const percentageInput = document.createElement('input');
				percentageInput.disabled = !CONFIG.hideWatchedVideos;
				percentageInput.name = 'dyts-input-watched-percentage';
				percentageInput.type = 'number';
				percentageInput.min = '1';
				percentageInput.max = '100';
				percentageInput.value = CONFIG.watchedPercentage.toString();
				percentageInput.addEventListener('input', (e) => {
					const value = parseInt(e.target.value, 10);
					if (!isNaN(value) && value >= 1 && value <= 100) {
						updateConfig('watchedPercentage', value);
					}
				});

				const afterPercentageText = document.createElement('span');
				afterPercentageText.textContent = 'percent watched';

				label.appendChild(percentageInput);
				label.appendChild(afterPercentageText);

				// Update the input's disabled state when checkbox changes
				checkbox.addEventListener('change', (e) => {
					percentageInput.disabled = !e.target.checked;
				});
			}

			row.appendChild(label);
			panel.appendChild(row);
		}

		let panelVisible = false;

		gearButton.addEventListener('click', (e) => {
			e.stopPropagation();
			panelVisible = !panelVisible;
			panel.style.display = panelVisible ? 'flex' : 'none';
		});
		// Don't hide when clicking inside the panel
		panel.addEventListener('click', (e) => e.stopPropagation());
		document.addEventListener('click', () => {
			// Hide when clicking anywhere else
			panelVisible = false;
			panel.style.display = 'none';
		});

		// Insert the settings button next to the search bar
		container.appendChild(gearButton);
		container.appendChild(panel);
		const searchbox = document.querySelector(SELECTORS.searchbox);
		if (searchbox) {
			searchbox.appendChild(container);
		}
	}

	function removeSettingsUI() {
		const ui = document.getElementById('dyts-settings-container');
		if (ui) {
			ui.remove();
		}
	}

	// This function checks the URL and decides whether to add the gear/UI.
	// The stylesheet is always active, regardless of the page.
	function onPageChange() {
		const isSearchPage = window.location.pathname === '/results';
		if (isSearchPage) {
			// Use a small delay or an interval to wait for the search box to be ready
			const interval = setInterval(() => {
				if (document.querySelector(SELECTORS.searchbox)) {
					clearInterval(interval);
					createSettingsUI();
				}
			}, 100);
		} else {
			removeSettingsUI();
		}
	}

	/* --- Styling --- */

	function addGlobalStyles() {
		GM_addStyle(`
			#dyts-settings-container {
				margin-left: 8px;
				border-radius: 50%;
				background: var(--yt-spec-additive-background);
			}
			#dyts-settings-button {
				background: none;
				border: none;
				cursor: pointer;
				width: 40px;
				height: 40px;
				padding: 8px;
				border-radius: 50%;
				fill: var(--yt-spec-inverted-background);
			}

			#dyts-settings-button:hover {
				background-color: var(--yt-spec-additive-background);
			}

			#dyts-settings-panel {
				display: none;

				width: max-content;
				position: absolute;
				top: 5rem;
				right: 0;
				z-index: 9999;

				flex-direction: column;
				flex-wrap: nowrap;
				row-gap: 1rem;

				background-color: color-mix(in srgb, var(--yt-spec-base-background), var(--yt-spec-additive-background));
				border: 2px solid var(--yt-spec-grey-3);
				border-radius: 1.5rem;
				padding: 1rem;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
				backdrop-filter: blur(4rem);
			}

			#dyts-settings-panel h3 {
				margin: 0 0 10px 0;
				font-size: 1.75rem;
				color: var(--yt-spec-text-primary);
			}

			.dyts-setting-row label {
				display: flex;
				align-items: center;
				cursor: pointer;
				// padding: 6px 0;
				font-size: 1.6rem;
				color: var(--yt-spec-text-primary);
			}

			.dyts-setting-row .dyts-setting-enabled label {
				display: inherit;
			}

			dyts-setting-row .dyts-setting-disabled label {
				color: #f1f1f1b8
			}

			.dyts-setting-row label > span:first-of-type {
				flex-grow: 1; /* Allow the label text to push the input to the right */
			}

			.dyts-setting-row input[type="checkbox"] {
				margin-right: 12px;
				width: 18px;
				height: 18px;
				accent-color: var(--yt-spec-text-primary);
			}

			.dyts-setting-row input[type="number"] {
				width: auto;
				margin-left: 0.5rem;
				margin-right: 0.5rem;
				background-color: var(--yt-spec-additive-background);
    			border: 1px solid var(--yt-spec-additive-background);
				color: var(--yt-spec-text-primary);
				border-radius: 0.5rem;
				padding: 0.25rem;
				text-align: center;
			}
		`);
	}

	/* --- Invoke --- */

	// Run on script load
	updateStyles(CONFIG);
	onPageChange();
	addGlobalStyles();

	window.addEventListener('yt-navigate-finish', onPageChange);
})();