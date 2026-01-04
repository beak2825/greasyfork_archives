// ==UserScript==
// @name         Filter Collections
// @namespace    http://tampermonkey.net/
// @version      2025-12-27
// @description  Adds [<10], [10-99], [100-999], [>1000], Not dungeon and D1-4 filter buttons to Collections
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558169/Filter%20Collections.user.js
// @updateURL https://update.greasyfork.org/scripts/558169/Filter%20Collections.meta.js
// ==/UserScript==

/*
	Adds filtering by count in Collections: [<10], [10-79], [80-99], [100-799], [800-999], [1000-9999], [10k+].
	Filtering out dungeon items, skilling outfits, uncollected charms and uncollected celestials.

	Saves and restores "Show Uncollected Items" state when opening Collections again!

	Shows collection badges on skilling actions (you need to open Collections to update the counts).

	Supports multiple characters.

	Changelog
	=========

	v2025-12-06
		- Initial version
	v2025-12-06-2
		- FIXED: "<10" button was showing 10s
	v2025-12-06-3
		- Made checkbox label clickable
	v2025-12-11
		- Save and restore "Show Uncollected Items" state when opening Collections again
		- FIXED: Items that can be in 2 dungeons (like Pestilent Shot) were attributed to only a single dungeon
	v2025-12-11-2
		- FIXED: Not showin non dungeon drops
	v2025-12-12
		- Show collection badges on skilling actions
		- FIXED: Sometimes no/almost no items were shown after opeming Collections again
	v2025-12-19
		- FIXED: When Switching characters in the same browser tab, it showed Collection numbers of the previous one
		- FIXED: R rated dungeon items were not attributed to dungeons
	v2025-12-19-2
		- FIXED: Fixed the fix T_T
	v2025-12-20
		- Added [80-99], [800-999] and [10k+]
		- Added filtering out Skilling Outfits, Uncollected Charms and Uncollected Celestials
	v2025-12-20-2
		- FIXED: Count was not updating
	v2025-12-26
		- FIXED: "Show Uncollected Items" were uncheking when switching to "Achievements" or "Bestiary" tabs
		- Hide "Uncollected Charms" and "Uncollected Celestials" checkboxes when "Show Uncollected Items" unchecked
		- Changed "<10" to "1-10"
		- Favorites in Collections
		- Save all checkboxes between page reloads
		- Added tierOrange

	        TODO
	====================
	- What to do with items that are 0, but enhanced, they show when "Show Uncollected Items" unchecked
*/


