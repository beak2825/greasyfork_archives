// ==UserScript==
// @name         ShippingManager - Full Ship Detail Scraper (Name Fix Final)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extract ship details, and snapshot key metrics for spreadsheet use
// @match        https://shippingmanager.cc/game*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560129/ShippingManager%20-%20Full%20Ship%20Detail%20Scraper%20%28Name%20Fix%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560129/ShippingManager%20-%20Full%20Ship%20Detail%20Scraper%20%28Name%20Fix%20Final%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SHIP_LIST_SELECTOR = ".vesselRow";
    const CLICK_DELAY = 500;
    const POPUP_TIMEOUT = 5000;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ⭐ NEW: Wait for BOTH popup + header span
    function waitForPopup() {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            (function check() {
                const popup = document.querySelector(".vesselPopup");
                const headerSpan = document.querySelector(".popup_header p span");

                if (popup && headerSpan) return resolve(popup);

                if (performance.now() - start > POPUP_TIMEOUT)
                    return reject("Popup timeout");

                requestAnimationFrame(check);
            })();
        });
    }

    function text(el) {
        return el ? el.textContent.trim() : "";
    }

    function extractShip() {
        const popup = document.querySelector(".vesselPopup");
        if (!popup) return null;

        const data = {};

        // ⭐ GUARANTEED CORRECT SHIP NAME
        const header = popup.previousElementSibling;
        const nameEl = header?.querySelector("p span");
        data.shipName = nameEl ? nameEl.textContent.trim() : "";

        // TEU
        data.teu = text(popup.querySelector(".splashLabel span"));

        // ORIGIN + DESTINATION
        const ports = popup.querySelectorAll(".vesselRouteInformation .port");
        const origin = ports[0];
        const dest = ports[1];

        if (origin) {
            data.originCode = text(origin.querySelector(".headline p"));
            data.originName = text(origin.querySelectorAll("p")[1]);
            data.originCountry = text(origin.querySelectorAll("p")[2]);
        }

        data.status = text(popup.querySelector(".vesselRouteInformation .status p"));

        if (dest) {
            data.destCode = text(dest.querySelector(".headline p"));
            data.destName = text(dest.querySelectorAll("p")[1]);
            data.destCountry = text(dest.querySelectorAll("p")[2]);
        }

        // ROUTE INFORMATION
        const routeInfo = popup.querySelector(".routeInformation");
        if (routeInfo) {
            const entries = routeInfo.querySelectorAll(".dataEntry");
            entries.forEach(entry => {
                const label = text(entry.querySelector("span"));
                const value = text(entry.querySelectorAll("span")[1]);
                if (label && value) {
                    data[label.replace(/\s+/g, "_").toLowerCase()] = value;
                }
            });
        }

        // ETA
        data.eta = text(popup.querySelector(".speedArea .speedometer p"));

        // SPEED + FUEL
        const dataEntries = popup.querySelectorAll(".speedArea .data .dataEntry");
        dataEntries.forEach(entry => {
            const label = text(entry.querySelector("span"));
            const value = text(entry.querySelectorAll("span")[1]);
            if (label && value) {
                data[label.replace(/\s+/g, "_").toLowerCase()] = value;
            }
        });

        return data;
    }

    function toCSV(rows) {
        const headers = Object.keys(rows[0]);
        const escape = v => {
            if (v == null) return "";
            const s = String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const lines = [headers.join(",")];
        rows.forEach(r => lines.push(headers.map(h => escape(r[h])).join(",")));
        return lines.join("\n");
    }

    async function scrapeAll() {
        const ships = Array.from(document.querySelectorAll(SHIP_LIST_SELECTOR));
        if (!ships.length) {
            alert("No ships found — This scrapes all details from every ship in the list which is open i.e. At Sea, At Port, Anchored, Pending. Choose your list .");
            return;
        }

        const results = [];

        for (let i = 0; i < ships.length; i++) {
            ships[i].click();
            await sleep(CLICK_DELAY);

            try {
                await waitForPopup(); // ⭐ waits for header + popup
            } catch {
                continue;
            }

            const row = extractShip();
            if (row) results.push(row);

            const closeBtn = document.querySelector(".popup_header img.header-icon");
            if (closeBtn) closeBtn.click();

            await sleep(CLICK_DELAY);
        }

        if (!results.length) {
            alert("No data scraped.");
            return;
        }

        const csv = toCSV(results);
        GM_setClipboard(csv);
        alert(`Scraped ${results.length} ships. CSV copied to clipboard.`);
    }

    function addButton() {
        if (document.querySelector("#scrapeShipsBtn")) return;

        const btn = document.createElement("button");
        btn.id = "scrapeShipsBtn";
        btn.textContent = "Scrape ALL Ships";
        btn.style.position = "fixed";
        btn.style.top = "1px";
        btn.style.right = "240px";
        btn.style.zIndex = "99999";
        btn.style.padding = "10px 14px";
        btn.style.background = "#0077ff";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";

        btn.onclick = scrapeAll;
        document.body.appendChild(btn);
    }

    // Persistent button
    setInterval(addButton, 1000);
})();
