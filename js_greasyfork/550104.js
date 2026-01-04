// ==UserScript==
// @name         Potion Reward Discord Message
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Generate potion bonus message
// @match        *://uwu-logs.xyz/reports/*/consumables*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550104/Potion%20Reward%20Discord%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/550104/Potion%20Reward%20Discord%20Message.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log("[PotionReward-Full] Script running...");

    function tryInit(attempt = 1) {
        console.log(`[PotionReward-Full] Attempt ${attempt}`);

        const tableBody = document.querySelector('#potions-table-body');
        const tableSection = document.querySelector('section.table-players');

        if (!tableBody || !tableSection) {
            console.log("[PotionReward-Full] Waiting for table elements...");
            if (attempt < 20) {
                setTimeout(() => tryInit(attempt + 1), 1000); // retry up to 20s
            }
            return;
        }

        console.log("[PotionReward-Full] Found table elements, running main logic");

        // Potion columns: first 6 potions + Indestructible Potion (col 15)
        const potionIndices = [2, 3, 4, 5, 6, 7];
        const indestructibleIndex = 15;

        const players = [];
        tableBody.querySelectorAll('tr').forEach((row, rowIndex) => {
            const nameCell = row.querySelector('.player-cell a');
            if (!nameCell) {
                console.log(`[PotionReward-Full] Row ${rowIndex} has no player-cell`);
                return;
            }

            const playerName = nameCell.textContent.trim();
            const tds = row.querySelectorAll('td');

            let totalPotions = 0;

            // Count first 6 potions
            potionIndices.forEach(idx => {
                totalPotions += parseInt(tds[idx]?.textContent) || 0;
            });

            // Indestructible Potion at 4:1
            let indestructible = parseInt(tds[indestructibleIndex]?.textContent) || 0;
            totalPotions += Math.floor(indestructible / 4);

            if (totalPotions <= 9) {
                console.log(`[PotionReward-Full] ${playerName} excluded (${totalPotions})`);
                return;
            }

            // DKP calculation
            let dkp = 0;
            if (totalPotions >= 40) dkp = 60;
            else if (totalPotions >= 30) dkp = 50;
            else if (totalPotions >= 20) dkp = 40;
            else if (totalPotions >= 10) dkp = 30;

            console.log(`[PotionReward-Full] ${playerName}: ${totalPotions} potions → +${dkp} DKP`);
            players.push({ name: playerName, potions: totalPotions, dkp });
        });

        if (players.length === 0) {
            console.log("[PotionReward-Full] No players qualified, stopping");
        }

        // Build collapsible container
        const container = document.createElement('div');
        container.style.border = "2px dashed #6b5";
        container.style.padding = "10px";
        container.style.marginBottom = "10px";
        container.style.background = "#222";
        container.style.color = "#fff";
        container.style.fontFamily = "monospace";

        const header = document.createElement('div');
        header.textContent = "Bonusy za potki ▼";
        header.style.cursor = "pointer";
        header.style.fontWeight = "bold";
        container.appendChild(header);

        const content = document.createElement('div');
        content.style.display = "none";
        content.style.marginTop = "5px";

        players.forEach(p => {
            const playerLine = document.createElement('div');
            playerLine.innerHTML = `@${p.name} (${p.potions} potek) +${p.dkp} dkp`;
            content.appendChild(playerLine);
        });

        container.appendChild(content);

        header.addEventListener('click', () => {
            if (content.style.display === "none") {
                content.style.display = "block";
                header.textContent = "Bonusy za potki ▲";
            } else {
                content.style.display = "none";
                header.textContent = "Bonusy za potki ▼";
            }
        });

        tableSection.parentNode.insertBefore(container, tableSection);
        console.log("[PotionReward-Full] Inserted container before section.table-players");
    }

    tryInit();
})();
