// ==UserScript==
// @name         Quest Search Bar
// @namespace    http://tampermonkey.net/
// @version      2025-09-09
// @description  Search your quests.
// @author       Henrik
// @match        https://klavia.io/racer/quests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavia.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549434/Quest%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/549434/Quest%20Search%20Bar.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let questMap = new Map();

    // Create search bar:
    let anchorElement = document.querySelector("#content > div:nth-child(3) > div:nth-child(2) > hr");
    let searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.style.width = "300px";
    searchBar.style.margin = "0px 20px 0px 0px";
    searchBar.onchange = function() {
        let searchString = searchBar.value.toLowerCase();
        let isValidSearch = searchString.length > 0;
        questMap.forEach( (questData, questRow, map) => {
            let questDescription = questData.toLowerCase();
            let questTitle = questRow.outerHTML.toLowerCase();
            let matchesSearchString = questDescription.includes(searchString) || questTitle.includes(searchString);
            if (isValidSearch && matchesSearchString) {
                questRow.style.border = "3px solid";
                questRow.style.borderColor = "#6ea8fe";
            } else {
                questRow.style.border = null;
            }
        });
    }
    anchorElement.insertBefore(searchBar, anchorElement.firstChild);

    // Init quest table:
    let questTable = document.querySelector("#content > div:nth-child(3) > div:nth-child(2) > table");
    for (let rowIndex = 1; rowIndex < questTable.rows.length; rowIndex++) {
        let row = questTable.rows[rowIndex];
        let questUrl = row.cells[0].firstChild.href;
        let questValue = await fetch(questUrl).then((resp) => resp.text());
        questMap.set(row, questValue);
    }

})();