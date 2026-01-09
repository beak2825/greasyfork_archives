// ==UserScript==
// @name         NotebookLM Harvester (All Notebook Titles + Links in your instance)
// @namespace    http://tampermonkey.net/
// @version      22.0
// @description  Detects all Notebook IDs open in your instance of NotebookLM (or multiple instances with multiple accounts), navigates to each notebook to extract titles, then can copy sorted list. Some default and featured notebooks are excluded, if you want to see these too, clear the ignoreList.
// @author       Kian Juzi
// @match        https://notebooklm.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561983/NotebookLM%20Harvester%20%28All%20Notebook%20Titles%20%2B%20Links%20in%20your%20instance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561983/NotebookLM%20Harvester%20%28All%20Notebook%20Titles%20%2B%20Links%20in%20your%20instance%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = "https://notebooklm.google.com/notebook/";

    // --- Configuration ---
    const ignoreList = [
        "71669a91-d5f0-4298-913e-9193178ec62c", "62e5c8db-3dd2-407c-8d19-32ae4ae799db",
        "953b658a-579b-4b3c-b280-43b3781babf3", "19fdf6bd-1975-40a3-9801-c554130bc64a",
        "e4ddc6f8-ada2-4aaa-b9dc-c3ff7c325bf8", "34510332-d39c-499e-882d-e48393d612cd",
        "505ee4b1-ad05-4673-a06b-1ec106c2b940", "a09e40ad-d41f-43af-a3ca-5fc82bd459e5",
        "0d5cd576-2583-4835-8848-a5b7b6a97cea", "5881d15d-7b82-4002-8613-df59b6eece4c",
        "19fdf6bd-1975-40a3-9801-c554130bc64a", "750a23df-fd98-4954-b9c4-71f16c3ee937",
        "a867885b-4dc1-47a3-b862-e256b159c64d", "40b0bb3f-afa6-49b2-959f-d91fb0a91a3b",
        "780a38ee-d0a6-4fb1-b255-aa03c8d67dce", "31c20c44-8c94-4f81-a2b8-a020a761d122",
        "24d50377-8c14-4851-bcc2-b2d67b039041", "1e5735b3-7868-44e5-927d-ad7f8d69d5ae",
        "19bde485-a9c1-4809-8884-e872b2b67b44", "f7607d7a-584c-4f35-96fc-f6815c573a6c"
    ];

    // --- State Management ---
    let status = GM_getValue("nb_status", "IDLE"); // IDLE, CRAWLING, DONE
    let results = GM_getValue("nb_results", {}); // ID -> {emoji, title}
    let queue = GM_getValue("nb_queue", []); // Array of IDs left to visit

    // --- ID Detection Logic ---
    function scanForIds(content) {
        if (!content || typeof content !== 'string') return;

        const pairRegex = /\\"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\\",\\"((?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+)\\"/gi;

        let match;
        let foundAny = false;
        const currentResults = GM_getValue("nb_results", {});

        while ((match = pairRegex.exec(content)) !== null) {
            const id = match[1].toLowerCase();
            const emoji = match[2];

            // Apply Ignore List Filter
            if (ignoreList.includes(id)) continue;

            if (!currentResults[id]) {
                currentResults[id] = { emoji: emoji, title: null };
                foundAny = true;
            }
        }

        if (foundAny) {
            GM_setValue("nb_results", currentResults);
            updateButtonUI();
        }
    }

    // 1. Scan initial page source
    window.addEventListener('DOMContentLoaded', () => {
        scanForIds(document.documentElement.innerHTML);
    });

    // 2. Hook Network (for dynamic data)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        if (args[0] && typeof args[0] === 'string' && args[0].includes('batchexecute')) {
            const clone = response.clone();
            clone.text().then(scanForIds).catch(()=>{});
        }
        return response;
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (typeof url === 'string' && url.includes('batchexecute')) {
                scanForIds(this.responseText);
            }
        });
        return originalOpen.apply(this, arguments);
    };

    // --- Sequential Navigation Crawler ---
    function runCrawler() {
        if (status !== "CRAWLING") return;

        const currentQueue = GM_getValue("nb_queue", []);
        if (currentQueue.length === 0) {
            GM_setValue("nb_status", "DONE");
            window.location.href = "https://notebooklm.google.com/";
            return;
        }

        const targetId = currentQueue[0];

        // Navigate to the notebook if not already there
        if (!window.location.href.includes(targetId)) {
            window.location.href = baseUrl + targetId;
            return;
        }

        // Wait for rendered title in the SPA
        const checkTitle = setInterval(() => {
            const pageTitle = document.title;
            // Check if title is no longer generic "Loading" or "NotebookLM"
            if (pageTitle && pageTitle !== "Google NotebookLM" && pageTitle !== "NotebookLM" && pageTitle !== "Loading...") {
                clearInterval(checkTitle);

                const cleanTitle = pageTitle.replace(/\s*-\s*NotebookLM/i, '').trim();
                const allResults = GM_getValue("nb_results", {});

                if (allResults[targetId]) {
                    allResults[targetId].title = cleanTitle;
                    GM_setValue("nb_results", allResults);
                }

                // Move to next in queue
                currentQueue.shift();
                GM_setValue("nb_queue", currentQueue);

                if (currentQueue.length > 0) {
                    window.location.href = baseUrl + currentQueue[0];
                } else {
                    GM_setValue("nb_status", "DONE");
                    window.location.href = "https://notebooklm.google.com/";
                }
            }
        }, 1000);
    }

    // --- UI Implementation ---
    const btn = document.createElement('button');
    btn.id = "harvester-v22";
    Object.assign(btn.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '999999',
        padding: '15px 25px', backgroundColor: '#3c4043', color: 'white',
        border: 'none', borderRadius: '50px', cursor: 'pointer',
        fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    });

    function updateButtonUI() {
        const res = GM_getValue("nb_results", {});
        const count = Object.keys(res).length;
        const currentStatus = GM_getValue("nb_status", "IDLE");

        if (currentStatus === "IDLE") {
            btn.innerText = `Detected ${count} Notebooks | Start Scraper`;
            btn.style.backgroundColor = count > 0 ? "#1a73e8" : "#3c4043";
        } else if (currentStatus === "CRAWLING") {
            const q = GM_getValue("nb_queue", []);
            btn.innerText = `Crawling: ${q.length} left...`;
            btn.style.backgroundColor = "#f4b400";
        } else {
            btn.innerText = `✅ Copy ${count} Sorted Links`;
            btn.style.backgroundColor = "#0d652d";
        }
    }

    btn.onclick = () => {
        const currentStatus = GM_getValue("nb_status", "IDLE");

        if (currentStatus === "IDLE") {
            const allResults = GM_getValue("nb_results", {});
            const idsToVisit = Object.keys(allResults).filter(id => !allResults[id].title);

            if (idsToVisit.length === 0) return alert("All detected notebooks already have titles or none were detected.");

            GM_setValue("nb_queue", idsToVisit);
            GM_setValue("nb_status", "CRAWLING");
            window.location.href = baseUrl + idsToVisit[0];
        }
        else if (currentStatus === "DONE") {
            copyAndReset();
        }
    };

    function copyAndReset() {
        const allResults = GM_getValue("nb_results", {});
        const sorted = Object.entries(allResults)
            .filter(([id, data]) => data.title)
            .sort((a, b) => a[1].title.localeCompare(b[1].title, undefined, {numeric: true, sensitivity: 'base'}));

        const text = sorted.map(([id, data]) => `${data.emoji} ${data.title}: ${baseUrl}${id}`).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            alert("Alphabetized list copied to clipboard!");
            GM_deleteValue("nb_status");
            GM_deleteValue("nb_results");
            GM_deleteValue("nb_queue");
            location.reload();
        });
    }

    // Render Button
    setInterval(() => {
        if (!document.getElementById("harvester-v22") && document.body) {
            document.body.appendChild(btn);
            updateButtonUI();
        }
    }, 1000);

    // Resume crawler logic on page load
    if (GM_getValue("nb_status") === "CRAWLING") {
        runCrawler();
    }

})();