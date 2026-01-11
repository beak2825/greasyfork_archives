// ==UserScript==
// @name         Bitcointalk User Quality Score
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Mostra Merit 120 giorni e Quality Score nel profilo Bitcointalk
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile;u=*
// @grant        GM_xmlhttpRequest
// @connect      bitlist.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562160/Bitcointalk%20User%20Quality%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/562160/Bitcointalk%20User%20Quality%20Score.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= DATE =================
    function getDate120DaysAgo() {
        const date = new Date();
        date.setDate(date.getDate() - 120);
        return date.toISOString().split('T')[0];
    }

    // ================= FETCH MERITS =================
    function fetchMerits(userUid, dateMin, dateMax) {
        const url = `https://bitlist.co/trpc/legacy.userMerits?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22userUid%22%3A${userUid}%2C%22dateMin%22%3A%22${dateMin}%22%2C%22dateMax%22%3A%22${dateMax}%22%2C%22page%22%3A1%7D%7D%7D`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const meritsData = data[0]?.result?.data?.json?.merits_received_per_day;
                        if (Array.isArray(meritsData)) {
                            resolve(meritsData);
                        } else {
                            console.error("Struttura dati inattesa per merits_received_per_day:", data);
                            reject("Struttura dati inattesa");
                        }
                    } catch (e) {
                        console.error("Errore nel parsing della risposta:", e, response.responseText);
                        reject("Errore nel parsing della risposta");
                    }
                },
                onerror: function(error) {
                    console.error("Errore nella richiesta:", error);
                    reject("Errore nella richiesta: " + error);
                }
            });
        });
    }

    function filterLast120Days(meritsData) {
        const cutoff = new Date(getDate120DaysAgo());
        return meritsData.filter(entry => new Date(entry.date) >= cutoff);
    }

    function calculateTotalMerits(meritsData) {
        const filteredData = filterLast120Days(meritsData);
        return filteredData.reduce((sum, entry) => sum + entry.sum, 0);
    }

    // ================= PARSE PROFILE =================
    function getProfileNumber(label) {
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const b = row.querySelector('td b');
            if (b && b.textContent.includes(label)) {
                const val = row.querySelectorAll('td')[1]?.textContent || '0';
                return parseInt(val.replace(/\D/g, ''), 10) || 0;
            }
        }
        return 0;
    }

    // ================= QUALITY SCORE =================
    function calculateQualityScore(posts, meritTotal, merit120) {
        if (!posts) return 0;
        return (merit120 * meritTotal) / posts;
    }

    function scoreLabel(score) {
        if (score > 300) return '🔵 Elite';
        if (score > 200) return '🟣 High quality';
        if (score > 100) return '🟢 Good user';
        if (score > 30) return '🟡 Normal';
        if (score > 5) return '🟠 Low quality';
        return '🔴 Not good';
    }

    // ================= DISPLAY =================
    function insertRow(label, value) {
        const meritLink = document.querySelector('a[href*="action=merit"]');
        if (!meritLink) return;

        const baseRow = meritLink.closest('tr');
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><b>${label}</b></td><td>${value}</td>`;
        baseRow.after(tr);
    }

    // ================= MAIN =================
    async function main() {
        const uidMatch = window.location.search.match(/u=(\d+)/);
        if (!uidMatch) return;
        const userUid = uidMatch[1];
        const dateMin = getDate120DaysAgo();
        const dateMax = new Date().toISOString().split('T')[0];

        try {
            // 1️⃣ Fetch merit 120gg
            const meritsData = await fetchMerits(userUid, dateMin, dateMax);
            const merit120 = calculateTotalMerits(meritsData);

            // 2️⃣ Post e Merit totali dal profilo
            const posts = getProfileNumber('Posts');
            const meritTotal = getProfileNumber('Merit');

            // 3️⃣ Calcolo quality score
            const score = calculateQualityScore(posts, meritTotal, merit120);

            // 4️⃣ Visualizzazione
            insertRow('Merits (120 days):', `<b>${merit120}</b>`);
            insertRow(
                'Quality score:',
                `<b>${score.toFixed(2)}</b> — ${scoreLabel(score)}`
            );

        } catch (err) {
            console.error("Errore Quality Score:", err);
        }
    }

    window.addEventListener('load', main);

})();