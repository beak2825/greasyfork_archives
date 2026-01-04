// ==UserScript==
// @name         Market Bulk Buy & Remove With Toggle in SMMO
// @namespace    https://github.com/dngda
// @version      2.0.2
// @description  Adds toggle switches next to Buy and Remove buttons in Simple MMO market for bulk operations. Select items and use the panels to execute purchases or removals with optional delay.
// @author       @dngda
// @match        https://web.simple-mmo.com/market*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simple-mmo.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/555585/Market%20Bulk%20Buy%20%20Remove%20With%20Toggle%20in%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/555585/Market%20Bulk%20Buy%20%20Remove%20With%20Toggle%20in%20SMMO.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ========================================
    // Constants
    // ========================================
    const CONSTANTS = {
        ACTIONS: {
            BUY: "buy",
            REMOVE: "remove",
        },
        SELECTORS: {
            LISTING_ROW: "tr[id^='listing-']",
            BUTTON: "button[type='button']",
            TOGGLE_ATTRIBUTE: "data-bb-toggle",
        },
        TOGGLE_COLORS: {
            BUY: "bg-indigo-600",
            REMOVE: "bg-indigo-600",
            OFF: "bg-gray-200",
        },
        BUTTON_STATES: {
            START: {
                text: "Start",
                bg: "#10b981",
                border: "#059669",
                color: "#052014",
            },
            STOP: {
                text: "Stop",
                bg: "#b91c1c",
                border: "#7f1d1d",
                color: "#fff",
            },
        },
        SHORTCUTS: {
            BUY: { ctrl: true, alt: true, key: "b" },
            REMOVE: { ctrl: true, alt: true, key: "r" },
        },
        API: {
            BUY: "/api/market/buy/",
            REMOVE: "/api/market/remove/",
        },
        PANEL_POSITION: {
            BUY: { right: "16px", bottom: "16px" },
            REMOVE: { right: "250px", bottom: "16px" },
        },
        STORAGE: {
            VISIBILITY_KEY: "tm_market_bulk_visibility",
        },
    };

    // ========================================
    // State Management
    // ========================================
    const state = {
        buy: {
            selectedIds: new Set(),
            isRunning: false,
            abortFlag: false,
        },
        remove: {
            selectedIds: new Set(),
            isRunning: false,
            abortFlag: false,
        },
    };

    // ========================================
    // Utility Functions
    // ========================================
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getActionAttribute = (button) =>
        button.getAttribute("x-on:click") ||
        button.getAttribute("x-on\\:click") ||
        "";

    const hasAction = (button, action) => {
        if (!(button instanceof HTMLElement)) return false;
        return new RegExp(`itemAction\\s*=\\s*['"]${action}['"]`).test(
            getActionAttribute(button)
        );
    };

    const getListingId = (button) => {
        const row = button.closest(CONSTANTS.SELECTORS.LISTING_ROW);
        if (!row) return null;
        return row.id.replace("listing-", "").trim() || null;
    };

    const removeListingRow = (listingId) => {
        const row = $(`#listing-${listingId}`);
        row?.parentElement?.removeChild(row);
    };

    // ========================================
    // Toggle Switch Component
    // ========================================
    class ToggleSwitch {
        constructor(listingId, action) {
            this.listingId = listingId;
            this.action = action;
            this.element = this.createElement();
        }

        createElement() {
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.setAttribute("aria-pressed", "false");
            toggle.className =
                "ml-2 inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-200";
            toggle.dataset.bbToggle = "1";

            const thumb = document.createElement("span");
            thumb.className =
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0";
            toggle.appendChild(thumb);

            toggle.addEventListener("click", () => this.handleClick());

            return toggle;
        }

        handleClick() {
            const isOn = this.element.getAttribute("aria-pressed") !== "true";
            this.setState(isOn);

            const stateKey = this.action;
            if (isOn) {
                state[stateKey].selectedIds.add(this.listingId);
            } else {
                state[stateKey].selectedIds.delete(this.listingId);
            }

            PanelManager.updateCount(this.action);
        }

        setState(isOn) {
            this.element.setAttribute("aria-pressed", isOn ? "true" : "false");
            const thumb = this.element.firstChild;
            const colorClass =
                this.action === CONSTANTS.ACTIONS.BUY
                    ? CONSTANTS.TOGGLE_COLORS.BUY
                    : CONSTANTS.TOGGLE_COLORS.REMOVE;

            this.element.classList.toggle(CONSTANTS.TOGGLE_COLORS.OFF, !isOn);
            this.element.classList.toggle(colorClass, isOn);
            thumb.classList.toggle("translate-x-0", !isOn);
            thumb.classList.toggle("translate-x-5", isOn);
        }
    }

    // ========================================
    // Toggle Manager
    // ========================================
    const ToggleManager = {
        attachToggle(button, action) {
            if (button.nextElementSibling?.dataset?.bbToggle === "1") {
                return;
            }

            const listingId = getListingId(button);
            if (!listingId) return;

            const toggle = new ToggleSwitch(listingId, action);
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";

            const clonedButton = button.cloneNode(true);
            container.appendChild(clonedButton);
            container.appendChild(toggle.element);

            button.parentElement.replaceChild(container, button);
        },

        scanAndAttach() {
            $$(CONSTANTS.SELECTORS.BUTTON).forEach((button) => {
                if (hasAction(button, CONSTANTS.ACTIONS.BUY)) {
                    this.attachToggle(button, CONSTANTS.ACTIONS.BUY);
                }
                if (hasAction(button, CONSTANTS.ACTIONS.REMOVE)) {
                    this.attachToggle(button, CONSTANTS.ACTIONS.REMOVE);
                }
            });
        },

        selectAll(action) {
            $$(CONSTANTS.SELECTORS.BUTTON).forEach((button) => {
                if (hasAction(button, action)) {
                    const listingId = getListingId(button);
                    if (
                        listingId &&
                        !state[action].selectedIds.has(listingId)
                    ) {
                        const container = button.parentElement;
                        const toggle = container?.querySelector(
                            `[${CONSTANTS.SELECTORS.TOGGLE_ATTRIBUTE}="1"]`
                        );
                        if (toggle?.getAttribute("aria-pressed") === "false") {
                            toggle.click();
                        }
                    }
                }
            });
        },
    };

    // ========================================
    // Panel Component
    // ========================================
    class ControlPanel {
        constructor(action, title, panelId, position) {
            this.action = action;
            this.title = title;
            this.panelId = panelId;
            this.position = position;
            this.elements = {};
            this.create();
        }

        create() {
            if ($(`#${this.panelId}`)) return;

            const panel = document.createElement("div");
            panel.id = this.panelId;
            Object.assign(panel.style, {
                position: "fixed",
                right: this.position.right,
                bottom: this.position.bottom,
                zIndex: "999999",
                padding: "12px",
                borderRadius: "12px",
                width: "220px",
                background: "#111827",
                color: "#e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,.35)",
                fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial',
            });

            panel.innerHTML = this.getTemplate();
            document.body.appendChild(panel);

            this.elements = {
                panel,
                count: $(`#${this.panelId}-count`, panel),
                toggle: $(`#${this.panelId}-toggle`, panel),
                selectAll: $(`#${this.panelId}-select-all`, panel),
                delay: $(`#${this.panelId}-delay`, panel),
                success: $(`#${this.panelId}-ok`, panel),
                fail: $(`#${this.panelId}-fail`, panel),
            };

            this.attachEventListeners();
        }

        getTemplate() {
            return `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <strong>${this.title}</strong>
                    <span id="${this.panelId}-count" style="font-size:12px;color:#9ca3af;">0 selected</span>
                </div>
                <div style="margin-bottom:8px;">
                    <button id="${this.panelId}-select-all" style="width:100%;padding:4px 8px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#e5e7eb;cursor:pointer;font-size:11px;">Select All</button>
                </div>
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <label for="${this.panelId}-delay" style="font-size:12px;color:#9ca3af;">Delay</label>
                    <input id="${this.panelId}-delay" type="number" min="0" step="50" value="100" placeholder="Delay (ms)"
                        style="flex:1;padding:6px 8px;border-radius:8px;border:1px solid #374151;background:#0b1220;color:#e5e7eb;font-size:12px;width:50px;" />
                    <button id="${this.panelId}-toggle" style="padding:4px 12px;border:1px solid #059669;border-radius:10px;background:#10b981;color:#052014;font-weight:700;cursor:pointer;font-size:12px;">Start</button>
                </div>
                <div style="margin-top:8px;font-size:12px;color:#9ca3af;display:flex;justify-content:space-between;">
                    <div>Success: <b id="${this.panelId}-ok">0</b></div>
                    <div>Failed: <b id="${this.panelId}-fail">0</b></div>
                </div>
            `;
        }

        attachEventListeners() {
            this.elements.toggle.addEventListener("click", () =>
                this.handleToggle()
            );
            this.elements.selectAll.addEventListener("click", () =>
                this.handleSelectAll()
            );
        }

        handleToggle() {
            if (state[this.action].isRunning) {
                state[this.action].abortFlag = true;
            } else {
                BulkOperationManager.execute(this.action, this);
            }
        }

        handleSelectAll() {
            ToggleManager.selectAll(this.action);
        }

        updateCount() {
            const count = state[this.action].selectedIds.size;
            this.elements.count.textContent = `${count} selected`;
        }

        setButtonState(isRunning) {
            const buttonState = isRunning
                ? CONSTANTS.BUTTON_STATES.STOP
                : CONSTANTS.BUTTON_STATES.START;

            this.elements.toggle.textContent = buttonState.text;
            this.elements.toggle.style.background = buttonState.bg;
            this.elements.toggle.style.borderColor = buttonState.border;
            this.elements.toggle.style.color = buttonState.color;
        }

        resetCounters() {
            this.elements.success.textContent = "0";
            this.elements.fail.textContent = "0";
        }

        updateCounters(success, fail) {
            this.elements.success.textContent = String(success);
            this.elements.fail.textContent = String(fail);
        }

        getDelay() {
            return Math.max(0, Number(this.elements.delay.value) || 0);
        }
    }

    // ========================================
    // Panel Manager
    // ========================================
    const PanelManager = {
        panels: {},

        init() {
            this.panels.buy = new ControlPanel(
                CONSTANTS.ACTIONS.BUY,
                "Bulk Buy",
                "bbx-bulk-panel",
                CONSTANTS.PANEL_POSITION.BUY
            );

            this.panels.remove = new ControlPanel(
                CONSTANTS.ACTIONS.REMOVE,
                "Bulk Remove",
                "bbx-bulk-remove-panel",
                CONSTANTS.PANEL_POSITION.REMOVE
            );
        },

        updateCount(action) {
            this.panels[action]?.updateCount();
        },

        getPanel(action) {
            return this.panels[action];
        },
    };

    // ========================================
    // Bulk Operation Manager
    // ========================================
    const BulkOperationManager = {
        async execute(action, panel) {
            state[action].abortFlag = false;
            state[action].isRunning = true;

            panel.setButtonState(true);
            panel.resetCounters();

            let success = 0;
            let failed = 0;
            const delay = panel.getDelay();
            const ids = Array.from(state[action].selectedIds);

            for (const id of ids) {
                if (state[action].abortFlag) break;

                const result = await this.processItem(action, id);

                if (result.success) {
                    success++;
                    removeListingRow(id);
                    state[action].selectedIds.delete(id);
                } else {
                    failed++;
                }

                panel.updateCounters(success, failed);
                panel.updateCount();

                if (delay > 0) {
                    await sleep(delay);
                }
            }

            state[action].isRunning = false;
            panel.setButtonState(false);
        },

        async processItem(action, id) {
            try {
                const endpoint =
                    action === CONSTANTS.ACTIONS.BUY
                        ? CONSTANTS.API.BUY
                        : CONSTANTS.API.REMOVE;

                const response = await fetch(`${endpoint}${id}`, {
                    method: "POST",
                });

                let data = null;
                try {
                    data = await response.json();
                } catch {
                    // Ignore JSON parse errors
                }

                return { success: data?.type === "success" };
            } catch (error) {
                console.error(
                    `Error processing ${action} for id ${id}:`,
                    error
                );
                return { success: false };
            }
        },
    };

    // ========================================
    // Keyboard Shortcuts
    // ========================================
    const KeyboardShortcuts = {
        init() {
            window.addEventListener("keydown", (event) =>
                this.handleKeydown(event)
            );
        },

        handleKeydown(event) {
            Object.entries(CONSTANTS.SHORTCUTS).forEach(
                ([action, shortcut]) => {
                    if (
                        event.ctrlKey === shortcut.ctrl &&
                        event.altKey === shortcut.alt &&
                        event.key.toLowerCase() === shortcut.key.toLowerCase()
                    ) {
                        event.preventDefault();
                        const panel = PanelManager.getPanel(
                            action.toLowerCase()
                        );
                        panel?.elements.toggle.click();
                    }
                }
            );
        },
    };

    // ========================================
    // DOM Observer
    // ========================================
    const DOMObserver = {
        init() {
            const observer = new MutationObserver((mutations) =>
                this.handleMutations(mutations)
            );

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        },

        handleMutations(mutations) {
            let hasNewButtons = false;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    $$(CONSTANTS.SELECTORS.BUTTON, node).forEach((button) => {
                        if (
                            hasAction(button, CONSTANTS.ACTIONS.BUY) ||
                            hasAction(button, CONSTANTS.ACTIONS.REMOVE)
                        ) {
                            const action = hasAction(
                                button,
                                CONSTANTS.ACTIONS.BUY
                            )
                                ? CONSTANTS.ACTIONS.BUY
                                : CONSTANTS.ACTIONS.REMOVE;
                            ToggleManager.attachToggle(button, action);
                            hasNewButtons = true;
                        }
                    });
                });
            });

            if (hasNewButtons) {
                PanelManager.updateCount(CONSTANTS.ACTIONS.BUY);
                PanelManager.updateCount(CONSTANTS.ACTIONS.REMOVE);
            }
        },
    };

    // ========================================
    // UI Visibility Toggle (show/hide bulk panels)
    // ========================================
    const UIVisibility = {
        init() {
            // ensure panels exist first, then create toggle button
            this.createToggle();
            // apply stored visibility state
            const stored = localStorage.getItem(
                CONSTANTS.STORAGE.VISIBILITY_KEY
            );
            const visible = stored === null ? true : stored === "1";
            this.setVisibility(visible);
        },

        createToggle() {
            // find the anchor to insert before
            const anchor = $(
                'div[class="ml-auto hidden md:block"] > a[href="/market-menu"]'
            );
            if (!anchor) return; // nothing to attach to

            // avoid creating multiple buttons
            if ($("#bbx-visibility-toggle")) return;

            const btn = document.createElement("button");
            btn.id = "bbx-visibility-toggle";
            btn.type = "button";
            btn.textContent = "Hide Bulk";
            btn.title = "Show/Hide bulk action panels";
            Object.assign(btn.style, {
                marginRight: "8px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #374151",
                background: "#0b1220",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: "12px",
            });

            btn.addEventListener("click", () => {
                const currentlyVisible = this.arePanelsVisible();
                this.setVisibility(!currentlyVisible);
            });

            anchor.parentElement.insertBefore(btn, anchor);
        },

        arePanelsVisible() {
            const buy = $("#bbx-bulk-panel");
            const remove = $("#bbx-bulk-remove-panel");
            // consider visible if either panel is visible
            const isVisible = (el) => el && el.style.display !== "none";
            return isVisible(buy) || isVisible(remove);
        },

        setVisibility(visible) {
            const buy = $("#bbx-bulk-panel");
            const remove = $("#bbx-bulk-remove-panel");

            $$(`[${CONSTANTS.SELECTORS.TOGGLE_ATTRIBUTE}="1"]`).forEach(
                (toggle) => {
                    toggle.style.display = visible ? "inline-flex" : "none";
                }
            );

            if (buy) buy.style.display = visible ? "block" : "none";
            if (remove) remove.style.display = visible ? "block" : "none";

            const btn = $("#bbx-visibility-toggle");
            if (btn) btn.textContent = visible ? "Hide Bulk" : "Show Bulk";

            // persist
            try {
                localStorage.setItem(
                    CONSTANTS.STORAGE.VISIBILITY_KEY,
                    visible ? "1" : "0"
                );
            } catch (e) {
                // ignore storage errors
            }
        },
    };

    // ========================================
    // Initialization
    // ========================================
    const App = {
        init() {
            PanelManager.init();
            ToggleManager.scanAndAttach();
            KeyboardShortcuts.init();
            DOMObserver.init();
            UIVisibility.init();
        },
    };

    // Bootstrap the application
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => App.init());
    } else {
        App.init();
    }
})();
