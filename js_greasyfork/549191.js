// ==UserScript==
// @name         Targets
// @namespace    Fsociety
// @version      0.7
// @description  Two separate target lists for Torn - Easy/Normal targets
// @author       UnAmigo [3749876]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549191/Targets.user.js
// @updateURL https://update.greasyfork.org/scripts/549191/Targets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_EASY = "torn_target_list_easy";
    const STORAGE_KEY_NORMAL = "torn_target_list_normal";
    const INDEX_KEY_EASY = "torn_target_index_easy";
    const INDEX_KEY_NORMAL = "torn_target_index_normal";
    const ACTIVE_LIST_KEY = "torn_active_list";
    const energyPerHit = 25;

    function loadList(listType) {
        const key = listType === "easy" ? STORAGE_KEY_EASY : STORAGE_KEY_NORMAL;
        return JSON.parse(localStorage.getItem(key) || "[]");
    }

    function saveList(list, listType) {
        const key = listType === "easy" ? STORAGE_KEY_EASY : STORAGE_KEY_NORMAL;
        localStorage.setItem(key, JSON.stringify(list));
    }

    function loadIndex(listType) {
        const key = listType === "easy" ? INDEX_KEY_EASY : INDEX_KEY_NORMAL;
        return parseInt(localStorage.getItem(key) || "0", 10);
    }

    function saveIndex(i, listType) {
        const key = listType === "easy" ? INDEX_KEY_EASY : INDEX_KEY_NORMAL;
        localStorage.setItem(key, i);
    }

    function getActiveList() {
        return localStorage.getItem(ACTIVE_LIST_KEY) || "easy";
    }

    function setActiveList(listType) {
        localStorage.setItem(ACTIVE_LIST_KEY, listType);
    }

    function calculateHits(energy) {
        return Math.floor(energy / energyPerHit);
    }

    // -------- Hit Count --------
    function addHitsIndicator() {
        const valueEl = document.querySelector(".bar-value___NTdce");
        if (!valueEl) return;
        if (document.querySelector("#hits-indicator")) return;

        const span = document.createElement("span");
        span.id = "hits-indicator";
        span.style.marginLeft = "6px";
        span.style.fontSize = "12px";
        span.style.fontWeight = "bold";
        span.style.color = "#4CAF50";

        valueEl.insertAdjacentElement("afterend", span);

        const update = () => {
            const text = valueEl.textContent || "0/0";
            const currentEnergy = parseInt(text.split("/")[0].replace(/\D/g, "")) || 0;
            span.textContent = `/ ${calculateHits(currentEnergy)}`;
        };

        update();
        setInterval(update, 5000);
    }

    const observer = new MutationObserver(addHitsIndicator);
    observer.observe(document.body, { childList: true, subtree: true });

    // -------- Panel --------
    function createPanel() {
        if (document.getElementById("targetPanel")) return;

        const panel = document.createElement("div");
        panel.id = "targetPanel";
        panel.style.position = "fixed";
        panel.style.top = "200px";
        panel.style.left = "5px";
        panel.style.background = "rgba(0,0,0,0.5)";
        panel.style.color = "#fff";
        panel.style.padding = "8px";
        panel.style.zIndex = "99999";
        panel.style.fontSize = "11px";
        panel.style.borderRadius = "6px";
        panel.style.width = "90px";
        panel.style.textAlign = "center";

        panel.innerHTML = `
          <div style="margin-bottom: 8px;">
            <button id="switchEasy" class="targetBtn switchBtn">Easy</button>
            <button id="switchNormal" class="targetBtn switchBtn">Normal</button>
          </div>
          <div style="font-weight: bold; margin-bottom: 4px;">
            <span id="activeListName">EASY</span>
          </div>
          <div>Total: <span id="totalTargets">0</span></div>
          <div>Left: <span id="remainingTargets">0</span></div>
          <button id="startList" class="targetBtn">Start</button>
          <button id="nextTarget" class="targetBtn">Next</button>
          <button id="importExport" class="targetBtn">Edit List</button>
        `;
        document.body.appendChild(panel);

        styleButtons();

        document.getElementById("switchEasy").onclick = () => {
            setActiveList("easy");
            updatePanel();
        };

        document.getElementById("switchNormal").onclick = () => {
            setActiveList("normal");
            updatePanel();
        };

        document.getElementById("startList").onclick = () => {
            const activeList = getActiveList();
            let list = loadList(activeList);
            if (list.length === 0) return alert("List empty");
            saveIndex(0, activeList);
            window.open(`https://www.torn.com/profiles.php?XID=${list[0]}`, "_blank");
            updatePanel();
        };

        document.getElementById("nextTarget").onclick = () => {
            const activeList = getActiveList();
            let list = loadList(activeList);
            let i = loadIndex(activeList);
            if (list.length === 0) return alert("List empty");
            if (i >= list.length - 1) return alert("End of list");
            i++;
            saveIndex(i, activeList);
            window.location.href = `https://www.torn.com/profiles.php?XID=${list[i]}`;
            updatePanel();
        };

        document.getElementById("importExport").onclick = () => {
            const activeList = getActiveList();
            let list = loadList(activeList);
            let data = prompt(`Edit ${activeList.toUpperCase()} list IDs (comma separated):`, list.join(","));
            if (data !== null) {
                let newList = data.split(",").map(x => x.trim()).filter(x => x);
                saveList(newList, activeList);
                saveIndex(0, activeList);
                updatePanel();
            }
        };

        updatePanel();
    }

    function styleButtons() {
        document.querySelectorAll(".targetBtn").forEach(btn => {
            btn.style.display = "block";
            btn.style.width = "100%";
            btn.style.margin = "4px 0";
            btn.style.padding = "4px";
            btn.style.background = "#193e59";
            btn.style.color = "#fff";
            btn.style.border = "none";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "11px";
            btn.style.fontWeight = "bold";
        });

        document.querySelectorAll(".switchBtn").forEach(btn => {
            btn.style.display = "inline-block";
            btn.style.width = "48%";
            btn.style.margin = "2px 1%";
            btn.style.padding = "4px 2px";
        });
    }

    function updatePanel() {
        const activeList = getActiveList();
        let list = loadList(activeList);
        let i = loadIndex(activeList);

        let total = document.getElementById("totalTargets");
        let remaining = document.getElementById("remainingTargets");
        let activeName = document.getElementById("activeListName");

        if (total && remaining && activeName) {
            total.textContent = list.length;
            remaining.textContent = Math.max(0, list.length - i);
            activeName.textContent = activeList.toUpperCase();
            activeName.style.color = activeList === "easy" ? "#4CAF50" : "#e67e22";
        }

        // Highlight active button
        const easyBtn = document.getElementById("switchEasy");
        const normalBtn = document.getElementById("switchNormal");
        if (easyBtn && normalBtn) {
            if (activeList === "easy") {
                easyBtn.style.background = "#4CAF50";
                normalBtn.style.background = "#193e59";
            } else {
                easyBtn.style.background = "#193e59";
                normalBtn.style.background = "#e67e22";
            }
        }
    }

    // -------- Profile Button --------
    function addProfileButton() {
        if (!/profiles\.php\?XID=\d+/.test(window.location.href)) return;

        let idMatch = window.location.href.match(/XID=(\d+)/);
        if (!idMatch) return;
        let playerId = idMatch[1];

        if (document.getElementById("targetProfileBtn")) return;

        let nameEl = document.querySelector(".user-info-value, .title-black, h4");
        if (!nameEl) return;

        const container = document.createElement("div");
        container.id = "targetProfileBtn";
        container.style.marginTop = "6px";
        container.style.marginLeft = "8px";

        const easyBtn = document.createElement("button");
        easyBtn.id = "easyTargetBtn";
        easyBtn.style.marginRight = "4px";
        easyBtn.style.padding = "4px 6px";
        easyBtn.style.border = "none";
        easyBtn.style.borderRadius = "4px";
        easyBtn.style.cursor = "pointer";
        easyBtn.style.fontSize = "11px";
        easyBtn.style.fontWeight = "bold";

        const normalBtn = document.createElement("button");
        normalBtn.id = "normalTargetBtn";
        normalBtn.style.padding = "4px 6px";
        normalBtn.style.border = "none";
        normalBtn.style.borderRadius = "4px";
        normalBtn.style.cursor = "pointer";
        normalBtn.style.fontSize = "11px";
        normalBtn.style.fontWeight = "bold";

        function refreshButtons() {
            let easyList = loadList("easy");
            let normalList = loadList("normal");

            if (easyList.includes(playerId)) {
                easyBtn.textContent = "❌ Easy";
                easyBtn.style.background = "#c0392b";
                easyBtn.style.color = "#fff";
            } else {
                easyBtn.textContent = "🎯 Easy";
                easyBtn.style.background = "#4CAF50";
                easyBtn.style.color = "#fff";
            }

            if (normalList.includes(playerId)) {
                normalBtn.textContent = "❌ Normal";
                normalBtn.style.background = "#c0392b";
                normalBtn.style.color = "#fff";
            } else {
                normalBtn.textContent = "🎯 Normal";
                normalBtn.style.background = "#e67e22";
                normalBtn.style.color = "#fff";
            }
        }

        easyBtn.onclick = () => {
            let list = loadList("easy");
            if (list.includes(playerId)) {
                list = list.filter(x => x !== playerId);
            } else {
                list.push(playerId);
            }
            saveList(list, "easy");
            updatePanel();
            refreshButtons();
        };

        normalBtn.onclick = () => {
            let list = loadList("normal");
            if (list.includes(playerId)) {
                list = list.filter(x => x !== playerId);
            } else {
                list.push(playerId);
            }
            saveList(list, "normal");
            updatePanel();
            refreshButtons();
        };

        container.appendChild(easyBtn);
        container.appendChild(normalBtn);
        nameEl.appendChild(container);
        refreshButtons();
    }

    // -------- Chain Prep Alert --------
    function chainPrepAlert() {
        const STORAGE_KEY_CHAIN = "torn_next_chain_day";

        const panel = document.getElementById("targetPanel");
        if (panel && !document.getElementById("setChainDayBtn")) {
            const btn = document.createElement("button");
            btn.id = "setChainDayBtn";
            btn.textContent = "Chain";
            btn.className = "targetBtn";
            btn.onclick = () => {
                const dateStr = prompt("Enter next Chain Day (DD/MM/YYYY):", localStorage.getItem(STORAGE_KEY_CHAIN) || "");
                if (dateStr) {
                    localStorage.setItem(STORAGE_KEY_CHAIN, dateStr);
                    alert("Next chain day set: " + dateStr);
                }
            };
            panel.appendChild(btn);
            styleButtons();
        }

        function checkStackTime() {
            const chainDayStr = localStorage.getItem(STORAGE_KEY_CHAIN);
            if (!chainDayStr) return;

            const parts = chainDayStr.split("/");
            if (parts.length !== 3) return;
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const chainDate = new Date(Date.UTC(year, month, day, 0, 0, 0));

            const now = new Date();
            const cooldownHours = 9;
            const stackCount = 4;
            const totalStackTimeMs = cooldownHours * stackCount * 60 * 60 * 1000;
            const startStackTime = new Date(chainDate.getTime() - totalStackTimeMs);

            if (now >= startStackTime && now < chainDate) {
                alert("🧪 Time to start stacking Xanax for the chain!");
                localStorage.removeItem(STORAGE_KEY_CHAIN);
            }
        }

        setInterval(checkStackTime, 60000);
    }

    // -------- Init --------
    function init() {
        createPanel();
        addProfileButton();
        chainPrepAlert();
    }

    document.addEventListener("DOMContentLoaded", init);
    setInterval(() => {
        createPanel();
        addProfileButton();
        chainPrepAlert();
    }, 2000);

})();