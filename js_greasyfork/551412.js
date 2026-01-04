// ==UserScript==
// @name         Arson Helper
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Enhanced Arson Helper with preferred styling, live-updating table, and customizable columns
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/551412/Arson%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551412/Arson%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Momentum class mappings
    const momentumClasses = {
        "momentum0___U14Ka": 0,
        "momentum1___Mqac1": 1,
        "momentum2___F7nSq": 2,
        "momentum3___Enujb": 3,
        "momentum4___F6WaA": 4,
        "momentum5___Mc7Gg": 5,
        "momentum6___I6xHR": 6,
        "momentum7___suWvE": 7,
        "momentum8___sFPix": 8,
        "momentum9___JLTIe": 9,
        "momentum10___qP8Az": 10
    };

    // Settings configuration
    const settingsMap = {
        showTitle: { id: "showTitle", desc: "Show Title", isTrue: true },
        showScenario: { id: "showScenario", desc: "Show Scenario", isTrue: true },
        showResponderStatus: { id: "showResponderStatus", desc: "Show Responder Status", isTrue: true },
        showDamage: { id: "showDamage", desc: "Show Damage (%)", isTrue: true },
        showFlameStatus: { id: "showFlameStatus", desc: "Show Flame Status", isTrue: true },
        showMomentum: { id: "showMomentum", desc: "Show Momentum", isTrue: true }
    };

    // Read and save settings
    function readSettings() { for (const key in settingsMap) settingsMap[key].isTrue = GM_getValue(settingsMap[key].id, settingsMap[key].isTrue); }
    function saveSettings() { for (const key in settingsMap) GM_setValue(settingsMap[key].id, settingsMap[key].isTrue); }
    readSettings();

    // Main color
    const SCRIPT_COLOR_MAIN = "#0078d4";

    // Add CSS styles
    GM_addStyle(`
        .highlighted {
            background-color: rgba(255, 255, 0, 0.5) !important;
            border: 1px solid yellow !important;
        }
        .arson-panel {
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 9999;
            font-size: 14px;
            padding: 10px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            overflow: auto;
            width: 700px;
            height: auto;
            backdrop-filter: blur(8px);
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
        }
        .arson-panel.dragging { box-shadow: 0 6px 25px rgba(0, 0, 0, 0.6); }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            padding-bottom: 8px;
        }
        .panel-title { font-weight: bold; font-size: 16px; color: ${SCRIPT_COLOR_MAIN}; }
        .panel-buttons { display: flex; gap: 8px; }
        .panel-button {
            background-color: ${SCRIPT_COLOR_MAIN};
            color: white;
            border: none;
            padding: 6px 12px;
            margin-left: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .panel-button:hover { background-color: #005ea2; transform: scale(1.05); }
        .panel-button:active { transform: scale(0.95); }
        .panel-content { margin-top: 10px; max-height: 400px; overflow-y: auto; }
        .arson-table {
            width: 100%;
            border-collapse: collapse;
            color: #fff;
            margin-top: 10px;
            font-family: Arial, sans-serif;
        }
        .arson-table th, .arson-table td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .arson-table th {
            background-color: rgba(0, 120, 212, 0.9);
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
        }
        .arson-table td {
            background-color: rgba(20, 150, 215, 0.4);
            color: #e0e0e0;
            font-size: 12px;
        }
        .arson-table tr:hover td {
            background-color: rgba(0, 80, 140, 0.6);
            transition: background-color 0.2s ease;
        }
        .arson-table td:nth-child(4), .arson-table td:nth-child(6) {
            text-align: center;
        }
        .no-targets {
            text-align: center;
            padding: 15px;
            font-style: italic;
            color: #ccc;
        }
        .dropdown {
            position: relative;
            display: inline-block;
        }
        .dropdown-content {
            display: none;
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            min-width: 200px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            padding: 10px;
            right: 0;
        }
        .dropdown:hover .dropdown-content { display: block; }
        .dropdown-item { padding: 5px 10px; cursor: pointer; color: #e0e0e0; }
        .dropdown-item:hover { background-color: rgba(255, 255, 255, 0.1); }
        .dropdown-item input { margin-right: 8px; }
    `);

    function showThings() {
        console.log("ARSON!");
        const panel = GetArsonPopup();
        updateTargetTable(panel);
    }

    const GetArsonPopup = () => {
        if (!document.querySelector(".arson-panel")) {
            let panel = document.createElement("div");
            panel.className = "arson-panel";
            const savedPos = GM_getValue("arsonPanel_position", { top: "50px", left: "50px" });
            panel.style.top = savedPos.top;
            panel.style.left = savedPos.left;

            panel.innerHTML = `
                <div class="panel-header" id="panelHeader">
                    <span class="panel-title">Arson Target Tracker</span>
                    <div class="panel-buttons">
                        <div class="dropdown">
                            <button class="panel-button">Settings</button>
                            <div class="dropdown-content" id="settingsDropdown">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        <button id="script_toggleButton" class="panel-button">Hide</button>
                    </div>
                </div>
                <div id="script_panelContent" class="panel-content">
                    <table id="arsonTargetTable" class="arson-table">
                        <thead id="arsonTargetTableHead"></thead>
                        <tbody id="arsonTargetTableBody"></tbody>
                    </table>
                </div>`;

            document.body.appendChild(panel);

            // Dragging functionality with throttle
            let isDragging = false;
            let startX, startY, initialX, initialY;
            const panelHeader = panel.querySelector("#panelHeader");

            panelHeader.addEventListener("mousedown", (e) => {
                if (e.target.classList.contains("panel-button")) return;
                isDragging = true;
                panel.classList.add("dragging");
                startX = e.clientX;
                startY = e.clientY;
                initialX = panel.offsetLeft;
                initialY = panel.offsetTop;
                e.preventDefault();
            });

            let lastMove = 0;
            document.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                const now = Date.now();
                if (now - lastMove < 16) return; // Throttle to ~60fps
                lastMove = now;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialX + dx));
                const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialY + dy));
                panel.style.left = `${newX}px`;
                panel.style.top = `${newY}px`;
            });

            document.addEventListener("mouseup", () => {
                if (isDragging) {
                    GM_setValue("arsonPanel_position", { top: panel.style.top, left: panel.style.left });
                    isDragging = false;
                    panel.classList.remove("dragging");
                }
            });

            // Toggle button functionality
            const isExpanded = GM_getValue("arsonPanel_isExpanded", true);
            if (!isExpanded) {
                panel.querySelector("#script_panelContent").style.display = "none";
                panel.querySelector("#script_toggleButton").textContent = "Show";
            }

            panel.querySelector("#script_toggleButton").addEventListener("click", () => {
                const isExpanded = GM_getValue("arsonPanel_isExpanded", true);
                const newExpanded = !isExpanded;
                GM_setValue("arsonPanel_isExpanded", newExpanded);
                panel.querySelector("#script_panelContent").style.display = newExpanded ? "block" : "none";
                panel.querySelector("#script_toggleButton").textContent = newExpanded ? "Hide" : "Show";
            });

            // Settings dropdown
            const settingsDropdown = panel.querySelector("#settingsDropdown");
            let settingsHTML = "";
            for (const key in settingsMap) {
                settingsHTML += `<div class="dropdown-item"><input type="checkbox" id="${settingsMap[key].id}" ${settingsMap[key].isTrue ? "checked" : ""}><label for="${settingsMap[key].id}">${settingsMap[key].desc}</label></div>`;
            }
            settingsDropdown.innerHTML = settingsHTML;

            for (const key in settingsMap) {
                settingsDropdown.querySelector(`#${settingsMap[key].id}`).addEventListener("change", () => {
                    settingsMap[key].isTrue = settingsDropdown.querySelector(`#${settingsMap[key].id}`).checked;
                    saveSettings();
                    updateTargetTable(panel);
                });
            }
        }
        return document.querySelector(".arson-panel");
    };

    function updateTargetTable(panel) {
        const tableHead = panel.querySelector("#arsonTargetTableHead");
        const tableBody = panel.querySelector("#arsonTargetTableBody");
        const virtualList = document.querySelector('.virtualList___noLef');
        if (!virtualList || !tableBody || !tableHead) return;

        // Build table header based on settings
        let headerHTML = "<tr>";
        if (settingsMap.showTitle.isTrue) headerHTML += "<th>Title</th>";
        if (settingsMap.showScenario.isTrue) headerHTML += "<th>Scenario</th>";
        if (settingsMap.showResponderStatus.isTrue) headerHTML += "<th>Responder Status</th>";
        if (settingsMap.showDamage.isTrue) headerHTML += "<th>Damage (%)</th>";
        if (settingsMap.showFlameStatus.isTrue) headerHTML += "<th>Flame Status</th>";
        if (settingsMap.showMomentum.isTrue) headerHTML += "<th>Momentum</th>";
        headerHTML += "</tr>";
        tableHead.innerHTML = headerHTML;

        const targets = virtualList.querySelectorAll('.crimeOptionWrapper___IOnLO');
        tableBody.innerHTML = '';

        if (targets.length === 0) {
            const colspan = Object.values(settingsMap).filter(s => s.isTrue).length;
            tableBody.innerHTML = `<tr><td colspan="${colspan}" class="no-targets">No targets available</td></tr>`;
            return;
        }

        targets.forEach(target => {
            const title = target.querySelector('.titleAndScenario___uWExi > div:first-child')?.textContent || 'N/A';
            const scenario = target.querySelector('.scenario___msSka')?.textContent || 'N/A';
            const responderStatus = target.querySelector('.responderStatus___yrWz5')?.getAttribute('aria-label') || 'N/A';
            const damageMeter = target.querySelector('.meter___fXbfr');
            const damagePercent = damageMeter?.getAttribute('aria-valuenow') || '0';
            const flameStatus = target.querySelector('.fireMeter___cexDs')?.getAttribute('aria-label') || 'N/A';
            const flameElement = target.querySelector('.flame___Qg5Fv');
            let momentum = 'N/A';
            if (flameElement) {
                const classes = flameElement.classList;
                const momentumClass = Object.keys(momentumClasses).find(cls => classes.contains(cls));
                momentum = momentumClass ? momentumClasses[momentumClass] : 'N/A';
            }

            const row = document.createElement('tr');
            let rowHTML = "";
            if (settingsMap.showTitle.isTrue) rowHTML += `<td>${title}</td>`;
            if (settingsMap.showScenario.isTrue) rowHTML += `<td>${scenario}</td>`;
            if (settingsMap.showResponderStatus.isTrue) rowHTML += `<td>${responderStatus}</td>`;
            if (settingsMap.showDamage.isTrue) rowHTML += `<td>${damagePercent}%</td>`;
            if (settingsMap.showFlameStatus.isTrue) rowHTML += `<td>${flameStatus}</td>`;
            if (settingsMap.showMomentum.isTrue) rowHTML += `<td>${momentum}</td>`;
            row.innerHTML = rowHTML;
            tableBody.appendChild(row);
        });
    }

    function checkURLChange() {
        const currentURL = window.location.href;
        if (currentURL !== checkURLChange.previousURL) {
            if (window.location.href.includes('#/arson')) {
                showThings();
            }
        }
        checkURLChange.previousURL = currentURL;
    }

    // Initial check and setup periodic update
    checkURLChange();
    setInterval(() => {
        if (window.location.href.includes('#/arson')) {
            const panel = document.querySelector('.arson-panel');
            if (panel) updateTargetTable(panel);
        }
    }, 750);
})();