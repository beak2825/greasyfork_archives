// ==UserScript==
// @name            MyFitnessPal Protein Ratio
// @namespace       https://github.com/nandonakisg
// @version         2.2
// @description     Adds a "Protein Ratio" column after "Protein" with conditional formatting using Excel Accent6 and orange colors. Prevents wrapping in the first column.
// @author          nandonakis
// @match           http*://www.myfitnesspal.com/food/diary*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=myfitnesspal.com
// @grant           none
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/555675/MyFitnessPal%20Protein%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/555675/MyFitnessPal%20Protein%20Ratio.meta.js
// ==/UserScript==

(function() {
	const THRESHOLDS = {
		LOW: 10,
		MEDIUM: 15
	};

	const COLORS = {
		LOW: { bg: "#FCE5CD", text: "black" },
		MEDIUM: { bg: "#93C47D", text: "black" },
		HIGH: { bg: "#38761D", text: "white" }
	};

	const headerRow = document.querySelector('.food_container tr.meal_header');
	if (!headerRow) return;

	const indices = findColumnIndices(headerRow);
	if (indices.proteinIndex === -1) return;

	insertProteinRatioColumn(indices);
	populateProteinRatios(indices);
	sortMealsByProteinRatio(indices);
	preventTextWrapping();

	function findColumnIndices(headerRow) {
		let caloriesIndex = -1, proteinIndex = -1;
		headerRow.querySelectorAll('td').forEach((cell, index) => {
			const text = cell.textContent.toLowerCase().trim();
			if (text.includes('calories')) caloriesIndex = index;
			if (text.includes('protein') && proteinIndex === -1) proteinIndex = index;
		});
		return { caloriesIndex, proteinIndex };
	}

	function insertProteinRatioColumn(indices) {
		const rows = document.querySelectorAll('.food_container tr');
		rows.forEach(row => {
			const cells = row.querySelectorAll('td');
			if (cells.length > indices.proteinIndex) {
				const newCell = document.createElement('td');
				row.insertBefore(newCell, cells[indices.proteinIndex + 1]);
			}
		});

		indices.proteinRatioIndex = indices.proteinIndex + 1;
		if (indices.caloriesIndex > indices.proteinIndex) indices.caloriesIndex++;

		const headerCell = headerRow.querySelectorAll('td')[indices.proteinRatioIndex];
		headerCell.textContent = "Protein Ratio";
		headerCell.classList.add("alt", "nutrient-column");
	}

	function populateProteinRatios(indices) {
		const rows = document.querySelectorAll('.food_container tr');
		rows.forEach(row => {
			const cells = row.querySelectorAll('td');
			if (cells.length <= indices.proteinRatioIndex) return;

			const caloriesCell = cells[indices.caloriesIndex];
			const proteinCell = cells[indices.proteinIndex];
			if (!caloriesCell || !proteinCell) return;

			const calories = parseNumeric(caloriesCell.textContent);
			const protein = parseNumeric(proteinCell.textContent);

			if (isNaN(calories) || calories === 0 || isNaN(protein)) return;

			const ratio = Math.round((protein / calories) * 100);
			const ratioCell = cells[indices.proteinRatioIndex];
			ratioCell.textContent = ratio + "%";
			applyConditionalFormatting(ratioCell, ratio);
		});
	}

	function parseNumeric(value) {
		return parseFloat(value.replace(/,/g, ''));
	}

	function applyConditionalFormatting(cell, ratio) {
		const colors = ratio < THRESHOLDS.LOW ? COLORS.LOW
			: ratio < THRESHOLDS.MEDIUM ? COLORS.MEDIUM
			: COLORS.HIGH;

		cell.style.backgroundColor = colors.bg;
		cell.style.color = colors.text;
	}

	function sortMealsByProteinRatio(indices) {
		const mealHeaders = document.querySelectorAll('.food_container tr.meal_header');

		mealHeaders.forEach(header => {
			const foodRows = [];
			let quickToolsRow = null;
			let currentRow = header.nextElementSibling;

			while (currentRow && !currentRow.classList.contains('meal_header')) {
				const hasAddFoodLink = currentRow.querySelector('.add_food');

				if (hasAddFoodLink) {
					quickToolsRow = currentRow;
				} else if (currentRow.cells && currentRow.cells.length > indices.proteinRatioIndex) {
					const ratioCell = currentRow.cells[indices.proteinRatioIndex];
					const ratioText = ratioCell.textContent.trim();
					const ratio = parseInt(ratioText);

					if (!isNaN(ratio)) {
						foodRows.push({ row: currentRow, ratio: ratio });
					}
				}
				currentRow = currentRow.nextElementSibling;
			}

			if (foodRows.length > 0) {
				foodRows.sort((a, b) => b.ratio - a.ratio);

				let insertAfter = header;
				foodRows.forEach(item => {
					insertAfter.parentNode.insertBefore(item.row, insertAfter.nextSibling);
					insertAfter = item.row;
				});

				if (quickToolsRow) {
					insertAfter.parentNode.insertBefore(quickToolsRow, insertAfter.nextSibling);
				}
			}
		});
	}

	function preventTextWrapping() {
		document.querySelectorAll('.food_container tr td:first-child').forEach(cell => {
			cell.style.whiteSpace = "nowrap";
			cell.style.overflow = "hidden";
			cell.style.textOverflow = "ellipsis";
		});
	}
})();
