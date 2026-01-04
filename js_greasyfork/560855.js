// ==UserScript==
// @name         Event Kill counter
// @namespace    http://tampermonkey.net/
// @version      2025-12-27
// @description event kill counter
// @author       You
// @match        https://demonicscans.org/a_lizardmen_winter.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560855/Event%20Kill%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/560855/Event%20Kill%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function renameGreedyGiantRaccoon() {
        const lbCards = document.querySelectorAll(".lb-card");
        if (!lbCards.length) return;

        lbCards.forEach(card => {
            const nameLinks = card.querySelectorAll(".lb-name a");

            nameLinks.forEach(link => {
                if (link.textContent.trim() === "GreedyGiantRaccoon") {
                    link.textContent = "GGR";
                    console.log("[LootVisualizer] Renamed GreedyGiantRaccoon → GGR");
                }
            });
        });
    }
    function injectTotalKillsCounter() {
        const panel = [...document.querySelectorAll(".card")]
        .find(c => c.querySelector(".big") && c.querySelector(".muted")?.textContent.includes("Your Kills"));


        if (!panel) return;

        // avoid double inject
        if (panel.querySelector(".tm-total-kills-row")) return;

        // find the total kills pill
        const totalKillsText = panel.querySelector(".pill")?.textContent
        .match(/([\d,]+)\s*total kills/i)?.[1];

        if (!totalKillsText) return;

        const totalKills = Number(totalKillsText.replace(/,/g, ""));

        // storage
        const KEY = "event_total_kills";
        const prev = Number(localStorage.getItem(KEY)) || totalKills;
        const delta = totalKills - prev;
        localStorage.setItem(KEY, totalKills);

        // find the Feast of Shadows Rankings panel to inject into
        const rankingPanel = [...document.querySelectorAll(".panel")]
        .find(p => p.querySelector(".title")?.textContent.includes("Feast of Shadows Rankings"));

        if (!rankingPanel) return;

        const headerRow = rankingPanel.querySelector(".row");
        if (!headerRow) return;

        // avoid double inject
        if (rankingPanel.querySelector(".tm-total-kills-row")) return;

        // build row
        const row = document.createElement("div");
        row.className = "row tm-total-kills-row";
        row.style.marginTop = "6px";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";

        const deltaColor =
              delta > 0 ? "rgb(108,255,108)" :
        delta < 0 ? "rgb(255,108,108)" :
        "rgb(170,170,170)";

        row.innerHTML = `
        <span class="pill" style="font-weight:800;">
            🗡️ Total Kills: ${totalKills.toLocaleString()}
            <span style="margin-left:6px;color:${deltaColor};font-weight:800;">
                (+${delta})
            </span>
        </span>
    `;

        // insert row under the ranking panel header
        headerRow.insertAdjacentElement("afterend", row);
    }

    injectTotalKillsCounter();
    renameGreedyGiantRaccoon()
    function trackLeaderboardKillDeltas(root = document) {
        const STORAGE_KEYS = {
            guild: "lb:guild:kills",
            player: "lb:player:kills",
        };

        const parseNumber = (text) =>
        parseInt(text.replace(/[^\d]/g, ""), 10) || 0;

        const loadStore = (key) =>
        JSON.parse(localStorage.getItem(key) || "{}");

        const saveStore = (key, data) =>
        localStorage.setItem(key, JSON.stringify(data));

        function track(card, type) {
            const storeKey = STORAGE_KEYS[type];
            const prev = loadStore(storeKey);
            const next = {};

            card.querySelectorAll(".lb-row").forEach(row => {
                const rankEl = row.querySelector(".lb-rank");
                const nameEl = row.querySelector(".lb-name");
                const killsEl = row.querySelector(".lb-stats div");

                if (!rankEl || !nameEl || !killsEl) return;

                let id;

                // ---------- STABLE ID ----------
                if (type === "player") {
                    const a = nameEl.querySelector("a");
                    const pid = a?.href.match(/pid=(\d+)/)?.[1];
                    if (!pid) return;
                    id = `pid:${pid}`;
                } else {
                    const rank = rankEl.textContent.trim();
                    const name = nameEl.textContent.trim();
                    id = `guild:${rank}:${name}`;
                }

                const currentKills = parseNumber(killsEl.textContent);
                const previousKills = prev[id] ?? currentKills;
                const delta = currentKills - previousKills;

                next[id] = currentKills;

                // ---------- RENDER ----------
                killsEl.querySelector(".lb-delta")?.remove();

                const span = document.createElement("span");
                span.className = "lb-delta";
                span.textContent = ` (+${delta})`;

                // styling
                span.style.cssText = `
        margin-left: 6px;
        font-weight: 600;
        color: ${delta > 0 ? "rgb(108, 255, 108)" : "#aaa"};
      `;

                killsEl.appendChild(span);
            });

            saveStore(storeKey, next);
        }

        // ---------- SCAN PAGE ----------
        root.querySelectorAll(".lb-card").forEach(card => {
            const title = card.querySelector(".big")?.textContent ?? "";

            if (title.includes("Top Guilds") && title.includes("Kills")) {
                track(card, "guild");
            }

            if (title.includes("Top Players") && title.includes("Kills")) {
                track(card, "player");
            }
        });
    }
    trackLeaderboardKillDeltas();
})();