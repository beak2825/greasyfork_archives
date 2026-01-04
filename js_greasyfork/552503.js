// ==UserScript==
// @name         Faction OC Highlighter MR BACKUP
// @namespace    http://tampermonkey.net/
// @version      8.6
// @description  Highlights OCs, Priority goes: Prioritized > Paused > Close to being paused
// @author       defend [2683949]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552503/Faction%20OC%20Highlighter%20MR%20BACKUP.user.js
// @updateURL https://update.greasyfork.org/scripts/552503/Faction%20OC%20Highlighter%20MR%20BACKUP.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- --- --- CONFIGURATION --- --- ---
    const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyaIdhoH-P5mnfO1UgYAKR017vZRfKl7AKio-_iBgC3GJ3lDBog93fp1xRzycnLYNkMJg/exec';
    const ADMIN_IDS = [2683949, 2094410, 2443510, 2581696, 2334174, 1884573, 945786, 2549670];
    const MOBILE_MANAGER_KEY = 2818237;
    const CACHE_DURATION_MS = 1 * 60 * 1000;
    const FALLBACK_OC_REQUIREMENTS = { "BLAST FROM THE PAST": { _default: { min: 75 }, "PICKLOCK #2": {} }, "CLINICAL PRECISION": { _default: { min: 74 } }, "BREAK THE BANK": { _default: { min: 71 } }, "STACKING THE DECK": { _default: { min: 74 }, "DRIVER": { min: 66 } }, "ACE IN THE HOLE": { _default: { min: 64 }, "DRIVER": { min: 56 } }};
 
 
    // --- --- --- GLOBAL STATE & IDS --- --- ---
    const OC_PLANNER_PANEL_ID = 'oc-planner-panel-v1', OPEN_BUTTON_ID = 'oc-planner-open-btn-v1', HIGHLIGHT_CLASS = 'oc-planner-highlight-from-v2', PRIORITY_HIGHLIGHT_CLASS = 'oc-planner-priority-highlight', SCROLL_PROMPT_ID = 'oc-planner-scroll-prompt', NO_CRIMES_POPUP_ID = 'oc-planner-no-crimes-popup';
    let OC_REQUIREMENTS = {}, PRIORITY_OCS = [], previouslyHighlightedElements = new Set(), isAdmin = false, currentUserId = null, noCrimesAlertShown = false, userDismissedPriorityPrompt = false;
 
    // --- Selectors ---
    const BUTTON_TARGET_SELECTOR = '.currentDifficultyDescription___itwYT', CRIME_CARD_SELECTOR = 'div[data-oc-id].wrapper___U2Ap7', CRIME_TITLE_SELECTOR = '.panelTitle___aoGuV', JOINABLE_SLOT_SELECTOR = '.waitingJoin___jq10k', FILLED_SLOT_SELECTOR = '.wrapper___Lpz_D:not(.waitingJoin___jq10k)', PLANNING_CIRCLE_SELECTOR = '.planning___CjB09', SLOT_ROLE_NAME_SELECTOR = '.title___UqFNy', SLOT_USER_LEVEL_SELECTOR = '.successChance___ddHsR', INACTIVE_ICON_SELECTOR = '.inactive___Dpqh0';
 
 
    // --- --- --- DATA HANDLING (FETCH & SAVE) --- --- ---
    function fetchOCData() {
        return new Promise((resolve, reject) => {
            const cachedData = JSON.parse(sessionStorage.getItem('ocPlannerData'));
            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
                OC_REQUIREMENTS = cachedData.data.requirements;
                PRIORITY_OCS = cachedData.data.priorityOCs || [];
                return resolve();
            }
            GM_xmlhttpRequest({
                method: 'GET', url: GOOGLE_SHEET_API_URL,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const dataToCache = { data: data, timestamp: Date.now() };
                            OC_REQUIREMENTS = data.requirements;
                            PRIORITY_OCS = data.priorityOCs || [];
                            sessionStorage.setItem('ocPlannerData', JSON.stringify(dataToCache));
                            resolve();
                        } catch (e) {
                            console.error("OC Planner: Failed to parse API data, using fallback.", e);
                            OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                            reject(e);
                        }
                    } else {
                        console.error("OC Planner: API error, using fallback. Status:", response.status);
                        OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                        reject(new Error("API Error"));
                    }
                },
                onerror: function(error) {
                    console.error("OC Planner: Network error, using fallback.", error);
                    OC_REQUIREMENTS = FALLBACK_OC_REQUIREMENTS;
                    reject(error);
                }
            });
        });
    }
 
    function saveOCRequirements(newRules) {
        GM_xmlhttpRequest({
            method: 'POST', url: GOOGLE_SHEET_API_URL, data: JSON.stringify(newRules), headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    alert("OC rules saved. Refresh the page");
                    sessionStorage.removeItem('ocPlannerData');
                } else {
                    console.error("OC Planner Save Error:", response.status, response.responseText);
                    alert("Save failed. See console.");
                }
            },
            onerror: function(error) {
                console.error("OC Planner Save Network Error:", error);
                alert("Save failed due to a network error.");
            }
        });
    }
 
    function savePriorityOCs() {
        const payload = { action: 'setPriority', ocList: PRIORITY_OCS };
        GM_xmlhttpRequest({
            method: 'POST', url: GOOGLE_SHEET_API_URL, data: JSON.stringify(payload), headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    alert(`Priority list updated Refresh the page`);
                    sessionStorage.removeItem('ocPlannerData');
                } else {
                    alert("Failed to save priority list. See console.");
                }
            },
            onerror: function(error) {
                alert("Network error saving priority list.");
            }
        });
    }
 
 
    // --- --- --- CORE HIGHLIGHTING LOGIC --- --- ---
    function extractDegreeFromStyle(bg) { if (!bg) return -1; const m = bg.match(/([\d\.]+)deg/); return m ? parseFloat(m[1]) : -1; }
    function isSlotAt0Deg(el) { const p = el.querySelector(PLANNING_CIRCLE_SELECTOR); return p?.style.background.replace(/\s+/g, '').includes('(var(--oc-clock-planning-bg)0deg,var(--oc-clock-bg)0deg)'); }
    function isSlotAt360Deg(el) {
        const p = el.querySelector(PLANNING_CIRCLE_SELECTOR);
        if (!p) return false;
        const bg = p.style.background;
        if (!bg) return false;
        const match = bg.match(/conic-gradient\(.*?([\d\.]+)deg/);
        if (match && match[1]) {
            return parseFloat(match[1]) >= 360;
        }
        return false;
    }
    function isSlotInactive(el) { return el.querySelector(INACTIVE_ICON_SELECTOR) !== null; }
 
    function isUserEligibleForCrime(card) {
        const title = card.querySelector(CRIME_TITLE_SELECTOR)?.textContent.trim().toUpperCase();
        const rules = OC_REQUIREMENTS[title];
        if (!rules) return true;
 
        for (const slot of card.querySelectorAll(JOINABLE_SLOT_SELECTOR)) {
            const roleEl = slot.querySelector(SLOT_ROLE_NAME_SELECTOR);
            const levelEl = slot.querySelector(SLOT_USER_LEVEL_SELECTOR);
            if (roleEl && levelEl) {
                const role = roleEl.textContent.trim().toUpperCase();
                const level = parseInt(levelEl.textContent);
                const rule = rules[role] || rules._default;
                if (rule) {
                    const meetsMin = 'min' in rule ? level >= rule.min : true;
                    const meetsMax = 'max' in rule ? level <= rule.max : true;
                    // If they meet the requirement for this single slot, they are eligible for the whole crime
                    if (meetsMin && meetsMax) return true;
                }
            }
        }
        // If they don't meet requirements for any available slot
        return false;
    }
 
    async function processAndHighlightOCs() {
        if (Object.keys(OC_REQUIREMENTS).length === 0) { try { await fetchOCData(); } catch (e) { /* fallback */ } }
        previouslyHighlightedElements.forEach(el => el.classList.remove(HIGHLIGHT_CLASS, PRIORITY_HIGHLIGHT_CLASS));
        previouslyHighlightedElements.clear();
 
        const allCrimeCards = Array.from(document.querySelectorAll(CRIME_CARD_SELECTOR));
        if (allCrimeCards.length === 0) return;
        allCrimeCards.forEach(addPriorityButton);
 
        let nonPriorityCards = [...allCrimeCards];
        let missingPriority = false;
        let priorityCardsWereFound = false;
 
        if (PRIORITY_OCS && PRIORITY_OCS.length > 0) {
            const priorityCardsInOrder = [];
 
            PRIORITY_OCS.forEach(priority => {
                const card = allCrimeCards.find(c => c.dataset.ocId == priority.id);
                if (card) {
                    nonPriorityCards = nonPriorityCards.filter(c => c.dataset.ocId != priority.id);
                    const currentMembers = card.querySelectorAll(FILLED_SLOT_SELECTOR).length;
                    if (currentMembers < priority.target && isUserEligibleForCrime(card)) {
                        priorityCardsInOrder.push(card);
                    } else {
                        console.log(`OC Planner: Priority ${priority.id} will not be highlighted (target met or user ineligible).`);
                    }
                } else {
                    missingPriority = true;
                }
            });
 
            if (missingPriority) {
                if (!userDismissedPriorityPrompt) {
                    showScrollPrompt(PRIORITY_OCS);
                }
            } else {
                hideScrollPrompt();
            }
 
            priorityCardsInOrder.reverse().forEach(card => {
                if (card.querySelector(JOINABLE_SLOT_SELECTOR)) {
                    const parent = card.parentNode;
                    if (parent && parent.firstChild !== card) parent.insertBefore(card, parent.firstChild);
                    card.classList.add(PRIORITY_HIGHLIGHT_CLASS);
                    previouslyHighlightedElements.add(card);
                    priorityCardsWereFound = true;
                }
            });
 
        } else {
             hideScrollPrompt();
        }
 
        if (!priorityCardsWereFound) {
            let pausedOcsWereFound = false;
 
            // Check for Paused OCs first
            const pausedEligibleOCs = [];
            nonPriorityCards.forEach(card => {
                if (!card.querySelector(JOINABLE_SLOT_SELECTOR) || !isUserEligibleForCrime(card)) return;
 
                const filledSlots = card.querySelectorAll(FILLED_SLOT_SELECTOR);
                if (filledSlots.length === 0) return;
 
                if (Array.from(filledSlots).every(isSlotAt360Deg)) {
                    pausedEligibleOCs.push(card);
                }
            });
 
            if (pausedEligibleOCs.length > 0) {
                // Highlight ALL eligible paused OCs and move them to the top.
                pausedEligibleOCs.reverse().forEach(pausedOC => {
                    const parent = pausedOC.parentNode;
                    if (parent && parent.firstChild !== pausedOC) {
                        parent.insertBefore(pausedOC, parent.firstChild);
                    }
                    pausedOC.classList.add(HIGHLIGHT_CLASS);
                    previouslyHighlightedElements.add(pausedOC);
                });
                pausedOcsWereFound = true;
            }
 
            // If no paused OCs were found, fallback to closest-to-complete logic
            if (!pausedOcsWereFound) {
                let candidateOCs = [];
                nonPriorityCards.forEach(card => {
                    if (!card.querySelector(JOINABLE_SLOT_SELECTOR)) return;
                    let isDisq = false;
                    for (const slot of card.querySelectorAll(FILLED_SLOT_SELECTOR)) { if (isSlotAt0Deg(slot) || isSlotInactive(slot)) { isDisq = true; break; } }
                    if (isDisq || !isUserEligibleForCrime(card)) return;
                    let maxProgress = -1;
                    card.querySelectorAll(FILLED_SLOT_SELECTOR).forEach(slot => { const p = slot.querySelector(PLANNING_CIRCLE_SELECTOR); if (p) { const d = extractDegreeFromStyle(p.style.background); if (d < 360 && d > maxProgress) maxProgress = d; } });
                    if (maxProgress > -1) candidateOCs.push({ element: card, score: maxProgress });
                });
 
                if (candidateOCs.length > 0) {
                    candidateOCs.sort((a, b) => b.score - a.score);
                    const bestOCElement = candidateOCs[0].element;
                    const parent = bestOCElement.parentNode;
                    if (parent && parent.firstChild !== bestOCElement) parent.insertBefore(bestOCElement, parent.firstChild);
                    bestOCElement.classList.add(HIGHLIGHT_CLASS);
                    previouslyHighlightedElements.add(bestOCElement);
                }
            }
        }
 
        if (previouslyHighlightedElements.size === 0) {
            if (!noCrimesAlertShown) {
                showNoCrimesPopup();
                noCrimesAlertShown = true;
            }
        } else {
            const noCrimesPopup = document.getElementById(NO_CRIMES_POPUP_ID);
            if (noCrimesPopup) noCrimesPopup.remove();
            noCrimesAlertShown = false;
        }
    }
 
 
    // --- --- --- UI & STYLES --- --- ---
    function initializeUI() {
        const userIdElement = document.querySelector('.menu-info-row___YG31c a.menu-value___gLaLR[href*="XID="]');
        if (userIdElement) {
            currentUserId = parseInt(userIdElement.href.split("XID=")[1]);
            isAdmin = ADMIN_IDS.includes(currentUserId);
        } else {
            if (ADMIN_IDS.includes(MOBILE_MANAGER_KEY)) {
                isAdmin = true;
            } else {
                isAdmin = false;
            }
        }
 
        if (isAdmin) {
            if (document.getElementById(OPEN_BUTTON_ID)) return;
            const targetElement = document.querySelector(BUTTON_TARGET_SELECTOR);
            if (!targetElement || !targetElement.parentNode) return;
 
            if (!document.getElementById(OC_PLANNER_PANEL_ID)) {
                const plannerPanel = document.createElement('div');
                plannerPanel.id = OC_PLANNER_PANEL_ID;
 
                plannerPanel.innerHTML = `
                    <div id="oc-planner-header">
                        <h2>Organized Crime Planner</h2>
                        <div class="oc-planner-header-controls">
                            <button id="oc-theme-toggle-btn" title="Toggle Theme"></button>
                            <button id="oc-planner-close-btn" title="Close">×</button>
                        </div>
                    </div>
                    <div id="oc-planner-content">
                        <div class="oc-planner-section oc-planner-admin-controls">
                             <h3>Admin Controls</h3>
                             <button id="oc-clear-priority-btn" class="torn-btn">Clear All Priorities</button>
                        </div>
                        <div class="oc-planner-section">
                            <h3>Faction OC Rules</h3>
                            <div id="oc-admin-form-container">Loading...</div>
                        </div>
                    </div>
                    <div id="oc-planner-footer">
                        <button id="oc-admin-save-btn" class="torn-btn">Save Rules</button>
                    </div>`;
 
                document.body.appendChild(plannerPanel);
                setupPanelEventListeners();
                applySavedTheme();
            }
 
            const openButton = document.createElement('button');
            openButton.textContent = 'OC PLANNER';
            openButton.id = OPEN_BUTTON_ID;
            openButton.className = 'torn-btn';
            openButton.addEventListener('click', async () => {
                document.getElementById(OC_PLANNER_PANEL_ID).style.display = 'flex';
                await fetchOCData();
                populateAdminForm();
            });
            targetElement.parentNode.insertBefore(openButton, targetElement.nextSibling);
        }
        addGlobalStyles();
    }
 
    function setupPanelEventListeners() {
        document.getElementById('oc-planner-close-btn').addEventListener('click', () => {
            document.getElementById(OC_PLANNER_PANEL_ID).style.display = 'none';
        });
 
        document.getElementById('oc-admin-save-btn').addEventListener('click', handleSave);
 
        document.getElementById('oc-clear-priority-btn').addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all priority OCs for the faction?")) {
                PRIORITY_OCS = [];
                savePriorityOCs();
            }
        });
 
        const themeToggleBtn = document.getElementById('oc-theme-toggle-btn');
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = GM_getValue('ocPlannerTheme', 'light');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            GM_setValue('ocPlannerTheme', newTheme);
            applySavedTheme();
        });
    }
 
    function applySavedTheme() {
        const theme = GM_getValue('ocPlannerTheme', 'light');
        const panel = document.getElementById(OC_PLANNER_PANEL_ID);
        const toggleBtn = document.getElementById('oc-theme-toggle-btn');
        if (panel) {
            panel.classList.remove('light-theme', 'dark-theme');
            panel.classList.add(`${theme}-theme`);
        }
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
 
    function addGlobalStyles() {
        if (document.getElementById('oc-planner-styles')) return;
 
        GM_addStyle(`
        :root {
            --ocp-light-bg: #f2f2f2; --ocp-light-content-bg: #ffffff; --ocp-light-header-bg: #e1e1e1; --ocp-light-border: #ccc; --ocp-light-text: #333; --ocp-light-text-label: #555; --ocp-light-input-bg: #fff; --ocp-light-input-border: #ccc; --ocp-light-fieldset-bg: #fafafa;
            --ocp-dark-bg: #2d2d2d; --ocp-dark-content-bg: #333333; --ocp-dark-header-bg: #222222; --ocp-dark-border: #555; --ocp-dark-text: #ddd; --ocp-dark-text-label: #bbb; --ocp-dark-input-bg: #444; --ocp-dark-input-border: #666; --ocp-dark-fieldset-bg: #383838;
        }
 
        .${HIGHLIGHT_CLASS},
        .${PRIORITY_HIGHLIGHT_CLASS} {
            border: 3px solid #1E90FF !important; /* A vibrant, accessible blue (Dodger Blue) */
            box-shadow: 0 0 8px #1E90FF !important;
            background-color: rgba(30, 144, 255, 0.1) !important; /* A light tint of the same blue */
        }
 
        .${HIGHLIGHT_CLASS} .contentLayer___IYFdz, .${PRIORITY_HIGHLIGHT_CLASS} .contentLayer___IYFdz { border-radius: inherit; }
        #${OPEN_BUTTON_ID} { margin-left: 15px; vertical-align: middle; position: relative; top: 11px; }
 
        /* --- Panel General Styles --- */
        #${OC_PLANNER_PANEL_ID} { display: none; position: fixed; width: 90%; max-width: 900px; height: 80vh; max-height: 800px; top: 10vh; left: 0; right: 0; margin: auto; z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 8px; overflow: hidden; }
        .light-theme { background: var(--ocp-light-bg); color: var(--ocp-light-text); border: 1px solid var(--ocp-light-border); }
        .dark-theme { background: var(--ocp-dark-bg); color: var(--ocp-dark-text); border: 1px solid var(--ocp-dark-border); }
        #oc-planner-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; font-size: 18px; font-weight: bold; user-select: none; }
        .light-theme #oc-planner-header { background: var(--ocp-light-header-bg); border-bottom: 1px solid var(--ocp-light-border); }
        .dark-theme #oc-planner-header { background: var(--ocp-dark-header-bg); border-bottom: 1px solid var(--ocp-dark-border); }
        #oc-planner-header h2 { margin: 0; font-size: 16px; }
 
        /* --- Panel Header Controls (Close & Theme) --- */
        .oc-planner-header-controls { display: flex; align-items: center; gap: 12px; }
        #oc-planner-close-btn, #oc-theme-toggle-btn { background: transparent; border: none; font-weight: bold; cursor: pointer; opacity: 0.6; transition: all 0.2s; padding: 0; }
        #oc-planner-close-btn { font-size: 24px; line-height: 1; }
        #oc-theme-toggle-btn { font-size: 18px; }
        .light-theme #oc-planner-close-btn, .light-theme #oc-theme-toggle-btn { color: var(--ocp-light-text); }
        .dark-theme #oc-planner-close-btn, .dark-theme #oc-theme-toggle-btn { color: var(--ocp-dark-text); }
        #oc-planner-close-btn:hover, #oc-theme-toggle-btn:hover { opacity: 1; transform: scale(1.1); }
 
 
        /* --- Panel Content Styles --- */
        #oc-planner-content { padding: 20px; flex-grow: 1; overflow-y: auto; }
        .light-theme #oc-planner-content { background: var(--ocp-light-content-bg); }
        .dark-theme #oc-planner-content { background: var(--ocp-dark-content-bg); }
        #oc-planner-content::-webkit-scrollbar { width: 8px; }
        #oc-planner-content::-webkit-scrollbar-track { background: transparent; }
        .light-theme #oc-planner-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        .dark-theme #oc-planner-content::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
 
        .oc-planner-section { margin-bottom: 25px; }
        .oc-planner-section h3 { margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid; font-size: 15px; }
        .light-theme .oc-planner-section h3 { border-color: var(--ocp-light-border); }
        .dark-theme .oc-planner-section h3 { border-color: var(--ocp-dark-border); }
 
        /* --- Form & Input Styles --- */
        #oc-admin-form-container { display: flex; flex-direction: column; gap: 15px; }
        #oc-admin-form-container fieldset { border: 1px solid; padding: 15px; border-radius: 6px; display: flex; flex-direction: column; gap: 10px; }
        .light-theme #oc-admin-form-container fieldset { border-color: var(--ocp-light-border); background: var(--ocp-light-fieldset-bg); }
        .dark-theme #oc-admin-form-container fieldset { border-color: var(--ocp-dark-border); background: var(--ocp-dark-fieldset-bg); }
        #oc-admin-form-container legend { font-weight: bold; padding: 0 8px; }
        #oc-admin-form-container .form-row { display: flex; align-items: center; gap: 10px; }
        #oc-admin-form-container label { width: 150px; font-weight: 500; font-size: 14px; }
        .light-theme #oc-admin-form-container label { color: var(--ocp-light-text-label); }
        .dark-theme #oc-admin-form-container label { color: var(--ocp-dark-text-label); }
        #oc-admin-form-container input { width: 80px; padding: 6px 10px; border-radius: 4px; border: 1px solid; transition: border-color 0.2s, box-shadow 0.2s; }
        .light-theme #oc-admin-form-container input { background: var(--ocp-light-input-bg); border-color: var(--ocp-light-input-border); color: var(--ocp-light-text); }
        .dark-theme #oc-admin-form-container input { background: var(--ocp-dark-input-bg); border-color: var(--ocp-dark-input-border); color: var(--ocp-dark-text); }
        #oc-admin-form-container input:focus { outline: none; border-color: #66afe9; box-shadow: 0 0 5px rgba(102,175,233,.6); }
 
        /* --- Footer and Buttons --- */
        #oc-planner-footer { padding: 12px 20px; display: flex; justify-content: flex-end; }
        .light-theme #oc-planner-footer { background: var(--ocp-light-header-bg); border-top: 1px solid var(--ocp-light-border); }
        .dark-theme #oc-planner-footer { background: var(--ocp-dark-header-bg); border-top: 1px solid var(--ocp-dark-border); }
 
        /* --- Popups (unchanged) --- */
        #${SCROLL_PROMPT_ID}, #${NO_CRIMES_POPUP_ID} { display: flex; flex-direction: column; align-items: center; gap: 10px; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background-color: #fff3cd; color: #664d03; border: 1px solid #ffecb5; padding: 15px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 100001; font-size: 14px; text-align: center; }
        #${SCROLL_PROMPT_ID} .priority-oc-links { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; } #${SCROLL_PROMPT_ID} a { text-decoration: none; }
        .set-priority-btn { margin-left: 10px !important; }
        `);
        document.head.appendChild(document.createElement('style')).id = 'oc-planner-styles';
    }
 
    function showScrollPrompt(unloadedPriorities) { if (document.getElementById(SCROLL_PROMPT_ID)) return; const prompt = document.createElement('div'); prompt.id = SCROLL_PROMPT_ID; const allCards = Array.from(document.querySelectorAll(CRIME_CARD_SELECTOR)); const unloadedLinks = unloadedPriorities.filter(p => !allCards.some(c => c.dataset.ocId == p.id)).map(p => `<a href="https://www.torn.com/factions.php?step=your&type=1#/tab=crimes&crimeId=${p.id}" class="torn-btn">Go to OC #${p.id}</a>`).join(''); if (unloadedLinks) { prompt.innerHTML = `<span>A priority OC is not visible. Click to jump to it:</span><div class="priority-oc-links">${unloadedLinks}</div><button>OK</button>`; prompt.querySelector('button').onclick = () => { prompt.remove(); userDismissedPriorityPrompt = true; }; document.body.appendChild(prompt); } }
    function hideScrollPrompt() { const p = document.getElementById(SCROLL_PROMPT_ID); if (p) p.remove(); userDismissedPriorityPrompt = false; }
    function showNoCrimesPopup() { if (document.getElementById(NO_CRIMES_POPUP_ID)) return; const prompt = document.createElement('div'); prompt.id = NO_CRIMES_POPUP_ID; prompt.innerHTML = `<span>No available crimes right now, do not join a crime, just chill and wait for a crime to be highlighted</span><button class="torn-btn">OK</button>`; prompt.querySelector('button').onclick = () => prompt.remove(); document.body.appendChild(prompt); }
    function addPriorityButton(crimeCard) { if (!isAdmin) return; const ocId = crimeCard.dataset.ocId; let button = crimeCard.querySelector('.set-priority-btn'); if (!button) { button = document.createElement('button'); button.className = 'torn-btn set-priority-btn'; crimeCard.querySelector('.panelBody___lWhwy').appendChild(button); } const isPriority = PRIORITY_OCS.some(p => p.id == ocId); const currentPriority = PRIORITY_OCS.find(p => p.id == ocId); if (currentPriority) { button.textContent = `Prioritized (${currentPriority.target} members)`; button.style.backgroundColor = '#7a0000'; button.onclick = () => { PRIORITY_OCS = PRIORITY_OCS.filter(p => p.id !== ocId); savePriorityOCs(); }; } else { button.textContent = "Prioritize"; button.style.backgroundColor = ''; button.onclick = () => { const currentMembers = crimeCard.querySelectorAll(FILLED_SLOT_SELECTOR).length; const target = prompt(`Prioritize until how many members are in this OC? (Currently ${currentMembers})`, String(currentMembers + 1)); const targetNum = parseInt(target, 10); if (target && !isNaN(targetNum) && targetNum > currentMembers) { PRIORITY_OCS.push({ id: ocId, target: targetNum, admin: currentUserId }); savePriorityOCs(); } else if (target) { alert("Invalid number. Must be greater than current member count."); } }; } }
    function populateAdminForm() { const container = document.getElementById('oc-admin-form-container'); if (!container) return; let formHtml = ''; for (const crimeName in OC_REQUIREMENTS) { formHtml += `<fieldset><legend>${crimeName}</legend>`; for (const roleName in OC_REQUIREMENTS[crimeName]) { const rule = OC_REQUIREMENTS[crimeName][roleName]; formHtml += `<div class="form-row"><label>${roleName.replace(/_/g, ' ')}:</label><input type="text" data-crime="${crimeName}" data-role="${roleName}" data-type="min" placeholder="MIN CPR" value="${rule.min || ''}"><input type="text" data-crime="${crimeName}" data-role="${roleName}" data-type="max" placeholder="MAX CPR" value="${rule.max || ''}"></div>`; } formHtml += `</fieldset>`; } container.innerHTML = formHtml; }
    function handleSave() { const newRules = {}; const inputs = document.querySelectorAll('#oc-admin-form-container input'); inputs.forEach(input => { const { crime, role, type } = input.dataset; if (!newRules[crime]) newRules[crime] = {}; if (!newRules[crime][role]) newRules[crime][role] = {}; const value = input.value.trim(); if (value) newRules[crime][role][type] = parseInt(value, 10); }); if (confirm("Are you sure you want to overwrite the faction-wide OC rules?")) saveOCRequirements(newRules); }
 
    // --- --- --- INITIALIZATION & OBSERVATION LOGIC --- --- ---
    let observer = null;
    let debounceTimer = null;
    async function handleContentChange() { clearTimeout(debounceTimer); debounceTimer = setTimeout(async () => { if (document.querySelector(BUTTON_TARGET_SELECTOR)) { initializeUI(); await processAndHighlightOCs(); } }, 150); }
    function startObserver() { const crimesRootNode = document.getElementById('faction-crimes-root'); if (crimesRootNode) { handleContentChange(); observer = new MutationObserver(handleContentChange); observer.observe(crimesRootNode, { childList: true, subtree: true, attributes: true }); } else { setTimeout(startObserver, 500); } }
 
    startObserver();
 
})();