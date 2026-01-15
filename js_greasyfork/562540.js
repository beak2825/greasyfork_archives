// ==UserScript==
// @name         Hospital revive filters
// @namespace    dev.D1pl0753.torn.hospital-filters
// @version      3.4.0
// @description  Adds revive filters to the hospital page
// @author       D1pl0753 [2380317]
// @match        https://www.torn.com/hospitalview.php*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562540/Hospital%20revive%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/562540/Hospital%20revive%20filters.meta.js
// ==/UserScript==

(async () => {
	const STORAGE_KEY = "kw_hospital_filter_settings";
	let filters = {
		reviveEnabled: false,
		activities: [],
		levelMin: 1,
		levelMax: 100,
		hospitalTimeMin: 0,
		hospitalTimeMax: 168,
		collapsed: false
	};

	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) filters = {...filters, ...JSON.parse(saved)};
	} catch (e) {}

	$("head").append(`<style>
		.kw--hidden { display: none !important; }
		.kw--hospital-filters-container {
			background: #2e2e2e; color: #ddd; border: 1px solid #444;
			border-radius: 5px; padding: 0.75rem; margin-bottom: 1rem;
		}
		.kw--filter-header {
			display: flex; justify-content: space-between; align-items: center;
			cursor: pointer; padding: 0.5rem; background: #3a3a3a;
			border: 1px solid #555; border-radius: 3px; margin-bottom: 0.5rem;
		}
		.kw--filter-title {
			font-weight: bold; color: #fff; font-size: 1rem;
		}
		.kw--filter-toggle {
			color: #4CAF50; font-size: 1.2rem; transition: transform 0.2s;
		}
		.kw--filter-toggle.collapsed { transform: rotate(-90deg); }
		.kw--filter-content { transition: max-height 0.3s ease; overflow: hidden; }
		.kw--filter-content.collapsed { max-height: 0; }
		.kw--filter-section {
			margin-bottom: 0.75rem; padding: 0.5rem; background: #3a3a3a;
			border: 1px solid #555; border-radius: 3px;
		}
		.kw--filter-label {
			display: block; font-weight: bold; margin-bottom: 0.5rem;
			font-size: 0.9rem; color: #fff; text-align: center;
		}
		.kw--filter-input { width: auto; margin-right: 0.5rem; }
		.kw--range-slider {
			position: relative; height: 6px; background: #1a1a1a;
			border: 1px solid #666; border-radius: 3px; margin: 1rem 0;
		}
		.kw--range-slider input {
			position: absolute; top: -6px; left: 0; width: 100%; height: 18px;
			background: transparent; pointer-events: none; -webkit-appearance: none;
		}
		.kw--range-slider input::-webkit-slider-thumb {
			-webkit-appearance: none; pointer-events: all; width: 16px; height: 16px;
			border-radius: 50%; background: #4CAF50; cursor: pointer; border: none;
		}
		.kw--range-fill {
			position: absolute; top: 0; height: 6px; background: #4CAF50; border-radius: 3px;
		}
		.kw--activity-group {
			display: flex; justify-content: space-around; align-items: center;
			flex-wrap: wrap; gap: 0.5rem;
		}
		.kw--activity-item {
			display: flex; align-items: center; gap: 0.3rem; flex: 1; justify-content: center;
		}
		.kw--activity-item input[type="checkbox"] { cursor: pointer; }
		.kw--activity-item label {
			cursor: pointer; margin: 0; color: #ddd; font-size: 0.85rem;
		}
		.kw--filter-counter {
			font-size: 0.85rem; color: #aaa; margin-top: 0.5rem; text-align: center;
		}
	</style>`);

	function saveFilters() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
		} catch (e) {}
	}

	function createRangeSlider(id, min, max, valueMin, valueMax, onChange) {
		const container = $("<div>", { class: "kw--range-slider" });
		const fill = $("<div>", { class: "kw--range-fill" });
		const minSlider = $("<input>", { type: "range", min, max, value: valueMin });
		const maxSlider = $("<input>", { type: "range", min, max, value: valueMax });
		
		function updateFill() {
			const minVal = parseInt(minSlider.val());
			const maxVal = parseInt(maxSlider.val());
			const range = max - min;
			const leftPercent = ((minVal - min) / range) * 100;
			const widthPercent = ((maxVal - minVal) / range) * 100;
			fill.css({ left: leftPercent + '%', width: widthPercent + '%' });
		}
		
		minSlider.on('input', function() {
			const minVal = parseInt($(this).val());
			const maxVal = parseInt(maxSlider.val());
			if (minVal > maxVal) maxSlider.val(minVal);
			updateFill();
			onChange(Math.min(minVal, parseInt(maxSlider.val())), Math.max(minVal, parseInt(maxSlider.val())));
		});
		
		maxSlider.on('input', function() {
			const minVal = parseInt(minSlider.val());
			const maxVal = parseInt($(this).val());
			if (maxVal < minVal) minSlider.val(maxVal);
			updateFill();
			onChange(Math.min(parseInt(minSlider.val()), maxVal), Math.max(parseInt(minSlider.val()), maxVal));
		});
		
		container.append(fill, minSlider, maxSlider);
		updateFill();
		return container;
	}

	function getAvailableActivities(container) {
		const activities = new Set();
		container.find("> li").each((_, li) => {
			const activityEl = $(li).find("#iconTray li");
			if (activityEl.length) {
				const title = activityEl.attr("title") || "";
				if (title) {
					const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
					const match = cleanTitle.match(/^([^,]+)/);
					if (match) activities.add(match[1].trim());
				}
			}
		});
		return Array.from(activities).sort((a, b) => {
			const order = { 'Online': 0, 'Idle': 1, 'Offline': 2 };
			return (order[a] ?? 999) - (order[b] ?? 999);
		});
	}

	function parseHospitalTime(timeText) {
		if (!timeText) return 0;
		const match = timeText.match(/(\d+)\s*(h|hr|hour|hours|m|min|minute|minutes|d|day|days)/i);
		if (!match) return 0;
		const value = parseInt(match[1]);
		const unit = match[2].toLowerCase();
		if (unit.startsWith('h')) return value;
		if (unit.startsWith('m')) return Math.round(value / 60 * 100) / 100;
		if (unit.startsWith('d')) return value * 24;
		return value;
	}

	function applyFilters(container) {
		$("li.kw--hidden").removeClass("kw--hidden");
		container.find("> li").each((_, li) => {
			const $li = $(li);
			let shouldHide = false;
			
			if (filters.reviveEnabled && $li.find("a.revive").hasClass("reviveNotAvailable")) {
				shouldHide = true;
			}
			
			if (!shouldHide && filters.activities.length > 0) {
				const activityEl = $li.find("#iconTray li");
				if (activityEl.length) {
					const activityTitle = activityEl.attr("title") || "";
					const hasMatchingActivity = filters.activities.some(activity => 
						activityTitle.toLowerCase().includes(activity.toLowerCase())
					);
					if (!hasMatchingActivity) shouldHide = true;
				}
			}
			
			if (!shouldHide && (filters.levelMin > 1 || filters.levelMax < 100)) {
				const levelEl = $li.find(".level");
				if (levelEl.length) {
					const levelText = levelEl.text().replace(/[^0-9]/g, '');
					const level = parseInt(levelText) || 0;
					if (level < filters.levelMin || level > filters.levelMax) shouldHide = true;
				}
			}
			
			if (!shouldHide && (filters.hospitalTimeMin > 0 || filters.hospitalTimeMax < 168)) {
				const timeEl = $li.find(".time");
				if (timeEl.length) {
					const timeText = timeEl.text().trim();
					const hours = parseHospitalTime(timeText);
					if (hours < filters.hospitalTimeMin || hours > filters.hospitalTimeMax) shouldHide = true;
				}
			}
			
			if (shouldHide) $li.addClass("kw--hidden");
		});
		
		const total = container.find("> li").length;
		const visible = container.find("> li:not(.kw--hidden)").length;
		$(".kw--filter-counter").text(`Showing ${visible} of ${total} patients`);
	}

	async function init() {
		let container;
		for (let i = 0; i < 50; i++) {
			container = $("div.userlist-wrapper > ul.user-info-list-wrap");
			if (container[0] && !container.find("span.ajax-preloader")[0]) break;
			await new Promise(resolve => setTimeout(resolve, 300));
		}
		if (!container[0]) return;

		const parent = $("div.content-wrapper > div.msg-info-wrap");
		parent.children().each((_, el) => el.classList.add("kw--hidden"));
		
		const filterContainer = $("<div>", { class: "kw--hospital-filters-container" });
		
		// Collapsible Header
		const filterHeader = $("<div>", { class: "kw--filter-header" });
		const filterTitle = $("<div>", { class: "kw--filter-title", text: "Hospital Filters" });
		const filterToggle = $("<div>", { class: "kw--filter-toggle", text: "▼" });
		
		filterHeader.append(filterTitle, filterToggle);
		filterContainer.append(filterHeader);
		
		// Filter Content
		const filterContent = $("<div>", { class: "kw--filter-content" });
		if (filters.collapsed) {
			filterContent.addClass("collapsed");
			filterToggle.addClass("collapsed");
		}
		
		filterHeader.on("click", function() {
			filters.collapsed = !filters.collapsed;
			filterContent.toggleClass("collapsed");
			filterToggle.toggleClass("collapsed");
			saveFilters();
		});
		
		// Revive Toggle
		const reviveSection = $("<div>", { class: "kw--filter-section" });
		reviveSection.append(
			$("<label>", { class: "kw--filter-label", text: "Hide Unavailable Revives" }),
			$("<div>", { style: "text-align: center;" }).append(
				$("<input>", { type: "checkbox", class: "kw--filter-input" })
				.prop("checked", filters.reviveEnabled)
				.on("change", function() {
					filters.reviveEnabled = $(this).prop("checked");
					saveFilters();
					applyFilters(container);
				})
			)
		);
		filterContent.append(reviveSection);
		
		// Activity Checkboxes
		const activitySection = $("<div>", { class: "kw--filter-section" });
		const activities = getAvailableActivities(container);
		const activityGroup = $("<div>", { class: "kw--activity-group" });
		
		activities.forEach(activity => {
			const checkbox = $("<input>", { type: "checkbox", value: activity, class: "kw--filter-input" })
			.prop("checked", filters.activities.includes(activity))
			.on("change", function() {
				const value = $(this).val();
				if ($(this).prop("checked")) {
					if (!filters.activities.includes(value)) filters.activities.push(value);
				} else {
					filters.activities = filters.activities.filter(a => a !== value);
				}
				saveFilters();
				applyFilters(container);
			});
			
			activityGroup.append(
				$("<div>", { class: "kw--activity-item" }).append(
					checkbox,
					$("<label>", { text: activity })
				)
			);
		});
		
		activitySection.append(
			$("<label>", { class: "kw--filter-label", text: "Activity Status" }),
			activityGroup
		);
		filterContent.append(activitySection);
		
		// Level Range Slider
		const levelSection = $("<div>", { class: "kw--filter-section" });
		const levelSlider = createRangeSlider('level', 1, 100, filters.levelMin, filters.levelMax, (min, max) => {
			filters.levelMin = min;
			filters.levelMax = max;
			levelSection.find(".kw--filter-label").text(`Level Range: ${min} - ${max}`);
			saveFilters();
			applyFilters(container);
		});
		levelSection.append(
			$("<label>", { class: "kw--filter-label", text: `Level Range: ${filters.levelMin} - ${filters.levelMax}` }),
			levelSlider
		);
		filterContent.append(levelSection);
		
		// Hospital Time Range Slider
		const timeSection = $("<div>", { class: "kw--filter-section" });
		const timeSlider = createRangeSlider('time', 0, 168, filters.hospitalTimeMin, filters.hospitalTimeMax, (min, max) => {
			filters.hospitalTimeMin = min;
			filters.hospitalTimeMax = max;
			timeSection.find(".kw--filter-label").text(`Hospital Time: ${min} - ${max} hours`);
			saveFilters();
			applyFilters(container);
		});
		timeSection.append(
			$("<label>", { class: "kw--filter-label", text: `Hospital Time: ${filters.hospitalTimeMin} - ${filters.hospitalTimeMax} hours` }),
			timeSlider
		);
		filterContent.append(timeSection);
		
		// Counter
		filterContent.append($("<div>", { class: "kw--filter-counter", text: `Showing 0 of 0 patients` }));
		
		filterContainer.append(filterContent);
		parent.append(filterContainer);
		applyFilters(container);
	}

	$(window).on("popstate", () => setTimeout(init, 10));
	init();
})();