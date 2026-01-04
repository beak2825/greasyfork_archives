// ==UserScript==
// @name         UniteAPI Expand All Matches Button
// @namespace    https://yeehoiimeenoiiii2.com
// @version      1.0
// @license      MIT
// @description  Adds a button to UniteAPI that will expand all your match rows.
// @match        https://uniteapi.dev/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556722/UniteAPI%20Expand%20All%20Matches%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/556722/UniteAPI%20Expand%20All%20Matches%20Button.meta.js
// ==/UserScript==
let rowState = [];
function myFunction(){

    function clickEachBox(){
        // Identify the HTML
        const matchesOuterBox = document.querySelectorAll('.sc-d5d8a548-0.blxzuw > div');
        const matchesBoxChildren = matchesOuterBox[0].children
        const rows = Array.from(matchesBoxChildren).slice(1, -1);

        // Click all the rows
        for (let i = 0; i < rows.length; i++) {
            const innerRow = rows[i].querySelector('div')
            innerRow.click();
        }
    }


    function clickEachExpandedBox() {
        // Identify the HTML
        const matchesOuterBox = document.querySelectorAll('.sc-d5d8a548-0.blxzuw > div');
        const matchesBoxChildren = matchesOuterBox[0].children
        const rows = Array.from(matchesBoxChildren).slice(1, -1);
        // Click all the ALREADY EXPANDED rows
        for (let i = 0; i < rows.length; i++) {
            const innerRow = rows[i].querySelector('div')
            if (rowState[i]) {
                innerRow.click();
            }
        }
    }


    // BUTTONS
    // Create Toggle Matches button
    const allCheckBoxes = document.querySelectorAll('.sc-f8a226b8-0.hHLpRQ')
    const tournamentCheckBox = allCheckBoxes[7]
    const expandAllMatchesBtn = document.createElement("button");
    expandAllMatchesBtn.setAttribute("class", "myUniqueButton");
    expandAllMatchesBtn.textContent = "Toggle Matches"
    tournamentCheckBox.append(expandAllMatchesBtn)
    // Makes the button work
    expandAllMatchesBtn.addEventListener("click", clickEachBox);
    // Close Rows buttons
    const closeAllMatchesBtn = document.createElement("button");
    closeAllMatchesBtn.textContent = "Close All Matches"
    closeAllMatchesBtn.setAttribute("class", "myUniqueButton")
    tournamentCheckBox.append(closeAllMatchesBtn)
    // Makes closeAllMatchesBtn button work
    closeAllMatchesBtn.addEventListener("click", clickEachExpandedBox)
    // Button styling
    const myButtonElements = document.querySelectorAll('.myUniqueButton');
    for (const el of myButtonElements) {
        el.style.margin = "0px 5px";
    }


    // Tracking rowState

    // Identify the html
    function trackRowState (){
        const matchesOuterBox = document.querySelectorAll('.sc-d5d8a548-0.blxzuw > div');
        const matchesBoxChildren = matchesOuterBox[0].children
        const rows = Array.from(matchesBoxChildren).slice(1, -1);
        rowState = Array(rows.length).fill(false);
        // Loop through the rows
        for (let i = 0; i < rows.length; i++) {
            const innerRow = rows[i].querySelector('div')
            innerRow.addEventListener("click", () => {
                rowState[i] = !rowState[i];
                console.log("Row", i, "isExpanded: ", rowState[i]);
            });
        }
    }
    trackRowState() // Initial run of tracking


    // Refresh rowState when clicking on the match arrow navigators

    // Find the arrow
    const navContainer = document.querySelectorAll('.sc-a8a92342-0.cStYLV')
    const matchesNavContainer = navContainer[1]
    const matchesNavArrows = matchesNavContainer.children
    const matchesNavArrowsSpliced = Array.from(matchesNavArrows).filter((_, index) => index !== 1);
    // console.log(matchesNavArrowsSpliced)


    // When I click the arrow
    for (const el of matchesNavArrowsSpliced) {
        el.addEventListener("click", () => {
            setTimeout(trackRowState, 500)
        });
    }


}


// Only run the script on /p/ pages
window.addEventListener("load", () => {
    if (!location.pathname.startsWith("/p/")) {
        console.log("Not on a user profile, not executing initial run.");
    } else {
        console.log("User profile detected, creating button...")
        myFunction();
    }
});

// Check if the url changed, and if so, run the following:
let lastUrl = location.href;
setInterval(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("URL changed to:", lastUrl);
        if (!location.pathname.startsWith("/p/")) {
            console.log("Not on a user profile, not executing.");
        } else {
            console.log("User profile detected, creating button...")
            setTimeout(() => {
                myFunction();
                const matchesOuterBox = document.querySelectorAll('.sc-d5d8a548-0.blxzuw > div');
                const matchesBoxChildren = matchesOuterBox[0].children;
                const rows = Array.from(matchesBoxChildren).slice(1, -1);
                rowState[i] = Array(rows.length).fill(false);
            }, 500);
        }
    }
}, 500);