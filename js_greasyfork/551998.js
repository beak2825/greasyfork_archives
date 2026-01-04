// ==UserScript==
// @name         Complete Pickpocketing Overhaul
// @namespace    CompletePickpocketingOverhaul
// @version      1.4.5
// @description  A comprehensive overhaul for the Torn City pickpocketing crime. Features advanced target highlighting, customizable filtering, audio/visual alerts, a draggable UI, and more to enhance decision-making and efficiency. Now uses data interception for maximum reliability.
// @author       Cazylecious, QueenLunara, Terekhov, GNSC4 [268863]
// @match        https://www.torn.com/page.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551998/Complete%20Pickpocketing%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/551998/Complete%20Pickpocketing%20Overhaul.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // --- Configuration ---
    const DEBUG = true; // Set to true to enable detailed console logs for development, false for production.

    // --- Version and Execution Guard ---
    const SCRIPT_VERSION = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '1.4.5';
    if (window.completePickpocketingOverhaulHasRun) {
        if (DEBUG) console.log(`[COMPLETE PICKPOCKETING OVERHAUL (v${SCRIPT_VERSION}) SCRIPT ALREADY RUNNING - ABORTING DUPLICATE EXECUTION]`);
        return;
    }
    window.completePickpocketingOverhaulHasRun = true;

    // --- Debugging Utility Functions ---
    function debugLog(...args) {
        if (DEBUG) console.log(`[v${SCRIPT_VERSION}][CPO Log]`, ...args);
    }
    function debugWarn(...args) {
        if (DEBUG) console.warn(`[v${SCRIPT_VERSION}][CPO Warn]`, ...args);
    }
    function debugError(...args) {
        if (DEBUG) console.error(`[v${SCRIPT_VERSION}][CPO Error]`, ...args);
    }

    debugLog(`Script execution started. Initializing v${SCRIPT_VERSION}. Debug mode is ${DEBUG ? 'ON' : 'OFF'}.`);

    // --- Global Variables & Constants ---
    let savedTargets = GM_getValue('savedTargets', []);
    let selectedTargets = GM_getValue('selectedTargets', []);
    let enableAlerts = GM_getValue('enableAlerts', false);
    let audioContextUnlocked = GM_getValue('audioContextUnlocked', false);
    let panelPosition = GM_getValue('panelPosition', { top: '50px', left: '5px' });
    let isPanelMinimized = GM_getValue('isPanelMinimized', false);

    let onScreenAlertTimeout = null;
    let originalTitle = document.title;
    let isTabFlashing = false;
    let flashIntervalId = null;
    let uiIntegrityInterval = null;
    const FLASH_MESSAGE_BASE = "🎯 Target(s): ";
    const ALERT_SOUND_URL = 'https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103';
    let preloadedAlertAudio = null;
    let globalAudioContext = null;
    let isUnlockingAudioActivity = false;

    const AUDIO_CONTEXT_UNLOCK_TIMEOUT_MS = 3000;
    const WAIT_FOR_ELEMENT_TIMEOUT_MS = 20000;

    let currentAlertingTargets = new Set();
    let targetsOnPageLastCycle = new Set();
    let lastDisplayedOnScreenAlertMessage = "";

    let pickpocketingFeaturesInitialized = false;
    let crimesHeaderObserver = null;
    let processDebounceTimeout = null;

    // --- J.A.R.V.I.S. Specific Constants & Variables ---
    const JARVIS_COLORS = { ideal: '#40AB24', easy: '#82C370', tooEasy: '#A4D497', tooHard: '#fa8e8e', uncategorized: '#DA85FF' };
    const JARVIS_ALL_MARK_TYPES = ['Businessman', 'Businesswoman', 'Classy lady', 'Cyclist', 'Drunk man', 'Drunk woman', 'Elderly man', 'Elderly woman', 'Gang member', 'Homeless person', 'Jogger', 'Junkie', 'Laborer', 'Mobster', 'Police officer', 'Postal worker', 'Rich kid', 'Sex worker', 'Student', 'Thug', 'Young man', 'Young woman'];
    const JARVIS_MARK_CS_LEVELS_MAP = {
        'Drunk man': '100', 'Drunk woman': '100', 'Elderly man': '100', 'Elderly woman': '100', 'Homeless person': '100', 'Junkie': '100',
        'Classy lady': '150', 'Laborer': '150', 'Postal worker': '150', 'Young man': '150', 'Young woman': '150', 'Student': '150',
        'Rich kid': '200', 'Sex worker': '200', 'Thug': '200',
        'Businessman': '250', 'Businesswoman': '250', 'Jogger': '250', 'Gang member': '250', 'Mobster': '250',
        'Cyclist': '300', 'Police officer': '350'
    };
    const JARVIS_MIN_LS_KEY = 'jarvisPickpocketMinDisplay';
    const JARVIS_MAX_LS_KEY = 'jarvisPickpocketMaxDisplay';
    let jarvisCurrentSkillLevel = GM_getValue('jarvisLastKnownSkill', 1);
    const JARVIS_SKILL_CATS = ['Safe', 'Moderately Unsafe', 'Unsafe', 'Risky', 'Dangerous', 'Very Dangerous'];
    const JARVIS_SKILL_STARTS = [1, 10, 35, 65, 90, 100];
    const JARVIS_MARK_GROUPS = {
        Safe: ['Drunk man', 'Drunk woman', 'Homeless person', 'Junkie', 'Elderly man', 'Elderly woman'],
        'Moderately Unsafe': ['Laborer', 'Postal worker', 'Young man', 'Young woman', 'Student'],
        Unsafe: ['Classy lady', 'Rich kid', 'Sex worker'],
        Risky: ['Thug', 'Jogger', 'Businessman', 'Businesswoman', 'Gang member'],
        Dangerous: ['Cyclist'],
        'Very Dangerous': ['Mobster', 'Police officer']
    };
    const DEFAULT_ITEM_HEIGHT = 51;

    // --- Core Logic ---

    async function processFetchedCrimeData(data) {
        if (!pickpocketingFeaturesInitialized) return;
        debugLog("Processing intercepted crime data...", data);

        const crimeDB = data.DB;
        if (!crimeDB || !crimeDB.crimesByType || !crimeDB.currentUserStats) {
            debugWarn("Intercepted data is missing expected DB structure.", data);
            return;
        }

        const newSkill = crimeDB.currentUserStats.skill;
        if (newSkill && newSkill !== jarvisCurrentSkillLevel) {
            debugLog(`Skill level updated from ${jarvisCurrentSkillLevel} to ${newSkill} via fetch.`);
            jarvisCurrentSkillLevel = newSkill;
            GM_setValue('jarvisLastKnownSkill', jarvisCurrentSkillLevel);
        }

        await checkForAlerts(crimeDB.crimesByType);

        if (processDebounceTimeout) clearTimeout(processDebounceTimeout);
        processDebounceTimeout = setTimeout(() => {
            debugLog("Running debounced UI updates.");
            applyFormattingToVisibleTargets(crimeDB.crimesByType);
            updateDropdown(crimeDB.crimesByType);
            processDebounceTimeout = null;
        }, 75);
    }

    /**
     * Extracts a unique face ID from a URL like /images/v2/crimes/faces/517.webp
     * @param {string} src - The image src attribute.
     * @returns {string|null} The face ID (e.g., "517") or null if not found.
     */
    function getFaceIdFromSrc(src) {
        if (!src) return null;
        const match = src.match(/faces\/(\d+)\.webp/);
        return match ? match[1] : null;
    }

    /**
     * This function is the core of the UI manipulation. It uses the `iconClass` from the API
     * and the face ID from the `img` src to create a reliable link, fixing dynamic content issues.
     * @param {Array} targetsData - The full array of target data from the game's API.
     */
    function applyFormattingToVisibleTargets(targetsData) {
        debugLog("Applying formatting and visibility using `iconClass` to face ID linking.");
        const virtualListContainer = document.querySelector('.virtualList___noLef');
        if (!virtualListContainer) return;

        const crimeItems = Array.from(virtualListContainer.querySelectorAll('.virtualItem___BLyAl'));
        if (crimeItems.length === 0) {
            debugLog("No virtual items found in DOM. Aborting format.");
            return;
        }

        // --- Start of New `iconClass` Linking Logic ---

        // 1. Create a map of API data keyed by `iconClass` for fast lookups.
        const dataByIconClass = new Map();
        targetsData.forEach(data => {
            if (data && data.iconClass) {
                dataByIconClass.set(data.iconClass.toString(), data);
            }
        });

        // 2. Determine which items should be visible based on current filters.
        const minLsLevel = parseInt(GM_getValue(JARVIS_MIN_LS_KEY, 100), 10);
        const maxLsLevel = parseInt(GM_getValue(JARVIS_MAX_LS_KEY, 300), 10);
        const visibleItems = [];

        crimeItems.forEach(item => {
            const img = item.querySelector('.face___nJ91l');
            const faceId = getFaceIdFromSrc(img?.src);

            if (!faceId) {
                // This is likely a spacer or loader, hide it to be safe.
                item.style.display = 'none';
                return;
            }

            const targetData = dataByIconClass.get(faceId);

            if (!targetData) {
                // This DOM element is stale (target expired or not in current API data). Hide it.
                item.style.display = 'none';
                return;
            }

            // We have a solid link. Now check if it passes filters.
            const targetType = targetData.title;
            const targetCsLevel = parseInt(JARVIS_MARK_CS_LEVELS_MAP[targetType], 10);
            const isHiddenByCS = targetCsLevel < minLsLevel || targetCsLevel > maxLsLevel;
            const isSelected = selectedTargets.length === 0 || selectedTargets.includes(targetType);

            if (isHiddenByCS || !isSelected) {
                // Fails filters, hide it.
                item.style.display = 'none';
            } else {
                // Passes filters. Mark it for display and formatting.
                item.style.removeProperty('display');
                visibleItems.push({ item, data: targetData });
            }
        });

        // 3. Re-order and format only the visible items to remove gaps.
        let newYOffset = 0;
        // Sort visible items based on their original order in the API data to maintain consistency.
        visibleItems.sort((a, b) => {
            const indexA = targetsData.indexOf(a.data);
            const indexB = targetsData.indexOf(b.data);
            return indexA - indexB;
        });

        visibleItems.forEach(({ item, data }) => {
            // Apply positioning.
            item.style.setProperty('transform', `translateY(${newYOffset}px)`, 'important');
            const itemHeight = item.offsetHeight || DEFAULT_ITEM_HEIGHT;
            newYOffset += itemHeight;

            // Apply all visual formatting.
            const mainContentWrapper = item.querySelector('[class*="crimeOption___"]');
            const titleTypeEle = mainContentWrapper.querySelector('[class*="titleAndProps"] > div:first-child');
            const physicalPropsEle = mainContentWrapper.querySelector('[class*="titleAndProps"] > div:last-child');
            const activityEle = mainContentWrapper.querySelector('[class*="activity"]');
            const divContainingButton = mainContentWrapper.querySelector('[class*="commitButtonSection"]');

            if (!titleTypeEle) return;

            const targetType = data.title;
            const targetCsLevel = parseInt(JARVIS_MARK_CS_LEVELS_MAP[targetType], 10);
            const build = data.crimeInfo.muscular;
            const activityName = data.crimeInfo.status.title;
            const difficulties = JARVIS_getDifficulties(targetType, build, activityName);

            if (physicalPropsEle && difficulties.buildSemantic) physicalPropsEle.style.color = JARVIS_COLORS[difficulties.buildSemantic];
            else if (physicalPropsEle) physicalPropsEle.style.removeProperty('color');

            if (activityEle && difficulties.activitySemantic) activityEle.style.color = JARVIS_COLORS[difficulties.activitySemantic];
            else if (activityEle) activityEle.style.removeProperty('color');

            const csLevelText = `(${targetCsLevel}%)`;
            if (!titleTypeEle.textContent.startsWith(targetType) || !titleTypeEle.textContent.includes(csLevelText)) {
                titleTypeEle.textContent = `${targetType} ${csLevelText}`;
            }
            titleTypeEle.style.color = JARVIS_COLORS[difficulties.csSemantic];

            if (divContainingButton) {
                divContainingButton.style.backgroundColor = JARVIS_COLORS[difficulties.finalSemantic];
            }
        });

        const scrollContent = virtualListContainer.querySelector('div[style*="height"]');
        if (scrollContent) {
            scrollContent.style.height = `${newYOffset}px`;
        }
        // --- End of New `iconClass` Linking Logic ---
    }


    function JARVIS_getMaxSkillIndex() { let idx = 0; JARVIS_SKILL_STARTS.forEach((ele, currentIdx) => { if (Math.floor(jarvisCurrentSkillLevel) >= ele) idx = currentIdx; }); return idx; }
    function JARVIS_getAllSafeSkillCats() { const maxIndex = JARVIS_getMaxSkillIndex(); return maxIndex >= JARVIS_SKILL_CATS.length ? JARVIS_SKILL_CATS.slice() : JARVIS_SKILL_CATS.slice(0, maxIndex + 1); }
    function JARVIS_getMarkIdealityBasedOnCS(mark) { const safeSkillCats = JARVIS_getAllSafeSkillCats(); for (let idx = 0; idx < safeSkillCats.length; idx++) { const safeSkillCat = safeSkillCats[idx]; if (JARVIS_MARK_GROUPS[safeSkillCat] && JARVIS_MARK_GROUPS[safeSkillCat].includes(mark)) { if (idx === safeSkillCats.length - 1) return 'ideal'; if (idx === safeSkillCats.length - 2) return 'easy'; return 'tooEasy'; }} return 'tooHard'; }
    function JARVIS_getDifficulties(markType, build, status) { const buildsToAvoid = { Businessman: ['Skinny'], 'Drunk man': ['Muscular'], 'Gang member': ['Muscular'], 'Sex worker': ['Muscular'], Student: ['Athletic'], Thug: ['Muscular'] }; const statusesToAvoid = { Businessman: ['Walking'], 'Drunk man': ['Distracted'], 'Drunk woman': ['Distracted'], 'Homeless person': ['Loitering'], Junkie: ['Loitering'], Laborer: ['Distracted'], 'Police officer': ['Walking'], 'Sex worker': ['Distracted'], Thug: ['Loitering', 'Walking'] }; const difficulties = { csSemantic: 'uncategorized', activitySemantic: undefined, buildSemantic: undefined, finalSemantic: 'uncategorized' }; difficulties.csSemantic = JARVIS_getMarkIdealityBasedOnCS(markType); difficulties.finalSemantic = difficulties.csSemantic; if (buildsToAvoid[markType] && buildsToAvoid[markType].includes(build)) { difficulties.finalSemantic = 'tooHard'; difficulties.buildSemantic = 'tooHard'; } if (statusesToAvoid[markType] && statusesToAvoid[markType].includes(status)) { difficulties.finalSemantic = 'tooHard'; difficulties.activitySemantic = 'tooHard'; } return difficulties; }

    function addAndListenToJARVISLevelLimits() {
        const minInput = document.getElementById('cpo-jarvis-minlvl');
        const maxInput = document.getElementById('cpo-jarvis-maxlvl');

        if (!minInput || !maxInput) {
            debugError("Could not find CS Level limit inputs in the panel.");
            return;
        }

        const triggerRefetch = () => {
            window.dispatchEvent(new CustomEvent('cpo-refetch-crimes'));
        };

        minInput.addEventListener('input', e => {
            GM_setValue(JARVIS_MIN_LS_KEY, e.target.value);
            triggerRefetch();
        });
        maxInput.addEventListener('input', e => {
            GM_setValue(JARVIS_MAX_LS_KEY, e.target.value);
            triggerRefetch();
        });
        debugLog("CS Level limits UI listeners added to panel.");
    }

    function sanitizeText(text) { if (typeof text !== 'string') return ""; return text.split('(')[0].trim().replace(/[^a-zA-Z0-9\s-]/g, ""); };
    function cleanSavedTargets() { let cleanedList = savedTargets.map(sanitizeText).filter(name => name); cleanedList = [...new Set(cleanedList)]; if (!cleanedList.includes("Cyclist")) cleanedList.push("Cyclist"); if (JSON.stringify(cleanedList) !== JSON.stringify(savedTargets)) { savedTargets = cleanedList; GM_setValue('savedTargets', savedTargets); } };
    function updateAudioStatusButtonText() { const audioButton = document.getElementById('cpo-audio-status-btn'); if (audioButton) audioButton.textContent = audioContextUnlocked ? "Audio Status: On" : "Audio Status: Off"; };
    function preloadMainAlertSound() { if (preloadedAlertAudio && preloadedAlertAudio.readyState > 0) return; preloadedAlertAudio = new Audio(ALERT_SOUND_URL); preloadedAlertAudio.preload = "auto"; preloadedAlertAudio.oncanplaythrough = () => debugLog("Main alert sound preloaded."); preloadedAlertAudio.onerror = (e) => { debugError("Error preloading main alert sound:", e); preloadedAlertAudio = null; }; preloadedAlertAudio.load(); };
    function attemptAudioUnlock(interactionType = "unknown interaction") {
        return new Promise((resolve) => {
            if (globalAudioContext && globalAudioContext.state === 'running') {
                audioContextUnlocked = true;
                GM_setValue('audioContextUnlocked', true);
                if (!preloadedAlertAudio || preloadedAlertAudio.readyState < 3) preloadMainAlertSound();
                updateAudioStatusButtonText();
                debugLog(`AudioContext already running. Unlock confirmed via ${interactionType}.`);
                resolve(true);
                return;
            }
            if (isUnlockingAudioActivity) {
                debugLog(`Audio unlock already in progress (triggered by ${interactionType}).`);
                resolve(false);
                return;
            }
            isUnlockingAudioActivity = true;
            let unlockTimeoutId = null;
            const finishAttempt = (success, message) => {
                clearTimeout(unlockTimeoutId);
                isUnlockingAudioActivity = false;
                audioContextUnlocked = success;
                GM_setValue('audioContextUnlocked', success);
                if (success) {
                    if (!preloadedAlertAudio || preloadedAlertAudio.readyState < 3) preloadMainAlertSound();
                } else {
                    if (globalAudioContext && globalAudioContext.close && globalAudioContext.state !== 'closed') {
                        globalAudioContext.close().catch(e => debugWarn("Error closing AudioContext after failed unlock:", e));
                    }
                    globalAudioContext = null;
                }
                updateAudioStatusButtonText();
                debugLog(`AudioContext unlock attempt (via ${interactionType}) ${success ? 'successful' : 'failed'}: ${message}. State: ${globalAudioContext ? globalAudioContext.state : 'null'}`);
                resolve(success);
            };
            unlockTimeoutId = setTimeout(() => finishAttempt(false, `Timeout. State: ${globalAudioContext ? globalAudioContext.state : 'null'}`), AUDIO_CONTEXT_UNLOCK_TIMEOUT_MS);
            try {
                if (!globalAudioContext || globalAudioContext.state === 'closed') {
                    globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (globalAudioContext.state === 'running') {
                    finishAttempt(true, "Context was already running.");
                } else if (globalAudioContext.state === 'suspended') {
                    globalAudioContext.resume().then(() => finishAttempt(globalAudioContext.state === 'running', `Resume attempt. Final state: ${globalAudioContext.state}`)).catch(e => finishAttempt(false, `Resume rejected: ${e.message}`));
                } else {
                    finishAttempt(false, `Unexpected initial state: ${globalAudioContext.state}.`);
                }
            } catch (e) {
                finishAttempt(false, `Exception during audio unlock: ${e.message}`);
            }
        });
    }

    function createPanel() {
        const existingPanel = document.getElementById('cpo-panel');
        if (existingPanel) return;

        const panel = document.createElement('div');
        panel.id = 'cpo-panel';
        panel.style.top = panelPosition.top;
        panel.style.left = panelPosition.left;

        const minLsLevelToSet = GM_getValue(JARVIS_MIN_LS_KEY, 100);
        const maxLsLevelToSet = GM_getValue(JARVIS_MAX_LS_KEY, 300);

        panel.innerHTML = `
            <div id="cpo-drag-handle">
                <span id="cpo-panel-title">Pickpocketing Overhaul</span>
                <button id="cpo-minimize-btn">${isPanelMinimized ? '+' : '-'}</button>
            </div>
            <div id="cpo-content">
                <button id="cpo-audio-status-btn">Audio Status: Off</button>
                <button id="cpo-enable-alerts-btn">${enableAlerts ? "Disable Alerts" : "Enable Alerts"}</button>
                <button id="cpo-select-targets-btn">Select Targets</button>
                <div id="cpo-dropdown-menu"></div>
                <div id="cpo-cs-filter-container">
                        <label for="cpo-jarvis-minlvl">Min CS:</label>
                        <input type="number" id="cpo-jarvis-minlvl" name="minlvl" min="100" max="350" step="50" value="${minLsLevelToSet}"/>
                        <label for="cpo-jarvis-maxlvl">Max CS:</label>
                        <input type="number" id="cpo-jarvis-maxlvl" name="maxlvl" min="100" max="350" step="50" value="${maxLsLevelToSet}"/>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        updateAudioStatusButtonText();
        if (isPanelMinimized) panel.classList.add('cpo-minimized');

        const dragHandle = document.getElementById('cpo-drag-handle');
        let offsetX, offsetY, isDragging = false;
        dragHandle.addEventListener('mousedown', (e) => { if (e.target.id === 'cpo-minimize-btn') return; isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; dragHandle.style.cursor = 'grabbing'; panel.style.transition = 'none'; });
        document.addEventListener('mousemove', (e) => { if (!isDragging) return; let newTop = e.clientY - offsetY; let newLeft = e.clientX - offsetX; newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight)); newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth)); panel.style.top = `${newTop}px`; panel.style.left = `${newLeft}px`; });
        document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; dragHandle.style.cursor = 'grab'; panel.style.removeProperty('transition'); panelPosition = { top: panel.style.top, left: panel.style.left }; GM_setValue('panelPosition', panelPosition); } });
        document.getElementById('cpo-minimize-btn').addEventListener('click', (e) => { e.stopPropagation(); isPanelMinimized = !isPanelMinimized; panel.classList.toggle('cpo-minimized', isPanelMinimized); e.target.textContent = isPanelMinimized ? '+' : '-'; GM_setValue('isPanelMinimized', isPanelMinimized); });
        document.getElementById('cpo-audio-status-btn').addEventListener('click', () => attemptAudioUnlock("manual 'Audio Status' button click"));
        document.getElementById('cpo-select-targets-btn').addEventListener('click', () => { const dropdownMenu = document.getElementById('cpo-dropdown-menu'); if (dropdownMenu) dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'; });
        document.getElementById('cpo-enable-alerts-btn').addEventListener('click', () => { enableAlerts = !enableAlerts; GM_setValue('enableAlerts', enableAlerts); document.getElementById('cpo-enable-alerts-btn').textContent = enableAlerts ? "Disable Alerts" : "Enable Alerts"; if (enableAlerts && !audioContextUnlocked) attemptAudioUnlock("'Enable Alerts' button click"); if (!enableAlerts) { if (isTabFlashing) stopTabFlash(); hideOnScreenAlertUI(); currentAlertingTargets.clear(); targetsOnPageLastCycle.clear(); lastDisplayedOnScreenAlertMessage = ""; } });

        // After creating the panel, immediately attach listeners to the new inputs.
        addAndListenToJARVISLevelLimits();
        updateDropdown([]);
    };

    function hideCyclistPanel() { const panel = document.getElementById('cpo-panel'); if (panel) panel.style.display = 'none'; };
    function showCyclistPanel() { const panel = document.getElementById('cpo-panel'); if (panel) panel.style.display = 'block'; };

    function updateDropdown(targetsData) {
        cleanSavedTargets();
        const dropdownMenu = document.getElementById('cpo-dropdown-menu');
        if (!dropdownMenu) return;
        dropdownMenu.innerHTML = '';

        targetsData.forEach(target => {
            let cleanTarget = sanitizeText(target.title);
            if (cleanTarget && !savedTargets.includes(cleanTarget)) {
                savedTargets.push(cleanTarget);
            }
        });

        savedTargets.sort();
        GM_setValue('savedTargets', savedTargets);

        savedTargets.forEach(target => {
            const option = document.createElement('div');
            option.textContent = target;
            option.style.backgroundColor = selectedTargets.includes(target) ? '#4CAF50' : 'transparent';
            option.style.color = 'white';
            option.addEventListener('click', () => {
                if (selectedTargets.includes(target)) {
                    selectedTargets = selectedTargets.filter(t => t !== target);
                } else {
                    selectedTargets.push(target);
                }
                GM_setValue('selectedTargets', selectedTargets);

                // Instead of calling a full update chain, just trigger a refetch event.
                // This keeps the logic centralized in the fetch interceptor's callback.
                window.dispatchEvent(new CustomEvent('cpo-refetch-crimes'));

                // Update the color of the clicked item immediately for responsiveness.
                option.style.backgroundColor = selectedTargets.includes(target) ? '#4CAF50' : 'transparent';
            });
            dropdownMenu.appendChild(option);
        });
    };

    function showOnScreenAlertUI(message) { let alertDiv = document.getElementById('cpo-on-screen-alert'); if (!alertDiv) { alertDiv = document.createElement('div'); alertDiv.id = 'cpo-on-screen-alert'; document.body.appendChild(alertDiv); } alertDiv.textContent = message; alertDiv.classList.add('show'); if (onScreenAlertTimeout) clearTimeout(onScreenAlertTimeout); onScreenAlertTimeout = null; };
    function hideOnScreenAlertUI() { const alertDiv = document.getElementById('cpo-on-screen-alert'); if (alertDiv) alertDiv.classList.remove('show'); if (onScreenAlertTimeout) clearTimeout(onScreenAlertTimeout); onScreenAlertTimeout = null; };

    async function checkForAlerts(targetsData) {
        if (!enableAlerts) return;

        const currentPotentiallyAlertableTargetsOnPage = new Set();
        const newTargetsForSoundThisCycle = new Set();

        targetsData.forEach(target => {
            const targetName = sanitizeText(target.title);
            if (selectedTargets.includes(targetName) && target.available) {
                currentPotentiallyAlertableTargetsOnPage.add(targetName);
                if (!targetsOnPageLastCycle.has(targetName)) {
                    newTargetsForSoundThisCycle.add(targetName);
                }
            }
        });

        currentAlertingTargets = new Set(currentPotentiallyAlertableTargetsOnPage);
        await playAlert(Array.from(currentAlertingTargets), Array.from(newTargetsForSoundThisCycle));
        targetsOnPageLastCycle = new Set(currentAlertingTargets);
    };

    function startTabFlash(alertMessage) { if (isTabFlashing) { document.title = alertMessage; return; } isTabFlashing = true; const currentOriginal = document.title; if (!currentOriginal.startsWith(FLASH_MESSAGE_BASE) && !currentOriginal.includes("🎯 ")) { originalTitle = currentOriginal; } else { if (originalTitle.startsWith(FLASH_MESSAGE_BASE) || originalTitle.includes("🎯 ")) { originalTitle = "Torn"; } } let flashState = false; flashIntervalId = setInterval(() => { document.title = flashState ? originalTitle : alertMessage; flashState = !flashState; }, 800); };
    function stopTabFlash() { if (!isTabFlashing) return; clearInterval(flashIntervalId); flashIntervalId = null; document.title = originalTitle; isTabFlashing = false; };
    async function playAlert(allCurrentlyAlertingTargetsArray, justAddedTargetsArray) {
        const newAlertMessage = allCurrentlyAlertingTargetsArray.length > 0 ? `Target(s) available: ${allCurrentlyAlertingTargetsArray.join(", ")}` : "";
        const soundShouldPlay = justAddedTargetsArray.length > 0;
        const alertDiv = document.getElementById('cpo-on-screen-alert');
        const isActuallyVisible = alertDiv && alertDiv.classList.contains('show');

        if (newAlertMessage) {
            let showOrUpdateThisCycle = false;
            if (soundShouldPlay) {
                showOrUpdateThisCycle = true;
            } else if (isActuallyVisible && newAlertMessage !== lastDisplayedOnScreenAlertMessage) {
                showOrUpdateThisCycle = true;
            } else if (!isActuallyVisible) {
                showOrUpdateThisCycle = true;
            }
            if (showOrUpdateThisCycle) {
                showOnScreenAlertUI(newAlertMessage);
                lastDisplayedOnScreenAlertMessage = newAlertMessage;
            }
            if (!document.hasFocus()) startTabFlash(newAlertMessage);
        } else {
            if (isActuallyVisible) hideOnScreenAlertUI();
            lastDisplayedOnScreenAlertMessage = "";
            if (isTabFlashing) stopTabFlash();
        }

        if (soundShouldPlay) {
            if (!audioContextUnlocked) {
                debugWarn("Audio not unlocked, attempting now for new target(s):", justAddedTargetsArray.join(", "));
                await attemptAudioUnlock("automatic on-alert");
            }
            if (audioContextUnlocked) {
                if (preloadedAlertAudio && preloadedAlertAudio.readyState >= 3) {
                    preloadedAlertAudio.currentTime = 0;
                    preloadedAlertAudio.play().catch(e => debugError("Preloaded audio play failed:", e));
                } else {
                    debugWarn("Preloaded audio not ready. Creating new instance.");
                    const freshAudio = new Audio(ALERT_SOUND_URL);
                    freshAudio.play().catch(e => debugError("Fresh audio play failed:", e));
                    if (!preloadedAlertAudio) preloadedAlertAudio = freshAudio;
                }
            } else {
                debugError("Audio unlock failed, cannot play sound.");
            }
        }
    }

    function waitForElementToExistWithObserver(selector, timeout = WAIT_FOR_ELEMENT_TIMEOUT_MS) { return new Promise((resolve, reject) => { const element = document.querySelector(selector); if (element) { resolve(element); return; } let localObserver = new MutationObserver((mutations, obs) => { const el = document.querySelector(selector); if (el) { if (obs) obs.disconnect(); clearTimeout(timerId); resolve(el); } }); localObserver.observe(document.documentElement, { childList: true, subtree: true }); const timerId = setTimeout(() => { const el = document.querySelector(selector); if (localObserver) localObserver.disconnect(); if (el) resolve(el); else reject(new Error(`Element ${selector} not found after ${timeout}ms.`)); }, timeout); }); }

    async function ensureUiIntegrity() {
        if (!pickpocketingFeaturesInitialized) return;

        const onPickpocketingPage = document.querySelector('.crimes-app h4[class^="heading"]')
            ?.textContent.trim().toLowerCase() === 'pickpocketing';

        if (onPickpocketingPage) {
            debugLog("UI Integrity Check Running...");
            if (!document.getElementById('cpo-panel')) {
                debugWarn("CPO Panel not found. Re-creating...");
                createPanel();
            }
        }
    }

    async function initializePickpocketingFeatures() {
        if (pickpocketingFeaturesInitialized) {
            debugLog("Pickpocketing features already initialized. Re-showing UI and re-applying formats.");
            showCyclistPanel();
            window.dispatchEvent(new CustomEvent('cpo-refetch-crimes'));
            return;
        }
        debugLog("Initializing pickpocketing features...");
        try {
            await waitForElementToExistWithObserver('.pickpocketing-root', 10000);
            debugLog("'.pickpocketing-root' found. Proceeding with full initialization.");

            cleanSavedTargets();
            createPanel();

            pickpocketingFeaturesInitialized = true;

            if (uiIntegrityInterval) clearInterval(uiIntegrityInterval);
            uiIntegrityInterval = setInterval(ensureUiIntegrity, 750);

            debugLog(`Pickpocketing features initialization complete.`);

            if (document.visibilityState === 'visible' && !audioContextUnlocked) {
                debugLog("Page is visible on load and AudioContext is not unlocked. User interaction may be needed to enable audio.");
                attemptAudioUnlock("Initial page load");
            } else if (audioContextUnlocked && (!preloadedAlertAudio || preloadedAlertAudio.readyState < 3) ) {
                preloadMainAlertSound();
            }
        } catch (error) {
            debugError("Main pickpocketing initialization chain FAILED:", error);
        }
    }

    function teardownPickpocketingFeatures() {
        if (!pickpocketingFeaturesInitialized) return;
        debugLog("Tearing down pickpocketing features...");

        if (uiIntegrityInterval) {
            clearInterval(uiIntegrityInterval);
            uiIntegrityInterval = null;
        }

        hideCyclistPanel();
        pickpocketingFeaturesInitialized = false;
        debugLog("Pickpocketing features teardown complete.");
    };

    async function handleCrimesHeaderMutation(mutations, callingObserver) { for (const mutation of mutations) { const headerElement = document.querySelector('.crimes-app h4[class^="heading"]'); if (headerElement && headerElement.textContent && headerElement.textContent.trim().toLowerCase() === 'pickpocketing') { if (!pickpocketingFeaturesInitialized) { debugLog("Pickpocketing header detected."); await initializePickpocketingFeatures(); } return; }} const currentHeaderEle = document.querySelector('.crimes-app h4[class^="heading"]'); if (currentHeaderEle && currentHeaderEle.textContent.trim().toLowerCase() !== 'pickpocketing') { if (pickpocketingFeaturesInitialized) { debugLog("Navigated away from Pickpocketing."); teardownPickpocketingFeatures(); }}};

    // --- Initialization and Event Listeners ---

    function setupNetworkInterceptor() {
        if (typeof unsafeWindow === 'undefined') {
            debugLog("INTERCEPT ERROR: unsafeWindow is not available. Fetch interception will not work.", 'error');
            return;
        }
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(...args) {
            let url;
            if (typeof args[0] === 'string') {
                url = args[0];
            } else if (args[0] instanceof Request) {
                url = args[0].url;
            }

            const fetchPromise = originalFetch.apply(this, args);

            if (url && (url.includes('crimes.php?') || (url.includes('/page.php') && url.includes('sid=crimesData') && url.includes('step=crimesList')))) {
                debugLog('INTERCEPTED crimes data fetch request for URL:', url);
                fetchPromise.then(response => {
                    if (!response.ok) {
                         debugWarn(`INTERCEPT: Received non-OK response status: ${response.status}`, response);
                         return;
                    }
                    const clonedResponse = response.clone();
                    clonedResponse.json()
                        .then(data => {
                            // Check if this is the specific data structure we need
                            if (data && data.DB && data.DB.crimesByType) {
                                window.cpoLastCrimesData = data;
                                processFetchedCrimeData(data);
                            }
                        })
                        .catch(err => debugError('INTERCEPT: Error parsing intercepted JSON:', err));
                }).catch(err => debugError('INTERCEPT: Fetch promise rejected.', err));
            }

            return fetchPromise;
        };
        // Add a custom event listener to manually trigger a re-process
        window.addEventListener('cpo-refetch-crimes', () => {
             if (window.cpoLastCrimesData) {
                   debugLog("Manual refetch triggered via event.");
                   processFetchedCrimeData(window.cpoLastCrimesData);
             } else {
                   debugWarn("Manual refetch triggered, but no crime data is cached yet.");
             }
        });

        debugLog("INTERCEPT: Fetch interceptor via unsafeWindow is now active.", "info");
    }

    function pageLoadInit() {
        // CORRECTED: This check now correctly identifies the crimes page URL.
        if (window.location.href.includes('page.php?sid=crimes')) {
            originalTitle = document.title;
            debugLog("On crimes page. Setting up header observer.");
            waitForElementToExistWithObserver('.crimes-app h4[class^="heading"]', WAIT_FOR_ELEMENT_TIMEOUT_MS)
                .then(async crimesHeaderTargetNode => {
                    if (crimesHeaderTargetNode.textContent && crimesHeaderTargetNode.textContent.trim().toLowerCase() === 'pickpocketing') {
                        debugLog("Initial header is Pickpocketing. Initializing features directly.");
                        await initializePickpocketingFeatures();
                    }
                    if (crimesHeaderObserver) { crimesHeaderObserver.disconnect(); }
                    crimesHeaderObserver = new MutationObserver(handleCrimesHeaderMutation);
                    crimesHeaderObserver.observe(crimesHeaderTargetNode, { characterData: true, childList: true, subtree: true });
                    debugLog("crimesHeaderObserver is now observing.");
                })
                .catch(err => {
                    debugError("Crimes page header for observer not found or error during setup.", err);
                });
        }
    }

    setupNetworkInterceptor();

    if (document.readyState === 'complete') {
        setTimeout(pageLoadInit, 500); // Delay to allow other scripts to run
    } else {
        window.addEventListener('load', () => setTimeout(pageLoadInit, 500));
    }

    window.addEventListener('focus', () => { if (isTabFlashing) stopTabFlash(); });
    window.addEventListener('blur', () => { if (enableAlerts && currentAlertingTargets.size > 0 && !document.hasFocus()) { startTabFlash(`${FLASH_MESSAGE_BASE}${Array.from(currentAlertingTargets).join(", ")}`); } });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { if (isTabFlashing) stopTabFlash(); if (globalAudioContext && globalAudioContext.state === 'suspended') { globalAudioContext.resume().then(() => { if (globalAudioContext.state === 'running' && !audioContextUnlocked) { audioContextUnlocked = true; GM_setValue('audioContextUnlocked', true); updateAudioStatusButtonText(); if(!preloadedAlertAudio || preloadedAlertAudio.readyState < 3) preloadMainAlertSound(); } }).catch(err => { debugWarn("Error resuming AudioContext on visibility change:", err); }); } } else { if (enableAlerts && currentAlertingTargets.size > 0 && !isTabFlashing) { startTabFlash(`${FLASH_MESSAGE_BASE}${Array.from(currentAlertingTargets).join(", ")}`); } } });
    GM_addStyle(` #cpo-panel { position: fixed !important; padding: 5px !important; border: 1px solid #333 !important; background-color: #2a2a2a !important; color: white !important; width: 220px !important; border-radius: 5px !important; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.6) !important; z-index: 9999999 !important; font-size: 13px !important; user-select: none !important; transition: width 0.2s ease-out, height 0.2s ease-out, padding 0.2s ease-out; } #cpo-drag-handle { height: 18px; background-color: #383838; cursor: grab; border-top-left-radius: 4px; border-top-right-radius: 4px; display: flex; align-items: center; justify-content: space-between; padding: 0 5px; margin-bottom: 5px; } #cpo-drag-handle:active { cursor: grabbing; } #cpo-panel-title { font-weight: bold; font-size: 12px; } #cpo-panel.cpo-minimized { width: 30px; height: 30px; padding: 0; overflow: hidden; } #cpo-panel.cpo-minimized #cpo-drag-handle { border-radius: 4px; margin-bottom: 0; justify-content: center; } #cpo-panel.cpo-minimized #cpo-panel-title, #cpo-panel.cpo-minimized #cpo-content { display: none; } #cpo-drag-handle #cpo-minimize-btn { background: none; border: none; color: #ccc; font-size: 16px; font-weight: bold; cursor: pointer; padding: 0 5px; line-height: 18px; width: auto; margin-bottom: 0; box-shadow: none; } #cpo-drag-handle #cpo-minimize-btn:hover { color: white; } #cpo-panel.cpo-minimized #cpo-minimize-btn { display: block; } #cpo-content > button { display: block; width: 100%; padding: 6px 10px; font-size: 13px; font-weight: bold; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; text-align: center; margin-bottom: 6px; transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease; box-shadow: 0 2px 3px rgba(0,0,0,0.2); } #cpo-content > button:hover { filter: brightness(1.1); } #cpo-content > button:active { filter: brightness(0.9); transform: translateY(1px); box-shadow: 0 1px 1px rgba(0,0,0,0.2); } #cpo-audio-status-btn { background-color: #f0ad4e; border-color: #eea236; } #cpo-audio-status-btn:hover { background-color: #ec971f; border-color: #d58512; } #cpo-enable-alerts-btn { background-color: #5cb85c; border-color: #4cae4c; } #cpo-enable-alerts-btn:hover { background-color: #4cae4c; border-color: #449d44; } #cpo-enable-alerts-btn:active { background-color: #449d44; } #cpo-select-targets-btn { background-color: #337ab7; border-color: #2e6da4; } #cpo-select-targets-btn:hover { background-color: #2e6da4; border-color: #204d74; } #cpo-select-targets-btn:active { background-color: #204d74; } #cpo-dropdown-menu { display: none; background-color: #2a2a2a; border: 1px solid #444; border-radius: 4px; padding: 5px; margin-top: 4px; overflow-y: auto; max-height: 150px; } #cpo-dropdown-menu div { padding: 4px; font-size: 12px; cursor: pointer; border-bottom: 1px solid #333; } #cpo-dropdown-menu div:last-child { border-bottom: none; } #cpo-dropdown-menu div:hover { background-color: #383838; } #cpo-on-screen-alert { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 9000000; font-size: 16px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; } #cpo-on-screen-alert.show { opacity: 1; visibility: visible; } #cpo-cs-filter-container { margin-top: 10px; padding-top: 10px; border-top: 1px solid #444; display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; align-items: center; } #cpo-cs-filter-container label { font-size: 12px; color: #ccc; text-align: right; padding-right: 5px; } #cpo-cs-filter-container input[type="number"] { width: 100%; padding: 2px 4px; border-radius: 2px; border: 1px solid #555; background-color: #444; color: white; box-sizing: border-box; } `);

})();
