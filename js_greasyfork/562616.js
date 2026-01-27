// ==UserScript==
// @name         Attack Helper
// @namespace    http://swervelord.dev/
// @version      1.0.5
// @description  Refresher + Button Stacker
// @author       Swervelord
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562616/Attack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562616/Attack%20Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        apiKey: null, // Set your API key here, or leave null to use localStorage
        countdownReduction: 300, // Show attackable X ms early
        earlyJoin: true, // Allow starting fight before official availability
        holdAttack: false, // Require manual reload to finish
        autoRetry: false, // Auto-retry starting fight after failure
        storageKeys: {
            apiKey: "attack-helper-key",
            attackType: "torn-attack-type",
            weaponSlot: "torn-attack-slot",
        },
    };

    const ATTACK_TYPES = {
        leave: { value: "leave", label: "Leave", code: "1" },
        mug: { value: "mug", label: "Mug", code: "2" },
        hospitalize: { value: "hospitalize", label: "Hospitalize", code: "3" },
    };

    const WEAPON_SLOTS = {
        primary: { value: 1, label: "Primary" },
        secondary: { value: 2, label: "Secondary" },
        melee: { value: 3, label: "Melee" },
        temporary: { value: 4, label: "Temporary" },
    };

    // ═══════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════

    const styles = `
        /* CSS Variables for theming */
        :root {
            --ar-primary: #00c853;
            --ar-primary-hover: #00e676;
            --ar-primary-active: #69f0ae;
            --ar-danger: #ff5252;
            --ar-danger-hover: #ff6e6e;
            --ar-warning: #ffc107;
            --ar-bg-dark: #1a1a1a;
            --ar-bg-card: #252525;
            --ar-bg-input: #333333;
            --ar-text-primary: #ffffff;
            --ar-text-secondary: #b0b0b0;
            --ar-border: #404040;
            --ar-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            --ar-radius: 12px;
            --ar-radius-sm: 8px;
            --ar-transition: all 0.2s ease;
        }

        /* Main Container */
        .ar-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            background: var(--ar-bg-card);
            border-radius: var(--ar-radius);
            box-shadow: var(--ar-shadow);
            margin: 10px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-tap-highlight-color: transparent;
            border: 1px solid var(--ar-border);
        }

        /* Paused overlay */
        .ar-container.ar-paused {
            opacity: 0.7;
        }

        .ar-paused-indicator {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 12px;
            background: rgba(255, 193, 7, 0.15);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: var(--ar-radius-sm);
            color: var(--ar-warning);
            font-size: 12px;
            font-weight: 600;
        }

        .ar-container.ar-paused .ar-paused-indicator {
            display: flex;
        }

        /* Header */
        .ar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--ar-border);
            margin-bottom: 4px;
        }

        .ar-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--ar-text-primary);
            letter-spacing: 0.3px;
        }

        .ar-settings-btn {
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: var(--ar-transition);
        }

        .ar-settings-btn:hover {
            background: var(--ar-bg-input);
        }

        /* Settings Panel */
        .ar-settings {
            background: var(--ar-bg-dark);
            border-radius: var(--ar-radius-sm);
            padding: 12px;
            margin-bottom: 4px;
        }

        .ar-api-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .ar-api-input-row {
            display: flex;
            gap: 8px;
        }

        .ar-input {
            flex: 1;
            background: var(--ar-bg-input);
            border: 1px solid var(--ar-border);
            border-radius: var(--ar-radius-sm);
            color: var(--ar-text-primary);
            padding: 10px 12px;
            font-size: 13px;
            min-height: 40px;
        }

        .ar-input:focus {
            outline: none;
            border-color: var(--ar-primary);
        }

        .ar-input::placeholder {
            color: var(--ar-text-secondary);
        }

        .ar-btn-small {
            background: var(--ar-primary);
            color: #000;
            border: none;
            border-radius: var(--ar-radius-sm);
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--ar-transition);
            white-space: nowrap;
        }

        .ar-btn-small:hover {
            background: var(--ar-primary-hover);
        }

        /* Dynamic Content Area - Fixed Height */
        .ar-dynamic-area {
            min-height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .ar-dynamic-content {
            display: none;
        }

        .ar-dynamic-content.ar-visible {
            display: flex;
        }

        /* Make health bar flex for alignment */
        .ar-health.ar-visible {
            display: flex;
        }

        /* Result as flex center */
        .ar-result.ar-visible {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Countdown wrapper */
        #ar-countdown-wrapper.ar-visible {
            display: block;
            text-align: center;
        }

        /* Control Row - Dropdowns */
        .ar-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .ar-select-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .ar-select-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--ar-text-secondary);
            padding-left: 2px;
        }

        .ar-select {
            appearance: none;
            -webkit-appearance: none;
            background: var(--ar-bg-input);
            border: 1px solid var(--ar-border);
            border-radius: var(--ar-radius-sm);
            color: var(--ar-text-primary);
            padding: 12px 36px 12px 14px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--ar-transition);
            width: 100%;
            min-height: 44px; /* Touch-friendly */
        }

        .ar-select:focus {
            outline: none;
            border-color: var(--ar-primary);
            box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.2);
        }

        .ar-select:hover {
            border-color: var(--ar-primary);
        }

        .ar-select-wrapper::after {
            content: "";
            position: absolute;
            right: 14px;
            bottom: 18px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid var(--ar-text-secondary);
            pointer-events: none;
        }

        /* Action Button */
        .ar-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 24px;
            border: none;
            border-radius: var(--ar-radius-sm);
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--ar-transition);
            min-height: 52px; /* Touch-friendly */
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .ar-btn:active {
            transform: scale(0.98);
        }

        .ar-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .ar-btn-refresh {
            background: var(--ar-bg-input);
            color: var(--ar-text-primary);
            border: 1px solid var(--ar-border);
        }

        .ar-btn-refresh:hover:not(:disabled) {
            background: #3a3a3a;
            border-color: var(--ar-text-secondary);
        }

        .ar-btn-start {
            background: linear-gradient(135deg, var(--ar-primary) 0%, #00a844 100%);
            color: #000;
            box-shadow: 0 4px 15px rgba(0, 200, 83, 0.3);
        }

        .ar-btn-start:hover:not(:disabled) {
            background: linear-gradient(135deg, var(--ar-primary-hover) 0%, var(--ar-primary) 100%);
            box-shadow: 0 6px 20px rgba(0, 200, 83, 0.4);
        }

        .ar-btn-hit {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: #000;
            box-shadow: 0 4px 15px rgba(247, 147, 30, 0.3);
        }

        .ar-btn-hit:hover:not(:disabled) {
            background: linear-gradient(135deg, #ff7f50 0%, #ff6b35 100%);
        }

        .ar-btn-finish {
            background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
            color: #fff;
            box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
        }

        .ar-btn-finish:hover:not(:disabled) {
            background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%);
        }

        .ar-btn-danger {
            background: linear-gradient(135deg, var(--ar-danger) 0%, #d32f2f 100%);
            color: #fff;
        }

        /* Status Display */
        .ar-status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 14px;
            background: var(--ar-bg-input);
            border-radius: var(--ar-radius-sm);
            font-size: 13px;
            color: var(--ar-text-secondary);
            text-align: center;
        }

        .ar-status-success {
            background: rgba(0, 200, 83, 0.15);
            color: var(--ar-primary);
            border: 1px solid rgba(0, 200, 83, 0.3);
        }

        .ar-status-error {
            background: rgba(255, 82, 82, 0.15);
            color: var(--ar-danger);
            border: 1px solid rgba(255, 82, 82, 0.3);
        }

        .ar-status-warning {
            background: rgba(255, 193, 7, 0.15);
            color: var(--ar-warning);
            border: 1px solid rgba(255, 193, 7, 0.3);
        }

        /* Countdown Timer */
        .ar-countdown {
            font-size: 24px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            color: var(--ar-text-primary);
            text-align: center;
            padding: 8px;
        }

        .ar-countdown-label {
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            color: var(--ar-text-secondary);
            margin-bottom: 4px;
        }

        .ar-countdown.ar-countdown-urgent {
            color: var(--ar-warning);
            animation: ar-pulse 0.5s ease-in-out infinite alternate;
        }

        @keyframes ar-pulse {
            from { opacity: 0.7; }
            to { opacity: 1; }
        }

        /* Health Display */
        .ar-health {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background: var(--ar-bg-input);
            border-radius: var(--ar-radius-sm);
        }

        .ar-health-bar {
            flex: 1;
            height: 8px;
            background: #444;
            border-radius: 4px;
            overflow: hidden;
        }

        .ar-health-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--ar-danger) 0%, var(--ar-warning) 50%, var(--ar-primary) 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .ar-health-text {
            font-size: 13px;
            font-weight: 600;
            color: var(--ar-text-primary);
            min-width: 80px;
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        /* Loading Spinner */
        .ar-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: ar-spin 0.8s linear infinite;
        }

        @keyframes ar-spin {
            to { transform: rotate(360deg); }
        }

        /* Result Message */
        .ar-result {
            padding: 16px;
            border-radius: var(--ar-radius-sm);
            text-align: center;
            font-weight: 600;
            font-size: 15px;
        }

        .ar-result-win {
            background: linear-gradient(135deg, rgba(0, 200, 83, 0.2) 0%, rgba(0, 168, 68, 0.2) 100%);
            color: var(--ar-primary);
            border: 1px solid rgba(0, 200, 83, 0.4);
        }

        .ar-result-lose {
            background: linear-gradient(135deg, rgba(255, 82, 82, 0.2) 0%, rgba(211, 47, 47, 0.2) 100%);
            color: var(--ar-danger);
            border: 1px solid rgba(255, 82, 82, 0.4);
        }

        /* Mobile Optimizations */
        @media (max-width: 500px) {
            .ar-container {
                padding: 12px;
                margin: 8px 4px;
                border-radius: var(--ar-radius-sm);
            }

            .ar-controls {
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .ar-select {
                padding: 10px 32px 10px 12px;
                font-size: 13px;
            }

            .ar-btn {
                padding: 14px 20px;
                font-size: 15px;
            }

            .ar-countdown {
                font-size: 20px;
            }
        }

        /* TornPDA Specific Adjustments */
        @media (max-width: 400px) {
            .ar-container {
                padding: 10px;
                gap: 10px;
            }

            .ar-select-label {
                font-size: 10px;
            }

            .ar-select {
                min-height: 40px;
                padding: 8px 28px 8px 10px;
            }

            .ar-select-wrapper::after {
                bottom: 16px;
                right: 10px;
            }

            .ar-btn {
                min-height: 48px;
                padding: 12px 16px;
                font-size: 14px;
            }
        }

        /* Hide original elements if needed */
        .ar-hidden {
            display: none !important;
        }
    `;

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    class AttackState {
        constructor() {
            this.canAct = true;
            this.fightStarted = false;
            this.targetDefeated = false;
            this.userId = this.extractUserId();
            this.apiKey = CONFIG.apiKey ?? localStorage.getItem(CONFIG.storageKeys.apiKey);
            this.attackType = this.loadAttackType();
            this.weaponSlot = this.loadWeaponSlot();
            this.countdownInterval = null;
            this.apiTimestamp = null;
            this.tabFocused = !document.hidden && document.hasFocus();
            this.focusCallbacks = [];

            this.initFocusTracking();
        }

        initFocusTracking() {
            // Visibility API - detects tab switching
            document.addEventListener("visibilitychange", () => {
                this.tabFocused = !document.hidden && document.hasFocus();
                console.log("[Attack Helper] Visibility changed:", this.tabFocused ? "focused" : "hidden");
                this.focusCallbacks.forEach(cb => cb(this.tabFocused));
            });

            // Window focus/blur - detects clicking to another window
            window.addEventListener("blur", () => {
                this.tabFocused = false;
                console.log("[Attack Helper] Window blur - paused");
                this.focusCallbacks.forEach(cb => cb(this.tabFocused));
            });

            window.addEventListener("focus", () => {
                this.tabFocused = true;
                console.log("[Attack Helper] Window focus - resumed");
                this.focusCallbacks.forEach(cb => cb(this.tabFocused));
            });
        }

        onFocusChange(callback) {
            this.focusCallbacks.push(callback);
        }

        extractUserId() {
            const params = new URLSearchParams(window.location.search);
            return params.get("user2ID");
        }

        loadAttackType() {
            const stored = localStorage.getItem(CONFIG.storageKeys.attackType);
            const typeMap = { "1": "leave", "2": "mug", "3": "hospitalize" };
            return typeMap[stored] || "mug";
        }

        loadWeaponSlot() {
            const stored = localStorage.getItem(CONFIG.storageKeys.weaponSlot);
            return stored ? parseInt(stored, 10) : 3;
        }

        saveAttackType(type) {
            this.attackType = type;
            const codeMap = { leave: "1", mug: "2", hospitalize: "3" };
            localStorage.setItem(CONFIG.storageKeys.attackType, codeMap[type]);
        }

        saveWeaponSlot(slot) {
            this.weaponSlot = slot;
            localStorage.setItem(CONFIG.storageKeys.weaponSlot, slot.toString());
        }

        lock() {
            this.canAct = false;
        }

        unlock() {
            this.canAct = true;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UI COMPONENTS
    // ═══════════════════════════════════════════════════════════════

    class UI {
        constructor(state) {
            this.state = state;
            this.container = null;
            this.actionBtn = null;
            this.statusEl = null;
            this.countdownEl = null;
            this.healthEl = null;
        }

        injectStyles() {
            const styleEl = document.createElement("style");
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }

        createContainer() {
            this.container = document.createElement("div");
            this.container.className = "ar-container";
            this.container.id = "attack-helper";

            const hasApiKey = !!this.state.apiKey;

            this.container.innerHTML = `
                <div class="ar-header">
                    <span class="ar-title">⚔️ Attack Helper</span>
                    <button class="ar-settings-btn" id="ar-settings-toggle" title="Settings">⚙️</button>
                </div>
                <div class="ar-paused-indicator" id="ar-paused-indicator">
                    ⏸️ Paused (tab not focused)
                </div>
                <div class="ar-settings" id="ar-settings" style="display: none;">
                    <div class="ar-api-row">
                        <label class="ar-select-label">API Key ${hasApiKey ? '✓' : '(Required for countdown)'}</label>
                        <div class="ar-api-input-row">
                            <input type="password" class="ar-input" id="ar-api-key"
                                   placeholder="${hasApiKey ? '••••••••••••••••' : 'Enter your Torn API key'}"
                                   value="">
                            <button class="ar-btn-small" id="ar-save-key">Save</button>
                        </div>
                    </div>
                </div>
                <div class="ar-controls">
                    <div class="ar-select-wrapper">
                        <label class="ar-select-label">Finish Type</label>
                        <select class="ar-select" id="ar-attack-type">
                            ${Object.entries(ATTACK_TYPES)
                                .map(([key, { label }]) =>
                                    `<option value="${key}" ${key === this.state.attackType ? "selected" : ""}>${label}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
                    <div class="ar-select-wrapper">
                        <label class="ar-select-label">Weapon</label>
                        <select class="ar-select" id="ar-weapon-slot">
                            ${Object.entries(WEAPON_SLOTS)
                                .map(([key, { value, label }]) =>
                                    `<option value="${value}" ${value === this.state.weaponSlot ? "selected" : ""}>${label}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
                </div>
                <div class="ar-status" id="ar-status">${hasApiKey ? 'Initializing...' : 'Add API key for countdown timer'}</div>
                <div class="ar-dynamic-area" id="ar-dynamic-area">
                    <div id="ar-countdown-wrapper" class="ar-dynamic-content">
                        <div class="ar-countdown-label">Target Available In</div>
                        <div class="ar-countdown" id="ar-countdown">--:--</div>
                    </div>
                    <div class="ar-health ar-dynamic-content" id="ar-health">
                        <div class="ar-health-bar">
                            <div class="ar-health-fill" id="ar-health-fill" style="width: 100%;"></div>
                        </div>
                        <div class="ar-health-text" id="ar-health-text">-- / --</div>
                    </div>
                    <div class="ar-result ar-dynamic-content" id="ar-result"></div>
                </div>
                <button class="ar-btn ar-btn-refresh" id="ar-action-btn">
                    Check Status
                </button>
            `;

            this.actionBtn = this.container.querySelector("#ar-action-btn");
            this.statusEl = this.container.querySelector("#ar-status");
            this.countdownEl = this.container.querySelector("#ar-countdown");
            this.healthEl = this.container.querySelector("#ar-health");

            this.bindEvents();

            // Set up focus change listener for UI updates
            this.state.onFocusChange((focused) => {
                if (focused) {
                    this.container.classList.remove("ar-paused");
                } else {
                    this.container.classList.add("ar-paused");
                }
            });

            // Set initial state
            if (!this.state.tabFocused) {
                this.container.classList.add("ar-paused");
            }

            return this.container;
        }

        bindEvents() {
            // Settings toggle
            this.container.querySelector("#ar-settings-toggle").addEventListener("click", () => {
                const settings = this.container.querySelector("#ar-settings");
                settings.style.display = settings.style.display === "none" ? "block" : "none";
            });

            // API key save
            this.container.querySelector("#ar-save-key").addEventListener("click", () => {
                const input = this.container.querySelector("#ar-api-key");
                const key = input.value.trim();
                if (key) {
                    localStorage.setItem(CONFIG.storageKeys.apiKey, key);
                    this.state.apiKey = key;
                    input.value = "";
                    input.placeholder = "••••••••••••••••";
                    this.setStatus("API key saved! Refresh to use.", "success");

                    // Update the label
                    const label = this.container.querySelector(".ar-api-row .ar-select-label");
                    label.textContent = "API Key ✓";
                }
            });

            // Dropdown changes
            this.container.querySelector("#ar-attack-type").addEventListener("change", (e) => {
                this.state.saveAttackType(e.target.value);
            });

            this.container.querySelector("#ar-weapon-slot").addEventListener("change", (e) => {
                this.state.saveWeaponSlot(parseInt(e.target.value, 10));
            });
        }

        mount(targetSelector) {
            const target = document.querySelector(targetSelector);
            if (target) {
                // Ensure container is visible
                this.container.style.display = "flex";
                this.container.style.visibility = "visible";
                this.container.style.opacity = "1";
                target.insertBefore(this.container, target.firstChild);
                console.log("[Attack Helper] Container mounted, parent:", target.className);
                return true;
            }
            return false;
        }

        setStatus(message, type = "default") {
            this.statusEl.textContent = message;
            this.statusEl.className = "ar-status";
            if (type !== "default") {
                this.statusEl.classList.add(`ar-status-${type}`);
            }
        }

        setButtonState(state, text, onClick) {
            const btnClasses = {
                refresh: "ar-btn-refresh",
                start: "ar-btn-start",
                hit: "ar-btn-hit",
                finish: "ar-btn-finish",
                danger: "ar-btn-danger",
            };

            this.actionBtn.className = `ar-btn ${btnClasses[state] || "ar-btn-refresh"}`;
            this.actionBtn.innerHTML = text;
            this.actionBtn.disabled = false;

            // Clone to remove old listeners
            const newBtn = this.actionBtn.cloneNode(true);
            this.actionBtn.parentNode.replaceChild(newBtn, this.actionBtn);
            this.actionBtn = newBtn;

            if (onClick) {
                this.actionBtn.addEventListener("click", onClick);
            }
        }

        setButtonLoading(text = "Loading...") {
            this.actionBtn.disabled = true;
            this.actionBtn.innerHTML = `<span class="ar-spinner"></span> ${text}`;
        }

        showCountdown(show = true) {
            const wrapper = this.container.querySelector("#ar-countdown-wrapper");
            if (show) {
                this.hideAllDynamic();
                wrapper.classList.add("ar-visible");
            } else {
                wrapper.classList.remove("ar-visible");
            }
        }

        updateCountdown(ms) {
            const countdownEl = this.container.querySelector("#ar-countdown");
            if (ms >= 10000) {
                countdownEl.textContent = `${Math.ceil(ms / 1000)}s`;
                countdownEl.classList.remove("ar-countdown-urgent");
            } else if (ms > 0) {
                countdownEl.textContent = `${ms}ms`;
                countdownEl.classList.add("ar-countdown-urgent");
            } else {
                countdownEl.textContent = "NOW!";
                countdownEl.classList.add("ar-countdown-urgent");
            }
        }

        showHealth(current, max) {
            this.hideAllDynamic();
            this.healthEl.classList.add("ar-visible");
            const pct = Math.max(0, Math.min(100, (current / max) * 100));
            this.container.querySelector("#ar-health-fill").style.width = `${pct}%`;
            this.container.querySelector("#ar-health-text").textContent = `${current} / ${max}`;
        }

        hideHealth() {
            this.healthEl.classList.remove("ar-visible");
        }

        hideAllDynamic() {
            this.container.querySelectorAll(".ar-dynamic-content").forEach(el => {
                el.classList.remove("ar-visible");
            });
        }

        showResult(message, isWin) {
            const resultEl = this.container.querySelector("#ar-result");
            this.hideAllDynamic();
            resultEl.classList.add("ar-visible");
            resultEl.className = `ar-result ar-dynamic-content ar-visible ${isWin ? "ar-result-win" : "ar-result-lose"}`;
            resultEl.textContent = message;
        }

        hideResult() {
            this.container.querySelector("#ar-result").classList.remove("ar-visible");
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // API HANDLERS
    // ═══════════════════════════════════════════════════════════════

    class TornAPI {
        constructor(state) {
            this.state = state;
        }

        async checkTargetStatus() {
            if (!this.state.apiKey) {
                return { available: false, error: "No API key configured" };
            }

            const now = Math.floor(Date.now() / 1000);
            const response = await fetch(
                `https://api.torn.com/user/${this.state.userId}?selections=profile,timestamp&key=${this.state.apiKey}&from=${now}&comment=AttackHelper`
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.error);
            }

            return {
                until: data.status.until * 1000,
                timestamp: data.timestamp * 1000,
                state: data.status.state,
                description: data.status.description,
            };
        }

        async checkAttackable() {
            const response = await fetch(
                `https://www.torn.com/loader.php?sid=attackData&mode=json&user2ID=${this.state.userId}`,
                {
                    headers: this.getHeaders(),
                    credentials: "include",
                }
            );

            return response.json();
        }

        async startFight() {
            const body = this.buildFormData({
                step: "startFight",
                user2ID: this.state.userId,
            });

            const response = await fetch(
                "https://www.torn.com/loader.php?sid=attackData&mode=json",
                {
                    method: "POST",
                    headers: this.getHeaders(true),
                    body,
                    credentials: "include",
                }
            );

            return response.json();
        }

        async sendAttack(slot) {
            const body = this.buildFormData({
                step: "attack",
                user2ID: this.state.userId,
                user1EquipedItemID: slot,
            });

            const response = await fetch(
                "https://www.torn.com/loader.php?sid=attackData&mode=json",
                {
                    method: "POST",
                    headers: this.getHeaders(true),
                    body,
                    credentials: "include",
                }
            );

            return response.json();
        }

        async finishFight(finishType) {
            const body = this.buildFormData({
                step: "finish",
                fightResult: finishType,
            });

            const response = await fetch(
                "https://www.torn.com/loader.php?sid=attackData&mode=json",
                {
                    method: "POST",
                    headers: this.getHeaders(true),
                    body,
                    credentials: "include",
                }
            );

            return response.json();
        }

        getHeaders(isPost = false) {
            const headers = {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            };

            if (isPost) {
                headers["content-type"] = "multipart/form-data; boundary=----ARFormBoundary";
            }

            return headers;
        }

        buildFormData(fields) {
            const boundary = "----ARFormBoundary";
            let body = "";

            for (const [key, value] of Object.entries(fields)) {
                body += `--${boundary}\r\n`;
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                body += `${value}\r\n`;
            }

            body += `--${boundary}--\r\n`;
            return body;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ATTACK CONTROLLER
    // ═══════════════════════════════════════════════════════════════

    class AttackController {
        constructor() {
            this.state = new AttackState();
            this.ui = new UI(this.state);
            this.api = new TornAPI(this.state);
            this.apiTimeOffset = 0;
            this.countdownPaused = false;
            this.countdownTargetTime = null;
            this.countdownGetServerTime = null;
        }

        async init() {
            console.log("[Attack Helper] Initializing...");

            if (!this.state.userId) {
                console.error("[Attack Helper] No user ID found");
                return;
            }

            console.log("[Attack Helper] Target user ID:", this.state.userId);
            console.log("[Attack Helper] API key present:", !!this.state.apiKey);

            this.ui.injectStyles();
            console.log("[Attack Helper] Styles injected, waiting for UI...");
            await this.waitForUI();
            console.log("[Attack Helper] UI ready, creating container...");

            const container = this.ui.createContainer();

            // Find the main content area and inject at the top
            const mountSelectors = [
                { selector: "[class*='playersModelWrap']", position: "before" },
                { selector: "[class*='players-wrap']", position: "before" },
                { selector: ".content-title", position: "after" },
                { selector: "[class*='titleContainer']", position: "after" },
                { selector: "#mainContainer .content-wrapper", position: "prepend" },
            ];

            let mounted = false;
            for (const { selector, position } of mountSelectors) {
                const target = document.querySelector(selector);
                if (target) {
                    console.log("[Attack Helper] Found target:", selector, "position:", position);
                    if (position === "before") {
                        target.parentNode.insertBefore(container, target);
                    } else if (position === "after") {
                        target.parentNode.insertBefore(container, target.nextSibling);
                    } else {
                        target.insertBefore(container, target.firstChild);
                    }
                    mounted = true;
                    console.log("[Attack Helper] Successfully mounted");
                    break;
                }
            }

            // Ultimate fallback - fixed position overlay
            if (!mounted) {
                console.log("[Attack Helper] Using fixed position fallback");
                container.style.cssText += "position:fixed; top:60px; left:50%; transform:translateX(-50%); z-index:99999; width:calc(100% - 20px); max-width:500px;";
                document.body.appendChild(container);
                mounted = true;
            }

            if (!mounted) {
                console.error("[Attack Helper] Could not find mount point");
                return;
            }

            // Set up focus change listener for countdown pause/resume
            this.state.onFocusChange((focused) => {
                if (focused && this.countdownPaused) {
                    this.resumeCountdown();
                } else if (!focused && this.state.countdownInterval) {
                    this.pauseCountdown();
                }
            });

            this.ui.setButtonState("refresh", "Check Status", () => this.handleRefresh());
            await this.checkApiStatus();
        }

        waitForUI() {
            return new Promise((resolve) => {
                const selectors = [
                    "[class*='playersModelWrap']",
                    "[class*='dialogButtons']",
                    "[class*='playerWindow']",
                    ".players-wrap",
                    "#defender",
                    ".fighting-area",
                    "[class*='attacker']",
                ];

                const check = () => {
                    for (const selector of selectors) {
                        if (document.querySelector(selector)) {
                            console.log("[Attack Helper] Found UI element:", selector);
                            resolve();
                            return;
                        }
                    }
                    requestAnimationFrame(check);
                };
                check();

                // Timeout fallback - inject anyway after 3 seconds
                setTimeout(() => {
                    console.log("[Attack Helper] Timeout - injecting anyway");
                    resolve();
                }, 3000);
            });
        }

        async checkApiStatus() {
            // Skip if tab not focused
            if (!this.state.tabFocused) {
                this.ui.setStatus("Waiting for tab focus...", "warning");
                this.state.onFocusChange((focused) => {
                    if (focused && this.ui.statusEl.textContent === "Waiting for tab focus...") {
                        this.checkApiStatus();
                    }
                });
                return;
            }

            if (!this.state.apiKey) {
                this.ui.setStatus("No API key - manual refresh only", "warning");
                return;
            }

            try {
                this.ui.setStatus("Checking target status...");
                const status = await this.api.checkTargetStatus();
                const now = Date.now();
                this.apiTimeOffset = status.timestamp - now;

                const getServerTime = () => Date.now() + this.apiTimeOffset;

                if (status.until > 0) {
                    const remaining = status.until - getServerTime();

                    if (remaining > 0 && remaining < 600000) {
                        // Less than 10 minutes
                        this.ui.setStatus(status.description || "Target unavailable", "warning");
                        this.startCountdown(status.until, getServerTime);
                    } else if (remaining > 600000) {
                        this.ui.setStatus(status.description || "Target unavailable for a while", "warning");
                        this.ui.setButtonState("refresh", "Refresh Status", () => this.handleRefresh());
                    } else {
                        this.setReadyState();
                    }
                } else if (status.state === "Okay") {
                    this.setReadyState();
                } else {
                    this.ui.setStatus(status.description || "Target may be unavailable", "warning");
                    this.ui.setButtonState("refresh", "Refresh Status", () => this.handleRefresh());
                }
            } catch (error) {
                console.error("[Attack Helper] API Error:", error);
                this.ui.setStatus(`API Error: ${error.message}`, "error");
            }
        }

        startCountdown(targetTime, getServerTime) {
            this.ui.showCountdown(true);

            if (this.state.countdownInterval) {
                clearInterval(this.state.countdownInterval);
            }

            const adjustedTarget = targetTime - CONFIG.countdownReduction;

            // Store for pause/resume
            this.countdownTargetTime = adjustedTarget;
            this.countdownGetServerTime = getServerTime;
            this.countdownPaused = false;

            this.state.countdownInterval = setInterval(() => {
                // Skip updates if tab not focused
                if (!this.state.tabFocused) {
                    return;
                }

                const remaining = adjustedTarget - getServerTime();

                if (remaining <= 0) {
                    clearInterval(this.state.countdownInterval);
                    this.state.countdownInterval = null;
                    this.countdownTargetTime = null;
                    this.countdownGetServerTime = null;
                    this.ui.showCountdown(false);
                    this.setReadyState();
                } else {
                    this.ui.updateCountdown(remaining);
                }
            }, 50);

            this.ui.setButtonState("refresh", "Waiting...", null);
            this.ui.actionBtn.disabled = true;
        }

        pauseCountdown() {
            if (this.state.countdownInterval) {
                console.log("[Attack Helper] Pausing countdown");
                this.countdownPaused = true;
                // Keep interval running but it will skip updates due to focus check
            }
        }

        resumeCountdown() {
            if (this.countdownPaused && this.countdownTargetTime && this.countdownGetServerTime) {
                console.log("[Attack Helper] Resuming countdown");
                this.countdownPaused = false;

                // Check if countdown already expired while paused
                const remaining = this.countdownTargetTime - this.countdownGetServerTime();
                if (remaining <= 0) {
                    clearInterval(this.state.countdownInterval);
                    this.state.countdownInterval = null;
                    this.countdownTargetTime = null;
                    this.countdownGetServerTime = null;
                    this.ui.showCountdown(false);
                    this.setReadyState();
                }
            }
        }

        setReadyState() {
            this.ui.setStatus("Target is available!", "success");
            this.ui.setButtonState("start", "⚔️ Start Fight", () => this.handleStartFight());
        }

        async handleRefresh() {
            if (!this.state.canAct) return;

            // Block if tab not focused
            if (!this.state.tabFocused) {
                this.ui.setStatus("Focus tab to continue", "warning");
                return;
            }

            this.state.lock();

            this.ui.setButtonLoading("Checking...");

            try {
                const data = await this.api.checkAttackable();
                const startDisabled = document.querySelectorAll(
                    'button[type="submit"].torn-btn.disabled, button.torn-btn[disabled], [class*="startButton"][class*="disabled"]'
                ).length > 0;

                if ("startErrorTitle" in data || startDisabled) {
                    this.ui.setStatus("Target not attackable", "error");
                    this.ui.setButtonState("refresh", "Refresh Again", () => this.handleRefresh());
                } else if (data.DB?.attackStatus === "notStarted") {
                    this.setReadyState();
                } else {
                    this.ui.setStatus("Fight already in progress", "warning");
                    this.state.fightStarted = true;
                    this.ui.setButtonState("hit", "⚔️ Attack", () => this.handleAttack());
                }
            } catch (error) {
                console.error("[Attack Helper] Refresh error:", error);
                this.ui.setStatus("Error checking status", "error");
                this.ui.setButtonState("refresh", "Retry", () => this.handleRefresh());
            } finally {
                this.state.unlock();
            }
        }

        async handleStartFight() {
            if (!this.state.canAct) return;

            // Block if tab not focused
            if (!this.state.tabFocused) {
                this.ui.setStatus("Focus tab to start fight", "warning");
                return;
            }

            this.state.lock();

            this.ui.setButtonLoading("Starting Fight...");

            try {
                const data = await this.api.startFight();

                if (data?.currentAttackStatus === "process") {
                    this.state.fightStarted = true;
                    this.ui.setStatus("Fight started!", "success");
                    this.ui.setButtonState("hit", "⚔️ Attack", () => this.handleAttack());
                } else {
                    const error = data?.DB?.error || "Failed to start fight";
                    this.ui.setStatus(error, "error");
                    this.ui.setButtonState("start", "Retry Start", () => this.handleStartFight());

                    if (CONFIG.autoRetry && this.state.tabFocused) {
                        setTimeout(() => this.handleStartFight(), 100);
                    }
                }
            } catch (error) {
                console.error("[Attack Helper] Start fight error:", error);
                this.ui.setStatus("Error starting fight", "error");
                this.ui.setButtonState("start", "Retry Start", () => this.handleStartFight());
            } finally {
                this.state.unlock();
            }
        }

        async handleAttack() {
            if (!this.state.canAct) return;

            // Block if tab not focused
            if (!this.state.tabFocused) {
                this.ui.setStatus("Focus tab to attack", "warning");
                return;
            }

            this.state.lock();

            this.ui.setButtonLoading("Attacking...");

            try {
                const data = await this.api.sendAttack(this.state.weaponSlot);

                if (data?.DB?.currentFightHistory) {
                    const history = data.DB.currentFightHistory;
                    const lastHit = history[0];
                    const attackerId = data.DB?.attackerUser?.userID;

                    if (lastHit.result === "won" && lastHit.attackerID === attackerId) {
                        // We won!
                        this.state.targetDefeated = true;
                        this.ui.hideHealth();
                        this.ui.setStatus("Target defeated!", "success");

                        if (CONFIG.holdAttack) {
                            this.ui.setButtonState("refresh", "Reload to Finish", () => location.reload());
                        } else {
                            const typeLabel = ATTACK_TYPES[this.state.attackType]?.label || "Finish";
                            this.ui.setButtonState("finish", `💀 ${typeLabel}`, () => this.handleFinish());
                        }
                    } else if (lastHit.result === "won") {
                        // Someone else won
                        const message = lastHit.specialOutcome || lastHit.text || "Someone else finished the fight";
                        this.ui.showResult(message, false);
                        this.ui.setButtonState("refresh", "Done", null);
                        this.ui.actionBtn.disabled = true;
                    } else if (lastHit.result === "lost" && lastHit.defenderId === attackerId) {
                        // We lost
                        this.ui.showResult("You lost the fight!", false);
                        this.ui.setButtonState("danger", "Defeated", null);
                        this.ui.actionBtn.disabled = true;
                    } else {
                        // Fight continues
                        const defender = data.DB?.defenderUser;
                        if (defender) {
                            this.ui.showHealth(defender.life, defender.maxlife);
                        }
                        this.ui.setButtonState("hit", "⚔️ Attack", () => this.handleAttack());
                    }
                } else {
                    this.ui.setStatus("No response from attack", "warning");
                    this.ui.setButtonState("hit", "Retry Attack", () => this.handleAttack());
                }
            } catch (error) {
                console.error("[Attack Helper] Attack error:", error);
                this.ui.setStatus("Error during attack", "error");
                this.ui.setButtonState("hit", "Retry Attack", () => this.handleAttack());
            } finally {
                this.state.unlock();
            }
        }

        async handleFinish() {
            if (!this.state.canAct) return;

            // Block if tab not focused
            if (!this.state.tabFocused) {
                this.ui.setStatus("Focus tab to finish", "warning");
                return;
            }

            this.state.lock();

            this.ui.setButtonLoading("Finishing...");

            try {
                const data = await this.api.finishFight(this.state.attackType);

                if (data?.info?.info) {
                    this.ui.showResult(data.info.info, true);
                    this.ui.setButtonState("refresh", "✓ Complete", null);
                    this.ui.actionBtn.disabled = true;
                } else {
                    this.ui.setStatus("Failed to finish fight", "error");
                    this.ui.setButtonState("finish", "Retry Finish", () => this.handleFinish());
                }
            } catch (error) {
                console.error("[Attack Helper] Finish error:", error);
                this.ui.setStatus("Error finishing fight", "error");
                this.ui.setButtonState("finish", "Retry Finish", () => this.handleFinish());
            } finally {
                this.state.unlock();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    const controller = new AttackController();

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => controller.init());
    } else {
        controller.init();
    }
})();