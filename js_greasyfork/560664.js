// ==UserScript==
// @name         🔥 Compass Pathfinder
// @namespace    http://tampermundo.net/
// @version      5.6
// @description  Auto-detects floors, waits for Normal state, runs routes. Mandatory Oxygen before Roof.
// @match        *://*.popmundo.com/*Compass*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560664/%F0%9F%94%A5%20Compass%20Pathfinder.user.js
// @updateURL https://update.greasyfork.org/scripts/560664/%F0%9F%94%A5%20Compass%20Pathfinder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BASE_DELAY = 1500;
  const RANDOM_JITTER = 400;
  const COOLDOWN_MS = 120000;
  const STATE_CHECK_INTERVAL = 5000;
  const ELEVATOR_COOLDOWN_MS = 60000;

  const TARGET_ITEMS = ['Desk', 'Washing Machine', 'Bed', 'Shackles', 'Pranga', 'Couch', 'Helicopter'];

  const STORAGE_KEY = 'compass_multiplace_state_v3';
  const save = s => GM_setValue(STORAGE_KEY, JSON.stringify(s));
  const load = () => {
    const d = GM_getValue(STORAGE_KEY);
    try { return d ? JSON.parse(d) : null; } catch (e) { return null; }
  };
  const clear = () => GM_deleteValue(STORAGE_KEY);

  const OPPOSITES = {
    'K': 'G', 'G': 'K', 'D': 'B', 'B': 'D',
    'KD': 'GB', 'GB': 'KD', 'KB': 'GD', 'GD': 'KB',
    'YUKARI': 'AŞAĞI', 'AŞAĞI': 'YUKARI'
  };

  const DIR_MAP = {
    K: 'North', G: 'South', D: 'East', B: 'West',
    KD: 'NorthEast', KB: 'NorthWest', GD: 'SouthEast', GB: 'SouthWest',
    YUKARI: 'Up', 'AŞAĞI': 'Down'
  };

  function expandPath(pathArray) {
    let expanded = [];
    pathArray.forEach(step => {
      const match = step.match(/^([A-ZŞÜİĞÖ]+)x(\d+)$/i);
      if (match) {
        const dir = match[1];
        const count = parseInt(match[2], 10);
        for (let i = 0; i < count; i++) expanded.push(dir);
      } else {
        expanded.push(step);
      }
    });
    return expanded;
  }

  function getCurrentState() {
    const stateRow = [...document.querySelectorAll('.box table tr')]
      .find(tr => {
        const label = tr.querySelector('td:first-child')?.textContent.trim();
        return label === "State" || label === "Durum" || label === "Estado";
      });
    return stateRow?.querySelector('td:last-child')?.textContent.trim() || null;
  }

  function detectCurrentFloor() {
    const h1 = document.querySelector('h1');
    if (!h1) return null;

    const text = h1.childNodes[0]?.textContent?.trim() || h1.textContent.trim();
    console.log('Detected Title Text:', text);

    // FIRST check if it's an elevator access page (at a floor)
    if (/Elevator Access/i.test(text)) {
        console.log('Detected as elevator access point');
        return 'elevator_access';
    }

    // THEN check if it's the main elevator lobby
    if (/Elevator/i.test(text) && !/Access/i.test(text)) {
        console.log('Detected as main elevator lobby');
        return 'main_elevator_lobby';
    }

    // Check for Floor 1 or Floor 2 specifically
    if (/Floor\s+1/i.test(text)) return 'floor_1';
    if (/Floor\s+2/i.test(text)) return 'floor_2';

    // Then check for other floor names
    const floorMatch = text.match(/Floor\s+(\d+)/i);
    if (floorMatch && parseInt(floorMatch[1]) > 2) return `floor_${floorMatch[1]}`;

    if (/Roof/i.test(text)) return 'roof';

    // Check for specific floor areas
    if (/Collapsed Office Floor/i.test(text)) return 'floor_5';
    if (/Collapsed Floor/i.test(text)) return 'floor_4';
    if (/Collapsed Office/i.test(text)) return 'floor_3';
    if (/Skyscraper Gym/i.test(text)) return 'floor_7';
    if (/Skyscraper Library/i.test(text)) return 'floor_6';
    if (/Wanda's? Massage/i.test(text)) return 'floor_8';
    if (/Burning Office/i.test(text)) return 'floor_9';

    return null;
  }

  const FLOOR_MAP = {
    floor_1: 'floor',
    floor_2: 'floor',
    floor_3: 'collapsed_office',
    floor_4: 'collapsed_floor',
    floor_5: 'collapsed_office_floor',
    floor_6: 'skyscraper_library',
    floor_7: 'skyscraper_gym',
    floor_8: 'wanda_massage',
    floor_9: 'burning_office',
    roof: 'skyscraper_roof',
    elevator_access: 'current_floor_elevator',
    main_elevator_lobby: 'main_elevator_lobby'
  };

  const PLACES = {
    floor: {
      name: '🛏️ Floor',
      floor: 'Floor 1-2',
      maps: [
        { id: 1, path: expandPath(['Dx3', 'Gx3']) },
        { id: 2, path: expandPath(['Dx3', 'Gx2', 'B', 'K']) }
      ]
    },
    current_floor_elevator: {
      name: '🛗 Floor Elevator Access',
      floor: 'Current Floor',
      maps: [] // No exploration paths here, just a transition point
    },
    main_elevator_lobby: {
      name: '🏢 Main Elevator Lobby',
      floor: 'Lobby',
      maps: [] // No exploration paths here
    },
    collapsed_office: {
      name: '🏢 Collapsed Office',
      floor: 'Floor 3',
      maps: [
        { id: 1, path: expandPath(['D', 'K', 'YUKARI', 'D', 'AŞAĞI', 'D', 'G', 'G', 'D', 'YUKARI', 'K', 'B']) },
        { id: 2, path: expandPath(['Dx3', 'G', 'G', 'AŞAĞI', 'K', 'B', 'G', 'B', 'K']) },
        { id: 3, path: expandPath(['Dx4', 'AŞAĞI', 'Gx2']) },
        { id: 4, path: expandPath(['Dx3', 'G', 'B', 'AŞAĞI']) },
        { id: 5, path: expandPath(['Dx3', 'G', 'B', 'AŞAĞI', 'D', 'G', 'Bx3', 'G']) },
        { id: 6, path: expandPath(['Dx3', 'G', 'B', 'AŞAĞI']) }
      ]
    },
    collapsed_floor: {
      name: '🏢 Collapsed Floor',
      floor: 'Floor 4',
      maps: [
        { id: 1, path: expandPath(['D','G','G','D','YUKARI','D','K','K','D','YUKARI','B','B','B','G','G','B','AŞAĞI']) },
        { id: 2, path: expandPath(['D','GD','K','YUKARI','B']) },
        { id: 3, path: expandPath(['D','G','B','AŞAĞI','D','G','D','K','AŞAĞI','K','D','D','G','YUKARI']) },
        { id: 4, path: expandPath(['D','G','G','B','G','AŞAĞI','K','D','K','K','D','G']) },
        { id: 5, path: expandPath(['D','K','D','YUKARI','G','D','G','G','G']) }
      ]
    },
    collapsed_office_floor: {
      name: '🧺 Collapsed Office Floor',
      floor: 'Floor 5',
      maps: [
        { id: 1, path: expandPath(['D','G','D','G','AŞAĞI','D','K','K','D','K','AŞAĞI','B','G','B']) },
        { id: 2, path: expandPath(['D','G','G','D','D','AŞAĞI','K','D','AŞAĞI','B','G','B','B','K','B','YUKARI','D','G','D','AŞAĞI']) }
      ]
    },
    skyscraper_library: {
      name: '📚 Skyscraper Library',
      floor: 'Floor 6',
      maps: [
        { id: 1, path: expandPath(['D','K','Dx3']) },
        { id: 2, path: expandPath(['D','Gx2','Dx3']) }
      ]
    },
    skyscraper_gym: {
      name: '🏋️ Skyscraper GYM',
      floor: 'Floor 7',
      maps: [
        { id: 1, path: expandPath(['D','K','Dx3']) },
        { id: 2, path: expandPath(['D','G','B','G']) },
        { id: 3, path: expandPath(['D','G','B','G','Dx3']) }
      ]
    },
    wanda_massage: {
      name: '💆 Wanda\'s Massage Parlor',
      floor: 'Floor 8',
      maps: [
        { id: 1, path: expandPath(['Dx4','K','YUKARI','G','Bx3','K','B']) }
      ]
    },
    burning_office: {
      name: '🔥 Burning Office',
      floor: 'Floor 9',
      maps: [
        { id: 1, path: expandPath(['D','G','D','G','G','D','D','K']) },
        { id: 3, path: expandPath(['D','D','GD','G','D','AŞAĞI','B','K']) },
        { id: 4, path: expandPath(['D','D','D','K']) },
        { id: 5, path: expandPath(['D','D','D','G','B']) },
        { id: 6, path: expandPath(['Dx3','Gx3','D']) },
        { id: 7, path: expandPath(['Dx3','K']) },
        { id: 8, path: expandPath(['Dx4','K']) },
        { id: 9, path: expandPath(['D','Gx3','B']) }
      ]
    },
    skyscraper_roof: {
      name: '🚁 Skyscraper Roof',
      floor: 'Roof',
      maps: [
        { id: 1, path: expandPath(['D', 'G', 'D']) }
      ]
    }
  };

  function move(d) {
    if (!d) return false;
    const nd = DIR_MAP[d.toUpperCase()] || d;
    const el = document.querySelector(`g[data-dir="${nd}"], a[title*="${nd}"]`);
    if (!el) return false;
    const href = el.getAttribute('href');
    if (href) { window.location.href = href; }
    else { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    return true;
  }

  function checkItemExists(itemName) {
    const normalizedTarget = itemName.trim().toLowerCase();
    const rows = document.querySelectorAll("#items-equipment tr.hoverable");
    for (const row of rows) {
      const link = row.querySelector("a[href*='ItemDetails']");
      if (link) {
        const itemText = link.textContent.trim().toLowerCase();
        if (itemText === normalizedTarget) return row;
      }
    }
    return null;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const waitForElement = async (finderFn, timeoutMs = 1000) => {
    const start = Date.now();
    let el = finderFn();
    if (el) return el;
    while (Date.now() - start < timeoutMs) {
      await sleep(50);
      el = finderFn();
      if (el) return el;
    }
    return null;
  };

  function getAnyPresentItem() {
    for (const item of TARGET_ITEMS) {
      const itemRow = checkItemExists(item);
      if (itemRow) return { name: item, row: itemRow };
    }
    return null;
  }

  function checkElevatorError() {
    const errorDiv = document.querySelector('.notification-real.notification-error');
    return errorDiv && errorDiv.textContent.includes('You press the button and nothing happens');
  }

  function findItemAndButton(itemNamePart, buttonTitlePart) {
    // Normalize item name part by trimming and replacing all whitespace with single spaces
    const itemNameToMatch = itemNamePart.trim().replace(/\s+/g, ' ');
    const normalizedButtonTitlePart = buttonTitlePart.trim().toLowerCase();

    const rows = document.querySelectorAll("tr.hoverable");
    for (const row of rows) {
      let foundItemText = false;

      // Check if item name is in an <em> tag (common for elevator destinations like "Floor 2-100", "Roof")
      const em = row.querySelector("em");
      if (em) {
        // Normalize em text similarly
        const emText = em.textContent.trim().replace(/\s+/g, ' ');
        if (emText === itemNameToMatch) { // Case-sensitive exact match
          foundItemText = true;
        }
      }

      // If not found in <em>, check if item name is in the link text.
      if (!foundItemText) {
        const link = row.querySelector("a[href*='ItemDetails']");
        if (link) {
          const linkText = link.textContent.trim().replace(/\s+/g, ' ');
          if (linkText === itemNameToMatch) { // Case-sensitive exact match
            foundItemText = true;
          }
        }
      }

      // Also check for "Elevator Call Button" as an alternative (for returning from floor)
      if (!foundItemText) {
        const link = row.querySelector("a[href*='ItemDetails']");
        if (link && link.textContent.trim() === "Elevator Call Button") {
          foundItemText = true;
        }
      }

      // If item name was found in either <em> or <a>, then look for the button
      if (foundItemText) {
        const btn = row.querySelector(`input[title*='${normalizedButtonTitlePart}']`);
        if (btn) return { row, btn };
      }
    }
    return null;
  }

  function findElevatorCallButton() {
    const rows = document.querySelectorAll("tr.hoverable");
    for (const row of rows) {
      const link = row.querySelector("a[href*='ItemDetails']");
      if (link && link.textContent.trim().includes("Elevator Call Button")) {
        const btn = row.querySelector("input[title*='Press Elevator Call Button']");
        if (btn) return { row, btn };
      }
    }
    return null;
  }

  function findOxygenSupply() {
    const rows = document.querySelectorAll("tr.hoverable");
    for (const row of rows) {
      const link = row.querySelector("a[href*='ItemDetails']");
      if (link && link.textContent.trim() === "Oxygen Supply") {
        const btn = row.querySelector("input[title*='Use Oxygen Supply']");
        if (btn) return { row, btn };
      }
    }
    return null;
  }

  function navigateToExploreArea() {
    const exploreLink = document.querySelector('li a[href*="/World/Popmundo.aspx/Locale/Compass"]');
    if (exploreLink) {
      exploreLink.click();
      return true;
    }
    return false;
  }

  async function autoCycleEngine() {
    const state = load();
    if (!state?.autoCycleActive) return;

    // --- NEW: Verify page context for elevator actions ---
    if (state.needsElevatorUse || state.waitingForNormal) {
        const currentDetectedFloor = detectCurrentFloor();
        const currentPlaceKey = currentDetectedFloor ? FLOOR_MAP[currentDetectedFloor] : null;

        const isElevatorPage = currentPlaceKey === 'current_floor_elevator' ||
                               currentPlaceKey === 'main_elevator_lobby';

        const isCompassPage = window.location.href.includes('/Locale/Compass');

        if (!isElevatorPage && !isCompassPage) {
            state.log.push(`⚠️ Unexpected page for elevator action. Navigating to Explore Area.`);
            save(state);
            updateUI();
            setTimeout(() => {
                // Construct the base URL and append /World/Popmundo.aspx/Locale/Compass
                const baseUrl = window.location.href.split('/World/Popmundo.aspx')[0];
                window.location.href = baseUrl + '/World/Popmundo.aspx/Locale/Compass';
            }, 1000);
            return;
        }
    }
    // --- END NEW CHECK ---

    const isExploreAreaPage = window.location.href.includes('/Locale/Compass');

    // Check for elevator error first - THIS MUST STOP ALL OTHER ACTIONS
    if (checkElevatorError()) {
        // Only set cooldown if not already set
        if (!state.elevatorCooldownUntil) {
            state.log.push(`🛗 Elevator error: "nothing happens". Waiting 1 minute to retry...`);
            state.elevatorCooldownUntil = Date.now() + ELEVATOR_COOLDOWN_MS;

            // Save which action we were trying to do
            if (!state.pendingElevatorAction) {
                // Figure out what we were trying to do based on state
                if (state.needsElevatorUse) {
                    state.pendingElevatorAction = state.nextDestination; // 'floor' or 'roof'
                } else if (state.isLeavingFloor) {
                    state.pendingElevatorAction = 'return_to_lobby';
                }
            }

            save(state);
            updateUI();
        }

        // Check if cooldown is still active
        if (Date.now() < state.elevatorCooldownUntil) {
            const remaining = Math.ceil((state.elevatorCooldownUntil - Date.now()) / 1000);

            // Update the last log entry if it's a countdown
            if (state.log.length > 0 && state.log[state.log.length - 1]?.startsWith('⏳')) {
                state.log.pop();
            }

            const timeText = `⏳ Elevator retry in ${Math.floor(remaining / 60)}m ${Math.floor(remaining % 60)}s...`;
            state.log.push(timeText);
            save(state);
            updateUI();

            // Continue countdown - RETURN IMMEDIATELY
            setTimeout(autoCycleEngine, 1000);
            return;
        } else {
            // Cooldown complete - RETRY THE PENDING ACTION
            state.elevatorCooldownUntil = null;
            state.log.push(`🔄 Retrying elevator action...`);

            // Restore the state that was interrupted
            if (state.pendingElevatorAction) {
                if (state.pendingElevatorAction === 'floor' || state.pendingElevatorAction === 'roof') {
                    state.needsElevatorUse = true;
                    state.nextDestination = state.pendingElevatorAction;
                    state.waitingForNormal = false;
                } else if (state.pendingElevatorAction === 'return_to_lobby') {
                    state.isLeavingFloor = true;
                    state.waitingForNormal = true;
                }
                state.pendingElevatorAction = null; // Clear after restoring
            }

            save(state);
            updateUI();

            // RELOAD THE PAGE TO RETRY FROM CURRENT POSITION
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return;
        }
    }

    // Clear any pending action if no error
    if (state.pendingElevatorAction) {
        state.pendingElevatorAction = null;
    }

    // If we just clicked elevator and reloaded, we need to wait for normal state
    if (state.elevatorClicked) {
        state.elevatorClicked = false;
        state.waitingForNormal = true;
        state.stateCheckReloaded = false;
        state.log.push(`🔄 Waiting for elevator arrival...`);
        save(state);
        updateUI();

        setTimeout(() => {
          if (!navigateToExploreArea()) {
            window.location.href = window.location.href;
          }
        }, 1000);
        return;
    }

    // Check current location
    const detectedFloor = detectCurrentFloor();
    const placeKey = FLOOR_MAP[detectedFloor];

    // CHECK FOR OXYGEN SUPPLY BEFORE ROOF - WHEN AT LOBBY
    if (placeKey === 'main_elevator_lobby' && state.needsElevatorUse && state.nextDestination === 'roof' && !state.oxygenUsed) {
        const oxygenSupply = findOxygenSupply();
        if (oxygenSupply && oxygenSupply.btn) {
            state.log.push(`💨 Using Oxygen Supply before Roof...`);
            state.oxygenUsed = true;
            save(state);
            updateUI();
            oxygenSupply.btn.click();
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            return;
        } else if (!oxygenSupply) {
            state.log.push(`⚠️ Oxygen Supply not found! Can't go to Roof without oxygen.`);
            state.autoCycleActive = false;
            save(state);
            updateUI();
            return;
        }
    }

    // SPECIAL HANDLING FOR ROOF ARRIVAL - When we arrive at roof, start roof exploration
    if (detectedFloor === 'roof') {
        const currentState = getCurrentState();

        // RESET isLeavingFloor IMMEDIATELY when we detect we're at roof
        // This prevents the "unexpected leave" error
        state.isLeavingFloor = false;

        // Check if we're in a "waiting" state (meaning we just called elevator to leave)
        if (state.waitingForNormal) {
            // We're at Roof with waitingForNormal true - this means we just arrived
            if (currentState === 'Normal') {
                state.log.push(`🏙️ Arrived at Roof via elevator. Starting roof exploration...`);
                state.waitingForNormal = false;
                state.stateCheckReloaded = false;
                state.active = true;
                state.autoCycleActive = true;
                state.place = 'skyscraper_roof';
                state.depth = 0;
                state.history = [];
                state.isBacktracking = false;
                state.isReturning = false;
                state.failedIds = [];
                state.backtrackToDepth = 0;
                state.cooldownUntil = null;
                state.elevatorClicked = false;
                state.isLeavingFloor = false; // Already set, but keeping for clarity
                state.candidates = JSON.parse(JSON.stringify(PLACES['skyscraper_roof'].maps));

                // After roof exploration, we should return to lobby
                state.nextDestination = 'floor';

                save(state);
                updateUI();

                // Small delay then start exploration
                setTimeout(stepEngine, 2000);
                return;
            }

            // If we're at Roof with Exploring state, we might have just clicked the elevator call button
            // Wait for Normal state to start exploration
            if (currentState === 'Exploring') {
                state.log.push(`⏳ At Roof, waiting for elevator to finish...`);
                // Don't set waitingForNormal here - it's already true
                state.stateCheckReloaded = false;
                save(state);
                updateUI();

                // Check again in 30 seconds
                setTimeout(() => {
                    const cur = load();
                    if (cur?.autoCycleActive) {
                        cur.stateCheckReloaded = false;
                        save(cur);
                        setTimeout(() => {
                            if (!navigateToExploreArea()) {
                                window.location.href = window.location.href;
                            }
                        }, 1000);
                    }
                }, 30000);
                return;
            }
        }

        // Default: start exploration anyway if we're at roof with Normal state
        if (currentState === 'Normal') {
            state.log.push(`🏙️ At Roof with Normal state. Starting roof exploration...`);
            state.waitingForNormal = false;
            state.stateCheckReloaded = false;
            state.active = true;
            state.autoCycleActive = true;
            state.place = 'skyscraper_roof';
            state.depth = 0;
            state.history = [];
            state.isBacktracking = false;
            state.isReturning = false;
            state.failedIds = [];
            state.backtrackToDepth = 0;
            state.cooldownUntil = null;
            state.elevatorClicked = false;
            state.isLeavingFloor = false;
            state.candidates = JSON.parse(JSON.stringify(PLACES['skyscraper_roof'].maps));

            // After roof exploration, return to lobby
            state.nextDestination = 'floor';

            save(state);
            updateUI();
            setTimeout(stepEngine, 2000);
            return;
        }

        // If we're at roof but state isn't Normal yet, wait
        state.log.push(`⏳ At Roof (State: ${currentState}). Waiting for Normal state...`);
        state.waitingForNormal = true;
        state.stateCheckReloaded = false;
        save(state);
        updateUI();

        // Check again in 10 seconds
        setTimeout(() => {
            const cur = load();
            if (cur?.autoCycleActive) {
                cur.stateCheckReloaded = false;
                save(cur);
                setTimeout(() => {
                    if (!navigateToExploreArea()) {
                        window.location.href = window.location.href;
                    }
                }, 1000);
            }
        }, 10000);
        return;
    }

    if (state.needsElevatorUse && !state.waitingForNormal) {
        let elevatorDestinationFound = null;

        // Check if we're at main elevator lobby
        if (placeKey !== 'main_elevator_lobby') {
            state.log.push(`⚠️ Not at main elevator lobby. Current: ${detectedFloor}`);
            state.autoCycleActive = false;
            save(state);
            updateUI();
            return;
        }

        if (state.nextDestination === 'floor') {
            // Looking for "Floor 2-100" option
            state.log.push(`🛗 Looking for Floor 2-100 destination...`);
            elevatorDestinationFound = await waitForElement(() =>
                findItemAndButton("Floor 2-100", "Press Elevator Button")
            , 2000);

            // Fallback to old method if not found
            if (!elevatorDestinationFound) {
                state.log.push(`🔄 Trying alternative search for Floor 2-100...`);
                elevatorDestinationFound = await waitForElement(() => {
                    const rows = document.querySelectorAll("tr.hoverable");
                    for (const row of rows) {
                        const em = row.querySelector("em");
                        if (em && em.textContent.trim() === "Floor 2-100") {
                            const btn = row.querySelector("input[title*='Press Elevator Button']");
                            if (btn) return { row, btn };
                        }
                    }
                    return null;
                }, 2000);
            }
            state.oxygenUsed = false; // Reset oxygen flag when going to floor (not roof)
        } else if (state.nextDestination === 'roof') {
            // Looking for "Roof" option
            state.log.push(`🛗 Looking for Roof destination...`);
            elevatorDestinationFound = await waitForElement(() =>
                findItemAndButton("Roof", "Press Elevator Button")
            , 2000);

            // Fallback to old method if not found
            if (!elevatorDestinationFound) {
                state.log.push(`🔄 Trying alternative search for Roof...`);
                elevatorDestinationFound = await waitForElement(() => {
                    const rows = document.querySelectorAll("tr.hoverable");
                    for (const row of rows) {
                        const em = row.querySelector("em");
                        if (em && em.textContent.trim() === "Roof") {
                            const btn = row.querySelector("input[title*='Press Elevator Button']");
                            if (btn) return { row, btn };
                        }
                    }
                    return null;
                }, 2000);
            }
        }

        if (elevatorDestinationFound && elevatorDestinationFound.btn) {
            state.log.push(`✅ Using ${state.nextDestination.toUpperCase()} destination...`);
            state.needsElevatorUse = false;
            state.waitingForNormal = true;
            state.stateCheckReloaded = false;
            state.elevatorClicked = true;
            save(state);
            updateUI();
            elevatorDestinationFound.btn.click();
            setTimeout(() => {
              if (!navigateToExploreArea()) {
                window.location.href = window.location.href;
              }
            }, 1500);
            return;
        }

        state.log.push(`❌ ${state.nextDestination.toUpperCase()} destination not found`);
        state.autoCycleActive = false;
        save(state);
        updateUI();
        return;
    }

    if (state.waitingForNormal) {
        if (!state.stateCheckReloaded && !isExploreAreaPage) {
            state.stateCheckReloaded = true;
            state.log.push(`🔄 Navigating to Explore Area...`);
            save(state);
            updateUI();
            setTimeout(() => {
              if (!navigateToExploreArea()) {
                window.location.href = window.location.href;
              }
            }, 1000);
            return;
        }

        const currentState = getCurrentState();
        const h1Text = document.querySelector('h1')?.childNodes[0]?.textContent?.trim() ||
                       document.querySelector('h1')?.textContent?.trim();

        console.log('Current H1 Text:', h1Text);
        console.log('Current State:', currentState);

        const isMainElevatorLobby = h1Text?.toLowerCase().includes('elevator') &&
                                   !h1Text?.toLowerCase().includes('access') &&
                                   currentState === 'Normal';

        if (isMainElevatorLobby) {
            state.log.push(`✅ Back at Main Elevator Lobby with Normal state`);
            state.waitingForNormal = false;
            state.stateCheckReloaded = false;
            state.needsElevatorUse = true;
            // Reset oxygen flag when arriving at lobby (only for floor trips, not roof trips)
            if (state.nextDestination === 'floor') {
                state.oxygenUsed = false;
            }
            if (state.singleElevatorTrip) {
                state.autoCycleActive = false;
                state.singleElevatorTrip = false;
                state.log.push(`▶️ Single elevator trip complete.`);
            }
            save(state);
            updateUI();
            setTimeout(autoCycleEngine, 1000);
            return;
        }

        const stillOnElevator = h1Text?.toLowerCase().includes('elevator') &&
                               !h1Text?.toLowerCase().includes('access');

        if (stillOnElevator && currentState !== 'Normal') {
            if (state.log.length > 0 && state.log[state.log.length - 1].includes('⏳')) {
                state.log.pop();
            }
            const WAIT_MS = 60000;
            state.log.push(`⏳ Still on Elevator (State: ${currentState}). Checking in 1 min...`);
            save(state);
            updateUI();
            let timeLeft = WAIT_MS / 1000;
            const timer = setInterval(() => {
                const cur = load();
                if (!cur || !cur.autoCycleActive) { clearInterval(timer); return; }
                timeLeft--;
                const timeText = `⏳ ${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s until arrival...`;
                if (cur.log[cur.log.length - 1]?.startsWith('⏳')) {
                    cur.log[cur.log.length - 1] = timeText;
                    save(cur);
                    updateLog(timeText);
                }
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    cur.stateCheckReloaded = false;
                    save(cur);
                    setTimeout(() => {
                      if (!navigateToExploreArea()) {
                        window.location.href = window.location.href;
                      }
                    }, 1000);
                }
            }, 1000);
            return;
        }

        if (currentState !== 'Normal' && currentState !== 'Exploring') {
            if (state.log.length > 0 && state.log[state.log.length - 1].includes('⏳')) {
                state.log.pop();
            }
            const WAIT_MS = 60000;
            state.log.push(`⏳ State: ${currentState}. Checking in 1 min...`);
            save(state);
            updateUI();

            let timeLeft = WAIT_MS / 1000;
            const timer = setInterval(() => {
                const cur = load();
                if (!cur || !cur.autoCycleActive) { clearInterval(timer); return; }
                timeLeft--;
                const timeText = `⏳ ${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s until next check...`;
                if (cur.log[cur.log.length - 1]?.startsWith('⏳')) {
                    cur.log[cur.log.length - 1] = timeText;
                    save(cur);
                    updateLog(timeText);
                }
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    cur.stateCheckReloaded = false;
                    save(cur);
                    setTimeout(() => {
                      if (!navigateToExploreArea()) {
                        window.location.href = window.location.href;
                      }
                    }, 1000);
                }
            }, 1000);
            return;
        }

        if (!detectedFloor) {
            state.log.push(`❌ Could not detect floor from: ${h1Text}`);
            state.autoCycleActive = false;
            save(state);
            updateUI();
            return;
        }

        // SPECIAL HANDLING FOR FLOOR 1-2 (DIRECT FLOOR, NO ELEVATOR ACCESS PAGE)
        if (detectedFloor === 'floor_1' || detectedFloor === 'floor_2') {
            // We're on Floor 1 or 2 directly (no elevator access page)
            state.log.push(`📍 At ${h1Text} (State: ${currentState})`);

            // Check if we're leaving after exploration
            if (state.isLeavingFloor) {
                if (currentState === 'Exploring') {
                    // We just clicked elevator call button, waiting for elevator
                    state.log.push(`⏳ On ${h1Text}, elevator called (State: Exploring). Checking again in 30s...`);
                    state.waitingForNormal = true;
                    state.stateCheckReloaded = false;
                    save(state);
                    updateUI();

                    // Wait 30 seconds then check again
                    setTimeout(() => {
                        const cur = load();
                        if (cur?.autoCycleActive) {
                            cur.stateCheckReloaded = false;
                            save(cur);
                            setTimeout(() => {
                              if (!navigateToExploreArea()) {
                                window.location.href = window.location.href;
                              }
                            }, 1000);
                        }
                    }, 30000);
                    return;
                } else if (currentState === 'Normal') {
                    // State changed to Normal - we're now at main elevator lobby
                    state.log.push(`✅ Back at Main Elevator Lobby from ${h1Text}!`);
                    state.isLeavingFloor = false;
                    state.waitingForNormal = false;
                    state.stateCheckReloaded = false;
                    state.needsElevatorUse = true;
                    save(state);
                    updateUI();
                    setTimeout(autoCycleEngine, 1000);
                    return;
                }
            } else if (currentState === 'Normal') {
                // We're arriving at Floor 1 or 2 for exploration (State: Normal)
                state.isLeavingFloor = false;

                state.log.push(`✅ At 🛏️ Floor 1-2 (Detected as: ${h1Text})`);
                state.waitingForNormal = false;
                state.stateCheckReloaded = false;
                state.active = true;
                state.place = 'floor';  // Use the 'floor' place for both Floor 1 and 2
                state.depth = 0;
                state.history = [];
                state.isBacktracking = false;
                state.isReturning = false;
                state.failedIds = [];
                state.backtrackToDepth = 0;
                state.cooldownUntil = null;
                state.candidates = JSON.parse(JSON.stringify(PLACES['floor'].maps));

                // Set next destination to ROOF for after floor is done
                state.nextDestination = 'roof';

                if (state.singleElevatorTrip) {
                    state.autoCycleActive = false;
                    state.singleElevatorTrip = false;
                    state.log.push(`▶️ Single elevator trip complete.`);
                }

                save(state);
                updateUI();
                setTimeout(stepEngine, BASE_DELAY);
                return;
            } else {
                // At Floor 1/2 with unexpected state
                state.log.push(`⚠️ Unexpected state on ${h1Text}: ${currentState}. Waiting 30s...`);
                state.waitingForNormal = true;
                state.stateCheckReloaded = false;
                save(state);
                updateUI();

                // Wait 30 seconds then check again
                setTimeout(() => {
                    const cur = load();
                    if (cur?.autoCycleActive) {
                        cur.stateCheckReloaded = false;
                        save(cur);
                        setTimeout(() => {
                          if (!navigateToExploreArea()) {
                            window.location.href = window.location.href;
                          }
                        }, 1000);
                    }
                }, 30000);
                return;
            }
        }

        if (detectedFloor === 'elevator_access') {
            // We're at a floor's elevator access point
            state.log.push(`📍 At ${h1Text} (State: ${currentState})`);

            // Check if we're leaving after exploration
            if (state.isLeavingFloor) {
                if (currentState === 'Exploring') {
                    // We just clicked elevator call button, waiting for elevator
                    // Need to keep checking Explore Area until state becomes Normal
                    state.log.push(`⏳ Elevator called (State: Exploring). Checking again in 30s...`);
                    state.waitingForNormal = true;
                    state.stateCheckReloaded = false;
                    save(state);
                    updateUI();

                    // Wait 30 seconds then check again
                    setTimeout(() => {
                        const cur = load();
                        if (cur?.autoCycleActive) {
                            cur.stateCheckReloaded = false;
                            save(cur);
                            setTimeout(() => {
                              if (!navigateToExploreArea()) {
                                window.location.href = window.location.href;
                              }
                            }, 1000);
                        }
                    }, 30000);
                    return;
                } else if (currentState === 'Normal') {
                    // State changed to Normal - we're now at main elevator lobby
                    state.log.push(`✅ Back at Main Elevator Lobby!`);
                    state.isLeavingFloor = false;
                    state.waitingForNormal = false;
                    state.stateCheckReloaded = false;
                    state.needsElevatorUse = true;
                    save(state);
                    updateUI();
                    setTimeout(autoCycleEngine, 1000);
                    return;
                }

            } else if (currentState === 'Normal') {
                // We're arriving at a new floor for exploration (State: Normal)
                // RESET isLeavingFloor - we're arriving, not leaving
                state.isLeavingFloor = false;

                // Use H1 text to determine the actual floor - BE MORE PRECISE
                const h1 = document.querySelector('h1');
                const h1Text = h1?.textContent?.trim() || '';

                console.log('H1 Text for floor detection:', h1Text);

                // NEW: Parse the actual floor name from the H1 text
                // Example: "Wanda's Massage Parlor Elevator Access" → "Wanda's Massage Parlor"
                // Remove "Elevator Access" and trim
                let floorName = h1Text.replace(/Elevator\s+Access/i, '').trim();

                console.log('Parsed floor name:', floorName);

                // Now match based on the actual floor name
                let actualFloorKey = null;

                // Match floor names exactly (case-insensitive)
                if (/Burning\s+Office/i.test(floorName)) {
                    actualFloorKey = 'burning_office';
                } else if (/Wanda.*Massage/i.test(floorName)) {
                    actualFloorKey = 'wanda_massage';
                } else if (/Skyscraper\s+Gym/i.test(floorName)) {
                    actualFloorKey = 'skyscraper_gym';
                } else if (/Skyscraper\s+Library/i.test(floorName)) {
                    actualFloorKey = 'skyscraper_library';
                } else if (/Collapsed\s+Office\s+Floor/i.test(floorName)) {
                    actualFloorKey = 'collapsed_office_floor';
                } else if (/Collapsed\s+Floor/i.test(floorName)) {
                    actualFloorKey = 'collapsed_floor';
                } else if (/Collapsed\s+Office/i.test(floorName)) {
                    actualFloorKey = 'collapsed_office';
                }

                if (actualFloorKey) {
                    state.log.push(`✅ At ${PLACES[actualFloorKey]?.name || actualFloorKey} (Detected from: ${floorName})`);
                    state.waitingForNormal = false;
                    state.stateCheckReloaded = false;
                    state.active = true;
                    state.place = actualFloorKey;
                    state.depth = 0;
                    state.history = [];
                    state.isBacktracking = false;
                    state.isReturning = false;
                    state.failedIds = [];
                    state.backtrackToDepth = 0;
                    state.cooldownUntil = null;
                    state.candidates = JSON.parse(JSON.stringify(PLACES[actualFloorKey].maps));

                    // Set next destination to ROOF for after floor is done
                    state.nextDestination = 'roof';

                    if (state.singleElevatorTrip) {
                        state.autoCycleActive = false;
                        state.singleElevatorTrip = false;
                        state.log.push(`▶️ Single elevator trip complete.`);
                    }

                    save(state);
                    updateUI();
                    setTimeout(stepEngine, BASE_DELAY);
                    return;
                } else {
                    state.log.push(`❌ Could not determine floor from elevator access: ${floorName}`);
                    state.autoCycleActive = false;
                    save(state);
                    updateUI();
                    return;
                }
            } else {
                // At elevator access with unexpected state
                state.log.push(`⚠️ Unexpected state at elevator access: ${currentState}. Waiting 30s...`);
                state.waitingForNormal = true;
                state.stateCheckReloaded = false;
                save(state);
                updateUI();

                // Wait 30 seconds then check again
                setTimeout(() => {
                    const cur = load();
                    if (cur?.autoCycleActive) {
                        cur.stateCheckReloaded = false;
                        save(cur);
                        setTimeout(() => {
                          if (!navigateToExploreArea()) {
                            window.location.href = window.location.href;
                          }
                        }, 1000);
                    }
                }, 30000);
                return;
            }
        }

        // If we're at an actual floor (not elevator_access), run routes
        const floorPlaceKey = FLOOR_MAP[detectedFloor];

        if (floorPlaceKey && floorPlaceKey !== 'skyscraper_roof') {
            // For actual floors, run automatic routing
            const place = PLACES[floorPlaceKey];
            state.log.push(`🗺️ Loading ${place.name}`);
            state.waitingForNormal = false;
            state.stateCheckReloaded = false;
            state.active = true;
            state.place = floorPlaceKey;
            state.depth = 0;
            state.history = [];
            state.isBacktracking = false;
            state.isReturning = false;
            state.failedIds = [];
            state.backtrackToDepth = 0;
            state.cooldownUntil = null;
            state.candidates = JSON.parse(JSON.stringify(place.maps));

            // Set next destination to ROOF for after floor is done
            state.nextDestination = 'roof';

            save(state);
            updateUI();
            setTimeout(stepEngine, BASE_DELAY);
            return;
        } else if (detectedFloor === 'elevator_access' && currentState !== 'Normal') {
            // At elevator access point but NOT Normal state = waiting to go back to lobby
            if (state.log.length > 0 && state.log[state.log.length - 1].includes('⏳')) {
                state.log.pop();
            }
            const WAIT_MS = 60000;
            state.log.push(`⏳ At elevator access (State: ${currentState}). Waiting for lobby...`);
            save(state);
            updateUI();

            setTimeout(() => {
                const cur = load();
                if (cur?.autoCycleActive) {
                    cur.stateCheckReloaded = false;
                    save(cur);
                    setTimeout(() => {
                      if (!navigateToExploreArea()) {
                        window.location.href = window.location.href;
                      }
                    }, 1000);
                }
            }, WAIT_MS);
            return;
        } else {
            // Default: continue elevator loop
            state.waitingForNormal = false;
            state.stateCheckReloaded = false;
            state.needsElevatorUse = true;
            save(state);
            updateUI();
            setTimeout(autoCycleEngine, 1000);
            return;
        }
    }
  }

  async function stepEngine() {
    const state = load();
    if (!state?.active) return;

    // Check for elevator error in step engine too
    if (checkElevatorError()) {
      state.log.push(`🛗 Elevator error during route. Waiting 1 minute to retry...`);
      state.cooldownUntil = Date.now() + ELEVATOR_COOLDOWN_MS;

      // Save that we need to resume exploration after cooldown
      state.pendingResumeAction = 'exploration';

      save(state);
      updateUI();

      let timeLeft = ELEVATOR_COOLDOWN_MS / 1000;
      const timer = setInterval(() => {
        const cur = load();
        if (!cur || !cur.active) { clearInterval(timer); return; }
        timeLeft--;
        const timeText = `⏳ Elevator retry in ${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s...`;
        if (cur.log[cur.log.length - 1]?.startsWith('⏳')) {
          cur.log[cur.log.length - 1] = timeText;
          save(cur);
          updateLog(timeText);
        }
        if (timeLeft <= 0) {
          clearInterval(timer);
          cur.cooldownUntil = null;
          cur.log.push(`🔄 Retrying after elevator error...`);

          // Resume exploration
          if (cur.pendingResumeAction === 'exploration') {
            cur.pendingResumeAction = null;
            save(cur);
            updateUI();
            setTimeout(stepEngine, 500);
          } else {
            save(cur);
            updateUI();
            setTimeout(() => { window.location.href = window.location.href; }, 500);
          }
        }
      }, 1000);
      return;
    }

    const errorDiv = document.querySelector('.notification-real.notification-error');
    if (errorDiv && errorDiv.textContent.includes('nothing happens')) {
      const now = Date.now();
      state.cooldownUntil = now + COOLDOWN_MS;
      if (state.history.length > 0 && state.depth > 0) {
        state.history.pop();
        state.depth--;
        state.log.push(`⚠️ Move failed, rolling back to depth ${state.depth}`);
      }
      state.log.push(`⏳ Failed. Waiting 2 mins to retry...`);
      save(state);
      updateUI();

      let timeLeft = COOLDOWN_MS / 1000;
      const timer = setInterval(() => {
        const cur = load();
        if (!cur || !cur.active) { clearInterval(timer); return; }
        timeLeft--;
        const timeText = `⏳ Cooldown: ${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s...`;
        if (cur.log[cur.log.length - 1]?.startsWith('⏳')) {
          cur.log[cur.log.length - 1] = timeText;
          save(cur);
          updateLog(timeText);
        }
        if (timeLeft <= 0) {
          clearInterval(timer);
          cur.cooldownUntil = null;
          cur.log.push(`🔄 Reloading to retry same move...`);
          save(cur);
          updateUI();
          setTimeout(() => { window.location.href = window.location.href; }, 500);
        }
      }, 1000);
      return;
    }

    if (state.cooldownUntil && Date.now() < state.cooldownUntil) {
      const remaining = Math.ceil((state.cooldownUntil - Date.now()) / 1000);
      if (state.log.length > 0 && state.log[state.log.length - 1].includes('⏳')) { state.log.pop(); }
      state.log.push(`⏳ Cooldown: ${remaining}s`);
      save(state);
      updateUI();
      setTimeout(stepEngine, 1000);
      return;
    }

    if (state.cooldownUntil && Date.now() >= state.cooldownUntil) {
      state.cooldownUntil = null;
      state.log.push(`✅ Cooldown complete, continuing...`);
      save(state);
      updateUI();
    }

    if (state.isReturning) {
      if (state.history.length > 0) {
        const lastMove = state.history.pop();
        const backDir = OPPOSITES[lastMove];
        state.log.push(`🔙 Reversing: ${backDir}`);
        save(state);
        updateUI();
        move(backDir);
        return;
      } else {
        state.active = false;
        state.isReturning = false;

        // Check for elevator call button (both Auto Cycle and manual mode)
        const elevatorCall = findElevatorCallButton();
        if (elevatorCall && elevatorCall.btn) {
          state.log.push(`🔼 Found Elevator Call Button - Clicking...`);

          if (state.autoCycleActive) {
            // Set state for waiting logic in auto cycle
            state.active = false; // Stop stepEngine from running

            // Determine next destination based on current location
            if (state.place === 'skyscraper_roof') {
              // After roof exploration, go back to lobby
              state.nextDestination = 'floor';
              state.log.push(`🎯 Roof exploration complete. Returning to lobby...`);
            } else {
              // After floor exploration, go to roof
              state.nextDestination = 'roof';
              state.log.push(`🎯 Floor complete. Next destination: ${state.nextDestination}`);
            }

            // FIX FOR FLOOR 1-2: Ensure isLeavingFloor is set correctly
            state.isLeavingFloor = true; // We ARE leaving now
            state.needsElevatorUse = true;
            state.waitingForNormal = true;
            state.stateCheckReloaded = false;
            state.elevatorClicked = true;

            save(state);
            updateUI();
            elevatorCall.btn.click();

            // Wait 2 seconds then navigate to Explore Area to check state
            setTimeout(() => {
                if (!navigateToExploreArea()) {
                    window.location.href = window.location.href;
                }
            }, 2000);
            return;
          } else {
            // Manual mode - click button and temporarily activate auto-cycle for a single elevator trip
            state.active = false; // Stop stepEngine
            state.nextDestination = state.place === 'skyscraper_roof' ? 'floor' : 'roof';

            // FIX FOR FLOOR 1-2: Ensure isLeavingFloor is set correctly
            state.isLeavingFloor = true; // We ARE leaving now
            state.needsElevatorUse = true;
            state.waitingForNormal = true;
            state.stateCheckReloaded = false;
            state.elevatorClicked = true;
            state.autoCycleActive = true; // Temporarily enable autoCycle for a single elevator trip
            state.singleElevatorTrip = true; // New flag to indicate a single trip

            save(state);
            updateUI();
            elevatorCall.btn.click();

            // Wait 2 seconds then navigate to Explore Area to check state
            setTimeout(() => {
                if (!navigateToExploreArea()) {
                    window.location.href = window.location.href;
                }
            }, 2000);
            return;
          }
        }

        // No elevator button found
        if (state.autoCycleActive) {
            // After finishing exploration
            state.log.push(`🎯 ${state.place === 'skyscraper_roof' ? 'Roof' : 'Floor'} exploration complete. Looking for elevator...`);

            // We need to find and click the elevator call button
            const elevatorCall = findElevatorCallButton();
            if (elevatorCall && elevatorCall.btn) {
                state.log.push(`🔼 Clicking Elevator Call Button to return...`);
                state.active = false; // Stop stepEngine

                // FIX FOR FLOOR 1-2: Ensure isLeavingFloor is set correctly
                state.isLeavingFloor = true;
                state.waitingForNormal = true;
                state.stateCheckReloaded = false;
                state.elevatorClicked = true;

                // Set next destination
                if (state.place === 'skyscraper_roof') {
                    state.nextDestination = 'floor'; // Going back to lobby
                } else {
                    state.nextDestination = 'roof'; // Going to roof after floor
                }

                save(state);
                updateUI();

                // Click the elevator call button
                elevatorCall.btn.click();

                // Wait 2 seconds then navigate to Explore Area to check state
                setTimeout(() => {
                    if (!navigateToExploreArea()) {
                        window.location.href = window.location.href;
                    }
                }, 2000);
                return;
            } else {
                state.log.push(`❌ No elevator call button found after exploration`);
                state.autoCycleActive = false;
                save(state);
                updateUI();
            }
        } else {
          state.log.push(`✅ Complete!`);
          save(state);
          updateUI();
        }
        return;
      }
    }

    if (state.isBacktracking) {
      if (state.history.length > state.backtrackToDepth) {
        const lastMove = state.history.pop();
        const backDir = OPPOSITES[lastMove];
        state.log.push(`⬅️ Backtracking: ${backDir}`);
        state.depth--;
        save(state);
        updateUI();
        move(backDir);
        return;
      } else {
        state.isBacktracking = false;
        state.log.push(`🔄 Re-evaluating...`);
        save(state);
        updateUI();
      }
    }

    const { depth, history, failedIds, candidates } = state;

    let activeMaps = candidates.filter(m => {
      if (failedIds.includes(m.id)) return false;
      for (let i = 0; i < history.length; i++) {
        if (m.path[i] !== history[i]) return false;
      }
      return true;
    });

    const currentArrivals = activeMaps.filter(m => m.path.length === depth);
    if (currentArrivals.length > 0) {
      const itemData = await waitForElement(() => getAnyPresentItem(), 800);
      if (itemData) {
        state.log.push(`🎯 Found ${itemData.name}!`);
        const btn = itemData.row.querySelector("input[id*='btnUse']");
        if (btn) {
          state.isReturning = true;
          save(state);
          updateUI();
          btn.click();
          setTimeout(() => window.location.reload(), 1500);
          return;
        }
      } else {
        currentArrivals.forEach(m => state.failedIds.push(m.id));
        state.log.push(`⚠️ No item. Backtracking...`);
        state.isBacktracking = true;
        state.backtrackToDepth = Math.max(0, depth - 1);
        save(state);
        updateUI();
        stepEngine();
        return;
      }
    }

    const possibleNextMaps = activeMaps.filter(m => m.path.length > depth);
    let chosenDir = null;
    for (const m of possibleNextMaps) {
      const dir = m.path[depth];
      const nd = DIR_MAP[dir.toUpperCase()] || dir;
      if (document.querySelector(`g[data-dir="${nd}"], a[title*="${nd}"]`)) {
        chosenDir = dir;
        break;
      }
    }

    if (chosenDir) {
      state.log.push(`➡️ Step ${depth + 1}: ${chosenDir}`);
      state.depth++;
      state.history.push(chosenDir);
      save(state);
      updateUI();
      setTimeout(() => { window.location.href = window.location.href; }, BASE_DELAY + Math.floor(Math.random() * RANDOM_JITTER));
      move(chosenDir);
    } else {
      if (history.length === 0) {
        state.log.push(`❌ All routes blocked at start.`);
        state.active = false;
        save(state);
        updateUI();
        return;
      }
      // Only fail maps that actually need the blocked directions at this depth
      const blockedMaps = possibleNextMaps.filter(m => {
        const dir = m.path[depth];
        const nd = DIR_MAP[dir.toUpperCase()] || dir;
        return !document.querySelector(`g[data-dir="${nd}"], a[title*="${nd}"]`);
      });
      blockedMaps.forEach(m => state.failedIds.push(m.id));
      state.log.push(`⚠️ ${blockedMaps.length} route(s) blocked. Backtracking...`);
      state.isBacktracking = true;
      state.backtrackToDepth = depth - 1;
      save(state);
      updateUI();
      stepEngine();
    }
  }

function injectStyles() {
    if (document.getElementById('mm-styles')) return;
    const style = document.createElement('style');
    style.id = 'mm-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      #mm-ui {
        position: fixed;
        bottom: 12px;
        right: 12px;
        background: #18181b;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #fafafa;
        padding: 10px;
        border-radius: 12px;
        width: 200px;
        z-index: 99999;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        border: 1px solid #27272a;
      }
      #mm-ui b {
        display: block;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #fafafa;
        text-align: center;
        letter-spacing: 0.5px;
      }
      #mm-ui button, #mm-ui select {
        width: 100%;
        margin-top: 5px;
        padding: 7px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        box-sizing: border-box;
        transition: all 0.15s ease;
      }
      #mm-ui button {
        background: #27272a;
        color: #fafafa;
        border: 1px solid #3f3f46;
      }
      #mm-ui button:hover {
        background: #3f3f46;
        border-color: #52525b;
      }
      #mm-ui button.auto-btn {
        background: #ef4444;
        color: #fff;
        border: 1px solid #dc2626;
        font-weight: 700;
      }
      #mm-ui button.auto-btn:hover {
        background: #dc2626;
      }
      #mm-ui button.resume-btn {
        background: #27272a;
        color: #fca5a5;
        border: 1px solid #3f3f46;
      }
      #mm-ui button.resume-btn:hover {
        background: #3f3f46;
        border-color: #ef4444;
        color: #fca5a5;
      }
      #mm-ui select {
        background: #27272a;
        color: #fafafa;
        text-align-last: center;
        border: 1px solid #3f3f46;
        border-radius: 8px;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fafafa' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05);
      }
      #mm-ui select:hover {
        background-color: #3f3f46;
        border-color: #52525b;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fafafa' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
        box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07);
      }
      #mm-ui select:focus {
        outline: none;
        border-color: #ef4444;
        background-color: #3f3f46;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fafafa' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
        box-shadow: 0 0 0 2px rgba(239,68,68,0.2), 0 2px 4px rgba(0,0,0,0.25);
      }
      #mm-ui select option {
        background: #18181b;
        color: #fafafa;
        padding: 8px;
      }
      #mm-log {
        font-size: 10px;
        font-weight: 500;
        margin-top: 8px;
        max-height: 100px;
        overflow-y: auto;
        background: #09090b;
        padding: 6px;
        color: #a1a1aa;
        border-radius: 8px;
        border: 1px solid #27272a;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.4;
      }
      #mm-log::-webkit-scrollbar {
        width: 3px;
      }
      #mm-log::-webkit-scrollbar-track {
        background: transparent;
      }
      #mm-log::-webkit-scrollbar-thumb {
        background: #3f3f46;
        border-radius: 3px;
      }
      #mm-log::-webkit-scrollbar-thumb:hover {
        background: #52525b;
      }
    `;
    document.head.appendChild(style);
  }

  function createUI() {
    // Remove existing UI if it exists
    const existingUI = document.getElementById('mm-ui');
    if (existingUI) {
      existingUI.remove();
    }

    const ui = document.createElement('div');
    ui.id = 'mm-ui';
    ui.innerHTML = `
      <b>🧭 Pathfinder Pro</b>
      <select id="mm-place"></select>
      <button id="mm-run">Start</button>
      <button id="mm-resume" class="resume-btn">⏯️ Resume</button>
      <button id="mm-auto" class="auto-btn">🔄 Auto Cycle</button>
      <button id="mm-reset">Reset</button>
      <div id="mm-log"></div>
    `;
    document.body.appendChild(ui);

    const sel = ui.querySelector('#mm-place');
    Object.entries(PLACES).forEach(([k, v]) => {
      const o = document.createElement('option');
      o.value = k;
      o.textContent = v.name;
      sel.appendChild(o);
    });

    ui.querySelector('#mm-run').onclick = () => {
      const p = PLACES[sel.value];
      save({
        active: true,
        autoCycleActive: false,
        place: sel.value,
        depth: 0,
        history: [],
        isBacktracking: false,
        isReturning: false,
        failedIds: [],
        backtrackToDepth: 0,
        cooldownUntil: null,
        elevatorClicked: false,
        isLeavingFloor: false,
        oxygenUsed: false,
        candidates: JSON.parse(JSON.stringify(p.maps)),
        pendingElevatorAction: null,
        pendingResumeAction: null,
        singleElevatorTrip: false,
        log: [`▶️ ${p.name}`]
      });
      updateUI();
      stepEngine();
    };

    ui.querySelector('#mm-resume').onclick = () => {
      const state = load();
      if (!state) {
        alert('No saved state to resume from!');
        return;
      }

      // Check what kind of state we have
      if (state.autoCycleActive) {
        state.log.push(`⏯️ Resuming Auto Cycle...`);
        save(state);
        updateUI();
        autoCycleEngine();
      } else if (state.active) {
        state.log.push(`⏯️ Resuming Exploration...`);
        save(state);
        updateUI();
        stepEngine();
      } else if (state.waitingForNormal || state.needsElevatorUse || state.isLeavingFloor) {
        state.autoCycleActive = true;
        state.log.push(`⏯️ Resuming Auto Cycle...`);
        save(state);
        updateUI();
        autoCycleEngine();
      } else {
        // Try to detect current location and resume
        const detectedFloor = detectCurrentFloor();
        if (detectedFloor) {
          const placeKey = FLOOR_MAP[detectedFloor];
          if (placeKey === 'current_floor_elevator' || placeKey === 'main_elevator_lobby') {
            state.log.push(`⏯️ Resuming at ${PLACES[placeKey].name}, checking elevator status...`);
            state.autoCycleActive = true; // Temporarily activate autoCycle
            state.waitingForNormal = false; // We are already here, not waiting for arrival
            state.needsElevatorUse = true; // Assume we need to interact with elevator
            state.isLeavingFloor = false; // We are not actively leaving a floor right now, but evaluating if we need to.
            state.elevatorClicked = false;
            state.stateCheckReloaded = false;
            state.singleElevatorTrip = true; // Set for a single trip evaluation
            save(state);
            updateUI();
            autoCycleEngine(); // Call autoCycleEngine to handle elevator logic
          } else if (placeKey && PLACES[placeKey]) {
            const place = PLACES[placeKey];
            state.active = true;
            state.autoCycleActive = false;
            state.place = placeKey;
            state.depth = 0;
            state.history = [];
            state.isBacktracking = false;
            state.isReturning = false;
            state.failedIds = [];
            state.backtrackToDepth = 0;
            state.cooldownUntil = null;
            state.candidates = JSON.parse(JSON.stringify(place.maps));
            state.log.push(`⏯️ Resuming at ${place.name}...`);
            save(state);
            updateUI();
            setTimeout(stepEngine, BASE_DELAY);
          } else {
            alert('Cannot resume from current location. Please use Start or Auto Cycle.');
          }
        } else {
          alert('Cannot detect current location. Please use Start or Auto Cycle.');
        }
      }
    };

    ui.querySelector('#mm-auto').onclick = () => {
      save({
        active: false,
        autoCycleActive: true,
        waitingForNormal: true,
        needsElevatorUse: false,
        nextDestination: 'floor',
        stateCheckReloaded: false,
        elevatorClicked: false,
        isLeavingFloor: false,
        oxygenUsed: false,
        pendingElevatorAction: null,
        pendingResumeAction: null,
        singleElevatorTrip: false,
        log: [`🔄 Auto Cycle Started`, `⏳ Waiting for initial Normal state...`]
      });
      updateUI();
      autoCycleEngine();
    };

    ui.querySelector('#mm-reset').onclick = () => {
      clear();
      window.location.reload();
    };
  }

  function updateUI() {
    const log = document.getElementById('mm-log');
    const s = load();
    if (log) {
      log.textContent = s ? s.log.join('\n') : 'Ready.';
      log.scrollTop = log.scrollHeight;
    }
  }

  function updateLog(text) {
    const logDiv = document.getElementById('mm-log');
    if (logDiv) {
      const state = load();
      logDiv.textContent = state ? state.log.join('\n') : text;
      logDiv.scrollTop = logDiv.scrollHeight;
    }
  }

  // Main initialization
  function initialize() {
    injectStyles();
    createUI();
    updateUI();

    // Check for elevator error on page load
    const state = load();
    if (state?.autoCycleActive && checkElevatorError()) {
      state.log.push(`🛗 Elevator error detected on load. Waiting...`);
      state.elevatorCooldownUntil = Date.now() + ELEVATOR_COOLDOWN_MS;
      save(state);
      updateUI();
    } else if (state?.active) {
      setTimeout(stepEngine, BASE_DELAY + Math.floor(Math.random() * RANDOM_JITTER));
    } else if (state?.autoCycleActive) {
      setTimeout(autoCycleEngine, BASE_DELAY + Math.floor(Math.random() * RANDOM_JITTER));
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();