// ==UserScript==
// @name         Travel Keyboard Hotkey (Sweet Action) + Auto Action Toggle for SMMO
// @namespace    https://github.com/dngda
// @version      2.0.6
// @description  Press 'Space' or 'Enter' to perform action on Travel, Crafting Material, and NPC pages in Simple MMO. Includes an Auto Action toggle button to automate actions every second.
// @author       @dngda
// @match        https://web.simple-mmo.com/travel
// @match        https://web.simple-mmo.com/travel?new_page=true
// @match        https://web.simple-mmo.com/crafting/material*
// @match        https://web.simple-mmo.com/npcs*
// @match        https://web.simple-mmo.com/quests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simple-mmo.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554473/Travel%20Keyboard%20Hotkey%20%28Sweet%20Action%29%20%2B%20Auto%20Action%20Toggle%20for%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/554473/Travel%20Keyboard%20Hotkey%20%28Sweet%20Action%29%20%2B%20Auto%20Action%20Toggle%20for%20SMMO.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ================== CONSTANTS ==================
    const CONFIG = {
        AUTO_INTERVAL: 1000,
        CAPTCHA_CHECK_INTERVAL: 60_000,
        CAPTCHA_SKIP_DURATION: 10_000,
        RETRY_THRESHOLD: 20,
        RANDOM_OFFSET_MIN: 1,
        RANDOM_OFFSET_MAX: 50,
        STORAGE_KEY: "tm_step_btn_clicker_auto_v1",
        AUTO_GENERATE_KEY: "tm_auto_generate_npc_v1",
        PERMISSION_TEST_KEY: "tm_permission_test_v1",
        IGNORE_NPC_ACTION_KEY: "tm_ignore_npc_action_v1",
        IGNORE_RARITY_KEY: "tm_ignore_rarity_v1",
        ALERT_SOUND_URL: "https://web.simple-mmo.com/sounds/attack/4.mp3",
        API_URL: "https://web.simple-mmo.com/api/web-app",
        AUTO_GENERATE_INTERVAL: 5000,
    };

    const SELECTORS = {
        ATTACK: '[x-on\\:click="attack(false);"]',
        GENERATE: '[x-on\\:click="quickGenerate();"]',
        GATHER: '[x-on\\:click*="gather()"]',
        PERFORM: '[x-on\\:click="performExpedition(quantity)"]',
        ACTION_BUTTON: ".action-button",
        NPC_ACTION: "a[href*='npcs']",
        STEP_BUTTON: "[id*='step_btn_']",
        TRAVEL_LINK: "a[href*='/travel']",
        CAPTCHA_LINK: "a[href*='/i-am-not-a-bot']",
        RARITY_ITEMS: {
            COMMON: ".common-item",
            UNCOMMON: ".uncommon-item",
            RARE: ".rare-item",
            ELITE: ".elite-item",
            EPIC: ".epic-item",
            LEGENDARY: ".legendary-item",
            CELESTIAL: ".celestial-item",
        },
    };

    const UI_CONFIG = {
        BADGE: {
            id: "kbdclicker-badge",
            text: "Space/Enter → Action",
            styles: {
                position: "fixed",
                right: "8px",
                bottom: "8px",
                zIndex: "1001",
                background: "#4f46e5",
                color: "#fff",
                padding: "6px 8px",
                fontSize: "12px",
                borderRadius: "6px",
                opacity: ".9",
                fontFamily: "sans-serif",
                cursor: "help",
            },
        },
        TOGGLE: {
            id: "kbdclicker-toggle",
            textRunning: "Stop Action",
            textStopped: "Start Action",
            titleRunning: "Auto Enter ON (tiap 1 detik)",
            titleStopped: "Auto Enter OFF",
            styles: {
                position: "fixed",
                right: "185px",
                bottom: "8px",
                zIndex: "1002",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "12px",
                border: "none",
                borderRadius: "6px",
                opacity: ".95",
                fontFamily: "sans-serif",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,.2)",
            },
            colorRunning: "#ef4444",
            colorStopped: "#16a34a",
        },
        AUTO_GENERATE: {
            id: "kbdclicker-autogen-checkbox",
            label: "Auto Generate NPC",
            styles: {
                position: "fixed",
                right: "275px",
                bottom: "8px",
                zIndex: "1002",
                background: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "12px",
                borderRadius: "6px",
                fontFamily: "sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
            },
            checkboxStyles: {
                cursor: "pointer",
                width: "16px",
                height: "16px",
            },
        },
        ACTION_SETTINGS: {
            id: "kbdclicker-action-settings",
            btnId: "kbdclicker-action-btn",
            modalId: "kbdclicker-action-modal",
            btnStyles: {
                position: "fixed",
                right: "148px",
                bottom: "8px",
                zIndex: "1002",
                background: "#6b7280",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "20px",
                border: "none",
                borderRadius: "6px",
                opacity: ".95",
                fontFamily: "sans-serif",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            modalStyles: {
                position: "fixed",
                right: "148px",
                bottom: "48px",
                zIndex: "1003",
                background: "rgba(30, 30, 30, 0.95)",
                color: "#fff",
                padding: "12px",
                fontSize: "12px",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                boxShadow: "0 4px 6px rgba(0,0,0,.3)",
                minWidth: "180px",
                display: "none",
            },
            checkboxContainerStyles: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
            },
            titleStyles: {
                fontWeight: "bold",
                marginBottom: "10px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "6px",
            },
            sectionTitleStyles: {
                fontWeight: "600",
                fontSize: "11px",
                marginTop: "12px",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.7)",
            },
        },
    };

    // ================== UTILITY FUNCTIONS ==================
    const Utils = {
        getRandomOffset() {
            return (
                Math.floor(
                    Math.random() *
                        (CONFIG.RANDOM_OFFSET_MAX -
                            CONFIG.RANDOM_OFFSET_MIN +
                            1)
                ) + CONFIG.RANDOM_OFFSET_MIN
            );
        },

        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },

        isTypingElement() {
            const activeElement = document.activeElement;
            if (!activeElement) return false;

            const tagName = (activeElement.tagName || "").toLowerCase();
            const isInputElement = ["input", "textarea", "select"].includes(
                tagName
            );
            return isInputElement || !!activeElement.isContentEditable;
        },

        findVisibleElement(selector) {
            return Array.from(document.querySelectorAll(selector)).find(
                ElementChecker.isVisible
            );
        },

        isNPCAttackPage() {
            return window.location.pathname.includes("/npcs/attack");
        },

        isQuestPage() {
            return window.location.pathname.includes("/quests");
        },

        hasIgnoredRarityItem() {
            const ignoredRarities = RarityManager.getIgnoredRarities();
            if (ignoredRarities.length === 0) return false;

            for (const rarity of ignoredRarities) {
                const selector = SELECTORS.RARITY_ITEMS[rarity.toUpperCase()];
                if (selector && document.querySelector(selector)) {
                    return true;
                }
            }
            return false;
        },

        isActionButtonNPC(element) {
            if (!element) return false;
            // Check if element or its parent matches NPC action selector
            return (
                element.matches(SELECTORS.NPC_ACTION) ||
                element.closest(SELECTORS.NPC_ACTION) !== null
            );
        },
    };

    // ================== ELEMENT CHECKER ==================
    const ElementChecker = {
        isVisible(element) {
            if (!element) return false;

            const styles = getComputedStyle(element);
            if (styles.visibility === "hidden" || styles.display === "none") {
                return false;
            }

            const rect = element.getBoundingClientRect();
            const viewportHeight =
                innerHeight || document.documentElement.clientHeight;
            const viewportWidth =
                innerWidth || document.documentElement.clientWidth;

            return (
                rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= viewportHeight &&
                rect.left <= viewportWidth
            );
        },

        isDisabled(element) {
            if (!element) return true;

            // Standard disabled checks
            if (element.disabled || element.hasAttribute("disabled"))
                return true;
            if (element.getAttribute("aria-disabled") === "true") return true;
            if (element.hasAttribute("inert")) return true;

            // Class-based disabled check
            const className = (element.className || "").toString();
            if (
                /(^|\s)(disabled|is-disabled|btn--disabled)(\s|$)/i.test(
                    className
                )
            ) {
                return true;
            }

            // Dataset-based disabled check
            if (element.dataset) {
                if (
                    element.dataset.disabled === "true" ||
                    element.dataset.state === "disabled"
                ) {
                    return true;
                }
            }

            return false;
        },
    };

    // ================== MOUSE EVENT DISPATCHER ==================
    const MouseEventDispatcher = {
        dispatchEvent(type, target, clientX, clientY) {
            const event = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX,
                clientY,
                screenX: window.screenX + clientX,
                screenY: window.screenY + clientY,
                button: 0,
                buttons: 1,
            });
            return target.dispatchEvent(event);
        },

        clickAt(element) {
            if (!element) return false;

            element.focus();
            const rect = element.getBoundingClientRect();
            const offsetX = Utils.getRandomOffset();
            const offsetY = Utils.getRandomOffset();

            const clientX = Utils.clamp(
                rect.left + offsetX,
                rect.left,
                rect.left + rect.width
            );
            const clientY = Utils.clamp(
                rect.top + offsetY,
                rect.top,
                rect.top + rect.height
            );

            this.dispatchEvent("pointerdown", element, clientX, clientY);
            this.dispatchEvent("mousedown", element, clientX, clientY);
            this.dispatchEvent("mouseup", element, clientX, clientY);
            return this.dispatchEvent("click", element, clientX, clientY);
        },
    };

    // ================== TARGET FINDER ==================
    const TargetFinder = {
        // Priority-based target finding
        find() {
            // Priority 1: Attack button
            const attack = Utils.findVisibleElement(SELECTORS.ATTACK);
            if (attack) return attack;

            // Don't auto-click generate button
            const generate = Utils.findVisibleElement(SELECTORS.GENERATE);
            if (generate) return null;

            // Check if there's an ignored rarity item
            const hasIgnoredItem = Utils.hasIgnoredRarityItem();

            // Priority 2: Gather button (skip if has ignored rarity)
            const gather = Utils.findVisibleElement(SELECTORS.GATHER);
            if (gather && !hasIgnoredItem) return gather;

            // Priority 3: Action button (skip if has ignored rarity or is NPC and ignored)
            const action = Utils.findVisibleElement(SELECTORS.ACTION_BUTTON);
            if (action && !hasIgnoredItem) {
                // Check if it's an NPC action and should be ignored
                const shouldIgnoreNPC =
                    NPCActionManager.isIgnored() &&
                    Utils.isActionButtonNPC(action);
                if (!shouldIgnoreNPC) {
                    return action;
                }
            }

            // Priority 4: Step button (fallback if gather/action has ignored rarity)
            const step = document.querySelector(SELECTORS.STEP_BUTTON);
            if (step && ElementChecker.isVisible(step)) return step;

            // Priority 4.5: Perform Expedition button
            const perform = Utils.findVisibleElement(SELECTORS.PERFORM);
            if (perform) return perform;

            if (Utils.isQuestPage()) return null;

            // Priority 5: Travel link
            const travel = Utils.findVisibleElement(SELECTORS.TRAVEL_LINK);
            if (travel) return travel;

            return null;
        },
    };

    // ================== STORAGE MANAGER ==================
    const StorageManager = {
        get(key, defaultValue = null) {
            try {
                return localStorage.getItem(key) || defaultValue;
            } catch (error) {
                console.error(
                    `Failed to read from localStorage: ${key}`,
                    error
                );
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (error) {
                console.error(`Failed to write to localStorage: ${key}`, error);
                alert(
                    `Error accessing localStorage. ${key} state cannot be persisted.`
                );
                return false;
            }
        },
    };

    // ================== NPC ACTION MANAGER ==================
    const NPCActionManager = {
        isIgnored() {
            const saved = StorageManager.get(CONFIG.IGNORE_NPC_ACTION_KEY);
            return saved === "on";
        },

        setIgnored(ignored) {
            StorageManager.set(
                CONFIG.IGNORE_NPC_ACTION_KEY,
                ignored ? "on" : "off"
            );
        },

        toggle() {
            this.setIgnored(!this.isIgnored());
        },
    };

    // ================== RARITY MANAGER ==================
    const RarityManager = {
        availableRarities: [
            "common",
            "uncommon",
            "rare",
            "elite",
            "epic",
            "legendary",
            "celestial",
        ],

        getIgnoredRarities() {
            const saved = StorageManager.get(CONFIG.IGNORE_RARITY_KEY);
            if (!saved) return [];
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error("Failed to parse ignored rarities:", error);
                return [];
            }
        },

        setIgnoredRarities(rarities) {
            try {
                const json = JSON.stringify(rarities);
                StorageManager.set(CONFIG.IGNORE_RARITY_KEY, json);
            } catch (error) {
                console.error("Failed to save ignored rarities:", error);
            }
        },

        isIgnored(rarity) {
            const ignored = this.getIgnoredRarities();
            return ignored.includes(rarity.toLowerCase());
        },

        toggleRarity(rarity) {
            const ignored = this.getIgnoredRarities();
            const rarityLower = rarity.toLowerCase();

            if (ignored.includes(rarityLower)) {
                const filtered = ignored.filter((r) => r !== rarityLower);
                this.setIgnoredRarities(filtered);
            } else {
                ignored.push(rarityLower);
                this.setIgnoredRarities(ignored);
            }
        },
    };

    // ================== KEYBOARD HANDLER ==================
    class KeyboardHandler {
        constructor() {
            this.retryCounter = 0;
            this.initialize();
        }

        initialize() {
            document.addEventListener(
                "keydown",
                (event) => this.handleKeydown(event),
                { passive: false }
            );
        }

        handleKeydown(event) {
            if (Utils.isTypingElement()) return;

            const isActionKey =
                event.code === "Space" ||
                event.code === "Enter" ||
                event.code === "NumpadEnter";

            if (!isActionKey) return;

            event.preventDefault();
            this.performAction();
        }

        performAction() {
            const target = TargetFinder.find();

            if (!target) {
                this.handleMissingTarget();
                return;
            }

            if (ElementChecker.isDisabled(target)) {
                this.handleDisabledTarget();
                return;
            }

            this.retryCounter = 0;
            MouseEventDispatcher.clickAt(target);
        }

        handleMissingTarget() {
            if (Utils.isQuestPage()) return;

            this.retryCounter++;
            if (this.retryCounter > CONFIG.RETRY_THRESHOLD) {
                location.href = "/travel";
            }
        }

        handleDisabledTarget() {
            this.retryCounter++;
            if (this.retryCounter > CONFIG.RETRY_THRESHOLD) {
                location.reload();
            }
        }

        static triggerEnterKeyEvent() {
            const keydownEvent = new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
            });

            // Set legacy properties for older browsers
            Object.defineProperty(keydownEvent, "keyCode", { get: () => 13 });
            Object.defineProperty(keydownEvent, "which", { get: () => 13 });

            document.dispatchEvent(keydownEvent);

            const keyupEvent = new KeyboardEvent("keyup", {
                key: "Enter",
                code: "Enter",
                bubbles: true,
                cancelable: true,
            });

            document.dispatchEvent(keyupEvent);
        }
    }

    // ================== UI MANAGER ==================
    class UIManager {
        constructor() {
            this.badge = null;
            this.toggleButton = null;
            this.autoGenerateContainer = null;
            this.autoGenerateCheckbox = null;
            this.actionSettingsBtn = null;
            this.actionSettingsModal = null;
        }

        initialize() {
            this.createBadge();
            this.createToggleButton();
            this.createActionSettings();
            if (Utils.isNPCAttackPage()) {
                this.createAutoGenerateCheckbox();
            }
        }

        createBadge() {
            const existing = document.getElementById(UI_CONFIG.BADGE.id);
            if (existing) {
                this.badge = existing;
                return;
            }

            this.badge = document.createElement("div");
            this.badge.id = UI_CONFIG.BADGE.id;
            this.badge.textContent = UI_CONFIG.BADGE.text;

            const styles = Object.entries(UI_CONFIG.BADGE.styles)
                .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                .join(";");

            this.badge.style.cssText = styles;
            document.body.appendChild(this.badge);
        }

        createToggleButton() {
            const existing = document.getElementById(UI_CONFIG.TOGGLE.id);
            if (existing) {
                this.toggleButton = existing;
                this.updateToggleButton();
                return;
            }

            this.toggleButton = document.createElement("button");
            this.toggleButton.id = UI_CONFIG.TOGGLE.id;
            this.toggleButton.type = "button";

            const styles = Object.entries(UI_CONFIG.TOGGLE.styles)
                .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                .join(";");

            this.toggleButton.style.cssText = styles;
            this.toggleButton.addEventListener("click", () =>
                this.handleToggleClick()
            );

            document.body.appendChild(this.toggleButton);
            this.updateToggleButton();
        }

        handleToggleClick() {
            if (autoActionManager.isRunning()) {
                autoActionManager.stop();
            } else {
                autoActionManager.start();
            }
            this.updateToggleButton();
        }

        updateToggleButton() {
            if (!this.toggleButton) return;

            const isRunning = autoActionManager.isRunning();

            this.toggleButton.textContent = isRunning
                ? UI_CONFIG.TOGGLE.textRunning
                : UI_CONFIG.TOGGLE.textStopped;

            this.toggleButton.style.background = isRunning
                ? UI_CONFIG.TOGGLE.colorRunning
                : UI_CONFIG.TOGGLE.colorStopped;

            this.toggleButton.title = isRunning
                ? UI_CONFIG.TOGGLE.titleRunning
                : UI_CONFIG.TOGGLE.titleStopped;
        }

        camelToKebab(str) {
            return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        }

        createAutoGenerateCheckbox() {
            const existing = document.getElementById(
                UI_CONFIG.AUTO_GENERATE.id
            );
            if (existing) {
                this.autoGenerateContainer = existing;
                this.autoGenerateCheckbox = existing.querySelector(
                    'input[type="checkbox"]'
                );
                return;
            }

            this.autoGenerateContainer = document.createElement("label");
            this.autoGenerateContainer.id = UI_CONFIG.AUTO_GENERATE.id;

            const styles = Object.entries(UI_CONFIG.AUTO_GENERATE.styles)
                .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                .join(";");

            this.autoGenerateContainer.style.cssText = styles;

            this.autoGenerateCheckbox = document.createElement("input");
            this.autoGenerateCheckbox.type = "checkbox";

            const checkboxStyles = Object.entries(
                UI_CONFIG.AUTO_GENERATE.checkboxStyles
            )
                .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                .join(";");

            this.autoGenerateCheckbox.style.cssText = checkboxStyles;

            const labelText = document.createElement("span");
            labelText.textContent = UI_CONFIG.AUTO_GENERATE.label;

            this.autoGenerateContainer.appendChild(this.autoGenerateCheckbox);
            this.autoGenerateContainer.appendChild(labelText);

            this.autoGenerateCheckbox.addEventListener("change", (e) => {
                if (e.target.checked) {
                    autoGenerateManager.start();
                } else {
                    autoGenerateManager.stop();
                }
            });

            document.body.appendChild(this.autoGenerateContainer);

            // Restore state
            const savedState = StorageManager.get(CONFIG.AUTO_GENERATE_KEY);
            if (savedState === "on") {
                this.autoGenerateCheckbox.checked = true;
                autoGenerateManager.start();
            }
        }

        createActionSettings() {
            // Create gear button
            const existingBtn = document.getElementById(
                UI_CONFIG.ACTION_SETTINGS.btnId
            );
            if (!existingBtn) {
                this.actionSettingsBtn = document.createElement("button");
                this.actionSettingsBtn.id = UI_CONFIG.ACTION_SETTINGS.btnId;
                this.actionSettingsBtn.type = "button";
                this.actionSettingsBtn.innerHTML = "&#9881;"; // Gear icon
                this.actionSettingsBtn.title =
                    "Action Settings (Ignore NPC & Gather Rarities)";

                const btnStyles = Object.entries(
                    UI_CONFIG.ACTION_SETTINGS.btnStyles
                )
                    .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                    .join(";");

                this.actionSettingsBtn.style.cssText = btnStyles;
                this.actionSettingsBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.toggleSettingsModal();
                });

                document.body.appendChild(this.actionSettingsBtn);
            } else {
                this.actionSettingsBtn = existingBtn;
            }

            // Create modal
            const existingModal = document.getElementById(
                UI_CONFIG.ACTION_SETTINGS.modalId
            );
            if (!existingModal) {
                this.actionSettingsModal = document.createElement("div");
                this.actionSettingsModal.id = UI_CONFIG.ACTION_SETTINGS.modalId;

                const modalStyles = Object.entries(
                    UI_CONFIG.ACTION_SETTINGS.modalStyles
                )
                    .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                    .join(";");

                this.actionSettingsModal.style.cssText = modalStyles;

                // Add title
                const title = document.createElement("div");
                title.textContent = "Action Settings";
                const titleStyles = Object.entries(
                    UI_CONFIG.ACTION_SETTINGS.titleStyles
                )
                    .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                    .join(";");
                title.style.cssText = titleStyles;
                this.actionSettingsModal.appendChild(title);

                // Add Ignore NPC Action checkbox
                const npcContainer = document.createElement("label");
                const containerStyles = Object.entries(
                    UI_CONFIG.ACTION_SETTINGS.checkboxContainerStyles
                )
                    .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                    .join(";");
                npcContainer.style.cssText = containerStyles;

                const npcCheckbox = document.createElement("input");
                npcCheckbox.type = "checkbox";
                npcCheckbox.checked = NPCActionManager.isIgnored();
                npcCheckbox.style.cursor = "pointer";

                npcCheckbox.addEventListener("change", (e) => {
                    NPCActionManager.setIgnored(e.target.checked);
                });

                const npcLabel = document.createElement("span");
                npcLabel.textContent = "Ignore NPC Action";
                npcLabel.style.cursor = "pointer";

                npcContainer.appendChild(npcCheckbox);
                npcContainer.appendChild(npcLabel);
                this.actionSettingsModal.appendChild(npcContainer);

                // Add section title for rarities
                const sectionTitle = document.createElement("div");
                sectionTitle.textContent = "Ignore Gather Rarities";
                const sectionTitleStyles = Object.entries(
                    UI_CONFIG.ACTION_SETTINGS.sectionTitleStyles
                )
                    .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
                    .join(";");
                sectionTitle.style.cssText = sectionTitleStyles;
                this.actionSettingsModal.appendChild(sectionTitle);

                // Add checkboxes for each rarity
                RarityManager.availableRarities.forEach((rarity) => {
                    const container = document.createElement("label");
                    const containerStyles = Object.entries(
                        UI_CONFIG.ACTION_SETTINGS.checkboxContainerStyles
                    )
                        .map(
                            ([key, value]) =>
                                `${this.camelToKebab(key)}:${value}`
                        )
                        .join(";");
                    container.style.cssText = containerStyles;

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.dataset.rarity = rarity;
                    checkbox.checked = RarityManager.isIgnored(rarity);
                    checkbox.style.cursor = "pointer";

                    checkbox.addEventListener("change", () => {
                        RarityManager.toggleRarity(rarity);
                    });

                    const label = document.createElement("span");
                    label.textContent =
                        rarity.charAt(0).toUpperCase() + rarity.slice(1);
                    label.style.cursor = "pointer";

                    container.appendChild(checkbox);
                    container.appendChild(label);
                    this.actionSettingsModal.appendChild(container);
                });

                document.body.appendChild(this.actionSettingsModal);

                // Close modal when clicking outside
                document.addEventListener("click", (e) => {
                    if (
                        this.actionSettingsModal &&
                        this.actionSettingsModal.style.display === "block" &&
                        !this.actionSettingsModal.contains(e.target) &&
                        !this.actionSettingsBtn.contains(e.target)
                    ) {
                        this.actionSettingsModal.style.display = "none";
                    }
                });
            } else {
                this.actionSettingsModal = existingModal;
            }
        }

        toggleSettingsModal() {
            if (!this.actionSettingsModal) return;

            const isVisible =
                this.actionSettingsModal.style.display === "block";
            this.actionSettingsModal.style.display = isVisible
                ? "none"
                : "block";
        }
    }

    // ================== CAPTCHA HANDLER ==================
    class CaptchaHandler {
        constructor() {
            this.verificationWindow = null;
            this.skipCheck = false;
            this.lastCaptchaTime = 0;
        }

        shouldSkipCheck() {
            if (!this.skipCheck) return false;

            const elapsed = Date.now() - this.lastCaptchaTime;
            return elapsed < CONFIG.CAPTCHA_SKIP_DURATION;
        }

        findCaptchaLink() {
            return Utils.findVisibleElement(SELECTORS.CAPTCHA_LINK);
        }

        handle() {
            if (this.shouldSkipCheck()) return true;

            this.skipCheck = false;
            const captchaLink = this.findCaptchaLink();

            if (!captchaLink) return true;

            if (this.verificationWindow && !this.verificationWindow.closed) {
                this.verificationWindow.focus();
                return false;
            }

            if (this.verificationWindow && this.verificationWindow.closed) {
                this.markAsResolved();
                return true;
            }

            this.openVerificationWindow(captchaLink.href);
            return false;
        }

        openVerificationWindow(url) {
            this.playAlertSound();

            const windowWidth = 600;
            const windowHeight = 600;
            const left = screen.width / 2 - windowWidth / 2;
            const top = screen.height / 2 - windowHeight / 2;

            const windowFeatures = `popup,width=${windowWidth},height=${windowHeight},left=${left},top=${top}`;

            this.verificationWindow = window.open(
                url,
                "verifWindow",
                windowFeatures
            );
            this.lastCaptchaTime = Date.now();
        }

        playAlertSound() {
            const audio = new Audio(CONFIG.ALERT_SOUND_URL);
            audio.play().catch((error) => {
                console.warn("Failed to play alert sound:", error);
            });
        }

        markAsResolved() {
            this.skipCheck = true;
            this.lastCaptchaTime = Date.now();
            this.verificationWindow = null;
        }

        checkIfResolved() {
            if (!this.verificationWindow || this.verificationWindow.closed) {
                return;
            }

            KeyboardHandler.triggerEnterKeyEvent();

            setTimeout(() => {
                const captchaLink = this.findCaptchaLink();
                if (!captchaLink) {
                    this.verificationWindow.close();
                    this.markAsResolved();
                }
            }, 1000);
        }

        isWindowOpen() {
            return this.verificationWindow && !this.verificationWindow.closed;
        }
    }

    // ================== WAKE LOCK MANAGER ==================
    class WakeLockManager {
        constructor() {
            this.wakeLock = null;
        }

        async acquire() {
            if (this.wakeLock) return;

            try {
                if (navigator.wakeLock) {
                    this.wakeLock = await navigator.wakeLock.request("screen");
                }
            } catch (error) {
                console.warn("Failed to acquire wake lock:", error);
            }
        }

        release() {
            if (!this.wakeLock) return;

            this.wakeLock.release().catch((error) => {
                console.warn("Failed to release wake lock:", error);
            });

            this.wakeLock = null;
        }
    }

    // ================== AUTO ACTION MANAGER ==================
    class AutoActionManager {
        constructor() {
            this.autoTimer = null;
            this.captchaCheckTimer = null;
            this.captchaHandler = new CaptchaHandler();
            this.wakeLockManager = new WakeLockManager();
        }

        isRunning() {
            return this.autoTimer !== null;
        }

        start() {
            if (this.isRunning()) return;

            StorageManager.set(CONFIG.STORAGE_KEY, "on");

            this.autoTimer = setInterval(
                () => this.executeAutoAction(),
                CONFIG.AUTO_INTERVAL
            );

            this.captchaCheckTimer = setInterval(
                () => this.captchaHandler.checkIfResolved(),
                CONFIG.CAPTCHA_CHECK_INTERVAL
            );

            this.wakeLockManager.acquire();
        }

        stop() {
            if (!this.isRunning()) return;

            clearInterval(this.autoTimer);
            clearInterval(this.captchaCheckTimer);

            this.autoTimer = null;
            this.captchaCheckTimer = null;

            StorageManager.set(CONFIG.STORAGE_KEY, "off");
            this.wakeLockManager.release();
        }

        executeAutoAction() {
            if (Utils.isTypingElement()) return;

            const canProceed = this.captchaHandler.handle();
            if (!canProceed) {
                if (this.captchaHandler.isWindowOpen()) {
                    this.wakeLockManager.release();
                }
                return;
            }

            this.wakeLockManager.acquire();
            KeyboardHandler.triggerEnterKeyEvent();
        }

        restoreState() {
            const savedState = StorageManager.get(CONFIG.STORAGE_KEY);
            if (savedState === "on") {
                this.start();
            }
        }
    }

    // ================== API CLIENT ==================
    const APIClient = {
        async getPlayerData() {
            try {
                const response = await fetch(CONFIG.API_URL);
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error("Failed to fetch player data:", error);
                return null;
            }
        },

        async getEnergy() {
            const data = await this.getPlayerData();
            return data?.energy ?? null;
        },
    };

    // ================== AUTO GENERATE MANAGER ==================
    class AutoGenerateManager {
        constructor() {
            this.timer = null;
            this.isActive = false;
        }

        isRunning() {
            return this.isActive;
        }

        async start() {
            if (this.isActive) return;
            if (!Utils.isNPCAttackPage()) return;

            this.isActive = true;
            StorageManager.set(CONFIG.AUTO_GENERATE_KEY, "on");
            this.scheduleNext();
        }

        stop() {
            if (!this.isActive) return;

            this.isActive = false;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            StorageManager.set(CONFIG.AUTO_GENERATE_KEY, "off");
        }

        scheduleNext() {
            if (!this.isActive) return;

            this.timer = setTimeout(async () => {
                await this.executeGenerate();
                this.scheduleNext();
            }, CONFIG.AUTO_GENERATE_INTERVAL);
        }

        async executeGenerate() {
            if (!this.isActive) return;

            const generateBtn = Utils.findVisibleElement(SELECTORS.GENERATE);
            if (!generateBtn || ElementChecker.isDisabled(generateBtn)) {
                return;
            }

            // Check energy first
            const energy = await APIClient.getEnergy();
            if (energy === null) {
                console.warn("Failed to get energy, skipping generate");
                return;
            }

            if (energy <= 0) {
                location.href = "/battle/arena";
                return;
            }

            MouseEventDispatcher.clickAt(generateBtn);
        }
    }

    // ================== BROWSER PERMISSION CHECKER ==================
    const BrowserPermissionChecker = {
        checkPopup() {
            const testWindow = window.open(
                "about:blank",
                "_blank",
                "width=1,height=1"
            );

            const isBlocked =
                testWindow === null ||
                typeof testWindow === "undefined" ||
                testWindow.closed;

            if (isBlocked) {
                return false;
            } else {
                testWindow.close();
                return true;
            }
        },

        checkAutoplay() {
            try {
                const audio = new Audio(CONFIG.ALERT_SOUND_URL);
                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Autoplay allowed, stop the audio
                            audio.pause();
                            audio.currentTime = 0;
                        })
                        .catch(() => {
                            // Autoplay blocked
                            return false;
                        });
                    return true;
                }
                return true;
            } catch (error) {
                console.warn("Failed to test autoplay:", error);
                return false;
            }
        },

        check() {
            const popupAllowed = this.checkPopup();
            const autoplayAllowed = this.checkAutoplay();

            const messages = [];
            if (!popupAllowed) {
                messages.push("Popups");
            }
            if (!autoplayAllowed) {
                messages.push("Autoplay");
            }

            if (messages.length > 0) {
                alert(
                    `Please allow ${messages.join(
                        " and "
                    )} for this site to use all features!\n\n` +
                        `- Popups: Required for auto captcha verification\n` +
                        `- Autoplay: Required for alert sounds`
                );
            } else {
                StorageManager.set(CONFIG.PERMISSION_TEST_KEY, "allowed");
            }
        },

        checkIfNeeded() {
            const hasBeenTested = StorageManager.get(
                CONFIG.PERMISSION_TEST_KEY
            );
            if (!hasBeenTested) {
                this.check();
            }
        },
    };

    // ================== INITIALIZATION ==================
    const keyboardHandler = new KeyboardHandler();
    const uiManager = new UIManager();
    const autoActionManager = new AutoActionManager();
    const autoGenerateManager = new AutoGenerateManager();

    function initialize() {
        uiManager.initialize();
        autoActionManager.restoreState();
        BrowserPermissionChecker.checkIfNeeded();
        uiManager.updateToggleButton();
    }

    initialize();
})();
