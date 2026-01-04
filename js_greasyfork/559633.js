// ==UserScript==
// @name         BetFury Christmas Master V51.5 - Firebase Edition
// @namespace    http://tampermonkey.net/
// @version      51.5.10
// @description  Bot BetFury avec interface + Compteur de Seed + Licence Firebase
// @author       Gemini
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559633/BetFury%20Christmas%20Master%20V515%20-%20Firebase%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/559633/BetFury%20Christmas%20Master%20V515%20-%20Firebase%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION FIREBASE ---
    const FB_CONFIG = {
        apiKey: "AIzaSyDCsWH3UZDLDBj2DgnMdBz0fcFsNxJih-U",
        projectId: "hack-1b404"
    };

    // --- VARIABLES D'ÉTAT ---
    let lastButtonState = "";
    let isBotRunning = localStorage.getItem('bf_bot_active') === 'true';
    let seedCount = parseInt(localStorage.getItem('bf_seed_count')) || 0;
    window.seedResetDone = false;
    let isResetting = false;

    // --- SYSTÈME DE LICENCE ---
    async function verifyLicense(key) {
        if (!key) return false;
        // URL pointant vers le document de la collection 'licences' dont l'ID est la clé
        const url = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/licences/${key}?key=${FB_CONFIG.apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.fields && data.fields.actif) {
                return data.fields.actif.booleanValue === true;
            }
            return false;
        } catch (e) {
            console.error("[Firebase] Erreur de vérification:", e);
            return false;
        }
    }

    // --- STYLES ---
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #bf-bot-v50 {
                position: fixed; top: 15%; left: 5%; width: 220px; z-index: 9999999;
                background: linear-gradient(135deg, #b71c1c 0%, #7f0000 100%);
                color: #fff; padding: 12px; border: 2px solid #ffd700; border-radius: 12px;
                font-family: sans-serif; box-shadow: 0 5px 25px rgba(0,0,0,0.7);
            }
            #seed-counter-ui {
                position: fixed; top: 15%; left: calc(5% + 230px); width: 140px; z-index: 9999998;
                background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
                color: #fff; padding: 12px; border: 2px solid #00e5ff; border-radius: 12px;
                font-family: sans-serif; text-align: center;
            }
            .seed-number { font-size: 28px; font-weight: bold; color: #00e5ff; display: block; margin: 5px 0; }
            .reset-seed-btn { background: rgba(255,255,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-size: 10px; padding: 4px 8px; cursor: pointer; border-radius: 4px; }
            .stats-row { display: flex; justify-content: space-around; font-size: 11px; margin: 8px 0; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 8px; }
            .christmas-input { width: 100%; background: #fff; border: 2px solid #ffd700; color: #b71c1c; padding: 10px; border-radius: 6px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            .christmas-btn { width: 100%; background: #2e7d32; color: #fff; border: 1px solid #ffd700; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; }
            .btn-active { background: #ffd700 !important; color: #000 !important; }
            .stat-val { color: #ffd700; font-weight: bold; }
        `;
        document.head.appendChild(style);
    };

    // --- FONCTIONS MOTEUR ---
    function hardUnlock() {
        const closeBtn = document.querySelector('.modal-close, [class*="close"]');
        if (closeBtn) closeBtn.click();
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
                seedCount++;
                localStorage.setItem('bf_seed_count', seedCount);
                if(document.getElementById('seed-val')) document.getElementById('seed-val').innerText = seedCount;
                await new Promise(r => setTimeout(r, 1500));
            }
        }
        hardUnlock();
        window.seedResetDone = true;
        isResetting = false;
    }

    function scan() {
        const bal = document.querySelector('.balance__value') || [...document.querySelectorAll('span')].find(s => s.innerText.includes('.') && s.innerText.length < 20);
        if (bal && document.getElementById('res-bal')) document.getElementById('res-bal').innerText = bal.innerText.trim();

        if (!isBotRunning) return;

        const playBtn = document.querySelector('button[data-test="button-bet"]') || document.querySelector('.button-bet') || [...document.querySelectorAll('button')].find(b => (b.innerText.includes("COMMENCER") || b.innerText.includes("BET")) && b.id !== "bf-start");

        if (playBtn) {
            const currentText = playBtn.innerText.toUpperCase();
            const isPlaying = currentText.includes("ARRÊT") || currentText.includes("STOP");

            if (lastButtonState.includes("ARRÊT") && !isPlaying) {
                location.reload(); return;
            }
            lastButtonState = currentText;

            if (!isPlaying && !isResetting) {
                if (!window.seedResetDone) resetSeed();
                else {
                    const siteInput = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
                    if (siteInput) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(siteInput, document.getElementById('manual-bet-input').value);
                        siteInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    setTimeout(() => playBtn.click(), 250);
                }
            }
        }
    }

    // --- INITIALISATION INTERFACE ---
    function launchUI() {
        injectStyles();

        const botUI = document.createElement('div');
        botUI.id = "bf-bot-v50";
        botUI.innerHTML = `
            <div style="font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 8px;">🎄 NOËL V51.5 AUTO 🎅</div>
            <div class="stats-row"><div style="text-align:center;">💰 SOLDE<br><span id="res-bal" class="stat-val">...</span></div></div>
            <input type="text" id="manual-bet-input" class="christmas-input" value="0.00000100">
            <button id="bf-start" class="christmas-btn">${isBotRunning ? 'ARRÊTER BOT 🛑' : 'LANCER JEU 🎁'}</button>
        `;
        document.body.appendChild(botUI);

        const sUI = document.createElement('div');
        sUI.id = "seed-counter-ui";
        sUI.innerHTML = `
            <div style="font-size: 10px; font-weight: bold; color: #00e5ff;">COMPTEUR SEEDS</div>
            <div id="seed-val" class="seed-number">${seedCount}</div>
            <button id="reset-seed-count" class="reset-seed-btn">Reset Compteur</button>
        `;
        document.body.appendChild(sUI);

        document.getElementById('bf-start').onclick = function() {
            isBotRunning = !isBotRunning;
            localStorage.setItem('bf_bot_active', isBotRunning);
            this.innerText = isBotRunning ? "ARRÊTER BOT 🛑" : "LANCER JEU 🎁";
            this.classList.toggle('btn-active', isBotRunning);
            window.seedResetDone = false;
        };

        document.getElementById('reset-seed-count').onclick = () => {
            seedCount = 0;
            localStorage.setItem('bf_seed_count', 0);
            document.getElementById('seed-val').innerText = "0";
        };

        setInterval(scan, 1000);
    }

    // --- POINT D'ENTRÉE (VÉRIFICATION LICENCE) ---
    async function init() {
        const savedKey = localStorage.getItem('bf_license_key');

        if (!savedKey) {
            const key = prompt("⚠️ Activation requise\nVeuillez entrer votre clé de licence :");
            if (key && await verifyLicense(key)) {
                localStorage.setItem('bf_license_key', key);
                location.reload();
            } else {
                alert("❌ Clé invalide ou inactive.");
            }
        } else {
            const isValid = await verifyLicense(savedKey);
            if (isValid) {
                launchUI();
            } else {
                alert("🚫 Votre licence a expiré ou a été désactivée.");
                localStorage.removeItem('bf_license_key');
                location.reload();
            }
        }
    }

    init();
})();
