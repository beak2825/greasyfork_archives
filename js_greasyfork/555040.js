// ==UserScript==
// @name         USPS Address Validation - Common
// @namespace    https://github.com/nate-kean/
// @version      2025.12.03.1
// @description  Library used between the Add/Edit page and the View page.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// ==/UserScript==

// @ts-check

document.head.insertAdjacentHTML("beforeend", `
	<style id="jrc-address-validator-css">
		.address-panel > .panel-heading {
			background-color: unset !important;

			& > .panel-title {
				padding-right: 50px;
				display: flex;
				justify-content: space-between;
			}
		}

		.address-panel > .panel-heading:has(.panel-title) {
			width: 50% !important;
		}

		button.jrc-address-validation-indicator {
			float: right;
			width:  32px;
			height: 32px;
			text-align: center;
			padding: 0;
			border: none;
			margin-top: -4px;

			& + .tooltip > .tooltip-inner {
				max-width: 260px !important;
			}

			& > i {
				margin-top: 3px;
				font-size: 16px;
				font-weight: 600;
			}

			& > i.fa-check {
				color: #00c853;
			}
			& > i.fa-exclamation {
				color: #ff8f00;
				background-color: hsla(0, 0%, 100%, .1);
				border-radius: 6px;
				transition: background-color 100ms;
			}
			& > i.fa-times {
				color: #c84040;
				/* This icon is just smaller than the others for some reason */
				font-size: 20px;
			}
		}

		.address-2-header > .jrc-address-validation-indicator {
			margin-right: 20px;
		}
	</style>
`);


/**
 * @typedef {Object} QueriedAddress
 * @property {string} streetAddress
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} country
 */

/**
 * @typedef {Object} CanonicalAddress
 * @property {string} streetAddress
 * @property {string} city
 * @property {string} state
 * @property {string} zip5
 * @property {string} zip4
 */


/**
 * @typedef {{
 * 		code: typeof Validator.Code.MATCH;
 * 		address: CanonicalAddress;
 * 	}
 * 	| {
 * 		code: typeof Validator.Code.CORRECTION;
 * 		addrHTML: string;
 * 		note: string | null;  // non-empty
 * 		correctionCount: number;  // non-zero
 * 		address: CanonicalAddress;
 * 	}
 * 	| {
 * 		code: typeof Validator.Code.WARNING;
 * 		note: string;  // non-empty
 * 	}
 * 	| { code: typeof Validator.Code.NOT_FOUND }
 * 	| { code: typeof Validator.Code.NOPE }
 * 	| {
 * 		code: typeof Validator.Code.VAL_ERROR;
 * 		note: string;  // non-empty
 * 	}
 * 	| {
 * 		code: typeof Validator.Code.PROG_ERROR;
 * 		note: string;  // non-empty
 * 	}
 * 	| { code: typeof Validator.Code.LOADING }
 * 	| { code: typeof Validator.Code.EMPTY }
 * 	| {
 * 		code: typeof Validator.Code.NOT_IMPL;
 * 		note: string;  // non-empty
 * 	}
 * 	| { code: typeof Validator.Code.NOT_FOUND }} ValResult
 */


/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
	return str
		.replace(
			/\w\S*/g,
			text => {
				return text.charAt(0).toUpperCase()
					+ text.substring(1).toLowerCase();
			},
		)
		.replace(/Po Box/i, "PO Box");
}


/**
 * @param {Element | Document} el
 * @param {string} selector
 * @param {{ logError: boolean }} options
 * @returns {Element}
 */
function tryQuerySelector(el, selector, options={ logError: true }) {
	const maybeEl = el.querySelector(selector);
	if (maybeEl === null) {
		if (options.logError) console.error(el);
		throw new Error(`Failed to find '${selector}' in given element`);
	}
	return maybeEl;
}


class Validator {
	static Code = Object.freeze({
		__proto__: null,
		MATCH: 0,
		CORRECTION: 1,
		WARNING: 2,
		NOT_FOUND: 3,
		NOPE: 4,
		VAL_ERROR: 5,
		PROG_ERROR: 6,
		LOADING: 7,
		EMPTY: 8,
		NOT_IMPL: 9,
	});

