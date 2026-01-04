// ==UserScript==
// @name         📸 Paparazzi Alert
// @namespace    chk.scripts
// @version      10.2
// @description  Tooltip shows bold/starred list; Stealthy Check lists stealthy profiles; City Tally counts upcoming show cities. Added delays to prevent logout.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Charts/PaparazziList
// @grant        GM_xmlhttpRequest
// @connect      *.popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/560865/%F0%9F%93%B8%20Paparazzi%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/560865/%F0%9F%93%B8%20Paparazzi%20Alert.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🚨 Delay between character fetches to prevent logout
    const FETCH_DELAY = 300; // 0.3 seconds between each fetch

    // Helper function to wait
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.addEventListener('load', () => {

        const tooltip = document.createElement("div");
        tooltip.style.cssText = `
            font-family: Bahnschrift, sans-serif;
            font-size: 13px;
            color: #333;
            padding: 12px;
            position: fixed;
            bottom: 85px;
            right: 20px;
            border-radius: 14px;
            background: linear-gradient(135deg,#fff0f5,#ffe4e1);
            border: 2px solid rgb(255 129 102);
            box-shadow: 0 5px 15px rgba(255,102,102,0.4);
            z-index: 99999;
            display: none;
            text-align: left;
            max-width: 270px;
            max-height: 360px;
            overflow-y: auto;
            line-height: 1.4;
        `;
        document.body.appendChild(tooltip);

        const btn = document.createElement("div");
        btn.textContent = "⭐";
        btn.title = "Paparazzi Alert";
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg,#fff0f5,#ffe4e1);
            border: 2px solid rgb(255 129 102);
            border-radius: 50%;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 99999;
            box-shadow: 0 5px 15px rgba(255,102,102,0.4);
            transition: transform 0.2s ease, box-shadow 0.3s ease;
        `;
        btn.onmouseenter = () => {
            btn.style.transform = "scale(1.1)";
            btn.style.boxShadow = "0 5px 20px rgba(255,102,204,0.6)";
        };
        btn.onmouseleave = () => {
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "0 5px 15px rgba(255,102,204,0.4)";
        };
        document.body.appendChild(btn);

        let featured = [];
        let allChars = [];
        let tooltipVisible = false;

        btn.onclick = () => {
            tooltipVisible = !tooltipVisible;
            tooltip.style.display = tooltipVisible ? "block" : "none";
            if (tooltipVisible) {
                tooltip.innerHTML = `<b>📸 Scanning paparazzi...</b>`;
                scanPaparazzi();
            }
        };

        function scanPaparazzi() {
            featured = [];
            allChars = [];
            const rows = Array.from(document.querySelectorAll("table.data tbody tr"));
            rows.forEach(row => {
                const anchor = row.querySelector("a[href*='/Character/']");
                if (!anchor) return;
                const name = anchor.textContent.trim();
                const href = anchor.href;
                const bold = anchor.querySelector("strong");
                const starCell = row.querySelector("td:last-child div[title*='stars']");
                const stars = starCell ? starCell.getAttribute("title") : "No stars";
                allChars.push({ name, href, stars });
                if (bold) featured.push({ name, href, stars });
            });
            updateTooltip();
        }

        function updateTooltip() {
            let html = `<b>📸 Paparazzi Alert</b><br>`;
            if (featured.length > 0) {
                html += featured.map(f =>
                    `<a href="${f.href}" target="_blank" style="color:#a14747;text-decoration:none;font-weight:600;">
                        ${f.name}</a> — <i style="color:#666;">${f.stars}</i>`
                ).join("<br>");
            } else {
                html += "<i>No bolded paparazzi found.</i>";
            }

            html += `
                <br><br>
                <a href="#" id="stealthyCheck" style="color:#a14747;text-decoration:underline;font-weight:600;">
                    Stealthy Check
                </a><br>
                <a href="#" id="cityTally" style="color:#a14747;text-decoration:underline;font-weight:600;">
                    City Tally
                </a>
            `;
            tooltip.innerHTML = html;

            document.getElementById("stealthyCheck").addEventListener("click", e => {
                e.preventDefault();
                runStealthyCheck();
            });

            document.getElementById("cityTally").addEventListener("click", e => {
                e.preventDefault();
                runCityTally();
            });
        }

        // 🚨 NEW: Sequential fetching with delays
        async function runStealthyCheck() {
            const stealthyPhrase = "keep stealthy";
            const stealthyFound = [];
            const cityTally = {};
            const total = allChars.length;

            tooltip.innerHTML = `<b>🕵️‍♀️ Running Stealthy Check...</b><br>
                                 Checked 0 / ${total} characters<br>
                                 Found 0 stealthy so far`;

            for (let i = 0; i < allChars.length; i++) {
                const c = allChars[i];

                await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: c.href,
                        onload: async function (response) {
                            let isStealthy = false;
                            if (response.status === 200) {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, "text/html");
                                const block = doc.querySelector(".characterPresentation");
                                if (block && block.textContent.toLowerCase().includes(stealthyPhrase)) {
                                    isStealthy = true;
                                }
                            }

                            const parser2 = new DOMParser();
                            const doc2 = parser2.parseFromString(response.responseText, "text/html");
                            const artistLink = doc2.querySelector(".characterPresentation a[href*='/Artist/']");
                            const artistId = artistLink ? artistLink.href.match(/Artist\/(\d+)/)[1] : null;

                            let firstShow = "Unknown City";
                            if (artistId) {
                                const upcomingUrl = `/World/Popmundo.aspx/Artist/UpcomingPerformances/${artistId}`;
                                await new Promise((resolve2) => {
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: upcomingUrl,
                                        onload: function (resp2) {
                                            if (resp2.status === 200) {
                                                const parser3 = new DOMParser();
                                                const doc3 = parser3.parseFromString(resp2.responseText, "text/html");
                                                const row = doc3.querySelector("table.data tbody tr");
                                                if (row) {
                                                    const city = row.querySelector("td:nth-child(2) a:nth-child(2)")?.textContent.trim();
                                                    if (city) firstShow = city;
                                                }
                                            }

                                            if (isStealthy) stealthyFound.push({ ...c, firstShow });

                                            cityTally[firstShow] = (cityTally[firstShow] || 0) + 1;
                                            resolve2();
                                        }
                                    });
                                });
                            } else {
                                cityTally[firstShow] = (cityTally[firstShow] || 0) + 1;
                                if (isStealthy) stealthyFound.push({ ...c, firstShow });
                            }

                            tooltip.innerHTML = `<b>🕵️‍♀️ Running Stealthy Check...</b><br>
                                                 Checked ${i + 1} / ${total} characters<br>
                                                 Found ${stealthyFound.length} stealthy so far`;

                            resolve();
                        }
                    });
                });

                // 🚨 Wait before next fetch
                if (i < allChars.length - 1) {
                    await wait(FETCH_DELAY);
                }
            }

            showStealthyList(stealthyFound, cityTally);
        }

        // 🚨 NEW: Sequential fetching with delays
        async function runCityTally() {
            const cityTally = {};
            const total = allChars.length;

            tooltip.innerHTML = `<b>🌍 Running City Tally...</b><br>
                                 Checked 0 / ${total} characters`;

            for (let i = 0; i < allChars.length; i++) {
                const c = allChars[i];

                await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: c.href,
                        onload: async function (response) {
                            let firstShow = "Unknown City";

                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            const artistLink = doc.querySelector(".characterPresentation a[href*='/Artist/']");
                            const artistId = artistLink ? artistLink.href.match(/Artist\/(\d+)/)[1] : null;

                            if (artistId) {
                                const upcomingUrl = `/World/Popmundo.aspx/Artist/UpcomingPerformances/${artistId}`;
                                await new Promise((resolve2) => {
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: upcomingUrl,
                                        onload: function (resp2) {
                                            if (resp2.status === 200) {
                                                const parser2 = new DOMParser();
                                                const doc2 = parser2.parseFromString(resp2.responseText, "text/html");
                                                const row = doc2.querySelector("table.data tbody tr");
                                                if (row) {
                                                    const city = row.querySelector("td:nth-child(2) a:nth-child(2)")?.textContent.trim();
                                                    if (city) firstShow = city;
                                                }
                                            }

                                            cityTally[firstShow] = (cityTally[firstShow] || 0) + 1;
                                            resolve2();
                                        }
                                    });
                                });
                            } else {
                                cityTally[firstShow] = (cityTally[firstShow] || 0) + 1;
                            }

                            tooltip.innerHTML = `<b>🌍 Running City Tally...</b><br>
                                                 Checked ${i + 1} / ${total} characters`;

                            resolve();
                        }
                    });
                });

                // 🚨 Wait before next fetch
                if (i < allChars.length - 1) {
                    await wait(FETCH_DELAY);
                }
            }

            showCityCounts(cityTally);
        }

        function showStealthyList(stealthyFound, cityTally) {
            let html = `<b>🕵️‍♀️ Stealthy People (${stealthyFound.length})</b><br><br>`;
            if (stealthyFound.length > 0) {
                html += stealthyFound.map(s =>
                    `<a href="${s.href}" target="_blank" style="color:#a14747;font-weight:600;text-decoration:none;">
                        ${s.name}</a> — <i style="color:#666;">${s.stars}</i><br>
                     <span style="color:#555;font-size:12px;">Upcoming Show: ${s.firstShow}</span>`
                ).join("<br><br>");
            } else {
                html += `<br><i>No stealthy people found.</i>`;
            }

            html += `
                <br><br>
                <a href="#" id="backToList" style="color:#a14747;text-decoration:underline;">← Back to Paparazzi</a>
            `;
            tooltip.innerHTML = html;

            document.getElementById("backToList").addEventListener("click", e => {
                e.preventDefault();
                updateTooltip();
            });
        }

        function showCityCounts(tally) {
            let html = `<b>🌍 City Tally Results</b><br><br>`;
            const sorted = Object.keys(tally).sort((a, b) => tally[b] - tally[a]);

            sorted.forEach(city => {
                if (tally[city] > 1) {
                    html += `<span style="color:#a14747;font-weight:600;">${city}</span> <span style="color:#666;">(${tally[city]})</span><br>`;
                }
            });

            html += `
                <br><br>
                <a href="#" id="backToList" style="color:#a14747;text-decoration:underline;">← Back to Paparazzi</a>
            `;
            tooltip.innerHTML = html;

            document.getElementById("backToList").addEventListener("click", e => {
                e.preventDefault();
                updateTooltip();
            });
        }

    });
})();