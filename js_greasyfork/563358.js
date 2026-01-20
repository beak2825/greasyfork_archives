// ==UserScript==
// @name         Torn Racing RS Gain Predictor (Updated Weights)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Adds RS gain predictions using updated cubic model weights and track constants.
// @author       Gemini + Omanpx [1906686]
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563358/Torn%20Racing%20RS%20Gain%20Predictor%20%28Updated%20Weights%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563358/Torn%20Racing%20RS%20Gain%20Predictor%20%28Updated%20Weights%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getSavedSetting = (key, fallback) => {
        const val = localStorage.getItem(`torn_rs_${key}`);
        return val === null ? fallback : val === 'true';
    };

    const settings = {
        stock: getSavedSetting('stock', false),
        mechanics: getSavedSetting('mechanics', false),
        official: getSavedSetting('official', false)
    };

    const saveSetting = (key, val) => {
        localStorage.setItem(`torn_rs_${key}`, val);
        settings[key] = val;
    };

    function predictRacingGain(laps, participants, startSkill, trackName, options = {}) {
        // 1. Updated Track Average Lap Times
        const trackTable = {
            "Docks": 178.65375, "Meltdown": 63.45615, "Underdog": 95.27778,
            "Commerce": 55.38067, "Vector": 67.77250, "Two Islands": 111.21667,
            "Industrial": 85.74000, "Mudpit": 42.34000, "Convict": 67.43750,
            "Withdrawal": 127.50000, "Parkland": 169.15100, "Stone Park": 81.87500,
            "Hammerhead": 61.99036, "Sewage": 104.13136, "Speedway": 29.74123,
            "Uptown": 81.05429
        };

        // 2. Additive Multipliers
        const multi = 1 + (1 * options.official) + (0.5 * options.mechanics) + (0.1 * options.stock);

        const clean = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedName = Object.keys(trackTable).find(key => clean(key) === clean(trackName));

        const avgLapTime = trackTable[normalizedName];
        if (!avgLapTime || !startSkill || startSkill <= 0) return null;

        // 3. Updated Coefficients (Cubic Model)
        const intercept = -8.234;
        const b_laps    = 0.7413;
        const b_part    = 0.3306;
        const b_time    = 0.5799;
        const b_s1      = -1.524;
        const b_s2      = 0.7185;
        const b_s3      = -0.1311;
        const b_pos     = -0.004456;

        const runModel = (pos) => {
            const lnL = Math.log(laps);
            const lnP = Math.log(participants);
            const lnT = Math.log(avgLapTime);
            const lnS = Math.log(startSkill);

            const skillPoly = (b_s1 * lnS) + (b_s2 * Math.pow(lnS, 2)) + (b_s3 * Math.pow(lnS, 3));
            const logGain = intercept + (b_laps * lnL) + (b_part * lnP) + (b_time * lnT) + skillPoly + (b_pos * pos);

            return Math.exp(logGain) * multi;
        };

        return {
            first: runModel(1).toFixed(4),
            last: runModel(participants).toFixed(4)
        };
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .rs-predictor-wrap { background: #333; color: #fff; padding: 10px; border-radius: 5px; margin-bottom: 10px; border: 1px solid #444; font-size: 12px; }
        li.rs-main-col {
            width: 105px !important;
            height: 100%;
            display: flex !important;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 10px;
            font-weight: bold;
            border-right: 1px solid #222;
            background: rgba(0,0,0,0.1);
        }
        .custom-events-wrap .title li:first-child { margin-left: 105px; }
    `;
    document.head.appendChild(style);

    function injectSettings() {
        if (document.getElementById('rs-predictor-config')) return;
        const mainContainer = document.querySelector('#racingMainContainer');
        if (!mainContainer) return;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'rs-predictor-config';
        settingsDiv.className = 'rs-predictor-wrap';
        settingsDiv.innerHTML = `
            <div style="margin-bottom: 5px;"><b>RS Predictor Config (v3.1)</b></div>
            <label style="margin-right:10px;"><input type="checkbox" id="rs-stock" ${settings.stock ? 'checked' : ''}> Stock Owned</label>
            <label style="margin-right:10px;"><input type="checkbox" id="rs-mechanic" ${settings.mechanics ? 'checked' : ''}> Mechanic Shop</label>
        `;
        mainContainer.parentNode.insertBefore(settingsDiv, mainContainer);

        ['stock', 'mechanic', 'official'].forEach(key => {
            document.getElementById(`rs-${key}`).onchange = (e) => {
                saveSetting(key === 'mechanic' ? 'mechanics' : key, e.target.checked);
                processRaces(true);
            };
        });
    }

    function processRaces(force = false) {
        const skillEl = document.querySelector('.skill');
        const startSkill = skillEl ? parseFloat(skillEl.textContent.replace(/[^\d.]/g, '')) : 0;
        if (!startSkill) return;

        const rows = document.querySelectorAll('.custom-events-wrap > .cont-black > ul > li');

        rows.forEach(row => {
            if (row.classList.contains('title') || row.classList.contains('clear')) return;
            if (row.querySelector('.rs-main-col') && !force) return;

            const trackEl = row.querySelector('.track');
            if (!trackEl) return;

            const trackText = trackEl.innerText.trim();
            const trackName = trackText.split('(')[0].trim();
            const laps = (trackText.match(/\d+/) || [0])[0];
            const driversEl = row.querySelector('.drivers');
            const maxParticipants = driversEl ? (driversEl.innerText.split('/')[1] || 12) : 12;

            const result = predictRacingGain(parseInt(laps), parseInt(maxParticipants), startSkill, trackName, settings);

            if (result) {
                const old = row.querySelector('.rs-main-col');
                if (old) old.remove();

                const newLi = document.createElement('li');
                newLi.className = 'rs-main-col';
                const avg = (parseFloat(result.first) + parseFloat(result.last)) / 2;
                newLi.style.color = avg >= 0.08 ? '#82E0AA' : (avg <= 0.03 ? '#F1948A' : '#F7DC6F');
                newLi.innerText = `${result.first}-${result.last}`;
                row.prepend(newLi);
            }
        });
    }

    const observer = new MutationObserver(() => {
        injectSettings();
        processRaces();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();