	static #API_ROOT = "https://addrval.onrender.com";

	static #DEFAULT_BACKOFF = 4000;
	static #backoff = Validator.#DEFAULT_BACKOFF;

	/**
	 * @type {ValResult?}
	 */
	#lastResult;

	constructor() {
		this.#lastResult = null;
	}

	/**
	 * Call when there is a new address to validate.
	 * @param {Indicator} indicator
	 * @param {QueriedAddress} address
	 * @returns {Promise<void>}
	 */
	async onNewAddressQuery(indicator, address) {
		console.trace({ address, lastResult: this.#lastResult });
		if (
			this.#lastResult !== null
			&& this.#lastResult.code === Validator.Code.CORRECTION
			&& this.#lastResult.address?.streetAddress === address.streetAddress
			&& this.#lastResult.address?.city === address.city
			&& this.#lastResult.address?.state === address.state
		) {
			const zipParts = address.zip.split("-");
			if (
				this.#lastResult.address.zip5 === zipParts[0]
				&& this.#lastResult.address.zip4 === zipParts[1]
			) {
				// Last address matches the new queried one perfectly; we can
				// skip asking USPS about it.
				if (this.#lastResult.note === null) {
					// USPS didn't have any other problems with it: it's a match!
					console.debug(" ** Correction used; availed MATCH");
					indicator.onValidationResult({
						code: Validator.Code.MATCH,
						address: this.#lastResult.address,
					});
				} else {
					// USPS still left a note; include it.
					console.debug(" ** Correction used; availed WARNING");
					indicator.onValidationResult({
						code: Validator.Code.WARNING,
						note: this.#lastResult.note,
					});
				}
				return;
			}
		}

		// Check cache. Maybe this address has been checked in this browser
		// before
		const cached = Validator.#getFromCache(address);
		if (cached !== null) {
			this.#lastResult = cached;
			indicator.onValidationResult(cached);
			return;
		};
		const result = await Validator.#validate(address);
		Validator.#sendToCache(address, result);
		this.#lastResult = result;
		indicator.onValidationResult(result);
	}

	/**
	 * @param {QueriedAddress} address
	 * @returns {Promise<ValResult>}
	 */
	static async #validate(address) {
		console.trace(address);
		let { streetAddress, city, state, zip } = address;
		const csChecksResult = Validator.#clientSideChecks(address);
		if (csChecksResult !== null) return csChecksResult;

		await Validator.#pickUpTimeout();

		// Normalize and format the address to prepare to send to USPS
		streetAddress = toTitleCase(streetAddress);
		// #'s confuse the API. Official USPS addresses will never contain #.
		// USPS will correct "apartment" to "Apt", or "Unit", or whatever else
		// it's supposed to be. We could replace #'s with "Apt " to keep from
		// confusing the API, but we also want USPS to correct it so we
		// normalize them to "apartment" instead (which is interpreted the
		// same but is never going to be in a canonical address).
		streetAddress = streetAddress.replaceAll("#", "apartment ");
		city = toTitleCase(city);
		/**
		 * @type {Record<string, string>}
		 */
		const query = { streetAddress, city, state };
		const zipParts = zip?.split("-") ?? [];
		// Only include the ZIP code if it's properly formatted (as a 5 or 5+4).
		// Otherwise the API throws an HTTP 400
		if (zipParts[0]?.length === 5) {
			query.ZIPCode = zipParts[0];
			if (zipParts[1]?.length === 4) {
				query.ZIPPlus4 = zipParts[1];
			}
		}

		const response = await fetch(
			`${Validator.#API_ROOT}/?${new URLSearchParams(query)}`
		);

		let { result: earlyResult, json } = await Validator.#parseStatus(
			response,
			address,
		);
		if (earlyResult !== null) return earlyResult;

		json = json ?? await response.json();
		console.debug(json);
		return Validator.#makeCorrectionResult(json, address, zipParts);
	}

