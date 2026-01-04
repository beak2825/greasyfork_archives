// ==UserScript==
// @name         Address: add link to directions from church
// @namespace    https://github.com/nate-kean/
// @version      20251211.2
// @description  Add a new link under the profile's address to directions from the profile's campus to them, to make it easier to see how far they are.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551351/Address%3A%20add%20link%20to%20directions%20from%20church.user.js
// @updateURL https://update.greasyfork.org/scripts/551351/Address%3A%20add%20link%20to%20directions%20from%20church.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-directions-link-css">
            .nates-directions-link {
                display: inline-block;
                margin-top: .5em;
            }
        </style>
    `);

    // This is the Google account I was to use. Usually it's 0
    const googleUserNum = 1;

    const churchAddresses = {
        "Joplin Campus": "James+River+Church+-+Joplin+Campus",
        "North Campus": "James+River+Church+-+North+Campus",
        "South Campus": "James+River+Church+-+South,+North+19th+Street,+Ozark,+MO",
        "West Campus": "James+River+Church+-+West+Campus",
    };

    // Get the profile's campus
    // If not found, default to South
    let campusName = "South Campus";
    const additionalDetailsEntries = document.querySelectorAll(".other-panel > .panel-body > .info-right-column > .other-details");
    for (const entry of additionalDetailsEntries) {
        if (entry.textContent.includes("Campus") && entry.textContent !== "Online Campus") {
            campusName = entry.textContent.trim();
            continue;
        }
    }

    // Create a new link from the address
    for (const addressAnchor of document.querySelectorAll(".info-details.address-details > p > a")) {
        const originalURL = new URL(addressAnchor.href);
        const address = originalURL.searchParams.get("q").replaceAll(" ", "+");
        const newURL = `https://www.google.com/maps/dir/${churchAddresses[campusName]}/${address}/?authuser=${googleUserNum}`;

        // Put the new link on the page
        const detailsP = addressAnchor.parentElement;
        const newAnchor = document.createElement("a");
        newAnchor.href = newURL;
        newAnchor.target = "_blank";
        newAnchor.textContent = "Directions";
        newAnchor.classList.add("nates-directions-link");
        detailsP.appendChild(newAnchor);
    }
})();
