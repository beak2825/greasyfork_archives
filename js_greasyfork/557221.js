// ==UserScript==
// @name         Huawei Router Anti-Logout
// @namespace    Huawei HG6145D2 WKE2.094.443A01
// @version      5.0
// @description  Prevents automatic logout on the Huawei router interface and allows custom or unlimited session duration settings.
// @author       MochAdiMR
// @match        *://192.168.1.1/html/*
// @exclude      *://192.168.1.1/html/login_inter.html
// @icon         https://i.imgur.com/OsLkmXp.png
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557221/Huawei%20Router%20Anti-Logout.user.js
// @updateURL https://update.greasyfork.org/scripts/557221/Huawei%20Router%20Anti-Logout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS CONFIGURATION ---
    const CONSTANTS = {
        ROUTER_TIMEOUT_MINUTES: 5, // Default router limit (5 minutes)
        HEARTBEAT_INTERVAL_MS: 30000, // Script runs every 30 seconds
        STORAGE_KEY: "session_duration_cfg", // Config storage key
        TARGET_VARS: ['gLastOperateTime', 'g_idleTime'], // Target variables
        RESET_VARS: ['gClean_timeOut']
    };

    // Application State
    const state = {
        startTime: Date.now(),
        configValue: GM_getValue(CONSTANTS.STORAGE_KEY, "00") // Default "00" (Infinite)
    };

    // --- LOGGER ---
    const logger = {
        info: (msg) => console.log(`%c[Anti-Logout] ${msg}`, 'color: cyan; font-weight: bold;'),
        warn: (msg) => console.log(`%c[Anti-Logout] ${msg}`, 'color: orange; font-weight: bold;')
    };

    // --- HELPERS ---

    /**
     * Get a list of scopes (window, iframe, tampermonkey)
     */
    const getScopes = () => {
        const scopes = new Set([window]);
        if (typeof unsafeWindow !== 'undefined') scopes.add(unsafeWindow);
        if (window.top && window.top !== window) scopes.add(window.top);
        return Array.from(scopes);
    };

    /**
     * Translates user input into machine-readable status
     */
    const parseConfig = (val) => {
        if (val === "00") return { mode: 'INFINITE', label: "∞ (Unlimited)" };
        if (val === "0") return { mode: 'DEFAULT', label: "Default (5 Minutes)" };

        const num = parseInt(val);
        if (!isNaN(num)) return { mode: "CUSTOM", minutes: num, label: `${num} Minutes` };

        return { mode: "DEFAULT", label: "Error (Default)" }; // Fallback
    };

    // --- CORE LOGIC ---

    /**
     * Tampermonkey Settings Menu
     */
    const registerMenu = () => {
        const currentCfg = parseConfig(state.configValue);

        GM_registerMenuCommand(`⚙️ Session Duration: ${currentCfg.label}`, () => {
            const promptMsg =
                "Enter Session Duration (in Minutes):\n\n" +
                "• 0   = Default Router (5 Minutes)\n" +
                "• 00  = Unlimited (Infinite)\n" +
                "• >5  = Number of Minutes (Example: 60)\n";

            const input = prompt(promptMsg, state.configValue);

            if (input !== null) {
                // Input Validation
                if (input === "0" || input === "00") {
                    GM_setValue(CONSTANTS.STORAGE_KEY, input);
                    location.reload();
                } else {
                    const num = parseInt(input);
                    if (!isNaN(num) && num >= 5) {
                        GM_setValue(CONSTANTS.STORAGE_KEY, input);
                        location.reload();
                    } else {
                        alert("❌ Error: Minimum number is 5 minutes (or use 0 / 00).");
                    }
                }
            }
        });
    };

    /**
     * Main logic to determine whether we should "trick" the router
     */
    const shouldKeepAlive = () => {
        const config = parseConfig(state.configValue);

        // 1. INFINITE mode: Always keep alive
        if (config.mode === "INFINITE") return true;

        // 2. DEFAULT mode: Turn off the script (let the router work naturally)
        if (config.mode === "DEFAULT") return false;

        // 3. CUSTOM Mode: Calculate duration
        if (config.mode === "CUSTOM") {
            const elapsedMinutes = (Date.now() - state.startTime) / 60000;
            // We stop keep-alive 5 minutes BEFORE the target user is reached.
            // The last 5 minutes are left to the router's native timer.
            const keepAliveLimit = config.minutes - CONSTANTS.ROUTER_TIMEOUT_MINUTES;

            if (elapsedMinutes < keepAliveLimit) {
                return true;
            } else {
                logger.warn(`Limit reached. Releasing control to the router's original timer.`);
                return false;
            }
        }
        return false;
    };

    /**
     * Update the time variable in the browser (Variable Hack)
     */
    const hackBrowserTimer = () => {
        if (!shouldKeepAlive()) return; // Check permission first

        const currentTime = Date.now();
        const scopes = getScopes();

        scopes.forEach(scope => {
            // Update activity time variable
            CONSTANTS.TARGET_VARS.forEach(varName => {
                if (typeof scope[varName] !== 'undefined') {
                    scope[varName] = currentTime;
                }
            });

            // Reset timeout counter
            CONSTANTS.RESET_VARS.forEach(varName => {
                if (typeof scope[varName] !== 'undefined') {
                    scope[varName] = 0;
                }
            });
        });

        logger.info(`Session Extended. Mode: ${parseConfig(state.configValue).label}`);
    };

    /**
     * Send signal to server (Server Heartbeat)
     */
    const sendServerHeartbeat = () => {
        if (!shouldKeepAlive()) return; // Check permission first

        const scopes = getScopes();
        const xhrScope = scopes.find(scope => scope.XHR && typeof scope.XHR.get === 'function');

        if (xhrScope) {
            try {
                xhrScope.XHR.get("get_heartbeat", null, null);
            } catch (err) {}
        }
    };

    // --- INITIALIZATION ---

    const init = () => {
        console.clear();
        const cfg = parseConfig(state.configValue);
        logger.info(`Service Started. Target: ${cfg.label}`);

        registerMenu();

        // Main Loop
        setInterval(() => {
            hackBrowserTimer();
            sendServerHeartbeat();
        }, CONSTANTS.HEARTBEAT_INTERVAL_MS);
    };

    init();

})();