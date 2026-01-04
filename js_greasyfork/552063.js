// ==UserScript==
// @name         Make profiles in Search Bar behave like real links
// @namespace    https://github.com/nate-kean/
// @version      20251106
// @description  So that you can right click them, copy their links, open them in a new tab, etc.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552063/Make%20profiles%20in%20Search%20Bar%20behave%20like%20real%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/552063/Make%20profiles%20in%20Search%20Bar%20behave%20like%20real%20links.meta.js
// ==/UserScript==

(async function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-css-for-middle-clickable-search-entries">
            ul.top-nav-autocomplete > li > a .autoCompleteNameHolder {
                color: #176bfb !important;
            }
            ul.top-nav-autocomplete > li > a:hover .autoCompleteNameHolder {
                color: #4685f2 !important;
            }
        </style>
    `);

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

    function onNewAutocompleteChildren(mutationList) {
        for (const mutation of mutationList) {
            patchEntries(mutation.addedNodes);
        }
    }

    function patchEntries(entries) {
        for (const entry of entries) {
            const nameHolder = entry.querySelector("span.autoCompleteNameHolder");
            const uid = nameHolder.textContent.split(" ").at(-1).replace("(", "").replace(")", "");
            const a = entry.querySelector("a");
            a.href = `https://jamesriver.fellowshiponego.com/members/view/${uid}`;
        }
    }

    const config = {
        childList: true,
    };
    const autocomplete = await waitForElement("ul.top-nav-autocomplete");
    const observer = new MutationObserver(onNewAutocompleteChildren);
    observer.observe(autocomplete, config);
    patchEntries(autocomplete.children);
})();
