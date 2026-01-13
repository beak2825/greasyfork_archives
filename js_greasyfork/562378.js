// ==UserScript==
// @name         Expedition Analyzer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Analizuje uczestnictwo w ekspedycjach klanowych
// @author       Varriz
// @license      MIT
// @include      *://*.bloodwars.pl/*
// @include      *://*.bloodwars.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562378/Expedition%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/562378/Expedition%20Analyzer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const DELAY_BETWEEN_REQUESTS = 500; // ms

    // Utility: Sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Utility: Fetch with delay
    async function fetchDocument(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(text, "text/html");
        } catch (error) {
            console.error("Failed to fetch " + url, error);
            return null;
        }
    }

    // Main Logic
    async function runAnalysis(mode) {
        const title = mode === 'samar_map2' ? "Analiza Samarytan (2 mapa)" : "Raport Ekspedycji";
        const statusDiv = createStatusWindow();
        statusDiv.innerHTML = "Wczytywanie listy sojuszników...";

        try {
            // 1. Zbierze wszystkich członków klanu
            const members = getClanMembers();
            console.log("Znaleziono członków: ", members.length);
            statusDiv.innerHTML = `Znaleziono ${members.length} członków. Rozpoczynam analizę profili...<br><progress id='bw_progress' value='0' max='${members.length}'></progress>`;

            const expeditionReports = new Set();
            const progress = document.getElementById('bw_progress');

            // 2. Wejdzie w profil każdego po kolei
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                statusDiv.innerHTML = `Analiza profilu: ${member.name} (${i + 1}/${members.length})<br><progress value='${i + 1}' max='${members.length}'></progress>`;

                const profileDoc = await fetchDocument(member.profileUrl);
                if (profileDoc) {
                    // 3. Z sekcji "zdobyte odznaki" przeanalizuje każdy link
                    const reports = getExpeditionReportsFromProfile(profileDoc, mode);
                    reports.forEach(report => expeditionReports.add(report));
                }

                await sleep(DELAY_BETWEEN_REQUESTS);
            }

            const uniqueReports = Array.from(expeditionReports);
            console.log("Unikalnych raportów ekspedycji: ", uniqueReports.length);
            statusDiv.innerHTML = `Znaleziono ${uniqueReports.length} unikalnych raportów. Analiza uczestnictwa...<br><progress value='0' max='${uniqueReports.length}'></progress>`;

            // 4. Doda obecność do tabeli
            const participationStats = {};

            for (let i = 0; i < uniqueReports.length; i++) {
                statusDiv.innerHTML = `Analiza raportu ${i + 1}/${uniqueReports.length}<br><progress value='${i + 1}' max='${uniqueReports.length}'></progress>`;
                const reportUrl = uniqueReports[i];
                const reportDoc = await fetchDocument(reportUrl);

                if (reportDoc) {
                    const participants = getParticipantsFromReport(reportDoc, mode);
                    participants.forEach(nick => {
                        participationStats[nick] = (participationStats[nick] || 0) + 1;
                    });
                }
                await sleep(DELAY_BETWEEN_REQUESTS);
            }

            // 5. Podsumuje wynik w tabeli
            displayResults(participationStats, title);
            document.body.removeChild(statusDiv); // Remove status window after done

        } catch (e) {
            console.error(e);
            statusDiv.innerHTML = "Wystąpił błąd: " + e.message;
        }
    }

    // Step 1: Get Members
    function getClanMembers() {
        const members = [];
        const rows = document.querySelectorAll("table#clanMemberList tbody tr");

        rows.forEach(row => {
            const link = row.querySelector("a[href*='?a=profile&uid=']");
            if (link) {
                members.push({
                    name: link.textContent.trim(),
                    profileUrl: link.href
                });
            }
        });
        return members;
    }

    // Step 3 (part 1): Extract report links from profile
    function getExpeditionReportsFromProfile(doc, mode) {
        const links = [];
        let containerSelectors = ["div.ceventMedalLine"];

        // If mode is samar_map2, we only want the second div.ceventMedalLine
        if (mode === 'samar_map2') {
            const medalLines = doc.querySelectorAll("div.ceventMedalLine");
            if (medalLines.length < 2) {
                return []; // No second map medals
            }
            // Iterate only the second one (index 1)
            const anchors = medalLines[1].querySelectorAll("a.imgLink");
            anchors.forEach(a => processAnchor(a, links));
            return links;
        }

        // Default mode: process all lines found (usually there is only one unless multiple maps/events)
        // Adjusting original logic: scan ALL div.ceventMedalLine just in case? 
        // User request implied usually one line, but said "take all links".
        // With 'samar_map2', we specifically target the 2nd.
        // For default, we continue to take from all lines to be safe, or just the first if that was the implication.
        // The prompt said: "From 'zdobyte odznaki' section analyze every link".
        // So we iterate all lines found.
        const medalLines = doc.querySelectorAll("div.ceventMedalLine");
        medalLines.forEach(line => {
            const anchors = line.querySelectorAll("a.imgLink");
            anchors.forEach(a => processAnchor(a, links));
        });

        return links;
    }

    function processAnchor(a, links) {
        if (a.href) {
            let href = a.getAttribute('href');
            if (!href.startsWith('http')) {
                href = location.origin + '/' + href;
            }
            links.push(href);
        }
    }

    // Step 3 (part 2) & 4: Extract participants from report
    function getParticipantsFromReport(doc, mode) {
        const participants = [];
        // Selector: div.msg-quest span.atkHit
        const hits = doc.querySelectorAll("div.msg-quest span.atkHit");

        hits.forEach(span => {
            let nick = span.textContent.trim();
            // Clean nick: remove " (*)"
            if (nick.endsWith(" (*)")) {
                nick = nick.replace(" (*)", "").trim();
            }

            if (mode === 'samar_map2') {
                // Check for (samarytanin) next to the nick
                // Expected DOM: <span class="atkHit">Nick</span> <b>0</b> (samarytanin) <br>
                // We check the next sibling text nodes/elements after the span.
                // Usually span -> nextSibling is text (space), nextNext contains <b>

                let isSamar = false;
                // Quick scan of siblings
                let sibling = span.nextSibling;
                let attempts = 0;
                while (sibling && attempts < 5) { // Limit search to nearby nodes
                    if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent.includes('samarytanin')) {
                        isSamar = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                    attempts++;
                }

                if (isSamar && nick) {
                    participants.push(nick);
                }

            } else {
                // Default mode: take everyone
                if (nick) {
                    participants.push(nick);
                }
            }
        });
        return participants;
    }

    // UI: Status Window
    function createStatusWindow() {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.backgroundColor = 'rgba(0,0,0,0.9)';
        div.style.color = 'white';
        div.style.padding = '15px';
        div.style.borderRadius = '5px';
        div.style.zIndex = '99999';
        div.style.border = '1px solid #666';
        div.style.minWidth = '250px';
        document.body.appendChild(div);
        return div;
    }

    // Step 5: Display Results
    function displayResults(stats, title) {
        // Convert to array and sort
        const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);

        // Create UI
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#1a1a1a';
        container.style.color = '#ddd';
        container.style.padding = '20px';
        container.style.border = '2px solid #444';
        container.style.zIndex = '100000';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.boxShadow = '0 0 10px black';

        let html = `
            <h2 style="margin-top:0; text-align:center; color: #f00;">${title}</h2>
            <table border="1" style="width:100%; border-collapse: collapse; text-align: left; border-color: #444;">
                <thead style="background: #333;">
                    <tr>
                        <th style="padding: 5px;">Lp.</th>
                        <th style="padding: 5px;">Nick</th>
                        <th style="padding: 5px;">Ilość wystąpień</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sorted.forEach((item, index) => {
            html += `
                <tr>
                    <td style="padding: 5px;">${index + 1}</td>
                    <td style="padding: 5px;">${item[0]}</td>
                    <td style="padding: 5px;">${item[1]}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 15px;">
                <button id="closeResultsVal" style="padding: 5px 15px; cursor: pointer;">Zamknij</button>
            </div>
        `;

        container.innerHTML = html;
        document.body.appendChild(container);

        document.getElementById('closeResultsVal').addEventListener('click', function () {
            document.body.removeChild(container);
        });
    }

    // Init triggering mechanism
    if (location.search.includes('a=aliance')) {
        const btn = document.createElement('button');
        btn.textContent = "Analizuj samarów 2 mapę";
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.left = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';

        // Try to append near the table if possible, otherwise fixed position
        const referenceTable = document.getElementById('clanMemberList');
        if (referenceTable) {
            btn.style.position = 'static';
            referenceTable.parentNode.insertBefore(btn, referenceTable);
        } else {
            document.body.appendChild(btn);
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            runAnalysis('samar_map2');
        });
    }

})();
