// ==UserScript==
// @name         FA Conglomerator 2026 (ZIP Downloader)
// @namespace    AgarHeroYT
// @version      5.0
// @description  Downloads all submissions from an FA gallery/scraps into one ZIP file.
// @match        https://www.furaffinity.net/gallery/*
// @match        https://www.furaffinity.net/scraps/*
// @run-at       document-end
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/563962/FA%20Conglomerator%202026%20%28ZIP%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563962/FA%20Conglomerator%202026%20%28ZIP%20Downloader%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = false;

    function createButton() {
        if (document.getElementById("faConglomerateBtn")) return;

        const btn = document.createElement("div");
        btn.id = "faConglomerateBtn";
        btn.textContent = "Conglomerate (ZIP)";

        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "999999999",
            background: "#222",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(0,0,0,0.6)",
            userSelect: "none"
        });

        btn.onmouseenter = () => btn.style.background = "#333";
        btn.onmouseleave = () => btn.style.background = "#222";
        btn.onclick = start;

        document.body.appendChild(btn);
    }

    async function start() {
        if (running) return;
        running = true;

        const zip = new JSZip();

        const statusWin = window.open("", "_blank");
        statusWin.document.write(`
            <h2>FA Conglomerator ZIP Mode</h2>
            <div id="status">Scanning gallery…</div>
            <hr>
        `);

        const links = await collectAllSubmissions();
        statusWin.document.getElementById("status").innerText =
            `Found ${links.length} submissions. Downloading images…`;

        let count = 1;

        for (const link of links) {
            try {
                const imgURL = await extractImage(link);
                if (!imgURL) throw "No image found";

                const blob = await fetch(imgURL).then(r => r.blob());
                const filename = imgURL.split("/").pop().split("?")[0];

                zip.file(`${count.toString().padStart(4,"0")}_${filename}`, blob);

                statusWin.document.write(
                    `<div><b>${count}:</b> Added ${filename}</div>`
                );
            } catch (e) {
                statusWin.document.write(
                    `<div><b>${count}:</b> <span style="color:red">FAILED</span></div>`
                );
            }

            count++;
            await sleep(1200); // prevent rate limiting
        }

        statusWin.document.getElementById("status").innerText =
            "Building ZIP file… this may take a moment.";

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const username = location.pathname.split("/")[2];
        const mode = location.pathname.includes("/scraps/") ? "scraps" : "gallery";
        const zipName = `FA_${username}_${mode}.zip`;

        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipName;
        a.click();

        statusWin.document.getElementById("status").innerText =
            `Done! Saved as ${zipName}`;

        running = false;
    }

    async function collectAllSubmissions() {
        let page = 1;
        let all = [];

        while (true) {
            const url = `${location.origin}${location.pathname}${page}/`;
            const html = await fetch(url).then(r => r.text());
            const doc = new DOMParser().parseFromString(html, "text/html");

            const links = [...doc.querySelectorAll('a[href^="/view/"]')]
                .map(a => "https://www.furaffinity.net" + a.getAttribute("href"));

            if (!links.length) break;

            all.push(...links);
            page++;
            await sleep(800);
        }

        return [...new Set(all)];
    }

    async function extractImage(submissionURL) {
        const html = await fetch(submissionURL).then(r => r.text());
        const doc = new DOMParser().parseFromString(html, "text/html");

        const img = doc.querySelector("#submissionImg");
        return img ? img.src : null;
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    createButton();
})();
