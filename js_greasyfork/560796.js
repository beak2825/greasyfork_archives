// ==UserScript==
// @name         LMArena | Model Manager: Pin, Reorder & Persistent Auto-Select
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.43
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Pin favorite models to the top of the model selection dropdown with persistent memory
// @match        *://*lmarena.ai/*
// @icon         https://lmarena.ai/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560796/LMArena%20%7C%20Model%20Manager%3A%20Pin%2C%20Reorder%20%20Persistent%20Auto-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/560796/LMArena%20%7C%20Model%20Manager%3A%20Pin%2C%20Reorder%20%20Persistent%20Auto-Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const STORAGE_KEY = 'lmarena_pinned_models_v1';
    const LAST_SELECTED_KEY = 'lmarena_last_selected_v2';
    const AUTO_RESTORE_ENABLED_KEY = 'lmarena_auto_restore_enabled_v2';
    const PIN_ORDER_BASE = -10000; // CSS order base for pinned items

    // ========================================
    // Mode Detector (API + URL based)
    // ========================================
    // Sources of truth:
    //   - New chats: URL params (mode, chat-modality)
    //   - Existing chats: API response (mode, maskedEvaluations[0].modality)
    // Storage key format: '{mode}_{modality}' e.g., 'direct_chat', 'direct_search'
    //
    const ModeDetector = {
        _cache: null,
        _cacheUrl: null,

        /**
         * Extract chat ID from URL, or null for new chats
         */
        _extractChatId() {
            const match = location.href.match(/\/(?:c|chat)\/([a-zA-Z0-9-]+)/);
            return (match && match[1] !== 'new') ? match[1] : null;
        },

        /**
         * Async detection of mode and modality.
         * For new chats: uses URL params
         * For existing chats: fetches from API
         */
        async detect() {
            // Return cached if URL hasn't changed
            if (this._cache && this._cacheUrl === location.href) {
                return this._cache;
            }

            const chatId = this._extractChatId();

            let mode = 'direct';
            let modality = 'chat';

            if (!chatId) {
                // New chat - use URL params
                const params = new URLSearchParams(location.search);
                mode = params.get('mode') || 'direct';
                modality = params.get('chat-modality') || 'chat';
                // Normalize: 'code' in URL → 'webdev' for consistency with API
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
         * Sync getter for storage key. Uses cached value.
         * Format: '{mode}_{modality}' e.g., 'direct_chat', 'direct_search'
         */
        getStorageKey() {
            if (!this._cache) return 'direct_chat';
            return `${this._cache.mode}_${this._cache.modality}`;
        },

        /**
         * Get human-readable modality label for UI
         */
        getModalityLabel() {
            if (!this._cache) return 'Chat';
            const labels = {
                'chat': 'Chat',
                'search': 'Search',
                'image': 'Image',
                'webdev': 'Code'
            };
            return labels[this._cache.modality] || this._cache.modality;
        },

        /**
         * Invalidate cache (call on URL change)
         */
        invalidate() {
            this._cache = null;
            this._cacheUrl = null;
        }
    };

    // ========================================
    // Storage Abstraction (GM-only)
    // ========================================
    const Storage = {
        /**
         * Get the full storage key for pinned models, scoped by modality.
         * Format: 'lmarena_pinned_models_v1_direct_chat', etc.
         */
        _getPinsStorageKey() {
            const modalityKey = ModeDetector.getStorageKey();
            return `${STORAGE_KEY}_${modalityKey}`;
        },

        get() {
            try {
                const fullKey = this._getPinsStorageKey();
                const raw = GM_getValue(fullKey, '{}');
                const data = JSON.parse(raw);
                return {
                    pinnedIds: Array.isArray(data.pinnedIds) ? data.pinnedIds : []
                };
            } catch {
                return { pinnedIds: [] };
            }
        },

        set(data) {
            try {
                const fullKey = this._getPinsStorageKey();
                GM_setValue(fullKey, JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Storage write failed:', e);
            }
        },

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

        getLastSelected() {
            const storageKey = ModeDetector.getStorageKey();
            const data = this._parseStoredObject(LAST_SELECTED_KEY);
            const entry = data[storageKey];
            if (!entry || !entry.id || !entry.label) return null;
            return entry;
        },

        setLastSelected(id, label) {
            if (!id || !label) return;
            try {
                const storageKey = ModeDetector.getStorageKey();
                const data = this._parseStoredObject(LAST_SELECTED_KEY);
                data[storageKey] = { id, label, savedAt: Date.now() };
                GM_setValue(LAST_SELECTED_KEY, JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Last-selected save failed:', e);
            }
        },

        getAutoRestoreEnabled() {
            const storageKey = ModeDetector.getStorageKey();
            const data = this._parseStoredObject(AUTO_RESTORE_ENABLED_KEY);
            return data[storageKey] !== false;
        },

        setAutoRestoreEnabled(enabled) {
            try {
                const storageKey = ModeDetector.getStorageKey();
                const data = this._parseStoredObject(AUTO_RESTORE_ENABLED_KEY);
                data[storageKey] = !!enabled;
                GM_setValue(AUTO_RESTORE_ENABLED_KEY, JSON.stringify(data));
            } catch (e) {
                console.warn('[Model Pinner] Auto-restore toggle save failed:', e);
            }
        },

        getModalityLabel() {
            return ModeDetector.getModalityLabel();
        }
    };

    // ========================================
    // Pin Manager
    // ========================================
    const PinManager = {
        _data: null,

        _load() {
            if (!this._data) {
                this._data = Storage.get();
            }
        },

        _save() {
            Storage.set(this._data);
        },

        /**
         * Invalidate cached pin data. Call when mode/modality changes.
         */
        invalidate() {
            this._data = null;
        },

        isPinned(id) {
            this._load();
            return this._data.pinnedIds.includes(id);
        },

        getPinnedIds() {
            this._load();
            return [...this._data.pinnedIds];
        },

        getOrder(id) {
            this._load();
            const idx = this._data.pinnedIds.indexOf(id);
            return idx === -1 ? 0 : PIN_ORDER_BASE + idx;
        },

        pin(id) {
            this._load();
            if (!this._data.pinnedIds.includes(id)) {
                this._data.pinnedIds.unshift(id);
                this._save();
            }
        },

        unpin(id) {
            this._load();
            const idx = this._data.pinnedIds.indexOf(id);
            if (idx !== -1) {
                this._data.pinnedIds.splice(idx, 1);
                this._save();
            }
        },

        toggle(id) {
            if (this.isPinned(id)) {
                this.unpin(id);
                return false;
            } else {
                this.pin(id);
                return true;
            }
        },

        moveTo(id, newIndex) {
            this._load();
            const oldIndex = this._data.pinnedIds.indexOf(id);
            if (oldIndex === -1 || oldIndex === newIndex) return false;
            
            this._data.pinnedIds.splice(oldIndex, 1);
            this._data.pinnedIds.splice(newIndex, 0, id);
            this._save();
            return true;
        },

        getIndex(id) {
            this._load();
            return this._data.pinnedIds.indexOf(id);
        }
    };

    // ========================================
    // Styles
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        /* ===== Dropdown Overrides ===== */
        
        /* Highest z-index */
        [data-radix-popper-content-wrapper] {
            z-index: 2147483647 !important;
        }

        /* Full viewport height */
        [data-radix-popper-content-wrapper] [cmdk-list] {
            max-height: calc(100vh - 120px) !important;
        }

        /* Auto width - no truncation */
        [data-radix-popper-content-wrapper] > [role="dialog"] {
            width: max-content !important;
            min-width: 400px !important;
            max-width: calc(100vw - 40px) !important;
        }

        /* Remove truncation from model names */
        [cmdk-item] span.truncate {
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: nowrap !important;
        }

        /* ===== Flex Layout for Items ===== */
        
        [cmdk-group-items] {
            display: flex !important;
            flex-direction: column !important;
        }

        /* ===== Controls Container ===== */
        
        .mp-controls {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-right: 8px;
            flex-shrink: 0;
        }

        /* ===== Shared Button Base ===== */
        
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

        [cmdk-item]:hover .mp-btn:not(.mp-pinned):not(.mp-dragging) {
            opacity: 0.5;
        }

        /* ===== Pin Button ===== */
        
        .mp-pin-btn.mp-pinned {
            opacity: 1;
            color: #f59e0b;
        }

        .mp-pin-btn.mp-pinned:hover {
            color: #d97706;
        }

        /* ===== Grip/Drag Handle ===== */
        
        .mp-grip-btn {
            cursor: grab;
            opacity: 0;
            pointer-events: none;
        }

        .mp-grip-btn:active,
        .mp-grip-btn.mp-grip-dragging {
            cursor: grabbing;
        }

        /* Drag clone styling - semi-transparent, no rotation */
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

        /* Drop indicator - very prominent */
        [cmdk-item].mp-drag-over::after,
        [cmdk-item].mp-drag-over-above::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
            border-radius: 2px;
            box-shadow: 0 0 12px 2px rgba(59, 130, 246, 0.6),
                        0 0 24px 4px rgba(59, 130, 246, 0.3);
            z-index: 1000;
            animation: mp-drop-pulse 0.8s ease-in-out infinite;
        }

        [cmdk-item].mp-drag-over::after {
            bottom: -2px;
        }

        [cmdk-item].mp-drag-over-above::before {
            top: -2px;
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

        /* Ensure items can show pseudo-elements */
        [cmdk-item] {
            position: relative;
        }

        /* Show grip only for pinned items on hover */
        [cmdk-item].mp-is-pinned:hover .mp-grip-btn {
            opacity: 0.4;
            pointer-events: auto;
        }

        [cmdk-item].mp-is-pinned .mp-grip-btn:hover {
            opacity: 0.8;
            background-color: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
        }

        /* ===== Drag States ===== */
        
        [cmdk-item].mp-dragging {
            opacity: 0.5;
            background-color: rgba(59, 130, 246, 0.1) !important;
            box-shadow: inset 3px 0 0 #3b82f6, 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        }

        [cmdk-item].mp-drag-over {
            box-shadow: inset 3px 0 0 #f59e0b, inset 0 -2px 0 #3b82f6 !important;
        }

        [cmdk-item].mp-drag-over-above {
            box-shadow: inset 3px 0 0 #f59e0b, inset 0 2px 0 #3b82f6 !important;
        }

        /* ===== Pinned Item Accent ===== */
        
        [cmdk-item].mp-is-pinned {
            box-shadow: inset 3px 0 0 #f59e0b;
        }

        /* ===== Auto-Restore Row (in dropdown) ===== */

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

        /* ===== Custom Tooltip ===== */
        
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

        /* ===== Invisible Auto-Restore Mask =====
           Prevents any visible dropdown flash while auto-restore
           opens the Radix popper and selects an item.
        */
        html.mp-restoring [data-radix-popper-content-wrapper],
        body.mp-restoring [data-radix-popper-content-wrapper] {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transform: translate(-200vw, -200vh) !important;
            transition: none !important;
        }

        /* ===== Disable All Dropdown/Menu Animations ===== */

        [data-radix-popper-content-wrapper],
        [data-radix-popper-content-wrapper] * {
            animation: none !important;
            animation-duration: 0s !important;
            transition: none !important;
            transition-duration: 0s !important;
        }

        [data-radix-popper-content-wrapper] > [role="dialog"],
        [data-radix-popper-content-wrapper] > [role="listbox"],
        [data-radix-popper-content-wrapper] > [role="menu"] {
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

        /* Radix specific animation classes */
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
        [cmdk-root],
        [cmdk-list],
        [cmdk-group],
        [cmdk-item] {
            animation: none !important;
            transition: none !important;
        }

    `;
    document.head.appendChild(style);

    // ========================================
    // Icon SVGs
    // ========================================
    const PIN_ICON_SVG = `
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
        </svg>`;

    const GRIP_ICON_SVG = `
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5.5" cy="3" r="1.5"/>
            <circle cx="10.5" cy="3" r="1.5"/>
            <circle cx="5.5" cy="8" r="1.5"/>
            <circle cx="10.5" cy="8" r="1.5"/>
            <circle cx="5.5" cy="13" r="1.5"/>
            <circle cx="10.5" cy="13" r="1.5"/>
        </svg>`;

    // ========================================
    // Tooltip System
    // ========================================
    let tooltipEl = null;
    let tooltipTimeout = null;

    function createTooltip() {
        if (tooltipEl) return tooltipEl;
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'mp-tooltip';
        document.body.appendChild(tooltipEl);
        return tooltipEl;
    }

    function showTooltip(target, text) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            const tip = createTooltip();
            tip.textContent = text;
            
            const rect = target.getBoundingClientRect();
            tip.style.left = rect.left + rect.width / 2 + 'px';
            tip.style.top = rect.bottom + 8 + 'px';
            tip.style.transform = 'translateX(-50%) translateY(4px)';
            
            requestAnimationFrame(() => {
                tip.classList.add('mp-tooltip-visible');
                tip.style.transform = 'translateX(-50%) translateY(0)';
            });
        }, 1000);
    }

    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        if (tooltipEl) {
            tooltipEl.classList.remove('mp-tooltip-visible');
        }
    }

    function attachTooltip(element, text) {
        element.addEventListener('mouseenter', () => showTooltip(element, text));
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousedown', hideTooltip);
    }

    // ========================================
    // DOM Utilities
    // ========================================
    function getModelInfo(item) {
        const id = item.getAttribute('data-value') || '';
        const span = item.querySelector('span.truncate');
        const label = span?.textContent?.trim() || item.textContent?.trim() || '';
        return { id, label };
    }

    // ========================================
    // Drag and Drop (Pointer-based, no HTML5 DnD)
    // ========================================
    // HTML5 Drag & Drop shows 🚫 cursor in the gap between dragstart
    // and first dragover. This is a browser limitation we cannot fix.
    // Instead, we use pointer events for a fully custom drag experience.

    let dragState = null;  // { id, item, grip, list, clone, offsetX, offsetY, pointerId }
    let recentDragEndTime = 0;  // Timestamp of last drag end, used to prevent post-drag selection

    /**
     * Calculate drop target information for drag reorder.
     * Returns the post-removal target index and visual indicator info.
     * 
     * Key insight: When cursor is above item X's midpoint, we want to insert
     * BEFORE X. But if the dragged item is already before X, removing it first
     * shifts X down, so we need to adjust the target index accordingly.
     */
    function calculateDropInfo(clientY, list, draggedId) {
        const draggedOriginalIndex = PinManager.getIndex(draggedId);
        const pinnedCount = PinManager.getPinnedIds().length;
        
        const pinnedItems = Array.from(list.querySelectorAll('[cmdk-item].mp-is-pinned'))
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

        // Determine insertion point based on cursor position relative to midpoints
        let insertBeforeIndex = pinnedCount; // Default: insert at end
        let indicatorItem = null;
        let indicatorBelow = false;
        
        for (let i = 0; i < pinnedItems.length; i++) {
            const item = pinnedItems[i];
            if (clientY < item.midY) {
                insertBeforeIndex = item.originalIndex;
                indicatorItem = item.el;
                indicatorBelow = false;
                break;
            }
        }
        
        if (insertBeforeIndex === pinnedCount && pinnedItems.length > 0) {
            // Cursor is below all midpoints, insert at end (after last item)
            indicatorItem = pinnedItems[pinnedItems.length - 1].el;
            indicatorBelow = true;
        }

        // Calculate actual target index for moveTo (post-removal index)
        // If dragged item is before the insertion point, removing it shifts everything down
        let targetIndex = insertBeforeIndex;
        if (draggedOriginalIndex < insertBeforeIndex) {
            targetIndex--;
        }
        
        // Clamp to valid range
        targetIndex = Math.max(0, Math.min(targetIndex, pinnedCount - 1));
        
        return {
            targetIndex,
            wouldChange: targetIndex !== draggedOriginalIndex,
            indicatorItem,
            indicatorBelow
        };
    }

    function clearDragOverStates(list) {
        list.querySelectorAll('.mp-drag-over, .mp-drag-over-above').forEach(el => {
            el.classList.remove('mp-drag-over', 'mp-drag-over-above');
        });
    }

    function cleanupDragVisuals() {
        if (!dragState) return;
        const { item, grip, list, clone } = dragState;

        item.classList.remove('mp-dragging');
        grip.classList.remove('mp-grip-dragging');
        clone.remove();
        clearDragOverStates(list);
    }

    function updateDragOverStates(clientY, list, draggedId) {
        clearDragOverStates(list);

        const info = calculateDropInfo(clientY, list, draggedId);
        
        // Only show indicator if drop would actually cause a reorder
        if (!info.wouldChange || !info.indicatorItem) {
            return;
        }
        
        if (info.indicatorBelow) {
            info.indicatorItem.classList.add('mp-drag-over');
        } else {
            info.indicatorItem.classList.add('mp-drag-over-above');
        }
    }

    function setupDragHandlers(grip, item, id) {
        grip.addEventListener('pointerdown', (e) => {
            if (!PinManager.isPinned(id)) return;
            if (e.button !== 0) return;  // Left click only

            e.preventDefault();
            e.stopPropagation();

            const list = item.closest('[cmdk-list]');
            if (!list) return;

            // Capture pointer for reliable tracking
            grip.setPointerCapture(e.pointerId);

            // Create floating clone for drag visual
            const rect = item.getBoundingClientRect();
            const clone = item.cloneNode(true);
            
            // Remove dataset flags so clone doesn't interfere
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

            // Mark original as dragging
            item.classList.add('mp-dragging');
            grip.classList.add('mp-grip-dragging');

            dragState = {
                id,
                item,
                grip,
                list,
                clone,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top,
                pointerId: e.pointerId
            };

            hideTooltip();
        });

        grip.addEventListener('pointermove', (e) => {
            if (!dragState || dragState.id !== id) return;

            const { clone, list, offsetX, offsetY } = dragState;
            
            // Update clone position - keep cursor at grab point
            clone.style.left = (e.clientX - offsetX) + 'px';
            clone.style.top = (e.clientY - offsetY) + 'px';

            // Update drop target indicators
            updateDragOverStates(e.clientY, list, id);
        });

        grip.addEventListener('pointerup', (e) => {
            if (!dragState || dragState.id !== id) return;

            const { grip: g, list, pointerId } = dragState;

            try {
                g.releasePointerCapture(pointerId);
            } catch {}

            const targetIndex = calculateDropInfo(e.clientY, list, id).targetIndex;

            cleanupDragVisuals();

            if (PinManager.moveTo(id, targetIndex)) {
                applyPinOrder();
            }

            dragState = null;
            recentDragEndTime = Date.now();
        });

        grip.addEventListener('pointercancel', () => {
            if (!dragState || dragState.id !== id) return;

            const { grip: g, pointerId } = dragState;

            try {
                g.releasePointerCapture(pointerId);
            } catch {}

            cleanupDragVisuals();
            dragState = null;
        });

        // Prevent text selection during drag
        grip.addEventListener('selectstart', (e) => {
            if (dragState) e.preventDefault();
        });

        // Prevent grip clicks from propagating to item (would cause selection + menu close)
        grip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, true);
    }

    function createPinButton(id, isPinned) {
        const btn = document.createElement('span');
        btn.className = 'mp-btn mp-pin-btn' + (isPinned ? ' mp-pinned' : '');
        btn.innerHTML = PIN_ICON_SVG;

        attachTooltip(btn, isPinned ? 'Unpin model' : 'Pin to top');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            PinManager.toggle(id);
            applyPinOrder();
        });

        return btn;
    }

    function createGripButton() {
        const btn = document.createElement('span');
        btn.className = 'mp-btn mp-grip-btn';
        btn.innerHTML = GRIP_ICON_SVG;
        
        attachTooltip(btn, 'Drag to reorder');

        return btn;
    }

    function createControlsContainer(id, isPinned, item) {
        const container = document.createElement('span');
        container.className = 'mp-controls';

        const grip = createGripButton();
        const pinBtn = createPinButton(id, isPinned);

        container.appendChild(grip);
        container.appendChild(pinBtn);

        setupDragHandlers(grip, item, id);

        return container;
    }

    // ========================================
    // Core Logic
    // ========================================
    function applyPinOrder() {
        const items = document.querySelectorAll('[cmdk-item]');
        items.forEach(item => {
            // Skip the floating drag clone (it's also a [cmdk-item])
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

            // Keep pin button in sync (important after SPA nav / mode changes)
            const btn = item.querySelector('.mp-pin-btn');
            if (btn) {
                btn.classList.toggle('mp-pinned', isPinned);
            }
        });
    }

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

        // Create and insert controls container (grip + pin button)
        const controls = createControlsContainer(id, isPinned, item);
        const firstChild = item.firstElementChild;
        if (firstChild) {
            item.insertBefore(controls, firstChild);
        } else {
            item.prepend(controls);
        }
    }

    function createAutoRestoreRow() {
        const row = document.createElement('div');
        row.className = 'mp-autorestore-row';

        const label = document.createElement('label');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.tabIndex = -1; // Prevent stealing focus from search
        cb.checked = Storage.getAutoRestoreEnabled();
        cb.addEventListener('change', () => {
            Storage.setAutoRestoreEnabled(cb.checked);
        });

        // Wrap text + model name in container for seamless flow (no gap between them)
        const content = document.createElement('span');
        content.className = 'mp-label-content';

        const text = document.createElement('span');
        text.className = 'mp-label-text';
        text.textContent = 'Auto-select last chosen model';

        const saved = Storage.getLastSelected();
        const modeLabel = Storage.getModalityLabel();

        const hint = document.createElement('span');
        hint.className = 'mp-saved-model';
        if (saved?.label) {
            hint.textContent = `: ${saved.label}`;
            hint.title = `${modeLabel}: ${saved.label}`;
        } else {
            hint.textContent = '';
            hint.title = modeLabel;
        }

        content.appendChild(text);
        content.appendChild(hint);

        label.appendChild(cb);
        label.appendChild(content);
        row.appendChild(label);

        // Explicit click handler - native label toggle may be blocked by Radix/cmdk
        label.addEventListener('click', (e) => {
            if (e.target === cb) return; // Let checkbox handle its own clicks
            e.preventDefault();
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Handle clicks on row padding (outside label)
        row.addEventListener('click', (e) => {
            if (e.target === cb) return;
            if (e.target.closest('label')) return; // Label handler takes care of it
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        });

        return row;
    }

    function injectAutoRestoreRow(wrapper) {
        // Don't recreate if already exists - recreating mid-click breaks event synthesis
        // (mousedown on old element, mouseup on new element = no click event)
        const existing = wrapper.querySelector('.mp-autorestore-row');
        if (existing) return;

        const list = wrapper.querySelector('[cmdk-list]');
        if (!list) return;

        const row = createAutoRestoreRow();
        list.insertBefore(row, list.firstChild);
    }

    async function processDropdown(wrapper) {
        // Ensure mode is detected before processing pins
        // (Storage.get() depends on ModeDetector.getStorageKey())
        await ModeDetector.detect();

        injectAutoRestoreRow(wrapper);
        const items = document.querySelectorAll('[cmdk-item]');
        items.forEach(enhanceItem);
        applyPinOrder();
    }

    // ========================================
    // Observers
    // ========================================
    let dropdownObserver = null;
    let debounceTimer = null;

    let currentWrapper = null;

    function debouncedProcess() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (currentWrapper) processDropdown(currentWrapper);
        }, 30);
    }

    function watchDropdown(wrapper) {
        if (dropdownObserver) {
            dropdownObserver.disconnect();
        }

        currentWrapper = wrapper;

        const list = wrapper.querySelector('[cmdk-list]');
        if (!list) return;

        dropdownObserver = new MutationObserver(debouncedProcess);
        dropdownObserver.observe(list, {
            childList: true,
            subtree: true
        });

        // Also watch input for search changes
        const input = wrapper.querySelector('[cmdk-input]');
        if (input && !input.dataset.mpInputBound) {
            input.dataset.mpInputBound = 'true';
            input.addEventListener('input', debouncedProcess);
        }

        processDropdown(wrapper);
    }

    // Main observer for dropdown appearance
    const bodyObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                const wrapper = node.matches?.('[data-radix-popper-content-wrapper]')
                    ? node
                    : node.querySelector?.('[data-radix-popper-content-wrapper]');

                if (wrapper?.querySelector('[cmdk-list]')) {
                    watchDropdown(wrapper);
                }
            }

            for (const node of mutation.removedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.matches?.('[data-radix-popper-content-wrapper]') ||
                    node.querySelector?.('[data-radix-popper-content-wrapper]')) {
                    if (dropdownObserver) {
                        dropdownObserver.disconnect();
                        dropdownObserver = null;
                    }
                    currentWrapper = null;
                }
            }
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Handle already-open dropdown on script load
    const existing = document.querySelector('[data-radix-popper-content-wrapper]');
    if (existing?.querySelector('[cmdk-list]')) {
        watchDropdown(existing);
    }

    // ========================================
    // Last Selected Model Memory + Auto-Restore Toggle
    // ========================================

    let mpAutoRestoreAttempted = false;
    let mpAutoRestoreInProgress = false;

    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
    }

    function getVisibleModelSelectorButtons() {
        return Array.from(document.querySelectorAll('button[role="combobox"][aria-haspopup="dialog"]'))
            .filter(isElementVisible);
    }

    function getCurrentlySelectedLabel() {
        const buttons = getVisibleModelSelectorButtons();
        for (const btn of buttons) {
            const labelSpan = btn.querySelector('span.min-w-0.truncate, span.truncate');
            const text = labelSpan?.textContent?.trim();
            if (text) return text;
        }
        return null;
    }

    function recordLastSelectedFromItem(item) {
        if (!item) return;
        const { id, label } = getModelInfo(item);
        if (!id || !label) return;
        Storage.setLastSelected(id, label);
    }

    // Record model selection (mouse) — ignore our own UI + pin controls
    document.addEventListener('click', (e) => {
        if (mpAutoRestoreInProgress) return;

        const target = e.target;
        if (!target) return;

        // Ignore our UI (pin/grip controls + the auto-restore row inside the dropdown)
        if (target.closest('.mp-controls') || target.closest('.mp-btn') || target.closest('.mp-autorestore-row')) {
            return;
        }

        // Ignore clicks that happen immediately after a drag operation
        if (Date.now() - recentDragEndTime < 150) {
            return;
        }

        const item = target.closest('[cmdk-item]');
        if (!item) return;

        // Only treat it as "model selection" if inside the dropdown popper
        if (!item.closest('[data-radix-popper-content-wrapper]')) return;

        // If the user is manually selecting a model, stop any SPA enforcement attempts.
        if (e.isTrusted) {
            cancelEnforcedAutoRestore('user clicked model');
        }

        recordLastSelectedFromItem(item);
    }, true);

    // ===== Auto-Restore Logic =====

    function setRestoreMask(enabled) {
        try { document.documentElement.classList.toggle('mp-restoring', !!enabled); } catch {}
        try { document.body?.classList.toggle('mp-restoring', !!enabled); } catch {}
    }

    function waitForDropdownRemoved(timeoutMs) {
        return new Promise((resolve) => {
            const exists = () => !!document.querySelector('[data-radix-popper-content-wrapper]');

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
                    clearTimeout(to);
                    resolve(true);
                }
            });

            obs.observe(root, { childList: true, subtree: true });

            const to = setTimeout(() => {
                obs.disconnect();
                resolve(!exists());
            }, timeoutMs);
        });
    }

    function closeDropdownIfOpen() {
        // Escape only. Clicking the combobox as a "fallback close" can accidentally re-open.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }

    function waitForCmdkItemAndSelect(targetId, timeoutMs) {
        return new Promise((resolve) => {
            const tryClick = () => {
                const item = document.querySelector(
                    `[data-radix-popper-content-wrapper] [cmdk-item][data-value="${targetId}"]`
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
                    clearTimeout(to);
                    resolve(true);
                }
            });

            obs.observe(document.body, { childList: true, subtree: true });

            const to = setTimeout(() => {
                obs.disconnect();
                resolve(false);
            }, timeoutMs);
        });
    }

    async function attemptAutoRestore(force = false) {
        if (mpAutoRestoreInProgress) return;
        if (!force && mpAutoRestoreAttempted) return;

        // Ensure mode is detected before accessing storage
        await ModeDetector.detect();

        if (!Storage.getAutoRestoreEnabled()) return;

        const saved = Storage.getLastSelected();
        if (!saved || !saved.id || !saved.label) return;

        const currentLabel = getCurrentlySelectedLabel();
        if (currentLabel && currentLabel === saved.label) return;

        const button = getVisibleModelSelectorButtons()[0];
        if (!button) return;

        mpAutoRestoreAttempted = true;
        mpAutoRestoreInProgress = true;

        // Enable mask BEFORE opening dropdown to prevent flash
        setRestoreMask(true);

        try {
            const isOpen = button.getAttribute('data-state') === 'open' || button.getAttribute('aria-expanded') === 'true';
            if (!isOpen) {
                button.click();
            }

            // Wait for dropdown to appear and check if model exists in this mode
            const modelExists = await waitForModelInDropdown(saved.id, 1000);

            if (!modelExists) {
                // Model not available in this mode, close and stop trying
                closeDropdownIfOpen();

                // Keep masked until dropdown is actually removed
                await waitForDropdownRemoved(1200);

                // Cancel enforcement since model doesn't exist in this mode
                cancelEnforcedAutoRestore('model not available in current mode');
                return;
            }

            const ok = await waitForCmdkItemAndSelect(saved.id, 500);

            // Ensure dropdown closes
            closeDropdownIfOpen();

            // Wait for dropdown to be removed before unmasking
            await waitForDropdownRemoved(1200);

            if (!ok) {
                mpEnforce.failedAttempts++;
            }
        } finally {
            // Only unmask after dropdown is gone
            setRestoreMask(false);

            // Give Radix time to settle, then release lock
            setTimeout(() => {
                mpAutoRestoreInProgress = false;
            }, 150);
        }
    }

    /**
     * Wait for dropdown to appear and check if a specific model ID exists
     */
    function waitForModelInDropdown(targetId, timeoutMs) {
        return new Promise((resolve) => {
            const checkExists = () => {
                const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
                if (!wrapper) return false;
                
                const item = wrapper.querySelector(`[cmdk-item][data-value="${targetId}"]`);
                return !!item;
            };

            // Fast path
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
                
                // Also resolve false if dropdown appeared but model isn't there
                const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
                const hasItems = wrapper?.querySelector('[cmdk-item]');
                if (wrapper && hasItems) {
                    // Dropdown loaded with items, but our model isn't there
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
    }

    async function initAutoRestore() {
        // Detect mode first (required for Storage methods)
        await ModeDetector.detect();

        const start = Date.now();
        const timeoutMs = 10000;

        const timer = setInterval(() => {
            const button = getVisibleModelSelectorButtons()[0];
            if (button) {
                clearInterval(timer);
                setTimeout(() => { attemptAutoRestore(); }, 400);
                return;
            }

            if (Date.now() - start > timeoutMs) {
                clearInterval(timer);
            }
        }, 100);
    }

    // ===== SPA Navigation Detection + Post-Navigation Enforcement =====
    //
    // Your logs show LMArena applies a per-chat model ~1.1s after SPA navigation.
    // If we restore too early, LMArena overwrites it. So we "enforce" for a short window
    // after navigation: if the model diverges from the user's last saved selection,
    // we re-apply it (throttled), until it's stable long enough or we time out.

    let lastUrl = location.href;

    const mpEnforce = {
        seq: 0,
        timer: null,
        until: 0,
        minUntil: 0,
        lastAttemptAt: 0,
        stableSince: 0,
        failedAttempts: 0
    };

    function cancelEnforcedAutoRestore(reason) {
        mpEnforce.seq++;
        mpEnforce.until = 0;
        mpEnforce.minUntil = 0;
        mpEnforce.lastAttemptAt = 0;
        mpEnforce.stableSince = 0;
        mpEnforce.failedAttempts = 0;

        if (mpEnforce.timer) {
            clearInterval(mpEnforce.timer);
            mpEnforce.timer = null;
        }

        if (reason) {
            console.debug('[Model Pinner] Auto-restore enforcement canceled:', reason);
        }
    }

    async function startEnforcedAutoRestore(reason) {
        cancelEnforcedAutoRestore();

        // Detect mode first (required for Storage methods)
        await ModeDetector.detect();

        if (!Storage.getAutoRestoreEnabled()) return;

        const saved = Storage.getLastSelected();
        if (!saved || !saved.id || !saved.label) return;

        mpEnforce.seq++;
        const seq = mpEnforce.seq;

        // Keep watching long enough to catch LMArena's delayed per-chat restore
        mpEnforce.until = Date.now() + 9000;
        // Don't "declare victory" too early (label may match briefly before LMArena flips it)
        mpEnforce.minUntil = Date.now() + 2500;

        mpEnforce.lastAttemptAt = 0;
        mpEnforce.stableSince = 0;
        mpEnforce.failedAttempts = 0;

        console.debug('[Model Pinner] Auto-restore enforcement armed:', reason || 'navigate');

        mpEnforce.timer = setInterval(() => {
            if (seq !== mpEnforce.seq) return;

            if (Date.now() > mpEnforce.until) {
                cancelEnforcedAutoRestore('timeout');
                return;
            }

            // If too many failed attempts (model likely not in this mode), stop
            if (mpEnforce.failedAttempts >= 2) {
                cancelEnforcedAutoRestore('model not available after retries');
                return;
            }

            // If the user has the dropdown open (and not from auto-restore), don't fight their UI interaction.
            const dropdown = document.querySelector('[data-radix-popper-content-wrapper]');
            if (dropdown && !mpAutoRestoreInProgress) return;

            const savedNow = Storage.getLastSelected();
            if (!savedNow || !savedNow.label) return;

            const currentLabel = getCurrentlySelectedLabel();

            if (currentLabel && currentLabel === savedNow.label) {
                // Only stop after it has been stable AND we're past the minimum window.
                if (!mpEnforce.stableSince) mpEnforce.stableSince = Date.now();
                if (Date.now() >= mpEnforce.minUntil && (Date.now() - mpEnforce.stableSince) > 1200) {
                    cancelEnforcedAutoRestore('model matched');
                }
                return;
            }

            mpEnforce.stableSince = 0;

            if (mpAutoRestoreInProgress) return;

            // Throttle attempts so we don't spam-open the dropdown.
            if (Date.now() - mpEnforce.lastAttemptAt < 1500) return;
            mpEnforce.lastAttemptAt = Date.now();

            attemptAutoRestore(true);
        }, 300);
    }

    function onNavigate() {
        const newUrl = location.href;
        if (newUrl === lastUrl) return;
        lastUrl = newUrl;

        // Invalidate caches on navigation (new page = new mode detection needed)
        ModeDetector.invalidate();
        PinManager.invalidate();

        // Reset attempt flag so we can restore again on each SPA nav
        mpAutoRestoreAttempted = false;

        startEnforcedAutoRestore('spa navigation');
    }

    // Intercept pushState/replaceState
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        onNavigate();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        onNavigate();
    };

    window.addEventListener('popstate', onNavigate);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoRestore);
    } else {
        initAutoRestore();
    }

    console.log('[Model Pinner] v1.43 Loaded — Mode-aware via API (Chat/Search/Image/Code) | Drag to reorder');
})();