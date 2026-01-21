// ==UserScript==
// @name         Anhänger automatisch zuweisen
// @namespace    lss.anhänger.zuweisung
// @version      1.7
// @description  Alle Anhänger zuweisen laut Liste, Leitstellenweise
// @author       Manute
// @match        https://*.leitstellenspiel.de/buildings/*
// @match        https://*.leitstellenspiel.de/vehicles/*
// @match        https://*.meldkamerspel.com/buildings/*
// @match        https://*.meldkamerspel.com/vehicles/*
// @license      GNU GPLv3 
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/563402/Anh%C3%A4nger%20automatisch%20zuweisen.user.js
// @updateURL https://update.greasyfork.org/scripts/563402/Anh%C3%A4nger%20automatisch%20zuweisen.meta.js
// ==/UserScript==

/*
 * Changelog:
 * v1.7:
 * - Fix: Jedem Anhänger wird nun ein eigenes Zugfahrzeug zugewiesen (keine Doppelbelegungen mehr).
 */

(function () {
    'use strict';

    const ZUWEISUNGS_REGELN = [
        { trailerType: "174", towingType: "171" }, // Anh TeSi -> GW-Tesi
        { trailerType: "111", towingType: "90" }, // Nea50 FW -> HLF10
    ];

    const STORAGE_KEY = "trailer_queue";
    const runStoreId = "trailer_running";

    // --- IFRAME LOGIK (Der Arbeiter) ---
    if (window.top !== window.self) {
        // Status-Overlay erstellen
        const statusBox = document.createElement('div');
        statusBox.style.position = 'fixed';
        statusBox.style.top = '0';
        statusBox.style.left = '0';
        statusBox.style.background = 'rgba(255, 255, 0, 0.9)';
        statusBox.style.color = 'black';
        statusBox.style.padding = '5px 10px';
        statusBox.style.zIndex = '999999';
        statusBox.style.fontWeight = 'bold';
        statusBox.style.fontSize = '14px';
        statusBox.innerText = '🤖 Iframe: Skript gestartet...';
        document.body.appendChild(statusBox);

        console.log("[Worker] Start auf: " + location.href);

        // 1. Auf der Edit-Seite: Formular ausfüllen
        if (location.pathname.includes('/edit')) {
            statusBox.innerText = '🤖 Iframe: Suche Formular-Elemente...';

            let attempts = 0;
            const checkElements = setInterval(() => {
                attempts++;
                const randomBox = document.getElementById('vehicle_tractive_random');
                const select = document.getElementById('vehicle_tractive_vehicle_id');
                const saveBtn = document.querySelector('input[name="commit"]');

                if (randomBox && select && saveBtn) {
                    clearInterval(checkElements);
                    const queue = GM_getValue(STORAGE_KEY, []);
                    if (queue.length > 0) {
                        statusBox.innerText = `🤖 Iframe: Setze Zugfahrzeug ${queue[0].targetId}...`;
                        console.log(`[Worker] Gefunden! Setze Zugfahrzeug ID: ${queue[0].targetId}`);

                        randomBox.checked = false;
                        select.value = queue[0].targetId;

                        // Roten Rand zur Bestätigung
                        select.style.border = "3px solid red";

                        setTimeout(() => {
                            statusBox.innerText = '🤖 Iframe: Klicke Speichern...';
                            saveBtn.click();
                        }, 500);
                    } else {
                        statusBox.innerText = '🤖 Iframe: Warteschlange leer!?';
                        console.warn("[Worker] Queue ist leer, kann nichts zuweisen.");
                    }
                } else if (attempts > 20) { // Nach 10 Sekunden (20 * 500ms)
                    statusBox.innerText = '🤖 Iframe: Timeout - Elemente nicht gefunden!';
                    statusBox.style.background = 'red';
                    statusBox.style.color = 'white';
                    console.error("[Worker] Timeout: Formular-Elemente nicht gefunden. Prüfe IDs: vehicle_tractive_random, vehicle_tractive_vehicle_id");
                    clearInterval(checkElements);
                }
            }, 500);
        }
        // 2. Nach dem Speichern: Zurück auf der Fahrzeugseite
        else if (location.pathname.match(/\/vehicles\/\d+$/)) {
            statusBox.innerText = '🤖 Iframe: Speichern fertig. Melde Erfolg.';
            statusBox.style.background = 'lightgreen';
            console.log("[Worker] Speichern erkannt, sende LSS_TRAILER_NEXT");
            window.parent.postMessage({ status: 'LSS_TRAILER_NEXT' }, '*');
        }
        return;
    }

    // --- HAUPTFENSTER LOGIK (Der Manager) ---
    let currentStateSpan, progressBar;

    function createUI() {
        if (document.getElementById('trailer-assign-nav')) return;
        const parent = document.querySelector('.building-title ~ dl.dl-horizontal');
        if (parent) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-xs';
            btn.innerText = 'Anhänger-Automatik starten';
            btn.onclick = (e) => { e.preventDefault(); startProcess(); };
            const dd = document.createElement('dd'); dd.append(btn);
            const dt = document.createElement('dt'); dt.innerHTML = '<strong>Anhänger:</strong>';
            parent.append(dt, dd);
        }

        const nav = document.createElement('nav');
        nav.id = 'trailer-assign-nav';
        nav.className = 'navbar navbar-default navbar-fixed-bottom';
        nav.style.zIndex = "10000";
        nav.style.display = GM_getValue(runStoreId) ? "block" : "none";

        const wrapper = document.createElement('div');
        wrapper.style = 'display: flex; align-items: center; padding: 10px 15px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-danger btn-xs';
        cancelBtn.innerText = 'Abbrechen';
        cancelBtn.onclick = () => {
            GM_deleteValue(STORAGE_KEY);
            GM_deleteValue(runStoreId);
            location.reload();
        };

        currentStateSpan = document.createElement('span');
        currentStateSpan.className = 'label label-info';
        currentStateSpan.style = 'margin: 0 15px; min-width: 250px; text-align: center; cursor: pointer;';
        currentStateSpan.title = "Klicken, um das aktuelle Fahrzeug manuell zu öffnen (falls Iframe weiß bleibt)";
        currentStateSpan.innerText = 'Bereit...';

        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'progress';
        progressWrapper.style = 'flex: 1; margin-bottom: 0;';
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar progress-bar-success progress-bar-striped active';
        progressBar.style.width = '0%';

        progressWrapper.append(progressBar);
        wrapper.append(cancelBtn, currentStateSpan, progressWrapper);
        nav.append(wrapper);
        document.body.append(nav);
    }

    function startProcess() {
        const queue = [];
        const vehicles = [];
        // Regex für robuste ID-Erkennung
        const idRegex = /\/(\d+)/;

        document.querySelectorAll('tr.vehicle_table_searchable').forEach(row => {
            const img = row.querySelector('img[vehicle_type_id]');
            const link = row.querySelector('a[href^="/vehicles/"]:not([href$="editName"])');
            const bLink = row.querySelector('a[href^="/buildings/"]');

            if (img && link && bLink) {
                const vIdMatch = link.getAttribute('href').match(idRegex);
                const bIdMatch = bLink.getAttribute('href').match(idRegex);

                if (vIdMatch && bIdMatch) {
                    vehicles.push({
                        id: vIdMatch[1],
                        type: img.getAttribute('vehicle_type_id'),
                        buildingId: bIdMatch[1]
                    });
                }
            }
        });

        console.log(`[Manager] Gefundene Fahrzeuge: ${vehicles.length}`);

        const usedTowingIds = new Set();

        ZUWEISUNGS_REGELN.forEach(rule => {
            const trailers = vehicles.filter(v => v.type === rule.trailerType);
            trailers.forEach(t => {
                const match = vehicles.find(v =>
                    v.type === rule.towingType &&
                    v.buildingId === t.buildingId &&
                    !usedTowingIds.has(v.id)
                );

                if (match) {
                    queue.push({ trailerId: t.id, targetId: match.id });
                    usedTowingIds.add(match.id);
                } else {
                    console.log(`[Manager] Kein freies Zugfahrzeug für Anhänger ${t.id} (Typ ${t.type}) in Gebäude ${t.buildingId} gefunden.`);
                }
            });
        });

        console.log(`[Manager] Erstellte Warteschlange: ${queue.length} Paare`);

        if (queue.length === 0) { alert("Keine Paare gefunden! Eventuell Konsole prüfen."); return; }

        GM_setValue(STORAGE_KEY, queue);
        GM_setValue("total_count", queue.length);
        GM_setValue(runStoreId, true);
        runQueue();
    }

    function runQueue() {
        const queue = GM_getValue(STORAGE_KEY, []);
        const total = GM_getValue("total_count", 1);

        if (queue.length === 0) {
            currentStateSpan.innerText = "Alle Anhänger zugewiesen!";
            setTimeout(() => {
                GM_deleteValue(STORAGE_KEY);
                GM_deleteValue(runStoreId);
                location.reload();
            }, 1500);
            return;
        }

        const task = queue[0];
        const current = total - queue.length + 1;
        currentStateSpan.innerText = `Anhänger ${current} / ${total}`;
        // Link-Funktion für manuelles Öffnen bei "weißem Iframe"
        currentStateSpan.onclick = () => window.open(`/vehicles/${task.trailerId}/edit`, '_blank');

        progressBar.style.width = ((total - queue.length) / total * 100) + '%';
        document.getElementById('trailer-assign-nav').style.display = "block";

        let iframe = document.getElementById('trailer-worker-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'trailer-worker-iframe';
            // Unsichtbar im Hintergrund
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            iframe.style.visibility = 'hidden';
            iframe.style.position = 'fixed';
            document.body.appendChild(iframe);
        }

        // URL bauen
        const targetUrl = `${window.location.origin}/vehicles/${task.trailerId}/edit`;
        console.log(`[Manager] Öffne Iframe mit URL: ${targetUrl}`);

        iframe.src = targetUrl;
    }

    // Nachricht vom Iframe empfangen
    window.addEventListener('message', (event) => {
        if (event.data && event.data.status === 'LSS_TRAILER_NEXT') {
            const queue = GM_getValue(STORAGE_KEY, []);
            queue.shift();
            GM_setValue(STORAGE_KEY, queue);
            runQueue();
        }
    });

    createUI();
    if (GM_getValue(runStoreId)) runQueue();

})();