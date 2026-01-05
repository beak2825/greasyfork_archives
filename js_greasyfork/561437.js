// ==UserScript==
// @name         Torn Ranked War Calculator
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      1.1
// @description  Calculates ranked war score, API fetching, draggable & minimizable UI (toggle in top-right).
// @author       TR0LL [2561502]
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561437/Torn%20Ranked%20War%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/561437/Torn%20Ranked%20War%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #warCalcContainer {
            position: fixed; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
            border-radius: 10px; padding: 0; margin: 0; box-shadow: 0 6px 24px rgba(0,0,0,0.25);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; z-index: 999998;
            width: 360px; max-height: 88vh; display: none;
            flex-direction: column; top: 80px; right: 10px;
        }
        #warCalcHeader {
            padding: 10px 15px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.1);
            cursor: grab; border-top-left-radius: 10px; border-top-right-radius: 10px; user-select: none;
        }
        #warCalcHeader:active { cursor: grabbing; }
        #warCalcHeader h3 { margin: 0; font-size: 16px; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        #warCalcContent { padding: 10px 15px 15px 15px; overflow-y: auto; flex-grow: 1; }
        #warCalcContent::-webkit-scrollbar { width: 6px; }
        #warCalcContent::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 8px; }
        #warCalcContent::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 8px; }
        #warCalcContent::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        .war-calc-input-section { background: rgba(255,255,255,0.05); border-radius: 6px; padding: 10px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.1); }
        .war-calc-input-section label { display: block; font-weight: 500; margin-bottom: 5px; font-size: 12px; color: rgba(255,255,255,0.8); }
        #apiKeyInput, #warAnnounceInput, .input-row input[type="text"], .input-row input[type="number"], #initialTargetScore, #desiredFinalTargetScore {
            width: 100%; padding: 8px; border: none; border-radius: 4px; background: rgba(0,0,0,0.25); color: #fff; font-size: 12px; box-sizing: border-box; font-family: inherit;
        }
        #apiKeyInput { margin-bottom: 2px; }
        .warning-note { font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 8px; font-style: italic; }
        #warAnnounceInput { resize: vertical; min-height: 50px; margin-bottom:10px; }
        #initialTargetScore, #desiredFinalTargetScore { margin-bottom: 10px; }
        input[readonly] { background: rgba(0,0,0,0.35) !important; color: #aaa !important; cursor: default !important; }
        .input-row { display: flex; gap: 10px; margin-bottom: 8px; }
        .input-row > div { flex: 1; }
        
        /* Buttons */
        #fetchApiDataButton, #liveRefreshButton { padding: 8px 12px; margin-top: 8px; font-size: 12px; letter-spacing: 0.3px; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; width: 100%; transition: all 0.15s ease-in-out; text-transform: uppercase; }
        
        #fetchApiDataButton { background: linear-gradient(45deg, #007bff, #0056b3); margin-bottom: 4px; }
        #fetchApiDataButton:hover { background: linear-gradient(45deg, #0069d9, #004085); transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        
        #liveRefreshButton { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: #ddd; }
        #liveRefreshButton:hover { background: rgba(255,255,255,0.25); }
        
        /* Active State for Auto Refresh */
        #liveRefreshButton.active-refresh {
            background: linear-gradient(45deg, #28a745, #218838) !important;
            color: white !important;
            border: none;
            box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
            animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }

        #apiStatusMessage { font-size: 10px; margin-top: 4px; min-height: 13px;}
        #warCalcDisplay { background: rgba(0,0,0,0.1); border-radius: 6px; padding: 8px 10px; margin-top: 10px; border: 1px solid rgba(255,255,255,0.1); }
        .faction-scores { margin-bottom: 10px; padding: 10px 8px; display: flex; justify-content: space-around; align-items: center; background: rgba(255,255,255,0.05); border-radius: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .faction-score { text-align: center; flex: 1; padding: 0 4px; }
        .faction-name { font-size: 11px; margin-bottom: 3px; display: block; opacity: 0.85; word-break: break-word; color: rgba(255,255,255,0.8); font-weight: 500; }
        .score { font-size: 20px; display: block; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .vs { font-size: 14px; margin: 0 8px; font-weight: bold; opacity: 0.7; flex-shrink: 0; }
        .info-row { padding: 7px 5px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .info-row:last-child { border-bottom: none; }
        .info-row span:first-child { opacity: 0.85; color: rgba(255,255,255,0.8); }
        .info-row.highlight { margin: 4px -5px; padding: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; font-weight: bold;}
        .info-row.highlight .info-value { font-size: 13px; }
        .info-row.success { margin: 4px -5px; padding: 8px; background: rgba(40, 167, 69, 0.2); border-radius: 4px; color: #a0e0a0;}
        .info-row.success .info-value { font-weight: bold; color: #c0f0c0; }
        .info-value { font-weight: 600; text-align: right; word-break: break-word; color: #fff; }
        .status-badge { padding: 3px 8px; font-size: 10px; display: inline-block; border-radius: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-badge.active { background: #28a745; color: white; }
        .status-badge.ended { background: #dc3545; color: white; }
        .status-badge.waiting { background: #ffc107; color: #212529; }
        .decayed { color: #ffae42 !important; }
        .error-message { padding: 10px; font-size: 12px; color: #f8d7da; background-color: rgba(220, 53, 69, 0.3); border: 1px solid rgba(220, 53, 69, 0.5); border-radius: 4px; margin-top: 10px; text-align: left;}
        .status-message { padding: 15px 10px; font-size: 13px; text-align: center; opacity: 0.7; color: rgba(255,255,255,0.7); }
        #warCalcToggleButton {
            position: fixed; top: 20px; right: 10px;
            background-color: #667eea; color: white; border: none; border-radius: 50%;
            width: 45px; height: 45px; font-size: 18px; font-weight: bold;
            line-height: 45px; text-align: center; cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25); z-index: 1000000;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
        #warCalcToggleButton:hover { background-color: #764ba2; transform: scale(1.05); }
    `);

    // --- MAIN PANEL CREATION ---
    const container = document.createElement('div');
    container.id = 'warCalcContainer';
    container.innerHTML = `
        <div id="warCalcHeader">
            <h3>🎯 Ranked War Calculator</h3>
        </div>
        <div id="warCalcContent">
            <div class="war-calc-input-section">
                <label for="apiKeyInput">Torn API Key (Public Faction Access):</label>
                <input type="text" name="username" value="TornAPIKey" style="display:none;" autocomplete="username">
                <input type="password" id="apiKeyInput" name="password" placeholder="Enter API Key (optional)" autocomplete="current-password">
                <div class="warning-note">Note: Clearing cookies or cache may delete saved key.</div>
                
                <button id="fetchApiDataButton">Fetch Active War Data (API)</button>
                <button id="liveRefreshButton">🔄 Auto Refresh: OFF</button>
                <div id="apiStatusMessage"></div>
            </div>
            <div class="war-calc-input-section">
                <label for="warAnnounceInput">War Announcement (or API Summary):</label>
                <textarea id="warAnnounceInput" placeholder="Paste announcement or use API fetch"></textarea>
                <label for="initialTargetScore">Initial Target Score:</label>
                <input type="number" id="initialTargetScore" placeholder="e.g., 13200">
                <label for="desiredFinalTargetScore">Target Score Diff. (Auto: |A Score - B Score|):</label>
                <input type="number" id="desiredFinalTargetScore" placeholder="Auto-calculated" readonly>
                <div class="input-row">
                    <div><label for="factionAName">Faction A Name:</label><input type="text" id="factionAName" placeholder="Auto-filled" readonly></div>
                    <div><label for="factionAScore">Faction A Score:</label><input type="number" id="factionAScore" placeholder="0"></div>
                </div>
                <div class="input-row">
                    <div><label for="factionBName">Faction B Name:</label><input type="text" id="factionBName" placeholder="Auto-filled" readonly></div>
                    <div><label for="factionBScore">Faction B Score:</label><input type="number" id="factionBScore" placeholder="0"></div>
                </div>
            </div>
            <div id="warCalcDisplay">
                <div class="status-message">Enter data or use API fetch, then Process.</div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- TOGGLE BUTTON CREATION & LOGIC ---
    const toggleButton = document.createElement('button');
    toggleButton.id = 'warCalcToggleButton';
    toggleButton.innerHTML = '🎯';
    document.body.appendChild(toggleButton);

    let isPanelVisible = GM_getValue('panelVisible', false);

    function applyPanelVisibility() {
        if (isPanelVisible) {
            container.style.display = 'flex';
            toggleButton.innerHTML = '🔽';
        } else {
            container.style.display = 'none';
            toggleButton.innerHTML = '🎯';
        }
    }

    function togglePanel() {
        isPanelVisible = !isPanelVisible;
        applyPanelVisibility();
        GM_setValue('panelVisible', isPanelVisible);
    }
    toggleButton.addEventListener('click', togglePanel);
    applyPanelVisibility();

    // --- DRAGGABLE LOGIC ---
    const header = document.getElementById('warCalcHeader');
    let isDragging = false; let currentX_drag, currentY_drag, initialX_drag, initialY_drag;
    const savedLeft = GM_getValue('assistantPosX', null); const savedTop = GM_getValue('assistantPosY', null);
    if (savedLeft !== null && savedTop !== null) { container.style.left = savedLeft; container.style.top = savedTop; container.style.right = 'auto';}
    header.addEventListener('mousedown', (e) => { if (e.button !== 0) return; if (container.style.right !=='auto' && container.style.right !== '') { container.style.left = container.offsetLeft + 'px'; container.style.right = 'auto'; } initialX_drag = e.clientX - (parseFloat(container.style.left) || 0); initialY_drag = e.clientY - (parseFloat(container.style.top) || 0); isDragging = true; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { e.preventDefault(); currentX_drag = e.clientX - initialX_drag; currentY_drag = e.clientY - initialY_drag; container.style.left = currentX_drag + "px"; container.style.top = currentY_drag + "px"; } });
    document.addEventListener('mouseup', (e) => { if (e.button !== 0 && isDragging) return; if (isDragging) { GM_setValue('assistantPosX', container.style.left); GM_setValue('assistantPosY', container.style.top); isDragging = false; } });

    // --- GET ELEMENTS ---
    const apiKeyInputEl = document.getElementById('apiKeyInput');
    const fetchApiDataButtonEl = document.getElementById('fetchApiDataButton');
    const liveRefreshButtonEl = document.getElementById('liveRefreshButton');
    const apiStatusMessageEl = document.getElementById('apiStatusMessage');
    const warInfoPasteEl = document.getElementById('warAnnounceInput');
    const initialTargetScoreEl = document.getElementById('initialTargetScore');
    const desiredFinalTargetScoreEl = document.getElementById('desiredFinalTargetScore');
    const factionANameEl = document.getElementById('factionAName');
    const factionAScoreEl = document.getElementById('factionAScore');
    const factionBNameEl = document.getElementById('factionBName');
    const factionBScoreEl = document.getElementById('factionBScore');
    const displayDiv = document.getElementById('warCalcDisplay');

    if(desiredFinalTargetScoreEl) desiredFinalTargetScoreEl.readOnly = true;
    if(factionANameEl) factionANameEl.readOnly = true;
    if(factionBNameEl) factionBNameEl.readOnly = true;

    let warStartDate = null; let originalTargetScore = 0; let intervalId = null;
    let autoRefreshTimer = null;

    // --- AUTOFILL FROM STORAGE ---
    if(apiKeyInputEl) apiKeyInputEl.value = GM_getValue('apiKey', '');
    if(warInfoPasteEl) warInfoPasteEl.value = GM_getValue('warInfoPaste', '');
    if(initialTargetScoreEl) initialTargetScoreEl.value = GM_getValue('initialTargetScore', '');
    if(factionANameEl) factionANameEl.value = GM_getValue('factionAName', '');
    if(factionAScoreEl) factionAScoreEl.value = GM_getValue('factionAScore', '0');
    if(factionBNameEl) factionBNameEl.value = GM_getValue('factionBName', '');
    if(factionBScoreEl) factionBScoreEl.value = GM_getValue('factionBScore', '0');

    function parseWarInfo(info) {
        let startDate = null, factionAName = null, factionBName = null;
        const dateTimeMatch = info.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(\d{2}:\d{2}:\d{2})\s-\s(\d{2})\/(\d{2})\/(\d{2})/);
        if (dateTimeMatch) { const time = dateTimeMatch[2]; const day = parseInt(dateTimeMatch[3],10); const month = parseInt(dateTimeMatch[4],10)-1; const year = parseInt("20"+dateTimeMatch[5],10); const [h,m,s]=time.split(':').map(Number); startDate = new Date(Date.UTC(year,month,day,h,m,s));
        } else { const dtf = info.match(/(\d{2}:\d{2}:\d{2})\s-\s(\d{2})\/(\d{2})\/(\d{2})/); if (dtf) { const t=dtf[1]; const d=parseInt(dtf[2],10); const mo=parseInt(dtf[3],10)-1; const y=parseInt("20"+dtf[4],10); const [h,m,s]=t.split(':').map(Number); startDate = new Date(Date.UTC(y,mo,d,h,m,s)); } }
        const factionMatch = info.match(/between\s(.*?)\sand\s(.*?)\swill begin/i); if (factionMatch) { factionAName = factionMatch[1].trim(); factionBName = factionMatch[2].trim(); }
        return { startDate, factionAName, factionBName };
    }
    function formatTimeDifference(ms, showSeconds = true, forNextDrop = false) {
        if (ms < 0) return forNextDrop ? "Now" : (showSeconds ? "Passed" : "Active");
        let totalS = Math.floor(ms/1000); let d=Math.floor(totalS/(24*60*60)); totalS%=(24*60*60); let h=Math.floor(totalS/(60*60)); totalS%=(60*60); let m=Math.floor(totalS/60); let s=totalS%60;
        let r=[]; if(d>0)r.push(`${d}d`); if(h>0||(d>0&&(m>0||s>0||showSeconds)))r.push(`${h}h`); if(m>0||((h>0||d>0)&&(s>0||showSeconds)))r.push(`${m}m`); if(showSeconds||(d===0&&h===0&&m===0))r.push(`${s}s`);
        return r.length>0?r.join(' '):(forNextDrop?"Now":(showSeconds?"0s":"Just started"));
    }
    function toCustomUTCString(dateObj) {
        if(!dateObj||!(dateObj instanceof Date)||isNaN(dateObj.getTime()))return"N/A"; const p=(n)=>String(n).padStart(2,'0'); const h=p(dateObj.getUTCHours()),m=p(dateObj.getUTCMinutes()),s=p(dateObj.getUTCSeconds()); const d=p(dateObj.getUTCDate()),M=p(dateObj.getUTCMonth()+1),y=dateObj.getUTCFullYear(); return`${h}:${m}:${s} ${d}/${M}/${y} (UTC)`;
    }
    function updateDisplay() {
        const facAScore = parseInt(factionAScoreEl.value, 10) || 0; const facBScore = parseInt(factionBScoreEl.value, 10) || 0;
        if(desiredFinalTargetScoreEl) desiredFinalTargetScoreEl.value = Math.abs(facAScore - facBScore);
        if (!warStartDate || isNaN(warStartDate.getTime()) || !originalTargetScore) { if(displayDiv) displayDiv.innerHTML = '<div class="status-message">Awaiting valid inputs or calculation.</div>'; return; }
        const now = new Date(); const timeElapsedMs = now.getTime() - warStartDate.getTime(); const actualCombinedScore = facAScore + facBScore;
        let currentTarget = originalTargetScore; let warStatusClass = "waiting"; let statusText = ""; let timeToDecayText = ""; let totalPercentageDecayApplied = 0;
        const twentyFourHoursMs = 24*60*60*1000; const decayStartTimestamp = warStartDate.getTime() + twentyFourHoursMs; const timeToDecayMs = decayStartTimestamp - now.getTime();
        if (timeElapsedMs < 0) { warStatusClass="waiting"; statusText=`Starts in ${formatTimeDifference(-timeElapsedMs)}`; timeToDecayText="N/A (War not started)";
        } else { warStatusClass = timeElapsedMs > 123*60*60*1000 ? "ended" : "active"; statusText = `${formatTimeDifference(timeElapsedMs, false)} elapsed`;
            if (timeToDecayMs > 0) { timeToDecayText = `Decay starts in ${formatTimeDifference(timeToDecayMs)} (at ${toCustomUTCString(new Date(decayStartTimestamp))})`;
            } else { const hoursIntoDecayPeriod = Math.floor(-timeToDecayMs/(60*60*1000)); totalPercentageDecayApplied = Math.min(hoursIntoDecayPeriod*1, 99); if (hoursIntoDecayPeriod > 0) currentTarget = Math.max(0, originalTargetScore*(1-(totalPercentageDecayApplied/100))); const msIntoCurrentDecayHourBlock = (-timeToDecayMs)%(60*60*1000); const msUntilNextDrop = (60*60*1000) - msIntoCurrentDecayHourBlock; const timeToNextDropStr = totalPercentageDecayApplied < 99 ? formatTimeDifference(msUntilNextDrop, true, true) : "Max decay"; timeToDecayText = `Active (Since ${toCustomUTCString(new Date(decayStartTimestamp))}). Next drop: ${timeToNextDropStr}. Total: ${totalPercentageDecayApplied}% decayed.`; }
        }
        const scoreNeededForCurrentTarget = currentTarget - actualCombinedScore; const approxWarEndTimestamp = warStartDate.getTime() + (123*60*60*1000);
        let timeToDesiredTargetText = ""; const desiredTargetVal = desiredFinalTargetScoreEl ? parseFloat(desiredFinalTargetScoreEl.value) : 0;
        if (isNaN(desiredTargetVal)) { timeToDesiredTargetText = "N/A (Scores not set)";
        } else if (originalTargetScore > 0 && desiredTargetVal > 0 && desiredTargetVal < originalTargetScore) { const targetReductionNeeded = originalTargetScore - desiredTargetVal; const decayAmountPerHour = originalTargetScore * 0.01;
            if (decayAmountPerHour > 0) { const hoursOfDecayNeeded = Math.ceil(targetReductionNeeded / decayAmountPerHour); const totalTimeUntilDesiredTargetMs = twentyFourHoursMs + (hoursOfDecayNeeded * 60*60*1000); const desiredTargetReachedTimestamp = warStartDate.getTime() + totalTimeUntilDesiredTargetMs; const timeFromNowToDesiredTargetMs = desiredTargetReachedTimestamp - now.getTime(); if (timeFromNowToDesiredTargetMs < 0) timeToDesiredTargetText = `Would've decayed to ${desiredTargetVal.toLocaleString()} at ${toCustomUTCString(new Date(desiredTargetReachedTimestamp))}`; else timeToDesiredTargetText = `To ${desiredTargetVal.toLocaleString()}: In ${formatTimeDifference(timeFromNowToDesiredTargetMs)} (at ${toCustomUTCString(new Date(desiredTargetReachedTimestamp))})`;
            } else { timeToDesiredTargetText = "N/A (Initial target won't decay)"; }
        } else if (desiredTargetVal > 0 && desiredTargetVal >= originalTargetScore) { timeToDesiredTargetText = "N/A (Score diff. is >= Initial Target)";
        } else if (desiredTargetVal === 0 && (facAScore !== 0 || facBScore !== 0) ) { timeToDesiredTargetText = "N/A (Scores are equal; diff is 0)";
        } else if (desiredTargetVal === 0 && facAScore === 0 && facBScore === 0) { timeToDesiredTargetText = "N/A (Scores are 0)";
        } else { timeToDesiredTargetText = "N/A (Invalid score diff. for decay calc)"; }
        if(displayDiv) displayDiv.innerHTML = `<div class="faction-scores"><div class="faction-score"><span class="faction-name">${factionANameEl.value||"Faction A"}</span><span class="score">${facAScore.toLocaleString()}</span></div><div class="vs">VS</div><div class="faction-score"><span class="faction-name">${factionBNameEl.value||"Faction B"}</span><span class="score">${facBScore.toLocaleString()}</span></div></div><div class="info-row"><span>War Status:</span><span class="info-value"><span class="status-badge ${warStatusClass}">${statusText}</span></span></div><div class="info-row"><span>War Start (UTC):</span><span class="info-value">${toCustomUTCString(warStartDate)}</span></div><div class="info-row"><span>Max End (UTC):</span><span class="info-value">${toCustomUTCString(new Date(approxWarEndTimestamp))}</span></div><div class="info-row"><span>Target Decay:</span><span class="info-value">${timeToDecayText}</span></div><div class="info-row"><span>Decay to Score Diff. (${desiredTargetVal.toLocaleString()}):</span><span class="info-value">${timeToDesiredTargetText}</span></div><div class="info-row"><span>Initial Target:</span><span class="info-value">${originalTargetScore.toLocaleString()}</span></div><div class="info-row highlight"><span>Current Target:</span><span class="info-value ${currentTarget < originalTargetScore && timeElapsedMs >= twentyFourHoursMs ? 'decayed' : ''}">${Math.round(currentTarget).toLocaleString()}</span></div><div class="info-row ${scoreNeededForCurrentTarget <= 0 ? 'success' : ''}"><span>Score Needed (to current target):</span><span class="info-value">${scoreNeededForCurrentTarget <= 0 ? 'TARGET MET! 🎉' : Math.round(scoreNeededForCurrentTarget).toLocaleString()}</span></div>`;
    }

    function processAndCalculate() {
        if (intervalId) clearInterval(intervalId); const pastedInfoFull = warInfoPasteEl ? warInfoPasteEl.value : ''; const parsedPastedInfo = parseWarInfo(pastedInfoFull); if (parsedPastedInfo.startDate) warStartDate = parsedPastedInfo.startDate; originalTargetScore = initialTargetScoreEl ? parseFloat(initialTargetScoreEl.value) : 0;
        if (parsedPastedInfo.factionAName && factionANameEl && (!factionANameEl.value || factionANameEl.placeholder.includes(factionANameEl.value))) factionANameEl.value = parsedPastedInfo.factionAName; if (parsedPastedInfo.factionBName && factionBNameEl && (!factionBNameEl.value || factionBNameEl.placeholder.includes(factionBNameEl.value))) factionBNameEl.value = parsedPastedInfo.factionBName;
        if (!warStartDate || isNaN(warStartDate.getTime())) { if(displayDiv) displayDiv.innerHTML = '<div class="error-message">Error: Could not parse/set war start time. Use API or paste announcement.</div>'; return; } if (isNaN(originalTargetScore) || originalTargetScore <= 0) { if(displayDiv) displayDiv.innerHTML = '<div class="error-message">Error: Initial target score must be a positive number.</div>'; return; } if (factionANameEl && factionBNameEl && (!factionANameEl.value || !factionBNameEl.value)) { if(displayDiv) displayDiv.innerHTML = '<div class="error-message">Error: Faction names not set. Use API or paste announcement.</div>'; return; }
        if(warInfoPasteEl) GM_setValue('warInfoPaste', pastedInfoFull); if(initialTargetScoreEl) GM_setValue('initialTargetScore', initialTargetScoreEl.value); if(factionANameEl) GM_setValue('factionAName', factionANameEl.value); if(factionAScoreEl) GM_setValue('factionAScore', factionAScoreEl.value); if(factionBNameEl) GM_setValue('factionBName', factionBNameEl.value); if(factionBScoreEl) GM_setValue('factionBScore', factionBScoreEl.value);
        updateDisplay(); intervalId = setInterval(updateDisplay, 1000);
    }

    // --- CENTRAL FETCH FUNCTION ---
    function fetchApiData(isAuto = false) {
        const apiKey = apiKeyInputEl ? apiKeyInputEl.value.trim() : '';
        const savedKey = GM_getValue('apiKey', '');

        if (apiKey && apiKey !== savedKey) {
            if (confirm("Do you want to save this API Key for future use?")) {
                GM_setValue('apiKey', apiKey);
            }
        }

        if (!apiKey) {
            if(apiStatusMessageEl) { apiStatusMessageEl.textContent = 'API Key is required.'; apiStatusMessageEl.style.color = '#F04747';}
            // If auto-refresh is on but no key, stop it.
            if(isAuto && autoRefreshTimer) {
               clearInterval(autoRefreshTimer);
               autoRefreshTimer = null;
               liveRefreshButtonEl.innerHTML = '🔄 Auto Refresh: OFF';
               liveRefreshButtonEl.classList.remove('active-refresh');
            }
            return;
        }

        if(!isAuto && apiStatusMessageEl) { apiStatusMessageEl.textContent = 'Fetching data...'; apiStatusMessageEl.style.color = '#ffae42';}

        GM_xmlhttpRequest({ method: "GET", url: `https://api.torn.com/faction/?selections=rankedwars&key=${apiKey}&comment=RankedWarCalculatorV1.5`,
            onload: function(response) { try { const data = JSON.parse(response.responseText); if (data.error) { if(apiStatusMessageEl) { apiStatusMessageEl.textContent = `API Error: ${data.error.error} (Code: ${data.error.code})`; apiStatusMessageEl.style.color = '#F04747';} console.error("Torn API Error:", data.error); return; }
                if (data.rankedwars && Object.keys(data.rankedwars).length > 0) { let activeWarFound = false;
                    for (const warId in data.rankedwars) { const warData = data.rankedwars[warId]; if (warData.war && warData.war.end === 0) { activeWarFound = true; warStartDate = new Date(warData.war.start * 1000); originalTargetScore = warData.war.target; if(initialTargetScoreEl) initialTargetScoreEl.value = originalTargetScore; const factionKeys = Object.keys(warData.factions);
                        if (factionKeys.length === 2) { const fac1Data = warData.factions[factionKeys[0]]; const fac2Data = warData.factions[factionKeys[1]]; if(factionANameEl) factionANameEl.value = fac1Data.name; if(factionAScoreEl) factionAScoreEl.value = fac1Data.score; if(factionBNameEl) factionBNameEl.value = fac2Data.name; if(factionBScoreEl) factionBScoreEl.value = fac2Data.score; }
                        if(warInfoPasteEl) warInfoPasteEl.value = `API: ${factionANameEl.value} vs ${factionBNameEl.value} started ${toCustomUTCString(warStartDate)}. Target: ${originalTargetScore}.`;
                        if(apiStatusMessageEl) { apiStatusMessageEl.textContent = `Updated: ${new Date().toLocaleTimeString()}`; apiStatusMessageEl.style.color = '#28a745';}
                        GM_setValue('warInfoPaste', warInfoPasteEl.value); GM_setValue('initialTargetScore', initialTargetScoreEl.value); GM_setValue('factionAName', factionANameEl.value); GM_setValue('factionAScore', factionAScoreEl.value); GM_setValue('factionBName', factionBNameEl.value); GM_setValue('factionBScore', factionBScoreEl.value);
                        processAndCalculate(); break; } }
                    if (!activeWarFound && apiStatusMessageEl) { apiStatusMessageEl.textContent = 'No active ranked war found for this faction.'; apiStatusMessageEl.style.color = '#ffae42';}
                } else { if(apiStatusMessageEl) { apiStatusMessageEl.textContent = 'No ranked war data found.'; apiStatusMessageEl.style.color = '#ffae42';} }
            } catch (e) { if(apiStatusMessageEl) { apiStatusMessageEl.textContent = 'Failed to parse API response.'; apiStatusMessageEl.style.color = '#F04747';} console.error("Error parsing API response:", e, response.responseText); } },
            onerror: function(response) { if(apiStatusMessageEl) { apiStatusMessageEl.textContent = 'API request failed. Check console.'; apiStatusMessageEl.style.color = '#F04747';} console.error("Torn API Request Error:", response); }
        });
    }

    // --- BUTTON LISTENERS ---
    if(fetchApiDataButtonEl) fetchApiDataButtonEl.addEventListener('click', () => fetchApiData(false));

    if(liveRefreshButtonEl) {
        liveRefreshButtonEl.addEventListener('click', () => {
            if (autoRefreshTimer) {
                // TURN OFF
                clearInterval(autoRefreshTimer);
                autoRefreshTimer = null;
                liveRefreshButtonEl.innerHTML = '🔄 Auto Refresh: OFF';
                liveRefreshButtonEl.classList.remove('active-refresh');
            } else {
                // TURN ON
                fetchApiData(false); // Immediate fetch
                autoRefreshTimer = setInterval(() => fetchApiData(true), 5000); // Fetch every 5s
                liveRefreshButtonEl.innerHTML = '🔄 Auto Refresh: ON';
                liveRefreshButtonEl.classList.add('active-refresh');
            }
        });
    }

    if (GM_getValue('warInfoPaste', '') && GM_getValue('initialTargetScore', '')) { setTimeout(() => { const autoPInfo = parseWarInfo(GM_getValue('warInfoPaste', '')); const autoTScore = parseFloat(GM_getValue('initialTargetScore', '')); if (autoPInfo.startDate && !isNaN(autoPInfo.startDate.getTime()) && autoTScore > 0) { processAndCalculate(); } else { if(displayDiv) displayDiv.innerHTML = '<div class="status-message">Loaded data incomplete/invalid. Check inputs & Process.</div>';} }, 250); }

    [factionAScoreEl, factionBScoreEl].forEach(el => { if(el) el.addEventListener('input', () => { if(desiredFinalTargetScoreEl){ const facASV=parseInt(factionAScoreEl.value,10)||0; const facBSV=parseInt(factionBScoreEl.value,10)||0; desiredFinalTargetScoreEl.value=Math.abs(facASV-facBSV);} if(warStartDate&&!isNaN(warStartDate.getTime())&&originalTargetScore>0){GM_setValue(el.id==='factionAScore'?'factionAScore':'factionBScore',el.value);updateDisplay();}});});
    [initialTargetScoreEl, warInfoPasteEl].forEach(el => { if(el) el.addEventListener('change', () => { const kM={'initialTargetScore':'initialTargetScore','warAnnounceInput':'warInfoPaste'}; if(kM[el.id])GM_setValue(kM[el.id],el.value); if(warInfoPasteEl&&initialTargetScoreEl&&warInfoPasteEl.value&&initialTargetScoreEl.value&&parseFloat(initialTargetScoreEl.value)>0)processAndCalculate();});});
    if (factionAScoreEl && factionBScoreEl && desiredFinalTargetScoreEl) { const facASV=parseInt(factionAScoreEl.value,10)||0; const facBSV=parseInt(factionBScoreEl.value,10)||0; desiredFinalTargetScoreEl.value=Math.abs(facASV-facBSV);}
    console.log("Torn Ranked War Calculator (Inspired Design v1.5 Auto-Refresh) Loaded.");
})();