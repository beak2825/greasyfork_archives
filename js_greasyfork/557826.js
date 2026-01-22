// ==UserScript==
// @name         USPS Address Validation - Add/Edit Page
// @namespace    https://github.com/nate-kean/
// @version      2026.1.21
// @description  Integrate USPS address validation and autofill into the Address fields.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/555040/1739325/USPS%20Address%20Validation%20-%20Common.js
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
	// ASCII letters or the delete keys
	static #ALLOWED_KEYS = /^([\x20-\x7E])|(Backspace)|(Delete)$/;

	/** @type {(keyof Fields)[]} */
	static #REQUIRED_FIELD_NAMES = ["streetAddress", "city", "state"];

	#panel;
	#heading;
	#validator;
	#indicator;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	#timeout = undefined;
	/** @type {Fields} */
	#fields;
	/** @type {HTMLSelectElement} */
	#flagSelect;
	/** @type {string[]} */
	#streetAddressLines = [];

	/**
	 * @param {string} id
	 * @param {string} panelSelector
	 * @param {string} headingSelector
	 */
	constructor(id, panelSelector, headingSelector) {
		this.#panel = tryQuerySelector(document, panelSelector);
		this.#heading = tryQuerySelector(document, headingSelector);
		this.#validator = new Validator();
		this.#indicator = new Indicator(this.#heading);
		this.#flagSelect = this.#getFlagSelect();

		// "Starts with" selectors because the IDs are all "id" and "id2"
		// between the two address panels
		this.#fields = {
			// Want to pass these as type parameters but casting is the best I
			// can do without converting this whole thing to .ts
			streetAddress:
				/** @type {HTMLTextAreaElement} */
				(tryQuerySelector(this.#panel, 'textarea[id^="address"')),
			city:
				/** @type {HTMLInputElement} */
				(tryQuerySelector(this.#panel, 'input[id^="city"')),
			state:
				/** @type {HTMLInputElement} */
				(tryQuerySelector(this.#panel, 'input[id^="state"')),
			zip:
				/** @type {HTMLInputElement} */
				(tryQuerySelector(this.#panel, 'input[id^="zipcode"')),
			country:
				/** @type {HTMLInputElement} */
				(tryQuerySelector(this.#panel, 'input[id^="country"')),
		};

		// Fill the address if the indicator is clicked
		this.#indicator.button.addEventListener(
			"click",
			this.#fillPanel.bind(this),
			{ passive: true },
		);
		// Listen for keyboard input in this controller's address panel
		// @ts-ignore -- My TypeScript doesn't know keyup is a KeyboardEvent???
		this.#panel.addEventListener(
			"keyup",
			this.#onKeypress.bind(this),
			{ passive: true },
		);
		// Re-process the address if the Address Validation field changes
		// This <select>'s jQuery brainworms make it fire through this instead
		// of the vanilla "change" event
		$(this.#flagSelect)
			.chosen()
			.on("change", this.#processQuery.bind(this));

		this.#processQuery();
		this.#tryAutofill(id);
	}

	/**
	 * @returns {HTMLSelectElement}
	 */
	#getFlagSelect() {
		let select;
		for (const formGroup of document.querySelectorAll(".form-group")) {
			if (
				formGroup.querySelector("label")?.textContent.trim()
				!== "Address Validation"
			) {
				continue;
			}
			// Would pass HTMLSelectElement as a type parameter here if JSDoc
			// allowed it -- microsoft/TypeScript#27387
			select = tryQuerySelector(formGroup, "select");
			select.addEventListener("change", this.#processQuery.bind(this));
		}
		if (select === undefined) throw new Error("It's over");
		// @ts-ignore -- ignoring a type error caused by the above shortfall
		return select;
	}

	#fillPanel() {
		if (this.#indicator.status.code !== Validator.Code.CORRECTION) return;
		const address = this.#indicator.status.address;
		if (this.#flagSelect.value === "") {
			this.#fields.streetAddress.value = address.streetAddress;
		} else {
			this.#fields.streetAddress.value =
				`${this.#streetAddressLines[0]}\n${address.streetAddress}`;
		}
		this.#fields.city.value = address.city;
		this.#fields.state.value = address.state;
		this.#fields.zip.value = `${address.zip5}-${address.zip4}`
		// If USPS recognizes an address, we can safely assume the country is US
		this.#fields.country.value = "US";

		// Trigger F1 Primary address cascade
		this.#fields.country.dispatchEvent(new Event("input"));
		// Update the indicator
		this.#processQuery();
	}

	#processQuery() {
		const address = this.#getEnteredAddress();
		const heuristic = this.#doHeuristics(address);
		address.streetAddress = this.#normalizeStreetAddressQuery(
			address.streetAddress
		);
		this.#indicator.onTypingEnd();
		this.#validator.onNewAddressQuery(this.#indicator, address, heuristic);
	}

	/**
	 * @param {Readonly<KeyboardEvent>} evt
	 * @returns {Promise<void>}
	 */
	async #onKeypress(evt) {
		if (!AddEditPageController.#ALLOWED_KEYS.test(evt.key)) return;
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
			this.#processQuery.bind(this),
			AddEditPageController.#TYPING_WAIT_TIME_MS,
		);
	}

	/**
	 * @returns {QueriedAddress}
	 */
	#getEnteredAddress() {
		return {
			streetAddress: this.#fields.streetAddress.value,
			city:          this.#fields.city.value,
			state:         this.#fields.state.value,
			zip:           this.#fields.zip.value,
			country:       this.#fields.country.value,
		};
	}

	/**
	 * @param {string} streetAddress
	 * @returns {string[]}
	 */
	static #makeStreetAddrLines(streetAddress) {
		// Trim lines and remove blank lines.
		return streetAddress
			.split("\n")
			.map(line => line.trim())
			.filter(line => line.length > 0);
	}

	/**
	 * @param {string} streetAddress
	 * @returns {string}
	 */
	#normalizeStreetAddressQuery(streetAddress) {
		this.#streetAddressLines =
			AddEditPageController.#makeStreetAddrLines(streetAddress);
		if (this.#flagSelect.value === "") {
			return this.#streetAddressLines.join(" ");
		} else {
			return this.#streetAddressLines.toSpliced(0, 1).join(" ");
		}
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
		// Remove ?autofill-addr from the URL in your history so that this does
		// not trigger again if you go back to this page
		window.history.replaceState(null, "", url);
		this.#fillPanel();
	}

	/**
	 * @param {Readonly<QueriedAddress>} address
	 * @returns {ValResult?}
	 */
	#doHeuristics(address) {
		switch (this.#flagSelect.value) {
		case "":
			// There should not be an allcaps firstline
			if (AddEditPageController.#hasAllCapsFirstLine(address)) {
				return {
					code: Validator.Code.CHECK_FAILED,
					note: (
						"Address's first line is in all caps, but the "
						+ "Address Validation flag is not set."
					),
				};
			}
			return null;
		case "INVALID ADDRESS":
			// There should be an allcaps firstline
			// And beyond that we should not bother validating the address
			if (!AddEditPageController.#hasAllCapsFirstLine(address)) {
				return {
					code: Validator.Code.CHECK_FAILED,
					note: (
						"The Address Validation flag is set, but this "
						+ "address's first line isn't all caps."
					),
				};
			}
			return { code: Validator.Code.MARKED_INVALID };
		default:
			// There should be an allcaps firstline
			if (!AddEditPageController.#hasAllCapsFirstLine(address)) {
				return {
					code: Validator.Code.CHECK_FAILED,
					note: (
						"The Address Validation flag is set, but this "
						+ "address's first line isn't all caps."
					),
				};
			}
			return null;
		}
	}

	/**
	 * @param {Readonly<QueriedAddress>} address
	 * @returns {boolean}
	 */
	static #hasAllCapsFirstLine(address) {
		const lines = AddEditPageController.#makeStreetAddrLines(
			address.streetAddress,
		);
		return lines.length > 0 && lines[0] === lines[0].toUpperCase();
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
