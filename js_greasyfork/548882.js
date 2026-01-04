// ==UserScript==
// @name         simTriggers for Combat sim shykai
// @namespace    http://tampermonkey.net/
// @version      2025-10-08
// @description  Quick'n'dirty script for simming different trigger values in bulk
// @license MIT
// @author       sentientmilk
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548882/simTriggers%20for%20Combat%20sim%20shykai.user.js
// @updateURL https://update.greasyfork.org/scripts/548882/simTriggers%20for%20Combat%20sim%20shykai.meta.js
// ==/UserScript==

/*

	Instructions
	============

	1. Install the userscript

	2. Open DevTools (Ctrl + Shift + I)

	3. Import/fill in all characters

	4. Fill in character names.

		Characters must have different names!

		"Player 1" is also a name.

	5. Fill in triggers.

		trigger dependency, like "Enemies' Total" or something, must be present, the script only changes the number value, it does not create the triggers themself

	6. Fill in Simulation Settings, but don't run.



	Sim single abilities increments in order
	========================================

	Run the code below in DevTools Console to sim my triggers:

		simTriggers([
			["sentientmilk", "Toxic Pollen", "Enemies' Total", "Current Hp", 2000, 4000, 100],
			["sentientmilk", "Nature's Veil", "Enemies' Total", "Current Hp", 2000, 4000, 100],
			["sentientmilk", "Life Drain", "Target Enemy's", "Current Hp", 0, 2000, 100],
		]);

	Or run the code below in DevTools Console to sim your triggers:

		simTriggers([
			["Metzli", "Elemental Affinity", "Enemies' Total", "Current Hp", 0, 4000, 100],
			["Metzli", "Frost Surge", "Enemies' Total", "Current Hp", 2000, 4000, 100],
			["Metzli", "Mana Spring", "Enemies' Total", "Current Hp", 2000, 4000, 100],
		]);
	
	Notice(!) your EA, doesn't have "Enemies' Total" - you must fill it in for the script to work

	Or run the code below in DevTools Console to sim only one ability:

		simTriggers([
			["Metzli", "Frost Surge", "Enemies' Total", "Current Hp", 2000, 4000, 100],
		]);

	Options is in order:
		character - same as whats in the character tab on top
		ability - like "Frost Surge"
		triggerDependency - like "Enemies' Total"
		triggerCondition - like "Current Hp"
		valueFrom, valueTo - value from/to, both including
		valueIncrement - step

	Results will be printed in the browser console

	You can cancel all simming by cancelling the sim with "Stop Simulation" button

	Run "copy(simTriggersTSV)" to copy all the data from the last run in an Excel-friendly format

	To sim trigger combos
	=====================
	
	Run:

	simTriggersCombo([
		["sentientmilk", "Toxic Pollen", "Enemies' Total", "Current Hp", 2000, 3000, 500],
		["Metzli", "Frost Surge", "Enemies' Total", "Current Hp", 2000, 4000, 500],
	]);

	Notice! It will do a product of all combinations, so a lot of sims.
	In the example above it'll be [2000 -> 3000 by 500] - 3 steps, [2000 -> 4000 by 500] - 5 steps, that's  3 * 5 = 15 combinations

	It can do more than 2, but it'll take forever

	Run "copy(simTriggersComboTSV)" to copy all the data from the last run in an Excel-friendly format

*/

/*
	Changelog
	=========
	v2025-09-08
		- Initial version
	v2025-09-09
		- Added eph and oom
		- Added ability to export into Excel
	v2025-09-09-2
		- Added simming combos
	v2025-09-09-3
		- FIX: Removed test code
	v2025-10-08
		- Support dungeons
*/

