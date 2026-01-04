// ==UserScript==
// @name         Assign Interaction: warn for Cookie Visit if address not present
// @namespace    https://github.com/nate-kean/
// @version      20251103
// @description  Warn if you try to assign New Visitor Cookie Visit interaction on a profile that doesn't have an address.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554151/Assign%20Interaction%3A%20warn%20for%20Cookie%20Visit%20if%20address%20not%20present.user.js
// @updateURL https://update.greasyfork.org/scripts/554151/Assign%20Interaction%3A%20warn%20for%20Cookie%20Visit%20if%20address%20not%20present.meta.js
// ==/UserScript==

(async function() {
    const AID_NV_COOKIE_VISIT = "258";

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function checkForValidAddress() {
        const addressPanel = document.querySelector(".address-panel");
        if (addressPanel === null) return false;

        const detailsP = addressPanel.querySelector(".panel-body > .info-right-column > .address-details > p");
        const streetAddressEl = detailsP.children[0];
        if (streetAddressEl.textContent.trim().length === 0) return false;

        const line2 = detailsP.children[1].textContent.trim();
        if (line2.length === 0) return false;

        const addDetailsKeys = document.querySelectorAll(".other-panel > .panel-body > .info-left-column > .other-lbl");
        for (const key of addDetailsKeys) {
            if (key.textContent.trim() === "Address Validation") {
                return false;
            }
        }
        return true;
    }

    const modal = document.querySelector("#assignInteractionForm");

    while (true) {
        const select = modal.querySelector("#aid");
        while (select.value !== AID_NV_COOKIE_VISIT) {
            await delay(100);
        }

        const hasValidAddress = checkForValidAddress();
        if (hasValidAddress) {
            await delay(100);
            continue;
        }

        const submitBtn = modal.querySelector('input[type="submit"]');
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-warning");
        const em = document.createElement("em");
        em.setAttribute("style", "margin-right: 10px; color: #110f24; opacity: .7;");
        const span = document.createElement("span");
        span.textContent = "Missing or invalid address on profile";
        em.appendChild(span);
        submitBtn.parentNode.prepend(em);

        while (select.value === AID_NV_COOKIE_VISIT) {
            await delay(100);
        }

        submitBtn.classList.remove("btn-warning");
        submitBtn.classList.add("btn-success");
        em.remove();
    }
})();
