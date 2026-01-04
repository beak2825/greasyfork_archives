// ==UserScript==
// @name         Bond's PS SSIS Inline GPA (4.3 scale + weighted) 
// @namespace    https://ps.ssis.edu.vn/
// @version      2025.12.01-ssisedit
// @description  gpa calc thing, only usable for ssis's powerschool.
// @match        https://ps.ssis.edu.vn/*
// @grant        none
// @license MIT
// @author n0tbond
// @downloadURL https://update.greasyfork.org/scripts/557561/Bond%27s%20PS%20SSIS%20Inline%20GPA%20%2843%20scale%20%2B%20weighted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557561/Bond%27s%20PS%20SSIS%20Inline%20GPA%20%2843%20scale%20%2B%20weighted%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const STORAGE_KEY = 'ps_att_gpa_visible_v1';
    const INJECT_ID = 'ps-att-gpa-row-v1';

    // Default = visible, so if null → visible
    function isVisible() {
        return localStorage.getItem(STORAGE_KEY) !== 'hidden';
    }
    function setVisible(v) {
        localStorage.setItem(STORAGE_KEY, v ? 'visible' : 'hidden');
    }

    // 4.3 scale
    const letterMap = {
        'A+': 4.3, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F':  0.0
    };

    // detect AP course for weighting
    function isAP(courseText) {
        return courseText.toUpperCase().includes("AP ");
    }

    function findAttendanceTable() {
        return Array.from(document.querySelectorAll("table"))
            .find(t => {
                const cap = t.querySelector("caption");
                if (!cap) return false;
                const txt = cap.textContent.trim().toLowerCase();
                return cap.id === "attByClass" || txt.includes("attendance");
            });
    }

    function extractLetter(text) {
        if (!text) return null;
        const clean = text.trim().toUpperCase();
        const m = clean.match(/A\+|A-|A|B\+|B-|B|C\+|C-|C|D\+|D-|D|F/);
        return m ? m[0] : null;
    }

    // Build logical grid to resolve real column index despite colspans
    function buildHeaderGrid(table) {
        const rows = [];
        const rawRows = Array.from(table.querySelectorAll("tr"));
        for (const r of rawRows) {
            if (r.querySelectorAll("th").length === 0) break;
            rows.push(r);
        }
        if (rows.length === 0) return null;

        const grid = [];
        const occ = [];
        for (let r = 0; r < rows.length; r++) {
            grid[r] = [];
            const cells = Array.from(rows[r].querySelectorAll("th,td"));
            let col = 0;
            for (const c of cells) {
                while (occ[col] > 0) col++;
                const cs = Number(c.getAttribute('colspan')) || 1;
                const rs = Number(c.getAttribute('rowspan')) || 1;
                for (let k = 0; k < cs; k++) {
                    grid[r][col+k] = { el: c, text: (c.textContent||"").trim() };
                    occ[col+k] = rs - 1;
                }
                col += cs;
            }
            for (let i=0;i<occ.length;i++) if (occ[i] > 0) occ[i]--;
        }

        const cols = Math.max(...grid.map(r => r.length));
        return { grid, rows, cols };
    }

    function findColumnIndices(grid, targets) {
        const out = {};
        const t = targets.map(x=>x.toLowerCase());
        for (let r = 0; r < grid.grid.length; r++) {
            for (let c = 0; c < grid.grid[r].length; c++) {
                const cell = grid.grid[r][c];
                if (!cell) continue;
                const txt = cell.text.toLowerCase();
                for (let k=0;k<t.length;k++) {
                    const key = t[k];
                    if (txt === key || txt.includes(key)) {
                        out[key] = c;
                    }
                }
            }
        }
        return out;
    }

    function getCell(row, targetIdx) {
        const tds = Array.from(row.querySelectorAll("td,th"));
        let col = 0;
        for (const cell of tds) {
            const cs = Number(cell.getAttribute('colspan')) || 1;
            if (col <= targetIdx && targetIdx < col + cs) return cell;
            col += cs;
        }
        return null;
    }

    function computeGPA(table, colIdx) {
        const rows = Array.from(table.querySelectorAll("tbody tr"))
            .filter(r => r.querySelectorAll("td").length > 0);

        const valuesUW = [];
        const valuesW  = [];

        for (const r of rows) {
            const cell = getCell(r, colIdx);
            if (!cell) continue;

            const letter = extractLetter(cell.innerText);
            if (!letter) continue;

            const base = letterMap[letter];
            if (base == null) continue;

            // extract course name from the Course column (colIndex determined earlier)
            const courseCell = getCell(r, courseColIndex);
            const courseText = courseCell ? courseCell.innerText : "";
            const weight = isAP(courseText) ? 1.0 : 0.0;

            valuesUW.push(base);
            valuesW.push(Math.min(base + weight, 5.0)); // ceiling just in case
        }

        if (valuesUW.length === 0) return { uw: null, w: null };

        const uw = valuesUW.reduce((a,b)=>a+b,0)/valuesUW.length;
        const w  = valuesW.reduce((a,b)=>a+b,0)/valuesW.length;

        return { uw, w };
    }

    let courseColIndex = null; // we fill this after grid

    function injectRow(table) {
        removeRow();

        if (!isVisible()) return;

        const grid = buildHeaderGrid(table);
        if (!grid) return;

        const cols = grid.cols;

        // Find all period columns (Q1, S1, Q3, S2)
        const found = findColumnIndices(grid, ["Q1","S1","Q3","S2"]);
        const periodColumns = [];

        if (found["q1"] !== undefined) periodColumns.push({name: "Q1", index: found["q1"]});
        if (found["s1"] !== undefined) periodColumns.push({name: "S1", index: found["s1"]});
        if (found["q3"] !== undefined) periodColumns.push({name: "Q3", index: found["q3"]});
        if (found["s2"] !== undefined) periodColumns.push({name: "S2", index: found["s2"]});

        if (periodColumns.length === 0) return;

        // find Course column (text exactly "Course")
        for (let r=0;r<grid.grid.length;r++) {
            for (let c=0;c<grid.grid[r].length;c++) {
                if (!grid.grid[r][c]) continue;
                if (grid.grid[r][c].text.toLowerCase() === "course") {
                    courseColIndex = c;
                }
            }
        }

        // Compute GPA for each period column
        const gpaData = {};
        periodColumns.forEach(col => {
            gpaData[col.name] = computeGPA(table, col.index);
        });

        // Create a new row that will be inserted after the last header row
        const tr = document.createElement("tr");
        tr.id = INJECT_ID;
        tr.style.background = "#f8f9fa";
        tr.style.borderTop = "1px solid #dee2e6";
        tr.style.fontSize = "0.85em";

        // Create a cell for each logical column
        for (let c = 0; c < cols; c++) {
            const td = document.createElement("td");
            td.style.padding = "6px 8px";
            td.style.textAlign = "center";
            td.style.verticalAlign = "middle";

            // Check if this column is one of our period columns
            const periodCol = periodColumns.find(p => p.index === c);
            if (periodCol) {
                const gpa = gpaData[periodCol.name];
                if (gpa.uw !== null) {
                    td.innerHTML = `
                        <div style="margin-bottom: 2px;"><strong>UW:</strong> ${gpa.uw.toFixed(3)}</div>
                        <div><strong>W:</strong> ${gpa.w.toFixed(3)}</div>
                    `;
                    td.style.backgroundColor = "#e9ecef";
                    td.style.borderRadius = "4px";
                    td.style.padding = "4px";
                }
            }

            // Add toggle button in the last column
            if (c === cols - 1) {
                const btn = document.createElement("button");
                btn.style.padding = "4px 8px";
                btn.style.fontSize = "0.8em";
                btn.style.cursor = "pointer";
                btn.style.border = "1px solid #6c757d";
                btn.style.borderRadius = "4px";
                btn.style.backgroundColor = "#6c757d";
                btn.style.color = "white";
                btn.textContent = "Hide";

                btn.onclick = () => {
                    setVisible(false);
                    removeRow();
                };

                td.appendChild(btn);
            }

            tr.appendChild(td);
        }

        // Insert under final header row
        const headers = grid.rows;
        const lastHeader = headers[headers.length-1];
        lastHeader.parentNode.insertBefore(tr, lastHeader.nextSibling);
    }

    function removeRow() {
        const ex = document.getElementById(INJECT_ID);
        if (ex) ex.remove();
    }

    function run() {
        const table = findAttendanceTable();
        if (!table) return;

        removeRow();

        if (isVisible()) injectRow(table);
        else {
            showRevealButton(table);
        }
    }

    function showRevealButton(table) {
        removeRow();
        const grid = buildHeaderGrid(table);
        if (!grid) return;

        const cols = grid.cols;
        const tr = document.createElement("tr");
        tr.id = INJECT_ID;

        // Create a single cell that spans all columns
        const td = document.createElement("td");
        td.colSpan = cols;
        td.style.padding = "8px";
        td.style.textAlign = "right";

        const btn = document.createElement("button");
        btn.style.padding = "4px 8px";
        btn.style.fontSize = "0.8em";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #6c757d";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = "#6c757d";
        btn.style.color = "white";
        btn.textContent = "Show GPA";   // click to show again

        btn.onclick = () => {
            setVisible(true);
            run();
        };

        td.appendChild(btn);
        tr.appendChild(td);

        const lastHeader = grid.rows[grid.rows.length-1];
        lastHeader.parentNode.insertBefore(tr, lastHeader.nextSibling);
    }

    // Initial delayed run
    setTimeout(run, 600);

    // Controlled MutationObserver
    let timer = null;
    new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(run, 500);
    }).observe(document.body, { childList: true, subtree: true });

})();