	static async #pickUpTimeout() {
		// Handle being timed out on a previous page
		const prevBackoffDateStr = window.sessionStorage.getItem("ndk retry");
		if (prevBackoffDateStr === null) return;
		console.trace(` ** Backoff: ${prevBackoffDateStr}`);
		const prevBackoffDate = new Date(prevBackoffDateStr);
		const prelimBackoffMS = (
			prevBackoffDate.getMilliseconds()
			- (new Date().getMilliseconds())
		);
		await delay(prelimBackoffMS);
		window.sessionStorage.removeItem("ndk retry");
	}

	/**
	 * @param {Response} response
	 * @param {QueriedAddress} address
	 * @returns {Promise<{result: ValResult?, json: any?}>}
	 */
	static async #parseStatus(response, address) {
		console.debug(` ** HTTP ${response.status}`);
		switch (response.status) {
			case 200:
				const json = await response.json();
				if ("error" in json) {
					return {
						result: {
							code: Validator.Code.VAL_ERROR,
							note: json.error.message ?? "Unknown error"
						},
						json,
					}
				}
				return { result: null, json };
			case 400: {
				const json = await response.json();
				if (json?.error?.message === "Address Not Found") {
					return {
						result: { code: Validator.Code.NOT_FOUND },
						json: null,
					};
				}
				console.error(json);
				return {
					result: {
						code: Validator.Code.PROG_ERROR,
						note: "Service returned status code 400",
					},
					json: null,
				};
			}
			case 404:
				return {
					result: { code: Validator.Code.NOT_FOUND },
					json: null,
				};
			case 429:
				return {
					result: {
						code: Validator.Code.PROG_ERROR,
						note: "Rate limit exceeded. Please wait and try again.",
					},
					json: null,
				};
			case 503:
				return {
					result: await Validator.#retry(
						() => Validator.#validate(address)
					),
					json: null,
				};
			default:
				console.error(await response.json());
				return {
					result: {
						code: Validator.Code.PROG_ERROR,
						note: `USPS returned status code ${response.status}`,
					},
					json: null,
				};
		}
	}

	/**
	 * @param {any} json
	 * @param {QueriedAddress} query
	 * @param {string[]} zipParts
	 * @returns {ValResult}
	 */
	static #makeCorrectionResult(json, query, zipParts) {
		let note = "";
		let correctionCount = 0;
		const code = json.corrections[0]?.code || json.matches[0]?.code;
		switch (code) {
			case "31":
				break;
			case "32":
				note = "Missing or incorrectly-formatted apartment, suite, or "
				     + "box number.";
				correctionCount++;
				break;
			case "22":
				note = json.corrections[0].text;
				correctionCount++;
				break;
			default:
				return {
					code: Validator.Code.NOT_IMPL,
					note: `Status code ${code} not implemented`,
				};
		}
		/**
		 * @type {CanonicalAddress}
		 */
		const canon = {
			streetAddress: toTitleCase(
				`${json.address.streetAddress} ${json.address.secondaryAddress}`
			).trim(),
			city: toTitleCase(json.address.city),
			state: json.address.state,
			zip5: json.address.ZIPCode,
			zip4: json.address.ZIPPlus4,
		};
		let addrHTML = "";
		if (canon.streetAddress === query.streetAddress) {
			addrHTML += query.streetAddress;
		} else {
			addrHTML += `<strong>${canon.streetAddress}</strong>`;
			correctionCount++;
		}
		addrHTML += "<br>";
		if (canon.city === query.city) {
			addrHTML += query.city;
		} else {
			addrHTML += `<strong>${canon.city}</strong>`;
			correctionCount++;
		}
		addrHTML += ", ";
		if (canon.state === query.state) {
			addrHTML += query.state;
		} else {
			addrHTML += `<strong>${canon.state}</strong>`;
			correctionCount++;
		}
		addrHTML += " ";
		if (canon.zip5 === zipParts[0] && canon.zip4 === zipParts[1]) {
			addrHTML += `${canon.zip5}-${canon.zip4}`;
		} else {
			addrHTML += `<strong>${canon.zip5}-${canon.zip4}</strong>`;
			correctionCount++;
		}
		switch (correctionCount) {
			case 0:
				return { code: Validator.Code.MATCH, address: canon};
			case 1:
				if (code === "32") {
					return { code: Validator.Code.WARNING, note };
				}
			// [explicit fallthrough]
			default:
				return {
					code: Validator.Code.CORRECTION,
					addrHTML,
					note: note || null,  // Please no empty strings here
					correctionCount: correctionCount,
					address: canon,
				};
		}
	}

	/**
	 * Do some trivial checks that we don't need the API for clientside.
	 * @param {QueriedAddress} address
	 * @returns {ValResult?}
	 */
	static #clientSideChecks({ streetAddress, city, state, zip, country }) {
		// Missing required field
		if (!streetAddress || !city || !state) {
			return { code: Validator.Code.EMPTY };
		}

		// Non-US country code (except blank is fine)
		if (country.length > 0 && country.toUpperCase() !== "US") {
			return { code: Validator.Code.NOPE };
		}

		// Don't do other checks if we find out now that the state isn't an
		// abbreviation
		if (state.length !== 2) return null;

		const zipParts = zip.split("-");
		const zip4 = zipParts[0] ?? "";
		const zip5 = zipParts[1] ?? "";

		// State abbreviation not capitalized
		if (state !== state.toUpperCase()) {
			return {
				code: Validator.Code.CORRECTION,
				addrHTML: (
					`${streetAddress.replace("\n", "<br>")}<br>`
					+ `${city}, <strong>${state.toUpperCase()}</strong> ${zip}`
				),
				note: null,
				correctionCount: 1,
				address: { streetAddress, city, state, zip4, zip5 },
			};
		}

		// "US" but not capitalized
		if (country.length === 2 && country !== "US") {
			return {
				code: Validator.Code.CORRECTION,
				addrHTML: (
					`${streetAddress.replace("\n", "<br>")}<br>`
					+ `${city}, ${state} ${zip}<br>`
					+ country.toUpperCase()
				),
				note: null,
				correctionCount: 1,
				address: { streetAddress, city, state, zip4, zip5 },
			};
		}

		return null;
	}

	/**
	 * @param {QueriedAddress} address
	 * @returns {string}
	 */
	static #serializeAddress(address) {
		let result = "ndk ";
		for (const value of Object.values(address)) {
			result += `${value || "[blank]"} `;
		}
		return result;
	}

	/**
	 * @param {QueriedAddress} address
	 * @returns {ValResult?}
	 */
	static #getFromCache(address) {
		const key = Validator.#serializeAddress(address);
		const value = window.sessionStorage.getItem(key);
		if (value === null) {
			console.debug(" ** Cache miss", key);
			return null;
		}
		console.debug(" ** Cache hit", key);
		return JSON.parse(value);
	}

	/**
	 * @param {QueriedAddress} address
	 * @param {ValResult} result
	 * @returns {void}
	 */
	static #sendToCache(address, result) {
		if (
			result.code === Validator.Code.PROG_ERROR
			|| result.code === Validator.Code.NOT_IMPL
		) return;
		const key = Validator.#serializeAddress(address);
		const value = JSON.stringify(result);
		window.sessionStorage.setItem(key, value);
	}

	/**
	 * Exponential backoff retry
	 * @template T
	 * @param {() => Promise<T>} callback
	 * @returns {Promise<T>}
	 */
	static async #retry(callback) {
		const timeoutDate = new Date();
		timeoutDate.setMilliseconds(
			timeoutDate.getMilliseconds() + Validator.#backoff
		);
		window.sessionStorage.setItem("ndk retry", timeoutDate.toISOString());
		await delay(Validator.#backoff);
		Validator.#backoff **= 2;
		console.debug(Validator.#backoff);
		const promise = callback();
		Validator.#backoff = Validator.#DEFAULT_BACKOFF;
		window.sessionStorage.removeItem("ndk retry");
		return await promise;
	}
}


