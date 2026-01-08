// ==UserScript==
// @name         USPS Address Validation - View Page
// @namespace    https://github.com/nate-kean/
// @version      2026.01.08.1
// @description  Integrate USPS address validation into the Address field.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/555040/1730304/USPS%20Address%20Validation%20-%20Common.js
// @downloadURL https://update.greasyfork.org/scripts/557827/USPS%20Address%20Validation%20-%20View%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/557827/USPS%20Address%20Validation%20-%20View%20Page.meta.js
// ==/UserScript==


/**
 * Entry point for the program.
 * Holds the View-page-specific logic for capturing addresses.
 */
// @ts-check
(async () => {
	document.head.insertAdjacentHTML("beforeend", `
		<style id="jrc-address-panel-grid-reimplementation">
			/* Grid business from https://cssgrid-generator.netlify.app */
			.jrc-address-panel.address-panel > .panel-body {
				display: grid;
				grid-template-columns: auto 1fr 32px;
				grid-template-rows: repeat(2, 1fr);
				grid-column-gap: 20px;
				grid-row-gap: 1em;

				& .info-lbl, & .info-details {
					height: unset !important;
					width: unset !important;
					margin-bottom: 0 !important;
					padding-top: unset !important;
				}

				& > :nth-child(1 of .address-lbl) { grid-area: 1 / 1 / 2 / 2; }
				& > :nth-child(2 of .address-lbl) { grid-area: 2 / 1 / 3 / 2; }
				& > :nth-child(1 of .address-details) { grid-area: 1 / 2 / 2 / 3; }
				& > :nth-child(2 of .address-details) { grid-area: 2 / 2 / 3 / 3; }
				& > :nth-child(1 of .jrc-address-validation-indicator) { grid-area: 1 / 3 / 2 / 4; }
				& > :nth-child(2 of .jrc-address-validation-indicator) { grid-area: 2 / 3 / 3 / 4; }

				& > .jrc-address-validation-indicator {
					justify-self: end;
					margin-top: .5em;
				}

				&::before, &::after {
					position: absolute;
					left: 0; top: 0;
					display: none;
				}
			}
		</style>
	`);

	/**
	 * @param {number} id
	 * @param {Readonly<Element>} addressPanel
	 * @param {string} targetSelector
	 */
	function addToAddressPanel(id, addressPanel, targetSelector) {
		const validator = new Validator();
		const indicator = new Indicator(
			tryQuerySelector(addressPanel, targetSelector)
		);

		const detailsP = tryQuerySelector(
			addressPanel,
			`.panel-body :nth-child(${id} of .address-details) > p`,
		);
		const streetAddressEl = detailsP.children[0];
		const streetAddrLines = [];
		for (const child of streetAddressEl.childNodes) {
			if (!child.textContent) continue;
			streetAddrLines.push(child.textContent.trim());
		}

		const streetAddress = normalizeStreetAddressQuery(streetAddrLines);
		const line2 = detailsP.children[1].textContent.trim();
		const line2Chunks = line2.split(",");
		const city = line2Chunks[0] ?? "";
		let [state, zip] = line2Chunks[1].trim().split(" ");
		state = state ?? "";
		zip = zip ?? "";
		const country = detailsP.children[2].textContent.trim();

		validator.onNewAddressQuery(
			indicator,
			{ streetAddress, city, state, zip, country },
		);

		// Act on the correction the indicator is suggesting.
		indicator.button.addEventListener("click", () => {
			if (indicator.status.code !== Validator.Code.CORRECTION) return;
			const f1UID = window.location.pathname.split("/").at(-1);
			window.location.href =
				`/members/edit/${f1UID}?autofill-addr=${id}#addresslabel1_chosen`;
		});
	}


	/**
	 * @param {Readonly<string[]>} streetAddrLines
	 * @returns {string}
	 */
	function normalizeStreetAddressQuery(streetAddrLines) {
		// If the individual has an Address Validation flag, ignore the first
		// line of the street address, because it's probably a message about the
		// address.
		const addDetailsKeys = document.querySelectorAll(
			".other-panel > .panel-body > .info-left-column > .other-lbl"
		);
		let iStartStreetAddr = 0;
		if (streetAddrLines.length > 1) {
			for (const key of addDetailsKeys) {
				if (key.textContent.trim() !== "Address Validation") continue;
				// Skip first two nodes within the street address element:
				// The address validation message, and the <br /> underneath it.
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


	function onDocumentEnd() {
		return new Promise(resolve => {
			window.addEventListener("load", resolve);
		});
	}


	console.log("USPS Address Validator");

	/** @type {Element | undefined} */
	let addressPanel;
	try {
		addressPanel = tryQuerySelector(
			document,
			".address-panel",
			{ logError: false },
		);
	} catch (err) {
		// Exit early if profile has no address
		return;
	}

	if (document.querySelectorAll(".address-details").length === 1) {
		addToAddressPanel(1, addressPanel, ".panel-heading");
	}
	else {
		await onDocumentEnd();
		// Conduct a live refactor on F1 Go's address panel to use grid so I can
		// align two validator indicators next to each address
		addressPanel.classList.add("jrc-address-panel");

		const selector = ".address-lbl, .address-details";
		const parents = new Set();
		for (const el of document.querySelectorAll(selector)) {
			// Take the info elements out of their now-unneeded column elements
			// https://stackoverflow.com/a/66136416
			const parent = el.parentElement;
			const grandparent = parent?.parentElement;
			if (!grandparent) {
				console.error(el);
				throw new Error("Element doesn't have a grandparent");
			}
			grandparent.insertBefore(el, parent);
			parents.add(parent);
		}
		for (const parent of parents) {
			parent.remove();
		}

		addToAddressPanel(1, addressPanel, ".panel-body");
		addToAddressPanel(2, addressPanel, ".panel-body");
	}
})();
