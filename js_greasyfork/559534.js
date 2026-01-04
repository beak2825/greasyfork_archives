// ==UserScript==
// @name         Faction Armory Logs v1 (Slimmer Left Panel)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Shows last 100 faction armory logs in a very slim left panel (v1 API)
// @author       Nova
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559534/Faction%20Armory%20Logs%20v1%20%28Slimmer%20Left%20Panel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559534/Faction%20Armory%20Logs%20v1%20%28Slimmer%20Left%20Panel%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let factionKey = GM_getValue("FACTION_API_KEY", "");
    if (!factionKey) {
        factionKey = prompt("Enter your Faction API Key:");
        if (factionKey) GM_setValue("FACTION_API_KEY", factionKey);
        else return;
    }

    // Very slim panel on the left
    GM_addStyle(`
        #armoryLogPanel {
            position: fixed;
            top: 50px;
            left: 10px;
            width: 200px;      /* slimmer width */
            height: 80%;        /* tall panel */
            background: #111;
            color: #ddd;
            font-family: monospace;
            font-size: 11px;    /* smaller font for slimmer panel */
            border: 1px solid #444;
            padding: 4px;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }
        #armoryLogPanel button {
            cursor: pointer;
            margin-bottom: 4px;
            width: 100%;
            font-size: 11px;
        }
        #armoryLogPanel div.entry {
            margin-bottom: 2px;
            line-height: 1.1em;
            font-size: 10px;   /* smaller for slimmer panel */
            word-break: break-word; /* prevent overflow */
        }
    `);

    const panel = document.createElement("div");
    panel.id = "armoryLogPanel";

    const title = document.createElement("div");
    title.innerHTML = "<b>Faction Armory Logs (v1)</b>";
    title.style.marginBottom = "4px";

    const refreshBtn = document.createElement("button");
    refreshBtn.textContent = "Refresh";

    const logsDiv = document.createElement("div");

    panel.appendChild(title);
    panel.appendChild(refreshBtn);
    panel.appendChild(logsDiv);
    document.body.appendChild(panel);

    async function fetchArmoryLogs() {
        const url = `https://api.torn.com/faction/?selections=armorynews&key=${factionKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) throw new Error(`${data.error.code}: ${data.error.error}`);
        if (!data.armorynews) return [];

        return Object.values(data.armorynews);
    }

    function stripHTML(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    async function loadLogs() {
        logsDiv.textContent = "Loading armory logs...";

        try {
            const logs = await fetchArmoryLogs();

            if (!logs.length) {
                logsDiv.textContent = "No armory logs found.";
                return;
            }

            logs.sort((a, b) => b.timestamp - a.timestamp);

            logsDiv.innerHTML = "";

            logs.forEach(entry => {
                const time = entry.timestamp ? new Date(entry.timestamp * 1000).toLocaleString() : "Unknown time";
                const text = entry.news ? stripHTML(entry.news) : "No text available";

                const div = document.createElement("div");
                div.className = "entry";
                div.textContent = `[${time}] ${text}`;
                logsDiv.appendChild(div);
            });

        } catch (err) {
            logsDiv.textContent = "Error fetching armory logs: " + err.message;
        }
    }

    refreshBtn.addEventListener("click", loadLogs);
    loadLogs();

})();