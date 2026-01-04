// ==UserScript==
// @name         USPS Address Validation - Add/Edit Page
// @namespace    https://github.com/nate-kean/
// @version      2025.12.3
// @description  Integrate USPS address validation and autofill into the Address fields.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/555040/1707051/USPS%20Address%20Validation%20-%20Common.js
// @downloadURL https://update.greasyfork.org/scripts/557826/USPS%20Address%20Validation%20-%20AddEdit%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/557826/USPS%20Address%20Validation%20-%20AddEdit%20Page.meta.js
// ==/UserScript==

// @ts-check

/**
 * Entry point for the program.
 * Holds the Add/Edit-page-specific logic for capturing addresses.
 */

/**
 * @typedef {Object} Fields
 * @property {HTMLTextAreaElement} streetAddress
 * @property {HTMLInputElement} city
 * @property {HTMLInputElement} state
 * @property {HTMLInputElement} zip
 * @property {HTMLInputElement} country
 */


class AddEditPageController {
	static #TYPING_WAIT_TIME_MS = 1_000;
	static #ASCII_PATTERN = /[0-9A-Za-z]/;

	/**
	 * @type {(keyof Fields)[]}
	 */
	static #REQUIRED_FIELD_NAMES = ["streetAddress", "city", "state"];

	#panel;
	#heading;
	#validator;
	#indicator;
	#timeout;
	#fields;

	/**
	 * @param {string} id
	 * @param {string} panelSelector
	 * @param {string} headingSelector
	 */
	constructor(id, panelSelector, headingSelector) {
		console.trace(id, panelSelector, headingSelector);
		this.#panel = tryQuerySelector(document, panelSelector);
		this.#heading = tryQuerySelector(document, headingSelector);
		this.#validator = new Validator();
		this.#indicator = new Indicator(this.#heading);
		this.#timeout = 0;
		this.#indicator.button.addEventListener(
			"click",
			this.#fillPanel.bind(this),
			{ passive: true },
		);
		this.#panel.addEventListener(
			"keyup",
			this.#onKeypress.bind(this),
			{ passive: true },
		);

		// "Starts with" selectors because the IDs are "id" and "id2" between
		// the two address panels
		/**
		 * @type {Fields}
		 */
		this.#fields = {
			streetAddress: tryQuerySelector(this.#panel, 'textarea[id^="address"'),
			city: tryQuerySelector(this.#panel, 'input[id^="city"'),
			state: tryQuerySelector(this.#panel, 'input[id^="state"'),
			zip: tryQuerySelector(this.#panel, 'input[id^="zipcode"'),
			country: tryQuerySelector(this.#panel, 'input[id^="country"'),
		};

		this.#sendQuery();
		this.#tryAutofill(id);
	}

	#fillPanel() {
		console.trace(this.#indicator.status.code);
		if (this.#indicator.status.code !== Validator.Code.CORRECTION) return;
		const address = this.#indicator.status.address;
		for (const key in address) {
			if (key === "zip5") {
				this.#fields.zip.value = `${address.zip5}-${address.zip4}`;
				continue;
			};
			if (key === "zip4") continue;
			// @ts-ignore -- types would fix this but it would be complicated
			// and i don't want to do it in jsdoc
			this.#fields[key].value = address[key];
		}
		// If USPS recognizes an address, country is US
		this.#fields.country.value = "US";
		// Trigger F1 Primary address cascade
		this.#fields.country.dispatchEvent(new Event("input"));
		// Update the indicator
		this.#sendQuery();
	}

	#sendQuery() {
		const address = this.#getEnteredAddress();
		console.trace(address);
		this.#validator.onNewAddressQuery(this.#indicator, address);
		this.#indicator.onTypingEnd();
	}

	/**
	 * @param {KeyboardEvent} evt
	 * @returns {Promise<void>}
	 */
	async #onKeypress(evt) {
		console.trace(evt.key);
		if (!AddEditPageController.#ASCII_PATTERN.test(evt.key)) return;
		console.debug(" ** Cooldown reset");
		clearTimeout(this.#timeout);
		this.#indicator.onTypingStart();
		for (const fieldName of AddEditPageController.#REQUIRED_FIELD_NAMES) {
			if (this.#fields[fieldName].value.trim().length === 0) {
				this.#indicator.onEmptyField();
				return;
			}
		}
		this.#timeout = setTimeout(
			this.#sendQuery.bind(this),
			AddEditPageController.#TYPING_WAIT_TIME_MS,
		);
	}

	/**
	 * @returns {QueriedAddress}
	 */
	#getEnteredAddress() {
		/**
		 * @type {QueriedAddress}
		 */
		const address = {};
		for (const key in this.#fields) {
			if (key == "streetAddress") {
				// @ts-ignore -- no the field definitely isnt null atp.
				// and value exists on all these types of elements too
				const lines = this.#fields.streetAddress.value.split("\n");
				address.streetAddress = AddEditPageController.normalizeStreetAddressQuery(lines);
				continue;
			}
			// @ts-ignore
			address[key] = this.#fields[key].value;
		}
		// @ts-ignore
		return address;
	}

	/**
	 * @param {string[]} streetAddrLines
	 * @returns {string}
	 */
	static normalizeStreetAddressQuery(streetAddrLines) {
		// If the individual has an Address Validation flag, ignore the first
		// line of the street address, because it's probably a message about the
		// address.
		const otherInfoFormGroups = document.querySelectorAll(
			".additional-info-panel .form-group"
		);
		let iStartStreetAddr = 0;
		if (streetAddrLines.length > 1) {
			for (const formGroup of otherInfoFormGroups) {
				const label = formGroup.querySelector("label");
				if (label?.textContent.trim() !== "Address Validation") continue;
				const select = formGroup.querySelector("select");
				// This one is actually fine if it's set to None or not selected
				if (select === null || select.selectedIndex <= 1) continue;
				// Skip first line in the text box (the addr validation comment)
				iStartStreetAddr = 1;
				break;
			}
		}
		// Construct the street address, ignoring beginning lines if the above
		// block says to, and using spaces instead of <br />s or newlines.
		let streetAddress = "";
		for (let i = iStartStreetAddr; i < streetAddrLines.length; i++) {
			const text = streetAddrLines[i];
			streetAddress += text.trim();
			if (i + 1 !== streetAddrLines.length) {
				streetAddress += " ";
			}
		}
		return streetAddress;
	}

	/**
	 * @param {string} id
	 */
	#tryAutofill(id) {
		const url = new URL(window.location.href);
		const request = url.searchParams.get("autofill-addr");
		if (request === null) return;
		if (request !== id) return;
		url.searchParams.delete("autofill-addr");
		window.history.replaceState(null, "", url);
		this.#fillPanel();
	}
}


(async () => {
	console.log("USPS Address Validator");
	new AddEditPageController(
		"1",
		".address-left-col",
		".address-panel > .panel-heading > .panel-title",
	);
	new AddEditPageController(
		"2",
		".address-right-col",
		".address-2-header",
	);
})();
