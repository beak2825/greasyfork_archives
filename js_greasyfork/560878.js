// ==UserScript==
// @name          Health Scanner (DISCOVERY) 🩸
// @namespace     http://tampermonkey.net/
// @version       1.31
// @description   Scan city health pages for Flu, Bubonic plague, and Cholera with cute blue floating status box + diary discovery check
// @match         https://*.popmundo.com/World/Popmundo.aspx/City/Health/*
// @grant         GM_xmlhttpRequest
// @connect       *.popmundo.com
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/560878/Health%20Scanner%20%28DISCOVERY%29%20%F0%9F%A9%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/560878/Health%20Scanner%20%28DISCOVERY%29%20%F0%9F%A9%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cities = {
        8: "Amsterdam", 35: "Ankara", 61: "Antalya", 58: "Baku", 9: "Barcelona",
        36: "Belgrade", 7: "Berlin", 33: "Brussels", 46: "Bucharest", 42: "Budapest",
        17: "Buenos Aires", 60: "Chicago", 22: "Copenhagen", 29: "Dubrovnik", 27: "Glasgow",
        19: "Helsinki", 30: "Istanbul", 47: "Izmir", 55: "Jakarta", 51: "Johannesburg",
        56: "Kyiv", 5: "London", 14: "Los Angeles", 24: "Madrid", 54: "Manila",
        10: "Melbourne", 32: "Mexico City", 52: "Milan", 38: "Montreal", 18: "Moscow",
        11: "Nashville", 6: "New York", 20: "Paris", 31: "Porto", 25: "Rio de Janeiro",
        23: "Rome", 21: "São Paulo", 49: "Sarajevo", 50: "Seattle", 45: "Shanghai",
        39: "Singapore", 53: "Sofia", 1: "Stockholm", 34: "Tallinn", 62: "Tokyo",
        16: "Toronto", 26: "Tromsø", 48: "Warsaw", 28: "Vilnius"
    };

    const BUTTON_READY_COLOR = 'rgb(0, 61, 204)';
    const BUTTON_COMPLETE_COLOR = 'rgb(0, 71, 204)';
    const baseDomain = location.origin;

    let results = [];
    let container = null;
    let checked = 0;
    const total = Object.keys(cities).length;

    const style = document.createElement('style');
    style.textContent = `
        #health-scanner-box {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 240px;
            min-height: 60px;
            background: linear-gradient(135deg, #f0f7ff, #e6f0ff, #f5fbff);
            border: 2px solid #a3c4f3;
            border-radius: 16px;
            padding: 14px 16px;
            font-family: "Comic Neue", "Segoe UI", sans-serif !important;
            font-size: 13px;
            color: #2c3e70;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            white-space: pre-line;
            z-index: 10000;
            text-align: center;
            animation: floaty 3s ease-in-out infinite;
        }
        #health-scanner-box strong {
            color: #0047cc;
            font-size: 14px;
        }
        #health-scanner-box em {
            color: #5a6ea0;
        }
        @keyframes floaty {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }
    `;
    document.head.appendChild(style);

    const createContainer = () => {
        if (container) container.remove();
        container = document.createElement('div');
        container.id = 'health-scanner-box';
        document.body.appendChild(container);
    };

    const updateDisplay = (text) => {
        if (container) container.innerHTML = text;
    };

    const checkCity = (id, name) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${baseDomain}/World/Popmundo.aspx/City/Health/${id}`,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const rows = doc.querySelectorAll("#tablediseases tbody tr");
                let line = `${name}: `;
                let found = false;

                rows.forEach(row => {
                    const condition = row.children[0]?.textContent.trim();
                    const cases = row.children[1]?.textContent.trim();
                    if (["Flu", "Bubonic plague", "Cholera", "Chicken Pox"].includes(condition)) {
                        line += `${condition} (${cases}) `;
                        found = true;
                    }
                });

                if (found) results.push(line.trim());
                checked++;
                updateStatus(name);
            },
            onerror: function() {
                checked++;
                updateStatus(name, true);
            }
        });
    };

const checkDiary = () => {
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseDomain}/World/Popmundo.aspx/Character/Diary/963089`,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const text = doc.body.textContent || "";
            const match = text.match(/Learned that (.+?) has discovered a previously unknown strain of (.+?)\./);
            if (match) {
                const name = match[1].trim();
                const disease = match[2].trim();
                const link = `${baseDomain}/World/Popmundo.aspx/Character/963089`;
                results.push(`<span style="color:#7c6fe7;">🧬 <a href="${link}" target="_blank" style="color:#7c6fe7;text-decoration:none;"><strong>${name}</strong></a> discovered <em>${disease}</em></span>`);
            }
        },
        onerror: function() {
            results.push(`<span style="color:#cc0000;">❌ Error fetching diary entry.</span>`);
        }
    });
};


const updateStatus = (name, error = false) => {
    let status = `<strong>🦠 City Health Alerts</strong><br><em>Scanning ${checked}/${total} cities...</em>`;
    let scanResults = results.filter(r => !r.includes("🧬")).join("<br>") || "No active alerts found so far.";
    let discoveryLine = results.find(r => r.includes("🧬"));

    if (error) scanResults += `<br>❌ Error checking ${name}`;

    if (checked === total) {
        scanResults += results.length > 0
            ? `<br><br>✅ Done scanning ${total} cities`
            : `<br><br>✅ Scan finished. No Flu, Bubonic Plague, or Cholera alerts found.`;

        const button = document.getElementById('health-scanner-btn');
        button.style.background = BUTTON_COMPLETE_COLOR;
        button.style.color = 'white';
    }

    let finalOutput = `${status}<br>${scanResults}`;
    if (discoveryLine) {
        finalOutput += `

            <div style="margin-top:4px;">${discoveryLine}</div>
        `;
    }

    updateDisplay(finalOutput);
};


    const startScan = () => {
        createContainer();
        const button = document.getElementById('health-scanner-btn');
        button.style.background = BUTTON_READY_COLOR;
        button.style.color = 'white';
        results = [];
        checked = 0;
        updateDisplay(`<strong>🦠 City Health Alerts</strong><br><em>Scanning 0/${total} cities...</em>`);

        checkDiary(); // Fetch discovery note
        const entries = Object.entries(cities);
        const delayedScan = (index = 0) => {
            if (index >= entries.length) return;
            const [id, name] = entries[index];
            checkCity(id, name);
            setTimeout(() => delayedScan(index + 1), 500);
        };
        delayedScan();
    };

    const button = document.createElement("div");
    button.id = 'health-scanner-btn';
    button.textContent = "🦠";
    button.title = "Start City Health Scan";
    button.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: ${BUTTON_READY_COLOR};
        color: white;
        border: 2px solid #fff;
        border-radius: 50%;
        font-size: 26px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 0 10px rgba(0, 61, 204, 0.6);
        font-family: 'Arial Black', sans-serif;
    `;
    document.body.appendChild(button);
    button.onclick = startScan;

})();
