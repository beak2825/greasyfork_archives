// ==UserScript==
// @name          🧭 Compass Route Runner (Multi-Character)
// @namespace     http://tampermonkey.net/
// @version       5.0.0
// @description   Fires custom Compass routes with infinite loops and multi-character support
// @author        anon
// @match         *://*.popmundo.com/World/Popmundo.aspx/Locale/Compass*
// @match         *://*.popmundo.com/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560948/%F0%9F%A7%AD%20Compass%20Route%20Runner%20%28Multi-Character%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560948/%F0%9F%A7%AD%20Compass%20Route%20Runner%20%28Multi-Character%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Universal compatibility for Tampermonkey & Violentmonkey
    if (typeof GM_getValue === 'undefined' && typeof GM !== 'undefined') {
        window.GM_getValue = function(key, defaultValue) {
            let result = defaultValue;
            GM.getValue(key, defaultValue).then(value => result = value);
            return result;
        };
        window.GM_setValue = function(key, value) {
            GM.setValue(key, value);
        };
        window.GM_deleteValue = function(key) {
            GM.deleteValue(key);
        };
        window.GM_addStyle = function(css) {
            GM.addStyle(css);
        };
    }

    // ---------- CONFIGURATION ----------
    const STORAGE_KEY = "compass_route_state";
    const MULTICHAR_KEY = "compass_multichar_state";
    const UI_POSITION_KEY = "compass_ui_position";
    const WAIT_CHECK_TIME_MS = 1 * 60 * 1000;

    const COMPASS_POSITION = {
        horizontal: "right",
        vertical: "bottom",
        offsetX: 20,
        offsetY: 20
    };

    // ---------- STATE MANAGEMENT ----------
    const GM_AVAILABLE = typeof GM_getValue !== 'undefined';

    const saveState = (state) => {
        if (GM_AVAILABLE) {
            GM_setValue(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    };

    const loadState = () => {
        if (GM_AVAILABLE) {
            const data = GM_getValue(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } else {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        }
    };

    const clearState = () => {
        if (GM_AVAILABLE) {
            GM_deleteValue(STORAGE_KEY);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const saveMultiCharState = (state) => {
        if (GM_AVAILABLE) {
            GM_setValue(MULTICHAR_KEY, JSON.stringify(state));
        } else {
            localStorage.setItem(MULTICHAR_KEY, JSON.stringify(state));
        }
    };

    const loadMultiCharState = () => {
        if (GM_AVAILABLE) {
            const data = GM_getValue(MULTICHAR_KEY);
            return data ? JSON.parse(data) : null;
        } else {
            return JSON.parse(localStorage.getItem(MULTICHAR_KEY) || "null");
        }
    };

    // Character list management
    const saveCharacters = (characters) => {
        if (GM_AVAILABLE) {
            GM_setValue(MULTICHAR_KEY + "_characters", JSON.stringify(characters));
        } else {
            localStorage.setItem(MULTICHAR_KEY + "_characters", JSON.stringify(characters));
        }
    };

    const loadCharacters = () => {
        if (GM_AVAILABLE) {
            const data = GM_getValue(MULTICHAR_KEY + "_characters");
            return data ? JSON.parse(data) : [];
        } else {
            return JSON.parse(localStorage.getItem(MULTICHAR_KEY + "_characters") || "[]");
        }
    };

    // ---------- UTILITY FUNCTIONS ----------
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const hardReload = () => {
        window.location.replace(window.location.href);
    };

    const isCompassPage = () => {
        return window.location.href.includes('/Locale/Compass');
    };

    // ---------- CHARACTER SWITCHING ----------
    // ---------- CHARACTER MANAGEMENT ----------
    function extractCharacterNames() {
        const selectElement = document.querySelector('select[id*="ddlCurrentCharacter"]');
        if (!selectElement) return [];

        const characters = [];
        const options = selectElement.querySelectorAll('option');

        options.forEach(option => {
            if (option.value && option.value !== '0' && !option.disabled && option.textContent.trim()) {
                characters.push({
                    id: option.value,
                    name: option.textContent.trim()
                });
            }
        });

        return characters;
    }

    function getCurrentCharacterName() {
        const select = document.querySelector('select[id*="ddlCurrentCharacter"]');
        if (!select) return null;
        const selected = select.options[select.selectedIndex];
        return selected && selected.value !== "0" ? selected.text.trim() : null;
    }

    function switchToCharacter(characterName) {
        const select = document.querySelector('select[id*="ddlCurrentCharacter"]');
        if (!select) {
            console.error('Character dropdown not found');
            return false;
        }

        // Find the option with matching text
        for (let i = 0; i < select.options.length; i++) {
            const option = select.options[i];
            if (option.text.trim() === characterName && option.value !== "0") {
                select.selectedIndex = i;

                // Set a flag that we're switching characters
                const mcState = loadMultiCharState();
                if (mcState) {
                    mcState.needsCompassRedirect = true;
                    saveMultiCharState(mcState);
                }

                // Click the switch button
                const switchBtn = document.querySelector('input[id*="btnChangeCharacter"]');
                if (switchBtn) {
                    setTimeout(() => {
                        switchBtn.click();
                    }, 200);
                    return true;
                }
            }
        }
        return false;
    }

    function handleMultiCharacterFlow() {
        const mcState = loadMultiCharState();
        if (!mcState || !mcState.active) return;

        const currentChar = getCurrentCharacterName();

        // Check if we just switched characters and need to redirect to Compass
        if (mcState.needsCompassRedirect) {
            delete mcState.needsCompassRedirect;
            saveMultiCharState(mcState);

            // Force redirect to Compass page
            if (!isCompassPage()) {
                const baseUrl = window.location.origin;
                window.location.href = baseUrl + '/World/Popmundo.aspx/Locale/Compass';
                return;
            }
        }

        // If we're not on compass page, navigate there
        if (!isCompassPage()) {
            const baseUrl = window.location.origin;
            window.location.href = baseUrl + '/World/Popmundo.aspx/Locale/Compass';
            return;
        }

        // NEW: If we just arrived at compass page after character switch, wait for page to fully load
        if (mcState.justArrivedAtCompass) {
            delete mcState.justArrivedAtCompass;
            saveMultiCharState(mcState);

            // Wait 2 seconds for compass page to fully load before starting route
            mcState.log.push(`⏳ Waiting for compass page to load...`);
            saveMultiCharState(mcState);
            updateMultiCharUI();

            setTimeout(() => {
                const mcStateUpdated = loadMultiCharState();
                if (mcStateUpdated && mcStateUpdated.active) {
                    mcStateUpdated.log.push(`✅ Compass loaded, starting route...`);
                    saveMultiCharState(mcStateUpdated);
                    updateMultiCharUI();
                    handleMultiCharacterFlow();
                }
            }, 2000);
            return;
        }

        // Check if current route is complete
        const routeState = loadState();
        if (routeState && routeState.active) {
            // Route is still running, let it continue
            return;
        }

        // Route completed or not started for this character
        if (mcState.currentCharIndex >= mcState.characters.length) {
            // All characters done
            mcState.active = false;
            mcState.log.push('✅ All characters completed!');
            saveMultiCharState(mcState);
            updateMultiCharUI();
            alert('Multi-character route complete!');
            return;
        }

        const targetChar = mcState.characters[mcState.currentCharIndex];

        // If we're on the right character and haven't started route yet
        if (currentChar === targetChar) {
            if (!mcState.routeStartedForCurrent) {
                // Start the route for this character
                mcState.log.push(`▶️ Starting route for ${targetChar}`);
                mcState.routeStartedForCurrent = true;
                saveMultiCharState(mcState);
                updateMultiCharUI();

                // Start the route
                startCustomRoute(mcState.route);
                return;
            } else {
                // Route just finished, move to next character
                mcState.log.push(`✅ ${targetChar} complete`);
                mcState.currentCharIndex++;
                mcState.routeStartedForCurrent = false;
                saveMultiCharState(mcState);
                updateMultiCharUI();

                // Continue to next character
                setTimeout(() => handleMultiCharacterFlow(), 1000);
                return;
            }
        }

        // Need to switch to target character
        mcState.log.push(`🔄 Switching to ${targetChar}...`);
        mcState.justArrivedAtCompass = true; // Set flag for when we arrive at compass
        saveMultiCharState(mcState);
        updateMultiCharUI();

        if (switchToCharacter(targetChar)) {
            // Wait for page reload after switch
            return;
        } else {
            mcState.active = false;
            mcState.log.push(`❌ Could not find character: ${targetChar}`);
            saveMultiCharState(mcState);
            updateMultiCharUI();
            alert(`Character "${targetChar}" not found in dropdown`);
        }
    }

    // ---------- UI VISUAL HELPERS ----------
    function dimCompass() {
        const ui = document.getElementById("compass-ui");
        if (!ui) return;
        ui.classList.add("compass-dim");
    }

    function restoreCompass() {
        const ui = document.getElementById("compass-ui");
        if (!ui) return;
        ui.classList.remove("compass-dim");
    }

    const waitForElement = async (finderFn, timeoutMs = 1000) => {
        const start = Date.now();
        const intervalMs = 50;

        let el = finderFn();
        if (el) return el;

        while (Date.now() - start < timeoutMs) {
            await sleep(intervalMs);
            el = finderFn();
            if (el) return el;
        }
        return null;
    };

    function getCurrentState() {
        const stateRow = [...document.querySelectorAll('.box table tr')]
            .find(tr => {
                const label = tr.querySelector('td:first-child')?.textContent.trim();
                return label === "State" || label === "Durum" || label === "Estado";
            });
        return stateRow?.querySelector('td:last-child')?.textContent.trim() || null;
    }

    function checkItemExists(itemName) {
        const normalizedTarget = itemName.trim().toLowerCase();
        const rows = document.querySelectorAll("#items-equipment tr.hoverable");

        for (const row of rows) {
            const link = row.querySelector("a[href*='ItemDetails']");
            if (link) {
                const itemText = link.textContent.trim().toLowerCase();
                if (itemText === normalizedTarget) {
                    return row;
                }
            }
        }
        return null;
    }

    function checkStateAndResume() {
        const state = loadState();
        if (!state || !state.active) return;

        const currentSegment = state.parsedPath[state.index];
        if (currentSegment?.type !== 'normal' || currentSegment.step?.toUpperCase() !== "WAIT") return;

        const current = getCurrentState();
        if (current === "Normal") {
            state.log.push(`✅ State Normal. Wait complete. Moving to next step.`);
            state.index++;
            delete state.waitReloaded;
            saveState(state);
            updateUI();
            performNext();
            return;
        }

        if (state.log.length > 0 && state.log[state.log.length - 1].includes("⏳")) {
            state.log.pop();
        }

        const ms = WAIT_CHECK_TIME_MS;
        const minutes = ms / 60000;
        state.log.push(`⏳ State is "${current}". Waiting ${minutes} min then checking again...`);
        saveState(state);
        updateUI();
        let timeLeft = ms / 1000;

        const timer = setInterval(() => {
            const currentState = loadState();
            if (!currentState || !currentState.active) {
                clearInterval(timer);
                return;
            }

            timeLeft--;
            const m = Math.floor(timeLeft / 60);
            const s = Math.floor(timeLeft % 60);
            const timeText = `⏳ ${m}m ${s}s until next check...`;

            if (currentState.log[currentState.log.length - 1]?.startsWith("⏳ ")) {
                currentState.log[currentState.log.length - 1] = timeText;
                saveState(currentState);
                updateLog(timeText);
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                hardReload();
            }
        }, 1000);
    }

    function checkMovementError() {
        const notif = document.querySelector("#notifications .notification-error");
        if (notif) {
            return "GENERAL_ERROR";
        }
        return null;
    }

    // ---------- INITIALIZATION ----------
    async function initialize() {
        console.log("Compass Runner (Multi-Character) initializing...");

        injectStyles();

        if (isCompassPage()) {
            createUI();

            const state = loadState();
            if (state?.active) {
                await sleep(500);

                const error = checkMovementError();
                if (error) {
                    state.active = false;
                    state.log.push("🚫 ERROR DETECTED! Paused runner.");
                    saveState(state);
                    updateUI();
                    alert("Compass paused: A movement or fit error was detected.");

                    // Also mark multi-char as failed
                    const mcState = loadMultiCharState();
                    if (mcState && mcState.active) {
                        mcState.active = false;
                        mcState.log.push(`❌ Error on ${getCurrentCharacterName()}`);
                        saveMultiCharState(mcState);
                    }
                    return;
                }

                setTimeout(() => {
                    performNext();
                }, 50);
            }

            // Check multi-character state
            setTimeout(() => handleMultiCharacterFlow(), 500);
        } else {
            // Not on compass page, but check if we're in multi-char mode
            setTimeout(() => handleMultiCharacterFlow(), 500);
        }
    }

    const normalizeDirection = d => {
        const map = {
            E: "East", W: "West", N: "North", S: "South",
            NE: "NorthEast", NW: "NorthWest", SE: "SouthEast", SW: "SouthWest",
            UP: "Up", DOWN: "Down",
            K: "North", G: "South", D: "East", B: "West",
            KB: "NorthWest", KD: "NorthEast", GB: "SouthWest", GD: "SouthEast",
            AŞAĞI: "Down", YUKARI: "Up",
            NORTE: "North", SUL: "South", LESTE: "East", OESTE: "West",
            NORDESTE: "NorthEast", NOROESTE: "NorthWest",
            SUDESTE: "SouthEast", SUDOESTE: "SouthWest",
            CIMA: "Up", BAIXO: "Down",
            L: "East", O: "West",
            NE_PT: "NorthEast", NO: "NorthWest", SE_PT: "SouthEast", SO: "SouthWest"
        };
        const key = d.trim().toUpperCase();
        return map[key] || d;
    };

    const reverseDirection = d => {
        const map = {
            "North": "South", "South": "North",
            "East": "West", "West": "East",
            "NorthEast": "SouthWest", "SouthWest": "NorthEast",
            "NorthWest": "SouthEast", "SouthEast": "NorthWest",
            "Up": "Down", "Down": "Up",
            "N": "S", "S": "N", "E": "W", "W": "E",
            "NE": "SW", "SW": "NE", "NW": "SE", "SE": "NW",
            "UP": "DOWN", "DOWN": "UP",
            "K": "G", "G": "K", "D": "B", "B": "D",
            "KB": "GD", "GD": "KB", "KD": "GB", "GB": "KD",
            "YUKARI": "AŞAĞI", "AŞAĞI": "YUKARI",
            "NORTE": "SUL", "SUL": "NORTE",
            "LESTE": "OESTE", "OESTE": "LESTE",
            "NORDESTE": "SUDOESTE", "SUDOESTE": "NORDESTE",
            "NOROESTE": "SUDESTE", "SUDESTE": "NOROESTE",
            "CIMA": "BAIXO", "BAIXO": "CIMA",
            "L": "O", "O": "L",
            "NO": "SE", "SE": "NO", "SO": "NE", "NE": "SO"
        };
        const upper = d.trim().toUpperCase();
        return map[upper] || d;
    };

    const findDirEl = d => {
        const nd = normalizeDirection(d);
        const elements = document.querySelectorAll(`g[data-dir="${nd}"], a[href*="/MoveTo/"][title*="${nd}"]`);
        return elements.length > 0 ? elements[0] : null;
    };

    function parseRoute(routeStr) {
        const segments = routeStr.split(/\s*-\s*/).map(x => x.trim()).filter(Boolean);
        const parsed = [];
        let i = 0;

        while (i < segments.length) {
            const seg = segments[i];
            const infiniteMatch = seg.match(/^Infinite:(.+)$/i);

            if (infiniteMatch) {
                const dirs = infiniteMatch[1].split(/[\s,/-]+/).filter(Boolean);
                i++;

                if (i < segments.length) {
                    const itemMatch = segments[i].match(/^Item:(.+)$/i);
                    if (itemMatch) {
                        parsed.push({
                            type: 'infinite',
                            directions: dirs,
                            targetItem: itemMatch[1].trim()
                        });
                        i++;
                        continue;
                    }
                }
                parsed.push({ type: 'error', step: seg });
                continue;
            }

            parsed.push({ type: 'normal', step: seg });
            i++;
        }
        return parsed;
    }

    let isPerformingAction = false;

    async function performNext() {
        if (isPerformingAction) return;
        isPerformingAction = true;
        dimCompass();

        try {
            const state = loadState();
            if (!state || !state.active) {
                isPerformingAction = false;

                // Check if multi-char should continue
                setTimeout(() => handleMultiCharacterFlow(), 500);
                return;
            }

            const globalError = checkMovementError();
            if (globalError) {
                state.active = false;
                state.log.push("🚫 ERROR! Character cannot move.");
                saveState(state);
                updateUI();
                alert("Compass paused: Movement error detected.");
                isPerformingAction = false;

                // Stop multi-char
                const mcState = loadMultiCharState();
                if (mcState && mcState.active) {
                    mcState.active = false;
                    mcState.log.push(`❌ Error on ${getCurrentCharacterName()}`);
                    saveMultiCharState(mcState);
                    updateMultiCharUI();
                }
                return;
            }

            if (state.index >= state.parsedPath.length) {
                state.active = false;
                state.log.push("✅ Route complete");
                saveState(state);
                updateUI();
                isPerformingAction = false;

                // Trigger next character in multi-char mode
                setTimeout(() => handleMultiCharacterFlow(), 1000);
                return;
            }

            const segment = state.parsedPath[state.index];

            /* ===================== INFINITE LOOP ===================== */
            if (segment.type === "infinite") {
                if (state.infiniteLoopCompleted) {
                    state.index++;
                    delete state.infiniteLoopCompleted;
                    delete state.infiniteLoopIndex;
                    delete state.infiniteLoopCount;
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    setTimeout(performNext, 100);
                    return;
                }

                const itemRow = await waitForElement(
                    () => checkItemExists(segment.targetItem),
                    1000
                );

                if (itemRow) {
                    const btn = itemRow.querySelector("input[id*='btnUse']");
                    if (btn) {
                        state.log.push(`🎯 Found "${segment.targetItem}"! Using it...`);
                        state.infiniteLoopCompleted = true;
                        saveState(state);
                        updateUI();

                        btn.click();
                        setTimeout(() => hardReload(), 2000);
                        return;
                    }

                    state.log.push(`⚠️ Found "${segment.targetItem}" but no Use button`);
                    state.index++;
                    delete state.infiniteLoopIndex;
                    delete state.infiniteLoopCount;
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    setTimeout(performNext, 500);
                    return;
                }

                if (state.infiniteLoopIndex === undefined) {
                    state.infiniteLoopIndex = 0;
                    state.infiniteLoopCount = 0;
                }

                const step = segment.directions[state.infiniteLoopIndex];
                state.infiniteLoopCount++;
                state.log.push(`🔄 [Loop ${state.infiniteLoopCount}] ${step} → searching "${segment.targetItem}"`);
                state.infiniteLoopIndex =
                    (state.infiniteLoopIndex + 1) % segment.directions.length;
                saveState(state);
                updateUI();

                if (checkMovementError()) {
                    state.active = false;
                    state.log.push("🚫 Movement blocked by error notification.");
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    return;
                }

                const el = await waitForElement(() => findDirEl(step), 1000);
                if (!el) {
                    state.log.push(`❌ ${step} not found (paused 🐰)`);
                    state.active = false;
                    saveState(state);
                    updateUI();
                    alert(`Compass paused at "${step}".`);
                    isPerformingAction = false;
                    return;
                }

                const href = el.getAttribute("href");

                if (href && href.includes("/MoveTo/")) {
                    setTimeout(() => (window.location.href = href), 150);
                } else {
                    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    setTimeout(() => {
                        isPerformingAction = false;
                        performNext();
                    }, 1200);
                }
                return;
            }

            /* ===================== NORMAL STEPS ===================== */
            const step = segment.step;

            if (step.toUpperCase() === "WAIT") {
                if (!state.waitReloaded) {
                    state.waitReloaded = true;
                    state.log.push("🔄 WAIT - Reloading to check state...");
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    hardReload();
                    return;
                }

                const current = getCurrentState();
                if (current === "Normal") {
                    state.log.push("✅ State Normal. Wait complete.");
                    state.index++;
                    delete state.waitReloaded;
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    setTimeout(performNext, 200);
                    return;
                }

                isPerformingAction = false;
                checkStateAndResume();
                return;
            }

            const waitMatch = step.match(/^wait:(\d+(?:\.\d+)?)(s|min)$/i);
            if (waitMatch) {
                const amount = parseFloat(waitMatch[1]);
                const unit = waitMatch[2].toLowerCase();
                const ms = unit === "s" ? amount * 1000 : amount * 60000;

                state.log.push(`⏸ Waiting ${amount}${unit}`);
                state.index++;
                saveState(state);
                updateUI();

                let left = ms / 1000;
                const timer = setInterval(() => {
                    const s0 = loadState();
                    if (!s0 || !s0.active) {
                        clearInterval(timer);
                        return;
                    }

                    left--;
                    s0.log[s0.log.length - 1] =
                        `⏳ ${Math.floor(left / 60)}m ${left % 60}s remaining...`;
                    saveState(s0);
                    updateLog();

                    if (left <= 0) {
                        clearInterval(timer);
                        hardReload();
                    }
                }, 1000);

                isPerformingAction = false;
                return;
            }

            const useMatch = step.match(/^use:(.+?)(?:@(.+))?$/i);
            if (useMatch) {
                const name = useMatch[1].trim().toLowerCase();
                const loc = useMatch[2]?.trim().toLowerCase() || null;

                const row = await waitForElement(() => {
                    return [...document.querySelectorAll("tr.hoverable")].find(tr => {
                        const a = tr.querySelector("a")?.textContent.trim().toLowerCase();
                        const e = tr.querySelector("em")?.textContent.trim().toLowerCase();
                        return a === name && (!loc || e === loc);
                    });
                }, 1000);

                if (!row) {
                    state.log.push(`❌ Use:${name}${loc ? "@" + loc : ""} (paused 🐰)`);
                    state.active = false;
                    saveState(state);
                    updateUI();
                    isPerformingAction = false;
                    return;
                }

                const btn = row.querySelector("input[id*='btnUse']");
                if (btn) {
                    state.log.push(`🔨 Use ${row.querySelector("a").textContent.trim()}`);
                    state.index++;
                    saveState(state);
                    updateUI();
                    btn.click();
                    setTimeout(() => hardReload(), 2000);
                    return;
                }
            }

            const rep = step.match(/^([A-Za-z]+)x(\d+)$/);
            if (rep) {
                const base = rep[1];
                const count = parseInt(rep[2], 10);
                state.log.push(`🔁 ${base} x${count}`);
                state.parsedPath.splice(
                    state.index,
                    1,
                    ...Array(count).fill({ type: "normal", step: base })
                );
                saveState(state);
                updateUI();
                isPerformingAction = false;
                setTimeout(performNext, 100);
                return;
            }

            if (checkMovementError()) {
                state.active = false;
                state.log.push("🚫 Movement blocked (error found).");
                saveState(state);
                updateUI();
                isPerformingAction = false;
                return;
            }

            const el = await waitForElement(() => findDirEl(step), 1000);
            if (!el) {
                state.log.push(`❌ ${step} (paused 🐰)`);
                state.active = false;
                saveState(state);
                updateUI();
                alert(`Compass paused at "${step}".`);
                isPerformingAction = false;
                return;
            }

            state.log.push(`>> ${step}`);
            state.index++;
            saveState(state);
            updateUI();

            const href = el.getAttribute("href");
            if (href && href.includes("/MoveTo/")) {
                setTimeout(() => (window.location.href = href), 150);
            } else {
                el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                setTimeout(() => {
                    isPerformingAction = false;
                    performNext();
                }, 1200);
            }

        } catch (err) {
            console.error("Compass error:", err);
        } finally {
            isPerformingAction = false;
            restoreCompass();
        }
    }

    function startCustomRoute(inp) {
        const parsedPath = parseRoute(inp);
        if (!parsedPath.length) return alert("Enter a valid route");

        saveState({
            active: true,
            index: 0,
            parsedPath,
            originalInput: inp,
            log: [],
            timestamp: Date.now()
        });
        updateUI();
        setTimeout(() => performNext(), 300);
    }

    function startMultiCharRoute(route, charactersText) {
        const characters = charactersText
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);

        if (!characters.length) {
            return alert("Please enter at least one character name");
        }

        if (!route.trim()) {
            return alert("Please enter a route");
        }

        saveMultiCharState({
            active: true,
            route: route,
            characters: characters,
            currentCharIndex: 0,
            routeStartedForCurrent: false,
            log: [`🚀 Starting multi-character run for ${characters.length} characters`],
            timestamp: Date.now()
        });

        updateMultiCharUI();

        // Start the flow
        setTimeout(() => handleMultiCharacterFlow(), 500);
    }

    function reverseRoute(inp) {
        const steps = inp.split(/[-]+/).map(x=>x.trim()).filter(Boolean);
        const reversed = steps.reverse().map(step => {
            if (step.toUpperCase().startsWith("INFINITE:")) return step;
            if (step.toUpperCase().startsWith("ITEM:")) return step;
            if (step.toUpperCase() === "WAIT") return step;
            if (step.match(/^wait:\d+(?:\.\d+)?(s|min)$/i)) return step;
            if (step.match(/^use:.+/i)) return step;
            if (step.match(/^[A-Za-z]+x\d+$/)) {
                const match = step.match(/^([A-Za-z]+)x(\d+)$/);
                const dir = reverseDirection(match[1]);
                return `${dir}x${match[2]}`;
            }
            return reverseDirection(step);
        });
        return reversed.join(' - ');
    }

    // ---------- UI MANAGEMENT ----------
    function updateLog(text) {
        const logDiv = document.querySelector("#compass-log");
        if (logDiv) {
            const state = loadState();
            logDiv.textContent = state ? state.log.join("\n") : text;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }

    function updateMultiCharUI() {
        const logDiv = document.querySelector("#multichar-log");
        if (logDiv) {
            const mcState = loadMultiCharState();
            if (mcState) {
                logDiv.textContent = mcState.log.join("\n");
                logDiv.scrollTop = logDiv.scrollHeight;
            }
        }

        const statusDiv = document.querySelector("#multichar-status");
        if (statusDiv) {
            const mcState = loadMultiCharState();
            if (mcState && mcState.active) {
                statusDiv.textContent = `Character ${mcState.currentCharIndex + 1}/${mcState.characters.length}`;
            } else {
                statusDiv.textContent = "Idle";
            }
        }
    }

    function updateUI() {
        const ui = document.getElementById("compass-ui");
        if (!ui) return;

        const state = loadState();
        const input = ui.querySelector("#compass-input");
        const log = ui.querySelector("#compass-log");
        if (input && state?.originalInput !== undefined) {
            input.value = state.originalInput;
        }

        if (log) {
            const newLog = state ? state.log.join("\n") : "Idle . . .";
            if (log.textContent !== newLog) {
                log.textContent = newLog;
                log.scrollTop = log.scrollHeight;
            }
        }

        const resumeBtn = ui.querySelector("#btn-resume");
        if (resumeBtn) {
            const s = loadState();
            resumeBtn.disabled = !(s && !s.active && s.index < s.parsedPath?.length);
        }
    }

    function setupEventListeners(ui) {
        if (ui.dataset.listenersSetup) return;
        ui.dataset.listenersSetup = "true";

        ui.querySelector("#btn-run").addEventListener("click", () => {
            const input = ui.querySelector("#compass-input");
            startCustomRoute(input.value);
        });

        ui.querySelector("#btn-reverse").addEventListener("click", () => {
            const input = ui.querySelector("#compass-input");
            input.value = reverseRoute(input.value);
        });

        ui.querySelector("#btn-resume").addEventListener("click", () => {
            const s = loadState();
            if (s && !s.active && s.index < s.parsedPath?.length) {
                s.active = true;
                saveState(s);
                performNext();
            } else {
                alert("Nothing to resume");
            }
        });

        ui.querySelector("#btn-reset").addEventListener("click", () => {
            clearState();
            const input = ui.querySelector("#compass-input");
            if (input) {
                input.value = "";
            }
            updateUI();
        });

        // Multi-character controls
        ui.querySelector("#btn-multichar-run").addEventListener("click", () => {
            const route = ui.querySelector("#compass-input").value;
            const chars = ui.querySelector("#multichar-names").value;

            // Get character names from textarea and scan
            const enteredNames = chars.split('\n').map(s => s.trim()).filter(Boolean);

            if (!enteredNames.length) {
                return alert("Please enter at least one character name");
            }

            if (!route.trim()) {
                return alert("Please enter a route");
            }

            startMultiCharRoute(route, chars);
        });

        ui.querySelector("#btn-multichar-stop").addEventListener("click", () => {
            const mcState = loadMultiCharState();
            if (mcState) {
                mcState.active = false;
                mcState.log.push("🛑 Stopped by user");
                saveMultiCharState(mcState);
                updateMultiCharUI();
            }

            const state = loadState();
            if (state) {
                state.active = false;
                saveState(state);
                updateUI();
            }
        });

ui.querySelector("#btn-multichar-clear").addEventListener("click", () => {
    // Clear the state
    if (GM_AVAILABLE) {
        GM_deleteValue(MULTICHAR_KEY);
        GM_deleteValue(MULTICHAR_KEY + "_characters");
    } else {
        localStorage.removeItem(MULTICHAR_KEY);
        localStorage.removeItem(MULTICHAR_KEY + "_characters");
    }

    // Clear the textarea
    const textarea = ui.querySelector("#multichar-names");
    if (textarea) {
        textarea.value = "";
    }

    updateMultiCharUI();
});

        ui.querySelector("#btn-scan-chars").addEventListener("click", () => {
            const characters = extractCharacterNames();
            if (characters.length === 0) {
                alert("No characters found. Make sure you're on a page with the character selector.");
                return;
            }

            // Save characters
            saveCharacters(characters);

            // Update textarea with character names
            const textarea = ui.querySelector("#multichar-names");
            if (textarea) {
                textarea.value = characters.map(c => c.name).join('\n');
            }

            alert(`Found ${characters.length} characters and added them to the list.`);
        });

        // Collapsible sections
        const collapse = ui.querySelector("#compass-collapse");
        const container = ui.querySelector("#compass-container");
        const COLLAPSE_KEY = STORAGE_KEY + "_collapsed";

        const collapsed = GM_AVAILABLE ? GM_getValue(COLLAPSE_KEY, "0") === "1" :
            localStorage.getItem(COLLAPSE_KEY) === "1";
        if (collapsed) {
            container.style.display = "none";
            collapse.textContent = "+";
        }

        collapse.addEventListener("click", () => {
            const hidden = container.style.display === "none";
            container.style.display = hidden ? "block" : "none";
            collapse.textContent = hidden ? "—" : "+";
            const value = hidden ? "0" : "1";
            if (GM_AVAILABLE) {
                GM_setValue(COLLAPSE_KEY, value);
            } else {
                localStorage.setItem(COLLAPSE_KEY, value);
            }
        });

        // Multi-character collapse
        const mcCollapse = ui.querySelector("#multichar-collapse");
        const mcSection = ui.querySelector("#multichar-section");
        const MC_COLLAPSE_KEY = STORAGE_KEY + "_mc_collapsed";

        const mcCollapsed = GM_AVAILABLE ? GM_getValue(MC_COLLAPSE_KEY, "1") === "1" :
            localStorage.getItem(MC_COLLAPSE_KEY) === "1";
        if (mcCollapsed) {
            mcSection.style.display = "none";
            mcCollapse.textContent = "+";
        }

        mcCollapse.addEventListener("click", () => {
            const hidden = mcSection.style.display === "none";
            mcSection.style.display = hidden ? "block" : "none";
            mcCollapse.textContent = hidden ? "—" : "+";
            const value = hidden ? "0" : "1";
            if (GM_AVAILABLE) {
                GM_setValue(MC_COLLAPSE_KEY, value);
            } else {
                localStorage.setItem(MC_COLLAPSE_KEY, value);
            }
        });
    }

    // ---------- STYLES ----------
    function injectStyles() {
        if (document.getElementById("compass-styles")) return;
        const css = `
            #compass-ui * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }
            #compass-ui {
                font-family: "Bahnschrift", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                position: fixed;
                ${COMPASS_POSITION.horizontal}: ${COMPASS_POSITION.offsetX}px;
                ${COMPASS_POSITION.vertical}: ${COMPASS_POSITION.offsetY}px;
                background: linear-gradient(145deg, #0f0f10, #1a1a1a);
                color: #e6e6e6;
                padding: 10px;
                border: 1px solid #333;
                border-radius: 10px;
                font-size: 13px;
                z-index: 999999;
                width: 230px;
                box-shadow: 0 4px 12px rgba(0,0,0,.45);
                user-select: none;
                touch-action: none;
                will-change: transform, opacity;
                max-height: calc(100vh - ${COMPASS_POSITION.offsetY * 2}px);
                overflow-y: auto;
                overflow-x: hidden;
            }

            @media (max-width: 768px) {
                #compass-ui {
                    width: 200px;
                    font-size: 12px;
                }
            }

            @media (max-width: 480px) {
                #compass-ui {
                    width: 180px;
                    padding: 8px;
                    ${COMPASS_POSITION.offsetX > 10 ? COMPASS_POSITION.horizontal + ': 10px;' : ''}
                }
                .compass-btn {
                    padding: 5px 6px;
                    font-size: 11px;
                }
            }

            #compass-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                padding: 3px;
                font-size: 14px;
                cursor: default;
            }
            #compass-header span:first-child {
                font-weight: 600;
            }
            #compass-collapse, #multichar-collapse {
                cursor: pointer;
                font-size: 16px;
                padding: 2px 6px;
                touch-action: manipulation;
                line-height: 1;
            }
            #compass-container, #multichar-section {
                margin-top: 6px;
            }
            #compass-controls, #multichar-controls {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                margin-bottom: 6px;
            }
            #compass-input, #multichar-names {
                flex: 1;
                min-width: 100%;
                padding: 6px 8px;
                border-radius: 6px;
                border: 1px solid #333;
                background: #121212;
                color: #e6e6e6;
                font-size: 12px;
                margin-bottom: 5px;
                font-family: inherit;
            }
            #multichar-names {
                min-height: 60px;
                resize: vertical;
            }
            .compass-btn {
                padding: 6px 8px;
                border-radius: 6px;
                border: 0;
                cursor: pointer;
                font-size: 12px;
                background: #222;
                color: #eee;
                font-weight: 600;
                touch-action: manipulation;
                flex: 1;
                min-width: 60px;
                transition: background 0.2s, opacity 0.2s;
            }
            .compass-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .compass-btn:active:not(:disabled) {
                background: #333;
            }
            .compass-btn.danger {
                background: #672db1;
            }
            .compass-btn.danger:active:not(:disabled) {
                background: #523477;
            }
            #compass-log, #multichar-log {
                margin-top: 6px;
                max-height: 120px;
                overflow-y: auto;
                white-space: pre-wrap;
                background: #0b0b0b;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                border: 1px solid #222;
                color: #cfcfcf;
                -webkit-overflow-scrolling: touch;
                line-height: 1.3;
            }
            #compass-log::-webkit-scrollbar, #multichar-log::-webkit-scrollbar {
                width: 6px;
            }
            #compass-log::-webkit-scrollbar-track, #multichar-log::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-radius: 8px;
            }
            #compass-log::-webkit-scrollbar-thumb, #multichar-log::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 8px;
                border: 2px solid #1a1a1a;
            }

            #compass-ui {
                transition: none;
            }

            #compass-ui.compass-dim {
                opacity: 0.9;
                pointer-events: none;
            }

            .multichar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0 6px 0;
                padding: 3px;
                font-size: 13px;
                cursor: default;
                border-top: 1px solid #333;
                padding-top: 8px;
            }
            .multichar-header span:first-child {
                font-weight: 600;
            }
            #multichar-status {
                font-size: 11px;
                color: #aaa;
                margin-bottom: 5px;
            }
        `;

        const style = document.createElement("style");
        style.id = "compass-styles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ---------- UI CREATION ----------
    function createUI() {
        let ui = document.getElementById("compass-ui");
        if (ui) {
            updateUI();
            updateMultiCharUI();
            return ui;
        }

        ui = document.createElement("div");
        ui.id = "compass-ui";
        dimCompass();

        const state = loadState();
        const mcState = loadMultiCharState();

        ui.innerHTML = `
            <div id="compass-header">
                <span>🧭 Compass ∞</span>
                <span id="compass-collapse">—</span>
            </div>
            <div id="compass-container">
                <div id="compass-controls">
                    <input type="text" id="compass-input" placeholder="Infinite:N,W - Item:River" value="${state?.originalInput || ''}">
                    <button class="compass-btn" id="btn-run">Run</button>
                    <button class="compass-btn" id="btn-reverse">⇄</button>
                    <button class="compass-btn" id="btn-resume">Resume</button>
                    <button class="compass-btn" id="btn-reset">⟳</button>
                </div>
                <div id="compass-log">${state ? state.log.join("\n") : "Idle . . ."}</div>

                <div class="multichar-header">
                    <span>👥 Multi-Character</span>
                    <span id="multichar-collapse">+</span>
                </div>
                <div id="multichar-section" style="display: none;">
                    <div id="multichar-status">  </div>
                    <button class="compass-btn" id="btn-scan-chars" style="width: 100%; margin-bottom: 5px;">
                        🔍︎ Scan Characters
                    </button>
                    <textarea id="multichar-names" placeholder="Enter character names (one per line) or scan characters.">${mcState?.characters ? mcState.characters.join('\n') : ''}</textarea>
                    <div id="multichar-controls">
                        <button class="compass-btn" id="btn-multichar-run">▶ Run All</button>
                        <button class="compass-btn danger" id="btn-multichar-stop">⏹ Stop</button>
                        <button class="compass-btn" id="btn-multichar-clear">Clear</button>
                    </div>
                    <div id="multichar-log">${mcState ? mcState.log.join("\n") : "Enter character names and click Run All"}</div>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
        setupEventListeners(ui);

        setTimeout(() => {
            ui.style.opacity = "1";
        }, 50);
        return ui;
    }


    // ---------- INITIALIZATION LOGIC ----------
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        setTimeout(initialize, 100);
    }

})();