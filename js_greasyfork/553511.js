// ==UserScript==
// @name         My Interactions notification bubble
// @namespace    https://github.com/nate-kean/
// @version      20251123
// @description  Add a notification bubble to the navbar for outstanding Interactions assigned to you.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553511/My%20Interactions%20notification%20bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/553511/My%20Interactions%20notification%20bubble.meta.js
// ==/UserScript==

(async function() {
        document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-notification-bubble-click-passthrough">
            .notification-count-holder {
                pointer-events: none;
            }
        </style>
    `);

    async function getMOICount() {
        if (window.location.pathname === "/interactions") {
            // Don't request the My Interactions page if you're already there
            return parseInt(document.querySelector(".group-grand-total").textContent);
        }

        const response = await fetch("https://jamesriver.fellowshiponego.com/interactions");
        if (response.status !== 200) {
            return 0;
        }
        const htmlText = await response.text();
        const indexStart = htmlText.indexOf('group-grand-total">') + 'group-grand-total">'.length;
        if (indexStart === -1) {
            console.error("Failed to parse My Interactions page: couldn't find start of count.");
            return 0;
        }
        const indexEnd = htmlText.indexOf("</span>", indexStart);
        if (indexEnd === -1 || indexEnd - indexStart > 3) {
            // Assuming, hopefully, that it looking like there are more than 999 outstanding
            // interactions assigned to you would always be an error
            console.error("Failed to parse My Interactions page: couldn't find end of count.");
            return 0;
        }
        const count = parseInt(htmlText.substring(indexStart, indexEnd));
        window.localStorage.setItem("ndkMyOutstandingInteractionsCount", count);
        return count;
    }

    const cachedCount = window.localStorage.getItem("ndkMyOutstandingInteractionsCount") ?? 0;

    const navIconContainer = document.querySelector("header .desktop-icons");
        const miContainer = document.createElement("div");
        miContainer.id = "nates-my-interactions-notification-icon";
        miContainer.classList.add("header-icon");
            const bubble = document.createElement("div");
                bubble.classList.add("notification-count-holder", "invisible");
                const countEl = document.createElement("div");
                    countEl.classList.add("notification-count");
                    countEl.textContent = cachedCount;
                bubble.appendChild(countEl);
            miContainer.appendChild(bubble);
            const a = document.createElement("a");
            a.href = "/interactions";
                const icon = document.createElement("i");
                icon.classList.add("fas", "fa-comments-alt");
                icon.setAttribute("data-placement", "bottom");
                icon.setAttribute("data-original-title", "My Interactions");
                icon.setAttribute("data-toggle", "tooltip");
                $(icon).tooltip();
            a.appendChild(icon);
        miContainer.appendChild(a);

        if (cachedCount > 0) {
            bubble.classList.remove("invisible");
        }
    navIconContainer.prepend(miContainer);

    const newCount = await getMOICount();
    countEl.textContent = newCount;
    if (newCount > 0) {
        bubble.classList.remove("invisible");
    } else {
        bubble.classList.add("invisible");
    }
})();
