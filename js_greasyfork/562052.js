// ==UserScript==
// @name         VeyraPvPBot
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automated PvP bot with Power Slash priority, persistent state, randomized click delays, and HUD improvements
// @author       Woobs
// @match        https://demonicscans.org/pvp.php
// @match        https://demonicscans.org/pvp_battle.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562052/VeyraPvPBot.user.js
// @updateURL https://update.greasyfork.org/scripts/562052/VeyraPvPBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // Keyboard hotkeys
    // -------------------------------
    document.addEventListener("keydown", (e) => {
        // Start Matching (pvp.php)
        if (location.pathname === "/pvp.php" && e.key === "1") {
            const startPvPBtn = document.getElementById("btnStartTop");
            if (startPvPBtn) startPvPBtn.click();
            return;
        }

        // PvP Battle hotkeys
        if (location.pathname === "/pvp_battle.php") {
            // 2 → Return to PvP
            if (e.key === "2") {
                const backBtn = document.querySelector('a.btn[href="pvp.php"]');
                if (backBtn) backBtn.click();
                return;
            }

            const keyMap = { q:0, w:1, e:2, r:3, a:4, s:5, d:6 };
            const key = e.key.toLowerCase();
            if (!(key in keyMap)) return;

            const skills = document.querySelectorAll(".active-grid .active-card.attack-btn");
            const btn = skills[keyMap[key]];
            if (btn && !btn.disabled) {
                btn.click();
                console.log(`Skill used: ${btn.querySelector(".active-name")?.textContent}`);
            }
        }
    });

    // ===============================
    // Core Bot Object
    // ===============================
    const VeyraPvPBot = {
        state: {
            isRunning: false,
            isPaused: false,
            mode: "all",    // "all" or "x"
            xTokens: 1,     // only internal counter
            currentTokens: 0,
            maxTokens: 0
        },
        storageKey: "veyra_pvp_bot_state",

        loadSessionState() {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return;
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
                this.state.isPaused = false;
            } catch(e) { console.warn("Failed to load state", e); }
        },

        saveSessionState() {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        },

        // Read tokens from pvp.php DOM
        readTokensFromDOM() {
            if (location.pathname !== "/pvp.php") return false;

            const coinEl = document.getElementById("pvp-coins");
            if (!coinEl) return false;

            const current = parseInt(coinEl.textContent.replace(/,/g,''),10) || 0;

            let max = 0;
            const maxSpan = coinEl.nextElementSibling; // <span>/30</span>
            if (maxSpan) {
                const match = maxSpan.textContent.match(/\/(\d+)/);
                if (match) max = parseInt(match[1],10) || 0;
            }

            this.state.currentTokens = current;
            this.state.maxTokens = max;
            this.saveSessionState();
            return true;
        },

        async applyQuickSet(setNumber, type) {
            const body = `set_number=${setNumber}&target_set=attack&apply_type=${type}`;
            try {
                await fetch("https://demonicscans.org/quick_sets_apply.php", {
                    method: "POST",
                    headers: {
                        "accept": "*/*",
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    body: body,
                    credentials: "include"
                });
                console.log(`Applied ${type} set #${setNumber}`);
            } catch(e) { console.warn(`Failed to apply ${type} set #${setNumber}`, e); }
        },

        async applyPVPQuickSetsIfExist() {
            const pvpGearBtn = document.querySelector('.qs-set-btn.qs-set-eq[data-set-name="PVP"]');
            const pvpPetsBtn = document.querySelector('.qs-set-btn.qs-set-pets[data-set-name="PVP"]');
            if (pvpGearBtn) await this.applyQuickSet(2, "equipments");
            if (pvpPetsBtn) await this.applyQuickSet(2, "pets");
        },

        async applyDefaultQuickSets() {
            const defaultGearBtn = document.querySelector('.qs-set-btn.qs-set-eq[data-set-name="Default"]');
            const defaultPetsBtn = document.querySelector('.qs-set-btn.qs-set-pets[data-set-name="Default"]');
            if (defaultGearBtn) await this.applyQuickSet(1, "equipments");
            if (defaultPetsBtn) await this.applyQuickSet(1, "pets");
        },

        // Click loop inside battle
        startClickLoop() {
            if (location.pathname !== "/pvp_battle.php") return;

            const loop = async () => {
                while (this.state.isRunning) {
                    if (this.state.isPaused) {
                        await new Promise(r=>setTimeout(r,500));
                        continue;
                    }

                    // Read battle coins
                    let coins = 0;
                    const coinEl = document.getElementById("pvpCoinsSpan");
                    if (coinEl) coins = parseInt(coinEl.textContent.replace(/,/g,''),10) || 0;

                    // Select buttons
                    const btnPowerSlash = document.querySelector(".active-card.attack-btn.power");
                    const btnZeroCost = document.querySelector(".active-grid .active-card.attack-btn:first-child");
                    let clickedBtn = null;

                    if (btnPowerSlash && !btnPowerSlash.disabled && btnPowerSlash.offsetParent !== null && coins >= 9) {
                        clickedBtn = btnPowerSlash;
                    } else if (btnZeroCost && !btnZeroCost.disabled && btnZeroCost.offsetParent !== null) {
                        clickedBtn = btnZeroCost;
                    }

                    if (clickedBtn) {
                        clickedBtn.click();
                        console.log(`Clicked: ${clickedBtn.querySelector(".active-name")?.textContent} | Coins: ${coins}`);
                    }

                    await new Promise(r => setTimeout(r, 900 + Math.random()*700));

                    // Check battle end
                    const endModal = document.getElementById("endModal");
                    const endTitle = document.getElementById("endTitle");
                    const returnBtn = document.querySelector('a.btn[href="pvp.php"]');

                    if (
                        endModal &&
                        endModal.style.display !== "none" &&
                        endTitle &&
                        /Victory|Defeat/i.test(endTitle.textContent) &&
                        returnBtn &&
                        returnBtn.offsetParent !== null
                    ) {
                        // Battle finished
                        if (this.state.mode === "x") {
                            this.state.xTokens = Math.max(this.state.xTokens - 1, 0);
                        }

                        this.readTokensFromDOM();
                        this.saveSessionState();
                        this.updateHUDTokens();

                        returnBtn.click();
                        break;
                    }
                }
            };
            loop();
        },

        // Main bot loop
        async autoFarmLoop() {
            if (!this.state.isRunning) return;

            if (location.pathname === "/pvp.php") {
                this.readTokensFromDOM(); // updates currentTokens

                // Stop if no tokens left
                if (this.state.currentTokens <= 0) {
                    console.log("⚠️ No PvP tokens left, stopping bot and applying default sets");
                    this.state.isRunning = false;
                    this.state.isPaused = false;
                    this.saveSessionState();
                    updateHUDStopped();
                    await this.applyDefaultQuickSets();
                    return;
                }

                // Stop if X-token mode is finished
                if (this.state.mode === "x" && this.state.xTokens <= 0) {
                    console.log("✅ X tokens finished, stopping bot.");
                    this.state.isRunning = false;
                    this.saveSessionState();
                    updateHUDStopped();
                    await this.applyDefaultQuickSets();
                    return;
                }

                const startBtn = document.getElementById("btnStartTop");
                if (startBtn) startBtn.click();
                return;
            }

            if (location.pathname === "/pvp_battle.php") {
                this.startClickLoop();
            }
        },

        // HUD update
        updateHUDTokens() {
            const tokenDisplay = document.getElementById("hud-token-count");
            if (!tokenDisplay) return;

            // On pvp.php, always read current tokens from DOM
            if (location.pathname === "/pvp.php") {
                this.readTokensFromDOM();
            }

            const display = this.state.currentTokens;
            const max = this.state.maxTokens;

            tokenDisplay.textContent = `${display}/${max}`;
        }
    };

    // -------------------------------
    // HUD Setup
    // -------------------------------
    function createHUD() {
        const hud = document.createElement("div");
        hud.id = "veyra-hud";
        hud.style.cssText = `
            position: fixed;
            bottom: 10%;
            right: 10px;
            background: rgba(0,0,0,0.95);
            color: #00ff00;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #00ff00;
            z-index: 99999;
            min-width: 260px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            cursor: move;
            user-select: none;
        `;
        hud.innerHTML = `
            <div style="text-align:center; margin-bottom:8px; font-weight:bold; color:#ffff00;">
                🤖 VEYRA PvP BOT
            </div>
            <div style="margin-bottom:10px; padding:8px; background:rgba(255,255,255,0.1); border-radius:4px;">
                <label style="display:flex; align-items:center; margin-bottom:6px; cursor:pointer;">
                    <input type="radio" name="tokenMode" value="all" checked style="margin-right:6px;">
                    <span>Use All Tokens</span>
                </label>
                <label style="display:flex; align-items:center; margin-bottom:6px; cursor:pointer;">
                    <input type="radio" name="tokenMode" value="x" style="margin-right:6px;">
                    <span>Use X Tokens</span>
                </label>
                <div style="margin-top:6px;">
                    <label>X Value:</label>
                    <input id="x-token-input" type="number" min="1" value="1" disabled style="
                        width: 60px;
                        margin-left: 6px;
                        padding: 2px 4px;
                        background: rgba(0,0,0,0.5);
                        color: #00ff00;
                        border: 1px solid #00ff00;
                        border-radius: 3px;
                    ">
                </div>
            </div>
            <div style="text-align:center; margin-bottom:6px;">
                <div>⚔️ Tokens: <span id="hud-token-count">0/0</span></div>
            </div>
            <div style="text-align:center; margin-bottom:6px;">
                <button id="start-bot-btn" style="
                    padding: 8px 16px;
                    background: #00aa00;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                ">▶ START</button>
                <button id="pause-bot-btn" style="
                    display:none;
                    padding: 6px 12px;
                    background: #ffaa00;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 11px;
                    margin-left: 8px;
                ">⏸ PAUSE</button>
                <button id="stop-bot-btn" style="
                    display:none;
                    padding: 8px 16px;
                    background: #aa0000;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    margin-left: 8px;
                ">⏹ STOP</button>
            </div>
            <div id="hud-status" style="
                margin-top:8px;
                text-align:center;
                font-size:11px;
                color:#888;
            ">Idle</div>
        `;
        document.body.appendChild(hud);

        wireHUDToVeyraPvPBot();
        makeHUDDraggable(hud);

        // Update HUD tokens initially
        VeyraPvPBot.updateHUDTokens();
    }

    function wireHUDToVeyraPvPBot() {
        const radios = document.querySelectorAll('input[name="tokenMode"]');
        const xInput = document.getElementById("x-token-input");
        const startBtn = document.getElementById("start-bot-btn");
        const stopBtn = document.getElementById("stop-bot-btn");
        const pauseBtn = document.getElementById("pause-bot-btn");
        const status = document.getElementById("hud-status");

        // Load state into HUD
        radios.forEach(r => r.checked = r.value === VeyraPvPBot.state.mode);
        xInput.value = VeyraPvPBot.state.xTokens;
        xInput.disabled = VeyraPvPBot.state.mode !== "x";

        radios.forEach(radio => radio.addEventListener("change", () => {
            VeyraPvPBot.state.mode = radio.value;
            xInput.disabled = radio.value !== "x";
            VeyraPvPBot.saveSessionState();
        }));

        xInput.addEventListener("input", () => {
            VeyraPvPBot.state.xTokens = Math.max(1, parseInt(xInput.value,10)||1);
            VeyraPvPBot.saveSessionState();
        });

        startBtn.addEventListener("click", async () => {
            await VeyraPvPBot.applyPVPQuickSetsIfExist();
            VeyraPvPBot.state.isRunning = true;
            VeyraPvPBot.state.isPaused = false;
            VeyraPvPBot.saveSessionState();

            startBtn.style.display = "none";
            stopBtn.style.display = "inline-block";
            pauseBtn.style.display = "inline-block";
            status.textContent = "Running...";
            status.style.color = "#00ff00";

            VeyraPvPBot.autoFarmLoop();
        });

        pauseBtn.addEventListener("click", () => {
            VeyraPvPBot.state.isPaused = !VeyraPvPBot.state.isPaused;
            status.textContent = VeyraPvPBot.state.isPaused ? "Paused" : "Running...";
            status.style.color = VeyraPvPBot.state.isPaused ? "#ffaa00" : "#00ff00";
        });

        stopBtn.addEventListener("click", async () => {
            VeyraPvPBot.state.isRunning = false;
            VeyraPvPBot.state.isPaused = false;
            VeyraPvPBot.saveSessionState();

            startBtn.style.display = "inline-block";
            stopBtn.style.display = "none";
            pauseBtn.style.display = "none";
            status.textContent = "Stopped";
            status.style.color = "#ff5555";

            if (location.pathname === "/pvp.php") {
                await VeyraPvPBot.applyDefaultQuickSets();
            }

            VeyraPvPBot.updateHUDTokens();
        });
    }

    function updateHUDStopped() {
        const startBtn = document.getElementById("start-bot-btn");
        const stopBtn = document.getElementById("stop-bot-btn");
        const pauseBtn = document.getElementById("pause-bot-btn");
        const status = document.getElementById("hud-status");

        startBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
        pauseBtn.style.display = "none";
        status.textContent = "Stopped";
        status.style.color = "#ff5555";

        VeyraPvPBot.updateHUDTokens();
    }

    function makeHUDDraggable(hud) {
        let isDragging = false, offsetX=0, offsetY=0;
        hud.addEventListener("mousedown", e=>{
            isDragging = true;
            offsetX = e.clientX - hud.offsetLeft;
            offsetY = e.clientY - hud.offsetTop;
        });
        document.addEventListener("mousemove", e=>{
            if(!isDragging) return;
            hud.style.left = `${e.clientX-offsetX}px`;
            hud.style.top = `${e.clientY-offsetY}px`;
            hud.style.right="auto";
            hud.style.bottom="auto";
        });
        document.addEventListener("mouseup", ()=>{isDragging=false;});
    }

    // -------------------------------
    // Initialize
    // -------------------------------
    VeyraPvPBot.loadSessionState();
    createHUD();

    if (VeyraPvPBot.state.isRunning) {
        const startBtn = document.getElementById("start-bot-btn");
        const stopBtn = document.getElementById("stop-bot-btn");
        const pauseBtn = document.getElementById("pause-bot-btn");
        const status = document.getElementById("hud-status");

        startBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
        pauseBtn.style.display = "inline-block";
        status.textContent = VeyraPvPBot.state.isPaused ? "Paused" : "Running...";
        status.style.color = VeyraPvPBot.state.isPaused ? "#ffaa00" : "#00ff00";

        VeyraPvPBot.autoFarmLoop();
    }

})();