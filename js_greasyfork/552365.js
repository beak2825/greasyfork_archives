// ==UserScript==
// @name         MaruMori Leech Suspend
// @namespace    http://marumori.io/
// @version      1.1.0
// @license      WTFPL
// @description  Provides a button on the "Recently Studied" page to quickly suspend leeches.
// @author       Eearslya Sleiarion
// @match        https://marumori.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552365/MaruMori%20Leech%20Suspend.user.js
// @updateURL https://update.greasyfork.org/scripts/552365/MaruMori%20Leech%20Suspend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const doSuspend = async (event) => {
        const button = event.target;
        try {
            button.disabled = true;
            const leeches = button.closest(".leeches");
            if (leeches === null) { return; }
            const wrapper = leeches.querySelector(".leeches_wrapper");
            if (wrapper === null) { return; }

            const kanji = wrapper.classList.contains("Kanji");

            // Fetch our list of items to suspend by checking which rows have been checked.
            const toSuspend = Array.from(leeches.querySelectorAll(".leech-item input[type=checkbox]:checked")).map((e) => e.closest(".leech-item").querySelector("td.item").innerText);
            if (toSuspend.length == 0) { alert("Select some items to suspend first!"); return; }

            // Since we don't have easy access to item IDs within the DOM, we first pull the current leech data from the API.
            // We can then cross-reference this with the items that were checked in order to determine which item IDs they're associated with.
            const request = { itemType: kanji ? "Kanji" : "Vocabulary" };
            const response = await fetch("https://api.marumori.io/study-history/leeches", { body: JSON.stringify(request), credentials: "include", method: "POST" });
            const data = await response.json();

            // Find the items we have selected within the API response to get their IDs.
            const suspendItems = data.items.filter((i) => toSuspend.includes(i.item));
            const suspendIds = suspendItems.map((i) => kanji ? i._id : i.currentForm._id);

            // A few sanity checks.
            if (suspendIds.length != toSuspend.length) {
                console.error("SANITY CHECK FAIL: Count mismatch", toSuspend, suspendIds);
                throw new Error("Sanity Check Fail");
            }
            if (suspendIds.length > 50) {
                console.error("SANITY CHECK FAIL: Too many IDs", suspendIds);
                throw new Error("Sanity Check Fail");
            }
            if (!suspendIds.every((i) => i.startsWith("Kanji/") || i.startsWith("VocabularyForms/"))) {
                console.error("SANITY CHECK FAIL: Not all IDs are Kanji or VocabularyForms", suspendIds);
                throw new Error("Sanity Check Fail");
            }

            // Submit our request to suspend the items.
            console.log("Suspending Leeches:", toSuspend);
            const suspendRequest = { items: suspendIds };
            const suspendResponse = await fetch("https://api.marumori.io/studylists/items/suspend", { body: JSON.stringify(suspendRequest), credentials: "include", method: "POST" });
            const suspendData = await suspendResponse.json();
            if (suspendData.success === true) {
                alert("Successfully suspended " + suspendIds.length + " items.");
            }
        } catch(e) {
            console.error("MM Leech Suspender Error:", e);
            alert("Something went wrong when trying to suspend. Please check the console logs and report to Eearslya.");
        } finally {
            button.disabled = false;
        }
    };

    const update = (leeches) => {
        if (leeches === null) { return; }
        if (!leeches.classList.contains("Kanji") && !leeches.classList.contains("Vocabulary")) { return; }

        const header = leeches.parentElement.querySelector(".header");
        if (header !== null) {
            const button = document.createElement("button");
            button.classList.add("button", "button_type--red", "small", "svelte-1mbo79u", "mm-leech-suspend-button");
            const buttonText = document.createElement("span");
            buttonText.innerText = "Suspend";
            button.addEventListener("click", doSuspend);

            button.appendChild(buttonText);
            header.appendChild(button);
        }
    };

    const setupCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.classList.contains("leeches_wrapper")) {
                    update(node);
                }
            }
            for (const node of mutation.removedNodes) {
                if (node.nodeType == 1 && node.classList.contains("leeches_wrapper")) {
                    document.querySelectorAll(".mm-leech-suspend-button").forEach((e) => e.remove());
                }
            }
        }
    };

    const observer = new MutationObserver(setupCallback);
    observer.observe(document.getElementById("svelte"), { childList: true, subtree: true });
})();