// ==UserScript==
// @name         Recipe 🌿 
// @namespace    anon
// @version      4.4
// @description  Cycles through recipes with Turkish & English support and human-like delays. Now with specific recipe skipping.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Recipes/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Recipe/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559545/Recipe%20%F0%9F%8C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/559545/Recipe%20%F0%9F%8C%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ⏱ Settings
    const LOOP_DELAY = 930000; // 15.5 minutes
    const MAX_LOGS = 3;

    // 🚶 Human-like pauses
    const MIN_ACTION_DELAY = 300;
    const MAX_ACTION_DELAY = 300;

    // ⭐ Skip List (Turkish Names)
    const SKIPPED_RECIPES = [
        "Amnezi Büyüsü",
        "Aubergine",
        "Binbaşı Tom",
        "Buçukluğun Yaprağı",
        "Çifte Gökkuşağı",
        "Mor Şirin",
        "Mutluluk Büyüsü",
        "Popogeddon",
        "Smelly Cat",
        "Yıldızlararası"
    ];

    const CURRENT_URL = window.location.href;

    // Detect the "Main Recipe List" URL dynamically
    function getDynamicBaseUrl() {
        if (CURRENT_URL.includes("/Character/Recipes/")) {
            return CURRENT_URL;
        } else {
            const backLink = document.querySelector('a[href*="/Character/Recipes/"]');
            return backLink ? backLink.href : null;
        }
    }

    const RECIPE_LIST_URL = getDynamicBaseUrl();

    const STATUS_COLORS = {
        active: "#2f7a2d",
        wait: "#3e7b4e",
        done: "#007700",
        error: "#993333",
    };

    let logData = JSON.parse(localStorage.getItem("recipe-logData") || "[]");
    let countdownTimer = null;

    const getRandomDelay = () => Math.floor(Math.random() * (MAX_ACTION_DELAY - MIN_ACTION_DELAY + 1) + MIN_ACTION_DELAY);

    // === Navigation Helpers ===
    function goToList() {
        if (RECIPE_LIST_URL) window.location.href = RECIPE_LIST_URL;
        else saveLogEntry("❌ URL Error");
    }

    // ✅ Compact vibrant status box
    const css = `
        @keyframes pulse { 0%, 100% { opacity: 0.95; } 50% { opacity: 1; } }
        #autorecipe-status {
            position: fixed; top: 60px; right: 10px; padding: 10px 12px;
            background: linear-gradient(145deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724; font-size: 11px; border-radius: 16px;
            border: 2px solid #28a745; z-index: 9999; width: 250px;
            animation: pulse 3s infinite; box-sizing: border-box;
        }
        .log-entry { margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.8); border-radius: 8px; }
        #autorecipe-reset-btn { width: 100%; margin-top: 8px; padding: 5px; background: #28a745; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 10px; }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    function saveLogEntry(text) {
        const entry = { text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
        logData.push(entry);
        if (logData.length > MAX_LOGS) logData = logData.slice(-MAX_LOGS);
        localStorage.setItem("recipe-logData", JSON.stringify(logData));
        updateStatusBox();
    }

    function updateStatusBox(status = null, color = "#2f7a2d", countdown = null) {
        let box = document.getElementById("autorecipe-status") || document.createElement("div");
        if (!box.id) { box.id = "autorecipe-status"; document.body.appendChild(box); }

        const history = logData.map(e => `<div class="log-entry">🌿 ${e.text}<br><small style="opacity:0.6">${e.time}</small></div>`).join("");
        box.innerHTML = `
            <div style="text-align:center;font-weight:bold;margin-bottom:5px;">🍀 AutoRecipe</div>
            ${status ? `<div style="text-align:center;color:${color}"><b>${status}</b></div>` : ""}
            ${history}
            ${countdown ? `<div style="text-align:center;margin-top:5px;">Next in: ${countdown}</div>` : ""}
            <button id="autorecipe-reset-btn">🔄 RESET</button>
        `;
        document.getElementById("autorecipe-reset-btn").onclick = () => {
            localStorage.removeItem("recipe-usedThisCycle");
            localStorage.removeItem("recipe-nextRunAt");
            location.reload();
        };
    }

    function startCountdown(ms, callback) {
        const target = Date.now() + ms;
        localStorage.setItem("recipe-nextRunAt", target);
        const tick = () => {
            const rem = Math.max(0, Math.floor((target - Date.now()) / 1000));
            updateStatusBox("Sleeping", STATUS_COLORS.wait, `${Math.floor(rem/60)}m ${rem%60}s`);
            if (rem <= 0) { localStorage.removeItem("recipe-nextRunAt"); callback(); }
            else setTimeout(tick, 1000);
        };
        tick();
    }

    const savedTarget = localStorage.getItem("recipe-nextRunAt");
    if (savedTarget && (parseInt(savedTarget) - Date.now() > 0)) {
        startCountdown(parseInt(savedTarget) - Date.now(), goToList);
        return;
    }

    function handleRecipePage() {
        const wait = getRandomDelay();
        updateStatusBox("Checking...", STATUS_COLORS.active, `${wait/1000}s`);

        setTimeout(() => {
            const useBtn = document.querySelector("input[id*='btnUseRecipe']");
            const pageText = document.body.innerText;
            const recipeId = CURRENT_URL.match(/Recipe\/(\d+)/)?.[1];

            // Keywords for English and Turkish
            const isReady = pageText.includes("everything needed") ||
                            pageText.includes("Tarifi denemeden önce");

            if (sessionStorage.getItem("recipe-justUsed") === recipeId) {
                sessionStorage.removeItem("recipe-justUsed");
                let used = JSON.parse(localStorage.getItem("recipe-usedThisCycle") || "[]");
                if (recipeId && !used.includes(recipeId)) {
                    used.push(recipeId);
                    localStorage.setItem("recipe-usedThisCycle", JSON.stringify(used));
                }
                saveLogEntry("✅ Success.");
                setTimeout(goToList, getRandomDelay());
                return;
            }

            if (useBtn && isReady) {
                saveLogEntry("✅ Using...");
                sessionStorage.setItem("recipe-justUsed", recipeId);
                useBtn.click();
            } else {
                saveLogEntry("❌ Missing items. Skipping.");
                let used = JSON.parse(localStorage.getItem("recipe-usedThisCycle") || "[]");
                if (recipeId && !used.includes(recipeId)) {
                    used.push(recipeId);
                    localStorage.setItem("recipe-usedThisCycle", JSON.stringify(used));
                }
                setTimeout(goToList, getRandomDelay());
            }
        }, wait);
    }

    function handleRecipeListPage() {
        const links = [...document.querySelectorAll("#tblrecipes tbody a[href*='/Recipe/']")];
        if (!links.length) {
            saveLogEntry("❌ No recipes.");
            startCountdown(LOOP_DELAY, () => location.reload());
            return;
        }

        let used = JSON.parse(localStorage.getItem("recipe-usedThisCycle") || "[]");

        // 🛡️ Logic to filter out skipped recipes before finding the next one
        let next = links.find(l => {
            const id = l.href.match(/Recipe\/(\d+)/)?.[1];
            const name = l.textContent.trim();

            // If it's already used, skip
            if (used.includes(id)) return false;

            // If it's in the skip list, add to used and skip
            if (SKIPPED_RECIPES.includes(name)) {
                used.push(id);
                localStorage.setItem("recipe-usedThisCycle", JSON.stringify(used));
                saveLogEntry(`⏩ Skipped: ${name}`);
                return false;
            }

            return true;
        });

        if (!next) {
            saveLogEntry("🔄 Cycle finished.");
            localStorage.removeItem("recipe-usedThisCycle");
            startCountdown(LOOP_DELAY, goToList);
            return;
        }

        const wait = getRandomDelay();
        updateStatusBox(`Next: ${next.textContent.trim()}`, STATUS_COLORS.active, `${wait/1000}s`);
        setTimeout(() => { window.location.href = next.href; }, wait);
    }

    if (CURRENT_URL.includes("/Character/Recipe/")) handleRecipePage();
    else if (CURRENT_URL.includes("/Character/Recipes/")) handleRecipeListPage();

    updateStatusBox();
})();