// ==UserScript==
// @name         BetFury Christmas Master V51.8.1 - 2025 FIXED
// @namespace    http://tampermonkey.net/
// @version      51.8.1.1
// @description  Version avec Debug Console pour Firebase
// @author       Gemini
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559624/BetFury%20Christmas%20Master%20V5181%20-%202025%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/559624/BetFury%20Christmas%20Master%20V5181%20-%202025%20FIXED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FB_CONFIG = {
        apiKey: "AIzaSyDCsWH3UZDLDBj2DgnMdBz0fcFsNxJih-U",
        projectId: "hack-1b404"
    };

    let isBotRunning = localStorage.getItem('bf_bot_active') === 'true';
    let seedCount = parseInt(localStorage.getItem('bf_seed_count')) || 0;
    let isResetting = false;
    let lastButtonState = "";
    window.seedResetDone = false;

    // --- SYSTÈME LICENCE AVEC DEBUG ---
    async function verifyLicense(key) {
        if (!key) return false;

        // IMPORTANT: L'ID du document dans Firebase doit être la clé (ex: "ABC-123")
        const url = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/licences/${key}?key=${FB_CONFIG.apiKey}`;

        console.log("%c[BOT] Vérification de la clé : " + key, "color: #00e5ff");

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("[BOT] Erreur Firebase :", data.error.message);
                if(data.error.status === "PERMISSION_DENIED") alert("Erreur : Vérifiez vos 'Règles' Firestore (Rules) !");
                return false;
            }

            if (data.fields && data.fields.actif) {
                const isActive = data.fields.actif.booleanValue;
                console.log("[BOT] Statut licence :", isActive ? "VALIDE ✅" : "INACTIVE ❌");
                return isActive === true;
            } else {
                console.warn("[BOT] Document trouvé mais champ 'actif' manquant.");
                return false;
            }
        } catch (e) {
            console.error("[BOT] Erreur réseau :", e);
            return false;
        }
    }

    // --- LOGIQUE CORE ---
    function updateStats() {
        const bal = document.querySelector('.balance__value') || [...document.querySelectorAll('span')].find(s => s.innerText.includes('.') && s.innerText.length < 15);
        if (bal && document.getElementById('res-bal')) document.getElementById('res-bal').innerText = bal.innerText.trim();
    }

    function humanClick(element) {
        if (!element) return;
        ['mousedown', 'mouseup', 'click'].forEach(evt => {
            element.dispatchEvent(new MouseEvent(evt, { view: window, bubbles: true, cancelable: true }));
        });
    }

    async function resetSeed() {
        if (isResetting) return;
        isResetting = true;
        const fairBtn = document.querySelector('.bet-settings__fairness') ||
                        document.querySelector('svg use[href*="fairness"]')?.closest('button');

        if (fairBtn) {
            humanClick(fairBtn);
            await new Promise(r => setTimeout(r, 1000));
            const changeBtn = document.querySelector('#undefined-update') ||
                            [...document.querySelectorAll('button')].find(el => /change|update|new seed/i.test(el.innerText));

            if (changeBtn) {
                humanClick(changeBtn);
                seedCount++;
                localStorage.setItem('bf_seed_count', seedCount);
                if(document.getElementById('seed-num')) document.getElementById('seed-num').innerText = seedCount;
                await new Promise(r => setTimeout(r, 800));
            }
        }

        // Fermeture propre
        const closeBtn = document.querySelector('.modal-close, [class*="close"]');
        if (closeBtn) humanClick(closeBtn);
        window.seedResetDone = true;
        isResetting = false;
    }

    function forceUpdateInput(inputElement, value) {
        if (!inputElement) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(inputElement, value);
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // --- INTERFACE ---
    function launchBotInterface() {
        const style = document.createElement('style');
        style.innerHTML = `
            #bf-bot-v50 { position: fixed; top: 12%; left: 30px; width: 250px; z-index: 999999; background: #b71c1c; color: #fff; padding: 15px; border: 3px solid #ffd700; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); font-family: sans-serif; }
            .c-input { width: 100%; padding: 8px; margin: 10px 0; border-radius: 8px; border: none; text-align: center; font-weight: bold; }
            .c-btn { width: 100%; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; }
            .btn-active { background: #ffd700 !important; color: #000 !important; }
            #seed-ui { position: fixed; top: 12%; left: 295px; width: 100px; z-index: 999999; background: #1a237e; border: 2px solid #00e5ff; border-radius: 15px; color: #fff; padding: 10px; text-align: center; }
        `;
        document.head.appendChild(style);

        const ui = document.createElement('div');
        ui.id = "bf-bot-v50";
        ui.innerHTML = `
            <div style="text-align:center; margin-bottom:10px;">🎄 MASTER V51.8.1</div>
            <div style="font-size:11px; background:rgba(0,0,0,0.3); padding:5px; border-radius:5px;">SOLDE: <span id="res-bal">---</span></div>
            <input type="text" id="bet-val" class="c-input" value="0.00000001">
            <button id="start-btn" class="c-btn ${isBotRunning ? 'btn-active' : ''}">${isBotRunning ? "STOP BOT" : "LANCER"}</button>
        `;
        document.body.appendChild(ui);

        const sUi = document.createElement('div');
        sUi.id = "seed-ui";
        sUi.innerHTML = `<small>SEED</small><div id="seed-num">${seedCount}</div>`;
        document.body.appendChild(sUi);

        document.getElementById('start-btn').onclick = function() {
            isBotRunning = !isBotRunning;
            localStorage.setItem('bf_bot_active', isBotRunning);
            this.innerText = isBotRunning ? "STOP BOT" : "LANCER";
            this.classList.toggle('btn-active');
            window.seedResetDone = false;
        };

        setInterval(updateStats, 1000);
        setInterval(mainLoop, 1500);
    }

    function mainLoop() {
        if (!isBotRunning || isResetting) return;
        const betBtn = document.querySelector('button[data-test="button-bet"]') || document.querySelector('.button-bet');

        if (betBtn) {
            const isPlaying = betBtn.innerText.toUpperCase().includes("STOP");
            if (!isPlaying) {
                if (!window.seedResetDone) {
                    resetSeed();
                    return;
                }
                const input = document.querySelector('input[data-test="input-bet-amount"]') || document.querySelector('.amount__center input');
                if (input) forceUpdateInput(input, document.getElementById('bet-val').value);
                setTimeout(() => { humanClick(betBtn); }, 500);
            }
        }
    }

    async function init() {
        const savedKey = localStorage.getItem('bf_license_key');
        if (!savedKey) {
            const key = prompt("Entrez votre clé de licence Firebase (ID du document) :");
            if (key && await verifyLicense(key)) {
                localStorage.setItem('bf_license_key', key);
                location.reload();
            } else {
                alert("Clé invalide ou erreur de connexion.");
            }
        } else {
            const valid = await verifyLicense(savedKey);
            if (valid) {
                launchBotInterface();
            } else {
                localStorage.removeItem('bf_license_key');
                alert("Licence expirée ou révoquée.");
                location.reload();
            }
        }
    }

    init();
})();
