// ==UserScript==
// @name         ColFood Bot V38: Manual Override
// @namespace    http://tampermonkey.net/
// @version      38.0
// @description  Autopilot Disattivabile, Gestione "Torna Indietro", Loot History
// @author       Gemini & Friend
// @match        https://colfoodplay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558348/ColFood%20Bot%20V38%3A%20Manual%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/558348/ColFood%20Bot%20V38%3A%20Manual%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        DELAY: 3000,
        BUILD_DELAY: 1200,
        START_GRACE_SEC: 5,
        WARNING_MINUTES: 15
    };

    // --- STATI E MEMORIA ---
    let isPaused = localStorage.getItem('colfood_global_pause') === 'true';
    let isBuildPaused = localStorage.getItem('colfood_build_pause') === 'true';
    let isMinimized = localStorage.getItem('colfood_minimized') === 'true';
    
    // Default Autopilot: ON (se non esiste nel localstorage, è true)
    let isAutopilot = localStorage.getItem('colfood_autopilot') !== 'false';

    let currentPhase = 'IDLE'; 
    let startTime = Date.now();
    let nextArrivalText = "--";
    let activeSlotsCount = 0;
    let activeDelays = 0;
    let lootHistory = []; 

    // --- 0. BACKGROUND FIX ---
    Object.defineProperty(document, 'hidden', { value: false, writable: false });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
    window.dispatchEvent(new Event('visibilitychange'));

    // --- 1. HUD GRAFICO V38 ---
    function createStatusPanel() {
        const mainDiv = document.createElement('div');
        mainDiv.id = 'colfood-bot-hud';
        Object.assign(mainDiv.style, {
            position: 'fixed', top: '10px', left: '10px', zIndex: '999999',
            backgroundColor: '#111111', color: '#FFFFFF',
            border: '3px solid #00FF00', borderRadius: '12px', padding: '15px',
            fontFamily: 'Consolas, "Courier New", monospace', fontSize: '13px', fontWeight: 'bold',
            minWidth: '300px', boxShadow: '0px 4px 15px rgba(0,0,0,0.9)',
            display: isMinimized ? 'none' : 'block'
        });

        mainDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
                <span style="color: #00FF00; font-size: 16px;">🤖 BOT V38</span>
                <button id="colfood-minimize-btn" style="background: none; border: 1px solid #333; color: white; cursor: pointer; border-radius: 4px; padding: 0 5px;">_</button>
            </div>
            
            <div id="colfood-phase-box" style="background-color: #333; color: white; padding: 6px; text-align: center; border-radius: 6px; margin-bottom: 8px; font-size: 14px;">
                STATUS: <span id="colfood-phase">ATTESA</span>
            </div>

            <div style="background-color: #002200; padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #005500;">
                <div style="font-size: 11px; color: #8F8; margin-bottom: 4px; border-bottom: 1px solid #004400;">📜 ULTIMI 5 LOOT:</div>
                <div id="colfood-loot-list" style="color: #FFD700; font-size: 12px; line-height: 1.5; min-height: 20px;">
                    <span style="color: #666;">In attesa...</span>
                </div>
            </div>

            <div style="background-color: #222; padding: 6px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #444; font-size: 12px; color: #aaa;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Slot Attivi:</span> <span id="colfood-slots-count" style="color: white;">0</span>
                </div>
                <div id="colfood-alert-box" style="margin-top: 4px; display: none; color: #ff5555; font-weight: bold;">
                    ⚠️ RITARDI RILEVATI!
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #aaa; margin-bottom: 10px;">
                <span>Prossimo Rientro:</span>
                <span id="colfood-arrival" style="color: #00FFFF;">--</span>
            </div>
            
            <button id="colfood-pause-btn" style="width: 100%; padding: 8px; cursor: pointer; background-color: #00FF00; color: black; border: none; font-weight: 900; font-size: 13px; border-radius: 6px; margin-bottom: 6px; text-transform: uppercase;">
                ⏸ PAUSA TOTALE
            </button>

            <div style="display: flex; gap: 5px; margin-bottom: 2px;">
                <button id="colfood-build-btn" style="flex: 1; padding: 6px; cursor: pointer; background-color: #00FFFF; color: black; border: none; font-weight: 900; font-size: 11px; border-radius: 6px; text-transform: uppercase;">
                    🏗️ AUTO OMINI
                </button>
                <button id="colfood-auto-btn" style="flex: 1; padding: 6px; cursor: pointer; background-color: #0055FF; color: white; border: none; font-weight: 900; font-size: 11px; border-radius: 6px; text-transform: uppercase;">
                    ✈️ AUTOPILOT
                </button>
            </div>
            <div style="font-size: 10px; color: #555; text-align: center; margin-top: 5px;" id="colfood-info-text">System Ready</div>
        `;
        document.body.appendChild(mainDiv);

        const miniDiv = document.createElement('div');
        miniDiv.id = 'colfood-mini-hud';
        Object.assign(miniDiv.style, {
            position: 'fixed', top: '10px', left: '10px', zIndex: '999999',
            backgroundColor: 'rgba(0,0,0,0.6)', color: '#00FF00',
            border: '2px solid #00FF00', borderRadius: '8px', padding: '5px',
            cursor: 'pointer', fontSize: '20px', width: '40px', height: '40px',
            textAlign: 'center', display: isMinimized ? 'block' : 'none'
        });
        miniDiv.innerHTML = "🎮";
        miniDiv.title = "Apri Bot";
        document.body.appendChild(miniDiv);

        // LOGICA UI
        const btnMin = document.getElementById('colfood-minimize-btn');
        const btnPause = document.getElementById('colfood-pause-btn');
        const btnBuild = document.getElementById('colfood-build-btn');
        const btnAuto = document.getElementById('colfood-auto-btn');
        const phaseSpan = document.getElementById('colfood-phase');
        const phaseBox = document.getElementById('colfood-phase-box');
        const infoText = document.getElementById('colfood-info-text');

        function toggleHud(min) {
            isMinimized = min;
            localStorage.setItem('colfood_minimized', min);
            if (min) { mainDiv.style.display = 'none'; miniDiv.style.display = 'block'; }
            else { mainDiv.style.display = 'block'; miniDiv.style.display = 'none'; }
        }
        btnMin.onclick = () => toggleHud(true);
        miniDiv.onclick = () => toggleHud(false);

        function syncUiState() {
            // Pausa Totale
            if (isPaused) {
                btnPause.innerText = "▶ RIPRENDI TUTTO"; btnPause.style.backgroundColor = "#FF0000"; btnPause.style.color = "white";
                phaseBox.style.backgroundColor = "#500"; phaseSpan.innerText = "IN PAUSA";
                mainDiv.style.borderColor = "#FF0000"; miniDiv.style.borderColor = "#FF0000";
            } else {
                btnPause.innerText = "⏸ PAUSA TOTALE"; btnPause.style.backgroundColor = "#00FF00"; btnPause.style.color = "black";
                mainDiv.style.borderColor = "#00FF00"; miniDiv.style.borderColor = "#00FF00";
            }
            // Auto Omini
            if (isBuildPaused) {
                btnBuild.innerText = "🛑 STOP OMINI"; btnBuild.style.backgroundColor = "#FFCC00";
            } else {
                btnBuild.innerText = "🏗️ AUTO OMINI"; btnBuild.style.backgroundColor = "#00FFFF";
            }
            // Autopilot
            if (isAutopilot) {
                btnAuto.innerText = "✈️ AUTO: ON"; 
                btnAuto.style.backgroundColor = "#0055FF";
                btnAuto.style.color = "white";
                infoText.innerText = "Navigazione Automatica Attiva";
            } else {
                btnAuto.innerText = "🤚 AUTO: OFF"; 
                btnAuto.style.backgroundColor = "#555";
                btnAuto.style.color = "#ccc";
                infoText.innerText = "Navigazione Manuale";
            }
        }

        btnPause.onclick = function() {
            isPaused = !isPaused; localStorage.setItem('colfood_global_pause', isPaused);
            syncUiState(); if (!isPaused) loop();
        };

        btnBuild.onclick = function() {
            isBuildPaused = !isBuildPaused; localStorage.setItem('colfood_build_pause', isBuildPaused);
            syncUiState();
        };

        btnAuto.onclick = function() {
            isAutopilot = !isAutopilot; localStorage.setItem('colfood_autopilot', isAutopilot);
            syncUiState();
        };

        syncUiState();
        return { mainDiv, miniDiv };
    }

    const hudElements = createStatusPanel();
    const phaseText = document.getElementById('colfood-phase');
    const phaseBox = document.getElementById('colfood-phase-box');
    const lootListDiv = document.getElementById('colfood-loot-list');
    const arrivalText = document.getElementById('colfood-arrival');
    const slotsCountText = document.getElementById('colfood-slots-count');
    const alertBox = document.getElementById('colfood-alert-box');

    function updateHud() {
        if(arrivalText) arrivalText.innerText = nextArrivalText;
        if(slotsCountText) slotsCountText.innerText = activeSlotsCount;
        
        if(lootListDiv) {
            if (lootHistory.length === 0) lootListDiv.innerHTML = '<span style="color: #666;">In attesa...</span>';
            else lootListDiv.innerHTML = lootHistory.join('<br>');
        }
        if (alertBox) {
            if (activeDelays > 0) { alertBox.style.display = 'block'; alertBox.innerText = `⚠️ ${activeDelays} SPEDIZIONI IN RITARDO (>15m)`; }
            else { alertBox.style.display = 'none'; }
        }
    }

    function setPhase(phase) {
        currentPhase = phase;
        if(phaseText && !isPaused) {
            phaseText.innerText = phase;
            if (phase === 'LOGIN') { phaseBox.style.backgroundColor = '#0000FF'; phaseBox.style.border = '2px solid white'; }
            else if (phase === 'NAVIGAZIONE') { phaseBox.style.backgroundColor = '#551A8B'; phaseBox.style.border = '1px solid magenta'; }
            else if (phase === 'INDIETRO') { phaseBox.style.backgroundColor = '#8B008B'; phaseBox.style.border = '1px solid magenta'; }
            else if (phase === 'BUILDING') { phaseBox.style.backgroundColor = '#008B8B'; phaseBox.style.border = '1px solid cyan'; }
            else if (phase === 'INVIO') { phaseBox.style.backgroundColor = '#006400'; phaseBox.style.border = '1px solid lime'; }
            else if (phase === 'RACCOLTA') { phaseBox.style.backgroundColor = '#FF8C00'; phaseBox.style.border = '1px solid orange'; }
            else { phaseBox.style.backgroundColor = '#333'; phaseBox.style.border = 'none'; }
        }
    }

    function logLoot(buttonElement) {
        const card = buttonElement.closest('div[data-testid^="card-completed"]');
        if (!card) return;
        const getVal = (alt) => { const img = card.querySelector(`img[alt="${alt}"]`); return (img && img.nextElementSibling) ? parseInt(img.nextElementSibling.innerText) : 0; };
        
        const lootStr = `🍬${getVal("Zucchero")} 🌾${getVal("Farina")} 🥛${getVal("Latte")} 🥚${getVal("Uova")}`.replace(/ [^\d]+0 /g, ' ').replace(/[^\d]+0$/, '');
        
        if (lootStr.match(/\d/)) {
            const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            lootHistory.unshift(`<span style="color:#888">[${timeStr}]</span> ${lootStr}`);
            if (lootHistory.length > 5) lootHistory.pop();
            updateHud();
        }
    }

    // --- FUNZIONI DI NAVIGAZIONE ---
    function checkAndHandleNavigation() {
        // SE AUTOPILOT È OFF, NON TOCCARE NULLA
        if (!isAutopilot) return false;

        const currentUrl = window.location.href;

        // 1. LOGIN
        const loginBtn = document.querySelector('button[data-testid="button-submit"]');
        if (loginBtn && loginBtn.innerText.includes("Accedi")) {
            setPhase('LOGIN');
            console.log("🔑 Login rilevato. Eseguo accesso...");
            loginBtn.click();
            return true;
        }

        // 2. DASHBOARD
        const playBtn = document.querySelector('button[data-testid="button-play-710"]');
        if (playBtn) {
            setPhase('NAVIGAZIONE');
            console.log("🎮 Dashboard rilevata. Entro nel gioco...");
            playBtn.click();
            return true;
        }

        // 3. NAVIGAZIONE INTERNA (Se non siamo in /spedizioni e non siamo in login/dashboard)
        if (!currentUrl.includes('/spedizioni') && !loginBtn && !playBtn) {
            
            // 3a. CONTROLLO "TORNA ALLA PASTICCERIA" (Back Button)
            const backBtn = document.querySelector('button[data-testid="button-back-pasticceria"]');
            if (backBtn) {
                setPhase('INDIETRO');
                console.log("🔙 Torno alla Pasticceria...");
                backBtn.click();
                return true;
            }

            // 3b. CONTROLLO TAB SPEDIZIONI
            const navTitle = Array.from(document.querySelectorAll('h3')).find(el => el.innerText.trim() === "Spedizioni");
            if (navTitle) {
                setPhase('NAVIGAZIONE');
                console.log("🧭 Tab errato. Clicco Spedizioni...");
                navTitle.click(); 
                const parentDiv = navTitle.closest('div.cursor-pointer') || navTitle.parentElement;
                if(parentDiv) parentDiv.click();
                return true;
            }
        }

        return false;
    }

    // --- ANALISI TIMER ---
    function scanTimers() {
        const timers = Array.from(document.querySelectorAll('[data-testid*="text-expedition"][data-testid*="timeleft"]'));
        activeSlotsCount = timers.length;
        if (timers.length === 0) { nextArrivalText = "Pronto / --"; activeDelays = 0; updateHud(); return; }
        let minMinutes = Infinity; let minText = "--"; let delays = 0;
        timers.forEach(t => {
            const text = t.innerText; 
            const hMatch = text.match(/(\d+)h/i); const mMatch = text.match(/(\d+)m/i);
            let minutes = 0;
            if (hMatch) minutes += parseInt(hMatch[1]) * 60; if (mMatch) minutes += parseInt(mMatch[1]);
            if (minutes < minMinutes) { minMinutes = minutes; minText = text; }
            if (minutes >= CONFIG.WARNING_MINUTES) delays++;
        });
        nextArrivalText = minText; activeDelays = delays; updateHud();
    }

    function checkForStuckPage() {
        if (Date.now() - startTime < (CONFIG.START_GRACE_SEC * 1000)) return false;
        const bodyText = document.body.innerText;
        return (/Completata!|Completata/i.test(bodyText) && !Array.from(document.querySelectorAll('button')).some(b => b.innerText.toLowerCase().includes("riscatta")));
    }

    function checkForResourceError() {
        const bodyText = document.body.innerText;
        return bodyText.includes("Risorse insufficienti") || bodyText.includes("mancanti") || bodyText.includes("non abbastanza");
    }

    function setReactInput(element, value) {
        if (!element || element.value === String(value)) return;
        const lastValue = element.value; element.value = value;
        const tracker = element._valueTracker; if (tracker) tracker.setValue(lastValue);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // --- LOOP PRINCIPALE ---
    function loop() {
        // 0. AUTO-PILOT (Se attivo)
        if (checkAndHandleNavigation()) return;

        scanTimers();
        if (isPaused) return;

        if (checkForStuckPage()) {
            setPhase('REFRESH'); location.reload(); return;
        }

        // 1. RISCATTA
        const claimBtn = Array.from(document.querySelectorAll('button'))
            .find(b => b.innerText.toLowerCase().includes("riscatta"));
        
        if (claimBtn) {
            setPhase('RACCOLTA');
            logLoot(claimBtn);
            if (claimBtn.disabled) claimBtn.disabled = false;
            claimBtn.click();
            return; 
        }

        // 2. BUILD
        if (!claimBtn && currentPhase !== 'RACCOLTA' && !isBuildPaused && activeSlotsCount < 2) currentPhase = 'BUILDING';
        
        if (currentPhase === 'BUILDING' && !isBuildPaused) {
            if (checkForResourceError()) { setPhase('INVIO'); return; }
            const createWorkerBtn = document.querySelector('button[data-testid="button-create-workers"]');
            if (createWorkerBtn && !createWorkerBtn.disabled && !createWorkerBtn.classList.contains('opacity-50')) {
                setPhase('BUILDING'); createWorkerBtn.click(); return; 
            } else {
                setPhase('INVIO'); return;
            }
        }
        if (currentPhase === 'BUILDING' && isBuildPaused) setPhase('INVIO');

        // 3. SPEDIZIONE
        const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Avvia Spedizione"));
        
        if (!sendBtn) {
            if (!claimBtn && currentPhase !== 'BUILDING') setPhase('ATTESA');
            return;
        }

        let freeSlots = 0;
        const text = document.body.innerText;
        const match = text.match(/Spedizioni\s*attive:?\s*(\d+)\s*\/\s*(\d+)/i);
        if (match) freeSlots = parseInt(match[2]) - parseInt(match[1]);

        if (freeSlots <= 0) { setPhase('SLOT PIENI'); return; }

        let omini = 0;
        const elOmini = document.querySelector('[data-testid="text-workers-available"]');
        if (elOmini) omini = parseInt(elOmini.innerText.split('/')[0]);

        if (omini < 1) { setPhase('ATTESA'); return; }

        setPhase('INVIO');
        let toSend = Math.floor(omini / freeSlots);
        if (toSend < 1) toSend = 1;

        const inputElement = document.getElementById('expedition-workers');
        if (inputElement) {
            if (inputElement.value == toSend) {
                if (!sendBtn.disabled) {
                    sendBtn.click(); setTimeout(() => setPhase('ATTESA'), 1000);
                } else {
                    sendBtn.removeAttribute('disabled'); sendBtn.click();
                }
            } else {
                setReactInput(inputElement, toSend);
            }
        }
    }

    const workerScript = `
        let interval = null;
        let speed = ${CONFIG.DELAY};
        self.onmessage = function(e) {
            if (e.data === 'start') run();
            else if (e.data === 'fast') { speed = ${CONFIG.BUILD_DELAY}; run(); }
            else if (e.data === 'normal') { speed = ${CONFIG.DELAY}; run(); }
        };
        function run() {
            if (interval) clearInterval(interval);
            interval = setInterval(() => { self.postMessage('tick'); }, speed);
        }
    `;
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function(e) { 
        if (e.data === 'tick') {
            loop();
            if (currentPhase === 'BUILDING' && !isBuildPaused) worker.postMessage('fast');
            else worker.postMessage('normal');
        } 
    };

    console.log("V38 Autopilot Manual Ready.");
    worker.postMessage('start');

})();