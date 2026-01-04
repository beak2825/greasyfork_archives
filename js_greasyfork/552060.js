// ==UserScript==
// @name         Relationship to JRC Date: add Today button
// @namespace    https://github.com/nate-kean/
// @version      20251217
// @description  Add a button to the Relationship to JRC Date field that sets it to today's date.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/554804/1689525/Nate%27s%20Day%20Button.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552060/Relationship%20to%20JRC%20Date%3A%20add%20Today%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/552060/Relationship%20to%20JRC%20Date%3A%20add%20Today%20button.meta.js
// ==/UserScript==

(async function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-today-button-css">
            .nates-day-button.today {
                float: right;
                margin-top: -2px;
            }
        </style>
    `);

    const FIELDS = [
        "Relationship to JRC Date",
        "Address Updated Date",
    ];

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getDateString() {
        return new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        }).format(new Date());
    }

    for (const formGroup of document.querySelectorAll(".additional-info-panel .form-group")) {
        const name = formGroup.querySelector("label")?.textContent.trim();
        if (!FIELDS.includes(name)) continue;
        const btn = document.createElement("button");
        btn.classList.add("nates-day-button", "today");
        btn.textContent = "Today";
        btn.type = "button";
        btn.addEventListener("click", () => {
            formGroup.querySelector("input").value = getDateString();
        }, { passive: true });
        formGroup.prepend(btn);
    }
})();