(function() {
	async function waitFnRepeatedFor (selector, callback) {
		let notified = false;
		return new Promise((resolve) => {
			let lastEl = null
			function check () {
				const el = selector();
				if (el && el != lastEl) {
					lastEl = el;
					notified = false;
				}
				setTimeout(check, 1000/10); // Schedule first to allow the callback to throw
				if (el && !notified) {
					notified = true;
					resolve(el);
					if (callback) {
						callback(el);
					}
				} else if (el && notified) {
					// Skip, wait for cond to be false again
				} else {
					notified = false;
				}
			}
			check();
		});
	}

	function unformatNumber (s) {
		if (s.endsWith("M")) {
			return parseFloat(s) * 1000 * 1000;
		} else if (s.endsWith("K")) {
			return parseFloat(s) * 1000;
		} else if (("" + parseFloat(s)) == s) {
			return parseFloat(s);
		}
	}

	function f (n) {
		if (typeof n != "number") {
			return "NaN";
		} else if (n == 0) {
			return "" + n;
		} else if (Math.abs(n) < 1) {
			return n.toFixed(2);
		} else if (Math.abs(n) < 10*1000) {
			if (n % 1 == 0) {
				return "" + n;
			} else {
				return n.toFixed(1);
			}
		} else if (Math.abs(n) <= 1*1000*1000) {
			const k = n/1000;
			if (k % 1 == 0) {
				return k + "K";
			} else {
				return k.toFixed(1) + "K";
			}
		} else if (Math.abs(n) > 1*1000*1000) {
			const m = n/(1000*1000);
			if (m % 1 == 0) {
				return m + "M";
			} else if (m % 0.1 == 0) {
				return m.toFixed(1) + "M";
			} else {
				return m.toFixed(2) + "M";
			}
		} else {
			return "" + n;
		}
	}

	const dungeonsItems = {
		"d1": new Set([
			"chimerical_chest",
			"chimerical_refinement_chest",
			"chimerical_token",
			"chimerical_quiver",
			"chimerical_quiver_refined",
			"griffin_leather",
			"manticore_sting",
			"jackalope_antler",
			"dodocamel_plume",
			"griffin_talon",
			"chimerical_refinement_shard",
			"chimerical_essence",
			"shield_bash",
			"crippling_slash",
			"pestilent_shot",
			"griffin_tunic",
			"griffin_chaps",
			"manticore_shield",
			"jackalope_staff",
			"dodocamel_gauntlets",
			"griffin_bulwark",
		]),
		"d2": new Set([
			"sinister_chest",
			"sinister_refinement_chest",
			"sinister_token",
			"sinister_cape",
			"sinister_cape_refined",
			"acrobats_ribbon",
			"magicians_cloth",
			"chaotic_chain",
			"cursed_ball",
			"sinister_refinement_shard",
			"sinister_essence",
			"penetrating_strike",
			"pestilent_shot",
			"smoke_burst",
			"acrobatic_hood",
			"magicians_hat",
			"chaotic_flail",
			"cursed_bow",
		]),
		"d3": new Set([
			"enchanted_chest",
			"enchanted_refinement_chest",
			"enchanted_token",
			"enchanted_cloak",
			"enchanted_cloak_refined",
			"royal_cloth",
			"knights_ingot",
			"bishops_scroll",
			"regal_jewel",
			"sundering_jewel",
			"enchanted_refinement_shard",
			"enchanted_essence",
			"crippling_slash",
			"penetrating_shot",
			"retribution",
			"mana_spring",
			"knights_aegis",
			"bishops_codex",
			"royal_water_robe_top",
			"royal_water_robe_bottoms",
			"royal_nature_robe_top",
			"royal_nature_robe_bottoms",
			"royal_fire_robe_top",
			"royal_fire_robe_bottoms",
			"furious_spear",
			"regal_sword",
			"sundering_crossbow",
		]),
		"d4": new Set([
			"pirate_chest",
			"pirate_refinement_chest",
			"pirate_token",
			"marksman_brooch",
			"corsair_crest",
			"damaged_anchor",
			"maelstrom_plating",
			"kraken_leather",
			"kraken_fang",
			"pirate_refinement_shard",
			"pirate_essence",
			"shield_bash",
			"fracturing_impact",
			"life_drain",
			"marksman_bracers",
			"corsair_helmet",
			"anchorbound_plate_body",
			"anchorbound_plate_legs",
			"maelstrom_plate_body",
			"maelstrom_plate_legs",
			"kraken_tunic",
			"kraken_chaps",
			"rippling_trident",
			"blooming_trident",
			"blazing_trident",
		]),
	};

	const skillingOutfits = new Set([
		"dairyhands_top",
		"foragers_top",
		"lumberjacks_top",
		"cheesemakers_top",
		"crafters_top",
		"tailors_top",
		"chefs_top",
		"brewers_top",
		"alchemists_top",
		"enhancers_top",
		"dairyhands_bottoms",
		"foragers_bottoms",
		"lumberjacks_bottoms",
		"cheesemakers_bottoms",
		"crafters_bottoms",
		"tailors_bottoms",
		"chefs_bottoms",
		"brewers_bottoms",
		"alchemists_bottoms",
		"enhancers_bottoms",
	]);

	function checkbox ({ label, className, checked, showIf }) {
		return `<div class="AchievementsPanel_checkboxControl__3e6CJ ${className} ucf-userscript" style="${(showIf && !showIf()) ? 'display: none' : ''}">
				<label class="MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd Checkbox_checkbox__dP0DH css-1jaw3da">
					<span class="MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary MuiCheckbox-sizeSmall PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary MuiCheckbox-sizeSmall ${checked ? "Mui-checked" : ""} MuiCheckbox-root MuiCheckbox-colorPrimary MuiCheckbox-sizeSmall css-zun73v">`
						+ (checked ? `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-1k33q06" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxIcon">
							<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
						</svg>` : "")
						+ (!checked ? `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-1k33q06" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckBoxOutlineBlankIcon">
							<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
						</svg>` : "")
					+ `</span>
					<span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3">${label}</span>
				</label>
			</div>`;
	}

	function matchFromTo (from, to, _, n) {
		return from <= n && n <= to;
	}

	function matchDungeon (dungeon, itemId, _) {
		return dungeonsItems[dungeon].has(itemId) || dungeonsItems[dungeon].has(itemId.replace("_refined", ""));
	}

	function matchNoDungeon (itemId) {
		return !matchDungeon("d1", itemId)
			&& !matchDungeon("d2", itemId)
			&& !matchDungeon("d3", itemId)
			&& !matchDungeon("d4", itemId);
	}

	function matchSkillingOutfit (itemId) {
		return skillingOutfits.has(itemId);
	}

	function matchUncollectedCharm (itemId, n) {
		return itemId.includes("charm") && n == 0;
	}

	function matchUncollectedCelestial (itemId, n) {
		return itemId.includes("celestial") && n == 0;
	}

	function matchFavorite (itemId) {
		return favorites[itemId];
	}

	let flags = [
		{ from: 1, to: 9, checked: true },
		{ from: 10, to: 79, checked: true },
		{ from: 80, to: 99, checked: true },
		{ from: 100, to: 799, checked: true },
		{ from: 800, to: 999, checked: true },
		{ from: 1000, to: 7999, checked: false },
		{ from: 8000, to: 9999, checked: false },
		{ label: "10k+", from: 10000, to: Infinity, checked: false },
		{ label: "Not dungeon", className: "nod", checked: true, fn: matchNoDungeon },
		{ dungeon: "d1", checked: false },
		{ dungeon: "d2", checked: false },
		{ dungeon: "d3", checked: false },
		{ dungeon: "d4", checked: false },
		{ label: "Skilling Outfits", className: "skilling-outfit", checked: false, fn: matchSkillingOutfit },
		{ label: "Uncollected Charms", className: "charm", checked: false, fn: matchUncollectedCharm, showIf: () => showUncollected },
		{ label: "Uncollected Celestials", className: "celestial", checked: false, fn: matchUncollectedCelestial, showIf: () => showUncollected },
		{ label: "Always Show Favorites", className: "favorite", checked: true, fn: matchFavorite, generateCSS: false },
	];

	flags.forEach((f) => {
		if ("from" in f && !f.label) {
			f.label = f.from + "-" + f.to;
		}
		if ("from" in f && !f.className) {
			f.className = "c" + f.from + "-" + f.to;
		}
		if ("from" in f && !f.fn) {
			f.fn = matchFromTo.bind(null, f.from, f.to);
		}
		if ("dungeon" in f && !f.label) {
			f.label = f.dungeon.toUpperCase();
			f.className = f.dungeon;
			f.fn = matchDungeon.bind(null, f.dungeon);
		}
	});

	function loadFlags () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		const fs = GM_getValue("flags_" + characterID, {});
		flags.forEach((f) => {
			if (f.className in fs) {
				f.checked = fs[f.className];
			}
		});
	}

	function saveFlags () {
		let fs = {};
		flags.forEach((f) => {
			fs[f.className] = f.checked;
		});
		const characterID = unsafeWindow.location.search.split("=")[1];
		GM_setValue("flags_" + characterID, fs);
	}

	let collections;
	function loadCollections () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		collections = GM_getValue("collections_" + characterID, {});
	}

	function saveCollections () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		GM_setValue("collections_" + characterID, collections);
	}

	let favorites;
	function loadFavorites () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		favorites = GM_getValue("favorites_" + characterID, {});
	}

	function saveFavorites () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		GM_setValue("favorites_" + characterID, favorites);
	}


	function rerenderCollectionsFiltering (panelEl) {
		const catsEl = panelEl.parentElement.querySelector(".AchievementsPanel_categories__34hno");

		catsEl.querySelectorAll(".Collection_collectionContainer__3ZlUO").forEach((el) => {
			const itemId = el.querySelector("use").getAttribute("href").split("#")[1];
			const n = unformatNumber(el.querySelector(".Collection_count__3oj-t")?.textContent ?? "0");

			collections[itemId] = n;

			flags.forEach((f) => {
				if (f.fn(itemId, n)) {
					el.classList.add(f.className);
				} else {
					el.classList.remove(f.className);
				}
			});

			let starEl = el.querySelector(".ucf-userscript.star");
			if (!starEl) {
				el.insertAdjacentHTML("beforeend", `<div class="ucf-userscript star"></div>`);
				starEl = el.querySelector(".ucf-userscript.star");
				starEl.addEventListener("click", (event) => {
					event.stopPropagation();
					if (favorites[itemId]) {
						delete favorites[itemId];
						el.classList.remove(`favorite`);
					} else {
						favorites[itemId] = true;
						el.classList.add(`favorite`);
					}
					saveFavorites();
				}, true);
			}

			if (favorites[itemId]) {
				el.classList.add(`favorite`);
			} else {
				el.classList.remove(`favorite`);
			}
		});

		saveCollections();

		function updateShowClass (f) {
			if (f.checked) {
				catsEl.classList.add(`show-${f.className}`);
			} else {
				catsEl.classList.remove(`show-${f.className}`);
			}
		}

		panelEl.querySelectorAll(".ucf-userscript").forEach((el) => el.remove());

		panelEl.insertAdjacentHTML("beforeend", flags.map(checkbox).join(""));

		flags.forEach((f) => {
			panelEl.querySelector("." + f.className).onclick = (event) => {
				event.stopPropagation();
				f.checked = !f.checked;
				saveFlags();
				rerenderCollectionsFiltering(panelEl);
			};

			updateShowClass(f);
		});

		catsEl.classList.add("ucf-userscript");
	}

	let showUncollected;
	function loadShowUncollected () {
		const characterID = unsafeWindow.location.search.split("=")[1];
		showUncollected = GM_getValue("showUncollected_" + characterID, false);
	}

	function saveShowUncollected () {
		const el = document.querySelector(".AchievementsPanel_collections__qA6CY .AchievementsPanel_controls__3bGFT > .AchievementsPanel_checkboxControl__3e6CJ");
		showUncollected = el.querySelector("label > span").classList.contains("Mui-checked");

		const characterID = unsafeWindow.location.search.split("=")[1];
		GM_setValue("showUncollected_" + characterID, showUncollected);
	}

	function restoreShowUncollected () {
		const el = document.querySelector(".AchievementsPanel_collections__qA6CY .AchievementsPanel_controls__3bGFT > .AchievementsPanel_checkboxControl__3e6CJ");
		if (showUncollected && !el.querySelector("label > span").classList.contains("Mui-checked")) {
			el.querySelector("input").click();
		}
	}

	function isCollectionsOnScreen () {
		return document.querySelector(".TabPanel_tabPanel__tXMJF:not(.TabPanel_hidden__26UM3) .AchievementsPanel_collections__qA6CY .Collection_collectionContainer__3ZlUO");
	}

	function addCollectionsFiltering () {
		const panelEl =  document.querySelector(".TabPanel_tabPanel__tXMJF:not(.TabPanel_hidden__26UM3) .AchievementsPanel_collections__qA6CY .AchievementsPanel_controls__3bGFT");

		loadShowUncollected();
		loadFlags();
		loadFavorites();
		loadCollections();

		restoreShowUncollected();
		saveShowUncollected();

		rerenderCollectionsFiltering(panelEl);

		panelEl.querySelector(".AchievementsPanel_refreshButton__3RYCh").onclick = () => {
			setTimeout(() => {
				rerenderCollectionsFiltering(panelEl);
			}, 500);
		};

		panelEl.parentElement.querySelector(".AchievementsPanel_controls__3bGFT > .AchievementsPanel_checkboxControl__3e6CJ").onclick = () => {
			requestAnimationFrame(() => {
				saveShowUncollected();
				rerenderCollectionsFiltering(panelEl);
			});
		};
	}

	const actionToItem = {
		"cow": "milk",
		"verdant_cow": "verdant_milk",
		"azure_cow": "azure_milk",
		"burble_cow": "burble_milk",
		"crimson_cow": "crimson_milk",
		"unicow": "rainbow_milk",
		"holy_cow": "holy_milk",
		"tree": "log",
		"birch_tree": "birch_log",
		"cedar_tree": "cedar_log",
		"purpleheart_tree": "purpleheart_log",
		"ginkgo_tree": "ginkgo_log",
		"redwood_tree": "redwood_log",
		"arcane_tree": "arcane_log",
	};

	function isSkillingScreen () {
		return document.querySelector(".TabPanel_tabPanel__tXMJF:not(.TabPanel_hidden__26UM3) .SkillActionGrid_skillActionGrid__1tJFk");
	}

	function tierColorClass (n) {
		if (n == 0) {
			return "Collection_tierGray__279Mp";
		} else if (n < 10) {
			return "Collection_tierWhite__2m0_1";
		} else if (n < 100) {
			return "Collection_tierGreen__ExgCi";
		} else if (n < 1000) {
			return "Collection_tierBlue__3uYl-";
		} else if (n < 10000) {
			return "Collection_tierPurple__13F_l";
		} else if (n < 100000) {
			return "Collection_tierRed__3dV_1";
		} else if (n < 1000000) {
			return "Collection_tierOrange__2wpdX"
		} else {
			return "Collection_tierRainbow__1eS_P";
		}
	}

	function addSkillingCollectionCounts (containerEl) {
		const itemsEls = containerEl.querySelectorAll(".SkillAction_skillAction__1esCp");

		loadCollections();

		itemsEls.forEach((el) => {
			let itemId = el.querySelector("use").getAttribute("href").split("#")[1];

			if (itemId in actionToItem) {
				itemId = actionToItem[itemId];
			}

			if (itemId in collections) {
				const n = collections[itemId];
				el.querySelector(".ucf-userscript")?.remove();
				el.querySelector(".SkillAction_name__2VPXa").insertAdjacentHTML("beforeend", `
					<span class="ucf-userscript Collection_collection__3H6c8 ${tierColorClass(n)}">
						<span class="Collection_count__3oj-t">${f(n)}</span>
					</span>
				`.replace(/[\t\n]+/g, ""));
			}
		});
	}

	document.body.insertAdjacentHTML("beforeend", `<style class="ucf-userscript">
		.ucf-userscript.Collection_collection__3H6c8 {
			border-radius: var(--radius-sm);
			margin-left: 4px;
			padding: 2px;
		}

		.AchievementsPanel_controls__3bGFT .Checkbox_checkbox__dP0DH {
			margin-right: 0;
		}

		.AchievementsPanel_controls__3bGFT {
			row-gap: 10px;
		}

		.Collection_collectionContainer__3ZlUO {
			position: relative;
		}

		.Collection_collectionContainer__3ZlUO .ucf-userscript.star {
			position: absolute;
			top: 0;
			right: 0;
			width: 25px;
			height: 25px;
		}

		.Collection_collectionContainer__3ZlUO .ucf-userscript.star::before {
			display: block;
			content: "☆";
			font-size: 15px;
			margin-left: 5px;
		}

		.Collection_collectionContainer__3ZlUO.favorite .ucf-userscript.star::before {
			content: "★";
			color: orange;
			font-size: 21px;
			margin-top: -5px;
		}\n`
		+ flags.map((f) => {
			if (f.generateCSS !== false) {
				return `.AchievementsPanel_categories__34hno.ucf-userscript:not(.show-${f.className}) .Collection_collectionContainer__3ZlUO.${f.className} { display: none; }`;
			} else {
				return "";
			}
		}).join("\n") + "\n"
		+ `.AchievementsPanel_categories__34hno.ucf-userscript.show-favorite .Collection_collectionContainer__3ZlUO.favorite {
			display: initial !important;
		}\n`
		+ ` </style>`);

	waitFnRepeatedFor(isCollectionsOnScreen, addCollectionsFiltering);
	waitFnRepeatedFor(isSkillingScreen, addSkillingCollectionCounts);
})();

