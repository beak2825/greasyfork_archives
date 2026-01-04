// ==UserScript==
// @name         Assign Interaction: autofill due date
// @namespace    http://tampermonkey.net/
// @version      2025.12.21
// @description  Infer the due date of the interaction you're assigning.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @match        https://jamesriver.fellowshiponego.com/members/timeline/*
// @match        https://jamesriver.fellowshiponego.com/members/giving/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @require      https://update.greasyfork.org/scripts/559387/1716607/getRelativeWeekday.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559398/Assign%20Interaction%3A%20autofill%20due%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/559398/Assign%20Interaction%3A%20autofill%20due%20date.meta.js
// ==/UserScript==

(function() {
    const actionSpan = document.querySelector("#aid").parentElement.querySelector(".chosen-container > a > span");
    const completeByDateInput = document.querySelector("#completeByDate");
    const today = new Date();


    function decideDate(actionName) {
        switch (actionName) {
            case "New Visitor Connections Follow-Up":
            case "New Visitor Follow-Up: Cookie Visit":
                return today;
            case "New Visitor Follow- Up: Phone Call":
            case "Altar Follow-up": {
                // This Friday on Sun, Mon, Tue, Wed, Sat; next Friday on Thu, Fri
                const friday = getRelativeWeekday(today, DateDir.THIS, Day.FRIDAY, false);
                if ([Day.THURSDAY, Day.FRIDAY].includes(today.getDay())) {
                    // If it's already Thursday or Friday, make it next Friday
                    friday.setDate(friday.getDate() + 7);
                }
                return friday;
            }
            case "Discipleship":
                return getRelativeWeekday(today, DateDir.THIS, Day.TUESDAY, false);
        }
        return null;
    }


    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }


    function onMutation(records) {
        const date = decideDate(actionSpan.textContent);
        if (date === null) return;
        completeByDateInput.value = formatDate(date);
    }


    const observer = new MutationObserver(onMutation);
    const options = {
        subtree: false,
        childList: true,
        attributes: false,
        characterData: true,
        characterDataOldValue: false,
    };
    observer.observe(actionSpan, options);
})();