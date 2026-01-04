// ==UserScript==
// @name         Steam Playtest Bulk Feeder V2.3 (Fix Encoding)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Korrigiert das Sendeformat (x-www-form-urlencoded), damit Steam die Anfragen akzeptiert.
// @author       Gemini
// @match        https://store.steampowered.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560444/Steam%20Playtest%20Bulk%20Feeder%20V23%20%28Fix%20Encoding%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560444/Steam%20Playtest%20Bulk%20Feeder%20V23%20%28Fix%20Encoding%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initOverlay() {
        if (document.getElementById('playtest-feeder-ui')) return;

        // --- KONFIGURATION ---
        const SAFE_DELAY = 5000; // 5 Sekunden (Sicherheit)
        const STORAGE_KEY = 'steam_playtest_processed_ids_v2'; 

        // --- UI ---
        const div = document.createElement('div');
        div.id = 'playtest-feeder-ui';
        Object.assign(div.style, {
            position: 'fixed', top: '100px', right: '20px',
            backgroundColor: '#1b2838', border: '2px solid #a4d007', // Grüner Rand für "Fixed"
            padding: '15px', zIndex: '2147483647', width: '350px',
            color: 'white', fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 20px rgba(0,0,0,0.9)', borderRadius: '8px'
        });

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="margin:0; color:#a4d007; font-size:16px;">🚀 Feeder V2.3 (Fixed)</h3>
                <button id="closeUiBtn" style="background:none; border:none; color:#aaa; cursor:pointer;">X</button>
            </div>
            <p style="font-size:11px; color:#8f98a0; margin-bottom:5px;">
                Korrigiertes Protokoll. Ignoriert Fehler automatisch.<br>
                Pause: <b>${SAFE_DELAY/1000}s</b>
            </p>
            <textarea id="appIdInput" placeholder="IDs hier einfügen..." style="width:100%; height:80px; background:#2a475e; color:white; border:1px solid #000; font-size:11px; padding:5px;"></textarea>

            <div style="margin-top:10px; display:flex; gap:5px;">
                <button id="startBtn" style="flex:2; background:#5c7e10; color:white; border:none; padding:8px; cursor:pointer; font-weight:bold;">▶ START</button>
                <button id="resetMemBtn" style="flex:1; background:#3a2020; color:#c94a4a; border:1px solid #c94a4a; padding:5px; cursor:pointer; font-size:10px;">Reset</button>
            </div>

            <div id="progressBar" style="width:0%; height:3px; background:#a4d007; margin-top:10px; transition:width 0.5s;"></div>
            <div id="logOutput" style="margin-top:5px; height:200px; overflow-y:auto; font-size:10px; background:#101822; padding:5px; border:1px solid #333; font-family:monospace; white-space: pre-wrap;"></div>
        `;

        document.body.appendChild(div);

        let processedIDs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        
        document.getElementById('closeUiBtn').addEventListener('click', () => { div.style.display = 'none'; });

        const log = (msg, color = '#bfbfbf') => {
            const logArea = document.getElementById('logOutput');
            const entry = document.createElement('div');
            entry.style.color = color;
            entry.style.borderBottom = "1px solid #1a242f";
            entry.innerHTML = `<span style="opacity:0.5">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
            logArea.appendChild(entry);
            logArea.scrollTop = logArea.scrollHeight;
        };

        const saveID = (id) => {
            if (!processedIDs.includes(id)) {
                processedIDs.push(id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(processedIDs));
            }
        };

        const joinPlaytest = async (appid) => {
            if (typeof g_sessionID === 'undefined') {
                log("FEHLER: Nicht eingeloggt.", "red");
                return false;
            }

            // KORREKTUR: URLSearchParams erzwingt 'application/x-www-form-urlencoded'
            const params = new URLSearchParams();
            params.append('sessionid', g_sessionID);

            try {
                const response = await fetch(`https://store.steampowered.com/ajaxrequestplaytestaccess/${appid}`, {
                    method: 'POST',
                    body: params, // Hier nutzen wir params statt formData
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest' // Steam mag diesen Header oft gerne
                    }
                });

                // Prüfen auf Weiterleitung (passiert bei ungültigen Playtest-IDs)
                if (response.redirected) {
                    log(`⚠️ <b>${appid}</b>: Kein Playtest (Redirect).`, "#555");
                    return true; // Abhaken
                }

                let data;
                try {
                    const text = await response.text();
                    // Manchmal schickt Steam HTML statt JSON bei Fehlern
                    if (text.trim().startsWith("<")) {
                        log(`❌ <b>${appid}</b>: Kein gültiger Endpunkt.`, "#555");
                        return true; 
                    }
                    data = JSON.parse(text);
                } catch (e) {
                    log(`❓ <b>${appid}</b>: Antwort nicht lesbar.`, "orange");
                    return true;
                }

                // Auswertung
                if (data.success === 1) {
                    log(`✅ <b>${appid}</b>: Beigetreten!`, "#a4d007");
                } else if (data.success === 2) {
                    log(`👌 <b>${appid}</b>: Bereits Teilnehmer.`, "#66c0f4");
                } else if (data === false) {
                    // Das ist der Fehler von vorhin, sollte mit dem Fix nicht mehr kommen
                    // Falls doch, bedeutet es "Server hat abgelehnt ohne Grund"
                    log(`❌ <b>${appid}</b>: Abgelehnt (Generic False).`, "red");
                } else {
                    log(`⚠️ <b>${appid}</b>: Code ${data.success}`, "orange");
                }
                
                return true;
            } catch (error) {
                console.error(error);
                log(`❌ <b>${appid}</b>: Netzwerk-Fehler`, "red");
                return false; 
            }
        };

        document.getElementById('startBtn').addEventListener('click', async function() {
            const btn = this;
            const input = document.getElementById('appIdInput').value;
            // Verbesserter Splitter, der auch Tabulatoren etc frisst
            const rawIds = input.split(/[\s,]+/).map(s => s.trim()).filter(s => s && !isNaN(s));
            const todoIds = rawIds.filter(id => !processedIDs.includes(id));

            if (todoIds.length === 0) {
                log("Keine neuen IDs.", "yellow");
                return;
            }

            btn.disabled = true; btn.innerText = "LÄUFT..."; 
            log(`Starte ${todoIds.length} IDs...`, "white");

            for (let i = 0; i < todoIds.length; i++) {
                const id = todoIds[i];
                document.getElementById('progressBar').style.width = Math.round(((i + 1) / todoIds.length) * 100) + "%";
                
                if (await joinPlaytest(id)) saveID(id);

                if (i < todoIds.length - 1) {
                    await new Promise(r => setTimeout(r, SAFE_DELAY));
                }
            }
            log("🎉 FERTIG!", "#a4d007");
            btn.disabled = false; btn.innerText = "▶ START";
        });

        document.getElementById('resetMemBtn').addEventListener('click', () => {
            if(confirm("Verlauf löschen?")) {
                processedIDs = []; localStorage.removeItem(STORAGE_KEY);
                log("Speicher gelöscht.", "red");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initOverlay);
    } else {
        initOverlay();
    }
    setTimeout(initOverlay, 2000);
})();