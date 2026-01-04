// ==UserScript==
// @name         🧭 Compass Route Runner
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  iPad Safari compatible version with touch support and simplified DOM handling
// @author       anon
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale/Compass*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557153/%F0%9F%A7%AD%20Compass%20Route%20Runner.user.js
// @updateURL https://update.greasyfork.org/scripts/557153/%F0%9F%A7%AD%20Compass%20Route%20Runner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CONFIGURATION ----------
    const STORAGE_KEY = "compass_route_state";
    const WAIT_CHECK_TIME_MS = 1 * 60 * 1000;
    const WATCHDOG_INTERVAL_MS = 500; // Slower for mobile

    // ---------- UTILITY FUNCTIONS ----------
    const hardReload = () => {
        window.location.replace(window.location.href);
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const saveState = s => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    const loadState = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const clearState = () => localStorage.removeItem(STORAGE_KEY);

    function getCurrentState() {
        const stateRow = [...document.querySelectorAll('.box table tr')]
            .find(tr => tr.querySelector('td:first-child')?.textContent.trim() === "State");
        return stateRow?.querySelector('td:last-child')?.textContent.trim() || null;
    }

    function checkStateAndResume() {
        const state = loadState();
        if (!state || !state.active) return;
        if (state.path[state.index - 1]?.toUpperCase() !== "WAIT") return;

        const current = getCurrentState();
        if (current === "Normal") {
            state.log.push(`✅ State Normal. Resuming.`);
            saveState(state);
            renderUI();
            performNext();
            return;
        }
        if (current === "Exploring") {
            state.active = true;
            state.index--;
            saveState(state);
            renderUI();
            performNext();
            return;
        }
        state.log.push(`⚠️ Unexpected State: ${current}. Proceeding.`);
        saveState(state);
        renderUI();
        performNext();
    }

    const normalizeDirection = d => {
        const map = {
            E:"East", W:"West", N:"North", S:"South",
            NE:"NorthEast", NW:"NorthWest", SE:"SouthEast", SW:"SouthWest",
            UP:"Up", DOWN:"Down",
            K:"North", G:"South", D:"East", B:"West",
            KB:"NorthWest", KD:"NorthEast", GB:"SouthWest", GD:"SouthEast",
            AŞAĞI:"Down", YUKARI:"Up"
        };
        return map[d.trim().toUpperCase()] || d;
    };

    const reverseDirection = d => {
        const map = {
            "North":"South", "South":"North",
            "East":"West", "West":"East",
            "NorthEast":"SouthWest", "SouthWest":"NorthEast",
            "NorthWest":"SouthEast", "SouthEast":"NorthWest",
            "Up":"Down", "Down":"Up",
            "N":"S", "S":"N", "E":"W", "W":"E",
            "NE":"SW", "SW":"NE", "NW":"SE", "SE":"NW",
            "K":"G", "G":"K", "D":"B", "B":"D",
            "KB":"GD", "GD":"KB", "KD":"GB", "GB":"KD",
            "UP":"DOWN", "DOWN":"UP",
            "YUKARI":"AŞAĞI", "AŞAĞI":"YUKARI"
        };
        const upper = d.trim().toUpperCase();
        return map[upper] || d;
    };

    const findDirEl = d => {
        const nd = normalizeDirection(d);
        return document.querySelector(`g[data-dir="${nd}"], a[href*="/MoveTo/"][title*="${nd}"]`);
    };

    async function performNext() {
        const state = loadState();
        if (!state || !state.active) return;

        if (state.index >= state.path.length) {
            state.active = false;
            state.log.push("✅ Route complete");
            saveState(state);
            renderUI();
            return;
        }

        const step = state.path[state.index];

        // WAIT (Exploring)
        if (step.toUpperCase() === "WAIT") {
            const current = getCurrentState();
            if (current === "Exploring") {
                const ms = WAIT_CHECK_TIME_MS;
                const msg = `⏳ Waiting ${ms/60000} min then reload...`;
                state.log[state.log.length - 1]?.startsWith("⏳ ")
                    ? state.log[state.log.length - 1] = msg
                    : state.log.push(msg);
                state.index++;
                saveState(state);
                renderUI();

                let left = ms / 1000;
                const timer = setInterval(() => {
                    left--;
                    const m = Math.floor(left / 60);
                    const s = left % 60;
                    const t = `⏳ ${m}m ${s}s remaining until reload...`;
                    const s0 = loadState();
                    if (!s0 || !s0.active) return clearInterval(timer);
                    s0.log[s0.log.length - 1] = t;
                    saveState(s0);
                    updateLogOnly(t);
                    if (left <= 0) {
                        clearInterval(timer);
                        hardReload();
                    }
                }, 1000);
                return;
            }
            state.log.push(`🔄 State: ${current}. Forcing reload.`);
            state.index++;
            saveState(state);
            renderUI();
            hardReload();
            return;
        }

        // wait:10s / wait:1min
        const waitMatch = step.match(/^wait:(\d+(?:\.\d+)?)(s|min)$/i);
        if (waitMatch) {
            const amount = parseFloat(waitMatch[1]);
            const unit = waitMatch[2].toLowerCase();
            const ms = unit === "s" ? amount * 1000 : amount * 60000;
            state.log.push(`⏸ Waiting ${amount}${unit}`);
            state.index++;
            saveState(state);
            renderUI();

            let left = ms / 1000;
            const timer = setInterval(() => {
                left--;
                const m = Math.floor(left / 60);
                const s = left % 60;
                const txt = `⏳ ${m}m ${s}s remaining...`;
                const s0 = loadState();
                if (!s0 || !s0.active) return clearInterval(timer);
                s0.log[s0.log.length - 1] = txt;
                saveState(s0);
                updateLogOnly(txt);
                if (left <= 0) {
                    clearInterval(timer);
                    hardReload();
                }
            }, 1000);
            return;
        }

        // use:ItemName
        const useMatch = step.match(/^use:(.+?)(?:@(.+))?$/i);
        if (useMatch) {
            const name = useMatch[1].trim().toLowerCase();
            const loc = useMatch[2]?.trim().toLowerCase() || null;
            const row = [...document.querySelectorAll("tr.hoverable")].find(tr => {
                const a = tr.querySelector("a")?.textContent.trim().toLowerCase();
                const e = tr.querySelector("em")?.textContent.trim().toLowerCase();
                return a === name && (!loc || e === loc);
            });
            if (!row) {
                state.log.push(`❌ Use:${name}${loc ? "@"+loc : ""} (paused 🐰)`);
                state.active = false;
                saveState(state);
                renderUI();
                return;
            }
            const btn = row.querySelector("input[id*='btnUse']");
            if (btn) {
                state.log.push(`🔨 Use ${row.querySelector("a").textContent.trim()}`);
                state.index++;
                saveState(state);
                renderUI();
                btn.click();
                setTimeout(() => hardReload(), 2000); // Longer delay for iPad
                return;
            }
        }

        // repeat
        const rep = step.match(/^([A-Za-z]+)x(\d+)$/);
        if (rep) {
            const base = rep[1];
            const count = parseInt(rep[2]);
            state.log.push(`🔁 ${base} x${count}`);
            state.path.splice(state.index, 1, ...Array(count).fill(base));
            saveState(state);
            renderUI();
            performNext();
            return;
        }

        // movement
        const el = findDirEl(step);
        if (!el) {
            state.log.push(`❌ ${step} (paused 🐰)`);
            state.active = false;
            saveState(state);
            renderUI();
            alert(`Compass paused at "${step}". Make your move manually and press Resume`);
            return;
        }

        state.log.push(`>> ${step}`);
        state.index++;
        saveState(state);
        renderUI();

        const href = el.getAttribute("href");
        if (href && href.includes("/MoveTo/")) {
            window.location.href = href;
        } else {
            el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            await sleep(2000); // Longer delay for iPad
            performNext();
        }
    }

    function startCustomRoute(inp) {
        const path = inp.split(/[-,]+/).map(x=>x.trim()).filter(Boolean);
        if (!path.length) return alert("Enter a valid route");
        saveState({ active:true, index:0, path, log:[], timestamp:Date.now() });
        renderUI();
        setTimeout(() => performNext(), 500); // Delay start for iPad
    }

    function reverseRoute(inp) {
        const steps = inp.split(/[-,]+/).map(x=>x.trim()).filter(Boolean);
        const reversed = steps.reverse().map(step => {
            if (step.toUpperCase() === "WAIT") return step;
            if (step.match(/^wait:\d+(?:\.\d+)?(s|min)$/i)) return step;
            if (step.match(/^use:.+/i)) return step;
            if (step.match(/^[A-Za-z]+x\d+$/)) {
                const match = step.match(/^([A-Za-z]+)x(\d+)$/);
                const dir = reverseDirection(match[1]);
                return `${dir}x${match[2]}`;
            }
            return reverseDirection(step);
        });
        return reversed.join(' - ');
    }

    // ---------- UI FUNCTIONS ----------
    function updateLogOnly(text) {
        const logDiv = document.querySelector("#compass-log");
        if (logDiv) {
            const state = loadState();
            logDiv.textContent = state ? state.log.join("\n") : text;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }

    function injectStyles() {
        if (document.getElementById("compass-styles")) return;

        const style = document.createElement("style");
        style.id = "compass-styles";
        style.textContent = `
            #compass-ui * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }
            #compass-ui {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                position: fixed;
                bottom: 16px;
                right: 16px;
                background: linear-gradient(145deg, #0f0f10, #1a1a1a);
                color: #e6e6e6;
                padding: 12px;
                border: 1px solid #333;
                border-radius: 12px;
                font-size: 14px;
                z-index: 999999;
                width: 280px;
                box-shadow: 0 6px 18px rgba(0,0,0,.45);
                user-select: none;
                touch-action: none;
            }
            #compass-header {
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding: 4px;
                touch-action: none;
            }
            #compass-header span:first-child {
                font-weight: 600;
                font-size: 15px;
            }
            #compass-collapse {
                cursor: pointer;
                font-size: 18px;
                padding: 4px 8px;
                touch-action: manipulation;
            }
            #compass-container {
                margin-top: 8px;
            }
            #compass-controls {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin-bottom: 8px;
            }
            #compass-input {
                flex: 1;
                min-width: 100%;
                padding: 8px;
                border-radius: 8px;
                border: 1px solid #333;
                background: #121212;
                color: #e6e6e6;
                font-size: 14px;
                margin-bottom: 6px;
            }
            .compass-btn {
                padding: 8px 12px;
                border-radius: 8px;
                border: 0;
                cursor: pointer;
                font-size: 13px;
                background: #222;
                color: #eee;
                font-weight: 600;
                touch-action: manipulation;
                flex: 1;
                min-width: 70px;
            }
            .compass-btn:active {
                background: #333;
            }
            #compass-log {
                margin-top: 8px;
                max-height: 160px;
                overflow-y: auto;
                white-space: pre-wrap;
                background: #0b0b0b;
                border-radius: 8px;
                padding: 10px;
                font-size: 12px;
                border: 1px solid #222;
                color: #cfcfcf;
                -webkit-overflow-scrolling: touch;
            }
            #compass-log::-webkit-scrollbar {
                width: 8px;
            }
            #compass-log::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-radius: 10px;
            }
            #compass-log::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 10px;
                border: 2px solid #1a1a1a;
            }
        `;
        document.head.appendChild(style);
    }

    function renderUI() {
        injectStyles();

        let ui = document.getElementById("compass-ui");
        if (!ui) {
            ui = document.createElement("div");
            ui.id = "compass-ui";
            document.body.appendChild(ui);
        }

        const state = loadState();

        ui.innerHTML = `
            <div id="compass-header">
                <span>🧭 Compass Runner</span>
                <span id="compass-collapse">—</span>
            </div>
            <div id="compass-container">
                <div id="compass-controls">
                    <input type="text" id="compass-input" placeholder="E - S - WAIT - Use:Item" value="${state?.path ? state.path.join(' - ') : ''}">
                    <button class="compass-btn" id="btn-run">💫 Run</button>
                    <button class="compass-btn" id="btn-reverse">⇄</button>
                    <button class="compass-btn" id="btn-resume">Resume 🐰</button>
                    <button class="compass-btn" id="btn-reset">⟳</button>
                </div>
                <div id="compass-log">${state ? state.log.join("\n") : "Idle . . . ✨"}</div>
            </div>
        `;

        // Event Listeners
        const input = ui.querySelector("#compass-input");

        ui.querySelector("#btn-run").addEventListener("click", () => startCustomRoute(input.value));

        ui.querySelector("#btn-reverse").addEventListener("click", () => {
            input.value = reverseRoute(input.value);
        });

        ui.querySelector("#btn-resume").addEventListener("click", () => {
            const s = loadState();
            if (s && !s.active && s.index < s.path.length) {
                s.active = true;
                saveState(s);
                if (s.path[s.index]?.toUpperCase() === "WAIT" || s.path[s.index - 1]?.toUpperCase() === "WAIT") {
                    checkStateAndResume();
                } else performNext();
            } else alert("Nothing to resume");
        });

        ui.querySelector("#btn-reset").addEventListener("click", () => {
            clearState();
            renderUI();
        });

        // Collapse functionality
        const collapse = ui.querySelector("#compass-collapse");
        const container = ui.querySelector("#compass-container");
        const key = STORAGE_KEY + "_collapsed";
        const collapsed = localStorage.getItem(key) === "1";

        if (collapsed) {
            container.style.display = "none";
            collapse.textContent = "+";
        }

        collapse.addEventListener("click", () => {
            const hidden = container.style.display === "none";
            container.style.display = hidden ? "block" : "none";
            collapse.textContent = hidden ? "—" : "+";
            localStorage.setItem(key, hidden ? "0" : "1");
        });

        // Touch-friendly dragging
        const header = ui.querySelector("#compass-header");
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const handleStart = (e) => {
            if (e.target.id === "compass-collapse") return;

            isDragging = true;
            ui.style.transition = "none";

            const touch = e.touches ? e.touches[0] : e;
            const rect = ui.getBoundingClientRect();

            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            e.preventDefault();
        };

        const handleMove = (e) => {
            if (!isDragging) return;

            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            ui.style.left = `${startLeft + deltaX}px`;
            ui.style.top = `${startTop + deltaY}px`;
            ui.style.right = "auto";
            ui.style.bottom = "auto";

            e.preventDefault();
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            ui.style.transition = "";
        };

        header.addEventListener("touchstart", handleStart, { passive: false });
        header.addEventListener("mousedown", handleStart);
        document.addEventListener("touchmove", handleMove, { passive: false });
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("touchend", handleEnd);
        document.addEventListener("mouseup", handleEnd);

        // Auto-scroll log
        setTimeout(() => {
            const log = ui.querySelector("#compass-log");
            if (log) log.scrollTop = log.scrollHeight;
        }, 100);
    }

    // ---------- WATCHDOG ----------
    let watchdogTimer;
    function startWatchdog() {
        if (watchdogTimer) clearInterval(watchdogTimer);

        watchdogTimer = setInterval(() => {
            const ui = document.getElementById("compass-ui");
            if (!ui || !document.body.contains(ui)) {
                console.log("Compass UI missing, recreating...");
                renderUI();
            }
        }, WATCHDOG_INTERVAL_MS);
    }

    // ---------- INITIALIZATION ----------
    function initialize() {
        console.log("Compass Runner initializing for iPad Safari...");

        renderUI();
        startWatchdog();

        const state = loadState();
        if (state?.active) {
            setTimeout(() => {
                if (state.path[state.index - 1]?.toUpperCase() === "WAIT") {
                    checkStateAndResume();
                } else {
                    performNext();
                }
            }, 1000); // Longer delay for iPad
        }
    }

    // Wait for page to be fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        setTimeout(initialize, 500);
    }

})();