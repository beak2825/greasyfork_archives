// ==UserScript==
// @name         GGn Copy Release Description BBCode (API)
// @version      1.1.0
// @description  Copy torrent release descriptions from GazelleGames using API
// @match        https://gazellegames.net/torrents.php*id=*
// @grant        GM_setClipboard
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-idle
// @namespace    https://greasyfork.org/en/users/1466117
// @license      MIT
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAsJxhHLBFOLQY5JwI5Lxc3JRRDLBY5Jwo0KBA+KRM+IgpFKxM9Kw5DMA87Jgs7Jhc+JRtGLhJCJgc9IxP/9vT49vb38vH/9/j//un49vX2+/7y9PX///44JBJEKAo5KBNjQBVNPRlLQCJUPhtcQRxTQhtVRSFXPBpoQRpNOx5NPh1XQR1RNBlrRCRoQRVXPhRjRiFbQjJbRjdhSipyWDNwVDyFZ0yJZjqQbUWJaDqNc0V1WzNqTzRVRTlOQjhdRytQPyxiQyxcPiV/cV6gnpamoKGhlZGqoI+Ze0qsilyIem6ZlZS1qZeWm5qHjZhjRy9cQylYRSKel362s6uQgm+LdEapnXueoqexlFu2nHiyqqukmI6EYzJ3ZEG0rqeEZE1nQCpvX1Our7OPgoSKZkisgEq2noC4tcS0nnW7t6yzrqWbflmQb0JzYUq9tKtpXlZeRyeFdWnezsKAbUqBcU3Bu7TJzNHIzMbUrHjV0sO0poKkgEqsoZnLy9nZzcNxZ1VbPy6Oe3Pn3NhtYFKFbEqjg06xj1O8nGHJqXTc3NCspZSffkyPcUJuWTliTClcRSVbRSJ9blT37dykk36AYj+cdESwg1C5jl2zi1v25tnSwraXc0+IYTpqTzVmSzZiQiVhQyZROSXFt6v16d2woY50YUaMe2HFt6CdgFTGuKH58+jJuaJ1WjhkVUKck4ZpUzdmRCxbQTBSQDW/s6n/+ev///H///TDwrSFbER6Z0a3saT48eD//+X//+7f3dVjTjJcRiNcSClYRSpUPyRhRixyVDlyUTd3VjyEXjuFXzxpUT1ZRDVsTC9UPCpSQDVpRylYQSdYQSddRCpfRixjSC1gRSpjRylrTi9pSilrSyhiRyxcRCxhRitbQy1YQCxeQiRlRjddPCxiRTBXPylNOiVTRS9SRi5TRixaSCtWRSphSipaRSVSQitXRitbRidUQyhdRSldQSJkRSRpSilhQyZiRSpgQiVlQyVeQy5UOytoRSRmQR9cRDJeQCdkPx1eRTEAAFxBAAAgVAAAaG4AAG9nAABzXAAASS4AAEVcAAByZQAAdGEAAGM7AABcUAAAZ3IAACBGAABlcwAAeDgAAFxT
// @downloadURL https://update.greasyfork.org/scripts/560115/GGn%20Copy%20Release%20Description%20BBCode%20%28API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560115/GGn%20Copy%20Release%20Description%20BBCode%20%28API%29.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const CONFIG = {
		apiURL: 'https://gazellegames.net/api.php',
		storageKey: 'ggn_api_key',
		selectors: {
			permalinks: 'a[title="Permalink"]'
		}
	};

	const FEEDBACK_DURATION = {
		success: 1500,
		error: 2000
	};

	const BUTTON_STATES = {
		loading: { text: '...', title: 'Copying...' },
		success: { text: '✓', title: 'Copied!' },
		error: { text: '✗', title: 'Failed' },
		default: { text: 'CP', title: 'Copy Description' }
	};

	const TOAST_DURATION = 3000;

	const TORRENT_ID_REGEX = /torrentid=(\d+)/;

	const descriptionCache = new Map();

	async function getApiKey() {
		let apiKey = await GM.getValue(CONFIG.storageKey, '');

		if (!apiKey) {
			apiKey = prompt('Please enter your GGn API key for the GGn Copy Release Description userscript:');
			if (apiKey) {
				await GM.setValue(CONFIG.storageKey, apiKey.trim());
			}
		}

		return apiKey;
	}

	async function clearApiKey() {
		await GM.setValue(CONFIG.storageKey, '');
	}

	function extractTorrentId(url) {
		const match = url.match(TORRENT_ID_REGEX);
		return match ? match[1] : '';
	}

	function setButtonState(button, state) {
		button.textContent = state.text;
		button.title = state.title;
	}

	function showToast(message, isError = false) {
		const toast = document.createElement('div');
		toast.textContent = message;
		toast.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background-color: ${isError ? '#d32f2f' : '#333'};
			color: white;
			padding: 12px 20px;
			border-radius: 4px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.3);
			z-index: 10000;
			font-family: Arial, sans-serif;
			font-size: 14px;
			max-width: 300px;
			word-wrap: break-word;
			animation: slideIn 0.3s ease-out;
		`;

		const style = document.createElement('style');
		style.textContent = `
			@keyframes slideIn {
				from {
					transform: translateX(400px);
					opacity: 0;
				}
				to {
					transform: translateX(0);
					opacity: 1;
				}
			}
		`;
		document.head.appendChild(style);

		document.body.appendChild(toast);

		setTimeout(() => {
			toast.style.transition = 'opacity 0.3s ease-out';
			toast.style.opacity = '0';
			setTimeout(() => {
				toast.remove();
				style.remove();
			}, 300);
		}, TOAST_DURATION);
	}

	async function fetchDescription(torrentId, apiKey) {
		// Check cache first
		if (descriptionCache.has(torrentId)) {
			return descriptionCache.get(torrentId);
		}

		const url = `${CONFIG.apiURL}?request=torrent&id=${torrentId}`;

		const response = await fetch(url, {
			headers: {
				'X-API-Key': apiKey
			}
		});

		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				await clearApiKey();
				throw new Error('Invalid API key. Please refresh and enter a valid key.');
			}
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();

		if (data.status !== 'success') {
			throw new Error('API returned error status');
		}

		const bbDescription = data.response?.torrent?.bbDescription;

		if (bbDescription === undefined) {
			throw new Error('no_description');
		}

		if (!bbDescription || bbDescription.trim() === '') {
			throw new Error('no_description');
		}

		descriptionCache.set(torrentId, bbDescription);

		return bbDescription;
	}

	async function handleCopyClick(torrentId, button) {
		setButtonState(button, BUTTON_STATES.loading);

		try {
			const apiKey = await getApiKey();

			if (!apiKey) {
				throw new Error('No API key provided');
			}

			const description = await fetchDescription(torrentId, apiKey);
			GM_setClipboard(description);

			setButtonState(button, BUTTON_STATES.success);
			showToast('Release description copied to clipboard!', false);
			
			setTimeout(() => {
				setButtonState(button, BUTTON_STATES.default);
			}, FEEDBACK_DURATION.success);
		} catch (error) {
			console.error('Copy description error:', error);

			setButtonState(button, BUTTON_STATES.error);

			if (error.message === 'no_description') {
				showToast('No release description available for this torrent', true);
			} else if (error.message.includes('Invalid API key')) {
				showToast('Invalid API key. Please refresh the page and enter a valid key.', true);
			} else if (error.message.includes('HTTP')) {
				showToast(`Network error: ${error.message}`, true);
			} else {
				showToast(`Error: ${error.message}`, true);
			}

			setTimeout(() => {
				setButtonState(button, BUTTON_STATES.default);
			}, FEEDBACK_DURATION.error);
		}
	}

	function createCopyButton(torrentId) {
		const copyButton = document.createElement('a');
		copyButton.textContent = BUTTON_STATES.default.text;
		copyButton.title = BUTTON_STATES.default.title;
		copyButton.href = 'javascript:void(0)';
		copyButton.style.cursor = 'pointer';

		copyButton.addEventListener('click', (e) => {
			e.preventDefault();
			handleCopyClick(torrentId, copyButton);
		});

		return copyButton;
	}

	function createSeparator() {
		const separator = document.createElement('span');
		separator.textContent = ' | ';
		return separator;
	}

	function addCopyButton(permalinkElement) {
		const torrentId = extractTorrentId(permalinkElement.href);

		if (!torrentId) {
			console.warn('Could not extract torrent ID from:', permalinkElement.href);
			return;
		}

		const copyButton = createCopyButton(torrentId);
		const separator = createSeparator();

		const parent = permalinkElement.parentNode;
		parent.insertBefore(copyButton, permalinkElement.nextSibling);
		parent.insertBefore(separator, copyButton);
	}

	function init() {
		const permalinks = document.querySelectorAll(CONFIG.selectors.permalinks);

		if (permalinks.length === 0) {
			console.log('No permalink elements found');
			return;
		}

		permalinks.forEach(addCopyButton);
		console.log(`Added copy buttons to ${permalinks.length} torrent(s)`);
	}

	init();
})();