// ==UserScript==
// @name         Ticket Template Helper
// @namespace    http://tampermonkey.net/
// @version      2026-01-11
// @description  Generate a ticket template for members who don't have it built in
// @author       Stamos
// @match        https://spog.neonova.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neonova.net
// @grant        GM_addStyle
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562320/Ticket%20Template%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562320/Ticket%20Template%20Helper.meta.js
// ==/UserScript==

(function() {
		'use strict';

		const ALL_AFFILIATES = [{
						affiliateId: "ImOn Communications",
						displayName: "ImOn",
						campaignName: "ImOn Communications Residential (IA)"
				}, {
						affiliateId: "Home Telephone ILEC",
						displayName: "Home Telecom",
						campaignName: "Home Telecom (SC)"
				}, {
						affiliateId: "TruVista Communications",
						displayName: "TruVista",
						campaignName: "TruVista (SC&GA)"
				}, {
						affiliateId: "Great Plains Communications",
						displayName: "Great Plains",
						campaignName: "Great Plains"
				}, {
						// Note: includes gonetspeed
						affiliateId: "Otelco Telecommunications, LLC",
						displayName: "Otelco + GoNetSpeed",
						campaignName: "OTelco"
				}, {
						// doubled because they have two different campaign names
						affiliateId: "Otelco Telecommunications, LLC",
						displayName: "Otelco + GoNetSpeed",
						campaignName: "GoNetSpeed (NY)"
				}, {
						affiliateId: "Bulloch Net Incorporated",
						displayName: "Bulloch",
						campaignName: "Bulloch Broadband (GA)"
				}, {
						affiliateId: "Carolina Connect",
						displayName: "Carolina Connect",
						campaignName: "Carolina Connect (SC)"
				}, {
						affiliateId: "Co-Mo Connect",
						displayName: "Co-Mo Connect",
						campaignName: "Co-Mo Connect (MO)"
				}, {
						// Note: includes coastal fiber
						affiliateId: "Darien Tel",
						displayName: "Darien + Coastal Fiber",
						campaignName: "Darien Telephone (GA)"
				}, {
						// Note: includes coastal fiber
						affiliateId: "Darien Tel",
						displayName: "Darien + Coastal Fiber",
						campaignName: "Coastal Fiber (GA)"
				}, {
						affiliateId: "Foothills",
						displayName: "Foothills",
						campaignName: "Foothills Communications (KY)"
				}, {
						affiliateId: "Paul Bunyan Communications",
						displayName: "Paul Bunyan",
						campaignName: "Paul Bunyan (MN)"
				}, {
						affiliateId: "Palmetto Rural Telephone Cooperative Inc.",
						displayName: "PRTC",
						campaignName: "PRTC - Palmetto Rural (SC)"
				}, {
						affiliateId: "Peoples Telephone Cooperative",
						displayName: "Peoples",
						campaignName: "Peoples Communications (TX)"
				},
				{
						affiliateId: "Oklahoma Fiber LLC",
						displayName: "OEC Fiber",
						campaignName: "OEC Fiber (OK)"
				}, {
						affiliateId: "Wilkes.net",
						displayName: "Riverstreet (All Orgs)",
						campaignName: "RiverStreet" // all campaigns have riverstreet in it
				}, {
						affiliateId: "TEC",
						displayName: "TEC",
						campaignName: "TEC (MS)"
				}, {
						affiliateId: "United Services, Inc.",
						displayName: "United Fiber",
						campaignName: "United Fiber (MO)"
				}, {
						affiliateId: "United Electric Cooperative Services",
						displayName: "UCS",
						campaignName: "UCS Broadband (TX)"
				}, {
						affiliateId: "West Carolina Communications",
						displayName: "West Carolina (WCTel)",
						campaignName: "WCTEL"
				}, {
						affiliateId: "West Kentucky Rural Telephone",
						displayName: "West Kentucky (WK&T)",
						campaignName: "WK&T - West Kentucky Rural (KY)"
				}];

		const LOCAL_STORAGE_API_KEY = "msal.token.keys.67b92c35-58cb-4b25-8ad7-798645265c6f";

		function copyTemplate() {
				console.log("copying template!")
				const key = JSON.parse(localStorage.getItem("msal.account.keys"))[0];
				const agentName = JSON.parse(localStorage.getItem(key)).name.replace(" (ShyftOff)", "");

				const searchParams = new URLSearchParams(window.location.search);
				const contactId = searchParams.get("contactid");

				const customerDetails = document.querySelector(`div[data-test="customer-details-card"]`);
				if (customerDetails == null) {
					console.log("Not on customer details page, not running");
					return;
				}

				// account name can be the member's campaign id, if the agent did not bring up an account (or if it is imon)
				const accountName = customerDetails.querySelector("#q-app > div > div > main > div.row.q-pb-xs > div > div > div > div.col-shrink > div > div.text-h6").innerText;

				var accountPhoneNumber = "";
				var phones = "";
				for (const strong of document.querySelectorAll('strong')) {
					if (strong.textContent.trim() === 'Known Phone Numbers') {
						const container = strong.closest('.q-card__section');
						phones = [...container.parentElement.querySelectorAll('.q-item__label')]
							.map(el => el.textContent.trim());
					}
				}
				accountPhoneNumber = phones[0];
				// warning: darien/coastal use the phone number as CPNI (agreement number, usually starts with 991)
				// skip this for them
				const campaignDropdownInput = document.querySelector(".q-field__input");
				const currentAffiliate = campaignDropdownInput.value;
				if (currentAffiliate === "Darien Telephone (GA)" || currentAffiliate === "Coastal Fiber (GA)") {
					accountPhoneNumber = "";
				}

				const serviceAddress = [...document.querySelectorAll('strong')]
					.find(el => el.textContent.trim() === 'Address')
					?.parentElement
					?.innerText
					.replace('Address', '')
					.trim()
					.replace('\n', ' ');
				
				const finishedTemplate = `Tech's Name: ${agentName}
Contact ID: ${contactId}
Account Name: ${accountName}
Account Phone Number: ${accountPhoneNumber}
Caller Name: 
Callback Number: 
Service Address: ${serviceAddress}
Reason for call: 

Call notes:


				`;

				navigator.clipboard.writeText(finishedTemplate);
		}

		function createButton() {
				// get the top right bar, where the purple ticket template button is (disabled on customer pages)
				const topBar = document.querySelector("#q-app > div > header > div > div.col.row.justify-end.items-center");
				const div = document.createElement("div");
				div.classList.add("q-pr-md");
				topBar.insertBefore(div, topBar.firstChild);

				const button = document.createElement("button");
				button.classList.add("q-btn", "q-btn-item", "non-selectable", "no-outline", 
					"q-btn--standard", "q-btn--rectangle", "bg-accent", "text-white", 
					"q-btn--actionable", "q-focusable", "q-hoverable");
				button.onclick = copyTemplate;
				div.appendChild(button);

				const span = document.createElement("span");
				span.classList.add("q-btn__content", "text-center", "col", "items-center", "q-anchor--skip", "justify-center", 
					"row", "no-wrap", "text-no-wrap");
				button.appendChild(span);

				const image = document.createElement("i");
				image.classList.add("q-icon", "notranslate", "material-icons");
				image.innerText = "content_copy";
				span.appendChild(image);
		}

		setTimeout(createButton, 1000);
})();