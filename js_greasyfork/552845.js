// ==UserScript==
// @name         USPS Address Validation - View Page (legacy)
// @namespace    https://github.com/nate-kean/
// @version      20251113
// @description  Integrate USPS address validation into the Address field.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552845/USPS%20Address%20Validation%20-%20View%20Page%20%28legacy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552845/USPS%20Address%20Validation%20-%20View%20Page%20%28legacy%29.meta.js
// ==/UserScript==

// Here be dragons

(() => {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-address-validator-css">
            .address-panel {
                position: relative;
            }

            #nates-address-validation-indicator {
                float: right;
                font-size: 16px;
                font-weight: 600;
                width: 24px;
                height: 24px;
                text-align: center;
                padding-top: 4px;
            }

            #nates-address-validation-indicator.fa-check {
                color: #00c853;
            }

            #nates-address-validation-indicator.fa-exclamation {
                color: #ff8f00;
            }

            #nates-address-validation-indicator.fa-times {
                color: #c84040
            }

            #nates-address-validation-indicator + .tooltip > .tooltip-inner {
                max-width: 250px !important;
            }
        </style>
    `);

    const USPS_API_CLIENT_ID = "6mnicGgTpkmQ3gkf6Nr7Ati8NHhGc4tuGTwca3v4AsPGKIBL";
    const USPS_API_CLIENT_SECRET = "IUvAMfzOAAuDAn23yAylO1J9Y3MvE8AtDywW6SDPpvrazGmAvwOHLgJWs4Gkoy2w";

    const USPS_API_ROOT = "https://cors-proxy-mc6b.onrender.com/?url=https://apis.usps.com";

    const DEFAULT_BACKOFF = 4000;
    let backoff = DEFAULT_BACKOFF;

    const Code = Object.freeze({
        MATCH: 0,
        CORRECTION: 1,
        NOT_FOUND: 2,
        NOPE: 3,
        ERROR: 4,
        NOT_IMPL: 5,
    });

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    async function getAccessToken() {
        let accessToken = window.localStorage.getItem("natesUSPSAccessToken");
        if (accessToken === "null" || accessToken === null) {
            await regenerateToken();
            accessToken = window.localStorage.getItem("natesUSPSAccessToken");
        }
        return accessToken;
    }

    function serializeAddress(streetAddress, city, state, zip, country) {
        return `ndk ${streetAddress} ${city} ${state} ${zip} ${country}`;
    }

    function getFromCache(streetAddress, city, state, zip, country) {
        const key = serializeAddress(streetAddress, city, state, zip, country);
        const value = window.sessionStorage.getItem(key);
        return JSON.parse(value);
    }

    function sendToCache(streetAddress, city, state, zip, country, result) {
        if (result[0] === Code.ERROR || result[0] === Code.NOT_IMPL) return;
        const key = serializeAddress(streetAddress, city, state, zip, country);
        const value = JSON.stringify(result);
        window.sessionStorage.setItem(key, value);
    }

    async function validate(streetAddress, city, state, zip, country) {
        const cached = getFromCache(streetAddress, city, state, zip, country);
        if (cached !== null) return cached;
        const result = await _validate(streetAddress, city, state, zip, country);
        sendToCache(streetAddress, city, state, zip, country, result);
        return result;
    }

    async function _validate(streetAddress, city, state, zip, country) {
        // We have to check this ourselves because USPS very curiously returns
        // HTTP 400 if it's not right. (Like. why not just return a correction?)
        if (state !== state.toUpperCase()) {
            return [
                Code.CORRECTION,
                `${streetAddress.replace("\n", "<br>")}<br>${city}, <strong>${state.toUpperCase()}</strong> ${zip}`,
                1,
            ];
        }

        if (country.length == 2 && country !== "US") return [Code.NOPE, "", 0];

        // Handle being timed out on a previous page
        const prevBackoff = window.sessionStorage.getItem("ndk usps 402");
        if (prevBackoff !== null) {
            const prevBackoffDate = new Date(prevBackoff);
            const prelimBackoff = prevBackoffDate.getMilliseconds() - (new Date().getMilliseconds());
            await delay(prelimBackoff);
            window.sessionStorage.removeItem("ndk usps 402");
        }

        const accessToken = await getAccessToken();
        streetAddress = toTitleCase(streetAddress).replaceAll("#", "apartment");
        city = toTitleCase(city);
        const zipParts = zip?.split("-") ?? [];
        const zip5 = zipParts[0] ?? "";
        const zip4 = zipParts[1] ?? "";
        const params = {};
        // Only put ones on the object that are defined; empty string causes HTTP 400
        if (streetAddress) params.streetAddress = streetAddress;
        if (city) params.city = city;
        if (state) params.state = state;
        if (zip5) params.ZIPCode = zip5;
        if (zip4) params.ZIPPlus4 = zip4;
        const response = await fetch(
            `${USPS_API_ROOT}/addresses/v3/address?` + new URLSearchParams(params).toString(), {
                headers: new Headers({
                    "Authorization": "Bearer " + accessToken,
                    "Accept": "application/json",
                }),
            }
        );
        switch (response.status) {
            case 200:
                break;
            case 400: {
                const json = await response.json();
                switch (json.error.message) {
                    // A really stupid way the API will sometimes tell you "not found"
                    // instead of throwing a 404
                    case "Address Not Found":
                        return [Code.NOT_FOUND, "", 0];
                    default:
                        return [Code.ERROR, `USPS returned status code ${response.status}`, 0];
                }
            }
            case 401:
                await regenerateToken();
                return await validate(...arguments);
                break;
            case 404:
                return [Code.NOT_FOUND, "", 0];
            case 429:
            case 503: {
                // Exponential backoff retry
                const timeoutDate = new Date();
                timeoutDate.setMilliseconds(timeoutDate.getMilliseconds() + backoff);
                window.sessionStorage.setItem("ndk usps 402", timeoutDate);
                await delay(backoff);
                backoff **= 2;
                const validatePromise = await validate(...arguments);
                backoff = DEFAULT_BACKOFF;
                window.sessionStorage.removeItem("ndk usps 402");
                return await validatePromise;
            }
            default:
                return [Code.ERROR, `USPS returned status code ${response.status}`, 0];
        }
        const json = await response.json();

        let html = "<span>";
        let note = "";
        let correctionCount = 0;
        const code = json.corrections[0]?.code || json.matches[0]?.code;
        switch (code) {
            case "31":
                break;
            case "32":
                note = "Missing or incorrectly-formatted apartment, suite, or box number.";
                correctionCount++;
                break;
            case "22":
                note = json.corrections[0].text;
                correctionCount++;
                break;
            default:
                return [Code.NOT_IMPL, `Status code ${code} not implemented`];
        }
        const canonicalAddr = {
            streetAddress: toTitleCase(`${json.address.streetAddress} ${json.address.secondaryAddress}`).trim(),
            city: toTitleCase(json.address.city),
            state: json.address.state,
            zip5: json.address.ZIPCode,
            zip4: json.address.ZIPPlus4,
        };
        let new_addr = "";
        if (canonicalAddr.streetAddress === streetAddress) {
            new_addr += streetAddress;
        } else {
            new_addr += `<strong>${canonicalAddr.streetAddress}</strong>`;
            correctionCount++;
        }
        new_addr += "<br>";
        if (canonicalAddr.city === city) {
            new_addr += city;
        } else {
            new_addr += `<strong>${canonicalAddr.city}</strong>`;
            correctionCount++;
        }
        new_addr += ", ";
        if (canonicalAddr.state === state) {
            new_addr += state;
        } else {
            new_addr += `<strong>${canonicalAddr.state}</strong>`;
            correctionCount++;
        }
        new_addr += " ";
        if (canonicalAddr.zip5 === zip5 && canonicalAddr.zip4 === zip4) {
            new_addr += `${zip5}-${zip4}`;
        } else {
            new_addr += `<strong>${canonicalAddr.zip5}-${canonicalAddr.zip4}</strong>`;
            correctionCount++;
        }
        if (correctionCount > 0) {
            return [Code.CORRECTION, `<span>${new_addr}${note && `<br><i>${note}</i>`}</span>`, correctionCount];
        } else {
            return [Code.MATCH, "", 0];
        }
    }

    async function regenerateToken() {
        const response = await fetch("https://corsproxy.io/?url=https://apis.usps.com/oauth2/v3/token", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                grant_type: "client_credentials",
                scope: "addresses",
                client_id: USPS_API_CLIENT_ID,
                client_secret: USPS_API_CLIENT_SECRET,
            }),
        });
        switch (response.status) {
            case 200:
                break;
            case 429:
            case 503:
                await delay(4000);
                return await regenerateToken();
            default:
                throw Error(response);
        }
        const json = await response.json();
        window.localStorage.setItem("natesUSPSAccessToken", json.access_token);
    }

    (async () => {
        const addressPanel = document.querySelector(".address-panel");
        const heading = addressPanel.querySelector(".panel-heading");
        const icon = document.createElement("i");
        icon.id = "nates-address-validation-indicator";
        icon.setAttribute("data-toggle", "tooltip");
        icon.setAttribute("data-placement", "top");
        icon.setAttribute("data-html", "true");
        icon.classList.add("fal", "fa-spinner-third", "fa-spin");
        heading.appendChild(icon);

        const detailsP = addressPanel.querySelector(".panel-body > .info-right-column > .address-details > p");
        const streetAddressEl = detailsP.children[0];

        // If the individual has an Address Validation flag, ignore the first line of the street address,
        // because it's probably a message about the address.
        const addDetailsKeys = document.querySelectorAll(".other-panel > .panel-body > .info-left-column > .other-lbl");
        let streetAddrStartIndex = 0;
        for (const key of addDetailsKeys) {
            if (key.textContent.trim() === "Address Validation" && streetAddressEl.childNodes.length > 1) {
                // Skip first two nodes within the street address element:
                // The address validation message, and the <br /> underneath it.
                streetAddrStartIndex = 2;
                break;
            }
        }
        // Construct the street address, ignoring beginning lines if the above block says to,
        // and using spaces instead of <br />s or newlines.
        let streetAddress = "";
        for (let i = streetAddrStartIndex; i < streetAddressEl.childNodes.length; i++) {
            streetAddress += streetAddressEl.childNodes[i].textContent.trim();
            if (i + 1 !== streetAddressEl.childNodes.length) {
                streetAddress += " ";
            }
        }

        const line2 = detailsP.children[1].textContent.trim();
        const line2Chunks = line2.split(",");
        const city = line2Chunks[0];
        const [state, zip] = line2Chunks[1].trim().split(" ");
        const country = detailsP.children[2].textContent.trim();
        const [code, message, correctionCount] = await validate(streetAddress, city, state, zip, country);

        let tooltipContent = "";

        icon.classList.remove("fa-spinner-third", "fa-spin");
        switch (code) {
            case Code.MATCH:
                icon.classList.add("fa-check");
                tooltipContent = "USPS — Verified valid";
                break;
            case Code.CORRECTION:
                icon.classList.add("fa-exclamation");
                tooltipContent = `USPS — Correction${correctionCount > 1 ? "s" : ""} suggested:<br>${message}`;
                break;
            case Code.NOT_FOUND:
                icon.classList.add("fa-times");
                tooltipContent = "USPS — Address not found";
                break;
            case Code.NOPE:
                icon.classList.add("fa-circle");
                tooltipContent = "USPS validation skipped: incompatible country";
                break;
            case Code.ERROR:
                icon.classList.add("fa-times");
                tooltipContent = `ERROR: ${message}. Contact Nate`;
                break;
            case Code.NOT_IMPL:
                icon.classList.add("fa-exclamation");
                tooltipContent = `ERROR: ${message}. Contact Nate`;
                break;
            default:
                icon.classList.add("fa-times");
                tooltipContent = "PLUGIN ERROR: contact Nate";
                break;
        }
        icon.setAttribute("data-original-title", tooltipContent);

        // Imbue this element with a jquery tooltip through the data- attributes we added
        $(icon).tooltip();
    })();
})();
