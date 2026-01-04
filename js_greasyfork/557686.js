// ==UserScript==
// @name         MusicBrainz: Easy-Add Recording Alias
// @namespace    http://tampermonkey.net/
// @version      2025.12.02.3
// @description  Inserts "Add Alias" buttons in Recording pages and auto-fills the Add Alias form.
// @author       peepincreepin
// @match        *://*.musicbrainz.org/recording/*
// @exclude      *://*.musicbrainz.org/recording/*/aliases
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557686/MusicBrainz%3A%20Easy-Add%20Recording%20Alias.user.js
// @updateURL https://update.greasyfork.org/scripts/557686/MusicBrainz%3A%20Easy-Add%20Recording%20Alias.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // The class of the table to target
    const TABLE_CLASS = "tbl";
    // The class of rows to exclude
    const EXCLUDE_CLASS = "subh";
    // Target Input ID on the destination page
    const TARGET_INPUT_ID = "id-edit-alias.name";
    // Wait 500ms after page load to ensure we overwrite MB scripts
    const OVERWRITE_DELAY_MS = 500;

    // --- MAIN LOGIC ---
    const currentUrl = window.location.href;

    // SCENARIO 1: We are on the "Add Alias" page (Destination)
    if (currentUrl.includes("/add-alias")) {
        handleAliasPage();
    }
    // SCENARIO 2: We are on the main Recording page (Source)
    else {
        handleRecordingPage();
    }

    // --- FUNCTIONS ---

    function handleRecordingPage() {
        const listTable = document.querySelector(`table.${TABLE_CLASS}`);

        if (!listTable) {
            console.log("MusicBrainz Alias Helper: No table found.");
            return;
        }

        const rows = listTable.querySelectorAll("tr");

        // We need to handle the header row separately to keep the table structure valid
        // or the columns will misalign.
        const headerRow = listTable.querySelector("thead tr");
        if(headerRow) {
             const th = document.createElement("th");
             th.innerText = "Alias Tool";
             headerRow.insertBefore(th, headerRow.firstChild);
        }

        rows.forEach(row => {
            // Exclude rows with specific class (subh) or if it's a header row in tbody
            if (row.classList.contains(EXCLUDE_CLASS) || row.closest('thead')) {
                return;
            }

            // Create the button cell
            const btnCell = document.createElement("td");
            const btn = document.createElement("button");
            btn.innerText = "Add Alias";
            btn.style.fontSize = "11px";
            btn.style.cursor = "pointer";

            // Button Logic
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                // Get the existing cells (before we inserted our new one, indices might shift)
                // We inserted our new cell at index 0, so the "second td" is now index 2.
                // However, to be safe, let's query all tds and pick by current DOM order.
                const cells = row.querySelectorAll("td");

                // Note: Since we prepend a cell (btnCell), the original "second td"
                // is now the 3rd cell (index 2), assuming the row started with at least 2 cells.
                // If we grab content BEFORE appending, it's index 1.
                // Let's grab it dynamically relative to the button to be robust.

                // Logic: The button is in the first cell. The original 2nd cell is now the 3rd cell.
                // But let's stick to the prompt's logic of the "second td" of the original row data.
                // The safest way is to grab the cell at index 2 (0=button, 1=orig_1st, 2=orig_2nd).

                let targetCell = cells[2];

                // Fallback check if the table structure is simpler than expected
                if (!targetCell) targetCell = cells[1];

                if (targetCell) {
                    // 1. Capture label
                    let var_aliasname = targetCell.innerText.trim();

                    // 2. Add to clipboard
                    GM_setClipboard(var_aliasname);

                    // 3. Feedback (optional visual cue)
                    const originalText = btn.innerText;
                    btn.innerText = "Copied!";
                    setTimeout(() => btn.innerText = originalText, 1000);

                    // 4. Open new tab with data passed via URL Parameter
                    // We append ?auto_alias=VALUE to the URL
                    const baseUrl = window.location.href.split('?')[0]; // clean base URL
                    const targetUrl = `${baseUrl}/add-alias?auto_alias=${encodeURIComponent(var_aliasname)}`;
                    window.open(targetUrl, '_blank');
                } else {
                    alert("Could not find the text in the second column.");
                }
            });

            btnCell.appendChild(btn);

            // Insert at the beginning of the row (Left side)
            row.insertBefore(btnCell, row.firstChild);
        });
    }

    function handleAliasPage() {
        // Parse the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const aliasName = urlParams.get('auto_alias');

        if (aliasName) {
            // We attach a listener to 'load'. This fires when all scripts, css, and images are done.
            window.addEventListener('load', () => {

                // We add an extra delay (setTimeout) to ensure the MusicBrainz script
                // has finished its execution stack before we run.
                setTimeout(() => {
                    const inputField = document.getElementById(TARGET_INPUT_ID);
                    if (inputField) {
                        // 1. Force the value
                        inputField.value = aliasName;

                        // 2. Trigger 'change' event in case other scripts are watching this input
                        inputField.dispatchEvent(new Event('change', { bubbles: true }));

                        // 3. Visual feedback so you know it worked
                        inputField.style.backgroundColor = "#e6fffa";
                        inputField.style.border = "1px solid #38b2ac";
                        inputField.focus();
                    }
                }, OVERWRITE_DELAY_MS);

            });
        }
    }

})();