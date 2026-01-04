// ==UserScript==
// @name         Faction Warring
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Track faction members status, hide Abroad/Traveling, names link to attack pages, BSP link restored, with auto-update toggle
// @author       Apollyon
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552312/Faction%20Warring.user.js
// @updateURL https://update.greasyfork.org/scripts/552312/Faction%20Warring.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isSidebarVisible = false;
    let hideAbroadToggle;
    let autoUpdateToggle;
    let autoUpdateInterval = null;
    let liveTimerInterval = null;

    function createSidebar() {
        let sidebar = document.createElement("div");
        sidebar.id = "factionSidebar";
        sidebar.style.position = "fixed";
        sidebar.style.top = "50px";
        sidebar.style.right = "0";
        sidebar.style.width = "370px";
        sidebar.style.background = "#222";
        sidebar.style.color = "#ccc";
        sidebar.style.padding = "10px";
        sidebar.style.border = "1px solid #444";
        sidebar.style.zIndex = "1000";
        sidebar.style.overflowY = "auto";
        sidebar.style.maxHeight = "500px";
        sidebar.style.transition = "transform 0.3s ease-in-out";
        sidebar.style.transform = "translateX(100%)";

        // --- Faction ID row ---
        let factionIDinputRow = document.createElement("div");
        factionIDinputRow.style.display = "flex";
        factionIDinputRow.style.marginBottom = "10px";

        let factionIDheader = document.createElement("span");
        factionIDheader.innerText = "Faction ID:";
        factionIDheader.style.marginRight = "10px";
        factionIDinputRow.appendChild(factionIDheader);

        let factionInput = document.createElement("input");
        factionInput.type = "text";
        factionInput.style.width = "100px";
        factionInput.value = GM_getValue("factionID", "");
        factionInput.onchange = () => GM_setValue("factionID", factionInput.value);
        factionIDinputRow.appendChild(factionInput);

        sidebar.appendChild(factionIDinputRow);

        // --- Hide Abroad/Traveling Toggle ---
        let toggleRow = document.createElement("div");
        toggleRow.style.marginTop = "10px";

        hideAbroadToggle = document.createElement("input");
        hideAbroadToggle.type = "checkbox";
        hideAbroadToggle.checked = GM_getValue("hideAbroad", false);
        hideAbroadToggle.onchange = () => {
            GM_setValue("hideAbroad", hideAbroadToggle.checked);
            fetchData();
        };

        let toggleLabel = document.createElement("label");
        toggleLabel.innerText = " Hide Abroad/Traveling";
        toggleLabel.style.marginLeft = "5px";

        toggleRow.appendChild(hideAbroadToggle);
        toggleRow.appendChild(toggleLabel);
        sidebar.appendChild(toggleRow);

        // --- Auto Update Toggle ---
        let autoRow = document.createElement("div");
        autoRow.style.marginTop = "10px";

        autoUpdateToggle = document.createElement("input");
        autoUpdateToggle.type = "checkbox";
        autoUpdateToggle.checked = GM_getValue("autoUpdate", false);
        autoUpdateToggle.onchange = () => {
            GM_setValue("autoUpdate", autoUpdateToggle.checked);
            if (autoUpdateToggle.checked) startAutoUpdate();
            else stopAutoUpdate();
        };

        let autoLabel = document.createElement("label");
        autoLabel.innerText = " Auto Update (30s)";
        autoLabel.style.marginLeft = "5px";

        autoRow.appendChild(autoUpdateToggle);
        autoRow.appendChild(autoLabel);
        sidebar.appendChild(autoRow);

        // --- Update Button ---
        let updateButton = document.createElement("button");
        updateButton.innerText = "Update";
        updateButton.style.width = "100%";
        updateButton.style.marginTop = "10px";
        updateButton.style.color = "white";
        updateButton.style.border = "2px solid white";
        updateButton.onclick = fetchData;
        sidebar.appendChild(updateButton);

        // --- Faction Label ---
        let factionLabel = document.createElement("div");
        factionLabel.id = "factionLabel";
        factionLabel.style.display = "block";
        factionLabel.style.marginBottom = "5px";
        factionLabel.style.marginTop = "10px";

        let storedFactionName = GM_getValue("factionName", "");
        let storedFactionID = GM_getValue("factionID", "");
        if (storedFactionName) {
            factionLabel.innerHTML = `<strong>Faction - ${storedFactionName} [${storedFactionID}]</strong>`;
        } else {
            factionLabel.innerText = "Faction ID:";
        }
        sidebar.appendChild(factionLabel);

        // --- Table container ---
        let tableContainer = document.createElement("div");
        tableContainer.id = "tableContainer";
        tableContainer.style.marginTop = "10px";
        sidebar.appendChild(tableContainer);

        // --- Sidebar toggle button ---
        const toggleButton = document.createElement('div');
        toggleButton.id = 'sidebarToggle';
        toggleButton.innerHTML = '⚔️';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '50px';
        toggleButton.style.right = '0';
        toggleButton.style.width = '40px';
        toggleButton.style.height = '40px';
        toggleButton.style.background = 'black';
        toggleButton.style.color = 'white';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.display = 'flex';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.fontSize = '20px';
        toggleButton.style.borderRadius = '5px';

        toggleButton.onclick = () => {
            isSidebarVisible = !isSidebarVisible;
            if (isSidebarVisible) {
                sidebar.style.transform = 'translateX(0)';
                toggleButton.innerHTML = '❌ Close';
                toggleButton.style.width = '60px';
                toggleButton.style.height = '20px';
                toggleButton.style.fontSize = '10px';
            } else {
                sidebar.style.transform = 'translateX(100%)';
                toggleButton.innerHTML = '⚔️';
                toggleButton.style.width = '40px';
                toggleButton.style.height = '40px';
                toggleButton.style.fontSize = '18px';
            }
        };
        document.body.appendChild(toggleButton);

        document.body.appendChild(sidebar);

        if (storedFactionID) fetchData();
        if (autoUpdateToggle.checked) startAutoUpdate();
    }

    function startAutoUpdate() {
        stopAutoUpdate();
        autoUpdateInterval = setInterval(fetchData, 30000);
    }

    function stopAutoUpdate() {
        if (autoUpdateInterval) {
            clearInterval(autoUpdateInterval);
            autoUpdateInterval = null;
        }
    }

    async function fetchData() {
        let factionID = GM_getValue("factionID", "");
        let apiKey = "APIKEYHERENOOBS";

        if (!factionID) {
            alert("Faction ID is required.");
            return;
        }

        let url = `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();

        if (!data.members) {
            alert("Invalid data received");
            return;
        }

        // ✅ Save faction name & update label dynamically
        if (data.name) {
            GM_setValue("factionName", data.name);
            let factionLabel = document.getElementById("factionLabel");
            factionLabel.innerHTML = `<strong>Faction - ${data.name} [${factionID}]</strong>`;
        }

        renderTable(data.members);
    }

    // ---- rest of your functions (renderTable, formatTime, etc.) unchanged ----

    function renderTable(members) {
        let hideAbroad = GM_getValue("hideAbroad", false);

        let highlightData = GM_getValue("highlightIDs", "").split("\n").reduce((acc, line) => {
            let [key, color] = line.split(":");
            if (key && color) acc[key.trim().toLowerCase()] = color.trim();
            return acc;
        }, {});

        let sortedMembers = Object.entries(members).map(([id, member]) => {
            let hospTime = member.status.state === "Hospital" ? member.status.until - Math.floor(Date.now() / 1000) : 0;
            let jailTime = member.status.state === "Jail" ? member.status.until - Math.floor(Date.now() / 1000) : 0;
            return { id, ...member, hospTime, jailTime };
        }).sort((a, b) => {
            const statusOrder = { "Okay": 1, "Hospital": 2, "Jail": 2, "Abroad": 4, "Traveling": 5, "Fallen": 6 };
            const stateComparison = statusOrder[a.status.state] - statusOrder[b.status.state];
            if (stateComparison === 0) {
                if (a.status.state === "Hospital") return a.hospTime - b.hospTime;
                if (a.status.state === "Jail") return a.jailTime - b.jailTime;
            }
            return stateComparison;
        });

        if (hideAbroad) sortedMembers = sortedMembers.filter(m => m.status.state !== "Abroad" && m.status.state !== "Traveling");
        sortedMembers = sortedMembers.filter(m => m.status.state !== "Fallen");

        let tableHTML = `<table style='width:100%; border-collapse:collapse; background:${getTableBackgroundColor()}; color:${getTextColor()}; font-size:16px;'>
            <thead>
                <tr style='background:${getTableHeaderColor()}; color:${getHeaderTextColor()};'>
                    <th>BSP</th><th>Name & Status</th><th>Level</th><th>State</th>
                </tr>
            </thead>
            <tbody>`;

        sortedMembers.forEach((member, index) => {
            let bgColor = highlightData[member.id] || highlightData[member.name.toLowerCase()] || "transparent";

            let timeLeft = '';
            if (member.status.state === "Hospital" && member.hospTime > 0) timeLeft = formatTime(member.hospTime);
            else if (member.status.state === "Jail" && member.jailTime > 0) timeLeft = `Jail ${formatTime(member.jailTime)}`;
            else timeLeft = member.status.state;

            tableHTML += `<tr style='background:${bgColor}; border:1px solid #555;'>
            <td style="text-align:center">
                <a rel="noopener noreferrer" class="linkWrap___ZS6r9 flexCenter___bV1QP" href="/profiles.php?XID=${member.id}" i-data="i_${index}">
                    <span class="honorName___JWG9U">🔗</span>
                </a>
            </td>
            <td>
                <a href="/loader.php?sid=attack&user2ID=${member.id}" target="_blank" class="player-name-clickable" data-name="${member.name}">${member.name}</a>
                <span style="font-size:12px; color:${getLastActionColor(member.last_action)};">
                    ${getLastActionText(member.last_action)}
                </span>
            </td>
            <td>${member.level}</td>
            <td><span class="live-timer" data-seconds="${member.hospTime || member.jailTime || 0}">${timeLeft}</span></td>
            </tr>`;
        });

        tableHTML += "</tbody></table>";
        document.getElementById("tableContainer").innerHTML = tableHTML;
        initLiveTimers();
    }

    function getLastActionColor(action) {
        if (!action || !action.status) return "red";
        if (action.status === "Online") return "green";
        if (action.status === "Idle") return "orange";
        return "red";
    }

    function getLastActionText(action) {
        if (!action || !action.status || !action.timestamp) return "";
        const now = Math.floor(Date.now() / 1000);
        const diff = now - action.timestamp;
        if (action.status === "Online") return "🟢 On";
        if (action.status === "Idle") return `🟧 AFK ${formatShortTime(diff)}`;
        return `🔴 Off ${formatShortTime(diff)}`;
    }

    function formatShortTime(seconds) {
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m`;
        if (mins < 90) return `1h`;
        if (mins < 1440) return `${Math.round(mins / 60)}h`;
        const days = Math.floor(mins / 1440);
        return `${days}d`;
    }

    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function getTableBackgroundColor() {
        return document.body.classList.contains("torn-dark") ? "#333" : "#fff";
    }
    function getTextColor() {
        return document.body.classList.contains("torn-dark") ? "#ccc" : "#333";
    }
    function getTableHeaderColor() {
        return document.body.classList.contains("torn-dark") ? "#222" : "#333";
    }
    function getHeaderTextColor() {
        return "#fff";
    }

    function initLiveTimers() {
        if (liveTimerInterval) clearInterval(liveTimerInterval);
        liveTimerInterval = setInterval(() => {
            document.querySelectorAll(".live-timer").forEach(el => {
                let seconds = parseInt(el.getAttribute("data-seconds"), 10);
                if (seconds > 0) {
                    seconds--;
                    el.setAttribute("data-seconds", seconds);
                    el.innerText = formatTime(seconds);
                }
            });
        }, 1000);
    }

    createSidebar();
})();
