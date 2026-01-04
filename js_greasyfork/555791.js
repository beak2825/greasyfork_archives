// ==UserScript==
// @name         Torn Display Case • ABC / Export / Import
// @namespace    https://greasyfork.org/en/users/2842410-killercleat
// @version      11.13.2025.22.30
// @description  Adds ABC, Export, Import buttons to the Display Case manage page next to "Save changes". Never auto-saves or auto-sorts on load.
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/displaycase.php*
// @grant        none
// @homepageURL  https://greasyfork.org/en/scripts/555791-torn-display-case-abc-export-import
// @supportURL   https://greasyfork.org/en/scripts/555791-torn-display-case-abc-export-import/feedback
// @downloadURL https://update.greasyfork.org/scripts/555791/Torn%20Display%20Case%20%E2%80%A2%20ABC%20%20Export%20%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/555791/Torn%20Display%20Case%20%E2%80%A2%20ABC%20%20Export%20%20Import.meta.js
// ==/UserScript==

/*
===============================================================================
NOTES & REQUIREMENTS
-------------------------------------------------------------------------------
Script:   Torn Display Case • ABC / Export / Import
Author:   KillerCleat [2842410]
Version:  11.13.2025.22.30

Purpose:
- On the Display Case manage page (#manage), add three buttons next to
  "SAVE CHANGES":
    [SAVE CHANGES] [ABC] [Export] [Import]  Undo changes
- ABC:   Sorts all items alphabetically by name on screen ONLY.
- Export:Downloads current on-screen item order to a .txt file.
- Import:Reads a previously exported .txt/.json file and reorders items
         on screen to match it.

Important:
- The script NEVER clicks "SAVE CHANGES" or submits any form.
- Torn will only remember the new order if YOU manually press "SAVE CHANGES".
- The script does NOT auto-sort or auto-apply anything on page load.

Requirements:
- Tampermonkey (or compatible userscript manager).
- Torn Display Case "Manage your Display Case" view (#manage).

Behavior:
- Only affects the Display Case manage view.
- No API calls.
- Uses ES6 JavaScript.
- Status text uses Torn-style time: 24-hour clock with "TCT".

Rules Followed:
- Full metadata header included.
- NOTES & REQUIREMENTS with version and author.
- No existing Torn commands are changed.
- Clean, documented ES6 code.
- No emojis or special characters.
===============================================================================
*/

