// ==UserScript==
// @name         Groups: Fix CSV Export "Take Action On" setting
// @namespace    https://github.com/nate-kean/
// @version      2025-09-30
// @description  Fix a bug that causes F1 to ignore your "Take action on" setting in the CSV Export in this page. I.e., you can export parents from this page now.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/groups*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551354/Groups%3A%20Fix%20CSV%20Export%20%22Take%20Action%20On%22%20setting.user.js
// @updateURL https://update.greasyfork.org/scripts/551354/Groups%3A%20Fix%20CSV%20Export%20%22Take%20Action%20On%22%20setting.meta.js
// ==/UserScript==


(async () => {
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

    function eventFired(eventName, el=document) {
        return new Promise((resolve) => {
            let listener;
            listener = el.addEventListener(eventName, (evt) => {
                resolve(evt);
                el.removeEventListener(eventName, listener);
            });
        });
    }

    // In a loop because the form has to be patched every time you open it
    while (true) {
        const form = await waitForElement("#commonActionForm");

        // Add the missing parameters to the form
        const uidSelector = form.querySelector("input[name='uidSelector']");
        const takeActionOn = document.createElement("input");
        takeActionOn.type = "hidden";
        takeActionOn.name = "takeActionOn";
        form.appendChild(takeActionOn);

        // Wire them up to be included in the form
        const dropdown = form.querySelector("#peopleListOption");
        form.addEventListener("submit", () => {
            uidSelector.value = takeActionOn.value = dropdown.selectedOptions[0].value;
            return true;
        });

        // Fix the incorrect internal names of the dropdown options
        for (const option of dropdown.querySelectorAll("option")) {
            switch (option.value) {
                case "":
                    option.value = "1LPI"; break;
                case "parents":
                    option.value = "Parents"; break;
                case "children":
                    option.value = "Children"; break;
                case "both":
                    option.value = "ParentsAndChildren"; break;
                case "all":
                    option.value = "AllFamilyMembers"; break;
                case "commParents":
                    option.value = "ParentsForCommunication"; break;
            }
        }
        await eventFired("submit", form);
    }
})();
