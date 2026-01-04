// ==UserScript==
// @name         BUP UCAM Playground
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calculates In-Course marks and guide you to achieve better result.
// @author       mdtiTAHSIN
// @match        https://ucam.bup.edu.bd/miu/result/StudentExamMarkSummary.aspx*
// @icon         https://ucam.bup.edu.bd/Images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561046/BUP%20UCAM%20Playground.user.js
// @updateURL https://update.greasyfork.org/scripts/561046/BUP%20UCAM%20Playground.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TABLE_ID_PARTIAL = 'ExamMarkSummaryDetails';
    const RESULT_ROW_ID = 'userscript_calc_row';
    const PREDICTION_ID = 'userscript_prediction_card';

    // Grading Scale
    const GRADING_SCALE = [
        { grade: 'A+', point: '4.00', min: 80 },
        { grade: 'A', point: '3.75', min: 75 },
        { grade: 'A-', point: '3.50', min: 70 },
        { grade: 'B+', point: '3.25', min: 65 },
        { grade: 'B', point: '3.00', min: 60 },
        { grade: 'B-', point: '2.75', min: 55 },
        { grade: 'C+', point: '2.50', min: 50 },
        { grade: 'C', point: '2.25', min: 45 },
        { grade: 'D', point: '2.00', min: 40 }
    ];

    function parseMark(text) {
        if (!text) return 0;
        text = text.trim();
        if (text === '--' || text === '' || text.toLowerCase().includes('absent')) return 0;
        return parseFloat(text) || 0;
    }

    // --- 1. Grade Predictor UI ---
    function renderGradePredictor(targetTable, obtainedInCourse, maxInCourse, isLab) {
        if (maxInCourse <= 0) return;

        const container = targetTable.closest('.card-body') || targetTable.parentElement;
        let wrapper = document.getElementById(PREDICTION_ID);

        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = PREDICTION_ID;
            wrapper.style.marginTop = '15px';
            wrapper.style.maxWidth = '500px';

            const toggleBtn = document.createElement('button');
            toggleBtn.innerText = "Show Grade Targets";
            Object.assign(toggleBtn.style, {
                backgroundColor: '#198754', color: 'white', border: 'none',
                padding: '8px 15px', borderRadius: '5px', fontSize: '13px',
                cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '5px'
            });

            const contentDiv = document.createElement('div');
            contentDiv.id = 'userscript_prediction_content';
            contentDiv.style.display = 'none';
            contentDiv.style.marginTop = '10px';
            contentDiv.style.padding = '10px';
            contentDiv.style.border = '1px solid #d1e7dd';
            contentDiv.style.borderRadius = '5px';
            contentDiv.style.backgroundColor = '#f8fdfa';

            toggleBtn.onclick = (e) => {
                e.preventDefault();
                const isHidden = contentDiv.style.display === 'none';
                contentDiv.style.display = isHidden ? 'block' : 'none';
                toggleBtn.innerText = isHidden ? "Hide Grade Targets" : "Show Grade Targets";
                toggleBtn.style.backgroundColor = isHidden ? '#dc3545' : '#198754';
            };

            wrapper.appendChild(toggleBtn);
            wrapper.appendChild(contentDiv);
            container.appendChild(wrapper);
        }

        const contentDiv = wrapper.querySelector('#userscript_prediction_content');
        let multiplier = 1;
        let maxPaperMark = 100;

        if (isLab) {
            maxPaperMark = 40;
            multiplier = 1.0;
        }
        else {
            if (maxInCourse > 55) {
                multiplier = 2.5;
            } else {
                multiplier = 2.0;
            }
        }

        const headerText = `Final Exam Targets (Paper mark out of ${maxPaperMark})`;

        let tbodyRows = '';
        GRADING_SCALE.forEach((tier) => {
            let gap = tier.min - obtainedInCourse;
            let requiredPaperMark = gap * multiplier;
            let statusText = '', rowStyle = 'border-bottom: 1px solid #eee;', statusColor = '#333';

            if (gap <= 0) {
                statusText = "Done ✅";
                rowStyle += 'background-color: #d1e7dd; color: #0f5132; font-weight: bold;'; statusColor = '#0f5132';
            } else if (requiredPaperMark > maxPaperMark) {
                statusText = "-"; statusColor = '#ccc'; rowStyle += 'color: #aaa;';
            } else {
                statusText = `${requiredPaperMark.toFixed(2)}`; statusColor = '#000';
            }

            tbodyRows += `<tr style="${rowStyle}">
                <td style="padding: 4px;">${tier.grade}</td>
                <td style="padding: 4px; text-align: center;">${tier.point}</td>
                <td style="padding: 4px; text-align: center; color: ${statusColor}; font-weight: bold;">${statusText}</td>
            </tr>`;
        });

        contentDiv.innerHTML = `<div style="font-weight: bold; color: #0f5132; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 13px;">${headerText}</div>
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead><tr style="background-color: #eee; color: #333;"><th style="padding:5px;">Grade</th><th style="padding:5px; text-align:center;">GPA</th><th style="padding:5px; text-align:center;">Need</th></tr></thead>
            <tbody>${tbodyRows}</tbody>
        </table>`;
    }

    // --- 2. Smart Calculation Engine ---
    function updateCalculations(table) {
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(tr => !tr.querySelector('th') && tr.id !== RESULT_ROW_ID);
        const rowText = table.innerText.toLowerCase();
        const isLab = rowText.includes('quiz');

        let totalObtained = 0;
        let totalMax = 0;

        if (rows.length === 0 || rowText.includes('no data found')) {
        }
        else if (isLab) {
            // === LAB LOGIC ===
            let quiz = {o:0, t:0}, othersO = 0, othersM = 0;
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return;
                const name = cells[1].innerText.trim().toLowerCase();
                const total = parseMark(cells[2].innerText);
                const obtained = parseMark(cells[3].innerText);

                if (name.includes('quiz')) { quiz.o += obtained; quiz.t += total; }
                else { othersO += obtained; othersM += total; }
            });

            let quizScore = (quiz.t > 0) ? (quiz.o / quiz.t) * 20 : 0;
            let quizMax = (quiz.t > 0) ? 20 : 0;
            totalObtained = quizScore + othersO;
            totalMax = quizMax + othersM;

        } else {
            // === THEORY LOGIC ===
            let cts = [], mid = {o:0, t:0}, othersO = 0, othersM = 0;

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return;
                const name = cells[1].innerText.trim().toLowerCase();
                const total = parseMark(cells[2].innerText);
                const obtained = parseMark(cells[3].innerText);

                if (name.includes('class test')) {
                    cts.push({o: obtained, t: total});
                } else if (name.includes('mid term')) {
                    mid = {o: obtained, t: total};
                } else {
                    othersO += obtained;
                    othersM += total;
                }
            });

            let ctScore = 0;
            let ctMaxWeighted = 0;
            if (cts.length > 0) {
                ctMaxWeighted = 10.00;
                let sumCtMax = cts.reduce((acc, curr) => acc + curr.t, 0);
                if (sumCtMax <= 15) {
                    ctScore = cts.reduce((acc, curr) => acc + curr.o, 0);
                } else {
                    let normalizedCTs = cts.map(ct => (ct.t > 0) ? (ct.o / ct.t) * 10 : 0);
                    normalizedCTs.sort((a, b) => b - a);
                    const top3 = normalizedCTs.slice(0, 3);
                    if (top3.length > 0) {
                        ctScore = top3.reduce((a, b) => a + b, 0) / 3;
                    }
                }
            }

            let midScore = 0;
            let midMaxWeighted = 0;
            if (mid.t > 0) {
                midMaxWeighted = 20.00;
                midScore = (mid.o / mid.t) * 20;
            }

            totalObtained = ctScore + midScore + othersO;
            totalMax = ctMaxWeighted + midMaxWeighted + othersM;
            if(totalMax > 49 && totalMax < 51) totalMax = 50.00;
            if(totalMax > 59 && totalMax < 61) totalMax = 60.00;
        }

        const resultRow = table.querySelector('#' + RESULT_ROW_ID);
        if (resultRow) {
            resultRow.cells[2].innerText = totalMax.toFixed(2);
            resultRow.cells[3].innerText = totalObtained.toFixed(2);
        } else {
            createResultRow(table, totalObtained, totalMax);
        }

        renderGradePredictor(table, totalObtained, totalMax, isLab);
    }

    // --- 3. Editable Cells ---
    function makeCellsEditable(table) {
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(tr => !tr.querySelector('th') && tr.id !== RESULT_ROW_ID);
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;
            const targetCell = cells[3];
            const maxCell = cells[2];

            if (targetCell.getAttribute('data-processed') === 'true') return;
            targetCell.setAttribute('data-processed', 'true');

            if (targetCell.innerText.trim() !== '--') return;

            Object.assign(targetCell.style, {
                cursor: 'pointer', backgroundColor: '#fff3cd', border: '1px dashed #ffc107', title: "Click to Simulate"
            });

            targetCell.onclick = function() {
                if (this.querySelector('input')) return;
                const val = (this.innerText.trim() === '--') ? '' : this.innerText.trim();
                const maxVal = parseFloat(maxCell.innerText.trim()) || 100;

                const input = document.createElement('input');
                input.type = 'number';
                input.value = val;
                Object.assign(input.style, { width: '60px', padding: '2px', textAlign: 'center' });

                const save = () => {
                    let newVal = parseFloat(input.value);
                    if (isNaN(newVal)) { this.innerText = '--'; }
                    else {
                        if (newVal < 0) newVal = 0;
                        if (newVal > maxVal) newVal = maxVal;
                        this.innerText = newVal.toFixed(2);
                    }
                    updateCalculations(table);
                };
                input.onblur = save;
                input.onkeydown = (e) => { if(e.key === 'Enter') save(); };
                this.innerText = '';
                this.appendChild(input);
                input.focus();
            };
        });
    }

    function createResultRow(table, totalObtained, maxMarks) {
        if (table.querySelector('#' + RESULT_ROW_ID)) return;
        const tr = document.createElement('tr');
        tr.id = RESULT_ROW_ID;
        Object.assign(tr.style, { backgroundColor: '#d1e7dd', fontWeight: 'bold', color: '#0f5132', borderTop: '2px solid #0f5132' });
        tr.innerHTML = `<td></td><td align="right" style="padding-right:15px;">Total Obtained</td>
                        <td align="center">${maxMarks.toFixed(2)}</td><td align="center">${totalObtained.toFixed(2)}</td>`;
        table.querySelector('tbody').appendChild(tr);
    }

    setInterval(() => {
        const table = document.querySelector(`table[id$="${TABLE_ID_PARTIAL}"]`);
        if (table) {
            if (table.innerText.toLowerCase().includes('no data found')) return;
            makeCellsEditable(table);
            if (!table.querySelector('#' + RESULT_ROW_ID)) updateCalculations(table);
        }
    }, 1000);

})();