(function () {
    "use strict";

    /** Get Torn-style time string "HH:MM TCT". */
    function getTornStyleTime() {
        const selectors = [
            "#bar-time",
            "#tct-time",
            "#clock",
            ".time",
            ".header .time"
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                const text = el.textContent.trim();
                const match = text.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);
                if (match) {
                    const parts = match[0].split(":");
                    const hh = parts[0].padStart(2, "0");
                    const mm = parts[1].padStart(2, "0");
                    return hh + ":" + mm + " TCT";
                }
            }
        }

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        return hh + ":" + mm + " TCT";
    }

    /** Find the "SAVE CHANGES" button so we can attach our buttons next to it. */
    function findSaveButton() {
        const buttons = Array.from(document.querySelectorAll("button, input[type='button'], input[type='submit']"));
        for (const btn of buttons) {
            const text = (btn.value || btn.textContent || "").trim().toLowerCase();
            if (text === "save changes") {
                return btn;
            }
        }
        return null;
    }

    /** Get all display item rows and build an array of {el, name}. */
    function getItemRows() {
        const nameBlocks = Array.from(document.querySelectorAll(".name.flex .desc .bold"));
        if (nameBlocks.length === 0) {
            return { parent: null, rows: [] };
        }

        const rows = [];
        nameBlocks.forEach(span => {
            const row = span.closest("li") || span.closest(".name.flex");
            if (row && !rows.includes(row)) {
                rows.push(row);
            }
        });

        const parent = rows.length > 0 ? rows[0].parentElement : null;
        return { parent, rows };
    }

    /** Sort items alphabetically A–Z on screen only. */
    function sortItemsABC() {
        const { parent, rows } = getItemRows();
        if (!parent || rows.length === 0) {
            console.warn("KC DisplayCase ABC: No items found to sort.");
            return false;
        }

        const sortable = rows.map(el => {
            const nameEl = el.querySelector(".desc .bold");
            const name = nameEl ? nameEl.textContent.trim().toLowerCase() : "";
            return { el, name };
        });

        sortable.sort((a, b) => a.name.localeCompare(b.name));

        sortable.forEach(item => parent.appendChild(item.el));
        return true;
    }

    /** Export current visible order to a downloadable file. */
    function exportOrderToFile() {
        const { rows } = getItemRows();
        if (rows.length === 0) {
            console.warn("KC DisplayCase Export: No items found.");
            return false;
        }

        const names = rows.map(el => {
            const nameEl = el.querySelector(".desc .bold");
            return nameEl ? nameEl.textContent.trim() : "";
        });

        const dataStr = JSON.stringify(names, null, 0);

        const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const now = new Date();
        const stamp =
            String(now.getFullYear()) +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0") +
            "_" +
            String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0");

        const a = document.createElement("a");
        a.href = url;
        a.download = "displaycase_order_" + stamp + ".txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
    }

    /** Import order from a selected file and reorder items on screen. */
    function importOrderFromFile(file, onDone) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const text = String(e.target.result || "").trim();
                if (!text) {
                    console.warn("KC DisplayCase Import: File is empty.");
                    onDone(false);
                    return;
                }

                let list;
                try {
                    list = JSON.parse(text);
                } catch (err) {
                    // Allow comma-separated plain text as fallback
                    list = text.split(",").map(s => s.trim()).filter(Boolean);
                }

                if (!Array.isArray(list) || list.length === 0) {
                    console.warn("KC DisplayCase Import: Parsed list is empty.");
                    onDone(false);
                    return;
                }

                const { parent, rows } = getItemRows();
                if (!parent || rows.length === 0) {
                    console.warn("KC DisplayCase Import: No display rows found.");
                    onDone(false);
                    return;
                }

                // Map current rows by exact name text
                const nameToRows = new Map();
                rows.forEach(el => {
                    const nameEl = el.querySelector(".desc .bold");
                    const name = nameEl ? nameEl.textContent.trim() : "";
                    if (!nameToRows.has(name)) {
                        nameToRows.set(name, []);
                    }
                    nameToRows.get(name).push(el);
                });

                const used = new Set();

                // First, append rows in the order from the imported list
                list.forEach(importName => {
                    const arr = nameToRows.get(importName);
                    if (arr && arr.length > 0) {
                        const row = arr.shift();
                        used.add(row);
                        parent.appendChild(row);
                    }
                });

                // Then append any remaining rows (not present in the file)
                rows.forEach(row => {
                    if (!used.has(row)) {
                        parent.appendChild(row);
                    }
                });

                onDone(true);
            } catch (err) {
                console.error("KC DisplayCase Import error:", err);
                onDone(false);
            }
        };

        reader.onerror = function () {
            console.error("KC DisplayCase Import: File read error.");
            onDone(false);
        };

        reader.readAsText(file);
    }

    /** Insert the ABC / Export / Import buttons next to SAVE CHANGES. */
    function insertButtons() {
        const url = window.location.href;
        if (!url.includes("/displaycase.php") || !url.includes("#manage")) {
            return;
        }

        // Avoid duplicates
        if (document.querySelector(".kc-dc-abc-btn")) {
            return;
        }

        const saveBtn = findSaveButton();
        if (!saveBtn || !saveBtn.parentNode) {
            return;
        }

        const parent = saveBtn.parentNode;

        // Status text
        const statusSpan = document.createElement("span");
        statusSpan.className = "kc-dc-status";
        statusSpan.style.marginLeft = "8px";
        statusSpan.style.fontSize = "11px";
        statusSpan.style.opacity = "0.8";

        function setStatus(msg) {
            statusSpan.textContent = msg + " at " + getTornStyleTime() + " (not saved)";
        }

        // Helper to clone save button style
        function makeButton(label, extraClass) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = label;
            btn.className = (saveBtn.className || "") + " " + extraClass;
            btn.style.marginLeft = "8px";
            return btn;
        }

        const abcBtn = makeButton("ABC", "kc-dc-abc-btn");
        const exportBtn = makeButton("Export", "kc-dc-export-btn");
        const importBtn = makeButton("Import", "kc-dc-import-btn");

        // Put them directly after SAVE CHANGES, in this order: ABC, Export, Import
        parent.insertBefore(abcBtn, saveBtn.nextSibling);
        parent.insertBefore(exportBtn, abcBtn.nextSibling);
        parent.insertBefore(importBtn, exportBtn.nextSibling);
        parent.insertBefore(statusSpan, importBtn.nextSibling);

        // Hidden file input for Import
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".txt,.json";
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

        // Button handlers — NONE of these save anything to Torn.
        abcBtn.addEventListener("click", () => {
            const ok = sortItemsABC();
            if (ok) setStatus("ABC sort applied");
        });

        exportBtn.addEventListener("click", () => {
            const ok = exportOrderToFile();
            if (ok) setStatus("Order exported");
        });

        importBtn.addEventListener("click", () => {
            fileInput.value = "";
            fileInput.click();
        });

        fileInput.addEventListener("change", () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            importOrderFromFile(file, success => {
                if (success) {
                    setStatus("Order imported");
                } else {
                    statusSpan.textContent = "Import failed (not saved)";
                }
            });
        });
    }

    /** Observe DOM so we can attach when the manage section appears. */
    function setupObserver() {
        const observer = new MutationObserver(() => {
            insertButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        insertButtons();
    }

    setupObserver();
})();
