// ==UserScript==
// @name         Attendance: autoswitch
// @namespace    https://github.com/nate-kean/
// @version      2025.11.3
// @description  Switch between attendance sessions without asking.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/attendance/recent
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554675/Attendance%3A%20autoswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/554675/Attendance%3A%20autoswitch.meta.js
// ==/UserScript==

(async function() {
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

    while (true) {
        const headcountHolder = await waitForElement(".headcount-holder");

        const maybeContinueButton = await Promise.any([
            waitForElement("button[type='submit']"), // "Confirm" window pops up
            elementGone(".headcount-holder"), // User closes the attendance pane
        ]);
        if (maybeContinueButton) {
            maybeContinueButton.click();
        }
    }
})();
