// ==UserScript==
// @name         Add/Edit: add Last Service button to some dates
// @namespace    https://github.com/nate-kean/
// @version      2026.1.11.1
// @description  Add a button that sets its to the closest past Sunday or Wednesday, in the fields that are usually set to last service.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/554804/1689525/Nate%27s%20Day%20Button.js
// @require      https://update.greasyfork.org/scripts/559387/1730426/getRelativeWeekday.js
// @downloadURL https://update.greasyfork.org/scripts/554803/AddEdit%3A%20add%20Last%20Service%20button%20to%20some%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/554803/AddEdit%3A%20add%20Last%20Service%20button%20to%20some%20dates.meta.js
// ==/UserScript==

(async function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-last-service-button-css">
            .dates-panel .date-section {
                max-width: 750px !important;

                & .nates-day-button.last-service {
                    float: right;
                    margin-top: -2px;
                }

                & .date-holder {
                    width: 250px !important;

                    & label {
                        width: unset !important;
                    }

                    & .input-holder {
                        width: 100%;
                    }
                }
            }
        </style>
    `);

    // Overrides
    const specialDates = [
        new Date("12/6/2025"), // James River Christmas Saturday 2025
    ];

    const fieldNames = [
        "First Visit Date",
        "Baptized",
        "Salvation Date",
        "Rededication Date",
    ];


    function isSameDate(a, b) {
        return (
            a.getDate() === b.getDate()
            && a.getMonth() === b.getMonth()
            && a.getFullYear() === b.getFullYear()
        );
    }

    function getClosestServiceDate(today, lastSunday, lastWednesday) {
        for (const date of specialDates) {
            if (
                today.getFullYear() === date.getFullYear()
                && today.getMonth() === date.getMonth()
                && today.getDate() === date.getDate()
            ) {
                return date;
            }
        }
        const distSunday = today - lastSunday;
        const distWednesday = today - lastWednesday;
        return (distSunday < distWednesday || distWednesday < 0) ? lastSunday : lastWednesday;
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


    const today = new Date();
    const lastSunday =    getRelativeWeekday(today, DateDir.LAST, Day.SUNDAY,    true);
    const lastWednesday = getRelativeWeekday(today, DateDir.LAST, Day.WEDNESDAY, true);
    const lastServiceDate = getClosestServiceDate(today, lastSunday, lastWednesday);
    const buttonName = (isSameDate(today, lastServiceDate)) ? "Today" : "Last Service";
    const dateString = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    }).format(lastServiceDate);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStringYesterday = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    }).format(yesterday);

    for (const formGroup of document.querySelectorAll(".form-group")) {
        if (!fieldNames.includes(formGroup.querySelector("label")?.textContent.trim())) {
            continue;
        }
        const btn = document.createElement("button");
        btn.classList.add("nates-day-button", "last-service");
        btn.textContent = buttonName;
        btn.type = "button";
        btn.addEventListener("click", () => {
            formGroup.querySelector("input").value = dateString;
        }, { passive: true });
        formGroup.prepend(btn);
    }

    // TODO: use MutationObserver
    while (true) {
        for (const row of document.querySelectorAll(".memberEditGroupName > :nth-child(2 of div)")) {
            if (row.classList.contains("has-last-service-button")) continue;
            row.classList.add("has-last-service-button");

            const btn = document.createElement("button");
            btn.classList.add("nates-day-button", "last-service");
            btn.textContent = buttonName;
            btn.type = "button";
            btn.addEventListener("click", () => {
                row.querySelector("input").value = dateString;
            }, { passive: true });
        }
        await delay(100);
    }
})();