(async function () {

	async function wait (ms=0) { return new Promise((resolve) => setTimeout(resolve, ms)); }

	function getSelectValue (select) { return Array.from(select.children).find((o) => o.value == select.value).textContent; }

	async function waitCheck (check, ms=50) {
		return new Promise(function _check (resolve) {
			if (check()) { return resolve(); }
			setTimeout(_check.bind(null, resolve), ms);
		});
	}

	async function selectCharacter (character) {
		const tabA = Array.from(document.querySelector("#playerTab").children)
			.map((li) => li.querySelector("a"))
			.find((a) => a.textContent == character);

		tabA.click();
		await wait();
	}

	async function getToTriggerValueInput (character, ability, triggerDependency, triggerCondition) {
		await selectCharacter(character);

		const abilitySelect = [1, 2, 3, 4]
			.map((i) => document.querySelector("#selectAbility_" + i))
			.find((select) => getSelectValue(select) == ability);

		const triggerBtn = abilitySelect.parentElement.parentElement.querySelector(`button[data-bs-triggertype="ability"]`);

		triggerBtn.click();
		await wait();

		const triggerI = [0, 1, 2, 3].find((i) => {
			const triggerDependencySelect = document.querySelector("#selectTriggerDependency_" + i);
			const triggerConditionSelect = document.querySelector("#selectTriggerCondition_" + i);

			return getSelectValue(triggerDependencySelect) == triggerDependency && getSelectValue(triggerConditionSelect) == triggerCondition;
		});

		const triggerValueInput = document.querySelector("#inputTriggerValue_" + triggerI);

		if (!triggerValueInput) {
			console.error(`Can't find the trigger input. Trigger ${triggerDependency} ${triggerCondition} for ${ability} ${character} does not exist!`);
		}

		return triggerValueInput;
	}

	async function getTriggerValue (character, ability, triggerDependency, triggerCondition) {
		const triggerValueInput = await getToTriggerValueInput(character, ability, triggerDependency, triggerCondition);

		const value = triggerValueInput.value;

		const closeBtn = document.querySelector(`button[data-bs-dismiss="modal"]`);
		closeBtn.click();

		return value;
	}

	async function setTriggerValue (character, ability, triggerDependency, triggerCondition, value) {
		const triggerValueInput = await getToTriggerValueInput(character, ability, triggerDependency, triggerCondition);

		triggerValueInput.value = value;
		triggerValueInput.dispatchEvent(new Event("change"));
		await wait();

		const closeBtn = document.querySelector(`button[data-bs-dismiss="modal"]`);
		closeBtn.click();
	}

	async function sim () {
		const startModalBtn = document.querySelector("#buttonSimulationSetup");
		startModalBtn.click();

		await wait();

		const startSimBtn = document.querySelector("#buttonStartSimulation");
		startSimBtn.click();

		await waitCheck(() => document.querySelector("#buttonStopSimulation").style.display == "block");
		await waitCheck(() => document.querySelector("#buttonStopSimulation").style.display == "none");
		await wait();
	}

	async function getDPS (character) {
		if (character) {
			await selectCharacter(character);
		}

		let dpsObj = {}
		Array.from(document.querySelector("#simulationResultTotalDamageDone").children)
			.forEach((row) => {
				const name = row.children[0].textContent;
				const dps = row.children[2].textContent;
				dpsObj[name] = dps;
			});
		return dpsObj;
	}

	function isDungeon () {
		return document.querySelector(`div[data-i18n="common:simulationResults.dungeonsCompleted"]`) != null;
	}

	function getEncounters () {
		return document.querySelector(`div[data-i18n="common:simulationResults.encounters"]`)?.nextElementSibling?.textContent;
	}

	function getAverageTime () {
		return document.querySelector(`div[data-i18n="common:simulationResults.averageTime"]`)?.nextElementSibling?.textContent;
	}

	async function getRanOutOfManaRatio (character) {
		if (character) {
			await selectCharacter(character);
		}
		const r = document.querySelector(`div[data-i18n="common:simulationResults.ranOutOfManaRatio"]`);

		if (r) {
			return r.nextElementSibling.textContent;
		} else {
			return false;
		}
	}

	async function simTriggers (options) {
		let stop = false;
		const stopBtn = document.querySelector("#buttonStopSimulation");
		stopBtn.onclick = () => {
			stop = true;
			stopBtn.onclick = null;
		}

		window.simTriggersTSV = ["character", "ability", "triggerDependency", "triggerCondition", "value", "totalDPS", "abilityDPS", "eph", "oom"].join("\t") + "\n";
		for (let i = 0; i < options.length; i++) {
			if (stop) {
				// When stopped between sims
				await restoreOriginalValue();
				return;
			}

			const [character, ability, triggerDependency, triggerCondition, valueFrom, valueTo, valueInc] = options[i];

			const originalValue = await getTriggerValue(character, ability, triggerDependency, triggerCondition);

			async function restoreOriginalValue () {
				await setTriggerValue(character, ability, triggerDependency, triggerCondition, originalValue);
			}

			console.log(`Start simming ${character} ${ability} ${triggerDependency} ${triggerCondition} value from ${valueFrom} to ${valueTo}`);

			for (let value = valueFrom; value <= valueTo; value += valueInc) {
				if (stop) {
					// When stopped between sims
					await restoreOriginalValue();
					return;
				}

				await setTriggerValue(character, ability, triggerDependency, triggerCondition, value);
				await sim();

				if (stop) {
					// When stopped during the sim
					await restoreOriginalValue();
					return;
				}

				const dps = await getDPS();
				const totalDPS = dps["Total"];
				const abilityDPS = dps[ability];
				const isD = isDungeon();
				const eph = getEncounters();
				const time = getAverageTime();
				const oom = await getRanOutOfManaRatio();

				console.log(`${value}: Total: ${totalDPS.padStart(6)}, DPS: ${(abilityDPS ?? "-").padStart(6)}, ${isD ? "Time: " + time.padStart(6) : "EPH: " + eph.padStart(6)}${ oom ? ", OOM! " + oom : ""}`);
				window.simTriggersTSV += [character, ability, triggerDependency, triggerCondition, value, totalDPS, (abilityDPS ?? "-"), (isD ? time : eph), (oom ?? "-")].join("\t") + "\n";
			}

			await setTriggerValue(character, ability, triggerDependency, triggerCondition, originalValue);

			console.log("");
		}

		console.log("Done all sims!");
		console.log(`Run "copy(simTriggersTSV)" to copy all the data from the last run in an Excel-friendly format`);
	}

	window.simTriggers = simTriggers;

	function linearizeCombos (options) {
		let linearOptions = [];

		let values = options.map((o) => o[4]);
		linearOptions.push(values);

		while (values.some((v, i) => v < options[i][5])) {
			values = values.slice(0);
			for (let i = options.length - 1; i >= 0; i--) {
				const o = options[i];
				const minValue = o[4];
				const maxValue = o[5];
				const increment = o[6];
				if (values[i] < maxValue) {
					values[i] += increment;
					break;
				} else {
					values[i] = minValue;
				}
			}
			linearOptions.push(values);
		}
		return linearOptions;
	}

	async function simTriggersCombo (options) {
		let stop = false;
		const stopBtn = document.querySelector("#buttonStopSimulation");
		stopBtn.onclick = () => {
			stop = true;
			stopBtn.onclick = null;
		}

		const valuesCombos = linearizeCombos(options);

		let originalValues = [];
		for (let i2 = 0; i2 < options.length; i2++) {
			const [character, ability, triggerDependency, triggerCondition, valueFrom, valueTo, valueInc] = options[i2];
			const originalValue = await getTriggerValue(character, ability, triggerDependency, triggerCondition);
			originalValues.push(originalValue);
		}

		async function restoreOriginalValues () {
			for (let i2 = 0; i2 < options.length; i2++) {
				const [character, ability, triggerDependency, triggerCondition, valueFrom, valueTo, valueInc] = options[i2];
				const originalValue = originalValues[i2];
				await setTriggerValue(character, ability, triggerDependency, triggerCondition, originalValue);
			}
		}

		console.log(`Start simming ` + options.map((o) => `${o[0]} ${o[1]} [${o[4]} -> ${o[5]}]`).join(", "));

		window.simTriggersComboTSV = [...options.map((o) => o[0] + " " + o[1]), "eph", "oom"].join("\t") + "\n";
		for (let i = 0; i < valuesCombos.length; i++) {
			if (stop) {
				await restoreOriginalValues();
				// When stopped between sims
				return;
			}

			const values = valuesCombos[i];

			for (let i2 = 0; i2 < options.length; i2++) {
				const [character, ability, triggerDependency, triggerCondition, valueFrom, valueTo, valueInc] = options[i2];
				const value = values[i2]
				await setTriggerValue(character, ability, triggerDependency, triggerCondition, value);
			}

			await sim();

			if (stop) {
				// When stopped during the sim
				await restoreOriginalValues();
				return;
			}

			const isD = isDungeon();
			const eph = getEncounters();
			const time = getAverageTime();

			let ooms = []
			for (let i2 = 0; i2 < options.length; i2++) {
				const o = options[i2];
				const oom = await getRanOutOfManaRatio(o[0]);
				if (oom) {
					ooms.push(o[0] + " " + oom);
				}
			}

			const oom = ooms.join(", ");

			console.log(values.map((v) => ("" + v).padStart(6)).join(" ") + `: ` + (isD ? "Time: " + time.padStart(6) : "EPH: " + eph.padStart(6)) + (oom ? ", OOM! " + oom : ""));
			window.simTriggersComboTSV += [...values.map((v) => v), (isD ? time : eph), (oom ?? "-")].join("\t") + "\n";
		}

		await restoreOriginalValues();

		console.log("Done all sims!");
		console.log(`Run "copy(simTriggersComboTSV)" to copy all the data from the last run in an Excel-friendly format`);
	}

	window.simTriggersCombo = simTriggersCombo;

})();
