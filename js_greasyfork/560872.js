// ==UserScript==
// @name         Recipe 🌿 (VIP Standard)
// @namespace    anon
// @version      5.0
// @description  Cycles through recipes with Turkish & English support, VIP/Standard toggle, and human-like delays.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Recipes/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Recipe/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560872/Recipe%20%F0%9F%8C%BF%20%28VIP%20Standard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560872/Recipe%20%F0%9F%8C%BF%20%28VIP%20Standard%29.meta.js
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
        "Amnesia Daze",
        "Aubergine",
        "Binbaşı Tom",
        "Major Tom",
        "Buçukluğun Yaprağı",
        "Halfling's Leaf",
        "Çifte Gökkuşağı",
        "Double Rainbow",
        "Mor Şirin",
        "Purple Smurf",
        "Mutluluk Büyüsü",
        "Happy Daze",
        "Popogeddon",
        "Smelly Cat",
        "Yıldızlararası",
        "Interstellar"
    ];

    const CURRENT_URL = window.location.href;

    // VIP Mode Toggle (stored in localStorage)
    let vipMode = localStorage.getItem("recipe-vipMode") === "true";

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
        vip: "#8a2be2" // Purple for VIP mode
    };

    let logData = JSON.parse(localStorage.getItem("recipe-logData") || "[]");
    let countdownTimer = null;

    const getRandomDelay = () => Math.floor(Math.random() * (MAX_ACTION_DELAY - MIN_ACTION_DELAY + 1) + MIN_ACTION_DELAY);

    // === Navigation Helpers ===
    function goToList() {
        if (RECIPE_LIST_URL) window.location.href = RECIPE_LIST_URL;
        else saveLogEntry("❌ URL Error");
    }

    // ✅ Compact vibrant status box with VIP toggle
