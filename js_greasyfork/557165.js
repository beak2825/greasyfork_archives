// ==UserScript==
// @name         Radarr - Why Was This Upgraded?
// @namespace    radarr.whythescript
// @version      3.0
// @description  Adds a "Why?" button next to Radarr history items to show upgrade reason
// @match        *://*/movie/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3+
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/557165/Radarr%20-%20Why%20Was%20This%20Upgraded.user.js
// @updateURL https://update.greasyfork.org/scripts/557165/Radarr%20-%20Why%20Was%20This%20Upgraded.meta.js
// ==/UserScript==

/* -------------------------------------------------------
   CONFIG
------------------------------------------------------- */
function getConfig() {
    let url = localStorage.getItem("WHY_R_URL");
    let key = localStorage.getItem("WHY_R_KEY");

    if (!url || !key) {
        url = prompt("Enter your Radarr URL (e.g. http://localhost:7878):", url || "");
        key = prompt("Enter your Radarr API key:", key || "");
        if (url) localStorage.setItem("WHY_R_URL", url.trim());
        if (key) localStorage.setItem("WHY_R_KEY", key.trim());
    }

    return {
        RADARR_URL: url.trim(),
        API_KEY: key.trim()
    };
}

/* -------------------------------------------------------
   POPUP
------------------------------------------------------- */

function popup(text, el) {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.zIndex = 99999;
    box.style.background = "#222";
    box.style.color = "white";
    box.style.padding = "10px";
    box.style.border = "1px solid #666";
    box.style.fontSize = "14px";
    box.style.maxWidth = "400px";
    box.style.whiteSpace = "pre-wrap";
    box.innerText = text;

    document.body.appendChild(box);
    setTimeout(() => box.remove(), 8000);
}

/* -------------------------------------------------------
   RADARR API
------------------------------------------------------- */
function radarrGet(path) {
    return new Promise((resolve) => {
        const sep = path.includes("?") ? "&" : "?";
        const { RADARR_URL, API_KEY } = getConfig();
        GM_xmlhttpRequest({
            url: `${RADARR_URL}/api/v3/${path}${sep}apiKey=${API_KEY}`,
            method: "GET",
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    resolve(data);
                } catch (e) {
                    console.log("radarrGet parse error", e, res.responseText);
                    resolve(null);
                }
            },
            onerror: (e) => {
                console.log("radarrGet error", e);
                resolve(null);
            }
        });
    });
}

/* -------------------------------------------------------
   MATCHING HELPERS
------------------------------------------------------- */

function normalize(s) {
    return s.toLowerCase().replace(/[\[\]()]/g, "").replace(/\s+/g, " ").trim();
}

function pickMatchingRecord(records, title) {
    const norm = normalize(title);

    let r = records.find(rec => normalize(rec.sourceTitle || "") === norm);
    if (r) return r;

    r = records.find(rec => normalize(rec.sourceTitle || "").includes(norm));
    return r || null;
}

function formatReason(rec) {
    if (!rec) return "No matching Radarr entry.";

    const q = rec.quality?.quality?.name || "?";
    const cf = rec.customFormats || [];

    const cfLines = cf.length
        ? cf.map(x => `• ${x.name}  (score: ${x.score})`).join("\n")
        : "None";

    const totalScore =
        (rec.customFormatScore || 0) +
        (rec.data?.qualityWeight || 0) +
        (rec.data?.preferredWordScore || 0) +
        (rec.data?.languageScore || 0);

    let why = rec.qualityCutoffNotMet
        ? "→ Radarr upgraded because the quality cutoff was NOT met."
        : "→ Radarr imported this because it met or exceeded your cutoff.";

    return [
        `TITLE`,
        `  ${rec.sourceTitle}`,
        ``,

        `QUALITY`,
        `  ${q}`,
        ``,

        `WHY`,
        `  ${why}`,
        ``,

        `SCORES`,
        `  Total:         ${totalScore}`,
        `    • Custom Fmts: ${rec.customFormatScore || 0}`,
        `    • Quality:     ${rec.data?.qualityWeight || 0}`,
        `    • Pref Words:  ${rec.data?.preferredWordScore || 0}`,
        `    • Language:    ${rec.data?.languageScore || 0}`,
        ``,

        `CUSTOM FORMATS`,
        `  ${cfLines}`,
        ``,

        `EVENT`,
        `  ${rec.eventType}`,
        `  ${rec.date}`,
    ].join("\n");
}



/* -------------------------------------------------------
   RADARR PATCH
------------------------------------------------------- */

async function patchRadarr() {
    const rows = [...document.querySelectorAll("td")]
        .filter(td => td.className.includes("MovieHistoryRow-sourceTitle"));

    if (rows.length === 0) {
        return;
    }

    rows.forEach(td => {
        if (td.dataset.whyInjected) return;
        td.dataset.whyInjected = "1";

        const title = td.textContent.trim();

        const btn = document.createElement("button");
        btn.textContent = "Why?";
        btn.className = "why-btn";
        btn.style.marginLeft = "8px";
        btn.style.background = "black";
        btn.style.color = "white";
        btn.style.border = "1px solid #333";
        btn.style.padding = "2px 6px";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "12px";

        btn.onclick = async () => {
            const hist = await radarrGet("history?page=1&pageSize=500&sortDirection=descending");
            if (!hist || !hist.records) {
                popup("No Radarr history available.");
                return;
            }

            const rec = pickMatchingRecord(hist.records, title);
            popup(formatReason(rec));
        };

        td.appendChild(btn);
    });
}

/* -------------------------------------------------------
   MAIN LOOP
------------------------------------------------------- */

function loop() {
    if (location.href.includes("7878")) {
        patchRadarr();
    }
}

setInterval(loop, 1000);