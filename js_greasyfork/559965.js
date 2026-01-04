// ==UserScript==
// @name         Individual: add "Apply Address to All" button
// @namespace    https://github.com/nate-kean/
// @version      2025.12.23
// @description  Apply an address to the whole family in one click, even if they're not the Primary.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559965/Individual%3A%20add%20%22Apply%20Address%20to%20All%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/559965/Individual%3A%20add%20%22Apply%20Address%20to%20All%22%20button.meta.js
// ==/UserScript==

(async function() {
    // Don't do anything if the profile doesn't have an address,
    // isn't in a family, or is in a family of 1
    if (
        document.querySelector(".address-panel") === null
        || document
            .querySelector(".family-panel > .panel-body > .container")
            ?.children?.length <= 1
    ) {
        return;
    }

    const PARAM_NAMES = [
        "addressLabel",
        "address",
        "city",
        "state",
        "zipcode",
        "country",
        "addressStartMonth",
        "addressEndMonth",
        "address2Label",
        "address2",
        "city2",
        "state2",
        "zipcode2",
        "country2",
        "addressStart2Month",
        "addressEnd2Month",
        "addressStartDate",
        "addressEndDate",
        "address2StartDate",
        "address2EndDate",
    ];

    async function fetchMember(uid) {
        const response = await fetch(`/api/people/${uid}`);
        const json = await response.json();
        return json.data;
    }

    async function setAddress(targetUID, source) {
        const params = {};
        for (const paramName of PARAM_NAMES) {
            if (
                source[paramName] === ""
                || source[paramName] === undefined
                || source[paramName] === null
            ) continue;
            params[paramName] = source[paramName];
        }
        await fetch(`/api/people/${targetUID}`, {
            method: "POST",
            body: new URLSearchParams(params),
        });
    }

    async function doThing() {
        const path = window.location.pathname.split("/");
        const uid = path.at(-1);
        const source = await fetchMember(uid);
        const promises = [];
        for (const fam of source.family) {
            promises.push(setAddress(fam.uid, source));
        }
        await Promise.all(promises);
    }

    // Create the button
    const btn = document.createElement("a");
    btn.id = "nates-address-applier";
    btn.href = "#";
    btn.addEventListener("click", async (evt) => {
        await doThing();
        window.location.reload();
    });
    btn.classList.add("groupOption", "profile-action");

    // Create the icon inside the button
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-address-book");
    btn.appendChild(icon);

    // Create the extra wrapper elements that all the buttons in this
    // row have and put it all into the left end of the row
    const row = document.querySelector(".common-action-icon-row");
    const outerSpan = document.createElement("span");
    const innerSpan = document.createElement("span");
    innerSpan.setAttribute("data-toggle", "tooltip");
    innerSpan.setAttribute("data-container", "body");
    innerSpan.setAttribute("data-original-title", "Apply Address to Family");
    $(innerSpan).tooltip();
    innerSpan.appendChild(btn);
    outerSpan.appendChild(innerSpan);
    row.prepend(outerSpan);
})();
