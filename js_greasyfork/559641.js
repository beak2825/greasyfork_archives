// ==UserScript==
// @name         BetFury Christmas Master V51.5 - Intégral Seed + Refresh
// @namespace    http://tampermonkey.net/
// @version      51.5.14
// @description  Bot avec Changement de Seed + Auto-Actualisation Fin de Cycle
// @author       Gemini
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559641/BetFury%20Christmas%20Master%20V515%20-%20Int%C3%A9gral%20Seed%20%2B%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/559641/BetFury%20Christmas%20Master%20V515%20-%20Int%C3%A9gral%20Seed%20%2B%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const FB_CONFIG = { apiKey: "AIzaSyDCsWH3UZDLDBj2DgnMdBz0fcFsNxJih-U", projectId: "hack-1b404" };
    let isBotRunning = localStorage.getItem('bf_bot_active') === 'true';
    let seedCount = parseInt(localStorage.getItem('bf_seed_count')) || 0;
    let lastStatus = "IDLE";
    let lastActionTime = Date.now();
    window.seedResetDone = false;
    let isResettingSeed = false;

    // --- STYLES ---
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #bf-ui { position: fixed; top: 10px; left: 10px; z-index: 10000; background: linear-gradient(135deg, #1a0000, #000); border: 2px solid #ff0040; padding: 15px; border-radius: 12px; color: white; width: 220px; font-family: sans-serif; box-shadow: 0 0 20px rgba(255,0,64,0.5); }
            .btn-toggle { width: 100%; padding: 10px; cursor: pointer; font-weight: bold; border-radius: 5px; border: none; margin-top: 10px; }
            .active { background: #ffd700; color: #000; }
            .inactive { background: #ff0040; color: #fff; }
            .stat-row { font-size: 11px; margin: 5px 0; display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 2px; }
            .seed-display { color: #00d4ff; font-weight: bold; }
        `;
        document.head.appendChild(style);
    };

    // --- FONCTION CHANGEMENT SEED ---
    async function resetSeed() {
        if (isResettingSeed) return;
        isResettingSeed = true;
        console.log("🎲 Changement de Seed en cours...");
        
        try {
            const fairnessBtn = document.querySelector('svg use[href*="fairness"]')?.parentElement?.parentElement || 
                               document.querySelector('.fairness-button');
            if (fairnessBtn) {
                fairnessBtn.click();
                await new Promise(r => setTimeout(r, 1500));
                const updateBtn = document.querySelector('svg use[href*="update"]')?.parentElement?.parentElement || 
                                 [...document.querySelectorAll('button')].find(b => b.innerText.includes('Update') || b.innerText.includes('Changer'));
                
                if (updateBtn) {
                    updateBtn.click();
                    seedCount++;
                    localStorage.setItem('bf_seed_count', seedCount);
                    if(document.getElementById('seed-val')) document.getElementById('seed-val').innerText = seedCount;
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
            // Fermer la modale
            const closeBtn = document.querySelector('.modal-close, [class*="close"]');
            if (closeBtn) closeBtn.click();
        } catch (e) { console.error("Erreur Seed:", e); }

        window.seedResetDone = true;
        isResettingSeed = false;
    }

    // --- SCANNER PRINCIPAL ---
    function scan() {
        if (!isBotRunning) return;

        // 1. Bouton de jeu
        const allButtons = Array.from(document.querySelectorAll('button'));
        const playBtn = allButtons.find(b => {
            const txt = b.innerText.toUpperCase();
            return (txt.includes("BET") || txt.includes("START") || txt.includes("COMMENCER") || txt.includes("STOP") || txt.includes("ARRÊT")) 
                   && !b.id.includes("bf-");
        });

        if (playBtn) {
            const btnText = playBtn.innerText.toUpperCase();
            const isPlaying = btnText.includes("STOP") || btnText.includes("ARRÊT") || btnText.includes("TAKE");
            const isReady = !isPlaying && (btnText.includes("BET") || btnText.includes("START") || btnText.includes("COMMENCER"));

            // --- FONCTION AUTO-ACTUALISATION ---
            if (lastStatus === "PLAYING" && isReady) {
                console.log("🔄 Cycle terminé. Refreshing...");
                location.reload();
                return;
            }

            // Mise à jour de l'état
            if (isPlaying) {
                lastStatus = "PLAYING";
                lastActionTime = Date.now();
            } else if (isReady) {
                lastStatus = "READY";

                // --- GESTION SEED AVANT DE JOUER ---
                if (!window.seedResetDone) {
                    resetSeed();
                    return;
                }

                // Mise à jour de la mise
                const input = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
                if (input) {
                    const val = document.getElementById('bf-bet-val').value;
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    setter.call(input, val);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Clic sur jouer
                setTimeout(() => {
                    if (isBotRunning && !isResettingSeed) playBtn.click();
                }, 500);
            }
        }

        // Sécurité inactivité
        if (isBotRunning && (Date.now() - lastActionTime > 12000)) {
            location.reload();
        }
    }

    // --- INTERFACE ---
    function launchUI() {
        injectStyles();
        const ui = document.createElement('div');
        ui.id = "bf-ui";
        ui.innerHTML = `
            <div style="text-align:center; font-weight:bold; color:#ffd700;">🎄 BF MASTER V51.5 🎅</div>
            <div style="margin:10px 0;">
                <div class="stat-row"><span>Seeds Changées:</span> <span id="seed-val" class="seed-display">${seedCount}</span></div>
                <div class="stat-row"><span>Status:</span> <span>${isBotRunning ? 'RUNNING' : 'STOPPED'}</span></div>
            </div>
            <input type="text" id="bf-bet-val" style="width:100%; margin-bottom:10px; text-align:center; background:#000; color:#0f0; border:1px solid #333;" value="0.00000100">
            <button id="bf-toggle" class="btn-toggle ${isBotRunning ? 'active' : 'inactive'}">
                ${isBotRunning ? 'STOP BOT 🛑' : 'START BOT 🎁'}
            </button>
            <button id="bf-reset-seed" style="width:100%; margin-top:5px; font-size:10px; cursor:pointer;">Réinitialiser Compteur</button>
        `;
        document.body.appendChild(ui);

        document.getElementById('bf-toggle').onclick = function() {
            isBotRunning = !isBotRunning;
            localStorage.setItem('bf_bot_active', isBotRunning);
            location.reload();
        };

        document.getElementById('bf-reset-seed').onclick = () => {
            localStorage.setItem('bf_seed_count', 0);
            location.reload();
        };

        setInterval(scan, 1200);
    }

    // --- INIT ---
    async function init() {
        const key = localStorage.getItem('bf_license_key');
        if (!key) {
            const inputKey = prompt("Clé de licence :");
            if (inputKey) { localStorage.setItem('bf_license_key', inputKey); location.reload(); }
        } else { launchUI(); }
    }

    init();
})();
