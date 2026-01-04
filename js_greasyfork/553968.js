// ==UserScript==
// @name         Hokej - Finsko (Tabulka zápasů)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Rozklikne zápasy, vynechá zadané soutěže a vytvoří oddělené tabulky pro každou soutěž s LIVE odkazy
// @author       LM
// @match        http*://tulospalvelu.leijonat.fi/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leijonat.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553968/Hokej%20-%20Finsko%20%28Tabulka%20z%C3%A1pas%C5%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553968/Hokej%20-%20Finsko%20%28Tabulka%20z%C3%A1pas%C5%AF%29.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const header = document.querySelector(".page-title.district-title");
        if (!header) return;

        const generate = document.createElement("button");
        generate.textContent = "VYGENERUJ TABULKU ZÁPASŮ";
        generate.style.fontSize = "16px";
        generate.style.marginLeft = "15px";
        generate.style.padding = "6px 12px";
        generate.style.cursor = "pointer";
        header.append(generate);

        generate.onclick = function() { generateLiveTablesByCompetition(); };
    }, 1000);
})();

function generateLiveTablesByCompetition() {
    alert("Klikni na OK pro vytvoření tabulek zápasů...");

    // 🧩 Soutěže, které se mají vynechat:
    const excludedCompetitions = [
        "U16 SM-sarja",
        "U18 SM-sarja",
        "Mestis"
    ];

    // 1️⃣ Rozklikne všechny sekce se zápasy
    const rozklik = document.querySelectorAll(".fa-angle-down");
    rozklik.forEach(item => item.click());

    // 2️⃣ Počkáme 1s, aby se vše načetlo
    setTimeout(() => {
        const zapasy = document.querySelectorAll(".game-score-board");
        if (zapasy.length === 0) {
            alert("Nebyly nalezeny žádné zápasy!");
            return;
        }

        // 3️⃣ Uložíme zápasy podle soutěže
        const grouped = {};

        zapasy.forEach(item => {
            const soutez = item.querySelector(".serie-name a")?.textContent.trim() || "Neznámá soutěž";
            if (excludedCompetitions.includes(soutez)) return;

            const matchId = item.dataset.value;
            const liveUrl = `https://tulospalvelu.leijonat.fi/game/?season=2026&gameid=${matchId}&lang=fi`;
            const datum = item.querySelector(".game-date")?.textContent.trim() || "";
            const cas = item.querySelector(".game-time")?.textContent.trim() || "";
            const home = item.querySelector(".home-team-name")?.textContent.trim() || "";
            const away = item.querySelector(".away-team-name")?.textContent.trim() || "";

            const matchData = {
                soutez,
                datumCas: `${datum} ${cas}`,
                zapas: `${home} - ${away}`,
                liveUrl
            };

            if (!grouped[soutez]) grouped[soutez] = [];
            grouped[soutez].push(matchData);
        });

        // 4️⃣ Přidáme všechny tabulky nahoru
        const container = document.querySelector(".page-title.district-title")?.parentElement || document.body;
        const wrapper = document.createElement("div");
        wrapper.style.marginTop = "25px";

        for (const [soutez, matches] of Object.entries(grouped)) {
            const nadpis = document.createElement("h2");
            nadpis.textContent = soutez;
            nadpis.style.textAlign = "center";
            nadpis.style.background = "#003366";
            nadpis.style.color = "white";
            nadpis.style.padding = "6px";
            nadpis.style.margin = "30px 0 10px 0";
            nadpis.style.borderRadius = "4px";
            nadpis.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            wrapper.appendChild(nadpis);

            const tabulka = document.createElement("table");
            tabulka.style.borderCollapse = "collapse";
            tabulka.style.margin = "0 auto 25px auto";
            tabulka.style.width = "60%";
            tabulka.style.fontFamily = "Arial, sans-serif";
            tabulka.style.fontSize = "14px";
            tabulka.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
                <th style="background:#0055a5;color:white;padding:8px;border:1px solid #ccc;">Datum a čas</th>
                <th style="background:#0055a5;color:white;padding:8px;border:1px solid #ccc;">Zápas</th>
                <th style="background:#0055a5;color:white;padding:8px;border:1px solid #ccc;">LIVE URL</th>
            `;
            tabulka.appendChild(headerRow);

            matches.forEach((match, i) => {
                const row = document.createElement("tr");
                row.style.backgroundColor = i % 2 === 0 ? "#f7f9fc" : "#ffffff";
                row.innerHTML = `
                    <td style="padding:6px 10px;border:1px solid #ccc;text-align:center;">${match.datumCas}</td>
                    <td style="padding:6px 10px;border:1px solid #ccc;">${match.zapas}</td>
                    <td style="padding:6px 10px;border:1px solid #ccc;text-align:center;">
                        <a href="${match.liveUrl}" target="_blank" style="color:#0055cc;text-decoration:underline;font-weight:bold;">LIVE URL</a>
                    </td>
                `;
                tabulka.appendChild(row);
            });

            wrapper.appendChild(tabulka);
        }

        container.insertBefore(wrapper, container.firstChild);
    }, 1000);
}
