// ==UserScript==
// @name         Your Items CSV Exporter
// @namespace    burgerdroid.itemexporter
// @version      1.62
// @license      MIT
// @description  Copies a CSV of your displayed items to the clipboard for pasting elsewhere.
// @author       Burgerdroid
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/555054/Your%20Items%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/555054/Your%20Items%20CSV%20Exporter.meta.js
// ==/UserScript==


(function () {
    //Update this line if you are NOT using TornPDA
    const key = "###PDA-APIKEY###";

	const apiUrl = `https://api.torn.com/torn/?selections=items&key=${key}`;
	const btnStyles = document.createElement('style');
	btnStyles.innerHTML = `
	#get-values-btn, #export-btn {
		color: #EEE;
		text-shadow: 0 0 5px #000;
		background: #666;
		border: 1px solid #111;
		padding: 10px;
		margin-left: 5px;
		line-height: 1.5;
	}
	.btnOK {
		background: green !important;
	}
	.btnNotRun {
		background: red !important;
	}
	`
	document.head.appendChild(btnStyles);

	let marketValues = {};
	let sections = document.querySelectorAll('ul.items-cont');
	let activeSection = null;
	let getValuesBtn = document.createElement('button');
	let exportBtn = document.createElement('button');
	let btnDiv = document.createElement('div');
	let insertPoint = document.querySelector('div.items-wrap').firstChild;


	function getPlayerItems() {
		//find which items sections the user has actively selected
        exportBtn.className = 'btnNotRun';
		for (var i=0; i<sections.length; i++) {
			if (sections[i].style.display == 'none') {
				continue;
			}
			activeSection = sections[i];
			console.log(activeSection.id);
		}
		let csv = 'ID,Item,Category,Qty,Market Value,Total';
		let item = activeSection.firstChild;

		while (item != null) {
			let id = item.getAttribute('data-item');
			let name = item.getAttribute('data-sort');
			let category = item.getAttribute('data-category');
			let qty = item.getAttribute('data-qty');
			let itemValue = marketValues[id];
			let total = qty * itemValue;
			csv += `\n${id},${name},${category},${qty},${itemValue},${total}`;
			item = item.nextSibling;
		}
		navigator.clipboard.writeText(csv);
        exportBtn.className = 'btnOK';
        exportBtn.innerHTML = 'Copied!';
		console.log(csv);
        setTimeout(() => {
            exportBtn.className = 'btnNotRun';
            exportBtn.innerHTML = 'Export Items';
        }, "1500");

	}


	async function createPromise() {
		try {
			const response = await fetch(apiUrl, {});
			const parsedResponse = await response.json();
			return parsedResponse;
		} catch(error) {
			console.log(error)
		}
	}


	function runApiQuery() {
		getValuesBtn.innerHTML = 'Retrieving';
		getValuesBtn.disabled = true;
		createPromise().then(result => {
			getMarketValues(result);
		});
	}


	function getMarketValues(result) {
		marketValues = {};
		let keyList = Object.keys(result.items);
		for (var i=0; i<keyList.length; i++) {
			marketValues[keyList[i]] = result.items[keyList[i]].market_value;
		}
		getValuesBtn.className = 'btnOK';
		getValuesBtn.innerHTML = 'Done!';
		exportBtn.disabled = false;
		exportBtn.className = 'btnNotRun';
	}


	function init() {
		//configure the buttons and add them above the Items header.
		getValuesBtn.id = 'get-values-btn';
		getValuesBtn.innerHTML = "Get Prices";
		getValuesBtn.className = 'btnNotRun';
		getValuesBtn.addEventListener('click', runApiQuery);

		exportBtn.id = 'export-btn';
		exportBtn.innerHTML = "Export Items"
		exportBtn.className = 'btnDisabled';
		exportBtn.addEventListener('click', getPlayerItems);
		exportBtn.disabled = true;

		btnDiv.style.paddingBottom = '1em';
		btnDiv.appendChild(getValuesBtn);
		btnDiv.appendChild(exportBtn);

		insertPoint.before(btnDiv);
	}

	init();
})();
