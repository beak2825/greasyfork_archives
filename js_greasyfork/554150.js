// ==UserScript==
// @name         Assign Interaction: warn for calls/texts if number not present
// @namespace    https://github.com/nate-kean/
// @version      20251223
// @description  Warn if you try to assign certain interactions on a profile that doesn't have a phone number.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554150/Assign%20Interaction%3A%20warn%20for%20callstexts%20if%20number%20not%20present.user.js
// @updateURL https://update.greasyfork.org/scripts/554150/Assign%20Interaction%3A%20warn%20for%20callstexts%20if%20number%20not%20present.meta.js
// ==/UserScript==

(async function() {
    const phoneCallAIDs = [
        "253", // New Visitor Connections Follow-up
        "272", // New Visitor Connections Follow-up - YOUTH
        "257", // New Visitor Communication: Phone Call
        "247", // Praise Report - ALL ACCESS
        "234", // Prayer Request - CONFIDENTIAL
        "246", // New Visitor Schedule a Visit Follow-Up
    ];

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (el) return el;
            await delay(pollingRateMs);
        }
    }

    async function elementGone(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (!el) return;
            await delay(pollingRateMs);
        }
    }

    function checkForPhoneNumber() {
        const addDetailsKeys = document.querySelectorAll(".contact-panel > .panel-body > .info-left-column > .contact-lbl");
        for (const key of addDetailsKeys) {
            if (key.textContent.trim().startsWith("Phone")) {
                return true;
            }
        }
        return false;
    }

    const modal = document.querySelector("#assignInteractionForm");

    while (true) {
        const select = modal.querySelector("#aid");
        while (!phoneCallAIDs.includes(select.value)) {
            await delay(100);
        }

        const hasPhoneNumber = checkForPhoneNumber();
        if (hasPhoneNumber) {
            await delay(100);
            continue;
        }

        const submitBtn = modal.querySelector('input[type="submit"]');
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-warning");
        const em = document.createElement("em");
        em.setAttribute("style", "margin-right: 10px; color: #110f24; opacity: .7;");
        const span = document.createElement("span");
        span.textContent = "No phone number on profile";
        em.appendChild(span);
        submitBtn.parentNode.prepend(em);

        while (phoneCallAIDs.includes(select.value)) {
            await delay(100);
        }

        submitBtn.classList.remove("btn-warning");
        submitBtn.classList.add("btn-success");
        em.remove();
    }
})();
