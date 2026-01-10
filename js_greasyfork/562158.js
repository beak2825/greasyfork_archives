// ==UserScript==
// @name         Torn Attack Helper - Full Screen Button (Log-Driven)
// @namespace    toby.torn.attackhelper
// @version      1.2.1
// @description  Fullscreen attack button. Progresses ONLY when log updates. Supports spam-clicking during lag.
// @author       TobyFlenderson[474025]
// @match        *.torn.com/loader.php?sid=attack&*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562158/Torn%20Attack%20Helper%20-%20Full%20Screen%20Button%20%28Log-Driven%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562158/Torn%20Attack%20Helper%20-%20Full%20Screen%20Button%20%28Log-Driven%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- (Set to true to see console logs) ---
    const DEBUG = true;

    // 0 = no breakout, keep looping as usual
    // 1 = stop after first attack (index 0 below)
    // 2 = stop after second attack (index 1)
    // 3... etc.
    const stopAfterAttack = 2; //

    // 1. --- DEFINE YOUR SEQUENCE HERE ---
    // #weapon_temp #weapon_fists #weapon_boots #weapon_melee #weapon_second #weapon_main
    const weaponSequence = [
        '#weapon_temp',
        '#weapon_melee', // Index 0 (State 1)
        '#weapon_second', // Index 1 (State 2)
        '#weapon_main', // Index 2
        '#weapon_main',
        '#weapon_main',
        '#weapon_main',
        '#weapon_main',
        '#weapon_main',
        '#weapon_main'
    ];
    // 2. --- Define the Full-Screen Style ---
    const fullScreenCSS = `
        #fullscreen-button-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 99999 !important;
            background-color: #000 !important;
            opacity: 0.75 !important;
        }
        #fullscreen-status-text {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: #00ff00;
            font-family: monospace;
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            user-select: none;
            text-shadow: 2px 2px 2px #000;
        }
    `;
    GM_addStyle(fullScreenCSS);

    // --- STATE DEFINITIONS ---
    // -2 = Stopped (After stopAfterAttack reached)
    // -1 = Paused (Post-fight / Continue dialog)
    //  0 = Pre-Fight (Waiting to click Start)
    //  1 = First Attack (Waiting for 1st log entry)
    //  2 = Second Attack (Waiting for 2nd log entry)
    let currentState = 0;
    let activeTargetElement = null;

    // --- NEW: Log-aware variables ---
    let USERNAME = '';

    // 3. --- Create the Click Overlay ---
    const overlay = document.createElement('div');
    overlay.id = 'fullscreen-button-overlay';
    overlay.style.display = 'none'; // Start hidden

    // Status Text Element
    const statusText = document.createElement('div');
    statusText.id = 'fullscreen-status-text';
    statusText.textContent = 'Initializing...';
    overlay.appendChild(statusText);

    document.body.appendChild(overlay);


    // 4. --- Helper Functions ---

    function setStatus(text) {
        if (statusText.textContent !== text) {
            statusText.textContent = text;
        }
    }

    function isElementTrulyVisible(element) {
        if (!element) return false;

        // Check if the element is disabled
        if (element.disabled) {
            return false;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        return true;
    }

    function initUsername() {
        if (USERNAME) return true; // Already initialized
        try {
            // Try Selector 1 (Main UI top bar)
            let nameEl = document.querySelector('.user-name-wrap .name');

            // If Selector 1 fails, try Selector 2 (Attack Screen header)
            if (!nameEl) {
                nameEl = document.querySelector('.userName___loAWK.user-name.left');
            }

            if (nameEl && nameEl.textContent) {
                USERNAME = nameEl.textContent.trim();
                if (DEBUG) console.log(`[DEBUG] Username initialized: ${USERNAME}`);
                return true;
            }
        } catch (e) {
            if (DEBUG) console.error('[DEBUG] Error initializing username:', e);
        }
        return false;
    }

    /**
     * Counts the number of *your* attacks in the log.
     * Ignores "initiated" and "joined" messages.
     */
    function getLogAttackCount() {
        if (!USERNAME) return 0; // Can't count without a username

        const logList = document.querySelector('.logWrap___Sspzk .list___UZYhA');
        if (!logList) return 0;

        const messages = logList.querySelectorAll('.message___Z4JCk');
        let count = 0;
        for (const msgEl of messages) {
            const msg = msgEl.textContent.trim();

            // Check based on log color (Player actions are color-1)
            const logEntryWrapper = msgEl.parentElement;

            if (logEntryWrapper && logEntryWrapper.classList.contains('color-1___Kk1zS')) {
                // This is a player action.
                // Ignore "initiated" and "joined"
                if (!msg.includes('initiated an attack') && !msg.includes('joined the attack')) {
                    count++;
                }
            }
        }
        return count;
    }


    function setTarget(targetElement, isStartButton = false, selector = null) {
        if (DEBUG) console.log(`[DEBUG] setTarget: Targeting "${targetElement.textContent || targetElement.id}" for state ${currentState}.`);

        const clickHandler = () => {
            // Clear active target so loop re-evaluates next cycle
            activeTargetElement = null;

            // --- Stale Element Check ---
            let finalElement = targetElement;

            if (!document.body.contains(finalElement)) {
                if (DEBUG) console.log('[DEBUG] Element is stale. Attempting recovery...');
                let recovered = false;
                if (selector) {
                    const fresh = document.querySelector(selector);
                    if (fresh && isElementTrulyVisible(fresh)) {
                        finalElement = fresh;
                        recovered = true;
                    }
                }
                if (!recovered) {
                    if (DEBUG) console.log('[DEBUG] Recovery failed. Aborting click.');
                    overlay.style.display = 'none';
                    return;
                }
            }

            if (!isElementTrulyVisible(finalElement)) {
                 if (DEBUG) console.log('[DEBUG] Element not visible. Aborting.');
                 overlay.style.display = 'none';
                 return;
            }
            // -------------------------------

            // EXECUTE CLICK
            finalElement.click();

            // LOGIC CHANGE:
            // If this is the START button, we must force State 1 immediately.
            // If this is a WEAPON button, we do NOT change state. We wait for the log to update in the main loop.
            if (isStartButton) {
                if (DEBUG) console.log(`[DEBUG] Start/Join Clicked. Forcing State 1.`);
                currentState = 1;
            } else {
                if (DEBUG) console.log(`[DEBUG] Weapon Clicked. Staying in State ${currentState} until log confirms.`);
                // We leave currentState alone.
                // If the click worked, the log will update, and updateTarget will advance state.
                // If the click failed (lag), the log won't update, state stays same, you click again.
            }
        };

        overlay.addEventListener('mousedown', clickHandler, { once: true });
        overlay.style.display = 'block';
        activeTargetElement = targetElement;
    }

    function clearTarget() {
        if (activeTargetElement) {
             if (DEBUG) console.log(`[DEBUG] clearTarget: Hiding overlay.`);
            activeTargetElement = null;
        }
        overlay.style.display = 'none';
    }


    // 5. --- Main ---

    function getPausedDialogButton() {
        const dialogBox = document.querySelector('div[class*="dialogButtons"]');
        if (!isElementTrulyVisible(dialogBox)) return null;

        const buttons = dialogBox.querySelectorAll('button');
        for (const btn of buttons) {
            const btnText = btn.textContent.toLowerCase();
            if (btnText === 'leave' || btnText === 'mug' || btnText === 'hospitalize' || btnText === 'continue') {
                return btn;
            }
        }
        return null;
    }

    function getStartButton() {
        const dialogBox = document.querySelector('div[class*="dialogButtons"]');
        if (!isElementTrulyVisible(dialogBox)) return null;

        const buttons = dialogBox.querySelectorAll('button');
        // Support Start OR Join
        for (const btn of buttons) {
            const txt = btn.textContent.toLowerCase();
            if (txt === 'start fight' || txt === 'join fight') {
                return btn;
            }
        }
        return null;
    }

    function updateTarget() {

        // Priority 0: Get Username
        if (!initUsername()) {
            setStatus("Initializing Username...");
            return;
        }

        // Priority 1: Check for "paused" state (End of fight)
        const pausedButton = getPausedDialogButton();
        if (pausedButton) {
            if (currentState !== -1) {
                if (DEBUG) console.log(`[DEBUG] Paused dialog detected. Pausing script.`);
                clearTarget();
                currentState = -1;
            }
            setStatus(`Paused: Found ${pausedButton.textContent}`);
            return;
        }

        // Priority 2: Check for "Start" Button
        // Only if we are in Pre-Fight (0) or Paused (-1) state
        if (currentState === 0 || currentState === -1) {
            const startButton = getStartButton();
            if (startButton) {
                if (startButton !== activeTargetElement) {
                    setTarget(startButton, true); // true = isStartButton
                }
                setStatus("Ready: Click to Start Fight");
                return;
            }
        }

        // Priority 3: STOPPED State
        if (currentState === -2) {
            if (DEBUG) console.log('[DEBUG] Script is in STOPPED state.');
            clearTarget();
            // Even if overlay is hidden by clearTarget, we update text in case it shows
            setStatus("Stopped: Attack Limit Reached");
            return;
        }

        // Priority 4: IN FIGHT - Log-Driven Progression
        // If we are in state 1+ (Fighting), check logs to see if we should advance.

        if (currentState > 0) {
            const currentLogCount = getLogAttackCount();

            // Logic: State 1 means we are trying to do Attack #1.
            // If Log Count is 1, it means Attack #1 is done! We should be in State 2.
            // If Log Count is >= CurrentState, we advance.

            if (currentLogCount >= currentState) {
                if (DEBUG) console.log(`[DEBUG] Log Count (${currentLogCount}) >= State (${currentState}). Advancing State.`);
                currentState++;
                // Active target must be cleared so we select the new weapon immediately
                activeTargetElement = null;
            }
        }

        // Priority 5: Stop Condition Check
        // If we just advanced state, check if we hit the limit.
        // State 3 means we are LOOKING for attack 3.
        // If stopAfterAttack is 2, and State is 3, we stop.
        if (currentState > 0 && stopAfterAttack > 0) {
            // "State 1" targets "Index 0".
            // If stopAfterAttack is 2. We want to do Index 0 and Index 1.
            // We stop when we are about to target Index 2 (State 3).
            if ((currentState - 1) >= stopAfterAttack) {
                 if (DEBUG) console.log(`[DEBUG] Limit reached (State ${currentState}). Stopping.`);
                 currentState = -2;
                 clearTarget();
                 setStatus("Stopped: Attack Limit Reached");
                 return;
            }
        }

        // Priority 6: Weapon Targeting
        // We only get here if we are in State 1+ and haven't stopped.
        if (currentState > 0) {
            let weaponIndex = currentState - 1;

            // Loop back logic
            if (weaponIndex >= weaponSequence.length) {
                // If sequence is 2 items (0, 1). Length 2.
                // If State is 3 -> Index 2. Loop back to 0.
                // BUT, to keep math simple with logs, we effectively just map the index.
                // We don't reset currentState to 1, because then the log logic would break (1 < 10 logs).
                // Instead, we just modulo the index.
                weaponIndex = weaponIndex % weaponSequence.length;
            }

            const weaponSelector = weaponSequence[weaponIndex];
            const weaponElement = document.querySelector(weaponSelector);

            if (isElementTrulyVisible(weaponElement)) {
                if (weaponElement !== activeTargetElement) {
                    // Pass selector for stale recovery
                    setTarget(weaponElement, false, weaponSelector);
                }
                setStatus(`Attack ${currentState}: Ready to click ${weaponSelector}`);
            } else {
                // Shield Logic: Weapon not visible (opponent turn/loading).
                // Keep overlay up, but clear target so we can't click.
                if (activeTargetElement) {
                    activeTargetElement = null;
                }
                overlay.style.display = 'block';
                setStatus(`Attack ${currentState}: Waiting for ${weaponSelector}...`);
            }
            return;
        }

        // If nothing matched (e.g. State 0 but no start button), hide overlay.
        clearTarget();
        setStatus("Waiting for Start Button...");
    }

    // 6. --- Main Loop ---
    if (DEBUG) console.log('[DEBUG] Script init. Starting update loop.');
    setInterval(updateTarget, 100);

})();