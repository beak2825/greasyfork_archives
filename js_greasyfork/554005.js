// ==UserScript==
// @name         FIFA – Tlačítko "INCIDENTY LIVE URL"
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Přidá tlačítko "LIVE URL INCIDENTY" pro otevření timeline API
// @author       LM
// @match        https://www.fifa.com/en/match-centre/match/*/*/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554005/FIFA%20%E2%80%93%20Tla%C4%8D%C3%ADtko%20%22INCIDENTY%20LIVE%20URL%22.user.js
// @updateURL https://update.greasyfork.org/scripts/554005/FIFA%20%E2%80%93%20Tla%C4%8D%C3%ADtko%20%22INCIDENTY%20LIVE%20URL%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        try {
            // 🔢 Extrakce ID z URL
            const parts = window.location.pathname.split('/').filter(Boolean);
            const competitionId = parts[3];
            const seasonId = parts[4];
            const stageId = parts[5];
            const matchId = parts[6];
            if (!competitionId || !seasonId || !stageId || !matchId) return;

            const apiUrl = `https://api.fifa.com/api/v3/timelines/${competitionId}/${seasonId}/${stageId}/${matchId}?language=en`;

            // 🔵 Tlačítko
            const btn = document.createElement("button");
            btn.textContent = "LIVE URL INCIDENTY";
            btn.title = apiUrl;

            // 💅 Styl
            Object.assign(btn.style, {
                position: "fixed",
                top: "210px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: "9999",
                backgroundColor: "#003366",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "18px 36px",
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "0.6px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "all 0.25s ease-in-out",
            });

            btn.addEventListener("mouseenter", () => {
                btn.style.backgroundColor = "#0055aa";
                btn.style.transform = "translateX(-50%) scale(1.05)";
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.backgroundColor = "#003366";
                btn.style.transform = "translateX(-50%) scale(1)";
            });

            // 🖱️ Klik → otevře API
            btn.addEventListener("click", () => {
                window.open(apiUrl, "_blank");
            });

            document.body.appendChild(btn);

            console.log("✅ LIVE URL INCIDENTY tlačítko přidáno:", apiUrl);
        } catch (err) {
            console.error("❌ Chyba při generování tlačítka:", err);
        }
    }, 1500);
})();
