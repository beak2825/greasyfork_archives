// ==UserScript==
// @name         BetFury Dice Bot -Uriel MODE V19 (ULTRA REFRESH)
// @version      19.0
// @description  Ratio 0.01/80 | Seed Auto-Switch 2 Wins | Hacker UI | 32.67%
// @match        https://betfury.com/*/casino/games/dice*
// @match        https://betfury.io/*/casino/games/dice*
// @grant        none
// @namespace https://greasyfork.org/users/1550232
// @downloadURL https://update.greasyfork.org/scripts/559881/BetFury%20Dice%20Bot%20-Uriel%20MODE%20V19%20%28ULTRA%20REFRESH%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559881/BetFury%20Dice%20Bot%20-Uriel%20MODE%20V19%20%28ULTRA%20REFRESH%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FB_CONFIG = {
        apiKey: "AIzaSyDCsWH3UZDLDBj2DgnMdBz0fcFsNxJih-U",
        projectId: "hack-1b404"
    };

    // --- CONFIGURATION DES CONDITIONS ---
    const BET_RATIO = 0.000125;   // Mise 0.01 pour 80
    const TARGET_CHANCE = 32.67;  // Win Chance fixe
    const LOSS_INCREASE = 1.5;    // Augmentation 50% après perte
    const SWITCH_LIMIT = 3;       // Switch Over/Under après 3 pertes
    const WIN_LIMIT_STOP = 2;     // CHANGEMENT : Refresh/Seed après 2 gains (Condition demandée)

    let isRunning = false;
    let isLicensed = false;
    let winCount = 0;
    let lossCount = 0;
    let currentBet = 0;
    let lastBalance = 0;
    let currentDirection = 'under';
    let seedCounter = parseInt(localStorage.getItem('bot_seed_total')) || 0;

    // --- SYSTÈME DE LICENCE ---
    async function verifyLicense(key) {
        if (!key) return false;
        const url = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/licences/${key.trim()}?key=${FB_CONFIG.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return !!(data.fields && data.fields.actif && data.fields.actif.booleanValue === true);
        } catch (e) { return false; }
    }

    function getBalance() {
        const el = document.querySelector('span.currency span span');
        return el ? parseFloat(el.innerText.replace(/,/g, '')) : 0;
    }

    function addHackerLog(msg) {
        const stream = document.getElementById("hacker-stream");
        if (stream) {
            const line = document.createElement('div');
            line.style = "color: #0f0; font-size: 9px; text-shadow: 0 0 5px #0f0; margin-bottom: 2px; font-family: monospace;";
            line.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            stream.prepend(line);
            if (stream.childNodes.length > 25) stream.removeChild(stream.lastChild);
        }
    }

    // --- LOGIQUE DE CHANGEMENT DE SEED ---
    async function changeSeed() {
        addHackerLog("INIT_SEED_REGENERATION...");
        try {
            const fairBtn = document.querySelector('div.dapps-top__buttons > div:nth-child(3) span') || document.querySelector('.icon-fairness')?.parentElement;
            if (fairBtn) {
                fairBtn.click();
                await new Promise(r => setTimeout(r, 1500));
                const updateBtn = document.querySelector('button.variant-primary span') || document.querySelector('button.variant-primary');
                if (updateBtn) {
                    updateBtn.click();
                    seedCounter++;
                    localStorage.setItem('bot_seed_total', seedCounter);
                    addHackerLog("SEED_INJECTED_SUCCESSFULLY");
                    await new Promise(r => setTimeout(r, 1000));
                }
                const closeBtn = document.querySelector('.modal__close') || document.querySelector('.v-overlay__scrim');
                if (closeBtn) closeBtn.click();
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (e) {
            addHackerLog("SEED_ERROR: BYPASS_FAILED");
        }
    }

    function applyDiceStrategy() {
        const amountInput = document.querySelector('.amount__center input');
        if (amountInput) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            setter.call(amountInput, currentBet.toFixed(8));
            amountInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const sliderEl = document.querySelector('.noUi-target');
        if (sliderEl && sliderEl.noUiSlider) {
            const val = (currentDirection === 'under') ? TARGET_CHANCE : (100 - TARGET_CHANCE);
            sliderEl.noUiSlider.set(val);
        }
    }

    function toggleDirection() {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.toLowerCase().includes('roll') || b.innerText.toLowerCase().includes('rouler'));
        if (btns.length >= 2) {
            if (currentDirection === 'under') { btns[1].click(); currentDirection = 'over'; }
            else { btns[0].click(); currentDirection = 'under'; }
            addHackerLog(`DIRECTION_SWAP: ${currentDirection.toUpperCase()}`);
        }
    }

    async function runBot() {
        if (!isLicensed) return;
        isRunning = true;
        winCount = 0;
        lossCount = 0;
        lastBalance = getBalance();
        currentBet = lastBalance * BET_RATIO;

        document.getElementById("main-btn").innerText = "TERMINATE_HACK";
        document.getElementById("main-btn").style.border = "1px solid #f00";
        document.getElementById("main-btn").style.color = "#f00";

        while (isRunning) {
            applyDiceStrategy();
            const rollBtn = document.querySelector('button[type="submit"]');
            if (!rollBtn || rollBtn.disabled) { await new Promise(r => setTimeout(r, 500)); continue; }

            rollBtn.click();
            addHackerLog(`ATTACKING_SERVER...`);
            await new Promise(r => setTimeout(r, 2600));

            let newBal = getBalance();
            if (newBal > lastBalance) {
                winCount++;
                lossCount = 0;
                currentBet = newBal * BET_RATIO;
                addHackerLog(`WIN_DETECTED: [${winCount}/${WIN_LIMIT_STOP}]`);

                if (winCount >= WIN_LIMIT_STOP) { // Rafraîchissement tous les 2 gains
                    addHackerLog("TARGET_REACHED: REBOOTING...");
                    localStorage.setItem('bot_auto_run', 'true');
                    await changeSeed();
                    location.reload();
                    return;
                }
            } else if (newBal < lastBalance) {
                winCount = 0;
                lossCount++;
                currentBet = currentBet * LOSS_INCREASE;
                addHackerLog(`LOSS_STREAK: [${lossCount}/3]`);

                if (lossCount % SWITCH_LIMIT === 0) {
                    toggleDirection();
                }
            }
            lastBalance = newBal;
            await new Promise(r => setTimeout(r, 700));
        }
    }

    function drawUI() {
        const key = localStorage.getItem('bf_key');
        if (!key) {
            const auth = document.createElement('div');
            auth.style = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;border:2px solid #0f0;padding:25px;z-index:10001;color:#0f0;font-family:monospace;box-shadow:0 0 30px #0f0;text-align:center;";
            auth.innerHTML = `<h2 style="margin:0 0 15px 0;">SYSTEM LOCK</h2><input id="k-in" type="text" placeholder="AUTH_KEY" style="background:#000;color:#0f0;border:1px solid #0f0;padding:8px;width:200px;text-align:center;"><br><br><button id="v-btn" style="width:100%;background:#0f0;color:#000;border:none;cursor:pointer;padding:10px;font-weight:bold;">DECRYPT</button>`;
            document.body.appendChild(auth);
            document.getElementById("v-btn").onclick = async () => {
                if (await verifyLicense(document.getElementById('k-in').value)) {
                    localStorage.setItem('bf_key', document.getElementById('k-in').value);
                    location.reload();
                } else alert("INVALID_KEY");
            };
            return;
        }

        verifyLicense(key).then(ok => {
            if (!ok) { localStorage.removeItem('bf_key'); return; }
            isLicensed = true;

            const leftTerm = document.createElement('div');
            leftTerm.style = "position:fixed;top:100px;left:20px;z-index:10000;background:rgba(0,0,0,0.9);border:1px solid #0f0;padding:12px;width:280px;height:400px;font-family:monospace;box-shadow:0 0 20px rgba(0,255,0,0.3);overflow:hidden;";
            leftTerm.innerHTML = `
                <div style="color:#0f0; font-weight:bold; border-bottom:1px solid #0f0; margin-bottom:10px; font-size:12px; text-shadow:0 0 5px #0f0;">> INTRUSION_CONSOLE_V19</div>
                <div id="hacker-stream" style="height:320px; overflow:hidden; color:#0f0;"></div>
                <div style="border-top:1px solid #0f0; margin-top:8px; font-size:11px; color:#fff;">
                    TOTAL_SEEDS: <span id="seed-count-val" style="color:#0f0; font-weight:bold;">${seedCounter}</span>
                </div>
            `;
            document.body.appendChild(leftTerm);

            const rightTerm = document.createElement('div');
            rightTerm.style = "position:fixed;bottom:20px;right:20px;z-index:10000;background:#000;border:2px solid #f00;padding:15px;width:260px;font-family:monospace;box-shadow:0 0 20px rgba(255,0,0,0.4);";
            rightTerm.innerHTML = `
                <div id="bal-d" style="color:#f00; font-size:15px; margin-bottom:5px; font-weight:bold; text-shadow:0 0 5px #f00;">BAL: 0.00000000</div>
                <div style="color:#666; font-size:10px; margin-bottom:15px;">REFRESH: EVERY 2 WINS<br>CHANCE: 32.67%</div>
                <button id="main-btn" style="width:100%;background:transparent;border:1px solid #0f0;color:#0f0;padding:12px;cursor:pointer;font-weight:bold;text-transform:uppercase;">Execute_Exploit</button>
            `;
            document.body.appendChild(rightTerm);

            document.getElementById("main-btn").onclick = () => {
                if(isRunning) location.reload();
                else runBot();
            };

            setInterval(() => {
                const b = document.getElementById("bal-d");
                if(b) b.innerText = "BAL: " + getBalance().toFixed(8);
            }, 1000);

            if (localStorage.getItem('bot_auto_run') === 'true') {
                localStorage.setItem('bot_auto_run', 'false');
                setTimeout(runBot, 5000);
            }
        });
    }

    setTimeout(drawUI, 4000);
})();
