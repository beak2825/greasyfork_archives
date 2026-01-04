// ==UserScript==
// @license MIT
// @name         PowerSchool GPA Calculator (4.3 Scale + Weighted)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Calculates unweighted & weighted GPA on PowerSchool using 4.3 scale.
// @author       n0tbond
// @match        *://*/guardian/studentGrades.html*
// @match        *://*/guardian/home.html*
// @match        *://*/guardian/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557499/PowerSchool%20GPA%20Calculator%20%2843%20Scale%20%2B%20Weighted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557499/PowerSchool%20GPA%20Calculator%20%2843%20Scale%20%2B%20Weighted%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ----------- COURSE WEIGHT KEYWORDS ----------- **/
    const AP_KEYWORDS = ["AP ", "Advanced Placement", "IB HL", "IB Higher"];
    const HONORS_KEYWORDS = ["Honors", "Hons", "Pre-IB", "Pre-AP"];

    const AP_WEIGHT = 1.0;
    const HONORS_WEIGHT = 0.5;

    /** ----------- 4.3 SCALE: Percent → GPA ----------- **/
    function percentToGPA(p) {
        if (p >= 97) return 4.3; 
        if (p >= 93) return 4.0;
        if (p >= 90) return 3.7;
        if (p >= 87) return 3.3;
        if (p >= 83) return 3.0;
        if (p >= 80) return 2.7;
        if (p >= 77) return 2.3;
        if (p >= 73) return 2.0;
        if (p >= 70) return 1.7;
        if (p >= 67) return 1.3;
        if (p >= 65) return 1.0;
        return 0.0;
    }

    /** ----------- Try to extract the % grade ----------- **/
    function extractPercent(text) {
        const match = text.replace(',', '').match(/(\d{1,3})(?=%)/);
        return match ? parseInt(match[1], 10) : null;
    }

    /** ----------- Determine Course Weight ----------- **/
    function getWeight(courseName) {
        const name = courseName.toLowerCase();

        for (let key of AP_KEYWORDS) {
            if (name.includes(key.toLowerCase())) return AP_WEIGHT;
        }
        for (let key of HONORS_KEYWORDS) {
            if (name.includes(key.toLowerCase())) return HONORS_WEIGHT;
        }
        return 0; // regular class
    }

    /** ----------- Calculate GPA ----------- **/
    function calculateGPA() {
        const rows = Array.from(document.querySelectorAll("tr"));
        const classInfo = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 2) return;

            const courseName = cells[0].innerText.trim();

            let percent = null;
            for (let c of cells) {
                const p = extractPercent(c.innerText.trim());
                if (p !== null && p <= 120) {
                    percent = p;
                    break;
                }
            }
            if (percent === null) return;

            const baseGPA = percentToGPA(percent);
            const weight = getWeight(courseName);
            const weightedGPA = baseGPA + weight;

            classInfo.push({
                name: courseName,
                percent,
                baseGPA,
                weightedGPA
            });
        });

        if (classInfo.length === 0) {
            console.log("No grades detected.");
            return;
        }

        const unweighted = (classInfo.reduce((a,b) => a + b.baseGPA, 0) / classInfo.length).toFixed(2);
        const weighted = (classInfo.reduce((a,b) => a + b.weightedGPA, 0) / classInfo.length).toFixed(2);

        displayGPA(unweighted, weighted, classInfo);
    }

    /** ----------- Display GPA UI ----------- **/
    function displayGPA(unweighted, weighted, classes) {
        const old = document.getElementById("gpa-calculator-box");
        if (old) old.remove();

        const box = document.createElement("div");
        box.id = "gpa-calculator-box";
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "20px";
        box.style.zIndex = "999999";
        box.style.background = "white";
        box.style.border = "2px solid #3b82f6";
        box.style.padding = "14px 18px";
        box.style.borderRadius = "10px";
        box.style.fontSize = "15px";
        box.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        box.style.fontFamily = "Arial";
        box.style.maxWidth = "280px";

        let html = `
            <b style="font-size:18px;">GPA (4.3 Scale)</b><br>
            <b>Unweighted:</b> ${unweighted}<br>
            <b>Weighted:</b> ${weighted}<br><br>
            <div style="max-height: 180px; overflow-y:auto;">
        `;

        classes.forEach((cls, i) => {
            html += `
                <b>${cls.name}</b><br>
                ${cls.percent}% → ${cls.baseGPA.toFixed(1)} (uw) / ${cls.weightedGPA.toFixed(1)} (w)<br><br>
            `;
        });

        html += "</div>";
        box.innerHTML = html;

        document.body.appendChild(box);
    }

    /** ----------- Run ----------- **/
    window.addEventListener("load", () => {
        setTimeout(calculateGPA, 800);
    });
})();
