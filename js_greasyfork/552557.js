// ==UserScript==
// @name         GeoGuessr Results Select All Players - FIXED
// @description  Selects all players on the results screen
// @version      1.3
// @author       miraclewhips
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        GM_addStyle
// @copyright    2024, miraclewhips (https://github.com/miraclewhips)
// @license      MIT

// @namespace https://greasyfork.org/users/1168708
// @downloadURL https://update.greasyfork.org/scripts/552557/GeoGuessr%20Results%20Select%20All%20Players%20-%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/552557/GeoGuessr%20Results%20Select%20All%20Players%20-%20FIXED.meta.js
// ==/UserScript==



/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

GM_addStyle (`
.mwrsap-button {
	border: 1px solid rgba(255,255,255,0.2);
	display: inline-block;
	padding: 5px 10px;
	border-radius: 0.375rem;
	cursor: pointer;
}
.mwrsap-button:hover,
.mwrsap-button:active {
	border: 1px solid rgba(255,255,255,0.5);
}
`);

function select(enable) {
	const table = document.getElementById('mwrsap');
	if(!table) return;

	const rows = table.querySelectorAll('div[class^="coordinate-results_row__"]');
	if(rows.length <= 1) return;

	for(let i = 1; i < rows.length; i++) {
		if(rows[i].className.includes('results_selected__') === enable) continue;
		rows[i].click();
	}
}

function selectAll() {
	select(true);
}

function selectNone() {
	select(false);
}

function init() {
	const observer = new MutationObserver(() => {
		const path = window.location.pathname;
		if(!path.includes('/results/')) return;

		const table = document.querySelector('div[class^="coordinate-results_table__"]');
		if(!table || table.id === 'mwrsap') return;

		table.id = 'mwrsap';

		const cell = table.querySelector('div[class*="coordinate-results_headerRow__"] > div:first-child');
		if(!cell) return;

		const btnAll = document.createElement('div');
		btnAll.className = 'mwrsap-button';
		btnAll.textContent = 'SELECT ALL';
		btnAll.addEventListener('click', selectAll);
		cell.appendChild(btnAll);

		const btnNone = document.createElement('div');
		btnNone.className = 'mwrsap-button';
		btnNone.textContent = 'DESELECT ALL';
		btnNone.addEventListener('click', selectNone);
		cell.appendChild(btnNone);
	});

	if(document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
		});
	}else{
		observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
	}
}

init();
