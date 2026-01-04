// ==UserScript==
// @name         Makerworld Points Auto Logger + Viewer (Smart Panel + Toggle)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Log points daily, export only when value changes, show entries in small popup window with minimize/expand toggle
// @match        https://makerworld.com/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556403/Makerworld%20Points%20Auto%20Logger%20%2B%20Viewer%20%28Smart%20Panel%20%2B%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556403/Makerworld%20Points%20Auto%20Logger%20%2B%20Viewer%20%28Smart%20Panel%20%2B%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Currency options: [region, symbol, pointsCost, payoutValue]
    const currencyOptions = [
        {region: "EU", symbol: "€", cost: 524, value: 40},
        {region: "USA", symbol: "$", cost: 490, value: 40},
        {region: "UK", symbol: "£", cost: 535, value: 35},
        {region: "CA", symbol: "C$", cost: 504, value: 55},
        {region: "AU", symbol: "A$", cost: 511, value: 65},
        {region: "JP", symbol: "¥", cost: 502, value: 5300},
        {region: "ASIA", symbol: "$", cost: 490, value: 40},
        {region: "KR", symbol: "₩", cost: 490, value: 58000},
        {region: "CN", symbol: "¥", cost: 490, value: 284}
    ];

    // Helper to get saved currency or default EU
    function getSelectedCurrency() {
        const saved = localStorage.getItem("pointsCurrency");
        return currencyOptions.find(c => c.region === saved) || currencyOptions[0];
    }

    function renderCurrencySelector(container) {
        let selector = document.createElement("select");
        selector.id = "currencySelector";
        selector.style.marginLeft = "5px";
        currencyOptions.forEach(opt => {
            let option = document.createElement("option");
            option.value = opt.region;
            option.textContent = `${opt.region} (${opt.symbol})`;
            selector.appendChild(option);
        });
        selector.value = getSelectedCurrency().region;
        selector.onchange = function() {
            localStorage.setItem("pointsCurrency", selector.value);
            // re-render stats with new currency
            let logs = JSON.parse(localStorage.getItem("pointsLog") || "[]");
            renderPointsLog(logs, new Date().toISOString().split('T')[0], new Date().toTimeString().split(' ')[0]);
        };
        container.appendChild(selector);
    }

    function logPoints() {
        let el = document.querySelector('.mw-css-yyek0l');
        if (!el) {
            console.log("Element not found");
            return;
        }

        let points = el.textContent.trim().replace(/,/g, "");
        let now = new Date();
        let date = now.toISOString().split('T')[0];
        let time = now.toTimeString().split(' ')[0];

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
        container.style.fontSize = "12px";
        container.style.fontFamily = "monospace";

        // Header with minimize toggle
        let header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between"; // left group vs right button
        header.style.alignItems = "center";
        header.style.marginBottom = "5px";

        // Left group: title + currency selector
        let leftGroup = document.createElement("div");
        leftGroup.style.display = "flex";
        leftGroup.style.alignItems = "center";

        let title = document.createElement("span");
        title.textContent = "Points Log";
        title.style.fontWeight = "bold";
        leftGroup.appendChild(title);

        // Insert currency selector next to title
        //renderCurrencySelector(leftGroup);

        header.appendChild(leftGroup);

        // Right side: minimize button
        let toggleBtn = document.createElement("button");
        toggleBtn.textContent = "-";
        toggleBtn.style.background = "yellow";
        toggleBtn.style.color = "darkblue";
        toggleBtn.style.fontWeight = "bold";
        toggleBtn.onclick = function() {
            let tableWrapper = document.getElementById("pointsLogTableWrapper");
            let stats = document.getElementById("pointsStats");
            let giftcards = document.getElementById("pointsGiftcards");
            let totalValue = document.getElementById("pointsTotalValue");
            let controls = document.getElementById("pointsControls");
            let selectorWrapper = document.getElementById("currencySelectorWrapper"); // ⬅️ new line

            if (tableWrapper.style.display === "none") {
                tableWrapper.style.display = "block";
                if (stats) stats.style.display = "block";
                if (giftcards) giftcards.style.display = "block";
                if (totalValue) totalValue.style.display = "block";
                if (controls) controls.style.display = "block";
                if (selectorWrapper) selectorWrapper.style.display = "block"; // ⬅️ show
                toggleBtn.textContent = "-";
            } else {
                tableWrapper.style.display = "none";
                if (stats) stats.style.display = "none";
                if (giftcards) giftcards.style.display = "none";
                if (totalValue) totalValue.style.display = "none";
                if (controls) controls.style.display = "none";
                if (selectorWrapper) selectorWrapper.style.display = "none"; // ⬅️ hide
                toggleBtn.textContent = "+";
            }
        };


        header.appendChild(toggleBtn);

        container.appendChild(header);



        // Control buttons
        let controls = document.createElement("div");
        controls.id = "pointsControls";
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

        // Inside renderPointsLog, after exportBtn:
        let addBtn = document.createElement("button");
        addBtn.textContent = "Add Entry";
        addBtn.style.background = "yellow";
        addBtn.style.color = "darkblue";
        addBtn.style.fontWeight = "bold";
        addBtn.style.marginLeft = "5px";
        addBtn.onclick = function() {
            // Toggle visibility of the inline form
            let form = document.getElementById("addEntryForm");
            if (form) {
                form.style.display = (form.style.display === "none") ? "block" : "none";
            }
        };
        controls.appendChild(addBtn);

        // Inline form container
        let form = document.createElement("div");
        form.id = "addEntryForm";
        form.style.display = "none";
        form.style.marginTop = "5px";
        form.style.background = "navy";
        form.style.padding = "5px";
        form.style.border = "1px solid yellow";

        // Input fields
        let dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = new Date().toISOString().split('T')[0];
        form.appendChild(dateInput);

        let timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.value = new Date().toTimeString().split(' ')[0].slice(0,5);
        timeInput.style.marginLeft = "5px";
        form.appendChild(timeInput);

        let pointsInput = document.createElement("input");
        pointsInput.type = "number";
        pointsInput.placeholder = "Points";
        pointsInput.style.marginLeft = "5px";
        form.appendChild(pointsInput);

        // Save button
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.background = "yellow";
        saveBtn.style.color = "darkblue";
        saveBtn.style.fontWeight = "bold";
        saveBtn.style.marginLeft = "5px";
        saveBtn.onclick = function() {
            let date = dateInput.value;
            let time = timeInput.value || new Date().toTimeString().split(' ')[0];
            let points = pointsInput.value.trim();
            if (!date || !points) {
                alert("Date and points are required.");
                return;
            }

            let logs = JSON.parse(localStorage.getItem("pointsLog") || "[]");
            logs.push({date: date, time: time, points: points});
            localStorage.setItem("pointsLog", JSON.stringify(logs));

            console.log("Manual entry added:", {date, time, points});
            renderPointsLog(logs, date, time);
        };
        form.appendChild(saveBtn);

        container.appendChild(form);


        // Table wrapper (scrollable)
        let tableWrapper = document.createElement("div");
        tableWrapper.id = "pointsLogTableWrapper";
        tableWrapper.style.maxHeight = "120px"; // enough for ~5 rows
        tableWrapper.style.overflowY = "auto";
        tableWrapper.style.border = "1px solid yellow";

        let table = document.createElement("table");
        table.id = "pointsLogTable";
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";

        let headerRow = document.createElement("tr");
        ["DATE", "TIME", "POINTS", "GAIN"].forEach(h => {
            let th = document.createElement("th");
            th.textContent = h;
            th.style.border = "1px solid yellow";
            th.style.padding = "2px 5px";
            th.style.background = "navy";
            th.style.color = "yellow";
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Sort logs by date descending, then time descending
        let sortedLogs = logs.slice().sort((a, b) => {
            let dateA = new Date(`${a.date}T${a.time}`);
            let dateB = new Date(`${b.date}T${b.time}`);
            return dateB - dateA; // newest first
        });

        // Use sortedLogs instead of lastLogs
        sortedLogs.forEach((entry, idx) => {
            let row = document.createElement("tr");

            // Calculate daily gain (difference from previous entry)
            let gain = "";
            if (idx < sortedLogs.length - 1) {
                let prevPoints = parseFloat(sortedLogs[idx + 1].points);
                let currPoints = parseFloat(entry.points);
                gain = (currPoints - prevPoints >= 0) ? (currPoints - prevPoints) : "";
            }

            [entry.date, entry.time, entry.points, gain].forEach(val => {
                let td = document.createElement("td");
                td.textContent = val;
                td.style.border = "1px solid yellow";
                td.style.padding = "2px 5px";
                td.style.color = "yellow";
                row.appendChild(td);
            });

            // Delete button cell
            let delTd = document.createElement("td");
            let delBtn = document.createElement("button");
            delBtn.textContent = "X";
            delBtn.style.background = "red";
            delBtn.style.color = "white";
            delBtn.style.fontWeight = "bold";
            delBtn.onclick = function() {
                if (!confirm(`Delete entry for ${entry.date} ${entry.time} (${entry.points} points)?`)) {
                    return; // cancel if user clicks "Cancel"
                }
                let logs = JSON.parse(localStorage.getItem("pointsLog") || "[]");

                // Find the matching entry by date+time+points
                let newLogs = logs.filter(l =>
                                          !(l.date === entry.date && l.time === entry.time && l.points === entry.points)
                                         );

                localStorage.setItem("pointsLog", JSON.stringify(newLogs));
                console.log("Deleted entry:", entry);
                renderPointsLog(newLogs, date, time);
            };
            delTd.appendChild(delBtn);
            row.appendChild(delTd);

            table.appendChild(row);
        });


        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);

        // Place currency selector under the table, right aligned
        let selectorWrapper = document.createElement("div");
        selectorWrapper.id = "currencySelectorWrapper";
        selectorWrapper.style.marginTop = "5px";
        selectorWrapper.style.textAlign = "right";
        renderCurrencySelector(selectorWrapper);
        container.appendChild(selectorWrapper);


        // Helpers: chronological sort and per-day consolidation
        function sortAscByDateTime(logs) {
            return logs.slice().sort((a, b) => {
                const aTime = new Date(`${a.date}T${a.time || '00:00:00'}`).getTime();
                const bTime = new Date(`${b.date}T${b.time || '00:00:00'}`).getTime();
                return aTime - bTime;
            });
        }

        function collapseToDailyLast(logsAsc) {
            // Keep the last entry per date (highest time per day)
            const map = new Map();
            for (const entry of logsAsc) {
                const key = entry.date;
                const prev = map.get(key);
                // Compare times; store the later one
                if (!prev) {
                    map.set(key, entry);
                } else {
                    const prevTime = new Date(`${prev.date}T${prev.time || '00:00:00'}`).getTime();
                    const currTime = new Date(`${entry.date}T${entry.time || '00:00:00'}`).getTime();
                    if (currTime >= prevTime) map.set(key, entry);
                }
            }
            // Return in chronological order by date
            return Array.from(map.values()).sort((a, b) => (new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`)));
        }

        // Daily average + monthly projection (chronological, per-day)
        // Daily average + monthly projection (chronological, per-day)
        if (logs.length > 1) {
            const asc = sortAscByDateTime(logs);
            const daily = collapseToDailyLast(asc);

            const first = daily[0];
            const last = daily[daily.length - 1];

            const totalGain = parseFloat(last.points) - parseFloat(first.points);

            const firstDate = new Date(`${first.date}T${first.time || '00:00:00'}`);
            const lastDate = new Date(`${last.date}T${last.time || '00:00:00'}`);
            const daySpan = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)));

            const avg = totalGain / daySpan;
            const monthly = avg * (365 / 12);

            let stats = document.getElementById("pointsStats");
            if (!stats) {
                stats = document.createElement("div");
                stats.id = "pointsStats";
                stats.style.marginTop = "5px";
                stats.style.fontWeight = "bold";
                container.appendChild(stats);
            }
            stats.textContent = `Daily Avg: ${avg.toFixed(2)} | Monthly Projection: ${monthly.toFixed(2)}`;

            // ➕ Add giftcard line (collapsible with stats)
            let giftcards = document.getElementById("pointsGiftcards");
            if (!giftcards) {
                giftcards = document.createElement("div");
                giftcards.id = "pointsGiftcards";
                giftcards.style.marginTop = "3px";
                giftcards.style.fontWeight = "bold";
                container.appendChild(giftcards);
            }
            // Use selected currency for giftcard calculation
            const curr = getSelectedCurrency();
            const X = monthly / curr.cost;
            const Y = X * curr.value;
            giftcards.textContent = `Monthly Giftcards: ${X.toFixed(2)} (${curr.symbol} ${Y.toFixed(2)})`;
            // ➕ Add total value line under giftcards
            let totalValue = document.getElementById("pointsTotalValue");
            if (!totalValue) {
                totalValue = document.createElement("div");
                totalValue.id = "pointsTotalValue";
                totalValue.style.marginTop = "3px";
                totalValue.style.fontWeight = "bold";
                container.appendChild(totalValue);
            }

            // Calculate total value of current points using selected currency
            const currPoints = parseFloat(last.points); // last entry = current total points
            const totalVal = (currPoints / curr.cost) * curr.value;
            totalValue.textContent = `Total value of points: ${curr.symbol} ${totalVal.toFixed(2)}`;

        }



        document.body.appendChild(container);
    }



    window.addEventListener('load', logPoints);
})();
