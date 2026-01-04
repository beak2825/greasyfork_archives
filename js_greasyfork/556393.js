// ==UserScript==
// @name         Makerworld Points Auto Logger + Viewer (Smart Panel + Toggle)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Log points daily, export only when value changes, show last 10 entries with minimize/expand toggle
// @match        https://makerworld.com/*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556393/Makerworld%20Points%20Auto%20Logger%20%2B%20Viewer%20%28Smart%20Panel%20%2B%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556393/Makerworld%20Points%20Auto%20Logger%20%2B%20Viewer%20%28Smart%20Panel%20%2B%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function logPoints() {
        let el = document.querySelector('.mw-css-yyek0l');
        if (!el) {
            console.log("Element not found");
            return;
        }

        let points = el.textContent.trim().replace(/,/g, "");
        let now = new Date();
        let date = now.toISOString().split('T')[0];
        let time = now.toTimeString().split(' ')[0].replace(/:/g, "-");

        let logs = JSON.parse(localStorage.getItem("pointsLog") || "[]");
        let existingIndex = logs.findIndex(entry => entry.date === date);
        let shouldExport = true;

        if (existingIndex !== -1) {
            if (logs[existingIndex].points === points) {
                shouldExport = false;
            }
            logs[existingIndex] = {date: date, time: time, points: points};
        } else {
            logs.push({date: date, time: time, points: points});
        }

        localStorage.setItem("pointsLog", JSON.stringify(logs));
        console.log("Points logged:", {date, time, points});

        if (shouldExport) {
            exportFullLog(date, time, logs);
        }

        renderPointsLog(logs, date, time);
    }

    function exportFullLog(date, time, logs) {
        if (logs.length === 0) return;

        let header = "DATE,TIME,POINTS\n";
        let lines = logs.map(entry => `${entry.date},${entry.time},${entry.points}`).join("\n");
        let csvContent = header + lines + "\n";

        let filename = `MWPOINT-${date}-${time}.csv`;

        let blob = new Blob([csvContent], {type: "text/csv"});
        let url = URL.createObjectURL(blob);
        GM_download({ url: url, name: filename });
    }

    function renderPointsLog(logs, date, time) {
        let oldPanel = document.getElementById("pointsLogPanel");
        if (oldPanel) oldPanel.remove();

        let container = document.createElement("div");
        container.id = "pointsLogPanel";
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        container.style.background = "darkblue";
        container.style.color = "yellow";
        container.style.border = "2px solid yellow";
        container.style.padding = "10px";
        container.style.zIndex = 9999;
        container.style.maxHeight = "300px";
        container.style.overflowY = "auto";
        container.style.fontSize = "12px";
        container.style.fontFamily = "monospace";

        // Header with minimize toggle
        let header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "5px";

        let title = document.createElement("span");
        title.textContent = "Points Log";
        title.style.fontWeight = "bold";
        header.appendChild(title);

        let toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Minimize";
        toggleBtn.style.background = "yellow";
        toggleBtn.style.color = "darkblue";
        toggleBtn.style.fontWeight = "bold";
        toggleBtn.style.marginLeft = "10px";
        toggleBtn.onclick = function() {
            let table = document.getElementById("pointsLogTable");
            if (table.style.display === "none") {
                table.style.display = "table";
                toggleBtn.textContent = "Minimize";
            } else {
                table.style.display = "none";
                toggleBtn.textContent = "Expand";
            }
        };
        header.appendChild(toggleBtn);

        container.appendChild(header);

        // Control buttons
        let controls = document.createElement("div");
        controls.style.marginBottom = "5px";

        let clearBtn = document.createElement("button");
        clearBtn.textContent = "Clear Log";
        clearBtn.style.background = "yellow";
        clearBtn.style.color = "darkblue";
        clearBtn.style.fontWeight = "bold";
        clearBtn.style.marginRight = "5px";
        clearBtn.onclick = function() {
            if (confirm("Are you sure you want to clear the points log?")) {
                localStorage.removeItem("pointsLog");
                renderPointsLog([], date, time);
                console.log("Points log cleared.");
            }
        };
        controls.appendChild(clearBtn);

        let exportBtn = document.createElement("button");
        exportBtn.textContent = "Export Log";
        exportBtn.style.background = "yellow";
        exportBtn.style.color = "darkblue";
        exportBtn.style.fontWeight = "bold";
        exportBtn.onclick = function() {
            let logs = JSON.parse(localStorage.getItem("pointsLog") || "[]");
            exportFullLog(date, time, logs);
        };
        controls.appendChild(exportBtn);

        container.appendChild(controls);

        // Table
        let table = document.createElement("table");
        table.id = "pointsLogTable";
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";

        let headerRow = document.createElement("tr");
        ["DATE", "TIME", "POINTS"].forEach(h => {
            let th = document.createElement("th");
            th.textContent = h;
            th.style.border = "1px solid yellow";
            th.style.padding = "2px 5px";
            th.style.background = "navy";
            th.style.color = "yellow";
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Show only last 10 entries
        let lastLogs = logs.slice(-10).reverse();
        lastLogs.forEach(entry => {
            let row = document.createElement("tr");
            [entry.date, entry.time, entry.points].forEach(val => {
                let td = document.createElement("td");
                td.textContent = val;
                td.style.border = "1px solid yellow";
                td.style.padding = "2px 5px";
                td.style.color = "yellow";
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        container.appendChild(table);
        document.body.appendChild(container);
    }

    window.addEventListener('load', logPoints);
})();
