// ==UserScript==
// @name         Torn Open Races Display
// @namespace    underko.torn.scripts.racing
// @version      0.1
// @author       underko[3362751]
// @description  Shows open races while waiting for yours to start
// @match        *.torn.com/loader.php?sid=racing*
// @match        *.torn.com/page.php?sid=racing*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549730/Torn%20Open%20Races%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/549730/Torn%20Open%20Races%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FETCH_INTERVAL = 5_000;
    const RACE_COUNT = 100;

    const TRACKS = {
        6: "Uptown",
        7: "Withdrawal",
        8: "Underdog",
        9: "Parkland",
        10: "Docks",
        11: "Commerce",
        12: "Two Islands",
        15: "Industrial",
        16: "Vector",
        17: "Mudpit",
        18: "Hammerhead",
        19: "Sewage",
        20: "Meltdown",
        21: "Speedway",
        23: "Stone Park",
        24: "Convict"
    };

    // Single hidden element reused for html escpaed string decoding
    const htmlEntityDecoder = document.createElement("textarea");

    GM_registerMenuCommand("Set Torn API Key", () => {
        const key = prompt("Enter your public Torn API key", GM_getValue("tornApiKey", ""));
        if (key) {
            GM_setValue("tornApiKey", key);
        }
    });

    const API_KEY = GM_getValue("tornApiKey", "");
    if (!API_KEY) {
        console.warn("No API key set. Use Tampermonkey menu to set one.");
        return;
    }

    function formatTime(seconds) {
        if (seconds >= 3600 || seconds <= -3600) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (seconds >= 60 || seconds <= -60) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}m ${secs}s`;
        } else {
            return `${seconds}s`;
        }
    }

    async function fetchAllRaces(limit) {
        const startFromUnix = Math.floor(Date.now() / 1000 - 3600);
        let races = [];
        let url = `https://api.torn.com/v2/racing/races?cat=custom&limit=100&sort=desc&from=${startFromUnix}&key=${API_KEY}`;
        let fetchedCount = 0;

        while (url && fetchedCount < limit) {
            const pageData = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data);
                        } catch (err) {
                            console.error("[TornRaces] Failed to parse API response", err);
                            resolve({});
                        }
                    },
                    onerror: (err) => {
                        console.error("[TornRaces] API request error:", err);
                        resolve({});
                    }
                });
            });

            if (pageData.races && pageData.races.length) {
                races.push(...pageData.races);
                fetchedCount += pageData.races.length;
            }

            const prev = pageData?._metadata?.links?.prev || null;
            if (prev) {
                // Append API key if not present in the meta url
                url = prev.includes("&key=") ? prev : `${prev}&key=${API_KEY}`;
            } else {
                url = null;
            }
        }

        return races.slice(0, limit);
    }

    function decodeHtml(text) {
        htmlEntityDecoder.innerHTML = text;
        return htmlEntityDecoder.value;
    }

    function renderTable(races) {
        const container = document.querySelector(".car-selected-wrap.m-top10");
        if (!container) return;

        const clearEl = container.querySelector(".clear");

        let tableWrap = container.querySelector("#openRacesTableWrap");
        if (!tableWrap) {
            tableWrap = document.createElement("div");
            tableWrap.className = "left";
            tableWrap.id = "openRacesTableWrap";

            const clearEl = Array.from(container.children)
            .find(el => el.classList.contains("clear"));

            if (clearEl) {
                container.insertBefore(tableWrap, clearEl);
            } else {
                container.appendChild(tableWrap);
            }
        }

        let html = `
<style>
    #openRacesTableWrap table {
        border-collapse: collapse;
        width: 233px;
        background-color: rgba(0,0,0,0.3);
        color: #ddd;
        font-size: 12px;
    }
    #openRacesTableWrap th {
        background-color: rgba(255,255,255,0.05);
        padding: 6px 8px;
        text-align: left;
        font-weight: bold;
        color: #fff;
    }
    #openRacesTableWrap td {
        padding: 4px 8px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #openRacesTableWrap tr:hover {
        background-color: rgba(255,255,255,0.05);
    }
</style>
<table>
    <tr>
        <th>Track</th>
        <th>Racers</th>
        <th>Laps</th>
        <th>Start</th>
    </tr>`;

        const now = Math.floor(Date.now() / 1000);

        races.sort((a, b) => {
            const aStart = a.schedule?.start || 0;
            const bStart = b.schedule?.start || 0;
            return aStart - bStart;
        });

        races.forEach(r => {
            const timeUntilStart = r.schedule?.start ? r.schedule.start - now : 0;
            const trackName = TRACKS[r.track_id].slice(0, 5) || `Unknown (${r.track_id})`;

            if (timeUntilStart >= 3600) return;

            const decodedTitle = decodeHtml(r.title);

            html += `<tr title="${decodedTitle.replace(/"/g, "&quot;")}">
                <td style="color: #ddd">${trackName}</td>
                <td style="color: #ddd">${r.participants.current}/${r.participants.maximum}</td>
                <td style="color: #ddd">${r.laps}</td>
                <td style="color: #ddd">${timeUntilStart < 0 ? "waiting" : formatTime(timeUntilStart)}</td>
            </tr>`;
        });

        html += `</table>`;
        tableWrap.innerHTML = html;
    }

    function isWaitingForRace() {
        return document.querySelector(".pd-position") !== null;
    }

    function isRaceEligible(race) {
        const { status, schedule, requirements, participants } = race;

        // Exclude finished or already ended races
        if (status === "finished" || schedule.end != null) return false;

        // Exclude password-protected races
        if (requirements.requires_password === true) return false;

        // Exclude races with restricted car class (allow only A or null - no restrictions)
        if (requirements.car_class !== null && requirements.car_class !== "A") return false;

        // Exclude races that require stock cars
        if (requirements.requires_stock_car === true) return false;

        // Exclude races that are already full
        if (participants.current >= participants.maximum) return false;

        // Exclude races tied to a specific car item
        // Needs logic to allow permitted track and car combinations
        // if (requirements.car_item_id != null) return false;

        return true;
    }

    let lastFetch = 0;

    const observer = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastFetch >= FETCH_INTERVAL) {
            lastFetch = now;
            if (isWaitingForRace()) {
                fetchAllRaces(RACE_COUNT).then((allRaces) => {
                    const openRaces = allRaces.filter(isRaceEligible);
                    renderTable(openRaces);
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
