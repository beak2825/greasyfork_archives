// ==UserScript==
// @name 💧.𖥔 ݁ ˖ Health & Mood Watch (XP Only) 
// @namespace chk.pop.locale.xp.unified
// @version 4.4
// @description Auto-heals Health (<75%) and Mood (<50%) using XP only. Works on Safari/iPad.
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/ImproveCharacter
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/ImproveCharacter/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/557708/%F0%9F%92%A7%F0%96%A5%94%20%DD%81%20%CB%96%20Health%20%20Mood%20Watch%20%28XP%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557708/%F0%9F%92%A7%F0%96%A5%94%20%DD%81%20%CB%96%20Health%20%20Mood%20Watch%20%28XP%20Only%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const CORE_CHECK_INTERVAL_MS = 60000;
    const HEALTH_THRESHOLD = 40;
    const MOOD_THRESHOLD = 40;

    // =====================================================================
    // --- 2. UI (Floating Smooth Pill Badge with Poppins Font) ---
    // =====================================================================
    const STATUS_BOX_ID = "unified-auto-status";

    // Inject Google Fonts via @import (Safari‑friendly)
    (function loadFont() {
        const style = document.createElement("style");
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        `;
        document.head.appendChild(style);
    })();

    const STATUS_BOX_STYLE = `
        position: fixed;
        bottom: 40px;                  /* lifted higher for Safari toolbar */
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

    function log(msg) { console.log(`[AutoScript] ${msg}`); }

    function updateStatusBox(title, status, secondary, overrideColor) {
        let box = document.getElementById(STATUS_BOX_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = STATUS_BOX_ID;
            box.style.cssText = STATUS_BOX_STYLE;
            document.body.appendChild(box);
        }

        let bg = "linear-gradient(90deg,#d9ecff,#cfe7ff)";
        if (overrideColor === "#009900") bg = "linear-gradient(90deg,#d9ffe3,#c8f7d4)";
        else if (overrideColor === "#ff9999") bg = "linear-gradient(90deg,#ffe0e0,#ffc9c9)";
        else if (overrideColor === "#cc6600") bg = "linear-gradient(90deg,#ffe9d6,#ffd2a8)";
        else if (overrideColor === "#0066cc") bg = "linear-gradient(90deg,#d6e9ff,#c0dcff)";

        box.style.background = bg;
        box.innerHTML = `
            <div style="${STATUS_LINE_STYLE}">${title}</div>
            <div style="${STATUS_LINE_STYLE}">${status}</div>
            <div style="${STATUS_SECONDARY_STYLE}">${secondary}</div>
        `;
        box.style.display = "inline-block";
    }

    // =====================================================================
    // --- 3. STAT DETECTION (Localization‑proof) ---
    // =====================================================================
    const ATTR_MAP = {
        health: ["Health","Sağlık"],
        mood: ["Mood","Ruh hâli"]
    };

    function getStatsFromImproveCharacterPage() {
        const rows = document.querySelectorAll("#tableattributes tbody tr");
        let health = null, mood = null;
        rows.forEach(row => {
            const link = row.querySelector("a[href*='Help/Attributes']");
            if (!link) return;
            const attrName = link.textContent.trim();
            const progressDiv = row.querySelector(".progressBar");
            if (progressDiv) {
                const percent = parseInt(progressDiv.getAttribute("title")?.replace('%',''),10);
                if (!isNaN(percent)) {
                    if (ATTR_MAP.health.includes(attrName)) health = percent;
                    if (ATTR_MAP.mood.includes(attrName)) mood = percent;
                }
            }
        });
        return { health, mood };
    }

    // =====================================================================
    // --- 4. COUNTDOWN ---
    // =====================================================================
    let checkCountdownIntervalId = null;
    function startCoreCountdown(healthPercent, moodPercent) {
        if (checkCountdownIntervalId) clearInterval(checkCountdownIntervalId);
        let nextCheckTime = Date.now() + CORE_CHECK_INTERVAL_MS;
        const update = () => {
            const remaining = Math.max(0, nextCheckTime - Date.now());
            const seconds = Math.ceil(remaining/1000);
            updateStatusBox("💧 Watch",
                `H:${healthPercent}% | M:${moodPercent}%`,
                `Next: ${seconds}s`);
            if (remaining <= 0) {
                clearInterval(checkCountdownIntervalId);
                log("Reloading page...");
                window.location.reload();
            }
        };
        checkCountdownIntervalId = setInterval(update,1000);
        update();
    }

    // =====================================================================
    // --- 5. XP IMPROVEMENT ---
    // =====================================================================
    function clickImproveButton(attributeName) {
        const rows = document.querySelectorAll("#tableattributes tbody tr");
        const targetRow = Array.from(rows).find(row=>{
            const link=row.querySelector("a[href*='Help/Attributes']");
            return link && ATTR_MAP[attributeName].includes(link.textContent.trim());
        });
        const button=targetRow?.querySelector("input[value='Geliştir'],input[value='Improve']");
        if(button){
            log(`Clicking Improve ${attributeName}...`);
            updateStatusBox(`Improving ${attributeName}`,"Using XP...","Reloading","#ff9999");
            button.click();
        } else {
            log(`Improve ${attributeName} button not found!`);
            updateStatusBox("Error",`${attributeName} button not found!`,"Retrying","#ff9999");
            const {health,mood}=getStatsFromImproveCharacterPage();
            setTimeout(()=>startCoreCountdown(health||100,mood||100),2000);
        }
    }

    // =====================================================================
    // --- 6. MAIN CHECK ---
    // =====================================================================
    function checkStatsOnImproveCharacterPage() {
        updateStatusBox("Checking","Reading...","Wait","#cc6600");
        const {health,mood}=getStatsFromImproveCharacterPage();
        if(health===null||mood===null){
            log("Stats not found, retrying...");
            setTimeout(checkStatsOnImproveCharacterPage,1500);
            return;
        }
        log(`Stats: Health ${health}%, Mood ${mood}%`);
        const notification=document.querySelector(".notification-success");
        if(notification&&notification.textContent.includes("successfully spent")){
            updateStatusBox("XP Used","Improvement done","Rechecking","#009900");
            setTimeout(()=>window.location.reload(),3000);
            return;
        }
        if(health<HEALTH_THRESHOLD){
            updateStatusBox("Health Low",`H:${health}%`,"Improving","#ff9999");
            setTimeout(()=>clickImproveButton("health"),1000);
            return;
        }
        if(mood<MOOD_THRESHOLD){
            updateStatusBox("Mood Low",`M:${mood}%`,"Improving","#ff9999");
            setTimeout(()=>clickImproveButton("mood"),1000);
            return;
        }
        updateStatusBox("All Good",`H:${health}% | M:${mood}%`,"Next 60s","#009900");
        startCoreCountdown(health,mood);
    }

    // =====================================================================
    // --- 7. MAIN EXECUTION ---
    // =====================================================================
    log("Script loaded. Starting checks...");
    updateStatusBox("Starting","... Wait ...","💧");
    setTimeout(checkStatsOnImproveCharacterPage,1500);
    const observer=new MutationObserver(()=>{
        if(!document.getElementById(STATUS_BOX_ID)){
            log("Status box removed, recreating...");
            updateStatusBox("Monitoring","Restored","Watching","#0066cc");
        }
    });
        observer.observe(document.body, { childList: true, subtree: true });
})();
