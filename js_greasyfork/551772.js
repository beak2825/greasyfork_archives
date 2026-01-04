// ==UserScript==
// @name         Bounce Client For Bloxd.io 
// @namespace    Created By Bounce Team
// @version      1.1
// @description  Bounce Client (Hacks) for Bloxd.io
// @license      MIT
// @author       ExpertCrafts, CyphrNX, Ugvs_ and United Nations Hacks (Not ChatGPT -_-)
// @match        https://bloxd.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551772/Bounce%20Client%20For%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/551772/Bounce%20Client%20For%20Bloxdio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== STYLE ======
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blueWhite {
        0% { background: #001f3f; }
        50% { background: #ffffff; }
        100% { background: #001f3f; }
      }
      #bounce-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 999999;
        animation: blueWhite 4s infinite alternate;
        font-family: monospace;
        color: cyan;
      }
      #bounce-title {
        text-align: center;
        font-size: 40px;
        font-weight: bold;
        margin: 20px 0;
        background: linear-gradient(90deg, blue, white, blue);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px blue, 0 0 20px white;
      }
      #bounce-list {
        position: absolute;
        top: 100px;
        left: 20px;
        width: 280px;
        height: 75%;
        overflow-y: auto;
        background: rgba(0,0,0,0.15);
        padding: 8px;
        border-radius: 8px;
      }
      .bounce-item {
        padding: 6px;
        cursor: pointer;
        font-size: 16px;
        color: white;
        border-radius: 6px;
        margin-bottom: 6px;
      }
      .bounce-item:hover {
        background: rgba(0,0,255,0.12);
      }
      #bounce-close {
        position: absolute;
        top: 10px;
        right: 15px;
        color: blue;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
      }
      #bounce-reopen {
        display: none;
        position: fixed;
        top: 10px; left: 10px;
        z-index: 999999;
        background: #001f3f;
        color: white;
        padding: 6px 12px;
        cursor: pointer;
        border: 1px solid blue;
        font-family: monospace;
        font-size: 14px;
      }
      #bloxd-ping-display {
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 14px;
        background: rgba(0, 0, 0, 0.7);
        color: #4CAF50;
        font-family: 'Inter', sans-serif;
        font-size: 18px;
        font-weight: 700;
        border-radius: 12px;
        z-index: 10000;
        user-select: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        min-width: 120px;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(style);

    // ====== CHEAT MENU ITEMS (visual-only except Show Ping) ======
    const cheats = [
      "Auto Sprint",
      "Night Mode",
      "Rainbow Username",
      "FPS Boost",
      "Anti AFK",
      "Old Skins",
      "New Skins",
      "Show Ping",
      "Clean UI",
      "Custom Crosshair"
    ];

    const overlay = document.createElement("div");
    overlay.id = "bounce-overlay";
    overlay.innerHTML = `
      <div id="bounce-title">Bounce Client</div>
      <div id="bounce-close">Close</div>
      <div id="bounce-list"></div>
    `;
    document.body.appendChild(overlay);

    const list = overlay.querySelector("#bounce-list");

    // ====== PING SYSTEM (real) ======
    let pingDisplay;
    const PING_INTERVAL_MS = 3000;
    let pingInterval;

    function createPingDisplay() {
        if (pingDisplay) return;
        pingDisplay = document.createElement('div');
        pingDisplay.id = 'bloxd-ping-display';
        pingDisplay.textContent = 'Ping: Loading...';
        document.body.appendChild(pingDisplay);
    }

    async function measurePing() {
        const url = window.location.origin;
        const start = performance.now();
        try {
            await fetch(url, { method: 'HEAD', cache: 'no-store' });
            const rtt = Math.round(performance.now() - start);
            updatePingDisplay(rtt);
        } catch {
            updatePingDisplay('ERR');
        }
    }

    function updatePingDisplay(ping) {
        if (!pingDisplay) return;
        let color;
        let text = (ping === 'ERR') ? 'Error' : `${ping} ms`;

        if (ping === 'ERR') color = '#FF4500';
        else if (ping < 100) color = '#4CAF50';
        else if (ping < 250) color = '#FFD700';
        else color = '#FF4500';

        pingDisplay.textContent = `Ping: ${text}`;
        pingDisplay.style.color = color;
    }

    function startPing() {
        createPingDisplay();
        measurePing();
        pingInterval = setInterval(measurePing, PING_INTERVAL_MS);
    }

    function stopPing() {
        if (pingInterval) clearInterval(pingInterval);
        pingInterval = null;
        if (pingDisplay) {
            pingDisplay.remove();
            pingDisplay = null;
        }
    }

    // ====== ADD ITEMS (toggle visuals; Show Ping is real) ======
    cheats.forEach(c => {
        const item = document.createElement("div");
        item.className = "bounce-item";
        item.textContent = c + " [OFF]";
        item.dataset.state = "off";
        item.onclick = () => {
            const state = item.dataset.state === "off" ? "on" : "off";
            item.dataset.state = state;
            item.textContent = c + (state === "on" ? " [ON]" : " [OFF]");
            item.style.color = state === "on" ? "lime" : "white";

            // Only "Show Ping" has real logic — everything else stays fake/UI-only
            if (c === "Show Ping") {
                if (state === "on") startPing();
                else stopPing();
            }
        };
        list.appendChild(item);
    });

    // ====== CLOSE / REOPEN ======
    const closeBtn = overlay.querySelector("#bounce-close");
    const reopenBtn = document.createElement("div");
    reopenBtn.id = "bounce-reopen";
    reopenBtn.textContent = "= Bounce Client";
    document.body.appendChild(reopenBtn);

    closeBtn.onclick = () => {
        overlay.style.display = "none";
        reopenBtn.style.display = "block";
    };
    reopenBtn.onclick = () => {
        overlay.style.display = "block";
        reopenBtn.style.display = "none";
    };

    // Initialize: keep overlay visible by default (it's already appended)
})();