class Indicator {
	#icon;
	#buttonJQ;
	#isOnTypingCooldown;

	/**
	 * @param {Node} parent
	 */
	constructor(parent) {
		console.trace(parent);
		/**
		 * @type {ValResult}
		 */
		this.status = { code: Validator.Code.LOADING };

		this.#isOnTypingCooldown = false;

		/**
		 * @type {HTMLButtonElement}
		 */
		this.button = document.createElement("button");
		this.button.classList.add("jrc-address-validation-indicator");
		this.button.setAttribute("data-toggle", "tooltip");
		this.button.setAttribute("data-placement", "top");
		this.button.setAttribute("data-html", "true");
		this.button.type = "button";
		this.button.disabled = true;
		this.#buttonJQ = $(this.button);
		this.#buttonJQ.tooltip();

		this.#icon = document.createElement("i");
		this.#setIcon("fal", "fa-spinner-third", "fa-spin");
		this.button.appendChild(this.#icon);

		parent.appendChild(this.button);
	}

	/**
	 * @param {ValResult} result
	 * @returns {void}
	 */
	onValidationResult(result) {
		console.trace();
		// The user had kept typing, so this result is now stale and should not
		// be displayed!
		if (this.#isOnTypingCooldown) return;

		let tooltipContent = "";

		this.#icon.classList.remove("fa-spinner-third", "fa-spin");
		this.button.disabled = true;
		switch (result.code) {
			case Validator.Code.LOADING:
				this.#setIcon("fa-spinner-third", "fa-spin");
				tooltipContent = "";
				break;
			case Validator.Code.MATCH:
				this.#setIcon("fa-check");
				tooltipContent = "USPS&thinsp;—&thinsp;Verified valid";
				break;
			case Validator.Code.CORRECTION: {
				this.#setIcon("fa-exclamation");
				const s = result.correctionCount > 1 ? "s" : "";
				tooltipContent = (
					`USPS&thinsp;—&thinsp;Correction${s} suggested:<br>`
					+ `${result.addrHTML}`
				);
				if (result.note !== null) tooltipContent += `<br>${result.note}`;
				this.button.disabled = false;
				break;
			}
			case Validator.Code.WARNING:
				this.#setIcon("fa-exclamation");
				tooltipContent = `USPS&thinsp;—&thinsp;Warning:<br>${result.note}`;
				break;
			case Validator.Code.NOT_FOUND:
				this.#setIcon("fa-times");
				tooltipContent = "USPS&thinsp;—&thinsp;Address not found";
				break;
			case Validator.Code.NOPE:
				this.#setIcon("fa-circle");
				tooltipContent = "USPS validation skipped: incompatible country";
				break;
			case Validator.Code.EMPTY:
				this.#setIcon("fa-circle");
				tooltipContent = "";
				break;
			case Validator.Code.VAL_ERROR:
				this.#setIcon("fa-times");
				tooltipContent = `USPS&thinsp;—&thinsp;${result.note}`;
				break;
			case Validator.Code.PROG_ERROR:
				this.#setIcon("fa-times");
				tooltipContent = `ERROR: ${result.note}. Contact Nate`;
				break;
			case Validator.Code.NOT_IMPL:
				this.#setIcon("fa-times");
				tooltipContent = `ERROR: ${result.note}. Contact Nate`;
				break;
			default:
				this.#setIcon("fa-times");
				tooltipContent = "PLUGIN ERROR: contact Nate";
				break;
		}
		this.button.setAttribute("data-original-title", tooltipContent);
		this.status = result;
	}

	/**
	 * Set an icon class while removing all the other icon classes.
	 * @param  {...string} classNames
	 */
	#setIcon(...classNames) {
		console.debug(classNames);
		this.#icon.classList.remove(
			"fa-spinner-third", "fa-spin",
			"fa-check",
			"fa-exclamation",
			"fa-times",
			"fa-circle",
		);
		this.#icon.classList.add(...classNames);
	}

	onTypingStart() {
		console.trace();
		this.#isOnTypingCooldown = true;
		this.#setIcon("fa-spinner-third", "fa-spin");
		this.button.removeAttribute("data-original-title");
		this.button.disabled = true;
	}

	onTypingEnd() {
		console.trace();
		this.#isOnTypingCooldown = false;
	}

	onEmptyField() {
		console.trace();
		this.#isOnTypingCooldown = false;
		this.#setIcon("fa-circle");
	}
}
