// ==UserScript==
// @name         Extra tools for the Shykai sim
// @namespace    http://tampermonkey.net/
// @version      2026-01-08
// @description  Get exact dungeon run times out of the shykai sim
// @license      MIT
// @author       sentientmilk
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561773/Extra%20tools%20for%20the%20Shykai%20sim.user.js
// @updateURL https://update.greasyfork.org/scripts/561773/Extra%20tools%20for%20the%20Shykai%20sim.meta.js
// ==/UserScript==

/*
	Changelog
	=========

	v2026-01-08
		- Initial version

	TODO
	====================
*/

(async function() {
	const replacements = {
		'console.log("All Players died at wave #" + (this.zone.encountersKilled - 1) + " with ememies: " + this.enemies.map(enemy => (enemy.hrid+"("+(enemy.combatDetails.currentHitpoints*100/enemy.combatDetails.maxHitpoints).toFixed(2)+"%)")).join(", "));': "",

		"this.checkTriggers();\n": `
			this.players.forEach((p) => {
				const waveN = this.zone.encountersKilled - 1;

				if (p.combatDetails.currentHitpoints == 0) {
					p._diedOnWave = waveN;
				}

				if (p.combatDetails.currentManapoints == 0) {
					if (!p._OOMOnWave) {
						p._OOMOnWave = {};
					}
					p._OOMOnWave[waveN] = true;
				}

				p._minHP = Math.min(p._minHP ?? Infinity, p.combatDetails.currentHitpoints);
				p._minMP = Math.min(p._minMP ?? Infinity, p.combatDetails.currentManapoints);
			});

			this.checkTriggers();\n`,

		"startNewEncounter() {\n": `startNewEncounter() {
			const failed = this.allPlayersDead;
			const finished = this.zone.encountersKilled > this.zone.dungeonSpawnInfo.maxWaves;

			if (failed || finished) {
				const won = !failed;

				if (!this._lastBattleEndTime) {
					this._lastBattleEndTime = 0;
				}

				if (!this.runN) {
					this.runN = 0;
				}
				this.runN += 1;

				const waveN = this.zone.encountersKilled - 1;
				const time = (this.simulationTime - this._lastBattleEndTime) / 1e9;
				const totalTime = this.simulationTime / 1e9

				if (failed) {
					this.players.forEach((p) => {
						if (!p._diedOnWave) {
							p._diedOnWave = waveN;
						}
					});
				}

				postMessage({
					type: "runEnd",
					won,
					failed,
					runN: this.runN,
					waveN,
					time,
					totalTime,
					players: this.players.map((p) => ({
						minHP: p._minHP,
						minMP: p._minMP,
						diedOnWave: p._diedOnWave,
						OOMOnWave: Object.keys(p._OOMOnWave ?? {}).length ? Object.keys(p._OOMOnWave ?? {}) : null,
					})),
				});

				this._lastBattleEndTime = this.simulationTime;

				this.players.forEach((p) => {
					p._minHP = Infinity;
					p._minMP = Infinity;
					p._diedOnWave = null;
					p._OOMOnWave = {};
				});
			}
		`,
	};

	async function wait (ms=0) { return new Promise((resolve) => setTimeout(resolve, ms)); }

	async function waitCheck (check, ms=50) {
		return new Promise(function _check (resolve) {
			if (check()) { return resolve(); }
			setTimeout(_check.bind(null, resolve), ms);
		});
	}

	function ft (t) {
		if (isNaN(t)) {
			return "-";
		}
		return (t > 60*60 ? Math.floor(t / 60 / 60).toFixed(0) + "h " : "") + Math.floor((t / 60) % 60).toFixed(0) + "m " +(t % 60).toFixed(1) + "s";
	}

	function f (n) {
		if (isNaN(n)) {
			return "-";
		}
		return n.toFixed(2);
	}

	function calcAverage (arr) {
		return arr.reduce((sum, n) => (sum + n), 0) / arr.length;
	}

	async function setSelectValue (selectEl, textValue) {
		const optionEl = Array.from(selectEl.querySelectorAll("option")).find((el) => el.textContent == textValue);
		selectEl.value = optionEl.value;
		selectEl.dispatchEvent(new Event("change"));
	}
	async function setCheckboxValue (checkboxEl, isChecked) {
		// Flip it once
		checkboxEl.checked = !isChecked;
		checkboxEl.dispatchEvent(new Event("change"));
		checkboxEl.checked = isChecked;
		checkboxEl.dispatchEvent(new Event("change"));
	}

	async function setInputValue (inputEl, value) {
		inputEl.value = value;
	}

	function getPlayersNames () {
		return Array.from(document.querySelectorAll("#playerTab > li > a")).map((el) => el.textContent);
	}

	function setPlayersNames (names) {
		return Array.from(document.querySelectorAll("#playerTab > li > a")).forEach((el, i) => el.textContent = names[i]);
	}

	function getSelectedPlayerIndex () {
		return Array.from(document.querySelectorAll("#playerTab li a")).findIndex((el) => el.classList.contains("active"));
	}

	async function importGroup (str) {
		await waitCheck(() => document.querySelector("#buttonImportExport"));

		document.querySelector("#buttonImportExport").click();
		await waitCheck(() => document.querySelector("#importExportModal").style.display == "block");

		document.querySelector("#inputSetGroupCombatAll").value = str;
		document.querySelector("#buttonImportSet").click();

		document.querySelector(`#importExportModal button[data-bs-dismiss="modal"]`).click();
		await waitCheck(() => document.querySelector("#importExportModal").style.display == "none");
	}

	async function setStartSimulationOptions (options) {
		await waitCheck(() => document.querySelector("#buttonSimulationSetup"));

		document.querySelector("#buttonSimulationSetup").click();

		await waitCheck(() => document.querySelector("#startSimulationModal").style.display == "block");

		await wait();

		for (let option in options) {
			const value = options[option];
			const labelEl = Array.from(document.querySelectorAll("#startSimulationModal label")).find((el) => el.textContent == option);

			const selectEl = labelEl.parentElement.querySelector("select");
			if (selectEl) {
				await setSelectValue(selectEl, value);
			}

			const checkboxEl = labelEl.parentElement.querySelector(`input[type="checkbox"]`);
			if (checkboxEl) {
				await setCheckboxValue(checkboxEl, value);
			}

			const inputEl = labelEl.parentElement.querySelector(`input[type="number"]`);
			if (inputEl) {
				await setInputValue(inputEl, value);
			}
		}

		document.querySelector(`#startSimulationModal button[data-bs-dismiss="modal"]`).click();
		await waitCheck(() => document.querySelector("#startSimulationModal").style.display == "none");
	}

	async function startSim () {
		const startModalBtn = document.querySelector("#buttonSimulationSetup");
		startModalBtn.click();

		await wait();

		const startSimBtn = document.querySelector("#buttonStartSimulation");
		startSimBtn.click();

		await waitCheck(() => document.querySelector("#buttonStopSimulation").style.display == "block");
		await waitCheck(() => document.querySelector("#buttonStopSimulation").style.display == "none");
	}

	function insertStatAfterStat ({ afterStat, name, id, value }) {
		const el = Array.from(document.querySelectorAll(".row.pt-3 .row .col-md-6:first-child")).find((el) => el.textContent == stat).parentNode;

		el.insertAdjacentHTML("afterend", `
			<div class="row">
				<div class="col-md-6 ust-${id}">${name}</div>
				<div class="col-md-6 text-end">${value}</div>
			</div>
		`);
	}

	async function addExtraStats (stats) {
		const rowEl = document.querySelector(`[data-i18n="common:simulationResults.killPerHour"]`).parentElement;
		rowEl.parentElement.querySelectorAll(".ued-stats").forEach((el) => el.remove());
		let html = `
			<div class="row ued-stats">
				<b>Extra stats</b>
			</div>
			<div class="mb-2 ued-stats">
		`;


		for (let name in stats) {
			const value = stats[name];
			if (value !== null) {
				html += `
					<div class="row">
						<div class="col-md-6">${name}</div>
						<div class="col-md-6 text-end">${value}</div>
					</div>`;
			}
		}

		html += `
			</div>
		`;

		rowEl.insertAdjacentHTML("beforebegin", html);
	}

	let runs = [];
	function onSimStart (d) {
		console.log("Started new sim");
		//console.log(d);

		runs = [];
	}

	function onRunEnd (d) {
		//console.log(d);
		
		runs.push(d);

		const playersNames = getPlayersNames();

		if (d.won == false) {
			console.log(`Run #${d.runN}. Failed on wave ${d.waveN}! ` + d.players.map((p, i) => (p.diedOnWave !== d.waveN) ? playersNames[i] + " died on wave " + p.diedOnWave : null).filter(Boolean).join(", "));
		}

		if (d.players.find((p) => p.minHP == 0) && d.won == true) {
			console.log(`Run #${d.runN}. ` + d.players.map((p, i) => p.minHP == 0 ? playersNames[i] + " died on wave " + p.diedOnWave : null).filter(Boolean).join(", ") + ", but still won!");
		}

		if (d.players.find((p) => p.minMP == 0)) {
			console.log(`Run #${d.runN}. ` + d.players.map((p, i) => p.minMP == 0 ? playersNames[i] + " OOM on wave" + (p.OOMOnWave.length != 1 ? "s" : "") + " " + p.OOMOnWave.join(", ") : null).filter(Boolean).join("; "));
		}
	}

	let wonN;
	let failN;
	let average;
	let wonAverage;

	let players;
	let playersNames;
	async function onSimEnd (d) {
		//console.log("onSimEnd");
		//console.log(d);

		wonN = runs.filter((r) => r.won).length;
		failN = runs.filter((r) => r.failed).length;
		average = runs.reduce((acc, r) => (acc + r.time), 0) / runs.length;
		wonAverage = runs.filter((r) => r.won).reduce((acc, r) => (acc + r.time), 0) / wonN;

		players = {};
		playersNames = getPlayersNames();
		playersNames.forEach((name, i) => {
			const averageMinHP = calcAverage(runs.map((r) => r.players[i].minHP).filter((n) => n > 0));
			const averageMinMP = calcAverage(runs.map((r) => r.players[i].minMP).filter((n) => n > 0));
			const diedButWonN = runs.filter((r) => r.won && r.players[i].diedOnWave).length;
			const oomN = runs.filter((r) => r.players[i].minMP == 0).length;
			players[name] = {
				averageMinHP,
				averageMinMP,
				diedButWonN,
				oomN,
			};
		});

		console.log();
		console.log([`Won ${wonN} runs`,
			`Failed ${failN} runs`,
			`Average: ${ft(average)}`,
			`Won-only average: ${ft(wonAverage)}`,
		].join(", "));

		for (let name in players) {
			const p = players[name];
			console.log([name.padEnd(15, " ") + ` Average min HP: ${f(p.averageMinHP).padEnd(7, " ")}`,
				`Average min MP: ${f(p.averageMinMP).padEnd(7, " ")}`,
				(p.oomN > 0 ? "OOM " + p.oomN + " time" + (p.oomN != 1 ? "s" : "") : null),
				(p.diedButWonN > 0 ? "Died but won N: " + p.diedButWonN : null),
			].filter(Boolean).join(", "));
		}

		document.querySelectorAll("#playerTab li").forEach((el) => el.onclick = onTabSwitch);

		await onTabSwitch();

	}

	async function onTabSwitch () {
		const selectedPlayerIndex = getSelectedPlayerIndex();
		const p = players[playersNames[selectedPlayerIndex]];

		await addExtraStats({
			"Won": wonN,
			"Failed": failN,
			"Average": ft(average),
			"Won-only average": ft(wonAverage),
			"Average min HP": f(p.averageMinHP),
			"Average min MP": f(p.averageMinMP),
			"OOM": (p.oomN > 0 ? p.oomN + " time" + (p.oomN != 1 ? "s" : "") : null),
			"Died but won": (p.diedButWonN > 0 ? p.diedButWonN + " time" + (p.diedButWonN != 1 ? "s" : ""): null),
		});
	}

	const OriginalWorker = unsafeWindow.Worker;
	unsafeWindow.Worker = function (url) {
		async function download (url) {
			let res;
			try {
				res = await new Promise((resolve, reject) => {
					GM.xmlHttpRequest({
						method: 'GET',
						url,
						timeout: 10000,
						onabort: reject,
						onerror: reject,
						ontimeout: reject,
						onload: resolve,
					});
				});
			} catch (err) {
				console.error("Can't download", url);
				console.error(err);
				return;
			}

			return res.responseText;
		}

		function onSimTerminate () {
			console.log("Sim was terminated");
			onSimEnd();
		}

		let _msg;
		function wrappedPostMessage (message) {
			if (message.type == "start_simulation") {
				 onSimStart(message);
			}

			w.postMessage(message);
		}

		let _onmessage;
		function wrappedOnmessage (message) {
			if (message.data.type == "runEnd") {
				onRunEnd(message.data);
			} else if (message.data.type == "simulation_result") {
				onSimEnd(message.data);
				_onmessage(message);
			} else {
				_onmessage(message);
			}
		}

		let w;
		async function injectInit () {
			//console.log("Inject Worker", url);

			const workerImportsChunks = {
				"vendors-node_modules_heap-js_dist_heap-js_es5_js": "https://shykai.github.io/MWICombatSimulatorTest/dist/vendors-node_modules_heap-js_dist_heap-js_es5_js.bundle.js",
				"src_worker_js": "https://shykai.github.io/MWICombatSimulatorTest/dist/src_worker_js.bundle.js",
			};

			let workerImports = {};

			for (let chunkId in workerImportsChunks) {
				let code = await download(workerImportsChunks[chunkId]);
				for (let match in replacements) {
					code = code.replace(match, replacements[match]);
				}
				workerImports[chunkId] = code;
			}

			let workerCode = await download(url);

			workerCode = workerCode.replace("var __webpack_modules__ = ({});\n", `
				var __webpack_modules__ = ({});
				console.log("Successfully injected code into the Worker!");
			`);

			workerCode = workerCode.replace("__webpack_require__.f.i = (chunkId, promises) => {\n", `
				//console.log("Injected fake __webpack_require__.f.i function");
				const workerImports = {
					${Object.entries(workerImports).map(([chunkId, code]) => '"' + chunkId + '": function () {\n' + code + '\n},').join("\n")}
				};
				__webpack_require__.f.i = (chunkId, promises) => {
					//console.log("Inside fake __webpack_require__.f.i function");
					if(!installedChunks[chunkId]) {
						const url = __webpack_require__.p + __webpack_require__.u(chunkId);
						//console.log("Fake import", chunkId, url);

						if (chunkId in workerImports) {
							workerImports[chunkId]();
						} else {
							throw new Error('Url "' + url + '" is not preloaded in workerImports');
						}

					}
					return;
			`);

			const blob = new Blob([workerCode], { type: "application/javascript" });
			w = new OriginalWorker(URL.createObjectURL(blob));
			if (_onmessage) {
				//console.log("Set onmessage", _onmessage);
				w.onmessage = wrappedOnmessage;
			}
			if (_msg) {
				//console.log("Send postMessage", _msg);
				wrappedPostMessage(_msg);
			}
		}

		if (["https://shykai.github.io/MWICombatSimulatorTest/dist/1.bundle.js", "https://shykai.github.io/MWICombatSimulatorTest/dist/3.bundle.js"].includes(url.href)) {
			injectInit(); // is async, intentionally not blocking

			return {
				set onmessage (onmessage) {
					//console.log("Register onmessage", onmessage);
					_onmessage = onmessage;
					if (w) {
						//console.log("Set onmessage", onmessage);
						w.onmessage = wrappedOnmessage;
					}
				},
				postMessage (msg) {
					//console.log("Register postMessage", msg);
					if (w) {
						//console.log("Send postMessage", msg);
						wrappedPostMessage(msg);
					} else {
						_msg = msg;
					}
				},
				terminate () {
					//console.log("terminate");
					w.terminate();
					onSimTerminate();
				},
			}
		} else {
			return new OriginalWorker(url);
		}
	}

	return; // Prevent test code running

	await wait(2000);
	await importGroup(`
{"1":"{\\"player\\":{\\"attackLevel\\":125,\\"magicLevel\\":110,\\"meleeLevel\\":110,\\"rangedLevel\\":149,\\"defenseLevel\\":126,\\"staminaLevel\\":125,\\"intelligenceLevel\\":125,\\"equipment\\":[{\\"itemLocationHrid\\":\\"/item_locations/head\\",\\"itemHrid\\":\\"/items/acrobatic_hood_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/body\\",\\"itemHrid\\":\\"/items/kraken_tunic_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/legs\\",\\"itemHrid\\":\\"/items/kraken_chaps_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/feet\\",\\"itemHrid\\":\\"/items/collectors_boots\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/hands\\",\\"itemHrid\\":\\"/items/enchanted_gloves\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/two_hand\\",\\"itemHrid\\":\\"/items/cursed_bow_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/pouch\\",\\"itemHrid\\":\\"/items/guzzling_pouch\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/back\\",\\"itemHrid\\":\\"/items/chimerical_quiver\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/neck\\",\\"itemHrid\\":\\"/items/philosophers_necklace\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/earrings\\",\\"itemHrid\\":\\"/items/philosophers_earrings\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/ring\\",\\"itemHrid\\":\\"/items/philosophers_ring\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/charm\\",\\"itemHrid\\":\\"/items/expert_ranged_charm\\",\\"enhancementLevel\\":3}]},\\"food\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/spaceberry_donut\\"},{\\"itemHrid\\":\\"/items/spaceberry_cake\\"},{\\"itemHrid\\":\\"/items/star_fruit_yogurt\\"}]},\\"drinks\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/ultra_ranged_coffee\\"},{\\"itemHrid\\":\\"/items/ultra_attack_coffee\\"},{\\"itemHrid\\":\\"/items/swiftness_coffee\\"}]},\\"abilities\\":[{\\"abilityHrid\\":\\"/abilities/critical_aura\\",\\"level\\":\\"60\\"},{\\"abilityHrid\\":\\"/abilities/frenzy\\",\\"level\\":\\"62\\"},{\\"abilityHrid\\":\\"/abilities/berserk\\",\\"level\\":\\"70\\"},{\\"abilityHrid\\":\\"/abilities/penetrating_shot\\",\\"level\\":\\"80\\"},{\\"abilityHrid\\":\\"/abilities/rain_of_arrows\\",\\"level\\":\\"65\\"}],\\"triggerMap\\":{\\"/abilities/berserk\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/berserk\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/critical_aura\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/critical_aura\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/frenzy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/frenzy\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/penetrating_shot\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":2900}],\\"/abilities/rain_of_arrows\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/number_of_active_units\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1800},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":200}],\\"/items/critical_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/critical_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/critical_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/lucky_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/lucky_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/spaceberry_cake\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":600}],\\"/items/spaceberry_donut\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}],\\"/items/star_fruit_yogurt\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":450}],\\"/items/ultra_ranged_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/ranged_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_attack_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/attack_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/swiftness_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/swiftness_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}]},\\"zone\\":\\"/actions/combat/fly\\",\\"simulationTime\\":\\"2\\",\\"houseRooms\\":{\\"/house_rooms/archery_range\\":8,\\"/house_rooms/armory\\":4,\\"/house_rooms/brewery\\":2,\\"/house_rooms/dairy_barn\\":2,\\"/house_rooms/dining_room\\":4,\\"/house_rooms/dojo\\":6,\\"/house_rooms/forge\\":2,\\"/house_rooms/garden\\":2,\\"/house_rooms/gym\\":2,\\"/house_rooms/kitchen\\":2,\\"/house_rooms/laboratory\\":3,\\"/house_rooms/library\\":6,\\"/house_rooms/log_shed\\":2,\\"/house_rooms/mystical_study\\":2,\\"/house_rooms/observatory\\":3,\\"/house_rooms/sewing_parlor\\":2,\\"/house_rooms/workshop\\":2},\\"achievements\\":{\\"/achievements/bestiary_points_100\\":true,\\"/achievements/bestiary_points_20\\":true,\\"/achievements/bestiary_points_200\\":true,\\"/achievements/bestiary_points_40\\":true,\\"/achievements/bestiary_points_400\\":true,\\"/achievements/brew_gourmet_tea\\":true,\\"/achievements/brew_ultra_magic_coffee\\":true,\\"/achievements/build_room_level_1\\":true,\\"/achievements/build_room_level_3\\":true,\\"/achievements/build_room_level_6\\":true,\\"/achievements/build_room_level_8\\":true,\\"/achievements/buy_trainee_charm\\":true,\\"/achievements/cheesesmith_azure_tool\\":true,\\"/achievements/clear_chimerical_den\\":true,\\"/achievements/clear_enchanted_fortress\\":true,\\"/achievements/clear_pirate_cove\\":true,\\"/achievements/clear_sinister_circus\\":true,\\"/achievements/clear_t1_dungeon_10_times\\":true,\\"/achievements/coinify_coins_1m\\":true,\\"/achievements/collect_branch_of_insight\\":false,\\"/achievements/collect_butter_of_proficiency\\":true,\\"/achievements/collect_thread_of_expertise\\":true,\\"/achievements/collection_points_100\\":true,\\"/achievements/collection_points_1000\\":true,\\"/achievements/collection_points_200\\":true,\\"/achievements/collection_points_2000\\":false,\\"/achievements/collection_points_500\\":true,\\"/achievements/complete_tutorial\\":true,\\"/achievements/cook_apple_gummy\\":true,\\"/achievements/cook_peach_yogurt\\":true,\\"/achievements/cook_spaceberry_cake\\":true,\\"/achievements/craft_celestial_tool_or_outfit\\":false,\\"/achievements/craft_dungeon_equipment\\":true,\\"/achievements/craft_jewelry\\":true,\\"/achievements/craft_master_charm\\":false,\\"/achievements/craft_wooden_bow\\":true,\\"/achievements/decompose_bamboo_gloves\\":true,\\"/achievements/defeat_chronofrost_sorcerer\\":true,\\"/achievements/defeat_crystal_colossus\\":true,\\"/achievements/defeat_demonic_overlord_t1\\":true,\\"/achievements/defeat_dusk_revenant\\":true,\\"/achievements/defeat_gobo_chieftain\\":true,\\"/achievements/defeat_jerry\\":true,\\"/achievements/defeat_jerry_t5\\":true,\\"/achievements/defeat_luna_empress\\":true,\\"/achievements/defeat_marine_huntress\\":true,\\"/achievements/defeat_red_panda\\":true,\\"/achievements/defeat_shoebill\\":true,\\"/achievements/defeat_stalactite_golem_t5\\":true,\\"/achievements/defeat_the_watcher\\":true,\\"/achievements/enhance_level_80_to_10\\":false,\\"/achievements/enhance_level_90_to_10\\":false,\\"/achievements/enhance_to_10\\":false,\\"/achievements/enhance_to_3\\":true,\\"/achievements/enhance_to_6\\":false,\\"/achievements/equip_expert_task_badge\\":true,\\"/achievements/equip_ginkgo_weapon\\":true,\\"/achievements/gather_milk\\":true,\\"/achievements/learn_ability\\":true,\\"/achievements/learn_special_ability\\":true,\\"/achievements/refine_dungeon_equipment\\":true,\\"/achievements/tailor_gluttonous_or_guzzling_pouch\\":false,\\"/achievements/tailor_medium_pouch\\":true,\\"/achievements/tailor_umbral_tunic\\":true,\\"/achievements/task_tokens_10\\":true,\\"/achievements/total_level_100\\":true,\\"/achievements/total_level_1000\\":true,\\"/achievements/total_level_1500\\":true,\\"/achievements/total_level_1800\\":true,\\"/achievements/total_level_250\\":true,\\"/achievements/total_level_500\\":true,\\"/achievements/transmute_philosophers_stone\\":false,\\"/achievements/woodcut_arcane_tree\\":true}}","2":"{\\"player\\":{\\"attackLevel\\":137,\\"magicLevel\\":145,\\"meleeLevel\\":92,\\"rangedLevel\\":96,\\"defenseLevel\\":130,\\"staminaLevel\\":130,\\"intelligenceLevel\\":130,\\"equipment\\":[{\\"itemLocationHrid\\":\\"/item_locations/head\\",\\"itemHrid\\":\\"/items/magicians_hat_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/body\\",\\"itemHrid\\":\\"/items/royal_nature_robe_top_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/legs\\",\\"itemHrid\\":\\"/items/royal_nature_robe_bottoms_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/feet\\",\\"itemHrid\\":\\"/items/sorcerer_boots\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/hands\\",\\"itemHrid\\":\\"/items/enchanted_gloves\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/main_hand\\",\\"itemHrid\\":\\"/items/blooming_trident_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/off_hand\\",\\"itemHrid\\":\\"/items/bishops_codex_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/pouch\\",\\"itemHrid\\":\\"/items/guzzling_pouch\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/back\\",\\"itemHrid\\":\\"/items/enchanted_cloak_refined\\",\\"enhancementLevel\\":8},{\\"itemLocationHrid\\":\\"/item_locations/neck\\",\\"itemHrid\\":\\"/items/philosophers_necklace\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/earrings\\",\\"itemHrid\\":\\"/items/philosophers_earrings\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/ring\\",\\"itemHrid\\":\\"/items/philosophers_ring\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/charm\\",\\"itemHrid\\":\\"/items/advanced_crafting_charm\\",\\"enhancementLevel\\":2}]},\\"food\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/spaceberry_cake\\"},{\\"itemHrid\\":\\"/items/star_fruit_gummy\\"},{\\"itemHrid\\":\\"/items/star_fruit_yogurt\\"}]},\\"drinks\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/ultra_magic_coffee\\"},{\\"itemHrid\\":\\"/items/ultra_attack_coffee\\"},{\\"itemHrid\\":\\"/items/channeling_coffee\\"}]},\\"abilities\\":[{\\"abilityHrid\\":\\"/abilities/mystic_aura\\",\\"level\\":\\"70\\"},{\\"abilityHrid\\":\\"/abilities/toxic_pollen\\",\\"level\\":\\"75\\"},{\\"abilityHrid\\":\\"/abilities/natures_veil\\",\\"level\\":\\"66\\"},{\\"abilityHrid\\":\\"/abilities/life_drain\\",\\"level\\":\\"85\\"},{\\"abilityHrid\\":\\"/abilities/entangle\\",\\"level\\":\\"72\\"}],\\"triggerMap\\":{\\"/abilities/entangle\\":[],\\"/abilities/life_drain\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":500}],\\"/abilities/mystic_aura\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/mystic_aura\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/natures_veil\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":2250}],\\"/abilities/toxic_pollen\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":2250}],\\"/items/channeling_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/channeling_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/dragon_fruit_gummy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":340}],\\"/items/spaceberry_cake\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":400}],\\"/items/star_fruit_yogurt\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":500}],\\"/items/ultra_attack_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/attack_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_magic_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/magic_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/star_fruit_gummy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}]},\\"zone\\":\\"/actions/combat/fly\\",\\"simulationTime\\":\\"2\\",\\"houseRooms\\":{\\"/house_rooms/archery_range\\":2,\\"/house_rooms/armory\\":5,\\"/house_rooms/brewery\\":3,\\"/house_rooms/dairy_barn\\":3,\\"/house_rooms/dining_room\\":5,\\"/house_rooms/dojo\\":5,\\"/house_rooms/forge\\":4,\\"/house_rooms/garden\\":3,\\"/house_rooms/gym\\":2,\\"/house_rooms/kitchen\\":3,\\"/house_rooms/laboratory\\":4,\\"/house_rooms/library\\":7,\\"/house_rooms/log_shed\\":3,\\"/house_rooms/mystical_study\\":5,\\"/house_rooms/observatory\\":4,\\"/house_rooms/sewing_parlor\\":4,\\"/house_rooms/workshop\\":4},\\"achievements\\":{\\"/achievements/bestiary_points_100\\":true,\\"/achievements/bestiary_points_20\\":true,\\"/achievements/bestiary_points_200\\":true,\\"/achievements/bestiary_points_40\\":true,\\"/achievements/bestiary_points_400\\":true,\\"/achievements/brew_gourmet_tea\\":true,\\"/achievements/brew_ultra_magic_coffee\\":true,\\"/achievements/build_room_level_1\\":true,\\"/achievements/build_room_level_3\\":true,\\"/achievements/build_room_level_6\\":true,\\"/achievements/build_room_level_8\\":false,\\"/achievements/buy_trainee_charm\\":true,\\"/achievements/cheesesmith_azure_tool\\":true,\\"/achievements/clear_chimerical_den\\":true,\\"/achievements/clear_enchanted_fortress\\":true,\\"/achievements/clear_pirate_cove\\":true,\\"/achievements/clear_sinister_circus\\":true,\\"/achievements/clear_t1_dungeon_10_times\\":true,\\"/achievements/coinify_coins_1m\\":true,\\"/achievements/collect_branch_of_insight\\":true,\\"/achievements/collect_butter_of_proficiency\\":true,\\"/achievements/collect_thread_of_expertise\\":true,\\"/achievements/collection_points_100\\":true,\\"/achievements/collection_points_1000\\":true,\\"/achievements/collection_points_200\\":true,\\"/achievements/collection_points_2000\\":true,\\"/achievements/collection_points_500\\":true,\\"/achievements/complete_tutorial\\":true,\\"/achievements/cook_apple_gummy\\":true,\\"/achievements/cook_peach_yogurt\\":true,\\"/achievements/cook_spaceberry_cake\\":true,\\"/achievements/craft_celestial_tool_or_outfit\\":true,\\"/achievements/craft_dungeon_equipment\\":true,\\"/achievements/craft_jewelry\\":true,\\"/achievements/craft_master_charm\\":true,\\"/achievements/craft_wooden_bow\\":true,\\"/achievements/decompose_bamboo_gloves\\":true,\\"/achievements/defeat_chronofrost_sorcerer\\":true,\\"/achievements/defeat_crystal_colossus\\":true,\\"/achievements/defeat_demonic_overlord_t1\\":true,\\"/achievements/defeat_dusk_revenant\\":true,\\"/achievements/defeat_gobo_chieftain\\":true,\\"/achievements/defeat_jerry\\":true,\\"/achievements/defeat_jerry_t5\\":true,\\"/achievements/defeat_luna_empress\\":true,\\"/achievements/defeat_marine_huntress\\":true,\\"/achievements/defeat_red_panda\\":true,\\"/achievements/defeat_shoebill\\":true,\\"/achievements/defeat_stalactite_golem_t5\\":true,\\"/achievements/defeat_the_watcher\\":true,\\"/achievements/enhance_level_80_to_10\\":true,\\"/achievements/enhance_level_90_to_10\\":true,\\"/achievements/enhance_to_10\\":true,\\"/achievements/enhance_to_3\\":true,\\"/achievements/enhance_to_6\\":true,\\"/achievements/equip_expert_task_badge\\":true,\\"/achievements/equip_ginkgo_weapon\\":true,\\"/achievements/gather_milk\\":true,\\"/achievements/learn_ability\\":true,\\"/achievements/learn_special_ability\\":true,\\"/achievements/refine_dungeon_equipment\\":true,\\"/achievements/tailor_gluttonous_or_guzzling_pouch\\":true,\\"/achievements/tailor_medium_pouch\\":true,\\"/achievements/tailor_umbral_tunic\\":true,\\"/achievements/task_tokens_10\\":true,\\"/achievements/total_level_100\\":true,\\"/achievements/total_level_1000\\":true,\\"/achievements/total_level_1500\\":true,\\"/achievements/total_level_1800\\":true,\\"/achievements/total_level_250\\":true,\\"/achievements/total_level_500\\":true,\\"/achievements/transmute_philosophers_stone\\":false,\\"/achievements/woodcut_arcane_tree\\":true}}","3":"{\\"player\\":{\\"attackLevel\\":140,\\"magicLevel\\":154,\\"meleeLevel\\":75,\\"rangedLevel\\":73,\\"defenseLevel\\":126,\\"staminaLevel\\":128,\\"intelligenceLevel\\":127,\\"equipment\\":[{\\"itemLocationHrid\\":\\"/item_locations/head\\",\\"itemHrid\\":\\"/items/magicians_hat_refined\\",\\"enhancementLevel\\":16},{\\"itemLocationHrid\\":\\"/item_locations/body\\",\\"itemHrid\\":\\"/items/royal_water_robe_top_refined\\",\\"enhancementLevel\\":16},{\\"itemLocationHrid\\":\\"/item_locations/legs\\",\\"itemHrid\\":\\"/items/royal_water_robe_bottoms_refined\\",\\"enhancementLevel\\":16},{\\"itemLocationHrid\\":\\"/item_locations/feet\\",\\"itemHrid\\":\\"/items/sorcerer_boots\\",\\"enhancementLevel\\":16},{\\"itemLocationHrid\\":\\"/item_locations/hands\\",\\"itemHrid\\":\\"/items/enchanted_gloves\\",\\"enhancementLevel\\":20},{\\"itemLocationHrid\\":\\"/item_locations/main_hand\\",\\"itemHrid\\":\\"/items/rippling_trident_refined\\",\\"enhancementLevel\\":20},{\\"itemLocationHrid\\":\\"/item_locations/off_hand\\",\\"itemHrid\\":\\"/items/bishops_codex_refined\\",\\"enhancementLevel\\":16},{\\"itemLocationHrid\\":\\"/item_locations/pouch\\",\\"itemHrid\\":\\"/items/guzzling_pouch\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/back\\",\\"itemHrid\\":\\"/items/enchanted_cloak_refined\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/neck\\",\\"itemHrid\\":\\"/items/philosophers_necklace\\",\\"enhancementLevel\\":11},{\\"itemLocationHrid\\":\\"/item_locations/earrings\\",\\"itemHrid\\":\\"/items/philosophers_earrings\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/ring\\",\\"itemHrid\\":\\"/items/philosophers_ring\\",\\"enhancementLevel\\":11},{\\"itemLocationHrid\\":\\"/item_locations/charm\\",\\"itemHrid\\":\\"/items/grandmaster_attack_charm\\",\\"enhancementLevel\\":10}]},\\"food\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/spaceberry_cake\\"},{\\"itemHrid\\":\\"/items/star_fruit_gummy\\"},{\\"itemHrid\\":\\"/items/star_fruit_yogurt\\"}]},\\"drinks\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/wisdom_coffee\\"},{\\"itemHrid\\":\\"/items/super_magic_coffee\\"},{\\"itemHrid\\":\\"/items/channeling_coffee\\"}]},\\"abilities\\":[{\\"abilityHrid\\":\\"/abilities/insanity\\",\\"level\\":\\"70\\"},{\\"abilityHrid\\":\\"/abilities/elemental_affinity\\",\\"level\\":\\"100\\"},{\\"abilityHrid\\":\\"/abilities/frost_surge\\",\\"level\\":\\"100\\"},{\\"abilityHrid\\":\\"/abilities/mana_spring\\",\\"level\\":\\"101\\"},{\\"abilityHrid\\":\\"/abilities/water_strike\\",\\"level\\":\\"100\\"}],\\"triggerMap\\":{\\"/abilities/elemental_affinity\\":[],\\"/abilities/frost_surge\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/number_of_active_units\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":3000}],\\"/abilities/insanity\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1000}],\\"/abilities/mana_spring\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/number_of_active_units\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":3000}],\\"/abilities/water_strike\\":[],\\"/items/critical_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/critical_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/critical_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/spaceberry_cake\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":350}],\\"/items/spaceberry_donut\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":700}],\\"/items/star_fruit_yogurt\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":350}],\\"/items/ultra_attack_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/attack_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_magic_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/magic_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/star_fruit_gummy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}],\\"/items/wisdom_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/wisdom_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/super_magic_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/magic_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/channeling_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/channeling_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}]},\\"zone\\":\\"/actions/combat/fly\\",\\"simulationTime\\":\\"2\\",\\"houseRooms\\":{\\"/house_rooms/archery_range\\":8,\\"/house_rooms/armory\\":8,\\"/house_rooms/brewery\\":8,\\"/house_rooms/dairy_barn\\":8,\\"/house_rooms/dining_room\\":8,\\"/house_rooms/dojo\\":8,\\"/house_rooms/forge\\":8,\\"/house_rooms/garden\\":8,\\"/house_rooms/gym\\":8,\\"/house_rooms/kitchen\\":8,\\"/house_rooms/laboratory\\":8,\\"/house_rooms/library\\":8,\\"/house_rooms/log_shed\\":8,\\"/house_rooms/mystical_study\\":8,\\"/house_rooms/observatory\\":8,\\"/house_rooms/sewing_parlor\\":8,\\"/house_rooms/workshop\\":8},\\"achievements\\":{\\"/achievements/bestiary_points_100\\":true,\\"/achievements/bestiary_points_20\\":true,\\"/achievements/bestiary_points_200\\":true,\\"/achievements/bestiary_points_40\\":true,\\"/achievements/bestiary_points_400\\":true,\\"/achievements/brew_gourmet_tea\\":true,\\"/achievements/brew_ultra_magic_coffee\\":true,\\"/achievements/build_room_level_1\\":true,\\"/achievements/build_room_level_3\\":true,\\"/achievements/build_room_level_6\\":true,\\"/achievements/build_room_level_8\\":true,\\"/achievements/buy_trainee_charm\\":true,\\"/achievements/cheesesmith_azure_tool\\":true,\\"/achievements/clear_chimerical_den\\":true,\\"/achievements/clear_enchanted_fortress\\":true,\\"/achievements/clear_pirate_cove\\":true,\\"/achievements/clear_sinister_circus\\":true,\\"/achievements/clear_t1_dungeon_10_times\\":true,\\"/achievements/coinify_coins_1m\\":true,\\"/achievements/collect_branch_of_insight\\":true,\\"/achievements/collect_butter_of_proficiency\\":true,\\"/achievements/collect_thread_of_expertise\\":true,\\"/achievements/collection_points_100\\":true,\\"/achievements/collection_points_1000\\":true,\\"/achievements/collection_points_200\\":true,\\"/achievements/collection_points_2000\\":true,\\"/achievements/collection_points_500\\":true,\\"/achievements/complete_tutorial\\":true,\\"/achievements/cook_apple_gummy\\":true,\\"/achievements/cook_peach_yogurt\\":true,\\"/achievements/cook_spaceberry_cake\\":true,\\"/achievements/craft_celestial_tool_or_outfit\\":true,\\"/achievements/craft_dungeon_equipment\\":true,\\"/achievements/craft_jewelry\\":true,\\"/achievements/craft_master_charm\\":true,\\"/achievements/craft_wooden_bow\\":true,\\"/achievements/decompose_bamboo_gloves\\":true,\\"/achievements/defeat_chronofrost_sorcerer\\":true,\\"/achievements/defeat_crystal_colossus\\":true,\\"/achievements/defeat_demonic_overlord_t1\\":true,\\"/achievements/defeat_dusk_revenant\\":true,\\"/achievements/defeat_gobo_chieftain\\":true,\\"/achievements/defeat_jerry\\":true,\\"/achievements/defeat_jerry_t5\\":true,\\"/achievements/defeat_luna_empress\\":true,\\"/achievements/defeat_marine_huntress\\":true,\\"/achievements/defeat_red_panda\\":true,\\"/achievements/defeat_shoebill\\":true,\\"/achievements/defeat_stalactite_golem_t5\\":true,\\"/achievements/defeat_the_watcher\\":true,\\"/achievements/enhance_level_80_to_10\\":true,\\"/achievements/enhance_level_90_to_10\\":true,\\"/achievements/enhance_to_10\\":true,\\"/achievements/enhance_to_3\\":true,\\"/achievements/enhance_to_6\\":true,\\"/achievements/equip_expert_task_badge\\":true,\\"/achievements/equip_ginkgo_weapon\\":true,\\"/achievements/gather_milk\\":true,\\"/achievements/learn_ability\\":true,\\"/achievements/learn_special_ability\\":true,\\"/achievements/refine_dungeon_equipment\\":true,\\"/achievements/tailor_gluttonous_or_guzzling_pouch\\":true,\\"/achievements/tailor_medium_pouch\\":true,\\"/achievements/tailor_umbral_tunic\\":true,\\"/achievements/task_tokens_10\\":true,\\"/achievements/total_level_100\\":true,\\"/achievements/total_level_1000\\":true,\\"/achievements/total_level_1500\\":true,\\"/achievements/total_level_1800\\":true,\\"/achievements/total_level_250\\":true,\\"/achievements/total_level_500\\":true,\\"/achievements/transmute_philosophers_stone\\":true,\\"/achievements/woodcut_arcane_tree\\":true}}","4":"{\\"player\\":{\\"attackLevel\\":138,\\"magicLevel\\":146,\\"meleeLevel\\":100,\\"rangedLevel\\":100,\\"defenseLevel\\":130,\\"staminaLevel\\":125,\\"intelligenceLevel\\":130,\\"equipment\\":[{\\"itemLocationHrid\\":\\"/item_locations/head\\",\\"itemHrid\\":\\"/items/magicians_hat_refined\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/body\\",\\"itemHrid\\":\\"/items/royal_water_robe_top_refined\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/legs\\",\\"itemHrid\\":\\"/items/royal_water_robe_bottoms_refined\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/feet\\",\\"itemHrid\\":\\"/items/sorcerer_boots\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/hands\\",\\"itemHrid\\":\\"/items/chrono_gloves\\",\\"enhancementLevel\\":12},{\\"itemLocationHrid\\":\\"/item_locations/main_hand\\",\\"itemHrid\\":\\"/items/rippling_trident_refined\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/off_hand\\",\\"itemHrid\\":\\"/items/bishops_codex_refined\\",\\"enhancementLevel\\":14},{\\"itemLocationHrid\\":\\"/item_locations/pouch\\",\\"itemHrid\\":\\"/items/guzzling_pouch\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/back\\",\\"itemHrid\\":\\"/items/enchanted_cloak_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/neck\\",\\"itemHrid\\":\\"/items/philosophers_necklace\\",\\"enhancementLevel\\":7},{\\"itemLocationHrid\\":\\"/item_locations/earrings\\",\\"itemHrid\\":\\"/items/philosophers_earrings\\",\\"enhancementLevel\\":7},{\\"itemLocationHrid\\":\\"/item_locations/ring\\",\\"itemHrid\\":\\"/items/philosophers_ring\\",\\"enhancementLevel\\":7},{\\"itemLocationHrid\\":\\"/item_locations/charm\\",\\"itemHrid\\":\\"/items/advanced_cooking_charm\\",\\"enhancementLevel\\":3}]},\\"food\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/spaceberry_cake\\"},{\\"itemHrid\\":\\"/items/star_fruit_gummy\\"},{\\"itemHrid\\":\\"/items/star_fruit_yogurt\\"}]},\\"drinks\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/ultra_magic_coffee\\"},{\\"itemHrid\\":\\"/items/ultra_attack_coffee\\"},{\\"itemHrid\\":\\"/items/channeling_coffee\\"}]},\\"abilities\\":[{\\"abilityHrid\\":\\"/abilities/speed_aura\\",\\"level\\":\\"60\\"},{\\"abilityHrid\\":\\"/abilities/frost_surge\\",\\"level\\":\\"90\\"},{\\"abilityHrid\\":\\"/abilities/mana_spring\\",\\"level\\":\\"101\\"},{\\"abilityHrid\\":\\"/abilities/smoke_burst\\",\\"level\\":\\"90\\"},{\\"abilityHrid\\":\\"/abilities/water_strike\\",\\"level\\":\\"100\\"}],\\"triggerMap\\":{\\"/abilities/elemental_affinity\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":2600}],\\"/abilities/frost_surge\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1600}],\\"/abilities/mana_spring\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1000}],\\"/abilities/mystic_aura\\":[],\\"/abilities/water_strike\\":[],\\"/items/channeling_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/channeling_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/spaceberry_cake\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":450}],\\"/items/spaceberry_donut\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":350}],\\"/items/star_fruit_yogurt\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":450}],\\"/items/ultra_magic_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/magic_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/wisdom_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/wisdom_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/star_fruit_gummy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}],\\"/items/super_magic_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/magic_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_attack_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/attack_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/speed_aura\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/speed_aura\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/smoke_burst\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1}]},\\"zone\\":\\"/actions/combat/fly\\",\\"simulationTime\\":\\"2\\",\\"houseRooms\\":{\\"/house_rooms/archery_range\\":5,\\"/house_rooms/armory\\":8,\\"/house_rooms/brewery\\":5,\\"/house_rooms/dairy_barn\\":5,\\"/house_rooms/dining_room\\":8,\\"/house_rooms/dojo\\":8,\\"/house_rooms/forge\\":5,\\"/house_rooms/garden\\":5,\\"/house_rooms/gym\\":5,\\"/house_rooms/kitchen\\":5,\\"/house_rooms/laboratory\\":6,\\"/house_rooms/library\\":8,\\"/house_rooms/log_shed\\":5,\\"/house_rooms/mystical_study\\":8,\\"/house_rooms/observatory\\":8,\\"/house_rooms/sewing_parlor\\":5,\\"/house_rooms/workshop\\":6},\\"achievements\\":{\\"/achievements/bestiary_points_100\\":true,\\"/achievements/bestiary_points_20\\":true,\\"/achievements/bestiary_points_200\\":true,\\"/achievements/bestiary_points_40\\":true,\\"/achievements/bestiary_points_400\\":true,\\"/achievements/brew_gourmet_tea\\":true,\\"/achievements/brew_ultra_magic_coffee\\":true,\\"/achievements/build_room_level_1\\":true,\\"/achievements/build_room_level_3\\":true,\\"/achievements/build_room_level_6\\":true,\\"/achievements/build_room_level_8\\":true,\\"/achievements/buy_trainee_charm\\":true,\\"/achievements/cheesesmith_azure_tool\\":true,\\"/achievements/clear_chimerical_den\\":true,\\"/achievements/clear_enchanted_fortress\\":true,\\"/achievements/clear_pirate_cove\\":true,\\"/achievements/clear_sinister_circus\\":true,\\"/achievements/clear_t1_dungeon_10_times\\":true,\\"/achievements/coinify_coins_1m\\":true,\\"/achievements/collect_branch_of_insight\\":true,\\"/achievements/collect_butter_of_proficiency\\":true,\\"/achievements/collect_thread_of_expertise\\":true,\\"/achievements/collection_points_100\\":true,\\"/achievements/collection_points_1000\\":true,\\"/achievements/collection_points_200\\":true,\\"/achievements/collection_points_2000\\":true,\\"/achievements/collection_points_500\\":true,\\"/achievements/complete_tutorial\\":true,\\"/achievements/cook_apple_gummy\\":true,\\"/achievements/cook_peach_yogurt\\":true,\\"/achievements/cook_spaceberry_cake\\":true,\\"/achievements/craft_celestial_tool_or_outfit\\":true,\\"/achievements/craft_dungeon_equipment\\":true,\\"/achievements/craft_jewelry\\":true,\\"/achievements/craft_master_charm\\":true,\\"/achievements/craft_wooden_bow\\":true,\\"/achievements/decompose_bamboo_gloves\\":true,\\"/achievements/defeat_chronofrost_sorcerer\\":true,\\"/achievements/defeat_crystal_colossus\\":true,\\"/achievements/defeat_demonic_overlord_t1\\":true,\\"/achievements/defeat_dusk_revenant\\":true,\\"/achievements/defeat_gobo_chieftain\\":true,\\"/achievements/defeat_jerry\\":true,\\"/achievements/defeat_jerry_t5\\":true,\\"/achievements/defeat_luna_empress\\":true,\\"/achievements/defeat_marine_huntress\\":true,\\"/achievements/defeat_red_panda\\":true,\\"/achievements/defeat_shoebill\\":true,\\"/achievements/defeat_stalactite_golem_t5\\":true,\\"/achievements/defeat_the_watcher\\":true,\\"/achievements/enhance_level_80_to_10\\":true,\\"/achievements/enhance_level_90_to_10\\":true,\\"/achievements/enhance_to_10\\":true,\\"/achievements/enhance_to_3\\":true,\\"/achievements/enhance_to_6\\":true,\\"/achievements/equip_expert_task_badge\\":true,\\"/achievements/equip_ginkgo_weapon\\":true,\\"/achievements/gather_milk\\":true,\\"/achievements/learn_ability\\":true,\\"/achievements/learn_special_ability\\":true,\\"/achievements/refine_dungeon_equipment\\":true,\\"/achievements/tailor_gluttonous_or_guzzling_pouch\\":true,\\"/achievements/tailor_medium_pouch\\":true,\\"/achievements/tailor_umbral_tunic\\":true,\\"/achievements/task_tokens_10\\":true,\\"/achievements/total_level_100\\":true,\\"/achievements/total_level_1000\\":true,\\"/achievements/total_level_1500\\":true,\\"/achievements/total_level_1800\\":false,\\"/achievements/total_level_250\\":true,\\"/achievements/total_level_500\\":true,\\"/achievements/transmute_philosophers_stone\\":true,\\"/achievements/woodcut_arcane_tree\\":true}}","5":"{\\"player\\":{\\"attackLevel\\":125,\\"magicLevel\\":126,\\"meleeLevel\\":125,\\"rangedLevel\\":95,\\"defenseLevel\\":135,\\"staminaLevel\\":126,\\"intelligenceLevel\\":105,\\"equipment\\":[{\\"itemLocationHrid\\":\\"/item_locations/head\\",\\"itemHrid\\":\\"/items/corsair_helmet\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/body\\",\\"itemHrid\\":\\"/items/anchorbound_plate_body\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/legs\\",\\"itemHrid\\":\\"/items/anchorbound_plate_legs\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/feet\\",\\"itemHrid\\":\\"/items/polar_bear_shoes\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/hands\\",\\"itemHrid\\":\\"/items/dodocamel_gauntlets_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/two_hand\\",\\"itemHrid\\":\\"/items/griffin_bulwark_refined\\",\\"enhancementLevel\\":10},{\\"itemLocationHrid\\":\\"/item_locations/pouch\\",\\"itemHrid\\":\\"/items/guzzling_pouch\\",\\"enhancementLevel\\":6},{\\"itemLocationHrid\\":\\"/item_locations/back\\",\\"itemHrid\\":\\"/items/sinister_cape_refined\\",\\"enhancementLevel\\":7},{\\"itemLocationHrid\\":\\"/item_locations/neck\\",\\"itemHrid\\":\\"/items/necklace_of_wisdom\\",\\"enhancementLevel\\":3},{\\"itemLocationHrid\\":\\"/item_locations/earrings\\",\\"itemHrid\\":\\"/items/philosophers_earrings\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/ring\\",\\"itemHrid\\":\\"/items/philosophers_ring\\",\\"enhancementLevel\\":5},{\\"itemLocationHrid\\":\\"/item_locations/charm\\",\\"itemHrid\\":\\"/items/expert_defense_charm\\",\\"enhancementLevel\\":3}]},\\"food\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/spaceberry_donut\\"},{\\"itemHrid\\":\\"/items/spaceberry_cake\\"},{\\"itemHrid\\":\\"/items/star_fruit_yogurt\\"}]},\\"drinks\\":{\\"/action_types/combat\\":[{\\"itemHrid\\":\\"/items/ultra_defense_coffee\\"},{\\"itemHrid\\":\\"/items/ultra_stamina_coffee\\"},{\\"itemHrid\\":\\"/items/swiftness_coffee\\"}]},\\"abilities\\":[{\\"abilityHrid\\":\\"/abilities/fierce_aura\\",\\"level\\":\\"20\\"},{\\"abilityHrid\\":\\"/abilities/fracturing_impact\\",\\"level\\":\\"69\\"},{\\"abilityHrid\\":\\"/abilities/retribution\\",\\"level\\":\\"90\\"},{\\"abilityHrid\\":\\"/abilities/spike_shell\\",\\"level\\":\\"80\\"},{\\"abilityHrid\\":\\"/abilities/shield_bash\\",\\"level\\":\\"62\\"}],\\"triggerMap\\":{\\"/abilities/fierce_aura\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/fierce_aura\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/abilities/fracturing_impact\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/number_of_active_units\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/all_enemies\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1500}],\\"/abilities/retribution\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/retribution\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":500}],\\"/abilities/shield_bash\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":1000}],\\"/abilities/spike_shell\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/spike_shell\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0},{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/targeted_enemy\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/current_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":500}],\\"/items/lucky_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/lucky_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/spaceberry_cake\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":350}],\\"/items/star_fruit_gummy\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}],\\"/items/star_fruit_yogurt\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_mp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":350}],\\"/items/ultra_defense_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/defense_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_stamina_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/stamina_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/spaceberry_donut\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/missing_hp\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/greater_than_equal\\",\\"value\\":280}],\\"/items/wisdom_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/wisdom_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/super_melee_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/melee_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/swiftness_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/swiftness_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_melee_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/melee_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}],\\"/items/ultra_attack_coffee\\":[{\\"dependencyHrid\\":\\"/combat_trigger_dependencies/self\\",\\"conditionHrid\\":\\"/combat_trigger_conditions/attack_coffee\\",\\"comparatorHrid\\":\\"/combat_trigger_comparators/is_inactive\\",\\"value\\":0}]},\\"zone\\":\\"/actions/combat/fly\\",\\"simulationTime\\":\\"2\\",\\"houseRooms\\":{\\"/house_rooms/archery_range\\":2,\\"/house_rooms/armory\\":5,\\"/house_rooms/brewery\\":2,\\"/house_rooms/dairy_barn\\":2,\\"/house_rooms/dining_room\\":4,\\"/house_rooms/dojo\\":5,\\"/house_rooms/forge\\":2,\\"/house_rooms/garden\\":2,\\"/house_rooms/gym\\":4,\\"/house_rooms/kitchen\\":2,\\"/house_rooms/laboratory\\":2,\\"/house_rooms/library\\":3,\\"/house_rooms/log_shed\\":2,\\"/house_rooms/mystical_study\\":3,\\"/house_rooms/observatory\\":2,\\"/house_rooms/sewing_parlor\\":2,\\"/house_rooms/workshop\\":2},\\"achievements\\":{\\"/achievements/bestiary_points_100\\":true,\\"/achievements/bestiary_points_20\\":true,\\"/achievements/bestiary_points_200\\":true,\\"/achievements/bestiary_points_40\\":true,\\"/achievements/bestiary_points_400\\":true,\\"/achievements/brew_gourmet_tea\\":true,\\"/achievements/brew_ultra_magic_coffee\\":false,\\"/achievements/build_room_level_1\\":true,\\"/achievements/build_room_level_3\\":true,\\"/achievements/build_room_level_6\\":false,\\"/achievements/build_room_level_8\\":false,\\"/achievements/buy_trainee_charm\\":true,\\"/achievements/cheesesmith_azure_tool\\":true,\\"/achievements/clear_chimerical_den\\":true,\\"/achievements/clear_enchanted_fortress\\":true,\\"/achievements/clear_pirate_cove\\":true,\\"/achievements/clear_sinister_circus\\":true,\\"/achievements/clear_t1_dungeon_10_times\\":true,\\"/achievements/coinify_coins_1m\\":false,\\"/achievements/collect_branch_of_insight\\":true,\\"/achievements/collect_butter_of_proficiency\\":false,\\"/achievements/collect_thread_of_expertise\\":false,\\"/achievements/collection_points_100\\":true,\\"/achievements/collection_points_1000\\":false,\\"/achievements/collection_points_200\\":true,\\"/achievements/collection_points_2000\\":false,\\"/achievements/collection_points_500\\":true,\\"/achievements/complete_tutorial\\":true,\\"/achievements/cook_apple_gummy\\":true,\\"/achievements/cook_peach_yogurt\\":true,\\"/achievements/cook_spaceberry_cake\\":false,\\"/achievements/craft_celestial_tool_or_outfit\\":false,\\"/achievements/craft_dungeon_equipment\\":false,\\"/achievements/craft_jewelry\\":true,\\"/achievements/craft_master_charm\\":false,\\"/achievements/craft_wooden_bow\\":true,\\"/achievements/decompose_bamboo_gloves\\":true,\\"/achievements/defeat_chronofrost_sorcerer\\":true,\\"/achievements/defeat_crystal_colossus\\":false,\\"/achievements/defeat_demonic_overlord_t1\\":false,\\"/achievements/defeat_dusk_revenant\\":true,\\"/achievements/defeat_gobo_chieftain\\":true,\\"/achievements/defeat_jerry\\":true,\\"/achievements/defeat_jerry_t5\\":true,\\"/achievements/defeat_luna_empress\\":true,\\"/achievements/defeat_marine_huntress\\":true,\\"/achievements/defeat_red_panda\\":false,\\"/achievements/defeat_shoebill\\":true,\\"/achievements/defeat_stalactite_golem_t5\\":true,\\"/achievements/defeat_the_watcher\\":true,\\"/achievements/enhance_level_80_to_10\\":false,\\"/achievements/enhance_level_90_to_10\\":false,\\"/achievements/enhance_to_10\\":false,\\"/achievements/enhance_to_3\\":true,\\"/achievements/enhance_to_6\\":true,\\"/achievements/equip_expert_task_badge\\":true,\\"/achievements/equip_ginkgo_weapon\\":true,\\"/achievements/gather_milk\\":true,\\"/achievements/learn_ability\\":true,\\"/achievements/learn_special_ability\\":true,\\"/achievements/refine_dungeon_equipment\\":false,\\"/achievements/tailor_gluttonous_or_guzzling_pouch\\":false,\\"/achievements/tailor_medium_pouch\\":true,\\"/achievements/tailor_umbral_tunic\\":false,\\"/achievements/task_tokens_10\\":true,\\"/achievements/total_level_100\\":true,\\"/achievements/total_level_1000\\":true,\\"/achievements/total_level_1500\\":true,\\"/achievements/total_level_1800\\":false,\\"/achievements/total_level_250\\":true,\\"/achievements/total_level_500\\":true,\\"/achievements/transmute_philosophers_stone\\":false,\\"/achievements/woodcut_arcane_tree\\":false}}"}
	`);

	setPlayersNames([ "StepSlurpa", "sentientmilk", "Kiyuwu", "Metzli", "Tank" ]);

	await setStartSimulationOptions({
		"Dungeon": "Enchanted Fortress",
		"Difficulty": "T0",
		"Duration": "2",
		"Sim Dungeon": true,
	});

	await startSim();
})();


