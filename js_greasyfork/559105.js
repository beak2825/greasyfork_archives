// ==UserScript==
// @name         OGame Auto Spedizioni & Manufatti - v49 (Priority Reservation)
// @namespace    http://tampermonkey.net/
// @version      49.0
// @description  Priorità assoluta Spedizioni. Manufatti usano solo slot residui (Tot - ExpMancanti - 1).
// @author       Gemini & Friend
// @match        https://*.ogame.gameforge.com/game/index.php*
// @match        https://lobby.ogame.gameforge.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559105/OGame%20Auto%20Spedizioni%20%20Manufatti%20-%20v49%20%28Priority%20Reservation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559105/OGame%20Auto%20Spedizioni%20%20Manufatti%20-%20v49%20%28Priority%20Reservation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS ---
    GM_addStyle(`
        #og-bot-panel {
            position: fixed; bottom: 10px; right: 10px; width: 270px;
            background: #161b24; color: #fff; border: 1px solid #48536b;
            z-index: 99999; padding: 10px; font-size: 11px; font-family: sans-serif;
            border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        #og-bot-panel h3 { margin: 0 0 10px 0; color: #a4b3d3; font-size: 13px; text-align: center; border-bottom: 1px solid #333; padding-bottom: 5px; }
        #og-bot-panel label { display: block; margin-top: 5px; color: #888; }
        #og-bot-panel input[type="text"], #og-bot-panel input[type="number"], #og-bot-panel select {
            width: 95%; background: #222; border: 1px solid #444; color: #ddd; padding: 3px; margin-bottom: 5px;
        }
        #og-bot-panel input[type="checkbox"] { vertical-align: middle; margin-right: 5px; }
        #og-bot-panel button { width: 100%; padding: 5px; margin-top: 10px; cursor: pointer; border: none; font-weight: bold; }
        .row { display: flex; gap: 5px; }
        .col { width: 50%; }
        .chk-group { background: #222; padding: 5px; border: 1px solid #444; margin-bottom: 5px; }
        .btn-start { background: #4CAF50; color: white; }
        .btn-stop { background: #f44336; color: white; }
        .btn-reset { background: #607D8B; color: white; margin-top: 5px !important; font-size: 9px; }
        .btn-save { background: #2196F3; color: white; margin-top: 5px !important; }
        #og-status { margin-top: 10px; color: #ff9800; text-align: center; font-weight: bold; }
        #og-target-display { text-align:center; color: #00bcd4; font-weight:bold; margin-top:5px; }
        #og-debug { margin-top: 5px; color: #777; text-align: center; font-size: 10px; font-family: monospace; }
    `);

    // --- VARIABILI ---
    var SETTINGS = {
        targetUniverse: 'Nembus',
        enableExp: true,
        enableArt: false,
        moonId: '',
        startGalaxy: '',
        startSystem: '',
        presetName: 'reaper',
        fleetsPerSystem: 3,
        randMin: 8,
        randMax: 15,
        waitHub: 15,
        waitAcc: 10
    };
    var IS_RUNNING = false;
    var LOG_PREFIX = "[BOT v49] ";

    // Immagine icona per riconoscere il volo Manufatti
    const ARTIFACT_IMG_SIG = "1fc8d15445e97c10c7b6881bccabb2.gif";

    // --- STORAGE ---
    function log(txt) {
        console.log(LOG_PREFIX + txt);
        var el = document.getElementById('og-status');
        if (el) el.innerText = txt;
    }
    function debug(txt) {
        var el = document.getElementById('og-debug');
        if (el) el.innerText = txt;
    }
    function updateTargetDisplay() {
        var el = document.getElementById('og-target-display');
        if (el && SETTINGS.startGalaxy) {
            var r = parseInt(getStore('og_rotation_counter') || '0');
            var s = calculateSystem(r);
            el.innerText = "Target: [" + SETTINGS.startGalaxy + ":" + s + "]";
        }
    }
    function loadSettings() {
        var s = localStorage.getItem('og_bot_settings_v49');
        if (s) SETTINGS = JSON.parse(s);
        IS_RUNNING = (localStorage.getItem('og_bot_running') === 'true');
    }
    function saveSettings() {
        localStorage.setItem('og_bot_settings_v49', JSON.stringify(SETTINGS));
        localStorage.setItem('og_bot_running', IS_RUNNING);
    }
    function getStore(k) { return localStorage.getItem(k); }
    function setStore(k, v) { localStorage.setItem(k, v); }

    // --- PARSER TEMPI ---
    function parseDuration(str) {
        if (!str) return 999999;
        str = str.toLowerCase().trim();
        var s = 0; var found = false;
        var match = str.match(/(\d+)\s*[gd]/); if(match){s+=parseInt(match[1])*86400;found=true;}
        match = str.match(/(\d+)\s*[ho]/); if(match){s+=parseInt(match[1])*3600;found=true;}
        match = str.match(/(\d+)\s*m/); if(match){s+=parseInt(match[1])*60;found=true;}
        match = str.match(/(\d+)\s*s/); if(match){s+=parseInt(match[1]);found=true;}
        if(!found && !isNaN(str)) return parseInt(str);
        return (s > 0) ? s : 999999;
    }

    // --- SCANNER LUNE ---
    function getAvailableMoons() {
        var moons = [];
        var planets = document.querySelectorAll('#planetList .smallplanet');
        planets.forEach(function(p) {
            var planetDivId = p.id;
            var planetIdNum = planetDivId.replace('planet-', '');
            var moonLink = p.querySelector('a.moonlink');
            if (moonLink) {
                var href = moonLink.getAttribute('href');
                var idMatch = href.match(/cp=(\d+)/);
                var moonId = idMatch ? idMatch[1] : null;
                if (moonId && moonId !== planetIdNum) {
                    var coordEl = p.querySelector('.planet-koords');
                    var rawCoords = coordEl ? coordEl.innerText : "";
                    var cleanCoords = rawCoords.replace(/[\[\]]/g, '');
                    var parts = cleanCoords.split(':');
                    if (parts.length >= 3) {
                        moons.push({
                            id: moonId, gal: parts[0], sys: parts[1], text: "[" + cleanCoords + "] LUNA"
                        });
                    }
                }
            }
        });
        return moons;
    }

    // --- GUI ---
    function createInterface() {
        if (document.getElementById('og-bot-panel')) return;

        var div = document.createElement('div');
        div.id = 'og-bot-panel';
        div.innerHTML = `
            <h3>OGame Bot - v49 (Priority)</h3>

            <div class="chk-group">
                <label style="color:#fff"><input type="checkbox" id="chk-exp"> Spedizioni</label>
                <label style="color:#fff"><input type="checkbox" id="chk-art"> Manufatti</label>
            </div>

            <label>Universo:</label>
            <input type="text" id="inp-uni" value="${SETTINGS.targetUniverse}">

            <label>Seleziona Luna:</label>
            <select id="sel-moon" style="font-family: monospace; font-size: 11px;">
                <option value="">-- Scansiona Lune --</option>
            </select>

            <label>Nome Preset (Sped):</label>
            <input type="text" id="inp-preset" value="${SETTINGS.presetName}">

            <label>Flotte x Sys (Sped):</label>
            <input type="number" id="inp-freq" value="${SETTINGS.fleetsPerSystem}">

            <div class="row">
                <div class="col"><label>Min. Rfr:</label><input type="number" id="inp-rmin" value="${SETTINGS.randMin}"></div>
                <div class="col"><label>Max. Rfr:</label><input type="number" id="inp-rmax" value="${SETTINGS.randMax}"></div>
            </div>

            <button id="btn-toggle" class="${IS_RUNNING ? 'btn-stop' : 'btn-start'}">
                ${IS_RUNNING ? 'STOP' : 'START'}
            </button>
            <div class="row">
                <button id="btn-save" class="btn-save" style="width:70%">Salva</button>
                <button id="btn-reset" class="btn-reset" style="width:30%">RST</button>
            </div>

            <div id="og-status">In attesa...</div>
            <div id="og-target-display"></div>
            <div id="og-debug">Ready</div>
        `;
        document.body.appendChild(div);

        document.getElementById('chk-exp').checked = SETTINGS.enableExp;
        document.getElementById('chk-art').checked = SETTINGS.enableArt;

        var moonSelect = document.getElementById('sel-moon');
        var moons = getAvailableMoons();
        if (moons.length > 0) {
            moonSelect.innerHTML = "";
            moons.forEach(function(m) {
                var opt = document.createElement('option');
                opt.value = m.id + "|" + m.gal + "|" + m.sys;
                opt.text = m.text;
                moonSelect.appendChild(opt);
                if (SETTINGS.moonId == m.id) opt.selected = true;
            });
        } else {
            moonSelect.innerHTML = "<option>Nessuna Luna Trovata</option>";
        }

        document.getElementById('btn-save').onclick = function() {
            SETTINGS.targetUniverse = document.getElementById('inp-uni').value;
            SETTINGS.enableExp = document.getElementById('chk-exp').checked;
            SETTINGS.enableArt = document.getElementById('chk-art').checked;
            SETTINGS.presetName = document.getElementById('inp-preset').value;
            SETTINGS.fleetsPerSystem = parseInt(document.getElementById('inp-freq').value);
            SETTINGS.randMin = parseInt(document.getElementById('inp-rmin').value);
            SETTINGS.randMax = parseInt(document.getElementById('inp-rmax').value);

            var selVal = document.getElementById('sel-moon').value;
            if (selVal && selVal.indexOf('|') !== -1) {
                var parts = selVal.split('|');
                SETTINGS.moonId = parts[0];
                SETTINGS.startGalaxy = parts[1];
                SETTINGS.startSystem = parts[2];
                log("Salvato.");
            }
            saveSettings();
            updateTargetDisplay();
        };

        document.getElementById('btn-reset').onclick = function() {
            setStore('og_step', 'CHECK');
            setStore('og_next_check', '0');
            setStore('og_next_random_refresh', '0');
            setStore('og_artifact_cooldown', '0');
            log("Reset.");
            setTimeout(() => window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement', 500);
        };

        document.getElementById('btn-toggle').onclick = function() {
            IS_RUNNING = !IS_RUNNING;
            saveSettings();
            var btn = document.getElementById('btn-toggle');
            if (IS_RUNNING) {
                btn.className = 'btn-stop'; btn.innerText = 'STOP';
                log("Avvio...");
                if (window.location.host.indexOf('lobby') === -1) runGame();
            } else {
                btn.className = 'btn-start'; btn.innerText = 'START';
                log("Fermato.");
            }
        };
        updateTargetDisplay();
    }

    // --- LOBBY ---
    function runLobby() {
        if (!IS_RUNNING) return;
        setInterval(function() {
            if (!IS_RUNNING) return;
            var lastTry = parseInt(getStore('og_last_login_try') || '0');
            if (Date.now() - lastTry < 120000) return;

            var url = window.location.href;
            if (url.indexOf('/hub') !== -1) {
                var btn = document.querySelector('button.button-primary');
                if (btn) { setStore('og_last_login_try', Date.now()); setTimeout(() => btn.click(), SETTINGS.waitHub * 1000); }
            } else if (url.indexOf('/accounts') !== -1) {
                var rows = document.querySelectorAll('div[role="row"], .rt-tr-group');
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].innerText.indexOf(SETTINGS.targetUniverse) !== -1) {
                        var btnPlay = rows[i].querySelector('button.btn-primary') || rows[i].querySelector('button');
                        if (btnPlay) { setStore('og_last_login_try', Date.now()); setTimeout(() => btnPlay.click(), SETTINGS.waitAcc * 1000); return; }
                    }
                }
            }
        }, 2000);
    }

    // --- GIOCO ---
    function runGame() {
        if (!IS_RUNNING) { log("PAUSA"); return; }

        if (window.location.href.indexOf('component=fleetdispatch') !== -1) {
             log("Anti-Loop: torno ai movimenti.");
             setStore('og_step', 'CHECK');
             setStore('og_next_check', '0');
             setTimeout(() => { window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement'; }, 1000);
             return;
        }

        if (!SETTINGS.moonId || !SETTINGS.startGalaxy) {
            log("ERRORE: Seleziona Luna!");
            return;
        }

        updateTargetDisplay();
        var step = getStore('og_step') || 'CHECK';

        if (step === 'CHECK') {
            doCheckMovement();
        } else if (step === 'SEND_EXP') {
            doSendExpeditions();
        } else if (step === 'SEND_ART') {
            doSendArtifacts();
        }
    }

    // --- STEP 1: CHECK (Movement Tab) ---
    function doCheckMovement() {
        if (window.location.href.indexOf('component=movement') === -1) {
            var nextTime = parseInt(getStore('og_next_check') || '0');
            if (Date.now() < nextTime) {
                var left = Math.round((nextTime - Date.now()) / 1000);
                log("Attesa (" + left + "s)");
                setTimeout(() => { if(IS_RUNNING) window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement'; }, 2000);
                return;
            }
            window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement';
            return;
        }

        setTimeout(function() {
            var expBox = document.querySelector('.expSlots');
            var fleetBox = document.querySelector('.fleetSlots');

            var currentExp = 99, maxExp = 0, currentFleet = 99, maxFleet = 0;

            if (expBox) {
                currentExp = parseInt(expBox.querySelector('.current').innerText);
                maxExp = parseInt(expBox.querySelector('.all').innerText);
            }
            if (fleetBox) {
                currentFleet = parseInt(fleetBox.querySelector('.current').innerText);
                maxFleet = parseInt(fleetBox.querySelector('.all').innerText);
            }

            var artifactCount = 0;
            var fleets = document.querySelectorAll('.fleetDetails');
            fleets.forEach(function(f) {
                if (f.innerHTML.indexOf(ARTIFACT_IMG_SIG) !== -1 || f.innerHTML.indexOf('Ricerca Forme di vita') !== -1) {
                    artifactCount++;
                }
            });

            // Calcolo Riserva per Spedizioni
            // Slot da preservare = (Slot Max Spedizioni - Spedizioni Attuali)
            // Se le spedizioni sono disabilitate, la riserva è 0.
            var slotsNeededForExp = SETTINGS.enableExp ? Math.max(0, maxExp - currentExp) : 0;
            var serviceSlot = 1; // Slot di sicurezza sempre libero

            // Slot effettivamente disponibili per i Manufatti
            // Totali liberi - Quelli che servono alle exp - 1 sicurezza
            var availableForArt = (maxFleet - currentFleet) - slotsNeededForExp - serviceSlot;

            debug("E:" + currentExp + "/" + maxExp + " | F:" + currentFleet + "/" + maxFleet + " | ArtAvail:" + availableForArt);

            // 1. PRIORITÀ: SPEDIZIONI
            // Condizione: Abilitate, non piene, e c'è almeno 1 slot fisico (o quello riservato) libero
            // Nota: Le spedizioni hanno i loro slot dedicati, ma occupano comunque uno slot flotta.
            // Poiché abbiamo riservato gli slot flotta per loro, se currentExp < maxExp, DOVREBBE esserci spazio flotta.
            if (SETTINGS.enableExp && currentExp < maxExp && currentFleet < (maxFleet - serviceSlot)) {
                log("Spedizioni Priority. Go!");
                setStore('og_step', 'SEND_EXP');
                setTimeout(() => {
                    window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId;
                }, 1000);
                return;
            }

            // 2. MANUFATTI
            // Condizione: Abilitati, e il calcolo della riserva dice che c'è spazio (> 0)
            if (SETTINGS.enableArt && availableForArt > 0) {
                var artCooldown = parseInt(getStore('og_artifact_cooldown') || '0');
                if (Date.now() > artCooldown) {
                    log("Manufatti: Spazio Libero ("+availableForArt+"). Go!");
                    setStore('og_step', 'SEND_ART');
                    setTimeout(() => {
                        window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId;
                    }, 1000);
                    return;
                } else {
                    log("Pausa tecnica Manufatti.");
                }
            }

            // 3. FULL o COOLDOWN
            // Se siamo qui, o è tutto pieno, o stiamo rispettando la riserva spedizioni
            scheduleSmartWait(currentFleet >= (maxFleet - serviceSlot));

        }, 1500);
    }

    function scheduleSmartWait(slotsFull) {
        var bestTime = 999999;
        var timers = document.querySelectorAll('.timer, .nextTimer');
        timers.forEach(t => { var s = parseDuration(t.innerText); if (s > 0 && s < bestTime) bestTime = s; });

        var nextRandomTime = parseInt(getStore('og_next_random_refresh') || '0');
        if (Date.now() > nextRandomTime) {
            var minMs = SETTINGS.randMin * 60 * 1000;
            var maxMs = SETTINGS.randMax * 60 * 1000;
            var delay = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
            nextRandomTime = Date.now() + delay;
            setStore('og_next_random_refresh', nextRandomTime);
        }
        var secondsToRandom = Math.max(0, Math.round((nextRandomTime - Date.now()) / 1000));

        var secondsToArtCool = 0;
        var artCool = parseInt(getStore('og_artifact_cooldown') || '0');
        if (Date.now() < artCool) secondsToArtCool = Math.round((artCool - Date.now()) / 1000);

        var finalWait = 60;
        var reason = "";

        // Se è pieno, aspetto rientro. Se no, aspetto random/cooldown
        if (slotsFull) {
            var buffer = 60 + Math.floor(Math.random() * 60);
            if (bestTime < secondsToRandom) {
                finalWait = bestTime + buffer;
                reason = "Rientro + Buffer";
            } else {
                finalWait = secondsToRandom;
                reason = "Random Act";
            }
        } else {
            if (secondsToArtCool > 0) {
                finalWait = secondsToArtCool + 2;
                reason = "Tech Cool";
            } else {
                finalWait = secondsToRandom;
                reason = "Random Refresh";
            }
        }

        if (finalWait < 5) finalWait = 5;

        log("Wait " + finalWait + "s (" + reason + ")");
        setStore('og_next_check', Date.now() + (finalWait * 1000));
        setTimeout(() => window.location.reload(), (finalWait * 1000) + 1000);
    }

    function incrementSystemCounter(currentRot) {
        var fps = SETTINGS.fleetsPerSystem;
        var currentBlock = Math.floor(currentRot / fps);
        var nextBlockStart = (currentBlock + 1) * fps;
        return nextBlockStart;
    }

    // --- STEP 2: SEND EXPEDITIONS ---
    function doSendExpeditions() {
        if (window.location.href.indexOf('component=galaxy') === -1) {
             var r = parseInt(getStore('og_rotation_counter') || '0');
             var s = calculateSystem(r);
             window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId + "&galaxy=" + SETTINGS.startGalaxy + "&system=" + s;
             return;
        }

        var rotationCounter = parseInt(getStore('og_rotation_counter') || '0');
        var targetSystem = calculateSystem(rotationCounter);
        var sysInput = document.getElementById('system_input');

        if ((sysInput && sysInput.value != targetSystem)) {
             window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId + "&galaxy=" + SETTINGS.startGalaxy + "&system=" + targetSystem;
             return;
        }

        setTimeout(function() {
            var found = false;
            var allSelects = document.getElementsByTagName('select');
            for(var s=0; s<allSelects.length; s++) {
                if(allSelects[s].className.indexOf('fleetHelper') !== -1 || true) {
                    for(var o=0; o<allSelects[s].options.length; o++) {
                        if (allSelects[s].options[o].text.toLowerCase().indexOf(SETTINGS.presetName.toLowerCase()) !== -1) {
                            allSelects[s].value = allSelects[s].options[o].value;
                            allSelects[s].dispatchEvent(new Event('change', {bubbles:true}));
                            found = true; break;
                        }
                    }
                } if(found) break;
            }

            setTimeout(function() {
                var btnSend = document.getElementById('sendExpeditionFleetTemplateFleet') || document.querySelector('.btn_blue.float_right');
                if (btnSend) {
                    log("Invio EXP");
                    btnSend.click();
                    setStore('og_rotation_counter', rotationCounter + 1);
                    setStore('og_step', 'CHECK');
                    setStore('og_next_check', '0');
                    setTimeout(() => window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement', 1500);
                } else {
                    log("Btn non trovato. Torno.");
                    setStore('og_step', 'CHECK');
                    window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement';
                }
            }, 800 + (Math.random() * 400));
        }, 1200 + (Math.random() * 400));
    }

    // --- STEP 3: SEND ARTIFACTS ---
    function doSendArtifacts() {
        if (window.location.href.indexOf('component=galaxy') === -1) {
             var r = parseInt(getStore('og_rotation_counter') || '0');
             var s = calculateSystem(r);
             window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId + "&galaxy=" + SETTINGS.startGalaxy + "&system=" + s;
             return;
        }

        var rotationCounter = parseInt(getStore('og_rotation_counter') || '0');
        var targetSystem = calculateSystem(rotationCounter);
        var sysInput = document.getElementById('system_input');

        if ((sysInput && sysInput.value != targetSystem)) {
             window.location.href = window.location.origin + window.location.pathname + "?page=ingame&component=galaxy&cp=" + SETTINGS.moonId + "&galaxy=" + SETTINGS.startGalaxy + "&system=" + targetSystem;
             return;
        }

        setTimeout(function() {
            var btnDiscovery = document.getElementById('discoverSystemBtn');
            if (btnDiscovery) {
                log("Invio Manufatti...");
                btnDiscovery.click();
            } else {
                log("Tasto Assente.");
            }

            // Check post-click
            setTimeout(function() {
                var statusRow = document.getElementById('fleetstatusrow');
                var moveNext = false;

                if (statusRow) {
                    var text = statusRow.innerText.trim();
                    log("Stato: " + text);
                    if (text.indexOf('0') !== -1 || text.indexOf('Errore') !== -1) moveNext = true;
                } else {
                    moveNext = true;
                }

                // SMART JUMP
                var nextRot = incrementSystemCounter(rotationCounter);
                setStore('og_rotation_counter', nextRot);

                log("Done. Torno a controllo.");
                setStore('og_step', 'CHECK');
                setStore('og_artifact_cooldown', Date.now() + 3000);
                setStore('og_next_check', '0');

                setTimeout(() => window.location.href = window.location.origin + window.location.pathname + '?page=ingame&component=movement', 1000);

            }, 1500);
        }, 1500);
    }

    function calculateSystem(rot) {
        var baseSystem = parseInt(SETTINGS.startSystem);
        var fleetsPerSys = SETTINGS.fleetsPerSystem;
        var groupIdx = Math.floor(rot / fleetsPerSys);
        var offset = 0;
        if (groupIdx % 2 === 0) offset = (groupIdx / 2) + 1;
        else offset = -Math.ceil(groupIdx / 2);
        var t = baseSystem + offset;
        if (t > 499) t = (t % 499);
        if (t < 1) t = 499 + t;
        return t;
    }

    loadSettings();
    if (window.location.host.indexOf('lobby') !== -1) { createInterface(); runLobby(); }
    else { createInterface(); setTimeout(runGame, 1000); }

})();