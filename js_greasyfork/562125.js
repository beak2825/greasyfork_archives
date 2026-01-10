// ==UserScript==
// @name         FV - test Claw Machine
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      6.6
// @description  Play the claw machine and win rewards! (yes really)
// @match        https://www.furvilla.com/villager/455945
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562125/FV%20-%20test%20Claw%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/562125/FV%20-%20test%20Claw%20Machine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------
    // CONFIG
    // -------------------------
    const LOOT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZeVrwpp8T5a8nQL6fXjpbJO5WKy702vINPsUyBY8XqYGwErKESjQIcsKp3_rxM9paG1WveEqxBpp7/pub?gid=0&single=true&output=csv";
    const CONFIG_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRO_sdH0JCbaSzKMAdGxwaIqoIK4lBSnOQ8hxMloIgtxHQYUDBA8qqwj_vTt-hz8g3xTnvEpoG4FhgN/pub?gid=0&single=true&output=csv";
    const CLAW_IMG = "https://www.furvilla.com/img/items/8/8159-cold-weather-claus.png";
    const MASCOT_IMG = "https://www.furvilla.com/img/items/0/795-magic-persian-cat-plush.png";
    const GAMBIT_IMG = "https://www.furvilla.com/img/villagers/0/54-4-th.png";

    let CRATE_CHANCE = 0.01;
    let COMMON_CRATE = {
        name: "Common Crate",
        url: "https://www.furvilla.com/img/items/9/9236-common-crate.png"
    };

    let PLUSHIES = [];
    let userHasPlayedToday = false;
    let currentUserID = "";
    let currentUsername = "";

    // -------------------------
    // CSV
    // -------------------------
    function parseCSV(text) {
        const rows = [];
        let row = [], cell = "", insideQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const chr = text[i];
            const nxt = text[i + 1];

            if (chr === '"' && insideQuotes && nxt === '"') {
                cell += '"';
                i++;
            } else if (chr === '"') {
                insideQuotes = !insideQuotes;
            } else if (chr === ',' && !insideQuotes) {
                row.push(cell);
                cell = "";
            } else if ((chr === '\n' || chr === '\r') && !insideQuotes) {
                if (cell.length || row.length) row.push(cell);
                if (row.length) rows.push(row);
                row = [];
                cell = "";
            } else {
                cell += chr;
            }
        }

        if (cell.length || row.length) row.push(cell);
        if (row.length) rows.push(row);
        return rows;
    }

    async function loadConfig() {
        try {
            const resp = await fetch(CONFIG_URL);
            const csv = await resp.text();
            const rows = parseCSV(csv);
            const headers = rows[0].map(h => h.trim().toLowerCase());

            const keyIndex = headers.indexOf("key");
            const valueIndex = headers.indexOf("value");
            const nameIndex = headers.indexOf("name");
            const urlIndex = headers.indexOf("url");

            if (keyIndex === -1 || valueIndex === -1) return;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const key = row[keyIndex]?.trim().toLowerCase();
                const value = row[valueIndex]?.trim();

                if (!key || !value) continue;

                if (key === "crate_chance") {
                    const chance = parseFloat(value);
                    if (!isNaN(chance) && chance >= 0 && chance <= 1) {
                        CRATE_CHANCE = chance;
                    }
                } else if (key === "crate_name" && nameIndex !== -1 && urlIndex !== -1) {
                    COMMON_CRATE.name = value;
                    COMMON_CRATE.url = row[urlIndex]?.trim() || COMMON_CRATE.url;
                }
            }
        } catch(e) {
        }
    }

    async function loadPlushList() {
        try {
            const resp = await fetch(LOOT_URL);
            const csv = await resp.text();
            const rows = parseCSV(csv);
            const headers = rows[0].map(h => h.trim().toLowerCase());

            const rarityI = headers.indexOf("rarity");
            const nameI = headers.indexOf("plush_name");
            const urlI = headers.indexOf("plush_url");

            PLUSHIES = rows.slice(1)
                .map(r => ({
                    rarity: r[rarityI]?.trim().toLowerCase(),
                    name: r[nameI]?.trim(),
                    url: r[urlI]?.trim()
                }))
                .filter(p => p.url);
        } catch(e) {
            PLUSHIES = [];
        }
    }

    function getRandomPlush() {
        if (PLUSHIES.length === 0) return null;
        return PLUSHIES[Math.floor(Math.random() * PLUSHIES.length)];
    }

    async function checkIfUserHasPlayedToday(userID) {
        try {
            const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZvdzM3O2i-S1a7YalQsAQtSoVL4SRvs82-V8Hhj2IxOEvTaI0RziUHs3RshswSkGs4lbbQNcgwl_/pub?gid=2038750668&single=true&output=csv";
            const resp = await fetch(SHEET_CSV);
            const csv = await resp.text();
            const rows = parseCSV(csv).slice(1);
            const today = new Date().toDateString();

            return rows.some(r => {
                const entryUserID = r[2];
                const entryDate = new Date(r[4]).toDateString();
                return entryUserID === userID && entryDate === today;
            });
        } catch(e) {
            return false;
        }
    }

    // -------------------------
    // UI Loader Music Toggle
    // -------------------------
    const target = document.querySelector(".villager-data-info-wide.villager-data-desc.villager-description .profanity-filter");
    if (!target) return;

    const style = document.createElement("style");
    style.textContent = `
    #clawGame {
        position: relative;
        width: 100%;
        max-width: 600px;
        background: linear-gradient(145deg, #f8f9fa, #e9ecef);
        border: 3px solid #d4af37;
        margin: 15px auto;
        font-family: inherit;
        padding-bottom: 15px;
        box-sizing: border-box;
        overflow: hidden;
        min-height: 620px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.8);
    }

    #clawGame #gameCanvas {
        position: relative;
        width: calc(100% - 30px);
        height: 350px;
        background: linear-gradient(180deg, #1a2980 0%, #26d0ce 100%);
        overflow: hidden;
        border: 3px solid #8b4513;
        z-index: 1;
        box-sizing: border-box;
        border-radius: 8px;
        margin: 15px auto;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
    }

    #clawGame #gameCanvas::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(to bottom, #8b4513 0%, #654321 100%);
        border-bottom: 2px solid #d4af37;
        z-index: 2;
        border-radius: 5px 5px 0 0;
    }

    #clawGame #gameCanvas::after {
        content: '';
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%);
        z-index: 2;
    }

    #clawGame .claw {
        position: absolute;
        top: 70px;
        left: 240px;
        width: 50px;
        height: auto;
        transition: left 0.3s ease, top 0.5s ease;
        z-index: 10;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
    }

    #clawGame .plush {
        position: absolute;
        bottom: 30px;
        width: 60px;
        height: auto;
        background: transparent;
        border: none;
        z-index: 5;
        cursor: pointer;
        filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.4));
        transition: transform 0.2s ease;
    }

    #clawGame .plush:hover {
        transform: scale(1.05);
    }

    #clawGame .side-panel {
        position: absolute;
        top: 0;
        width: 50px;
        height: 100%;
        background: linear-gradient(to right, #8b4513 0%, #654321 100%);
        z-index: 0;
        border-right: 2px solid #d4af37;
        box-shadow: 2px 0 5px rgba(0,0,0,0.3);
    }

    #clawGame .side-panel.left {
        left: 0;
        border-radius: 5px 0 0 5px;
    }

    #clawGame .side-panel.right {
        right: 0;
        border-left: 2px solid #d4af37;
        border-radius: 0 5px 5px 0;
        box-shadow: -2px 0 5px rgba(0,0,0,0.3);
    }

    #clawGame #controls {
        text-align: center;
        margin-top: 10px;
        padding: 0 15px;
        box-sizing: border-box;
        background: linear-gradient(to bottom, #f5f5f5, #e8e8e8);
        border: 2px solid #d4af37;
        border-radius: 8px;
        padding: 10px;
        margin: 15px auto;
        width: calc(100% - 30px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    #clawGame button {
        font-size: 14px;
        margin: 5px;
        padding: 10px 20px;
        cursor: pointer;
        border: 2px solid #8b4513;
        border-radius: 6px;
        background: linear-gradient(to bottom, #ffffff, #f0f0f0);
        color: #000 !important;
        box-sizing: border-box;
        font-family: inherit;
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        transition: all 0.2s ease;
    }

    #clawGame button:hover {
        background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
        border-color: #654321;
        color: #000 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    #clawGame button:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }

    #clawGame #timerContainer {
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 30px;
        z-index: 20;
    }

    #clawGame #timerBackground {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 15px;
        border: 2px solid #d4af37;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        overflow: hidden;
    }

    #clawGame #timerBar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        );
        background-size: 200% 100%;
        animation: timerShimmer 2s linear infinite;
        border-radius: 15px;
        transition: clip-path 0.3s ease;
    }

    @keyframes timerShimmer {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
    }

    #clawGame #timerText {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 16px;
        color: #ffd700;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.8), 0 0 3px rgba(0,0,0,0.8);
        z-index: 21;
        font-family: monospace;
        letter-spacing: 1px;
    }

    #clawGame #leaderboard {
        margin: 15px auto 0 auto;
        border: 2px solid #d4af37;
        padding: 12px;
        background: linear-gradient(to bottom, #ffffff, #f8f8f8);
        font-size: 13px;
        max-height: 120px;
        overflow-y: auto;
        width: calc(100% - 30px);
        box-sizing: border-box;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    #clawGame #leaderboardContent div {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        color: #654321;
        text-align: center;
    }

    #clawGame #leaderboardContent div:last-child {
        border-bottom: none;
    }

    #clawGame #prizePanel {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 450px;
        background: linear-gradient(145deg, #ffffff, #f5f5f5);
        color: #333;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        font-size: 14px;
        z-index: 100;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        border: 3px solid #d4af37;
        display: none;
        box-sizing: border-box;
        font-family: inherit;
    }

    #clawGame #prizePanel h3 {
        font-size: 22px;
        margin-bottom: 20px;
        color: #8b4513;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    #clawGame #prizePanel h3.success {
        color: #5cb85c;
    }

    #clawGame #prizePanel h3.miss {
        color: #d9534f;
    }

    #clawGame #prizeImage {
        max-width: 100px;
        border-radius: 8px;
        margin: 20px auto;
        display: block;
        border: 3px solid #d4af37;
        background: #fff;
        padding: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    #clawGame #prizeName {
        font-size: 18px;
        font-weight: bold;
        margin: 15px 0;
        color: #8b4513;
    }

    #clawGame #prizeRarity {
        font-size: 14px;
        color: #777;
        margin-bottom: 20px;
        font-style: italic;
        padding: 5px 10px;
        background: #f8f9fa;
        border-radius: 4px;
        display: inline-block;
    }

    #clawGame #gambitPanel {
        background: linear-gradient(to right, #f8f9fa, #e9ecef);
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
        border-left: 4px solid #d4af37;
        text-align: left;
        border: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    #clawGame #gambitIcon {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-bottom: 8px;
        border: 3px solid #d4af37;
        float: left;
        margin-right: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    #clawGame #gambitText {
        font-style: italic;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
        overflow: hidden;
        padding-top: 5px;
    }

    #clawGame #closePrizeBtn {
        margin-top: 20px;
        background: linear-gradient(to bottom, #5cb85c, #4cae4c);
        color: white !important;
        font-weight: bold;
        padding: 10px 25px;
        font-size: 16px;
        border: 2px solid #4cae4c;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
    }

    #clawGame #closePrizeBtn:hover {
        background: linear-gradient(to bottom, #4cae4c, #449d44);
        border-color: #449d44;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    #clawGame .plush.animate {
        animation: plushBounce 0.8s ease-in-out forwards;
    }

    @keyframes plushBounce {
        0% { transform: scale(1); filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.4)); }
        30% { transform: scale(1.3) translateY(-10px); filter: drop-shadow(0 10px 15px rgba(255,215,0,0.6)); }
        70% { transform: scale(1.2) translateY(0); filter: drop-shadow(0 5px 10px rgba(255,215,0,0.4)); }
        100% { transform: scale(1); filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.4)); }
    }

    #clawGame #loaderOverlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(26, 41, 128, 0.9));
        z-index: 200;
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
        font-family: inherit;
        box-sizing: border-box;
        border-radius: 12px;
    }

    #clawGame #loaderMascot {
        width: 100px;
        animation: float 2s ease-in-out infinite;
        filter: drop-shadow(0 10px 15px rgba(255,215,0,0.5));
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }

    #clawGame .loader-bar-bg {
        width: 70%;
        height: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        margin-top: 20px;
        overflow: hidden;
        border: 2px solid #d4af37;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
    }

    #clawGame .loader-bar-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #1a2980, #26d0ce, #1a2980);
        background-size: 200% 100%;
        animation: shimmer 2s infinite linear;
        transition: width 0.3s ease;
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    #clawGame #loaderText {
        margin-top: 15px;
        font-size: 16px;
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255,215,0,0.5);
        font-weight: bold;
    }

    #clawGame #musicToggleBtn {
        position: absolute;
        top: 15px;
        left: 15px;
        width: 35px;
        height: 35px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><path fill="%23d4af37" d="M12 3v18c-5-0.5-9-4.9-9-10s4-9.5 9-10zm9.5 7c0 .9-.4 1.7-1 2.3l-1.4-1.4c.3-.4.5-.9.5-1.4s-.2-1-.5-1.4l1.4-1.4c.6.6 1 1.4 1 2.3zm-3 6.4l-1.5-1.5c.1-.3.2-.7.2-1 0-.3-.1-.7-.2-1l1.5-1.5c.7.7 1.1 1.6 1.1 2.6s-.4 1.9-1.1 2.6z"/></svg>') no-repeat center center;
        cursor: pointer;
        opacity: 0.9;
        z-index: 50;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        border: 2px solid #d4af37;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }

    #clawGame #musicToggleBtn:hover {
        transform: scale(1.1);
        background-color: rgba(0, 0, 0, 0.9);
    }

    #clawGame #musicToggleBtn.muted {
        opacity: 0.5;
        filter: grayscale(100%);
    }

    #clawGame #startScreen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(26, 41, 128, 0.95), rgba(38, 208, 206, 0.95));
        z-index: 150;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
        padding: 20px;
        text-align: center;
        box-sizing: border-box;
        overflow-y: auto;
        border-radius: 12px;
    }

    #clawGame #startScreen h2 {
        color: #ffd700;
        font-size: 28px;
        margin-bottom: 20px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    #clawGame #startScreenContent {
        max-width: 500px;
        background: rgba(0, 0, 0, 0.7);
        padding: 30px;
        border-radius: 12px;
        border: 3px solid #d4af37;
        box-sizing: border-box;
        margin: 20px;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    #clawGame #gambitIntroImg {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto 20px;
        display: block;
        border: 3px solid #d4af37;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }

    #clawGame #gambitIntroText {
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 25px;
        color: #f0f0f0;
        flex-grow: 1;
    }

    #clawGame #gambitIntroText strong {
        color: #ffd700;
    }

    #clawGame #gambitIntroText ul {
        text-align: left;
        margin: 15px 0;
        padding-left: 25px;
        font-size: 14px;
    }

    #clawGame #gambitIntroText li {
        margin-bottom: 8px;
        color: #ddd;
    }

    #clawGame #startGameBtn {
        background: linear-gradient(to bottom, #ffd700, #ffa500);
        color: #8b4513 !important;
        font-size: 18px;
        padding: 15px 40px;
        font-weight: bold;
        border-radius: 8px;
        border: 3px solid #ffa500;
        cursor: pointer;
        margin-top: 20px;
        min-height: 50px;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.5);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }

    #clawGame #startGameBtn:hover {
        background: linear-gradient(to bottom, #ffa500, #ff8c00);
        border-color: #ff8c00;
        color: #8b4513 !important;
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }

    #clawGame #startGameBtn:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    #clawGame .bonus-item {
        background: linear-gradient(to bottom, #fff8e1, #ffecb3);
        border: 3px dashed #ffd54f;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        box-sizing: border-box;
        color: #8b4513;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    #clawGame .bonus-item strong {
        color: #ff9800;
        font-size: 16px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    #clawGame .bonus-item img {
        width: 50px;
        margin: 10px;
        border-radius: 6px;
        border: 2px solid #ffd54f;
        padding: 5px;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    #clawGame .widget-header {
        background: linear-gradient(to bottom, #8b4513, #654321);
        padding: 12px 15px;
        border-bottom: 3px solid #d4af37;
        border-radius: 8px 8px 0 0;
        margin: 15px auto 0 auto;
        width: calc(100% - 30px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    #clawGame .widget-header h3 {
        margin: 0;
        font-size: 18px;
        color: #ffd700;
        font-weight: bold;
        text-align: center;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    }

    #clawGame .machine-border {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 4px solid #8b4513;
        border-radius: 8px;
        pointer-events: none;
        z-index: 3;
    }

    #clawGame .machine-lights {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 40px;
        background: linear-gradient(90deg,
            #ff0000 0%,
            #ff9900 20%,
            #ffff00 40%,
            #00ff00 60%,
            #00ffff 80%,
            #ff00ff 100%
        );
        background-size: 200% 100%;
        animation: lightMove 3s linear infinite;
        border-radius: 20px;
        opacity: 0.7;
        filter: blur(2px);
        z-index: 3;
    }

    @keyframes lightMove {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
    }

    #clawGame .drop-slot {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 20px;
        background: linear-gradient(to bottom, #8b4513, #654321);
        border: 2px solid #d4af37;
        border-radius: 10px 10px 0 0;
        z-index: 4;
    }
    `;

    document.head.appendChild(style);

    const gameContainer = document.createElement("div");
    gameContainer.id = "clawGame";
    gameContainer.innerHTML = `
        <div id="startScreen">
            <div id="startScreenContent">
                <img src="${GAMBIT_IMG}" id="gambitIntroImg" alt="Gambit">
                <h2>Welcome to the Claw Machine!</h2>
                <div id="gambitIntroText">
                    <p><strong>Hey there, Traveler!</strong></p>
                    <p>I built this claw machine completely from scratch, and I'm thrilled to finally show it off! Here's how it works:</p>
                    <ul>
                        <li>Use the LEFT and RIGHT buttons to move the claw.</li>
                        <li>Click GRAB to try and catch a plush.</li>
                        <li>You have <strong>20 seconds</strong> to make your move.</li>
                        <li>You can win <strong>ONE plush per day.</strong> The 24 hour timer begins the moment you receive your prize.</li>
                        <li>If you miss, you can try again immediately.</li>
                        <li>There's a small chance to get a bonus prize!</li>
                    </ul>
                    <p>Good luck, and have fun! Remember, only your first successful grab today will be recorded.</p>
                </div>
                <button id="startGameBtn">Start Playing!</button>
            </div>
        </div>

        <div id="gameCanvas" style="display: none;">
            <div class="machine-lights"></div>
            <div class="side-panel left"></div>
            <div class="side-panel right"></div>
            <div class="drop-slot"></div>
            <div class="machine-border"></div>
            <img src="${CLAW_IMG}" class="claw" id="claw">
            <div id="timerContainer">
                <div id="timerBackground"></div>
                <div id="timerBar"></div>
                <div id="timerText">20</div>
            </div>
        </div>

        <div id="controls" style="display: none;">
            <button id="leftBtn">◀ Left</button>
            <button id="rightBtn">Right ▶</button>
            <button id="downBtn">▼ Grab!</button>
        </div>

        <div class="widget-header">
            <h3>Recent Claw Pulls</h3>
        </div>
        <div id="leaderboard">
            <div id="leaderboardContent"></div>
        </div>

        <div id="prizePanel" style="display:none;">
            <h3 id="prizeTitle">You won:</h3>
            <img id="prizeImage" src="" alt="Prize">
            <p id="prizeName"></p>
            <p id="prizeRarity"></p>
            <div id="bonusContainer"></div>
            <div id="gambitPanel">
                <img src="${GAMBIT_IMG}" id="gambitIcon" alt="Gambit">
                <p id="gambitText"></p>
            </div>
            <button id="closePrizeBtn">Continue</button>
        </div>

        <div id="loaderOverlay">
            <img src="${MASCOT_IMG}" id="loaderMascot">
            <div class="loader-bar-bg">
                <div class="loader-bar-fill" id="loaderBarFill"></div>
            </div>
            <div id="loaderText">Loading…</div>
        </div>

        <div id="musicToggleBtn" title="Toggle Music"></div>
    `;
    target.innerHTML = "";
    target.appendChild(gameContainer);

    // -------------------------
    // DOM
    // -------------------------
    const claw = document.getElementById("claw");
    const gameCanvasElem = document.getElementById("gameCanvas");
    const timerBar = document.getElementById("timerBar");
    const timerText = document.getElementById("timerText");
    const loaderOverlay = document.getElementById("loaderOverlay");
    const loaderBarFill = document.getElementById("loaderBarFill");
    const loaderText = document.getElementById("loaderText");
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const leaderboardContent = document.getElementById("leaderboardContent");
    const startScreen = document.getElementById("startScreen");
    const startGameBtn = document.getElementById("startGameBtn");
    const controls = document.getElementById("controls");
    const prizePanel = document.getElementById("prizePanel");
    const prizeTitle = document.getElementById("prizeTitle");
    const prizeImage = document.getElementById("prizeImage");
    const prizeName = document.getElementById("prizeName");
    const prizeRarity = document.getElementById("prizeRarity");
    const gambitText = document.getElementById("gambitText");
    const bonusContainer = document.getElementById("bonusContainer");
    const closePrizeBtn = document.getElementById("closePrizeBtn");

    let timer = null, timeLeft = 20, grabbed = false, gameActive = false;
    let clawPosition = 240;

    // -------------------------
    // Audio
    // -------------------------
    const bgMusic = new Audio();
    bgMusic.src = "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/PAOKAI2.mp3";
    bgMusic.preload = "auto";
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    let audioEnabled = false;
    const soundEffects = {
        grab: "https://freesound.org/data/previews/141/141995_2437353-lq.mp3",
        slip: "https://freesound.org/data/previews/198/198841_2859976-lq.mp3",
        bonus: "https://freesound.org/data/previews/331/331912_3248244-lq.mp3"
    };

    function playSoundEffect(type) {
        if (!audioEnabled || !soundEffects[type]) return;
        try {
            const audio = new Audio(soundEffects[type]);
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch(e) {}
    }

    function toggleMusic() {
        if (!audioEnabled) {
            audioEnabled = true;
            musicToggleBtn.classList.remove("muted");
            try {
                bgMusic.play();
            } catch(e) {}
            return;
        }

        if (bgMusic.paused) {
            bgMusic.play();
            musicToggleBtn.classList.remove("muted");
        } else {
            bgMusic.pause();
            musicToggleBtn.classList.add("muted");
        }
    }

    // -------------------------
    // Helper
    // -------------------------
    function showLoader(){
        loaderOverlay.style.display = "flex";
    }

    function hideLoader(){
        loaderOverlay.style.display = "none";
    }

    function updateLoader(progress, text){
        loaderBarFill.style.width = progress + "%";
        if(text) loaderText.textContent = text;
    }

    function updateTimerBar() {
        const percentage = (timeLeft / 20) * 100;
        timerBar.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        timerText.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerText.style.color = "#ff0000";
        } else if (timeLeft <= 10) {
            timerText.style.color = "#ff9900";
        } else {
            timerText.style.color = "#ffd700";
        }
    }

    function resetClawPosition() {
        clawPosition = 240;
        claw.style.left = "240px";
        claw.style.top = "70px";
        claw.style.transition = "none";

        void claw.offsetWidth;
        claw.style.transition = "left 0.3s ease, top 0.5s ease";
    }

    function showPrizePanel(title, plushData = null, bonusWon = false, alreadyPlayed = false) {
        prizePanel.style.display = "block";
        prizeTitle.textContent = title;
        prizeTitle.className = title === "Success!" ? "success" : "miss";
        bonusContainer.innerHTML = "";

        if (plushData) {
            prizeImage.src = plushData.url;
            prizeImage.style.display = "block";
            prizeName.textContent = plushData.name;
            prizeRarity.textContent = `Rarity: ${plushData.rarity}`;

            gambitText.textContent = alreadyPlayed
                ? "You've already grabbed a plush today! Come back tomorrow for another chance to win. Waiting on your plush? It's on the way!"
                : "Wow, you did it! I knew you had the skills! That's an awesome catch! Your plush will be on its way soon!";

            if (bonusWon) {
                const bonusDiv = document.createElement("div");
                bonusDiv.className = "bonus-item";
                bonusDiv.innerHTML = `
                    <strong>BONUS PRIZE!</strong><br>
                    <img src="${COMMON_CRATE.url}" alt="${COMMON_CRATE.name}"><br>
                    ${COMMON_CRATE.name}
                `;
                bonusContainer.appendChild(bonusDiv);
                playSoundEffect("bonus");
            }
        } else {
            prizeImage.style.display = "none";
            prizeName.textContent = "";
            prizeRarity.textContent = "";
            gambitText.textContent = "Oh no! The claw slipped! Don't worry, you can try again right away!";
        }
    }

    function spawnPlushies() {
        gameCanvasElem.querySelectorAll(".plush").forEach(p => p.remove());
        const amount = Math.min(5, PLUSHIES.length);
        const usedUrls = new Set();
        const chosen = [];

        let hasLimitedOrSuperRare = false;

        const limitedPlushes = PLUSHIES.filter(p => p.rarity === "limited");
        const superRarePlushes = PLUSHIES.filter(p => p.rarity === "super rare");
        const otherPlushes = PLUSHIES.filter(p => p.rarity !== "limited" && p.rarity !== "super rare");

        // Shuffle array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        shuffleArray(limitedPlushes);
        shuffleArray(superRarePlushes);
        shuffleArray(otherPlushes);

        const includeSpecial = Math.random() < 0.2;

        if (includeSpecial && (limitedPlushes.length > 0 || superRarePlushes.length > 0)) {
            if (limitedPlushes.length > 0 && Math.random() < 0.3) {
                const limited = limitedPlushes[0];
                chosen.push(limited);
                usedUrls.add(limited.url);
                hasLimitedOrSuperRare = true;
            } else if (superRarePlushes.length > 0) {
                const superRare = superRarePlushes[0];
                chosen.push(superRare);
                usedUrls.add(superRare.url);
                hasLimitedOrSuperRare = true;
            }
        }

        const remainingSlots = amount - chosen.length;
        for (let i = 0; i < remainingSlots; i++) {
            let tries = 0;
            let pick = null;

            while (tries < 50) {
                const randomIndex = Math.floor(Math.random() * otherPlushes.length);
                pick = otherPlushes[randomIndex];

                if (pick && !usedUrls.has(pick.url)) {
                    if (pick.rarity !== "limited" && pick.rarity !== "super rare") {
                        break;
                    }
                }
                tries++;
                pick = null;
            }

            if (pick && !usedUrls.has(pick.url)) {
                chosen.push(pick);
                usedUrls.add(pick.url);
            } else if (otherPlushes.length > 0) {
                const fallback = otherPlushes.find(p =>
                    p.rarity !== "limited" &&
                    p.rarity !== "super rare" &&
                    !usedUrls.has(p.url)
                );
                if (fallback) {
                    chosen.push(fallback);
                    usedUrls.add(fallback.url);
                }
            }

            if (chosen.length >= amount) break;
        }

        chosen.forEach((item, i) => {
            const img = document.createElement("img");
            img.src = item.url;
            img.dataset.name = item.name;
            img.dataset.rarity = item.rarity;
            img.className = "plush";
            img.style.left = (60 + i * 100) + "px";
            img.title = `${item.name} (${item.rarity})`;
            gameCanvasElem.appendChild(img);
        });

        gameActive = true;
    }

    function grab() {
        if (!gameActive || grabbed) return;

        const clawEl = claw;
        const clawRect = clawEl.getBoundingClientRect();
        const canvasRect = gameCanvasElem.getBoundingClientRect();

        const clawCenter = clawRect.left - canvasRect.left + (clawRect.width / 2);
        const originalTop = clawEl.style.top || "70px";

        clawEl.style.transition = "top 0.5s ease";
        clawEl.style.top = "250px";

        setTimeout(() => {
            const plushes = [...document.querySelectorAll(".plush")];
            let targetPlush = null;
            let targetPlushData = null;

            plushes.forEach(plush => {
                const plushRect = plush.getBoundingClientRect();
                const plushLeft = plushRect.left - canvasRect.left;
                const plushRight = plushLeft + plushRect.width;

                if (clawCenter >= plushLeft && clawCenter <= plushRight) {
                    targetPlush = plush;
                    targetPlushData = {
                        name: plush.dataset.name,
                        rarity: plush.dataset.rarity,
                        url: plush.src
                    };
                }
            });

            clawEl.style.top = originalTop;
            clearInterval(timer);
            grabbed = true;

            if (!targetPlush) {
                playSoundEffect("slip");
                showPrizePanel("Miss!");
                return;
            }

            targetPlush.classList.add("animate");
            const bonusWon = Math.random() < CRATE_CHANCE;

            playSoundEffect("grab");
            showPrizePanel("Success!", targetPlushData, bonusWon, userHasPlayedToday);

            if (!userHasPlayedToday) {
                submitWinToForm(currentUserID, currentUsername, targetPlushData.name, bonusWon);
            }
        }, 600);
    }

    function getUsername() {
        const h4 = document.querySelector(".widget .user-info h4 a");
        if (h4) {
            let username = h4.textContent.trim();
            username = username.replace(/\s+<i.*/, '');
            return username;
        }
        return "Unknown";
    }

    function getUserID() {
        const profileLink = document.querySelector('.widget .user-info h4 a[href*="profile"]');
        if (profileLink) {
            const href = profileLink.getAttribute('href');
            const match = href.match(/profile\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }

        const otherProfileLink = document.querySelector('.widget-content .text-center a[href*="profile"]');
        if (otherProfileLink) {
            const href = otherProfileLink.getAttribute('href');
            const match = href.match(/profile\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }

        return "Unknown";
    }

    function submitWinToForm(userID, username, plushName, bonus) {
        const plushNameToSubmit = bonus ? `${plushName}*` : plushName;

        const formData = new FormData();
        formData.append("entry.1820079592", username);
        formData.append("entry.1423943877", userID);
        formData.append("entry.486195404", plushNameToSubmit);
        formData.append("entry.1183255409", new Date().toLocaleString());

        fetch("https://docs.google.com/forms/d/e/1FAIpQLSeBksG1fotDo4ZufbRMoH03tUxov3tOzHNq6aUiwbvnbj6PzA/formResponse", {
            method: "POST",
            body: formData,
            mode: 'no-cors'
        }).then(() => loadLeaderboard());
    }

    async function loadLeaderboard() {
        try {
            const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZvdzM3O2i-S1a7YalQsAQtSoVL4SRvs82-V8Hhj2IxOEvTaI0RziUHs3RshswSkGs4lbbQNcgwl_/pub?gid=2038750668&single=true&output=csv";
            const resp = await fetch(SHEET_CSV);
            const csv = await resp.text();
            const rows = parseCSV(csv).slice(1);
            const now = new Date();

            const recent24h = rows.filter(r => {
                const d = new Date(r[4]);
                return (now - d) < 24 * 60 * 60 * 1000;
            });

            const firstPerUser = {};
            const filtered = recent24h.filter(r => {
                const uname = r[1];
                const dateStr = new Date(r[4]).toDateString();
                if (!firstPerUser[uname + dateStr]) {
                    firstPerUser[uname + dateStr] = true;
                    return true;
                }
                return false;
            });

            const recent = filtered.slice(-10);
            leaderboardContent.innerHTML = "";

            if (recent.length === 0) {
                leaderboardContent.innerHTML = "<div>No recent pulls yet. Be the first!</div>";
            } else {
                recent.forEach(r => {
                    const uname = r[1], plush = r[3];
                    const li = document.createElement("div");
                    li.textContent = `@${uname} won ${plush}`;
                    leaderboardContent.appendChild(li);
                });
            }
        } catch (e) {
            leaderboardContent.innerHTML = "<div>Unable to load leaderboard</div>";
        }
    }

    async function startGame() {
        currentUserID = getUserID();
        currentUsername = getUsername();

        startScreen.style.display = "none";
        showLoader();
        updateLoader(0, "Loading configuration...");

        await Promise.all([
            loadConfig(),
            loadPlushList()
        ]);

        updateLoader(50, "Checking game status...");
        userHasPlayedToday = await checkIfUserHasPlayedToday(currentUserID);

        updateLoader(75, "Loading leaderboard...");
        await loadLeaderboard();

        updateLoader(100, "Ready to play!");

        setTimeout(() => {
            hideLoader();
            gameCanvasElem.style.display = "block";
            controls.style.display = "block";
            resetClawPosition();
            spawnPlushies();
            startTimer();
        }, 300);
    }

    function resetGame() {
        grabbed = false;
        gameActive = false;
        timerBar.style.clipPath = "inset(0 0% 0 0)";
        timerText.textContent = "20";
        timerText.style.color = "#ffd700";

        resetClawPosition();
        gameCanvasElem.querySelectorAll(".plush").forEach(p => p.remove());
        gameCanvasElem.style.display = "none";
        controls.style.display = "none";
        startScreen.style.display = "flex";
    }

    function startTimer() {
        timeLeft = 20;
        updateTimerBar();
        timer = setInterval(() => {
            timeLeft--;
            updateTimerBar();
            if(timeLeft <= 0) {
                clearInterval(timer);
                timerText.textContent = "0";
                timerBar.style.clipPath = "inset(0 100% 0 0)";
                grabbed = true;
                setTimeout(() => {
                    showPrizePanel("Time's Up!", null, false, false);
                }, 500);
            }
        }, 1000);
    }

    musicToggleBtn.addEventListener("click", toggleMusic);
    startGameBtn.addEventListener("click", startGame);

    document.getElementById("leftBtn").addEventListener("click", () => {
        if (gameActive && !grabbed) {
            clawPosition = Math.max(0, clawPosition - 50);
            claw.style.left = clawPosition + "px";
        }
    });

    document.getElementById("rightBtn").addEventListener("click", () => {
        if (gameActive && !grabbed) {
            clawPosition = Math.min(540, clawPosition + 50);
            claw.style.left = clawPosition + "px";
        }
    });

    document.getElementById("downBtn").addEventListener("click", grab);
    closePrizeBtn.addEventListener("click", () => {
        prizePanel.style.display = "none";
        if (grabbed) resetGame();
    });

    // load
    loadLeaderboard();
    setInterval(loadLeaderboard, 30000);

})();