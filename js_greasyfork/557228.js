// ==UserScript==
// @name         🧭 Compass Route Runner (Dark Edition) - Persistent UI
// @namespace    http://tampermonkey.net/
// @version      3.2.2
// @description  Fires custom Compass routes with persistent UI - Minimal recreation
// @author       anon
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale/Compass*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557228/%F0%9F%A7%AD%20Compass%20Route%20Runner%20%28Dark%20Edition%29%20-%20Persistent%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/557228/%F0%9F%A7%AD%20Compass%20Route%20Runner%20%28Dark%20Edition%29%20-%20Persistent%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CONFIGURATION ----------
    const STORAGE_KEY = "compass_route_state";
    const UI_POSITION_KEY = "compass_ui_position";
    const WAIT_CHECK_TIME_MS = 1 * 60 * 1000; // 1 minute check time

    // ---------- STATE MANAGEMENT ----------
    const GM_AVAILABLE = typeof GM_getValue !== 'undefined';

    const saveState = (state) => {
        if (GM_AVAILABLE) {
            GM_setValue(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    };

    const loadState = () => {
        if (GM_AVAILABLE) {
            const data = GM_getValue(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } else {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        }
    };

    const clearState = () => {
        if (GM_AVAILABLE) {
            GM_deleteValue(STORAGE_KEY);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const saveUIPosition = (x, y) => {
        if (GM_AVAILABLE) {
            GM_setValue(UI_POSITION_KEY, JSON.stringify({ x, y }));
        } else {
            localStorage.setItem(UI_POSITION_KEY, JSON.stringify({ x, y }));
        }
    };

    const loadUIPosition = () => {
        if (GM_AVAILABLE) {
            const data = GM_getValue(UI_POSITION_KEY);
            return data ? JSON.parse(data) : { x: null, y: null };
        } else {
            return JSON.parse(localStorage.getItem(UI_POSITION_KEY) || '{"x":null,"y":null}');
        }
    };

    // ---------- UTILITY FUNCTIONS ----------
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const hardReload = () => {
        window.location.replace(window.location.href);
    };

    function getCurrentState() {
        const stateRow = [...document.querySelectorAll('.box table tr')]
            .find(tr => tr.querySelector('td:first-child')?.textContent.trim() === "State");
        return stateRow?.querySelector('td:last-child')?.textContent.trim() || null;
    }

    // Function to check state and resume, needed for the old WAIT logic
    function checkStateAndResume() {
        const state = loadState();
        if (!state || !state.active) return;
        if (state.path[state.index - 1]?.toUpperCase() !== "WAIT") return;

        const current = getCurrentState();
        if (current === "Normal") {
            state.log.push(`✅ State Normal. Resuming.`);
            saveState(state);
            updateUI();
            performNext();
            return;
        }
        if (current === "Exploring") {
            state.active = true;
            state.index--;
            saveState(state);
            updateUI();
            performNext();
            return;
        }
        state.log.push(`⚠️ Unexpected State: ${current}. Proceeding.`);
        saveState(state);
        updateUI();
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

    // ---------- CORE LOGIC ----------
    let isPerformingAction = false;

    async function performNext() {
        if (isPerformingAction) return;
        isPerformingAction = true;

        try {
            const state = loadState();
            if (!state || !state.active) {
                isPerformingAction = false;
                return;
            }

            if (state.index >= state.path.length) {
                state.active = false;
                state.log.push("✅ Route complete");
                saveState(state);
                updateUI();
                isPerformingAction = false;
                return;
            }

            const step = state.path[state.index];

            // **START OLD WAIT LOGIC INTEGRATION**
            // WAIT (Exploring)
            if (step.toUpperCase() === "WAIT") {
                const current = getCurrentState();
                if (current === "Exploring") {
                    const ms = WAIT_CHECK_TIME_MS;
                    const msg = `⏳ Waiting ${ms/60000} min then reload...`;
                    // Update log message in state
                    state.log[state.log.length - 1]?.startsWith("⏳ ")
                        ? state.log[state.log.length - 1] = msg
                        : state.log.push(msg);
                    state.index++;
                    saveState(state);
                    updateUI(); // Full UI update before starting timer

                    let left = ms / 1000;
                    const timer = setInterval(() => {
                        left--;
                        const m = Math.floor(left / 60);
                        const s = left % 60;
                        const t = `⏳ ${m}m ${s}s remaining until reload...`;
                        const s0 = loadState();
                        if (!s0 || !s0.active) {
                            clearInterval(timer);
                            return;
                        }
                        // Update log message in state
                        s0.log[s0.log.length - 1] = t;
                        saveState(s0);
                        // Update only the log text without full re-render
                        updateLog(t);
                        if (left <= 0) {
                            clearInterval(timer);
                            hardReload();
                        }
                    }, 1000);
                    isPerformingAction = false;
                    return;
                }
                state.log.push(`🔄 State: ${current}. Forcing reload.`);
                state.index++;
                saveState(state);
                updateUI();
                hardReload();
                return;
            }
            // **END OLD WAIT LOGIC INTEGRATION**

            // wait:10s / wait:1min (This is the timed wait, kept unchanged)
            const waitMatch = step.match(/^wait:(\d+(?:\.\d+)?)(s|min)$/i);
            if (waitMatch) {
                const amount = parseFloat(waitMatch[1]);
                const unit = waitMatch[2].toLowerCase();
                const ms = unit === "s" ? amount * 1000 : amount * 60000;
                state.log.push(`⏸ Waiting ${amount}${unit}`);
                state.index++;
                saveState(state);
                updateUI();

                let left = ms / 1000;
                const timer = setInterval(() => {
                    left--;
                    const m = Math.floor(left / 60);
                    const s = left % 60;
                    const txt = `⏳ ${m}m ${s}s remaining...`;
                    const s0 = loadState();
                    if (!s0 || !s0.active) {
                        clearInterval(timer);
                        return;
                    }
                    s0.log[s0.log.length - 1] = txt;
                    saveState(s0);
                    updateLog(txt);
                    if (left <= 0) {
                        clearInterval(timer);
                        hardReload();
                    }
                }, 1000);
                isPerformingAction = false;
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
                    updateUI();
                    isPerformingAction = false;
                    return;
                }
                const btn = row.querySelector("input[id*='btnUse']");
                if (btn) {
                    state.log.push(`🔨 Use ${row.querySelector("a").textContent.trim()}`);
                    state.index++;
                    saveState(state);
                    updateUI();

                    // Fade out UI before navigation
                    const ui = document.getElementById("compass-ui");
                    if (ui) {
                        ui.style.opacity = "0.7";
                    }

                    btn.click();
                    setTimeout(() => hardReload(), 2000);
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
                updateUI();
                isPerformingAction = false;
                setTimeout(performNext, 100);
                return;
            }

            // movement
            const el = findDirEl(step);
            if (!el) {
                state.log.push(`❌ ${step} (paused 🐰)`);
                state.active = false;
                saveState(state);
                updateUI();
                alert(`Compass paused at "${step}". Make your move manually and press Resume`);
                isPerformingAction = false;
                return;
            }

            state.log.push(`>> ${step}`);
            state.index++;
            saveState(state);
            updateUI();

            const href = el.getAttribute("href");
            if (href && href.includes("/MoveTo/")) {
                // Fade out before navigation
                const ui = document.getElementById("compass-ui");
                if (ui) {
                    ui.style.opacity = "0.7";
                    ui.style.transition = "opacity 0.2s";
                }

                // Small delay to show fade effect
                setTimeout(() => {
                    window.location.href = href;
                }, 150);
            } else {
                el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                setTimeout(() => {
                    isPerformingAction = false;
                    performNext();
                }, 1200);
            }
        } catch (error) {
            console.error("Compass error:", error);
            isPerformingAction = false;
        }
    }

    function startCustomRoute(inp) {
        const path = inp.split(/[-,]+/).map(x=>x.trim()).filter(Boolean);
        if (!path.length) return alert("Enter a valid route");
        saveState({ active:true, index:0, path, log:[], timestamp:Date.now() });
        updateUI();
        setTimeout(() => performNext(), 300);
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

    // ---------- UI MANAGEMENT ----------
    function updateLog(text) {
        const logDiv = document.querySelector("#compass-log");
        if (logDiv) {
            const state = loadState();
            logDiv.textContent = state ? state.log.join("\n") : text;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }

    function updateUI() {
        const ui = document.getElementById("compass-ui");
        if (!ui) return;

        const state = loadState();

        // Update only what's necessary
        const input = ui.querySelector("#compass-input");
        const log = ui.querySelector("#compass-log");

        if (input && input.value !== state?.path?.join(' - ')) {
            input.value = state?.path ? state.path.join(' - ') : '';
        }

        if (log) {
            const newLog = state ? state.log.join("\n") : "Idle . . .";
            if (log.textContent !== newLog) {
                log.textContent = newLog;
                log.scrollTop = log.scrollHeight;
            }
        }

        // Update button states
        const resumeBtn = ui.querySelector("#btn-resume");
        if (resumeBtn) {
            const s = loadState();
            resumeBtn.disabled = !(s && !s.active && s.index < s.path.length);
        }
    }

    function setupEventListeners(ui) {
        // Only set up listeners once
        if (ui.dataset.listenersSetup) return;
        ui.dataset.listenersSetup = "true";

        ui.querySelector("#btn-run").addEventListener("click", () => {
            const input = ui.querySelector("#compass-input");
            startCustomRoute(input.value);
        });

        ui.querySelector("#btn-reverse").addEventListener("click", () => {
            const input = ui.querySelector("#compass-input");
            input.value = reverseRoute(input.value);
        });

        ui.querySelector("#btn-resume").addEventListener("click", () => {
            const s = loadState();
            if (s && !s.active && s.index < s.path.length) {
                s.active = true;
                saveState(s);
                if (s.path[s.index]?.toUpperCase() === "WAIT" || s.path[s.index - 1]?.toUpperCase() === "WAIT") {
                    // Use the adapted checkStateAndResume for safety
                    checkStateAndResume();
                } else {
                    performNext();
                }
            } else {
                alert("Nothing to resume");
            }
        });

        ui.querySelector("#btn-reset").addEventListener("click", () => {
            clearState();
            updateUI();
        });

        // Collapse functionality
        const collapse = ui.querySelector("#compass-collapse");
        const container = ui.querySelector("#compass-container");
        const COLLAPSE_KEY = STORAGE_KEY + "_collapsed";

        // Load collapsed state
        const collapsed = GM_AVAILABLE ?
            GM_getValue(COLLAPSE_KEY, "0") === "1" :
            localStorage.getItem(COLLAPSE_KEY) === "1";

        if (collapsed) {
            container.style.display = "none";
            collapse.textContent = "+";
        }

        collapse.addEventListener("click", () => {
            const hidden = container.style.display === "none";
            container.style.display = hidden ? "block" : "none";
            collapse.textContent = hidden ? "—" : "+";
            const value = hidden ? "0" : "1";
            if (GM_AVAILABLE) {
                GM_setValue(COLLAPSE_KEY, value);
            } else {
                localStorage.setItem(COLLAPSE_KEY, value);
            }
        });

        // Setup dragging
        setupDragging(ui);
    }

    function setupDragging(ui) {
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
            ui.style.transition = "opacity 0.3s";

            // Save position
            const rect = ui.getBoundingClientRect();
            saveUIPosition(rect.left, rect.top);
        };

        header.addEventListener("touchstart", handleStart, { passive: false });
        header.addEventListener("mousedown", handleStart);
        document.addEventListener("touchmove", handleMove, { passive: false });
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("touchend", handleEnd);
        document.addEventListener("mouseup", handleEnd);
    }

    // ---------- STYLES ----------
    function injectStyles() {
        if (document.getElementById("compass-styles")) return;

        const css = `
            #compass-ui * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }
            #compass-ui {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                position: fixed;
                bottom: 12px;
                right: 12px;
                background: linear-gradient(145deg, #0f0f10, #1a1a1a);
                color: #e6e6e6;
                padding: 10px;
                border: 1px solid #333;
                border-radius: 10px;
                font-size: 13px;
                z-index: 999999;
                width: 230px;
                box-shadow: 0 4px 12px rgba(0,0,0,.45);
                user-select: none;
                touch-action: none;
                will-change: transform, opacity;
            }
            #compass-header {
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                padding: 3px;
                touch-action: none;
                font-size: 14px;
            }
            #compass-header span:first-child {
                font-weight: 600;
            }
            #compass-collapse {
                cursor: pointer;
                font-size: 16px;
                padding: 2px 6px;
                touch-action: manipulation;
                line-height: 1;
            }
            #compass-container {
                margin-top: 6px;
            }
            #compass-controls {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                margin-bottom: 6px;
            }
            #compass-input {
                flex: 1;
                min-width: 100%;
                padding: 6px 8px;
                border-radius: 6px;
                border: 1px solid #333;
                background: #121212;
                color: #e6e6e6;
                font-size: 13px;
                margin-bottom: 5px;
            }
            .compass-btn {
                padding: 6px 8px;
                border-radius: 6px;
                border: 0;
                cursor: pointer;
                font-size: 12px;
                background: #222;
                color: #eee;
                font-weight: 600;
                touch-action: manipulation;
                flex: 1;
                min-width: 60px;
                transition: background 0.2s, opacity 0.2s;
            }
            .compass-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .compass-btn:active:not(:disabled) {
                background: #333;
            }
            #compass-log {
                margin-top: 6px;
                max-height: 120px;
                overflow-y: auto;
                white-space: pre-wrap;
                background: #0b0b0b;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                border: 1px solid #222;
                color: #cfcfcf;
                -webkit-overflow-scrolling: touch;
                line-height: 1.3;
            }
            #compass-log::-webkit-scrollbar {
                width: 6px;
            }
            #compass-log::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-radius: 8px;
            }
            #compass-log::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 8px;
                border: 2px solid #1a1a1a;
            }
        `;

        const style = document.createElement("style");
        style.id = "compass-styles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ---------- UI CREATION ----------
    function createUI() {
        // Check if UI already exists
        let ui = document.getElementById("compass-ui");
        if (ui) {
            // UI exists, just update it
            updateUI();
            return ui;
        }

        // Create new UI
        ui = document.createElement("div");
        ui.id = "compass-ui";
        ui.style.opacity = "0";
        ui.style.transition = "opacity 0.3s";

        const state = loadState();
        const pos = loadUIPosition();

        ui.innerHTML = `
            <div id="compass-header">
                <span>🧭 Compass</span>
                <span id="compass-collapse">—</span>
            </div>
            <div id="compass-container">
                <div id="compass-controls">
                    <input type="text" id="compass-input" placeholder="E - S - WAIT - Use:Item" value="${state?.path ? state.path.join(' - ') : ''}">
                    <button class="compass-btn" id="btn-run">Run</button>
                    <button class="compass-btn" id="btn-reverse">⇄</button>
                    <button class="compass-btn" id="btn-resume">Resume</button>
                    <button class="compass-btn" id="btn-reset">⟳</button>
                </div>
                <div id="compass-log">${state ? state.log.join("\n") : "Idle . . ."}</div>
            </div>
        `;

        document.body.appendChild(ui);

        // Restore position
        if (pos.x !== null && pos.y !== null) {
            ui.style.left = `${pos.x}px`;
            ui.style.top = `${pos.y}px`;
            ui.style.right = "auto";
            ui.style.bottom = "auto";
        }

        // Setup event listeners
        setupEventListeners(ui);

        // Fade in
        setTimeout(() => {
            ui.style.opacity = "1";
        }, 50);

        return ui;
    }

    // ---------- INITIALIZATION ----------
    function initialize() {
        console.log("Compass Runner initializing...");

        // Inject styles once
        injectStyles();

        // Create or update UI
        createUI();

        // Check if we should resume
        const state = loadState();
        if (state?.active) {
            setTimeout(() => {
                // Check if the *previous* step was WAIT (meaning we just reloaded after a WAIT)
                if (state.path[state.index - 1]?.toUpperCase() === "WAIT") {
                    checkStateAndResume();
                } else {
                    performNext();
                }
            }, 530);
        }
    }

    // Start when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        // Small delay to ensure everything is loaded
        setTimeout(initialize, 100);
    }

})();