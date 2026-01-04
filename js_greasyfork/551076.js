// ==UserScript==
// @name         Torn OC Highlighter MR v2
// @namespace    http://tampermonkey.net/
// @version      3.2.7
// @license MIT
// @description  Highlights joinable OC's that meet Adobi's rules and is closest to paused based on member progress, priority goes paused > empty OC > progressing > progressing with 1 member thats not started progressing. UI persists on tab change.
// @author       defend [2683949]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/551076/Torn%20OC%20Highlighter%20MR%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/551076/Torn%20OC%20Highlighter%20MR%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const HIGHLIGHT_CLASS = 'joinable-oc-highlight-v274c3';
    const STRICT_DISQUALIFYING_0DEG_STYLE = 'conic-gradient(var(--oc-clock-planning-bg) 0deg, var(--oc-clock-bg) 0deg)';
    const DISQUALIFYING_INACTIVE_ICON_SELECTOR = '.slotIcon___VVnQy > .inactive___Dpqh0';
    const OPEN_SLOT_CONTAINER_SELECTOR = '.joinContainer___huqrk';
    const PERIODIC_CHECK_INTERVAL_MS = 60000;
    const MAX_INITIAL_ATTEMPTS = 5;
    const INITIAL_ATTEMPT_DELAY = 1000;
    const ROOT_NODE_FIND_DELAY = 1000;

    const SCORE_TIER_FULLY_PAUSED = 1100;
    const SCORE_TIER_EMPTY_OC_TRIGGERED = 970;
    const SCORE_TIER_PROGRESSING_NO_0DEG_BASE = 600;

    const MINIMUM_PROGRESS_FOR_CONDITIONAL_0DEG = 300;

    // --- Selectors & UI IDs ---
    const UI_CONTAINER_ID = 'ocHighlighterUIContainer_v274c3';
    const LEVEL_FILTER_SELECT_ID = 'ocLevelFilterSelect_v274c3';
    const UI_TARGET_SELECTOR = '.currentDifficultyDescription___itwYT';
    const FACTION_CRIMES_ROOT_ID = 'faction-crimes-root';
    const FACTION_CRIMES_CONTENT_AREA_SELECTOR = `#${FACTION_CRIMES_ROOT_ID} > div`;
    const OC_LIST_SUB_SELECTOR = ".tt-oc2-list";
    const CRIME_CARD_SELECTOR = 'div[data-oc-id].wrapper___U2Ap7';
    const CRIME_CARD_FALLBACK_SELECTOR_IN_PARENT = '.wrapper___U2Ap7';
    const SLOTS_AREA_SELECTOR = '.wrapper___g3mPt';
    const INDIVIDUAL_SLOT_SELECTOR = '.wrapper___Lpz_D';
    const PLANNING_ELEMENT_SELECTOR = '.planning___CjB09';
    const OC_LEVEL_VALUE_SELECTOR = '.levelValue___TE4qC';
    const COOLDOWN_TIMER_SELECTOR = '.title___pB5FU[aria-live="off"]';

    const CRIMES_TAB_SENTINEL_SELECTOR = '.manualSpawnerContainer___JRyED';
    const POPUP_ID = 'oc-highlighter-popup-v274c3';

    // --- NEW SELECTOR FOR OC STATUS ---
    const OC_STATUS_ICON_SELECTOR = 'li[class*="icon85"], li[class*="icon89"]';

    // --- Popup Message ---
    const OFFICER_MESSAGE = `You should start a new crime but there are none.<br>Please message an officer: <a href="https://www.torn.com/profiles.php?XID=2443510" target="_blank">Adobi</a>, <a href="https://www.torn.com/profiles.php?XID=2334174" target="_blank">CharmRiver</a>, <a href="https://www.torn.com/profiles.php?XID=2581696" target="_blank">Gem</a>, or <a href="https://www.torn.com/profiles.php?XID=2094410" target="_blank">ekiM_</a>.
    <hr style="margin: 8px 0; border: 0; border-top: 1px solid rgba(0,0,0,0.1);">
    <small>For script issues, message <a href="https://www.torn.com/profiles.php?XID=2683949" target="_blank">defend</a>.</small>`;


    // --- State ---
    let previouslyHighlightedElement = null;
    let selectedOCLevelFilter = '7';
    let notificationHasBeenShown = false;

    // --- Styles for Highlighting and UI ---
    GM_addStyle(`
        .${HIGHLIGHT_CLASS} { border: 3px solid darkorchid !important; box-shadow: 0 0 15px darkorchid !important; background-color: rgba(153, 50, 204, 0.07) !important; }
        .${HIGHLIGHT_CLASS} .contentLayer___IYFdz { border-radius: inherit; }
        #${UI_CONTAINER_ID} { margin-left: 15px; display: inline-flex; align-items: center; vertical-align: middle; }
        #${UI_CONTAINER_ID} select { padding: 3px 5px; border: 1px solid #bbb; border-radius: 3px; background-color: #fff; color: #333; font-size: 12px; margin-left: 0px; }
        body.dark-mode #${UI_CONTAINER_ID} select { background-color: #444; color: #eee; border-color: #666; }
        #${POPUP_ID} { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 15px 40px 15px 20px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 99999; font-size: 14px; max-width: 90%; text-align: center; }
        body.dark-mode #${POPUP_ID} { background-color: #58151c; color: #f8d7da; border-color: #a52834; }
        #${POPUP_ID} .close-btn { position: absolute; top: 5px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: inherit; }
        #${POPUP_ID} a { color: #007bff; text-decoration: underline; }
        body.dark-mode #${POPUP_ID} a { color: #80c6ff; }
    `);

    // --- UI Functions ---
    // MODIFIED FUNCTION: The popup is now disabled by making this function empty.
    function showCustomAlert(message) { /* Popup disabled */ }
    function createLevelFilterUI() {
        if (document.getElementById(UI_CONTAINER_ID)) return;
        const targetElement = document.querySelector(UI_TARGET_SELECTOR);
        if (!targetElement || !targetElement.parentNode) return;
        const uiContainer = document.createElement('span'); uiContainer.id = UI_CONTAINER_ID;
        const select = document.createElement('select'); select.id = LEVEL_FILTER_SELECT_ID;
        const options = [{ value: '7', text: 'Level 7 OCs' }, { value: '8', text: 'Level 8 OCs' }];
        options.forEach(opt => { const o = document.createElement('option'); o.value = opt.value; o.textContent = opt.text; select.appendChild(o); });
        const savedLevel = localStorage.getItem('ocHighlighterSelectedLevel_v274c3');
        select.value = (savedLevel && options.some(o => o.value === savedLevel)) ? savedLevel : selectedOCLevelFilter;
        select.addEventListener('change', (event) => {
            selectedOCLevelFilter = event.target.value;
            localStorage.setItem('ocHighlighterSelectedLevel_v274c3', selectedOCLevelFilter);
            notificationHasBeenShown = false;
            const existingPopup = document.getElementById(POPUP_ID);
            if (existingPopup) existingPopup.remove();
            processOrganizedCrimes();
        });
        uiContainer.appendChild(select);
        targetElement.parentNode.insertBefore(uiContainer, targetElement.nextSibling);
    }

    // --- Helper Functions ---
    function isSlotStrictly0Deg(slotElement) { const p = slotElement.querySelector(PLANNING_ELEMENT_SELECTOR); if (p && p.style.background) { const c = p.style.background.replace(/\s+/g,' ').trim(); const d = STRICT_DISQUALIFYING_0DEG_STYLE.replace(/\s+/g,' ').trim(); return c === d; } return false; }
    function isSlotInactive(slotElement) { return slotElement.querySelector(DISQUALIFYING_INACTIVE_ICON_SELECTOR) !== null; }
    function extractDegreeFromStyle(styleBackground) { if (!styleBackground) return -1; let m = styleBackground.match(/var\(--oc-clock-planning-bg\)\s*([0-9\.]+deg)/i); if (m && m[1]) return parseFloat(m[1]); m = styleBackground.match(/conic-gradient\(.*?([0-9\.]+)deg/i); if (m && m[1]) return parseFloat(m[1]); return -1; }
    function getCrimeCardsParent() { const c = document.querySelector(FACTION_CRIMES_CONTENT_AREA_SELECTOR); if (!c) return null; const s = c.querySelector(OC_LIST_SUB_SELECTOR); return s || c; }
    function parseCooldownToHours(ariaLabel) { if (!ariaLabel) return 0; let t = 0; const d = ariaLabel.match(/(\d+)\s+day/); const h = ariaLabel.match(/(\d+)\s+hour/); if (d && d[1]) t += parseInt(d[1], 10) * 24; if (h && h[1]) t += parseInt(h[1], 10); return t; }
    function isDowntimeTriggerActive(allCards, targetLevel) { const H_THRESHOLD = (5 * 24) + 4; let l = 0; allCards.forEach(card => { const e = card.querySelector(OC_LEVEL_VALUE_SELECTOR); const a = e ? parseInt(e.textContent, 10) : null; if (a !== targetLevel) return; const t = card.querySelector(COOLDOWN_TIMER_SELECTOR); if (t && parseCooldownToHours(t.getAttribute('aria-label')) >= H_THRESHOLD) { l++; } }); return l < 2; }

    // --- Main Processing Function ---
    function processOrganizedCrimes() {
        // --- NEW: TOP-LEVEL SENTINEL CHECKS ---
        if (document.querySelector(OC_STATUS_ICON_SELECTOR)) {
            return false; // User is in an OC, do nothing.
        }
        if (!document.querySelector(CRIMES_TAB_SENTINEL_SELECTOR)) {
            const existingPopup = document.getElementById(POPUP_ID);
            if (existingPopup) existingPopup.remove();
            if (previouslyHighlightedElement) previouslyHighlightedElement.classList.remove(HIGHLIGHT_CLASS);
            notificationHasBeenShown = false;
            return false;
        }
        // --- END SENTINEL CHECKS ---

        const crimeCardsParent = getCrimeCardsParent();
        if (!crimeCardsParent) return false;

        let allCrimeCards = Array.from(crimeCardsParent.querySelectorAll(CRIME_CARD_SELECTOR));
        if (allCrimeCards.length === 0) { allCrimeCards = Array.from(crimeCardsParent.querySelectorAll(CRIME_CARD_FALLBACK_SELECTOR_IN_PARENT)); }
        if (allCrimeCards.length === 0) return false;

        if (previouslyHighlightedElement) previouslyHighlightedElement.classList.remove(HIGHLIGHT_CLASS);
        previouslyHighlightedElement = null;

        let eligibleAndScoredOCs = [];
        const currentLevel = parseInt(selectedOCLevelFilter, 10);
        const highlightEmptyOCTrigger = isDowntimeTriggerActive(allCrimeCards, currentLevel);
        let foundAnEmptyOC = false, foundAPausedOC = false;

        allCrimeCards.forEach((card) => {
            const ocId = card.dataset.ocId || 'UnknownID';
            const levelElement = card.querySelector(OC_LEVEL_VALUE_SELECTOR);
            if ((levelElement ? parseInt(levelElement.textContent, 10) : null) !== currentLevel) return;
            let currentCardHasOpenSlot = false, highestProgressingMemberDegree = -1, allFilledSlotsAreDone = true, hasAnyFilledSlots = false;
            let numberOfStrict0DegMembers = 0, allOtherNon0DegMembersMeetThreshold = true, inactiveSlotFound = false;
            const slotsArea = card.querySelector(SLOTS_AREA_SELECTOR);
            if (slotsArea) { const allSlotsInCard = slotsArea.querySelectorAll(INDIVIDUAL_SLOT_SELECTOR); if (allSlotsInCard.length > 0) { for (const slot of allSlotsInCard) { if (isSlotInactive(slot)) { inactiveSlotFound = true; break; } const isOpenSlot = slot.querySelector(OPEN_SLOT_CONTAINER_SELECTOR) !== null; if (isOpenSlot) { currentCardHasOpenSlot = true; } else { hasAnyFilledSlots = true; const planningElement = slot.querySelector(PLANNING_ELEMENT_SELECTOR); const isStrict0DegThisSlot = planningElement ? isSlotStrictly0Deg(slot) : false; const degree = planningElement ? extractDegreeFromStyle(planningElement.style.background) : -1; if (isStrict0DegThisSlot) { numberOfStrict0DegMembers++; } else { if (degree < MINIMUM_PROGRESS_FOR_CONDITIONAL_0DEG && degree !== -1 && degree < 360) { allOtherNon0DegMembersMeetThreshold = false; } } if (degree >= 0 && degree < 360) { highestProgressingMemberDegree = Math.max(highestProgressingMemberDegree, degree); allFilledSlotsAreDone = false; } else if (degree !== 360) { allFilledSlotsAreDone = false; }}}} else { inactiveSlotFound = true; }} else { inactiveSlotFound = true; }
            if (inactiveSlotFound) return;
            if (hasAnyFilledSlots) { let isEligible = false; if (currentCardHasOpenSlot) { if (numberOfStrict0DegMembers === 0) { isEligible = true; } else if (numberOfStrict0DegMembers === 1 && allOtherNon0DegMembersMeetThreshold) { isEligible = true; }} if (isEligible) { let score; if (allFilledSlotsAreDone) { score = SCORE_TIER_FULLY_PAUSED; foundAPausedOC = true; } else { if (numberOfStrict0DegMembers === 0) { score = SCORE_TIER_PROGRESSING_NO_0DEG_BASE + highestProgressingMemberDegree; } else { score = highestProgressingMemberDegree; } } eligibleAndScoredOCs.push({ element: card, score: score }); }}
            else { if (highlightEmptyOCTrigger && currentCardHasOpenSlot) { eligibleAndScoredOCs.push({ element: card, score: SCORE_TIER_EMPTY_OC_TRIGGERED }); foundAnEmptyOC = true; }}
        });

        if (highlightEmptyOCTrigger && !foundAnEmptyOC && !foundAPausedOC && !notificationHasBeenShown) {
            showCustomAlert(OFFICER_MESSAGE);
            notificationHasBeenShown = true;
        }

        if (eligibleAndScoredOCs.length === 0) return true;
        eligibleAndScoredOCs.sort((a, b) => b.score - a.score);

        if (eligibleAndScoredOCs.length > 0) {
            const bestOC = eligibleAndScoredOCs[0];
            bestOC.element.classList.add(HIGHLIGHT_CLASS);
            previouslyHighlightedElement = bestOC.element;
        }
        return true;
    }

    // --- Main Execution ---
    let debounceTimer, periodicCheckIntervalId = null, observer = null, initialAttempts = 0;
    function handleMutations() {clearTimeout(debounceTimer); debounceTimer = setTimeout(() => {processOrganizedCrimes(); if (document.querySelector(CRIMES_TAB_SENTINEL_SELECTOR) && !document.getElementById(UI_CONTAINER_ID)) { createLevelFilterUI(); }}, 300);}
    function performPeriodicCheck() { processOrganizedCrimes(); }
    function attemptInitialProcessing() { if (processOrganizedCrimes()) { startFullMonitoring(); } else { initialAttempts++; if (initialAttempts < MAX_INITIAL_ATTEMPTS) { setTimeout(attemptInitialProcessing, INITIAL_ATTEMPT_DELAY); } else { startFullMonitoring(); }}}
    function startFullMonitoring() {const r = document.getElementById(FACTION_CRIMES_ROOT_ID); if (r) { createLevelFilterUI(); if (!observer) { observer = new MutationObserver(handleMutations); observer.observe(r, { childList: true, subtree: true, attributes: true }); } if (periodicCheckIntervalId) clearInterval(periodicCheckIntervalId); periodicCheckIntervalId = setInterval(performPeriodicCheck, PERIODIC_CHECK_INTERVAL_MS);}}
    function initialize() { const s = localStorage.getItem('ocHighlighterSelectedLevel_v274c3'); selectedOCLevelFilter = (s === '7' || s === '8') ? s : '7'; localStorage.setItem('ocHighlighterSelectedLevel_v274c3', selectedOCLevelFilter); const r = document.getElementById('faction-crimes'); if (r) { attemptInitialProcessing(); } else { setTimeout(initialize, ROOT_NODE_FIND_DELAY); }}
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initialize); } else { initialize(); }
    window.addEventListener('beforeunload', () => { if (periodicCheckIntervalId) clearInterval(periodicCheckIntervalId); if (observer) observer.disconnect(); });
})();