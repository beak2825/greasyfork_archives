// ==UserScript==
// @name         SABnzbd – Why This Release?
// @namespace    sab.whythescript
// @version      1.0
// @description  Adds a “Why?” button to SABnzbd rows that fetches matching Radarr history.
// @match        *://*/sabnzbd/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3+
// @downloadURL https://update.greasyfork.org/scripts/557166/SABnzbd%20%E2%80%93%20Why%20This%20Release.user.js
// @updateURL https://update.greasyfork.org/scripts/557166/SABnzbd%20%E2%80%93%20Why%20This%20Release.meta.js
// ==/UserScript==

/* ==== CONFIG (Prompted) ==== */
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

/* ==== POPUP ==== */
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

/* ==== API ==== */
function radarrGet(path) {
    console.log("radarrGet", path);
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


/* ==== MATCHING ==== */
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


function ensureWhyHeader() {
    const headerRow = document.querySelector("thead tr");
    if (!headerRow) return;

    // Only add once
    if (headerRow.querySelector(".why-col-header")) return;

    const th = document.createElement("th");
    th.className = "why-col-header";
    th.style.width = "40px";  // match the delete column
    th.style.textAlign = "center";
    th.style.whiteSpace = "nowrap";
    headerRow.appendChild(th);
}


/* ==== SAB PATCH ==== */
async function patchSab() {
    // This selector worked earlier for you
    const sabRows = document.querySelectorAll("tr.queue-item");

    sabRows.forEach(row => {

        // If we've already added our own column, do nothing
        if (row.querySelector("td.why-col")) return;

        // Create title by reading the existing span
        const span = row.querySelector("td.name .row-wrap-text span[title]");
        if (!span) return;

        const cleanTitle = span.getAttribute("title").trim();

        // Create dedicated column
        const td = document.createElement("td");
        td.className = "delete why-col";   // same style as trash column

        td.style.padding = "0 5px";
        td.style.whiteSpace = "nowrap";
        td.style.textAlign = "center";


        const btn = document.createElement("button");
        btn.className = "why-btn";
        btn.textContent = "Why?";

        btn.style.padding = "2px 6px";
        btn.style.background = "black";
        btn.style.color = "white";
        btn.style.border = "1px solid #666";
        btn.style.borderRadius = "3px";
        btn.style.fontSize = "11px";
        btn.style.cursor = "pointer";

        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            e.preventDefault();

            console.log("SAB Why clicked");

            const hist = await radarrGet("history?page=1&pageSize=500&sortDirection=descending");

            if (!hist || !hist.records) {
                popup("No Radarr history available.");
                return;
            }

            const rec = pickMatchingRecord(hist.records, cleanTitle);
            popup(formatReason(rec));
        });

        td.appendChild(btn);

        // Append as LAST column (SAB won't touch it)
        row.appendChild(td);
    });




}


/* ==== OBSERVER ==== */
new MutationObserver(() => {
    ensureWhyHeader();
    patchSab();
}).observe(document.body, { childList: true, subtree: true });

ensureWhyHeader();
patchSab();