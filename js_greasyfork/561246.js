// ==UserScript==
// @name         LabTrack Controller (Torn PDA)
// @namespace    http://tampermonkey.net/
// @version      7.15-PDA
// @description  Torn PDA optimized version - Labouchere strategy tracker for Torn.com Roulette with touch-friendly controls
// @author       Nimo313 (Enhanced by Claude AI)
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @license      MIT
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/561246/LabTrack%20Controller%20%28Torn%20PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561246/LabTrack%20Controller%20%28Torn%20PDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.LabTrackRunning) return;
    window.LabTrackRunning = true;

    // =============================================================================
    // CONFIGURATION CONSTANTS - V7.15-PDA
    // =============================================================================
    const CONFIG = Object.freeze({
        VERSION: '7.15-PDA',
        IS_PDA: true, // Force PDA mode for this version
        RACE_LOCK_MS: 3000,
        DOM_DELAY_MS: 100,                // Increased for PDA
        POLL_MS: 750,                     // Increased for PDA
        HOSPITAL_LOCK_MS: 2500,
        TOAST_MS: 2000,
        MANUAL_BET_TIMEOUT_MS: 30000,
        STORAGE_SAVE: 'lt_standalone_save',
        STORAGE_SETTINGS: 'lt_settings',
        MAX_HISTORY: 50,
        MAX_UNDO_STACK: 50,
        MAX_STORAGE_MB: 5,
        MULTIPLIERS: { '1x': 1, 'k': 1000, 'm': 1000000, 'b': 1000000000 },
        MIN_BET: 0.1,
        MIN_INT_BET: 1
    });

    // =============================================================================
    // LOGGER UTILITY
    // =============================================================================
    class Logger {
        static LEVELS = Object.freeze({ DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 });
        static currentLevel = Logger.LEVELS.WARN; // Reduced logging for PDA

        static log(level, tag, msg) {
            if (level < this.currentLevel) return;
            const prefix = `[LabTrack v${CONFIG.VERSION}][${tag}]`;
            const timestamp = new Date().toISOString();
            const fullMsg = `${timestamp} ${prefix} ${msg}`;

            switch(level) {
                case this.LEVELS.DEBUG: console.debug(fullMsg); break;
                case this.LEVELS.INFO: console.log(fullMsg); break;
                case this.LEVELS.WARN: console.warn(fullMsg); break;
                case this.LEVELS.ERROR: console.error(fullMsg); break;
            }

            if (window.ltDevTool) {
                window.ltDevTool.log('net', tag, msg);
            }
        }

        static debug(tag, msg) { this.log(this.LEVELS.DEBUG, tag, msg); }
        static info(tag, msg) { this.log(this.LEVELS.INFO, tag, msg); }
        static warn(tag, msg) { this.log(this.LEVELS.WARN, tag, msg); }
        static error(tag, msg) { this.log(this.LEVELS.ERROR, tag, msg); }
    }

    // =============================================================================
    // VALIDATOR UTILITY
    // =============================================================================
    class Validator {
        static isBetValid(bet) {
            return typeof bet === 'number' &&
                   !isNaN(bet) &&
                   isFinite(bet) &&
                   bet > 0 &&
                   bet < Number.MAX_SAFE_INTEGER;
        }

        static isSequenceValid(seq) {
            if (!Array.isArray(seq)) return false;
            return seq.every(item =>
                item &&
                typeof item === 'object' &&
                typeof item.id === 'string' &&
                item.id.length > 0 &&
                typeof item.value === 'number' &&
                item.value > 0
            );
        }

        static isStateValid(state) {
            if (!state || typeof state !== 'object') return false;
            return this.isSequenceValid(state.sequence || []) &&
                   typeof state.totalProfit === 'number' &&
                   typeof state.roundCount === 'number' &&
                   Array.isArray(state.roundHistory);
        }

        static isSettingsValid(settings) {
            if (!settings || typeof settings !== 'object') return false;
            return ['bankroll', 'target'].includes(settings.mode) &&
                   typeof settings.multVal === 'number' &&
                   settings.multVal > 0;
        }
    }

    // =============================================================================
    // SAFE STORAGE UTILITY
    // =============================================================================
    class SafeStorage {
        static _mem = {};
        static getItem(key) {
            try { return localStorage.getItem(key); }
            catch(e) { return this._mem[key] || null; }
        }
        static setItem(key, val) {
            try { localStorage.setItem(key, val); }
            catch(e) { this._mem[key] = val; }
        }
        static removeItem(key) {
            try { localStorage.removeItem(key); }
            catch(e) { delete this._mem[key]; }
        }
    }

    // =============================================================================
    // PERFORMANCE UTILITIES
    // =============================================================================
    class PerformanceUtils {
        static debounce(fn, delay) {
            let timer;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        }

        static throttle(fn, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        static requestFrame(fn) {
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(fn);
            } else {
                setTimeout(fn, 16);
            }
        }
    }

    // =============================================================================
    // DOM CACHE
    // =============================================================================
    class DOMCache {
        constructor() {
            this.cache = new Map();
        }

        get(id) {
            const cached = this.cache.get(id);
            if (cached && document.contains(cached)) return cached;

            const element = document.getElementById(id);
            if (element) {
                this.cache.set(id, element);
            }
            return element;
        }

        clear() { this.cache.clear(); }
        remove(id) { this.cache.delete(id); }
    }

    // =============================================================================
    // EVENT LISTENER MANAGER
    // =============================================================================
    class EventManager {
        constructor() {
            this.listeners = new Map();
        }

        add(element, event, handler, id) {
            const key = id || `${element.id || 'unknown'}-${event}-${Date.now()}`;

            if (this.listeners.has(key)) {
                this.remove(key);
            }

            element.addEventListener(event, handler);
            this.listeners.set(key, { element, event, handler });
            Logger.debug('EventMgr', `Added: ${key}`);
            return key;
        }

        remove(key) {
            const listener = this.listeners.get(key);
            if (listener) {
                listener.element.removeEventListener(listener.event, listener.handler);
                this.listeners.delete(key);
                Logger.debug('EventMgr', `Removed: ${key}`);
            }
        }

        cleanup() {
            this.listeners.forEach((listener) => {
                listener.element.removeEventListener(listener.event, listener.handler);
            });
            this.listeners.clear();
            Logger.info('EventMgr', 'All listeners cleaned up');
        }
    }

    // --- TORNPDA / MOBILE CSS INJECTOR ---
    function addCustomStyle(css) {
        const style = document.createElement('style');
        style.id = 'lt-custom-styles';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // --- CSS STYLES - PDA OPTIMIZED ---
    addCustomStyle(`
        /* ============ PDA MOBILE OPTIMIZED STYLES ============ */

        #lt-dashboard {
            position: relative; width: 100%; margin-bottom: 10px;
            background: #181818; border: 1px solid #7c3aed; border-radius: 8px;
            color: #e2e8f0; font-family: 'Segoe UI', Tahoma, sans-serif;
            z-index: 1000001;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            display: none; flex-direction: column; font-size: 13px; box-sizing: border-box;
        }
        #lt-dashboard.visible { display: flex; }

        #lt-dashboard.flash-win { border-color: #4ade80; box-shadow: 0 0 20px rgba(74, 222, 128, 0.2); }
        #lt-dashboard.flash-loss { border-color: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }

        /* Hospital Overlay - Mobile Safe */
        #lt-hospital-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(220, 20, 60, 0.25);
            pointer-events: none;
            z-index: 999990;
            display: none;
            mix-blend-mode: multiply;
            transition: opacity 0.1s ease;
        }
        body.hospital #lt-hospital-overlay,
        #lt-hospital-overlay.visible { display: block !important; }

        /* Full Screen Flash Overlay - Mobile Safe */
        #lt-flash-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none; z-index: 999995; opacity: 0; transition: opacity 0.3s ease-out;
        }
        #lt-flash-overlay.win { background: rgba(74, 222, 128, 0.25); opacity: 1; }
        #lt-flash-overlay.loss { background: rgba(239, 68, 68, 0.25); opacity: 1; }

        #lt-header {
            padding: 8px 10px; background: rgba(139, 92, 246, 0.15); display: flex;
            justify-content: space-between; align-items: center; font-weight: bold;
            border-bottom: 1px solid #333; border-radius: 8px 8px 0 0; user-select: none;
        }
        #lt-content { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
        .lt-grid-main { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: start; }

        /* BUTTONS - PDA Touch Optimized */
        .lt-btn {
            border: none; border-radius: 6px; padding: 10px 12px; cursor: pointer; font-weight: bold;
            transition: background 0.1s, transform 0.1s; font-size: 13px; color: white;
            display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
            min-height: 38px; /* Touch target */
            -webkit-tap-highlight-color: transparent;
        }
        /* Replace hover with active for touch */
        .lt-btn:active { filter: brightness(1.2); transform: scale(0.98); }

        .lt-btn-primary { background: #7c3aed; }
        .lt-btn-win { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #4ade80; }
        .lt-btn-loss { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; }
        .lt-btn-action { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
        .lt-btn-active { background: #f97316 !important; color: white !important; border-color: #ea580c !important; }
        .lt-btn-confirm { background: #15803d; color: white; border: 1px solid #22c55e; margin-top: 5px; }
        .lt-btn-play-again { background: #22c55e; color: white; font-size: 16px; padding: 18px; margin-top: 10px; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
        .lt-btn-new-random { background: #334155; color: #e2e8f0; font-size: 13px; padding: 12px; margin-top: 5px; border: 1px solid #475569; }
        .lt-btn-reset { background: #7f1d1d; color: #fecaca; font-size: 13px; padding: 12px; margin-top: 15px; border: 1px solid #ef4444; }
        .lt-btn-debug { background: #be123c; color: #fff; padding: 6px 10px; font-size: 12px; border-radius: 4px; border: 1px solid #f43f5e; min-height: 36px; }

        #lt-btn-auto { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
        #lt-btn-auto.active { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: #22c55e; }

        /* Stats Row */
        .lt-stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 11px; color: #94a3b8; margin-bottom: 5px; }
        .lt-stat-item { display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px; }
        .lt-stat-val { font-weight: bold; color: #e2e8f0; }

        .lt-bet-box {
            text-align:center; margin: 5px 0; padding:12px; background:rgba(0,0,0,0.2);
            border-radius:8px; border:1px solid rgba(255,255,255,0.05);
            transition: border-color 0.2s; min-height: 40px;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-bet-box:active { border-color: #7c3aed; }
        .lt-bet-box.override { border-color: #eab308; background: rgba(234, 179, 8, 0.05); }
        .lt-big-val { font-size: 32px; font-weight: 900; color: #fff; text-align: center; margin: 5px 0; text-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
        .lt-big-val.override { color: #eab308; text-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }

        .lt-seq-container {
            display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: rgba(0,0,0,0.3);
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); min-height: 50px; justify-content: center; align-items: center;
        }

        /* BADGES - PDA Touch Optimized */
        .lt-badge {
            background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px; border-radius: 6px;
            font-family: monospace; font-size: 14px; font-weight: bold; user-select: none;
            transition: all 0.1s; min-width: 44px; min-height: 44px;
            display: flex; align-items: center; justify-content: center;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-badge:active { background: #7c3aed; color: white; border-color: #8b5cf6; }
        .lt-badge.selected { background: #f97316; color: white; border-color: #ea580c; transform: scale(1.05); }

        /* Edit Mode Badge Container */
        .lt-badge-edit-wrapper {
            display: flex; align-items: center; gap: 2px;
        }
        .lt-badge-arrow {
            background: #334155; border: 1px solid #475569; color: #94a3b8;
            padding: 8px 10px; border-radius: 4px; font-size: 14px; font-weight: bold;
            min-width: 36px; min-height: 36px;
            display: flex; align-items: center; justify-content: center;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-badge-arrow:active { background: #7c3aed; color: white; }

        .lt-input-group { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; position: relative; }
        .lt-input {
            background: #0f172a; border: 1px solid #334155; color: white; padding: 12px; border-radius: 4px;
            width: 100%; font-size: 16px; transition: border-color 0.2s;
            min-height: 44px; /* Prevent mobile zoom */
        }
        .lt-input.error { border-color: #ef4444; }
        .lt-label { font-size: 12px; color: #94a3b8; width: 70px; flex-shrink: 0; }
        .lt-input-preview { position: absolute; right: 10px; color: #4ade80; font-size: 12px; font-weight: bold; pointer-events: none; background: rgba(15, 23, 42, 0.9); padding-left: 5px; }

        /* Multiplier Buttons */
        .lt-mult-group { display: flex; gap: 4px; margin-bottom: 12px; justify-content: center; background: #0f172a; padding: 4px; border-radius: 6px; }
        .lt-mult-btn {
            flex: 1; background: #1e293b; border: 1px solid #334155; color: #94a3b8;
            padding: 10px 4px; font-size: 12px; font-weight: bold; border-radius: 4px;
            transition: all 0.1s; min-height: 44px;
            display: flex; align-items: center; justify-content: center;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-mult-btn:active { background: #334155; }
        .lt-mult-btn.active { background: #7c3aed; color: white; border-color: #8b5cf6; }

        .lt-checkbox-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #cbd5e1; min-height: 44px; }
        .lt-checkbox { width: 20px; height: 20px; accent-color: #7c3aed; }
        .lt-hidden { display: none !important; }
        .lt-tabs { display: flex; gap: 4px; margin-bottom: 12px; background: #0f172a; padding: 3px; border-radius: 6px; }
        .lt-tab {
            flex: 1; text-align: center; padding: 12px 6px; border-radius: 4px; font-size: 14px;
            color: #94a3b8; transition: all 0.1s; min-height: 44px;
            display: flex; align-items: center; justify-content: center;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-tab.active { background: #7c3aed; color: white; font-weight: bold; }

        .lt-toast {
            position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: white; padding: 10px 18px; border-radius: 20px;
            font-size: 14px; font-weight: bold; pointer-events: none; opacity: 0; transition: opacity 0.3s;
            z-index: 1000000; border: 1px solid #7c3aed; white-space: nowrap;
        }
        .lt-toast.show { opacity: 1; }

        .lt-history-list { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; -webkit-overflow-scrolling: touch; }
        .lt-history-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 4px; font-size: 13px; }
        .lt-history-win { border-left: 3px solid #4ade80; }
        .lt-history-loss { border-left: 3px solid #ef4444; }
        .lt-hist-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
        .lt-hist-win-bg { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
        .lt-hist-loss-bg { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .lt-status-bar { font-size: 11px; text-align: center; margin-bottom: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }

        /* INFO PANEL */
        .lt-info-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 15px; }
        .lt-info-card { background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 8px; padding: 12px; }
        .lt-info-head { font-weight: bold; color: #a78bfa; margin-bottom: 10px; font-size: 14px; border-bottom: 2px solid rgba(124, 58, 237, 0.3); padding-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .lt-info-list li { margin-bottom: 8px; color: #cbd5e1; list-style: none; position: relative; padding-left: 18px; line-height: 1.5; }
        .lt-info-list li::before { content: ">"; color: #a78bfa; position: absolute; left: 0; font-weight: bold; font-size: 14px; }

        /* ToS Table */
        .lt-tos-table { width: 100%; border-collapse: collapse; font-size: 12px; color: #ffffff; background: rgba(0,0,0,0.2); border-radius: 6px; overflow: hidden; }
        .lt-tos-table th { text-align: left; padding: 10px; background: rgba(124, 58, 237, 0.15); color: #ffffff; font-weight: bold; border-bottom: 2px solid #7c3aed; }
        .lt-tos-table td { padding: 10px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); vertical-align: top; color: #e2e8f0; }
        .lt-tos-table td:first-child { color: #ffffff; font-weight: 600; width: 100px; }
        .lt-tos-table tr:last-child td { border-bottom: none; }

        /* PDA Input Modal */
        #lt-input-modal {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 1000010;
            display: none; align-items: center; justify-content: center;
            padding: 20px;
        }
        #lt-input-modal.visible { display: flex; }
        .lt-modal-content {
            background: #1e293b; border: 2px solid #7c3aed; border-radius: 12px;
            padding: 20px; width: 100%; max-width: 300px;
        }
        .lt-modal-title { color: #e2e8f0; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-align: center; }
        .lt-modal-input {
            width: 100%; background: #0f172a; border: 1px solid #475569; color: white;
            padding: 15px; border-radius: 8px; font-size: 18px; text-align: center;
            margin-bottom: 15px; min-height: 50px;
        }
        .lt-modal-buttons { display: flex; gap: 10px; }
        .lt-modal-btn {
            flex: 1; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold;
            border: none; min-height: 50px;
            -webkit-tap-highlight-color: transparent;
        }
        .lt-modal-btn-cancel { background: #475569; color: #e2e8f0; }
        .lt-modal-btn-ok { background: #7c3aed; color: white; }
        .lt-modal-btn:active { filter: brightness(1.2); }

        /* DEBUG TOOL - Hidden by default on PDA */
        #lt-debug-panel {
            position: fixed; top: 50px; right: 10px; width: 90%; max-width: 400px; height: 400px;
            background: #0f172a; border: 2px solid #be123c; border-radius: 8px;
            display: none; flex-direction: column; z-index: 1000000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8); font-family: monospace;
        }
        #lt-debug-header {
            padding: 10px; background: #be123c; color: white; font-weight: bold; display: flex; justify-content: space-between; align-items: center;
        }
        .lt-debug-tabs { display:flex; background: #1e293b; border-bottom: 1px solid #334155; }
        .lt-debug-tab { flex:1; padding: 10px; text-align: center; color: #94a3b8; font-size: 12px; font-weight: bold; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .lt-debug-tab.active { background: #334155; color: white; }
        #lt-debug-content-net, #lt-debug-content-dom {
            flex: 1; overflow-y: auto; padding: 10px; color: #a5f3fc; font-size: 11px; white-space: pre-wrap; display: none;
            -webkit-overflow-scrolling: touch;
        }
        #lt-debug-content-net.active, #lt-debug-content-dom.active { display: block; }
        .lt-debug-entry { margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; word-break: break-all; }
        .lt-debug-time { color: #64748b; margin-right: 5px; }
        .lt-debug-tag { color: #facc15; font-weight: bold; margin-right: 5px; }
        .lt-spy-controls { padding: 10px; background: #1e293b; border-top: 1px solid #334155; display: flex; gap: 5px; }
        .lt-spy-input { flex: 1; background: #0f172a; border: 1px solid #475569; color: white; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; min-height: 44px; }
    `);

    // --- CORE UTILS ---
    const Utils = {
        formatNumber: (n) => {
            if (!n && n !== 0) return "0";
            const abs = Math.abs(n);
            if (abs >= 1_000_000_000) return `${(abs / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}b`;
            if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(2).replace(/\.00$/, '')}m`;
            if (abs >= 1_000) return `${(abs / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
            return `${Math.round(abs * 10) / 10}`;
        },
        generateSequence: (target, parts, uniform, integers) => {
            if (parts <= 0) {
                Logger.warn('Utils', `Invalid parts: ${parts}`);
                return [];
            }

            let sequence = [];
            let remaining = target;
            const minVal = integers ? CONFIG.MIN_INT_BET : CONFIG.MIN_BET;

            if (uniform) {
                let base = target / parts;
                base = integers ? Math.max(CONFIG.MIN_INT_BET, Math.round(base)) : Math.max(CONFIG.MIN_BET, Math.round(base * 10) / 10);
                for (let i = 0; i < parts; i++) sequence.push(base);
            } else {
                for (let i = 0; i < parts - 1; i++) {
                    let val = (remaining / (parts - i)) * (Math.random() + 0.5);
                    if (val >= remaining) val = remaining / 2;
                    val = integers ? Math.max(CONFIG.MIN_INT_BET, Math.round(val)) : Math.max(CONFIG.MIN_BET, Math.round(val * 10) / 10);
                    sequence.push(val);
                    remaining -= val;
                }
                sequence.push(integers ? Math.max(CONFIG.MIN_INT_BET, Math.round(remaining)) : Math.max(CONFIG.MIN_BET, Math.round(remaining * 10) / 10));
            }

            let diff = target - sequence.reduce((a, b) => a + b, 0);
            const step = integers ? 1 : 0.1;
            let iterations = 0;
            const maxIterations = 1000;

            while (Math.abs(diff) >= (integers ? 0.5 : 0.05) && iterations < maxIterations) {
                const idx = Math.floor(Math.random() * sequence.length);
                if (diff > 0) {
                    sequence[idx] += step;
                    diff -= step;
                } else if (sequence[idx] > minVal) {
                    sequence[idx] -= step;
                    diff += step;
                }
                iterations++;
            }

            return sequence.map(n => {
                let val = integers ? Math.round(n) : Math.round(n * 10) / 10;
                return Math.max(val, minVal);
            });
        },

        makeId: () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36),

        showToast: (msg) => {
            let toast = document.getElementById('lt-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'lt-toast';
                toast.className = 'lt-toast';
                document.getElementById('lt-dashboard')?.appendChild(toast);
            }
            if (toast) {
                toast.innerText = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), CONFIG.TOAST_MS);
            }
        }
    };

    // --- DEV TOOLS CLASS (Simplified for PDA) ---
    class DevTool {
        constructor() {
            this.netLogs = [];
            this.domLogs = [];
            this.activeTab = 'net';
            this.domObserver = null;
            this.watchSelector = "span[class*='message']";
        }
        init() {
            if(document.getElementById('lt-debug-panel')) return;
            const div = document.createElement('div'); div.id = 'lt-debug-panel';
            div.innerHTML = `
                <div id="lt-debug-header"><span>Debug</span><span id="lt-debug-close" style="padding:10px;">X</span></div>
                <div class="lt-debug-tabs">
                    <div id="lt-tab-net" class="lt-debug-tab active">NETWORK</div>
                    <div id="lt-tab-dom" class="lt-debug-tab">DOM SPY</div>
                </div>
                <div id="lt-debug-content-net" class="active"></div>
                <div id="lt-debug-content-dom"></div>
                <div class="lt-spy-controls" id="lt-spy-controls" style="display:none;">
                    <input id="lt-spy-input" class="lt-spy-input" type="text" value="${this.watchSelector}" placeholder="CSS Selector">
                    <button id="lt-spy-btn" class="lt-btn lt-btn-action" style="width:auto;padding:10px 15px;">Watch</button>
                </div>
                <div style="padding:10px;border-top:1px solid #333;"><button class="lt-btn lt-btn-action" id="lt-copy-log">Copy Log</button></div>
            `;
            document.body.appendChild(div);

            div.querySelector('#lt-debug-close').addEventListener('click', () => { div.style.display = 'none'; });

            const tabNet = document.getElementById('lt-tab-net');
            const tabDom = document.getElementById('lt-tab-dom');
            const conNet = document.getElementById('lt-debug-content-net');
            const conDom = document.getElementById('lt-debug-content-dom');
            const controls = document.getElementById('lt-spy-controls');

            tabNet.addEventListener('click', () => {
                this.activeTab = 'net';
                tabNet.classList.add('active'); tabDom.classList.remove('active');
                conNet.classList.add('active'); conDom.classList.remove('active');
                controls.style.display = 'none';
            });

            tabDom.addEventListener('click', () => {
                this.activeTab = 'dom';
                tabDom.classList.add('active'); tabNet.classList.remove('active');
                conDom.classList.add('active'); conNet.classList.remove('active');
                controls.style.display = 'flex';
            });

            document.getElementById('lt-spy-btn').addEventListener('click', () => {
                const val = document.getElementById('lt-spy-input').value;
                if(val) {
                    this.watchSelector = val;
                    this.log('dom', 'SYS', `Watcher changed to: ${val}`);
                    this.restartDomSpy();
                }
            });

            document.getElementById('lt-copy-log').addEventListener('click', () => {
                const source = this.activeTab === 'net' ? this.netLogs : this.domLogs;
                const txt = source.map(l => `[${l.time}] ${l.tag}: ${l.msg}`).join('\n');
                navigator.clipboard.writeText(txt);
                Utils.showToast(`${this.activeTab.toUpperCase()} Log copied!`);
            });

            this.startDomSpy();
        }
        toggle() {
            const el = document.getElementById('lt-debug-panel');
            if(el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
        }
        log(type, tag, msg) {
            const entry = { time: new Date().toLocaleTimeString(), tag, msg };
            if (type === 'net') {
                this.netLogs.unshift(entry);
                if (this.netLogs.length > CONFIG.MAX_HISTORY) this.netLogs.pop();
            } else {
                this.domLogs.unshift(entry);
                if (this.domLogs.length > CONFIG.MAX_HISTORY) this.domLogs.pop();
            }
            this.render(type);
        }
        render(type) {
            const id = type === 'net' ? 'lt-debug-content-net' : 'lt-debug-content-dom';
            const c = document.getElementById(id);
            const source = type === 'net' ? this.netLogs : this.domLogs;
            if(!c) return;
            c.innerHTML = source.map(l => `<div class="lt-debug-entry"><span class="lt-debug-time">${l.time}</span><span class="lt-debug-tag">[${l.tag}]</span>${l.msg}</div>`).join('');
            c.scrollTop = 0;
        }

        restartDomSpy() {
            if(this.domObserver) this.domObserver.disconnect();
            this.startDomSpy();
        }

        startDomSpy() {
            this.domObserver = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if(node.nodeType === 1) {
                            setTimeout(() => {
                                let match = false;
                                try {
                                    if (node.matches(this.watchSelector) || node.querySelector(this.watchSelector)) match = true;
                                } catch(e){}

                                if(match) {
                                    const text = (node.innerText || "").trim();
                                    if(text.length < 3) return;
                                    const lower = text.toLowerCase();

                                    if (lower.includes("waiting") || lower.includes("sound on") || lower.includes("pot money")) return;

                                    if (lower.includes("you") || lower.includes("bang") || lower.includes("won")) {
                                        this.log('dom', "SPY", `ASYNC FOUND: "${text.substring(0, 50)}..."`);
                                        if (window.LabTrackIntegration) {
                                            window.LabTrackIntegration.handleDomMessage(text);
                                        }
                                    }
                                }
                            }, CONFIG.DOM_DELAY_MS);
                        }
                    });
                });
            });
            const target = document.querySelector('#mainContainer') || document.body;
            if (target) {
               this.domObserver.observe(target, { childList: true, subtree: true });
            }
        }
    }
    const devTool = new DevTool();

    // --- GAME ENGINE ---
    class GameEngine {
        constructor() {
            this.state = this.loadState() || this.getDefaultState();
            this.listeners = [];
            this.pendingBet = null;
            this.history = [];
            this.lastActionTime = 0;

            if (this.state.autoDetect === undefined) this.state.autoDetect = true;
            if (this.state.customBet === undefined) this.state.customBet = null;
            if (this.state.roundCount === undefined) this.state.roundCount = 0;
            if (this.state.roundHistory === undefined) this.state.roundHistory = [];
            if (this.state.initialSequence === undefined) this.state.initialSequence = [];
            if (this.state.multiplier === undefined) this.state.multiplier = 1;

            window.addEventListener('storage', (e) => {
                if (e.key === 'lt_standalone_save') {
                    this.state = this.loadState() || this.getDefaultState();
                    this.notify();
                }
            });
        }
        getDefaultState() {
            return {
                sequence: [],
                multiplier: 1,
                totalProfit: 0,
                autoDetect: true,
                customBet: null,
                roundCount: 0,
                roundHistory: [],
                initialSequence: []
            };
        }

        loadState() {
            try {
                const data = SafeStorage.getItem(CONFIG.STORAGE_SAVE);
                if (!data) return null;
                const state = JSON.parse(data);
                if (!Validator.isStateValid(state)) {
                    Logger.warn('GameEngine', 'Invalid state loaded, using default');
                    return null;
                }
                return state;
            } catch(e) {
                Logger.error('GameEngine', `Load failed: ${e.message}`);
                return null;
            }
        }

        saveState() {
            try {
                const data = JSON.stringify(this.state);
                if (data.length > CONFIG.MAX_STORAGE_MB * 1000000) {
                    Logger.warn('GameEngine', 'State too large, compacting history');
                    this.compactHistory();
                }
                SafeStorage.setItem(CONFIG.STORAGE_SAVE, data);
                this.notify();
            } catch(e) {
                if (e.name === 'QuotaExceededError') {
                    Logger.error('GameEngine', 'Storage quota exceeded');
                    Utils.showToast("Storage full - clearing old data");
                    this.compactHistory();
                    try {
                        SafeStorage.setItem(CONFIG.STORAGE_SAVE, JSON.stringify(this.state));
                        this.notify();
                    } catch(retryErr) {
                        Logger.error('GameEngine', 'Retry save failed');
                    }
                } else {
                    Logger.error('GameEngine', `Save failed: ${e.message}`);
                }
            }
        }

        compactHistory() {
            if (this.state.roundHistory.length > 20) {
                this.state.roundHistory = this.state.roundHistory.slice(0, 20);
            }
            if (this.history.length > 10) {
                this.history = this.history.slice(-10);
            }
        }
        subscribe(fn) { this.listeners.push(fn); }
        notify() { this.listeners.forEach(fn => fn(this.state)); }

        resetData() {
            SafeStorage.removeItem('lt_standalone_save');
            SafeStorage.removeItem('lt_settings');
            this.state = this.getDefaultState();
            this.notify();
            Utils.showToast("Factory Reset Complete");
        }

        pushHistory() {
            try {
                this.history.push(JSON.stringify(this.state));
                if (this.history.length > CONFIG.MAX_UNDO_STACK) {
                    this.history.shift();
                }
            } catch(e) {
                Logger.error('GameEngine', `Push history failed: ${e.message}`);
            }
        }

        undo() {
            if (!this.history.length) {
                Utils.showToast("Nothing to undo");
                return;
            }
            try {
                this.state = JSON.parse(this.history.pop());
                this.saveState();
                Utils.showToast("Undo: Last Round");
                Logger.info('GameEngine', 'Undo successful');
            } catch(e) {
                Logger.error('GameEngine', `Undo failed: ${e.message}`);
                Utils.showToast("Undo failed");
            }
        }

        toggleAutoDetect() { this.state.autoDetect = !this.state.autoDetect; this.saveState(); }
        setCustomBet(amount) { this.state.customBet = amount; this.saveState(); }
        clearCustomBet() { this.state.customBet = null; this.saveState(); }
        resetBet() {
            this.state.customBet = null;
            this.pendingBet = null;
            this.saveState();
            Logger.info('GameEngine', 'Bet reset - customBet and pendingBet cleared');
        }

        getEffectiveBet() {
            if (this.state.customBet !== null && this.state.customBet > 0) return this.state.customBet;

            const baseBet = this.getNextBaseBet();

            let mult = 1;
            try {
                const s = JSON.parse(SafeStorage.getItem('lt_settings'));
                if(s && s.multVal) mult = parseFloat(s.multVal);
            } catch(e){}

            return Math.round(baseBet * mult);
        }

        setPendingBet(amount) {
            if (!Validator.isBetValid(amount)) {
                Logger.warn('GameEngine', `Invalid bet: ${amount}`);
                return;
            }
            Logger.info('GameEngine', `Bet captured: ${amount}`);
            this.pendingBet = amount;
            devTool.log('net', "BET", `Pending: ${amount}`);
        }

        generateNew(target, parts, uniform, integers) {
            this.pushHistory();
            const seq = Utils.generateSequence(target, parts, uniform, integers);
            this.state.initialSequence = seq.map(v => ({ id: Utils.makeId(), value: v }));
            this.state.sequence = JSON.parse(JSON.stringify(this.state.initialSequence));
            this.state.totalProfit = 0; this.state.roundCount = 0; this.state.roundHistory = []; this.state.customBet = null;
            this.saveState();
            Utils.showToast("Sequence Generated");
        }

        restartGame() {
            this.pushHistory();
            if(this.state.initialSequence && this.state.initialSequence.length > 0) {
                this.state.sequence = JSON.parse(JSON.stringify(this.state.initialSequence));
                this.state.sequence.forEach(i => i.id = Utils.makeId());
                this.state.totalProfit = 0; this.state.roundCount = 0; this.state.roundHistory = []; this.state.customBet = null;
                this.saveState();
                Utils.showToast("Game Restarted");
            } else { Utils.showToast("No previous sequence"); }
        }

        getNextBaseBet() {
            const seq = this.state.sequence;
            if(seq.length===0) return 0;
            if(seq.length===1) return seq[0].value;
            return seq[0].value + seq[seq.length-1].value;
        }

        processWin() {
            const now = Date.now();

            const prevMarker = this._winProcessingTime;
            this._winProcessingTime = now;

            if (prevMarker && (now - prevMarker) < 3000) {
                Logger.warn('GameEngine', 'Win SKIPPED - duplicate call within 3s');
                return;
            }

            const bet = this.pendingBet || this.getEffectiveBet();

            if (this.state.roundHistory.length > 0) {
                const last = this.state.roundHistory[0];
                if (last.result === 'WIN' && (now - last.time) < 3000) {
                    Logger.warn('GameEngine', 'Win SKIPPED - already in history within 3s');
                    return;
                }
            }

            this.pushHistory();
            if (this.state.sequence.length === 0) {
                Logger.warn('GameEngine', 'Win processed with empty sequence');
                return;
            }

            let mult = 1;
            try {
                const settings = JSON.parse(SafeStorage.getItem(CONFIG.STORAGE_SETTINGS));
                mult = parseFloat(settings?.multVal) || 1;
            } catch(e) {
                Logger.debug('GameEngine', 'Using default multiplier');
            }

            const baseProfit = bet / mult;

            this.state.roundHistory.unshift({
                result: 'WIN',
                bet,
                profit: bet,
                time: now
            });

            if (this.state.sequence.length > 1) {
                this.state.sequence.shift();
                this.state.sequence.pop();
            } else {
                this.state.sequence = [];
            }

            this.state.totalProfit += baseProfit;
            this.state.roundCount++;
            this.pendingBet = null;

            if (this.state.customBet) {
                Logger.info('CustomBet', `Clearing after use: ${Utils.formatNumber(this.state.customBet)}`);
                this.state.customBet = null;
            }

            this.saveState();
            Logger.info('GameEngine', `Win processed: ${Utils.formatNumber(bet)}`);
        }

        processLoss(amount) {
            const now = Date.now();

            const prevMarker = this._lossProcessingTime;
            this._lossProcessingTime = now;

            if (prevMarker && (now - prevMarker) < 3000) {
                Logger.warn('GameEngine', 'Loss SKIPPED - duplicate call within 3s');
                return;
            }

            const bet = amount || this.pendingBet || this.getEffectiveBet();

            if (this.state.roundHistory.length > 0) {
                const last = this.state.roundHistory[0];
                if (last.result === 'LOSS' && (now - last.time) < 3000) {
                    Logger.warn('GameEngine', 'Loss SKIPPED - already in history within 3s');
                    return;
                }
            }

            this.pushHistory();

            let mult = 1;
            try {
                const settings = JSON.parse(SafeStorage.getItem(CONFIG.STORAGE_SETTINGS));
                mult = parseFloat(settings?.multVal) || 1;
            } catch(e) {
                Logger.debug('GameEngine', 'Using default multiplier');
            }

            const baseLoss = bet / mult;

            this.state.roundHistory.unshift({
                result: 'LOSS',
                bet,
                profit: -bet,
                time: now
            });

            this.state.sequence.push({
                id: Utils.makeId(),
                value: baseLoss
            });

            this.state.totalProfit -= baseLoss;
            this.state.roundCount++;
            this.pendingBet = null;

            if (this.state.customBet) {
                Logger.info('CustomBet', `Clearing after use: ${Utils.formatNumber(this.state.customBet)}`);
                this.state.customBet = null;
            }

            this.saveState();
            Logger.info('GameEngine', `Loss processed: ${Utils.formatNumber(bet)}`);
        }
        shuffleSequence() { this.pushHistory(); this.state.sequence.sort(() => Math.random() - 0.5); this.saveState(); Utils.showToast("Shuffled"); }

        // PDA: Move item left/right instead of drag & drop
        moveItem(fromIdx, direction) {
            const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
            if (toIdx < 0 || toIdx >= this.state.sequence.length) return;
            this.pushHistory();
            const item = this.state.sequence.splice(fromIdx, 1)[0];
            this.state.sequence.splice(toIdx, 0, item);
            this.saveState();
        }

        mergeList(indices) {
            this.pushHistory(); if(indices.length<2) return;
            indices.sort((a,b)=>a-b); let sum=0;
            indices.forEach(i=>sum+=this.state.sequence[i].value);
            const pos = indices[0];
            for(let i=indices.length-1; i>=0; i--) this.state.sequence.splice(indices[i], 1);
            this.state.sequence.splice(pos, 0, { id:Utils.makeId(), value:sum });
            this.saveState();
            Utils.showToast("Merged");
        }
        splitItem(idx, val) {
            this.pushHistory();
            const item = this.state.sequence[idx]; if(!item) return;
            const rem = item.value - val; if(rem<=0) return;
            this.state.sequence.splice(idx, 1, {id:Utils.makeId(), value:val}, {id:Utils.makeId(), value:rem});
            this.saveState();
            Utils.showToast("Split");
        }
    }
    const engine = new GameEngine();

    // --- UI MANAGER - PDA OPTIMIZED ---
    class OverlayUI {
        constructor() {
            this.mergeMode = false;
            this.selectedForMerge = [];
            this.editMode = false; // PDA: Edit mode for reordering
            let s; try{ s=JSON.parse(SafeStorage.getItem('lt_settings')); }catch(e){}
            this.savedSettings = s || { mode:'bankroll', bankroll:'', risk:'5', target:'', parts:'10', integers:false, uniform:false, multKey:'1x', multVal:1 };
            if(!this.savedSettings.multKey) { this.savedSettings.multKey='1x'; this.savedSettings.multVal=1; }
            this.genMode = this.savedSettings.mode || 'bankroll';
        }

        // PDA: Input Modal instead of prompt()
        showInputModal(title, defaultValue, callback) {
            let modal = document.getElementById('lt-input-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'lt-input-modal';
                modal.innerHTML = `
                    <div class="lt-modal-content">
                        <div class="lt-modal-title" id="lt-modal-title"></div>
                        <input type="number" class="lt-modal-input" id="lt-modal-input" inputmode="decimal">
                        <div class="lt-modal-buttons">
                            <button class="lt-modal-btn lt-modal-btn-cancel" id="lt-modal-cancel">Cancel</button>
                            <button class="lt-modal-btn lt-modal-btn-ok" id="lt-modal-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                document.getElementById('lt-modal-cancel').addEventListener('click', () => {
                    modal.classList.remove('visible');
                    if (this._modalCallback) this._modalCallback(null);
                });

                document.getElementById('lt-modal-ok').addEventListener('click', () => {
                    const val = document.getElementById('lt-modal-input').value;
                    modal.classList.remove('visible');
                    if (this._modalCallback) this._modalCallback(val);
                });

                document.getElementById('lt-modal-input').addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        const val = document.getElementById('lt-modal-input').value;
                        modal.classList.remove('visible');
                        if (this._modalCallback) this._modalCallback(val);
                    }
                });
            }

            document.getElementById('lt-modal-title').innerText = title;
            document.getElementById('lt-modal-input').value = defaultValue || '';
            this._modalCallback = callback;
            modal.classList.add('visible');
            setTimeout(() => document.getElementById('lt-modal-input').focus(), 100);
        }

        saveSettingsFromUI() {
            ['bankroll','risk','target','parts'].forEach(k => { const el=document.getElementById('lt-inp-'+k); if(el) this.savedSettings[k]=el.value; });
            ['integers','uniform'].forEach(k => { const el=document.getElementById('lt-chk-'+k); if(el) this.savedSettings[k]=el.checked; });
            this.savedSettings.mode = this.genMode;
            SafeStorage.setItem('lt_settings', JSON.stringify(this.savedSettings));
            this.updateInputPreviews();
        }
        setMultiplier(key) {
            this.savedSettings.multKey = key;
            if(key === 'k') this.savedSettings.multVal = 1000;
            else if(key === 'm') this.savedSettings.multVal = 1000000;
            else if(key === 'b') this.savedSettings.multVal = 1000000000;
            else this.savedSettings.multVal = 1;

            ['1x','k','m','b'].forEach(k => {
                const btn = document.getElementById('lt-btn-mult-'+k);
                if(btn) {
                    if(k===key) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            });
            this.saveSettingsFromUI();
            this.update();
        }
        updateInputPreviews() {
            const mult = this.savedSettings.multVal || 1;

            const bindPreview = (id) => {
                const el = document.getElementById(id);
                if(!el) return;
                let prev = el.parentNode.querySelector('.lt-input-preview');
                if(!prev) { prev=document.createElement('span'); prev.className='lt-input-preview'; el.parentNode.appendChild(prev); }
                const val = parseFloat(el.value);
                if(isNaN(val) || val === 0) prev.innerText = '';
                else {
                    const total = val * mult;
                    prev.innerText = Utils.formatNumber(total);
                }
            };
            bindPreview('lt-inp-bankroll');
            bindPreview('lt-inp-target');
        }
        init() {
            this.checkAndMount();
            devTool.init();
            engine.subscribe(() => { this.update(); this.checkAndMount(); });
            setInterval(() => this.checkAndMount(), 1000);

            if(!document.getElementById('lt-hospital-overlay')) {
                const ov = document.createElement('div');
                ov.id = 'lt-hospital-overlay';
                document.body.appendChild(ov);
            }
            if(!document.getElementById('lt-flash-overlay')) {
                const fl = document.createElement('div');
                fl.id = 'lt-flash-overlay';
                document.body.appendChild(fl);
            }
        }
        checkAndMount() {
            if(!window.location.href.includes("russianRoulette")) { const el=document.getElementById('lt-dashboard'); if(el) el.style.display='none'; return; }
            const content = document.querySelector('.content-wrapper') || document.querySelector('#mainContainer');
            if(content) {
                let dash = document.getElementById('lt-dashboard');
                if(!dash) this.render(content);
                else { if(dash.style.display==='none') dash.style.display='flex'; if(content.firstChild!==dash) content.insertBefore(dash, content.firstChild); }
            }
        }

        toggleHospital(active) {
            const el = document.getElementById('lt-hospital-overlay');
            if(el) {
                if(active) el.classList.add('visible');
                else el.classList.remove('visible');
            }
        }

        flash(type) {
            const el = document.getElementById('lt-flash-overlay');
            if(el) {
                el.className = type === 'win' ? 'win' : 'loss';
                void el.offsetWidth;
                setTimeout(() => el.className = '', 300);
            }
            const db = document.getElementById('lt-dashboard');
            if(db) {
                db.classList.add(type==='win'?'flash-win':'flash-loss');
                setTimeout(()=>db.classList.remove('flash-win','flash-loss'), 600);
            }
        }
        render(container) {
            const div = document.createElement('div'); div.id = 'lt-dashboard'; div.className = 'visible';
            div.innerHTML = `
                <div id="lt-header"><span style="display:flex;align-items:center;gap:8px;"><span style="background:#7c3aed;width:8px;height:8px;border-radius:50%"></span>LabTrack V${CONFIG.VERSION}</span>
                <div style="display:flex;gap:10px;">
                    <span id="lt-btn-debug" class="lt-btn lt-btn-debug">DBG</span>
                    <button id="lt-btn-info" class="lt-btn lt-btn-action" style="padding:8px 12px;width:auto;">Info</button>
                    <span id="lt-toggle-ui" style="padding:8px 12px;background:rgba(0,0,0,0.2);border-radius:4px;">_</span>
                </div></div>
                <div id="lt-content">
                    <div id="lt-status-bar" class="lt-status-bar">WAITING FOR LOBBY...</div>
                    <div class="lt-grid-main"><div>
                    <div class="lt-stat-row">
                        <div class="lt-stat-item"><span>Rounds:</span><span id="lt-rounds-val" class="lt-stat-val">0</span></div>
                        <div class="lt-stat-item"><span>Streak:</span><span id="lt-streak-val" class="lt-stat-val">0</span></div>
                        <div class="lt-stat-item"><span>Winrate:</span><span id="lt-winrate-val" class="lt-stat-val">0%</span></div>
                    </div>
                    <div class="lt-stat-row"><span>Remaining: <b id="lt-rem-val" style="color:#e2e8f0">0</b></span><span>Profit: <b id="lt-prof-val">0</b></span></div>
                    <div id="lt-bet-box" class="lt-bet-box"><div style="font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:5px;">Next Bet</div><div id="lt-bet-display" class="lt-big-val">0</div></div>
                    <div style="display:flex;gap:8px;margin-bottom:8px;"><button id="lt-btn-win" class="lt-btn lt-btn-win">WIN</button><button id="lt-btn-loss" class="lt-btn lt-btn-loss">LOSS</button></div>
                    <div style="display:flex;gap:8px;"><button id="lt-btn-auto" class="lt-btn">Auto: ON</button><button id="lt-btn-reset-bet" class="lt-btn lt-btn-action">Reset Bet</button></div>
                </div><div style="display:flex;flex-direction:column;gap:8px;height:100%;">
                    <div style="display:flex;gap:8px;">
                        <button id="lt-btn-gen-show" class="lt-btn lt-btn-action">Setup</button><button id="lt-btn-show-history" class="lt-btn lt-btn-action">History</button><button id="lt-btn-undo" class="lt-btn lt-btn-action">Undo</button>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button id="lt-btn-shuffle" class="lt-btn lt-btn-action">Shuffle</button>
                        <button id="lt-btn-merge" class="lt-btn lt-btn-action">Merge</button>
                        <button id="lt-btn-edit" class="lt-btn lt-btn-action">Edit</button>
                    </div>
                    <div id="lt-sequence" class="lt-seq-container" style="flex:1;"></div>
                    <div id="lt-play-again-container" style="display:none;flex:1;flex-direction:column;justify-content:center;">
                        <div class="lt-finished-msg" style="text-align:center;color:#4ade80;font-weight:bold;margin-bottom:10px;">Sequence Complete!</div>
                        <button id="lt-btn-play-again" class="lt-btn lt-btn-play-again">Play Again (Same)</button>
                        <button id="lt-btn-new-random" class="lt-btn lt-btn-new-random">New Random</button>
                    </div>
                    <button id="lt-btn-confirm-merge" class="lt-btn lt-btn-confirm lt-hidden">Confirm Merge</button>
                </div></div>

                <div id="lt-gen-panel" class="lt-hidden" style="background:#0f172a;padding:15px;border-radius:8px;border:1px solid #334155;margin-top:10px;">
                    <div class="lt-tabs"><div class="lt-tab active" id="lt-tab-bankroll">Bankroll</div><div class="lt-tab" id="lt-tab-target">Target</div></div>

                    <div class="lt-mult-group">
                        <div id="lt-btn-mult-1x" class="lt-mult-btn ${this.savedSettings.multKey==='1x'?'active':''}">1x</div>
                        <div id="lt-btn-mult-k" class="lt-mult-btn ${this.savedSettings.multKey==='k'?'active':''}">K</div>
                        <div id="lt-btn-mult-m" class="lt-mult-btn ${this.savedSettings.multKey==='m'?'active':''}">M</div>
                        <div id="lt-btn-mult-b" class="lt-mult-btn ${this.savedSettings.multKey==='b'?'active':''}">B</div>
                    </div>

                    <div id="lt-mode-bankroll"><div class="lt-input-group"><span class="lt-label">Bankroll</span><input id="lt-inp-bankroll" class="lt-input" type="number" inputmode="decimal" value="${this.savedSettings.bankroll}"></div><div class="lt-input-group"><span class="lt-label">Risk %</span><input id="lt-inp-risk" class="lt-input" type="number" inputmode="decimal" value="${this.savedSettings.risk}"></div></div>
                    <div id="lt-mode-target" class="lt-hidden"><div class="lt-input-group"><span class="lt-label">Target</span><input id="lt-inp-target" class="lt-input" type="number" inputmode="decimal" value="${this.savedSettings.target}"></div></div>
                    <div class="lt-input-group"><span class="lt-label">Parts</span><input id="lt-inp-parts" class="lt-input" type="number" inputmode="numeric" value="${this.savedSettings.parts}"></div>
                    <div style="margin-top:12px;display:flex;gap:15px;">
                        <label class="lt-checkbox-row"><input type="checkbox" id="lt-chk-integers" class="lt-checkbox" ${this.savedSettings.integers?'checked':''}> Whole Numbers</label>
                        <label class="lt-checkbox-row"><input type="checkbox" id="lt-chk-uniform" class="lt-checkbox" ${this.savedSettings.uniform?'checked':''}> Equal Split</label>
                    </div>

                    <div id="lt-gen-preview" style="margin-top:15px;padding:12px;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:6px;display:none;">
                        <div style="font-size:12px;color:#a78bfa;font-weight:bold;margin-bottom:8px;">PREVIEW</div>
                        <div id="lt-gen-preview-stats" style="font-size:12px;color:#cbd5e1;margin-bottom:8px;"></div>
                        <div id="lt-gen-preview-seq" style="display:flex;flex-wrap:wrap;gap:4px;max-height:60px;overflow-y:auto;"></div>
                    </div>

                    <button id="lt-btn-generate" class="lt-btn lt-btn-primary" style="margin-top:15px;">Generate</button>
                    <button id="lt-btn-reset-all" class="lt-btn lt-btn-reset">Reset Data</button>
                </div>

                <div id="lt-history-panel" class="lt-hidden" style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;margin-top:10px;">
                    <h4 style="color:#e2e8f0;margin:0 0 10px 0;font-size:14px;text-align:center;">History</h4><div id="lt-history-list" class="lt-history-list"></div><button id="lt-btn-close-hist" class="lt-btn lt-btn-action" style="margin-top:10px;">Close</button>
                </div>

                <div id="lt-info-panel" class="lt-hidden" style="background:#0f172a;padding:15px;border-radius:8px;border:1px solid #334155;margin-top:10px;max-height:400px;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                    <div class="lt-info-grid">
                        <div class="lt-info-card">
                            <div class="lt-info-head">Strategy Guide (Labouchere)</div>
                            <ul class="lt-info-list">
                                <li>Set a <b>Target</b> (Profit Goal).</li>
                                <li>The script splits this into a sequence.</li>
                                <li><b>Bet:</b> First + Last Number.</li>
                                <li><b>Win:</b> Numbers are crossed out.</li>
                                <li><b>Loss:</b> Bet is added to the end.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">Features</div>
                            <ul class="lt-info-list">
                                <li><b>Auto-Detect:</b> Detects Wins/Losses automatically.</li>
                                <li><b>Edit Mode:</b> Tap arrows to reorder numbers.</li>
                                <li><b>Multiplier:</b> Use K/M/B buttons for input.</li>
                                <li><b>Pot Scanner:</b> Infers bet from Pot Money.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">Controls</div>
                            <ul class="lt-info-list">
                                <li><b>Split:</b> Tap a number to split it.</li>
                                <li><b>Merge:</b> Select numbers to merge them.</li>
                                <li><b>Undo:</b> Reverts the last action.</li>
                                <li><b>Custom Bet:</b> Tap the purple box.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">Terms of Service</div>
                            <table class="lt-tos-table">
                                <tr><th>Item</th><th>Details</th></tr>
                                <tr><td>License</td><td>Free to use. Provided "as is".</td></tr>
                                <tr><td>Risk</td><td>Gambling involves financial risk.</td></tr>
                                <tr><td>Torn Rules</td><td>Helper tool, not automation.</td></tr>
                                <tr><td>Data</td><td>100% local. No external servers.</td></tr>
                            </table>
                        </div>
                    </div>
                    <button id="lt-btn-close-info" class="lt-btn lt-btn-action" style="margin-top:15px;">Close</button>
                </div>
                </div>`;
            container.insertBefore(div, container.firstChild);

            // Bind Multiplier Buttons
            ['1x','k','m','b'].forEach(k => {
                const btn = document.getElementById('lt-btn-mult-'+k);
                if(btn) btn.onclick = () => this.setMultiplier(k);
            });

            ['lt-inp-bankroll','lt-inp-risk','lt-inp-target','lt-inp-parts','lt-chk-integers','lt-chk-uniform'].forEach(id=>{
                const el=document.getElementById(id); if(el){ el.addEventListener('change',()=>this.saveSettingsFromUI()); el.addEventListener('input',()=>this.saveSettingsFromUI()); }
            });
            this.switchGenMode(this.savedSettings.mode);

            document.getElementById('lt-toggle-ui').onclick = () => { const c = document.getElementById('lt-content'); c.style.display = c.style.display === 'none' ? 'flex' : 'none'; };
            document.getElementById('lt-btn-debug').onclick = () => devTool.toggle();
            document.getElementById('lt-btn-win').onclick = () => engine.processWin();
            document.getElementById('lt-btn-loss').onclick = () => engine.processLoss();

            const closeAllPanels = () => {
                ['lt-gen-panel', 'lt-history-panel', 'lt-info-panel'].forEach(id => document.getElementById(id).classList.add('lt-hidden'));
            };

            document.getElementById('lt-btn-gen-show').onclick = () => {
                const p = document.getElementById('lt-gen-panel');
                const wasHidden = p.classList.contains('lt-hidden');
                closeAllPanels();
                if(wasHidden) { p.classList.remove('lt-hidden'); this.updateInputPreviews(); }
            };
            document.getElementById('lt-btn-show-history').onclick = () => {
                const p = document.getElementById('lt-history-panel');
                const wasHidden = p.classList.contains('lt-hidden');
                closeAllPanels();
                if(wasHidden) { p.classList.remove('lt-hidden'); this.renderHistory(); }
            };
            document.getElementById('lt-btn-info').onclick = () => {
                const p = document.getElementById('lt-info-panel');
                const wasHidden = p.classList.contains('lt-hidden');
                closeAllPanels();
                if(wasHidden) p.classList.remove('lt-hidden');
            };

            document.getElementById('lt-btn-close-hist').onclick = () => document.getElementById('lt-history-panel').classList.add('lt-hidden');
            document.getElementById('lt-btn-close-info').onclick = () => document.getElementById('lt-info-panel').classList.add('lt-hidden');

            document.getElementById('lt-tab-bankroll').onclick = () => this.switchGenMode('bankroll');
            document.getElementById('lt-tab-target').onclick = () => this.switchGenMode('target');
            document.getElementById('lt-btn-generate').onclick = () => this.handleGenerate();
            document.getElementById('lt-btn-reset-all').onclick = () => {
                this.showInputModal("Type 'RESET' to confirm", "", (val) => {
                    if (val && val.toUpperCase() === 'RESET') engine.resetData();
                });
            };

            const previewInputs = ['lt-inp-bankroll', 'lt-inp-risk', 'lt-inp-target', 'lt-inp-parts'];
            previewInputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => this.updatePreview());
                }
            });
            ['lt-chk-integers', 'lt-chk-uniform'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('change', () => this.updatePreview());
                }
            });
            document.getElementById('lt-btn-play-again').onclick = () => engine.restartGame();
            document.getElementById('lt-btn-new-random').onclick = () => this.handleGenerate();
            document.getElementById('lt-btn-shuffle').onclick = () => engine.shuffleSequence();
            document.getElementById('lt-btn-merge').onclick = () => {
                this.mergeMode = !this.mergeMode;
                this.editMode = false;
                this.selectedForMerge = [];
                this.update();
            };
            document.getElementById('lt-btn-edit').onclick = () => {
                this.editMode = !this.editMode;
                this.mergeMode = false;
                this.selectedForMerge = [];
                this.update();
            };
            document.getElementById('lt-btn-confirm-merge').onclick = () => { engine.mergeList(this.selectedForMerge); this.selectedForMerge=[]; this.mergeMode=false; this.update(); };
            document.getElementById('lt-btn-auto').onclick = () => engine.toggleAutoDetect();
            document.getElementById('lt-btn-undo').onclick = () => engine.undo();
            document.getElementById('lt-btn-reset-bet').onclick = () => {
                engine.resetBet();
                Utils.showToast('Bet Reset');
                this.update();
            };
            document.getElementById('lt-bet-box').onclick = () => {
                const currentCustom = engine.state.customBet;
                const expectedBet = engine.getEffectiveBet();

                let title = currentCustom !== null
                    ? `Custom: ${Utils.formatNumber(currentCustom)} (0 to clear)`
                    : `Expected: ${Utils.formatNumber(expectedBet)}`;

                this.showInputModal(title, currentCustom || expectedBet, (val) => {
                    if(val !== null) {
                        const v = parseFloat(val);
                        if(!isNaN(v) && v > 0) {
                            engine.setCustomBet(v);
                            Utils.showToast(`Custom Bet: ${Utils.formatNumber(v)}`);
                        } else if(v === 0) {
                            engine.clearCustomBet();
                            Utils.showToast("Custom Bet Cleared");
                        }
                    }
                });
            };
            this.update();
        }

        switchGenMode(mode) {
            this.genMode = mode; this.saveSettingsFromUI();
            const b = document.getElementById('lt-mode-bankroll'); const t = document.getElementById('lt-mode-target');
            const tb = document.getElementById('lt-tab-bankroll'); const tt = document.getElementById('lt-tab-target');
            if(mode==='bankroll'){ b.classList.remove('lt-hidden'); t.classList.add('lt-hidden'); tb.classList.add('active'); tt.classList.remove('active'); }
            else { b.classList.add('lt-hidden'); t.classList.remove('lt-hidden'); tb.classList.remove('active'); tt.classList.add('active'); }
            this.updateInputPreviews();
            this.updatePreview();
        }

        updatePreview() {
            const preview = document.getElementById('lt-gen-preview');
            const statsEl = document.getElementById('lt-gen-preview-stats');
            const seqEl = document.getElementById('lt-gen-preview-seq');

            if (!preview || !statsEl || !seqEl) return;

            try {
                const parts = parseInt(document.getElementById('lt-inp-parts')?.value) || 10;
                const useIntegers = document.getElementById('lt-chk-integers')?.checked || false;
                const uniform = document.getElementById('lt-chk-uniform')?.checked || false;

                let target = 0;
                let errorMsg = null;

                if (this.genMode === 'bankroll') {
                    const bankroll = parseFloat(document.getElementById('lt-inp-bankroll')?.value) || 0;
                    const risk = parseFloat(document.getElementById('lt-inp-risk')?.value) || 0;

                    if (bankroll > 0 && risk > 0) {
                        target = bankroll * (risk / 100);
                    } else {
                        errorMsg = bankroll <= 0 ? 'Enter Bankroll' : 'Enter Risk %';
                    }
                } else {
                    target = parseFloat(document.getElementById('lt-inp-target')?.value) || 0;
                    if (target <= 0) {
                        errorMsg = 'Enter Target';
                    }
                }

                if (errorMsg || target <= 0 || parts <= 0) {
                    preview.style.display = 'none';
                    return;
                }

                const previewSeq = Utils.generateSequence(target, parts, uniform, useIntegers);
                const actualSum = previewSeq.reduce((a, b) => a + b, 0);
                const deviation = Math.abs(actualSum - target);
                const deviationPercent = ((deviation / target) * 100).toFixed(2);

                statsEl.innerHTML = `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <div><span style="color:#94a3b8;">Target:</span> <b style="color:#fff;">${Utils.formatNumber(target)}</b></div>
                        <div><span style="color:#94a3b8;">Parts:</span> <b style="color:#fff;">${parts}</b></div>
                        <div><span style="color:#94a3b8;">Actual:</span> <b style="color:${deviation < 1 ? '#4ade80' : '#fbbf24'};">${Utils.formatNumber(actualSum)}</b></div>
                        <div><span style="color:#94a3b8;">Dev:</span> <b style="color:${deviation < 1 ? '#4ade80' : deviation < 10 ? '#fbbf24' : '#f87171'};">${deviationPercent}%</b></div>
                    </div>
                `;

                seqEl.innerHTML = previewSeq.map(val =>
                    `<span style="background:#1e293b;border:1px solid rgba(124,58,237,0.3);padding:4px 8px;border-radius:4px;font-size:11px;color:#cbd5e1;font-family:monospace;">${val}</span>`
                ).join('');

                preview.style.display = 'block';

            } catch(e) {
                Logger.error('Preview', `Failed: ${e.message}`);
                preview.style.display = 'none';
            }
        }
        handleGenerate() {
            try {
                const partsInput = document.getElementById('lt-inp-parts');
                const integersInput = document.getElementById('lt-chk-integers');
                const uniformInput = document.getElementById('lt-chk-uniform');
                const bankrollInput = document.getElementById('lt-inp-bankroll');
                const riskInput = document.getElementById('lt-inp-risk');
                const targetInput = document.getElementById('lt-inp-target');

                const parts = parseInt(partsInput ? partsInput.value : 10) || 10;
                const useIntegers = integersInput ? integersInput.checked : false;
                const uniform = uniformInput ? uniformInput.checked : false;

                let target = 0;
                if (this.genMode === 'bankroll') {
                    const bankroll = parseFloat(bankrollInput ? bankrollInput.value : 0);
                    const risk = parseFloat(riskInput ? riskInput.value : 0);
                    if (bankroll > 0 && risk > 0) target = bankroll * (risk / 100);
                    else {
                        Utils.showToast("Enter Bankroll & Risk");
                        if(bankrollInput) bankrollInput.classList.add('error');
                        setTimeout(()=>bankrollInput?.classList.remove('error'), 1000);
                        return;
                    }
                } else {
                    target = parseFloat(targetInput ? targetInput.value : 0);
                    if (!target || target <= 0) {
                        Utils.showToast("Enter Target");
                        if(targetInput) targetInput.classList.add('error');
                        setTimeout(()=>targetInput?.classList.remove('error'), 1000);
                        return;
                    }
                }

                if(target > 0) {
                    engine.generateNew(target, parts, uniform, useIntegers);
                    document.getElementById('lt-gen-panel').classList.add('lt-hidden');
                }
            } catch(e) { console.error("Gen Error:", e); Utils.showToast("Gen Error"); }
        }
        renderHistory() {
            const l = document.getElementById('lt-history-list'); if(!l) return; l.innerHTML='';
            const h = engine.state.roundHistory;
            if(!h||!h.length) { l.innerHTML='<div style="text-align:center;color:#666;">No rounds</div>'; return; }
            h.forEach(r => {
                const div = document.createElement('div');
                div.className = `lt-history-item ${r.result==='WIN'?'lt-history-win':'lt-history-loss'}`;
                div.innerHTML = `<span style="color:#888">${new Date(r.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span><span class="lt-hist-badge ${r.result==='WIN'?'lt-hist-win-bg':'lt-hist-loss-bg'}">${r.result}</span><b>$${Utils.formatNumber(r.bet)}</b><span style="color:${r.profit>=0?'#4ade80':'#f87171'}">${r.profit>0?'+':''}${Utils.formatNumber(r.profit)}</span>`;
                l.appendChild(div);
            });
        }
        update() {
            try {
                if(!document.getElementById('lt-bet-display')) { this.updateExternalButtons(); return; }
                const s = engine.state; const bet = engine.getEffectiveBet();

                const mult = this.savedSettings.multVal || 1;
                const totalProfitVal = s.totalProfit * mult;

                const bd = document.getElementById('lt-bet-display'); const bb = document.getElementById('lt-bet-box');
                bd.innerText = Utils.formatNumber(bet);
                if(s.customBet!==null) { bd.classList.add('override'); bb.classList.add('override'); } else { bd.classList.remove('override'); bb.classList.remove('override'); }

                const ab = document.getElementById('lt-btn-auto');
                if(s.autoDetect) { ab.innerText="Auto: ON"; ab.classList.add('active'); } else { ab.innerText="Auto: OFF"; ab.classList.remove('active'); }

                const rawSum = s.sequence.reduce((a,b) => a + (b.value || 0), 0);
                document.getElementById('lt-rem-val').innerText = Utils.formatNumber(rawSum * mult);

                document.getElementById('lt-prof-val').innerText = Utils.formatNumber(totalProfitVal);
                document.getElementById('lt-prof-val').style.color = totalProfitVal>=0?'#4ade80':'#f87171';

                let streak = 0; let streakType = '';
                if(s.roundHistory.length > 0) {
                    streakType = s.roundHistory[0].result;
                    for(let i=0; i<s.roundHistory.length; i++) {
                        if(s.roundHistory[i].result === streakType) streak++;
                        else break;
                    }
                }
                const wins = s.roundHistory.filter(r=>r.result==='WIN').length;
                const rate = s.roundHistory.length > 0 ? Math.round((wins / s.roundHistory.length)*100) : 0;

                const rv = document.getElementById('lt-rounds-val');
                if(rv) rv.innerText = s.roundCount || 0;

                const sv = document.getElementById('lt-streak-val');
                sv.innerText = streak > 0 ? `${streak} ${streakType}` : '0';
                sv.style.color = streakType === 'WIN' ? '#4ade80' : (streakType === 'LOSS' ? '#f87171' : '#e2e8f0');

                const wr = document.getElementById('lt-winrate-val');
                wr.innerText = `${rate}%`;
                wr.style.color = rate >= 50 ? '#4ade80' : '#e2e8f0';

                const mb = document.getElementById('lt-btn-confirm-merge');
                const mt = document.getElementById('lt-btn-merge');
                const et = document.getElementById('lt-btn-edit');
                if(this.mergeMode) mt.classList.add('lt-btn-active'); else mt.classList.remove('lt-btn-active');
                if(this.editMode) et.classList.add('lt-btn-active'); else et.classList.remove('lt-btn-active');
                if(this.mergeMode && this.selectedForMerge.length>=2) { mb.classList.remove('lt-hidden'); mb.innerText=`Confirm (${this.selectedForMerge.length})`; } else mb.classList.add('lt-hidden');

                const cont = document.getElementById('lt-sequence'); const pa = document.getElementById('lt-play-again-container');
                if(s.sequence.length===0 && s.roundCount>0) { cont.style.display='none'; pa.style.display='flex'; }
                else {
                    cont.style.display='flex'; pa.style.display='none'; cont.innerHTML='';
                    if(s.sequence.length===0) cont.innerHTML='<div style="color:#666;font-size:12px">New Game</div>';
                    else s.sequence.forEach((item,idx) => {

                        // PDA: Edit Mode with arrows
                        if (this.editMode) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'lt-badge-edit-wrapper';

                            // Left arrow
                            if (idx > 0) {
                                const leftBtn = document.createElement('div');
                                leftBtn.className = 'lt-badge-arrow';
                                leftBtn.innerText = '<';
                                leftBtn.onclick = () => { engine.moveItem(idx, 'left'); this.update(); };
                                wrapper.appendChild(leftBtn);
                            }

                            // Badge
                            const badge = document.createElement('div');
                            badge.className = 'lt-badge';
                            badge.innerText = Utils.formatNumber(item.value);
                            wrapper.appendChild(badge);

                            // Right arrow
                            if (idx < s.sequence.length - 1) {
                                const rightBtn = document.createElement('div');
                                rightBtn.className = 'lt-badge-arrow';
                                rightBtn.innerText = '>';
                                rightBtn.onclick = () => { engine.moveItem(idx, 'right'); this.update(); };
                                wrapper.appendChild(rightBtn);
                            }

                            cont.appendChild(wrapper);
                        } else {
                            // Normal mode
                            const el=document.createElement('div'); el.className='lt-badge';
                            if(!this.mergeMode && (idx===0||idx===s.sequence.length-1)) { el.style.borderColor='#22c55e'; el.style.color='#4ade80'; }
                            if(this.mergeMode && this.selectedForMerge.includes(idx)) el.classList.add('selected');

                            el.innerText = Utils.formatNumber(item.value);

                            // CLICK HANDLER
                            if(!this.mergeMode) {
                                el.onclick=()=>{
                                    this.showInputModal(`Split ${Utils.formatNumber(item.value)}`, Math.floor(item.value/2), (val) => {
                                        if(val){
                                            const n=parseFloat(val);
                                            if(n>0 && n<item.value) engine.splitItem(idx,n);
                                        }
                                    });
                                };
                            } else {
                                el.onclick=()=>{ if(this.selectedForMerge.includes(idx)) this.selectedForMerge=this.selectedForMerge.filter(i=>i!==idx); else this.selectedForMerge.push(idx); this.update(); };
                            }

                            cont.appendChild(el);
                        }
                    });
                }
                if(!document.getElementById('lt-history-panel').classList.contains('lt-hidden')) this.renderHistory();
                this.updateExternalButtons();
            } catch(e) { console.error("Update Err", e); }
        }
        updateStatus(text, color) { const el = document.getElementById('lt-status-bar'); if(el) { el.innerText = text; el.style.color = color; } }
        updateExternalButtons() {
            const amt = engine.getEffectiveBet();
            const b1 = document.getElementById('lt-trade-btn-1'); const b2 = document.getElementById('lt-trade-btn-2');
            if(b1 && b2) {
                if(amt>0) { b1.innerText=`- ${Utils.formatNumber(amt)}`; b2.innerText=`-${Utils.formatNumber(amt+20)} +20`; b1.disabled=false; b2.disabled=false; }
                else { b1.innerText="Done"; b2.innerText="Done"; b1.disabled=true; b2.disabled=true; }
            }
            const fb = document.getElementById('lt-fill-btn'); if(fb) fb.innerText=amt>0?`${Utils.formatNumber(amt)}`:"OK";
        }
    }

    // --- INTEGRATION ---
    class TornIntegration {
        constructor() {
            this.isRR = false; this.myId = this.getMyId();
            this.isArmed = false; this.lastManualBet = null;
            this.hospitalLock = 0;
            this.isProcessing = false;
            this.lockResults = false;

            this.lastProcessedWinner = null;
            this.lastProcessedTime = 0;

            this.lastProcessedDomText = null;
            this.lastProcessedDomTime = 0;
            this.pendingDomProcess = false;

            window.LabTrackIntegration = this;

            this.installNetworkHooks();

            this.hospitalObserver = new MutationObserver((mutations) => {
                const isRelevant = mutations.some(m => {
                    return m.target?.id !== 'lt-hospital-overlay' &&
                           (!m.target?.parentElement || m.target?.parentElement?.id !== 'lt-hospital-overlay');
                });
                if (isRelevant) this.checkHospitalStatus();
            });

            console.log(`[LabTrack] Init - User ID: ${this.myId}`);
            devTool.log('net', "INIT", `UserID: ${this.myId}`);
        }
        getMyId() {
            try {
                const m = document.cookie.match(/uid=(\d+)/);
                return m ? parseInt(m[1], 10) : this.findIdInDOM();
            } catch(e) {
                return this.findIdInDOM();
            }
        }
        findIdInDOM() {
            try {
                const sidebarLink = document.querySelector('a[href*="profiles.php?XID="]');
                if (sidebarLink) {
                     const m = sidebarLink.href.match(/XID=(\d+)/);
                     if (m) return parseInt(m[1], 10);
                }
            } catch(e) {}
            return null;
        }
        setUI(ui) { this.ui = ui; }

        start() {
            if(document.body) {
                this.hospitalObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
            }
            setInterval(() => {
                const href = window.location.href;
                this.checkHospitalStatus();
                this.checkRoute();
                this.scanPotMoney();

                if (href.includes('sid=russianRoulette') && !href.includes('/game')) {
                    if (!this.isArmed) { this.isArmed = true; }
                }
                if(href.includes('russianRoulette')) { this.isRR=true; this.initDOMButtons(); } else this.isRR=false;
                if(href.includes('trade.php')) this.initTrade();
            }, CONFIG.POLL_MS);
        }

        scanPotMoney() {
            if (this.lockResults || !this.isRR) return;

            try {
                const spans = document.querySelectorAll('span');
                let potLabel = null;
                for(let i=0; i<spans.length; i++) {
                    if(spans[i]?.innerText === "POT MONEY:") {
                        potLabel = spans[i];
                        break;
                    }
                }

                if (potLabel && potLabel.nextElementSibling) {
                    const valText = potLabel.nextElementSibling.innerText;
                    const val = parseFloat(valText.replace(/[^0-9.]/g, ''));

                    if (!isNaN(val) && val > 0) {
                        if (engine.pendingBet === null) {
                             engine.setPendingBet(val / 2);
                        }
                    }
                }
            } catch(e) {}
        }

        checkRoute() {
             const hash = window.location.hash;
             if ((hash === '' || hash === '#/') && window.location.href.includes('sid=russianRoulette')) {
                 if (this.lockResults) {
                     this.lockResults = false;
                     this.lastProcessedWinner = null;
                     this.lastProcessedTime = 0;
                     this.lastSeenWinnerId = null;
                     this.lastSeenWinnerTime = 0;
                     this._winnerLock = null;
                     this.lastProcessedDomText = null;
                     this.lastProcessedDomTime = 0;
                     this.pendingDomProcess = false;
                     devTool.log('net', "RESET", "Lobby detected. Unlocked.");
                     if (this.ui) this.ui.updateStatus("READY", "#4ade80");
                 }
             } else if (hash.includes('/game')) {
                 if (this.lockResults && this.ui) {
                     this.ui.updateStatus("LOCKED (RETURN TO LOBBY)", "#f87171");
                 } else if (this.ui) {
                     this.ui.updateStatus("GAME IN PROGRESS", "#fbbf24");
                 }
             }
        }

        checkHospitalNetwork(text) {
             if(text.includes('"status":"hospital"') || text.includes('"state":"Hospital"')) {
                 if(this.ui) this.ui.toggleHospital(true);
             }
             else if(text.includes('"status":"okay"') || text.includes('"state":"Okay"') || (text.includes('success":true') && text.includes('You used'))) {
                 this.hospitalLock = 0;
                 if(this.ui) this.ui.toggleHospital(false);
             }
        }

        checkHospitalStatus() {
            const bodyHosp = document.body.classList.contains('hospital');
            const hospLink = document.querySelector("a[aria-label^='Hospital']");
            let sidebarHosp = false;
            if (hospLink) {
                if (!hospLink.closest('#mainContainer') && !hospLink.closest('.content-wrapper')) {
                    sidebarHosp = true;
                }
            }
            const hospIcon = document.querySelector(".sidebar-menu-hospital");
            if (bodyHosp || sidebarHosp || hospIcon) {
                if(this.ui) this.ui.toggleHospital(true);
            } else {
                if (!bodyHosp && Date.now() > this.hospitalLock) {
                    if(this.ui) this.ui.toggleHospital(false);
                }
            }
        }

        handleDomMessage(text) {
            if (!engine.state.autoDetect || this.lockResults || this.isProcessing) return;

            const lower = text.toLowerCase();
            let outcome = 'none';

            if (lower.includes("waiting") || lower.includes("sound on") || lower.includes("pot money")) return;

            if (lower.includes("you take your winnings")) {
                outcome = 'win';
            }
            else if ((lower.includes("you") && lower.includes("fall down")) || lower.includes("you missed") || lower.includes("shot himself")) {
                outcome = 'loss';
            }

            if (outcome !== 'none') {
                const now = Date.now();
                const textKey = `${outcome}_${lower.substring(0, 30)}`;
                if (this.lastProcessedDomText === textKey && (now - this.lastProcessedDomTime < 3000)) {
                    devTool.log('dom', 'SKIP', `Duplicate DOM message: ${outcome}`);
                    return;
                }

                this.isProcessing = true;
                this.lockResults = true;

                this.lastProcessedDomText = textKey;
                this.lastProcessedDomTime = now;

                devTool.log('dom', 'TRIGGER', `Result detected: ${outcome}`);
                this.triggerResult(outcome, 0);
            }
        }

        triggerResult(outcome, stake) {
            if (!this.lockResults || !this.isProcessing) {
                devTool.log('net', 'ERROR', 'triggerResult called without locks set!');
                this.isProcessing = true;
                this.lockResults = true;
            }

            let finalStake = stake;
            if (!finalStake) finalStake = engine.pendingBet || engine.getEffectiveBet();

            if (outcome === 'win') {
                engine.processWin();
                if(this.ui) {
                    this.ui.flash('win');
                    Utils.showToast(`WIN: ${Utils.formatNumber(finalStake)}`);
                    this.hospitalLock = 0;
                    this.ui.toggleHospital(false);
                }
                devTool.log('net', "RESULT", "WIN processed. Locked.");
            } else if (outcome === 'loss') {
                engine.processLoss(finalStake);
                if(this.ui) {
                    this.ui.flash('loss');
                    Utils.showToast(`LOSS: ${Utils.formatNumber(finalStake)}`);
                    this.ui.toggleHospital(true);
                    this.hospitalLock = Date.now() + CONFIG.HOSPITAL_LOCK_MS;
                }
                devTool.log('net', "RESULT", "LOSS processed. Locked.");
            }

            this.isArmed = false;
            this.lastManualBet = null;
            if(this.ui) this.ui.update();

            setTimeout(() => { this.isProcessing = false; }, 500);
        }

        installNetworkHooks() {
            const win = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window); const self = this;
            const origSend = win.XMLHttpRequest.prototype.send;
            win.XMLHttpRequest.prototype.send = function(body) {
                if(typeof body==='string' && (body.includes('sid=russianRouletteData')||window.location.href.includes('russianRoulette'))) {
                    devTool.log('net', "POST", body.substring(0, 50));

                    const m = body.match(/amount=(\d+)/);
                    if(m) engine.setPendingBet(parseInt(m[1]));
                }
                this.addEventListener('load', function() {
                    if((this.responseType===''||this.responseType==='text') && this.responseText) {
                        if(self.isRR) self.scanTextForResults(this.responseText);
                        self.checkHospitalNetwork(this.responseText);
                    }
                });
                return origSend.apply(this, arguments);
            };
            const origFetch = win.fetch;
            win.fetch = async function(...args) {
                const url = args[0] ? args[0].toString() : "";
                try {
                    if(self.isRR && url.includes('russianRouletteData') && args[1]?.body) {
                        const bodyStr = args[1].body.toString();
                        devTool.log('net', "FETCH", bodyStr.substring(0, 50));
                        const m = bodyStr.match(/amount=(\d+)/);
                        if(m) engine.setPendingBet(parseInt(m[1]));
                    }
                } catch(e) {}

                try {
                    const res = await origFetch.apply(this, args);
                    try {
                        const c = res.clone();
                        c.text().then(t => {
                            if(url.includes('russianRouletteData')) self.scanTextForResults(t);
                            self.checkHospitalNetwork(t);
                        }).catch(e => devTool.log('net', "ERR", "Fetch read failed: " + e.message));
                    } catch(e) {
                        devTool.log('net', "ERR", "Clone failed: " + e.message);
                    }
                    return res;
                } catch(e) {
                    throw e; // Propagate original fetch errors
                }
            };
            const OrigWS = win.WebSocket;
            win.WebSocket = function(...args) {
                const ws = new OrigWS(...args);
                ws.addEventListener('message', e => { if(typeof e.data==='string') self.scanTextForResults(e.data); });
                return ws;
            };
            win.WebSocket.prototype = OrigWS.prototype; Object.assign(win.WebSocket, OrigWS);
        }
        scanTextForResults(text) {
            if (!engine.state.autoDetect) return;
            if (this.lockResults || this.isProcessing) return;

            if(!text || text.length<10 || text.indexOf('winner')===-1) return;

            const winnerMatch = text.match(/"winner"\s*:\s*"?(\d+)"?/);
            if(!winnerMatch) return;
            const winnerId = parseInt(winnerMatch[1], 10);
            if(winnerId===0) return;

            const prevLock = this._winnerLock;
            this._winnerLock = winnerId;
            if (prevLock === winnerId) {
                return;
            }

            const now = Date.now();
            if (this.lastSeenWinnerId === winnerId && (now - this.lastSeenWinnerTime < 5000)) {
                this._winnerLock = null;
                return;
            }
            this.lastSeenWinnerId = winnerId;
            this.lastSeenWinnerTime = now;

            if(!this.myId) this.myId = this.getMyId();
            if(!this.myId) { this._winnerLock = null; return; }

            try {
                devTool.log('net', "NET", `Winner found: ${winnerId}`);

                let outcome = 'none';
                if(winnerId === this.myId) {
                    outcome = 'win';
                } else {
                    const participationRegex = new RegExp(`"userID"\\s*:\\s*"?${this.myId}"?`);
                    const regexMatch = participationRegex.test(text);
                    const hasPendingBet = engine.pendingBet !== null;
                    const hasRecentManualBet = this.lastManualBet && (Date.now() - this.lastManualBet.time < 30000);

                    devTool.log('net', "CHECK", `Regex: ${regexMatch}, Pending: ${hasPendingBet}, Manual: ${hasRecentManualBet}`);

                    if (regexMatch || hasPendingBet || hasRecentManualBet) {
                        outcome = 'loss';
                    }
                }

                if (outcome !== 'none') {
                    if (this.lockResults || this.isProcessing) {
                        devTool.log('net', 'SKIP', 'Already locked by DOM detection');
                        return;
                    }

                    this.isProcessing = true;
                    this.lockResults = true;

                    this.lastProcessedWinner = winnerId;
                    this.lastProcessedTime = Date.now();

                    let val=0, isPot=false;
                    const mm = text.match(/"(pot_amount|betAmount|amount|money)"\s*:\s*"?(\d+(\.\d+)?)"?/);
                    if(mm) { val=parseFloat(mm[2]); if(mm[1]==='pot_amount') isPot=true; }
                    let netStake = isPot ? val/2 : val;

                    this.triggerResult(outcome, netStake);
                } else {
                     devTool.log('net', "IGNORE", "Spectator / Not Involved");
                     this._winnerLock = null;
                }

            } catch(e) {
                console.error("[LabTrack] Scan Err", e);
                devTool.log('net', "ERR", e.message);
                this.isProcessing = false;
                this._winnerLock = null;
            }
        }
        initDOMButtons() {
            const inp = document.querySelector('input[aria-label="Money value"]');
            if(inp && !inp.hasAttribute('data-lt')) {
                inp.setAttribute('data-lt','1');

                const capture = (e) => {
                    const v = parseFloat(e.target.value.replace(/[^0-9.]/g,''));
                    if(!isNaN(v) && v > 0) {
                        this.lastManualBet = { amount: v, time: Date.now() };

                        const expectedBet = engine.getEffectiveBet();
                        const tolerance = 1;

                        if (Math.abs(v - expectedBet) > tolerance) {
                            Logger.info('CustomBet', `Auto-detected: ${v} (Expected: ${expectedBet})`);
                            engine.setCustomBet(v);
                            Utils.showToast(`Custom Bet: ${Utils.formatNumber(v)}`);
                            if(this.ui) this.ui.update();
                        }
                    }
                };
                inp.addEventListener('input', capture);
                inp.addEventListener('keyup', capture);
                inp.addEventListener('change', capture);
            }
            if(inp && !document.getElementById('lt-fill-btn')) {
                const btn = document.createElement("button"); btn.id="lt-fill-btn"; btn.innerText="Fill";
                btn.style.cssText="margin-left:5px;background:#6d28d9;color:#fff;border:none;border-radius:4px;padding:0 15px;height:44px;font-weight:bold;min-width:60px;";
                btn.onclick = (e) => { e.preventDefault(); const v=engine.getEffectiveBet(); if(v>0){ Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set.call(inp,Math.floor(v)); inp.dispatchEvent(new Event('input',{bubbles:true})); } };
                if(inp.parentNode) inp.parentNode.appendChild(btn);
                if(this.ui) this.ui.update();
            }
        }
        initTrade() {
            const inp = document.querySelector(".user-id.input-money");
            if(!inp || document.getElementById('lt-trade-pnl')) return;
            const p = document.createElement('div'); p.id='lt-trade-pnl'; p.style.cssText="margin-top:5px;display:flex;gap:5px;width:100%";
            const mkBtn=(t,fn)=>{const b=document.createElement('button');b.innerText=t;b.style.cssText="flex:1;background:#242424;color:#888;padding:12px;border:1px solid #444;border-radius:4px;font-size:12px;min-height:44px;";b.onclick=e=>{e.preventDefault();fn();};return b;};
            const setV=v=>{ let c=parseInt(inp.value.replace(/[^0-9]/g,''))||0; Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set.call(inp,Math.max(0,c-v)); inp.dispatchEvent(new Event('input',{bubbles:true})); };
            p.appendChild(mkBtn("Wait...",()=>setV(engine.getEffectiveBet()))); p.appendChild(mkBtn("Wait...",()=>setV(engine.getEffectiveBet()+20)));
            p.firstChild.id="lt-trade-btn-1"; p.lastChild.id="lt-trade-btn-2";
            if(inp.parentNode.classList.contains("input-money-group")) inp.parentNode.parentNode.insertBefore(p,inp.parentNode.nextSibling); else inp.parentNode.insertBefore(p,inp.nextSibling);
            if(this.ui) this.ui.updateExternalButtons();
        }
    }

    // =============================================================================
    // INITIALIZATION - PDA VERSION
    // =============================================================================
    Logger.info('INIT', `LabTrack PDA v${CONFIG.VERSION} starting...`);

    const integration = new TornIntegration();

    // PDA: Wait for DOM ready instead of document-start polling
    const initApp = () => {
        const ui = new OverlayUI();
        ui.init();
        integration.setUI(ui);
        integration.start();
        Logger.info('INIT', 'LabTrack PDA initialization complete');
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initApp();
    } else {
        document.addEventListener('DOMContentLoaded', initApp);
    }

    window.ltDevTool = devTool;
})();
