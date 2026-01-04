// ==UserScript==
// @name         TP-Link Table: Sort, Search & Filter
// @namespace    https://github.com/shashankkeshava/userscripts
// @version      1.0.0
// @description  Add sorting, searching and filtering to the TP-Link connected clients table. Works with standard TP-Link web interfaces (not Omada).
// @author       Shashank Keshava (shashankkeshava.com)
// @match        http://192.168.0.1/
// @match        http://192.168.1.1/
// @match        http://tplinkwifi.net/
// @match        http://tplinklogin.net/
// @homepage     https://github.com/shashankkeshava/userscripts/tree/main/tpLink-router-tools
// @supportURL   https://github.com/shashankkeshava/userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tp-link.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550675/TP-Link%20Table%3A%20Sort%2C%20Search%20%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/550675/TP-Link%20Table%3A%20Sort%2C%20Search%20%20Filter.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// CONFIG / IDs
	const PANEL_ID = 'connected-clients-grid-panel';
	const TOOLBAR_ID = 'tplink-table-tools';
	const GRID_CONTENT_SELECTOR = '.grid-content-container';
	const TBODY_SELECTOR = 'tbody.grid-content-data';
	const ROW_SELECTOR = 'tr.grid-content-tr';

	const SEARCH_ID = 'tplink-table-search';
	const ONLINE_ID = 'tplink-filter-online';
	const BLANK_ID = 'tplink-blank-div';
	const DURATION_ID = 'tplink-duration-sort';
	const DOWNLOAD_ID = 'tplink-download-sort';
	const CLEAR_ID = 'tplink-clear-btn';

	// utility: parse duration -> minutes
	function parseDurationToMinutes(durationStr) {
		if (!durationStr) return null;
		const s = durationStr.replace(/\u00A0/g, ' ').trim();
		if (!s || s === '---') return null;
		const h = (s.match(/(\d+)\s*Hour/i) || [0, 0])[1] * 1 || 0;
		const m = (s.match(/(\d+)\s*Minute/i) || [0, 0])[1] * 1 || 0;
		return h * 60 + m;
	}

	// utility: parse download rate -> KB/s
	function parseDownloadRate(rateStr) {
		if (!rateStr) return null;
		const s = rateStr.replace(/\u00A0/g, ' ').trim();
		if (!s || s === '---') return null;

		// Handle both "KB/s" and "Kbps" formats
		let match = s.match(/([\d.]+)\s*(KB|MB|GB)\/s/i);
		if (!match) {
			// Try "Kbps", "Mbps", "Gbps" format
			match = s.match(/([\d.]+)\s*(K|M|G)bps/i);
		}

		if (!match) return null;

		const value = parseFloat(match[1]);
		const unit = match[2].toUpperCase();

		// Handle both formats
		switch (unit) {
			case 'KB':
			case 'K':
				return value;
			case 'MB':
			case 'M':
				return value * 1024;
			case 'GB':
			case 'G':
				return value * 1024 * 1024;
			default:
				return null;
		}
	}

	// ensure single element for id (remove duplicates)
	function ensureSingle(id) {
		const nodes = document.querySelectorAll('#' + id);
		if (!nodes || nodes.length === 0) return null;
		for (let i = 1; i < nodes.length; i++) nodes[i].remove();
		return nodes[0];
	}

	// create-or-reuse helpers
	function createInput(id, opts = {}) {
		let el = ensureSingle(id);
		if (!el) {
			el = document.createElement('input');
			el.type = opts.type || 'search';
			el.id = id;
			if (opts.placeholder) el.placeholder = opts.placeholder;
		}
		Object.assign(el.style, opts.style || {});
		return el;
	}
	function createSelect(id, options = [], style = {}) {
		let el = ensureSingle(id);
		if (!el) {
			el = document.createElement('select');
			el.id = id;
			options.forEach((o) => {
				const opt = document.createElement('option');
				opt.value = o.value;
				opt.textContent = o.label;
				el.appendChild(opt);
			});
		} else {
			// ensure options exist if empty
			if (el.options.length === 0 && options.length) {
				options.forEach((o) => {
					const opt = document.createElement('option');
					opt.value = o.value;
					opt.textContent = o.label;
					el.appendChild(opt);
				});
			}
		}
		Object.assign(el.style, style || {});
		return el;
	}
	function createButton(id, label, style = {}) {
		let el = ensureSingle(id);
		if (!el) {
			el = document.createElement('button');
			el.id = id;
			el.type = 'button';
			el.textContent = label;
		} else {
			el.textContent = label;
		}
		Object.assign(el.style, style || {});
		return el;
	}
	function createDiv(id, style = {}) {
		let el = ensureSingle(id);
		if (!el) {
			el = document.createElement('div');
			el.id = id;
		}
		Object.assign(el.style, style || {});
		return el;
	}

	// build toolbar and wrap grid-content-container inside it (toolbar becomes parent)
	function buildToolbarResponsive() {
		const panel = document.getElementById(PANEL_ID);
		if (!panel) return null;

		let gridContent = panel.querySelector(GRID_CONTENT_SELECTOR);
		if (!gridContent)
			gridContent = document.querySelector(GRID_CONTENT_SELECTOR);
		if (!gridContent) return null;

		// remove duplicates of toolbar if any elsewhere
		const existing = ensureSingle(TOOLBAR_ID);

		// create toolbar container (or reuse)
		let toolbar;
		if (existing) toolbar = existing;
		else {
			toolbar = document.createElement('div');
			toolbar.id = TOOLBAR_ID;
		}

		// style toolbar responsively (CSS-in-JS)
		toolbar.style.boxSizing = 'border-box';
		toolbar.style.width = '100%';
		toolbar.style.maxWidth = '100%';
		toolbar.style.zIndex = '10000';
		toolbar.style.background = 'rgba(255,255,255,0.96)';
		toolbar.style.border = '1px solid rgba(0,0,0,0.06)';
		toolbar.style.borderRadius = '6px';
		toolbar.style.padding = '8px';
		toolbar.style.overflow = 'visible';
		toolbar.style.fontFamily = 'system-ui, Arial, sans-serif';
		toolbar.style.color = 'inherit';
		// We'll manage layout with an inner container whose CSS supports responsiveness.
		toolbar.innerHTML = toolbar.innerHTML || ''; // preserve if reused

		// create responsive inner container
		let inner = toolbar.querySelector('.tplink-inner');
		if (!inner) {
			inner = document.createElement('div');
			inner.className = 'tplink-inner';
			toolbar.appendChild(inner);
		}

		// inject responsive stylesheet for inner container (once)
		if (!document.getElementById('tplink-tools-responsive-style')) {
			const style = document.createElement('style');
			style.id = 'tplink-tools-responsive-style';
			style.textContent = `
        /* grid / flex responsive layout for the toolbar */
        #${TOOLBAR_ID} .tplink-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        #${TOOLBAR_ID} .tplink-left {
          display: flex;
          gap: 8px;
          align-items: center;
          flex: 1 1 auto;
          min-width: 0;
        }
        #${TOOLBAR_ID} .tplink-spacer {
          flex: 1 1 0px;
          min-width: 0;
        }
        #${TOOLBAR_ID} .tplink-right {
          display: flex;
          gap: 8px;
          align-items: center;
          flex: 0 0 auto;
        }

        /* Duration and Download tries to align with header width on wide screens: we position it absolutely relative to header (if measurement is available) */
        #${TOOLBAR_ID} .tplink-duration-wrapper,
        #${TOOLBAR_ID} .tplink-download-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* Small screens: stack controls vertically for readability */
        @media (max-width: 760px) {
          #${TOOLBAR_ID} .tplink-inner {
            flex-direction: column;
            align-items: stretch;
          }
          #${TOOLBAR_ID} .tplink-left {
            width: 100%;
            flex-wrap: wrap;
            gap: 6px;
          }
          #${TOOLBAR_ID} .tplink-right {
            width: 100%;
            justify-content: flex-start;
          }
          #${TOOLBAR_ID} .tplink-duration-wrapper,
          #${TOOLBAR_ID} .tplink-download-wrapper {
            justify-content: flex-start;
          }
          #${TOOLBAR_ID} input[type="search"]#${SEARCH_ID} {
            width: 100%;
            min-width: 0;
          }
        }

        /* Minor input styling */
        #${TOOLBAR_ID} input[type="search"], #${TOOLBAR_ID} select, #${TOOLBAR_ID} button {
          font: inherit;
        }
      `;
			document.head.appendChild(style);
		}

		// place toolbar to be parent of gridContent (wrap)
		// if toolbar is not a child of panel, replace gridContent with toolbar and append gridContent into toolbar
		if (gridContent.parentNode === panel) {
			if (toolbar.parentNode !== panel) {
				// replace
				panel.replaceChild(toolbar, gridContent);
				toolbar.appendChild(gridContent);
			} else if (!toolbar.contains(gridContent)) {
				// toolbar exists elsewhere - move gridContent into toolbar and ensure toolbar is appended to panel
				if (toolbar.parentNode !== panel) {
					toolbar.remove();
					panel.appendChild(toolbar);
				}
				toolbar.appendChild(gridContent);
			}
		} else {
			// gridContent not direct child of panel (unexpected) - ensure toolbar is appended to panel and contains gridContent
			if (toolbar.parentNode !== panel) panel.appendChild(toolbar);
			toolbar.appendChild(gridContent);
		}

		// Build inner left and right groups
		let left = inner.querySelector('.tplink-left');
		if (!left) {
			left = document.createElement('div');
			left.className = 'tplink-left';
			inner.insertBefore(left, inner.firstChild);
		} else {
			left.innerHTML = ''; // clear and reattach controls to avoid duplicates
		}

		let spacer = inner.querySelector('.tplink-spacer');
		if (!spacer) {
			spacer = document.createElement('div');
			spacer.className = 'tplink-spacer';
			inner.appendChild(spacer);
		}

		let right = inner.querySelector('.tplink-right');
		if (!right) {
			right = document.createElement('div');
			right.className = 'tplink-right';
			inner.appendChild(right);
		} else {
			right.innerHTML = ''; // reset
		}

		// Create controls (create or reuse)
		const search = createInput(SEARCH_ID, {
			placeholder: 'Search name / mac / ip ...',
			style: {
				padding: '6px 8px',
				minWidth: '220px',
				boxSizing: 'border-box',
				borderRadius: '4px',
				border: '1px solid rgba(0,0,0,0.08)',
			},
		});

		const online = createSelect(
			ONLINE_ID,
			[
				{ value: 'all', label: 'All' },
				{ value: 'online', label: 'Online' },
				{ value: 'offline', label: 'Offline' },
			],
			{
				padding: '6px 8px',
				borderRadius: '4px',
				border: '1px solid rgba(0,0,0,0.08)',
			}
		);

		const clearBtn = createButton(CLEAR_ID, 'Clear', {
			padding: '6px 10px',
			borderRadius: '4px',
			border: '1px solid rgba(0,0,0,0.08)',
			cursor: 'pointer',
		});

		const blank = createDiv(BLANK_ID, { width: '12px', minHeight: '1px' });

		const duration = createSelect(
			DURATION_ID,
			[
				{ value: 'none', label: 'Duration —' },
				{ value: 'asc', label: 'Ascending' },
				{ value: 'desc', label: 'Descending' },
			],
			{
				padding: '6px 8px',
				minWidth: '140px',
				borderRadius: '4px',
				border: '1px solid rgba(0,0,0,0.08)',
			}
		);

		const download = createSelect(
			DOWNLOAD_ID,
			[
				{ value: 'none', label: 'Download Rate —' },
				{ value: 'asc', label: 'Low to High' },
				{ value: 'desc', label: 'High to Low' },
			],
			{
				padding: '6px 8px',
				minWidth: '140px',
				borderRadius: '4px',
				border: '1px solid rgba(0,0,0,0.08)',
			}
		);

		// append controls into left / right groups
		left.appendChild(search);
		left.appendChild(online);
		// right.appendChild(download);
		const downloadWrapper = document.createElement('div');
		downloadWrapper.className = 'tplink-download-wrapper';
		downloadWrapper.appendChild(download);
		right.appendChild(downloadWrapper);

		// right group: blank + duration + download (kept right-aligned on wide screens)
		right.appendChild(blank);
		const durWrapper = document.createElement('div');
		durWrapper.className = 'tplink-duration-wrapper';
		durWrapper.appendChild(duration);
		right.appendChild(durWrapper);

		// clear button
		left.appendChild(clearBtn);

		// If there is a .grid-tool-container inside the panel, ensure it isn't hidden (optional)
		const gridToolContainer = panel.querySelector('.grid-tool-container');
		if (gridToolContainer && gridToolContainer.classList.contains('hidden')) {
			gridToolContainer.classList.remove('hidden');
		}

		// After layout, try to align the duration control under header "duration" on wide screens by measuring header cell position
		alignDurationToHeader();

		// attach behavior
		wireControls(panel);
		return toolbar;
	}

	// try to align duration control to "duration" column if header exists (wide screens)
	function alignDurationToHeader() {
		const toolbar = document.getElementById(TOOLBAR_ID);
		const duration = document.getElementById(DURATION_ID);
		if (!toolbar || !duration) return;
		// Reset any absolute positioning
		duration.style.position = '';
		duration.style.left = '';
		duration.style.top = '';
		duration.style.transform = '';

		// Only attempt alignment on wide screens
		if (window.matchMedia && window.matchMedia('(min-width: 761px)').matches) {
			const headerRow =
				document.querySelector(
					'.container.grid-header-container tr.grid-header-tr'
				) || document.querySelector('tr.grid-header-tr');
			if (!headerRow) return;
			const ths = Array.from(headerRow.querySelectorAll('th'));
			// find the th that has name="duration"
			let durIndex = -1;
			ths.forEach((th, idx) => {
				const nameAttr = th.getAttribute('name') || '';
				if (nameAttr === 'duration') durIndex = idx;
			});
			if (durIndex === -1) return;

			// measure the left offset of the target th relative to the header container
			const targetTh = ths[durIndex];
			const headerContainer =
				targetTh.closest('.container.grid-header-container') ||
				targetTh.closest('thead') ||
				targetTh.parentNode;
			if (!headerContainer) return;

			const headerRect = headerContainer.getBoundingClientRect();
			const thRect = targetTh.getBoundingClientRect();
			// compute x position inside panel: align the duration control's right edge to th's right edge
			const x = thRect.left - headerRect.left; // offset within header container
			// place duration absolutely within toolbar relative to header container's relative position
			// find toolbar's inner container position
			const toolbar = document.getElementById(TOOLBAR_ID);
			const toolbarRect = toolbar.getBoundingClientRect();
			// compute left relative to toolbar
			const leftWithinToolbar = headerRect.left - toolbarRect.left + x;

			// make duration absolutely positioned within toolbar (only when it makes sense)
			duration.style.position = 'absolute';
			duration.style.left = Math.max(8, leftWithinToolbar) + 'px';
			duration.style.top = '50%';
			duration.style.transform = 'translateY(-50%)';
			duration.style.zIndex = '10001';
			// ensure parent toolbar has position relative to allow absolute placement
			toolbar.style.position = 'relative';
		}
	}

	// wire filtering and duration sorting behaviors
	function wireControls(panel) {
		const gridContent =
			panel.querySelector(GRID_CONTENT_SELECTOR) ||
			document.querySelector(GRID_CONTENT_SELECTOR);
		if (!gridContent) return;
		const tbody =
			gridContent.querySelector(TBODY_SELECTOR) ||
			document.querySelector(TBODY_SELECTOR);
		if (!tbody) return;

		// store original index for stable order
		Array.from(tbody.querySelectorAll(ROW_SELECTOR)).forEach((r, idx) => {
			if (r.dataset.tplinkOriginalIndex === undefined)
				r.dataset.tplinkOriginalIndex = idx;
		});

		const search = document.getElementById(SEARCH_ID);
		const online = document.getElementById(ONLINE_ID);
		const duration = document.getElementById(DURATION_ID);
		const download = document.getElementById(DOWNLOAD_ID);
		const clearBtn = document.getElementById(CLEAR_ID);

		function applyAll() {
			const q = search && search.value ? search.value.trim().toLowerCase() : '';
			const onlineVal = online ? online.value : 'all';
			const durVal = duration ? duration.value : 'none';
			const downloadVal = download ? download.value : 'none';

			const allRows = Array.from(tbody.querySelectorAll(ROW_SELECTOR));

			// filter
			const visible = allRows.filter((r) => {
				const name =
					(r.querySelector('.device-info-container .name') || {}).textContent ||
					'';
				const mac =
					(r.querySelector('.device-info-container .mac') || {}).textContent ||
					'';
				const ip =
					(r.querySelector('.device-info-container .ip') || {}).textContent ||
					'';
				const raw = (name + ' ' + mac + ' ' + ip).toLowerCase();
				if (q && !raw.includes(q)) return false;

				const isOnline = !!r.querySelector(
					'.device-type-container .online-tag'
				);
				const isOffline = !!r.querySelector(
					'.device-type-container .offline-tag'
				);
				if (onlineVal === 'online' && !isOnline) return false;
				if (onlineVal === 'offline' && !isOffline) return false;
				return true;
			});

			// show/hide
			allRows.forEach(
				(r) => (r.style.display = visible.includes(r) ? '' : 'none')
			);

			// sort visible rows by duration or download rate
			if (durVal === 'asc' || durVal === 'desc') {
				visible.sort((a, b) => {
					const ta =
						(a.querySelector('.duration-container') || {}).textContent || '';
					const tb =
						(b.querySelector('.duration-container') || {}).textContent || '';
					const da = parseDurationToMinutes(ta);
					const db = parseDurationToMinutes(tb);
					if (da === null && db === null)
						return (
							parseInt(a.dataset.tplinkOriginalIndex || 0) -
							parseInt(b.dataset.tplinkOriginalIndex || 0)
						);
					if (da === null) return 1;
					if (db === null) return -1;
					return durVal === 'asc' ? da - db : db - da;
				});
				const frag = document.createDocumentFragment();
				visible.forEach((r) => frag.appendChild(r));
				tbody.appendChild(frag);
			} else if (downloadVal === 'asc' || downloadVal === 'desc') {
				visible.sort((a, b) => {
					// Try multiple approaches to find download speed data
					let downloadA = '';
					let downloadB = '';

					// Method 1: Try specific selectors for download speed
					const downloadSelectors = [
						'.speed-download-container',
						'.download-speed',
						'.speed-down',
						'[class*="download"]',
						'.rx-rate', // common in TP-Link interfaces
						'.download-rate',
						'[data-field="download"]',
						'[data-field="rx"]',
					];

					for (const selector of downloadSelectors) {
						const elementA = a.querySelector(selector);
						const elementB = b.querySelector(selector);
						if (elementA && elementB) {
							downloadA = elementA.textContent || '';
							downloadB = elementB.textContent || '';
							break;
						}
					}

					// Method 2: If still empty, look for speed patterns in all td elements
					if (!downloadA || !downloadB) {
						const tdsA = Array.from(a.querySelectorAll('td'));
						const tdsB = Array.from(b.querySelectorAll('td'));

						// Look for speed patterns (both KB/s and Kbps formats)
						const speedPattern =
							/\d+\.?\d*\s*(?:KB|MB|GB)\/s|\d+\.?\d*\s*(?:K|M|G)bps/i;
						const speedValues = [];

						// Collect all speed values from both rows
						for (let i = 0; i < Math.max(tdsA.length, tdsB.length); i++) {
							const textA = tdsA[i]?.textContent?.trim() || '';
							const textB = tdsB[i]?.textContent?.trim() || '';

							if (speedPattern.test(textA) && speedPattern.test(textB)) {
								speedValues.push({ indexA: i, textA, textB });
							}
						}

						// If we found speed values, use the first one (typically download)
						if (speedValues.length > 0) {
							const bestMatch = speedValues[0]; // First speed column is usually download
							downloadA = bestMatch.textA;
							downloadB = bestMatch.textB;
						}
					}

					// Method 3: Fallback - try to find any numeric speed data
					if (!downloadA || !downloadB) {
						const tdsA = Array.from(a.querySelectorAll('td'));
						const tdsB = Array.from(b.querySelectorAll('td'));

						// Look for any cell with speed-like content
						for (let i = tdsA.length - 1; i >= 0; i--) {
							const textA = tdsA[i]?.textContent?.trim() || '';
							const textB = tdsB[i]?.textContent?.trim() || '';

							// Check for any speed pattern or numeric values with units
							if (
								(/\d+.*?\/s/i.test(textA) && /\d+.*?\/s/i.test(textB)) ||
								(/\d+.*?(kb|mb|gb)/i.test(textA) &&
									/\d+.*?(kb|mb|gb)/i.test(textB))
							) {
								downloadA = textA;
								downloadB = textB;
								break;
							}
						}
					}

					const rateA = parseDownloadRate(downloadA);
					const rateB = parseDownloadRate(downloadB);

					if (rateA === null && rateB === null)
						return (
							parseInt(a.dataset.tplinkOriginalIndex || 0) -
							parseInt(b.dataset.tplinkOriginalIndex || 0)
						);
					if (rateA === null) return 1;
					if (rateB === null) return -1;
					return downloadVal === 'asc' ? rateA - rateB : rateB - rateA;
				});
				const frag = document.createDocumentFragment();
				visible.forEach((r) => frag.appendChild(r));
				tbody.appendChild(frag);
			} else {
				// restore original order for visible rows
				const visibleSorted = visible
					.slice()
					.sort(
						(a, b) =>
							parseInt(a.dataset.tplinkOriginalIndex || 0) -
							parseInt(b.dataset.tplinkOriginalIndex || 0)
					);
				const frag = document.createDocumentFragment();
				visibleSorted.forEach((r) => frag.appendChild(r));
				tbody.appendChild(frag);
			}
		}

		// attach events (debounce search)
		let searchTimer = null;
		if (search) {
			search.removeEventListener('input', applyAll);
			search.addEventListener('input', () => {
				clearTimeout(searchTimer);
				searchTimer = setTimeout(applyAll, 180);
			});
		}
		if (online) {
			online.removeEventListener('change', applyAll);
			online.addEventListener('change', applyAll);
		}
		if (duration) {
			duration.removeEventListener('change', applyAll);
			duration.addEventListener('change', applyAll);
		}
		if (download) {
			download.removeEventListener('change', applyAll);
			download.addEventListener('change', applyAll);
		}
		if (clearBtn) {
			clearBtn.removeEventListener('click', clearAll);
			clearBtn.addEventListener('click', clearAll);
		}

		function clearAll() {
			if (search) search.value = '';
			if (online) online.value = 'all';
			if (duration) duration.value = 'none';
			if (download) download.value = 'none';
			applyAll();
		}

		applyAll();

		// Observe tbody for dynamic additions/removals and reapply and re-measure alignment
		const mo = new MutationObserver(() => {
			Array.from(tbody.querySelectorAll(ROW_SELECTOR)).forEach((r, idx) => {
				if (r.dataset.tplinkOriginalIndex === undefined)
					r.dataset.tplinkOriginalIndex = idx;
			});
			setTimeout(() => {
				applyAll();
				alignDurationToHeader();
			}, 40);
		});
		mo.observe(tbody, { childList: true, subtree: false });

		// reposition duration control on window resize (responsive)
		window.removeEventListener('resize', alignDurationToHeader);
		window.addEventListener('resize', () => {
			// small debounce
			clearTimeout(window._tplink_align_timeout);
			window._tplink_align_timeout = setTimeout(alignDurationToHeader, 120);
		});
	}

	// watcher to re-build toolbar if UI re-renders
	function watchPanelRebuild() {
		const panel = document.getElementById(PANEL_ID);
		if (!panel) return;
		const mo = new MutationObserver(() => {
			const toolbar = document.getElementById(TOOLBAR_ID);
			const gridContent = panel.querySelector(GRID_CONTENT_SELECTOR);
			if (!gridContent) return;
			if (
				!toolbar ||
				toolbar.parentNode !== panel ||
				!toolbar.contains(gridContent)
			) {
				// rebuild
				setTimeout(() => buildToolbarResponsive(), 30);
			} else {
				// ensure duration alignment after any DOM changes
				setTimeout(alignDurationToHeader, 40);
			}
		});
		mo.observe(panel, { childList: true, subtree: true });
	}

	// start with retries
	function start() {
		let tries = 0;
		const id = setInterval(() => {
			tries++;
			const result = buildToolbarResponsive();
			if (result) {
				watchPanelRebuild();
				clearInterval(id);
			}
			if (tries > 30) clearInterval(id);
		}, 300);
	}

	if (document.readyState === 'loading')
		window.addEventListener('DOMContentLoaded', start);
	else start();
})();
