// ==UserScript==
// @name         Visitors: autofill group
// @namespace    https://github.com/nate-kean/
// @version      2026.1.27
// @description  Suggest the group an individual was checked into as the group to create them with.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/visitors
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564264/Visitors%3A%20autofill%20group.user.js
// @updateURL https://update.greasyfork.org/scripts/564264/Visitors%3A%20autofill%20group.meta.js
// ==/UserScript==

(function() {
    const groupSelect = document.querySelector("#importVisitorGid");
    window.fillGroupAndConvertVisitor = (id, timeLastAttended, groupName) => {
        convertVisitor(id, timeLastAttended);
        if (groupName === "") return;
        for (let i = 0; i < groupSelect.options.length; i++) {
            const option = groupSelect.options[i];
            if (option.textContent !== groupName) continue;
            groupSelect.selectedIndex = i;
            return;
        }
        throw new Error(`Could not find "${groupName}" in the list of all F1 Go groups`);
    };

    function patch(groupName, td) {
        groupName = groupName.replace('"', '\\"');
        const href = td.children[0].href;
        const iOpen = href.indexOf("(");
        const iClose = href.indexOf(")");
        const args = href.substring(iOpen + 1, iClose).split(", ");
        const id = args[0];
        const timeLastAttended = args[1].length > 0 ? args[1] : undefined;
        td.children[0].href = `javascript:fillGroupAndConvertVisitor(${id}, ${timeLastAttended}, "${groupName}");`;
    }

    for (const tr of document.querySelectorAll("table.dataTable > tbody > tr")) {
        const groupName = tr.children[3].textContent;
        patch(groupName, tr.children[0]);
        patch(groupName, tr.children[1]);
    }
})();
