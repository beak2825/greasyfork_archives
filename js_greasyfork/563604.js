// ==UserScript==
// @name         HS AB Test - Open/Eligible Ratio Calculator
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Calculates Open/Eligible ratio from CTR by Viewable Links and HS homepage AB test PV panels, plus Internal Bounce Rate
// @author       attila.virag@centralmediacsoport.hu
// @match        https://hub.marfeel.com/workspaces/25571?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563604/HS%20AB%20Test%20-%20OpenEligible%20Ratio%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/563604/HS%20AB%20Test%20-%20OpenEligible%20Ratio%20Calculator.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const NBSP = String.fromCharCode(160);
    const NL = String.fromCharCode(10);
    const MODULES = ["abTest=A", "abTest=B", "abTest=C", "abTest=D", "abTest=E", "abTest=Default"];
    const MODULE_LETTERS = { "abTest=A": "A", "abTest=B": "B", "abTest=C": "C", "abTest=D": "D", "abTest=E": "E", "abTest=Default": "Default" };

    let panelElement = null;
    let observer = null;
    let isCalculating = false;
    let lastDataHash = "";

    function parseNum(s) {
        if (!s) return 0;
        const cleaned = s.split(NBSP).join("").split(" ").join("").replace(",", ".");
        return parseFloat(cleaned) || 0;
    }

    function formatNumber(num) {
        const rounded = Math.round(num);
        return rounded.toLocaleString('fr-FR').replace(/\\\\u00A0/g, ' ');
    }

    function matchesModule(line, mod) {
        const regex = new RegExp(mod + "(?![a-zA-Z])");
        return regex.test(line);
    }

    function createPanel() {
        if (panelElement) return;
        panelElement = document.createElement("div");
        panelElement.id = "hs-ratio-panel";
        panelElement.style.cssText = "position:fixed;bottom:20px;left:70px;background:#ffffff;border-radius:8px;padding:12px 16px;box-shadow:rgba(0,0,0,0.16) 0px 5px 40px;z-index:10000;font-family:Poppins,sans-serif;font-size:12px;max-width:700px;";

        const title = document.createElement("h4");
        title.style.cssText = "margin:0 0 10px 0;font-size:14px;font-weight:600;color:#1a1a2e;border-bottom:1px solid #eee;padding-bottom:8px;";
        title.textContent = "Link Open / Eligible PV Ratio";

        const content = document.createElement("div");
        content.id = "hs-ratio-content";
        content.innerHTML = "<span style='color:#999;font-style:italic;'>Loading...</span>";

        panelElement.appendChild(title);
        panelElement.appendChild(content);
        document.body.appendChild(panelElement);
    }

    function findSectionByHeading(headingText) {
        const h2s = document.querySelectorAll("h2");
        for (const h2 of h2s) {
            if (h2.textContent.trim() === headingText) {
                return h2.closest("section");
            }
        }
        return null;
    }

    function findCTByHostSection(letter) {
        const h2s = document.querySelectorAll("h2");
        for (const h2 of h2s) {
            const text = h2.textContent.trim();
            if (text === "CT by host on [" + letter + "]") {
                return h2.closest("section");
            }
        }
        return null;
    }

    function getInternalBounceOpen(section) {
        if (!section) return 0;
        const lines = section.innerText.split(NL).filter(l => l.trim());
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === "www.hirstart.hu") {
                // A következő sor tartalmazza az Open értéket
                if (lines[i + 1]) {
                    return parseNum(lines[i + 1]);
                }
            }
        }
        return 0;
    }

    function calculateAndDisplay() {
        if (isCalculating) return;
        isCalculating = true;

        const contentDiv = document.getElementById("hs-ratio-content");
        if (!contentDiv) {
            isCalculating = false;
            return;
        }

        const ctrSection = findSectionByHeading("CTR by Viewable Links");
        const hsSection = findSectionByHeading("HS homepage AB test PV");

        if (!ctrSection || !hsSection) {
            contentDiv.innerHTML = "<span style='color:#999;font-style:italic;'>Panels not found. Please wait...</span>";
            isCalculating = false;
            return;
        }

        const ctrLines = ctrSection.innerText.split(NL).filter(l => l.trim());
        const hsLines = hsSection.innerText.split(NL).filter(l => l.trim());

        // Internal bounce data
        const internalBounceData = {};
        for (const mod of MODULES) {
            const letter = MODULE_LETTERS[mod];
            const ctByHostSection = findCTByHostSection(letter);
            internalBounceData[mod] = getInternalBounceOpen(ctByHostSection);
        }

        const currentHash = ctrLines.join("|") + "###" + hsLines.join("|") + "###" + JSON.stringify(internalBounceData);
        if (currentHash === lastDataHash) {
            isCalculating = false;
            return;
        }
        lastDataHash = currentHash;

        const openData = {};
        const eligibleData = {};

        for (const mod of MODULES) {
            for (let j = 0; j < ctrLines.length; j++) {
                if (matchesModule(ctrLines[j], mod) && ctrLines[j].indexOf("[P]") === -1) {
                    openData[mod] = parseNum(ctrLines[j + 3]);
                    break;
                }
            }
            for (let k = 0; k < hsLines.length; k++) {
                if (matchesModule(hsLines[k], mod) && hsLines[k].indexOf("[P]") > -1) {
                    eligibleData[mod] = parseNum(hsLines[k + 1]);
                    break;
                }
            }
        }

        if (Object.keys(openData).length === 0 || Object.keys(eligibleData).length === 0) {
            contentDiv.innerHTML = "<span style='color:#999;font-style:italic;'>Could not extract data.</span>";
            isCalculating = false;
            return;
        }

        const results = [];
        for (const mod in openData) {
            if (openData.hasOwnProperty(mod) && eligibleData[mod] && eligibleData[mod] > 0) {
                const intBounceOpen = internalBounceData[mod] || 0;
                const intBounceRate = eligibleData[mod] > 0 ? (intBounceOpen / eligibleData[mod]) * 100 : 0;
                results.push({
                    module: mod,
                    open: openData[mod],
                    eligible: eligibleData[mod],
                    ratio: (openData[mod] / eligibleData[mod]) * 100,
                    intBounceOpen: intBounceOpen,
                    intBounceRate: intBounceRate
                });
            }
        }

        if (results.length === 0) {
            contentDiv.innerHTML = "<span style='color:#999;font-style:italic;'>No matching modules found.</span>";
            isCalculating = false;
            return;
        }

        results.sort((a, b) => b.ratio - a.ratio);
        renderTable(contentDiv, results);
        isCalculating = false;
    }

    function renderTable(contentDiv, results) {
        const filteredResults = results.filter(r => r.open >= 10);

        if (filteredResults.length === 0) {
            contentDiv.innerHTML = "<span style='color:#999;font-style:italic;'>No modules with Open >= 10.</span>";
            return;
        }

        let defaultRatio = null;
        let defaultIntBounceRate = null;
        for (const r of filteredResults) {
            if (r.module === "abTest=Default") {
                defaultRatio = r.ratio;
                defaultIntBounceRate = r.intBounceRate;
                break;
            }
        }

        let html = "<table style='width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;'>";
        html += "<tr style='background-color:#f8f9fa;'>";
        html += "<th style='text-align:left;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Module</th>";
        html += "<th style='text-align:right;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Open</th>";
        html += "<th style='text-align:right;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Eligible</th>";
        html += "<th style='text-align:right;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Ratio</th>";
        html += "<th style='text-align:right;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Diff</th>";
        html += "<th style='text-align:right;padding:10px 12px;font-weight:600;color:#666;font-size:11px;text-transform:uppercase;border-bottom:2px solid #e5e7eb;'>Int.Bounce</th>";
        html += "</tr>";

        filteredResults.forEach((r, i) => {
            const rowBg = i % 2 === 0 ? "background-color:#ffffff;" : "background-color:#f3f4f6;";
            const isLast = i === filteredResults.length - 1;
            const borderStyle = isLast ? "" : "border-bottom:1px solid #e5e7eb;";
            const openFormatted = formatNumber(r.open);
            const eligibleFormatted = formatNumber(r.eligible);

            // Diff column
            let diffHtml = "";
            if (r.module === "abTest=Default") {
                diffHtml = '<td style="text-align:right;padding:10px 12px;color:#999;' + borderStyle + '">—</td>';
            } else if (defaultRatio !== null && defaultRatio > 0) {
                const diff = ((r.ratio - defaultRatio) / defaultRatio) * 100;
                const diffFormatted = diff.toFixed(1);
                const diffSign = diff >= 0 ? "+" : "";
                const diffColor = diff >= 0 ? "#16a34a" : "#dc2626";
                diffHtml = '<td style="text-align:right;padding:10px 12px;font-weight:600;color:' + diffColor + ';' + borderStyle + '">' + diffSign + diffFormatted + '%</td>';
            } else {
                diffHtml = '<td style="text-align:right;padding:10px 12px;color:#999;' + borderStyle + '">—</td>';
            }

            // Internal Bounce Rate column
            let intBounceHtml = "";
            if (r.module === "abTest=Default") {
                intBounceHtml = '<td style="text-align:right;padding:10px 12px;color:#333;font-weight:600;' + borderStyle + '">' + r.intBounceRate.toFixed(1) + '%</td>';
            } else if (defaultIntBounceRate !== null) {
                // Alacsonyabb bounce rate = jobb = zöld, Magasabb bounce rate = rosszabb = piros
                const intBounceColor = r.intBounceRate < defaultIntBounceRate ? "#16a34a" : (r.intBounceRate > defaultIntBounceRate ? "#dc2626" : "#333");
                intBounceHtml = '<td style="text-align:right;padding:10px 12px;font-weight:600;color:' + intBounceColor + ';' + borderStyle + '">' + r.intBounceRate.toFixed(1) + '%</td>';
            } else {
                intBounceHtml = '<td style="text-align:right;padding:10px 12px;color:#333;' + borderStyle + '">' + r.intBounceRate.toFixed(1) + '%</td>';
            }

            html += '<tr style="' + rowBg + '">';
            html += '<td style="padding:10px 12px;color:#333;' + borderStyle + '">' + r.module.replace("abTest=", "") + '</td>';
            html += '<td style="text-align:right;padding:10px 12px;color:#333;' + borderStyle + '">' + openFormatted + '</td>';
            html += '<td style="text-align:right;padding:10px 12px;color:#333;' + borderStyle + '">' + eligibleFormatted + '</td>';
            html += '<td style="text-align:right;padding:10px 12px;font-weight:600;color:#2563eb;' + borderStyle + '">' + r.ratio.toFixed(1) + '%</td>';
            html += diffHtml;
            html += intBounceHtml;
            html += "</tr>";
        });

        html += "</table>";
        contentDiv.innerHTML = html;
    }

    function init() {
        createPanel();
        setTimeout(calculateAndDisplay, 2000);

        observer = new MutationObserver((mutations) => {
            const hasRelevantChange = mutations.some(mutation => {
                const target = mutation.target;
                return target.closest && (
                    target.closest('section') ||
                    target.tagName === 'SECTION'
                );
            });

            if (hasRelevantChange) {
                requestAnimationFrame(() => {
                    setTimeout(calculateAndDisplay, 500);
                });
            }
        });

        const mainContent = document.querySelector('main') || document.body;
        observer.observe(mainContent, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();