// ==UserScript==
// @name         GeoGuessr Playtime Tracker
// @namespace    Noahtrix
// @version      3.0
// @description  Tracks active GeoGuessr playtime and shows it on the profile page.
// @author       Noahtrix
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563681/GeoGuessr%20Playtime%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563681/GeoGuessr%20Playtime%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "gg_total_playtime_ms";
    const DAILY_KEY = "gg_daily_playtime_ms";
    const LAST_ACTIVE_KEY = "gg_last_active_timestamp";
    const LAST_RESET_DAY = "gg_last_reset_day";
    const INSTALL_DATE_KEY = "gg_install_date";

    if (!localStorage.getItem(INSTALL_DATE_KEY)) {
        localStorage.setItem(INSTALL_DATE_KEY, new Date().toLocaleDateString());
    }

    const getVal = (key) => Number(localStorage.getItem(key)) || 0;

    let lastTick = Date.now();

    const runTick = () => {
        const now = Date.now();
        const todayStr = new Date().toDateString();

        if (localStorage.getItem(LAST_RESET_DAY) !== todayStr) {
            localStorage.setItem(DAILY_KEY, "0");
            localStorage.setItem(LAST_RESET_DAY, todayStr);
            lastTick = now;
            return;
        }

        if (document.hasFocus() && !document.hidden) {
            const diff = now - lastTick;

            if (diff > 0 && diff < 2000) {
                const currentTotal = getVal(STORAGE_KEY);
                const currentDaily = getVal(DAILY_KEY);
                localStorage.setItem(STORAGE_KEY, String(currentTotal + diff));
                localStorage.setItem(DAILY_KEY, String(currentDaily + diff));
            }
        }

        lastTick = now;
        localStorage.setItem(LAST_ACTIVE_KEY, String(now));
    };

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes ggFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        #gg-playtime-final { font-family: var(--font-family-neo-sans), "Neo Sans", sans-serif !important; }
        .gg-playtime-active { animation: ggFadeIn 0.3s ease-out forwards !important; }
        .gg-detail-container {
            max-height: 0; opacity: 0; margin-bottom: 0; position: relative; overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.4s ease;
        }
        .gg-detail-container.expanded { max-height: 40px; opacity: 1; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); overflow: visible; }
        #gg-expand-btn { background: none !important; border: none !important; color: #ffc800 !important; cursor: pointer !important; padding: 4px !important; font-size: 14px !important; transition: transform 0.4s ease !important; outline: none !important; }
        .gg-info-parent { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .gg-info-wrapper { cursor: help; position: relative; }
        .gg-tooltip {
            position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
            background: white; color: black; padding: 6px 12px; border-radius: 8px; font-size: 11px;
            white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,0.5); opacity: 0; visibility: hidden;
            transition: opacity 0.2s ease; pointer-events: none; z-index: 99999; font-weight: 800;
        }
        .gg-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-width: 5px; border-style: solid; border-color: white transparent transparent transparent; }
        .gg-info-wrapper:hover .gg-tooltip { opacity: 1 !important; visibility: visible !important; }
    `;
    document.head.appendChild(styleSheet);

    let isExpanded = false;
    const formatTime = (ms) => {
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h}h ${m}m`;
    };

    function checkUI() {
        const isProfile = window.location.pathname.includes("/profile") && !document.querySelector('div[class*="home-layout"]');
        let el = document.getElementById("gg-playtime-final");

        if (!isProfile) {
            if (el) el.remove();
            return;
        }

        if (!el) {
            el = document.createElement("div");
            el.id = "gg-playtime-final";
            el.className = "gg-playtime-active";
            document.body.appendChild(el);
            el.style.cssText = `
                position: fixed !important; bottom: 20px !important; left: 20px !important;
                background: rgba(15, 15, 15, 0.95) !important; backdrop-filter: blur(12px) !important;
                color: white !important; padding: 12px 16px !important; border-radius: 12px !important;
                font-weight: 700 !important; z-index: 9999999 !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                display: flex !important; flex-direction: column !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important; min-width: 175px !important; width: fit-content !important;
            `;

            el.innerHTML = `
                <div id="gg-detail" class="gg-detail-container ${isExpanded ? 'expanded' : ''}">
                    <div class="gg-info-parent">
                        <div id="gg-daily-content"></div>
                        <div class="gg-info-wrapper">
                            <div style='background: transparent; color: #0095ff; border: 1.8px solid #0095ff; border-radius: 50%; width: 15px; height: 15px; font-size: 11px; display: flex; align-items: center; justify-content: center; font-family: "Courier New", Courier, monospace !important; font-weight: 900 !important; padding-top: 1px; text-shadow: 0.2px 0 0 #0095ff;'>i</div>
                            <div class="gg-tooltip">Since ${localStorage.getItem(INSTALL_DATE_KEY)}</div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; pointer-events: none;">
                    <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                        <span style="color: #ffc800; font-size: 1.2em;">⏱</span>
                        <span id="gg-total-display" style="font-size: 13px;"></span>
                    </div>
                    <button id="gg-expand-btn" style="pointer-events: auto !important; transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}">▼</button>
                </div>
            `;

            el.querySelector("#gg-expand-btn").onclick = (e) => {
                isExpanded = !isExpanded;
                const detail = document.getElementById("gg-detail");
                if (detail) detail.classList.toggle("expanded", isExpanded);
                e.target.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
            };
        }

        const totalDisp = document.getElementById("gg-total-display");
        const dailyContent = document.getElementById("gg-daily-content");
        if (totalDisp) totalDisp.innerText = "Playtime: " + formatTime(getVal(STORAGE_KEY));
        if (dailyContent) {
            dailyContent.innerHTML = `<span style="font-size: 10px; color: #888;">TODAY:</span> <span style="font-size: 13px; margin-left: 4px; white-space: nowrap;">${formatTime(getVal(DAILY_KEY))}</span>`;
        }
    }

    setInterval(runTick, 100);
    setInterval(checkUI, 100);
})();