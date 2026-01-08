// ==UserScript==
// @name		Mist Legacy Interactive Map Search
// @namespace	mist-legacy-interactive-map-search
// @description This adds a search field to more easily find things on the interactive map website for the game Mist Legacy
// @version		1.1
// @license     MIT
// @match		http://199.180.155.43/map
// @run-at		document-start
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/561863/Mist%20Legacy%20Interactive%20Map%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561863/Mist%20Legacy%20Interactive%20Map%20Search.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let hooked = false;

	// Hooking L.Map.djangoMap
	function hookLeaflet() {
		if (!window.L || !L.Map || !L.Map.djangoMap || hooked) return;

		hooked = true;
		const original = L.Map.djangoMap;

		L.Map.djangoMap = function(id, options) {
			const map = original.apply(this, arguments);
			setTimeout(() => addSearchControl(map), 0);
			return map;
		};
	}

	// Poll until Leaflet + djangoMap exist
	const poll = setInterval(() => {
		if (window.L && L.Map && L.Map.djangoMap) {
			clearInterval(poll);
			hookLeaflet();
		}
	}, 10);

	function addSearchControl(map) {
		if (!map) return;

		const L = window.L;
		const SearchControl = L.Control.extend({
			options: {
				position: 'topright'
			},
			onAdd() {
				const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
				div.style.cssText = `
					background:#fff;
					padding:6px;
					width:225px;
					max-height:300px;
					display:flex;
					flex-direction:column;
				`;
				div.innerHTML = `
					<div class="search-header">
						<input class="search-input" placeholder="Search..." style="width:100%; margin-bottom:4px; box-sizing:border-box;">
						<label style="font-size:12px;display:block;margin-bottom:4px;">
							<input type="checkbox" class="search-highlight" checked>
							Highlight matches
						</label>
						<div class="search-count" style="font-size: 12px; margin-bottom: 4px;"></div>
						<hr style="margin:4px 0;">
					</div>
					<ul class="search-results" style="list-style: none; padding:0; margin:0; font-size:12px; overflow: auto; flex: 1;"></ul>
				`;
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.disableScrollPropagation(div);
				return div;
			}
		});

		map.addControl(new SearchControl());

		// Add CSS
		document.head.insertAdjacentHTML('beforeend', `
			<style>
				.leaflet-search-link {
					display:inline !important;
					width:auto !important;
					height:auto !important;
					line-height:normal !important;
					white-space:normal;
					color:#0645ad !important;
					text-decoration:underline !important;
					cursor:pointer;
				}
				.leaflet-search-results li { margin-bottom:2px; }
			</style>
		`);

		const container = map.getContainer().parentElement;
		const input = container.querySelector('.search-input');
		const checkbox = container.querySelector('.search-highlight');
		const count = container.querySelector('.search-count');
		const list = container.querySelector('.search-results');

		const searchableLayers = () =>
			Object.values(map._layers).filter(l => l.feature && l.feature.properties);

		function getMapPoi(layer) {
			return String(layer.feature?.properties?.map_poi || '').toLowerCase();
		}

		function getDisplayLabel(layer) {
			const raw = layer.feature?.properties?.map_poi ?? layer.options?.title ?? 'Unnamed';
			return String(raw)
				.split(/<\/?br\s*\/?>|\n/i)[0]
				.trim()
				.replace(/<[^>]*>/g, '');
		}

		function focusLayer(layer) {
			if (layer.getBounds) {	// Polygon / MultiPolygon / FeatureGroup
				map.fitBounds(layer.getBounds(), { padding: [20, 20] });
			} else if (layer.getLatLng) {	// Point
				map.setView(layer.getLatLng(), Math.max(map.getZoom(), 7), { animate: true });
			}
			setTimeout(() => {
				if (layer.getPopup) layer.openPopup();
				else layer.fire?.('click');
			}, 300);
		}

		function highlightLayer(layer, on) {
			const iconUrl = layer.feature?.properties?.icon_url;
			if (!iconUrl || !layer._icon) return;

			layer._icon.style.background = on ? 'yellow' : '';
			layer._icon.style.border = on ? '4px outset red' : '';
		}

		function runSearch() {
			const q = input.value.toLowerCase();
			const layers = searchableLayers();
			list.innerHTML = '';

			// Reset highlights
			layers.forEach(l => highlightLayer(l, false));

			if (q.length < 3) {
				count.textContent = 'Type at least 3 characters';
				return;
			}

			const matches = layers.filter(l => getMapPoi(l).includes(q));
			count.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;

			matches.forEach(layer => {
				if (checkbox.checked) highlightLayer(layer, true);

				const li = document.createElement('li');
				const a = document.createElement('a');

				a.href = '#';
				a.className = 'leaflet-search-link';
				a.textContent = getDisplayLabel(layer);

				a.onclick = e => {
					e.preventDefault();
					focusLayer(layer);
				};

				li.appendChild(a);
				list.appendChild(li);
			});
		}

		input.addEventListener('input', runSearch);
		checkbox.addEventListener('change', runSearch);
	}
})();