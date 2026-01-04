// ==UserScript==
// @name                nicovideo downloader
// @name:ja             nicovideo downloader
// @name:zh-TW          nicovideo downloader
// @name:zh-CN          nicovideo downloader
// @name:ko             nicovideo downloader
// @name:es             nicovideo downloader
// @name:fr             nicovideo downloader
// @name:de             nicovideo downloader
// @name:ru             nicovideo downloader
// @namespace           kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @author              kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @description         script for downloading videos from the nicovideo website
// @description:ja      ニコニコ動画から動画をダウンロードするためのスクリプト
// @description:zh-TW   用於從ニコニコ動畫網站下載影片的腳本
// @description:zh-CN   用于从Niconico动画网站下载视频的脚本
// @description:ko      니코니코 동영상에서 동영상을 다운로드하기 위한 스크립트
// @description:es      Script para descargar videos del sitio web nicovideo
// @description:fr      Script pour télécharger des vidéos depuis le site nicovideo
// @description:de      Skript zum Herunterladen von Videos von der nicovideo-Website
// @description:ru      Скрипт для загрузки видео с сайта nicovideo
// @version             0010
// @match               *://www.nicovideo.jp/*
// @match               *://ext.nicovideo.jp/?sm*
// @website             https://greasyfork.org/en/scripts/548403
// @icon                data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjUyNSIgZD0iTTIwLjM4NC4wMjJIMy42MTZBMy41OTUgMy41OTUgMCAwIDAgLjAyMiAzLjYxNnYxNi43NjhhMy41OTQgMy41OTQgMCAwIDAgMy41OTQgMy41OTRoMTYuNzY4YTMuNTkzIDMuNTkzIDAgMCAwIDMuNTk0LTMuNTk0VjMuNjE2QTMuNTk0IDMuNTk0IDAgMCAwIDIwLjM4NC4wMjIiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjAuMjEzIDUuNzI0aC01LjgxNmwyLjM4OC0yLjI3NWEuODUuODUgMCAwIDAgLjA0MS0xLjE4Mi44LjggMCAwIDAtMS4xNTMtLjA0M0wxMiA1LjcyNGwtMy42NzMtMy41YS44LjggMCAwIDAtMS4xNTMuMDQzLjg1Ljg1IDAgMCAwIC4wNDIgMS4xODJsMi4zODcgMi4yNzVIMy43ODhBMS44IDEuOCAwIDAgMCAyIDcuNTM1djEwLjg2M2MwIDEgLjgwMiAxLjgxMiAxLjc4OCAxLjgxMmgyLjI2NmwxLjM1IDEuNTlhLjUxNy41MTcgMCAwIDAgLjgxNiAwbDEuMzUtMS41OWg0Ljg2bDEuMzUgMS41OWEuNTE3LjUxNyAwIDAgMCAuODE2IDBsMS4zNS0xLjU5aDIuMjY2Yy45OSAwIDEuNzg4LS44MTEgMS43ODgtMS44MTJWNy41MzVjMC0xLS43OTktMS44MS0xLjc4Ny0xLjgxIi8+PC9zdmc+
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM.registerMenuCommand
// @license             CC0 1.0
// @downloadURL https://update.greasyfork.org/scripts/548403/nicovideo%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/548403/nicovideo%20downloader.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Constants
	const EXTERNAL_SCRIPT_SOURCES = {
		'best': "https://www.nicozon.net/js/bookmarklet.js",
		'720p': "https://www.nicozon.net/js/bookmarklet_720p.js",
		'480p': "https://www.nicozon.net/js/bookmarklet_480p.js",
		'360p': "https://www.nicozon.net/js/bookmarklet_360p.js",
		'audio': "https://www.nicozon.net/js/bookmarklet_audio.js"
	};

	const TARGET_SELECTORS = [
		'div.d_flex.gap_x2.text-layer_lowEm.fs_s.fw_bold.white-space_nowrap.ai_center',
		'div.d_flex.flex-d_column.ai_flex-start.ov_hidden.gap_base > div',
		'div.max-w_\\[var\\(--watch-video-information-width\\)\\] > div',
		'div.grid-area_\\[bottom\\] > div > div > div',
		'div.gap_var\\(--watch-video-information-gap\\) > div > div',
		'div.max-w_\\[var\\(--watch-video-information-width\\)\\] div:has(> time)',
		'div.grid-area_\\[bottom\\] div:has(> time)',
		'div.gap_var\\(--watch-video-information-gap\\) div:has(> time)',
	];

	const STYLES = `
		.nicovideo-downloader-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			opacity: 0.8;
		}
		.nicovideo-downloader-colon {
			user-select: none;
		}
		.nicovideo-downloader-separator {
			opacity: 0.5;
			user-select: none;
		}
		@media only screen and (max-width: 1350px), only screen and (max-height: 750px) {
			.nicovideo-downloader-separator:not(.ext-nicovideo) {
				display: none;
			}
		}
		.nicovideo-downloader-link {
			text-decoration: none;
			font-weight: bold;
			cursor: pointer;
			color: inherit;
			margin: 0 2px;
		}
		.nicovideo-downloader-link:hover {
			text-decoration: underline dotted;
			color: #ff9900;
		}
		.ext-nicovideo.nicovideo-downloader-links, body > p#audio, body > p#video {
			margin: 10px;
			padding: 15px 20px;
			background: #f0f0f0;
		}
		.nicovideo-downloader-error {
			border: solid #FF4C4C !important;
		}
		.ext-nicovideo.nicovideo-downloader-colon {
			margin: 0 6px 0 3px;
		}
		.ext-nicovideo.nicovideo-downloader-separator {
			margin: 0 2px;
		}
	`;

	// State management
	let state = {
		observers: {
			dom: null,
			navigation: null
		},
		menuCommandsRegistered: false,
		isDownloadInProgress: false,
		currentVideoId: null,
		cleanupCallbacks: []
	};

	// Utility functions
	const utils = {
		log: (message, ...args) => {
			console.log(`[NicoDL] ${message}`, ...args);
		},

		warn: (message, ...args) => {
			console.warn(`[NicoDL] ${message}`, ...args);
		},

		error: (message, ...args) => {
			console.error(`[NicoDL] ${message}`, ...args);
		},

		alert: (message, ...args) => {
			alert(`[Nicovideo Downloader Script]\n${message}`, ...args);
		},

		debounce: (func, wait) => {
			let timeout;
			return function executedFunction(...args) {
				const later = () => {
					clearTimeout(timeout);
					func(...args);
				};
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			};
		},

		injectStyles: () => {
			if (document.getElementById('nicovideo-downloader-styles')) {
				return;
			}

			const styleElement = document.createElement('style');
			styleElement.id = 'nicovideo-downloader-styles';
			styleElement.textContent = STYLES;
			document.head.appendChild(styleElement);
		}
	};

	// Storage fallback using localStorage
	const storage = {
		// Check if GM functions are available
		hasGM: typeof GM !== 'undefined' && GM && typeof GM.setValue === 'function' && typeof GM.getValue === 'function',

		// Set value with fallback - for quality preference we'll use URL parameters
		async setValue(key, value) {
			try {
				if (this.hasGM) {
					await GM.setValue(key, value);
					utils.log(`Stored value using GM.setValue: ${key}`, value);
				}
				// For cross-window communication, we'll rely on URL parameters
				// But we can store locally for menu commands etc.
				sessionStorage.setItem(`nicovideo-downloader-${key}`, JSON.stringify(value));
				utils.log(`Stored value using sessionStorage: ${key}`, value);
				return true;
			} catch (error) {
				utils.error(`Error storing value ${key}:`, error);
				return false;
			}
		},

		// Get value with fallback
		async getValue(key, defaultValue = null) {
			try {
				// First check URL parameters (highest priority for cross-window)
				const urlParams = new URLSearchParams(window.location.search);
				if (key === 'nicovideoDownloadQuality' && urlParams.has('quality')) {
					const quality = urlParams.get('quality');
					utils.log(`Retrieved value from URL parameters: ${key}`, quality);
					return quality;
				}

				let value;
				if (this.hasGM) {
					value = await GM.getValue(key, defaultValue);
					utils.log(`Retrieved value using GM.getValue: ${key}`, value);
				} else {
					const stored = sessionStorage.getItem(`nicovideo-downloader-${key}`);
					value = stored !== null ? JSON.parse(stored) : defaultValue;
					utils.log(`Retrieved value using sessionStorage: ${key}`, value);
				}
				return value;
			} catch (error) {
				utils.error(`Error retrieving value ${key}:`, error);
				return defaultValue;
			}
		},

		// Delete value with fallback
		async deleteValue(key) {
			try {
				if (this.hasGM) {
					await GM.setValue(key, '');
					utils.log(`Deleted value using GM.setValue: ${key}`);
				}
				// Always clear sessionStorage as well
				sessionStorage.removeItem(`nicovideo-downloader-${key}`);
				utils.log(`Deleted value from sessionStorage: ${key}`);
				return true;
			} catch (error) {
				utils.error(`Error deleting value ${key}:`, error);
				return false;
			}
		}
	};

	// Video ID extraction
	function getVideoId() {
		try {
			const url = window.location.href;
			const match = url.match(/sm(\d+)/);
			const videoId = match ? match[0] : null;

			if (!videoId) {
				utils.error('Could not extract video ID from URL:', url);
			} else {
				utils.log('Extracted video ID:', videoId);
			}

			return videoId;
		} catch (error) {
			utils.error('Error extracting video ID:', error);
			return null;
		}
	}

	function isVideoWatchPage() {
		return window.location.pathname.startsWith('/watch/sm');
	}

	// Observer management
	function setupDOMObserver() {
		if (state.observers.dom) {
			utils.log('DOM observer already running');
			return; // Already set up
		}

		const observer = new MutationObserver((mutations) => {
			// Only process if we're on a watch page
			if (!isVideoWatchPage()) return;

			const hasRelevantChanges = mutations.some(mutation =>
				mutation.addedNodes && Array.from(mutation.addedNodes).some(node =>
					node.nodeType === Node.ELEMENT_NODE &&
					TARGET_SELECTORS.some(selector =>
						node.querySelector?.(selector) || node.matches?.(selector)
					)
				)
			);

			if (hasRelevantChanges) {
				utils.log('Relevant DOM changes detected, attempting to add/update download links');
				addDownloadLinks();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'id'] // Watch for class changes too
		});

		state.observers.dom = observer;
		utils.log('DOM observer setup complete');
	}

	function setupSPANavigation() {
		if (state.observers.navigation) {
			utils.log('SPA navigation observer already running');
			return; // Already set up
		}

		let currentUrl = window.location.origin + window.location.pathname;
		let currentPath = window.location.pathname;

		const observer = new MutationObserver(utils.debounce(() => {
			const urlChanged = (window.location.origin + window.location.pathname) !== currentUrl;
			const pathChanged = window.location.pathname !== currentPath;

			if (urlChanged || pathChanged) {
				utils.log('SPA navigation detected', {
					oldUrl: currentUrl,
					newUrl: window.location.origin + window.location.pathname,
					oldPath: currentPath,
					newPath: window.location.pathname
				});

				currentUrl = window.location.origin + window.location.pathname;
				currentPath = window.location.pathname;

				handleNavigation();
			}
		}, 300));

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'data-state', 'data-path']
		});

		state.observers.navigation = observer;
		utils.log('SPA navigation observer setup complete');
	}

	function handleNavigation() {
		const wasOnWatchPage = state.currentVideoId !== null;
		const isNowWatchPage = isVideoWatchPage();
		const currentVideoId = isNowWatchPage && getVideoId();

		utils.log('Navigation handled', {
			wasOnWatchPage,
			isNowWatchPage,
			previousVideoId: state.currentVideoId,
			currentVideoId
		});

		state.currentVideoId = currentVideoId;

		if (isNowWatchPage) {
			utils.log('SPA navigation observer: On watch page, attempting to add/update download links');
			addDownloadLinks();
		}
	}

	function isDownloadLinksAdded() {
		return document.querySelector('.nicovideo-downloader-links') !== null;
	}

	// Download functionality
	async function initiateDownload(quality) {
		if (state.isDownloadInProgress) {
			utils.log('Download already in progress, skipping duplicate request');
			return false;
		}

		try {
			state.isDownloadInProgress = true;
			const videoId = getVideoId();

			if (!videoId) {
				utils.error('Cannot download without video ID');
				utils.alert('Error: Could not extract video ID from URL');
				return false;
			}

			// Store preferences
			await storage.setValue('nicovideoDownloadQuality', quality);
			utils.log('Stored download preference', { quality });

			// Handle navigation to ext.nicovideo.jp with quality parameter
			const downloadUrl = `https://ext.nicovideo.jp/?${videoId}&quality=${encodeURIComponent(quality)}`

			if (window.location.hostname === 'www.nicovideo.jp') {
				window.open(downloadUrl, '_blank');
			} else if (window.location.hostname === 'ext.nicovideo.jp') {
				window.location.href = downloadUrl;
			} else {
				utils.error('Unsupported hostname:', window.location.hostname);
			}

			return true;
		} catch (error) {
			utils.error('Error initiating download:', error);
			utils.alert('Error starting download. Please check console for details.');
			return false;
		} finally {
			// Reset flag with delay to prevent rapid successive clicks
			setTimeout(() => {
				state.isDownloadInProgress = false;
			}, 1500);
		}
	}

	// UI components
	function createDownloadLinks() {
		try {
			const videoId = getVideoId();
			if (!videoId) {
				utils.error('Cannot create download links without video ID');
				return null;
			}

			const linksContainer = document.createElement('div');
			linksContainer.className = 'd_flex gap_x0_5 ai_center nicovideo-downloader-links';

			// Icon
			const icon = document.createElement('span');
			icon.className = 'nicovideo-downloader-icon';
			icon.title = "Download";
			icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 8" class="w_font h_font"><path fill="currentColor" d="M3 0v3H1l3 3l3-3H5V0zM0 7v1h8V7z"/></svg>`;
			linksContainer.appendChild(icon);

			// Label
			const label = document.createElement('span');
			label.textContent = ':';
			label.className = 'nicovideo-downloader-colon';
			linksContainer.appendChild(label);

			// Download options
			const options = [
				{ text: 'Best', quality: 'best', title: 'Download the Video in the best available quality (1080p or lower).' },
				{ text: '720p', quality: '720p', title: 'Download the Video in 720p resolution, if it is available. Otherwise, download the best lower resolution available.' },
				{ text: '480p', quality: '480p', title: 'Download the Video in 480p resolution, if it is available. Otherwise, download the best lower resolution available.' },
				{ text: '360p', quality: '360p', title: 'Download the Video in 360p resolution, if it is available. Otherwise, download the best lower resolution available.' },
				{ text: '♫', quality: 'audio', title: 'Download Audio' }
			];

			options.forEach((option, index) => {
				const link = createDownloadLink(option, videoId);
				linksContainer.appendChild(link);

				if (index < options.length - 1) {
					const separator = document.createElement('span');
					separator.textContent = '|';
					separator.className = 'nicovideo-downloader-separator';
					linksContainer.appendChild(separator);
				}
			});

			utils.log('Download links created successfully');
			return linksContainer;
		} catch (error) {
			utils.error('Error creating download links:', error);
			return null;
		}
	}

	function createDownloadLink(option, videoId) {
		const link = document.createElement('a');
		link.href = `https://ext.nicovideo.jp/?${videoId}&quality=${encodeURIComponent(option.quality)}`;
		link.target = (window.location.hostname === 'www.nicovideo.jp') ? '_blank' : '_self';
		link.textContent = option.text;
		link.title = option.title;
		link.dataset.quality = option.quality;
		link.className = 'nicovideo-downloader-link';

		link.addEventListener('click', async (e) => {
			e.preventDefault();
			await initiateDownload(option.quality);
		});

		return link;
	}

	function addDownloadLinks() {
		try {
			let targetContainer = null;

			for (const selector of TARGET_SELECTORS) {
				targetContainer = document.querySelector(selector);
				if (targetContainer) {
					utils.log(`Found container using selector: ${selector}`);
					break;
				}
			}

			if (!targetContainer) {
				utils.log('Target container not found');
				return false;
			}

			const existingLinks = targetContainer.querySelector('.nicovideo-downloader-links');
			if (existingLinks) {
				utils.log('Removing existing download links');
				existingLinks.remove();
			}

			const linksContainer = createDownloadLinks();
			if (linksContainer) {
				const datePublishedElement = targetContainer.querySelector('time');
				if (datePublishedElement.nextSibling) {
					datePublishedElement.parentNode.insertBefore(linksContainer, datePublishedElement.nextSibling);
				}
				else {
					targetContainer.appendChild(linksContainer);
				}
				utils.log('Download links added successfully');
				return true;
			}

			return false;
		} catch (error) {
			utils.error('Error adding download links:', error);
			return false;
		}
	}

	// Menu commands
	function registerMenuCommands() {
		if (state.menuCommandsRegistered) {
			return;
		}
		if (typeof GM !== 'undefined' && GM.registerMenuCommand) {
			try {
				const commands = [
					{ name: 'Download Video Best Quality (1080p or lower)', quality: 'best', accessKey: 'b' },
					{ name: 'Download Video 720p if available or lower best', quality: '720p', accessKey: '7' },
					{ name: 'Download Video 480p if available or lower best', quality: '480p', accessKey: '4' },
					{ name: 'Download Video 360p if available or lower best', quality: '360p', accessKey: '3' },
					{ name: 'Download Audio', quality: 'audio', accessKey: 'a' }
				];

				commands.forEach(command => {
					GM.registerMenuCommand(command.name, async () => {
						await initiateDownload(command.quality);
					}, command.accessKey);
				});

				state.menuCommandsRegistered = true;
				utils.log('Menu commands registered');
			} catch (error) {
				utils.error('Error registering menu commands:', error);
			}
		}
	}

	// www.nicovideo.jp page handler
	async function handleNicovideoPage() {
		utils.log('On main nicovideo domain');

		// Inject styles first
		utils.injectStyles();

		// Register menu commands if not already done
		if (!state.menuCommandsRegistered) {
			registerMenuCommands();
		}

		// Set up observers once
		setupSPANavigation();
		setupDOMObserver();
		handleNavigation();
	}

	// ext.nicovideo.jp page handler
	async function handleExtNicovideoPage() {
		utils.log('Handling ext.nicovideo.jp page');

		// Inject styles
		utils.injectStyles();

		try {
			const videoId = getVideoId();
			if (!videoId) {
				utils.error('Cannot create download links without video ID');
				const errorElement = document.createElement("p");
				errorElement.className = 'nicovideo-downloader-links nicovideo-downloader-error ext-nicovideo';
				errorElement.textContent = "[Nicovideo Downloader Script] ⚠ Error: No video ID was detected in the URL";
				document.body.appendChild(errorElement);
				return;
			}

			// Register menu commands if not already done
			if (!state.menuCommandsRegistered) {
				registerMenuCommands();
			}

			// Retrieve stored preferences
			const quality = await storage.getValue('nicovideoDownloadQuality');

			utils.log('Retrieved stored values', { quality });

			// Create info element
			const infoElement = document.createElement("p");
			infoElement.className = 'nicovideo-downloader-links ext-nicovideo';
			infoElement.textContent = "Download: " + (quality || 'No quality selected');
			document.body.appendChild(infoElement);

			// Clean up stored values
			await storage.deleteValue('nicovideoDownloadQuality');
			utils.log('Cleared stored values');

			// Remove parameters from URL
			let url = new URL(window.location.href);
			const newURL = `${url.origin}${url.pathname}?${videoId}`;
			history.replaceState(history.state, '', newURL);

			// Load appropriate script or show links
			if (quality) {
				executeDownloadScript(quality);
			} else {
				const linksContainer = createDownloadLinks();
				if (linksContainer) {
					document.body.appendChild(linksContainer);
				}
			}
		} catch (error) {
			utils.error('Error occurred while handling the page:', error);
		}

		document.querySelectorAll('body *').forEach(el => el.classList.add('ext-nicovideo'));
	}

	// Cleanup functions
	function cleanupObserver(observerType) {
		if (state.observers[observerType]) {
			state.observers[observerType].disconnect();
			state.observers[observerType] = null;
			utils.log(`Cleaned up ${observerType} observer`);
		}
	}

	function cleanupAll() {
		utils.log('Performing complete cleanup');

		// Cleanup observers
		Object.keys(state.observers).forEach(cleanupObserver);

		// Run registered cleanup callbacks
		state.cleanupCallbacks.forEach(callback => {
			try {
				callback();
			} catch (error) {
				utils.error('Error in cleanup callback:', error);
			}
		});

		state.cleanupCallbacks = [];
		state.isDownloadInProgress = false;

		utils.log('Cleanup completed');
	}

	// Main page handler
	async function handlePage() {
		utils.log('Handling page', {
			hostname: window.location.hostname,
			pathname: window.location.pathname
		});

		try {
			if (window.location.hostname === 'www.nicovideo.jp') {
				await handleNicovideoPage();
			} else if (window.location.hostname === 'ext.nicovideo.jp') {
				await handleExtNicovideoPage();
			} else {
				utils.error('Unsupported hostname:', window.location.hostname);
			}
		} catch (error) {
			utils.error('Error in handlePage:', error);
		}
	}

	// Initialize script
	function initialize() {
		utils.log('Initializing NicoVideo Downloader');

		// Start handling the current page
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', handlePage);
		} else {
			handlePage();
		}
	}

	// Start the script
	initialize();

	// Fallback for the executeDownloadScript function in case it fails.
	// Future updates to the Nicovideo website may cause the executeDownloadScript to stop working.
	// So this might help if the Nicozon devs update the download scripts
	function loadExternalDownloadScript(quality = 'best') {
		const scriptSrc = EXTERNAL_SCRIPT_SOURCES[quality];

		utils.log('function loadExternalDownloadScript: Loading download script:', scriptSrc);

		const script = document.createElement('script');
		script.setAttribute('charset', 'utf-8');
		script.src = scriptSrc;

		script.onload = () => utils.log('Download script loaded successfully');
		script.onerror = () => {
			utils.error('Failed to load download script:', scriptSrc);
			alert('Download failed.');
		};

		document.body.appendChild(script);
	}

	// Taken from www.nicozon.net
	// The function below is a combination of the following scripts:
	// - Old bookmarklet code (best quality):		"https://www.nicozon.net/js/bookmarklet_old.js",
	// - Old version 720p limit bookmarklet code:	"https://www.nicozon.net/js/bookmarklet_old_720p.js",
	// - Old version 480p limit bookmarklet code:	"https://www.nicozon.net/js/bookmarklet_old_480p.js",
	// - Old version 360p limit bookmarklet code:	"https://www.nicozon.net/js/bookmarklet_old_360p.js",
	// - Old version audio only bookmarklet code:	"https://www.nicozon.net/js/bookmarklet_old_audio.js"
	function executeDownloadScript(quality) {
		try {
			function _typeof(n) {
				"@babel/helpers - typeof";
				_typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (n) {
					return typeof n;
				} : function (n) {
					if (n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype) {
						return "symbol";
					} else {
						return typeof n;
					}
				};
				return _typeof(n);
			}
			function _slicedToArray(n, t) {
				return _arrayWithHoles(n) || _iterableToArrayLimit(n, t) || _unsupportedIterableToArray(n, t) || _nonIterableRest();
			}
			function _nonIterableRest() {
				throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			function _iterableToArrayLimit(n, t) {
				var i = n == null ? null : typeof Symbol != "undefined" && n[Symbol.iterator] || n["@@iterator"];
				if (i != null) {
					var e;
					var o;
					var s;
					var u;
					var f = [];
					var r = true;
					var h = false;
					try {
						s = (i = i.call(n)).next;
						if (t === 0) {
							if (Object(i) !== i) {
								return;
							}
							r = false;
						}
					} catch (n) {
						h = true;
						o = n;
					} finally {
						try {
							if (!r && i.return != null) {
								u = i.return();
								if (Object(u) !== u) {
									return;
								}
							}
						} finally {
							if (h) {
								throw o;
							}
						}
					}
					return f;
				}
			}
			function _arrayWithHoles(n) {
				if (Array.isArray(n)) {
					return n;
				}
			}
			function _toConsumableArray(n) {
				return _arrayWithoutHoles(n) || _iterableToArray(n) || _unsupportedIterableToArray(n) || _nonIterableSpread();
			}
			function _nonIterableSpread() {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			function _unsupportedIterableToArray(n, t) {
				if (n) {
					if (typeof n == "string") {
						return _arrayLikeToArray(n, t);
					}
					var i = {}.toString.call(n).slice(8, -1);
					if (i === "Object" && n.constructor) {
						i = n.constructor.name;
					}
					if (i === "Map" || i === "Set") {
						return Array.from(n);
					} else if (i === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) {
						return _arrayLikeToArray(n, t);
					} else {
						return;
					}
				}
			}
			function _iterableToArray(n) {
				if (typeof Symbol != "undefined" && n[Symbol.iterator] != null || n["@@iterator"] != null) {
					return Array.from(n);
				}
			}
			function _arrayWithoutHoles(n) {
				if (Array.isArray(n)) {
					return _arrayLikeToArray(n);
				}
			}
			function _arrayLikeToArray(n, t) {
				if (t == null || t > n.length) {
					t = n.length;
				}
				var i = 0;
				for (var r = Array(t); i < t; i++) {
					r[i] = n[i];
				}
				return r;
			}
			function _classCallCheck(n, t) {
				if (!(n instanceof t)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			function _defineProperties(n, t) {
				var i;
				for (var r = 0; r < t.length; r++) {
					i = t[r];
					i.enumerable = i.enumerable || false;
					i.configurable = true;
					if ("value" in i) {
						i.writable = true;
					}
					Object.defineProperty(n, _toPropertyKey(i.key), i);
				}
			}
			function _createClass(n, t, i) {
				if (t) {
					_defineProperties(n.prototype, t);
				}
				if (i) {
					_defineProperties(n, i);
				}
				Object.defineProperty(n, "prototype", {writable: false});
				return n;
			}
			function _defineProperty(n, t, i) {
				if ((t = _toPropertyKey(t)) in n) {
					Object.defineProperty(n, t, {value: i, enumerable: true, configurable: true, writable: true});
				} else {
					n[t] = i;
				}
				return n;
			}
			function _toPropertyKey(n) {
				var t = _toPrimitive(n, "string");
				if (_typeof(t) == "symbol") {
					return t;
				} else {
					return t + "";
				}
			}
			function _toPrimitive(n, t) {
				var r;
				if (_typeof(n) != "object" || !n) {
					return n;
				}
				var i = n[Symbol.toPrimitive];
				if (i !== void 0) {
					r = i.call(n, t || "default");
					if (_typeof(r) != "object") {
						return r;
					}
					throw new TypeError("@@toPrimitive must return a primitive value.");
				}
				return (t === "string" ? String : Number)(n);
			}
			function concatUint8Array() {
				var u = arguments.length;
				var n = new Array(u);
				for (var t = 0; t < u; t++) {
					n[t] = arguments[t];
				}
				n = n.filter(Boolean);
				var i = new Uint8Array(n.reduce(function (n, t) {
					return n + t.byteLength;
				}, 0));
				var r = 0;
				n.forEach(function (n) {
					i.set(n, r);
					r += n.byteLength;
				});
				return i;
			}
			function readBig16(n) {
				var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
				return (n[t] << 8) + (n[t + 1] || 0);
			}
			function readBig24(n) {
				var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
				return (n[t] << 16) + (n[t + 1] << 8) + (n[t + 2] || 0);
			}
			function readBig32(n) {
				var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
				return (n[t] << 24 >>> 0) + (n[t + 1] << 16) + (n[t + 2] << 8) + (n[t + 3] || 0);
			}
			function readBig64(n) {
				var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
				return readBig32(n, t) * MAX_SIZE + readBig32(n, t + 4);
			}
			function getAvcCodec(n) {
				var r = "avc1.";
				var t;
				for (var i = 0; i < 3; i++) {
					t = n[i].toString(16);
					if (t.length < 2) {
						t = "0".concat(t);
					}
					r += t;
				}
				return r;
			}
			function parse(n) {
				var r;
				var i;
				var t;
				if (!Array.isArray(n)) {
					r = [];
					i = "";
					for (t = 0; t < n.length; t++) {
						if (t % 2) {
							i = n[t - 1] + n[t];
							r.push(parseInt(i, 16));
							i = "";
						}
					}
					return r;
				}
				return n.map(function (n) {
					return parseInt(n, 16);
				});
			}
			function hashVal(n) {
				var t = 0;
				var r;
				if (n.length === 0) {
					return t;
				}
				for (var i = 0; i < n.length; i++) {
					r = n.charCodeAt(i);
					t = (t << 5) - t + r | 0;
				}
				return t;
			}
			function getSamples(n, t, i, r, u, f) {
				var p = [];
				var w = u === null || u === void 0 ? void 0 : u.entries;
				var s = t.entries;
				var nt = r.entries;
				var tt = i.entrySizes;
				var l = f === null || f === void 0 ? void 0 : f.entries;
				var a;
				var h;
				if (l) {
					a = {};
					l.forEach(function (n) {
						a[n - 1] = true;
					});
				}
				if (w) {
					h = [];
					w.forEach(function (n) {
						var i = n.count;
						var r = n.offset;
						for (var t = 0; t < i; t++) {
							h.push(r);
						}
					});
				}
				var e;
				var b = -1;
				var k = 0;
				var o = 0;
				var v = 0;
				var c = 0;
				var y = 0;
				var d = s[0].samplesPerChunk;
				var g = s[1] ? s[1].firstChunk - 1 : Infinity;
				n.entries.forEach(function (n) {
					var u = n.count;
					var t = n.delta;
					for (var r = 0; r < u; r++) {
						e = {dts: k, duration: t, size: tt[o] || i.sampleSize, offset: nt[v] + y, index: o};
						if (l) {
							e.keyframe = a[o];
							if (e.keyframe) {
								b++;
							}
							e.gopId = b;
						}
						if (h && o < h.length) {
							e.pts = e.dts + h[o];
						}
						p.push(e);
						k += t;
						o++;
						if (o < d) {
							y += e.size;
						} else {
							v++;
							y = 0;
							if (v >= g) {
								c++;
								g = s[c + 1] ? s[c + 1].firstChunk - 1 : Infinity;
							}
							d += s[c].samplesPerChunk;
						}
					}
				});
				return p;
			}
			function parseVisualSampleEntry(n, t) {
				n.dataReferenceIndex = readBig16(t, 6);
				n.width = readBig16(t, 24);
				n.height = readBig16(t, 26);
				n.horizresolution = readBig32(t, 28);
				n.vertresolution = readBig32(t, 32);
				n.frameCount = readBig16(t, 40);
				n.depth = readBig16(t, 74);
				return 78;
			}
			function parseAudioSampleEntry(n, t) {
				n.dataReferenceIndex = readBig16(t, 6);
				n.channelCount = readBig16(t, 16);
				n.sampleSize = readBig16(t, 18);
				n.sampleRate = readBig32(t, 24) / 65536;
				return 28;
			}
			function parseBox(n, t, i) {
				if (n) {
					if (n.size !== n.data.length) {
						throw new Error("box ".concat(n.type, " size !== data.length"));
					}
					var r = {start: n.start, size: n.size, headerSize: n.headerSize, type: n.type};
					if (t) {
						r.version = n.data[n.headerSize];
						r.flags = readBig24(n.data, n.headerSize + 1);
						r.headerSize += 4;
					}
					i(r, n.data.subarray(r.headerSize), r.start + r.headerSize);
					return r;
				}
			}
			function Concat(n) {
				var e = 0;
				var i = arguments.length;
				var r = new Array(i > 1 ? i - 1 : 0);
				for (var t = 1; t < i; t++) {
					r[t - 1] = arguments[t];
				}
				r.forEach(function (n) {
					e += n.length;
				});
				var u = new n(e);
				var f = 0;
				r.forEach(function (n) {
					u.set(n, f);
					f += n.length;
				});
				return u;
			}
			var _MP;
			var MAX_SIZE = Math.pow(2, 32);
			var TrackType = {VIDEO: "video", AUDIO: "audio", METADATA: "metadata"};
			var VideoCodecType = {AVC: "avc", HEVC: "hevc"};
			var AudioCodecType = {AAC: "aac", G711PCMA: "g7110a", G711PCMU: "g7110m"};
			var VideoTrack = function () {
				function n() {
					_classCallCheck(this, n);
					_defineProperty(this, "id", 1);
					_defineProperty(this, "type", TrackType.VIDEO);
					_defineProperty(this, "codecType", VideoCodecType.AVC);
					_defineProperty(this, "pid", -1);
					_defineProperty(this, "hvcC", undefined);
					_defineProperty(this, "codec", "");
					_defineProperty(this, "timescale", 0);
					_defineProperty(this, "formatTimescale", 0);
					_defineProperty(this, "sequenceNumber", 0);
					_defineProperty(this, "baseMediaDecodeTime", 0);
					_defineProperty(this, "baseDts", 0);
					_defineProperty(this, "duration", 0);
					_defineProperty(this, "warnings", []);
					_defineProperty(this, "samples", []);
					_defineProperty(this, "pps", []);
					_defineProperty(this, "sps", []);
					_defineProperty(this, "vps", []);
					_defineProperty(this, "fpsNum", 0);
					_defineProperty(this, "fpsDen", 0);
					_defineProperty(this, "sarRatio", []);
					_defineProperty(this, "width", 0);
					_defineProperty(this, "height", 0);
					_defineProperty(this, "nalUnitSize", 4);
					_defineProperty(this, "present", false);
					_defineProperty(this, "isVideoEncryption", false);
					_defineProperty(this, "isAudioEncryption", false);
					_defineProperty(this, "isVideo", true);
					_defineProperty(this, "kid", null);
					_defineProperty(this, "pssh", null);
					_defineProperty(this, "ext", void 0);
				}
				return _createClass(n, [{key: "reset", value: function () {
					this.sequenceNumber = this.width = this.height = this.fpsDen = this.fpsNum = this.duration = this.baseMediaDecodeTime = this.timescale = 0;
					this.codec = "";
					this.present = false;
					this.pid = -1;
					this.pps = [];
					this.sps = [];
					this.vps = [];
					this.sarRatio = [];
					this.samples = [];
					this.warnings = [];
					this.hvcC = null;
				}}, {key: "exist", value: function () {
					return !!this.pps.length && !!this.sps.length && !!this.codec;
				}}, {key: "hasSample", value: function () {
					return !!this.samples.length;
				}}, {key: "isEncryption", get: function () {
					return this.isVideoEncryption;
				}}]);
			}();
			var AudioTrack = function () {
				function n() {
					_classCallCheck(this, n);
					_defineProperty(this, "id", 2);
					_defineProperty(this, "type", TrackType.AUDIO);
					_defineProperty(this, "codecType", AudioCodecType.AAC);
					_defineProperty(this, "pid", -1);
					_defineProperty(this, "codec", "");
					_defineProperty(this, "sequenceNumber", 0);
					_defineProperty(this, "sampleDuration", 0);
					_defineProperty(this, "timescale", 0);
					_defineProperty(this, "formatTimescale", 0);
					_defineProperty(this, "baseMediaDecodeTime", 0);
					_defineProperty(this, "duration", 0);
					_defineProperty(this, "warnings", []);
					_defineProperty(this, "samples", []);
					_defineProperty(this, "baseDts", 0);
					_defineProperty(this, "sampleSize", 16);
					_defineProperty(this, "sampleRate", 0);
					_defineProperty(this, "channelCount", 0);
					_defineProperty(this, "objectType", 0);
					_defineProperty(this, "sampleRateIndex", 0);
					_defineProperty(this, "config", []);
					_defineProperty(this, "present", false);
					_defineProperty(this, "isVideoEncryption", false);
					_defineProperty(this, "isAudioEncryption", false);
					_defineProperty(this, "kid", null);
					_defineProperty(this, "ext", void 0);
				}
				return _createClass(n, [{key: "reset", value: function () {
					this.sequenceNumber = 0;
					this.timescale = 0;
					this.sampleDuration = 0;
					this.sampleRate = 0;
					this.channelCount = 0;
					this.baseMediaDecodeTime = 0;
					this.present = false;
					this.pid = -1;
					this.codec = "";
					this.samples = [];
					this.config = [];
					this.warnings = [];
				}}, {key: "exist", value: function () {
					return !!this.sampleRate && !!this.channelCount && !!this.codec && this.codecType === AudioCodecType.AAC;
				}}, {key: "hasSample", value: function () {
					return !!this.samples.length;
				}}, {key: "isEncryption", get: function () {
					return this.isAudioEncryption;
				}}]);
			}();
			var Sample = _createClass(function Sample(n, t) {
				_classCallCheck(this, Sample);
				_defineProperty(this, "time", 0);
				this.data = n;
				this.originPts = this.pts = t;
			});
			var MetadataTrack = function () {
				function n() {
					_classCallCheck(this, n);
					_defineProperty(this, "id", 3);
					_defineProperty(this, "type", TrackType.METADATA);
					_defineProperty(this, "timescale", 0);
					_defineProperty(this, "flvScriptSamples", []);
					_defineProperty(this, "seiSamples", []);
				}
				return _createClass(n, [{key: "exist", value: function () {
					return (!!this.flvScriptSamples.length || !!this.seiSamples.length) && !!this.timescale;
				}}, {key: "reset", value: function () {
					this.timescale = 0;
					this.flvScriptSamples = [];
					this.seiSamples = [];
				}}, {key: "hasSample", value: function () {
					return !!this.flvScriptSamples.length || !!this.seiSamples.length;
				}}]);
			}();
			var VideoSample = function () {
				function n(t, i, r) {
					_classCallCheck(this, n);
					_defineProperty(this, "flag", {});
					_defineProperty(this, "keyframe", false);
					_defineProperty(this, "gopId", 0);
					_defineProperty(this, "duration", 0);
					_defineProperty(this, "size", 0);
					_defineProperty(this, "units", []);
					_defineProperty(this, "chromaFormat", 420);
					this.originPts = this.pts = t;
					this.originDts = this.dts = i;
					if (r) {
						this.units = r;
					}
				}
				return _createClass(n, [{key: "cts", get: function () {
					return this.pts - this.dts;
				}}, {key: "setToKeyframe", value: function () {
					this.keyframe = true;
					this.flag.dependsOn = 2;
					this.flag.isNonSyncSample = 0;
				}}]);
			}();
			var AudioSample = _createClass(function AudioSample(n, t, i, r) {
				_classCallCheck(this, AudioSample);
				_defineProperty(this, "duration", 1024);
				_defineProperty(this, "flag", {dependsOn: 2, isNonSyncSample: 0});
				_defineProperty(this, "keyframe", true);
				this.originPts = this.pts = this.dts = n;
				this.data = t;
				this.size = t.byteLength;
				this.sampleOffset = r;
				if (i) {
					this.duration = i;
				}
			});
			var AAC = function () {
				function n() {
					_classCallCheck(this, n);
				}
				return _createClass(n, null, [{key: "getRateIndexByRate", value: function (t) {
					return n.FREQ.indexOf(t);
				}}, {key: "getFrameDuration", value: function (n) {
					var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9e4;
					return 1024 * t / n;
				}}]);
			}();
			var MP4Parser;
			var padStart;
			var toHex;
			var video_id;
			var t;
			_defineProperty(AAC, "FREQ", [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350]);
			MP4Parser = function () {
				function n() {
					_classCallCheck(this, n);
				}
				return _createClass(n, null, [{key: "findBox", value: function (t, i) {
					var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
					var e = [];
					var s;
					if (!t) {
						return e;
					}
					var r = 0;
					var o = "";
					for (var u = 0; t.length > 7;) {
						r = readBig32(t);
						o = String.fromCharCode.apply(null, t.subarray(4, 8));
						u = 8;
						if (r === 1) {
							r = readBig64(t, 8);
							u += 8;
						} else if (!r) {
							r = t.length;
						}
						if (!i[0] || o === i[0]) {
							s = t.subarray(0, r);
							if (i.length < 2) {
								e.push({start: f, size: r, headerSize: u, type: o, data: s});
							} else {
								return n.findBox(s.subarray(u), i.slice(1), f + u);
							}
						}
						f += r;
						t = t.subarray(r);
					}
					return e;
				}}, {key: "tfhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						n.trackId = readBig32(t);
						var i = 4;
						var r = n.flags & 1;
						var u = n.flags & 2;
						var f = n.flags & 8;
						var e = n.flags & 16;
						var o = n.flags & 32;
						if (r) {
							i += 4;
							n.baseDataOffset = readBig32(t, i);
							i += 4;
						}
						if (u) {
							n.sampleDescriptionIndex = readBig32(t, i);
							i += 4;
						}
						if (f) {
							n.defaultSampleDuration = readBig32(t, i);
							i += 4;
						}
						if (e) {
							n.defaultSampleSize = readBig32(t, i);
							i += 4;
						}
						if (o) {
							n.defaultSampleFlags = readBig32(t, i);
						}
					});
				}}, {key: "sidx", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = 0;
						var r;
						var u;
						n.reference_ID = readBig32(t, i);
						i += 4;
						n.timescale = readBig32(t, i);
						i += 4;
						if (n.version === 0) {
							n.earliest_presentation_time = readBig32(t, i);
							i += 4;
							n.first_offset = readBig32(t, i);
							i += 4;
						} else {
							n.earliest_presentation_time = readBig64(t, i);
							i += 8;
							n.first_offset = readBig64(t, i);
							i += 8;
						}
						i += 2;
						n.references = [];
						var e = readBig16(t, i);
						i += 2;
						for (var f = 0; f < e; f++) {
							r = {};
							n.references.push(r);
							u = readBig32(t, i);
							i += 4;
							r.reference_type = u >> 31 & 1;
							r.referenced_size = u & 2147483647;
							r.subsegment_duration = readBig32(t, i);
							i += 4;
							u = readBig32(t, i);
							i += 4;
							r.starts_with_SAP = u >> 31 & 1;
							r.SAP_type = u >> 28 & 7;
							r.SAP_delta_time = u & 268435455;
						}
					});
				}}, {key: "moov", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.mvhd = n.mvhd(n.findBox(i, ["mvhd"], r)[0]);
						t.trak = n.findBox(i, ["trak"], r).map(function (t) {
							return n.trak(t);
						});
						t.pssh = n.pssh(n.findBox(i, ["pssh"], r)[0]);
					});
				}}, {key: "mvhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = 0;
						if (n.version === 1) {
							n.timescale = readBig32(t, 16);
							n.duration = readBig64(t, 20);
							i += 28;
						} else {
							n.timescale = readBig32(t, 8);
							n.duration = readBig32(t, 12);
							i += 16;
						}
						n.nextTrackId = readBig32(t, i + 76);
					});
				}}, {key: "trak", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.tkhd = n.tkhd(n.findBox(i, ["tkhd"], r)[0]);
						t.mdia = n.mdia(n.findBox(i, ["mdia"], r)[0]);
					});
				}}, {key: "tkhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = 0;
						if (n.version === 1) {
							n.trackId = readBig32(t, 16);
							n.duration = readBig64(t, 24);
							i += 32;
						} else {
							n.trackId = readBig32(t, 8);
							n.duration = readBig32(t, 16);
							i += 20;
						}
						n.width = readBig32(t, i + 52);
						n.height = readBig32(t, i + 56);
					});
				}}, {key: "mdia", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.mdhd = n.mdhd(n.findBox(i, ["mdhd"], r)[0]);
						t.hdlr = n.hdlr(n.findBox(i, ["hdlr"], r)[0]);
						t.minf = n.minf(n.findBox(i, ["minf"], r)[0]);
					});
				}}, {key: "mdhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var r = 0;
						if (n.version === 1) {
							n.timescale = readBig32(t, 16);
							n.duration = readBig64(t, 20);
							r += 28;
						} else {
							n.timescale = readBig32(t, 8);
							n.duration = readBig32(t, 12);
							r += 16;
						}
						var i = readBig16(t, r);
						n.language = String.fromCharCode((i >> 10 & 31) + 96, (i >> 5 & 31) + 96, (i & 31) + 96);
					});
				}}, {key: "hdlr", value: function (n) {
					return parseBox(n, true, function (n, t) {
						if (n.version === 0) {
							n.handlerType = String.fromCharCode.apply(null, t.subarray(4, 8));
						}
					});
				}}, {key: "minf", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.vmhd = n.vmhd(n.findBox(i, ["vmhd"], r)[0]);
						t.smhd = n.smhd(n.findBox(i, ["smhd"], r)[0]);
						t.stbl = n.stbl(n.findBox(i, ["stbl"], r)[0]);
					});
				}}, {key: "vmhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						n.graphicsmode = readBig16(t);
						n.opcolor = [readBig16(t, 2), readBig16(t, 4), readBig16(t, 6)];
					});
				}}, {key: "smhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						n.balance = readBig16(t);
					});
				}}, {key: "stbl", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						var u;
						t.stsd = n.stsd(n.findBox(i, ["stsd"], r)[0]);
						t.stts = n.stts(n.findBox(i, ["stts"], r)[0]);
						t.ctts = n.ctts(n.findBox(i, ["ctts"], r)[0]);
						t.stsc = n.stsc(n.findBox(i, ["stsc"], r)[0]);
						t.stsz = n.stsz(n.findBox(i, ["stsz"], r)[0]);
						t.stco = n.stco(n.findBox(i, ["stco"], r)[0]);
						if (!t.stco) {
							t.co64 = n.co64(n.findBox(i, ["co64"], r)[0]);
							t.stco = t.co64;
						}
						var f = (u = t.stsd.entries[0]) === null || u === void 0 || (u = u.sinf) === null || u === void 0 || (u = u.schi) === null || u === void 0 ? void 0 : u.tenc.default_IV_size;
						t.stss = n.stss(n.findBox(i, ["stss"], r)[0]);
						t.senc = n.senc(n.findBox(i, ["senc"], r)[0], f);
					});
				}}, {key: "senc", value: function (n) {
					var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
					return parseBox(n, true, function (n, i) {
						var r = 0;
						var c = readBig32(i, r);
						var u;
						var f;
						var h;
						var s;
						var e;
						r += 4;
						n.samples = [];
						for (var o = 0; o < c; o++) {
							u = {};
							u.InitializationVector = [];
							for (f = 0; f < t; f++) {
								u.InitializationVector[f] = i[r + f];
							}
							r += t;
							if (n.flags & 2) {
								u.subsamples = [];
								h = readBig16(i, r);
								r += 2;
								for (s = 0; s < h; s++) {
									e = {};
									e.BytesOfClearData = readBig16(i, r);
									r += 2;
									e.BytesOfProtectedData = readBig32(i, r);
									r += 4;
									u.subsamples.push(e);
								}
							}
							n.samples.push(u);
						}
					});
				}}, {key: "pssh", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var s;
						var u;
						var f;
						var h;
						var e = [];
						var o = [];
						var i = 0;
						for (var r = 0; r < 16; r++) {
							o.push(toHex(t[i + r]));
						}
						i += 16;
						if (n.version > 0) {
							s = readBig32(t, i);
							i += 4;
							for (u = 0; u < ("" + s).length; u++) {
								for (f = 0; f < 16; f++) {
									h = t[i];
									i += 1;
									e.push(toHex(h));
								}
							}
						}
						var c = readBig32(t, i);
						n.data_size = c;
						i += 4;
						n.kid = e;
						n.system_id = o;
						n.buffer = t;
					});
				}}, {key: "stsd", value: function (t) {
					return parseBox(t, true, function (t, i, r) {
						t.entryCount = readBig32(i);
						t.entries = n.findBox(i.subarray(4), [], r + 4).map(function (t) {
							switch (t.type) {
								case "avc1":
								case "avc2":
								case "avc3":
								case "avc4":
									return n.avc1(t);
								case "hvc1":
								case "hev1":
									return n.hvc1(t);
								case "mp4a":
									return n.mp4a(t);
								case "alaw":
								case "ulaw":
									return n.alaw(t);
								case "enca":
									return parseBox(t, false, function (t, i, r) {
										t.channelCount = readBig16(i, 16);
										t.samplesize = readBig16(i, 18);
										t.sampleRate = readBig32(i, 24) / 65536;
										i = i.subarray(28);
										t.sinf = n.sinf(n.findBox(i, ["sinf"], r)[0]);
										t.esds = n.esds(n.findBox(i, ["esds"], r)[0]);
									});
								case "encv":
									return parseBox(t, false, function (t, i, r) {
										t.width = readBig16(i, 24);
										t.height = readBig16(i, 26);
										t.horizresolution = readBig32(i, 28);
										t.vertresolution = readBig32(i, 32);
										i = i.subarray(78);
										t.sinf = n.sinf(n.findBox(i, ["sinf"], r)[0]);
										t.avcC = n.avcC(n.findBox(i, ["avcC"], r)[0]);
										t.hvcC = n.hvcC(n.findBox(i, ["hvcC"], r)[0]);
										t.pasp = n.pasp(n.findBox(i, ["pasp"], r)[0]);
									});
							}
						}).filter(Boolean);
					});
				}}, {key: "tenc", value: function (n) {
					return parseBox(n, false, function (n, t) {
						var i = 6;
						n.default_IsEncrypted = t[i];
						i += 1;
						n.default_IV_size = t[i];
						i += 1;
						n.default_KID = [];
						for (var r = 0; r < 16; r++) {
							n.default_KID.push(toHex(t[i]));
							i += 1;
						}
					});
				}}, {key: "schi", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.tenc = n.tenc(n.findBox(i, ["tenc"], r)[0]);
					});
				}}, {key: "sinf", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.schi = n.schi(n.findBox(i, ["schi"], r)[0]);
						t.frma = n.frma(n.findBox(i, ["frma"], r)[0]);
					});
				}}, {key: "frma", value: function (n) {
					return parseBox(n, false, function (n, t) {
						n.data_format = "";
						for (var i = 0; i < 4; i++) {
							n.data_format += String.fromCharCode(t[i]);
						}
					});
				}}, {key: "avc1", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						var u = parseVisualSampleEntry(t, i);
						var f = i.subarray(u);
						r += u;
						t.avcC = n.avcC(n.findBox(f, ["avcC"], r)[0]);
						t.pasp = n.pasp(n.findBox(f, ["pasp"], r)[0]);
					});
				}}, {key: "avcC", value: function (n) {
					return parseBox(n, false, function (n, t) {
						var u;
						var e;
						n.configurationVersion = t[0];
						n.AVCProfileIndication = t[1];
						n.profileCompatibility = t[2];
						n.AVCLevelIndication = t[3];
						n.codec = getAvcCodec([t[1], t[2], t[3]]);
						n.lengthSizeMinusOne = t[4] & 3;
						n.spsLength = t[5] & 31;
						n.sps = [];
						var i = 6;
						for (var r = 0; r < n.spsLength; r++) {
							u = readBig16(t, i);
							i += 2;
							n.sps.push(t.subarray(i, i + u));
							i += u;
						}
						n.ppsLength = t[i];
						i += 1;
						n.pps = [];
						for (var f = 0; f < n.ppsLength; f++) {
							e = readBig16(t, i);
							i += 2;
							n.pps.push(t.subarray(i, i += e));
							i += e;
						}
					});
				}}, {key: "hvc1", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						var u = parseVisualSampleEntry(t, i);
						var f = i.subarray(u);
						r += u;
						t.hvcC = n.hvcC(n.findBox(f, ["hvcC"], r)[0]);
						t.pasp = n.pasp(n.findBox(f, ["pasp"], r)[0]);
					});
				}}, {key: "hvcC", value: function (n) {
					return parseBox(n, false, function (t, i) {
						var u;
						var h;
						var l;
						var a;
						var v;
						t.data = n.data;
						t.codec = "hev1.1.6.L93.B0";
						t.configurationVersion = i[0];
						var f = i[1];
						t.generalProfileSpace = f >> 6;
						t.generalTierFlag = (f & 32) >> 5;
						t.generalProfileIdc = f & 31;
						t.generalProfileCompatibility = readBig32(i, 2);
						t.generalConstraintIndicatorFlags = i.subarray(6, 12);
						t.generalLevelIdc = i[12];
						t.avgFrameRate = readBig16(i, 19);
						t.numOfArrays = i[22];
						t.vps = [];
						t.sps = [];
						t.pps = [];
						var r = 23;
						var e = 0;
						var c = 0;
						var o = 0;
						for (var s = 0; s < t.numOfArrays; s++) {
							e = i[r] & 63;
							c = readBig16(i, r + 1);
							r += 3;
							u = [];
							for (h = 0; h < c; h++) {
								o = readBig16(i, r);
								r += 2;
								u.push(i.subarray(r, r + o));
								r += o;
							}
							if (e === 32) {
								(l = t.vps).push.apply(l, u);
							} else if (e === 33) {
								(a = t.sps).push.apply(a, u);
							} else if (e === 34) {
								(v = t.pps).push.apply(v, u);
							}
						}
					});
				}}, {key: "pasp", value: function (n) {
					return parseBox(n, false, function (n, t) {
						n.hSpacing = readBig32(t);
						n.vSpacing = readBig32(t, 4);
					});
				}}, {key: "mp4a", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						var u = parseAudioSampleEntry(t, i);
						t.esds = n.esds(n.findBox(i.subarray(u), ["esds"], r + u)[0]);
					});
				}}, {key: "esds", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var u;
						var f;
						n.codec = "mp4a.";
						var i = 0;
						var r = 0;
						var o = 0;
						for (var e = 0; t.length;) {
							i = 0;
							e = t[i];
							r = t[i + 1];
							for (i += 2; r & 128;) {
								o = (r & 127) << 7;
								r = t[i];
								i += 1;
							}
							o += r & 127;
							if (e === 3) {
								t = t.subarray(i + 3);
							} else if (e === 4) {
								n.codec += (t[i].toString(16) + ".").padStart(3, "0");
								t = t.subarray(i + 13);
							} else {
								if (e === 5) {
									u = n.config = t.subarray(i, i + o);
									f = (u[0] & 248) >> 3;
									if (f === 31 && u.length >= 2) {
										f = 32 + ((u[0] & 7) << 3) + ((u[1] & 224) >> 5);
									}
									n.objectType = f;
									n.codec += f.toString(16);
									if (n.codec[n.codec.length - 1] === ".") {
										n.codec = n.codec.substring(0, n.codec.length - 1);
									}
									return;
								}
								if (n.codec[n.codec.length - 1] === ".") {
									n.codec = n.codec.substring(0, n.codec.length - 1);
								}
								return;
							}
						}
					});
				}}, {key: "alaw", value: function (n) {
					return parseBox(n, false, function (n, t) {
						parseAudioSampleEntry(n, t);
					});
				}}, {key: "stts", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var r = readBig32(t);
						var u = [];
						var i = 4;
						for (var f = 0; f < r; f++) {
							u.push({count: readBig32(t, i), delta: readBig32(t, i + 4)});
							i += 8;
						}
						n.entryCount = r;
						n.entries = u;
					});
				}}, {key: "ctts", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var r = readBig32(t);
						var u = [];
						var i = 4;
						var f;
						var e;
						if (n.version === 1) {
							for (f = 0; f < r; f++) {
								u.push({count: readBig32(t, i), offset: readBig32(t, i + 4)});
								i += 8;
							}
						} else {
							for (e = 0; e < r; e++) {
								u.push({count: readBig32(t, i), offset: -(~readBig32(t, i + 4) + 1)});
								i += 8;
							}
						}
						n.entryCount = r;
						n.entries = u;
					});
				}}, {key: "stsc", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var r = readBig32(t);
						var u = [];
						var i = 4;
						for (var f = 0; f < r; f++) {
							u.push({firstChunk: readBig32(t, i), samplesPerChunk: readBig32(t, i + 4), sampleDescriptionIndex: readBig32(t, i + 8)});
							i += 12;
						}
						n.entryCount = r;
						n.entries = u;
					});
				}}, {key: "stsz", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var u = readBig32(t);
						var f = readBig32(t, 4);
						var e = [];
						var i;
						var r;
						if (!u) {
							i = 8;
							for (r = 0; r < f; r++) {
								e.push(readBig32(t, i));
								i += 4;
							}
						}
						n.sampleSize = u;
						n.sampleCount = f;
						n.entrySizes = e;
					});
				}}, {key: "stco", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = readBig32(t);
						var r = [];
						var u = 4;
						for (var f = 0; f < i; f++) {
							r.push(readBig32(t, u));
							u += 4;
						}
						n.entryCount = i;
						n.entries = r;
					});
				}}, {key: "co64", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = readBig32(t);
						var r = [];
						var u = 4;
						for (var f = 0; f < i; f++) {
							r.push(readBig64(t, u));
							u += 8;
						}
						n.entryCount = i;
						n.entries = r;
					});
				}}, {key: "stss", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var i = readBig32(t);
						var r = [];
						var u = 4;
						for (var f = 0; f < i; f++) {
							r.push(readBig32(t, u));
							u += 4;
						}
						n.entryCount = i;
						n.entries = r;
					});
				}}, {key: "moof", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.mfhd = n.mfhd(n.findBox(i, ["mfhd"], r)[0]);
						t.traf = n.findBox(i, ["traf"], r).map(function (t) {
							return n.traf(t);
						});
					});
				}}, {key: "mfhd", value: function (n) {
					return parseBox(n, true, function (n, t) {
						n.sequenceNumber = readBig32(t);
					});
				}}, {key: "traf", value: function (t) {
					return parseBox(t, false, function (t, i, r) {
						t.tfhd = n.tfhd(n.findBox(i, ["tfhd"], r)[0]);
						t.tfdt = n.tfdt(n.findBox(i, ["tfdt"], r)[0]);
						t.trun = n.trun(n.findBox(i, ["trun"], r)[0]);
					});
				}}, {key: "trun", value: function (n) {
					return parseBox(n, true, function (n, t) {
						var o = n.version;
						var r = n.flags;
						var f = t.length;
						var s = n.sampleCount = readBig32(t);
						var i = 4;
						var u;
						var e;
						if (f > i && r & 1) {
							n.dataOffset = -(~readBig32(t, i) + 1);
							i += 4;
						}
						if (f > i && r & 4) {
							n.firstSampleFlags = readBig32(t, i);
							i += 4;
						}
						n.samples = [];
						if (f > i) {
							for (e = 0; e < s; e++) {
								u = {};
								if (r & 256) {
									u.duration = readBig32(t, i);
									i += 4;
								}
								if (r & 512) {
									u.size = readBig32(t, i);
									i += 4;
								}
								if (r & 1024) {
									u.flags = readBig32(t, i);
									i += 4;
								}
								if (r & 2048) {
									u.cts = o ? readBig32(t, i) : -(~readBig32(t, i + 4) + 1);
									i += 4;
								}
								n.samples.push(u);
							}
						}
					});
				}}, {key: "tfdt", value: function (n) {
					return parseBox(n, true, function (n, t) {
						n.baseMediaDecodeTime = n.version === 1 ? readBig64(t) : readBig32(t);
					});
				}}, {key: "probe", value: function (t) {
					return !!n.findBox(t, ["ftyp"]);
				}}, {key: "parseSampleFlags", value: function (n) {
					return {isLeading: (n[0] & 12) >>> 2, dependsOn: n[0] & 3, isDependedOn: (n[1] & 192) >>> 6, hasRedundancy: (n[1] & 48) >>> 4, paddingValue: (n[1] & 14) >>> 1, isNonSyncSample: n[1] & 1, degradationPriority: n[2] << 8 | n[3]};
				}}, {key: "moovToTrack", value: function (n, t, i) {
					var tt;
					var it;
					var nt = n.trak;
					var o;
					var s;
					var rt;
					var h;
					var c;
					var u;
					var ut;
					var f;
					var v;
					var y;
					var p;
					var w;
					var ft;
					var et;
					var ot;
					var l;
					var a;
					var r;
					var st;
					var e;
					var b;
					var k;
					var d;
					var g;
					if (nt && nt.length) {
						o = nt.find(function (n) {
							var t;
							return ((t = n.mdia) === null || t === void 0 || (t = t.hdlr) === null || t === void 0 ? void 0 : t.handlerType) === "vide";
						});
						s = nt.find(function (n) {
							var t;
							return ((t = n.mdia) === null || t === void 0 || (t = t.hdlr) === null || t === void 0 ? void 0 : t.handlerType) === "soun";
						});
						if (o && t) {
							u = t;
							ut = (rt = o.tkhd) === null || rt === void 0 ? void 0 : rt.trackId;
							if (ut !== null && ut !== undefined) {
								u.id = o.tkhd.trackId;
							}
							u.tkhdDuration = o.tkhd.duration;
							u.mvhdDurtion = n.mvhd.duration;
							u.mvhdTimecale = n.mvhd.timescale;
							u.timescale = u.formatTimescale = o.mdia.mdhd.timescale;
							u.duration = o.mdia.mdhd.duration || u.mvhdDurtion / u.mvhdTimecale * u.timescale;
							f = o.mdia.minf.stbl.stsd.entries[0];
							u.width = f.width;
							u.height = f.height;
							if (f.pasp) {
								u.sarRatio = [f.pasp.hSpacing, f.pasp.vSpacing];
							}
							if (f.hvcC) {
								u.codecType = VideoCodecType.HEVC;
								u.codec = f.hvcC.codec;
								u.vps = f.hvcC.vps;
								u.sps = f.hvcC.sps;
								u.pps = f.hvcC.pps;
								u.hvcC = f.hvcC.data;
							} else if (f.avcC) {
								u.codec = f.avcC.codec;
								u.sps = f.avcC.sps;
								u.pps = f.avcC.pps;
							} else {
								throw new Error("unknown video stsd entry");
							}
							u.present = true;
							u.ext = {};
							u.ext.stss = (h = o.mdia) === null || h === void 0 || (h = h.minf) === null || h === void 0 || (h = h.stbl) === null || h === void 0 ? void 0 : h.stss;
							u.ext.ctts = (c = o.mdia) === null || c === void 0 || (c = c.minf) === null || c === void 0 || (c = c.stbl) === null || c === void 0 ? void 0 : c.ctts;
							if (f && f.type === "encv") {
								u.isVideoEncryption = true;
								f.default_KID = (v = f.sinf) === null || v === void 0 || (v = v.schi) === null || v === void 0 ? void 0 : v.tenc.default_KID;
								f.default_IsEncrypted = (y = f.sinf) === null || y === void 0 || (y = y.schi) === null || y === void 0 ? void 0 : y.tenc.default_IsEncrypted;
								f.default_IV_size = (p = f.sinf) === null || p === void 0 || (p = p.schi) === null || p === void 0 ? void 0 : p.tenc.default_IV_size;
								u.videoSenc = o.mdia.minf.stbl.senc && o.mdia.minf.stbl.senc.samples;
								f.data_format = (w = f.sinf) === null || w === void 0 || (w = w.frma) === null || w === void 0 ? void 0 : w.data_format;
								u.useEME = n.useEME;
								u.kidValue = n.kidValue;
								u.pssh = n.pssh;
								u.encv = f;
							}
						}
						if (s && i) {
							r = i;
							st = (ft = s.tkhd) === null || ft === void 0 ? void 0 : ft.trackId;
							if (st !== null && st !== undefined) {
								r.id = s.tkhd.trackId;
							}
							r.tkhdDuration = s.tkhd.duration;
							r.mvhdDurtion = n.mvhd.duration;
							r.mvhdTimecale = n.mvhd.timescale;
							r.timescale = r.formatTimescale = s.mdia.mdhd.timescale;
							r.duration = s.mdia.mdhd.duration || r.mvhdDurtion / r.mvhdTimecale * r.timescale;
							e = s.mdia.minf.stbl.stsd.entries[0];
							r.sampleSize = e.sampleSize;
							r.sampleRate = e.sampleRate;
							r.channelCount = e.channelCount;
							r.present = true;
							switch (e.type) {
								case "alaw":
									r.codecType = r.codec = AudioCodecType.G711PCMA;
									r.sampleRate = 8e3;
									break;
								case "ulaw":
									r.codecType = r.codec = AudioCodecType.G711PCMU;
									r.sampleRate = 8e3;
									break;
								default:
									r.sampleDuration = AAC.getFrameDuration(r.sampleRate, r.timescale);
									r.sampleRateIndex = AAC.getRateIndexByRate(r.sampleRate);
									r.objectType = ((tt = e.esds) === null || tt === void 0 ? void 0 : tt.objectType) || 2;
									if (e.esds) {
										r.config = Array.from(e.esds.config);
									}
									r.codec = ((it = e.esds) === null || it === void 0 ? void 0 : it.codec) || "mp4a.40.2";
							}
							r.sampleDuration = AAC.getFrameDuration(r.sampleRate, r.timescale);
							r.objectType = ((et = e.esds) === null || et === void 0 ? void 0 : et.objectType) || 2;
							if (e.esds) {
								if (e.esds.config) {
									r.config = Array.from(e.esds.config);
								} else {
									console.warn("esds config is null");
								}
							}
							r.codec = ((ot = e.esds) === null || ot === void 0 ? void 0 : ot.codec) || "mp4a.40.2";
							r.sampleRateIndex = AAC.getRateIndexByRate(r.sampleRate);
							r.ext = {};
							r.ext.stss = (l = s.mdia) === null || l === void 0 || (l = l.minf) === null || l === void 0 || (l = l.stbl) === null || l === void 0 ? void 0 : l.stss;
							r.ext.ctts = (a = s.mdia) === null || a === void 0 || (a = a.minf) === null || a === void 0 || (a = a.stbl) === null || a === void 0 ? void 0 : a.ctts;
							r.present = true;
							if (e && e.type === "enca") {
								r.isAudioEncryption = true;
								e.data_format = (b = e.sinf) === null || b === void 0 || (b = b.frma) === null || b === void 0 ? void 0 : b.data_format;
								e.default_KID = (k = e.sinf) === null || k === void 0 || (k = k.schi) === null || k === void 0 ? void 0 : k.tenc.default_KID;
								e.default_IsEncrypted = (d = e.sinf) === null || d === void 0 || (d = d.schi) === null || d === void 0 ? void 0 : d.tenc.default_IsEncrypted;
								e.default_IV_size = (g = e.sinf) === null || g === void 0 || (g = g.schi) === null || g === void 0 ? void 0 : g.tenc.default_IV_size;
								r.audioSenc = s.mdia.minf.stbl.senc && s.mdia.minf.stbl.senc.samples;
								r.useEME = n.useEME;
								r.kidValue = n.kidValue;
								r.enca = e;
							}
						}
						if (i) {
							i.isVideoEncryption = t ? t.isVideoEncryption : false;
						}
						if (t) {
							t.isAudioEncryption = i ? i.isAudioEncryption : false;
						}
						if (t !== null && t !== void 0 && t.encv || i !== null && i !== void 0 && i.enca) {
							var ht;
							var ct;
							var lt = t === null || t === void 0 || (ht = t.encv) === null || ht === void 0 ? void 0 : ht.default_KID;
							var at = i === null || i === void 0 || (ct = i.enca) === null || ct === void 0 ? void 0 : ct.default_KID;
							var vt = lt || at ? (lt || at).join("") : null;
							if (t) {
								t.kid = vt;
							}
							if (i) {
								i.kid = vt;
							}
						}
						if (t) {
							t.flags = 3841;
						}
						if (i) {
							i.flags = 1793;
						}
						return {videoTrack: t, audioTrack: i};
					}
				}}, {key: "evaluateDefaultDuration", value: function (n, t, i) {
					var r;
					var u = t === null || t === void 0 || (r = t.samples) === null || r === void 0 ? void 0 : r.length;
					var f;
					if (u) {
						f = 1024 * u / t.timescale;
						return f * n.timescale / i;
					} else {
						return 1024;
					}
				}}, {key: "moofToSamples", value: function (t, i, r) {
					var u = {};
					if (t.mfhd) {
						if (i) {
							i.sequenceNumber = t.mfhd.sequenceNumber;
						}
						if (r) {
							r.sequenceNumber = t.mfhd.sequenceNumber;
						}
					}
					t.traf.forEach(function (t) {
						var f = t.tfhd;
						var h = t.tfdt;
						var e = t.trun;
						var v;
						if (f && e) {
							if (h) {
								if (i && i.id === f.trackId) {
									i.baseMediaDecodeTime = h.baseMediaDecodeTime;
								}
								if (r && r.id === f.trackId) {
									r.baseMediaDecodeTime = h.baseMediaDecodeTime;
								}
							}
							var c = f.defaultSampleSize || 0;
							var l = f.defaultSampleDuration || n.evaluateDefaultDuration(i, r, e.samples.length || e.sampleCount);
							var s = e.dataOffset || 0;
							var o = 0;
							var a = -1;
							if (!e.samples.length && e.sampleCount) {
								u[f.trackId] = [];
								for (v = 0; v < e.sampleCount; v++) {
									u[f.trackId].push({offset: s, dts: o, duration: l, size: c});
									o += l;
									s += c;
								}
							} else {
								u[f.trackId] = e.samples.map(function (n, t) {
									n = {offset: s, dts: o, pts: o + (n.cts || 0), duration: n.duration || l, size: n.size || c, gopId: a, keyframe: t === 0 || n.flags !== null && n.flags !== undefined && (n.flags & 65536) >>> 0 != 65536};
									if (n.keyframe) {
										a++;
										n.gopId = a;
									}
									o += n.duration;
									s += n.size;
									return n;
								});
							}
						}
					});
					return u;
				}}, {key: "moovToSamples", value: function (n) {
					var e = n.trak;
					var o;
					var f;
					var h;
					var c;
					var i;
					var t;
					var r;
					var s;
					var u;
					if (e && e.length) {
						o = e.find(function (n) {
							var t;
							return ((t = n.mdia) === null || t === void 0 || (t = t.hdlr) === null || t === void 0 ? void 0 : t.handlerType) === "vide";
						});
						f = e.find(function (n) {
							var t;
							return ((t = n.mdia) === null || t === void 0 || (t = t.hdlr) === null || t === void 0 ? void 0 : t.handlerType) === "soun";
						});
						if (o || f) {
							if (o) {
								t = (i = o.mdia) === null || i === void 0 || (i = i.minf) === null || i === void 0 ? void 0 : i.stbl;
								if (!t) {
									return;
								}
								var l = t.stts;
								var a = t.stsc;
								var v = t.stsz;
								var y = t.stco;
								var p = t.stss;
								var g = t.ctts;
								if (!l || !a || !v || !y || !p) {
									return;
								}
								h = getSamples(l, a, v, y, g, p);
							}
							if (f) {
								u = (r = f.mdia) === null || r === void 0 || (r = r.minf) === null || r === void 0 ? void 0 : r.stbl;
								if (!u) {
									return;
								}
								var nt = (s = f.mdia.mdhd) === null || s === void 0 ? void 0 : s.timescale;
								var w = u.stts;
								var b = u.stsc;
								var k = u.stsz;
								var d = u.stco;
								if (!nt || !w || !b || !k || !d) {
									return;
								}
								c = getSamples(w, b, k, d);
							}
							return {videoSamples: h, audioSamples: c};
						}
					}
				}}]);
			}();
			padStart = function (n, t, i) {
				var r = String(i);
				var u = t >> 0;
				var o = Math.ceil(u / r.length);
				var f = [];
				for (var e = String(n); o--;) {
					f.push(r);
				}
				return f.join("").substring(0, u - e.length) + e;
			};
			toHex = function () {
				var t = [];
				var i = arguments.length;
				var r = new Array(i);
				for (var n = 0; n < i; n++) {
					r[n] = arguments[n];
				}
				r.forEach(function (n) {
					t.push(padStart(Number(n).toString(16), 2, 0));
				});
				return t[0];
			};
			var Buffer = function () {
				function n() {
					_classCallCheck(this, n);
					this.buffer = new Uint8Array(0);
				}
				return _createClass(n, [{key: "write", value: function () {
					var t = this;
					var i = arguments.length;
					var r = new Array(i);
					for (var n = 0; n < i; n++) {
						r[n] = arguments[n];
					}
					r.forEach(function (n) {
						if (n) {
							t.buffer = Concat(Uint8Array, t.buffer, n);
						} else {
							window.console.warn(n);
						}
					});
				}}], [{key: "writeUint16", value: function (n) {
					return new Uint8Array([n >> 8 & 255, n & 255]);
				}}, {key: "writeUint32", value: function (n) {
					return new Uint8Array([n >> 24, n >> 16 & 255, n >> 8 & 255, n & 255]);
				}}]);
			}();
			var UINT32_MAX = Math.pow(2, 32) - 1;
			var MP4 = function () {
				function n() {
					_classCallCheck(this, n);
				}
				return _createClass(n, null, [{key: "box", value: function (n) {
					var f = arguments.length;
					var r = new Array(f > 1 ? f - 1 : 0);
					for (var u = 1; u < f; u++) {
						r[u - 1] = arguments[u];
					}
					r = r.filter(Boolean);
					var i = 8 + r.reduce(function (n, t) {
						return n + t.byteLength;
					}, 0);
					var t = new Uint8Array(i);
					t[0] = i >> 24 & 255;
					t[1] = i >> 16 & 255;
					t[2] = i >> 8 & 255;
					t[3] = i & 255;
					t.set(n, 4);
					var e = 8;
					r.forEach(function (n) {
						t.set(n, e);
						e += n.byteLength;
					});
					return t;
				}}, {key: "ftyp", value: function (t) {
					var i = t.find(function (n) {
						return n.type === TrackType.VIDEO && n.codecType === VideoCodecType.HEVC;
					});
					if (i) {
						return n.FTYPHEV1;
					} else {
						return n.FTYPAVC1;
					}
				}}, {key: "initSegment", value: function (t) {
					var i = n.ftyp(t);
					return concatUint8Array(i, n.moov(t));
				}}, {key: "pssh", value: function (t) {
					var i = new Uint8Array([1, 0, 0, 0].concat([16, 119, 239, 236, 192, 178, 77, 2, 172, 227, 60, 30, 82, 226, 251, 75], [0, 0, 0, 1], parse(t.kid), [0, 0, 0, 0]));
					return n.box(n.types.pssh, i);
				}}, {key: "moov", value: function (t) {
					if (t[0].useEME && (t[0].encv || t[0].enca)) {
						if (!t[0].pssh) {
							t[0].pssh = {kid: t[0].kid};
						}
						var i = this.pssh(t[0].pssh);
						return n.box.apply(n, [n.types.moov, n.mvhd(t[0].mvhdDurtion || t[0].duration, t[0].mvhdTimecale || t[0].timescale), n.mvex(t)].concat(_toConsumableArray(t.map(function (t) {
							return n.trak(t);
						})), [i]));
					}
					return n.box.apply(n, [n.types.moov, n.mvhd(t[0].mvhdDurtion || t[0].duration, t[0].mvhdTimecale || t[0].timescale)].concat(_toConsumableArray(t.map(function (t) {
						return n.trak(t);
					})), [n.mvex(t)]));
				}}, {key: "mvhd", value: function (t) {
					var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9e4;
					return n.box(n.types.mvhd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255]));
				}}, {key: "trak", value: function (t) {
					return n.box(n.types.trak, n.tkhd(t.id, t.tkhdDuration || 0, t.width, t.height), n.mdia(t));
				}}, {key: "tkhd", value: function (t, i) {
					var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
					var u = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
					return n.box(n.types.tkhd, new Uint8Array([0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255, 0, 0, 0, 0, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, r >> 8 & 255, r & 255, 0, 0, u >> 8 & 255, u & 255, 0, 0]));
				}}, {key: "mdia", value: function (t) {
					return n.box(n.types.mdia, n.mdhd(t.duration, t.timescale), n.hdlr(t.type), n.minf(t));
				}}, {key: "mdhd", value: function (t) {
					var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9e4;
					return n.box(n.types.mdhd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255, 85, 196, 0, 0]));
				}}, {key: "hdlr", value: function (t) {
					return n.box(n.types.hdlr, n.HDLR_TYPES[t]);
				}}, {key: "minf", value: function (t) {
					return n.box(n.types.minf, t.type === TrackType.VIDEO ? n.VMHD : n.SMHD, n.DINF, n.stbl(t));
				}}, {key: "stbl", value: function (t) {
					var i = [];
					if (t && t.ext && t.ext.stss) {
						i.push(n.stss(t.ext.stss.entries));
					}
					return n.box(n.types.stbl, n.stsd(t), n.STTS, i[0], n.STSC, n.STSZ, n.STCO);
				}}, {key: "stsd", value: function (t) {
					var i = t.type === "audio" ? t.useEME && t.enca ? n.enca(t) : n.mp4a(t) : t.useEME && t.encv ? n.encv(t) : n.avc1hev1(t);
					return n.box(n.types.stsd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]), i);
				}}, {key: "enca", value: function (t) {
					var r = t.enca.channelCount;
					var i = t.enca.sampleRate;
					var u = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, r, 0, 16, 0, 0, 0, 0, i >> 8 & 255, i & 255, 0, 0]);
					var f = n.esds(t.config);
					var e = n.sinf(t.enca);
					return n.box(n.types.enca, u, f, e);
				}}, {key: "encv", value: function (t) {
					var e;
					var o;
					var i = t.sps.length > 0 ? t.sps[0] : [];
					var f = t.pps.length > 0 ? t.pps[0] : [];
					var s = t.width;
					var h = t.height;
					var r = t.sarRatio[0];
					var u = t.sarRatio[1];
					var c = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, s >> 8 & 255, s & 255, h >> 8 & 255, h & 255, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 18, 100, 97, 105, 108, 121, 109, 111, 116, 105, 111, 110, 47, 104, 108, 115, 46, 106, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]);
					var l = new Uint8Array((e = (o = [1, i[1], i[2], i[3], 255, 225, i.length >>> 8 & 255, i.length & 255]).concat.apply(o, _toConsumableArray(i)).concat([1, f.length >>> 8 & 255, f.length & 255])).concat.apply(e, _toConsumableArray(f)));
					var a = new Uint8Array([0, 0, 88, 57, 0, 15, 200, 192, 0, 4, 86, 72]);
					var v = n.sinf(t.encv);
					var y = new Uint8Array([r >> 24, r >> 16 & 255, r >> 8 & 255, r & 255, u >> 24, u >> 16 & 255, u >> 8 & 255, u & 255]);
					return n.box(n.types.encv, c, n.box(n.types.avcC, l), n.box(n.types.btrt, a), v, n.box(n.types.pasp, y));
				}}, {key: "schi", value: function (t) {
					var i = new Uint8Array([]);
					var r = n.tenc(t);
					return n.box(n.types.schi, i, r);
				}}, {key: "tenc", value: function (t) {
					var i = new Uint8Array([0, 0, 0, 0, 0, 0, t.default_IsEncrypted & 255, t.default_IV_size & 255].concat(parse(t.default_KID)));
					return n.box(n.types.tenc, i);
				}}, {key: "sinf", value: function (t) {
					var i = new Uint8Array([]);
					var r = new Uint8Array([t.data_format.charCodeAt(0), t.data_format.charCodeAt(1), t.data_format.charCodeAt(2), t.data_format.charCodeAt(3)]);
					var u = new Uint8Array([0, 0, 0, 0, 99, 101, 110, 99, 0, 1, 0, 0]);
					var f = n.schi(t);
					return n.box(n.types.sinf, i, n.box(n.types.frma, r), n.box(n.types.schm, u), f);
				}}, {key: "avc1hev1", value: function (t) {
					var i = t.codecType === VideoCodecType.HEVC;
					var u = i ? n.types.hvc1 : n.types.avc1;
					var f = i ? n.hvcC(t) : n.avcC(t);
					var r = [new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t.width >> 8 & 255, t.width & 255, t.height >> 8 & 255, t.height & 255, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]), f];
					if (i) {
						r.push(n.box(n.types.fiel, new Uint8Array([1, 0])));
					} else if (t.sarRatio && t.sarRatio.length > 1) {
						r.push(n.pasp(t.sarRatio));
					}
					return n.box.apply(n, [u].concat(r));
				}}, {key: "avcC", value: function (t) {
					var f;
					var e;
					var i = [];
					var u = [];
					var r;
					t.sps.forEach(function (n) {
						r = n.byteLength;
						i.push(r >>> 8 & 255);
						i.push(r & 255);
						i.push.apply(i, _toConsumableArray(n));
					});
					t.pps.forEach(function (n) {
						r = n.byteLength;
						u.push(r >>> 8 & 255);
						u.push(r & 255);
						u.push.apply(u, _toConsumableArray(n));
					});
					return n.box(n.types.avcC, new Uint8Array((f = (e = [1, i[3], i[4], i[5], 255, 224 | t.sps.length]).concat.apply(e, i).concat([t.pps.length])).concat.apply(f, u)));
				}}, {key: "hvcC", value: function (t) {
					var i = t.hvcC;
					var h;
					if (i instanceof ArrayBuffer || i instanceof Uint8Array) {
						return i;
					}
					var f = t.vps;
					var e = t.sps;
					var o = t.pps;
					var r;
					if (i) {
						var s = i.generalProfileCompatibilityFlags;
						var u = i.generalConstraintIndicatorFlags;
						var c = (f.length && 1) + (e.length && 1) + (o.length && 1);
						r = [1, i.generalProfileSpace << 6 | i.generalTierFlag << 5 | i.generalProfileIdc, s >>> 24, s >>> 16, s >>> 8, s, u[0], u[1], u[2], u[3], u[4], u[5], i.generalLevelIdc, 240, 0, 252, i.chromaFormatIdc | 252, i.bitDepthLumaMinus8 | 248, i.bitDepthChromaMinus8 | 248, 0, 0, i.numTemporalLayers << 3 | i.temporalIdNested << 2 | 3, c];
						h = function (n) {
							var t;
							r.push(n.length >> 8, n.length);
							(t = r).push.apply(t, _toConsumableArray(n));
						};
						if (f.length) {
							r.push(160, 0, f.length);
							f.forEach(h);
						}
						if (e.length) {
							r.push(161, 0, e.length);
							e.forEach(h);
						}
						if (o.length) {
							r.push(162, 0, o.length);
							o.forEach(h);
						}
					} else {
						r = [1, 1, 96, 0, 0, 0, 144, 0, 0, 0, 0, 0, 93, 240, 0, 252, 253, 248, 248, 0, 0, 15, 3, 160, 0, 1, 0, 24, 64, 1, 12, 1, 255, 255, 1, 96, 0, 0, 3, 0, 144, 0, 0, 3, 0, 0, 3, 0, 93, 153, 152, 9, 161, 0, 1, 0, 45, 66, 1, 1, 1, 96, 0, 0, 3, 0, 144, 0, 0, 3, 0, 0, 3, 0, 93, 160, 2, 128, 128, 45, 22, 89, 153, 164, 147, 43, 154, 128, 128, 128, 130, 0, 0, 3, 0, 2, 0, 0, 3, 0, 50, 16, 162, 0, 1, 0, 7, 68, 1, 193, 114, 180, 98, 64];
					}
					return n.box(n.types.hvcC, new Uint8Array(r));
				}}, {key: "pasp", value: function (t) {
					var u = _slicedToArray(t, 2);
					var i = u[0];
					var r = u[1];
					return n.box(n.types.pasp, new Uint8Array([i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255, r >> 24, r >> 16 & 255, r >> 8 & 255, r & 255]));
				}}, {key: "mp4a", value: function (t) {
					return n.box(n.types.mp4a, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, t.channelCount, 0, 16, 0, 0, 0, 0, t.sampleRate >> 8 & 255, t.sampleRate & 255, 0, 0]), t.config.length ? n.esds(t.config) : undefined);
				}}, {key: "esds", value: function (t) {
					var i = t.length;
					return n.box(n.types.esds, new Uint8Array([0, 0, 0, 0, 3, 23 + i, 0, 0, 0, 4, 15 + i, 64, 21, 0, 6, 0, 0, 0, 218, 192, 0, 0, 218, 192, 5].concat([i]).concat(t).concat([6, 1, 2])));
				}}, {key: "mvex", value: function (t) {
					return n.box.apply(n, [n.types.mvex].concat(_toConsumableArray(t.map(function (t) {
						return n.trex(t.id);
					}))));
				}}, {key: "trex", value: function (t) {
					return n.box(n.types.trex, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]));
				}}, {key: "trex1", value: function (t) {
					return n.box(n.types.trex, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0]));
				}}, {key: "trex2", value: function (t) {
					return n.box(n.types.trex, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0]));
				}}, {key: "moof", value: function (t) {
					return n.box.apply(n, [n.types.moof, n.mfhd(t[0].samples ? t[0].samples[0].gopId : 0)].concat(_toConsumableArray(t.map(function (t) {
						return n.traf(t);
					}))));
				}}, {key: "mfhd", value: function (t) {
					return n.box(n.types.mfhd, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255]));
				}}, {key: "traf", value: function (t) {
					var r = n.tfhd(t.id);
					var u = n.tfdt(t, t.baseMediaDecodeTime);
					var i = 0;
					var e;
					var s;
					var h;
					var c;
					if (t.isVideo && t.videoSenc) {
						e = t.videoSenc;
						e.forEach(function (n) {
							i = i + 8;
							if (n.subsamples && n.subsamples.length) {
								i = i + 2;
								i = i + n.subsamples.length * 6;
							}
						});
					}
					t.videoSencLength = i;
					if (t.useEME && (t.isVideoEncryption || t.isAudioEncryption)) {
						if (t.isVideoEncryption) {
							if (t.isVideo) {
								var l = n.saiz(t);
								var a = n.saio(t);
								var v = n.trun1(t);
								var y = n.senc(t);
								return n.box(n.types.traf, r, u, l, a, v, y);
							}
							if (t.isAudioEncryption) {
								var p = n.sbgp();
								var w = n.saiz(t);
								var b = n.saio(t);
								var k = n.senc(t);
								var d = n.trun1(t);
								return n.box(n.types.traf, r, u, p, w, b, k, d);
							}
							s = n.sbgp();
							h = n.trun1(t);
							return n.box(n.types.traf, r, u, s, h);
						}
						if (t.isVideo) {
							c = n.trun1(t);
							return n.box(n.types.traf, r, u, c);
						}
						var g = n.sbgp();
						var nt = n.saiz(t);
						var tt = n.saio(t);
						var it = n.senc(t);
						var rt = n.trun1(t);
						return n.box(n.types.traf, r, u, g, nt, tt, it, rt);
					}
					var f = n.sdtp(t);
					var o = 76;
					return n.box(n.types.traf, r, u, f, n.trun(t.samples, f.byteLength + o));
				}}, {key: "sdtp", value: function (t) {
					var i = new Buffer;
					t.samples.forEach(function (n) {
						i.write(new Uint8Array(t.isVideo ? [n.keyframe ? 32 : 16] : [16]));
					});
					return n.box(n.types.sdtp, this.extension(0, 0), i.buffer);
				}}, {key: "trun1", value: function (t) {
					var i = new Buffer;
					var e = Buffer.writeUint32(t.samples.length);
					var r = null;
					var f;
					var u;
					if (t.isVideo) {
						f = t.videoSencLength;
						r = Buffer.writeUint32(t.samples.length * 16 + f + 149);
						if (!t.isVideoEncryption && t.isAudioEncryption) {
							r = Buffer.writeUint32(t.samples.length * 16 + 92);
						}
					} else {
						u = t.samples.length * 12 + 124;
						if (t.isAudioEncryption) {
							u = t.samples.length * 12 + 8 * t.audioSenc.length + 177;
						}
						r = Buffer.writeUint32(u);
					}
					t.samples.forEach(function (n) {
						i.write(Buffer.writeUint32(n.duration));
						i.write(Buffer.writeUint32(n.size));
						i.write(Buffer.writeUint32(n.keyframe ? 33554432 : 65536));
						if (t.isVideo) {
							i.write(Buffer.writeUint32(n.cts ? n.cts : 0));
						}
					});
					return n.box(n.types.trun, this.extension(0, t.flags), e, r, i.buffer);
				}}, {key: "senc", value: function (t) {
					var i = new Buffer;
					var f = t.samples.length;
					var e = t.isVideo ? 16 : 8;
					var o = t.isVideo ? 2 : 0;
					var u = [];
					var r = 0;
					if (t.isVideo) {
						u = t.videoSenc;
						r = t.videoSencLength;
					} else {
						u = t.audioSenc;
					}
					r = r || e * f;
					i.write(Buffer.writeUint32(16 + r), n.types.senc, this.extension(0, o));
					i.write(Buffer.writeUint32(f));
					u.forEach(function (n) {
						for (var t = 0; t < n.InitializationVector.length; t++) {
							i.write(new Uint8Array([n.InitializationVector[t]]));
						}
						if (n.subsamples && n.subsamples.length) {
							i.write(Buffer.writeUint16(n.subsamples.length));
							n.subsamples.forEach(function (n) {
								i.write(Buffer.writeUint16(n.BytesOfClearData));
								i.write(Buffer.writeUint32(n.BytesOfProtectedData));
							});
						}
					});
					return i.buffer;
				}}, {key: "saio", value: function (t) {
					var i = t.samples.length * 12 + 141;
					if (!t.isVideo && t.isAudioEncryption) {
						i = 149;
					}
					var r = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255]);
					return n.box(n.types.saio, r);
				}}, {key: "saiz", value: function (t) {
					var i = t.samples.length;
					var r = new Uint8Array([0, 0, 0, 0, 16, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255]);
					return n.box(n.types.saiz, r);
				}}, {key: "sbgp", value: function () {
					var t = new Uint8Array([114, 111, 108, 108, 0, 0, 0, 1, 0, 0, 1, 25, 0, 0, 0, 1]);
					return n.box(n.types.sbgp, this.extension(0, 0), t);
				}}, {key: "extension", value: function (n, t) {
					return new Uint8Array([n, t >> 16 & 255, t >> 8 & 255, t & 255]);
				}}, {key: "tfhd", value: function (t) {
					return n.box(n.types.tfhd, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255]));
				}}, {key: "tfdt", value: function (t, i) {
					var u = Math.floor(i / (UINT32_MAX + 1));
					var r = Math.floor(i % (UINT32_MAX + 1));
					if (t.useEME && (t.isVideoEncryption || t.isAudioEncryption)) {
						return n.box(n.types.tfdt, new Uint8Array([0, 0, 0, 0, r >> 24, r >> 16 & 255, r >> 8 & 255, r & 255]));
					} else {
						return n.box(n.types.tfdt, new Uint8Array([1, 0, 0, 0, u >> 24, u >> 16 & 255, u >> 8 & 255, u & 255, r >> 24, r >> 16 & 255, r >> 8 & 255, r & 255]));
					}
				}}, {key: "trun", value: function (t, i) {
					var u = t.length;
					var l = 12 + 16 * u;
					i += 8 + l;
					var e = new Uint8Array(l);
					e.set([0, 0, 15, 1, u >>> 24 & 255, u >>> 16 & 255, u >>> 8 & 255, u & 255, i >>> 24 & 255, i >>> 16 & 255, i >>> 8 & 255, i & 255], 0);
					for (var f = 0; f < u; f++) {
						var o = t[f];
						var s = o.duration;
						var h = o.size;
						var a = o.flag;
						var r = a === void 0 ? {} : a;
						var v = o.cts;
						var c = v === void 0 ? 0 : v;
						e.set([s >>> 24 & 255, s >>> 16 & 255, s >>> 8 & 255, s & 255, h >>> 24 & 255, h >>> 16 & 255, h >>> 8 & 255, h & 255, r.isLeading << 2 | (r.dependsOn === null || r.dependsOn === undefined ? 1 : r.dependsOn), r.isDependedOn << 6 | r.hasRedundancy << 4 | r.paddingValue << 1 | (r.isNonSyncSample === null || r.isNonSyncSample === undefined ? 1 : r.isNonSyncSample), r.degradationPriority & 61440, r.degradationPriority & 15, c >>> 24 & 255, c >>> 16 & 255, c >>> 8 & 255, c & 255], 12 + 16 * f);
					}
					return n.box(n.types.trun, e);
				}}, {key: "moovMP4", value: function (t) {
					var r = t.length - 1;
					var i = t[r];
					var u = Math.ceil(i.duration / i.timescale * 1e3);
					return n.box.apply(n, [n.types.moov, n.mvhd(u, 1e3)].concat(_toConsumableArray(t.map(function (t) {
						return n.trackMP4(t);
					}))));
				}}, {key: "trackMP4", value: function (t) {
					var i = Math.ceil(t.duration / t.timescale * 1e3);
					return n.box(n.types.trak, n.tkhd(t.id, i, t.width, t.height), n.mdiaMP4(t));
				}}, {key: "mdiaMP4", value: function (t) {
					return n.box(n.types.mdia, n.mdhd(t.duration, t.timescale), n.hdlr(t.type), n.minfMP4(t));
				}}, {key: "minfMP4", value: function (t) {
					return n.box(n.types.minf, t.type === TrackType.VIDEO ? n.VMHD : n.SMHD, n.DINF, n.stblMP4(t));
				}}, {key: "stblMP4", value: function (t) {
					var i = t.ext;
					var r = [n.stsd(t), n.stts(i.stts), n.stsc(i.stsc), n.stsz(i.stsz), n.stco(i.stco)];
					if (i.stss.length) {
						r.push(n.stss(i.stss));
					}
					if (i.ctts.length) {
						r.push(n.ctts(i.ctts));
					}
					return n.box.apply(n, [n.types.stbl].concat(r));
				}}, {key: "stts", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(8 * i);
					var u = 0;
					t.forEach(function (n) {
						var t = n.value;
						var i = n.count;
						r.set([i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255], u);
						u += 8;
					});
					return n.box(n.types.stts, concatUint8Array(new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "stsc", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(12 * i);
					var u = 0;
					t.forEach(function (n) {
						var t = n.firstChunk;
						var i = n.samplesPerChunk;
						var f = n.sampleDescIndex;
						r.set([t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255, f >> 24, f >> 16 & 255, f >> 8 & 255, f & 255], u);
						u += 12;
					});
					return n.box(n.types.stsc, concatUint8Array(new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "stsz", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(4 * i);
					var u = 0;
					t.forEach(function (n) {
						r.set([n >> 24, n >> 16 & 255, n >> 8 & 255, n & 255], u);
						u += 4;
					});
					return n.box(n.types.stsz, concatUint8Array(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "stco", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(4 * i);
					var u = 0;
					t.forEach(function (n) {
						r.set([n >> 24, n >> 16 & 255, n >> 8 & 255, n & 255], u);
						u += 4;
					});
					return n.box(n.types.stco, concatUint8Array(new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "stss", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(4 * i);
					var u = 0;
					t.forEach(function (n) {
						r.set([n >> 24, n >> 16 & 255, n >> 8 & 255, n & 255], u);
						u += 4;
					});
					return n.box(n.types.stss, concatUint8Array(new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "ctts", value: function (t) {
					var i = t.length;
					var r = new Uint8Array(8 * i);
					var u = 0;
					t.forEach(function (n) {
						var t = n.value;
						var i = n.count;
						r.set([i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255, t >> 24, t >> 16 & 255, t >> 8 & 255, t & 255], u);
						u += 8;
					});
					return n.box(n.types.ctts, concatUint8Array(new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, i & 255]), r));
				}}, {key: "styp", value: function () {
					return n.box(n.types.styp, new Uint8Array([109, 115, 100, 104, 0, 0, 0, 0, 109, 115, 100, 104, 109, 115, 105, 120]));
				}}, {key: "sidx", value: function (t) {
					var f = t.timescale;
					var s = t.samples[0].duration;
					var e = s * t.samples.length;
					var o = t.samples[0].sampleOffset * s;
					var u = 8;
					var i;
					var h;
					t.samples.forEach(function (n) {
						u += n.size;
					});
					var r = 0;
					if (t.isVideo) {
						i = 0;
						if (t.videoSenc) {
							h = t.videoSenc;
						}
						if (t.isVideo) {
							h.forEach(function (n) {
								i = i + 8;
								if (n.subsamples && n.subsamples.length) {
									i = i + 2;
									i = i + n.subsamples.length * 6;
								}
							});
						}
						t.videoSencLength = i;
						r = u + 141 + t.samples.length * 16 + i;
						if (t.useEME && t.isAudioEncryption && !t.isVideoEncryption) {
							r = u + t.samples.length * 16 + 84;
						}
					} else {
						r = u + 116 + t.samples.length * 12;
						if (t.useEME && t.isAudioEncryption) {
							r = u + 169 + t.samples.length * 12 + 8 * t.audioSenc.length;
						}
					}
					var c = new Uint8Array([0, 0, 0, 0, 0, 0, 0, t.id & 255, f >> 24 & 255, f >> 16 & 255, f >> 8 & 255, f & 255, o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, o & 255, 0, 0, 0, 0, 0, 0, 0, 1, 0, r >> 16 & 255, r >> 8 & 255, r & 255, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255, 144, 0, 0, 0]);
					return n.box(n.types.sidx, c);
				}}, {key: "mdat", value: function (t) {
					return n.box(n.types.mdat, t);
				}}]);
			}();
			_MP = MP4;
			_defineProperty(MP4, "types", ["avc1", "avcC", "hvc1", "hvcC", "dinf", "dref", "esds", "ftyp", "hdlr", "mdat", "mdhd", "mdia", "mfhd", "minf", "moof", "moov", "mp4a", "mvex", "mvhd", "pasp", "stbl", "stco", "stsc", "stsd", "stsz", "stts", "tfdt", "tfhd", "traf", "trak", "trex", "tkhd", "vmhd", "smhd", "ctts", "stss", "styp", "pssh", "sidx", "sbgp", "saiz", "saio", "senc", "trun", "encv", "enca", "sinf", "btrt", "frma", "tenc", "schm", "schi", "mehd", "fiel", "sdtp"].reduce(function (n, t) {
				n[t] = [t.charCodeAt(0), t.charCodeAt(1), t.charCodeAt(2), t.charCodeAt(3)];
				return n;
			}, Object.create(null)));
			_defineProperty(MP4, "HDLR_TYPES", {video: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0]), audio: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0])});
			_defineProperty(MP4, "FTYPAVC1", _MP.box(_MP.types.ftyp, new Uint8Array([105, 115, 111, 109, 0, 0, 0, 1, 105, 115, 111, 109, 97, 118, 99, 49])));
			_defineProperty(MP4, "FTYPHEV1", _MP.box(_MP.types.ftyp, new Uint8Array([105, 115, 111, 109, 0, 0, 0, 1, 105, 115, 111, 109, 104, 101, 118, 49])));
			_defineProperty(MP4, "DINF", _MP.box(_MP.types.dinf, _MP.box(_MP.types.dref, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1]))));
			_defineProperty(MP4, "VMHD", _MP.box(_MP.types.vmhd, new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0])));
			_defineProperty(MP4, "SMHD", _MP.box(_MP.types.smhd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])));
			_defineProperty(MP4, "StblTable", new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]));
			_defineProperty(MP4, "STTS", _MP.box(_MP.types.stts, _MP.StblTable));
			_defineProperty(MP4, "STSC", _MP.box(_MP.types.stsc, _MP.StblTable));
			_defineProperty(MP4, "STSZ", _MP.box(_MP.types.stsz, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])));
			_defineProperty(MP4, "STCO", _MP.box(_MP.types.stco, _MP.StblTable));
			var FMP4Demuxer = function () {
				function n(t, i, r) {
					_classCallCheck(this, n);
					this.videoTrack = t || new VideoTrack;
					this.audioTrack = i || new AudioTrack;
					this.metadataTrack = r || new MetadataTrack;
				}
				return _createClass(n, [{key: "demux", value: function (n, t) {
					var r = this.videoTrack;
					var i = this.audioTrack;
					var e = r.exist();
					var o = i.exist();
					var u;
					var f;
					r.samples = [];
					i.samples = [];
					if (t && !o) {
						u = MP4Parser.findBox(t, ["moov"])[0];
						if (!u) {
							throw new Error("cannot found moov box");
						}
						MP4Parser.moovToTrack(MP4Parser.moov(u), r, i);
					}
					if (n && !e) {
						f = MP4Parser.findBox(n, ["moov"])[0];
						if (!f) {
							throw new Error("cannot found moov box");
						}
						MP4Parser.moovToTrack(MP4Parser.moov(f), r, i);
					}
					if (t) {
						MP4Parser.findBox(t, ["moof"]).forEach(function (n) {
							var u = MP4Parser.moofToSamples(MP4Parser.moof(n), r, i)[i.id];
							var e = i.baseMediaDecodeTime;
							var f;
							if (u) {
								f = n.start;
								u.map(function (n) {
									n.offset += f;
									var r = t.subarray(n.offset, n.offset + n.size);
									i.samples.push(new AudioSample(n.dts + e, r, n.duration));
								});
							}
						});
					}
					if (n) {
						MP4Parser.findBox(n, ["moof"]).forEach(function (t) {
							var u = MP4Parser.moofToSamples(MP4Parser.moof(t), r, i);
							var e = r.baseMediaDecodeTime;
							var s = i.baseMediaDecodeTime;
							var o = t.start;
							var f;
							Object.keys(u).forEach(function (t) {
								if (r.id == t) {
									u[t].map(function (t) {
										t.offset += o;
										var i = new VideoSample((t.pts || t.dts) + e, t.dts + e);
										i.duration = t.duration;
										i.gopId = t.gopId;
										if (t.keyframe) {
											i.setToKeyframe();
										}
										var s = n.subarray(t.offset, t.offset + t.size);
										i.data = s;
										var u = 0;
										for (var h = s.length - 1; u < h;) {
											f = readBig32(s, u);
											u += 4;
											i.units.push(s.subarray(u, u + f));
											u += f;
										}
										r.samples.push(i);
									});
								} else if (i.id == t) {
									u[t].map(function (t) {
										t.offset += o;
										var r = n.subarray(t.offset, t.offset + t.size);
										i.samples.push(new AudioSample(t.dts + s, r, t.duration));
									});
								}
							});
						});
					}
					if (t && n) {
						r.id = 1;
						i.id = 2;
					}
					return {videoTrack: r, audioTrack: i, metadataTrack: this.metadataTrack};
				}}, {key: "reset", value: function () {
					this.videoTrack.reset();
					this.audioTrack.reset();
					this.metadataTrack.reset();
				}}], [{key: "probe", value: function (n) {
					return MP4Parser.probe(n);
				}}]);
			}();
			var MP4Remuxer = function () {
				function n(t, i) {
					_classCallCheck(this, n);
					this.videoTrack = t;
					this.audioTrack = i;
				}
				return _createClass(n, [{key: "remux", value: function (n, t) {
					this.videoTrack = n || this.videoTrack;
					this.audioTrack = t || this.audioTrack;
					var r = (n === null || n === void 0 ? void 0 : n.exist()) && (n === null || n === void 0 ? void 0 : n.hasSample());
					var u = (t === null || t === void 0 ? void 0 : t.exist()) && (t === null || t === void 0 ? void 0 : t.hasSample());
					var i;
					var f;
					if (r && u) {
						i = this._remuxMix(n, t);
					} else if (r) {
						i = this._remuxTrack(n);
					} else if (u) {
						f = this._remuxTrack(t);
					}
					if (n) {
						n.samples = [];
					}
					if (t) {
						t.samples = [];
					}
					return {videoSegment: i, audioSegment: f};
				}}, {key: "_remuxMix", value: function (n, t) {
					var i = MP4.ftyp([n, t]);
					var r = this._remuxData(n, i.byteLength + 8);
					var u = r.mdatData;
					var f = r.chunkOffset;
					var e = this._remuxData(t, f);
					var o = e.mdatData;
					var s = MP4.mdat(concatUint8Array(u, o));
					var h = MP4.moovMP4([n, t]);
					n.ext = undefined;
					t.ext = undefined;
					n.samples = [];
					t.samples = [];
					return concatUint8Array(i, s, h);
				}}, {key: "_remuxTrack", value: function (n) {
					var t = MP4.ftyp([n]);
					var i = this._remuxData(n, t.byteLength + 8);
					var r = i.mdatData;
					var u = MP4.mdat(r);
					var f = MP4.moovMP4([n]);
					n.ext = undefined;
					n.samples = [];
					return concatUint8Array(t, u, f);
				}}, {key: "_remuxData", value: function (n, t) {
					var c = this;
					var e = n.type === TrackType.VIDEO;
					var o = n.samples;
					var s = 0;
					var l;
					if (e) {
						o.forEach(function (n) {
							s += n.units.reduce(function (n, t) {
								return n + t.byteLength;
							}, 0);
							s += n.units.length * 4;
						});
					} else {
						s = o.reduce(function (n, t) {
							return n + t.size;
						}, 0);
					}
					var h = new Uint8Array(s);
					var p = new DataView(h.buffer);
					var i = n.ext = {stts: [], stsc: [], stsz: [], stco: [], stss: [], ctts: []};
					var a = 1;
					var f = 0;
					var v = 0;
					var r;
					var y = o.length;
					var w = function () {
						r = o[u];
						v += r.duration;
						var n = e ? 0 : r.size;
						if (e) {
							r.units.forEach(function (t) {
								p.setUint32(f, t.byteLength);
								f += 4;
								h.set(t, f);
								f += t.byteLength;
								n += 4 + t.byteLength;
							});
						} else {
							h.set(r.data, f);
							f += n;
						}
						r.size = n;
						i.stsz.push(n);
						if (e) {
							c._fillCttsSamples(i.ctts, r.cts);
						}
						c._fillSttsSamples(i.stts, r, o[u + 1]);
						c._fillStcoSamples(i.stco, u, a, t);
						t += n;
						if (e && r.keyframe) {
							i.stss.push(u + 1);
						}
					};
					for (var u = 0; u < y; u++) {
						w();
					}
					n.duration = v;
					this._fillStscSamples(i.stsc, y, a);
					if (i.ctts.length) {
						i.ctts = i.ctts.map(function (n) {
							n.value = -(~n.value + 1);
							return n;
						});
						l = i.ctts.map(function (n) {
							return n.value;
						}).reduce(function (n, t) {
							if (n < t) {
								return n;
							} else {
								return t;
							}
						});
						if (l < 0) {
							i.ctts = i.ctts.map(function (n) {
								n.value -= l;
								return n;
							});
						}
					}
					return {mdatData: h, chunkOffset: t};
				}}, {key: "_fillSttsSamples", value: function (n, t, i) {
					var r = n[n.length - 1];
					if (i) {
						if (r && r.value === t.duration) {
							r.count++;
						} else {
							n.push({value: t.duration, count: 1});
						}
						return;
					}
					if (r) {
						r.count++;
					} else {
						n.push({value: 40, count: 1});
					}
				}}, {key: "_fillCttsSamples", value: function (n, t) {
					var i = n[n.length - 1];
					if (i && i.value === t) {
						i.count++;
					} else {
						n.push({value: t, count: 1});
					}
				}}, {key: "_fillStcoSamples", value: function (n, t, i, r) {
					if (!(t % i)) {
						n.push(r);
					}
				}}, {key: "_fillStscSamples", value: function (n, t, i) {
					if (t <= i) {
						n.push({firstChunk: 1, samplesPerChunk: t, sampleDescIndex: 1});
					} else {
						var u = Math.floor(t / i);
						var r = t % i;
						n.push({firstChunk: 1, samplesPerChunk: i, sampleDescIndex: 1});
						if (r) {
							n.push({firstChunk: u + 1, samplesPerChunk: r, sampleDescIndex: 1});
						}
					}
				}}]);
			}();
			var dataStream = (quality === 'audio') ? {audio: {files: [], finish: null}} : {video: {files: [], finish: null}, audio: {files: [], finish: null}};
			var download = function (n, t) {
				var u = new Blob([n], (quality === 'audio') ? {type: "audio/mp4"} : {type: "video/mp4"});
				n = null;
				var r = URL.createObjectURL(u);
				var i = document.createElement("a");
				document.body.appendChild(i);
				i.style = "display: none";
				i.href = r;
				i.download = t;
				i.click();
				window.URL.revokeObjectURL(r);
			};
			var arrayConcat = function (n) {
				var r = n.reduce(function (n, t) {
					return n + t.length;
				}, 0);
				var t = new Uint8Array(r);
				var i = 0;
				n.forEach(function (n) {
					t.set(n, i);
					i += n.length;
				});
				return t;
			};
			var stop_record = function (n) {
				var r, t, i, u, f;
				if(quality === 'audio') {
					r = arrayConcat(dataStream.audio.files);
					dataStream = null;
					t = new FMP4Demuxer;
					t.demux(null, r);
					r = null;
					i = new MP4Remuxer;
					u = i.remux(null, t.audioTrack).audioSegment;
					t = null;
					i = null;
					download(u, n + ".m4a");
				} else {
					r = arrayConcat(dataStream.video.files);
					u = arrayConcat(dataStream.audio.files);
					dataStream = null;
					t = new FMP4Demuxer;
					t.demux(r, u);
					r = null;
					u = null;
					i = new MP4Remuxer;
					f = i.remux(t.videoTrack, t.audioTrack).videoSegment;
					t = null;
					i = null;
					download(f, n + ".mp4");
				}
			};
			var domand_print = function (n, t, i, r) {
				document.getElementById(n).innerHTML = n +" ダウンロード状況:" + i + "/" + t + " 試行回数:" + (i + r) + " エラー回数:" + r;
			};
			var downloads = function (n, t, i, r, u) {
				var o;
				var s;
				var f = o = s = 0;
				var e = function e(u) {
					if (u === undefined) {
						u = s++;
					}
					if (!dataStream[r].files[u]) {
						var c = new XMLHttpRequest;
						c.withCredentials = true;
						c.responseType = "arraybuffer";
						c.open("GET", n[u]);
						c.onreadystatechange = function () {
							if (c.readyState === XMLHttpRequest.DONE) {
								if (c.status >= 200 && c.status < 400) {
									dataStream[r].files[u] = c.response;
									if (u) {
										crypto.subtle.decrypt({name: "AES-CBC", iv: i}, t, dataStream[r].files[u]).then(function (n) {
											dataStream[r].files[u] = new Uint8Array(n);
											h();
										});
									} else {
										dataStream[r].files[u] = new Uint8Array(dataStream[r].files[u]);
										h();
									}
								} else {
									domand_print(r, n.length, f, ++o);
									setTimeout(e, 1e3, u);
								}
							}
						};
						c.send();
					}
				};
				var h = function () {
					domand_print(r, n.length, ++f, o);
					if (quality === 'audio' && f === n.length) {
						dataStream[r].finish = true;
						if (dataStream.audio.finish) {
							stop_record(u);
						}
					} else if (f === n.length) {
						dataStream[r].finish = true;
						if (dataStream.video.finish && dataStream.audio.finish) {
							stop_record(u);
						}
					} else if (s < n.length) {
						e();
					}
				};
				for (var c = 0; c < 2; c++) {
					e();
				}
			};
			var get_key = function (n, t, i, r, u) {
				var f = new XMLHttpRequest;
				f.withCredentials = true;
				f.responseType = "arraybuffer";
				f.open("GET", n);
				f.onreadystatechange = function () {
					if (f.readyState === XMLHttpRequest.DONE && f.status >= 200 && f.status < 400) {
						var n = f.response;
						crypto.subtle.importKey("raw", n, {name: "AES-CBC"}, false, ["decrypt"]).then(function (n) {
							downloads(i, n, t, r, u);
						});
					}
				};
				f.send();
			};
			var m3u8_media = function (n, t, i) {
				var r = new XMLHttpRequest;
				r.withCredentials = true;
				r.open("GET", n);
				r.onreadystatechange = function () {
					if (r.readyState === XMLHttpRequest.DONE && r.status >= 200 && r.status < 400) {
						var u = r.responseText;
						var f = null;
						var e = null;
						var n = u.replace(/"/g, "\n").split("\n");
						var o = n.filter(function (n) {
							return n.indexOf(".cmfv") !== -1 || n.indexOf(".cmfa") !== -1;
						});
						f = n.filter(function (n) {
							return n.indexOf(".key") !== -1;
						})[0];
						e = Uint8Array.from(n.filter(function (n) {
							return /^,IV=0x[0-9A-F]{32}$/.test(n);
						})[0].slice(6).match(/.{2}/g).map(function (n) {
							return parseInt(n, 16);
						}));
						get_key(f, e, o, t, i);
					}
				};
				r.send();
			};
			var m3u8_variants = function (n, t) {
				var i = new XMLHttpRequest;
				i.withCredentials = true;
				i.open("GET", n);
				i.onreadystatechange = function () {
					var n, r, u;
					if (quality === 'audio' && i.readyState === XMLHttpRequest.DONE && i.status >= 200 && i.status < 400) {
						n = i.responseText;
						r = n.replace(/"/g, "\n").split("\n");
						u = r.filter(function (n) {
							return n.indexOf(".m3u8") !== -1;
						});
						document.body.innerHTML = '<p id="audio" class="nicovideo-downloader-links ext-nicovideo">audio ダウンロード状況:0/0 試行回数:0 エラー回数:0<\/p>';
						m3u8_media(u[0], "audio", t);
					} else if (i.readyState === XMLHttpRequest.DONE && i.status >= 200 && i.status < 400) {
						r = i.responseText;
						u = r.replace(/"/g, "\n").split("\n");
						n = u.filter(function (n) {
							return n.indexOf(".m3u8") !== -1;
						});
						document.body.innerHTML = '<p id="video" class="nicovideo-downloader-links ext-nicovideo">video ダウンロード状況:0/0 試行回数:0 エラー回数:0<\/p><p id="audio" class="nicovideo-downloader-links ext-nicovideo">audio ダウンロード状況:0/0 試行回数:0 エラー回数:0<\/p>';
						m3u8_media(n[0], "audio", t);
						m3u8_media(n[1], "video", t);
					}
				};
				i.send();
			};
			var domand = function (n, t, i) {
				var f = "https://nvapi.nicovideo.jp/v1/watch/" + t + "/access-rights/hls?actionTrackId=AAAAAAAAAA_" + i;
				var r = new XMLHttpRequest;
				r.withCredentials = true;
				r.open("POST", f);
				r.setRequestHeader("Content-Type", "application/json");
				r.setRequestHeader("X-Access-Right-Key", n.accessRightKey);
				r.setRequestHeader("X-Frontend-Id", "6");
				r.setRequestHeader("X-Frontend-Version", "0");
				r.setRequestHeader("X-Request-With", "https://www.nicovideo.jp");
				r.onreadystatechange = function () {
					if (r.readyState === XMLHttpRequest.DONE) {
						var n = JSON.parse(r.responseText);
						if (r.status >= 200 && r.status < 400) {
							m3u8_variants(n.data.contentUrl, t);
						}
					}
				};
				var u = [];
				n.videos.forEach(function (t) {
					n.audios.forEach(function (n) {
						t.isAvailable && n.isAvailable && u.push([t.id, n.id]);
					});
				});

				// Filter outputs based on selected quality
				var filteredOutputs = [];
				switch (quality) {
					case '720p':
						console.log(`function executeDownloadScript: quality "${quality}" selected`);
						// Filter out 1080p, keep 720p and lower
						filteredOutputs = u.filter(function(output) {
							return output[0] !== 'video-h264-1080p';
						});
						break;
					case '480p':
						console.log(`function executeDownloadScript: quality "${quality}" selected`);
						// Filter out 1080p and 720p, keep 480p and lower
						filteredOutputs = u.filter(function(output) {
							return output[0] !== 'video-h264-1080p' && output[0] !== 'video-h264-720p';
						});
						break;
					case '360p':
						console.log(`function executeDownloadScript: quality "${quality}" selected`);
						// Filter out 1080p, 720p, and 480p, keep 360p
						filteredOutputs = u.filter(function(output) {
							return output[0] !== 'video-h264-1080p' && output[0] !== 'video-h264-720p' && output[0] !== 'video-h264-480p';
						});
						break;
					default:
						console.log(`function executeDownloadScript: quality "${quality}" selected`);
						filteredOutputs = u;
						break;
				}

				// Use the first available output from filtered list
				var selectedOutput = filteredOutputs.length > 0 ? [filteredOutputs[0]] : [u[0]];

				r.send(JSON.stringify({outputs: selectedOutput}));
			};
			var v3 = function v3(n, t, i) {
				var u = "https://www.nicovideo.jp/api/watch/v3" + (n ? "_guest/" : "/") + t + "?_frontendId=6&_frontendVersion=0&actionTrackId=AAAAAAAAAA_" + i + "&skips=harmful&noSideEffect=false&t=" + i;
				var r = new XMLHttpRequest;
				r.withCredentials = true;
				r.open("GET", u);
				r.onreadystatechange = function () {
					if (r.readyState === XMLHttpRequest.DONE) {
						var u = JSON.parse(r.responseText);
						if (r.status >= 200 && r.status < 400) {
							if (u.data.media.domand) {
								domand(u.data.media.domand, t, i);
							} else {
								document.body.innerHTML = "<p>" + u.data.okReason + "</p>";
							}
						} else if (n) {
							document.body.innerHTML = "<p>" + u.meta.errorCode + "</p>";
						} else {
							v3(true, t, i);
						}
					}
				};
				r.send();
			};
			if (/ext\.nicovideo\.jp\/\?(\w+)/.test(document.URL)) {
				video_id = RegExp.$1;
				t = (new Date).getTime();
				v3(false, video_id, t);
			}

			console.log("Self-contained download script executed successfully");
		} catch (error) {
			console.error("Error executing self-contained download script:", error);
			console.log("Trying to load the script from external source");
			// Fallback
			loadExternalDownloadScript(quality);
		}
	}
})();