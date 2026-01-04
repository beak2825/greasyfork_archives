// ==UserScript==
// @name         TreeMarketComparison
// @namespace     http://tampermonkey.net/
// @version      0.1.6
// @description  Flag profitable Torn item market and bazaar listings for flips
// @author       TreeMapper
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @connect       api.torn.com
// @connect       greasyfork.org
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554810/TreeMarketComparison.user.js
// @updateURL https://update.greasyfork.org/scripts/554810/TreeMarketComparison.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const STORAGE_KEYS = {
		SETTINGS: 'MarketComparison.settings',
		UI: 'MarketComparison.ui',
		API: 'MarketComparison.apiKey',
	};

	const CONFIG = {
		API_KEY_PLACEHOLDER: '###PDA-APIKEY###',
		API_URL: 'https://api.torn.com/torn/?selections=items&comment=pricecheck',
		LISTING_FEE: 0.05,
		OBSERVER_DEBOUNCE_MS: 250,
		API_RETRY_MS: 12000,
		INIT_TIMEOUT_MS: 15000,
		REFRESH_INTERVAL_MS: 5000,
	};

	const DEFAULT_SETTINGS = {
		TILE_TINT_THRESHOLD: 0.1,
		TILE_TINT_ALPHA_MIN: 0.18,
		TILE_TINT_ALPHA_RANGE: 0.42,
		MARKET_UNDERCUT_MARGIN: 0.05,
		MARKET_GAP_THRESHOLD: 0.05,
		BAZAAR_UNDERCUT_MARGIN: 0.05,
		BAZAAR_GAP_THRESHOLD: 0.05,
		ITEM_FLIP_MIN_PROFIT: 500,
		BAZAAR_FLIP_MIN_PROFIT: 500,
	};

	const DEFAULT_UI_PREFS = {
		buttonTop: 120,
		buttonLeft: 20,
	};

	const UI_SETTINGS = { ...DEFAULT_SETTINGS };
	const UI_PREFS = { ...DEFAULT_UI_PREFS };

	const MARGINS = {
		marketUndercut: 0,
		marketGap: 0,
		bazaarUndercut: 0,
		bazaarGap: 0,
	};

	syncMarginsFromSettings();

	const STATE = {
		started: false,
		itemsReady: false,
		itemsById: new Map(),
		itemsByName: new Map(),
		apiKey: null,
		isPda: false,
		observer: null,
		debounceHandle: null,
		root: null,
		refreshHandle: null,
		marketSummaries: new Map(),
	};

	const UI_RUNTIME = {
		button: null,
		panel: null,
		inputs: new Map(),
		drag: null,
		listenersBound: false,
		justDragged: false,
	};

	const numberFormatter = new Intl.NumberFormat();
	const percentFormatter = new Intl.NumberFormat(undefined, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	});
	const currencyFormatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

		const CSS = `
.mc-flagged {
	position: relative;
	border-radius: 6px;
	box-shadow: 0 0 0 2px rgba(68, 68, 68, 0.25);
	transition: box-shadow 140ms ease, background-color 140ms ease;
}
.mc-flag-marketvalue { background-color: rgba(46, 204, 113, 0.18); box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.65); }
.mc-flag-gap { background-color: rgba(52, 152, 219, 0.16); box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.6); }
.mc-flag-bazaar-marketvalue { background-color: rgba(26, 188, 156, 0.18); box-shadow: 0 0 0 2px rgba(26, 188, 156, 0.55); }
.mc-flag-bazaar-gap { background-color: rgba(155, 89, 182, 0.16); box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.6); }
.mc-flag-gap::after,
.mc-flag-bazaar-gap::after {
	content: '';
	position: absolute;
	left: 2px;
	right: 2px;
	bottom: 2px;
	height: 3px;
	border-radius: 3px;
	box-shadow: 0 0 8px 2px currentColor;
	opacity: 0.8;
}
.mc-flag-gap::after { color: rgba(52, 152, 219, 0.95); }
.mc-flag-bazaar-gap::after { color: rgba(155, 89, 182, 0.9); }
.mc-price-below { color: #1f8f3a !important; }
.mc-price-above { color: #c0392b !important; }
.mc-price-equal { color: #f1c40f !important; }
.mc-diff {
	display: inline;
	margin-left: 0;
	font-size: 11px;
	padding: 0;
	border-radius: 0;
	background-color: transparent;
	color: inherit;
	opacity: 0.85;
}
.mc-market-baseline {
	display: block;
	margin-top: 1px;
	margin-bottom: 0;
	font-size: 11px;
	line-height: 1.25;
	opacity: 0.8;
	flex-basis: 100%;
	width: 100%;
	white-space: normal;
	word-break: break-word;
}
.mc-panel-baseline {
	display: block;
	margin-top: 4px;
	font-size: 11px;
	line-height: 1.25;
	opacity: 0.75;
	flex-basis: 100%;
	width: 100%;
	white-space: normal;
	word-break: break-word;
}
.mc-profit {
	display: block;
	margin-top: 4px;
	font-size: 12px;
	font-weight: 600;
	line-height: 1.3;
	white-space: normal;
	word-break: break-word;
}
.mc-profit-positive { color: #1f8f3a; }
.mc-profit-negative { color: #c0392b; }
.mc-profit-neutral { color: #f1c40f; }
.mc-profit-total {
	margin-top: 2px;
	font-size: 11px;
	opacity: 0.85;
	white-space: normal;
	word-break: break-word;
}
.mc-flip-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0 6px;
	margin-left: 4px;
	font-size: 11px;
	font-weight: 700;
	border-radius: 10px;
	background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
	color: #041c0f;
	letter-spacing: 0.5px;
	text-transform: uppercase;
}
.mc-qty {
	display: none;
}
.mc-tile-highlight {
	border-radius: 6px;
	padding: 2px 4px;
	transition: background-color 0.16s ease;
}
.mc-config-button {
	position: fixed;
	width: 36px;
	height: 36px;
	border-radius: 18px;
	border: none;
	background: #2ecc71;
	color: #0b331a;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	z-index: 2147483646;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	user-select: none;
}
.mc-config-button:focus {
	outline: 2px solid rgba(255, 255, 255, 0.3);
	outlines-offset: 2px;
}
.mc-config-panel {
	position: fixed;
	min-width: 220px;
	max-width: 260px;
	background: rgba(18, 18, 18, 0.94);
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	padding: 12px;
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
	z-index: 2147483647;
	display: none;
	max-height: 60vh;
	overflow-y: auto;
	overflow-x: hidden;
}
.mc-config-panel.mc-open {
	display: block;
}
.mc-config-panel h3 {
	margin: 0 0 8px;
	font-size: 14px;
	font-weight: 600;
}
.mc-config-row {
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-bottom: 10px;
}
.mc-config-row label {
	font-size: 12px;
	opacity: 0.85;
}
.mc-config-row input {
	padding: 4px 6px;
	font-size: 12px;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
	color: inherit;
}
.mc-config-row input:focus {
	outline: 1px solid rgba(52, 152, 219, 0.8);
	border-color: rgba(52, 152, 219, 0.8);
}
.mc-config-row input.mc-error {
	border-color: rgba(192, 57, 43, 0.9);
	background: rgba(192, 57, 43, 0.2);
}
.mc-config-description {
	font-size: 11px;
	opacity: 0.7;
	line-height: 1.3;
}
.mc-config-actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}
.mc-config-actions button {
	padding: 4px 10px;
	font-size: 12px;
	border-radius: 4px;
	border: none;
	cursor: pointer;
}
.mc-config-save {
	background: rgba(46, 204, 113, 0.2);
	color: #2ecc71;
}
.mc-config-cancel {
	background: rgba(192, 57, 43, 0.2);
	color: #e74c3c;
}
	`.trim();

	const FLAG_CLASSES = [
		'mc-flagged',
		'mc-flag-marketvalue',
		'mc-flag-gap',
		'mc-flag-bazaar-marketvalue',
		'mc-flag-bazaar-gap',
	];

	const TREND_CLASSES = ['mc-price-below', 'mc-price-above', 'mc-price-equal'];

	const SELECTORS = {
		sellerList: 'ul[class*="sellerList"]',
		panelHeader: '[class*="itemsHeader"]',
		bazaarContainer: '.bazaar-info-container[data-itemid]'
	};

	const SETTINGS_SCHEMA = [
		{
			key: 'TILE_TINT_THRESHOLD',
			label: 'Tile tint threshold (%)',
			description: 'How far a listing must move from the market value before we start tinting the tile (green when cheaper, red when pricey). Example: 10 means the tile stays neutral until a ±10% change.',
			min: 0,
			max: 100,
			step: 1,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'TILE_TINT_ALPHA_MIN',
			label: 'Tile tint minimum opacity (%)',
			description: 'How strong the initial tint appears once the threshold is crossed. Lower numbers keep the color subtle, higher numbers make the green/red highlight obvious immediately.',
			min: 0,
			max: 100,
			step: 1,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'TILE_TINT_ALPHA_RANGE',
			label: 'Tile tint additional opacity (%)',
			description: 'How much more glow is added as the deviation keeps growing. Think of it as the slider from “soft hint” to “blaring warning.”',
			min: 0,
			max: 100,
			step: 1,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'MARKET_UNDERCUT_MARGIN',
			label: 'Market flip margin (%)',
			description: 'Minimum net profit margin (after the 5% market fee) you want when buying a market listing and relisting it. Higher numbers mean fewer, but safer, green highlights.',
			min: 0,
			max: 100,
			step: 0.5,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'MARKET_GAP_THRESHOLD',
			label: 'Market gap threshold (%)',
			description: 'How large the gap between consecutive market listings must be (after fees) before we flag a “price wall.” Expect a blue bottom glow when this threshold is breached.',
			min: 0,
			max: 100,
			step: 0.5,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'BAZAAR_UNDERCUT_MARGIN',
			label: 'Bazaar flip margin (%)',
			description: 'How much profit margin (after the market fee) you want before considering a bazaar listing “flip worthy.” Listings meeting this go green, otherwise they stay neutral.',
			min: 0,
			max: 100,
			step: 0.5,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'BAZAAR_GAP_THRESHOLD',
			label: 'Bazaar vs. market gap (%)',
			description: 'How far a bazaar price must beat the market floor after fees before the row gets a purple glow. Handy for spotting undercuts that deserve attention.',
			min: 0,
			max: 100,
			step: 0.5,
			scale: 100,
			decimals: 1,
		},
		{
			key: 'ITEM_FLIP_MIN_PROFIT',
			label: 'Minimum item flip profit ($)',
			description: 'Minimum cash-in-hand profit (after the 5% market fee) required before the first market listing is tagged as FLIP. Example: 500 means we skip slim gains even if the percent gap is large.',
			min: 0,
			max: 1000000,
			step: 100,
			scale: 1,
			decimals: 0,
		},
		{
			key: 'BAZAAR_FLIP_MIN_PROFIT',
			label: 'Minimum bazaar flip profit ($)',
			description: 'Smallest profit per item (after relisting fees) required before bazaar cards show the flip banner. Use this to filter noise when the market is churning.',
			min: 0,
			max: 1000000,
			step: 100,
			scale: 1,
			decimals: 0,
		},
	];

	bootstrap();

	function bootstrap() {
		if (STATE.started) {
			return;
		}
		STATE.started = true;
		if (!location.href.includes('page.php?sid=ItemMarket')) {
			return;
		}
		loadStoredSettings();
		loadStoredUiPrefs();
		resolveInitialApiKey();
		bindGlobalUiHandlers();
		injectStyles();
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => init().catch(handleError));
		} else {
			init().catch(handleError);
		}
	}

	async function init() {
		if (!ensureApiKey()) {
			return;
		}
		await fetchItemData();
		STATE.root = await waitForElement(() => document.querySelector('#item-market-root'), CONFIG.INIT_TIMEOUT_MS);
		if (!STATE.root) {
			console.warn('[MarketComparison] item-market-root not found; aborting.');
			return;
		}
		ensureConfigUi();
		createObserver();
		startRefreshTimer();
		processAll();
	}

	function injectStyles() {
		if (document.getElementById('marketcomparison-styles')) {
			return;
		}
		const style = document.createElement('style');
		style.id = 'marketcomparison-styles';
		style.textContent = CSS;
		document.head.appendChild(style);
	}

	async function fetchItemData() {
		if (!STATE.apiKey) {
			throw new Error('API key unavailable');
		}
		const url = `${CONFIG.API_URL}&key=${encodeURIComponent(STATE.apiKey)}`;
		try {
			const response = await fetch(url, { cache: 'no-store', credentials: 'omit' });
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			const payload = await response.json();
			if (!payload || !payload.items) {
				throw new Error('Unexpected API payload');
			}
			STATE.itemsById.clear();
			STATE.itemsByName.clear();
			for (const [id, item] of Object.entries(payload.items)) {
				if (!item || typeof item.market_value !== 'number') {
					continue;
				}
				STATE.itemsById.set(id, {
					id,
					name: item.name,
					marketValue: item.market_value,
				});
				const normalizedName = normalizeItemName(item.name);
				if (normalizedName && !STATE.itemsByName.has(normalizedName)) {
					STATE.itemsByName.set(normalizedName, id);
				}
			}
			STATE.itemsReady = true;
			console.info(`[MarketComparison] Loaded ${STATE.itemsById.size} item baselines.`);
		} catch (error) {
			console.error('[MarketComparison] Failed to fetch item data:', error);
			STATE.itemsReady = false;
			window.setTimeout(fetchItemData, CONFIG.API_RETRY_MS);
		}
	}

	function createObserver() {
		if (STATE.observer) {
			STATE.observer.disconnect();
		}
		STATE.observer = new MutationObserver(() => scheduleProcess());
		STATE.observer.observe(STATE.root, { childList: true, subtree: true, characterData: true, attributes: true });
	}

	function startRefreshTimer() {
		if (STATE.refreshHandle || !Number.isFinite(CONFIG.REFRESH_INTERVAL_MS) || CONFIG.REFRESH_INTERVAL_MS <= 0) {
			return;
		}
		STATE.refreshHandle = window.setInterval(() => {
			scheduleProcess();
		}, CONFIG.REFRESH_INTERVAL_MS);
	}

	function scheduleProcess() {
		if (STATE.debounceHandle) {
			return;
		}
		STATE.debounceHandle = window.setTimeout(() => {
			STATE.debounceHandle = null;
			processAll();
		}, CONFIG.OBSERVER_DEBOUNCE_MS);
	}

	function processAll() {
			annotateTiles();
		if (!STATE.itemsReady) {
			return;
		}
			processPanels();
	}

	function findInNode(node, selector) {
		if (!(node instanceof Element)) {
			return null;
		}
		if (typeof node.matches === 'function' && node.matches(selector)) {
			return node;
		}
		if (typeof node.querySelector === 'function') {
			const found = node.querySelector(selector);
			if (found) {
				return found;
			}
		}
		return null;
	}

	function findNearestElement(start, selector) {
		if (!(start instanceof Element) || typeof selector !== 'string' || !selector) {
			return null;
		}
		let node = start;
		while (node && node !== document.documentElement) {
			if (typeof node.matches === 'function' && node.matches(selector)) {
				return node;
			}
			let sibling = node.previousElementSibling;
			while (sibling) {
				const match = findInNode(sibling, selector);
				if (match) {
					return match;
				}
				sibling = sibling.previousElementSibling;
			}
			sibling = node.nextElementSibling;
			while (sibling) {
				const match = findInNode(sibling, selector);
				if (match) {
					return match;
				}
				sibling = sibling.nextElementSibling;
			}
			node = node.parentElement;
		}
		return null;
	}

	function findMarketListNear(element) {
		return findNearestElement(element, SELECTORS.sellerList);
	}

	function findPanelHeaderNear(element) {
		return findNearestElement(element, SELECTORS.panelHeader);
	}

	function findBazaarContainerNear(element) {
		return findNearestElement(element, SELECTORS.bazaarContainer);
	}

	function getItemIdFromList(list) {
		if (!(list instanceof HTMLElement)) {
			return null;
		}
		if (list.dataset && list.dataset.mcItemId) {
			return list.dataset.mcItemId;
		}
		const container = findBazaarContainerNear(list);
		if (container && container.dataset && container.dataset.itemid) {
			const itemId = container.dataset.itemid;
			list.dataset.mcItemId = itemId;
			return itemId;
		}
		const header = findPanelHeaderNear(list);
		if (header) {
			const titleNode = header.querySelector('[class*="title"]') || header.firstElementChild;
			const titleText = titleNode && titleNode.textContent ? titleNode.textContent.trim() : '';
			if (titleText) {
				const normalized = normalizeItemName(titleText);
				const lookupId = normalized ? STATE.itemsByName.get(normalized) : null;
				if (lookupId) {
					list.dataset.mcItemId = lookupId;
					return lookupId;
				}
			}
		}
		return null;
	}

	function annotateTiles() {
		const tiles = document.querySelectorAll('li.tt-highlight-modified');
		tiles.forEach(tile => {
			const itemId = extractItemId(tile);
			if (!itemId) {
				return;
			}
			tile.dataset.mcItemId = itemId;
			const itemData = STATE.itemsById.get(itemId);
			if (!itemData) {
				return;
			}
			const priceBlock = findPriceBlock(tile);
			if (!priceBlock) {
				return;
			}
			const titleContainer = priceBlock.closest('[class*="title"]');
			if (titleContainer) {
				ensureTileLayout(titleContainer);
			}
			ensurePriceBlockLayout(priceBlock);
			const currentPrice = parsePrice(priceBlock.textContent || '');
			updateTileTint(priceBlock, currentPrice, itemData.marketValue);
			if (titleContainer) {
				let baseline = titleContainer.querySelector('.mc-market-baseline');
				if (!baseline) {
					baseline = document.createElement('div');
					baseline.className = 'mc-market-baseline';
					titleContainer.appendChild(baseline);
				}
				baseline.style.order = '2';
				baseline.style.alignSelf = 'stretch';
				baseline.style.marginTop = '1px';
				baseline.style.marginBottom = '0';
				baseline.style.whiteSpace = 'normal';
				baseline.style.wordBreak = 'break-word';
				const baselineText = `mkt: ${formatCurrency(itemData.marketValue)}`;
				if (baseline.dataset.mcBaseline !== baselineText) {
					baseline.textContent = baselineText;
					baseline.dataset.mcBaseline = baselineText;
				}
			}
		});
	}

	function processPanels() {
		const tiles = document.querySelectorAll('li.tt-highlight-modified');
		const handledBazaarContainers = new Set();
		const handledLists = new Set();
		tiles.forEach(tile => {
			const itemId = extractItemId(tile);
			if (!itemId) {
				return;
			}
			tile.dataset.mcItemId = itemId;
			const itemData = STATE.itemsById.get(itemId);
			if (!itemData) {
				return;
			}
			const panel = tile.nextElementSibling instanceof HTMLElement ? tile.nextElementSibling : null;
			let marketSummary = null;
			if (panel) {
				const marketList = findMarketListNear(panel);
				if (marketList instanceof HTMLElement) {
					marketList.dataset.mcItemId = itemId;
					if (!handledLists.has(marketList)) {
						marketSummary = processMarketListings(marketList, itemData);
						handledLists.add(marketList);
						if (marketSummary && Number.isFinite(marketSummary.cheapest)) {
							STATE.marketSummaries.set(itemId, marketSummary);
						}
					} else {
						marketSummary = STATE.marketSummaries.get(itemId) || null;
					}
				}
				updatePanelHeaderBaseline(panel, itemData);
			}
			const summaryForBazaar = marketSummary && Number.isFinite(marketSummary.cheapest)
				? marketSummary
				: STATE.marketSummaries.get(itemId) || marketSummary;
			const bazaarContainers = findBazaarContainers(panel, itemId);
			bazaarContainers.forEach(container => {
				if (handledBazaarContainers.has(container)) {
					return;
				}
				handledBazaarContainers.add(container);
				processBazaarListings(container, itemData, summaryForBazaar, itemId);
			});
		});
		document.querySelectorAll(SELECTORS.bazaarContainer).forEach(container => {
			const itemId = container.dataset ? container.dataset.itemid : null;
			if (!itemId) {
				return;
			}
			const itemData = STATE.itemsById.get(itemId);
			if (!itemData) {
				return;
			}
			const marketList = findMarketListNear(container);
			let marketSummary = null;
			if (marketList instanceof HTMLElement) {
				marketList.dataset.mcItemId = itemId;
				if (!handledLists.has(marketList)) {
					marketSummary = processMarketListings(marketList, itemData);
					handledLists.add(marketList);
					if (marketSummary && Number.isFinite(marketSummary.cheapest)) {
						STATE.marketSummaries.set(itemId, marketSummary);
					}
				} else {
					marketSummary = STATE.marketSummaries.get(itemId) || null;
				}
			} else {
				marketSummary = STATE.marketSummaries.get(itemId) || null;
			}
			updatePanelHeaderBaseline(container, itemData);
			const summaryForBazaar = marketSummary && Number.isFinite(marketSummary.cheapest)
				? marketSummary
				: STATE.marketSummaries.get(itemId) || marketSummary;
			if (!handledBazaarContainers.has(container)) {
				processBazaarListings(container, itemData, summaryForBazaar, itemId);
				handledBazaarContainers.add(container);
			}
		});
		document.querySelectorAll(SELECTORS.sellerList).forEach(list => {
			if (handledLists.has(list)) {
				return;
			}
			const itemId = getItemIdFromList(list);
			if (!itemId) {
				return;
			}
			const itemData = STATE.itemsById.get(itemId);
			if (!itemData) {
				return;
			}
			list.dataset.mcItemId = itemId;
			const marketSummary = processMarketListings(list, itemData);
			handledLists.add(list);
			if (marketSummary && Number.isFinite(marketSummary.cheapest)) {
				STATE.marketSummaries.set(itemId, marketSummary);
			}
			updatePanelHeaderBaseline(list, itemData);
			const container = findBazaarContainerNear(list);
			const summaryForBazaar = marketSummary && Number.isFinite(marketSummary.cheapest)
				? marketSummary
				: STATE.marketSummaries.get(itemId) || marketSummary;
			if (container && !handledBazaarContainers.has(container)) {
				processBazaarListings(container, itemData, summaryForBazaar, itemId);
				handledBazaarContainers.add(container);
			}
		});
	}

	function findBazaarContainers(panel, itemId) {
		const results = [];
		const seen = new Set();
		const collect = element => {
			if (!element || !(element instanceof HTMLElement)) {
				return;
			}
			const panelItemId = element.dataset ? element.dataset.itemid : null;
			if (itemId && panelItemId && panelItemId !== itemId) {
				return;
			}
			if (seen.has(element)) {
				return;
			}
			seen.add(element);
			results.push(element);
		};
		if (panel) {
			if (panel.classList.contains('bazaar-info-container')) {
				collect(panel);
			}
			panel.querySelectorAll('.bazaar-info-container').forEach(collect);
		}
		if (itemId) {
			document.querySelectorAll(`.bazaar-info-container[data-itemid="${itemId}"]`).forEach(collect);
		} else {
			document.querySelectorAll('.bazaar-info-container[data-itemid]').forEach(collect);
		}
		return results;
	}

		function updatePanelHeaderBaseline(panel, itemData) {
			if (!panel || !itemData) {
				return;
			}
			const header = findPanelHeaderNear(panel);
			if (!header) {
				return;
			}
			const marketValue = itemData.marketValue;
			let baseline = header.querySelector('.mc-panel-baseline');
			if (!Number.isFinite(marketValue) || marketValue <= 0) {
				if (baseline) {
					baseline.remove();
				}
				return;
			}
			if (!baseline) {
				baseline = document.createElement('div');
				baseline.className = 'mc-panel-baseline';
				header.appendChild(baseline);
			}
			const text = `mkt: ${formatCurrency(marketValue)}`;
			if (baseline.textContent !== text) {
				baseline.textContent = text;
			}
		}

		function processMarketListings(list, itemData) {
			if (!list) {
				return { cheapest: null, second: null };
			}
			let rows = Array.from(list.children).filter(child => child instanceof HTMLElement);
			if (!rows.length) {
				rows = Array.from(list.querySelectorAll('li'));
			}
			const entries = [];
			rows.forEach(row => {
				if (!(row instanceof HTMLElement)) {
					return;
				}
				const priceNode = findPriceNode(row);
				const price = readPrice(priceNode);
				if (!Number.isFinite(price)) {
					return;
				}
				entries.push({ row, priceNode, price });
			});
			if (!entries.length) {
				return { cheapest: null, second: null };
			}
			entries.forEach(entry => {
				clearEntry(entry.row);
				clearPriceNode(entry.priceNode);
				preparePriceNode(entry.priceNode);
			});
			let cheapest = null;
			entries.forEach((entry, index) => {
				const { row, priceNode, price } = entry;
				if (cheapest === null) {
					cheapest = price;
				}
				const previous = entries[index - 1] || null;
				const next = entries[index + 1] || null;
				applyTrend(priceNode, price, itemData.marketValue);
				if (index === 0) {
					updateDiffBadge(priceNode, price, itemData.marketValue, { mode: 'baseline', label: 'mkt' });
				} else if (previous) {
					updateDiffBadge(priceNode, price, previous.price, { mode: 'relative', label: 'prev' });
				}
				if (shouldFlagMarketValue(price, itemData.marketValue)) {
					addFlag(row, 'mc-flag-marketvalue', `≥${formatPercent(MARGINS.marketUndercut)} under daily market`);
				}
				if (next && shouldFlagGap(price, next.price, MARGINS.marketGap)) {
					addFlag(row, 'mc-flag-gap', `≥${formatPercent(MARGINS.marketGap)} gap to next listing`);
				}
				let flipEval = null;
				if (index === 0 && next) {
					flipEval = evaluateMarketFlip(price, next.price);
					entry.flipEval = flipEval;
					if (flipEval && flipEval.qualifies) {
						const wrapper = ensurePriceInlineWrapper(priceNode);
						const flipTag = document.createElement('span');
						flipTag.className = 'mc-flip-tag';
						flipTag.textContent = 'FLIP';
						wrapper.appendChild(flipTag);
					}
				}
				applyMarketTooltip(entry, itemData, previous, next, flipEval, index);
			});
			const second = entries[1] ? entries[1].price : null;
			return { cheapest, second };
	}

		function processBazaarListings(root, itemData, marketSummary, itemId) {
			if (!root) {
				return;
			}
		const cards = Array.from(root.querySelectorAll('.bazaar-listing-card'));
		if (!cards.length) {
			return;
		}
			const effectiveSummary = marketSummary && typeof marketSummary === 'object' ? marketSummary : (itemId ? STATE.marketSummaries.get(itemId) : null);
			const targetSalePrice = deriveTargetSalePrice(effectiveSummary);
			cards.forEach(card => {
					clearEntry(card);
				const listing = extractBazaarListing(card);
				if (!listing) {
				return;
			}
				clearPriceNode(listing.priceNode);
				preparePriceNode(listing.priceNode);
				applyTrend(listing.priceNode, listing.price, itemData.marketValue);
				updateDiffBadge(listing.priceNode, listing.price, itemData.marketValue, { mode: 'baseline', label: 'mkt' });
				if (shouldFlagBazaarMarketValue(listing.price, itemData.marketValue)) {
				addFlag(card, 'mc-flag-bazaar-marketvalue', `≥${formatPercent(MARGINS.bazaarUndercut)} under daily market`);
			}
				if (effectiveSummary && Number.isFinite(effectiveSummary.cheapest) && shouldFlagBazaarGap(listing.price, effectiveSummary.cheapest, MARGINS.bazaarGap)) {
					addFlag(card, 'mc-flag-bazaar-gap', `≥${formatPercent(MARGINS.bazaarGap)} under cheapest market`);
				}
				const flipEval = targetSalePrice !== null ? evaluateBazaarFlip(listing.price, targetSalePrice) : null;
				listing.flipEval = flipEval;
				renderFlipProfit(card, flipEval, listing);
				applyBazaarTooltip(card, listing, itemData, effectiveSummary, flipEval);
		});
	}

		function extractBazaarListing(card) {
			if (!card) {
				return null;
			}
			const strongTags = Array.from(card.querySelectorAll('strong'));
			const priceStrong = strongTags.find(node => node.textContent && node.textContent.trim().toLowerCase().startsWith('price'));
			if (!priceStrong) {
				return null;
			}
			let priceNode = priceStrong.nextElementSibling;
			if (!(priceNode instanceof HTMLElement)) {
				priceNode = priceStrong.parentElement ? priceStrong.parentElement.querySelector('span') : null;
			}
			if (!(priceNode instanceof HTMLElement)) {
				priceNode = card.querySelector('span');
			}
			if (!(priceNode instanceof HTMLElement)) {
				return null;
			}
			const priceText = priceNode.textContent || '';
			const price = parsePrice(priceText);
			if (!Number.isFinite(price)) {
				return null;
			}
			let quantityNode = null;
			let quantity = null;
			if (card.dataset && card.dataset.quantity) {
				const parsedQuantity = parseQuantity(card.dataset.quantity);
				if (Number.isFinite(parsedQuantity)) {
					quantity = parsedQuantity;
				}
			}
			if (quantity === null) {
				const quantityStrong = strongTags.find(node => node.textContent && node.textContent.trim().toLowerCase().startsWith('qty'));
				if (quantityStrong) {
					quantityNode = quantityStrong.nextElementSibling;
					if (!(quantityNode instanceof HTMLElement)) {
						quantityNode = quantityStrong.parentElement ? quantityStrong.parentElement.querySelector('span:nth-of-type(2)') : null;
					}
					const parsedQuantity = parseQuantity(quantityNode ? quantityNode.textContent : '');
					if (Number.isFinite(parsedQuantity)) {
						quantity = parsedQuantity;
					}
				}
			}
			return { priceNode, price, quantity, quantityNode };
		}

	function clearEntry(element) {
		if (!element) {
			return;
		}
		resetTooltip(element, true);
		FLAG_CLASSES.forEach(className => element.classList.remove(className));
		if (element.dataset && element.dataset.mcReasons) {
			delete element.dataset.mcReasons;
		}
		const profit = element.querySelector('.mc-profit');
		if (profit) {
			profit.remove();
		}
		element.querySelectorAll('[data-mc-qty-base]').forEach(node => {
			restoreQuantityNode(node);
		});
	}

		function restoreQuantityNode(node) {
			if (!node || !node.dataset) {
				return;
			}
			if (node.dataset.mcQtyBase !== undefined) {
				node.textContent = node.dataset.mcQtyBase;
				delete node.dataset.mcQtyBase;
			}
		}

		function updateQuantitySummary(node, quantity, profitPerItem) {
			if (!node) {
				return;
			}
			if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(profitPerItem)) {
				restoreQuantityNode(node);
				return;
			}
			if (node.dataset.mcQtyBase === undefined) {
				node.dataset.mcQtyBase = node.textContent;
			}
			const baseText = node.dataset.mcQtyBase || node.textContent || '';
			const normalizedBase = baseText.trim();
			const totalProfit = Math.round(profitPerItem * quantity);
			const formattedTotal = formatCurrency(totalProfit);
			node.textContent = normalizedBase ? `${normalizedBase} - earn ${formattedTotal}` : `earn ${formattedTotal}`;
		}

	function clearPriceNode(node) {
		if (!node) {
			return;
		}
		resetTooltip(node, true);
		TREND_CLASSES.forEach(className => node.classList.remove(className));
		const wrapper = node.querySelector('.mc-price-inline');
		if (wrapper) {
			while (wrapper.firstChild) {
				node.insertBefore(wrapper.firstChild, wrapper);
			}
			wrapper.remove();
		}
		removeDiffBadge(node);
		node.querySelectorAll('.mc-flip-tag').forEach(tag => tag.remove());
		node.removeAttribute('title');
		node.style.removeProperty('white-space');
		node.style.removeProperty('word-break');
		node.style.removeProperty('display');
		node.style.removeProperty('align-items');
		node.style.removeProperty('gap');
		node.style.removeProperty('min-width');
		node.style.removeProperty('flex');
	}

	function preparePriceNode(node) {
		if (!node) {
			return;
		}
		node.style.whiteSpace = 'nowrap';
		node.style.wordBreak = 'normal';
	}

	function ensureTileLayout(container) {
		if (!container) {
			return;
		}
		container.style.display = 'flex';
		container.style.flexDirection = 'column';
		container.style.alignItems = 'stretch';
		container.style.justifyContent = 'flex-start';
		container.style.gap = '1px';
		container.style.minWidth = '0';
		container.style.position = 'relative';
		container.dataset.mcLayoutApplied = '1';
		const nameNode = container.querySelector('[class*="name"]');
		if (nameNode) {
			nameNode.style.order = '1';
			nameNode.style.whiteSpace = 'normal';
			nameNode.style.wordBreak = 'break-word';
			nameNode.style.overflow = 'visible';
			nameNode.style.textOverflow = 'clip';
			nameNode.style.position = 'relative';
			nameNode.style.zIndex = '1';
			nameNode.style.marginBottom = '0';
			nameNode.style.flex = '0 1 auto';
			nameNode.style.maxWidth = '100%';
		}
	}

	function ensurePriceBlockLayout(priceBlock) {
		if (!priceBlock) {
			return;
		}
		priceBlock.style.display = 'flex';
		priceBlock.style.flexWrap = 'wrap';
		priceBlock.style.alignItems = 'flex-start';
		priceBlock.style.justifyContent = 'flex-start';
		priceBlock.style.gap = '2px';
		priceBlock.style.whiteSpace = 'normal';
		priceBlock.style.wordBreak = 'break-word';
		priceBlock.style.marginTop = '0';
		priceBlock.style.marginBottom = '0';
		priceBlock.style.width = '100%';
		priceBlock.style.maxWidth = '100%';
		priceBlock.style.position = 'static';
		priceBlock.style.alignSelf = 'stretch';
		priceBlock.style.float = 'none';
		priceBlock.style.clear = 'both';
		priceBlock.style.order = '3';
		priceBlock.style.boxSizing = 'border-box';
		priceBlock.style.flex = '0 1 auto';
		priceBlock.style.textAlign = 'left';
		priceBlock.dataset.mcPriceLayout = '1';
	}

	function applyTrend(node, price, marketValue) {
		if (!node || !marketValue) {
			return;
		}
		if (price < marketValue) {
			node.classList.add('mc-price-below');
		} else if (price > marketValue) {
			node.classList.add('mc-price-above');
		} else {
			node.classList.add('mc-price-equal');
		}
	}

	function updateDiffBadge(node, price, referenceValue, options = {}) {
		removeDiffBadge(node);
		if (!node || !Number.isFinite(price) || !Number.isFinite(referenceValue) || referenceValue === 0) {
			return;
		}
		const container = ensurePriceInlineWrapper(node);
		if (!container) {
			return;
		}
		const mode = options.mode || 'baseline';
		const label = options.label || (mode === 'relative' ? 'prev' : 'mkt');
		const percent = ((price / referenceValue) - 1) * 100;
		const formatted = percentFormatter.format(percent);
		const text = `(${percent > 0 ? '+' : ''}${formatted}% v.${label})`;
		const badge = document.createElement('span');
		badge.className = 'mc-diff';
		badge.style.whiteSpace = 'nowrap';
		badge.textContent = text;
		container.appendChild(badge);
	}

	function removeDiffBadge(node) {
		if (!node) {
			return;
		}
		const existing = node.querySelector('.mc-diff');
		if (existing) {
			existing.remove();
		}
	}

	function ensurePriceInlineWrapper(node) {
		if (!node) {
			return null;
		}
		let wrapper = node.querySelector('.mc-price-inline');
		if (!wrapper) {
			wrapper = document.createElement('span');
			wrapper.className = 'mc-price-inline';
			wrapper.style.display = 'inline-flex';
			wrapper.style.alignItems = 'baseline';
			wrapper.style.flexWrap = 'nowrap';
			wrapper.style.gap = '4px';
			wrapper.style.minWidth = '0';
			wrapper.style.whiteSpace = 'nowrap';
			while (node.firstChild) {
				wrapper.appendChild(node.firstChild);
			}
			node.appendChild(wrapper);
		}
		node.style.display = 'inline-flex';
		node.style.alignItems = 'baseline';
		node.style.gap = '4px';
		node.style.whiteSpace = 'nowrap';
		node.style.minWidth = '0';
		node.style.flex = '0 1 auto';
		return wrapper;
	}

	function updateTileTint(priceBlock, price, marketValue) {
		if (!priceBlock) {
			return;
		}
		priceBlock.classList.remove('mc-tile-highlight');
		priceBlock.style.removeProperty('background-color');
		const baseline = Number.isFinite(marketValue) ? marketValue : Number.parseFloat(marketValue);
		if (!Number.isFinite(price) || !Number.isFinite(baseline) || baseline <= 0) {
			return;
		}
		const deviation = (price - baseline) / baseline;
		const threshold = UI_SETTINGS.TILE_TINT_THRESHOLD;
		if (!Number.isFinite(deviation) || Math.abs(deviation) < threshold) {
			return;
		}
		const clamped = Math.min(Math.abs(deviation), 1);
		const normalized = clamped <= threshold ? 0 : (clamped - threshold) / Math.max(1 - threshold, 0.0001);
		const alpha = UI_SETTINGS.TILE_TINT_ALPHA_MIN + UI_SETTINGS.TILE_TINT_ALPHA_RANGE * normalized;
		const tint = deviation < 0 ? `rgba(46, 204, 113, ${alpha.toFixed(3)})` : `rgba(192, 57, 43, ${alpha.toFixed(3)})`;
		priceBlock.classList.add('mc-tile-highlight');
		priceBlock.style.backgroundColor = tint;
	}

	function addFlag(element, className, reason) {
		element.classList.add('mc-flagged', className);
		const reasons = element.dataset.mcReasons ? element.dataset.mcReasons.split('|').filter(Boolean) : [];
		if (!reasons.includes(reason)) {
			reasons.push(reason);
		}
		element.dataset.mcReasons = reasons.join('|');
	}

	function shouldFlagMarketValue(price, marketValue) {
		if (!marketValue) {
			return false;
		}
		return price <= marketValue * (1 - MARGINS.marketUndercut);
	}

	function shouldFlagGap(price, nextPrice, threshold) {
		if (!Number.isFinite(price) || !Number.isFinite(nextPrice) || nextPrice <= 0) {
			return false;
		}
		const gap = (nextPrice - price) / nextPrice;
		return gap >= threshold;
	}

	function shouldFlagBazaarMarketValue(price, marketValue) {
		if (!marketValue) {
			return false;
		}
		return price <= marketValue * (1 - MARGINS.bazaarUndercut);
	}

	function shouldFlagBazaarGap(price, cheapestMarket, threshold) {
		if (!Number.isFinite(price) || !Number.isFinite(cheapestMarket) || cheapestMarket <= 0) {
			return false;
		}
		return price <= cheapestMarket * (1 - threshold);
	}

	function deriveTargetSalePrice(summary) {
		if (!summary || !Number.isFinite(summary.cheapest)) {
			return null;
		}
		const target = Math.max(Math.floor(summary.cheapest) - 1, 0);
		return target > 0 ? target : null;
	}

	function evaluateBazaarFlip(listingPrice, targetSalePrice) {
		if (!Number.isFinite(listingPrice) || !Number.isFinite(targetSalePrice) || targetSalePrice <= 0) {
			return null;
		}
		const listFee = targetSalePrice * CONFIG.LISTING_FEE;
		const netRevenue = targetSalePrice - listFee;
		const profit = netRevenue - listingPrice;
		const marginFraction = Number.isFinite(listingPrice) && listingPrice > 0 ? profit / listingPrice : Number.NaN;
		const meetsPercent = Number.isFinite(marginFraction) && marginFraction >= UI_SETTINGS.BAZAAR_UNDERCUT_MARGIN;
		const meetsCash = Number.isFinite(profit) && profit >= UI_SETTINGS.BAZAAR_FLIP_MIN_PROFIT;
		const qualifies = meetsPercent && meetsCash && profit > 0;
		return { listAt: targetSalePrice, listFee, netRevenue, profit, marginFraction, meetsPercent, meetsCash, qualifies };
	}

	function evaluateMarketFlip(currentPrice, nextPrice) {
		if (!Number.isFinite(currentPrice) || !Number.isFinite(nextPrice) || nextPrice <= currentPrice) {
			return null;
		}
		const candidateList = Math.max(Math.floor(nextPrice) - 1, currentPrice);
		if (!Number.isFinite(candidateList) || candidateList <= currentPrice) {
			return null;
		}
		const listFee = candidateList * CONFIG.LISTING_FEE;
		const netRevenue = candidateList - listFee;
		const profit = netRevenue - currentPrice;
		if (!Number.isFinite(profit) || profit <= 0) {
			return { listAt: candidateList, listFee, netRevenue, profit, marginFraction: Number.NaN, meetsPercent: false, meetsCash: false, qualifies: false };
		}
		const gapFraction = (nextPrice - currentPrice) / nextPrice;
		const marginFraction = profit / currentPrice;
		const meetsPercent = Number.isFinite(gapFraction) && gapFraction >= UI_SETTINGS.MARKET_GAP_THRESHOLD;
		const meetsCash = profit >= UI_SETTINGS.ITEM_FLIP_MIN_PROFIT;
		const qualifies = meetsPercent && meetsCash;
		return { listAt: candidateList, listFee, netRevenue, profit, marginFraction, meetsPercent, meetsCash, qualifies };
	}

	function buildFlipTooltipLine(flipEval) {
		if (!flipEval || !Number.isFinite(flipEval.profit)) {
			return 'Flip Profit n/a';
		}
		const feeCurrency = formatCurrency(Math.round(flipEval.listFee));
		const listCurrency = formatCurrency(Math.round(flipEval.listAt));
		return `Flip Profit ${formatSignedCurrency(flipEval.profit)} (${listCurrency} - ${feeCurrency})`;
	}

	function applyBazaarTooltip(card, listing, itemData, summary, flipEval) {
		if (!card || !listing || !listing.priceNode) {
			return;
		}
		const marketValueLine = Number.isFinite(itemData.marketValue) ? `${formatDiffLine(listing.price, itemData.marketValue)} from market value` : null;
		const cheapest = summary && Number.isFinite(summary.cheapest) ? summary.cheapest : null;
		const cheapestLine = Number.isFinite(cheapest) ? `${formatDiffLine(listing.price, cheapest)} from cheapest market item` : null;
		const flipLine = buildFlipTooltipLine(flipEval);
		const cardLines = ['MarketComparison-', marketValueLine, cheapestLine, flipLine];
		if (flipEval && flipEval.qualifies) {
			cardLines.push('FLIP!!!');
		}
		setTooltip(card, cardLines);
		setTooltip(listing.priceNode, []);
	}

	function applyMarketTooltip(entry, itemData, previousEntry, nextEntry, flipEval, index) {
		if (!entry || !entry.row || !entry.priceNode) {
			return;
		}
		const lines = ['MarketComparison-'];
		const priceLines = ['MarketComparison-'];
		const marketValueLine = Number.isFinite(itemData.marketValue) ? `${formatDiffLine(entry.price, itemData.marketValue)} from market value` : null;
		if (marketValueLine) {
			lines.push(marketValueLine);
			priceLines.push(marketValueLine);
		}
		if (index === 0) {
			if (nextEntry && Number.isFinite(nextEntry.price)) {
				const nextLine = `${formatDiffLine(entry.price, nextEntry.price)} from next cheapest market item`;
				lines.push(nextLine);
				priceLines.push(nextLine);
			}
			const flipLine = buildFlipTooltipLine(flipEval);
			lines.push(flipLine);
			priceLines.push(flipLine);
			if (flipEval && flipEval.qualifies) {
				lines.push('FLIP!!!');
				priceLines.push('FLIP!!!');
			}
		} else {
			if (previousEntry && Number.isFinite(previousEntry.price)) {
				const prevLine = `${formatDiffLine(entry.price, previousEntry.price)} from previous market item`;
				lines.push(prevLine);
				priceLines.push(prevLine);
				const gapFraction = (entry.price - previousEntry.price) / entry.price;
				if (Number.isFinite(gapFraction) && gapFraction > 0) {
					const gapLine = `Gap to previous: ${formatPercent(gapFraction)} (target ≥ ${formatPercent(UI_SETTINGS.MARKET_GAP_THRESHOLD)})`;
					lines.push(gapLine);
				}
			}
		}
		setTooltip(entry.row, lines);
		setTooltip(entry.priceNode, priceLines);
	}

	function renderFlipProfit(card, flipEval, listing) {
		removeExistingProfit(card);
		if (!card || !flipEval || !flipEval.qualifies) {
			if (listing && listing.quantityNode) {
				restoreQuantityNode(listing.quantityNode);
			}
			return;
		}
		const profitNode = document.createElement('div');
		profitNode.className = 'mc-profit';
		const formattedTarget = formatCurrency(Math.round(flipEval.listAt));
		const formattedProfit = formatCurrency(Math.round(flipEval.profit));
		const profitClass = flipEval.profit > 0 ? 'mc-profit-positive' : flipEval.profit < 0 ? 'mc-profit-negative' : 'mc-profit-neutral';
		profitNode.classList.add(profitClass);
		profitNode.style.whiteSpace = 'nowrap';
		profitNode.style.wordBreak = 'normal';
		profitNode.textContent = `Flip @ ${formattedTarget} -> earn ${formattedProfit}`;
		card.appendChild(profitNode);
		const quantityValue = listing && Number.isFinite(listing.quantity) && listing.quantity > 0 ? listing.quantity : 1;
		if (listing && listing.quantityNode && flipEval.profit > 0) {
			updateQuantitySummary(listing.quantityNode, quantityValue, flipEval.profit);
		}
	}

		function removeExistingProfit(card) {
			const existing = card.querySelector('.mc-profit');
			if (existing) {
				existing.remove();
			}
		}

	function extractItemId(tile) {
		if (tile.dataset.mcItemId) {
			return tile.dataset.mcItemId;
		}
		const button = tile.querySelector('button[aria-controls^="wai-ariaControls-buy-"]') || tile.querySelector('button[aria-controls^="wai-itemInfo-"]');
		if (button) {
			const attr = button.getAttribute('aria-controls') || '';
			const match = attr.match(/(\d+)/);
			if (match) {
				return match[1];
			}
		}
		const name = extractItemName(tile);
		if (!name) {
			return null;
		}
		const normalized = normalizeItemName(name);
		if (!normalized) {
			return null;
		}
		return STATE.itemsByName.get(normalized) || null;
	}

	function extractItemName(tile) {
		if (!tile) {
			return null;
		}
		const titleContainer = tile.querySelector('[class*="title"]');
		if (!titleContainer) {
			return null;
		}
		const nameNode = titleContainer.querySelector('[class*="name"]');
		if (nameNode && nameNode.textContent) {
			return nameNode.textContent.trim();
		}
		const clone = titleContainer.cloneNode(true);
		clone.querySelectorAll('.mc-market-baseline').forEach(node => node.remove());
		const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
		return text || null;
	}

	function normalizeItemName(value) {
		if (typeof value !== 'string') {
			return '';
		}
		return value.trim().toLowerCase().replace(/\s+/g, ' ');
	}

	function findPriceBlock(tile) {
		if (!tile) {
			return null;
		}
		return tile.querySelector('[class*="priceAndTotal"]') || tile.querySelector('[class*="price___"]');
	}

	function findPriceNode(element) {
		if (!element) {
			return null;
		}
		return element.querySelector('[class*="price___"]') || element.querySelector('[class*="price"]');
	}

	function parsePrice(raw) {
		if (raw === undefined || raw === null) {
			return NaN;
		}
		const match = String(raw).match(/[\d.,]+/);
		if (!match) {
			return NaN;
		}
		const normalized = match[0].replace(/,/g, '');
		const value = Number.parseFloat(normalized);
		return Number.isFinite(value) ? value : NaN;
	}

	function parseQuantity(raw) {
		if (raw === undefined || raw === null) {
			return NaN;
		}
		const normalized = String(raw).replace(/[^\d]/g, '');
		if (!normalized) {
			return NaN;
		}
		const value = Number.parseInt(normalized, 10);
		return Number.isFinite(value) ? value : NaN;
	}

	function readPrice(node) {
		if (!node) {
			return NaN;
		}
		const clone = node.cloneNode(true);
		clone.querySelectorAll('.mc-diff, .mc-qty').forEach(el => el.remove());
		const text = clone.textContent || '';
		return parsePrice(text);
	}

	function loadStoredSettings() {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
			if (!raw) {
				return;
			}
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object') {
				return;
			}
			SETTINGS_SCHEMA.forEach(field => {
				const candidate = Number.parseFloat(parsed[field.key]);
				if (!Number.isFinite(candidate)) {
					return;
				}
				const internalMin = field.min !== undefined ? toInternalValue(field, field.min) : undefined;
				const internalMax = field.max !== undefined ? toInternalValue(field, field.max) : undefined;
				if ((internalMin !== undefined && candidate < internalMin) || (internalMax !== undefined && candidate > internalMax)) {
					return;
				}
				UI_SETTINGS[field.key] = candidate;
			});
			syncMarginsFromSettings();
		} catch (error) {
			console.warn('[MarketComparison] Failed to load settings from storage:', error);
		}
	}

	function loadStoredUiPrefs() {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEYS.UI);
			if (!raw) {
				return;
			}
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object') {
				return;
			}
			const top = Number.parseFloat(parsed.buttonTop);
			const left = Number.parseFloat(parsed.buttonLeft);
			if (Number.isFinite(top)) {
				UI_PREFS.buttonTop = top;
			}
			if (Number.isFinite(left)) {
				UI_PREFS.buttonLeft = left;
			}
		} catch (error) {
			console.warn('[MarketComparison] Failed to load UI prefs from storage:', error);
		}
	}

	function loadStoredApiKey() {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEYS.API);
			if (!raw) {
				return null;
			}
			const trimmed = raw.trim();
			return trimmed.length > 0 ? trimmed : null;
		} catch (error) {
			console.warn('[MarketComparison] Failed to load API key from storage:', error);
			return null;
		}
	}

	function persistApiKey(value) {
		try {
			if (!value) {
				window.localStorage.removeItem(STORAGE_KEYS.API);
				return;
			}
			window.localStorage.setItem(STORAGE_KEYS.API, value);
		} catch (error) {
			console.warn('[MarketComparison] Failed to persist API key:', error);
		}
	}

	function resolveInitialApiKey() {
		const placeholder = typeof CONFIG.API_KEY_PLACEHOLDER === 'string' ? CONFIG.API_KEY_PLACEHOLDER : '###PDA-APIKEY###';
		STATE.isPda = placeholder.length > 0 && placeholder[0] !== '#';
		if (STATE.isPda) {
			STATE.apiKey = placeholder;
			return;
		}
		const stored = loadStoredApiKey();
		if (stored) {
			STATE.apiKey = stored;
		}
	}

	function ensureApiKey() {
		if (STATE.apiKey) {
			return true;
		}
		if (STATE.isPda) {
			window.alert('MarketComparison: Torn PDA did not supply an API key. Add a Limited key in the PDA settings.');
			return false;
		}
		const input = window.prompt('MarketComparison: Enter your Torn API key (Limited access recommended):', '');
		if (input && input.trim()) {
			const normalized = input.trim();
			STATE.apiKey = normalized;
			persistApiKey(normalized);
			return true;
		}
		window.alert('MarketComparison: No API key provided. Baseline pricing will remain unavailable.');
		return false;
	}

	function persistSettings() {
		try {
			window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(UI_SETTINGS));
		} catch (error) {
			console.warn('[MarketComparison] Failed to persist settings:', error);
		}
	}

	function persistUiPrefs() {
		try {
			window.localStorage.setItem(STORAGE_KEYS.UI, JSON.stringify(UI_PREFS));
		} catch (error) {
			console.warn('[MarketComparison] Failed to persist UI prefs:', error);
		}
	}

	function ensureConfigUi() {
		if (!document.body) {
			return;
		}
		if (!UI_RUNTIME.button) {
			createConfigButton();
		}
		if (!UI_RUNTIME.panel) {
			createConfigPanel();
			syncInputsFromSettings();
		}
	}

	function createConfigButton() {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'mc-config-button';
		button.textContent = 'MC';
		document.body.appendChild(button);
		setButtonPosition(button, UI_PREFS.buttonTop, UI_PREFS.buttonLeft);
		persistUiPrefs();
		button.addEventListener('mousedown', handleButtonMouseDown);
		button.addEventListener('click', handleButtonClick);
		UI_RUNTIME.button = button;
	}

	function createConfigPanel() {
		const panel = document.createElement('div');
		panel.className = 'mc-config-panel';
		panel.addEventListener('click', event => event.stopPropagation());
		const heading = document.createElement('h3');
		heading.textContent = 'MarketComparison Settings';
		panel.appendChild(heading);
		UI_RUNTIME.inputs.clear();
		SETTINGS_SCHEMA.forEach(field => {
			const row = document.createElement('div');
			row.className = 'mc-config-row';
			const label = document.createElement('label');
			const inputId = `mc-config-${field.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
			label.setAttribute('for', inputId);
			label.textContent = field.label;
			const input = document.createElement('input');
			input.id = inputId;
			input.type = 'number';
			if (field.step !== undefined) {
				input.step = String(field.step);
			}
			if (field.min !== undefined) {
				input.min = String(field.min);
			}
			if (field.max !== undefined) {
				input.max = String(field.max);
			}
			row.appendChild(label);
			row.appendChild(input);
			if (field.description) {
				const description = document.createElement('div');
				description.className = 'mc-config-description';
				description.textContent = field.description;
				row.appendChild(description);
			}
			panel.appendChild(row);
			UI_RUNTIME.inputs.set(field.key, input);
		});
		const actions = document.createElement('div');
		actions.className = 'mc-config-actions';
		const cancel = document.createElement('button');
		cancel.type = 'button';
		cancel.className = 'mc-config-cancel';
		cancel.textContent = 'Cancel';
		cancel.addEventListener('click', handleCancelSettings);
		const save = document.createElement('button');
		save.type = 'button';
		save.className = 'mc-config-save';
		save.textContent = 'Save';
		save.addEventListener('click', handleSaveSettings);
		actions.appendChild(cancel);
		actions.appendChild(save);
		panel.appendChild(actions);
		document.body.appendChild(panel);
		UI_RUNTIME.panel = panel;
	}

	function setButtonPosition(button, top, left) {
		const fallbackTop = Number.isFinite(top) ? top : DEFAULT_UI_PREFS.buttonTop;
		const fallbackLeft = Number.isFinite(left) ? left : DEFAULT_UI_PREFS.buttonLeft;
		const maxTop = Math.max(window.innerHeight - button.offsetHeight, 0);
		const maxLeft = Math.max(window.innerWidth - button.offsetWidth, 0);
		const clampedTop = Math.min(Math.max(fallbackTop, 0), maxTop);
		const clampedLeft = Math.min(Math.max(fallbackLeft, 0), maxLeft);
		button.style.top = `${clampedTop}px`;
		button.style.left = `${clampedLeft}px`;
		UI_PREFS.buttonTop = clampedTop;
		UI_PREFS.buttonLeft = clampedLeft;
	}

	function handleButtonMouseDown(event) {
		if (event.button !== 0) {
			return;
		}
		if (!UI_RUNTIME.button) {
			return;
		}
		UI_RUNTIME.drag = {
			startX: event.clientX,
			startY: event.clientY,
			initialTop: UI_PREFS.buttonTop,
			initialLeft: UI_PREFS.buttonLeft,
			moved: false,
		};
		document.addEventListener('mousemove', handleButtonMouseMove);
		document.addEventListener('mouseup', handleButtonMouseUp);
		event.preventDefault();
	}

	function handleButtonMouseMove(event) {
		const drag = UI_RUNTIME.drag;
		const button = UI_RUNTIME.button;
		if (!drag || !button) {
			return;
		}
		const deltaX = event.clientX - drag.startX;
		const deltaY = event.clientY - drag.startY;
		if (!drag.moved && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
			drag.moved = true;
		}
		setButtonPosition(button, drag.initialTop + deltaY, drag.initialLeft + deltaX);
	}

	function handleButtonMouseUp() {
		document.removeEventListener('mousemove', handleButtonMouseMove);
		document.removeEventListener('mouseup', handleButtonMouseUp);
		const drag = UI_RUNTIME.drag;
		UI_RUNTIME.drag = null;
		if (drag && drag.moved) {
			UI_RUNTIME.justDragged = true;
			window.setTimeout(() => {
				UI_RUNTIME.justDragged = false;
			}, 0);
			persistUiPrefs();
		}
	}

	function handleButtonClick(event) {
		if (UI_RUNTIME.justDragged) {
			event.preventDefault();
			return;
		}
		toggleConfigPanel();
	}

	function toggleConfigPanel() {
		if (!UI_RUNTIME.panel) {
			return;
		}
		if (UI_RUNTIME.panel.classList.contains('mc-open')) {
			closeConfigPanel();
		} else {
			openConfigPanel();
		}
	}

	function openConfigPanel() {
		if (!UI_RUNTIME.panel) {
			return;
		}
		syncInputsFromSettings();
		clearInputErrors();
		UI_RUNTIME.panel.classList.add('mc-open');
		positionConfigPanel();
	}

	function closeConfigPanel() {
		if (!UI_RUNTIME.panel) {
			return;
		}
		UI_RUNTIME.panel.classList.remove('mc-open');
		clearInputErrors();
	}

	function positionConfigPanel() {
		const panel = UI_RUNTIME.panel;
		const button = UI_RUNTIME.button;
		if (!panel || !button) {
			return;
		}
		const wasHidden = !panel.classList.contains('mc-open');
		if (wasHidden) {
			panel.classList.add('mc-open');
			panel.style.visibility = 'hidden';
		}
		const panelRect = panel.getBoundingClientRect();
		const buttonRect = button.getBoundingClientRect();
		const verticalSpacing = 8;
		let top = buttonRect.bottom + verticalSpacing;
		let left = buttonRect.left;
		const maxTop = window.innerHeight - panelRect.height - verticalSpacing;
		const maxLeft = window.innerWidth - panelRect.width - verticalSpacing;
		top = Math.min(Math.max(top, verticalSpacing), Math.max(maxTop, verticalSpacing));
		left = Math.min(Math.max(left, verticalSpacing), Math.max(maxLeft, verticalSpacing));
		panel.style.top = `${top}px`;
		panel.style.left = `${left}px`;
		if (wasHidden) {
			panel.classList.remove('mc-open');
			panel.style.removeProperty('visibility');
		}
	}

	function syncInputsFromSettings() {
		SETTINGS_SCHEMA.forEach(field => {
			const input = UI_RUNTIME.inputs.get(field.key);
			if (!input) {
				return;
			}
			const internal = UI_SETTINGS[field.key];
			const displayValue = toDisplayValue(field, internal);
			if (Number.isFinite(displayValue)) {
				input.value = formatSettingValue(displayValue, field);
			} else {
				input.value = '';
			}
		});
	}

	function clearInputErrors() {
		UI_RUNTIME.inputs.forEach(input => {
			input.classList.remove('mc-error');
		});
	}

	function toDisplayValue(field, internalValue) {
		if (!Number.isFinite(internalValue)) {
			return Number.NaN;
		}
		const scale = Number.isFinite(field.scale) ? field.scale : 1;
		return internalValue * scale;
	}

	function toInternalValue(field, displayValue) {
		const scale = Number.isFinite(field.scale) && field.scale !== 0 ? field.scale : 1;
		return displayValue / scale;
	}

	function formatSettingValue(value, field) {
		if (!Number.isFinite(value)) {
			return '';
		}
		const decimals = getFieldDecimals(field);
		if (decimals === null) {
			return String(value);
		}
		const fixed = Number(value).toFixed(decimals);
		const normalized = Number(fixed);
		return Number.isFinite(normalized) ? normalized.toString() : fixed;
	}

	function getFieldDecimals(field) {
		if (Number.isInteger(field.decimals) && field.decimals >= 0) {
			return field.decimals;
		}
		if (typeof field.step === 'number') {
			const stepString = field.step.toString();
			if (stepString.includes('.')) {
				return stepString.split('.')[1].length;
			}
			return 0;
		}
		return null;
	}

	function readSettingsFromInputs() {
		const next = {};
		let invalid = false;
		SETTINGS_SCHEMA.forEach(field => {
			const input = UI_RUNTIME.inputs.get(field.key);
			if (!input) {
				return;
			}
			input.classList.remove('mc-error');
			const displayValue = Number.parseFloat(input.value);
			if (!Number.isFinite(displayValue) || (field.min !== undefined && displayValue < field.min) || (field.max !== undefined && displayValue > field.max)) {
				input.classList.add('mc-error');
				invalid = true;
				return;
			}
			const internalValue = toInternalValue(field, displayValue);
			next[field.key] = internalValue;
		});
		if (invalid) {
			return null;
		}
		const min = next.TILE_TINT_ALPHA_MIN;
		const range = next.TILE_TINT_ALPHA_RANGE;
		if (Number.isFinite(min) && Number.isFinite(range) && min + range > 1) {
			const minInput = UI_RUNTIME.inputs.get('TILE_TINT_ALPHA_MIN');
			const rangeInput = UI_RUNTIME.inputs.get('TILE_TINT_ALPHA_RANGE');
			if (minInput) {
				minInput.classList.add('mc-error');
			}
			if (rangeInput) {
				rangeInput.classList.add('mc-error');
			}
			return null;
		}
		return next;
	}

	function clampFraction(value, fallback = 0) {
		const baseCandidate = Number.isFinite(value) ? value : fallback;
		const base = Number.isFinite(baseCandidate) ? baseCandidate : 0;
		return Math.min(Math.max(base, 0), 1);
	}

	function syncMarginsFromSettings() {
		const listingFee = clampFraction(CONFIG.LISTING_FEE, 0);
		const marketUndercut = clampFraction(UI_SETTINGS.MARKET_UNDERCUT_MARGIN, DEFAULT_SETTINGS.MARKET_UNDERCUT_MARGIN);
		const marketGap = clampFraction(UI_SETTINGS.MARKET_GAP_THRESHOLD, DEFAULT_SETTINGS.MARKET_GAP_THRESHOLD);
		const bazaarUndercut = clampFraction(UI_SETTINGS.BAZAAR_UNDERCUT_MARGIN, DEFAULT_SETTINGS.BAZAAR_UNDERCUT_MARGIN);
		const bazaarGap = clampFraction(UI_SETTINGS.BAZAAR_GAP_THRESHOLD, DEFAULT_SETTINGS.BAZAAR_GAP_THRESHOLD);
		const marketUndercutTotal = marketUndercut + listingFee;
		const marketGapTotal = marketGap + listingFee;
		const bazaarUndercutNet = bazaarUndercut - listingFee;
		const bazaarGapNet = bazaarGap - listingFee;
		MARGINS.marketUndercut = clampFraction(marketUndercutTotal, marketUndercutTotal);
		MARGINS.marketGap = clampFraction(marketGapTotal, marketGapTotal);
		MARGINS.bazaarUndercut = clampFraction(bazaarUndercutNet, 0);
		MARGINS.bazaarGap = clampFraction(bazaarGapNet, 0);
	}

	function handleSaveSettings(event) {
		event.preventDefault();
		const next = readSettingsFromInputs();
		if (!next) {
			return;
		}
		Object.assign(UI_SETTINGS, next);
		syncMarginsFromSettings();
		persistSettings();
		closeConfigPanel();
		processAll();
	}

	function handleCancelSettings(event) {
		event.preventDefault();
		syncInputsFromSettings();
		closeConfigPanel();
	}

	function handleDocumentClick(event) {
		if (!UI_RUNTIME.panel || !UI_RUNTIME.panel.classList.contains('mc-open')) {
			return;
		}
		const target = event.target;
		if (!target) {
			return;
		}
		if (UI_RUNTIME.panel.contains(target) || (UI_RUNTIME.button && (UI_RUNTIME.button === target || UI_RUNTIME.button.contains(target)))) {
			return;
		}
		closeConfigPanel();
	}

	function handleKeyDown(event) {
		if (event.key !== 'Escape') {
			return;
		}
		if (!UI_RUNTIME.panel || !UI_RUNTIME.panel.classList.contains('mc-open')) {
			return;
		}
		closeConfigPanel();
	}

	function handleWindowResize() {
		if (UI_RUNTIME.button) {
			setButtonPosition(UI_RUNTIME.button, UI_PREFS.buttonTop, UI_PREFS.buttonLeft);
			persistUiPrefs();
		}
		if (UI_RUNTIME.panel && UI_RUNTIME.panel.classList.contains('mc-open')) {
			positionConfigPanel();
		}
		scheduleProcess();
	}

	function bindGlobalUiHandlers() {
		if (UI_RUNTIME.listenersBound) {
			return;
		}
		document.addEventListener('click', handleDocumentClick);
		document.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleWindowResize);
		UI_RUNTIME.listenersBound = true;
	}

	function formatNumber(value) {
		return numberFormatter.format(Math.round(value));
	}

	function formatCurrency(value) {
		return currencyFormatter.format(Math.round(value));
	}

	function formatPercent(fraction) {
		return `${percentFormatter.format(fraction * 100)}%`;
	}

	function formatSignedCurrency(value) {
		if (!Number.isFinite(value)) {
			return 'n/a';
		}
		const sign = value > 0 ? '+' : value < 0 ? '-' : '±';
		return `${sign}${formatCurrency(Math.abs(value))}`;
	}

	function formatSignedPercent(value, baseline) {
		if (!Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0) {
			return 'n/a';
		}
		const delta = (value - baseline) / baseline;
		const sign = delta > 0 ? '+' : delta < 0 ? '-' : '±';
		return `${sign}${percentFormatter.format(Math.abs(delta * 100))}%`;
	}

	function formatDiffLine(value, baseline) {
		if (!Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0) {
			return null;
		}
		const delta = value - baseline;
		return `${formatSignedCurrency(delta)} (${formatSignedPercent(value, baseline)})`;
	}

	function resetTooltip(element, force = false) {
		if (!element) {
			return;
		}
		const title = element.getAttribute('title');
		const ownsTooltip = element.dataset && element.dataset.mcTooltip === '1';
		const hasMcTitle = typeof title === 'string' && title.startsWith('MarketComparison');
		if (!force && !ownsTooltip && !hasMcTitle) {
			return;
		}
		if (element._tippy && typeof element._tippy.destroy === 'function') {
			element._tippy.destroy();
		}
		const describedBy = element.getAttribute('aria-describedby');
		if (describedBy) {
			describedBy.split(/\s+/).forEach(id => {
				if (!id || !id.startsWith('tippy-')) {
					return;
				}
				const tooltipNode = document.getElementById(id);
				if (tooltipNode && tooltipNode.parentElement) {
					tooltipNode.parentElement.removeChild(tooltipNode);
				}
			});
		}
		element.removeAttribute('aria-describedby');
		element.removeAttribute('data-original-title');
		element.removeAttribute('data-tippy-content');
		if (element.dataset) {
			delete element.dataset.mcTooltip;
		}
		if (force || hasMcTitle) {
			element.removeAttribute('title');
		}
	}

	function setTooltip(element, lines) {
		if (!element) {
			return;
		}
		resetTooltip(element, true);
		const content = Array.isArray(lines) ? lines.filter(Boolean) : [];
		if (content.length === 1 && content[0] === 'MarketComparison-') {
			return;
		}
		if (!content.length) {
			return;
		}
		element.title = content.join('\n');
		if (element.dataset) {
			element.dataset.mcTooltip = '1';
		}
	}

	function handleError(error) {
		console.error('[MarketComparison] Unhandled error:', error);
	}

	function waitForElement(fn, timeoutMs) {
		return new Promise(resolve => {
			const existing = fn();
			if (existing) {
				resolve(existing);
				return;
			}
			const observer = new MutationObserver(() => {
				const element = fn();
				if (element) {
					observer.disconnect();
					resolve(element);
				}
			});
			observer.observe(document.documentElement, { childList: true, subtree: true });
			if (timeoutMs) {
				window.setTimeout(() => {
					observer.disconnect();
					resolve(null);
				}, timeoutMs);
			}
		});
	}
})();
