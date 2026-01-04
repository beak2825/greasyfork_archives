// ==UserScript==
// @name         LSS Auto-Funktionen (mit Fallback-Einklappen)
// @namespace    Hendrik
// @version      3.1
// @description  Verbessert die Fortschrittsanzeige und ist kompatibel mit LSSM und alternativem Einklapp-Skript.
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548378/LSS%20Auto-Funktionen%20%28mit%20Fallback-Einklappen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548378/LSS%20Auto-Funktionen%20%28mit%20Fallback-Einklappen%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ########## KONFIGURATION ##########
    const CREDIT_THRESHOLD = 5000;
    const BATCH_SIZE = 30;
    const DELAY_BETWEEN_BATCHES = 500;
    const NOTIZ_ZEIT_IN_MINUTEN = 180;
    // ###################################

    // --- LocalStorage Keys ---
    const PROCESSED_KEY = 'auto_note_done_v12';
    const TOGGLE_KEY = 'auto_funktionen_active';
    const AUTO_COLLAPSE_SMALL_KEY = 'auto_collapse_small_active';
    const MAX_SHARE_KEY = 'max_share_limit_v1';
    const COLLAPSE_DONE_KEY = 'auto_collapse_done_active';

    // --- State-Variablen ---
    const processed = new Set(JSON.parse(localStorage.getItem(PROCESSED_KEY) || '[]'));
    let isActive = JSON.parse(localStorage.getItem(TOGGLE_KEY) || 'false');
    let isAutoCollapseSmallActive = JSON.parse(localStorage.getItem(AUTO_COLLAPSE_SMALL_KEY) || 'false');
    let isCollapseDoneActive = JSON.parse(localStorage.getItem(COLLAPSE_DONE_KEY) || 'false');
    let maxShareCount = parseInt(localStorage.getItem(MAX_SHARE_KEY) || '0', 10);
    let processedTowardsLimit = 0;

    // Manuelle Erweiterungen werden nun für 15 Sekunden respektiert
    const manuallyExpanded = new Map();

    let totalToProcess = 0, sharedCount = 0, notedCount = 0;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function isTextFieldActive() {
        return document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable);
    }

    // --- Speicher-Funktionen ---
    function saveProcessed() { localStorage.setItem(PROCESSED_KEY, JSON.stringify([...processed])); }
    function saveMainToggle() { localStorage.setItem(TOGGLE_KEY, JSON.stringify(isActive)); }
    function saveAutoCollapseSmallToggle() { localStorage.setItem(AUTO_COLLAPSE_SMALL_KEY, JSON.stringify(isAutoCollapseSmallActive)); }
    function saveMaxShareCount() { localStorage.setItem(MAX_SHARE_KEY, String(maxShareCount)); }
    function saveCollapseDoneToggle() { localStorage.setItem(COLLAPSE_DONE_KEY, JSON.stringify(isCollapseDoneActive)); }

    function updateProgress() {
        const indicator = document.getElementById('progress-indicator');
        if (!indicator) return;

        if (totalToProcess === 0 && isActive) {
            indicator.innerHTML = '✨ Alles erledigt';
            indicator.style.backgroundColor = '#2c3e50';
        } else if (!isActive) {
            indicator.innerHTML = `⌛ ${totalToProcess} Einsätze bereit`;
            indicator.style.backgroundColor = '#3498db';
        } else {
            const limitText = maxShareCount > 0 ? ` (Limit: ${processedTowardsLimit}/${maxShareCount})` : '';
            indicator.innerHTML = `⚙️ Bereit: ${totalToProcess}${limitText} | Geteilt: ${sharedCount} | Notiz: ${notedCount}`;
            indicator.style.backgroundColor = '#27ae60';
        }
    }

    function createButtons() {
        const header = document.querySelector('#mission_list + .panel-body') || document.querySelector('#mission_list')?.parentElement;
        if (!header || document.getElementById('autoFunktionenToggleBtn')) return;
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '5px' });

        const mainToggleBtn = document.createElement('button');
        mainToggleBtn.id = 'autoFunktionenToggleBtn';
        mainToggleBtn.textContent = isActive ? 'Auto: AN' : 'Auto: AUS';
        Object.assign(mainToggleBtn.style, { backgroundColor: isActive ? '#2ecc71' : '#e74c3c', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        mainToggleBtn.addEventListener('click', () => {
            isActive = !isActive;
            if (isActive) processedTowardsLimit = 0;
            mainToggleBtn.textContent = isActive ? 'Auto: AN' : 'Auto: AUS';
            mainToggleBtn.style.backgroundColor = isActive ? '#2ecc71' : '#e74c3c';
            saveMainToggle();
            updateProgress();
        });
        buttonContainer.appendChild(mainToggleBtn);

        const autoCollapseSmallBtn = document.createElement('button');
        autoCollapseSmallBtn.id = 'autoCollapseSmallBtn';
        const threshold_k = CREDIT_THRESHOLD / 1000;
        const getCollapseButtonText = () => `Einklappen (<${threshold_k}k): ${isAutoCollapseSmallActive ? 'AN' : 'AUS'}`;
        autoCollapseSmallBtn.textContent = getCollapseButtonText();
        Object.assign(autoCollapseSmallBtn.style, { backgroundColor: isAutoCollapseSmallActive ? '#3498db' : '#95a5a6', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        autoCollapseSmallBtn.addEventListener('click', () => {
            isAutoCollapseSmallActive = !isAutoCollapseSmallActive;
            autoCollapseSmallBtn.textContent = getCollapseButtonText();
            autoCollapseSmallBtn.style.backgroundColor = isAutoCollapseSmallActive ? '#3498db' : '#95a5a6';
            saveAutoCollapseSmallToggle();
        });
        buttonContainer.appendChild(autoCollapseSmallBtn);

        const collapseDoneBtn = document.createElement('button');
        collapseDoneBtn.id = 'collapseDoneBtn';
        const getCollapseDoneText = () => `Fertige einklappen: ${isCollapseDoneActive ? 'AN' : 'AUS'}`;
        collapseDoneBtn.textContent = getCollapseDoneText();
        Object.assign(collapseDoneBtn.style, { backgroundColor: isCollapseDoneActive ? '#8e44ad' : '#95a5a6', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        collapseDoneBtn.addEventListener('click', () => {
            isCollapseDoneActive = !isCollapseDoneActive;
            collapseDoneBtn.textContent = getCollapseDoneText();
            collapseDoneBtn.style.backgroundColor = isCollapseDoneActive ? '#8e44ad' : '#95a5a6';
            saveCollapseDoneToggle();
        });
        buttonContainer.appendChild(collapseDoneBtn);

        const forceAllButton = document.createElement('button');
        forceAllButton.id = 'forceAllNotesBtn';
        forceAllButton.textContent = 'Alle Notizen 🔄';
        Object.assign(forceAllButton.style, { backgroundColor: '#f39c12', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        forceAllButton.addEventListener('click', async () => {
            if (confirm('Sollen wirklich für ALLE großen Einsätze die Notizen neu erstellt werden? (Respektiert das Limit)')) {
                forceAllButton.disabled = true;
                forceAllButton.textContent = 'Wird ausgeführt...';
                await forceProcessAllMissions();
                forceAllButton.disabled = false;
                forceAllButton.textContent = 'Alle Notizen 🔄';
            }
        });
        buttonContainer.appendChild(forceAllButton);

        const limitControlContainer = document.createElement('div');
        limitControlContainer.id = 'limitControlContainer';
        Object.assign(limitControlContainer.style, { display: 'flex', alignItems: 'center', gap: '4px' });
        const limitToggleButton = document.createElement('button');
        limitToggleButton.id = 'limitToggleButton';
        limitToggleButton.innerHTML = `<svg aria-hidden="true" focusable="false" style="width:14px; height:14px; vertical-align: middle;" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M3.853 54.87C10.47 40.9 24.54 32 40 32H472c15.46 0 29.53 8.901 36.15 22.87C514.8 66.71 512.4 81.2 502.6 90.4L320 272.7V424c0 12.46-7.405 23.47-18.78 28.45C289.8 457.4 276.5 455.7 267.9 447L203.9 383C196.2 375.3 192 364.3 192 353.2V272.7L9.424 90.4C-.4458 81.2-2.812 66.71 3.853 54.87z"></path></svg>`;
        Object.assign(limitToggleButton.style, { backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const updateLimitButtonState = () => { maxShareCount > 0 ? (limitToggleButton.style.backgroundColor = '#3498db', limitToggleButton.title = `Limit für geteilte Einsätze: ${maxShareCount}`) : (limitToggleButton.style.backgroundColor = '#34495e', limitToggleButton.title = 'Limit für geteilte Einsätze festlegen (aktuell: unbegrenzt)') };
        limitToggleButton.addEventListener('click', e => { e.stopPropagation(); if (document.getElementById('maxShareInput')) { document.getElementById('maxShareInput').focus(); return } const t = document.createElement('input'); t.type = 'number', t.id = 'maxShareInput', t.placeholder = 'Alle', t.value = maxShareCount > 0 ? maxShareCount : '', Object.assign(t.style, { width: '70px', border: '1px solid #bdc3c7', borderRadius: '3px', padding: '3px 5px', fontSize: '12px' }); const n = () => { const e = parseInt(t.value, 10); maxShareCount = isNaN(e) || e <= 0 ? 0 : e, saveMaxShareCount(), updateLimitButtonState(), document.body.contains(t) && limitControlContainer.removeChild(t), handleMissionProcessing() }; t.addEventListener('blur', n), t.addEventListener('keydown', e => { 'Enter' === e.key ? t.blur() : 'Escape' === e.key && document.body.contains(t) && limitControlContainer.removeChild(t) }), limitControlContainer.appendChild(t), t.focus() });
        limitControlContainer.appendChild(limitToggleButton);
        buttonContainer.appendChild(limitControlContainer);
        updateLimitButtonState();

        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'progress-indicator';
        Object.assign(progressIndicator.style, { padding: '4px 10px', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', transition: 'background-color 0.5s' });
        buttonContainer.appendChild(progressIndicator);
        updateProgress();

        header.prepend(buttonContainer);
    }

    const lssmCollapseIconName = 'down-left-and-up-right-to-center';

    // --- NEUE, ROBUSTERE EINKLAPP-FUNKTIONEN ---

    function handleManualExpansion(e) {
        const missionEntry = e.target.closest('.missionSideBarEntry');
        if (!missionEntry) return;

        const missionId = missionEntry.getAttribute("mission_id");
        if (!missionId) return;

        // LSSM-Button
        const lssmBtn = missionEntry.querySelector("button.lssmv4-extendedCallList_collapsable-missions_btn");
        if (lssmBtn && lssmBtn.contains(e.target)) {
            manuallyExpanded.set(missionId, Date.now());
            return;
        }

        // Fallback-Button
        const fallbackBtn = missionEntry.querySelector('.collapse-button-tm');
        if (fallbackBtn && fallbackBtn.contains(e.target)) {
            manuallyExpanded.set(missionId, Date.now());
        }
    }

    function shouldCollapse(missionEntry, missionId) {
        // Respektiere manuelle Klicks für 15 Sekunden
        if (manuallyExpanded.has(missionId) && (Date.now() - manuallyExpanded.get(missionId) < 15000)) {
            return false;
        }
        manuallyExpanded.delete(missionId); // Timer abgelaufen

        // LSSM-Logik: Ist der Button sichtbar und zeigt das "Einklappen"-Symbol?
        const lssmBtn = missionEntry.querySelector("button.lssmv4-extendedCallList_collapsable-missions_btn");
        if (lssmBtn) {
            const icon = lssmBtn.querySelector('svg[data-icon]');
            return icon && icon.getAttribute("data-icon") === lssmCollapseIconName;
        }

        // Fallback-Logik: Ist der Panel sichtbar (nicht eingeklappt)?
        const fallbackBtn = missionEntry.querySelector('.collapse-button-tm');
        const panel = missionEntry.querySelector('.panel');
        if (fallbackBtn && panel) {
            return !panel.classList.contains('mission-collapsed');
        }

        return false; // Kein bekannter Einklapp-Mechanismus gefunden
    }

    function collapseMission(missionEntry) {
        // LSSM bevorzugen
        const lssmBtn = missionEntry.querySelector("button.lssmv4-extendedCallList_collapsable-missions_btn");
        if (lssmBtn) {
            lssmBtn.click();
            return;
        }
        // Fallback
        const fallbackBtn = missionEntry.querySelector('.collapse-button-tm');
        if (fallbackBtn) {
            fallbackBtn.click();
        }
    }

    function handleCollapseSmallMissions() {
        if (!isAutoCollapseSmallActive || isTextFieldActive()) return;

        const missionContainer = document.querySelector("#mission_list");
        if (!missionContainer) return;

        for (const missionEntry of missionContainer.querySelectorAll(".missionSideBarEntry")) {
            const missionId = missionEntry.getAttribute("mission_id");
            const rawData = missionEntry.getAttribute("data-sortable-by");
            if (!missionId || !rawData) continue;

            try {
                const credits = JSON.parse(rawData.replace(/&quot;/g, '"')).average_credits;
                if (credits <= CREDIT_THRESHOLD && shouldCollapse(missionEntry, missionId)) {
                    collapseMission(missionEntry);
                }
            } catch (e) { continue; }
        }
    }


    function handleCollapseDoneMissions() {
        if (!isCollapseDoneActive || isTextFieldActive()) return;

        const missionContainer = document.querySelector('#mission_list');
        if (!missionContainer) return;

        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const missionId = missionEntry.getAttribute('mission_id');
            const rawData = missionEntry.getAttribute('data-sortable-by');
            if (!missionId || !rawData) continue;

            try {
                const missionData = JSON.parse(rawData.replace(/&quot;/g, '"'));

                // Bedingungen: "Fertig" (keine Patienten mehr), über dem Credit-Schwellenwert
                if (missionData.patients_count[0] === 0 && missionData.average_credits > CREDIT_THRESHOLD) {
                    // Prüfen ob Sprechwunschsymbol (*) unsichtbar ist
                    const asteriskIcon = document.getElementById(`mission_participant_new_${missionId}`);
                    if (asteriskIcon && asteriskIcon.classList.contains('hidden')) {
                         if (shouldCollapse(missionEntry, missionId)) {
                             collapseMission(missionEntry);
                         }
                    }
                }
            } catch (e) { continue; }
        }
    }


    // --- UNVERÄNDERTE FUNKTIONEN ---

    async function processSingleMission(missionEntry, authToken) {
        return new Promise(resolve => {
            const missionId = missionEntry.getAttribute('mission_id');
            missionEntry.style.backgroundColor = '';
            $.get(`/missions/${missionId}/alliance`).done(() => {
                sharedCount++;
                updateProgress();
                const now = new Date();
                now.setMinutes(now.getMinutes() + NOTIZ_ZEIT_IN_MINUTEN);
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const messageText = `ELW/FüKw ab ${hours}:${minutes}`;
                const payload = { "utf8": "✓", "authenticity_token": authToken, "mission_reply[mission_id]": missionId, "mission_reply[content]": messageText, "mission_reply[alliance_chat]": "0" };
                $.post('/mission_replies', payload).done(() => {
                    notedCount++;
                    updateProgress();
                    processed.add(missionId);
                    saveProcessed();
                    resolve(1);
                }).fail(() => {
                    missionEntry.style.backgroundColor = '#f2dede';
                    missionEntry.title = 'Automatisches Setzen der Notiz ist fehlgeschlagen.';
                    resolve(0);
                });
            }).fail(() => {
                missionEntry.style.backgroundColor = '#f2dede';
                missionEntry.title = 'Automatisches Teilen ist fehlgeschlagen.';
                resolve(0);
            });
        });
    }

    async function forceProcessAllMissions() {
        const authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const missionContainer = document.querySelector('#mission_list');
        if (!authToken || !missionContainer) return;
        let missionsToForceProcess = [];
        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;
            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }
            if (avgCredits > CREDIT_THRESHOLD) missionsToForceProcess.push(missionEntry);
        }
        if (maxShareCount > 0) missionsToForceProcess = missionsToForceProcess.slice(0, maxShareCount);
        if (missionsToForceProcess.length === 0) return;
        totalToProcess = missionsToForceProcess.length;
        sharedCount = 0;
        notedCount = 0;
        processedTowardsLimit = 0;
        updateProgress();
        for (let i = 0; i < missionsToForceProcess.length; i += BATCH_SIZE) {
            const batch = missionsToForceProcess.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(entry => processSingleMission(entry, authToken));
            const results = await Promise.all(batchPromises);
            const successes = results.reduce((a, b) => a + b, 0);
            if (maxShareCount > 0) processedTowardsLimit += successes;
            updateProgress();
            if (i + BATCH_SIZE < missionsToForceProcess.length) await delay(DELAY_BETWEEN_BATCHES);
        }
    }

    async function handleMissionProcessing() {
        const textFieldCurrentlyActive = isTextFieldActive();
        const missionContainer = document.querySelector('#mission_list');
        const authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!authToken || !missionContainer) return;

        let missionsToProcess = [];
        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const missionId = missionEntry.getAttribute('mission_id');
            if (!missionId || processed.has(missionId)) continue;
            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;
            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }
            if (avgCredits > CREDIT_THRESHOLD && !textFieldCurrentlyActive) {
                missionsToProcess.push(missionEntry);
            }
        }

        if (maxShareCount > 0) {
            const remainingSlots = maxShareCount - processedTowardsLimit;
            if (remainingSlots <= 0) missionsToProcess = [];
            else missionsToProcess = missionsToProcess.slice(0, remainingSlots);
        }

        totalToProcess = missionsToProcess.length;
        updateProgress();

        if (isActive && missionsToProcess.length > 0) {
            sharedCount = 0;
            notedCount = 0;
            for (let i = 0; i < missionsToProcess.length; i += BATCH_SIZE) {
                const batch = missionsToProcess.slice(i, i + BATCH_SIZE);
                const batchPromises = batch.map(entry => processSingleMission(entry, authToken));
                const results = await Promise.all(batchPromises);
                const successes = results.reduce((a, b) => a + b, 0);
                if (maxShareCount > 0) processedTowardsLimit += successes;
                updateProgress();
                if (i + BATCH_SIZE < missionsToProcess.length) await delay(DELAY_BETWEEN_BATCHES);
            }

            if (maxShareCount > 0 && processedTowardsLimit >= maxShareCount) {
                isActive = false;
                saveMainToggle();
                const mainToggleBtn = document.getElementById('autoFunktionenToggleBtn');
                if (mainToggleBtn) {
                    mainToggleBtn.textContent = 'Auto: AUS';
                    mainToggleBtn.style.backgroundColor = '#e74c3c';
                }
                alert(`Auto-Funktionen:\n\nDas Limit von ${maxShareCount} Einsätzen wurde erreicht.\nDie Automatik wurde deaktiviert.`);
            }
        }
    }

    async function timedLoop() {
        try {
            handleCollapseSmallMissions();
            handleCollapseDoneMissions();
            await handleMissionProcessing();
        } catch (e) {
            console.error("[Auto-Funktionen] Fehler:", e);
        }
        setTimeout(timedLoop, 2000);
    }

    function init() {
        createButtons();
        // Event Listener für manuelle Klicks hinzufügen
        const missionList = document.getElementById('mission_list');
        if (missionList) {
            missionList.addEventListener('click', handleManualExpansion, true);
        }
        timedLoop();
        console.log("Auto-Funktionen Skript (Version 3.1 mit Fallback) gestartet.");
    }

    setTimeout(init, 2000);

})();