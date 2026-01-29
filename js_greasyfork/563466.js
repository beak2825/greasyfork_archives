// ==UserScript==
// @name            LMArena Chat Navigator
// @name:en         LMArena Chat Navigator
// @name:zh-TW      LMArena 聊天導航器
// @namespace       https://github.com/users/Marx-Einstein/projects/1
// @version         1.0.0
// @description     An elegant floating navigator for LMArena chat. Features: quick navigation, favorites with batch operations, search, customizable keyboard shortcuts, dynamic density indicator with Dock-like fisheye effect, and more.
// @description:en  An elegant floating navigator for LMArena chat. Features: quick navigation, favorites with batch operations, search, customizable keyboard shortcuts, dynamic density indicator with Dock-like fisheye effect, and more.
// @author          Marx Einstein
// @match           https://arena.ai/*
// @match           https://beta.lmarena.ai/*
// @icon            https://arena.ai/favicon.ico
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @grant           GM.addStyle
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           GM.registerMenuCommand
// @license         MIT
// @homepageURL     https://github.com/users/Marx-Einstein/projects/1
// @supportURL      https://github.com/users/Marx-Einstein/projects/1/issues
// @downloadURL https://update.greasyfork.org/scripts/563466/LMArena%20Chat%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/563466/LMArena%20Chat%20Navigator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (window.__LMARENA_CHAT_NAV_LOADED__) return;
    window.__LMARENA_CHAT_NAV_LOADED__ = true;

    const DEBUG = false;
    const log = (...args) => { if (DEBUG) console.log('[LMArena Nav]', ...args); };

    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        CONTAINER_ID: "lm-nav-container",
        INDICATOR_ID: "lm-nav-indicator",
        WRAPPER_ID: "lm-nav-wrapper",
        PANEL_ID: "lm-nav-panel",
        FAB_ID: "lm-nav-fab",
        JIGGLE_CLASS: "lm-nav-jiggle",

        PANEL_WIDTH: 360,
        PREVIEW_LENGTH: 50,
        PAGE_SIZE: 20,

        INDICATOR_STANDARD_PITCH: 6,
        INDICATOR_MIN_PITCH: 1.5,
        INDICATOR_CROWDED_THRESHOLD: 50,

        FISHEYE_RADIUS_RATIO: 0.25,
        FISHEYE_MIN_RADIUS: 30,
        FISHEYE_MAX_RADIUS: 80,
        FISHEYE_MAX_SCALE: 2.0,

        INIT_DELAY: 1800,
        UPDATE_DEBOUNCE: 400,
        SCROLL_THROTTLE: 80,
        JIGGLE_DURATION: 320,
        HOVER_SHOW_DELAY: 250,
        HOVER_HIDE_DELAY: 400,
        PROXIMITY_THRESHOLD: 50,
        AUTO_HIDE_DELAY: 600,

        STORAGE_KEY_FAVORITES: "lm_nav_favorites_v3",
        STORAGE_KEY_SETTINGS: "lm_nav_settings_v6",
        STORAGE_KEY_FAB_POSITION: "lm_nav_fab_pos_v2",
        STORAGE_KEY_PANEL_POSITION: "lm_nav_panel_pos_v2",
        STORAGE_KEY_INDICATOR_POSITION: "lm_nav_indicator_pos_v1",
        STORAGE_KEY_ONBOARDING: "lm_nav_onboarding_v2",
        STORAGE_KEY_PANEL_SIZE: "lm_nav_panel_size_v1",
        STORAGE_KEY_KEYBINDINGS: "lm_nav_keybindings_v2",

        Z_INDEX: {
            INDICATOR: 2147483640,
            PANEL: 2147483643,
            FAB: 2147483646,
            MENU: 2147483650,
            DIALOG: 2147483655,
            TOAST: 2147483665,
        },

        MSG_LENGTH_THRESHOLDS: { SHORT: 100, MEDIUM: 500, LONG: 2000 },
    };

    const DEFAULT_SETTINGS = {
        fabOpacity: 90,
        indicatorOpacity: 80,
        fabScale: 100,
        fontSize: 13,
        fontFamily: 'system',
        showFab: true,
        showIndicator: true,
        autoHideFab: false,
        autoHideIndicator: false,
        enableAnimation: true,
        showAIMessages: false,
        showAIInIndicator: true,
        paginatePanel: true,
        reversedOrder: false,
        scrollPosition: 'start',
        hoverShowPanel: true,
        indicatorShowLength: true,
        indicatorShowFavorites: true,
        panelView: 'messages',
        panelState: 'hidden',
    };

    const DEFAULT_FAB_POSITION = { bottom: 24, right: 24 };
    const DEFAULT_PANEL_POSITION = { top: null, left: null };
    const DEFAULT_INDICATOR_POSITION = { edge: 'right', top: 100 };
    const DEFAULT_PANEL_SIZE = { width: 360, height: 420 };

    const FONT_OPTIONS = {
        system: { label: '系統預設', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
        serif: { label: '襯線體', value: 'Georgia, "Times New Roman", serif' },
        mono: { label: '等寬字型', value: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' },
        rounded: { label: '圓體', value: '"SF Pro Rounded", "Nunito", "Varela Round", sans-serif' },
    };

    const FONT_SIZE_OPTIONS = [
        { label: '小', value: 12 },
        { label: '中', value: 13 },
        { label: '大', value: 14 },
        { label: '特大', value: 15 },
    ];

    const DEFAULT_KEYBINDINGS = {
        togglePanel: { key: 'n', alt: true, ctrl: false, shift: false, meta: false },
        toggleSettings: { key: 's', alt: true, ctrl: false, shift: false, meta: false },
        navigateUp: { key: 'ArrowUp', alt: true, ctrl: false, shift: false, meta: false },
        navigateDown: { key: 'ArrowDown', alt: true, ctrl: false, shift: false, meta: false },
        navigateFirst: { key: '[', alt: true, ctrl: false, shift: false, meta: false },
        navigateLast: { key: ']', alt: true, ctrl: false, shift: false, meta: false },
        toggleOrder: { key: 'r', alt: true, ctrl: false, shift: false, meta: false },
        loadHistory: { key: 'l', alt: true, ctrl: false, shift: false, meta: false },
        toggleView: { key: 'f', alt: true, ctrl: false, shift: false, meta: false },
        toggleFavManager: { key: 'm', alt: true, ctrl: false, shift: false, meta: false },
        toggleIndicatorEdge: { key: 'i', alt: true, ctrl: false, shift: false, meta: false },
        togglePanelPin: { key: 'p', alt: true, ctrl: false, shift: false, meta: false },
        toggleAIMessages: { key: 'a', alt: true, ctrl: false, shift: false, meta: false },
    };

    const KEYBINDING_LABELS = {
        togglePanel: '開關導航板',
        toggleSettings: '開關設定',
        navigateUp: '上一條消息',
        navigateDown: '下一條消息',
        navigateFirst: '跳到第一條',
        navigateLast: '跳到最後一條',
        toggleOrder: '切換排序',
        loadHistory: '載入歷史',
        toggleView: '切換消息/收藏',
        toggleFavManager: '開關收藏夾',
        toggleIndicatorEdge: '移動指示條',
        togglePanelPin: '固定/取消固定導航板',
        toggleAIMessages: '顯示/隱藏 AI 回覆',
    };

    // ========================================
    // Utilities
    // ========================================
    const utils = {
        debounce(fn, wait) {
            let timeout;
            return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), wait); };
        },
        throttle(fn, limit) {
            let inThrottle;
            return (...args) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => (inThrottle = false), limit); } };
        },
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),
        getElementSide(element) {
            if (!element) return 'right';
            const rect = element.getBoundingClientRect();
            return (rect.left + rect.width / 2) < window.innerWidth / 2 ? 'left' : 'right';
        },
        calculatePanelPosition(anchor, panelWidth, panelHeight, margin = 12) {
            if (!anchor) return { left: window.innerWidth - panelWidth - 20, top: (window.innerHeight - panelHeight) / 2 };
            const rect = anchor.getBoundingClientRect();
            const side = utils.getElementSide(anchor);
            let left = side === 'right' ? rect.left - panelWidth - margin : rect.right + margin;
            if (left < margin || left + panelWidth > window.innerWidth - margin) {
                left = side === 'right' ? rect.right + margin : rect.left - panelWidth - margin;
            }
            left = utils.clamp(left, margin, window.innerWidth - panelWidth - margin);
            const top = utils.clamp(rect.top, margin, window.innerHeight - panelHeight - margin);
            return { left, top };
        },
        async copyToClipboard(text) {
            if (!text || typeof text !== 'string') return false;
            try {
                if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            } catch (e) { log('copy failed:', e); return false; }
        },
        truncate(text, maxLength) {
            if (!text) return '';
            text = text.trim();
            return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + '...';
        },
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        highlightText(text, query) {
            if (!query) return utils.escapeHtml(text);
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerText.indexOf(lowerQuery);
            if (index === -1) return utils.escapeHtml(text);
            const before = text.substring(0, index);
            const match = text.substring(index, index + query.length);
            const after = text.substring(index + query.length);
            return `${utils.escapeHtml(before)}<mark class="lm-nav-highlight">${utils.escapeHtml(match)}</mark>${utils.escapeHtml(after)}`;
        },
        formatRelativeTime(timestamp) {
            const diff = Date.now() - timestamp;
            if (diff < 60000) return '剛剛';
            if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        },
    };

    // ========================================
    // Storage Adapter
    // ========================================
    const storage = {
        _gm4Cache: {},
        _gm4Loaded: false,
        hasGM() { return typeof GM_setValue !== 'undefined' && typeof GM_getValue !== 'undefined'; },
        hasGM4() { return typeof GM !== 'undefined' && typeof GM.setValue === 'function' && typeof GM.getValue === 'function'; },
        set(key, value) {
            try {
                if (this.hasGM()) { GM_setValue(key, value); return true; }
                if (this.hasGM4()) { GM.setValue(key, value); this._gm4Cache[key] = value; return true; }
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) { log('storage set failed:', e); return false; }
        },
        get(key, defaultValue = null) {
            try {
                if (this.hasGM()) return GM_getValue(key, defaultValue);
                if (this.hasGM4()) return key in this._gm4Cache ? this._gm4Cache[key] : defaultValue;
                const value = localStorage.getItem(key);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) { log('storage get failed:', e); return defaultValue; }
        },
        async preloadGM4() {
            if (!this.hasGM4() || this._gm4Loaded) return;
            const keys = [
                CONFIG.STORAGE_KEY_SETTINGS, CONFIG.STORAGE_KEY_FAVORITES, CONFIG.STORAGE_KEY_FAB_POSITION,
                CONFIG.STORAGE_KEY_PANEL_POSITION, CONFIG.STORAGE_KEY_INDICATOR_POSITION, CONFIG.STORAGE_KEY_PANEL_SIZE,
                CONFIG.STORAGE_KEY_ONBOARDING, CONFIG.STORAGE_KEY_KEYBINDINGS,
                'lm_nav_settings_v5', 'lm_nav_settings_v4', 'lm_nav_keybindings_v1',
            ];
            try {
                const results = await Promise.all(keys.map(k => GM.getValue(k)));
                keys.forEach((k, i) => { if (results[i] !== undefined) this._gm4Cache[k] = results[i]; });
                this._gm4Loaded = true;
            } catch (e) { log('GM4 preload failed:', e); }
        },
        remove(key) {
            try {
                if (this.hasGM() && typeof GM_deleteValue === 'function') GM_deleteValue(key);
                else if (this.hasGM4() && typeof GM.deleteValue === 'function') { GM.deleteValue(key); delete this._gm4Cache[key]; }
                else localStorage.removeItem(key);
            } catch (e) { log('storage remove failed:', e); }
        },
    };

    const addStyle = (css) => {
        if (typeof GM_addStyle === 'function') { try { GM_addStyle(css); return true; } catch (e) {} }
        if (typeof GM !== 'undefined' && typeof GM.addStyle === 'function') { try { GM.addStyle(css); return true; } catch (e) {} }
        try {
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.setAttribute('data-source', 'lm-nav-injected');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
            return true;
        } catch (e) { return false; }
    };

    const registerMenuCommands = (app) => {
        let register = typeof GM_registerMenuCommand === 'function' ? GM_registerMenuCommand :
            (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function' ? (...args) => GM.registerMenuCommand(...args) : null);
        if (!register) return;
        try {
            register('📋 開關導航板', () => app.togglePanel());
            register('⚙️ 開關設定', () => app.toggleSettings());
            register('⭐ 開關收藏夾', () => app.toggleFavoriteManager());
            register('🔄 重新載入消息', () => { app.updateMessages(); app._toast?.success?.('已重新載入'); });
            register('📍 重置所有位置', () => { app.resetAllPositions(); app._toast?.success?.('位置已重置'); });
        } catch (e) {}
    };

    // ========================================
    // Settings Manager
    // ========================================
    const Settings = {
        _cache: null,
        _listeners: [],
        load() {
            if (this._cache) return this._cache;
            const saved = storage.get(CONFIG.STORAGE_KEY_SETTINGS, null);
            this._cache = { ...DEFAULT_SETTINGS, ...(saved || {}) };
            if (this._cache.navMode !== undefined) {
                switch (this._cache.navMode) {
                    case 'fab': this._cache.showFab = true; this._cache.showIndicator = false; break;
                    case 'indicator': this._cache.showFab = false; this._cache.showIndicator = true; break;
                    case 'minimal': this._cache.showFab = true; this._cache.showIndicator = true; this._cache.autoHideFab = true; this._cache.autoHideIndicator = true; break;
                }
                delete this._cache.navMode;
            }
            if (this._cache.showAIInIndicator === undefined) this._cache.showAIInIndicator = true;
            if (this._cache.paginatePanel === undefined && this._cache.paginateFavorites !== undefined) this._cache.paginatePanel = this._cache.paginateFavorites;
            if (this._cache.indicatorShowLength === undefined) this._cache.indicatorShowLength = true;
            if (this._cache.indicatorShowFavorites === undefined) this._cache.indicatorShowFavorites = true;
            return this._cache;
        },
        get(key) { return this.load()[key]; },
        set(key, value) {
            const settings = this.load();
            const oldValue = settings[key];
            if (oldValue === value) return;
            settings[key] = value;
            this._cache = settings;
            storage.set(CONFIG.STORAGE_KEY_SETTINGS, settings);
            this._notify(key, value, oldValue);
        },
        getAll() { return { ...this.load() }; },
        reset() {
            this._cache = { ...DEFAULT_SETTINGS };
            storage.set(CONFIG.STORAGE_KEY_SETTINGS, this._cache);
            this._notify('reset', this._cache, null);
        },
        onChange(callback) {
            this._listeners.push(callback);
            return () => { const idx = this._listeners.indexOf(callback); if (idx >= 0) this._listeners.splice(idx, 1); };
        },
        _notify(key, newValue, oldValue) { this._listeners.forEach(fn => { try { fn(key, newValue, oldValue); } catch (e) {} }); },
        getFontFamily() {
            const key = this.get('fontFamily') || 'system';
            return FONT_OPTIONS[key]?.value || FONT_OPTIONS.system.value;
        },
        invalidateCache() { this._cache = null; },
    };

    // ========================================
    // Keybindings Manager
    // ========================================
    const Keybindings = {
        _cache: null,
        _listeners: [],
        load() {
            if (this._cache) return this._cache;
            const saved = storage.get(CONFIG.STORAGE_KEY_KEYBINDINGS, null);
            this._cache = { ...DEFAULT_KEYBINDINGS, ...(saved || {}) };
            if (this._cache.showSettings && !this._cache.toggleSettings) {
                this._cache.toggleSettings = this._cache.showSettings;
                delete this._cache.showSettings;
            }
            return this._cache;
        },
        get(action) { return this.load()[action]; },
        getAll() { return { ...this.load() }; },
        set(action, binding) {
            const bindings = this.load();
            bindings[action] = binding;
            this._cache = bindings;
            storage.set(CONFIG.STORAGE_KEY_KEYBINDINGS, bindings);
            this._notify(action, binding);
        },
        reset() {
            this._cache = { ...DEFAULT_KEYBINDINGS };
            storage.set(CONFIG.STORAGE_KEY_KEYBINDINGS, this._cache);
            this._notify('reset', this._cache);
        },
        resetAction(action) { if (DEFAULT_KEYBINDINGS[action]) this.set(action, { ...DEFAULT_KEYBINDINGS[action] }); },
        onChange(callback) {
            this._listeners.push(callback);
            return () => { const idx = this._listeners.indexOf(callback); if (idx >= 0) this._listeners.splice(idx, 1); };
        },
        _notify(action, binding) { this._listeners.forEach(fn => { try { fn(action, binding); } catch (e) {} }); },
        formatBinding(binding) {
            if (!binding || !binding.key) return '無';
            const parts = [];
            if (binding.ctrl) parts.push('Ctrl');
            if (binding.alt) parts.push('Alt');
            if (binding.shift) parts.push('Shift');
            if (binding.meta) parts.push('⌘');
            let keyName = binding.key;
            const keyDisplayMap = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Escape: 'Esc', ' ': 'Space' };
            if (keyDisplayMap[keyName]) keyName = keyDisplayMap[keyName];
            else if (keyName.length === 1) keyName = keyName.toUpperCase();
            parts.push(keyName);
            return parts.join(' + ');
        },
        matchesEvent(binding, event) {
            if (!binding || !binding.key) return false;
            const keyMatches = event.key.toLowerCase() === binding.key.toLowerCase() || event.key === binding.key;
            return keyMatches && event.altKey === !!binding.alt && event.ctrlKey === !!binding.ctrl && event.shiftKey === !!binding.shift && event.metaKey === !!binding.meta;
        },
        fromEvent(event) { return { key: event.key, alt: event.altKey, ctrl: event.ctrlKey, shift: event.shiftKey, meta: event.metaKey }; },
        findConflict(action, binding) {
            const all = this.load();
            for (const [otherAction, otherBinding] of Object.entries(all)) {
                if (otherAction === action) continue;
                if (this._bindingsEqual(binding, otherBinding)) return otherAction;
            }
            return null;
        },
        _bindingsEqual(a, b) {
            if (!a || !b) return false;
            return a.key?.toLowerCase() === b.key?.toLowerCase() && !!a.alt === !!b.alt && !!a.ctrl === !!b.ctrl && !!a.shift === !!b.shift && !!a.meta === !!b.meta;
        },
        invalidateCache() { this._cache = null; },
    };

    // ========================================
    // Position Managers
    // ========================================
    const createPositionManager = (storageKey, defaultPos, validator) => ({
        _cache: null,
        load() {
            if (this._cache) return this._cache;
            const saved = storage.get(storageKey, null);
            this._cache = { ...defaultPos, ...(saved || {}) };
            return this._cache;
        },
        save(pos) {
            this._cache = validator(pos);
            storage.set(storageKey, this._cache);
        },
        reset() {
            this._cache = { ...defaultPos };
            storage.set(storageKey, this._cache);
            return this._cache;
        },
        invalidateCache() { this._cache = null; },
    });

    const FabPosition = createPositionManager(CONFIG.STORAGE_KEY_FAB_POSITION, DEFAULT_FAB_POSITION, (pos) => ({
        bottom: utils.clamp(pos.bottom || 24, 10, window.innerHeight - 70),
        right: utils.clamp(pos.right || 24, 10, window.innerWidth - 70),
    }));

    const PanelPosition = createPositionManager(CONFIG.STORAGE_KEY_PANEL_POSITION, DEFAULT_PANEL_POSITION, (pos) => ({
        top: pos.top != null ? utils.clamp(pos.top, 10, window.innerHeight - 100) : null,
        left: pos.left != null ? utils.clamp(pos.left, 10, window.innerWidth - 100) : null,
    }));

    const PanelSize = createPositionManager(CONFIG.STORAGE_KEY_PANEL_SIZE, DEFAULT_PANEL_SIZE, (size) => ({
        width: utils.clamp(size.width || 360, 280, 600),
        height: utils.clamp(size.height || 420, 250, 800),
    }));

    const IndicatorPosition = {
        _cache: null,
        load() {
            if (this._cache) return this._cache;
            const saved = storage.get(CONFIG.STORAGE_KEY_INDICATOR_POSITION, null);
            this._cache = { ...DEFAULT_INDICATOR_POSITION, ...(saved || {}) };
            return this._cache;
        },
        save(pos) {
            this._cache = { edge: pos.edge === 'left' ? 'left' : 'right', top: utils.clamp(pos.top || 100, 20, window.innerHeight - 200) };
            storage.set(CONFIG.STORAGE_KEY_INDICATOR_POSITION, this._cache);
        },
        reset() {
            this._cache = { ...DEFAULT_INDICATOR_POSITION };
            storage.set(CONFIG.STORAGE_KEY_INDICATOR_POSITION, this._cache);
            return this._cache;
        },
        getStyles() {
            const pos = this.load();
            return pos.edge === 'left' ? { top: `${pos.top}px`, left: '4px', right: 'auto' } : { top: `${pos.top}px`, right: '4px', left: 'auto' };
        },
        toggleEdge() {
            const pos = this.load();
            pos.edge = pos.edge === 'left' ? 'right' : 'left';
            this.save(pos);
            return pos;
        },
        invalidateCache() { this._cache = null; },
    };

    // ========================================
    // Theme Manager
    // ========================================
    const Theme = {
        _isDark: null,
        _listeners: [],
        detect() {
            const htmlDark = document.documentElement.classList.contains('dark');
            const bodyDark = document.body?.classList.contains('dark');
            let bgDark = false;
            if (document.body) {
                const bg = window.getComputedStyle(document.body).backgroundColor;
                const rgb = bg.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    bgDark = brightness < 128;
                }
            }
            const wasDark = this._isDark;
            this._isDark = htmlDark || bodyDark || bgDark;
            if (wasDark !== null && wasDark !== this._isDark) this._notify();
            return this._isDark;
        },
        get isDark() { if (this._isDark === null) this.detect(); return this._isDark; },
        onChange(callback) {
            this._listeners.push(callback);
            return () => { const idx = this._listeners.indexOf(callback); if (idx >= 0) this._listeners.splice(idx, 1); };
        },
        _notify() { this._listeners.forEach(fn => { try { fn(this._isDark); } catch (e) {} }); },
    };

    // ========================================
    // Onboarding
    // ========================================
    const Onboarding = {
        hasCompleted() { return storage.get(CONFIG.STORAGE_KEY_ONBOARDING, false); },
        markCompleted() { storage.set(CONFIG.STORAGE_KEY_ONBOARDING, true); },
        show(anchorElement) {
            if (this.hasCompleted()) return;
            const tip = document.createElement('div');
            tip.className = 'lm-nav-onboarding';
            tip.innerHTML = `
                <div class="lm-nav-onboarding-content">
                    <div class="lm-nav-onboarding-header">
                        <span class="lm-nav-onboarding-icon">💬</span>
                        <span class="lm-nav-onboarding-title">對話導航器</span>
                    </div>
                    <ul class="lm-nav-onboarding-list">
                        <li>點擊浮動鈕或懸停指示條開啟導航板</li>
                        <li>拖動浮動鈕、指示條、導航板調整位置</li>
                        <li>右鍵點擊可開啟更多選項</li>
                        <li>快捷鍵可在設定中自訂</li>
                    </ul>
                    <button class="lm-nav-onboarding-close">知道了</button>
                </div>`;
            tip.querySelector('.lm-nav-onboarding-close').addEventListener('click', () => {
                tip.classList.add('lm-nav-onboarding--hiding');
                setTimeout(() => tip.remove(), 200);
                this.markCompleted();
            });
            if (anchorElement) {
                const rect = anchorElement.getBoundingClientRect();
                const tipWidth = 280;
                if (rect.left > tipWidth + 20) tip.style.right = `${window.innerWidth - rect.left + 12}px`;
                else tip.style.left = `${rect.right + 12}px`;
                tip.style.bottom = `${window.innerHeight - rect.bottom}px`;
            } else { tip.style.right = '80px'; tip.style.bottom = '24px'; }
            const host = document.getElementById(CONFIG.CONTAINER_ID) || document.body;
            host.appendChild(tip);
            requestAnimationFrame(() => tip.classList.add('lm-nav-onboarding--visible'));
            setTimeout(() => {
                if (tip.parentNode && !this.hasCompleted()) {
                    tip.classList.add('lm-nav-onboarding--hiding');
                    setTimeout(() => tip.remove(), 200);
                    this.markCompleted();
                }
            }, 15000);
        },
    };

    // ========================================
    // Favorites Manager
    // ========================================
    const Favorites = {
        _cache: null,
        _listeners: [],
        getPageId() { return location.pathname; },
        getPageTitle() {
            const h1 = document.querySelector('h1');
            if (h1?.textContent?.trim()) return h1.textContent.trim().substring(0, 50);
            return document.title || this.getPageId();
        },
        _loadAll() {
            if (this._cache) return this._cache;
            this._cache = storage.get(CONFIG.STORAGE_KEY_FAVORITES, {});
            return this._cache;
        },
        _saveAll() { storage.set(CONFIG.STORAGE_KEY_FAVORITES, this._cache); },
        getForCurrentPage() { return this._loadAll()[this.getPageId()] || []; },
        getAllPages() { return this._loadAll(); },
        getTotalCount() { return Object.values(this._loadAll()).reduce((sum, arr) => sum + arr.length, 0); },
        getCurrentPageCount() { return this.getForCurrentPage().length; },
        has(msgId) { return this.getForCurrentPage().some(item => item.id === msgId); },
        add(msgId, text, msgType = 'user') {
            if (!msgId || !text) return false;
            const all = this._loadAll();
            const pageId = this.getPageId();
            if (!all[pageId]) all[pageId] = [];
            if (all[pageId].some(item => item.id === msgId)) return false;
            all[pageId].push({
                id: msgId, text: text.substring(0, 2000), preview: utils.truncate(text, 80),
                type: msgType, pageId, pageTitle: this.getPageTitle(), url: location.href, timestamp: Date.now(),
            });
            this._saveAll();
            this._notify('add', { id: msgId });
            return true;
        },
        remove(msgId) {
            const all = this._loadAll();
            const pageId = this.getPageId();
            if (!all[pageId]) return null;
            const index = all[pageId].findIndex(item => item.id === msgId);
            if (index === -1) return null;
            const removed = all[pageId].splice(index, 1)[0];
            if (all[pageId].length === 0) delete all[pageId];
            this._saveAll();
            this._notify('remove', removed);
            return removed;
        },
        removeFromPage(pageId, msgId) {
            const all = this._loadAll();
            if (!all[pageId]) return null;
            const index = all[pageId].findIndex(item => item.id === msgId);
            if (index === -1) return null;
            const removed = all[pageId].splice(index, 1)[0];
            if (all[pageId].length === 0) delete all[pageId];
            this._saveAll();
            this._notify('remove', removed);
            return removed;
        },
        removeMultiple(items) {
            if (!items?.length) return [];
            const all = this._loadAll();
            const removed = [];
            items.forEach(({ pageId, id }) => {
                if (!all[pageId]) return;
                const index = all[pageId].findIndex(item => item.id === id);
                if (index !== -1) {
                    removed.push(all[pageId].splice(index, 1)[0]);
                    if (all[pageId].length === 0) delete all[pageId];
                }
            });
            if (removed.length > 0) { this._saveAll(); this._notify('removeMultiple', removed); }
            return removed;
        },
        clearPage(pageId) {
            const all = this._loadAll();
            if (!all[pageId]) return [];
            const removed = [...all[pageId]];
            delete all[pageId];
            this._saveAll();
            this._notify('clearPage', { pageId, items: removed });
            return removed;
        },
        clearAll() {
            const all = this._loadAll();
            const totalRemoved = Object.values(all).flat();
            this._cache = {};
            this._saveAll();
            this._notify('clearAll', totalRemoved);
            return totalRemoved;
        },
        toggle(msgId, text, msgType = 'user') {
            if (this.has(msgId)) return { action: 'removed', item: this.remove(msgId) };
            this.add(msgId, text, msgType);
            return { action: 'added', item: null };
        },
        undoRemove(item) {
            if (!item) return false;
            const all = this._loadAll();
            if (!all[item.pageId]) all[item.pageId] = [];
            if (all[item.pageId].some(i => i.id === item.id)) return false;
            all[item.pageId].push(item);
            this._saveAll();
            this._notify('undo', item);
            return true;
        },
        undoRemoveMultiple(items) {
            if (!items?.length) return 0;
            const all = this._loadAll();
            let restored = 0;
            items.forEach(item => {
                if (!all[item.pageId]) all[item.pageId] = [];
                if (!all[item.pageId].some(i => i.id === item.id)) { all[item.pageId].push(item); restored++; }
            });
            if (restored > 0) { this._saveAll(); this._notify('undoMultiple', items); }
            return restored;
        },
        undoRemoveAt(item, index) {
            if (!item) return false;
            const all = this._loadAll();
            if (!all[item.pageId]) all[item.pageId] = [];
            if (all[item.pageId].some(i => i.id === item.id)) return false;
            const idx = (typeof index === 'number' && index >= 0) ? Math.min(index, all[item.pageId].length) : all[item.pageId].length;
            all[item.pageId].splice(idx, 0, item);
            this._saveAll();
            this._notify('undo', item);
            return true;
        },
        invalidate() { this._cache = null; },
        onChange(callback) {
            this._listeners.push(callback);
            return () => { const idx = this._listeners.indexOf(callback); if (idx >= 0) this._listeners.splice(idx, 1); };
        },
        findMatchingMessage(messages, favItem) {
            if (!messages || !favItem) return null;
            let msg = messages.find(m => m.matchesId(favItem.id));
            if (msg) return msg;
            if (favItem.text) {
                const favFingerprint = favItem.text.substring(0, 80).replace(/\s+/g, ' ').trim().toLowerCase();
                msg = messages.find(m => m.getTextFingerprint() === favFingerprint);
                if (msg) return msg;
            }
            if (favItem.preview) {
                const previewLower = favItem.preview.toLowerCase().replace(/\.{3}$/, '');
                msg = messages.find(m => m.text.toLowerCase().startsWith(previewLower));
                if (msg) return msg;
            }
            return null;
        },
        updateFavoriteId(pageId, oldId, newId) {
            const all = this._loadAll();
            if (!all[pageId]) return false;
            const item = all[pageId].find(f => f.id === oldId);
            if (item) { item.id = newId; this._saveAll(); return true; }
            return false;
        },
        _notify(action, data) { this._listeners.forEach(fn => { try { fn(action, data); } catch (e) {} }); },
    };

    // ========================================
    // Icons
    // ========================================
    const Icons = {
        size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
        _svg(size, content, options = {}) {
            const s = this.size[size] || this.size.md;
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', s);
            svg.setAttribute('height', s);
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', options.strokeWidth || '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.setAttribute('aria-hidden', 'true');
            svg.innerHTML = content;
            return svg;
        },
        chat(size, opts) { return this._svg(size, `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`, opts); },
        list(size, opts) { return this._svg(size, `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`, opts); },
        search(size, opts) { return this._svg(size, `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`, opts); },
        settings(size, opts) { return this._svg(size, `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`, opts); },
        starOutline(size, opts) { return this._svg(size, `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`, opts); },
        starFilled(size, opts) { return this._svg(size, `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`, opts); },
        copy(size, opts) { return this._svg(size, `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`, opts); },
        check(size, opts) { return this._svg(size, `<polyline points="20 6 9 17 4 12"/>`, opts); },
        download(size, opts) { return this._svg(size, `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`, opts); },
        folderOpen(size, opts) { return this._svg(size, `<path d="M5 19a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v1"/><path d="M5 19h14a2 2 0 0 0 2-2l1-7H4l1 7a2 2 0 0 0 2 2z"/>`, opts); },
        sortAsc(size, opts) { return this._svg(size, `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`, opts); },
        sortDesc(size, opts) { return this._svg(size, `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`, opts); },
        user(size, opts) { return this._svg(size, `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`, opts); },
        bot(size, opts) { return this._svg(size, `<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>`, { ...opts, strokeWidth: '1.5' }); },
        close(size, opts) { return this._svg(size, `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`, opts); },
        externalLink(size, opts) { return this._svg(size, `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`, opts); },
        trash(size, opts) { return this._svg(size, `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`, opts); },
        mapPin(size, opts) { return this._svg(size, `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`, opts); },
        chevronLeft(size, opts) { return this._svg(size, `<polyline points="15 18 9 12 15 6"/>`, opts); },
        chevronRight(size, opts) { return this._svg(size, `<polyline points="9 18 15 12 9 6"/>`, opts); },
        chevronDown(size, opts) { return this._svg(size, `<polyline points="6 9 12 15 18 9"/>`, opts); },
        cornerDownLeft(size, opts) { return this._svg(size, `<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>`, opts); },
        undo(size, opts) { return this._svg(size, `<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>`, opts); },
        info(size, opts) { return this._svg(size, `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`, opts); },
        arrowLeftRight(size, opts) { return this._svg(size, `<polyline points="7 16 3 12 7 8"/><polyline points="17 8 21 12 17 16"/><line x1="3" y1="12" x2="21" y2="12"/>`, opts); },
        messageSquare(size, opts) { return this._svg(size, `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`, opts); },
        pin(size, opts) { return this._svg(size, `<line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>`, opts); },
        pinOff(size, opts) { return this._svg(size, `<line x1="2" y1="2" x2="22" y2="22"/><line x1="12" y1="17" x2="12" y2="22"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V9"/><path d="M9.3 4H8a2 2 0 0 0 0 4h.3"/><path d="M14.7 4H16a2 2 0 0 1 0 4h-.3"/>`, opts); },
        palette(size, opts) { return this._svg(size, `<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>`, opts); },
        sliders(size, opts) { return this._svg(size, `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`, opts); },
        keyboard(size, opts) { return this._svg(size, `<rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/>`, opts); },
        edit(size, opts) { return this._svg(size, `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`, opts); },
        eye(size, opts) { return this._svg(size, `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`, opts); },
        checkSquare(size, opts) { return this._svg(size, `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`, opts); },
        square(size, opts) { return this._svg(size, `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>`, opts); },
        minusSquare(size, opts) { return this._svg(size, `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="8" y1="12" x2="16" y2="12"/>`, opts); },
        alertTriangle(size, opts) { return this._svg(size, `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`, opts); },
    };

    // ========================================
    // Toast
    // ========================================
    class Toast {
        constructor() {
            this.container = null;
            Theme.onChange((isDark) => { if (this.container) this.container.dataset.theme = isDark ? 'dark' : 'light'; });
        }
        _ensureContainer() {
            if (this.container && document.body.contains(this.container)) return;
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'lm-nav-toast-container';
                this.container.setAttribute('role', 'alert');
                this.container.setAttribute('aria-live', 'polite');
            }
            document.body.appendChild(this.container);
            this.container.dataset.theme = Theme.isDark ? 'dark' : 'light';
        }
        show(message, options = {}) {
            const { type = 'info', duration = 2500, action = null } = options;
            this._ensureContainer();
            const toast = document.createElement('div');
            toast.className = `lm-nav-toast lm-nav-toast--${type}`;
            const icon = document.createElement('span');
            icon.className = 'lm-nav-toast-icon';
            if (type === 'success') icon.appendChild(Icons.check('sm'));
            else if (type === 'error') icon.appendChild(Icons.close('sm'));
            else if (type === 'warning') icon.appendChild(Icons.alertTriangle('sm'));
            else icon.appendChild(Icons.info('sm'));
            const text = document.createElement('span');
            text.className = 'lm-nav-toast-text';
            text.textContent = message;
            toast.appendChild(icon);
            toast.appendChild(text);
            if (action) {
                const btn = document.createElement('button');
                btn.className = 'lm-nav-toast-action';
                btn.textContent = action.label;
                btn.addEventListener('click', () => { action.callback(); this._dismiss(toast); });
                toast.appendChild(btn);
            }
            this.container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('lm-nav-toast--visible'));
            toast._duration = duration;
            toast._startTime = Date.now();
            toast._timer = setTimeout(() => this._dismiss(toast), duration);
            toast.addEventListener('mouseenter', () => {
                clearTimeout(toast._timer);
                toast._remainingTime = Math.max(toast._duration - (Date.now() - toast._startTime), 1000);
            });
            toast.addEventListener('mouseleave', () => {
                toast._startTime = Date.now();
                toast._duration = toast._remainingTime || 1500;
                toast._timer = setTimeout(() => this._dismiss(toast), toast._duration);
            });
            return toast;
        }
        _dismiss(toast) {
            if (!toast?.parentNode) return;
            clearTimeout(toast._timer);
            toast.classList.remove('lm-nav-toast--visible');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }
        success(message, duration = 2500) { return this.show(message, { type: 'success', duration }); }
        error(message, duration = 3000) { return this.show(message, { type: 'error', duration }); }
        info(message, duration = 2500) { return this.show(message, { type: 'info', duration }); }
        warning(message, duration = 3000) { return this.show(message, { type: 'warning', duration }); }
        withUndo(message, undoCallback, duration = 4500) {
            return this.show(message, { type: 'info', duration, action: { label: '撤銷', callback: undoCallback } });
        }
    }
    const toast = new Toast();

    // ========================================
    // ContextMenu
    // ========================================
    class ContextMenu {
        constructor() {
            this.element = null;
            this.isVisible = false;
            this._boundHandlers = {
                clickOutside: this._onClickOutside.bind(this),
                scroll: () => this.hide(),
                keydown: this._onKeyDown.bind(this),
            };
        }
        _create() {
            if (this.element && document.body.contains(this.element)) return;
            this.element = document.createElement('div');
            this.element.className = 'lm-nav-context-menu';
            this.element.setAttribute('role', 'menu');
            this.element.setAttribute('aria-label', '操作菜單');
            const navContainer = document.getElementById(CONFIG.CONTAINER_ID);
            (navContainer || document.body).appendChild(this.element);
        }
        show(x, y, items) {
            this._create();
            this._build(items);
            this._position(x, y);
            this.element.style.display = 'block';
            this.isVisible = true;
            requestAnimationFrame(() => {
                document.addEventListener('click', this._boundHandlers.clickOutside, true);
                document.addEventListener('contextmenu', this._boundHandlers.clickOutside, true);
                document.addEventListener('scroll', this._boundHandlers.scroll, true);
                document.addEventListener('keydown', this._boundHandlers.keydown);
            });
        }
        hide() {
            if (!this.element || !this.isVisible) return;
            this.element.style.display = 'none';
            this.isVisible = false;
            document.removeEventListener('click', this._boundHandlers.clickOutside, true);
            document.removeEventListener('contextmenu', this._boundHandlers.clickOutside, true);
            document.removeEventListener('scroll', this._boundHandlers.scroll, true);
            document.removeEventListener('keydown', this._boundHandlers.keydown);
        }
        _build(items) {
            this.element.innerHTML = '';
            let firstFocusable = null;
            items.forEach((item) => {
                if (item.separator) {
                    const sep = document.createElement('div');
                    sep.className = 'lm-nav-context-separator';
                    sep.setAttribute('role', 'separator');
                    this.element.appendChild(sep);
                    return;
                }
                const el = document.createElement('div');
                el.className = 'lm-nav-context-item';
                el.setAttribute('role', 'menuitem');
                el.setAttribute('tabindex', '0');
                if (item.disabled) { el.classList.add('lm-nav-context-item--disabled'); el.setAttribute('aria-disabled', 'true'); }
                else if (!firstFocusable) firstFocusable = el;
                const iconWrap = document.createElement('span');
                iconWrap.className = 'lm-nav-context-icon';
                if (item.icon) iconWrap.appendChild(typeof item.icon === 'function' ? item.icon('sm') : item.icon);
                const label = document.createElement('span');
                label.className = 'lm-nav-context-label';
                label.textContent = item.label;
                const shortcut = document.createElement('span');
                shortcut.className = 'lm-nav-context-shortcut';
                if (item.shortcut) shortcut.textContent = item.shortcut;
                el.appendChild(iconWrap);
                el.appendChild(label);
                el.appendChild(shortcut);
                if (!item.disabled && item.action) {
                    const execute = (e) => { e.preventDefault(); e.stopPropagation(); this.hide(); setTimeout(() => item.action(), 16); };
                    el.addEventListener('click', execute);
                    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') execute(e); });
                }
                this.element.appendChild(el);
            });
            if (firstFocusable) setTimeout(() => firstFocusable.focus(), 16);
        }
        _position(x, y) {
            this.element.style.visibility = 'hidden';
            this.element.style.display = 'block';
            const rect = this.element.getBoundingClientRect();
            const vw = window.innerWidth, vh = window.innerHeight, margin = 8;
            let finalX = x, finalY = y;
            if (x + rect.width > vw - margin) finalX = vw - rect.width - margin;
            if (finalX < margin) finalX = margin;
            if (y + rect.height > vh - margin) finalY = y - rect.height;
            if (finalY < margin) finalY = margin;
            this.element.style.left = `${finalX}px`;
            this.element.style.top = `${finalY}px`;
            this.element.style.visibility = 'visible';
        }
        _onClickOutside(e) { if (this.isVisible && this.element && !this.element.contains(e.target)) this.hide(); }
        _onKeyDown(e) {
            if (!this.isVisible) return;
            if (e.key === 'Escape') { this.hide(); e.preventDefault(); }
            else if (e.key === 'ArrowDown') { this._focusNext(); e.preventDefault(); }
            else if (e.key === 'ArrowUp') { this._focusPrev(); e.preventDefault(); }
        }
        _focusNext() {
            const items = Array.from(this.element.querySelectorAll('.lm-nav-context-item:not(.lm-nav-context-item--disabled)'));
            const currentIndex = items.indexOf(document.activeElement);
            items[(currentIndex + 1) % items.length]?.focus();
        }
        _focusPrev() {
            const items = Array.from(this.element.querySelectorAll('.lm-nav-context-item:not(.lm-nav-context-item--disabled)'));
            const currentIndex = items.indexOf(document.activeElement);
            items[(currentIndex - 1 + items.length) % items.length]?.focus();
        }
    }

    // ========================================
    // ModalLock
    // ========================================
    const ModalLock = {
        _count: 0,
        _originalOverflow: null,
        _originalPaddingRight: null,
        _getScrollbarWidth() {
            if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) return 0;
            return window.innerWidth - document.documentElement.clientWidth;
        },
        acquire() {
            this._count++;
            if (this._count === 1) {
                this._originalOverflow = document.body.style.overflow;
                this._originalPaddingRight = document.body.style.paddingRight;
                const scrollbarWidth = this._getScrollbarWidth();
                document.body.style.overflow = 'hidden';
                if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        },
        release() {
            this._count = Math.max(0, this._count - 1);
            if (this._count === 0) {
                document.body.style.overflow = this._originalOverflow || '';
                document.body.style.paddingRight = this._originalPaddingRight || '';
                this._originalOverflow = null;
                this._originalPaddingRight = null;
            }
        },
    };

    // ========================================
    // Dialog
    // ========================================
    class Dialog {
        constructor(options = {}) {
            this.options = { title: '', width: 480, closable: true, className: '', ...options };
            this.element = null;
            this.contentEl = null;
            this.isOpen = false;
            this._previousActiveElement = null;
            this._boundKeyHandler = this._onKeyDown.bind(this);
        }
        open() {
            if (this.isOpen) return this;
            this._previousActiveElement = document.activeElement;
            this._build();
            const navContainer = document.getElementById(CONFIG.CONTAINER_ID);
            (navContainer || document.body).appendChild(this.element);
            ModalLock.acquire();
            requestAnimationFrame(() => this.element.classList.add('lm-nav-dialog--visible'));
            this.isOpen = true;
            document.addEventListener('keydown', this._boundKeyHandler);
            const focusTarget = this.element.querySelector('.lm-nav-dialog-close') || this.element.querySelector('button') || this.element.querySelector('[tabindex="0"]');
            if (focusTarget) setTimeout(() => focusTarget.focus(), 80);
            return this;
        }
        close() {
            if (!this.isOpen || !this.element) return;
            this.element.classList.remove('lm-nav-dialog--visible');
            const cleanup = () => {
                if (this.element?.parentNode) this.element.remove();
                this.element = null;
                this.contentEl = null;
                this.isOpen = false;
                ModalLock.release();
                if (this._previousActiveElement?.focus) try { this._previousActiveElement.focus(); } catch (e) {}
                this._previousActiveElement = null;
            };
            this.element.addEventListener('transitionend', cleanup, { once: true });
            setTimeout(cleanup, 300);
            document.removeEventListener('keydown', this._boundKeyHandler);
        }
        setContent(content) {
            if (!this.contentEl) return this;
            if (typeof content === 'string') this.contentEl.innerHTML = content;
            else if (content instanceof Element) { this.contentEl.innerHTML = ''; this.contentEl.appendChild(content); }
            return this;
        }
        updateTitle(title) {
            const titleEl = this.element?.querySelector('.lm-nav-dialog-title');
            if (titleEl) titleEl.textContent = title;
        }
        _build() {
            this.element = document.createElement('div');
            this.element.className = 'lm-nav-dialog-overlay';
            if (this.options.className) this.element.classList.add(this.options.className);
            this.element.setAttribute('role', 'dialog');
            this.element.setAttribute('aria-modal', 'true');
            this.element.setAttribute('aria-labelledby', 'lm-nav-dialog-title');
            this.element.addEventListener('click', (e) => { if (e.target === this.element && this.options.closable) this.close(); });
            const dialog = document.createElement('div');
            dialog.className = 'lm-nav-dialog';
            dialog.style.maxWidth = `${this.options.width}px`;
            dialog.addEventListener('click', (e) => e.stopPropagation());
            const header = document.createElement('div');
            header.className = 'lm-nav-dialog-header';
            const title = document.createElement('h2');
            title.id = 'lm-nav-dialog-title';
            title.className = 'lm-nav-dialog-title';
            title.textContent = this.options.title;
            header.appendChild(title);
            if (this.options.closable) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'lm-nav-dialog-close';
                closeBtn.setAttribute('aria-label', '關閉');
                closeBtn.appendChild(Icons.close('md'));
                closeBtn.addEventListener('click', () => this.close());
                header.appendChild(closeBtn);
            }
            dialog.appendChild(header);
            this.contentEl = document.createElement('div');
            this.contentEl.className = 'lm-nav-dialog-content';
            dialog.appendChild(this.contentEl);
            this.element.appendChild(dialog);
        }
        _onKeyDown(e) {
            if (e.key === 'Escape' && this.options.closable) { this.close(); e.preventDefault(); return; }
            if (e.key === 'Tab') this._handleTabKey(e);
        }
        _handleTabKey(e) {
            const focusable = this.element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault(); } }
            else { if (document.activeElement === last) { first.focus(); e.preventDefault(); } }
        }
    }

    // ========================================
    // Message Class
    // ========================================
    class Message {
        constructor(element, type, text, index, meta = {}) {
            this.element = element;
            this.type = type;
            this.text = text;
            this.index = index;
            this.side = meta?.side || null;
            this.id = this._generateId();
            this._legacyId = this._generateLegacyId();
        }
        _generateId() { return `${this.type}-${this._hashText(this.text)}`; }
        _generateLegacyId() {
            const textHash = this.text.substring(0, 50).replace(/\s+/g, '').substring(0, 20);
            return `${this.type}-${this.index}-${textHash}`;
        }
        _hashText(text) {
            const normalized = text.substring(0, 100).replace(/\s+/g, ' ').trim().toLowerCase();
            let hash = 0;
            for (let i = 0; i < normalized.length; i++) { hash = ((hash << 5) - hash) + normalized.charCodeAt(i); hash = hash & hash; }
            return Math.abs(hash).toString(36);
        }
        getTextFingerprint() { return this.text.substring(0, 80).replace(/\s+/g, ' ').trim().toLowerCase(); }
        matchesId(id) { return id && (this.id === id || this._legacyId === id); }
        isValid() {
            if (!this.element || !document.body.contains(this.element)) return false;
            const rect = this.element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }
        getPreview(maxLength = CONFIG.PREVIEW_LENGTH) { return utils.truncate(this.text.replace(/\s+/g, ' ').trim(), maxLength); }
        getLengthCategory() {
            const len = this.text.length;
            if (len < CONFIG.MSG_LENGTH_THRESHOLDS.SHORT) return 'short';
            if (len < CONFIG.MSG_LENGTH_THRESHOLDS.MEDIUM) return 'medium';
            if (len < CONFIG.MSG_LENGTH_THRESHOLDS.LONG) return 'long';
            return 'very-long';
        }
    }

    // ========================================
    // HistoryLoader
    // ========================================
    class HistoryLoader {
        constructor(app) { this.app = app; this.isLoading = false; this.shouldStop = false; }
        async load() {
            if (this.isLoading) { this.stop(); return; }
            this.isLoading = true;
            this.shouldStop = false;
            try {
                const container = this._findScrollContainer();
                if (!container) { toast.error('找不到滾動容器'); this._finishLoading(); return; }
                const result = await this._run(container);
                if (result.stopped) toast.info('已停止載入');
                else if (result.newCount > 0) toast.success(`載入了 ${result.newCount} 條新消息`);
                else toast.success('已載入全部歷史');
            } catch (e) { log('History load error:', e); toast.error('載入時發生錯誤'); }
            this._finishLoading();
        }
        stop() { this.shouldStop = true; }
        async _run(container) {
            const originalScroll = container.scrollTop;
            const initialCount = this.app.messages.length;
            let lastCount = initialCount, noChangeCount = 0;
            const maxNoChange = 3;
            while (!this.shouldStop && noChangeCount < maxNoChange) {
                container.scrollTop = Math.min(100, container.scrollHeight * 0.05);
                await this._delay(50);
                container.scrollTop = 0;
                container.dispatchEvent(new Event('scroll', { bubbles: true }));
                await this._delay(noChangeCount === 0 ? 450 : 650);
                this.app.updateMessages();
                const currentCount = this.app.messages.length;
                if (currentCount > lastCount) { lastCount = currentCount; noChangeCount = 0; }
                else noChangeCount++;
            }
            container.scrollTop = originalScroll;
            return { stopped: this.shouldStop, newCount: lastCount - initialCount };
        }
        _findScrollContainer() {
            const radix = document.querySelector('div[data-radix-scroll-area-viewport]');
            if (radix?.scrollHeight > radix?.clientHeight) return radix;
            const selectors = ['main [class*="overflow-y-auto"]', 'main [class*="overflow-auto"]', 'main'];
            for (const sel of selectors) { const el = document.querySelector(sel); if (el?.scrollHeight > el?.clientHeight) return el; }
            return document.documentElement;
        }
        _finishLoading() { this.isLoading = false; this.shouldStop = false; }
        _delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    }

    // ========================================
    // KeyboardNav
    // ========================================
    class KeyboardNav {
        constructor(app) { this.app = app; this.enabled = true; this._boundHandler = this._onKeyDown.bind(this); }
        init() { document.addEventListener('keydown', this._boundHandler); }
        destroy() { document.removeEventListener('keydown', this._boundHandler); }
        setEnabled(enabled) { this.enabled = enabled; }
        _onKeyDown(e) {
            if (e.key === 'Escape') { if (this.app.closeAnyOpenPanel()) e.preventDefault(); return; }
            const all = Keybindings.getAll();
            const bindings = { ...all, togglePanel: all.togglePanel || DEFAULT_KEYBINDINGS.togglePanel, toggleSettings: all.toggleSettings || DEFAULT_KEYBINDINGS.toggleSettings, toggleFavManager: all.toggleFavManager || DEFAULT_KEYBINDINGS.toggleFavManager };
            if (Keybindings.matchesEvent(bindings.togglePanel, e)) { e.preventDefault(); e.stopPropagation(); this.app.togglePanel(); return; }
            if (Keybindings.matchesEvent(bindings.toggleSettings, e)) { e.preventDefault(); e.stopPropagation(); this.app.toggleSettings(); return; }
            if (Keybindings.matchesEvent(bindings.toggleFavManager, e)) { e.preventDefault(); e.stopPropagation(); this.app.toggleFavoriteManager(); return; }
            if (this._isInputFocused()) return;
            if (this.app.isPanelOpen) {
                const settings = Settings.getAll();
                if (settings.paginatePanel) {
                    if (e.key === 'PageUp') { e.preventDefault(); this.app._goToPage(this.app.currentPage - 1); return; }
                    if (e.key === 'PageDown') { e.preventDefault(); this.app._goToPage(this.app.currentPage + 1); return; }
                    if (e.key === 'Home' && !e.altKey && !e.ctrlKey) { e.preventDefault(); this.app._goToPage(1); return; }
                    if (e.key === 'End' && !e.altKey && !e.ctrlKey) { e.preventDefault(); this.app._goToPage('last'); return; }
                }
            }
            if (!this.enabled) return;
            if (Keybindings.matchesEvent(bindings.navigateUp, e)) { e.preventDefault(); this.app.navigate(-1); return; }
            if (Keybindings.matchesEvent(bindings.navigateDown, e)) { e.preventDefault(); this.app.navigate(1); return; }
            if (Keybindings.matchesEvent(bindings.navigateFirst, e)) { e.preventDefault(); this.app.navigate('first'); return; }
            if (Keybindings.matchesEvent(bindings.navigateLast, e)) { e.preventDefault(); this.app.navigate('last'); return; }
            if (Keybindings.matchesEvent(bindings.toggleOrder, e)) { e.preventDefault(); this.app.toggleOrder(); return; }
            if (Keybindings.matchesEvent(bindings.loadHistory, e)) { e.preventDefault(); this.app.loadHistory(); return; }
            if (Keybindings.matchesEvent(bindings.toggleView, e)) { e.preventDefault(); this.app.togglePanelView(); return; }
            if (Keybindings.matchesEvent(bindings.toggleIndicatorEdge, e)) { e.preventDefault(); this.app.toggleIndicatorEdge(); return; }
            if (Keybindings.matchesEvent(bindings.togglePanelPin, e)) { e.preventDefault(); this.app.togglePanelPin(); return; }
            if (Keybindings.matchesEvent(bindings.toggleAIMessages, e)) { e.preventDefault(); this.app.toggleAIMessages(); return; }
        }
        _isInputFocused() {
            const el = document.activeElement;
            if (!el) return false;
            const tag = el.tagName?.toUpperCase();
            return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable || el.closest('.lm-nav-dialog');
        }
    }

    // ========================================
    // ChatNavigator (Main Application)
    // ========================================
    class ChatNavigator {
        constructor() {
            this.messages = [];
            this.userMessages = [];
            this.currentIndex = -1;
            this.viewingIndex = -1;
            this.currentPage = 1;
            this.searchQuery = '';
            this.panelState = 'hidden';
            this.isSettingsOpen = false;
            this.isFavManagerOpen = false;
            this.lastUrl = location.href;
            this.lastContentHash = '';
            this.scrollParent = null;
            this.initialized = false;
            this.isScrolling = false;
            this.isUpdating = false;
            this.keyboard = new KeyboardNav(this);
            this.contextMenu = new ContextMenu();
            this.historyLoader = new HistoryLoader(this);
            this.settingsDialog = null;
            this.favManagerDialog = null;
            this._toast = toast;
            this._fabDrag = { active: false, startX: 0, startY: 0, startPos: null, moved: false };
            this._panelDrag = { active: false, startX: 0, startY: 0, startPos: null, moved: false, justDragged: false };
            this._indicatorDrag = { active: false, startX: 0, startY: 0, startPos: null, moved: false, justDragged: false, clickedLine: null };
            this._panelResize = { active: false, direction: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 };
            this._hoverState = { showTimer: null, hideTimer: null, isOverIndicator: false, isOverPanel: false };
            this._autoHideState = { fabTimer: null, indicatorTimer: null };
            this._urlWatchTimer = null;
            this._popstateBound = false;
            this._keyCapture = { active: false, action: null, dialog: null, handler: null };
            this._fisheyeState = { rafId: null, idleTimer: null, lastMouseY: null, isActive: false, linePositions: null, linePositionsValid: false };
            this._favManagerState = { query: '', selectionMode: false, selected: new Set(), visibleKeys: [], itemByKey: new Map(), suppressNextRemoveRerender: false, suppressNextUndoRerender: false };
            this._favManagerPendingDeletes = new Map();
            this._boundHandlers = {
                scroll: utils.throttle(this._handleScroll.bind(this), CONFIG.SCROLL_THROTTLE),
                mouseMove: this._handleMouseMove.bind(this),
                mouseUp: this._handleMouseUp.bind(this),
                documentClick: this._handleDocumentClick.bind(this),
                proximity: utils.throttle(this._handleProximity.bind(this), 100),
                resize: utils.debounce(this._handleResize.bind(this), 200),
            };
            this._debouncedUpdate = utils.debounce(() => this.updateMessages(), CONFIG.UPDATE_DEBOUNCE);
            Settings.onChange((key, value, oldValue) => this._onSettingChange(key, value, oldValue));
            Favorites.onChange((action, data) => this._onFavoriteChange(action, data));
            Theme.onChange((isDark) => this._onThemeChange(isDark));
            Keybindings.onChange(() => this._refreshKeybindingUI());
        }

        async init() {
            log('Initializing ChatNavigator v1.0.0...');
            if (storage.hasGM4()) {
                await storage.preloadGM4();
                Settings.invalidateCache();
                Keybindings.invalidateCache();
                FabPosition.invalidateCache();
                PanelPosition.invalidateCache();
                PanelSize.invalidateCache();
                IndicatorPosition.invalidateCache();
                Favorites.invalidate();
            }
            await this._migrateSettingsIfNeeded();
            Theme.detect();
            this._injectStyles();
            this.keyboard.init();
            setTimeout(() => {
                this.initialized = true;
                this._buildUI();
                this.updateMessages();
                this._setupObservers();
                registerMenuCommands(this);
                const fab = document.getElementById(CONFIG.FAB_ID);
                if (fab) Onboarding.show(fab);
                setTimeout(() => this.updateMessages(), 800);
                setTimeout(() => this.updateMessages(), 2500);
                log('Initialization complete');
            }, CONFIG.INIT_DELAY);
        }

        async _migrateSettingsIfNeeded() {
            try {
                const existing = storage.get(CONFIG.STORAGE_KEY_SETTINGS, null);
                if (existing != null) return;
                for (const oldKey of ['lm_nav_settings_v5', 'lm_nav_settings_v4']) {
                    let oldVal = storage.get(oldKey, null);
                    if ((oldVal == null) && storage.hasGM4() && typeof GM?.getValue === 'function') {
                        try { const v = await GM.getValue(oldKey, null); if (v != null) oldVal = v; } catch (e) {}
                    }
                    if (oldVal != null) { storage.set(CONFIG.STORAGE_KEY_SETTINGS, oldVal); Settings.invalidateCache(); log(`Settings migrated from ${oldKey}`); break; }
                }
            } catch (e) {}
        }

        findMessages() {
            const messages = [];
            const ol = document.querySelector('ol.mt-8');
            if (!ol) return messages;
            const children = Array.from(ol.children);
            let index = 0;
            for (let i = children.length - 1; i >= 0; i--) {
                const el = children[i];
                if (el.tagName !== 'DIV' || el.classList.contains('h-0')) continue;
                if (el.classList.contains('group') && el.classList.contains('flex')) {
                    const text = this._extractUserText(el);
                    if (text?.trim()) messages.push(new Message(el, 'user', text.trim(), index++));
                    continue;
                }
                const proseElements = el.querySelectorAll('.prose, .markdown');
                if (proseElements.length === 0) continue;
                if (proseElements.length >= 2) {
                    this._findSeparateAIContainers(el).forEach((containerInfo) => {
                        const text = this._extractAIText(containerInfo.element);
                        if (text?.trim()) messages.push(new Message(containerInfo.element, 'ai', text.trim(), index++, { side: containerInfo.side || null }));
                    });
                } else {
                    const text = this._extractAIText(el);
                    if (text?.trim()) messages.push(new Message(el, 'ai', text.trim(), index++));
                }
            }
            return messages;
        }

        _findSeparateAIContainers(parentEl) {
            const containers = [];
            const layoutContainer = parentEl.querySelector('[class*="grid"], [class*="flex"][class*="gap-"]');
            if (layoutContainer) {
                Array.from(layoutContainer.children).forEach((child, idx) => {
                    if (child.querySelector('.prose, .markdown')) containers.push({ element: child, side: idx === 0 ? 'A' : 'B' });
                });
                if (containers.length >= 2) return containers;
            }
            const proseElements = parentEl.querySelectorAll('.prose, .markdown');
            const seen = new Set();
            proseElements.forEach((prose) => {
                let isNested = false;
                for (const existing of seen) { if (existing.contains(prose) || prose.contains(existing)) { isNested = true; break; } }
                if (isNested) return;
                seen.add(prose);
                let container = prose, parent = prose.parentElement;
                while (parent && parent !== parentEl) {
                    if (parent.querySelectorAll('.prose, .markdown').length === 1) { container = parent; parent = parent.parentElement; }
                    else break;
                }
                containers.push({ element: container, side: containers.length === 0 ? 'A' : 'B' });
            });
            return containers;
        }

        _extractUserText(el) {
            if (!el) return '';
            const prose = el.querySelector('.prose');
            const clone = (prose || el).cloneNode(true);
            this._cleanUIElements(clone);
            return (clone.textContent || '').replace(/\n{4,}/g, '\n\n\n').trim();
        }

        _extractAIText(el) {
            if (!el) return '';
            const prose = el.querySelector('.prose, .markdown');
            if (!prose) return '';
            const clone = prose.cloneNode(true);
            this._cleanUIElements(clone);
            return (clone.textContent || '').replace(/\n{4,}/g, '\n\n\n').trim();
        }

        _cleanUIElements(el) {
            if (!el) return;
            el.querySelectorAll('button, svg, [aria-hidden="true"], [class*="toolbar"], [class*="actions"], [class*="controls"]').forEach(n => n.remove());
            const uiTexts = ['Click to collapse code', 'Click to expand code', 'Click to collapse', 'Click to expand', 'Copy code', 'Copied!', 'Copy', 'Copied'];
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const nodesToClean = [];
            while (walker.nextNode()) {
                let text = walker.currentNode.textContent || '', modified = false;
                for (const uiText of uiTexts) { if (text.includes(uiText)) { text = text.split(uiText).join(''); modified = true; } }
                if (modified) nodesToClean.push({ node: walker.currentNode, newText: text });
            }
            nodesToClean.forEach(({ node, newText }) => { node.textContent = newText; });
        }

        updateMessages() {
            if (this.isUpdating || !this.initialized) return;
            this.isUpdating = true;
            try {
                if (location.href !== this.lastUrl) this._resetState();
                const msgs = this.findMessages();
                const hash = msgs.map(m => (m.text || '').substring(0, 30)).join('|');
                if (hash !== this.lastContentHash || msgs.length !== this.messages.length) {
                    this.lastContentHash = hash;
                    this.messages = msgs;
                    this.userMessages = msgs.filter(m => m.type === 'user');
                    this._fisheyeState.linePositionsValid = false;
                    this._renderAll();
                }
            } catch (e) { log('Update error:', e); }
            this.isUpdating = false;
        }

        _resetState(options = {}) {
            this.messages = [];
            this.userMessages = [];
            this.currentIndex = -1;
            this.viewingIndex = -1;
            this.currentPage = 1;
            this.searchQuery = '';
            this.lastContentHash = '';
            this.scrollParent = null;
            this.lastUrl = location.href;
            this._fisheyeState.linePositionsValid = false;
            this._fisheyeState.linePositions = null;
            Favorites.invalidate();
            if (!options.keepPanel) this._hidePanel();
            this._renderIndicator();
            if (options.keepPanel) { this._renderList(); this._renderFavorites(); this._renderPagination(); this._updateFavBadge(); }
        }

        navigate(direction) {
            if (this.messages.length === 0) return;
            let target;
            switch (direction) {
                case 'first': target = 0; break;
                case 'last': target = this.messages.length - 1; break;
                case -1: target = this.currentIndex === -1 ? 0 : Math.max(0, this.currentIndex - 1); break;
                case 1: target = this.currentIndex === -1 ? 0 : Math.min(this.messages.length - 1, this.currentIndex + 1); break;
                default: return;
            }
            this.navigateToIndex(target);
        }

        navigateToIndex(index) {
            if (index < 0 || index >= this.messages.length) return;
            const msg = this.messages[index];
            if (!msg.isValid()) { this.updateMessages(); return; }
            this.currentIndex = index;
            this.viewingIndex = index;
            this._scrollToMessage(msg);
            this._updateIndicators();
        }

        _scrollToMessage(msg) {
            const settings = Settings.getAll();
            this.isScrolling = true;
            msg.element.scrollIntoView({ behavior: settings.enableAnimation ? 'smooth' : 'auto', block: settings.scrollPosition });
            if (!settings.enableAnimation) { this._highlightMessage(msg); this.isScrolling = false; return; }
            const scrollParent = this._getScrollParent(msg.element);
            let timer;
            const onScrollEnd = () => {
                clearTimeout(timer);
                timer = setTimeout(() => { this._highlightMessage(msg); scrollParent.removeEventListener('scroll', onScrollEnd); this.isScrolling = false; }, 80);
            };
            scrollParent.addEventListener('scroll', onScrollEnd, { passive: true });
            setTimeout(() => { if (this.isScrolling) { this._highlightMessage(msg); scrollParent.removeEventListener('scroll', onScrollEnd); this.isScrolling = false; } }, 550);
        }

        _highlightMessage(msg) {
            const settings = Settings.getAll();
            if (settings.enableAnimation) {
                msg.element.classList.add(CONFIG.JIGGLE_CLASS);
                setTimeout(() => msg.element.classList.remove(CONFIG.JIGGLE_CLASS), CONFIG.JIGGLE_DURATION);
            } else {
                const originalOutline = msg.element.style.outline;
                const originalOffset = msg.element.style.outlineOffset;
                msg.element.style.outline = '2px solid var(--lm-nav-accent, #3b82f6)';
                msg.element.style.outlineOffset = '2px';
                setTimeout(() => { msg.element.style.outline = originalOutline; msg.element.style.outlineOffset = originalOffset; }, 600);
            }
        }

        _getScrollParent(el) {
            if (this.scrollParent && document.body.contains(this.scrollParent)) return this.scrollParent;
            const radix = document.querySelector('div[data-radix-scroll-area-viewport]');
            if (radix?.scrollHeight > radix?.clientHeight) { this.scrollParent = radix; return radix; }
            let node = el?.parentElement;
            while (node && node !== document.body) {
                const style = getComputedStyle(node);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) { this.scrollParent = node; return node; }
                node = node.parentElement;
            }
            this.scrollParent = document.documentElement;
            return document.documentElement;
        }

        _handleScroll() {
            if (this.messages.length === 0 || this.isScrolling) return;
            const viewportCenter = window.innerHeight * 0.3;
            let closestIndex = -1, closestDistance = Infinity;
            for (let i = 0; i < this.messages.length; i++) {
                const msg = this.messages[i];
                if (!msg.isValid()) continue;
                const rect = msg.element.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                const distance = Math.abs(rect.top - viewportCenter);
                if (distance < closestDistance) { closestDistance = distance; closestIndex = i; }
            }
            if (closestIndex >= 0 && closestIndex !== this.viewingIndex) { this.viewingIndex = closestIndex; this._updateIndicators(); }
        }

        get isPanelOpen() { return this.panelState !== 'hidden'; }

        togglePanel() { if (this.isPanelOpen) this._hidePanel(); else this._showPanel('open'); }

        _showPanel(mode, anchor = null, forceAnchorPosition = false) {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            this._clearHoverTimers();
            const rank = { hidden: 0, hover: 1, open: 2, pinned: 3 };
            if ((rank[this.panelState] || 0) > 0 && (rank[mode] || 0) <= (rank[this.panelState] || 0)) return;
            this.panelState = mode;
            panel.classList.add('lm-nav-panel--open');
            panel.classList.toggle('lm-nav-panel--pinned', mode === 'pinned');
            this._updatePinButton();
            this._positionPanel(anchor, mode === 'hover' || forceAnchorPosition);
            this._applyPanelSize();
            this._renderList();
            this._renderFavorites();
            this._renderPagination();
            this._updateFavBadge();
            this._syncAIToggleButton();
        }

        _hidePanel() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            this._clearHoverTimers();
            this.panelState = 'hidden';
            panel.classList.remove('lm-nav-panel--open', 'lm-nav-panel--pinned');
        }

        _scheduleShowPanel(anchor) {
            if (!Settings.get('hoverShowPanel') || this.panelState === 'open' || this.panelState === 'pinned') return;
            this._clearHoverTimers();
            this._hoverState.showTimer = setTimeout(() => this._showPanel('hover', anchor, true), CONFIG.HOVER_SHOW_DELAY);
        }

        _hasFocusInPanel() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            return panel?.contains(document.activeElement);
        }

        _scheduleHidePanel() {
            if (this.panelState !== 'hover' || this._hasFocusInPanel()) return;
            this._clearHoverTimers();
            this._hoverState.hideTimer = setTimeout(() => {
                if (this.panelState === 'hover' && !this._hoverState.isOverPanel && !this._hoverState.isOverIndicator && !this._hasFocusInPanel()) this._hidePanel();
            }, CONFIG.HOVER_HIDE_DELAY);
        }

        _cancelHidePanel() { if (this._hoverState.hideTimer) { clearTimeout(this._hoverState.hideTimer); this._hoverState.hideTimer = null; } }

        _clearHoverTimers() {
            if (this._hoverState.showTimer) { clearTimeout(this._hoverState.showTimer); this._hoverState.showTimer = null; }
            if (this._hoverState.hideTimer) { clearTimeout(this._hoverState.hideTimer); this._hoverState.hideTimer = null; }
        }

        togglePanelPin() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!this.isPanelOpen) { this._showPanel('pinned'); toast.success('導航板已固定'); return; }
            if (this.panelState === 'pinned') { this.panelState = 'open'; panel?.classList.remove('lm-nav-panel--pinned'); this._updatePinButton(); toast.info('導航板已取消固定'); }
            else { this.panelState = 'pinned'; panel?.classList.add('lm-nav-panel--pinned'); this._updatePinButton(); toast.success('導航板已固定'); }
        }

        _updatePinButton() {
            const btn = document.querySelector('.lm-nav-pin-btn');
            if (!btn) return;
            btn.innerHTML = '';
            if (this.panelState === 'pinned') {
                btn.appendChild(Icons.pinOff('md'));
                btn.title = `取消固定 (${Keybindings.formatBinding(Keybindings.getAll().togglePanelPin || DEFAULT_KEYBINDINGS.togglePanelPin)})`;
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.appendChild(Icons.pin('md'));
                btn.title = `固定導航板 (${Keybindings.formatBinding(Keybindings.getAll().togglePanelPin || DEFAULT_KEYBINDINGS.togglePanelPin)})`;
                btn.setAttribute('aria-pressed', 'false');
            }
        }

        _positionPanel(anchor = null, forceAnchorPosition = false) {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            const size = PanelSize.load();
            const panelWidth = size.width, panelHeight = Math.min(size.height, window.innerHeight - 100);
            if (!forceAnchorPosition) {
                const savedPos = PanelPosition.load();
                if (savedPos.left !== null && savedPos.top !== null) {
                    panel.style.left = `${utils.clamp(savedPos.left, 10, window.innerWidth - panelWidth - 10)}px`;
                    panel.style.top = `${utils.clamp(savedPos.top, 10, window.innerHeight - panelHeight - 10)}px`;
                    return;
                }
            }
            let left, top;
            if (anchor) {
                const pos = utils.calculatePanelPosition(anchor, panelWidth, panelHeight);
                left = pos.left; top = pos.top;
            } else {
                const fab = document.getElementById(CONFIG.FAB_ID);
                if (fab) {
                    const fabRect = fab.getBoundingClientRect();
                    left = fabRect.left - panelWidth - 12;
                    top = fabRect.bottom - panelHeight;
                    if (left < 10) left = fabRect.right + 12;
                } else { left = window.innerWidth - panelWidth - 24; top = (window.innerHeight - panelHeight) / 2; }
            }
            panel.style.left = `${utils.clamp(left, 10, window.innerWidth - panelWidth - 10)}px`;
            panel.style.top = `${utils.clamp(top, 10, window.innerHeight - panelHeight - 10)}px`;
        }

        togglePanelView() { Settings.set('panelView', Settings.get('panelView') === 'messages' ? 'favorites' : 'messages'); }
        toggleOrder() { const current = Settings.get('reversedOrder'); Settings.set('reversedOrder', !current); toast.info(current ? '已切換為正序' : '已切換為倒序'); }
        loadHistory() { this.historyLoader.load(); }
        toggleIndicatorEdge() { const newPos = IndicatorPosition.toggleEdge(); this._applyIndicatorPosition(); toast.success(`指示條已移至${newPos.edge === 'left' ? '左' : '右'}側`); }

        toggleAIMessages() {
            const current = Settings.get('showAIMessages');
            Settings.set('showAIMessages', !current);
            this.currentPage = 1;
            this._renderList();
            this._renderFavorites();
            this._renderPagination();
            this._updateFavBadge();
            this._syncAIToggleButton();
            toast.info(!current ? '導航板已顯示 AI 回覆' : '導航板已隱藏 AI 回覆');
        }

        toggleSettings() { if (this.isSettingsOpen) this._closeSettingsDialog(); else this._openSettingsDialog(); }

        _openSettingsDialog() {
            if (this.isSettingsOpen) return;
            this.isSettingsOpen = true;
            const dlg = new Dialog({ title: '設定', width: 520, className: 'lm-nav-settings-dialog' });
            const origClose = dlg.close.bind(dlg);
            dlg.close = () => { origClose(); this.isSettingsOpen = false; };
            this.settingsDialog = dlg;
            dlg.open().setContent(this._buildSettingsContent());
        }

        _closeSettingsDialog() { this.settingsDialog?.close(); this.isSettingsOpen = false; }

        toggleFavoriteManager() { if (this.isFavManagerOpen) this._closeFavManagerDialog(); else this._openFavManagerDialog(); }

        _openFavManagerDialog() {
            if (this.isFavManagerOpen) return;
            this.isFavManagerOpen = true;
            this._favManagerState = { query: '', selectionMode: false, selected: new Set(), visibleKeys: [], itemByKey: new Map(), suppressNextRemoveRerender: false, suppressNextUndoRerender: false };
            const dlg = new Dialog({ title: `收藏夾 (${Favorites.getTotalCount()})`, width: 620, className: 'lm-nav-fav-manager-dialog' });
            const origClose = dlg.close.bind(dlg);
            dlg.close = () => { origClose(); this.isFavManagerOpen = false; };
            this.favManagerDialog = dlg;
            dlg.open().setContent(this._buildFavManagerRoot());
            this._renderFavManagerList();
        }

        _closeFavManagerDialog() { this.favManagerDialog?.close(); this.isFavManagerOpen = false; }

        _buildFavManagerRoot() {
            const root = document.createElement('div');
            root.className = 'lm-nav-fav-manager';
            const searchBar = document.createElement('div');
            searchBar.className = 'lm-nav-fav-manager-search';
            const icon = document.createElement('span');
            icon.className = 'lm-nav-search-icon';
            icon.appendChild(Icons.search('sm'));
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'lm-nav-fav-manager-search-input';
            input.placeholder = '搜尋收藏（內容/標題）...';
            const clear = document.createElement('button');
            clear.className = 'lm-nav-search-clear';
            clear.setAttribute('aria-label', '清除搜尋');
            clear.appendChild(Icons.close('xs'));
            clear.style.display = 'none';
            input.addEventListener('input', () => {
                const q = (input.value || '').trim().toLowerCase();
                clear.style.display = q ? 'flex' : 'none';
                this._favManagerState.query = q;
                this._favManagerState.selected.clear();
                this._renderFavManagerList();
            });
            clear.addEventListener('click', () => { input.value = ''; input.focus(); clear.style.display = 'none'; this._favManagerState.query = ''; this._favManagerState.selected.clear(); this._renderFavManagerList(); });
            searchBar.appendChild(icon);
            searchBar.appendChild(input);
            searchBar.appendChild(clear);
            const toolbar = document.createElement('div');
            toolbar.className = 'lm-nav-fav-manager-toolbar';
            const left = document.createElement('div');
            left.className = 'lm-nav-fav-manager-toolbar-left';
            const right = document.createElement('div');
            right.className = 'lm-nav-fav-manager-toolbar-right';
            const selectionInfo = document.createElement('span');
            selectionInfo.className = 'lm-nav-fav-manager-selection-info';
            left.appendChild(selectionInfo);
            const createBtn = (title, icon, text, onClick, dangerClass = '') => {
                const btn = document.createElement('button');
                btn.className = `lm-nav-btn-sm ${dangerClass}`;
                btn.title = title;
                btn.appendChild(icon);
                btn.appendChild(document.createTextNode(` ${text}`));
                btn.addEventListener('click', onClick);
                return btn;
            };
            right.appendChild(createBtn('批量選取', Icons.checkSquare('sm'), '選取', () => { this._favManagerState.selectionMode = !this._favManagerState.selectionMode; if (!this._favManagerState.selectionMode) this._favManagerState.selected.clear(); this._renderFavManagerList(); }));
            right.appendChild(createBtn('全選', Icons.square('sm'), '全選', () => { (this._favManagerState.visibleKeys || []).forEach(k => this._favManagerState.selected.add(k)); this._updateFavManagerToolbar(); this._syncFavManagerCheckboxes(); }));
            right.appendChild(createBtn('清除選取', Icons.minusSquare('sm'), '清除', () => { this._favManagerState.selected.clear(); this._updateFavManagerToolbar(); this._syncFavManagerCheckboxes(); }));
            right.appendChild(createBtn('刪除選取', Icons.trash('sm'), '刪除選取', () => this._favManagerDeleteSelected(), 'lm-nav-btn-sm--danger'));
            right.appendChild(createBtn('清空所有收藏', Icons.alertTriangle('sm'), '清空全部', () => this._favManagerClearAll(), 'lm-nav-btn-sm--danger'));
            toolbar.appendChild(left);
            toolbar.appendChild(right);
            const list = document.createElement('div');
            list.className = 'lm-nav-fav-manager-list';
            root.appendChild(searchBar);
            root.appendChild(toolbar);
            root.appendChild(list);
            return root;
        }

        _updateFavManagerToolbar() {
            const info = document.querySelector('.lm-nav-fav-manager-selection-info');
            if (info) info.textContent = this._favManagerState.selectionMode ? `已選取：${this._favManagerState.selected.size}` : '';
        }

        _syncFavManagerCheckboxes() {
            document.querySelectorAll('.lm-nav-fav-manager-item').forEach(li => {
                const key = li.dataset.key;
                if (!key) return;
                li.classList.toggle('is-selected', this._favManagerState.selected.has(key));
                const cb = li.querySelector('.lm-nav-fav-manager-checkbox');
                if (cb) { cb.innerHTML = ''; cb.appendChild(this._favManagerState.selected.has(key) ? Icons.checkSquare('sm') : Icons.square('sm')); }
            });
        }

        _favManagerDeleteSelected() {
            const selectedKeys = Array.from(this._favManagerState.selected);
            if (selectedKeys.length === 0) { toast.info('尚未選取任何收藏'); return; }
            if (!confirm(`確定要刪除已選取的 ${selectedKeys.length} 項收藏嗎？`)) return;
            const payload = [], removedItemsForUndo = [];
            selectedKeys.forEach((key) => { const item = this._favManagerState.itemByKey.get(key); if (item) { payload.push({ pageId: item.pageId, id: item.id }); removedItemsForUndo.push(item); } });
            Favorites.removeMultiple(payload);
            this._favManagerState.selected.clear();
            this._renderFavManagerList();
            if (removedItemsForUndo.length <= 200) toast.withUndo(`已刪除 ${removedItemsForUndo.length} 項收藏`, () => { Favorites.undoRemoveMultiple(removedItemsForUndo); this._renderFavManagerList(); toast.success('已撤銷'); }, 4500);
            else toast.warning(`已刪除 ${removedItemsForUndo.length} 項收藏（數量過多，未提供撤銷）`, 3500);
        }

        _favManagerClearAll() {
            const total = Favorites.getTotalCount();
            if (total === 0) { toast.info('收藏夾已是空的'); return; }
            if (!confirm(`確定要「清空全部收藏」（共 ${total} 項）嗎？`)) return;
            const removed = Favorites.clearAll();
            this._favManagerState.selected.clear();
            this._renderFavManagerList();
            if (removed.length <= 200) toast.withUndo(`已清空全部收藏（${removed.length} 項）`, () => { Favorites.undoRemoveMultiple(removed); this._renderFavManagerList(); toast.success('已撤銷'); }, 5000);
            else toast.warning(`已清空全部收藏（${removed.length} 項，數量過多未提供撤銷）`, 3800);
        }

        _renderFavManagerList() {
            const listContainer = document.querySelector('.lm-nav-fav-manager-list');
            if (!listContainer) return;
            const query = this._favManagerState.query || '';
            const allFavs = Favorites.getAllPages();
            listContainer.innerHTML = '';
            this._favManagerState.visibleKeys = [];
            this._favManagerState.itemByKey.clear();
            const sections = [];
            for (const [pageId, items] of Object.entries(allFavs)) {
                if (!items?.length) continue;
                let filtered = query ? items.filter(item => `${item.pageTitle || ''}\n${item.preview || ''}\n${item.text || ''}`.toLowerCase().includes(query)) : items;
                if (filtered?.length) sections.push({ pageId, title: filtered[0]?.pageTitle || pageId, items: filtered });
            }
            const totalCount = Favorites.getTotalCount();
            const matchedCount = sections.reduce((s, sec) => s + sec.items.length, 0);
            this.favManagerDialog?.updateTitle(query ? `收藏夾：${matchedCount}/${totalCount}` : `收藏夾 (${totalCount})`);
            if (sections.length === 0) {
                listContainer.innerHTML = `<div class="lm-nav-empty-state" style="display:flex;position:relative;"><div class="lm-nav-empty-icon">${Icons.search('xl').outerHTML}</div><p>${query ? '沒有找到匹配的收藏' : '還沒有任何收藏'}</p></div>`;
                this._updateFavManagerToolbar();
                return;
            }
            sections.forEach(sec => {
                const section = document.createElement('div');
                section.className = 'lm-nav-fav-section';
                section.dataset.pageId = sec.pageId;
                const header = document.createElement('div');
                header.className = 'lm-nav-fav-section-header';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = sec.title;
                const clearBtn = document.createElement('button');
                clearBtn.className = 'lm-nav-btn-xs lm-nav-btn-xs--danger';
                clearBtn.textContent = '清空本頁';
                clearBtn.title = '清空此對話頁面的所有收藏';
                clearBtn.addEventListener('click', () => {
                    if (!confirm(`確定要清空「${sec.title}」的收藏嗎？（共 ${sec.items.length} 項）`)) return;
                    const removed = Favorites.clearPage(sec.pageId);
                    this._favManagerState.selected.clear();
                    this._renderFavManagerList();
                    if (removed.length <= 200) toast.withUndo(`已清空本頁（${removed.length} 項）`, () => { Favorites.undoRemoveMultiple(removed); this._renderFavManagerList(); toast.success('已撤銷'); }, 4500);
                    else toast.warning(`已清空本頁（${removed.length} 項，數量過多未提供撤銷）`, 3500);
                });
                header.appendChild(titleSpan);
                header.appendChild(clearBtn);
                const ul = document.createElement('ul');
                ul.className = 'lm-nav-fav-section-list';
                sec.items.forEach(item => {
                    const key = `${item.pageId}:${item.id}`;
                    this._favManagerState.visibleKeys.push(key);
                    this._favManagerState.itemByKey.set(key, item);
                    ul.appendChild(this._createFavManagerItem(item, key));
                });
                section.appendChild(header);
                section.appendChild(ul);
                listContainer.appendChild(section);
            });
            this._updateFavManagerToolbar();
            this._syncFavManagerCheckboxes();
        }

        _createFavManagerItem(item, key) {
            const li = document.createElement('li');
            li.className = 'lm-nav-fav-manager-item';
            li.dataset.key = key;
            const checkbox = document.createElement('button');
            checkbox.className = 'lm-nav-fav-manager-checkbox';
            checkbox.type = 'button';
            checkbox.title = '選取';
            checkbox.style.display = this._favManagerState.selectionMode ? 'flex' : 'none';
            checkbox.appendChild(this._favManagerState.selected.has(key) ? Icons.checkSquare('sm') : Icons.square('sm'));
            checkbox.addEventListener('click', (e) => {
                if (li.classList.contains('lm-nav-fav-manager-item--pending') || !this._favManagerState.selectionMode) return;
                e.stopPropagation();
                if (this._favManagerState.selected.has(key)) this._favManagerState.selected.delete(key);
                else this._favManagerState.selected.add(key);
                this._updateFavManagerToolbar();
                this._syncFavManagerCheckboxes();
            });
            const icon = document.createElement('span');
            icon.className = 'lm-nav-fav-manager-icon';
            icon.appendChild((item.type || 'user') === 'user' ? Icons.user('sm') : Icons.bot('sm'));
            const text = document.createElement('span');
            text.className = 'lm-nav-fav-manager-text';
            text.textContent = item.preview || utils.truncate(item.text, 60);
            text.title = item.text;
            const time = document.createElement('span');
            time.className = 'lm-nav-fav-manager-time';
            time.textContent = utils.formatRelativeTime(item.timestamp);
            const actions = document.createElement('div');
            actions.className = 'lm-nav-fav-manager-actions';
            const createActionBtn = (title, iconEl, onClick, dangerClass = '') => {
                const btn = document.createElement('button');
                btn.className = `lm-nav-icon-btn ${dangerClass}`;
                btn.title = title;
                btn.appendChild(iconEl);
                btn.addEventListener('click', onClick);
                return btn;
            };
            actions.appendChild(createActionBtn('插入到輸入框', Icons.cornerDownLeft('sm'), (e) => { e.stopPropagation(); if (this._insertToInput(item.text)) this.favManagerDialog?.close(); }));
            actions.appendChild(createActionBtn('複製', Icons.copy('sm'), (e) => { e.stopPropagation(); this._copyText(item.text, e.currentTarget); }));
            actions.appendChild(createActionBtn('前往對話', Icons.externalLink('sm'), () => { if (item.url) { this.favManagerDialog?.close(); window.location.href = item.url; } }));
            actions.appendChild(createActionBtn('刪除', Icons.trash('sm'), (e) => { e.stopPropagation(); this._favManagerRemoveWithInlineUndo(item, key, li); }, 'lm-nav-icon-btn--danger'));
            li.appendChild(checkbox);
            li.appendChild(icon);
            li.appendChild(text);
            li.appendChild(time);
            li.appendChild(actions);
            li.addEventListener('click', () => {
                if (li.classList.contains('lm-nav-fav-manager-item--pending') || !this._favManagerState.selectionMode) return;
                if (this._favManagerState.selected.has(key)) this._favManagerState.selected.delete(key);
                else this._favManagerState.selected.add(key);
                this._updateFavManagerToolbar();
                this._syncFavManagerCheckboxes();
            });
            return li;
        }

        _clearFavManagerPendingDeletes() {
            for (const s of this._favManagerPendingDeletes.values()) { try { if (s.timer) clearTimeout(s.timer); } catch (e) {} }
            this._favManagerPendingDeletes.clear();
        }

        _favManagerRemoveWithInlineUndo(item, key, li) {
            if (!item || !key || !li || !this.isFavManagerOpen || this._favManagerPendingDeletes.has(key)) return;
            let originalIndex = -1;
            const arr = Favorites.getAllPages()[item.pageId] || [];
            originalIndex = arr.findIndex(x => x.id === item.id);
            this._favManagerState.suppressNextRemoveRerender = true;
            const removed = Favorites.removeFromPage(item.pageId, item.id);
            if (!removed) { this._favManagerState.suppressNextRemoveRerender = false; return; }
            li.classList.add('lm-nav-fav-manager-item--pending');
            li.querySelectorAll('.lm-nav-fav-manager-actions .lm-nav-icon-btn').forEach(btn => {
                if (!btn.classList.contains('lm-nav-icon-btn--danger')) { btn.disabled = true; btn.style.opacity = '0.45'; btn.style.pointerEvents = 'none'; }
            });
            const oldDel = li.querySelector('.lm-nav-icon-btn--danger');
            if (oldDel) {
                const undoBtn = document.createElement('button');
                undoBtn.className = 'lm-nav-icon-btn lm-nav-fav-undo-btn';
                undoBtn.title = '撤銷刪除';
                undoBtn.appendChild(Icons.undo('sm'));
                undoBtn.addEventListener('click', (e) => { e.stopPropagation(); this._favManagerUndoPendingDelete(key); });
                oldDel.replaceWith(undoBtn);
            }
            const finalize = () => this._favManagerFinalizePendingDelete(key);
            const state = { item: removed, li, originalIndex, paused: false, finalize, timer: setTimeout(finalize, 4000) };
            li.addEventListener('mouseenter', () => { const s = this._favManagerPendingDeletes.get(key); if (s && !s.paused) { s.paused = true; if (s.timer) clearTimeout(s.timer); s.timer = null; } });
            li.addEventListener('mouseleave', () => { const s = this._favManagerPendingDeletes.get(key); if (s?.paused) { s.paused = false; s.timer = setTimeout(s.finalize, 2500); } });
            this._favManagerPendingDeletes.set(key, state);
        }

        _favManagerUndoPendingDelete(key) {
            const s = this._favManagerPendingDeletes.get(key);
            if (!s) return;
            try { if (s.timer) clearTimeout(s.timer); } catch (e) {}
            this._favManagerPendingDeletes.delete(key);
            this._favManagerState.suppressNextUndoRerender = true;
            Favorites.undoRemoveAt(s.item, s.originalIndex);
            const li = s.li;
            if (!li) return;
            li.classList.remove('lm-nav-fav-manager-item--pending');
            li.querySelectorAll('.lm-nav-fav-manager-actions .lm-nav-icon-btn').forEach(btn => { btn.disabled = false; btn.style.opacity = ''; btn.style.pointerEvents = ''; });
            const undoBtn = li.querySelector('.lm-nav-fav-undo-btn');
            if (undoBtn) {
                const delBtn = document.createElement('button');
                delBtn.className = 'lm-nav-icon-btn lm-nav-icon-btn--danger';
                delBtn.title = '刪除';
                delBtn.appendChild(Icons.trash('sm'));
                delBtn.addEventListener('click', (e) => { e.stopPropagation(); this._favManagerRemoveWithInlineUndo(s.item, key, li); });
                undoBtn.replaceWith(delBtn);
            }
        }

        _favManagerFinalizePendingDelete(key) {
            const s = this._favManagerPendingDeletes.get(key);
            if (!s) return;
            try { if (s.timer) clearTimeout(s.timer); } catch (e) {}
            this._favManagerPendingDeletes.delete(key);
            const li = s.li;
            if (!li?.parentNode) return;
            const section = li.closest('.lm-nav-fav-section');
            const list = li.closest('.lm-nav-fav-section-list');
            li.remove();
            if (list?.children.length === 0) section?.remove();
            if (!document.querySelector('.lm-nav-fav-manager-list .lm-nav-fav-manager-item')) this._renderFavManagerList?.();
        }

        _buildUI() {
            this._cleanup();
            const settings = Settings.getAll();
            const fabPos = FabPosition.load();
            const container = document.createElement('div');
            container.id = CONFIG.CONTAINER_ID;
            container.dataset.theme = Theme.isDark ? 'dark' : 'light';
            container.dataset.showFab = settings.showFab ? 'true' : 'false';
            container.dataset.showIndicator = settings.showIndicator ? 'true' : 'false';
            container.dataset.autoHideFab = settings.autoHideFab ? 'true' : 'false';
            container.dataset.autoHideIndicator = settings.autoHideIndicator ? 'true' : 'false';
            container.style.setProperty('--lm-nav-font-size', `${settings.fontSize}px`);
            container.style.setProperty('--lm-nav-font-family', Settings.getFontFamily());
            container.appendChild(this._createFab(fabPos));
            container.appendChild(this._createIndicator());
            container.appendChild(this._createPanel(settings));
            document.body.appendChild(container);
            this._bindEvents();
            this._applySettings(settings);
            toast._ensureContainer?.();
        }

        _cleanup() {
            document.getElementById(CONFIG.CONTAINER_ID)?.remove();
            document.removeEventListener('mousemove', this._boundHandlers.mouseMove);
            document.removeEventListener('mouseup', this._boundHandlers.mouseUp);
            document.removeEventListener('click', this._boundHandlers.documentClick, true);
            document.removeEventListener('mousemove', this._boundHandlers.proximity);
            window.removeEventListener('scroll', this._boundHandlers.scroll, true);
            window.removeEventListener('resize', this._boundHandlers.resize);
            if (this._urlWatchTimer) { clearInterval(this._urlWatchTimer); this._urlWatchTimer = null; }
            this._clearAutoHideTimers();
            this._clearHoverTimers();
            this._clearFisheyeEffect();
        }

        _createFab(pos) {
            const fab = document.createElement('button');
            fab.id = CONFIG.FAB_ID;
            fab.className = 'lm-nav-fab';
            fab.title = '對話導航\n• 點擊：開啟導航板\n• 拖動：調整位置\n• 右鍵：更多選項';
            fab.setAttribute('aria-label', '對話導航浮動鈕');
            fab.style.bottom = `${pos.bottom}px`;
            fab.style.right = `${pos.right}px`;
            fab.appendChild(Icons.chat('lg'));
            return fab;
        }

        _createIndicator() {
            const indicator = document.createElement('div');
            indicator.id = CONFIG.INDICATOR_ID;
            indicator.className = 'lm-nav-indicator';
            indicator.title = '對話導航\n• 懸停：顯示導航板\n• 拖動：調整位置\n• 右鍵：更多選項';
            indicator.setAttribute('aria-label', '對話導航指示條');
            const wrapper = document.createElement('div');
            wrapper.id = CONFIG.WRAPPER_ID;
            wrapper.className = 'lm-nav-indicator-wrapper';
            indicator.appendChild(wrapper);
            const pos = IndicatorPosition.load();
            indicator.dataset.edge = pos.edge;
            Object.assign(indicator.style, IndicatorPosition.getStyles());
            return indicator;
        }

        _createPanel(settings) {
            const panel = document.createElement('div');
            panel.id = CONFIG.PANEL_ID;
            panel.className = 'lm-nav-panel';
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-label', '對話導航板');
            panel.appendChild(this._createPanelHeader(settings));
            panel.appendChild(this._createSearchBar());
            const content = document.createElement('div');
            content.className = 'lm-nav-content';
            const messageList = document.createElement('ul');
            messageList.className = 'lm-nav-list';
            messageList.setAttribute('role', 'listbox');
            messageList.setAttribute('aria-label', '消息列表');
            content.appendChild(messageList);
            const favoriteList = document.createElement('ul');
            favoriteList.className = 'lm-nav-favorites-list';
            favoriteList.setAttribute('role', 'listbox');
            favoriteList.setAttribute('aria-label', '收藏列表');
            content.appendChild(favoriteList);
            const emptyState = document.createElement('div');
            emptyState.className = 'lm-nav-empty-state';
            content.appendChild(emptyState);
            panel.appendChild(content);
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'lm-nav-resize-handle lm-nav-resize-se';
            resizeHandle.dataset.direction = 'se';
            panel.appendChild(resizeHandle);
            return panel;
        }

        _createPanelHeader(settings) {
            const header = document.createElement('div');
            header.className = 'lm-nav-header';
            const left = document.createElement('div');
            left.className = 'lm-nav-header-left';
            const viewToggle = document.createElement('button');
            viewToggle.className = 'lm-nav-view-toggle';
            viewToggle.title = `切換視圖 (${Keybindings.formatBinding(Keybindings.getAll().toggleView || DEFAULT_KEYBINDINGS.toggleView)})`;
            viewToggle.setAttribute('aria-label', '切換消息/收藏');
            const viewIcon = document.createElement('span');
            viewIcon.className = 'lm-nav-view-icon';
            viewIcon.appendChild(settings.panelView === 'messages' ? Icons.messageSquare('md') : Icons.starOutline('md'));
            const viewLabel = document.createElement('span');
            viewLabel.className = 'lm-nav-view-label';
            viewLabel.textContent = settings.panelView === 'messages' ? '消息' : '收藏';
            const viewArrow = document.createElement('span');
            viewArrow.className = 'lm-nav-view-arrow';
            viewArrow.appendChild(Icons.chevronDown('sm'));
            viewToggle.appendChild(viewIcon);
            viewToggle.appendChild(viewLabel);
            viewToggle.appendChild(viewArrow);
            const favBadge = document.createElement('span');
            favBadge.className = 'lm-nav-fav-badge';
            favBadge.style.display = 'none';
            viewToggle.appendChild(favBadge);
            left.appendChild(viewToggle);
            header.appendChild(left);
            const right = document.createElement('div');
            right.className = 'lm-nav-header-right';
            const createActionBtn = (className, title, icon) => {
                const btn = document.createElement('button');
                btn.className = `lm-nav-action-btn ${className}`;
                btn.title = title;
                btn.setAttribute('aria-label', title.split(' (')[0]);
                btn.appendChild(icon);
                return btn;
            };
            const bindings = Keybindings.getAll();
            right.appendChild(createActionBtn('lm-nav-sort-btn', `切換排序 (${Keybindings.formatBinding(bindings.toggleOrder || DEFAULT_KEYBINDINGS.toggleOrder)})`, settings.reversedOrder ? Icons.sortDesc('md') : Icons.sortAsc('md')));
            right.appendChild(createActionBtn('lm-nav-load-btn', `載入更多歷史 (${Keybindings.formatBinding(bindings.loadHistory || DEFAULT_KEYBINDINGS.loadHistory)})`, Icons.download('md')));
            right.appendChild(createActionBtn('lm-nav-manage-btn', `開關收藏夾 (${Keybindings.formatBinding(bindings.toggleFavManager || DEFAULT_KEYBINDINGS.toggleFavManager)})`, Icons.folderOpen('md')));
            right.appendChild(createActionBtn('lm-nav-pin-btn', `固定導航板 (${Keybindings.formatBinding(bindings.togglePanelPin || DEFAULT_KEYBINDINGS.togglePanelPin)})`, Icons.pin('md')));
            right.appendChild(createActionBtn('lm-nav-settings-btn', `開關設定 (${Keybindings.formatBinding(bindings.toggleSettings || DEFAULT_KEYBINDINGS.toggleSettings)})`, Icons.settings('md')));
            header.appendChild(right);
            return header;
        }

        _createSearchBar() {
            const bar = document.createElement('div');
            bar.className = 'lm-nav-search';
            const icon = document.createElement('span');
            icon.className = 'lm-nav-search-icon';
            icon.appendChild(Icons.search('sm'));
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'lm-nav-search-input';
            input.placeholder = '搜尋...';
            input.setAttribute('aria-label', '搜尋');
            const clear = document.createElement('button');
            clear.className = 'lm-nav-search-clear';
            clear.setAttribute('aria-label', '清除搜尋');
            clear.appendChild(Icons.close('xs'));
            clear.style.display = 'none';
            const separator = document.createElement('span');
            separator.className = 'lm-nav-search-separator';
            const pagination = document.createElement('div');
            pagination.className = 'lm-nav-pagination';
            const prevBtn = document.createElement('button');
            prevBtn.className = 'lm-nav-page-btn lm-nav-page-prev';
            prevBtn.setAttribute('aria-label', '上一頁');
            prevBtn.appendChild(Icons.chevronLeft('xs'));
            const pageInfo = document.createElement('span');
            pageInfo.className = 'lm-nav-page-info';
            const nextBtn = document.createElement('button');
            nextBtn.className = 'lm-nav-page-btn lm-nav-page-next';
            nextBtn.setAttribute('aria-label', '下一頁');
            nextBtn.appendChild(Icons.chevronRight('xs'));
            pagination.appendChild(prevBtn);
            pagination.appendChild(pageInfo);
            pagination.appendChild(nextBtn);
            const aiToggle = document.createElement('button');
            aiToggle.className = 'lm-nav-ai-toggle';
            aiToggle.title = `導航板顯示/隱藏 AI 回覆 (${Keybindings.formatBinding(Keybindings.getAll().toggleAIMessages || DEFAULT_KEYBINDINGS.toggleAIMessages)})`;
            aiToggle.setAttribute('aria-label', '導航板顯示/隱藏 AI 回覆');
            aiToggle.appendChild(Icons.bot('sm'));
            const enabled = Settings.get('showAIMessages');
            aiToggle.classList.toggle('lm-nav-ai-toggle--active', enabled);
            aiToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
            bar.appendChild(icon);
            bar.appendChild(input);
            bar.appendChild(clear);
            bar.appendChild(separator);
            bar.appendChild(pagination);
            bar.appendChild(aiToggle);
            return bar;
        }

        _bindEvents() {
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (fab) { fab.addEventListener('mousedown', this._onFabMouseDown.bind(this)); fab.addEventListener('contextmenu', this._onContextMenu.bind(this)); }
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (indicator) {
                indicator.addEventListener('mousedown', this._onIndicatorMouseDown.bind(this));
                indicator.addEventListener('mouseenter', this._onIndicatorMouseEnter.bind(this));
                indicator.addEventListener('mouseleave', this._onIndicatorMouseLeave.bind(this));
                indicator.addEventListener('contextmenu', this._onContextMenu.bind(this));
                indicator.addEventListener('click', this._onIndicatorClick.bind(this));
                indicator.addEventListener('mousemove', this._onIndicatorMouseMove.bind(this));
                indicator.addEventListener('keydown', (e) => {
                    const line = e.target.closest('.lm-nav-line');
                    if (!line) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (line.dataset.action === 'bottom') { this._scrollToBottom(); return; }
                        const idx = parseInt(line.dataset.originalIndex ?? line.dataset.index);
                        if (!isNaN(idx)) this.navigateToIndex(idx);
                    }
                });
            }
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (panel) {
                panel.addEventListener('mousedown', this._onPanelMouseDown.bind(this));
                panel.addEventListener('mouseenter', this._onPanelMouseEnter.bind(this));
                panel.addEventListener('mouseleave', this._onPanelMouseLeave.bind(this));
                panel.addEventListener('click', this._onPanelClick.bind(this));
                panel.addEventListener('contextmenu', this._onPanelContextMenu.bind(this));
                panel.addEventListener('focusin', this._onPanelFocusIn.bind(this));
            }
            panel?.querySelector('.lm-nav-resize-handle')?.addEventListener('mousedown', this._onPanelResizeStart.bind(this));
            const searchInput = document.querySelector('.lm-nav-search-input');
            const searchClear = document.querySelector('.lm-nav-search-clear');
            if (searchInput) { searchInput.addEventListener('input', this._onSearchInput.bind(this)); searchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') searchInput.blur(); }); }
            if (searchClear) searchClear.addEventListener('click', this._onSearchClear.bind(this));
            document.addEventListener('mousemove', this._boundHandlers.mouseMove);
            document.addEventListener('mouseup', this._boundHandlers.mouseUp);
            document.addEventListener('click', this._boundHandlers.documentClick, true);
            window.addEventListener('scroll', this._boundHandlers.scroll, { capture: true, passive: true });
            window.addEventListener('resize', this._boundHandlers.resize);
            if (Settings.getAll().autoHideFab || Settings.getAll().autoHideIndicator) this._enableAutoHide();
            this._setupUrlWatcher();
        }

        _onFabMouseDown(e) {
            if (e.button !== 0) return;
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (!fab) return;
            this._fabDrag = { active: true, startX: e.clientX, startY: e.clientY, startPos: { bottom: parseInt(fab.style.bottom) || DEFAULT_FAB_POSITION.bottom, right: parseInt(fab.style.right) || DEFAULT_FAB_POSITION.right }, moved: false };
            fab.classList.add('lm-nav-fab--dragging');
            e.preventDefault();
        }

        _handleMouseMove(e) {
            if (this._fabDrag.active) this._handleFabDrag(e);
            else if (this._panelResize.active) this._handlePanelResize(e);
            else if (this._panelDrag.active) this._handlePanelDrag(e);
            else if (this._indicatorDrag.active) this._handleIndicatorDrag(e);
        }

        _handleMouseUp() {
            if (this._fabDrag.active) this._endFabDrag();
            if (this._panelResize.active) this._endPanelResize();
            if (this._panelDrag.active) this._endPanelDrag();
            if (this._indicatorDrag.active) this._endIndicatorDrag();
        }

        _handleFabDrag(e) {
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (!fab) return;
            const dx = this._fabDrag.startX - e.clientX, dy = this._fabDrag.startY - e.clientY;
            if (!this._fabDrag.moved && Math.sqrt(dx * dx + dy * dy) > 5) this._fabDrag.moved = true;
            if (this._fabDrag.moved) {
                fab.style.right = `${utils.clamp(this._fabDrag.startPos.right + dx, 10, window.innerWidth - fab.offsetWidth - 10)}px`;
                fab.style.bottom = `${utils.clamp(this._fabDrag.startPos.bottom + dy, 10, window.innerHeight - fab.offsetHeight - 10)}px`;
            }
        }

        _endFabDrag() {
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (fab) {
                fab.classList.remove('lm-nav-fab--dragging');
                if (this._fabDrag.moved) FabPosition.save({ right: parseInt(fab.style.right), bottom: parseInt(fab.style.bottom) });
                else this.togglePanel();
            }
            this._fabDrag.active = false;
            this._fabDrag.moved = false;
        }

        _onIndicatorMouseDown(e) {
            if (e.button !== 0) return;
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (!indicator) return;
            this._indicatorDrag = { active: true, startX: e.clientX, startY: e.clientY, startPos: { ...IndicatorPosition.load() }, moved: false, justDragged: false, clickedLine: e.target.closest('.lm-nav-line') };
            indicator.classList.add('lm-nav-indicator--dragging');
            e.preventDefault();
        }

        _onIndicatorMouseEnter() {
            this._hoverState.isOverIndicator = true;
            this._cancelHidePanel();
            if (!this._indicatorDrag.active) this._scheduleShowPanel(document.getElementById(CONFIG.INDICATOR_ID));
        }

        _onIndicatorMouseLeave() {
            this._hoverState.isOverIndicator = false;
            if (this.panelState === 'hover') this._scheduleHidePanel();
            if (this._hoverState.showTimer) { clearTimeout(this._hoverState.showTimer); this._hoverState.showTimer = null; }
            this._clearFisheyeEffect();
        }

        _onIndicatorMouseMove(e) {
            if (this._indicatorDrag.active) return;
            const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
            if (!wrapper) return;
            const lines = wrapper.querySelectorAll('.lm-nav-line:not(.lm-nav-line--bottom)');
            if (lines.length < 3) return;
            if (this._fisheyeState.rafId) return;
            this._fisheyeState.rafId = requestAnimationFrame(() => {
                this._fisheyeState.rafId = null;
                if (!this._fisheyeState.isActive) { wrapper.classList.add('lm-nav-fisheye-active'); this._fisheyeState.isActive = true; }
                this._fisheyeState.lastMouseY = e.clientY;
                this._applyFisheyeEffect(wrapper, e.clientY);
            });
        }

        _onIndicatorClick(e) {
            if (this._indicatorDrag.moved || this._indicatorDrag.justDragged) return;
            const line = e.target.closest('.lm-nav-line');
            if (!line) return;
            if (line.dataset.action === 'bottom') { this._scrollToBottom(); return; }
            const index = parseInt(line.dataset.originalIndex ?? line.dataset.index);
            if (!isNaN(index)) this.navigateToIndex(index);
        }

        _handleIndicatorDrag(e) {
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (!indicator) return;
            const dx = e.clientX - this._indicatorDrag.startX, dy = e.clientY - this._indicatorDrag.startY;
            if (!this._indicatorDrag.moved && Math.sqrt(dx * dx + dy * dy) > 5) this._indicatorDrag.moved = true;
            if (!this._indicatorDrag.moved) return;
            const newTop = utils.clamp(this._indicatorDrag.startPos.top + dy, 20, window.innerHeight - indicator.offsetHeight - 20);
            const newEdge = e.clientX < window.innerWidth / 2 ? 'left' : 'right';
            indicator.style.top = `${newTop}px`;
            indicator.dataset.edge = newEdge;
            if (newEdge === 'left') { indicator.style.left = '4px'; indicator.style.right = 'auto'; }
            else { indicator.style.right = '4px'; indicator.style.left = 'auto'; }
        }

        _endIndicatorDrag() {
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (indicator) {
                indicator.classList.remove('lm-nav-indicator--dragging');
                if (this._indicatorDrag.moved) {
                    IndicatorPosition.save({ edge: indicator.style.left !== 'auto' ? 'left' : 'right', top: parseInt(indicator.style.top) || 100 });
                    this._indicatorDrag.justDragged = true;
                    setTimeout(() => { this._indicatorDrag.justDragged = false; }, 220);
                    toast.success(`指示條已移至${indicator.style.left !== 'auto' ? '左' : '右'}側`);
                }
            }
            this._indicatorDrag.active = false;
            const wasMoved = this._indicatorDrag.moved;
            setTimeout(() => { if (wasMoved) this._indicatorDrag.moved = false; }, 220);
            this._indicatorDrag.clickedLine = null;
        }

        _onPanelMouseDown(e) {
            if (e.target.closest('button, input, textarea, a, .lm-nav-resize-handle') || e.button !== 0) return;
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            const rect = panel.getBoundingClientRect();
            this._panelDrag = { active: true, startX: e.clientX, startY: e.clientY, startPos: { left: rect.left, top: rect.top }, moved: false, justDragged: false };
            panel.classList.add('lm-nav-panel--dragging');
            e.preventDefault();
        }

        _onPanelMouseEnter() { this._hoverState.isOverPanel = true; this._cancelHidePanel(); }
        _onPanelMouseLeave() { this._hoverState.isOverPanel = false; if (!this._hasFocusInPanel() && this.panelState === 'hover') this._scheduleHidePanel(); }
        _onPanelContextMenu(e) { if (e.target.closest('input, textarea')) return; e.preventDefault(); e.stopPropagation(); this._onContextMenu(e); }
        _onPanelFocusIn() { if (this.panelState === 'hover') { this.panelState = 'open'; this._clearHoverTimers(); } }

        _handlePanelDrag(e) {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            const dx = e.clientX - this._panelDrag.startX, dy = e.clientY - this._panelDrag.startY;
            if (!this._panelDrag.moved && Math.sqrt(dx * dx + dy * dy) > 5) this._panelDrag.moved = true;
            if (!this._panelDrag.moved) return;
            panel.style.left = `${utils.clamp(this._panelDrag.startPos.left + dx, 10, window.innerWidth - panel.offsetWidth - 10)}px`;
            panel.style.top = `${utils.clamp(this._panelDrag.startPos.top + dy, 10, window.innerHeight - panel.offsetHeight - 10)}px`;
        }

        _endPanelDrag() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (panel) {
                panel.classList.remove('lm-nav-panel--dragging');
                if (this._panelDrag.moved) {
                    PanelPosition.save({ left: parseInt(panel.style.left), top: parseInt(panel.style.top) });
                    this._panelDrag.justDragged = true;
                    setTimeout(() => { this._panelDrag.justDragged = false; }, 220);
                }
            }
            this._panelDrag.active = false;
            const wasMoved = this._panelDrag.moved;
            setTimeout(() => { if (wasMoved) this._panelDrag.moved = false; }, 220);
        }

        _onPanelClick(e) {
            if (this._panelDrag.moved || this._panelDrag.justDragged) return;
            const target = e.target.closest('button, li');
            if (!target) return;
            if (target.closest('.lm-nav-view-toggle')) { this.togglePanelView(); return; }
            if (target.classList.contains('lm-nav-sort-btn')) { this.toggleOrder(); return; }
            if (target.classList.contains('lm-nav-load-btn')) { this.loadHistory(); return; }
            if (target.classList.contains('lm-nav-manage-btn')) { this.toggleFavoriteManager(); return; }
            if (target.classList.contains('lm-nav-pin-btn')) { this.togglePanelPin(); return; }
            if (target.classList.contains('lm-nav-settings-btn')) { this.toggleSettings(); return; }
            if (target.classList.contains('lm-nav-page-prev')) { this._goToPage(this.currentPage - 1); return; }
            if (target.classList.contains('lm-nav-page-next')) { this._goToPage(this.currentPage + 1); return; }
            if (target.classList.contains('lm-nav-ai-toggle')) { this.toggleAIMessages(); return; }
            if (target.classList.contains('lm-nav-item')) { const index = parseInt(target.dataset.index); if (!isNaN(index)) this.navigateToIndex(index); return; }
            if (target.classList.contains('lm-nav-star-btn')) { e.stopPropagation(); const { msgId, msgText, msgType } = target.dataset; if (msgId) { Favorites.toggle(msgId, msgText, msgType || 'user'); toast.success(Favorites.has(msgId) ? '已收藏' : '已取消收藏'); } return; }
            if (target.classList.contains('lm-nav-copy-btn')) { e.stopPropagation(); this._copyText(target.dataset.text, target); return; }
            if (target.classList.contains('lm-nav-insert-btn')) { e.stopPropagation(); this._insertToInput(target.dataset.text); return; }
        }

        _onPanelResizeStart(e) {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            const rect = panel.getBoundingClientRect();
            this._panelResize = { active: true, direction: e.target.dataset.direction || 'se', startX: e.clientX, startY: e.clientY, startWidth: rect.width, startHeight: rect.height };
            panel.classList.add('lm-nav-panel--resizing');
            document.body.style.cursor = 'nwse-resize';
        }

        _handlePanelResize(e) {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            panel.style.width = `${utils.clamp(this._panelResize.startWidth + e.clientX - this._panelResize.startX, 280, 680)}px`;
            panel.style.maxHeight = `${utils.clamp(this._panelResize.startHeight + e.clientY - this._panelResize.startY, 250, 850)}px`;
        }

        _endPanelResize() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (panel) { panel.classList.remove('lm-nav-panel--resizing'); PanelSize.save({ width: parseInt(panel.style.width), height: parseInt(panel.style.maxHeight) }); }
            this._panelResize.active = false;
            document.body.style.cursor = '';
        }

        _applyPanelSize() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            const size = PanelSize.load();
            panel.style.width = `${size.width}px`;
            panel.style.maxHeight = `${size.height}px`;
        }

        _onSearchInput(e) {
            const value = e.target.value;
            const clearBtn = document.querySelector('.lm-nav-search-clear');
            if (clearBtn) clearBtn.style.display = value ? 'flex' : 'none';
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this.searchQuery = value.toLowerCase().trim();
                this.currentPage = 1;
                if (Settings.get('panelView') === 'messages') this._renderList();
                else this._renderFavorites();
                this._renderPagination();
            }, 160);
        }

        _onSearchClear() {
            const input = document.querySelector('.lm-nav-search-input');
            const clearBtn = document.querySelector('.lm-nav-search-clear');
            if (input) { input.value = ''; input.focus(); }
            if (clearBtn) clearBtn.style.display = 'none';
            this.searchQuery = '';
            this.currentPage = 1;
            if (Settings.get('panelView') === 'messages') this._renderList();
            else this._renderFavorites();
            this._renderPagination();
        }

        _onContextMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            const settings = Settings.getAll();
            const indicatorPos = IndicatorPosition.load();
            const bindings = Keybindings.getAll();
            const menuItems = [
                { icon: () => Icons.list('sm'), label: this.isPanelOpen ? '關閉導航板' : '打開導航板', shortcut: Keybindings.formatBinding(bindings.togglePanel || DEFAULT_KEYBINDINGS.togglePanel), action: () => this.togglePanel() },
                { icon: () => (this.panelState === 'pinned' ? Icons.pinOff('sm') : Icons.pin('sm')), label: this.panelState === 'pinned' ? '取消固定導航板' : '固定導航板', shortcut: Keybindings.formatBinding(bindings.togglePanelPin || DEFAULT_KEYBINDINGS.togglePanelPin), action: () => this.togglePanelPin() },
                { separator: true },
                { icon: () => (settings.reversedOrder ? Icons.sortAsc('sm') : Icons.sortDesc('sm')), label: settings.reversedOrder ? '正序排列' : '倒序排列', shortcut: Keybindings.formatBinding(bindings.toggleOrder || DEFAULT_KEYBINDINGS.toggleOrder), action: () => this.toggleOrder() },
                { icon: () => Icons.download('sm'), label: '載入更多歷史', shortcut: Keybindings.formatBinding(bindings.loadHistory || DEFAULT_KEYBINDINGS.loadHistory), action: () => this.loadHistory() },
                { icon: () => Icons.bot('sm'), label: Settings.get('showAIMessages') ? '導航板隱藏 AI 回覆' : '導航板顯示 AI 回覆', shortcut: Keybindings.formatBinding(bindings.toggleAIMessages || DEFAULT_KEYBINDINGS.toggleAIMessages), action: () => this.toggleAIMessages() },
                { separator: true },
                { icon: () => Icons.folderOpen('sm'), label: '開關收藏夾', shortcut: Keybindings.formatBinding(bindings.toggleFavManager || DEFAULT_KEYBINDINGS.toggleFavManager), action: () => this.toggleFavoriteManager() },
                { icon: () => Icons.arrowLeftRight('sm'), label: `指示條移至${indicatorPos.edge === 'right' ? '左' : '右'}側`, shortcut: Keybindings.formatBinding(bindings.toggleIndicatorEdge || DEFAULT_KEYBINDINGS.toggleIndicatorEdge), action: () => this.toggleIndicatorEdge() },
                { separator: true },
                { icon: () => Icons.settings('sm'), label: '開關設定', shortcut: Keybindings.formatBinding(bindings.toggleSettings || DEFAULT_KEYBINDINGS.toggleSettings), action: () => this.toggleSettings() },
                { icon: () => Icons.mapPin('sm'), label: '重置所有位置', action: () => { this.resetAllPositions(); toast.success('位置已重置'); } },
            ];
            this.contextMenu.show(e.clientX, e.clientY, menuItems);
        }

        _handleDocumentClick(e) {
            if (this.panelState === 'hidden' || this.panelState === 'pinned') return;
            const panel = document.getElementById(CONFIG.PANEL_ID);
            const fab = document.getElementById(CONFIG.FAB_ID);
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (panel?.contains(e.target) || fab?.contains(e.target) || indicator?.contains(e.target) || this.contextMenu.element?.contains(e.target) || e.target.closest('.lm-nav-dialog-overlay, .lm-nav-toast')) return;
            this._hidePanel();
        }

        _scrollToBottom() {
            const scrollParent = this._getScrollParent(document.body);
            if (!scrollParent) return;
            scrollParent.scrollTo({ top: scrollParent.scrollHeight, behavior: Settings.getAll().enableAnimation ? 'smooth' : 'auto' });
            toast.info('已跳到底部');
        }

        _handleResize() {
            this._validatePositions();
            this._fisheyeState.linePositionsValid = false;
            this._renderIndicator();
            this._renderPagination();
        }

        _validatePositions() {
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (fab) {
                const right = parseInt(fab.style.right) || 0, bottom = parseInt(fab.style.bottom) || 0;
                const newRight = utils.clamp(right, 10, window.innerWidth - fab.offsetWidth - 10);
                const newBottom = utils.clamp(bottom, 10, window.innerHeight - fab.offsetHeight - 10);
                if (newRight !== right || newBottom !== bottom) { fab.style.right = `${newRight}px`; fab.style.bottom = `${newBottom}px`; FabPosition.save({ right: newRight, bottom: newBottom }); }
            }
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (indicator) {
                const pos = IndicatorPosition.load();
                const newTop = utils.clamp(pos.top, 20, window.innerHeight - indicator.offsetHeight - 20);
                if (newTop !== pos.top) { IndicatorPosition.save({ ...pos, top: newTop }); this._applyIndicatorPosition(); }
            }
            if (this.isPanelOpen) {
                const panel = document.getElementById(CONFIG.PANEL_ID);
                if (panel) {
                    const left = parseInt(panel.style.left) || 0, top = parseInt(panel.style.top) || 0;
                    const newLeft = utils.clamp(left, 10, window.innerWidth - panel.offsetWidth - 10);
                    const newTop = utils.clamp(top, 10, window.innerHeight - panel.offsetHeight - 10);
                    if (newLeft !== left || newTop !== top) { panel.style.left = `${newLeft}px`; panel.style.top = `${newTop}px`; PanelPosition.save({ left: newLeft, top: newTop }); }
                }
            }
        }

        _enableAutoHide() { document.addEventListener('mousemove', this._boundHandlers.proximity); }
        _disableAutoHide() {
            document.removeEventListener('mousemove', this._boundHandlers.proximity);
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (container) { container.classList.add('lm-nav-fab--near', 'lm-nav-indicator--near'); }
        }

        _handleProximity(e) {
            const settings = Settings.getAll();
            const fab = document.getElementById(CONFIG.FAB_ID);
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            const panel = document.getElementById(CONFIG.PANEL_ID);
            const th = CONFIG.PROXIMITY_THRESHOLD;
            const near = (el) => { if (!el) return false; const rect = el.getBoundingClientRect(); return e.clientX >= rect.left - th && e.clientX <= rect.right + th && e.clientY >= rect.top - th && e.clientY <= rect.bottom + th; };
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (settings.autoHideFab && fab) {
                if (near(fab)) { container?.classList.add('lm-nav-fab--near'); this._clearAutoHideFabTimer(); }
                else if (!this._autoHideState.fabTimer) { this._autoHideState.fabTimer = setTimeout(() => { container?.classList.remove('lm-nav-fab--near'); this._autoHideState.fabTimer = null; }, CONFIG.AUTO_HIDE_DELAY); }
            }
            if (settings.autoHideIndicator && indicator) {
                if (near(indicator) || (panel && panel.contains(e.target) && this.panelState !== 'hidden')) { container?.classList.add('lm-nav-indicator--near'); this._clearAutoHideIndicatorTimer(); }
                else if (!this._autoHideState.indicatorTimer) { this._autoHideState.indicatorTimer = setTimeout(() => { container?.classList.remove('lm-nav-indicator--near'); this._autoHideState.indicatorTimer = null; }, CONFIG.AUTO_HIDE_DELAY); }
            }
        }

        _clearAutoHideFabTimer() { if (this._autoHideState.fabTimer) { clearTimeout(this._autoHideState.fabTimer); this._autoHideState.fabTimer = null; } }
        _clearAutoHideIndicatorTimer() { if (this._autoHideState.indicatorTimer) { clearTimeout(this._autoHideState.indicatorTimer); this._autoHideState.indicatorTimer = null; } }
        _clearAutoHideTimers() { this._clearAutoHideFabTimer(); this._clearAutoHideIndicatorTimer(); }

        _setupUrlWatcher() {
            if (!this._popstateBound) { window.addEventListener('popstate', () => this._onUrlChange()); this._popstateBound = true; }
            if (!window.__LM_NAV_HISTORY_PATCHED__) {
                const self = this;
                const origPushState = history.pushState, origReplaceState = history.replaceState;
                history.pushState = function (...args) { origPushState.apply(history, args); self._onUrlChange(); };
                history.replaceState = function (...args) { origReplaceState.apply(history, args); self._onUrlChange(); };
                window.__LM_NAV_HISTORY_PATCHED__ = true;
            }
            if (this._urlWatchTimer) clearInterval(this._urlWatchTimer);
            this._urlWatchTimer = setInterval(() => { if (location.href !== this.lastUrl) this._onUrlChange(); }, 1000);
        }

        _onUrlChange() {
            const keep = this.panelState === 'pinned' || this.panelState === 'open';
            this._resetState({ keepPanel: keep });
            setTimeout(() => this.updateMessages(), 350);
        }

        _setupObservers() {
            const messageObserver = new MutationObserver((mutations) => {
                if (mutations.some(m => m.addedNodes?.length > 0 || m.target?.closest?.('ol.mt-8, main'))) this._debouncedUpdate();
            });
            const chatContainer = document.querySelector('ol.mt-8');
            if (chatContainer) messageObserver.observe(chatContainer, { childList: true, subtree: true });
            else messageObserver.observe(document.body, { childList: true, subtree: true });
            const themeObserver = new MutationObserver(() => Theme.detect());
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
            if (document.body) themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        }

        _onSettingChange(key, value, oldValue) {
            switch (key) {
                case 'showFab': case 'showIndicator': case 'autoHideFab': case 'autoHideIndicator': this._applyVisibilitySettings(); break;
                case 'fabOpacity': case 'indicatorOpacity': case 'fabScale': case 'fontSize': case 'fontFamily': this._applyAppearance(); break;
                case 'reversedOrder': this._updateSortButton(); this._renderList(); this._renderFavorites(); this._renderPagination(); break;
                case 'showAIMessages': this.currentPage = 1; this._renderList(); this._renderFavorites(); this._renderPagination(); this._updateFavBadge(); this._syncAIToggleButton(); break;
                case 'showAIInIndicator': this._fisheyeState.linePositionsValid = false; this._renderIndicator(); break;
                case 'paginatePanel': this.currentPage = 1; this._renderList(); this._renderFavorites(); this._renderPagination(); break;
                case 'panelView': this._applyPanelView(value); break;
                case 'indicatorShowLength': case 'indicatorShowFavorites': this._fisheyeState.linePositionsValid = false; this._renderIndicator(); break;
                case 'reset': case 'batch': this._applySettings(Settings.getAll()); break;
            }
        }

        _onFavoriteChange(action, data) {
            if (Settings.get('panelView') === 'favorites') this._renderFavorites();
            if (data?.id) this._syncStarButtons(data.id);
            if (action === 'removeMultiple' || action === 'clearAll' || action === 'clearPage') this._renderList();
            if (Settings.get('indicatorShowFavorites')) this._updateIndicatorFavoriteMarkers();
            this._renderPagination();
            this._updateFavBadge();
            if (this.isFavManagerOpen) {
                const suppressRemove = action === 'remove' && this._favManagerState.suppressNextRemoveRerender;
                const suppressUndo = action === 'undo' && this._favManagerState.suppressNextUndoRerender;
                if (suppressRemove || suppressUndo) { this._favManagerState.suppressNextRemoveRerender = false; this._favManagerState.suppressNextUndoRerender = false; }
                else { this._clearFavManagerPendingDeletes?.(); this._renderFavManagerList?.(); }
            }
        }

        _updateIndicatorFavoriteMarkers() {
            if (!Settings.get('indicatorShowFavorites')) return;
            const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
            if (!wrapper) return;
            const favoritedMsgIds = new Set();
            Favorites.getForCurrentPage().forEach(fav => { const matched = Favorites.findMatchingMessage(this.messages, fav); if (matched) favoritedMsgIds.add(matched.id); });
            wrapper.querySelectorAll('.lm-nav-line:not(.lm-nav-line--bottom)').forEach(line => {
                const idx = parseInt(line.dataset.originalIndex);
                if (isNaN(idx)) return;
                const msg = this.messages.find(m => m.index === idx);
                if (msg) line.dataset.isFavorite = favoritedMsgIds.has(msg.id) ? 'true' : 'false';
            });
        }

        _onThemeChange(isDark) { const container = document.getElementById(CONFIG.CONTAINER_ID); if (container) container.dataset.theme = isDark ? 'dark' : 'light'; }

        _applySettings(settings) {
            this._applyVisibilitySettings();
            this._applyAppearance();
            this._applyPanelView(settings.panelView);
            this._applyIndicatorPosition();
            this._updateSortButton();
            this._syncAIToggleButton();
            this._updateFavBadge();
        }

        _applyVisibilitySettings() {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (!container) return;
            const settings = Settings.getAll();
            container.dataset.showFab = settings.showFab ? 'true' : 'false';
            container.dataset.showIndicator = settings.showIndicator ? 'true' : 'false';
            container.dataset.autoHideFab = settings.autoHideFab ? 'true' : 'false';
            container.dataset.autoHideIndicator = settings.autoHideIndicator ? 'true' : 'false';
            if (settings.autoHideFab || settings.autoHideIndicator) this._enableAutoHide();
            else this._disableAutoHide();
        }

        _applyAppearance() {
            const container = document.getElementById(CONFIG.CONTAINER_ID);
            if (!container) return;
            const settings = Settings.getAll();
            container.style.setProperty('--lm-nav-fab-opacity', String(settings.fabOpacity / 100));
            container.style.setProperty('--lm-nav-indicator-opacity', String(settings.indicatorOpacity / 100));
            container.style.setProperty('--lm-nav-fab-scale', String(settings.fabScale / 100));
            container.style.setProperty('--lm-nav-font-size', `${settings.fontSize}px`);
            container.style.setProperty('--lm-nav-font-family', Settings.getFontFamily());
        }

        _applyPanelView(view) {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (!panel) return;
            panel.dataset.view = view;
            const viewIcon = document.querySelector('.lm-nav-view-icon');
            const viewLabel = document.querySelector('.lm-nav-view-label');
            if (viewIcon) { viewIcon.innerHTML = ''; viewIcon.appendChild(view === 'messages' ? Icons.messageSquare('md') : Icons.starOutline('md')); }
            if (viewLabel) viewLabel.textContent = view === 'messages' ? '消息' : '收藏';
            this.currentPage = 1;
            if (view === 'messages') this._renderList();
            else this._renderFavorites();
            this._renderPagination();
        }

        _applyIndicatorPosition() {
            const indicator = document.getElementById(CONFIG.INDICATOR_ID);
            if (!indicator) return;
            const pos = IndicatorPosition.load();
            indicator.dataset.edge = pos.edge;
            Object.assign(indicator.style, IndicatorPosition.getStyles());
        }

        _updateSortButton() {
            const btn = document.querySelector('.lm-nav-sort-btn');
            if (!btn) return;
            btn.innerHTML = '';
            btn.appendChild(Settings.get('reversedOrder') ? Icons.sortDesc('md') : Icons.sortAsc('md'));
        }

        _syncAIToggleButton() {
            const btn = document.querySelector('.lm-nav-ai-toggle');
            if (!btn) return;
            const enabled = Settings.get('showAIMessages');
            btn.classList.toggle('lm-nav-ai-toggle--active', enabled);
            btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        }

        _getFilteredFavoritesForView() {
            const settings = Settings.getAll();
            let favs = Favorites.getForCurrentPage();
            if (!settings.showAIMessages) favs = favs.filter(f => (f.type || 'user') === 'user');
            if (this.searchQuery) favs = favs.filter(f => (f.text || f.preview || '').toLowerCase().includes(this.searchQuery));
            return favs;
        }

        _getFilteredFavoriteCountForBadge() {
            const settings = Settings.getAll();
            const favs = Favorites.getForCurrentPage();
            return settings.showAIMessages ? favs.length : favs.filter(f => (f.type || 'user') === 'user').length;
        }

        _updateFavBadge() {
            const badge = document.querySelector('.lm-nav-fav-badge');
            if (!badge) return;
            const count = this._getFilteredFavoriteCountForBadge();
            badge.textContent = count > 0 ? count : '';
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        _renderAll() {
            this._renderIndicator();
            this._renderList();
            this._renderFavorites();
            this._renderPagination();
            this._updateFavBadge();
            this._syncAIToggleButton();
        }

        _renderIndicator() {
            const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
            if (!wrapper) return;
            wrapper.innerHTML = '';
            this._fisheyeState.linePositionsValid = false;
            this._fisheyeState.linePositions = null;
            this._fisheyeState.isActive = false;
            wrapper.classList.remove('lm-nav-fisheye-active');
            const settings = Settings.getAll();
            let messagesToRender = settings.showAIInIndicator ? this.messages : this.messages.filter(m => m.type === 'user');
            const total = messagesToRender.length;
            if (total === 0) return;
            const maxAvailableHeight = Math.floor(window.innerHeight * 0.6);
            const standardPitch = CONFIG.INDICATOR_STANDARD_PITCH;
            const minPitch = CONFIG.INDICATOR_MIN_PITCH;
            const neededHeight = total * standardPitch;
            const isCrowded = total >= CONFIG.INDICATOR_CROWDED_THRESHOLD && neededHeight > maxAvailableHeight;
            let pitch = standardPitch;
            if (isCrowded) pitch = Math.max(minPitch, maxAvailableHeight / total);
            const lineHeight = Math.max(2.5, pitch * 0.55);
            const lineGap = Math.max(1.5, pitch * 0.45);
            wrapper.style.setProperty('--lm-line-h', `${lineHeight}px`);
            wrapper.style.setProperty('--lm-line-gap', `${lineGap}px`);
            wrapper.dataset.crowded = isCrowded ? 'true' : 'false';
            let favoritedMsgIds = null;
            if (settings.indicatorShowFavorites) {
                favoritedMsgIds = new Set();
                Favorites.getForCurrentPage().forEach(fav => { const matched = Favorites.findMatchingMessage(this.messages, fav); if (matched) favoritedMsgIds.add(matched.id); });
            }
            messagesToRender.forEach((msg) => {
                const line = document.createElement('div');
                let cls = `lm-nav-line lm-nav-line--${msg.type}`;
                if (msg.type === 'ai' && msg.side) cls += msg.side === 'A' ? ' lm-nav-line--ai-a' : ' lm-nav-line--ai-b';
                line.className = cls;
                line.dataset.originalIndex = String(msg.index);
                line.dataset.type = msg.type;
                if (settings.indicatorShowLength) line.dataset.msgLength = msg.getLengthCategory();
                if (settings.indicatorShowFavorites) line.dataset.isFavorite = (favoritedMsgIds?.has(msg.id)) ? 'true' : 'false';
                const sideLabel = (msg.type === 'ai' && msg.side) ? `-${msg.side}` : '';
                line.title = `#${msg.index + 1} ${msg.type === 'user' ? '我' : 'AI'}${sideLabel}: ${msg.getPreview(40)}`;
                line.setAttribute('role', 'button');
                line.setAttribute('tabindex', '0');
                line.setAttribute('aria-label', `跳到第 ${msg.index + 1} 條消息`);
                if (msg.index === this.viewingIndex) line.classList.add('lm-nav-line--viewing');
                if (msg.index === this.currentIndex) line.classList.add('lm-nav-line--current');
                wrapper.appendChild(line);
            });
            const bottomLine = document.createElement('div');
            bottomLine.className = 'lm-nav-line lm-nav-line--bottom';
            bottomLine.dataset.action = 'bottom';
            bottomLine.title = '跳到頁面底部';
            bottomLine.setAttribute('role', 'button');
            bottomLine.setAttribute('tabindex', '0');
            bottomLine.setAttribute('aria-label', '跳到頁面底部');
            wrapper.appendChild(bottomLine);
            this._syncIndicatorScroll();
        }

        _applyFisheyeEffect(wrapper, mouseY) {
            const lines = Array.from(wrapper.querySelectorAll('.lm-nav-line'));
            const n = lines.length;
            if (n === 0) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            const y = (mouseY - wrapperRect.top) + wrapper.scrollTop;
            const cs = getComputedStyle(wrapper);
            const baseGap = parseFloat(cs.getPropertyValue('--lm-line-gap')) || 0;
            const baseH = parseFloat(cs.getPropertyValue('--lm-line-h')) || 3;
            const wrapperH = wrapperRect.height || 200;
            const radius = utils.clamp(wrapperH * 0.32, 26, 110);
            const crowded = wrapper.dataset.crowded === 'true';
            const maxScale = crowded ? 1.85 : 2.20;
            const spreadMult = crowded ? 1.0 : 1.35;
            const extraGapCap = crowded ? 4 : 7;
            const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);
            if (!this._fisheyeState.linePositionsValid || !this._fisheyeState.linePositions) {
                this._fisheyeState.linePositions = lines.map(line => ({ top: line.offsetTop, height: baseH }));
                this._fisheyeState.linePositionsValid = true;
            }
            const pos = this._fisheyeState.linePositions;
            const influences = new Array(n).fill(0);
            const scales = new Array(n).fill(1);
            const halfExtra = new Array(n).fill(0);
            let centerIdx = 0, minDist = Infinity;
            for (let i = 0; i < n; i++) {
                const cy = pos[i].top + pos[i].height / 2;
                const d = Math.abs(y - cy);
                if (d < minDist) { minDist = d; centerIdx = i; }
                const softR = radius * 1.65;
                let inf = 0;
                if (d < radius) inf = smootherstep(1 - d / radius);
                else if (d < softR) inf = smootherstep(1 - d / softR) * 0.22;
                if (inf > 0) {
                    influences[i] = inf;
                    const isBottom = lines[i].dataset.action === 'bottom';
                    const sMax = isBottom ? Math.min(1.35, maxScale) : maxScale;
                    const s = 1 + (sMax - 1) * inf;
                    scales[i] = s;
                    halfExtra[i] = (pos[i].height * (s - 1)) / 2;
                }
            }
            const extraBetween = new Array(n - 1).fill(0);
            for (let i = 0; i < n - 1; i++) {
                const required = (halfExtra[i] + halfExtra[i + 1]) - baseGap;
                const avgInf = (influences[i] + influences[i + 1]) / 2;
                const desired = Math.min(extraGapCap, (halfExtra[i] + halfExtra[i + 1]) * spreadMult);
                extraBetween[i] = Math.max(0, required, desired);
            }
            const offsets = new Array(n).fill(0);
            for (let i = 1; i < n; i++) offsets[i] = offsets[i - 1] + extraBetween[i - 1];
            const anchor = offsets[centerIdx] || 0;
            for (let i = 0; i < n; i++) {
                const ty = offsets[i] - anchor;
                const s = scales[i];
                if (Math.abs(ty) > 0.02 || s > 1.003) {
                    lines[i].style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scaleY(${s.toFixed(3)})`;
                    lines[i].style.zIndex = s > 1.01 ? String(Math.round((s - 1) * 40) + 1) : '';
                } else { lines[i].style.transform = ''; lines[i].style.zIndex = ''; }
            }
        }

        _clearFisheyeEffect() {
            if (this._fisheyeState.rafId) { cancelAnimationFrame(this._fisheyeState.rafId); this._fisheyeState.rafId = null; }
            if (this._fisheyeState.idleTimer) { clearTimeout(this._fisheyeState.idleTimer); this._fisheyeState.idleTimer = null; }
            const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
            if (!wrapper) return;
            wrapper.classList.remove('lm-nav-fisheye-active');
            this._fisheyeState.isActive = false;
            this._fisheyeState.lastMouseY = null;
            wrapper.querySelectorAll('.lm-nav-line').forEach(line => { line.style.transform = ''; line.style.zIndex = ''; });
        }

        _syncIndicatorScroll() {
            const wrapper = document.getElementById(CONFIG.WRAPPER_ID);
            if (!wrapper || this._hoverState.isOverIndicator || this._fisheyeState.isActive) return;
            const activeLine = wrapper.querySelector('.lm-nav-line--viewing, .lm-nav-line--current');
            if (activeLine) activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        _updateIndicators() {
            document.querySelectorAll('.lm-nav-line').forEach(line => {
                if (line.dataset.action) return;
                const originalIdx = parseInt(line.dataset.originalIndex ?? line.dataset.index);
                line.classList.toggle('lm-nav-line--viewing', originalIdx === this.viewingIndex);
                line.classList.toggle('lm-nav-line--current', originalIdx === this.currentIndex);
            });
            document.querySelectorAll('.lm-nav-item').forEach(item => {
                const idx = parseInt(item.dataset.index);
                if (isNaN(idx)) return;
                const isViewing = idx === this.viewingIndex;
                item.classList.toggle('lm-nav-item--viewing', isViewing);
                item.setAttribute('aria-selected', isViewing ? 'true' : 'false');
            });
            this._syncIndicatorScroll();
        }

        _renderList() {
            const list = document.querySelector('.lm-nav-list');
            const emptyState = document.querySelector('.lm-nav-empty-state');
            if (!list) return;
            const settings = Settings.getAll();
            if (settings.panelView !== 'messages') { list.style.display = 'none'; return; }
            list.style.display = '';
            let msgs = settings.showAIMessages ? this.messages : this.userMessages;
            if (this.searchQuery) msgs = msgs.filter(m => (m.text || '').toLowerCase().includes(this.searchQuery));
            if (settings.reversedOrder) msgs = [...msgs].reverse();
            const paginate = !!settings.paginatePanel;
            const totalPages = paginate ? Math.ceil(msgs.length / CONFIG.PAGE_SIZE) : 1;
            this.currentPage = utils.clamp(this.currentPage, 1, Math.max(1, totalPages));
            const startIndex = paginate ? (this.currentPage - 1) * CONFIG.PAGE_SIZE : 0;
            const pageMessages = paginate ? msgs.slice(startIndex, startIndex + CONFIG.PAGE_SIZE) : msgs;
            list.innerHTML = '';
            if (pageMessages.length === 0) {
                if (emptyState) { emptyState.innerHTML = `<div class="lm-nav-empty-icon">${Icons.messageSquare('xl').outerHTML}</div><p>${this.searchQuery ? '沒有找到匹配的消息' : '暫無消息'}</p>`; emptyState.style.display = 'flex'; }
                return;
            }
            if (emptyState) emptyState.style.display = 'none';
            pageMessages.forEach(msg => list.appendChild(this._createMessageItem(msg)));
        }

        _createMessageItem(msg) {
            const isViewing = msg.index === this.viewingIndex;
            const isFav = Favorites.has(msg.id);
            const li = document.createElement('li');
            li.className = 'lm-nav-item';
            li.dataset.index = msg.index;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', isViewing ? 'true' : 'false');
            if (msg.type === 'ai') li.classList.add('lm-nav-item--ai');
            if (isViewing) li.classList.add('lm-nav-item--viewing');
            const num = document.createElement('span');
            num.className = 'lm-nav-item-num';
            num.textContent = `${msg.index + 1}`;
            const icon = document.createElement('span');
            icon.className = 'lm-nav-item-icon';
            icon.appendChild(msg.type === 'user' ? Icons.user('sm') : Icons.bot('sm'));
            const text = document.createElement('span');
            text.className = 'lm-nav-item-text';
            text.title = msg.text;
            if (this.searchQuery) text.innerHTML = utils.highlightText(msg.getPreview(), this.searchQuery);
            else text.textContent = msg.getPreview();
            const actions = document.createElement('span');
            actions.className = 'lm-nav-item-actions';
            const starBtn = document.createElement('button');
            starBtn.className = `lm-nav-icon-btn lm-nav-star-btn ${isFav ? 'is-favorite' : ''}`;
            starBtn.dataset.msgId = msg.id;
            starBtn.dataset.msgText = msg.text;
            starBtn.dataset.msgType = msg.type;
            starBtn.title = isFav ? '取消收藏' : '收藏';
            starBtn.appendChild(isFav ? Icons.starFilled('sm') : Icons.starOutline('sm'));
            actions.appendChild(starBtn);
            const copyBtn = document.createElement('button');
            copyBtn.className = 'lm-nav-icon-btn lm-nav-copy-btn';
            copyBtn.dataset.text = msg.text;
            copyBtn.title = '複製';
            copyBtn.appendChild(Icons.copy('sm'));
            actions.appendChild(copyBtn);
            li.appendChild(num);
            li.appendChild(icon);
            li.appendChild(text);
            li.appendChild(actions);
            return li;
        }

        _renderFavorites() {
            const list = document.querySelector('.lm-nav-favorites-list');
            const emptyState = document.querySelector('.lm-nav-empty-state');
            if (!list) return;
            const settings = Settings.getAll();
            if (settings.panelView !== 'favorites') { list.style.display = 'none'; return; }
            list.style.display = '';
            let favs = this._getFilteredFavoritesForView();
            favs = [...favs].sort((a, b) => settings.reversedOrder ? (b.timestamp - a.timestamp) : (a.timestamp - b.timestamp));
            const paginate = !!settings.paginatePanel;
            const totalPages = paginate ? Math.ceil(favs.length / CONFIG.PAGE_SIZE) : 1;
            this.currentPage = utils.clamp(this.currentPage, 1, Math.max(1, totalPages));
            const startIndex = paginate ? (this.currentPage - 1) * CONFIG.PAGE_SIZE : 0;
            const pageFavs = paginate ? favs.slice(startIndex, startIndex + CONFIG.PAGE_SIZE) : favs;
            const favItems = [], idsToUpdate = [];
            pageFavs.forEach(fav => {
                const msg = Favorites.findMatchingMessage(this.messages, fav);
                if (msg) { favItems.push({ msg, fav }); if (fav.id !== msg.id) idsToUpdate.push({ oldId: fav.id, newId: msg.id }); }
                else favItems.push({ msg: null, fav });
            });
            if (idsToUpdate.length > 0) idsToUpdate.forEach(({ oldId, newId }) => Favorites.updateFavoriteId(Favorites.getPageId(), oldId, newId));
            list.innerHTML = '';
            if (favItems.length === 0) {
                if (emptyState) {
                    const aiOff = !settings.showAIMessages;
                    if (this.searchQuery) emptyState.innerHTML = `<div class="lm-nav-empty-icon">${Icons.search('xl').outerHTML}</div><p>沒有找到匹配的收藏</p>`;
                    else if (aiOff) emptyState.innerHTML = `<div class="lm-nav-empty-icon">${Icons.starOutline('xl').outerHTML}</div><p>目前只顯示「用戶收藏」</p><p class="lm-nav-empty-hint">可在導航板中開啟「顯示 AI 回覆」查看 AI 收藏</p>`;
                    else emptyState.innerHTML = `<div class="lm-nav-empty-icon">${Icons.starOutline('xl').outerHTML}</div><p>本頁暫無收藏</p><p class="lm-nav-empty-hint">點擊消息旁的星號添加收藏</p>`;
                    emptyState.style.display = 'flex';
                }
                return;
            }
            if (emptyState) emptyState.style.display = 'none';
            favItems.forEach(({ msg, fav }) => list.appendChild(this._createFavoriteItem(msg, fav)));
        }

        _createFavoriteItem(msg, fav) {
            const li = document.createElement('li');
            li.className = 'lm-nav-item lm-nav-fav-item';
            li.setAttribute('role', 'option');
            const isNavigable = msg !== null;
            const msgType = msg?.type || fav.type || 'user';
            if (isNavigable) li.dataset.index = msg.index;
            else li.classList.add('lm-nav-fav-item--orphan');
            const num = document.createElement('span');
            num.className = 'lm-nav-item-num';
            num.textContent = isNavigable ? `${msg.index + 1}` : '?';
            const icon = document.createElement('span');
            icon.className = 'lm-nav-item-icon';
            icon.appendChild(msgType === 'user' ? Icons.user('sm') : Icons.bot('sm'));
            const text = document.createElement('span');
            text.className = 'lm-nav-item-text';
            const displayText = isNavigable ? msg.getPreview() : (fav.preview || utils.truncate(fav.text, 50));
            if (this.searchQuery) text.innerHTML = utils.highlightText(displayText, this.searchQuery);
            else text.textContent = displayText;
            text.title = isNavigable ? msg.text : fav.text;
            const time = document.createElement('span');
            time.className = 'lm-nav-item-time';
            time.textContent = utils.formatRelativeTime(fav.timestamp);
            const actions = document.createElement('span');
            actions.className = 'lm-nav-item-actions';
            const insertBtn = document.createElement('button');
            insertBtn.className = 'lm-nav-icon-btn lm-nav-insert-btn';
            insertBtn.dataset.text = isNavigable ? msg.text : fav.text;
            insertBtn.title = '插入到輸入框';
            insertBtn.appendChild(Icons.cornerDownLeft('sm'));
            actions.appendChild(insertBtn);
            const copyBtn = document.createElement('button');
            copyBtn.className = 'lm-nav-icon-btn lm-nav-copy-btn';
            copyBtn.dataset.text = isNavigable ? msg.text : fav.text;
            copyBtn.title = '複製';
            copyBtn.appendChild(Icons.copy('sm'));
            actions.appendChild(copyBtn);
            const starBtn = document.createElement('button');
            starBtn.className = 'lm-nav-icon-btn lm-nav-star-btn is-favorite';
            starBtn.dataset.msgId = isNavigable ? msg.id : fav.id;
            starBtn.dataset.msgText = isNavigable ? msg.text : fav.text;
            starBtn.dataset.msgType = msgType;
            starBtn.title = '取消收藏';
            starBtn.appendChild(Icons.starFilled('sm'));
            actions.appendChild(starBtn);
            li.appendChild(num);
            li.appendChild(icon);
            li.appendChild(text);
            li.appendChild(time);
            li.appendChild(actions);
            if (isNavigable) li.addEventListener('click', (e) => { if (this._panelDrag.moved || this._panelDrag.justDragged || e.target.closest('button')) return; this.navigateToIndex(msg.index); });
            else li.addEventListener('click', (e) => { if (this._panelDrag.moved || this._panelDrag.justDragged || e.target.closest('button')) return; toast.info('此消息在當前頁面中找不到'); });
            return li;
        }

        _getTotalPagesForCurrentView() {
            const settings = Settings.getAll();
            if (!settings.paginatePanel) return 1;
            if (settings.panelView === 'messages') {
                let msgs = settings.showAIMessages ? this.messages : this.userMessages;
                if (this.searchQuery) msgs = msgs.filter(m => (m.text || '').toLowerCase().includes(this.searchQuery));
                return Math.max(1, Math.ceil(msgs.length / CONFIG.PAGE_SIZE));
            }
            return Math.max(1, Math.ceil(this._getFilteredFavoritesForView().length / CONFIG.PAGE_SIZE));
        }

        _renderPagination() {
            const pagination = document.querySelector('.lm-nav-pagination');
            const separator = document.querySelector('.lm-nav-search-separator');
            if (!pagination) return;
            const prevBtn = pagination.querySelector('.lm-nav-page-prev');
            const nextBtn = pagination.querySelector('.lm-nav-page-next');
            const pageInfo = pagination.querySelector('.lm-nav-page-info');
            const settings = Settings.getAll();
            const view = settings.panelView;
            if (!settings.paginatePanel) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (separator) separator.style.display = 'block';
                if (pageInfo) {
                    if (view === 'messages') {
                        const msgs = settings.showAIMessages ? this.messages : this.userMessages;
                        const total = msgs.length;
                        let filtered = this.searchQuery ? msgs.filter(m => (m.text || '').toLowerCase().includes(this.searchQuery)).length : total;
                        pageInfo.textContent = (this.searchQuery && filtered !== total) ? `${filtered}/${total}` : (total > 0 ? `${total} 條` : '無消息');
                    } else { const total = this._getFilteredFavoritesForView().length; pageInfo.textContent = total > 0 ? `${total} 項` : '無收藏'; }
                }
                return;
            }
            const totalPages = this._getTotalPagesForCurrentView();
            this.currentPage = utils.clamp(this.currentPage, 1, totalPages);
            if (separator) separator.style.display = 'block';
            if (totalPages <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (pageInfo) {
                    if (view === 'messages') {
                        let msgs = settings.showAIMessages ? this.messages : this.userMessages;
                        const total = msgs.length;
                        if (this.searchQuery) msgs = msgs.filter(m => (m.text || '').toLowerCase().includes(this.searchQuery));
                        const filtered = msgs.length;
                        pageInfo.textContent = (this.searchQuery && filtered !== total) ? `${filtered}/${total}` : (total > 0 ? `${total} 條` : '無消息');
                    } else { const total = this._getFilteredFavoritesForView().length; pageInfo.textContent = total > 0 ? `${total} 項` : '無收藏'; }
                }
                return;
            }
            if (prevBtn) { prevBtn.style.display = 'flex'; prevBtn.disabled = this.currentPage === 1; }
            if (nextBtn) { nextBtn.style.display = 'flex'; nextBtn.disabled = this.currentPage === totalPages; }
            if (pageInfo) {
                if (view === 'messages') {
                    let msgs = settings.showAIMessages ? this.messages : this.userMessages;
                    const total = msgs.length;
                    if (this.searchQuery) msgs = msgs.filter(m => (m.text || '').toLowerCase().includes(this.searchQuery));
                    const filtered = msgs.length;
                    pageInfo.textContent = (this.searchQuery && filtered !== total) ? `${this.currentPage}/${totalPages} · ${filtered}/${total}` : `${this.currentPage}/${totalPages} · ${total}`;
                } else { const total = this._getFilteredFavoritesForView().length; pageInfo.textContent = `${this.currentPage}/${totalPages} · ${total}`; }
            }
        }

        _goToPage(page) {
            if (!Settings.get('paginatePanel')) return;
            const totalPages = this._getTotalPagesForCurrentView();
            const newPage = (page === 'last') ? totalPages : utils.clamp(page, 1, totalPages);
            if (newPage === this.currentPage) return;
            this.currentPage = newPage;
            if (Settings.get('panelView') === 'messages') this._renderList();
            else this._renderFavorites();
            this._renderPagination();
        }

        async _copyText(text, btn) {
            if (!text) { toast.error('沒有可複製的內容'); return; }
            const success = await utils.copyToClipboard(text);
            if (success) { toast.success('已複製'); if (btn) { btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1200); } }
            else toast.error('複製失敗');
        }

        _insertToInput(text) {
            if (!text) { toast.error('沒有可插入的內容'); return false; }
            const textarea = document.querySelector('textarea[placeholder*="Message"], textarea[placeholder*="message"], textarea');
            if (!textarea) { toast.error('找不到輸入框'); return false; }
            const start = textarea.selectionStart || 0, end = textarea.selectionEnd || 0, value = textarea.value || '';
            textarea.value = value.substring(0, start) + text + value.substring(end);
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            toast.success('已插入');
            return true;
        }

        // ========================================
        // Settings Dialog Content
        // ========================================
        _buildSettingsContent() {
            const settings = Settings.getAll();
            const container = document.createElement('div');
            container.className = 'lm-nav-settings';

            const visibility = this._createSettingSection('顯示', Icons.eye('sm'));
            visibility.appendChild(this._createCheckboxPairRow(
                { label: '顯示浮動鈕', key: 'showFab', value: settings.showFab },
                { label: '自動隱藏浮動鈕', key: 'autoHideFab', value: settings.autoHideFab }
            ));
            visibility.appendChild(this._createCheckboxPairRow(
                { label: '顯示指示條', key: 'showIndicator', value: settings.showIndicator },
                { label: '自動隱藏指示條', key: 'autoHideIndicator', value: settings.autoHideIndicator }
            ));
            visibility.appendChild(this._createCheckboxPairRow(
                { label: '指示條顯示 AI 回覆', key: 'showAIInIndicator', value: settings.showAIInIndicator },
                { label: '導航板顯示 AI 回覆', key: 'showAIMessages', value: settings.showAIMessages }
            ));
            visibility.appendChild(this._createCheckboxPairRow(
                { label: '線條寬度反映訊息長度', key: 'indicatorShowLength', value: settings.indicatorShowLength },
                { label: '標記已收藏的訊息', key: 'indicatorShowFavorites', value: settings.indicatorShowFavorites }
            ));
            container.appendChild(visibility);

            const appearance = this._createSettingSection('外觀', Icons.palette('sm'));
            appearance.appendChild(this._createSelectSetting('字型大小', 'fontSize', FONT_SIZE_OPTIONS.map(o => ({ value: o.value, label: o.label })), settings.fontSize));
            appearance.appendChild(this._createSelectSetting('字型樣式', 'fontFamily', Object.entries(FONT_OPTIONS).map(([key, opt]) => ({ value: key, label: opt.label })), settings.fontFamily));
            appearance.appendChild(this._createSliderSetting('浮動鈕不透明度', 'fabOpacity', 30, 100, settings.fabOpacity, '%'));
            appearance.appendChild(this._createSliderSetting('指示條不透明度', 'indicatorOpacity', 30, 100, settings.indicatorOpacity, '%'));
            appearance.appendChild(this._createSliderSetting('浮動鈕大小', 'fabScale', 60, 140, settings.fabScale, '%'));
            container.appendChild(appearance);

            const behavior = this._createSettingSection('行為', Icons.sliders('sm'));
            behavior.appendChild(this._createCheckboxSetting('懸停指示條時顯示導航板', 'hoverShowPanel', settings.hoverShowPanel));
            behavior.appendChild(this._createCheckboxSetting('啟用動畫效果', 'enableAnimation', settings.enableAnimation));
            behavior.appendChild(this._createCheckboxSetting('啟用分頁', 'paginatePanel', settings.paginatePanel));
            behavior.appendChild(this._createSelectSetting('跳轉位置', 'scrollPosition', [{ value: 'start', label: '訊息開頭' }, { value: 'center', label: '訊息中央' }], settings.scrollPosition));
            container.appendChild(behavior);

            const shortcuts = this._createSettingSection('快捷鍵', Icons.keyboard('sm'));
            const keybindBox = document.createElement('div');
            keybindBox.className = 'lm-nav-keybind-box';
            const hint = document.createElement('div');
            hint.className = 'lm-nav-keybind-hint';
            hint.textContent = '點擊「編輯」後按下新的組合鍵（Esc 取消，Backspace/Delete 清除）';
            keybindBox.appendChild(hint);
            const list = document.createElement('div');
            list.className = 'lm-nav-keybind-list';
            Object.keys(KEYBINDING_LABELS).forEach(action => {
                const row = document.createElement('div');
                row.className = 'lm-nav-keybind-row';
                row.dataset.action = action;
                const desc = document.createElement('span');
                desc.className = 'lm-nav-keybind-desc';
                desc.textContent = KEYBINDING_LABELS[action] || action;
                const key = document.createElement('kbd');
                key.className = 'lm-nav-keybind-key';
                key.textContent = Keybindings.formatBinding(Keybindings.get(action));
                const editBtn = document.createElement('button');
                editBtn.className = 'lm-nav-keybind-btn lm-nav-keybind-edit';
                editBtn.title = '編輯';
                editBtn.appendChild(Icons.edit('sm'));
                editBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this._startKeyCapture(action); });
                const resetBtn = document.createElement('button');
                resetBtn.className = 'lm-nav-keybind-btn lm-nav-keybind-reset';
                resetBtn.title = '恢復預設';
                resetBtn.appendChild(Icons.undo('sm'));
                resetBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); Keybindings.resetAction(action); toast.success('已恢復預設快捷鍵'); this._refreshKeybindingUI(); });
                const right = document.createElement('div');
                right.className = 'lm-nav-keybind-right';
                right.appendChild(key);
                right.appendChild(editBtn);
                right.appendChild(resetBtn);
                row.appendChild(desc);
                row.appendChild(right);
                list.appendChild(row);
            });
            keybindBox.appendChild(list);
            const resetAllKeys = document.createElement('button');
            resetAllKeys.className = 'lm-nav-btn';
            resetAllKeys.textContent = '重置全部快捷鍵';
            resetAllKeys.addEventListener('click', () => { if (confirm('確定要重置全部快捷鍵為預設值嗎？')) { Keybindings.reset(); toast.success('快捷鍵已重置'); this._refreshKeybindingUI(); } });
            keybindBox.appendChild(resetAllKeys);
            shortcuts.appendChild(keybindBox);
            container.appendChild(shortcuts);

            const actions = document.createElement('div');
            actions.className = 'lm-nav-settings-actions';
            const resetPosBtn = document.createElement('button');
            resetPosBtn.className = 'lm-nav-btn';
            resetPosBtn.textContent = '重置位置';
            resetPosBtn.addEventListener('click', () => { this.resetAllPositions(); toast.success('位置已重置'); });
            const resetAllBtn = document.createElement('button');
            resetAllBtn.className = 'lm-nav-btn lm-nav-btn--danger';
            resetAllBtn.textContent = '重置全部';
            resetAllBtn.addEventListener('click', () => {
                if (confirm('確定要重置所有設定嗎？這將清除所有自訂設定（含快捷鍵）。')) {
                    Settings.reset(); Keybindings.reset(); FabPosition.reset(); PanelPosition.reset(); PanelSize.reset(); IndicatorPosition.reset();
                    storage.remove(CONFIG.STORAGE_KEY_ONBOARDING);
                    this.settingsDialog?.close();
                    toast.success('設定已重置，頁面將重新載入');
                    setTimeout(() => location.reload(), 900);
                }
            });
            actions.appendChild(resetPosBtn);
            actions.appendChild(resetAllBtn);
            container.appendChild(actions);
            return container;
        }

        _createSettingSection(title, icon) {
            const section = document.createElement('div');
            section.className = 'lm-nav-setting-section';
            const header = document.createElement('div');
            header.className = 'lm-nav-setting-section-header';
            const iconEl = document.createElement('span');
            iconEl.className = 'lm-nav-setting-section-icon';
            iconEl.appendChild(icon);
            const titleEl = document.createElement('span');
            titleEl.className = 'lm-nav-setting-section-title';
            titleEl.textContent = title;
            header.appendChild(iconEl);
            header.appendChild(titleEl);
            section.appendChild(header);
            return section;
        }

        _createSelectSetting(label, key, options, currentValue) {
            const row = document.createElement('div');
            row.className = 'lm-nav-setting-row';
            const labelEl = document.createElement('label');
            labelEl.className = 'lm-nav-setting-label';
            labelEl.textContent = label;
            const select = document.createElement('select');
            select.className = 'lm-nav-select';
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                option.selected = opt.value == currentValue;
                select.appendChild(option);
            });
            select.addEventListener('change', () => { let value = select.value; if (!isNaN(value) && value !== '') value = parseInt(value); Settings.set(key, value); });
            row.appendChild(labelEl);
            row.appendChild(select);
            return row;
        }

        _createSliderSetting(label, key, min, max, currentValue, unit = '') {
            const row = document.createElement('div');
            row.className = 'lm-nav-setting-row lm-nav-setting-row--slider';
            const labelEl = document.createElement('label');
            labelEl.className = 'lm-nav-setting-label';
            labelEl.textContent = label;
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'lm-nav-slider-container';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'lm-nav-slider';
            slider.min = min;
            slider.max = max;
            slider.value = currentValue;
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'lm-nav-slider-value';
            valueDisplay.textContent = `${currentValue}${unit}`;
            slider.addEventListener('input', () => { const value = parseInt(slider.value); valueDisplay.textContent = `${value}${unit}`; Settings.set(key, value); });
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(valueDisplay);
            row.appendChild(labelEl);
            row.appendChild(sliderContainer);
            return row;
        }

        _createCheckboxSetting(label, key, currentValue) {
            const row = document.createElement('div');
            row.className = 'lm-nav-setting-row lm-nav-setting-row--checkbox';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'lm-nav-checkbox';
            checkbox.id = `lm-nav-setting-${key}`;
            checkbox.checked = !!currentValue;
            checkbox.addEventListener('change', () => Settings.set(key, checkbox.checked));
            const labelEl = document.createElement('label');
            labelEl.className = 'lm-nav-setting-label';
            labelEl.setAttribute('for', checkbox.id);
            labelEl.textContent = label;
            row.appendChild(checkbox);
            row.appendChild(labelEl);
            return row;
        }

        _createCheckboxPairRow(left, right) {
            const row = document.createElement('div');
            row.className = 'lm-nav-setting-row lm-nav-setting-row--pair';
            const cell = (cfg) => {
                const wrap = document.createElement('div');
                wrap.className = 'lm-nav-setting-cell';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'lm-nav-checkbox';
                checkbox.id = `lm-nav-setting-${cfg.key}`;
                checkbox.checked = !!cfg.value;
                checkbox.addEventListener('change', () => Settings.set(cfg.key, checkbox.checked));
                const labelEl = document.createElement('label');
                labelEl.className = 'lm-nav-setting-label';
                labelEl.setAttribute('for', checkbox.id);
                labelEl.textContent = cfg.label;
                wrap.appendChild(checkbox);
                wrap.appendChild(labelEl);
                return wrap;
            };
            row.appendChild(cell(left));
            row.appendChild(cell(right));
            return row;
        }

        _refreshKeybindingUI() {
            const overlay = document.querySelector('.lm-nav-dialog-overlay.lm-nav-settings-dialog');
            if (overlay) {
                overlay.querySelectorAll('.lm-nav-keybind-row').forEach(row => {
                    const action = row.dataset.action;
                    const kbd = row.querySelector('.lm-nav-keybind-key');
                    if (kbd) kbd.textContent = Keybindings.formatBinding(Keybindings.get(action));
                });
            }
            const bindings = Keybindings.getAll();
            document.querySelector('.lm-nav-ai-toggle')?.setAttribute('title', `導航板顯示/隱藏 AI 回覆 (${Keybindings.formatBinding(bindings.toggleAIMessages || DEFAULT_KEYBINDINGS.toggleAIMessages)})`);
            document.querySelector('.lm-nav-view-toggle')?.setAttribute('title', `切換視圖 (${Keybindings.formatBinding(bindings.toggleView || DEFAULT_KEYBINDINGS.toggleView)})`);
            document.querySelector('.lm-nav-sort-btn')?.setAttribute('title', `切換排序 (${Keybindings.formatBinding(bindings.toggleOrder || DEFAULT_KEYBINDINGS.toggleOrder)})`);
            document.querySelector('.lm-nav-load-btn')?.setAttribute('title', `載入更多歷史 (${Keybindings.formatBinding(bindings.loadHistory || DEFAULT_KEYBINDINGS.loadHistory)})`);
            document.querySelector('.lm-nav-manage-btn')?.setAttribute('title', `開關收藏夾 (${Keybindings.formatBinding(bindings.toggleFavManager || DEFAULT_KEYBINDINGS.toggleFavManager)})`);
            document.querySelector('.lm-nav-settings-btn')?.setAttribute('title', `開關設定 (${Keybindings.formatBinding(bindings.toggleSettings || DEFAULT_KEYBINDINGS.toggleSettings)})`);
            this._updatePinButton();
        }

        _startKeyCapture(action) {
            if (!KEYBINDING_LABELS[action]) return;
            if (this._keyCapture.active) this._endKeyCapture(true);
            const label = KEYBINDING_LABELS[action] || action;
            const current = Keybindings.get(action);
            const dlg = new Dialog({ title: `設定快捷鍵：${label}`, width: 440, className: 'lm-nav-keycapture-dialog' });
            const content = document.createElement('div');
            content.className = 'lm-nav-keycapture';
            content.innerHTML = `<div class="lm-nav-keycapture-current"><div class="lm-nav-keycapture-title">目前：</div><kbd class="lm-nav-keycapture-kbd">${Keybindings.formatBinding(current)}</kbd></div><div class="lm-nav-keycapture-tip"><ul><li>請按下新的組合鍵</li><li><kbd>Esc</kbd> 取消</li><li><kbd>Backspace</kbd> / <kbd>Delete</kbd> 清除（核心動作不可清除）</li></ul></div>`;
            dlg.open().setContent(content);
            const row = document.querySelector(`.lm-nav-keybind-row[data-action="${action}"]`);
            if (row) row.classList.add('is-capturing');
            const isCritical = (a) => a === 'togglePanel' || a === 'toggleSettings';
            const handler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                if (e.key === 'Escape') { this._endKeyCapture(true); toast.info('已取消設定快捷鍵'); return; }
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    if (isCritical(action)) { toast.error('核心動作不可清除快捷鍵'); return; }
                    Keybindings.set(action, null);
                    this._endKeyCapture(false);
                    toast.success('快捷鍵已清除');
                    return;
                }
                if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
                const binding = Keybindings.fromEvent(e);
                if (binding.key?.length === 1) binding.key = binding.key.toLowerCase();
                if (isCritical(action) && !binding.alt && !binding.ctrl && !binding.meta) { toast.error('核心快捷鍵建議至少包含 Alt / Ctrl / ⌘'); return; }
                const conflict = Keybindings.findConflict(action, binding);
                if (conflict) {
                    if (isCritical(conflict)) { toast.error(`與核心快捷鍵衝突：${KEYBINDING_LABELS[conflict]}`); return; }
                    if (!confirm(`此快捷鍵已被「${KEYBINDING_LABELS[conflict]}」使用。\n是否將其從該功能移除並改給「${label}」？`)) return;
                    Keybindings.set(conflict, null);
                }
                Keybindings.set(action, binding);
                this._endKeyCapture(false);
                toast.success('快捷鍵已更新');
            };
            document.addEventListener('keydown', handler, true);
            this.keyboard.setEnabled(false);
            this._keyCapture = { active: true, action, dialog: dlg, handler };
            const origClose = dlg.close.bind(dlg);
            dlg.close = () => { origClose(); if (this._keyCapture.active) this._endKeyCapture(true, true); };
        }

        _endKeyCapture(cancelled = false, skipDialogClose = false) {
            if (!this._keyCapture.active) return;
            try { if (this._keyCapture.handler) document.removeEventListener('keydown', this._keyCapture.handler, true); } catch (e) {}
            this.keyboard.setEnabled(true);
            if (this._keyCapture.action) {
                const row = document.querySelector(`.lm-nav-keybind-row[data-action="${this._keyCapture.action}"]`);
                if (row) row.classList.remove('is-capturing');
            }
            if (!skipDialogClose && this._keyCapture.dialog?.isOpen) try { this._keyCapture.dialog.close(); } catch (e) {}
            this._keyCapture = { active: false, action: null, dialog: null, handler: null };
            this._refreshKeybindingUI();
        }

        _syncStarButtons(msgId) {
            const isFav = Favorites.has(msgId);
            document.querySelectorAll(`.lm-nav-star-btn[data-msg-id="${CSS.escape(msgId)}"]`).forEach(btn => {
                btn.innerHTML = '';
                btn.appendChild(isFav ? Icons.starFilled('sm') : Icons.starOutline('sm'));
                btn.classList.toggle('is-favorite', isFav);
                btn.title = isFav ? '取消收藏' : '收藏';
            });
        }

        closeAnyOpenPanel() {
            let closed = false;
            if (this.contextMenu?.isVisible) { this.contextMenu.hide(); closed = true; }
            if (this.settingsDialog?.isOpen || this.isSettingsOpen) { this._closeSettingsDialog?.(); closed = true; }
            if (this.favManagerDialog?.isOpen || this.isFavManagerOpen) { this._closeFavManagerDialog?.(); closed = true; }
            if (this.isPanelOpen) { this._hidePanel(); closed = true; }
            if (this._keyCapture.active) { this._endKeyCapture(true); closed = true; }
            return closed;
        }

        resetAllPositions() {
            FabPosition.reset();
            PanelPosition.reset();
            PanelSize.reset();
            IndicatorPosition.reset();
            const fab = document.getElementById(CONFIG.FAB_ID);
            if (fab) { const pos = FabPosition.load(); fab.style.bottom = `${pos.bottom}px`; fab.style.right = `${pos.right}px`; }
            this._applyIndicatorPosition();
            this._applyPanelSize();
            if (this.isPanelOpen) this._positionPanel(null, false);
        }

        _injectStyles() {
            const inject = () => { const ok = addStyle(this._getStyles()); if (!ok) setTimeout(() => addStyle(this._getStyles()), 500); };
            if (document.head) inject();
            else {
                const observer = new MutationObserver(() => { if (document.head) { observer.disconnect(); inject(); } });
                observer.observe(document.documentElement, { childList: true });
            }
        }

        _getStyles() {
            return `
#${CONFIG.CONTAINER_ID}{--lm-nav-font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--lm-nav-font-size:13px;--lm-nav-font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--lm-nav-radius-sm:6px;--lm-nav-radius-md:10px;--lm-nav-radius-lg:14px;--lm-nav-radius-full:9999px;--lm-nav-shadow-sm:0 2px 8px rgba(0,0,0,0.08);--lm-nav-shadow-md:0 4px 20px rgba(0,0,0,0.12);--lm-nav-shadow-lg:0 8px 40px rgba(0,0,0,0.18);--lm-nav-ease:cubic-bezier(0.16,1,0.3,1);--lm-nav-duration:0.2s;--lm-nav-fab-opacity:0.9;--lm-nav-fab-scale:1;--lm-nav-indicator-opacity:0.8;font-family:var(--lm-nav-font-family);font-size:var(--lm-nav-font-size);line-height:1.5;-webkit-font-smoothing:antialiased}
#${CONFIG.CONTAINER_ID}[data-theme="light"]{--lm-nav-bg:#ffffff;--lm-nav-bg-secondary:#f8fafc;--lm-nav-bg-hover:rgba(0,0,0,0.04);--lm-nav-bg-active:#dbeafe;--lm-nav-border:#e2e8f0;--lm-nav-border-light:#f1f5f9;--lm-nav-text:#1e293b;--lm-nav-text-secondary:#64748b;--lm-nav-text-tertiary:#94a3b8;--lm-nav-accent:#3b82f6;--lm-nav-accent-hover:#2563eb;--lm-nav-success:#22c55e;--lm-nav-warning:#f59e0b;--lm-nav-error:#ef4444;--lm-nav-fab-bg:linear-gradient(135deg,#3b82f6,#2563eb);--lm-nav-fab-shadow:0 4px 14px rgba(59,130,246,0.4);--lm-nav-ai-a:#94a3b8;--lm-nav-ai-b:#c4b5fd}
#${CONFIG.CONTAINER_ID}[data-theme="dark"]{--lm-nav-bg:#1e293b;--lm-nav-bg-secondary:#334155;--lm-nav-bg-hover:rgba(255,255,255,0.06);--lm-nav-bg-active:rgba(59,130,246,0.25);--lm-nav-border:#475569;--lm-nav-border-light:#334155;--lm-nav-text:#f1f5f9;--lm-nav-text-secondary:#94a3b8;--lm-nav-text-tertiary:#64748b;--lm-nav-accent:#60a5fa;--lm-nav-accent-hover:#3b82f6;--lm-nav-success:#4ade80;--lm-nav-warning:#fbbf24;--lm-nav-error:#f87171;--lm-nav-fab-bg:linear-gradient(135deg,#3b82f6,#1d4ed8);--lm-nav-fab-shadow:0 4px 14px rgba(59,130,246,0.3);--lm-nav-ai-a:#a1a1aa;--lm-nav-ai-b:#a5b4fc}
#${CONFIG.CONTAINER_ID}{position:fixed;inset:0;pointer-events:none;z-index:${CONFIG.Z_INDEX.INDICATOR}}
#${CONFIG.CONTAINER_ID} *{box-sizing:border-box}
#${CONFIG.CONTAINER_ID} .lm-nav-fab,#${CONFIG.CONTAINER_ID} .lm-nav-indicator,#${CONFIG.CONTAINER_ID} .lm-nav-panel,#${CONFIG.CONTAINER_ID} .lm-nav-context-menu,#${CONFIG.CONTAINER_ID} .lm-nav-dialog-overlay{pointer-events:auto}
#${CONFIG.CONTAINER_ID}[data-show-fab="false"] .lm-nav-fab{display:none!important}
#${CONFIG.CONTAINER_ID}[data-show-indicator="false"] .lm-nav-indicator{display:none!important}
#${CONFIG.CONTAINER_ID}[data-auto-hide-fab="true"] .lm-nav-fab{opacity:0;pointer-events:none;transition:opacity 0.3s var(--lm-nav-ease)}
#${CONFIG.CONTAINER_ID}[data-auto-hide-fab="true"].lm-nav-fab--near .lm-nav-fab{opacity:var(--lm-nav-fab-opacity);pointer-events:auto}
#${CONFIG.CONTAINER_ID}[data-auto-hide-indicator="true"] .lm-nav-indicator{opacity:0;pointer-events:none;transition:opacity 0.3s var(--lm-nav-ease)}
#${CONFIG.CONTAINER_ID}[data-auto-hide-indicator="true"].lm-nav-indicator--near .lm-nav-indicator{opacity:var(--lm-nav-indicator-opacity);pointer-events:auto}
.lm-nav-fab{position:fixed;z-index:${CONFIG.Z_INDEX.FAB};width:52px;height:52px;border:none;border-radius:var(--lm-nav-radius-full)!important;background:var(--lm-nav-fab-bg)!important;box-shadow:var(--lm-nav-fab-shadow);color:#fff;cursor:grab;display:flex;align-items:center;justify-content:center;opacity:var(--lm-nav-fab-opacity);transform:scale(var(--lm-nav-fab-scale));transition:box-shadow var(--lm-nav-duration),transform var(--lm-nav-duration)}
.lm-nav-fab:hover{box-shadow:var(--lm-nav-fab-shadow),0 0 0 4px rgba(59,130,246,0.2)}
.lm-nav-fab:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:2px}
.lm-nav-fab--dragging{cursor:grabbing;transform:scale(calc(var(--lm-nav-fab-scale)*1.05))}
.lm-nav-fab svg{width:24px;height:24px}
.lm-nav-indicator{position:fixed;z-index:${CONFIG.Z_INDEX.INDICATOR};padding:12px 8px;max-height:70vh;overflow:visible;opacity:var(--lm-nav-indicator-opacity);cursor:grab;transition:opacity var(--lm-nav-duration),background var(--lm-nav-duration);border-radius:var(--lm-nav-radius-md);background:transparent;width:48px}
.lm-nav-indicator:hover{opacity:1;background:var(--lm-nav-bg-hover)}
.lm-nav-indicator--dragging{cursor:grabbing;opacity:1}
.lm-nav-indicator-wrapper{--lm-line-h:3px;--lm-line-gap:3px;display:flex;flex-direction:column;gap:var(--lm-line-gap);padding:4px 0;max-height:calc(70vh - 24px);overflow-y:auto;overflow-x:visible;scrollbar-width:none;-ms-overflow-style:none;width:32px}
.lm-nav-indicator-wrapper::-webkit-scrollbar{display:none}
.lm-nav-indicator[data-edge="right"] .lm-nav-indicator-wrapper{align-items:flex-end}
.lm-nav-indicator[data-edge="left"] .lm-nav-indicator-wrapper{align-items:flex-start}
.lm-nav-line{position:relative;height:var(--lm-line-h,3px);min-height:2px;border-radius:2px;cursor:pointer;opacity:0.65;flex-shrink:0;transform-origin:center center;will-change:transform;transition:transform 0.085s cubic-bezier(0.22,1,0.36,1),opacity 0.15s ease-out,box-shadow 0.2s ease-out}
.lm-nav-line:not(.lm-nav-line--bottom)[data-is-favorite="true"]::after{content:'';position:absolute;top:50%;width:5px;height:5px;border-radius:999px;background:var(--lm-nav-warning);transform:translateY(-50%);opacity:0.98;box-shadow:0 0 0 1px rgba(255,255,255,0.22),0 0 10px rgba(245,158,11,0.85),0 0 18px rgba(245,158,11,0.35)}
.lm-nav-indicator[data-edge="right"] .lm-nav-line:not(.lm-nav-line--bottom)[data-is-favorite="true"]::after{right:2px}
.lm-nav-indicator[data-edge="left"] .lm-nav-line:not(.lm-nav-line--bottom)[data-is-favorite="true"]::after{left:2px}
.lm-nav-line::before{content:'';position:absolute;top:-5px;bottom:-5px;left:-6px;right:-6px}
.lm-nav-line--user{width:20px;background:var(--lm-nav-accent)}
.lm-nav-line--ai{width:12px;background:var(--lm-nav-text-tertiary);margin-left:10px}
.lm-nav-line--ai-a{background:var(--lm-nav-ai-a)}
.lm-nav-line--ai-b{background:var(--lm-nav-ai-b)}
.lm-nav-indicator[data-edge="left"] .lm-nav-line--ai{margin-left:0;margin-right:10px}
.lm-nav-line--user[data-msg-length="short"]{width:12px}
.lm-nav-line--user[data-msg-length="medium"]{width:18px}
.lm-nav-line--user[data-msg-length="long"]{width:24px}
.lm-nav-line--user[data-msg-length="very-long"]{width:30px}
.lm-nav-line--ai[data-msg-length="short"]{width:8px}
.lm-nav-line--ai[data-msg-length="medium"]{width:12px}
.lm-nav-line--ai[data-msg-length="long"]{width:16px}
.lm-nav-line--ai[data-msg-length="very-long"]{width:20px}
.lm-nav-line--viewing{opacity:1;box-shadow:0 0 6px var(--lm-nav-accent)}
.lm-nav-line--current{opacity:1;background:var(--lm-nav-accent);box-shadow:0 0 8px var(--lm-nav-accent)}
.lm-nav-line:hover{opacity:1}
.lm-nav-indicator-wrapper:not(.lm-nav-fisheye-active) .lm-nav-line:hover{box-shadow:0 0 4px var(--lm-nav-accent)}
.lm-nav-indicator-wrapper.lm-nav-fisheye-active .lm-nav-line{transition:transform 0.06s cubic-bezier(0.22,1,0.36,1)}
.lm-nav-line--bottom{position:sticky;bottom:0;width:18px;height:var(--lm-line-h,3px);min-height:2px;background:color-mix(in srgb,var(--lm-nav-success) 80%,transparent);backdrop-filter:blur(6px);border-radius:2px;margin-top:10px;opacity:0.5}
.lm-nav-line--bottom:hover{opacity:1;box-shadow:0 0 6px var(--lm-nav-success)}
.lm-nav-panel{position:fixed;z-index:${CONFIG.Z_INDEX.PANEL};width:360px;max-height:420px;min-width:280px;min-height:250px;background:var(--lm-nav-bg);border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-lg);box-shadow:var(--lm-nav-shadow-lg);display:flex;flex-direction:column;overflow:hidden;opacity:0;visibility:hidden;transform:scale(0.95) translateY(8px);transition:opacity var(--lm-nav-duration),visibility var(--lm-nav-duration),transform 0.25s var(--lm-nav-ease)}
.lm-nav-panel--open{opacity:1;visibility:visible;transform:scale(1) translateY(0)}
.lm-nav-panel--dragging{transition:none;cursor:grabbing;box-shadow:var(--lm-nav-shadow-lg),0 0 0 2px var(--lm-nav-accent)}
.lm-nav-panel--resizing{transition:none}
.lm-nav-panel--pinned .lm-nav-pin-btn{color:var(--lm-nav-accent);background:rgba(59,130,246,0.1)}
.lm-nav-panel--pinned .lm-nav-pin-btn:hover{background:rgba(59,130,246,0.2)}
.lm-nav-header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid var(--lm-nav-border-light);cursor:grab;flex-shrink:0}
.lm-nav-panel--dragging .lm-nav-header{cursor:grabbing}
.lm-nav-header-left{display:flex;align-items:center;gap:6px}
.lm-nav-header-right{display:flex;align-items:center;gap:1px}
.lm-nav-view-toggle{display:flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-sm);background:var(--lm-nav-bg);color:var(--lm-nav-text);font-size:12px;font-weight:600;cursor:pointer;transition:all var(--lm-nav-duration)}
.lm-nav-view-toggle:hover{background:var(--lm-nav-bg-hover);border-color:var(--lm-nav-accent)}
.lm-nav-view-toggle:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:1px}
.lm-nav-view-icon{display:flex}
.lm-nav-view-icon svg{width:14px;height:14px}
.lm-nav-view-arrow{display:flex;opacity:0.85}
.lm-nav-view-arrow svg{width:12px;height:12px}
.lm-nav-fav-badge{min-width:14px;height:14px;padding:0 4px;background:var(--lm-nav-accent);color:#fff;font-size:10px;font-weight:700;border-radius:var(--lm-nav-radius-full);display:none;align-items:center;justify-content:center}
.lm-nav-action-btn{width:26px;height:26px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--lm-nav-duration)}
.lm-nav-action-btn:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-action-btn:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:1px}
.lm-nav-action-btn svg{width:14px;height:14px}
.lm-nav-search{display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid var(--lm-nav-border-light);flex-shrink:0}
.lm-nav-search-icon{color:var(--lm-nav-text-tertiary);display:flex;flex-shrink:0}
.lm-nav-search-input{flex:1;min-width:90px;border:none;background:transparent;color:var(--lm-nav-text);font-size:calc(var(--lm-nav-font-size) - 1px);outline:none}
.lm-nav-search-input::placeholder{color:var(--lm-nav-text-tertiary)}
.lm-nav-search-clear{width:16px;height:16px;border:none;border-radius:var(--lm-nav-radius-full);background:var(--lm-nav-bg-secondary);color:var(--lm-nav-text-secondary);cursor:pointer;display:none;align-items:center;justify-content:center;flex-shrink:0}
.lm-nav-search-clear:hover{background:var(--lm-nav-border)}
.lm-nav-search-separator{width:1px;height:16px;background:var(--lm-nav-border);margin:0 4px;flex-shrink:0}
.lm-nav-pagination{display:flex;align-items:center;gap:2px;flex-shrink:0}
.lm-nav-page-btn{width:20px;height:20px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--lm-nav-duration)}
.lm-nav-page-btn:hover:not(:disabled){background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-page-btn:disabled{opacity:0.3;cursor:not-allowed}
.lm-nav-page-btn:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:1px}
.lm-nav-page-btn svg{width:12px;height:12px}
.lm-nav-page-info{font-size:11px;color:var(--lm-nav-text-tertiary);font-variant-numeric:tabular-nums;min-width:44px;text-align:center;white-space:nowrap}
.lm-nav-ai-toggle{width:22px;height:22px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--lm-nav-duration);flex-shrink:0;margin-left:4px}
.lm-nav-ai-toggle:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-ai-toggle--active{color:var(--lm-nav-accent);background:rgba(59,130,246,0.1)}
.lm-nav-ai-toggle:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:1px}
.lm-nav-ai-toggle svg{width:14px;height:14px}
.lm-nav-content{flex:1;overflow:hidden;position:relative;min-height:0;display:flex;flex-direction:column}
.lm-nav-list,.lm-nav-favorites-list{list-style:none;margin:0;padding:4px;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden}
.lm-nav-panel[data-view="messages"] .lm-nav-favorites-list,.lm-nav-panel[data-view="favorites"] .lm-nav-list{display:none}
.lm-nav-panel[data-view="messages"] .lm-nav-list,.lm-nav-panel[data-view="favorites"] .lm-nav-favorites-list{display:block}
.lm-nav-item{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:var(--lm-nav-radius-sm);cursor:pointer;transition:background var(--lm-nav-duration)}
.lm-nav-item:hover{background:var(--lm-nav-bg-hover)}
.lm-nav-item--viewing{background:var(--lm-nav-bg-active)}
.lm-nav-item--ai{opacity:0.75}
.lm-nav-item-num{font-size:10px;font-weight:700;color:var(--lm-nav-text-tertiary);min-width:18px}
.lm-nav-item-icon{color:var(--lm-nav-text-tertiary);display:flex}
.lm-nav-item-icon svg{width:12px;height:12px}
.lm-nav-item-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--lm-nav-text-secondary);font-size:calc(var(--lm-nav-font-size) - 1px)}
.lm-nav-item:hover .lm-nav-item-text,.lm-nav-item--viewing .lm-nav-item-text{color:var(--lm-nav-text)}
.lm-nav-item-time{font-size:10px;color:var(--lm-nav-text-tertiary);flex-shrink:0}
.lm-nav-item-actions{display:flex;gap:1px;opacity:0;transition:opacity var(--lm-nav-duration)}
.lm-nav-item:hover .lm-nav-item-actions{opacity:1}
.lm-nav-fav-item--orphan{opacity:0.6}
.lm-nav-fav-item--orphan .lm-nav-item-num{color:var(--lm-nav-warning)}
.lm-nav-fav-item--orphan:hover{background:var(--lm-nav-bg-hover);cursor:default}
.lm-nav-icon-btn{width:22px;height:22px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--lm-nav-duration)}
.lm-nav-icon-btn:hover{background:var(--lm-nav-bg-secondary);color:var(--lm-nav-text)}
.lm-nav-icon-btn:focus-visible{outline:2px solid var(--lm-nav-accent);outline-offset:1px}
.lm-nav-icon-btn svg{width:12px;height:12px}
.lm-nav-star-btn.is-favorite{color:var(--lm-nav-warning)}
.lm-nav-icon-btn.copied{color:var(--lm-nav-success)}
.lm-nav-icon-btn--danger:hover{color:var(--lm-nav-error);background:rgba(239,68,68,0.1)}
.lm-nav-empty-state{display:none;flex-direction:column;align-items:center;justify-content:center;padding:30px 16px;text-align:center;color:var(--lm-nav-text-secondary);position:absolute;inset:0;background:var(--lm-nav-bg);z-index:1}
.lm-nav-empty-icon{color:var(--lm-nav-text-tertiary);margin-bottom:8px}
.lm-nav-empty-state p{margin:0 0 2px;font-size:var(--lm-nav-font-size)}
.lm-nav-empty-hint{font-size:12px;color:var(--lm-nav-text-tertiary)}
.lm-nav-resize-handle{position:absolute;z-index:10}
.lm-nav-resize-se{right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(-45deg,transparent 30%,var(--lm-nav-border) 30%,var(--lm-nav-border) 40%,transparent 40%,transparent 60%,var(--lm-nav-border) 60%,var(--lm-nav-border) 70%,transparent 70%);opacity:0;transition:opacity var(--lm-nav-duration);border-radius:0 0 var(--lm-nav-radius-lg) 0}
.lm-nav-panel:hover .lm-nav-resize-se{opacity:0.5}
.lm-nav-resize-se:hover{opacity:1!important}
.lm-nav-highlight{background:var(--lm-nav-warning);color:#000;padding:0 2px;border-radius:2px}
.lm-nav-context-menu{position:fixed;z-index:${CONFIG.Z_INDEX.MENU};min-width:180px;padding:6px;background:var(--lm-nav-bg,#ffffff);border:1px solid var(--lm-nav-border,#e2e8f0);border-radius:var(--lm-nav-radius-md,10px);box-shadow:var(--lm-nav-shadow-lg);display:none;pointer-events:auto;font-size:var(--lm-nav-font-size)}
.lm-nav-context-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--lm-nav-radius-sm,6px);color:var(--lm-nav-text,#1e293b);cursor:pointer;outline:none;transition:background 0.1s}
.lm-nav-context-item:hover,.lm-nav-context-item:focus{background:var(--lm-nav-bg-hover,rgba(0,0,0,0.04))}
.lm-nav-context-item--disabled{opacity:0.5;cursor:not-allowed}
.lm-nav-context-icon{width:16px;display:flex;justify-content:center;color:var(--lm-nav-text-tertiary,#94a3b8)}
.lm-nav-context-label{flex:1}
.lm-nav-context-shortcut{font-size:11px;font-family:var(--lm-nav-font-mono);color:var(--lm-nav-text-tertiary,#94a3b8)}
.lm-nav-context-separator{height:1px;margin:4px 8px;background:var(--lm-nav-border-light,#f1f5f9)}
.lm-nav-toast-container{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;font-size:var(--lm-nav-font-size)}
.lm-nav-toast{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--lm-nav-bg,#ffffff);border:1px solid var(--lm-nav-border,#e2e8f0);border-radius:var(--lm-nav-radius-md,10px);box-shadow:var(--lm-nav-shadow-lg);color:var(--lm-nav-text,#1e293b);font-size:var(--lm-nav-font-size);pointer-events:auto;opacity:0;transform:translateY(10px);transition:opacity 0.2s,transform 0.25s var(--lm-nav-ease,ease)}
.lm-nav-toast--visible{opacity:1;transform:translateY(0)}
.lm-nav-toast-icon{display:flex}
.lm-nav-toast--success .lm-nav-toast-icon{color:var(--lm-nav-success)}
.lm-nav-toast--error .lm-nav-toast-icon{color:var(--lm-nav-error)}
.lm-nav-toast--info .lm-nav-toast-icon{color:var(--lm-nav-accent)}
.lm-nav-toast--warning .lm-nav-toast-icon{color:var(--lm-nav-warning)}
.lm-nav-toast-action{margin-left:8px;padding:4px 10px;border:none;border-radius:var(--lm-nav-radius-sm,6px);background:var(--lm-nav-accent);color:#fff;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.15s}
.lm-nav-toast-action:hover{background:var(--lm-nav-accent-hover)}
.lm-nav-dialog-overlay{position:fixed;inset:0;z-index:${CONFIG.Z_INDEX.DIALOG};background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.2s;pointer-events:auto;font-size:var(--lm-nav-font-size)}
.lm-nav-dialog--visible{opacity:1}
.lm-nav-dialog{width:100%;max-height:calc(100vh - 40px);background:var(--lm-nav-bg,#ffffff);border-radius:var(--lm-nav-radius-lg,14px);box-shadow:var(--lm-nav-shadow-lg);display:flex;flex-direction:column;overflow:hidden;transform:scale(0.95);transition:transform 0.25s var(--lm-nav-ease,ease)}
.lm-nav-dialog--visible .lm-nav-dialog{transform:scale(1)}
.lm-nav-dialog-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--lm-nav-border-light,#f1f5f9)}
.lm-nav-dialog-title{font-size:16px;font-weight:700;color:var(--lm-nav-text,#1e293b);margin:0}
.lm-nav-dialog-close{width:30px;height:30px;border:none;border-radius:var(--lm-nav-radius-sm,6px);background:transparent;color:var(--lm-nav-text-tertiary,#94a3b8);cursor:pointer;display:flex;align-items:center;justify-content:center}
.lm-nav-dialog-close:hover{background:var(--lm-nav-bg-hover,rgba(0,0,0,0.04));color:var(--lm-nav-text,#1e293b)}
.lm-nav-dialog-content{flex:1;overflow-y:auto;padding:16px 20px}
.lm-nav-settings{display:flex;flex-direction:column;gap:18px}
.lm-nav-setting-section{display:flex;flex-direction:column;gap:12px}
.lm-nav-setting-section-header{display:flex;align-items:center;gap:8px;padding-bottom:8px;border-bottom:1px solid var(--lm-nav-border-light)}
.lm-nav-setting-section-icon{color:var(--lm-nav-text-tertiary);display:flex}
.lm-nav-setting-section-title{font-size:12px;font-weight:800;color:var(--lm-nav-text-secondary);text-transform:uppercase;letter-spacing:0.5px}
.lm-nav-setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.lm-nav-setting-row--slider{flex-direction:column;align-items:stretch}
.lm-nav-setting-row--checkbox{justify-content:flex-start}
.lm-nav-setting-row--pair{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lm-nav-setting-cell{display:flex;align-items:center;gap:8px;min-height:28px}
.lm-nav-setting-label{font-size:var(--lm-nav-font-size);color:var(--lm-nav-text);cursor:pointer}
.lm-nav-setting-row--slider .lm-nav-setting-label{margin-bottom:4px}
.lm-nav-select{padding:6px 10px;border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-sm);background:var(--lm-nav-bg);color:var(--lm-nav-text);font-size:var(--lm-nav-font-size);cursor:pointer}
.lm-nav-select:focus{outline:none;border-color:var(--lm-nav-accent)}
.lm-nav-slider-container{display:flex;align-items:center;gap:12px}
.lm-nav-slider{flex:1;height:4px;-webkit-appearance:none;background:var(--lm-nav-border);border-radius:2px;cursor:pointer}
.lm-nav-slider::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;background:var(--lm-nav-accent);border-radius:50%;cursor:pointer}
.lm-nav-slider-value{min-width:44px;text-align:right;font-size:12px;color:var(--lm-nav-text-secondary);font-variant-numeric:tabular-nums}
.lm-nav-checkbox{width:16px;height:16px;accent-color:var(--lm-nav-accent);cursor:pointer}
.lm-nav-settings-actions{display:flex;gap:10px;padding-top:16px;border-top:1px solid var(--lm-nav-border-light);margin-top:8px}
.lm-nav-btn{flex:1;padding:10px 16px;border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-sm);background:var(--lm-nav-bg);color:var(--lm-nav-text-secondary);font-size:var(--lm-nav-font-size);font-weight:600;cursor:pointer;transition:all var(--lm-nav-duration)}
.lm-nav-btn:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-btn--danger:hover{background:var(--lm-nav-error);border-color:var(--lm-nav-error);color:#fff}
.lm-nav-keybind-box{display:flex;flex-direction:column;gap:10px}
.lm-nav-keybind-hint{font-size:12px;color:var(--lm-nav-text-secondary)}
.lm-nav-keybind-list{display:flex;flex-direction:column;gap:6px}
.lm-nav-keybind-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid var(--lm-nav-border-light);border-radius:var(--lm-nav-radius-md);background:var(--lm-nav-bg)}
.lm-nav-keybind-row.is-capturing{border-color:var(--lm-nav-accent);box-shadow:0 0 0 2px rgba(59,130,246,0.18)}
.lm-nav-keybind-desc{font-size:var(--lm-nav-font-size);color:var(--lm-nav-text)}
.lm-nav-keybind-right{display:flex;align-items:center;gap:6px}
.lm-nav-keybind-key{font-family:var(--lm-nav-font-mono);font-size:11px;padding:2px 6px;background:var(--lm-nav-bg-secondary);border:1px solid var(--lm-nav-border);border-radius:6px;color:var(--lm-nav-text-secondary);min-width:92px;text-align:center}
.lm-nav-keybind-btn{width:28px;height:28px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--lm-nav-duration)}
.lm-nav-keybind-btn:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-keybind-btn svg{width:14px;height:14px}
.lm-nav-keycapture{text-align:center;padding:20px 0}
.lm-nav-keycapture-current{margin-bottom:20px}
.lm-nav-keycapture-title{font-size:14px;color:var(--lm-nav-text-secondary);margin-bottom:8px}
.lm-nav-keycapture-kbd{display:inline-block;font-family:var(--lm-nav-font-mono);font-size:16px;padding:8px 16px;background:var(--lm-nav-bg-secondary);border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-md);color:var(--lm-nav-text)}
.lm-nav-keycapture-tip{font-size:13px;color:var(--lm-nav-text-secondary)}
.lm-nav-keycapture-tip ul{list-style:none;padding:0;margin:0}
.lm-nav-keycapture-tip li{margin:6px 0}
.lm-nav-keycapture-tip kbd{font-family:var(--lm-nav-font-mono);font-size:11px;padding:2px 6px;background:var(--lm-nav-bg-secondary);border:1px solid var(--lm-nav-border);border-radius:4px}
.lm-nav-fav-manager{min-height:220px;font-size:var(--lm-nav-font-size)}
.lm-nav-fav-manager-search{display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-md);background:var(--lm-nav-bg-secondary);margin-bottom:10px}
.lm-nav-fav-manager-search-input{flex:1;border:none;background:transparent;color:var(--lm-nav-text);font-size:var(--lm-nav-font-size);outline:none}
.lm-nav-fav-manager-search-input::placeholder{color:var(--lm-nav-text-tertiary)}
.lm-nav-fav-manager-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 2px 12px;border-bottom:1px solid var(--lm-nav-border-light);margin-bottom:12px}
.lm-nav-fav-manager-toolbar-left{display:flex;align-items:center;gap:10px}
.lm-nav-fav-manager-toolbar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.lm-nav-fav-manager-selection-info{color:var(--lm-nav-text-secondary);font-size:12px;min-height:18px}
.lm-nav-btn-sm{padding:7px 10px;border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-sm);background:var(--lm-nav-bg);color:var(--lm-nav-text-secondary);font-size:12px;font-weight:700;cursor:pointer;transition:all var(--lm-nav-duration);display:inline-flex;align-items:center;gap:6px}
.lm-nav-btn-sm:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-btn-sm--danger{border-color:rgba(239,68,68,0.35)}
.lm-nav-btn-sm--danger:hover{background:rgba(239,68,68,0.12);color:var(--lm-nav-error);border-color:rgba(239,68,68,0.6)}
.lm-nav-btn-xs{padding:4px 8px;border:1px solid var(--lm-nav-border);border-radius:8px;background:var(--lm-nav-bg);color:var(--lm-nav-text-secondary);font-size:11px;font-weight:700;cursor:pointer;transition:all var(--lm-nav-duration)}
.lm-nav-btn-xs:hover{background:var(--lm-nav-bg-hover);color:var(--lm-nav-text)}
.lm-nav-btn-xs--danger{border-color:rgba(239,68,68,0.35)}
.lm-nav-btn-xs--danger:hover{background:rgba(239,68,68,0.12);color:var(--lm-nav-error);border-color:rgba(239,68,68,0.6)}
.lm-nav-fav-manager-list{padding-top:12px}
.lm-nav-fav-section{margin-bottom:18px}
.lm-nav-fav-section-header{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;font-weight:800;color:var(--lm-nav-text-secondary);padding-bottom:8px;border-bottom:1px solid var(--lm-nav-border-light);margin-bottom:8px}
.lm-nav-fav-section-list{list-style:none;margin:0;padding:0}
.lm-nav-fav-manager-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--lm-nav-radius-md);transition:all 0.2s}
.lm-nav-fav-manager-item:hover{background:var(--lm-nav-bg-hover)}
.lm-nav-fav-manager-item.is-selected{background:var(--lm-nav-bg-active)}
.lm-nav-fav-manager-checkbox{width:28px;height:28px;border:none;border-radius:var(--lm-nav-radius-sm);background:transparent;color:var(--lm-nav-text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center}
.lm-nav-fav-manager-checkbox:hover{background:var(--lm-nav-bg-secondary);color:var(--lm-nav-text)}
.lm-nav-fav-manager-checkbox svg{width:16px;height:16px}
.lm-nav-fav-manager-icon{color:var(--lm-nav-text-tertiary);display:flex;align-items:center;flex-shrink:0}
.lm-nav-fav-manager-icon svg{width:14px;height:14px}
.lm-nav-fav-manager-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--lm-nav-text);font-size:var(--lm-nav-font-size)}
.lm-nav-fav-manager-time{font-size:12px;color:var(--lm-nav-text-tertiary);white-space:nowrap}
.lm-nav-fav-manager-actions{display:flex;gap:4px;opacity:0;transition:opacity 0.2s}
.lm-nav-fav-manager-item:hover .lm-nav-fav-manager-actions{opacity:1}
.lm-nav-fav-manager-item--pending{opacity:0.78;background:var(--lm-nav-bg-hover)}
.lm-nav-fav-manager-item--pending .lm-nav-fav-manager-actions{opacity:1}
.lm-nav-fav-undo-btn{color:var(--lm-nav-warning)}
.lm-nav-fav-undo-btn:hover{background:rgba(245,158,11,0.15)}
.lm-nav-onboarding{position:fixed;z-index:${CONFIG.Z_INDEX.TOAST};opacity:0;transform:translateX(8px);transition:all 0.3s var(--lm-nav-ease);font-size:var(--lm-nav-font-size)}
.lm-nav-onboarding--visible{opacity:1;transform:translateX(0)}
.lm-nav-onboarding--hiding{opacity:0;transform:translateX(8px)}
.lm-nav-onboarding-content{width:280px;padding:16px;background:var(--lm-nav-bg);border:1px solid var(--lm-nav-border);border-radius:var(--lm-nav-radius-lg);box-shadow:var(--lm-nav-shadow-lg)}
.lm-nav-onboarding-header{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.lm-nav-onboarding-icon{font-size:20px}
.lm-nav-onboarding-title{font-size:15px;font-weight:700;color:var(--lm-nav-text)}
.lm-nav-onboarding-list{margin:0 0 16px;padding-left:20px;font-size:var(--lm-nav-font-size);color:var(--lm-nav-text-secondary);line-height:1.8}
.lm-nav-onboarding-close{width:100%;padding:10px;border:none;border-radius:var(--lm-nav-radius-sm);background:var(--lm-nav-accent);color:#fff;font-size:var(--lm-nav-font-size);font-weight:700;cursor:pointer;transition:background var(--lm-nav-duration)}
.lm-nav-onboarding-close:hover{background:var(--lm-nav-accent-hover)}
@keyframes lm-nav-jiggle{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
.${CONFIG.JIGGLE_CLASS}{animation:lm-nav-jiggle ${CONFIG.JIGGLE_DURATION}ms ease-in-out;outline:2px solid var(--lm-nav-accent)!important;outline-offset:3px!important}
.lm-nav-list::-webkit-scrollbar,.lm-nav-favorites-list::-webkit-scrollbar,.lm-nav-dialog-content::-webkit-scrollbar,.lm-nav-fav-manager::-webkit-scrollbar{width:6px}
.lm-nav-list::-webkit-scrollbar-thumb,.lm-nav-favorites-list::-webkit-scrollbar-thumb,.lm-nav-dialog-content::-webkit-scrollbar-thumb,.lm-nav-fav-manager::-webkit-scrollbar-thumb{background:var(--lm-nav-border);border-radius:3px}
.lm-nav-list::-webkit-scrollbar-thumb:hover,.lm-nav-favorites-list::-webkit-scrollbar-thumb:hover{background:var(--lm-nav-text-tertiary)}
@media (max-width:480px){.lm-nav-panel{width:calc(100vw - 24px);max-width:${CONFIG.PANEL_WIDTH}px}.lm-nav-dialog{margin:12px}.lm-nav-setting-row--pair{grid-template-columns:1fr}.lm-nav-indicator{width:42px}}
@media (prefers-reduced-motion:reduce){.lm-nav-fab,.lm-nav-indicator,.lm-nav-panel,.lm-nav-toast,.lm-nav-dialog,.lm-nav-onboarding,.lm-nav-item,.lm-nav-line{transition-duration:0.01ms!important}.${CONFIG.JIGGLE_CLASS}{animation:none!important}.lm-nav-line--viewing{animation:none!important}}
            `;
        }
    }

    // ========================================
    // Initialization
    // ========================================
    const app = new ChatNavigator();
    app.init();

})();