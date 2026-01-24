// ==UserScript==
// @name         Company Effectiveness Report (Launcher)
// @namespace    r4g3runn3r.company.effectiveness
// @version      1.5.3
// @description  Director-only floating launcher with pulsing warning button and report window.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://*.torn.com/companies.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563804/Company%20Effectiveness%20Report%20%28Launcher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563804/Company%20Effectiveness%20Report%20%28Launcher%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SCRIPT_NAME = "Company Effectiveness";
    const LOG = (...a) => console.log("[CER]", ...a);

    // ---------- Director detection ----------
    function isDirector() {
        if (!document.body) return false;
        const text = document.body.textContent || "";
        return text.includes("Your Details:") && text.includes("Position: Director");
    }

    // ---------- UI Elements ----------
    let button, panel;
    let panelOpen = false;

    function createButton() {
        if (button) return;

        button = document.createElement("div");
        button.id = "cer-launcher";
        button.innerHTML = `
            <div class="cer-icon">
                <div class="cer-triangle"></div>
                <div class="cer-excl">!</div>
            </div>
            <div class="cer-text">${SCRIPT_NAME}</div>
        `;

        button.addEventListener("click", togglePanel);
        document.body.appendChild(button);
    }

    function createPanel() {
        if (panel) return;

        panel = document.createElement("div");
        panel.id = "cer-panel";
        panel.innerHTML = `
            <div class="cer-header">
                <span>${SCRIPT_NAME} Report</span>
                <button id="cer-close">×</button>
            </div>
            <div class="cer-body">
                <p>This is the new floating report window.</p>
                <p>Employee scanning will be added next.</p>
            </div>
        `;

        panel.querySelector("#cer-close").addEventListener("click", closePanel);
        document.body.appendChild(panel);
    }

    function togglePanel() {
        createPanel();
        panelOpen = !panelOpen;
        panel.style.display = panelOpen ? "block" : "none";
    }

    function closePanel() {
        panelOpen = false;
        if (panel) panel.style.display = "none";
    }

    // ---------- Boot ----------
    function init() {
        if (!isDirector()) {
            LOG("Not a director. Script idle.");
            return;
        }

        LOG("Director detected. Initializing launcher.");
        createButton();
    }

    // Delay init slightly so Torn finishes rendering
    setTimeout(init, 800);

    // ---------- Styles ----------
    GM_addStyle(`
        #cer-launcher {
            position: fixed;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: #2b2b2b;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 0 25px rgba(255,0,0,0.35);
            cursor: pointer;
            animation: cerPulse 1.2s infinite;
        }

        @keyframes cerPulse {
            0% { box-shadow: 0 0 18px rgba(255,0,0,0.35); }
            50% { box-shadow: 0 0 28px rgba(255,0,0,0.7); }
            100% { box-shadow: 0 0 18px rgba(255,0,0,0.35); }
        }

        .cer-icon {
            position: relative;
            width: 26px;
            height: 24px;
        }

        .cer-triangle {
            width: 0;
            height: 0;
            border-left: 13px solid transparent;
            border-right: 13px solid transparent;
            border-bottom: 22px solid #ff3b30;
        }

        .cer-excl {
            position: absolute;
            top: 4px;
            left: 10px;
            font-weight: 900;
            color: #111;
            font-size: 14px;
        }

        .cer-text {
            font-weight: 900;
            font-size: 13px;
            color: #f0f0f0;
            white-space: nowrap;
        }

        #cer-panel {
            position: fixed;
            right: 80px;
            top: 120px;
            width: 420px;
            height: 260px;
            background: rgba(15,15,15,0.96);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            z-index: 100000;
            display: none;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .cer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            font-weight: 900;
            color: #fff;
        }

        .cer-header button {
            background: none;
            border: none;
            color: #ff3b30;
            font-size: 18px;
            cursor: pointer;
        }

        .cer-body {
            padding: 14px;
            color: #ddd;
            font-size: 13px;
        }
    `);

})();
