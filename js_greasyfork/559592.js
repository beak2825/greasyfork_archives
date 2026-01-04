// ==UserScript==
// @name         BetFury Christmas Master V51.5 - Licence Protect
// @namespace    http://tampermonkey.net/
// @version      51.5.14
// @description  Bot BetFury avec protection par clé et date d'expiration
// @author       Gemini
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559592/BetFury%20Christmas%20Master%20V515%20-%20Licence%20Protect.user.js
// @updateURL https://update.greasyfork.org/scripts/559592/BetFury%20Christmas%20Master%20V515%20-%20Licence%20Protect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        PROJECT_ID: "hack-1b404",
        DB_URL: "https://firestore.googleapis.com/v1/projects/hack-1b404/databases/(default)/documents/licences/",
        KEY_STORAGE: "bf_license_key",
        BOT_ACTIVE_STORAGE: "bf_bot_active",
        SEED_STORAGE: "bf_seed_count"
    };

    // --- VERIFICATION DE LICENCE ---
    async function verifyUserLicense(licenseKey) {
        if (!licenseKey) return false;
        try {
            const response = await fetch(CONFIG.DB_URL + licenseKey.trim());
            if (response.status === 200) {
                const data = await response.json();
                
                // Vérification du statut actif
                const isActive = data.fields && data.fields.actif && data.fields.actif.booleanValue === true;
                
                // Vérification de la date d'expiration
                let notExpired = true;
                if (data.fields && data.fields.expiry) {
                    const expiryDate = new Date(data.fields.expiry.timestampValue);
                    notExpired = new Date() < expiryDate;
                }

                return isActive && notExpired;
            }
            return false;
        } catch (err) {
            console.error("Erreur de validation:", err);
            return false;
        }
    }

    // --- INITIALISATION ---
    async function initializeBot() {
        let savedKey = localStorage.getItem(CONFIG.KEY_STORAGE);

        if (!savedKey) {
            savedKey = prompt("🎁 BIENVENUE ! Veuillez entrer votre clé d'activation :");
        }

        if (savedKey) {
            const isValid = await verifyUserLicense(savedKey);
            if (isValid) {
                localStorage.setItem(CONFIG.KEY_STORAGE, savedKey);
                startBotEngine(); 
            } else {
                alert("❌ Clé invalide, expirée ou désactivée.");
                localStorage.removeItem(CONFIG.KEY_STORAGE);
                location.reload();
            }
        } else {
            document.body.innerHTML = `
                <div style="background:linear-gradient(to bottom, #b71c1c, #000); color:white; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif; text-align:center;">
                    <h1>🎄 ACCÈS REQUIS 🎅</h1>
                    <p>Veuillez entrer une clé de licence pour utiliser le bot.</p>
                    <button onclick="location.reload()" style="padding:10px 20px; background:#ffd700; border:none; border-radius:5px; cursor:pointer;">ACTIVER</button>
                </div>`;
        }
    }

    // --- ENGINE DU BOT ---
    function startBotEngine() {
        console.log("✅ Bot initialisé et prêt.");

        let isRunning = localStorage.getItem(CONFIG.BOT_ACTIVE_STORAGE) === 'true';
        let seedCounter = parseInt(localStorage.getItem(CONFIG.SEED_STORAGE)) || 0;
        let isProcessingReset = false;
        window.seedReady = false;

        // Injection des Styles
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            #bf-ui-main { position: fixed; top: 15%; left: 5%; width: 220px; z-index: 9999999; background: linear-gradient(135deg, #b71c1c 0%, #7f0000 100%); color: #fff; padding: 12px; border: 2px solid #ffd700; border-radius: 12px; font-family: sans-serif; box-shadow: 0 5px 25px rgba(0,0,0,0.7); }
            #seed-ui-box { position: fixed; top: 15%; left: calc(5% + 230px); width: 140px; z-index: 9999998; background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); color: #fff; padding: 12px; border: 2px solid #00e5ff; border-radius: 12px; font-family: sans-serif; text-align: center; }
            .seed-num-text { font-size: 28px; font-weight: bold; color: #00e5ff; display: block; margin: 5px 0; }
            .ui-btn-reset { background: rgba(255,255,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-size: 10px; padding: 4px 8px; cursor: pointer; border-radius: 4px; }
            .ui-stats-row { display: flex; justify-content: space-around; font-size: 11px; margin: 8px 0; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 8px; }
            .ui-input-bet { width: 100%; background: #fff; border: 2px solid #ffd700; color: #b71c1c; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 16px; text-align: center; margin-bottom: 10px; box-sizing: border-box; }
            .ui-btn-main { width: 100%; background: #2e7d32; color: #fff; border: 1px solid #ffd700; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; }
            .ui-val-highlight { color: #ffd700; font-weight: bold; display: block; }
            .ui-btn-logout { background:none; border:none; color:#ffd700; font-size:9px; cursor:pointer; text-decoration:underline; margin-top:5px; }
        `;
        document.head.appendChild(styleTag);

        // Création Interface
        const uiContainer = document.createElement('div');
        uiContainer.id = "bf-ui-main";
        uiContainer.innerHTML = `
            <div style="font-size: 12px; font-weight: bold; text-align: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 8px; margin-bottom: 8px;">🎄 NOËL V51.5 AUTO 🎅</div>
            <div class="ui-stats-row"><div style="text-align:center;">💰 SOLDE<br><span id="display-bal" class="ui-val-highlight">...</span></div></div>
            <div class="ui-stats-row">
                <div style="text-align:center;">🎁 MISE<br><span id="display-bet" class="ui-val-highlight">...</span></div>
                <div style="text-align:center;">🍀 CHANCE<br><span id="display-cha" class="ui-val-highlight">...</span></div>
            </div>
            <input type="text" id="bet-amount-field" class="ui-input-bet" value="0.00000100">
            <button id="bot-toggle-btn" class="ui-btn-main">${isRunning ? 'ARRÊTER BOT 🛑' : 'LANCER JEU 🎁'}</button>
            <center><button class="ui-btn-logout" id="license-logout">Changer de clé</button></center>
        `;
        document.body.appendChild(uiContainer);

        const seedContainer = document.createElement('div');
        seedContainer.id = "seed-ui-box";
        seedContainer.innerHTML = `
            <div style="font-size: 10px; font-weight: bold; color: #00e5ff; margin-bottom: 5px;">COMPTEUR SEEDS</div>
            <div id="display-seed" class="seed-num-text">${seedCounter}</div>
            <button id="seed-reset-btn" class="ui-btn-reset">Reset Compteur</button>
        `;
        document.body.appendChild(seedContainer);

        // Events
        document.getElementById('license-logout').onclick = () => {
            localStorage.removeItem(CONFIG.KEY_STORAGE);
            location.reload();
        };

        document.getElementById('seed-reset-btn').onclick = () => {
            seedCounter = 0;
            localStorage.setItem(CONFIG.SEED_STORAGE, 0);
            document.getElementById('display-seed').innerText = "0";
        };

        async function performSeedReset() {
            if (isProcessingReset) return;
            isProcessingReset = true;
            const fairness = document.querySelector('svg use[href="#icon-fairness-new"]')?.parentElement?.parentElement;
            if (fairness) {
                fairness.click();
                await new Promise(r => setTimeout(r, 2000));
                const update = document.querySelector('svg use[href="#icon-update-new"]')?.parentElement?.parentElement;
                if (update) {
                    update.click();
                    seedCounter++;
                    localStorage.setItem(CONFIG.SEED_STORAGE, seedCounter);
                    document.getElementById('display-seed').innerText = seedCounter;
                    await new Promise(r => setTimeout(r, 1500));
                }
            }
            // Nettoyage modales
            const closeBtn = document.querySelector('.modal-close, [class*="close"], .die-modal__close');
            if (closeBtn) closeBtn.click();
            document.querySelectorAll('.app-modal-wrapper, .v-overlay, .modal-backdrop').forEach(el => el.remove());
            
            window.seedReady = true;
            isProcessingReset = false;
        }

        function executeBet() {
            const playBtn = document.querySelector('button[data-test="button-bet"]') || [...document.querySelectorAll('button')].find(b => b.innerText.includes("BET") && b.id !== "bot-toggle-btn");
            if (playBtn) {
                const betVal = document.getElementById('bet-amount-field').value;
                const inputField = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
                if (inputField) {
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    setter.call(inputField, betVal);
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                }
                setTimeout(() => { if (!playBtn.innerText.includes("STOP")) playBtn.click(); }, 250);
            }
        }

        setInterval(() => {
            const balanceElement = document.querySelector('.balance__value');
            if (balanceElement) document.getElementById('display-bal').innerText = balanceElement.innerText.trim();
            
            if (!isRunning) return;

            const mainButton = document.querySelector('button[data-test="button-bet"]');
            if (mainButton && !mainButton.innerText.includes("STOP") && !isProcessingReset) {
                if (!window.seedReady) performSeedReset(); 
                else executeBet();
            }
        }, 1000);

        document.getElementById('bot-toggle-btn').onclick = function() {
            isRunning = !isRunning;
            localStorage.setItem(CONFIG.BOT_ACTIVE_STORAGE, isRunning);
            this.innerText = isRunning ? "ARRÊTER BOT 🛑" : "LANCER JEU 🎁";
            if (isRunning) window.seedReady = false;
        };
    }

    initializeBot();
})();
