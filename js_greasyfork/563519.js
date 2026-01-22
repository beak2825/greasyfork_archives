// ==UserScript==
// @name         GeoGuessr Playtime Tracker
// @namespace    geoguessr-playtime-tracker
// @version      1.0
// @description  Tracks active GeoGuessr playtime and shows it on the profile page.
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563519/GeoGuessr%20Playtime%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563519/GeoGuessr%20Playtime%20Tracker.meta.js
// ==/UserScript==

(() => {
    const STORAGE_KEY = "gg_total_playtime_ms";
    const LAST_ACTIVE_KEY = "gg_last_active_timestamp";

    const now = () => Date.now();
    const getTotalTime = () => Number(localStorage.getItem(STORAGE_KEY)) || 0;
    const setTotalTime = (ms) => localStorage.setItem(STORAGE_KEY, String(ms));

    function startTracking() { localStorage.setItem(LAST_ACTIVE_KEY, String(now())); }
    function stopTracking() {
        const last = Number(localStorage.getItem(LAST_ACTIVE_KEY));
        if (!last) return;
        const diff = now() - last;
        if (diff > 0 && diff < 28800000) setTotalTime(getTotalTime() + diff);
        localStorage.removeItem(LAST_ACTIVE_KEY);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") startTracking(); else stopTracking();
    });
    window.addEventListener("beforeunload", stopTracking);
    if (document.visibilityState === "visible") startTracking();

    // ---------- UI LOGIC ----------

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes ggFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .gg-playtime-active {
            animation: ggFadeIn 0.3s ease-out forwards !important;
        }
    `;
    document.head.appendChild(styleSheet);

    function updateUI() {
        const path = window.location.pathname;
        let el = document.getElementById("gg-playtime-final");

        const isProfilePath = path.includes("/profile");
        const dashboardActive = !!document.querySelector('div[class*="home-layout"], main[class*="dashboard"]');

        const shouldBeVisible = isProfilePath && !dashboardActive;

        if (!shouldBeVisible) {
            if (el) {
                el.remove();
            }
            return;
        }

        if (!el) {
            el = document.createElement("div");
            el.id = "gg-playtime-final";
            el.className = "gg-playtime-active";
            (document.body || document.documentElement).appendChild(el);

            el.style.cssText = `
                position: fixed !important;
                bottom: 25px !important;
                left: 25px !important;
                background: rgba(0, 0, 0, 0.82) !important;
                backdrop-filter: blur(8px) !important;
                color: white !important;
                padding: 10px 18px !important;
                border-radius: 12px !important;
                font-family: var(--font-family-neo-sans), "Neo Sans", sans-serif !important;
                font-size: 14px !important;
                font-weight: 700 !important;
                z-index: 999999 !important;
                pointer-events: none !important;
                border: 1px solid rgba(255, 255, 255, 0.12) !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
            `;
        }

        el.innerHTML = `<span style="color: #ffc800; font-size: 1.2em;">⏱</span> <span>Playtime: ${formatTime(getTotalTime())}</span>`;
    }

    setInterval(updateUI, 40);
})();