// ==UserScript==
// @name         Interaction Reminder Template
// @namespace    https://github.com/nate-kean/
// @version      2025-09-24
// @description  Add a little table row to the side of the screen that you can copy and paste straight into Outstanding Interactions emails.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/interactions/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551287/Interaction%20Reminder%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/551287/Interaction%20Reminder%20Template.meta.js
// ==/UserScript==

(function() {
    const formBody = document.querySelector("form#editInteractionForm > .row");
    const select = formBody.querySelector("select#aid");
    const interactionName = select.options[select.selectedIndex].text.replace("New Visitor Follow-Up: ", "");
    const individualName = formBody.querySelector("#currentAttendee > div > p > a").textContent;
    const assignedDate = formBody.querySelector("label[for='assignedBy']").textContent.split(" ")[2];
    const dueDate = formBody.querySelector("#completeBy").value;

    formBody.insertAdjacentHTML("beforeend", `
        <table id="nates-interaction-reminder-template" class="col-md-4">
            <tbody>
                <tr style="cursor: text; margin: 50px">
                    <td>${interactionName}</td>
                    <td><a href="${window.location.href}">${individualName}</a></td>
                    <td>${assignedDate}</td>
                    <td>${dueDate}</td>
                </tr>
            </tbody>
        </table>
    `);
})();