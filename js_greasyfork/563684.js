// ==UserScript==
// @name         Abroad Items Info (YATA) - Overlay
// @namespace    hardy.yata.abroad.robust
// @version      4.4.1
// @description  Shows a movable, resizable YATA abroad prices overlay only on the Travel Agency page
// @author       R4G3RUNN3R[3877028] - (based on Hardy script)
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      yata.yt
// @downloadURL https://update.greasyfork.org/scripts/563684/Abroad%20Items%20Info%20%28YATA%29%20-%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/563684/Abroad%20Items%20Info%20%28YATA%29%20-%20Overlay.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const COUNTRY_MAP = {
        mex: "Mexico",
        cay: "Cayman Islands",
        can: "Canada",
        haw: "Hawaii",
        uni: "United Kingdom",
        arg: "Argentina",
        swi: "Switzerland",
        jap: "Japan",
        chi: "China",
        uae: "UAE",
        sou: "South Africa"
    };

    const STORAGE_KEY = "yata_overlay_state_v426";
    const defaultState = { x: null, y: null, width: 1100, height: 420 };

    function loadState() {
        try {
            return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
        } catch {
            return { ...defaultState };
        }
    }

    function saveState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // ---------- WAIT FOR TRAVEL AGENCY ----------

    function isTravelDOMPresent() {
        return document.body.innerText.includes("Welcome to the Torn City travel agency");
    }

    function waitForTravelPage(callback) {
        if (isTravelDOMPresent()) {
            callback();
            return;
        }

        const observer = new MutationObserver(() => {
            if (isTravelDOMPresent()) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 15000);
    }

    waitForTravelPage(initOverlay);

    // ---------- MAIN ----------

    function initOverlay() {
        if (document.getElementById("yata-overlay")) return;

        const state = loadState();

        const overlay = document.createElement("div");
        overlay.id = "yata-overlay";

        const header = document.createElement("div");
        header.id = "yata-header";
        header.innerHTML = `
            <span>YATA Abroad Items</span>
            <div class="yata-controls">
                <button id="yata-minimize">🗕</button>
                <button id="yata-close">✕</button>
            </div>
        `;

        const content = document.createElement("div");
        content.id = "yata-content";
        content.innerHTML = `<div class="yata-loading">Loading YATA data…</div>`;

        const resizeGrip = document.createElement("div");
        resizeGrip.id = "yata-resize-grip";

        const miniToggle = document.createElement("div");
        miniToggle.id = "yata-mini-toggle";
        miniToggle.textContent = "YATA – ABROAD PRICES";
        miniToggle.style.display = "none";

        overlay.append(header, content, resizeGrip);
        document.body.append(overlay, miniToggle);

        overlay.style.width = state.width + "px";
        overlay.style.height = state.height + "px";

        if (state.x !== null && state.y !== null) {
            overlay.style.left = state.x + "px";
            overlay.style.top = state.y + "px";
        } else {
            overlay.style.left = "50%";
            overlay.style.transform = "translateX(-50%)";
            overlay.style.bottom = "40px";
        }

        // ---------- DRAG ----------

        let dragging = false, startX, startY;

        header.addEventListener("mousedown", e => {
            dragging = true;
            startX = e.clientX - overlay.offsetLeft;
            startY = e.clientY - overlay.offsetTop;
            document.body.style.userSelect = "none";
        });

        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            overlay.style.left = Math.max(0, e.clientX - startX) + "px";
            overlay.style.top = Math.max(0, e.clientY - startY) + "px";
        });

        document.addEventListener("mouseup", () => {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = "";
            saveState({
                ...state,
                x: overlay.offsetLeft,
                y: overlay.offsetTop,
                width: overlay.offsetWidth,
                height: overlay.offsetHeight
            });
        });

        // ---------- RESIZE ----------

        let resizing = false, rX, rY, rW, rH;

        resizeGrip.addEventListener("mousedown", e => {
            resizing = true;
            rX = e.clientX;
            rY = e.clientY;
            rW = overlay.offsetWidth;
            rH = overlay.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener("mousemove", e => {
            if (!resizing) return;
            overlay.style.width = Math.max(600, rW + (e.clientX - rX)) + "px";
            overlay.style.height = Math.max(200, rH + (e.clientY - rY)) + "px";
        });

        document.addEventListener("mouseup", () => {
            if (!resizing) return;
            resizing = false;
            saveState({
                ...state,
                x: overlay.offsetLeft,
                y: overlay.offsetTop,
                width: overlay.offsetWidth,
                height: overlay.offsetHeight
            });
        });

        // ---------- MINIMIZE ----------

        header.querySelector("#yata-close").onclick =
        header.querySelector("#yata-minimize").onclick = () => {
            overlay.style.display = "none";
            miniToggle.style.display = "block";
        };

        miniToggle.onclick = () => {
            overlay.style.display = "block";
            miniToggle.style.display = "none";
        };

        // ---------- YATA DATA ----------

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://yata.yt/api/v1/travel/export/",
            responseType: "json",
            onload: res => {
                const stocks = res.response?.stocks;
                if (!stocks) {
                    content.innerHTML = `<div>No YATA data available.</div>`;
                    return;
                }

                let rows = [];
                for (const country in stocks) {
                    const countryName = COUNTRY_MAP[country] || country.toUpperCase();
                    for (const item of stocks[country].stocks) {
                        rows.push(`
                            <tr>
                                <td class="yata-country">${countryName}</td>
                                <td class="yata-item">${item.name}</td>
                                <td class="yata-qty">${item.quantity}</td>
                                <td class="yata-price">$${item.cost.toLocaleString()}</td>
                            </tr>
                        `);
                    }
                }

                content.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Country</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>${rows.join("")}</tbody>
                    </table>
                `;
            }
        });

        GM_addStyle(`
            #yata-overlay {
                position: fixed;
                z-index: 99999;
                background: #111;
                border: 1px solid #333;
                box-shadow: 0 0 20px rgba(0,0,0,.8);
                color: #eee;
            }
            #yata-header {
                cursor: move;
                background: #1a1a1a;
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            #yata-content {
                overflow: auto;
                height: calc(100% - 36px);
            }
            #yata-content table {
                width: 100%;
                border-collapse: collapse;
            }
            #yata-content th, #yata-content td {
                padding: 6px 8px;
                border-bottom: 1px solid #222;
            }
            .yata-country { color: #4fc3f7; }
            .yata-item { color: #fff; }
            .yata-qty { color: #6f6; }
            .yata-price { color: #ffd54f; }
            #yata-resize-grip {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 16px;
                height: 16px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 50%, #555 50%);
            }
            #yata-mini-toggle {
                position: fixed;
                bottom: 120px;
                right: 20px;
                background: #39ff14;
                color: #000;
                border: 2px solid #2ecc71;
                padding: 10px 14px;
                font-weight: 900;
                border-radius: 8px;
                cursor: pointer;
                z-index: 100000;
                box-shadow: 0 0 12px rgba(57,255,20,0.8);
            }
        `);
    }

})();
