// ==UserScript==
// @name         BetFury Christmas Master V51.5 - UI & Seed Counter
// @namespace    http://tampermonkey.net/
// @version      51.5.9
// @description  Bot BetFury avec interface de contrôle + Compteur de Seed séparé
// @author       Gemini
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559578/BetFury%20Christmas%20Master%20V515%20-%20UI%20%20Seed%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/559578/BetFury%20Christmas%20Master%20V515%20-%20UI%20%20Seed%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIABLES D'ÉTAT ---
    let lastButtonState = "";
    let isBotRunning = localStorage.getItem('bf_bot_active') === 'true';
    let seedCount = parseInt(localStorage.getItem('bf_seed_count')) || 0;
    window.seedResetDone = false;
    let isResetting = false;

    // --- STYLES (BOT + COMPTEUR) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Interface Principale */
        #bf-bot-v50 {
            position: fixed; top: 15%; left: 5%; width: 220px; z-index: 9999999;
            background: linear-gradient(135deg, #b71c1c 0%, #7f0000 100%);
            color: #fff; padding: 12px; border: 2px solid #ffd700; border-radius: 12px;
            font-family: sans-serif; box-shadow: 0 5px 25px rgba(0,0,0,0.7);
            touch-action: none;
        }
        /* Interface Compteur Seed */
        #seed-counter-ui {
            position: fixed; top: 15%; left: calc(5% + 230px); width: 140px; z-index: 9999998;
            background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
            color: #fff; padding: 12px; border: 2px solid #00e5ff; border-radius: 12px;
            font-family: sans-serif; box-shadow: 0 5px 25px rgba(0,0,0,0.5);
            text-align: center;
        }
        .seed-number { font-size: 28px; font-weight: bold; color: #00e5ff; display: block; margin: 5px 0; text-shadow: 0 0 10px rgba(0,229,255,0.5); }
        .reset-seed-btn { background: rgba(255,255,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-size: 10px; padding: 4px 8px; cursor: pointer; border-radius: 4px; text-transform: uppercase; }
        .reset-seed-btn:hover { background: #00e5ff; color: #fff; }

        .stats-row { display: flex; justify-content: space-around; font-size: 11px; margin: 8px 0; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,215,0,0.3); }
        .christmas-input { width: 100%; background: #fff; border: 2px solid #ffd700; color: #b71c1c; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 16px; text-align: center; margin-bottom: 10px; box-sizing: border-box; }
        .christmas-btn { width: 100%; background: #2e7d32; color: #fff; border: 1px solid #ffd700; padding: 14px; border-radius: 10px; font-weight: bold; text-transform: uppercase; font-size: 13px; cursor: pointer; }
        .btn-active { background: #ffd700 !important; color: #000 !important; }
        .stat-val { color: #ffd700; font-weight: bold; display: block; margin-top: 2px; min-height: 14px; font-size: 10px; }
    `;
    document.head.appendChild(style);

    // --- CRÉATION DES INTERFACES ---
    
    // 1. Bot Principal
    const ui = document.createElement('div');
    ui.id = "bf-bot-v50";
    ui.innerHTML = `
        <div style="font-size: 12px; font-weight: bold; text-align: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 8px; margin-bottom: 8px;">🎄 NOËL V51.5 AUTO 🎅</div>
        <div class="stats-row">
            <div style="text-align:center;">💰 SOLDE<br><span id="res-bal" class="stat-val">...</span></div>
        </div>
        <div class="stats-row">
            <div style="text-align:center;">🎁 MISE<br><span id="res-bet" class="stat-val">...</span></div>
            <div style="text-align:center;">🍀 CHANCE<br><span id="res-cha" class="stat-val">...</span></div>
        </div>
        <input type="text" id="manual-bet-input" class="christmas-input" value="0.00000100">
        <button id="bf-start" class="christmas-btn">${isBotRunning ? 'ARRÊTER BOT 🛑' : 'LANCER JEU 🎁'}</button>
    `;
    document.body.appendChild(ui);

    // 2. Compteur de Seed
    const seedUI = document.createElement('div');
    seedUI.id = "seed-counter-ui";
    seedUI.innerHTML = `
        <div style="font-size: 10px; font-weight: bold; color: #00e5ff; margin-bottom: 5px;">COMPTEUR SEEDS</div>
        <div id="seed-val" class="seed-number">${seedCount}</div>
        <button id="reset-seed-count" class="reset-seed-btn">Reset Compteur</button>
    `;
    document.body.appendChild(seedUI);

    // --- LOGIQUE BOUTON RESET COMPTEUR ---
    document.getElementById('reset-seed-count').onclick = () => {
        seedCount = 0;
        localStorage.setItem('bf_seed_count', 0);
        document.getElementById('seed-val').innerText = "0";
    };

    // --- FONCTIONS UTILES ---
    function hardUnlock() {
        const closeBtn = document.querySelector('.modal-close, [class*="close"], .die-modal__close');
        if (closeBtn) closeBtn.click();
        const overlays = document.querySelectorAll('.app-modal-wrapper, .v-overlay, .modal-backdrop, .bet-modal-wrapper');
        overlays.forEach(el => el.remove());
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        const notifs = document.getElementById('notifications');
        if (notifs) notifs.innerHTML = '';
    }

    async function resetSeed() {
        if (isResetting) return;
        isResetting = true;
        
        const fairnessBtn = document.querySelector('svg use[href="#icon-fairness-new"]')?.parentElement?.parentElement;
        if (fairnessBtn) {
            fairnessBtn.click();
            await new Promise(r => setTimeout(r, 2000));

            const updateBtn = document.querySelector('svg use[href="#icon-update-new"]')?.parentElement?.parentElement;
            if (updateBtn) {
                updateBtn.click();
                
                // Mise à jour du compteur
                seedCount++;
                localStorage.setItem('bf_seed_count', seedCount);
                document.getElementById('seed-val').innerText = seedCount;
                
                await new Promise(r => setTimeout(r, 1500));
            }
        }
        
        hardUnlock();
        window.seedResetDone = true;
        isResetting = false;
    }

    function forceUpdateInput(inputElement, value) {
        if (!inputElement) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(inputElement, value);
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function clickPlay() {
        if (document.querySelector('.app-modal-wrapper')) {
            hardUnlock();
            return;
        }

        const playBtn = document.querySelector('button[data-test="button-bet"]') || 
                        document.querySelector('.button-bet') ||
                        [...document.querySelectorAll('button')].find(b => (b.innerText.includes("COMMENCER") || b.innerText.includes("BET")) && b.id !== "bf-start");

        if (playBtn) {
            const desiredBet = document.getElementById('manual-bet-input').value;
            const siteInput = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
            
            if (siteInput) forceUpdateInput(siteInput, desiredBet);

            setTimeout(() => {
                if (!playBtn.innerText.includes("ARRÊT") && !playBtn.innerText.includes("STOP")) {
                    playBtn.click();
                }
            }, 250);
        }
    }

    function scan() {
        const bal = document.querySelector('.balance__value') || [...document.querySelectorAll('span')].find(s => s.innerText.includes('.') && s.innerText.length < 20);
        if (bal) document.getElementById('res-bal').innerText = bal.innerText.trim();

        const siteBetInput = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
        if (siteBetInput && siteBetInput.value) {
            document.getElementById('res-bet').innerText = siteBetInput.value;
        }

        const chanceInput = document.querySelector('input[data-test="input-win-chance"]') || document.querySelector('.dice-chance-input input');
        if (chanceInput && chanceInput.value) {
            document.getElementById('res-cha').innerText = chanceInput.value + "%";
        } else {
            const allSpans = document.querySelectorAll('span, div');
            for (let s of allSpans) {
                if (s.innerText.includes('%') && s.innerText.length < 6 && /\d/.test(s.innerText)) {
                    document.getElementById('res-cha').innerText = s.innerText;
                    break;
                }
            }
        }

        if (!isBotRunning) return;

        const playBtn = document.querySelector('button[data-test="button-bet"]') || 
                        document.querySelector('.button-bet') ||
                        [...document.querySelectorAll('button')].find(b => (b.innerText.includes("COMMENCER") || b.innerText.includes("BET") || b.innerText.includes("ARRÊTE")) && b.id !== "bf-start");

        if (playBtn) {
            const currentText = playBtn.innerText.toUpperCase();
            const isPlaying = currentText.includes("ARRÊT") || currentText.includes("STOP");
            const wasPlaying = lastButtonState.includes("ARRÊT") || lastButtonState.includes("STOP");

            if (wasPlaying && !isPlaying) {
                location.reload();
                return;
            }
            lastButtonState = currentText;

            if (!isPlaying && !isResetting) {
                if (!window.seedResetDone) {
                    resetSeed();
                } else {
                    clickPlay();
                }
            }
        }
    }

    // --- CONTRÔLES ---
    document.getElementById('bf-start').onclick = function() {
        isBotRunning = !isBotRunning;
        localStorage.setItem('bf_bot_active', isBotRunning);
        if (isBotRunning) {
            this.innerText = "ARRÊTER BOT 🛑";
            this.classList.add('btn-active');
            window.seedResetDone = false;
        } else {
            this.innerText = "LANCER JEU 🎁";
            this.classList.remove('btn-active');
        }
    };

    setInterval(scan, 1000);
})();
