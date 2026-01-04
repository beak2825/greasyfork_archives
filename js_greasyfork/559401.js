// ==UserScript==
// @name         Bloxd.io – YouTube & Super Rank + Cape (Client-side)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Client-side YouTube rank, Super rank, and cape for YOUR Bloxd.io player only.
// @match        *://bloxd.io/*
// @match        *://*.bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559401/Bloxdio%20%E2%80%93%20YouTube%20%20Super%20Rank%20%2B%20Cape%20%28Client-side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559401/Bloxdio%20%E2%80%93%20YouTube%20%20Super%20Rank%20%2B%20Cape%20%28Client-side%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // =========================
    //  CONFIG
    // =========================

    // Put your exact Bloxd username here (case-sensitive).
    // If left empty, the script will try to auto-detect it from HUD.
    const YOUR_NAME = "";

    // Toggle features
    const ENABLE_YT_RANK    = true;
    const ENABLE_SUPER_RANK = true;
    const ENABLE_CAPE       = true;

    // =========================
    //  SVG / STYLE DEFINITIONS
    // =========================

    // YouTube rank badge (Spectra-style: red pill, white play icon)
    const YT_BADGE_HTML = `
        <span class="spectra-yt-rank-badge" style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            margin-right:4px;
        ">
            <svg width="46" height="18" viewBox="0 0 46 18" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="46" height="18" rx="7" fill="#FF0000"/>
                <polygon points="18,5 28,9 18,13" fill="#FFFFFF"/>
            </svg>
        </span>
    `;

    // Super rank badge (you can tweak colors to match Spectra more closely)
    const SUPER_BADGE_HTML = `
        <span class="spectra-super-rank-badge" style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            margin-right:4px;
        ">
            <svg width="52" height="18" viewBox="0 0 52 18" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="superGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#8A2BE2"/>
                        <stop offset="50%" stop-color="#C715FF"/>
                        <stop offset="100%" stop-color="#FF0080"/>
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="52" height="18" rx="7" fill="url(#superGradient)"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                      fill="#FFFFFF" font-size="9" font-family="Arial, sans-serif">
                    SUPER
                </text>
            </svg>
        </span>
    `;

    // Inject cape CSS (visual-only, behind your character / nametag area)
    const CAPE_CSS = `
        .spectra-cape {
            position:absolute;
            width:32px;
            height:40px;
            left:50%;
            transform:translateX(-50%);
            top:18px; /* below nametag */
            pointer-events:none;
            background: linear-gradient(180deg, #FF0000 0%, #800000 100%);
            border-radius:2px;
            box-shadow:0 0 6px rgba(0,0,0,0.35);
        }

        .spectra-cape::after {
            content:"";
            position:absolute;
            top:0;
            left:0;
            right:0;
            height:4px;
            background:rgba(255,255,255,0.18); /* highlight strip */
        }
    `;

    // =========================
    //  UTILITIES
    // =========================

    function injectGlobalStyles(css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    function getPlayerName() {
        if (YOUR_NAME) return YOUR_NAME;
        const hudEl = document.querySelector("#hud-username, .hud-username, .username");
        return hudEl ? hudEl.textContent.trim() : null;
    }

    // =========================
    //  BADGE APPLICATION
    // =========================

    function applyBadges() {
        const name = getPlayerName();
        if (!name) return;

        const selectors = [
            ".chat-message-username",
            ".leaderboard-name",
            ".nametag-name",
            ".player-name",
            ".username"
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // Only touch the *exact* player name
                if (el.dataset.spectraRankApplied === "true") return;
                if (el.textContent.trim() !== name) return;

                let html = el.innerHTML;

                // Prepend Spectra-style badges
                let prefix = "";
                if (ENABLE_YT_RANK)    prefix += YT_BADGE_HTML;
                if (ENABLE_SUPER_RANK) prefix += SUPER_BADGE_HTML;

                el.innerHTML = prefix + html;
                el.dataset.spectraRankApplied = "true";
            });
        });
    }

    // =========================
    //  CAPE APPLICATION
    // =========================

    function applyCape() {
        if (!ENABLE_CAPE) return;

        const name = getPlayerName();
        if (!name) return;

        // This part is necessarily a bit "guessy" because Bloxd DOM can change.
        // We attach cape near nametag / player container.
        const possibleNametagSelectors = [
            ".nametag",
            ".player-nametag",
            ".player-name-container",
            ".nametag-wrapper"
        ];

        possibleNametagSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.dataset.spectraCapeApplied === "true") return;

                // Only try attaching to elements that actually contain our name somewhere inside.
                if (!el.textContent || !el.textContent.includes(name)) return;

                // Ensure parent is positioned so the cape can anchor correctly.
                const style = window.getComputedStyle(el);
                if (style.position === "static") {
                    el.style.position = "relative";
                }

                const existingCape = el.querySelector(".spectra-cape");
                if (existingCape) return;

                const cape = document.createElement("div");
                cape.className = "spectra-cape";

                el.appendChild(cape);
                el.dataset.spectraCapeApplied = "true";
            });
        });
    }

    // =========================
    //  OBSERVER + LOOPS
    // =========================

    function mainTick() {
        applyBadges();
        applyCape();
    }

    function initObserver() {
        const observer = new MutationObserver(() => {
            mainTick();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // =========================
    //  INIT
    // =========================

    injectGlobalStyles(CAPE_CSS);

    // First pass
    mainTick();

    // Keep reapplying as UI changes
    initObserver();
    setInterval(mainTick, 750);
})();
