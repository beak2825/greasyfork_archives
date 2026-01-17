// ==UserScript==
// @name Health & Mood Watch (Painkillers and Halloween Item) 💧.𖥔 ݁ ˖
// @namespace chk.pop.locale.automood.autoheal.unified
// @version 2.2.3
// @description Combines Mood (Kraken) and Health (Painkillers) with a single, modern status box, coordinated actions, and mandatory periodic reload.
// @match https://*.popmundo.com/World/Popmundo.aspx/Character*
// @match https://*.popmundo.com/World/Popmundo.aspx/Interact/*
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/562927/Health%20%20Mood%20Watch%20%28Painkillers%20and%20Halloween%20Item%29%20%F0%9F%92%A7%F0%96%A5%94%20%DD%81%20%CB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/562927/Health%20%20Mood%20Watch%20%28Painkillers%20and%20Halloween%20Item%29%20%F0%9F%92%A7%F0%96%A5%94%20%DD%81%20%CB%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // =====================================================================
    // --- 1. CONFIGURATION ---
    // =====================================================================
    // --- Core Settings ---
    const MY_CHARACTER_ID = "3603887";
    // This dictates the mandatory page reload interval when no action is needed.
    const CORE_CHECK_INTERVAL_MS = 60000; // 60 seconds (Changed from 10s for stability)

    // --- Mood/Kraken Config ---
    const MOOD_THRESHOLD = 0;
    const KRAKEN_ITEM_NAME = "Kraken Costume";
    const KRAKEN_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

    // --- Health/Painkiller Config ---
    const HEALTH_THRESHOLD = 20;
    const HEAL_USE_LIMIT = 1;
    const PAINKILLER_NAMES = ["Painkiller", "Ağrı Kesici"]; // English and Turkish
    const USE_BUTTON_TITLES = ["Use", "Kullan"]; // English and Turkish

    // --- URLs (Auto-Generated) ---
    const BASE_URL = window.location.origin;
    // NOTE: CHARACTER_URL must be the base page without a trailing slash for comparison
    const CHARACTER_URL = `${BASE_URL}/World/Popmundo.aspx/Character`;
    const KRAKEN_INTERACT_URL = `${BASE_URL}/World/Popmundo.aspx/Interact/${MY_CHARACTER_ID}`;
    const ITEMS_URL = `${BASE_URL}/World/Popmundo.aspx/Character/Items`;

    // =====================================================================
    // --- 2. UI & UTILITIES (Updated with Poppins Font) ---
    // =====================================================================
    const STATUS_BOX_ID = "unified-auto-status";

    // Inject Google Fonts via @import (Safari-friendly)
    (function loadFont() {
        const style = document.createElement("style");
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        `;
        document.head.appendChild(style);
    })();

    // 💠 Style Constants
    const STATUS_BOX_STYLE = `
        position: fixed;
        bottom: 20px;
        right: 16px;
        min-width: 240px;
        background: linear-gradient(135deg, #eaf6ff 0%, #d6ecff 100%);
        color: #1a3d5c;
        font-family: "Poppins", sans-serif !important;
        font-size: 13px;
        border-radius: 40px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        z-index: 9999;
        text-align: center;
        padding: 12px 18px;
        border: 1px solid #c2def7;
        transition: all 0.3s ease;
    `;

    const STATUS_HEADER_STYLE = `
        display: none;
    `;

    const STATUS_BODY_STYLE = `
        font-family: 'Poppins', sans-serif !important;
    `;

    const STATUS_LINE_STYLE = `
        font-size: 13px;
        font-weight: 600;
        margin: 0;
        color: #1a3d5c;
        font-family: "Poppins", sans-serif !important;
    `;

    const STATUS_SECONDARY_STYLE = `
        font-size: 11px;
        color: #4a6a85;
        margin-top: 4px;
        font-weight: 400;
        font-family: "Poppins", sans-serif !important;
    `;

    // 🧭 Logging Helper
    function log(msg) {
        console.log(`[AutoScript] ${msg}`);
    }

    // 📦 Unified Status Box Renderer
    function updateStatusBox(title, status, secondary, overrideColor) {
        let box = document.getElementById(STATUS_BOX_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = STATUS_BOX_ID;
            box.style.cssText = STATUS_BOX_STYLE;
            document.body.appendChild(box);
        }

        let bg = "linear-gradient(90deg, #d9ecff, #cfe7ff)";
        if (overrideColor === "#009900") bg = "linear-gradient(90deg, #d9ffe3, #c8f7d4)";
        else if (overrideColor === "#ff9999") bg = "linear-gradient(90deg, #ffe0e0, #ffc9c9)";
        else if (overrideColor === "#cc6600") bg = "linear-gradient(90deg, #ffe9d6, #ffd2a8)";
        else if (overrideColor === "#0066cc") bg = "linear-gradient(90deg, #d6e9ff, #c0dcff)";

        box.style.background = bg;
        box.innerHTML = `
            <div style="${STATUS_LINE_STYLE}">${title}</div>
            <div style="${STATUS_LINE_STYLE}">${status}</div>
            <div style="${STATUS_SECONDARY_STYLE}">${secondary}</div>
        `;
        box.style.display = "inline-block";
    }

    /** Helper to find a stat percentage based on image title (supports English and Turkish). */
    function getStatPercent(statType) {
        // Define title mappings for both languages
        const titleMap = {
            'Mood': ['Mood', 'Ruh Hali', 'Ruh hâli'],
            'Health': ['Health', 'Sağlık']
        };

        const titles = titleMap[statType];
        if (!titles) return null;

        // Try to find the image with any of the possible titles
        let img = null;
        for (const title of titles) {
            img = document.querySelector(`img[title='${title}']`);
            if (img) break;
        }

        if (!img) return null;

        // Get the row and extract the percentage
        const row = img.closest("tr");
        if (!row) return null;

        // Try sortkey first (works for Mood)
        const sortkey = row.querySelector(".sortkey");
        if (sortkey) {
            return parseInt(sortkey.textContent.trim(), 10);
        }

        // Try progressBar title attribute (works for both)
        const progressDiv = row.querySelector("div.progressBar");
        if (progressDiv) {
            const val = progressDiv.getAttribute("title");
            if (val) {
                return parseInt(val.replace('%', '').replace('%', '').trim(), 10);
            }
        }

        return null;
    }

    // =====================================================================
    // --- 3. AUTO-RELOAD/COUNTDOWN LOGIC ---
    // =====================================================================
    let checkCountdownIntervalId = null;

    /** * Starts the main countdown loop. When it hits zero, it FORCES A RELOAD.
     */
    function startCoreCountdown(healthPercent, moodPercent, moodCooldown) {
        if (checkCountdownIntervalId) clearInterval(checkCountdownIntervalId);
        let nextCheckTime = Date.now() + CORE_CHECK_INTERVAL_MS;

        const update = () => {
            const remaining = Math.max(0, nextCheckTime - Date.now());
            const seconds = Math.ceil(remaining / 1000);
            const cdMsg = moodCooldown.passed ? "Ready" : `CD: ${Math.ceil(moodCooldown.remaining/1000)}s`;

            updateStatusBox(
                "💧.𖥔 ݁ ˖ Health & Mood Watch",
                `Health: OK (${healthPercent}%) | Mood: OK (${moodPercent}%)`,
                `Next Check: ${seconds}s | Kraken: ${cdMsg}`
            );

            if (remaining <= 0) {
                clearInterval(checkCountdownIntervalId);
                log("Core: Check interval passed. MANDATORY PAGE RELOAD...");
                // --- FORCED RELOAD HERE ---
                window.location.replace(`${CHARACTER_URL}?_=${Date.now()}`);
            }
        };

        checkCountdownIntervalId = setInterval(update, 1000);
        update();
    }

    // =====================================================================
    // --- 4. AUTO-HEAL LOGIC (Health Check Priority) ---
    // =====================================================================
    function checkHealth() {
        const percent = getStatPercent('Health');
        if (percent === null) {
            // Only log if we are on the page where stats should exist
            if (location.href === CHARACTER_URL) {
                log("Health: Not detected. Cannot proceed with checks.");
                updateStatusBox("System Error", "Health stat not found.", "Reload manually.");
            }
            return false;
        }

        if (percent < HEALTH_THRESHOLD) {
            log(`Health: LOW (${percent}%) → Starting Painkiller sequence.`);
            sessionStorage.setItem("healTimesLeft", HEAL_USE_LIMIT);
            updateStatusBox("Health Critical", `LOW (${percent}%) - Healing...`, "Navigating to Items page.");
            setTimeout(() => window.location.href = ITEMS_URL, 1500);
            return true; // Action initiated
        } else {
            log(`Health: OK (${percent}%). Passing control to Mood check.`);
            return false; // Health is OK, proceed to Mood check
        }
    }

    /**
     * @NEW_LOGIC: Updated to use robust item-finding and ensure return to character page.
     */
    function usePainkillersSequentially() {
        let timesLeft = parseInt(sessionStorage.getItem("healTimesLeft") || HEAL_USE_LIMIT, 10);
        const usesDone = HEAL_USE_LIMIT - timesLeft + 1;

        // Update status box for current use attempt
        updateStatusBox("Healing", `Using Painkiller (${usesDone}/${HEAL_USE_LIMIT})`, "Please wait...");

        // 1. SEQUENCE COMPLETE
        if (timesLeft <= 0) {
            log("Heal: Finished 5x Painkiller use. Returning to Character page to RE-CHECK HEALTH.");
            sessionStorage.removeItem("healTimesLeft");
            updateStatusBox("Healing Done", "Used 5x Painkillers.", "Returning to Character page.");
            // Use replace() with a cache-buster to force a fresh script run/re-check
            setTimeout(() => window.location.replace(`${CHARACTER_URL}?_=${Date.now()}`), 2000);
            return;
        }

        // 2. FIND AND USE PAINKILLER (with Turkish support)
        // Robustly find the item row that contains the item name (English or Turkish) AND an available 'Use'/'Kullan' button.
        const pkRow = [...document.querySelectorAll("tr")].find(r => {
            const text = r.textContent.toLowerCase();
            const hasItem = PAINKILLER_NAMES.some(name => text.includes(name.toLowerCase()));
            const hasUseBtn = USE_BUTTON_TITLES.some(title => r.querySelector(`input[title='${title}']`));
            return hasItem && hasUseBtn;
        });

        if (pkRow) {
            // Find the use button (English or Turkish)
            const useBtn = USE_BUTTON_TITLES
                .map(title => pkRow.querySelector(`input[title='${title}']`))
                .find(btn => btn);

            if (useBtn) {
                log(`Heal: Using Painkiller (${usesDone}/${HEAL_USE_LIMIT})... Click will trigger a page reload.`);

                // Decrement and persist BEFORE clicking (page reload expected)
                sessionStorage.setItem("healTimesLeft", timesLeft - 1);

                // Trigger the use action
                useBtn.click();
                return; // Exit as the page will reload
            }
        }

        // 3. ITEM NOT FOUND (Sequence Aborted)
        log("Heal: Painkillers not found. Aborting sequence and returning to Character page.");
        sessionStorage.removeItem("healTimesLeft");
        updateStatusBox("Healing Failed", `Painkiller not found!`, "Returning to Character page.");

        // Go back to CHARACTER_URL to re-check the resulting health
        setTimeout(() => window.location.replace(`${CHARACTER_URL}?_=${Date.now()}`), 3000);
    }

    // =====================================================================
    // --- 5. AUTO-MOOD LOGIC (Secondary Check) ---
    // =====================================================================
    function krakenCooldownPassed() {
        const last = parseInt(localStorage.getItem("autoMoodLastUsed") || "0");
        const remaining = KRAKEN_COOLDOWN_MS - (Date.now() - last);
        return { passed: remaining <= 0, remaining };
    }

    function checkMood(healthPercent) {
        const moodPercent = getStatPercent('Mood');
        const cd = krakenCooldownPassed();

        if (moodPercent === null) {
            log("Mood: Not detected/Parse failed. Reloading for another attempt.");
            updateStatusBox("Mood Watch", "Stat not found.", "Reloading in 2s...");
            setTimeout(() => window.location.replace(`${CHARACTER_URL}?_=${Date.now()}`), 2000);
            return true; // Action initiated (reload)
        }

        if (moodPercent < MOOD_THRESHOLD && cd.passed) {
            log(`Mood: LOW (${moodPercent}%) → Using Kraken Costume.`);
            updateStatusBox("Mood Critical", `LOW (${moodPercent}%) - Fixing...`, "Navigating to Interact page.");
            setTimeout(() => window.location.href = KRAKEN_INTERACT_URL, 1500);
            return true; // Action initiated
        } else {
            // Mood is OK or cooldown is active. Start the periodic reload countdown.
            log(`Mood: OK (${moodPercent}%). Starting core reload countdown.`);
            // Start the CORE timer, which forces a reload after 60s
            startCoreCountdown(healthPercent, moodPercent, cd);
            return false; // No immediate action needed
        }
    }

    function useKrakenCostume() {
        const select = document.querySelector("select[id$='ddlUseItem']");
        const useBtn = document.querySelector("input[id$='btnUseItem']");
        const option = Array.from(select?.options || []).find(o => o.textContent.includes(KRAKEN_ITEM_NAME));

        if (!select || !useBtn || !option) {
            log("Kraken: Item select, button, or item not found → returning");
            updateStatusBox("Mood Failed", `Cannot find ${KRAKEN_ITEM_NAME}.`, "Returning to Character page.");
            setTimeout(() => window.location.href = CHARACTER_URL, 2000);
            return;
        }

        select.value = option.value;
        sessionStorage.setItem("krakenJustUsed", "1"); // Use session storage for immediate redirect/return logic
        updateStatusBox("Mood Fix", `Using ${KRAKEN_ITEM_NAME}...`, "Clicking use button.");
        setTimeout(() => useBtn.click(), 1000);
    }

    function waitForKrakenNotificationAndReturn() {
        updateStatusBox("Mood Fix", "Awaiting Notification...", "Waiting for system response.");
        const startTime = Date.now();
        const maxWait = 15000;
        const interval = setInterval(() => {
            const success = document.querySelector("#notifications .notification-success");
            const error = document.querySelector("#notifications .notification-error");

            if (success?.textContent.trim().length > 0 || (error?.textContent.includes("too recently"))) {
                clearInterval(interval);
                // Set CD on success or *cooldown error*
                localStorage.setItem("autoMoodLastUsed", Date.now());
                updateStatusBox("Mood Fix Complete", "Mood fixed (or CD set)!", "Returning to Character page.");
                setTimeout(() => window.location.href = CHARACTER_URL, 1000);
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(interval);
                updateStatusBox("Mood Fix Timeout", "No notification received.", "Returning to Character page.");
                setTimeout(() => window.location.href = CHARACTER_URL, 1000);
            }
        }, 500);
    }

    // =====================================================================
    // --- 6. MAIN EXECUTION FLOW (FIXED LOGIC) ---
    // =====================================================================

    const currentURL = location.href.split('?')[0]; // Ignore query strings for URL comparison

    if (currentURL.includes("/Interact/")) {
        // --- On Kraken Interact Page ---
        const justUsed = sessionStorage.getItem("krakenJustUsed");
        if (!justUsed) {
            useKrakenCostume();
        } else {
            sessionStorage.removeItem("krakenJustUsed");
            waitForKrakenNotificationAndReturn();
        }
    } else if (currentURL.includes("/Character/Items")) {
        // --- On Items Page (Painkiller) ---
        // MOOD CHECK IS EXPLICITLY SKIPPED HERE
        log("On Items page - continuing Painkiller sequence.");
        // Execute the painkiller loop with a small delay for page rendering
        setTimeout(() => usePainkillersSequentially(), 1500);
    } else if (currentURL === CHARACTER_URL) {
        // --- On Main Character Page (The ONLY place where stats are guaranteed) ---
        log("On Character page. Starting initial checks...");

        const healthActionTaken = checkHealth();

        // 2. If no Health action was taken, check Mood
        // This only runs if we are on the main character page AND health is OK.
        if (!healthActionTaken) {
            const healthPercent = getStatPercent('Health');
            // healthPercent should be non-null here, but pass it for consistency
            checkMood(healthPercent);
        }
    } else {
        // This handles other pages matched by the @match rule (e.g., /Character/Family, etc.)
        log("On Character sub-page (Automation paused).");
        updateStatusBox("Automation Paused", "On Character sub-page.", "Navigate to main Character page.");
    }
})();