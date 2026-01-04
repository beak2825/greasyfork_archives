// ==UserScript==
// @name         YATA Level Filter
// @namespace    YATA Level Filter
// @description  Level filter for YATA target list
// @author       tasozz
// @match        https://yata.yt/*/target/*
// @match        https://yata.yt/target/*
// @version      1.2
// @icon         https://yata.yt/static/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556581/YATA%20Level%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/556581/YATA%20Level%20Filter.meta.js
// ==/UserScript==


/* global $, jQuery */

(function() {
    'use strict';
    // Take page jQuery into the userscript scope
    const $ = window.jQuery;

    // NEW: helper to get CSRF cookie (name matches csrftoken cookie)
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function insertFilterUI() {
        // Prevent duplicates
        if (document.getElementById("yata-level-filter-box")) return;

        const table = document.querySelector("#target-targets");
        if (!table) return;

        const wrapper = document.createElement("div");
        wrapper.id = "yata-level-filter-box";
        wrapper.style.padding = "10px";
        wrapper.style.margin = "10px 0";
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.borderRadius = "6px";
        wrapper.style.background = "#f7f7f7";

        wrapper.innerHTML = `
            <b>Level Filter:</b>
            <br>
            Min: <input type="number" id="level-filter-min" style="width:70px; margin-right:10px;" value="1">
            Max: <input type="number" id="level-filter-max" style="width:70px; margin-right:10px;" value="100">
            <button id="apply-level-filter" class="btn btn-sm btn-primary">Apply</button>
            <button id="clear-level-filter" class="btn btn-sm btn-secondary">Clear</button>

            <!-- NEW: Sort Button -->
            <button id="sort-status-btn" class="btn btn-sm btn-success" style="margin-left:10px;">
                Sort by Status
            </button>

            <!-- NEW: AUTO-OPEN BUTTON -->
            <button id="open-first-ok" class="btn btn-sm btn-danger" style="margin-left:10px;">
                Attack First Okay Target
            </button>

            <!-- NEW: REFRESH BUTTON -->
            <button id="refresh-visible" class="btn btn-sm btn-warning" style="margin-left:10px;">
                Refresh Visible Only
            </button>

        `;

        table.parentNode.insertBefore(wrapper, table);

        document.getElementById("apply-level-filter").onclick = filterRows;
        document.getElementById("clear-level-filter").onclick = clearFilter;

        // Sorting button
        document.getElementById("sort-status-btn").onclick = sortByStatus;

        // NEW button action
        document.getElementById("open-first-ok").onclick = openFirstOK;

        // NEW button refresh
        document.getElementById("refresh-visible").onclick = refreshVisibleOnly;

    }

    function clearFilter() {
        document.getElementById("level-filter-min").value = 1;
        document.getElementById("level-filter-max").value = 100;
        filterRows();
    }

    function filterRows() {
        const min = parseInt(document.getElementById("level-filter-min").value) || 1;
        const max = parseInt(document.getElementById("level-filter-max").value) || 100;

        const rows = document.querySelectorAll("#target-targets tbody tr");
        rows.forEach(row => {
            const levelCell = row.querySelector("td:nth-child(4)");
            if (!levelCell) return;

            const level = parseInt(levelCell.textContent.trim());
            row.style.display = (level >= min && level <= max) ? "" : "none";
        });
    }

    // ✅ NEW: Sort by Status → Okays first → hospital time remaining
    function sortByStatus() {
        const tbody = document.querySelector("#target-targets tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        rows.sort((a, b) => {
            const statusCellA = a.querySelector("td:nth-child(10)");
            const statusCellB = b.querySelector("td:nth-child(10)");

            const textA = statusCellA.textContent.trim();
            const textB = statusCellB.textContent.trim();

            const isOkayA = textA === "Okay";
            const isOkayB = textB === "Okay";

            // ✔ OKAY targets go first
            if (isOkayA && !isOkayB) return -1;
            if (isOkayB && !isOkayA) return 1;

            // ✔ If both Okay, keep original order
            if (isOkayA && isOkayB) return 0;

            // ✔ Both are non-Okay (hospital, travel, etc.)
            // Sort by hospital remaining time (data-val)
            const timeA = parseInt(statusCellA.dataset.val || "99999999");
            const timeB = parseInt(statusCellB.dataset.val || "99999999");

            return timeA - timeB; // shortest → longest
        });

        rows.forEach(r => tbody.appendChild(r));
    }

    // Tracks which targets have already been opened
    let openedTargets = new Set();

    function openFirstOK() {
        const rows = Array.from(document.querySelectorAll("#target-targets tbody tr"))
            .filter(r => r.style.display !== "none");

        for (const row of rows) {

            // Get the target ID from row id="target-list-refresh-XXXX"
            const idMatch = row.id.match(/(\d+)/);
            if (!idMatch) continue;
            const targetID = idMatch[1];

            // Skip if already opened before
            if (openedTargets.has(targetID)) continue;

            // Attack button cell is 13th TD
            const attackCell = row.querySelector("td:nth-child(13)");
            if (!attackCell) continue;

            // OK targets have data-val="1"
            if (attackCell.dataset.val !== "1") continue;

            // Get the actual <a> element
            const attackBtn = attackCell.querySelector("a");
            if (!attackBtn) continue;

            // Icon must contain class "error"
            const icon = attackBtn.querySelector("i");
            if (!icon) continue;
            if (!icon.classList.contains("error")) continue;

            // OPEN IT!
            window.open(attackBtn.href, "_blank");

            // Remember it so it is NOT opened again
            openedTargets.add(targetID);

            return; // Stop after opening next available OK target
        }

        console.log("No new OK targets to attack.");
    }

    // CHANGED: use correct POST /target/target/ with CSRF, one request per visible row
function refreshVisibleOnly() {
    const visibleRows = Array.from(document.querySelectorAll("#target-targets tbody tr"))
        .filter(r => r.style.display !== "none" && r.id.startsWith("target-list-refresh-"));

    if (!visibleRows.length) {
        console.log("No visible rows to refresh");
        return;
    }

    const csrfToken = getCookie("csrftoken");
    if (!csrfToken) {
        console.warn("CSRF token not found");
        return;
    }

    visibleRows.forEach((row, index) => {
        const rowID = row.id.replace("target-list-refresh-", "");

        setTimeout(() => {
            $.ajax({
                url: "https://yata.yt/target/target/",
                method: "POST",
                data: {
                    targetId: rowID,
                    type: "update",
                    csrfmiddlewaretoken: csrfToken
                },
                success: function (html) {
                    console.log("Refreshed target", rowID);

                    const newRow = $("<tr id='target-list-refresh-" + rowID + "'>" + html + "</tr>");
                    $("#target-list-refresh-" + rowID).replaceWith(newRow);
                },
                error: function (xhr) {
                    console.warn("Refresh failed for", rowID, "status", xhr.status);
                }
            });
        }, index * 1000); // 0ms, 500ms, 1000ms, ...
    });
}



    // Wait for YATA dynamic loading
    const watcher = setInterval(() => {
        if (document.querySelector("#target-targets tbody tr")) {
            clearInterval(watcher);
            insertFilterUI();
        }
    }, 300);
})();