const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

    @keyframes pulse {
        0%, 100% { opacity: 0.95; }
        50% { opacity: 1; }
    }
    @keyframes vipPulse {
        0%, 100% { box-shadow: 0 0 6px rgba(246, 211, 101, 0.2); }
        50% { box-shadow: 0 0 10px rgba(246, 211, 101, 0.3); }
    }

    #autorecipe-status {
        position: fixed;
        top: 60px;
        right: 10px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%); /* 🌿 pastel green */
        color: #155724;
        font-size: 11px;
        border-radius: 20px;
        border: 2px solid #28a745;
        z-index: 9999;
        width: 230px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        animation: pulse 3s infinite;
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    #autorecipe-status.vip-mode {
        background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%); /* 🌿 same as Standard */
        border-color: #f6d365; /* 💛 yellowish border */
        animation: vipPulse 4s infinite; /* subtle glow */
        transition: all 0.3s ease;
    }

    .log-entry {
        margin-bottom: 6px;
        padding: 6px;
        background: rgba(255,255,255,0.9);
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 500;
        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        transition: all 0.3s ease;
    }

    .vip-badge {
        display: inline-block;
        background: #f6d365; /* 💛 yellow badge */
        color: #333;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        margin-left: 5px;
        vertical-align: middle;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        transition: all 0.3s ease;
    }

    .sleeping-status {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #28a745; /* 🌿 green for sleeping */
        margin-bottom: 8px;
        padding: 4px 0;
        font-family: 'Inter', sans-serif;
    }

    .control-btn {
        width: 48%;
        margin-top: 8px;
        padding: 7px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 11px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    #vip-toggle-btn {
        background: ${vipMode ? '#f6d365' : '#a8e6cf'}; /* 💛 yellow for VIP, 🌿 mint green for Standard */
        color: #333;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    #vip-toggle-btn:hover {
        filter: brightness(1.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    #reset-btn {
        background: #28a745;
        color: #fff;
        margin-left: 4%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    #reset-btn:hover {
        filter: brightness(1.05);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .btn-container {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
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

function toggleVipMode() {
    const wasVip = vipMode;
    vipMode = !vipMode;
    localStorage.setItem("recipe-vipMode", vipMode.toString());

    // If we're on the recipe list page
    if (CURRENT_URL.includes("/Character/Recipes/")) {
        const vipCheckbox = document.getElementById("ctl00_cphLeftColumn_ctl00_chkAvailableOnly");
        const okButton = document.getElementById("ctl00_cphLeftColumn_ctl00_btnChoseCategory");

        if (vipCheckbox && okButton) {
            // VIP -> Standard: uncheck the VIP checkbox
            if (wasVip && !vipMode && vipCheckbox.checked) {
                saveLogEntry("💚 Switching to Standard mode...");
                vipCheckbox.click(); // Uncheck it
                setTimeout(() => {
                    okButton.click(); // Apply the change
                    saveLogEntry("✅ Standard mode applied");
                }, getRandomDelay());
            }
            // Standard -> VIP: check the VIP checkbox
            else if (!wasVip && vipMode && !vipCheckbox.checked) {
                saveLogEntry("💜 Switching to VIP mode...");
                vipCheckbox.click(); // Check it
                setTimeout(() => {
                    okButton.click(); // Apply the change
                    saveLogEntry("✅ VIP mode applied");
                }, getRandomDelay());
            }
        } else {
            // If controls aren't available, just update the status
            saveLogEntry(vipMode ? "💜 VIP Mode ON" : "💚 Standard Mode ON");
        }
    } else {
        // If not on recipe list page, just update status
        saveLogEntry(vipMode ? "💜 VIP Mode ON" : "💚 Standard Mode ON");
    }

    updateStatusBox();
}

    function updateStatusBox(status = null, color = "#2f7a2d", countdown = null) {
        let box = document.getElementById("autorecipe-status") || document.createElement("div");
        if (!box.id) {
            box.id = "autorecipe-status";
            document.body.appendChild(box);
        }

        // Add/remove VIP class
        if (vipMode) {
            box.classList.add("vip-mode");
        } else {
            box.classList.remove("vip-mode");
        }

        const modeBadge = vipMode ? '<span class="vip-badge">VIP</span>' : '';
        const history = logData.map(e => `<div class="log-entry">🌿 ${e.text}<br><small style="opacity:0.6">${e.time}</small></div>`).join("");
        box.innerHTML = `
            <div style="text-align:center;font-weight:bold;margin-bottom:5px;">🍀 AutoRecipe ${modeBadge}</div>
            ${status ? `<div class="sleeping-status">${status}</div>` : ""}
            ${history}
            ${countdown ? `<div style="text-align:center;margin-top:5px;">Next in: ${countdown}</div>` : ""}
            <div class="btn-container">
                <button id="vip-toggle-btn" class="control-btn">${vipMode ? '💜 VIP ON' : '💚 STANDARD'}</button>
                <button id="reset-btn" class="control-btn">🔄 RESET</button>
            </div>
        `;

        document.getElementById("vip-toggle-btn").onclick = toggleVipMode;
        document.getElementById("reset-btn").onclick = () => {
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
            updateStatusBox("🌿", vipMode ? STATUS_COLORS.vip : STATUS_COLORS.wait, `${Math.floor(rem/60)}m ${rem%60}s`);
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

    // VIP-specific functions
    function applyVipFilter() {
        const categorySelect = document.getElementById("ctl00_cphLeftColumn_ctl00_ddlCategory");
        const vipCheckbox = document.getElementById("ctl00_cphLeftColumn_ctl00_chkAvailableOnly");
        const okButton = document.getElementById("ctl00_cphLeftColumn_ctl00_btnChoseCategory");

        if (!categorySelect || !vipCheckbox || !okButton) {
            saveLogEntry("⚠️ VIP filter not available");
            return;
        }

        saveLogEntry("💜 Applying VIP filter...");

        // Check the VIP checkbox
        if (!vipCheckbox.checked) {
            vipCheckbox.click();
        }

        // Click OK button
        setTimeout(() => {
            okButton.click();
            saveLogEntry("✅ VIP filter applied");
        }, getRandomDelay());
    }

    function handleRecipePage() {
        const wait = getRandomDelay();
        updateStatusBox("Checking...", vipMode ? STATUS_COLORS.vip : STATUS_COLORS.active, `${wait/1000}s`);

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
                saveLogEntry(vipMode ? "💜 Using (VIP)..." : "✅ Using...");
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
        // Apply VIP filter if VIP mode is enabled and we have the VIP controls
        if (vipMode) {
            const vipCheckbox = document.getElementById("ctl00_cphLeftColumn_ctl00_chkAvailableOnly");
            if (vipCheckbox && !vipCheckbox.checked) {
                saveLogEntry("💜 Setting up VIP mode...");
                applyVipFilter();
                return; // Let the page reload with filter applied
            }
        }

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
            saveLogEntry(vipMode ? "💜 VIP cycle finished" : "🔄 Cycle finished.");
            localStorage.removeItem("recipe-usedThisCycle");
            startCountdown(LOOP_DELAY, goToList);
            return;
        }

        const wait = getRandomDelay();
        updateStatusBox(
            `${vipMode ? '💜' : '🌿'} Next: ${next.textContent.trim()}`,
            vipMode ? STATUS_COLORS.vip : STATUS_COLORS.active,
            `${wait/1000}s`
        );
        setTimeout(() => { window.location.href = next.href; }, wait);
    }

    if (CURRENT_URL.includes("/Character/Recipe/")) {
        handleRecipePage();
    } else if (CURRENT_URL.includes("/Character/Recipes/")) {
        handleRecipeListPage();
    }

    updateStatusBox();
})();