// ==UserScript==
// @name         Global Keyboard Hotkey + Crafting QoL for SMMO
// @namespace    https://github.com/dngda
// @version      2.0.2
// @description  Hotkeys for navigating Simple MMO: 'H' to go Home, 'T' to Town, 'I' to Inventory, 'B' to Battle Menu, 'Q' to Quests, etc.
// @author       @dngda
// @match        https://web.simple-mmo.com/*
// @exclude      https://web.simple-mmo.com/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simple-mmo.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554474/Global%20Keyboard%20Hotkey%20%2B%20Crafting%20QoL%20for%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/554474/Global%20Keyboard%20Hotkey%20%2B%20Crafting%20QoL%20for%20SMMO.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ================== CONSTANTS ==================
    const CONFIG = {
        API_URL: "https://web.simple-mmo.com/api/web-app",
        BASE_URL: "https://web.simple-mmo.com",
        STORAGE_KEYS: {
            CRAFTING_END_TIME: "tm_crafting_end_time",
            SAVED_INVENTORY_URL: "tm_saved_inv_url",
            SAVED_MARKET_URL: "tm_saved_market_url",
        },
        TRAVEL_WINDOW: {
            NAME: "travelWindow",
            WIDTH: 648,
        },
        CRAFTING_CHECK_INTERVAL: 1000,
        COUNTDOWN_UPDATE_INTERVAL: 1000,
    };

    const ROUTES = {
        HOME: "/home",
        TOWN: "/town",
        INVENTORY: "/inventory/items",
        STORAGE: "/inventory/storage",
        BATTLE_MENU: "/battle/menu",
        BATTLE_ARENA: "/battle/arena",
        QUESTS: "/quests",
        CHARACTER: "/character",
        PROFESSION: "/profession",
        CRAFTING_MENU: "/crafting/menu",
        TASKS: "/tasks/viewall",
        MARKET: "/market/listings?type[]=",
        EVENTS: "/events",
        TRAVEL_PARTY: "/travel/party",
        TRAVEL: "/travel",
    };

    const HOTKEYS = {
        H: { route: ROUTES.HOME, name: "Home" },
        T: { route: ROUTES.TOWN, name: "Town" },
        I: { route: ROUTES.INVENTORY, name: "Inventory" },
        B: { route: ROUTES.BATTLE_MENU, name: "Battle Menu" },
        Q: { route: ROUTES.QUESTS, name: "Quests" },
        X: { route: ROUTES.CHARACTER, name: "Character" },
        F: { route: ROUTES.PROFESSION, name: "Profession" },
        R: { route: ROUTES.CRAFTING_MENU, name: "Crafting" },
        K: { route: ROUTES.TASKS, name: "Tasks" },
        M: { route: ROUTES.MARKET, name: "Market" },
        E: { route: ROUTES.EVENTS, name: "Events" },
    };

    const NON_TYPING_INPUT_TYPES = [
        "button",
        "checkbox",
        "radio",
        "submit",
        "reset",
        "hidden",
        "image",
    ];

    // ================== UTILITY FUNCTIONS ==================
    const Utils = {
        isTypingElement() {
            const activeElement = document.activeElement;
            if (!activeElement) return false;

            const tagName = (activeElement.tagName || "").toLowerCase();
            const inputType = (activeElement.type || "").toLowerCase();

            if (
                tagName === "input" &&
                NON_TYPING_INPUT_TYPES.includes(inputType)
            ) {
                return false;
            }

            return (
                ["input", "textarea", "select"].includes(tagName) ||
                !!activeElement.isContentEditable
            );
        },

        isVisible(element) {
            if (!element) return false;

            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();

            return (
                styles.display !== "none" &&
                styles.visibility !== "hidden" &&
                rect.width > 0 &&
                rect.height > 0
            );
        },

        findVisibleElement(selector) {
            return Array.from(document.querySelectorAll(selector)).find(
                this.isVisible
            );
        },

        getUserIdFromDOM() {
            const collectionLink = document.querySelector(
                "a[href*=collection]"
            );
            if (!collectionLink) return null;

            const href = collectionLink.getAttribute("href");
            return href ? href.split("/")[2] : null;
        },

        parseTimeString(timeString) {
            const match = timeString.match(/(\d+)d\s+(\d+)h\s+(\d+)m\s+(\d+)s/);
            if (!match) return null;

            const [, days, hours, minutes, seconds] = match.map(Number);
            return days * 86400 + hours * 3600 + minutes * 60 + seconds;
        },

        formatCountdown(seconds) {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            if (hours > 0) {
                return `${hours}:${mins < 10 ? "0" : ""}${mins}:${
                    secs < 10 ? "0" : ""
                }${secs}`;
            }
            return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
                alert(`Error accessing localStorage. ${key} cannot be saved.`);
                return false;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(
                    `Failed to remove from localStorage: ${key}`,
                    error
                );
                return false;
            }
        },
    };

    // ================== API CLIENT ==================
    class APIClient {
        static async fetchUserData() {
            try {
                const response = await fetch(CONFIG.API_URL);
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                return null;
            }
        }
    }

    // ================== USER DATA MANAGER ==================
    class UserDataManager {
        constructor() {
            this.userData = {};
        }

        async refresh() {
            const data = await APIClient.fetchUserData();
            if (data) {
                this.userData = data;
                this.updateUI();
            }
            return data;
        }

        getUserId() {
            return this.userData.id || Utils.getUserIdFromDOM();
        }

        updateUI() {
            this.updateInfoBadge();
            this.updateTimeBadge();
        }

        updateInfoBadge() {
            const badge = document.getElementById("info-badge");
            if (!badge || !this.userData.energy) return;

            badge.innerHTML = `EP <span class="text-indigo-600 font-semibold">${this.userData.energy}</span><span class="text-gray-600">/${this.userData.max_energy}</span>
                 &emsp; QP <span class="text-indigo-600 font-semibold">${this.userData.quest_points}</span><span class="text-gray-600">/${this.userData.max_quest_points}</span>`;
        }

        updateTimeBadge() {
            const badge = document.getElementById("time-badge");
            if (!badge || !this.userData.server_time) return;

            badge.innerHTML = this.userData.server_time;
        }
    }

    // ================== HOTKEY MANAGER ==================
    class HotkeyManager {
        constructor(userDataManager) {
            this.userDataManager = userDataManager;
            this.initialize();
        }

        initialize() {
            document.addEventListener("keydown", (e) => this.handleKeydown(e), {
                passive: false,
            });
        }

        handleKeydown(event) {
            if (Utils.isTypingElement()) return;

            const isSingleKey =
                !event.shiftKey &&
                !event.ctrlKey &&
                !event.altKey &&
                !event.metaKey;

            // Single key navigation
            if (isSingleKey) {
                this.handleSingleKeyNavigation(event);
            }

            // Shift + key combinations
            if (event.shiftKey) {
                this.handleShiftKeyNavigation(event);
            }
        }

        handleSingleKeyNavigation(event) {
            const keyCode = event.code.replace("Key", "");
            const hotkey = HOTKEYS[keyCode];

            if (hotkey) {
                event.preventDefault();
                this.navigate(hotkey.route);
                return;
            }

            // Special cases
            if (event.code === "KeyP") {
                event.preventDefault();
                const userId = this.userDataManager.getUserId();
                this.navigate(`/user/view/${userId}`);
            } else if (event.code === "KeyL") {
                event.preventDefault();
                const userId = this.userDataManager.getUserId();
                this.navigate(`${ROUTES.MARKET}&user_id=${userId}`);
            }
        }

        handleShiftKeyNavigation(event) {
            if (event.code === "KeyI") {
                event.preventDefault();
                const savedUrl = StorageManager.get(
                    CONFIG.STORAGE_KEYS.SAVED_INVENTORY_URL
                );
                this.navigate(savedUrl || ROUTES.INVENTORY);
            } else if (event.code === "KeyM") {
                event.preventDefault();
                const savedUrl = StorageManager.get(
                    CONFIG.STORAGE_KEYS.SAVED_MARKET_URL
                );
                this.navigate(savedUrl || ROUTES.MARKET);
            } else if (event.code === "KeyS") {
                event.preventDefault();
                this.navigate(ROUTES.STORAGE);
            } else if (event.code === "KeyB") {
                event.preventDefault();
                this.navigate(ROUTES.BATTLE_ARENA);
            } else if (event.code === "KeyP") {
                event.preventDefault();
                this.navigate(ROUTES.TRAVEL_PARTY);
            } else if (event.code === "Slash") {
                event.preventDefault();
                this.openMiniTravelWindow();
            }
        }

        navigate(path) {
            location.href = path;
        }

        openMiniTravelWindow() {
            const windowName = CONFIG.TRAVEL_WINDOW.NAME;
            const width = CONFIG.TRAVEL_WINDOW.WIDTH;
            const fullHeight = window.innerHeight;
            const left = screen.width - width;
            const windowFeatures = `popup,width=${width},height=${fullHeight},left=${left}`;

            // Try to focus existing window
            try {
                if (window.travelWindowRef && !window.travelWindowRef.closed) {
                    if (
                        window.travelWindowRef.location.href.includes("/travel")
                    ) {
                        window.travelWindowRef.focus();
                        return;
                    }
                }
            } catch (error) {
                // Cross-origin or reference lost
            }

            // Open or reuse window
            window.travelWindowRef = window.open(
                "",
                windowName,
                windowFeatures
            );

            if (window.travelWindowRef) {
                try {
                    if (
                        !window.travelWindowRef.location.href.includes(
                            ROUTES.TRAVEL
                        )
                    ) {
                        window.travelWindowRef.location.href = `${CONFIG.BASE_URL}${ROUTES.TRAVEL}`;
                    }
                } catch (error) {
                    window.travelWindowRef.location.href = `${CONFIG.BASE_URL}${ROUTES.TRAVEL}`;
                }
                window.travelWindowRef.focus();
            }
        }
    }

    // ================== CRAFTING MANAGER ==================
    class CraftingManager {
        constructor() {
            this.isObserving = false;
        }

        saveEndTime(progressText) {
            const totalSeconds = Utils.parseTimeString(progressText);
            if (!totalSeconds) return;

            const endTime = Date.now() + totalSeconds * 1000;
            StorageManager.set(
                CONFIG.STORAGE_KEYS.CRAFTING_END_TIME,
                endTime.toString()
            );
            console.log("Crafting time saved:", totalSeconds, "seconds");

            this.displayCountdown();
        }

        displayCountdown() {
            const craftBtn = Utils.findVisibleElement(
                "a[href*='/crafting/menu']"
            );
            if (!craftBtn) return;

            // Remove old countdown
            const oldCountdown = document.getElementById("crafting-countdown");
            if (oldCountdown) oldCountdown.remove();

            const countdown = document.createElement("div");
            countdown.id = "crafting-countdown";
            countdown.style.cssText = [
                "margin-left:8px",
                "font-size:12px",
                "color:black",
                "background:#1CBB1C",
                "padding:2px 6px",
                "border-radius:9999px",
                "opacity:.9",
            ].join(";");
            countdown.textContent = "Ready!";

            if (craftBtn.children[1]) {
                craftBtn.children[1].after(countdown);
            } else {
                craftBtn.appendChild(countdown);
            }

            const savedEndTime = StorageManager.get(
                CONFIG.STORAGE_KEYS.CRAFTING_END_TIME
            );
            if (!savedEndTime) return;

            const endTime = parseInt(savedEndTime, 10);
            const now = Date.now();

            if (now >= endTime) {
                StorageManager.remove(CONFIG.STORAGE_KEYS.CRAFTING_END_TIME);
                return;
            }

            this.startCountdown(countdown, endTime);
        }

        startCountdown(element, endTime) {
            const update = () => {
                const remaining = Math.floor((endTime - Date.now()) / 1000);

                if (remaining <= 0) {
                    element.textContent = "Ready!";
                    element.style.background = "#1CBB1C";
                    StorageManager.remove(
                        CONFIG.STORAGE_KEYS.CRAFTING_END_TIME
                    );
                    return;
                }

                element.style.background = "#c8c816ff";
                element.textContent = Utils.formatCountdown(remaining);

                setTimeout(update, CONFIG.COUNTDOWN_UPDATE_INTERVAL);
            };

            update();
        }

        startObserver() {
            if (location.pathname !== ROUTES.CRAFTING_MENU) return;
            if (this.isObserving) return;

            this.isObserving = true;

            const checkProgress = () => {
                if (!this.isObserving) return;

                const progressEl = document.querySelector(
                    'div[x-text="current_crafting_session.progress_text"]'
                );

                if (progressEl && progressEl.textContent) {
                    const text = progressEl.textContent.trim();
                    if (text.match(/\d+d\s+\d+h\s+\d+m\s+\d+s/)) {
                        this.saveEndTime(text);
                        this.isObserving = false;
                    }
                }
            };

            setInterval(checkProgress, CONFIG.CRAFTING_CHECK_INTERVAL);
        }
    }

    // ================== UI ELEMENT FACTORY ==================
    class UIElementFactory {
        static create(config) {
            const {
                id,
                tag = "div",
                content = "",
                styles = {},
                events = {},
                checkExisting = true,
            } = config;

            if (checkExisting && id) {
                const existing = document.getElementById(id);
                if (existing) return existing;
            }

            const element = document.createElement(tag);
            if (id) element.id = id;

            this.applyStyles(element, styles);
            this.setContent(element, content);
            this.attachEvents(element, events);

            document.body.appendChild(element);
            return element;
        }

        static applyStyles(element, styles) {
            const styleString = Object.entries(styles)
                .map(([key, value]) => `${key}:${value}`)
                .join(";");
            element.style.cssText = styleString;
        }

        static setContent(element, content) {
            if (!content) return;

            if (content.includes("<")) {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }
        }

        static attachEvents(element, events) {
            Object.entries(events).forEach(([eventName, handler]) => {
                element.addEventListener(eventName, handler);
            });
        }
    }

    // ================== UI MANAGER ==================
    class UIManager {
        constructor() {
            this.badges = {};
        }

        initialize() {
            if (this.shouldShowUI()) {
                this.createHotkeyHints();
                this.createInfoBadges();
                this.createSaveInventoryButton();
                this.createSaveMarketButton();
            }
        }

        shouldShowUI() {
            return (
                !location.pathname.includes("/travel") &&
                !location.pathname.includes("/gather")
            );
        }

        createHotkeyHints() {
            this.addHint("a[href='/home']", "H");
            this.addHint("a[href='/town']", "T");
            this.addHint("a[href*='/inventory']", "I");
            this.addHint("a[href*='/battle/menu']", "B");
            this.addHint("a[href*='/quests']", "Q");
            this.addHint("a[href*='/character']", "X");
            this.addHint("a[href*='/profession']", "F");
            this.addHint("a[href*='/crafting/menu']", "R");
            this.addHint("a[href*='/tasks/viewall']", "K");

            this.createHotkeyBadge();
        }

        addHint(selector, text) {
            const element = Utils.findVisibleElement(selector);
            if (!element) return;

            const kbd = document.createElement("kbd");
            kbd.style.marginLeft = "auto";
            kbd.style.color = "yellow";
            kbd.textContent = text;
            element.appendChild(kbd);
        }

        createHotkeyBadge() {
            const badge = UIElementFactory.create({
                id: "hotkey-badge",
                content: "Hover for other Hotkeys ⓘ",
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "8px",
                    "z-index": "1001",
                    background: "#4f46e5",
                    color: "#fff",
                    padding: "6px 8px",
                    "font-size": "12px",
                    "border-radius": "6px",
                    opacity: ".9",
                    "font-family": "sans-serif",
                    cursor: "help",
                },
            });

            const tooltip = UIElementFactory.create({
                id: "hotkey-tooltip",
                content: [
                    "Other Hotkeys:",
                    "[P] Profile",
                    "[M] Market",
                    "[L] My Listings",
                    "[E] Notifications",
                    "[Shift+P] Travel Party",
                    "[Shift+B] Battle Arena",
                    "[Shift+I] Inventory Saved URL",
                    "[Shift+M] Market Saved URL",
                    "[Shift+S] Inventory > Storage",
                    "[Shift+/] Mini Travel Window",
                ].join("\n"),
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "44px",
                    "z-index": "1005",
                    background: "#1f2937",
                    color: "#fff",
                    padding: "12px",
                    "font-size": "11px",
                    "border-radius": "6px",
                    "font-family": "monospace",
                    "line-height": "1.6",
                    display: "none",
                    "white-space": "pre",
                    "box-shadow": "0 4px 6px rgba(0,0,0,0.3)",
                },
            });

            badge.addEventListener("mouseenter", () => {
                tooltip.style.display = "block";
            });

            badge.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        }

        createInfoBadges() {
            this.badges.info = UIElementFactory.create({
                id: "info-badge",
                content: "Fetching...",
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "44px",
                    "z-index": "1001",
                    background: "#2a261fff",
                    color: "#fff",
                    padding: "6px 8px",
                    "font-size": "12px",
                    "border-radius": "6px",
                    opacity: ".9",
                    "font-family": "sans-serif",
                    cursor: "help",
                },
            });

            this.badges.time = UIElementFactory.create({
                id: "time-badge",
                content: "...",
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "80px",
                    "z-index": "1001",
                    background: "#2a261fff",
                    color: "#fff",
                    padding: "6px 8px",
                    "font-size": "12px",
                    "border-radius": "6px",
                    opacity: ".9",
                    "font-family": "sans-serif",
                    cursor: "help",
                },
            });

            this.badges.time.title = "Server Time";
        }

        createSaveInventoryButton() {
            if (!location.pathname.includes("/inventory")) return;

            UIElementFactory.create({
                id: "save-inventory-btn",
                tag: "button",
                content: "Save Inv URL",
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "116px",
                    "z-index": "1001",
                    background: "#058e60ff",
                    color: "#fff",
                    padding: "6px 8px",
                    "font-size": "12px",
                    "border-radius": "6px",
                    border: "none",
                    cursor: "pointer",
                    "font-family": "sans-serif",
                    "font-weight": "500",
                    transition: "background 0.2s",
                },
                events: {
                    mouseenter: (e) => {
                        e.target.style.background = "#046e4bff";
                    },
                    mouseleave: (e) => {
                        e.target.style.background = "#058e60ff";
                    },
                    click: (e) => {
                        const currentUrl = location.pathname + location.search;
                        StorageManager.set(
                            CONFIG.STORAGE_KEYS.SAVED_INVENTORY_URL,
                            currentUrl
                        );

                        const originalText = e.target.textContent;
                        e.target.textContent = "✓ Saved!";
                        e.target.style.background = "#6366f1";

                        setTimeout(() => {
                            e.target.textContent = originalText;
                            e.target.style.background = "#058e60ff";
                        }, 1500);
                    },
                },
            });
        }

        createSaveMarketButton() {
            if (!location.pathname.includes("/market")) return;

            UIElementFactory.create({
                id: "save-market-btn",
                tag: "button",
                content: "Save Market URL",
                styles: {
                    position: "fixed",
                    left: "8px",
                    bottom: "116px",
                    "z-index": "1001",
                    background: "#bb7908ff",
                    color: "#fff",
                    padding: "6px 8px",
                    "font-size": "12px",
                    "border-radius": "6px",
                    border: "none",
                    cursor: "pointer",
                    "font-family": "sans-serif",
                    "font-weight": "500",
                    transition: "background 0.2s",
                },
                events: {
                    mouseenter: (e) => {
                        e.target.style.background = "#8f5c04ff";
                    },
                    mouseleave: (e) => {
                        e.target.style.background = "#bb7908ff";
                    },
                    click: (e) => {
                        const currentUrl = location.pathname + location.search;
                        StorageManager.set(
                            CONFIG.STORAGE_KEYS.SAVED_MARKET_URL,
                            currentUrl
                        );

                        const originalText = e.target.textContent;
                        e.target.textContent = "✓ Saved!";
                        e.target.style.background = "#6366f1";

                        setTimeout(() => {
                            e.target.textContent = originalText;
                            e.target.style.background = "#bb7908ff";
                        }, 1500);
                    },
                },
            });
        }
    }

    // ================== INITIALIZATION ==================
    const userDataManager = new UserDataManager();
    const hotkeyManager = new HotkeyManager(userDataManager);
    const craftingManager = new CraftingManager();
    const uiManager = new UIManager();

    async function initialize() {
        uiManager.initialize();

        if (uiManager.shouldShowUI()) {
            await userDataManager.refresh();
        }

        craftingManager.startObserver();
        craftingManager.displayCountdown();
    }

    initialize();
})();
