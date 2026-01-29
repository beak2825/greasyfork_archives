// ==UserScript==
// @name         Arena.ai | Model Manager: Pin, Reorder & Persistent Auto-Select
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.1
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Pin favorite models to the top of the model selection dropdown with persistent memory
// @match        *://*arena.ai/*
// @icon         https://arena.ai/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560796/Arenaai%20%7C%20Model%20Manager%3A%20Pin%2C%20Reorder%20%20Persistent%20Auto-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/560796/Arenaai%20%7C%20Model%20Manager%3A%20Pin%2C%20Reorder%20%20Persistent%20Auto-Select.meta.js
// ==/UserScript==

/**
 * ============================================================================
 * Arena Model Manager
 * ============================================================================
 *
 * This script enhances Arena's model selection dropdown with:
 *   - Pin favorite models to the top (persisted per mode/modality)
 *   - Drag-and-drop reordering of pinned models
 *   - Auto-restore last selected model on page load/navigation
 *   - Full support for Side-by-Side mode with independent slots
 *
 * Supported Modes:
 *   - Direct: Single model selection
 *   - Side-by-Side: Two independent model slots (Left/Right)
 *
 * Supported Modalities:
 *   - Chat: Standard text conversation
 *   - Search: Web search enabled
 *   - Code: WebDev/coding mode
 *   - Image: Image generation
 *
 * UI Compatibility:
 *   - Supports both old UI (seen in Brave) and new UI (seen in Floorp)
 *   - Old UI: button[role="combobox"][aria-haspopup="dialog"]
 *   - New UI: button[aria-haspopup="dialog"] (no role="combobox")
 *
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════
// CHANGELOG
// ═══════════════════════════════════════════════════════════════════════
// 
// v2.1
// - Renamed LMArena to Arena.ai

(function() {
    'use strict';

    // ========================================================================
    // SECTION 1: CONFIGURATION
    // ========================================================================

    /**
     * Storage keys for GreaseMonkey persistence.
     * All keys are prefixed to avoid conflicts with other scripts.
     */
    const CONFIG = {
        // Base storage keys (suffixed with mode/modality at runtime)
        STORAGE_KEY_PINS: 'arena_pinned_models_v1',
        STORAGE_KEY_LAST_SELECTED: 'arena_last_selected_v2',
        STORAGE_KEY_AUTO_RESTORE: 'arena_auto_restore_enabled_v2',

        // CSS flexbox order base for pinned items (negative to appear first)
        PIN_ORDER_BASE: -10000,

        // Timing constants (milliseconds)
        DEBOUNCE_DELAY: 30,
        TOOLTIP_DELAY: 1000,
        RESTORE_TIMEOUT: 10000,
        ENFORCE_DURATION: 9000,
        ENFORCE_MIN_STABLE: 2500,
        SLOT_STABLE_DURATION: 1200,
        ENFORCE_THROTTLE: 1500,
        DRAG_CLICK_THRESHOLD: 150,

    };

    /**
     * DOM Selectors for both UI variants.
     * Arena is running A/B tests with different UI structures.
     * These selectors work across both variants.
     */
    const SELECTORS = {
        // Dropdown wrapper (Radix UI popover)
        DROPDOWN_WRAPPER: '[data-radix-popper-content-wrapper]',

        // Command menu elements
        CMDK_ROOT: '[cmdk-root]',
        CMDK_LIST: '[cmdk-list]',
        CMDK_ITEM: '[cmdk-item]',
        CMDK_INPUT: '[cmdk-input]',

        // Model selector buttons (works for both UI variants)
        // Old UI: has role="combobox", New UI: only has aria-haspopup
        MODEL_BUTTON: 'button[aria-haspopup="dialog"]',

        // Label inside model button (both variants use truncate class)
        MODEL_LABEL: 'span.truncate, span[class*="truncate"]',

        // Tailwind fixed height class (new UI seen in Floorp)
        FIXED_HEIGHT: '.h-\\[400px\\]'
    };

    /**
     * Human-readable labels for modalities.
     * Used in tooltips and the auto-restore row.
     */
    const MODALITY_LABELS = {
        'chat': 'Chat',
        'search': 'Search',
        'image': 'Image',
        'webdev': 'Code'
    };

    // ========================================================================
    // SECTION 2: UTILITY FUNCTIONS
    // ========================================================================

    /**
     * Check if a DOM element is visible (not hidden by CSS).
     * @param {Element} el - The element to check
     * @returns {boolean} True if visible
     */
    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            Number(style.opacity) !== 0
        );
    }

    /**
     * Promise-based delay utility.
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise<void>}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Safely parse JSON with fallback.
     * @param {string} str - JSON string to parse
     * @param {*} fallback - Fallback value if parsing fails
     * @returns {*} Parsed object or fallback
     */
    function safeJsonParse(str, fallback = {}) {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    }

    /**
     * Extract model info from a dropdown item element.
     * @param {Element} item - The [cmdk-item] element
     * @returns {{id: string, label: string}} Model ID and display label
     */
    function getModelInfo(item) {
        const id = item.getAttribute('data-value') || '';
        const span = item.querySelector('span.truncate');
        const label = span?.textContent?.trim() || item.textContent?.trim() || '';
        return { id, label };
    }

    // ========================================================================
    // SECTION 3: MODE DETECTOR
    // ========================================================================

    /**
     * Detects the current chat mode and modality.
     *
     * Sources of truth:
     *   - New chats: URL parameters (mode, chat-modality)
     *   - Existing chats: API response from /api/evaluation/{chatId}
     *
     * Storage key format: '{mode}_{modality}'
     * Examples: 'direct_chat', 'side-by-side_search', 'direct_webdev'
     */
    const ModeDetector = {
        /** @type {{mode: string, modality: string}|null} */
        _cache: null,

        /** @type {string|null} */
        _cacheUrl: null,

        /**
         * Extract chat ID from URL path.
         * Matches patterns like /c/{id} or /chat/{id}
         * @returns {string|null} Chat ID or null for new chats
         * @private
         */
        _extractChatId() {
            const match = location.href.match(/\/(?:c|chat)\/([a-zA-Z0-9-]+)/);
            return (match && match[1] !== 'new') ? match[1] : null;
        },

        /**
         * Async detection of mode and modality.
         * Uses URL params for new chats, API for existing chats.
         * Results are cached until URL changes.
         *
         * @returns {Promise<{mode: string, modality: string}>}
         */
        async detect() {
            // Return cached result if URL hasn't changed
            if (this._cache && this._cacheUrl === location.href) {
                return this._cache;
            }

            const chatId = this._extractChatId();
            let mode = 'direct';
            let modality = 'chat';

            if (!chatId) {
                // New chat - parse URL parameters
                const params = new URLSearchParams(location.search);
                mode = params.get('mode') || 'direct';
                modality = params.get('chat-modality') || 'chat';

                // Normalize: URL uses 'code', API uses 'webdev'
                if (modality === 'code') modality = 'webdev';
            } else {
                // Existing chat - fetch from API
                try {
                    const resp = await fetch(`/api/evaluation/${chatId}`, {
                        credentials: 'include',
                        headers: { 'Accept': 'application/json' }
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        mode = data.mode || 'direct';
                        modality = data.maskedEvaluations?.[0]?.modality || 'chat';
                    }
                } catch (e) {
                    console.warn('[Model Pinner] Failed to fetch chat info:', e);
                }
            }

            this._cache = { mode, modality };
            this._cacheUrl = location.href;

            console.debug('[Model Pinner] Mode detected:', this._cache);
            return this._cache;
        },

        /**
         * Get storage key suffix based on current mode/modality.
         * Format: '{mode}_{modality}'
         * @returns {string}
         */
        getStorageKey() {
            if (!this._cache) return 'direct_chat';
            return `${this._cache.mode}_${this._cache.modality}`;
        },

        /**
         * Get human-readable modality label for UI display.
         * @returns {string}
         */
        getModalityLabel() {
            if (!this._cache) return 'Chat';
            return MODALITY_LABELS[this._cache.modality] || this._cache.modality;
        },

        /**
         * Invalidate cache. Call on SPA navigation.
         */
        invalidate() {
            this._cache = null;
            this._cacheUrl = null;
        }
    };

    // ========================================================================
    // SECTION 4: STORAGE MODULE
    // ========================================================================

    /**
     * Handles all persistent storage via GreaseMonkey.
     * All data is scoped by mode/modality to keep pins separate.
     */
    const Storage = {
        /**
         * Get full storage key for pinned models, scoped by mode/modality.
         * @returns {string}
         * @private
         */
        _getPinsKey() {
            return `${CONFIG.STORAGE_KEY_PINS}_${ModeDetector.getStorageKey()}`;
        },

        /**
         * Parse stored JSON object safely.
         * Handles both string and object values (GM quirk).
         * @param {string} key - Storage key
         * @returns {Object}
         * @private
         */
        _parseStoredObject(key) {
            try {
                const raw = GM_getValue(key, null);
                if (!raw) return {};
                if (typeof raw === 'string') return JSON.parse(raw);
                if (typeof raw === 'object') return raw;
                return {};
            } catch {
                return {};
            }
        },

        // ----- Pinned Models -----

        /**
         * Get pinned model IDs for current mode/modality.
         * @returns {{pinnedIds: string[]}}
         */
        getPins() {
            try {
                const raw = GM_getValue(this._getPinsKey(), '{}');
                const data = safeJsonParse(raw, {});
                return {
                    pinnedIds: Array.isArray(data.pinnedIds) ? data.pinnedIds : []
                };
            } catch {
                return { pinnedIds: [] };
            }
        },

        /**
         * Save pinned model IDs for current mode/modality.
         * @param {{pinnedIds: string[]}} data
         */
        setPins(data) {
            try {
                GM_setValue(this._getPinsKey(), JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Storage write failed:', e);
            }
        },

        // ----- Last Selected Model -----

        /**
         * Get last-selected model for a specific slot.
         * @param {number} slotIndex - 0 for left/single, 1 for right in Side-by-Side
         * @returns {{id: string, label: string, savedAt: number}|null}
         */
        getLastSelected(slotIndex = 0) {
            const modeKey = ModeDetector.getStorageKey();
            const fullKey = `${modeKey}_${slotIndex}`;
            const data = this._parseStoredObject(CONFIG.STORAGE_KEY_LAST_SELECTED);
            const entry = data[fullKey];

            if (!entry || !entry.id || !entry.label) return null;
            return entry;
        },

        /**
         * Save last-selected model for a specific slot.
         * @param {string} id - Model ID
         * @param {string} label - Model display label
         * @param {number} slotIndex - 0 for left/single, 1 for right
         */
        setLastSelected(id, label, slotIndex = 0) {
            if (!id || !label) return;

            try {
                const modeKey = ModeDetector.getStorageKey();
                const fullKey = `${modeKey}_${slotIndex}`;
                const data = this._parseStoredObject(CONFIG.STORAGE_KEY_LAST_SELECTED);

                data[fullKey] = {
                    id,
                    label,
                    savedAt: Date.now()
                };

                GM_setValue(CONFIG.STORAGE_KEY_LAST_SELECTED, JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Last-selected save failed:', e);
            }
        },

        // ----- Auto-Restore Toggle -----

        /**
         * Check if auto-restore is enabled for current mode/modality.
         * Defaults to true if not set.
         * @returns {boolean}
         */
        getAutoRestoreEnabled() {
            const modeKey = ModeDetector.getStorageKey();
            const data = this._parseStoredObject(CONFIG.STORAGE_KEY_AUTO_RESTORE);
            return data[modeKey] !== false;
        },

        /**
         * Set auto-restore enabled state for current mode/modality.
         * @param {boolean} enabled
         */
        setAutoRestoreEnabled(enabled) {
            try {
                const modeKey = ModeDetector.getStorageKey();
                const data = this._parseStoredObject(CONFIG.STORAGE_KEY_AUTO_RESTORE);
                data[modeKey] = !!enabled;
                GM_setValue(CONFIG.STORAGE_KEY_AUTO_RESTORE, JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Auto-restore toggle save failed:', e);
            }
        }
    };

    // ========================================================================
    // SECTION 5: PIN MANAGER
    // ========================================================================

    /**
     * Manages the pinned models list.
     * Provides pin/unpin, reorder, and query operations.
     * Data is cached and synced with Storage module.
     */
    const PinManager = {
        /** @type {{pinnedIds: string[]}|null} */
        _data: null,

        /**
         * Load data from storage if not cached.
         * @private
         */
        _load() {
            if (!this._data) {
                this._data = Storage.getPins();
            }
        },

        /**
         * Save current data to storage.
         * @private
         */
        _save() {
            Storage.setPins(this._data);
        },

        /**
         * Invalidate cache. Call when mode/modality changes.
         */
        invalidate() {
            this._data = null;
        },

        /**
         * Check if a model is pinned.
         * @param {string} id - Model ID
         * @returns {boolean}
         */
        isPinned(id) {
            this._load();
            return this._data.pinnedIds.includes(id);
        },

        /**
         * Get all pinned model IDs (copy).
         * @returns {string[]}
         */
        getPinnedIds() {
            this._load();
            return [...this._data.pinnedIds];
        },

        /**
         * Get CSS order value for a pinned model.
         * Returns 0 for unpinned models.
         * @param {string} id - Model ID
         * @returns {number}
         */
        getOrder(id) {
            this._load();
            const idx = this._data.pinnedIds.indexOf(id);
            return idx === -1 ? 0 : CONFIG.PIN_ORDER_BASE + idx;
        },

        /**
         * Get the index of a pinned model.
         * Returns -1 if not pinned.
         * @param {string} id - Model ID
         * @returns {number}
         */
        getIndex(id) {
            this._load();
            return this._data.pinnedIds.indexOf(id);
        },

        /**
         * Pin a model (adds to front of list).
         * @param {string} id - Model ID
         */
        pin(id) {
            this._load();
            if (!this._data.pinnedIds.includes(id)) {
                this._data.pinnedIds.unshift(id);
                this._save();
            }
        },

        /**
         * Unpin a model.
         * @param {string} id - Model ID
         */
        unpin(id) {
            this._load();
            const idx = this._data.pinnedIds.indexOf(id);
            if (idx !== -1) {
                this._data.pinnedIds.splice(idx, 1);
                this._save();
            }
        },

        /**
         * Toggle pin state.
         * @param {string} id - Model ID
         * @returns {boolean} New pinned state (true = now pinned)
         */
        toggle(id) {
            if (this.isPinned(id)) {
                this.unpin(id);
                return false;
            } else {
                this.pin(id);
                return true;
            }
        },

        /**
         * Move a pinned model to a new index.
         * @param {string} id - Model ID
         * @param {number} newIndex - Target index
         * @returns {boolean} True if moved
         */
        moveTo(id, newIndex) {
            this._load();
            const oldIndex = this._data.pinnedIds.indexOf(id);

            if (oldIndex === -1 || oldIndex === newIndex) return false;

            this._data.pinnedIds.splice(oldIndex, 1);
            this._data.pinnedIds.splice(newIndex, 0, id);
            this._save();
            return true;
        }
    };

    // ========================================================================
    // SECTION 6: SLOT MANAGER
    // ========================================================================

    /**
     * Manages model selector slots.
     *
     * In Direct mode: 1 slot (index 0)
     * In Side-by-Side mode: 2 slots (0 = Left, 1 = Right)
     *
     * Each slot has its own last-selected model storage.
     */
    const SlotManager = {
        /**
         * Get all visible model selector buttons.
         * Works with both UI variants (old and new A/B test).
         * @returns {HTMLButtonElement[]}
         */
        getButtons() {
            return Array.from(document.querySelectorAll(SELECTORS.MODEL_BUTTON))
                .filter(isElementVisible);
        },

        /**
         * Get the number of visible slots.
         * @returns {number} 1 for Direct, 2 for Side-by-Side
         */
        getCount() {
            return this.getButtons().length;
        },

        /**
         * Get the index of a specific button among all visible slots.
         * @param {HTMLButtonElement} button
         * @returns {number} Slot index (0-based), or 0 if not found
         */
        getIndex(button) {
            if (!button) return 0;
            const buttons = this.getButtons();
            const idx = buttons.indexOf(button);
            return idx === -1 ? 0 : idx;
        },

        /**
         * Find which slot currently has its dropdown open.
         * @returns {number} Active slot index, or 0 if none open
         */
        getActiveIndex() {
            const buttons = this.getButtons();

            for (let i = 0; i < buttons.length; i++) {
                const btn = buttons[i];
                const isOpen = (
                    btn.getAttribute('data-state') === 'open' ||
                    btn.getAttribute('aria-expanded') === 'true'
                );
                if (isOpen) return i;
            }

            return 0;
        },

        /**
         * Get the currently selected model label for a slot.
         * @param {number} slotIndex
         * @returns {string|null}
         */
        getSelectedLabel(slotIndex = 0) {
            const buttons = this.getButtons();
            const btn = buttons[slotIndex];
            if (!btn) return null;

            const labelSpan = btn.querySelector(SELECTORS.MODEL_LABEL);
            return labelSpan?.textContent?.trim() || null;
        },

        /**
         * Get selected labels for all slots.
         * @returns {(string|null)[]}
         */
        getAllSelectedLabels() {
            return this.getButtons().map(btn => {
                const labelSpan = btn.querySelector(SELECTORS.MODEL_LABEL);
                return labelSpan?.textContent?.trim() || null;
            });
        },

        /**
         * Get human-readable slot label.
         * @param {number} slotIndex
         * @returns {string}
         */
        getSlotLabel(slotIndex) {
            const labels = ['Left', 'Right'];
            return labels[slotIndex] || `Slot ${slotIndex}`;
        }
    };

    // ========================================================================
    // SECTION 7: CHAT INPUT TRACKER
    // ========================================================================

    /**
     * Tracks and manages focus to the main chat input.
     *
     * Problem: Auto-restore opens dropdowns, which steal focus. After restore,
     * focus ends up on the dropdown button instead of the chat input.
     *
     * Solution: Track the main chat textarea and always focus it after
     * auto-restore completes. This is simpler and more reliable than
     * trying to save/restore exact focus state during UI transitions.
     */
    const ChatInput = {
        /** @type {Element|null} - Cached reference to chat input */
        _element: null,

        /**
         * Selectors for finding the chat input, in priority order.
         * Excludes dropdown search input ([cmdk-input]).
         * @private
         */
        _selectors: [
            // Specific placeholders (most reliable)
            'textarea[placeholder*="Send a message" i]',
            'textarea[placeholder*="Type a message" i]',
            'textarea[placeholder*="message" i]',
            'textarea[placeholder*="chat" i]',
            // Main form textarea (avoid search inputs)
            'form textarea:not([cmdk-input])',
            // Generic textarea fallback
            'textarea:not([cmdk-input]):not([aria-label*="search" i])',
            // Contenteditable fallback (some chat UIs use this)
            '[contenteditable="true"][data-placeholder*="message" i]',
            '[contenteditable="true"]:not([cmdk-input])'
        ],

        /**
         * Find the main chat input element.
         * Returns cached element if still valid, otherwise searches DOM.
         * @returns {Element|null}
         */
        find() {
            // Return cached if still valid and visible
            if (this._element &&
                document.body.contains(this._element) &&
                isElementVisible(this._element)) {
                return this._element;
            }

            // Search using priority selectors
            for (const selector of this._selectors) {
                try {
                    const el = document.querySelector(selector);
                    if (el && isElementVisible(el)) {
                        this._element = el;
                        return el;
                    }
                } catch {}
            }

            this._element = null;
            return null;
        },

        /**
         * Focus the chat input and position cursor at end.
         * Safe to call even if input doesn't exist.
         * @returns {boolean} True if focus was successful
         */
        focus() {
            const input = this.find();
            if (!input) return false;

            try {
                input.focus();

                // Position cursor at end for text inputs
                if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
                    const len = input.value?.length || 0;
                    input.setSelectionRange(len, len);
                } else if (input.isContentEditable) {
                    // For contenteditable, move cursor to end
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(input);
                    range.collapse(false); // Collapse to end
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                }

                return true;
            } catch {
                return false;
            }
        },

        /**
         * Invalidate cached element.
         * Call on SPA navigation when DOM may completely change.
         */
        invalidate() {
            this._element = null;
        }
    };

    // ========================================================================
    // SECTION 8: TOOLTIP MODULE
    // ========================================================================

    /**
     * Simple tooltip system for pin/grip buttons.
     * Shows after a delay on hover, hides on leave/mousedown.
     */
    const Tooltip = {
        /** @type {HTMLElement|null} */
        _element: null,

        /** @type {number|null} */
        _timeout: null,

        /**
         * Get or create the tooltip element.
         * @returns {HTMLElement}
         * @private
         */
        _getElement() {
            if (!this._element) {
                this._element = document.createElement('div');
                this._element.className = 'mp-tooltip';
                document.body.appendChild(this._element);
            }
            return this._element;
        },

        /**
         * Show tooltip near a target element.
         * @param {HTMLElement} target
         * @param {string} text
         */
        show(target, text) {
            clearTimeout(this._timeout);

            this._timeout = setTimeout(() => {
                const tip = this._getElement();
                tip.textContent = text;

                const rect = target.getBoundingClientRect();
                tip.style.left = `${rect.left + rect.width / 2}px`;
                tip.style.top = `${rect.bottom + 8}px`;
                tip.style.transform = 'translateX(-50%) translateY(4px)';

                requestAnimationFrame(() => {
                    tip.classList.add('mp-tooltip-visible');
                    tip.style.transform = 'translateX(-50%) translateY(0)';
                });
            }, CONFIG.TOOLTIP_DELAY);
        },

        /**
         * Hide the tooltip.
         */
        hide() {
            clearTimeout(this._timeout);
            if (this._element) {
                this._element.classList.remove('mp-tooltip-visible');
            }
        },

        /**
         * Attach tooltip behavior to an element.
         * @param {HTMLElement} element
         * @param {string} text
         */
        attach(element, text) {
            element.addEventListener('mouseenter', () => this.show(element, text));
            element.addEventListener('mouseleave', () => this.hide());
            element.addEventListener('mousedown', () => this.hide());
        }
    };

    // ========================================================================
    // SECTION 9: STYLES (CSS)
    // ========================================================================

    /**
     * All CSS styles for the script.
     * Organized by feature/purpose.
     */
    const STYLES = `
        /* ================================================================
           DROPDOWN LAYOUT FIXES
           ================================================================
           These rules fix Arena's dropdown to use full viewport height
           and prevent content truncation. Supports both UI variants.
        */

        /* Ensure dropdown is above everything */
        ${SELECTORS.DROPDOWN_WRAPPER} {
            z-index: 2147483647 !important;
        }

        /* Dialog: auto width, viewport height */
        ${SELECTORS.DROPDOWN_WRAPPER} > [role="dialog"] {
            width: max-content !important;
            min-width: 400px !important;
            max-width: calc(100vw - 40px) !important;
            max-height: calc(100vh - 80px) !important;
            height: min(var(--radix-popover-content-available-height), calc(100vh - 80px)) !important;
        }

        /* Override Tailwind's fixed h-[400px] (new UI seen in Floorp) */
        ${SELECTORS.DROPDOWN_WRAPPER} ${SELECTORS.FIXED_HEIGHT} {
            height: 100% !important;
            max-height: none !important;
        }

        /* Ensure cmdk root and flex container stretch */
        ${SELECTORS.DROPDOWN_WRAPPER} ${SELECTORS.CMDK_ROOT},
        ${SELECTORS.DROPDOWN_WRAPPER} ${SELECTORS.CMDK_ROOT} > .flex {
            height: 100% !important;
            max-height: none !important;
        }

        /* Remove max-height from list */
        ${SELECTORS.DROPDOWN_WRAPPER} ${SELECTORS.CMDK_LIST} {
            max-height: none !important;
        }

        /* Remove truncation from model names in dropdown */
        ${SELECTORS.CMDK_ITEM} span.truncate {
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: nowrap !important;
        }

        /* Flex layout for proper pin ordering */
        [cmdk-group-items] {
            display: flex !important;
            flex-direction: column !important;
        }

        /* ================================================================
           MODEL SELECTOR BUTTON FIXES
           ================================================================
           Expand buttons to show full model names while preventing
           overlap in Side-by-Side mode.
        */

        ${SELECTORS.MODEL_BUTTON} {
            max-width: min(400px, 45vw) !important;
            width: max-content !important;
            flex-shrink: 1 !important;
        }

        ${SELECTORS.MODEL_BUTTON} span.truncate,
        ${SELECTORS.MODEL_BUTTON} span[class*="truncate"] {
            overflow: hidden !important;
            text-overflow: clip !important;
            white-space: nowrap !important;
        }

        /* ================================================================
           DISABLED ITEMS (Side-by-Side Cross-Selection)
           ================================================================
           When a model is selected on one side, it's disabled on the other.
           We re-enable pointer events on our controls only.
        */

        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] {
            pointer-events: auto !important;
            cursor: default !important;
        }

        /* Block clicks on main item area */
        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] > *:not(.mp-controls) {
            pointer-events: none !important;
        }

        /* Re-enable our controls */
        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] .mp-controls,
        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] .mp-btn {
            pointer-events: auto !important;
            cursor: pointer !important;
        }

        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] .mp-grip-btn {
            cursor: grab !important;
        }

        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] .mp-grip-btn:active,
        ${SELECTORS.CMDK_ITEM}[data-disabled="true"] .mp-grip-btn.mp-grip-dragging {
            cursor: grabbing !important;
        }

        /* ================================================================
           CONTROLS CONTAINER (Pin + Grip Buttons)
           ================================================================ */

        .mp-controls {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-right: 8px;
            flex-shrink: 0;
        }

        /* ================================================================
           BUTTON BASE STYLES
           ================================================================ */

        .mp-btn {
            flex-shrink: 0;
            width: 22px;
            height: 22px;
            padding: 3px;
            border: none;
            background: transparent;
            border-radius: 4px;
            opacity: 0.15;
            cursor: pointer;
            transition: opacity 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: currentColor;
        }

        .mp-btn:hover {
            opacity: 0.9;
            background-color: rgba(128, 128, 128, 0.2);
        }

        .mp-btn:active {
            transform: scale(0.92);
        }

        .mp-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        /* Show buttons on item hover */
        ${SELECTORS.CMDK_ITEM}:hover .mp-btn:not(.mp-pinned):not(.mp-dragging) {
            opacity: 0.5;
        }

        /* ================================================================
           PIN BUTTON
           ================================================================ */

        .mp-pin-btn.mp-pinned {
            opacity: 1;
            color: #f59e0b;
        }

        .mp-pin-btn.mp-pinned:hover {
            color: #d97706;
        }

        /* ================================================================
           GRIP (DRAG HANDLE) BUTTON
           ================================================================ */

        .mp-grip-btn {
            cursor: grab;
            opacity: 0;
            pointer-events: none;
        }

        .mp-grip-btn:active,
        .mp-grip-btn.mp-grip-dragging {
            cursor: grabbing;
        }

        /* Show grip only for pinned items on hover */
        ${SELECTORS.CMDK_ITEM}.mp-is-pinned:hover .mp-grip-btn {
            opacity: 0.4;
            pointer-events: auto;
        }

        ${SELECTORS.CMDK_ITEM}.mp-is-pinned .mp-grip-btn:hover {
            opacity: 0.8;
            background-color: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
        }

        /* ================================================================
           PINNED ITEM ACCENT
           ================================================================ */

        ${SELECTORS.CMDK_ITEM}.mp-is-pinned {
            box-shadow: inset 3px 0 0 #f59e0b;
        }

        /* Ensure items can show pseudo-elements */
        ${SELECTORS.CMDK_ITEM} {
            position: relative;
        }

        /* ================================================================
           DRAG & DROP STATES
           ================================================================ */

        /* Drag clone (floating preview) */
        .mp-drag-clone {
            transition: none !important;
            pointer-events: none !important;
        }

        .mp-drag-clone .mp-controls {
            display: none !important;
        }

        .mp-drag-clone * {
            pointer-events: none !important;
        }

        /* Original item being dragged */
        ${SELECTORS.CMDK_ITEM}.mp-dragging {
            opacity: 0.5;
            background-color: rgba(59, 130, 246, 0.1) !important;
            box-shadow: inset 3px 0 0 #3b82f6, 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        }

        /* Drop indicator (below) */
        ${SELECTORS.CMDK_ITEM}.mp-drag-over::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -2px;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
            border-radius: 2px;
            box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.6),
                        0 0 24px 4px rgba(59, 130, 246, 0.3);
            z-index: 1000;
            animation: mp-drop-pulse 0.8s ease-in-out infinite;
        }

        /* Drop indicator (above) */
        ${SELECTORS.CMDK_ITEM}.mp-drag-over-above::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: -2px;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
            border-radius: 2px;
            box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.6),
                        0 0 24px 4px rgba(59, 130, 246, 0.3);
            z-index: 1000;
            animation: mp-drop-pulse 0.8s ease-in-out infinite;
        }

        ${SELECTORS.CMDK_ITEM}.mp-drag-over {
            box-shadow: inset 3px 0 0 #f59e0b, inset 0 -2px 0 #3b82f6 !important;
        }

        ${SELECTORS.CMDK_ITEM}.mp-drag-over-above {
            box-shadow: inset 3px 0 0 #f59e0b, inset 0 2px 0 #3b82f6 !important;
        }

        @keyframes mp-drop-pulse {
            0%, 100% {
                opacity: 1;
                box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.6),
                            0 0 24px 4px rgba(59, 130, 246, 0.3);
            }
            50% {
                opacity: 0.8;
                box-shadow: 0 0 16px 4px rgba(59, 130, 246, 0.8),
                            0 0 32px 8px rgba(59, 130, 246, 0.4);
            }
        }

        /* ================================================================
           AUTO-RESTORE ROW (inside dropdown)
           ================================================================ */

        .mp-autorestore-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 12px;
            margin: 4px 8px 8px 8px;
            border: 1px solid rgba(128, 128, 128, 0.2);
            border-radius: 6px;
            background: rgba(128, 128, 128, 0.05);
            font-size: 12px;
            user-select: none;
        }

        .mp-autorestore-row:hover {
            background: rgba(128, 128, 128, 0.1);
        }

        .mp-autorestore-row label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            flex: 1;
            min-width: 0;
        }

        .mp-autorestore-row input[type="checkbox"] {
            width: 14px;
            height: 14px;
            margin: 0;
            cursor: pointer;
            flex-shrink: 0;
        }

        .mp-autorestore-row .mp-label-content {
            display: flex;
            align-items: baseline;
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }

        .mp-autorestore-row .mp-label-text {
            opacity: 0.8;
            flex-shrink: 0;
            white-space: nowrap;
        }

        .mp-autorestore-row .mp-saved-model {
            opacity: 0.5;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* ================================================================
           TOOLTIP
           ================================================================ */

        .mp-tooltip {
            position: fixed;
            z-index: 2147483647;
            background: #1f2937;
            color: #f9fafb;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 0.15s ease, transform 0.15s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .mp-tooltip.mp-tooltip-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .mp-tooltip::before {
            content: '';
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #1f2937;
        }

        /* ================================================================
           AUTO-RESTORE MASK
           ================================================================
           Hides dropdown during auto-restore to prevent flash.
        */

        html.mp-restoring ${SELECTORS.DROPDOWN_WRAPPER},
        body.mp-restoring ${SELECTORS.DROPDOWN_WRAPPER} {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transform: translate(-200vw, -200vh) !important;
            transition: none !important;
        }

        /* ================================================================
           DISABLE ANIMATIONS
           ================================================================
           Kill all Radix/cmdk animations for instant dropdown response.
        */

        ${SELECTORS.DROPDOWN_WRAPPER},
        ${SELECTORS.DROPDOWN_WRAPPER} * {
            animation: none !important;
            animation-duration: 0s !important;
            transition: none !important;
            transition-duration: 0s !important;
        }

        ${SELECTORS.DROPDOWN_WRAPPER} > [role="dialog"],
        ${SELECTORS.DROPDOWN_WRAPPER} > [role="listbox"],
        ${SELECTORS.DROPDOWN_WRAPPER} > [role="menu"] {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }

        [data-state="open"],
        [data-state="closed"],
        [data-state="open"] *,
        [data-state="closed"] * {
            animation: none !important;
            animation-duration: 0s !important;
            transition: none !important;
            transition-duration: 0s !important;
        }

        /* Radix animation classes */
        [class*="animate-in"],
        [class*="animate-out"],
        [class*="fade-in"],
        [class*="fade-out"],
        [class*="zoom-in"],
        [class*="zoom-out"],
        [class*="slide-in"],
        [class*="slide-out"] {
            animation: none !important;
            animation-duration: 0s !important;
            opacity: 1 !important;
        }

        /* cmdk specific */
        ${SELECTORS.CMDK_ROOT},
        ${SELECTORS.CMDK_LIST},
        [cmdk-group],
        ${SELECTORS.CMDK_ITEM} {
            animation: none !important;
            transition: none !important;
        }
    `;

    // Inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = STYLES;
    document.head.appendChild(styleElement);

    // ========================================================================
    // SECTION 10: ICONS
    // ========================================================================

    const ICONS = {
        PIN: `
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
            </svg>`,

        GRIP: `
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5.5" cy="3" r="1.5"/>
                <circle cx="10.5" cy="3" r="1.5"/>
                <circle cx="5.5" cy="8" r="1.5"/>
                <circle cx="10.5" cy="8" r="1.5"/>
                <circle cx="5.5" cy="13" r="1.5"/>
                <circle cx="10.5" cy="13" r="1.5"/>
            </svg>`
    };

    // ========================================================================
    // SECTION 11: DRAG & DROP MODULE
    // ========================================================================

    /**
     * Pointer-based drag and drop for reordering pinned models.
     * Uses pointer events instead of HTML5 DnD to avoid cursor glitches.
     */
    const DragDrop = {
        /**
         * Current drag state, or null if not dragging.
         * @type {{id: string, item: Element, grip: Element, list: Element, clone: Element, offsetX: number, offsetY: number, pointerId: number}|null}
         */
        _state: null,

        /**
         * Timestamp of last drag end. Used to prevent accidental selection.
         * @type {number}
         */
        _lastDragEndTime: 0,

        /**
         * Check if a click should be ignored (happened right after drag).
         * @returns {boolean}
         */
        isRecentDrag() {
            return Date.now() - this._lastDragEndTime < CONFIG.DRAG_CLICK_THRESHOLD;
        },

        /**
         * Calculate drop target information for reordering.
         * @param {number} clientY - Mouse Y position
         * @param {Element} list - The cmdk-list element
         * @param {string} draggedId - ID of the model being dragged
         * @returns {{targetIndex: number, wouldChange: boolean, indicatorItem: Element|null, indicatorBelow: boolean}}
         */
        _calculateDropInfo(clientY, list, draggedId) {
            const draggedOriginalIndex = PinManager.getIndex(draggedId);
            const pinnedCount = PinManager.getPinnedIds().length;

            // Get all pinned items except the one being dragged
            const pinnedItems = Array.from(list.querySelectorAll(`${SELECTORS.CMDK_ITEM}.mp-is-pinned`))
                .filter(el => {
                    const { id } = getModelInfo(el);
                    return id && id !== draggedId;
                })
                .map(el => {
                    const rect = el.getBoundingClientRect();
                    const id = getModelInfo(el).id;
                    return {
                        el,
                        id,
                        midY: rect.top + rect.height / 2,
                        originalIndex: PinManager.getIndex(id)
                    };
                })
                .sort((a, b) => a.originalIndex - b.originalIndex);

            // Determine insertion point based on cursor position
            let insertBeforeIndex = pinnedCount;
            let indicatorItem = null;
            let indicatorBelow = false;

            for (let i = 0; i < pinnedItems.length; i++) {
                if (clientY < pinnedItems[i].midY) {
                    insertBeforeIndex = pinnedItems[i].originalIndex;
                    indicatorItem = pinnedItems[i].el;
                    indicatorBelow = false;
                    break;
                }
            }

            // If cursor is below all items, insert at end
            if (insertBeforeIndex === pinnedCount && pinnedItems.length > 0) {
                indicatorItem = pinnedItems[pinnedItems.length - 1].el;
                indicatorBelow = true;
            }

            // Adjust for removal of dragged item
            let targetIndex = insertBeforeIndex;
            if (draggedOriginalIndex < insertBeforeIndex) {
                targetIndex--;
            }

            targetIndex = Math.max(0, Math.min(targetIndex, pinnedCount - 1));

            return {
                targetIndex,
                wouldChange: targetIndex !== draggedOriginalIndex,
                indicatorItem,
                indicatorBelow
            };
        },

        /**
         * Clear all drag-over visual states.
         * @param {Element} list
         * @private
         */
        _clearDragOverStates(list) {
            list.querySelectorAll('.mp-drag-over, .mp-drag-over-above').forEach(el => {
                el.classList.remove('mp-drag-over', 'mp-drag-over-above');
            });
        },

        /**
         * Update drop indicator visuals.
         * @param {number} clientY
         * @param {Element} list
         * @param {string} draggedId
         * @private
         */
        _updateDragOverStates(clientY, list, draggedId) {
            this._clearDragOverStates(list);

            const info = this._calculateDropInfo(clientY, list, draggedId);

            if (!info.wouldChange || !info.indicatorItem) return;

            if (info.indicatorBelow) {
                info.indicatorItem.classList.add('mp-drag-over');
            } else {
                info.indicatorItem.classList.add('mp-drag-over-above');
            }
        },

        /**
         * Clean up all drag visuals.
         * @private
         */
        _cleanupVisuals() {
            if (!this._state) return;

            const { item, grip, list, clone } = this._state;

            item.classList.remove('mp-dragging');
            grip.classList.remove('mp-grip-dragging');
            clone.remove();
            this._clearDragOverStates(list);
        },

        /**
         * Set up drag event handlers on a grip button.
         * @param {Element} grip - The grip button element
         * @param {Element} item - The parent cmdk-item
         * @param {string} id - Model ID
         */
        setupHandlers(grip, item, id) {
            // Pointer down - start drag
            grip.addEventListener('pointerdown', (e) => {
                if (!PinManager.isPinned(id)) return;
                if (e.button !== 0) return; // Left click only

                e.preventDefault();
                e.stopPropagation();

                const list = item.closest(SELECTORS.CMDK_LIST);
                if (!list) return;

                grip.setPointerCapture(e.pointerId);

                // Create floating clone
                const rect = item.getBoundingClientRect();
                const clone = item.cloneNode(true);

                delete clone.dataset.mpEnhanced;
                clone.removeAttribute('data-selected');
                clone.classList.remove('mp-dragging', 'mp-drag-over', 'mp-drag-over-above');
                clone.classList.add('mp-drag-clone');

                clone.style.cssText = `
                    position: fixed;
                    left: ${rect.left}px;
                    top: ${rect.top}px;
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    z-index: 2147483647;
                    pointer-events: none;
                    opacity: 0.5;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                    border-radius: 6px;
                    background: #1e1e1e;
                    border: 2px solid rgba(59, 130, 246, 0.6);
                    display: flex;
                    align-items: center;
                `;

                document.body.appendChild(clone);

                item.classList.add('mp-dragging');
                grip.classList.add('mp-grip-dragging');

                this._state = {
                    id,
                    item,
                    grip,
                    list,
                    clone,
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top,
                    pointerId: e.pointerId
                };

                Tooltip.hide();
            });

            // Pointer move - update position and indicators
            grip.addEventListener('pointermove', (e) => {
                if (!this._state || this._state.id !== id) return;

                const { clone, list, offsetX, offsetY } = this._state;

                clone.style.left = `${e.clientX - offsetX}px`;
                clone.style.top = `${e.clientY - offsetY}px`;

                this._updateDragOverStates(e.clientY, list, id);
            });

            // Pointer up - complete drag
            grip.addEventListener('pointerup', (e) => {
                if (!this._state || this._state.id !== id) return;

                const { grip: g, list, pointerId } = this._state;

                try {
                    g.releasePointerCapture(pointerId);
                } catch {}

                const targetIndex = this._calculateDropInfo(e.clientY, list, id).targetIndex;

                this._cleanupVisuals();

                if (PinManager.moveTo(id, targetIndex)) {
                    applyPinOrder();
                }

                this._state = null;
                this._lastDragEndTime = Date.now();
            });

            // Pointer cancel - abort drag
            grip.addEventListener('pointercancel', () => {
                if (!this._state || this._state.id !== id) return;

                const { grip: g, pointerId } = this._state;

                try {
                    g.releasePointerCapture(pointerId);
                } catch {}

                this._cleanupVisuals();
                this._state = null;
            });

            // Prevent text selection during drag
            grip.addEventListener('selectstart', (e) => {
                if (this._state) e.preventDefault();
            });

            // Prevent click propagation (would close dropdown)
            grip.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, true);
        }
    };

    // ========================================================================
    // SECTION 12: UI CONTROLS
    // ========================================================================

    /**
     * Factory functions for creating UI control elements.
     */
    const UIControls = {
        /**
         * Create a pin button for a model item.
         * @param {string} id - Model ID
         * @param {boolean} isPinned - Current pin state
         * @returns {HTMLElement}
         */
        createPinButton(id, isPinned) {
            const btn = document.createElement('span');
            btn.className = 'mp-btn mp-pin-btn' + (isPinned ? ' mp-pinned' : '');
            btn.innerHTML = ICONS.PIN;

            Tooltip.attach(btn, isPinned ? 'Unpin model' : 'Pin to top');

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                PinManager.toggle(id);
                applyPinOrder();
            });

            return btn;
        },

        /**
         * Create a grip (drag handle) button.
         * @returns {HTMLElement}
         */
        createGripButton() {
            const btn = document.createElement('span');
            btn.className = 'mp-btn mp-grip-btn';
            btn.innerHTML = ICONS.GRIP;

            Tooltip.attach(btn, 'Drag to reorder');

            return btn;
        },

        /**
         * Create the controls container (grip + pin) for a model item.
         * @param {string} id - Model ID
         * @param {boolean} isPinned - Current pin state
         * @param {Element} item - The parent cmdk-item element
         * @returns {HTMLElement}
         */
        createControlsContainer(id, isPinned, item) {
            const container = document.createElement('span');
            container.className = 'mp-controls';

            const grip = this.createGripButton();
            const pinBtn = this.createPinButton(id, isPinned);

            container.appendChild(grip);
            container.appendChild(pinBtn);

            DragDrop.setupHandlers(grip, item, id);

            return container;
        },

        /**
         * Create the auto-restore row for the dropdown.
         * Shows checkbox + currently saved model name.
         * @returns {HTMLElement}
         */
        createAutoRestoreRow() {
            const row = document.createElement('div');
            row.className = 'mp-autorestore-row';

            const label = document.createElement('label');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.tabIndex = -1; // Don't steal focus from search
            checkbox.checked = Storage.getAutoRestoreEnabled();
            checkbox.addEventListener('change', () => {
                Storage.setAutoRestoreEnabled(checkbox.checked);
            });

            const content = document.createElement('span');
            content.className = 'mp-label-content';

            const text = document.createElement('span');
            text.className = 'mp-label-text';
            text.textContent = 'Auto-select last chosen model';

            // Show saved model for active slot
            const activeSlot = SlotManager.getActiveIndex();
            const saved = Storage.getLastSelected(activeSlot);
            const modeLabel = ModeDetector.getModalityLabel();
            const slotCount = SlotManager.getCount();

            const slotSuffix = slotCount > 1
                ? ` (${SlotManager.getSlotLabel(activeSlot)})`
                : '';

            const hint = document.createElement('span');
            hint.className = 'mp-saved-model';

            if (saved?.label) {
                hint.textContent = `: ${saved.label}`;
                hint.title = `${modeLabel}${slotSuffix}: ${saved.label}`;
            } else {
                hint.textContent = '';
                hint.title = `${modeLabel}${slotSuffix}`;
            }

            content.appendChild(text);
            content.appendChild(hint);
            label.appendChild(checkbox);
            label.appendChild(content);
            row.appendChild(label);

            // Click handlers (native label toggle may be blocked by Radix)
            label.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });

            row.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                if (e.target.closest('label')) return;
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });

            return row;
        }
    };

    // ========================================================================
    // SECTION 13: CORE PIN ORDER LOGIC
    // ========================================================================

    /**
     * Apply CSS order and visual states to all dropdown items.
     * Called after pin/unpin/reorder operations.
     */
    function applyPinOrder() {
        const items = document.querySelectorAll(SELECTORS.CMDK_ITEM);

        items.forEach(item => {
            // Skip drag clone
            if (item.classList.contains('mp-drag-clone')) return;

            const { id } = getModelInfo(item);
            if (!id) return;

            const isPinned = PinManager.isPinned(id);

            if (isPinned) {
                item.style.order = PinManager.getOrder(id);
                item.classList.add('mp-is-pinned');
            } else {
                item.style.order = '';
                item.classList.remove('mp-is-pinned');
            }

            // Sync pin button state
            const btn = item.querySelector('.mp-pin-btn');
            if (btn) {
                btn.classList.toggle('mp-pinned', isPinned);
            }
        });
    }

    /**
     * Enhance a dropdown item with pin/grip controls.
     * @param {Element} item - The cmdk-item element
     */
    function enhanceItem(item) {
        if (item.dataset.mpEnhanced) return;
        item.dataset.mpEnhanced = 'true';

        const { id } = getModelInfo(item);
        if (!id) return;

        const isPinned = PinManager.isPinned(id);

        if (isPinned) {
            item.classList.add('mp-is-pinned');
            item.style.order = PinManager.getOrder(id);
        }

        const controls = UIControls.createControlsContainer(id, isPinned, item);
        const firstChild = item.firstElementChild;

        if (firstChild) {
            item.insertBefore(controls, firstChild);
        } else {
            item.prepend(controls);
        }
    }

    // ========================================================================
    // SECTION 14: DROPDOWN PROCESSING
    // ========================================================================

    /**
     * Inject the auto-restore row into the dropdown.
     * Only creates it once per dropdown open.
     * @param {Element} wrapper - The dropdown wrapper element
     */
    function injectAutoRestoreRow(wrapper) {
        // Don't recreate if already exists
        // (Recreating mid-click breaks event synthesis)
        if (wrapper.querySelector('.mp-autorestore-row')) return;

        const list = wrapper.querySelector(SELECTORS.CMDK_LIST);
        if (!list) return;

        const row = UIControls.createAutoRestoreRow();
        list.insertBefore(row, list.firstChild);
    }

    /**
     * Process a dropdown: inject controls, enhance items, apply pin order.
     * @param {Element} wrapper - The dropdown wrapper element
     */
    async function processDropdown(wrapper) {
        // Ensure mode is detected before processing
        // (Storage operations depend on ModeDetector.getStorageKey())
        await ModeDetector.detect();

        injectAutoRestoreRow(wrapper);

        const items = document.querySelectorAll(SELECTORS.CMDK_ITEM);
        items.forEach(enhanceItem);

        applyPinOrder();
    }

    // ========================================================================
    // SECTION 15: OBSERVERS
    // ========================================================================

    /**
     * Manages MutationObservers for dropdown detection and content changes.
     */
    const Observers = {
        /** @type {MutationObserver|null} */
        _dropdownObserver: null,

        /** @type {Element|null} */
        _currentWrapper: null,

        /** @type {number|null} */
        _debounceTimer: null,

        /**
         * Debounced dropdown processing.
         * @private
         */
        _debouncedProcess() {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = setTimeout(() => {
                if (this._currentWrapper) {
                    processDropdown(this._currentWrapper);
                }
            }, CONFIG.DEBOUNCE_DELAY);
        },

        /**
         * Start watching a dropdown for content changes.
         * @param {Element} wrapper - The dropdown wrapper
         */
        watchDropdown(wrapper) {
            // Disconnect existing observer
            if (this._dropdownObserver) {
                this._dropdownObserver.disconnect();
            }

            this._currentWrapper = wrapper;

            const list = wrapper.querySelector(SELECTORS.CMDK_LIST);
            if (!list) return;

            // Watch for item additions/removals (e.g., search filtering)
            this._dropdownObserver = new MutationObserver(() => {
                this._debouncedProcess();
            });

            this._dropdownObserver.observe(list, {
                childList: true,
                subtree: true
            });

            // Also watch search input for changes
            const input = wrapper.querySelector(SELECTORS.CMDK_INPUT);
            if (input && !input.dataset.mpInputBound) {
                input.dataset.mpInputBound = 'true';
                input.addEventListener('input', () => this._debouncedProcess());
            }

            // Initial processing
            processDropdown(wrapper);
        },

        /**
         * Stop watching the current dropdown.
         */
        unwatchDropdown() {
            if (this._dropdownObserver) {
                this._dropdownObserver.disconnect();
                this._dropdownObserver = null;
            }
            this._currentWrapper = null;
        },

        /**
         * Initialize the main body observer.
         * Watches for dropdown appearance/removal.
         */
        init() {
            const bodyObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    // Check added nodes for dropdown
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        const wrapper = node.matches?.(SELECTORS.DROPDOWN_WRAPPER)
                            ? node
                            : node.querySelector?.(SELECTORS.DROPDOWN_WRAPPER);

                        if (wrapper?.querySelector(SELECTORS.CMDK_LIST)) {
                            this.watchDropdown(wrapper);
                        }
                    }

                    // Check removed nodes for dropdown cleanup
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        const isDropdown = node.matches?.(SELECTORS.DROPDOWN_WRAPPER) ||
                            node.querySelector?.(SELECTORS.DROPDOWN_WRAPPER);

                        if (isDropdown) {
                            this.unwatchDropdown();
                        }
                    }
                }
            });

            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Handle already-open dropdown on script load
            const existing = document.querySelector(SELECTORS.DROPDOWN_WRAPPER);
            if (existing?.querySelector(SELECTORS.CMDK_LIST)) {
                this.watchDropdown(existing);
            }
        }
    };

    // ========================================================================
    // SECTION 16: AUTO-RESTORE MODULE
    // ========================================================================

    /**
     * Handles automatic restoration of last-selected models.
     *
     * Features:
     *   - Restores model selection on page load
     *   - Handles SPA navigation with enforcement period
     *   - Supports independent Left/Right slots in Side-by-Side mode
     *   - Hides dropdown during restore to prevent flash
     */
    const AutoRestore = {
        /** @type {boolean} */
        _attempted: false,

        /** @type {boolean} */
        _inProgress: false,

        /**
         * Enforcement state for post-navigation model persistence.
         * Arena may override model selection ~1.1s after SPA navigation.
         * We "enforce" the user's choice for a window after navigation.
         */
        _enforce: {
            /** @type {number} Sequence number to detect stale timers */
            seq: 0,
            /** @type {number|null} */
            timer: null,
            /** @type {number} Enforcement end time */
            until: 0,
            /** @type {number} Minimum time before declaring "stable" */
            minUntil: 0,
            /** @type {number} Last restore attempt timestamp */
            lastAttemptAt: 0,
            /**
             * Per-slot state tracking
             * @type {Object.<number, {stableSince: number, failedAttempts: number}>}
             */
            slots: {}
        },

        // ----- Utility Methods -----

        /**
         * Toggle the restore mask (hides dropdown during restore).
         * @param {boolean} enabled
         * @private
         */
        _setMask(enabled) {
            try {
                document.documentElement.classList.toggle('mp-restoring', !!enabled);
            } catch {}
            try {
                document.body?.classList.toggle('mp-restoring', !!enabled);
            } catch {}
        },

        /**
         * Wait for dropdown to be removed from DOM.
         * @param {number} timeoutMs
         * @returns {Promise<boolean>}
         * @private
         */
        _waitForDropdownRemoved(timeoutMs) {
            return new Promise((resolve) => {
                const exists = () => !!document.querySelector(SELECTORS.DROPDOWN_WRAPPER);

                if (!exists()) {
                    resolve(true);
                    return;
                }

                const root = document.body || document.documentElement;
                if (!root) {
                    resolve(false);
                    return;
                }

                const obs = new MutationObserver(() => {
                    if (!exists()) {
                        obs.disconnect();
                        clearTimeout(timeout);
                        resolve(true);
                    }
                });

                obs.observe(root, { childList: true, subtree: true });

                const timeout = setTimeout(() => {
                    obs.disconnect();
                    resolve(!exists());
                }, timeoutMs);
            });
        },

        /**
         * Close dropdown by sending Escape key.
         * @private
         */
        _closeDropdown() {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
            }));
        },

        /**
         * Wait for a specific model to appear in dropdown, then click it.
         * @param {string} targetId - Model ID to select
         * @param {number} timeoutMs
         * @returns {Promise<boolean>}
         * @private
         */
        _waitAndSelectModel(targetId, timeoutMs) {
            return new Promise((resolve) => {
                const tryClick = () => {
                    const item = document.querySelector(
                        `${SELECTORS.DROPDOWN_WRAPPER} ${SELECTORS.CMDK_ITEM}[data-value="${targetId}"]`
                    );
                    if (!item) return false;
                    item.click();
                    return true;
                };

                // Fast path
                if (tryClick()) {
                    resolve(true);
                    return;
                }

                const obs = new MutationObserver(() => {
                    if (tryClick()) {
                        obs.disconnect();
                        clearTimeout(timeout);
                        resolve(true);
                    }
                });

                obs.observe(document.body, { childList: true, subtree: true });

                const timeout = setTimeout(() => {
                    obs.disconnect();
                    resolve(false);
                }, timeoutMs);
            });
        },

        /**
         * Wait for dropdown to appear and check if model exists.
         * @param {string} targetId
         * @param {number} timeoutMs
         * @returns {Promise<boolean>}
         * @private
         */
        _waitForModelInDropdown(targetId, timeoutMs) {
            return new Promise((resolve) => {
                const checkExists = () => {
                    const wrapper = document.querySelector(SELECTORS.DROPDOWN_WRAPPER);
                    if (!wrapper) return false;

                    const item = wrapper.querySelector(
                        `${SELECTORS.CMDK_ITEM}[data-value="${targetId}"]`
                    );
                    return !!item;
                };

                if (checkExists()) {
                    resolve(true);
                    return;
                }

                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (checkExists()) {
                        clearInterval(interval);
                        resolve(true);
                        return;
                    }

                    // Check if dropdown loaded but model isn't there
                    const wrapper = document.querySelector(SELECTORS.DROPDOWN_WRAPPER);
                    const hasItems = wrapper?.querySelector(SELECTORS.CMDK_ITEM);
                    if (wrapper && hasItems) {
                        clearInterval(interval);
                        resolve(false);
                        return;
                    }

                    if (Date.now() - startTime > timeoutMs) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }, 50);
            });
        },

        // ----- Slot Restoration -----

        /**
         * Attempt to restore model for a single slot.
         * @param {number} slotIndex
         * @returns {Promise<boolean>} True if successful or nothing to restore
         * @private
         */
        async _restoreSlot(slotIndex) {
            const saved = Storage.getLastSelected(slotIndex);
            if (!saved?.id || !saved?.label) return true; // Nothing to restore

            const currentLabel = SlotManager.getSelectedLabel(slotIndex);
            if (currentLabel === saved.label) return true; // Already correct

            const buttons = SlotManager.getButtons();
            const button = buttons[slotIndex];
            if (!button) return false;

            // Enable mask before opening dropdown
            this._setMask(true);

            try {
                // Open dropdown if not already open
                const isOpen = (
                    button.getAttribute('data-state') === 'open' ||
                    button.getAttribute('aria-expanded') === 'true'
                );
                if (!isOpen) {
                    button.click();
                }

                // Wait for model to appear
                const modelExists = await this._waitForModelInDropdown(saved.id, 1000);

                if (!modelExists) {
                    // Model not available in this mode
                    this._closeDropdown();
                    await this._waitForDropdownRemoved(1200);

                    // Mark as permanently failed
                    if (this._enforce.slots[slotIndex]) {
                        this._enforce.slots[slotIndex].failedAttempts = 999;
                    }
                    return false;
                }

                const success = await this._waitAndSelectModel(saved.id, 500);

                // Close dropdown
                this._closeDropdown();
                await this._waitForDropdownRemoved(1200);

                if (!success && this._enforce.slots[slotIndex]) {
                    this._enforce.slots[slotIndex].failedAttempts++;
                }

                return success;
            } finally {
                this._setMask(false);
            }
        },

        /**
         * Attempt to restore all slots sequentially.
         * Always focuses chat input after completion.
         * @param {boolean} force - Bypass "already attempted" check
         */
        async attempt(force = false) {
            if (this._inProgress) return;
            if (!force && this._attempted) return;

            // Ensure mode is detected
            await ModeDetector.detect();

            if (!Storage.getAutoRestoreEnabled()) return;

            const slotCount = SlotManager.getCount();
            if (slotCount === 0) return;

            // Check if any slot needs restoration
            let anyNeedsRestore = false;
            for (let i = 0; i < slotCount; i++) {
                const saved = Storage.getLastSelected(i);
                const current = SlotManager.getSelectedLabel(i);
                if (saved?.label && saved.label !== current) {
                    anyNeedsRestore = true;
                    break;
                }
            }

            if (!anyNeedsRestore) return;

            this._attempted = true;
            this._inProgress = true;

            try {
                // Restore each slot
                for (let i = 0; i < slotCount; i++) {
                    await this._restoreSlot(i);

                    // Small delay between slots
                    if (i < slotCount - 1) {
                        await delay(200);
                    }
                }
            } finally {
                // Release lock and focus chat input after Radix settles
                // Using 200ms delay to ensure Radix has finished its
                // focus management on dropdown close
                setTimeout(() => {
                    this._inProgress = false;

                    // Always focus chat input after auto-restore
                    // This is simpler and more reliable than tracking
                    // where focus was before (which is unreliable during
                    // mode switches, navigation, etc.)
                    ChatInput.focus();
                }, 200);
            }
        },

        // ----- Enforcement (Post-Navigation) -----

        /**
         * Initialize slot tracking for enforcement.
         * @param {number} slotCount
         * @private
         */
        _initEnforceSlots(slotCount) {
            this._enforce.slots = {};
            for (let i = 0; i < slotCount; i++) {
                this._enforce.slots[i] = { stableSince: 0, failedAttempts: 0 };
            }
        },

        /**
         * Cancel enforcement (timeout, user action, or success).
         * @param {string} [reason] - Reason for logging
         */
        cancelEnforcement(reason) {
            this._enforce.seq++;
            this._enforce.until = 0;
            this._enforce.minUntil = 0;
            this._enforce.lastAttemptAt = 0;
            this._enforce.slots = {};

            if (this._enforce.timer) {
                clearInterval(this._enforce.timer);
                this._enforce.timer = null;
            }

            if (reason) {
                console.debug('[Model Pinner] Enforcement canceled:', reason);
            }
        },

        /**
         * Start enforcement period after SPA navigation.
         * Monitors and re-applies model selection if Arena overrides it.
         * @param {string} [reason] - Reason for logging
         */
        async startEnforcement(reason) {
            this.cancelEnforcement();

            await ModeDetector.detect();

            if (!Storage.getAutoRestoreEnabled()) return;

            const slotCount = SlotManager.getCount();
            if (slotCount === 0) return;

            // Check if any slot has a saved model
            let anySaved = false;
            for (let i = 0; i < slotCount; i++) {
                const saved = Storage.getLastSelected(i);
                if (saved?.id && saved?.label) {
                    anySaved = true;
                    break;
                }
            }
            if (!anySaved) return;

            this._enforce.seq++;
            const seq = this._enforce.seq;

            // Enforcement window
            this._enforce.until = Date.now() + CONFIG.ENFORCE_DURATION;
            this._enforce.minUntil = Date.now() + CONFIG.ENFORCE_MIN_STABLE;
            this._enforce.lastAttemptAt = 0;
            this._initEnforceSlots(slotCount);

            console.debug('[Model Pinner] Enforcement armed:', reason || 'navigate', `(${slotCount} slots)`);

            this._enforce.timer = setInterval(() => {
                // Stale timer check
                if (seq !== this._enforce.seq) return;

                // Timeout
                if (Date.now() > this._enforce.until) {
                    this.cancelEnforcement('timeout');
                    return;
                }

                // Check if all slots have failed
                const currentSlotCount = SlotManager.getCount();
                let allFailed = true;
                for (let i = 0; i < currentSlotCount; i++) {
                    const slotState = this._enforce.slots[i];
                    if (!slotState || slotState.failedAttempts < 2) {
                        allFailed = false;
                        break;
                    }
                }
                if (allFailed && currentSlotCount > 0) {
                    this.cancelEnforcement('all slots failed');
                    return;
                }

                // Don't interfere if user has dropdown open
                const dropdown = document.querySelector(SELECTORS.DROPDOWN_WRAPPER);
                if (dropdown && !this._inProgress) return;

                // Check each slot
                let allMatched = true;
                let allStableEnough = true;

                for (let i = 0; i < currentSlotCount; i++) {
                    const saved = Storage.getLastSelected(i);
                    const current = SlotManager.getSelectedLabel(i);
                    const slotState = this._enforce.slots[i] || {
                        stableSince: 0,
                        failedAttempts: 0
                    };

                    if (!saved?.label) continue;

                    if (current === saved.label) {
                        // Slot matches
                        if (!slotState.stableSince) {
                            slotState.stableSince = Date.now();
                        }
                        this._enforce.slots[i] = slotState;

                        // Check stability duration
                        const stableTime = Date.now() - slotState.stableSince;
                        if (Date.now() < this._enforce.minUntil ||
                            stableTime < CONFIG.SLOT_STABLE_DURATION) {
                            allStableEnough = false;
                        }
                    } else {
                        // Slot doesn't match
                        allMatched = false;
                        slotState.stableSince = 0;
                        this._enforce.slots[i] = slotState;
                    }
                }

                if (allMatched && allStableEnough) {
                    this.cancelEnforcement('all slots matched');
                    return;
                }

                if (allMatched) {
                    // Matched but not stable yet, wait
                    return;
                }

                if (this._inProgress) return;

                // Throttle restore attempts
                if (Date.now() - this._enforce.lastAttemptAt < CONFIG.ENFORCE_THROTTLE) {
                    return;
                }
                this._enforce.lastAttemptAt = Date.now();

                this.attempt(true);
            }, 300);
        },

        // ----- Initialization -----

        /**
         * Initialize auto-restore on page load.
         * Waits for model selector buttons to appear.
         */
        async init() {
            await ModeDetector.detect();

            const startTime = Date.now();

            const checkInterval = setInterval(() => {
                const button = SlotManager.getButtons()[0];

                if (button) {
                    clearInterval(checkInterval);
                    setTimeout(() => this.attempt(), 400);
                    return;
                }

                if (Date.now() - startTime > CONFIG.RESTORE_TIMEOUT) {
                    clearInterval(checkInterval);
                }
            }, 100);
        },

        /**
         * Reset state for SPA navigation.
         */
        reset() {
            this._attempted = false;
        }
    };

    // ========================================================================
    // SECTION 17: MODEL SELECTION RECORDING
    // ========================================================================

    /**
     * Record user's model selection.
     * Attached to document click handler.
     */
    function setupSelectionRecording() {
        document.addEventListener('click', (e) => {
            // Ignore during auto-restore
            if (AutoRestore._inProgress) return;

            const target = e.target;
            if (!target) return;

            // Ignore our UI controls
            if (target.closest('.mp-controls') ||
                target.closest('.mp-btn') ||
                target.closest('.mp-autorestore-row')) {
                return;
            }

            // Ignore clicks right after drag
            if (DragDrop.isRecentDrag()) return;

            const item = target.closest(SELECTORS.CMDK_ITEM);
            if (!item) return;

            // Only record if inside dropdown
            if (!item.closest(SELECTORS.DROPDOWN_WRAPPER)) return;

            // User manually selected - cancel enforcement
            if (e.isTrusted) {
                AutoRestore.cancelEnforcement('user clicked model');
            }

            // Record selection
            const { id, label } = getModelInfo(item);
            if (id && label) {
                const slotIndex = SlotManager.getActiveIndex();
                Storage.setLastSelected(id, label, slotIndex);
            }
        }, true);
    }

    // ========================================================================
    // SECTION 18: SPA NAVIGATION DETECTION
    // ========================================================================

    /**
     * Handles SPA (Single Page Application) navigation detection.
     * Arena uses React Router, so we intercept history methods.
     */
    const Navigation = {
        /** @type {string} */
        _lastUrl: location.href,

        /**
         * Handle navigation event.
         * @private
         */
        _onNavigate() {
            const newUrl = location.href;
            if (newUrl === this._lastUrl) return;
            this._lastUrl = newUrl;

            // Invalidate caches
            ModeDetector.invalidate();
            PinManager.invalidate();
            ChatInput.invalidate();

            // Reset auto-restore for new page
            AutoRestore.reset();

            // Start enforcement
            AutoRestore.startEnforcement('spa navigation');
        },

        /**
         * Initialize navigation interception.
         */
        init() {
            // Intercept pushState
            const originalPushState = history.pushState;
            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                this._onNavigate();
            };

            // Intercept replaceState
            const originalReplaceState = history.replaceState;
            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                this._onNavigate();
            };

            // Handle back/forward
            window.addEventListener('popstate', () => this._onNavigate());
        }
    };

    // ========================================================================
    // SECTION 19: INITIALIZATION
    // ========================================================================

    /**
     * Main initialization function.
     * Sets up all modules and starts the script.
     */
    function init() {
        // Initialize observers (watches for dropdown)
        Observers.init();

        // Set up model selection recording
        setupSelectionRecording();

        // Initialize SPA navigation detection
        Navigation.init();

        // Initialize auto-restore
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => AutoRestore.init());
        } else {
            AutoRestore.init();
        }

        // Log startup
        console.log(
            `[Model Pinner] Loaded — ` +
            'Mode-aware + Slot-aware (SbS left/right independent) | Drag to reorder'
        );
    }

    // Start the script
    init();

})();